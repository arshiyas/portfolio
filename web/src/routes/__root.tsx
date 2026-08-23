import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import appCss from "../styles.css?url"
import { SiteAnalytics } from "@/components/SiteAnalytics"
import { site } from "@/lib/content"

const siteDescription =
  "Software engineer at Lyft. Python, TypeScript, AWS: APIs and distributed systems across healthcare, geospatial, and mobility."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "Arshiya Sayyed | Software Engineer",
      },
      {
        name: "description",
        content: siteDescription,
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:title", content: "Arshiya Sayyed | Software Engineer" },
      { property: "og:description", content: siteDescription },
      { property: "og:url", content: site.url },
      { property: "og:image", content: `${site.url}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "800" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Arshiya Sayyed | Software Engineer" },
      { name: "twitter:description", content: siteDescription },
      { name: "twitter:image", content: `${site.url}/og-image.png` },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
    ],
    scripts: import.meta.env.DEV
      ? [{ src: "https://tweakcn.com/live-preview.min.js" }]
      : [],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[920px] px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold">404</h1>
      <p className="mt-2 text-muted-foreground">
        The requested page could not be found.
      </p>
    </main>
  ),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return <Outlet />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full">
        {children}
        <SiteAnalytics />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
