---
title: Handoff Basic Contract
status: draft
implementation_status: partial
owner: development
last_reviewed: 2026-07-29
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
related_decisions:
  - DEC-062
source_inputs:
  - docs/product/v1-completion-criteria.md
  - docs/contracts/work-start-contract.md
  - docs/contracts/pending-handoff-rehydration-contract.md
  - docs/product/development-harness-report.md
  - docs/architecture/local-cloud-human-boundary.md
---

# Handoff Basic Contract

## 1. 문서 목적

이 문서는 `oh-my-ai` V1의 Structured Handoff Candidate 기본 계약을 정의한다.

Handoff의 목적은 특정 작업을 Worker Runtime에 전달할 때 다음을 보존하는 것이다.

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
Expected Output
Completion Criteria
Validation Requirements
Return Contract
```

Handoff는 Prompt 꾸밈 문서가 아니다.

V1에서 Handoff는 provider-neutral Markdown으로 작성되는 수동 전달용 작업 Contract Candidate다.
Human Review 후 사용자가 Worker Session에 수동 Copy/Paste한다.

```text
사용자 또는 Main Session
→ Worker Runtime
```

위 문장은 Public `v1.0.0` Manual Copy/Paste Baseline을 정의한다. DEC-062의 Public `v1.1.0`
Delta Gate에서는 Human Review된 정제 Candidate를 Pending으로 등록하고, 사용자가 직접 연
지원 Session에 안전 조건 아래 연결할 수 있다. Pending·Claim·Delivery·Consumption 책임은
`docs/contracts/pending-handoff-rehydration-contract.md`가 소유한다.

이 문서는 Handoff를 Runtime Invocation, Worker 자동 생성, Result Return, Action Approval, Managed Task Entity, 자동 Prompt Delivery, SessionBinding, Cloud Workflow로 확장하지 않는다.

---

## 2. 책임 경계

## 2.1 Handoff가 소유하는 책임

```text
작업 목적 고정
작업 범위 고정
허용 작업 고정
금지 작업 고정
변경 금지 대상 고정
사실·결정·가정·미결정 분리
완료 조건 고정
검증 요구 고정
결과 반환 형식 고정
```

## 2.2 Handoff가 소유하지 않는 책임

```text
Runtime 자동 실행
Prompt 자동 전달
Session 생성
Worker 선택
파일 잠금
Writer Lease
Result 자동 반환
Result 자동 수집
Result 자동 승인
Project Context 자동 승격
Managed Task ID
Cloud 저장
Billing / Entitlement
```

## 2.3 다른 Contract와의 관계

```text
Work-start
= Candidate Seed

Handoff
= Structured Handoff Candidate

Manual Copy/Paste
= Human Review 후 Worker Session에 수동 전달

Result Basic
= Worker가 반환하는 Evidence Candidate

Project Context
= Human-confirmed Durable Context

