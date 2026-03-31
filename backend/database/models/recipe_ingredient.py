from sqlalchemy import Column, String, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base
import uuid

class RecipeIngredient(Base):
    """
    Ingredient quantities per recipe (Junction Table).
    Links recipes to canonical ingredients with specific amounts.
    """
    __tablename__ = "recipe_ingredients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    ingredient_id = Column(String, ForeignKey("ingredients.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Numeric, nullable=False)
    unit = Column(String(20), nullable=True)          # Overrides default if needed
    preparation_note = Column(Text, nullable=True)    # e.g., 'chopped', 'diced'

    # Relationships
    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient")
