import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import TechChips from '@/components/TechChips';
import { getAllProjects, getProjectBySlug } from '@/lib/mdx';
import type { Project } from '@/lib/schema';

export const dynamicParams = false;

// Genera rutas estáticas por slug (el locale lo maneja el segmento padre)
export function generateStaticParams() {
    return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: 'es' | 'en'; slug: string }>;
}) {
    const { slug } = await params;
    const data = getProjectBySlug(slug);
    if (!data) return {};
    const meta = data.meta as Project;

    return {
        title: meta.title ?? 'Project',
        description: meta.description ?? '',
        openGraph: {
            title: meta.title,
            description: meta.description ?? '',
            images: meta.cover ? [{ url: meta.cover }] : []
        }
    };
}

export default async function ProjectDetail({
    params
}: {
    params: Promise<{ locale: 'es' | 'en'; slug: string }>;
}) {
    const { locale, slug } = await params;
    const messages = await getMessages({ locale });
    const t = messages as any;

    const data = getProjectBySlug(slug);
    if (!data) return notFound();

    const meta = data.meta as Project;
    const body = data.content;

    // Derivados según tu schema
    const techs = meta.stack ?? [];
    const highlights = meta.impact?.length ? meta.impact : (meta.metrics ?? []);

    // Repo/Demo desde links
    const repoUrl =
        meta.links?.find((l) => l.type === 'repo')?.href ??
        meta.links?.find((l) => /git|repo/i.test(l.label))?.href ??
        '';
    const demoUrl =
        meta.links?.find((l) => l.type === 'demo')?.href ??
        meta.links?.find((l) => /demo|preview|site|app|prod/i.test(l.label))?.href ??
        '';

    return (
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-12">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-white/60">
                <a className="hover:text-white" href={`/${locale}/projects`}>
                    {t?.nav?.projects ?? 'Projects'}
                </a>
                <span className="mx-2">/</span>
                <span className="text-white/80">{meta.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold">{meta.title}</h1>
                {meta.description ? (
                    <p className="mt-2 text-white/80">{meta.description}</p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    {meta.role ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                            {meta.role}
                        </span>
                    ) : null}
                    {meta.period ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                            {meta.period}
                        </span>
                    ) : null}
                </div>

                {techs.length ? (
                    <div className="mt-4">
                        <TechChips items={techs} size="md" />
                    </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                    {repoUrl ? (
                        <a
                            href={repoUrl}
                            target="_blank"
                            className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                        >
                            {t?.buttons?.code ?? 'Code'}
                        </a>
                    ) : null}
                    {demoUrl ? (
                        <a
                            href={demoUrl}
                            target="_blank"
                            className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                        >
                            {t?.buttons?.preview ?? 'Preview'}
                        </a>
                    ) : null}
                </div>
            </header>

            {/* Cover opcional */}
            {meta.cover ? (
                <div className="mb-8 overflow-hidden rounded-xl border border-white/10 ring-1 ring-white/10">
                    <Image
                        src={meta.cover}
                        alt={meta.title}
                        width={1200}
                        height={630}
                        className="h-auto w-full object-cover"
                        priority
                    />
                </div>
            ) : null}

            {/* Highlights (impact o metrics) */}
            {highlights.length ? (
                <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                    <h2 className="text-lg font-semibold">
                        {t?.projectDetail?.highlights ?? 'Highlights'}
                    </h2>
                    <ul className="mt-3 grid gap-2 text-white/80">
                        {highlights.map((h, i) => (
                            <li key={i} className="flex gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                                <span>{h}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            {/* Cuerpo MDX */}
            {body ? (
                <article className="prose prose-invert prose-h2:mt-10 prose-h2:text-white prose-h3:text-white/90 prose-p:text-white/80 prose-strong:text-white prose-a:text-brand-300">
                    <MDXRemote
                        source={body}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [
                                    rehypeSlug,
                                    [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['no-underline'] } }]
                                ]
                            }
                        }}
                    />
                </article>
            ) : null}
        </div>
    );
}
