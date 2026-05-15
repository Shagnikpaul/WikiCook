"""
AI Schemas — Request and Response models for the AI recipe generation API.
"""

from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    """What the user sends to start a generation job."""
    youtube_url: str


class AIJobResponse(BaseModel):
    """What the user gets back when checking job status."""
    job_id: str
    status: str                          # "processing", "completed", "failed"
    error_message: Optional[str] = None
    video_title: Optional[str] = None
    video_thumbnail: Optional[str] = None
    recipe_id: Optional[str] = None      # Only present when status is "completed"
