---
title: Context Checkpoint Guard C-lite Contract
status: draft
implementation_status: not_verified
owner: product
last_reviewed: 2026-07-28
supersedes: []
superseded_by: []
related_decisions:
  - DEC-012
  - DEC-051
  - DEC-062
  - DEC-063
source_inputs:
  - docs/decisions/decision-log.md
  - docs/product/v1-completion-criteria.md
  - docs/contracts/handoff-basic-contract.md
  - docs/testing/v1-fixture-plan.md
---

# Context Checkpoint Guard C-lite Contract

## 1. 목적과 제품 경계

Context Checkpoint Guard C-lite는 Work-start를 사용하지 않은 일반 작업에서도
중요한 변경이 Durable Project Context에서 누락될 수 있음을 안전한 작업 경계에서
사용자에게 알리고, `project-context`의 Context Checkpoint 흐름으로 연결한다.

```text
Context Checkpoint Guard
= Context 갱신 필요 여부를 검토할 기회
≠ Context 내용의 자동 이해
≠ Context 자동 저장
≠ Handoff Artifact 생성
```

이 Contract는 Public `v1.0.0` Baseline을 변경하지 않는 post-v1.0 Public V1.x Gate다.
Foundation 계약만 확정하며 Product Runtime 구현, Hook 지원 또는 Fixture 통과를 주장하지 않는다.

## 2. Work-start 비의존

```text
Work-start 사용
→ 기존 Context Candidate와 Handoff 흐름 유지

Work-start 미사용
→ 인식 가능한 Activity Signal이 있으면 Checkpoint 검토 가능
```

Work-start는 Guard의 필수 진입점이 아니다. Work-start 실행 여부 자체도
Context Significance의 증거가 아니다.

## 3. Activity Signal과 Context Significance

두 의미를 분리한다.

```text
Activity Signal
= 현재 Checkpoint Epoch에 작업 활동이 있었다는 관찰

Context Significance
= 그 활동에서 Human-confirmed Durable Project Context에 남길 내용이 있는지에 대한 사용자 판정
```

Runtime Adapter가 Activity Signal을 감지할 수는 있지만, Guard가 다음을 자동 판정해서는 안 된다.

```text
중요한 Decision이 확정됐다
Risk가 Durable Context다
파일 변경이 반드시 Context Update를 요구한다
대화 내용이 Project Context다
```

## 4. C-lite 상태 모델

Workflow 상태는 두 개만 사용한다.

```text
clean
= 현재 Epoch에서 검토를 요구하는 인식된 Activity Signal이 없음

review_needed
= Activity Signal이 있어 Context 반영 여부를 사용자가 검토해야 함
```

`checkpointed`와 `no_update`는 Workflow 상태를 늘리는 값이 아니라 Human Review 결과다.

```text
checkpointed
= 사용자가 Context Update를 승인·완료하고 확인함

no_update
= 사용자가 검토했으나 이번 Epoch에는 Context Update가 불필요하다고 결정함
```

두 결과 모두 자동 판정할 수 없다. 결과가 기록되면 현재 Epoch를 해결하고 다음 Epoch를
`clean`으로 시작한다.

읽기 실패나 Hook 미지원은 `clean`이 아니다. Workflow 상태와 별도의 진단 축을 둔다.

```text
availability: available | unavailable
```

`unavailable`은 새 Workflow 상태가 아니며, 자동 저장 없이 fail-open과 Manual Context
Checkpoint 안내를 선택하기 위한 진단값이다.

## 5. 최소 상태 전이

```text
clean
→ 인식 가능한 Activity Signal
→ review_needed

review_needed
→ Human Review + 승인된 Context Checkpoint
→ resolution: checkpointed
→ 새 Epoch / clean

review_needed
→ Human Review + 사용자 no_update 선택
→ resolution: no_update
→ 새 Epoch / clean

checkpointed 또는 no_update
→ 실제 새 Activity Signal
→ 새 Epoch에서 review_needed 가능
```

Activity가 없는 `clean` Epoch에서는 Checkpoint 알림을 만들지 않는다.
이전 Epoch의 해결 결과는 이후 Activity를 영구 억제하지 않는다. 동일 Activity Event의
중복 전달은 멱등하게 처리하되, 실제 새 Activity Signal은 이전 Event와 구분해 다음 지원
Boundary에서 다시 검토할 수 있어야 한다. 특정 Hash 알고리즘이나 Event Sequence는 구현에 맡긴다.

## 6. Activity Signal Source

