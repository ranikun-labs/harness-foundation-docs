---
title: "Shared Audit Foundation Architecture와 JetStream 활성화를 정의한다"
adr_id: "ADR-0021"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors:
  - claude
reviewers:
  - "independent architecture review (AU_G0_ARCHITECTURE_REVIEW_PASS)"
approvers:
  - "owner decision supplied in Shared Audit AU-G0 architecture review"
created_at: "2026-09-08"
reviewed_at: "2026-09-08"
approved_at: "2026-09-08"
effective_from: "2026-09-08"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "Shared Audit는 durable forensic/accountability fact를 기록하며 Application Logging·Metrics·Tracing을 대체하지 않는다"
  - "초기 배치는 platform-core의 shared-audit 논리 Module과 platform-core:app의 background JetStream Consumer다"
  - "별도 Audit Executable과 Microservice는 승인되지 않으며 추출은 Evidence Trigger를 요구한다"
  - "Core NATS가 아닌 NATS JetStream을 사용하고 at-least-once와 Idempotent Consumer를 전제한다"
  - "exactly-once와 Product DB Commit·NATS Publish 사이의 Distributed Atomicity를 주장하지 않는다"
  - "Product 요청 경로는 Audit PostgreSQL 영속화·Consumer 처리·Query 처리를 동기 대기하지 않는다"
  - "Transactional Outbox는 모든 Event가 아니라 Criticality가 요구하는 경우에만 적용한다"
  - "Producer Outbox는 Producer Schema가 소유하고 audit Schema는 Consumer-side Ledger만 소유한다"
  - "Audit Ledger는 Append-only이며 일반 UPDATE를 허용하지 않고 DELETE는 Retention Lifecycle로만 수행한다"
  - "Audit 발행 실패가 이미 발생한 Security·Business 결과를 변경하거나 은폐하지 않는다"
  - "이 ADR은 Architecture 승인이며 Runtime 구현·NATS 배포·Migration·Identity 계측 완료를 의미하지 않는다"
affected_docs:
  - docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
  - docs/adr/ADR-0015-platform-communication-messaging-scaling.md
  - docs/adr/ADR-0020-shared-platform-postgresql-schema-ownership.md
  - docs/architecture/repository-service-boundaries.md
  - docs/contracts/backend-service-foundation/event-envelope-contract.md
  - docs/contracts/backend-service-foundation/shared-audit-event-contract.md
  - catalog/system-catalog.yaml
  - docs/adr/README.md
  - docs/decisions/decision-log.md
evidence_refs:
  - RPL-107
  - RPL-108
  - RPL-20
  - RPL-52
  - RPL-103
  - RPL-54
  - AU_G0_ARCHITECTURE_REVIEW_PASS
  - "platform-services/main@e5e656931c570b276d0c8900254efe9067a16b34"
  - "harness-foundation-docs/main@a1ac1ce09e3a2da5f0e85f681ad05a36302a01f9"
supersedes:
  - "ADR-0013 (partial)"
superseded_by: []
superseded_scope:
  - "ADR-0013 §8의 중앙 Audit Module이 즉시 구현 대상이 아니라는 Architecture 미승인 표현"
  - "Audit를 Architecture Decision 없는 Deferred 후보로만 표현한 범위"
remaining_valid_scope:
  - "ADR-0013 §8의 Product별 Audit Event 의미·생성 시점 소유권"
  - "ADR-0013 §8의 Shared Audit 동기 호출 강제 금지"
  - "ADR-0013 §7의 Audit Event가 Product Domain Entity에 물리 FK를 걸지 않는 규칙"
  - "ADR-0015 §7.6의 JetStream 도입 원칙과 Delivery 기본값"
  - "ADR-0020의 Schema Ownership과 Cross-service FK 금지"
replacement_decision_refs:
  - DEC-070
---

# ADR-0021: Shared Audit Foundation Architecture와 JetStream 활성화를 정의한다

