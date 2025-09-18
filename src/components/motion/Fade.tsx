'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Polimórfico: nav, header, div, li, section
type As = 'div' | 'nav' | 'header' | 'section' | 'li';

export function FadeIn({
    as = 'div',
    children,
    className,
    delay = 0,
    y = 8,
}: {
    as?: As;
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
}) {
    const M: any = (motion as any)[as];
    return (
        <M
            className={className}
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay }}
        >
            {children}
        </M>
    );
}

export function SlideInLi({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    return (
        <motion.li
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.22, delay }}
        >
            {children}
        </motion.li>
    );
}
