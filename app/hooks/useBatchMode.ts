import { useState, useRef, useCallback, useEffect } from 'react';

interface BatchModeState {
    enabled: boolean;
    frequency: string;
    repeatCount: string;
    isRunning: boolean;
    currentRepeat: number;
    totalRepeats: number;
    timeRemaining: number;
    isWaiting: boolean;
}

export type BatchMode = ReturnType<typeof useBatchMode>;

export const useBatchMode = (
    showToast: (title: string, desc: string, status: 'success' | 'error' | 'warning') => void
) => {
    const [state, setState] = useState<BatchModeState>({
        enabled: false,
        frequency: '30',
        repeatCount: '5',
        isRunning: false,
        currentRepeat: 0,
        totalRepeats: 0,
        timeRemaining: 0,
        isWaiting: false,
    });

    const countdownIdRef = useRef<NodeJS.Timeout | null>(null);
    const stoppedRef = useRef(false);

    useEffect(() => {
        return () => {
            if (countdownIdRef.current) clearInterval(countdownIdRef.current);
        };
    }, []);

    const setEnabled = (enabled: boolean) => setState((s) => ({ ...s, enabled }));
    const setFrequency = (frequency: string) => setState((s) => ({ ...s, frequency }));
    const setRepeatCount = (repeatCount: string) => setState((s) => ({ ...s, repeatCount }));

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startCountdown = (duration: number): Promise<boolean> => {
        return new Promise((resolve) => {
            setState((s) => ({ ...s, timeRemaining: duration, isWaiting: true }));
            countdownIdRef.current = setInterval(() => {
                if (stoppedRef.current) {
                    if (countdownIdRef.current) clearInterval(countdownIdRef.current);
                    resolve(false);
                    return;
                }
                setState((s) => {
                    if (s.timeRemaining <= 1) {
                        if (countdownIdRef.current) clearInterval(countdownIdRef.current);
                        resolve(true);
                        return { ...s, timeRemaining: 0, isWaiting: false };
                    }
                    return { ...s, timeRemaining: s.timeRemaining - 1 };
                });
            }, 1000);
        });
    };

    const execute = useCallback(
        async (sendBatch: () => Promise<{ message?: string }>) => {
            const repeats = parseInt(state.repeatCount, 10);
            const frequency = parseInt(state.frequency, 10);

            stoppedRef.current = false;
            setState((s) => ({ ...s, isRunning: true, currentRepeat: 0, totalRepeats: repeats }));

            for (let i = 0; i < repeats; i++) {
                if (stoppedRef.current) break;

                setState((s) => ({ ...s, currentRepeat: i + 1 }));
                try {
                    const data = await sendBatch();
                    showToast(
                        `Batch ${i + 1}/${repeats}`,
                        data.message || 'Sent to Sentry',
                        'success'
                    );
                } catch (error) {
                    if (!stoppedRef.current) {
                        showToast(
                            'Error',
                            error instanceof Error ? error.message : 'Failed',
                            'error'
                        );
                    }
                    break;
                }

                if (i < repeats - 1) {
                    const shouldContinue = await startCountdown(frequency);
                    if (!shouldContinue) break;
                }
            }

            if (!stoppedRef.current) {
                showToast('Complete', `Sent ${repeats} batches`, 'success');
            }
            setState((s) => ({ ...s, isRunning: false, isWaiting: false }));
        },
        [state.repeatCount, state.frequency, showToast]
    );

    const stop = useCallback(() => {
        stoppedRef.current = true;
        if (countdownIdRef.current) clearInterval(countdownIdRef.current);
        setState((s) => {
            showToast('Stopped', `After ${s.currentRepeat}/${s.totalRepeats}`, 'warning');
            return { ...s, isRunning: false, isWaiting: false };
        });
    }, [showToast]);

    const validate = (): boolean => {
        const frequency = parseInt(state.frequency, 10);
        const repeats = parseInt(state.repeatCount, 10);
        return !isNaN(frequency) && frequency > 0 && !isNaN(repeats) && repeats > 0;
    };

    const getConfig = () => ({
        enabled: state.enabled,
        frequency: state.frequency,
        repeatCount: state.repeatCount,
    });

    const loadConfig = (config: { enabled: boolean; frequency: string; repeatCount: string }) => {
        setState((s) => ({
            ...s,
            enabled: config.enabled,
            frequency: config.frequency,
            repeatCount: config.repeatCount,
        }));
    };

    return {
        ...state,
        setEnabled,
        setFrequency,
        setRepeatCount,
        formatTime,
        execute,
        stop,
        validate,
        getConfig,
        loadConfig,
    };
};
