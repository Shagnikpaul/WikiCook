import uuid
from typing import Optional
from fastapi_users import schemas

class UserRead(schemas.BaseUser[uuid.UUID]):
    name: str
    image: Optional[str] = None

class UserCreate(schemas.BaseUserCreate):
    name: str
    image: Optional[str] = None

class UserUpdate(schemas.BaseUserUpdate):
    name: Optional[str] = None
    image: Optional[str] = None
