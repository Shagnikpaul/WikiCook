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
import { authApi } from '@/lib/auth-api';
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSingUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authApi.register({
        email: email,
        password: password,
        name: userName
      });
      // After registration, usually we redirect to login
      navigate({ to: "/login" });
    } catch (err: any) {
      console.log('Error during registration:', err.message);
      setError(err.response?.data?.detail || "Registration failed");
    }
  }
  return (
    <Card {...props}>
      <CardContent>
        <form onSubmit={handleSingUp}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">User Name</FieldLabel>
              <Input id="name" type="text" placeholder="cool_satyajit1970" required onChange={(e) => setUserName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required onChange={(e) => setPasswordConfirm(e.target.value)} />
              <FieldDescription className={`text-amber-600 ${passwordConfirm !== password ? "" : "hidden"}`}>{passwordConfirm !== password ? "Passwords do not match." : ""}</FieldDescription>
              <FieldDescription className={`${passwordConfirm !== password ? "hidden" : ""}`}>{passwordConfirm !== password ? "" : "Please confirm your password."}</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Log In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
