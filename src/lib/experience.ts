export type ExperienceItem = {
    company: string;
    title: string;
    location?: string;
    period: string;
    summary: string;
};

export const experienceTeaser: ExperienceItem[] = [
    {
        company: 'Kapwork Inc.',
        title: 'Software Engineer',
        location: 'Remote',
        period: 'Nov 2025 – Apr 2026',
        summary:
            'Built typed backend services and REST APIs for an agent-based data extraction and verification platform using TypeScript, NestJS, SSE and polling workflows. Developed AI/ML-driven failure-classification flows.'
    },
    {
        company: 'SIGUS',
        title: 'Project Leader',
        location: 'Remote',
        period: 'Dec 2025 – Present',
        summary:
            'Led end-to-end development of a license control platform. Architected a SuiteCRM iframe module with real-time geolocation and integrated facial recognition into authentication.'
    },
    {
        company: 'SIGUS',
        title: 'Mobile App Developer',
        location: 'Remote',
        period: 'Mar 2025 – Dec 2025',
        summary:
            'Contributed to mobile app architecture and delivered responsive Flutter interfaces for private-security operations. Resolved critical bugs and improved field stability.'
    },
    {
        company: 'Freelance',
        title: 'Full-stack Developer',
        location: 'Remote',
        period: 'Apr 2023 – Mar 2025',
        summary:
            '15+ websites and web apps for small businesses. Integrated Node.js and Spring Boot APIs improving response times by 25%. 90% on-time delivery rate.'
    }
];
