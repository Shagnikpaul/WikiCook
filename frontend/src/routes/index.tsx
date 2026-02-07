
import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/ui/app-sidebar"

import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react";
import { Scroller } from "@/components/ui/scroller";

import { Badge } from "@/components/ui/badge";
import RecipeCard from "@/home-page/recipe-card";


export const Route = createFileRoute("/")({ component: App });

function App() {

  return (
    <div className="flex justify-center">
      <div className="w-4/5 pt-10">
        <SidebarProvider>
          <AppSidebar />
          <main className="ps-15 pt-0 w-full">
            <div className="flex flex-col gap-10 min-h-full">
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

              <div className="w-full rounded-2xl min-h-8/12">
                <Scroller className="flex h-80 w-full min-h-full flex-col gap-2.5 p-4">
                  

                  
                  <RecipeCard />
                   
                  
                </Scroller>
              </div>
            </div>


          </main>
        </SidebarProvider>
      </div>
    </div>

  );
}