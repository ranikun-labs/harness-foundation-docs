---
title: Architecture Index
status: draft
implementation_status: not_verifiable
owner: architecture
last_reviewed: 2026-07-23
supersedes: []
superseded_by: []
source_inputs:
  - docs/architecture/repository-service-boundaries.md
  - docs/architecture/shared-core-and-extensions.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/product/README.md
  - docs/contracts/README.md
  - docs/testing/README.md
  - docs/poc/README.md
  - docs/decisions/decision-log.md
---

# Architecture

## 1. 문서 목적

이 디렉터리는 `oh-my-ai`의 Product 간 구조적 경계, 책임 분리와 의존 방향을 관리한다.

현재 canonical 문서:

```text
docs/architecture/
├── README.md
├── repository-service-boundaries.md
├── shared-core-and-extensions.md
└── local-cloud-human-boundary.md
```

Architecture 문서는 다음을 정의한다.

```text
책임 경계
Component Boundary
Dependency Direction
Data Boundary
Local·Cloud·Human Boundary
Shared Core·Extension 관계
Cross-product Invariant
```

Architecture 문서는 다음을 직접 정의하지 않는다.

```text
Product Priority
Release Requirement
Contract Field Schema
Fixture Assertion
Runtime Adapter 구현
Database Schema
POC 결과
현재 Repository 구현 상태
```

---

# Part I. Canonical Architecture Documents

## 2. Shared Core and Extensions

**Path**

```text
docs/architecture/shared-core-and-extensions.md
```

**책임**

```text
Shared Core의 최소 책임
Development Extension의 책임
Finance Extension의 책임
Sibling Extension 관계
Extension 간 의존 금지
public `oh-my-ai`의 Architecture Positioning과
Shared Platform 전체 Owner가 아니라는 경계
```

실제 현재 Package·Module·Directory 범위는
이 Architecture Index에서 조사하거나 확정하지 않는다.

**핵심 원칙**

```text
Shared Core
= Domain-neutral Vocabulary
= 최소 Contract Boundary
= 공통 Human-control·Safety Rule

Development Extension
= Repository·Worktree·Diff·Runtime 중심

Finance Extension
= Lens·PolicyGuard·Journal·Review 중심
```

**금지**

```text
Development 구현을 Shared Platform 전체로 간주
Finance를 Development의 하위 Extension으로 배치
한 Extension의 내부 Model을 Shared Core 의무로 승격
Shared Core에 공통 DB·Service·Domain Model 강제
```

---

## 3. Local, Cloud and Human Boundary

**Path**

```text
docs/architecture/local-cloud-human-boundary.md
```

**책임**

```text
Local에 남아야 하는 데이터·행동
Cloud 전송 가능 후보
명시적 Opt-in이 필요한 데이터
Human이 유지하는 최종 권한
Cloud Candidate의 Truthfulness 경계
```

**핵심 원칙**

```text
Local
= Raw Context
= Source Code
= Secret
= Runtime Execution
= Local Artifact

Cloud Candidate
≠ Canonical Truth

Human
= Scope·전송·실행·Result·Promotion·Retention의 최종 권한
```

**금지**

```text
Raw Code·Prompt·Result의 묵시적 Cloud 저장
Candidate 자동 Truth 승격
Cloud Metadata 수집을 Runtime 실행 권한으로 사용
Human Gate 제거
```

---

# Part II. Architecture Layers

## 4. Product Layer

Product Layer가 소유:

```text
User
Problem
Value
Scope
Priority
Release Requirement
Product Positioning
```

Architecture는 Product Scope를 설명할 수 있으나 새 Product Feature를 결정하지 않는다.

Canonical owner:

```text
docs/product/
docs/decisions/decision-log.md
```

---

## 5. Shared Core Layer

Shared Core가 소유:

```text
공통 Vocabulary
Artifact Reference 원칙
Human Review 원칙
Capability·Policy·Availability 분리
Local·Cloud·Human Boundary의
공통 Invariant와 Contract 적용 원칙
Cross-extension Safety Invariant
Extension-independent Contract 의미
```

