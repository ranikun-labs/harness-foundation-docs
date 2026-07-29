---
title: V1 Completion Criteria — v1.0.0 Baseline and Public V1.x Delta Gates
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
source_inputs:
  - docs/product/development-harness-report.md
  - docs/master/product-architecture-master.md
  - docs/roadmap/product-roadmap.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/contracts/context-checkpoint-guard-contract.md
  - docs/contracts/pending-handoff-rehydration-contract.md
---

# V1 Completion Criteria — v1.0.0 Baseline and Public V1.x Delta Gates

## 1. 문서 목적

이 문서는 `oh-my-ai` Public `v1.0.0` Baseline과
Public `v1.1.0` 및 이후 V1.x Delta Gate의 완료 조건을 함께 관리한다.

별도로 `Public v1.1.0 Delta Gate` 또는 post-v1.0 `Public V1.x Gate`라고 표시한 절을
제외한 기존 V1 완료 조건은 Public `v1.0.0` Baseline을 의미한다.

목적은 다음과 같다.

1. V1의 제품 범위를 고정한다.
2. 구현 완료와 출시 가능 상태를 구분한다.
3. Release Blocking 항목을 명확히 한다.
4. Handoff와 Result 흐름이 실제로 닫혔는지 판정한다.
5. V2 기능이 V1 완료 조건에 유입되는 것을 막는다.
6. 기능 구현, Contract, Fixture, Documentation, Truthfulness를 하나의 Release Gate로 연결한다.
7. 다음 구현자가 무엇을 완료해야 V1을 종료할 수 있는지 판단 가능하게 한다.

이 문서는 일정이나 출시 날짜를 정의하지 않는다.

이 문서는 **무엇이 끝나야 V1이 완료되는지**를 정의한다.

---

## 2. Public v1.0.0 Baseline 제품 정의

V1 Community는 다음 제품이다.

```text
무료
Local-only
Local Manual Artifact Workflow
Runtime-neutral
Human-controlled
Cloud-independent
```

기본 흐름:

```text
사용자 Task 입력
→ Skill Routing
→ Work-start Candidate
→ Project Context 참조
→ Structured Handoff Candidate
→ Human Review
→ Worker Session에 수동 Copy/Paste
→ Worker가 Result Basic 수동 형식으로 반환
→ Human Review
```

이 제품 정의와 기본 흐름은 이미 완료·출시된 Public `v1.0.0` Baseline이다.
당시 기본 전달 방식은 Manual Copy/Paste였다. DEC-062는 이 완료 상태나
`v1.0.0` Tag·Release를 소급 변경하지 않는다.

V1의 핵심 가치는 다음과 같다.

```text
작업 전달 품질 향상
Scope 보존
Do Not Touch 보존
Facts / Assumptions / Open Issues 분리
Result Truthfulness
Validation 상태 명시
Runtime 종속 감소
Human-controlled Delegation
```

---

## 3. Public v1.0.0 Baseline 완료의 의미

V1 완료는 다음을 모두 의미한다.

```text
Contract complete
Implementation complete
Fixture complete
Documentation complete
Truthfulness verified
Manual end-to-end pass
```

다음 중 하나만 만족해서는 완료가 아니다.

```text
문서 작성 완료
코드 작성 완료
CLI 명령 존재
샘플 출력 존재
수동 데모 1회 성공
```

V1은 Contract와 Workflow 전체가 함께 닫혀야 한다.

---

## 4. Public v1.0.0 Baseline 포함 범위

```text
Local Installation
Instruction Cascade
Skill Registry
Skill Routing
Prompt Routing Hook
Work-start
Project Context
Structured Handoff Candidate
Manual Copy/Paste
Local Candidate Artifact
Result Basic 수동 Template
Human Review
Human Review Next Step 선택지 표시
최소 Positive / Negative Fixture
Manual E2E Demo
Doctor
재현 가능한 최소 설치·실행 경로 1개
Truthfulness
Provenance
Local Product Notice Channel
Runtime-readable Version Source
```

Local Product Notice Channel과 Runtime-readable Version Source는
DEC-054, DEC-055, ADR-0011로 채택된 항목이다.

Notice는 자동 Update, 자동 설치, 자동 Login, Cloud 연결을 의미하지 않는다.

재현 가능한 최소 설치·실행 경로 1개는 사용자가 한 가지 공식 경로로 로컬 설치와 기본 Workflow 실행을 재현할 수 있음을 의미한다. npm과 Homebrew 동시 지원, 복수 OS Installer, 자동 업데이트, 완성된 범용 CLI Product Shell은 V1 P0 요구가 아니다.

---

## 5. Public v1.0.0 Baseline 비범위

```text
User / Auth
Billing
Entitlement
Managed Task ID
SessionBinding
ExecutionRun Entity
ExecutionWorkspace Entity
ResultArtifact ID
Automatic Session Discovery
Automatic Prompt Delivery
Automatic Result Collection
Cloud Sync
Managed Memory
Learning Loop
SkillOpt
Runtime Broker
Sidecar
Remote Execution
Managed Task
Task Registry
Worker Result Channel
Result 자동 저장
Main Result 자동 감지
Task / Result Correlation
Completion Detection
Review Queue
Context 자동 Import
Runtime Invocation
Managed Result Return
Worktree 자동 생성
Worker Branch Lifecycle
복수 Worker Coordination
Merge / Apply Gate 자동화
Organization Governance
Cloud Notice API
사용자별 서버 Audience
자동 Update
자동 V2 설치
Push Notification
상주 Daemon / Scheduler / OS Service
서명 Manifest 구현
```

비범위 항목이 구현되지 않았다는 이유로 V1을 미완료로 판정하지 않는다.

---

