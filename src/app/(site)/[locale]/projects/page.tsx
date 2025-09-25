import { getMessages } from 'next-intl/server';
import { getAllProjects } from '@/lib/mdx';
import ProjectsGrid from '@/components/ProjectsGrid';
import type { Locale } from '@/lib/i18n/content';
import { tText, tList, type I18nText, type I18nList } from '@/lib/i18n/content';

export const runtime = 'nodejs';

type ProjectsMsgs = {
    projects?: { title?: string; subtitle?: string; empty?: string };
};

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;

    const messages = (await getMessages({ locale })) as ProjectsMsgs;
    const P = messages.projects ?? {};

    const title = P.title ?? (locale === 'en' ? 'Projects & case studies' : 'Proyectos & casos de estudio');
    const subtitle =
        P.subtitle ??
        (locale === 'en'
            ? 'Selected work focused on impact, performance and reliability.'
            : 'Trabajo seleccionado con foco en impacto, rendimiento y confiabilidad.');
    const empty = P.empty ?? (locale === 'en' ? 'More projects coming soon.' : 'Pronto habrá más proyectos.');

    const projectsRaw = getAllProjects();

    // Mapeamos campos localizados para el grid
    const projects = projectsRaw.map((p) => ({
        ...p,
        title: tText(p.title as I18nText, locale),
        description: tText(p.description as I18nText, locale),
        role: tText(p.role as I18nText, locale),
        period: tText(p.period as I18nText, locale),
        metrics: (p.metrics ? (Array.isArray(p.metrics) ? p.metrics : tList(p.metrics as I18nList, locale)) : []),
    }));

    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <header>
                <h1 className="text-balance text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">{title}</span>
                </h1>
                <p className="mt-2 text-white/70">{subtitle}</p>
            </header>

            {projects.length === 0 ? (
                <p className="mt-6 text-white/70">{empty}</p>
            ) : (
                <ProjectsGrid locale={locale} projects={projects} />
            )}
        </section>
    );
}
