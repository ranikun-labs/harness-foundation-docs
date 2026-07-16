---
title: Shared Core and Extensions
status: draft
implementation_status: mixed
owner: product
last_reviewed: 2026-07-14
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0004
  - ADR-0007
  - ADR-0008
  - ADR-0009
source_inputs: []
---

# Shared Core and Extensions

## 1. 문서 목적

이 문서는 `oh-my-ai` 제품군에서 다음 경계를 정의한다.

1. Shared Core가 무엇인지
2. Shared Core가 무엇이 아닌지
3. Development Extension과 Finance Extension이 어떤 공통 Contract를 사용하는지
4. 각 Extension이 독립적으로 소유해야 하는 Domain Model은 무엇인지
5. 공통 개념을 별도 Service나 Package로 추출하는 시점은 언제인지
6. V1, V2, V3에서 Shared Core가 각각 어떻게 표현되는지
7. Extension 간 직접 의존을 어떻게 방지할지
8. Candidate, Truthfulness, Human Review가 공통으로 어떻게 적용되는지

이 문서의 목적은 두 제품을 하나의 Domain Model로 합치는 것이 아니다.

정확한 목적은 다음과 같다.

> 공통 의미는 Contract로 정렬하고, 실행과 데이터는 각 Extension이 자기 Domain에 맞게 소유한다.

---

## 2. 핵심 결론

```text
Shared Core
= 공통 Vocabulary
+ 공통 Contract
+ 공통 상태 의미
+ 공통 안전 원칙
```

```text
Shared Core
≠ Shared Database
≠ Shared Service
≠ Shared Domain Model
≠ Development Model의 상속
≠ 모든 제품의 동일 구현
```

Development와 Finance의 관계:

```text
Development → Shared Platform Contract
Finance → Shared Platform Contract

Development ↛ Finance
Finance ↛ Development
```

각 Extension은 공통 Contract를 자기 Domain Model로 구현한다.

---

## 3. Shared Platform과 Shared Core의 관계

Shared Platform은 제품군 전체의 논리적 플랫폼 경계다.

Shared Core는 그 안에서 모든 Extension이 공유하는 최소 Contract 집합이다.

```text
Shared Platform
├── Cross-version Shared Core
├── V2+ Commercial Capabilities
├── Managed Workflow Capabilities
├── Development Extension
└── Finance Extension
```

구분:

```text
Cross-version Shared Core
= V1, V2, V3 전체에서 의미가 유지되는 공통 Contract

V2+ Commercial Capabilities
= Auth, Entitlement, Subscription, Usage 등 상품 운영 기능

Managed Workflow Capabilities
= Task Linking, Ranking, Recommendation, Candidate Evaluation 등

Extension
= 특정 Domain의 실행·데이터·정책 구현
```

Shared Platform은 현재 별도 Network Service가 아니다.

---

## 4. Cross-version Shared Core

