import { IngredientCard } from "./ingredient-card";
import type { IngredientInput } from "@/services/recipes/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

type IngredientsSectionProps = {
    ingredients: Array<IngredientInput>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, ingredient: IngredientInput) => void;
};

export function IngredientsSection({
    ingredients,
    onAdd,
    onRemove,
    onUpdate,
}: IngredientsSectionProps) {
    return (
        <Card className="p-8 space-y-6 border-none shadow-sm ring-1 ring-slate-100 bg-white">
            <div>
                <h2 className="text-2xl font-bold font-heading text-slate-900">
                    Ingredients
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    List all ingredients, quantities, and preparation steps (e.g. "finely chopped").
                </p>
            </div>

            <div className="space-y-1">
                {ingredients.map((ingredient, index) => (
                    <IngredientCard
                        key={index}
                        ingredient={ingredient}
                        index={index}
                        onRemove={onRemove}
                        onChange={onUpdate}
                    />
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={onAdd}
                className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 h-12 rounded-xl transition-all"
            >
                <Plus className="w-4 h-4 mr-2" /> Add Ingredient
            </Button>
        </Card>
    );
}