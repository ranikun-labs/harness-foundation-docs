---
title: Result Basic Contract
status: draft
implementation_status: missing
owner: development
last_reviewed: 2026-07-14
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
  - docs/product/development-harness-report.md
  - docs/architecture/local-cloud-human-boundary.md
---

# Result Basic Contract

## 1. 문서 목적

이 문서는 `oh-my-ai` V1에서 Worker Runtime이 반환하는 기본 결과 Artifact 계약을 정의한다.

Result Basic의 목적은 Worker 응답을 자동 Truth로 받아들이는 것이 아니다.

정확한 목적은 다음과 같다.

```text
Worker Output
→ Structured Evidence Candidate
→ Human Review
```

V1에서는 Worker가 Result Basic을 수동 Markdown 형식으로 반환하고, 사용자가 Validation / Risk를 Human Review한다.

Result Basic은 다음을 명확히 분리한다.

```text
수행한 작업
읽은 파일
변경한 파일
실행한 명령
실제로 수행한 검증
수행하지 않은 검증
발견한 사실
가정
Scope 이탈
남은 위험
차단 사유
```

이 문서는 Result를 Cloud Entity, 자동 저장 결과, 자동 감지 결과, 자동 승인 결과, Canonical Project Context로 확장하지 않는다.

---

## 2. 책임 경계

## 2.1 Result Basic이 소유하는 책임

```text
Handoff와 결과 상관관계
작업 상태 표현
수행 내용 요약
Evidence 정리
Files Read / Changed 분리
Commands Run 기록
Validation 수행·미수행 분리
Scope Deviation 표시
Remaining Risk 표시
Partial / Failed / Blocked 표시
Human Review 입력 제공
수동 Evidence Candidate 제공
```

## 2.2 Result Basic이 소유하지 않는 책임

```text
Result 자동 승인
Result 자동 저장
Result 자동 감지
Task / Result Correlation
Completion Detection
Review Queue
Canonical Truth 승격
Project Context 자동 수정
Context Promotion
Repository 자동 반영
Commit
Push
PR 생성
SessionBinding
Managed Result Return
Managed Result ID
Cloud 저장
Billing / Entitlement
Worker 성능 평가
```

## 2.3 다른 Contract와의 관계

```text
Work-start
= Context·Skill·Risk Candidate와 Handoff Seed

Handoff
= Human-approved Task Contract

Result Basic
= Worker가 반환하는 Evidence Candidate

Project Context
= Human-confirmed Durable Context
```

---

## 3. V1 불변조건

1. Result Basic은 Candidate다.
2. Human Review 전 Canonical Truth가 아니다.
3. `complete`는 모든 검증 성공을 의미하지 않는다.
4. 수행하지 않은 검증을 Pass로 기록하지 않는다.
5. `files_read`와 `files_changed`를 분리한다.
6. 명령 실행과 검증 수행을 분리한다.
7. Partial 작업을 Complete로 기록하지 않는다.
8. Scope 밖 작업을 숨기지 않는다.
9. Worker가 Handoff 결정을 임의로 변경하지 않는다.
10. 확인하지 못한 내용을 Fact로 기록하지 않는다.
11. Result가 없거나 손상됐다고 작업 성공으로 기록하지 않는다.
12. Cloud·Auth 없이 작성·검수·반영할 수 있어야 한다.
13. 단일 Runtime으로 사용할 수 있어야 한다.
14. Result Basic은 Human Review 전 canonical Truth, 완료 증명, 자동 승인, Repository Apply 허가, Context Promotion 허가가 아니다.
15. Result Basic Contract는 Result Channel, Task Correlation, Completion Detection, Review Queue, Context Import와 동일하지 않다.

---

# Part I. Identity and Lifecycle

## 4. Result Identity

V1 Result Basic은 Local Artifact다.

필수 참조:

```text
result_ref
source_handoff_ref
```

의미:

```text
result_ref
= Local Result Artifact 식별자

source_handoff_ref
= 이 Result가 파생된 Local Handoff Artifact 참조
```

두 값은 다음이 아니다.

```text
Managed Task ID
ExecutionRun ID
SessionBinding ID
Cloud Entity ID
Global Result ID
```

권장 형식:

```text
result-YYYYMMDD-HHMMSS-short-slug
```

예:

```text
result-20260714-194500-readme-v1-alignment
```

---

## 5. Result 상태

Result Basic은 다음 상태 축을 분리한다.

### Execution Status

```text
complete
partial
failed
blocked
```

| 상태 | 의미 |
|---|---|
| complete | Handoff의 필수 Completion Criteria와 필수 Validation을 충족 |
| partial | 사용 가능한 일부 산출물이 있으나 일부 기준 또는 검증이 미완료 |
| failed | 작업을 시도했으나 핵심 산출물이 없거나 유효하지 않음 |
| blocked | 외부 결정·권한·환경·Context 부족으로 핵심 산출물을 만들 수 없음 |

