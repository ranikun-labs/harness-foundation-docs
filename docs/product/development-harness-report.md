---
title: Development Harness Report
status: draft
implementation_status: partial
owner: development
snapshot_branch: master
snapshot_commit: 40c0250
snapshot_commit_title: "docs(harness): standardize pull request governance"
snapshot_date: 2026-07-14
last_reviewed: 2026-07-14
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0002
  - ADR-0003
  - ADR-0005
  - ADR-0006
  - ADR-0007
  - ADR-0008
source_inputs:
  - oh-my-ai-v1-v2-product-boundary-audit
---

# Development Harness Report

## 1. 문서 목적

이 문서는 public `oh-my-ai` Repository의 현재 구현 상태를 Development Harness 관점에서 기록한다.

목적은 다음과 같다.

1. 현재 구현된 기능과 문서화만 된 목표를 구분한다.
2. V1 Community 완료에 필요한 Gap을 식별한다.
3. 기존 자산을 유지·수정·이관·제거 후보로 분류한다.
4. V1과 V2의 제품 경계를 실제 Repository 기준으로 검증한다.
5. 구현 우선순위와 PR 단위를 정의한다.
6. `product-architecture-master.md`, `product-roadmap.md`, `v1-completion-criteria.md`의 입력을 제공한다.
7. 미래 기능 미구현을 현재 결함으로 오인하지 않도록 한다.

이 문서는 목표 아키텍처를 새로 정의하지 않는다.

목표 제품 경계는 다음 문서를 따른다.

```text
docs/master/product-architecture-master.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
```

이 문서는 특정 시점의 tracked Repository 상태를 기록하는 **Current-state Snapshot**이다.

---

## 2. Snapshot 기준

분석 기준:

```text
Repository: oh-my-ai
Branch: master
Commit: 40c0250
Commit title: docs(harness): standardize pull request governance
Date: 2026-07-14
```

분석 범위:

```text
Tracked files only
```

분석 근거로 사용하지 않은 것:

```text
Local dirty diff
Untracked files
Stash
다른 Session의 미반영 초안
미병합 Branch
```

이후 Repository가 변경되면 이 문서의 Snapshot 정보와 구현 판정을 갱신해야 한다.

---

## 3. Executive Summary

현재 `oh-my-ai`는 다음 제품으로서는 상당 부분 구현돼 있다.

```text
Skill Routing
+ Runtime Adapter Instruction
+ Local Context
+ Human-gated Execution
```

하지만 현재 확정된 V1 제품 정의는 다음과 같다.

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

현재 Repository는 위 흐름의 기반 자산을 보유하고 있으나, 전체 위임·회수 Loop가 아직 닫히지 않았다.

핵심 판단:

```text
기존 구현
= Local Skill / Context / Adapter Harness

현재 V1 목표
= Local Manual Artifact Workflow
```

새 V1 기준의 추정 진척률:

```text
45~50%
```

이 수치는 코드 라인 수가 아니라 **V1 사용자 흐름과 완료 Gate 기준**이다.

가장 큰 Gap:

```text
Runtime-neutral Handoff Contract
Result Basic Contract
Manual Copy/Paste Flow
Human Review
Routing / Hook / Truthfulness Fixtures
Manual E2E
Doctor
최소 설치·실행 경로
Public Product Documentation Alignment
```

현재 구조가 V1과 반대 방향으로 고정된 치명적 Conflict는 확인되지 않았다.

핵심 문제는 재설계가 아니라 **기존 자산을 새로운 V1 Contract로 정렬하고 누락된 반환 흐름을 완성하는 것**이다.

---

## 4. 제품 정의 정렬

## 4.1 현재 Repository가 잘하는 것

```text
AI Runtime별 Instruction Projection
Skill Metadata와 Routing
Local Context 후보 생성
Human-gated Execution Policy
Local Usage Log
Generated Artifact 관리
Non-destructive Installation
```

## 4.2 V1에서 추가로 완성해야 하는 것

```text
기존 Work-start 출력 정렬
기존 handoff-prompt의 Structured Handoff Candidate 보강
Result Basic 수동 Template
Manual Copy/Paste 흐름
Human Review
최소 Positive / Negative Fixture
Manual E2E
Doctor
최소 설치·실행 경로
```

## 4.3 V1이 아닌 것

```text
Managed Task Database
Automatic Worker Creation
Automatic Session Discovery
Automatic Prompt Delivery
Automatic Result Collection
Cloud Account
Auth
Entitlement
Managed Memory
Task Graph
Runtime Broker
Sidecar
Runtime Invocation
Managed Result Return
Result 자동 저장
Result 자동 감지
Task / Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Worktree 자동 생성
복수 Worker Coordination
Organization Governance
```

## 4.4 V2 Commercial Boundary 해석

