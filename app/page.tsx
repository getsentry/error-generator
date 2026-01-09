'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ErrorGenerator from '@/app/components/ErrorGenerator';
import { GeometricDecorations } from '@/app/styles/GeometricDecorations';
import { slideDown } from '@/app/styles/animations';

const useMounted = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted;
};

const SentryPage = () => {
    const mounted = useMounted();

    return (
        <div className="min-h-screen bg-bg-dark text-brutal-white relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-grid pointer-events-none" />

            {mounted && <GeometricDecorations />}

            <div className="max-w-7xl mx-auto px-6 py-8 flex-1 relative z-10 w-full">
                <div className="text-center mb-8">
                    {mounted ? (
                        <motion.div variants={slideDown} initial="initial" animate="animate">
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
                                <span className="text-hero-purple">Sentry</span>{' '}
                                <span className="text-hero-coral">Error</span>{' '}
                                <span className="text-brutal-white">Generator</span>
                            </h1>
                            <div className="mx-auto mt-4 w-56 h-1.5 bg-gradient-to-r from-hero-purple via-hero-coral to-hero-gold" />
                        </motion.div>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
                                <span className="text-hero-purple">Sentry</span>{' '}
                                <span className="text-hero-coral">Error</span>{' '}
                                <span className="text-brutal-white">Generator</span>
                            </h1>
                            <div className="mx-auto mt-4 w-56 h-1.5 bg-gradient-to-r from-hero-purple via-hero-coral to-hero-gold" />
                        </>
                    )}
                </div>

                <ErrorGenerator />
            </div>

            <footer className="py-4 mt-auto text-center border-t-2 border-dashed border-hero-violet">
                <p className="text-sm text-gray-500">
                    Commit{' '}
                    <a
                        href={`https://github.com/getsentry/error-generator/commit/${process.env.COMMIT_HASH}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-hero-lavender font-bold hover:text-hero-purple transition-colors font-mono"
                    >
                        {process.env.COMMIT_HASH || 'unknown'}
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default SentryPage;
