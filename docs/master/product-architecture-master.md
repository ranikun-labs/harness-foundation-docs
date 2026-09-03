---
title: Product Architecture Master
status: draft
implementation_status: mixed
owner: product
last_reviewed: 2026-09-03
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0002
  - ADR-0003
  - ADR-0004
  - ADR-0005
  - ADR-0006
  - ADR-0007
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - ADR-0012
  - ADR-0013
  - ADR-0014
  - ADR-0015
  - ADR-0017
source_inputs: []
---

# Product Architecture Master

## 1. 문서 목적

이 문서는 `oh-my-ai` 제품군의 최상위 제품·아키텍처 기준본이다.

다음 질문에 대한 통합 답변을 제공한다.

1. 이 제품군이 해결하려는 문제는 무엇인가
2. V1, V2, V3 Architecture Version과 Commercial Tier는 어떻게 다른가
3. Development Harness와 Finance Harness는 어떤 관계인가
4. Shared Platform과 Shared Core는 무엇인가
5. Local, Cloud, Human은 각각 무엇을 담당하는가
6. 어떤 기능이 무료 Local Workflow이고 어떤 기능이 Managed Workflow인가
7. Identity, Entitlement, Billing은 어디에 속하는가
8. Runtime Adapter, Capability, Execution Policy는 어떻게 분리되는가
9. Cloud가 생성하는 판단을 어떤 수준의 사실로 취급하는가
10. 장기적으로 어떤 Repository와 Service 경계로 발전하는가

이 문서는 제품군 전체를 이해하기 위한 진입점이다.

세부 구현 계약, Repository 경계, 버전별 완료 조건, 개별 아키텍처 결정은 하위 문서와 ADR에서 상세화한다.

---

## 2. 문서 위상

Source of Truth 우선순위는 다음 원칙을 따른다.

```text
Accepted ADR
→ Canonical Product Architecture Master
→ Product / Technical Roadmap
→ Architecture Documents
→ Product / Extension Documents
→ Decision Log
→ Session Handoff
→ Accepted Source Input
→ Raw Source Input
→ Chat / Notion
```

이 문서는 Accepted ADR을 임의로 덮어쓰지 않는다.

이 문서와 Accepted ADR이 충돌하면 ADR이 우선한다.

이 문서가 새로운 결정으로 변경될 경우:

1. 관련 ADR 추가 또는 대체
2. Decision Log 갱신
3. 관련 하위 문서 정합성 확인
4. 이전 문서의 `superseded_by` 갱신

을 수행한다.

---

## 3. 제품 정의

`oh-my-ai` 제품군은 AI 모델 자체를 제공하는 제품이 아니다.

Claude Code, Codex, Gemini 또는 향후 다른 Runtime을 대체하는 모델 제품도 아니다.

제품의 핵심 역할은 다음과 같다.

```text
사용자의 의도
→ 구조화된 작업 단위
→ 적절한 Context / Skill / Runtime
→ 안전한 실행
→ 검증 가능한 결과
→ 사람의 승인과 지식 축적
```

제품군의 장기 포지셔닝:

> AI 작업을 더 많이 자동화하는 도구가 아니라, 여러 AI Runtime을 사용자 통제 아래에서 연결·실행·검수·학습시키는 화이트박스 Control Plane이다.

핵심 차별점:

- Runtime 종속 최소화
- 사람 검수와 책임 유지
- 결과의 Truthfulness 분류
- Local 데이터 경계
- 명시적 Execution Policy
- Session 간 구조화된 Handoff
- 실패와 검증 결과의 추적
- Domain Extension 가능성
- Candidate를 검증 후 승격하는 학습 구조

---

## 4. 해결하려는 문제

현재 AI 작업은 다음 문제가 있다.

### 4.1 대화와 실행이 분리돼 있다

메인 대화에서 설계한 내용을 Claude Code나 Codex에 다시 수동으로 설명해야 한다.

작업을 넘길 때 다음이 자주 유실된다.

- 확정된 결정
- 수정 금지 범위
- 현재 Repository 상태
- 검증 기준
- 미해결 이슈
- 사용자 승인 조건

### 4.2 Runtime마다 사용 방식이 다르다

각 Runtime은 다음이 다르다.

- Prompt 전달 방식
- Session Resume 방식
- 파일 편집 권한
- Shell 실행
- Worktree 지원
- Validation 방법
- Result 출력 형식
- Event Stream
- 승인 방식

Provider 이름 중심으로 구현하면 Core에 조건문이 확산된다.

### 4.3 AI 결과가 사실처럼 취급되기 쉽다

다음이 자주 혼합된다.

```text
실제로 확인한 사실
추론
사용자 결정
AI 제안
실행한 검증
실행하지 않은 검증
부분 완료
전체 완료
```

결과가 그럴듯하다는 이유만으로 Truth로 승격되면 운영 위험이 커진다.

### 4.4 Local 데이터와 Cloud 편의성 사이의 경계가 불명확하다

사용자는 Managed 기능을 원하지만 다음 정보가 무분별하게 Cloud로 전송되는 것을 원하지 않는다.

