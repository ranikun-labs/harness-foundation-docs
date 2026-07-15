---
title: Decisions Index
status: draft
implementation_status: not_verifiable
owner: architecture
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
source_inputs:
  - docs/decisions/decision-log.md
  - docs/adr/README.md
  - docs/product/README.md
  - docs/roadmap/README.md
  - docs/architecture/README.md
  - docs/contracts/README.md
  - docs/testing/README.md
  - docs/poc/README.md
---

Front Matter의 `owner`는 Decision 문서 계층의 관리 책임자를 의미한다.

이는 Product·Contract·Safety Decision의 승인 권한이나
canonical owner를 Architecture가 소유한다는 의미가 아니다.

개별 Decision 권한은 각 Record의 `owner`와 `decision_scope`가 결정한다.

# Decisions

## 1. 문서 목적

이 디렉터리는 `oh-my-ai`의 Product·Architecture·Contract 관련 결정을 추적 가능한 형태로 관리한다.

현재 canonical 문서:

```text
docs/decisions/
├── README.md
└── decision-log.md
```

Decision 문서는 다음을 관리한다.

```text
현재 채택된 결정
제약과 함께 채택된 결정
실험 상태
연기된 결정
거절된 결정
대체된 결정
미결정 사항
결정 간 충돌과 우선순위
영향 문서와 Supersession
```

Decision 문서는 다음을 직접 정의하지 않는다.

```text
Contract Field 전체
Fixture 구현
Runtime Adapter 코드
POC 실행 결과
Repository 현재 구현 상태
Public Documentation 문구
```

---

# Part I. Canonical Decision Documents

## 2. Decision Log

**Path**

```text
docs/decisions/decision-log.md
```

**책임**

```text
Product Decision
Architecture Decision
Contract Boundary Decision
Safety Decision
Release·Documentation Decision
Deferred·Rejected·Open Decision
Experiment Decision Status와
POC Outcome Reference의 관계 기록
Supersession
Affected Documents
```

POC Lifecycle·Outcome과 실행 Evidence의 canonical owner는
`docs/poc/`다.

Decision Log는 POC Outcome을 재판정하거나
Product Decision Status로 자동 변환하지 않는다.

**핵심 원칙**

```text
Decision Log
= 현재 의사결정 상태의 canonical source

Product Report
= 현재 방향과 Context 설명

Roadmap
= 순서와 Commitment 상태

ADR
= 특정 Architecture 선택의 상세 근거
```

---

## 3. ADR과의 관계

ADR은 특정 Architecture 선택과 Trade-off를 상세히 기록한다.

Decision Log는 ADR을 포함한 현재 결정 상태를 요약·연결한다.

```text
ADR
= 특정 구조 선택의 상세 맥락·대안·결과

Decision Log
= 해당 결정의 현재 상태·Scope·영향·Supersession
```

ADR을 작성했다고 자동으로 Product Scope가 채택되는 것은 아니다.

Product Scope 변경은 별도 Product Decision이 필요하다.

---

# Part II. Decision Status Model

## 4. 허용 상태

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
| accepted_with_constraints | 제약·Known Limitation과 함께 채택 |
| experiment | 검증 전 가설 또는 POC 상태 |
| deferred | 구현·출시를 후속 버전으로 연기 |
| rejected | 채택하지 않음 |
| superseded | 새 결정으로 대체 |
| open | 아직 결정하지 않음 |

---

## 5. 상태별 사용 규칙

### accepted

```text
현재 Product·Architecture·Contract 문서가 따라야 하는 결정
```

### accepted_with_constraints

```text
제약·지원 범위·Known Limitation을 함께 기록
제약을 Public Documentation에서 누락 금지
```

### experiment

```text
POC·Validation 수행 가능
현재 지원 사실이나 Product Commitment로 표현 금지
```

### deferred

```text
현재 Version Scope에 포함 금지
Revisit Condition 없이 자동 복귀 금지
```

### rejected

```text
Active Roadmap Item이나 Public Support로 재도입 금지
새 근거가 있으면 새 Decision 필요
```

### superseded

```text
현재 기준으로 사용 금지
Replacement Decision Reference 필수
```

### open

```text
Discovery·분석 가능
현재 Product Commitment로 표현 금지
```

---

# Part III. Decision Record Contract

## 6. 필수 필드

모든 Decision Record는 다음을 가진다.

```text
decision_id
title
status
owner
decision_scope
decision
rationale
constraints
consequences
affected_docs
supersedes
superseded_by
reviewed_at
```

