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
import { IssueTypeSelector } from '@/app/components/form/IssueTypeSelector';
import { PerformanceFields } from '@/app/components/form/PerformanceFields';
import { useErrorForm } from '@/app/hooks/useErrorForm';
import { useBatchMode } from '@/app/hooks/useBatchMode';
import { useConfigStorage, ConfigData } from '@/app/hooks/useConfigStorage';
import { IssueType } from '@/app/types/issueTypes';

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
                issueType: config.issueType,
                dsn: config.dsn,
                message: config.message,
                priority: config.priority,
                tags: config.tags,
                errorCount: config.errorCount,
                errorsToGenerate: config.errorsToGenerate,
                fingerprintID: config.fingerprintID,
                performance: config.performance,
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
            issueType: form.issueType,
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
            performance: form.performance,
        };
        updateCurrentConfig(newConfig);
    }, [
        configStorage.mounted,
        initialLoadDone,
        updateCurrentConfig,
        form.issueType,
        form.dsn,
        form.message,
        form.priority,
        form.tags,
        form.errorCount,
        form.errorsToGenerate,
        form.fingerprintID,
        form.performance,
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
                issueType: config.issueType,
                dsn: config.dsn,
                message: config.message,
                priority: config.priority,
                tags: config.tags,
                errorCount: config.errorCount,
                errorsToGenerate: config.errorsToGenerate,
                fingerprintID: config.fingerprintID,
                performance: config.performance,
            });
            batch.loadConfig(config.batch);
            showToast('Loaded', `Config "${name}" loaded`, 'success');
        }
    };

    const handleDeleteConfig = (name: string) => {
        configStorage.deleteConfig(name);
        showToast('Deleted', `Config "${name}" deleted`, 'warning');
    };

    const sendErrorBatch = async () => {
        const response = await fetch('/api/generate-errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.getPayload()),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to generate errors');
        return data;
    };

    const generatePerformanceIssue = async () => {
        const config = form.getPerformancePayload();
        const targetEndpoint = `/api/performance-target?delay=${config.targetDelay}`;

        const startTime = Date.now() / 1000;
        const spanTimings: Array<{ id: string; start: number; end: number }> = [];

        const promises = Array.from({ length: config.callCount }, async (_, i) => {
            const spanStart = Date.now() / 1000;
            const url = config.customEndpoint
                ? `${config.customEndpoint}?id=${i}`
                : `${targetEndpoint}&id=${i}`;
            await fetch(url, { method: 'GET' });
            const spanEnd = Date.now() / 1000;
            const spanId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
            spanTimings.push({ id: spanId, start: spanStart, end: spanEnd });
        });
        await Promise.all(promises);

        const endTime = Date.now() / 1000;
        const traceId = crypto.randomUUID().replace(/-/g, '');
        const transactionId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

        const dsnParts = form.dsn.split('@');
        const publicKey = dsnParts[0].split('://')[1];
        const hostProject = dsnParts[1].split('/');
        const host = hostProject[0];
        const projectId = hostProject[1];

        const spans = spanTimings.map((timing, i) => ({
            span_id: timing.id,
            trace_id: traceId,
            parent_span_id: transactionId,
            op: 'http.client',
            description: `GET /api/performance-target?id=${i}`,
            start_timestamp: timing.start,
            timestamp: timing.end,
            status: 'ok',
            data: {
                'http.method': 'GET',
                'http.url':
                    config.customEndpoint || `${window.location.origin}${targetEndpoint}&id=${i}`,
                'http.status_code': 200,
            },
        }));

        const transaction = {
            type: 'transaction',
            event_id: crypto.randomUUID(),
            timestamp: endTime,
            start_timestamp: startTime,
            platform: 'javascript',
            transaction: 'N+1 API Calls Test',
            op: 'ui.action',
            trace_id: traceId,
            span_id: transactionId,
            spans,
            contexts: {
                trace: {
                    trace_id: traceId,
                    span_id: transactionId,
                    op: 'ui.action',
                    status: 'ok',
                },
            },
            tags: {
                generated_by: 'error-generator.sentry.dev',
                environment: 'error-generator',
            },
        };

        const envelopeHeader = JSON.stringify({
            event_id: transaction.event_id,
            sent_at: new Date().toISOString(),
            dsn: form.dsn,
        });
        const itemHeader = JSON.stringify({ type: 'transaction' });
        const envelope = `${envelopeHeader}\n${itemHeader}\n${JSON.stringify(transaction)}`;

        const response = await fetch(`https://${host}/api/${projectId}/envelope/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-sentry-envelope',
                'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=error-generator/1.0, sentry_key=${publicKey}`,
            },
            body: envelope,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to send transaction: ${text}`);
        }

        return {
            message: `Generated N+1 API calls performance issue (${config.callCount} calls, ${spans.length} spans)`,
        };
    };

    const generateIssue = async () => {
        if (!form.validate()) return;

        if (form.issueType === 'error') {
            if (batch.enabled && !batch.validate()) {
                showToast('Invalid', 'Enter positive interval values', 'error');
                return;
            }

            setIsLoading(true);
            try {
                if (batch.enabled) {
                    await batch.execute(sendErrorBatch);
                } else {
                    const data = await sendErrorBatch();
                    showToast('Sent!', data.message || 'Errors sent to Sentry', 'success');
                }
            } catch (error) {
                showToast('Error', error instanceof Error ? error.message : 'Failed', 'error');
            } finally {
                setIsLoading(false);
            }
        } else if (form.issueType === 'performance') {
            setIsLoading(true);
            try {
                const data = await generatePerformanceIssue();
                if (data) {
                    showToast('Sent!', data.message, 'success');
                }
            } catch (error) {
                showToast('Error', error instanceof Error ? error.message : 'Failed', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = () => (skipConfirm ? generateIssue() : setIsOpen(true));
    const isDisabled = isLoading || batch.isRunning;

    const getButtonText = () => {
        if (form.issueType === 'performance') {
            return isLoading ? 'Generating...' : 'Generate N+1 Issue';
        }
        if (batch.isRunning) {
            return `Running (${batch.currentRepeat}/${batch.totalRepeats})`;
        }
        if (isLoading) {
            return batch.enabled ? 'Starting...' : 'Generating...';
        }
        return batch.enabled ? 'Start Interval' : 'Generate Errors';
    };

    const buttonText = getButtonText();

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

    const handleIssueTypeChange = (type: IssueType) => {
        form.setField('issueType', type);
    };

    const getConfirmTitle = () => {
        if (form.issueType === 'performance') return 'Generate Performance Issue?';
        if (batch.enabled) return 'Start Batch Mode?';
        return 'Generate Errors?';
    };

    const getConfirmMessage = () => {
        if (form.issueType === 'performance') {
            return `This will generate ${form.performance.callCount} API calls to trigger an N+1 performance issue detection.`;
        }
        if (batch.enabled) {
            return `This will generate real errors and use your Sentry quota. Sending every ${batch.frequency}s, ${batch.repeatCount} times.`;
        }
        return 'This will generate real errors and use your Sentry quota.';
    };

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
                    <IssueTypeSelector selected={form.issueType} onSelect={handleIssueTypeChange} />

                    <DsnInput form={form} />

                    {form.issueType === 'error' && (
                        <>
                            <FormFields form={form} />
                            <TagInput form={form} />
                            <BatchModePanel batch={batch} />
                        </>
                    )}

                    {form.issueType === 'performance' && <PerformanceFields form={form} />}

                    <motion.div variants={fadeInUp} className="flex items-center justify-between">
                        <SkipConfirm
                            enabled={skipConfirm}
                            handleToggle={() => setSkipConfirm(!skipConfirm)}
                        />
                        <div className="flex gap-3">
                            {batch.isRunning && form.issueType === 'error' && (
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
                    <ErrorPreview
                        payload={
                            form.issueType === 'performance'
                                ? form.getPerformancePreviewPayload()
                                : form.getPreviewPayload()
                        }
                    />
                </div>
            </div>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={generateIssue}
                title={getConfirmTitle()}
                message={getConfirmMessage()}
            />
        </>
    );
};

export default ErrorGenerator;