Shared Core의 최소 Vocabulary:

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
Candidate
Promotion
```

각 개념은 Extension별로 다른 형태로 구현될 수 있다.

### 4.1 WorkItem / Request

공통 의미:

```text
사용자가 달성하려는 목표와 Scope를 가진 작업 단위
```

Development 예:

```text
코드 수정
설계 검수
테스트 추가
문서 생성
```

Finance 예:

```text
시장 질문
종목 점검
투자 판단 전 체크리스트
복기 요청
```

### 4.2 Run

공통 의미:

```text
하나의 Request를 처리하기 위해 수행된 실행 또는 분석 기록
```

Development 예:

```text
ExecutionRun
ValidationRun
AgentProcess
```

Finance 예:

```text
LensRun
PolicyGuardRun
```

### 4.3 Result

공통 의미:

```text
Request 또는 Run에서 생성된 검토 가능한 출력
```

Development 예:

```text
Result Basic
Diff
Validation Result
ResultArtifact
```

Finance 예:

```text
ChecklistResult
JournalCandidate
ReviewRecord
```

### 4.4 Parent–Child Relationship

공통 의미:

```text
하나의 상위 WorkItem이 하위 WorkItem을 생성하고,
하위 결과가 다시 상위 WorkItem으로 귀속되는 관계
```

Development 예:

```text
Main Task
→ Worker Task
```

Finance에서 다음 흐름은 기본적으로 Parent–Child WorkItem 관계가 아니다.

```text
AnalysisRequest
→ LensRun
→ PolicyGuardRun
```

이는 Request와 Run 사이의 실행 계보 또는 인과관계다.

Finance에서 실제 하위 `AnalysisRequest` 또는 `ReviewRequest`가 생성되는 경우에만 Parent–Child WorkItem 관계를 사용한다.

### 4.5 Status

공통 상태 의미 후보:

```text
proposed
ready
running
completed
failed
blocked
cancelled
review_required
accepted
rejected
superseded
```

모든 Extension이 모든 상태를 동일하게 사용할 필요는 없다.

이 목록은 공용 Database Enum 또는 모든 Entity가 구현해야 하는 단일 Lifecycle State Machine을 의미하지 않는다.

각 Extension은 자기 Domain에 필요한 상태를 소유하며, 공통 상태 이름을 사용할 경우에만 의미를 일관되게 유지한다.

필요하면 Extension-specific 상태를 별도 Namespace로 정의한다.

### 4.6 Human Review

공통 의미:

```text
AI 또는 Runtime 결과를 사람이 검토하고
Accept / Edit / Reject하는 단계
```

Human Review는 버전이 올라가도 제거하지 않는다.

### 4.7 Policy

공통 의미:

```text
작업 또는 실행에 적용되는 허용·금지·제약 조건
```

Development 예:

```text
read-only
reviewed-writer
exclusive-writer
shell approval
validation requirement
```

Finance 예:

```text
단정 금지
매수·매도 추천 금지
근거와 불확실성 표시
PolicyGuard
```

### 4.8 Provenance

공통 의미:

```text
결과가 어떤 입력·근거·실행·검증에서 생성됐는지 추적하는 정보
```

### 4.9 Truthfulness Classification

공통 분류:

```text
Confirmed Fact
Confirmed Decision
Assumption
Open Issue
Constraint
Evidence
Validation Performed
Validation Not Performed
Blocked
Remaining Risk
```

### 4.10 Adapter Contract

공통 의미:

```text
외부 Runtime 또는 Provider의 동작을
Extension Core와 분리하기 위한 경계 원칙
```

Shared Core가 Development와 Finance에 하나의 Universal Adapter Interface, 공통 Provider DTO 또는 동일 Method Set을 강제한다는 의미는 아니다.

각 Extension은 자기 Provider 유형에 맞는 Adapter Contract를 소유한다.

### 4.11 Capability Contract

공통 의미:

```text
Runtime 또는 Extension이 기술적으로 수행 가능한 기능을 선언하는 계약
```

공유되는 것은 Capability Declaration의 의미와 Capability / Policy / Entitlement 분리 원칙이다.

Capability Key와 Namespace는 Extension이 소유하며, 하나의 전역 Capability Enum을 모든 제품에 강제하지 않는다.

### 4.12 Candidate

공통 의미:

```text
아직 공식 Truth, Memory, Skill, Decision으로 승격되지 않은 제안 상태
```

### 4.13 Promotion

공통 의미:

```text
Candidate를 검증·검수 후 공식 자산으로 승격하는 절차
```

---

## 5. 버전별 Shared Core 구현

### 5.1 V1 — Artifact Projection

V1에서는 Shared Core를 관리형 Entity로 구현하지 않는다.

```text
WorkItem
→ Handoff Goal / Scope / Constraint

Run
→ 수행 기록

Result
→ Result Basic Markdown

Human Review
→ 사용자 수동 검수

Policy
→ Execution Policy와 Handoff 필드

Provenance
→ Fact / Evidence / Assumption

