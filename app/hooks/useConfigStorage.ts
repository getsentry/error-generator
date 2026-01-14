import { useState, useEffect, useCallback, useRef } from 'react';
import { IssueType, PerformanceConfig, DEFAULT_PERFORMANCE_CONFIG } from '@/app/types/issueTypes';

export interface ConfigData {
    issueType: IssueType;
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
    performance: PerformanceConfig;
}

interface SavedConfigs {
    [name: string]: ConfigData;
}

const STORAGE_KEY_CURRENT = 'error-generator:current';
const STORAGE_KEY_SAVED = 'error-generator:saved';
const STORAGE_KEY_ACTIVE = 'error-generator:active';

const safeGetItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSetItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // localStorage full or unavailable
    }
};

const safeRemoveItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
        // localStorage unavailable
    }
};

const defaultConfig: ConfigData = {
    issueType: 'error',
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
    performance: { ...DEFAULT_PERFORMANCE_CONFIG },
};

const isValidConfig = (data: unknown): data is ConfigData => {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    const baseValid =
        typeof d.dsn === 'string' &&
        typeof d.message === 'string' &&
        ['HIGH', 'MEDIUM', 'LOW'].includes(d.priority as string) &&
        Array.isArray(d.tags) &&
        typeof d.errorCount === 'string' &&
        typeof d.errorsToGenerate === 'string' &&
        typeof d.fingerprintID === 'string' &&
        d.batch !== null &&
        typeof d.batch === 'object';

    if (!baseValid) return false;

    // issueType and performance are optional for backwards compatibility
    if (
        d.issueType !== undefined &&
        !['error', 'performance', 'user_feedback', 'dead_click'].includes(d.issueType as string)
    ) {
        return false;
    }

    return true;
};

// Migrate old configs that don't have new fields
const migrateConfig = (config: Partial<ConfigData>): ConfigData => ({
    ...defaultConfig,
    ...config,
    issueType: config.issueType || 'error',
    performance: config.performance || { ...DEFAULT_PERFORMANCE_CONFIG },
});

export const useConfigStorage = () => {
    const [mounted, setMounted] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<ConfigData>(defaultConfig);
    const [savedConfigs, setSavedConfigs] = useState<SavedConfigs>({});
    const [activeConfigName, setActiveConfigName] = useState<string | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        const storedCurrent = safeGetItem(STORAGE_KEY_CURRENT);
        if (storedCurrent) {
            try {
                const parsed = JSON.parse(storedCurrent);
                if (isValidConfig(parsed)) setCurrentConfig(migrateConfig(parsed));
            } catch {
                // Invalid JSON
            }
        }
        const storedSaved = safeGetItem(STORAGE_KEY_SAVED);
        if (storedSaved) {
            try {
                const parsed = JSON.parse(storedSaved);
                if (parsed && typeof parsed === 'object') {
                    const migratedConfigs: SavedConfigs = {};
                    for (const [name, config] of Object.entries(parsed)) {
                        if (isValidConfig(config)) {
                            migratedConfigs[name] = migrateConfig(config as ConfigData);
                        }
                    }
                    setSavedConfigs(migratedConfigs);
                }
            } catch {
                // Invalid JSON
            }
        }
        const storedActive = safeGetItem(STORAGE_KEY_ACTIVE);
        if (storedActive) setActiveConfigName(storedActive);
    }, []);

    const persistCurrent = useCallback((config: ConfigData) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            safeSetItem(STORAGE_KEY_CURRENT, JSON.stringify(config));
        }, 300);
    }, []);

    const updateCurrentConfig = useCallback(
        (config: ConfigData) => {
            setCurrentConfig(config);
            setActiveConfigName(null);
            if (mounted) {
                persistCurrent(config);
                safeRemoveItem(STORAGE_KEY_ACTIVE);
            }
        },
        [mounted, persistCurrent]
    );

    const saveConfig = useCallback(
        (name: string) => {
            const newSaved = { ...savedConfigs, [name]: currentConfig };
            setSavedConfigs(newSaved);
            setActiveConfigName(name);
            safeSetItem(STORAGE_KEY_SAVED, JSON.stringify(newSaved));
            safeSetItem(STORAGE_KEY_ACTIVE, name);
        },
        [savedConfigs, currentConfig]
    );

    const loadConfig = useCallback(
        (name: string) => {
            const config = savedConfigs[name];
            if (config) {
                const migrated = migrateConfig(config);
                setCurrentConfig(migrated);
                setActiveConfigName(name);
                persistCurrent(migrated);
                safeSetItem(STORAGE_KEY_ACTIVE, name);
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
            safeSetItem(STORAGE_KEY_SAVED, JSON.stringify(rest));
            if (clearActive) safeRemoveItem(STORAGE_KEY_ACTIVE);
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
