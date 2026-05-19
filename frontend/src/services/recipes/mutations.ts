import { api } from "./recipeApi";

import type {
  IngredientInput,
  RecipeFormData,
  StepInput,
} from "./types";


// ---------- create recipe ----------

export const createRecipe = async (
  data: RecipeFormData
) => {

  const res = await api.post(
    "/recipes",
    {
      title: data.title,
      description:
        data.description,

      servings:
        data.servings,

      prep_time_minutes:
        data.prep_time_minutes,

      cook_time_minutes:
        data.cook_time_minutes,

      visibility:
        data.visibility,
    }
  );

  return res.data;
};


// ---------- add ingredient ----------

export const addIngredient =
  async (
    recipeId: string,
    data: IngredientInput
  ) => {

    const res = await api.post(
      `/recipes/${recipeId}/ingredients`,
      data
    );

    return res.data;
  };


// ---------- add step ----------

export const addStep = async (
  recipeId: string,
  data: StepInput
) => {

  const res = await api.post(
    `/recipes/${recipeId}/steps`,
    {
      step_number:
        data.step_number,

      instruction:
        data.instruction,

      estimated_time_minutes:
        data.estimated_time_minutes,
    }
  );

  return res.data;
};


// ---------- upload step media ----------

export const uploadStepMedia =
  async (
    stepId: string,
    file: File
  ) => {

    const formData =
      new FormData();

    formData.append(
      "media_type",
      "image"
    );

    formData.append(
      "file",
      file
    );

    const res = await api.post(
      `/steps/${stepId}/media`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;
  };