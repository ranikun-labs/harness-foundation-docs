---
title: Ranikun Labs Portfolio Work Management Governance
version: "1.1"
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
owner: governance
authors:
  - codex
reviewers:
  - 박성환
approvers:
  - 박성환
created_at: "2026-07-29"
reviewed_at: "2026-07-29"
approved_at: "2026-07-29"
effective_from: "2026-07-29"
related_decisions:
  - DEC-010
  - DEC-025
  - DEC-027
  - DEC-035
  - DEC-038
  - DEC-059
  - DEC-064
  - DEC-065
  - DEC-067
source_inputs:
  - source-inputs/ranikun-platform-enterprise-work-management-governance.md
  - source-inputs/ranikun-platform-ai-session-prompt-pack.md
supporting_architecture_inputs:
  - source-inputs/ADR-PROPOSED-공통-MSA-통신-메시징-프로토콜-선택.md
  - source-inputs/Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md
---

# Ranikun Labs Portfolio Work Management Governance v1.1

## 1. 목적과 상태

이 문서는 Jira, Git, GitHub, Confluence와 AI Session을 하나의 작업 흐름으로
연결하되, 각 도구가 소유하는 Concern을 혼합하지 않는 운영 기준이다.

```text
이 Governance의 채택
≠ Jira 전역 설정 적용
≠ Confluence Page 생성
≠ Runtime 또는 Product 변경
```

현재 문서는 인간 승인에 따라 `accepted`, `DEC-065`는
`accepted_with_constraints`다.

Architecture 정책은 이 문서가 재정의하지 않는다. 적용 우선순위는 다음과
같다.

```text
Accepted ADR-0015 / DEC-064
> 현재 Foundation Canonical 문서
> Primary Governance Source Inputs
> Supporting Architecture Inputs
```

Supporting Input의 Proposed·Draft 표현이 Accepted Architecture와 다르면
ADR-0015와 DEC-064를 따른다.

## 2. Concern별 Canonical Owner

도구 전체를 가로지르는 하나의 전역 우선순위는 두지 않는다. 같은 사실이
충돌하면 먼저 어떤 Concern인지 판정하고 그 Concern의 Canonical Owner에서
해결한다.

| Concern | Canonical Owner | 소유 내용 |
|---|---|---|
| 작업 Scope·상태·담당자·우선순위·의존성·Next Action | Jira | 실행할 일과 현재 Workflow 상태 |
| 승인된 Architecture·Contract·데이터 소유권·Verification 기준 | Git의 accepted 문서 | Durable Architecture와 Contract |
| Commit·Diff·PR·Review·Merge Commit | GitHub | 변경 이력과 병합 결과 |
| 실행된 Test Evidence | GitHub / CI | 실제 실행 로그와 Check 결과 |
| Portfolio·System Landscape 탐색 | Confluence | 사람이 읽기 쉬운 Projection |
| 임시 조사·판단·Working Context | AI Session | Task-scoped Working State |

```text
Confluence Projection
≠ Accepted Architecture

AI Session 판단
≠ Durable Decision

Jira 완료
≠ Merge Evidence
```

Projection이 Canonical Owner와 다르면 Canonical Owner를 먼저 확인하고
Projection을 후속 갱신한다. Accepted Architecture와 Contract의 현재
Canonical Repository는 `harness-foundation-docs`다.

## 3. Jira Project와 정보 구조

### 3.1 단일 Project

Portfolio 작업은 단일 Jira Project `RPL`을 유지한다. Product별 Jira
Project 분리는 별도 운영 병목과 권한 경계가 확인되기 전에는 하지 않는다.

### 3.2 필수 분류

| 분류 | 질문 | 초기값 |
|---|---|---|
| Workstream | 어느 제품·공통 역량의 흐름인가 | Carelog, Finance Harness, Dev Harness, Shared Identity, Shared AI, Platform Foundation |
| Component | 어느 기술·문서 계층인가 | Frontend, Backend, Local Runtime, Cloud Control Plane, Gateway / Ingress, Shared Service, Documentation |
| Primary Repository | 주 변경과 Merge Evidence는 어디에 있는가 | 아래 Registry |
| Area | 어떤 책임 영역인가 | 아래 분류 |

