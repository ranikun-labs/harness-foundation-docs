---
title: Pending Handoff Rehydration Contract
status: draft
implementation_status: not_verified
owner: development
last_reviewed: 2026-07-29
supersedes: []
superseded_by: []
related_decisions:
  - DEC-062
  - DEC-063
source_inputs:
  - docs/decisions/decision-log.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/contracts/context-checkpoint-guard-contract.md
  - docs/product/v1-completion-criteria.md
  - docs/testing/v1-fixture-plan.md
---

# Pending Handoff Rehydration Contract

## 1. 목적과 Release 경계

이 문서는 DEC-062의 Automatic Next-session Handoff Rehydration을 구현할 때
Candidate 생성, Pending State, Claim, Delivery, Consumption, TTL과 Manual Resume의
canonical 결과 계약을 정의한다.

```text
Automatic Next-session Handoff Rehydration
= Public V1.x P0
= 권장 공개 버전 v1.1.0
```

이 Contract와 Fixture 정의는 Foundation Gate다.

```text
Decision Accepted
+ Contract Defined
+ Fixture Defined
≠ Product Runtime Implemented
≠ Runtime Hook Supported
≠ Fixture Passed
≠ Cross-session E2E Passed
```

Public `v1.0.0`의 Manual Copy/Paste Baseline, 완료 상태, Tag와 Release를 소급 변경하지 않는다.
Public `v1.1.0`에서 Manual Resume는 Automatic Rehydration을 안전하게 수행할 수 없을 때의
fallback이다.

## 2. 책임 경계

### 2.1 이 Contract가 소유하는 책임

```text
명시적 Handoff Consent 판정 결과
정제된 Pending Candidate Schema
Candidate Lifecycle과 Availability
자동 연결 Gate
Atomic Claim과 Lease
Delivery Confirmation Evidence
단일 Consumption
TTL과 만료
Manual Resume 결과
Privacy와 Fail-open
Fixture Traceability
```

### 2.2 이 Contract가 소유하지 않는 책임

```text
Structured Handoff의 Task Contract 의미
Runtime별 Hook 구현과 파일 경로
Runtime Adapter 라이브러리
새 Session 생성 또는 UI 전환
Runtime Invocation
Worker 실행 또는 Result 회수
Project Context Promotion
Cloud Sync·Telemetry·Daemon·Scheduler
```

새 Session 생성과 전환은 사용자 책임이다. Harness는 사용자가 직접 생성·전환한 지원
Session에 안전한 Pending Candidate를 연결할 수만 있다.

## 3. Context Checkpoint Guard와 분리

```text
Context Checkpoint Guard
= 중요한 작업 후 Context 검토 필요 상태
= 다음 Session one-time diagnostic
≠ Pending Handoff Candidate
≠ Handoff Rehydration

DEC-062
= 명시적 Handoff 요청으로 이미 생성된 Pending Candidate 연결
```

Canonical 순서:

```text
명시적 Handoff 요청
→ 필요한 Context Checkpoint Human Gate
→ 정제된 Candidate 생성
→ Pending 등록
→ 사용자가 새 Session 생성·전환
→ 안전 조건 검증
→ Candidate Rehydration 또는 Manual Resume
```

`review_needed`는 Candidate의 `context_checkpoint_status`에 정직하게 보존할 수 있지만,
그 값 자체를 Consent, Candidate 생성 또는 Pending 등록으로 변환하지 않는다.

# Part I. Consent and Candidate

## 4. 명시적 Consent

`PHR-REQ-001` 명확한 Handoff 실행 의도만 Candidate 생성 동의다.

허용:

```text
$handoff ...
/handoff ...
다른 세션으로 넘겨줘
이 작업을 새 세션으로 Handoff 해줘
```

허용하지 않음:

```text
Handoff 기능 질문
문서 속 $handoff 문자열
코드 블록 속 예시
Synthetic Event
애매한 언급
일반 Context Checkpoint 경고
```

