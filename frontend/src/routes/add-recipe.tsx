import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-recipe')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add-recipe"!</div>
}
