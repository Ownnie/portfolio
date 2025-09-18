// src/lib/i18n/routing.ts

export type Locale = 'es' | 'en';
export const LOCALES: Locale[] = ['es', 'en'];

/** ¿El primer segmento es un locale soportado? */
export function isLocaleSegment(seg: string | undefined): seg is Locale {
    return !!seg && (LOCALES as string[]).includes(seg);
}

/** Normaliza pathname (si viene vacío o sin slash) */
function normalizePath(pathname?: string | null): string {
    if (!pathname) return '/';
    if (!pathname.startsWith('/')) return `/${pathname}`;
    return pathname;
}

/**
 * Cambia /es/... ↔ /en/... preservando el resto de la ruta.
 * - Si es '/', devuelve la home del otro idioma.
 * - Si no hay segmento de locale, lo antepone.
 * - Si hay segmento de locale, lo reemplaza.
 */
export function switchLocalePath(pathname: string, current: Locale): string {
    const path = normalizePath(pathname);
    const segs = path.split('/'); // ["", "es", "projects", "slug"...]

    // Home ("/" o "/es" o "/en")
    if (segs.length <= 2 && (!segs[1] || segs[1] === '')) {
        return current === 'en' ? '/es' : '/en';
    }

    if (isLocaleSegment(segs[1])) {
        // reemplaza el primer segmento por el opuesto
        segs[1] = current === 'en' ? 'es' : 'en';
        const next = segs.join('/');
        return next || '/';
    }

    // No había segmento de locale: anteponer el opuesto
    const opposite = current === 'en' ? 'es' : 'en';
    return `/${opposite}${path}`;
}

/**
 * Asegura que un pathname tenga el locale dado como primer segmento.
 * - Si ya lo tiene, lo devuelve igual.
 * - Si tiene otro, lo reemplaza.
 * - Si no tiene, lo antepone.
 */
export function withLocale(pathname: string, locale: Locale): string {
    const path = normalizePath(pathname);
    const segs = path.split('/');

    if (isLocaleSegment(segs[1])) {
        if (segs[1] === locale) return path;
        segs[1] = locale;
        return segs.join('/') || '/';
    }

    return `/${locale}${path}`;
}

/** Devuelve la home para un locale dado ("/es" o "/en") */
export function homeOf(locale: Locale): string {
    return locale === 'en' ? '/en' : '/es';
}

/** Construye una URL bajo un locale: withLocale('/projects', 'es') -> '/es/projects' */
export function href(locale: Locale, subpath: string): string {
    return withLocale(subpath, locale);
}
