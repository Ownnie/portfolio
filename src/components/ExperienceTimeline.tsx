// src/components/ExperienceTimeline.tsx
'use client';

import { motion } from 'framer-motion';

export type ExpItem = {
    title: string;
    company: string;
    location?: string;
    period: string;
    summary: string;
};

export default function ExperienceTimeline({ items }: { items: ExpItem[] }) {
    return (
        <ol className="relative space-y-7 sm:space-y-10 pl-5 sm:pl-0">
            <span aria-hidden className="absolute left-2 sm:left-[12px] top-0 h-full w-px bg-white/10" />
            {items.map((exp, i) => (
                <motion.li
                    key={i}
                    className="grid grid-cols-[16px,1fr] sm:grid-cols-[24px,1fr] gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.05 }}
                >
                    <span aria-hidden className="mt-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand-500" />
                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand-200">{exp.title}</h3>
                        <p className="text-xs sm:text-sm text-white/80">
                            {exp.company}{exp.location ? ` — ${exp.location}` : ''} · {exp.period}
                        </p>
                        <p className="mt-2 text-sm sm:text-base text-white/70 max-w-3xl">{exp.summary}</p>
                    </div>
                </motion.li>
            ))}
        </ol>
    );
}
