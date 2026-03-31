from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.connection import Base
import uuid
import enum

class MediaType(str, enum.Enum):
    image = "image"
    video = "video"

class RecipeStepMedia(Base):
    """
    Images/videos per step.
    """
    __tablename__ = "recipe_step_media"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    step_id = Column(String, ForeignKey("recipe_steps.id", ondelete="CASCADE"), nullable=False)
    media_type = Column(SQLEnum(MediaType), nullable=False)
    media_url = Column(Text, nullable=False)
    uploaded_by = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    step = relationship("RecipeStep", back_populates="media")
    uploader = relationship("User")