Pending Handoff Rehydration
= Human Review와 명시적 Handoff Consent 이후의 전달 Lifecycle
= 별도 Pending·Claim·Delivery·Consumption 상태
```

Handoff Basic의 `lifecycle_status`는 Task Contract Artifact의 검수·Export Lifecycle이다.
Pending Rehydration의 `status`와 합치거나 한쪽 상태를 다른 쪽 성공으로 추정하지 않는다.

---

## 3. V1 불변조건

1. Handoff는 Runtime-neutral 의미를 먼저 가진다.
2. Claude·Codex 표현은 Projection이다.
3. Handoff 생성과 Runtime 실행을 분리한다.
4. 사용자 승인 전 Handoff를 전송하지 않는다.
5. Handoff는 특정 작업 범위만 소유한다.
6. Handoff가 Project Context를 자동 변경하지 않는다.
7. Worker가 Handoff를 임의 확장할 수 없다.
8. Scope 밖 작업은 Result에서 Deviation으로 기록한다.
9. 추정은 Fact로 기록하지 않는다.
10. 실행하지 않은 검증을 요구 충족으로 표시하지 않는다.
11. Cloud와 Auth 없이 생성·검수·전달 가능해야 한다.
12. 단일 Runtime으로도 사용 가능해야 한다.
13. Structured Handoff Candidate는 Worker 자동 생성, Runtime 자동 Invocation, Session Linking, Result 자동 반환을 의미하지 않는다.

---

# Part I. Identity and Lifecycle

## 4. Handoff Identity

V1 Handoff는 Local Candidate Artifact다.

필수 식별자:

```text
handoff_ref
```

권장 형식:

```text
handoff-YYYYMMDD-HHMMSS-short-slug
```

예:

```text
handoff-20260714-183000-readme-v1-alignment
```

`handoff_ref`는 V2 Managed Task ID가 아니다.

다음 용도로만 사용한다.

```text
Local Artifact 연결
Result Basic의 source_handoff_ref
Human Review 추적
Manual Export / Import 참조
```

---

## 5. Handoff 상태

Handoff는 다음 상태 축을 분리한다.

### Lifecycle Status

```text
draft
ready_for_review
approved
exported
rejected
superseded
expired
```

| 상태 | 의미 |
|---|---|
| draft | 작성 중 |
| ready_for_review | 필수 필드가 채워져 검수 가능 |
| approved | 사용자가 전달을 승인 |
| exported | Runtime에 수동 전달됨 |
| rejected | 사용자가 폐기 |
| superseded | 새 Handoff가 대체 |
| expired | Material Drift로 재검토 필요 |

### Review State

```text
not_reviewed
changes_requested
approved
rejected
```

### Contract Validation Status

```text
valid
invalid
incomplete
conflicting
```

Task Validation 실행 결과는 Handoff 상태가 아니라 Result Basic의 다음 필드가 소유한다.

```text
validation_performed
validation_not_performed
validation_results
```

기본 Lifecycle 전이:

```text
draft
→ ready_for_review
→ approved
→ exported
```

대체 경로:

```text
draft → rejected
ready_for_review → rejected
approved → superseded
approved → expired
exported → superseded
exported → expired
```

`exported`는 작업 성공을 의미하지 않는다.

---

## 6. Version

필수 필드:

```text
schema_version
artifact_version
```

구분:

```text
schema_version
= Contract 구조 버전

artifact_version
= 동일 Handoff 내용 수정 버전
```

예:

```yaml
schema_version: "1.0"
artifact_version: 3
```

동일 작업의 수정본은 같은 `handoff_ref`를 유지하고 `artifact_version`을 증가시킨다.

승인 후 다음 필드가 변경되면 기존 승인은 무효화한다.

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
Repository Context
```

필수 처리:

```text
artifact_version 증가
lifecycle_status를 draft 또는 ready_for_review로 복귀
review_state를 not_reviewed 또는 changes_requested로 변경
기존 Export 승인 무효화
새 Human Review 전 Export 금지
```

기존 Artifact Version은 조용히 덮어쓰지 않는다.

최소한 다음을 보존한다.

```text
previous_artifact_version
change_summary
reviewed_at
```

---

# Part II. Core Fields

## 7. 필수 필드

```text
schema_version
artifact_version
handoff_ref
lifecycle_status
contract_validation_status
title
goal
scope
allowed_actions
prohibited_actions
do_not_touch
confirmed_facts
confirmed_decisions
assumptions
open_issues
constraints
expected_output
completion_criteria
validation_required
return_contract
repository_context
created_at
created_by
review_state
```

---

## 8. Title

짧고 식별 가능한 작업명이다.

예:

```text
Align README with V1 Product Boundary
```

금지:

```text
Fix stuff
Do the task
Update project
```

---

## 9. Goal

작업이 완료되었을 때 달성돼야 하는 단일 목적이다.

좋은 예:

```text
README와 README.md의 제품 설명을
V1 Local Artifact Workflow 정의와 정렬한다.
```

나쁜 예:

```text
README를 개선한다.
```

Goal은 Solution을 미리 강제하지 않는다.

---

## 10. Scope

이번 작업에서 다룰 대상이다.

형식:

```yaml
scope:
  include:
    - README.md
    - README.md
  exclude:
    - runtime implementation
    - billing design
```

