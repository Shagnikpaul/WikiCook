
import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/ui/app-sidebar"

import {
  SidebarProvider,
} from "@/components/ui/sidebar"

export const Route = createFileRoute("/")({ component: App });

function App() {

  return (
    <div className="flex justify-center">
      <div className="w-4/5">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <p>Hello</p>

          </main>
        </SidebarProvider>
      </div>
    </div>

  );
}