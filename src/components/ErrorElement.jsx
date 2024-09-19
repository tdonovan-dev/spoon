import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorElement() {
  const error = useRouteError();


  return <div className="w-screen h-screen flex justify-center items-center p-4">
    <div className="text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Oops, we've ran into an issue 😓</h1>

      <Button asChild variant="secondary" className="mt-4">
        <Link to={`/`}>Retry</Link>
      </Button>
    </div>
  </div>
}