이 보고서에서 `Cloud / Auth / Billing` 또는 `Entitlement`를 V2로 이관한다고 표현하는 것은
V2 CLI 업데이트가 곧 Login 또는 Subscription을 요구한다는 뜻이 아니다.

Canonical Product Boundary:

```text
V2 CLI Update
≠ Login

Login
≠ Subscription

Authentication
≠ Entitlement

Architecture Version
≠ Commercial Tier
```

Development Harness의 Commercial Tier는 다음처럼 해석한다.

```text
Community
= 로그인 없는 Local Manual Workflow
+ V2 CLI에서도 유지

Signed-in Free
= Authentication 완료
+ 활성 유료 Subscription 없음
+ Community 기능 유지

Pro
= Local Managed Workflow의 관리와 검증

future Power
= Cloud Sync, Cross-device Resume, Backup, Web Review,
  개인용 Remote Worker, 고급 자동화 후보
```

Subscription 종료나 Entitlement 실패는 Local 데이터 삭제 권한이 아니다.
기존 Local Artifact 열람과 Community 기능은 유지하며,
신규 Pro 관리 작업만 제한할 수 있다.

---

## 5. 현재 상태 요약

| 영역 | 상태 | V1 판단 | 핵심 처리 |
|---|---:|---:|---|
| Runtime Adapter Instruction | Implemented | 필수 | 유지 |
| Instruction Cascade | Implemented | 필수 | 유지 |
| Skill Registry / Index | Implemented | 중요 | 유지 |
| Prompt Routing Hook | Implemented | 중요 | Fixture 보강 |
| Work-start | Partial | 필수 | Handoff Seed로 수정 |
| Handoff Prompt | Partial | 필수 | Structured Handoff Contract로 수정 |
| Project Context | Partial | 중요 | Durable Context 경계 보강 |
| Execution Policy | Implemented | 필수 | 유지 |
| Local Usage Log | Implemented | 선택 | 유지 |
| Result Basic | Missing | 필수 | 신규 |
| Static Capability Metadata | Missing | 필수 | 신규 |
| Handoff Review / Export Flow | Missing | 필수 | 신규 |
| Result Review / Import Flow | Missing | 필수 | 신규 |
| End-to-end Fixture | Missing | 필수 | 신규 |
| Automatic Session Capture | Documented-only | V2 | 이관 |
| Cloud / Auth / Billing | Contract-only | V2 Commercial | Pro 진입과 Account 기능으로 이관, V2 Update 선결 조건 아님 |
| Work-start Skill Matcher | Implemented / Partial Contract | 필수 | Routing 정렬 |
| Artifact Registry Check | Implemented | 품질 | 유지 |
| Repository Setup / Governance | Implemented | 운영 | 유지 |

---

## 5.1 추가 확인 자산

보고서의 상태 판정에 영향을 주는 주요 보조 파일:

```text
scripts/work-start-skill-match.mjs
scripts/cascade-check.sh
Makefile
setup.sh
.github/PULL_REQUEST_TEMPLATE.md
```

역할:

```text
work-start-skill-match.mjs
= Work-start의 실제 Skill 후보 계산 Consumer

cascade-check.sh
= Generated output equivalence가 아니라 Artifact Registry 등록 검증

Makefile
= Instruction과 검증 진입점

setup.sh
= Non-destructive 설치 흐름

PULL_REQUEST_TEMPLATE.md
= Repository 변경 거버넌스
```

---

# Part I. Implemented Assets

## 6. Runtime Adapter Instruction

Runtime Instruction Projection:

```text
instructions/adapters/claude.md
instructions/adapters/codex.md
CLAUDE.md
claude/CLAUDE.md
AGENTS.md
```

Runtime Hook Wiring:

```text
claude/settings.json
codex/hooks.json
scripts/prompt-routing-hook.mjs
```

현재 역할:

```text
Generic Harness Instruction
→ Runtime-specific Instruction Projection
```

판정:

```text
Implemented
```

유지해야 하는 이유:

- Provider별 차이를 Adapter에 격리한다.
- Core Product Meaning을 특정 Runtime에 고정하지 않는다.
- Claude와 Codex를 교체 가능한 Runtime으로 취급할 기반이 있다.
- V1의 수동 Handoff를 Runtime별 Prompt로 투영할 수 있다.

현재 Gap:

- Adapter별 정형 Capability Metadata가 없다.
- Generic Handoff 의미가 Projection 과정에서 보존되는지 검증하는 Fixture가 없다.
- Claude와 Codex의 지원 기능 차이를 정형 Contract로 표현하지 않는다.
- Gemini 또는 Future Runtime은 아직 확인된 구현 범위가 아니다.

권장 처리:

```text
Adapter Instruction은 유지
Capability Metadata는 신규 추가
Projection Semantic Fixture 추가
```