### Receipt Status

```text
received
missing
```

### Contract Validation Status

```text
valid
invalid
incomplete
conflicting
```

### Parse Status

```text
complete
partial
failed
not_applicable
```

### Artifact Write Status

```text
written
failed
not_applicable
```

주의:

```text
execution_execution_status: complete
≠ Human-approved
≠ Repository applied
```

최종 수용 여부는 Human Review가 결정한다.

---

## 6. Review 상태

```text
not_reviewed
changes_requested
accepted
edited_and_accepted
rejected
deferred
```

의미:

| 상태 | 의미 |
|---|---|
| not_reviewed | 아직 검수하지 않음 |
| changes_requested | 보완 결과 필요 |
| accepted | 결과를 그대로 수용 |
| edited_and_accepted | 사람이 수정 후 수용 |
| rejected | 결과 폐기 |
| deferred | 판단 보류 |

Worker Runtime이 Result를 생성할 때 설정할 수 있는 `review_state`는 `not_reviewed`뿐이다.

다음 상태 전이는 Human Reviewer만 수행할 수 있다.

```text
changes_requested
accepted
edited_and_accepted
rejected
deferred
```

`accepted`는 자동 Repository 반영을 의미하지 않는다.

---

## 7. Version

필수 필드:

```text
schema_version
artifact_version
```

구분:

```text
schema_version
= Result Contract 구조 버전

artifact_version
= 동일 Result Artifact의 수정 버전
```

Human Edit가 발생하면 다음을 보존한다.

```text
previous_artifact_version
edit_summary
edited_by
edited_at
```

Worker 원본을 조용히 덮어쓰지 않는다.

---

# Part II. Required Fields

## 8. 필수 필드

```text
schema_version
artifact_version
result_ref
source_handoff_ref
execution_status
receipt_status
contract_validation_status
parse_status
artifact_write_status
sensitive_data_status
title
summary
what_was_done
findings
evidence
files_read
files_changed
commands_run
side_effects
validation_performed
validation_not_performed
validation_results
completion_criteria_results
assumptions
open_issues
unresolved_risks
deviations_from_scope
blocked_reasons
recommended_next_action
runtime_context
created_at
created_by
review_state
```

상태에 따라 빈 배열을 허용하지만, 필드를 생략하지 않는다.

```yaml
files_changed: []
validation_not_performed: []
deviations_from_scope: []
```

누락과 빈 결과를 구분한다.

---

## 9. Title and Summary

`title`은 Handoff 작업과 결과를 식별하는 짧은 이름이다.

`summary`는 결과 전체를 3~7문장 이내로 요약한다.

Summary는 다음을 포함한다.

```text
무엇을 수행했는가
현재 상태는 무엇인가
핵심 검증 결과는 무엇인가
남은 위험이 있는가
```

Summary에서 세부 Evidence를 대체하지 않는다.

---

## 10. What Was Done

실제로 수행한 작업만 기록한다.

예:

```text
README와 README.md의 V1 설명을 수정했다.
두 문서의 Handoff·Result·Human Review 용어를 정렬했다.
```

금지:

```text
계획한 작업
추정한 작업
수행 여부를 확인하지 못한 작업
```

---

# Part III. Findings and Evidence

## 11. Findings

작업 중 발견한 내용을 구조화한다.

각 Finding:

```text
finding_id
statement
finding_type
confidence
verification_status
source_refs
inference_basis
impact
```

허용 `verification_status`:

```text
verified
not_verified
worker_claim_only
evidence_unavailable
```

규칙:

```text
finding_type: observed
→ verification_status: verified
→ 최소 1개 유효 Evidence Reference 필수

finding_type: inferred
→ 관찰 Evidence Reference와 inference_basis 필수

finding_type: decision_needed
→ Worker가 Confirmed Decision으로 승격할 수 없음
```

권장 `finding_type`:

```text
observed
inferred
conflict
gap
risk
decision_needed
```

예:

```yaml
- finding_id: F-01
  statement: "README는 Result Basic을 V1 흐름에 포함하지 않았다."
  finding_type: observed
  confidence: high
  source_refs:
    - type: file
      value: README.md
  impact: "Public product definition drift"
```

`inferred`는 관찰된 Fact와 구분한다.

---

## 12. Evidence

Evidence는 Result 주장을 검토할 수 있게 하는 참조다.

허용 Evidence 유형:

```text
file
file_range
diff
command
command_output
validation_result
test_result
log_fragment
user_input
handoff_field
```

각 Evidence:

```text
evidence_id
type
reference
description
captured_at
redaction_status
```

예:

```yaml
- evidence_id: E-01
  type: file
  reference: README.md
  description: "V1 product description before edit"
  captured_at: 2026-07-14T19:10:00+09:00
  redaction_status: not_required
```

Evidence 원문 전체를 Result에 복제할 필요는 없다.

