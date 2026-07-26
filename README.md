---
title: Harness Private Docs
status: draft
implementation_status: not_verifiable
owner: product
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
source_inputs:
  - docs/master/product-architecture-master.md
  - docs/roadmap/product-roadmap.md
  - docs/architecture/README.md
  - docs/product/README.md
  - docs/contracts/README.md
  - docs/testing/README.md
  - docs/poc/README.md
  - docs/decisions/README.md
  - docs/decisions/decision-log.md
---

# Harness Private Docs

## 1. Repository Purpose

`harness-private-docs`는 `oh-my-ai` 제품군의 Durable Product Source of Truth를 관리하는 private planning repository다.

이 Repository는 다음을 관리한다.

```text
Product Architecture
Product Roadmap
Repository·Service Boundary
Shared Core·Extension Boundary
Local·Cloud·Human Boundary
Product Reports
V1 Completion Criteria
Contract
Testing Strategy
POC
Decision Log
ADR
Session Handoff
Reviewed Source Input과 Provenance
Template
```

Source Input의 수용은
해당 내용의 Product·Architecture Decision 채택을 의미하지 않는다.

이 Repository는 다음을 관리하지 않는다.

```text
Development Harness 실제 구현 코드
Finance Harness 실제 서비스 코드
Finance Lens 원문 전체
Runtime Adapter 실제 구현
Cloud Control Plane 실제 구현
현재 배포 상태
현재 Fixture 실행 결과
현재 Product Launch 상태
```

핵심 원칙:

```text
Chat Session
= Working Context

Git Planning Repository 안의
accepted·accepted_with_constraints canonical 문서와
현재 Decision Log
= Durable Product Source of Truth

Draft·Research·Source Input·Reviewer Feedback은
Git에 저장돼 있어도 Durable Decision이 아니다.

Implementation Repository와 검증된 Runtime Evidence
= 실제 실행 동작·구현·배포 상태의 Source of Truth

Evidence
= 실제 상태를 검증하는 근거
```

---

# Part I. Product Ecosystem

## 2. Product Structure

```text
Shared Platform
├── Development Extension
└── Finance Extension
```

Development와 Finance는 Sibling Extension이다.

```text
Development
= Repository·Worktree·Diff·Runtime 중심

Finance
= Learn·Lens·Checklist·Journal·Review 중심
```

Finance는 Development V2 전체 완료에 종속되지 않는다.

Shared Platform은 현재 Logical Contract Boundary다.

```text
Shared Platform
≠ 공통 Database
≠ 공통 Domain Model
≠ 단일 Runtime 구현
≠ 즉시 분리된 Microservice
```

---

## 3. Target Repository Boundaries

이 절은 canonical Product·Architecture 문서의
Repository Responsibility Boundary를 요약한다.

새 Repository 생성·이름·배포 단위를 확정하지 않으며,
실제 현재 Repository 존재 여부나 구현 상태를 검증하지 않는다.

목표 경계:

```text
oh-my-ai
= Development Local CLI / Runtime

oh-my-ai-control-plane
= V2 Development Managed Workflow Control Plane 후보

finance-harness
= Finance Product Backend / Runtime 후보

identity-platform
= 공통 인증·인가 논리 경계 후보

finance-harness-docs
= Finance Lens / PolicyGuard / Fixture Source of Truth

harness-private-docs
= Product Planning / Architecture / Decision Source of Truth
```

Repository 이름은 변경될 수 있다.

```text
Repository 이름 변경
≠ 책임 경계 변경
```

책임 경계 변경에는 별도 Decision이 필요하다.

---

# Part II. Version Boundary

## 4. V1

```text
무료
Local Manual Artifact Workflow
Manual Human-controlled Workflow
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
→ Human Review
```

V1 비범위:

```text
Cloud Login
Billing
Entitlement
Managed Task / Run / Result
Managed Result Return
Remote Execution
Automatic Runtime Selection
Automatic Prompt Delivery
Automatic Result Collection
Result 자동 저장
Result 자동 감지
Task / Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Runtime Invocation
Automatic Repository Apply
Automatic Project Context Promotion
Worktree 자동화
복수 Worker Coordination
Merge / Apply Gate 자동화
Workspace
RBAC
SSO
```

