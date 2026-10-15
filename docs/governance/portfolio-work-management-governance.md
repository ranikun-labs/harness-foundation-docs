---
title: Ranikun Labs Portfolio Work Management Governance
version: "1.2-proposed"
document_status: in_review
decision_status: proposed
g0_owner_classification_status: approved
g0_owner_classification_date: "2026-10-15"
g0_owner_classification_ref: docs/governance/jira-taxonomy-g0-owner-decision-2026-10-15.md
implementation_status: not_started
owner: governance
authors:
  - codex
reviewers:
  - 박성환
approvers:
  - 박성환
created_at: "2026-07-29"
reviewed_at: null
approved_at: null
effective_from: null
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

# Ranikun Labs Portfolio Work Management Governance v1.2 — 개정 초안

## 1. 목적과 상태

이 문서는 Jira, Git, GitHub, Confluence와 AI Session을 하나의 작업 흐름으로
연결하되, 각 도구가 소유하는 Concern을 혼합하지 않는 운영 기준이다.

```text
이 Governance의 채택
≠ Jira 전역 설정 적용
≠ Confluence Page 생성
≠ Runtime 또는 Product 변경
```

이 브랜치는 기존 v1.1(`accepted`, DEC-065 `accepted_with_constraints`)을 대체하려는
**v1.2 개정 제안**이다. Product/Component/Concern·Subtask·RPL-51 관련
**G0 Owner 5개 결정은 2026-10-15 승인됐다**([승인 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md)).
다만 **해당 정책 문서 전체는 아직 독립 검수·PR Merge Gate 전**이므로
`document_status: in_review`, `decision_status: proposed`, `approved_at: null`,
`effective_from: null`을 유지한다. G0 승인/PR 생성만으로 Jira 정책이 발효되지는
않으며, 승인된 개정안이 검수·Owner Merge를 마칠 때까지 `main`의 v1.1이 적용된다.

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

### 3.2 필수 분류 — 개정 제안

실제 Jira의 세 커스텀 필드가 자유 입력 Labels로 구성된 문제와 과거
Workstream/Component/Area 계약의 중첩을 해소한다. 상세 옵션·이전·AI CRUD Gate는
[**Jira Field Taxonomy**](jira-field-taxonomy.md)에 정의한다.

| 필드 | 질문 | Target 정책 |
|---|---|---|
| Product | 이 일의 최종 책임 시스템 1개는? | **책임 기준 하나**. 지원되는 Issue Type만 신규 단일 Dropdown 저장·필수화; 적용 상태는 Taxonomy §5.1/§8 참고 |
| Component | 주된 기술 작업 영역은? | **대표 영역 하나**. 지원되는 Issue Type에만 단일 Dropdown 저장·필수화 |
| Concern | 어떤 횡단 기술 관심사가 있는가? | **다중 선택, 선택, 0~3개** |
| Primary Repository | 주 구현과 PR Merge Evidence는 어디에 있는가? | 기존 단일 주 Repo 계약 유지. 별도 Jira Field 확정 여부는 관리 단계 검증 |
| Parent/Epic, Issue Link | 상위 목표와 선후행·관련 이슈는? | Jira 기본 관계 사용 |

- **G0 Owner 승인된 논리 Product 9개:** `carelog`, `finance`, `gateway`,
  `identity`, `ai`, `audit`, `commerce`, `platform-foundation`, `dev-harness`.
  **`commerce`는 향후 사용 예약값**으로, 별도 활성화/Scope 승인 전에는 신규 운영 티켓
  Product로 선택하지 않는다. 실제 Jira Dropdown Field/Option 활성화는 별도 G1/G3 Gate.
- **G0 Owner 승인 Component 5개:** `backend`, `frontend`, `infra`, `documentation`, `ai`.
  **Concern 14개**는 [Taxonomy §4](jira-field-taxonomy.md)에 고정하며 유형별 저장·필수
  설정과 Concern 최대 3개 기술적 강제는 Jira Admin 검증 대상이다.
- 과거 Workstream은 논리적 책임 단위로 설계됐으며 이 개정안에서는
  **Product가 주 소유 시스템 역할을 대체**한다. 이미 기록된 값은 역사적 이력으로 보존한다.
