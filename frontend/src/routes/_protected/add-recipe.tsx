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
    <div className="min-h-screen bg-transparent pb-24">
      <div className="container mx-auto max-w-7xl py-8 px-4 md:py-12 md:px-8">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 tracking-tight">
            Create a Recipe
          </h1>
          <p className="text-lg text-slate-600 mt-3 max-w-2xl">
            Share your culinary creations with the WikiCook community. A great recipe starts with clear instructions and accurate measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN CONTENT (LEFT) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-8">
            <BasicInfoSection
              form={form}
              onUpdateField={updateField}
            />

            <IngredientsSection
              ingredients={form.ingredients}
              onAdd={addIngredientRow}
              onRemove={removeIngredientRow}
              onUpdate={updateIngredientRow}
            />

            <StepsSection
              steps={form.steps}
              onAdd={addStepRow}
              onRemove={removeStepRow}
              onUpdate={updateStepRow}
            />
          </div>

          {/* SIDEBAR (RIGHT) */}
          <div className="lg:col-span-4 xl:col-span-4 sticky top-24">
            <Card className="p-6 border-amber-200 shadow-sm bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-xl mb-6 text-slate-800">
                Recipe Status
              </h3>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Progress</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-2 bg-slate-100" />
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Basic Info</span>
                  {isTitleValid ? (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Complete</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500">Missing</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Ingredients</span>
                  {validIngredientsCount > 0 ? (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">{validIngredientsCount} Added</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500">Missing</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Steps</span>
                  {validStepsCount > 0 ? (
                    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">{validStepsCount} Added</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500">Missing</Badge>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || !isReadyToPublish}
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg h-14 shadow-sm transition-all"
              >
                {isSubmitting ? "Publishing..." : "Publish Recipe"}
              </Button>
              
              {!isReadyToPublish && (
                <p className="text-center text-xs text-slate-500 mt-4">
                  Complete all sections to publish.
                </p>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}