import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/login')({

  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/" })
    }
  }, [user, isLoading])
  return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
}
