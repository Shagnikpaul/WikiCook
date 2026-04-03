from sqlalchemy import Column, String, Numeric, Boolean, ForeignKey
from database.connection import Base
import uuid


class GroceryListItem(Base):
    """
    Individual items in a grocery list - the final shopping list.
    """
    __tablename__ = "grocery_list_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    grocery_list_id = Column(String, ForeignKey("grocery_lists.id", ondelete="CASCADE"), nullable=False)
    ingredient_id = Column(String, ForeignKey("ingredients.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Numeric, nullable=False)
    unit = Column(String(20), nullable=True)
    checked = Column(Boolean, nullable=False, default=False)