한 Issue에는 하나의 Primary Repository를 둔다. 여러 Repository 변경이
독립적으로 검수·병합되어야 하면 Issue를 분리하고 Dependency로 연결한다.

### 3.3 Primary Repository Registry

2026-08-08 GitHub 조회와 승인된 Foundation 문서를 기준으로 현재 값은 다음과
같다.

| 값 | 용도 |
|---|---|
| `ranikun-labs/carelog-be` | Carelog Backend와 Gateway·Auth/OAuth/Identity의 현재 구현 Host |
| `ranikun-labs/carelog-fe` | Carelog Frontend |
| `ranikun-labs/finance-harness-fe` | Finance Harness Frontend |
| `ranikun-labs/finance-harness-docs` | Finance Product 정책·문서 |
| `ranikun-labs/react-product-foundation` | 공통 React Product Foundation |
| `ranikun-labs/oh-my-ai` | Dev Harness Local Runtime |
| `ranikun-labs/harness-foundation-docs` | Ranikun Labs Platform Foundation Canonical 문서 |
| `ranikun-labs/platform-services` | Shared Gateway·Identity Target; `planned / not_created`, RPL-52 Runtime 없음 |
| `No Repository / Confluence-only` | Repository 변경 없는 Portfolio Projection 작업 |

Registry 값은 Jira Admin 적용 전에 Repository 존재·이름을 다시 확인한다.
Owner migration 전 namespace는 historical provenance에서만 보존한다. 현재
Canonical Registry는 `ranikun-labs/*`를 사용하며, `platform-services`는 생성 전까지
Primary implementation Repository로 선택하지 않는다.

### 3.4 Area 초기값

```text
Auth / Identity
API / Contract
Data / Migration
Messaging / Consistency
AI / Model Integration
Runtime / Deployment
Security / Secret
Observability / Operations
Product / Workflow
Architecture / Governance
Documentation
```

Area는 Workstream이나 Component를 대체하지 않는다.

### 3.5 Assignee

Assignee는 작업 결과에 책임지는 사람이다. AI Model, Agent, Session 이름을
Assignee로 사용하지 않는다. AI 사용 여부는 PR, Handoff 또는 Session
Evidence로 기록한다.

### 3.6 Workstream과 논리 Service 관계

Workstream은 현재 Process나 Repository 배치가 아니라 작업의 논리적
책임을 나타낸다.

| Workstream | 논리 책임 | 구현 Host 해석 |
|---|---|---|
| Carelog | Carelog 제품 Domain | Carelog Repository의 실제 적용 상태가 소유 |
| Finance Harness | Finance 제품 Domain | Finance Repository의 실제 적용 상태가 소유 |
| Dev Harness | Dev Harness 제품 Domain | Dev Harness Repository의 실제 적용 상태가 소유 |
| Shared Identity | Account·Identity 논리 Capability | 현재 코드가 `carelog-be`에 있어도 Shared Identity Workstream 가능 |
| Shared AI | 제품 중립 AI 실행 Capability | 실제 Runtime 존재 여부와 분리해 분류 |
| Platform Foundation | 공통 Architecture·Contract·Governance | `harness-foundation-docs`가 Canonical |

```text
Logical Service Boundary
≠ Current Implementation Host
≠ Runtime Deployed
```

Shared Commerce와 독립 Audit은 별도 Decision 전까지 초기 활성 Workstream으로
확정하지 않는다. 관련 조사는 기존 Workstream의 Area 또는 Research Issue로
기록한다.

### 3.7 Architecture 상태 표현

Governance Metadata와 Jira 예시는 다음 상태를 혼합하지 않는다.

| 상태 | 의미 | Evidence Owner |
|---|---|---|
| Current Repository Fact | 특정 Revision에 코드·설정·문서가 존재 | 해당 Repository |
| Approved Target | Accepted ADR·Decision이 방향을 승인 | Foundation Canonical |
| Runtime Deployed / Supported | 실제 배포·지원 Evidence가 존재 | Service Repository / Ops |
| Deferred | Trigger 전에는 도입하지 않음 | Accepted Decision |