---

## 5. V2

V2는 Personal Pro Control Plane 후보 단계다.

현재 확정된 것:

```text
V1 Contract와 Human Gate 유지
Local Invocation은 Experiment
Product 채택에는 별도 Decision 필요
```

현재 POC:

```text
docs/poc/v2-local-invocation-poc.md
```

다음은 아직 Accepted Product Scope가 아니다.

```text
Local Runtime Invocation
Local Result Capture
Runtime 비교·추천
Managed SessionBinding
Runtime Broker
Remote Execution
```

V1 Release는 V2 POC의 성공에 의존하지 않는다.

---

## 6. V3

V3는 Team·Workspace·Organization Product 후보 단계다.

후보:

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

V3 기능을 V1·V2의 선행 요구사항으로 사용하지 않는다.

---

# Part III. Start Here

## 7. Recommended Reading Order

### 제품 전체를 처음 검토할 때

```text
1. docs/master/README.md
2. docs/master/product-architecture-master.md
3. docs/roadmap/product-roadmap.md
4. docs/decisions/decision-log.md
```

### V1 Product·Release를 검토할 때

```text
1. docs/product/README.md
2. docs/product/v1-completion-criteria.md
3. docs/contracts/README.md
4. docs/testing/README.md
5. docs/testing/v1-fixture-plan.md
```

### Architecture를 검토할 때

```text
1. docs/architecture/README.md
2. docs/architecture/repository-service-boundaries.md
3. docs/architecture/shared-core-and-extensions.md
4. docs/architecture/local-cloud-human-boundary.md
```

### V2 Local Invocation을 검토할 때

```text
1. docs/poc/README.md
2. docs/poc/v2-local-invocation-poc.md
3. docs/contracts/runtime-capability-contract.md
4. docs/contracts/execution-policy-contract.md
5. docs/testing/README.md
```

### 특정 Decision을 검토할 때

```text
1. docs/decisions/README.md
2. docs/decisions/decision-log.md
3. 관련 ADR
4. affected_docs
5. evidence_refs
```

---

# Part IV. Canonical Document Map

이 지도는 canonical target path와 문서 책임을 표시한다.

지도에 포함됐다는 사실만으로
파일 존재·최신 반영·accepted 상태를 증명하지 않는다.

실제 파일과 Document Status는 Repository 검증이 필요하다.

## 8. Master

| Path | Responsibility |
|---|---|
| `docs/master/README.md` | Master 문서 계층과 읽기 순서 |
| `docs/master/product-architecture-master.md` | 제품군 전체 Product·Architecture 기준선 |

---

## 9. Roadmap

| Path | Responsibility |
|---|---|
| `docs/roadmap/README.md` | Roadmap 상태·승격·Dependency Governance |
| `docs/roadmap/product-roadmap.md` | V1·V2·V3 방향과 Scope |

---

## 10. Architecture

| Path | Responsibility |
|---|---|
| `docs/architecture/README.md` | Architecture 문서 인덱스와 경계 |
| `docs/architecture/repository-service-boundaries.md` | Repository·Service·Deployment 책임 |
| `docs/architecture/shared-core-and-extensions.md` | Shared Core·Development·Finance 경계 |
| `docs/architecture/local-cloud-human-boundary.md` | Local·Cloud·Human 데이터와 권한 경계 |
| `docs/architecture/backend-service-foundation/README.md` | Carelog·Finance Harness Backend·Shared Identity 등 MSA Backend Service의 Backend Service Foundation 색인 (`DEC-059`). 위 `shared-core-and-extensions.md`의 `oh-my-ai` Shared Platform과는 이름부터 분리된 별도 개념 |

---

## 11. Product

| Path | Responsibility |
|---|---|
| `docs/product/README.md` | Product 문서 계층과 책임 |
| `docs/product/development-harness-report.md` | Development Extension Product 방향 |
| `docs/product/finance-harness-report.md` | Finance Extension Product 방향과 Safety |
| `docs/product/v1-completion-criteria.md` | V1 Release Requirement의 canonical owner |

