---
title: Repository and Service Boundaries
status: draft
owner: product
last_reviewed: 2026-08-08
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0004
  - ADR-0009
  - ADR-0010
  - ADR-0012
  - ADR-0013
  - ADR-0017
source_inputs: []
---

# Repository and Service Boundaries

## 1. 문서 목적

이 문서는 `oh-my-ai` 제품군의 논리적 도메인 경계와 목표 Git Repository, 배포 단위, 데이터 소유권을 정의한다.

다음 질문에 대한 기준을 제공하는 것이 목적이다.

1. Development Harness와 Finance Harness를 같은 코드베이스에 둘 것인가
2. Local Runtime과 Cloud Control Plane을 어떻게 분리할 것인가
3. 인증·인가를 각 제품에 포함할 것인가, 공통 경계로 둘 것인가
4. Shared Platform과 Shared Core가 별도 Microservice를 의미하는가
5. 제품별 데이터와 공통 데이터를 누가 소유할 것인가
6. 제품 내부를 처음부터 Microservice로 분할할 것인가
7. 어떤 조건에서 새로운 Repository 또는 Service를 분리할 것인가
8. Public Repository와 Private Planning Repository에는 무엇을 보관할 것인가

이 문서는 목표 책임 경계를 정의한다.

이 문서에 등장하는 모든 Repository와 Service가 현재 이미 구현됐거나 배포됐다는 의미는 아니다. 실제 구현 상태는 각 Repository 검수 결과와 구현 문서에서 별도로 관리한다.

---

## 2. 문서 적용 범위

이 문서는 다음 세 수준을 구분한다.

```text
1. Logical Boundary
   - 도메인 책임
   - 공통 Vocabulary
   - Contract와 의존 방향

2. Repository Boundary
   - Source Code와 Release 소유권
   - Public / Private 경계

3. Deployment Boundary
   - 독립 Process 또는 Service
   - 장애, 보안, Scaling 경계
```

논리적으로 분리됐다고 해서 즉시 별도 Repository나 Network Service를 만들어야 하는 것은 아니다.

반대로 별도 Repository라고 해서 반드시 독립 Microservice인 것도 아니다.

---

## 3. 현재 상태와 목표 아키텍처

### 3.1 현재 상태

현재 실제 존재 여부와 구현 수준은 각 Repository 검수 결과를 기준으로 판단한다.

확인되지 않은 Repository와 Service를 구현 완료 상태로 간주하지 않는다.

현재 확정된 것은 다음이다.

```text
- 제품과 Domain의 책임 경계
- Development와 Finance의 형제 관계
- Local Runtime과 Cloud Control Plane의 분리 원칙
- Identity의 독립 논리 경계
- Commerce의 독립 논리 경계
- Identity와 Commerce의 동급 관계
- 제품별 데이터 소유 원칙
- 각 서버 내부 Modular Monolith 우선 원칙
- Gateway·Identity physicalization Target과 G1→G4 순서 (`ADR-0017`)
```

현재 Gateway와 Auth/OAuth/Identity 관련 구현 Host는
`ranikun-labs/carelog-be`다. `ranikun-labs/platform-services`는
`planned / not_created` Target이며 독립 Shared Runtime은 아직 없다.

### 3.2 목표 아키텍처

제품과 논리적 책임 경계는 다음과 같다.

```text
Product Ecosystem
├── oh-my-ai
│   └── Development Harness Local CLI / Runtime
│
├── oh-my-ai-control-plane
│   └── V2 Managed Workflow Control Plane
│
├── finance-harness
│   └── Finance Product Backend / Runtime
│
├── Shared Identity
│   └── Account / Credential / Authentication / Token / Session
│
├── Shared Commerce
│   └── Product Membership / Subscription / Billing / Payment / Entitlement / Quota
│
├── finance-harness-docs
│   └── Finance Lens / PolicyGuard / Fixture
│
├── harness-private-docs
│   └── Product Planning / Architecture / ADR / Roadmap
│
└── carelog
    └── Carelog Product Service (기존 존재, Auth Phase A 논리 분리 단계)
```

Shared Identity와 Shared Commerce는 동급의 독립 논리 경계다.
어느 한쪽도 다른 쪽의 하위 Module이 아니다.

`carelog`는 다른 항목과 달리 목표 상태가 아니라 이미 존재하는 Product Service다 (`DEC-059`). 세부는 §7.7을 따른다.

Repository 이름은 향후 브랜드 결정에 따라 변경할 수 있다.

Identity는 `ADR-0017`에 따라 Gateway와 함께 제한적으로 물리화가 승인됐지만
구현은 `not_started`다. Commerce의 물리 Server, Repository, Database와 Deployment는
계속 승인하지 않는다.

### 3.3 핵심 물리화 원칙

```text
제품 수준
= Multi-repository target
= Coarse-grained deployment boundary

각 서버 Repository 내부
= Modular Monolith first

Shared Platform
= 현재 Logical Contract Boundary

Shared Core
= 공통 Vocabulary와 Contract
≠ 즉시 구현할 shared-core-service
```

---

## 4. 논리적 제품 구조

논리적 구조는 다음과 같다.

```text
Shared Platform
├── Cross-version Shared Core
├── V2+ Commercial Capabilities
├── Managed Workflow Capabilities
├── Development Extension
└── Finance Extension
```

이 구조는 DDD의 Bounded Context와 의존 방향을 나타낸다.

다음 상하 구조를 의미하지 않는다.

```text
Development Harness
└── Finance Harness
```

정확한 관계는 다음과 같다.

```text
Shared Platform
├── Development Extension
└── Finance Extension
```

의존 방향:

```text
Development → Shared Platform Contract
Finance → Shared Platform Contract

Development ↛ Finance
Finance ↛ Development
```

---

## 5. Shared Platform의 현재 의미

Shared Platform은 현재 별도 Repository나 Network Service가 아니다.

현재는 다음을 정의하는 논리적 Contract Boundary다.

```text
WorkItem / Request
Run
Result
Parent–Child Relationship
Status
Human Review
Policy
Provenance
Truthfulness Classification
Adapter Contract
Capability Contract
Candidate / Promotion Contract
```

