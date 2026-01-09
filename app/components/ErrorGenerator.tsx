'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/app/styles/animations';
import { ToastContainer, ToastData, useToast } from '@/app/components/Toast';
import { ConfirmModal } from '@/app/components/ConfirmModal';
import { ErrorPreview } from '@/app/components/ErrorPreview';
import { ConfigPanel } from '@/app/components/ConfigPanel';
import { DsnInput } from '@/app/components/form/DsnInput';
import { FormFields } from '@/app/components/form/FormFields';
import { TagInput } from '@/app/components/form/TagInput';
import { BatchModePanel } from '@/app/components/form/BatchModePanel';
import { SkipConfirm } from '@/app/components/form/SkipConfirm';
import { useErrorForm } from '@/app/hooks/useErrorForm';
import { useBatchMode } from '@/app/hooks/useBatchMode';
import { useConfigStorage, ConfigData } from '@/app/hooks/useConfigStorage';

const ErrorGenerator = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [skipConfirm, setSkipConfirm] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const showToast = useToast(setToasts);
    const form = useErrorForm(showToast);
    const batch = useBatchMode(showToast);
    const configStorage = useConfigStorage();

    // Load initial config from localStorage on mount
    const { loadConfig: loadFormConfig } = form;
    const { loadConfig: loadBatchConfig } = batch;

    useEffect(() => {
        if (configStorage.mounted && !initialLoadDone) {
            const config = configStorage.currentConfig;
            loadFormConfig({
                dsn: config.dsn,
                message: config.message,
                priority: config.priority,
                tags: config.tags,
                errorCount: config.errorCount,
                errorsToGenerate: config.errorsToGenerate,
                fingerprintID: config.fingerprintID,
            });
            loadBatchConfig(config.batch);
            // Set this after state updates are queued, so auto-save waits for next render
            setInitialLoadDone(true);
        }
    }, [
        configStorage.mounted,
        configStorage.currentConfig,
        loadFormConfig,
        loadBatchConfig,
        initialLoadDone,
    ]);

    // Auto-save when form or batch config changes (skip first render after load)
    const { updateCurrentConfig } = configStorage;
    const isFirstRenderAfterLoad = useRef(true);
    const skipNextAutoSave = useRef(false);

    useEffect(() => {
        if (!configStorage.mounted || !initialLoadDone) return;

        // Skip the first render after initial load to avoid overwriting with stale state
        if (isFirstRenderAfterLoad.current) {
            isFirstRenderAfterLoad.current = false;
            return;
        }

        // Skip auto-save when loading a saved config
        if (skipNextAutoSave.current) {
            skipNextAutoSave.current = false;
            return;
        }

        const newConfig: ConfigData = {
            dsn: form.dsn,
            message: form.message,
            priority: form.priority,
            tags: form.tags,
            errorCount: form.errorCount,
            errorsToGenerate: form.errorsToGenerate,
            fingerprintID: form.fingerprintID,
            batch: {
                enabled: batch.enabled,
                frequency: batch.frequency,
                repeatCount: batch.repeatCount,
            },
        };
        updateCurrentConfig(newConfig);
    }, [
        configStorage.mounted,
        initialLoadDone,
        updateCurrentConfig,
        form.dsn,
        form.message,
        form.priority,
        form.tags,
        form.errorCount,
        form.errorsToGenerate,
        form.fingerprintID,
        batch.enabled,
        batch.frequency,
        batch.repeatCount,
    ]);

    const handleSaveConfig = (name: string) => {
        configStorage.saveConfig(name);
        showToast('Saved', `Config "${name}" saved`, 'success');
    };

    const handleLoadConfig = (name: string) => {
        const config = configStorage.savedConfigs[name];
        if (config) {
            skipNextAutoSave.current = true;
            configStorage.loadConfig(name);
            form.loadConfig({
                dsn: config.dsn,
                message: config.message,
                priority: config.priority,
                tags: config.tags,
                errorCount: config.errorCount,
                errorsToGenerate: config.errorsToGenerate,
                fingerprintID: config.fingerprintID,
            });
            batch.loadConfig(config.batch);
            showToast('Loaded', `Config "${name}" loaded`, 'success');
        }
    };

    const handleDeleteConfig = (name: string) => {
        configStorage.deleteConfig(name);
        showToast('Deleted', `Config "${name}" deleted`, 'warning');
    };

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

    if (!configStorage.mounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0">
                <div className="flex flex-col gap-4" />
                <div className="flex flex-col gap-4">
                    <div className="border-3 border-hero-violet bg-bg-panel p-4" />
                    <div className="border-3 border-hero-violet bg-bg-panel p-5 flex-1" />
                </div>
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

                <div className="flex flex-col">
                    <ConfigPanel
                        activeConfigName={configStorage.activeConfigName}
                        savedConfigNames={configStorage.getConfigNames()}
                        onSave={handleSaveConfig}
                        onLoad={handleLoadConfig}
                        onDelete={handleDeleteConfig}
                    />
                    <ErrorPreview payload={form.getPreviewPayload()} />
                </div>
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
