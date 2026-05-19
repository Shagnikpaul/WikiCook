import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="space-y-6">

            <div>
                <h2 className="text-2xl font-semibold">
                    Basic Information
                </h2>

                <p className="text-sm text-muted-foreground">
                    Main details about the recipe.
                </p>
            </div>

            <FieldGroup>

                <Field>
                    <FieldLabel>
                        Recipe Title
                    </FieldLabel>

                    <Input
                        value={form.title}
                        onChange={(e) =>
                            onUpdateField(
                                "title",
                                e.target.value
                            )
                        }
                        placeholder="Paneer Butter Masala"
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Description
                    </FieldLabel>

                    <Textarea
                        value={form.description}
                        onChange={(e) =>
                            onUpdateField(
                                "description",
                                e.target.value
                            )
                        }
                        placeholder="Describe your recipe..."
                        className="min-h-32"
                    />
                </Field>

            </FieldGroup>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Field>
                    <FieldLabel>
                        Servings
                    </FieldLabel>

                    <Input
                        type="number"
                        value={form.servings ?? ""}
                        onChange={(e) =>
                            onUpdateField(
                                "servings",
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Prep Time (min)
                    </FieldLabel>

                    <Input
                        type="number"
                        value={
                            form.prep_time_minutes ?? ""
                        }
                        onChange={(e) =>
                            onUpdateField(
                                "prep_time_minutes",
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel>
                        Cook Time (min)
                    </FieldLabel>

                    <Input
                        type="number"
                        value={
                            form.cook_time_minutes ?? ""
                        }
                        onChange={(e) =>
                            onUpdateField(
                                "cook_time_minutes",
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                    />
                </Field>

            </div>

        </div>
    );
}