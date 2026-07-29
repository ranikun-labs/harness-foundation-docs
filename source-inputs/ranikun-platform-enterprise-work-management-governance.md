# Ranikun Labs 엔터프라이즈급 프로젝트·MSA·지식관리 운영 모델

> 상태: 최종 권고안
> 기준 시점: 2026-07-29
> 적용 범위: Jira `RPL`, Confluence `RLAB`, GitHub, 제품별 Git 문서 Repository, AI 작업 세션
> 운영 전제: 1인 제품·기술 스튜디오, 복수 제품 동시 개발, AI Worker 다중 세션 활용, 현재 물리 배포는 단순하게 유지

---

## 1. 최종 결론

Ranikun Labs는 당분간 **Jira 프로젝트를 제품별로 쪼개지 않고 `RPL` 하나를 유지**한다. 대신 Jira에서 다음 네 축을 표준화한다.

1. `Workstream`: 누가 제품·플랫폼 책임을 소유하는가
2. `Component`: 어느 실행 단위가 바뀌는가
3. `Primary Repository`: 실제 변경의 주 저장소는 어디인가
4. `Area`: 어떤 도메인·기술 책임을 다루는가

도구별 Source of Truth는 다음처럼 고정한다.

| 도구 | 소유 책임 | 핵심 산출물 |
|---|---|---|
| Jira | 실행 작업과 상태 | 담당자, 우선순위, Scope, 의존성, PR, 다음 액션 |
| Git 문서 | Canonical 기술·제품 계약 | ADR, Contract, 데이터 소유권, API·Migration·Fixture 기준 |
| Confluence | 포트폴리오 탐색과 읽기 쉬운 Projection | 제품 상태, 시스템 지도, 결정 요약, 주간 리뷰, Canonical 링크 |
| GitHub | 실제 변경과 검증 Evidence | Commit, Diff, PR, Test 결과, Merge Commit |
| AI Session | 일시적 Working Context | 조사·구현·검수 과정. Durable Truth가 아님 |

핵심 원칙은 다음 한 문장이다.

> **Jira는 일을 소유하고, Git은 사실과 계약을 소유하며, Confluence는 전체 구조를 찾고 이해하게 한다.**

MSA 구조 자체를 Jira 필드에 모두 집어넣지 않는다. 전체 서비스 지도는 Git의 machine-readable catalog와 Confluence의 System Landscape가 소유하고, Jira는 해당 경계를 참조한다.

---

## 2. 현재 상태 진단

### 2.1 잘된 부분

현재 `RPL` 티켓은 최근 작업일수록 다음 정보가 잘 기록돼 있다.

- 목적과 사용자 가치
- 포함 범위와 제외 범위
- 완료 조건
- Repository, Branch, PR, HEAD
- 검증 결과와 미수행 검증
- Finding과 Next Action
- PR Merge 전 완료 금지

`RPL-16`, `RPL-17`, `RPL-18`, `RPL-19`는 새 운영 기준을 상당 부분 반영했다.

### 2.2 구조적 결함

현재 Jira 프로젝트 메타데이터를 조회한 결과 다음 문제가 남아 있다.

| 문제 | 영향 |
|---|---|
| `Workstream`, `Primary Repository`, `Area` Custom Field 없음 | 필터·대시보드·통계가 Description 문자열에 의존 |
| Components 필드는 존재하지만 값이 비어 있음 | FE/BE/Local/Cloud/Docs 구분 불가 |
| 과거 티켓 대부분 Assignee 미지정 | 실제 WIP와 책임자를 빠르게 찾기 어려움 |
| 과거 티켓 대부분 Priority `Medium` | 우선순위가 사실상 무의미 |
| 제품명·Frontend 등을 Label로 혼용 | 분류 체계가 검색어에 따라 흔들림 |
| `완료` 상태가 Jira 내부에서 Done이 아닌 진행 중 Category | 완료율, Epic 진행률, `statusCategory` 기반 필터가 부정확 |
| Shared Identity처럼 논리 경계와 현재 구현 Repository가 다름 | `Carelog / Shared Identity` 같은 복합 표기로 책임이 흐려짐 |
| Architecture·Research·Docs가 제품 티켓과 같은 방식으로만 보임 | Runtime 작업과 Canonical 문서 작업의 차이가 약함 |

### 2.3 현재 WIP 문제

