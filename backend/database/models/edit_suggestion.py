from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from database.connection import Base
import uuid
import enum


class ChangeType(str, enum.Enum):
    minor = "minor"
    major = "major"
    safety = "safety"


class SuggestionStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class EditSuggestion(Base):
    """
    Proposed changes to recipes for community review.
    """
    __tablename__ = "edit_suggestions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    recipe_id = Column(String, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    proposed_by = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    change_type = Column(SQLEnum(ChangeType), nullable=False)
    diff = Column(JSONB, nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(SQLEnum(SuggestionStatus), nullable=False, default=SuggestionStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
