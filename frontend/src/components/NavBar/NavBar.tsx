import { useEffect } from "react";
import { Link, redirect, useRouterState } from '@tanstack/react-router'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "../ui/responsive-dialog";
import {
    BadgeCheckIcon,
    BellIcon,
    LogOutIcon,
} from "lucide-react"
import { User } from "better-auth";
import { authClient } from "@/lib/auth-client";

export interface INavBarProps {
    user: User | undefined,
}

export function NavBar(props: INavBarProps) {
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;
    const onDelete = () => {
        authClient.signOut();
        redirect({
            to: '/',
        });
    }
    useEffect(() => {
        console.log('Yoooo changed to ', currentPath);
    }, [currentPath])


    return (
        <div className={`flex justify-center p-3 relative ${routerState.location.pathname === '/signup' || routerState.location.pathname === '/login' ? "hidden" : ""}`}>
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
                    {(props.user == undefined) ? <NavigationMenu>
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
                    </NavigationMenu> :
                        (
                            <ResponsiveDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Avatar size="lg">
                                                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                                                <AvatarFallback>LR</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <BadgeCheckIcon />
                                                Profile
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <BellIcon />
                                                Notifications
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <ResponsiveDialogTrigger>
                                            <DropdownMenuItem variant="destructive">
                                                <LogOutIcon />
                                                Sign Out
                                            </DropdownMenuItem>
                                        </ResponsiveDialogTrigger>
                                    </DropdownMenuContent>
                                    <ResponsiveDialogContent>
                                        <ResponsiveDialogHeader>
                                            <ResponsiveDialogTitle>Want to sign out of your account?</ResponsiveDialogTitle>
                                            <ResponsiveDialogDescription>
                                                If you sign out you won't be able to post comments, rate recipes, suggest edit to recipes or upload or generate new recipes. But you can still browse the community recipes.
                                            </ResponsiveDialogDescription>
                                        </ResponsiveDialogHeader>
                                        <ResponsiveDialogFooter>
                                            <ResponsiveDialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </ResponsiveDialogClose>
                                            <Button
                                                variant="destructive"
                                                onClick={onDelete}>
                                                Sign Out
                                            </Button>
                                        </ResponsiveDialogFooter>
                                    </ResponsiveDialogContent>
                                </DropdownMenu>
                            </ResponsiveDialog>
                        )}
                </div>
            </div>
        </div >
    );
}