Supporting Input의 물리 배치 그림이나 `현재` 표현만으로 Runtime 배포·지원
상태를 만들지 않는다.

## 4. WIP 정책

Portfolio WIP는 `진행 중 + 검토 중` 합계 최대 3개다.

```text
Portfolio WIP = In Progress + In Review ≤ 3
```

새 작업을 시작하기 전에 진행 중 작업의 Next Action과 Blocker를 정리한다.
긴급 보안·장애 대응은 예외가 될 수 있으나, 이유와 종료 조건을 Jira에
기록한다. 완료된 과거 Jira 전체를 일괄 Backfill하지 않는다. 활성화되거나
다시 참조되는 Issue만 점진적으로 보정한다.

## 5. Session Ownership과 역할

기본 규칙은 `One Writer Session, One Primary Jira Issue`다.

| Session Role | Jira 읽기 | Jira 쓰기 |
|---|---|---|
| Writer / Implementation | 관련 Issue 읽기 가능 | Primary Issue 하나 |
| High-risk Writer | 관련 Issue 읽기 가능 | Primary Issue 하나 |
| Finding Delta Fix | Review Finding 읽기 가능 | 기존 Writer의 Primary Issue만 |
| Merge Gate | Merge 대상 Evidence 읽기 가능 | 병합 대상 Primary Issue만 |
| Independent Review | 여러 관련 Issue 읽기 가능 | 금지 |
| Portfolio / PM Audit | 여러 Issue 읽기 가능 | 명시적 승인 없이는 금지 |
| Architecture Research | 관련 Decision과 Issue 읽기 가능 | Canonical Research Issue 하나 |
| Jira Metadata Maintenance | 승인된 Target 읽기 가능 | 명시된 Issue와 Metadata만 |

이 규칙은 모든 Session을 하나의 Issue에 가두지 않는다. Read-only Review와
Portfolio 탐색에는 여러 Issue 읽기가 필요하며, 쓰기 권한만 분리한다.

상세 권한은 [AI Session Governance](ai-session-governance.md)가 소유한다.

## 6. Writer·Reviewer·Merge Gate

### Writer

- Primary Issue의 Scope 안에서 문서 또는 코드를 변경한다.
- Draft PR을 만들고 수행한 Verification만 기록한다.
- 자기 결과를 독립 Review로 표현하지 않는다.

### Independent Reviewer

- Writer와 분리된 Session에서 검수된 Head를 고정한다.
- Repository, PR, Jira와 Evidence를 읽을 수 있다.
- 코드·문서·Jira·Confluence와 PR을 수정하지 않는다.
- PR Comment·GitHub Review·Reaction을 포함해 Jira, Git, GitHub,
  Confluence에 어떠한 원격 쓰기도 수행하지 않는다.
- A, B, C와 재현 가능한 Finding·Verdict는 Session 최종 보고로만 반환한다.

### Finding Delta Fix

- 기존 Writer Session을 재개하거나 기존 Writer Context를 정확한 Handoff로
  인계받는다.
- B Finding의 정확한 범위만 보정한다.
- 동일 Primary Jira, Branch와 PR을 유지하고 Reviewed Head를 확인한다.
- 기존 통과 영역을 불필요하게 다시 작성하지 않는다.
- 작은 후속 Commit을 만든 뒤 Ready·Merge 없이 독립 재검수를 요청한다.

### Merge Gate

- PR Base와 Reviewed Base, PR Head와 Reviewed Head가 각각 같은지 확인한다.
- Local·Remote·PR Head가 Reviewed Head와 같은지 확인한다.
- Reviewed Head 이후 미검수 Commit, Blocker와 Major가 모두 0인지 확인한다.
- 필수 Verification PASS, Not Performed 기록, Mergeable / CLEAN과 Human
  Approval Metadata를 확인한다.
- Branch Push, Commit 생성, 코드·문서·Finding 수정, Base 변경과 검수되지
  않은 Metadata Commit 추가를 금지한다.
- 모든 Gate가 충족된 경우에만 PR Ready 전환과 일반 Merge Commit을 수행한다.
- Merge Commit Parent와 Base Branch의 Reviewed Head 포함 여부를 확인한 뒤
  Jira 최종 댓글과 완료 전환을 수행한다.

