import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router"
import { useAuth } from "@/hooks/use-auth"

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />
}