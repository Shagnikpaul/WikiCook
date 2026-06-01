import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRecipe } from "@/hooks/recipes/useRecipe";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { 
    Clock, 
    Utensils, 
    Globe, 
    Tag, 
    Check, 
    ChefHat, 
    ArrowLeft,
    RotateCcw,
    Sparkles,
    Star,
    MessageSquare
} from "lucide-react";

export const Route = createFileRoute(
    "/recipes/$recipeId"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { recipeId } = Route.useParams();

    const {
        data: recipe,
        isLoading,
        error,
    } = useRecipe(recipeId);

    // ---------- interactive cooking states ----------
    const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

    // ---------- loading ----------
    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent dark:bg-transparent p-8 space-y-8 animate-pulse">
                <div className="container mx-auto max-w-6xl space-y-8">
                    <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="h-[400px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                            <div className="h-[300px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
                            <div className="h-[400px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- error ----------
    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-transparent dark:bg-transparent flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm text-center space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-red-50 text-red-500 mb-2">
                        <Utensils className="w-12 h-12" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-white">Failed to load recipe</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">The recipe you are looking for might not exist or we encountered an error fetching it.</p>
                    <Button asChild className="mt-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // ---------- interactive logic ----------
    const checkedIngredientsCount = Object.values(checkedIngredients).filter(Boolean).length;
    const totalSteps = recipe.steps.length;
    const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
    const stepsProgress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

    const toggleIngredient = (id: string) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleStep = (id: string) => {
        setCompletedSteps(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const resetCookingProgress = () => {
        setCheckedIngredients({});
        setCompletedSteps({});
    };

    // Auto-highlight active step (first uncompleted step)
    const activeStepNumber = recipe.steps.find(s => !completedSteps[s.id])?.step_number ?? (recipe.steps.length + 1);

    // Curated title-based covers to avoid placeholders
    const getRecipeCoverImage = () => {
        // 1. Look for first image media in steps
        for (const step of recipe.steps) {
            const imgMedia = step.media.find(m => m.type === "image");
            if (imgMedia) return imgMedia.url;
        }
        
        // 2. Title-based fallback stock photos from Unsplash
        const titleLower = recipe.title.toLowerCase();
        if (titleLower.includes("pizza") || titleLower.includes("margherita")) {
            return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80";
        }
        if (titleLower.includes("pasta") || titleLower.includes("spaghetti") || titleLower.includes("carbonara")) {
            return "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1200&auto=format&fit=crop&q=80";
        }
        if (titleLower.includes("salad")) {
            return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80";
        }
        if (titleLower.includes("cake") || titleLower.includes("dessert") || titleLower.includes("sweet") || titleLower.includes("cookie")) {
            return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80";
        }
        if (titleLower.includes("burger")) {
            return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=80";
        }
        if (titleLower.includes("chicken") || titleLower.includes("meat")) {
            return "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=1200&auto=format&fit=crop&q=80";
        }
        
        // Curated premium generic cooking backdrop
        return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80";
    };

    return (
        <div className="min-h-screen bg-transparent dark:bg-transparent text-zinc-800 dark:text-zinc-200">
            <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
                
                {/* TOP BAR / BACK BUTTON */}
                <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Recipes
                        </Link>
                    </Button>
                    {(checkedIngredientsCount > 0 || completedStepsCount > 0) && (
                        <Button variant="outline" size="sm" onClick={resetCookingProgress} className="text-xs gap-1.5 h-8 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-orange-700 dark:text-orange-300">
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset Progress
                        </Button>
                    )}
                </div>

                {/* TWO COLUMN VERTICAL PANEL LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL: SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                            
                            {/* TITLE & BADGES */}
                            <div className="space-y-4">
                                <h1 className="font-heading text-3xl font-extrabold text-zinc-950 dark:text-white leading-tight">
                                    {recipe.title}
                                </h1>
                                
                                {/* CREATOR INFO */}
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center font-bold text-sm text-orange-700 dark:text-orange-400">
                                        {recipe.creator.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">a recipe by</p>
                                        <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{recipe.creator.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DYNAMIC ACTION BUTTONS */}
                            <div className="flex flex-row gap-3 pt-1">
                                <Button 
                                    onClick={resetCookingProgress}
                                    className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-semibold py-2.5 rounded-xl border-0 shadow-xs transition-colors text-sm"
                                >
                                    Cooked this dish ?
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 bg-[#59C1F9] hover:bg-[#3FAEF5] border-0 text-white font-semibold py-2.5 rounded-xl shadow-xs transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                    Save to List
                                </Button>
                            </div>

                            {/* RECIPE METADATA */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-xl bg-[#FCFAF6] dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40">
                                    <ChefHat className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Servings</p>
                                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                        {recipe.servings ? `${recipe.servings}` : "N/A"}
                                    </p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-[#FCFAF6] dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40">
                                    <Clock className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Cook Time</p>
                                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 font-heading">
                                        {recipe.cook_time_minutes ? `${recipe.cook_time_minutes}m` : "N/A"}
                                    </p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-[#FCFAF6] dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40">
                                    <Globe className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Source</p>
                                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate max-w-full px-1">
                                        {recipe.source_type || "WikiCook"}
                                    </p>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            {recipe.description && (
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">Description</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                        {recipe.description}
                                    </p>
                                </div>
                            )}

                            {/* TAGS */}
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {/* Community Verified Badge */}
                                    <span className="bg-[#E2F7E6] text-[#1D7A37] dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        Community Verified
                                    </span>
                                    {/* Vegetarian or custom tag */}
                                    {recipe.tags.map(tag => (
                                        <span 
                                            key={tag} 
                                            className="bg-[#FFF4E5] text-[#B26A00] dark:bg-orange-950/20 dark:text-orange-300 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase"
                                        >
                                            <Tag className="w-3 h-3 text-[#B26A00] dark:text-orange-400" />
                                            {tag}
                                        </span>
                                    ))}
                                    {recipe.tags.length === 0 && (
                                        <span className="bg-[#E2F7E6] text-[#1D7A37] dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                            Vegetarian
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* RATINGS PLACEHOLDER */}
                            <div className="space-y-2 pt-2">
                                <p className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">Ratings</p>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-5 h-5 fill-[#F5A623] text-[#F5A623]" />
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[#00B894] leading-none">
                                            4.9/5
                                        </div>
                                        <div className="text-[11px] text-zinc-500 font-bold mt-1">
                                            1.2k users cooked it.
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-400 italic">
                                    *Please try this recipe before rating it.
                                </p>
                            </div>

                            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                            {/* COMMENTS PLACEHOLDER */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                                    <p className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">Comments</p>
                                </div>
                                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Comments section coming soon...</p>
                                </div>
                            </div>

                        </Card>
                    </div>

                    {/* RIGHT PANEL: MAIN CONTENT WIDE PANEL */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-8 overflow-hidden">
                            
                            {/* RECIPE THUMBNAIL */}
                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-200/30 shadow-xs group">
                                <img
                                    src={getRecipeCoverImage()}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                                />
                                {recipe.confidence_score !== null && recipe.confidence_score !== undefined && (
                                    <Badge className="absolute top-4 right-4 bg-white/95 text-zinc-900 border border-zinc-200 font-semibold flex items-center gap-1 px-3 py-1 rounded-full shadow-xs">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        {Math.round(recipe.confidence_score * 100)}% Match
                                    </Badge>
                                )}
                            </div>

                            {/* INGREDIENTS SECTION */}
                            <div className="space-y-4">
                                <h2 className="font-cursive text-4xl text-zinc-900 dark:text-zinc-100 select-none">
                                    Ingredients
                                </h2>
                                
                                <div className="grid gap-3">
                                    {recipe.ingredients.map((ingredient, index) => {
                                        const isChecked = !!checkedIngredients[ingredient.id];
                                        return (
                                            <div
                                                key={ingredient.id}
                                                onClick={() => toggleIngredient(ingredient.id)}
                                                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                                    isChecked 
                                                        ? "bg-zinc-50/40 dark:bg-zinc-950/20 border-zinc-100 dark:border-zinc-900 opacity-60" 
                                                        : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 hover:border-orange-200 dark:hover:border-orange-900/60 hover:shadow-xs"
                                                }`}
                                            >
                                                <div className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs ${
                                                    isChecked
                                                        ? "bg-orange-500 border-orange-500 text-white"
                                                        : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400"
                                                }`}>
                                                    {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                                                </div>
                                                <div className="flex-1 pt-0.5">
                                                    <p className={`font-semibold text-base ${isChecked ? "text-zinc-400/80 dark:text-zinc-500/80 line-through" : "text-zinc-800 dark:text-zinc-200"}`}>
                                                        {ingredient.name}
                                                    </p>
                                                    {(ingredient.quantity || ingredient.preparation_note) && (
                                                        <div className={`text-sm mt-1 flex flex-wrap gap-2 ${isChecked ? "text-zinc-400/60 dark:text-zinc-600/60" : "text-zinc-500 dark:text-zinc-400"}`}>
                                                            {ingredient.quantity && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                                                                </span>
                                                            )}
                                                            {ingredient.preparation_note && (
                                                                <span className="inline-flex items-center gap-1 before:content-['•'] before:mx-1 before:text-zinc-300">
                                                                    {ingredient.preparation_note}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                            {/* PREPARATION STEPS SECTION */}
                            <div className="space-y-6">
                                
                                {/* Header with flat solid progress bar */}
                                <div className="space-y-3">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-heading text-xl font-extrabold text-zinc-900 dark:text-white">
                                            Preparation Steps
                                        </h2>
                                        <Badge variant="outline" className="text-xs font-semibold border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20">
                                            {completedStepsCount}/{totalSteps} Completed
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Progress value={stepsProgress} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
                                        <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                                            <span>COOK PROGRESS</span>
                                            <span>{stepsProgress}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* STEPS LIST TIMELINE (ORANGE/YELLOW THEME, NO GRADIENTS) */}
                                <div className="relative pl-8 border-l-2 border-orange-100 dark:border-orange-950 ml-3 space-y-6">
                                    {recipe.steps.map((step) => {
                                        const isStepCompleted = !!completedSteps[step.id];
                                        const isActiveStep = step.step_number === activeStepNumber;

                                        return (
                                            <div key={step.id} className="relative group">
                                                
                                                {/* TIMELINE DOT */}
                                                <div 
                                                    onClick={() => toggleStep(step.id)}
                                                    className={`absolute -left-12 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 cursor-pointer transition-all duration-200 shadow-xs z-10 font-bold text-xs ${
                                                        isStepCompleted 
                                                            ? "bg-orange-500 border-orange-500 text-white" 
                                                            : isActiveStep
                                                                ? "bg-amber-400 border-amber-400 text-zinc-900 ring-4 ring-amber-400/20 scale-105"
                                                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 hover:border-orange-400 hover:text-orange-500"
                                                    }`}
                                                >
                                                    {isStepCompleted ? (
                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    ) : (
                                                        <span>{step.step_number}</span>
                                                    )}
                                                </div>

                                                {/* STEP CONTENT CONTAINER */}
                                                <div 
                                                    onClick={() => toggleStep(step.id)}
                                                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:border-orange-200 dark:hover:border-orange-900/60 hover:shadow-xs ${
                                                        isStepCompleted
                                                            ? "bg-zinc-50/40 dark:bg-zinc-950/20 border-zinc-100 dark:border-zinc-900 opacity-60"
                                                            : isActiveStep
                                                                ? "bg-amber-50/30 dark:bg-amber-950/10 border-amber-300 dark:border-amber-900/60 shadow-xs"
                                                                : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60"
                                                    }`}
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-extrabold font-heading ${
                                                                isActiveStep ? "text-orange-600 dark:text-orange-400" : "text-zinc-900 dark:text-zinc-200"
                                                            }`}>
                                                                Step {step.step_number}
                                                            </span>
                                                            {step.estimated_time_minutes && (
                                                                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3 text-orange-500" />
                                                                    {step.estimated_time_minutes} MINS
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                                            <Checkbox 
                                                                checked={isStepCompleted} 
                                                                onCheckedChange={() => toggleStep(step.id)}
                                                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Instruction Text */}
                                                    <p className={`text-sm md:text-base leading-relaxed transition-all duration-200 ${
                                                        isStepCompleted ? "text-zinc-400/80 dark:text-zinc-500/80 line-through" : "text-zinc-700 dark:text-zinc-300"
                                                    }`}>
                                                        {step.instruction}
                                                    </p>

                                                    {/* Step Media */}
                                                    {step.media.length > 0 && (
                                                        <div className="grid gap-3 sm:grid-cols-2 mt-4" onClick={e => e.stopPropagation()}>
                                                            {step.media.map((media, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 aspect-video"
                                                                >
                                                                    {media.type === "image" ? (
                                                                        <img
                                                                            src={media.url}
                                                                            alt={`Step ${step.step_number} Media`}
                                                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            controls
                                                                            className="w-full h-full object-cover"
                                                                        >
                                                                            <source src={media.url} />
                                                                        </video>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>

                            </div>

                        </Card>
                    </div>

                </div>

            </div>
        </div>
    );
}