각 Extension은 공통 개념을 자기 도메인에 맞게 구현한다.

```text
Development
- DevelopmentTask
- ExecutionRun
- ResultArtifact

Finance
- AnalysisRequest
- LensRun
- ChecklistResult
- ReviewRecord
```

Finance는 다음 Development 전용 구현을 직접 사용하거나 상속하지 않는다.

```text
oh-my-ai CLI 내부 구현
Repository
Branch
Commit
Git Worktree
Diff
Writer Lease
Agent Process
Development Session Resume
Development Validation Model
```

### 5.1 초기 구현 원칙

V1과 초기 V2에서는 각 Extension이 공통 개념을 자기 도메인 내부에 구현할 수 있다.

이 단계에서는 공통 이름이 있다는 이유만으로 다음을 만들지 않는다.

```text
shared-core-service
shared-platform-service
shared-database
shared-contracts repository
```

### 5.2 공통 Contract 추출 조건

다음 조건이 실제로 확인된 이후에만 공통 Package 또는 Repository 추출을 검토한다.

1. 둘 이상의 제품이 동일한 Contract를 실제 사용
2. 수동 복사로 인한 Drift 발생
3. Version Compatibility 관리 필요
4. 독립 Release 필요
5. OpenAPI, JSON Schema 또는 Package 배포 가치가 있음

추출 후보:

```text
shared-contracts repository
Maven package
npm package
OpenAPI specification
JSON Schema package
```

### 5.3 Shared Platform Service 추출 조건

다음 요구가 확인된 경우에만 별도 Service 추출을 검토한다.

- Development와 Finance가 동일한 Managed Workflow를 실제 사용
- 독립적인 Scaling과 장애 격리가 필요
- 공통 Task Graph 또는 Review Workflow가 필요
- 독립 운영 주기와 소유 팀이 생김
- 두 제품이 동일 API에 의존할 필요가 있음

---

## 6. Cross-version Shared Core와 버전별 구현 수준

Cross-version Shared Core는 공통 Vocabulary와 Contract를 의미한다.

모든 버전에서 동일한 데이터베이스 Entity를 구현하라는 의미가 아니다.

### 6.1 V1

V1은 무료 Local Artifact Workflow다.

```text
Work-start
→ Structured Handoff Markdown
→ 사용자의 수동 전달
→ Claude Code / Codex 실행
→ Result Basic Markdown
→ Human Review
```

V1에서 Shared Core 개념은 Markdown Artifact와 Local Metadata에 투영된다.

예:

```text
WorkItem / Request
→ Handoff의 Goal, Scope, Constraints

Run
→ 수행한 작업과 명령 기록

Result
→ Result Basic 문서

Human Review
→ 사용자의 수동 Accept / Edit / Reject

Provenance
→ Confirmed Fact, Assumption, Evidence

Truthfulness
→ Verified, Not Verified, Blocked, Remaining Risk
```

V1은 다음을 요구하지 않는다.

```text
관리형 WorkItem ID
Task Lifecycle
ExecutionRun Entity
ResultArtifact ID
Lifecycle State Machine
Database Persistence
Cloud Synchronization
SessionBinding
ExecutionWorkspace
```

### 6.2 V2

다음 개념들이 ID와 상태를 가진 Managed Entity로 승격되는 것은 V2부터다.

```text
WorkItem / Task
SessionBinding
ExecutionRun
Optional ExecutionWorkspace
ResultArtifact
HumanReview
```

따라서 다음은 서로 다른 구현 수준이다.

```text
V1 Handoff / Result
= 사람이 전달하고 검수하는 Markdown Artifact

V2 Task / Run / Result
= ID, Persistence, Status를 가진 Managed Entity
```

V1 구현에 V2 관리형 Lifecycle을 선행 도입하지 않는다.

---

## 7. Repository별 책임

### 7.1 `oh-my-ai`

#### 역할

Development Harness의 Local CLI와 Runtime을 소유한다.

```text
oh-my-ai
├── Local CLI
├── Instruction Cascade
├── Skill Registry
├── Basic Routing
├── Prompt Routing Hook
├── Work-start
├── Structured Handoff
├── Result Basic
├── Runtime Adapter
├── Capability Metadata
├── Execution Policy Projection
├── Local Context
└── V2 Local Execution Runtime
```

#### 주요 책임

- 사용자 Repository와 Local Context 접근
- Claude Code, Codex 등 Local Runtime Adapter 연동
- Prompt 또는 Task Artifact 전달
- Local Execution Policy 집행
- Git, Worktree와 Agent Process 조작
- Diff와 Validation 수집
- Secret Redaction
- Result Artifact 생성
- Cloud 전송 전 정책 확인

#### 소유하지 않는 책임

- 사용자 계정 원장
- Authentication 원장
- Billing
- Subscription
- Cloud Task Graph
- Cloud Ranking
- Cloud Result Evaluation
- Finance Lens
- 투자 기록
- Finance PolicyGuard
- Organization Governance

#### 배포 형태

`oh-my-ai`는 네트워크 Microservice가 아니다.

다음 중 하나 이상의 Local 설치물로 배포될 수 있다.

```text
CLI
Local Package
Desktop Component
Optional Local Sidecar
```

Sidecar는 초기 V2의 필수 구성요소가 아니다.

### 7.2 `oh-my-ai-control-plane`

#### 역할

V2 Pro의 Managed Workflow Control Plane을 소유한다.

목표 Repository 이름은 임시 명칭이며 변경할 수 있다.

초기 서버 구현은 Modular Monolith로 시작한다.

```text
oh-my-ai-control-plane
├── task
├── session-binding
├── execution-metadata
├── result
├── human-review
├── development-commercial
├── managed-routing
├── managed-evaluation
└── approval
```

#### 주요 책임

다음 목록은 Dev Harness Cloud의 장기 논리 소유권을 나타내며,
기존 V2/V3 제품 배치를 변경하지 않는다.

