export type IssueType = 'error' | 'performance' | 'user_feedback' | 'dead_click';

export interface IssueTypeConfig {
    id: IssueType;
    label: string;
    description: string;
    enabled: boolean;
}

export const ISSUE_TYPE_CONFIGS: IssueTypeConfig[] = [
    {
        id: 'error',
        label: 'Error',
        description: 'Generate error events',
        enabled: true,
    },
    {
        id: 'performance',
        label: 'Performance',
        description: 'Generate N+1 API call issues',
        enabled: true,
    },
    {
        id: 'user_feedback',
        label: 'Feedback',
        description: 'User feedback submissions',
        enabled: false,
    },
    {
        id: 'dead_click',
        label: 'Dead Click',
        description: 'Dead click detection',
        enabled: false,
    },
];

export interface PerformanceConfig {
    callCount: string;
    targetDelay: string;
    customEndpoint: string;
}

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
    callCount: '15',
    targetDelay: '50',
    customEndpoint: '',
};
