import type { RecipeDetailResponse } from "./types";

const API = import.meta.env.VITE_API_URL;

export async function getRecipeById(
    recipeId: string
): Promise<RecipeDetailResponse> {

    const res = await fetch(
        `${API}/recipes/${recipeId}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch recipe");
    }

    return res.json();
}