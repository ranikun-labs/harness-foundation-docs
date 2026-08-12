---
title: Decision Log
status: draft
implementation_status: partial
owner: core
last_reviewed: 2026-08-08
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
  - ADR-0011
  - ADR-0012
  - ADR-0013
  - ADR-0014
  - ADR-0015
  - ADR-0016
  - ADR-0017
source_inputs:
  - docs/roadmap/product-roadmap.md
  - docs/architecture/shared-core-and-extensions.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/product/v1-completion-criteria.md
  - docs/contracts/context-checkpoint-guard-contract.md
  - docs/contracts/work-start-contract.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/contracts/execution-policy-contract.md
  - docs/testing/v1-fixture-plan.md
  - docs/poc/v2-local-invocation-poc.md
---

# Decision Log

## 1. 문서 목적

이 문서는 `oh-my-ai`의 현재 canonical Product·Architecture·Contract 결정을 한곳에 기록한다.

목적:

```text
현재 채택된 결정
제약과 함께 채택된 결정
실험 중인 결정
후속 버전으로 연기된 결정
폐기된 결정
대체된 결정
미결정 사항
```

을 구분하고, 구현·문서·검수에서 다시 논의해야 하는 범위를 줄이는 것이다.

---

## 2. Decision 상태 모델

허용 상태:

```text
accepted
accepted_with_constraints
experiment
deferred
rejected
superseded
open
```

| 상태 | 의미 |
|---|---|
| accepted | 현재 canonical 결정 |
| accepted_with_constraints | 제약과 Known Limitation을 포함해 채택 |
| experiment | 검증 전 POC 또는 가설 |
| deferred | 후속 버전으로 구현·출시 연기 |
| rejected | 채택하지 않음 |
| superseded | 새 결정으로 대체 |
| open | 아직 결정하지 않음 |

Experiment 결과는 Decision 상태와 분리한다.

```text
experiment_outcome:
- validated
- validated_with_constraints
- rejected
- inconclusive
```

규칙:

```text
validated 또는 validated_with_constraints
→ 별도 Product Decision 생성 후
  accepted 또는 accepted_with_constraints로 전환 가능

inconclusive
→ Decision Status는 experiment 유지
→ 추가 검증 조건 또는 종료 사유 기록
```

---

## 3. Decision Record Contract

모든 Decision Record는 다음 필드를 가진다.

```text
decision_id
title
status
owner
decision
rationale
constraints
consequences
affected_docs
supersedes
superseded_by
reviewed_at
```

값이 없는 경우에도 필드를 생략하지 않는다.

```text
constraints: []
consequences: []
affected_docs: []
supersedes: []
superseded_by: []
```

선택 필드:

```text
open_questions
implementation_notes
evidence_refs
experiment_outcome
revisit_condition
```

Deferred, Rejected, Experiment, Open Record도 동일한 Traceability 필드를 유지한다.

---

# Part I. Product Decisions

## DEC-001 — V1은 무료 Local-only Artifact Product다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
V1은 Cloud·Auth·Billing·Entitlement 없이 완결되는
무료 Local-only Artifact Product로 출시한다.

V1 Workflow는 Local Artifact와
Manual Human Gate로 완결한다.
```

### Rationale

```text
초기 제품 가치는 설치·신뢰·반복 사용 습관 검증에 있다.
Cloud Control Plane과 과금 구조를 먼저 넣으면
제품 범위와 보안 부담이 과도하게 커진다.
```

### Constraints

```text
Cloud Login 없음
Billing 없음
Entitlement 없음
Managed Task / Run / Result 없음
Remote Execution 없음
```

### Consequences

```text
V1 Release Gate는 Local Workflow와 Manual E2E를 기준으로 한다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/architecture/local-cloud-human-boundary.md
docs/product/v1-completion-criteria.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-002 — V1 핵심 진입 가치는 Work-start Basic이다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
V1의 무료 핵심 진입 기능은 Work-start Basic이다.
```

### Rationale

```text
큰 Repository에서 AI 작업을 시작할 때
관련 Context·Skill·Risk·Prompt 후보를 찾는 문제가
가장 즉시 체감 가능한 사용자 문제다.
```

### Constraints

```text
Work-start는 Runtime을 실행하지 않는다.
Candidate와 Handoff Seed만 생성한다.
```

### Consequences

```text
V1 Release Gate에서 Work-start는 P0다.

다만 Work-start가 핵심 진입 가치라는 결정은
Work-start만으로 V1이 완료된다는 의미가 아니다.

Structured Handoff
Result Basic
Human Review
Manual E2E

도 V1 P0다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/contracts/work-start-contract.md
docs/product/v1-completion-criteria.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-003 — V1/V2/V3 제품 경계를 분리한다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
V1
= Free Local-only Artifact Product

V2
= 개인 Pro Control Plane
= Local Invocation은 현재 Experiment

V3
= Workspace / Project 기반 Team Product
```

### Rationale

```text
무료 확산, 개인 유료화, 팀·B2B 가치를 한 버전에 섞지 않는다.
```

### Constraints

```text
Workspace·Project·Organization Policy는 V1에 구현하지 않는다.
V2 기능은 POC와 별도 Product Decision을 거쳐 확정한다.
```

### Consequences

```text
Roadmap 항목은 Free·Pro·Team 가치 중 하나에 명확히 배치한다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-004 — Profile·Workspace·Project 책임을 분리한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Profile
= 개인 Local 설정

Workspace
= 회사·팀 단위 정책과 설정

Project
= Repository·Service Context
```

### Rationale

```text
개인 설정에 회사 정책과 프로젝트 Context를 섞으면
V3 확장 시 Migration과 책임 경계가 무너진다.
```

### Constraints

```text
V1에서는 Workspace 구현 없음
Project Context는 Local Default 또는 Optional
```

### Consequences

```text
이 결정은 책임 모델을 채택한 Architecture Decision이다.
Workspace·Project Team Product의 실제 구현과 출시는 V3로 연기한다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-051 — Lean V1 Product Boundary는 Local Manual Artifact Workflow다

**Status:** accepted
**Owner:** product
**Decision scope:** product
**Implementation status:** not_verified
**Reviewed at:** 2026-07-20

### Decision Scope

```text
Scope in:
- Lean V1 Product Boundary
- V1 P0 / V1 Alpha / V2 기능 경계
- Structured Handoff Candidate와 Result Basic 수동 Artifact 경계
- 기존 V1 Decision의 Partial Supersession 범위

Scope out:
- 새 Task Engine
- 새 Packet Lifecycle
- 새 Session Identity
- 새 Runtime Adapter
- Managed Task
- Managed Result Channel
- Worktree Orchestration
- Cloud / Auth / Billing
```

### Context

```text
Foundation Package Construction은 완료됐으나
Canonical Product Baseline Acceptance는
Lean V1 Product Boundary 반영 전이라 미완료 상태였다.

기존 V1 Decision은 Local-only, Human-controlled,
Evidence Candidate, Runtime 자동 실행 금지 원칙을 유지하지만
일부 문서와 Decision은 Validator, Runtime Projection,
Manual Import Gate를 V1 P0 필수 흐름처럼 표현한다.

Lean V1은 제품 범위를 줄여
수동 Handoff 전달과 수동 Result Basic 반환을
V1의 완결된 Local Manual Artifact Workflow로 확정한다.
```

### Options Considered

```text
Option A:
기존 Foundation V1 경계를 유지하고
Contract Validator, Runtime Capability Check,
Runtime Projection, Manual Import Gate를 V1 P0로 둔다.

결과:
V1 범위가 커지고 Implementation Completion,
Fixture Passed, Runtime Supported, Product Released 상태가
Decision Accepted와 섞일 위험이 있다.

Option B:
Lean V1 Product Boundary를 채택하고
Validator와 Shell 고도화는 V1 Alpha,
Managed Result Return과 Runtime Invocation은 V2로 이동한다.

결과:
V1은 Local Manual Artifact Workflow로 완결되고
자동 Orchestration과 Managed Workflow는 후속 버전으로 분리된다.
```

### Decision

```text
Lean V1
= Local Manual Artifact Workflow

Canonical V1 사용자 Workflow:

사용자 Task 입력
→ Skill Routing
→ Work-start Candidate
→ Project Context 참조
→ Structured Handoff Candidate
→ Human Review
→ Worker Session에 수동 Copy/Paste
→ Worker가 Result Basic 수동 형식으로 반환
→ Human Review

V1은 자동 Runtime Orchestration 제품이 아니다.
```

V1 P0:

```text
Skill Routing
Prompt Hook
Work-start
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
```

`재현 가능한 최소 설치·실행 경로 1개`는 다음만 의미한다.

```text
사용자가 로컬 환경에서 제품 설치와 기본 Workflow 실행을
한 가지 공식 경로로 재현할 수 있음
```

다음은 V1 P0 요구가 아니다.

```text
npm과 Homebrew 동시 지원
복수 OS Installer
자동 업데이트
완성된 범용 CLI Product Shell
```

V1 Alpha:

```text
Handoff Validator
Result Validator
Generic Markdown Export 고도화
CLI Product Shell 고도화
Runtime별 정적 사용 안내 고도화
```

구분:

```text
범용 Validator 제품 기능
= V1 Alpha

Fixture를 통한 최소 Contract 검증
= V1 P0
```

V1 Fixture에는 최소한 다음 검증이 남는다.

```text
필수 필드 누락 실패
Scope / Do Not Touch 보존
Validation Not Performed의 정직한 표시
미수행 검증을 Pass로 표시하지 않음
```

V2:

```text
Managed Task
Task Registry
Session Linking
Worker Result Channel
Result 자동 저장
Main Result 자동 감지
Task·Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Runtime Invocation
Managed History·Search
Worktree 자동 생성
Worker Branch Lifecycle
복수 Worker Coordination
Merge·Apply Gate 자동화
```

Result Basic 경계:

```text
Result Basic Format
= V1 수동 Artifact Contract

Managed Result Return
= V2 저장·감지·연결·완료 인식·Queue·Import 기능

Result Basic Contract
≠ Result Channel
≠ Task Correlation
≠ Completion Detection
≠ Review Queue
≠ Context Import
```

Result Basic은 Human Review 전 canonical Truth나 완료 증명이 아니다.

Structured Handoff 경계:

```text
기존 handoff-prompt
= 다음 세션에 전달할 Prompt를 만드는 Skill

Structured Handoff Candidate
= Goal, Scope, Do Not Touch, Validation,
  Expected Result 등의 필드를 고정한
  provider-neutral 수동 전달 Contract

Structured Handoff Candidate
≠ Worker 자동 생성
≠ Runtime 자동 Invocation
≠ Session Linking
≠ Result 자동 반환
```

현재 방향은 `work-start`, `handoff-prompt`,
Skill Routing, Project Context를 Adapt하는 것이다.

다음으로 해석하지 않는다.

```text
새 Handoff Engine
새 Packet Lifecycle
새 Work-start 검색기
새 Runtime Adapter 계층
새 Task Engine
```

### Clarification — Human Review Next Step Selection

```text
This is a DEC-051 clarification.
It does not create a new Decision,
does not supersede DEC-051,
and does not change the V1 P0 / V1 Alpha / V2 boundary.
```

Human Review is not limited to a single approve-or-reject action.
After Work-start produces a Candidate, the user reviews the current
Context, Scope, and Handoff Candidate and chooses the next manual step:

```text
Direct Handoff
= the user judges Goal, Scope, Allowed Actions,
  Prohibited Actions, Do Not Touch, Validation,
  and Completion Criteria clear enough for manual Worker handoff.

Plan First
= the user judges that impact, order, or decomposition should be
  planned first through a Planning Skill or Manual Planning Process.
  A reviewed plan reference may then be reflected in the Handoff Candidate.

Gather Context
= the user judges that repository-local information is insufficient
  and manually checks additional context before reviewing the Task,
  Project Context, or Handoff Candidate again.
```

These choices are user-facing review options, not system-selected outcomes.

```text
default_next_step: none
system_selected_next_step: none
automatic_planning: not_supported
automatic_external_context_search: not_supported
automatic_workflow_branching: not_supported
automatic_handoff_approval: not_supported
```

If the user has not explicitly selected a next step, the Candidate remains:

```text
Needs human review
```

External Context Checkpoint means a manual candidate checklist only.

```text
Possible external context:
- Internal Wiki or Confluence
- Issue Tracker
- Drive or Notion
- Design files
- Other repositories
- Recent decisions from Slack or email
- Production-only configuration

Possible external context
≠ external context confirmed to exist

Manual review
≠ Connector invocation

External context candidate
≠ automatic search result
```

State separation remains:

```text
Decision Accepted
≠ Implementation Completed
≠ Runtime Supported
≠ Fixture Passed
≠ Product Released

Foundation Clarification
= documented here

oh-my-ai Next Step implementation
= not implemented by this Decision

Next Step Fixture
= not implemented by this Decision

Cross-session Full Manual E2E
= not performed by this Decision
```

### Clarification — Runtime Entry Consent Boundary

```text
This is a DEC-051 clarification.
It does not create a new Product Decision,
does not create a new Architecture Decision,
does not supersede DEC-051,
and does not change the Lean V1 Product Boundary.
```

Lean V1 still uses the same Local Manual Artifact Workflow, but V1 Release requires at least one user-facing Runtime Entry and a Runtime-specific Full Manual E2E.

```text
P0 Runtime:
- Claude Code

Follow-up Runtime:
- Codex

Internal Developer Interface:
- make work-start TASK="..."
```

Canonical Product Action:

```text
work-start
```

Entry and consent states:

```text
EXPLICIT
SUGGESTED
APPROVED
DECLINED
```

Allowed:

```text
EXPLICIT
→ Engine invocation allowed

APPROVED
→ Engine invocation allowed
```

Forbidden:

```text
SUGGESTED
→ Engine invocation prohibited
→ Artifact creation prohibited

DECLINED
→ Engine invocation prohibited
→ Artifact creation prohibited
→ Do not re-suggest for the same user request
```

Intent Detection is not consent.

```text
Intent Match
≠ User Consent
≠ Engine Invocation
```

Runtime Entry approval does not bypass Runtime-level permissions.

```text
Work-start Product Approval
≠ File Permission
≠ Shell Approval
≠ Network Approval
≠ Git Approval
```

### Clarification — V1 Continuation Boundary

```text
This is a DEC-051 clarification.
It does not create a new Product Decision,
does not create a new Architecture Decision,
does not supersede DEC-051,
and does not change the Lean V1 Product Boundary.
```

Runtime Event와 User Intent는 같은 입력이 아니다.

```text
Real User Prompt
= 사람이 현재 User Turn에서 직접 입력한 요청

Synthetic Event
= task-notification
| background agent completion
| tool result notification
| runtime-generated status message
| Provider Runtime이 생성한 비사용자 입력 이벤트

Synthetic Event
→ Work-start Suggestion 대상이 아님
→ UserPromptSubmit intent routing 대상이 아님
→ 동일 User Request에서 Work-start를 다시 제안하지 않음
```

Plan First와 Gather Context의 결과는 Main Session에서 검토·통합한다.
Main Session은 Human Review와 다음 단계 선택의 세션이며, V1 로컬 Main Session을
Control Plane이라고 부르지 않는다. Control Plane은 V2 Cloud·Managed Workflow 경계 용어로
유지한다.

사용자 확인을 거친 검토된 계획 또는 Context를 Handoff Candidate에 반영하는 절차는 있다.
그러나 Candidate 반영 후에도 상태는 다음과 같이 유지된다.

```text
Needs human review
```

Candidate 반영은 Direct Handoff 승인이나 Worker 실행 승인이 아니다. Direct Handoff는
사용자가 별도로 명시적으로 선택해야 하며, 그 전후에도 Main Session은 Candidate 반영 뒤
구현을 시작하지 않는다. 반영 뒤 Main Session은 현재 상태, Worker Session이 아직 생성·실행되지
않았음, Direct Handoff의 별도 선택 필요성, 그리고 선택 후 새 Worker Session으로 승인된
Candidate 또는 Handoff를 수동 전달해야 한다는 다음 절차를 한 번 안내하고 정지한다.

```text
Native Subagent
= Provider Runtime Feature
≠ Worker Session

Worker Session
= 사용자 승인 Handoff를 전달받아 구현·검증을 수행하는
  oh-my-ai Role Contract
```

Native Subagent와 Worker Session은 서로 다른 개념이며, Native Subagent는 Human Review,
계획 최종 승인, Direct Handoff, Product·Architecture Decision 또는 다음 Workflow 실행을
대신 결정할 수 없다.

자동 Handoff 생성 수준은 Plan 완료 후에도 여전히 미결정이다. 다음 상태는 변경하지 않는다.

```text
automatic_planning: not_supported
automatic_workflow_branching: not_supported
worker_auto_creation: not_supported
session_linking: not_supported
result_auto_return: not_supported
```

이 Clarification의 Accepted는 Runtime 구현 완료나 Fixture Passed를 의미하지 않으며,
Foundation 문서 반영은 oh-my-ai 제품 코드 반영을 의미하지 않는다. Ready for Handoff 상태를
새로 도입하지 않는다.

### Rationale

```text
V1의 사용자 문제는 AI 세션을 바꿀 때
목적·범위·금지 사항·검증 조건이 유실되고,
Worker가 무엇을 했고 무엇을 검증하지 않았는지
불명확해지는 것이다.

이 문제는 자동 Runtime Orchestration 없이도
Structured Handoff Candidate와
수동 Result Basic Format으로 먼저 해결할 수 있다.

Validator, Runtime Invocation, Result 자동 감지·연결,
Review Queue, Context Import를 V1 P0에 포함하면
Lean V1의 설치·신뢰·반복 사용 검증보다
Managed Workflow 구현 부담이 먼저 커진다.
```

### Constraints

```text
Decision Accepted
≠ Implementation Completed
≠ Runtime Supported
≠ Fixture Passed
≠ Product Released

V1은 자동 Runtime 실행을 요구하지 않는다.
V1은 자동 Result 수집을 요구하지 않는다.
V1은 Managed Task / Run / Result Entity를 요구하지 않는다.
V1은 Worktree 자동 생성이나 복수 Worker Coordination을 요구하지 않는다.
V1은 Cloud / Auth / Billing을 요구하지 않는다.
```

