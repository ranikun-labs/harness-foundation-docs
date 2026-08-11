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
reviewed_at: "2026-08-12"
approved_at: "2026-08-08"
effective_from: "2026-08-08"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "승인 범위는 Gateway와 Identity 물리화뿐이며 Shared Platform 전체의 일괄 Microservice 분리가 아니다"
  - "platform-services Repository container는 created / empty이며 Application·Runtime 구현은 시작되지 않았다"
  - "RPL-53·RPL-54는 현재 동작을 보존하는 추출이고 RPL-55 검증 전 Cutover 완료를 주장하지 않는다"
  - "Commerce·Audit·Shared AI 구현과 NATS Runtime은 승인하지 않는다"
  - "Near-term에는 PostgreSQL과 Redis physical instance를 각각 하나로 유지하되 Service별 논리 소유권·접근 권한·Migration 경계를 강제한다"
  - "Finance Domain 개발은 Shared Identity Production Cutover 전체를 기다리지 않으며 Identity Consumer 활성화만 Gate를 따른다"
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
  - docs/contracts/backend-service-foundation/identity-token-contract.md
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
> Repository container created / empty
> Architecture physicalization accepted_with_constraints
> ≠ Gateway or Identity application implemented
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

```text
Canonical verdict: APPROVED_FOR_PLATFORM_RUNTIME_FOUNDATION
```

목표 GitHub Repository는 `ranikun-labs/platform-services`다. Repository container는
`created / empty`이고 현재 visibility는 GitHub에서 관찰된 `public`이다. 이는 visibility
정책 채택이 아니며 Application·Runtime 구현은 시작되지 않았다.

```text
platform-services                         repository created / empty
├── gateway-app                           independent build / process / deployment
│   └── Spring Boot
│       + Spring Cloud Gateway
│       + WebFlux / Netty
└── platform-core                         independent build / process / deployment
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
repository_status: created / empty
repository_visibility: public (observed fact)
visibility_policy: not_decided
```

### Scope In

- Shared Gateway와 Shared Identity의 물리화 방향 승인
- `platform-services` Target Repository와 그 내부 두 Process 경계
- `platform-core` 내부 Module·Data·Migration Ownership 규칙
- PostgreSQL·Redis physical instance 유지와 Service별 logical ownership 규칙
- Current와 Target Topology의 분리
- G0~G5 Gate와 RPL-27·Finance 병행 가능 범위
- Behavior-preserving extraction, Cutover와 Rollback 원칙
- ADR-0012~0015와 DEC-057~060·064의 제한적 부분 대체 범위

### Scope Out

- `platform-services` 삭제·재생성 또는 visibility 정책 결정
- Spring Boot·Gradle·Docker·Deployment Scaffold
- Gateway, Auth, OAuth 또는 Identity 코드 이동
- RPL-4 또는 RPL-27 기능 구현
- Carelog Cutover와 Finance Backend 구현
- Commerce, Audit, NATS 또는 Shared AI 구현
- Production Runtime·지원·배포·출시 승인
- PostgreSQL 또는 Redis physical instance 추가

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

2026-08-12 사용자 확인 기준 현재 구현 Host는 `ranikun-labs/carelog-be`다. 이 topology
기록은 Architecture input이며 Production deployment/health Evidence를 대신하지 않는다.

```text
Public Client
→ Cloudflare / Tunnel
→ carelog-gateway                       independent deployment unit
   └── Spring Cloud Gateway / WebFlux
→ carelog-be                            product backend process
    ├── Auth / OAuth / Identity-related capability
    └── Carelog Product Domain

PostgreSQL physical instance: 1
Redis physical instance:      1
```

현재 상태:

- merged baseline은 Carelog `dev`의 Git object로 판정한다.
- RPL-4 / Gateway PR #34의 Public OAuth Route, Rate Limit, Public / Protected Route
  동작은 pending delta이며 merged baseline이 아니다.
