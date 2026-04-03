from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models.user_preferences import UserPreferences
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/preferences")
async def save_preferences(
    body: dict = Body(...),
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Save or update user preferences (onboarding).
    Protected: requires a valid Better Auth session.
    """
    # Check if preferences already exist for this user
    existing = db.query(UserPreferences).filter(
        UserPreferences.user_id == user_id
    ).first()

    if existing:
        # Update existing preferences
        existing.dietary_preferences = body.get("dietary_preferences")
        existing.favorite_cuisines = body.get("favorite_cuisines")
        existing.skill_level = body.get("skill_level")
    else:
        # Create new preferences
        prefs = UserPreferences(
            user_id=user_id,
            dietary_preferences=body.get("dietary_preferences"),
            favorite_cuisines=body.get("favorite_cuisines"),
            skill_level=body.get("skill_level"),
        )
        db.add(prefs)

    db.commit()
    return {"message": "Preferences saved"}
