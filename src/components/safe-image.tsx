'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type Props = ImageProps & {
    fallback?: React.ReactNode;
};

export default function SafeImage({ fallback, ...props }: Props) {
    const [errored, setErrored] = useState(false);

    if (errored) {
        return (
            <div className={props.className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,.8)' }}>
                {/* fallback custom */}
                {fallback ?? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                )}
            </div>
        );
    }

    return (
        <Image
            {...props}
            onError={() => setErrored(true)}
        // Asegúrate de no pasar className dos veces; ya viene en {...props}
        />
    );
}
