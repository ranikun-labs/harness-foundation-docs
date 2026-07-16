---
title: Contracts Index
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
  - docs/product/v1-completion-criteria.md
  - docs/contracts/work-start-contract.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/contracts/execution-policy-contract.md
  - docs/testing/v1-fixture-plan.md
  - docs/decisions/decision-log.md
---

# Contracts

## 1. 문서 목적

이 디렉터리는 `oh-my-ai` V1의 canonical Contract 문서를 관리한다.

Contract는 구현 세부사항이나 현재 Repository 상태를 조사하는 보고서가 아니다.

Contract의 목적:

```text
책임 경계 고정
입력·출력 구조 고정
상태 축 고정
Human Gate 고정
Runtime-neutral 의미 보존
Fixture Requirement 제공
```

---

## 2. Canonical Contract 목록

```text
docs/contracts/
├── README.md
├── work-start-contract.md
├── handoff-basic-contract.md
├── result-basic-contract.md
├── runtime-capability-contract.md
└── execution-policy-contract.md
```

Canonical 파일명에는 다음 suffix를 사용하지 않는다.

```text
-draft
-reviewed
-final
-v2
-latest
```

Revision 관리:

```text
Canonical Contract 문서 Revision
= Git History
= 필요 시 Decision Log

Contract 구조·필드·상태 의미 변경
= schema_version 검토

Handoff·Result·Policy 등 개별 Runtime Artifact 의미 변경
= artifact_version 증가
```

---

# Part I. Contract Responsibilities

## 3. Work-start Contract

**Path**

```text
docs/contracts/work-start-contract.md
```

**책임**

```text
User Task 입력
Repository·Context Discovery
Context Candidate
Skill Candidate
Risk Candidate
Observed Fact Candidate
Decision Candidate
Handoff Seed
```

**소유하지 않는 책임**

```text
Runtime 실행
Human Approval
Execution Policy 확정
Confirmed Truth 생성
Repository 수정
```

**핵심 원칙**

```text
Work-start Output
= Candidate
≠ Approved Handoff
≠ Execution Plan
≠ Project Context
```

---

## 4. Handoff Basic Contract

**Path**

```text
docs/contracts/handoff-basic-contract.md
```

**책임**

```text
Goal
Scope
Allowed Actions
Prohibited Actions
Do Not Touch
Confirmed Facts
Confirmed Decisions
Assumptions
Open Issues
Constraints
Expected Output
Completion Criteria
Validation Required
Return Contract
Human Review
```

**소유하지 않는 책임**

```text
Runtime 기술 Capability
현재 실행 허용 여부
Worker Result
Repository Apply
Project Context Promotion
```

**핵심 원칙**

```text
Structured Handoff
= Human-approved Task Contract
```

---

## 5. Result Basic Contract

**Path**

```text
docs/contracts/result-basic-contract.md
```

**책임**

```text
Worker 수행 상태
Finding
Evidence
Files Read
Files Changed
Commands
Validation
Completion Coverage
Scope Deviation
Blocker
Sensitive Data Status
Human Result Review
수동 Evidence Candidate
```

**소유하지 않는 책임**

```text
Worker Self-approval
Repository 자동 반영
Commit·Push
Project Context 자동 승격
```

**핵심 원칙**

```text
Result Basic
= Task-scoped Evidence Candidate
≠ Truth
≠ Accepted Decision
≠ Applied Change
```

---

## 6. Runtime Capability Contract

**Path**

```text
docs/contracts/runtime-capability-contract.md
```

**책임**

```text
Runtime Identity
Adapter Identity
Declared Capability
Verified Capability
Capability Drift
Requirement Mapping
Technical Compatibility
Availability Snapshot 참조
Capability와 Availability의 분리 규칙
Availability를 포함한 실행 전 Compatibility 입력 정의
Runtime Projection 가능성
Advertised Runtime Gate
```

**소유하지 않는 책임**

```text
Human Approval
작업 허용
Billing·Entitlement
Runtime 자동 선택
Runtime 자동 실행
```

현재 Local 환경의 Availability 상태는 Runtime Adapter 또는 Local Environment Check의 관찰 결과다.

