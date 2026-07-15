---
title: POC Index
status: draft
implementation_status: not_verifiable
owner: development
last_reviewed: 2026-07-15
supersedes: []
superseded_by: []
source_inputs:
  - docs/poc/v2-local-invocation-poc.md
  - docs/roadmap/product-roadmap.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/contracts/README.md
  - docs/testing/v1-fixture-plan.md
  - docs/decisions/decision-log.md
---

# Proof of Concept

## 1. 문서 목적

이 디렉터리는 아직 Product Contract로 채택되지 않은 기술·제품 가설을 검증하는 canonical POC 문서를 관리한다.

현재 구조:

```text
docs/poc/
├── README.md
└── v2-local-invocation-poc.md
```

POC 문서는 다음이 아니다.

```text
Public Feature Promise
Accepted Product Scope
Runtime Support Guarantee
Release Contract
Implementation Completion Report
```

---

## 2. POC 상태

허용 상태:

```text
draft
approved_for_experiment
running
completed
cancelled
superseded
```

POC Lifecycle과 POC Outcome은 별도 상태 축이다.

POC Outcome:

```text
validated
validated_with_constraints
rejected
inconclusive
```

유효 조합:

```text
draft
approved_for_experiment
running
→ outcome 없음

completed
→ validated
→ validated_with_constraints
→ rejected
→ inconclusive
중 정확히 하나의 outcome 필수

cancelled
→ outcome 없음 또는 inconclusive

superseded
→ superseding_experiment_ref 필수
```

POC Outcome은 Product Decision 상태와 분리한다.

```text
validated
≠ accepted Product Feature

validated_with_constraints
≠ public support guarantee

inconclusive
→ Decision Status는 experiment 유지
```

Product 채택에는 별도 Decision Record가 필요하다.

---

## 3. Canonical POC

### V2 Local Invocation POC

**Path**

```text
docs/poc/v2-local-invocation-poc.md
```

**목적**

```text
Approved Handoff
→ Capability·Policy Gate
→ 필요한 Action Approval 확인
→ Runtime Projection
→ Human Invocation Approval
→ Local Runtime Process
→ Output Capture
→ Result Basic Candidate
→ Human Review
```

Invocation Approval은 `approval_required` Action을 자동 승인하지 않는다.

Action Approval은 Action과 Scope를 제한하며 Handoff Scope를 확장할 수 없다.

**검증 가설**

```text
Local Invocation Feasibility
Runtime Adapter Boundary
Semantic Preservation
Human Control
Local Data Boundary
Result Normalization
Product Value
```

---

## 4. POC 책임

POC 계층이 소유하는 것:

```text
검증 가설
실험 범위
Scenario
Metric
Decision Threshold
Abort Criteria
Known Limitation
Go / Conditional Go / No-go Evidence
```

소유하지 않는 것:

```text
V1 Product Scope
Accepted Runtime Support
Public Documentation 지원 문구
Billing·Entitlement
Cloud Workflow
Workspace·Organization Policy
```

---

## 5. V1과의 경계

```text
V1
= Manual Runtime Selection
= Manual Prompt Delivery
= Manual Result Return

V2 Local Invocation POC
= Local Process Invocation 가능성 검증
= Local Result Capture 가능성 검증
```

POC는 V1 Manual Workflow를 제거하지 않는다.

V1 Release는 POC 결과에 의존하지 않는다.

---

## 6. Product Decision과의 관계

POC 결과 처리:

```text
validated
→ Product 채택 여부 검토 가능

validated_with_constraints
→ 제한 범위의 Product Decision 후보

rejected
→ Product 채택 금지 또는 재설계

inconclusive
→ experiment 상태 유지
→ 추가 검증 조건 기록
```

다음은 자동으로 발생하지 않는다.

```text
Roadmap 승격
Public Runtime Support
Pricing 포함
Quick Start 노출
Cloud 기능 활성화
```

---

## 7. Runtime 범위

현재 비교 후보:

```text
Codex CLI
Claude Code CLI
```

원칙:

```text
최소 1개 Runtime E2E 성공
= Local Invocation 기본 가능성

CLI·Output 특성이 다른 2개 Runtime 비교
= Adapter Boundary 일반화 가능성
```

Runtime 1개만 검증되면:

```text
Local Invocation 기본 가능성은 검증 가능
Adapter Boundary는 provisional
전체 Outcome은 validated_with_constraints까지 가능
Go가 아니라 Conditional Go까지만 가능
```

Adapter Boundary를 완전히 검증하고 Go로 판정하려면
CLI·Output 특성이 다른 최소 2개 Runtime 비교가 필요하다.

---

## 8. Safety Gate

POC에서 반드시 지키는 안전 불변조건:

```text
Approved Handoff만 실행
Unknown Capability 실행 금지
Policy Block 전에 Process Start 금지
Explicit Invocation Approval
필요한 Action Approval의 유효성 확인
Invocation Approval과 Action Approval 분리
Handoff Scope 확장 금지
Secret 원문 일반 Artifact 저장 금지
Cloud Raw-data 전송 금지
Child·Descendant Process Cleanup
Repository Scope Deviation 탐지
Scope Deviation Result의 Import·Apply 차단
Automatic Retry 금지
Result 자동 승인 금지
Repository 자동 Apply 금지
```

---

## 9. Local·Cloud 경계

Local:

```text
Source Code
Repository Document
Prompt
Handoff
Policy
Runtime Output
Result
Evidence
Diff
Command Output
POC Metrics
```

Cloud 전송 금지:

```text
Raw Code
Raw Prompt
Raw Handoff
Raw Result
Raw Diff
Secret
Credential
Command Output
```

POC Telemetry도 Local Artifact에만 저장한다.

---

## 10. Process Safety

필수 검증:

```text
Runtime Discovery
Version Detection
Process Start
Startup Timeout
Execution Timeout
Graceful Shutdown Timeout
Cancellation
Forced Termination
Descendant Cleanup
Temporary File Cleanup
Concurrent Invocation Lock
Artifact Permission
```

지원 범위의 Runtime·OS·Action 조합에서 Cleanup이 검증되지 않으면 Go로 판정하지 않는다.

---

## 11. Result Truthfulness

```text
Process Exit 0
≠ Workflow Success

Output Captured
≠ Result Parsed

Result Parsed
≠ Result Valid

Result Valid
≠ Human Accepted

Human Accepted
≠ Repository Applied
```

Native Structured Result와 Freeform Normalization 경로를 분리한다.

POC Evidence는 최소 다음 상태 축을 분리한다.

```text
process_outcome
output_capture_status
parse_status
contract_validation_status
review_state
apply_readiness_status
```

한 단계의 성공을 다음 단계의 성공으로 자동 승격하지 않는다.

예:

```text
process_outcome = exited_zero
output_capture_status = captured
parse_status = failed

→ 전체 POC Scenario 성공 아님
```

---

## 12. Decision Threshold

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

Zero-tolerance:

```text
Credential 노출
승인 없는 Mutation
Scope 밖 변경 미탐지
Orphan Process
Raw-data Cloud Egress
```

결과 확인 후 Threshold를 변경하지 않는다.

---

## 13. Go / Conditional Go / No-go

### Go

```text
모든 필수 Safety·Contract Criteria 통과
Abort Event 0건
최소 1개 Runtime 필수 Scenario E2E 통과
Adapter Boundary는 최소 2개 Runtime으로 검증
Result Normalization Scenario 통과
사전 Product Value Threshold 충족
사전 Maintenance Budget 이내
```

### Conditional Go

```text
모든 Safety 불변조건 통과
Abort Event 0건
Zero-tolerance 위반 0건
최소 1개 Runtime E2E 통과
Runtime·Version·OS·Action 범위 제한
미검증 영역 명시
미검증 영역이 Credential·Cleanup·Scope·Policy 안전과 무관
```

다음 실패는 Conditional Go의 Known Limitation으로 허용하지 않는다.

```text
Credential 노출
Orphan Process
Scope 밖 변경 미탐지
Policy Block 이후 Process Start
Raw-data Cloud Egress
Result Truthfulness 실패
```

### No-go

```text
필수 Safety 또는 Contract Criteria 실패
Result Truthfulness 신뢰 불가
Process Cleanup 불가
Product Value Threshold 미달
Maintenance Budget 초과
```

---

## 14. Abort Criteria

즉시 중단:

```text
Credential 노출
Production Endpoint 접근
Repository 파괴
Unbounded Child Process
승인 없는 Mutation
Scope 밖 Mutation
Secret-like Data 일반 Artifact 저장
Raw-data Cloud Egress
Cleanup 불가 상태에서 추가 실행
```