값이 없는 경우에도 생략하지 않는다.

예:

```text
constraints: []
consequences: []
affected_docs: []
supersedes: []
superseded_by: []
```

---

## 7. 선택 필드

```text
open_questions
implementation_notes
evidence_refs
experiment_outcome
revisit_condition
rollback_path
known_limitation
```

선택 필드를 사용하지 않을 때는 생략할 수 있다.

---

## 8. ID 규칙

권장 Prefix:

```text
DEC-
OPEN-
ADR-
EXP-
```

규칙:

```text
ID 재사용 금지
삭제 후 재사용 금지
다른 Record와 중복 금지
Superseded Record의 ID 유지
```

파일 이동·제목 변경으로 ID를 바꾸지 않는다.

---

## 9. Owner

`decision_scope`는 최소 다음을 식별한다.

```text
product
architecture
contract
safety
quality_release
```

Owner는 결정의 책임 주체다.

`owner`는 책임 주체이며 `decision_scope`와 동일한 의미가 아니다.

예:

```text
product
architecture
contract
safety
quality
documentation
```

Owner는 구현 담당자나 단순 작성자와 다를 수 있다.

작성자나 구현 담당자는
Owner 또는 승인 권한을 자동 획득하지 않는다.

Owner 변경은 결정의 의미를 바꾸지 않으면 Metadata Update일 수 있다.

---

# Part IV. Decision Scope

## 10. Product Decision

Product Decision이 소유할 수 있는 것:

```text
사용자
문제
가치
Version Scope
Priority
Release Requirement
Product Positioning
Public Support Commitment
Pricing·Entitlement 경계
```

Product Decision이 직접 정의하지 않는 것:

```text
Component 구조
Contract Field
Fixture Assertion
Runtime CLI Argument
```

---

## 11. Architecture Decision

Architecture Decision이 소유할 수 있는 것:

```text
Component Boundary
Dependency Direction
Local·Cloud Boundary
Shared Core·Extension Boundary
Data Boundary
Runtime Adapter Responsibility
```

Architecture Decision은 Product Scope를 임의로 확대하지 않는다.

---

## 12. Contract Decision

Contract Decision이 소유할 수 있는 것:

```text
Artifact 의미
입력·출력 책임
상태 축
Human Gate
Reference 규칙
Validation Rule
```

Contract Decision은 Product Priority를 변경하지 않는다.

---

## 13. Safety Decision

Safety Decision이 소유할 수 있는 것:

```text
Approval Boundary
Secret Boundary
Path Safety
Repository Safety
Process Cleanup
Cloud Egress
Unknown 처리
Scope Escape 차단
```

Safety Decision을 Implementation Convenience가 덮어쓸 수 없다.

---

## 14. Quality·Release Decision

Product·Release Decision이 소유:

```text
P0 Release Requirement
Release Blocking 기준
Advertised Support Commitment
Known Limitation 허용 범위
```

Quality·Testing Decision이 소유:

```text
Fixture Coverage
Assertion·Suite 정책
Manual E2E Evidence 형식
Verification 방식
```

Release Requirement의 canonical owner는
Product Completion Criteria다.

Testing은 해당 Requirement를 검증하는
Suite와 Evidence를 소유한다.

---

# Part V. Experiment and Outcome

## 15. Experiment 상태

Decision Status:

```text
experiment
```

POC Lifecycle:

```text
draft
approved_for_experiment
running
completed
cancelled
superseded
```

POC Outcome:

```text
validated
validated_with_constraints
rejected
inconclusive
```

세 축을 혼합하지 않는다.

---

## 16. Experiment Outcome 처리

```text
validated
→ Product 채택 후보

validated_with_constraints
→ 제한 범위의 Product 채택 후보

rejected
→ 해당 가설·Threshold·Scenario 기준으로
  Product Promotion Candidate가 아님

재검토하려면:
- 새 가설 또는 변경된 Experiment Version
- 새 Evidence
- 별도 Decision Review

inconclusive
→ Decision Status는 experiment 유지
```

어느 Outcome도 자동으로 `accepted`가 되지 않는다.

---

## 17. Experiment → Product Decision

필수 절차:

```text
POC completed
Outcome 기록
Threshold Snapshot 확인
Safety Result 확인
Product Value 확인
Maintenance Cost 확인
새 Product Decision Record
영향 Architecture·Contract·Fixture 검토
Roadmap 갱신
Human Review
```

POC 문서를 Product Contract로 변경하지 않는다.

