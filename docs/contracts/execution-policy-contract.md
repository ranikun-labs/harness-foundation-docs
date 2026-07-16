---
title: Execution Policy Contract
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
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/architecture/local-cloud-human-boundary.md
---

# Execution Policy Contract

## 1. 문서 목적

이 문서는 `oh-my-ai` V1에서 특정 작업에 대해 어떤 행동이 허용되고, 어떤 행동이 승인 필요이며, 어떤 행동이 금지되는지를 정의한다.

Execution Policy의 목적은 Runtime의 기술적 가능성을 설명하는 것이 아니다.

정확한 목적은 다음과 같다.

```text
Approved Handoff
→ Required Actions
→ Runtime Capability 확인
→ Execution Policy 적용
→ Human Approval
→ Manual Execution
```

Execution Policy는 다음을 방지한다.

```text
Capability가 Supported라는 이유로 자동 실행
Worker가 승인 범위를 임의 확대
Runtime Adapter가 금지 행동을 허용으로 완화
Unknown Capability를 Allowed로 처리
Dirty Worktree의 기존 변경 덮어쓰기
Commit·Push·PR을 묵시적으로 허용
```

이 문서는 Billing, Entitlement, Organization Governance, Remote Policy Service를 정의하지 않는다.

---

## 2. 책임 경계

## 2.1 Execution Policy가 소유하는 책임

```text
행동별 허용 상태
승인 필요 여부
승인 Scope
승인 주체
승인 유효 범위
금지 행동
Default Deny / Default Safe
Capability와 Policy 충돌 처리
Runtime Adapter 준수 조건
정책 Drift
정책 Evidence
```

## 2.2 Execution Policy가 소유하지 않는 책임

```text
Runtime 기술 Capability
Runtime 설치 여부
사용자 결제 플랜
Cloud Entitlement
Runtime 자동 선택
Runtime 자동 실행
Prompt 자동 전달
Result 자동 수집
Project Context 자동 승격
```

## 2.3 관련 개념 구분

```text
Capability
= Runtime이 기술적으로 가능한가

Execution Policy
= 이번 작업에서 허용·승인 필요·금지되는가

Entitlement
= 사용자·플랜·조직의 기능 사용 권한

Availability
= 현재 Local 환경에서 실제 사용 가능한가
```

V1에서 Entitlement는 비범위다.

---

## 3. V1 불변조건

1. Capability와 Execution Policy를 분리한다.
2. Capability가 Supported여도 Policy가 금지할 수 있다.
3. Policy가 Allowed여도 Unsupported 기능은 실행할 수 없다.
4. Unknown Capability를 Allowed로 실행하지 않는다.
5. Runtime Adapter는 Policy를 임의 완화할 수 없다.
6. Human Approval은 명시적 Scope를 가져야 한다.
7. 승인되지 않은 행동은 기본적으로 실행하지 않는다.
8. 금지 행동은 Approval로 자동 해제되지 않는다.
9. Scope 밖 파일·명령·서비스 접근은 금지한다.
10. Commit·Push·PR은 명시 승인 없이는 금지한다.
11. Secret·Credential 원문 노출은 승인 여부와 무관하게 금지한다.
12. Dirty Worktree 기존 변경은 자동 수정·폐기·덮어쓰기하지 않는다.
13. Policy 변경 시 기존 승인 재사용을 금지한다.
14. Manual Execution 전 최종 Human Gate를 유지한다.
15. Cloud·Auth 없이 Local Artifact로 표현할 수 있어야 한다.
16. Work-start Product Approval은 Runtime Sandbox, File Permission, Shell Approval, Network Approval, Git Approval을 우회하지 않는다.
17. Runtime Entry Consent는 Engine Invocation 동의일 뿐, 파일 수정·명령 실행·네트워크 접근·Git 작업 승인이 아니다.

---

# Part I. Policy Model

## 4. 정책 상태

행동별 허용 상태:

```text
allowed
approval_required
prohibited
not_applicable
unknown
```

의미:

