---
title: Decision Log
status: draft
implementation_status: partial
owner: core
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
source_inputs:
  - docs/roadmap/product-roadmap.md
  - docs/architecture/shared-core-and-extensions.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/product/v1-completion-criteria.md
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
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
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
