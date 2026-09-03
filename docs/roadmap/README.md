---
title: Roadmap Index
status: draft
implementation_status: not_verifiable
owner: product
last_reviewed: 2026-09-03
supersedes: []
superseded_by: []
source_inputs:
  - docs/roadmap/product-roadmap.md
  - docs/product/README.md
  - docs/product/v1-completion-criteria.md
  - docs/architecture/README.md
  - docs/contracts/README.md
  - docs/testing/README.md
  - docs/poc/README.md
  - docs/decisions/decision-log.md
---

# Roadmap

## 1. 문서 목적

이 디렉터리는 `oh-my-ai`의 버전별 Product 방향, 우선순위와 승격 조건을 관리한다.

현재 canonical 문서:

```text
docs/roadmap/
├── README.md
└── product-roadmap.md
```

Roadmap 문서는 다음을 정의한다.

```text
V1·V2·V3 Product Boundary
우선순위
Dependency
Entry Criteria
Exit Criteria
Deferred Scope
Experiment 연결
Product Decision 필요 시점
```

Roadmap 문서는 다음을 직접 정의하지 않는다.

```text
Contract Field Schema
Architecture Component 구조
Fixture Assertion
Runtime 지원 사실
POC 실행 결과
Release 통과 여부
현재 Repository 구현 상태
```

---

# Part I. Canonical Roadmap Document

## 2. Product Roadmap

### 2.1 Shared AI current projection

