---
title: Product Roadmap
status: draft
owner: product
last_reviewed: 2026-07-14
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0002
  - ADR-0004
  - ADR-0005
  - ADR-0006
  - ADR-0009
  - ADR-0010
source_inputs: []
---

# Product Roadmap

## 1. 문서 목적

이 문서는 `oh-my-ai` 제품군의 제품·기술·운영 로드맵을 정의한다.

목적은 다음과 같다.

1. V1, V2, V3 Architecture Version과 Commercial Tier의 범위를 명확히 구분한다.
2. 상품 출시 순서와 기술 검증 순서를 분리한다.
3. Development Harness와 Finance Harness의 병행 가능 범위를 정의한다.
4. Identity, Entitlement, Billing의 도입 시점을 구분한다.
5. 현재 구현에 불필요한 미래 기능이 유입되는 것을 막는다.
6. 각 단계의 진입 조건, 완료 조건, 비범위를 정한다.
7. 문서·검수·구현·출시 순서를 일관되게 유지한다.

이 문서는 일정 날짜를 약속하는 Calendar Roadmap이 아니다.

현재 우선순위와 의존성을 정의하는 **Sequence and Gate Roadmap**이다.

구체적인 출시일, 인력, 예산과 KPI 수치는 별도 운영 계획에서 관리한다.

---

## 2. 로드맵 원칙

### 2.1 Architecture Version, Commercial Tier, 기술 단계는 다르다

Architecture Version:

```text
V1 Local Manual Artifact Workflow
V2 Personal Managed Workflow Architecture
V3 Team / Workspace / Organization Governance Architecture
```

Commercial Tier:

```text
Community
Signed-in Free
Pro
future Power
```

기술 단계:

```text
Contract Baseline
Local Artifact Workflow
Local Invocation PoC
Managed Metadata PoC
Commercialization
Managed Intelligence Expansion
Organization Governance
```

기술 PoC가 먼저 진행되더라도 해당 기능이 즉시 상품으로 출시됐다는 뜻은 아니다.

반대로 상품상 필수 기능이라도 모든 기술 구성요소가 최초 PoC의 선결 조건은 아니다.

예:

```text
Pro Commercial Tier
= Authentication + Pro Commercial Access + Local Managed Workflow

V2 Local Invocation PoC
= Auth 없이도 먼저 검증 가능
```

```text
V2 CLI Update
≠ Login

Login
≠ Subscription

V2 Architecture
≠ Pro Commercial Tier

future Power
≠ V3
```

### 2.2 현재 단계에 필요한 최소 범위만 구현한다

다음 원칙을 따른다.

```text
먼저 Contract
→ 그다음 Local 검증
→ 그다음 Managed Metadata
→ 그다음 Commercialization
→ 그다음 Intelligence 고도화
```

미래 기능이 현재 단계의 완료 조건으로 유입되지 않도록 한다.

### 2.3 Finance는 Development V2 전체에 종속되지 않는다

다음은 병행할 수 있다.

```text
Development V1
↔ Finance Contract MVP
↔ Finance Lens / PolicyGuard / Fixture 정리
↔ Local Finance Experiment
```

Finance Product의 Cloud 저장, 사용자 계정, Entitlement가 필요한 시점에는 V2 수준의 Identity 또는 Domain-neutral Platform Capability를 활용할 수 있다.

하지만 다음 작업이 Development V2 전체 완료를 기다릴 필요는 없다.

- Finance 문서 구조
- Lens와 PolicyGuard 계약
- Catalog와 Routing
- Fixture와 Regression
- Local Finance Experiment
- Checklist와 Journal Contract
- Product / Legal / Operations 기준
- Professional Standards
- Human Review Protocol

### 2.4 문서는 구현보다 먼저 경계를 고정한다

현재 로드맵의 첫 단계는 문서화와 Contract 정렬이다.

문서가 구현되지 않은 미래 구조를 설명할 수는 있다.

다만 다음을 명확히 구분한다.

```text
documented
designed
proposed
validated
implemented
released
```

문서가 존재한다는 이유만으로 구현 또는 Runtime 활성화가 완료됐다고 간주하지 않는다.

### 2.5 사람의 통제는 버전이 올라가도 제거하지 않는다

자동화가 증가해도 다음은 유지한다.

- 중요 실행 승인
- Context 수정
- Runtime Override
- Result Accept / Edit / Reject
- Candidate Promotion 승인
- 데이터 전송 선택
- 삭제와 Retention 제어

---

## 3. 전체 로드맵 요약

```text
Phase 0
Product and Contract Baseline

Phase 1
V1 Community — Local Manual Artifact Workflow

Phase 1F
Finance Contract MVP and Local Finance Experiment

Phase 2
V2 Local Invocation PoC

Phase 3
V2 Managed Workflow Technical Core

Phase 4
V2 Pro Commercial Launch

Phase 5
V2 Managed Intelligence and future Power Candidate Expansion

Phase 5F
Finance Product Physicalization

Phase 6
V3 Team / Enterprise Governance

Phase 7
Shared Platform Extraction — only if justified
```

Phase 번호는 우선순위와 일반적인 의존 방향을 나타낸다.

