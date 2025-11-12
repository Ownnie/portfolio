import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Project as ProjectSchema, type Project } from './schema';

function i18nToString(v: unknown) {
    if (!v) return '';
    if (typeof v === 'string') return v;
    const obj = v as { es?: string; en?: string } | undefined;
    return obj?.es ?? obj?.en ?? '';
}

function resolveProjectsDir() {
    const candidates = [
        path.join(process.cwd(), 'content', 'projects'),
        path.join(process.cwd(), 'src', 'content', 'projects')
    ];
    for (const dir of candidates) if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    return null;
}

function readAll(): Project[] {
    const dir = resolveProjectsDir();
    if (!dir) return [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    const items = files.map(file => {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8');
        const { data } = matter(raw);
        return ProjectSchema.parse(data);
    });
    return items;
}

export function getAllProjects(): Project[] {
    return readAll().sort((a, b) => {
        const ta = i18nToString((a.title) as unknown).toString();
        const tb = i18nToString((b.title) as unknown).toString();
        return ta.localeCompare(tb);
    });
}

export function getFeaturedProjects(max = 4): Project[] {
    const items = readAll().filter(p => p.featured);
    return items.slice(0, max);
}

export function getProjectBySlug(slug: string, locale?: string) {
    const dir = resolveProjectsDir();
    if (!dir) throw new Error('Projects directory not found');

    // Intentar primero con sufijo de idioma (ej: slug.en.mdx)
    if (locale) {
        const localizedFile = path.join(dir, `${slug}.${locale}.mdx`);
        if (fs.existsSync(localizedFile)) {
            const raw = fs.readFileSync(localizedFile, 'utf8');
            const { data, content } = matter(raw);
            const meta = ProjectSchema.parse(data);
            return { meta, content };
        }
    }

    // Si no existe versión localizada, usar el archivo base
    const file = path.join(dir, `${slug}.mdx`);
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const meta = ProjectSchema.parse(data);
    return { meta, content };
}
