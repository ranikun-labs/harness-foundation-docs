---
title: V2 Local Invocation POC
status: draft
implementation_status: missing
owner: development
last_reviewed: 2026-07-15
decision_status: experiment
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0005
  - ADR-0007
  - ADR-0008
source_inputs:
  - docs/roadmap/product-roadmap.md
  - docs/product/v1-completion-criteria.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/contracts/runtime-capability-contract.md
  - docs/contracts/execution-policy-contract.md
  - docs/testing/v1-fixture-plan.md
  - docs/architecture/local-cloud-human-boundary.md
---

# V2 Local Invocation POC

## 1. 문서 목적

이 문서는 `oh-my-ai` V2 후보 기능인 Local Runtime Invocation의 기술 가능성, 안전 경계, 제품 가치를 검증하기 위한 POC 계획을 정의한다.

이 문서는 V2 제품 요구사항을 확정하는 Contract가 아니다.
또한 V1 Release Requirement가 아니다. DEC-051 기준 Lean V1은 Local Manual Artifact Workflow이며, Runtime Invocation과 Managed Result Return을 요구하지 않는다.

검증 흐름:

```text
승인된 Structured Handoff
→ Runtime Capability 확인
→ Execution Policy 확인
→ Runtime별 Projection
→ Local Runtime Process Invocation
→ Local Result Capture
→ Result Basic Candidate
→ Human Review
```

핵심 질문:

```text
1. Harness가 Claude·Codex 같은 Runtime을 Local에서 안정적으로 호출할 수 있는가
2. Runtime별 차이를 Adapter로 격리할 수 있는가
3. Handoff 의미를 유지하며 Prompt를 전달할 수 있는가
4. 실행 전 Human Approval과 실행 중 안전 경계를 유지할 수 있는가
5. 자유형 Runtime Output을 Result Basic Candidate로 변환할 수 있는가
6. Code·Prompt·Context·Result 원문을 Cloud에 보내지 않고 동작하는가
7. 자동 호출이 Manual Copy/Paste보다 충분한 사용자 가치를 제공하는가
```

---

## 2. 제품 위치

```text
V1
= Manual Runtime Selection
= Manual Prompt Delivery
= Manual Result Return

V2 POC
= Local Runtime Invocation 가능성 검증
= Local Result Capture 가능성 검증
= Managed Result Return 후보 검증

V2 Product
= POC 통과 후 별도 Product Contract에서 확정
```

POC 성공이 다음을 자동 확정하지 않는다.

```text
Multi-agent Orchestration
Automatic Runtime Selection
Cloud Task Queue
Remote Execution
Managed SessionBinding
Session Linking
Result 자동 정규화
Task / Result Correlation
Organization Approval
```

---

## 3. Decision Status

```text
experiment
```

의미:

```text
아키텍처 확정 아님
Runtime 지원 약속 아님
Public Feature 약속 아님
V1 Release Gate 아님
V2 Product Scope 확정 아님
```

종료 판정:

```text
validated
validated_with_constraints
rejected
inconclusive
```

---

# Part I. Hypotheses and Scope

## 4. 핵심 가설

### H1. Local Invocation Feasibility

```text
Harness가 Runtime CLI를 Local Child Process로 실행하고
정상 종료·오류·Timeout·Cancellation을 구조적으로 처리할 수 있다.
```

### H2. Adapter Boundary

```text
Runtime별 CLI 차이는 Runtime Adapter에서 격리할 수 있다.
Core Workflow는 Runtime별 Argument·Output Format을 직접 알지 않는다.
```

### H3. Semantic Preservation

```text
Approved Handoff의 Goal·Scope·Prohibition·Validation·Return Contract를
Runtime Projection으로 전달해도 의미가 약화되지 않는다.
```

### H4. Human Control

```text
자동 호출이 도입돼도 Runtime 선택·실행·수정 행동·Result 수용은
Human Gate 아래 유지된다.
```

### H5. Local Data Boundary

```text
Code·Document·Prompt·Context·Result 원문을
oh-my-ai Cloud에 전송하지 않고 기능을 제공할 수 있다.
```

### H6. Result Normalization

```text
Runtime Output을 Result Basic Candidate로 변환하면서
Worker Claim·Evidence·Validation·Unknown을 구분할 수 있다.
```

### H7. Product Value

```text
Manual Copy/Paste보다 준비·전달·회수 비용을 실질적으로 줄이며,
추가 복잡도와 안전 비용을 정당화한다.
```

---

## 5. POC 포함 범위

