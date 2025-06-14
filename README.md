# Error Generator

This is a simple Next.js application that sends sample errors to your Sentry project.

## Getting Started

### Prerequisites

- Sentry account
- Sentry project
- Sentry auth token

### Setup

Create a `.env.local` file in the root of the project and add the following variables:

```bash
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Running the app

First, install the dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm dev
```