Scope는 파일 목록만이 아니다.

다음을 포함할 수 있다.

```text
문서
코드 영역
기능
질문
결정 범위
검토 범위
```

Scope가 불명확하면 승인할 수 없다.

---

## 11. Allowed Actions

Worker에게 허용된 작업이다.

예:

```text
문서 읽기
문장 수정 제안
사용자 승인된 파일 수정
검증 명령 실행
Diff 요약
```

Allowed Actions가 없으면 기본값은 다음이다.

```text
Read and analyze only
```

---

## 12. Prohibited Actions

Worker가 해서는 안 되는 작업이다.

예:

```text
새 기능 설계
Scope 밖 파일 수정
Commit
Push
PR 생성
Dependency 추가
Network 호출
Production 변경
```

`prohibited_actions`는 `do_not_touch`와 다르다.

```text
prohibited_actions
= 금지된 행동

do_not_touch
= 변경 금지 대상
```

---

## 13. Do Not Touch

작업 중 변경하면 안 되는 파일·영역·결정이다.

예:

```yaml
do_not_touch:
  files:
    - scripts/runtime-executor.sh
  decisions:
    - "V1은 Local-only다"
    - "Billing은 V2 이후다"
```

빈 목록을 허용하지만 명시적으로 기록해야 한다.

```yaml
do_not_touch: []
```

누락과 빈 목록을 구분한다.

---

# Part III. Truthfulness and Context

## 14. Confirmed Facts

직접 검증됐거나 사용자가 확정한 사실이다.

예:

```text
README는 현재 Skill Routing 중심으로 제품을 설명한다.
```

모든 Confirmed Fact는 Source를 가져야 한다.

Source는 다음 중 하나일 수 있다.

```text
Repository 파일
명령 결과
Canonical 문서
Human Confirmation
```

```yaml
confirmed_facts:
  - statement: "V1은 Local-only 제품이다."
    source:
      type: canonical_document
      reference: docs/product/v1-completion-criteria.md
```

Source를 제시할 수 없는 값은 Confirmed Fact가 아니라 Assumption 또는 Open Issue로 기록한다.

---

## 15. Confirmed Decisions

이미 승인된 제품·아키텍처 결정이다.

예:

```text
Result Basic은 V1 필수다.
Auth와 Billing은 V1 비범위다.
```

모든 Confirmed Decision은 다음 중 하나의 근거를 가져야 한다.

```text
Decision Document
Human Approval
Authority Reference
```

Worker는 Confirmed Decision을 재논의 대상으로 취급하지 않는다.

단, 명백한 충돌을 발견하면 Result에 보고한다.

---

## 16. Assumptions

검증되지 않았지만 작업 진행을 위해 사용하는 전제다.

예:

```text
README의 제품명은 변경하지 않는다.
```

Assumption은 다음을 포함할 수 있다.

```text
validation_status
impact_if_false
```

예:

```yaml
assumptions:
  - statement: "기존 설치 경로는 유지된다."
    validation_status: not_verified
    impact_if_false: "Migration 문서가 필요할 수 있음"
```

---

## 17. Open Issues

작업 시작 시 해결되지 않은 문제다.

예:

```text
Migration 안내가 필요한지 미정
Handoff Artifact의 기본 저장 경로가 미정
```

Worker는 Open Issue를 임의로 확정하지 않는다.

분석 중 해결 후보를 발견하더라도 Result Basic의 Finding 또는 Recommendation으로 반환한다.

Confirmed Decision 승격에는 별도 Human Review가 필요하다.

가능한 처리:

```text
analyze
propose_options
mark_blocked
request_decision
```

---

## 18. Constraints

작업 수행에 적용되는 제약이다.

예:

```text
Markdown만 수정
새 Dependency 금지
기존 IA 유지
GitHub 조회 금지
문서 직접 수정 금지
```

Constraint는 Allowed / Prohibited Action과 중복될 수 있지만, 환경·법률·시간·형식 조건을 표현하는 데 사용한다.

다음 필드 사이의 상호 충돌을 검증한다.

