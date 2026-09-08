---
title: "Shared Platform PostgreSQL를 단일 Application Database와 Schema Ownership으로 정렬한다"
adr_id: "ADR-0020"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers:
  - "owner decision supplied in G3 Cross-Schema Migration Architecture Audit"
created_at: "2026-09-08"
reviewed_at: "2026-09-08"
approved_at: "2026-09-08"
effective_from: "2026-09-08"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "PostgreSQL physical runtime은 하나의 Physical Instance와 하나의 Ranikun Labs Application Database로 수렴한다"
  - "Data Ownership과 Application Access Boundary는 PostgreSQL Schema Namespace로 분리한다"
  - "Physical PostgreSQL 공유는 Data Ownership 공유를 의미하지 않는다"
  - "Cross-service Foreign Key와 타 서비스 Database 직접 접근을 허용하지 않는다"
  - "Carelog public Schema에서 carelog Schema로의 rename은 G3 Identity Migration과 별도 sequencing으로 수행한다"
  - "G3 completion은 Live Production Identity Row의 Cutover 완료를 의미하지 않는다"
affected_docs:
  - docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
  - docs/adr/ADR-0017-shared-platform-gateway-identity-physicalization.md
  - docs/architecture/repository-service-boundaries.md
  - docs/adr/README.md
  - docs/decisions/decision-log.md
evidence_refs: []
supersedes: [ADR-0013]
superseded_by: []
superseded_scope:
  - "Carelog, Finance, Dev Cloud, AI Runtime와 Shared Services를 서로 다른 PostgreSQL Database로 표현한 target placement"
  - "shared_services_db.identity를 Shared Identity의 현재 canonical persistence namespace로 표현한 범위"
remaining_valid_scope:
  - "Target Deployment Unit 구성"
  - "Identity·Commerce·Audit의 Module·Data·Schema·Migration Ownership 분리"
  - "Cross-service FK와 OLTP Cross-service JOIN 금지"
  - "V1 Local Core 독립성"
  - "Commerce와 Audit의 현재 구현·Runtime 미승인 상태"
replacement_decision_refs:
  - DEC-069
---

# ADR-0020: Shared Platform PostgreSQL를 단일 Application Database와 Schema Ownership으로 정렬한다

> **상태 경계**
>
> ```text
> Architecture decision accepted_with_constraints
> ≠ G3 migration mechanism implemented
> ≠ Live production identity rows migrated
> ≠ G4 auth traffic cut over
> ≠ Production traffic promoted
> ```

## 1. Decision Summary

Shared Platform PostgreSQL의 Target은 하나의 Physical Instance와 하나의
Ranikun Labs Application Database다. Product와 Shared Service의 Data Ownership은
서로 다른 PostgreSQL Schema Namespace로 분리한다.

```text
PostgreSQL Physical Instance
└── Ranikun Labs application database
    ├── carelog schema
    │   └── Carelog product-owned data
    ├── identity schema
    │   └── Shared Identity-owned persistence
    ├── finance schema
    │   └── Finance-owned persistence
    └── future product/shared schemas
```

## 2. Status and Scope

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

이 ADR은 PostgreSQL physical placement, Schema Ownership, Identity Migration의
Architecture sequencing만 다룬다. Production 구현, Flyway migration, Runtime
Provisioning, Traffic Promotion은 이 ADR의 완료 결과가 아니다.

## 3. Context

### Observed

- ADR-0013 §6은 기존에 `carelog_db`, `finance_db`, `dev_cloud_db`, `ai_runtime_db`,
  `shared_services_db.identity`를 PostgreSQL target boundary로 표현했다.
- ADR-0017 / DEC-067은 PostgreSQL Physical Instance 1개와 Redis Physical Instance
  1개의 near-term topology, G3 Identity Migration, G4 Cutover sequencing을 이미
  유지하고 있다.
- 현재 Carelog Table이 `public` Schema에 존재할 수 있는 Source Reality와 Target
  `carelog` Schema는 동일한 상태가 아니다.

### Owner Decision

