import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/add-recipe')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isLoading } = useAuth()

  if (!isLoading)
    return <div>Hello "/add-recipe"! for user : {user?.id}</div>
  else
    return <div>Wait Loading...</div>
}