```text
Scope Include / Exclude
Allowed Actions / Prohibited Actions
Allowed Actions / Do Not Touch
Allowed Actions / Constraints
Scope / Do Not Touch
Completion Criteria / Prohibited Actions
```

우선순위:

```text
Prohibited Actions
Do Not Touch
Constraints
> Allowed Actions
```

단, 충돌을 조용히 해석하지 않는다.

상호 충돌이 있으면 `contract_validation_status: conflicting`으로 판정하고 승인 전에 해결한다.

---

# Part IV. Output and Completion

## 19. Expected Output

Worker가 반환해야 하는 산출물이다.

예:

```yaml
expected_output:
  type: markdown_patch
  files:
    - README.md
    - README.md
  include:
    - change_summary
    - validation_summary
    - remaining_risks
```

가능한 유형:

```text
analysis
recommendation
patch
new_document
review_report
test_result
implementation
```

---

## 20. Completion Criteria

작업 완료 판정 기준이다.

좋은 예:

```text
README와 README.md가
V1 Local Artifact Workflow,
Structured Handoff,
Result Basic,
Human Review를 동일하게 설명한다.
```

나쁜 예:

```text
문서를 적절히 수정한다.
```

Completion Criteria는 관찰 가능해야 한다.

형식:

```yaml
completion_criteria:
  - id: CC-01
    condition: "README가 V1을 Local Artifact Workflow로 설명한다."
  - id: CC-02
    condition: "Result Basic이 V1 핵심 흐름에 포함된다."
```

---

## 21. Validation Required

필요한 검증을 명시한다.

예:

```yaml
validation_required:
  - id: VAL-01
    type: command
    value: "git diff --check"
  - id: VAL-02
    type: review
    value: "README와 harness-design 용어 일치 확인"
```

Handoff의 Validation Requirement:

```text
requirement_level:
- required
- optional
- not_applicable
```

Worker 실행 후 Validation 결과:

```text
execution_status:
- passed
- failed
- not_performed
- blocked
```

실행 결과는 Result Basic이 기록한다.

Handoff는 어떤 Validation이 필요한지만 정의한다.

각 Validation은 가능한 경우 검증 대상 Completion Criteria를 연결한다.

```yaml
validation_required:
  - id: VAL-01
    validates:
      - CC-01
      - CC-02
    requirement_level: required
    type: review
    value: "두 문서의 제품 용어 정합성 확인"
```

Worker가 검증하지 못하면 Result Basic의 `validation_not_performed`에 기록해야 한다.

---

## 22. Return Contract

Worker가 반환할 Result 형식을 고정한다.

필수:

```text
result_type: result-basic
source_handoff_ref
required_fields
```

예:

```yaml
return_contract:
  result_type: result-basic
  result_schema_version: "1.0"
  additional_required_fields: []
```

Result Basic의 공통 필수 필드는 Result Basic Contract에서 상속한다.

Handoff는 해당 필수를 제거하거나 완화할 수 없으며, 작업별 추가 필드만 요구할 수 있다.

자유 서술만 요구해서는 안 된다.

---

# Part V. Repository Context

## 23. Repository Context

권장 필드:

```text
repository_root
repository_name
branch
commit
worktree_state
tracked_scope
```

예:

```yaml
repository_context:
  repository_root: /Users/work/Github/oh-my-ai
  repository_name: oh-my-ai
  branch: master
  commit: 40c0250
  worktree_state: unknown
```

확인하지 못한 값은 `unknown`으로 기록한다.

임의 Commit을 생성하거나 최신 상태를 추정하지 않는다.

---

## 24. Dirty Worktree

Dirty Worktree가 확인되면 다음을 기록한다.

```text
dirty_worktree: true
known_changes
unknown_changes
risk
```

Worker는 기존 변경을 자동 폐기하거나 덮어쓰지 않는다.

Dirty Worktree가 확인되면 Worker가 처리 Mode를 임의로 선택하지 않는다.

Handoff Human Review에서 다음 중 하나를 승인한다.

```text
analyze_only
patch_with_approval
stop_and_report
```