Shared Core가 소유하지 않는 것:

```text
Repository 구현
Worktree 구현
Finance Lens
Journal Data Model
Runtime-specific CLI
Domain-specific UI
Domain-specific Database
```

Local·Cloud·Human Boundary의 canonical 정의는
Architecture 문서가 소유한다.

Shared Core는 해당 Boundary를 준수하고
Extension-independent Contract에 반영하지만,
Cloud Product Scope나 Data Transfer 기능을 소유하지 않는다.

Shared Core는 가능한 한 작게 유지한다.

---

## 6. Extension Layer

Extension Architecture는 Domain별 Component Boundary,
Runtime Integration, Adapter와 Data Model을 소유한다.

Extension의 사용자 문제·가치·기능 Scope는
Product 문서와 Decision Log가 소유한다.

### Development Extension

```text
Repository
Branch
Worktree
Diff
Runtime Adapter
Local CLI
Developer Workflow
```

### Finance Extension

```text
Lens
PolicyGuard
Checklist
Journal
Review
Finance Knowledge Architecture
```

Extension 간 직접 의존을 기본값으로 두지 않는다.

---

## 7. Contract Layer

Contract Layer가 소유:

```text
입력·출력
상태 축
Reference
Human Gate
Validation Rule
Return Contract
```

Architecture는 Contract 간 소유권과 의존 방향을 정의할 수 있다.

Architecture는 Contract Field 전체를 복제하거나 재정의하지 않는다.

Canonical owner:

```text
docs/contracts/
```

---

## 8. Testing Layer

Testing Layer가 소유:

```text
Fixture Definition
Assertion
Suite
Evidence
Manual E2E
Product Release Requirement에 대한
Verification Suite와 Evidence
```

Architecture는 Testing이 검증해야 하는 경계를 제공한다.

Release Requirement와 Release Blocking 기준은
`docs/product/v1-completion-criteria.md`가 소유한다.

Testing은 해당 기준과 Architecture Decision을
완화하거나 독자적으로 변경하지 않는다.

Canonical owner:

```text
docs/testing/
```

---

## 9. POC Layer

POC Layer가 소유:

```text
Hypothesis
Scenario
Metric
Threshold
Abort Criteria
Experiment Outcome
```

Architecture 문서는 POC의 실험 경계를 제한할 수 있다.

POC 결과는 별도 Decision 없이 Architecture로 채택되지 않는다.

Canonical owner:

```text
docs/poc/
```

---

# Part III. Shared Core Boundary

## 10. Shared Core 최소 책임

Shared Core에 포함될 수 있는 것:

```text
Task
Candidate
Handoff
Result
Capability
Policy
Availability Vocabulary와
Capability로부터의 분리 규칙
Approval
Artifact Reference
Human Review
Truthfulness
```

단, Shared Core는 공통 Vocabulary와 최소 Contract만 정의한다.

현재 Runtime·Authentication·Network의 Availability 관찰값은
Runtime Adapter 또는 Local Environment Check가 생성한다.

Shared Core는 해당 관찰값을 정적 Capability 사실로 변환하지 않는다.

예:

```text
Result
= Task-scoped Evidence Candidate

Capability
= 기술적 가능성

Policy
= 현재 작업의 허용·승인 필요·금지 행동
```

---

## 11. Shared Core 승격 조건

Extension 내부 개념을 Shared Core로 승격하려면 다음을 모두 만족해야 한다.

```text
두 Extension 이상에서 반복됨
Domain-neutral 의미를 가짐
공통 Contract가 실제로 필요함
Extension 독립성을 해치지 않음
Shared Core 없이 중복·충돌 비용이 큼
```

다음은 승격 근거가 아니다.

```text
한 Extension 구현이 편해짐
현재 public Repository에 이미 존재함
특정 Runtime이 요구함
한 Product의 UI에서 반복 사용됨
```

---

## 12. Shared Core 비범위

```text
Git Repository
Worktree
Branch
Diff
Writer Lease
Agent Process
Investment Journal
Market Data
Financial Lens
Account Integration
Domain-specific PolicyGuard
```

