
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar"

import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import RecipeCard from "@/home-page/recipe-card";


export const Route = createFileRoute("/")({ component: App });

function App() {

  function randomURL(): string | undefined {
    const imageUrlList = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
    const min = 0;
    const max = imageUrlList.length-1;
    const url = imageUrlList.at(Math.floor(Math.random() * (max - min + 1)) + min);
    return url;
  }
  return (
    <div className="flex justify-center">
      <div className="w-4/5 pt-10">
        <SidebarProvider>
          <AppSidebar />
          <main className="ps-15 pt-0 w-full h-1/2">
            <div className="flex flex-col gap-10">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Browse Recipes.
              </h1>
              <Field>

                <ButtonGroup>

                  <Input className="p-5" id="input-button-group w-full" placeholder="Type a recipe name to search." />
                  <Button variant="default" className="p-5 bg-blue-600"><SearchIcon />Search</Button>
                </ButtonGroup>
              </Field>

              {/* Main cards sections */}

              <div className="w-full rounded-2xl">
                <div className="grid grid-cols-3 w-full h-145 border p-5 rounded-3xl flex-col gap-5 overflow-y-scroll ">



                  <RecipeCard img_url={randomURL()} />
                  <RecipeCard img_url={randomURL()} />
                  <RecipeCard img_url={randomURL()} />
                  <RecipeCard img_url={randomURL()} />
                  <RecipeCard img_url={randomURL()} />
                  <RecipeCard img_url={"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />

                </div>
              </div>
            </div>


          </main>
        </SidebarProvider>
      </div>
    </div>

  );
}