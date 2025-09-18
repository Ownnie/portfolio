import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getProjectBySlug } from '@/lib/mdx';
import SafeImage from '@/components/safe-image';

type ExpItem = { title: string; company: string; location?: string; period: string; summary: string };
type ProjectMsg = { title: string; description: string };

// --- helpers ---
function normalizeUrl(u?: string | null): string | null {
  const s = (u ?? '').trim();
  return s.length > 0 ? s : null;
}

function pickLink(
  links: Array<{ label?: string; href?: string; type?: string }> | undefined,
  kind: 'repo' | 'demo'
): string | null {
  if (!links?.length) return null;
  // 1) por type
  const byType = links.find(l => l.type === kind);
  const byTypeHref = normalizeUrl(byType?.href);
  if (byTypeHref) return byTypeHref;

  // 2) por label (si no hay type)
  if (kind === 'repo') {
    const byLabel = links.find(l => l?.label && /git|repo/i.test(l.label!));
    return normalizeUrl(byLabel?.href);
  }
  const byLabel = links.find(l => l?.label && /demo|preview|site|app|prod|vercel|netlify/i.test(l.label!));
  return normalizeUrl(byLabel?.href);
}

export default async function Home({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params;

  const tHome = await getTranslations({ locale, namespace: 'home' });
  const tBtn = await getTranslations({ locale, namespace: 'buttons' });

  // i18n: experiencia
  const expItems = (await tHome.raw('experience.items')) as ExpItem[];

  // i18n: proyectos (orden + textos)
  const featuredSlugs = (await tHome.raw('projects.featuredSlugs')) as string[];
  const projects = await Promise.all(
    featuredSlugs.map(async (slug) => {
      try {
        const { meta } = getProjectBySlug(slug);
        const pm = (await tHome.raw(`projects.items.${slug}`)) as ProjectMsg;
        return {
          slug,
          title: pm?.title ?? meta.title,
          description: pm?.description ?? meta.description ?? '',
          cover: meta.cover,
          stack: meta.stack,
          role: meta.role,
          period: meta.period,
          // 👇 tolerante a href vacío/ausente
          links: (meta.links ?? []) as Array<{ label?: string; href?: string; type?: string }>
        };
      } catch {
        return null;
      }
    })
  ).then(list => list.filter(Boolean) as Array<{
    slug: string;
    title: string;
    description: string;
    cover?: string;
    stack?: string[];
    role?: string;
    period?: string;
    links: { label?: string; href?: string; type?: string }[];
  }>);

  return (
    <div>
      {/* HERO profesional */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 20% -10%, rgba(124,58,237,.25), transparent 35%), radial-gradient(circle at 80% 0%, rgba(139,92,246,.15), transparent 40%)'
          }}
        />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-sm md:text-base text-white/60">{/* tagline simple */}</p>
          <h1 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              {tHome('hero.title')}
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg md:text-xl text-white/80">{tHome('hero.sub')}</p>

          {/* chips de stack (sutiles) */}
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {['Next.js', 'TypeScript', 'Spring Boot', 'Flutter', 'PostgreSQL', 'AWS/Azure'].map(s => (
              <span key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/80">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE timeline (alineado) */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💼</span>
          <h2 className="text-2xl md:text-3xl font-semibold">{tHome('experience.title')}</h2>
        </div>

        <div className="mt-8">
          <ol className="relative space-y-10">
            {/* línea vertical */}
            <span aria-hidden className="absolute left-[12px] top-0 h-full w-px bg-white/10" />
            {expItems.map((exp, i) => (
              <li key={i} className="grid grid-cols-[24px,1fr] gap-4">
                {/* punto */}
                <span aria-hidden className="mt-1.5 h-3 w-3 rounded-full bg-brand-500" />
                {/* contenido */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-brand-200">{exp.title}</h3>
                  <p className="text-white/80">
                    {exp.company}{exp.location ? ` — ${exp.location}` : ''} · {exp.period}
                  </p>
                  <p className="mt-2 text-white/70 max-w-3xl">{exp.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8">
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-xl2)] px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10"
          >
            {tBtn('learnMoreMe')} <span>›</span>
          </Link>
        </div>
      </section>

      {/* PROJECTS teaser */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💻</span>
          <h2 className="text-2xl md:text-3xl font-semibold">{tHome('projects.title')}</h2>
        </div>

        {projects.length === 0 ? (
          <p className="mt-6 text-white/70">{tHome('projects.empty')}</p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.map((p) => {
              const repo = pickLink(p.links, 'repo');   // null si no hay o si href está vacío
              const demo = pickLink(p.links, 'demo');   // null si no hay o si href está vacío

              return (
                <li key={p.slug} className="rounded-[var(--radius-xl2)] border border-white/10 bg-white/5 p-4">
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt={p.title}
                      width={720}
                      height={400}
                      className="mb-3 rounded-lg ring-1 ring-white/10"
                    />
                  ) : null}

                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="text-sm text-white/70">{p.role} · {p.period}</p>
                  {p.description ? <p className="mt-2 text-white/80">{p.description}</p> : null}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {p.stack?.slice(0, 5).map((s: string) => (
                      <span key={s} className="rounded-full border border-brand-700/40 bg-brand-900/30 px-2.5 py-1">{s}</span>
                    ))}
                  </div>

                  {/* Botones Code / Preview: solo si hay link válido (no vacío) */}
                  {(repo || demo) ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {repo ? (
                        <a
                          href={repo}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[var(--radius-xl2)] px-3 py-1.5 border border-white/15 hover:border-white/30 text-sm"
                        >
                          {tBtn('code')}
                        </a>
                      ) : null}
                      {demo ? (
                        <a
                          href={demo}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[var(--radius-xl2)] px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-sm"
                        >
                          {tBtn('preview')}
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <Link
                      href={`/${locale}/projects/${p.slug}`}
                      className="text-brand-300 hover:text-brand-200 text-sm"
                    >
                      {tBtn('readCase')} →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-xl2)] px-4 py-2 bg-brand-600 hover:bg-brand-700"
          >
            {tBtn('seeAllProjects')} <span>›</span>
          </Link>
        </div>
      </section>

      {/* ABOUT ME (al final, estilo carta) */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <h2 className="text-2xl md:text-3xl font-semibold">{tHome('about.title')}</h2>
        </div>

        <div className="mt-6 grid items-start gap-8 md:grid-cols-[1fr,320px]">
          <div>
            <p className="text-white/80 text-lg">{tHome('about.lead')}</p>
            <p className="mt-3 max-w-3xl text-white/70">{tHome('about.body')}</p>
            <ul className="mt-4 grid gap-2 text-white/80">
              {(await tHome.raw('about.bullets') as string[]).map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Marco de foto (distinta a la del navbar) */}
          <div className="justify-self-end">
            <div className="relative h-[320px] w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/10">
              <SafeImage
                src="/me/portrait.jpg"
                alt="Nicolás Calderón"
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
