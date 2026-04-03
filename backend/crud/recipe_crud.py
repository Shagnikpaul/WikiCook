from sqlalchemy.orm import Session, joinedload
from database.models.recipe import Recipe
from database.models.tag import Tag, TagType
from typing import Optional

def get_recipes(db: Session, diet: Optional[str] = None, cuisine: Optional[str] = None, max_time: Optional[int] = None, sort: Optional[str] = None):
    """
    Fetch a list of recipes with optional filtering.
    """
    query = db.query(Recipe).options(joinedload(Recipe.tags), joinedload(Recipe.steps).joinedload("media"))
    
    # We apply eager loading for tags and media to get the thumbnail and tags efficiently.
    
    if diet or cuisine:
        query = query.join(Recipe.tags)
        
    if diet:
        query = query.filter(Tag.name == diet, Tag.tag_type == TagType.diet)
        
    if cuisine:
        query = query.filter(Tag.name == cuisine, Tag.tag_type == TagType.cuisine)
        
    if max_time:
        # sum of prep and cook time
        query = query.filter((Recipe.prep_time_minutes + Recipe.cook_time_minutes) <= max_time)
        
    if sort == "verified":
        query = query.filter(Recipe.status == "verified")
        # You could add ordering here too
        
    recipes = query.all()
    
    result_list = []
    for r in recipes:
        # Extract thumbnail (first image in the first step if available)
        thumbnail = None
        for step in r.steps:
            if step.media and len(step.media) > 0:
                thumbnail = step.media[0].media_url
                break
                
        result_list.append({
            "id": r.id,
            "title": r.title,
            "rating": 4.6, # Placeholder for now, could be calculated from reviews
            "status": r.status,
            "source_type": r.source_type,
            "tags": [tag.name for tag in r.tags],
            "thumbnail": thumbnail
        })
        
    return result_list


def get_recipe_by_id(db: Session, recipe_id: str):
    """
    Fetch full recipe details including nested ingredients and steps.
    """
    recipe = db.query(Recipe).options(
        joinedload(Recipe.creator),
        joinedload(Recipe.ingredients).joinedload("ingredient"),
        joinedload(Recipe.steps).joinedload("media"),
        joinedload(Recipe.tags)
    ).filter(Recipe.id == recipe_id).first()
    
    if not recipe:
        return None
        
    # Format the ingredients using List Comprehension
    ingredients_out = [
        {
            "name": r_ing.ingredient.name,
            "quantity": r_ing.quantity,
            "unit": r_ing.unit or r_ing.ingredient.default_unit
        }
        for r_ing in recipe.ingredients
    ]
        
    # Format the steps using List Comprehension
    steps_out = [
        {
            "step_number": step.step_number,
            "instruction": step.instruction,
            "media": [{"type": m.media_type, "url": m.media_url} for m in step.media]
        }
        for step in sorted(recipe.steps, key=lambda s: s.step_number)
    ]
        
    return {
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "servings": recipe.servings,
        "prep_time_minutes": recipe.prep_time_minutes,
        "cook_time_minutes": recipe.cook_time_minutes,
        "source_type": recipe.source_type,
        "confidence_score": recipe.confidence_score,
        "creator": {
            "id": recipe.creator.id,
            "name": recipe.creator.name
        },
        "ingredients": ingredients_out,
        "steps": steps_out,
        "tags": [tag.name for tag in recipe.tags],
        "status": recipe.status,
        "can_edit": False, # Placeholder
        "can_comment": False # Placeholder
    }
