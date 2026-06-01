import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignupForm } from '@/components/signup-form';
import { getMe } from '@/lib/auth/auth';
import { queryClient } from '@/lib/query-client';

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMe,
    })

    if (user) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: RouteComponent,
  
})

function RouteComponent() {
  return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-6 md:p-10">
    <div className="w-full max-w-sm">
      <SignupForm />
    </div>
  </div>
}