민감 정보는 원문 대신 redacted reference만 기록한다.

Evidence 무결성 규칙:

```text
모든 evidence_id는 Result 내에서 유일
모든 evidence_ref / evidence_refs는 존재하는 evidence_id를 참조
observed Finding은 Evidence를 반드시 참조
passed / failed / inconclusive Validation은 Evidence를 반드시 참조
completion status met은 Evidence를 반드시 참조
dangling reference와 duplicate evidence_id는 invalid
```

---

## 13. Evidence 최소 규칙

다음 주장은 Evidence 참조가 필요하다.

```text
파일을 읽었다
파일을 수정했다
명령을 실행했다
검증이 통과했다
검증이 실패했다
Repository 상태를 확인했다
기존 문서와 충돌을 발견했다
```

Evidence가 없으면 해당 Finding의 `verification_status`를 다음 중 하나로 기록한다.

```text
not_verified
worker_claim_only
evidence_unavailable
```

Worker Claim만으로 Human Review가 Pass를 확정해서는 안 된다.

---

# Part IV. Files and Commands

## 14. Files Read

`files_read`는 실제로 내용을 확인한 파일이다.

각 항목:

```text
path
purpose
evidence_ref
```

예:

```yaml
files_read:
  - path: README.md
    purpose: "Current product definition review"
    evidence_ref: E-01
```

파일명을 후보로 검색했지만 읽지 않은 경우 포함하지 않는다.

---

## 15. Files Changed

`files_changed`는 실제 변경한 파일이다.

각 항목:

```text
path
change_type
summary
evidence_ref
```

허용 `change_type`:

```text
created
modified
deleted
renamed
```

예:

```yaml
files_changed:
  - path: README.md
    change_type: modified
    summary: "Aligned V1 product definition"
    evidence_ref: E-02
```

읽기만 한 파일은 `files_changed`에 넣지 않는다.

---

## 16. Commands Run

실제로 실행한 명령만 기록한다.

각 항목:

```text
command
working_directory
purpose
exit_code
evidence_ref
redaction_status
```

`command`에는 Secret이 제거된 표시용 명령만 기록한다.

Raw Command에 Secret·Credential·Token이 포함된 경우 Result Artifact에 원문을 저장하지 않는다.

허용 `redaction_status`:

```text
not_required
redacted
omitted_sensitive
```

예:

```yaml
commands_run:
  - command: "git diff --check"
    working_directory: "/Users/work/Github/oh-my-ai"
    purpose: "Whitespace validation"
    exit_code: 0
    evidence_ref: E-03
```

명령을 제안만 했다면 기록하지 않는다.

---

## 17. Side Effects

명령 또는 Tool이 다음을 변경했다면 기록한다.

```text
files
git_index
branch
commit
remote
dependencies
external_service
```

Top-level 필드:

```text
side_effects
```

기본 구조:

```yaml
side_effects:
  files: []
  git_index: unchanged
  branch: unchanged
  commit: none
  remote: unchanged
  dependencies: unchanged
  external_service: none
```

확인하지 못한 값은 `unknown`으로 유지한다.

확인하지 못하면 `unknown`으로 기록한다.

---

# Part V. Validation

## 18. Validation Performed

실제로 수행한 검증이다.

각 항목:

```text
validation_id
type
description
command_or_method
status
evidence_ref
```

허용 `status`:

```text
passed
failed
inconclusive
```

예:

```yaml
side_effects:
  files:
    - README.md
    - README.md
  git_index: unchanged
  branch: unchanged
  commit: none
  remote: unchanged
  dependencies: unchanged
  external_service: none

validation_performed:
  - validation_id: VAL-01
    type: command
    description: "Whitespace and patch formatting"
    command_or_method: "git diff --check"
    status: passed
    evidence_ref: E-03
```

---

## 19. Validation Not Performed

요구됐지만 수행하지 못했거나 의도적으로 생략한 검증이다.

각 항목:

```text
validation_id
description
reason
impact
recommended_follow_up
```

권장 `reason`:

```text
tool_unavailable
environment_unavailable
permission_missing
out_of_scope
not_requested
time_constraint
external_dependency
unknown
```

예:

```yaml
validation_not_performed:
  - validation_id: VAL-02
    description: "Markdown link validation"
    reason: tool_unavailable
    impact: "Broken relative links may remain"
    recommended_follow_up: "Run markdown link checker before release"
```

빈 목록이면 명시한다.

```yaml
validation_not_performed: []
```

---

## 20. Validation Results

Handoff의 각 Validation 요구와 Result를 연결한다.

```text
validation_results
```

`validation_performed`와 `validation_not_performed`는 실제 수행 Detail과 Evidence를 소유한다.

`validation_results`는 Handoff Validation ID별 Coverage Index다.

각 항목:

```text
handoff_validation_id
result
detail_ref
notes
```

