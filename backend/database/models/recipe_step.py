from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base
import uuid

class RecipeStep(Base):
    """
    Ordered cooking instructions.
    """
    __tablename__ = "recipe_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    instruction = Column(Text, nullable=False)
    estimated_time_minutes = Column(Integer, nullable=True)

    # Relationships
    recipe = relationship("Recipe", back_populates="steps")
    media = relationship("RecipeStepMedia", back_populates="step", cascade="all, delete-orphan")