- Development Task Identity
- Workspace와 Project
- Execution
- Approval
- Harness Policy
- Cloud History
- Parent–Child Task 관계
- SessionBinding Metadata
- ExecutionRun Metadata
- ResultArtifact Metadata
- Human Review 상태
- Task Linking Candidate
- Context 및 Skill Ranking Candidate
- Runtime Recommendation
- Conflict Detection
- Result Review Candidate
- Approval Queue
- Task Graph
- 후기 Learning Candidate

#### Local Runtime과의 경계

Control Plane은 사용자의 Local Repository를 직접 실행 환경으로 사용하지 않는다.

기술 문서에서의 책임 표현:

```text
Cloud
= Managed Workflow의 연결·선별·추천·평가 후보 생성과 조율
= Authentication, Metadata Persistence, Billing 등 서버 기능 수행 가능

Local
= 사용자 권한, 데이터 경계와 Domain Execution Policy 집행
= 실제 코드·도구·Repository 실행

Human
= 민감한 실행 승인
= 생성된 Artifact Accept / Edit / Reject
```

제품 슬로건:

```text
Cloud recommends and coordinates.
Local enforces and executes.
Human authorizes and accepts.
```

Cloud가 생성한 판단은 최종 Truth가 아니다.

```text
Task Linking Candidate
Context Candidate
Runtime Recommendation
Result Review Candidate
Memory Candidate
Skill Candidate
```

#### Shared Platform과의 관계

초기 V2 구현에서 Platform-neutral Module과 Development 전용 Module이 같은 Repository에 존재할 수 있다.

그러나 다음 의존 방향을 지켜야 한다.

```text
platform-neutral module
↛ development-specific module

development-specific module
→ platform-neutral module
```

Finance가 Control Plane 기능을 사용해야 할 경우 Development 전용 API나 내부 Package를 직접 사용하지 않는다.

다음 중 하나를 사용한다.

```text
Domain-neutral Contract
Public API
별도 Platform Adapter
향후 추출된 Shared Platform Service
```

`oh-my-ai-control-plane`이 Shared Platform 전체의 영구적 물리 소유자라고 가정하지 않는다.

### 7.3 `finance-harness`

#### 역할

`finance-harness`는 아직 물리화되지 않은 Finance Product Backend / Runtime의
목표 Repository다. 향후 이 Backend는 Finance Product의 Architecture,
API Contract 구현, Domain 구현, Persistence / Migration, Runtime Evidence와
Operational Evidence를 소유한다.

```text
finance-harness
├── analysis
├── context-snapshot
├── lens
├── policy-guard
├── checklist
├── journal
├── review
└── finance-commercial
```

#### 주요 책임

- AnalysisRequest
- ContextSnapshot
- LensRun
- PolicyGuardRun
- ChecklistResult
- JournalCandidate
- Journal 저장
- ReviewRecord
- Finance Domain 데이터와 Migration
- Finance Domain Audit
- Runtime과 Operational Evidence

#### 소유하지 않는 책임

`finance-harness`는 canonical Finance Product Policy 또는 canonical Launch
Experiment Values를 소유하지 않는다.

```text
Finance Product Policy 원문
Launch Experiment Values 원문
Product / Legal / Operations 정책 원문
```

이 항목의 canonical owner는 `finance-harness-docs`다. Backend Architecture와
구현은 해당 Product Policy를 source input으로 참조하며, 상태·원칙·값을
복제하거나 재정의하지 않는다.

#### Development와의 경계

Finance는 Development Harness 위에서 실행되는 하위 Module이 아니다.

Finance는 다음 개념을 상속하지 않는다.

```text
Repository
Branch
Commit
ExecutionWorkspace
Git Worktree
Diff
Writer Lease
Agent Process
Development Validation
```

Finance가 공유하는 것은 공통 Contract와 안전 원칙이다.

```text
Request
Run
Result
Parent–Child
Human Review
Policy
Provenance
Candidate / Promotion
Entitlement Check
```

#### 배포 경계

Finance는 Development Control Plane과 별도 배포 가능한 제품 경계다.

Finance 장애와 배포가 다음에 직접 영향을 주지 않아야 한다.

- V1 Local Workflow
- Development Local Runtime
- Development Managed Workflow

### 7.4 Shared Identity

**명칭 주의 (`DEC-059`, `DEC-067`):** 이 서비스의 canonical 논리 서비스명은
`Shared Identity`다. 기존 `identity-platform` 후보는 `DEC-067`로 부분 대체됐으며,
물리 Target은 planned `ranikun-labs/platform-services`의 `platform-core/identity`다.

#### 역할

여러 제품이 공유할 수 있는 Account와 Authentication 기반을 소유하는
미래의 독립 논리 경계다.

```text
Shared Identity
├── account
├── credential
├── authentication
├── token
└── session
```

#### 주요 책임

- Account
- Credential 관리
- Login / Logout과 Authentication
- Access / Refresh Token
- Session
- 안정적인 사용자 식별자
- 인증 관련 보안 정책

#### Shared Commerce와의 경계

Shared Identity는 Product Membership, Payment, Entitlement를 소유하지 않는다.

```text
Shared Identity
= 사용자가 누구인가
= 인증됐는가

Shared Commerce
= Product Membership
+ Subscription
+ Billing
+ Payment
+ Entitlement
+ Quota
```

#### 논리 경계와 물리화 시점

Shared Identity의 독립 논리 경계는 채택한다.

Finance Harness가 두 번째 실제 Product Consumer가 됨에 따라 물리 분리 Trigger는
충족됐고 `ADR-0017`이 Target Repository와 Process를 승인했다. Repository와 Runtime은
아직 생성·구현되지 않았으며 RPL-54 전에는 추출 완료를 주장하지 않는다.

Shared Identity 구현은 V1 또는 V2 Local Invocation PoC의 선결 조건이 아니다.

이미 재사용 가능한 Auth Server가 존재한다면 별도 경계를 그대로 사용한다.

독립 Auth Server가 아직 없다면 Local Invocation PoC를 위해 임시 Local Identity 또는 Test Identity를 사용할 수 있다.

PoC를 이유로 Product Domain과 Identity 책임을 영구적으로 합치지는 않는다.

