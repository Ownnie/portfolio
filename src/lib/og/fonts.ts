// src/lib/og/fonts.ts
export async function loadInterRegular() {
    const res = await fetch(new URL('./assets/Inter-Regular.ttf', import.meta.url));
    return res.arrayBuffer();
}
export async function loadInterSemiBold() {
    const res = await fetch(new URL('./assets/Inter-SemiBold.ttf', import.meta.url));
    return res.arrayBuffer();
}


export async function getOgFonts() {
    const [regular, semibold] = await Promise.all([loadInterRegular(), loadInterSemiBold()]);
    return [
        { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
        { name: 'Inter', data: semibold, weight: 600 as const, style: 'normal' as const },
    ];
}