> **상태 경계**
>
> ```text
> Architecture decision accepted_with_constraints
> ≠ shared-audit Module 구현
> ≠ NATS/JetStream Runtime 배포
> ≠ audit Schema 생성
> ≠ Producer Outbox 구현
> ≠ Identity Audit 계측
> ≠ Retention 삭제 활성화
> ≠ Product release
> ```

## 1. Decision Summary

Shared Audit를 Ranikun Labs Platform의 durable forensic/accountability 기록 경계로
승인하고, ADR-0015 §7.6이 예고한 첫 번째 구체적 NATS JetStream Use Case로 활성화한다.

```text
Product / Domain
→ AuditPublisher
→ NATS JetStream Producer Adapter
→ NATS JetStream
→ Shared Audit Consumer
→ PostgreSQL audit schema
```

초기 배치는 `platform-core`의 `shared-audit` 논리 Module과 `platform-core:app`의
background JetStream Consumer다. 별도 Audit Executable은 승인하지 않는다.
이전 accepted platform topology ADR에 `audit`로 표시된 Deferred Module과 이 ADR이
승인한 `shared-audit` 논리 Module은 별개 Module이 아니라 동일한 Shared Audit 경계를 가리킨다.

이 결정은 Architecture 승인이며 구현·Runtime·Release 승인이 아니다.

## 2. Status and Scope

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

이 ADR은 Shared Audit의 Architecture 경계, Transport 의미, Durability 정책과
Gate Sequencing을 소유한다. 실제 Event Catalog, Contract 상세, SQL, Migration,
Broker Provisioning, Identity 계측은 후속 Gate가 소유한다.

## 3. Context

### Observed

- ADR-0013 §4와 §8은 Audit를 Shared Services Deployment Unit 내부 Module 후보로
  두고 중앙 Audit Module을 즉시 구현 대상이 아니라고 기록했다.
- ADR-0015 §7.6은 NATS를 현재 Runtime이 아니라고 기록하면서 Audit Consumer를
  JetStream 도입 후보 Use Case 중 하나로 명시했다.
- `catalog/system-catalog.yaml`의 `gate.nats-introduction`과
  `gate.audit-consumer-introduction`은 모두 `adoption_decision: not_decided`이며,
  `gate.nats-introduction`의 `adoption_triggers` 첫 항목이 `Audit Event`다.
- ADR-0018은 `platform-core`의 Target Module Tree에 `audit`를 deferred로 포함했다.
- ADR-0020은 하나의 Application Database 안에서 Schema Namespace로 Ownership을
  분리하고 `future product/shared schemas`를 예약했다.

### Owner Decision

Owner는 Shared Audit를 다수 Product가 공유하는 Audit 기반으로 승인하고, 그 첫
Transport로 NATS JetStream을 채택했다. 독립 Architecture Review는
`AU_G0_ARCHITECTURE_REVIEW_PASS`(Blocker 0, Major 0)를 반환했다.

## 4. Problem Statement

Product마다 Audit를 개별 구현하면 보존정책·접근통제·조회 경계가 분산되고, 보안
사고 시 재구성 가능한 단일 forensic 기록이 존재하지 않는다. 동시에 Audit를 Product
요청 경로의 동기 의존성으로 만들면 Audit 실패가 Business·Security 결과를 왜곡할 수
있다.

따라서 Audit는 비동기 durable 경계여야 하며, 그 durability 수준은 Event별
Criticality로 결정돼야 한다.

## 5. Constraints

- Shared Audit Ownership은 Identity Ownership이 아니다. Identity는 초기 Producer
  후보일 뿐이다.
- 같은 JVM 배치는 Module·Data·Schema·Migration Ownership 통합을 의미하지 않는다.
- Broker는 Delivery·Retry·Replay Infrastructure이며 영구 forensic Source of Truth가
  아니다.
