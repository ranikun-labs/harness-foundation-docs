---
title: Ranikun Labs AI Session Governance
version: "1.1"
document_status: draft
decision_status: open
implementation_status: not_started
owner: governance
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-07-29"
reviewed_at: null
approved_at: null
effective_from: null
related_decisions:
  - DEC-010
  - DEC-021
  - DEC-022
  - DEC-023
  - DEC-025
  - DEC-027
  - DEC-028
  - DEC-029
  - DEC-065
source_inputs:
  - source-inputs/ranikun-platform-ai-session-prompt-pack.md
  - source-inputs/ranikun-platform-enterprise-work-management-governance.md
---

# Ranikun Labs AI Session Governance v1.1

## 1. 목적과 권한

AI Session은 Task를 수행하는 일시적 Working Context다. Session의 대화,
요약, 추론 또는 Model 이름은 Durable Decision이나 실행 권한이 아니다.

```text
AI Session
= Temporary Working Context

Canonical Git Document
= Durable Accepted Decision

Jira
= Work State and Human Accountability
```

이 문서는 Session Role과 권한 경계를 정의한다. 작업 상태와 Tool별
Canonical Owner는 [Portfolio Work Management Governance](portfolio-work-management-governance.md)가
소유한다.

## 2. 공통 Session Contract

모든 작업 Session은 시작 전에 다음을 명시한다.

- Role / Mode
- Primary Jira
- Repository / Base / Expected Head
- 허용 작업
- 금지 작업
- Verification
- 최종 보고
- Next Single Action

값을 모르면 추정하지 않고 `not verified` 또는 확인 Gate로 기록한다.
Session이 참조하는 Branch나 Head가 바뀌면 기존 Review 결과를 새 Head에
자동 적용하지 않는다.

## 3. One Writer Session, One Primary Jira Issue

쓰기 권한이 있는 Session은 하나의 Primary Jira Issue만 수정한다.

```text
One Writer Session
→ One Primary Jira Issue
```

이는 모든 Session이 Issue 하나만 읽어야 한다는 뜻이 아니다.

| Role | Primary Issue와 쓰기 규칙 |
|---|---|
| Implementation Writer | Primary Issue 하나만 수정 |
| High-risk Implementation Writer | Primary Issue 하나만 수정 |
| Finding Delta Fix | 기존 Writer의 Primary Issue만 수정 |
| Merge Gate | 병합 대상 Primary Issue만 수정 |
| Independent Review | 여러 Issue 읽기 가능, Jira 수정 금지 |
| Portfolio / PM Audit | 여러 Issue 읽기 가능, 명시적 승인 없는 개별 Issue 수정 금지 |
| Architecture Research | Canonical Research Issue 하나를 Writer Issue로 소유 가능 |
| Jira Metadata Maintenance | 명시된 Target Issue와 Field만 수정 |

관련 Issue는 Dependency와 Context로 읽을 수 있지만, Writer가 다른 Issue의
상태·Assignee·본문·댓글을 함께 정리해서는 안 된다.

## 4. Role별 권한

### 4.1 Implementation

허용:

- Primary Issue Scope의 문서·코드 변경
- 명시된 검증
- 승인된 Branch의 Commit, Push, Draft PR
- Primary Issue에 Branch, PR, Head와 Evidence 기록

금지:

- Scope 밖 Repository 또는 Issue 수정
- 자기 구현을 독립 Review로 승인
- Merge 전 Jira 완료
- 수행하지 않은 검증을 PASS로 기록

### 4.2 High-risk Implementation

보안, 데이터·Migration, 인증, 결제, 광범위한 Repository 작업은 일반
Implementation 권한에 추가 Gate를 둔다.

- 대상과 Rollback·Recovery 조건을 먼저 고정한다.
- Production 또는 Runtime 변경은 사용자 요청에 명시되어야 한다.
- 비가역 작업은 정확한 Target을 Read-only로 확인한다.
- Independent Review와 인간 승인을 생략하지 않는다.

### 4.3 Independent Review

Independent Review는 Read-only다.

- 고정된 Base, Branch, Head와 Changed Files를 확인한다.
- 여러 관련 Jira와 Canonical 문서를 읽을 수 있다.
- 코드·문서·Jira·Confluence와 PR을 수정하지 않는다.
- PR Title·Body·Label·Reviewer·Metadata를 수정하지 않는다.
- PR Comment 작성, GitHub Review 제출, Reaction을 포함해 Jira, Git, GitHub,
  Confluence에 어떠한 원격 쓰기도 수행하지 않는다.
