---
title: "Shared Gateway와 Shared Identity의 물리화를 승인한다"
adr_id: "ADR-0017"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers:
  - 박성환
approvers:
  - 박성환
created_at: "2026-08-08"
reviewed_at: "2026-08-08"
approved_at: "2026-08-08"
effective_from: "2026-08-08"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "승인 범위는 Gateway와 Identity 물리화뿐이며 Shared Platform 전체의 일괄 Microservice 분리가 아니다"
  - "platform-services Repository는 planned / not_created이며 이 ADR로 생성되지 않는다"
  - "RPL-53·RPL-54는 현재 동작을 보존하는 추출이고 RPL-55 검증 전 Cutover 완료를 주장하지 않는다"
  - "Commerce·Audit·Shared AI 구현과 NATS Runtime은 승인하지 않는다"
  - "구현·Runtime 지원·배포·출시 완료를 Architecture 승인과 분리한다"
affected_docs:
  - docs/adr/README.md
  - docs/adr/ADR-0012-shared-identity-commerce-boundary.md
  - docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
  - docs/adr/ADR-0014-shared-services-deployment-unit-naming.md
  - docs/adr/ADR-0015-platform-communication-messaging-scaling.md
  - docs/decisions/decision-log.md
  - docs/architecture/repository-service-boundaries.md
  - docs/architecture/backend-service-foundation/README.md
  - docs/architecture/backend-service-foundation/service-boundaries.md
  - docs/master/product-architecture-master.md
  - docs/governance/portfolio-work-management-governance.md
  - catalog/system-catalog.yaml
  - README.md
evidence_refs:
  - RPL-52
  - RPL-53
  - RPL-54
  - RPL-55
  - RPL-4
  - RPL-27
  - RPL-50
  - ADR-0012
  - ADR-0013
  - ADR-0014
  - ADR-0015
  - DEC-057
  - DEC-058
  - DEC-059
  - DEC-060
  - DEC-064
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs:
  - DEC-067
---

# ADR-0017: Shared Gateway와 Shared Identity의 물리화를 승인한다

> **상태 경고**
>
> ```text
> Architecture physicalization accepted_with_constraints
> ≠ platform-services Repository created
> ≠ Gateway extracted
> ≠ Identity extracted
> ≠ Carelog cut over
> ≠ Runtime supported or deployed
> ≠ Product released
> ```

## 1. Decision Summary

Finance Harness가 Carelog에 이어 공통 Ingress와 Authentication을 실제로 필요로 하는
두 번째 Product Consumer가 됐다. 이에 따라 Shared Gateway와 Shared Identity의
물리화를 제약과 함께 승인한다.

목표 GitHub Repository는 아직 존재하지 않는
`ranikun-labs/platform-services`이며 상태는 `planned / not_created`다.

```text
platform-services                         planned / not_created
├── gateway-app                           independent process
│   └── Spring Boot
│       + Spring Cloud Gateway
│       + WebFlux / Netty
└── platform-core                         independent process
    └── Spring Boot + Spring MVC
        + one-process modular monolith
        ├── identity                      ACTIVE target
        ├── commerce                      DEFERRED
        └── audit                         DEFERRED
```

```text
one Git Repository
≠ one Process

Gateway + Identity physicalization approval
≠ all Shared Platform capabilities split into Microservices
```

