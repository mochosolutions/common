# @mocho/common

Shared contracts and utilities for Mocho apps — errors, middlewares, events, HTTP/infra utils,
and cross-cutting ports (`LoggerPort`). Framework-light; import what you need.

## Install

```bash
npm install @mocho/common
```

Everything is exported from the package root:

```ts
import { NotFoundError, LoggerPort, DomainEvent } from '@mocho/common';
```

## What's exported

### Errors (`src/errors`)
Typed error classes extending `CustomError` (each carries `statusCode` + `serializeErrors()`):
`CustomError`, `BadRequestError`, `NotFoundError`, `NotAuthorizedError`,
`DatabaseConnectionError`, `RequestValidationError`.

```ts
import { BadRequestError } from '@mocho/common';
if (!title) throw new BadRequestError('title is required');
```

### Middlewares (`src/middlewares`)
Express middlewares: `currentUser`, `requireAuth`, `validateRequest`, `errorHandler`
(mount `errorHandler` last).

### Events (`src/events`)
- **Contracts:** `DomainEvent`, `SystemEvent`, `BaseDomainEvent`, `isDomainEvent`,
  `EventHandler`, `EventDispatcherPort` — the tenant-scoped domain-event taxonomy (each concrete
  event declares its own payload shape; there is no generic `payload` field by design).
- **RabbitMQ transport:** `RabbitMQWrapper`, `Publisher`, `Listener`, `subjects`, `RateLimiter`,
  and the `Event`/`Job*Event` base types.

```ts
import type { DomainEvent } from '@mocho/common';
const handle = (e: DomainEvent) => { /* e.type, e.organizationId, ... */ };
```

### Ports (`src/logging`)
- `LoggerPort` — injected logger interface (`info`/`warn`/`error`). Consumers depend on this,
  never on a concrete logger or `console.*`.

### Utilities (`src/utils`)
`redisClient`, `s3-helpers`, `squareCatalogHelper`, `makeRequestsInBatches`, `jsonFileHelpers`.

## Consuming it in a Mocho app

Apps currently consume `@mocho/common` from the npm registry (versioned dep). During local
development against unpublished changes, use a `file:` link (`"@mocho/common": "file:../../mocho-common"`)
+ `npm install`, then revert to the versioned dep before shipping.

## Contributing / releasing

`npm run build` (tsc → `build/`), then `npm run pub` to publish. Bump the version and update
consumers' deps when the public surface changes. Keep this README's export list in sync with
`src/index.ts`.