# Part I. Contract Completion

## 6. Work-start Contract

Work-start의 책임:

```text
사용자 Task 입력
→ Local Context Candidate
→ Skill Candidate
→ Risk Candidate
→ Handoff Seed
```

Work-start는 다음을 보장해야 한다.

- Local-only로 동작 가능
- Source of Truth를 명시
- Context Candidate와 Confirmed Fact를 구분
- Skill Candidate와 실제 실행을 구분
- Secret, Private Profile, Generated File 제외
- Routing 근거 표시
- No-match와 Ambiguous 상태 표현
- Handoff가 필요로 하는 Seed를 생성

Work-start가 직접 소유하지 않는 것:

```text
최종 Scope 승인
Do Not Touch 확정
Worker 실행
Result 수집
Canonical Truth 승격
```

완료 조건:

```text
Work-start Contract 문서 존재
필수 출력 Schema 정의
Routing Consumer와 Metadata Contract 정렬
Positive / Negative Fixture 존재
Broken-index Fail-open 확인
```

필수 출력 Schema는 최소 다음 의미를 포함한다.

```text
Task Summary
Context Candidates
Skill Candidates
Risk Candidates
Routing Reason
Match Status
Handoff Seed
Excluded Sensitive Inputs
```

---

## 7. Structured Handoff Contract

Handoff는 특정 작업을 Worker Runtime에 전달하는 단기 Artifact다.
V1 P0의 산출물은 Human Review 전 승인 완료 상태나 실행 허가가 아닌 `Structured Handoff Candidate`다.

필수 필드:

```text
schema_version
handoff_ref
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
return_format
repository_context
created_at
```

필수 의미:

- `goal`: 작업 목적
- `scope`: 이번 작업에서 다룰 범위
- `allowed_actions`: 허용된 작업
- `prohibited_actions`: 금지된 작업
- `do_not_touch`: 변경 금지 대상
- `confirmed_facts`: 검증된 사실
- `assumptions`: 확인되지 않은 전제
- `open_issues`: 해결되지 않은 문제
- `expected_output`: 반환 형식
- `completion_criteria`: 완료 판정 기준
- `validation_required`: 필요한 검증
- `return_format`: Result Basic 요구

완료 조건:

```text
Contract 문서 존재
Required Field 정의
Confirmed Fact와 Confirmed Decision의 Source 또는 Provenance 표현 가능
Good Example 존재
Bad Example 존재
Runtime-neutral 표현 유지
Manual Copy/Paste 가능한 provider-neutral Markdown 존재
Scope / Do Not Touch 보존 Fixture 존재
필수 필드 누락 Negative Fixture 존재
```

범용 Handoff Validator, Export 차단, Runtime Projection 제품 기능은 V1 Alpha 품질 기능이며 V1 P0 완료 조건이 아니다.

`handoff_ref`는 Local Artifact 간 상관관계를 위한 로컬 참조값이다.

```text
handoff_ref
≠ Managed Task ID
≠ SessionBinding
≠ Cloud Entity ID
```

---

## 8. Result Basic Contract

Result Basic은 Worker Runtime이 반환하는 검토 가능한 결과 Artifact다.

필수 필드:

```text
schema_version
source_handoff_ref
status
what_was_done
findings
evidence
files_read
files_changed
commands_run
validation_performed
validation_not_performed
validation_results
assumptions
unresolved_risks
deviations_from_scope
recommended_next_action
created_at
```

허용 상태:

```text
complete
partial
failed
blocked
```

`source_handoff_ref`는 Result가 어떤 Local Handoff Artifact에서 파생됐는지 연결한다.

`evidence`는 최소한 다음 중 하나를 참조할 수 있어야 한다.

```text
File
Command
Validation Result
Output Fragment
```

필수 의미:

- `source_handoff_ref`: 어떤 Handoff의 결과인지
- `status`: 완료·부분 완료·실패·차단
- `files_read`: 읽은 파일
- `files_changed`: 변경한 파일
- `commands_run`: 실행한 명령
- `validation_performed`: 실제 수행한 검증
- `validation_not_performed`: 수행하지 않은 검증
- `unresolved_risks`: 남은 위험
- `deviations_from_scope`: Scope 이탈
- `recommended_next_action`: 다음 조치

금지:

```text
실행하지 않은 검증을 Pass로 기록
읽은 파일을 수정한 파일로 기록
부분 완료를 전체 완료로 기록
가정을 Fact로 기록
Scope 이탈을 숨김
Result 누락을 성공으로 기록
```

완료 조건:

```text
Contract 문서 존재
Required Field 정의
Good Example 존재
Bad Example 존재
Lint 또는 Validation 존재
Validation Not Performed 표현 가능
Missing / Partial Result 표현 가능
Truthfulness Fixture 통과
```

---

## 9. Static Capability Contract

V1 Runtime Adapter는 지원 기능을 정적으로 선언해야 한다.

대표 Capability:

```text
prompt.initial
session.resume
file.read
file.edit
shell.execute
validation.run
result.structured
workspace.worktree
```

Capability Contract는 다음을 보장해야 한다.

```text
supported
unsupported
conditional
unknown
```

구분:

```text
Capability
= Runtime이 기술적으로 가능한가

Execution Policy
= 현재 작업에서 허용·승인 필요·금지되는 행동인가

Entitlement
= V1 비범위
```

## 9.1 Execution Policy Contract

Execution Policy 완료 조건:

```text
Execution Policy Contract 존재
허용 / 승인 필요 / 금지 행동 구분
Capability와 Execution Policy 충돌 시 처리 정의
Unsupported 또는 Unknown Capability를 Policy가 허용으로 과장하지 않음
Runtime Adapter가 Policy를 임의 완화하지 않음
Positive / Negative Fixture 존재
```