이 개념들은 Extension 또는 Product 계층에서 소유한다.

---

# Part IV. Extension Boundary

## 13. Development Extension

Development Extension은 다음 실행 모델을 소유할 수 있다.

```text
Repository Context
Branch
Worktree
Diff
Patch
Runtime Projection
Runtime Adapter
Local Process
Git Action
```

단, 다음을 Shared Core Truth로 만들지 않는다.

```text
모든 Task는 Repository를 가진다
모든 Result는 Diff를 가진다
모든 Approval은 Git Action과 연결된다
모든 Extension은 Worktree를 사용한다
```

---

## 14. Finance Extension

Finance Extension은 다음 Domain Model을 소유할 수 있다.

```text
Learn
Checklist
Journal
Review
Lens
PolicyGuard
Asset Class
Domain Deep-dive
```

다음을 Development Contract에 맞추기 위해 강제하지 않는다.

```text
Repository
Branch
Worktree
Diff
Patch
Writer Lease
Agent Process
```

Finance는 Shared Core의 Human-control·Truthfulness·Policy 경계만 공유한다.

---

## 15. Extension 간 관계

```text
Development → Shared Core ← Finance
```

화살표는 Contract Dependency 방향을 의미한다.

Shared Core는 Development 또는 Finance의
구체 구현에 역의존하지 않는다.

기본 규칙:

```text
Development → Finance 직접 의존 금지
Finance → Development 직접 의존 금지
공통 개념은 Shared Core 승격 조건 검토
Domain 전용 개념은 Extension 내부 유지
```

한 Extension의 Release가 다른 Extension의 문서·Contract 작업을 불필요하게 차단하지 않는다.

---

# Part V. Local Boundary

## 16. Local Data

기본적으로 Local에 남는 것:

```text
Source Code
Repository Document
Raw Prompt
Raw Handoff
Raw Result
Diff
Command Output
Secret·Credential
= 필요한 경우 Local에서만 일시 처리
= 일반 Local Artifact 저장 금지

Runtime Output
Local Evidence
```

Local 기본값은 Cloud 전송 금지를 의미하며,
Secret 원문의 Local 저장·Log·Evidence 직렬화를 허용한다는 의미가 아니다.

Local에 있다는 이유만으로 안전하다고 간주하지 않는다.

필수 보호:

```text
Permission
Path Safety
Symlink Safety
Retention
Redaction
Cleanup
```

---

## 17. Local Execution

V1:

```text
Manual Runtime Execution
Manual Prompt Delivery
Manual Result Return
```

V2 Experiment:

```text
Local Child Process Invocation
Local Output Capture
Local Result Normalization
```

다음은 Local Execution과 별개다.

```text
Remote Execution
Cloud Task Queue
Managed Runtime Broker
Background Agent Service
```

---

## 18. Local Artifact

Local Artifact는 다음 원칙을 따른다.

```text
Local Reference
Versioned Meaning
Human Review State
Secret Exclusion
Reference Integrity
Explicit Retention
```

Local Artifact는 Managed Cloud Entity가 아니다.

---

# Part VI. Cloud Boundary

## 19. Cloud 전송 가능 후보

향후 Cloud 기능에서 검토할 수 있는 후보:

```text
최소 Usage Metadata
Human-reviewed Artifact
Explicit Candidate
Product Domain Data
Error Category
Duration
Version Metadata
```

전송은 다음 조건을 요구한다.

```text
명시적 Product Decision
사용자 고지
Data Classification
Opt-in 또는 명시 정책
Retention Policy
Deletion Path
Security Review
```

V1에서는 구현하지 않는다.

---

## 20. Cloud 금지 기본값

다음은 기본적으로 Cloud 전송 금지다.

```text
Raw Source Code
Raw Repository Document
Raw Prompt
Raw Handoff
Raw Result
Raw Diff
Command Output
Secret
Credential
Private Key
.env Content
```

예외는 별도 Product·Architecture·Policy Decision이 필요하다.