Runtime Capability Contract는 Availability를 정적 Capability로 흡수하거나 영구 Supported·Unsupported 판정으로 변환하지 않는다.

**핵심 원칙**

```text
Capability
= Runtime의 기술적 가능성
```

---

## 7. Execution Policy Contract

**Path**

```text
docs/contracts/execution-policy-contract.md
```

**책임**

```text
Action Policy
Approval Requirement
Approval Grant
Approved Handoff Scope 참조
Policy Scope 축소
Scope Escape 차단
Repository State
Path Safety
Execution Readiness
Policy Drift
Human Policy Review
```

**소유하지 않는 책임**

```text
Runtime 기술 Capability
Runtime 설치 상태
Entitlement
자동 Runtime 실행
Result 승인
```

Execution Policy는 Handoff Scope를 소유하거나 확장하지 않는다.

Goal과 Approved Scope의 canonical owner는 Handoff Basic Contract다.

**핵심 원칙**

```text
Execution Policy
= 현재 작업에서 허용·승인 필요·금지되는 행동
```

---

# Part II. Contract Dependency

## 8. V1 Contract 흐름

```text
Work-start Candidate
   ↓
Structured Handoff Candidate
   ↓
Human Review
   ↓
Manual Copy/Paste
   ↓
Result Basic
   ↓
Human Review
```

Contract 자체의 의미와 필수 필드는 V1 P0에 남는다.
범용 Contract Validator와 Runtime별 Projection 고도화는 V1 Alpha 품질 기능이다.
Runtime Invocation, Managed Result Return, Manual Import 관리 기능은 V2 범위다.
Execution Policy Contract는 유지하지만 V1 수동 Workflow의 필수 자동 Gate로 해석하지 않는다.

---

## 9. 의존 방향

허용 의존:

```text
Work-start
→ Handoff Seed

Handoff
→ Runtime Requirement
→ Return Contract

Capability maps:

```text
Handoff Runtime Requirements
→ Capability IDs
→ Technical Compatibility
```

Execution Policy consumes:

```text
Approved Handoff Scope
Capability Compatibility Result
Availability Snapshot
Existing Approval Records
```

Execution Policy는 위 입력의 의미를 재정의하지 않는다.

Result consumes:

```text
Handoff Completion Criteria
Handoff Validation Requirement
Handoff Return Contract
```
```

금지 의존:

```text
Work-start가 Result 상태 확정
Handoff가 Runtime Capability 확정
Capability가 Human Approval 확정
Policy가 Runtime Capability를 덮어쓰기
Result가 Handoff Scope 확대
Result Accept가 Repository Apply 승인
```

---

## 10. Canonical Source Direction

각 정보의 canonical owner:

| 정보 | Canonical Owner |
|---|---|
| Task discovery candidate | Work-start Contract |
| Goal·Scope·금지사항 | Handoff Basic Contract |
| Runtime 기술 지원 | Runtime Capability Contract |
| Current Local Availability | Runtime Adapter 또는 Local Environment Check 결과 |
| 작업 허용·승인 | Execution Policy Contract |
| Worker Evidence | Result Basic Contract |
| Repository Apply Decision | Execution Policy Action Approval + 최종 Human 행동 |
| Durable Product·Architecture Decision | Decision Log |
| Durable Project Context | 별도 Human Promotion Gate를 거친 Project Context |
| Release 검증 | V1 Fixture Plan |

Availability Snapshot은 시점 의존 관찰 결과이며 Runtime Capability의 정적 기술 사실과 분리한다.

Decision Log의 Durable Decision과 Project Context의 Durable Context를 구분한다.

하위 Contract가 상위 Owner의 의미를 재정의하지 않는다.

---

# Part III. Shared Contract Rules

## 11. 상태 축 분리

Contract는 자신의 책임에 필요한 상태 축만 사용한다.

다만 다음처럼 의미가 다른 상태를 하나의 필드에 합치지 않는다.

```text
Lifecycle
Contract Validation
Human Review
Execution or Processing
Artifact Write
Availability
Drift
Import or Apply Readiness
```

모든 Contract가 모든 상태 축을 가져야 한다는 의미는 아니다.