완료 조건:

```text
최소 1개 V1 지원 Runtime의 Capability Metadata 존재
V1 지원 Runtime으로 공개되는 각 Adapter의 Capability Metadata 존재
Unsupported Capability 명시 가능
Conditional Capability의 조건 표현 가능
Unknown Capability의 미확인 사유 표현 가능
Projection이 Capability를 과장하지 않음
Capability / Policy 분리 Fixture 통과
```

---

## 9.2 Product Notice Contract

Product Notice 완료 조건:

```text
Product Notice Contract 존재
명시적 Work-start 외 경로에서 Notice 미발생
Cache-first Display와 Next-run Visibility 구현
Notice 실패의 Work-start 무영향 검증
Artifact에 Notice 혼입 없음 검증
Offline 환경에서 Work-start 정상 완료 검증
Opt-out 상태에서 Network 호출 없음 검증
Manifest 내용 미실행 검증
Manifest Cache와 사용자 선택 State 분리
Positive / Negative Fixture 존재
```

Public Documentation 완료 조건:

```text
Notice 목적 명시
전송 금지 데이터 범위 명시
HTTPS 요청 과정의 Network Metadata 노출 명시
Dismiss 방법 명시
전체 Opt-out 방법 명시
```

Network Metadata 노출 설명을 생략하거나 축소하면 완료로 판정하지 않는다.

---

## 9.3 Runtime Version Source

Version Source 완료 조건:

```text
제품 Runtime이 Network 없이 읽을 수 있는 canonical Version Source 존재
Version 값이 SemVer로 해석 가능
Version 판독 실패 시 Notice Audience Match를 수행하지 않음
Public Stable Release Tag가 SemVer-clean 형식
Public V1 정식 공개 Tag가 v1.0.0
설명 문구가 Tag 접미사가 아니라 Release Title / Notes에 존재
```

Roadmap 문서를 Runtime Version Source로 사용하지 않는다.

---

# Part II. Workflow Completion

## 10. Public v1.0.0 Baseline — Manual Handoff Flow

필수 흐름:

```text
Work-start Candidate
→ Structured Handoff Candidate 생성
→ Human Review
→ Manual Copy/Paste
```

Human Review 필수 항목:

```text
Goal
Scope
Allowed Actions
Prohibited Actions
Do Not Touch
Confirmed Facts
Assumptions
Open Issues
Expected Output
Validation Required
```

완료 조건:

- Work-start 출력에서 Handoff Candidate 생성 가능
- 사람이 필드를 수정 가능
- 필수 필드 누락 시 경고
- provider-neutral Markdown을 수동 전달 가능
- Structured Handoff Candidate가 새 Handoff Engine, Packet Lifecycle, Task Engine으로 표현되지 않음
- Runtime Invocation, Session Linking, Result 자동 반환과 분리됨
- 사용자 승인 전 자동 실행하지 않음

---

## 10.1 Public v1.1.0 Delta Gate — Automatic Next-session Handoff Rehydration

DEC-062에 따라 Automatic Next-session Handoff Rehydration은 Public `v1.1.0` P0이며,
권장 공개 버전은 `v1.1.0`이다. 이는 `v1.0.0`의 완료 상태, Tag, Release를 소급 변경하지 않는
별도 Gate다.

기본 흐름:

```text
명확한 Handoff 실행 의도
→ 정제된 Pending Candidate
→ 안전한 자동 연결 조건 확인
→ 새 세션에서 Candidate 사용 가능 근거 확인
→ Candidate 경계 재검증
```

Manual Copy/Paste는 기본 전달 방식이 아니라 Automatic Rehydration을 안전하게 수행할 수 없을 때의
Manual Resume fallback이다.

자동 연결 Gate:

```text
- 같은 Repository와 같은 Worktree
- source_session_id와 다른 current_session_id
- 두 Session ID 모두 확인 가능
- Pending Candidate가 정확히 1개이고 미만료
- Runtime·Hook 지원 확인
- Unknown을 Supported로 추정하지 않음
```

Multiple Pending은 자동 선택하지 않는다. 최신 Candidate, 유사 Goal, 생성 시각을 기준으로도
임의 선택하지 않고 Manual Resume를 제공한다.

Candidate는 Durable Fact가 아니다. 새 세션은 Branch, HEAD, Working Tree, 실제 파일 상태,
완료 주장, 검증 결과를 다시 확인해야 한다.

다음은 성공 증명이 아니다.

```text
Artifact 생성
Claim
Hook 호출
Context 출력 시도
Manual Resume 안내
```

대상 세션에서 Candidate를 사용할 수 있다는 근거가 없으면 성공으로 표현하지 않는다.

V1.1.0 P0 완료 조건:

- 명확한 실행 의도만 Pending Handoff 생성 동의로 처리
- Raw Transcript, Raw Tool Output, Secret, Token, Credential, 환경변수 원문을 저장하지 않음
- Candidate에 Source Session, Repository, Worktree, Goal, Completed, Open Issues, Verification, Do Not Touch, Next Action, `candidate` Status를 포함
- Hook 비활성, Runtime 미지원, Session ID 확인 불가, Repository·Worktree 불일치, Multiple Pending, State 손상, Artifact 만료, Claim·전달 실패, 전달 성공 확인 불가 시 Manual Resume 제공
- Handoff만으로 파일·Shell·Git·Worker·Commit·Push·PR·새 세션·Runtime Invocation·Result 자동 회수·Project Context 자동 Promotion을 실행하지 않음

### Positive Cross-session E2E Gate

다음 조건을 모두 만족하는 Cross-session E2E가 실제 완료 조건이다.