Truthfulness
→ Verified / Not Verified / Blocked / Remaining Risk
```

V1에 다음을 요구하지 않는다.

```text
Global ID
Database
Managed Lifecycle
SessionBinding
ExecutionRun Entity
ResultArtifact ID
Cloud Persistence
```

### 5.2 V2 — Managed Entity

V2부터 Shared Core가 관리형 Entity로 승격된다.

```text
WorkItem / Task
Run
ResultArtifact
Parent–Child Link
HumanReview
Policy Reference
Provenance Metadata
Candidate State
```

V2에서는 각 Extension이 공통 의미를 유지하되 자기 Domain Model로 저장한다.

### 5.3 V3 — Organization-governed Entity

V3에서는 관리형 Entity에 조직 정책이 추가된다.

```text
Workspace
Project
Organization
Organization Policy
Role
Audit
Retention
Approval Workflow
```

---

## 6. Extension Contract 원칙

Extension은 다음 규칙을 따른다.

### 6.1 공통 의미를 재정의하지 않는다

예:

```text
completed
```

를 Development에서는 “검증 완료”, Finance에서는 “검증하지 않았지만 답변 생성 완료”로 사용하면 안 된다.

필요하면 더 구체적인 상태를 사용한다.

```text
generation_completed
validation_completed
review_completed
```

### 6.2 Domain Model은 각 Extension이 소유한다

Shared Core는 공통 의미를 제공한다.

실제 Entity, Database, Lifecycle, API는 각 Extension이 소유한다.

### 6.3 다른 Extension의 DTO를 재사용하지 않는다

금지:

```text
Finance가 DevelopmentTask DTO import
Finance가 ExecutionWorkspace DTO import
Development가 LensRun DTO import
Development가 Journal DTO import
```

허용:

```text
각 Extension이 공통 Contract 의미를 자기 DTO로 구현
```

### 6.4 직접 Database 접근을 금지한다

```text
Development → finance_db 직접 조회 금지
Finance → development_control_db 직접 조회 금지
Extension → identity_db 직접 조회 금지
```

필요한 경우 API, Token Claim 또는 승인된 Contract를 사용한다.

### 6.5 Contract 공유와 코드 공유를 구분한다

공통 의미가 같아도 즉시 공용 Library를 만들지 않는다.

먼저 다음을 확인한다.

- 둘 이상의 실제 사용처
- 반복되는 Drift
- 독립 Versioning 필요
- Compatibility 관리 필요
- 유지보수 비용 절감 효과

---

## 7. Development Extension

Development Extension은 Software Development Workflow를 소유한다.

### 7.1 Cross-version Domain Vocabulary

다음 목록은 Development Extension의 V1·V2·V3 전체 목표 개념을 포함한다.

각 항목이 현재 구현됐거나 V1 완료 조건이라는 의미는 아니다.

관리형 Entity의 도입 시점은 버전별 Contract가 결정한다.

```text
DevelopmentTask
Repository
RepositorySnapshot
Branch
Commit
ExecutionWorkspace
GitWorktree
AgentProcess
FilesChanged
Diff
CommandRun
ValidationRun
WriterLease
DevelopmentResultArtifact
```

### 7.2 책임

```text
Repository Context 수집
Branch / Commit 상태
File Read / Edit
Shell Execution
Validation
Worktree
Writer Safety
Diff
Runtime Adapter
Development-specific Policy
```

### 7.3 Shared Core 매핑

| Shared Core | Development 구현 |
|---|---|
| WorkItem / Request | DevelopmentTask |
| Run | ExecutionRun / ValidationRun |
| Result | Result Basic / DevelopmentResultArtifact |
| Parent–Child | Main Task / Worker Task |
| Human Review | Diff·Result Accept/Edit/Reject |
| Policy | Execution Policy / Writer Mode |
| Provenance | Repository / Commit / Command / Validation |
| Candidate | Result Review Candidate / Skill Candidate |

### 7.4 Development 전용 개념

다음은 Shared Core가 아니다.

```text
Repository
Branch
Commit
GitWorktree
Diff
WriterLease
AgentProcess
Development Validation
```

Finance가 이 모델을 상속하지 않는다.

---

## 8. Finance Extension

Finance Extension은 금융 교육·판단 전 점검·기록·복기를 소유한다.

### 8.1 Cross-version Domain Vocabulary

다음 목록은 Finance Extension의 목표 Domain 개념이다.

현재 Finance Runtime 구현 완료 상태를 의미하지 않으며, 문서 Contract·Local Experiment·Product Runtime 단계별로 구현 수준이 다를 수 있다.

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
FinanceUsage
FinanceEntitlement
```

### 8.2 책임

```text
Finance Question
Context Snapshot
Lens Selection
Lens Execution
PolicyGuard
Checklist
Journal
Review
Finance Data Policy Enforcement
Finance Audit Evidence
```

