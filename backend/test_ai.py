"""Quick test: Does extract_recipe use Groq or Gemini?"""
import os
from dotenv import load_dotenv
load_dotenv()

print(f"GROQ_API_KEY set: {bool(os.getenv('GROQ_API_KEY'))}")
print(f"GEMINI_API_KEY set: {bool(os.getenv('GEMINI_API_KEY'))}")

from services.ai_service import extract_recipe
print("\nCalling extract_recipe with a simple test...")

try:
    result = extract_recipe(
        title="Simple Butter Chicken",
        description="Ingredients: 500g chicken, 2 tsp chili powder, 1 cup cream",
        transcript=None
    )
    print(f"\nSUCCESS! Got recipe: {result.title}")
    print(f"Ingredients: {len(result.ingredients)}")
    for ing in result.ingredients:
        print(f"  - {ing.name}: {ing.quantity} {ing.unit} (confidence: {ing.name_confidence})")
except Exception as e:
    print(f"\nERROR: {e}")
