import type { RecipeDetailResponse, RecipeListResponse } from "./types";

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

export async function getRecipes(params?: {
    sort?: string;
    diet?: string;
    max_time?: number;
}): Promise<RecipeListResponse[]> {
    const url = new URL(`${API}/recipes`);
    if (params?.sort) url.searchParams.append("sort", params.sort);
    if (params?.diet) url.searchParams.append("diet", params.diet);
    if (params?.max_time) url.searchParams.append("max_time", params.max_time.toString());

    const res = await fetch(url.toString(), {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch recipes");
    }

    const data = await res.json();
    return data.recipes || [];
}