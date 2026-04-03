from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.connection import Base


class SavedRecipe(Base):
    """
    Bookmarked/saved recipes per user.
    Composite primary key (user_id, recipe_id) prevents duplicates.
    """
    __tablename__ = "saved_recipes"

    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
