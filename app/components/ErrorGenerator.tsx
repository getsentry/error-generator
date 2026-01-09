'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/app/styles/animations';
import { ToastContainer, ToastData, useToast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';
import { ErrorPreview } from '@/app/components/ErrorPreview';
import { DsnInput } from '@/app/components/form/DsnInput';
import { FormFields } from '@/app/components/form/FormFields';
import { TagInput } from '@/app/components/form/TagInput';
import { BatchModePanel } from '@/app/components/form/BatchModePanel';
import { SkipConfirm } from '@/app/components/form/SkipConfirm';
import { useErrorForm } from '@/app/hooks/useErrorForm';
import { useBatchMode } from '@/app/hooks/useBatchMode';

const ErrorGenerator = () => {
    const [mounted, setMounted] = useState(false);
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [skipConfirm, setSkipConfirm] = useState(false);

    const showToast = useToast(setToasts);
    const form = useErrorForm(showToast);
    const batch = useBatchMode(showToast);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sendBatch = async () => {
        const response = await fetch('/api/generate-errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.getPayload()),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to generate errors');
        return data;
    };

    const generateErrors = async () => {
        if (!form.validate()) return;
        if (batch.enabled && !batch.validate()) {
            showToast('Invalid', 'Enter positive interval values', 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (batch.enabled) {
                await batch.execute(sendBatch);
            } else {
                const data = await sendBatch();
                showToast('Sent!', data.message || 'Errors sent to Sentry', 'success');
            }
        } catch (error) {
            showToast('Error', error instanceof Error ? error.message : 'Failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => (skipConfirm ? generateErrors() : setIsOpen(true));
    const isDisabled = isLoading || batch.isRunning;

    const buttonText = batch.isRunning
        ? `Running (${batch.currentRepeat}/${batch.totalRepeats})`
        : isLoading
          ? batch.enabled
              ? 'Starting...'
              : 'Generating...'
          : batch.enabled
            ? 'Start Interval'
            : 'Generate Errors';

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0">
                <div className="flex flex-col gap-4" />
                <div className="border-3 border-hero-violet bg-bg-panel p-5" />
            </div>
        );
    }

    return (
        <>
            <ToastContainer toasts={toasts} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col gap-4"
                >
                    <DsnInput form={form} />
                    <FormFields form={form} />
                    <TagInput form={form} />
                    <BatchModePanel batch={batch} />

                    <motion.div variants={fadeInUp} className="flex items-center justify-between">
                        <SkipConfirm
                            enabled={skipConfirm}
                            handleToggle={() => setSkipConfirm(!skipConfirm)}
                        />
                        <div className="flex gap-3">
                            {batch.isRunning && (
                                <button
                                    onClick={() => {
                                        setIsLoading(false);
                                        batch.stop();
                                    }}
                                    className="btn-danger px-5 py-2.5"
                                >
                                    Stop
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isDisabled}
                                className={`btn-coral px-8 py-2.5 ${isDisabled ? 'opacity-70' : ''}`}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                <ErrorPreview payload={form.getPreviewPayload()} />
            </div>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={generateErrors}
                title={batch.enabled ? 'Start Batch Mode?' : 'Generate Errors?'}
                message={
                    batch.enabled
                        ? `This will generate real errors and use your Sentry quota. Sending every ${batch.frequency}s, ${batch.repeatCount} times.`
                        : 'This will generate real errors and use your Sentry quota.'
                }
            />
        </>
    );
};

export default ErrorGenerator;
