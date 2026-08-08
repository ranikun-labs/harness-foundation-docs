---
title: "목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다"
adr_id: "ADR-0013"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-07-23"
reviewed_at: "2026-07-23"
approved_at: null
effective_from: null
implementation_status: not_started
constraints:
  - "목표 배포 구조는 즉시 구현 승인이 아니다"
  - "V1 Local Core는 Shared Services Deployment Unit과 Cloud AI Runtime 없이 완결한다"
  - "Deployment Unit별 데이터 Source of Truth와 Migration 소유권을 분리한다"
  - "Cross-service Foreign Key와 OLTP Cross-service JOIN을 금지한다"
  - "기존 V2 Personal Managed Workflow와 V3 배치를 변경하지 않는다"
affected_docs:
  - docs/decisions/decision-log.md
  - docs/architecture/repository-service-boundaries.md
  - docs/architecture/README.md
evidence_refs: []
supersedes: []
superseded_by:
  - ADR-0014
  - ADR-0017
superseded_scope:
  - "Shared Platform Server 명칭 범위"
  - "Shared Platform Server에서 파생된 물리 그룹과 Database 예시 표현"
  - "Gateway와 Identity 범위의 Repository·Process physicalization 미승인"
  - "Audit를 별도 Process로 분리할 수 없다는 영구 금지 해석"
remaining_valid_scope:
  - "Target Deployment Unit 구성"
  - "Identity·Commerce·Audit의 Module·Data·Schema·Migration Ownership 분리"
  - "PostgreSQL 목표 배치 원칙과 Cross-service FK / OLTP Cross-service JOIN 금지"
  - "V1 Local Core 독립성"
  - "Commerce와 Audit의 현재 구현·Runtime 미승인 상태"
replacement_decision_refs:
  - ADR-0014
  - DEC-060
  - ADR-0017
  - DEC-067
---

# ADR-0013: 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다

## 1. Decision Summary

> **Partial supersession:** `Shared Platform Server` 명칭과 그 물리 그룹 파생 표현은
> [ADR-0014](./ADR-0014-shared-services-deployment-unit-naming.md)로 부분 대체됐다.
> 이 ADR의 Target Topology와 Data Ownership 결정은 계속 유효하다.
>
> **Additional partial supersession:** Gateway와 Identity에 한한 물리화 미승인 범위와
> Audit 별도 Process를 영구 금지하는 해석은
> [ADR-0017](./ADR-0017-shared-platform-gateway-identity-physicalization.md)로 대체됐다.
> Data·Schema·Migration Ownership, no cross-service DB/FK/JOIN, Commerce deferral과
> Audit의 현재 미구현 상태는 계속 유효하다.

ADR-0012가 확정한 Shared Identity와 Shared Commerce의 논리 경계를 유지하면서,
장기 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다.

```text
Target Deployment Units
├── Carelog CRM Server
├── Finance Harness Server
├── Dev Harness Cloud Server
├── AI Runtime Server
└── Shared Services Deployment Unit
    ├── Identity Module
    ├── Commerce Module
    └── Audit Module
```

```text
Target Deployment Unit
≠ 즉시 구현 승인
≠ Repository 생성 승인
≠ Database Provisioning 승인
≠ Kubernetes·Docker 배포 승인
```

## 2. Status

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
```

Accepted 범위는 목표 Deployment Unit, 데이터 소유권,
서비스 간 데이터 접근과 Audit 책임 원칙이다.

실제 서버·Repository·Database 생성과 배포, 물리 Cluster 분리는 Deferred다.

## 3. Relationship to ADR-0012

ADR-0012의 다음 결정은 그대로 유지한다.

- Shared Identity와 Shared Commerce는 동급의 독립 논리 경계다.
- V1 Local OSS는 Shared Identity·Commerce·외부 Cloud 서비스 없이 완결한다.
- 논리 경계만으로 물리 Service를 즉시 추출하지 않는다.
- 실제 복수 소비자와 운영상 필요가 확인된 뒤 물리화를 검토한다.

ADR-0013은 ADR-0012를 supersede하지 않는다.

ADR-0012의 “물리 구현 미승인”은 실제 Server·Repository·Database·Deployment의
생성과 운영 시작이 승인되지 않았다는 의미다.

ADR-0013은 그 제약 안에서 장기 목표 Topology와 소유권 원칙만 확정한다.

## 4. Target Deployment Units

### 4.1 Product Servers

```text
Carelog CRM Server
= Carelog Product Domain
+ Carelog Workflow
+ Carelog Policy·Prompt·Context·Evaluation

Finance Harness Server
= Finance Product Domain
+ Finance Workflow
+ Finance Policy·Prompt·Context·Evaluation

