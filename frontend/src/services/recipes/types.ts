
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

// ---------- creator ----------

export type Creator = {
    id: string;
    name: string;
};

// ---------- media ----------

export type StepMedia = {
    type: string;
    url: string;
};

// ---------- ingredient detail ----------

export type RecipeIngredient = {
    id: string;

    ingredient_id: string;

    name: string;

    quantity: number | null;

    unit: string | null;

    preparation_note: string | null;

    confidence?: Record<string, unknown> | null;
};

// ---------- step detail ----------

export type RecipeStep = {
    id: string;

    step_number: number;

    instruction: string;

    estimated_time_minutes: number | null;

    confidence?: Record<string, unknown> | null;

    media: Array<StepMedia>;
};

// ---------- full recipe detail ----------

export type RecipeDetailResponse = {
    id: string;

    title: string;

    description: string | null;

    servings: number | null;

    prep_time_minutes: number | null;

    cook_time_minutes: number | null;

    source_type: string;

    confidence_score: number | null;

    youtube_url: string | null;

    external_source_url: string | null;

    field_confidence?: Record<string, unknown> | null;

    creator: Creator;

    ingredients: Array<RecipeIngredient>;

    steps: Array<RecipeStep>;

    tags: Array<string>;

    status: string;

    can_edit: boolean;

    can_comment: boolean;
};

// ---------- recipe list response ----------

export type RecipeListResponse = {
    id: string;
    title: string;
    rating: number | null;
    status: string;
    source_type: string;
    tags: Array<string>;
    thumbnail: string | null;
    difficulty?: string;
    time?: string;
};