```text
Local Runtime Discovery
Runtime Availability Check
Runtime Version Detection
Static Capability Metadata
Approved Handoff Input
Runtime Projection
Execution Policy Gate
Explicit Invocation Approval
Local Child Process 실행
stdin / argument / temp-file 기반 Prompt 전달 비교
stdout / stderr Capture
Exit Code Capture
Timeout
Cancellation
Process Cleanup
Local Invocation Artifact
Result Basic Candidate 변환
Human Result Review
POC Metrics 수집
```

---

## 6. POC 제외 범위

```text
Cloud Runtime Execution
Remote Worker
Runtime Broker
Automatic Runtime Selection
Multi-agent Graph
Parallel Agent Execution
Task Queue
Retry Orchestrator
Provider SessionBinding
Long-running Background Agent
Automatic Repository Apply
Automatic Commit·Push·PR
Automatic Project Context Promotion
Billing·Entitlement Enforcement
Organization Policy
Team Workspace
```

---

## 7. Runtime 범위

최소 비교 대상:

```text
Runtime A = Codex CLI
Runtime B = Claude Code CLI
```

POC 성공 조건은 두 Runtime 모두 성공하는 것이 아니다.

```text
최소 1개 Runtime에서 End-to-End 성공
```

두 Runtime 비교 목적:

```text
Adapter Boundary 검증
입출력 방식 차이 확인
Result Capture 차이 확인
Approval·Sandbox 모델 차이 확인
```

---

# Part II. Responsibility Boundary

## 8. Core 책임

```text
Invocation 요청 수신
Handoff·Policy·Capability 참조 검증
Lifecycle 상태 관리
Adapter 호출
Timeout·Cancellation
Local Artifact 기록
Result Candidate 전달
```

Core는 Runtime별 CLI Argument를 직접 구성하지 않는다.

---

## 9. Runtime Adapter 책임

```text
Runtime Discovery
Version Detection
Availability Check
Command Construction
Prompt Delivery Method
Environment Mapping
Working Directory Mapping
Output Capture Mapping
Exit Status Mapping
Runtime-specific Error Mapping
Result Extraction Hint
Cleanup
```

Adapter 금지:

```text
Handoff Scope 확대
Prohibited Action 제거
Do Not Touch 완화
Execution Policy 완화
Human Approval 생성
Result 자동 승인
Worker Claim을 Verified Evidence로 승격
Canonical Result 상태를 직접 확정
```

---

## 10. Execution Policy 책임

```text
Runtime 실행 허용 여부
File Read·Write 허용 여부
Shell 실행 허용 여부
Network 사용 허용 여부
Git Action 허용 여부
Approval 필요 여부
Approval Scope 유효성
```

Capability가 Supported여도 Policy가 금지하면 실행하지 않는다.

---

## 11. Human 책임

```text
Runtime 선택
Projection 승인
Invocation 승인
Action Approval
Result 승인·수정·거절
Repository 반영
Project Context Promotion
```

POC는 Human Decision을 자동화하지 않는다.

---

# Part III. Proposed Architecture

## 12. 구성 요소

```text
Local Invocation Coordinator
Runtime Registry
Runtime Adapter
Capability Resolver
Policy Resolver
Projection Builder
Process Supervisor
Output Collector
Result Normalizer
Local Artifact Store
Human Review UI or CLI
```

---

## 13. 데이터 흐름

```text
Approved Handoff
        ↓
Capability Resolver
        ↓
Policy Resolver
        ↓
Runtime Projection
        ↓
Human Invocation Approval
        ↓
Local Invocation Coordinator
        ↓
Runtime Adapter
        ↓
Process Supervisor
        ↓
Local Runtime Process
        ↓
Output Collector
        ↓
Result Normalizer
        ↓
Result Basic Candidate
        ↓
Human Review
```

---

## 14. Local-only 경계

Local에서 처리:

```text
Source Code
Repository Documents
Task 원문
Prompt 원문
Handoff 원문
Execution Policy
Runtime Output
Result Basic 원문
Evidence
Diff
Command Output
```

Cloud 전송 금지:

```text
Code 원문
Document 원문
Prompt 원문
Handoff 원문
Result 원문
Diff 원문
Command Output 원문
Secret
Credential
```

향후 Cloud Control Plane에 허용 가능한 Metadata 후보:

```text
Feature Name
Runtime ID
Runtime Version
Success / Failure Category
Duration Bucket
Error Code
Artifact Size Bucket
```

이 POC에서는 Cloud 전송을 구현하지 않는다.

POC Metrics·Telemetry·Error Category·Duration도 Local Artifact에만 저장하며 외부 전송하지 않는다.

---

# Part IV. Invocation Contract

## 15. Invocation Input

필수:

```text
invocation_ref
source_handoff_ref
source_handoff_artifact_version
runtime_id
runtime_adapter_id
runtime_adapter_version
runtime_projection_ref
capability_report_ref
policy_ref
approval_refs
working_directory
timeouts:
  startup_timeout
  execution_timeout
  graceful_shutdown_timeout
created_at
created_by
```

선택:

```text
environment_overrides
output_directory
runtime_options
cancellation_token_ref
```

`environment_overrides`와 `runtime_options`는 Adapter별 Typed Schema와 Allowlist를 통과해야 한다.

금지:

```text
Raw Shell Argument String
임의 Parent Environment 복사
Allowlist 밖 Environment Key
Secret Value 직렬화
Capability 또는 Policy를 약화하는 Option
```

---

## 16. Invocation Reference

`invocation_ref`는 Local Artifact Reference다.

다음이 아니다.

```text
Managed ExecutionRun ID
Cloud Task ID
Provider Session ID
Global Correlation ID
```

권장 형식:

```text
invocation-YYYYMMDD-HHMMSS-runtime-slug
```

---

## 17. Invocation 상태 축

### Lifecycle Status

```text
created
ready_for_review
approved
starting
running
terminating
finished
superseded
```

### Process Outcome

```text
not_started
exited_zero
exited_nonzero
start_failed
timed_out
cancelled
termination_failed
unknown
```

### Cancellation Status

```text
not_requested
requested
completed
failed
```

### Cleanup Status

```text
not_started
running
completed
failed
unknown
```

### Validation Status

```text
valid
invalid
incomplete
conflicting
```

### Readiness Status

```text
ready_candidate
awaiting_approval
blocked
unavailable
unresolved
```

### Result Capture Status

```text
not_started
capturing
captured
partial
missing
failed
```

상태 축을 혼합하지 않는다.

---

## 18. Invocation 전제조건

실행 전 다음이 모두 충족돼야 한다.

```text
Handoff lifecycle_status = approved 또는 exported
Handoff contract_validation_status = valid
Capability Compatibility가 compatible
또는
compatible_with_manual_steps이며 모든 필수 Manual Step 완료 Evidence 존재
Policy validation_status = valid
Policy lifecycle_status = current
Invocation Action Approval = active
Runtime Availability = available 또는 approved degraded
Projection Semantic Preservation = passed
Working Directory Safe
Output Path Safe
```

다음 Capability 상태에서는 Process Start를 금지한다.

```text
incompatible
unknown
missing
invalid
conflicting
```

`compatible_with_manual_steps`는 모든 필수 Manual Step 완료와 Compatibility 재계산 후에만 허용한다.

Availability가 degraded인 경우 다음을 모두 만족해야 한다.

```text
안전성·Scope·Validation에 영향 없음
Known Limitation 구체화
Human이 제한사항 확인
Invocation Approval에 제한사항 포함
```

안전 영향을 판정할 수 없으면 `unavailable` 또는 `unresolved`로 처리한다.

하나라도 확인할 수 없으면 실행하지 않는다.

---

## 19. Invocation Approval

Invocation Approval은 다음과 결합된다.

```text
Runtime ID
Runtime Adapter Version
Handoff Reference
Handoff Artifact Version
Projection Reference
Policy Reference
Working Directory
Startup Timeout
Execution Timeout
Graceful Shutdown Timeout
Allowed Actions
```

다음 변경 시 재승인한다.

```text
Runtime 변경
Adapter Version 변경
Handoff Version 변경
Projection 변경
Policy 변경
Working Directory 변경
Startup·Execution·Graceful Shutdown Timeout의 Material 변경
Allowed Action 변경
```

---

# Part V. Runtime Adapter Contract

## 20. Adapter Identity

```text
adapter_id
adapter_version
runtime_id
supported_runtime_version_range
adapter_schema_version
lifecycle_status
last_verified_at
```

허용 Lifecycle:

```text
draft
active
deprecated
retired
```

---

## 21. Adapter Interface

개념적 Interface:

```text
discover()
checkAvailability()
detectVersion()
buildInvocation()
validateInvocation()
start()
mapOutputStreams()
cancel()
runtimeSpecificCleanup()
normalizeExit()
extractNativeStructuredOutput()
provideNormalizationHints()
```

POC 구현 언어와 실제 함수명은 별도 결정이다.

---

## 22. Adapter Output

`buildInvocation()` 결과:

```text
executable
argument_array
shell_enabled
stdin_mode
stdin_payload_ref
working_directory
environment
timeout
output_capture_mode
cleanup_plan
redaction_plan
```

기본값:

```text
shell_enabled = false
```

Raw Secret을 포함한 Argument·Environment를 Artifact에 기록하지 않는다.

---

## 23. Prompt 전달 방식 비교