규칙:

```text
Handoff의 각 Validation ID는 정확히 한 번 매핑
고아 Validation Result 금지
동일 ID 중복 금지
result와 detail_ref가 가리키는 상태 일치
passed / failed / inconclusive는 Evidence 필수
not_performed / blocked / not_applicable는 이유 필수
```

허용 결과:

```text
passed
failed
not_performed
blocked
not_applicable
```

---

## 21. Validation Truthfulness

금지:

```text
명령 Exit Code만 보고 전체 기능 Pass 선언
테스트 일부만 실행하고 전체 Suite Pass 선언
검증 미수행을 Pass로 기록
수동 확인을 자동 테스트로 기록
Output 미확인을 성공으로 기록
```

검증 범위를 정확히 기록한다.

---

# Part VI. Completion Criteria

## 22. Completion Criteria Results

Handoff의 각 Completion Criteria를 Result와 연결한다.

각 항목:

```text
completion_criteria_id
status
evidence_refs
notes
```

허용 상태:

```text
met
partially_met
not_met
blocked
not_evaluated
```

Coverage 규칙:

```text
Handoff의 모든 Completion Criteria ID가 Result에 정확히 한 번 존재
Result에 Handoff에 없는 Criteria ID 추가 금지
met는 Evidence 필수
partially_met / not_met / blocked / not_evaluated는 notes 또는 reason 필수
```

예:

```yaml
completion_criteria_results:
  - completion_criteria_id: CC-01
    status: met
    evidence_refs:
      - E-02
  - completion_criteria_id: CC-02
    status: partially_met
    evidence_refs:
      - E-04
    notes: "README aligned; harness-design still needs terminology cleanup."
```

---

## 23. Result 상태 계산 원칙

`execution_status: complete`:

```text
모든 필수 Completion Criteria가 met
모든 필수 Validation이 passed 또는 not_applicable
Material Scope Deviation 없음
Blocker 없음
```

`execution_status: partial`:

```text
사용 가능한 일부 산출물이 존재
하나 이상의 필수 Criteria 또는 Validation이 미완료
```

`execution_status: failed`:

```text
작업을 시도했으나 핵심 산출물이 없거나 유효하지 않음
필수 Validation 실패로 산출물을 사용할 수 없음
```

`execution_status: blocked`:

```text
외부 권한·결정·환경·Context 부족으로
사용 가능한 핵심 산출물을 만들 수 없음
```

사용 가능한 부분 산출물이 있고 추가 진행만 차단됐다면:

```text
execution_status: partial
blocked_reasons: [...]
```

Worker가 상태를 제안하지만 Human Review가 최종 수용 여부를 결정한다.

---

# Part VII. Assumptions, Risks, and Deviations

## 24. Assumptions

Result에서 사용한 미검증 전제다.

각 항목:

```text
statement
source
validation_status
impact_if_false
```

Handoff에 없던 새 Assumption은 명시적으로 표시한다.

```text
introduced_during_execution: true
```

---

## 25. Open Issues

작업 이후에도 해결되지 않은 문제다.

각 항목:

```text
issue
impact
decision_needed
recommended_owner
```

Worker가 임의 결정하지 않은 사항을 남긴다.

---

## 26. Unresolved Risks

남아 있는 위험이다.

각 항목:

```text
risk_type
description
severity_candidate
evidence_refs
mitigation
```

`severity_candidate`는 Human Review를 위한 우선순위 후보다.

최종 Risk Acceptance가 아니다.

---

## 27. Deviations From Scope

Handoff Scope 또는 지시에서 벗어난 행동이다.

각 항목:

```text
deviation
reason
impact
files_or_actions
approval_status
```

허용 `approval_status`:

```text
pre_approved
approved_during_execution
not_approved
unknown
```

`pre_approved` 또는 `approved_during_execution`이면 다음을 추가로 요구한다.

```text
approved_by
approved_at
approval_ref
```

Scope 이탈이 없으면 명시한다.

```yaml
deviations_from_scope: []
```

숨기거나 일반 요약에 묻지 않는다.

---

## 28. Blocked Reasons

`status: blocked` 또는 부분 차단 사유다.

각 항목:

```text
blocker_type
description
required_decision
required_access
recommended_next_action
```

예:

```yaml
blocked_reasons:
  - blocker_type: missing_decision
    description: "Migration 안내 포함 여부가 미결정"
    required_decision: "Product owner decision"
    required_access: null
    recommended_next_action: "Resolve open decision before documentation patch"
```

---

# Part VIII. Runtime Context and Provenance

## 29. Runtime Context

권장 필드:

```text
runtime_name
runtime_version
execution_mode
working_directory
repository_root
observed_branch
observed_commit
worktree_state
started_at
finished_at
```

확인하지 못한 값은 `unknown`으로 기록한다.

사용자 Hint를 Observed Value로 기록하지 않는다.

---

