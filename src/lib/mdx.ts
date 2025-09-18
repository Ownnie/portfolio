import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Project as ProjectSchema, type Project } from './schema';

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
    return readAll().sort((a, b) => a.title.localeCompare(b.title));
}

export function getFeaturedProjects(max = 4): Project[] {
    const items = readAll().filter(p => p.featured);
    return items.slice(0, max);
}

export function getProjectBySlug(slug: string) {
    const dir = resolveProjectsDir();
    if (!dir) throw new Error('Projects directory not found');
    const file = path.join(dir, `${slug}.mdx`);
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const meta = ProjectSchema.parse(data);
    return { meta, content };
}
