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

// 👇 wrappers de cliente para animaciones
import { FadeIn, SlideInLi } from '@/components/motion/Fade';

export const dynamicParams = false;

export const runtime = 'nodejs';

// Slugs estáticos (locale lo resuelve el segmento padre)
export function generateStaticParams() {
    return getAllProjects().map((p) => ({ slug: p.slug }));
}

/* ---------------- OG ---------------- */
export async function generateMetadata({ params }: { params: { locale: 'es' | 'en', slug: string } }) {
    const { locale, slug } = await params;
    const { meta } = getProjectBySlug(slug);

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tudominio.com';
    const og = `${base}/${locale}/projects/${slug}/opengraph-image`;

    return {
        title: meta.title,
        description: meta.description ?? meta.role ?? 'Project',
        openGraph: { images: [{ url: og, width: 1200, height: 630 }], locale },
        twitter: { card: 'summary_large_image', images: [og] }
    };
}

type TMsgs = {
    nav?: { projects?: string };
    buttons?: { code?: string; preview?: string };
    projectDetail?: {
        highlights?: string;
        back?: string; // 👈 agrega esta línea
    };
};


/* ---------------- Page ---------------- */
export default async function ProjectDetail({ params }: { params: { locale: 'es' | 'en'; slug: string } }) {
    const { locale, slug } = await params;
    const messages = (await getMessages({ locale })) as TMsgs;
    const t = messages;

    const data = getProjectBySlug(slug);
    if (!data) return notFound();

    const meta = data.meta as Project;
    const body = data.content;

    // Techs y highlights
    const techs = meta.stack ?? [];
    const highlights = meta.impact?.length ? meta.impact : (meta.metrics ?? []);

    // Links (condicionales)
    const repoUrl =
        meta.links?.find((l) => l.type === 'repo')?.href ??
        meta.links?.find((l) => /git|repo/i.test(l.label))?.href ?? '';

    const demoUrl =
        meta.links?.find((l) => l.type === 'demo')?.href ??
        meta.links?.find((l) => /demo|preview|site|app|prod/i.test(l.label))?.href ?? '';

    const backHref = `/${locale}/projects`;

    return (
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-12">

            {/* Breadcrumb + volver */}
            <FadeIn as="nav" className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" y={6}>
                <div>
                    <a className="hover:text-white" href={backHref}>
                        {t?.nav?.projects ?? 'Projects'}
                    </a>
                    <span className="mx-2">/</span>
                    <span className="text-white/80">{meta.title}</span>
                </div>

                <a
                    href={backHref}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 hover:border-white/25 hover:bg-white/[0.07]"
                >
                    ← {t?.projectDetail?.back ?? (locale === 'en' ? 'Back to projects' : 'Volver a proyectos')}
                </a>
            </FadeIn>

            {/* Header */}
            <FadeIn as="header" className="mb-6" y={8}>
                <h1 className="text-2xl md:text-3xl font-semibold">{meta.title}</h1>
                {meta.description ? <p className="mt-2 text-white/80">{meta.description}</p> : null}

                {(meta.role || meta.period) && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        {meta.role ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{meta.role}</span>
                        ) : null}
                        {meta.period ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{meta.period}</span>
                        ) : null}
                    </div>
                )}

                {techs.length ? (
                    <div className="mt-4">
                        <TechChips items={techs} size="md" />
                    </div>
                ) : null}

                {/* CTA superior (si hay links) */}
                {(repoUrl || demoUrl) && (
                    <div className="mt-5 flex flex-wrap gap-3">
                        {repoUrl ? (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.code ?? 'Code'}
                            </a>
                        ) : null}
                        {demoUrl ? (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.preview ?? 'Preview'}
                            </a>
                        ) : null}
                    </div>
                )}
            </FadeIn>

            {/* Cover */}
            {meta.cover ? (
                <FadeIn as="div" className="mb-8 overflow-hidden rounded-xl border border-white/10 ring-1 ring-white/10" y={8}>
                    <Image
                        src={meta.cover}
                        alt={meta.title}
                        width={1200}
                        height={630}
                        className="h-auto w-full object-cover"
                        priority
                    />
                </FadeIn>
            ) : null}

            {/* Highlights */}
            {highlights.length ? (
                <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                    <h2 className="text-lg font-semibold">{t?.projectDetail?.highlights ?? 'Highlights'}</h2>
                    <ul className="mt-3 grid gap-2 text-white/80">
                        {highlights.map((h, i) => (
                            <SlideInLi key={i} delay={i * 0.04}>
                                <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                                <span>{h}</span>
                            </SlideInLi>
                        ))}
                    </ul>
                </section>
            ) : null}

            {/* MDX body */}
            {body ? (
                <article className="prose prose-invert prose-h2:mt-10 prose-h2:text-white prose-h3:text-white/90 prose-p:text-white/80 prose-strong:text-white prose-a:text-brand-300">
                    <MDXRemote
                        source={body}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [
                                    rehypeSlug,
                                    [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['no-underline'] } }],
                                ],
                            },
                        }}
                    />
                </article>
            ) : null}

            {/* Footer actions: volver + botones (repetimos para comodidad del lector) */}
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                    href={backHref}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 hover:border-white/25 hover:bg-white/[0.07]"
                >
                    ← {t?.projectDetail?.back ?? (locale === 'en' ? 'Back to projects' : 'Volver a proyectos')}
                </a>

                {(repoUrl || demoUrl) && (
                    <div className="flex flex-wrap gap-3">
                        {repoUrl ? (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.code ?? 'Code'}
                            </a>
                        ) : null}
                        {demoUrl ? (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.preview ?? 'Preview'}
                            </a>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