- Audit는 Truth를 기록하며 Truth를 소급 결정하지 않는다.
- Architecture 승인은 Runtime 구현이 아니다.

## 6. Decision

### 6.1 Purpose and Non-purpose

Shared Audit는 다음 durable forensic/accountability fact를 기록한다.

```text
actor
occurred time
product / tenant
safely identifiable resource
significant action
outcome
```

Shared Audit는 다음이 아니다.

- Application Logging
- Metrics
- Tracing
- Debugging Telemetry
- Event Sourcing
- Product Business Primary Storage

Observability와 Audit는 별개 관심사로 유지한다.

향후 Producer 후보는 Shared Identity, Carelog, Finance, Shared AI, Notification,
Subscription & Payments다.

### 6.2 Runtime Placement

```text
platform-services
└── platform-core                    Spring MVC process
    ├── app                          only executable host
    │   └── background Shared Audit JetStream Consumer
    ├── identity                     ACTIVE target
    ├── shared-ai                    Phase 1 same-JVM logical module
    ├── commerce                     DEFERRED
    └── shared-audit                 architecture-approved logical module
```

별도 Audit Executable·Microservice는 초기에 승인하지 않는다. 추출은 다음 Evidence가
확인될 때만 별도 Decision으로 검토한다.

- Independent Scaling
- Material Resource Contention
- Failure/Restart Isolation
- Independent Deployment Cadence
- 별도 Security/SLA Boundary

Architectural Purity만을 근거로 Audit Microservice를 만들지 않는다.

### 6.3 Transport

NATS Core가 아닌 NATS JetStream을 사용한다.

요구 속성:

```text
durable stream
publish acknowledgement
durable consumer
explicit ACK
persistence before ACK
retry / redelivery / restart recovery
stable event_id
at-least-once delivery
duplicate delivery is normal
idempotent consumption
```

명시적으로 주장하지 않는 것:

- exactly-once delivery 또는 processing
- Product DB Commit과 NATS Publish 사이의 Distributed Atomicity

이는 ADR-0015 §7.6의 도입 원칙(at-least-once, Idempotent Consumer, `event_id`
Unique, Consumer DB Commit 후 ACK, MQ는 Business Source of Truth 아님)과 정합한다.

### 6.4 Request Path

Product 요청은 다음을 동기 대기하지 않는다.

- Shared Audit PostgreSQL 영속화
- Shared Audit Consumer 처리
- Audit Query/Index 처리

Audit 발행 실패는 이미 발생한 Security·Business 결과를 변경하지 않는다. 인증 거부를
성공으로 바꾸거나 성공한 Side Effect를 실패·Rollback으로 보고하지 않는다.

이는 ADR-0013 §8의 "Shared Audit API를 업무 Transaction 안에서 동기 호출하도록
강제하지 않는다"를 유지한다.

### 6.5 Event Time과 Persistence Time

Producer Audit Event가 소유하는 값:

```text
event_id
occurred_at
canonical audit fields
```

Producer는 `recorded_at`을 생성하지 않는다.

Persisted Audit Record가 추가하는 값:

```text
recorded_at
```

`recorded_at`은 Shared Audit Consumer/Store가 durable 영속화에 성공한 시각을
의미하는 Persistence Metadata다. Ledger가 일반 UPDATE를 허용하지 않으므로
`recorded_at`은 중복 전달 상황에서도 최초 영속화 시각으로 고정된다.

### 6.6 Foundation Event Envelope Specialization

Shared Audit는 Foundation Event Envelope와 정렬된 specialized canonical contract를
사용한다. 기계적으로 동일한 Contract가 아니다.

재사용하는 Primitive:

- `event_id`
- `event_type`
- `schema_version`
- `occurred_at`
- `producer`
- `correlation_id` (가용할 때)
- `causation_id` (가용할 때)
- at-least-once 의미
- 재전달 간 안정적 Event Identity
- Idempotent Consumer 동작