예:

```text
contract_validation_status: valid
review_state: not_reviewed
execution_readiness_status: awaiting_approval
```

위 조합은 유효하다.

---

## 12. Schema Version과 Artifact Version

```text
schema_version
= Contract 구조 버전

artifact_version
= 동일 Artifact Reference의 의미 변경 이력
```

규칙:

```text
필드 구조·허용값 변경
→ schema_version 검토

Scope·Decision·Validation·Evidence 의미 변경
→ artifact_version 증가
```

---

## 13. Reference 무결성

모든 Reference는 다음 중 하나를 가리킨다.

```text
Local Artifact
Contract-defined Record
Fixture Evidence
Repository-local Source
Human Approval Evidence
```

규칙:

```text
Dangling Reference 금지
Duplicate ID 금지
Reference Type 명시
존재하지 않는 Evidence 참조 금지
Provider Session ID를 canonical reference로 사용 금지
```

---

## 14. Human Review 권한

Generator·Worker·Adapter가 생성할 수 있는 기본 Review 상태:

```text
not_reviewed
```

다음 상태 전이는 Human Reviewer만 수행한다.

```text
approved
accepted
edited_and_accepted
rejected
changes_requested
deferred
```

Contract별 허용 상태명은 다를 수 있으나 Self-approval은 금지한다.

Human Gate 의미:

```text
Handoff Review
= 작업 계약 승인

Projection Review
= Handoff 의미 보존과 Compatibility Report 수용

Policy Review
= Policy 계산·충돌·Safety 판정 수용

Action Approval
= 특정 Action·Scope 실행 승인

Result Review
= Evidence Candidate 수용·수정·거절

Repository Apply
= 별도 Repository Action 승인

Context Promotion
= 별도 Durable Context 승격 승인
```

어느 Gate도 다른 Gate를 묵시적으로 포함하지 않는다.

---

## 15. Scope 규칙

```text
Work-start
→ Scope Candidate

Handoff
→ Approved Scope

Policy
→ Scope를 좁힐 수 있음
→ Scope 확대 금지

Runtime Projection
→ Scope 의미 보존

Result
→ 실제 수행 Scope 보고
→ Scope 밖 행동은 Deviation
```

Scope를 확대하려면 새 Handoff Artifact Version과 Human Review가 필요하다.

---

## 16. Unknown 규칙

```text
unknown
≠ supported
≠ allowed
≠ passed
≠ complete
```

Unknown 상태는 다음 중 하나로 처리한다.

```text
Human Review
Manual Verification
Safe Fallback
Block
```

Unknown을 낙관적으로 승격하지 않는다.

---

## 17. Secret·Sensitive Data

모든 Contract에 적용:

```text
Secret 원문 직렬화 금지
Credential·Token Log 금지
Synthetic Secret만 Fixture에 사용
Redaction 전 일반 Artifact 저장 금지
Cloud 전송 금지
민감 Artifact Permission 검증
```

---

## 18. Local-only 규칙

V1 Contract는 다음 없이 동작해야 한다.

```text
Cloud Login
Cloud Database
Remote Task Queue
Managed Result Store
Billing Service
Organization Policy Service
```

Local-only는 Runtime Provider가 외부 통신을 절대 하지 않는다는 의미가 아니다.

의미:

```text
oh-my-ai 자체가
Code·Prompt·Handoff·Result 원문을
관리형 Cloud Control Plane에 저장하지 않음
```

---

# Part IV. Validation and Fixtures

## 19. Contract Validation

각 Contract는 최소 다음을 검증한다.

```text
Required Field
Allowed State
Conditional Field
Reference Integrity
Cross-field Conflict
Version Consistency
Human Review Authority
Sensitive Data
Good Example
Bad Example
```

---

## 20. Fixture Requirement

각 P0 Contract는 다음을 가진다.

```text
Positive Fixture
Negative Fixture
Manual E2E 연결
```

해당 Contract가 Fail-open 동작을 정의하면:

```text
Fail-open Fixture
```

Version, Environment, Source 또는 Artifact Drift를 정의하면:

```text
Drift Fixture
```

