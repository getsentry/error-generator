'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFloppyDisk, FaXmark } from 'react-icons/fa6';
import { fadeInUp, tagPop } from '@/app/styles/animations';

interface ConfigPanelProps {
    activeConfigName: string | null;
    savedConfigNames: string[];
    onSave: (name: string) => void;
    onLoad: (name: string) => void;
    onDelete: (name: string) => void;
}

export const ConfigPanel = ({
    activeConfigName,
    savedConfigNames,
    onSave,
    onLoad,
    onDelete,
}: ConfigPanelProps) => {
    const [isNaming, setIsNaming] = useState(false);
    const [newName, setNewName] = useState('');

    const handleSave = () => {
        if (!newName.trim()) return;
        onSave(newName.trim());
        setNewName('');
        setIsNaming(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setIsNaming(false);
            setNewName('');
        }
    };

    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="border-3 border-hero-violet bg-bg-panel p-4 mb-4"
        >
            <div className="flex items-center justify-between">
                <h3
                    className={`font-black uppercase tracking-wider text-xl ${activeConfigName ? 'text-hero-lavender' : 'text-hero-coral'}`}
                >
                    {activeConfigName ? `Config: ${activeConfigName}` : 'Unsaved Config'}
                </h3>
                <div className="flex gap-2">
                    {isNaming ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Config name"
                                className="input-brutal px-2 py-1 text-xs w-32"
                                autoFocus
                            />
                            <button onClick={handleSave} className="btn-purple px-2 py-1 text-xs">
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsNaming(false);
                                    setNewName('');
                                }}
                                className="btn-outline px-2 py-1 text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsNaming(true)}
                            className="btn-purple px-2 py-1 text-xs flex items-center gap-1"
                        >
                            <FaFloppyDisk /> Save As
                        </button>
                    )}
                </div>
            </div>

            {savedConfigNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t-2 border-dashed border-hero-violet">
                    <AnimatePresence mode="popLayout">
                        {savedConfigNames.map((name) => (
                            <motion.span
                                key={name}
                                layout
                                variants={tagPop}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                onClick={() => onLoad(name)}
                                className={`tag-brutal cursor-pointer ${
                                    activeConfigName === name
                                        ? 'bg-hero-purple text-brutal-black'
                                        : ''
                                }`}
                            >
                                {name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(name);
                                    }}
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
};
