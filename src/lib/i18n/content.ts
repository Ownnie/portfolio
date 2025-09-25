export type Locale = 'es' | 'en';

// Un texto puede ser string o {es,en}
export type I18nText = string | { es?: string; en?: string };
export type I18nList = string[] | { es?: string[]; en?: string[] };

export function tText(v: I18nText | undefined, locale: Locale, fallback = ''): string {
    if (!v) return fallback;
    if (typeof v === 'string') return v;
    return v[locale] ?? v.es ?? v.en ?? fallback;
}

export function tList(v: I18nList | undefined, locale: Locale): string[] {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return v[locale] ?? v.es ?? v.en ?? [];
}
