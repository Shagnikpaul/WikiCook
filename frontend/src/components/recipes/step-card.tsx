import type { StepInput } from "@/services/recipes/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Clock, X } from "lucide-react";

type StepCardProps = {
    step: StepInput;
    index: number;
    onRemove: (index: number) => void;
    onChange: (index: number, updatedStep: StepInput) => void;
};

export function StepCard({
    step,
    index,
    onRemove,
    onChange,
}: StepCardProps) {
    const updateStep = (
        field: keyof StepInput,
        value: string | number | null | Array<File>
    ) => {
        onChange(index, {
            ...step,
            [field]: value,
        });
    };

    return (
        <div className="relative pl-12 sm:pl-16 group">
            {/* Timeline Line */}
            <div className="absolute left-6 sm:left-8 top-10 bottom-[-32px] w-0.5 bg-slate-100 group-last:hidden" />
            
            {/* Step Number Circle */}
            <div className="absolute left-2 sm:left-4 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100 cursor-grab z-10">
                {step.step_number}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-shadow hover:shadow-md hover:border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading font-bold text-lg text-slate-800">
                        Step {step.step_number}
                    </h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 -mt-2 -mr-2 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <Textarea
                        value={step.instruction}
                        onChange={(e) => updateStep("instruction", e.target.value)}
                        placeholder="E.g. Heat the oil in a large pan over medium heat..."
                        className="min-h-24 text-base border-slate-200 resize-none bg-slate-50 focus:bg-white transition-colors p-4"
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-48">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                value={step.estimated_time_minutes ?? ""}
                                onChange={(e) => updateStep("estimated_time_minutes", e.target.value ? Number(e.target.value) : null)}
                                placeholder="Time (min)"
                                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white h-10"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-10 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-amber-200 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <ImagePlus className="w-4 h-4" />
                                        <span className="text-sm font-medium">Add Photo/Video</span>
                                    </div>
                                    <Input 
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files ?? []);
                                            updateStep("mediaFiles", files);
                                        }}
                                    />
                                </label>
                            </div>
                            {step.mediaFiles && step.mediaFiles.length > 0 && (
                                <p className="text-xs text-emerald-600 mt-1 absolute -bottom-5 right-0">
                                    {step.mediaFiles.length} file(s) selected
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}