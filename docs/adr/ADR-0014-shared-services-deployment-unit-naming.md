---
title: "Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다"
adr_id: "ADR-0014"
document_status: accepted
decision_status: accepted
decision_scope: architecture / terminology / target-deployment-naming
owner: architecture
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-07-26"
reviewed_at: "2026-07-26"
approved_at: null
effective_from: "2026-07-26"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "DEC-005 Shared Platform의 Domain-neutral Contract / Shared Core 의미를 변경하지 않는다"
  - "Shared Identity와 Shared Commerce의 독립 논리 경계를 통합하지 않는다"
  - "실제 Server·Repository·Database·Deployment를 승인하지 않는다"
affected_docs:
  - docs/decisions/decision-log.md
  - docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
  - docs/adr/README.md
  - docs/architecture/repository-service-boundaries.md
  - docs/architecture/backend-service-foundation/README.md
  - docs/master/product-architecture-master.md
  - docs/product/finance-harness-report.md
  - docs/roadmap/product-roadmap.md
evidence_refs:
  - "DEC-005"
  - "DEC-057"
  - "DEC-058"
  - "DEC-059"
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs:
  - "DEC-060"
---

# ADR-0014: Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다

## 1. Decision Summary

`Shared Services Deployment Unit`을 Shared Identity, Shared Commerce, Audit Module을 향후 하나의 물리 배포 단위에 함께 배치할 수 있는 Target Architecture상의 후보로 사용한다.

이 ADR은 ADR-0013과 DEC-058의 `Shared Platform Server` 및 그 물리 그룹 파생 명칭만 부분 대체한다. Target Deployment Unit의 구성, Module·Schema·Migration 소유권 분리, PostgreSQL 목표 배치 원칙, Cross-service FK·OLTP JOIN 금지와 V1 Local Core 독립성은 계속 유효하다.

## 2. Status

```text
document_status: accepted
decision_status: accepted
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

Decision Accepted는 실제 구현·Runtime 지원·Product Release를 의미하지 않는다.

## 3. Scope

### Scope In

- Target Deployment Unit의 물리 배포 후보 명칭
- ADR-0013과 DEC-058의 물리 그룹 파생 표현
- 문서 내 canonical 용어와 참조 정합성

### Scope Out

- DEC-005 Shared Platform의 Domain-neutral Contract / Shared Core 경계
- DEC-057의 Shared Identity·Shared Commerce 독립 논리 경계
- 실제 Server·Repository·Database·Deployment의 생성 또는 승인
- Carelog Auth Phase A와 Backend Service Foundation의 Draft 상태

## 4. Context and Decision

DEC-005의 `Shared Platform`은 oh-my-ai 제품군의 Domain-neutral Contract / Shared Core 논리 경계다. 반면 ADR-0013과 DEC-058의 `Shared Platform Server`는 물리 배포 후보를 가리켜 같은 표현이 서로 다른 경계를 뜻했다.

따라서 다음 치환 규칙을 채택한다.

```text
Shared Platform Server
→ Shared Services Deployment Unit

Shared Platform Module (물리 그룹 의미)
→ Shared Services Deployment Unit 내부 Module

Shared Platform Audit Module (물리 그룹 의미)
→ Shared Services Audit Module
  또는 Shared Services Deployment Unit의 Audit Module

shared_platform_db
→ shared_services_db
```

`shared_services_db`는 Target Architecture에서의 예시명일 뿐이며, 실제 Database 이름을 확정하거나 Database Provisioning을 승인하지 않는다.

```text
Shared Services Deployment Unit
├── Shared Identity Module
├── Shared Commerce Module
└── Shared Services Audit Module
```

같은 Deployment Unit에 배치하더라도 Code Ownership, Data Ownership, Schema Ownership, Migration Ownership은 분리한다. Cross-service FK와 OLTP Cross-service JOIN은 금지한다.

## 5. Partial Supersession

### Superseded Scope

- ADR-0013의 `Shared Platform Server` 명칭 범위
- ADR-0013에서 그 명칭으로 파생된 물리 그룹과 Database 예시 표현

### Remaining Valid Scope of ADR-0013 / DEC-058

- Target Deployment Unit 구성
- Identity·Commerce·Audit의 독립 Module 경계
- Data / Schema / Migration Ownership 분리
- PostgreSQL 목표 배치 원칙
- Cross-service FK / OLTP Cross-service JOIN 금지
- V1 Local Core 독립성
- 실제 물리 구현 미승인 상태

## 6. Rationale and Consequences

물리 배포 후보의 이름을 `Shared Platform` 논리 경계와 분리하면 DEC-005의 canonical 의미를 보존하면서도 Deployment 의미를 모호하지 않게 기록할 수 있다.

- Positive: 논리 Contract 경계와 물리 배포 후보가 문서 검색과 구현 검토에서 구분된다.
- Negative: 기존 참조가 새 명칭으로 전환되어야 하며, 역사적 Decision 인용은 replacement reference와 함께 보존해야 한다.
- Risk: 새 이름을 실제 Server·Repository·Database 확정으로 오해할 수 있다. 이 ADR의 implementation/runtime/release 상태와 Deferred 범위를 함께 유지한다.

## 7. Related Records

```text
DEC-005  Shared Platform 논리 Contract 경계 (변경 없음)
DEC-057  Shared Identity / Shared Commerce 논리 경계 (변경 없음)
DEC-058  명칭 범위만 부분 대체
DEC-059  Backend Service Foundation 및 Carelog 의미 (변경 없음)
DEC-060  이 ADR의 Decision Log record
ADR-0013 명칭 범위만 부분 대체
```
