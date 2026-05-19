import type {
    IngredientInput,
} from "@/services/recipes/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";


type IngredientCardProps = {
    ingredient: IngredientInput;
    index: number;

    onChange: (
        index: number,
        updatedIngredient: IngredientInput
    ) => void;

    onRemove: (index: number) => void;
};

export function IngredientCard({
    ingredient,
    index,
    onChange,
    onRemove,
}: IngredientCardProps) {

    const updateIngredient = (
        field: keyof IngredientInput,
        value:
            | string
            | number
            | null
    ) => {
        onChange(index, {
            ...ingredient,
            [field]: value,
        });
    };

    return (
        <Card className="p-4 space-y-4">

            <div className="flex items-center justify-between">

                <h3 className="font-medium">
                    Ingredient {index + 1}
                </h3>

                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => onRemove(index)}
                >
                    Remove
                </Button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Field>
                    <FieldLabel>
                        Ingredient Name
                    </FieldLabel>

                    <Input
                        value={ingredient.ingredient_name}
                        onChange={(e) =>
                            updateIngredient(
                                "ingredient_name",
                                e.target.value
                            )
                        }
                        placeholder="Tomato"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Quantity
                    </FieldLabel>

                    <Input
                        type="number"
                        value={ingredient.quantity ?? ""}
                        onChange={(e) =>
                            updateIngredient(
                                "quantity",
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                        placeholder="2"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Unit
                    </FieldLabel>

                    <Input
                        value={ingredient.unit}
                        onChange={(e) =>
                            updateIngredient(
                                "unit",
                                e.target.value
                            )
                        }
                        placeholder="cups"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Preparation Note
                    </FieldLabel>

                    <Input
                        value={
                            ingredient.preparation_note
                        }
                        onChange={(e) =>
                            updateIngredient(
                                "preparation_note",
                                e.target.value
                            )
                        }
                        placeholder="finely chopped"
                    />
                </Field>

            </div>

        </Card>
    );
}