### Consequences

```text
V1 P0 Release 판단은
수동 Handoff 전달
→ Worker 수행
→ 수동 Result Basic 반환
→ Human Review
까지의 Local Manual Artifact Workflow를 기준으로 한다.

Handoff Validator와 Result Validator 제품 기능은 V1 Alpha로 이동한다.

Managed Result Return, Runtime Invocation,
Task·Result Correlation, Completion Detection,
Review Queue, Context Import는 V2 범위로 이동한다.

기존 Local-only, Human-controlled, Evidence Candidate,
Runtime 자동 실행 금지, Human Review,
최소 Manual E2E 원칙은 계속 유효하다.

후속 Targeted Update에서 영향 문서를 Lean V1 경계와 정렬해야 한다.
```

### Affected Documents

직접 후속 Targeted Update 후보:

```text
docs/master/product-architecture-master.md
docs/product/development-harness-report.md
docs/product/v1-completion-criteria.md
docs/roadmap/product-roadmap.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
README.md
```

연쇄 확인 후보:

```text
docs/contracts/work-start-contract.md
docs/contracts/runtime-capability-contract.md
docs/product/README.md
docs/roadmap/README.md
docs/handoffs/README.md
```

### Supersession

```text
supersedes: []
superseded_by: []
partial_supersedes:
  - DEC-008
  - DEC-010
  - DEC-011
  - DEC-031
partial_superseded_by:
  - DEC-062
full_supersession: none
```

Partial Supersession 범위:

```text
DEC-008:
  remaining_valid_scope:
    - Local-only
    - Human-controlled
    - 자동 Runtime 실행 금지
    - 자동 Result 수집 금지
  superseded_scope:
    - V1 P0에 Contract Validator, Runtime Capability Check,
      Runtime Projection, Manual Import Gate가 필수라는 범위

DEC-010:
  remaining_valid_scope:
    - Structured Handoff가 Goal, Scope, 금지 사항,
      Validation, Expected Result를 보존하는 Task Contract라는 원칙
  superseded_scope:
    - V1 P0에서 Validator, 승인 상태, Export 차단,
      Runtime Projection이 필수라는 범위

DEC-011:
  remaining_valid_scope:
    - Result Basic은 Evidence Candidate
    - Human Review 전 Truth가 아님
  superseded_scope:
    - 범용 Result Validator가 V1 P0 필수 Gate라는 범위

DEC-031:
  remaining_valid_scope:
    - 최소 1개 Runtime을 사용한 Manual E2E가
      V1 Release Gate라는 원칙
  superseded_scope:
    - Result Validation과 Manual Import 관리 Gate 전체를
      V1 E2E에서 반드시 검증해야 한다는 범위

DEC-051 after DEC-062:
  remaining_valid_scope:
    - Local-only Artifact Workflow
    - Human-controlled Delegation
    - 사용자가 새 세션 생성
    - Runtime 자동 Invocation 금지
    - Worker 자동 실행 금지
    - Result 자동 반환·승격 금지
    - Candidate와 Human Review
    - Manual Resume fallback
  superseded_scope:
    - Manual Copy/Paste만 Public V1 P0 전달 방식이라는 범위
    - Automatic Prompt Delivery 전체를 V2로 분류한 범위
    - 지원 Runtime에서도 Product가 Candidate 연결을 하지 않는다는 범위
```

### Implementation and Verification

```text
implementation_completed: not_verified
fixture_passed: not_verified
runtime_supported: not_verified
product_released: not_verified
```

---

## DEC-052 — Community Continuity and Pro Entry Boundary

**Status:** accepted
**Owner:** product
**Decision type:** product
**Decision scope:** product
**Decision date:** 2026-07-16
**Implementation status:** not_started
**Reviewed at:** 2026-07-16

### Decision Scope

```text
Scope in:
- V2 CLI 업데이트 후 Anonymous Community 지속 원칙
- Update, Login, Subscription, Authentication, Entitlement의 Product 경계
- Pro 기능 진입 시 Authentication 요구 경계
- Signed-in Free의 Product-facing 의미
- Subscription 종료 후 Community와 Local 데이터 유지 원칙

Scope out:
- Authentication State Schema
- Subscription State Schema
- Trial State Schema
- Entitlement State Schema
- Quota Schema
- Local Data State Schema
- Token 발급·저장
- OAuth Provider 선택
- Billing Provider와 가격
- Trial 기간과 무료 사용량
- Update Check 구현
```

### Context

```text
DEC-001은 V1을 Cloud·Auth·Billing·Entitlement 없이 완결되는
무료 Local-only Artifact Product로 정의했다.

DEC-003은 V1 / V2 / V3 제품 경계를 분리하면서
V2를 개인 Pro Control Plane으로 표현했다.

DEC-051은 Lean V1을 Local Manual Artifact Workflow로 재정의하고
Managed Workflow와 Runtime Invocation을 V2로 이동했다.

이후 V2 CLI와 Commercialization을 논의할 때
V2 업데이트가 곧 Login 요구 또는 Subscription 요구로 읽힐 수 있다.
이 해석은 Community 확산, Local-first 원칙,
Billing·Entitlement 장애 시 기본 기능 유지 원칙과 충돌한다.
```

### Problem

```text
Update, Login, Subscription, Authentication, Entitlement를
하나의 Funnel 단계처럼 고정하면 다음 문제가 생긴다.

- V1 Community 사용자가 V2 CLI로 업데이트하는 순간 Login을 강제받는 것으로 오해된다.
- Login이 곧 유료 Subscription 또는 Pro 권한으로 오해된다.
- Entitlement 실패가 Local 데이터 삭제나 Community 차단 권한으로 확대될 수 있다.
- Signed-in Free가 내부 데이터 모델의 단일 영구 상태로 고정될 위험이 있다.
```

### Options Considered

```text
Option A:
V2 CLI 사용을 Login과 Subscription 진입점으로 통합한다.

결과:
Commercial Funnel은 단순하지만
Community Local 사용 지속성과 Local-first 신뢰가 약해진다.

Option B:
V2 CLI 업데이트, Login, Subscription을 분리하고
Pro 기능 진입 시점에만 Authentication을 요구한다.

결과:
Anonymous Community를 유지하면서도
Pro 기능, Trial, 구매 확인, Device 확인을 위한 Account 경로를 열 수 있다.
```

### Decision

```text
V2 CLI로 업데이트해도 Anonymous Community 사용은 유지한다.

Community Local 기능은 Login 없이 사용 가능하다.

Update
≠ Login

Login
≠ Subscription

Authentication
≠ Entitlement

Community Access
≠ Authentication Required

Subscription Expiration
≠ Community Access Removal
```

Anonymous Community:

```text
- 계정 없음
- 로그인 없음
- Community Local 기능 사용 가능
- V2 CLI 업데이트 후에도 사용 유지
- Billing·Entitlement 서버 장애와 무관하게 기본 기능 유지
```

Pro Entry:

```text
사용자가 Pro 기능에 진입할 때 Authentication을 요구할 수 있다.
Authentication은 Identity 확인이며,
Pro Commercial Access 또는 Subscription 자체가 아니다.
```

Signed-in Free:

```text
Signed-in Free는 Product-facing 상태로 제공할 수 있다.

의미:
- Authentication 완료
- 활성 유료 Subscription 없음
- Community 기능 유지
- Trial·Account·Device·구매 권한 확인 기능에 접근 가능
```

Signed-in Free는 다음 단일 영구 상태 필드로 고정하지 않는다.

```text
user_status = SIGNED_IN_FREE
```

후속 Architecture Decision은 내부 개념을 최소 다음 축으로 분리해야 한다.

```text
Identity:
anonymous | authenticated

Commercial Access:
community | trial | pro | future power
```

Subscription Exit:

```text
구독 종료
→ 로컬 사용자 데이터 삭제 금지
→ 기존 데이터 열람 유지
→ Community 기능 유지
→ 신규 Pro 관리 작업만 제한 가능
```

```text
Entitlement
≠ Local 데이터 소유권
≠ 사용자 파일 삭제 권한
```

Trial과 제한된 무료 Pro 사용량은 제공할 수 있으나
Trial·Quota는 변경 가능한 Launch Policy다.
Community 기능은 Trial·Quota와 독립이다.

구체 Trial 기간, 무료 사용량, Grace 기간, 가격,
Founding 조건은 이 Decision에 고정하지 않는다.

### Rationale

```text
Community는 Local Manual Workflow 확산과 신뢰의 기반이다.

V2 CLI 업데이트를 Login 또는 Subscription과 결합하면
기존 Community 사용자는 업데이트 자체를 위험한 상업 Funnel로 인식할 수 있다.

Pro 기능 진입 시 Authentication을 요구하면
상업 기능과 Account 기능을 제공하면서도
기본 Local Community 사용을 계속 보장할 수 있다.

Signed-in Free를 Product-facing 언어로 허용하되
내부 모델을 Identity와 Commercial Access로 분리하면
Account, Trial, Quota, Entitlement, Local Data Access를
하나의 취약한 상태열로 합치는 문제를 피할 수 있다.
```

### Consequences

```text
V2 Commercial Funnel은 다음 순서를 따른다.

V1 Community 사용자
→ V2 출시 안내
→ 사용자가 V2 CLI로 Update
→ Community 기능은 로그인 없이 계속 사용
→ 사용자가 Pro 기능 진입
→ Authentication 요구
→ Signed-in Free
→ Trial 또는 제한적 Pro 사용 가능
→ Subscription 선택
→ Pro Commercial Access
```

```text
Billing 또는 Entitlement 서버 장애는
Community Local 기능을 차단하지 않는다.

Subscription 종료 또는 Entitlement 실패는
기존 Local Artifact, Repository, Result, Diff, Journal 삭제 권한이 아니다.

신규 Pro 관리 작업의 제한은 가능하지만
기존 데이터 열람과 Community Local 사용은 유지한다.
```

### Risks

```text
Account UX에서 Signed-in Free와 Pro Access를 명확히 설명하지 않으면
사용자는 로그인했는데 왜 Pro 기능이 제한되는지 혼동할 수 있다.

후속 Architecture Decision에서 상태 축을 다시 합치면
이 Product Boundary가 약화된다.

Trial·Quota·가격을 운영 실험으로 남기기 때문에
Launch 시점에는 별도 Private Launch Experiment Policy가 필요하다.
```

### Non-goals

```text
Authentication State Schema 정의
Subscription State Schema 정의
Trial State Schema 정의
Entitlement State Schema 정의
Quota Schema 정의
Local Data State Schema 정의
OAuth Provider 선택
Token Lifecycle 정의
Billing Provider 선택
가격 확정
Trial 기간 확정
일일 무료량 확정
Update Check 구현
```

### Status Separation

```text
decision_accepted: true
implementation_completed: not_started
implementation_status: not_started
runtime_supported: not_verified
runtime_support_status: not_supported
fixture_passed: not_verified
fixture_status: not_verified
product_released: not_released
product_release_status: not_released
```

### Affected Documents

```text
docs/master/product-architecture-master.md
docs/product/development-harness-report.md
docs/roadmap/product-roadmap.md
docs/architecture/local-cloud-human-boundary.md
```

### Supersession

```text
supersedes: []
superseded_by: []
partial_supersedes:
  - DEC-003
full_supersession: none
```

Partial Supersession 범위:

```text
DEC-003:
  remaining_valid_scope:
    - V1 / V2 / V3 경계를 섞지 않는 원칙
    - V2 기능은 POC와 별도 Product Decision을 거쳐 확정한다는 원칙
    - V3는 Workspace / Project / Team Product라는 방향
  superseded_scope:
    - V2가 곧 Pro 전용 상품이며
      V2 CLI 업데이트가 Login 또는 Subscription 진입과 동일하다는 해석
  reason:
    - V2 CLI 업데이트와 Pro Commercial Funnel을 분리해
      Anonymous Community 지속성을 보장해야 한다.
  replacement_rule:
    - V2 CLI 업데이트는 Community 사용을 차단하지 않는다.
    - Login은 Pro 기능 진입 또는 Account 기능 사용 시 요구할 수 있다.
    - Subscription과 Entitlement는 Authentication과 별도 Commercial Access 판단이다.
```

Clarification:

```text
DEC-016:
  Authentication은 Availability 또는 Identity 경계와 관련되며
  Entitlement와 동일하지 않다.
  Entitlement는 Commercial Access 판단이지 Local 데이터 소유권이 아니다.
```

### References

```text
DEC-001
DEC-003
DEC-016
DEC-051
docs/architecture/local-cloud-human-boundary.md
docs/contracts/execution-policy-contract.md
docs/contracts/runtime-capability-contract.md
```

---

## DEC-053 — V2 Commercial Tier Boundary

**Status:** accepted
**Owner:** product
**Decision type:** product
**Decision scope:** product
**Decision date:** 2026-07-16
**Implementation status:** not_started
**Reviewed at:** 2026-07-16

### Decision Scope

```text
Scope in:
- Architecture Version과 Commercial Tier 분리
- Community / Signed-in Free / Pro / future Power 상품 경계
- Pro의 Local Managed Workflow 가치 정의
- future Power의 개인용 Cloud·Automation 후보 경계
- V3 Team / Workspace / Organization Governance 경계
- 기존 V2 Roadmap의 Cloud·Remote·Automation 후보 재배치

Scope out:
- Power 최종 상품명
- Power 가격과 출시 시점
- Cloud Sync 구현
- Remote Runtime 구현
- Worker Automation 구현
- Team / Enterprise 구현
- Auth·Billing·Entitlement 상세 Architecture
```

### Context

```text
기존 Roadmap은 V1 Community, V2 Pro, V3 Team / Enterprise로
제품 버전을 설명했다.

이 표현은 단순하지만 Architecture Version과 Commercial Tier가
동일한 축처럼 읽힐 수 있다.

DEC-051 이후 V1은 Local Manual Artifact Workflow로 확정됐고,
Managed Task, Session Linking, Managed Result Return,
Runtime Invocation은 V2로 이동했다.

동시에 DEC-041, DEC-042, DEC-043, DEC-044는
Remote Execution, Cloud Result Store, Team Product,
Organization Policy·RBAC·SSO를 후속 또는 V3로 분리했다.
```

### Problem

```text
V2를 Pro와 동일시하면 다음 혼선이 생긴다.

- V2 CLI를 설치하면 Community가 사라지는 것으로 오해된다.
- Cloud Sync, Cross-device Resume, Cloud Backup, Web Review가
  최초 Pro 범위처럼 읽힌다.
- 개인 Remote Worker와 조직 공유 Worker가 같은 V3 기능처럼 섞인다.
- Power 같은 상위 개인용 상품 후보가 새 Architecture Version으로 오해된다.
```

### Options Considered

```text
Option A:
V1 Community / V2 Pro / V3 Enterprise라는 단일 축을 유지한다.

결과:
문구는 단순하지만 제품 출시, Architecture Evolution,
Commercial Packaging이 계속 충돌한다.

Option B:
Architecture Version과 Commercial Tier를 분리한다.

결과:
V2 CLI에서도 Community를 유지하면서
Pro와 future Power를 같은 V2/V2.x Architecture 위의
상업 Tier로 배치할 수 있다.
```

### Decision

Architecture Version:

```text
V1
= Local Manual Artifact Workflow

V2
= Personal Managed Workflow Architecture

V3
= Team / Workspace / Organization Governance Architecture
```

Commercial Tier:

```text
Community
Signed-in Free
Pro
future Power
```

다음 비동치를 유지한다.

```text
V1
≠ Community만 의미하는 상품 Tier

V2
≠ Pro만 의미하는 상품 Tier

Power
≠ 새로운 Architecture Version

Power
≠ V3

V3
= Team / Organization Governance Architecture
```

### Commercial Tier Boundary

Community:

```text
= Local Manual Workflow
+ 로그인 없음
+ Structured Handoff Candidate
+ Result Basic
+ Human Review
+ 수동 Copy/Paste
```

Community는 Lean V1에서 처음 제공되지만
V2 CLI에서도 제거되지 않는다.

Signed-in Free:

```text
= Authentication 완료
+ 활성 유료 Subscription 없음
+ Community 기능 유지
+ Trial·Account·Device·구매 권한 확인 기능 접근
```

Signed-in Free는 Product-facing 상태이며
내부 영구 Schema는 후속 Architecture Decision 범위다.

Pro:

```text
= Authentication 필요
+ Pro Commercial Access 필요
+ Local Managed Workflow
+ 관리·검증
+ Handoff Validation
+ Result Validation
+ Handoff와 Result 비교
+ Local Task 관리
+ Local History / Search
+ 같은 장비에서 Agent Switch
+ Project Profile
```

Pro의 핵심 가치는 다음이다.

```text
Local Workflow의 관리와 검증
```

future Power:

```text
= 향후 개인용 상위 Commercial Tier 후보
+ Encrypted Cloud Sync 후보
+ Cross-device Resume 후보
+ Cloud Backup·Restore 후보
+ Web Review 후보
+ 개인용 Remote Worker 후보
+ 고급 자동화 후보
```

Power의 핵심 가치는 다음이다.

```text
기기 간 동기화·복구와 개인용 고급 자동화
```

다음은 확정하지 않는다.

```text
Power라는 최종 상품명
Power 가격
Power 출시 시점
모든 Remote Runtime 기능의 Power 편입
```

V3:

```text
= Team
+ Workspace
+ Organization
+ RBAC
+ Audit
+ Enterprise Governance
+ 조직 공유 Worker
+ 조직 Policy
```

```text
개인 Remote Worker
= Power 후보

조직 공유 Worker·RBAC·Audit
= V3
```

### Rationale

```text
Architecture Version은 제품이 어떤 관리 책임과 실행 모델을
지원할 수 있는지를 나타낸다.

Commercial Tier는 같은 Architecture 위에서
사용자에게 어떤 가치와 권한을 포장해 제공하는지를 나타낸다.

두 축을 분리하면 V2 CLI에서도 Community를 유지하면서
Pro는 Local Managed Workflow의 관리·검증 가치에 집중하고,
Cloud Sync와 Cross-device Resume 같은 고비용 기능은
future Power 후보로 늦출 수 있다.

V3는 개인용 상위 기능이 아니라
조직 Governance와 Enterprise 책임이 필요한 단계로 유지된다.
```

