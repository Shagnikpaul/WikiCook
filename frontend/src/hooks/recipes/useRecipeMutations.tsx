import { useMutation } from "@tanstack/react-query";

import type {
    IngredientInput,
    RecipeFormData,
    StepInput,
} from "@/services/recipes/types";
import {
    addIngredient,
    addStep,
    createRecipe,
    uploadStepMedia,
} from "@/services/recipes/mutations";


/**
 * STEP 1: Create recipe
 */
export function useCreateRecipe() {
    return useMutation({
        mutationFn: (data: RecipeFormData) => createRecipe(data),
    });
}

/**
 * STEP 2: Add ingredient
 */
export function useAddIngredient() {
    return useMutation({
        mutationFn: ({
            recipeId,
            data,
        }: {
            recipeId: string;
            data: IngredientInput;
        }) => addIngredient(recipeId, data),
    });
}

/**
 * STEP 3: Add step
 */
export function useAddStep() {
    return useMutation({
        mutationFn: ({
            recipeId,
            data,
        }: {
            recipeId: string;
            data: StepInput;
        }) => addStep(recipeId, data),
    });
}

/**
 * STEP 4: Upload media
 */
export function useUploadStepMedia() {
    return useMutation({
        mutationFn: ({
            stepId,
            file,
        }: {
            stepId: string;
            file: File;
        }) => uploadStepMedia(stepId, file),
    });
}