- Repository 원문
- 전체 Prompt
- Diff
- Terminal Log
- Secret
- 금융 기록
- 민감한 사용자 Context

### 4.5 Domain별 안전성과 작업 모델이 다르다

Development와 Finance는 공통 작업 구조를 일부 공유하지만 실제 실행 모델은 다르다.

Development는 다음을 다룬다.

- Repository
- Branch
- Commit
- Worktree
- Agent Process
- Diff
- Validation

Finance는 다음을 다룬다.

- AnalysisRequest
- ContextSnapshot
- LensRun
- PolicyGuard
- Checklist
- Journal
- Review

Finance를 Development 실행 모델 위에 얹으면 불필요한 결합이 발생한다.

---

## 5. 제품군 구조

논리적 제품 구조:

```text
Shared Platform
├── Cross-version Shared Core
├── V2+ Commercial Capabilities
├── Managed Workflow Capabilities
├── Development Extension
└── Finance Extension
```

이 구조는 논리적 책임과 Contract를 의미한다.

현재 별도 `shared-platform-service` 또는 `shared-core-service`가 존재해야 한다는 의미는 아니다.

목표 제품군:

```text
Development Harness
├── V1 Local Manual Workflow Architecture
├── V2 Personal Managed Workflow Architecture
└── V3 Team / Enterprise Governance Architecture

Commercial Tiers
├── Community
├── Signed-in Free
├── Pro
└── future Power

Finance Harness
├── Learn
├── Checklist
├── Journal
└── Review

Shared Product Capabilities
├── Identity
├── Device
├── Entitlement
├── Subscription
├── Usage / Quota
└── Managed Intelligence
```

Development와 Finance는 상하 관계가 아니다.

```text
Development ↛ Finance
Finance ↛ Development

Development → Shared Platform Contract
Finance → Shared Platform Contract
```

---

## 6. 제품 원칙

## 6.1 Human-in-the-loop

중요한 실행과 결과 반영은 사용자가 통제한다.

사용자가 다음을 검토·수정·거부할 수 있어야 한다.

- 작업 목표
- Scope
- Context
- Runtime
- Parent Task
- Worker 선택
- 실행 권한
- 결과 귀속
- Result Accept / Edit / Reject
- Memory 또는 Skill 승격

## 6.2 Local-first

Local-first는 모든 기능을 영원히 Local-only로 만든다는 뜻이 아니다.

정확한 의미:

> 사용자의 원본 데이터와 Domain Execution 경계를 Local에 우선 유지하고, Cloud 전송과 저장은 명시적 Contract와 사용자 선택에 따라 제한한다.

V1은 Cloud 없이 완전히 동작한다.

V2는 실행을 Local에 유지하면서 Managed Metadata와 Intelligence가 Private Cloud에 의존할 수 있다.

## 6.3 Provider-neutral

Core는 Provider 이름이 아니라 Capability를 기준으로 동작한다.

금지 방향:

```text
if provider == claude
if provider == codex
if provider == gemini
```

권장 방향:

```text
Runtime Adapter
→ Capability 선언
→ Execution Policy 확인
→ Entitlement 확인
→ Runtime 선택
```

## 6.4 Truthfulness before automation

AI 결과는 자동으로 Confirmed Fact나 Confirmed Decision이 되지 않는다.

```text
Worker Result
≠ Confirmed Fact

Cloud Evaluation
≠ Confirmed Decision

Validation Requested
≠ Validation Performed

Partial Completion
≠ Complete
```

## 6.5 Candidate before promotion

Memory, Skill, Routing, Automation은 즉시 공식 자산으로 승격하지 않는다.

```text
Trace
→ Candidate
→ Fixture
→ Evaluation
→ Regression
→ Human Review
→ Promotion
```

## 6.6 Coarse-grained boundaries first

제품 수준에서는 책임과 배포 경계를 분리한다.

각 서버 Repository 내부는 Modular Monolith로 시작한다.

실제 운영 요구 없이 세부 Microservice를 선제적으로 만들지 않는다.

---

## 7. 버전 전략 개요

Architecture Version:

```text
V1
= Local Manual Artifact Workflow

V2
= Personal Managed Workflow Architecture
= Local Managed Workflow와 관리·검증 기능

V3
= Team / Workspace / Organization Governance Architecture
```

Commercial Tier:

```text
Community
= 로그인 없는 Local Manual Workflow

Signed-in Free
= Authentication 완료
+ 활성 유료 Subscription 없음
+ Community 기능 유지

Pro
= Local Managed Workflow의 관리·검증

future Power
= 개인용 Cloud Sync·복구·고급 자동화 후보
```

다음 비동치를 유지한다.

```text
V2
≠ Pro만 의미하는 상품 Tier

Power
≠ V3

Update
≠ Login

Login
≠ Subscription
```

버전 차이는 기능 개수보다 관리 책임의 수준으로 구분한다.
Commercial Tier는 같은 Architecture 위에서 제공되는 상품 포장과 사용 권한을 의미한다.