---

# Part VI. Open Decision

## 18. Open Decision 규칙

Open Decision은 다음을 포함한다.

```text
결정해야 하는 질문
선택지
결정 시점
Owner
영향 문서
Blocker 여부
```

Open Decision에는 확정 문구를 사용하지 않는다.

---

## 19. Temporary Implementation Choice

Open Decision 전에 임시 구현이 필요하면 다음을 기록한다.

```text
temporary_choice
owner
reason
constraints
revisit_condition
rollback_path
affected_docs
```

임시 선택을 canonical Decision으로 표현하지 않는다.

---

## 20. Open → Accepted

필수 조건:

```text
질문과 Scope 명확
대안 비교
Trade-off 기록
영향 문서 확인
Safety 영향 확인
Human Review
다음 중 하나:

- 새 Accepted Decision Record 생성
- 이전 Open 상태를 보존하는
  명시적 Status Transition Record 생성
```

조용한 본문 수정이나 구현 반영만으로
Open Decision을 Accepted로 변경하지 않는다.

---

# Part VII. Deferred and Rejected Decisions

## 21. Deferred Decision

Deferred는 다음을 기록한다.

```text
defer_reason
target_version 또는 revisit_condition
dependency
risk
```

Deferred Item을 다시 활성화하려면:

```text
Revisit Condition 충족
기존 Deferred Decision과 근거 확인
Version Scope·Dependency·Risk 재검토
새 accepted 또는 accepted_with_constraints Decision 생성
영향 문서 갱신
Human Review
```

Decision Status가 `deferred`인 상태로
현재 Active Scope에 복귀시킬 수 없다.

---

## 22. Rejected Decision

Rejected는 최소 다음을 기록한다.

```text
거절한 선택
거절 이유
재도입 금지 범위
재검토 조건
```

Rejected 선택을 다른 이름으로 재도입하지 않는다.

재검토가 필요하면 기존 Record의 의미를 바꾸지 않고 새 Decision을 만든다.

---

# Part VIII. Supersession

## 23. Superseded 처리

기존 결정을 변경하거나 대체할 때:

```text
새 Decision Record 생성
기존 status = superseded
기존 superseded_by 기록
신규 supersedes 기록
영향 문서 갱신
Human Review
```

기존 Record를 삭제하거나 의미를 조용히 변경하지 않는다.

---

## 24. Partial Supersession

부분 대체된 기존 Decision은
`remaining_valid_scope`가 존재하는 동안
`accepted` 또는 `accepted_with_constraints` 상태를 유지한다.

다음을 기록한다.

```text
superseded_scope
remaining_valid_scope
replacement_decision_ref
```

기존 Decision 전체가 더 이상 유효하지 않을 때만
`status: superseded`로 전환한다.

---

## 25. Reversal

이전 결정을 반대로 바꾸는 경우에도 새 Decision이 필요하다.

```text
Decision Reversal
≠ 기존 본문 수정
```

기존 결정과 당시 근거는 보존한다.

---

# Part IX. Conflict Resolution

## 26. 우선순위

충돌 판정 순서:

```text
1. Hard Safety Invariant
2. 최신 Accepted ADR
3. 최신 Accepted 또는 Accepted-with-constraints Decision
4. 해당 Decision에서 파생된 Accepted Contract
5. Experiment
6. Open Decision
7. Implementation Convenience
```

Accepted ADR의 우선순위는
해당 ADR이 소유하는 Architecture Scope 안에서 적용한다.

Product Scope나 Contract 의미를
ADR만으로 변경할 수 없다.

ADR의 현재 유효성은 Decision Log의
Status·Scope·Supersession Reference로 확인한다.

동일 계층에서는:

```text
명시적 supersession
더 구체적인 Scope
더 최근 reviewed_at
```

순으로 판단한다.

`reviewed_at`은 Supersession과 Scope 판정 이후의
보조 기준으로만 사용한다.

Metadata Review 시각만으로
다른 Decision을 대체하거나 의미를 변경하지 않는다.

---

## 27. Conflict 처리

충돌 발견 시:

```text
Conflict Record 생성
관련 Decision ID 수집
Scope 비교
reviewed_at 비교
Supersession 확인
Safety 영향 확인
Human Review
영향 문서 갱신
```

충돌을 임의로 조용히 해결하지 않는다.

---

## 28. 문서별 충돌 처리

### Product Report vs Decision Log

```text
최신 유효 Decision을 확인
Product Report 갱신
```

### Contract vs Decision Log