| 상태 | 의미 |
|---|---|
| allowed | 현재 Handoff 범위에서 별도 Action Approval 없이 수행 가능 |
| approval_required | 현재 Handoff Scope 안에서 유효한 Human Approval이 있으면 수행 가능 |
| prohibited | 현재 Handoff와 Policy Artifact에서는 수행 불가 |
| not_applicable | 해당 작업과 무관 |
| unknown | 정책을 판정할 근거가 부족 |

`unknown`은 `allowed`로 처리하지 않는다.

`prohibited`는 Approval만으로 해제할 수 없다.

Prohibited 행동을 수행 가능하게 변경하려면 다음이 필요하다.

```text
Handoff 또는 Policy의 새 Artifact Version 생성
Human Review 재수행
상태를 approval_required 또는 allowed로 재판정
```

Hard Safety Rule과 Do Not Touch는 새 Approval만으로도 완화할 수 없다.

---

## 5. Default Policy

V1 기본값:

```text
Read-only analysis
= allowed

Local file modification
= approval_required

Shell execution
= approval_required

Git inspect / diff
= allowed 또는 approval_required

Git stage / commit / push / PR create
= 각각 approval_required

Network read
= approval_required 또는 Handoff에서 allowed

Network write
= approval_required
= Handoff 또는 Hard Safety Rule이 금지하면 prohibited

Secret access
= prohibited

Production change
= prohibited
```

Repository·Task별 Handoff가 더 강한 제한을 둘 수 있다.

기본 정책보다 약한 정책으로 완화하려면 별도 Human Review가 필요하다.

---

## 6. Default Deny

정책 상태를 계산할 수 없으면 다음을 적용한다.

```text
unknown
→ 실행하지 않음
→ Human Review 요청
```

예외:

```text
Read-only local analysis
```

단, Secret·Sensitive Path·Do Not Touch 대상은 예외 없이 차단한다.

---

# Part II. Action Model

## 7. Action ID

각 행동은 안정적인 Action ID를 가진다.

권장 형식:

```text
action.<domain>.<verb>
```

예:

```text
action.files.read
action.files.create
action.files.modify
action.files.delete
action.files.rename

action.shell.inspect
action.shell.mutate
action.shell.destructive

action.git.inspect
action.git.stage
action.git.commit
action.git.push

action.network.read
action.network.write
action.github.read
action.github.write
action.github.pr.create

action.runtime.execute
action.result.import
action.repository.apply_patch
action.context.promote
```

규칙:

```text
Action ID는 Registry에서 유일
기존 ID 의미 변경 금지
다른 행동에 ID 재사용 금지
폐기 시 deprecated와 replaced_by 기록
```

Display Name과 Action ID를 구분한다.

---

## 8. Action Record 필수 필드

```text
action_id
policy_state
resolution_status
scope
conditions
approval_requirement
approval_refs
prohibited_reason
reason
unknown_reason
required_decision
safe_fallback
source
evidence_refs
last_reviewed_at
notes
```

예:

```yaml
action_id: action.files.modify
policy_state: approval_required
scope:
  include:
    - README.md
    - docs/**
  exclude:
    - scripts/**
conditions:
  - "Target path is inside approved scope"
approval_requirement:
  approval_type: path_scope
  required_scope_dimensions:
    - action
    - path
    - runtime
    - repository
    - handoff_version
  reason: "Tracked documentation modification requires approval."
approval_refs: []
prohibited_reason: null
source:
  type: handoff
  reference: handoff-20260714-183000-readme-v1-alignment
evidence_refs: []
last_reviewed_at: 2026-07-14T20:30:00+09:00
notes: []
```

---

## 9. 상태별 필드 규칙

### Allowed

필수:

```text
scope
conditions
source
```

### Approval Required

필수:

```text
scope
conditions
approval_requirement
approval_refs
source
```

`approval_requirement`는 어떤 승인이 필요한지 정의한다.

`approval_refs`는 실제로 발급된 Approval Record를 참조한다.

### Prohibited

필수:

```text
prohibited_reason
source
```

### Not Applicable

필수:

```text
reason
```

### Unknown

필수:

```text
unknown_reason
required_decision
safe_fallback
```

`policy_state`와 별도로 실행 해석 상태를 둔다.

```text
resolution_status:
- executable_candidate
- awaiting_approval
- blocked
- unresolved
```

---

# Part III. Approval Contract

## 10. Approval 종류

