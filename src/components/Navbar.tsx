'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

type Props = { locale: 'es' | 'en' };

// Cambia /es/... ↔ /en/... preservando el resto de la ruta
function switchLocalePath(pathname: string, current: 'es' | 'en') {
    const segs = pathname.split('/');
    // si la ruta es '/', normalizamos a '/es'
    if (segs.length <= 2 && (!segs[1] || segs[1] === '')) return current === 'en' ? '/es' : '/en';
    if (segs[1] === 'es' || segs[1] === 'en') {
        segs[1] = current === 'en' ? 'es' : 'en';
        return segs.join('/') || '/';
    }
    // fallback: ante rutas inesperadas, manda a home del otro idioma
    return current === 'en' ? '/es' : '/en';
}

export default function Navbar({ locale }: Props) {
    const tNav = useTranslations('nav');
    const pathname = usePathname();
    const otherHref = switchLocalePath(pathname ?? '/', locale);

    const root = locale === 'en' ? '/en' : '/es';
    const projects = `${root}/projects`;
    const about = `${root}/about`;

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-bgdark/70 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                {/* Brand + Avatar */}
                <Link href={root} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-white/15">
                        {/* Coloca tu foto en /public/me/avatar.jpg; si no existe, fallback al ícono */}
                        <AvatarImage src="/me/avatar.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-white/5">
                            <User className="h-4 w-4 text-white/70" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-white/90 font-semibold tracking-tight">{tNav('brand')}</span>
                </Link>

                {/* Navigation + Language */}
                <div className="flex items-center gap-4">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2 text-sm">
                            <NavigationMenuItem>
                                <Link href={projects} className="text-white/75 hover:text-white">{
                                    tNav('projects')
                                }</Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href={about} className="text-white/75 hover:text-white">{
                                    locale === 'en' ? 'About' : 'Sobre mí'
                                }</Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Button asChild className="rounded-[var(--radius-xl2)] bg-brand-600 hover:bg-brand-700">
                        <Link href={otherHref}>{tNav('toggle')}</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