Shared AI의 현재 구현·제품 연동 상태는
[`product-roadmap.md` §3.1](./product-roadmap.md#31-shared-ai-capability-track--user-facing-projection)에서
제품 관점으로 투영하고, mutable implementation/status evidence의 원문은
[Shared AI source-of-truth map §2.1](https://github.com/ranikun-labs/shared-ai-architecture/blob/0882173ccb1f91ce085f6828e00bfc67090351ba/docs/source-of-truth-map.md#21-current-implementation-projection)가
소유한다. 이 Index는 전체 PR/SHA/gate/smoke package를 복제하지 않는다.

| Classification | Foundation projection |
| --- | --- |
| `CANONICAL` | Ownership·placement·provider-neutral boundary는 accepted ADR가 소유한다. |
| `DOCUMENTED_DRAFT` | Shared AI user-facing scope와 adoption boundary는 Product Roadmap의 제안이다. |
| `IMPLEMENTED` | RPL-107 synchronous OpenAI Slice A의 bounded implementation evidence가 있다. |
| `DEFERRED` | Streaming, broader provider/runtime capability와 trigger-gated alternatives다. |
| `MISSING` | Product consumer integration, end-user UX, production support/deployment/release evidence다. |
| `OUT_OF_SCOPE_OTHER_PRODUCT` | Product Prompt, Domain Policy, workflow/tool meaning, validation과 business effect다. |

**Path**

```text
docs/roadmap/product-roadmap.md
```

**책임**

```text
V1·V2·V3 Product 방향
각 단계의 핵심 사용자 가치
Scope In / Scope Out
Version 간 Dependency
승격 조건
Deferred Item
Product Risk
```

**소유하지 않는 책임**

```text
Contract Schema
Runtime Adapter 구현
Fixture Result
POC Outcome
현재 출시 상태
현재 구현 완료율
```

**핵심 원칙**

```text
Roadmap
= Product 순서와 경계

Decision Log
= 채택·연기·실험·거절 상태

Completion Criteria
= V1 Release Requirement

POC
= 미채택 가설 검증
```

---

# Part II. Version Model

## 3. V1 — Free Local Manual Artifact Workflow

V1의 핵심 목적:

```text
사용자가 AI 작업을
더 안전하고 반복 가능하게 시작·전달·검수하도록 한다.
```

V1 핵심 흐름:

```text
User Task
→ Skill Routing
→ Work-start Candidate
→ Project Context 참조
→ Structured Handoff Candidate
→ Human Review
→ Worker Session에 수동 Copy/Paste
→ Worker가 Result Basic 수동 형식으로 반환
→ Human Result Review
```

V1은 Runtime Invocation, Result 자동 감지, Review Queue, Context Import, Worktree 자동화를 제공하지 않는다.

Action Approval은 `approval_required` 행동이 있을 때만 요구되며,
Handoff Scope를 확장할 수 없다.

V1 핵심 가치:

```text
Work-start Basic
Structured Handoff
Result Basic
Runtime-neutral Contract
Human-controlled Workflow
Local Artifact
Truthful Runtime Support
```

---

## 4. V1 Scope Out

```text
Cloud Login
Billing
Entitlement
Managed Task / Run / Result
Remote Execution
Runtime Broker
Automatic Runtime Selection
Automatic Prompt Delivery
Automatic Result Collection
Automatic Repository Apply
Automatic Project Context Promotion
Workspace
Organization Policy
RBAC
SSO
```

V1 Scope Out 항목을 구현 Convenience만으로 V1에 다시 넣지 않는다.

---

## 5. V1 Exit Criteria

V1 Release Requirement의 canonical owner:

```text
docs/product/v1-completion-criteria.md
```

V1 Exit에는 최소 다음이 필요하다.

```text
Work-start P0
Structured Handoff P0
Result Basic P0
Runtime Capability P0
Execution Policy P0
Positive·Negative Fixture
Minimum Single-runtime Manual E2E
Advertised Runtime Gate
Fresh Install
Documentation Truthfulness
Secret Exclusion
```

Roadmap은 Exit Criteria를 요약할 수 있으나 완화하거나 재정의하지 않는다.

---

# Part III. V2 Model

## 6. V2 — Personal Pro Control Plane Candidate

V2의 방향:

```text
개인 사용자의 반복 작업을
더 적은 수동 단계로 연결하는 Pro Control Plane
```

V2가 유지해야 하는 V1 불변조건:

```text
Human-controlled Scope
Handoff Contract
Capability·Policy 분리
Action Approval
Result Review
Repository Apply 분리
Local·Cloud Boundary
Truthfulness
```

V2가 V1을 자동 대체하지 않는다.

---

## 7. V2 Local Invocation

현재 상태:

```text
experiment
```

Canonical POC:

```text
docs/poc/v2-local-invocation-poc.md
```

검증 대상:

```text
Local Runtime Invocation
Local Output Capture
Result Normalization
Process Supervision
Adapter Boundary
Product Value
Maintenance Cost
```

다음은 아직 Product Scope가 아니다.

```text
Local Invocation
Local Result Collection
Runtime 비교·추천
Managed SessionBinding
Runtime Broker
Remote Execution
```

POC Outcome이 `validated`여도 별도 Product Decision이 필요하다.

---

## 8. V2 Entry Criteria

V2 Product 구현을 시작하려면 최소 다음이 필요하다.

```text
V1 Contract 안정화
V1 Manual Workflow 완결
V1 P0 Fixture 통과
Minimum Runtime Manual E2E
V1 Public Documentation 정합성
대상 V2 기능의 Product Decision
대상 V2 Product Item에 POC가 필요한 경우:

```text
POC Lifecycle completed
POC Outcome 기록
Threshold·Safety Evidence 확인
별도 Product Decision 완료
```
Local·Cloud·Human Boundary 검토
```

단:

```text
V1 Release
≠ V2 Local Invocation POC 성공 필요
```

V2 POC가 `rejected` 또는 `inconclusive`여도 V1 Release 판단에는 영향을 주지 않는다.

---

## 9. V2 Exit Criteria

V2의 구체적 Exit Criteria는 아직 Open Decision이다.

향후 최소 검토 대상:

```text
Product Value
Manual Step Reduction
Safety Invariant 유지
Adapter Maintenance Budget
Runtime Support Truthfulness
Data Boundary
Failure Recovery
Migration from V1
Pricing·Entitlement 경계
```

Roadmap은 Open Decision을 확정된 Release Promise로 표현하지 않는다.

---

# Part IV. V3 Model

## 10. V3 — Team and Workspace Product Candidate

V3 후보:

```text
Workspace
Project
Organization Policy
RBAC
SSO
Remote Approval
Team Audit
Managed Evidence
Remote Execution
```

V3가 요구하는 선행 조건:

```text
V1 Local Contract 안정화
대상 V3 기능이 실제로 의존하는
관련 V2 Product Boundary와 Human-control Model의 검증
Human Authority Model 유지
Cloud Data Classification
Organization Policy Boundary
Entitlement Model
Audit·Retention·Deletion
```

---

## 11. V3 비선행 원칙

다음은 금지한다.

```text
V3 Workspace를 V1 Release 선행 조건으로 사용
V3 RBAC를 V2 Local Invocation 선행 조건으로 사용
Organization 기능을 Shared Core의 현재 필수 책임으로 승격
Remote Execution을 Local Invocation POC에 포함
```

---

# Part V. Roadmap Status Model

## 12. Roadmap Item 상태

허용 상태:

```text
proposed
planned
in_progress
blocked
completed
deferred
cancelled
superseded
```

Roadmap 상태는 Decision 상태와 다르다.

`blocked`는 Item의 기존 활성 상태를 삭제하지 않는다.

Blocked Item은 최소 다음을 기록한다.

```text
blocked_from: planned | in_progress
blocker
blocked_at
unblock_condition
```

차단 해제 후에는 `blocked_from`과 재개 조건을 검토해 상태를 복귀시킨다.

예:

```text
Decision status = accepted
Roadmap item status = planned
```

은 유효하다.

```text
Decision status = experiment
Roadmap item status = in_progress
```

도 유효하다.

---

## 13. Decision 상태와의 관계

Decision Log 상태:

```text
accepted
accepted_with_constraints
experiment
deferred
rejected
superseded
open
```

Roadmap 규칙:

```text
accepted
→ planned / in_progress / blocked / completed 가능

accepted_with_constraints
→ 제약을 유지한 채
  planned / in_progress / blocked / completed 가능

experiment
→ POC·Validation Item에 한해
  proposed / planned / in_progress / blocked / completed 가능

deferred
→ deferred만 가능
→ 현재 Active Scope 포함 금지

rejected
→ cancelled 또는 superseded만 가능

open
→ proposed Discovery Item만 가능
→ Product Commitment로 표현 금지

superseded
→ superseded 상태와 Replacement Reference 필수
```

---

## 14. Completion 상태

Roadmap Item의 `completed`는 다음을 의미하지 않는다.

```text
Product Release 완료
Contract Validation 통과
Fixture 통과
Public Support 가능
```

`completed`는 해당 Item의 정의된 Completion Condition이 충족됐다는 의미다.

Release 판단은 Completion Criteria와 Fixture Evidence가 소유한다.

---

# Part VI. Priority Model

## 15. Priority

허용 우선순위:

```text
P0
P1
P2
P3
```

| 우선순위 | 의미 |
|---|---|
| P0 | 현재 Version Release Blocking |
| P1 | Release 직후 핵심 개선 |
| P2 | 후속 확장 |
| P3 | 탐색 또는 장기 후보 |

P0 변경은 Product Decision과 Completion Criteria 영향 검토가 필요하다.

---

## 16. Priority와 Status 분리

```text
priority
≠ status
```

예:

```text
priority: P0
status: blocked
```

은 Release Risk다.

```text
priority: P2
status: completed
```

는 현재 Version Release를 의미하지 않는다.

---

## 17. Safety Priority

다음은 Convenience보다 우선한다.

```text
Secret Safety
Human Approval
Scope Boundary
Result Truthfulness
Repository Safety
Cloud Data Boundary
Process Cleanup
```

Safety P0를 UX P1로 강등하지 않는다.

---

# Part VII. Dependency Rules

## 18. 허용 Dependency

```text
V1 Contract
→ V1 Fixture
→ V1 Manual E2E
→ V1 Release

V1 Stable Boundary
→ V2 Product Candidate

POC
→ Product Decision Candidate

Product Decision
→ Roadmap Commitment

V2 Personal Boundary
→ V3 Team Boundary
```

---

## 19. 금지 Dependency

```text
V2 POC 성공
→ V1 Release 선행 조건

V3 Workspace
→ V2 Local Invocation 선행 조건

Development V2 완료
→ Finance Contract 작업 선행 조건

Finance Product
→ Development Runtime Model 상속

POC Outcome
→ Product Scope 자동 승격

Roadmap Item 완료
→ Public Support 자동 선언
```

---

## 20. Cross-extension Dependency

Development와 Finance는 Sibling Extension이다.

```text
Development Roadmap
≠ Finance Roadmap의 전체 선행 조건

Finance Roadmap
≠ Development Runtime Roadmap의 하위 항목
```

다음과 같은 공통 경계 변경은 양쪽 Roadmap에 영향을 줄 수 있다.

```text
Shared Core
Local·Cloud·Human Boundary
공통 Human Authority
공통 Contract Boundary
Cross-extension Safety Invariant
```

그 경우에도:

```text
Decision Review
Architecture 영향 검토
Contract 영향 검토
Migration 검토
```

가 필요하다.

---

# Part VIII. Roadmap Item Contract

## 21. 필수 필드

각 Roadmap Item은 최소 다음을 가진다.

```text
roadmap_item_id
title
version_target
status
priority
owner
user_value
scope
non_goals
dependencies
entry_criteria
completion_condition
evidence_required
decision_refs
affected_docs
reviewed_at
```

필수 필드는 생략하지 않는다.

아직 확정되지 않은 경우에는 다음과 같이 명시한다.

```text
version_target: unassigned
dependencies: []
decision_refs: []
decision_requirement: pending | not_required
entry_criteria: pending
```

Open Discovery Item의 미확정 값을
V1·V2·V3 Commitment로 추정하지 않는다.

`roadmap_item_id`는 Index 내에서 유일해야 한다.

기존 ID의 의미를 변경하거나
삭제된 Item의 ID를 다른 Item에 재사용하지 않는다.

대체 시 `supersedes` / `superseded_by`를 사용한다.

선택 필드:

```text
risk
blocker
supersedes
superseded_by
revisit_condition
known_limitation
```

---

## 22. Completion Condition

좋은 Completion Condition:

```text
관찰 가능
검증 가능
Evidence와 연결
Scope가 명확
Owner가 명확
```

나쁜 Completion Condition:

```text
적절히 지원
대부분 완료
필요하면 개선
충분히 안정화
사용 가능하게 함
```

---

## 23. Evidence Required

Roadmap Item별 Evidence 예:

```text
Accepted Contract
Fixture Result
Manual E2E Record
POC Report
Decision Record
Migration Evidence
Documentation Review
User Validation
```

Evidence가 없으면 `completed`로 전환하지 않는다.

---

# Part IX. Promotion Rules

## 24. Proposed → Planned

필수 조건:

```text
User Value 명확
Version Target 명확
Scope / Non-goal 명확
Owner 지정
Dependency 확인
Decision 필요 여부 확인
```

Product Commitment가 필요한 Item:

```text
accepted 또는 accepted_with_constraints Decision 필수
```

POC·Validation Item:

```text
experiment Decision 필수
```

Decision이 필요하지 않은 Item:

```text
decision_not_required 근거 기록
```

---

## 25. Planned → In Progress

필수 조건:

```text
Entry Criteria 충족
Blocker 확인
Decision Reference의 존재와 유효 상태 확인
필요한 Contract·Architecture 경계 확인
Evidence Plan 존재
```

Product Item:

```text
accepted 또는 accepted_with_constraints
```

POC·Validation Item:

```text
experiment
```

Decision 불필요 Item:

```text
decision_not_required 근거
```

---

## 26. In Progress → Completed

필수 조건:

```text
Completion Condition 충족
Evidence Reference 존재
모든 evidence_required Reference 유효
미해결 P0 Safety Blocker 없음
Completion Condition과 Evidence 간 불일치 없음
Known Limitation 기록
영향 문서 갱신
필요한 Human Review 완료
```

`completed`는 Release를 자동 의미하지 않는다.

---

## 27. Experiment → Product Promotion

다음 절차가 필요하다.

```text
POC completed
Outcome 기록
Threshold Snapshot 확인
Safety Result 확인
Product Value 확인
Maintenance Cost 확인
별도 Product Decision
Roadmap Item 생성 또는 갱신
Contract·Architecture·Fixture 영향 검토
```

POC 문서 자체를 Product Contract로 변경하지 않는다.

---

## 28. Deferred Item 재개

필수 조건:

```text
revisit_condition 충족
기존 Deferred Decision과 Revisit Condition 확인
Version Scope 재검토
Dependency·Risk 재검토
Human Review
```

Active Scope로 재개하려면:

```text
accepted 또는 accepted_with_constraints인
신규·대체 Decision
```

이 필요하다.

Deferred Item을 조용히 Active Scope로 되돌리지 않는다.

---

# Part X. Release Planning

## 29. V1 Release Planning

V1 Release Candidate를 만들기 전에:

```text
Applicable P0 Requirement 충족
Applicable Active P0 Fixture passed
Minimum Single-runtime Manual E2E passed
Advertised Runtime별 Evidence 존재
Fresh Install 검증
Public Documentation 검수
Known Limitation 검수
```

다음 Fixture 상태는 Release Blocking이다.

```text
failed
blocked
error
invalid_fixture
not_run
```

`not_applicable`은 Applicability Evidence가 있을 때만 제외한다.

---

## 30. Known Limitation

Roadmap에 허용 가능한 Known Limitation:

```text
비핵심 UX 부족
명시된 비핵심 Manual Step
지원 Runtime·Version 제한
지원 OS 제한
P1 Performance Gap
```

허용 불가:

```text
Approval 누락
Secret Safety 실패
Scope Escape
Result Truthfulness 실패
P0 Fixture 비통과
Repository Apply Gate 누락
False Runtime Support
Process Cleanup 실패
```

---

## 31. Release Date

Roadmap Date는 Commitment Level을 표시해야 한다.

허용 표현:

```text
target
candidate
earliest
not_before
```

Roadmap Item에 Date가 존재하면 다음을 함께 기록한다.

```text
date
commitment_level
reviewed_at
```

확정되지 않은 Date를 Public Commitment로 표현하지 않는다.

Date 변경 자체가 Scope 변경은 아니지만, Dependency·Risk·Communication 영향 검토가 필요하다.

---

# Part XI. Roadmap Change Management

## 32. Roadmap 변경

다음 변경은 Decision Review가 필요하다.

```text
Version Scope 변경
P0 추가·삭제·강등
Human Gate 추가·삭제·병합·완화
Cloud Boundary 변경
Runtime Public Support 변경
Extension Dependency 변경
Finance Safety Boundary 변경
POC를 Product Scope로 승격
```

---

## 33. 단순 Roadmap 업데이트

다음은 반드시 새 Product Decision을 요구하지 않을 수 있다.

```text
Owner 변경
Target Date 조정
Blocker 상태 갱신
Evidence Reference 추가
설명 명확화
```

단, Scope·Safety·Commitment 의미가 바뀌면 Decision Review가 필요하다.

---

## 34. Supersession

Roadmap Item이 대체되면:

```text
기존 status = superseded
superseded_by 기록
신규 Item의 supersedes 기록
관련 Decision·Document Reference 갱신
```

기존 Item을 삭제해 이력을 지우지 않는다.

---

# Part XII. Document Status

## 35. Roadmap 문서 상태표

| Document | Canonical Path | Document Status | Implementation Verification |
|---|---|---|---|
| Product Roadmap | `docs/roadmap/product-roadmap.md` | canonical candidate | Not Verifiable in this index |

이 Index는 현재 구현 진행률이나 Release 상태를 검증하지 않는다.

진행률은 실제 Evidence와 Repository 검증을 기반으로 별도 산정한다.

---

# Part XIII. Non-goals

## 36. Roadmap Index가 정의하지 않는 것

```text
Exact Release Date
Runtime Support 현재 목록
POC Outcome
Fixture Pass 결과
현재 구현 완료율
Contract Field
Architecture Component
Pricing 확정
```

---

## 37. Roadmap 계층에 넣지 않는 문서

```text
Product Report
Architecture Definition
Contract Definition
Fixture Plan
POC Plan
Decision Log
Implementation Handoff
Release Note
Current-state Report
```

각 전용 디렉터리에 둔다.

---

# Part XIV. Open Decisions

## 38. 미결정 사항

1. V1 Release Packaging 형식
2. V1 초기 Advertised Runtime 목록
3. V1 Public Launch Channel
4. V2 Product Scope
5. V2 Pricing·Entitlement
6. V2 Local Invocation 채택 여부
7. V3 Workspace 최소 기능
8. Finance Product 초기 제공 채널
9. Development·Finance의 독립 Roadmap 파일 분리 시점
10. Public Roadmap 공개 범위
11. Target Date 관리 방식
12. User Validation 기준

Open Decision을 확정된 Commitment로 표현하지 않는다.

V2 Pricing·Entitlement Open Decision은
Entitlement가 비범위인 V1 경계를 다시 열지 않는다.

---

## 39. 불변조건

1. Roadmap은 Product 순서와 경계를 정의한다.
2. Roadmap은 Contract·Fixture·POC 결과를 재정의하지 않는다.
3. V1 Release는 V2 POC 성공에 의존하지 않는다.
4. POC Outcome은 Product Commitment가 아니다.
5. Development와 Finance는 Sibling Extension이다.
6. Development V2는 Finance 작업의 전체 선행 조건이 아니다.
7. `completed`는 Release 완료를 자동 의미하지 않는다.
8. P0 변경은 Decision과 Completion Criteria 검토를 요구한다.
9. Applicable Active P0 Fixture는 `passed`여야 한다.
10. Safety 실패를 Known Limitation으로 우회하지 않는다.
11. Deferred Item을 조용히 Active Scope로 복귀시키지 않는다.
12. Open Decision을 Public Commitment로 표현하지 않는다.
13. V3 기능을 V1·V2 선행 조건으로 사용하지 않는다.
14. Roadmap Item 완료에는 Evidence가 필요하다.
15. Product Promotion에는 별도 Decision이 필요하다.
16. Policy Review·Action Approval·Projection Review를 구분한다.
17. Blocked Item은 기존 활성 상태와 복귀 조건을 보존한다.
18. Product Item의 Planned·In Progress 전환에는 유효한 Decision 상태가 필요하다.
19. Deferred Decision 상태를 유지한 채 Active Scope로 복귀시키지 않는다.
20. Open Discovery Item의 미확정 필드를 Commitment로 추정하지 않는다.

---

## 40. 관련 문서

```text
docs/roadmap/product-roadmap.md
docs/product/README.md
docs/product/v1-completion-criteria.md
docs/architecture/README.md
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
docs/decisions/decision-log.md
```

---

## 41. 검수 관점

### Version Boundary

- V1·V2·V3 Scope가 섞이지 않는가
- 후속 기능이 선행 Version을 차단하지 않는가

### Status and Promotion

- Roadmap 상태와 Decision 상태가 분리되는가
- POC에서 Product로의 승격 절차가 명확한가

### Release

- Completion과 Release가 구분되는가
- P0 비통과 상태가 Release를 차단하는가

### Cross-extension

- Development·Finance 독립성이 유지되는가
- Shared Core 변경이 과도한 Dependency를 만들지 않는가
