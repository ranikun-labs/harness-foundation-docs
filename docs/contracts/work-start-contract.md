---
title: Work-start Contract
status: draft
implementation_status: partial
owner: development
last_reviewed: 2026-07-20
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
source_inputs:
  - docs/product/development-harness-report.md
  - docs/product/v1-completion-criteria.md
  - docs/architecture/local-cloud-human-boundary.md
---

# Work-start Contract

## 1. 문서 목적

이 문서는 `oh-my-ai` V1의 Work-start 입력·처리·출력 계약을 정의한다.

Work-start의 목적은 사용자의 작업 요청을 바로 실행하는 것이 아니다.

정확한 목적은 다음과 같다.

```text
사용자 Task
→ Local Context Candidate
→ Skill Candidate
→ Risk Candidate
→ Handoff Seed
```

Work-start는 다음 단계의 입력을 준비한다.

```text
Work-start
→ Structured Handoff Candidate
→ Human Review
→ Manual Copy/Paste
```

이 문서는 Work-start를 Managed Task Entity, 자동 Worker 실행기, Cloud Context 수집기로 확장하지 않는다.

---

## 2. 책임 경계

## 2.1 Work-start가 소유하는 책임

```text
Task 입력 정규화
Local Context 후보 탐색
Skill 후보 계산
Risk 후보 계산
Context Gap 표시
Source 표시
Handoff Seed 생성
```

## 2.2 Work-start가 소유하지 않는 책임

```text
최종 Scope 승인
Do Not Touch 확정
Worker Runtime 실행
Prompt 자동 전달
Result 자동 수집
Canonical Truth 승격
Project Context 자동 수정
Managed Task ID 발급
Cloud 저장
```

## 2.3 다른 Contract와의 관계

```text
Work-start
= Candidate Seed

Structured Handoff
= Human Review 전 작업 전달 Candidate

Result Basic
= 검토 가능한 작업 결과

Project Context
= Human-confirmed Durable Context
```

---

## 3. V1 불변조건

1. Work-start는 Local-only로 동작할 수 있어야 한다.
2. Work-start 결과는 Candidate다.
3. 검색 결과를 Confirmed Fact로 자동 승격하지 않는다.
4. Skill 후보를 자동 실행하지 않는다.
5. Secret과 Private Context를 기본 제외한다.
6. Handoff가 승인되기 전 Runtime을 자동 실행하지 않는다.
7. Cloud Account, Auth, Entitlement를 요구하지 않는다.
8. Provider Session ID를 요구하지 않는다.
9. Managed Task ID를 요구하지 않는다.
10. Work-start 실패가 사용자 Repository를 수정하면 안 된다.

---

# Part I. Input Contract

## 4. 필수 입력

최소 입력:

```text
task
```

의미:

```text
사용자가 달성하려는 작업 목적을 자연어로 표현한 값
```

예:

```text
README의 V1 제품 설명을 현재 제품 경계에 맞게 수정해줘
```

---

## 5. 선택 입력

```text
repository_root
branch_hint
commit_hint
scope_hint
do_not_touch_hint
runtime_hint
skill_hint
context_paths
excluded_paths
execution_policy_hint
output_path
```

각 입력의 의미:

| 필드 | 의미 |
|---|---|
| repository_root | 탐색 기준 Local Repository |
| branch_hint | 사용자가 제공한 Branch 후보 |
| commit_hint | 사용자가 제공한 Commit 후보 |
| scope_hint | 사용자가 알고 있는 작업 범위 |
| do_not_touch_hint | 변경 금지 대상 후보 |
| runtime_hint | 선호 Runtime |
| skill_hint | 참고 Skill 후보 |
| context_paths | 우선 탐색 경로 |
| excluded_paths | 탐색 제외 경로 |
| execution_policy_hint | suggest-only 등 실행 정책 후보 |
| output_path | Work-start Artifact 출력 경로 |

선택 입력이 없다고 Work-start가 실패해서는 안 된다.

사용자가 제공한 Branch·Commit 값은 Hint다.

Local Repository에서 독립적으로 확인되기 전에는 Confirmed Fact로 사용하지 않는다.

확인 결과:

```text
observed_branch
observed_commit
```

확인할 수 없으면 `unknown`으로 유지한다.