모든 Phase가 완전히 직렬로 끝나야 다음 작업을 시작할 수 있다는 의미는 아니다.

병행 가능한 작업은 각 Phase에 별도로 명시한다.

---

# Part I. Foundation

## 4. Phase 0 — Product and Contract Baseline

### 4.1 목표

제품군의 Durable Source of Truth와 핵심 Contract를 고정한다.

다음 혼선을 제거한다.

- V1과 V2 범위 혼합
- Development와 Finance 상하 관계
- Shared Core와 Shared Service 혼동
- Local과 Cloud 책임 혼동
- Capability, Policy, Entitlement 혼합
- Provider Session ID의 과도한 의미
- Public과 Private 문서 경계 불명확
- 구현 상태와 문서 상태 혼동

### 4.2 주요 산출물

#### 제품·아키텍처 기준

```text
repository-service-boundaries.md
product-architecture-master.md
product-roadmap.md
shared-core-and-extensions.md
local-cloud-human-boundary.md
development-harness-report.md
finance-harness-report.md
decision-log.md
```

#### ADR

```text
ADR-0001 V1 Local Artifact Workflow
ADR-0002 V2 Managed Workflow
ADR-0003 Provider Session ID Boundary
ADR-0004 Development / Finance Sibling Extensions
ADR-0005 Local / Cloud / Human Responsibility
ADR-0006 Sidecar Deferral
ADR-0007 Capability-based Adapter
ADR-0008 Candidate / Truthfulness / Promotion
ADR-0009 Multi-repository Boundaries
ADR-0010 Identity Boundary
```

#### V1 Contract

```text
v1-completion-criteria.md
work-start-contract.md
handoff-basic-contract.md
result-basic-contract.md
runtime-capability-contract.md
v1-fixture-plan.md
```

#### V2 Design Baseline — Non-blocking Parallel Track

```text
v2-local-invocation-poc.md
task-run-result-model.md
session-binding-model.md
result-collection-strategy.md
identity-integration.md
```

이 문서들은 V2 구현 전 경계를 정리하기 위한 병행 산출물이다.

Phase 0의 V1 Baseline 완료나 V1 구현 시작을 차단하지 않는다.
V2 Local Invocation PoC 진입 전 필요한 수준까지만 확정한다.

### 4.3 완료 조건

- V1, V2, V3의 범위가 문서 간 충돌 없이 정렬됨
- Development와 Finance의 책임 경계가 명확함
- Shared Platform이 현재 Logical Contract Boundary로 정의됨
- V1에서 관리형 Entity를 요구하지 않음
- V2 PoC와 V2 상품 출시의 순서가 분리됨
- Public / Private 문서 분리 기준이 확정됨
- 주요 결정이 ADR과 Decision Log에 연결됨
- 다른 세션과 구현자가 기준 문서만으로 제품 구조를 설명할 수 있음
- 현재 V1 Repository Drift와 Gap이 `development-harness-report.md` 및 `v1-completion-criteria.md`의 입력으로 연결됨
  - stale public documentation
  - Work-start routing Source of Truth 이원화
  - Result Basic 부재
  - Capability metadata 부재
  - Hook 및 routing fixture 부족

### 4.4 비범위

- V2 Control Plane 구현
- Billing Provider 선정
- Organization 이름 확정
- Shared Contract Package 추출
- Enterprise Governance 구현
- Managed Memory 저장소 구현

---

# Part II. Development Harness

## 5. Phase 1 — V1 Community: Local Manual Artifact Workflow

### 5.1 상품 정의

```text
무료
로그인 없음
Local-only
Human-controlled
Local Manual Artifact Workflow
```

기본 흐름:

```text
사용자 Task 입력
→ Skill Routing
→ Work-start Candidate
→ Project Context 참조
→ Structured Handoff Candidate
→ Human Review
→ Worker Session에 수동 Copy/Paste
→ Worker가 Result Basic 수동 형식으로 반환
→ Human Review
```

Community는 Lean V1에서 처음 제공되지만 V2 CLI에서도 제거되지 않는다.
V2로 업데이트해도 Community 기능은 로그인 없이 계속 사용할 수 있어야 한다.

### 5.2 핵심 사용자 가치

- Session 간 Context 손실 감소
- 작업 범위와 수정 금지 영역 보존
- 수동 Runtime 전달 품질 향상
- 검증 상태 명시
- Worker가 수행·미수행 검증과 남은 위험을 정직하게 반환
- Provider 종속 감소
- 로컬 데이터 경계 유지

### 5.3 포함 범위

```text
Local Installation
Instruction Cascade
Skill Registry
Basic Skill Routing
Prompt Routing Hook
Work-start
Runtime Entry Consent Guard
Project Context
Structured Handoff Candidate
Manual Copy/Paste
Local Candidate Artifact
Result Basic 수동 Template
Human Review
최소 Positive / Negative Fixture
Manual E2E Demo
Doctor
재현 가능한 최소 설치·실행 경로 1개
Local Product Notice Channel
Runtime-readable Version Source
```

Local Product Notice Channel은 향후 V2 출시·보안·호환성 공지를
기존 Public V1 사용자에게 전달하기 위한 최소 도달 경로다.

