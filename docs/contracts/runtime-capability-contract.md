---
title: Runtime Capability Contract
status: draft
implementation_status: missing
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
  - docs/product/v1-completion-criteria.md
  - docs/contracts/handoff-basic-contract.md
  - docs/contracts/pending-handoff-rehydration-contract.md
  - docs/contracts/result-basic-contract.md
  - docs/architecture/local-cloud-human-boundary.md
---

# Runtime Capability Contract

## 1. 문서 목적

이 문서는 Runtime별 기능 가능 범위를 정직하게 표현하기 위한 Static Capability Contract를 정의한다.
DEC-051 기준 Lean V1 P0의 필수 흐름은 Manual Copy/Paste이며, Runtime Projection과 Runtime별 정적 사용 안내 고도화는 V1 Alpha 품질 범위다.

Capability의 목적은 Runtime을 선택하거나 우열을 평가하는 것이 아니다.

정확한 목적은 다음과 같다.

```text
Approved Handoff
→ Runtime Capability 확인
→ Projection 가능성 판정
→ 지원·조건부·미지원·미확인 표시
→ Human Review
```

위 흐름은 V1 Alpha 품질 기능 또는 V2 Runtime Invocation 준비 범위이며, V1 P0 Release Gate가 아니다.

Capability Contract는 다음을 방지한다.

```text
지원하지 않는 기능을 지원한다고 광고
조건부 기능을 항상 가능한 것처럼 표현
미확인 기능을 Supported로 추정
Execution Policy를 Capability로 오인
Entitlement를 Capability로 오인
```

이 문서는 Runtime Broker, 자동 Runtime 선택, SessionBinding, Cloud Entitlement를 정의하지 않는다.

---

## 2. 책임 경계

## 2.1 Capability Contract가 소유하는 책임

```text
Runtime별 정적 Capability Metadata
지원 상태 표현
조건 표현
미확인 사유 표현
Projection 가능 여부 판정
Handoff Requirement와 Capability 비교
Capability Drift 표시
Truthful Documentation 입력
```

## 2.2 Capability Contract가 소유하지 않는 책임

```text
현재 작업에서 행동 허용 여부
사용자 승인 여부
결제·플랜 권한
Runtime 자동 실행
Runtime 자동 선택
Prompt 자동 전달
Result 자동 수집
Provider Session 관리
Remote Execution
제품 자체의 Network 동작
```

Product Notice의 Manifest 조회는 제품 Local Process의 동작이며
Runtime Capability가 아니다.

```text
capability.network.*
= Worker Runtime이 작업 수행 중 수행할 수 있는 행동

Product Notice Fetch
= 제품이 Work-start 실행에 부수해 수행하는 Local Process 동작
```

Runtime이 `capability.network.web_read`를 지원하지 않아도
Product Notice는 동작할 수 있으며, 그 반대도 성립한다.

두 축을 연결하거나 상호 조건으로 사용하지 않는다.

Product Notice의 경계는 `docs/contracts/product-notice-contract.md`가 소유한다.

## 2.3 관련 개념 구분

```text
Capability
= Runtime이 기술적으로 가능한가

Execution Policy
= 현재 작업에서 허용·승인 필요·금지되는가

Entitlement
= 사용자·플랜·조직이 기능 사용 권한을 가지는가

Availability
= 현재 환경에서 실제 사용할 수 있는가
```

V1에서 Entitlement는 비범위다.

Availability는 Local 환경 점검 결과로 별도 표현할 수 있지만 Capability 자체를 대체하지 않는다.

---

## 3. V1 불변조건

1. Capability와 Execution Policy를 분리한다.
2. Unsupported 기능을 Supported로 표현하지 않는다.
3. Unknown 기능을 추정으로 Supported 처리하지 않는다.
4. Conditional은 조건을 반드시 가진다.
5. Capability Metadata는 Runtime별로 독립 관리한다.
6. 최소 1개 지원 Runtime으로 V1 전체 흐름을 완결할 수 있어야 한다.
7. 지원 대상으로 공개한 각 Runtime은 Capability Metadata와 Projection Fixture를 가져야 한다.
8. 모든 Runtime을 동시에 지원하는 것은 V1 필수가 아니다.
9. Capability 부족으로 Handoff 의미를 조용히 약화하지 않는다.
10. Capability Drift를 문서와 실제 Projection 사이에서 검증한다.
11. Capability는 사용자 결제·플랜 권한을 표현하지 않는다.
12. Capability Metadata가 없다고 Runtime 실행 자체를 자동 차단하지 않는다.
13. 단, 지원을 증명할 수 없는 기능은 `unknown` 또는 `unsupported`로 처리한다.
14. Runtime Entry Capability는 Engine 실행 동의와 분리한다.
15. Intent Detection Capability는 User Consent가 아니다.
16. Suggestion만으로 Work-start Artifact를 생성하지 않는다.

