// src/app/(site)/[locale]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getOgFonts } from '@/lib/og/fonts';

export const runtime = 'edge'; // recomendado para OG
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
                <div
                    style={{
                        fontSize: 24,
                        opacity: 0.85,
                        marginBottom: 12,
                    }}
                >
                    Nicolás Calderón
                </div>

                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 600,
                        lineHeight: 1.1,
                        background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Software Engineer — Full-Stack & Cloud
                </div>

                <div style={{ height: 18 }} />

                <div style={{ fontSize: 28, opacity: 0.9, maxWidth: 900 }}>
                    Web, móvil, APIs y despliegues con foco en performance y claridad técnica.
                </div>
            </div>
        ),
        { ...size, fonts }
    );
}