```text
Contract가 오래된 경우 Contract 갱신
Decision이 오래된 경우 새 Decision 필요
```

### POC vs Accepted Decision

```text
POC는 Accepted Decision을 자동 변경하지 않음
```

### Public Documentation vs Decision Log

```text
Public Documentation이 오래된 경우 즉시 정정
```

---

# Part X. Documentation Truthfulness

## 29. Public Support 표현

Public Documentation은 다음 상태만 현재 지원 사실로 표현할 수 있다.

```text
accepted
accepted_with_constraints
```

`accepted_with_constraints`는 다음을 함께 표시한다.

```text
제약
지원 범위
Known Limitation
```

다음 상태는 현재 지원 사실로 표현하지 않는다.

```text
experiment
open
deferred
rejected
superseded
```

---

## 30. Decision과 Runtime Support

Runtime Support Declaration:

```text
Runtime Capability Contract
```

현재 지원 사실로 공개하려면:

```text
Accepted Product Decision
Valid Capability Metadata
Current Drift Status
Projection Fixture
Manual E2E
Known Limitation
Truthful Quick Start
```

가 필요하다.

Decision만으로 Runtime 지원이 증명되는 것은 아니다.

---

# Part XI. Change Management

## 31. 새 Decision이 필요한 변경

```text
V1·V2·V3 Scope 변경
P0 Requirement 변경
Human Gate 추가·삭제·병합·완화
Cloud Data Boundary 변경
Shared Core 책임 변경
Extension Dependency 변경
Runtime Public Support 변경
Finance Safety Boundary 변경
POC를 Product Scope로 승격
Contract의 책임 Owner 변경
Contract 입력·출력 의미 변경
상태 축·Human Gate·Reference·Validation 의미 변경
Safety Invariant 변경
```

---

## 32. Metadata Update로 가능한 변경

결정 의미가 바뀌지 않는 경우:

```text
오탈자 수정
링크 수정
affected_docs 추가
evidence_refs 추가
Owner 변경
reviewed_at 갱신
```

단, Owner 변경이 책임 주체 변경을 의미하면 새 Decision 또는 명시적 Review가 필요하다.

---

## 33. Decision Review

Decision Review는 최소 다음을 확인한다.

```text
Scope
Rationale
Constraints
Consequences
Safety
Affected Documents
Supersession
Roadmap 영향
Contract 영향
Fixture 영향
Public Documentation 영향
```

---

# Part XII. Decision Evidence

## 34. Evidence 종류

```text
Architecture Analysis
Contract Review
Fixture Result
Manual E2E
POC Result
User Research
Operational Evidence
Security Review
Legal Review
```

Evidence가 있다는 사실만으로 Decision이 자동 채택되지는 않는다.

---

## 35. Evidence Reference

Evidence Reference는 다음을 포함해야 한다.

```text
reference
version 또는 source_revision
created_at
owner
scope
```

Dangling Reference를 허용하지 않는다.

Temporary File Path나 Provider Session ID를 canonical Evidence Reference로 사용하지 않는다.

---

## 36. Not Verifiable

실제 Repository·Runtime·Fixture 확인이 없는 경우:

```text
Not Verifiable
```

로 기록한다.

다음으로 바꾸지 않는다.

```text
implemented
missing
passed
failed
supported
unsupported
```

근거가 없는 구현 상태를 Decision Log에 확정하지 않는다.

---

# Part XIII. Decision Log Governance

## 37. Record 추가

새 Record 추가 전:

```text
중복 Decision 검색
기존 Open·Deferred·Rejected 확인
Supersession 필요 여부 확인
Owner 확인
Decision Scope 확인
```

---

## 38. 중복 Decision

동일한 의미의 결정을 다른 ID로 생성하지 않는다.

중복 발견 시:

```text
canonical Record 하나 유지
다른 Record는 참조로 전환하거나 superseded 처리
ID 이력 보존
```

---

## 39. Record 정렬

권장 정렬:

```text
Product
Architecture
Workflow
Identity·Artifact
Runtime·Capability
Execution Policy
Repository Safety
Fixture·Release
Documentation
Deferred
Rejected
Open
```

정렬은 의미를 바꾸지 않는다.

---

## 40. Review Cadence

Decision Review가 필요한 시점:

```text
Version Scope 변경
POC 완료
P0 변경
새 Runtime 지원
Cloud Boundary 변경
Shared Core 변경
Extension 추가
Public Documentation 공개 전
Release Candidate 생성 전
Deferred Decision 재개 전
Rejected Decision 재검토 시
Full·Partial Supersession 또는 Reversal 시
Decision Conflict 발견 시
Contract 의미 변경 시
```

