'use client';

import { Badge } from '@/components/ui/badge';
import { Github, Zap, Cpu } from 'lucide-react';


type Props = {
    items: string[];
    // opcional: pequeño mapeo para iconos por palabra clave
    intent?: 'default' | 'tech' | 'backend' | 'cloud';
};

export default function SkillChips({ items }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((s, i) => {
                const icon =
                    /next|react|tailwind/i.test(s) ? <Zap className="mr-1.5 h-3.5 w-3.5" /> :
                        /java|spring|node|nest/i.test(s) ? <Cpu className="mr-1.5 h-3.5 w-3.5" /> :
                            /github|git/i.test(s) ? <Github className="mr-1.5 h-3.5 w-3.5" /> :
                                null;

                return (
                    <Badge
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/90 transition-all hover:border-brand-600/40 hover:bg-brand-900/30"
                    >
                        {icon}
                        {s}
                    </Badge>
                );
            })}
        </div>
    );
}