Cloud Control Plane, Account, 자동 Update를 도입하지 않으며,
Network 없이도 제품 핵심 기능이 정상 동작한다.

Public V1은 Cloud-independent 상태를 유지한다.

재현 가능한 최소 설치·실행 경로 1개는 한 가지 공식 경로로 로컬 설치와 기본 Workflow 실행을 재현할 수 있음을 의미한다. npm과 Homebrew 동시 지원, 복수 OS Installer, 자동 업데이트, 완성된 범용 CLI Product Shell을 뜻하지 않는다.

### 5.4 제외 범위

```text
User / Auth
Billing
Entitlement
Managed Task ID
SessionBinding
ExecutionRun Entity
ExecutionWorkspace Entity
ResultArtifact ID
Automatic Prompt Delivery
Automatic Result Collection
Result 자동 저장
Main Result 자동 감지
Task / Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Runtime Invocation
Managed Result Return
Task Registry
Cloud Sync
Managed Memory
Learning Loop
Worktree 자동 생성
Worker Branch Lifecycle
복수 Worker Coordination
Merge / Apply Gate 자동화
Mandatory Sidecar
Organization Governance
Cloud Notice API
사용자별 서버 Audience
자동 Update
자동 V2 설치
Push Notification
상주 Notice Daemon
```

### 5.5 기술 완료 조건

- Work-start가 명시된 입력으로 재현 가능하게 동작
- 최소 1개 Runtime에서 사용자용 `work-start` Entry를 제공
- 명시적 Entry 또는 사용자 승인된 Suggestion만 Work-start Engine을 호출
- Suggestion 또는 Decline 상태에서는 Engine 호출과 Artifact 생성이 없음
- Skill 후보 계산은 `skills/*/SKILL.md`의 routing metadata와 generated `skills/skill-index.json`을 단일 Source of Truth로 사용하며, Work-start 문서의 수동 매핑표와 상충하지 않음
- Handoff에 Scope, Do Not Touch, Facts, Assumptions, Open Issues가 포함됨
- Result에 Validation Performed / Not Performed가 포함됨
- 최소 Fixture가 반복 실행 가능
  - Work-start 입력과 Artifact 출력
  - Skill Routing positive / negative sample
  - Prompt Hook match / no-match / broken-index fail-open
  - Handoff 필수 필드 보존
  - Result의 Validation Performed / Not Performed 구분
  - 필수 필드 누락 실패
  - Scope / Do Not Touch 보존
  - 미수행 검증을 Pass로 표시하지 않음
- 지원하지 않는 기능을 지원한다고 보고하지 않음
- 실행하지 않은 검증을 Pass로 기록하지 않음
- Cloud 없이 전체 Workflow를 완료할 수 있음
- Product Notice 실패가 Work-start 결과와 Artifact에 영향을 주지 않음
- Offline 환경에서 Work-start가 정상 완료됨
- 사용자가 Notice를 dismiss하거나 원격 확인 전체를 opt-out할 수 있음
- 제품 Runtime이 자신의 Version을 Network 없이 읽을 수 있음

### 5.6 제품 완료 조건

- 신규 사용자가 문서만으로 설치·사용 가능
- 최소 1개 Runtime에서 명시적 Work-start Entry와 승인된 Suggestion 경로를 검증 가능
- 최소 1개 Runtime에 Handoff를 수동 Copy/Paste로 전달할 수 있음
- Worker가 Result Basic 수동 형식으로 반환할 수 있음
- 사용자가 Result Basic의 Validation / Risk를 Human Review할 수 있음
- V1 공개 기능과 비범위가 README에 명시됨
- V1 Release Note가 존재함
- Public V1 정식 공개 Tag가 `v1.0.0` 형식으로 존재함
- Notice 목적·전송 범위·Network Metadata 노출·Opt-out 방법이 Public 문서에 명시됨
- 기존 사용자 설정이나 설치 경로 변경이 있는 경우 Migration 안내가 존재함

### 5.7 출시 후 관찰 항목

- Handoff 수동 수정 빈도
- 누락 필드 유형
- Skill Routing Miss
- Runtime별 전달 실패
- Validation 미수행 비율
- 사용자 Override 유형
- Result 재사용률
- Local Usage Log의 유용성

---

## 6. Phase 2 — V2 Local Invocation PoC

### 6.1 목표

Managed Workflow 전체를 구현하기 전에 다음 기술 가설을 검증한다.

```text
Local Task
→ Runtime Initial Prompt
→ Local Execution
→ Result Collection
→ Task / Result Correlation
→ Human Review
```

Phase 2의 Runtime Invocation, Result Collection, Task / Result Correlation은 V2 실험이며 V1 Release Requirement가 아니다.

### 6.2 PoC 범위

```text
Local Task File or Input Artifact
Local Correlation Identifier
Runtime Process Invocation
Initial Prompt Injection
Provider Metadata Capture
Local Result Collection
Failure and Timeout Capture
Human Review
```

### 6.3 Identifier 원칙

PoC Identifier:

```text
local_correlation_id
experimental_session_reference
local_execution_reference
```

의미하지 않는 것:

```text
Permanent Session Identity
Cloud-managed SessionBinding
Cross-device Session
User-bound Global Identity
```

### 6.4 성공 조건

- Claude Code 또는 Codex 중 최소 하나에서 초기 Prompt 전달 성공
- Local 실행 결과를 지정된 Task와 연결
- Process 종료, 실패, Timeout을 구분
- Result 누락을 탐지
- 사용자가 Result를 Accept / Edit / Reject 가능
- Auth 없이 Local PoC 완료 가능
- Provider Session ID 없이도 Core Correlation 유지 가능
- PoC 결과를 V2 정식 Entity 설계에 반영 가능

### 6.5 실패해도 유지되는 결정

PoC가 실패하더라도 다음 Product Decision은 자동 폐기하지 않는다.

- V1은 Local Manual Artifact Workflow
- V2는 Managed Workflow
- Provider Session ID는 Adapter Metadata
- Human Review 유지
- Development와 Finance의 분리

PoC는 구현 방식의 검증이지 제품 철학 전체의 재검증이 아니다.

### 6.6 비범위

- 정식 Auth
- Billing
- Cross-device Resume
- Managed Ranking
- Managed Memory
- Organization Policy
- Long-running Sidecar
- Multiple Parallel Workers
- Remote SSH Execution

---

## 7. Phase 3 — V2 Managed Workflow Technical Core

### 7.1 목표

V1의 수동 Artifact Workflow를 관리형 Task Workflow로 확장한다.

이 단계는 기술 Core를 검증하는 단계다.
상용 User/Auth/Subscription/Billing을 선결 조건으로 요구하지 않는다.

### 7.2 핵심 Entity

```text
WorkItem / Task
SessionBinding
ExecutionRun
Optional ExecutionWorkspace
ResultArtifact
HumanReview
```

### 7.3 Core 범위

```text
Task Identity
Task Registry
Parent–Child Task
Worker Task
SessionBinding
ExecutionRun
Runtime Invocation
ResultArtifact
Result Collection
Managed Result Return
Result Detection
Task / Result Correlation
Completion Detection
Review Queue
Context Import
Worktree 자동 생성
Worker Branch Lifecycle
복수 Worker Coordination
Merge / Apply Gate 자동화
Human Review
Minimal Metadata Sync
Local Device Reference
Entitlement Extension Point
```

Phase 3의 `Local Device Reference`는 Local Runtime과 실행 출처를 구분하기 위한 local/test reference다.

사용자 계정에 귀속되는 정식 Device Registration과 Token Lifecycle은 Phase 4에서 도입한다.

Phase 3의 `Entitlement Extension Point`는 상업 권한을 직접 계산하지 않는다.

Task 실행 전에 외부 Entitlement 결과를 수용할 수 있는 Contract만 정의한다.

Plan, Subscription, Billing 기반 실제 Entitlement는 Phase 4에서 구현한다.

### 7.4 실행 흐름

```text
Main Task
→ Worker Task
→ Local Runtime
→ ResultArtifact
→ Parent Linking
→ Review Candidate
→ Human Review
```

Main과 Worker가 직접 Session 메시지를 교환하는 구조를 Core Contract로 만들지 않는다.

### 7.5 완료 조건

- Task와 Result의 귀속이 재현 가능
- SessionBinding이 Provider Metadata와 분리됨
- 실패한 ExecutionRun이 완료 상태로 승격되지 않음
- Result가 없을 때 누락 상태를 표현
- Human Review 이전 Result가 Confirmed Fact로 승격되지 않음
- Local Runtime과 실행 출처를 local/test device reference로 구분 가능
- Entitlement 결과를 수용할 Extension Point가 있으나 상업 권한을 직접 계산하지 않음
- 최소 Metadata Sync가 데이터 전송 정책을 준수
- Local-only 또는 Metadata-only Mode를 선택 가능
- V1 Artifact Import / Export 경로가 존재

### 7.6 비범위

- User-bound Device Registration
- Subscription / Billing 기반 Entitlement 계산
- Advanced Ranking
- Automatic Skill Promotion
- Organization Governance
- Enterprise Audit
- Full Remote Execution
- Automatic Repository Merge
- Unreviewed Memory Promotion

---

## 8. Phase 4 — V2 Pro Commercial Launch

### 8.1 목표

V2 Managed Workflow를 개인 Pro Commercial Tier로 운영 가능하게 만든다.

Pro의 핵심 가치는 다음이다.

```text
Local Workflow의 관리와 검증
```

V2 CLI 업데이트 자체는 Login 또는 Subscription을 요구하지 않는다.
Pro 기능 진입 시 Authentication을 요구할 수 있다.

### 8.2 포함 범위

```text
Authentication
Signed-in Free
Pro Commercial Access
User
User-bound Device
Plan
Entitlement
Subscription
Billing
Usage / Quota
Package Manifest
Conditional Package Channel
License Renewal
Conditional Offline Grace
Feature Gate
```

`Package Channel`과 `Offline Grace`는 실제 배포·라이선스 모델에서 필요한 경우에만 최초 Launch 범위에 포함한다.

다음은 Product Boundary다.

