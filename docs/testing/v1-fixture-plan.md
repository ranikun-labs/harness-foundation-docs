---
title: V1 Fixture Plan
status: draft
implementation_status: missing
owner: development
last_reviewed: 2026-07-28
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
source_inputs:
  - docs/product/v1-completion-criteria.md
  - docs/contracts/context-checkpoint-guard-contract.md
  - docs/contracts/work-start-contract.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/contracts/execution-policy-contract.md
  - docs/contracts/product-notice-contract.md
  - docs/product/development-harness-report.md
---

# V1 Fixture Plan

## 1. 문서 목적

이 문서는 `oh-my-ai` V1의 Contract와 Local Workflow를 검증하기 위한 Fixture 전략을 정의한다.

Fixture의 목적은 단순 샘플 파일을 제공하는 것이 아니다.

정확한 목적은 다음과 같다.

```text
Contract Requirement
→ Positive / Negative Fixture
→ Deterministic Assertion
→ Release Gate
```

V1 Fixture는 다음을 검증해야 한다.

```text
Work-start Candidate 생성
Skill Routing
Handoff Contract
Structured Handoff Candidate
Manual Copy/Paste
Result Basic
Human Review
Truthfulness
Local-only 경계
```

---

## 2. Fixture 원칙

1. 각 기능은 해당 기능 PR에서 Fixture를 가진다.
2. 마지막 Regression 단계에서 전체 연결을 검증한다.
3. Positive Fixture만으로 완료 처리하지 않는다.
4. Negative Fixture와 Fail-open Fixture를 필수로 둔다.
5. Fixture는 실행 결과를 사람이 해석해야만 Pass되는 구조를 피한다.
6. Fixture ID는 안정적으로 유지한다.
7. Fixture 결과는 Evidence로 참조 가능해야 한다.
8. V1 P0는 Contract Schema, 필수 필드 누락, Scope / Do Not Touch 보존, 미수행 검증의 정직한 표시를 검증한다.
9. 최소 1개 지원 Runtime으로 Manual E2E를 닫는다.
10. Runtime Projection Matrix와 공개 지원 Runtime별 Projection Fixture는 V1 Alpha 품질 범위다.
11. P0 Fixture 실패는 Known Limitation으로 우회하지 않는다.
12. Work-start Runtime Entry Fixture는 Intent Match와 User Consent를 분리한다.
13. Suggestion 상태는 Engine Invocation이나 Artifact 생성을 허용하지 않는다.
14. 공개된 P0 Runtime은 명시적 Entry와 승인 경로를 별도로 검증한다.
12. Cloud, Auth, Billing 없이 실행 가능해야 한다.
13. Secret 원문을 Fixture에 넣지 않는다.
14. 실제 Credential이나 Production Endpoint를 사용하지 않는다.

---

# Part I. Fixture Taxonomy

## 3. Fixture 유형

```text
contract
routing
projection
capability
policy
result
truthfulness
privacy
drift
manual_e2e
installation
documentation
```

---

## 4. Fixture 상태

```text
draft
active
deprecated
retired
```

Fixture 결과:

```text
passed
failed
blocked
error
invalid_fixture
not_applicable
not_run
```

의미:

```text
passed
= Assertion이 기대 결과와 일치

failed
= 피검사 대상의 실제 결과가 기대 결과와 불일치

blocked
= 필수 사전조건이나 Human Checkpoint가 충족되지 않아 실행 중단

error
= Runner 또는 환경 오류

invalid_fixture
= Fixture Schema·Reference·Expected Result 자체가 잘못됨

not_applicable
= 적용 조건에 해당하지 않음

not_run
= 실행하지 않음
```

`blocked`, `error`, `invalid_fixture`, `not_run`을 Pass로 취급하지 않는다.

---

## 5. Fixture ID

권장 형식:

```text
FX-<DOMAIN>-<NUMBER>
```

예:

```text
FX-WS-001
FX-HO-001
FX-RS-001
FX-CAP-001
FX-POL-001
FX-NT-001
FX-E2E-001
```

ID 의미를 변경하지 않는다.

폐기 시:

```text
deprecated
replaced_by
```

를 기록한다.

---

# Part II. Fixture Record Contract

## 6. 필수 필드

```text
schema_version
fixture_id
title
fixture_type
lifecycle_status
priority
requirement_refs
source_contract
applicability
preconditions
environment
runtime_selector
isolation
input
expected_fixture_result
expected_subject_status
expected_output
assertions
forbidden_outcomes
timeout
cleanup
cleanup_assertions
evidence_refs
last_verified_at
notes
```

가장 중요한 분리:

```text
expected_fixture_result
= Fixture 실행 자체의 예상 결과
= 일반적으로 passed

expected_subject_status
= 피검사 Artifact 또는 Workflow의 예상 상태
= invalid, blocked, partial, unavailable 등 가능
```

Negative Fixture에서 피검사 대상이 `invalid`를 반환하는 것은 Fixture 실패가 아니다.

예:

```yaml
expected_fixture_result: passed
expected_subject_status: invalid
```

---

## 7. Fixture 격리

P0 Fixture는 실제 사용자 Repository나 Production 자원을 직접 변경하지 않는다.

필수 원칙:

```text
격리된 Temporary Workspace 또는 전용 Fixture Repository 사용
실제 Credential 사용 금지
Production Endpoint 접근 금지
Cleanup 결과 검증
Cleanup 실패도 Fixture 실패 또는 error로 기록
```

---

## 8. Priority

```text
P0
P1
P2
```

의미:

```text
P0
= V1 Release Blocking

P1
= Release Quality

P2
= Post-V1 또는 선택 개선
```

P0 실패를 P1 Known Limitation으로 이관하지 않는다.

---

## 9. Assertion 구조

각 Assertion:

```text
assertion_id
description
actual_path
operator
expected
normalization
evidence_ref
severity
```

결정성 규칙:

```text
actual_path 문법은 하나로 고정
Operator별 입력 타입과 비교 규칙 정의
동일 입력·동일 환경에서 동일 결과
Fixture 내 assertion_id 유일
P0에서 Severity가 Gate에 미치는 영향 명시
```

허용 Operator:

```text
equals
not_equals
contains
not_contains
exists
not_exists
matches
count_equals
subset_of
all_refs_valid
no_secret_pattern
semantic_equal
```

Operator별 규칙:

```text
matches
→ Regex Dialect와 Flag 고정

subset_of
→ 배열 순서·중복 처리 규칙 고정

all_refs_valid
→ 검증 대상 Registry 또는 Artifact 범위 명시

no_secret_pattern
→ Synthetic Secret Pattern Rule Version 명시

semantic_equal
→ 보호 필드 구조 추출
→ Canonical Normalization
→ 값·범위·금지 강도·필수 여부·반환 의무 비교
```

LLM 또는 사람의 자유형 의미 판단만으로 P0 Pass를 확정하지 않는다.

---

# Part III. Work-start Fixtures

## 10. Positive Work-start

### FX-WS-001 Normal Candidate Generation

입력:

```text
명확한 Task
Repository Root 존재
유효한 Skill Metadata
민감 경로 없음
```

기대:

```text
overall_status = complete
Task Summary 존재
Context Candidates 존재
Skill Candidates 존재
Risk Candidates 존재
Routing Reason 존재
Match Status 존재
Handoff Seed 존재
Excluded Sensitive Inputs 존재
```

### FX-WS-002 Human Review Next Step Display

입력 후보:

```text
작고 명확한 작업
다중 범위 작업
외부 결정 가능성이 있는 작업
불확실한 작업
```

공통 기대:

```text
Direct Handoff 선택지 표시
Plan First 선택지 표시
Gather Context 선택지 표시
사용자가 선택 주체임을 표시
기본 선택 없음
시스템 자동 선택 없음
선택 전 Needs human review 유지
선택 결과로 자동 Workflow 실행 없음
```

External Context Checkpoint 기대:

```text
외부 자료 후보가 수동 확인 항목으로 표시됨
외부 자료 존재를 Fact로 단정하지 않음
Connector 호출 없음
외부 검색 결과처럼 표현하지 않음
```

금지:

```text
다중 모듈 작업이면 Plan First가 정답이라고 판정
외부 문서가 언급되면 Gather Context를 자동 선택
작업 복잡도 자동 확정
Planning Skill 자동 실행
```

현재 Product Repository의 Work-start Fixture는 Positive 문서 작업,
Ambiguous Deploy Negative 작업, Handoff 필수 필드, Human Review,
Result Basic 연결, 권한 임의 생성 방지를 검증한다.

Next Step Fixture는 이를 대체하지 않고 추가 검증으로 정의한다.

---

## 11. Negative Work-start

### FX-WS-010 Empty Task

```text
빈 문자열
→ invalid_input
```

### FX-WS-011 Whitespace-only Task

```text
공백-only
→ invalid_input
```

### FX-WS-012 Repository Not Provided

```text
repository_root 없음
→ repository_context_status = not_provided
→ Generic Work-start Artifact 생성
```

### FX-WS-013 Branch Hint Mismatch

```text
branch_hint != observed_branch
→ Warning
→ observed value를 Fact Candidate로 사용
```

### FX-WS-014 Commit Hint Mismatch

```text
commit_hint != observed_commit
→ Warning
→ Hint를 Confirmed Fact로 사용하지 않음
```

### FX-WS-015 Secret Exclusion

```text
.env, API Key-like Value 존재
→ 원문 직렬화 금지
→ redacted identifier만 허용
```

### FX-WS-016 Unsafe Output

```text
Path Traversal
Symlink Escape
Tracked File Overwrite
→ 출력 차단
```

### FX-WS-017 Partial Output

```text
Context Discovery 일부 실패
→ overall_status = partial
→ completed_steps / failed_steps / missing_outputs 기록
```

### FX-WS-018 Context Gap

```text
missing_required_context
ambiguous_scope
conflicting_instruction

→ Context Gap 기록
→ 추정값을 Confirmed Fact로 승격 금지
→ 가능한 Generic Handoff Seed 유지
```

### FX-WS-019 Dirty Worktree Risk

```text
Dirty Worktree 관찰
→ risk_candidate = dirty_worktree
→ 기존 변경 수정·폐기 없음
→ Execution Policy 자동 확정 없음
```

### FX-WS-020 Artifact Write Failure

```text
Output Artifact 저장 실패
→ overall_status = partial 또는 failed
→ stdout 또는 UI에 구조화 오류 반환 가능
→ Source Code·Tracked Documentation 수정 없음
```

### FX-WS-021 Conflicting Path Rules

```text
동일 경로가 context_paths와 excluded_paths에 존재
→ conflicting_path_rules
→ 정의된 우선순위 적용
```

---

## 12. Runtime Entry Consent Fixtures

### FX-WS-030 Explicit Invocation

```text
Runtime 사용자 Entry에서 canonical_action_id = work-start를 명시 호출
→ entry_mode = explicit
→ approval = not_required
→ 공통 Work-start Engine 1회 실행 가능
→ Artifact 생성 가능
```

### FX-WS-031 Natural Intent Suggestion

```text
강한 Work-start Intent 자연어 입력
→ entry_mode = suggested
→ approval = pending
→ Suggestion Candidate 표시
→ Engine 호출 없음
→ Artifact 생성 없음
```

### FX-WS-032 Approval

```text
Suggestion Candidate를 사용자가 승인
→ entry_mode = suggested
→ approval = accepted
→ 공통 Work-start Engine 1회 실행 가능
→ Artifact 생성 가능
→ Artifact 경로 표시
```

### FX-WS-033 Decline

```text
Suggestion Candidate를 사용자가 거절
→ approval = declined
→ Engine 호출 없음
→ Artifact 생성 없음
→ 기존 요청 계속
→ 동일 사용자 요청에 재제안 없음
```

### FX-WS-034 Generic Code Task No Suggestion

```text
일반 코드 수정·설명·테스트 요청
→ Work-start Suggestion 없음
→ Engine 호출 없음
→ Artifact 생성 없음
```

### FX-WS-035 Entry Guard Rejection

```text
suggested + pending
suggested + declined
Intent Match without Consent

→ Engine Invocation 거부
→ Artifact 생성 거부
```

### FX-WS-036 Claude Runtime Entry

```text
Claude Code Runtime에서 Work-start 사용자 Entry 노출
→ 명시적 사용자 호출 가능
→ 사용자 호출 전용 Metadata 또는 동등한 보호 존재
→ 자연어 Suggestion 경로가 Engine을 직접 호출하지 않음
→ 승인 전 .oh-my-ai/work-start 신규 Artifact 없음
→ 명시 호출 또는 승인 후 Artifact 생성
→ 결과에 Artifact 경로 표시
→ Human Review Next Step 표시
```

