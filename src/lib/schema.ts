import { z } from 'zod';

export const Project = z.object({
    title: z.string(),
    slug: z.string(),
    period: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    description: z.string().optional(),
    impact: z.array(z.string()).optional(),
    metrics: z.array(z.string()).optional(),
    links: z.array(z.object({ label: z.string(), href: z.string(), type: z.enum(['repo', 'demo', 'other']).optional() })).optional(),
    cover: z.string().optional(),
    featured: z.boolean().optional() // <- nuevo
});
export type Project = z.infer<typeof Project>;