---

# Part I. Capability Model

## 4. Capability 상태

허용 상태:

```text
supported
unsupported
conditional
unknown
```

의미:

| 상태 | 의미 |
|---|---|
| supported | 해당 Runtime이 기능을 지원한다고 검증됨 |
| unsupported | 기능을 지원하지 않음 |
| conditional | 특정 조건에서만 가능 |
| unknown | 확인 근거가 부족하거나 아직 검증하지 않음 |

---

## 5. Conditional Capability

`conditional`은 다음을 반드시 포함한다.

```text
conditions
failure_mode
required_manual_step
evidence_refs
```

Conditional Capability의 `conditions`는 기술적 지원 조건만 표현한다.

허용 예:

```text
Runtime Version
Adapter Configuration
Tool Enablement
Runtime Mode
지원 File Type 또는 Size
기술적 API 제약
```

다음은 Capability 조건이 아니다.

```text
Human Approval
현재 Binary 설치 여부
현재 Authentication 여부
현재 Repository 접근 가능 여부
Network 연결 상태
```

각각 Execution Policy 또는 Availability가 소유한다.

예:

```yaml
status: conditional
conditions:
  - "Runtime version is 0.142.0 or later"
  - "Repository tool is enabled in the adapter"
failure_mode: "Repository metadata inspection is unavailable."
required_manual_step:
  - "Use generic local context instead."
evidence_refs:
  - CAP-E-12
```

조건이 충족되지 않으면 Supported처럼 동작한다고 가정하지 않는다.

---

## 6. Unknown Capability

`unknown`은 다음을 반드시 포함한다.

```text
unknown_reason
verification_needed
safe_fallback
```

권장 `unknown_reason`:

```text
not_tested
runtime_version_unknown
environment_unavailable
documentation_missing
conflicting_evidence
adapter_not_implemented
```

허용 `safe_fallback`:

```text
block_projection
require_manual_verification
omit_optional_requirement
change_runtime
```

예:

```yaml
status: unknown
unknown_reason: not_tested
verification_needed:
  - "Run Projection Fixture RF-03"
safe_fallback: require_manual_step
```

---

## 7. Capability ID

각 Capability는 안정적인 Registry ID를 가진다.

규칙:

```text
동일 의미에는 동일 ID 사용
기존 ID의 의미 변경 금지
폐기된 ID를 다른 의미로 재사용 금지
이름 변경 시 deprecated와 replaced_by 기록
Registry 내 ID 유일
```

권장 형식:

```text
capability.<domain>.<name>
```

예:

```text
capability.files.read
capability.files.write
capability.shell.execute
capability.git.inspect
capability.git.patch
capability.github.read
capability.github.write
capability.result.structured
capability.handoff.runtime_projection
```

Display Name과 Capability ID를 구분한다.

---

# Part II. Runtime Metadata

## 8. Runtime Identity

각 Runtime Metadata는 최소 다음을 가진다.

```text
runtime_id
display_name
adapter_id
adapter_version
runtime_version_range
metadata_version
lifecycle_status
advertised_support
advertised_support_status
advertised_support_evidence
capability_metadata_status
last_verified_at
last_verified_by
```

허용 `lifecycle_status`:

```text
draft
active
deprecated
retired
```

규칙:

```text
draft
→ advertised_support = false

active
→ Advertised Runtime Gate 통과 시에만 true 가능

deprecated
→ 신규 Quick Start에서 제외

retired
→ 신규 Projection 금지
```

예:

```yaml
runtime_id: codex
display_name: OpenAI Codex
adapter_id: runtime-adapter.codex
adapter_version: "1.0"
runtime_version_range: ">=0.142.0"
metadata_version: "1.0"
lifecycle_status: active
advertised_support: true
advertised_support_status: eligible
advertised_support_evidence:
  - CAP-GATE-METADATA
  - CAP-GATE-PROJECTION
  - CAP-GATE-E2E
  - CAP-GATE-QUICKSTART
capability_metadata_status: valid
last_verified_at: 2026-07-14T00:00:00+09:00
last_verified_by: manual_fixture
```

---

## 9. Advertised Runtime

`advertised_support: true`는 다음을 의미한다.
이 Gate는 Runtime을 공개 지원 대상으로 선언할 때의 품질 기준이며, Lean V1 P0가 복수 Runtime Projection을 요구한다는 뜻이 아니다.

```text
capability_metadata_status = valid
drift_status = current
Capability Metadata 존재
Generic Handoff → Runtime Projection 가능
Projection Fixture 통과
Manual E2E 통과
Known Limitation 문서화
Truthful Quick Start 존재
필수 Capability에 unknown 또는 unsupported 없음
```

