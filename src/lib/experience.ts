export type ExperienceItem = {
    company: string;
    title: string;
    location?: string;
    period: string;
    summary: string;
};

export const experienceTeaser: ExperienceItem[] = [
    {
        company: 'SIGUS',
        title: 'Mobile App Developer',
        location: 'Remote',
        period: 'Mar 2025 – Presente',
        summary:
            'App móvil CRM para seguridad privada: turnos, check-ins/outs, patrullajes y supervisión. Diseño de UI moderna, corrección de bugs críticos y mejoras de rendimiento en campo.'
    },
    {
        company: 'Freelance',
        title: 'Full-stack Developer',
        location: 'Remote',
        period: 'Abr 2023 – Mar 2025',
        summary:
            '15+ sitios y apps full-stack. Integraciones REST (Node.js/Spring Boot), automatizaciones con IA y Tiempos de carga <2s en producción. 90% de proyectos entregados a tiempo.'
    }
];