Ranikun Labs의 기존 운영 원칙은 **Portfolio WIP 최대 3개**다. 현재는 `RPL-16`, `RPL-17`, `RPL-19`, `RPL-20` 등이 동시에 활성 상태여서 실질 WIP가 3을 초과한다.

앞으로는 `진행 중 + 검토 중` 합계가 3을 넘지 않도록 한다.

권장 슬롯:

```text
1. Active Product 핵심 작업
2. 다른 Product 또는 Shared Platform 작업
3. Review / Release / Architecture 작업
```

긴급 보안·장애 작업만 예외로 한다.

---

## 3. Ranikun Labs 시스템·MSA 전체 지도

## 3.1 논리 구조

```text
Users / Client Applications
  ├─ Carelog Client
  ├─ Finance Web / Capacitor
  └─ Dev Harness Local CLI

Cloud/API Boundary
  ↓
Spring Cloud Gateway
  ├─ Carelog Core
  ├─ Finance Harness Backend
  ├─ Dev Harness Cloud Control Plane
  ├─ Shared Identity
  └─ Shared AI

Local-only Boundary
  └─ Dev Harness Local Core (`oh-my-ai`)
```

`Spring Cloud Gateway`는 공통 Ingress·Security 계층이지 제품 Workstream이나 5개 핵심 서비스 중 하나가 아니다.

## 3.2 현재와 목표 상태

| Workstream | 논리 경계 | 현재 구현 위치 | 목표 배포 단위 | 데이터 소유권 |
|---|---|---|---|---|
| Carelog | Carelog Core | `care-log/carelog-be` | Carelog Core Service | 고객, Timeline, Follow-up, Handoff, CRM 기록 |
| Finance Harness | Finance Product | `finance-harness-fe`, `finance-harness-docs`; Backend 예정 | Finance Harness Backend | 질문, Checklist, Journal, Review, 금융 도메인 정책 |
| Dev Harness | Local Core + Cloud Control Plane | `oh-my-ai` Local Core | Dev Harness Cloud는 V2 이후 | Task·Session·Handoff·Result Metadata; Local 실행은 사용자 장비 |
| Shared Identity | 공용 인증 경계 | 현재 `carelog-be` 내부 Auth/OAuth 모듈 | 실제 복수 소비자 발생 후 Shared Identity Service | Identity, Credential, OAuth, Token, Product Client |
| Shared AI | 공용 AI 실행 경계 | 계획·설계 단계 | 실제 공통 소비와 비용·정책 요구 확인 후 Shared AI Service | Provider 연동, AI Usage, 공통 실행 정책; 제품 도메인 판단은 소유하지 않음 |
| Platform Foundation | 포트폴리오 Architecture·Governance | Confluence + 임시 `harness-foundation-docs` | Runtime 없음 | 시스템 지도, 공통 ADR, 플랫폼 계약 |

### 핵심 불변조건

- **논리적 책임 분리 ≠ 즉시 물리 MSA 추출**
- 현재 Auth가 `carelog-be`에 있어도 소유 Workstream은 Shared Identity일 수 있다.
- 현재 Repository는 구현 Host일 뿐 장기 도메인 소유권과 동일하지 않을 수 있다.
- Finance와 Dev Harness는 Carelog의 하위 제품이 아니다.
- Shared Identity와 Shared AI는 실제 복수 소비자·운영 필요가 확인된 범위만 물리화한다.
- Shared Commerce는 아직 Active Workstream으로 만들지 않는다. 실제 결제·Entitlement 소비가 시작될 때 등록한다.

## 3.3 동기·비동기 통신 기본값

현재 단일 Mac mini·서비스별 소수 인스턴스 환경에서는 다음을 기본값으로 유지한다.

```text
외부 API                   HTTP/JSON
내부 일반 동기 호출       HTTP/JSON
AI 응답 스트리밍          SSE
감사·후처리·상태 전파     NATS JetStream
고빈도·대용량 내부 통신   필요가 입증된 뒤 gRPC
대규모 Event Platform     Kafka 필요성이 입증된 뒤 검토
```

이 표는 Jira 티켓별 구현 선택이 아니라 Platform Foundation의 Canonical ADR이 소유해야 한다.

---

## 4. Jira 정보 구조

## 4.1 `RPL` 단일 프로젝트 유지

현재 규모에서 제품별 Jira 프로젝트 분리는 과설계다.

단일 프로젝트 유지 이유:

- 실제 작업자는 한 명이며 Assignee·Workflow·권한이 동일함
- Shared Identity·Shared AI와 제품 간 의존성을 한 보드에서 봐야 함
- 제품별 이슈 수가 아직 별도 프로젝트 운영 비용을 정당화하지 않음
- AI 세션이 한 프로젝트의 공통 운영 규칙을 재사용할 수 있음

다음 조건 중 두 개 이상이 충족될 때 프로젝트 분리를 재검토한다.

1. 제품별 독립 팀 또는 외부 협업자가 생김
2. 제품별 권한·보안 정책이 달라짐
3. 서로 다른 Release Train과 Workflow가 필요함
4. Workstream별 Active Issue가 장기간 100개 이상 유지됨
5. 별도 SLA·Compliance·고객 대응 프로세스가 필요함

## 4.2 필수 필드

### A. Workstream — 신규 Single Select

작업의 **최종 소유 책임**을 나타낸다.

허용값:

```text
Carelog
Finance Harness
Dev Harness
Shared Identity
Shared AI
Platform Foundation
```

규칙:

- 정확히 하나만 선택한다.
- `Carelog / Shared Identity`처럼 복수 값을 넣지 않는다.
- 영향을 받는 다른 Workstream은 Linked Issue 또는 `Affected Workstreams` 설명으로 연결한다.
- `Documentation`은 Workstream이 아니다.

### B. Components — Jira Built-in 사용

실제 변경 Surface를 나타낸다. Custom Field를 새로 만들지 않고 기존 `Components`를 활성화한다.

권장값:

```text
Frontend
Backend
Local Runtime
Cloud Control Plane
Gateway / Ingress
Shared Service
Documentation
```

규칙:

- 원칙적으로 Primary Component 하나만 지정한다.
- 진짜 교차 경계 작업일 때만 둘 이상 사용한다.
- Test·Research는 Component가 아니라 Issue Type 또는 Area다.

### C. Primary Repository — 신규 Single Select

실제 변경이 이루어지는 주 Repository를 나타낸다.

초기값:

```text
care-log/carelog-be
aixion1506/finance-harness-fe
aixion1506/oh-my-ai
aixion1506/harness-foundation-docs
aixion1506/finance-harness-docs
ranikun-platform-docs (생성 후)
No Repository / Confluence-only
```

복수 Repository 조사에서는 하나를 Primary로 정하고 나머지는 Description의 `Related Repositories`에 쓴다.

### D. Area — 신규 Single Select

기술·도메인 책임을 검색 가능한 수준으로만 구분한다.

초기값:

```text
Auth / Identity
CRM Core
Finance UI
Finance Domain
Context / Handoff
Git / Workspace Safety
AI Runtime
Integration / Messaging
Architecture / Documentation
Data / Migration
Release / Operations
```

Area를 지나치게 세분화하지 않는다. `OAuth`, `PKCE`, `Client Registry` 같은 세부어는 Label 또는 Summary에 둔다.

## 4.3 Description에 남길 구조적 Metadata

다음은 모든 티켓에 Custom Field로 만들 필요가 없지만, Runtime·Architecture 작업에는 중요하다.

```text
Logical Service Boundary:
Current Implementation Host:
Target Deployment Unit:
Related Repositories:
Canonical Git Document:
Confluence Summary:
```

예: `RPL-16`

```text
Workstream: Shared Identity
Component: Backend
Primary Repository: care-log/carelog-be
Area: Auth / Identity

Logical Service Boundary: Shared Identity
Current Implementation Host: Carelog Backend
Target Deployment Unit: Shared Identity Service — deferred until multi-product consumption
Affected Workstream: Carelog
```

이 구조로 `현재 어디에 코드가 있는가`와 `누가 장기 책임을 소유하는가`를 분리한다.

## 4.4 Label 정책

Label은 제품·Repository·Component 분류에 사용하지 않는다.

허용 예:

```text
oauth
security
msa
data-integrity
runtime-codex
runtime-claude
mobile
capacitor
migration
release-gate
deferred
```

금지 예:

```text
finance-harness
frontend
carelog-backend
dev-harness
```

이 값들은 Workstream·Component·Repository 필드가 소유한다.

## 4.5 Issue Type 정책

