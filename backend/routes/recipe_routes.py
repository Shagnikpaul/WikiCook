from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from crud.recipe_crud import get_recipes, get_recipe_by_id, create_recipe, add_ingredient_to_recipe, add_step_to_recipe, publish_recipe
from auth import get_current_user, get_optional_user
from typing import Optional

class RecipeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    visibility: Optional[str] = "public"

class RecipeIngredientAdd(BaseModel):
    ingredient_id: str
    quantity: float
    unit: Optional[str] = None

class RecipeStepAdd(BaseModel):
    step_number: int
    instruction: str
    estimated_time_minutes: Optional[int] = None

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
    user_id: Optional[str] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Get full details for a specific recipe by ID.
    """
    recipe = get_recipe_by_id(db, recipe_id, user_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
        
    return recipe


@router.post("")
def create_new_recipe(
    recipe: RecipeCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_recipe = create_recipe(db, user_id, recipe.model_dump())
    return {
        "recipe_id": new_recipe.id,
        "status": new_recipe.status.value
    }


@router.post("/{recipe_id}/ingredients")
def add_ingredient(
    recipe_id: str,
    ingredient: RecipeIngredientAdd,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add an ingredient to an existing recipe.
    """
    add_ingredient_to_recipe(db, recipe_id, user_id, ingredient.model_dump())
    return {"message": "Ingredient added"}


@router.post("/{recipe_id}/steps")
def add_step(
    recipe_id: str,
    step: RecipeStepAdd,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a step to an existing recipe.
    """
    new_step = add_step_to_recipe(db, recipe_id, user_id, step.model_dump())
    return {"step_id": new_step.id}


@router.post("/{recipe_id}/publish")
def publish(
    recipe_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipe = publish_recipe(db, recipe_id, user_id)
    return {"message": "Recipe published", "status": recipe.status.value}