#### Shared Commerce

Shared Commerce는 여러 제품이 공유할 수 있는 상업 기능의
미래 독립 논리 경계다.

```text
Shared Commerce
├── product-membership
├── subscription
├── billing
├── payment
├── entitlement
└── quota
```

Shared Commerce는 Shared Identity의 하위 Module이 아니다.

별도 Server, Repository, Database와 Deployment는 승인하지 않는다.

다음 조건이 실제로 확인된 뒤에만 물리 분리를 검토한다.

- 둘 이상의 제품이 동일한 Commerce 책임을 실제 사용
- 공통 Subscription·Billing·Entitlement·Quota 운영 필요
- 독립 보안·장애 격리·Scaling 필요
- 독립 Release 또는 소유 팀 필요

### 7.5 `finance-harness-docs`

#### 역할

Finance Domain의 지식·정책·검증 Artifact와 Finance Product Service Policy의
canonical 문서를 관리한다.

```text
finance-harness-docs
├── Core Rules
├── Safety
├── Runtime Contract
├── Core Analysis Lenses
├── Asset Class Lenses
├── Domain Deep-Dive Lenses
├── Catalog
├── Routing
├── Fixtures
├── Regression
├── Finance Product Policy
├── Launch Experiment Values
├── Product / Legal / Operations
└── Professional Standards / Human Review Protocol
```

Finance Lens, PolicyGuard, Catalog, Routing, Fixture, Regression,
Professional Standards와 Human Review 계약의 문서 Source of Truth는
이 Repository다.

`service-policy/finance-product-policy.md`는 불변 Finance Product 원칙의
canonical source이며,
`service-policy/finance-launch-experiment-values.md`는 가변 Launch
Experiment Values의 canonical source다. `service-policy/README.md`는
Finance Product Policy의 canonical entry point다.

다만 Repository 배치 또는 문서 존재만으로 Runtime 활성화를 의미하지 않는다.
각 Artifact의 `lifecycle_status`, `implementation_status`,
`runtime_loadable`, `routable`, `fixture_refs`와 `activation_gate`가
실제 사용 가능 상태를 결정한다.

#### 소유하지 않는 책임

- 전체 제품 V1/V2/V3 전략
- Development Harness 구현
- 공통 Identity 구현
- 전체 Cloud Control Plane 구조
- 전체 상품화 전략
- Backend Runtime, API Implementation, Database Migration
- Runtime Evidence, Deployment, Operational Runtime Configuration

#### 미래 Finance Backend와의 참조 관계

향후 `finance-harness` Backend의 Architecture와 구현은
`finance-harness-docs`의 canonical Finance Product Policy를 source input으로
참조한다. Backend 구현 문서는 Product Policy의 상태·원칙·값을 재정의하지
않는다.

Private Planning Repository는 Finance와 Shared Platform 사이의 제품 경계와 의존 관계를 관리한다.

### 7.6 `harness-private-docs`

#### 역할

제품군 전체의 Durable Product Source of Truth를 관리한다.

```text
harness-private-docs
├── Product Architecture Master
├── Product / Technical Roadmap
├── Repository / Service Boundary
├── Shared Core / Extension Boundary
├── Local / Cloud / Human Boundary
├── ADR
├── Decision Log
├── Session Handoff
└── Accepted Source Input
```

원칙:

```text
Chat Session
= Working Context

Git Planning Repository
= Durable Product Decision

Notion
= Dashboard / Link Index
```

Finance Lens 원문이나 실제 서비스 코드를 이 Repository에 복사하지 않는다.

---

### 7.7 `carelog`

**등록 근거:** `DEC-059` (accepted, 2026-07-26)

#### 역할

Carelog Manager가 사용하는 CRM 성격의 Product Service다. 다른 목표 Repository와 달리 이미 존재하고 운영 중인 제품이며, 목표 아키텍처가 아니라 현재 상태로 이 지도에 등록됐다.

```text
carelog
├── manager-profile
├── organization / workspace
├── crm-customer
├── customer-timeline
└── follow-up / handoff
```

#### 주요 책임

- Manager Profile
- Organization / Workspace
- CRM Customer, Customer Timeline
- Follow-up / Handoff Workflow
- Carelog 전용 Role / Permission / Consent

#### 현재 상태 — Auth Phase A

```text
Auth Phase A
= Carelog 내부에서 Manager 계정·인증 관련 모듈을
  논리적으로 분리하는 단계

Shared Identity로의 물리 분리
= 아직 착수하지 않음
```

Auth Phase A 동안 Carelog는 계정·자격증명 모듈을 일시적으로 자체 보유할 수 있다. 이는 `docs/architecture/backend-service-foundation/service-boundaries.md` §9 "Transitional state"가 정의하는 전환기 상태와 같은 성격이며, 목표 경계(Shared Identity가 PlatformAccount/Credential/Session을 소유)는 그대로 유지한다.

#### Identity와의 경계

```text
CRM Customer != Identity User
```

Carelog Manager는 Shared Identity 계정과 연결될 수 있으나, Carelog CRM Customer는 기본적으로 Platform Login Principal이 아니다. 기존 CUSTOMER 전체를 Platform Account로 Backfill하는 설계는 채택하지 않는다.

#### 소유하지 않는 책임

- Shared Identity 계정 원장 (물리 분리 이후에는 Shared Identity가 소유)
- Finance Domain 데이터

#### Phase 타임라인과의 관계

Carelog Auth Phase A는 §16 "단계별 물리화 전략"의 oh-my-ai V1/V2/V3 Phase 1-5 타임라인에 포함되지 않는다. Carelog는 그 타임라인이 다루는 미래 지향적 물리화 대상이 아니라 이미 존재하는 별도 Product이므로, 현재 상태는 §16 뒤에 별도 항목으로 기록한다.

#### 배포 형태

기존 독립 Repository로 존재한다. 이번 등록은 신규 Repository 생성을 의미하지 않는다.

---

## 8. Local Invocation PoC Identifier

V2 Local Invocation PoC에서 사용할 수 있는 `ohmy_session_id`는 로컬 Correlation Identifier다.

