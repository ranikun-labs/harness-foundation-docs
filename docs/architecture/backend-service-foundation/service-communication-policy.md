# Service Communication Policy

- Status: Draft
- Scope: Communication between Harness microservices
- Canonical owner: `harness-foundation-docs`
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Term scope: This document belongs to the Backend Service Foundation (`DEC-059`), covering MSA backend services (e.g. Carelog, Finance Harness backend, Shared Identity). It is separate from the `oh-my-ai` AI harness product family's Runtime Adapters and "Shared Platform" (`DEC-005`).

## 1. Purpose

This document defines when services use synchronous APIs, asynchronous events, or locally validated tokens.

The goal is to minimize temporal coupling while preserving clear ownership and operational recoverability.

## 2. Communication principles

1. A service communicates through explicit contracts, never another service's database.
2. Synchronous communication is reserved for an immediate answer required by the current request.
3. Asynchronous communication is preferred for state-change propagation and independent follow-up work.
4. Authentication tokens should be locally validated by product services where possible.
5. Network calls are assumed to fail, timeout, duplicate, or return partial information.
6. Every cross-service contract must define timeout, retry, idempotency, observability, and compatibility behavior.
7. A caller must not retry a non-idempotent operation unless the operation supports an idempotency key.

## 3. Communication modes

## 3.1 Locally validated signed token

Use a signed access token when a product service needs to authenticate the current principal without calling Shared Identity on every request.

Example:

```text
Client
→ Shared Identity login
→ Access token issued
→ Finance API
→ Finance validates signature and claims locally
```

Benefits:

- Identity outage does not immediately block all authenticated product requests;
- lower latency;
- reduced cascading failure;
- reduced Identity load.

Local validation does not replace lifecycle propagation or short token expiry.

## 3.2 Synchronous API

Use a synchronous API when:

- the caller cannot complete the current user request without the result;
- the result must reflect current state;
- the operation is an explicit command owned by the target service;
- a bounded timeout and deterministic failure response are acceptable.

Typical examples:

- login and token refresh;
- OAuth callback handling;
- explicit account-linking command;
- current account-status query for a sensitive operation;
- administrator-triggered account command.

Avoid synchronous calls for:

- routine identity lookup on every product request;
- bulk fan-out;
- analytics;
- audit logging;
- non-critical notifications;
- lifecycle propagation that may complete eventually.

## 3.3 Asynchronous event

Use an event when:

- a service publishes a fact that has already occurred;
- consumers can react independently;
- temporary delay is acceptable;
- multiple consumers may exist;
- replay or recovery is required.

Examples:

```text
identity.account.created
identity.account.deactivated
identity.external-identity.linked
finance.journal.created
finance.analysis.completed
```

An event must describe a fact, not a remote imperative disguised as an event.

Preferred:

```text
AccountDeactivated
```

Avoid:

```text
DisableFinanceUserNow
```

A command may be asynchronous, but it requires a separate command contract and ownership model.

## 4. Synchronous API requirements

Every cross-service API must define:

- owner and consumer;
- request and response schema;
- authentication and authorization;
- timeout;
- retry eligibility;
- idempotency behavior;
- error contract;
- rate limit;
- observability fields;
- compatibility and deprecation policy.

### 4.1 Timeout

No cross-service call may use an unbounded timeout.

The concrete value belongs in the consuming service repository and must reflect:

- user-facing latency budget;
- downstream SLO;
- retry count;
- connection and read phases;
- fallback behavior.

### 4.2 Retry

Retry only transient failures such as:

- connection reset;
- temporary DNS or network failure;
- timeout where idempotency is guaranteed;
- HTTP 502, 503, or 504;
- explicitly retryable rate-limit response.

Do not retry:

- validation failure;
- authentication or authorization failure;
- policy rejection;
- permanent conflict;
- unsupported contract version.

Use bounded exponential backoff with jitter.

### 4.3 Circuit breaker and bulkhead

A consumer should evaluate:

- circuit breaker for repeatedly failing dependencies;
- concurrency bulkhead;
- connection-pool isolation;
- rate limiting;
- graceful degradation.

A fallback must not silently invent security-sensitive state.

### 4.4 Service authentication

Service-to-service calls must identify the calling service.

The concrete mechanism may be:

- service-issued token;
- workload identity;
- mutual TLS;
- API gateway identity propagation.

The mechanism must be defined by deployment architecture before production release.

A user token and a service identity are separate concerns.

## 5. Asynchronous event requirements

An event producer must:

- write through a transactional outbox when the event corresponds to a database state change;
- use the common event envelope;
- assign an immutable event ID;
- version the schema;
- avoid unnecessary sensitive data;
- define partitioning or ordering key;
- document retention and replay semantics.

An event consumer must:

- assume at-least-once delivery;
- process idempotently;
- record deduplication where needed;
- acknowledge only after durable local completion;
- define retry and dead-letter behavior;
- tolerate compatible schema additions;
- preserve correlation and causation identifiers.

## 6. Ordering

Global event ordering is not assumed.

Ordering may be required per aggregate.

Recommended key:

```text
aggregate_id
```

When state replacement depends on order, the event should include:

```text
aggregate_version
```

A consumer that has already processed version 4 should not overwrite state with a late version 3 event.

## 7. Observability

Cross-service communication must propagate where available:

- `correlation_id`;
- `causation_id`;
- trace context;
- caller service;
- contract or schema version.

Metrics should distinguish:

- success;
- timeout;
- retry;
- circuit open;
- permanent rejection;
- consumer failure;
- dead-letter routing;
- processing latency.

Logs must not contain raw credentials or full tokens.

## 8. Contract ownership

Foundation owns:

- communication selection principles;
- common event envelope;
- common token contract;
- common idempotency rules.

The publishing or serving service repository owns:

- concrete API path;
- payload schema;
- event payload;
- topic or subject;
- timeout and retry values;
- consumer-specific fallback;
- runbook.

## 9. Current application

### Shared Identity → Product services

```text
Authentication
→ signed access token, locally validated

Account lifecycle
→ asynchronous event

Sensitive current account check
→ bounded synchronous API when required
```

### Finance and Carelog

Finance and Carelog must not communicate by reading each other's databases.

A direct service relationship should be introduced only after ownership and contract review.

## 10. Required service documents

When communication exists, each service repository must maintain:

```text
docs/contracts/public-api.md
docs/contracts/published-events.md
docs/contracts/consumed-events.md
docs/architecture/dependency-map.md
```

Only create documents for contracts that actually exist. Empty speculative endpoint catalogs are not required.