## 2. Status and Scope

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
repository_status: planned / not_created
```

### Scope In

- Shared Gateway와 Shared Identity의 물리화 방향 승인
- `platform-services` Target Repository와 그 내부 두 Process 경계
- `platform-core` 내부 Module·Data·Migration Ownership 규칙
- Current와 Target Topology의 분리
- RPL-52부터 RPL-50까지의 순서와 후속 구현 소유권
- Behavior-preserving extraction, Cutover와 Rollback 원칙
- ADR-0012~0015와 DEC-057~060·064의 제한적 부분 대체 범위

### Scope Out

- `platform-services` 또는 다른 Repository 생성
- Spring Boot·Gradle·Docker·Deployment Scaffold
- Gateway, Auth, OAuth 또는 Identity 코드 이동
- RPL-4 또는 RPL-27 기능 구현
- Carelog Cutover와 Finance Backend 구현
- Commerce, Audit, NATS 또는 Shared AI 구현
- Production Runtime·지원·배포·출시 승인

## 3. Context and Physicalization Trigger

### 3.1 과거 Deferral이 합리적이었던 이유

ADR-0012부터 ADR-0015가 승인될 당시 Shared Identity의 실제 Product Consumer는
Carelog 중심이었다. 이 Carelog 단일 Consumer 상태에서는 먼저 논리 책임과 데이터 소유권을
분리하고, 검증되지 않은 Repository·Process·운영 복잡성을 유예하는 것이 합리적이었다.

따라서 기존 결정의 physicalization deferral은 오류가 아니라 당시 조건에 맞는
증분 Architecture 선택이었다.

### 3.2 현재 Trigger

Finance Harness가 공통 Ingress와 Auth/Identity를 실제로 소비해야 하는 두 번째
Product Consumer가 됐다. 이 변화는 ADR-0012가 기록한 물리화 Trigger를 충족한다.

```text
Finance Harness
→ Carelog-owned Gateway / Auth
```

위 구조는 공통 Platform Capability가 Product Repository의 Lifecycle과 Release에
종속되는 Ownership Inversion을 만든다.

반대로 Gateway와 Auth를 Finance에 복사하면 security/runtime drift가 생긴다.

- Public / Protected Route와 JWT 검증 규칙의 Security Drift
- OAuth·Token·Principal Contract의 Runtime Drift
- Rate Limit과 Edge Behavior의 중복 구현
- 두 Product가 서로 다른 Release와 장애 대응 경로를 갖는 운영 Drift

```text
second real Product Consumer
+ common ingress and authentication need
+ mature logical and data ownership boundary
= physicalization trigger satisfied for Gateway + Identity
```

이 Trigger는 Shared Commerce, Audit, Shared AI 또는 전체 MSA의 즉시 분리를
승인하지 않는다.

## 4. Current Topology

현재 구현 Host는 `ranikun-labs/carelog-be`다.

```text
ranikun-labs/carelog-be
├── carelog-gateway
│   └── Spring Cloud Gateway / WebFlux
└── carelog-be
    ├── Auth / OAuth / Identity-related capability
    └── Carelog Product Domain
