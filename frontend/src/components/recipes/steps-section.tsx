import { StepCard } from "./step-card";
import type { StepInput } from "@/services/recipes/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

type StepsSectionProps = {
    steps: Array<StepInput>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, updatedStep: StepInput) => void;
};

export function StepsSection({
    steps,
    onAdd,
    onRemove,
    onUpdate,
}: StepsSectionProps) {
    return (
        <Card className="p-8 space-y-8 border-none shadow-sm ring-1 ring-slate-100 bg-white">
            <div>
                <h2 className="text-2xl font-bold font-heading text-slate-900">
                    Instructions
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Explain how to make the recipe, step by step.
                </p>
            </div>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <StepCard
                        key={index}
                        step={step}
                        index={index}
                        onRemove={onRemove}
                        onChange={onUpdate}
                    />
                ))}
            </div>

            <div className="pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onAdd}
                    className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 h-12 rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
            </div>
        </Card>
    );
}