이후 V1, V2, V3 섹션은 각 버전의 목표 제품 경계를 정의한다.
문서에 기능이 포함돼 있다는 사실은 현재 Repository에 구현 완료됐다는 의미가 아니다.

현재 구현 상태와 완료 Gap은 다음 하위 문서에서 별도로 관리한다.

```text
docs/product/development-harness-report.md
docs/product/v1-completion-criteria.md
```

| 버전 | 핵심 관리 단위 | 실행 | Cloud | 사람 역할 |
|---|---|---|---|---|
| V1 | Markdown Artifact | 수동 실행 | 없음 | 전달·검수·반영 |
| V2 | Task / Run / Result Entity | Local Runtime | 선택적 Managed Metadata·Candidate | 승인·Accept/Edit/Reject |
| V3 | Workspace / Project / Organization | Policy 기반 Local/Managed | 조직 Governance | 조직 정책·감사·승인 |

---

## 8. V1 Community

## 8.1 제품 정의

DEC-051 기준 Lean V1은 무료 Local Manual Artifact Workflow다.

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

V1의 핵심 가치는 자동 실행이 아니다.

다음 품질을 높이는 것이 목적이다.

- 작업 전달 정확도
- Scope 통제
- 수정 금지 범위 보존
- 검증 상태 명시
- 결과의 재사용성
- Session 간 Context 손실 감소

## 8.2 V1 포함 기능

```text
Local Installation
Instruction Cascade
Skill Registry
Basic Skill Routing
Prompt Routing Hook
Work-start
Project Context
Structured Handoff Candidate
Manual Copy/Paste
Local Candidate Artifact
Result Basic
Result Basic 수동 Template
Minimal Fixtures
Manual E2E Demo
Doctor
Provenance Sections
Truthfulness Sections
Human Review
재현 가능한 최소 설치·실행 경로 1개
Local Product Notice Channel
Runtime-readable Version Source
```

`Local Product Notice Channel`은 Local Product Services 경계에 속하며
Workflow Contract 흐름에 포함되지 않는다.

```text
Notice
≠ Cloud Control Plane
≠ 자동 Update
≠ Telemetry
≠ Workflow State
```

`재현 가능한 최소 설치·실행 경로 1개`는
npm과 Homebrew 동시 지원, 복수 OS Installer,
자동 업데이트, 완성된 범용 CLI Product Shell을 의미하지 않는다.

## 8.3 V1 제외 기능

```text
User / Auth
Billing / Entitlement
Task ID Lifecycle
SessionBinding
ExecutionRun Entity
ExecutionWorkspace Entity
ResultArtifact ID
Automatic Prompt Delivery
Automatic Result Collection
Managed Result Return
Task / Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Runtime Invocation
Worktree Lifecycle Management
Agent Orchestration
Cloud Sync
Managed Memory
Learning Loop
Sidecar / Daemon Requirement
Cloud Notice API
사용자별 서버 Audience
자동 Update / 자동 V2 설치
Push Notification
```

## 8.4 V1 Shared Core 구현 수준

V1에서 Shared Core는 관리형 Entity가 아니다.

공통 개념은 Markdown과 Local Metadata에 투영된다.

```text
WorkItem / Request
→ Handoff Goal / Scope / Constraints

Run
→ 수행 기록

Result
→ Result Basic

Human Review
→ 사용자 수동 검수

Provenance
→ Confirmed Fact / Evidence / Assumption

Truthfulness
→ Verified / Not Verified / Blocked / Remaining Risk
```

V1에 Database, Global ID, Lifecycle State Machine을 도입하지 않는다.

---

## 9. V2 Personal Managed Workflow와 Pro

## 9.1 제품 정의

V2는 개인 사용자를 위한 Task ID 중심 Managed Workflow Architecture다.

```text
V2 Architecture
= Local Managed Workflow
+ Task / Run / Result Entity
+ Human Review
+ 선택적 Managed Metadata
```

Pro는 V2 Architecture 위에서 제공되는 Commercial Tier다.
Pro의 핵심 가치는 Local Workflow의 관리와 검증이다.

V2 CLI로 업데이트해도 Community Local 기능은 로그인 없이 유지된다.
Authentication은 Pro 기능 진입 시 요구할 수 있으며,
Login은 Subscription 또는 Entitlement와 동일하지 않다.

V2 Managed Workflow에서는 Handoff와 Result가 단순 문서에서 관리형 Entity로 승격될 수 있다.

```text
WorkItem / Task
Task Registry
SessionBinding
ExecutionRun
Optional ExecutionWorkspace
ResultArtifact
HumanReview
Managed Result Return
Task / Result Correlation
Completion Detection
Review Queue
Context Import
Runtime Invocation
Worktree 자동 생성
Worker Branch Lifecycle
복수 Worker Coordination
Merge / Apply Gate
```

## 9.2 기본 흐름

```text
Main Task
→ Worker Task 생성
→ Local Runtime 실행
→ 초기 Prompt 또는 Task Artifact 전달
→ Result 수집
→ Task ID 기준 Parent Task 연결
→ Result Candidate 생성
→ Human Review
→ Accept / Edit / Reject
```

