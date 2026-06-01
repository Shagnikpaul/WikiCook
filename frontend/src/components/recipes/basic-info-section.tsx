import {
    Field,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe, Lock, ChefHat, Clock, Users } from "lucide-react";

import type { RecipeFormData } from "@/services/recipes/types";

type Props = {
    form: RecipeFormData;

    onUpdateField: <
        TKey extends keyof RecipeFormData
    >(
        key: TKey,
        value: RecipeFormData[TKey]
    ) => void;
};

export function BasicInfoSection({
    form,
    onUpdateField,
}: Props) {
    return (
        <Card className="p-8 space-y-8 border-none shadow-sm ring-1 ring-slate-100 bg-white">
            <div className="space-y-6">
                <Field>
                    <Input
                        value={form.title}
                        onChange={(e) =>
                            onUpdateField(
                                "title",
                                e.target.value
                            )
                        }
                        placeholder="Recipe Title e.g. Paneer Butter Masala"
                        className="text-3xl md:text-4xl font-heading font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-slate-300 h-auto py-2"
                    />
                </Field>

                <Field>
                    <Textarea
                        value={form.description}
                        onChange={(e) =>
                            onUpdateField(
                                "description",
                                e.target.value
                            )
                        }
                        placeholder="Share the story behind this recipe, what makes it special, or any quick tips..."
                        className="min-h-32 text-lg border-none shadow-none px-0 focus-visible:ring-0 resize-none placeholder:text-slate-400 bg-transparent py-2"
                    />
                </Field>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border border-amber-100/50">
                <Field>
                    <FieldLabel className="text-slate-600 flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-amber-500"/> Prep Time (min)</FieldLabel>
                    <Input
                        type="number"
                        value={form.prep_time_minutes ?? ""}
                        onChange={(e) =>
                            onUpdateField(
                                "prep_time_minutes",
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                        className="bg-white border-amber-100 focus-visible:ring-amber-200"
                        placeholder="15"
                    />
                </Field>

                <Field>
                    <FieldLabel className="text-slate-600 flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-amber-500"/> Cook Time (min)</FieldLabel>
                    <Input
                        type="number"
                        value={form.cook_time_minutes ?? ""}
                        onChange={(e) =>
                            onUpdateField(
                                "cook_time_minutes",
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                        className="bg-white border-amber-100 focus-visible:ring-amber-200"
                        placeholder="30"
                    />
                </Field>

                <Field>
                    <FieldLabel className="text-slate-600 flex items-center gap-1.5 font-medium"><Users className="w-4 h-4 text-amber-500"/> Servings</FieldLabel>
                    <Input
                        type="number"
                        value={form.servings ?? ""}
                        onChange={(e) =>
                            onUpdateField(
                                "servings",
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                        className="bg-white border-amber-100 focus-visible:ring-amber-200"
                        placeholder="4"
                    />
                </Field>

                <Field>
                    <FieldLabel className="text-slate-600 flex items-center gap-1.5 font-medium"><ChefHat className="w-4 h-4 text-amber-500"/> Difficulty</FieldLabel>
                    <Select
                        value={form.difficulty || "easy"}
                        onValueChange={(value) => onUpdateField("difficulty", value as any)}
                    >
                        <SelectTrigger className="bg-white border-amber-100 focus:ring-amber-200">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex justify-start pt-4 border-t border-slate-100">
                <div className="w-48">
                    <Field>
                        <FieldLabel className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Visibility</FieldLabel>
                        <Select
                            value={form.visibility}
                            onValueChange={(value) => onUpdateField("visibility", value as any)}
                        >
                            <SelectTrigger className="border-slate-200 shadow-sm">
                                <SelectValue placeholder="Visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-emerald-500" /> Public
                                    </div>
                                </SelectItem>
                                <SelectItem value="private">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-slate-400" /> Private
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </div>
        </Card>
    );
}