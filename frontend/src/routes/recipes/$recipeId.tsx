import { createFileRoute } from '@tanstack/react-router'
import { useRecipe } from "@/hooks/recipes/useRecipe"

export const Route = createFileRoute('/recipes/$recipeId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { recipeId } =
        Route.useParams();

    const {
        data: recipe,
        isLoading,
        error,
    } = useRecipe(recipeId);

    // ---------- loading ----------

    if (isLoading) {

        return (
            <div className="p-8">
                Loading recipe...
            </div>
        );
    }

    // ---------- error ----------

    if (error || !recipe) {

        return (
            <div className="p-8">
                Failed to load recipe
            </div>
        );
    }

    // ---------- success ----------

    return (

        <div className="p-8 space-y-6">

            <h1 className="text-4xl font-bold">
                {recipe.title}
            </h1>

            <pre
                className="
                    rounded-lg
                    bg-muted
                    p-4
                    overflow-auto
                    text-sm
                "
            >
                {JSON.stringify(
                    recipe,
                    null,
                    2
                )}
            </pre>

        </div>
    );
}
