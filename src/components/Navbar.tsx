// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const isEN = pathname.startsWith('/en');
    const localeToggle = isEN ? pathname.replace('/en', '/es') : `/en${pathname}`;
    return (
        <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link href="/" className="font-semibold">Nicolás Calderón</Link>
                <nav className="flex items-center gap-4 text-sm">
                    <Link href={isEN ? '/en/projects' : '/projects'}>Projects</Link>
                    <Link href={localeToggle} className="px-3 py-1 rounded-xl2 bg-brand-600 hover:bg-brand-700">
                        {isEN ? 'ES' : 'EN'}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
