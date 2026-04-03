from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.recipe_crud import add_media_to_step
from auth import get_current_user

router = APIRouter(prefix="/steps", tags=["Steps"])

@router.post("/{step_id}/media")
def upload_step_media(
    step_id: str,
    media_type: str = Form(...),
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Here we simulate uploading the file and returning a CDN URL
    media = add_media_to_step(db, step_id, user_id, media_type, file.filename)
    return {"media_url": media.media_url}