### 8.3 Shared Core 매핑

| Shared Core | Finance 구현 |
|---|---|
| WorkItem / Request | AnalysisRequest |
| Run | LensRun / PolicyGuardRun |
| Result | ChecklistResult / JournalCandidate / ReviewRecord |
| Parent–Child | 실제 하위 AnalysisRequest / ReviewRequest가 생성되는 경우에만 사용 |
| Human Review | Journal·Review Candidate Accept/Edit/Reject |
| Policy | PolicyGuard / Professional Standards |
| Provenance | ContextSnapshot / Evidence / Lens Version |
| Candidate | JournalCandidate / Routing Candidate |

`AnalysisRequest → LensRun → PolicyGuardRun`은 Parent–Child Task가 아니라 실행 계보다.

### 8.4 Finance Knowledge Contract

문서 Source of Truth:

```text
finance-harness-docs
├── Core Rules
├── Safety
├── Runtime Contract
├── Lenses
├── Catalog
├── Routing
├── Fixtures
├── Regression
├── Product / Legal / Operations
└── Professional Standards / Human Review Protocol
```

Runtime 책임:

```text
finance-harness
├── Contract Loading
├── Activation Gate
├── Lens Execution
├── PolicyGuard Execution
├── Run / Result Storage
├── Journal Storage
├── Review
└── Audit Evidence
```

문서가 Repository에 존재한다는 사실만으로 Runtime 활성화를 의미하지 않는다.

활성화 여부는 다음 Metadata 또는 동등한 Contract로 결정한다.

```text
lifecycle_status
implementation_status
runtime_loadable
routable
fixture_refs
activation_gate
```

### 8.5 Finance 전용 개념

다음은 Shared Core가 아니다.

```text
Lens
PolicyGuard
Checklist
Journal
ReviewRecord
Market Context
Financial Professional Standards
```

Development가 이 모델을 상속하지 않는다.

---

## 9. Commercial Capability

Commercial Capability는 Shared Core가 아니다.

향후 Development와 Finance가 동일한 Domain-neutral `Entitlement Check` Contract를 사용하더라도, 해당 Contract는 Cross-version Shared Core가 아니라 V2+ Commercial Capability에 속한다.

```text
User
Authentication
Device
Plan
Subscription
Billing
Entitlement
Usage
Quota
Package Manifest
License Renewal
Offline Grace
```

구분:

```text
Shared Core
= 작업과 결과의 공통 의미

Commercial Capability
= 상품 접근 권한과 운영
```

V1 Community에는 Commercial Entitlement가 없다.

V2+에서 제품별 Entitlement가 도입될 수 있다.

Commercial Tier는 Architecture Version과 동일한 축이 아니다.

```text
Community
= 로그인 없는 Local Manual Workflow

Signed-in Free
= Authentication 완료
+ 활성 유료 Subscription 없음

Pro
= Local Managed Workflow의 관리·검증

future Power
= 개인용 Cloud Sync·복구·고급 자동화 후보
```

```text
V2 Architecture
≠ Pro Commercial Tier

future Power
≠ V3
```

초기에는 각 Product Service가 Product Entitlement를 소유할 수 있다.

실제 공통성이 확인된 이후 Commercial Platform 추출을 검토한다.

---

## 10. Managed Workflow Capability

Managed Workflow Capability는 Shared Core 위에서 동작하는 V2+ 기능이다.

```text
Task Linking
Session Binding
Result Collection
Context Ranking
Skill Ranking
Runtime Recommendation
Conflict Detection
Approval Queue
Task Graph
Managed Memory Candidate
```

구분:

```text
Shared Core
= Request / Run / Result 의미

Managed Workflow
= 이들을 연결·관리·추천하는 기능
```

Managed Workflow가 Shared Core의 의미를 바꾸면 안 된다.

---

## 11. Capability, Policy, Entitlement

세 개념은 Extension 전반에서 분리한다.

```text
Capability
= 기술적으로 가능한가

Execution Policy
= 현재 작업에서 허용되는가

Entitlement
= 사용자가 상품상 사용할 권리가 있는가
```

Development 예:

```text
file.edit 지원
= Capability

현재 Task는 read-only
= Execution Policy

Pro Runtime Routing 사용 가능
= Entitlement
```

