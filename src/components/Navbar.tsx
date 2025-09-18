'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { switchLocalePath } from '@/lib/i18n/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, User } from 'lucide-react';

type Props = { locale: 'es' | 'en' };

export default function Navbar({ locale }: Props) {
    const t = useTranslations('nav');
    const pathname = usePathname() ?? '/';
    const [open, setOpen] = useState(false);

    const other = useMemo(() => switchLocalePath(pathname, locale), [pathname, locale]);

    // Paths base por idioma
    const root = `/${locale}`;
    const links = [
        { href: `${root}/projects`, label: t('projects') },
        { href: `${root}/about`, label: locale === 'en' ? 'About' : 'Sobre mí' }
    ];

    // helper para resaltar link activo
    const isActive = (href: string) =>
        pathname === href || (href !== root && pathname.startsWith(href));

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-bgdark/70 backdrop-blur supports-[backdrop-filter]:bg-bgdark/40">
            <nav
                className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
                aria-label="Primary"
            >
                {/* Brand */}
                <Link href={root} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-1 ring-white/10">
                        <AvatarImage src="/NicoCalderon/avatar.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-white/5">
                            <User className="h-4 w-4 text-white/70" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white/90">{t('brand')}</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-2 sm:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={[
                                'px-3 py-2 text-sm transition-colors',
                                isActive(l.href) ? 'text-brand-300' : 'text-white/75 hover:text-white'
                            ].join(' ')}
                        >
                            {l.label}
                        </Link>
                    ))}

                    <Button asChild className="ml-1 rounded-[var(--radius-xl2)] bg-brand-600 hover:bg-brand-700">
                        <Link href={other} aria-label={t('toggle')}>
                            <span className="sr-only">{t('toggle')}</span>
                            <Globe className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile actions */}
                <div className="flex items-center gap-2 sm:hidden">
                    <Button asChild variant="ghost" className="h-9 w-9 p-0" aria-label={t('toggle')}>
                        <Link href={other}>
                            <Globe className="h-5 w-5" />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="h-9 w-9 p-0"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile panel */}
            {open && (
                <div className="sm:hidden border-t border-white/10 bg-bgdark/80 backdrop-blur">
                    <div className="mx-auto max-w-6xl px-4 py-3">
                        <ul className="space-y-1">
                            {links.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className={[
                                            'block rounded-md px-3 py-2 text-sm transition-colors',
                                            isActive(l.href) ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10'
                                        ].join(' ')}
                                        onClick={() => setOpen(false)}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
}