Command 또는 자연어 Intent 인식은 Runtime별 Capability다. Runtime이 해당 인식 Surface를
지원한다고 검증되지 않았으면 `unknown` 또는 `unsupported`이며 Candidate를 자동 생성하지 않는다.
Intent Detection은 Consent가 아니다. 인식 결과가 명시적 실행 의도임을 검증한 뒤에만 생성한다.

## 5. Candidate 최소 Schema

`PHR-REQ-002` 저장 Artifact는 Raw Transcript가 아니라 다음 의미를 가진 정제 Candidate다.

```yaml
candidate_id: <opaque-local-id>
schema_version: <supported-version>
status: candidate
created_at: <UTC timestamp>
expires_at: <UTC timestamp>

source_runtime: <runtime-id>
source_session_identity: <opaque-local-identity>
repository_identity: <opaque-local-identity>
worktree_identity: <opaque-local-identity>

goal: <sanitized summary>
completed: []
open_issues: []
verification: []
do_not_touch: []
next_action: <sanitized next step>

context_checkpoint_status: <checkpointed|no_update|review_needed|unknown>
privacy_redaction_status: passed
```

필드 규칙:

- `candidate_id`는 경로, Session ID 또는 사용자 입력을 포함하지 않는 불투명 Local ID다.
- `schema_version`은 Reader가 명시적으로 지원하는 값이어야 자동 연결할 수 있다.
- `created_at`과 `expires_at`은 같은 Clock Snapshot에서 계산한 UTC 절대 시각이다.
- `completed`, `verification`은 수행·확인된 내용과 미수행 내용을 구분한다.
- `context_checkpoint_status: review_needed`는 unresolved 상태를 보존하며 Pending 생성의 근거가 아니다.
- `privacy_redaction_status`가 `passed`가 아니면 Pending 등록과 자동 연결을 금지한다.

구현은 Claim과 Delivery를 위해 다음 State Metadata를 Candidate Record에 추가할 수 있다.

```text
claim_owner_identity
claim_started_at
claim_lease_expires_at
claim_attempt_id
delivery_attempt_id
delivery_evidence
delivered_at
consumed_at
failure_reason
state_revision
candidate_digest
```

이 Metadata도 원문 금지와 최소 수집 원칙을 따른다.

## 6. Identity와 Privacy

`PHR-REQ-003` Raw Source Session ID는 디스크, 로그, Fixture Evidence 또는 Manual Resume에
저장하지 않는다.

```text
source_session_identity
= Runtime이 제공한 Raw Session ID를 현재 Process에서만 읽어
  설치별 Local Secret으로 계산한 안정적인 Keyed Digest 또는
  동등한 비가역 Opaque Local Identifier
```

비교가 필요한 source/current Session Identity는 같은 Local Namespace와 알고리즘으로 계산한다.
단순 평문 Hash처럼 원문 추측에 취약한 표현은 사용하지 않는다. Raw Session ID가 기술적으로
필요한 Adapter는 비교·Digest 계산 동안 Memory에서만 다루고 State와 진단 출력에 쓰지 않는다.

Repository와 Worktree도 서로 다른 Opaque Identity로 저장한다.

```text
repository_identity
= Credential을 제거하고 정규화한 Repository Identity의 Local Opaque Digest

worktree_identity
= 검증된 Worktree Root와 Repository Identity를 결합한 Local Opaque Digest
```

다음 원문은 저장하지 않는다.

```text
Raw Transcript
Raw Prompt
AI 응답 전체
Raw Tool Output
파일 전체 내용
전체 Diff
Secret
Token
Credential
환경변수 원문
Raw Session ID
Credential 포함 Git Remote
절대 Worktree Path
```

Redaction은 저장 후 삭제가 아니라 저장 전 필수 Gate다. 금지 Marker를 발견하거나 Redaction
완료 여부를 확인할 수 없으면 Candidate를 Pending으로 등록하지 않고 안전한 오류만 반환한다.

# Part II. State Model

## 7. 최소 Lifecycle과 Availability