Dev Harness Cloud Server
= Workspace·Project
+ Execution
+ Approval
+ Harness Policy
+ Cloud History
```

Dev Harness Cloud는 실제 Cloud 기능 개발 시점까지 구현을 유예한다.

기존 V2 Personal Managed Workflow 정의와
Workspace·Organization의 V3 배치는 변경하지 않는다.

### 4.2 AI Runtime Server

AI Runtime Server의 목표 책임:

- Provider 실행
- Runtime Routing
- Retry
- Fallback
- Token·Cost Metering
- Runtime Trace

AI Runtime Server가 소유하지 않는 책임:

- 제품별 Prompt
- 제품별 Policy
- 제품별 Context Schema
- 제품별 Evaluation 의미
- 제품 Domain Decision

제품별 Prompt·Policy·Context Schema·Evaluation은 각 Product Server가 소유한다.

### 4.3 Shared Services Deployment Unit

Shared Services Deployment Unit은 장기 목표의 단일 Deployment Unit이다.

```text
Shared Services Deployment Unit
├── Identity Module
├── Commerce Module
└── Audit Module
```

한 Deployment Unit에 있더라도 다음 경계를 유지한다.

- 코드 Module 분리
- 데이터 소유권 분리
- Migration 소유권 분리
- 내부 Contract 분리
- 다른 Module의 Table 직접 접근 금지

Commerce는 실제 유료화 전까지 구현을 유예할 수 있다.

Audit는 별도 Server로 추가하지 않는다.
중앙 Audit 기능이 필요해질 경우 Shared Services Deployment Unit 내부 Module로 활성화한다.

## 5. V1 Local Core Independence

```text
Dev Harness V1 Local Core
↛ Shared Identity
↛ Shared Commerce
↛ Shared Audit
↛ Dev Harness Cloud
↛ Cloud AI Runtime
```

V1은 로그인·결제·외부 Cloud 서비스 없이 전체 핵심 Workflow를 완결한다.

목표 Deployment Topology는 V1 Release Requirement나 Runtime Dependency가 아니다.

## 6. PostgreSQL Placement

초기에는 하나의 PostgreSQL 물리 Cluster를 공유할 수 있다.

```text
PostgreSQL Physical Cluster
├── carelog_db
├── finance_db
├── dev_cloud_db
├── ai_runtime_db
└── shared_services_db
    ├── identity schema
    ├── commerce schema
    └── audit schema
```

이 배치는 Database와 Schema의 목표 소유권을 나타낸다.
실제 Cluster, Database와 Schema 생성 명령을 승인하지 않는다.

| Logical Database / Schema | Source of Truth Owner | Migration Owner |
|---|---|---|
| `carelog_db` | Carelog CRM Server | Carelog CRM |
| `finance_db` | Finance Harness Server | Finance Harness |
| `dev_cloud_db` | Dev Harness Cloud Server | Dev Harness Cloud |
| `ai_runtime_db` | AI Runtime Server | AI Runtime |
| `shared_services_db.identity` | Identity Module | Identity Module |
| `shared_services_db.commerce` | Commerce Module | Commerce Module |
| `shared_services_db.audit` | Audit Module | Audit Module |

같은 물리 Cluster 또는 Database를 사용해도 소유권은 합쳐지지 않는다.

## 7. Cross-service Data Access

다음을 금지한다.

- 다른 Deployment Unit의 Database 직접 접속
- Cross-service Foreign Key
- OLTP Cross-service JOIN
- 같은 Database에 있다는 이유로 다른 Module의 Table 직접 조회
- Shared Services Deployment Unit 내부 Schema 사이의 소유권 우회

다른 서비스 데이터는 다음 경로로 소비한다.

- API
- Token Claim
- Event
- Projection

Analytics와 운영 리포팅의 Cross-product 결합은
별도 Read Model 또는 ETL 경로에서 수행한다.

Audit Event는 제품 Domain Entity에 물리 Foreign Key를 걸지 않는다.
원본 Domain을 직접 참조하지 않는 opaque identifier를 저장한다.

## 8. Audit Responsibility

각 Product와 Service가 소유:

- 자기 Domain Audit Event의 의미
- Event 생성 시점
- 필요한 Domain Identifier
- 업무 Transaction과 Event 생성의 일관성

Shared Services Audit Module이 담당할 수 있는 책임:

- 중앙 보관
- 통합 조회
- 보존정책 집행
- 접근 통제와 운영 감사

중요 업무 데이터와 Audit Event의 유실 방지는
Service별 Local Outbox로 처리할 수 있다.

Shared Audit API를 업무 Transaction 안에서 동기 호출하도록 강제하지 않는다.

중앙 Audit Module은 즉시 구현 대상이 아니다.
실제 통합 검색·보존·감사 요구가 생겼을 때 활성화한다.

## 9. Physical Cluster Extraction

다음 요구가 실제로 확인될 때만 별도 PostgreSQL Cluster 분리를 검토한다.

- 독립 트래픽과 Scaling
- 장애 격리
- 규제와 데이터 위치
- 서로 다른 보존정책
- 독립 Backup·Restore 요구
- 운영 조직과 Release 책임 분리

Database 수나 미래 가능성만으로 Cluster를 선제 분리하지 않는다.

## 10. Consequences

- Target Deployment Unit과 구현 시점을 분리한다.
- Shared Services Deployment Unit은 하나의 Deployment Unit으로 시작할 수 있다.
- Identity·Commerce·Audit는 같은 배포물 안에서도 코드와 데이터를 분리한다.
- Deployment Unit별 Source of Truth와 Migration 책임이 명확해진다.
- OLTP 서비스 간 결합은 API·Event·Projection 경계 밖으로 확산되지 않는다.
- V1 Local Core와 기존 V2/V3 Roadmap은 변경되지 않는다.

## 11. Deferred and Non-goals

다음은 별도 결정 전까지 Deferred 또는 범위 밖이다.

- 구체적인 Repository 생성 계획
- 실제 Server URL과 Port
- Kubernetes Namespace와 Deployment
- Docker 구성
- Database Instance 크기
- JWT Claim 상세
- 카카오 OAuth Endpoint
- 결제 Table과 환불 상태 머신
- AI Prompt·Lens·Policy 내용
- Event Broker 제품 선택
- Cross-service 분산 Transaction 구현
- 실제 Server·Database 구축

## 12. Related Decisions

```text
ADR-0012
DEC-001
DEC-003
DEC-005
DEC-007
DEC-016
DEC-043
DEC-044
DEC-057
DEC-058
DEC-060
ADR-0014
```