Wire Serialization은 `snake_case`다. JVM/내부 Model은 언어 관례를 사용할 수 있고
`auditEventId` 같은 이름을 노출할 수 있으나, canonical wire field는 `event_id`로
직렬화한다.

`aggregate_type`과 `aggregate_id`는 Audit/Security Event에 보편적으로 요구하지
않는다. 익명 인증 실패처럼 안전한 Resource·Account 식별자가 존재하지 않는 Event가
있기 때문이다. Generic Envelope를 만족시키기 위해 식별자를 조작하거나 역추론해서는
안 된다.

이는 ADR-0013 §7의 "Audit Event는 제품 Domain Entity에 물리 Foreign Key를 걸지 않고
opaque identifier를 저장한다"와 정합한다.

Generic Envelope 문서의 최소 정합 수정과 Shared Audit Contract 확정은 AU-G1이
소유한다.
[Shared Audit Producer Event Contract](../contracts/backend-service-foundation/shared-audit-event-contract.md)는
이 위임에 따라 Producer Wire Contract, Event Policy Registry와 Identity 초기 Catalog를
기록하며 이 ADR의 Architecture 결정을 변경하지 않는다.

### 6.7 Classification Axes

세 축은 독립이며 서로를 함의하지 않는다.

Audit Inclusion:

```text
MUST_AUDIT
SHOULD_AUDIT
OBSERVABILITY_ONLY
```

Durability / Foundation Criticality:

```text
SECURITY_CRITICAL
SECURITY_DECISION
BUSINESS_CRITICAL
INFORMATIONAL
```

Retention:

```text
SECURITY_LONG
SECURITY_SHORT
BUSINESS_LONG
INFORMATIONAL_SHORT
```

`MUST_AUDIT`는 `SECURITY_CRITICAL`을 의미하지 않고 Outbox를 의미하지 않으며
fail-closed를 의미하지 않는다.

Shared Audit의 `durability_class`는 Foundation의 `criticality` 축에 대응한다.
Foundation 용어와 Shared Audit 용어가 다를 수 있으므로 이 Mapping을 명시적으로
기록한다.

Durability Class 의미:

| Class | 의미 | Durable Publication |
|---|---|---|
| `SECURITY_CRITICAL` | Critical state mutation; commit→publish 유실 불가 | 공유 Local Transaction이 기술적으로 가능한 경우 Transactional Outbox 또는 동등 수단 필수 |
| `SECURITY_DECISION` | Security/Authentication 결정 또는 보안 유의미 Event | Bounded acknowledged publication; 기본적으로 Outbox 미요구; 발행 실패는 관측 가능해야 함 |
| `BUSINESS_CRITICAL` | Business mutation; Audit durability를 명시 분류해야 함 | Event Contract별 결정 |
| `INFORMATIONAL` | 정보성 | fail-open; Contract가 정의한 범위의 유실 허용 |

### 6.8 Per-event Policy Fields

AU-G1은 각 canonical Audit Event Type에 대해 다음을 기록한다.

```text
affected_business_invariant
audit_inclusion
durability_class / criticality
retention_class
acceptable_loss_window
duplicate_tolerance
retry_policy
replay_policy
reconciliation_policy
classification_owner
approval_reference
```

이는 `distributed-consistency-policy.md` §5.1과
`service-communication-policy.md` §5의 필수 분류 요구를 충족하기 위한 것이다.
미분류 Event는 Foundation 규칙대로 Critical로 취급한다.

전체 Event Catalog는 AU-G0의 범위가 아니다.

### 6.9 Critical Mutation Durability와 Producer-owned Outbox

Producer PostgreSQL의 `SECURITY_CRITICAL` Mutation은 Domain Mutation과 Audit Outbox
Record를 같은 Local Transaction에 기록한다.

```text
BEGIN
  domain mutation
  producer-owned audit outbox record
COMMIT

later:
  outbox publisher
  → JetStream publish
  → publish ack
  → outbox publication completion
```