Finance 예:

```text
특정 Premium Lens 실행 가능
= Capability

현재 요청은 추천성 표현 금지
= Policy

사용자가 Premium Lens Plan 보유
= Entitlement
```

---

## 12. Adapter Contract

Adapter는 Provider 또는 외부 Runtime의 차이를 Extension Core와 분리한다.

### 12.1 Development Adapter

```text
Claude Code
Codex
Gemini
Future Runtime
```

대표 Capability:

```text
prompt.initial
session.resume
file.read
file.edit
shell.execute
validation.run
result.structured
workspace.worktree
```

### 12.2 Finance Adapter

Finance에서 Adapter가 필요한 경우 대상은 Development Runtime과 다를 수 있다.

예:

```text
Market Data Provider
News Provider
OCR Provider
LLM Provider
Storage Provider
```

Finance Adapter는 Development CLI Adapter를 재사용할 필요가 없다.

### 12.3 Provider Metadata

Provider-specific Identifier는 Core Identity가 아니다.

```text
provider
provider_session_id
provider_request_id
provider_model
provider_version
```

이 정보는 Adapter Metadata다.

---

## 13. Candidate와 Promotion

모든 Extension은 Candidate와 Canonical Asset을 구분한다.

### 13.1 Development Candidate

```text
Skill Candidate
Routing Candidate
Memory Candidate
Result Review Candidate
Automation Candidate
```

### 13.2 Finance Candidate

```text
JournalCandidate
Lens Candidate
Routing Candidate
Policy Candidate
Review Insight Candidate
```

### 13.3 Promotion Flow

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
Worker Result
→ Confirmed Fact 자동 승격

Cloud Evaluation
→ Confirmed Decision 자동 승격

Lens 문서 생성
→ Runtime Active 자동 승격