Main Session과 Worker Session은 직접 통신하지 않는다.

```text
Worker
→ Task ID에 Result 작성

oh-my-ai
→ Task ID 기준 Parent와 연결

Main
→ Result Candidate 검수
```

## 9.3 V2 Core Launch

```text
Task Identity
Worker Task
SessionBinding
ExecutionRun
Local Invocation
ResultArtifact
Parent–Child Linking
Human Review
Minimal Metadata Sync
```

Commercial Pro Launch에서는 다음이 추가될 수 있다.

```text
Authentication
User-bound Device
Pro Commercial Access
Entitlement Check
Subscription
Billing
Usage / Quota
```

위 항목은 Local Invocation PoC 또는 V2 Technical Core의 선결 조건이 아니다.

## 9.4 V2 Expansion

```text
Context Ranking
Skill Ranking
Conflict Detection
Runtime Recommendation
Result Evaluation Candidate
Approval Queue
Task Graph
Cross-device Metadata
```

## 9.5 Late V2 / V2+

```text
Learning Loop
Failure Mining
SkillOpt Evaluation
Candidate Promotion
Managed Memory
Advanced Routing
Automation Candidate
```

Learning Loop과 Managed Memory를 V2 최초 출시의 선결 조건으로 만들지 않는다.

## 9.6 future Power 후보

future Power는 새 Architecture Version이 아니다.
V2 또는 V2.x Architecture 위에 올라갈 수 있는 향후 상위 Commercial Tier 후보이다.

후보:

```text
Encrypted Cloud Sync
Cross-device Resume
Cloud Backup / Restore
Web Review
개인용 Remote Worker
고급 자동화
```

Power라는 최종 상품명, 가격, 출시 시점은 확정하지 않는다.
조직 공유 Worker, RBAC, Audit, Organization Policy는 V3에 남긴다.

---

## 10. V2 기술 PoC와 상품 출시의 구분

상품 정의와 기술 검증 순서는 다르다.

V2 Architecture는 Pro Commercial Tier와 동일하지 않다.
Pro 기능 진입에는 Auth와 Entitlement가 필요할 수 있지만
V2 CLI 업데이트 자체는 Login 또는 Subscription을 요구하지 않는다.

그러나 구현 검증은 다음 순서로 진행할 수 있다.

### 10.1 Local Invocation PoC

```text
1. Local Task 또는 Input Artifact 생성
2. Claude Code / Codex 초기 Prompt 전달
3. Local Correlation Identifier 발급
4. Provider Metadata 기록
5. Result 수집
6. Task / Result 귀속
7. Human Review
```

이 PoC는 V2 후보 기능 검증이며 V1 Release Requirement가 아니다.

이 단계의 Identifier는 영구 Session Identity가 아니다.

```text
local_correlation_id
experimental_session_reference
local_execution_reference
```

### 10.2 Cloud Metadata PoC

```text
8. Task Metadata Sync
9. Device 등록
10. Session Linking Candidate
11. Cross-device Resume Candidate
```

### 10.3 Commercialization

```text
12. Pro 기능 진입
13. Authentication
14. Signed-in Free
15. Trial 또는 제한적 Pro 사용
16. Subscription 선택
17. Pro Commercial Access
18. Package Channel 후보
19. Offline Grace 후보
```

Shared Identity 물리 구현은 Local Invocation PoC의 선결 조건이 아니다.
구체 Trial 기간, 무료 사용량, Grace 기간, 가격은 이 문서에 고정하지 않는다.

Subscription 종료는 Local 데이터 삭제 권한이 아니다.
기존 데이터 열람과 Community 기능은 유지하며,
신규 Pro 관리 작업만 제한할 수 있다.

---

## 11. V3 Team / Enterprise

V3는 개인 Managed Workflow를 조직 Governance로 확장한다.

포함 후보:

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

V2 초기 범위에 다음을 넣지 않는다.

```text
Organization Governance
Team-wide Policy
Enterprise Audit
SSO
Self-hosted Control Plane
```

---

## 12. Cross-version Shared Core

Cross-version Shared Core:

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

Shared Core는 다음을 의미한다.

- 공통 Vocabulary
- 공통 Contract
- 공통 상태 의미
- 공통 안전 원칙
- Extension 간 호환 지점

Shared Core는 다음을 의미하지 않는다.

- 하나의 공용 Database
- 하나의 공용 Service
- 모든 제품이 동일 Entity를 저장
- Finance가 Development 모델을 상속
- 모든 버전이 관리형 ID를 보유

버전별 구현:

```text
V1
= Artifact Projection

V2
= Managed Entity

V3
= Organization-governed Entity
```

---

## 13. Development Extension

Development Extension은 Software Development Workflow를 다룬다.

다음은 Development Extension의 Cross-version 개념이다.

V1에서는 Repository, Branch, Commit, 수행 명령, Diff와 Validation 등이
Local Context 또는 Markdown Artifact에 투영될 수 있다.

ExecutionWorkspace, WriterLease Lifecycle,
관리형 ResultArtifact와 Agent Process 추적은
각 버전의 완료 조건에서 명시적으로 채택된 경우에만 구현한다.