모든 Audit Event에 Outbox를 강제하지 않는다. 이는 ADR-0015 §7.6의 "모든 Event에
Transactional Outbox를 강제하지 않음"과 `distributed-consistency-policy.md` §5와
정합한다.

Outbox Ownership은 Producer Ownership을 따른다.

```text
identity.audit_outbox        Producer 소유; Shared Identity가 Migration 소유
audit.<ledger tables>        Shared Audit Consumer-side Ledger 전용
```

`audit.audit_outbox`는 사용하지 않는다. Producer Outbox를 `audit` Schema에 두면
Producer가 다른 Service Schema에 Transactional Write를 수행하게 되어 ADR-0020의
Schema Ownership과 Cross-service 직접 접근 금지를 위반한다.

Ownership Inversion과 Cross-schema Foreign Key는 요구하지 않는다.

### 6.10 Replay와 Reconciliation

PostgreSQL `SECURITY_CRITICAL` Mutation에서 Producer Outbox가 primary durable
recovery/reconciliation source다.

요구 동작:

- 미발행/정체 Outbox Record 탐지
- Bounded Retry
- 명시적 Replay
- Replay 간 안정적 `event_id`와 동일한 canonical Event Identity 보존
- Retry/Replay 소진 시 Alert
- JetStream 재전달 허용
- Shared Audit 측 Idempotent 영속화

Generic Cross-product Reconciliation Platform은 승인하지 않는다.

### 6.11 Redis / External Side-effect Residual Gap

권위 있는 Side Effect가 Redis 또는 외부 System에서 발생하고 Producer PostgreSQL
Transaction을 공유할 수 없는 경우:

```text
side effect succeeds
→ bounded JetStream publish with acknowledgement
→ publication failure ⇒ metric + alert
```

Distributed Atomicity를 주장하지 않는다. 2PC, Event Sourcing, Identity Persistence
재설계를 도입하지 않는다.

권위 있는 상태를 이후 안전하게 검사할 수 있는 경우 Producer 고유의 Bounded
Reconciliation Check로 divergence를 탐지할 수 있다.

Event 발생을 안전하게 재구성할 수 없는 경우, 해당 Residual Durability Limitation을
정직하게 문서화한다. 존재하지 않는 Audit Fact를 조작해 만들지 않는다.

```text
side effect succeeds
→ process crash
→ Audit SUCCESS event may never publish
```

이 잔여 창은 알려진 한계로 수용하며, 최소한 발행 실패는 관측 가능해야 한다.

### 6.12 Duplicate와 Integrity Semantics

```text
same event_id + same canonical payload
→ idempotent duplicate
→ 새로운 논리 Audit Fact 없음
→ durable/idempotent 처리 후 ACK

same event_id + different canonical payload
→ integrity violation
→ canonical Ledger 변경 없음
→ restricted quarantine
→ alert
→ terminal handling
```

결정적 canonical payload hash/fingerprint 또는 동등 수단을 사용할 수 있다.

정확한 SQL/Index 전략은 AU-G4가 소유하며, 선택된 구현은 최소 권한 Writer Model을
보존해야 한다.

### 6.13 Poison과 Quarantine

- 발행 전 Producer 검증
- 영속화 전 Consumer 검증
- 손상된 민감 Payload를 일반 Application Log에 기록하지 않음
- 손상된 raw Payload를 canonical PostgreSQL Audit Ledger에 기록하지 않음
- Quarantine 접근 제한
- 짧고 한정된 Quarantine 보존
- Terminal Poison 처리
- 무한 재전달 금지

Quarantine이 Secret·PII Sink가 되어서는 안 된다.

### 6.14 Sensitive Data Baseline

Audit는 기본적으로 다음을 저장하지 않는다.

