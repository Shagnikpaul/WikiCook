import type {
    StepInput,
} from "@/services/recipes/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Field,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


type StepCardProps = {
    step: StepInput;
    index: number;

    onRemove: (
        index: number
    ) => void;

    onChange: (
        index: number,
        updatedStep: StepInput
    ) => void;
};

export function StepCard({
    step,
    index,
    onRemove,
    onChange,
}: StepCardProps) {

    const updateStep = (
        field: keyof StepInput,
        value:
            | string
            | number
            | null
            | Array<File>
    ) => {
        onChange(index, {
            ...step,
            [field]: value,
        });
    };

    return (
        <Card className="p-4 space-y-4">

            <div className="flex items-center justify-between">

                <h3 className="font-medium">
                    Step {step.step_number}
                </h3>

                <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                        onRemove(index)
                    }
                >
                    Remove
                </Button>

            </div>

            <div className="grid grid-cols-1 gap-4">

                <Field>
                    <FieldLabel>
                        Instruction
                    </FieldLabel>

                    <Textarea
                        value={step.instruction}
                        onChange={(e) =>
                            updateStep(
                                "instruction",
                                e.target.value
                            )
                        }
                        placeholder="Heat oil in a pan..."
                        className="min-h-28"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Estimated Time (min)
                    </FieldLabel>

                    <Input
                        type="number"
                        value={
                            step.estimated_time_minutes
                            ?? ""
                        }
                        onChange={(e) =>
                            updateStep(
                                "estimated_time_minutes",
                                e.target.value
                                    ? Number(
                                        e.target.value
                                    )
                                    : null
                            )
                        }
                        placeholder="10"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Step Media
                    </FieldLabel>

                    <Input
                        type="file"
                        multiple
                        onChange={(e) => {

                            const files =
                                Array.from(
                                    e.target.files ?? []
                                );

                            updateStep(
                                "mediaFiles",
                                files
                            );
                        }}
                    />
                </Field>

            </div>

        </Card>
    );
}