```text
- 같은 Repository
- 같은 Worktree
- source_session_id와 다른 current_session_id
- 미만료 Single Pending이 정확히 1개
- 대상 새 세션에 Candidate가 정확히 한 번 연결됨
- 같은 세션에서 Candidate가 반복 주입되지 않음
- 새 세션에서 Branch·HEAD·Working Tree를 재검증함
- 대상 세션이 Candidate를 사용할 수 있다는 전달 근거를 확인함
```

### Negative Fixture Gate

다음 입력별 Negative Fixture가 실제 완료 조건이다.

```text
- source와 같은 session_id
- Repository 불일치
- Worktree 불일치
- Pending 0개
- Pending 2개 이상
- 만료 Candidate
- 손상된 State
- Runtime 미지원
- Hook 비활성
- Session ID 확인 불가
```

각 경우 최신 Candidate나 유사 Goal을 근거로 자동 선택·자동 연결하지 않는다.
Manual Resume를 제공하거나, Resume 안내도 안전하게 만들 수 없으면 no-op으로 종료한다.

### Failure / Truthfulness Gate

다음 Fail-open과 Truthfulness 조건이 실제 완료 조건이다.

```text
- Hook 실패·timeout·non-zero가 새 세션 시작을 막지 않음
- 전달 실패로 Pending Artifact가 유실되지 않음
- Artifact 생성·Claim·Hook 호출만으로 delivered 또는 성공으로 표현하지 않음
- Raw Transcript·Raw Tool Output·Secret 저장 0건
- Handoff만으로 파일·Shell·Git·Worker·Runtime 실행 0건
```

현재 검증 상태:

```text
implementation: not_verified
fixture: not_verified
cross_session_e2e: not_verified
runtime_supported: not_verified
```

완료 조건만 확정한 것이며 어떤 항목도 Pass로 전환하지 않았다.
Runtime Adapter별 성공 확인의 최소 Evidence와 State·Claim·TTL·Consumption 결과 계약은
`docs/contracts/pending-handoff-rehydration-contract.md`가 소유한다. 실제 Adapter 구현과
Runtime별 Evidence는 여전히 `not_verified`다.

---

## 10.2 Post-v1.0 Public V1.x Delta Gate — Context Checkpoint Guard C-lite

DEC-063에 따라 Context Checkpoint Guard C-lite는 Public `v1.0.0` Baseline을 변경하지 않는
post-v1.0 Public V1.x Gate다. Foundation Merge 후 Product 구현을 시작할 수 있으나,
이 문서 변경만으로 구현·Runtime 지원·Fixture Pass를 주장하지 않는다.

목적:

```text
Work-start를 사용하지 않은 작업에서도
중요한 변경의 Durable Project Context 반영 여부를
안전한 작업 경계에서 사용자가 검토할 수 있게 한다.
```

필수 의미:

```text
Activity Signal
= 작업 활동이 있었다는 관찰

Context Significance
= Durable Context에 남길 필요가 있는지에 대한 사용자 판정
```

C-lite 상태와 Human Review 결과:

```text
clean
= 현재 Epoch에서 검토를 요구하는 인식된 Signal 없음

review_needed
= Signal이 있어 사용자 검토 필요

checkpointed
= 사용자가 Context 갱신을 승인·완료하고 확인한 결과

no_update
= 사용자가 검토 후 갱신 불필요를 선택한 결과
```

`checkpointed`와 `no_update`를 자동 판정하지 않는다. State·Hook을 사용할 수 없는 경우
`clean`으로 거짓 판정하지 않고 별도 `unavailable` 진단과 Manual Context Checkpoint fallback을 사용한다.

초기 Trigger:

```text
1. Structured Handoff Candidate 생성 전
2. oh-my-ai가 관리하는 Session 종료 경계
3. oh-my-ai가 인식할 수 있는 PR·Merge 전 경계
```

모든 Shell·Git 명령, IDE 작업 또는 OS Event를 전역 감시하지 않는다. Runtime Adapter는
실제 Hook Surface에서 관찰 가능한 Signal만 지원하며 Claude Code와 Codex의 비대칭을 허용한다.

상세 SessionEnd·one-time diagnostic·Privacy·fail-open 불변조건은
`docs/contracts/context-checkpoint-guard-contract.md`를 canonical source로 사용한다.

Public V1.x P0 완료 조건:

- Work-start 없이 발생한 인식 가능한 작업 활동을 `review_needed` 검토 대상으로 만들 수 있음
- Activity Signal과 Context Significance를 구분함
- `checkpointed`와 `no_update`가 Human Review 결과이며 자동 판정되지 않음
- Context Update Candidate 또는 Manual 안내에서 Human Review와 사용자 승인 후에만 Promotion 가능
- 대화·Raw Prompt·AI 응답·파일 내용·Code Diff 전체를 자동 저장하지 않음
- 중요 Decision 자동 확정과 Durable Context 자동 덮어쓰기를 금지함
- Repository·Worktree·Runtime·Session·Checkpoint Epoch Scope를 분리함
- 다른 Repository 또는 같은 Repository의 다른 Worktree 상태를 혼합하지 않음
- 마지막 알림 이후 새 Signal이 없는 같은 Epoch·Boundary의 중복 알림을 억제하고
  이전 Session 상태를 무기한 재알림하지 않음
- `checkpointed`와 `no_update` 이후 실제 새 Activity가 새 Epoch에서 다시 `review_needed`가 될 수 있음
- 최소 1개 지원 Runtime에서 일반 Activity부터 advisory SessionEnd와 다음 one-time review opportunity까지 검증함
- Repository·Worktree Local Hash, Runtime, Session Hash, Signal 종류, 시각, 상태·결과,
  Promotion Source Reference와 Availability만 최소 Metadata로 저장함
