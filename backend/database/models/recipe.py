from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.connection import Base
import uuid
import enum

class SourceType(str, enum.Enum):
    manual = "manual"
    youtube_ai = "youtube_ai"

class RecipeStatus(str, enum.Enum):
    draft = "draft"
    community_testing = "community_testing"
    verified = "verified"
    needs_improvement = "needs_improvement"
    archived = "archived"

class VisibilityType(str, enum.Enum):
    public = "public"
    private = "private"
    friends = "friends"

class Recipe(Base):
    """
    Stores recipe identity and lifecycle state.
    """
    __tablename__ = "recipes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    creator_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    source_type = Column(SQLEnum(SourceType), nullable=False, default=SourceType.manual)
    status = Column(SQLEnum(RecipeStatus), nullable=False, default=RecipeStatus.draft)
    visibility = Column(SQLEnum(VisibilityType), nullable=False, default=VisibilityType.private)
    
    servings = Column(Integer, nullable=True)
    prep_time_minutes = Column(Integer, nullable=True)
    cook_time_minutes = Column(Integer, nullable=True)
    confidence_score = Column(Numeric(3, 2), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    creator = relationship("User", backref="recipes")
    ingredients = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    steps = relationship("RecipeStep", back_populates="recipe", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary="recipe_tags", backref="recipes")
