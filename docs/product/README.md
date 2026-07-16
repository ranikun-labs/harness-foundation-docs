---
title: Product Index
status: draft
implementation_status: not_verifiable
owner: product
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
source_inputs:
  - docs/product/development-harness-report.md
  - docs/product/finance-harness-report.md
  - docs/product/v1-completion-criteria.md
  - docs/roadmap/product-roadmap.md
  - docs/architecture/shared-core-and-extensions.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/contracts/README.md
  - docs/testing/README.md
  - docs/poc/README.md
  - docs/decisions/decision-log.md
---

# Product

## 1. 문서 목적

이 디렉터리는 `oh-my-ai`의 Product 정의, Extension별 제품 방향과 Release Completion Criteria를 관리한다.

현재 canonical 문서:

```text
docs/product/
├── README.md
├── development-harness-report.md
├── finance-harness-report.md
└── v1-completion-criteria.md
```

Product 문서는 다음을 정의한다.

```text
누구를 위한 제품인가
어떤 문제를 해결하는가
어떤 가치를 제공하는가
버전별 Scope는 무엇인가
Release 완료 조건은 무엇인가
```

Product 문서는 다음을 직접 정의하지 않는다.

```text
Contract Field Schema
Runtime Adapter 구현
Database Schema
Fixture Assertion 구현
POC 실행 결과
Repository 현재 구현 상태
```

---

# Part I. Canonical Product Documents

## 2. Development Harness Report

**Path**

```text
docs/product/development-harness-report.md
```

**책임**

```text
Development Harness의 사용자 문제
현재 Product Value
V1·V2·V3 방향
Local CLI와 Runtime 사용 흐름
Extension 고유 기능
현재 알려진 Gap
```

**소유하지 않는 책임**

```text
Shared Platform 전체 Architecture
Finance Extension Scope
Contract Schema
Runtime Capability 사실
Release Fixture 결과
```

**핵심 원칙**

```text
Product Positioning상 public oh-my-ai
= Development Extension의 Local CLI / Runtime Surface

≠ 전체 Shared Platform의 물리적 Owner
```

실제 현재 Repository 구현 범위는
이 Product Index에서 검증하거나 확정하지 않는다.

---

## 3. Finance Harness Report

**Path**

```text
docs/product/finance-harness-report.md
```

**책임**

```text
Finance Harness의 사용자 문제
Learn → Checklist → Journal → Review 흐름
금융 Lens·PolicyGuard·Journal·Review 가치
금융 Product Scope와 Safety Boundary
Development Extension과 독립적인 Domain 방향
```

**소유하지 않는 책임**

```text
매수·매도 추천
수익률 예측
계좌 자동 주문
Development의 Repository·Worktree·Diff 모델
Shared Core 구현 전체
```

**핵심 원칙**

```text
Finance Harness
= 금융 교육·판단 보조·투자 일지·복기 Product
≠ 투자자문·매매 추천 Product
```

---

## 4. V1 Completion Criteria

**Path**

```text
docs/product/v1-completion-criteria.md
```

**책임**

```text
V1 Release Blocking Requirement
P0·P1·P2 Priority
Minimum Single-runtime Manual E2E
Advertised Runtime Gate
Installation·Documentation·Privacy 기준
Known Limitation 허용 범위
```

**소유하지 않는 책임**

```text
Fixture 구현 방식
Contract Field 정의
Runtime별 CLI Argument
POC Go / No-go
향후 V2 Scope 확정
```

**핵심 원칙**

```text
Completion Criteria
= Release Requirement의 canonical owner

Testing
= 해당 Requirement를 검증하는 Fixture Suite와 Evidence owner
```

---

# Part II. Product Hierarchy

## 5. Product Level

이 절은 canonical Architecture 문서가 정의한
Shared Platform·Extension 경계를 Product 관점에서 요약한다.

Product Index는 Component·Data·Dependency Architecture를
새로 정의하거나 변경하지 않는다.

```text
Shared Platform Product Direction
├── Development Extension
└── Finance Extension
```

Shared Platform은 다음을 제공한다.

```text
공통 Vocabulary
공통 Contract Boundary
Human-controlled Workflow 원칙
Local·Cloud·Human Boundary
Extension 간 최소 공통 안전 규칙
```

Shared Platform은 다음을 강제하지 않는다.

```text
공통 Domain Database
공통 Repository Model
공통 Journal Model
공통 UI Flow
공통 Runtime Adapter 구현
```

---

## 6. Extension Independence

Development와 Finance는 Sibling Extension이다.