```text
Anonymous Community
= Login 없이 Community Local 기능 사용

Signed-in Free
= Authentication 완료
+ 활성 유료 Subscription 없음
+ Community 기능 유지
+ Trial·Account·Device·구매 권한 확인 가능

Pro
= Authentication 필요
+ Pro Commercial Access 필요
+ Local Managed Workflow의 관리·검증 기능
```

Trial, 제한된 무료 Pro 사용량, Grace, 가격은 변경 가능한 Launch Policy다.
구체 수치는 이 Roadmap에 고정하지 않는다.

### 8.3 책임 구분

```text
Capability
= Runtime 기능 가능 여부

Execution Policy
= 현재 작업 허용 여부

Entitlement
= 상업적 사용 권한
```

하나의 Feature Flag로 합치지 않는다.

```text
Update
≠ Login

Login
≠ Subscription

Authentication
≠ Entitlement

Subscription
≠ Trial
≠ Quota
≠ Local Data Access
```

### 8.4 Identity 원칙

Identity는 독립 논리 경계다.

가능한 물리화 방식:

```text
기존 Auth Server 재사용
독립 Identity Repository
초기 Control Plane 내부 Identity Module
```

단, 장기적으로 Product Domain과 Credential 책임을 분리할 수 있어야 한다.

### 8.5 출시 조건

- Login, User-bound Device, Token Lifecycle 동작
- Entitlement와 Execution Policy가 분리됨
- Subscription 상태와 Feature Access 일치
- Offline 실행을 지원하는 배포 모델이라면 Offline Grace 정책 명시
- 데이터 전송과 Retention이 사용자에게 표시됨
- 삭제와 Account Closure 경로 존재
- V1 Community 기능이 Pro 결제 없이 계속 사용 가능
- Billing 장애가 Local V1 실행을 차단하지 않음
- Subscription 종료 후 기존 Local 데이터 열람 유지
- 신규 Pro 관리 작업 제한과 Community Access 유지가 분리됨

---

## 9. Phase 5 — V2 Managed Intelligence and future Power Candidate Expansion

### 9.1 목표

Managed Workflow의 품질과 효율을 높이는 Candidate 기반 Intelligence를 추가한다.

이 단계의 일부 기능은 Pro 최초 Launch가 아니라 future Power Commercial Tier 후보로 남긴다.

### 9.2 포함 후보

```text
Task Linking Candidate
Context Ranking
Skill Ranking
Conflict Detection
Runtime Recommendation
Result Review Candidate
Approval Queue
Task Graph
Failure Mining
Routing Candidate
Automation Candidate
```

### 9.3 후기 V2 후보

```text
Managed Memory
SkillOpt Evaluation
Candidate Skill Promotion
Advanced Learning Loop
Cross-device Resume
Long-running Worker
Optional Sidecar
Remote Workspace
```

### 9.3.1 future Power 후보

```text
Encrypted Cloud Sync
Cross-device Resume
Cloud Backup / Restore
Web Review
개인용 Remote Worker
고급 자동화
```

future Power는 새 Architecture Version이 아니며 V3도 아니다.
Power라는 최종 상품명, 가격, 출시 시점은 확정하지 않는다.

조직 공유 Worker, RBAC, Team Audit, Organization Policy는 V3에 남긴다.

### 9.4 승격 원칙

```text
Trace
→ Candidate
→ Fixture
→ Evaluation
→ Regression
→ Human Review
→ Promotion
```

금지:

```text
Failure
→ Production Skill 자동 수정

Worker Result
→ 공식 Memory 자동 저장

Cloud Evaluation
→ Confirmed Decision 자동 승격
```

### 9.5 완료 조건

- 추천 이유와 근거를 사용자에게 표시
- 사용자가 Candidate를 수정·거부 가능
- Ranking 실패가 기본 Workflow를 막지 않음
- Candidate와 Canonical Asset의 상태가 구분됨
- Promotion 이력이 추적 가능
- Regression 실패 시 자동 승격 차단

---

# Part III. Finance Harness

## 10. Phase 1F — Finance Contract MVP

### 10.1 목표

Finance Product의 Knowledge, Safety, Runtime Contract를 Development V2와 독립적으로 정리한다.

### 10.2 포함 범위

```text
Core Rules
Safety
Runtime Contract
Core Analysis Lenses
Asset Class Lenses
Domain Deep-Dive Lenses
Catalog
Routing
Fixtures
Regression
Product / Legal / Operations
Professional Standards
Human Review Protocol
```

### 10.3 제품 흐름

```text
Learn
→ Checklist
→ Journal
→ Review
```

### 10.4 비목표

```text
Return Prediction
Buy / Sell Recommendation
Automatic Trading Decision
User Responsibility Replacement
Account Integration Requirement
```

### 10.5 완료 조건

- Product-MVP Lens 목록과 상태가 정리됨
- 각 Lens의 Owner와 목적이 정의됨
- PolicyGuard Contract가 존재
- Catalog와 Routing 규칙이 존재
- Fixture와 Regression 연결이 가능
- Artifact Lifecycle과 Runtime Activation이 분리됨
- Professional Standards와 Human Review 기준 존재
- 금융 표현 정책과 금지 표현이 정의됨

