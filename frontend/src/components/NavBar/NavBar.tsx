import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getRouter } from "@/router";
import { routeTree } from "@/routeTree.gen";
import { createRouter, Link, ParsedLocation, useRouterState } from '@tanstack/react-router'
import { useEffect } from "react";

export interface INavBarProps {
    route: ParsedLocation
}

export function NavBar(props: INavBarProps) {
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;
    useEffect(() => {
        console.log('Yoooo changed to ', currentPath);
    }, [currentPath])


    return (
        <div className={`flex justify-center p-3 border-b relative ${routerState.location.pathname === '/signup' || routerState.location.pathname === '/login' ? "hidden" : ""}`}>
            <div className="w-4/5 flex justify-between">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link to="/">
                                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                        WikiCook
                                    </h3>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>


                </NavigationMenu>
                <div>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link to="/login">
                                        <p className={`underline`}>Log In</p>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link to="/signup">
                                        <p className="underline">Sign Up</p>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>


                    </NavigationMenu>
                </div>

            </div>
        </div>
    );
}