C-lite가 사용할 수 있는 후보 신호:

```text
file_change
validation_run
commit_or_pr_activity
explicit_design_or_decision_marker
handoff_request
managed_session_end
```

신호는 실제 Claude Code·Codex 또는 `oh-my-ai` Adapter가 제공하는 Hook Surface 안에서만
수집한다.

허용 예:

```text
Runtime이 제공하는 file edit / tool completion Hook
oh-my-ai가 직접 실행·관찰한 validation action
oh-my-ai가 소유한 PR·Merge 흐름 또는 Provider가 제공한 lifecycle Hook
명시적 project-context / handoff action
oh-my-ai가 관리하는 session lifecycle boundary
```

금지:

```text
모든 Shell 명령 전역 감시
모든 Git 명령 가로채기
IDE 전체 감시
OS 전역 감시
Background Transcript Capture
모델 호출을 통한 대화 의미 분류
```

Adapter는 자신이 관찰할 수 있는 Signal 종류와 Boundary를 Capability로 정직하게 선언한다.
Claude Code와 Codex에 동일한 Hook 구현을 강제하지 않는다.

## 7. 초기 Trigger 경계

C-lite의 초기 우선순위는 다음과 같다.

```text
1. Structured Handoff Candidate 생성 전
2. oh-my-ai가 관리하는 Session 종료 경계
3. oh-my-ai가 인식할 수 있는 PR·Merge 전 경계
```

지원하지 않는 경계를 지원한다고 추정하지 않는다. 일반 Shell에서 직접 실행된 모든
`git commit`, `git push`, `git merge`를 감시하는 기능은 초기 범위가 아니다.

### 7.1 Advisory SessionEnd

`SessionEnd` 또는 동등한 종료 경계는 Human Review를 기다리거나 Session 종료를 차단하는
Decision Gate가 아니다. 이 경계에서 `review_needed`가 해결되지 않았다면 Guard는 다음
검토 기회가 필요하다는 최소 상태만 보존한다.

```text
unresolved review_needed
→ 자동 해결 없음
→ checkpointed / no_update 자동 전환 없음
→ Durable Context 자동 저장·Promotion 없음
→ Handoff Candidate 자동 생성 없음
→ Session 종료 계속
```

SessionEnd Hook 또는 State 쓰기가 실패해도 Session 종료를 막지 않는다.

### 7.2 다음 Session의 One-time Diagnostic

동일 Repository·Worktree에서 prior Session의 unresolved Epoch를 확인할 수 있고 다음 지원
Runtime Session이 시작되거나 사용자의 첫 적절한 Prompt 경계에 도달하면, Guard는 Context
Checkpoint가 미해결 상태였음을 한 번 안내하고 다음 Manual Review 선택지를 제공한다.

```text
Context Checkpoint 진행
이번에는 no_update로 확인
현재 작업을 계속하고 나중에 검토
```

세 번째 선택과 안내 자체는 Epoch를 해결하지 않으며 `checkpointed` 또는 `no_update`를
기록하지 않는다.

```text
same repository
same worktree
prior unresolved epoch
new supported session / review surface
→ one-time diagnostic
```

동일 unresolved Epoch를 같은 Session에서 무한 반복 안내하지 않는다. Diagnostic은 이전
Session의 Prompt·응답·파일·Diff를 복사하거나 Structured Handoff Candidate를 생성하지 않으며,
DEC-062 Pending Handoff Rehydration이 아니다. 다른 Repository나 Worktree에는 노출하지 않는다.
구체적인 Hook 파일, State 파일 경로와 Schema는 Product 구현에 맡긴다.

## 8. Human Review와 Handoff Decision Gate

`review_needed`에서 Guard는 다음 중 하나를 사용자가 직접 선택하도록 한다.

```text
Context Checkpoint 진행
no_update 확인
경고를 확인하고 Manual Handoff 계속
```

기본 선택이나 자동 선택은 없다. `review_needed`만으로 Handoff를 Hard Block하지 않는다.
Guard는 경고와 Human Decision Gate를 제공하고, 사용자가 Manual Handoff를 계속할 수 있게 한다.

사용자가 미해결 상태로 Manual Handoff를 계속하면 Structured Handoff Candidate는 다음과
같은 canonical 동등 표현으로 그 사실을 보존해야 한다.

```text
Context checkpoint status: review_needed / unresolved
```

Candidate는 Context가 최신이거나 Context Review가 완료됐다고 단정해서는 안 된다.
unresolved 상태를 누락하거나 자동으로 `checkpointed` 또는 `no_update`로 전환해서도 안 된다.

