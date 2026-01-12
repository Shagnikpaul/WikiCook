import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { authClient } from '@/lib/auth-client';
import { useState } from "react"
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { data, error } = await authClient.signIn.email({
            /**
             * The user email
             */
            email,
            /**
             * The user password
             */
            password,
            /**
             * A URL to redirect to after the user verifies their email (optional)
             */
            callbackURL: "/",
            /**
             * remember the user session after the browser is closed. 
             * @default true
             */
            rememberMe: false
        }, {
            //callbacks
            onError(context) {
                console.log('LMAO WHAT HAPPENED : ', context.error.message);

            },
            onSuccess(context) {
                console.log('Yipee logged in...', context.response.statusText);

            },
        })

    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>

                <CardContent>
                    <form onSubmit={handleLogin} >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="p-5"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input className="p-5" id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                            <Field>
                                <Button size="lg" type="submit">Login</Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
