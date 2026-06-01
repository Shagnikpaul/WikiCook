import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Search, Clock, ChefHat, CheckCircle, Sparkles, Video, Star, Users, Flame } from "lucide-react"

import { getRecipes } from "@/services/recipes/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export const Route = createFileRoute("/")({
  component: HomePage,
})

const VegIcon = () => (
  <div className="w-4 h-4 border-[1.5px] border-emerald-600 p-[2px] rounded-sm flex items-center justify-center shrink-0" title="Vegetarian">
    <div className="w-full h-full bg-emerald-600 rounded-full"></div>
  </div>
);

const NonVegIcon = () => (
  <div className="w-4 h-4 border-[1.5px] border-rose-600 p-[2px] rounded-sm flex items-center justify-center shrink-0" title="Non-Vegetarian">
    <div className="w-full h-full bg-rose-600 rounded-full"></div>
  </div>
);

function HomePage() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", "general"],
    queryFn: () => getRecipes(),
  })

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans text-foreground">
      {/* TWO COLUMN WRAPPER */}
      <div className="flex flex-1 relative w-full max-w-[1600px] mx-auto gap-6 p-6">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-[280px] lg:w-[300px] shrink-0 sticky top-6 h-[calc(100vh-3rem)] border border-border rounded-2xl bg-card hidden md:block">
          <ScrollArea className="h-full w-full">
            <div className="p-6">
              <div className="mb-8">
                <h3 className="font-heading text-3xl font-semibold text-primary italic">WikiCook</h3>
                <p className="text-sm text-muted-foreground mt-1">Discover, adapt, share.</p>
              </div>
              
              <div className="space-y-6">
                {/* Sort By */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">Sort By</h4>
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-full h-10 rounded-lg bg-background">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="time">Quickest Prep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <Accordion type="multiple" defaultValue={["diet", "time", "difficulty"]} className="w-full">
                  
                  <AccordionItem value="diet" className="border-b-0 mb-2">
                    <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm text-foreground">Dietary Preference</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="veg" className="rounded-sm" />
                        <label htmlFor="veg" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                          <VegIcon /> Vegetarian
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="nonveg" className="rounded-sm" />
                        <label htmlFor="nonveg" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2">
                          <NonVegIcon /> Non-Vegetarian
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="vegan" className="rounded-sm" />
                        <label htmlFor="vegan" className="text-sm font-medium leading-none cursor-pointer">🌱 Vegan</label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <Separator />

                  <AccordionItem value="time" className="border-b-0 my-2">
                    <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm text-foreground">Cooking Time</AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2">
                      <div className="space-y-4">
                        <Slider defaultValue={[60]} max={120} step={5} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span>Any</span>
                          <span>Under 60m</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <Separator />

                  <AccordionItem value="difficulty" className="border-b-0 my-2">
                    <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm text-foreground">Difficulty</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2 space-y-3">
                      {["Easy", "Medium", "Hard", "Masterchef"].map(level => (
                        <div key={level} className="flex items-center space-x-3">
                          <Checkbox id={`diff-${level}`} className="rounded-sm" />
                          <label htmlFor={`diff-${level}`} className="text-sm font-medium leading-none cursor-pointer">{level}</label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <Separator />

                  <AccordionItem value="badges" className="border-b-0 my-2">
                    <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm text-foreground">Source & Community</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-2 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="verified" className="rounded-sm" />
                        <label htmlFor="verified" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="video" className="rounded-sm" />
                        <label htmlFor="video" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-rose-500" /> Has Video
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="ai" className="rounded-sm" />
                        <label htmlFor="ai" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Generated
                        </label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 min-w-0 flex flex-col bg-card border border-border rounded-2xl h-[calc(100vh-3rem)] overflow-y-auto shadow-sm">
          
          {/* Header Area (Non-sticky, Centered) */}
          <div className="pt-12 pb-6 px-6 lg:px-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                Cook what the internet is <span className="italic font-cursive text-primary pr-2">actually</span> making.
              </h2>
            </div>
          </div>

          {/* Sticky Search Bar */}
          <div className="sticky top-0 z-20 py-4 px-6 lg:px-10 bg-transparent">
            <div className="max-w-4xl mx-auto w-full">
              <div className="relative w-full rounded-xl overflow-hidden border border-amber-500/15 shadow-md backdrop-blur-2xl bg-amber-50/15 dark:bg-amber-950/10 hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-amber-700/60 dark:text-amber-300/60" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Search for 'chicken pasta', 'vegan brownies', or 'quick dinner'..." 
                  className="pl-12 h-14 w-full text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </div>

          {/* Recipe Grid Area */}
          <div className="p-6 lg:p-10">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="space-y-4 p-4 border border-border/15 rounded-2xl bg-card shadow-sm">
                    <div className="aspect-[4/3] bg-muted rounded-xl border border-border/20"></div>
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : recipes?.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center bg-card rounded-2xl border border-dashed border-border shadow-sm mx-auto max-w-2xl">
                <ChefHat className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="font-heading text-2xl font-medium mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
                <Button>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes?.map(recipe => (
                  <Link 
                    key={recipe.id} 
                    to="/recipes/$recipeId" 
                    params={{ recipeId: recipe.id }} 
                    className="group flex flex-col gap-4 p-4 border border-border/15 bg-card/40 rounded-2xl shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md hover:bg-card"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/20 shadow-sm transition-all duration-300 group-hover:shadow-md">
                      {recipe.thumbnail ? (
                        <img src={recipe.thumbnail} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                          <ChefHat className="w-12 h-12 opacity-30" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {/* Tags Row */}
                      <div className="flex justify-between items-start min-h-5">
                        <div className="flex gap-1.5 flex-wrap">
                          {recipe.source_type === "ai" && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-semibold text-purple-700 bg-purple-100/50 hover:bg-purple-100/80 rounded border-0">
                              AI
                            </Badge>
                          )}
                          {recipe.source_type === "video" && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-semibold text-rose-700 bg-rose-100/50 hover:bg-rose-100/80 rounded border-0">
                              Video
                            </Badge>
                          )}
                          {recipe.status === "verified" && (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100/80 rounded border-0">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Title & Diet Symbol Row */}
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-heading text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
                          {recipe.title}
                        </h3>
                        <div className="shrink-0 mt-1">
                           {(recipe as any).diet === "veg" || recipe.title.toLowerCase().includes("veg") ? <VegIcon /> : <NonVegIcon />}
                        </div>
                      </div>
                      
                      {/* Metadata Row */}
                      <div className="flex items-center text-[13px] text-muted-foreground gap-3.5 mt-0.5">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
                          {recipe.rating ? recipe.rating.toFixed(1) : "New"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> 
                          {recipe.time || "25m"}
                        </span>
                        <span className="flex items-center gap-1" title="People Cooked">
                          <Users className="w-3.5 h-3.5" /> 
                          {(Math.random() * 5 + 0.1).toFixed(1)}k
                        </span>
                        {recipe.difficulty && (
                           <span className="flex items-center gap-1 capitalize">
                             <Flame className="w-3.5 h-3.5" />
                             {recipe.difficulty}
                           </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-card pt-16 pb-8 px-6 lg:px-12 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-heading text-3xl font-semibold text-primary mb-4 italic">WikiCook</h3>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              The modern, community-driven recipe platform for home cooks who love to explore, adapt, and share.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-5 text-foreground">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Latest Recipes</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Community Favorites</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Quick & Easy</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Vegetarian</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-5 text-foreground">WikiCook</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">AI Recipe Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WikiCook. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