```text
stdin
command argument
temporary file
runtime-native prompt file
```

평가 기준:

```text
길이 제한
Shell escaping 위험
Secret 노출 위험
Process list 노출 위험
Runtime 지원 여부
Cleanup 가능성
Debuggability
Cross-platform 가능성
```

기본 우선순위 후보:

```text
stdin
> permission-restricted temporary file
> command argument
```

Command Argument는 Process List 노출 가능성을 검토한다.

---

## 24. Environment 전달

허용:

```text
Runtime 실행에 필요한 최소 Environment
POC 전용 Non-secret Flag
Working Directory
Output Path
```

금지:

```text
전체 Parent Environment 무검토 복사
Secret을 Invocation Artifact에 기록
Credential 값을 Log에 출력
```

Environment Allowlist 또는 Explicit Mapping을 사용한다.

Parent Environment 전체 복사는 금지한다.

---

# Part VI. Process Supervision

## 25. Process Start

기록:

```text
start_requested_at
process_started_at
process_id 또는 local opaque reference
runtime_version
adapter_version
working_directory
```

OS Process ID를 장기 Artifact 식별자로 사용하지 않는다.

---

## 26. Timeout

필수 Timeout:

```text
startup_timeout
execution_timeout
graceful_shutdown_timeout
```

Timeout 발생 시:

```text
process_outcome = timed_out
cancel signal 전송
grace period 대기
필요 시 강제 종료
child·descendant process 정리
partial output 보존
Workflow 성공 추정 금지
```

---

## 27. Cancellation

상태:

```text
cancellation_status = requested | completed | failed
process_outcome = cancelled 가능
```

Cancellation 후:

```text
추가 Output 수집 중단 여부 기록
Child Process 잔존 여부 확인
Partial Result Candidate 생성 가능
Repository Side Effect 검사
```

---

## 28. Child Process Cleanup

검증:

```text
직접 Child 종료
Descendant Process 존재 여부
Temporary File 삭제
Open Handle 정리
Lock 해제
Output Flush
```

Background Agent를 남기지 않는다.

Cleanup 실패:

```text
cleanup_status = failed
unresolved_risk 기록
Human Warning
추가 Invocation 차단
```

지원 대상으로 선언하는 Runtime·OS·Action 범위에서는 Child·Descendant Cleanup이 검증돼야 한다.

검증되지 않거나 잔존 Process 가능성이 있는 조합은 지원 범위에서 제외한다.

---

## 29. Concurrent Invocation

POC 기본:

```text
동일 Repository에서 동시 Invocation 금지
```

두 번째 Invocation은 Process Start 전에 차단돼야 한다.

POC는 Local Lock 또는 동등한 Atomic Reservation을 사용한다.

필수 기록:

```text
repository_lock_ref
acquired_at
released_at
lock_owner_invocation_ref
lock_status
```

Lock 획득 실패:

```text
concurrent_invocation_blocked
```

이유:

```text
Writer Conflict
Dirty Worktree 충돌
Result Correlation 혼동
Approval Scope 충돌
```

동시 실행은 V2 Product 이후 별도 설계 대상이다.

---

# Part VII. Output Capture

## 30. Capture 대상

```text
stdout
stderr
exit_code
start_time
finish_time
timeout
cancellation
runtime-generated file
runtime error category
```

---

## 31. Capture 원칙

1. stdout과 stderr를 분리한다.
2. Exit Code를 보존한다.
3. 대용량 Output은 크기 제한을 둔다.
4. Truncation 여부와 보존 구간을 표시한다.
5. Secret Pattern을 Artifact 저장 전에 검사한다.
6. Raw Output과 Parsed Result를 구분한다.
7. Partial Output을 Complete Result로 표시하지 않는다.
8. Binary Output을 원문으로 저장하지 않는다.

---

## 32. Output Size

```text
captured_bytes
truncated
truncation_reason
raw_output_ref
```

크기 제한 초과 시:

```text
Tail 또는 Head 일부 보존
Hash 기록 가능
Result Normalizer에 truncation 전달
Truthfulness Warning 생성
```

정확한 크기 제한은 POC 결과로 결정한다.

---

## 33. Sensitive Output

Runtime Output 저장 순서:

```text
Process Stream
→ Bounded Capture
→ Secret Pattern 검사
→ Redaction 또는 격리
→ 안전한 Artifact 저장
```

Secret-like Value 발견 시:

```text
sensitive_data_status = violation_detected
원문 재복제 금지
Redacted Capture 생성
Result Import 차단
Human Warning
```

Secret 원문을 일반 `stdout.log` 또는 `stderr.log`에 먼저 저장하지 않는다.

