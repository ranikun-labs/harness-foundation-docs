# Distributed Consistency Policy

- Status: Draft
- Scope: Commands, events, retries, and cross-service workflows
- Canonical owner: `harness-foundation-docs`
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Term scope: This document belongs to the Backend Service Foundation (`DEC-057`), covering MSA backend services (e.g. Carelog, Finance Harness backend, Shared Identity). It is separate from the `oh-my-ai` AI harness product family's "Shared Platform" (`DEC-005`).

## 1. Purpose

This document defines consistency and failure-handling rules for the Harness MSA architecture.

It covers:

- local transaction boundaries;
- eventual consistency;
- idempotency;
- transactional outbox;
- consumer inbox or deduplication;
- retries;
- compensation;
- reconciliation;
- dead-letter handling;
- failure isolation.

## 2. Core model

A database transaction is local to one service.

```text
Identity transaction
!= Finance transaction
!= Carelog transaction
```

The platform does not assume a global ACID transaction across services.

Default model:

```text
Local ACID transaction
+ reliable event publication
+ idempotent consumer
+ eventual consistency
+ reconciliation
```

Distributed two-phase commit is prohibited by default and requires an explicit ADR if ever proposed.

## 3. Consistency classification

Every cross-service workflow must declare one of these models:

| Model | Meaning |
|---|---|
| Immediate local consistency | One service completes within one local transaction |
| Synchronous remote validation | Current request depends on bounded remote response |
| Eventual consistency | State propagates asynchronously |
| Compensating workflow | A later action reverses or neutralizes a prior local success |
| Reconciliation-driven consistency | Periodic comparison repairs drift |

Unstated consistency behavior is not acceptable for production-critical flows.

## 4. Idempotency

Any operation that may be delivered or requested more than once must be idempotent.

This includes:

- externally retried HTTP commands;
- message consumers;
- scheduled reconciliation;
- backfill;
- replay;
- webhook processing;
- migration jobs.

### 4.1 HTTP command

A command may use:

```text
Idempotency-Key
```

The service should persist enough information to distinguish:

- first request;
- duplicate with identical payload;
- duplicate with conflicting payload;
- in-progress request;
- completed request;
- expired key.

Recommended logical fields:

```text
idempotency_key
request_hash
status
response_reference or response_snapshot
created_at
expires_at
```

The concrete schema belongs in the service repository.

### 4.2 Event consumer

A consumer must assume duplicate delivery.

Typical deduplication key:

```text
consumer_name + event_id
```

Domain-level idempotency may also use:

- unique constraint;
- aggregate version;
- natural command identifier;
- upsert with expected state transition.

Deduplication storage and domain mutation should commit atomically where possible.

## 5. Transactional outbox

When a local state change requires an integration event, the domain change and outbox record must be written in the same local transaction.

```text
BEGIN
  update domain state
  insert outbox event
COMMIT
```

A separate publisher delivers the outbox event.

Requirements:

- deterministic event ID;
- publication status or lease;
- bounded retry;
- duplicate-safe publishing;
- monitoring for stale unpublished records;
- retention policy;
- replay procedure.

Directly publishing to a broker before or after an unrelated database commit is not sufficient for critical state propagation.

## 6. Consumer inbox or processed-event record

A consumer should use an inbox or processed-event mechanism when duplicate side effects are possible.

```text
receive event
→ verify contract
→ check event_id
→ apply local domain change
→ record processed event
→ commit
→ acknowledge
```

The acknowledgement must occur after durable local completion.

## 7. Retry policy

Retry is a recovery mechanism for transient failure, not a substitute for correctness.

Required characteristics:

- bounded attempts;
- exponential backoff;
- jitter;
- retry classification;
- timeout budget;
- observability;
- terminal failure route.

Do not retry permanently invalid messages indefinitely.

## 8. Dead-letter and quarantine

A repeatedly failing event should be quarantined after bounded attempts.

The owning service must define:

- failure reason;
- original event reference;
- retry count;
- last error;
- first and last failure time;
- operator action;
- replay safety;
- data correction path.

A dead-letter queue without an operational runbook is incomplete.

Detailed DLQ infrastructure belongs in the service repository when a broker is adopted.

## 9. Compensation and saga

Use a compensating workflow when a multi-service business process has already committed local steps that must be neutralized after later failure.

Example:

```text
Account created
→ Finance enrollment requested
→ Finance enrollment fails permanently
→ enrollment remains absent or a compensating account action is evaluated
```

Not every workflow requires a saga engine.

Prefer simpler designs first:

- lazy local profile creation on first authenticated access;
- explicit pending state;
- retriable command;
- reconciliation;
- manual recovery for rare administrative workflows.

An orchestration engine requires a separate decision.

## 10. Reconciliation

Critical weak references and lifecycle propagation should support periodic reconciliation.

A reconciliation process may detect:

- local profile referencing unknown identity;
- active product profile for deactivated account;
- unpublished outbox record;
- stuck processing state;
- event version gap;
- duplicate side effect;
- retention-policy drift.

Reconciliation must be:

- idempotent;
- observable;
- bounded;
- repairable;
- safe to rerun.

## 11. Failure isolation

A service must prevent downstream failure from exhausting its own resources.

Evaluate:

- timeout;
- circuit breaker;
- bulkhead;
- rate limit;
- queue capacity;
- backpressure;
- bounded concurrency;
- load shedding;
- stale or cached read policy.

Security-sensitive state must fail closed unless an explicitly reviewed policy allows degradation.

Non-critical telemetry should fail soft and must not block the primary user transaction unless evidence requirements mandate otherwise.

## 12. State modeling

Long-running or distributed operations should use explicit states rather than hidden control flow.

Example:

```text
PENDING
PROCESSING
SUCCEEDED
FAILED_RETRYABLE
FAILED_FINAL
CANCELLED
```

State transitions must define:

- allowed source state;
- allowed target state;
- command identifier;
- version or optimistic lock;
- side effect;
- retry behavior;
- compensation behavior.

## 13. Identity lifecycle baseline

Recommended target behavior:

```text
Shared Identity account state change
→ local Identity transaction
→ outbox record
→ account lifecycle event
→ product consumer
→ idempotent local profile update
```

Product services apply their own retention and deletion rules. Shared Identity does not directly delete product data.

## 14. Evidence and verification

A service implementing distributed consistency should include tests for:

- duplicate HTTP command;
- duplicate event;
- event redelivery after local commit;
- publisher failure after outbox commit;
- late out-of-order event;
- retry exhaustion;
- reconciliation rerun;
- consumer crash before acknowledgement;
- consumer crash after commit but before acknowledgement.

Concrete fixtures belong in each service repository or an integration-test repository.

## 15. Required service documents

When the relevant feature exists, each service repository should maintain:

```text
docs/architecture/consistency-model.md
docs/contracts/idempotency.md
docs/runbooks/event-reprocessing.md
docs/runbooks/consistency-reconciliation.md
```

Foundation defines the standard. The service repository defines actual states, tables, retry counts, broker configuration, and recovery commands.