승인된 Mode가 없으면 기존 변경을 수정·폐기·덮어쓰지 않고 `stop_and_report`를 적용한다.

---

# Part VI. Human Review

## 25. Review 필수 항목

사용자는 최소 다음을 확인한다.

```text
Goal이 한 문장으로 명확한가
Scope가 충분히 좁은가
Allowed Actions가 적절한가
Prohibited Actions가 충분한가
Do Not Touch가 누락되지 않았는가
Confirmed Fact와 Assumption이 섞이지 않았는가
Open Issue가 숨겨지지 않았는가
Completion Criteria가 관찰 가능한가
Validation 요구가 현실적인가
Return Contract가 충분한가
```

---

## 26. Review State

```text
not_reviewed
changes_requested
approved
rejected
```

Review Metadata 조건:

```text
review_state = not_reviewed
→ reviewed_by / reviewed_at 없음 허용

review_state = changes_requested | approved | rejected
→ reviewed_by / reviewed_at 필수

review_notes
→ changes_requested와 rejected에서 필수
→ approved에서는 선택
```

승인 예:

```yaml
review_state: approved
reviewed_by: user
reviewed_at: 2026-07-14T18:30:00+09:00
review_notes:
  - "Scope confirmed"
  - "No GitHub access"
```

---

## 27. 승인 전 금지

V1 P0에서는 Human Review 전 다음을 수행하지 않는다.

```text
Worker Runtime 실행
파일 수정
Shell 명령 실행
Cloud 업로드
Project Context Promotion
```

Runtime Projection Export와 Export 차단은 V1 Alpha 품질 기능이며 V1 P0 필수 Gate가 아니다.

---

## 28. Review 결과

```text
approve
edit
reject
split
defer
```

`split`은 하나의 Handoff가 여러 독립 작업을 포함할 때 사용한다.

## 29. Next Step 이후 Candidate 상태

Work-start Human Review에서 Direct Handoff, Plan First, Gather Context 중
하나가 선택되더라도 Handoff는 자동으로 Ready, Approved, Final 상태가 되지 않는다.

```text
Direct Handoff
= 사용자가 Candidate를 검토한 뒤 수동 전달 가능하다고 판단

Plan First
= 사용자가 계획을 먼저 검토하고 Candidate를 수동 갱신·재검토할 수 있음

Gather Context
= 사용자가 외부 자료나 추가 입력을 수동 확인하고
  Candidate를 수동 갱신·재검토할 수 있음
```

Planning 또는 External Context가 미확인 상태이면
Handoff는 승인된 전달물로 오인되면 안 된다.

선택적 수동 참조 후보:

```text
selected_next_step
next_step_reason
reviewed_plan_reference
external_context_reviewed
remaining_context_gaps
```

이는 새 필수 Contract 필드가 아니다.

```text
not required
not automatic import
not planning state management
not automatic approval
not automatic update
```

---

# Part VII. Runtime Projection

## 30. Projection 원칙

Runtime Projection은 V1 Alpha 품질 기능이다. V1 P0의 필수 산출물은 provider-neutral Markdown Structured Handoff Candidate이며, 사용자가 Human Review 후 수동 전달한다.

Canonical Handoff는 Runtime-neutral 의미를 가진다.

Runtime Projection은 다음을 변환할 수 있다.

```text
문장 순서
Prompt Formatting
Runtime-specific terminology
Tool instruction syntax
```

변경하면 안 되는 것:

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
Completion Criteria
Validation Required
Return Contract
```

---

## 31. Projection Output

필수 출력:

```text
generic-handoff.md
```

조건부 출력:

```text
V1 Alpha에서 지원 대상으로 선언한 각 Runtime의 Projection
```

예:

```text
claude-handoff.md
codex-handoff.md
```

모든 Runtime Projection을 동시에 제공하는 것은 V1 P0 필수 조건이 아니다.

---

## 32. Capability와 Projection

Runtime이 지원하지 않는 기능을 Handoff가 요구하면 다음 중 하나로 처리한다.

```text
block_projection
require_manual_step
downgrade_with_warning
```

`downgrade_with_warning`은 다음을 약화하지 않는 경우에만 허용한다.

```text
Goal
Scope
Prohibited Actions
Do Not Touch
Completion Criteria
Validation
Return Contract
```

의미나 의무가 변경되면 새 Artifact Version을 생성하고 Human Review를 다시 받아야 한다.

지원하지 않는 기능을 지원한다고 표현하면 안 된다.

Capability와 Execution Policy를 구분한다.

```text
Capability
= Runtime이 기술적으로 가능한가

