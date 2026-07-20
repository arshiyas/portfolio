import { Outlet, createFileRoute } from "@tanstack/react-router"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"

export const Route = createFileRoute("/_personal")({
  component: PersonalLayout,
})

function PersonalLayout() {
  return (
    <div className="theme-personal flex min-h-full flex-col">
      <SiteHeader theme="personal" />
      <Outlet />
      <SiteFooter theme="personal" />
    </div>
  )
}
