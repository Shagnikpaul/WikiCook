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
    
    description: str                             # 2-3 sentence description of the dish
    
    servings: int | None = None
    servings_confidence: float
    
    prep_time_minutes: int | None = None
    prep_time_confidence: float
    
    cook_time_minutes: int | None = None
    cook_time_confidence: float
    
    cuisine: str | None = None                   # e.g. "Indian", "Italian"
    cuisine_confidence: float
    
    diet_tags: list[str]                         # e.g. ["vegetarian", "gluten-free"]
    
    source_url: str | None = None                # Link to the full recipe on a website if mentioned
    
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

Your job is to extract a COMPLETE and DETAILED cooking recipe from the following sources.
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

4. DESCRIPTION:
   - Write 2-3 sentences describing the dish, what it tastes like, and its origin
   - Make it appetizing and informative

5. PREP AND COOK TIME:
   - ALWAYS estimate prep_time_minutes and cook_time_minutes
   - If not explicitly stated, estimate based on the steps and ingredients
   - For prep time: consider chopping, marinating, mixing
   - For cook time: consider frying, simmering, baking
   - Set confidence to 0.3-0.5 if estimated, 0.8+ if explicitly stated
   
6. STEPS — THE "CHEF'S BRAIN" APPROACH:
   - ADAPT TO COMPLEXITY: If the video is a 10-minute masterclass, capture every nuance.
   - FLAVOR SOURCE OBSESSION: Pay extreme attention to WHERE ingredients come from. If the chef says "use the oil we just fried onions in," DO NOT just say "Oil." Say "Oil (reserved from frying onions)." These are the secrets to flavor.
   - SEQUENCE INTEGRITY (LAYERING): For dishes like Biryani or Lasagna, do NOT combine layering steps. Capture the exact order: "Layer 1: Chicken," "Layer 2: Half the rice," "Layer 3: Herbs/Onions," etc.
   - CAPTURE THE ESSENCE: Identify the chef's unique "secrets" or signature techniques and make sure they aren't lost.
   - ACTIONS OVER WORDS: Each step should be one clear action, but include the "Why" if it helps the outcome (e.g., "Whisk vigorously to incorporate air").
   - CLARITY IS KING: Avoid "fluff" or stories. Stick to cooking instructions, visual cues, and temperatures.
   - Aim for a result that feels like the chef wrote a professional cookbook version of their video.

7. INGREDIENTS — BE OBSESSIVE:
   - Include preparation notes for each ingredient (diced, minced, melted, 80/20 fat ratio, etc.)
   - Use the specific version of the ingredient (e.g., "Filtered water," "Onion-infused oil," "Reserved pasta water").
   - Include ALL ingredients mentioned, even if they aren't in the description box.
   - If a quantity is mentioned in the speech but not the description, use it.

8. TAGS:
   - Detect cuisine type (Indian, Italian, Mexican, Chinese, etc.)
   - Detect dietary labels only if confident (vegan, vegetarian, gluten-free, etc.)

9. SOURCE URL:
   - Look closely at the VIDEO DESCRIPTION.
   - If there is a link that says "Full recipe", "Printable recipe", or "Cook at [link]", extract that URL.
   - If no external recipe link is found, set it to null.

10. LANGUAGE:
   - Always output in English, even if the source is in another language
   - Translate ingredient names and instructions to English

=== REQUIRED JSON FORMAT ===
You MUST respond with ONLY a valid JSON object matching this exact structure:
{{
  "title": "Recipe Title",
  "title_confidence": 0.95,
  "description": "A rich and creamy North Indian curry made with tender chicken in a buttery tomato-based gravy. This restaurant-style dish is known for its velvety texture and aromatic spices.",
  "servings": 4,
  "servings_confidence": 0.8,
  "prep_time_minutes": 20,
  "prep_time_confidence": 0.7,
  "cook_time_minutes": 35,
  "cook_time_confidence": 0.7,
  "cuisine": "Indian",
  "cuisine_confidence": 0.9,
  "diet_tags": ["non-vegetarian"],
  "source_url": "https://www.example.com/recipe",
  "ingredients": [
    {{
      "name": "Chicken breast",
      "quantity": 500,
      "unit": "grams",
      "preparation_note": "boneless, cut into 2-inch cubes",
      "name_confidence": 0.98,
      "quantity_confidence": 0.85,
      "unit_confidence": 0.85
    }},
    {{
      "name": "Salt",
      "quantity": null,
      "unit": null,
      "preparation_note": "to taste",
      "name_confidence": 0.95,
      "quantity_confidence": 0.0,
      "unit_confidence": 0.0
    }}
  ],
  "steps": [
    {{
      "instruction": "Cut the chicken breast into 2-inch cubes and pat them dry with a paper towel",
      "estimated_time_minutes": 5,
      "instruction_confidence": 0.92,
      "time_confidence": 0.6
    }},
    {{
      "instruction": "In a mixing bowl, combine 1 tablespoon of ginger-garlic paste, red chili powder, and a pinch of salt",
      "estimated_time_minutes": 2,
      "instruction_confidence": 0.90,
      "time_confidence": 0.5
    }}
  ]
}}

IMPORTANT: Return ONLY the JSON object. No markdown, no explanation, no code fences.
Remember: More detailed steps are ALWAYS better. Aim for 10-20 steps.
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
    
    # --- Smart Truncation ---
    # Groq's free tier has a TPM (Tokens Per Minute) limit (Total = Prompt + Max Tokens).
    # By using a reasonable Max Tokens (3000), we leave ~9,000 tokens for the prompt.
    # 25,000 characters is ~6,000 tokens, which covers a ~45 minute video easily.
    MAX_CHARS = 25000
    if transcript and len(transcript) > MAX_CHARS:
        print(f"[AI SERVICE] Transcript extremely long ({len(transcript)} chars). Truncating to {MAX_CHARS}...")
        # Only truncate if it's truly massive (e.g., a 1-hour documentary)
        transcript = transcript[:20000] + "\n... [truncated for extreme length] ...\n" + transcript[-5000:]

    # Build the prompt from all available sources
    prompt = build_prompt(title, description, transcript)
    
    # Call Groq with JSON mode
    # response_format forces Groq to return valid JSON (no random text)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a recipe extraction AI. You MUST respond with ONLY valid JSON. No other text. Be extremely detailed in your steps — break every action into its own step."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.1,      # Low temperature = more precise, less creative
        max_tokens=3000,       # 3000 is plenty for JSON; leaves room for the transcript in TPM limits
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