```text
raw password / password hash
access token / refresh token / raw JWT
Authorization header
OAuth state / authorization code
PKCE verifier / challenge
provider access token / refresh token
Client Secret
provider raw HTTP body
full callback/query
raw providerSubject
stacktrace
raw provider error body
full request/response dump
loginId
email
```

인증된 Audit Record는 opaque internal platform/account identifier로 상관관계를
표현한다. OAuth 관련 Record도 raw `providerSubject`가 아니라 내부 opaque identifier를
사용한다.

익명 인증 실패는 다음을 사용한다.

```text
actor_type = ANONYMOUS
```

익명 인증 실패에서 `loginId`·`email`·`providerSubject`로부터 Account Identity를
역추론해서는 안 된다. 향후 예외는 명시적으로 승인된 Policy를 요구한다.

### 6.15 PostgreSQL Ledger

초기 Target은 동일한 물리 Application PostgreSQL 안의 별도 논리 `audit` Schema다.

Ledger 성질:

- Append-only
- Event Sourcing 아님
- Product Business Primary Store 아님

논리 권한:

```text
audit_writer        → INSERT
audit_reader        → SELECT
audit_retention     → controlled retention DELETE
audit_schema_owner  → DDL
```

일반 UPDATE를 허용하지 않는다. 정정은 이전 Audit Fact를 변경하는 것이 아니라 새
Event를 Append하는 방식으로 수행한다. DELETE는 명시적 Retention Lifecycle을 통해서만
수행한다.

물리 Cluster 분리는 ADR-0013 §9와 ADR-0015 §7.8의 기존 Trigger를 따른다.

### 6.16 Retention

Architecture는 Retention Class만 확정한다.

```text
SECURITY_LONG
SECURITY_SHORT
BUSINESS_LONG
INFORMATIONAL_SHORT
```

구체적 보존 기간은 AU-G4의 Product/Compliance/Deployment Policy다. 해당 Policy가
명시적으로 승인되기 전까지 자동 Audit 삭제를 수행하지 않는다.

### 6.17 Read Boundary

Audit Ledger는 Public/End-user API가 아니다.

초기 Reader는 다음으로 제한한다.

- 명시적으로 인가된 ADMIN / SECURITY Human Principal
- 명시적으로 승인된 내부 Service Principal

요구사항:

- 최소 권한
- Product/Tenant Scope
- 일반 인증 사용자는 Audit Ledger 조회 권한을 갖지 않음
- Human/Admin Audit 조회 자체가 감사 대상 보안 행위
- 내부 Audit Consumer/Store 작업은 재귀적으로 자기 자신을 Audit하지 않음

상세 Query/API Contract는 AU-G6가 소유한다.

### 6.18 Resource Isolation

초기 요구:

- Bounded Consumer Concurrency
- Bounded Batch Size
- Bounded Redelivery
- Consumer Lag Metric
- DB Pool Saturation Metric
- Product Request Latency Metric

전용 Audit DataSource Pool이나 별도 Process는 AU-G0에서 요구하지 않으며, Runtime
Evidence가 의미 있는 경합을 보이거나 후속 Gate가 명시적으로 요구할 때 도입한다.

### 6.19 External Producer Authentication

AU-G9는 자체 Authentication Contract/Decision을 요구한다.

ADR-0019의 임시 `platform-identity` → Carelog Credential을 재사용하지 않는다.
ADR-0019는 단일 Endpoint-scoped 관계로 좁게 유지되며 재사용에 별도 Accepted
Decision을 요구한다.

## 7. Gate Order

```text
AU-G0  Foundation Architecture Freeze / Canonicalization
AU-G1  Canonical Contract
AU-G2  Publisher Boundary
AU-G3  JetStream Transport
AU-G4  PostgreSQL Append Store
AU-G5  Async Consumer
AU-G8  Critical Publication Durability
AU-G6  Query Boundary
AU-G7  Identity Producer Integration
AU-G9  First External Producer
```

