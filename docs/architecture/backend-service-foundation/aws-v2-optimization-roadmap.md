---
title: "AWS V2 Optimization Roadmap"
status: draft
implementation_status: not_started
owner: architecture
created_at: "2026-10-12"
last_reviewed: "2026-10-12"
source_inputs:
  - docs/adr/ADR-0022-aws-v1-mvp-primary-runtime.md
  - docs/architecture/backend-service-foundation/aws-v1-mvp-deployment-plan.md
---

# AWS V2 Optimization Roadmap

> V2 items are measurement-led candidates. None is a mandatory adoption or a V1
> release dependency. Keep before/after evidence so each portfolio item shows a
> verifiable change.

The V1 comparison starts from four independent EC2 runtimes: Gateway, Platform Core, Finance,
and Carelog, plus one shared private RDS Application Database and Valkey. The first optimization
candidate is 4→2 EC2; 4→1 is a separate, higher contention candidate. Record the first seven
stable, representative days only after an explicitly Owner-approved Pilot/Go-Live starts serving
the agreed workload. Pilot data count only if the Owner confirms the same representative window.
This baseline supports V2 proposals; it is not a prerequisite for the initial Go-Live. No exact
date, traffic threshold, stability rule or Pilot duration is approved here. Expiration of seven
days is not an automatic change trigger.

## Baseline Record

Capture this baseline after V1 is serving representative traffic under an explicitly
approved Pilot or Go-Live, using a stated time window, request mix, deployment version, and traffic volume.
Record Pilot-only observations separately unless an Owner confirms they qualify for this same
baseline. Current measurements are UNKNOWN; do not invent timing or operational thresholds.

| Signal | Baseline to record | Current status |
|---|---|---|
| Monthly AWS Cost | Itemized EC2, RDS, storage, IPv4, logs, transfer, backup, and support cost | UNKNOWN |
| API latency | P50 / P95 / P99 by route and product, including error rate | UNKNOWN |
| Compute | EC2 CPU, memory / RSS per JVM, Valkey memory, throttling, restart count | UNKNOWN |
| PostgreSQL | Active / idle / maximum connections, pool wait, slow-query count, query plans, storage growth | UNKNOWN |
| Valkey | Command latency, memory, evictions, persistence duration, restart recovery | UNKNOWN |
| AI | End-to-end and model execution latency, time-to-first-SSE-event, timeout and failure rate | UNKNOWN |
| Deployment | Build-to-healthy time, rollback time, failed deployment rate | UNKNOWN |
| Recovery | Measured restore duration and observed data loss in a restore drill | UNKNOWN |

Every record includes timestamp, environment, image digest, load profile, sample
size, and dashboard/query link. Use the same test profile before and after a change.

## Candidate Experiments

### Aurora Serverless v2

- **Problem:** RDS PostgreSQL cost or capacity may not fit observed demand.
- **Baseline:** Monthly database cost, CPU / memory / IOPS, connection count, load shape, failover and restore measurements — UNKNOWN.
- **Hypothesis:** Variable capacity could reduce cost at low demand or absorb measured peaks without violating latency / recovery objectives.
- **Change:** Build a reversible staging comparison using production-like data shape; measure engine compatibility, scaling behavior, connection handling, and failover. Do not migrate production without a separate Owner decision.
- **Measurement:** Same query mix and load test; compare cost, P50/P95/P99, connection waits, errors, scaling lag, and recovery.
- **Decision:** Adopt only if measured cost or reliability gain clears the Owner's agreed threshold and restore / failover tests pass.

### Upstash Redis

- **Problem:** Self-managed Valkey operation or availability may become a measured burden.
- **Baseline:** Valkey monthly cost, command p95/p99, memory, persistence / recovery results, and required command compatibility — UNKNOWN.
- **Hypothesis:** Managed Redis protocol service may reduce operational work without breaking OAuth State, JWT Blacklist, or SCG RateLimiter behavior.
- **Change:** Run a non-production adapter / compatibility spike. Verify GETDEL, TTL, EVAL, EVALSHA, atomicity, network security, data residency, and failure semantics.
- **Measurement:** Contract suite, latency under representative load, outage behavior, recovery, and fully itemized monthly cost.
- **Decision:** Consider only after compatibility, security, and cost are reviewed; retain the Valkey baseline until a decision is recorded.

### ElastiCache Serverless for Valkey

- **Problem:** Valkey availability, scaling, or operational recovery may exceed the EC2-hosted V1 capability.
- **Baseline:** Command latency, memory, eviction, restart recovery, backup / restore evidence, availability incidents, and total cost — UNKNOWN.
- **Hypothesis:** Managed Valkey can reduce recovery burden while preserving client contract and acceptable latency.
- **Change:** Validate in a separate environment with the current compatibility suite, TLS / IAM/network design, persistence and restore tests.
- **Measurement:** Contract results, p95/p99, failure recovery, backup restore, operator effort, and current Seoul price estimate.
- **Decision:** Adopt only if observed recovery / operations improvements justify cost and all compatibility tests pass.

