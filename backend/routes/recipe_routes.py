from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from crud.recipe_crud import get_recipes, get_recipe_by_id
from typing import Optional

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("")
def read_recipes(
    diet: Optional[str] = Query(None, description="Filter by diet (e.g., vegan)"),
    cuisine: Optional[str] = Query(None, description="Filter by cuisine (e.g., italian)"),
    max_time: Optional[int] = Query(None, description="Max total time in minutes"),
    sort: Optional[str] = Query(None, description="Sort order/status (e.g., verified)"),
    db: Session = Depends(get_db)
):
    return {"recipes": get_recipes(db, diet=diet, cuisine=cuisine, max_time=max_time, sort=sort)}


@router.get("/{recipe_id}")
def read_recipe_detail(
    recipe_id: str,
    db: Session = Depends(get_db)
):
    """
    Get full details for a specific recipe by ID.
    """
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
        
    return recipe
