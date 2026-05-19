import type { RecipeFormData } from "./types";

export const defaultRecipeForm: RecipeFormData = {
    title: "",
    description: "",

    servings: null,
    prep_time_minutes: null,
    cook_time_minutes: null,

    visibility: "public",

    tags: [],

    ingredients: [
        {
            ingredient_name: "",
            quantity: null,
            unit: "",
            preparation_note: "",
        },
    ],

    steps: [
        {
            step_number: 1,
            instruction: "",
            estimated_time_minutes: null,
            mediaFiles: [],
        },
    ],
};