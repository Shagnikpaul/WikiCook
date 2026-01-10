import { HeadContent, ParsedLocation, Scripts, createRootRoute } from '@tanstack/react-router'


import appCss from '../styles.css?url'
import { NavBar } from '@/components/NavBar/NavBar'
import { useLocation } from '@tanstack/react-router'
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
  
  const location:ParsedLocation = useLocation()
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NavBar route={location}/>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