### Consequences

```text
최초 Pro는 Local Managed Workflow의 관리·검증 기능을 중심으로 한다.

Cloud Sync, Cross-device Resume, Cloud Backup·Restore,
Web Review, 개인 Remote Worker, 고급 자동화는
future Power 후보로 재배치한다.

Organization 공유 Worker, RBAC, Audit, SSO,
Organization Policy는 V3 경계에 남긴다.

V2 Technical Core 또는 POC 문서에 기능이 존재한다는 사실은
해당 기능이 Pro Launch에 포함된다는 의미가 아니다.
```

### Risks

```text
Commercial Tier와 Architecture Version을 분리하면
Roadmap 설명이 길어진다.

Power 후보를 열어두면 Launch 전 상품명과 가격 논의가
Product Boundary보다 앞설 위험이 있다.

Pro에서 Cloud Sync를 제외하면
Cross-device 기대가 큰 사용자에게는 가치 설명을 별도로 준비해야 한다.
```

### Non-goals

```text
Power 상품명 확정
Power 가격 확정
Power 출시 시점 확정
Trial 기간 확정
무료 Pro 사용량 확정
Remote Runtime 구현
Cloud Sync 구현
Billing Provider 선택
Organization Governance 구현
```

### Status Separation

```text
decision_accepted: true
implementation_completed: not_started
implementation_status: not_started
runtime_supported: not_verified
runtime_support_status: not_supported
fixture_passed: not_verified
fixture_status: not_verified
product_released: not_released
product_release_status: not_released
```

### Affected Documents

```text
docs/master/product-architecture-master.md
docs/product/development-harness-report.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
```

### Supersession

```text
supersedes: []
superseded_by: []
partial_supersedes:
  - DEC-003
  - DEC-041
full_supersession: none
```

Partial Supersession 범위:

```text
DEC-003:
  remaining_valid_scope:
    - V1 / V2 / V3 제품 경계를 섞지 않는 원칙
    - V2 기능은 별도 Product Decision을 거쳐 확정한다는 원칙
    - V3는 Team Product 방향이라는 원칙
  superseded_scope:
    - V1 / V2 / V3를 Community / Pro / Team Commercial Tier와
      동일 축으로 해석하는 범위
  reason:
    - Architecture Evolution과 Commercial Packaging이 서로 다른 축이기 때문이다.
  replacement_rule:
    - V1 / V2 / V3는 Architecture Version이다.
    - Community / Signed-in Free / Pro / future Power는 Commercial Tier다.
    - future Power는 새 Architecture Version이 아니며 V3도 아니다.

DEC-041:
  remaining_valid_scope:
    - Remote Runtime Execution은 Local Invocation POC와 분리한다.
    - Local Invocation 검증 전 Remote Execution 도입 금지
  superseded_scope:
    - Remote Execution의 Product Tier 배치가 미정인 범위
  reason:
    - 개인 Remote Worker와 조직 공유 Worker는 보안·권한·사용자 가치가 다르다.
  replacement_rule:
    - 개인 Remote Worker는 future Power 후보로 검토한다.
    - 조직 공유 Worker, RBAC, Audit은 V3 Governance 경계에 남긴다.
```

Clarification:

```text
DEC-043:
  Team / Workspace / Organization Product 구현은 V3로 유지한다.

DEC-044:
  Organization Policy·RBAC·SSO는 V3 Enterprise 경계로 유지한다.

DEC-051:
  V2로 이동한 Managed 기능은 Architecture 후보이며,
  모든 V2 기능이 최초 Pro 또는 future Power Launch 범위라는 의미가 아니다.
```

### References

```text
DEC-003
DEC-041
DEC-043
DEC-044
DEC-051
docs/master/product-architecture-master.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
```

---

## DEC-054 — Public V1에 Local Product Notice Channel을 포함한다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-20

### Decision

```text
Public V1은 최소 Local Product Notice Channel을 포함한다.

목적은 향후 V2 출시, 보안, 호환성 공지를
기존 Public V1 사용자에게 터미널에서 도달시키는 것이다.

Notice는 명시적 Work-start 실행에만 부수하며
Task Artifact와 완전히 분리된다.

사용자는 개별 Notice를 dismiss할 수 있고
원격 Notice 확인 전체를 opt-out할 수 있다.
```

Notice는 다음과 동일하지 않다.

```text
자동 Update
자동 설치
자동 Login
Cloud 연결
Telemetry
Handoff Candidate
Result Basic
Task Context
```

### Rationale

```text
Public V1은 Cloud-independent 제품이므로
Control Plane을 통한 사용자 도달 경로가 없다.

Release Page 확인에만 의존하면
V2 출시와 보안 공지가 기존 사용자에게 도달하지 않는다.

공지 도달 경로 부재는 무료 오픈소스 상품의
운영상 결함이지 선택 가능한 편의 기능이 아니다.

Work-start는 사용자가 명시적으로 실행하는
유일한 정기 진입점이므로 최소 비용의 도달 지점이다.
```

### Constraints

```text
제품 핵심 기능은 Network 없이 정상 동작한다
Notice 관련 모든 실패는 fail-open이다
사용자 작업, Repository, Task, Artifact 데이터를 전송하지 않는다
자동 Update, 자동 설치, 자동 Login을 수행하지 않는다
Notice는 새 Workflow State를 만들지 않는다
Notice는 Human Gate를 추가하거나 완화하지 않는다
상주 Daemon, Scheduler, OS Service를 요구하지 않는다
```

### Consequences

```text
Public V1 P0 Release 요구에 Notice Contract 완료와
Notice Fixture 통과가 추가된다

Public Documentation에 Notice 목적, 전송 범위,
Network Metadata 노출, Opt-out 방법을 명시해야 한다

Work-start를 실행하지 않는 사용자에게는 공지가 도달하지 않는다
이 제한은 Known Limitation으로 문서화한다
```

### Relation to DEC-001

```text
DEC-001의 `V1은 Cloud 없이 완결된다`를 대체하지 않는다.

Cloud 없이 완결
= 제품 핵심 기능이 Network 없이 동작

Notice
= 선택적, fail-open, opt-out 가능한 읽기 전용 부가 경로

Notice가 실패하거나 opt-out돼도
V1 Workflow 전체가 완료 가능하므로 DEC-001 조건은 유지된다.
```

Notice는 Cloud Account, Auth, Entitlement, Control Plane을 도입하지 않는다.

### Affected Documents

```text
docs/contracts/product-notice-contract.md
docs/contracts/work-start-contract.md
docs/product/v1-completion-criteria.md
docs/roadmap/product-roadmap.md
docs/master/product-architecture-master.md
docs/architecture/local-cloud-human-boundary.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-055 — Runtime-readable Version Source와 SemVer-clean Public Release Tag를 채택한다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-20

### Decision

```text
제품 Runtime이 읽을 수 있는 canonical Version Source를 둔다.

Public Stable Release Tag는 SemVer-clean 형식을 사용한다.

Public V1 정식 공개 Tag는 v1.0.0이다.

설명 문구는 Tag 접미사가 아니라
Release Title과 Release Notes에 기록한다.
```

Version Source의 위치와 파일 형식은 Product Worker 범위다.

이 Decision은 요구사항과 형식 제약만 확정한다.

### Rationale

```text
Notice Audience Match는 Local SemVer 비교로 판정한다.

Runtime이 자신의 Version을 읽지 못하면
Audience Match를 수행할 수 없고,
Unknown을 Match로 추정하는 것은 금지되므로
Notice가 영구히 표시되지 않는다.

제품 Repository 최상위의 version.md는 Roadmap 성격 문서이며
Runtime이 읽는 Version Source가 아니다.

현재 제품 Repository의 Release Tag는 모두 설명 접미사를 가진다.

v0.6.0-search-backend-pilot 형태의 Tag는
SemVer에서 `-search-backend-pilot`이 prerelease 식별자로 해석되므로
Stable Release 비교에서 v0.6.0보다 낮게 정렬된다.

설명을 Tag에 넣는 관행은
Version 비교 의미를 손상시킨다.
```

### Evidence

```text
관찰 대상: oh-my-ai 제품 Repository
관찰 시점: 2026-07-20
관찰 방법: git tag 목록 및 최상위 파일 확인

관찰 결과:
- 최상위 version.md 존재
- docs/ 하위에 Runtime Version Source 없음
- Tag 7건 모두 설명 접미사 포함
  (v0.1.0-control-plane ~ v0.6.0-search-backend-pilot)
- 설명 접미사 없는 Stable Tag 없음
```

이 관찰은 Foundation Worker가 Product Repository를 읽어 확인한 사실이다.

Version Source 신설 위치와 형식은 Product Worker가 확정한다.

### Constraints

```text
Version Source는 Runtime이 Network 없이 읽을 수 있어야 한다
Version Source와 Roadmap 문서를 혼용하지 않는다
Public Stable Tag에 설명 접미사를 붙이지 않는다
Prerelease 표기는 실제 prerelease에만 사용한다
Version 판독 실패를 Match로 추정하지 않는다
```

### Consequences

```text
V1 Completion Criteria §31의 미결정 항목
`V1 Release Version`이 v1.0.0으로 확정된다

Notice Audience Match 구현의 선결 조건이 해소된다

기존 설명형 Tag는 유지하되
Public Stable Release Tag 규칙에서 제외한다
```

### Open

```text
Version Source 파일 경로와 형식
Version Source와 Package Metadata의 동기화 방식
Prerelease Tag 운영 규칙
```

위 항목은 Product Worker가 별도로 확정한다.

### Affected Documents

```text
docs/contracts/product-notice-contract.md
docs/product/v1-completion-criteria.md
docs/roadmap/product-roadmap.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-062 — Automatic Next-session Handoff Rehydration을 Public V1.x P0로 채택한다

**Status:** accepted_with_constraints
**Owner:** product
**Decision scope:** product
**Implementation status:** not_verified
**Reviewed at:** 2026-07-27

`accepted_with_constraints`는 Product Decision 상태이며, 이 변경이 `main`에 Merge된 후
canonical 효력을 갖는다. Merge 전 Branch 기록은 canonical main 반영을 의미하지 않으며,
Merge 이후에도 이 Status만으로 구현 완료나 Runtime 지원을 증명하지 않는다.

### Decision Scope

```text
Scope in:
- Public V1.x P0의 Automatic Next-session Handoff Rehydration
- 안전한 Pending Candidate 연결 조건과 Manual Resume fallback
- Candidate 경계와 전달 성공 표현의 제품 기준

Scope out:
- State 파일 경로·Schema
- Worktree Identity 알고리즘
- Lock·Atomic Claim·Claim Timeout·Crash Recovery·TTL
- Runtime Adapter 구조·Hook Source·Generated Cascade·Contract Schema
- Runtime Invocation과 새 세션 생성
- README 지원 주장과 oh-my-ai 구현
```

### Decision

```text
Automatic Next-session Handoff Rehydration
= Public V1.x P0
= 권장 공개 버전 v1.1.0

이 기능은 Context Checkpoint Guard보다 우선한다.
Harness는 사용자가 생성·전환한 새 세션에 안전한 Candidate를 연결할 수만 있다.
새 세션 생성과 UI 전환은 사용자 책임이다.
```

### User Consent

명확한 실행 의도만 Pending Handoff 생성 동의다.

```text
허용 예:
- $handoff ...
- 다른 세션으로 넘겨줘
- 이 작업을 새 세션으로 Handoff 해줘

실행 동의가 아님:
- 애매한 언급
- 기능 질문
- 문서 문자열
- Synthetic Event
```

### Candidate Artifact

Raw Transcript가 아닌 정제된 Candidate만 저장한다.

```text
최소 내용:
- Source Session
- Repository
- Worktree
- Goal
- Completed
- Open Issues
- Verification
- Do Not Touch
- Next Action
- Status: candidate

저장 금지:
- Raw Transcript
- Raw Tool Output
- Secret
- Token
- Credential
- 환경변수 원문
```

### Automatic Linking Conditions

다음을 모두 확인할 수 있을 때만 자동 연결한다.

```text
- 같은 Repository
- 같은 Worktree
- source_session_id와 다른 current_session_id
- 두 Session ID 모두 확인 가능
- Pending이 정확히 1개
- Candidate 미만료
- Runtime·Hook 지원 확인
```

Unknown은 Supported로 추정하지 않는다.

Pending이 2개 이상이면 최신 Candidate, 유사 Goal, 생성 시각을 기준으로도 임의 선택하지 않는다.

### Candidate Boundary and Delivery Truthfulness

자동 연결된 내용은 Durable Fact가 아니다. 새 세션은 다음을 다시 확인해야 한다.

```text
Branch
HEAD
Working Tree
실제 파일 상태
완료 주장
검증 결과
```

다음만으로 전달 성공으로 표현하지 않는다.

```text
Artifact 생성
Claim
Hook 호출
Context 출력 시도
Manual Resume 안내
```

대상 세션에서 Candidate를 사용할 수 있다는 근거가 있어야 성공으로 표현할 수 있다.
Runtime Adapter별 성공 확인 방식은 기술 설계로 미룬다.

### Manual Resume Fallback

다음 경우 Manual Resume를 제공한다.

```text
Hook 비활성
Runtime 미지원
Session ID 확인 불가
Repository·Worktree 불일치
Multiple Pending
State 손상
Artifact 만료
Claim·전달 실패
전달 성공 확인 불가
```

### Constraints

Handoff만으로 다음을 수행하지 않는다.

```text
작업 파일 수정
Shell
Git 변경
Worker 실행
Commit·Push·PR 변경
새 세션 생성
codex resume
codex fork
Runtime Invocation
Result 자동 회수
Project Context 자동 Promotion
```

```text
Decision Accepted
≠ Implementation Completed
≠ Fixture Passed
≠ Cross-session E2E Passed
≠ Runtime Supported
```

### Rationale

```text
수동 전달만으로는 세션 전환 때 Candidate가 유실되거나 재사용되지 않는 문제가 남는다.
그러나 Managed Session Linking이나 Runtime 실행을 도입하지 않고도,
명시적 동의와 검증 가능한 조건 아래 Candidate 연결을 제공할 수 있다.
조건을 확인할 수 없으면 자동화를 추정하지 않고 Manual Resume로 돌아간다.
```

### Consequences

```text
Public v1.0.0 Baseline의 기본 전달 방식은 Manual Copy/Paste였다.
Public v1.1.0 Delta Gate에서는 Automatic Rehydration이 기본 목표이고,
Manual Resume는 자동 연결 불가 시 fallback이다.
Managed SessionBinding, Session Graph, Runtime Invocation은 후속 범위로 유지한다.
구현·Fixture·Cross-session E2E는 not_verified 상태를 유지한다.
v1.0.0의 완료 상태와 Tag·Release는 이 Decision으로 소급 변경하지 않는다.
```

### Affected Documents

이 PR에서 직접 정렬하는 문서:

```text
docs/product/v1-completion-criteria.md
docs/roadmap/product-roadmap.md
```

후속 정렬이 필요한 문서:

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
docs/handoffs/README.md
oh-my-ai product repository README
oh-my-ai Runtime Capability documentation
```

후속 문서는 이 PR에서 수정하지 않는다. PR 1·PR 2 또는 별도 Contract PR에서
DEC-062의 Product Boundary와 정렬한다.

### Supersession

```text
supersedes: []
superseded_by: []
partial_supersedes:
  - DEC-051
full_supersession: none
```

### Partial Supersession

```text
DEC-051 remaining_valid_scope:
- Local-only Artifact Workflow
- Human-controlled Delegation
- 사용자가 새 세션 생성
- Runtime 자동 Invocation 금지
- Worker 자동 실행 금지
- Result 자동 반환·승격 금지
- Candidate와 Human Review
- Manual Resume fallback

DEC-051 superseded_scope:
- Manual Copy/Paste만 Public V1 P0 전달 방식이라는 범위
- Automatic Prompt Delivery 전체를 V2로 분류한 범위
- 지원 Runtime에서도 Product가 Candidate 연결을 하지 않는다는 범위
```

### Related Decisions

```text
DEC-010: Structured Handoff와 Human Review 유지
DEC-012: Durable Context Promotion 분리
DEC-013: Session ID는 Managed Entity가 아님
DEC-021: Unknown이면 자동 연결 금지
DEC-029: Secret 원문 미저장
DEC-030: Positive·Negative Fixture 요구
DEC-040: Managed SessionBinding deferred 유지
DEC-051: Partial Supersession
```

### Implementation and Verification

```text
implementation_completed: not_verified
fixture_passed: not_verified
cross_session_e2e: not_verified
runtime_supported: not_verified
```

---

## DEC-063 — Context Checkpoint Guard C-lite를 post-v1.0 Public V1.x Gate로 채택한다

**Status:** accepted_with_constraints
**Owner:** product
**Decision scope:** product / contract
**Implementation status:** not_verified
**Reviewed at:** 2026-07-28

`accepted_with_constraints`는 Foundation Product Decision 상태다. 이 변경이 `main`에 Merge된 후
canonical 효력을 갖지만, Merge만으로 Product 구현·Runtime Hook 지원·Fixture Pass를 증명하지 않는다.

### Decision Scope

```text
Scope in:
- Work-start 비의존 Context Checkpoint 검토 기회
- Activity Signal과 Context Significance 분리
- C-lite 상태·Human Review 결과·Checkpoint Epoch
- 초기 Trigger, Scope 격리, 중복 알림 억제
- 최소 Metadata, Privacy, Fail-open
- project-context와 handoff-prompt 책임 경계
- DEC-062보다 선행하는 Runtime data-flow Capture Gate
- Product 구현 PR이 따라야 할 FX-CCG Fixture 계약

Scope out:
- Product Runtime·Hook·State 구현
- Transcript Capture·모델 호출·자동 요약
- 자동 Durable Context Promotion
- DEC-062 Product 구현과 Managed Session Linking
- Cloud Sync·Telemetry·Daemon·Scheduler
```

### Context

```text
현재 Work-start와 Structured Handoff 흐름은
명시적으로 해당 Entry를 사용한 작업의 Candidate를 보존할 수 있다.