- Prompt·응답·파일·Code Diff·Git Remote·절대 경로·Secret 원문을 기본 저장하지 않음
- `promotion_source_ref`가 opaque Local Identifier 또는 민감 원문 없는 Sanitized Reference임
- State read/write·Atomic rename·Schema·Scope·Session·Hook·동시 Event 실패 시 기존 작업을 유지하는 fail-open
- 실패를 `clean`이나 성공으로 표현하지 않고 가능한 경우 Manual Context Checkpoint를 안내함
- `project-context`가 CREATE / UPDATE / CONTEXT CHECKPOINT와 Human-confirmed Durable Context를 소유함
- `handoff-prompt`가 Task-scoped Structured Handoff Candidate 생성을 계속 소유함
- Guard가 새 Handoff Artifact를 만들거나 Handoff 책임을 흡수하지 않음
- `review_needed` Handoff에서 경고와 Human Decision Gate를 제공하되 Guard 상태만으로 Hard Block하지 않음
- Context Checkpoint, `no_update`, Manual Handoff 계속 중 기본값이나 자동 선택이 없음
- Manual Handoff 계속 시 unresolved 사실을 보존하고 Context 최신·Review 완료로 오표현하지 않음
- DEC-062의 Pending Handoff 연결보다 Runtime data-flow상 선행하는 Context Capture Gate를 유지함
- `FX-CCG-001~007`, `FX-CCG-010~015`의 Positive·Negative·Isolation·Privacy·Fail-open Fixture가 통과함

Context와 Handoff의 순서:

```text
일반 작업
→ Activity Signal
→ review_needed
→ SessionEnd advisory 최소 상태 보존
→ 다음 Session one-time diagnostic
→ Human Review
→ checkpointed / no_update
→ 필요 시 Handoff Candidate
→ Pending
→ DEC-062 Next-session Rehydration
```

DEC-062의 Product delivery priority, Public `v1.1.0` Gate와 Automatic Rehydration 조건은
변경하지 않는다. 위 선후 관계는 Runtime data-flow의 Capture Gate 순서다.

현재 검증 상태:

```text
implementation: not_verified
fixture: not_verified
manual_e2e: not_verified
runtime_supported: not_verified
```

---

## 11. Manual Result Return Flow

필수 흐름:

```text
Worker Result
→ Result Basic 수동 형식
→ Human Review
```

Human Review 필수 항목:

```text
What Was Done
Findings
Evidence
Files Read
Files Changed
Commands Run
Validation Performed
Validation Not Performed
Remaining Risk
Scope Deviation
Next Action
```

완료 조건:

- Result Basic Candidate 생성 가능
- Handoff와 연결 가능
- Validation 미수행 표시 가능
- Scope 이탈 표시 가능
- 수행하지 못한 검증을 Pass로 표시하지 않음
- Project Context 자동 승격 금지

Accept / Edit / Reject 전용 UX, Result Create / Review / Import 관리 기능, Repository 반영용 Export는 V1 P0 필수 조건이 아니다.

---

## 12. Project Context Boundary

Project Context의 책임:

```text
Human-confirmed Durable Context
```

Handoff의 책임:

```text
Task-scoped Short-lived Transfer Artifact
```

Result의 책임:

```text
Task-scoped Evidence Candidate
```

필수 정렬:

```text
project-context
= 승인된 Durable Context와 Promotion

handoff-prompt
= 작업 전달

result-basic
= 작업 결과 반환
```

완료 조건:

- `[HANDOFF]` 책임 중복 해소
- Promotion 전 Candidate 상태 유지
- Promotion 승인 주체 명시
- Promotion Source 기록 가능
- 기존 Durable Context와 충돌 시 자동 덮어쓰기 금지
- Reject된 Result는 Promotion 불가
- Result → Candidate → Human Review → Promotion 흐름 명시
- Durable Context와 작업 Artifact 경로 분리

---

## 13. Routing Contract Alignment

V1 Routing Source:

```text
skills/*/SKILL.md routing metadata
→ generated skills/skill-index.json
→ Routing Consumer
```

필수 정렬:

- Metadata Schema와 Consumer 지원 범위 일치
- Keyword만 지원하면 keyword-only로 명시
- Intent와 Pattern을 지원한다고 선언하면 Consumer 구현
- 수동 Routing Table은 설명용으로만 사용
- Deprecated Skill 제외
- No-match와 Ambiguous 표현

완료 조건:

```text
Positive Match Fixture
Negative Match Fixture
Ambiguous Match Fixture
No-match Fixture
Broken-index Fail-open
Missing Metadata Fixture
```

Fail-open의 의미:

```text
사용자 Runtime 실행을 차단하지 않음
그러나 잘못된 Candidate를 정상 Match로 반환하지 않음
unavailable / no-match / degraded 상태를 명시
```

---

# Part III. Implementation Completion

## 14. Instruction Cascade

완료 조건:

```text
Generic Source Instruction 존재
Claude Projection 생성
Codex Projection 생성
Pre-commit Regeneration 동작
Artifact Registry Drift Check 동작
Generated Output Drift Verification 동작
CI 또는 동등한 clean-tree Gate 존재
```

완료 판정:

```text
render
→ git diff --exit-code 또는 동등 검증
→ generated output equivalence 확인
```

---

## 15. Runtime Hook Wiring

완료 조건:

```text
Claude Hook 등록
Codex Hook 등록
Prompt Routing Hook 호출
Fail-open 동작
Hook 실패가 사용자 Runtime을 차단하지 않음
Raw Prompt 또는 Secret 로그 금지
```

Hook Wiring은 Runtime Instruction Projection과 별도 책임으로 관리한다.

