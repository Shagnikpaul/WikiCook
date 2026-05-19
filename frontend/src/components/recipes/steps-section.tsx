import { StepCard } from "./step-card";
import type {
    StepInput,
} from "@/services/recipes/types";
import { Button } from "@/components/ui/button";



type StepsSectionProps = {
    steps: Array<StepInput>;

    onAdd: () => void;

    onRemove: (
        index: number
    ) => void;

    onUpdate: (
        index: number,
        updatedStep: StepInput
    ) => void;
};

export function StepsSection({
    steps,
    onAdd,
    onRemove,
    onUpdate,
}: StepsSectionProps) {

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-semibold">
                        Steps
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Add cooking instructions
                        step by step.
                    </p>

                </div>

                <Button
                    type="button"
                    onClick={onAdd}
                >
                    Add Step
                </Button>

            </div>

            <div className="space-y-4">

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

        </div>
    );
}