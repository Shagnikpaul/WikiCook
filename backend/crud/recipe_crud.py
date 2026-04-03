from sqlalchemy.orm import Session, joinedload
from database.models.recipe import Recipe, RecipeStatus, VisibilityType
from database.models.recipe_ingredient import RecipeIngredient
from database.models.recipe_step import RecipeStep
from database.models.recipe_step_media import RecipeStepMedia, MediaType
from database.models.tag import Tag, TagType
from fastapi import HTTPException
from typing import Optional

def get_recipes(db: Session, diet: Optional[str] = None, cuisine: Optional[str] = None, max_time: Optional[int] = None, sort: Optional[str] = None):
    """
    Fetch a list of recipes with optional filtering.
    """
    query = db.query(Recipe).options(joinedload(Recipe.tags), joinedload(Recipe.steps).joinedload("media"))
    
    # We apply eager loading for tags and media to get the thumbnail and tags efficiently.
    
    if diet or cuisine:
        query = query.join(Recipe.tags)
        
    if diet:
        query = query.filter(Tag.name == diet, Tag.tag_type == TagType.diet)
        
    if cuisine:
        query = query.filter(Tag.name == cuisine, Tag.tag_type == TagType.cuisine)
        
    if max_time:
        # sum of prep and cook time
        query = query.filter((Recipe.prep_time_minutes + Recipe.cook_time_minutes) <= max_time)
        
    if sort == "verified":
        query = query.filter(Recipe.status == "verified")
        # You could add ordering here too
        
    recipes = query.all()
    
    result_list = []
    for r in recipes:
        # Extract thumbnail (first image in the first step if available)
        thumbnail = None
        for step in r.steps:
            if step.media and len(step.media) > 0:
                thumbnail = step.media[0].media_url
                break
                
        result_list.append({
            "id": r.id,
            "title": r.title,
            "rating": 4.6, # Placeholder for now, could be calculated from reviews
            "status": r.status,
            "source_type": r.source_type,
            "tags": [tag.name for tag in r.tags],
            "thumbnail": thumbnail
        })
        
    return result_list


def get_recipe_by_id(db: Session, recipe_id: str, current_user_id: Optional[str] = None):
    """
    Fetch full recipe details including nested ingredients and steps.
    """
    recipe = db.query(Recipe).options(
        joinedload(Recipe.creator),
        joinedload(Recipe.ingredients).joinedload("ingredient"),
        joinedload(Recipe.steps).joinedload("media"),
        joinedload(Recipe.tags)
    ).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        return None
        
    # Format the ingredients using List Comprehension
    ingredients_out = [
        {
            "name": r_ing.ingredient.name,
            "quantity": r_ing.quantity,
            "unit": r_ing.unit or r_ing.ingredient.default_unit
        }
        for r_ing in recipe.ingredients
    ]
        
    # Format the steps using List Comprehension
    steps_out = [
        {
            "step_number": step.step_number,
            "instruction": step.instruction,
            "media": [{"type": m.media_type, "url": m.media_url} for m in step.media]
        }
        for step in sorted(recipe.steps, key=lambda s: s.step_number)
    ]
        
    return {
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "servings": recipe.servings,
        "prep_time_minutes": recipe.prep_time_minutes,
        "cook_time_minutes": recipe.cook_time_minutes,
        "source_type": recipe.source_type,
        "confidence_score": recipe.confidence_score,
        "creator": {
            "id": recipe.creator.id,
            "name": recipe.creator.name
        },
        "ingredients": ingredients_out,
        "steps": steps_out,
        "tags": [tag.name for tag in recipe.tags],
        "status": recipe.status,
        "can_edit": recipe.creator_id == current_user_id,
        "can_comment": False # Placeholder
    }


def create_recipe(db: Session, creator_id: str, recipe_data: dict):
    # Parse visibility default to public if matched
    viz = VisibilityType.public if recipe_data.get("visibility") == "public" else VisibilityType.private
    
    new_recipe = Recipe(
        creator_id=creator_id,
        title=recipe_data["title"],
        description=recipe_data.get("description"),
        servings=recipe_data.get("servings"),
        prep_time_minutes=recipe_data.get("prep_time_minutes"),
        cook_time_minutes=recipe_data.get("cook_time_minutes"),
        visibility=viz,
        status=RecipeStatus.draft
    )
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

def add_ingredient_to_recipe(db: Session, recipe_id: str, current_user_id: str, ingredient_data: dict):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.creator_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this recipe")

    new_ingredient = RecipeIngredient(
        recipe_id=recipe_id,
        ingredient_id=ingredient_data["ingredient_id"],
        quantity=ingredient_data["quantity"],
        unit=ingredient_data.get("unit")
    )
    db.add(new_ingredient)
    db.commit()
    db.refresh(new_ingredient)
    return new_ingredient

def add_step_to_recipe(db: Session, recipe_id: str, current_user_id: str, step_data: dict):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.creator_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this recipe")

    new_step = RecipeStep(
        recipe_id=recipe_id,
        step_number=step_data["step_number"],
        instruction=step_data["instruction"],
        estimated_time_minutes=step_data.get("estimated_time_minutes")
    )
    db.add(new_step)
    db.commit()
    db.refresh(new_step)
    return new_step

def publish_recipe(db: Session, recipe_id: str, current_user_id: str):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.creator_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to publish this recipe")
    
    recipe.status = RecipeStatus.community_testing
    db.commit()
    db.refresh(recipe)
    return recipe

def add_media_to_step(db: Session, step_id: str, uploader_id: str, media_type: str, file_name: str):
    # Verify the uploader owns the recipe associated with this step
    step = db.query(RecipeStep).filter(RecipeStep.id == step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    
    recipe = db.query(Recipe).filter(Recipe.id == step.recipe_id).first()
    if not recipe:
         raise HTTPException(status_code=404, detail="Recipe not found")
         
    if recipe.creator_id != uploader_id:
        raise HTTPException(status_code=403, detail="Not authorized to add media to this step")

    # Mocking CDN upload and getting URL
    media_url = f"https://cdn.app/{file_name}"
    
    enum_type = MediaType.image if media_type == "image" else MediaType.video
    
    new_media = RecipeStepMedia(
        step_id=step_id,
        media_type=enum_type,
        media_url=media_url,
        uploaded_by=uploader_id
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media
