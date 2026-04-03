from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from database.connection import Base
import uuid
import enum


class VoteType(str, enum.Enum):
    up = "up"
    down = "down"


class EditVote(Base):
    """
    Community approval votes on edit suggestions.
    """
    __tablename__ = "edit_votes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    suggestion_id = Column(String, ForeignKey("edit_suggestions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    vote = Column(SQLEnum(VoteType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
