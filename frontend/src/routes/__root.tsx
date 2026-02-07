import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { authClient } from "@/lib/auth-client"

import appCss from '../styles.css?url'
import { NavBar } from '@/components/NavBar/NavBar'


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'WikiCook',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {

  const {
    data: session,
  } = authClient.useSession();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NavBar user={session?.user}  />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