원문이 반드시 필요한 진단 Case는 User-only Permission을 적용한 격리 Artifact로 제한하고 Import·Cloud 전송을 차단한다.

Runtime Output에 포함된 Credential을 Cloud나 다른 Artifact로 복제하지 않는다.

---

# Part VIII. Result Normalization

## 34. Normalization 경로

### Path A. Native Structured Result

```text
Runtime이 Result Basic Schema를 직접 출력
→ Schema Validation
→ Evidence Reference 무결성 검사
→ Result Basic Candidate
```

### Path B. Freeform Result

```text
Runtime이 자유형 Output 반환
→ Result Normalizer
→ Parse Status 표시
→ Result Basic Candidate
→ Human Review
```

Path B를 Runtime의 Structured Result Capability로 기록하지 않는다.

---

## 35. Normalizer 책임

```text
Output Parsing
Known Section 추출
Files Read / Changed 후보 추출
Commands 후보 추출
Validation 후보 추출
Unknown 표시
Evidence Reference 연결
Parse Confidence 표시
```

Normalizer 금지:

```text
없는 Evidence 생성
실행하지 않은 Validation을 Passed로 생성
Worker Claim을 Verified로 승격
Scope Deviation 삭제
Result 자동 승인
Worker Claim을 Verified Evidence로 승격
Canonical Result 상태를 직접 확정
```

---

## 36. Parse 상태

```text
complete
partial
failed
not_applicable
```

`partial` 또는 `failed` Result는 자동 Import할 수 없다.

---

## 37. Result Correlation

```text
invocation_ref
source_handoff_ref
source_handoff_artifact_version
runtime_id
adapter_version
raw_output_ref
```

Provider Session ID가 존재하더라도 Canonical Identity로 사용하지 않는다.

---

# Part IX. Local Artifact Layout

## 38. 권장 구조

```text
.local/oh-my-ai/
└── invocations/
    └── <invocation-ref>/
        ├── invocation.yaml
        ├── projection.md
        ├── policy-ref.yaml
        ├── capability-ref.yaml
        ├── stdout.log
        ├── stderr.log
        ├── result-candidate.yaml
        ├── evidence/
        └── cleanup.yaml
```

정확한 Root 경로는 Open Decision이다.

Repository Source Tree와 Generated Artifact를 분리한다.

---

## 39. File Permission

민감 가능 Artifact:

```text
Projection
stdout
stderr
Result Candidate
Evidence
```

민감 가능 Artifact에는 다음이 필수다.

```text
User-only read/write
제한된 Directory Permission
Source Tree 밖 Artifact Root
Symlink Escape 차단
Permission 적용·검증 결과 기록
Temporary File 즉시 Cleanup
```

Permission을 적용하거나 검증할 수 없으면 민감 Artifact 저장을 차단하고 POC 결과에 제한을 기록한다.

OS별 Permission 차이는 POC에서 확인한다.

---

## 40. Retention

POC 기본:

```text
명시적 사용자 삭제 전 Local 보존
```

별도 정리 대상:

```text
Temporary Prompt File
Raw Secret-containing Output
Failed Invocation Temporary Artifact
Large Raw Log
```

Retention 정책은 V2 Product Contract에서 확정한다.

---

# Part X. Error Model

## 41. Error Category

```text
runtime_not_found
runtime_version_unsupported
adapter_not_found
adapter_invalid
capability_incompatible
policy_blocked
approval_missing
availability_unavailable
projection_invalid
working_directory_unsafe
process_start_failed
process_crashed
timeout
cancelled
output_capture_failed
result_missing
result_parse_failed
sensitive_data_violation
cleanup_failed
handoff_invalid
approval_expired
approval_revoked
semantic_preservation_failed
concurrent_invocation_blocked
environment_invalid
path_unsafe
symlink_escape
output_truncated
result_validation_failed
artifact_write_failed
repository_drift_detected
unknown_error
```

---

## 42. Error Truthfulness

구분:

```text
Invocation Failed
Runtime Process Failed
Output Capture Failed
Result Parse Failed
Result Validation Failed
```

예:

```text
Runtime Process Exit Code = 0
Result Parse Failed

→ Invocation Process 성공
→ Result Capture 실패
→ 전체 Workflow 성공 아님
```

---

## 43. Retry

POC 기본:

```text
Automatic Retry 없음
```

이유:

```text
중복 Side Effect
추가 비용
Repository 상태 변화
Approval 재사용 위험
Error 원인 은폐
```

재시도는 새 Invocation Candidate로 생성하고 Human Approval을 다시 확인한다.

---

# Part XI. Security and Safety

## 44. Command Injection