`PHR-REQ-004` Lifecycle `status`는 다음 일곱 값만 사용한다.

| Status | 의미 |
|---|---|
| `candidate` | 정제 Artifact가 생성됐으나 Pending Registry에 공개되지 않음 |
| `pending` | 자동 연결 Gate가 조회할 수 있는 미소비 Candidate |
| `claimed` | 단일 대상 Session이 유효 Lease로 Delivery 권한을 획득함 |
| `delivered` | 대상 Session에서 Candidate 사용 가능성이 Runtime Evidence로 확인됨 |
| `consumed` | 확인된 Delivery를 단 한 번 최종 소비 처리함 |
| `expired` | TTL이 지나 자동 연결할 수 없는 Terminal 상태 |
| `invalid` | Schema·Timestamp·Digest·State 불변조건 위반으로 격리된 Terminal 상태 |

State Store나 Runtime Surface를 현재 사용할 수 없는 진단은 Lifecycle을 늘리지 않고 별도 축으로
표현한다.

```text
availability: available | unavailable
```

`unavailable`은 Candidate가 `invalid`, `expired` 또는 `consumed`라는 뜻이 아니다.
원인을 확인하지 못한 상태에서 Lifecycle을 추측해 쓰지 않는다.

`failure`도 별도 Lifecycle 값으로 늘리지 않는다. `failure_reason`, Attempt Event와
`manual_resume_required`로 원인을 기록하고, 확인 가능한 마지막 Lifecycle을 유지하거나
이 Contract가 허용한 `claimed → pending`, `expired`, `invalid` 전이만 수행한다.

정상 전이:

```text
candidate
→ pending
→ claimed
→ delivered
→ consumed
```

안전 전이:

```text
candidate | pending | claimed
→ expired

candidate | pending | claimed | delivered
→ invalid

claimed
→ Lease 만료 또는 확인된 Delivery 전 실패
→ pending
```

`delivered → pending`은 허용하지 않는다. Delivery가 확인된 뒤 Crash가 발생하면 재주입하지 않고
동일 Delivery Evidence를 검증해 `consumed`를 멱등하게 완료하거나 Manual Resume로 돌아간다.

## 8. 상태와 성공 표현

`PHR-REQ-005` 외부 Event와 Lifecycle 성공을 구분한다.

```text
candidate_created
pending_registered
claim_acquired
delivery_attempted
delivery_confirmed
consumed
manual_resume_required
```

다음 등식은 모두 금지한다.

```text
Artifact 생성 = Delivery Success
Claim = Delivery Success
Hook 호출 = Delivery Success
출력 시도 = Delivery Success
Manual Resume 안내 = Automatic Rehydration Success
Claim = Consumption
```

# Part III. Automatic Linking

## 9. 필수 Gate

`PHR-REQ-006` 다음 조건을 모두 같은 Claim 시도에서 검증할 수 있을 때만 자동 연결한다.

```text
같은 Repository
같은 Worktree
source_session_identity와 다른 current_session_identity
두 Session Identity 모두 확인 가능
Pending Candidate 정확히 1개
Candidate 미만료
Runtime 지원 확인
Session Start 또는 동등 Surface 지원 확인
Candidate Injection Surface 지원 확인
Delivery Confirmation 지원 확인
Hook 지원·활성 확인
Candidate Schema와 Digest 검증 통과
privacy_redaction_status = passed
```

Gate 판정과 Claim 사이 State Revision이 바뀌면 다시 검증한다. `unknown`, `conditional`의 조건
미충족, 검증 실패는 `supported`로 취급하지 않는다.

## 10. 같은 Session과 Scope 불일치

`PHR-REQ-007` source/current Session이 같거나 Repository·Worktree 중 하나라도 다르거나
확인할 수 없으면 자동 연결하지 않는다. 이름, Branch, 현재 디렉터리 문자열 또는 사용자 추정을
Identity Evidence로 대체하지 않는다.

## 11. Multiple Pending