상태:

```text
advertised_support_status:
- eligible
- ineligible
- review_required
```

`advertised_support_evidence`는 최소 다음 Gate 결과를 참조한다.

```text
Metadata Validation
Projection Fixture
Manual E2E
Known Limitation
Quick Start Verification
```

Known Limitation이 없더라도 빈 목록을 명시한다.

위 조건을 충족하지 않으면 지원 Runtime으로 공개하지 않는다.

---

## 10. Metadata Source

Capability Metadata Source:

```text
Official Runtime Documentation
Adapter Implementation
Manual Fixture Result
Observed Runtime Behavior
Known Limitation
```

각 Capability는 가능한 경우 Source와 Evidence를 가진다.

```text
source_type
source_ref
evidence_refs
verified_at
```

---

# Part III. Capability Categories

## 11. Minimum Registry Coverage

다음은 모든 지원 Runtime이 전부 Supported여야 한다는 뜻이 아니다.

Capability Registry가 표현할 수 있어야 하는 최소 범주다.

```text
Input
Context
File Read
File Write
Shell
Git
Repository Inspection
Network
Connector
Handoff Projection
Pending Handoff Rehydration
Result Production
Human Approval Integration
```

`Minimum Advertised Runtime Capability`는 해당 Runtime의 V1 E2E에 실제 필요한 Capability 집합으로 별도 계산한다.

`Human Approval Integration`은 다음 의미로만 제한한다.

```text
승인된 Handoff 입력을 받을 수 있음
Review 가능한 Result를 반환할 수 있음
```

Human 승인 여부 자체를 Runtime Capability가 결정한다는 의미가 아니다.

---

## 12. Input Capability

예:

```text
capability.input.text
capability.input.file_reference
capability.input.image
capability.input.large_context
```

V1 필수:

```text
Text Task Input
Local File Reference Input
```

Image Input은 Runtime별 선택 Capability다.

---

## 13. Context Capability

예:

```text
capability.context.repository
capability.context.project_document
capability.context.session
capability.context.external
```

주의:

```text
Context 접근 가능
≠ 자동 읽기 허용
```

Execution Policy와 Handoff Scope가 별도로 허용해야 한다.

---

## 14. File Capability

예:

```text
capability.files.read
capability.files.create
capability.files.modify
capability.files.delete
capability.files.rename
```

각 Capability는 다음 기술 조건을 표현할 수 있어야 한다.

```text
workspace_only
path_restricted
unsupported_file_type
size_limit
write_mode_restricted
```

Human Approval Requirement는 Execution Policy Metadata에서 별도로 표현한다.

---

## 15. Shell Capability

예:

```text
capability.shell.execute
capability.shell.interactive
capability.shell.background
```

V1에서 Background Work는 제품 비범위다.

Runtime이 Background Process를 기술적으로 지원해도 V1 Handoff Projection은 이를 필수로 요구하지 않는다.

---

## 16. Git Capability

예:

```text
capability.git.inspect
capability.git.diff
capability.git.patch
capability.git.stage
capability.git.commit
capability.git.push
```

Capability가 Supported여도 Execution Policy가 금지할 수 있다.

예:

```text
capability.git.commit = supported
execution_policy.git.commit = prohibited
```

---

## 17. Network and Connector Capability

예:

```text
capability.network.web_read
capability.network.api_call
capability.connector.github_read
capability.connector.github_write
```

Network·Connector Capability는 다음을 별도로 표현한다.

```text
authentication_required
provider_scope
read_only
write_capable
rate_limited
```

---

## 18. Handoff Projection Capability

예:

```text
capability.handoff.generic
capability.handoff.runtime_projection
capability.handoff.semantic_preservation
```

지원 Runtime 최소 조건:

```text
Generic Handoff 수용
Runtime Projection 생성
Protected Field 의미 보존
Unsupported Requirement 표시
```

DEC-062 Automatic Rehydration은 Projection과 별도 Capability 집합을 사용한다.

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

각 Capability는 Runtime별로 독립 선언한다. Claude와 Codex가 같은 Hook Surface를 제공한다고
가정하지 않는다.

자동 연결에 필요한 Capability는 `supported`이거나, `conditional`의 모든 기술 조건을 현재
Attempt에서 확인한 경우여야 한다. `unknown`, `unsupported`, 조건 미충족은 자동 연결 불가다.

특히:

```text
Hook 호출 가능
≠ Candidate Injection 지원

Candidate Injection 시도
≠ Delivery Confirmation 지원

Manual Resume Surface 지원
≠ Automatic Rehydration 지원
```