```text
Development
= Repository·Worktree·Diff·Runtime 중심

Finance
= Lens·PolicyGuard·Journal·Review 중심
```

규칙:

```text
Finance는 Development V2 전체 완료를 선결 조건으로 요구하지 않는다.
Development 구현 상태가 Finance Contract의 Truth Source가 아니다.
각 Extension은 Shared Core의 최소 Contract만 공유한다.
```

---

# Part III. Version Boundary

## 7. V1

```text
무료 Local Manual Artifact Workflow
Manual Human-controlled Workflow
Work-start Basic
Structured Handoff Candidate
Manual Copy/Paste
Result Basic 수동 형식
Human Review
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
Workspace·Organization Policy
```

---

## 8. V2

V2는 개인 Pro Control Plane 후보 단계다.

현재 확정된 것:

```text
V1 Contract와 Human Gate 유지
Local Invocation은 Experiment
Product 채택은 별도 Decision 필요
```

현재 Experiment:

```text
docs/poc/v2-local-invocation-poc.md
```

아직 Product Scope로 확정되지 않은 것:

```text
Local Runtime Invocation
Local Result Capture 자동화
Runtime 비교·추천
Managed SessionBinding
Advanced Control Plane
```

POC Outcome은 Product 채택을 자동 의미하지 않는다.

V1 Release는 V2 Local Invocation POC의
실행·성공·Go 판정에 의존하지 않는다.

POC가 rejected 또는 inconclusive여도
V1 Manual Workflow의 Release 판정에는 영향을 주지 않는다.

---

## 9. V3

V3는 Team·Workspace·Organization Product 단계다.

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
```

V1·V2 문서에서 V3 기능을 선행 구현 요구사항으로 사용하지 않는다.

---

# Part IV. Product Responsibility Boundaries

## 10. Product vs Architecture

Product가 소유:

```text
사용자
문제
가치
Scope
Priority
Release Requirement
Product Positioning
```

Architecture가 소유:

```text
Component Boundary
Data Boundary
Local·Cloud Boundary
Shared Core·Extension Boundary
Dependency Direction
```

Product Decision은 사용자 Outcome과 Scope를 위해
Architecture Constraint를 요구할 수 있다.

Component·Data·Dependency 구조의 canonical 정의는
Architecture 문서가 소유한다.

---

## 11. Product vs Contract

Product가 소유:

```text
무엇을 제공해야 하는가
어떤 사용자 Outcome이 필요한가
어떤 Release Gate가 필요한가
```

Contract가 소유:

```text
입력·출력
상태
필수 필드
Human Gate
Reference
Validation Rule
```

Product Requirement를 Contract Field로 직접 복제하지 않는다.

---

## 12. Product vs Testing

Product가 소유:

```text
P0·P1·P2
Release Blocking Requirement
Known Limitation 허용 범위
```

Testing이 소유:

```text
Fixture Definition
Assertion
Suite
Evidence
Manual E2E Record
```

Testing은 Product Release Requirement를 완화하거나 재정의하지 않는다.

---

## 13. Product vs POC

Product가 소유:

```text
현재 채택된 Scope
Product Positioning
Roadmap Priority
```

POC가 소유:

```text
가설
Scenario
Metric
Threshold
Abort Criteria
Experiment Outcome
```

POC 결과는 별도 Product Decision 없이는 Product Scope가 아니다.

---

## 14. Product vs Decision Log

Product Report는 현재 방향과 Context를 설명한다.

Decision Log는 다음을 canonical하게 기록한다.

```text
accepted
accepted_with_constraints
experiment
deferred
rejected
superseded
open
```

Product Report와 Decision Log가 충돌하면:

```text
최신 유효한 accepted 또는
accepted_with_constraints Decision 확인

accepted_with_constraints인 경우
제약과 Known Limitation도 Product 문서에 함께 반영

영향 Product 문서 갱신
충돌을 조용히 덮지 않음
```

---

# Part V. Product Invariants

## 15. V1 Human Control

다음은 독립된 Human Gate다.

```text
Candidate Review
Handoff Approval
Projection Review
Policy Review
Action Approval
Result Review
Repository Apply
Project Context Promotion
```

어느 Gate도 다른 Gate를 자동 포함하지 않는다.

```text
Projection Review
= Handoff 의미 보존과 Compatibility 결과 수용
≠ Runtime 실행 승인
≠ File Write 승인
```

---

## 16. Product Truthfulness

```text
Candidate
≠ Confirmed Fact

POC Validated
≠ Product Accepted

