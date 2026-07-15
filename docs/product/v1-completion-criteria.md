---
title: V1 Completion Criteria
status: draft
implementation_status: partial
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
  - docs/product/development-harness-report.md
  - docs/master/product-architecture-master.md
  - docs/roadmap/product-roadmap.md
  - docs/architecture/local-cloud-human-boundary.md
---

# V1 Completion Criteria

## 1. 문서 목적

이 문서는 `oh-my-ai` V1 Community의 완료 조건을 정의한다.

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

## 2. V1 제품 정의

V1 Community는 다음 제품이다.

```text
무료
Local-only
Artifact-based
Runtime-neutral
Human-controlled
Cloud-independent
```

기본 흐름:

```text
Work-start
→ Context / Skill Candidate
→ Structured Handoff Candidate
→ Human Review
→ Runtime Projection
→ 사용자가 Runtime 직접 실행
→ Result Basic Candidate
→ Human Review
→ 수동 반영
```

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

## 3. V1 완료의 의미

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

## 4. V1 포함 범위

```text
Local Installation
Instruction Cascade
Runtime Instruction Projection
Skill Registry
Skill Routing
Prompt Routing Hook
Work-start
Structured Handoff
Result Basic
Static Capability Metadata
Execution Policy
Local Context
Local Usage Log
Human Review
Minimal Fixtures
Manual Export / Import
Truthfulness
Provenance
```

---

## 5. V1 비범위

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
Organization Governance
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
Lint 또는 Validation 존재
Runtime-neutral 표현 유지
최소 1개 V1 지원 Runtime Projection 존재
V1 지원 Runtime으로 공개되는 각 Adapter는 Projection Fixture 통과
Semantic Preservation Fixture 통과
```

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

# Part II. Workflow Completion

## 10. Manual Handoff Flow

필수 흐름:

```text
Work-start Candidate
→ Handoff Candidate 생성
→ Human Review
→ Runtime Projection
→ Manual Export / Copy
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
- 최소 1개 V1 지원 Runtime용 Projection 가능
- 지원 대상으로 공개한 각 Runtime용 Projection 가능
- Generic Markdown Export 가능
- 사용자 승인 전 자동 실행하지 않음

---

## 11. Manual Result Return Flow

필수 흐름:

```text
Worker Result
→ Result Basic Candidate
→ Human Review
→ Accept / Edit / Reject
→ Main Session 또는 Repository 수동 반영
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
- Accept / Edit / Reject 가능
- Validation 미수행 표시 가능
- Scope 이탈 표시 가능
- Main Session 반영용 Export 가능
- Project Context 자동 승격 금지

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

### Runtime Projection

```text
Claude Projection
Codex Projection
Unsupported Capability
Semantic Preservation
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
Work-start
→ Handoff
→ Runtime Projection
→ Result Basic
→ Human Review
→ Manual Import
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
Handoff / Result Validation 또는 Lint
Manual Handoff Flow
Manual Result Return Flow
Minimum Per-feature Fixtures
Runtime Projection Fixture
Good / Bad Artifact Examples
Execution Policy Contract와 Fixture
Manual End-to-End Pass
Truthfulness Gate
Fresh Install 검증
Single-runtime Quick Start
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

---

## 26. P2 Post-release

```text
Gemini Projection
TUI Review
Local Artifact History
Additional Domain Skills
Optional Search Backend
Enhanced Context Ranking
```

P2 미구현은 V1 Release를 막지 않는다.

---

## 27. Release Gate Checklist

### Contract

- [ ] Work-start Contract 확정
- [ ] Handoff Contract 확정
- [ ] Result Basic Contract 확정
- [ ] Capability Contract 확정
- [ ] Execution Policy 정렬
- [ ] Project Context 경계 정렬

### Implementation

- [ ] Work-start 출력 정렬
- [ ] Handoff Create / Review / Export
- [ ] Claude Projection
- [ ] Codex Projection
- [ ] Result Create / Review / Import
- [ ] Generated Drift Check
- [ ] Hook Fail-open
- [ ] Usage Log Privacy

### Fixture

- [ ] Routing Fixture
- [ ] Handoff Fixture
- [ ] Projection Fixture
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
- [ ] 최소 1개 V1 지원 Runtime의 single-runtime flow
- [ ] 지원 대상으로 공개한 각 추가 Runtime의 Adapter 검증
- [ ] Missing Result path
- [ ] Validation Not Performed path
- [ ] Scope Deviation path
- [ ] Accept / Edit / Reject
- [ ] Manual Import

---

# Part VII. Exit Criteria

## 28. V1 완료 판정

다음 조건을 모두 만족하면 V1을 완료로 판정한다.

```text
1. 사용자가 작업을 입력할 수 있다.
2. Work-start가 Context와 Skill Candidate를 생성한다.
3. Structured Handoff Candidate를 생성할 수 있다.
4. 사용자가 Scope와 Do Not Touch를 검수할 수 있다.
5. Handoff를 Claude 또는 Codex에 전달할 수 있다.
6. Worker가 Result Basic을 반환할 수 있다.
7. 사용자가 Files / Commands / Validation / Risk를 검수할 수 있다.
8. 실행하지 않은 검증이 Pass로 표시되지 않는다.
9. Result를 Accept / Edit / Reject할 수 있다.
10. Accepted Result만 수동 반영할 수 있다.
11. Cloud 없이 전체 흐름이 완료된다.
12. 단일 Runtime으로 전체 흐름이 완료된다.
13. Negative Fixture와 Manual E2E가 통과한다.
14. Public Documentation이 실제 동작과 일치한다.
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
10. V1 Release Version
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
docs/testing/v1-fixture-plan.md
docs/poc/v2-local-invocation-poc.md
docs/decisions/decision-log.md
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