Fixture canonical 문서:

```text
docs/testing/v1-fixture-plan.md
```

---

## 21. Good·Bad Example 규칙

Good Example:

```text
Contract Validation 통과
Reference 무결성 통과
Self-approval 없음
Secret 없음
```

Bad Example:

```text
의도된 Error Code 또는 Invalid State 명시
Fixture Pass와 Subject Invalid 상태 분리
```

---

## 22. Release Gate

다음 Contract 경계가 P0다.

```text
Work-start Candidate Truthfulness
Handoff Validation
Projection Semantic Preservation
Capability Truthfulness
Policy Approval Boundary
Result Evidence Truthfulness
Secret Exclusion
Minimum Single-runtime Manual E2E
```

P0 실패를 Known Limitation으로 우회하지 않는다.

---

# Part V. Change Management

## 23. Contract 변경 절차

```text
변경 이유 기록
영향 Contract 식별
Decision Log 충돌 검사
Schema / Artifact Version 판정
Fixture 영향 분석
Good·Bad Example 갱신
Human Review
Canonical 파일 교체
```

---

## 24. Semantic Change

다음은 Semantic Change다.

```text
책임 Owner 변경
Required Field 변경
상태 의미 변경
Human Gate 완화
Scope 규칙 변경
Validation 의무 변경
Return Contract 변경
Import·Apply Gate 변경
```

Semantic Change는 오탈자 수정과 구분한다.

Contract Schema의 Semantic Change:

```text
schema_version 검토
Decision Log 영향 확인
관련 Fixture와 Example 갱신
```

개별 Runtime Artifact의 Semantic Change:

```text
artifact_version 증가
필요한 Human Approval 무효화 및 재검수
```

다음은 일반적으로 schema_version이나 artifact_version 증가 대상이 아니다.

```text
오탈자 수정
링크 수정
의미를 바꾸지 않는 문장 명확화
예시 설명 보완
```

---

## 25. Supersession

Contract 전체가 대체될 경우:

```text
기존 문서 status = superseded
superseded_by 기록
새 문서 supersedes 기록
Decision Log 갱신
```

Canonical 파일명을 유지하며 내용만 교체하는 경우 Git History로 Revision을 추적한다.

---

## 26. Cross-contract 변경

예:

```text
Handoff Return Contract 변경
→ Result Basic Contract 영향
→ Runtime Projection Fixture 영향
→ Manual E2E 영향
```

Cross-contract 변경은 단일 문서 수정으로 완료 처리하지 않는다.

---

# Part VI. Authoring Rules

## 27. Contract 문체

Contract는 다음을 우선한다.

```text
Normative Rule
Allowed State
Required Field
Forbidden Outcome
Deterministic Example
```

다음을 피한다.

```text
마케팅 표현
구현 라이브러리 확정
현재 Repository 조사 결과
근거 없는 미래 약속
모호한 “적절히”, “가능하면”, “필요 시”
```

---

## 28. 구현 중립성

Contract는 다음을 고정할 수 있다.

```text
책임
상태
입력·출력
안전 Gate
검증 규칙
```

다음은 Open Decision 또는 Implementation Document에서 결정한다.

```text
구현 언어
Library
Database
CLI Framework
Schema Validator
Exact File Format
```

---

## 29. Cross-reference 규칙

문서 참조는 Repository Root 기준 상대경로를 사용한다.

예:

```text
docs/contracts/handoff-basic-contract.md
docs/testing/v1-fixture-plan.md
```

파일명만 단독으로 적지 않는다.

---

## 30. Review Output 반영

Review 결과는 별도 `-reviewed.md` 파일로 canonical 저장하지 않는다.

절차:

```text
Draft Candidate
→ Review
→ 정확한 Correction 반영
→ 기존 canonical path 교체
```

---

# Part VII. Adoption Order

## 31. 권장 검수 순서

```text
1. Work-start Contract
2. Handoff Basic Contract
3. Result Basic Contract
4. Runtime Capability Contract
5. Execution Policy Contract
6. V1 Fixture Plan
7. Minimum Manual E2E
```

---

## 32. 구현 순서

Contract 채택 이후 권장 순서:

