"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">WikiCook.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to WikiCook.</h1>
            <FieldDescription>
              Already have an account? <Link to="/login">Sign in</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Joe2341"
              required
            />
          </Field>
          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
        </FieldGroup>
      </form>

    </div>
  )
}
