import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import RecipeDetailLoading from "../components/LoadingElement";
import { recipesApi } from "../api";

const Recipe = () => {
  const [searchParams] = useSearchParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const recipeId = searchParams.get("id");
    if (!recipeId) return;

    async function fetchData() {
      try {
        const data = await recipesApi.getRecipeDetails(recipeId);

        setRecipeDetails(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  if (isLoading) return <RecipeDetailLoading />;

  return (
    <div className="container max-w-[60%] w-full mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex justify-between">
            {recipeDetails?.title}
            <Button asChild variant="secondary">
              <Link to={`/`}>Home</Link>
            </Button>
          </CardTitle>
          <div className="flex gap-2 mt-2">
            {recipeDetails?.vegan && <Badge variant="secondary">Vegan</Badge>}
            {recipeDetails?.dairyFree && (
              <Badge variant="secondary">Dairy-Free</Badge>
            )}
            {recipeDetails?.glutenFree && (
              <Badge variant="secondary">Gluten-Free</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={recipeDetails?.image}
            alt={recipeDetails?.title}
            className="w-full h-64 object-cover rounded-md mb-6"
          />

          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc pl-6 mb-6">
            {recipeDetails?.extendedIngredients?.map((ingredient, index) => (
              <li key={index}>
                <span className="font-medium">
                  {ingredient?.name.charAt(0).toUpperCase() +
                    ingredient?.name.slice(1)}
                </span>
                :{" "}
                {ingredient?.measures.us.amount +
                  " " +
                  ingredient?.measures.us.unitLong}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Cooking Instructions</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: recipeDetails?.instructions,
            }}
            className="[&_ol]:list-decimal [&_ol]:pl-6"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipe;