```text
DevelopmentTask
Repository
RepositorySnapshot
Branch
Commit
ExecutionWorkspace
Git Worktree
AgentProcess
FilesChanged
Diff
CommandsRun
Validation
WriterLease
ResultArtifact
```

핵심 책임:

- Repository Context 수집
- Runtime 선택
- 파일 읽기·편집
- Shell과 Validation
- Worktree와 Writer Safety
- Diff와 Result 수집
- Provider Adapter
- Development-specific Policy

Development Extension은 Writer 충돌을 방지해야 한다.

동일 작업의 순차 검수는 동일 Workspace를 사용할 수 있으나,
독립적인 구현·Ticket·동시 Writer는 격리된 Workspace를 사용한다.

구체적인 Worktree와 Writer Mode 계약은
Development Harness 하위 아키텍처 문서에서 관리한다.

---

## 14. Finance Extension

Finance Extension은 금융 교육·판단 전 점검·기록·복기를 다룬다.

제품 목적:

```text
Learn
→ Checklist
→ Journal
→ Review
```

주요 개념:

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
```

Finance의 목적은 다음이 아니다.

- 수익률 예측
- 매수·매도 추천
- 자동 투자 판단
- 사용자 책임 대체

Finance는 다음 Development 전용 개념을 상속하지 않는다.

```text
Repository
Branch
Commit
Worktree
Diff
WriterLease
AgentProcess
```

Finance가 Shared Platform에서 사용하는 것은 Domain-neutral Contract다.

Finance Lens, PolicyGuard, Catalog, Routing, Fixture,
Regression과 Professional Standards의 문서 Source of Truth는
`finance-harness-docs`가 소유한다.

`finance-harness`는 검증·활성화된 계약을 실행하고,
AnalysisRequest, LensRun, PolicyGuardRun,
ChecklistResult, Journal과 ReviewRecord를 소유한다.

Cross-version Shared Contract:

```text
Request
Run
Result
Human Review
Policy
Provenance
Candidate / Promotion
```

V2+ Commercial Capability:

```text
Entitlement Check
```

Finance 데이터는 Development Repository 데이터와 다른 저장·보안·삭제 정책을 가질 수 있다.

---

## 15. Local / Cloud / Human 책임

제품 슬로건:

```text
Cloud recommends and coordinates.
Local enforces and executes.
Human authorizes and accepts.
```

기술적 의미:

### 15.1 Cloud

```text
Managed Workflow 연결
Task Metadata
Parent–Child Linking Candidate
Context / Skill Ranking Candidate
Runtime Recommendation
Conflict Detection
Result Review Candidate
Approval State
Identity / Device
Entitlement / Subscription
Billing
Metadata Persistence
```

Cloud가 생성한 판단은 Candidate다.

### 15.2 Local

```text
사용자 Repository
Git 상태와 조작
Agent Process
Worktree
Diff
Secret
Validation
Redaction 전 출력
Domain Execution
Execution Policy Enforcement
```

### 15.3 Human

```text
Goal과 Scope 승인
민감한 실행 승인
Context 추가·제거
Runtime Override
Result Accept / Edit / Reject
Artifact Export
Memory / Skill Promotion 승인
```

---

## 16. Transfer Mode와 Retention Mode

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

Retention Mode:

```text
No-store
Ephemeral
Session-scoped
User-managed
Policy-retained
```

사용자에게 다음을 표시해야 한다.

- 전송되는 데이터
- 전송되지 않는 데이터
- Redaction 여부
- 저장 여부
- 보존 기간
- 삭제 방법

Development와 Finance는 서로 다른 기본 Transfer / Retention 정책을 가질 수 있다.

---

## 17. Adapter와 Capability

Runtime Adapter는 Provider-specific 동작을 캡슐화한다.

대표 Capability 예시:

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

전체 Capability 목록과 Version Compatibility 규칙은
별도 Runtime Capability Contract에서 관리한다.

V1:

```text
Static Capability Metadata
Runtime Instruction Projection
```

V2:

```text
Capability Detection
Capability-based Runtime Selection
Execution Policy Enforcement
Managed Recommendation
```

Provider Session ID는 Core Identity가 아니다.

V2 Local Invocation PoC:

```yaml
local_correlation_id: local-only-reference
provider: claude | codex | gemini
provider_session_id: optional
```

V2 Managed Workflow:

```yaml
session_binding_id: oh-my-ai-managed-reference
provider: claude | codex | gemini
provider_session_id: optional
```

`provider_session_id`는 두 단계 모두에서 Adapter Metadata다.

---

## 18. Capability, Execution Policy, Entitlement

세 개념을 분리한다.

```text
Capability
= Runtime이 기술적으로 수행 가능한가

Execution Policy
= 이번 작업에서 수행이 허용되는가

Entitlement
= 사용자가 상업적으로 사용할 권리가 있는가
```

예:

```text
Runtime이 file.edit 지원
= Capability

현재 Task가 reviewed-writer만 허용
= Execution Policy

