// src/lib/mdx.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Project as ProjectSchema, type Project } from './schema';

function resolveProjectsDir() {
    const candidates = [
        path.join(process.cwd(), 'content', 'projects'),       // raíz/content/projects
        path.join(process.cwd(), 'src', 'content', 'projects') // src/content/projects
    ];
    for (const dir of candidates) {
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    }
    return null;
}

export function getAllProjects(): Project[] {
    const dir = resolveProjectsDir();
    if (!dir) return []; // si no existe la carpeta, devolvemos vacío (no 500)

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    const items = files.map(file => {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8');
        const { data } = matter(raw);
        return ProjectSchema.parse(data);
    });
    // Orden por título (ajusta si agregas campo date)
    return items.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string) {
    const dir = resolveProjectsDir();
    if (!dir) throw new Error('Projects directory not found');

    const file = path.join(dir, `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Project not found: ${slug}`);

    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const meta = ProjectSchema.parse(data);
    return { meta, content };
}