Codex Runtime Entry는 후속 Runtime 범위다.
모든 Runtime을 동시에 지원하는 것은 V1 P0 요구사항이 아니다.

---

# Part IV. Routing Fixtures

## 13. Positive Routing

### FX-RT-001 Exact Match

```text
하나의 Skill이 명확히 Match
→ routing_status = matched
→ 단일 Candidate
```

### FX-RT-002 Ranked Match

```text
복수 후보
→ 결정적 정렬
→ 동일 입력에 동일 결과
```

---

## 14. Negative and Fail-open Routing

### FX-RT-010 No Match

```text
→ routing_status = no_match
→ Generic Handoff Seed
→ 작업 흐름 계속
```

### FX-RT-011 Ambiguous Match

```text
동점 후보
→ ambiguous 상태
→ 자동 실행 금지
```

### FX-RT-012 Broken Index

```text
→ routing_status = unavailable
→ routing_error_code = broken_index
→ 잘못된 Candidate 반환 금지
→ Generic Seed 생성
```

### FX-RT-013 Missing Metadata

```text
일부 Skill Metadata 누락
→ 유효 Skill만 평가
→ 누락 Warning
```

### FX-RT-014 Unsupported Trigger

```text
Consumer가 지원하지 않는 Trigger
→ unsupported_trigger
→ Match로 처리 금지
```

### FX-RT-015 Routing Drift

```text
Skill Metadata Schema Version 변경
Consumer 지원 Trigger 목록 변경
Generated Index Version 불일치

→ routing_status = unavailable 또는 degraded
→ 잘못된 Candidate 생성 금지
```

---

# Part V. Handoff Fixtures

## 15. Positive Handoff

### FX-HO-001 Valid Approved Handoff

필수:

```text
Goal
Scope
Allowed Actions
Prohibited Actions
Do Not Touch
Confirmed Facts with Source
Confirmed Decisions with Authority
Assumptions
Open Issues
Completion Criteria
Validation Requirements
Return Contract
Human Approval
```

기대:

```text
contract_validation_status = valid
review_state = approved
lifecycle_status = approved
```

---

## 16. Negative Handoff

### FX-HO-010 Missing Required Field

```text
Goal 또는 Return Contract 누락
→ incomplete
```

### FX-HO-011 Source-less Confirmed Fact

```text
Confirmed Fact Source 없음
→ invalid
```

### FX-HO-012 Cross-field Conflict

```text
Allowed Action과 Prohibited Action 충돌
Scope와 Do Not Touch 충돌
→ conflicting
```

### FX-HO-013 Approval Before Validation

```text
contract_validation_status != valid
review_state = approved
→ invalid
```

### FX-HO-014 Approved Artifact Modified

```text
Scope 또는 Validation 변경
→ artifact_version 증가
→ 기존 승인 무효화
→ Export 차단
```

### FX-HO-015 Superseded Export

```text
lifecycle_status = superseded
→ Export 차단
```

### FX-HO-016 Non-material Commit Drift

```text
Scope 밖 관련 없는 Commit 증가
→ Warning
→ 자동 expired 금지
```

### FX-HO-017 Material Drift

```text
Scope 대상 파일 또는 Confirmed Fact Source 변경
→ expired
```

### FX-HO-018 Empty versus Missing Do Not Touch

```text
do_not_touch: []
→ valid

do_not_touch 필드 누락
→ incomplete
```

### FX-HO-019 Rejected or Expired Export

```text
lifecycle_status = rejected 또는 expired
→ Export 차단
```

### FX-HO-020 Decision Authority Missing

```text
Confirmed Decision Authority 없음
→ invalid
```

### FX-HO-021 Generator Self-approval

```text
created_by = generator
review_state = approved
reviewed_by 없음
→ invalid
```

---

# Part VI. Runtime Projection Fixtures

이 Part의 Runtime Projection Fixture는 V1 Alpha 품질 범위다. V1 P0 Release Gate는 provider-neutral Structured Handoff Candidate와 Manual Copy/Paste E2E를 요구한다.

## 17. Semantic Preservation

### FX-PRJ-001 Generic to Runtime Projection

보호 필드:

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

기대:

```text
semantic_equal = true
```

---

## 18. Negative Projection

### FX-PRJ-010 Prohibition Removed

```text
Runtime Projection에서 Prohibited Action 삭제
→ failed
```

### FX-PRJ-011 Validation Weakened

```text
Required Validation을 Optional로 변경
→ failed
```

### FX-PRJ-012 Capability Downgrade Alters Meaning

```text
Capability 부족으로 Scope 또는 Completion Criteria 축소
→ Projection 차단
→ 새 Handoff Version과 재승인 필요
```

### FX-PRJ-013 Unsupported Runtime Claimed

```text
Metadata·Fixture 없는 Runtime을 지원한다고 표시
→ failed
```

### FX-PRJ-014 Allowed Action Added

```text
Runtime Projection에서 Allowed Action 추가
→ failed
```

### FX-PRJ-015 Open Issue Removed or Promoted

```text
Open Issue 삭제 또는 Confirmed Decision으로 승격
→ failed
```

---

# Part VII. Capability Fixtures

## 19. Positive Capability

### FX-CAP-001 Supported Capability

```text
Evidence 존재
drift_status = current
Runtime Version Range 충족
→ effective_status = supported
```

### FX-CAP-002 Conditional Capability

```text
기술 조건 존재
조건 충족 가능
→ effective_status = conditional
```

---

## 20. Negative Capability

### FX-CAP-010 Approval Mixed into Capability

```text
Human Approval을 conditions에 기록
→ invalid
```

### FX-CAP-011 Availability Mixed into Capability

```text
Binary 미설치를 unsupported로 기록
→ invalid
```

### FX-CAP-012 Unsupported without Evidence

```text
Source·Evidence 없음
→ unknown으로 강등
```

### FX-CAP-013 Unknown Promoted by Manual Step

```text
검증 Evidence 없음
→ compatible_with_manual_steps 승격 금지
```

### FX-CAP-014 Stale Advertised Support

```text
drift_status = stale
advertised_support = true
→ Gate 실패
```

### FX-CAP-015 Structured Result Overclaim

```text
Freeform만 지원
structured = supported
→ invalid
```

### FX-CAP-016 Authentication Mixed into Capability