Human Approval Metadata 반영에 Commit이 필요하면 Writer가 별도 Commit하고
그 Commit을 포함한 새 Head를 독립 검수한다. Merge Gate가 승인 Metadata
Commit을 즉석 생성해서는 안 된다.

```text
Writer 완료
→ Independent Review
→ 필요 시 Finding Delta Fix
→ 필요한 승인 Metadata를 Writer가 별도 Commit
→ 승인 Metadata 포함 Head 재확인 또는 재검수
→ Human Approval / Merge Gate
→ Merge
```

## 7. Issue·PR Lifecycle

1. Jira Primary Issue와 분류를 확인한다.
2. Canonical Git 문서와 기존 Decision을 읽는다.
3. Writer가 변경을 작성하고 명시적으로 Stage·Commit한다.
4. Draft PR에 Jira, Scope, Changed Files와 실제 Verification을 기록한다.
5. Independent Review가 고정 Head를 검수한다.
6. Finding이 있으면 Delta Fix 후 새 Head를 재검수한다.
7. Human Approval과 Merge Gate가 검수된 Head를 확인한다.
8. 일반 Merge Commit으로 병합한다.
9. Merge Commit과 Final main SHA를 Jira에 기록한다.
10. 병합 성공 뒤에만 Jira를 완료한다.
11. 필요한 Confluence Projection을 갱신한다.

PR Merge 전 Jira 완료는 금지한다. 수행하지 않은 Test나 검증을 `PASS`로
표현하지 않는다.

## 8. Git 문서 배치

| 내용 | 위치 |
|---|---|
| Accepted Foundation ADR·Contract·Decision | `harness-foundation-docs/docs/` |
| Governance 정책 | `harness-foundation-docs/docs/governance/` |
| 재사용 Session Template | `harness-foundation-docs/templates/ai-session/` |
| 역사적 설계 입력 | `harness-foundation-docs/source-inputs/` |
| Service 실제 적용·DB·Migration·Adapter·운영 Gap | 각 Service Repository |
| 실제 Secret·Host·Credential·Backup 위치 | Private Ops / Secret Manager |

Source Input은 원문과 Provenance를 보존하지만 Canonical Decision이 아니다.

## 9. Repository 전략

현재 새 `ranikun-platform-docs` Repository를 생성하지 않는다.
`harness-foundation-docs`는 ADR-0015와 DEC-064를 이미 승인한 Ranikun Labs
Platform Foundation Canonical이다. 즉시 분리하면 Canonical이 다시
이원화된다.

다음 Trigger가 실제로 발생하면 분리를 재검토한다.

- Cross-product 문서 증가로 탐색 충돌이 발생한다.
- 별도 팀 또는 권한 경계가 필요하다.
- 독립 Release·Review Workflow가 필요하다.
- Repository 규모가 실질적 운영 병목이 된다.
- Dev Harness 문서와 Platform Foundation 문서가 실제로 충돌한다.

분리할 때는 파일 복제로 두 Canonical을 만들지 않는다. Rename 또는
Migration ADR로 소유권, History, Redirect, 완료 조건을 승인한다.

## 10. Confluence Projection

Confluence는 System Landscape와 Portfolio를 읽기 쉽게 Projection한다.
Product·Shared Platform Page Properties와 Portfolio Overview는 Git/Jira의
Canonical Reference를 포함해야 한다. Confluence가 ADR, Contract, Jira
상태 또는 Merge Evidence를 재정의해서는 안 된다.

이번 문서 PR은 Confluence를 수정하지 않는다.

## 11. Proposed Jira Rollout Plan

아래는 문서화된 제안이며 이번 PR에서 Jira 전역 설정을 생성·변경하지 않는다.

### Phase 0 — 정보 구조와 Active WIP

- Jira의 실제 완료 Status가 Done Category인지 확인한다.
- Workstream Custom Field를 생성한다.
- Primary Repository Custom Field를 생성한다.
- Area Custom Field를 생성한다.
- 초기 Components를 등록한다.
- 활성 Issue Metadata만 보정한다.
- `진행 중 + 검토 중` WIP를 3개 이하로 조정한다.