Execution Policy
= 이번 작업에서 허용되는가
```

---

## 33. Semantic Preservation

Projection 전후 다음 의미가 동일해야 한다.

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
```

Semantic Preservation Fixture가 필요하다.

---

# Part VIII. Validation

## 34. Contract Validation

최소 Validation:

```text
필수 필드 존재
허용 Lifecycle / Review / Contract Validation 상태값
handoff_ref 형식
artifact_version 증가
Scope Include / Exclude 충돌
Allowed / Prohibited Action 충돌
Allowed Action / Do Not Touch 충돌
Allowed Action / Constraints 충돌
Scope / Do Not Touch 충돌
Completion Criteria / Prohibited Action 충돌
Do Not Touch 누락 여부
Fact / Assumption 분류
Confirmed Fact / Decision Source 존재
Completion Criteria 존재
Validation Required 존재
Return Contract 존재
Review 승인 상태
```

---

## 35. Validation 실패

Contract Validation 상태:

```text
invalid
incomplete
conflicting
```

다음 Handoff는 Export할 수 없다.

```text
contract_validation_status가 valid가 아님
review_state가 approved가 아님
lifecycle_status가 rejected, superseded 또는 expired
승인 후 의미 변경이 있었으나 재검수되지 않음
```

Worker가 수행해야 할 Task Validation은 Export 시점에 아직 미수행일 수 있다.

수행 여부와 결과는 Result Basic으로 반환한다.

---

## 36. Expiration and Drift

다음 Material Drift가 발생하면 Handoff를 `expired`로 판정한다.

```text
기준 Branch 변경
Scope 대상 파일 변경
Confirmed Fact의 Source 변경
관련 Instruction 또는 Confirmed Decision 변경
Do Not Touch 대상 변경
Completion Criteria 또는 Validation 전제 변경
```

Scope 밖의 관련 없는 Commit 변경은 Warning으로 기록하되 자동으로 `expired` 처리하지 않는다.

Drift의 영향 여부를 판단할 수 없으면 `drift_detected`로 표시하고 Human Review를 요구한다.

Expired Handoff:

```text
Export 불가
기존 Artifact 자동 수정 금지
새 artifact_version 생성
Human Review 재수행
```

`exported → expired` 전이도 허용한다.

---

# Part IX. Fixture

## 37. Positive Fixture

### 정상 Handoff

다음이 모두 포함돼야 한다.

```text
Goal
Scope
Allowed / Prohibited Actions
Do Not Touch
Facts
Assumptions
Open Issues
Completion Criteria
Validation
Return Contract
Human Approval
```

---

## 38. Negative Fixture

### 필수 필드 누락

```text
goal 없음
completion_criteria 없음
return_contract 없음
```

결과:

```text
invalid
```

### Fact / Assumption 혼합

추정값을 Confirmed Fact로 기록.

결과:

```text
conflicting
```

### Scope 충돌

동일 파일이 include와 exclude에 존재.

결과:

```text
conflicting
```

### 승인 전 Export

```text
review_state: not_reviewed
```

결과:

```text
export blocked
```

### Validation 불가능

요구 검증이 현재 Runtime Capability와 불일치.

결과:

```text
block_projection 또는 manual step required
```

### Stale Handoff

Material Drift가 발생함.

결과:

```text
expired
```

Scope 밖의 관련 없는 Commit 변경은 Warning이며 자동 만료가 아니다.

### 승인 후 의미 변경

```text
Scope 또는 Do Not Touch 변경
→ artifact_version 증가
→ 기존 승인 무효화
→ 재승인 전 Export 차단
```