---

## 16. Local Usage Log

V1에서 Local Usage Log를 제공하거나 활성화하는 경우에만 필수 기능으로 취급한다.

제공하지 않거나 기본 비활성화하면 Privacy Verification은 `Not Applicable`이다.

완료 조건:

- Source Code 기록 금지
- Prompt 원문 기록 금지
- 전체 Handoff 기록 금지
- 전체 Result 기록 금지
- Secret 기록 금지
- Runtime, Version, 성공·실패, Error Category 기록 가능
- 삭제 가능
- Local-only 유지 가능
- 민감 Repository의 Branch·Commit 기록 정책 명시

Local Usage Log는 Cloud Telemetry가 아니다.

---

## 17. Installation and Migration

완료 조건:

```text
신규 사용자가 문서만으로 설치 가능
기존 파일을 무단 덮어쓰지 않음
Local Profile과 Example Profile 분리
지원 Runtime 설치 절차 존재
Uninstall 또는 제거 절차 존재
```

Migration 안내는 다음 경우에만 필수다.

```text
기존 설치 경로 변경
기존 설정 형식 변경
기존 Hook 구조 변경
기존 사용자 Artifact 경로 변경
```

첫 설치만 존재하고 기존 사용자 변경이 없다면 Migration 문서는 필수가 아니다.

---

# Part IV. Fixture Completion

## 18. Fixture 원칙

Fixture는 마지막 PR에 한꺼번에 추가하지 않는다.

각 기능 PR은 자기 변경을 보호하는 최소 Fixture를 포함해야 한다.

```text
Contract PR
→ Contract Fixture

Routing PR
→ Routing Fixture

Projection PR
→ Projection Fixture

Result PR
→ Result Fixture

Final Regression PR
→ E2E 연결
```

---

## 19. 최소 Fixture 목록

### Work-start

```text
정상 입력
Context 없음
Skill Match
No-match
Ambiguous
Secret 제외
```

### Routing

```text
Positive
Negative
Broken Index
Missing Metadata
Fail-open
```

### Handoff

```text
Required Field
Do Not Touch 보존
Facts / Assumptions 분리
Invalid Handoff
Good / Bad Example
```

### V1 Alpha Validator / Export

```text
Handoff Validator
Result Validator
Generic Markdown Export 고도화
CLI Product Shell 고도화
Runtime별 정적 사용 안내 고도화
```

### Result

```text
Validation Performed
Validation Not Performed
Files Read / Changed 분리
Scope Deviation
Missing Result
Partial Result
Blocked Result
```

### Truthfulness

```text
Fact
Decision
Assumption
Open Issue
Remaining Risk
Unverified Claim
```

### Manual E2E

```text
사용자 Task 입력
→ Work-start
→ Structured Handoff Candidate
→ Human Review
→ 수동 Runtime 전달
→ Worker 수행
→ Result Basic 수동 반환
→ Human Review
```

---

## 20. Fixture 완료 조건

```text
필수 Fixture가 Repository에 존재
반복 실행 가능
Expected Output이 명시됨
Negative Fixture 포함
Fail-open 경로 포함
CI 또는 로컬 검증 명령 존재
문서 예시와 Fixture가 Drift하지 않음
```

---

# Part V. Documentation Completion

## 21. Public Documentation

필수 문서:

```text
README
V1 Quick Start
V1 Product Boundary
Supported Runtime
Handoff Example
Result Example
Execution Policy
Privacy / Local-only
Troubleshooting
Release Note
```

Public Product Message:

```text
oh-my-ai V1
= 무료 Local Artifact Workflow
= Runtime-neutral Handoff / Result Contract
= Human-controlled Delegation and Return
```

금지되는 제품 메시지:

```text
Claude와 Codex를 자동 연결하는 제품
Cloud AI Control Plane
Managed Agent Platform
Automatic Memory System
```

V1에서는 위 표현을 사용하지 않는다.

---

## 22. Single-runtime Quick Start

V1은 하나의 Runtime만으로도 완결 가능해야 한다.

사용자용 Product Entry는 Runtime Adapter가 제공한다.
`make work-start TASK="..."`는 내부 Engine·Developer Interface로 유지하며,
사용자용 Runtime Entry 완료를 대체하지 않는다.

필수 데모:

```text
oh-my-ai
→ Claude Code
```

또는:

```text
oh-my-ai
→ Codex
```

Claude와 Codex를 동시에 사용해야만 V1 가치가 성립해서는 안 된다.

완료 조건:

- 최소 1개 V1 지원 Runtime 설치
- 최소 1개 V1 지원 Runtime에서 사용자용 Work-start Entry 제공
- 명시적 사용자 Entry가 공통 Work-start Engine을 호출
- 자연어 Intent 감지는 Suggestion Candidate로만 표시
- 사용자 승인 전 Engine 호출과 Artifact 생성 없음
- 사용자 승인 후 공통 Work-start Engine 실행
- 사용자 Skip 또는 Decline 시 Engine 호출과 Artifact 생성 없음
- 실행 결과에 Artifact 경로 표시
- Work-start 실행
- Handoff 생성
- Runtime 실행
- Result 작성
- Human Review
- 수동 반영
- 지원 대상으로 공개한 각 추가 Runtime은 별도 Adapter 검증 통과

---

## 23. Truthfulness Documentation

Public 문서에 다음을 명시해야 한다.

```text
실행하지 않은 검증을 Pass로 표시하지 않음
지원하지 않는 기능을 지원한다고 표시하지 않음
Candidate와 Confirmed Fact를 구분
Partial과 Complete를 구분
Result 누락을 성공으로 표시하지 않음
```

---

# Part VI. Release Gate

## 24. P0 Release Blocking

