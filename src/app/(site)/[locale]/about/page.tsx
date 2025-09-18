import { getMessages } from 'next-intl/server';
import SafeImage from '@/components/safe-image';
import Highlight from '@/components/Highlight';
import TechChips from '@/components/TechChips';

export const runtime = 'nodejs';

type Exp = { company: string; title: string; location?: string; period: string; bullets: string[] };
type Edu = { school: string; place: string; degree: string; notes?: string };
type AP = {
    meta: { title: string; description: string };
    title: string;
    summary: { lead: string; body: string; bullets: string[] };
    experience: { title: string; items: Exp[] };
    education: { title: string; items: Edu[] };
    certs: { title: string; items: string[] };
    skills: { title: string; hardTitle: string; softTitle: string; hard: string[]; soft: string[] };
};

type AboutMsgs = { aboutPage?: AP };

export async function generateMetadata({ params }: { params: { locale: 'es' | 'en' } }) {
    const { locale } = params;
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tudominio.com';
    const og = `${base}/${locale}/about/opengraph-image`;
    return {
        title: 'About — Nicolás Calderón',
        description: 'Ingeniero de Software Full-Stack & Cloud.',
        openGraph: { images: [{ url: og, width: 1200, height: 630 }], locale },
        twitter: { card: 'summary_large_image', images: [og] },
    };
}

/** Convierte listas tipo "Frontend: React, Next.js..." a ["React","Next.js",...] */
function extractTechs(lines: string[]): string[] {
    const out = new Set<string>();
    for (const line of lines) {
        const afterColon = line.includes(':') ? line.split(':')[1] : line;
        afterColon
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((t) => out.add(t));
    }
    return Array.from(out);
}

export default async function AboutPage({ params }: { params: { locale: 'es' | 'en' } }) {
    const { locale } = params;
    const messages = (await getMessages({ locale })) as AboutMsgs;
    const ap = messages.aboutPage;

    if (!ap) {
        return (
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-semibold">Sobre mí</h1>
                <p className="mt-3 text-white/80">
                    Falta el namespace <code>aboutPage</code> en {locale}.
                </p>
            </div>
        );
    }

    const techs = extractTechs(ap.skills.hard);

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12 space-y-12">

            {/* A) Header / Summary */}
            <section className="grid items-start gap-8 md:grid-cols-[1fr,300px]">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
                        {ap.title}{' '}
                        <span className="text-white/50">— Nicolás Calderón</span>
                    </h1>

                    {/* badges de rol */}
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-md bg-white/[0.06] px-2.5 py-1 ring-1 ring-white/10">
                            Ingeniero de Software
                        </span>
                        <span className="rounded-md bg-white/[0.06] px-2.5 py-1 ring-1 ring-white/10">
                            Full-Stack & Cloud
                        </span>
                    </div>

                    {/* lead resaltado */}
                    <p className="mt-4 text-base sm:text-lg font-medium text-white">
                        <Highlight>{ap.summary.lead}</Highlight>
                    </p>

                    <p className="mt-3 text-white/80 max-w-prose leading-relaxed">
                        {ap.summary.body}
                    </p>

                    <ul className="mt-4 grid gap-2 text-white/80">
                        {ap.summary.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-600" />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* foto */}
                <div className="justify-self-center md:justify-self-end w-full max-w-[300px]">
                    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/10">
                        <SafeImage
                            src="/NicoCalderon/portrait.jpg"
                            alt="Nicolás Calderón"
                            width={600}
                            height={600}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* B) Experiencia */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                <h2 className="text-2xl md:text-3xl font-semibold">{ap.experience.title}</h2>

                <ol className="mt-6 relative space-y-6 sm:space-y-8">
                    {/* línea vertical */}
                    <span aria-hidden className="absolute left-2 sm:left-3 top-0 h-full w-px bg-white/10" />
                    {ap.experience.items.map((exp, i) => (
                        <li key={i} className="grid grid-cols-[16px,1fr] sm:grid-cols-[20px,1fr] gap-3 sm:gap-4">
                            <span aria-hidden className="mt-2 h-2.5 w-2.5 rounded-full bg-brand-600" />
                            <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]">
                                <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">{exp.title}</h3>
                                    <span className="text-xs text-white/60">· {exp.company}</span>
                                    {exp.location ? (
                                        <span className="text-xs text-white/60">· {exp.location}</span>
                                    ) : null}
                                    <span className="ml-auto text-xs text-white/60">{exp.period}</span>
                                </header>

                                <ul className="mt-3 grid gap-1.5 text-white/80">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j}>• {b}</li>
                                    ))}
                                </ul>

                                {/* aprendizaje clave */}
                                <p className="mt-3 text-sm text-white/75">
                                    <Highlight>Aprendizaje:</Highlight>{' '}
                                    <span className="text-white/80">
                                        {i === 0
                                            ? 'Estabilidad en campo, UX móvil y performance real bajo condiciones de uso intensivo.'
                                            : 'Entregas consistentes, optimización de tiempos de carga y diseño de integraciones fiables.'}
                                    </span>
                                </p>
                            </article>
                        </li>
                    ))}
                </ol>
            </section>

            {/* C) Educación */}
            <section>
                <h2 className="text-2xl md:text-3xl font-semibold">{ap.education.title}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {ap.education.items.map((e, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 ring-1 ring-white/10"
                        >
                            <h3 className="text-lg font-semibold">{e.school}</h3>
                            <p className="text-white/70">{e.place}</p>
                            <p className="mt-1 text-white/85">{e.degree}</p>
                            {e.notes ? <p className="mt-2 text-white/70">{e.notes}</p> : null}
                        </div>
                    ))}
                </div>
            </section>

            {/* D) Habilidades & Certificaciones */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* skills */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold">{ap.skills.title}</h2>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-white/75">{ap.skills.hardTitle}</h3>
                            <div className="mt-3">
                                {/* Chips con iconos por tecnología, sin superposición y responsive */}
                                <TechChips items={techs} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-white/75">{ap.skills.softTitle}</h3>
                            <ul className="mt-2 grid gap-1.5 text-white/80">
                                {ap.skills.soft.map((s, i) => (
                                    <li key={i}>• {s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* certs */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold">{ap.certs.title}</h2>
                        <ul className="mt-4 grid gap-2 text-white/80">
                            {ap.certs.items.map((c, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
