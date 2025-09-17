import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '@/lib/mdx';
import { useTranslations } from 'next-intl';

export default function ProjectsPage() {
    const t = useTranslations('projects');
    const projects = getAllProjects();

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold">{t('title')}</h1>

            {projects.length === 0 ? (
                <p className="mt-6 text-white/70">{t('empty')}</p>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p) => (
                        <Link key={p.slug} href={`./${p.slug}`} className="group">
                            <div className="rounded-[var(--radius-xl2)] border border-white/10 bg-white/5 p-4 transition-colors group-hover:bg-white/10">
                                {p.cover ? (
                                    <Image
                                        src={p.cover}
                                        alt={p.title}
                                        width={640}
                                        height={360}
                                        className="mb-3 rounded-lg ring-1 ring-white/10"
                                    />
                                ) : null}
                                <h3 className="text-xl font-medium">{p.title}</h3>
                                <p className="text-sm text-white/60">{p.role} · {p.period}</p>
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