Failure Trace
→ Production Skill 자동 수정
```

---

## 14. Provenance와 Truthfulness

각 Extension은 자기 Domain에 맞는 Provenance를 저장한다.

### 14.1 Development Provenance

```text
Repository
Branch
Commit
Files Read
Files Changed
Commands Run
Validation Performed
Validation Not Performed
Runtime
Provider Metadata
```

### 14.2 Finance Provenance

```text
ContextSnapshot
Lens Version
PolicyGuard Version
Market Data Timestamp
Evidence Source
Assumption
Uncertainty
User Edit
Review Date
```

공통 금지:

- 확인하지 않은 내용을 Confirmed Fact로 기록
- 실행하지 않은 검증을 Pass로 기록
- Candidate를 Canonical Decision으로 표시
- 부분 완료를 전체 완료로 표시
- 오래된 Context를 최신 Context처럼 표시

---

## 15. 데이터 소유권

목표 논리 데이터 경계:

```text
identity_db
development_control_db
finance_db
```

원칙:

```text
각 서비스가 자기 Domain 데이터를 소유
Cross-service Foreign Key 금지
Cross-service Table Read 금지
서비스 외 직접 DB 접근 금지
공용 Shared Core DB 금지
```

초기에는 하나의 물리 PostgreSQL Cluster를 사용할 수 있다.

단, 다음을 유지한다.

- 논리 Database 또는 Schema 분리
- Migration 소유권 분리
- Credential 분리
- Backup과 Retention 정책 분리 가능
- 직접 Join 금지

Shared Core를 이유로 공용 Database를 만들지 않는다.

---

## 16. Shared Contract 추출 기준

별도 `shared-contracts` Package 또는 Repository는 즉시 만들지 않는다.

다음 조건이 확인되면 추출을 검토한다.

1. 둘 이상의 제품이 실제로 동일 Contract를 사용
2. 동일 의미가 반복 구현되며 Drift가 발생
3. 독립 Version Compatibility가 필요
4. 공통 Schema 배포가 필요
5. Extension별 구현보다 공유 비용이 낮음
6. 공통 Owner가 존재
7. Release와 Deprecation 정책을 운영할 수 있음

추출 전에는 문서 Contract로 정렬한다.

```text
문서 Contract
→ 각 Extension 독립 구현
→ Drift 관찰
→ 실제 공통성 검증
→ Package / Repository 추출
```

---

## 17. Shared Service 추출 기준

별도 Shared Platform Service는 다음 조건이 있어야 한다.

- 독립 배포 필요
- 독립 Scaling 필요
- 장애 격리 필요
- 보안 경계 필요
- 데이터 소유권 독립
- 독립 Release Cadence
- 별도 운영 팀
- 외부 Product가 공통 API를 사용

다음 이유만으로는 추출하지 않는다.

- 공통 이름이 있어서
- 코드가 일부 유사해서
- 미래에 커질 것 같아서
- MSA가 더 전문적으로 보여서
- 테이블이 많아서

---

## 18. Extension 추가 규칙

새 Extension은 다음 조건을 충족해야 한다.

1. 독립 Domain 목적이 있음
2. 독립 사용자 흐름이 있음
3. 독립 Policy가 있음
4. 독립 데이터 소유권이 있음
5. Shared Core 의미를 유지함
6. 기존 Extension Domain Model을 상속하지 않음
7. 다른 Extension의 내부 API에 의존하지 않음
8. Candidate와 Human Review를 정의함
9. Provenance와 Truthfulness 기준을 정의함
10. Public / Private Contract 경계를 정의함

새 Extension 예시 후보:

```text
Legal Harness
Research Harness
Operations Harness
Healthcare Harness
```

이는 현재 Roadmap 확정 범위가 아니다.

---

## 19. 허용되는 공유와 금지되는 공유

### 19.1 허용

```text
Vocabulary
Contract Meaning
Status Semantics
Truthfulness Classification
Human Review Pattern
Candidate / Promotion Pattern
Adapter Boundary Principle
Capability Declaration Pattern
```

### 19.2 조건부 허용

```text
Serialization Schema
Shared SDK
Common Event Schema
Common Error Code
Common Policy Engine
```

실제 반복과 Versioning 필요가 확인된 경우에만 허용한다.

### 19.3 금지

```text
Shared Domain Database
Cross-service Table Read
Development DTO를 Finance에서 사용
Finance DTO를 Development에서 사용
Extension 내부 Entity를 Shared Core로 승격
Product-specific Policy를 전체 제품에 강제
Provider Session ID를 Global Identity로 사용
Universal Adapter Interface 강제
Global Capability Enum 강제
Shared Status Enum 강제
```

---

## 20. 대표 시나리오

### 20.1 Development 작업

```text
DevelopmentTask 생성
→ Runtime Capability 확인
→ Execution Policy 확인
→ Runtime 실행
→ ValidationRun
→ DevelopmentResultArtifact
→ Human Review
```

Shared Core:

```text
Request
Run
Result
Policy
Provenance
Review
```

Development 전용:

```text
Repository
Diff
Command
Validation
Worktree
```

### 20.2 Finance 분석

```text
AnalysisRequest 생성
→ ContextSnapshot
→ LensRun
→ PolicyGuardRun
→ ChecklistResult
→ JournalCandidate
→ Human Review
→ Journal
```

Shared Core:

```text
Request
Run
Result
Policy
Provenance
Review
```

Finance 전용:

```text
Lens
PolicyGuard
Checklist
Journal
```

이 흐름의 `AnalysisRequest → LensRun → PolicyGuardRun`은 실행 계보다.

실제 하위 Finance Request를 생성할 때만 Parent–Child WorkItem 관계를 사용한다.

두 흐름은 공통 의미를 공유하지만 같은 Entity를 사용하지 않는다.

---

## 21. 채택하지 않는 방향

### 21.1 하나의 UniversalTask Entity

Development와 Finance를 하나의 거대한 Task Entity로 합치지 않는다.

이유:

- 필드 대부분이 Optional이 됨
- Domain 불변조건이 약화됨
- Lifecycle 충돌
- Validation 의미 충돌
- 보안·보존 정책 혼합

### 21.2 Development Control Plane에 Finance 종속

Finance는 `oh-my-ai-control-plane`의 내부 Module로 고정하지 않는다.

### 21.3 Shared Core Database

공통 개념을 이유로 모든 Product 데이터가 한 DB에 저장되지 않는다.

### 21.4 공통 DTO 선제 추출

실제 반복과 Drift가 없는 상태에서 공통 Package를 만들지 않는다.

### 21.5 Extension 간 내부 API 호출

Finance가 Development Worktree API를 호출하거나, Development가 Finance Lens API를 호출하는 구조를 만들지 않는다.

### 21.6 Universal Adapter와 Capability Registry

Coding Runtime Adapter와 Finance Provider Adapter를 하나의 Method Set으로 합치지 않는다.

모든 제품이 동일한 Status Enum이나 Capability Enum을 구현하도록 강제하지 않는다.

---

## 22. 현재 구현과 목표 상태

이 문서는 목표 Contract와 책임 경계를 정의한다.

현재 구현 상태는 제품별 보고서에서 관리한다.

```text
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
```

현재 Shared Platform이 별도 Service나 Repository로 구현되지 않은 것은 결함이 아니다.

현재 public `oh-my-ai` Repository는 Development Extension의 Local CLI / Runtime 구현을 소유한다.

이는 `oh-my-ai`가 Shared Platform 전체의 영구적 물리 소유자이거나 Finance Runtime의 상위 실행 기반이라는 의미가 아니다.

현재 Finance Runtime이 아직 물리화되지 않은 것도 이 문서의 구조적 충돌이 아니다.

---

## 23. 불변조건

1. Shared Core는 공통 Vocabulary와 Contract다.
2. Shared Core는 공용 Database가 아니다.
3. Shared Core는 현재 별도 Network Service가 아니다.
4. Development와 Finance는 형제 Extension이다.
5. 각 Extension은 자기 Domain Model과 데이터를 소유한다.
6. Finance는 Development 전용 개념을 상속하지 않는다.
7. Development는 Finance 전용 개념을 상속하지 않는다.
8. V1에서는 Shared Core를 Artifact에 투영한다.
9. V2부터 관리형 Entity가 도입된다.
10. Commercial Capability는 Shared Core가 아니다.
11. Domain-neutral Entitlement Check도 V2+ Commercial Capability에 속한다.
12. Managed Workflow Capability는 Shared Core 위에서 동작한다.
13. Capability, Policy, Entitlement를 분리한다.
14. Provider Metadata는 Core Identity가 아니다.
15. Candidate는 Human Review 전까지 Canonical Truth가 아니다.
16. Shared Package와 Service는 실제 반복·Drift·운영 요구 이후에만 추출한다.
17. Cross-service Foreign Key와 직접 Table Read를 금지한다.
18. Extension 추가 시 독립 Domain·Policy·데이터 소유권이 필요하다.
19. Parent–Child WorkItem 관계와 Request–Run 실행 계보를 구분한다.
20. Status, Adapter, Capability는 하나의 공용 Enum이나 Universal Interface를 의미하지 않는다.
21. 현재 public `oh-my-ai`는 Development Extension 구현이며 Shared Platform 전체의 물리 소유자가 아니다.

---

## 24. 미결정 사항

1. Shared Contract 직렬화 형식
2. 공통 Error Model
3. 공통 Event Schema
4. `shared-contracts` 추출 시점
5. Shared Platform Service 추출 시점
6. Common Policy Engine 필요 여부
7. Extension SDK 필요 여부
8. Contract Versioning 방식
9. Compatibility Matrix 형식
10. Third-party Extension 공개 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 25. 관련 문서

```text
docs/master/product-architecture-master.md
docs/architecture/repository-service-boundaries.md
docs/architecture/local-cloud-human-boundary.md
docs/roadmap/product-roadmap.md
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
docs/decisions/decision-log.md
```

---

## 26. 검수 관점

### 하네스 메인 브랜치

- Shared Core가 현재 구현에 불필요한 Entity나 Service를 요구하는가
- Development Extension의 실제 개념과 충돌하는가
- V1 Artifact Projection과 V2 Managed Entity 경계가 적절한가
- Runtime Adapter와 Capability 책임이 적절한가

### Finance 하네스

- Finance가 독립 Extension으로 유지되는가
- Development 전용 모델이 침투하지 않는가
- Knowledge Contract와 Runtime 책임이 분리되는가
- Finance 데이터·Policy·Human Review 소유권이 적절한가

### Identity

- Identity와 Commercial Capability가 Shared Core로 잘못 분류되지 않았는가
- Extension이 Identity DB에 직접 의존하지 않는가
- Product Entitlement와 공통 Authentication 경계가 유지되는가
