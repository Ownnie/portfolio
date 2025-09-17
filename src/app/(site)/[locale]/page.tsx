import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 20% -10%, rgba(124,58,237,.25), transparent 35%), radial-gradient(circle at 80% 0%, rgba(139,92,246,.15), transparent 40%)'
        }}
      />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h1 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            {t('title')}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/80">{t('subtitle')}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="./projects"
            className="rounded-[var(--radius-xl2)] px-5 py-3 bg-brand-600 hover:bg-brand-700 ring-1 ring-white/10"
          >
            {t('seeProjects')}
          </Link>
          <Link
            href="./contact"
            className="rounded-[var(--radius-xl2)] px-5 py-3 border border-white/15 hover:border-white/30 text-white/90"
          >
            {t('contact')}
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 text-sm">
          {['Next.js', 'React', 'TypeScript', 'Flutter', 'Spring Boot', 'PostgreSQL'].map((s) => (
            <span
              key={s}
              className="rounded-full border border-brand-700/40 bg-brand-900/30 px-3 py-1 text-white/80"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
