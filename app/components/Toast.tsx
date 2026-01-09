'use client';

import { motion, AnimatePresence } from 'framer-motion';

export interface ToastData {
    id: string;
    title: string;
    description: string;
    status: 'success' | 'error' | 'warning';
}

interface ToastContainerProps {
    toasts: ToastData[];
}

export const ToastContainer = ({ toasts }: ToastContainerProps) => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
            {toasts.map((toast) => (
                <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className={`p-4 border-3 ${
                        toast.status === 'success'
                            ? 'bg-hero-purple text-brutal-white border-brutal-white'
                            : toast.status === 'error'
                              ? 'bg-hero-sunset text-brutal-white border-brutal-white'
                              : 'bg-hero-gold text-brutal-black border-brutal-black'
                    }`}
                >
                    <p className="font-bold uppercase text-base">{toast.title}</p>
                    <p className="text-sm">{toast.description}</p>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);

export const useToast = (setToasts: React.Dispatch<React.SetStateAction<ToastData[]>>) => {
    const showToast = (title: string, description: string, status: ToastData['status']) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, title, description, status }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    return showToast;
};