---

## 6. 입력 Validation

Work-start는 최소 다음을 확인한다.

```text
task가 비어 있거나 공백-only가 아닌가
excluded_paths와 context_paths가 충돌하는가
output_path가 안전한가
```

`repository_root`가 제공된 경우:

```text
해당 경로가 존재하는가
허용된 Local 범위 안에 있는가
symlink 해석 후에도 허용 Root를 벗어나지 않는가
```

`repository_root`가 제공되지 않은 경우:

```text
Repository Discovery를 생략
repository_context_status를 not_provided로 기록
Generic Work-start Artifact 생성을 계속
```

Repository Context 상태:

```text
not_provided
resolved
unresolved
```

Validation 실패 상태:

```text
invalid_input
repository_not_found
unsafe_output_path
conflicting_path_rules
```

입력 오류를 사용자 Task의 실패로 기록하지 않는다.

---

# Part II. Context Discovery

## 7. Context Candidate

Work-start가 수집할 수 있는 Context 후보:

```text
Repository metadata
현재 Branch
현재 Commit
README
AGENTS / CLAUDE / Instruction
관련 문서
관련 Source File
최근 승인된 Project Context
Skill Metadata
사용자 지정 Context
```

모든 후보를 자동 포함하지 않는다.

각 후보는 다음 정보를 가져야 한다.

```text
source
reason
relevance
confidence
freshness
sensitivity
selection_status
quality_flags
```

선택 상태:

```text
selected
excluded
missing
```

품질 Flag:

```text
stale
conflicting
sensitive
not_verifiable
```

---

## 8. Context 상태

Context 후보 상태는 `selection_status`와 `quality_flags`로 분리한다.

Work-start는 다음을 표시해야 한다.

- 왜 선택했는가
- 왜 제외했는가
- 최신성은 어떤가
- 충돌하는 Context가 있는가
- 민감정보 가능성이 있는가

---

## 9. Context Gap

Context 부족 상태:

```text
missing_required_context
ambiguous_scope
unresolved_repository_state
conflicting_instruction
insufficient_evidence
```

Context Gap이 있어도 Work-start는 가능한 범위에서 Candidate를 생성할 수 있다.

단, 부족한 Context를 추정으로 채우고 Confirmed Fact로 표시하면 안 된다.

---

## 10. 기본 제외 대상

Hard Exclusion:

```text
Secret
API Key
Private Key
Credential
.env 값
Local private profile의 민감값
```

Hard Exclusion 대상은 사용자 승인 여부와 관계없이 Work-start Artifact에 원문을 기록하지 않는다.

필요하면 다음만 표시한다.

```text
존재 여부
redacted identifier
source category
```

Soft Exclusion:

```text
Generated artifact
Build output
Binary
Dependency directory
Large raw log
```

Soft Exclusion은 사용자가 필요성과 범위를 승인한 경우에만 제한적으로 참조할 수 있다.

대표 경로 후보:

```text
.env
.env.*
.git
node_modules
vendor
dist
build
target
coverage
secrets
credentials
```

`.git` 원문은 Context에서 제외하지만, Git 명령으로 얻은 Branch·Commit Metadata는 사용할 수 있다.

---

# Part III. Skill Routing

## 11. Routing Source of Truth

V1 Routing 기준:

```text
skills/*/SKILL.md routing metadata
→ generated skills/skill-index.json
→ Routing Consumer
```

수동 Routing Table은 설명용일 수 있으나 Runtime Source of Truth가 아니다.

---

## 12. Routing 입력

```text
task
normalized_task
context_summary
repository_type
language
framework
task_type
user_skill_hint
```

모든 입력이 항상 존재할 필요는 없다.

---

## 13. Routing 출력

각 Skill Candidate는 다음을 포함한다.

```text
skill_id
display_name
match_reason
matched_triggers
score
confidence
source
limitations
```

예:

```yaml
skill_id: gh-fix-ci
match_reason: "GitHub Actions 실패 로그와 CI 수정 요청이 감지됨"
matched_triggers:
  - keyword: "GitHub Actions"
  - keyword: "CI 실패"
score: 0.82
confidence: medium
source: skills/gh-fix-ci/SKILL.md
limitations:
  - "실제 PR과 Actions 로그 확인 필요"
```

