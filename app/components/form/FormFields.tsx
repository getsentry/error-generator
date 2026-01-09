'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/styles/animations';
import { ErrorForm, Priority } from '@/app/hooks/useErrorForm';

interface FormFieldsProps {
    form: ErrorForm;
}

export const FormFields = ({ form }: FormFieldsProps) => {
    const { priority, message, fingerprintID, errorCount, errorsToGenerate, setField } = form;

    return (
        <>
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
                <div>
                    <label className="label-brutal">Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setField('priority', e.target.value as Priority)}
                        className="select-brutal w-full px-3 py-2 text-sm"
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="label-brutal">Custom Message</label>
                    <input
                        type="text"
                        placeholder="Optional error message"
                        value={message}
                        onChange={(e) => setField('message', e.target.value)}
                        className="input-brutal w-full px-3 py-2 text-sm"
                    />
                </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
                <div>
                    <label className="label-brutal">Fingerprint</label>
                    <input
                        type="text"
                        placeholder="Optional"
                        value={fingerprintID}
                        onChange={(e) => setField('fingerprintID', e.target.value)}
                        className="input-brutal w-full px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="label-brutal">Events/Error</label>
                    <input
                        type="number"
                        min={1}
                        value={errorCount}
                        onChange={(e) => setField('errorCount', e.target.value)}
                        className="input-brutal w-full px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="label-brutal"># Errors</label>
                    <input
                        type="number"
                        min={1}
                        value={errorsToGenerate}
                        onChange={(e) => setField('errorsToGenerate', e.target.value)}
                        disabled={!!fingerprintID}
                        className={`input-brutal w-full px-3 py-2 text-sm ${fingerprintID ? 'opacity-50' : ''}`}
                    />
                </div>
            </motion.div>
        </>
    );
};