```text
single_action
action_group
path_scope
command_scope
execution_scope
handoff_scope
```

V1에서는 Approval을 Local Artifact로 기록할 수 있다.

---

## 11. Approval 필수 필드

```text
approval_ref
approval_schema_version
approval_artifact_version
approval_status
approval_type
approved_actions
approved_scope
approved_by
approved_at
expires_at
source_handoff_ref
source_handoff_artifact_version
constraints
revoked_at
revoked_by
revocation_reason
```

허용 `approval_status`:

```text
active
expired
revoked
superseded
```

유효성은 단순 필드 존재가 아니라 `approval_status: active`와 Scope·Version 일치 여부로 판정한다.

`approval_ref`는 Local Reference다.

다음이 아니다.

```text
Managed Approval ID
Cloud Entity ID
Organization Workflow ID
```

---

## 12. Approval Scope

Approval은 최소 다음을 제한할 수 있어야 한다.

```text
Action
Path
Command
Runtime
Repository
Branch
Remote
Target Service
Handoff
Handoff Artifact Version
Time
```

예:

```yaml
approved_actions:
  - action.files.modify
approved_scope:
  paths:
    - README.md
  runtime_id: codex
  repository_root: /Users/work/Github/oh-my-ai
  handoff_ref: handoff-20260714-183000-readme-v1-alignment
  artifact_version: 2
```

---

## 13. Approval 유효성

Approval은 다음이 모두 일치할 때만 유효하다.

```text
source_handoff_ref
source_handoff_artifact_version
approval_status = active
Action ID
Scope
Runtime
Repository
Branch / Remote / Target Service
승인 시간
정책 상태
```

다음 변경이 발생하면 재승인이 필요하다.

```text
Handoff Artifact Version 변경
Scope 변경
Do Not Touch 변경
Action 추가
Runtime 변경
Repository 변경
Policy 변경
Material Drift
```

---

## 14. Approval 철회

사용자는 Approval을 철회할 수 있다.

필수 기록:

```text
approval_status: revoked
revoked_at
revoked_by
revocation_reason
```

철회된 Approval은 재사용하지 않는다.

---

# Part IV. Policy Resolution

## 15. 정책 입력

```text
Approved Handoff
Runtime Capability Metadata
Default Policy
Repository State
Availability
User Approval
```

---

## 16. 정책 우선순위

우선순위:

```text
Hard Safety Rule
Do Not Touch
Prohibited Actions
Constraints
Explicit Approval
Allowed Actions
Default Policy
```

설명:

```text
Hard Safety Rule
= Secret 원문 노출, Production 파괴 등 절대 금지

Do Not Touch
= 대상별 변경 금지

Prohibited Actions
= 행동 금지

Constraints
= 환경·법률·형식 제한

Explicit Approval
= approval_required 행동을 특정 Scope에서 허용

Allowed Actions
= Handoff가 허용한 행동

Default Policy
= 나머지 행동의 기본값
```

Explicit Approval은 `approval_required` 상태를 승인된 Scope에서만 실행 가능 후보로 전환한다.

Explicit Approval은 Hard Safety Rule, Do Not Touch, Prohibited Actions를 덮어쓸 수 없다.

Approval은 승인된 Handoff Scope를 좁힐 수는 있지만 확장할 수 없다.

Handoff Scope 밖 파일이나 행동이 필요하면:

```text
Handoff 새 Artifact Version 생성
Scope 수정
Human Review 재수행
Policy와 Approval 재생성
```

---

## 17. 충돌 처리

예:

```text
Allowed Action
= README 수정

Do Not Touch
= README 변경 금지
```

결과:

```text
policy_validation_status: conflicting
execution blocked
Human Review required
```

다음 충돌을 검사한다.

```text
Allowed / Prohibited
Allowed / Do Not Touch
Approval / Prohibited
Approval / Scope Exclude
Policy / Capability
Policy / Availability
Policy / Repository State
```

충돌을 조용히 해석하지 않는다.

---

## 18. Capability와 Policy 조합