그러나 사용자가 Work-start나 Handoff 없이
설계·수정·Decision·Risk 발견·검증·PR 작업을 수행하면
Durable Project Context 갱신 필요 여부를 검토할 경계가 없다.

DEC-062는 이미 존재하는 Pending Handoff Candidate를
다음 Session에 안전하게 연결하는 문제를 다룬다.
Pending Candidate가 만들어지기 전의 Context 누락은 DEC-062 범위가 아니다.
```

### Decision

```text
Context Checkpoint Guard C-lite
= post-v1.0 Public V1.x Gate
= Work-start 실행 여부와 무관하게
  인식 가능한 작업 활동이 있으면
  안전한 경계에서 Context 갱신 필요 여부를 사용자가 검토할 기회

Guard
≠ Context 자동 저장
≠ Context Significance 자동 판정
≠ Handoff Artifact 생성
```

Public `v1.0.0` Baseline의 완료 상태, Tag와 Release Criteria는 변경하지 않는다.
Product 구현 버전은 DEC-062의 Public `v1.1.0` 우선순위를 침해하지 않는
post-v1.0 V1.x Release Planning에서 확정한다.

### Activity and Significance

```text
Activity Signal
= 작업 활동이 있었다는 Adapter 관찰

Context Significance
= Durable Context에 남길 내용이 있는지에 대한 사용자 판정
```

Activity Signal 후보:

```text
파일 변경
검증 실행
oh-my-ai가 인식한 Commit·PR 관련 작업
명시적 Design·Decision marker
Handoff 요청
oh-my-ai가 관리하는 Session 종료
```

모든 Shell·Git·IDE·OS 활동을 전역 감시하지 않는다. 실제 Claude Code·Codex Adapter가
제공하는 Hook Surface만 사용하며 Runtime별 비대칭을 허용한다.

### C-lite State and Human Outcomes

Workflow 상태:

```text
clean
= 현재 Epoch에 검토를 요구하는 인식된 Signal 없음

review_needed
= Signal이 있어 Context 반영 여부를 사용자가 검토해야 함
```

Human Review 결과:

```text
checkpointed
= 사용자가 Context 갱신을 승인·완료하고 확인

no_update
= 사용자가 검토 후 Context 갱신 불필요를 선택
```

`checkpointed`와 `no_update`는 자동 판정 상태가 아니다. 결과가 기록되면 현재 Epoch를
해결하고 다음 Epoch를 `clean`으로 시작한다.

State 읽기 실패나 Hook 미지원은 `clean`으로 거짓 판정하지 않는다. `availability: unavailable`은
Workflow 상태를 늘리지 않는 별도 진단 축이며 fail-open과 Manual fallback을 선택하는 데만 사용한다.

### Trigger and Handoff Decision Gate

초기 Trigger 우선순위:

```text
1. Structured Handoff Candidate 생성 전
2. oh-my-ai가 관리하는 Session 종료 경계
3. oh-my-ai가 인식할 수 있는 PR·Merge 전 경계
```

SessionEnd는 종료를 차단하거나 Human Review를 기다리는 Gate가 아니다. 동일 Repository·Worktree의
prior unresolved Epoch는 다음 지원 Session 또는 review surface에서 one-time diagnostic으로만
안내하며 자동 해결·Context 저장·Handoff 생성·DEC-062 Pending 전환을 하지 않는다. 상세 불변조건은
`docs/contracts/context-checkpoint-guard-contract.md`가 소유한다.

`review_needed`인 Handoff는 기본적으로 Hard Block하지 않는다.

```text
경고
→ Human Decision Gate
→ Context Checkpoint | no_update | Manual Handoff 계속
```

기본 선택과 자동 선택은 없다. 독립적인 Secret·Execution Policy 위반이 Hard Block을
요구할 수 있으나, 그 차단은 Guard 상태 때문이 아니다.

### Scope, Epoch, and Duplicate Suppression

상태는 최소 다음 Scope를 분리한다.

```text
Repository Identity
Worktree Identity
Runtime
Session Identity
Checkpoint Epoch
```

Checkpoint Epoch:

```text
마지막 checkpointed 또는 no_update 이후
다음 Human Review 결과 전까지의 작업 구간
```

다른 Repository나 Worktree 상태를 재사용하지 않는다. 이전 Session의 미해결 상태를
새 Session의 현재 상태로 자동 복사하지 않는다. 동일 Scope의 one-time diagnostic을 위한
최소 unresolved 참조만 별도로 보존할 수 있다. 동일 Repository Hash, Worktree Hash,
Runtime, Session Hash, Epoch ID, Boundary Kind에서 마지막 알림 이후 새 Activity Signal이
없으면 반복하지 않는다. 새 Signal 뒤의 다음 지원 Boundary에서는 한 번만 다시 검토한다.
`checkpointed` 또는 `no_update` 이후 실제 새 Signal은 새 Epoch에서 다시 `review_needed`가 될 수 있다.

### Privacy

허용 Metadata:

```text
Repository·Worktree 식별용 Local Hash
Runtime
Session Hash
Epoch ID
Activity Signal 종류
최초·최근 Activity 시각
Checkpoint 상태
마지막 알림 Boundary·시각
Human Review 결과·해결 시각
Promotion Source Reference
Availability
```

기본 저장 금지:

```text
Prompt 원문
AI 응답 원문
파일 내용
Code Diff
Raw Tool Output
Git Remote 원문
절대 경로 원문
Secret·Token·Credential·환경변수 원문
```

### Fail-open

```text
State 읽기 실패
Hook 미지원
손상된 State
Repository·Worktree 식별 실패
Context Candidate 생성 실패
```

State write·Atomic rename·Schema, Session Identity, Hook 실행과 중복·동시 Event 처리 실패도
canonical Contract의 fail-open 범위에 포함한다. 위 실패는 코드 작업·Session 종료·Handoff·PR·Merge를
차단하지 않는다. 자동 저장·자동 Promotion은 수행하지 않고, 가능하면 Manual Context Checkpoint를
안내한다. 실패를 `clean`, `checkpointed`, `no_update` 또는 성공으로 표현하지 않는다.

### Responsibility Boundary

```text
project-context
= Human-confirmed Durable Project Context
= CREATE / UPDATE / CONTEXT CHECKPOINT

handoff-prompt
= Task-scoped Structured Handoff Candidate

Context Checkpoint Guard
= 검토 필요 상태 감지
= project-context Checkpoint 흐름 연결
≠ 새 Handoff Artifact
```

### DEC-062 Relationship

두 기능은 별도다.

```text
작업 활동
→ review_needed
→ SessionEnd advisory 최소 상태 보존
→ 다음 Session one-time diagnostic
→ Human Review
→ checkpointed / no_update
→ 필요 시 Handoff Candidate 생성
→ Pending 등록
→ DEC-062 Next-session Rehydration
```

One-time diagnostic은 미해결 Context 검토의 다음 기회이며 Pending Handoff Candidate 연결이 아니다.
DEC-062의 Product delivery priority, Public `v1.1.0` Gate, Pending Candidate 연결 조건과
Manual Resume fallback은 변경하지 않는다. DEC-063의 선행 관계는 Runtime data-flow의
Capture Gate 순서이며 DEC-062를 supersede하지 않는다.

### Consequences

```text
Work-start 없이 발생한 활동도 Context 검토 대상이 될 수 있다.
Human Review 없이는 Durable Context가 바뀌지 않는다.
Adapter는 관찰 가능한 Signal만 정직하게 지원한다.
Product 구현 PR은 FX-CCG Fixture와 Runtime별 Evidence를 제공해야 한다.
Foundation Merge 후 Product 구현 착수가 가능하지만 구현 완료로 표기하지 않는다.
```

### Affected Documents

```text
docs/contracts/context-checkpoint-guard-contract.md
docs/contracts/README.md
docs/product/v1-completion-criteria.md
docs/testing/v1-fixture-plan.md
docs/decisions/decision-log.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

### Implementation and Verification

```text
implementation_completed: not_verified
fixture_passed: not_verified
manual_e2e: not_verified
runtime_supported: not_verified
```

---

# Part II. Architecture Decisions

## DEC-005 — Shared Platform과 Domain Extension 책임을 분리한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Shared Platform
= Domain-neutral Contract와 공통 Orchestration 경계

Development Extension
= Repository·Worktree·Diff·Runtime Adapter 기반 실행

Finance Extension
= Lens·PolicyGuard·Journal·Review Domain
```

현재 public `oh-my-ai` Repository는:

```text
Development Extension의 Local CLI / Runtime 구현
≠ 전체 Shared Platform의 물리적 Owner
≠ Finance Extension의 물리적 Owner
```

### Rationale

```text
공통 Contract와 Domain 실행 모델을 분리해야
Development와 Finance가 서로의 Repository·Data Model에 종속되지 않는다.
```

### Constraints

```text
Shared Core는 최소 Vocabulary와 Contract만 소유
공통 DB·Service·Domain Model 강제 금지
```

### Consequences

```text
Extension별 구현과 Repository는 독립적으로 발전할 수 있다.
```

### Affected Documents

```text
docs/architecture/shared-core-and-extensions.md
docs/roadmap/product-roadmap.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-006 — Finance Extension은 Development V2 전체 완료에 종속되지 않는다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Finance Contract와 Knowledge Architecture 작업은
Development Harness V2 전체 완료를
선결 조건으로 요구하지 않는다.
```

Finance는 다음 Development 실행 모델을 Domain Contract에 상속하지 않는다.

```text
Repository
Branch
Worktree
Diff
Writer Lease
Agent Process
```

### Rationale

```text
Finance Domain은 Lens·PolicyGuard·Journal·Review 중심이며
Development의 Repository 실행 모델과 책임 구조가 다르다.
```

### Constraints

```text
Shared Core의 최소 Contract와 Safety Vocabulary만 공유한다.
```

### Consequences

```text
Finance 문서와 Domain 설계는 독립적으로 진행할 수 있다.
```

### Affected Documents

```text
docs/architecture/shared-core-and-extensions.md
docs/product/finance-harness-report.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-007 — Local·Cloud·Human 권한 경계를 분리한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Local:
- Raw Context
- Source Code
- Secret
- Runtime Execution
- Local Artifact

Cloud 전송 가능 후보:
- 최소 Metadata
- Human-reviewed Artifact
- Candidate
- 명시적 정책에 따른 Product Domain Data

Full Context 전송:
- 명시적 Opt-in 필요

Cloud Candidate:
- Canonical Truth가 아님

Human:
- Scope
- 전송
- 실행
- Result
- Promotion
- Retention
  의 최종 권한 유지
```

### Rationale

```text
제품 확장성과 개인정보·소스코드 안전을 동시에 유지해야 한다.
```

### Constraints

```text
V1에서는 Cloud 전송 구현 없음
Raw Context와 Secret은 Local 유지
```

### Consequences

```text
V2·V3 Cloud 기능도 이 경계를 완화하려면 별도 Decision이 필요하다.
```

### Affected Documents

```text
docs/architecture/local-cloud-human-boundary.md
docs/roadmap/product-roadmap.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-057 — Shared Identity와 Shared Commerce의 논리적 책임 경계를 분리한다

**Status:** accepted_with_constraints
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** architecture
**Decision date:** 2026-07-23
**Implementation status:** not_started
**Reviewed at:** 2026-07-23

### Decision

```text
V1 Local OSS는 로그인·결제·외부 Cloud 서비스 없이 완결한다.

Shared Identity
= Account·Credential·Authentication·Token·Session

Shared Commerce
= Product Membership·Subscription·Billing·Payment·Entitlement·Quota

Shared Identity와 Shared Commerce는 동급의 독립 논리 경계다.

Dev Harness Cloud
= Workspace·Project·Execution·Approval·Harness Policy·Cloud History
```

Accepted 범위는 논리적 책임과 의존 방향이다.

### Constraints

```text
Identity·Commerce의 물리 Server·Repository·Database·Deployment는 승인하지 않는다.
실제 복수 소비자와 운영상 필요가 생긴 뒤 물리 분리를 검토한다.
V1에 Identity·Commerce 의존을 도입하지 않는다.
기존 V2 Personal Managed Workflow 정의를 변경하지 않는다.
Workspace·Organization의 V3 배치를 변경하지 않는다.
```

### Deferred

```text
Identity·Commerce 물리 구현과 배포 시점
Repository와 Database 분리
JWT·JWKS 상세
결제 Database Schema와 PG Provider
서비스 간 이벤트
Kubernetes 구성
```

### Consequences

```text
Payment와 Entitlement를 Identity 책임으로 해석하지 않는다.
Development Harness는 제품 도메인 책임을 외부 공통 플랫폼에 넘기지 않는다.
논리 경계 기록만으로 새 Service나 Repository를 생성하지 않는다.
기존 V1/V2/V3 Roadmap과 Accepted Decision은 유지한다.
```

### Affected Documents

```text
docs/adr/ADR-0012-shared-identity-commerce-boundary.md
docs/architecture/repository-service-boundaries.md
docs/decisions/decision-log.md
```

### Supersession

```text
supersedes: []
superseded_by:
- DEC-067 (Shared Identity physicalization 미승인과 시점 deferral 범위만)
```

Identity·Commerce 독립 논리 경계, Commerce deferral, V1 독립성과 물리화 Trigger
원칙은 계속 유효하다.

---

## DEC-058 — 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다

**Status:** accepted_with_constraints
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** architecture
**Decision date:** 2026-07-23
**Implementation status:** not_started
**Reviewed at:** 2026-07-23

### Decision

```text
Target Deployment Units
= Carelog CRM Server
+ Finance Harness Server
+ Dev Harness Cloud Server
+ AI Runtime Server
+ Shared Platform Server
   - Identity Module
   - Commerce Module
   - Audit Module
```

초기 PostgreSQL은 하나의 물리 Cluster를 공유할 수 있다.

```text
carelog_db
finance_db
dev_cloud_db
ai_runtime_db
shared_platform_db
  - identity schema
  - commerce schema
  - audit schema
```

Deployment Unit과 Shared Platform Module별로
데이터 Source of Truth와 Migration 소유권을 분리한다.

### Constraints

```text
목표 Deployment Unit은 즉시 구현 승인이 아니다.
V1 Local Core는 Shared Platform과 Cloud AI Runtime 없이 완결한다.
Dev Harness Cloud는 실제 Cloud 기능 개발 시점까지 구현을 유예한다.
Commerce는 실제 유료화 전까지 구현을 유예할 수 있다.
Audit는 Shared Platform 내부 Module이며 별도 Server로 분리하지 않는다.
Cross-service Foreign Key와 OLTP Cross-service JOIN을 금지한다.
다른 서비스 Database 직접 접속을 금지한다.
기존 V2/V3 Roadmap을 변경하지 않는다.
```

### Audit Boundary

```text
Product / Service
= Domain Audit Event 의미와 생성 시점

Shared Platform Audit Module
= 선택적 중앙 보관·조회·보존정책
```

서비스별 Local Outbox를 사용할 수 있으며,
Shared Audit API의 업무 Transaction 내 동기 호출을 강제하지 않는다.

### Deferred

```text
실제 Server·Repository·Database·Deployment 생성
Dev Harness Cloud 구현 시점
Commerce 구현 시점
중앙 Audit 활성화 시점
별도 PostgreSQL Cluster 분리 시점
JWT·결제·Prompt·Event Broker·분산 Transaction 상세
```

### Consequences

```text
Shared Platform은 하나의 Deployment Unit이면서
Identity·Commerce·Audit의 코드·데이터·Migration 경계를 유지한다.

다른 서비스 데이터는 API·Token Claim·Event·Projection으로 소비한다.
Cross-product 분석은 별도 Read Model 또는 ETL 경로를 사용한다.
Audit Event는 Domain Entity의 물리 FK 대신 opaque identifier를 저장한다.
```

### Affected Documents

```text
docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
docs/architecture/repository-service-boundaries.md
docs/architecture/README.md
docs/decisions/decision-log.md
```

### Supersession

```text
supersedes: []
superseded_by:
- DEC-060 (Shared Platform Server 명칭 및 물리 그룹 파생 명칭 범위만)
- DEC-067 (Gateway·Identity physicalization 미승인과 Audit 영구 비분리 해석 범위만)
```

ADR-0012와 DEC-057의 논리 경계를 유지하며 이를 supersede하지 않는다.
Module·Data·Schema·Migration Ownership, no cross-service DB/FK/JOIN, Commerce
deferral과 Audit의 현재 미구현 상태는 계속 유효하다.

---

## DEC-056 — Notice는 Cache-first Display와 비차단 One-shot Refresh로 분리한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-20

### Decision

```text
1. Work-start 명시 실행 시 Local Cache Snapshot을 읽는다
2. 시작 시 Cache에 존재한 활성 Notice만 현재 출력 말미에 표시한다
3. Cache가 stale이면 비차단 one-shot Refresher를 실행한다
4. Remote 결과를 현재 실행 출력에 삽입하지 않는다
5. 새로 받은 Notice는 다음 Work-start부터 표시한다
6. Refresher는 Cache만 갱신하고 별도 사용자 출력을 생성하지 않는다
7. 모든 Notice 실패는 Work-start exit code와 Artifact 생성에 영향이 없다
```

모듈 경계:

```text
Local Product Services
└─ Notice Module
   ├─ read_for_display
   ├─ select_active_notice
   ├─ render_notice
   └─ refresh_if_stale
```

Work-start는 통합 인터페이스만 알며 다음을 소유하지 않는다.

```text
GitHub Manifest URL
Manifest Schema 세부 구조
Lock 구현
Atomic Write 구현
Cache 파일 내부 구조
향후 Cloud API
```

Network, Refresh, Notice 표시가 발생하지 않는 경로:

```text
UserPromptSubmit Hook
Natural Suggestion
Synthetic Event
Worker Session
Result Basic 생성
기본 Doctor 실행
기본 setup.sh 실행
```

### Rationale