### Source 없는 Confirmed Fact

```text
Confirmed Fact에 Source 없음
→ invalid
```

### Cross-field 충돌

```text
Allowed Action과 Prohibited Action 충돌
Allowed Scope와 Do Not Touch 충돌
→ conflicting
```

### Result Contract 축소

```text
Result Basic 공통 필수 필드 제거 시도
→ invalid
```

### Superseded 재Export

```text
superseded Handoff 재Export
→ blocked
```

---

## 39. Semantic Projection Fixture

동일 Handoff를 Claude와 Codex로 Projection한 뒤 다음을 비교한다.

```text
Goal
Scope
Prohibited Actions
Do Not Touch
Completion Criteria
Validation Required
Return Contract
```

의미 손실이 있으면 실패다.

---

## 40. 완료 조건

Contract 완료:

```text
필수 필드 정의
상태 모델 정의
Review Gate 정의
최소 Fixture 검증 정의
Expiration 정의
Positive / Negative Fixture 정의
```

Implementation 완료:

```text
Handoff Candidate 생성
Human Edit
Manual Copy/Paste 가능한 provider-neutral Markdown
Scope / Do Not Touch 보존 Fixture
필수 필드 누락 Negative Fixture
```

범용 Handoff Validator, Runtime Projection, Generic Markdown Export 고도화, Semantic Preservation Fixture는 V1 Alpha 품질 기능이다.

---

# Part X. Example

## 41. Good Example

```yaml
schema_version: "1.0"
artifact_version: 1
handoff_ref: handoff-20260714-183000-readme-v1-alignment
lifecycle_status: approved
contract_validation_status: valid
title: Align README with V1 Product Boundary

goal: >
  README와 README.md의 제품 설명을
  V1 Local Artifact Workflow 정의와 정렬한다.

scope:
  include:
    - README.md
    - README.md
  exclude:
    - runtime implementation
    - billing design

allowed_actions:
  - Read scoped files
  - Edit scoped documentation
  - Run documentation validation

prohibited_actions:
  - Add new product features
  - Modify runtime code
  - Commit
  - Push
  - Create pull request

do_not_touch:
  files:
    - scripts/runtime-executor.sh
  decisions:
    - "V1 is local-only"
    - "Billing is V2+"

confirmed_facts:
  - statement: "V1 requires Result Basic."
    source: docs/product/v1-completion-criteria.md

confirmed_decisions:
  - "Structured Handoff and Result Basic are V1 contracts."

assumptions:
  - statement: "The current product name remains unchanged."
    validation_status: not_verified
    impact_if_false: "README title may require separate review."

open_issues:
  - "Whether a migration note is required."

constraints:
  - "Do not access GitHub."
  - "Preserve existing information architecture."

expected_output:
  type: markdown_patch
  files:
    - README.md
    - README.md

completion_criteria:
  - id: CC-01
    condition: "Both files describe V1 as a Local Artifact Workflow."
  - id: CC-02
    condition: "Both files include Structured Handoff and Result Basic."

validation_required:
  - id: VAL-01
    type: command
    value: "git diff --check"
  - id: VAL-02
    type: review
    value: "Terminology is consistent across both files."

return_contract:
  result_type: result-basic
  result_schema_version: "1.0"
  additional_required_fields: []

repository_context:
  repository_root: /Users/work/Github/oh-my-ai
  repository_name: oh-my-ai
  branch: master
  commit: unknown
  worktree_state: unknown

created_at: 2026-07-14T18:00:00+09:00
created_by: user
review_state: approved
reviewed_by: user
reviewed_at: 2026-07-14T18:30:00+09:00
review_notes:
  - "Scope confirmed."
  - "GitHub access prohibited."
```

---

## 42. Bad Example

```yaml
goal: Improve the project
scope:
  - everything
confirmed_facts:
  - statement: "The runtime supports all features."
    source: null
expected_output: Fix it
review_state: approved
```

문제:

```text
Goal이 불명확
Scope가 과도함
Fact 출처 없음
Allowed / Prohibited Action 없음
Do Not Touch 없음
Assumption / Open Issue 없음
Completion Criteria 없음
Validation 없음
Return Contract 없음
승인 근거 없음
```