`capability.handoff.delivery_confirmation`은 대상 Session에서 Candidate ID와 Digest가 일치하는
내용을 실제로 사용할 수 있다는 Adapter Evidence를 제공할 수 있을 때만 `supported`다.
단순 Hook exit code, stdout 출력 또는 Queue 수락은 Evidence가 아니다.

---

## 19. Result Capability

예:

```text
capability.result.freeform
capability.result.structured
capability.result.evidence
capability.result.validation_mapping
```

직접 Result Basic을 생성하는 Runtime:

```text
capability.result.structured = supported
```

자유형 결과만 반환하는 Runtime:

```text
capability.result.freeform = supported
capability.result.structured = unsupported 또는 unknown
```

수동 변환 경로가 승인돼 있으면 Handoff Compatibility를 `compatible_with_manual_steps`로 판정할 수 있다.

단, 사람의 후처리 가능성을 Runtime 자체의 Structured Result Capability로 과장하지 않는다.

자동 Result 수집은 V2 비범위다.

---

# Part IV. Capability Record

## 20. Capability Record 필수 필드

```text
capability_id
declared_status
drift_status
effective_status
conditions
limitations
unknown_reason
required_manual_step
source
evidence_refs
last_verified_at
notes
```

상태에 따라 빈 필드를 허용하지만 생략 여부 규칙을 정의한다.

예:

```yaml
capability_id: capability.files.modify
declared_status: conditional
drift_status: current
effective_status: conditional
conditions:
  - "Workspace write approval granted"
limitations:
  - "Only files under repository root"
unknown_reason: null
required_manual_step:
  - "Review target paths before execution"
source:
  type: adapter_contract
  reference: runtime-adapter.codex
evidence_refs:
  - CAP-E-03
last_verified_at: 2026-07-14T00:00:00+09:00
notes: []
```

---

## 21. 상태별 필드 규칙

### Supported

필수:

```text
source
evidence_refs
last_verified_at
drift_status = current
적용 Runtime Version이 runtime_version_range 안에 있음
```

### Unsupported

필수:

```text
source
evidence_refs 또는 explicit_verification_record
last_verified_at
limitations 또는 notes
safe_fallback
```

지원 여부를 검증하지 못한 경우에는 `unsupported`가 아니라 `unknown`으로 기록한다.

### Conditional

필수:

```text
conditions
failure_mode
required_manual_step
evidence_refs
```

### Unknown

필수:

```text
unknown_reason
verification_needed
safe_fallback
```

---

# Part V. Handoff Compatibility

## 22. Requirement Mapping

Handoff Requirement를 Capability ID에 매핑한다.

예:

```yaml
requirement_mapping:
  - requirement_id: REQ-01
    source_field: allowed_actions
    description: "Modify README.md"
    requirement_level: required
    capability_ids:
      - capability.files.modify
    match_mode: all
    manual_step_allowed: false

  - requirement_id: REQ-02
    source_field: validation_required
    description: "Run git diff --check"
    requirement_level: required
    capability_ids:
      - capability.shell.execute
    match_mode: all
    manual_step_allowed: false

  - requirement_id: REQ-03
    source_field: return_contract
    description: "Return structured Result Basic"
    requirement_level: required
    capability_ids:
      - capability.result.structured
    match_mode: all
    manual_step_allowed: true
```

허용값:

```text
requirement_level:
- required
- optional

match_mode:
- all
- any
```

---

## 23. Compatibility 상태

```text
compatible
compatible_with_manual_steps
incompatible
unknown
```

의미:

| 상태 | 의미 |
|---|---|
| compatible | 모든 필수 Requirement가 Supported |
| compatible_with_manual_steps | Conditional이 있으나 Human Step으로 충족 가능 |
| incompatible | 필수 Requirement가 Unsupported |
| unknown | 필수 Requirement 중 Unknown 존재 |

---

## 24. Compatibility 판정 규칙

```text
Required Capability = supported
→ compatible candidate

Required Capability = conditional
→ 조건과 Manual Step을 표시

Required Capability = unsupported
→ incompatible

Required Capability = unknown
→ Compatibility는 unknown 유지
→ Manual Step으로 검증 절차를 제공할 수 있음
→ 검증 Evidence가 생긴 이후에만 상태 재계산
```

Optional Requirement가 Unsupported라고 전체 Handoff를 Incompatible로 처리하지 않는다.

---

## 25. Capability 불일치 처리

허용 처리:

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

의미 또는 의무가 바뀌면:

```text
새 Handoff Artifact Version 생성
Human Review 재수행
```

---

# Part VI. Execution Policy Boundary

## 26. Capability와 Policy 결합 규칙

예:

```text
Capability = supported
Policy = prohibited
→ 실행 금지

Capability = unsupported
Policy = allowed
→ 실행 불가

Capability = unknown
Policy = allowed
→ Compatibility는 unknown 유지
→ 실행 전 Capability 검증 필요

Capability = conditional
Policy = approval_required
→ 기술 조건 확인 + Human Approval + Availability 확인 필요
```