```text
동기 조회 후 즉시 표시하면
Work-start 소요 시간과 출력이 Network 응답에 종속돼
실패 격리와 출력 결정성이 동시에 깨진다.

상주 Daemon은 공지 최신성은 높지만
Public V1을 상주 Process 요구 제품으로 만들고
OS별 등록·해제·잔존물 비용을 발생시킨다.

Cache-first 분리는 새 Notice 도달을
최소 1회 실행만큼 지연시키는 대신
실패 격리, 출력 결정성, 상주 Process 부재를 모두 확보한다.

제품 공지는 초 단위 최신성이 필요한 데이터가 아니므로
지연은 지불 가능한 비용이다.
```

상세 대안 비교는 ADR-0011이 소유한다.

### Constraints

```text
Refresh는 Work-start Core 실행 이후에 시작한다
Work-start는 Refresher 종료를 기다리지 않는다
Refresh 실패는 기존 정상 Cache를 보존한다
Refresher는 Scheduler, Cron, OS Service를 등록하지 않는다
Manifest Cache와 User Choice State는 다른 저장 영역에 둔다
Cache와 State 갱신은 atomic write로 수행한다
Concurrent Refresh는 Local Lock으로 중복을 방지하며 대기하지 않는다
```

### Consequences

```text
Notice Fixture가 Network Mock 없이
Cache 파일 상태 조작만으로 결정적으로 재현된다

Notice Source가 향후 변경돼도
Work-start Contract를 변경하지 않는다

Stale Lock과 Cache 경로 반복 삭제가 새 운영 위험으로 추가된다
```

### Affected Documents

```text
docs/adr/ADR-0011-local-product-notice-channel.md
docs/contracts/product-notice-contract.md
docs/contracts/work-start-contract.md
docs/architecture/local-cloud-human-boundary.md
docs/testing/v1-fixture-plan.md
```

### References

```text
ADR-0011
DEC-054
DEC-055
DEC-001
DEC-051
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-059 — Backend Service Foundation 명칭을 확정하고 Carelog를 Repository 지도에 등록한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-26

### Decision

```text
1. DEC-005의 "Shared Platform" 용어는 그대로 유지한다.
   Shared Platform = oh-my-ai의 Domain-neutral Contract / Shared Core 경계.

2. MSA Backend 공통 Architecture/Contract 문서군의 canonical 명칭은
   "Backend Service Foundation"이다. 이 문서군은 "Shared Platform"이라는
   이름을 사용하지 않는다.
   대상: 서비스 경계, DB 소유권, 서비스 통신, 분산 정합성,
   JWT Claim 계약, Event Envelope.
   Canonical 위치:
     docs/architecture/backend-service-foundation/
     docs/contracts/backend-service-foundation/

3. 인증을 담당하는 논리 서비스의 canonical 명칭은 "Shared Identity"다.
   `identity-platform`(docs/architecture/repository-service-boundaries.md
   §7.4)은 확정된 Repository 명칭이 아니라 기존 목표 Repository 지도상의
   후보 명칭으로 취급한다. 실제 Repository 이름은 물리 분리 결정 시
   별도로 확정한다.

4. Carelog를 docs/architecture/repository-service-boundaries.md의
   목표 Repository/Service 지도(§3.2, §7.7, §9, §10.5)에 등록한다.
   Carelog는 이미 존재하는 Product Service이며, 현재 Auth Phase A
   (Carelog 내부 논리 분리) 단계다. Shared Identity로의 물리 분리는
   아직 착수하지 않았다. Carelog의 현재 상태는 oh-my-ai V1/V2/V3
   Phase 1-5 물리화 타임라인(§16)과 섞지 않고 별도 현재 상태 항목으로
   기록한다.
```

### Rationale

```text
Shared Platform Foundation 문서 통합 과정에서 "Shared Platform"이라는
동일 이름이 두 문서군 — oh-my-ai 제품군의 Domain-neutral Contract 경계
(DEC-005)와 MSA Backend Architecture/Contract — 에서 서로 다른 의미로
쓰이는 용어 충돌이 발견됐다. 이름 자체를 분리하면 disambiguation 산문
없이 충돌이 원천 해소된다.

Carelog는 Auth Phase A로 이미 존재·운영 중인 Product Service이므로,
목표 Repository 지도에 없는 상태로 방치하면 문서 지도가 실제 상태를
반영하지 못한다. 다만 Carelog는 이미 존재하는 제품이라 oh-my-ai의
미래 지향적 Phase 1-5 타임라인과 성격이 달라, 같은 축에 섞으면
"아직 만들지 않은 것"과 "이미 있는데 상태만 다른 것"이 혼동된다.

