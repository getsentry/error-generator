'use client';

interface SkipConfirmProps {
    enabled: boolean;
    handleToggle: () => void;
}

export const SkipConfirm = ({ enabled, handleToggle }: SkipConfirmProps) => (
    <div className="flex items-center gap-2">
        <button
            onClick={handleToggle}
            className={`switch-track ${enabled ? '!bg-hero-sunset' : ''}`}
            data-checked={enabled}
        >
            <div className="switch-thumb" />
        </button>
        <span className="label-brutal !text-hero-coral !mb-0">Skip Confirm</span>
    </div>
);