목적:

```text
Local Task
↔ Local Execution
↔ Provider Metadata
↔ Local Result
```

이 Identifier는 Auth와 Cloud Metadata 도입 전에는 다음 의미를 갖지 않는다.

```text
영구 Session Identity
Cross-device Session Identity
Cloud-managed SessionBinding
사용자 계정 귀속 Identity
전역적으로 유일한 Business Identity
```

권장 PoC 표현:

```text
local_correlation_id
experimental_session_reference
local_execution_reference
```

기존 명칭을 `ohmy_session_id`로 유지하더라도 의미는 Local Correlation으로 제한한다.

정식 SessionBinding과 영구 Identity 모델은 V2 Managed Workflow 설계에서 정의한다.

---

## 9. 목표 배포 구조

다음은 장기 목표 Deployment Unit이다.

```text
Target Repository and Deployment Units
├── Carelog CRM Server
├── Finance Harness Server
├── Dev Harness Cloud Server
├── AI Runtime Server
└── ranikun-labs/platform-services           planned / not_created
    ├── gateway-app                          independent SCG / WebFlux process
    └── platform-core                        independent Spring MVC process
        ├── identity                         ACTIVE target
        ├── commerce                         DEFERRED
        └── audit                            DEFERRED
```

목표 Deployment Unit은 즉시 구현, Repository 생성,
Database Provisioning 또는 배포 승인을 의미하지 않는다.

Carelog CRM Server는 기존 Product Service이며 현재 Gateway와 Auth/OAuth/Identity의
Implementation Host다. Shared Gateway·Identity 추출은 RPL-53·RPL-54의
`planned / not_started` 작업이다.

### 핵심 규칙

1. Dev Harness V1 Local Core는 Shared Identity·Commerce·Audit·Cloud AI Runtime에 의존하지 않는다.
2. Dev Harness Cloud는 실제 Cloud 기능 개발 시점까지 구현을 유예한다.
3. Commerce는 실제 유료화 전까지 구현을 유예할 수 있다.
4. Audit는 현재 미구현 `platform-core` Module 후보이며 별도 Process는 승인되지 않았다. 향후 NATS consumer 추출은 새 Trigger와 Decision이 필요하다.
5. Identity·Commerce·Audit는 같은 Deployment Unit에서도 코드·데이터·Migration 소유권을 분리한다.
6. AI Runtime은 Provider 실행·Routing·Retry·Fallback·Token/Cost Metering·Trace를 담당한다.
7. 제품별 Prompt·Policy·Context Schema·Evaluation은 각 Product Server가 소유한다.
8. 기존 V2 Personal Managed Workflow와 Workspace·Organization의 V3 배치를 변경하지 않는다.

### 9.1 AI Runtime 책임

AI Runtime Server가 소유:

```text
Provider Execution
Runtime Routing
Retry
Fallback
Token / Cost Metering
Runtime Trace
```

Product Server가 소유:

```text
Product Prompt
Product Policy
Product Context Schema
Product Evaluation
Domain Decision
```

### 9.2 platform-services Process와 platform-core Module 경계

```text
platform-services
├── gateway-app              independent process
└── platform-core            independent process
    ├── identity             ACTIVE target
    ├── commerce             DEFERRED
    └── audit                DEFERRED
```

하나의 Repository라는 이유로 두 Process를 합치지 않는다. `platform-core`가
one-process modular monolith로 시작해도 Module 간 Entity 공유, Repository 직접 접근,
Table 직접 수정이나 Migration 소유권 공유를 허용하지 않는다.

---

## 10. 데이터 소유권

### 10.1 PostgreSQL 목표 배치

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

이 구조는 목표 논리 배치이며 `shared_services_db`는 실제 Database 이름이 아닌 예시명이다.
실제 Cluster, Database, Schema 생성은 구현 시점의 별도 승인 대상이다.

| Logical Database / Schema | Data Source of Truth | Migration Owner |
|---|---|---|
| `carelog_db` | Carelog CRM Server | Carelog CRM |
| `finance_db` | Finance Harness Server | Finance Harness |
| `dev_cloud_db` | Dev Harness Cloud Server | Dev Harness Cloud |
| `ai_runtime_db` | AI Runtime Server | AI Runtime |
| `shared_services_db.identity` | Shared Identity Module | Shared Identity Module |
| `shared_services_db.commerce` | Shared Commerce Module | Shared Commerce Module |
| `shared_services_db.audit` | Shared Services Audit Module | Shared Services Audit Module |

### 10.2 Shared Identity 논리 데이터

논리 소유자: Shared Identity

```text
account
credential
authentication session
access token
refresh token
```

### 10.3 Shared Commerce 논리 데이터

논리 소유자: Shared Commerce

```text
product membership
subscription
billing
payment
entitlement
quota
```

### 10.4 Development Control 데이터

소유자: `oh-my-ai-control-plane`

```text
workspace
project
development task
parent-child task
session binding metadata
execution run metadata
result artifact metadata
human review
approval state
approval
harness policy
cloud history
managed recommendation
```

다음은 기본 Cloud 소유 데이터가 아니다.

```text
Repository 전체 원문
전체 Diff
Secret
Redaction 전 Terminal Output
전체 Prompt
```

### 10.5 Finance 데이터

소유자: `finance-harness`

```text
analysis request
context snapshot
lens run
policy guard run
checklist result
journal
review record
finance usage
```

Finance 데이터의 동의, 수집 최소화, 보존, 삭제, 접근 통제와 감사 정책은
`finance-harness-docs`의 Product / Legal / Operations 계약이 정의한다.

`finance-harness`는 해당 정책을 Runtime과 저장 계층에서 집행하고,
삭제 결과, 접근 이력, PolicyGuard 위반과 주요 Audit Evidence를
Finance Domain 데이터로 보관한다.

Finance 데이터는 이러한 정책과 집행을 전제로 Cloud에 저장될 수 있다.

Development Repository의 Local-first 원칙을 Finance 기록에 기계적으로 적용하지 않는다.

### 10.6 데이터베이스 원칙

Deployment Unit별 Source of Truth와 Migration 소유권을 분리한다.

