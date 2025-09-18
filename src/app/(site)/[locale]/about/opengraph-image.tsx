import { ImageResponse } from 'next/og';
import { getMessages } from 'next-intl/server';
import { OgCard } from '@/lib/og/base';
import { loadInterRegular, loadInterSemiBold } from '@/lib/og/fonts';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type AboutMsgs = {
    aboutPage?: {
        summary?: { lead?: string; body?: string };
    };
};

export default async function Image({ params }: { params: { locale: 'es' | 'en' } }) {
    const { locale } = params;
    const messages = (await getMessages({ locale })) as AboutMsgs;
    const ap = messages.aboutPage;

    const regular = await loadInterRegular();
    const semibold = await loadInterSemiBold();

    return new ImageResponse(
        <OgCard
            badge="About"
            title={ap?.summary?.lead ?? 'About — Nicolás Calderón'}
            subtitle={ap?.summary?.body?.slice(0, 90) ?? 'Full-Stack & Cloud'}
        />,
        {
            ...size,
            fonts: [
                { name: 'Inter', data: regular, style: 'normal', weight: 400 },
                { name: 'Inter', data: semibold, style: 'normal', weight: 600 },
            ],
        }
    );
}
