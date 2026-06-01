import type { IngredientInput } from "@/services/recipes/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, X } from "lucide-react";

type IngredientCardProps = {
    ingredient: IngredientInput;
    index: number;
    onChange: (index: number, updatedIngredient: IngredientInput) => void;
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
        value: string | number | null
    ) => {
        onChange(index, {
            ...ingredient,
            [field]: value,
        });
    };

    return (
        <div className="flex items-start gap-2 sm:gap-3 group relative p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="mt-2.5 text-slate-300 group-hover:text-slate-400 cursor-grab hidden sm:block">
                <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-12 gap-2 sm:gap-3 flex-1">
                <div className="col-span-4 sm:col-span-2">
                    <Input
                        type="number"
                        value={ingredient.quantity ?? ""}
                        onChange={(e) => updateIngredient("quantity", e.target.value ? Number(e.target.value) : null)}
                        placeholder="Qty"
                        className="bg-white border-slate-200 shadow-sm"
                    />
                </div>
                
                <div className="col-span-8 sm:col-span-3">
                    <Input
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient("unit", e.target.value)}
                        placeholder="Unit (e.g. cups)"
                        className="bg-white border-slate-200 shadow-sm"
                    />
                </div>
                
                <div className="col-span-12 sm:col-span-4">
                    <Input
                        value={ingredient.ingredient_name}
                        onChange={(e) => updateIngredient("ingredient_name", e.target.value)}
                        placeholder="Ingredient name"
                        className="bg-white border-slate-200 shadow-sm font-medium"
                    />
                </div>
                
                <div className="col-span-12 sm:col-span-3">
                    <Input
                        value={ingredient.preparation_note}
                        onChange={(e) => updateIngredient("preparation_note", e.target.value)}
                        placeholder="Prep (e.g. diced)"
                        className="bg-white border-slate-200 shadow-sm text-sm italic"
                    />
                </div>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 shrink-0 rounded-lg"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}