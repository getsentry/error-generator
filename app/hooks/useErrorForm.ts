import { useState, useCallback } from 'react';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CustomTag {
    key: string;
    value: string;
}

export type ErrorForm = ReturnType<typeof useErrorForm>;

interface FormState {
    dsn: string;
    errorCount: string;
    errorsToGenerate: string;
    fingerprintID: string;
    priority: Priority;
    message: string;
    tags: CustomTag[];
    dsnError: string;
}

export const useErrorForm = (
    showToast: (title: string, desc: string, status: 'success' | 'error' | 'warning') => void
) => {
    const [form, setForm] = useState<FormState>({
        dsn: '',
        errorCount: '1',
        errorsToGenerate: '1',
        fingerprintID: '',
        priority: 'HIGH',
        message: '',
        tags: [],
        dsnError: '',
    });

    const [newTagKey, setNewTagKey] = useState('');
    const [newTagValue, setNewTagValue] = useState('');

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const validateDsn = useCallback((value: string): boolean => {
        if (!value) {
            setForm((f) => ({ ...f, dsnError: 'DSN is required' }));
            return false;
        }
        const dsnRegex =
            /^https:\/\/[a-zA-Z0-9]+@([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\/[0-9]+$/;
        if (!dsnRegex.test(value)) {
            setForm((f) => ({ ...f, dsnError: 'Invalid DSN format' }));
            return false;
        }
        setForm((f) => ({ ...f, dsnError: '' }));
        return true;
    }, []);

    const handleDsnChange = (value: string) => {
        setForm((f) => ({ ...f, dsn: value }));
        validateDsn(value);
    };

    const addTag = () => {
        if (!newTagKey.trim() || !newTagValue.trim()) {
            showToast('Invalid tag', 'Both key and value are required', 'error');
            return;
        }
        if (form.tags.some((tag) => tag.key === newTagKey.trim())) {
            showToast('Duplicate key', 'Tag key already exists', 'error');
            return;
        }
        setForm((f) => ({
            ...f,
            tags: [...f.tags, { key: newTagKey.trim(), value: newTagValue.trim() }],
        }));
        setNewTagKey('');
        setNewTagValue('');
    };

    const removeTag = (keyToRemove: string) => {
        setForm((f) => ({ ...f, tags: f.tags.filter((tag) => tag.key !== keyToRemove) }));
    };

    const validate = (): boolean => {
        if (!validateDsn(form.dsn)) return false;

        const eventsPerError = parseInt(form.errorCount, 10);
        const numErrors = form.fingerprintID ? 1 : parseInt(form.errorsToGenerate, 10);

        if (isNaN(eventsPerError) || eventsPerError <= 0) {
            showToast('Invalid', 'Enter positive event count', 'error');
            return false;
        }
        if (!form.fingerprintID && (isNaN(numErrors) || numErrors <= 0)) {
            showToast('Invalid', 'Enter positive error count', 'error');
            return false;
        }
        return true;
    };

    const getPayload = () => ({
        dsn: form.dsn,
        errorCount: parseInt(form.errorCount, 10),
        errorsToGenerate: form.fingerprintID ? 1 : parseInt(form.errorsToGenerate, 10),
        fingerprintID: form.fingerprintID,
        priority: form.priority,
        tags: form.tags.reduce((acc, tag) => ({ ...acc, [tag.key]: tag.value }), {}),
        message: form.message,
    });

    const getPreviewPayload = () => ({
        dsn: form.dsn || 'https://xxx@sentry.io/123',
        level: form.priority.toLowerCase(),
        message: form.message || 'SampleError: This is a test error',
        fingerprint: form.fingerprintID ? [form.fingerprintID] : ['{{ default }}'],
        tags: {
            priority: form.priority,
            ...form.tags.reduce((acc, tag) => ({ ...acc, [tag.key]: tag.value }), {}),
        },
        extra: {
            eventsPerError: parseInt(form.errorCount, 10) || 1,
            errorsToGenerate: form.fingerprintID ? 1 : parseInt(form.errorsToGenerate, 10) || 1,
        },
    });

    const getConfig = () => ({
        dsn: form.dsn,
        message: form.message,
        priority: form.priority,
        tags: form.tags,
        errorCount: form.errorCount,
        errorsToGenerate: form.errorsToGenerate,
        fingerprintID: form.fingerprintID,
    });

    const loadConfig = (config: {
        dsn: string;
        message: string;
        priority: Priority;
        tags: CustomTag[];
        errorCount: string;
        errorsToGenerate: string;
        fingerprintID: string;
    }) => {
        setForm((f) => ({
            ...f,
            dsn: config.dsn,
            message: config.message,
            priority: config.priority,
            tags: config.tags,
            errorCount: config.errorCount,
            errorsToGenerate: config.errorsToGenerate,
            fingerprintID: config.fingerprintID,
            dsnError: '',
        }));
    };

    return {
        ...form,
        newTagKey,
        newTagValue,
        setNewTagKey,
        setNewTagValue,
        setField,
        handleDsnChange,
        addTag,
        removeTag,
        validate,
        getPayload,
        getPreviewPayload,
        getConfig,
        loadConfig,
    };
};
