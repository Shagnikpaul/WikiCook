from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from crud.recipe_crud import (
    get_recipes, get_recipe_by_id, create_recipe, add_ingredient_to_recipe,
    add_step_to_recipe, publish_recipe, update_recipe, delete_recipe,
    update_ingredient_in_recipe, delete_ingredient_from_recipe,
    update_step_in_recipe, delete_step_from_recipe
)
from auth import get_current_user, get_optional_user
from database.models.user import User
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

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    visibility: Optional[str] = None

class IngredientUpdate(BaseModel):
    quantity: Optional[float] = None
    unit: Optional[str] = None
    preparation_note: Optional[str] = None

class StepUpdate(BaseModel):
    step_number: Optional[int] = None
    instruction: Optional[str] = None
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
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Get full details for a specific recipe by ID.
    """
    recipe = get_recipe_by_id(db, recipe_id, user.id if user else None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
        
    return recipe


@router.post("")
def create_new_recipe(
    recipe: RecipeCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_recipe = create_recipe(db, user.id, recipe.model_dump())
    return {
        "recipe_id": new_recipe.id,
        "status": new_recipe.status.value
    }


@router.post("/{recipe_id}/ingredients")
def add_ingredient(
    recipe_id: str,
    ingredient: RecipeIngredientAdd,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add an ingredient to an existing recipe.
    """
    add_ingredient_to_recipe(db, recipe_id, user.id, ingredient.model_dump())
    return {"message": "Ingredient added"}


@router.post("/{recipe_id}/steps")
def add_step(
    recipe_id: str,
    step: RecipeStepAdd,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a step to an existing recipe.
    """
    new_step = add_step_to_recipe(db, recipe_id, user.id, step.model_dump())
    return {"step_id": new_step.id}


@router.post("/{recipe_id}/publish")
def publish(
    recipe_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipe = publish_recipe(db, recipe_id, user.id)
    return {"message": "Recipe published", "status": recipe.status.value}


@router.patch("/{recipe_id}")
def edit_recipe(
    recipe_id: str,
    updates: RecipeUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Edit recipe metadata (title, description, servings, times, visibility).
    """
    recipe = update_recipe(db, recipe_id, user.id, updates.model_dump(exclude_unset=True))
    return {"message": "Recipe updated", "recipe_id": recipe.id}


@router.delete("/{recipe_id}")
def remove_recipe(
    recipe_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a recipe and all its ingredients, steps, and media.
    """
    return delete_recipe(db, recipe_id, user.id)


@router.patch("/{recipe_id}/ingredients/{entry_id}")
def edit_ingredient(
    recipe_id: str,
    entry_id: str,
    updates: IngredientUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Edit an ingredient entry (quantity, unit, preparation note).
    """
    entry = update_ingredient_in_recipe(db, recipe_id, entry_id, user.id, updates.model_dump(exclude_unset=True))
    return {"message": "Ingredient updated"}


@router.delete("/{recipe_id}/ingredients/{entry_id}")
def remove_ingredient(
    recipe_id: str,
    entry_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove an ingredient from a recipe.
    """
    return delete_ingredient_from_recipe(db, recipe_id, entry_id, user.id)


@router.patch("/{recipe_id}/steps/{step_id}")
def edit_step(
    recipe_id: str,
    step_id: str,
    updates: StepUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Edit a cooking step (instruction, step number, estimated time).
    """
    step = update_step_in_recipe(db, recipe_id, step_id, user.id, updates.model_dump(exclude_unset=True))
    return {"message": "Step updated"}


@router.delete("/{recipe_id}/steps/{step_id}")
def remove_step(
    recipe_id: str,
    step_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a step from a recipe.
    """
    return delete_step_from_recipe(db, recipe_id, step_id, user.id)