- `shared-platform`은 **Portfolio 논리 그룹**, `platform-core`는 **Host**,
  `finance-harness`와 `shared-ai`는 기존 값의 Alias 후보이다.
- 제품 간 영향은 Product 복수 입력으로 대체하지 않는다. 다중 Product Epic의 대표 Owner는
  Human Owner의 결정 근거를 요구하며, 정규화된 영향 Product ID·관계·근거·관련 Issue는
  [Taxonomy §2.1](jira-field-taxonomy.md)에 따라 보존한다. 제품별 집계 필요 시
  별도 `Affected Products` 필드를 승인한다. **RPL-51의 대표 Product는 G0 Owner
  승인으로 `platform-foundation`**, 영향 Product는 `gateway` / `identity` /
  `carelog`로 기록한다. 이는 실제 Jira 이슈·필드 수정 승인이 아니며
  RPL-51의 Component 대표값은 아직 결정되지 않았다.
- Jira 프로젝트는 하나의 `RPL`을 유지하며, Product마다 프로젝트를 생성하지 않는다.
- Subtask/Story/Tech Debt의 생성 메타데이터에 현행 Product·Component·Labels가 노출되지 않는다.
  모든 Issue Type에 전역 필수화를 가정하지 않으며, 유형별 지원 여부·Parent 해석 규칙은
  [Taxonomy §5.1](jira-field-taxonomy.md)에서 검증/Owner 결정으로 분리한다.
  G0에서 승인한 원칙은 **Subtask Parent를 소유권 참고 정보로만** 사용하는 것이며,
  Parent Product의 자동 승인/직접 저장은 허용하지 않는다.

### 3.3 Primary Repository Registry

2026-09-03 GitHub 조회와 승인된 Foundation 문서를 기준으로 현재 값은 다음과
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
| `ranikun-labs/platform-services` | Shared Gateway·Identity·Shared AI Target; Repository exists, 현재 visibility `public`(관찰 사실, 정책 미결정), Gateway·Identity cutover와 production adoption은 별도 상태 |
| `No Repository / Confluence-only` | Repository 변경 없는 Portfolio Projection 작업 |

Registry 값은 Jira Admin 적용 전에 Repository 존재·이름을 다시 확인한다.
Owner migration 전 namespace는 historical provenance에서만 보존한다. 현재
Canonical Registry는 `ranikun-labs/*`를 사용한다. `platform-services` Repository는
존재하고 `gateway-app`, `platform-core/identity`, `platform-core/shared-ai`를 포함하지만,
그 존재만으로 Primary implementation Repository나 production adoption을 자동 확정하지
않는다. Gateway·Identity의 승인된 extraction/cutover는 별도 상태로 관리하고, Shared AI
구현/상태의 현재 Projection은 Shared AI Architecture가 소유한다. **RPL-107은 Shared Audit Epic**이므로
Shared AI 상태의 근거로 사용하지 않는다. 현재 Carelog 경로는 `ranikun-labs/carelog-be`에 남아 있다.

### 3.4 기존 Area의 이전 경계

기존 Area(`Auth / Identity`, `Data / Migration` 등)는 역사적 설계 분류로 보존한다.
신규 필수 Jira 필드로 늘리지 않고 Component(기술 작업 영역)와 Concern(횡단 관심사)으로
통합 제안한다. 과거 Area 값의 전체 제거·자동 치환은 허용하지 않는다.

`Primary Repository`는 코드/문서 변경의 실제 Host를 의미하며 Product(논리 소유권)와
다르게 나타날 수 있다. 기존 Registry는 검증된 실제 현황에 따라 별도 갱신한다.

### 3.5 Assignee

Assignee는 작업 결과에 책임지는 사람이다. AI Model, Agent, Session 이름을
Assignee로 사용하지 않는다. AI 사용 여부는 PR, Handoff 또는 Session
Evidence로 기록한다.

### 3.6 Product와 논리 Service 관계

Product는 Jira의 **소유권 분류**이며 Process·Host·Repository와 동일하지 않다.

