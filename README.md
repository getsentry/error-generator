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

## API Documentation

### Generate Errors Endpoint

Generate test errors and send them to your Sentry project.

**Endpoint:** `POST /api/generate-errors`

#### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `dsn` | string | Yes | - | Your Sentry project DSN (e.g., `https://public_key@host/project_id`) |
| `errorCount` | number | No | 1 | Number of events to generate per error |
| `errorsToGenerate` | number | No | 1 | Number of different errors to generate |
| `fingerprintID` | string | No | - | Custom fingerprint ID. If provided, only 1 error will be generated with this fingerprint |
| `priority` | string | No | 'HIGH' | Error priority level (`HIGH`, `MEDIUM`, `LOW`) |
| `message` | string | No | - | Custom error message. If not provided, uses default format with event ID and priority |
| `tags` | object | No | {} | Custom tags to attach to the errors |

#### Priority Mapping

- `HIGH` → Sentry level: `fatal`
- `MEDIUM` → Sentry level: `warning`
- `LOW` → Sentry level: `info`

#### Response Format

```json
{
  "success": true,
  "message": "Generated 2 errors with 3 events each (Priority: HIGH)",
  "results": [
    {
      "event_id": "12345678-1234-1234-1234-123456789012",
      "status": "sent"
    },
    {
      "event_id": "87654321-4321-4321-4321-210987654321",
      "status": "failed",
      "error": "Network error"
    }
  ]
}
```

#### Example Requests

##### Basic Error Generation

Generate a single error with default settings:

```bash
curl -X POST https://error-generator.sentry.dev/api/generate-errors \
  -H "Content-Type: application/json" \
  -d '{
    "dsn": "https://your-public-key@your-host.ingest.sentry.io/your-project-id"
  }'
```

##### Multiple Errors with Custom Settings

Generate 3 different errors, each with 2 events, with high priority:

```bash
curl -X POST https://error-generator.sentry.dev/api/generate-errors \
  -H "Content-Type: application/json" \
  -d '{
    "dsn": "https://your-public-key@your-host.ingest.sentry.io/your-project-id",
    "errorsToGenerate": 3,
    "errorCount": 2,
    "priority": "HIGH"
  }'
```

##### Error with Custom Tags

Generate an error with custom tags and medium priority:

```bash
curl -X POST https://error-generator.sentry.dev/api/generate-errors \
  -H "Content-Type: application/json" \
  -d '{
    "dsn": "https://your-public-key@your-host.ingest.sentry.io/your-project-id",
    "priority": "MEDIUM",
    "tags": {
      "team": "frontend",
      "feature": "user-authentication",
      "environment": "staging"
    }
  }'
```

##### Error with Custom Message

Generate an error with a custom message:

```bash
curl -X POST https://error-generator.sentry.dev/api/generate-errors \
  -H "Content-Type: application/json" \
  -d '{
    "dsn": "https://your-public-key@your-host.ingest.sentry.io/your-project-id",
    "message": "Payment processing failed for user transaction",
    "priority": "HIGH",
    "tags": {
      "service": "payment-gateway",
      "user_id": "12345"
    }
  }'
```

##### Error with Custom Fingerprint

Generate an error with a specific fingerprint for grouping:

```bash
curl -X POST https://error-generator.sentry.dev/api/generate-errors \
  -H "Content-Type: application/json" \
  -d '{
    "dsn": "https://your-public-key@your-host.ingest.sentry.io/your-project-id",
    "fingerprintID": "custom-error-group-123",
    "errorCount": 5,
    "priority": "LOW"
  }'
```

#### Error Responses

If the request fails, you'll receive an error response:

```json
{
  "error": "DSN is required"
}
```

Common error scenarios:

- **400 Bad Request**: Missing or invalid DSN format

#### Notes

- Custom tags will override default tags (including environment)
- When using `fingerprintID`, only 1 error will be generated regardless of `errorsToGenerate` value
- Custom message, if provided, will replace the default message format
- All errors are automatically tagged with `generated_by: 'error-generator.sentry.dev'`
