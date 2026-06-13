import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-personal flex min-h-full flex-col">
      <SiteHeader theme="personal" />
      {children}
      <SiteFooter theme="personal" />
    </div>
  );
}