---

## 14. Routing 지원 범위

V1은 실제 Consumer가 지원하는 Trigger만 공식 지원한다.

Contract 완료 시 `supported_trigger_kinds`를 하나의 Profile로 선언해야 한다.

예:

```yaml
supported_trigger_kinds:
  - keyword
```

또는:

```yaml
supported_trigger_kinds:
  - keyword
  - intent
  - pattern
```

문서와 Schema가 `intent`, `pattern`을 선언하더라도 Consumer가 사용하지 않으면 지원 완료로 판정하지 않는다.

지원하지 않는 Trigger는 다음 중 하나로 처리한다.

```text
unsupported
ignored_with_warning
not_declared
```

---

## 15. Routing 상태

```text
matched
no_match
ambiguous
multiple_candidates
broken_index
missing_metadata
routing_unavailable
```

`no_match`는 실패가 아니다.

기본 Skill 없이도 Generic Handoff Seed를 생성할 수 있어야 한다.

---

## 16. Fail-open

다음 상황에서 Work-start 전체를 차단하지 않는다.

```text
skill-index.json 손상
Skill Metadata 누락
Routing Script 오류
지원하지 않는 Trigger
후보 점수 계산 실패
```

Fail-open 결과:

```yaml
routing_status: unavailable
routing_error_code: broken_index | missing_metadata | consumer_error | unsupported_trigger
skill_candidates: []
warnings:
  - "Skill routing unavailable; generic Work-start output generated."
```

Fail-open은 잘못된 Skill을 임의 선택하는 것이 아니다.

Routing을 비활성화한 상태로 Generic Handoff Seed를 생성해야 한다.

---

# Part IV. Risk Candidate

## 17. Risk 분류

Work-start는 최소 다음 Risk 후보를 표시할 수 있다.

```text
destructive_change
secret_exposure
scope_ambiguity
dirty_worktree
stale_context
conflicting_instruction
large_change_surface
insufficient_validation
external_dependency
unverified_assumption
```

Risk는 자동 Policy 결정이 아니다.

각 Risk Candidate는 최소 다음을 포함한다.

```text
risk_type
reason
source
evidence_ref
confidence
severity_candidate
recommended_review
```

`severity_candidate`는 최종 Policy 결정이 아니라 검수 우선순위 후보다.

Risk Candidate는 Handoff Human Review의 입력이다.

---

## 18. Execution Policy Hint

Work-start가 제안할 수 있는 Mode:

```text
suggest-only
patch-with-approval
auto-apply
```

Work-start는 Mode를 강제하지 않는다.

제안 결과:

```text
execution_policy_candidate
recommendation_reason
suggested_approvals
```

Risk와 Execution Policy 출력은 모두 비구속 Candidate다.

Work-start는 최종 Execution Policy나 Required Approval을 확정하지 않는다.

예:

```yaml
recommended_execution_policy: patch-with-approval
recommendation_reason: "여러 canonical 문서와 링크를 수정해야 함"
required_approvals:
  - "파일 수정 전 사용자 승인"
```

---

# Part V. Output Contract

## 19. 필수 출력 Artifact

Work-start는 최소 다음 Artifact를 생성해야 한다.

```text
work-start-summary.md
```

선택 Artifact:

```text
context-manifest.yaml
sources.md
context-gap-report.md
skill-candidates.yaml
risk-candidates.yaml
starter-prompt.md
```

파일명은 구현에서 달라질 수 있으나 의미는 유지해야 한다.

---

## 20. Work-start Summary 필수 필드

```text
schema_version
overall_status
task
normalized_task
repository_context
selected_context
excluded_context
context_gaps
skill_candidates
routing_status
routing_error_code
risk_candidates
execution_policy_hint
handoff_seed
warnings
errors
completed_steps
failed_steps
missing_outputs
provenance
created_at
```

허용 상태:

```text
complete
partial
failed
blocked
```

---

## 21. Handoff Seed

Handoff Seed는 최종 Handoff가 아니다.

포함 후보:

```text
goal_candidate
scope_candidate
do_not_touch_candidate
observed_facts_candidate
assumptions_candidate
open_issues_candidate
constraints_candidate
expected_output_candidate
validation_candidate
```

모든 값은 Candidate임을 명시한다.

