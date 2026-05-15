"""
AI Service — Sends YouTube data to Groq (Llama 3) and gets a structured recipe back.

This service handles:
1. Building the multi-source prompt (transcript + description + title)
2. Calling Groq API with JSON mode (guaranteed valid JSON)
3. Parsing and validating the response with Pydantic
"""

import os
import json
import sys
from groq import Groq
from pydantic import BaseModel, ValidationError

print(f"[AI SERVICE] Loaded GROQ version - Python: {sys.executable}")


# --- Pydantic Models (The "Blueprint" for the AI response) ---
# These define EXACTLY what shape we expect from the AI.
# After Groq returns JSON, we validate it against these models.

class ExtractedIngredient(BaseModel):
    """One ingredient with per-field confidence."""
    name: str                                    # e.g. "Chili Powder"
    quantity: float | None = None                # e.g. 2.0 (None if unknown)
    unit: str | None = None                      # e.g. "tsp" (None if unknown)
    preparation_note: str | None = None          # e.g. "chopped", "to taste"
    name_confidence: float                       # 0.0 to 1.0
    quantity_confidence: float                   # 0.0 if quantity is None
    unit_confidence: float                       # 0.0 if unit is None


class ExtractedStep(BaseModel):
    """One cooking step with confidence."""
    instruction: str                             # e.g. "Heat oil in a pan"
    estimated_time_minutes: int | None = None    # e.g. 5 (None if unknown)
    instruction_confidence: float                # 0.0 to 1.0
    time_confidence: float                       # 0.0 if time is None


class ExtractedRecipe(BaseModel):
    """The complete recipe extracted by AI."""
    title: str
    title_confidence: float
    
    servings: int | None = None
    servings_confidence: float
    
    prep_time_minutes: int | None = None
    prep_time_confidence: float
    
    cook_time_minutes: int | None = None
    cook_time_confidence: float
    
    cuisine: str | None = None                   # e.g. "Indian", "Italian"
    cuisine_confidence: float
    
    diet_tags: list[str]                         # e.g. ["vegetarian", "gluten-free"]
    
    ingredients: list[ExtractedIngredient]
    steps: list[ExtractedStep]


# --- The Prompt ---

def build_prompt(title: str, description: str | None, transcript: str | None) -> str:
    """
    Builds the instruction prompt for the AI.
    
    Combines all available text sources and adds strict rules about
    honesty, confidence scoring, and never hallucinating quantities.
    """
    prompt = f"""You are a professional recipe extraction AI for WikiCook, a community recipe platform.

Your job is to extract a structured cooking recipe from the following sources.
Not all sources may be available. Use whatever is provided.

=== VIDEO TITLE ===
{title}

=== VIDEO DESCRIPTION ===
{description or "Not available"}

=== SPEECH TRANSCRIPT ===
{transcript or "Not available"}

=== EXTRACTION RULES ===

1. HONESTY IS MANDATORY:
   - If a quantity is NOT explicitly stated, set it to null and confidence to 0.0
   - "Add some salt" -> quantity: null, preparation_note: "to taste"
   - NEVER invent numbers. Wrong quantities make recipes dangerous.

2. CROSS-REFERENCE SOURCES:
   - If description says "2 tsp chili powder" and speech says "add chili powder"
     -> Use quantity from description, set quantity_confidence to 0.85
   - If only speech mentions it vaguely -> set quantity_confidence to 0.3-0.5

3. CONFIDENCE SCORING GUIDE:
   - 0.9-1.0: Explicitly stated with exact numbers in at least one source
   - 0.7-0.9: Clearly implied or stated once
   - 0.5-0.7: Inferred from context or partial information
   - 0.1-0.5: Guessed or very uncertain
   - 0.0: Information not found at all (set the value to null)

4. STEPS:
   - Extract in chronological cooking order
   - Each step should be one clear action
   - Estimate time only if clearly indicated, otherwise set to null

5. TAGS:
   - Detect cuisine type (Indian, Italian, Mexican, Chinese, etc.)
   - Detect dietary labels only if confident (vegan, vegetarian, gluten-free, etc.)
   - Only tag what you are sure about

6. LANGUAGE:
   - Always output in English, even if the source is in another language
   - Translate ingredient names and instructions to English

=== REQUIRED JSON FORMAT ===
You MUST respond with ONLY a valid JSON object matching this exact structure:
{{
  "title": "Recipe Title",
  "title_confidence": 0.95,
  "servings": 4,
  "servings_confidence": 0.8,
  "prep_time_minutes": 15,
  "prep_time_confidence": 0.7,
  "cook_time_minutes": 30,
  "cook_time_confidence": 0.7,
  "cuisine": "Indian",
  "cuisine_confidence": 0.9,
  "diet_tags": ["non-vegetarian"],
  "ingredients": [
    {{
      "name": "Chicken",
      "quantity": 500,
      "unit": "grams",
      "preparation_note": "boneless, cubed",
      "name_confidence": 0.98,
      "quantity_confidence": 0.85,
      "unit_confidence": 0.85
    }}
  ],
  "steps": [
    {{
      "instruction": "Heat oil in a pan over medium heat",
      "estimated_time_minutes": 2,
      "instruction_confidence": 0.92,
      "time_confidence": 0.6
    }}
  ]
}}

IMPORTANT: Return ONLY the JSON object. No markdown, no explanation, no code fences.
"""
    return prompt


# --- The Groq API Call ---

def extract_recipe(title: str, description: str | None, transcript: str | None) -> ExtractedRecipe:
    """
    Sends the collected YouTube data to Groq (Llama 3) and returns a structured recipe.
    
    Uses Groq's JSON mode to guarantee valid JSON output,
    then validates it against our Pydantic model.
    
    Returns an ExtractedRecipe object with per-field confidence scores.
    Raises an exception if the API call fails or response is invalid.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables.")
    
    # Initialize the Groq client
    client = Groq(api_key=api_key)
    
    # Build the prompt from all available sources
    prompt = build_prompt(title, description, transcript)
    
    # Call Groq with JSON mode
    # response_format forces Groq to return valid JSON (no random text)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a recipe extraction AI. You MUST respond with ONLY valid JSON. No other text."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.1,      # Low temperature = more precise, less creative
        max_tokens=4096,       # Enough for a full recipe
    )
    
    # Extract the JSON string from the response
    raw_json = response.choices[0].message.content
    
    # Parse and validate against our Pydantic model
    # This catches any missing or wrong fields
    try:
        recipe = ExtractedRecipe.model_validate_json(raw_json)
        return recipe
    except ValidationError as e:
        raise ValueError(f"AI returned invalid recipe structure: {str(e)}")
