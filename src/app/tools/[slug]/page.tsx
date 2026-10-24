import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categoryStyles, getRelatedTools, getToolBySlug, tools } from "@/lib/toolsData";
import { buildArticle } from "@/lib/article";
import { toolComponents } from "@/components/tools";
import ComingSoon from "@/components/ComingSoon";
import ToolCard from "@/components/ToolCard";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} – Free Online Tool`,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: `${tool.name} | GlowHacks`, description: tool.description },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];
  const article = buildArticle(tool);
  const related = getRelatedTools(tool);
  const style = categoryStyles[tool.category];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/#tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-glow-muted hover:text-glow-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All tools
      </Link>

      <header className="mt-5">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${style.tag}`}>{tool.category}</span>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{tool.name}</h1>
        <p className="mt-2 max-w-2xl text-glow-muted">{tool.description}</p>
      </header>

      <section aria-label={tool.name} className="card mt-8 p-5 sm:p-8">
        {ToolComponent ? <ToolComponent /> : <ComingSoon tool={tool} />}
      </section>

      <article className="card mt-10 p-6 sm:p-10">
        {article.map((section) => (
          <section key={section.heading} className="mb-8 last:mb-0">
            <h2 className="text-xl font-semibold sm:text-2xl">{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-glow-ink/85">{p}</p>
            ))}
            {section.list && (
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-glow-ink/85 marker:text-glow-pink">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">More in {tool.category}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