---

## 11. Phase 1F-L — Local Finance Experiment

### 11.1 목표

Finance Contract를 실제 사용자 흐름에 적용해 본다.

Development V1의 Local Artifact Workflow와 공통 원칙을 활용할 수 있지만 Development 실행 모델에 의존하지 않는다.

### 11.2 실험 범위

```text
Manual AnalysisRequest
Selected Lens
PolicyGuard Check
ChecklistResult
JournalCandidate
Manual Review
```

### 11.3 입력 방식

기본 실험 입력:

```text
User Text Input
Manual Market Context
```

별도 정책·데이터 검토 후 선택 가능한 실험 후보:

```text
Image Input with Optional OCR
Delayed Market Data
Saved Interest List
```

후보 기능은 Local Finance Experiment의 완료 Gate가 아니다.

OCR, 이미지 저장, 시장 데이터 재제공은 별도 보안·법률·출처 검토 후 활성화한다.

### 11.4 성공 조건

- 사용자가 질문을 Checklist로 변환 가능
- 단정적 매수·매도 표현을 PolicyGuard가 차단
- Result를 JournalCandidate로 저장 가능
- 사용자가 수정 후 Journal로 확정 가능
- Review에서 당시 판단과 결과를 분리 가능
- Development Repository나 Worktree 개념 없이 동작

### 11.5 비범위

- Broker Account Integration
- Automatic Portfolio Sync
- Real-time Trading
- Personalized Buy / Sell Signal
- Finance Cloud Backend
- Paid Entitlement
- OCR과 Market Data를 필수로 요구하는 실험

---

## 12. Phase 5F — Finance Product Physicalization

### 12.1 목표

Finance Contract와 Local Experiment를 독립적인 Finance Product Backend와 사용자 경험으로 물리화한다.

이 단계는 Development V2 전체 완료를 기다려야 한다는 의미가 아니다.

필요한 Identity 또는 Domain-neutral Platform Capability가 준비되면 독립적으로 진행할 수 있다.

