from fastapi import FastAPI
from database.connection import engine, Base
from database.models.user import User  # Mirror model for Better Auth's user table
from database.models.user_preferences import UserPreferences
from database.models.recipe import Recipe
from database.models.ingredient import Ingredient
from database.models.recipe_ingredient import RecipeIngredient
from database.models.recipe_step import RecipeStep
from database.models.recipe_step_media import RecipeStepMedia
from database.models.tag import Tag
from database.models.recipe_tag import RecipeTag
from database.models.ai_job import AIJob
from database.models.recipe_review import RecipeReview
from database.models.comment import Comment
from database.models.edit_suggestion import EditSuggestion
from database.models.edit_vote import EditVote
from database.models.recipe_version import RecipeVersion
from database.models.saved_recipe import SavedRecipe
from database.models.follow import Follow
from database.models.meal_plan import MealPlan
from database.models.meal_plan_item import MealPlanItem
from database.models.grocery_list import GroceryList
from database.models.grocery_list_item import GroceryListItem

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WikiCook API")


@app.get("/")
def read_root():
    return {"message": "WikiCook API is running!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