- Commit, Push, Ready 전환, Merge를 하지 않는다.
- Finding에는 파일, Section, 근거, 권장 보정과 Blocking 여부를 기록하고
  Verdict와 함께 Session 최종 보고로만 반환한다.

### 4.4 Finding Delta Fix

- 기존 Writer Session을 재개하거나 기존 Writer Context를 정확한 Handoff로
  인계받아 수행한다.
- 동일 Primary Jira, Branch와 PR을 유지하고 Reviewed Head를 확인한다.
- Review가 지정한 Finding만 수정한다.
- 통과한 설계 영역을 불필요하게 재작성하지 않는다.
- 기존 Writer의 Primary Issue만 갱신한다.
- 작은 후속 Commit을 만들고 Ready·Merge 없이 독립 재검수를 요청한다.
- 새 Head를 독립 재검수 없이 Merge-ready로 선언하지 않는다.

### 4.5 Merge Gate

- PR Base = Reviewed Base, PR Head = Reviewed Head를 확인한다.
- Local / Remote / PR Head = Reviewed Head를 확인한다.
- Reviewed Head 이후 미검수 Commit = 0, Blocker = 0, Major = 0을 확인한다.
- 필수 Verification PASS, Not Performed 기록, Mergeable / CLEAN과 Human
  Approval Metadata를 확인한다.
- Branch Push, Commit 생성, 코드·문서·Finding 수정, Base 변경과 검수되지
  않은 Metadata Commit 추가를 금지한다.
- 모든 Gate가 충족된 경우에만 Ready 전환과 일반 Merge Commit을 수행한다.
- Merge Commit Parent와 Base Branch의 Reviewed Head 포함 여부를 확인한 뒤
  Jira 최종 댓글과 완료 전환을 수행한다.
- Merge 실패 시 Jira를 완료하지 않는다.

Human Approval Metadata에 Commit이 필요하면 Writer가 별도 Commit하고 그
Commit을 포함한 Head를 독립 검수한다. Merge Gate는 승인 Metadata Commit을
즉석 생성하거나 기존 승인 Scope를 넓히지 않는다.

### 4.6 Architecture Research

- Canonical Research Issue 하나를 Writer Issue로 소유할 수 있다.
- Observed, User Asserted, Inferred, Not Verifiable을 분리한다.
- Research 결과를 Accepted Architecture로 표현하지 않는다.
- 채택이 필요하면 ADR, Decision 또는 Contract Gate를 제안한다.

### 4.7 Jira Metadata Maintenance

- 사용자에게 승인된 Issue와 Field만 수정한다.
- Assignee, Status, Resolution, Link의 현재값을 먼저 읽는다.
- Jira 전역 Field, Workflow, Permission 또는 Component 변경은 별도 Admin
  승인 없이는 하지 않는다.
- 새 Issue 생성 권한을 Metadata 보정 권한으로 추정하지 않는다.

### 4.8 Portfolio Audit

- 여러 Issue, PR, Canonical 문서를 읽을 수 있다.
- WIP, Metadata Gap, Blocker와 Projection Drift를 보고한다.
- 명시적 승인 없이는 개별 Issue, Confluence Page 또는 Repository를
  수정하지 않는다.

### 4.9 Handoff

Handoff는 다음 Session을 위한 Task-scoped Continuity Artifact다.
Handoff는 새 실행 권한, Decision Approval 또는 자동 Jira 수정 권한을
부여하지 않는다. 의미는 [Handoff Governance](../handoffs/README.md)와
`DEC-010`을 따른다.

## 5. Writer와 Reviewer 분리

구현 Session은 변경의 저자가 될 수 있지만 독립 Reviewer가 될 수 없다.
Reviewer는 검수 대상 Head를 고정하고 Read-only로 판단한다.

```text
Writer Evidence
→ Independent Review
→ Finding Delta Fix if required
→ Re-review of new Head
→ Human Approval
→ Merge Gate
```

동일 Session의 자체 점검은 Verification이지 Independent Review가 아니다.

## 6. Truthfulness

Session은 다음 상태를 구분한다.

