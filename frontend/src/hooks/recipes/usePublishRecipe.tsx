import { useState } from "react";

import {
    useAddIngredient,
    useAddStep,
    useCreateRecipe as useCreateRecipeMutation,
    useUploadStepMedia,
} from "./useRecipeMutations";

import type {
    RecipeFormData,
} from "@/services/recipes/types";

export function useCreateRecipe() {

    const [uploadProgress, setUploadProgress] =
        useState(0);

    // ---------- mutations ----------

    const createRecipeMutation =
        useCreateRecipeMutation();

    const addIngredientMutation =
        useAddIngredient();

    const addStepMutation =
        useAddStep();

    const uploadMediaMutation =
        useUploadStepMedia();

    // ---------- publish workflow ----------

    const publishRecipe = async (
        form: RecipeFormData
    ) => {

        setUploadProgress(0);

        // ---------- create recipe ----------

        const createdRecipe =
            await createRecipeMutation.mutateAsync(
                form
            );

        const recipeId =
            createdRecipe.recipe_id;
        console.log('recipeId obtained : ', createdRecipe);

        setUploadProgress(20);

        // ---------- ingredients ----------

        const validIngredients =
            form.ingredients.filter(
                (ingredient) =>
                    ingredient.ingredient_name.trim()
            );

        await Promise.all(

            validIngredients.map(
                (ingredient) =>

                    addIngredientMutation.mutateAsync({
                        recipeId,
                        data: ingredient,
                    })
            )
        );

        setUploadProgress(50);

        // ---------- steps ----------

        const validSteps =
            form.steps.filter(
                (step) =>
                    step.instruction.trim()
            );

        for (const step of validSteps) {

            const createdStep =
                await addStepMutation.mutateAsync({
                    recipeId,
                    data: step,
                });

            // ---------- media upload ----------

            if (
                step.mediaFiles &&
                step.mediaFiles.length > 0
            ) {

                await Promise.all(

                    step.mediaFiles.map(
                        (file) =>
                            uploadMediaMutation.mutateAsync({
                                stepId:
                                    createdStep.id,

                                file,
                            })
                    )
                );
            }
        }

        setUploadProgress(100);

        return recipeId;
    };

    // ---------- combined loading ----------

    const isSubmitting =
        createRecipeMutation.isPending ||
        addIngredientMutation.isPending ||
        addStepMutation.isPending ||
        uploadMediaMutation.isPending;

    return {
        publishRecipe,
        uploadProgress,
        isSubmitting,
    };
}