Owner가 확정한 현재 Target은 multiple PostgreSQL Database가 아니라 single
PostgreSQL application database 안의 Schema Namespace isolation이다. 이 결정은
ADR-0013의 기존 Data Ownership과 no cross-service DB/FK/JOIN 원칙을 유지하면서
그 §6의 physical database 표현만 부분 대체한다.

## 4. Problem Statement

현재의 Database-per-boundary 예시가 유지되면 Shared Identity의 canonical
Persistence가 별도 physical/database 경계에 있어야 한다고 오해할 수 있다. 하나의
PostgreSQL Application Database를 사용하면서도 Service별 Schema와 Write Ownership을
분리하는 현재 Target을 명시해야 한다.

## 5. Constraints

- PostgreSQL physical runtime은 하나의 Physical Instance로 수렴한다.
- Ranikun Labs Application Database는 하나이며, ownership boundary는 Schema다.
- Physical sharing은 logical ownership, write permission, ORM Entity ownership을
  합치지 않는다.
- Cross-service Foreign Key, Cross-service OLTP JOIN, 타 서비스 Table 직접 접근을
  금지한다.
- Product에서 Identity로의 연동은 Database 직접 접근이 아니라 Service Contract를
  사용한다.
- Carelog `public → carelog` Schema rename은 G3 Identity Migration과 동시에
  수행하지 않는다.

## 6. Decision

### 6.1 Schema Ownership

| Schema / Owned Data | Source of Truth Owner | Schema / Migration Owner |
|---|---|---|
| `carelog` / Carelog product data | Carelog | Carelog |
| `identity` / Shared Identity persistence | Shared Identity | Shared Identity |
| `finance` / Finance product data | Finance | Finance |
| `audit` / Shared Audit consumer-side ledger | Shared Audit | Shared Audit |
| future product/shared schemas | Respective product or shared owner | Respective owner |

Shared Identity가 소유하는 canonical persistence는 다음과 같다.

- `identity.platform_accounts`
- `identity.password_credentials`
- `identity.external_identities`
- Identity product-client registry

Carelog가 소유하는 `users`, CRM organization/role/customer Data는 Carelog Schema에
남는다. `users.account_id`는 Product-side Weak Reference로 남을 수 있지만, 이를
Cross-schema 또는 Cross-service Foreign Key로 만들지 않는다.

Shared Audit가 소유하는 `audit` Schema는
[ADR-0021](./ADR-0021-shared-audit-foundation-architecture.md) / DEC-070으로
Architecture가 승인됐으며 아직 생성되지 않았다. Shared Audit가 해당 Schema의 Table과
Migration을 소유한다.

Audit Ledger는 Append-only다. 일반 UPDATE를 허용하지 않으며, 정정은 이전 Audit
Fact를 변경하지 않고 새 Event를 Append하는 방식으로 수행한다. DELETE는 명시적
Retention Lifecycle을 통해서만 수행하고, Retention 기간 Policy가 승인되기 전까지
자동 삭제를 수행하지 않는다.

Producer의 Audit Outbox는 `audit` Schema가 아니라 Producer 자신의 Schema에 위치한다.

```text
identity.audit_outbox        Shared Identity 소유 / Shared Identity Migration
audit.<ledger tables>        Shared Audit 소유 / Shared Audit Migration
```

Producer Outbox는 Producer의 Domain Mutation과 같은 Local Transaction에 기록돼야
하므로 다른 Service Schema에 둘 수 없다. 이 배치는 Ownership Inversion을 만들지
않으며 Cross-schema Foreign Key를 요구하지 않는다.

### 6.2 Access Boundary

하나의 Application Database 안에서도 각 Service는 자기 Schema의 Table과 Migration만
소유한다. 같은 JVM, 같은 Process 또는 같은 PostgreSQL Instance에 배치되는 사실은
Module·Data·Schema·Migration Ownership 통합을 의미하지 않는다.

Product는 Identity Table을 직접 읽거나 수정하지 않고 stable account/principal
Service Contract를 소비한다. Cross-product 분석이 필요하면 API, Event, Projection,
별도 Read Model 또는 ETL 경계를 사용한다.

### 6.3 Current and Target Schema Reality

