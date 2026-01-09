'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { fadeInUp, tagPop } from '@/app/styles/animations';
import { ErrorForm } from '@/app/hooks/useErrorForm';

interface TagInputProps {
    form: ErrorForm;
}

export const TagInput = ({ form }: TagInputProps) => (
    <motion.div variants={fadeInUp}>
        <label className="label-brutal">Custom Tags</label>
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Key"
                value={form.newTagKey}
                onChange={(e) => form.setNewTagKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && form.addTag()}
                className="input-brutal flex-1 px-3 py-2 text-sm"
            />
            <input
                type="text"
                placeholder="Value"
                value={form.newTagValue}
                onChange={(e) => form.setNewTagValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && form.addTag()}
                className="input-brutal flex-1 px-3 py-2 text-sm"
            />
            <button onClick={form.addTag} className="btn-purple px-3 py-2">
                <FaPlus />
            </button>
        </div>
        {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence mode="popLayout">
                    {form.tags.map((tag) => (
                        <motion.span
                            key={tag.key}
                            layout
                            variants={tagPop}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="tag-brutal"
                        >
                            {tag.key}: {tag.value}
                            <button
                                onClick={() => form.removeTag(tag.key)}
                                className="hover:text-hero-sunset"
                            >
                                <FaXmark />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
        )}
    </motion.div>
);
