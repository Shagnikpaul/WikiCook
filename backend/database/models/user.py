from sqlalchemy import Column, String, Boolean, DateTime
from database.connection import Base

class User(Base):
    """
    Mirror model for Better Auth's user table.
    """
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    email_verified = Column("emailVerified", Boolean, nullable=False)
    name = Column(String, nullable=False)
    image = Column(String, nullable=True)
    created_at = Column("createdAt", DateTime(timezone=True))
    updated_at = Column("updatedAt", DateTime(timezone=True))
