// src/app/(site)/[locale]/projects/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getOgFonts } from '@/lib/og/fonts';
import { getProjectBySlug } from '@/lib/mdx';

export const runtime = 'nodejs';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const { meta } = getProjectBySlug(slug);

    const fonts = await getOgFonts();

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background:
                        'radial-gradient(1200px 600px at -10% -20%, rgba(124,58,237,0.3), transparent 60%), #0b0b0f',
                    color: '#fff',
                    fontFamily: 'Inter',
                }}
            >
                <div style={{ fontSize: 22, opacity: 0.85, marginBottom: 10 }}>Project</div>

                <div
                    style={{
                        fontSize: 58,
                        fontWeight: 600,
                        lineHeight: 1.1,
                        background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {meta.title}
                </div>

                {meta.description ? (
                    <>
                        <div style={{ height: 14 }} />
                        <div style={{ fontSize: 26, opacity: 0.9, maxWidth: 900 }}>{meta.description}</div>
                    </>
                ) : null}

                <div style={{ position: 'absolute', bottom: 36, left: 80, fontSize: 20, opacity: 0.8 }}>
                    nicolascalderon.dev
                </div>
            </div>
        ),
        { ...size, fonts }
    );
}
