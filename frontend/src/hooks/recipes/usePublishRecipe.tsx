import { useState } from "react";
import type { RecipeFormData } from "@/services/recipes/types";
import {
    addIngredient,
    addStep,
    createRecipe,
    uploadStepMedia,
} from "@/services/recipes/mutations";


export function useCreateRecipe() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const publishRecipe = async (form: RecipeFormData) => {
        setIsSubmitting(true);

        try {
            const created = await createRecipe(form);
            const recipeId = created.id;

            for (const ingredient of form.ingredients) {
                if (!ingredient.ingredient_name.trim()) continue;
                await addIngredient(recipeId, ingredient);
            }

            for (const step of form.steps) {
                if (!step.instruction.trim()) continue;

                const createdStep = await addStep(recipeId, step);

                if (step.mediaFiles?.length) {
                    for (const file of step.mediaFiles) {
                        await uploadStepMedia(createdStep.id, file);
                    }
                }
            }

            return recipeId;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        publishRecipe,
        isSubmitting,
    };
}