### 12.2 핵심 Domain

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
Finance Entitlement
Finance Usage
```

### 12.3 초기 제품 범위

```text
User Onboarding
Interest Area / Asset
Ask
Checklist
Journal Save
Journal Detail
Review
Basic Market Context
PolicyGuard UI
```

### 12.4 데이터 책임

정책 정의:

```text
finance-harness-docs
- Consent
- Data Minimization
- Retention
- Deletion
- Access Control
- Audit Policy
- Professional Standards
```

Runtime 집행:

```text
finance-harness
- Storage Enforcement
- User Deletion
- Access History
- PolicyGuard Violation Log
- Audit Evidence
- Journal Access Control
```

### 12.5 완료 조건

- Finance Backend가 독립 배포 가능
- `finance_db` 또는 독립 논리 데이터 경계 존재
- Identity와 Product Entitlement 경계가 분리됨
- Lens / PolicyGuard Contract를 Version 기준으로 로딩
- Runtime 활성화 상태와 문서 존재 상태가 분리됨
- Journal 삭제·보존·내보내기 정책 구현
- Review 흐름이 원래 판단과 사후 결과를 구분
- Development 전용 API에 의존하지 않음

---

# Part IV. Organization and Platform

## 13. Phase 6 — V3 Team / Enterprise Governance

### 13.1 목표

개인 단위 Managed Workflow를 조직 단위 Governance로 확장한다.

### 13.2 포함 후보

```text
Workspace
Project
Organization
Organization Policy
Project Policy
Shared Skill / Lens / Preset
Team Audit
RBAC
SSO
Self-hosted
DPA
Retention Policy
Approval Workflow
Policy Override Audit
```

### 13.3 진입 조건

- V2 Task / Run / Result 모델이 안정화됨
- Human Review와 Audit Trail이 신뢰 가능
- Product Entitlement가 안정화됨
- 조직 고객의 실제 요구가 확인됨
- 개인 Workflow와 조직 정책 충돌 모델이 정의됨

### 13.4 비범위

- 조직 요구가 없는 상태에서 선제 구현
- V2 초기 출시 전 Enterprise 기능 병합
- 모든 Extension의 조직 기능 강제 통합

---

## 14. Phase 7 — Shared Platform Extraction

### 14.1 원칙

공통 개념이 있다는 이유만으로 별도 Service를 만들지 않는다.

실제 중복과 운영 요구가 확인된 경우에만 추출한다.

### 14.2 추출 후보

```text
shared-contracts
shared-platform-control-plane
commercial-platform
event / audit platform
```

### 14.3 추출 조건

다음 중 여러 조건이 충족돼야 한다.

- 둘 이상의 Product가 동일 Contract를 사용
- Contract Drift가 반복
- 독립 Version Compatibility 필요
- 독립 Scaling 필요
- 독립 장애 격리 필요
- 별도 팀이 운영
- 공통 Billing / Entitlement가 실제로 반복
- External API로 제공할 가치가 있음

### 14.4 추출하지 않는 이유

다음 이유만으로는 추출하지 않는다.

- 이름이 공통이어서
- 미래에 커질 것 같아서
- MSA가 더 전문적으로 보여서
- 테이블 수가 많아서
- 코드가 일부 유사해서

---

## 15. 병행 가능 트랙

### 15.1 현재 병행 가능

```text
Product Documentation
Development V1 Completion
Finance Contract MVP
Finance Lens / Fixture Work
Public Contract Cleanup
V2 Local Invocation Research
```

### 15.2 V1 완료 후 본격화

```text
V2 Local Invocation PoC
Task / Run / Result Entity Design
Result Collection Strategy
SessionBinding Design
```

### 15.3 Identity와 병행 가능

```text
Auth Server Reuse Review
Device Model
Token Contract
Product Entitlement Boundary
```

Identity 구현은 Local PoC 완료를 기다릴 필요가 없지만, Local PoC를 막는 선결 조건도 아니다.

### 15.4 Finance Product와 병행 가능

```text
Finance UI Prototype
Finance Policy / Legal Review
Journal / Review Contract
Market Data Source Research
Storage / Retention Design
```

---

## 16. 주요 의존성

| 작업 | 선행 조건 | 선행 조건이 아닌 것 |
|---|---|---|
| V1 Release | V1 Contract, Fixtures, Public Docs | Auth, Billing, Sidecar |
| Local Invocation PoC | V1 범위 안정화, Runtime Adapter 이해 | Identity Platform 완성 |
| V2 Technical Core | PoC 결과, Task/Run/Result 설계 | 정식 Auth, Billing, Managed Memory |
| V2 Pro Commercial Launch | V2 Technical Core, Auth, User-bound Device, Entitlement | V3 Governance |
| Finance Contract MVP | Finance Docs, Safety 기준 | Development V2 전체 |
| Local Finance Experiment | Finance Contract MVP | OCR, Market Data, Finance Cloud Backend |
| Finance Product | Finance Contract, Product UI, 필요한 Identity | Development Managed Intelligence 전체 |
| V3 | 안정된 V2, 실제 조직 수요 | Finance Product 완료 |
| Shared Platform 추출 | 실제 반복과 운영 필요 | 단순 공통 이름 |

---

## 17. 단계별 중단 기준

### 17.1 V1 중단 또는 재설계 검토

- Handoff가 반복 사용에서도 Context 손실을 줄이지 못함
- Result Truthfulness 구조가 사용자에게 도움이 되지 않음
- Runtime Adapter가 Provider 차이를 숨기지 못함
- Scope 통제가 실제 작업에서 작동하지 않음

### 17.2 V2 PoC 중단 또는 구현 방식 변경

- Runtime Prompt 전달이 안정적으로 불가능
- Result 귀속을 Provider Session ID 없이 구현할 수 없음
- Process Lifecycle을 제어할 방법이 없음
- 사용자 승인보다 자동화 비용이 더 큼

이 경우 제품 방향 전체를 즉시 폐기하지 않고 구현 방식을 재검토한다.

### 17.3 Finance Product 중단 또는 범위 축소

- PolicyGuard가 추천성 표현을 안정적으로 통제하지 못함
- Journal / Review가 사용자 가치로 연결되지 않음
- 데이터 보안·삭제 책임을 감당할 수 없음
- 법률 검토 결과 Product Flow 수정이 필요함

---

## 18. Release Gate

### 18.1 V1 Gate

```text
Contract Complete
Implementation Complete
Fixtures Pass
Public Docs Complete
Truthfulness Verified
Manual End-to-End Pass
```

### 18.2 V2 PoC Gate

```text
Local Invocation Demonstrated
Correlation Demonstrated
Result Collection Demonstrated
Failure Path Demonstrated
Human Review Demonstrated
```

### 18.3 V2 Technical Core Gate

```text
Task / Run / Result Stable
SessionBinding Stable
Local Device Reference Stable
Entitlement Extension Point Stable
Failure and Missing Result States Stable
Human Review Stable
```

### 18.4 V2 Commercial Launch Gate

```text
Auth Ready
User-bound Device Ready
Entitlement Ready
Task / Run / Result Stable
Data Transfer Policy Visible
Deletion Path Ready
Billing Failure Isolation Ready
```

### 18.5 Finance Product Gate

```text
Lens / PolicyGuard Contract Ready
Runtime Activation Controlled
Data Policy Approved
Journal / Review Ready
Deletion / Export Ready
Finance Audit Evidence Ready
```

### 18.6 V3 Gate

```text
Organization Demand Confirmed
RBAC Model Ready
Audit Trail Stable
Policy Override Model Ready
Enterprise Security Review Ready
```

---

## 19. Roadmap 상태 관리

각 항목은 다음 상태를 사용한다.

```text
idea
proposed
designed
validated
implemented
released
deprecated
superseded
```

각 상태의 의미:

```text
idea
= 검토 전 아이디어

proposed
= 문서화된 제안

designed
= Contract와 책임 경계가 정의됨

validated
= PoC, Fixture 또는 Review를 통과

implemented
= 코드 또는 Runtime에 반영

released
= 사용자에게 제공

deprecated
= 신규 사용 중단 예정