Execution Policy가 Capability 부족을 덮어쓸 수 없다.

Runtime Adapter가 Policy를 임의 완화할 수 없다.

---

## 27. Entitlement 분리

다음은 V1 Capability Metadata에 포함하지 않는다.

```text
Free / Plus / Pro
Billing Plan
Organization License
Seat Assignment
Commercial Feature Gate
```

Runtime 사용에 외부 계정이나 인증이 필요할 수는 있다.

이는 다음으로 표현한다.

```text
authentication_required
availability_condition
```

Entitlement 모델로 확장하지 않는다.

---

# Part VII. Availability

## 28. Availability 상태

Local 실행 시 다음을 별도 확인할 수 있다.

```text
available
unavailable
degraded
unknown
```

예:

```yaml
availability:
  status: unavailable
  reason: "Runtime binary not installed"
  check_method: "local binary lookup"
  checked_at: 2026-07-14T20:00:00+09:00
  checked_by: local_environment_check
  evidence_ref: AV-E-01
  valid_until: 2026-07-14T21:00:00+09:00
```

Capability는 Supported여도 현재 Availability는 Unavailable일 수 있다.

---

## 29. Availability와 Capability 구분

```text
Runtime이 Shell 실행을 지원
= Capability supported

현재 Runtime Binary가 설치되지 않음
= Availability unavailable
```

Availability 오류를 Capability unsupported로 영구 기록하지 않는다.

---

# Part VIII. Drift and Versioning

## 30. Capability Drift

다음 경우 Drift 가능성이 있다.

```text
Runtime Version 변경
Adapter Version 변경
Runtime Permission Model 변경
Tool 이름 또는 동작 변경
Authentication 방식 변경
Projection Template 변경
Known Limitation 변경
```

Capability는 다음을 분리한다.

```text
declared_status
= 마지막 검증에서 확인된 역사적 상태

drift_status
= current / stale / conflicting / not_verified

effective_status
= 현재 Compatibility 계산에 사용하는 상태
```

---

## 31. Drift 처리

```text
drift_status = current
→ declared_status를 effective_status로 사용

drift_status = stale | conflicting | not_verified
→ effective_status = unknown
→ Advertised Support Gate 불통과
→ 필수 Capability 충족으로 계산하지 않음
→ 재검증 후에만 current로 복귀
```

과거 Evidence와 `declared_status`는 이력으로 보존한다.

Runtime Version이 바뀌었다는 이유만으로 모든 Capability를 Unsupported 처리하지 않는다.

---

## 32. Metadata Version

```text
metadata_version
adapter_version
runtime_version_range
```

변경 규칙:

```text
Schema 구조 변경
→ metadata_version 증가

Adapter 동작 변경
→ adapter_version 증가

지원 Runtime 범위 변경
→ runtime_version_range 갱신
```

---

# Part IX. Projection

## 33. Projection 입력

```text
Approved Handoff
Runtime Capability Metadata
Execution Policy
Availability 상태
```

---

## 34. Projection 입력과 출력

Canonical 입력 및 참조:

```text
generic-handoff.md
= 승인된 Runtime-neutral Handoff
= Capability 계층이 수정하거나 재작성하지 않음
```

Capability 계층 필수 출력:

```text
compatibility-report.md
```

조건부 출력:

```text
V1 Alpha에서 지원 대상으로 선언한 Runtime Projection
```

예:

```text
claude-handoff.md
codex-handoff.md
```

---

## 35. Compatibility Report

필수 필드:

```text
runtime_id
handoff_ref
artifact_version
capability_compatibility_status
policy_status
availability_status
projection_status
execution_readiness_status
required_capabilities
missing_capabilities
conditional_capabilities
unknown_capabilities
manual_steps
blocked_requirements
warnings
created_at
```

의미:

```text
capability_compatibility_status
= Runtime이 필수 Requirement를 기술적으로 충족하는가

policy_status
= 현재 Handoff에서 해당 행동이 허용되는가

availability_status
= 현재 Local 환경에서 사용할 수 있는가

projection_status
= 의미 보존 Projection 생성이 가능한가

execution_readiness_status
= Human이 현재 수동 실행 가능한 상태인가
```

---

## 36. Semantic Preservation

Projection 전후 다음 의미를 보존한다.

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

Capability 부족을 이유로 위 의미를 조용히 삭제하지 않는다.

---

# Part X. Human Review

## 37. Review 대상

사용자는 최소 다음을 검토한다.

```text
Runtime Identity
Advertised Support 여부
Required Capability Mapping
Unsupported Capability
Conditional 조건
Unknown 사유
Manual Step
Compatibility 상태
Projection Warning
Execution Policy 충돌
```

