"""
AI Routes — API endpoints for YouTube → Recipe generation.

Endpoints:
  POST /ai/generate       → Submit YouTube URL, start extraction
  GET  /ai/jobs/{job_id}  → Check job status + get result
  GET  /ai/jobs           → List user's past generation jobs
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database.connection import get_db
from auth import get_current_user
from database.models.user import User
from database.models.ai_job import AIJob, AIJobStatus
from database.models.recipe import Recipe, SourceType, RecipeStatus, VisibilityType
from database.models.ingredient import Ingredient
from database.models.recipe_ingredient import RecipeIngredient
from database.models.recipe_step import RecipeStep
from schemas.ai_schema import GenerateRequest, AIJobResponse
from services.youtube_service import validate_youtube_url, collect_video_data
from services.ai_service import extract_recipe
import uuid


router = APIRouter(prefix="/ai", tags=["AI Recipe Generation"])


# ─── Background Task ───────────────────────────────────────────────
# This function runs AFTER we return the job_id to the user.
# It does the heavy lifting: YouTube → Groq → Database.

def process_ai_job(job_id: str, youtube_url: str, user_id: str):
    """
    The background worker that:
    1. Fetches transcript + metadata from YouTube
    2. Sends everything to Groq AI (Llama 3)
    3. Creates a recipe draft in the database
    4. Updates the AI job status
    
    This runs in the background so the user doesn't wait 15-30 seconds.
    """
    # We need a fresh database session for the background task
    from database.connection import SessionLocal
    db = SessionLocal()
    
    try:
        job = db.query(AIJob).filter(AIJob.id == job_id).first()
        if not job:
            return
        
        # ── Step 1: Collect data from YouTube ──
        video_data = collect_video_data(youtube_url)
        
        # Save the collected data to the job (for debugging & display)
        job.video_title = video_data["title"]
        job.video_description = video_data["description"]
        job.video_thumbnail = video_data["thumbnail"]
        job.video_duration_seconds = video_data["duration"]
        job.transcript = video_data["transcript"]
        db.commit()
        
        # ── Step 2: Send to Groq AI ──
        extracted = extract_recipe(
            title=video_data["title"],
            description=video_data["description"],
            transcript=video_data["transcript"],
        )
        
        # Save the raw AI response for debugging
        job.raw_ai_response = extracted.model_dump_json()
        db.commit()
        
        # ── Step 3: Create the Recipe Draft ──
        new_recipe = Recipe(
            id=str(uuid.uuid4()),
            creator_id=user_id,
            title=extracted.title,
            source_type=SourceType.youtube_ai,
            status=RecipeStatus.draft,
            visibility=VisibilityType.private,
            servings=extracted.servings,
            prep_time_minutes=extracted.prep_time_minutes,
            cook_time_minutes=extracted.cook_time_minutes,
            confidence_score=extracted.title_confidence,
            youtube_url=youtube_url,
            field_confidence={
                "title": extracted.title_confidence,
                "servings": extracted.servings_confidence,
                "prep_time": extracted.prep_time_confidence,
                "cook_time": extracted.cook_time_confidence,
                "cuisine": extracted.cuisine_confidence,
            },
        )
        db.add(new_recipe)
        db.commit()
        
        # ── Step 4: Create Ingredients ──
        for ing in extracted.ingredients:
            # Find or create the canonical ingredient
            canonical = db.query(Ingredient).filter(
                Ingredient.name == ing.name
            ).first()
            
            if not canonical:
                canonical = Ingredient(
                    id=str(uuid.uuid4()),
                    name=ing.name,
                )
                db.add(canonical)
                db.commit()
                db.refresh(canonical)
            
            # Create the recipe-ingredient link with confidence
            recipe_ing = RecipeIngredient(
                id=str(uuid.uuid4()),
                recipe_id=new_recipe.id,
                ingredient_id=canonical.id,
                quantity=ing.quantity,
                unit=ing.unit,
                preparation_note=ing.preparation_note,
                confidence={
                    "name": ing.name_confidence,
                    "quantity": ing.quantity_confidence,
                    "unit": ing.unit_confidence,
                },
                ai_note="to taste" if ing.quantity is None else None,
            )
            db.add(recipe_ing)
        
        db.commit()
        
        # ── Step 5: Create Steps ──
        for i, step in enumerate(extracted.steps):
            recipe_step = RecipeStep(
                id=str(uuid.uuid4()),
                recipe_id=new_recipe.id,
                step_number=i + 1,
                instruction=step.instruction,
                estimated_time_minutes=step.estimated_time_minutes,
                confidence={
                    "instruction": step.instruction_confidence,
                    "time": step.time_confidence,
                },
            )
            db.add(recipe_step)
        
        db.commit()
        
        # ── Step 6: Mark job as completed ──
        job.recipe_id = new_recipe.id
        job.confidence_score = extracted.title_confidence
        job.status = AIJobStatus.completed
        db.commit()
        
    except ValueError as e:
        # Known errors (invalid URL, no transcript, video too long)
        job = db.query(AIJob).filter(AIJob.id == job_id).first()
        if job:
            job.status = AIJobStatus.failed
            job.error_message = str(e)
            db.commit()
    except Exception as e:
        # Unexpected errors (API failure, network issues)
        job = db.query(AIJob).filter(AIJob.id == job_id).first()
        if job:
            job.status = AIJobStatus.failed
            job.error_message = f"Unexpected error: {str(e)}"
            db.commit()
    finally:
        db.close()


# ─── API Endpoints ─────────────────────────────────────────────────

@router.post("/generate", status_code=202)
def generate_recipe_from_video(
    request: GenerateRequest,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit a YouTube URL to generate a recipe.
    
    Returns a job_id immediately (202 Accepted).
    The actual processing happens in the background.
    Use GET /ai/jobs/{job_id} to check the status.
    """
    # Quick validation before creating the job
    try:
        validate_youtube_url(request.youtube_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    try:
        # Create the AI job
        job = AIJob(
            id=str(uuid.uuid4()),
            user_id=user.id,
            youtube_url=request.youtube_url,
            status=AIJobStatus.processing,
        )
        db.add(job)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    # Start the heavy work in the background
    background_tasks.add_task(
        process_ai_job,
        job_id=job.id,
        youtube_url=request.youtube_url,
        user_id=str(user.id),
    )
    
    return {"job_id": job.id, "status": "processing"}


@router.get("/jobs/{job_id}")
def get_job_status(
    job_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Check the status of an AI generation job.
    
    Returns the job status, and the recipe_id when completed.
    Only the job owner can check their own jobs.
    """
    job = db.query(AIJob).filter(AIJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if str(job.user_id) != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this job")
    
    return AIJobResponse(
        job_id=job.id,
        status=job.status.value,
        error_message=job.error_message,
        video_title=job.video_title,
        video_thumbnail=job.video_thumbnail,
        recipe_id=job.recipe_id,
    )


@router.get("/jobs")
def list_user_jobs(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all AI generation jobs for the current user.
    Ordered by most recent first.
    """
    jobs = db.query(AIJob).filter(
        AIJob.user_id == user.id
    ).order_by(AIJob.created_at.desc()).all()
    
    return {
        "jobs": [
            AIJobResponse(
                job_id=job.id,
                status=job.status.value,
                error_message=job.error_message,
                video_title=job.video_title,
                video_thumbnail=job.video_thumbnail,
                recipe_id=job.recipe_id,
            )
            for job in jobs
        ]
    }