---

# Part XI. Non-goals

## 43. V1 비목표

```text
Task Database
Managed Handoff Entity
Public v1.0.0의 Automatic Prompt Delivery
DEC-062 Contract 밖의 추정 기반 Automatic Prompt Delivery
Provider Session Binding
Automatic Result Collection
Writer Lease
Distributed Lock
Cloud Sync
Organization Approval Workflow
Billing / Entitlement
```

---

## 44. 채택하지 않는 방향

### Handoff를 자유형 Prompt로만 관리

필수 Contract와 Validation이 필요하다.

### Work-start와 Handoff를 동일 Artifact로 통합

Candidate Seed와 승인된 Contract를 구분한다.

### Runtime별 Handoff를 각각 Canonical로 관리

Runtime-neutral Contract를 Canonical로 유지한다.

### 승인 전 자동 Export

Human Review Gate를 유지한다.

### Worker가 Scope를 자율 확장

Deviation을 보고하고 추가 승인을 받아야 한다.

---

# Part XII. Open Decisions

## 45. 미결정 사항

1. Handoff 기본 파일명
2. Markdown과 YAML 병행 여부
3. JSON Schema 사용 여부
4. `handoff_ref` 정확한 형식
5. Artifact Version 보관 방식
6. Review UI 형식
7. Expiration 판단 기준
8. Commit 변경 시 자동 Expire 여부
9. Generic / Claude / Codex 출력 파일 경로
10. Capability 불일치 시 기본 처리
11. Handoff Split UX
12. Superseded Artifact 보관 기간
13. Project Context Promotion 연결 방식
14. Validation Command Allowlist

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 46. 불변조건

1. Handoff는 승인된 Task Contract다.
2. Handoff는 Runtime-neutral 의미를 가진다.
3. Runtime별 문서는 Projection이다.
4. Work-start Candidate와 Handoff를 구분한다.
5. Handoff와 Result를 구분한다.
6. Handoff와 Project Context를 구분한다.
7. 승인 전 Export·실행하지 않는다.
8. Fact·Decision·Assumption·Open Issue를 분리한다.
9. Scope와 Do Not Touch를 명시한다.
10. Completion Criteria와 Validation을 명시한다.
11. Result Basic Return Contract를 포함한다.
12. Worker는 Scope를 임의 확장하지 않는다.
13. Scope 이탈은 Result에서 보고한다.
14. Runtime Capability를 과장하지 않는다.
15. Export는 작업 성공을 의미하지 않는다.
16. Handoff는 Cloud 없이 생성·검수·전달 가능하다.
17. Managed Task ID는 V1 비범위다.
18. Validation 실패 Handoff를 Export하지 않는다.

---

## 47. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/contracts/work-start-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/pending-handoff-rehydration-contract.md
docs/architecture/local-cloud-human-boundary.md
docs/testing/v1-fixture-plan.md
```

---

## 48. 검수 관점

### 제품

- Handoff가 V1 사용자 가치를 직접 지원하는가
- Local-only와 Human-controlled 원칙이 유지되는가
- 단일 Runtime으로 사용 가능한가
- V2 Managed Workflow 개념이 유입되지 않았는가

### Contract

- 필수 필드가 충분한가
- 책임 경계가 명확한가
- 승인·만료·대체 상태가 충분한가
- Result Basic 반환을 강제할 수 있는가

### Truthfulness

- Fact·Decision·Assumption·Open Issue가 분리되는가
- 확인하지 못한 Repository 값에 `unknown`을 사용할 수 있는가
- Worker가 Scope 이탈을 숨기지 못하는가

### 구현

- 현재 handoff-prompt 자산을 Adapt할 수 있는가
- Generic Contract와 Runtime Projection을 분리할 수 있는가
- Validation·Review·Export 흐름을 구현할 수 있는가

### 안전

- 승인 전 실행을 막는가
- Prohibited Actions와 Do Not Touch가 충분한가
- Capability 불일치가 안전하게 처리되는가