```

현재 상태:

- merged baseline은 Carelog `dev`의 Git object로 판정한다.
- RPL-4 / Gateway PR #34의 Public OAuth Route, Rate Limit, Public / Protected Route
  동작은 pending delta이며 merged baseline이 아니다.
- physical extraction은 아직 시작되지 않았다.
- Finance Harness가 Shared Gateway 또는 Shared Identity Runtime을 사용한다는
  Evidence는 없다.

```text
merged baseline
≠ pending RPL-4 / PR #34 behavior delta
≠ RPL-53 physical extraction
```

## 5. Target Repository and Process Boundary

### 5.1 Repository Ownership

```text
GitHub Organization: ranikun-labs
Target Repository:   ranikun-labs/platform-services
Repository State:    planned / not_created
```

`harness-foundation-docs`는 Architecture Decision의 Canonical Owner다.
실제 Service Code, Runtime 설정, Migration과 운영 Evidence는 Repository가 생성된
뒤 `platform-services`가 소유한다.

### 5.2 Independent Processes

`gateway-app`과 `platform-core`는 같은 Git Repository에 있어도 서로 다른 Spring
Boot Application이며 독립 Process로 Build·Run·Deploy·Rollback한다.

| Process | Runtime boundary | Primary responsibility | State |
|---|---|---|---|
| `gateway-app` | Spring Boot, Spring Cloud Gateway, WebFlux / Netty | External ingress, routing, public/protected boundary, JWT verification edge, rate limit, trusted internal authentication context propagation | planned / not_implemented |
| `platform-core` | Spring Boot, Spring MVC, one process | Identity와 미래 Platform Module의 modular-monolith host | planned / not_implemented |

Gateway에 Product Business Logic을 넣지 않는다. `gateway-app`과
`platform-core/identity`를 하나의 Spring Boot Application으로 합치지 않는다.

## 6. platform-core Module and Data Boundary

초기 리소스 효율을 위해 `platform-core`는 하나의 Spring MVC Process로 배포할 수
있다. 같은 JVM은 논리·데이터 경계를 합칠 권한이 아니다.

```text
platform-core
├── identity    ACTIVE target
├── commerce    DEFERRED
└── audit       DEFERRED
```

각 Module은 다음 규칙을 지킨다.

- 다른 Module의 내부 Entity를 직접 사용하지 않는다.
- 다른 Module의 Repository를 직접 호출하지 않는다.
- Shared mutable Entity를 만들지 않는다.
- 다른 Module 또는 다른 Service의 Database Table을 직접 읽거나 수정하지 않는다.
- Module별 Data, Schema와 Migration Owner를 명시한다.
- Cross-module Transaction을 최소화한다.
- Public API, Contract 또는 Event로 상호작용한다.
- Package dependency direction을 명시하고 순환 의존을 금지한다.
- 독립 Release 필요가 확인되면 Module을 별도 Process로 추출할 수 있게 경계를 유지한다.

### 6.1 Identity Ownership

`platform-core/identity`의 Target Ownership 후보:

- Account / Identity
- External Identity
- Product Client Registry
- Auth / OAuth
- Token / Principal
- OAuth State와 Redis OAuth State
- Identity-owned Persistence와 Migration

Carelog의 Customer, Interaction, Timeline, FollowUp, Handoff와 같은 Product
Domain·Workflow는 이동하지 않는다. 실제 Carelog 코드의 Product 명칭이 이 예시와
다르더라도 원칙은 동일하다. 제품 Repository는 Identity 소유 Table을 직접 수정하지
않고 stable account/principal contract를 소비한다.

### 6.2 Commerce

Commerce의 논리적 독립 경계는 유지하지만 구현은 `DEFERRED`다. 이 ADR은 Billing,
Payment, Entitlement, Database 또는 Runtime을 승인하지 않는다.

### 6.3 Audit

Audit는 현재 별도 Process로 분리하거나 `platform-core` 안에서 활성화하도록 승인된
구현 범위가 아니다. 향후 중앙 Audit 요구가 생기면 첫 Target은 경계를 지킨 Module이며,
독립 운영 필요가 확인되면 별도 Consumer Process 추출을 새 Decision으로 검토한다.

```text
Product / Identity / Commerce
→ Local Outbox / Event
→ NATS
→ Audit Consumer
→ Audit-owned storage
```

이는 future event-consumer boundary다. NATS, Audit Entity·API·DB·Consumer가 현재
구현됐거나 Runtime 지원된다는 뜻이 아니다. Domain에서
`auditService.save(...)` 또는 `auditRepository.save(...)`에 직접 결합하지 않는다.

## 7. Shared AI Boundary

Shared AI는 `platform-services/platform-core`에 넣지 않는다.

```text
Shared AI
= future independent Python Runtime
+ FastAPI candidate
+ LangGraph / LangChain / RAG candidates
+ provider and model routing
+ safety / policy
+ usage / cost
```

Shared AI의 현재 상태는 `deferred / not_started / not_supported`다. 실제 Finance
AI Vertical Slice가 공통 Runtime을 필요로 할 때 별도 Repository·Runtime Decision으로
검토한다. 후보 기술 표기는 채택·구현·지원의 증거가 아니다.

## 8. Communication Boundary

ADR-0015 / DEC-064의 다음 불변조건을 유지한다.

- External ingress는 Gateway를 통한다.
- Product와 Shared Service의 내부 동기 호출은 Gateway를 우회하는 Direct HTTP/JSON이다.
- 일반 Product 요청마다 Identity를 동기 호출하지 않는다.
- Gateway는 외부 위조 Authentication Header를 제거하고 신뢰 가능한 Context만 전달한다.
- Product는 자기 Domain Authorization을 소유한다.
- Service 간 데이터 교환은 API, Token Claim, Event 또는 Projection을 사용한다.
- NATS JetStream은 실제 첫 Use Case와 후속 Decision 전까지 미도입 상태다.

## 9. Migration Sequence and Ownership

```text
G1 — RPL-52
Foundation Physicalization Approval
        ↓