| Capability | Policy | 결과 |
|---|---|---|
| supported | allowed | 실행 가능 후보 |
| supported | approval_required | 승인 후 실행 가능 |
| supported | prohibited | 실행 금지 |
| conditional | allowed | 조건 확인 후 실행 가능 후보 |
| conditional | approval_required | 조건 확인 + 승인 필요 |
| unsupported | allowed | 실행 불가 |
| unsupported | approval_required | 실행 불가 |
| unknown | allowed | 실행 금지, 검증 또는 Manual Step 필요 |
| unknown | approval_required | 검증 후 재판정 |
| supported | unknown | 실행 금지, Policy 결정 필요 |

---

# Part V. Common Action Policies

## 19. Work-start Product Action

```text
action_id: work-start
```

Entry consent:

```text
EXPLICIT
APPROVED
SUGGESTED
DECLINED
```

Policy result:

```text
EXPLICIT
→ Work-start Engine invocation allowed
→ Runtime File/Shell/Network/Git approvals unchanged

APPROVED
→ Work-start Engine invocation allowed
→ Runtime File/Shell/Network/Git approvals unchanged

SUGGESTED
→ Work-start Engine invocation prohibited
→ Artifact creation prohibited

DECLINED
→ Work-start Engine invocation prohibited
→ Artifact creation prohibited
→ same-request re-suggestion prohibited
```

분리:

```text
Intent Match
≠ User Consent
≠ Engine Invocation

Work-start Product Approval
≠ Runtime Sandbox Approval
≠ File Permission
≠ Shell Approval
≠ Network Approval
≠ Git Approval
```

---

## 20. File Read

기본:

```text
approved scope 내부
→ allowed

Secret / Credential / .env 원문
→ prohibited

Handoff Scope 밖 파일
→ 기존 Approval로 허용 불가
→ Handoff Revision 필요
```

---

## 21. File Write

기본:

```text
Source Code / Tracked Documentation 수정
→ approval_required

새 Local Artifact 출력
→ 승인된 Output Root 안에서 allowed 또는 approval_required

Do Not Touch 대상
→ prohibited

Tracked File overwrite
→ explicit approval 필요
```

---

## 22. File Delete and Rename

기본:

```text
일반 File Delete
→ approval_required
→ Handoff Scope와 개별 Path 승인 모두 필요

File Rename
→ approval_required

bulk delete / recursive delete
→ prohibited
```

---

## 23. Shell Execution

기본:

```text
action.shell.inspect
→ Handoff Scope 안에서 allowed 또는 approval_required

action.shell.mutate
→ approval_required

action.shell.destructive
→ prohibited

Command Class = unknown
→ 실행 금지

Background process
→ V1 비범위
```

금지 예:

```text
rm -rf
git reset --hard
git clean -fd
sudo destructive command
production deployment command
```

명령 문자열에 Secret을 포함하지 않는다.

---

## 24. Git Inspect

예:

```text
git status
git diff
git log
git branch --show-current
```

기본:

```text
Handoff가 Repository Inspection을 명시적으로 허용
→ allowed

Handoff에는 포함되지만 추가 검토가 필요
→ approval_required

Handoff Scope 밖 Repository Inspection
→ Handoff Revision 필요
```

Dirty Worktree 확인은 기존 변경을 수정할 권한을 부여하지 않는다.

---

## 25. Git Stage / Commit / Push

기본:

```text
Git Stage
Git Commit
Git Push
PR Create

→ 각각 별도의 approval_required Action
```

Handoff에서 명시적으로 금지된 경우에는 `prohibited`다.

승인 시에도 다음을 별도로 검토한다.

```text
Files Included
Commit Message
Target Branch
Remote
Push Scope
PR Metadata
```

하나의 승인으로 Commit·Push·PR을 모두 묶지 않는다.

---

## 26. Network and Connector

기본:

```text
Public read-only lookup
→ approval_required 또는 allowed by Handoff

Authenticated read
→ approval_required

Write action
→ 기본 approval_required
→ Handoff 또는 Hard Safety Rule이 금지하면 prohibited

Credential transmission
→ prohibited unless 안전한 Connector Contract 존재
```

---

## 27. Runtime Execution

```text
Handoff Review 승인
Capability Compatibility 확인
Execution Policy valid
필요 Approval 유효
Availability 확인
```

위 조건이 충족돼야 Manual Execution 가능하다.

