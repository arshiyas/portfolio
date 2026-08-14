import { useEffect, useRef } from "react"
import { useRouterState } from "@tanstack/react-router"
import { Analytics, track } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function RouteChangeTracker() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const search = useRouterState({ select: (state) => state.location.searchStr })
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    track("pageview", { path: `${pathname}${search}` })
  }, [pathname, search])

  return null
}

export function SiteAnalytics() {
  if (import.meta.env.DEV) {
    return null
  }

  return (
    <>
      <RouteChangeTracker />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
