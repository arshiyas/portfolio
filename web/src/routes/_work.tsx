import { Outlet, createFileRoute } from "@tanstack/react-router"
import { SiteFooter } from "@/components/SiteFooter"

export const Route = createFileRoute("/_work")({
  component: WorkLayout,
})

function WorkLayout() {
  return (
    <div className="theme-work flex min-h-full flex-col">
      <Outlet />
      <SiteFooter />
    </div>
  )
}