---

## 12. Contracts

| Path | Responsibility |
|---|---|
| `docs/contracts/README.md` | Contract 문서 계층과 공통 원칙 |
| `docs/contracts/work-start-contract.md` | Work-start Candidate 계약 |
| `docs/contracts/handoff-basic-contract.md` | Structured Handoff 계약 |
| `docs/contracts/result-basic-contract.md` | Result Basic Candidate 계약 |
| `docs/contracts/runtime-capability-contract.md` | Runtime Capability·Support Declaration |
| `docs/contracts/execution-policy-contract.md` | Action 허용·승인·금지 정책 |
| `docs/contracts/backend-service-foundation/README.md` | MSA Backend Service 간 통신 계약(Shared Identity Token, Event Envelope) 색인 |

---

## 13. Testing

| Path | Responsibility |
|---|---|
| `docs/testing/README.md` | Testing 상태·Assertion·Suite·Evidence와 Product Release Requirement 검증 규칙 |
| `docs/testing/v1-fixture-plan.md` | V1 P0 Fixture와 Manual E2E 계획 |

---

Release Requirement와 Release Blocking 기준은
`docs/product/v1-completion-criteria.md`가 소유한다.

## 14. POC

| Path | Responsibility |
|---|---|
| `docs/poc/README.md` | Experiment Governance와 POC 상태 |
| `docs/poc/v2-local-invocation-poc.md` | V2 Local Invocation 가설·Scenario·Threshold |

---

## 15. Decisions and ADR

| Path | Responsibility |
|---|---|
| `docs/decisions/README.md` | Decision 상태·Supersession·Conflict Governance |
| `docs/decisions/decision-log.md` | 현재 Decision 상태의 canonical source |
| `docs/adr/README.md` | ADR 작성·식별·연결 규칙의 canonical target path |

`docs/adr/README.md`의 실제 파일 존재와 accepted 상태는
Repository 검증 전까지 `Not Verifiable`이다.

ADR은 특정 Architecture 선택의 상세 근거다.

```text
ADR
≠ Product Scope 자동 채택
```

---

## 16. Handoffs, Research and Source Inputs

| Path | Responsibility |
|---|---|
| `docs/handoffs/README.md` | 세션 간 작업 전달과 Canonical Handoff 관리 |
| `docs/research/README.md` | 미채택 Research와 Analysis 관리 |
| `source-inputs/README.md` | 외부·세션 Source Input의 Provenance 관리 |

Research와 Source Input은 Accepted Decision이 아니다.

---

## 17. Templates

| Path | Responsibility |
|---|---|
| `templates/adr-template.md` | ADR 작성 형식 |
| `templates/decision-template.md` | Decision Record 작성 형식 |
| `templates/session-handoff-template.md` | 세션 Handoff 작성 형식 |

Template은 canonical Contract·Decision 규칙을 따라야 한다.

Template이 Source of Truth를 재정의하지 않는다.

---

# Part V. Source of Truth and Precedence

## 18. Canonical Ownership

```text
Product Scope
→ Product 문서 + Accepted Product Decision

Architecture Boundary
→ Architecture 문서 + Accepted ADR / Architecture Decision

Contract Meaning
→ 개별 Contract + Accepted Contract Decision

Release Requirement
→ V1 Completion Criteria

Fixture·Evidence
→ Testing 문서와 실제 Evidence

POC Lifecycle·Outcome
→ POC 문서

Current Decision Status
→ Decision Log
```

---

## 19. Conflict Resolution

충돌 시 다음을 확인한다.

```text
1. Hard Safety Invariant
2. 해당 Scope의 Canonical Owner
3. 명시적 Supersession
4. 현재 유효한 accepted 또는 accepted_with_constraints Decision
5. 더 구체적인 Scope
6. Decision·Contract를 뒷받침하는 Evidence
7. 필요한 Human Review
```

Evidence나 Human Review만으로
Canonical Owner·Decision·Contract를 조용히 대체하지 않는다.

ADR의 우선순위는 Architecture Scope 안에서만 적용한다.

POC는 Accepted Product·Architecture·Contract를 자동 변경하지 않는다.