superseded
= 새 결정으로 대체
```

문서 상태와 기능 상태를 혼동하지 않는다.

예:

```text
문서 status: canonical
기능 status: proposed
```

가능하다.

---

## 20. 우선순위 기준

우선순위는 다음 순서로 판단한다.

1. 제품 경계와 안전성
2. V1 사용자 가치
3. Runtime 간 호환성
4. 검증 가능성과 Truthfulness
5. Local 데이터 경계
6. V2 기술 위험 제거
7. Commercialization
8. Managed Intelligence
9. Organization Governance
10. Shared Platform 추출

다음 이유만으로 우선순위를 올리지 않는다.

- 기술적으로 흥미로워서
- 경쟁사가 제공해서
- 미래에 필요할 것 같아서
- AI가 자동화할 수 있어서
- Architecture가 더 복잡해 보여서

---

## 21. 현재 우선 실행 순서

현재 기준의 실행 순서:

```text
1. Product / Architecture 기준 문서 완성
2. V1 현재 구현 정합성 검수
   - stale public documentation
   - Work-start routing Source of Truth
   - Result Basic
   - Static Capability Metadata
   - Hook / Routing Fixture
3. V1 Completion Criteria 확정
4. Handoff / Result / Capability Contract 확정
5. V1 Fixture와 Regression
6. V1 Release
7. V2 Local Invocation PoC
8. Task / Run / Result Managed Model
9. V2 Managed Workflow Technical Core 구현
   - Local/Test Device Reference
   - Entitlement Extension Point
10. Identity / Auth / User-bound Device / Entitlement 통합
11. V2 Commercial Launch
12. Managed Intelligence Expansion
13. Finance Product Physicalization
14. V3 Governance
```

병행 트랙:

```text
Finance Contract MVP
Finance Lens / PolicyGuard / Fixture
Finance Legal / Professional Standards
Finance Local Experiment
```

---

## 22. 미결정 사항

이 문서에서 다음은 확정하지 않는다.

1. 구체 출시 날짜
2. 각 Phase의 인력 규모
3. 최종 Product Name
4. 최종 Organization Name
5. Control Plane 기술 스택
6. Billing Provider
7. 가격
8. Identity 최초 배포 형태
9. Sidecar 도입 시점
10. Managed Memory Database
11. Finance Market Data Provider
12. Finance Cloud Infrastructure
13. Enterprise Self-hosted 방식
14. KPI 목표 수치
15. Shared Platform 추출 시점
16. Package Channel의 최초 Launch 포함 여부
17. Offline Grace의 구체 기간과 적용 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 23. 불변조건

1. V1은 무료 Local Artifact Workflow다.
2. V2는 Task ID 중심 Managed Workflow다.
3. V3는 Organization Governance다.
4. V2 PoC와 V2 상품 출시를 구분한다.
5. Identity 완성은 Local Invocation PoC의 선결 조건이 아니다.
6. Sidecar는 초기 V2 선결 조건이 아니다.
7. Finance Contract MVP는 Development V2 전체에 종속되지 않는다.
8. Finance Product는 Development 전용 실행 모델에 의존하지 않는다.
9. Shared Platform은 현재 Logical Contract Boundary다.
10. Shared Service 추출은 실제 반복과 운영 요구 이후에만 한다.
11. Capability, Execution Policy, Entitlement를 분리한다.
12. Cloud Candidate는 자동 Truth가 아니다.
13. Human Review는 V1, V2, V3에서 유지된다.
14. V1 Community 기능은 V2 유료화 이후에도 무료 Local Workflow로 유지한다.
15. 문서 상태와 구현 상태를 분리한다.
16. 미래 기능을 현재 단계의 완료 조건으로 넣지 않는다.
17. V2 Technical Core와 V2 Commercial Launch를 구분한다.
18. OCR과 Market Data는 Local Finance Experiment의 필수 Gate가 아니다.
19. Product Notice는 fail-open이며 Public V1의 Cloud-independent 성질을 바꾸지 않는다.
20. Public Stable Release Tag는 SemVer-clean 형식을 사용한다.

---

## 24. 관련 문서

```text
docs/master/product-architecture-master.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
docs/product/v1-completion-criteria.md
docs/poc/v2-local-invocation-poc.md
docs/decisions/decision-log.md
```

---

## 25. 검수 관점

### 하네스 메인 브랜치

- V1 완료 전 필요한 작업 순서가 현실적인가
- 현재 구현과 Phase 1 범위가 정렬되는가
- V2 PoC가 기술적으로 최소 범위인가
- V1에 V2 기능이 유입될 위험이 있는가

### Finance 하네스

- Finance Contract MVP와 Local Experiment가 독립적으로 진행 가능한가
- Finance Product가 Development V2 전체에 종속되지 않는가
- Professional Standards와 Human Review가 포함되는가
- Finance 데이터 정책과 Runtime 집행 순서가 적절한가

### Identity

- Identity가 Local PoC 선결 조건이 아닌가
- V2 Commercial Launch 전에는 충분히 준비되는가
- Product Entitlement와 Authentication 책임이 구분되는가

### 초기 아이디어

- V1의 Local, Human-controlled, White-box 의도가 유지되는가
- V2와 V3 확장이 초기 제품을 대체하지 않는가
