from sqlalchemy import Column, String, Integer, Text, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from fastapi_users_db_sqlalchemy.generics import GUID
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
    Tracks the full pipeline: URL → transcript → AI → recipe draft.
    """
    __tablename__ = "ai_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(GUID(), ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    youtube_url = Column(Text, nullable=False)

    # Data collected from YouTube
    video_title = Column(String(500), nullable=True)
    video_description = Column(Text, nullable=True)
    video_thumbnail = Column(Text, nullable=True)
    video_duration_seconds = Column(Integer, nullable=True)
    transcript = Column(Text, nullable=True)

    # AI processing results
    raw_ai_response = Column(Text, nullable=True)       # Full Gemini output for debugging
    confidence_score = Column(Numeric(3, 2), nullable=True)
    tokens_used = Column(Integer, nullable=True)

    # Job lifecycle
    status = Column(SQLEnum(AIJobStatus), nullable=False, default=AIJobStatus.processing)
    error_message = Column(Text, nullable=True)          # Why the job failed
    recipe_id = Column(String, ForeignKey("recipes.id"), nullable=True)  # The recipe draft created

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships — foreign_keys specified because Recipe has no FK back to AIJob
    user = relationship("User", backref="ai_jobs")
    recipe = relationship("Recipe", foreign_keys=[recipe_id], backref="ai_job")