예:

```yaml
handoff_seed:
  goal_candidate: "README의 V1 제품 경계를 최신 canonical 결정과 정렬"
  scope_candidate:
    - README.md
    - README.md
  do_not_touch_candidate:
    - runtime implementation
  assumptions_candidate:
    - "현재 제품 명칭은 유지한다"
  open_issues_candidate:
    - "Migration 안내 필요 여부"
```

---

## 22. Truthfulness 표시

Work-start 출력은 다음 분류를 사용할 수 있어야 한다.

```text
observed_fact_candidate
decision_candidate
candidate
assumption
open_issue
constraint
not_verifiable
warning
```

검색 결과는 기본적으로 `candidate`다.

Local Source에서 직접 관찰한 내용은 `observed_fact_candidate`로 기록할 수 있다.

`confirmed_fact`와 `confirmed_decision`은 Human Review를 거쳐 Structured Handoff에 반영된 이후에만 사용한다.

---

## 23. Provenance

각 Context와 Candidate는 최소 다음 Provenance를 가져야 한다.

```text
source_path
source_type
source_version
retrieved_at
selection_reason
```

Repository 기반 Context:

```text
repository_root
branch
commit
```

Branch와 Commit이 확인되지 않으면 `unknown`으로 기록한다.

임의 값을 만들지 않는다.

---

# Part VI. Human Review

## 24. Runtime Entry and Consent

Canonical Product Action:

```text
canonical_action_id: work-start
```

Entry mode:

```text
explicit
suggested
```

Approval:

```text
not_required
pending
accepted
declined
```

허용 조합:

```text
explicit + not_required
suggested + accepted
```

거부 조합:

```text
suggested + pending
suggested + declined
```

의미:

```text
explicit + not_required
→ 사용자가 Runtime Entry를 명시 호출했으므로 Work-start Engine 실행 가능

suggested + pending
→ Suggestion Candidate만 표시
→ Engine 호출 금지
→ Artifact 생성 금지

suggested + accepted
→ 사용자가 제안을 승인했으므로 Work-start Engine 실행 가능

suggested + declined
→ Engine 호출 금지
→ Artifact 생성 금지
→ 동일 사용자 요청에 재제안 금지
```

Intent Detection은 실행 권한이 아니다.

```text
Intent Match
≠ User Consent
≠ Engine Invocation
```

### 24.1 Runtime Event Boundary Clarification

이 경계는 기존 Consent·Suggestion Boundary의 Clarification이며,
새 Product Decision이나 Runtime 자동화 계약을 만들지 않는다.

```text
Real User Prompt
= 사람이 현재 User Turn에서 직접 입력한 요청

Synthetic Event
= task-notification
| background agent completion
| tool result notification
| runtime-generated status message
| Provider Runtime이 생성한 비사용자 입력 이벤트
```

`UserPromptSubmit` intent routing은 Real User Prompt만 대상으로 한다.

```text
Synthetic Event
→ UserPromptSubmit intent routing 대상이 아님
→ Work-start Suggestion을 생성하지 않음

Runtime Event
≠ User Intent
```

동일 User Turn 또는 동일 사용자 요청에서는 Work-start Suggestion을 반복 표시하지 않는다.

`make work-start TASK="..."`는 공통 Engine의 내부 Developer Interface다.
사용자용 Product Entry는 Runtime Adapter가 제공한다.

---

## 25. Review 대상

사용자는 다음을 검토할 수 있어야 한다.

```text
Task 정규화
선택된 Context
제외된 Context
Context Gap
Skill Candidate
Routing 근거
Risk Candidate
Execution Policy Hint
Handoff Seed
```

---

## 26. Review 결과

```text
accept_seed
edit_seed
reject_seed
continue_without_skill
continue_with_missing_context
stop
```

`accept_seed`는 Handoff Seed를 Structured Handoff 작성 단계로 넘기는 승인이다.

Runtime 실행, Prompt 전송 또는 Repository 수정 승인이 아니다.

Work-start Review는 Worker Result Review와 다르다.

```text
Work-start Review
= 전달 전 Candidate 검수

Result Review
= 작업 수행 후 결과 검수
```

## 27. Human Review: Choose the Next Step

Work-start는 다음 행동을 결정하지 않습니다.

