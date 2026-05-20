import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "@/components/recipes/basic-info-section";
import { IngredientsSection } from "@/components/recipes/ingredients-section";
import { StepsSection } from "@/components/recipes/steps-section";
import { useCreateRecipe as usePublishRecipe } from "@/hooks/recipes/usePublishRecipe";
import { useRecipeForm } from "@/hooks/recipes/useRecipeForm";

export const Route = createFileRoute(
  "/_protected/add-recipe"
)({
  component: AddRecipePage,
});

function AddRecipePage() {

  const navigate = useNavigate();

  const {
    publishRecipe,
    isSubmitting,
  } = usePublishRecipe();

  // ---------- recipe form hook ----------

  const {

    form,

    updateField,

    addIngredientRow,
    removeIngredientRow,
    updateIngredientRow,

    addStepRow,
    removeStepRow,
    updateStepRow,

    validIngredients,
    validSteps,

    validIngredientsCount,
    validStepsCount,

    isTitleValid,
    progressValue,
    isReadyToPublish,

  } = useRecipeForm();

  // ---------- submit ----------

  const handlePublish = async () => {

    if (!isTitleValid) {

      toast.error(
        "Recipe title is required"
      );

      return;
    }

    if (validIngredients.length === 0) {

      toast.error(
        "Add at least one ingredient"
      );

      return;
    }

    if (validSteps.length === 0) {

      toast.error(
        "Add at least one step"
      );

      return;
    }

    try {

      const recipeId =
        await publishRecipe(form);

      toast.success(
        "Recipe published successfully"
      );

      navigate({
        to: `/recipes/${recipeId}`,
      });

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to publish recipe"
      );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">

      <Card className="p-6 space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold">
            Add Recipe
          </h1>

          <p className="text-muted-foreground mt-2">
            Share your cooking recipe
            with the community.
          </p>

        </div>

        <Separator />

        {/* BASIC INFO */}

        <BasicInfoSection
          form={form}
          onUpdateField={updateField}
        />

        <Separator />

        {/* INGREDIENTS */}

        <IngredientsSection
          ingredients={form.ingredients}
          onAdd={addIngredientRow}
          onRemove={
            removeIngredientRow
          }
          onUpdate={
            updateIngredientRow
          }
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

      <div
        className="
          sticky
          bottom-4
          z-50
          mt-8
        "
      >

        <Card
          className="
            border
            shadow-2xl
            backdrop-blur
            bg-background/95
            px-5
            py-4
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* LEFT SIDE */}

            <div className="flex-1 space-y-3">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  flex-wrap
                "
              >

                <h3 className="font-semibold">
                  Recipe Status
                </h3>

                <Badge
                  variant={
                    isReadyToPublish
                      ? "default"
                      : "secondary"
                  }
                >
                  {isReadyToPublish
                    ? "Ready"
                    : "Incomplete"}
                </Badge>

              </div>

              <Progress
                value={progressValue}
              />

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                <Badge
                  variant={
                    isTitleValid
                      ? "default"
                      : "outline"
                  }
                >
                  {isTitleValid
                    ? "✓ Title"
                    : "Title Missing"}
                </Badge>

                <Badge
                  variant={
                    validIngredientsCount > 0
                      ? "default"
                      : "outline"
                  }
                >
                  {validIngredientsCount}
                  {" "}
                  Ingredients
                </Badge>

                <Badge
                  variant={
                    validStepsCount > 0
                      ? "default"
                      : "outline"
                  }
                >
                  {validStepsCount}
                  {" "}
                  Steps
                </Badge>

              </div>

            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-16"
            />

            {/* RIGHT SIDE */}

            <div className="flex justify-end">

              <Button
                type="button"
                onClick={handlePublish}
                disabled={
                  isSubmitting ||
                  !isReadyToPublish
                }
                size="lg"
                className="min-w-44"
              >
                {isSubmitting
                  ? "Publishing..."
                  : "Publish Recipe"}
              </Button>

            </div>

          </div>

        </Card>

      </div>

    </div>
  );
}