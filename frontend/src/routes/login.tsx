import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form';
import { queryClient } from '@/lib/query-client';
import { getMe } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMe,
    })
    console.log('user : ', user);

    if (user) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
}
