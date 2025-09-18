'use client';

import { Badge } from '@/components/ui/badge';
import { Brain, Database, Cloud, Server } from 'lucide-react';
import {
    SiReact, SiNextdotjs, SiTailwindcss, SiAngular, SiNodedotjs, SiNestjs,
    SiSpringboot, SiExpress, SiAmazon, SiFirebase, SiDocker, SiKubernetes, SiSupabase,
    SiPostgresql, SiMongodb, SiMysql, SiTypescript, SiJavascript, SiHtml5, SiCss3, SiOpenjdk
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

type Props = { items: string[]; size?: 'sm' | 'md' };
const slug = (s: string) => s.toLowerCase().replace(/[\.\s]/g, '');

function getIcon(tech: string) {
    const s = slug(tech);
    switch (true) {
        case /react/.test(s): return <SiReact />;
        case /nextjs|next/.test(s): return <SiNextdotjs />;
        case /tailwind/.test(s): return <SiTailwindcss />;
        case /angular/.test(s): return <SiAngular />;
        case /typescript|^ts$/.test(s): return <SiTypescript />;
        case /javascript|^js$/.test(s): return <SiJavascript />;
        case /^html5?$/.test(s): return <SiHtml5 />;
        case /^css3?$/.test(s): return <SiCss3 />;

        case /node/.test(s): return <SiNodedotjs />;
        case /nestjs/.test(s): return <SiNestjs />;
        case /^java$/.test(s): return <SiOpenjdk />; // o <FaJava />
        case /springboot|spring/.test(s): return <SiSpringboot />;
        case /express/.test(s): return <SiExpress />;

        case /aws|amazon/.test(s): return <SiAmazon />;
        case /firebase/.test(s): return <SiFirebase />;
        case /docker/.test(s): return <SiDocker />;
        case /kubernetes|k8s/.test(s): return <SiKubernetes />;
        case /supabase/.test(s): return <SiSupabase />;

        case /postgres|postgresql/.test(s): return <SiPostgresql />;
        case /mongo|mongodb/.test(s): return <SiMongodb />;
        case /mysql/.test(s): return <SiMysql />;
        case /db|database/.test(s): return <Database className="h-3.5 w-3.5" />;

        case /cloud/.test(s): return <Cloud className="h-3.5 w-3.5" />;
        case /server|api|rest/.test(s): return <Server className="h-3.5 w-3.5" />;
        case /ai|ml|gemini|openai/.test(s): return <Brain className="h-3.5 w-3.5" />;

        default: return null;
    }
}

export default function TechChips({ items, size = 'sm' }: Props) {
    const sizeCls = size === 'md' ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs';
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((tech, i) => {
                const Icon = getIcon(tech);
                return (
                    <Badge
                        key={`${tech}-${i}`}
                        className={[
                            'inline-flex items-center gap-1.5 rounded-full',
                            'border border-white/10 bg-white/[0.04] text-white/90',
                            'transition-colors hover:border-brand-600/40 hover:bg-brand-950/30',
                            'whitespace-nowrap',
                            sizeCls
                        ].join(' ')}
                    >
                        {Icon ? <span className="text-[1rem] leading-none">{Icon}</span> : null}
                        <span>{tech}</span>
                    </Badge>
                );
            })}
        </div>
    );
}