`PHR-REQ-008` 같은 Repository·Worktree Scope에 Pending Candidate가 둘 이상이면 자동 선택하지 않는다.

금지 기준:

```text
가장 최신 Candidate
유사한 Goal
가장 최근 Session
Branch 이름 유사도
생성 시각
```

Manual Resume에는 각 Candidate의 안전한 최소 Metadata만 표시하고 사용자가 Candidate ID를
명시적으로 선택하거나 새 Candidate를 만들게 한다. 선택 전 Claim·Delivery·Consumption은 없다.

# Part IV. Claim, Lock, and Crash Recovery

## 12. Atomic Claim

`PHR-REQ-009` Claim은 Candidate의 현재 `pending` State와 Revision을 조건으로 하는 단일 Atomic
Compare-and-set 또는 동등한 결과를 제공해야 한다.

성공한 Claim은 다음을 한 State Revision에 기록한다.

```text
status: claimed
claim_owner_identity: <current-session-opaque-identity>
claim_started_at: <UTC timestamp>
claim_lease_expires_at: <UTC timestamp>
claim_attempt_id: <opaque-id>
```

동일 Candidate의 동시 경쟁에서는 정확히 하나만 성공한다. Lock 획득 실패, State Revision 충돌,
이미 유효한 다른 Owner의 Claim은 자동 전달을 시도하지 않고 `claim_conflict` Manual Resume로
fail-open한다.

## 13. Lease와 Recovery

`PHR-REQ-010` Claim은 유한 Lease를 가진다. 영구 Claim은 허용하지 않는다.

- Process Crash 또는 Delivery 전 실패 후 Lease가 만료되면 Candidate는 원자적으로 `pending`으로
  복귀해 재시도할 수 있다.
- Lease 만료 전 다른 Owner가 Claim을 탈취하지 않는다.
- 원래 Owner도 Lease·Revision 검증 없이 State를 갱신하지 않는다.
- Candidate TTL이 먼저 끝나면 Lease Recovery보다 `expired`가 우선한다.
- Delivery 실패를 확인한 Owner는 미확인 Success를 쓰지 않고 안전하게 Claim을 해제하거나 Lease
  만료에 맡긴다.
- Recovery 도중 State가 손상됐거나 Owner를 판별할 수 없으면 자동 복구를 추정하지 않고
  `availability: unavailable`과 Manual Resume를 사용한다.

Claim Lease 기간은 구현 Config지만, 유한 값·기록된 만료 시각·Fixture에서 조절 가능한 Clock을
제공해야 한다.

## 14. Retry와 중복 Event

`PHR-REQ-011` Retry는 최소 다음 Key에서 멱등하다.

```text
candidate_id
current_session_identity
claim_attempt_id 또는 안정적인 boundary_event_id
candidate_digest
```

중복 SessionStart, 중복 Hook Event, 재전송된 Delivery Confirmation은 같은 Candidate를 두 번
주입하거나 소비하지 않는다.

```text
pending
→ 단일 Claim만 허용

claimed + 같은 Attempt
→ 기존 Attempt 상태 재사용

delivered + 같은 Evidence
→ 재주입 없이 Consumption 완료 가능

consumed
→ no-op, 자동 재연결 금지
```

## 15. Atomic Write와 손상 State

`PHR-REQ-012` State 변경은 Crash 중 부분 Record가 관찰되지 않는 Atomic Write 결과와
단조 증가 Revision을 제공해야 한다. 특정 라이브러리나 파일 경로는 강제하지 않는다.

최소 결과 계약:

```text
Reader는 이전의 완전한 Revision 또는 다음의 완전한 Revision만 관찰
부분 JSON·부분 필드·서로 다른 Revision 혼합 관찰 금지
Candidate Digest 또는 동등한 Integrity 검증
Writer Crash 후 마지막 확인된 State 판별 가능
```

