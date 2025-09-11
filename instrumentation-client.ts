// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://f4b6af72d1a9ba9933dcc2e2d45ba4b1@o1.ingest.us.sentry.io/4509497897648128',

  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: 'system',
    }),
    Sentry.browserTracingIntegration(),
  ],

  tracesSampleRate: 1,

  sendDefaultPii: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
