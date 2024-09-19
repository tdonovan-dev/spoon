import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

import { recipesApi } from "../api";

const RECIPES_PER_PAGE = 5;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchData = useCallback(
    async (page = 1) => {
      try {
        const offset = (page - 1) * RECIPES_PER_PAGE;
        const data = await recipesApi.searchRecipes(
          searchTerm,
          offset,
          RECIPES_PER_PAGE,
        );

        setTotalRecords(data.totalResults);
        setRecipes(data.results);

        const filters = Array.from(
          new Set(data.results.flatMap((recipe) => recipe.cuisines)),
        );
        setFilterList(filters);
      } catch (err) {
        console.log(err);
      } finally {
        setIsDataLoaded(true);
        setShouldFetch(false);
      }
    },
    [searchTerm],
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    setCurrentPage(1);
    setShouldFetch(true);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData(currentPage);
    }
  }, [currentPage, shouldFetch, fetchData]);

  useEffect(() => {
    if (isDataLoaded) {
      const resultSection = document.getElementById("results-section");
      if (resultSection) {
        resultSection?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isDataLoaded]);

  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
    setShouldFetch(true);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      filter === "All" || recipe.cuisines.includes(filter) || filter === ""
    );
  });

  return (
    <div>
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              {`Let's Get Cooking🧑‍🍳`}
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Find your next home cooked meal through the search bar.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 justify-center">
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      </section>

      {totalRecords > 0 && (
        <section id="results-section" className="bg-gray-50 px-4 py-12">
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {recipes.length > 0 ? "Search Results" : "No Results"}
            </h2>
            <div className="mb-6">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cuisines</SelectItem>
                  {filterList.map((filter, idx) => (
                    <SelectItem key={idx} value={filter}>
                      {filter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredRecipes.map((recipe) => (
                <Link
                  to={`/recipe?id=${recipe.id}`}
                  key={recipe.id}
                  className="block"
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{recipe.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: recipe.summary.slice(0, 100) + "...",
                          }}
                        />

                        {recipe.cuisines.map((cuisine, idx) => (
                          <Badge
                            variant={"secondary"}
                            key={idx}
                            className="text-sm text-muted-foreground mt-3 mr-2"
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem
                    className={
                      currentPage <= 1 ? "invisible" : "cursor-pointer"
                    }
                  >
                    <PaginationPrevious
                      onClick={() => handlePaginationChange(currentPage - 1)}
                    />
                  </PaginationItem>
                  <PaginationItem className="mx-5">
                    {currentPage +
                      " / " +
                      Math.ceil(totalRecords / RECIPES_PER_PAGE)}
                  </PaginationItem>
                  <PaginationItem
                    className={
                      currentPage >= Math.ceil(totalRecords / RECIPES_PER_PAGE)
                        ? "invisible"
                        : "cursor-pointer"
                    }
                  >
                    <PaginationNext
                      onClick={() => handlePaginationChange(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