---

## 38. Review 결과

```text
approve_projection
request_manual_step
change_runtime
revise_handoff
reject_projection
```

의미:

```text
approve_projection
= Projection의 Semantic Preservation과 Capability·Policy·Availability 보고를 수용

이는 Runtime 자동 실행, Shell 실행, 파일 수정 또는 Repository 반영을 의미하지 않는다.

실행은 별도의 사용자 수동 행동 또는 Execution Policy Gate를 따른다.

request_manual_step
= 사전 조건을 사람이 수행

change_runtime
= 다른 지원 Runtime 선택

revise_handoff
= Requirement를 변경한 새 Handoff Version 생성

reject_projection
= 실행하지 않음
```

---

## 39. 자동 Runtime 선택 금지

V1에서 Capability 비교 결과가 있어도 Runtime을 자동 선택하지 않는다.

가능한 출력:

```text
compatible runtimes
incompatible runtimes
manual steps
```

최종 선택은 사용자 또는 Main Session이 한다.

---

# Part XI. Error and Degraded State

## 40. Capability Metadata 상태

```text
valid
missing
invalid
conflicting
```

### Missing Metadata

```text
capability_metadata_status: missing
```

처리:

```text
지원 Runtime으로 광고하지 않음
Compatibility를 unknown으로 처리
Generic Handoff는 유지
Manual Review 요구
```

---

## 41. Invalid Metadata

예:

```text
지원 상태가 없거나 허용값이 아님
Conditional인데 conditions 없음
Unknown인데 unknown_reason 없음
Evidence Reference 손상
Runtime Version 범위 형식 오류
```

상태:

```text
capability_metadata_status: invalid
```

Invalid Metadata로 Supported 판정을 내리지 않는다.

---

## 42. Conflicting Metadata

예:

```text
동일 Capability가 supported와 unsupported로 중복
Adapter 구현과 Metadata 불일치
Runtime 문서와 Fixture 결과 충돌
```

상태:

```text
capability_metadata_status: conflicting
```

처리:

```text
특정 Capability 충돌
→ 해당 Capability effective_status = unknown

Runtime Identity 또는 Schema 전체 충돌
→ Metadata 전체 invalid 또는 conflicting

Advertised Support 재검토
Human Review 요청
```

---

# Part XII. Validation and Fixture

## 43. Contract Validation

최소 Validation:

```text
Runtime Identity 존재
Capability Metadata Status 유효
Capability ID 유일성
Deprecated / replaced_by 무결성
허용 상태값
상태별 필수 필드
Supported / Unsupported Evidence 존재
Evidence Reference 무결성
Runtime Version 범위 형식
Advertised Runtime Gate
Requirement Level 존재
Requirement Mapping 무결성
match_mode 계산 일관성
Unknown Compatibility 유지
Capability / Policy / Availability 상태 분리
Structured Result 직접 지원과 Manual Conversion 분리
Semantic Preservation
```

Runtime Entry Capability:

```text
explicit_entry
suggestion
confirmation
command_discovery
session_suppression
artifact_path_display
```

의미:

```text
explicit_entry
= 사용자가 Runtime에서 Work-start Product Action을 명시 호출할 수 있음

suggestion
= Runtime Adapter가 자연어 Intent에 대해 Work-start를 제안할 수 있음
  단, Engine 호출이나 Artifact 생성을 의미하지 않음

confirmation
= Runtime Adapter가 제안에 대한 사용자 승인 또는 거절을 구분할 수 있음

command_discovery
= 사용자가 Runtime 안에서 Work-start Entry를 발견할 수 있음

session_suppression
= 사용자가 거절한 동일 요청에 대해 재제안을 억제할 수 있음

artifact_path_display
= 실행 후 실제 생성된 Work-start Artifact 경로를 표시할 수 있음
```

Runtime Display Name과 구체 문법은 Adapter가 결정한다.

```text
Claude Code:
  display example: /work-start

Codex:
  display example: $work-start 또는 /skills → work-start
```

Product Contract는 slash 문법을 canonical requirement로 고정하지 않는다.

---

## 44. Positive Fixture

### Supported Runtime

```text
필수 Capability 모두 supported
→ compatible
```

### Conditional Runtime

```text
필수 Capability 일부 conditional
Manual Step 존재
→ compatible_with_manual_steps
```

### Single-runtime E2E

```text
지원 Runtime 1개
→ Handoff Projection
→ Manual Execution
→ Result Basic
```

### Runtime Entry Capability

```text
최소 1개 Runtime
→ explicit_entry supported
→ suggestion supported 또는 documented fallback
→ confirmation supported 또는 explicit follow-up fallback
→ command_discovery supported
→ artifact_path_display supported
```