| Issue Type | 사용 기준 | 예시 |
|---|---|---|
| Epic | 하나의 결과·마일스톤 | Finance STEP 9 UI, Shared Identity Foundation |
| 기능 | 사용자에게 보이는 Vertical Slice | Home UI, OAuth 로그인 |
| 작업 | 구현·검증·문서 작성 | Client Registry, Fixture 보강 |
| Research | 시간 제한이 있는 조사·결정 | PKCE 지원 범위, Messaging ADR |
| Tech Debt | 비차단 품질 부채 | Report 표현 대칭성 |
| 버그 | 이미 기대한 동작의 결함 | stale remote 오판 |
| 하위 작업 | 동일 Issue·PR 안의 작은 실행 단위 | 필요한 경우만 사용 |

`스토리`는 현재 `기능`과 의미가 겹치므로 사용을 중단한다. 별도 팀이 생길 때 재검토한다.

## 4.6 Epic 정책

Epic은 제품 전체를 무기한 담는 폴더가 아니라 **완료 가능한 결과 단위**다.

권장 Epic:

```text
Carelog Authentication Foundation
Finance STEP 9 Core UI
Finance STEP 10 Form & Persistence
Dev Harness V1.x Safe Work & Context Continuity
Shared Identity Foundation
Platform Architecture Baseline
```

권장 재배치:

| Issue | 권장 Parent |
|---|---|
| RPL-1~7 | Carelog Authentication Foundation (`RPL-1` 유지 가능) |
| RPL-9,12,15,19 | Finance STEP 9 Core UI (`RPL-8`) |
| RPL-18 | 신규 Finance STEP 10 Epic으로 이동 |
| RPL-10,11,16 | Shared Identity Foundation |
| RPL-13,17 | Dev Harness V1.x Safe Work & Context Continuity |
| RPL-14,20 | Platform Architecture Baseline |

## 4.7 Workflow

현재 네 단계면 충분하다.

```text
할 일
→ 진행 중
→ 검토 중
→ 완료
```

필수 수정:

- `완료` 상태를 Jira의 **Done Category**로 매핑한다.
- 현재처럼 `완료`가 진행 중 Category이면 완료율·Epic 진행률·JQL 결과가 틀어진다.

차단은 별도 Status를 만들기보다 Built-in `Flagged = Impediment`를 사용한다. 차단이 풀리면 기존 진행 단계로 돌아가기 쉽다.

상태 규칙:

| 상태 | 조건 |
|---|---|
| 할 일 | Scope가 정의됐지만 Writer 작업 시작 전 |
| 진행 중 | 구현·조사·문서 작성 Writer가 실제 작업 중 |
| 검토 중 | Draft PR 또는 검토 가능한 문서가 있고 독립 검수 대기·진행 중 |
| 완료 | PR Merge 또는 Research Decision 반영·최종 Evidence 확인 완료 |

Research도 단순 보고서 작성으로 완료하지 않는다. Canonical 문서 또는 후속 Decision에 결과가 반영돼야 완료다.

## 4.8 Assignee

- `진행 중`, `검토 중`: 박성환 필수
- `할 일`: 미지정 가능
- `완료`: 기존 Assignee 유지
- AI Runtime은 Assignee가 아니다.

AI 사용 정보는 Label 또는 댓글로만 기록한다.

## 4.9 Priority

| Priority | 사용 기준 |
|---|---|
| Highest | 보안 노출, 데이터 손실, 잘못된 Merge, Production Incident, Release Blocker |
| High | 현재 마일스톤 Critical Path |
| Medium | 일반 예정 기능·문서 |
| Low | 비차단 Tech Debt, 표현·정리 |

현재 모든 티켓을 일괄 High로 올리지 않는다. 활성화되는 시점에 실제 Critical Path를 기준으로 보정한다.

## 4.10 Fix Version / Milestone

Fix Version은 제품별 Release나 명시적 마일스톤이 있을 때만 사용한다.

예:

```text
Carelog MVP-Auth
Finance STEP-9
Finance STEP-10
Dev Harness V1.1
Platform Architecture Baseline
```

Due Date는 외부 약속·면접·공식 Release처럼 실제 기한이 있을 때만 쓴다.

## 4.11 의존 관계

Parent는 Epic 소속만 표현한다. 기술적 선후관계는 Issue Link를 사용한다.

```text
blocks / is blocked by
relates to
implements
supersedes
```

예:

```text
RPL-16 implements RPL-11 decision
RPL-20 supersedes product-local messaging assumptions
RPL-17 relates to completed RPL-13 Git safety gate
```

---

## 5. Jira 티켓 표준 Template