- physical extraction은 아직 시작되지 않았다.
- Gateway는 현재 독립 Deployment Unit이지만 Auth/OAuth는 `carelog-be` 내부 Module이며
  독립 Shared Identity Runtime이 아니다.
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
Repository State:    created / empty
Observed Visibility: public (policy not_decided)
```

`harness-foundation-docs`는 Architecture Decision의 Canonical Owner다.
실제 Service Code, Runtime 설정, Migration과 운영 Evidence는 Repository가 생성된
뒤 `platform-services`가 소유한다.

### 5.2 Independent Processes

`gateway-app`과 `platform-core`는 같은 Git Repository에 있어도 서로 다른 Spring
Boot Application이며 독립 Process로 Build·Run·Deploy·Rollback한다. 각 Process는
별도 build task와 artifact, config namespace, health/readiness, deployment definition,
release version과 rollback target을 가진다.

| Process | Runtime boundary | Primary responsibility | State |
|---|---|---|---|
| `gateway-app` | Spring Boot, Spring Cloud Gateway, WebFlux / Netty | External ingress, routing, public/protected boundary, JWT verification edge, rate limit, trusted internal authentication context propagation | planned / not_implemented |
| `platform-core` | Spring Boot, Spring MVC, one process | Identity와 미래 Platform Module의 modular-monolith host | planned / not_implemented |

Gateway에 Product Business Logic을 넣지 않는다. `gateway-app`과
`platform-core/identity`를 하나의 Spring Boot Application으로 합치지 않는다.
독립 rollback은 application artifact에 대한 독립성을 뜻한다. Identity schema나
token contract가 이미 전환된 뒤의 rollback까지 무조건 독립이라는 뜻은 아니며,
data·token compatibility Gate를 함께 통과해야 한다.

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

`platform-core/identity`의 Target Ownership:

- stable user identity / Account
- Password Credential
- External Identity
- Product Client Registry
- Authentication / OAuth provider integration
- OAuth State / PKCE와 single-use handoff state
- Access Token / Refresh Session / Token Session
- Token signing, rotation, revocation과 stable principal
- Identity-owned Persistence와 Migration

다음은 Shared Identity가 소유하지 않는다.

- Carelog Role과 Domain Authorization
- Finance Domain Authorization
- Product Membership
- Subscription, Billing, Payment, Entitlement와 Quota
- Carelog User/Profile, Organization, Customer, Timeline, Follow-up과 Relation
- Finance Domain Data

Product Membership·Subscription·Payment·Entitlement는 Shared Commerce의 논리 책임을
유지하지만 이번 physicalization에서 구현하지 않는다. Product별 Role과 Domain
Authorization은 각 Product가 소유한다. 제품 Repository는 Identity 소유 Table이나
Redis keyspace를 직접 사용하지 않고 stable subject/token/API contract를 소비한다.

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

### 6.4 Near-term PostgreSQL and Redis Boundary

Near-term에는 PostgreSQL physical instance 하나와 Redis physical instance 하나를
유지한다. physical co-location은 logical ownership 통합이나 credential 공유를 뜻하지
않는다.

| Store | Near-term placement | Required ownership boundary |
|---|---|---|
| PostgreSQL | one physical instance / cluster | Carelog, Finance와 Identity는 별도 logical database 또는 schema, DB role, migration history와 write authority를 가진다 |
| Redis | one physical instance | Service별 key namespace와 ACL user를 분리하고 TTL·eviction·failure policy를 명시한다 |

Identity PostgreSQL은 Account, Credential, ExternalIdentity, ProductClient,
RefreshSession과 Token/Revocation의 durable source of truth를 소유한다. Redis는 OAuth
State/PKCE, single-use handoff, session/cache와 revocation projection의 단기 Runtime
state를 소유할 수 있지만 Business source of truth가 아니다.

금지:

- Cross-service direct table write와 SQL JOIN
- Cross-service foreign key 또는 shared mutable table
- Product가 Identity database credential이나 Repository를 사용
- Product 또는 Gateway가 Identity Redis keyspace 전체를 사용

Gateway가 revocation/blacklist read boundary를 필요로 하면 Identity가 소유하는
versioned read model 또는 전용 read-only key namespace만 최소 ACL로 소비한다. 이
transitional read boundary는 Gateway에 revocation write authority를 주지 않는다.

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
- issuer/audience/JWKS를 검증할 수 없거나 trusted auth context가 불완전하면 protected
  request는 fail closed한다.
- login·refresh·revocation 같은 명시적 Identity command만 bounded direct HTTP를
  사용하고, 일반 Product request는 signed token을 로컬 검증한다.
- NATS JetStream은 실제 첫 Use Case와 후속 Decision 전까지 미도입 상태다.

## 9. Migration Sequence and Ownership

```text
G0  Canonical Physicalization Approval
 ↓
G1  platform-services Runtime Foundation
 ↓
G2  Identity and Gateway Contract
 ↓