Runtime Adapter는 사용자 Task 원문을 Shell Command String에 직접 연결하지 않는다.

권장:

```text
Executable + Argument Array
stdin 전달
Shell=false
```

Shell이 필요한 경우 별도 POC Case로 제한한다.

---

## 45. Path Safety

```text
Canonical Path
Allowed Root
Traversal
Symlink Escape
Do Not Touch
Output Root
Temporary File Location
```

---

## 46. Credential Safety

금지:

```text
Credential Log
Command Argument Secret
Environment Dump
Prompt Artifact 내 Secret 원문
Cloud Telemetry 전송
```

Runtime 자체 인증은 Runtime이 관리한다.

Harness는 Provider Credential을 수집·복제·동기화하지 않는다.

---

## 47. Repository Safety

Invocation 전후 검사:

```text
Branch
Commit
Dirty Worktree
Tracked Changes
Untracked Files
Git Index
```

POC가 Repository Writer를 자동 승인하지 않는다.

실행 후 Side Effect가 Handoff Scope를 벗어나면:

```text
Result Candidate에 Deviation 기록
Import 차단
Human Review
```

---

# Part XII. POC Scenarios

## 48. Scenario A — Read-only Analysis

```text
Task = Repository 구조 분석
Policy = Read-only
Expected = Invocation 성공, File Change 없음, Result Capture
```

## 49. Scenario B — Approved Single-file Patch

```text
Task = README 한 파일 수정
Policy = File Modify approval_required
Approval = README.md만 허용
Expected = Scope 안 변경만 발생
```

## 50. Scenario C — Runtime Missing

```text
Runtime Binary 없음
→ availability_unavailable
→ Process Start 안 함
→ Handoff·Projection 보존
```

## 51. Scenario D — Timeout

```text
Runtime이 execution_timeout 초과
→ Cancellation
→ Child Cleanup
→ Partial Output 보존
→ Complete Result 생성 금지
```

## 52. Scenario E — Freeform Result

```text
Runtime이 Result Basic을 직접 반환하지 않음
→ capability.result.freeform supported
→ Normalizer 실행
→ parse_status 표시
→ Human Review 요구
```

## 53. Scenario F — Policy Block

```text
Runtime Capability는 File Write 지원
Policy는 File Write prohibited
→ Invocation 차단
→ Adapter Start 호출 안 함
```

## 54. Scenario G — Sensitive Output

```text
Runtime Output에 Secret-like Value 포함
→ Redaction
→ Import 차단
→ sensitive_data_violation
```

## 55. Scenario H — Cancellation

```text
사용자가 실행 중 취소
→ cancelled
→ Child Cleanup
→ Side Effect 검사
→ Partial Result 가능
```

---

# Part XIII. Measurement

## 57. 기술 지표

```text
Runtime Discovery 성공률
Process Start 성공률
Normal Completion 비율
Timeout 비율
Cancellation 성공률
Cleanup 성공률
Output Capture 성공률
Result Parse 성공률
Schema Validation 성공률
Scope Deviation 탐지율
Secret Redaction 성공률
```

---

## 58. 사용자 가치 지표

```text
Manual Copy/Paste 단계 감소
Handoff 전달 시간 감소
Result 정리 시간 감소
Runtime 전환 비용 감소
오류 원인 이해 가능성
Human Control 체감
신뢰도
```

POC 실행 전에 다음을 고정한다.

```text
Scenario별 실행 횟수
Runtime·Version·OS Matrix
Manual Flow Baseline
필수 성공 Threshold
Product Value Threshold
Adapter Maintenance Budget
Zero-tolerance Safety Metric
```

결과 확인 후 Threshold를 변경하지 않는다.

Zero-tolerance 항목:

```text
Credential 노출
승인 없는 Mutation
Scope 밖 변경 미탐지
Orphan Process
Raw-data Cloud Egress
```

---

## 59. 복잡도 지표

```text
Runtime별 Adapter 코드량
Runtime별 예외 분기 수
공통 Core 대비 Adapter 비율
실패 유형 수
Manual Recovery 단계 수
Fixture 수
Maintenance 예상 비용
```

제품 가치보다 Adapter 유지비가 과도하면 POC를 중단할 수 있다.

권장 사전 Threshold 구조:

```yaml
decision_thresholds:
  max_unapproved_mutation: 0
  max_secret_exposure: 0
  max_orphan_process: 0
  max_raw_data_cloud_egress: 0
  minimum_e2e_pass_rate: <POC 시작 전 결정>
  minimum_manual_step_reduction: <POC 시작 전 결정>
  maximum_adapter_maintenance_budget: <POC 시작 전 결정>
```

성공률은 다음과 함께 기록한다.

