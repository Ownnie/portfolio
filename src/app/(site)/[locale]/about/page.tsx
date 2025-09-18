import { getMessages } from 'next-intl/server';
import SafeImage from '@/components/safe-image';
import Highlight from '@/components/Highlight';
import SkillChips from '@/components/SkillChips';
import TechChips from '@/components/TechChips';

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

export default async function AboutPage({
    params
}: { params: Promise<{ locale: 'es' | 'en' }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    const ap = (messages as any)?.aboutPage as AP | undefined;

    function extractTechs(lines: string[]): string[] {
        const out = new Set<string>();
        for (const line of lines) {
            const afterColon = line.includes(':') ? line.split(':')[1] : line;
            afterColon
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .forEach(t => out.add(t));
        }
        return Array.from(out);
    }

    if (!ap) {
        return (
            <div className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-semibold">Sobre mí</h1>
                <p className="mt-3 text-white/80">
                    Falta el namespace <code>aboutPage</code> en {locale}.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
            {/* Sección A: Header / Summary (fondo liso) */}
            <section className="grid gap-8 md:grid-cols-[1fr,280px] items-start">
                <div>
                    <h1 className="text-3xl md:text-4xl font-semibold">
                        {ap.title} <span className="text-white/50">— Nicolás Calderón</span>
                    </h1>

                    <p className="mt-2 text-lg font-medium text-white">
                        {/* Resalta roles/fortalezas con <Highlight /> */}
                        <Highlight>{ap.summary.lead}</Highlight>
                    </p>

                    <p className="mt-3 text-white/80 max-w-3xl leading-relaxed">
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

                <div className="justify-self-end">
                    <div className="relative h-[280px] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ring-1 ring-white/10">
                        <SafeImage
                            src="/me/portrait.jpg"
                            alt="Nicolás Calderón"
                            width={280}
                            height={280}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Sección B: Experiencia (fondo alternado sutil) */}
            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                <h2 className="text-2xl md:text-3xl font-semibold">{ap.experience.title}</h2>
                <div className="mt-6 space-y-6">
                    {ap.experience.items.map((exp, i) => (
                        <article
                            key={i}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-brand-600/30 hover:bg-brand-950/30"
                        >
                            <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h3 className="text-lg md:text-xl font-semibold">{exp.title}</h3>
                                <span className="text-xs text-white/60">· {exp.company}</span>
                                {exp.location ? <span className="text-xs text-white/60">· {exp.location}</span> : null}
                                <span className="ml-auto text-xs text-white/60">{exp.period}</span>
                            </header>

                            <ul className="mt-3 grid gap-1.5 text-white/80">
                                {exp.bullets.map((b, j) => (
                                    <li key={j}>• {b}</li>
                                ))}
                            </ul>

                            {/* Aprendizaje clave de la época: resaltado embebido */}
                            <p className="mt-3 text-sm text-white/75">
                                <Highlight>Aprendizaje:</Highlight>{' '}
                                <span className="text-white/80">
                                    {i === 0
                                        ? 'Estabilidad en campo, UX móvil y performance real bajo condiciones de uso intensivo.'
                                        : 'Entregas consistentes, optimización de tiempos de carga y diseño de integraciones fiables.'}
                                </span>
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Sección C: Educación (fondo liso, distribución 2 cols) */}
            <section className="mt-12">
                <h2 className="text-2xl md:text-3xl font-semibold">{ap.education.title}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
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

            {/* Sección D: Skills + Certs (fondo alternado + chips) */}
            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/10">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold">{ap.skills.title}</h2>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-white/75">{ap.skills.hardTitle}</h3>
                            <div className="mt-3">
                                {/* ✅ chips individuales con icono y sin sobreposición */}
                                <TechChips items={extractTechs(ap.skills.hard)} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-white/75">{ap.skills.softTitle}</h3>
                            <ul className="mt-2 grid gap-1.5 text-white/80">
                                {ap.skills.soft.map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                        </div>
                    </div>

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
