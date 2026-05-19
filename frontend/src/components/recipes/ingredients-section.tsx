import { IngredientCard } from "./ingredient-card";
import type {
    IngredientInput,
} from "@/services/recipes/types";
import { Button } from "@/components/ui/button";



type IngredientsSectionProps = {
    ingredients: Array<IngredientInput>;

    onAdd: () => void;

    onRemove: (
        index: number
    ) => void;

    onUpdate: (
        index: number,
        ingredient: IngredientInput
    ) => void;
};

export function IngredientsSection({
    ingredients,
    onAdd,
    onRemove,
    onUpdate,
}: IngredientsSectionProps) {
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-2xl font-semibold">
                        Ingredients
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Add all ingredients required.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={onAdd}
                >
                    Add Ingredient
                </Button>

            </div>

            <div className="space-y-4">

                {ingredients.map(
                    (ingredient, index) => (
                        <IngredientCard
                            key={index}
                            ingredient={ingredient}
                            index={index}
                            onRemove={onRemove}
                            onChange={onUpdate}
                        />
                    )
                )}

            </div>

        </div>
    );
}