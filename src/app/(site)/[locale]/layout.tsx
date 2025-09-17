import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';  // sólo esto
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: 'es' | 'en' }>;
}) {
  const { locale } = await params;

  // Sólo getMessages, que utiliza tu request-config que ya importa locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-bgdark text-white antialiased`}>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-bgdark/70 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <a href={locale === 'en' ? '/en' : '/es'} className="text-white/90 font-semibold tracking-tight">
              Nicolás Calderón
            </a>
            <nav className="flex items-center gap-5 text-sm">
              <a href={locale === 'en' ? '/en/projects' : '/es/projects'} className="text-white/70 hover:text-white">
                {locale === 'en' ? 'Projects' : 'Proyectos'}
              </a>
              <a
                href={locale === 'en' ? '/es' : '/en'}
                className="rounded-[var(--radius-xl2)] px-3 py-1 bg-brand-600 hover:bg-brand-700"
              >
                {locale === 'en' ? 'ES' : 'EN'}
              </a>
            </nav>
          </div>
        </header>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="min-h-dvh">{children}</main>
        </NextIntlClientProvider>

        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
            © {new Date().getFullYear()} Nicolás Calderón — Portafolio.
          </div>
        </footer>
      </body>
    </html>
  );
}
