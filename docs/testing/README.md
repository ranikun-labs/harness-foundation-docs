---
title: Testing Index
status: draft
implementation_status: not_verifiable
owner: quality
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
source_inputs:
  - docs/testing/v1-fixture-plan.md
  - docs/product/v1-completion-criteria.md
  - docs/contracts/README.md
  - docs/decisions/decision-log.md
---

# Testing

## 1. 문서 목적

이 디렉터리는 `oh-my-ai`의 Contract·Workflow·Runtime 지원 범위를 검증하는 canonical Testing 문서를 관리한다.

현재 canonical 문서:

```text
docs/testing/
├── README.md
└── v1-fixture-plan.md
```

이 README는 Testing 계층의 색인과 공통 원칙을 제공한다.

Fixture Definition의 canonical owner는 `docs/testing/v1-fixture-plan.md`다.

---

## 2. Testing 책임

Testing 계층이 소유하는 것:

```text
Fixture Taxonomy
Fixture Record Contract
Assertion 규칙
Positive·Negative·Fail-open Coverage
P0 Release Fixture Suite와 Release Evidence
Manual E2E Evidence
Runtime별 Advertised Support 검증
Migration·Installation 검증
Truthfulness·Privacy 검증
```

소유하지 않는 것:

```text
Product Scope 결정
Product Release Requirement 완화·재정의
Contract 의미 재정의
Runtime Capability 선언
Execution Policy 결정
Human Approval 생성
Repository Apply
```

Product Release Requirement와 Release Blocking 기준의 canonical owner는
`docs/product/v1-completion-criteria.md`다.

Testing 계층은 해당 Requirement를 검증하는
Fixture Suite, Assertion과 Evidence를 소유한다.

---

## 3. Canonical Owner

| 정보 | Canonical Owner |
|---|---|
| Contract Requirement | `docs/contracts/` |
| Product Release Requirement | `docs/product/v1-completion-criteria.md` |
| Fixture Definition | `docs/testing/v1-fixture-plan.md` |
| Product·Architecture Decision | `docs/decisions/decision-log.md` |
| Runtime Support Declaration | Runtime Capability Contract |
| Runtime Support Verification | Runtime별 Fixture·Manual E2E Evidence |

Testing 문서는 Contract를 다시 정의하지 않는다.

---

## 4. Fixture 원칙

```text
Positive Fixture만으로 완료 금지
Negative Fixture 필수
필요한 Domain은 Fail-open 포함
Unknown·Blocked·Not Run을 Passed로 처리 금지
Fixture Result와 Subject Status 분리
P0 Assertion은 결정적
Fixture Workspace 격리
Cleanup 검증
Evidence Reference 무결성
```

---

## 5. P0 Release Gate

V1 P0 Gate:

```text
Work-start
Routing
Handoff Validation
Projection Semantic Preservation
Runtime Capability Truthfulness
Execution Policy Approval Boundary
Result Basic Truthfulness
Secret Exclusion
Fresh Install
Minimum Single-runtime Manual E2E
Advertised Runtime별 Projection·E2E
Good·Bad Contract Example
```

조건부 P0:

```text
Usage Log Privacy
= Usage Log가 활성화되거나 제공되는 경우

Generated Artifact Drift
= Generated Artifact가 V1 실행 경로에 포함되는 경우

Migration Compatibility
= 기존 설치·설정·Artifact 경로가 변경되는 경우
```

조건이 적용되지 않는 경우에도
`not_applicable` 판정 근거와 Evidence를 남긴다.

---

## 6. Fixture 상태

Lifecycle:

```text
draft
active
deprecated
retired
```

Execution Result:

```text
passed
failed
blocked
error
invalid_fixture
not_applicable
not_run
```

Release Gate에는 `active` Fixture만 포함한다.

`passed`만 Fixture Pass다.

다음 상태를 Passed로 처리하지 않는다.

```text
failed
blocked
error
invalid_fixture
not_applicable
not_run
```

Applicable한 Active P0 Fixture는 `result = passed`일 때만 Release Gate를 통과한다.

```text
failed
blocked
error
invalid_fixture
not_run
```

은 모두 Release Blocking이다.

`not_applicable`은 Applicability Assertion이 통과하고,
적용 조건이 충족되지 않았다는 Evidence가 있을 때만 Gate 계산에서 제외한다.

---

## 7. Fixture와 피검사 대상 상태

```text
expected_fixture_result
≠ expected_subject_status
```

예:

```yaml
expected_fixture_result: passed
expected_subject_status: invalid
```

Negative Fixture에서 대상이 `invalid`를 반환하면 Fixture는 통과다.

---

## 8. Assertion 결정성

P0 Assertion은 다음을 요구한다.

```text
고정된 actual_path 문법
Operator별 입력 타입
Normalization 규칙
Expected Value
Evidence Reference
동일 입력·환경에서 동일 결과
```

`semantic_equal`은 자유형 LLM 판단이 아니다.

필수 정의:

```text
comparator_version
protected_field_schema_version
구조 추출 규칙
배열 정렬·중복 처리
Path·Whitespace Normalization
Timestamp·Local Reference 등 비의미 필드 제외
값·범위·금지 강도·필수/선택 의무 비교
```

처리:

```text
Protected Field 구조 추출
→ Canonical Normalization
→ 값·범위·강도·의무 비교
```

LLM 또는 Human의 자유형 의미 판단만으로 P0 Pass를 확정하지 않는다.

---

## 9. Manual E2E

필수 흐름:

```text
Task 입력
→ Work-start
→ Structured Handoff Candidate
→ Human Review
→ 수동 Runtime 전달
→ Worker 수행
→ Result Basic 수동 반환
→ Human Review
```