### SQS Target (Standard / FIFO selection remains open)

- **Owner policy direction:** SQS is the current asynchronous target direction in stacked
  [PR #37](https://github.com/ranikun-labs/harness-foundation-docs/pull/37). The ADR is in review;
  official document approval and formal supersession/effective date are unconfirmed.
- **Provisioning:** No SQS Queue/DLQ or AWS resource has been approved or created. This roadmap
  does not authorize provisioning. Queue type, use case, event rate, ordering/deduplication,
  retry/DLQ policy, and cost remain undecided.
- **Gate 1 — Dev creation approval:** Record the use case and consistency contract, review
  design, IAM and cost, and explicitly approve Dev Queue creation.
- **Gate 2 — isolated Dev validation:** Only after Gate 1, create an isolated AWS Dev Queue and
  verify the actual producer/consumer path, IAM boundary, delivery, retry and failure behavior.
- **Gate 3 — Production approval:** Review Production readiness and obtain a separate Owner
  approval before any Production resource or cutover.
- **Measurement:** Throughput, queue age, duplicate handling, ordering, retry / DLQ behavior,
  end-to-end completion latency and cost are measured only in an approved isolated Dev environment.
  No such environment has been provisioned by this PR.

### PostgreSQL PGMQ

- **Problem:** A required asynchronous workflow may benefit from database-local queue semantics.
- **Baseline:** Proven use case, transaction boundary, throughput, lock contention, database CPU / IO, and queue age — UNKNOWN.
- **Hypothesis:** In-database queueing could simplify atomic state transitions if it does not harm application queries or database recovery.
- **Change:** Prototype behind a migration and feature boundary; compare with an external broker and SQS.
- **Measurement:** Transaction contention, throughput, queue age, failure / retry behavior, DB resource impact, backup / restore, and operating cost.
- **Decision:** Adopt only when database-local semantics are needed and measured impact is acceptable.

### NATS JetStream — historical approval; no new implementation target

- ADR-0021 / DEC-070 preserves the historical JetStream architecture and Owner approval record.
- The current Owner policy direction selects SQS as the target. New NATS implementation is
  excluded from the current target; this roadmap does not reopen it as a V2 implementation candidate.
- No formal ADR-0021 supersession/effective date or final SQS ADR approval is confirmed in this
  branch. The policy documentation is being reviewed in stacked PR #37.
- No NATS Broker is provisioned. The historical approval record does not authorize a new
  implementation or AWS resource.

### ECS / Lambda

- **Problem:** Measured host contention, cross-service failure impact, scaling, or deployment limitations may justify a different placement.
- **Baseline:** Host utilization, deployment / rollback duration, incident frequency, service coupling, and monthly cost — UNKNOWN.
- **Hypothesis:** ECS or Lambda may address the measured constraint with acceptable migration and operations cost.
- **Change:** Compare one bounded service in a staging environment; define networking, secrets, database connection, observability, and rollback first.
- **Measurement:** Same load / fault profile; compare availability, latency, deployment time, operator toil, and total AWS cost.
- **Decision:** Move only if the measured benefit clears an Owner-approved threshold and data / auth contracts remain unchanged.

### Asynchronous AI Worker

- **Problem:** AI request latency, timeout, or connection occupancy may become a measured product bottleneck.
- **Baseline:** AI execution duration, time-to-first-SSE-event, request concurrency, timeout / cancellation rate, model-provider latency, and API resource use — UNKNOWN.
- **Hypothesis:** A worker queue may improve API responsiveness for a use case whose product contract permits asynchronous completion.
- **Change:** Specify user-visible state, retry / idempotency, cancellation, result retention, and SSE behavior before prototyping.
- **Measurement:** User-visible completion time, API resource use, queue age, duplicate work, failure recovery, cost, and contract tests.
- **Decision:** Add a worker only for a validated workflow; retain existing HTTP/JSON and SSE contracts unless a separate decision changes them.

### PostgreSQL Pool / Query / Cache Optimization

- **Problem:** Database latency, connection saturation, or query cost may breach measured product targets.
- **Baseline:** Active / idle connections, pool waits, per-query plans and duration, lock waits, API latency, CPU and memory — UNKNOWN.
- **Hypothesis:** Targeted pool sizing, query/index changes, or cache policy may improve latency and capacity more safely than a database migration.
- **Change:** Select one bottleneck from traces and query evidence; change one variable at a time with a rollback path.
- **Measurement:** Before / after query plan, p50/p95/p99, DB CPU / connections, error rate, cache hit rate, and cost under the same load.
- **Decision:** Keep only changes with repeatable improvement and no correctness, freshness, or service-schema ownership regression.

## Portfolio Evidence Template

For every completed optimization, append a dated entry:

| Field | Evidence |
|---|---|
| Problem / baseline window | |
| Hypothesis | |
| Change and PR | |
| Before / after image digest | |
| Load profile and sample size | |
| Before / after measurements | |
| Cost comparison and pricing date | |
| Rollback and recovery result | |
| Decision / owner | |

