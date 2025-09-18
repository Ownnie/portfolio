// src/components/ProjectsTeaser.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

type LinkItem = { label?: string; href?: string; type?: string };
export type ProjectCard = {
    slug: string;
    title: string;
    description?: string;
    cover?: string;
    stack?: string[];
    role?: string;
    period?: string;
    links?: LinkItem[];
};
type BtnLabels = { code: string; preview: string; readCase: string };
type Props = {
    locale: 'es' | 'en';
    projects: ProjectCard[];
    labels: BtnLabels;
};

function normalizeUrl(u?: string | null): string | null {
    const s = (u ?? '').trim();
    return s.length > 0 ? s : null;
}
function pickLink(links: LinkItem[] | undefined, kind: 'repo' | 'demo'): string | null {
    if (!links?.length) return null;
    const byType = normalizeUrl(links.find(l => l.type === kind)?.href);
    if (byType) return byType;
    if (kind === 'repo') {
        return normalizeUrl(links.find(l => l?.label && /git|repo/i.test(l.label!))?.href);
    }
    return normalizeUrl(links.find(l => l?.label && /demo|preview|site|app|prod|vercel|netlify/i.test(l.label!))?.href);
}

export default function ProjectsTeaser({ locale, projects, labels }: Props) {
    return (
        <ul className="mt-6 grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {projects.map((p, i) => {
                const repo = pickLink(p.links, 'repo');
                const demo = pickLink(p.links, 'demo');
                return (
                    <motion.li
                        key={p.slug}
                        className="rounded-[var(--radius-xl2)] border border-white/10 bg-white/5 p-3 sm:p-4"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.05 }}
                    >
                        {p.cover ? (
                            <div className="mb-3 overflow-hidden rounded-lg ring-1 ring-white/10">
                                <Image
                                    src={p.cover}
                                    alt={p.title}
                                    width={1280}
                                    height={720}
                                    className="h-auto w-full object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                                    style={{ aspectRatio: '16/9' }}
                                />
                            </div>
                        ) : (
                            <div className="mb-3 rounded-lg ring-1 ring-white/10 bg-white/[0.03]" style={{ aspectRatio: '16/9' }} />
                        )}

                        <h3 className="text-base sm:text-lg md:text-xl font-semibold">{p.title}</h3>

                        {(p.role || p.period) && (
                            <p className="text-xs sm:text-sm text-white/70">
                                {(p.role || '').trim()}
                                {p.role && p.period ? ' · ' : ''}
                                {(p.period || '').trim()}
                            </p>
                        )}

                        {p.description ? (
                            <p className="mt-2 text-sm sm:text-base text-white/80">{p.description}</p>
                        ) : null}

                        {Array.isArray(p.stack) && p.stack.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                                {p.stack.slice(0, 5).map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-full border border-brand-700/40 bg-brand-900/30 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}

                        {(repo || demo) && (
                            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                                {repo && (
                                    <a
                                        href={repo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex justify-center sm:justify-start rounded-[var(--radius-xl2)] px-3 py-1.5 border border-white/15 hover:border-white/30 text-sm"
                                    >
                                        {labels.code}
                                    </a>
                                )}
                                {demo && (
                                    <a
                                        href={demo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex justify-center sm:justify-start rounded-[var(--radius-xl2)] px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-sm"
                                    >
                                        {labels.preview}
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="mt-3">
                            <Link href={`/${locale}/projects/${p.slug}`} className="text-brand-300 hover:text-brand-200 text-sm">
                                {labels.readCase} →
                            </Link>
                        </div>
                    </motion.li>
                );
            })}
        </ul>
    );
}