다음 항목이 하나라도 미완료면 V1 Release 불가다.

Part I~III에서 V1 필수 기능으로 정의된 완료 조건은 §24에 개별 문장으로 반복되지 않았더라도 P0로 취급한다.

P1 분류는 Part I~III의 필수 완료 조건을 완화하거나 Known Limitation으로 이관하는 근거가 될 수 없다.

```text
Public Product Terminology 정렬
Work-start Contract
Structured Handoff Contract
Result Basic Contract
Static Capability Contract
Routing Metadata / Consumer Contract 정렬
Project Context / Handoff 책임 정렬
최소 Contract Fixture 검증
Manual Handoff Flow
Manual Result Return Flow
Minimum Per-feature Fixtures
Good / Bad Artifact Examples
Manual End-to-End Pass
Minimum Runtime Entry Manual E2E
Truthfulness Gate
Fresh Install 검증
Single-runtime Quick Start
Product Notice Contract
Product Notice Fixture 검증
Runtime-readable Version Source
Notice Privacy Documentation
```

---

## 25. P1 Release Quality

다음은 출시 품질 Gate다.

```text
Context Drift Warning
Review Surface 정리
Troubleshooting
```

조건부 P0:

```text
Generated Output Drift Verification
= V1 설치·실행에 Generated Artifact가 포함되면 P0
= Generated Artifact가 V1 실행 경로에 없으면 Not Applicable

Local Usage Log Privacy Verification
= Usage Log를 활성화하면 P0
= Usage Log를 제공하지 않거나 비활성화하면 Not Applicable

Migration Guide
= 기존 설치·설정·Artifact 경로가 변경되면 P0
= 신규 설치만 있고 기존 사용자 변경이 없으면 Not Applicable
```

P1 항목은 원칙적으로 Release 전에 완료한다.

Semantic Preservation, Privacy, Contract Fixture와 같은 P0 항목은 Known Limitation으로 이관할 수 없다.

범용 Validator 제품 기능과 Runtime Projection Fixture는 V1 Alpha 품질 항목이다. Fixture를 통한 최소 Contract 검증과 Manual E2E는 V1 P0에 남는다.

---

## 26. P2 Post-release

```text
Gemini Projection
TUI Review
Local Artifact History
Additional Domain Skills
Optional Search Backend
Enhanced Context Ranking
Managed Result Return
Task Registry
Session Linking
Runtime Invocation
Result Detection
Completion Detection
Review Queue
Context Import
Worktree 자동화
복수 Worker Coordination
Merge / Apply Gate 자동화
```

Human Review Next Step은 다음을 의미한다.

```text
Direct Handoff / Plan First / Gather Context 선택지를 중립적으로 표시
사용자가 직접 선택
선택 전 Needs human review 유지
선택만으로 자동 실행하지 않음
External Context는 수동 확인 후보로만 표시
```

다음은 V1 완료 조건이 아니다.

```text
자동 Planning
작업 복잡도 자동 판정
Planning Skill 자동 실행
External Connector
외부 Context 자동 검색
Planning 완료 상태 관리
자동 Handoff 승인
Managed Workflow
```

P2 미구현은 V1 Release를 막지 않는다.

---

## 27. Public v1.0.0 Baseline Release Gate Checklist

### Contract

- [ ] Work-start Contract 확정
- [ ] Handoff Contract 확정
- [ ] Result Basic Contract 확정
- [ ] Capability Contract 확정
- [ ] Execution Policy 정렬
- [ ] Project Context 경계 정렬

### Implementation

- [ ] Work-start 출력 정렬
- [ ] 최소 1개 Runtime의 사용자용 Work-start Entry
- [ ] Runtime Entry Consent Guard
- [ ] Structured Handoff Candidate 생성 / Human Review / Manual Copy
- [ ] Human Review Next Step 선택지 / Needs human review 경계
- [ ] Result Basic 수동 Template / Human Review
- [ ] Generated Drift Check
- [ ] Hook Fail-open
- [ ] Usage Log Privacy

### Fixture

- [ ] Routing Fixture
- [ ] Runtime Entry Fixture
- [ ] Suggestion / Approval / Decline Fixture
- [ ] Handoff Fixture
- [ ] Result Fixture
- [ ] Truthfulness Fixture
- [ ] Manual E2E

### Documentation

- [ ] README 정렬
- [ ] Quick Start
- [ ] Handoff Example
- [ ] Result Example
- [ ] V1 Non-goals
- [ ] Privacy
- [ ] Troubleshooting
- [ ] Release Note
- [ ] 조건부 Migration Guide

### Manual Verification

- [ ] Fresh install
- [ ] 명시적 Runtime Entry
- [ ] 자연어 Suggestion 후 승인 전 Artifact 없음
- [ ] 승인 후 Artifact 생성
- [ ] Skip 또는 Decline 후 Artifact 없음
- [ ] 최소 1개 Runtime의 Manual Copy/Paste flow
- [ ] Missing Result path
- [ ] Validation Not Performed path
- [ ] Scope Deviation path
- [ ] Human Review

---

# Part VII. Exit Criteria

## 28. Public v1.0.0 Baseline 완료 판정

다음 조건은 이미 출시된 Public `v1.0.0` Baseline의 완료 판정이다.
DEC-062·DEC-063과 post-v1.0 Public V1.x Delta Gate는 이 판정을 소급 변경하지 않는다.

