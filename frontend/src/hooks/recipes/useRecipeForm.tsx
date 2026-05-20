import { useState } from "react";

import type {
    IngredientInput,
    RecipeFormData,
    StepInput,
} from "@/services/recipes/types";

import { defaultRecipeForm } from "@/services/recipes/defaults";

export function useRecipeForm() {

    const [form, setForm] =
        useState<RecipeFormData>(
            defaultRecipeForm
        );

    // ---------- update top-level fields ----------

    const updateField = <
        TKey extends keyof RecipeFormData
    >(
        key: TKey,
        value: RecipeFormData[TKey]
    ) => {

        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // ---------- ingredient handlers ----------

    const addIngredientRow = () => {

        const newIngredient: IngredientInput = {
            ingredient_name: "",
            quantity: null,
            unit: "",
            preparation_note: "",
        };

        setForm((prev) => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                newIngredient,
            ],
        }));
    };

    const removeIngredientRow = (
        index: number
    ) => {

        setForm((prev) => ({
            ...prev,
            ingredients:
                prev.ingredients.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    const updateIngredientRow = (
        index: number,
        updatedIngredient: IngredientInput
    ) => {

        setForm((prev) => {

            const updatedIngredients = [
                ...prev.ingredients,
            ];

            updatedIngredients[index] =
                updatedIngredient;

            return {
                ...prev,
                ingredients:
                    updatedIngredients,
            };
        });
    };

    // ---------- step handlers ----------

    const addStepRow = () => {

        const newStep: StepInput = {
            step_number:
                form.steps.length + 1,

            instruction: "",

            estimated_time_minutes:
                null,

            mediaFiles: [],
        };

        setForm((prev) => ({
            ...prev,
            steps: [
                ...prev.steps,
                newStep,
            ],
        }));
    };

    const removeStepRow = (
        index: number
    ) => {

        setForm((prev) => ({
            ...prev,

            steps: prev.steps
                .filter(
                    (_, i) => i !== index
                )
                .map((step, idx) => ({
                    ...step,
                    step_number: idx + 1,
                })),
        }));
    };

    const updateStepRow = (
        index: number,
        updatedStep: StepInput
    ) => {

        setForm((prev) => {

            const updatedSteps = [
                ...prev.steps,
            ];

            updatedSteps[index] =
                updatedStep;

            return {
                ...prev,
                steps: updatedSteps,
            };
        });
    };

    // ---------- derived state ----------

    const validIngredients =
        form.ingredients.filter(
            (ingredient) =>
                ingredient.ingredient_name.trim()
        );

    const validSteps =
        form.steps.filter(
            (step) =>
                step.instruction.trim()
        );

    const validIngredientsCount =
        validIngredients.length;

    const validStepsCount =
        validSteps.length;

    const isTitleValid =
        form.title.trim().length > 0;

    const completedSections = [
        isTitleValid,
        validIngredientsCount > 0,
        validStepsCount > 0,
    ].filter(Boolean).length;

    const progressValue =
        (completedSections / 3) * 100;

    const isReadyToPublish =
        completedSections === 3;

    return {

        // form state

        form,

        // top-level handlers

        updateField,

        // ingredient handlers

        addIngredientRow,
        removeIngredientRow,
        updateIngredientRow,

        // step handlers

        addStepRow,
        removeStepRow,
        updateStepRow,

        // derived state

        validIngredients,
        validSteps,

        validIngredientsCount,
        validStepsCount,

        isTitleValid,

        progressValue,

        isReadyToPublish,
    };
}