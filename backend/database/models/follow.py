from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.connection import Base


class Follow(Base):
    """
    Creator following relationships.
    Composite primary key prevents duplicate follows.
    """
    __tablename__ = "follows"

    from fastapi_users_db_sqlalchemy.generics import GUID
    follower_id = Column(GUID(), ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    following_id = Column(GUID(), ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