```text
성공 Run 수 / 전체 Run 수
Scenario별 실행 횟수
Runtime·Version·OS별 결과
Warm / Cold Start 구분
```

---

# Part XIV. Success Criteria

## 60. POC 통과 기준

### 필수 기술 기준

```text
최소 1개 Runtime에서 End-to-End 성공
Approved Handoff만 실행
Policy Block이 Adapter Start 전에 적용
Timeout·Cancellation·Cleanup 검증
stdout·stderr·exit_code 분리
Result Basic Candidate 생성
Partial·Missing·Failed 상태 표현
Secret 원문 미저장
Repository Scope Deviation 탐지
Cloud 의존 없음
```

### 필수 Contract 기준

```text
Handoff Semantic Preservation
Capability·Policy·Availability 분리
Invocation Approval Scope 명확
Runtime Adapter가 Policy 완화 불가
Result 자동 승인 없음
Repository 자동 반영 없음
```

### Adapter Boundary 검증 기준

```text
최소 2개 상이한 Runtime Adapter 비교
Core에 Runtime별 분기 없음
동일 Handoff의 보호 필드 의미 보존
Runtime별 Argument·Output 차이는 Adapter 내부에 한정
```

두 번째 Runtime을 포함하지 않으면 H2는 provisional이며 전체 판정은 `validated_with_constraints`까지 가능하다.

### 선택 비교 기준

```text
Prompt 전달 방식 비교
Structured vs Freeform Result 비교
OS별 차이 확인
```

---

## 61. Validated with Constraints

```text
한 Runtime만 안정적
Freeform Result Normalization에 Human 보정 필요
지원 범위 밖 Runtime·OS 조합의 Cleanup 미검증
OS별 기능 차이 존재
Runtime Version 범위가 좁음
```

제약은 Known Limitation으로 명시한다.

다음은 `validated_with_constraints`로 허용하지 않는다.

```text
Credential 노출 가능성
Scope 밖 변경 미탐지
Descendant Process 잔존 가능성
Policy Block 이후 Process Start 가능성
Cloud Raw-data Egress 가능성
Result Truthfulness 보장 불가
```

V1 Release 기준에는 영향을 주지 않는다.

---

## 62. POC 실패 기준

```text
Policy Block 전에 Runtime 실행
Handoff 의미 보존 불가
Secret 또는 Prompt 원문 Cloud 전송
Child Process Cleanup 불가
Scope 밖 변경 탐지 불가
Result 상태를 정직하게 표현 불가
Adapter별 예외가 Core를 오염
Manual 방식 대비 가치 부족
```

---

## 63. Abort Criteria

```text
Credential 노출
Production Endpoint 접근
Repository 파괴
Unbounded Child Process
사용자 승인 없는 File Mutation
Cloud 원문 전송
승인 없는 Scope 밖 Mutation 시도
Secret-like Data의 일반 Artifact 저장
Cleanup 불가 상태에서 추가 실행 시도
```

---

# Part XV. Fixture Plan

## 64. Positive Fixture

```text
Runtime Discovery
Runtime Available
Approved Read-only Invocation
Approved Single-file Modify
Structured Result Capture
Freeform Result Normalize
Cancellation
Timeout Cleanup
```

## 65. Negative Fixture

```text
Runtime Missing
Unsupported Runtime Version
Adapter Missing
Invalid Projection
Policy Prohibited
Approval Missing
Approval Scope Mismatch
Unsafe Working Directory
Prompt Argument Injection
Secret Environment Leak
Output Secret
Timeout Cleanup Failure
Result Missing
Parse Failure
Scope Deviation
Process Start Failure
Runtime Exit Non-zero
Unknown Capability
Expired / Revoked Invocation Approval
Concurrent Invocation
Dirty In-scope Worktree
Symlink Escape
Output Truncation
Artifact Permission Failure
Artifact Write Failure
Descendant Cleanup Failure
Repository Drift
Cloud Egress Attempt
Automatic Retry Attempt
```

## 66. Cross-runtime Fixture

두 번째 Runtime을 포함한 경우 동일 Handoff로 비교한다.

```text
Projection 의미 동일
Policy 결과 동일
Result Contract 의미 동일
Runtime-specific Argument만 다름
```

두 번째 Runtime을 포함하지 않으면 Cross-runtime Fixture는 `Not Applicable`이다.

이 경우 Adapter Boundary 가설은 provisional 또는 constrained로 판정한다.

---

# Part XVI. Deliverables

## 67. 필수 산출물

```text
POC Runner
Runtime Adapter Interface
최소 1개 Runtime Adapter
선택적 두 번째 Runtime Adapter
Invocation Artifact Schema
Local Process Supervisor
Output Collector
Result Normalizer
POC Fixture
POC Result Report
Go / No-go Decision
```

