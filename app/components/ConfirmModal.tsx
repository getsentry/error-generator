'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-brutal-black/80"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="modal-brutal max-w-lg w-full mx-4 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="modal-header text-2xl text-hero-coral">{title}</h2>
                    <p className="text-brutal-white/90 text-base mb-6 leading-relaxed">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="btn-outline px-5 py-2.5">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onConfirm();
                            }}
                            className="btn-coral px-5 py-2.5"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
