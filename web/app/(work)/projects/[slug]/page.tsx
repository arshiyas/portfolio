import type { Metadata } from "next";
import {
  ProjectCaseStudy,
  generateProjectStaticParams,
  getProjectPageMetadata,
  resolveProjectPage,
} from "@/components/ProjectCaseStudy";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return generateProjectStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getProjectPageMetadata(slug);
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = resolveProjectPage(slug);

  return (
    <main className="mx-auto w-full max-w-[920px] flex-1 px-6 py-14">
      <ProjectCaseStudy project={project} />
    </main>
  );
}
