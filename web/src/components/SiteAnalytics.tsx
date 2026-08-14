import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useRouterState } from "@tanstack/react-router"

export function SiteAnalytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const search = useRouterState({ select: (state) => state.location.searchStr })
  const path = `${pathname}${search}`

  if (import.meta.env.DEV) {
    return null
  }

  return (
    <>
      <Analytics mode="production" route={pathname} path={path} />
      <SpeedInsights />
    </>
  )
}