Secret 노출, 금지된 작업 또는 별도 Execution Policy 위반처럼 독립적인 Safety Contract가
Hard Block을 요구할 수는 있다. 그 차단은 Guard 상태 때문이 아니다.

## 9. 자동 저장과 Promotion 금지

Guard는 Context를 직접 확정하지 않는다.

```text
Context Update Candidate 생성 또는 Manual Checkpoint 안내
→ Human Review
→ 사용자 승인
→ project-context가 Durable Context Promotion
```

금지:

```text
대화 전체 자동 저장
Raw Prompt 자동 저장
AI 응답 전체 자동 저장
파일 내용 자동 저장
Code Diff 전체 자동 저장
중요 Decision 자동 확정
Durable Project Context 자동 덮어쓰기
Context 자동 요약
Context 자동 Promotion
```

Candidate 생성이 실패해도 기존 작업을 차단하거나 원문 저장으로 대체하지 않는다.

## 10. Scope와 Checkpoint Epoch

Guard 상태 키는 최소 다음 Scope를 분리한다.

```text
Repository Identity
Worktree Identity
Runtime
Session Identity
Checkpoint Epoch
```

Identity는 원문 대신 로컬에서 계산한 안정적인 Hash를 사용한다. Repository와 Worktree는
서로 다른 필드이며 같은 Repository의 다른 Worktree를 합치지 않는다.

Checkpoint Epoch의 최소 정의:

```text
마지막 checkpointed 또는 no_update 이후
다음 Human Review 결과 전까지의 작업 구간
```

새 Scope에서 이전 Scope의 현재 상태를 재사용하지 않는다. 이전 Session의 미해결
`review_needed`를 새 Session의 현재 상태로 자동 복사하거나 Promotion하지 않는다. 다만 동일
Repository·Worktree의 unresolved Epoch에 대한 최소 참조는 7.2의 one-time diagnostic을 위해
보존할 수 있다. 이 참조는 prior Session 상태와 새 Session 상태를 합치는 것이 아니며, 같은
Session에서 매 경계마다 무기한 재알림하는 근거가 아니다.

## 11. 중복 알림 억제

알림은 다음 식별자를 기준으로 억제한다.

```text
Repository Hash
Worktree Hash
Runtime
Session Hash
Epoch ID
Boundary Kind
```

같은 Epoch와 같은 Boundary Kind에서 이미 표시한 알림은 마지막 알림 이후 새 Activity Signal이
없으면 반복하지 않는다. 새 Signal이 있으면 다음 지원 Boundary에서 한 번만 다시 검토하고
`last_notified_at`을 갱신한다. Human Review 결과가 기록되면 Epoch가 종료된다.

같은 Activity Event가 중복 또는 동시에 전달되면 동일 Epoch에서 멱등하게 처리한다. 중복 억제가
마지막 해결 이후 발생한 실제 새 Activity까지 억제해서는 안 된다.

## 12. 최소 Metadata와 Privacy

저장 허용 Metadata:

```text
repository_hash
worktree_hash
runtime
session_hash
epoch_id
activity_signal_kinds
first_activity_at
last_activity_at
checkpoint_state
last_notified_boundary
last_notified_at
resolution
resolved_at
promotion_source_ref
availability
```

`promotion_source_ref`는 Human-approved `project-context` Checkpoint의 opaque한 Local
Identifier 또는 민감 원문을 포함하지 않는 Sanitized Reference여야 한다. Context 본문이나
Evidence 원문을 복제하는 통로로 사용할 수 없다. Timestamp는 Epoch와 중복 알림 억제에 필요한
최소 운영 정보다.

`promotion_source_ref`에도 다음 원문을 포함하지 않는다.

```text
Prompt·AI 응답·사용자 입력 전체
파일 내용·Code Diff·Raw Tool Output
Secret·Token·Credential
절대 경로·Git Remote
```

기본 저장 금지:

```text
Prompt 원문
AI 응답 원문
파일 내용
Code Diff
Raw Tool Output
Git Remote 원문
절대 경로 원문
Secret
Token
Credential
환경변수 원문
```

Telemetry, Cloud Sync와 외부 전송은 C-lite 범위가 아니다.

## 13. Fail-open

다음 실패는 사용자의 기존 작업, Session 종료, Handoff 또는 PR·Merge 진행을 차단하지 않는다.

