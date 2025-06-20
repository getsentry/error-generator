// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://f4b6af72d1a9ba9933dcc2e2d45ba4b1@o1.ingest.us.sentry.io/4509497897648128',

  tracesSampleRate: 1,
  sendDefaultPii: true,
  
  environment: process.env.NODE_ENV,
  
  debug: false,
});