현재 Carelog Tables가 `public` Schema에 있는 경우에도 이는 Source Reality로만
기록한다. Target `carelog` Schema는 별도의 Architecture Target이다. `public →
carelog` rename과 그에 따른 Product Table migration은 Identity Migration의 일부로
자동 포함하지 않으며, 별도 sequencing과 owner decision으로 다룬다.

## 7. G3 / G4 Boundary

G3가 소유한다.

- Identity Schema Ownership와 Binding
- Single-instance consolidation mechanism
- Idempotent one-shot backfill mechanism
- Deterministic migration verification
- Migration rehearsal evidence
- Password와 OAuth continuity verification

G4가 소유한다.

- Final write freeze
- Live data에 대한 final backfill execution
- Deterministic verification
- Active authentication traffic cutover
- Cutover observation
- Routing rollback

> G3 completion does not mean that live production identity rows have already been cut over.
> G3 establishes and verifies the migration mechanism; the final data execution occurs in the
> G4 cutover window while Carelog is still the pre-cutover writer.

G3는 Migration Mechanism을 수립·검증하는 Gate이며 Live Production Identity Row의
최종 전환을 선언하지 않는다. G4는 Carelog가 Pre-cutover Writer인 동안 짧은 Write
Freeze, Final Backfill, Deterministic Verification을 수행하고 Active Auth Traffic을
전환한다.

## 8. Migration Strategy

권장 전략:

```text
single-instance schema isolation
+ idempotent one-shot backfill
+ short write freeze
+ deterministic verification
```

다음 전략은 선택하지 않는다.

- All forms of Identity Data dual-write during partial cutover are prohibited,
  including transitional or short-lived dual-write.
- CDC / Debezium
- Kafka migration pipeline
- distributed transaction
- separate migration service

이는 ADR-0017 / DEC-067의 Identity Data dual-writer 금지와 정합하다. 구현 세부 SQL,
Flyway 파일, 실행 명령은 이 ADR에 넣지 않는다.

## 9. Refresh Session Policy

Historical Refresh Session은 Identity Migration의 필수 데이터로 보지 않는다. G4의
최소 운영 선택으로 Forced Re-login을 권장할 수 있으나, 별도 Product/Runtime Policy가
확정되기 전까지 Canonical Fixed Rule로 고정하지 않는다.

## 10. Consequences and Non-goals

### Positive

- 하나의 PostgreSQL Application Database에서 physical 운영 복잡도를 줄인다.
- Schema 단위 Ownership, Migration, Access Boundary를 보존한다.
- Identity, Carelog, Finance의 Cross-service DB coupling을 차단한다.

### Operational Cost

- Schema provisioning, search path, migration ownership과 권한을 명시해야 한다.
- G3는 backfill과 verification rehearsal를 준비해야 하며, G4는 live execution과
  traffic cutover를 별도 Gate로 수행해야 한다.

### Non-goals

- 이번 결정은 Identity Migration 구현이 아니다.
- 이번 결정은 Carelog `public` Schema rename 완료가 아니다.
- 이번 결정은 G3 COMPLETE 또는 G4 promotion 선언이 아니다.
- 이번 결정은 Gateway, Finance Integration 또는 Production Runtime 변경이 아니다.

## 11. Related Records

```text
ADR-0013
ADR-0017
DEC-058
DEC-067
DEC-069
```

## 12. Partial Supersession

ADR-0013은 `remaining_valid_scope`가 존재하므로 계속
`accepted_with_constraints`로 유지한다. 이 ADR은 ADR-0013 §6의 Database placement
표현 중 multiple logical database와 `shared_services_db.identity` target 표현만
부분 대체한다. Target Deployment Unit, Module/Data/Schema/Migration Ownership,
no cross-service DB/FK/JOIN, Commerce deferral과 Audit의 현재 상태는 유지한다.

DEC-058의 기존 결정 본문과 당시 근거는 역사적 기록으로 보존하며, DEC-069이 그
PostgreSQL placement 범위의 partial supersession을 추적한다.

## 13. Verification Boundary

이 ADR의 Acceptance는 Architecture 정합성에 한정된다. 다음을 자동으로 의미하지
않는다.

```text
Identity schema created
Identity rows backfilled
Password/OAuth continuity executed
Live write freeze performed
Authentication traffic cut over
Production promoted
```
