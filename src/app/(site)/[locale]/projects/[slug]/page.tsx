import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default function ProjectPage({ params: { slug } }: { params: { slug: string } }) {
    try {
        const { meta, content } = getProjectBySlug(slug);
        return (
            <article className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-semibold">{meta.title}</h1>
                <p className="mt-1 text-white/60">{meta.role} · {meta.period}</p>

                {/* tags */}
                {meta.stack?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {meta.stack.map((s) => (
                            <span key={s} className="rounded-full border border-brand-700/40 bg-brand-900/30 px-2.5 py-1">
                                {s}
                            </span>
                        ))}
                    </div>
                ) : null}

                {/* contenido MDX */}
                <div className="prose prose-invert mt-8 max-w-none">
                    <MDXRemote source={content} />
                </div>
            </article>
        );
    } catch {
        notFound();
    }
}