---

## 45. Negative Fixture

```text
Conditional인데 conditions 없음
Unknown인데 unknown_reason 없음
Unsupported인데 Supported로 광고
Capability supported / Policy prohibited인데 실행 허용
Capability unknown / Policy allowed인데 Warning 없음
필수 Capability unsupported인데 compatible 판정
Runtime Version Drift 후 재검증 없음
Metadata 없는 Runtime을 Advertised Support로 공개
Projection이 Validation Requirement 삭제
Projection이 Do Not Touch 약화
동일 capability_id 중복
Evidence 없는 supported 판정
Availability unavailable을 Capability unsupported로 영구 저장
Human Approval을 Conditional Capability 조건으로 기록
Intent Detection을 User Consent로 기록
Suggestion만으로 Engine Invocation supported 처리
Suggestion만으로 Artifact 생성
현재 Runtime 미설치를 Unsupported로 기록
Authentication 부재를 Capability Unsupported로 기록
Evidence 없는 Unsupported 판정
Required / Optional 표시 없는 Requirement Mapping
필수 Unknown Capability를 compatible_with_manual_steps로 승격
Optional Unsupported를 전체 incompatible로 판정
Capability compatible / Policy prohibited인데 execution_ready
Capability compatible / Availability unavailable인데 execution_ready
자유형 Result Runtime을 structured=supported로 판정
drift_status=stale인데 advertised_support=true 유지
Capability ID 의미 중복 또는 Registry Conflict
```

---

## 46. Truthfulness Fixture

검증:

```text
지원하지 않는 기능 과장 금지
미확인 기능 추정 금지
Conditional 조건 누락 금지
Known Limitation 누락 금지
Public Documentation과 Metadata 정합성
Quick Start와 실제 Runtime 지원 정합성
```

---

## 47. Drift Fixture

```text
Runtime Version 변경
Adapter Version 변경
Projection Template 변경
Capability Fixture 실패
Known Limitation 변경
```

기대 결과:

```text
stale 또는 conflicting
Advertised Support 재검토
재검증 전 Supported 유지 금지
```

---

## 48. 완료 조건

Contract 완료:

```text
Capability 상태 모델 정의
Runtime Metadata 정의
상태별 필수 필드 정의
Handoff Requirement Mapping 정의
Compatibility 계산 정의
Execution Policy 경계 정의
Availability 분리
Drift 처리 정의
Human Review 정의
Positive / Negative / Truthfulness Fixture 정의
```

Implementation 완료:

```text
최소 1개 Runtime Metadata 작성
지원 Runtime별 Projection 구현
최소 1개 Runtime Entry 구현
Runtime-specific Manual E2E 통과
Compatibility Report 생성
Capability / Policy 충돌 검사
Advertised Runtime Gate
Projection Fixture 통과
Single-runtime Manual E2E 통과
```

---

# Part XIII. Example

## 49. Runtime Metadata Example

```yaml
metadata_version: "1.0"
runtime_id: codex
display_name: OpenAI Codex
adapter_id: runtime-adapter.codex
adapter_version: "1.0"
runtime_version_range: ">=0.142.0"
lifecycle_status: active
advertised_support: true
last_verified_at: 2026-07-14T20:00:00+09:00
last_verified_by: manual_fixture

capabilities:
  - capability_id: capability.files.read
    declared_status: supported
    drift_status: current
    effective_status: supported
    conditions: []
    limitations:
      - "Local workspace only"
    unknown_reason: null
    required_manual_step: []
    source:
      type: adapter_contract
      reference: runtime-adapter.codex
    evidence_refs:
      - CAP-E-01
    last_verified_at: 2026-07-14T20:00:00+09:00
    notes: []

  - capability_id: capability.files.modify
    declared_status: supported
    drift_status: current
    effective_status: supported
    conditions: []
    limitations:
      - "Only paths writable by the Runtime environment"
    unknown_reason: null
    required_manual_step: []
    source:
      type: fixture
      reference: CAP-FX-02
    evidence_refs:
      - CAP-E-02
    last_verified_at: 2026-07-14T20:00:00+09:00
    notes: []

execution_policy:
  capability.files.modify: approval_required

  - capability_id: capability.github.write
    declared_status: unknown
    drift_status: not_verified
    effective_status: unknown
    conditions: []
    limitations: []
    unknown_reason: not_tested
    verification_needed:
      - "Run GitHub write fixture"
    safe_fallback: block_projection
    required_manual_step: []
    source:
      type: none
      reference: null
    evidence_refs: []
    last_verified_at: null
    notes:
      - "Not part of V1 Quick Start"
```

---

## 50. Compatibility Report Example

