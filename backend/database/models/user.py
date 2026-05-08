from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database.connection import Base
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID

class User(SQLAlchemyBaseUserTableUUID, Base):
    """
    User model for FastAPI-Users.
    """
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    # FastAPI-Users provides id (UUID), email, hashed_password, is_active, is_superuser, is_verified
    # We can add extra fields here:
    name: Mapped[str] = mapped_column(String, nullable=False, default="User")
    image: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