사용자가 Pro Runtime Routing 사용 가능
= Entitlement
```

하나의 Feature Flag로 세 책임을 합치지 않는다.

V1에는 Commercial Entitlement가 없다.

V1에서 Entitlement 미구현은 결함이 아니다.

---

## 19. Provenance와 Truthfulness

모든 Handoff와 Result는 다음 구분을 유지한다.

```text
Confirmed Fact
Confirmed Decision
Assumption
Open Issue
Constraint
Evidence Source
Validation Performed
Validation Not Performed
Blocked
Remaining Risk
```

금지:

```text
실행하지 않은 테스트를 Pass로 기록
확인하지 않은 파일이나 동작을 완료로 보고
추론을 검증된 사실처럼 표현
부분 완료를 전체 완료로 승격
실패하거나 생략한 검증을 숨김
```

Cloud Evaluation과 Worker Result는 Human Review 전까지 Candidate다.

---

## 20. Managed Intelligence

Managed Intelligence는 다음 후보를 생성할 수 있다.

```text
Task Linking Candidate
Context Candidate
Skill Candidate
Runtime Recommendation
Result Review Candidate
Memory Candidate
Routing Candidate
Automation Candidate
```

Managed Intelligence의 역할:

- 연결
- 선별
- 추천
- 충돌 탐지
- 평가 후보 생성

역할이 아닌 것:

- 최종 Truth 결정
- 사용자 승인 대체
- Repository 공식 결정 자동 변경
- Production Skill 자동 수정

---

## 21. Learning과 Promotion

학습 구조:

```text
Session / Failure Trace
→ Candidate
→ Reproducible Fixture
→ Evaluation
→ Regression
→ Human Review
→ Promotion
```

공식 Memory 또는 Skill로 승격하려면:

```text
Human Approval
→ Canonical Repository 반영
→ Review
→ Commit
```

Managed Memory는 다음을 대체하지 않는다.

- ADR
- Canonical Product Document
- Repository Contract
- 공식 Project Decision

---

## 22. Identity와 Commercial Platform

Identity의 독립 논리 경계:

```text
User Identity
Credential
Authentication
Token
Device
Membership
Common Authorization
```

제품별 책임:

```text
Development
- Development Pro 기능
- Runtime Policy
- Development Usage

Finance
- Premium Lens
- Analysis / Journal 한도
- Finance Usage
```

초기에는 Product Entitlement가 각 Product Service에 존재할 수 있다.

실제 공통성이 확인되면 다음을 추출할 수 있다.

```text
Commercial Platform
├── Plan
├── Subscription
├── Billing
├── Entitlement
├── Usage / Quota
├── Package Manifest
├── Package Channel
├── License Renewal
└── Offline Grace
```

Shared Identity 물리 분리는 `ADR-0017` / `DEC-067`에 따라 승인된 목표 경계다.

Local Invocation PoC의 선결 조건은 아니다.

Canonical 논리 서비스명은 `Shared Identity`다 (`DEC-059`). 기존
`identity-platform` 후보는 `DEC-067`로 부분 대체됐고, 물리 Target은
`ranikun-labs/platform-services`의 `platform-core/identity`다. Repository container는
존재하고 visibility `public`은 관찰 사실일 뿐 정책은 `not_decided`다. Current
Platform Services main에는 `gateway-app`, `platform-core/identity`,
`platform-core/shared-ai`가 있다. 현재 Carelog 경로는 여전히
`ranikun-labs/carelog-be`에 있고 Gateway·Identity의 승인된 extraction/cutover와
production Runtime·배포·출시는 별도 Evidence가 필요하다. RPL-107 synchronous
OpenAI Slice A는 `platform-core/shared-ai`의 구현 상태이며, Commerce·Audit와
full Shared AI Runtime adoption은 `deferred`다.

---

## 23. Repository와 Service 경계 요약

목표 Repository 경계:

```text
oh-my-ai
= Development Local CLI / Runtime

oh-my-ai-control-plane
= V2 Development Managed Workflow Control Plane

finance-harness
= Finance Product Backend / Runtime

ranikun-labs/platform-services
= Shared Java Platform (repository existing; current main contains Gateway, Identity and Shared AI modules)
  - gateway-app: independent SCG / WebFlux process
  - platform-core: independent Spring MVC process
    - identity ACTIVE target
    - shared-ai Phase 1 same-JVM logical module; RPL-107 synchronous OpenAI Slice A IMPLEMENTED
    - commerce DEFERRED
    - audit DEFERRED

finance-harness-docs
= Finance Lens / PolicyGuard / Fixture

ranikun-labs/harness-foundation-docs
= Ranikun Labs Platform Foundation / ADR / Governance

carelog
= 기존 Product Service (Auth Phase A 논리 분리 단계)
  세부는 docs/architecture/repository-service-boundaries.md §7.7 참고
```

원칙:

```text
제품 수준
= Multi-repository target
= Coarse-grained deployment boundary

각 서버 Repository 내부
= Modular Monolith first

