import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import type {
  IngredientInput,
  RecipeFormData,
  StepInput,
} from "@/services/recipes/types";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { BasicInfoSection } from "@/components/recipes/basic-info-section";
import { IngredientsSection } from "@/components/recipes/ingredients-section";
import { StepsSection } from "@/components/recipes/steps-section";

import { defaultRecipeForm } from "@/services/recipes/defaults";
import { useCreateRecipe } from "@/hooks/recipes/usePublishRecipe";

export const Route = createFileRoute("/_protected/add-recipe")({
  component: AddRecipePage,
});

function AddRecipePage() {
  const [form, setForm] = useState<RecipeFormData>(defaultRecipeForm);

  const navigate = useNavigate();

  // ✅ NEW HOOK (replaces all API + loading logic)
  const { publishRecipe, isSubmitting } = useCreateRecipe();

  // ---------- update top-level fields ----------
  const updateField = <TKey extends keyof RecipeFormData>(
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
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const removeIngredientRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredientRow = (
    index: number,
    updatedIngredient: IngredientInput
  ) => {
    setForm((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = updatedIngredient;

      return {
        ...prev,
        ingredients: updated,
      };
    });
  };

  // ---------- step handlers ----------
  const addStepRow = () => {
    const newStep: StepInput = {
      step_number: form.steps.length + 1,
      instruction: "",
      estimated_time_minutes: null,
      mediaFiles: [],
    };

    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const removeStepRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((_, i) => i !== index)
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
      const updated = [...prev.steps];
      updated[index] = updatedStep;

      return {
        ...prev,
        steps: updated,
      };
    });
  };

  // ---------- validation ----------
  const validIngredientsCount = form.ingredients.filter((i) =>
    i.ingredient_name.trim()
  ).length;

  const validStepsCount = form.steps.filter((s) =>
    s.instruction.trim()
  ).length;

  const isTitleValid = form.title.trim().length > 0;

  const completedSections = [
    isTitleValid,
    validIngredientsCount > 0,
    validStepsCount > 0,
  ].filter(Boolean).length;

  const progressValue = (completedSections / 3) * 100;
  const isReadyToPublish = completedSections === 3;

  // ---------- submit ----------
  const handlePublish = async () => {
    try {
      const recipeId = await publishRecipe(form);

      navigate({
        to: `/recipes/${recipeId}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish recipe");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="p-6 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Add Recipe</h1>
          <p className="text-muted-foreground mt-2">
            Share your cooking recipe with the community.
          </p>
        </div>

        <Separator />

        {/* BASIC INFO */}
        <BasicInfoSection form={form} onUpdateField={updateField} />

        <Separator />

        {/* INGREDIENTS */}
        <IngredientsSection
          ingredients={form.ingredients}
          onAdd={addIngredientRow}
          onRemove={removeIngredientRow}
          onUpdate={updateIngredientRow}
        />

        <Separator />

        {/* STEPS */}
        <StepsSection
          steps={form.steps}
          onAdd={addStepRow}
          onRemove={removeStepRow}
          onUpdate={updateStepRow}
        />
      </Card>

      {/* FLOATING STATUS BAR */}
      <div className="sticky bottom-4 z-50 mt-8">
        <Card className="border shadow-2xl backdrop-blur bg-background/95 px-5 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* LEFT */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">Recipe Status</h3>

                <Badge variant={isReadyToPublish ? "default" : "secondary"}>
                  {isReadyToPublish ? "Ready" : "Incomplete"}
                </Badge>
              </div>

              <Progress value={progressValue} />

              <div className="flex flex-wrap gap-2">
                <Badge variant={isTitleValid ? "default" : "outline"}>
                  {isTitleValid ? "✓ Title" : "Title Missing"}
                </Badge>

                <Badge
                  variant={validIngredientsCount > 0 ? "default" : "outline"}
                >
                  {validIngredientsCount} Ingredients
                </Badge>

                <Badge variant={validStepsCount > 0 ? "default" : "outline"}>
                  {validStepsCount} Steps
                </Badge>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-16"
            />

            {/* RIGHT */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || !isReadyToPublish}
                size="lg"
                className="min-w-44"
              >
                {isSubmitting ? "Publishing..." : "Publish Recipe"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}