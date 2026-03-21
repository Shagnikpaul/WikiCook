
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"




export interface IRecipeCardProps {
    img_url: string | undefined
}

export default function RecipeCard(props: IRecipeCardProps) {
    
    return (
        <div>
            <Card className="relative w-full max-w-sm pt-0">
                <div className="absolute inset-0 z-30 aspect-vide" />
                <img
                    src={props.img_url}
                    alt="Event cover"
                    className="relative z-20 aspect-video w-full object-cover"
                />
                <CardHeader>
                    <CardAction>
                        <Badge variant="secondary">Featured</Badge>
                    </CardAction>
                    <CardTitle>Design systems meetup</CardTitle>
                    <CardDescription>
                        A practical talk on component APIs, accessibility, and shipping
                        faster.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">View Event</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