---

## 7. Instruction Cascade

현재 확인된 주요 파일:

```text
instructions/harness.md
scripts/render-instructions.sh
hooks/pre-commit
```

판정:

```text
Instruction Cascade: Implemented
Pre-commit Regeneration: Implemented
Generated Output Drift Verification: Partial
Artifact Registry Drift Check: Implemented
```

현재 가치:

- 공통 Instruction Source를 Runtime별 산출물로 생성한다.
- Generated File Drift를 줄인다.
- 수동 복사보다 재현 가능한 배포가 가능하다.
- Pre-commit 검증을 통해 계약 Drift를 조기에 발견할 수 있다.

V1에서 유지할 책임:

```text
Source Instruction
→ Generated Runtime Instruction
→ Drift Verification
```

V1에서 추가해야 하는 것:

- Handoff와 Result Contract가 Instruction Cascade와 충돌하지 않는지 검증
- Runtime Adapter가 지원하지 않는 기능을 지원한다고 주장하지 않는지 검증
- Generated Artifact가 Source of Truth로 오해되지 않도록 문서화
- `make check-generated` 또는 동등한 clean-tree equivalence 검증
- CI에서 generated output drift를 차단하는 Gate

---

## 8. Skill Registry와 Routing

현재 확인된 주요 파일:

```text
skills/*/SKILL.md
skills/skill-index.json
scripts/render-skill-index.mjs
scripts/prompt-routing-hook.mjs
```

판정:

```text
Skill Registry / Generated Index: Implemented
Keyword-trigger Routing Consumer: Implemented
전체 Routing Contract 지원: Partial
```

현재 가치:

- Skill Metadata를 Index로 생성한다.
- Prompt에 맞는 Skill 후보를 advisory 방식으로 제안한다.
- 자동 실행 대신 Human Gate를 유지한다.
- Runtime 실행 전에 사용할 Playbook 후보를 제시할 수 있다.

현재 Gap:

```text
Work-start 문서의 수동 Routing Table
vs
SKILL.md Metadata / Generated skill-index.json
vs
scripts/work-start-skill-match.mjs의 실제 Consumer 범위
```

Index Schema는 `keyword`, `intent`, `pattern` Trigger를 허용하지만 현재 일반 Consumer는 keyword Trigger를 중심으로 동작한다.

두 Source와 Consumer 의미가 불일치하면 Routing Drift가 발생할 수 있다.

V1 정렬 기준:

```text
skills/*/SKILL.md routing metadata
→ generated skills/skill-index.json
→ Routing Consumer가 실제 지원하는 Trigger Contract
```

수동 표는 설명용으로만 유지하거나 제거한다.

V1에서 intent·pattern을 구현하지 않는다면 keyword-only Contract를 명시해야 한다.
지원한다고 선언한다면 Consumer와 Fixture를 함께 구현해야 한다.

필요 Fixture:

```text
Positive match
Negative match
Ambiguous match
No match
Broken index
Missing metadata
Fail-open
```

---

## 9. Execution Policy

현재 확인된 파일:

```text
instructions/execution-policy.md
```

주요 Mode:

```text
suggest-only
patch-with-approval
auto-apply
```

판정:

```text
Implemented
```

현재 방향은 Product Architecture와 정렬된다.

구분:

```text
Capability
= Runtime이 기술적으로 가능한가

Execution Policy
= 현재 작업에서 허용되는가

Entitlement
= 상품상 사용할 권한이 있는가
```

V1에서는 Execution Policy만 필요하다.

V1에 Commercial Entitlement를 추가하지 않는다.

유지해야 하는 원칙:

- Human Approval 없는 고위험 실행 금지
- Scope와 Do Not Touch 보존
- Runtime Capability와 Policy 분리
- 실행하지 않은 검증을 Pass로 표시하지 않음

---

## 10. Local Usage Log

현재 확인된 파일:

```text
scripts/harness-event.mjs
```

판정:

```text
Implemented
```

V1에서의 역할:

```text
Local Usage Evidence
```

허용 가능한 기록 후보:

```text
기능 호출
성공 / 실패
Runtime
Version
Error Category
Validation 수행 여부
```

기본 금지:

```text
Source Code
Prompt 원문
전체 Handoff
전체 Result
전체 Diff
Secret
```

현재 확인할 사항:

- Raw Context가 기록되지 않는가
- Local-only 사용이 가능한가
- Usage Log를 삭제할 수 있는가
- Cloud Telemetry와 혼동되지 않는가

---

# Part II. Partial Assets

## 11. Work-start

현재 확인된 주요 파일:

```text
scripts/work-start.sh
skills/work-start/SKILL.md
```

판정:

```text
Partial
```

현재 역할:

