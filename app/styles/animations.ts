import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export const slideDown: Variants = {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
};

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const tagPop: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 500, damping: 25 },
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.15 },
    },
};

export const floatingAnimation: Variants = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const rotatingAnimation: Variants = {
    animate: {
        rotate: [0, 360],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

export const bobbingAnimation: Variants = {
    animate: {
        y: [0, -10, 0],
        rotate: [0, 5, 0, -5, 0],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const shake: Variants = {
    animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
    },
};