AU-G8은 AU-G7보다 반드시 선행한다. AU-G7은 AU-G8이 durable하게 만들려는 바로 그
`SECURITY_CRITICAL` Mutation을 계측하기 때문이다. 순서를 뒤집으면 알려진
commit→publish 유실 구간을 가진 Security Audit 경로를 먼저 배포하게 된다.

Scope Seam:

- AU-G8: Outbox Mechanism, Publisher, Replay, Monitoring/Alerting. 실제 Identity
  Producer Use-case Write는 포함하지 않는다.
- AU-G7: Identity Producer 통합과 실제 Use-case Event 생성.

## 8. Overengineering Guard

구체적 Evidence와 새 Accepted Decision 없이 다음을 초기 도입하지 않는다.

```text
Kafka
Debezium / CDC
Elasticsearch
SIEM
blockchain / hash-chain
event sourcing
distributed 2PC
architectural purity만을 위한 Audit Microservice
complex rules engine
multi-region replication
```

ADR-0015 §7.7이 기록한 대로 JetStream 도입은 Kafka 전환을 자동 의미하지 않는다.

## 9. Consequences

- Shared Audit가 Architecture 승인 상태가 되며 `gate.nats-introduction`과
  `gate.audit-consumer-introduction`의 Architecture 근거가 확보된다.
- Audit Event 유실 가능 구간이 Class별로 명시되고, 알려진 Residual Gap이 은폐되지
  않는다.
- Product 요청 경로는 Audit 처리에 결합되지 않는다.
- Producer는 자기 Schema에 Outbox를 소유하므로 Schema Ownership이 보존된다.
- Foundation Event Envelope와 Shared Audit Contract 사이에 명시적 Specialization
  관계가 생기며 AU-G1의 최소 정합 수정이 필요하다.
- 성능 특성(p50/p95/p99, Throughput, Publish Latency, Producer Error Rate, Consumer
  Lag, Redelivery)은 추정하지 않고 이후 측정한다.

## 10. Follow-up Decisions

- AU-G1: Canonical Audit Contract, Event Catalog, per-event Policy Field, Generic
  Envelope 최소 정합 수정, `logout` Event 분류 재도출
- AU-G2: Publisher Boundary
- AU-G3: JetStream Subject Naming, Stream/Consumer 구성, 운영 Runbook
- AU-G4: Append Store SQL/Index, Dedup/Integrity 구현, Retention 기간 Policy
- AU-G5: Async Consumer와 Resource Bound
- AU-G8: Producer Outbox Mechanism, Publisher, Replay, Reconciliation, Alerting
- AU-G6: Query/API Contract와 Authorization
- AU-G7: Identity Producer 통합
- AU-G9: External Producer와 그 Authentication Contract

### Logout 재도출 요구

현재 구현 Baseline(`platform-services/main@e5e6569`)에서 `logout`은 다음 두 개의
권위 있는 Mutation을 포함한다.

```text
Redis access-token blacklist mutation
PostgreSQL refresh/session deletion
```

따라서 AU-G0은 `logout`을 단일 단순 `SECURITY_DECISION`으로 확정하지 않는다. AU-G1은
실제 dual-store Mutation에 대해 분류, Loss Window, Replay/Reconciliation과 논리 Audit
Fact 분해 여부를 재도출한다.

## 11. Validation

- Architecture 승인과 Runtime 구현 상태가 분리돼야 한다.
- NATS·JetStream·audit Schema·Consumer·Outbox를 현재 지원으로 표현하지 않아야 한다.
- exactly-once와 Distributed Atomicity 표현이 없어야 한다.
- Producer Outbox가 `audit` Schema 소유로 표현되지 않아야 한다.
- 익명 Event에 대해 조작된 Aggregate Identity를 요구하지 않아야 한다.
- Shared Identity를 재개방하거나 재설계하지 않아야 한다.
- 실제 Secret, Host, IP 또는 운영 Credential이 없어야 한다.