G2 — RPL-53
Carelog Gateway → shared gateway-app
Behavior-preserving extraction
        ↓
G3 — RPL-54
Carelog Auth / OAuth / Identity → platform-core/identity
Behavior-preserving extraction
        ↓
G4 — RPL-55
Carelog → Shared Gateway + Shared Identity
Cutover / Regression
        ↓
RPL-27
new platform-core/identity reality에 기존 Ticket 재타기팅 후 기능 구현
        ↓
RPL-50
Finance Backend Core
        ↓
Finance Shared Gateway / Identity E2E
```

| Gate | Owner | Completion Evidence | Current state |
|---|---|---|---|
| G1 / RPL-52 | Foundation | Accepted ADR·DEC와 정합한 projection merge | in_progress; Runtime 아님 |
| G2 / RPL-53 | Shared Gateway extraction | Baseline + applicable PR #34 delta 보존, 독립 Process 검증 | planned / not_started |
| G3 / RPL-54 | Shared Identity extraction | Auth/OAuth/Identity behavior와 data migration 검증 | planned / not_started |
| G4 / RPL-55 | Carelog cutover | Carelog regression, rollback rehearsal와 old-path retirement evidence | planned / not_started |
| RPL-27 | Identity behavior enhancement | G4 이후 새 Repository Reality로 기존 Ticket 재타기팅 | deferred_by_sequence |
| RPL-50 | Finance Backend | Finance-owned backend contract와 Shared Platform E2E | planned_after_G4 |

RPL-4 / PR #34 기능을 RPL-53에서 새로 중복 구현하지 않는다. G2는 merged baseline과
적용 가능한 pending delta를 구분해 최종 추출 기준을 확정한다.

## 10. Behavior-preserving Extraction

G2와 G3의 기본 원칙은 위치와 소유권을 바꾸되 관찰 가능한 동작을 의도적으로
바꾸지 않는 것이다.

- Route, Public / Protected behavior, JWT 처리와 Rate Limit의 기준을 먼저 고정한다.
- Auth/OAuth/Token/Principal, OAuth State와 Persistence behavior를 먼저 고정한다.
- 새 기능 변경은 추출과 분리한다.
- RPL-4 / PR #34처럼 이미 존재하는 pending delta는 출처와 상태를 보존해 통합한다.
- Copy나 새 Process 기동만으로 Migration 완료를 선언하지 않는다.
- Contract, 데이터, 보안 Regression과 Consumer 전환 Evidence가 있어야 Gate를 닫는다.

RPL-27은 duplicate Ticket을 만들지 않고 G4 뒤 기존 Ticket을 새
`platform-core/identity` Reality에 맞춰 재타기팅한다.

## 11. Cutover and Rollback

- RPL-55 전까지 Carelog의 기존 구현 경로를 현재 Implementation Host로 유지한다.
- Cutover는 Gateway와 Identity의 Consumer Routing·Config·Data 경계를 명시적으로
  전환하고 Carelog Regression을 통과한 뒤 승인한다.
- Rollback 단위는 독립 Process와 Consumer 연결이며, partial cutover 상태에서
  Identity Data의 dual-writer를 허용하지 않는다.
- 데이터 변경은 소유 Migration과 reversible 또는 forward-fix 전략을 가져야 한다.
- Rollback 시 Token·Session·OAuth State compatibility와 쓰기 권한을 먼저 검증한다.
- 구 경로 제거는 Cutover 관찰 기간과 Rollback Gate가 닫힌 뒤 별도 변경으로 수행한다.
- RPL-52 Merge만으로 Traffic, Runtime 또는 Data Owner가 바뀌지 않는다.

## 12. Partial Supersession Matrix

이 ADR은 기존 ADR 전체를 supersede하지 않는다. 다음 문구·결정 범위만 부분
대체하며, 나머지 논리·데이터·통신 불변조건은 유지한다.

| Existing record | Partially superseded scope | Remaining valid scope |
|---|---|---|
| ADR-0012 / DEC-057 | Shared Identity의 물리 Server·Repository·Database·Deployment 미승인 및 시점 deferral | Identity·Commerce 독립 논리 경계, Commerce deferral, V1 독립성, 물리화 Trigger 원칙 |
| ADR-0013 / DEC-058 | Gateway + Identity에 한한 Repository·Process physicalization 미승인; `Audit는 별도 Server로 분리하지 않는다`의 영구 금지 해석 | Module·Data·Schema·Migration Ownership, no cross-service DB/FK/JOIN, Commerce deferral, Audit 현재 비활성·비분리 상태와 별도 추출 Trigger |
| ADR-0014 / DEC-060 | Shared Services Deployment Unit을 물리 후보로만 두고 구체 Process를 승인하지 않은 범위 | 명칭 구분, Identity·Commerce·Audit 논리 경계, 공동 배포 가능성, 구현·Runtime·Release 상태 분리 |
| ADR-0015 / DEC-064 | Shared Identity physical extraction 미승인 범위 | HTTP/JSON, Direct internal call, Gateway ingress, token-context, NATS trigger, Shared AI와 Product 경계, gRPC·Kafka·Kubernetes deferral |
| DEC-059 | `identity-platform`을 미확정 후보 Repository로 둔 범위 | Backend Service Foundation 명칭, Shared Identity canonical 논리 서비스명, Carelog 등록과 현재/목표 구분 |

Replacement:

```text
Shared Identity repository candidate: identity-platform
→ Shared Java Platform target repository: ranikun-labs/platform-services
→ identity physical location: platform-core/identity