## 30. Provenance

Result 전체는 최소 다음 Provenance를 가진다.

```text
source_handoff_ref
runtime_context
created_by
created_at
```

각 Finding, Evidence, Validation은 개별 Source Reference를 가질 수 있어야 한다.

---

## 31. Sensitive Data

Result에 기록하지 않는 것:

```text
Secret 원문
API Key
Private Key
Credential
.env 값
민감 Prompt 원문
대용량 Raw Log 전체
```

가능한 대체:

```text
redacted identifier
hash
source category
line range
short safe fragment
```

Sensitive Data 검사 결과:

```text
passed
violation_detected
not_checked
```

`violation_detected` 또는 `not_checked` 상태의 Result는 Human Review에서 위험으로 표시해야 한다.

Secret-like Value가 발견되면:

```text
원문 재복제 금지
Redaction 후보 생성
Redaction 후 Contract 재검증
```

---

# Part IX. Human Review

## 32. Review 필수 항목

사용자는 최소 다음을 검토한다.

```text
Result 상태가 타당한가
What Was Done이 Evidence와 일치하는가
Files Read / Changed가 정확한가
Commands Run이 실제 실행됐는가
Validation Performed가 증명되는가
Validation Not Performed가 숨겨지지 않았는가
Completion Criteria 판정이 타당한가
Scope Deviation이 있는가
Remaining Risk가 있는가
Worker Claim을 Fact로 오인하지 않았는가
```

---

## 33. Review Action

```text
accept_result
edit_result
request_changes
reject_result
defer_review
```

의미:

```text
accept_result
= Result Candidate를 수용

edit_result
= 사람이 수정한 뒤 수용

request_changes
= Worker 보완 필요

reject_result
= 결과 폐기

defer_review
= 판단 보류
```

`accept_result`는 Commit·Push·Project Context Promotion을 자동 승인하지 않는다.

---

## 34. Human Edit

Human Edit 시 다음을 보존한다.

```text
worker_original_ref
edited_fields
edit_reason
edited_by
edited_at
```

Human Edit는 `artifact_version`을 증가시킨다.

Worker 원본 Artifact Version은 immutable reference로 보존한다.

Human Reviewer도 Evidence 없이 Worker Claim을 `verified` 또는 `passed`로 변경할 수 없다.

---

## 35. Review Outcome

항상 필수:

```text
review_state
```

`review_state: not_reviewed`인 경우 다음 필드는 비어 있을 수 있다.

```text
reviewed_by
reviewed_at
review_notes
accepted_evidence_refs
rejected_claims
```

`review_state`가 다음 중 하나이면 `reviewed_by`, `reviewed_at`이 필수다.

```text
changes_requested
accepted
edited_and_accepted
rejected
deferred
```

`accepted` 또는 `edited_and_accepted`이면 다음을 명시한다.

```text
accepted_evidence_refs
rejected_claims
```

빈 목록은 허용하지만 필드를 생략하지 않는다.

예:

```yaml
review_state: edited_and_accepted
reviewed_by: user
reviewed_at: 2026-07-14T20:10:00+09:00
review_notes:
  - "Validation scope corrected."
rejected_claims:
  - "All documentation links passed"
```

---

# Part X. Managed Result Return Boundary

V1 P0의 Result Basic Format은 수동 Artifact Contract다.
Managed Result Return은 V2 저장·감지·연결·완료 인식·Queue·Import 기능이다.

Result Basic은 다음과 동일하지 않다.

```text
자동 Result 저장
자동 Result 감지
Task / Result Correlation
Completion Detection
Review Queue
Manual Import 관리 기능
Context Promotion
```

## 36. Import 대상

V2 Managed Workflow 또는 별도 Human Gate 이후 다음 후보를 다룰 수 있다.

```text
Main Session Summary
Repository Patch
Decision Candidate
Project Context Promotion Candidate
Follow-up Handoff
Issue / Backlog Candidate
```

모든 항목을 자동 반영하지 않는다.

---

## 37. Import 조건

다음 조건은 V1 P0 Release Gate가 아니라 V2 Managed Result Return 또는 별도 Review Gate의 후보 조건이다.

```text
review_state가 accepted 또는 edited_and_accepted
receipt_status가 received
contract_validation_status가 valid
parse_status가 complete 또는 not_applicable
sensitive_data_status가 passed
Import 유형과 반영 범위를 Human이 명시적으로 선택
Rejected Claim과 미승인 Evidence 제외
```

`accept_result`는 Result Candidate 수용만 의미하며 V1 P0의 전용 UX 요구가 아니다.

다음 승인은 별도다.

```text
Repository Patch 적용
Commit
Push
Project Context Promotion
```

---

## 38. Project Context Promotion

Result 전체를 Project Context로 승격하지 않는다.

Promotion 후보:

```text
Confirmed Decision
Durable Constraint
Long-lived Fact
Stable Repository Convention
```