---

## 21. Full Context Opt-in

Full Context 전송은 다음을 모두 요구한다.

```text
명시적 사용자 Opt-in
전송 범위 Preview
대상 Provider 표시
Retention 표시
취소·삭제 경로
Scope별 Approval
```

Opt-in은 다른 Data Class 전송 동의로 확대 해석하지 않는다.

---

## 22. Cloud Candidate

Cloud에서 생성되거나 저장된 Candidate는 다음이 아니다.

```text
Confirmed Fact
Accepted Decision
Approved Handoff
Accepted Result
Durable Project Context
```

Human Review와 Source 확인이 필요하다.

---

# Part VII. Human Authority

## 23. Human이 유지하는 권한

```text
Task Scope
Handoff Approval
Projection Review
Policy Review
Action Approval
Runtime Selection
Invocation Approval
= Local Invocation이 승인된 POC 또는
  별도 Product Decision으로 활성화된 경우에 적용

Result Review
Repository Apply
Context Promotion
Cloud Transmission
Retention
Deletion
```

Invocation Approval은 V1 Manual Runtime Execution의
필수 Managed Entity를 의미하지 않는다.

어느 권한도 다른 권한을 자동 포함하지 않는다.

---

## 24. Human Gate 비동치

```text
Handoff Approval
≠ Action Approval

Projection Review
≠ Invocation Approval

Policy Review
≠ Action Approval

Result Accept
≠ Repository Apply

Repository Apply
≠ Commit
≠ Push
≠ PR Create

Result Accept
≠ Context Promotion

Cloud Opt-in
≠ Runtime Execution Approval
```

---

## 25. Self-approval 금지

다음 주체는 자신이 생성한 Artifact를 최종 승인할 수 없다.

```text
Generator
Worker
Runtime Adapter
Normalizer
Fixture Runner
Cloud Service
```

기본 Review 상태:

```text
not_reviewed
```

---

# Part VIII. Dependency Rules

## 26. 허용 의존

```text
Product
→ Architecture Requirement

Architecture
→ Contract Boundary

Contract
→ Fixture Requirement

POC
→ Architecture·Contract·Testing Constraint 참조

Extension
→ Shared Core
```

---

## 27. 금지 의존

```text
Architecture가 Product Scope를 임의 확장
Contract가 Product Priority 변경
Testing이 Release Requirement 완화
POC가 Product Scope 자동 승격
Shared Core가 Extension 내부 Model 소유
Development가 Finance Release 선결 조건
Finance가 Development Runtime Model 상속
Cloud Metadata가 Human Approval 대체
```

---

## 28. Dependency Inversion

Extension은 Shared Core Contract에 의존할 수 있다.

Shared Core는 특정 Extension 구현에 의존하지 않는다.

```text
Shared Core
← Development Adapter

Shared Core
← Finance Adapter
```

다음 구조는 금지한다.

```text
Shared Core
→ Git Worktree 구현

Shared Core
→ Finance Journal DB

Finance
→ Development Runtime Process
```

---

# Part IX. Runtime-neutral Architecture

## 29. Runtime-neutral 의미

Runtime-neutral은 다음을 의미한다.

```text
Canonical Handoff는 Runtime별 Prompt가 아님
Capability는 Runtime별 Adapter를 통해 표현
Policy는 Runtime 종류와 독립적으로 계산 가능
Result는 Runtime별 Output을 공통 Candidate로 정규화 가능
```

Runtime-neutral은 다음을 의미하지 않는다.

```text
모든 Runtime이 동일 Capability를 가짐
모든 Runtime이 동일 CLI를 가짐
모든 Runtime을 동시에 지원함
Adapter가 필요 없음
```

---

## 30. Runtime Adapter 경계

Runtime Adapter가 소유:

```text
Runtime Discovery
Version Detection
Command Construction
Prompt Delivery Mapping
Output Stream Mapping
Runtime-specific Error Mapping
Native Structured Output 식별
Runtime-specific 종료 신호 Mapping
Runtime-specific Resource Cleanup
Process Supervisor에 필요한 Cleanup Hint
```