```text
1. 사용자가 작업을 입력할 수 있다.
2. Work-start가 Context와 Skill Candidate를 생성한다.
3. Structured Handoff Candidate를 생성할 수 있다.
4. 사용자가 Scope와 Do Not Touch를 검수할 수 있다.
5. 최소 1개 Runtime에서 사용자용 Work-start Entry가 제공된다.
6. 명시적 Entry 또는 사용자 승인된 Suggestion만 Work-start Engine을 호출한다.
7. Suggestion 또는 Decline 상태에서는 Engine 호출과 Artifact 생성이 없다.
8. 사용자가 Direct Handoff / Plan First / Gather Context 중 다음 수동 단계를 선택할 수 있다.
9. 선택 전 Candidate가 Needs human review 상태를 유지한다.
10. 선택 결과가 자동 Planning, Connector 호출, Runtime 실행, Handoff 승인으로 이어지지 않는다.
11. Handoff를 Worker Session에 수동 Copy/Paste로 전달할 수 있다.
12. Worker가 Result Basic 수동 형식으로 반환할 수 있다.
13. 사용자가 Files / Commands / Validation / Risk를 검수할 수 있다.
14. 실행하지 않은 검증이 Pass로 표시되지 않는다.
15. Result Basic이 Human Review 전 canonical Truth나 완료 증명으로 취급되지 않는다.
16. 최소 Positive / Negative Fixture와 Manual E2E Demo가 존재한다.
17. Cloud 없이 전체 흐름이 완료된다.
18. 단일 Runtime으로 전체 흐름이 완료된다.
19. Negative Fixture와 Manual E2E가 통과한다.
20. Public Documentation이 실제 동작과 일치한다.
```

---

## 29. 완료로 판정하지 않는 경우

```text
Handoff만 있고 Result가 없음
Result는 있으나 Validation 상태가 없음
Manual Review가 없음
Routing Source와 Consumer가 불일치
Fixture가 없음
문서와 실제 동작이 다름
Cloud 없이는 동작하지 않음
Claude와 Codex를 함께 써야만 동작
Worker Result가 자동 Truth로 승격
V2 Entity가 없다는 이유로 V1 미완료 처리
```

---

## 30. Release 승인

V1 Release 승인자는 다음을 확인한다.

```text
Product Boundary
Contract Completion
Fixture Result
Manual E2E
Known Limitation
Migration 필요 여부
Public Documentation
```

승인 결과:

```text
release_ready
release_ready_with_known_limitations
not_ready
```

`release_ready_with_known_limitations`는 P0 미완료에 사용할 수 없다.

---

# Part VIII. Open Decisions

## 31. 미결정 사항

1. Handoff와 Result의 정확한 파일 경로
2. Markdown과 JSON Schema 병행 여부
3. V1 Local 참조값 명칭
4. CLI 명령 이름
5. Review UX가 CLI, TUI, Markdown 중 무엇인지
6. Context Drift Warning의 정확한 기준
7. Capability Metadata 직렬화 형식
8. Gemini Projection의 Post-V1 도입 시점
9. Local Artifact History의 Post-V1 도입 시점
10. ~~V1 Release Version~~ — DEC-055로 확정 (`v1.0.0`)
11. 기존 `handoff-prompt` 이름 유지 여부
12. `docs/context` Promotion Workflow 형식
13. P1 Known Limitation 승인 절차

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 32. 불변조건

1. V1은 무료 Local Artifact Workflow다.
2. V1은 Cloud 없이 완결된다.
3. V1은 단일 Runtime으로 완결 가능하다.
4. Handoff와 Result는 Artifact다.
5. Worker Result는 Human Review 전까지 Candidate다.
6. Result Basic 없이 V1 완료로 판정하지 않는다.
7. 실행하지 않은 검증을 Pass로 기록하지 않는다.
8. Fixture 없이 Contract 완료로 판정하지 않는다.
9. Runtime Adapter가 제품 의미를 소유하지 않는다.
10. Capability와 Execution Policy를 분리한다.
11. Entitlement는 V1 비범위다.
12. Project Context와 Handoff 책임을 분리한다.
13. Routing Metadata와 Consumer 의미를 일치시킨다.
14. Public 문서와 실제 동작을 일치시킨다.
15. P0 미완료를 Known Limitation으로 우회하지 않는다.
16. V2 기능 미구현을 V1 결함으로 판정하지 않는다.
17. Product Notice 실패는 fail-open이며 Workflow 결과를 바꾸지 않는다.
18. Product Notice는 Artifact와 Workflow State에 포함되지 않는다.
19. 사용자는 원격 Notice 확인 전체를 opt-out할 수 있다.

---

## 33. 관련 문서

```text
docs/master/product-architecture-master.md
docs/roadmap/product-roadmap.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/product/development-harness-report.md
docs/contracts/work-start-contract.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/product-notice-contract.md
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
docs/decisions/decision-log.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

---

## 34. 검수 관점

### 제품

- V1 사용자 가치가 한 문장으로 설명 가능한가
- Cloud 없이 완결되는가
- 단일 Runtime으로 완결되는가
- V2 기능이 Release Gate에 유입되지 않았는가

### Contract

- Handoff와 Result 필수 필드가 충분한가
- Truthfulness와 Validation 상태가 표현 가능한가
- Capability와 Policy가 분리되는가
- Project Context 경계가 명확한가

### 구현

- 현재 Repository 자산을 재사용 가능한가
- P0 항목이 실제 구현 단위로 변환 가능한가
- Routing Consumer와 Metadata가 정렬되는가
- Generated Drift 검증이 가능한가

### 검증

- 각 기능 PR에 최소 Fixture가 포함되는가
- Negative Fixture가 존재하는가
- Manual E2E가 전체 흐름을 닫는가
- Result 누락과 Validation 미수행을 검증하는가

### 출시

- Public Documentation과 실제 동작이 일치하는가
- Fresh Install과 Single-runtime Quick Start가 가능한가
- Known Limitation이 P0 미완료를 숨기지 않는가
