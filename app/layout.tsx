import React from 'react';
import type { Metadata } from 'next';
import '@/app/styles/globals.css';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/700.css';
import '@fontsource/rubik/900.css';

const title = 'Sentry Error Generator';
const description = 'Generate sample errors and performance issues for your Sentry project';

function getBaseUrl() {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
}

const url = getBaseUrl();

export const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL(url),
    openGraph: {
        title,
        description,
        siteName: title,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
