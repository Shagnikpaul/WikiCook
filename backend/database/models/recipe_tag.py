from sqlalchemy import Column, String, ForeignKey
from database.connection import Base

class RecipeTag(Base):
    """
    Many-to-many tagging junction table between recipes and tags.
    """
    __tablename__ = "recipe_tags"

    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(String, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