손상, 알 수 없는 Schema, 불가능한 State 전이, Timestamp 불변조건 위반을 자동으로 정상 State로
추정해 고치지 않는다. Candidate를 소비하지 않고 격리 가능한 경우 `invalid`, Store 전체를
판별할 수 없으면 `availability: unavailable`로 fail-open한다.

# Part V. TTL and Expiration

## 16. TTL 기준

`PHR-REQ-013` TTL의 기준 시각은 Candidate를 원자적으로 생성한 시점의 `created_at`이다.

```text
expires_at = created_at + configured_ttl
```

기간 값은 Product Runtime Config가 소유한다. 구현은 유한한 Configurable Default를 가져야 하고
각 Candidate에 계산된 `expires_at`을 기록해야 한다. Foundation Contract는 임의 기간 값을
고정하지 않는다.

만료는 최소 다음 경계에서 해당 State를 읽는 Consumer가 판정한다.

```text
Pending 조회
Claim 직전
Delivery 직전
Manual Resume 조회
```

별도 Daemon이나 Scheduler는 필요하지 않다.

Delivery가 TTL 안에 확인됐지만 `delivered → consumed` 사이 Crash로 현재 시각이 `expires_at`을
지났다면, 일치하는 Evidence의 `delivered_at < expires_at`을 검증한 뒤 재주입 없이 Consumption만
멱등하게 완료할 수 있다. Delivery 시각이 없거나 만료 이후면 소비하지 않고 Manual Resume로
돌아간다.

## 17. 비정상 시각과 정리

`PHR-REQ-014` 다음 경우 자동 연결을 금지한다.

```text
TTL Config Unknown
created_at 또는 expires_at 누락·Parse 실패
expires_at <= created_at
현재 시각이 허용 Clock Skew를 넘어 created_at보다 이른 값
Claim Lease Timestamp가 Candidate TTL과 모순
```

Clock Skew 허용치는 Config일 수 있지만 Fixture에서 경계를 검증해야 한다. 비정상 Timestamp는
정상으로 추정하지 않고 `invalid` 또는 `unavailable`로 처리한다.

만료 Candidate는 즉시 내용 삭제 성공을 가정하지 않는다.

- Lifecycle을 먼저 원자적으로 `expired`로 기록한다.
- 자동 연결·Claim·Delivery·Consumption 대상에서 제외한다.
- Configurable Retention 동안 안전한 최소 Metadata와 Expired 이유만 보존할 수 있다.
- Manual Resume에는 Expired로 표시하고 사용자가 새 Candidate를 명시적으로 생성하는 절차를
  제공한다. 만료 Content를 자동 주입하거나 되살리지 않는다.
- Retention 이후 삭제할 수 있지만 삭제 실패는 일반 Session과 다른 Candidate 처리를 막지 않는다.
- Cleanup 실패를 Candidate가 사용 가능하다는 뜻으로 해석하지 않는다.

# Part VI. Delivery and Consumption

## 18. Delivery Confirmation

`PHR-REQ-015` Delivery Success는 대상 Session에서 정확한 Candidate를 사용할 수 있다는
Runtime Adapter Evidence가 있을 때만 `delivery_confirmed`와 `status: delivered`로 기록한다.

최소 Evidence 의미:

```text
candidate_id와 candidate_digest 일치
current_session_identity 일치
Runtime과 Adapter Version 식별
Injection Surface가 입력을 수락함
대상 Session의 지원된 Context/Prompt Surface에서 해당 Candidate가 사용 가능함을 확인
Confirmation 시각과 Attempt ID
Evidence 검증 결과
```

단순 Hook exit code, stdout 쓰기, Queue enqueue, 파일 생성 또는 API 요청 수락만으로는 부족하다.
각 Runtime Adapter는 `capability.handoff.delivery_confirmation`이 `supported`이고 Fixture
Evidence가 있을 때만 자동 Delivery를 광고한다. Claude와 Codex에 같은 Hook 또는 Confirmation
방식을 강제하지 않는다.

