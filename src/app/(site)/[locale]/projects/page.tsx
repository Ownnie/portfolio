import Link from 'next/link';
import Image from 'next/image';
import { getMessages } from 'next-intl/server';
import { getAllProjects } from '@/lib/mdx';

export default async function ProjectsPage({
    params
}: {
    params: Promise<{ locale: 'es' | 'en' }>;
}) {
    const { locale } = await params;

    // Carga TODOS los mensajes sin romper si falta un namespace
    const messages = (await getMessages({ locale })) as any;
    const P = messages?.projects ?? {};

    // Fallbacks si faltan claves
    const title =
        (typeof P.title === 'string' && P.title) ||
        (locale === 'en' ? 'Projects & case studies' : 'Proyectos & casos de estudio');

    const subtitle =
        (typeof P.subtitle === 'string' && P.subtitle) ||
        (locale === 'en'
            ? 'Selected work focused on impact, performance and reliability.'
            : 'Trabajo seleccionado con foco en impacto, rendimiento y confiabilidad.');

    const empty =
        (typeof P.empty === 'string' && P.empty) ||
        (locale === 'en' ? 'More projects coming soon.' : 'Pronto habrá más proyectos.');

    const projects = getAllProjects();

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            {/* Header */}
            <header>
                <h1 className="text-balance text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                        {title}
                    </span>
                </h1>
                <p className="mt-2 text-white/70">{subtitle}</p>
            </header>

            {projects.length === 0 ? (
                <p className="mt-6 text-white/70">{empty}</p>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/${locale}/projects/${p.slug}`} // ✅ ruta correcta
                            className="group"
                        >
                            <article className="rounded-[var(--radius-xl2)] border border-white/10 bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
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
                    ))}
                </div>
            )}
        </section>
    );
}
