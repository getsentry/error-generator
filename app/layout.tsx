import React from 'react';
import '@/app/styles/globals.css';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/700.css';
import '@fontsource/rubik/900.css';

export const metadata = {
    title: 'Sentry Error Generator',
    description: 'Send sample errors to your Sentry project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