```text
현재 인증되지 않음
→ Capability unsupported 기록 금지
→ Availability unavailable 또는 degraded
```

### FX-CAP-017 Missing Requirement Level

```text
Requirement Mapping에 required / optional 없음
→ invalid
```

### FX-CAP-018 Optional Unsupported

```text
Optional Capability unsupported
→ 전체 Handoff incompatible 판정 금지
```

### FX-CAP-019 Match Mode

```text
복수 Capability의 all / any 계산
→ Mapping Contract와 일치
```

---

# Part VIII. Execution Policy Fixtures

## 21. Positive Policy

### FX-POL-001 Read-only Analysis

```text
Capability supported
Policy allowed
Approval 불필요
Availability available
→ ready_candidate
```

### FX-POL-002 Approved File Modify

```text
Capability supported
Policy approval_required
Approval active
Scope 일치
Availability available
→ ready_candidate
```

---

## 22. Negative Policy

### FX-POL-010 Prohibited with Approval

```text
policy_state = prohibited
Approval 존재
→ 실행 차단
```

### FX-POL-011 Approval Scope Escape

```text
Approval Path가 Handoff Scope 밖
→ invalid
```

### FX-POL-012 Handoff Version Mismatch

```text
Policy Version 3
Approval Version 2
→ expired 또는 blocked
```

### FX-POL-013 Worker Self-approval

```text
created_by = generator
review_state = approved
→ invalid
```

### FX-POL-014 Commit / Push / PR Coupling

```text
Commit Approval만 존재
Push 또는 PR 실행
→ blocked
```

### FX-POL-015 Dirty In-scope Worktree

```text
dirty_known_in_scope
Diff Review와 처리 승인 없음
→ Modify 차단
```

### FX-POL-016 Unknown Command Class

```text
Command Class = unknown
→ Shell 실행 금지
```

### FX-POL-017 Result Accept Used as Apply Approval

```text
accept_result만 존재
repository.apply_patch 실행
→ blocked
```

### FX-POL-018 Expired Approval

```text
approval_status = expired
→ 실행 차단
```

### FX-POL-019 Revoked Approval

```text
approval_status = revoked
→ 실행 차단
```

### FX-POL-020 Policy Symlink Escape

```text
승인 Path가 Symlink 해석 후 허용 Root 밖
→ blocked
```

### FX-POL-021 Awaiting Approval

```text
policy_validation_status = valid
approval_required Action 존재
Approval 없음

→ execution_readiness_status = awaiting_approval
→ invalid 또는 ready_candidate로 처리 금지
```

### FX-POL-022 Approval Requirement and Grant Separation

```text
Action Record approval_requirement에 approved_by·approved_at 저장
→ invalid
```

---

# Part IX. Result Basic Fixtures

## 23. Positive Result

### FX-RS-001 Complete Result

```text
모든 필수 Criteria met
모든 필수 Validation passed 또는 not_applicable
Material Scope Deviation 없음
Blocker 없음
→ execution_status = complete
```

### FX-RS-002 Partial Result

```text
사용 가능한 산출물 존재
필수 Criteria 일부 미완료
→ execution_status = partial
```

### FX-RS-003 Blocked Result

```text
핵심 산출물 없음
외부 결정·권한·Context 부족
→ execution_status = blocked
```

### FX-RS-004 Failed Result

```text
작업을 시도했지만 핵심 산출물 생성 실패
또는 필수 Validation 실패로 산출물 사용 불가

→ execution_status = failed
```

---

## 24. Negative Result

### FX-RS-010 Missing Result

```text
receipt_status = missing
execution_status = unknown
```

### FX-RS-011 Worker Self-review

```text
Worker가 review_state = accepted
→ invalid
```

### FX-RS-012 Evidence Dangling Reference

```text
존재하지 않는 Evidence ID 참조
→ invalid
```

### FX-RS-013 Duplicate Evidence ID

```text
동일 Evidence ID 중복
→ invalid
```

### FX-RS-014 Validation Mapping Conflict

```text
validation_results와 Detail 상태 불일치
→ conflicting
```

### FX-RS-015 Completion Coverage Missing

```text
Handoff Criteria ID 일부 누락
→ incomplete
```

### FX-RS-016 Complete with Required Validation Missing

```text
execution_status = complete
필수 Validation not_performed
→ invalid
```

### FX-RS-017 Secret in Command

```text
Credential 포함 Raw Command
→ sensitive_data_status = violation_detected
→ Import 차단
```

### FX-RS-018 Partial Parse Import

```text
parse_status = partial
→ Import 차단
```

### FX-RS-019 Evidence-less Pass

```text
Validation passed 또는 Criteria met
Evidence Reference 없음
→ invalid
```

### FX-RS-020 Scope Deviation Missing

```text
실제 Scope 밖 행동 또는 파일 변경 존재
deviations_from_scope = []

→ invalid
```

### FX-RS-021 Human Edit Provenance

```text
Human Edit 발생
→ artifact_version 증가
→ worker_original_ref 유지
→ edited_fields / edit_reason / reviewer 존재
```

### FX-RS-022 Rejected Result Import

```text
review_state = rejected
→ 모든 Import 차단
```

### FX-RS-023 Accepted but Invalid Result

```text
review_state = accepted
contract_validation_status != valid

→ Import 차단
```

### FX-RS-024 Apply without Separate Approval

```text
accept_result 존재
action.repository.apply_patch Approval 없음

→ Repository Apply 차단
```

---

# Part X. Truthfulness and Privacy Fixtures

## 25. Truthfulness

### FX-TR-001 Observed vs Inferred

```text
Observed Finding
→ Evidence 필수

Inferred Finding
→ Evidence + inference_basis 필수
```

### FX-TR-002 Validation Scope Overclaim

```text
일부 Test만 실행
전체 Suite Passed 주장
→ failed
```

### FX-TR-003 Unknown Repository State

```text
Branch·Commit 확인 불가
→ unknown
→ 임의 값 생성 금지
```

### FX-TR-004 Worker Claim Only

```text
Evidence 없음
→ worker_claim_only
→ verified 승격 금지
```

---

## 26. Privacy

### FX-PRV-001 Secret Pattern

실제 Credential이 아닌 Synthetic Sentinel만 사용한다.

예:

```text
SYNTHETIC_TEST_API_KEY_DO_NOT_USE_12345
-----BEGIN SYNTHETIC TEST PRIVATE KEY-----
```

