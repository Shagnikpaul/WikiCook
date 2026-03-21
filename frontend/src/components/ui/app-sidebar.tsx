import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,

} from "@/components/ui/sidebar"



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
