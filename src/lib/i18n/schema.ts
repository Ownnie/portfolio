import type { I18nText, I18nList } from '@/lib/i18n/content';

export type Project = {
    title: I18nText;
    slug: string;
    period?: I18nText;
    role?: I18nText;
    stack?: string[];
    description?: I18nText;
    impact?: I18nList;
    metrics?: I18nList;
    links?: { label?: string; href?: string; type?: 'repo' | 'demo' | string }[];
    cover?: string;
    featured?: boolean;
};