검증:

```text
API Key-like Value
Private Key Header
Credential
.env Value

→ Artifact 원문 포함 금지
```

### FX-PRV-002 Redaction

```text
Secret-like Value 발견
→ redacted identifier
→ 재검증
```

### FX-PRV-003 Usage Log

V1에서 Usage Log가 활성화된 경우만 P0.

검증:

```text
Task 원문 미저장
Prompt 원문 미저장
Code 원문 미저장
Secret 미저장
Metadata 최소화
```

비활성화 또는 미제공이면:

```text
Not Applicable
```

---

# Part XI. Installation and Documentation Fixtures

## 27. Fresh Install

### FX-INS-001 Clean Environment

```text
Local release archive 또는 전용 Fixture Repository
Offline Install
Doctor
Work-start
Handoff
Projection
Result
```

필수:

```text
Cloud Login 없음
Credential 없음
기본 경로 안전
```

---

## 28. Generated Artifact Drift

Generated Artifact가 V1 실행 경로에 포함되는 경우 P0.

### FX-INS-010 Generated Drift

```text
Source Metadata와 Generated Index 불일치
→ 실패
```

Generated Artifact가 실행 경로에 없으면:

```text
Not Applicable
```

### FX-INS-020 Migration Compatibility

적용 조건:

```text
기존 설치 경로
설정 형식
Hook 구조
Artifact 경로
```

중 하나가 변경된 경우.

검증:

```text
기존 사용자 파일 보존
무단 Overwrite 없음
Migration 실패 상태 표현
수동 복구 절차 존재
변경이 없으면 Not Applicable
```

### FX-INS-021 Remove / Uninstall

```text
설치된 Hook·Generated File 제거
→ 사용자 Source·Artifact 삭제 없음
→ 기존 사용자 설정 무단 제거 없음
```

---

## 29. Documentation Truthfulness

### FX-DOC-001 Quick Start

```text
문서에 표시된 Runtime
→ Advertised Support Gate 통과
→ 실제 Manual E2E 가능
```

### FX-DOC-002 Unsupported Feature Claim

```text
문서에서 지원 표시
Metadata는 unknown 또는 unsupported
→ failed
```

### FX-DOC-003 Good / Bad Examples

모든 Contract는 최소 다음을 가진다.

```text
유효 Good Example
의도적으로 실패하는 Bad Example
```

Good Example 자체가 Contract Validation을 통과해야 한다.

---

# Part XI-A. Product Notice Fixtures

Notice Fixture는 Network Mock 없이 Local Cache와 State 파일 조작만으로 결정적으로 재현한다.

Contract Source는 `docs/contracts/product-notice-contract.md`다.

모든 Notice Fixture는 공통 Assertion을 포함한다.

```text
Work-start exit code 정상
Candidate Artifact 생성 정상
Artifact 내용에 Notice 문자열 없음
```

## 29A. Notice Cache 상태

### FX-NT-001 No Cache

```text
Cache 파일 없음
→ Notice 표시 없음
→ Work-start 정상 완료
→ Refresh 시도됨
```

### FX-NT-002 Valid Cache

```text
유효 Cache, 활성 Notice 1건, TTL 내
→ 출력 말미에 Notice 1건 표시
→ Artifact 불변
→ Refresh 미수행
```

### FX-NT-003 Stale Cache

```text
유효 Cache, TTL 초과
→ 시작 시점 Cache 기준으로 표시
→ 비차단 Refresh 실행
→ Work-start가 Refresh 종료를 대기하지 않음
```

## 29B. Notice Manifest 유효성

### FX-NT-004 Network Failure

```text
Refresh 중 Network 실패
→ 사용자 출력 없음
→ 기존 정상 Cache 보존
→ Work-start exit code 무영향
```

### FX-NT-005 Invalid JSON

```text
Manifest 응답이 Invalid JSON
→ Manifest 전체 무시
→ 기존 Cache 보존
→ 부분 해석 없음
```

### FX-NT-006 Unsupported Schema

```text
알 수 없는 schema_version
→ Manifest 전체 무시
→ 일부 필드도 읽지 않음
→ Unknown을 Supported로 승격하지 않음
```

## 29C. Notice Audience 및 표시 제한

### FX-NT-007 Version Mismatch

```text
Local Version이 Audience 조건 밖
→ 해당 Notice 표시 없음

Local Version 판독 불가
→ Match 판정하지 않음
→ 표시 없음
```

### FX-NT-008 Max Impressions Reached

```text
Impression Count가 상한 도달
→ 표시 없음
→ Impression Count 추가 증가 없음
```

## 29D. Notice 사용자 선택

### FX-NT-009 Dismiss

```text
Notice ID dismiss 상태
→ 해당 Notice 표시 없음
→ 다른 활성 Notice는 표시됨
→ Cache 삭제 후에도 dismiss 유지
```

### FX-NT-010 Opt-out

```text
전체 Opt-out 상태
→ Cache 읽기 없음
→ 표시 없음
→ Refresh 없음
→ Network 호출 없음
```

Network 호출 발생은 Fail이다.

## 29E. Notice 동시성

### FX-NT-011 Concurrent Refresh

```text
동시에 복수 Work-start 실행, 모두 stale
→ Refresh는 1회만 수행
→ Lock 획득 실패 측은 대기 없이 정상 종료
→ Cache 파일이 부분 기록 상태로 읽히지 않음
```

## 29F. Notice 경로 격리

### FX-NT-012 Synthetic Event

```text
Synthetic Event 경로 실행
→ Notice 표시 없음
→ Network 호출 없음
```

동일 Assertion을 다음 경로에 적용한다.

```text
UserPromptSubmit Hook
Natural Suggestion
Worker Session
Result Basic 생성
기본 Doctor 실행
기본 setup.sh 실행
```

## 29G. Notice Artifact 및 표시 시점

### FX-NT-013 Artifact Content Invariance

```text
Notice 있음 / 없음 두 실행
→ Work-start Artifact byte 동일
   (Timestamp 등 실행 고유 필드 제외)
```

### FX-NT-014 Remote Result Not Injected

```text
Refresh가 현재 실행 중 새 Notice 획득
→ 현재 출력에 삽입되지 않음
→ 현재 출력은 시작 시점 Cache 기준과 동일
```

### FX-NT-015 Next-run Visibility