V1에서 Runtime을 자동 실행하지 않는다.

---

## 28. Result Import

```text
accept_result
≠ Repository Patch 적용 승인
≠ Project Context Promotion 승인
```

Import 대상별로 별도 Action과 Approval이 필요할 수 있다.

```text
action.result.import
action.repository.apply_patch
action.context.promote
```

각 Action은 독립적으로 판정한다.

---

# Part VI. Repository State

## 29. Dirty Worktree

Dirty Worktree 상태:

```text
clean
dirty_known_out_of_scope
dirty_known_in_scope
dirty_unknown
not_a_repository
unknown
```

기본 처리:

```text
dirty_known_out_of_scope
→ 기존 변경 보존
→ 작업 대상과 충돌하지 않는지 확인
→ Scope 밖 변경 수정·Stage 금지

dirty_known_in_scope
→ 기존 Diff를 Human Review에 표시
→ 자동 덮어쓰기·폐기·병합 금지
→ 명시적 처리 승인 전 수정 차단

dirty_unknown
→ stop_and_report

not_a_repository
→ Repository Action 금지
→ Generic Local Artifact만 허용 가능
```

Worker는 기존 변경을 자동 폐기하거나 덮어쓰지 않는다.

---

## 30. Path Safety

최소 검증:

```text
허용 Root 내부
.. traversal 없음
symlink 해석 후 허용 Root 내부
Do Not Touch와 충돌 없음
Tracked File 여부 확인
기존 파일 overwrite 승인 여부
Git Metadata 경로 제외
```

---

# Part VII. Policy Artifact

## 31. Policy Artifact 필수 필드

```text
schema_version
artifact_version
policy_ref
source_handoff_ref
handoff_artifact_version
runtime_id
capability_metadata_ref
capability_metadata_version
capability_report_ref
availability_snapshot_ref
default_policy_version
policy_validation_status
policy_lifecycle_status
execution_readiness_status
actions
approvals
repository_state
warnings
errors
created_at
created_by
review_state
reviewed_by
reviewed_at
review_notes
```

---

## 32. Policy 상태 축

### Policy Validation Status

```text
valid
invalid
incomplete
conflicting
```

의미:

| 상태 | 의미 |
|---|---|
| valid | Schema와 정책 계산이 유효 |
| invalid | Schema 또는 상태값 오류 |
| incomplete | 필요한 정책 정보 누락 |
| conflicting | 규칙 간 충돌 |

Approval이 아직 없다는 이유만으로 Policy Validation이 불완전한 것은 아니다.

```text
policy_validation_status: valid
execution_readiness_status: awaiting_approval
```

### Policy Lifecycle Status

```text
current
expired
superseded
```

### Execution Readiness Status

```text
ready_candidate
awaiting_approval
blocked
unavailable
unresolved
```

---

## 33. Review State

```text
not_reviewed
changes_requested
approved
rejected
```

Worker 또는 Adapter가 Policy Artifact를 생성할 때 설정할 수 있는 `review_state`는 `not_reviewed`뿐이다.

`approved`와 `rejected` 전이는 Human Reviewer만 수행할 수 있다.

Human Review가 발생한 경우 다음이 필수다.

```text
reviewed_by
reviewed_at
review_notes
```

---

# Part VIII. Drift and Expiration

## 34. Material Drift

다음 Material Drift는 Policy를 `expired`로 만든다.

```text
Handoff Artifact Version 변경
Runtime 변경
Target Repository 또는 Branch 변경
Action Scope 또는 Do Not Touch 변경
Approval Scope 변경
Mapping된 Capability의 Effective Status 변경
승인 Scope와 겹치는 Dirty Worktree 변화
Policy Rule 변경
```

다음은 Warning 후 영향 검토 대상이다.

```text
무관한 Capability Metadata 변경
Scope 밖 Repository 변경
관련 없는 Commit 증가
```

---

## 35. Expiration

다음 경우 `policy_lifecycle_status: expired`다.

```text
Approval 만료 또는 철회로 필수 Action을 수행할 수 없음
Material Drift 발생
Handoff expired
Mapping된 Capability Metadata conflicting
Repository State가 위험하게 변경
```

Expired Policy는 실행에 사용할 수 없다.

