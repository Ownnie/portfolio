export const runtime = 'nodejs';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getProjectBySlug } from '@/lib/mdx';
import SafeImage from '@/components/safe-image';

import ExperienceTimeline, { ExpItem } from '@/components/ExperienceTimeline';
import ProjectsTeaser from '@/components/ProjectsTeaser';
import { tText, type I18nText } from '@/lib/i18n/content';


/*-------------------OG-------------------- */
export async function generateMetadata({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tudominio.com';
  const og = `${base}/${locale}/opengraph-image`;

  return {
    title: 'Nicolás Calderón — Software Engineer',
    description: 'Full-Stack & Cloud. Web, móvil, APIs y despliegues.',
    openGraph: { images: [{ url: og, width: 1200, height: 630 }], locale },
    twitter: { card: 'summary_large_image', images: [og] }
  };
}

/* ---------------- page ---------------- */
export default async function Home({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params;

  const tHome = await getTranslations({ locale, namespace: 'home' });
  const tBtn = await getTranslations({ locale, namespace: 'buttons' });

  // experiencia
  const expItems = (await tHome.raw('experience.items')) as ExpItem[];

  // proyectos destacados
  const featuredSlugs = (await tHome.raw('projects.featuredSlugs')) as string[];
  type ProjectCard = {
    slug: string;
    title: string;
    description: string;
    cover?: string;
    stack: string[];
    role?: string;
    period?: string;
    links: { label?: string; href?: string; type?: string }[];
  };

  const projects: ProjectCard[] = (await Promise.all(
    featuredSlugs.map(async (slug): Promise<ProjectCard | null> => {
      try {
        const { meta } = getProjectBySlug(slug);
        const pm = (await tHome.raw(`projects.items.${slug}`)) as { title?: string; description?: string };
        return {
          slug,
          title: pm?.title ?? tText(meta.title as I18nText, locale),
          description: pm?.description ?? tText(meta.description as I18nText, locale) ?? '',
          cover: meta.cover,
          stack: Array.isArray(meta.stack) ? meta.stack : [],
          role: tText(meta.role as I18nText, locale) ?? '',
          period: tText(meta.period as I18nText, locale) ?? '',
          links: (meta.links ?? []) as Array<{ label?: string; href?: string; type?: string }>
        };
      } catch {
        return null;
      }
    })
  )).filter((x): x is ProjectCard => x !== null);


  return (
    <div>
      {/* HERO (mobile-first) */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 40% at 20% -10%, rgba(124,58,237,.25), transparent 60%), radial-gradient(50% 40% at 85% 0%, rgba(139,92,246,.15), transparent 65%)'
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <p className="text-xs sm:text-sm text-white/60">{/* tagline opcional */}</p>

          <h1 className="text-balance text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              {tHome('hero.title')}
            </span>
          </h1>

          <p className="mt-3 max-w-prose text-base sm:text-lg md:text-xl text-white/80">
            {tHome('hero.sub')}
          </p>

          {/* chips */}
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
            {['Next.js', 'TypeScript', 'Spring Boot', 'Flutter', 'PostgreSQL', 'AWS/Azure'].map(s => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 sm:px-3 text-white/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE (timeline responsive) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 md:py-14">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl">💼</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">{tHome('experience.title')}</h2>
        </div>

        <div className="mt-6 sm:mt-8">
          <ExperienceTimeline items={expItems} />
        </div>

        <div className="mt-6 sm:mt-8">
          <Link
            href={`/${locale}/about`}
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-[var(--radius-xl2)] px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-sm sm:text-base"
          >
            {tBtn('learnMoreMe')} <span aria-hidden>›</span>
          </Link>
        </div>
      </section>

      {/* PROJECTS (cards responsivas) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 md:py-14">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl">💻</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">{tHome('projects.title')}</h2>
        </div>

        {projects.length === 0 ? (
          <p className="mt-6 text-white/70">{tHome('projects.empty')}</p>
        ) : (
          <ProjectsTeaser
            locale={locale}
            projects={projects}
            labels={{
              code: tBtn('code'),
              preview: tBtn('preview'),
              readCase: tBtn('readCase')
            }}
          />
        )}

        <div className="mt-6 sm:mt-8">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-[var(--radius-xl2)] px-4 py-2 bg-brand-600 hover:bg-brand-700"
          >
            {tBtn('seeAllProjects')} <span aria-hidden>›</span>
          </Link>
        </div>
      </section>

      {/* ABOUT (split responsive) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl">👋</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">{tHome('about.title')}</h2>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2 items-start">
          <div>
            <p className="text-base sm:text-lg text-white/80">{tHome('about.lead')}</p>
            <p className="mt-3 max-w-prose text-sm sm:text-base text-white/70">{tHome('about.body')}</p>
            <ul className="mt-4 grid gap-2 text-white/80">
              {(await tHome.raw('about.bullets') as string[]).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* foto: bloque fluido */}
          <div className="justify-self-center md:justify-self-end w-full max-w-[360px]">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/10">
              <SafeImage
                src="/NicoCalderon/portrait.jpg"
                alt="Nicolás Calderón"
                width={720}
                height={720}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
