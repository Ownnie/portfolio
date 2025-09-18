/* OG base card: oscuro + acento morado */
export function OgCard({
    title,
    subtitle,
    badge
}: {
    title: string;
    subtitle?: string;
    badge?: string;
}) {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 48,
                background:
                    'radial-gradient(circle at 20% -10%, #7c3aed33, transparent 35%), radial-gradient(circle at 80% 0%, #8b5cf633, transparent 40%), #0b0b10'
            }}
        >
            {badge && (
                <div
                    style={{
                        display: 'inline-flex',
                        padding: '6px 12px',
                        borderRadius: 999,
                        fontSize: 24,
                        color: '#D6BCFA',
                        backgroundColor: '#1f1633',
                        border: '1px solid #3C2A66',
                        marginBottom: 16
                    }}
                >
                    {badge}
                </div>
            )}
            <div style={{ fontSize: 54, color: 'white', fontWeight: 700, lineHeight: 1.15 }}>
                {title}
            </div>
            {subtitle ? (
                <div style={{ marginTop: 8, fontSize: 28, color: '#BFBFCC' }}>{subtitle}</div>
            ) : null}
        </div>
    );
}