---

# Part IX. Human Review

## 36. Review 대상

사용자는 최소 다음을 검토한다.

```text
Action 목록
각 Action의 Policy State
Capability Compatibility
Scope
Conditions
Approval Requirement
Do Not Touch
Repository State
Dirty Worktree
Warnings
Policy Conflict
Expiration
```

---

## 37. Review 결과

```text
approve_policy
request_changes
approve_specific_action
reject_policy
defer_review
```

`approve_policy`는 Policy 계산, Scope, 충돌 처리와 Repository Safety 판정을 수용한다.

`approve_policy`는 `approval_required` 행동을 승인하지 않는다.

`approve_specific_action`은 특정 Action과 Scope에 대해 별도 Approval Record를 생성한다.

각 Action Approval은 명시적 Scope를 가져야 한다.

---

# Part X. Error and Degraded State

## 38. Missing Policy

```text
policy_artifact_receipt_status: missing
```

처리:

```text
Runtime 실행 차단
Generic Handoff 유지
Human Review 요청
```

---

## 39. Invalid Policy

예:

```text
허용되지 않은 상태값
Action ID 중복
Approval Reference 손상
Scope 누락
Policy 우선순위 충돌
```

상태:

```text
policy_validation_status: invalid
```

---

## 40. Incomplete Policy

예:

```text
unknown인데 Required Decision 없음
Repository State 미확인
Capability Metadata Version 누락
Approval Requirement 자체가 누락
```

상태:

```text
policy_validation_status: incomplete
```

`approval_required` Action에 아직 Approval Grant가 없는 경우:

```text
policy_validation_status: valid
execution_readiness_status: awaiting_approval
```

---

## 41. Conflicting Policy

예:

```text
Allowed와 Prohibited 중복
Approval이 Do Not Touch를 침범
Capability Unsupported인데 Allowed
Expired Approval 사용
```

상태:

```text
policy_validation_status: conflicting
```

---

# Part XI. Validation and Fixture

## 42. Contract Validation

최소 Validation:

```text
Action ID 유일성
Action Registry lifecycle 무결성
허용 Policy State
허용 Resolution Status
상태별 필수 필드
Scope 무결성
Handoff Scope 확장 금지
Path Safety
Approval Requirement / Grant 분리
Approval Reference 무결성
Approval Status active 확인
Approval Scope 일치
Handoff Version 일치
Runtime ID 일치
Capability Metadata Reference / Version 일치
Policy Validation / Lifecycle / Readiness 상태 분리
Policy 우선순위 일관성
Capability / Policy / Approval / Availability 조합
Repository State와 Dirty Scope Overlap
Expiration
Review State 권한
```

---

## 43. Positive Fixture

### Read-only Analysis

```text
File Read
Git Inspect
No write
→ valid
```

### Approved File Modification

```text
Capability supported
Policy approval_required
Explicit Approval valid
Path Scope 일치
→ valid
```

### Conditional Runtime

```text
Capability conditional
조건 충족
Approval valid
→ valid
```

---

## 44. Negative Fixture

```text
Unknown Capability를 allowed로 실행
Unsupported Capability에 Approval 부여
Approval Scope 밖 파일 수정
Approval 만료 후 실행
Approval 철회 후 실행
Handoff Version 변경 후 과거 Approval 재사용
Do Not Touch 대상 수정
Prohibited Action을 Adapter가 allowed로 완화
Dirty Unknown 상태에서 Patch
Tracked File overwrite 무승인
Symlink Escape
Secret 포함 Command
Commit 승인만으로 Push 실행
accept_result만으로 Patch 적용
Policy approved지만 Action Approval 없음
Worker가 review_state: approved 생성
policy_state: prohibited인데 Approval로 실행
Approval이 Handoff Scope 밖 Path 포함
Action Record approval_requirement에 승인자·승인시각 직접 기록
Handoff Version과 Approval Version 불일치
Push Approval만으로 PR 생성
Scope 밖 File Read를 Path Approval로 확장
dirty_known_in_scope에서 Diff 검수 없이 Modify
Command Class unknown인데 Shell 실행
Default prohibited를 Explicit Approval로 해제
Approval 철회 후 실행 계획 재사용
```

---