Promotion 금지:

```text
Temporary Task State
Worker Assumption
Unverified Finding
Rejected Claim
Transient Error
Raw Validation Output
```

Promotion 흐름:

```text
Result Candidate
→ Human Review
→ Promotion Candidate
→ Conflict Check
→ Explicit Approval
→ Project Context
```

기존 Durable Context와 충돌하면 자동 덮어쓰지 않는다.

---

## 39. Repository 반영

Result가 Patch 또는 파일을 포함해도 자동 적용하지 않는다.

수동 반영 전 확인:

```text
Scope
Files Changed
Diff
Validation
Dirty Worktree
Do Not Touch
Remaining Risk
```

Result Basic과 Repository Writer를 동일 기능으로 묶지 않는다.

---

# Part XI. Error and Degraded Result

## 40. Missing Result

Worker가 Result Contract를 반환하지 않은 경우:

```text
receipt_status: missing
execution_status: unknown
```

이는 작업 성공이 아니다.

후속 처리:

```text
request_result_basic
manual_reconstruction
reject_execution
```

---

## 41. Invalid Result

다음 경우 Invalid다.

```text
필수 필드 누락
허용되지 않은 status
source_handoff_ref 누락
files_changed와 Evidence 불일치
Validation Pass 주장에 Evidence 없음
Result JSON / YAML 손상
```

상태:

```text
contract_validation_status: invalid
```

Invalid Result를 Import하지 않는다.

---

## 42. Partial Parsing

Runtime 자유 응답에서 일부만 구조화할 수 있는 경우:

```text
parse_status: partial
```

필수 표시:

```text
parsed_fields
missing_fields
unparsed_content_ref
confidence
```

부분 Parsing을 완전한 Result Basic으로 표시하지 않는다.

---

## 43. Artifact Write Failure

Result Artifact를 파일로 저장하지 못하면:

```text
Repository나 다른 파일을 수정하지 않음
가능한 경우 stdout 또는 UI에 구조화된 결과 반환
artifact_write_status: failed
receipt_status: received
전체 성공으로 표시하지 않음
```

---

# Part XII. Validation and Fixture

## 44. Contract Validation

최소 Validation:

```text
필수 필드 존재
허용 status
source_handoff_ref 존재
Result / Handoff Schema Compatibility
Files Read / Changed 분리
Command 구조 유효
Validation 상태 유효
Completion Criteria 연결
Evidence ID 유일성
Evidence Reference 무결성
Handoff Validation ID 전체 매핑
Completion Criteria ID 전체 매핑
Scope Deviation 필드 존재
Review State 유효
Sensitive Data Status 검사
Command Redaction Status 검사
```

---

## 45. Positive Fixture

### Complete Result

```text
모든 Criteria met
필수 Validation passed
Evidence 연결
Scope Deviation 없음
Risk 명시
Human Review 가능
```

### Partial Result

```text
일부 Criteria partially_met
Validation 일부 미수행
Remaining Risk 존재
```

### Blocked Result

```text
작업 미진행
Blocker와 Required Decision 명시
```

---

## 46. Negative Fixture

```text
Missing Result
Invalid status
source_handoff_ref 누락
Files Changed에 읽기 전용 파일 포함
실행하지 않은 명령 기록
Validation 미수행을 passed로 기록
Evidence 없는 Pass 주장
Complete인데 Criteria 일부 not_met
Scope Deviation 누락
Secret-like Value 포함
Rejected Result Import 시도
Result 전체 Project Context 승격 시도
Worker가 review_state: accepted 반환
동일 evidence_id 중복
존재하지 않는 Evidence 참조
Validation Result와 Detail Status 불일치
Handoff Validation ID 누락
Completion Criteria ID 중복·누락
complete인데 required Validation not_performed
complete인데 Material Scope Deviation 존재
Human Edit가 Evidence 없이 Finding을 verified로 변경
accept_result 후 Patch 자동 적용
partial parse 상태에서 Import
Command 원문에 Credential 포함
Scope Deviation 승인자·시각·근거 누락
```

---

## 47. Truthfulness Fixture

다음을 검증한다.

```text
Worker Claim과 Evidence 불일치
Partial을 Complete로 과장
검증 범위를 전체 Suite로 과장
추론을 Observed Finding으로 표시
Unknown Branch·Commit을 임의 생성
Files Read를 Files Changed로 표시
```

---

## 48. Manual E2E Fixture

```text
Structured Handoff Candidate
→ Human Review
→ Manual Copy/Paste
→ Worker Execution
→ Result Basic 수동 반환
→ Human Review
```

검증:

```text
source_handoff_ref 연결
Completion Criteria 결과
Validation 수행·미수행
Scope Deviation
Remaining Risk
수행하지 못한 검증을 Pass로 표시하지 않음
Project Context 자동 승격 없음
```

---

## 49. 완료 조건