Runtime Installed
≠ Runtime Supported

Capability Supported
≠ Policy Allowed

Result Accepted
≠ Repository Applied

Known Limitation
≠ P0 Failure Waiver
```

---

## 17. Advertised Support

Public Documentation에서 Runtime을 지원한다고 표시하려면:

```text
Valid Capability Metadata
Current Drift Status
Projection Fixture
Manual E2E
Known Limitation
Truthful Quick Start
```

가 필요하다.

모든 Runtime을 동시에 지원할 필요는 없다.

---

## 18. Local-only Product Meaning

V1 Local-only의 의미:

```text
oh-my-ai 자체가
Raw Code
Raw Prompt
Raw Handoff
Raw Result
Secret
Credential
을 Managed Cloud Control Plane에 저장하지 않음
```

다음과 동일하지 않다.

```text
모든 Runtime Provider Network 사용 금지
사용자가 선택한 외부 LLM Provider 사용 금지
```

Provider Network 사용은 Capability·Availability·Policy 검토 대상이다.

---

## 19. Finance Safety

Finance Product는 다음을 제공할 수 있다.

```text
교육
분석 Lens
판단 전 Checklist
투자 Journal
Review
복기
```

다음을 Product Goal로 삼지 않는다.

```text
수익률 예측
매수·매도 지시
자동 주문
개별 사용자 맞춤 투자자문
```

PolicyGuard와 표현 규칙은 이 경계를 유지해야 한다.

---

# Part VI. Release Management

## 20. V1 Release Source of Truth

Release Requirement:

```text
docs/product/v1-completion-criteria.md
```

Fixture와 Evidence:

```text
docs/testing/v1-fixture-plan.md
docs/testing/README.md
```

Contract:

```text
docs/contracts/README.md
```

Decision:

```text
docs/decisions/decision-log.md
```

---

## 21. P0 Failure

Applicable한 P0 Requirement는 충족돼야 한다.

Applicable한 Active P0 Fixture는
`passed`일 때만 Release Gate를 통과한다.

다음 상태는 모두 Release Blocking이다.

```text
failed
blocked
error
invalid_fixture
not_run
```

`not_applicable`은 적용 조건이 거짓이라는
명시적 Evidence가 있을 때만 허용한다.

다음으로 우회하지 않는다.

```text
Known Limitation
문서상 경고
Manual Workaround만 제공
P1 이관
```

Requirement 자체를 변경하려면 Product Decision과 Completion Criteria 갱신이 필요하다.

---

## 22. Known Limitation

Known Limitation으로 허용 가능한 것:

```text
지원 Runtime·Version 제한
지원 OS 제한
비핵심 UX 불편
P1 Performance Gap
비핵심 UX·자동화 부족을 보완하는
명시된 Manual Step
```

허용할 수 없는 것:

```text
Secret 노출
Approval 우회
Scope 밖 Mutation
P0 Fixture 실패
False Runtime Support
Result Truthfulness 실패
Repository 자동 Apply
```

다음은 Manual Step 또는 Known Limitation으로 우회할 수 없다.

```text
Human Approval 누락
Secret Safety 실패
Scope Escape
P0 Validation 실패
Result Truthfulness 실패
Repository Apply Gate 누락
```

---

## 23. Documentation Truthfulness

Public Documentation은 다음 상태만 현재 지원 사실로 표현할 수 있다.

```text
accepted
accepted_with_constraints
```

`accepted_with_constraints`는 제약과 Known Limitation을 함께 표시한다.

다음은 현재 지원 사실로 표현하지 않는다.

```text
experiment
open
deferred
rejected
superseded
```

---

# Part VII. Product Change Management

## 24. Product Scope 변경

다음은 Product Scope 변경이다.

```text
V1·V2·V3 경계 변경
P0 Requirement 추가·삭제
Human Gate 추가·삭제·병합·완화 또는 책임 변경
Cloud 전송 범위 변경
Runtime 지원 약속 변경
Finance Safety Boundary 변경
Extension Dependency 변경
```

필수 절차:

```text
Decision Record
영향 Product 문서 갱신
Architecture 영향 검토
Contract 영향 검토
Fixture 영향 검토
Public Documentation 영향 검토
Human Review
```

---

## 25. Product Report 변경

Product Report의 다음 변경은 Scope Decision이 아닐 수 있다.

```text
설명 명확화
현재 Gap 업데이트
사용자 문제 서술 보완
Non-normative Example 추가
```

하지만 다음은 Decision Review가 필요하다.

```text
새 Feature Commitment
새 Runtime 지원 선언
Release Gate 완화
Safety Boundary 변경
Cloud Scope 확대
```

---

## 26. Extension 변경

Shared Core 변경이 필요하다고 주장하려면
다음 중 하나를 만족해야 한다.

```text
두 Extension 이상에서 반복되는 문제
또는
명백한 Domain-neutral Safety·Contract Requirement
```

그리고 다음을 모두 증명해야 한다.

```text
Domain-neutral Vocabulary
공통 Contract 필요성
각 Extension의 독립성 유지 가능
```

한 Extension의 편의를 Shared Core 의무로 승격하지 않는다.

---

# Part VIII. Document Status

## 27. Product 문서 상태표

| Document | Canonical Path | Document Status | Implementation Verification |
|---|---|---|---|
| Development Harness Report | `docs/product/development-harness-report.md` | canonical candidate | Not Verifiable in this index |
| Finance Harness Report | `docs/product/finance-harness-report.md` | canonical candidate | Not Verifiable in this index |
| V1 Completion Criteria | `docs/product/v1-completion-criteria.md` | canonical candidate | Not Verifiable in this index |

이 Index는 실제 구현 상태를 조사하지 않는다.

Current-state 구현 검증은 별도 Repository Report를 사용한다.

---

# Part IX. Non-goals

## 28. Product Index가 정의하지 않는 것

```text
Contract Schema
Runtime Adapter Interface
Fixture File Format
Database Schema
Cloud API
CLI Command
POC Result
Repository 현재 상태
```

---

## 29. Product 계층에 넣지 않는 문서

```text
Architecture Detail
Contract Definition
Fixture Plan
POC Plan
Decision Record
Implementation Handoff
Release Note
Current-state Repository Report
```

각 전용 디렉터리에 둔다.

---

# Part X. Open Decisions

## 30. 미결정 사항

1. V2 개인 유료 기능의 최종 Scope
2. V2 Local Invocation 채택 여부
3. Runtime 비교·추천의 Product 범위
4. V3 Workspace의 초기 최소 기능
5. Finance Product의 초기 제공 채널
6. Finance Market Data 사용 범위
7. Product Analytics의 Local·Cloud 경계
8. Public Runtime Support 초기 목록
9. V1 Release Packaging 형식
10. V2 이후 Free와 Pro의 최종 Entitlement 경계

Open Decision을 현재 Product 약속으로 표현하지 않는다.

V2 이후 Entitlement Open Decision은
Entitlement가 비범위인 V1 Product 경계를 다시 열지 않는다.

---

## 31. 불변조건

1. V1은 무료 Local-only Artifact Product다.
2. V1 Workflow는 Human-controlled다.
3. Work-start는 핵심 진입 가치지만 V1 전체는 아니다.
4. Development와 Finance는 Sibling Extension이다.
5. Finance는 Development V2 전체 완료에 종속되지 않는다.
6. Product는 Contract Field를 재정의하지 않는다.
7. Testing은 Product Release Requirement를 완화하지 않는다.
8. POC Outcome은 Product 채택이 아니다.
9. P0 실패를 Known Limitation으로 우회하지 않는다.
10. Public 지원 선언은 Evidence를 요구한다.
11. Result Accept와 Repository Apply를 분리한다.
12. Project Context Promotion은 별도 Human Gate다.
13. Finance는 투자자문·매매 추천 Product가 아니다.
14. Open·Deferred·Experiment 상태를 현재 지원 사실로 표현하지 않는다.
15. Product Scope 변경은 Decision과 영향 문서 검토를 거친다.
16. Product Positioning과 실제 Repository 구현 상태를 구분한다.
17. V1 Release는 V2 POC 결과에 의존하지 않는다.
18. `passed`가 아닌 Applicable P0 Fixture 상태는 Release Blocking이다.
19. Manual Step은 Safety·Approval·Truthfulness Gate를 대체하지 않는다.

---

## 32. 관련 문서

```text
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
docs/decisions/decision-log.md
```

---

## 33. 검수 관점

### Product Boundary

- V1·V2·V3 경계가 유지되는가
- Development·Finance Extension이 독립적인가

### Ownership

- Completion Criteria가 Release Requirement를 소유하는가
- Contract·Testing·POC와 책임이 겹치지 않는가

### Truthfulness

- Experiment와 Accepted Scope가 구분되는가
- Advertised Support가 Evidence와 연결되는가

### Safety

- Human Gate와 Local-only 경계가 유지되는가
- Finance Safety Boundary가 명확한가
