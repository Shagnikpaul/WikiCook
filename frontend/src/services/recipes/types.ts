
// data schema for the frontend to follow...


export interface IngredientInput {
    ingredient_name: string;
    quantity: number | null;
    unit: string;
    preparation_note: string;
}

export interface StepInput {
    step_number: number;
    instruction: string;
    estimated_time_minutes: number | null;

    mediaFiles?: Array<File>;
}

export interface RecipeFormData {
    title: string;
    description: string;

    servings: number | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;

    visibility: "public" | "private";

    tags: Array<string>;

    ingredients: Array<IngredientInput>;
    steps: Array<StepInput>;
}