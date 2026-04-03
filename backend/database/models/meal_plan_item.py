from sqlalchemy import Column, String, Date, ForeignKey, Enum as SQLEnum
from database.connection import Base
import uuid
import enum


class MealType(str, enum.Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"


class MealPlanItem(Base):
    """
    Individual recipe per day within a meal plan.
    """
    __tablename__ = "meal_plan_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meal_plan_id = Column(String, ForeignKey("meal_plans.id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    planned_date = Column(Date, nullable=False)
    meal_type = Column(SQLEnum(MealType), nullable=False)
