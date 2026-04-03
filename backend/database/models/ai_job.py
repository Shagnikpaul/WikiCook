from sqlalchemy import Column, String, Integer, Text, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from database.connection import Base
import uuid
import enum


class AIJobStatus(str, enum.Enum):
    processing = "processing"
    completed = "completed"
    failed = "failed"


class AIJob(Base):
    """
    Cost control & auditing for AI-powered recipe extraction jobs.
    """
    __tablename__ = "ai_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    youtube_url = Column(Text, nullable=False)
    transcript = Column(Text, nullable=True)
    confidence_score = Column(Numeric(3, 2), nullable=True)
    tokens_used = Column(Integer, nullable=True)
    status = Column(SQLEnum(AIJobStatus), nullable=False, default=AIJobStatus.processing)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