```text
같은 Physical Cluster
≠ 같은 Data Owner
≠ Cross-service Table Access 허용
≠ Cross-service Transaction 허용
```

금지:

- 다른 서비스 Database 직접 접속
- Cross-service Foreign Key
- OLTP Cross-service JOIN
- 같은 Database에 있다는 이유로 Module 경계 우회
- 소유 Module 외 Migration 실행

다른 서비스 데이터는 API, Token Claim, Event, Projection으로 소비한다.

Analytics와 운영 리포팅의 Cross-product 결합은
별도 Read Model 또는 ETL 경로에서 수행한다.

별도 PostgreSQL Cluster는 트래픽, 장애 격리, 규제, 보존정책,
Backup·Restore 또는 운영 조직 분리가 실제로 필요할 때만 검토한다.

### 10.7 Carelog 데이터

소유자: `carelog`

```text
manager profile
organization / workspace
crm customer
customer timeline
follow-up / handoff
```

Carelog는 Auth Phase A 기간 동안 계정·자격증명 관련 모듈을 내부에 일시 보유할 수 있으나, 목표 소유권은 §7.7과 동일하게 Shared Identity(§7.4, §10.2)가 계정 원장을 소유한다.

`CRM Customer != Identity User` — CRM Customer 데이터는 기본적으로 Shared Identity 데이터가 아니다.

---

## 11. 서비스 간 통신 원칙

### 11.1 Identity 연동

기본 방식:

```text
Client
→ Shared Identity에서 인증
→ Access Token 발급
→ Product Service가 Token 검증
```

Product Service는 다음 중 하나를 사용할 수 있다.

- 공개키 기반 JWT 자체 검증
- Token Introspection
- Identity API
- Service-to-Service Credential

제품 요청마다 Identity Database를 직접 조회하지 않는다.

위 항목은 연동 방식 후보이며 JWT Claim의 구체 형식은 이 문서에서 정의하지 않는다.

### 11.2 Local Runtime과 Control Plane

Transfer Mode:

```text
Local-only
Metadata-only
Reviewed Artifact
Redacted Context
Full Context Opt-in
```

권장 기본값:

```text
Metadata-only
또는
Reviewed Artifact
```

다음은 기본 전송 대상이 아니다.

```text
Repository 전체 원문
전체 Prompt
전체 Terminal Log
Diff
Secret
Redaction 전 결과
```

### 11.3 Finance와 Shared Platform

Finance가 Shared Platform 기능을 사용할 경우 Development 전용 API가 아닌 Domain-neutral Contract를 사용한다.

Cross-version Contract 후보:

```text
Request / Run / Result Contract
Human Review
Candidate / Promotion
```

V2+ Commercial Capability 후보:

```text
Entitlement Check
```

Managed Workflow Capability 후보:

```text
Managed Routing Candidate
```

허용하지 않는 의존:

```text
Git Worktree API
Repository Diff API
Development Writer Lease
Development Session Resume API
Development Agent Process API
```

### 11.4 Audit 책임

각 Product와 Service는 자기 Domain Audit Event의 의미와 생성 시점을 소유한다.

Shared Services Audit Module은 필요할 경우 다음을 담당할 수 있다.

```text
Central Storage
Integrated Query
Retention Policy
Audit Access Control
```

중요 업무 데이터와 Audit Event의 유실 방지는
서비스별 Local Outbox로 처리할 수 있다.

Shared Audit API를 업무 Transaction 안에서 동기 호출하도록 강제하지 않는다.

Audit Event는 Product Domain Entity에 물리 Foreign Key를 걸지 않고
opaque identifier를 저장한다.

중앙 Audit Module은 즉시 구현 대상이 아니며
실제 통합 검색·보존·감사 요구가 생겼을 때 활성화한다.

---

## 12. Public Repository와 Private Planning Repository의 경계

문서의 공개 여부는 V1/V2/V3 버전으로 결정하지 않는다.

다음 질문으로 판단한다.

```text
Public Interoperability Contract인가?
Private Business 또는 Internal Implementation인가?
```

### 12.1 Public `oh-my-ai`

Public Repository에는 최소한 다음을 유지한다.

```text
V1 공개 기능과 비범위
Handoff / Result 공개 Contract
Adapter / Capability Contract
Execution Policy
Privacy / Transfer Mode의 사용자-facing Contract
Extension 개발 규칙
Compatibility와 Version Policy
Public CLI 사용법
실제 OSS 구현 기준
```

V2 개념이라도 외부 Runtime, Extension 또는 Client가 호환을 위해 알아야 한다면 Public Contract로 공개할 수 있다.

### 12.2 Private Planning Repository

Private Repository에는 다음을 유지한다.

```text
가격과 수익화 전략
비공개 Product Priority
Cloud Ranking 내부 알고리즘
상세 Billing 전략
Provider 협상과 사업 의존성
핵심 IP 구현 상세
미공개 V2 / V3 Roadmap
내부 위험 평가
```

다음 기준은 사용하지 않는다.

```text
V1이므로 Public
V2이므로 Private
```

버전이 아니라 Contract 성격과 정보 민감도로 구분한다.

---

## 13. 각 Repository 내부 구현 원칙

멀티레포를 사용한다고 해서 각 Repository 내부를 즉시 Microservice로 세분화하지 않는다.

### 13.1 `oh-my-ai-control-plane`

```text
modules/
├── task
├── session
├── execution
├── result
├── review
├── development-commercial
├── platform-contract
└── managed-intelligence
```

### 13.2 `finance-harness`

```text
modules/
├── analysis
├── context
├── lens
├── policy-guard
├── checklist
├── journal
├── review
└── finance-commercial
```

### 13.3 Shared Java Platform Target (`ranikun-labs/platform-services`)

```text
platform-services                    planned / not_created
├── gateway-app                      Spring Cloud Gateway / WebFlux process
└── platform-core                    Spring MVC process
    ├── identity                     ACTIVE target
    ├── commerce                     DEFERRED
    └── audit                        DEFERRED
```