단순 일정 변경만으로 전체 Decision Review를 요구하지 않을 수 있다.

---

# Part XIV. Document Status

## 41. Decision 문서 상태표

| Document | Canonical Path | Document Status | Implementation Verification |
|---|---|---|---|
| Decision Log | `docs/decisions/decision-log.md` | canonical candidate | Not Verifiable in this index |

이 Index는 실제 Decision 구현 완료 여부를 검증하지 않는다.

결정의 구현 상태는 별도 Current-state Report와 Evidence를 통해 확인한다.

---

# Part XV. Non-goals

## 42. Decisions Index가 정의하지 않는 것

```text
구현 완료율
Fixture 통과 결과
Runtime 지원 현재 목록
POC 결과
Release Date
Contract Field 전체
Architecture Component 전체
```

---

## 43. Decisions 계층에 넣지 않는 문서

```text
Product Report
Roadmap
Architecture Definition
Contract Definition
Fixture Plan
POC Plan
Implementation Handoff
Release Note
Current-state Report
```

각 전용 디렉터리에 둔다.

---

# Part XVI. Open Governance Decisions

## 44. 미결정 사항

1. Decision Record의 Machine-readable Format
2. Decision ID 자동 발급 방식
3. ADR과 Decision Log 자동 동기화 여부
4. Supersession Graph 검증 도구
5. Decision Conflict 자동 탐지
6. Public Decision Export 범위
7. Evidence Reference Registry
8. Decision Review 승인자 모델
9. Decision Log 분할 기준
10. Archived Decision 보관 정책
11. Decision Change Notification 방식
12. Decision Schema Validator

Open Governance Decision을 현재 운영 사실로 표현하지 않는다.

---

## 45. 불변조건

1. Decision 상태와 POC Outcome을 혼합하지 않는다.
2. Accepted와 Experiment를 같은 지원 상태로 표현하지 않는다.
3. Open Decision을 Product Commitment로 표현하지 않는다.
4. Deferred Decision을 현재 Version Scope에 넣지 않는다.
5. Rejected Decision을 다른 이름으로 재도입하지 않는다.
6. Superseded Decision을 현재 기준으로 사용하지 않는다.
7. Decision 변경은 새 Record와 Supersession으로 추적한다.
8. Safety Decision은 Implementation Convenience보다 우선한다.
9. Public Documentation은 accepted 또는 accepted_with_constraints만 지원 사실로 표현한다.
10. Decision만으로 Runtime 지원을 증명하지 않는다.
11. Evidence가 없어도 Decision은 존재할 수 있지만 구현 상태를 확정할 수는 없다.
12. POC 성공은 Product 채택이 아니다.
13. ADR 작성은 Product Scope 채택을 자동 의미하지 않는다.
14. 중복 Decision ID를 허용하지 않는다.
15. Not Verifiable을 낙관적 구현 상태로 바꾸지 않는다.
16. Decision Log는 POC Outcome을 소유하거나 재판정하지 않는다.
17. Decision Scope와 Owner를 분리한다.
18. Deferred Decision 상태로 Active Scope에 복귀시키지 않는다.
19. Partial Supersession은 잔여 유효 Scope를 보존한다.
20. ADR 우선순위는 Architecture Scope 안에서만 적용한다.

---

## 46. 관련 문서

현재 사용자 제공 Repository Tree 기준으로
`docs/adr/README.md`의 경로 존재는 확인됐다.

다만 이 Index는 해당 ADR 문서의 canonical 내용까지
자동 검증하거나 대체하지 않는다.

```text
docs/decisions/decision-log.md
docs/adr/README.md
docs/product/README.md
docs/roadmap/README.md
docs/architecture/README.md
docs/contracts/README.md
docs/testing/README.md
docs/poc/README.md
```

---

## 47. 검수 관점

### Status

- Decision 상태가 서로 배타적이고 명확한가
- Experiment 상태와 Outcome이 분리되는가

### Traceability

- 필수 Metadata가 누락되지 않는가
- Supersession과 영향 문서를 추적할 수 있는가

### Ownership

- Product·Architecture·Contract·Safety Decision이 구분되는가
- ADR·Roadmap·POC와 역할이 충돌하지 않는가

### Truthfulness

- Public Support와 Decision 상태가 정렬되는가
- Not Verifiable 상태를 과장하지 않는가