---

## 20. Truthfulness

```text
Candidate
≠ Confirmed Fact

Observed
≠ Inferred

POC Validated
≠ Product Accepted

Runtime Installed
≠ Runtime Supported

Capability Supported
≠ Policy Allowed

Process Exit 0
≠ Workflow Success

Result Accepted
≠ Repository Applied

Repository Applied
≠ Commit
≠ Push
≠ PR Create
```

---

# Part VI. Status Model

## 21. Document Status

권장 상태:

```text
draft
in_review
accepted
deprecated
superseded
archived
```

Document Status와 Implementation Status를 분리한다.

---

## 22. Implementation Verification

실제 Repository·Runtime·Fixture·Deployment 검증이 없으면:

```text
not_verifiable
```

를 사용한다.

다음으로 추정하지 않는다.

```text
implemented
missing
passed
failed
supported
unsupported
released
```

---

## 23. Decision Status

```text
accepted
accepted_with_constraints
experiment
deferred
rejected
superseded
open
```

Decision Status와 Roadmap Status, POC Lifecycle, POC Outcome을 혼합하지 않는다.

---

# Part VII. Human Authority

## 24. Independent Human Gates

```text
Candidate Review
Handoff Approval
Projection Review
Policy Review
Action Approval
Invocation Approval
Result Review
Repository Apply
Context Promotion
Cloud Opt-in
Retention·Deletion
```

`Invocation Approval`은 승인된 POC 또는 별도 Product Decision으로 Local Invocation이 활성화된 경우에만 적용한다.

어느 Gate도 다른 Gate를 자동 포함하지 않는다.

---

## 25. Human Gate Invariants

```text
Handoff Approval
≠ Action Approval

Policy Review
≠ Action Approval

Projection Review
≠ Invocation Approval

Result Review
≠ Repository Apply

Result Review
≠ Context Promotion

Cloud Opt-in
≠ Runtime Execution Approval
```

---

# Part VIII. Public and Private Boundary

## 26. Public Candidate

Public Repository 또는 Public Documentation으로 이동할 수 있는 후보:

```text
V1 기능과 비범위
Handoff / Result Contract
Capability Contract
Execution Policy
Privacy·Transfer 원칙
Compatibility·Version 정책
Extension 개발 규칙
Public CLI 사용법
```

실제 공개 전에는 별도 Review가 필요하다.

---

## 27. Private

Private Planning Repository에 유지할 항목:

```text
가격·수익화 전략
비공개 V2·V3 우선순위
상세 Billing 전략
Provider 사업 의존성
Cloud Ranking 내부 알고리즘
핵심 IP 구현 방식
내부 Risk 평가
미채택 Product Option
```

Public 여부는 Version 번호가 아니라 Contract 성격과 정보 민감도로 판단한다.

---

# Part IX. Repository Editing Rules

## 28. Canonical Path

문서 Reference는 Repository Root 기준 상대경로를 사용한다.

```text
docs/product/v1-completion-criteria.md
```

다음을 canonical Reference로 사용하지 않는다.

```text
로컬 절대경로
Temporary File Path
Chat Attachment ID
Provider Session ID
```

---

## 29. File Naming

Canonical 파일명에는 다음 suffix를 사용하지 않는다.

```text
-reviewed
-final
-latest
-v2-final
-copy
```

검수용 Sandbox 파일명에는 사용할 수 있지만 Repository 반영 시 제거한다.

---

## 30. Replacement and Supersession

같은 canonical path의 수정본은 기존 파일을 교체한다.

새 문서가 기존 의미를 대체하면:

```text
supersedes
superseded_by
```

를 기록한다.

이력을 없애기 위해 기존 Decision·ADR을 삭제하지 않는다.

---

## 31. Change Review

다음 변경은 Decision Review가 필요하다.

```text
V1·V2·V3 Scope 변경
P0 Requirement 변경
Human Gate 추가·삭제·병합·완화
Cloud Boundary 변경
Shared Core 책임 변경
Extension Dependency 변경
Contract 의미 변경
Runtime Public Support 변경
Finance Safety Boundary 변경
POC를 Product Scope로 승격
```