```markdown
Workstream:
Component:
Primary Repository:
Area:

Assignee:
Priority:
Target Milestone:

Logical Service Boundary:
Current Implementation Host:
Target Deployment Unit:
Related Repositories:

Base Branch:
Working Branch:
PR:
Current HEAD:

Canonical Git Document:
Confluence Summary:

## 목적

## 사용자 또는 운영 가치

## Scope

## Out of Scope

## Dependencies

## Acceptance Criteria

## Verification

## Known Findings / Risks

## Next Action
```

규칙:

- Custom Field에 이미 있는 값도 Description 상단에 반복하지 않아도 된다.
- AI Worker에 전달할 때는 필드 값을 Prompt에 포함한다.
- PR·HEAD·Verification은 단계가 바뀔 때 댓글로 갱신한다.
- Merge 전에는 완료로 전환하지 않는다.

---

## 6. Confluence 운영 모델

현재 구조는 유지한다.

```text
Ranikun Labs
├─ 00. Portfolio Overview
├─ 01. Products
│  ├─ Carelog
│  ├─ Dev Harness
│  └─ Finance Harness
├─ 02. Shared Platform
│  ├─ Shared Identity
│  └─ Shared AI
├─ 03. Architecture
├─ 04. Decisions
└─ 05. Weekly Reviews
```

## 6.1 새로 추가할 핵심 페이지

`03. Architecture` 아래에 `System Landscape` 페이지 하나를 추가한다.

필수 표:

| Workstream | Type | Logical Boundary | Current Host | Target Deployment | Repository | Data Owner | Status | Canonical Git Docs |
|---|---|---|---|---|---|---|---|---|

이 페이지가 MSA 전체를 한 번에 이해하는 사람용 Projection이다.

## 6.2 제품·Shared Platform 페이지 공통 구조

각 페이지 상단에 Page Properties를 둔다.

```text
Type:
Workstream:
Owner:
Current Stage:
Current Milestone:
Primary Repositories:
Logical Services:
Shared Dependencies:
Jira Filter:
Canonical Git Sources:
Last Reviewed:
```

Portfolio Overview는 Page Properties Report로 이를 집계한다.

## 6.3 Confluence에 쓰지 않을 내용

다음은 Git 문서 전체를 복사하지 않는다.

- 상세 API Schema
- Migration SQL
- Runtime Contract 전체
- Fixture Assertion 전체
- 긴 ADR 원문
- Branch·Commit별 검증 로그

Confluence에는 결정 요약과 Canonical Git 링크만 둔다.

## 6.4 Decision Projection

Confluence Decision 페이지는 다음만 소유한다.

```text
Decision ID
Status
문제
결정 요약
영향 Workstream
Canonical Git ADR
관련 Jira
구현 PR
Superseded By
```

상세 규칙과 불변조건은 Git ADR이 소유한다.

## 6.5 Weekly Review

매주 금요일 Jira와 GitHub 결과를 기준으로 작성한다.

```text
1. 이번 주 Outcome
2. Workstream별 WIP
3. Merge된 PR
4. 차단·위험
5. 새 Decision
6. 다음 주 Portfolio WIP 3개
```

티켓 본문을 복사하지 않고 Jira Filter와 PR 링크를 사용한다.

---

## 7. Git 문서 운영 모델

## 7.1 Repository별 책임

| Repository | Canonical 책임 |
|---|---|
| `care-log/carelog-be` | Carelog 구현 Architecture, API, Auth/OAuth 현재 계약, Migration, Runbook |
| `aixion1506/finance-harness-fe` | FE Route·UI State·API Adapter·Capacitor 구현 계약 |
| `aixion1506/finance-harness-docs` | Finance Lens, PolicyGuard, Routing, Fixture, Legal/Ops |
| `aixion1506/oh-my-ai` | 실제 지원 Runtime, Hook, Skill, CLI, Install, Runtime Evidence |
| `aixion1506/harness-foundation-docs` | Dev Harness 제품·공통 Harness Contract·Roadmap |
| `ranikun-platform-docs` | 제품 간 공통 Architecture, Shared Identity·Shared AI, 공통 통신·데이터 소유권 |

## 7.2 `ranikun-platform-docs` 생성 권고

Shared Identity·Shared AI·공통 Messaging ADR은 Dev Harness 전용 `harness-foundation-docs`가 장기 소유하면 경계가 뒤틀린다.

최종 구조:

```text
ranikun-platform-docs/
├─ README.md
├─ catalog/
│  └─ system-catalog.yaml
├─ docs/
│  ├─ architecture/
│  │  └─ system-landscape.md
│  ├─ decisions/
│  └─ contracts/
└─ templates/
```

현재 진행 중인 `RPL-20`을 중간에 강제로 옮기지 않는다.

단계:

1. `RPL-20`은 `harness-foundation-docs`에서 완료
2. 문서 Front Matter에 `canonical_owner: platform-foundation`, `temporary_authoring_repository` 기록
3. 다음 Cross-product ADR 전에 `ranikun-platform-docs` 생성
4. 공통 문서만 History를 보존해 이관
5. 기존 경로에는 Redirect 문서 유지

## 7.3 AI용 System Catalog

`catalog/system-catalog.yaml`을 AI가 처음 읽는 Portfolio Index로 사용한다.

```yaml
schema_version: 1
systems:
  - id: carelog
    kind: product
    workstream: Carelog
    logical_boundaries:
      - carelog-core
    current_hosts:
      - repository: care-log/carelog-be
    confluence: Carelog

  - id: shared-identity
    kind: shared-platform
    workstream: Shared Identity
    logical_boundaries:
      - shared-identity
    current_hosts:
      - repository: care-log/carelog-be
        module: auth-oauth
    target_deployment: deferred-until-multi-product-consumption
    consumers:
      - Carelog
      - Finance Harness
      - Dev Harness
```

Catalog에는 Secret·Host/IP·운영 Credential을 넣지 않는다.

## 7.4 문서 Front Matter

```yaml
---
id: DEC-PLATFORM-001
title: 공통 통신·메시징 기본값
status: accepted
workstream: Platform Foundation
area: Integration / Messaging
logical_systems:
  - shared-identity
  - shared-ai
jira:
  - RPL-20
confluence: 03. Architecture
implementation_repositories:
  - care-log/carelog-be
  - aixion1506/oh-my-ai
supersedes: []
last_verified_at: 2026-07-29
last_verified_commits: {}
---
```

본문 순서:

```text
Context
Decision
Responsibilities
Data Flow
Invariants
Failure Policy
Out of Scope
Verification
Migration
References
```

## 7.5 Source of Truth 우선순위

충돌 시 다음 순서로 판정한다.

```text
1. Accepted Git Decision / ADR
2. Canonical Git Contract·Architecture
3. Canonical Product Repository 문서
4. Confluence Specification / Projection
5. Jira Ticket
6. Handoff Candidate
7. Current Conversation
```

Jira가 Canonical 문서와 충돌하면 구현을 계속하지 않고 티켓 또는 문서를 정정한다.

---

## 8. GitHub PR 운영

PR은 다음을 반드시 포함한다.

```text
Jira Issue
Workstream
Primary Repository
Scope / Out of Scope
Base / Head
Canonical Docs
Verification Performed
Verification Not Performed
Known Findings
Merge Method
```

작업 흐름:

```text
Jira Issue 확정
→ Branch / Worktree
→ Draft PR
→ Jira 진행 중
→ 구현·검증
→ Jira 검토 중
→ 독립 검수
→ Ready
→ 일반 Merge Commit
→ Merge Commit 검증
→ Jira 완료
```

구현 Worker와 독립 Reviewer는 분리한다.

---

## 9. AI 작업 세션 운영

## 9.1 세션 시작 Context Bundle

AI는 모든 문서를 무작정 읽지 않는다. 다음 순서로 읽는다.

```text
1. Jira Issue
2. system-catalog.yaml의 해당 Workstream·System
3. 티켓에 연결된 Canonical Git 문서
4. 해당 Repository의 README·CONTRIBUTING·로컬 규칙
5. Branch·HEAD·Working Tree·PR
```

## 9.2 세션 책임

| 세션 유형 | Jira 쓰기 | Git 쓰기 | 승인 범위 |
|---|---:|---:|---|
| 구현·보정 | 자기 Issue만 | 허용된 Branch만 | Commit·Push·Draft PR까지 |
| 독립 검수 | 금지 | Read-only | Finding과 Verdict만 |
| Merge Gate | 자기 Issue | PR Ready·Merge만 | 검수된 Head와 Base 고정 |
| PM·Architecture | 관련 Research/Docs Issue | 문서 Branch만 | 코드·Runtime 수정 금지 |

## 9.3 세션 종료 조건

모든 세션은 다음을 보고한다.