### Phase 1 — Portfolio Epic

- Shared Identity Foundation Epic
- Platform Architecture Baseline Epic
- Dev Harness V1.x Epic
- Finance STEP 10 Epic

### Phase 2 — Confluence Projection

- System Landscape
- Product·Shared Platform Page Properties
- Portfolio Overview 집계

### Phase 3 — Repository Catalog

- `harness-foundation-docs/catalog/system-catalog.yaml`
- 별도 Platform Repository는 생성하지 않는다.

후속 Catalog Schema 후보:

```text
system_id
display_name
workstream
logical_owner
primary_repository
current_implementation_host
lifecycle
architecture_refs
runtime_evidence_ref
dependencies
```

이는 Metadata 후보일 뿐 이번 PR에서 Catalog 파일이나 Runtime Registry를
생성하지 않는다.

### Phase 4 — 점진 Backfill

- 다시 활성화되거나 참조되는 티켓만 보정한다.
- 완료된 과거 Jira 전체를 일괄 수정하지 않는다.

각 Phase의 실제 적용은 별도 Jira Admin 또는 Documentation 작업과 승인
Evidence를 요구한다.

## 12. 사용자 흐름

```text
Task 시작
→ Jira Primary Issue 확인
→ Workstream과 Repository 확인
→ Canonical Git 문서 확인
→ Writer Session이 Draft PR 생성
→ 독립 Review
→ Finding Delta Fix
→ 검수된 Head Merge
→ Jira 완료
→ Confluence Projection 갱신
```

### Product Client Registry 예시

| Field | Value |
|---|---|
| Issue | `RPL-16` |
| Workstream | Shared Identity |
| Component | Backend |
| Primary Repository | `ranikun-labs/carelog-be` |
| Area | Auth / Identity |
| Logical Owner | Shared Identity |
| Current Implementation Host | Carelog Backend |

Logical Owner와 Current Implementation Host를 혼합하지 않는다.
따라서 Shared Identity 코드가 현재 Carelog Backend에 있더라도 Issue의
Workstream은 Shared Identity이고 Primary Repository는 실제 변경이 일어나는
`ranikun-labs/carelog-be`가 될 수 있다. RPL-54의 Target은 생성 이후
`ranikun-labs/platform-services`지만, RPL-55 Cutover 전까지 Current Implementation
Host가 바뀌었다고 간주하지 않는다.

## 13. 과설계 방지선

- 서비스·도구 수만으로 새 Repository나 Jira Project를 만들지 않는다.
- Jira Custom Field를 문서보다 먼저 확장하지 않는다.
- 모든 Issue를 한 번에 Backfill하지 않는다.
- AI Session Prompt에 Canonical 정책 전체를 복제하지 않는다.
- Confluence를 두 번째 Decision Log로 만들지 않는다.
- Source Input의 제안을 현재 운영 사실로 승격하지 않는다.

## 14. Constraints와 Open Decisions

### Constraints

- Jira Admin 적용과 Confluence 변경은 별도 작업이다.
- Assignee는 사람이다.
- 검수된 Head만 Merge한다.
- Merge 전 Jira 완료를 금지한다.
- 실제 Secret, Host, IP를 문서화하지 않는다.

### Open Decisions

- Jira 완료 Status의 실제 Done Category
- Custom Field Type, Context와 Option ID
- Component 등록 권한과 관리자 실행 순서
- Phase 1 Epic의 실제 Scope와 Dependency
- Confluence Page Properties Schema
- Repository 분리 Trigger 충족 여부

## 15. References

- [AI Session Governance](ai-session-governance.md)
- [ADR-0015](../adr/ADR-0015-platform-communication-messaging-scaling.md)
- [Backend Documentation Ownership](../architecture/backend-service-foundation/documentation-ownership-and-placement.md)
- [Decision Log](../decisions/decision-log.md)
- [Source Inputs Index](../../source-inputs/README.md)
- [Session Handoff Governance](../handoffs/README.md)
- [Supporting Proposed Communication ADR](../../source-inputs/ADR-PROPOSED-공통-MSA-통신-메시징-프로토콜-선택.md)
- [Supporting MSA Platform Design v2](../../source-inputs/Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md)