```text
사용자 Task 입력
→ Local Context 후보 탐색
→ Candidate Artifact 생성
```

현재 강점:

- Local-only로 동작한다.
- 검색 결과를 Truth가 아니라 Candidate로 다룬다.
- Secret·Local Profile·Generated 경로를 제외할 수 있다.
- Handoff Candidate 생성의 Seed로 활용할 수 있다.

현재 부족한 점:

- 출력 Contract가 V1 Handoff 필드로 고정되지 않았다.
- Scope와 Do Not Touch가 필수 계약으로 보장되지 않는다.
- Facts, Assumptions, Open Issues가 정형 분리되지 않을 수 있다.
- Skill Routing Source of Truth가 이원화될 가능성이 있다.
- 출력이 Runtime-neutral Handoff로 이어지는 공식 흐름이 없다.

권장 역할:

```text
Work-start
= Context / Skill / Risk Candidate 생성

Structured Handoff
= 사람이 승인한 Worker 작업 계약
```

Work-start가 Handoff 전체 의미를 소유하지 않도록 한다.

---

## 12. Handoff Prompt

현재 확인된 파일:

```text
skills/handoff-prompt/SKILL.md
```

판정:

```text
Partial
```

현재 포함하는 유효 요소:

```text
Repository State
Branch
Do Not Touch
Verification
Next Action
Human-confirmed Information
Raw Log 제외
```

현재 부족한 필수 계약:

```text
Goal
Scope
Allowed Actions
Prohibited Actions
Expected Output
Completion Criteria
Facts
Confirmed Decisions
Assumptions
Open Issues
Validation Required
Return Format
```

현재 Handoff Prompt는 세션 전환 템플릿으로는 유효하지만, 검증 가능한 Runtime-neutral Handoff Contract로는 불완전하다.

권장 처리:

```text
기존 Skill 폐기 금지
→ Structured Handoff Contract에 맞춰 Adapt
```

---

## 13. Project Context

현재 확인된 파일:

```text
skills/project-context/SKILL.md
```

판정:

```text
Partial
```

유지할 역할:

```text
Repository 또는 Project의 Human-confirmed Durable Context 관리
```

현재 `skills/project-context/SKILL.md`의 `[HANDOFF]` 모드와 붙여넣기용 Handoff 섹션은 `handoff-prompt`와 책임이 중복된다.

V1 정렬 시:

```text
handoff-prompt
= task-scoped short-lived export

project-context
= 승인된 durable context와 promotion
```

구분해야 하는 것:

```text
Project Context
= 반복 사용되는 Durable Context

Handoff
= 특정 작업 전달 Artifact

Result
= 특정 작업 결과 Candidate
```

금지:

```text
Worker Result
→ docs/context 자동 반영
```

권장 승격:

```text
Worker Result
→ Evidence Candidate
→ Human Review
→ Project Context Promotion
```

---

## 14. Public Product Documentation

현재 확인된 주요 파일:

```text
README.md
README.md
```

판정:

```text
Partial / Drift
```

현재 문제:

- 제품을 Skill / Adapter / Context Harness 중심으로 설명한다.
- 확정된 V1의 `Structured Handoff → Result Basic → Human Review` Loop가 닫혀 있지 않다.
- 일부 문서에서 `handoff-prompt`가 아직 구현되지 않은 것처럼 서술될 가능성이 있다.
- Claude와 Codex 연결이 제품 핵심처럼 보일 수 있다.

권장 제품 메시지:

```text
oh-my-ai V1
= 무료 Local Artifact Workflow
= Runtime-neutral Handoff / Result Contract
= Human-controlled Delegation and Return
```

Claude와 Codex는 대표 Adapter다.

제품 Core Identity가 아니다.

---

# Part III. Missing V1 Assets

## 15. Result Basic

현재 확인된 tracked 상태:

```text
확인된 동등 Contract 없음
```

판정:

```text
Missing
```

V1 필수 이유:

- Handoff만 있고 반환 계약이 없으면 Workflow가 닫히지 않는다.
- Worker 결과를 자동 Truth로 받아들이는 위험이 있다.
- Files Read와 Files Changed를 구분해야 한다.
- Commands Run과 Validation Results를 구분해야 한다.
- 실행하지 않은 검증을 Pass로 기록하지 못하게 해야 한다.
- Scope 이탈과 Remaining Risk를 표시해야 한다.

최소 Result Basic 필드:

```text
schema_version
source_handoff_ref
status
what_was_done
findings
evidence
files_read
files_changed
commands_run
validation_performed
validation_not_performed
validation_results
assumptions
unresolved_risks
deviations_from_scope
recommended_next_action
```

V1에서는 Managed `result_id`가 필수가 아니다.

Markdown Artifact로 충분하다.

---

## 16. Static Capability Contract