Confirmation을 제공할 수 없거나 Evidence를 검증할 수 없으면 `delivery_attempted`까지만 기록하고,
`delivered` 또는 `consumed`로 전이하지 않으며 Manual Resume로 돌아간다.

## 19. 단일 Consumption

`PHR-REQ-016` Consumption은 확인된 Delivery를 최종적으로 단 한 번 닫는 Atomic 전이다.

```text
delivered + 일치하는 Delivery Evidence + 미소비 Revision
→ consumed
```

- `consumed_at`과 Delivery Evidence Reference를 같은 Revision에 기록한다.
- Claim, 출력 시도 또는 Manual Resume는 Consumption이 아니다.
- `consumed` Candidate는 자동 연결 목록과 Manual 선택 가능한 Pending 목록에서 제외한다.
- Delivery Confirmed 후 Consumption 전 Crash는 재주입하지 않는다. 동일 Evidence를 재검증해
  Consumption만 멱등하게 완료한다.
- Evidence를 재검증할 수 없으면 자동 소비하지 않고 Manual Resume에 `delivery_confirmation_unknown`
  이유를 표시한다.

# Part VII. Manual Resume and Fail-open

## 20. Manual Resume 조건

`PHR-REQ-017` 다음 경우 반드시 자동 연결을 중단하고 가능한 범위에서 Manual Resume를 제공한다.

```text
Hook 비활성
Runtime 미지원 또는 unknown
Session Identity 확인 불가
Repository 불일치 또는 unknown
Worktree 불일치 또는 unknown
Pending 0개 또는 Multiple Pending
State 손상 또는 unavailable
Candidate 만료
Schema·Digest·Privacy 검증 불일치
Claim 충돌 또는 Lock 획득 실패
Delivery 실패
Delivery 성공 확인 불가
비정상 Timestamp 또는 TTL unknown
```

`PHR-REQ-018` Manual Resume 최소 출력:

```text
Candidate ID 또는 안전한 식별자
Goal
Created At
Source Runtime
Repository 검증 상태
Worktree 검증 상태
만료 여부
실패 이유
사용자가 수행할 다음 단계
```

Multiple Pending에서는 각 Candidate의 위 Metadata만 나열한다. State 손상으로 안전한 Metadata도
읽을 수 없으면 Candidate 내용을 추정하지 않고 오류 이유와 수동 Handoff 재생성 절차만 제공한다.

Manual Resume는 Candidate 내용을 자동 실행·주입·소비하지 않는다. 사용자가 명시적으로 선택하고
내용을 검토한 뒤 수동으로 Resume한다.

## 21. Fail-open과 No Runtime Invocation

`PHR-REQ-019` Rehydration 실패는 일반 Runtime Session을 중단하지 않는다.

```text
Rehydration 실패
→ 자동 실행 없음
→ Candidate 자동 소비 없음
→ 가능한 Manual Resume 안내
→ 원래 Session 계속
```

`PHR-REQ-020` Handoff만으로 다음을 수행하지 않는다.

```text
파일 수정
Shell 실행
Git 변경
Worker 실행
Commit·Push·PR 변경
새 Session 생성
codex resume
codex fork
Runtime Invocation
Result 자동 회수
Project Context 자동 Promotion
```

# Part VIII. Runtime Capability

## 22. Required Capability

자동 연결 Adapter는 최소 다음 Capability를 독립적으로 선언한다.

```text
capability.handoff.explicit_command_intent
capability.handoff.natural_language_intent
capability.handoff.source_session_identity
capability.handoff.current_session_identity
capability.handoff.session_start_surface
capability.handoff.candidate_injection_surface
capability.handoff.delivery_confirmation
capability.handoff.manual_resume_surface
```

허용 상태는 Runtime Capability Contract를 따른다.

```text
supported
unsupported
conditional
unknown
```

필수 자동 연결 Capability가 `conditional`이면 모든 기술 조건을 현재 Attempt에서 확인해야 한다.
`unknown` 또는 조건 미충족은 자동 연결 불가다. Manual Resume Surface 자체가 unavailable이면
조용히 no-op하고 일반 Session을 계속하되 성공으로 보고하지 않는다.