Shared Platform
= Logical Contract Boundary
```

세부 기준은 `docs/architecture/repository-service-boundaries.md`에서 관리한다.

---

## 24. Public / Private 문서 경계

Public 여부는 버전이 아니라 Contract 성격으로 판단한다.

Public:

```text
V1 기능과 비범위
Handoff / Result Contract
Adapter / Capability Contract
Execution Policy
Privacy / Transfer Mode Contract
Extension 개발 규칙
Compatibility / Version Policy
Public CLI 사용법
```

Private:

```text
가격과 수익화 전략
Cloud Ranking 내부 알고리즘
Provider 사업 의존성
상세 Billing 전략
비공개 V2 / V3 우선순위
핵심 IP 구현 방식
내부 위험 평가
```

---

## 25. 채택하지 않는 방향

현재 채택하지 않는다.

### 25.1 V1부터 Managed Task Lifecycle 도입

V1의 목적과 범위를 오염시킨다.

### 25.2 Finance를 Development Harness 위에 구현

Domain과 실행 모델이 다르며 유지보수 결합이 커진다.

### 25.3 Shared Core를 즉시 별도 Microservice로 구현

공통 Vocabulary를 Network Dependency로 강제한다.

### 25.4 Provider 이름 중심 Core

Runtime 추가 시 Core 조건문이 확산된다.

### 25.5 Cloud Candidate 자동 Truth 승격

사용자 책임과 검증 가능성을 훼손한다.

### 25.6 Sidecar를 초기 V2 선결 조건으로 설정

Local Invocation과 Result Collection 검증보다 구현 비용이 앞선다.

### 25.7 Identity, Billing, Entitlement를 모두 즉시 독립 Microservice로 분할

초기 제품 속도와 운영 복잡도를 악화시킨다.

---

## 26. 단계별 제품화 전략

### Phase 1 — V1 Community

```text
Local Manual Artifact Workflow
Public Contract
Minimal Fixtures
Manual E2E Demo
Doctor
재현 가능한 최소 설치·실행 경로 1개
V1 Release
```

### Phase 2 — V2 Local Invocation PoC

```text
Local Correlation
Prompt Injection
Provider Metadata
Result Collection
Runtime Invocation
Managed Result Return 후보 검증
Human Review
```

### Phase 3 — V2 Core Launch

```text
Task Identity
SessionBinding
ExecutionRun
ResultArtifact
Metadata Sync
Identity / Device
Entitlement
```

### Phase 4 — V2 Expansion

```text
Ranking
Conflict Detection
Recommendation
Approval Queue
Task Graph
```

### Phase 5 — Finance Product Physicalization

이 Phase는 목표 Backend와 Deployment 경계의 물리화 순서를 나타낸다.

Finance Lens·PolicyGuard·Fixture 정리,
Finance Contract MVP와 Local Finance Experiment가
Development V2 Expansion 완료를 기다려야 한다는 의미는 아니다.

Finance는 필요한 Identity 또는 Domain-neutral Contract가 준비되면
Development 전용 구현과 독립적으로 진행할 수 있다.

```text
AnalysisRequest
LensRun
PolicyGuard
Checklist
Journal
Review
```

### Phase 6 — V3 Governance

```text
Workspace
Project
Organization Policy
Audit
RBAC
SSO
Self-hosted
```

---

## 27. 제품 성공 기준

이 문서에서는 구체 KPI 수치를 확정하지 않는다.

제품 수준 성공 판단 범주는 다음과 같다.

### V1

- Handoff 재작성 감소
- Scope 누락 감소
- 검증 상태 명시율
- Result 재사용 가능성
- 수동 Copy/Paste 왕복 성공률

### V2

- Task / Result 자동 귀속 정확도
- Local Invocation 성공률
- Result Collection 성공률
- Human Review 처리 시간
- Candidate Override 가능성
- 데이터 전송 투명성

### Finance

- Checklist 사용률
- Journal 전환율
- Review 재방문율
- PolicyGuard 위반 감소
- 단정적 추천 표현 감소

구체 수치는 Roadmap 또는 Product Metrics 문서에서 확정한다.

---

## 28. 미결정 사항

다음은 아직 확정하지 않는다.

1. 최종 Product 및 Organization 이름
2. V2 Control Plane 최종 기술 스택
3. Shared Identity 최초 물리 분리 시점
4. Billing Provider
5. Product별 가격
6. Entitlement의 장기 물리 소유 위치
7. Shared Contract 직렬화 형식
8. Finance Backend 초기 Infrastructure
9. Shared Platform Service 추출 시점
10. Sidecar 도입 시점
11. 정식 SessionBinding Identifier Schema
12. Managed Memory 저장 모델
13. Enterprise Self-hosted 배포 방식
14. Public / Private Repository 최종 목록
15. Product KPI 목표 수치

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 29. 불변조건

1. V1은 무료 Local Artifact Workflow다.
2. V2부터 Task ID 중심 Managed Workflow가 시작된다.
3. V3는 Organization Governance다.
4. Development와 Finance는 형제 Extension이다.
5. Finance는 Development 전용 실행 모델에 의존하지 않는다.
6. Shared Platform은 현재 Logical Contract Boundary다.
7. Shared Core는 V1에서 Artifact에 투영되고 V2부터 Managed Entity로 승격된다.
8. Provider Session ID는 Core Identity가 아니다.
9. Sidecar는 초기 V2 선결 조건이 아니다.
10. Capability, Execution Policy, Entitlement를 분리한다.
11. Cloud 결과는 Candidate이며 자동 Truth가 아니다.
12. Local은 사용자 데이터 경계와 Domain Execution을 집행한다.
13. 중요한 실행과 결과 반영은 사람이 승인한다.
14. 제품 수준은 Multi-repository 목표를 사용한다.
15. 각 서버 Repository는 Modular Monolith로 시작한다.
16. 각 서비스는 자기 Domain 데이터를 소유한다.
17. Public / Private 경계는 버전이 아니라 Contract 성격과 정보 민감도로 정한다.
18. Memory와 Skill은 Fixture·Evaluation·Human Review를 거쳐 승격한다.
19. Master에 정의된 목표 기능과 현재 Repository 구현 상태를 구분한다.
20. Finance Contract와 Local Experiment는 Development V2 Expansion 완료에 종속되지 않는다.
21. Local Product Notice는 fail-open이며 Workflow Contract 흐름에 포함되지 않는다.

---

## 30. 관련 문서

```text
docs/architecture/repository-service-boundaries.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
docs/decisions/decision-log.md
docs/product/v1-completion-criteria.md
docs/contracts/product-notice-contract.md
docs/poc/v2-local-invocation-poc.md
docs/adr/ADR-0011-local-product-notice-channel.md
docs/architecture/backend-service-foundation/README.md
docs/contracts/backend-service-foundation/README.md
```

---

## 30.1 Sibling Foundation — Backend Service Foundation

`docs/architecture/backend-service-foundation/`와 `docs/contracts/backend-service-foundation/`는 이 Master Document가 기술하는 `oh-my-ai` 제품군 Architecture와는 별도 대상, 즉 Carelog·Finance Harness Backend·Shared Identity 등 실제 MSA Backend Service의 Architecture·Contract를 관리한다.

**용어 관계 (`DEC-059`, accepted, 2026-07-26):**

```text
Shared Platform
= oh-my-ai의 Domain-neutral Contract / Shared Core 경계
= DEC-005 의미 그대로 유지 (이번 결정으로 변경되지 않음)

