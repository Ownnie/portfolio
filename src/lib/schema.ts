import { z } from 'zod';

// Localized string: either a plain string or an object with es/en
const I18nString = z.union([
    z.string(),
    z.object({ es: z.string().optional(), en: z.string().optional() })
]);

const I18nStringArray = z.union([
    z.array(z.string()),
    z.object({ es: z.array(z.string()).optional(), en: z.array(z.string()).optional() })
]);

export const Project = z.object({
    title: I18nString,
    slug: z.string(),
    period: I18nString,
    role: I18nString,
    stack: z.array(z.string()),
    description: I18nString.optional(),
    impact: I18nStringArray.optional(),
    metrics: I18nStringArray.optional(),
    links: z
        .array(z.object({ label: z.string(), href: z.string(), type: z.enum(['repo', 'demo', 'other']).optional() }))
        .optional(),
    cover: z.string().optional(),
    featured: z.boolean().optional(),
});

export type Project = z.infer<typeof Project>;