---

# Part X. Current Migration Notes

## 32. Canonical Filename Migration

사용자 제공 Repository Tree Snapshot 기준으로
다음 transitional filename migration candidate가 식별됐다.

실제 현재 파일 존재·내용·최신 반영 상태는
최종 Repository 통합 시 검증한다.

```text
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
docs/product/README.md
```

Canonical target:

```text
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
docs/product/README.md
```

최종 통합 시:

```text
최신 검수본 선택
중복 본문 비교
Canonical Path로 이동
Reference 갱신
구 파일 제거 또는 명시적 Migration 처리
```

를 수행한다.

---

## 33. Current-state Disclaimer

이 README는 Product·Architecture·Documentation Governance를 정의한다.

다음을 검증하지 않는다.

```text
현재 Git Branch
현재 Commit HEAD
현재 파일 내용의 최신 반영 여부
실제 Runtime 지원 상태
실제 Fixture Pass 상태
실제 Product Release 상태
```

해당 사실은 Repository·Runtime·Evidence를 직접 검증해야 한다.

---

# Part XI. Working Process

## 34. Document Production Flow

```text
Source Input
→ Draft
→ Reviewer Feedback
→ Correction
→ Canonical Candidate
→ Cross-document Consistency Review
→ Repository Integration
→ Commit
```

Reviewer Feedback 자체는 canonical document가 아니다.

수정 반영 후 최신 canonical candidate만 Repository에 적용한다.

---

## 35. Session Handoff

세션 종료 또는 분기 시:

```text
현재 Source of Truth
완료한 작업
미완료 작업
Open Decision
사용한 Source Input
생성한 Artifact
다음 작업 순서
금지 사항
```

을 전달한다.

Chat History만을 Durable Decision으로 사용하지 않는다.

---

## 36. Final Integration

최종 통합 단계에서 최소 다음을 확인한다.

```text
Canonical Filename
Dangling Reference
Duplicate Document
Superseded Document
Front Matter Consistency
Decision ID Uniqueness
ADR Reference
Roadmap Item Reference
Fixture Reference
Source Input Provenance
Public·Private Boundary
```

---

# Part XII. Non-goals

## 37. This README Does Not

```text
새 Product Feature를 채택하지 않는다.
새 Architecture를 채택하지 않는다.
Contract Field를 재정의하지 않는다.
POC Outcome을 판정하지 않는다.
Fixture 결과를 판정하지 않는다.
현재 구현 완료율을 확정하지 않는다.
Release Date를 약속하지 않는다.
```

---

## 38. Invariants

1. Git Planning Repository가 Durable Product Decision을 관리한다.
2. Chat Session은 Working Context이며 canonical source가 아니다.
3. Development와 Finance는 Sibling Extension이다.
4. Finance는 Development V2 전체 완료에 종속되지 않는다.
5. Shared Platform은 현재 Logical Contract Boundary다.
6. V1은 무료 Local-only Manual Artifact Product다.
7. V1 Release는 V2 POC 성공에 의존하지 않는다.
8. Candidate를 자동 Truth로 승격하지 않는다.
9. POC Outcome을 Product Decision으로 자동 변환하지 않는다.
10. Human Gate는 서로를 자동 포함하지 않는다.
11. Release Requirement와 Testing Evidence를 분리한다.
12. Decision Status와 POC·Roadmap 상태를 혼합하지 않는다.
13. Runtime 지원은 Decision만으로 증명되지 않는다.
14. Public·Private 경계는 Version이 아니라 Contract와 민감도로 결정한다.
15. 실제 검증이 없으면 `not_verifiable`로 기록한다.
16. Canonical Repository 파일명에는 review suffix를 사용하지 않는다.
17. 기존 Decision·ADR 이력을 조용히 삭제하지 않는다.
18. Contract·Safety·Scope 변경은 Decision Review를 거친다.
19. Git에 저장됐다는 사실만으로 문서가 Durable Decision이 되지 않는다.
20. Canonical Path와 현재 파일 존재·accepted 상태를 구분한다.
21. Result Candidate는 Contract Validation 후 Human Review로 이동한다.