```text
State 읽기 실패
State 쓰기 실패
Atomic write 또는 rename 실패
State Schema 불일치
손상된 State
Repository 식별 실패
Worktree 식별 실패
Session 식별 실패
Hook 미지원
Hook 실행 실패
중복·동시 Event 처리 실패
Context Candidate 생성 실패
```

실패 시:

```text
기존 작업 계속
Session 종료 계속
Handoff 계속
PR·Merge 계속
자동 Context 저장 없음
자동 Promotion 없음
availability: unavailable
가능하면 Manual Context Checkpoint 안내
```

`unavailable`을 `clean`으로 기록하거나 성공으로 표현하지 않는다.
State 쓰기가 실패했는데 Human Review 결과를 성공적으로 기록한 것처럼 `checkpointed` 또는
`no_update`로 표시해서도 안 된다.

## 14. 책임 경계

```text
project-context
= Human-confirmed Durable Project Context 관리
= CREATE / UPDATE / CONTEXT CHECKPOINT

handoff-prompt
= 현재 Task를 다음 Worker Session에 전달하는
   Structured Handoff Candidate 생성

Context Checkpoint Guard
= Context 검토 필요 상태 감지
= project-context Checkpoint 흐름 연결
≠ 새 Handoff Artifact 생성
```

## 15. DEC-062와의 관계

두 기능은 합치지 않는다.

```text
Context Checkpoint Guard C-lite
= Handoff가 없어도 작업 후 Context Capture 검토 기회를 제공

DEC-062 Automatic Next-session Handoff Rehydration
= 이미 존재하는 Pending Handoff Candidate를 다음 Session에 연결
```

Runtime의 의미 순서:

```text
작업 활동
→ review_needed
→ SessionEnd advisory 최소 상태 보존
→ 다음 Session one-time diagnostic
→ Human Review
→ checkpointed / no_update
→ 필요 시 Structured Handoff Candidate 생성
→ Pending 등록
→ DEC-062 Next-session Rehydration
```

One-time diagnostic은 미해결 Context 검토 상태의 다음 검토 기회일 뿐, Context Checkpoint
상태를 Pending Handoff Candidate로 변환하지 않는다.

DEC-062가 기록한 Product delivery priority와 Public `v1.1.0` Gate는 변경하지 않는다.
여기서 선행한다는 의미는 Runtime data-flow의 Capture Gate 순서이며, DEC-062를 supersede하거나
그 Pending Candidate 연결 조건을 변경한다는 뜻이 아니다.

## 16. 최소 Fixture 계약

Product 구현 PR은 `docs/testing/v1-fixture-plan.md`의 다음 Fixture를 구현하고 증거를 남긴다.

```text
FX-CCG-001  Work-start 없이 파일 수정 신호 → review_needed
FX-CCG-002  Activity 없음 → clean
FX-CCG-003  사용자 checkpoint 승인 → checkpointed, 동일 경계 재알림 없음
FX-CCG-004  사용자 no_update 선택 → no_update, 동일 경계 재알림 없음
FX-CCG-005  해결 후 새 Activity → 새 Epoch review_needed, 중복 Event는 멱등 처리
FX-CCG-006  최소 1개 Runtime SessionEnd → 다음 Session one-time diagnostic
FX-CCG-007  State 쓰기·Session 식별·Hook 실행 실패 → unavailable fail-open
FX-CCG-010  다른 Repository → 상태 격리
FX-CCG-011  같은 Repository의 다른 Worktree → 상태 격리
FX-CCG-012  손상된 State → fail-open, 자동 저장 없음, Manual fallback
FX-CCG-013  Hook 미지원 Runtime → 기존 작업 유지, Manual fallback
FX-CCG-014  미해결 Handoff → 허용하되 unresolved 표시와 Truthfulness 유지
FX-CCG-015  Raw Content와 민감한 promotion_source_ref 미저장
```

Fixture 정의만 존재하는 것은 Product 구현 또는 Pass 증거가 아니다.

## 17. Out of Scope

```text
Product Runtime 코드
Hook 구현
State 파일 경로·Schema 구현
Transcript Capture
Background Daemon
상주 Scheduler
모델 호출
Context 자동 요약
Context 자동 Promotion
DEC-062 Product 구현
Managed Session Linking
Claude·Codex 자동 실행
Cloud Sync
Telemetry
```

## 18. 구현 완료와 다른 것

```text
DEC-063 accepted
Contract merged
Fixture plan defined
≠ Product implementation completed
≠ Runtime Hook supported
≠ Fixture passed
≠ Manual E2E passed
```
