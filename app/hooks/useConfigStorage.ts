import { useState, useEffect, useCallback, useRef } from 'react';

export interface ConfigData {
    dsn: string;
    message: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    tags: Array<{ key: string; value: string }>;
    errorCount: string;
    errorsToGenerate: string;
    fingerprintID: string;
    batch: {
        enabled: boolean;
        frequency: string;
        repeatCount: string;
    };
}

interface SavedConfigs {
    [name: string]: ConfigData;
}

const STORAGE_KEY_CURRENT = 'error-generator:current';
const STORAGE_KEY_SAVED = 'error-generator:saved';
const STORAGE_KEY_ACTIVE = 'error-generator:active';

const defaultConfig: ConfigData = {
    dsn: '',
    message: '',
    priority: 'HIGH',
    tags: [],
    errorCount: '1',
    errorsToGenerate: '1',
    fingerprintID: '',
    batch: {
        enabled: false,
        frequency: '30',
        repeatCount: '5',
    },
};

const isValidConfig = (data: unknown): data is ConfigData => {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.dsn === 'string' &&
        typeof d.message === 'string' &&
        ['HIGH', 'MEDIUM', 'LOW'].includes(d.priority as string) &&
        Array.isArray(d.tags) &&
        typeof d.errorCount === 'string' &&
        typeof d.errorsToGenerate === 'string' &&
        typeof d.fingerprintID === 'string' &&
        d.batch !== null &&
        typeof d.batch === 'object'
    );
};

export const useConfigStorage = () => {
    const [mounted, setMounted] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<ConfigData>(defaultConfig);
    const [savedConfigs, setSavedConfigs] = useState<SavedConfigs>({});
    const [activeConfigName, setActiveConfigName] = useState<string | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        try {
            const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
            if (storedCurrent) {
                const parsed = JSON.parse(storedCurrent);
                if (isValidConfig(parsed)) {
                    setCurrentConfig(parsed);
                }
            }
            const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
            if (storedSaved) {
                const parsed = JSON.parse(storedSaved);
                if (parsed && typeof parsed === 'object') {
                    setSavedConfigs(parsed);
                }
            }
            const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
            if (storedActive) {
                setActiveConfigName(storedActive);
            }
        } catch {
            // Invalid localStorage data, use defaults
        }
    }, []);

    const persistCurrent = useCallback((config: ConfigData) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(config));
            } catch {
                // localStorage full or unavailable
            }
        }, 300);
    }, []);

    const updateCurrentConfig = useCallback(
        (config: ConfigData) => {
            setCurrentConfig(config);
            setActiveConfigName(null);
            if (mounted) {
                persistCurrent(config);
                try {
                    localStorage.removeItem(STORAGE_KEY_ACTIVE);
                } catch {
                    // localStorage unavailable
                }
            }
        },
        [mounted, persistCurrent]
    );

    const saveConfig = useCallback(
        (name: string) => {
            const newSaved = { ...savedConfigs, [name]: currentConfig };
            setSavedConfigs(newSaved);
            setActiveConfigName(name);
            try {
                localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(newSaved));
                localStorage.setItem(STORAGE_KEY_ACTIVE, name);
            } catch {
                // localStorage full or unavailable
            }
        },
        [savedConfigs, currentConfig]
    );

    const loadConfig = useCallback(
        (name: string) => {
            const config = savedConfigs[name];
            if (config) {
                setCurrentConfig(config);
                setActiveConfigName(name);
                persistCurrent(config);
                try {
                    localStorage.setItem(STORAGE_KEY_ACTIVE, name);
                } catch {
                    // localStorage full or unavailable
                }
            }
        },
        [savedConfigs, persistCurrent]
    );

    const deleteConfig = useCallback(
        (name: string) => {
            const { [name]: _deleted, ...rest } = savedConfigs;
            void _deleted;
            setSavedConfigs(rest);
            const clearActive = activeConfigName === name;
            if (clearActive) setActiveConfigName(null);
            try {
                localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(rest));
                if (clearActive) localStorage.removeItem(STORAGE_KEY_ACTIVE);
            } catch {
                // localStorage full or unavailable
            }
        },
        [savedConfigs, activeConfigName]
    );

    const getConfigNames = useCallback(() => Object.keys(savedConfigs), [savedConfigs]);

    return {
        mounted,
        currentConfig,
        savedConfigs,
        activeConfigName,
        updateCurrentConfig,
        saveConfig,
        loadConfig,
        deleteConfig,
        getConfigNames,
    };
};
