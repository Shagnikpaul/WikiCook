from sqlalchemy import Column, String, Enum as SQLEnum
from database.connection import Base
import uuid
import enum

class TagType(str, enum.Enum):
    diet = "diet"
    cuisine = "cuisine"
    style = "style"

class Tag(Base):
    """
    Cuisine, diet, style tags.
    """
    __tablename__ = "tags"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False, unique=True)
    tag_type = Column(SQLEnum(TagType), nullable=False)