| Product | 작업 소유 책임 | Host와의 구별 |
|---|---|---|
| `carelog` | CRM Product | Carelog 제품 기능 |
| `finance` | Finance Product | 기존 `finance-harness` Repo/코드 Rename 아님 |
| `gateway` | SCG·라우팅·Gateway 정책 | `platform-services/gateway-app`은 구현 Host |
| `identity` | Account·Auth·OAuth·Session·SSO | Core와 Carelog 연동을 분리 |
| `ai` | Shared AI·RAG·Model/Tool 연계 | Spring AI, Python, JVM 등 구현 기술과 무관 |
| `audit` | 공통 Audit 계약/이벤트 | 문서·Producer·Transport·운영 배포 상태 별도 확인 |
| `commerce` | Billing·Payment·Subscription·Refund | **G0 예약값**. 별도 활성화·제품 Scope 승인 전 실제 운영 분류에 사용 금지 |
| `platform-foundation` | 공통 Architecture·Governance·Host/Infra 기반 | 단순 미분류/기타로 사용 금지 |
| `dev-harness` | 개발 도구·Agent Session·Dev Runtime | `oh-my-ai` 등 실제 Repo 확인 |

`shared-platform`은 그룹명일 뿐 Product 옵션이 아니다. **독립된 Capability 소유권이
독립 Process·배포·서비스 지원 완료를 뜻하지 않는다.** Jira 완료도 GitHub Merge
및 Runtime 운영 검증의 근거를 대체할 수 없다.

```text
Logical Product Owner ≠ Implementation Repository ≠ Runtime Deployed
```

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

## 11. Proposed Jira Taxonomy Rollout Plan (승인·실행 분리)

**현재 상태: 문서 제안. Jira Admin 설정·이슈 데이터 미변경.**

- **G0 Contract**: [2026-10-15 G0 Owner 승인 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md)의
  다섯 가지 분류·책임 선택은 **Owner 승인 완료**. 단, PR #38의 독립 Reviewer
  Delta/Closure·최신 main 통합 확인·별도 Owner Merge Gate가 완료되기 전에는
  v1.2를 `accepted`/발효 상태로 표시하지 않는다. 문서 Merge도 Jira 필드 적용은
  아니다. 실제 대상의 G1 실설정·G2/G3 Cutover 전까지 승인된 v1.1과 Legacy
  Jira 필드를 현행 쓰기 계약으로 유지한다.
- **G1 Admin**: 실제 Jira Field·Option ID, Issue Type별 화면/필수 여부,
  기본값·권한을 검증하고 신규 커스텀 선택형 필드를 생성한다. 기존 레거시 필드·값은 보존한다.
  Epic·Task·Feature·Bug·Research의 레거시 Product·Component·커스텀 Labels는 현재
  Create Metadata상 required이므로, 신규 Create 전환 대상 유형에서는 **기존 필수·기본값을
  안전하게 해제할 수 있는지** 및 다른 required 일정·담당자 필드의 정책을 확인한다.
  실제 설정·Type Scope·신규 옵션·Create 테스트 없이 전환하지 않는다.
- **G2 Pilot**: 대상 Issue가 Manifest에 등재돼도 **Target 저장 → 재조회·영향 보존 검증
  → 별도 Owner Cutover 승인 → Manifest ReadAuthority 전환** 완료 전에는 Legacy 권위를
  유지한다. 준비·검증 중에는 해당 Issue의 분류 쓰기를 `frozen`으로 제한하며,
  Comment·Transition 등 비분류 작업에는 영향을 주지 않는다.
- **G3 Active Issues**: Cutover 승인·검증된 Issue만 Target 권위이며, 신규 Create는
  유형별 **기존 Legacy required/default 정리·신규 Target 필수/옵션 검증·격리 Create 재조회
  ·Writer/Board/Automation 경로 검증·별도 전환 승인** 뒤 활성화한다.
  Legacy와 Target 신규 Create는 동일 유형에서 동시 활성화하지 않는다.
  나머지는 Legacy 계약 사용. Board/Filter/Automation 조회·집계 권위를 점진 전환한다.
- **G4 Cleanup**: 이력·권한·자동화 검증 후에만 레거시 필드 비활성화/삭제를 별도 결정.

