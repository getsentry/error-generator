'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/styles/animations';

interface ErrorPreviewProps {
    payload: object;
}

export const ErrorPreview = ({ payload }: ErrorPreviewProps) => {
    const isPerformance =
        'type' in payload && (payload as { type: string }).type === 'N+1 API Calls';
    const title = isPerformance ? 'Performance Issue Preview' : 'Error Preview';

    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="border-3 border-hero-violet bg-bg-panel p-5"
        >
            <h3 className="font-black uppercase tracking-wider text-xl text-hero-coral mb-4">
                {title}
            </h3>
            <pre className="text-sm text-brutal-white/90 overflow-auto font-mono leading-relaxed">
                <code>{JSON.stringify(payload, null, 2)}</code>
            </pre>
        </motion.div>
    );
};
