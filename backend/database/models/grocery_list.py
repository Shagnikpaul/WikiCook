from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.connection import Base
import uuid


class GroceryList(Base):
    """
    Aggregated grocery list generated from a meal plan.
    """
    __tablename__ = "grocery_lists"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    meal_plan_id = Column(String, ForeignKey("meal_plans.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
