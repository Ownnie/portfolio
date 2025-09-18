import { ReactNode } from 'react';

// Server Component OK
export default function Highlight({ children }: { children: ReactNode }) {
    return (
        <mark className="rounded-[6px] bg-brand-500/15 px-1.5 py-0.5 text-brand-200 ring-1 ring-inset ring-brand-500/20">
            {children}
        </mark>
    );
}
