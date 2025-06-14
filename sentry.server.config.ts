// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://f4b6af72d1a9ba9933dcc2e2d45ba4b1@o1.ingest.us.sentry.io/4509497897648128',


  tracesSampleRate: 1,
  sendDefaultPii: true,
  
  environment: process.env.NODE_ENV,

  debug: false,
});