Startup·Execution Timeout,
Cancellation, Forced Termination,
Descendant Process Cleanup과 Concurrent Lock은
Runtime-neutral Process Supervisor 책임이다.

Adapter는 Cleanup 성공을 자체 승인하거나
Cleanup 실패를 Known Limitation으로 완화하지 않는다.

Runtime Adapter가 소유하지 않는 것:

```text
Handoff Scope
Execution Policy
Human Approval
Canonical Result Truth
Repository Apply
Product Support Declaration
```

---

## 31. Runtime Support

Runtime Support Declaration:

```text
Runtime Capability Contract
```

Runtime Support Verification:

```text
Runtime별 Fixture
Projection Fixture
Manual E2E
Known Limitation
```

Architecture는 Runtime 지원 목록을 확정하지 않는다.

---

# Part X. Data and State Boundary

## 32. State Separation

다음 상태 축을 합치지 않는다.

```text
Lifecycle
Validation
Review
Execution
Availability
Drift
Capture
Parse
Import Readiness
Apply Readiness
```

모든 Component가 모든 상태 축을 가져야 하는 것은 아니다.

자신의 책임에 필요한 상태만 사용한다.

---

## 33. Truthfulness Boundary

```text
Observed
≠ Inferred

Candidate
≠ Confirmed

Declared Capability
≠ Verified Capability

Process Exit
≠ Workflow Success

Parsed Result
≠ Valid Result

Accepted Result
≠ Applied Result
```

---

## 34. Reference Boundary

Canonical Reference:

```text
Local Artifact Reference
Versioned Artifact Reference
Evidence Reference
Decision Reference
```

Canonical Reference가 아닌 것:

```text
Provider Session ID
Process PID
Cloud Telemetry ID
Temporary File Path
UI Component ID
```

보조 Metadata로는 사용할 수 있으나 canonical identity로 승격하지 않는다.

---

# Part XI. Security Boundary

## 35. Secret Boundary

```text
Secret 원문 저장 금지
Credential Argument 직렬화 금지
Parent Environment 전체 복사 금지
Redaction 전 일반 Artifact 저장 금지
Cloud 전송 금지
Synthetic Secret만 Fixture에서 사용
```

---

## 36. Path Boundary

```text
Canonical Path
Allowed Root
Traversal 차단
Symlink Escape 차단
Do Not Touch
Git Metadata 보호
```

Path String 비교만으로 안전을 판정하지 않는다.

---

## 37. Process Boundary

Local Process Invocation에서:

```text
Startup Timeout
Execution Timeout
Graceful Shutdown Timeout
Cancellation
Forced Termination
Descendant Cleanup
Concurrent Invocation Lock
```

을 분리한다.

Process Cleanup 실패는 기능 제한이 아니라 안전 실패다.

---

# Part XII. Change Management

## 38. Architecture Decision 변경

다음은 Architecture Decision 변경이다.

```text
Shared Core 책임 변경
Extension Dependency 변경
Local·Cloud Boundary 변경
Human Authority 추가·삭제·병합·축소,
승인 효과 확대 또는 canonical owner 변경
Runtime Adapter 책임 변경
Canonical Owner 변경
Data Classification 변경
```

필수 절차:

```text
Decision Record
영향 Product 문서 확인
영향 Contract 확인
영향 Fixture 확인
POC 영향 확인
Migration 영향 확인
Human Review
```

---

## 39. Shared Core 변경

Shared Core 변경은 최소 다음 Evidence가 필요하다.

```text
복수 Extension 요구
Domain-neutral 의미
공통 Contract 필요성
기존 Extension 독립성 유지
Migration Cost
Backward Compatibility
```

단순 코드 재사용만으로 Shared Core 책임을 확대하지 않는다.

---

## 40. Cloud Boundary 변경

Cloud 전송 범위를 확대하려면:

```text
Data Class
Purpose
Destination
Retention
Deletion
Encryption
Access Control
Opt-in
Audit
Failure Handling
```

을 별도 결정한다.