```text
FX-NT-014 이후 다음 명시적 Work-start
→ 새 Notice가 표시됨
```

---

# Part XI-B. Context Checkpoint Guard C-lite Fixtures

이 Part는 DEC-063의 post-v1.0 Public V1.x Gate다. Public `v1.0.0` Baseline Fixture Gate를
소급 변경하지 않으며, 아래 Fixture는 정의 상태다.

```text
implementation: not_verified
fixture_result: not_run
runtime_evidence: not_verified
```

## 29H. Positive and No-activity

### FX-CCG-001 Work-start-independent File Activity

```text
Given:
- Work-start를 실행하지 않은 Session
- Adapter가 지원하는 file_change Signal 1개
- 현재 Epoch 상태 clean

When:
- 다음 지원 Checkpoint Boundary 도달

Expected:
- 상태 review_needed
- Context Significance는 미판정
- Durable Context 변경 없음
```

### FX-CCG-002 No Activity

```text
Given:
- 현재 Epoch에 인식된 Activity Signal 없음

When:
- 지원 Checkpoint Boundary 도달

Expected:
- 상태 clean
- Checkpoint 알림 없음
- Durable Context 변경 없음
```

### FX-CCG-003 Human-approved Checkpoint

```text
Given:
- 상태 review_needed

When:
- 사용자가 project-context Context Checkpoint를 승인·완료하고 확인

Expected:
- resolution checkpointed
- 현재 Epoch 해결
- 다음 Epoch clean
- 같은 Epoch·Boundary에서 재알림 없음
```

### FX-CCG-004 Human-selected No Update

```text
Given:
- 상태 review_needed

When:
- 사용자가 no_update 선택

Expected:
- resolution no_update
- 현재 Epoch 해결
- 다음 Epoch clean
- 같은 Epoch·Boundary에서 재알림 없음
```

`checkpointed`와 `no_update`는 Synthetic Event나 모델 판정으로 만들지 않는다.

### FX-CCG-005 Resolution Reactivation and Event Idempotency

두 Human Review 결과를 같은 Assertion 구조로 검증한다.

```text
Given:
- Case A: 이전 Epoch resolution checkpointed
- Case B: 이전 Epoch resolution no_update

When:
- 해결 이후 실제 새 Activity Signal 발생
- 같은 Activity Event가 중복 또는 동시에 전달됨

Expected:
- 두 Case 모두 새 Epoch에서 review_needed 재진입 가능
- 이전 resolution이 이후 Activity를 영구 억제하지 않음
- 동일 Activity Event는 멱등 처리
- 동일 Epoch의 중복 알림 없음
- 실제 새 Activity Signal은 억제하지 않음
```

### FX-CCG-006 Advisory Session Boundary One-time Review E2E

최소 1개 실제 지원 Runtime에서 수행한다. 다른 Runtime Adapter를 동시에 P0로 강제하지 않는다.

```text
Given:
- Work-start를 실행하지 않은 Session
- Adapter가 관찰 가능한 Activity Signal
- 같은 Repository·Worktree

When:
- 상태 review_needed
- SessionEnd 또는 동등 advisory boundary 도달
- 다음 지원 Session 또는 첫 적절한 Prompt review surface 도달

Expected:
- SessionEnd가 Human Review를 기다리거나 종료를 차단하지 않음
- prior unresolved Epoch의 최소 상태 보존
- 다음 review surface에서 one-time diagnostic
- Context Checkpoint | no_update | 현재 작업 계속 선택 가능
- 안내 또는 현재 작업 계속 선택만으로 자동 해결 없음
- 같은 Session·unresolved Epoch에서 diagnostic 무한 반복 없음
- Durable Context 자동 저장·Promotion 없음
- Structured Handoff Candidate와 DEC-062 Pending 자동 생성 없음
- 이전 Prompt·응답·파일·Diff 원문 전달 없음
- 다른 Repository·Worktree에 diagnostic 노출 없음
```

Evidence는 지원 Runtime과 실제 Session boundary를 식별해야 한다. Foundation 정의 상태에서는
`fixture_result: not_run`, `runtime_evidence: not_verified`를 유지한다.

### FX-CCG-007 State and Runtime Failure Matrix

```text
Given:
- State write 실패 또는 Atomic write / rename 실패
- State Schema 불일치
- Session Identity 식별 실패
- Hook 실행 실패
- 중복·동시 Event를 안전하게 처리할 수 없음

Expected:
- 코드 작업·Session 종료·Handoff·PR·Merge 차단 없음
- availability unavailable
- 자동 Context 저장·Promotion 없음
- clean 허위 판정 없음
- checkpointed / no_update 성공 기록 없음
- 가능한 경우 Manual Context Checkpoint fallback
- 다른 Session·Repository·Worktree 상태 오연결 없음
```

## 29I. Isolation

### FX-CCG-010 Repository Isolation

```text
Given:
- Repository A의 상태 review_needed
- Repository B에서 같은 Runtime·Session 이름으로 Boundary 도달

Expected:
- Repository A 상태를 B에서 사용하지 않음
- B는 자신의 Activity Signal만으로 판정
- Repository 원문 대신 분리된 Local Hash 사용
```

### FX-CCG-011 Worktree Isolation

```text
Given:
- 같은 Repository의 Worktree A 상태 review_needed
- Worktree B에서 Boundary 도달

Expected:
- Worktree A 상태를 B에 혼합하지 않음
- Worktree별 Local Hash와 Epoch 분리
```

## 29J. Fail-open

### FX-CCG-012 Corrupted State

```text
Given:
- State가 손상되어 읽기 불가

Expected:
- 코드 작업·Session 종료·Handoff 차단 없음
- 자동 Context 저장·Promotion 없음
- clean으로 기록하지 않음
- availability unavailable
- 가능한 경우 Manual Context Checkpoint 안내
```

### FX-CCG-013 Unsupported Hook Runtime

```text
Given:
- Runtime이 대상 Hook 또는 Boundary를 지원하지 않음

Expected:
- Runtime의 기존 작업 유지
- 지원한다고 추정하지 않음
- 자동 Context 저장·Promotion 없음
- availability unavailable
- Manual Context Checkpoint fallback
```

## 29K. Handoff Decision Gate

### FX-CCG-014 Unresolved Context before Handoff