범용 Handoff Validator, 범용 Result Validator, Runtime Projection은 V1 Alpha 또는 이후 품질 기능이다.
Fixture를 통한 최소 Contract 검증은 V1 P0에 남는다.
Runtime 자동 Invocation과 Result 자동 수집·Import는 V2 범위다.

필수 비동치:

```text
Handoff Approval
≠ Action Approval

Policy Review
≠ Action Approval

Result Accept
≠ Repository Apply

Result Basic
≠ 자동 Import
≠ 자동 Repository 반영
```

Human Checkpoint Evidence:

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

Managed Approval Entity를 의미하지 않는다.

---

## 10. Advertised Runtime 검증

지원한다고 공개한 Runtime마다:

```text
Valid Capability Metadata
Current Drift Status
Projection Fixture
Manual E2E
Known Limitation
Truthful Quick Start
```

를 검증한다.

모든 Runtime을 동시에 지원할 필요는 없다.

Runtime별 Evidence에는 최소 다음을 포함한다.

```text
runtime_id
runtime_version
adapter_version
capability_metadata_version
projection_fixture_result
manual_e2e_result
source_revision
```

---

## 11. Fixture Layout

권장 구조:

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
└── e2e/
```

각 Fixture:

```text
fixture.yaml
input/
expected/
README.md
```

Generated Result:

```text
fixture-results/
└── <fixture-id>/
    ├── result.yaml
    ├── evidence/
    └── diff/
```

이 Layout과 `fixture.yaml` 파일명은 권장 예시다.

Machine-readable Serialization과 Schema Format은
Open Decision이 확정되기 전까지 canonical 형식으로 간주하지 않는다.

---

## 12. 격리와 안전

P0 Fixture는 다음을 준수한다.

```text
실제 사용자 Repository 직접 수정 금지
Temporary Workspace 또는 Fixture Repository 사용
실제 Credential 사용 금지
Production Endpoint 접근 금지
Cleanup 결과 검증
Secret은 Synthetic Sentinel만 사용
```

Cleanup Assertion이 기대 상태와 다르면 `failed`다.

Runner·OS·Permission 오류로 Cleanup을 수행하거나 검증할 수 없으면 `error`다.

두 상태 모두 Active P0 Release를 차단한다.

Cleanup 검증 범위:

```text
Temporary Workspace
Temporary File
Process
Lock
Environment Override
Generated Credential-like Test Value
```

Secret 금지 규칙은 다음 모든 출력에 적용한다.

```text
fixture input
runner log
assertion failure message
evidence
diff
snapshot
generated result
cleanup report
```

---

## 13. Release Evidence

각 P0 Fixture는 다음을 남긴다.

```text
fixture_id
result
runtime_id
runtime_version
adapter_version
source_revision
started_at
finished_at
assertion_results
evidence_refs
unresolved_risks
```

실행하지 않은 Fixture를 Passed로 기록하지 않는다.

---

## 14. Change Management

Contract 변경 시:

```text
영향 Fixture 식별
Expected Subject Status 재검토
Assertion 갱신
Good·Bad Example 갱신
Release Suite 영향 확인
Manual E2E 영향 확인
```

P0 Fixture 삭제·완화 또는 Release Suite 제외는
Testing 문서 수정만으로 완료할 수 없다.

다음이 필요하다.

```text
관련 Contract Requirement 확인
V1 Completion Criteria 영향 검토
Decision Review
Requirement·Fixture Reference 갱신
Release Suite와 Manual E2E 갱신
Human Review
```

대체 Fixture가 있으면 `deprecated`와 `replaced_by`를 기록한다.

---

## 15. Non-goals

```text
Cloud Test Service
Managed Evidence Store
Runtime Matrix Service
Organization QA Workflow
Remote Test Execution
```

V1은 Local Deterministic Validation 경로만 요구한다.

CI Integration은 선택적일 수 있으나
P0 Fixture를 반복 실행할 Local Runner는 필요하다.

실제 Runner·Fixture·E2E 구현 상태는
별도 Repository 검증 보고서가 확인한다.

---

## 16. Open Decisions

1. Fixture Runner 구현 언어
2. YAML / JSON Schema
3. Assertion Engine
4. Fixture Result 보관 위치
5. Evidence 크기 제한
6. OS Matrix
7. Runtime Version Matrix
8. Snapshot Update 승인 방식
9. Generated Result Commit 여부
10. CI Integration 시점

Open Decision은 구현자가 임의로 확정하지 않는다.

---

## 17. 불변조건

1. Testing은 Contract를 재정의하지 않는다.
2. Positive만으로 P0 완료 처리하지 않는다.
3. Fixture Pass와 Subject Status를 분리한다.
4. `passed`만 Fixture Pass다.
5. failed·blocked·error·invalid_fixture·not_run은 Release Blocking이다.
6. not_applicable은 Applicability Evidence가 있을 때만 허용한다.
7. P0 Assertion은 결정적이어야 한다.
8. Fixture Workspace는 사용자 Repository와 격리한다.
9. Cleanup 실패를 무시하지 않는다.
10. Secret 원문을 Fixture에 저장하지 않는다.
11. 최소 1개 Runtime Manual E2E가 필요하다.
12. Advertised Runtime마다 별도 Fixture Evidence가 필요하다.
13. P0 실패를 Known Limitation으로 우회하지 않는다.
14. Result Accept와 Repository Apply를 분리한다.
15. Testing은 Product Release Requirement를 재정의하지 않는다.

---

## 18. 관련 문서

```text
docs/testing/v1-fixture-plan.md
docs/product/v1-completion-criteria.md
docs/contracts/README.md
docs/decisions/decision-log.md
docs/poc/v2-local-invocation-poc.md
```
