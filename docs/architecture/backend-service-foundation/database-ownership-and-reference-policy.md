# Database Ownership and Reference Policy

- Status: Draft
- Scope: All Harness MSA repositories
- Canonical owner: `harness-foundation-docs`
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Term scope: This document belongs to the Backend Service Foundation (`DEC-059`), covering MSA backend service repositories (e.g. Carelog, Finance Harness backend, Shared Identity). It is separate from the `oh-my-ai` AI harness product family's "Shared Platform" (`DEC-005`).

## 1. Purpose

This document defines database ownership, foreign-key usage, cross-service references, and exceptions for event, audit, log, and time-series data.

It establishes the platform default:

```text
Cross-service relationship
→ weak reference

Same-service core business relationship
→ strong foreign key by default

Append-only, audit, event, log, or time-series relationship
→ evaluate weak reference and independent lifecycle
```

## 2. Database ownership

Each microservice owns:

- its database or isolated schema;
- its tables and migrations;
- its write model;
- its indexes and constraints;
- its retention and deletion policy;
- its backup and recovery procedure.

Only the owning service may write its data.

Other services must not:

- connect directly to the database;
- reuse the owning service's repository classes;
- join the owning service's tables;
- run migrations against the owning service's schema;
- create cross-database foreign keys.

## 3. Cross-service references

A cross-service identifier is a logical reference, not a relational foreign key.

Example:

```text
Identity DB
platform_account.id = account-123

Finance DB
finance_profile.identity_user_id = account-123
```

`finance_profile.identity_user_id` must not declare a physical foreign key to the Identity database.

### 3.1 Required properties

A cross-service identifier should be:

- stable;
- immutable;
- globally or contextually unique;
- non-semantic;
- safe to persist after the source entity becomes inactive;
- version-independent.

Email, phone number, provider subject, display name, and mutable business keys are not canonical cross-service identifiers.

### 3.2 Integrity mechanisms

Because a database foreign key is unavailable, integrity must be supported through:

- validation at command boundaries;
- locally stored status where necessary;
- unique constraints;
- idempotent provisioning;
- lifecycle events;
- reconciliation jobs;
- operational repair procedures;
- explicit orphan-handling policy.

## 4. Same-service foreign keys

A physical foreign key is the default when all conditions hold:

1. Parent and child belong to the same service.
2. The same service owns both tables.
3. They share a compatible transaction and lifecycle.
4. Parent deletion semantics are explicit.
5. The foreign key does not conflict with validated partitioning or high-volume ingestion requirements.

Benefits include:

- prevention of orphan records;
- simpler application code;
- safer migrations;
- clearer ownership;
- database-enforced invariants;
- easier operational diagnosis.

MSA does not imply removing all foreign keys inside each service.

## 5. Exceptions inside one service

A weak reference may be preferable inside one service for:

- append-only audit records;
- event stores or integration event history;
- LLM execution logs;
- access logs;
- policy decision logs;
- high-volume observations;
- partitioned or hypertable data;
- independently retained evidence;
- external system identifiers;
- bulk-import staging data;
- data whose parent may be deleted earlier than its evidence.

The exception must be justified by lifecycle, partitioning, ingestion, retention, or operational requirements. Convenience alone is insufficient.

## 6. Aggregate and transaction boundary

A strong foreign key does not automatically mean two entities belong to one aggregate.

Conversely, an aggregate invariant may require more than a foreign key.

Each bounded-context design must separately define:

- aggregate root;
- invariant enforcement;
- transaction boundary;
- concurrency policy;
- deletion behavior;
- snapshot or historical-reference requirements.

## 7. Delete and retention rules

A service must not cascade deletion into another service.

Example:

```text
Shared Identity account deactivated
→ AccountDeactivated event
→ Finance marks local profile inactive
→ Finance applies its own retention policy
```

The Identity service must not delete Finance or Carelog rows directly.

For historical records, prefer:

- immutable identifier snapshots;
- display-value snapshots where auditability requires them;
- soft deletion or status transitions;
- service-owned retention workflows.

## 8. Event, audit, log, and time-series data

### 8.1 PostgreSQL partitioning candidate

PostgreSQL range partitioning should be evaluated when:

- data is large and time-ordered;
- retention uses time-based bulk deletion;
- most queries include a time range;
- partition drop is operationally preferable to row deletion;
- standard PostgreSQL features are sufficient.

### 8.2 TimescaleDB hypertable candidate

TimescaleDB should be evaluated when:

- high-frequency time-series ingestion is central;
- time-bucket aggregation is a core access pattern;
- retention automation is required;
- continuous aggregates provide material value;
- time-series query and operational benefits justify the extension.

A timestamp column alone is not sufficient reason to adopt TimescaleDB.

### 8.3 Foreign keys with partitioned or hypertable data

Before applying a foreign key, verify:

- extension and PostgreSQL version support;
- partition-key requirements;
- insert throughput impact;
- retention and chunk-drop behavior;
- lock and migration behavior;
- whether historical evidence must outlive the referenced business entity.

## 9. Decision matrix

| Relationship | Default |
|---|---|
| Identity account → Finance profile | Weak cross-service reference |
| Identity account → Carelog manager | Weak cross-service reference |
| Finance profile → Journal | Strong FK |
| Journal → Review | Strong FK unless independent snapshot lifecycle is selected |
| Analysis request → Analysis run | Strong FK |
| Domain entity → Audit event | Weak reference candidate |
| Domain entity → LLM execution log | Weak reference candidate |
| Service entity → External provider object | Weak reference |
| Outbox record → Domain aggregate | Usually weak identifier plus same local transaction |
| High-volume observation → Current state entity | Weak reference candidate |

## 10. Prohibited patterns

- cross-service foreign key;
- another service's database credentials in application configuration;
- direct cross-service SQL;
- shared mutable table owned by multiple services;
- email or login ID used as permanent relational identity;
- cascade delete across service boundaries;
- removal of all same-service foreign keys without documented operational reason.

## 11. Service-repository obligations

Each MSA repository must document:

```text
docs/data/persistence-model.md
```

It should identify:

- owned tables;
- aggregate and transaction boundaries;
- strong foreign keys;
- weak references;
- indexes and unique constraints;
- deletion policy;
- retention policy;
- partition or hypertable candidates;
- migration compatibility requirements.

High-volume services should additionally maintain:

```text
docs/data/partitioning-retention.md
```

Concrete DDL belongs in the service repository, not Foundation.