## 68. POC Result Report

```text
Hypothesis별 결과
Runtime별 차이
성공·실패 Scenario
Security Finding
Contract Drift
Known Limitation
Metrics
Product Value 평가
Maintenance Cost 평가
Go / Conditional Go / No-go
```

---

# Part XVII. Go / No-go Decision

## 69. Go

```text
모든 필수 Safety·Contract Criteria 통과
Abort Event 0건
최소 1개 Runtime 필수 Scenario E2E 통과
Adapter Boundary는 최소 2개 Runtime으로 검증
Result Normalization Scenario 통과
사전 Product Value Threshold 충족
사전 Maintenance Budget 이내
지원 Runtime·Version·OS 범위 명확
```

## 70. Conditional Go

```text
특정 Runtime·Version만 지원
Manual Result 보정 필요
일부 OS만 지원
고급 Action 제외
Read-only 또는 제한된 Patch만 지원
```

## 71. No-go

```text
Runtime Invocation이 Product Core를 과도하게 복잡하게 함
CLI 변화에 Adapter가 지나치게 취약
Result Normalization 신뢰 불가
안전한 Process Cleanup 불가
Manual Flow 대비 가치 부족
```

---

# Part XVIII. Open Decisions

## 72. 미결정 사항

1. POC 구현 언어
2. Process Supervisor Library
3. 첫 번째 Runtime
4. 두 번째 Runtime 포함 여부
5. Prompt 전달 기본 방식
6. Local Artifact Root
7. Output 크기 제한
8. 기본 Timeout
9. Cancellation Signal 전략
10. Descendant Process 탐지 방식
11. Result Normalizer 구현 방식
12. Runtime Native Structured Output 사용 여부
13. OS Matrix
14. Sandbox 통합 범위
15. Adapter Packaging
16. POC Telemetry 저장 방식
17. Artifact Retention
18. Local Lock 방식
19. Runtime Version Pinning
20. POC 사용자 수

미결정 사항을 구현자가 임의로 Product Contract로 확정하지 않는다.

---

## 73. 불변조건

1. 이 문서는 Experiment Plan이다.
2. V1 Manual Workflow를 변경하지 않는다.
3. Local Runtime Invocation과 Managed Result Return 후보만 검증한다.
4. Code·Prompt·Context·Result 원문을 Cloud로 보내지 않는다.
5. Runtime 선택과 Invocation은 Human-controlled다.
6. Capability·Policy·Availability를 분리한다.
7. Runtime Adapter는 Handoff와 Policy를 완화하지 않는다.
8. Approved Handoff만 실행한다.
9. Invocation Approval은 Handoff Version에 결합한다.
10. Automatic Retry를 하지 않는다.
11. Child Process를 남기지 않는다.
12. Secret을 Argument·Log·Artifact에 노출하지 않는다.
13. Result Basic은 Candidate다.
14. Result를 자동 승인하거나 Repository에 반영하지 않는다.
15. 최소 1개 Runtime 성공으로 POC를 평가할 수 있다.
16. 두 Runtime 모두를 V2 필수로 확정하지 않는다.
17. POC 결과는 별도 Go / No-go Decision을 거친다.
18. Unknown Capability로 Process Start하지 않는다.
19. Runtime 1개 성공만으로 Adapter Boundary를 완전 검증하지 않는다.
20. 민감 Output은 Secret Scan·Redaction 이후에만 일반 Artifact로 저장한다.
21. 지원 범위의 Child·Descendant Cleanup은 검증돼야 한다.
22. Go / No-go Threshold는 POC 실행 전에 고정한다.

---

## 74. 관련 문서

```text
docs/roadmap/product-roadmap.md
docs/product/v1-completion-criteria.md
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
docs/architecture/local-cloud-human-boundary.md
```

---

## 75. 검수 관점

### Product

- Manual Flow보다 충분한 가치가 있는가
- V2 유료 기능 후보로 의미가 있는가
- V1 Scope를 오염시키지 않는가

### Architecture

- Runtime Adapter가 Core와 분리되는가
- Process Supervision이 안정적인가
- Result Normalization이 독립적인가

### Safety

- Approval 없이 실행되지 않는가
- Scope 밖 변경을 탐지하는가
- Secret·Path·Child Process를 안전하게 처리하는가

### Boundary

- Local·Cloud 경계가 유지되는가
- Capability·Policy·Availability가 분리되는가
- Managed Workflow와 Remote Execution이 유입되지 않는가

### Decision

- Go / Conditional Go / No-go 판정이 가능한가
- POC 결과가 Product Contract와 구분되는가