Shared Services Deployment Unit
→ platform-core Spring MVC process로 구체화

Gateway
→ 같은 Repository의 별도 gateway-app WebFlux process
```

## 13. Consequences

- Finance가 Carelog-owned Gateway/Auth에 종속되는 Ownership Inversion을 피한다.
- Gateway와 Identity의 Security·Runtime Contract를 제품별로 복제하지 않는다.
- 하나의 Repository 안에서도 reactive edge와 MVC domain runtime을 분리한다.
- `platform-core`의 초기 운영 단위를 작게 유지하면서 Module별 추출 가능성을 보존한다.
- G2/G3/G4 구현 Owner가 Repository·Process·Module·Data·Migration 경계를 추측하지 않는다.
- 새 Repository와 Runtime 운영 부담은 후속 Gate에서 실제 Evidence와 함께 발생한다.

## 14. Deferred and Follow-up Ownership

| Deferred scope | Follow-up owner / trigger |
|---|---|
| `platform-services` Repository 생성과 scaffold | RPL-53/G2 시작 전 별도 승인된 implementation workflow |
| Gateway extraction | RPL-53 |
| Identity extraction | RPL-54 |
| Carelog cutover and rollback evidence | RPL-55 |
| OAuth State Product Client Binding enhancement | Existing RPL-27, G4 이후 재타기팅 |
| Finance Backend Core and shared E2E | RPL-50, G4 이후 |
| Commerce | 실제 유료화와 공통 Consumer trigger 후 별도 Decision |
| Audit activation / independent consumer | 중앙 감사 Use Case와 운영 격리 trigger 후 별도 Decision |
| NATS Runtime | ADR-0015의 first concrete event/job trigger 후 별도 Decision |
| Shared AI repository/runtime | Finance AI Vertical Slice의 실제 공통 Runtime 요구 후 별도 Decision |

## 15. Related Records

```text
ADR-0012  Identity / Commerce logical boundary; Identity deferral only partially superseded
ADR-0013  Deployment and data ownership; selected physicalization and Audit wording partially superseded
ADR-0014  Shared Services naming; platform-core process concretization added
ADR-0015  Communication invariants preserved; Identity extraction prohibition partially superseded
DEC-059   identity-platform candidate replaced by planned platform-services target
DEC-067   Decision Log projection of this ADR
RPL-52    G1 Architecture approval
RPL-53    G2 Gateway extraction
RPL-54    G3 Identity extraction
RPL-55    G4 Carelog cutover/regression
RPL-4     Existing Gateway behavior delta
RPL-27    Post-G4 Identity behavior enhancement
RPL-50    Post-G4 Finance Backend Core
```