`identity`는 Account, External Identity, Auth/OAuth, Token/Principal,
Product Client Registry, OAuth State와 Identity-owned Persistence를 소유한다.
Commerce와 Audit 구현은 승인되지 않았다. Shared AI는 이 Repository 밖의 future
independent Python Runtime이다.

Module 간에는 명시된 Public Contract와 의존 방향을 적용한다.

단순히 Package를 분리한 것만으로 경계가 보장된다고 가정하지 않는다.

---

## 14. Repository 또는 Service 분리 기준

다음 조건 중 여러 개가 지속적으로 발생할 때 물리 분리를 검토한다.

| 기준 | 설명 |
|---|---|
| 독립 배포 | 다른 기능과 무관하게 배포해야 함 |
| 장애 격리 | 장애 전파를 차단해야 함 |
| 확장 패턴 | CPU·메모리·트래픽 특성이 크게 다름 |
| 보안 경계 | 접근 권한과 민감도가 다름 |
| 데이터 소유권 | 독립적인 원장과 Retention이 필요 |
| 변경 주기 | Release 주기가 크게 다름 |
| 팀 소유권 | 별도 팀이 운영 |
| 규제 | 법률·감사 요구가 다름 |
| 기술 스택 | 다른 Runtime이 명확히 유리 |
| 외부 고객 | 독립 상품 또는 API로 판매 |

다음 이유만으로 분리하지 않는다.

- MSA가 더 고급스러워 보여서
- Table 수가 많아서
- Module 이름이 다르기 때문에
- 미래에 언젠가 커질 수 있어서
- 공통 Interface가 하나 존재해서

---

## 15. 현재 채택하지 않는 구조

### 15.1 전체 제품 Monorepo

```text
one-repository/
├── local-runtime
├── control-plane
├── finance
├── identity
└── docs
```

현재 목표 구조로 채택하지 않는다.

이유:

- Public·Private 범위가 다름
- 제품별 Release 주기가 다름
- Finance의 보안·정책 경계가 다름
- Identity 소유권이 독립적임
- Local OSS와 Private Cloud를 분리해야 함

### 15.2 Shared Core Microservice

```text
shared-core-service
```

현재 채택하지 않는다.

공통 Vocabulary를 Network 호출로 강제하면 불필요한 결합과 장애 지점이 생긴다.

### 15.3 Finance를 Development Control Plane 하위에 배치

현재 채택하지 않는다.

Finance는 별도 제품, 데이터, 사용자 흐름, 법률 정책과 Release 주기를 가진다.

### 15.4 Auth·Billing·Entitlement를 각각 즉시 Microservice로 분리

현재 채택하지 않는다.

Identity와 Commerce의 논리 경계는 분리하지만,
V1 또는 Local PoC에 외부 플랫폼 구현을 선행하지 않는다.

실제 복수 소비자와 운영 요구가 확인된 후 물리 추출을 검토한다.

---

## 16. 단계별 물리화 전략

### Phase 1 — V1과 문서 기준화

```text
oh-my-ai
finance-harness-docs
harness-private-docs
```

목표:

- V1 Local Artifact Workflow 완료
- Durable Product Source of Truth 구축
- Finance Lens·PolicyGuard·Fixture 정리
- V2 Managed Entity 도입 전 Contract 확정

### Phase 2 — V2 Local Invocation PoC

```text
oh-my-ai
experimental control-plane component
local correlation metadata
```

목표:

- Local Task 또는 Input Artifact 생성
- Claude Code / Codex 초기 Prompt 전달
- Local Correlation Identifier 발급
- Provider Metadata 기록
- Result 수집
- Task와 Result 귀속
- Human Review

이 단계에서 Shared Identity 물리 구현은 필수가 아니다.

### Phase 3 — V2 Managed Workflow

```text
oh-my-ai
oh-my-ai-control-plane
optional Shared Identity / Shared Commerce integration
```

목표:

- Task Identity
- SessionBinding
- ExecutionRun
- ResultArtifact
- Metadata Sync
- Auth와 Device
- Entitlement
- Managed Candidate
- Human Review

### Phase 4 — Finance Product Physicalization

이 Phase 번호는 목표 Repository와 배포 경계의 물리화 순서를 나타낸다.

Finance Contract MVP, Finance Lens 정리와 Local Finance Experiment가
Development V2 전체의 완료를 기다려야 한다는 의미는 아니다.

Finance는 Development 전용 구현에 의존하지 않으며,
Finance Product에 필요한 Identity 또는 Domain-neutral Contract만 준비되면
독립적으로 구현을 시작할 수 있다.

```text
finance-harness
optional Shared Identity / Shared Commerce integration
optional domain-neutral platform capability
```

목표:

- AnalysisRequest
- LensRun
- PolicyGuard
- Checklist
- Journal
- Review
- Finance Entitlement

### Phase 5 — Shared Gateway·Identity Physicalization

Finance Harness가 두 번째 실제 Consumer가 되면서 Gateway·Identity 물리화 Trigger는
충족됐다. 전체 Shared Platform MSA가 아니라 아래 G1→G4만 승인한다.

```text
RPL-52 Foundation approval
→ RPL-53 Gateway extraction
→ RPL-54 Identity extraction
→ RPL-55 Carelog cutover / regression
```

그 뒤 기존 RPL-27을 새 Identity Reality로 재타기팅하고 RPL-50 Finance Backend를
진행한다. Commerce·Audit·Shared AI는 이 순서의 구현 범위가 아니다.

---

### Carelog — 현재 상태 (Phase 아님)

Carelog는 위 Phase 1-5 물리화 타임라인의 대상이 아니다. Phase 1-5는 아직 존재하지 않는 것을 미래에 만드는 순서인 반면, Carelog는 이미 존재하고 운영 중인 Product Service이기 때문이다.

```text
Carelog
= 기존 Product Service (§7.7)

현재 상태
= Auth Phase A (Carelog 내부 논리 분리)

Shared Gateway·Identity 물리 분리
= Architecture approved / implementation not_started

이번 등록(DEC-059)
= 신규 Carelog Repository 또는 Identity Repository 생성을 의미하지 않음
```