## 45. Truthfulness Fixture

```text
Capability Supported
≠ Policy Allowed

Policy Allowed
≠ Capability Supported

Approval 존재
≠ Scope 전체 허용

Result Accepted
≠ Repository Apply 승인

Unknown
≠ Allowed
```

---

## 46. Drift Fixture

```text
Handoff Version 변경
Runtime 변경
Capability Metadata 변경
Approval Scope 변경
Repository Branch 변경
Dirty Worktree 변화
```

기대 결과:

```text
expired 또는 conflicting
Human Review 재수행
기존 Approval 재사용 금지
```

---

## 47. 완료 조건

Contract 완료:

```text
Policy 상태 모델 정의
Action Record 정의
Approval Contract 정의
Policy 우선순위 정의
Capability 조합 정의
Repository State 정의
Path Safety 정의
Drift / Expiration 정의
Human Review 정의
Positive / Negative / Truthfulness Fixture 정의
```

Implementation 완료:

```text
Policy Artifact 생성
Action별 상태 계산
Capability / Policy 충돌 검사
Approval 유효성 검사
Path Safety 검사
Dirty Worktree 검사
Policy Review
Manual Execution Gate
Fixture 통과
```

---

# Part XII. Example

## 48. Policy Artifact Example

```yaml
schema_version: "1.0"
artifact_version: 1
policy_ref: policy-20260714-203000-readme-v1-alignment
source_handoff_ref: handoff-20260714-183000-readme-v1-alignment
handoff_artifact_version: 2
runtime_id: codex
capability_metadata_ref: runtime-capability-codex-v1
capability_metadata_version: "1.0"
capability_report_ref: compatibility-20260714-readme-v1
availability_snapshot_ref: availability-20260714-codex
default_policy_version: "1.0"
policy_validation_status: valid
policy_lifecycle_status: current
execution_readiness_status: awaiting_approval

actions:
  - action_id: action.files.read
    policy_state: allowed
    resolution_status: executable_candidate
    scope:
      include:
        - README.md
        - README.md
      exclude: []
    conditions: []
    approval_requirement: null
    approval_refs: []
    prohibited_reason: null
    source:
      type: handoff
      reference: handoff-20260714-183000-readme-v1-alignment
    evidence_refs: []
    last_reviewed_at: 2026-07-14T20:30:00+09:00
    notes: []

  - action_id: action.files.modify
    policy_state: approval_required
    resolution_status: executable_candidate
    scope:
      include:
        - README.md
        - README.md
      exclude:
        - scripts/**
    conditions:
      - "Path is inside approved scope"
    approval_requirement:
      approval_type: path_scope
      required_scope_dimensions:
        - action
        - path
        - runtime
        - repository
        - handoff_version
      reason: "Tracked documentation modification requires approval."
    approval_refs:
      - approval-20260714-203500-doc-patch
    prohibited_reason: null
    source:
      type: handoff
      reference: handoff-20260714-183000-readme-v1-alignment
    evidence_refs: []
    last_reviewed_at: 2026-07-14T20:35:00+09:00
    notes: []

  - action_id: action.git.commit
    policy_state: prohibited
    resolution_status: blocked
    scope:
      include: []
      exclude: []
    conditions: []
    approval_requirement: null
    prohibited_reason: "Commit was not requested in the Handoff."
    source:
      type: default_policy
      reference: execution-policy-v1
    evidence_refs: []
    last_reviewed_at: 2026-07-14T20:30:00+09:00
    notes: []

approvals:
  - approval_ref: approval-20260714-203500-doc-patch
    approval_schema_version: "1.0"
    approval_artifact_version: 1
    approval_status: active
    approval_type: path_scope
    approved_actions:
      - action.files.modify
    approved_scope:
      paths:
        - README.md
        - README.md
      runtime_id: codex
      repository_root: /Users/work/Github/oh-my-ai
      handoff_ref: handoff-20260714-183000-readme-v1-alignment
      artifact_version: 2
    approved_by: user
    approved_at: 2026-07-14T20:35:00+09:00
    expires_at: null
    source_handoff_ref: handoff-20260714-183000-readme-v1-alignment
    source_handoff_artifact_version: 2
    constraints:
      - "Do not commit or push."
    revoked_at: null
    revoked_by: null
    revocation_reason: null

repository_state:
  status: dirty_known_out_of_scope
  known_changes:
    - docs/architecture/local-cloud-human-boundary.md
  unknown_changes: []
  handling: preserve_out_of_scope_changes

warnings: []
errors: []
created_at: 2026-07-14T20:35:00+09:00
created_by: policy_generator
review_state: not_reviewed
reviewed_by: null
reviewed_at: null
review_notes: []
```

