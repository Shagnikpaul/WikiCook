from sqlalchemy import Column, String, Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
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
    quantity = Column(Numeric, nullable=True)            # Nullable for AI recipes ("Add some salt")
    unit = Column(String(20), nullable=True)              # Overrides default if needed
    preparation_note = Column(Text, nullable=True)        # e.g., 'chopped', 'diced'

    # AI confidence tracking
    confidence = Column(JSONB, nullable=True)             # {"name": 0.98, "quantity": 0.61, "unit": 0.85}
    ai_note = Column(Text, nullable=True)                 # "Quantity unclear in source video" or "to taste"

    # Relationships
    recipe = relationship("Recipe", back_populates="ingredients")
    ingredient = relationship("Ingredient")