```text
Given:
- 상태 review_needed
- Structured Handoff 생성 요청

Expected:
- Context 미해결 경고
- Human Decision Gate 표시
- Context Checkpoint | no_update | Manual Handoff 계속 선택 가능
- 기본 선택·자동 선택 없음
- Guard 상태만으로 Hard Block 없음
- Guard가 별도 Handoff Artifact를 만들지 않음
- Manual Handoff 계속 시 Candidate에 review_needed / unresolved 사실 명시
- Context가 최신이거나 Context Review가 완료됐다고 단정하지 않음
- unresolved 상태 누락 없음
- checkpointed / no_update 자동 전환 없음
```

## 29L. Privacy

### FX-CCG-015 Raw Content Not Stored

Fixture 입력에는 식별 가능한 Synthetic Marker를 사용한다.

```text
Given:
- Prompt, AI 응답, 파일 내용, Code Diff에 서로 다른 Synthetic Marker
- file_change와 validation_run Signal
- promotion_source_ref에 절대 경로·Git Remote·Prompt·Secret Marker 후보

Expected:
- 저장 Metadata에 Signal 종류와 최소 Scope·시각·상태만 존재
- Prompt·응답·파일·Code Diff Marker 0건
- Git Remote·절대 경로·Secret 원문 0건
- promotion_source_ref는 입력을 거부하거나 opaque Local Identifier / Sanitized Reference로 저장
- Promotion Source Reference가 Context·Evidence·사용자 입력 원문을 복제하지 않음
```

---

# Part XII. Manual E2E

## 30. Minimum Single-runtime E2E

### FX-E2E-001 V1 Core Flow

```text
User Task
→ Work-start
→ Skill / Context Candidate
→ Structured Handoff Candidate
→ Human Review
→ 수동 Runtime 전달
→ Worker 수행
→ Result Basic 수동 반환
→ Human Review
```

필수 Assertion:

```text
Cloud 의존 없음
최소 1개 Runtime 사용
Human Review 전 실행 없음
Worker Self-review 없음
Repository 자동 반영 없음
Project Context 자동 승격 없음
Validation 미수행 표현 가능
Scope Deviation 표현 가능
미수행 검증을 Pass로 표시하지 않음
```

Manual Human Checkpoint Evidence:

```text
checkpoint_id
action
artifact_ref
artifact_version
reviewed_by
reviewed_at
outcome
notes
```

이는 Managed Approval Entity가 아니라 Local Fixture Evidence다.

Manual E2E 상태는 다음을 분리한다.

```text
Procedure Defined
Repository-local Steps Verified
Cross-session Worker Step Performed or Not Performed
Actual Full Manual E2E Passed or Not Performed
```

현재 Product Repository 상태:

```text
Manual E2E Procedure: Defined
Repository-local Steps: Verified
Cross-session Worker Step: Not Performed
Actual Full Manual E2E: Not Performed
```

Next Step 경로 후보:

```text
Direct Handoff
→ Candidate 검토
→ Worker Session에 수동 Copy/Paste

Plan First
→ 수동 계획 또는 Planning Skill 수행
→ Reviewed Plan Reference 기록
→ Candidate 재검토

Gather Context
→ 외부 자료 또는 추가 입력 수동 확인
→ Task / Project Context / Handoff 보완
→ Work-start 또는 Handoff 재검토
```

위 경로는 Procedure 후보이며,
자동 Planning, Connector 호출, Runtime Invocation, Managed Workflow를 의미하지 않는다.

---

### FX-E2E-002 Product Notice Flow

Notice는 실행 간 상태 전이를 검증해야 하므로 Manual E2E를 별도로 둔다.

수행 순서:

```text
1. 첫 Work-start
   → Cache 없음
   → Notice 표시 없음
   → Refresh 수행됨

2. 다음 Work-start
   → 이전 실행에서 획득한 Notice 표시

3. Dismiss 후 Work-start
   → 해당 Notice 표시 없음

4. Opt-out 후 Work-start
   → 표시 없음
   → Network 호출 없음

5. Offline 환경 Work-start
   → 정상 완료
   → exit code 정상

6. Candidate Artifact diff 확인
   → Notice 혼입 없음
```

필수 Assertion:

```text
모든 단계에서 Work-start exit code 정상
모든 단계에서 Candidate 생성 정상
4단계에서 Network 호출 관찰 없음
5단계에서 Known Limitation 표기 없이 정상 완료
6단계에서 Artifact diff에 Notice 문자열 없음
```

Manual Human Checkpoint Evidence는 FX-E2E-001과 동일 필드를 사용한다.

현재 상태:

```text
Procedure Defined: Yes
Actual Manual E2E Passed: Not Performed
```

---

## 31. Advertised Runtime E2E

지원 대상으로 공개한 각 Runtime에 대해 별도 수행한다.

```text
Runtime Metadata valid
Manual E2E passed
Known Limitation documented
Quick Start truthful
```

모든 Runtime을 동시에 지원할 필요는 없다.

---

# Part XIII. Regression Matrix

## 32. Matrix

| Domain | Positive | Negative | Fail-open | Drift | E2E |
|---|---:|---:|---:|---:|---:|
| Work-start | ✓ | ✓ | ✓ | ✓ | ✓ |
| Routing | ✓ | ✓ | ✓ | ✓ | ✓ |
| Handoff | ✓ | ✓ |  | ✓ | ✓ |
| Projection | ✓ | ✓ |  | ✓ | ✓ |
| Capability | ✓ | ✓ |  | ✓ | ✓ |
| Policy | ✓ | ✓ |  | ✓ | ✓ |
| Result | ✓ | ✓ |  | ✓ | ✓ |
| Truthfulness | ✓ | ✓ |  |  | ✓ |
| Privacy | ✓ | ✓ |  |  | 조건부 |
| Installation | ✓ | ✓ |  | ✓ | ✓ |
| Documentation | ✓ | ✓ |  | ✓ | ✓ |
| Product Notice | ✓ | ✓ | ✓ |  | ✓ |
| Context Checkpoint Guard (post-v1.0 V1.x) | ✓ | ✓ | ✓ |  | 조건부 |

---

# Part XIV. Release Gate

## 33. P0 Fixture Gate

다음 중 하나라도 실패하면 V1 Release 불가다.

