import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { ChevronDown } from "lucide-react"
import { DropdownMenu } from "radix-ui"
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar>
            <SidebarHeader>
                <h1 className="scroll-m-20 text-2xl font-medium tracking-tight text-balance">
                    Filter
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
