"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getMe, login } from "@/lib/auth/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("")
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({
        username,
        password,
      })
      // wait until cookie/session is actually usable
      await getMe()
      navigate({
        to: "/",
      })
    } catch (e) {
      console.log("Error in login....")
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">WikiCook</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to WikiCook.</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link to='/signup'>Sign Up</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="username"
              type="email"
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Joe@yahoo.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>

        </FieldGroup>
      </form>

    </div>
  )
}