```text
Work-start Positive / Negative
Runtime Entry Explicit / Suggestion / Approval / Decline
Suggestion Before Consent No Artifact
Generic Request No Suggestion
Declined Request No Re-suggestion
Routing Positive / No-match / Broken-index
Handoff Contract Validation
필수 필드 누락 실패
Scope / Do Not Touch 보존
Result Basic Truthfulness
Validation Not Performed 정직한 표시
미수행 검증을 Pass로 표시하지 않음
Secret Exclusion
Fresh Install
Minimum Single-runtime E2E
Good / Bad Artifact Examples
Fixture Schema Validation
Assertion Determinism
Fixture Workspace Isolation
Cleanup Verification
Evidence Reference Integrity
Product Notice Cache / Manifest / Audience / User Choice
Notice Path Isolation
Notice Artifact Invariance
Notice Failure Fail-open
Notice Offline Work-start
```

조건부 P0:

```text
Usage Log Privacy
= Usage Log 활성화 시

Generated Artifact Drift
= Generated Artifact가 실행 경로에 포함될 때

Migration Fixture
= 기존 설치 경로·설정·Artifact 경로 변경 시
```

Release Gate는 Domain 이름만이 아니라 Fixture ID 또는 Suite ID를 참조한다.

예:

```text
P0 Work-start Suite
= FX-WS-001, FX-WS-010~021

P0 Routing Suite
= FX-RT-001~015

P0 Product Notice Suite
= FX-NT-001~015

P0 Product Notice Manual E2E
= FX-E2E-002
```

### 33.1 Post-v1.0 Public V1.x Context Checkpoint Guard Gate

DEC-063 Product 구현 완료를 주장하려면 다음 Suite가 모두 `passed` Evidence를 가져야 한다.

```text
P0 Context Checkpoint Guard Positive / Resolution
= FX-CCG-001~007

P0 Context Checkpoint Guard Isolation / Fail-open / Handoff / Privacy
= FX-CCG-010~015

Minimum one supported Runtime Session Boundary E2E
= FX-CCG-006
```

다음은 Gate 통과가 아니다.

```text
Fixture 정의만 존재
Hook 호출 로그만 존재
State 파일 생성
Manual fallback 표시만 성공
Foundation Contract Merge
```

이 Gate는 Public `v1.0.0` 완료 판정을 소급 변경하지 않는다.

---

## 34. Release Evidence

각 P0 Fixture는 다음을 남긴다.

```text
fixture_id
result
runtime_id
runtime_version
adapter_version
source_revision:
  type: git_commit | package_version | local_snapshot | unknown
  value: <revision>
started_at
finished_at
assertion_results
evidence_refs
unresolved_risks
```

실행하지 않은 Fixture를 Passed로 기록하지 않는다.

---

# Part XV. File Layout

## 35. 권장 구조

```text
fixtures/
├── work-start/
├── routing/
├── handoff/
├── projection/
├── capability/
├── policy/
├── result/
├── truthfulness/
├── privacy/
├── installation/
├── documentation/
├── notice/
└── e2e/
```

각 Fixture 디렉터리:

```text
fixture.yaml
input/
expected/
README.md
```

---

## 36. Generated Result

권장 출력:

```text
fixture-results/
└── <fixture-id>/
    ├── result.yaml
    ├── evidence/
    └── diff/
```

Generated Result는 Source Fixture와 분리한다.

Repository에 Commit할지는 별도 결정이다.

---

# Part XVI. Open Decisions

## 37. 미결정 사항

1. Fixture 실행기 언어
2. YAML / JSON Schema 선택
3. Assertion Engine 구현 방식
4. Fixture Result 보관 위치
5. Evidence 크기 제한
6. Runtime Version Matrix 범위
7. Fixture 병렬 실행 여부
8. OS Matrix 범위
9. Snapshot Update 승인 방식
10. Manual E2E 기록 방식
11. Fixture Result CI 연동 시점
12. Generated Result Commit 여부
13. Contract Schema Validator 공통화
14. Secret Pattern Rule 관리 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 38. 불변조건

1. P0 기능은 P0 Fixture를 가진다.
2. Positive만으로 완료하지 않는다.
3. Negative와 Fail-open을 포함한다.
4. Fixture는 Contract Requirement를 직접 참조한다.
5. Broken 상태를 정상 Match로 위장하지 않는다.
6. Unknown을 Supported·Allowed·Passed로 승격하지 않는다.
7. Secret 원문을 Fixture에 저장하지 않는다.
8. Good Example은 실제 Validation을 통과한다.
9. 최소 1개 Runtime으로 Manual E2E를 닫는다.
10. 공개 지원 Runtime마다 Projection을 검증하는 것은 V1 Alpha 품질 범위다.
11. 모든 Runtime 동시 지원은 V1 필수가 아니다.
12. 수행하지 않은 Fixture를 Passed로 기록하지 않는다.
13. P0 실패를 Known Limitation으로 우회하지 않는다.
14. Cloud 없이 실행 가능해야 한다.
15. Result와 Repository 반영을 자동 연결하지 않는다.
16. Fixture Pass와 피검사 대상 상태를 분리한다.
17. P0 Assertion은 결정적으로 재현 가능해야 한다.
18. Fixture Workspace와 사용자 Repository를 격리한다.
19. Cleanup 실패를 무시하지 않는다.
20. Release Gate는 Fixture ID 또는 Suite ID로 추적 가능해야 한다.
21. Notice Fixture는 실제 Network 없이 Local 상태 조작만으로 재현한다.
22. Notice 실패를 Work-start 실패로 기록하지 않는다.
23. Notice가 Artifact에 혼입되면 Fail로 판정한다.

---

## 39. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/contracts/product-notice-contract.md
docs/contracts/context-checkpoint-guard-contract.md
docs/poc/v2-local-invocation-poc.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

---

## 40. 검수 관점

### Coverage

- 모든 P0 Contract가 Fixture를 가지는가
- Positive·Negative·Fail-open이 균형적인가
- Manual E2E가 전체 Workflow를 닫는가

### Determinism

- 동일 입력에 동일 판정이 가능한가
- 사람이 해석해야만 Pass되는 Assertion이 없는가
- Evidence와 Assertion 결과가 연결되는가

### Truthfulness

- Unknown·Blocked·Not Run을 Pass로 처리하지 않는가
- Capability·Policy·Result 과장을 잡는가
- Good Example 자체가 Validation을 통과하는가

### Safety

- Secret·Path·Dirty Worktree를 검증하는가
- Approval Scope Escape를 막는가
- Result Accept와 Repository Apply를 분리하는가
