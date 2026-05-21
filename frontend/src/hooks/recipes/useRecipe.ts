
import { useQuery } from "@tanstack/react-query";

import { getRecipeById } from "@/services/recipes/queries";

export function useRecipe(
    recipeId: string
) {

    return useQuery({
        queryKey: ["recipe", recipeId],

        queryFn: () =>
            getRecipeById(recipeId),

        enabled: !!recipeId,
    });
}