사용자는 현재 정보와 작업 범위를 검토한 뒤,
바로 Handoff하거나,
계획을 먼저 작성하거나,
부족한 Context를 보충할 수 있습니다.

Work-start Candidate는 기본 선택값을 만들지 않는다.
사용자가 명시적으로 선택하기 전 상태는 다음과 같다.

```text
Needs human review
```

중립 표시 예:

```markdown
## Human Review: Choose the Next Step

- [ ] Direct Handoff
  범위와 수행 방법이 충분히 명확하다.

- [ ] Plan First
  영향 범위나 수행 순서를 먼저 정리해야 한다.

- [ ] Gather Context
  Repository 밖의 자료나 결정이 추가로 필요할 수 있다.

Selected by:
Reason:
Unresolved context:
```

Contract 의미:

```text
Direct Handoff
= 사용자가 Handoff Candidate를 검토한 뒤
  Worker Session에 수동 전달하기로 선택

Plan First
= 사용자가 별도 Planning Skill 또는 Manual Planning Process를 수행하고
  검토된 계획 참조를 Candidate에 반영하기로 선택

Gather Context
= 사용자가 외부 자료나 추가 입력을 수동 확인한 뒤
  Work-start 또는 Handoff Candidate를 다시 검토하기로 선택
```

다음은 Work-start Contract가 아니다.

```text
시스템의 Next Step 자동 선택
기본 선택값 자동 지정
작업 복잡도 확정 판정
Planning Skill 자동 호출
Planning 자동 실행
선택 결과에 따른 자동 Workflow 분기
Handoff 자동 승인
```

### 27.1 Main Session Continuation Boundary Clarification

Main Session은 Human Review, 계획 검토, Context 검토, 결과 통합과
다음 단계를 선택하는 세션이다. V1의 로컬 Main Session을 Control Plane이라고
부르지 않는다. Control Plane은 기존 Foundation에서 사용하는 V2 Cloud·Managed
Workflow 경계 용어로 유지한다.

Plan First와 Gather Context의 결과는 Main Session에서 검토·통합한다.
두 경로가 끝난 뒤 같은 Main Session은 구현, Commit, Push, PR 또는 Merge를
시작하지 않는다.

검토된 계획 또는 추가 Context는 사용자 확인을 거쳐 Handoff Candidate에 반영할 수 있다.
Candidate 반영은 Direct Handoff 승인과 동일하지 않으며, Direct Handoff는 사용자가
별도로 명시적으로 선택해야 한다.

### 27.2 Plan First 및 Gather Context 종료 안내 Clarification

계획 또는 Context가 사용자 확인 후 Handoff Candidate에 반영되면, Main Session은
반영 결과와 다음 상태를 한 번 안내한다.

```text
현재 상태: Needs human review
Candidate 반영 ≠ Direct Handoff 선택 또는 Worker 실행 승인
Worker Session: 아직 생성되지 않았고 실행되지 않음
```

안내에는 Plan First 또는 Gather Context의 완료 여부, Candidate 반영 여부,
Direct Handoff의 별도 명시 선택 필요성, 그리고 선택 후 새 Worker Session을 열어
승인된 Candidate 또는 Handoff 내용을 수동 전달해야 한다는 다음 절차를 포함한다.
안내 후 Main Session은 구현을 시작하지 않고 정지한다.

이 안내는 현재 상태와 가능한 수동 절차를 설명할 뿐이며, Direct Handoff를 자동 선택하거나,
사용자 대신 다음 단계를 승인하거나, Worker Session 생성·Prompt 주입·구현 시작을 자동화하지 않는다.

### 27.3 Role Terminology Clarification

```text
Native Subagent
= Claude Code·Codex 등 Provider Runtime이 제공하는 내부 탐색·실행 기능
≠ oh-my-ai Worker Session

Worker Session
= 사용자가 승인한 Handoff를 전달받아 구현·검증을 수행하는
  별도 oh-my-ai Role Contract
= Direct Handoff를 사용자가 명시적으로 선택한 뒤에만 시작 가능
```

