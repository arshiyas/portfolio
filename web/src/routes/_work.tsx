import { Outlet, createFileRoute } from "@tanstack/react-router"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"

export const Route = createFileRoute("/_work")({
  component: WorkLayout,
})

function WorkLayout() {
  return (
    <div className="theme-work flex min-h-full flex-col">
      <SiteHeader theme="work" />
      <Outlet />
      <SiteFooter theme="work" />
    </div>
  )
}
