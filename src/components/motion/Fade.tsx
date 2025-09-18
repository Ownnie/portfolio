// src/components/motion/Fade.tsx
'use client';
import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import clsx from 'clsx';

type FadeInProps<T extends ElementType> = {
    as?: T;
    className?: string;
    children?: ReactNode;
    y?: number;
    delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function FadeIn<T extends ElementType = 'div'>({
    as,
    className,
    children,
    y = 8,
    delay = 0,
    ...rest
}: FadeInProps<T>) {
    const C = (as ?? 'div') as ElementType;
    return (
        <motion.div initial={{ opacity: 0, y }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay }}>
            <C className={clsx(className)} {...(rest as ComponentPropsWithoutRef<typeof C>)}>{children}</C>
        </motion.div>
    );
}


type SlideInLiProps = {
    className?: string;
    children?: ReactNode;
    delay?: number;
};
export function SlideInLi({ className, children, delay = 0 }: SlideInLiProps) {
    return (
        <motion.li
            className={clsx('flex gap-2', className)}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.22, delay }}
        >
            {children}
        </motion.li>
    );
}