기존 Opt-in을 새로운 Data Class에 자동 적용하지 않는다.

---

# Part XIII. Document Status

## 41. Architecture 문서 상태표

| Document | Canonical Path | Document Status | Implementation Verification |
|---|---|---|---|
| Shared Core and Extensions | `docs/architecture/shared-core-and-extensions.md` | canonical candidate | Not Verifiable in this index |
| Local, Cloud and Human Boundary | `docs/architecture/local-cloud-human-boundary.md` | canonical candidate | Not Verifiable in this index |

이 Index는 실제 Repository 구조나 구현 상태를 조사하지 않는다.

Current-state Architecture Report가 존재하면 별도 source of truth로 사용한다.

---

# Part XIV. Non-goals

## 42. Architecture Index가 정의하지 않는 것

```text
Product Priority
Contract Field 전체
Fixture File Format
POC 결과
Runtime 지원 목록
Database Schema
CLI Command
현재 구현 완료율
```

---

## 43. Architecture 계층에 넣지 않는 문서

```text
Product Report
Completion Criteria
Contract Definition
Fixture Plan
POC Plan
Decision Log
Implementation Handoff
Release Note
Current-state Repository Report
```

각 전용 디렉터리에 둔다.

---

# Part XV. Open Decisions

## 44. 미결정 사항

1. Shared Core의 실제 Package·Repository 경계
2. Development·Finance Adapter Interface
3. Extension Registry 필요 여부
4. Local Artifact Root
5. Cloud Metadata 최소 필드
6. Full Context Opt-in UX
7. Data Classification Taxonomy
8. Runtime Adapter Packaging
9. Project Context 저장 위치
10. Cross-extension Event 또는 API 필요 여부
11. Shared Validation Engine
12. Architecture Diagram 표준

Open Decision을 현재 Architecture 사실로 표현하지 않는다.

---

## 45. 불변조건

1. Shared Core는 최소 Vocabulary와 Contract만 소유한다.
2. Development와 Finance는 Sibling Extension이다.
3. Finance는 Development V2 완료에 종속되지 않는다.
4. Shared Core는 특정 Extension 구현에 의존하지 않는다.
5. Raw Context·Source Code·Secret은 Local 기본값이다.
6. Cloud Candidate는 Canonical Truth가 아니다.
7. Human은 Scope·전송·실행·Result·Promotion의 최종 권한을 유지한다.
8. Human Gate는 서로를 자동 포함하지 않는다.
9. Capability·Policy·Availability를 분리한다.
10. Runtime Adapter는 Handoff나 Policy를 완화하지 않는다.
11. Architecture는 Product Scope를 임의 확장하지 않는다.
12. POC 결과는 Architecture로 자동 채택되지 않는다.
13. Testing은 Architecture Decision을 완화하지 않는다.
14. 한 Extension의 편의를 Shared Core 의무로 승격하지 않는다.
15. Cloud Boundary 확대는 별도 Decision을 요구한다.
16. Extension Architecture는 Product Scope를 소유하지 않는다.
17. Secret의 Local 처리는 일반 Artifact 저장 허용이 아니다.
18. Invocation Approval은 승인된 POC 또는 Product Decision에서만 적용한다.
19. Process Supervisor와 Runtime Adapter의 Cleanup 책임을 분리한다.

---

## 46. 관련 문서

```text
docs/product/README.md
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
docs/decisions/decision-log.md
docs/roadmap/product-roadmap.md
```

---

## 47. 검수 관점

### Layer Boundary

- Product·Architecture·Contract·Testing·POC가 분리되는가
- Canonical Owner가 중복되지 않는가

### Extension Boundary

- Shared Core가 과도하게 확장되지 않는가
- Development·Finance 독립성이 유지되는가

### Local·Cloud·Human

- Raw Data의 Local 기본값이 유지되는가
- Human Authority가 자동화에 의해 약화되지 않는가

### Runtime

- Runtime-neutral과 Runtime 동일성이 혼동되지 않는가
- Adapter 책임이 Core로 누출되지 않는가
