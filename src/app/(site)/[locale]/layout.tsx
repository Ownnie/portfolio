import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
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

  // Mensajes para el provider
  const messages = await getMessages({ locale });
  // Traducciones para el footer (namespace "footer")
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-bgdark text-white antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* ⬇️ Ahora el Navbar está dentro del provider */}
          <Navbar locale={locale} />
          <main className="min-h-dvh">{children}</main>
          <footer className="mt-16 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
              © {new Date().getFullYear()} Nicolás Calderón — {tFooter('copyright')}
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
