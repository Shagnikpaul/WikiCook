import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import { getMe } from '@/lib/auth';

export const Route = createFileRoute('/add-recipe')({
  component: RouteComponent,
})

function RouteComponent() {

  const load = useEffect(() => {
    getMe().then((r) => {
      console.log('user ', r);

    })

  }, [])
  return <div>Hello "/add-recipe"!</div>
}
