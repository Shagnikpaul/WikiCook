import { useEffect } from "react";
import { Link, useRouterState } from '@tanstack/react-router'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { User } from "better-auth";



export interface INavBarProps {
    user: User | undefined,
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
                <div className="flex">
                    <p>Logged in as {props.user?.name}</p>
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
