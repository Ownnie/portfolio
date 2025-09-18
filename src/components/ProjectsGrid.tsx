'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Project = {
    slug: string;
    title: string;
    role?: string;
    period?: string;
    stack: string[];
    cover?: string;
};

export default function ProjectsGrid({
    locale,
    projects
}: {
    locale: 'es' | 'en';
    projects: Project[];
}) {
    return (
        <motion.div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
                }
            }}
        >
            {projects.map((p, i) => (
                <motion.div
                    key={p.slug}
                    variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
                    }}
                    whileHover={{ y: -2 }}
                >
                    <Link href={`/${locale}/projects/${p.slug}`} className="group block h-full">
                        <article className="h-full rounded-[var(--radius-xl2)] border border-white/10 bg-white/[0.04] p-4 transition-colors group-hover:bg-white/[0.07]">
                            {p.cover ? (
                                <Image
                                    src={p.cover}
                                    alt={p.title}
                                    width={640}
                                    height={360}
                                    className="mb-3 w-full h-auto rounded-lg ring-1 ring-white/10 object-cover"
                                />
                            ) : (
                                <div className="mb-3 h-[180px] w-full rounded-lg ring-1 ring-white/10 bg-white/[0.03]" />
                            )}

                            <h3 className="text-lg md:text-xl font-semibold">{p.title}</h3>

                            {(p.role || p.period) && (
                                <p className="text-sm text-white/60">
                                    {(p.role || '').trim()}
                                    {p.role && p.period ? ' · ' : ''}
                                    {(p.period || '').trim()}
                                </p>
                            )}

                            {Array.isArray(p.stack) && p.stack.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {p.stack.slice(0, 4).map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-full border border-brand-700/40 bg-brand-900/30 px-2.5 py-1 text-xs"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