현재 확인된 상태:

```text
Runtime Instruction Adapter는 존재
정형 Capability Metadata는 없음
```

판정:

```text
Missing
```

필요한 이유:

- Runtime별 지원 가능 기능을 명시한다.
- Capability와 Execution Policy를 분리한다.
- 지원하지 않는 기능을 지원한다고 보고하는 것을 방지한다.
- V2 Local Invocation PoC 입력이 된다.

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

V1에서는 정적 선언만 필요하다.

동적 Runtime Broker는 V2다.

---

## 17. Manual Handoff Flow

현재 확인된 상태:

```text
skills/handoff-prompt/SKILL.md에 수동 Create,
Human Checklist와 Copy Export 절차가 존재
```

다만 다음은 없다.

```text
Work-start와 연결된 공식 Runtime-neutral Contract
필수 필드 Validation
정형 Artifact 생성 흐름
```

판정:

```text
Partial
```

필요 단계:

```text
Work-start Candidate
→ Handoff Candidate 생성
→ Human Review
→ Manual Copy/Paste
```

최소 Human Review Surface:

```text
Goal
Scope
Do Not Touch
Facts
Assumptions
Open Issues
Expected Output
Validation Required
```

V1에서 자동 Worker Session 생성은 하지 않는다.

---

## 18. Manual Result Return Flow

현재 확인된 상태:

```text
Create / Review / Import 공식 흐름 없음
```

판정:

```text
Missing
```

필요 단계:

```text
Worker Result
→ Result Basic Candidate
→ Human Review
```

V1에서 자동 Context Promotion을 하지 않는다.
Result Basic은 Human Review 전 canonical Truth, 완료 증명, Repository Apply 허가, Context Promotion 허가가 아니다.

---

## 19. Fixtures와 Regression

현재 확인된 상태:

```text
Packet / Handoff / Result 전체 Loop Fixture 없음
```

판정:

```text
Missing
```

최소 Fixture:

```text
Work-start input / output
Skill Routing positive
Skill Routing negative
Prompt Hook match
Prompt Hook no-match
Broken-index fail-open
Handoff required-field preservation
Do Not Touch preservation
Runtime projection semantic preservation
Result Validation Performed / Not Performed
Scope deviation
Missing result
Manual E2E
```

Fixture가 없으면 Handoff와 Result는 다시 Prompt Template 수준으로 퇴행할 수 있다.

---

# Part IV. Boundary Decisions

## 20. V1 Public Local Core

V1에 남긴다.

```text
Local Installation
Instruction Cascade
Skill Registry
Basic Skill Routing
Prompt Routing Hook
Work-start
Structured Handoff
Result Basic
Runtime Instruction Adapter
Static Capability Metadata
Local Context
Execution Policy
Minimal Fixtures
Local Usage Log
Human Review
```

---

## 21. V2로 이관

```text
Automatic Session Discovery
Automatic Prompt Delivery
Automatic Result Collection
Task ID Managed Lifecycle
SessionBinding
ExecutionRun Entity
ExecutionWorkspace Entity
ResultArtifact ID
Cloud Sync
Auth
Entitlement
Billing
Approval Queue
Task Graph
Managed Memory
Runtime Broker
Learning Loop
SkillOpt
Sidecar
Organization Governance
```

V2 상세 설계는 V1 구현을 차단하지 않는 병행 트랙이다.

---

## 22. Adopt / Adapt / Move / Remove

## 22.1 Adopt as-is

```text
Execution Policy
Instruction Cascade
Generated File Drift Check
Non-destructive Installation
Profile / Local Separation
External Hook / Source Policy
Local Usage Log 기본 구조
```

## 22.2 Adapt

```text
work-start
handoff-prompt
project-context
prompt-routing-hook
skill routing evidence
Runtime Adapter Instruction
```

## 22.3 Move to V2

```text
conversation-capture implementation
automatic session capture
automatic task linking
automatic result collection
managed memory
hosted registry
entitlement
SkillOpt
Cloud Control Plane
```

## 22.4 Keep as Optional Extension

```text
Domain / Framework Skills
local-search / Jikji
release-note
daily-report
worklog-note
```

## 22.5 Deprecate Candidate

다음 UX 또는 표현은 제품 Core에서 후순위로 둔다.

```text
Claude ↔ Codex 연결 자체를 제품 핵심으로 표현
특정 Runtime 조합을 V1 필수 데모로 표현
```

Runtime 조합은 Adapter 사용 예다.

V1 대표 가치는 Runtime-neutral Contract다.

---

# Part V. V1 Readiness

## 23. V1 사용자 흐름 기준 판정

목표 흐름:

