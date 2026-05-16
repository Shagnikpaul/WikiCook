import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { getMe } from "@/lib/auth"

export const Route = createFileRoute("/recipe/_protected/_protected")({
  beforeLoad: async () => {
    const user = await getMe()

    if (!user) {
      throw redirect({
        to: "/login",
      })
    }

    return { user }
  },

  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}