Native Subagent의 생성 방식, 병렬 수, Token Budget, 세부 오케스트레이션은
Work-start Product Contract의 설계 대상이 아니다. 이는 harness instruction 레이어 또는
Provider Adapter 제약의 책임으로 남긴다. Native Subagent도 Human Review 선택,
계획 최종 승인, Direct Handoff 승인, Product·Architecture Decision 또는 다음 Workflow의
자동 실행을 대신할 수 없다.

## 28. External Context Checkpoint

External Context Checkpoint는 시스템이 확인한 Fact가 아니라,
사용자가 확인할 수 있는 후보 목록이다.

```text
Internal Wiki or Confluence
Issue Tracker
Drive or Notion
Design files
Other repositories
Recent decisions from Slack or email
Production-only configuration
```

구분:

```text
Possible external context
≠ 외부 자료가 실제 존재함

Needs human review
≠ Missing으로 확정됨

Manual review
≠ Connector 호출

External context candidate
≠ 자동 검색 결과
```

V1에서 사용자는 자료 이름, URL, 문서 경로 또는 참조를 수동으로 기록할 수 있다.
Work-start는 이를 자동 검색 결과나 confirmed fact로 표현하지 않는다.

---

## 29. 자동 실행 금지

다음은 Human Review 이전에 수행하지 않는다.

```text
Worker Runtime 실행
파일 수정
Shell 명령 실행
Handoff 전송
Cloud 업로드
Project Context Promotion
```

사용자가 사전에 승인한 별도 Execution Mode가 있더라도 Work-start 자체는 Candidate 생성 단계다.

---

# Part VII. Error and Failure

## 30. 오류 상태

```text
invalid_input
context_discovery_failed
routing_failed
artifact_write_failed
unsafe_path
partial_output
```

오류가 발생해도 가능한 Artifact를 남길 수 있다.

예:

```text
Routing 실패
→ Context Summary와 Generic Handoff Seed 생성
```

Artifact Write Failure:

```text
Repository와 다른 파일을 수정하지 않음
가능한 경우 stderr 또는 stdout에 구조화된 오류 Summary 반환
전체 성공으로 표시하지 않음
```

---

## 31. Partial Output

Partial Output은 다음을 명시해야 한다.

```text
completed_steps
failed_steps
missing_outputs
warnings
recommended_next_action
```

부분 성공을 전체 성공으로 표시하지 않는다.

---

## 32. Repository 변경 금지

Work-start는 기본적으로 다음을 수정하지 않는다.

```text
Source Code
Tracked Documentation
Git Index
Branch
Commit
Remote
```

허용되는 쓰기:

```text
명시된 Work-start Output Directory
사용자가 승인한 Local Artifact 경로
```

---

# Part VIII. Validation

## 33. Contract Validation

최소 Validation:

```text
필수 필드 존재
허용 상태값
Path Safety
Secret Pattern 제외
Provenance 존재
Candidate / Fact 분류
Routing 상태 일관성
```

Path Safety는 최소 다음을 검증한다.

```text
허용된 Output Root 내부인가
.. traversal이 없는가
symlink 해석 후 허용 Root를 벗어나지 않는가
Source Code 또는 Tracked Documentation 경로와 겹치지 않는가
기존 파일을 사용자 승인 없이 overwrite하지 않는가
Git Index 또는 Repository Metadata를 수정하지 않는가
```

---

## 34. 최소 Fixture

### 정상 입력

```text
Task + Repository
→ Context + Skill + Handoff Seed
```

### No-match

```text
Skill 후보 없음
→ Generic Handoff Seed 생성
```

### Ambiguous

```text
여러 Skill 후보
→ 후보와 이유 표시
```

### Broken Index

```text
Skill Index 손상
→ Fail-open
```

### Missing Metadata

```text
Skill Metadata 누락
→ Warning + 나머지 후보 처리
```

### Secret Exclusion

```text
.env와 Credential
→ Context에서 제외
```

### Context Gap

```text
필수 문서 없음
→ missing_required_context
```

### Dirty Worktree

```text
미커밋 변경 존재
→ Risk Candidate
```

### Unsafe Output

```text
Repository 외 위험 경로
→ 출력 차단
```

### 추가 Negative Fixture

