'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/styles/animations';
import { ErrorForm } from '@/app/hooks/useErrorForm';

interface PerformanceFieldsProps {
    form: ErrorForm;
}

export const PerformanceFields = ({ form }: PerformanceFieldsProps) => {
    const { performance, setField } = form;

    const updatePerformance = (key: keyof typeof performance, value: string) => {
        setField('performance', { ...performance, [key]: value });
    };

    return (
        <>
            <motion.div variants={fadeInUp} className="border-3 border-hero-violet bg-bg-panel p-4">
                <label className="label-brutal mb-3 block">N+1 API Calls Configuration</label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="label-brutal text-xs">API Call Count</label>
                        <input
                            type="number"
                            min={10}
                            value={performance.callCount}
                            onChange={(e) => updatePerformance('callCount', e.target.value)}
                            className="input-brutal w-full px-3 py-2 text-sm"
                            placeholder="15"
                        />
                        <p className="text-xs text-gray-400 mt-1">Minimum 10 for detection</p>
                    </div>
                    <div>
                        <label className="label-brutal text-xs">Target Delay (ms)</label>
                        <input
                            type="number"
                            min={0}
                            value={performance.targetDelay}
                            onChange={(e) => updatePerformance('targetDelay', e.target.value)}
                            className="input-brutal w-full px-3 py-2 text-sm"
                            placeholder="50"
                        />
                        <p className="text-xs text-gray-400 mt-1">Delay per API call</p>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="border-3 border-hero-violet bg-bg-panel p-4">
                <label className="label-brutal text-xs">Custom Endpoint (optional)</label>
                <input
                    type="text"
                    value={performance.customEndpoint}
                    onChange={(e) => updatePerformance('customEndpoint', e.target.value)}
                    className="input-brutal w-full px-3 py-2 text-sm"
                    placeholder="Leave empty to use internal endpoint"
                />
                <p className="text-xs text-gray-400 mt-1">
                    Must be a GET endpoint. Uses /api/performance-target if empty.
                </p>
            </motion.div>
        </>
    );
};
