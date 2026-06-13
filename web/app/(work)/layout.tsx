import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-work flex min-h-full flex-col">
      <SiteHeader theme="work" />
      {children}
      <SiteFooter theme="work" />
    </div>
  );
}