```text
Issue Key
Workstream / Component / Repository / Area
Branch / PR / HEAD
Performed
Not Performed
Findings
Working Tree
Jira Update
Next Single Action
```

AI가 수행하지 않은 테스트를 PASS로 표현하면 안 된다.

---

## 10. 보드·필터·대시보드

## 10.1 단일 Kanban Board

하나의 보드를 유지하고 Quick Filter로 나눈다.

```text
Carelog
Finance Harness
Dev Harness
Shared Platform
Platform Foundation
My WIP
In Review
Blocked
Documentation
```

Swimlane은 Epic을 기본으로 한다.

## 10.2 권장 JQL

### 전체 WIP

```jql
project = RPL
AND status in ("진행 중", "검토 중")
ORDER BY priority DESC, updated DESC
```

### 내 WIP

```jql
project = RPL
AND assignee = currentUser()
AND status in ("진행 중", "검토 중")
ORDER BY priority DESC, updated DESC
```

### Metadata 누락

```jql
project = RPL
AND status in ("진행 중", "검토 중")
AND (
  assignee is EMPTY
  OR "Workstream" is EMPTY
  OR component is EMPTY
  OR "Primary Repository" is EMPTY
  OR "Area" is EMPTY
)
```

### Shared Platform

```jql
project = RPL
AND "Workstream" in ("Shared Identity", "Shared AI")
AND statusCategory != Done
ORDER BY priority DESC
```

### 문서·Architecture

```jql
project = RPL
AND component = Documentation
AND statusCategory != Done
ORDER BY updated DESC
```

### Merge 대기

```jql
project = RPL
AND status = "검토 중"
ORDER BY priority DESC, updated ASC
```

### 차단

```jql
project = RPL
AND Flagged = Impediment
ORDER BY priority DESC
```

## 10.3 Dashboard

최소 Gadget:

1. Workstream별 Active Issue 수
2. Priority별 WIP
3. 검토 중 목록
4. Metadata 누락 목록
5. 최근 완료 14일
6. Flagged Issue

---

## 11. 현재 티켓 보정안

| Issue | Workstream | Component | Primary Repository | Area | 조치 |
|---|---|---|---|---|---|
| RPL-16 | Shared Identity | Backend | `care-log/carelog-be` | Auth / Identity | `Carelog / Shared Identity` 복합 표기를 단일 소유권으로 정리 |
| RPL-17 | Dev Harness | Local Runtime | `aixion1506/oh-my-ai` | Context / Handoff | 현재 기준 대체로 적절 |
| RPL-18 | Finance Harness | Frontend | `aixion1506/finance-harness-fe` | Finance UI | STEP 10 Epic 생성 후 Parent 이동 |
| RPL-19 | Finance Harness | Frontend | `aixion1506/finance-harness-fe` | Finance UI | 진행 중 유지, Product·Frontend Labels는 필드 전환 후 제거 가능 |
| RPL-20 | Platform Foundation | Documentation | `aixion1506/harness-foundation-docs` 임시 | Architecture / Documentation | Assignee, Metadata, Canonical Owner 보강 |
| RPL-10 | Shared Identity | Documentation | `care-log/carelog-be` | Auth / Identity | 완료된 호환성 조사로 유지 |
| RPL-11 | Shared Identity | Documentation | `care-log/carelog-be` | Auth / Identity | Summary를 `Shared Identity Consumer Contract 핵심 결정 승인`으로 변경 |
| RPL-8 | Finance Harness | Frontend | `finance-harness-fe` | Finance UI | 하위 작업 진행에 맞춰 Epic 상태를 진행 중으로 정렬 |

완료 티켓 전체를 지금 일괄 수정하지 않는다. 다시 활성화되거나 Weekly Review에서 필요할 때 점진 보정한다.

---

## 12. 단계별 도입 계획

## Phase 0 — 즉시

1. Jira `완료` Status를 Done Category로 수정
2. `Workstream`, `Primary Repository`, `Area` Single Select 생성
3. Built-in Components 값 등록
4. `RPL-16~20` 활성 티켓만 보정
5. Portfolio WIP를 3개로 축소

## Phase 1 — 현재 마일스톤

1. Dev Harness V1.x Epic 생성 후 `RPL-13`, `RPL-17` 연결
2. Shared Identity Foundation Epic 생성 후 `RPL-10`, `RPL-11`, `RPL-16` 연결
3. Platform Architecture Baseline Epic 생성 후 `RPL-14`, `RPL-20` 연결
4. Finance STEP 10 Epic 생성 후 `RPL-18` 이동