Abort Event는 Known Limitation으로 우회하지 않는다.

---

## 15. POC Evidence

필수 산출물:

```text
experiment_ref
experiment_version
threshold_snapshot_ref
runtime_version_os_matrix
Hypothesis별 결과
scenario_execution_matrix
Scenario별 result
실행하지 않은 Scenario의 not_run 상태
Security Finding
zero_tolerance_results
abort_event_count
Contract Drift
Known Limitation
Metrics
Product Value 평가
Maintenance Cost 평가
Go / Conditional Go / No-go
```

실행하지 않은 Scenario를 Passed로 기록하지 않는다.

---

## 16. Testing과의 관계

POC Scenario와 Fixture는 `docs/testing/`의 공통 원칙을 따른다.

```text
Positive / Negative
expected_fixture_result와 expected_subject_status 분리
passed만 Fixture Pass
blocked / error / invalid_fixture / not_run은 Pass 아님
not_applicable은 Applicability Evidence 필수
Deterministic Assertion
Workspace Isolation
Cleanup Verification
Evidence Integrity
Synthetic Secret
```

POC Fixture는 V1 Release Gate에 자동 포함되지 않는다.

V1 Release Suite에 포함하려면:

```text
관련 V1 Contract Requirement 존재 확인
V1 Completion Criteria 영향 검토
Decision Review
Fixture Plan과 Release Suite 갱신
Human Review
```

가 필요하다.

---

## 17. Change Management

POC 변경 시:

```text
가설 변경 여부 확인
Scenario·Metric 영향 확인
Threshold 변경 여부 확인
Decision Log 영향 확인
Fixture 갱신
Human Review
```

첫 POC Run이 시작된 이후 다음을 중대하게 변경하면
새 Experiment Version을 생성한다.

```text
Threshold 강화 또는 완화
Scenario Count
Runtime·Version·OS Matrix
Product Value 기준
Maintenance Budget
Zero-tolerance 기준
```

기존 Run과 결과를 분리하고
변경 이유와 Human Review를 기록한다.

---

## 18. Non-goals

```text
Automatic Runtime Selection
Multi-agent Orchestration
Runtime Broker
Remote Execution
Cloud Task Queue
Managed SessionBinding
Organization Approval
Billing·Entitlement
Automatic Repository Apply
```

---

## 19. Open Decisions

1. 첫 Runtime
2. 두 번째 Runtime 포함 여부
3. POC 구현 언어
4. Process Supervisor Library
5. Prompt 전달 방식
6. Local Artifact Root
7. Output 크기 제한
8. Timeout 기본값
9. OS Matrix
10. Adapter Packaging
11. Result Normalizer 구현 방식
12. Artifact Retention
13. Local Lock 방식
14. Runtime Version Pinning
15. POC 사용자 수

Open Decision을 구현자가 Product Contract로 임의 확정하지 않는다.

---

## 20. 불변조건

1. POC는 Experiment다.
2. POC 성공은 Product 채택이 아니다.
3. V1 Manual Workflow를 변경하지 않는다.
4. Local Runtime Invocation만 검증한다.
5. Raw Product Data를 Cloud로 전송하지 않는다.
6. Runtime Adapter는 Handoff와 Policy를 완화하지 않는다.
7. Human Invocation Approval을 유지한다.
8. Unknown Capability로 실행하지 않는다.
9. Automatic Retry를 하지 않는다.
10. Child·Descendant Process를 남기지 않는다.
11. Result를 자동 승인하지 않는다.
12. Repository를 자동 반영하지 않는다.
13. Go / No-go Threshold는 실행 전에 확정한다.
14. Abort Event를 Known Limitation으로 우회하지 않는다.
15. Invocation Approval은 Action Approval을 대체하지 않는다.
16. Runtime 1개 검증만으로 Adapter Boundary를 완전 검증하지 않는다.
17. POC Fixture는 Testing 공통 상태 모델을 상속한다.
18. 첫 Run 이후 중대한 기준 변경은 새 Experiment Version을 요구한다.

---

## 21. 관련 문서

```text
docs/poc/v2-local-invocation-poc.md
docs/roadmap/product-roadmap.md
docs/architecture/local-cloud-human-boundary.md
docs/contracts/README.md
docs/testing/v1-fixture-plan.md
docs/decisions/decision-log.md
```