```text
1. 사용자가 작업을 입력
2. Work-start가 Context와 Skill 후보 생성
3. Structured Handoff Candidate 생성
4. 사용자가 Scope와 Do Not Touch 검수
5. 사용자가 Runtime 세션을 직접 시작
6. Handoff를 수동 전달
7. Worker가 Result Basic 작성
8. 사용자가 Files / Commands / Validation / Risk 검수
9. 사용자가 Result Basic을 Human Review
```

현재 판정:

| 단계 | 상태 |
|---|---:|
| Task 입력 | Partial |
| Context 후보 생성 | Implemented / Partial |
| Skill 후보 생성 | Implemented |
| Structured Handoff Candidate | Partial |
| Handoff Human Review | Missing as formal flow |
| Runtime 직접 시작 | Manual / Available |
| Manual Copy/Paste | Missing as formal flow |
| Result Basic | Missing |
| Result Human Review | Missing |
| E2E Fixture | Missing |

---

## 24. V1 진척률

계획 추정:

```text
45~50%
```

이 수치는 구현량이나 코드 라인 기반 측정치가 아니다.

V1 사용자 흐름, Release-blocking Contract, Human Review와 Fixture Gate를 가중 평가한 계획용 범위다.

근거:

완료 또는 기반 존재:

```text
Instruction Cascade
Runtime Adapter Instruction
Skill Registry
Basic Routing
Work-start Seed
Handoff Seed
Project Context
Execution Policy
Local Usage Log
```

미완료:

```text
Structured Handoff Contract
Result Basic
Manual Review / Export / Import Flow
Capability Contract
Fixtures
Public Product Message
Release Gate
```

진척률은 Snapshot 기준이며 이후 구현 변경 시 재산정한다.

---

## 25. V1 Completion Gap

### P0 — Release Blocking

```text
Product terminology / Public Docs alignment
Structured Handoff Contract
Result Basic Contract
Static Capability Contract
Routing Metadata / Consumer Contract 정렬
Project Context / Handoff 책임 정렬
Minimum Per-feature Fixtures
Manual End-to-End Flow
Doctor
최소 설치·실행 경로
```

### P1 — Release Quality

```text
Runtime Projection Fixture
Handoff Validator
Result Validator
Generic Markdown Export 고도화
CLI Product Shell 고도화
Runtime별 정적 사용 안내 고도화
Generated Output Drift Verification
Context Drift Warning
Review Surface 정리
Local Usage Log Privacy Verification
Good / Bad Artifact Examples
Migration 안내 조건
```

### P2 — Post-release

```text
Gemini Projection
TUI Review
Local Artifact History
Optional Search Backend
Additional Domain Skills
```

---

# Part VI. Implementation Sequence

## 26. PR 1 — Product Terminology and Boundary

목적:

```text
현재 Repository 설명을 확정된 V1/V2 경계와 정렬
```

수정 후보:

```text
README.md
README.md
instructions/harness.md
```

포함:

- V1 Local Artifact Workflow
- Main / Worker는 oh-my-ai Role Contract
- V2 Managed Workflow 분리
- Claude / Codex 중심 표현 완화
- Single-runtime V1 가능 명시

제외:

- Handoff CLI 구현
- Result 구현
- Cloud 상세 설계

검증:

```text
make instructions
git diff --check
generated file drift 없음
```

---

## 27. PR 2 — Handoff and Result Contracts

목적:

```text
V1 Transfer Artifact의 최소 Contract 확정
```

