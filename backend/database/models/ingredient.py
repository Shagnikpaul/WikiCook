from sqlalchemy import Column, String
from database.connection import Base
import uuid

class Ingredient(Base):
    """
    Canonical ingredient dictionary.
    Each ingredient like 'Flour' only exists here once.
    """
    __tablename__ = "ingredients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True)      # e.g. Produce, Dairy, Baking
    default_unit = Column(String(20), nullable=True)  # e.g. cups, grams, count