---

## 17. 불변조건

다음은 향후 구현에서 유지한다.

1. `oh-my-ai` Local Runtime과 Cloud Control Plane은 별도 배포 경계다.
2. Development와 Finance는 별도 Product와 Domain Extension이다.
3. Finance는 Development 전용 실행 모델에 의존하지 않는다.
4. Shared Platform은 현재 Logical Contract Boundary다.
5. Shared Core는 공통 Vocabulary와 Contract다.
6. V1 Shared Core는 Markdown Artifact에 투영되며 관리형 Entity를 요구하지 않는다.
7. Task, Run, Result의 관리형 Entity 승격은 V2부터다.
8. Identity와 Commerce는 동급의 독립 논리 경계다.
9. Identity·Commerce 완성은 V1 또는 V2 Local Invocation PoC의 선결 조건이 아니다.
10. PoC의 `ohmy_session_id`는 Local Correlation Identifier다.
11. 각 서비스는 자기 Domain 데이터를 소유한다.
12. 서비스 간 Database 직접 접근을 금지한다.
13. Shared Core를 이유로 하나의 공용 Database를 만들지 않는다.
14. 각 서버 Repository는 Modular Monolith로 시작한다.
15. 실제 운영 요구 없이 세부 Microservice를 선제적으로 만들지 않는다.
16. Public Local Code와 Private Cloud Intelligence를 같은 Repository에 혼합하지 않는다.
17. Public/Private 경계는 버전이 아니라 Contract와 정보 민감도로 결정한다.
18. Finance Lens 원문과 Professional Standards / Human Review 계약은 `finance-harness-docs`에서 관리한다.
19. Finance 정책 정의는 `finance-harness-docs`, Runtime 집행과 Audit Evidence는 `finance-harness`가 소유한다.
20. Finance Contract MVP와 Local Finance Experiment는 Development V2 전체 완료에 종속되지 않는다.
21. Portfolio Foundation canonical 결정은 `ranikun-labs/harness-foundation-docs`에서 관리한다.
22. Cloud가 생성한 판단은 Candidate이며 자동 Truth가 아니다.
23. Repository 이름 변경은 가능하지만 책임 경계 변경은 별도 결정이 필요하다.
24. Identity physicalization은 Gateway와 함께 `ADR-0017` 범위에서 승인됐고 Commerce physicalization은 승인되지 않았다.
25. Gateway·Identity Trigger는 Finance가 두 번째 실제 Consumer가 되면서 충족됐으며 다른 Capability는 각자의 Trigger를 기다린다.
26. 목표 Deployment Unit은 즉시 구현 승인이 아니다.
27. V1 Local Core는 Shared Services Deployment Unit과 Cloud AI Runtime 없이 완결한다.
28. Deployment Unit별 Data Source of Truth와 Migration 소유권을 분리한다.
29. Cross-service Foreign Key와 OLTP Cross-service JOIN을 금지한다.
30. `platform-core`의 Identity·Commerce·Audit는 같은 Process에서도 Module과 Schema 경계를 유지한다.
31. Audit는 현재 미구현 Module 후보이며 future NATS consumer 추출에는 별도 Trigger와 Decision이 필요하다.
32. 인증 논리 서비스의 canonical 명칭은 `Shared Identity`고 planned physical location은 `ranikun-labs/platform-services`의 `platform-core/identity`다 (`DEC-059`, `DEC-067`).
33. Carelog는 기존 Product Service로 이 지도에 등록되며(§7.7), 그 Auth Phase A 현재 상태는 oh-my-ai V1/V2/V3 Phase 1-5 물리화 타임라인과 분리해 기록한다 (`DEC-059`).

---

## 18. 미결정 사항

다음은 이 문서에서 확정하지 않는다.

1. 각 Repository의 최종 상품명과 Organization 이름
2. `oh-my-ai-control-plane`의 최종 기술 스택
3. 기존 Auth Server의 정확한 재사용 범위
4. `platform-services` 생성, 실제 구현·Deployment 시점과 운영 세부
5. Billing Provider
6. Commerce Module의 활성화 시점
7. Finance Service의 초기 Cloud Infrastructure
8. Shared Contract의 직렬화 형식
9. PostgreSQL Cluster의 물리 분리 시점
10. 중앙 Audit Module 활성화 시점
11. 각 Repository의 공개·비공개 전환 시점
12. 정식 SessionBinding Identifier Schema
13. AI Runtime Server의 실제 구현과 Provider 배치
14. Carelog Cutover 이후 기존 Gateway·Auth 경로 제거 시점
15. Audit 독립 Consumer 추출 Trigger 충족 여부
16. Gateway·Identity의 세부 Cutover Window와 Rollback Runbook

이 항목들은 별도 검토와 ADR 없이 추정해 확정하지 않는다.

---

## 19. 검수 요청 사항

### 하네스 메인 브랜치 세션

- 현재 `oh-my-ai` Repository 책임과 충돌하는가
- V1에 관리형 Task, Run, Result가 섞여 있는가
- Provider Session ID가 Primary Identity처럼 사용되는가
- Public Repository에 유지해야 할 Contract가 누락되는가
- V2 PoC가 Auth 구현 없이 진행 가능한 구조인가

### Finance 하네스 세션

- Finance가 독립 Product Service라는 정의가 맞는가
- Finance가 Development 구현에 직접 의존할 가능성이 차단됐는가
- Finance Lens·PolicyGuard·Fixture 문서 경계가 맞는가
- Finance 데이터 소유권이 충분히 분리됐는가

### Identity 세션

- Identity의 공통 책임 범위가 맞는가
- Product Entitlement와 Authentication 경계가 적절한가
- 기존 Auth Server를 독립 경계로 재사용할 수 있는가
- V2 PoC와 Identity 구현 순서가 적절한가

---

## 20. 관련 후속 문서

이 문서를 기준으로 다음 문서를 작성한다.

```text
docs/master/product-architecture-master.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
ADR-0009 — Multi-repository and deployment boundaries
Status: planned / not yet materialized

ADR-0010 — Independent identity platform
Status: planned / not yet materialized
```