Contract 완료:

```text
필수 필드 정의
상태 모델 정의
Evidence Schema 정의
Validation 수행·미수행 분리
Completion Criteria 연결
Scope Deviation 정의
Human Review 정의
Positive / Negative / Truthfulness Fixture 정의
```

Implementation 완료:

```text
Result Candidate 생성
Handoff Reference 연결
수동 Markdown 반환
Human Review
Missing / Invalid / Partial Result 처리
Fixture 통과
```

범용 Result Validator 제품 기능과 Managed Result Return은 V1 P0 완료 조건이 아니다.

---

# Part XIII. Example

## 50. Good Example

```yaml
schema_version: "1.0"
artifact_version: 1
result_ref: result-20260714-194500-readme-v1-alignment
source_handoff_ref: handoff-20260714-183000-readme-v1-alignment
execution_status: partial
receipt_status: received
contract_validation_status: valid
parse_status: complete
artifact_write_status: written
sensitive_data_status: passed
title: Align README with V1 Product Boundary

summary: >
  README의 V1 제품 설명을 Local Artifact Workflow 기준으로 수정했다.
  README.md는 일부 용어만 정렬했으며 추가 검토가 필요하다.
  git diff --check는 통과했고 Markdown link 검증은 수행하지 못했다.

what_was_done:
  - "README의 제품 정의 수정"
  - "README.md의 Handoff/Result 용어 일부 정렬"

findings:
  - finding_id: F-01
    statement: "README에 Result Basic 흐름이 누락돼 있었다."
    finding_type: observed
    confidence: high
    source_refs:
      - E-01
    impact: "Public product definition drift"

evidence:
  - evidence_id: E-01
    type: file
    reference: README.md
    description: "Original product flow"
    captured_at: 2026-07-14T19:10:00+09:00
    redaction_status: not_required
  - evidence_id: E-02
    type: diff
    reference: README.md
    description: "V1 product definition patch"
    captured_at: 2026-07-14T19:30:00+09:00
    redaction_status: not_required
  - evidence_id: E-03
    type: command_output
    reference: "git diff --check"
    description: "Whitespace validation passed"
    captured_at: 2026-07-14T19:40:00+09:00
    redaction_status: not_required
  - evidence_id: E-04
    type: file
    reference: README.md
    description: "Terminology comparison source"
    captured_at: 2026-07-14T19:15:00+09:00
    redaction_status: not_required
  - evidence_id: E-05
    type: diff
    reference: README.md
    description: "Partial terminology alignment patch"
    captured_at: 2026-07-14T19:35:00+09:00
    redaction_status: not_required

files_read:
  - path: README.md
    purpose: "Current product definition review"
    evidence_ref: E-01
  - path: README.md
    purpose: "Terminology comparison"
    evidence_ref: E-04

files_changed:
  - path: README.md
    change_type: modified
    summary: "Added Structured Handoff, Result Basic, Human Review"
    evidence_ref: E-02
  - path: README.md
    change_type: modified
    summary: "Partially aligned terminology"
    evidence_ref: E-05

commands_run:
  - command: "git diff --check"
    working_directory: "/Users/work/Github/oh-my-ai"
    purpose: "Whitespace validation"
    exit_code: 0
    evidence_ref: E-03

validation_performed:
  - validation_id: VAL-01
    type: command
    description: "Whitespace validation"
    command_or_method: "git diff --check"
    status: passed
    evidence_ref: E-03

validation_not_performed:
  - validation_id: VAL-02
    description: "Markdown link validation"
    reason: tool_unavailable
    impact: "Broken links may remain"
    recommended_follow_up: "Run link checker before release"

validation_results:
  - handoff_validation_id: VAL-01
    result: passed
    detail_ref: VAL-01
  - handoff_validation_id: VAL-02
    result: not_performed
    detail_ref: VAL-02

completion_criteria_results:
  - completion_criteria_id: CC-01
    status: met
    evidence_refs:
      - E-02
  - completion_criteria_id: CC-02
    status: partially_met
    evidence_refs:
      - E-05
    notes: "harness-design still needs terminology review"

assumptions:
  - statement: "Current product name remains unchanged."
    source: source_handoff_ref
    validation_status: not_verified
    impact_if_false: "README heading may require another patch"

open_issues:
  - issue: "Migration note requirement remains undecided."
    impact: "Release documentation may be incomplete."
    decision_needed: true
    recommended_owner: product_owner

unresolved_risks:
  - risk_type: documentation_drift
    description: "README and harness-design may still differ in secondary terminology."
    severity_candidate: medium
    evidence_refs:
      - E-05
    mitigation: "Run cross-document terminology review"

deviations_from_scope: []
blocked_reasons: []

recommended_next_action:
  - "Review remaining harness-design terminology"
  - "Run Markdown link validation"

runtime_context:
  runtime_name: codex
  runtime_version: unknown
  execution_mode: patch-with-approval
  working_directory: /Users/work/Github/oh-my-ai
  repository_root: /Users/work/Github/oh-my-ai
  observed_branch: master
  observed_commit: unknown
  worktree_state: dirty
  started_at: 2026-07-14T19:00:00+09:00
  finished_at: 2026-07-14T19:45:00+09:00

created_at: 2026-07-14T19:45:00+09:00
created_by: worker_runtime
review_state: not_reviewed
```