산출물 후보:

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
examples/handoff/*
examples/result/*
```

포함:

- Handoff 필수 필드
- Result 필수 필드
- Truthfulness Vocabulary
- Contract Validation 또는 Lint
- Good / Bad Example
- Negative Contract Fixture
- Validation Not Performed 표현

제외:

- Managed Task ID
- Automatic Session Capture
- Cloud Sync

---

## 28. PR 3 — Work-start and Handoff Flow

목적:

```text
기존 Work-start와 handoff-prompt를 공식 Handoff Candidate 흐름으로 정렬
```

수정 후보:

```text
skills/work-start/SKILL.md
skills/handoff-prompt/SKILL.md
skills/project-context/SKILL.md
scripts/work-start.sh
scripts/work-start-skill-match.mjs
```

포함:

- Routing Metadata와 Consumer Contract 정렬
- Handoff Candidate 생성
- Human Review Checklist
- Generic Markdown Export
- Project Context와 task-scoped Handoff 책임 분리
- Routing / Handoff 최소 Fixture

제외:

- Worker 자동 실행
- Runtime 자동 선택
- Task Database

---

## 29. PR 4 — V1 Alpha Runtime Guidance and Validator Quality

목적:

```text
V1 P0 수동 Artifact 흐름 위에 품질 기능을 추가
```

수정 후보:

```text
instructions/adapters/*
runtime capability metadata
validator / guidance verification scripts
```

포함:

- Static Capability
- Runtime별 정적 사용 안내 고도화
- Handoff Validator
- Result Validator
- Unsupported Capability 표시
- Capability / Validator Fixture
- Semantic Preservation Fixture

제외:

- Dynamic Runtime Broker
- Managed Runtime Recommendation
- Runtime Invocation

---

## 30. PR 5 — Result Return Flow

목적:

```text
Result Basic Candidate를 생성·검수·반영하는 수동 Loop 완성
```

산출물 후보:

```text
skills/result-basic/SKILL.md
scripts/result-create.*
scripts/result-review.*
```

포함:

- Files Read / Changed 분리
- Commands / Validation 분리
- Scope Deviation
- Remaining Risk
- Human Review
- Validation Not Performed를 Pass로 표시하지 않는 최소 Fixture
- Result / Truthfulness 최소 Fixture

제외:

- Automatic Truth Promotion
- Automatic Context Update
- Cloud Result Collection
- Managed Result Return
- Result 자동 저장·감지·연결

---

## 31. PR 6 — Fixtures and Smoke Tests

목적:

```text
PR 2~5에 각각 포함된 Contract·Routing·Projection·Result Fixture를
하나의 Manual E2E와 Regression Gate로 연결
```

PR 6 이전의 기능 PR도 자기 변경을 보호하는 최소 Fixture를 포함해야 한다.

PR 6에서 통합할 Fixture:

```text
Routing
Hook
Handoff
Projection
Result
Truthfulness
Manual E2E
Broken-index Fail-open
```

필수 검증:

```text
make instructions
git diff --check
schema / contract verification
negative fixture
broken-index fail-open
unrun validation cannot pass
```

---

## 32. PR 7 — V1 Documentation and Release Cut

목적:

```text
V1을 무료 Local Artifact Workflow로 공식 종료
```

포함:

- README
- V1 Quick Start
- Single-runtime Demo
- V1 Non-goals
- Release Note
- 설치 경로나 설정 변경이 있는 경우 Migration 안내
- Completion Checklist

제외:

- V2 Cloud 구현
- Auth / Billing
- Sidecar
- Managed Memory

---

# Part VII. Risk Register

## 33. Handoff가 Prompt Template에 머무를 위험

원인:

```text
Schema / Contract Validation 부재
```

대응:

```text
Required Field
Good / Bad Example
Negative Fixture
Semantic Projection Test
```

---

## 34. Main / Worker 용어 충돌

위험:

Runtime의 Native Agent / Subagent와 혼동될 수 있다.

원칙:

```text
Main / Worker
= oh-my-ai Role Contract

Native Agent / Subagent
= Provider Runtime Feature
```

---

## 35. Manual Review 피로

위험:

모든 로그를 검수하게 하면 V1 사용성이 저하된다.

Review Surface:

```text
Scope
Do Not Touch
Context
Changed Files
Commands
Validation
Risk
```

전체 Raw Log를 기본 노출하지 않는다.

---

## 36. Runtime 종속

위험:

Claude Hook이 풍부하다는 이유로 Claude 중심 제품이 될 수 있다.

대응:

```text
Generic Contract First
Runtime Projection Second
Provider Metadata Optional
```

---

## 37. Source of Truth 중복

원칙:

```text
Repository Document / ADR / Approved Context
= Durable Source of Truth

Handoff / Result
= Transfer Artifact

Worker Result
= Evidence Candidate
```

Packet 또는 Result Import가 Durable Context를 자동 수정하지 않는다.

---

## 38. Context Drift

Handoff 생성 시점과 Result 반영 시점의 Repository 상태가 다를 수 있다.

필요 Metadata:

```text
repository logical reference
branch
commit
created_at
```

Import 시 Drift Warning이 필요하다.

V1에서는 Warning만 제공할 수 있다.

Managed Conflict Resolution은 V2다.

---

## 39. Cloud 기능의 Public CLI 침투

Public CLI에 넣지 말아야 할 Private Intelligence 후보:

```text
Session Linking Algorithm
Context Ranking Algorithm
Result Acceptability Scoring
Failure Mining
Skill Promotion Criteria
Runtime Quality / Cost Recommendation
```

Public CLI에는 Contract와 Client 경계만 둔다.

---

## 40. Privacy

기본값:

```text
Local-only
```

V2 이후:

```text
Metadata-only
Reviewed Handoff
Full Context Explicit Opt-in
```

Source Code, Prompt 원문, 전체 Diff, Secret을 기본 Telemetry로 전송하지 않는다.

---

# Part VIII. Decisions and Open Issues

## 41. 확정된 판단

1. V1은 무료 Local Artifact Workflow다.
2. V1은 단일 Runtime으로도 완결 가능해야 한다.
3. Runtime Adapter는 제품 의미를 소유하지 않는다.
4. Handoff와 Result는 Transfer Artifact다.
5. Worker Result는 Human Review 전까지 Evidence Candidate다.
6. V1에 Managed Task / Run / Result Entity를 추가하지 않는다.
7. V1에 Auth, Billing, Entitlement를 추가하지 않는다.
8. Work-start는 Context Candidate 생성 책임을 가진다.
9. Structured Handoff는 Worker 작업 계약을 가진다.
10. Result Basic은 Worker 반환 계약을 가진다.
11. Project Context는 Durable Context 후보를 관리한다.
12. Skill Routing은 어떤 Playbook을 참고했는지에 대한 Evidence다.
13. Sidecar와 Automatic Session Capture는 V1 비범위다.
14. Public Product Message를 현재 목표와 정렬해야 한다.

---

## 42. 미결정 사항

1. Handoff와 Result의 정확한 파일 경로
2. Markdown과 JSON Schema의 병행 여부
3. V1 Local 참조값을 `local_artifact_ref`, `handoff_ref`, `source_handoff_ref` 중 어떤 이름으로 둘지 여부
4. CLI 명령 이름
5. Review UX가 CLI, TUI, Markdown 중 무엇인지
6. Context Drift Warning의 정확한 기준
7. Runtime Capability Metadata 형식
8. Gemini Projection의 V1 포함 여부
9. Local Artifact History의 V1 포함 여부
10. V1 Release Version
11. 기존 `handoff-prompt` 이름 유지 여부
12. `docs/context` Promotion Workflow의 정확한 형식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 43. 다음 문서에 제공하는 입력

### `v1-completion-criteria.md`

필수 입력:

```text
P0 Gap
V1 User Flow
Exit Criteria
Fixture List
Release Gate
```

### `work-start-contract.md`

필수 입력:

```text
Context Candidate
Skill Candidate
Risk Candidate
Source of Truth
Output Contract
```

### `handoff-basic-contract.md`

필수 입력:

```text
Goal
Scope
Do Not Touch
Facts
Assumptions
Open Issues
Allowed / Prohibited Actions
Expected Output
Validation Required
```

### `result-basic-contract.md`

필수 입력:

```text
What Was Done
Findings
Evidence
Files Read
Files Changed
Commands Run
Validation
Risks
Deviations
Next Action
```

### `runtime-capability-contract.md`

필수 입력:

```text
Static Capability
Unsupported Capability
Projection
Policy Separation
```

### `v1-fixture-plan.md`

필수 입력:

```text
Routing
Hook
Handoff
Projection
Result
Truthfulness
E2E
```

---

## 44. 불변조건

1. 현재 Repository 상태와 목표 아키텍처를 구분한다.
2. 미구현 V2 기능을 현재 V1 결함으로 판정하지 않는다.
3. V1은 Cloud 없이 완결된다.
4. V1은 Human Review를 유지한다.
5. Handoff와 Result는 관리형 Entity가 아니라 Artifact다.
6. Worker Result는 자동 Truth가 아니다.
7. 실행하지 않은 검증을 Pass로 기록하지 않는다.
8. Runtime-specific Adapter가 Generic Product Meaning을 소유하지 않는다.
9. Routing Metadata의 Source of Truth를 단일화한다.
10. Result Basic 없이 V1 완료로 판정하지 않는다.
11. Fixture 없이 Contract 완료로 판정하지 않는다.
12. Public Documentation Drift를 Release 전에 해소한다.
13. Claude와 Codex의 조합은 Adapter 예시이며 제품 Core가 아니다.
14. V2 설계는 V1 구현을 차단하지 않는 병행 트랙이다.

---

## 45. 관련 문서

```text
docs/master/product-architecture-master.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/roadmap/product-roadmap.md
docs/product/v1-completion-criteria.md
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
docs/decisions/decision-log.md
```

---

## 46. 검수 관점

### 하네스 메인 브랜치

- Snapshot의 실제 파일·상태 판정이 맞는가
- Implemented / Partial / Missing 분류가 정확한가
- V1에 필요한 Gap이 누락되지 않았는가
- V2 기능이 V1 P0로 잘못 들어가지 않았는가
- PR 순서가 실제 Repository 의존성과 맞는가

### 제품 아키텍처

- Current State와 Target State가 혼동되지 않는가
- V1/V2/V3 경계가 Master와 Roadmap에 일치하는가
- Public / Private 책임이 Local·Cloud 경계와 일치하는가
- Shared Core를 Development 내부 모델로 오해하지 않는가

### 구현 인계

- 다음 구현자가 파일 후보와 완료 조건을 이해할 수 있는가
- 각 PR의 제외 범위가 충분히 명확한가
- Fixture가 Contract 의미를 실제로 보호하는가
