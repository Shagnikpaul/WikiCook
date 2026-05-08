from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://") if DATABASE_URL else None

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "options": "-c timezone=utc",
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5
    }
)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Async Engine for FastAPI-Users
async_engine = create_async_engine(
    ASYNC_DATABASE_URL.split("?")[0] if ASYNC_DATABASE_URL else None,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"ssl": True} if "sslmode=require" in str(ASYNC_DATABASE_URL) else {}
)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_session():
    """Async dependency for FastAPI-Users"""
    async with AsyncSessionLocal() as session:
        yield session
