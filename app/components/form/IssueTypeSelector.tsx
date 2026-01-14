'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/styles/animations';
import { IssueType, ISSUE_TYPE_CONFIGS } from '@/app/types/issueTypes';

interface IssueTypeSelectorProps {
    selected: IssueType;
    onSelect: (type: IssueType) => void;
}

export const IssueTypeSelector = ({ selected, onSelect }: IssueTypeSelectorProps) => {
    return (
        <motion.div variants={fadeInUp} className="border-3 border-hero-violet bg-bg-panel p-4">
            <label className="label-brutal mb-3 block">Issue Type</label>
            <div className="flex gap-2 flex-wrap">
                {ISSUE_TYPE_CONFIGS.map((config) => (
                    <button
                        key={config.id}
                        onClick={() => config.enabled && onSelect(config.id)}
                        disabled={!config.enabled}
                        className={`
                            px-4 py-2 text-sm font-medium border-2 transition-all
                            ${
                                selected === config.id
                                    ? 'border-hero-coral bg-hero-coral text-brutal-black'
                                    : config.enabled
                                      ? 'border-hero-violet bg-transparent text-brutal-white hover:border-hero-coral'
                                      : 'border-gray-600 bg-transparent text-gray-500 cursor-not-allowed opacity-50'
                            }
                        `}
                        title={config.enabled ? config.description : 'Coming soon'}
                    >
                        {config.label}
                        {!config.enabled && <span className="ml-1 text-xs">(soon)</span>}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};