```text
Empty Task
Whitespace-only Task
Conflicting context_paths / excluded_paths
Repository Root Not Provided
Branch Hint와 observed Branch 불일치
Commit Hint와 observed Commit 불일치
Unsupported Trigger
Routing Consumer Exception
Artifact Write Failure
Partial Output
Output Symlink Escape
Tracked File Overwrite Attempt
Secret-like Value in Candidate Summary
Execution Policy Candidate가 최종 Policy로 승격되지 않음
```

---

## 35. 완료 조건

Work-start Contract 완료 조건:

```text
Contract 문서 존재
입력·출력 Schema 정의
Routing Metadata / Consumer 정렬
Fail-open 정의
Secret 제외 정의
Risk Candidate 정의
Handoff Seed 정의
Human Review 정의
Contract Validation 존재
Positive / Negative Fixture 존재
```

Implementation 완료 조건:

```text
현재 Work-start Script가 Contract 출력 생성
Skill Matcher가 공식 Trigger Contract 준수
Partial / Failure 상태 표현
Output Path Safety 보장
Repository 수정 없음
```

---

# Part IX. Non-goals

## 36. V1 비목표

```text
Managed Task Entity
Global Task ID
Automatic Worker Launch
Automatic Prompt Delivery
Automatic Result Collection
Session Discovery
Cloud Context Store
Managed Memory
Automatic Project Context Update
Skill Automatic Execution
Runtime Recommendation Service
```

---

## 37. 채택하지 않는 방향

### Work-start가 모든 Context를 자동 수집

필요 최소 Context만 Candidate로 선택한다.

### 검색 결과를 Fact로 승격

검색 결과는 Candidate다.

### Skill 후보 자동 실행

Routing은 Advisory다.

### Work-start와 Handoff 통합

Candidate 생성과 승인된 작업 계약을 구분한다.

### Work-start와 Project Context 통합

Task-scoped Candidate와 Durable Context를 구분한다.

---

# Part X. Open Decisions

## 38. 미결정 사항

1. Work-start Summary의 정확한 파일명
2. Markdown과 YAML 병행 여부
3. Schema Validation 도구
4. Relevance Score 형식
5. Confidence 표준
6. 기본 Context 탐색 깊이
7. Dirty Worktree 검사 범위
8. Secret Pattern 목록 관리 방식
9. Context Size Limit
10. Artifact Output Directory
11. Keyword-only Routing 유지 여부
12. Intent·Pattern Trigger 도입 시점
13. Handoff Seed 자동 생성 수준
14. Interactive Review UI 도입 여부

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 39. 불변조건

1. Work-start는 Candidate 생성 단계다.
2. Work-start는 Local-only로 동작 가능해야 한다.
3. Work-start는 Runtime을 자동 실행하지 않는다.
4. Work-start는 Repository를 수정하지 않는다.
5. Skill Routing은 Advisory다.
6. Routing 실패는 Generic Handoff Seed 생성을 막지 않는다.
7. 검색 결과는 자동 Fact가 아니다.
8. Secret은 기본 제외한다.
9. Handoff Seed는 최종 Handoff가 아니다.
10. Human Review 전 전송·실행·수정을 하지 않는다.
11. Work-start와 Project Context 책임을 분리한다.
12. Work-start와 Result 책임을 분리한다.
13. Managed Task ID와 Cloud는 V1 비범위다.
14. Partial Output을 전체 성공으로 표시하지 않는다.

---

## 40. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/product/development-harness-report.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/architecture/local-cloud-human-boundary.md
docs/testing/v1-fixture-plan.md
```

---

## 41. 검수 관점

### 제품

- Work-start가 사용자 가치를 제공하면서 Handoff 책임을 침범하지 않는가
- Local-only와 Human-controlled 원칙이 유지되는가
- V2 기능이 유입되지 않았는가

### Contract

- 입력과 출력이 구현 가능한 수준으로 구체적인가
- Candidate와 Fact가 구분되는가
- Routing과 Context Gap을 표현할 수 있는가
- Failure와 Partial 상태가 충분한가

### 구현

- 현재 Work-start 자산을 Adapt할 수 있는가
- Skill Matcher와 Metadata Contract가 정렬 가능한가
- Repository 수정 없이 Artifact를 생성할 수 있는가

### 안전

- Secret과 민감 Context가 기본 제외되는가
- 자동 Skill 실행과 자동 Runtime 실행이 금지되는가
- Fail-open이 안전한가
