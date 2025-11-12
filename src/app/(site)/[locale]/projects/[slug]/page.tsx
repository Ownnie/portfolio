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

import { FadeIn, SlideInLi } from '@/components/motion/Fade';
import { tText, tList, type Locale, type I18nText, type I18nList } from '@/lib/i18n/content';

export const dynamicParams = false;
export const runtime = 'nodejs';

export function generateStaticParams() {
    return getAllProjects().map((p) => ({ slug: p.slug }));
}

/* OG: usa los campos localizados también */
export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }) {
    const { locale, slug } = params;
    const { meta } = getProjectBySlug(slug);

    const title = tText(meta.title as I18nText, locale);
    const description = tText(meta.description as I18nText, locale) || tText(meta.role as I18nText, locale) || 'Project';

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tudominio.com';
    const og = `${base}/${locale}/projects/${slug}/opengraph-image`;

    return {
        title,
        description,
        openGraph: { images: [{ url: og, width: 1200, height: 630 }], locale },
        twitter: { card: 'summary_large_image', images: [og] }
    };
}

type TMsgs = {
    nav?: { projects?: string };
    buttons?: { code?: string; preview?: string };
    projectDetail?: { highlights?: string; back?: string };
};

export default async function ProjectDetail({ params }: { params: { locale: Locale; slug: string } }) {
    const { locale, slug } = params;
    const messages = (await getMessages({ locale })) as TMsgs;
    const t = messages;

    const data = getProjectBySlug(slug, locale);
    if (!data) return notFound();

    const meta = data.meta as Project;
    const body = data.content;

    // Localizados
    const title = tText(meta.title, locale);
    const description = tText(meta.description, locale);
    const role = tText(meta.role, locale);
    const period = tText(meta.period, locale);

    const techs = meta.stack ?? [];
    const impact = tList(meta.impact as I18nList, locale);
    const metrics = tList(meta.metrics as I18nList, locale);
    const highlights = impact.length ? impact : metrics;

    const repoUrl =
        meta.links?.find((l) => l.type === 'repo')?.href ??
        meta.links?.find((l) => /git|repo/i.test(l.label || ''))?.href ??
        '';

    const demoUrl =
        meta.links?.find((l) => l.type === 'demo')?.href ??
        meta.links?.find((l) => /demo|preview|site|app|prod/i.test(l.label || ''))?.href ??
        '';

    const backHref = `/${locale}/projects`;

    return (
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-12">
            {/* Breadcrumb + volver */}
            <FadeIn as="nav" className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60" y={6}>
                <div>
                    <a className="hover:text-white" href={backHref}>
                        {t?.nav?.projects ?? (locale === 'en' ? 'Projects' : 'Proyectos')}
                    </a>
                    <span className="mx-2">/</span>
                    <span className="text-white/80">{title}</span>
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
                <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
                {description ? <p className="mt-2 text-white/80">{description}</p> : null}

                {(role || period) && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        {role ? <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{role}</span> : null}
                        {period ? <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{period}</span> : null}
                    </div>
                )}

                {techs.length ? (
                    <div className="mt-4">
                        <TechChips items={techs} size="md" />
                    </div>
                ) : null}

                {(repoUrl || demoUrl) && (
                    <div className="mt-5 flex flex-wrap gap-3">
                        {repoUrl ? (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.code ?? (locale === 'en' ? 'Code' : 'Código')}
                            </a>
                        ) : null}
                        {demoUrl ? (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.preview ?? (locale === 'en' ? 'Preview' : 'Preview')}
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
                        alt={title}
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
                    <h2 className="text-lg font-semibold">{t?.projectDetail?.highlights ?? (locale === 'en' ? 'Highlights' : 'Destacados')}</h2>
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

            {/* Cuerpo MDX (si lo quieres bilingüe, necesitarás un MDX por locale) */}
            {body ? (
                <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-white prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-white/95 prose-p:text-white/80 prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold prose-a:text-brand-400 prose-a:no-underline hover:prose-a:text-brand-300 prose-code:text-brand-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-ul:text-white/80 prose-li:my-1 prose-li:marker:text-brand-500">
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

            {/* Footer actions */}
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
                                {t?.buttons?.code ?? (locale === 'en' ? 'Code' : 'Código')}
                            </a>
                        ) : null}
                        {demoUrl ? (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-2 text-sm hover:border-brand-600/40 hover:bg-brand-900/25"
                            >
                                {t?.buttons?.preview ?? (locale === 'en' ? 'Preview' : 'Preview')}
                            </a>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
