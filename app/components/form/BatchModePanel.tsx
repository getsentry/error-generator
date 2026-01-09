'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/styles/animations';
import { BatchMode } from '@/app/hooks/useBatchMode';

interface BatchModePanelProps {
    batch: BatchMode;
}

export const BatchModePanel = ({ batch }: BatchModePanelProps) => {
    const progress = batch.totalRepeats > 0 ? (batch.currentRepeat / batch.totalRepeats) * 100 : 0;

    return (
        <motion.div variants={fadeInUp} className="border-2 border-hero-violet p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => batch.setEnabled(!batch.enabled)}
                        className="switch-track"
                        data-checked={batch.enabled}
                    >
                        <div className="switch-thumb" />
                    </button>
                    <span className="label-brutal !mb-0">Batch Mode</span>
                </div>
                {batch.enabled && (
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-brutal-white/70">Every</span>
                            <input
                                type="number"
                                min={1}
                                value={batch.frequency}
                                onChange={(e) => batch.setFrequency(e.target.value)}
                                className="input-brutal w-16 px-2 py-1 text-sm text-center"
                            />
                            <span className="text-sm text-brutal-white/70">s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-brutal-white/70">x</span>
                            <input
                                type="number"
                                min={1}
                                value={batch.repeatCount}
                                onChange={(e) => batch.setRepeatCount(e.target.value)}
                                className="input-brutal w-16 px-2 py-1 text-sm text-center"
                            />
                        </div>
                    </div>
                )}
            </div>
            {batch.isRunning && (
                <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span>
                            {batch.currentRepeat}/{batch.totalRepeats}
                        </span>
                        {batch.isWaiting && (
                            <span className="text-hero-coral font-bold">
                                {batch.formatTime(batch.timeRemaining)}
                            </span>
                        )}
                    </div>
                    <div className="progress-track h-2">
                        <div className="progress-fill h-full" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </motion.div>
    );
};