**전환기 SSOT:** [Taxonomy §8](jira-field-taxonomy.md)의 Manifest에 등재됐다는
이유만으로 Target 분류 권위가 발생하지 않는다. 재조회 검증·원본/영향 보존과 별도
Cutover 승인 이후 Manifest의 `Phase=cutover` 및 `ReadAuthority=target`이 확인된
Issue에 한해 Target 권위다. 미등재/미승인 대상은 Legacy가 권위이고 검증 중인
분류 쓰기는 정지한다. 임의 fallback·dual-write 금지.
Comment/Transition/비분류 Update는 기존 승인 Role·Workflow로 진행하며 신규
분류 필드가 없다고 중단하지 않는다.

기존 v1.1의 **완료된 과거 Issue 전량 Backfill 금지** 유지. RPL 111개를
READ-ONLY로 감사했다는 이유로 111개 모두를 수정할 권한이 생기지 않는다.
대량 이전은 대상·일정·복구·승인 범위가 포함된 별도 Change Gate를 요구한다.

AI는 Jira 원격 쓰기 전 GitHub main의 **현재 승인·발효된 Portfolio 및
AI Session Governance**의 SHA·역할·대상을 확인한다. 신규 Taxonomy는
**승인·발효됐고 대상 Issue/유형의 G0~G4 Cutover가 확인된 경우에만** Target 분류
Write Gate로 적용한다. 미전환 이슈의 기존 승인된 Comment·Link·Transition·비분류
Update는 신규 필드/옵션 미존재만으로 막지 않는다. 정책 또는 해당 쓰기의 권한·
실제 필드 계약 확인이 불가하거나 권위가 충돌하면 **영향받는 쓰기만 중단**하고 보고한다.
원격 쓰기가 금지된 Reviewer/Portfolio Audit은 Jira Comment·Link·Transition도 수행하지 않는다.

## 12. 사용자 흐름

```text
Jira 대상·작업 요청
→ 승인·발효된 현행 Governance SHA·Role 및 대상 Cutover 상태 확인
→ Target로 전환된 유형/Issue에만 승인된 Taxonomy와 Field/Option Metadata 확인
→ 기존 Issue·Parent/Repo/Owner 탐색과 CRUD Scope 검증
→ 필요한 Writer Session의 작업 및 Draft PR
→ Independent Review → 필요 시 Delta Fix
→ Human Approval 및 검수 Head Merge
→ Jira 최소 필드 수정·Evidence 기록·완료 전환
→ 저장값 재조회, 필요 시 Confluence Projection 갱신
```

동일 Jira Issue가 다중 Repo에서 독립 PR을 요구하면 개별 Primary Issue를
분리한다. 예를 들어 Identity 소유 기능이 Carelog에 영향을 준다고
Product를 `identity, carelog` 복수 선택하지 않는다. 필요 시 관련 Issue/Dependency로
구현·검증 단위를 나눠 연결한다.

Jira CRUD 규칙 전문을 매 티켓에 반복 복사하지 않고 승인 문서
[**Jira Field Taxonomy**](jira-field-taxonomy.md)를 참조한다.

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
- 신규 Product/Component/Concern Custom Field Type, Context, Option ID와 Required/default 값
- **RPL은 Team-managed**이므로 현행 기본 Jira `components` 사용은 지원 근거 없이 채택하지 않는다. 신규 커스텀 선택형 필드의 실제 Issue Type별 제공/설정 방법
- Phase 1 Epic의 실제 Scope와 Dependency
- Confluence Page Properties Schema
- Repository 분리 Trigger 충족 여부

## 15. References

- [Jira Field Taxonomy 및 AI CRUD Gate — v1 제안](jira-field-taxonomy.md)

- [AI Session Governance](ai-session-governance.md)
- [ADR-0015](../adr/ADR-0015-platform-communication-messaging-scaling.md)
- [Backend Documentation Ownership](../architecture/backend-service-foundation/documentation-ownership-and-placement.md)
- [Decision Log](../decisions/decision-log.md)
- [Source Inputs Index](../../source-inputs/README.md)
- [Session Handoff Governance](../handoffs/README.md)
- [Supporting Proposed Communication ADR](../../source-inputs/ADR-PROPOSED-공통-MSA-통신-메시징-프로토콜-선택.md)
- [Supporting MSA Platform Design v2](../../source-inputs/Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md)