G3  Carelog Auth/OAuth/Identity Extraction
 ↓
G4  Gateway + Identity + Carelog Compose/E2E and Cutover Gate
 ↓
G5  Finance Shared Identity Consumer Activation
```

| Gate | Required outcome | Exit evidence | Current state |
|---|---|---|---|
| G0 | `platform-services`, `gateway-app`, `platform-core/identity` physicalization과 independent Runtime boundary 승인 | Accepted ADR-0017·DEC-067과 정합한 canonical projection | accepted; Runtime 아님 |
| G1 | 두 Application의 독립 boot/build/config/deploy/rollback foundation, health/readiness와 Compose skeleton | 두 artifact의 독립 build/boot, health/readiness, config isolation과 rollback target 검증 | planned / not_started |
| G2 | stable subject, issuer, audience, JWKS/key strategy, auth error, Web/Mobile handoff와 product-neutral Gateway auth context 확정 | versioned contract tests, key/claim compatibility policy, fail-closed failure semantics와 RPL-27 State binding 완료 | planned / not_started |
| G3 | Account/Credential/OAuth/Token/Session/ProductClient와 schema/migration ownership을 Carelog에서 Identity로 추출 | behavior/data/security regression, exclusive writer, migration/rollback evidence와 Carelog coupling 제거 | planned / not_started |
| G4 | Gateway + Identity + Carelog login/refresh/revocation/rollback E2E와 production cutover readiness | old/new token coexistence, rollback rehearsal, observability와 no-dual-writer evidence | planned / not_started |
| G5 | Finance가 product-neutral authentication consumer로 활성화 | Identity DB direct access 없음, local token validation, Finance-owned authorization와 end-to-end evidence | planned / not_started |

Gate와 Jira issue는 같은 단위가 아니다. RPL-52는 G0의 근거다. RPL-53·RPL-54는
G1~G3 책임을 Gate별로 나눠 수행해야 하며, 한 Ticket에 여러 Gate를 섞어도 Exit
Evidence를 합치지 않는다. RPL-27의 State/Product Client binding은 G2에서 완료하고
G3 extraction에 포함한다. RPL-55는 G4 Carelog cutover evidence를 소유한다.

Finance Domain과 Backend Foundation 개발은 G1 이후 병행할 수 있고, G2 contract가
고정되면 Finance Identity adapter의 contract-test 개발도 병행할 수 있다. 다만 Shared
Identity Runtime을 실제 Consumer로 활성화하고 production-ready라고 주장하는 것은 G4
통과 뒤 G5에서만 허용한다.

RPL-4 / PR #34 기능을 RPL-53에서 새로 중복 구현하지 않는다. G3는 merged baseline과
적용 가능한 pending delta를 구분해 최종 추출 기준을 확정한다.

## 10. Behavior-preserving Extraction

G3의 기본 원칙은 위치와 소유권을 바꾸되 관찰 가능한 동작을 의도적으로
바꾸지 않는 것이다.

- Route, Public / Protected behavior, JWT 처리와 Rate Limit의 기준을 먼저 고정한다.
- Auth/OAuth/Token/Principal, OAuth State와 Persistence behavior를 먼저 고정한다.
- 새 기능 변경은 추출과 분리한다.
- RPL-4 / PR #34처럼 이미 존재하는 pending delta는 출처와 상태를 보존해 통합한다.
- Copy나 새 Process 기동만으로 Migration 완료를 선언하지 않는다.
- Contract, 데이터, 보안 Regression과 Consumer 전환 Evidence가 있어야 Gate를 닫는다.
- OAuth State/PKCE와 handoff code는 TTL과 atomic single-consume를 보장한다.
- Refresh rotation은 concurrent reuse를 검출하고, revocation은 idempotent하게 처리한다.
- network retry에서 at-most-once delivery를 가정하지 않는다. single-consume effect와
  retry-safe response semantics를 별도로 정의한다.
- Service 간 distributed transaction, Saga, Outbox 또는 Broker를 선제 도입하지 않는다.
  실제 cross-service invariant가 생기면 local transaction과 failure recovery contract를
  먼저 정의한 뒤 별도 Gate로 검토한다.

Extraction classification:

- MOVE_IDENTITY: PlatformAccount, PasswordCredential, ExternalIdentity, Identity
  repository/service/credential ports, OAuth provider/state/PKCE, RefreshToken/TokenSession,
  Product Client Registry와 generic access-token issuance
- MOVE_GATEWAY: carelog-gateway executable/filter/config와 최소 blacklist read boundary
- STAY_CARELOG: Carelog User/Profile, UserRepository, Organization, Customer, Timeline,
  Relation과 product-specific authorization
- TRANSITIONAL: CRMIdentityProjectionPort, LegacyCrmIdentityProjectionAdapter,
  GatewayHeaderAuthFilter/GatewayUserDetails, organizationId/role/publicId claims,
  users.account_id/legacy user_id/password mirror와 Carelog-specific Kakao namespace

RPL-27은 duplicate Ticket을 만들지 않고 G2 contract와 현재 Carelog State binding을
완료한 뒤 G3 extraction input으로 승격한다.

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

### 11.1 Mandatory Decision Timing

| Blocker | Latest mandatory Gate | Required decision or evidence |
|---|---|---|
| platform-services repository identity | G0 before G1 | `ranikun-labs/platform-services`, `gateway-app`, `platform-core/identity` ownership 승인 |
| issuer / audience / JWKS | G2 before G3 | exact issuer/audience validation, signing/JWKS rotation, unknown-key failure와 compatibility policy |
| Web/Mobile session/token handoff | G2 before G3; E2E at G4 | channel별 token exposure, cookie/exchange-code, TTL, replay와 error contract; production evidence는 G4 |
| Identity schema/migration ownership | G3 entry | schema/role/migration owner, exclusive writer, backfill/reconciliation과 rollback authority |
| Carelog-specific JWT claim separation | G2 before G3 | stable subject와 product-neutral claim 분리, transitional claim owner/version/retirement window |
| product-neutral Gateway auth context | G2 before G3 | spoofed header stripping, signed/attested context, versioning, downstream validation과 fail-closed behavior |
| rollback / old-new token coexistence | G4 before cutover | bounded trust window, key/issuer coexistence, session/revocation compatibility, rollback rehearsal와 old-path retirement gate |

요청한 A/B/C 분류는 다음과 같다.

- A — Runtime Foundation 전: repository identity와 두 Process/Data placement boundary.
  G0에서 모두 결정됐으므로 G1 blocker는 없다.
- B — Carelog Auth 코드 이동 전: issuer/audience/JWKS, Web/Mobile handoff contract,
  schema/migration owner, Carelog claim 분리, product-neutral Gateway context와 RPL-27.
  G2 exit 및 G3 entry에서 강제한다.
- C — Production Cutover 전: old/new token·session coexistence, 실제 Web/Mobile E2E,
  rollback rehearsal, observability와 old-path retirement. G4에서 강제한다.

따라서 G1 Runtime Foundation을 막는 미결정 Blocker는 없다. G1에서는 identity business
code, production key, data migration과 traffic cutover를 넣지 않는다. G2·G3·G4의
필수 결정을 앞 Gate로 당겨 증거 없이 우회하는 것도 허용하지 않는다.

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
- G1~G5 구현 Owner가 Repository·Process·Module·Data·Migration 경계를 추측하지 않는다.
- 새 Repository와 Runtime 운영 부담은 후속 Gate에서 실제 Evidence와 함께 발생한다.

## 14. Deferred and Follow-up Ownership

| Deferred scope | Follow-up owner / trigger |
|---|---|
| empty `platform-services` Runtime Foundation | G1 implementation workflow; Gateway/Identity business code 제외 |
| Identity/Gateway Contract와 OAuth State Product Client Binding | G2; existing RPL-27 완료 포함 |
| Gateway·Identity behavior-preserving extraction | G3; RPL-53·RPL-54 scope를 Gate별로 분리 |
| Carelog cutover and rollback evidence | G4 / RPL-55 |
| Finance Backend Domain/Foundation | G1 이후 병행 가능; Identity Consumer activation은 G5 |
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
DEC-059   identity-platform candidate replaced by created / empty platform-services target; implementation not_started
DEC-067   Decision Log projection of this ADR
RPL-52    G0 Architecture approval
RPL-53    Gateway 관련 G1 Foundation 및 G3 extraction scope
RPL-54    Identity 관련 G1~G3 scope; Gate evidence 분리
RPL-55    G4 Carelog cutover/regression
RPL-4     Existing Gateway behavior delta
RPL-27    G2 State/Product Client binding completion; G3 extraction input
RPL-50    Finance Backend는 병행 가능; Shared Identity activation은 G5
```