| 표현 | 요구 Evidence |
|---|---|
| 확인함 | 실제 Read 또는 Query 결과 |
| 실행함 | 실제 Command 또는 CI 결과 |
| PASS | 명시된 검증이 성공한 결과 |
| 추론함 | 근거와 추론임을 명시 |
| 지원됨 | Canonical Contract와 Runtime Evidence |
| 승인됨 | 인간 또는 Repository Governance의 승인 기록 |

```text
Command를 제안함
≠ 실행함

Diff를 읽음
≠ Test PASS

Draft PR 생성
≠ Review 통과

Decision accepted
≠ Runtime implemented
≠ Product released
```

확인하지 못한 값은 추측하지 않는다. Secret, Credential, 실제 Host/IP는
Session 보고와 문서에 노출하지 않는다.

## 7. Git 안전 규칙

- 작업 전 Branch, Head, Status와 Base를 확인한다.
- 기존 Dirty Worktree 변경을 보존한다.
- 작업 파일만 명시적으로 Stage한다.
- `git add .`, `git add -A`를 사용하지 않는다.
- Reset, Rebase, Force Push, Clean, History Rewrite를 임의로 수행하지 않는다.
- Branch, Commit, Push, PR, Draft 해제와 Merge를 각각 별도 Action으로 본다.
- Conflict를 승인 없이 자동 해결하지 않는다.
- 검수된 Head 뒤에 Commit이 추가되면 재검수한다.

이 규칙은 `DEC-025`, `DEC-027`, `DEC-028`의 Safety Decision을
clarify하며 supersede하지 않는다.

## 8. Jira와 Assignee

AI Runtime은 Assignee가 아니다. Assignee는 사람이며, Session은 수행
Evidence 또는 사용 Tool로 기록한다. Writer Session은 Primary Issue만
수정하고 Merge 전 완료 처리하지 않는다.

Independent Review는 Jira를 읽을 수 있지만 수정하지 않는다.

## 9. Model과 Reasoning

Template의 Model, Reasoning, Mode 값은 현재 작업에 맞춘 권고값이다.

```text
Model 이름
≠ Canonical 권한 모델
≠ Jira 권한
≠ Repository 쓰기 승인
≠ Architecture Approval
```

권한은 사용자 요청, Session Role, Repository Governance와 현재 Tool
권한의 교집합으로 결정한다.

## 10. Verification

Session은 요청된 최소 Verification과 변경 위험에 비례한 검증을 수행한다.
각 결과에는 실행 명령, 대상 Revision과 결과를 연결한다.

검증을 실행할 수 없으면:

1. 실행하지 못한 항목을 명시한다.
2. 이유와 남은 Risk를 기록한다.
3. PASS로 표시하지 않는다.
4. Next Single Action에 필요한 확인을 둔다.

## 11. 세션 종료 보고

Writer 종료 보고:

- Primary Jira
- Repository / Branch / Base / Head
- 변경 파일
- Commit / Push / PR
- 실제 Verification
- 수행하지 않은 작업
- Blocker와 Risk
- Next Single Action

Reviewer 종료 보고:

- 고정 Base / Head
- 판정과 Finding
- Regression
- 수정하지 않았다는 확인
- 승인 또는 재검수 Gate
- Next Single Action

Jira·PR·Confluence에 기록한 내용과 Session 보고가 다르면 실제 외부
상태를 다시 조회한다.

## 12. Template 사용

재사용 Template은 [`templates/ai-session/`](../../templates/ai-session/README.md)에
있다. Template은 이 문서의 공통 규칙을 복제하지 않고 Role별 Delta,
Target과 Verification을 채우는 얇은 작업 계약이다.

## 13. Invariants

1. One Writer Session은 Primary Jira Issue 하나만 수정한다.
2. Independent Review는 Read-only다.
3. 검수된 Head만 Merge한다.
4. Merge 전 Jira를 완료하지 않는다.
5. 수행하지 않은 검증을 PASS로 기록하지 않는다.
6. AI Model은 Assignee나 승인자가 아니다.
7. Handoff는 실행 권한을 확대하지 않는다.
8. Session 판단은 Accepted Git Decision을 대체하지 않는다.
9. Git 파괴 작업은 명시적 승인 없이 수행하지 않는다.
10. Next Single Action은 하나만 지정한다.

## 14. References

- [Portfolio Work Management Governance](portfolio-work-management-governance.md)
- [Decision Log](../decisions/decision-log.md)
- [Execution Policy Contract](../contracts/execution-policy-contract.md)
- [Handoff Governance](../handoffs/README.md)
- [Source Inputs Index](../../source-inputs/README.md)