---

# Part XIII. Non-goals

## 49. V1 비목표

```text
Cloud Policy Service
Organization Governance
Role-based Access Control
Remote Approval Workflow
Billing / Entitlement
Runtime Broker
Automatic Runtime Execution
Automatic Result Collection
Distributed Lock
Writer Lease
```

---

## 50. 채택하지 않는 방향

### Capability와 Policy 통합

기술 가능성과 작업 허용을 분리한다.

### Approval이 모든 금지를 해제

Hard Safety Rule과 Do Not Touch는 유지한다.

### Unknown을 Allowed로 처리

판정할 수 없으면 실행하지 않는다.

### Commit·Push·PR 일괄 승인

각 행동과 Scope를 분리한다.

### Result Accepted를 Repository Apply 승인으로 사용

두 Human Gate를 분리한다.

---

# Part XIV. Open Decisions

## 51. 미결정 사항

1. Policy Artifact 파일 형식
2. Action ID Registry 경로
3. Approval Artifact 분리 여부
4. Approval 기본 만료 시간
5. Command Scope 표현 방식
6. Path Glob 표준
7. Repository State 검사 방식
8. Default Policy 설정 파일 위치
9. Policy Drift 검사 시점
10. Multi-file Approval UX
11. Runtime별 Policy Adapter 필요 여부
12. Read-only Command Allowlist
13. Network Read 기본값
14. Policy Evidence 보관 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 52. 불변조건

1. Capability와 Execution Policy를 분리한다.
2. Policy Allowed가 Capability Supported를 의미하지 않는다.
3. Capability Supported가 Policy Allowed를 의미하지 않는다.
4. Unknown은 실행하지 않는다.
5. Approval은 명시적 Action과 Scope를 가진다.
6. Approval은 Handoff Artifact Version과 명시적 Scope에 결합된다.
7. Runtime Adapter는 Policy를 완화하지 않는다.
8. Hard Safety Rule과 Do Not Touch는 Approval로 해제되지 않는다.
9. Dirty Worktree 기존 변경을 보존한다.
10. Commit·Push·PR은 명시 승인 없이는 금지한다.
11. accept_result와 apply_patch 승인을 분리한다.
12. Policy Drift 시 재검토한다.
13. Expired Approval을 재사용하지 않는다.
14. V1에서 자동 Runtime 실행을 하지 않는다.
15. Entitlement는 V1 비범위다.
16. Prohibited는 Approval만으로 해제하지 않는다.
17. Approval Requirement와 Approval Grant를 분리한다.
18. Approval은 Handoff Scope를 확장하지 않는다.
19. Policy Validation·Lifecycle·Review·Execution Readiness를 분리한다.
20. Generator는 Human Review 상태를 자체 승인하지 않는다.

---

## 53. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/testing/v1-fixture-plan.md
docs/architecture/local-cloud-human-boundary.md
```

---

## 54. 검수 관점

### 제품

- Human-controlled 실행 경계가 유지되는가
- 승인되지 않은 행동이 기본 차단되는가
- Local-only Artifact로 완결 가능한가

### Contract

- Policy 상태가 충분한가
- Approval Scope와 유효성이 명확한가
- Policy 우선순위와 충돌 처리가 일관적인가
- Repository State와 Path Safety가 포함되는가

### Truthfulness

- Capability와 Policy를 혼동하지 않는가
- Unknown을 Allowed로 승격하지 않는가
- Approval 범위를 과장하지 않는가
- Result Accept와 Repository Apply를 분리하는가

### Safety

- Secret·Do Not Touch·Destructive Action을 차단하는가
- Dirty Worktree 기존 변경을 보호하는가
- Commit·Push·PR을 묵시적으로 허용하지 않는가
