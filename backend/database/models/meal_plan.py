from sqlalchemy import Column, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.connection import Base
import uuid


class MealPlan(Base):
    """
    Weekly meal planning for users.
    """
    __tablename__ = "meal_plans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