Backend Service Foundation
= Carelog·Finance Harness Backend·Shared Identity 등
  MSA Backend Service의 공통 Architecture/Contract
= "Shared Platform"이라는 이름을 쓰지 않음

Shared Identity
= 인증 논리 서비스의 canonical 명칭

identity-platform (§23의 역사적 후보)
= DEC-067로 후보 상태가 부분 대체됨

ranikun-labs/platform-services
= repository existing Shared Java Platform Target
= gateway/identity extraction and cutover remain separate adoption state
= platform-core/shared-ai RPL-107 synchronous OpenAI Slice A implemented
= gateway-app과 platform-core는 서로 독립 Process
= platform-core/identity ACTIVE target; platform-core/shared-ai Phase 1 logical module

Finance Harness (Backend Service Foundation)
↔ finance-harness (§23 기존 목표 Repository)
= 책임 범위 일치. Backend Service Foundation 문서는
  그 물리 구현(DB·통신·정합성) 정책을 보강

Carelog
= 기존 Product Service. §7.7(repository-service-boundaries.md)에 등록됨.
  현재 Gateway·Auth/OAuth/Identity 구현 Host이며 RPL-53~55는 planned / not_started.
  oh-my-ai V1/V2/V3 Phase 1-6 타임라인(§26)과는 무관한 별도 현재 상태.
```

이 절은 `DEC-059`의 용어와 Carelog 등록을 유지하고 `DEC-067`의 제한적 물리화
결정을 투영한다. Architecture 승인은 Repository 생성, Shared Identity 물리 분리 완료,
Runtime 지원 또는 Product 출시를 의미하지 않는다. Shared AI RPL-107 구현도 Product
integration, Streaming, 독립 Process 또는 Product release를 자동으로 의미하지 않는다.

---

## 31. 검수 요청

### 하네스 메인 브랜치 세션

- 현재 `oh-my-ai` 구현과 V1 정의가 충돌하는가
- V1에 V2 Entity가 섞여 있는가
- Public Contract가 충분히 남아 있는가
- V2 PoC 순서가 현실적인가
- Capability 기반 Adapter 방향이 현재 구조와 정렬되는가

### Finance 하네스 세션

- Finance 목적과 기능 축이 정확한가
- Finance가 Development 하위로 읽히지 않는가
- Shared Contract 사용 범위가 적절한가
- 금융 데이터·정책 책임이 충분히 독립적인가

### Identity 세션

- Identity와 Product Entitlement 경계가 적절한가
- Local Invocation PoC와 Auth 도입 순서가 적절한가
- 여러 제품이 공유 가능한 Identity 경계인가

### 초기 아이디어 세션

- 최초 의도의 Human Control, Local-first, White-box 성격이 유지되는가
- V2/V3 확장이 초기 제품을 과도하게 변형하지 않는가