# Part IX. Fixture Traceability

## 23. Contract-to-Fixture Gate

| Requirement | 핵심 Assertion | Fixture |
|---|---|---|
| `PHR-REQ-001` | 명시적 Consent만 생성 | `FX-PHR-001`, `FX-PHR-002` |
| `PHR-REQ-002` | 최소 Schema와 정제 Candidate | `FX-PHR-001` |
| `PHR-REQ-003` | Raw Content·Secret·Raw Identity 미저장 | `FX-PHR-003`, `FX-PHR-018` |
| `PHR-REQ-004` | Lifecycle·Availability 분리 | `FX-PHR-004`, `FX-PHR-010`, `FX-PHR-011` |
| `PHR-REQ-005` | Delivery Truthfulness | `FX-PHR-014`, `FX-PHR-016` |
| `PHR-REQ-006` | 모든 Linking Gate 충족 | `FX-PHR-004`, `FX-PHR-017` |
| `PHR-REQ-007` | 같은 Session·Scope 불일치 차단 | `FX-PHR-005`~`FX-PHR-008` |
| `PHR-REQ-008` | Multiple Pending 임의 선택 금지 | `FX-PHR-009` |
| `PHR-REQ-009` | Atomic 단일 Claim | `FX-PHR-012` |
| `PHR-REQ-010` | Lease·Crash Recovery | `FX-PHR-013` |
| `PHR-REQ-011` | 중복 Event 멱등성 | `FX-PHR-015` |
| `PHR-REQ-012` | Atomic Write·손상 Fail-open | `FX-PHR-011` |
| `PHR-REQ-013` | created_at 기반 TTL | `FX-PHR-010` |
| `PHR-REQ-014` | 비정상 시각·만료 정리 안전 | `FX-PHR-010`, `FX-PHR-011` |
| `PHR-REQ-015` | Runtime Evidence 전 Delivery 금지 | `FX-PHR-014` |
| `PHR-REQ-016` | Delivery 후 단일 Consumption | `FX-PHR-015`, `FX-PHR-016` |
| `PHR-REQ-017` | 실패별 Manual Resume | `FX-PHR-006`~`FX-PHR-014`, `FX-PHR-017` |
| `PHR-REQ-018` | 안전한 Manual Resume Metadata | `FX-PHR-006`~`FX-PHR-011`, `FX-PHR-017` |
| `PHR-REQ-019` | 일반 Session Fail-open | `FX-PHR-011`, `FX-PHR-014`, `FX-PHR-017` |
| `PHR-REQ-020` | Handoff로 실행·Promotion 없음 | `FX-PHR-019`, `FX-PHR-020` |

Fixture 정의만 존재하는 것은 구현 또는 Pass Evidence가 아니다.

```text
implementation: not_verified
fixture_result: not_run
cross_session_e2e: not_verified
runtime_supported: not_verified
```

## 24. 검수 관점

### State

- Candidate, Pending, Claim, Delivery, Consumption과 Availability가 혼합되지 않는가
- 실패한 Claim과 Crash가 미만료 Candidate를 영구 유실시키지 않는가
- Delivered 후 재주입 없이 Consumption만 복구하는가

### Truthfulness

- 대상 Session 사용 가능 Evidence 없이 Delivery Success를 주장하지 않는가
- Manual Resume와 Automatic Rehydration Success를 구분하는가
- 실행하지 않은 Fixture와 Runtime 지원을 Pass로 표현하지 않는가

### Safety

- Raw Content와 원문 Identity가 저장되지 않는가
- Unknown·손상·만료·충돌이 자동 실행으로 이어지지 않는가
- Rehydration 실패 후 일반 Session이 계속되는가

### Boundary

- Context Checkpoint `review_needed`가 Pending Candidate로 변환되지 않는가
- 새 Session 생성과 Runtime Invocation이 사용자·후속 Managed Workflow 책임으로 남는가