```yaml
runtime_id: codex
handoff_ref: handoff-20260714-183000-readme-v1-alignment
artifact_version: 2
capability_compatibility_status: compatible_with_manual_steps
policy_status: approval_required
availability_status: available
projection_status: ready
execution_readiness_status: approval_required

required_capabilities:
  - capability.files.read
  - capability.files.modify
  - capability.shell.execute
  - capability.result.structured

missing_capabilities: []

conditional_capabilities:
  - capability_id: capability.files.modify
    conditions:
      - "Workspace write approval granted"

unknown_capabilities: []

manual_steps:
  - "Approve workspace patch before modification"

blocked_requirements: []

warnings:
  - "GitHub write capability is unknown but not required by this Handoff."

created_at: 2026-07-14T20:15:00+09:00
```

---

# Part XIV. Non-goals

## 51. V1 비목표

```text
Automatic Runtime Selection
Runtime Broker
Provider Session Binding
Remote Execution
Managed Capability Service
Cloud Entitlement
Billing Feature Gate
Organization Policy Engine
Runtime Benchmark Ranking
Automatic Adapter Download
Product Notice Capability 판정
```

---

## 52. 채택하지 않는 방향

### Capability와 Execution Policy 통합

기술적 가능성과 작업 허용을 분리한다.

### Unknown을 Supported로 추정

미검증 상태를 정직하게 유지한다.

### 모든 Runtime 지원을 V1 필수화

최소 1개 Runtime 완결성을 우선한다.

### Runtime Documentation만으로 Supported 판정

Adapter·Fixture·실행 근거가 필요하다.

### Capability 부족 시 Handoff 의미 삭제

Manual Step 또는 새 Handoff Review를 요구한다.

---

# Part XV. Open Decisions

## 53. 미결정 사항

1. Capability Metadata 파일 형식
2. Capability ID Registry 경로
3. Runtime Version Range 문법
4. Evidence Reference 형식
5. Advertised Support 승인 주체
6. Availability 검사 명령
7. Drift 재검증 주기
8. Conditional Capability의 기본 Fallback
9. Compatibility Report 출력 경로
10. Runtime Metadata 자동 생성 여부
11. Public Documentation 생성 방식
12. Adapter Versioning 규칙
13. Known Limitation 파일 분리 여부
14. Runtime 제거·Deprecated 절차

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 54. 불변조건

1. Capability는 기술적 가능성을 표현한다.
2. Execution Policy는 작업 허용을 표현한다.
3. Entitlement는 V1 비범위다.
4. Unknown을 Supported로 추정하지 않는다.
5. Conditional은 조건을 가진다.
6. Unsupported를 지원한다고 광고하지 않는다.
7. 최소 1개 Runtime으로 V1을 완결한다.
8. 공개 지원 Runtime마다 Metadata와 Fixture를 가진다.
9. 모든 Runtime 동시 지원은 V1 필수가 아니다.
10. Capability 부족으로 Handoff 의미를 조용히 약화하지 않는다.
11. Availability와 Capability를 구분한다.
12. Drift 발생 시 재검증한다.
13. 자동 Runtime 선택을 하지 않는다.
14. Capability Metadata가 없으면 Advertised Support로 공개하지 않는다.
15. Projection은 Semantic Preservation을 지킨다.
16. Human Approval은 Capability 조건이 아니다.
17. Authentication·설치·Network 상태는 Availability가 소유한다.
18. 기술 Compatibility와 Policy·Availability·Execution Readiness를 분리한다.
19. Structured Result 직접 지원과 Human 수동 변환을 구분한다.

---

## 55. 관련 문서

```text
docs/product/v1-completion-criteria.md
docs/contracts/handoff-basic-contract.md
docs/contracts/pending-handoff-rehydration-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/execution-policy-contract.md
docs/testing/v1-fixture-plan.md
docs/contracts/product-notice-contract.md
docs/architecture/local-cloud-human-boundary.md
```

---

## 56. 검수 관점

### 제품

- 단일 Runtime으로 V1을 완결할 수 있는가
- 모든 Runtime을 동시에 필수화하지 않는가
- 지원 기능을 과장하지 않는가

### Contract

- Supported·Unsupported·Conditional·Unknown이 충분한가
- 상태별 필수 필드가 명확한가
- Handoff Requirement Mapping이 가능한가
- Compatibility 계산이 일관적인가

### Truthfulness

- Evidence 없는 Supported 판정을 막는가
- Conditional 조건을 숨기지 않는가
- Unknown 사유를 기록하는가
- Public Documentation과 Metadata Drift를 잡을 수 있는가

### Boundary

- Capability·Execution Policy·Entitlement·Availability가 분리되는가
- Capability 부족이 Handoff 의미를 약화하지 않는가
- 자동 Runtime 선택이나 Broker가 유입되지 않았는가