```text
Schema Validator
Fixture Runner
Work-start Validation
Handoff Validation
Result Validation
Capability Metadata / Resolver
Policy Resolver
Runtime Projection Builder 또는 Adapter
Projection Fixture
Manual E2E
```

이 순서는 Product Roadmap을 대체하지 않는다.

---

# Part VIII. Non-goals

## 33. 이 README가 정의하지 않는 것

```text
Runtime Adapter 구현
CLI Command
Cloud API
Billing
Entitlement
Workspace Policy
Project Registry
Remote Execution
Multi-agent Orchestration
Provider SessionBinding
```

---

## 34. Contract 계층에 넣지 않는 문서

```text
시장 조사
경쟁 제품 분석
현재 Repository 상태 보고서
POC 실행 결과
Implementation Handoff
Release Note
```

해당 문서는 각 전용 디렉터리에 둔다.

---

# Part IX. Current Status

## 35. Contract 상태표

| Contract | Canonical Path | Document Status | Implementation Verification |
|---|---|---|---|
| Work-start | `docs/contracts/work-start-contract.md` | canonical candidate | Not Verifiable in this index |
| Handoff Basic | `docs/contracts/handoff-basic-contract.md` | canonical candidate | Not Verifiable in this index |
| Result Basic | `docs/contracts/result-basic-contract.md` | canonical candidate | Not Verifiable in this index |
| Runtime Capability | `docs/contracts/runtime-capability-contract.md` | canonical candidate | Not Verifiable in this index |
| Execution Policy | `docs/contracts/execution-policy-contract.md` | canonical candidate | Not Verifiable in this index |

실제 구현 상태는 별도 Current-state Report와 Repository 검증 결과를 source of truth로 사용한다.

---

# Part X. Open Decisions

## 36. 미결정 사항

1. Contract별 Machine-readable Schema 위치
2. Contract Schema Validator 공통 구조
3. Contract Example 디렉터리 분리 여부
4. Contract Fixture와 Product Fixture의 물리적 분리
5. Reference URI 또는 Local Path 표준
6. Contract Error Code Registry 위치
7. Contract Version Compatibility Matrix
8. Canonical Artifact Root
9. Runtime Projection Artifact 확장자
10. Contract Documentation 자동 생성 여부

미결정 사항은 구현자가 임의로 canonical Decision으로 확정하지 않는다.

---

## 37. 불변조건

1. Contract는 현재 구현 보고서가 아니다.
2. Work-start Output은 Candidate다.
3. Handoff는 Human-approved Task Contract다.
4. Result Basic은 Evidence Candidate다.
5. Capability와 Policy를 분리한다.
6. Availability와 Capability를 분리한다.
7. Entitlement는 V1 비범위다.
8. Unknown을 낙관적으로 승격하지 않는다.
9. Generator·Worker·Adapter Self-approval을 금지한다.
10. Approval은 Handoff Scope를 확장하지 않는다.
11. Result Accept와 Repository Apply를 분리한다.
12. Project Context 자동 승격을 금지한다.
13. Secret 원문을 Artifact에 저장하지 않는다.
14. V1은 Local-only·Human-controlled다.
15. P0 Contract는 Negative Fixture를 가진다.
16. Canonical 파일명에 Review suffix를 사용하지 않는다.
17. 변경은 Decision·Version·Fixture 영향과 함께 검토한다.

---

## 38. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/testing/v1-fixture-plan.md
docs/decisions/decision-log.md
docs/architecture/local-cloud-human-boundary.md
docs/poc/v2-local-invocation-poc.md
```

---

## 39. 검수 관점

### Responsibility

- Contract별 Owner가 겹치지 않는가
- Capability·Policy·Availability 경계가 유지되는가

### Dependency

- Handoff가 Runtime·Result 책임을 침범하지 않는가
- Result가 Scope나 Decision을 확대하지 않는가

### Governance

- Canonical 파일명과 Version 규칙이 명확한가
- Review 결과 반영 방식이 일관적인가

### Release

- 각 P0 Contract가 Fixture와 연결되는가
- Manual E2E가 전체 Contract 흐름을 닫는가
