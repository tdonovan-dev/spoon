const reqHeaders = new Headers();
reqHeaders.set("x-api-key", import.meta.env.VITE_API_KEY);

export const searchRecipes = async (query, offset, number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/recipes/complexSearch?query=${query}&offset=${offset}&number=${number}&addRecipeInformation=true`,
    {
      headers: reqHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return await response.json();
};

export const getRecipeDetails = async (recipeId) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/recipes/${recipeId}/information`,
    {
      headers: reqHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipe information");
  }

  return await response.json();
};
