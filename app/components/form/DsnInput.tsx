'use client';

import { motion } from 'framer-motion';
import { fadeInUp, shake } from '@/app/styles/animations';
import { ErrorForm } from '@/app/hooks/useErrorForm';

interface DsnInputProps {
    form: ErrorForm;
}

export const DsnInput = ({ form }: DsnInputProps) => (
    <motion.div variants={fadeInUp}>
        <label className="label-brutal">Sentry DSN</label>
        <motion.input
            type="text"
            placeholder="https://xxx@sentry.io/123"
            value={form.dsn}
            onChange={(e) => form.handleDsnChange(e.target.value)}
            className={`input-brutal w-full px-3 py-2 text-sm ${form.dsnError ? 'invalid' : ''}`}
            variants={form.dsnError ? shake : undefined}
            animate={form.dsnError ? 'animate' : undefined}
        />
        {form.dsnError && (
            <p className="text-hero-sunset text-xs mt-1 font-bold">{form.dsnError}</p>
        )}
    </motion.div>
);