identity-platform을 Shared Identity의 확정 명칭으로 조용히 굳히지
않고 후보로 유지하는 이유는, 실제 Repository 이름은 물리 분리라는
별도 사건 시점에 확정하는 것이 이 문서군 전체의 기존 원칙
("Repository 이름 변경은 가능하지만 책임 경계 변경은 별도 결정이
필요하다")과 일치하기 때문이다.
```

### Constraints

```text
Backend Service Foundation 문서(서비스 경계, DB 소유권, 통신,
분산 정합성, JWT, Event Envelope 5+2개 문서)는 Draft 상태를 유지한다.
Implementation completed / Runtime supported / Product released를
구현 Evidence 없이 올리지 않는다.
Carelog 등록은 신규 Repository 생성이나 Shared Identity로의
물리 분리 착수를 의미하지 않는다.
identity-platform은 후보 명칭이며 최종 Repository 이름 확정에는
별도 Decision이 필요하다.
DEC-005의 기존 내용과 Status는 이 Decision으로 변경하지 않는다.
```

### Consequences

```text
Backend Service Foundation 문서의 canonical 위치를
docs/architecture/backend-service-foundation/와
docs/contracts/backend-service-foundation/로 확정했다.

7개 Backend Service Foundation 문서의 제목·Term-scope 메타 문구를
새 명칭에 맞게 정리했다.

docs/architecture/repository-service-boundaries.md에 Carelog 항목
(§3.2, §7.7, §9, §10.5, §16 현재 상태 콜아웃, §18, §17 불변조건)을
추가했다.

docs/master/product-architecture-master.md의 §22-23 관련 서술과
§30.1에 위 관계를 반영했다.

이후 Carelog의 Shared Identity 물리 분리가 시작되면 별도 Decision과
Repository 생성 절차가 필요하다.
```

### Affected Documents

```text
docs/architecture/backend-service-foundation/README.md
docs/architecture/backend-service-foundation/service-boundaries.md
docs/architecture/backend-service-foundation/database-ownership-and-reference-policy.md
docs/architecture/backend-service-foundation/service-communication-policy.md
docs/architecture/backend-service-foundation/distributed-consistency-policy.md
docs/architecture/backend-service-foundation/documentation-ownership-and-placement.md
docs/contracts/backend-service-foundation/README.md
docs/contracts/backend-service-foundation/identity-token-contract.md
docs/contracts/backend-service-foundation/event-envelope-contract.md
docs/architecture/repository-service-boundaries.md
docs/architecture/README.md
docs/contracts/README.md
docs/master/product-architecture-master.md
README.md
```

### References

```text
DEC-005
```

### Supersession

```text
supersedes: []
superseded_by:
- DEC-067 (`identity-platform` 후보 Repository를 planned `ranikun-labs/platform-services` Target으로 확정한 범위만)
```

Backend Service Foundation 명칭, Shared Identity canonical 논리 서비스명,
Carelog 등록과 Current/Target 구분은 계속 유효하다.

---

## DEC-060 — Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다

**Status:** accepted
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** architecture / terminology / target-deployment-naming
**Decision date:** 2026-07-26
**Implementation status:** not_started
**Runtime support status:** not_supported
**Product release status:** not_released
**Reviewed at:** 2026-07-26

### Decision

```text
Shared Services Deployment Unit
= Shared Identity + Shared Commerce + Audit Module의
  향후 공동 물리 배포 후보

Shared Services Deployment Unit
≠ 실제 Server 이름 확정
≠ 실제 Repository 이름 확정
≠ 실제 Database 이름 확정
≠ 즉시 구현 또는 Deployment 승인
≠ Identity와 Commerce의 논리 경계 통합
```

### Rationale

```text
DEC-005의 Shared Platform은 Domain-neutral Contract / Shared Core 논리 경계다.
DEC-058의 Shared Platform Server는 Identity·Commerce·Audit의 물리 공동 배포 후보를 의미한다.
같은 용어가 서로 다른 축에서 재사용되면 검색·참조·후속 설계에서 논리 경계와 물리 배포 단위가 계속 혼동될 수 있다.
따라서 DEC-058의 Architecture 의미는 유지하면서 물리 배포 후보의 명칭 범위만 Shared Services Deployment Unit으로 부분 대체한다.
```

### Partial Supersession

```text
partial_supersedes:
- DEC-058의 Shared Platform Server 명칭 범위
- DEC-058의 Shared Platform 물리 그룹 파생 명칭 범위

replacement_rule:
Shared Platform Server
→ Shared Services Deployment Unit

Shared Platform Module (물리 그룹 의미)
→ Shared Services Deployment Unit 내부 Module

Shared Platform Audit Module (물리 그룹 의미)
→ Shared Services Audit Module
  또는 Shared Services Deployment Unit의 Audit Module

shared_platform_db
→ shared_services_db 예시명
```

`shared_services_db`는 Target Architecture 예시명이며, 실제 Database 이름이나
Provisioning을 확정하지 않는다.

```text
Shared Platform의 canonical 의미
→ DEC-005의 Domain-neutral Contract / Shared Core 경계로만 유지

Backend Service Foundation
→ DEC-059의 MSA 공통 Architecture / Contract 문서 패키지 명칭으로 유지
```

### Remaining Valid Scope

DEC-058의 다음 범위는 계속 유효하다.

- Target Deployment Unit 구성
- Identity·Commerce·Audit의 Module 분리
- Data / Schema / Migration Ownership 분리
- PostgreSQL 목표 배치 원칙
- Cross-service FK / OLTP JOIN 금지
- V1 Local Core 독립성
- 실제 물리 구현 미승인 상태

### DEC-059 Locator Corrigendum

DEC-059에서 Carelog 데이터 위치로 기록한
`repository-service-boundaries.md §10.5`는 병합 후 발생한 Locator 오류다.
정정 위치는 `repository-service-boundaries.md §10.7`이다.

이 Corrigendum은 Carelog의 의미나 DEC-059의 Architecture 결정을 변경하지 않으며,
DEC-059의 다른 본문도 대체하지 않는다.

### Constraints

```text
DEC-005 Shared Platform의 의미를 변경하지 않는다.
DEC-057 Shared Identity / Shared Commerce 독립 논리 경계를 변경하지 않는다.
DEC-059 Backend Service Foundation 명칭과 Carelog 상태 의미를 변경하지 않는다.
실제 Runtime·Repository·Database·Deployment·Release를 생성하거나 승인하지 않는다.
```

### Consequences

```text
Shared Platform은 DEC-005의 논리 Contract 의미로 유지한다.
Shared Services Deployment Unit은 Shared Identity·Shared Commerce·Audit의 공동 물리 배포 후보를 의미한다.
Identity와 Commerce의 독립 논리 경계, Module·Data·Schema·Migration Ownership 분리, PostgreSQL 배치 원칙은 유지한다.
실제 Server·Repository·Database·Deployment는 승인하지 않는다.
ADR-0013·Repository Map·Master·Roadmap 등 파생 문서의 물리 배포 명칭을 정렬한다.
DEC-059의 Carelog 데이터 Locator는 §10.5에서 §10.7로 정정하되 의미는 변경하지 않는다.
```

### Affected Documents

```text
docs/adr/ADR-0014-shared-services-deployment-unit-naming.md
docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
docs/adr/README.md
docs/architecture/repository-service-boundaries.md
docs/architecture/backend-service-foundation/README.md
docs/master/product-architecture-master.md
docs/product/finance-harness-report.md
docs/roadmap/product-roadmap.md
docs/decisions/decision-log.md
```

### References

```text
ADR-0014
DEC-005
DEC-057
DEC-058
DEC-059
```

### Supersession

```text
supersedes: []
superseded_by:
- DEC-067 (Shared Services Deployment Unit을 구체 Repository·Process 미승인 후보로만 둔 범위)
```

Shared Platform 논리 경계와 물리 배포 명칭 구분, Module·Data·Migration Ownership,
구현·Runtime·Release 상태 분리는 계속 유효하다.

---

## DEC-064 — 공통 플랫폼 통신·메시징·확장 기준을 정의한다

**Status:** accepted_with_constraints
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** backend-service-foundation / communication / messaging / scaling
**Decision date:** 2026-07-29
**Implementation status:** not_started
**Runtime support status:** not_supported
**Product release status:** not_released
**Reviewed at:** 2026-07-29

### Decision

```text
External API                = HTTP/JSON
Internal synchronous API    = Direct HTTP/JSON
AI token streaming          = SSE
Asynchronous event and job  = NATS JetStream after a concrete use case
Business Source of Truth    = PostgreSQL
Session, cache, short state = Redis
```

Gateway는 외부 Ingress와 Security Boundary이며 내부 Service 호출의
Proxy Hop으로 사용하지 않는다.

일반 Product 요청은 Shared Identity를 매번 호출하지 않고 검증된 인증
Context와 Product-owned authorization을 사용한다. Shared AI는 Provider와
제품 중립 실행 기술을 소유하고 Product는 Prompt, Workflow, Domain Policy,
Tool, Validation과 결과 반영을 소유한다.

gRPC, Kafka, Kubernetes는 서비스 수가 아니라 ADR-0015에 기록된 측정 가능한
병목과 운영 Trigger가 충족된 뒤 별도 Decision으로 검토한다.

### Rationale

```text
초기 단일 Host와 작은 운영 규모에서는 HTTP/JSON과 PostgreSQL·Redis가
운영 복잡도를 최소화한다.

비동기 Broker와 분산 운영 Platform은 실제 Use Case와 병목이 생긴 뒤
도입해야 도입 근거, 첫 Owner와 복구 절차를 함께 확정할 수 있다.

공통 선택을 Foundation에 두고 Service Repository에는 적용 상태만 두면
제품별 문서 Drift를 줄일 수 있다.
```

### Constraints

```text
현재 Runtime과 Target Architecture를 혼합하지 않는다.
NATS JetStream, gRPC, Kafka, Kubernetes의 구현·Provisioning을 승인하지 않는다.
Shared Identity와 Shared AI의 물리 추출을 승인하지 않는다.
Service별 API, Event Payload, Timeout 값과 Broker 설정을 Foundation에 복제하지 않는다.
실제 Secret, Credential, Host, IP와 Backup 위치를 Git에 저장하지 않는다.
```

### Consequences

- Backend Service Foundation이 공통 통신·메시징·확장 선택을 소유한다.
- 각 Service Repository는 실제 적용, 편차, DB·Migration과 운영 Evidence를 소유한다.
- 중요한 Event에만 Transactional Outbox를 요구하며 모든 Event에 강제하지 않는다.
- 첫 JetStream Use Case와 SSE 운영 계약은 후속 Decision이 필요하다.
- Foundation Decision 승인 후 Carelog의 중복 공통 ADR을 적용 문서로 축소해야 한다.

### Relationship

```text
clarifies:
- DEC-057 Shared Identity / Shared Commerce 논리 경계
- DEC-058 Target Deployment Unit과 PostgreSQL 데이터 소유권
- DEC-059 Backend Service Foundation canonical 위치
- DEC-060 Shared Services Deployment Unit 명칭

supersedes: []
superseded_by:
- DEC-067 (Shared Identity physical extraction 미승인 범위만)
```

HTTP/JSON, Direct internal call, Gateway ingress, Identity 호출 제한, NATS Trigger,
Shared AI/Product 경계와 gRPC·Kafka·Kubernetes deferral은 계속 유효하다.

### Affected Documents

```text
docs/adr/ADR-0015-platform-communication-messaging-scaling.md
docs/adr/README.md
docs/architecture/backend-service-foundation/README.md
docs/architecture/backend-service-foundation/service-boundaries.md
docs/architecture/backend-service-foundation/service-communication-policy.md
docs/architecture/backend-service-foundation/distributed-consistency-policy.md
docs/contracts/backend-service-foundation/identity-token-contract.md
docs/decisions/decision-log.md
```

### Open Questions

- 내부 Service Authentication과 Discovery
- SSE reconnect, cancellation, backpressure와 저장 정합성
- 첫 JetStream Producer·Consumer와 Subject·Retention·DLQ·Backup·Restore
- Provider-neutral RAG·Embedding·Vector·AI Job Runtime의 상세 소유권
- Trigger 충족 시 gRPC, Kafka 또는 Kubernetes 도입 여부

### References

```text
ADR-0015
DEC-057
DEC-058
DEC-059
DEC-060
RPL-20
```

---

## DEC-065 — Jira·Git·Confluence·AI Session 통합 운영 Governance를 정의한다

**Status:** accepted_with_constraints
**Owner:** governance
**Decision type:** governance
**Decision scope:** platform-foundation / work-management / ai-session
**Decision date:** 2026-07-29
**Implementation status:** not_started
**Reviewed at:** 2026-07-29

### Decision

```text
Jira
= Work Scope, State, Assignee, Priority, Dependency, Next Action

Git Canonical Docs
= Accepted Architecture, Contract, Data Ownership, Verification Criteria

GitHub
= Commit, Diff, PR, Test Evidence, Merge Commit

Confluence
= Human-readable Portfolio and System Landscape Projection

AI Session
= Temporary Working Context
```

도구 간 하나의 전역 우선순위를 두지 않고 Concern별 Canonical Owner를
사용한다. 쓰기 Session은 `One Writer Session, One Primary Jira Issue`를
따르며 Independent Review는 Read-only다.

현재 Platform Foundation Canonical Repository는
`harness-foundation-docs`다. 새 `ranikun-platform-docs` Repository는
즉시 만들지 않으며 실제 분리 Trigger가 확인되면 Rename 또는 Migration
ADR로 재검토한다.

### Rationale

```text
Tool별 책임을 분리하면 작업 상태, 승인된 Decision, Merge Evidence와
Portfolio Projection이 서로의 Source of Truth를 덮어쓰지 않는다.

Writer와 Reviewer의 권한을 분리하면 동일 Session의 자체 승인을 막고
검수된 Head만 Merge할 수 있다.

이미 ADR-0015와 DEC-064를 승인한 Repository를 유지하면
Platform Foundation Canonical의 즉시 이원화를 피할 수 있다.
```

### Constraints

```text
Jira 전역 Custom Field, Workflow, Component를 이 Decision으로 생성하지 않는다.
Confluence Page를 이 Decision으로 생성하거나 수정하지 않는다.
AI Model을 Jira Assignee 또는 Architecture Approver로 사용하지 않는다.
Merge 전 Primary Jira Issue를 완료하지 않는다.
수행하지 않은 Verification을 PASS로 기록하지 않는다.
완료된 과거 Issue 전체를 일괄 Backfill하지 않는다.
Proposed·Draft Supporting Architecture Input으로 ADR-0015·DEC-064를 변경하지 않는다.
```

### Consequences

- Workstream, Component, Primary Repository와 Area를 Jira 분류 모델로 제안한다.
- `진행 중 + 검토 중` Portfolio WIP를 최대 3개로 제한한다.
- Implementation, Independent Review, Delta Fix와 Merge Gate Template을 분리한다.
- Jira Admin과 Confluence 적용은 후속 작업과 별도 승인을 요구한다.
- 활성화되거나 다시 참조되는 Issue만 점진 보정한다.

### Relationship

```text
clarifies:
- DEC-010 Structured Handoff의 Task-scoped 권한
- DEC-025 Git Action별 독립 승인
- DEC-027 Dirty Worktree 보존
- DEC-035·DEC-038 Canonical 문서 배치와 파일명
- DEC-059 Platform Foundation canonical 위치
- DEC-064 Foundation과 Service Repository의 문서 소유권

supersedes: []
superseded_by: []
```

### Affected Documents

```text
docs/governance/README.md
docs/governance/portfolio-work-management-governance.md
docs/governance/ai-session-governance.md
templates/ai-session/README.md
templates/ai-session/*.md
source-inputs/README.md
source-inputs/ranikun-platform-enterprise-work-management-governance.md
source-inputs/ranikun-platform-ai-session-prompt-pack.md
source-inputs/ADR-PROPOSED-공통-MSA-통신-메시징-프로토콜-선택.md
source-inputs/Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md
docs/decisions/decision-log.md
```

### Open Questions

- Jira 완료 Status의 실제 Done Category
- Custom Field Type, Context, Option ID와 Component 관리자 적용
- Phase 1 Epic의 실제 Scope와 Dependency
- Confluence Page Properties Schema
- Platform 문서 Repository 분리 Trigger 충족 여부

### References

```text
RPL-23
DEC-010
DEC-025
DEC-027
DEC-035
DEC-038
DEC-059
DEC-064
```

---

## DEC-066 — Mac mini Primary와 AWS Warm Database DR 방향을 조건부 채택한다

**Status:** accepted_with_constraints
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** primary-deployment / disaster-recovery
**Decision date:** 2026-08-06
**Implementation status:** not_started
**Production adoption:** not_approved
**Runtime evidence:** runtime_unverified
**RTO/RPO status:** target_not_verified
**Decision owner:** 박성환
**Reviewed at:** 2026-08-06

### Source and Approval Scope

```text
Source: RPL-42 explicit user approval
Related ADR: ADR-0016
Approval Scope: Architecture Direction only
Production Adoption: not_approved
```

Independent Review `PASS`(`Blocking 0 / Major 0 / Minor 0`)와 Review Target
`28bd677995dc7ed787ef2cecf3229d97313d1947`을 근거로 Runtime Discovery와 Isolated
Spike·Restore Drill의 기준 방향을 승인한다. Candidate Reframe Verdict는
`PASS_WITH_CONDITIONS`, Reviewer Recommendation은
`ACCEPT_REVISED_DIRECTION_WITH_CONSTRAINTS`다.

### Accepted Direction

```text
Primary
= Mac mini + Docker Compose

Application DR first validation
= EC2 + Docker Compose
= Application/Database Host separation

Database DR first validation
= separate EC2 PostgreSQL Warm Physical Standby

Data Safety
= Base Backup + Continuous WAL Archive/PITR independent of Standby

Registry
= GHCR first validation / ECR alternative

AWS Entry
= Cloudflare Tunnel direct to EC2 Gateway first validation

ALB
= deferred_until_runtime_choice

Traffic
= Automatic Detection and Evidence Collection
+ Human-approved Fencing, Promotion, Write Enable and Traffic Failover

Failback
= Automatic Failback prohibited
+ DR Write Freeze, Cutover Boundary, Final Catch-up, Boundary Validation
+ Human-approved Primary Promotion, Controlled Write and Traffic Failback

IaC
= Terraform planning direction

Kubernetes
= deferred under ADR-0015 triggers
```

ECS Fargate + ALB, Cold Base Backup + WAL Restore, ECR와 incident-created/always-on
ALB는 조건부 대안으로 보존한다. Git Tag와 OCI Manifest/Platform Digest는 서로 다른
Release Evidence다.

### Constraints

- 실제 Mac mini, Docker/Compose와 PostgreSQL Runtime Inventory는 미완료다.
- PostgreSQL Version·Extension·Size·WAL Rate는 미확인·미측정이다.
- Warm EC2/EBS/Network, Monitoring과 Registry 비용은 `measurement_required`다.
- Replication Lag·Slot·WAL Retention·Disk Full 위험은 `verification_required`다.
- Base Backup/WAL Archive, GHCR Pull, EC2 Bootstrap과 Direct Tunnel은 미검증이다.
- Fencing, Read-only와 Writer Authority Mechanism은 미구현이다.
- Promotion, Final-sync Failback, Monthly Restore와 Quarterly Full DR Drill은 `not_run`이다.
- RTO 4시간과 RPO 15분은 `target_not_verified`다.
- Production Security Review와 Production Adoption Gate는 미완료다.

```text
Architecture Direction Accepted
≠ Production Adoption Approved

First Validation Target
≠ Runtime Implemented
```

### Evidence Gates

1. Runtime과 PostgreSQL Inventory
2. Warm EC2/EBS/Network Cost Model
3. Replication Network/Lag/Slot/Disk 검증
4. Base Backup + Continuous WAL Archive/PITR Prototype
5. GHCR Private Pull과 EC2 Compose Bootstrap
6. Cloudflare Tunnel → EC2 Gateway 검증
7. Fargate + ALB 비교 Spike
8. Warm Standby Promotion과 Final-sync Failback Drill
9. Production Security Review와 Full DR Drill
10. 별도 Production Adoption Decision

### Re-evaluation Triggers

- Multi-replica, independent scale 또는 zero-downtime 요구가 확인되면 Fargate+ALB를
  재평가한다.
- EC2 Host patch/bootstrap 부담이 RTO 또는 1인 운영 범위를 넘으면 Fargate를 재평가한다.
- Warm 비용이 Guardrail을 넘거나 Network/Replication 운영이 부적합하면 Cold Restore를
  재평가한다.
- Fargate 채택, GHCR Credential 부담 또는 External Pull 문제가 확인되면 ECR을 재평가한다.
- Fargate, Multi-AZ/Multi-replica 또는 Direct Tunnel 실패 시 ALB를 재평가한다.

### Prohibited Claims

- EC2, Warm Standby, Replication, Backup/WAL, Registry 또는 Tunnel Resource가 존재하거나
  동작한다는 주장
- ALB가 영구적으로 불필요하거나 Terraform이 적용됐다는 주장
- 비용 Guardrail, RTO 4시간 또는 RPO 15분을 달성했다는 주장
- Production Adoption 또는 Runtime 구현이 완료됐다는 주장

### Follow-up Work

- 승인된 Runtime/PostgreSQL Inventory와 Isolated Spike를 별도 실행 범위에서 수행한다.
- Restore/Promotion/Failback Evidence와 Production Security Review를 보존한다.
- Production Adoption은 모든 Gate 통과 후 별도 사용자 승인으로 결정한다.
- 승인 Metadata를 포함한 HEAD는 Independent PR Review와 Merge Gate를 거친다.

### Relationship and Supersession

```text
related_adr:
- ADR-0016

preserves:
- ADR-0013
- ADR-0015

supersedes: []
superseded_by: []
```

### Affected Documents

```text
docs/adr/ADR-0016-primary-deployment-and-disaster-recovery.md
docs/adr/README.md
docs/decisions/decision-log.md
```

System Catalog에는 현재 ADR-0016 Runtime Topology Projection이 없어 이번 Decision과
명백한 충돌이 없다. Production Runtime 상태를 추측하는 Projection은 추가하지 않는다.

### References

```text
ADR-0013
ADR-0015
ADR-0016
RPL-42
```

---

## DEC-067 — Shared Gateway와 Shared Identity의 물리화를 승인한다

**Status:** accepted_with_constraints
**Owner:** architecture
**Decision type:** architecture
**Decision scope:** shared-platform / gateway / identity / physicalization
**Decision date:** 2026-08-08
**Implementation status:** not_started
**Runtime support status:** not_supported
**Product release status:** not_released
**Repository status:** created / empty
**Repository visibility:** public (observed fact; policy not_decided)
**Decision owner:** 박성환
**Reviewed at:** 2026-08-08

### Decision

Finance Harness가 Carelog에 이어 공통 Gateway와 Identity의 두 번째 실제 Product
Consumer가 됐으므로, 다음 Target을 제약과 함께 승인한다.

```text
ranikun-labs/platform-services             repository created / empty
├── gateway-app                            independent SCG / WebFlux process
└── platform-core                          independent Spring MVC process
    ├── identity                           ACTIVE target
    ├── commerce                           DEFERRED
    └── audit                              DEFERRED
```

```text
Repository container exists / empty
Gateway + Identity physicalization accepted
≠ all Shared Platform MSA extraction
≠ Runtime implemented, supported, deployed or released
```

### RPL-72 Follow-up Refinement — G1 Inert Runtime Foundation

`RPL-52` 완료 이력과 2026-08-08 Decision을 rewrite하거나 reopen하지 않는다.
2026-08-12 `RPL-72`는 `RPL-71` 구현의 Canonical authority gap만 다음처럼 보완한다.

- G1은 Repository/Gradle bootstrap, 독립 `gateway-app` WebFlux Process와
  `platform-core/identity` MVC Process, 별도 executable JAR과 config namespace,
  startup fail-fast, process health/readiness, Process별 Dockerfile과 Compose skeleton을
  구현할 수 있다.
- Near-term Compose topology는 PostgreSQL physical instance 1개와 Redis physical
  instance 1개만 허용한다. Schema/table/migration, ACL, Identity Redis business key
  contract와 data ownership activation은 G1이 아니다.
- G1은 inert foundation이다. `/api/carelog/**`, `/api/identity/**`, `/api/finance/**`
  Product route, Public/Protected behavior, rate limit, trusted header/security boundary와
  Carelog Gateway behavior-preserving extraction은 `RPL-53` / G2가 소유한다.
- Account/Credential/Auth/OAuth, JWT/JWKS/signing key, Token/Session/Revocation,
  Identity API·Persistence·Migration과 Carelog Identity extraction은 `RPL-54` / G3가
  소유한다.
- G1 authority는 구현·Runtime 지원·Production deployment·traffic cutover·release
  완료의 증거가 아니다. 각 상태는 Repository와 Runtime evidence로 별도 검증한다.

RPL-72 refinement affected documents:

```text
docs/adr/ADR-0017-shared-platform-gateway-identity-physicalization.md
docs/decisions/decision-log.md
docs/architecture/repository-service-boundaries.md
```

### Trigger and Rationale

Carelog 단일 Consumer 시점에는 논리 경계 우선과 물리화 유예가 합리적이었다.
현재 Finance를 Carelog-owned Gateway/Auth에 연결하면 Ownership Inversion이 생기고,
Finance에 복사하면 Security·Runtime Contract Drift가 생긴다. 두 번째 실제 Consumer,
공통 Ingress/Auth 필요와 성숙한 Logical Boundary가 Gateway·Identity 범위의
Physicalization Trigger를 충족한다.

### Process and Module Boundary

- `gateway-app`과 `platform-core`는 같은 Repository의 독립 Spring Boot Process다.
- `gateway-app`은 Edge Security와 Routing을 소유하고 Product Business Logic을 갖지 않는다.
- `platform-core`는 one-process modular monolith로 시작할 수 있다.
- Module 간 Entity 공유, Repository 직접 접근, 타 Table 직접 수정과 Shared mutable
  Entity를 금지한다.
- Identity·Commerce·Audit는 Data·Schema·Migration Owner와 Public Contract를 분리한다.
- Commerce와 Audit의 구현은 Deferred다.
- Audit의 future NATS consumer boundary는 구현 승인이 아니다.
- Shared AI는 `platform-services` 밖의 future independent Python Runtime이며 Deferred다.

### Migration Sequence

```text
RPL-52 G0 Foundation approval (completed history)
→ RPL-71 implementation / RPL-72 authority: G1 inert Runtime Foundation
→ RPL-53 G2 executable Gateway behavior and behavior-preserving extraction
→ RPL-54 G3 Identity business semantics and behavior-preserving extraction
→ RPL-55 G4 Carelog cutover / regression
→ existing RPL-27 retarget to new platform-core/identity reality
→ RPL-50 Finance Backend Core
→ Finance Shared Gateway / Identity E2E
```

RPL-4 / Gateway PR #34의 pending 기능 delta는 merged baseline이나 physical extraction과
구분한다. RPL-53에서 해당 기능을 중복 구현하지 않는다. Copy나 Process 기동만으로
Migration 완료를 선언하지 않으며, Contract·Data·Security Regression과 Consumer
Cutover Evidence가 필요하다.

### Cutover and Rollback

- RPL-55 전까지 `ranikun-labs/carelog-be`가 Current Implementation Host다.
- Cutover는 Consumer Routing·Config·Data Owner 전환과 Carelog Regression 뒤 승인한다.
- Identity Data dual-writer를 허용하지 않는다.
- Process별 rollback, Token·Session·OAuth State compatibility와 쓰기 권한을 검증한다.
- RPL-52 Merge만으로 Traffic, Runtime 또는 Data Owner가 바뀌지 않는다.

### Partial Supersession

```text
ADR-0012 / DEC-057
  superseded: Shared Identity physicalization 미승인·시점 deferral
  preserved:  Identity·Commerce 논리 경계, Commerce deferral, V1 독립성

ADR-0013 / DEC-058
  superseded: Gateway·Identity physicalization 미승인,
              Audit가 영구적으로 별도 Process가 될 수 없다는 해석
  preserved:  Module·Data·Schema·Migration Ownership, no cross-service DB/FK/JOIN,
              Commerce deferral, Audit current not_implemented state

ADR-0014 / DEC-060
  superseded: Shared Services Deployment Unit을 구체 Process 미승인 후보로만 둔 범위
  preserved:  명칭 구분, Module Ownership, status separation

ADR-0015 / DEC-064
  superseded: Shared Identity physical extraction 미승인 범위
  preserved:  HTTP/JSON, Direct internal call, Gateway ingress, Identity call limits,
              NATS trigger, Shared AI/Product boundary, deferred technologies

DEC-059
  superseded: identity-platform 후보 Repository
  replacement: planned ranikun-labs/platform-services target
  preserved: Backend Service Foundation 명칭, Shared Identity 논리명, Carelog 등록
```

### Constraints

- `RPL-72`가 허용하는 Spring/Gradle/Docker/Compose 범위는 G1 inert Runtime
  Foundation뿐이다. Executable Product behavior는 G2 전에는 금지한다.
- Gateway와 Identity만 승인하며 Commerce, Audit, NATS와 Shared AI 구현을 승인하지 않는다.
- Product는 Identity Table을 직접 수정하지 않고 stable account/principal contract를 소비한다.
- Gateway와 `platform-core`를 하나의 Spring Boot Application으로 합치지 않는다.
- Current, Target, implementation, runtime support, deployment와 release 상태를 혼합하지 않는다.

### Consequences

- Finance가 Carelog Product Lifecycle에 종속되지 않고 공통 Edge/Auth를 소비할 Target이 생긴다.
- 후속 G2/G3/G4가 Repository·Process·Module·Data·Migration 경계를 추측하지 않는다.
- 하나의 Repository와 하나의 Process를 동일시하지 않는다.
- 전체 MSA 선제 분리와 Commerce·Audit·AI의 조기 구현을 피한다.

### Affected Documents

```text
docs/adr/ADR-0012-shared-identity-commerce-boundary.md
docs/adr/ADR-0013-target-deployment-and-data-boundaries.md
docs/adr/ADR-0014-shared-services-deployment-unit-naming.md
docs/adr/ADR-0015-platform-communication-messaging-scaling.md
docs/adr/ADR-0017-shared-platform-gateway-identity-physicalization.md
docs/adr/README.md
docs/architecture/repository-service-boundaries.md
docs/architecture/backend-service-foundation/README.md
docs/architecture/backend-service-foundation/service-boundaries.md
docs/master/product-architecture-master.md
docs/governance/portfolio-work-management-governance.md
catalog/system-catalog.yaml
README.md
docs/decisions/decision-log.md
```

### Supersession

```text
partial_supersedes:
- DEC-057 Shared Identity physicalization deferral only
- DEC-058 Gateway·Identity physicalization prohibition and permanent Audit non-extraction interpretation only
- DEC-059 identity-platform repository candidate only
- DEC-060 concrete repository/process nonapproval only
- DEC-064 Shared Identity physical extraction prohibition only

superseded_by: []
```

### References

```text
ADR-0012
ADR-0013
ADR-0014
ADR-0015
ADR-0017
DEC-057
DEC-058
DEC-059
DEC-060
DEC-064
RPL-4
RPL-27
RPL-50
RPL-52
RPL-71
RPL-72
RPL-53
RPL-54
RPL-55
```

---

## DEC-061 — Finance Product Service Policy는 finance-harness-docs가 canonical하게 소유한다

**Status:** accepted
**Owner:** product
**Decision type:** product
**Decision scope:** documentation-ownership / repository-boundary
**Decision date:** 2026-07-27
**Architecture status:** not_started
**Implementation status:** not_started
**Runtime support status:** not_supported
**Product release status:** not_released
**Reviewed at:** 2026-07-27

### Context

Finance Product Policy 기반 문서가 `finance-harness-docs`에 생성·병합됐다.
향후 Finance Backend Repository가 생성될 수 있으나 Product Policy와 Backend
Architecture는 서로 다른 책임을 가진다.

Product Policy를 미래 Backend로 이동한다고 가정하면 제품 원칙, 실험값,
법무·운영 기준이 구현 Repository에 종속되고 정책 변경과 구현 상태가
혼동될 위험이 있다.

### Decision

```text
finance-harness-docs
= Finance Product Service Policy의 canonical owner

service-policy/finance-product-policy.md
= 불변 Product 원칙의 canonical source

service-policy/finance-launch-experiment-values.md
= 가변 Launch Experiment Values의 canonical source

future Finance Backend
= Architecture / Implementation / Migration / API / Runtime Evidence /
  Operational Evidence owner
≠ canonical Product Policy 또는 Launch Experiment Values owner
```

미래 Finance Backend는 canonical Finance Product Policy를 참조하며, 이를
복제하거나 재정의하지 않는다.

### Rationale

- Product Policy와 구현 상태를 분리한다.
- 불변 정책과 가변 실험값을 Backend Release Cycle에서 분리한다.
- 법무·안전·제품 기준이 특정 구현 Repository에 종속되는 것을 방지한다.
- Backend Repository가 아직 물리화되지 않은 상태에서도 Product Policy를 독립적으로 확정할 수 있다.
- 여러 Backend 또는 Client가 동일한 정책을 참조할 수 있다.

### Constraints

```text
Finance Product Policy 본문과 Launch Experiment Values를 변경하지 않는다.
Finance Backend Repository 생성, Architecture, Runtime 구현, Database 또는 API 설계를 승인하지 않는다.
Product Policy Accepted를 Architecture·Implementation·Runtime·Release 완료로 해석하지 않는다.
```

### Consequences

- Foundation Repository Map은 `finance-harness-docs`의 Product Policy 소유권을 명시한다.
- 미래 Finance Backend 항목은 Product Policy 비소유를 명시한다.
- Backend Architecture 문서는 Product Policy를 source input으로 참조한다.
- Product Policy 변경은 `finance-harness-docs`에서 수행한다.
- Backend 구현 상태와 Product Policy 상태는 별도로 관리한다.
- Product Policy Accepted는 Architecture·Implementation·Runtime·Release 완료를 의미하지 않는다.

### Non-goals

```text
Finance Backend Repository 생성 승인
Backend Architecture 승인
Runtime 구현 승인
Database 또는 API 설계
회원가입 / Promotion / Trial 정책 재설계
후속 세부 정책 문서 작성
```

### Canonical References

```text
finance-harness-docs/README.md
finance-harness-docs/service-policy/README.md
finance-harness-docs/service-policy/finance-product-policy.md
finance-harness-docs/service-policy/finance-launch-experiment-values.md
```

### Affected Documents

```text
docs/architecture/repository-service-boundaries.md
docs/product/finance-harness-report.md
docs/decisions/decision-log.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part III. Workflow Decisions

## DEC-008 — V1 Workflow는 Human-controlled Manual Loop다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
User Task
→ Work-start
→ Candidate Review
→ Structured Handoff
→ Contract Validation
→ Runtime Capability Check
→ Execution Policy Check
→ Runtime Projection
→ Manual Runtime Execution
→ Result Basic Candidate
→ Human Review
→ Manual Import Candidate
```

### Rationale

```text
V1은 자동 실행보다 Contract와 책임 경계 검증이 우선이다.
```

### Constraints

```text
자동 Runtime 선택 없음
자동 Prompt 전달 없음
자동 Result 수집 없음
자동 Repository 반영 없음
자동 Context 승격 없음
```

### Consequences

```text
전체 Manual Loop가 P0 E2E다.
```

### Affected Documents

```text
docs/product/v1-completion-criteria.md
docs/testing/v1-fixture-plan.md
docs/contracts/README.md
```

### Supersession

```text
supersedes: []
superseded_by: []
superseded_scope:
  - V1 P0에 Contract Validator, Runtime Capability Check,
    Runtime Projection, Manual Import Gate가 필수라는 범위
remaining_valid_scope:
  - Local-only
  - Human-controlled
  - 자동 Runtime 실행 금지
  - 자동 Result 수집 금지
replacement_decision_refs:
  - DEC-051
```

---

## DEC-009 — Work-start는 Candidate와 Seed만 생성한다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
Work-start Output은 다음 Candidate를 생성한다.

Context Candidate
Skill Candidate
Risk Candidate
Fact Candidate
Decision Candidate
Handoff Seed
```

### Rationale

```text
Discovery 결과를 실행 계약이나 Confirmed Truth로 과장하지 않는다.
```

### Constraints

```text
Fact Candidate
≠ Confirmed Fact

Decision Candidate
≠ Confirmed Decision
```

### Consequences

```text
Human Review 전에는 Handoff와 Project Context에 자동 승격하지 않는다.
```

### Affected Documents

```text
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-010 — Structured Handoff는 승인된 Task Contract다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
Structured Handoff는
Worker에게 전달되는 Human-approved Task Contract다.
```

### Rationale

```text
Prompt와 작업 계약을 구분하고
Goal·Scope·금지사항·Completion·Validation을 보존한다.
```

### Constraints

```text
승인 후 의미 변경 시 artifact_version 증가
기존 Approval 무효화
재검수 전 Export 차단
```

### Consequences

```text
Runtime Projection은 Handoff 의미를 약화할 수 없다.
```

### Affected Documents

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
superseded_scope:
  - V1 P0에서 Validator, 승인 상태, Export 차단,
    Runtime Projection이 필수라는 범위
remaining_valid_scope:
  - Structured Handoff가 Goal, Scope, 금지 사항,
    Validation, Expected Result를 보존하는 Task Contract라는 원칙
replacement_decision_refs:
  - DEC-051
```

---

## DEC-011 — Result Basic은 Evidence Candidate다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
Result Basic은 Worker Output을 구조화한
Task-scoped Evidence Candidate다.
```

### Rationale

```text
Worker Output을 Truth·Decision·Repository Change로 자동 승격하지 않는다.
```

### Constraints

```text
Worker는 review_state: not_reviewed만 생성
Human Review 필요
Accepted Result도 자동 Apply하지 않음
```

### Consequences

```text
Result Contract Validation과 Human Review를 별도 Gate로 둔다.
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
superseded_scope:
  - 범용 Result Validator가 V1 P0 필수 Gate라는 범위
remaining_valid_scope:
  - Result Basic은 Evidence Candidate
  - Human Review 전 Truth가 아님
replacement_decision_refs:
  - DEC-051
```

---

## DEC-012 — Project Context Promotion은 별도 Human Decision이다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
Result의 Findings·Decisions·Facts는
Project Context Promotion Candidate가 될 수 있으나
자동 Durable Context 승격은 하지 않는다.
```

### Rationale

```text
Task-local Worker Claim이 장기 Truth로 오염되는 것을 방지한다.
```

### Constraints

```text
Promotion에는 별도 Human Review와 Source 확인이 필요하다.
```

### Consequences

```text
accept_result와 context.promote를 분리한다.
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part IV. Identity and Artifact Decisions

## DEC-013 — Local Reference와 Managed Entity를 분리한다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
V1 accepted Local Artifact Reference:
- handoff_ref
- result_ref
- policy_ref
- approval_ref

V2 Local Invocation Experiment Reference:
- invocation_ref
```

모든 Reference는:

```text
Local Artifact Reference
≠ Managed Entity ID
≠ Provider Session ID
```

### Rationale

```text
V1에 Managed Task·Run·Result·Approval Entity를 도입하지 않는다.
Experiment Reference를 V1 Product Identity로 승격하지 않는다.
```

### Constraints

```text
invocation_ref의 존재는 V2 Product 채택을 의미하지 않는다.
```

### Consequences

```text
Provider Session ID는 보조 Metadata로만 사용할 수 있다.
```

### Affected Documents

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-014 — Artifact Version과 Schema Version을 분리한다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
schema_version
= Contract 구조 버전

artifact_version
= 동일 Artifact Reference의 의미 변경 이력
```

### Rationale

```text
Schema 변경과 개별 Artifact Revision을 혼동하지 않는다.
```

### Constraints

```text
의미 변경 시 artifact_version 증가
구조 변경 시 schema_version 검토
```

### Consequences

```text
Approval은 Handoff Artifact Version에 결합된다.
```

### Affected Documents

```text
docs/contracts/README.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-015 — Human Edit는 Worker 원본을 참조로 보존한다

**Status:** accepted
**Owner:** contract
**Reviewed at:** 2026-07-15

### Decision

```text
Human Edit 시 artifact_version 증가
worker_original_ref 보존
edited_fields·edit_reason·reviewer 기록
```

### Rationale

```text
Worker 원본과 Human 수정본을 구분하면서
원본 전체를 중복 복제하지 않는다.
```

### Constraints

```text
worker_original_ref는 유효한 Local Reference여야 한다.
```

### Consequences

```text
Human 수정본도 다시 Contract Validation을 거친다.
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part V. Runtime and Capability Decisions

## DEC-016 — Capability·Policy·Availability·Entitlement를 분리한다

**Status:** accepted
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Capability
= Runtime의 기술적 가능성

Execution Policy
= 현재 작업에서 허용되는 행동

Availability
= 현재 Local 환경에서 실제 사용할 수 있는가

Entitlement
= 사용자·플랜·조직의 사용 권한
```

### Rationale

```text
기술 가능성·작업 허용·현재 설치 상태·제품 권한을
하나의 상태로 합치면 Truthfulness와 안전 경계가 무너진다.
```

### Constraints

```text
Entitlement는 V1 비범위
Human Approval은 Capability 조건이 아님
설치·Authentication·Network 상태는 Availability
```

### Consequences

```text
Compatibility Report는 각 상태 축을 분리한다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-017 — 최소 1개 Runtime으로 V1을 완결한다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
V1 전체 Workflow는 최소 1개 지원 Runtime으로 완결 가능해야 한다.
```

### Rationale

```text
모든 Runtime을 동시에 지원하는 것보다
하나의 정직하고 완결된 경로를 우선한다.
```

### Constraints

```text
공개 지원 Runtime마다
Metadata
Projection Fixture
Manual E2E
Known Limitation
Truthful Quick Start
가 필요하다.
```

### Consequences

```text
지원 Runtime 수보다 지원 Truthfulness를 우선한다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-018 — Advertised Runtime은 검증 Gate를 통과해야 한다

**Status:** accepted
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
지원한다고 공개하는 Runtime은 다음을 모두 충족해야 한다.

Valid Capability Metadata
Current Drift Status
Runtime Projection
Projection Fixture
Manual E2E
Known Limitation
Truthful Quick Start
```

### Rationale

```text
문서상 지원과 실제 지원 범위의 Drift를 방지한다.
```

### Constraints

```text
Gate 하나라도 실패하면 advertised_support = false
```

### Consequences

```text
Public Documentation은 Advertised Runtime Gate와 정렬돼야 한다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-019 — Runtime 자동 선택은 V1 비범위다

**Status:** deferred
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
Runtime 비교 결과는 제공할 수 있으나
V1에서 자동 선택하지 않는다.
```

### Rationale

```text
자동 선택은 Capability·Policy·Cost·User Preference를 함께 다뤄야 하며
V1 책임 범위를 초과한다.
```

### Constraints

```text
V1은 Manual Runtime Selection
```

### Consequences

```text
V2 Product 이후 별도 검토한다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/contracts/runtime-capability-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-020 — V2 Local Invocation은 Experiment다

**Status:** experiment
**Owner:** product
**Reviewed at:** 2026-07-15
**Experiment outcome:** not_run

### Decision

```text
Local Runtime Invocation은
V2 Product 기능 확정 전에 POC로 검증한다.
```

### Rationale

```text
Process Supervision·Adapter 유지비·Result Normalization·안전 비용이
실제 사용자 가치를 정당화하는지 확인해야 한다.
```

### Constraints

```text
V1 Manual Workflow 유지
최소 1개 Runtime은 기본 가능성 검증
2개 Runtime은 Adapter Boundary 일반화 검증
POC Threshold는 실행 전 확정
```

### Consequences

```text
POC 결과는 별도 Go / No-go Decision 전까지 Product 기능 약속이 아니다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
docs/roadmap/product-roadmap.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part VI. Execution Policy Decisions

## DEC-021 — Unknown은 실행하지 않는다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Capability 또는 Policy 상태가 unknown이면
검증 전 실행하지 않는다.
```

### Rationale

```text
미확인 상태를 Supported·Allowed로 추정하지 않는다.
```

### Constraints

```text
Manual Verification 또는 Human Review 후 재계산 가능
```

### Consequences

```text
Unknown은 execution_readiness_status = unresolved 또는 blocked다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-022 — Prohibited와 Approval Required를 구분한다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
approval_required
= Handoff Scope 안에서 유효 Approval 후 수행 가능

prohibited
= 현재 Handoff와 Policy Artifact에서는 수행 불가
= Approval만으로 해제 불가
```

### Rationale

```text
금지 상태와 승인 가능 상태를 같은 의미로 사용하지 않는다.
```

### Constraints

```text
Hard Safety Rule과 Do Not Touch는 새 Approval로도 완화 불가
```

### Consequences

```text
Prohibited 행동을 수행하려면 새 Handoff 또는 Policy Version과 Human Review가 필요하다.
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-023 — Approval은 Handoff Scope를 확장하지 않는다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Approval은 Handoff Scope를 좁힐 수 있으나 확장할 수 없다.
```

### Rationale

```text
Approval이 승인된 작업 계약을 우회하지 못하게 한다.
```

### Constraints

```text
Scope 확대는 새 Handoff Artifact Version과 재검수 필요
```

### Consequences

```text
Scope 밖 Action은 Approval 발급 대상이 아니다.
```

### Affected Documents

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-024 — Policy Review와 Action Approval을 분리한다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
approve_policy
= Policy 계산·Scope·충돌·Safety 판정 수용

approve_specific_action
= 특정 Action과 Scope에 대한 Approval Record 생성
```

### Rationale

```text
정책 검수와 실제 Side Effect 승인을 분리한다.
```

### Constraints

```text
Policy가 approved여도 approval_required Action은 자동 승인되지 않는다.
```

### Consequences

```text
Action별 Approval Reference가 필요하다.
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-025 — Git Stage·Commit·Push·PR은 독립 Action이다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Git Stage
Git Commit
Git Push
PR Create

는 각각 독립적인 Action과 Approval을 가진다.
```

### Rationale

```text
하나의 승인으로 Repository 외부 Side Effect까지 확대하지 않는다.
```

### Constraints

```text
각 Action은 별도 Scope와 Target을 가진다.
```

### Consequences

```text
Commit Approval만으로 Push 또는 PR을 수행할 수 없다.
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-026 — Result Accept와 Repository Apply를 분리한다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
accept_result
≠ repository.apply_patch
≠ commit
≠ push
≠ context.promote
```

### Rationale

```text
Evidence Candidate 수용과 실제 Side Effect 승인을 분리한다.
```

### Constraints

```text
각 Side Effect는 별도 Action Approval 필요
```

### Consequences

```text
Accepted Result도 자동 Apply되지 않는다.
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part VII. Repository Safety Decisions

## DEC-027 — Dirty Worktree 기존 변경을 보존한다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
기존 변경을 자동 폐기·덮어쓰기·병합·Stage하지 않는다.
```

### Rationale

```text
사용자 작업과 Worker 작업을 혼합하지 않는다.
```

### Constraints

```text
dirty_known_in_scope
→ Diff Review와 명시적 처리 승인 전 수정 차단

dirty_known_out_of_scope
→ 보존하고 Scope 밖 변경 수정·Stage 금지

dirty_unknown
→ stop_and_report
```

### Consequences

```text
Repository State는 Policy와 Result에 기록된다.
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-028 — Path Safety는 Canonical Path 기준으로 검증한다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Allowed Root
Traversal
Symlink Escape
Do Not Touch
Tracked Overwrite
Git Metadata

를 Canonical / Real Path 기준으로 검사한다.
```

### Rationale

```text
문자열 경로만 비교하면 Symlink와 Traversal 우회가 가능하다.
```

### Constraints

```text
Path 검증 전 Write·Delete·Rename 금지
```

### Consequences

```text
Path Safety Fixture는 P0다.
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-029 — Secret 원문은 Artifact에 저장하지 않는다

**Status:** accepted
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Secret·Credential·Token 원문을
Prompt·Command·Output·Evidence·Log Artifact에 저장하지 않는다.
```

### Rationale

```text
Local Artifact도 민감정보 유출 경로가 될 수 있다.
```

### Constraints

```text
Synthetic Secret만 Fixture에 사용
Redaction 전 일반 Artifact 저장 금지
Cloud 전송 금지
```

### Consequences

```text
Secret Scan·Redaction·Permission 검증이 P0다.
```

### Affected Documents

```text
docs/architecture/local-cloud-human-boundary.md
docs/contracts/result-basic-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part VIII. Fixture and Release Decisions

## DEC-030 — P0 기능은 Positive·Negative Fixture를 가진다

**Status:** accepted
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
P0 기능은 Positive Fixture만으로 완료 처리하지 않는다.
```

### Rationale

```text
정상 흐름만 검증하면 Truthfulness·Safety Failure를 놓친다.
```

### Constraints

```text
Negative Fixture 필수
필요한 Domain은 Fail-open Fixture 포함
Unknown·Blocked·Not Run을 Passed로 처리 금지
```

### Consequences

```text
P0 Suite는 Positive·Negative·Drift·E2E를 조합한다.
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-031 — 최소 1개 Runtime Manual E2E가 V1 Release Gate다

**Status:** accepted
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
V1 Release 전 전체 Manual Workflow를
최소 1개 Runtime으로 End-to-End 검증한다.
```

### Rationale

```text
개별 Contract만 통과해도 전체 흐름이 닫히지 않을 수 있다.
```

### Constraints

```text
Handoff Approval
Action Approval
Projection Preservation
Result Validation
Human Result Review
Manual Import Gate
를 모두 검증
```

### Consequences

```text
Single-runtime E2E 실패 시 V1 Release 불가
```

### Affected Documents

```text
docs/product/v1-completion-criteria.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
superseded_scope:
  - Result Validation과 Manual Import 관리 Gate 전체를
    V1 E2E에서 반드시 검증해야 한다는 범위
remaining_valid_scope:
  - 최소 1개 Runtime을 사용한 Manual E2E가
    V1 Release Gate라는 원칙
replacement_decision_refs:
  - DEC-051
```

---

## DEC-032 — P0 Fixture 실패는 Known Limitation으로 우회하지 않는다

**Status:** accepted
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
P0 Fixture 실패 상태에서 Release하지 않는다.
```

### Rationale

```text
핵심 Safety·Truthfulness 실패를 문서상의 제한으로 덮지 않는다.
```

### Constraints

```text
P0 실패는 Release Blocking
```

### Consequences

```text
Known Limitation은 P1 또는 제한적 지원 범위에만 사용한다.
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
docs/product/v1-completion-criteria.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-033 — Fixture Pass와 피검사 대상 상태를 분리한다

**Status:** accepted
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
expected_fixture_result
≠ expected_subject_status
```

### Rationale

```text
Negative Fixture에서 대상이 invalid를 반환하는 것은 정상적인 Fixture Pass다.
```

### Constraints

```text
Fixture Result와 Subject Status를 같은 필드에 저장 금지
```

### Consequences

```text
Negative Fixture 판정이 결정적이 된다.
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-034 — Projection 의미 보존은 결정적으로 검증한다

**Status:** accepted
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
보호 필드를 구조적으로 추출하고
Canonical Normalization 후 비교한다.
```

### Rationale

```text
사람이나 LLM의 자유형 의미 판단만으로 P0를 판정하면 재현성이 없다.
```

### Constraints

```text
값
범위
금지 강도
필수·선택 여부
반환 의무
를 비교
```

### Consequences

```text
semantic_equal은 구조적 Comparator로 제한된다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part IX. Documentation and Repository Structure Decisions

## DEC-035 — Contract 문서는 docs/contracts에 둔다

**Status:** accepted
**Owner:** documentation
**Reviewed at:** 2026-07-15

### Decision

```text
docs/contracts/
├── README.md
├── work-start-contract.md
├── handoff-basic-contract.md
├── result-basic-contract.md
├── runtime-capability-contract.md
└── execution-policy-contract.md
```

### Rationale

```text
Contract를 Product·Architecture·POC 문서와 분리한다.
```

### Constraints

```text
현재 Repository Migration 완료 여부는 별도 검증
```

### Consequences

```text
기존 docs/contracts/work-start-contract.md는 canonical 경로로 이동 대상이다.
```

### Affected Documents

```text
docs/contracts/README.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-036 — Fixture Plan은 docs/testing에 둔다

**Status:** accepted
**Owner:** documentation
**Reviewed at:** 2026-07-15

### Decision

```text
docs/testing/v1-fixture-plan.md
```

### Rationale

```text
Release 검증 문서를 Contract와 분리한다.
```

### Constraints

```text
현재 물리 디렉터리 생성 여부는 Repository 통합 시 확인
```

### Consequences

```text
docs/testing은 canonical 문서 계층이다.
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-037 — POC 문서는 docs/poc에 둔다

**Status:** accepted
**Owner:** documentation
**Reviewed at:** 2026-07-15

### Decision

```text
docs/poc/v2-local-invocation-poc.md
```

### Rationale

```text
Experiment와 accepted Product Contract를 문서 계층에서 분리한다.
```

### Constraints

```text
POC 결과는 Product Scope가 아님
```

### Consequences

```text
docs/poc는 canonical Experiment 문서 계층이다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-038 — Canonical 파일명에 reviewed suffix를 사용하지 않는다

**Status:** accepted
**Owner:** documentation
**Reviewed at:** 2026-07-15

### Decision

```text
검수 완료본도 canonical 경로와 파일명을 유지한다.
```

### Rationale

```text
Revision은 Git History와 Version으로 관리한다.
```

### Constraints

```text
-reviewed
-final
-latest
suffix 금지
```

### Consequences

```text
Review 결과는 기존 canonical 파일을 교체한다.
```

### Affected Documents

```text
docs/contracts/README.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part X. Deferred Decisions

## DEC-039 — Runtime Broker

**Status:** deferred
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Runtime Broker는 V1에 구현하지 않는다.
```

### Rationale

```text
V1 Manual Workflow 범위를 초과한다.
```

### Constraints

```text
V2 이후 별도 검토
```

### Consequences

```text
Runtime 호출은 V2 Local Invocation POC와 별개다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-040 — Managed SessionBinding

**Status:** deferred
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Provider Session과 Handoff·Result를 관리형 Entity로 결합하지 않는다.
```

### Rationale

```text
V1·V2 POC 범위를 초과한다.
```

### Constraints

```text
V2 Managed Workflow 이후 검토
```

### Consequences

```text
Provider Session ID는 canonical identity가 아니다.
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-041 — Remote Execution

**Status:** deferred
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
Remote Runtime Execution은 Local Invocation POC와 분리한다.
```

### Rationale

```text
Cloud Task Queue·Credential·Data Boundary 문제가 추가된다.
```

### Constraints

```text
Local Invocation 검증 전 도입 금지
```

### Consequences

```text
V2 POC는 Local Child Process만 다룬다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-042 — Cloud Result Store

**Status:** deferred
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
Result 원문을 Managed Cloud Store에 저장하지 않는다.
```

### Rationale

```text
V1 Local-only 경계와 개인정보·소스코드 안전을 우선한다.
```

### Constraints

```text
V2 이후 별도 Opt-in·Policy Decision 필요
```

### Consequences

```text
V1 Result는 Local Artifact다.
```

### Affected Documents

```text
docs/architecture/local-cloud-human-boundary.md
docs/contracts/result-basic-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-043 — Workspace·Project Team Product 구현은 V3로 연기한다

**Status:** deferred
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
Workspace·Project의 책임 모델은 채택하지만
실제 Team Product 구현과 출시는 V3로 연기한다.
```

### Rationale

```text
V1·V2의 개인 Local·Pro 가치 검증이 우선이다.
```

### Constraints

```text
V1·V2에서 Team Admin·Org Policy 구현 금지
```

### Consequences

```text
DEC-004와 충돌하지 않는다.
DEC-004는 책임 모델, DEC-043은 구현 시점 결정이다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-044 — Organization Policy·RBAC·SSO

**Status:** deferred
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
Organization Policy·RBAC·SSO는 V1·V2 초기 범위에서 제외한다.
```

### Rationale

```text
Team·Enterprise 기능이다.
```

### Constraints

```text
V3 Enterprise 단계
```

### Consequences

```text
V1 Approval은 Local Human Evidence다.
```

### Affected Documents

```text
docs/roadmap/product-roadmap.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part XI. Rejected Decisions

## DEC-045 — V1에서 모든 Runtime을 동시에 지원한다

**Status:** rejected
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
채택하지 않는다.
```

### Rationale

```text
완결성과 Truthful Support보다 범위가 과도하게 커진다.
```

### Constraints

```text
최소 1개 Runtime 완결 우선
```

### Consequences

```text
Runtime 추가는 Advertised Runtime Gate를 통과해야 한다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-046 — Worker Result 자동 승인

**Status:** rejected
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Worker는 자신의 Result를 승인할 수 없다.
```

### Rationale

```text
Worker Output은 Evidence Candidate다.
```

### Constraints

```text
Human Review 필수
```

### Consequences

```text
Worker review_state 기본값은 not_reviewed
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-047 — Result Accepted 후 자동 Patch Apply

**Status:** rejected
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
Result Accept와 Repository Apply는 별도 Gate다.
```

### Rationale

```text
Evidence 수용과 Side Effect 승인을 분리한다.
```

### Constraints

```text
Apply에는 별도 Action Approval 필요
```

### Consequences

```text
Accepted Result도 자동 Apply 금지
```

### Affected Documents

```text
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-048 — Capability와 Execution Policy 통합

**Status:** rejected
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
기술적 가능성과 작업 허용을 하나의 상태로 합치지 않는다.
```

### Rationale

```text
Capability Truthfulness와 Human Approval 경계가 무너진다.
```

### Constraints

```text
별도 상태 축 유지
```

### Consequences

```text
Compatibility Report도 상태를 분리한다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-049 — Unknown을 Supported 또는 Allowed로 추정

**Status:** rejected
**Owner:** safety
**Reviewed at:** 2026-07-15

### Decision

```text
미확인 상태를 낙관적으로 실행하지 않는다.
```

### Rationale

```text
Unknown은 검증되지 않은 상태다.
```

### Constraints

```text
Manual Verification 또는 Block
```

### Consequences

```text
Unknown 실행 Fixture는 P0 Negative다.
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## DEC-050 — POC 성공을 V2 Product Scope로 자동 승격

**Status:** rejected
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
POC 결과는 별도 Product Decision 없이는 기능 약속이 아니다.
```

### Rationale

```text
기술 가능성과 제품 채택을 분리한다.
```

### Constraints

```text
Go / No-go 후 새 Decision 필요
```

### Consequences

```text
POC 문서는 Experiment 상태를 유지한다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
docs/roadmap/product-roadmap.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part XII. Open Decisions

## OPEN-001 — Capability Metadata 형식과 Registry 위치

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Capability Metadata의 직렬화 형식과 저장 위치를 구현 전에 정해야 한다.
```

### Constraints

```text
YAML / JSON
Registry Path
Capability 전용 Schema
```

### Consequences

```text
Runtime Metadata 구현 전 결정 필요
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-002 — Policy Artifact 형식

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Approval Artifact 분리와 Default Policy 저장 구조를 정해야 한다.
```

### Constraints

```text
Approval Artifact 분리 여부
Default Policy 경로
Path Glob 표준
```

### Consequences

```text
Policy Resolver 구현 전 결정 필요
```

### Affected Documents

```text
docs/contracts/execution-policy-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-003 — Fixture Runner 구현 언어

**Status:** open
**Owner:** quality
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
결정성·Schema Validation·Runtime Fixture 실행을 고려해야 한다.
```

### Constraints

```text
Shell
TypeScript
Go
기타
```

### Consequences

```text
Fixture 구현 시작 전 결정 필요
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-004 — Runtime Projection 파일 형식

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Runtime-neutral Handoff와 Runtime-native Projection을 구분해야 한다.
```

### Constraints

```text
Markdown
YAML + Markdown
Runtime-native Format
```

### Consequences

```text
Projection Builder 구현 전 결정 필요
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-005 — V2 Local Invocation POC 첫 Runtime

**Status:** open
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
POC 착수 전 최소 1개 Runtime을 선택해야 한다.
```

### Constraints

```text
Codex CLI
Claude Code CLI
```

### Consequences

```text
POC Fixture와 Adapter 범위가 결정된다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-006 — Local Artifact Root

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Repository 오염·권한·Retention·Migration을 함께 고려해야 한다.
```

### Scope

```text
OPEN-006 Local Artifact Root
= Task·Workflow Artifact 저장 위치
  (Work-start Summary, Handoff, Result, Projection, Evidence 등)
```

Scope 제외:

```text
Product Notice 등 installation-scoped Local Product Service의
Runtime Cache와 User Choice State는 OPEN-006 범위 밖이다.
```

이유:

```text
OPEN-006
→ 이 Repository·Session의 산출물을 어디 둘까

Product Notice Local State
→ 이 설치의 전역 선호를 어디 둘까
```

Product Notice의 Manifest Cache와 Dismiss·Opt-out·Impression State는
Repository나 Task에 종속되지 않는 Installation-scoped 데이터이며,
XDG Cache·Config 규칙만으로 경로가 확정된다.

이 Scope 제외는 새 Decision이 아니라 기존 DEC-054·DEC-056·ADR-0011이
이미 전제한 Data Class 경계를 명시적으로 기록한 것이다.

상세는 `docs/contracts/product-notice-contract.md` §26을 참조한다.

### Constraints

```text
Repository-local
User Home
XDG-compatible Path
```

### Consequences

```text
Artifact Store 구현 전 결정 필요
```

### Affected Documents

```text
docs/contracts/README.md
docs/poc/v2-local-invocation-poc.md
docs/contracts/product-notice-contract.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-007 — POC Threshold 수치

**Status:** open
**Owner:** product
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Go / No-go 판단을 결과 이후에 왜곡하지 않으려면 사전 기준이 필요하다.
```

### Constraints

```text
E2E Pass Rate
Manual Step Reduction
Adapter Maintenance Budget
Runtime·OS Matrix
```

### Consequences

```text
POC 실행 전에 확정해야 한다.
```

### Affected Documents

```text
docs/poc/v2-local-invocation-poc.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-008 — 공통 Contract Validation Engine

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Work-start·Handoff·Result·Capability·Policy·Fixture가
공통 Validation Engine을 공유할지 결정해야 한다.
```

### Constraints

```text
Capability 전용 Schema는 OPEN-001의 범위
공통 Validator Engine은 OPEN-008의 범위
```

### Consequences

```text
Contract Validator 구현 전 결정 필요
```

### Affected Documents

```text
docs/contracts/README.md
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-009 — Runtime Version Range 문법

**Status:** open
**Owner:** architecture
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Runtime Metadata의 호환 범위를 결정적으로 표현해야 한다.
```

### Constraints

```text
SemVer
Exact Version
Adapter-defined Range
```

### Consequences

```text
Capability Metadata 작성 전 결정 필요
```

### Affected Documents

```text
docs/contracts/runtime-capability-contract.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

## OPEN-010 — Generated Artifact Commit 정책

**Status:** open
**Owner:** documentation
**Reviewed at:** 2026-07-15

### Decision

```text
미결정
```

### Rationale

```text
Generated Artifact의 Drift·Repository 오염·재현성을 함께 고려해야 한다.
```

### Constraints

```text
Commit
Ignore
Local Cache
```

### Consequences

```text
Release Packaging 전 결정 필요
```

### Affected Documents

```text
docs/testing/v1-fixture-plan.md
```

### Supersession

```text
supersedes: []
superseded_by: []
```

---

# Part XIII. Decision Consistency Rules

## 51. 충돌 우선순위

충돌 판정 시:

```text
1. Hard Safety Invariant
2. 최신 Accepted ADR
3. 최신 Accepted 또는 Accepted-with-constraints Decision
4. 해당 Decision에서 파생된 Accepted Contract
5. Experiment
6. Open Decision
7. Implementation Convenience
```

동일 계층에서는:

```text
명시적 supersession
더 구체적인 Scope
더 최근 reviewed_at
```

순서로 판정한다.

---

## 52. 변경 규칙

Accepted Decision을 변경하려면:

```text
새 Decision Record 생성
기존 Decision status = superseded
supersedes / superseded_by 연결
영향 문서 갱신
Human Review
```

기존 Decision 본문의 의미를 조용히 변경하지 않는다.

---

## 53. Open Decision 처리

Open Decision은 구현자가 임의로 accepted로 바꾸지 않는다.

임시 선택이 필요하면:

```text
temporary implementation choice
decision owner
revisit condition
rollback path
```

를 기록한다.

---

## 54. Experiment 처리

Experiment Outcome:

```text
validated
validated_with_constraints
rejected
inconclusive
```

Outcome과 Decision Status를 분리한다.

```text
validated / validated_with_constraints
→ 새 Product Decision 필요

inconclusive
→ experiment 유지
```

---

## 55. Public Documentation 규칙

Public Documentation은 다음 상태만 현재 지원 사실로 표현할 수 있다.

```text
accepted
accepted_with_constraints
```

`accepted_with_constraints`는 제약과 Known Limitation을 함께 표시한다.

다음 상태는 현재 지원 사실로 표현하지 않는다.

```text
experiment
open
deferred
rejected
superseded
```

---

## 56. 문서 정합성

다음 문서는 Decision Log와 충돌하면 안 된다.

```text
Product Roadmap
Architecture Documents
Completion Criteria
Contracts
Fixture Plan
POC Plan
Public Documentation
Quick Start
```

충돌 발견 시:

```text
Decision Log가 오래됨
→ 새 Decision 생성 또는 갱신

하위 문서가 오래됨
→ 하위 문서 수정

판정 불가
→ Conflict 기록 후 Human Review
```

---

## 57. 불변조건

1. Accepted Decision과 Experiment를 섞지 않는다.
2. Open Decision을 구현 사실처럼 표현하지 않는다.
3. Deferred Decision을 V1 요구사항으로 승격하지 않는다.
4. Rejected Decision을 다른 이름으로 재도입하지 않는다.
5. Superseded Decision을 현재 기준으로 사용하지 않는다.
6. Product Scope와 Technical Experiment를 분리한다.
7. Decision 변경은 새 Record와 Supersession으로 추적한다.
8. Public Documentation은 accepted 또는 accepted_with_constraints만 지원 사실로 표현한다.
9. Implementation Convenience가 Safety Decision을 덮어쓰지 않는다.
10. POC 결과는 별도 Product Decision 전까지 Experiment다.
11. Conceptual Architecture 채택과 Product 구현 시점을 구분한다.
12. Experiment 전용 Reference를 V1 Product Identity로 승격하지 않는다.

---

## 58. 관련 문서

```text
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/product/v1-completion-criteria.md
docs/contracts/README.md
docs/contracts/context-checkpoint-guard-contract.md
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/contracts/product-notice-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

---

## 59. 검수 관점

### Completeness

- accepted Product·Architecture·Contract Decision이 누락되지 않는가
- Experiment·Deferred·Rejected·Open 상태가 분리되는가

### Consistency

- Product Roadmap과 충돌하지 않는가
- Contract 책임 경계와 일치하는가
- V1/V2/V3 경계를 유지하는가

### Traceability

- 모든 Record가 동일 Metadata Contract를 따르는가
- 영향 문서와 Supersession을 추적할 수 있는가

### Safety

- Human-controlled·Local-only·Truthfulness 원칙이 유지되는가
- Unknown·Automatic Apply·Self-approval이 재도입되지 않는가
