"use client";

import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Search, Menu, UserCircle, ChefHat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth/auth";
import { queryClient } from "@/lib/query-client";

export function Navbar1({ className }: { className?: string }) {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: "/login" });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { title: "Home", to: "/" },
    { title: "Explore", to: "/explore" as any },
    { title: "Categories", to: "/categories" as any },
    { title: "Trending", to: "/trending" as any },
  ];

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm", className)}>
      <div className="container flex h-16 max-w-[1600px] items-center px-4 lg:px-8 mx-auto">
        
        {/* Mobile Nav & Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-left font-heading text-2xl italic text-primary flex items-center gap-2">
                  <ChefHat className="w-6 h-6" /> WikiCook
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6 flex-1">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      to={link.to}
                      className="block px-3 py-2 text-lg font-medium transition-colors hover:text-primary hover:bg-muted/50 rounded-md text-muted-foreground"
                      activeProps={{ className: "text-foreground font-semibold bg-muted/50" }}
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3 border-t pt-6">
                  {user ? (
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button className="w-full justify-start" asChild>
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2 ml-2">
            <ChefHat className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold italic text-primary mt-1 tracking-tight">WikiCook</span>
          </Link>
        </div>

        {/* Desktop Left: Logo & Links */}
        <div className="hidden md:flex md:items-center md:gap-8 lg:gap-10">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <ChefHat className="w-7 h-7 text-primary" />
            <span className="font-heading text-2xl font-bold italic text-primary mt-1 tracking-tight">WikiCook</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-semibold" }}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Center: Search (hidden on home) */}
        <div className="flex flex-1 items-center justify-end md:justify-center px-4 md:px-8">
          {!isHome && (
            <div className="w-full max-w-md relative hidden sm:block transition-all duration-300 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-full rounded-full bg-muted/50 pl-10 pr-4 h-10 border-transparent focus:border-primary/30 focus:bg-background transition-all shadow-none hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          )}
          {!isHome && (
             <Button variant="ghost" size="icon" className="sm:hidden ml-auto">
               <Search className="h-5 w-5" />
             </Button>
          )}
        </div>

        {/* Desktop Right: Auth */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 hover:bg-muted/80 p-0 overflow-hidden focus-visible:ring-2 focus-visible:ring-primary/50 transition-all">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={(user as any).avatarUrl || ""} alt={user.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary font-medium text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-2 shadow-lg border-border/40">
                <div className="flex items-center justify-start gap-3 p-2 mb-1">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarImage src={(user as any).avatarUrl || ""} alt={user.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none overflow-hidden">
                    {user.name && <p className="font-medium text-sm truncate">{user.name}</p>}
                    {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1 p-1">
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer transition-colors">
                    <Link to={"/profile" as any}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer transition-colors">
                    <Link to={"/my-recipes" as any}>My Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer transition-colors">
                    <Link to={"/saved" as any}>Saved Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer transition-colors">
                    <Link to={"/settings" as any}>Account Settings</Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md cursor-pointer font-medium transition-colors" 
                    onSelect={(e) => { e.preventDefault(); handleLogout(); }}
                  >
                    Logout
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="font-medium hover:bg-muted/50 rounded-full px-5 transition-colors" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="rounded-full px-5 font-medium shadow-sm hover:shadow transition-all" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
