from sqlalchemy import Column, String, ARRAY, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.connection import Base
import uuid


class UserPreferences(Base):
    """
    Stores user preferences for the WikiCook app.
    Links to Better Auth's 'user' table via user_id.
    """
    __tablename__ = "user_preferences"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, unique=True)
    dietary_preferences = Column(ARRAY(String), nullable=True)  # e.g., ["vegetarian", "gluten-free"]
    favorite_cuisines = Column(ARRAY(String), nullable=True)    # e.g., ["italian", "indian", "chinese"]
    skill_level = Column(String(50), nullable=True)             # e.g., "beginner", "intermediate", "expert"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
