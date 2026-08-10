---
title: "Shared Identity와 Shared Commerce의 논리적 책임 경계를 분리한다"
adr_id: "ADR-0012"
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
  - "V1 Local OSS는 로그인·결제·외부 Cloud 서비스 없이 완결한다"
  - "Identity와 Commerce는 동급의 독립 논리 경계다"
  - "물리 서버·Repository·Database·Deployment는 승인하지 않는다"
  - "기존 V2 Personal Managed Workflow와 V3 배치를 변경하지 않는다"
affected_docs:
  - docs/decisions/decision-log.md
  - docs/architecture/repository-service-boundaries.md
evidence_refs: []
supersedes: []
superseded_by:
  - ADR-0017
superseded_scope:
  - "Shared Identity의 물리 Server·Repository·Database·Deployment 미승인과 시점 deferral"
remaining_valid_scope:
  - "Shared Identity와 Shared Commerce의 독립 논리 경계"
  - "Shared Commerce physicalization deferral"
  - "V1 Local OSS 독립성과 물리화 Trigger 원칙"
replacement_decision_refs:
  - ADR-0017
  - DEC-067
---

# ADR-0012: Shared Identity와 Shared Commerce의 논리적 책임 경계를 분리한다

> **Partial supersession:** Shared Identity physicalization의 미승인·시점 유예 범위는
> [ADR-0017](./ADR-0017-shared-platform-gateway-identity-physicalization.md)로 대체됐다.
> Identity·Commerce 독립 논리 경계, Commerce deferral과 V1 독립성은 계속 유효하다.

## 1. Decision Summary

여러 제품이 장기적으로 공유할 수 있는 Account·Authentication 책임과
Commerce 책임을 서로 동급인 독립 논리 경계로 기록한다.

```text
Shared Identity
= Account
+ Credential
+ Authentication
+ Access / Refresh Token
+ Session

Shared Commerce
= Product Membership
+ Subscription
+ Billing
+ Payment
+ Entitlement
+ Quota
```

```text
Shared Identity
≠ Shared Commerce

Shared Commerce
≠ Shared Identity의 하위 Module
```

Development Harness의 미래 Cloud 제품 경계는 다음을 소유한다.

```text
Dev Harness Cloud
= Workspace
+ Project
+ Execution
+ Approval
+ Harness Policy
+ Cloud History
```

## 2. Status

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
```

Accepted 범위는 논리적 책임 경계다.

물리 서버·Repository·Database·Deployment의 생성과 추출은
실제 복수 소비자와 운영상 필요가 확인될 때까지 Deferred다.

## 3. Context

V1은 로그인·결제·외부 Cloud 서비스 없이 완결되는 Local OSS다.

향후 Carelog CRM, Finance Harness, Dev Harness Cloud 등 둘 이상의 제품이
Account·Authentication 또는 Commerce 기능을 실제로 공유할 가능성이 있다.

책임 경계를 미리 구분하지 않으면 Payment가 Identity에 포함되거나,
Product Domain이 Account·Credential·Billing을 직접 소유하는 결합이 생길 수 있다.

반대로 미래 가능성만으로 물리 Service를 먼저 만들면
검증되지 않은 운영 복잡성과 배포 의존을 도입하게 된다.

## 4. Decision

### 4.1 V1 Local OSS

```text
V1 Local OSS
= 로그인 없이 동작
+ 결제 없이 동작
+ 외부 Cloud 서비스 없이 전체 핵심 Workflow 완결
+ Shared Identity 비의존
+ Shared Commerce 비의존
```

### 4.2 Shared Identity

Shared Identity는 다음을 담당하는 미래 논리 경계다.

- Account
- Credential
- Authentication
- Login / Logout
- Access / Refresh Token
- Session
- 안정적인 사용자 식별자

### 4.3 Shared Commerce

Shared Commerce는 다음을 담당하는 미래 논리 경계다.

- Product Membership
- Subscription
- Billing
- Payment
- Entitlement
- Quota

### 4.4 Dev Harness Cloud

Dev Harness Cloud는 Development Harness 제품 도메인의 다음 책임을 소유한다.

- Workspace
- Project
- Execution
- Approval
- Harness Policy
- Cloud History

이 소유권은 기존 V2 Personal Managed Workflow 정의나
Workspace·Organization의 V3 제품 배치를 변경하지 않는다.

### 4.5 물리화

현재 승인하는 것은 논리적 책임 경계뿐이다.

다음은 승인하지 않는다.

- Identity 또는 Commerce 전용 Server
- 독립 Repository
- 독립 Database
- 독립 Deployment
- Microservice 추출

물리 분리는 다음이 실제로 확인된 뒤 검토한다.

1. 둘 이상의 실제 제품 소비자
2. 공통 Contract와 Lifecycle의 반복 사용
3. 독립 운영·보안·장애 격리·확장 필요
4. 독립 Release 또는 소유 팀의 필요

## 5. Consequences

- Account·Authentication과 Payment·Entitlement의 책임이 혼합되지 않는다.
- Development Harness는 Workspace·Execution·Approval 등 제품 도메인 책임을 유지한다.
- V1 Release와 Local Workflow에는 새 외부 의존이 생기지 않는다.
- 미래 논리 경계 이름만으로 Service, Repository 또는 Database를 생성하지 않는다.
- 기존 V1/V2/V3 Roadmap과 Accepted Decision은 supersede하지 않는다.

## 6. Deferred

다음은 별도 결정 전까지 Deferred다.

- Shared Identity 물리 구현과 배포 시점
- Shared Commerce 물리 구현과 배포 시점
- Repository와 Database 분리
- JWT·JWKS 상세
- 결제 Database Schema
- PG Provider 선정
- 서비스 간 이벤트
- Kubernetes와 기타 배포 구성

## 7. Related Decisions

```text
DEC-001
DEC-003
DEC-005
DEC-007
DEC-016
DEC-043
DEC-044
DEC-057
```