## Phase 2 — Confluence Projection

1. `03. Architecture / System Landscape` 생성
2. 제품·Shared Platform 페이지에 공통 Page Properties 추가
3. Portfolio Overview에서 자동 집계
4. Jira Saved Filter 링크 추가

## Phase 3 — Git Canonical Platform Docs

1. `ranikun-platform-docs` 생성
2. `system-catalog.yaml` 작성
3. Shared Identity·Shared AI·공통 Messaging ADR 이관
4. Confluence Decision을 Git ADR Index로 전환

## Phase 4 — 점진 Backfill

- 과거 완료 티켓은 일괄 Rewrite하지 않는다.
- 다시 참조되거나 Follow-up이 생긴 티켓만 Metadata를 보정한다.
- 오래된 Label은 필드 기반 검색이 안정된 뒤 제거한다.

---

## 13. 과설계 방지선

지금 하지 않는다.

- 제품별 Jira 프로젝트 분리
- Workstream마다 별도 Workflow
- AI 모델별 Assignee·Custom Field
- Branch·PR·HEAD 전용 Custom Field 다수 생성
- 모든 문서를 Confluence와 Git에 이중 작성
- 물리 MSA 분리 계획을 Jira 구조와 동일시
- 모든 완료 티켓 일괄 수정
- Story Point·Sprint 강제
- Shared Commerce를 실제 요구 전에 활성 Workstream으로 추가

---

## 14. 운영 품질 Gate

신규 Issue는 다음을 만족해야 `진행 중`으로 전환할 수 있다.

```text
Canonical Issue 검색 완료
Workstream 지정
Component 지정
Primary Repository 지정
Area 지정
Assignee 지정
Priority 지정
Scope / Out of Scope 존재
Base / Branch / PR 상태 기록
Canonical Git Document 또는 Not Applicable 기록
```

Merge 전에 다음을 만족해야 한다.

```text
독립 검수 Blocker/Major 0
검수된 Head와 PR Head 일치
필수 Verification PASS
Not Performed 명시
PR 일반 Merge Commit
Merge Commit 확인
Jira 최종 댓글
Done 전환
```

---

## 15. 최종 운영 모델

```text
Ranikun Labs Portfolio

Git: ranikun-platform-docs
  └─ System Catalog / Cross-product ADR / Shared Platform Contracts

Confluence: RLAB
  └─ Portfolio / Products / Shared Platform / Architecture / Decisions / Weekly Reviews

Jira: RPL
  └─ Workstream / Component / Repository / Area / Epic / Issue / Status

GitHub
  └─ Product Repository / Commit / PR / Test / Merge Evidence
```

최종 권고:

> **하나의 RPL 실행 보드에서 Workstream과 Component로 전체 포트폴리오를 관리하고, MSA와 데이터 소유권은 `ranikun-platform-docs`의 System Catalog가 Canonical하게 관리하며, Confluence는 이를 사람이 한눈에 이해하는 Portfolio Projection으로 제공한다.**

이 구조는 현재 1인 운영 비용을 낮게 유지하면서도, 이후 팀·서비스·Repository가 늘어날 때 동일한 분류 체계를 그대로 확장할 수 있다.

---

## Appendix A. 현재 주요 링크

- Jira: `Ranikun Platform (RPL)`
- Confluence Home: `Ranikun Labs`
- Portfolio: `00. Portfolio Overview`
- Products: `01. Products`
- Shared Platform: `02. Shared Platform`
- Architecture: `03. Architecture`
- Decisions: `04. Decisions`
- Weekly Reviews: `05. Weekly Reviews`

## Appendix B. 운영 결정 체크리스트

```text
[ ] 완료 Status가 Done Category인가
[ ] Workstream Custom Field가 있는가
[ ] Components 값이 등록됐는가
[ ] Primary Repository Custom Field가 있는가
[ ] Area Custom Field가 있는가
[ ] 활성 WIP가 3개 이하인가
[ ] 활성 Issue의 Assignee가 지정됐는가
[ ] Epic이 완료 가능한 Outcome 단위인가
[ ] Confluence가 Canonical 문서를 복제하지 않고 링크하는가
[ ] Git 문서에 Jira·Confluence·Workstream Metadata가 있는가
[ ] AI 세션이 자기 Issue만 수정하는가
[ ] 독립 검수와 구현 세션이 분리되는가
```