---

## 51. Bad Example

```yaml
status: complete
summary: Everything is fixed and tested.
files_changed:
  - README.md
validation_performed:
  - all tests passed
review_state: accepted
```

문제:

```text
source_handoff_ref 없음
Evidence 없음
Files Read / Changed 구조 없음
실행 명령 없음
검증 범위 없음
Validation Not Performed 없음
Completion Criteria 연결 없음
Scope Deviation 없음
Remaining Risk 없음
Human Review 근거 없음
Worker가 accepted 상태를 직접 기록한 것처럼 보임
```

---

# Part XIV. Non-goals

## 52. V1 비목표

```text
Managed Result Entity
Automatic Result Collection
Automatic Repository Apply
Automatic Project Context Promotion
Worker Score
Cloud Result Store
Organization Review Workflow
Distributed Approval
Billing / Entitlement
```

---

## 53. 채택하지 않는 방향

### 자유형 Worker 응답만 사용

Evidence와 Truthfulness를 검수할 수 없다.

### Complete 상태를 자동 승인으로 사용

Worker 상태와 Human Review를 분리한다.

### 검증 미수행 필드 생략

빈 목록과 누락을 구분한다.

### Result 전체를 Project Context로 승격

Durable 후보만 별도 Promotion한다.

### Files Read와 Changed 통합

변경 사실을 과장할 수 있으므로 분리한다.

---

# Part XV. Open Decisions

## 54. 미결정 사항

1. Result 기본 파일명
2. Markdown·YAML·JSON Schema 병행 여부
3. `result_ref` 정확한 형식
4. Worker 자유 응답에서 Result 변환 방식
5. Evidence Reference 직렬화 형식
6. Human Edit 보관 방식
7. Invalid Result Repair UX
8. Missing Result 재요청 방식
9. Runtime별 Result Projection 필요 여부
10. Manual Import 출력 형식
11. Result Artifact 보관 기간
12. Validation Evidence 크기 제한
13. Log Fragment 저장 제한
14. Result Diff 포함 여부

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 55. 불변조건

1. Result Basic은 Evidence Candidate다.
2. Human Review 전 Canonical Truth가 아니다.
3. Execution, Receipt, Contract Validation, Parse, Artifact Write, Human Review 상태를 분리한다.
4. Complete는 자동 승인이나 Repository 반영을 의미하지 않는다.
5. Files Read와 Files Changed를 분리한다.
6. Validation Performed와 Not Performed를 분리한다.
7. Completion Criteria와 Result를 연결한다.
8. Evidence 없는 Pass 주장을 허용하지 않는다.
9. Partial·Failed·Blocked를 표현할 수 있어야 한다.
10. Scope Deviation을 숨기지 않는다.
11. Unknown Repository 상태를 임의 생성하지 않는다.
12. Secret 원문을 Result에 기록하지 않는다.
13. Result Basic은 Human Review 전 완료 증명이나 Repository Apply 허가가 아니다.
14. Result 전체를 Project Context로 자동 승격하지 않는다.
15. Repository 반영은 별도 Human Gate다.
16. Missing·Invalid Result를 성공으로 처리하지 않는다.
17. Managed Result ID와 Cloud는 V1 비범위다.

---

## 56. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
docs/architecture/local-cloud-human-boundary.md
```

---

## 57. 검수 관점

### 제품

- Result가 V1 사용자 가치를 닫는가
- Local-only와 Human-controlled 원칙이 유지되는가
- 자동 Result 수집이나 자동 반영이 유입되지 않았는가

### Contract

- 상태와 Review 상태가 분리되는가
- Evidence Schema가 충분한가
- Completion Criteria와 Validation 연결이 가능한가
- Partial·Failed·Blocked가 명확한가

### Truthfulness

- 실행하지 않은 검증을 Pass로 표시할 수 없는가
- Worker Claim과 Evidence를 구분할 수 있는가
- Files Read·Changed가 분리되는가
- Scope Deviation과 Remaining Risk가 노출되는가

### Human Review

- Accept·Edit·Reject가 가능한가
- Worker 원본과 Human Edit가 구분되는가
- Accepted Result만 Import 가능한가
- Rejected Claim이 반영되지 않는가

### 구현

- Runtime 자유 응답을 Result Candidate로 변환할 수 있는가
- Missing·Invalid·Partial Result를 처리할 수 있는가
- Positive·Negative·Truthfulness Fixture를 구현할 수 있는가
