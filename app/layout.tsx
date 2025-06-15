import React from 'react';
import { Providers } from './providers';

export const metadata = {
    title: 'Sentry Error Generator',
    description: 'Send sample errors to your Sentry project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
