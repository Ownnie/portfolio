import { getRequestConfig } from 'next-intl/server';

const SUPPORTED = ['es', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED)[number];
const DEFAULT_LOCALE: SupportedLocale = 'es';

export default getRequestConfig(async ({ locale }) => {
    const resolved: SupportedLocale =
        (SUPPORTED as readonly string[]).includes(locale ?? '') ? (locale as SupportedLocale) : DEFAULT_LOCALE;

    const messages = (await import(`@/lib/i18n/messages/${resolved}.json`)).default;

    return { locale: resolved, messages };
});
