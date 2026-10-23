---
title: Ranikun Labs Jira Field Taxonomy and AI CRUD Gate
version: "1.0"
document_status: accepted
decision_status: accepted
owner_approval_status: approved
owner_approval_ref: docs/governance/jira-governance-owner-approval-2026-10-15.md
g0_owner_classification_status: approved
g0_owner_classification_date: "2026-10-15"
g0_owner_classification_ref: docs/governance/jira-taxonomy-g0-owner-decision-2026-10-15.md
implementation_status: not_started
owner: governance
approved_at: "2026-10-15"
effective_from: "2026-10-15T15:03:00+09:00"
merge_commit_sha: "3faf402a8603aa87449070ba0833b862df46bd3f"
merged_at: "2026-10-15T15:03:00+09:00"
final_metadata_review_status: passed_independent_sol_user_reported
final_metadata_reviewed_head: "7387371319bb7c5b841e4363e05f3bb848f8ed4b"
merge_gate_status: completed
related_documents:
  - docs/governance/portfolio-work-management-governance.md
  - docs/governance/ai-session-governance.md
  - docs/governance/jira-taxonomy-g0-owner-decision-2026-10-15.md
  - docs/governance/jira-governance-owner-approval-2026-10-15.md
---

# Jira Field Taxonomy & AI CRUD Gate — v1.0 (정책 main 발효 / Jira 실행 상태는 Current Projection 참조)

> **2026-10-23 최신 G2 실행 Projection:** [RPL 전체 118/118 데이터 이전 완료](jira-g2-migration-completion-projection-2026-10-23.md). 이 문서에 남아 있는 2026-10-15·2026-10-21 수치와 `implementation_status: not_started`는 당시 승인/실행 기록이며 소급 변경하지 않는다. **현재 G3 신규 생성·권위 전환은 별도 승인 전까지 OFF**다.

> **Owner 최종 승인과 Sol Delta PASS를 거쳐 [PR #38](https://github.com/ranikun-labs/harness-foundation-docs/pull/38)이 [Merge Commit `3faf402a`](https://github.com/ranikun-labs/harness-foundation-docs/commit/3faf402a8603aa87449070ba0833b862df46bd3f)으로 2026-10-15 15:03 KST `main`에 병합되어 정책 발효됐다.** [전체 Owner 승인](jira-governance-owner-approval-2026-10-15.md)과 [G0 승인](jira-taxonomy-g0-owner-decision-2026-10-15.md)은 별도 근거다. **정책 발효 ≠ Jira Field/Option 적용·Issue Migration·Pilot 완료.** `implementation_status: not_started`는 **2026-10-15 승인 당시 정책 메타데이터의 역사 기록**으로 보존하며, G1~G4의 개별 승인 Gate는 유지한다. **2026-10-21 G1·G2 실행 결과는 [Current Status Projection](jira-g2-migration-status-projection-2026-10-21.md)을 따른다.**

## 1. 목적과 책임

단일 Jira 프로젝트 `RPL`에서 제품·시스템의 **주 소유권**을 명확히 하고, GPT/Codex를 포함한 모든 Jira Writer가 동일한 허용값과 검증 계약을 사용한다.

- **Product = 하나의 주 소유 시스템(책임 원칙: 정확히 하나).** 논리적 Owner 규칙과 Jira 필드 저장/필수 여부를 구별하며, 실제 적용은 Issue Type별 지원 상태와 G0~G4 Cutover Gate를 따른다. 구현 Host·Repository·영향받는 제품과 혼동하지 않는다.
- **Component = 작업의 주 기술 영역(책임 원칙: 대표 영역 하나).** 해당 Jira Issue Type에 실제 필드가 지원되는 경우에만 저장/필수화를 적용한다. 도메인·모듈·기술 스택 이름을 넣지 않는다.
- **Concern = 공통 기술 관심사(선택, 중복 없이 최대 3개).** 상태·우선순위·제품·작업유형을 복제하지 않는다.
- **Parent/Epic = 상위 목표**, **Issue Link = 실제 작업 간 의존성/관련성**. 영향을 받는 Product 자체를 단순히 이슈 링크로 표현했다고 주장하지 않는다.
- **Primary Repository = 주 코드·문서 변경과 Merge Evidence 저장소**. 여러 저장소가 별도 독립 Merge Gate를 가지면 하위 티켓을 분리한다.
- **Area**는 기존 Governance의 기술·책임 영역 목록이다. `Component`·`Concern`과 중복하므로 별도 Jira 필수 필드로 확대하지 않고 기존 역사적 기록은 보존한다. 필요한 경우 기술 검색은 Component/Concern을 우선한다.
- **Affected Products**의 별도 다중 선택 필드 신설은 보류한다. 대신 여러 제품에 걸친 Issue는 §2.1의 **기계적으로 판독 가능한 영향 기록 계약**을 사용한다. Issue Link는 실제 Task 관계만 표현하며, 그 자체로 Product 영향을 증명하지 않는다.

## 2. Product: Owner 승인된 논리적 허용값 (2026-10-15 G0 당시 Jira Dropdown 미적용)

| 값 | 논리적 책임 | 유의사항 |
|---|---|---|
| `carelog` | Carelog CRM Product | Carelog가 AI·Identity를 **소비**하는 제품 기능은 carelog가 소유 |
| `finance` | Finance Product | 기존 `finance-harness` Jira 값의 새 명칭. Repo/서비스명은 변경하지 않음 |
| `gateway` | SCG, 라우팅, RateLimiter, Gateway 정책 | 프레임워크가 아니라 논리 Gateway 책임 |
| `identity` | PlatformAccount, Login, OAuth, Session, SSO | Carelog Product User/CRM Customer 소유권과 혼동 금지 |
| `ai` | 공용 AI, RAG, Retriever·Model·Tool 실행 | 기존 `shared-ai` Jira 값의 새 명칭. Runtime 기술 선택을 뜻하지 않음 |
| `audit` | 공통 감사 이벤트·내구성·계약 | 코드 존재와 운영 배포/transport 제공을 분리 |
| `commerce` | Subscription, Billing, Payment, Refund | **예약 값**. G0 논리 분류에는 포함되지만 별도 활성화·Scope 승인 전 신규 운영 티켓 선택에 사용하지 않음 |
| `platform-foundation` | 공통 아키텍처/운영 기반/거버넌스/Host Foundations | 아무 Product도 찾지 못했을 때 넣는 '기타' 아님 |
| `dev-harness` | AI 개발 하네스·코딩 에이전트·개발 세션 도구 | |

`shared-platform`은 논리적 Portfolio **그룹명**이며 Product 옵션이 아니다. `platform-core`도 JVM/Host 이름이지 Product가 아니다. 같은 `platform-services` Repo에 있더라도 기능 소유권에 따라 `identity`, `ai`, `audit` 등을 선택한다.

Product 변경은 단순 문자열 치환이 아니라 **소유권 이동**이다. 티켓의 제목, 상위 Epic, 실제 코드 및 승인된 ADR을 근거로 판정한다. G0 Owner 승인 범위는 논리 Product **9개(일반 적용 후보 8개 + `commerce` 예약 1개)**이며, Jira 실제 옵션·유형별 필드 사용 가능 여부와 단계별 Cutover 승인은 별도다.

### 2.1 Cross-product Epic/Issue의 대표 Owner와 영향 관계 (F3)

**확정:** 하나의 Issue에는 대표 Product Owner를 **하나만** 둔다. 다중 Product Epic에도 동일하다. 자식 Task는 각각 실제 소유 Product로 구분할 수 있으며, Epic의 Product와 같아야 하는 것은 아니다.

**Owner 승인 전 단계:** 초안 작성자는 Epic의 *단일 책임 시스템*을 후보로 제안할 수 있으나, 다중 제품 프로그램의 실제 대표 Owner는 **Human Portfolio/Product Owner가 근거를 확인하고 명시 승인**한다. 선택 기준은 (1) 목표·완료 기준/Acceptance를 최종 책임지는 시스템, (2) 변경 계약의 관리 주체, (3) 실패/운영 후속 책임이다. 단순히 하위 Task 수가 많거나 첫 번째로 나열된 Product, Repository 이름만으로 선택하지 않는다. Owner 판단이 불명확하면 **Product 자동 이전·삭제·신규 Target 분류 전환을 중단**하고 결정 대기 상태로 보고한다. 기존 이슈의 무관한 Comment/Transition을 중단시키지는 않는다.

**영향 보존 최소 계약(전용 Jira 필드 생성 전):** Jira Description에 아래 고정 섹션을 두되, 자유 문구만 남기지 않는다. 이는 정식 Affected Products 전용 필드와 동일한 Jira 검색/검증 기능을 보장하지 않는다.

```text
### Cross-product ownership (Jira migration proposal)
Primary Product: <approved-one-value | PENDING_OWNER_DECISION>
Owner Decision: <approver, evidence ref, date | PENDING>
Affected Products:
  - <canonical-product-id>: <consumer|producer|cutover|dependency|migration|other>
    Evidence: <ticket/ADR/API contract ref>
    Related Issue: <RPL-... | none; reason>
```

- Affected Products는 **정규화된 Product 식별자 + 관계 의미 + 근거**를 최소 하나의 독립된 항목으로 기록하며, 중복을 제거한다. **Owner Product 자체는 Affected 목록에서 제외**한다.
- Related Issue는 실제 구체적 의존·전환 Task가 존재할 때만 연결한다. 관계가 없어도 `none; reason`을 남겨 부재를 숨기지 않는다.
- 변환/정리 시 원본 복수 Product 값이 나타낸 영향이 위 기록으로 전부 보존됐는지 확인한다. **원본 복수값 제거는 Human 승인 및 필드·Description 스냅샷, 보존 검증 이후만 허용**한다.
- 대표 사례 `RPL-51`: **G0 Owner 결정에 의해 대표 Product는 `platform-foundation`으로 승인**됐다. 영향 Product는 `gateway`(`RPL-53`), `identity`(`RPL-54`), `carelog`(`RPL-55`)이며, 각 관계 의미·현행 Jira Link·Evidence는 실제 이전 시 재검증한다. **2026-10-15 G0 당시** 이는 대표 Product 후보 승인일 뿐 `RPL-51` Jira 수정/이전 승인이 아니었다. 당시 원본 Product/Component 다중값과 Description은 Pilot·Snapshot·별도 Owner 승인 없이 삭제할 수 없었으며 **Component 대표값도 미결정**이었다. **2026-10-21 Batch 3**에서는 별도 Owner 승인·Before/After 증거와 Changelog `10974`에 따라 `platform-foundation/backend` Target 저장·검증을 완료했다([현재 Projection](jira-g2-migration-status-projection-2026-10-21.md)). 다른 Cross-product Epic은 개별 Human Owner 결정이 필요하다.
- 일반적인 Cross-product Issue의 Owner 결정이 아직 없는 경우 후보값은 제안이며 Jira에 쓰지 않는다. RPL-51의 **G0 대표값 승인 자체는** Jira 원격 쓰기 권한을 부여하지 않는다. 이는 추가 필드 생성 없이 시작할 수 있는 표현 계약 후보이고, 제품별 검색·정규 관계가 운영 필수로 확인되면 `Affected Products` 필드 도입을 별도 결정한다.

## 3. Component: G0 Owner 승인 5개 (2026-10-15 G0 당시 단일 Dropdown 미적용)

| 값 | 기준 |
|---|---|
| `backend` | API, Domain, Persistence, 서버측 Security·Integration |
| `frontend` | Web, Mobile, UI, 접근성 |
| `infra` | Docker, CI/CD, 클라우드, 배포, 모니터링 인프라 |
| `documentation` | ADR, 계약, 정본 정책·설계 문서 |
| `ai` | Prompt, Model Evaluation, 모델 실험 및 AI 워크플로 연구 |

`gateway`, `identity`, `oauth`, `journal` 등 도메인/서브시스템 이름을 Component 옵션으로 추가하지 않는다. **AI 제품의 API 구현은 Component=backend**, 모델 평가·프롬프트 실험은 Component=ai로 분류한다. 한 Epic이 여러 영역을 포함하면 대표 영역을 택하거나 독립적으로 관리해야 하는 하위 Issue로 분리한다.

## 4. Concern: G0 Owner 승인 14개 (2026-10-15 G0 당시 다중 선택 미적용)

`auth`, `security`, `idempotency`, `concurrency`, `consistency`,
`integration`, `migration`, `cutover`, `observability`, `reliability`,
`performance`, `architecture`, `contract`, `regression`.

- 기본 0개, 필요 시 최대 3개; 추가·변경은 Taxonomy 개정 + Owner 승인.
- `p0`·`done`·`bug`·`finance`·`backend` 등 다른 공식 필드에 속하는 값은 Concern에 중복 입력 금지.
- 기존 `customfield_10044`와 기본 `labels`의 과거 데이터는 이관 검증 전 삭제·초기화하지 않는다.
- Concern을 새로운 선택형 필드로 구성하는 것이 권장안이다. 현행 Jira label 타입의 추천값은 허용 옵션 강제가 아니다.

## 5. Jira 현황과 마이그레이션 근거 (READ-ONLY, 2026-10-15)

> 이 절의 **111개**는 2026-10-15 당시의 Historical Audit Snapshot으로 보존한다. 2026-10-21 실제 전체 118개, Target 24개(21 evidence-supported + 3 UNKNOWN_ORIGIN), G3 미승인 및 RPL-51 Batch 3 `backend` 검증은 [Current Status Projection](jira-g2-migration-status-projection-2026-10-21.md)에 기록한다. 과거 필드 개수·기본값·미결정 상태는 현재 결론으로 재해석하지 않는다.

RPL 이슈 **111개** 조회 결과:

| 현행 필드 | Field ID | 타입 / 실측 |
|---|---|---|
| Product | `customfield_10042` | 자유 입력 labels; 9종 표기, 복수 선택 24건, 공란 8건 |
| Component | `customfield_10043` | 자유 입력 labels; 14종 표기, 복수 선택 15건, 공란 8건 |
| Labels(커스텀) | `customfield_10044` | 자유 입력 labels; 190종 |
| Jira 기본 레이블 | `labels` | 자유 입력 labels; 105종 |
| Jira 기본 Components | `components` | 조회한 111건 사용 0건 |

Product·Component가 비어 있는 **8건은 모두 Subtask**이며, 현행 Subtask 생성 메타데이터에 해당 세 분류 필드가 제공되지 않는다. 이를 일반적인 데이터 누락으로 보고 일괄 보정하지 않는다.

커스텀 Labels와 기본 Labels를 **동시에 사용한 이슈는 59건**. 신규 Target Dropdown/Multiselect의 **실제 Field ID와 option ID는 아직 존재 여부·적용 여부를 검증하지 않았다.** 현재 커스텀 필드 타입은 이름만 변경해서 선택형으로 전환되는 것으로 가정하지 않는다.

현행 Epic·Task·Feature·Bug·Research의 Create 메타데이터에서 Product(`customfield_10042`)·Component(`customfield_10043`)·커스텀 Labels(`customfield_10044`)가 **모두 required**로 표시된다. 시작일·기한·커스텀 담당자(`customfield_10045`) 역시 required이다. 신규 정책은 지원되는 유형에만 새 Product·Component 필수화를 제안하고, Concern·일정은 선택을 권장한다. **신규 필드 추가만으로 기존 required 조건이 사라지지 않는다.** 이들은 모두 Issue Type별 Jira Admin 검증 및 별도 승인 대상이다.

### 5.1 Issue Type별 생성 필드 계약 (F1; 2026-10-15 READ-ONLY)

다음은 **Jira RPL 생성 메타데이터**에 근거한 현행 관측값이며, Edit·Transition 화면에서 동일한 지원을 보장하지 않는다. 편집 가능 여부, 신규 Field Context 및 실 저장 지원은 G1 관리 검증에서 별도 확인한다.

| 유형 | 기존 Product / Component / 커스텀 Labels | 기본값 | 현행 Create / Target 대응 |
|---|---|---|---|
| Epic | 셋 모두 노출·required | Product와 Component 각각 복수 기본값 | 현행 실제 필드만 사용. 새 단일 선택 필드는 G1 타입 지원 검증 후, G3 지정 유형부터 강제 |
| Task | 셋 모두 노출·required | Product와 Component 각각 복수 기본값 | 상동. 기본값을 실제 Owner 판정 근거로 사용 금지 |
| Feature | 셋 모두 노출·required | 없음 | 현행 실제 필드만 사용. G1 유형별 전환 시험 필요 |
| Bug | 셋 모두 노출·required | 없음 | 상동 |
| Research | 셋 모두 노출·required | 없음 | 상동 |
| Subtask | **셋 모두 Create에 미노출** | 해당 없음 | Parent는 필수. 현행 Create는 지원 필드만 전달; 새 필드 값을 추정 전송 금지. Target 직접 저장/표시·검증 방식 **Owner 결정 필요** |
| Story | **셋 모두 Create에 미노출** | 해당 없음 | 현행 Create는 지원 필드만 전달; Target 지원/정책 **미확정** |
| Tech Debt | **셋 모두 Create에 미노출** | 해당 없음 | 현행 Create는 지원 필드만 전달; Target 지원/정책 **미확정** |

- **신규 Target의 원칙:** 직접 저장 가능한 지원 유형은 Product·Component 각각 1개(기본값 없음)를 검증한다. 미지원 유형은 `Product 필수`를 가정하여 없는 Field ID를 전송하거나 Jira의 단일 선택값을 조작하지 않는다.
- **Subtask Parent:** 상위 Issue의 소유권은 작업 **맥락 추정값**일 뿐 Subtask의 저장된 Product 또는 Human 승인으로 승격되지 않는다. Parent 이동·상위 소유권 변경 시 맥락이 바뀔 수 있다.
- **Owner Decision Gate:** Subtask·Story·Tech Debt에 신규 필드를 직접 노출/저장할 수 있는지 Admin이 검증한다. 지원 불가하면 `관계/Parent 맥락만 읽기` 또는 `설명 내 Owner 기록` 중 승인된 방식으로만 운영한다. 특정 유형이 Target 필수화를 지원하지 않으면 **그 유형의 Target 분류 전환만 보류**한다. 기존 승인 워크플로우의 일반 Create/Comment/Transition까지 막지 않는다.
- **Fail-closed 범위:** 전환된 유형에 새로운 Issue를 만들거나 Product 소유권을 옮길 때 필수 옵션·권한·타입을 확인할 수 없으면 쓰기를 중단한다. **미전환 유형의 현행 작업은 G0~G4 계약에 따라 레거시 정책을 준수**하며 계속 처리할 수 있다.
- `Concern 최대 3개`는 현재 Jira 입력 UI가 강제한다는 증거가 없다. AI Writer/Validator는 제안된 계약이 승인·활성화된 유형에서만 이를 검사하고, UI/API 검증 강제 여부는 G1에서 확인한다.
- **새 Create 경로의 필수 해제/기본값 정리 선행조건:** 대상 Issue Type에서 기존 `customfield_10042/10043/10044`의 required와 자동 기본값, 신규 Product/Component의 required와 옵션·기본값을 **실제 설정에서 검증**한다. `customfield_10045`, `customfield_10015`, `duedate` 등 새 정책상 선택으로 바꾸려는 기존 required도 함께 검증한다. 해제가 불가하거나 범위가 타 Issue Type에 영향을 주면 Create Cutover 중단.
- **전환 시험:** 격리된 승인 시험 환경/테스트 이슈에서 **신규 Target Field만 분류 필드로 지정하고 레거시 Product/Component/Labels는 보내지 않은 Create**를 시도하여 성공·저장값·선택사항의 실제 동작을 재조회한다. 테스트 이슈 생성도 원격 쓰기이므로 Pilot/관리자 승인 범위 내에서만 시행하며, 현재 성공했다고 주장하지 않는다. **실험 전이나 미검증인 경우 신규 Create는 계속 Legacy 계약을 사용한다.**

## 6. Alias 및 기존 데이터 처리

### 무조건 문자열 치환하지 말 것

| 기존 분류 | 정규화 후보 | 전제 |
|---|---|---|
| `finance-harness` | `finance` | 해당 Finance 제품이 실제 소유자인 경우 |
| `shared-ai` | `ai` | 공통 Shared AI 자체의 작업인 경우. Carelog AI 기능 등은 다르게 판정 |
| `Carelog` | `carelog` | 문자열 표기만 불일치하는 동일 소유권 |
| `Platform-Foundation` | `platform-foundation` | 플랫폼 정본/기반의 실제 소유권 |
| `Shared-Platform`, `shared-platform` | **자동 매핑 불가** | gateway, identity, ai, audit, commerce 또는 foundation 중 실제 Owner 검토 |
| Component `fe`, `Frontend` | `frontend` | 프런트엔드 작업일 때 |
| Component `Infra`, `Docs` | `infra`, `documentation` | 의미가 동일할 때 |
| Component `Gateway`, `Identity`, `shared-identity` | **자동 매핑 불가** | Product 소유권을 별도로 지정, Component는 기술 작업 영역으로 판정 |
| 레거시 Label, AU-G* 식별자 | 기존 이력 보존 | Concern으로 무조건 승격하거나 제거하지 않음 |

**검토 우선 사례**: RPL-51(Gateway·Identity·Carelog 프로그램), RPL-84(Finance API), RPL-93(Dev Harness), RPL-105(Platform Core Host), RPL-106(Shared AI), RPL-107(Audit) 및 기존 Product 다중 선택 24건. RPL-70/77/80/82/83/85/89/94의 공란은 Parent 기반 후보일 뿐 Parent만으로 자동 승인하지 않는다.

**기존 승인 Governance의 과거 완료 티켓 일괄 Backfill 금지 유지.** 이 문서의 111개 감사는 업데이트 권한이 아니다. 완료 이슈까지 전량 이전하려면 대상·이유·백업·롤백·검증 기준을 가진 **별도 Owner 승인을 명시적으로 획득**한다. 기본은 현재/재활성화 이슈의 점진 이전이다.

## 7. AI Jira CRUD Gate (GPT와 Codex 공통)

### 7.1 정책 발견·검증: 필수

Jira **원격 쓰기**(Create, Update, Transition, Comment, Link, Bulk)가 예상되면:

1. **현재 발효된** `portfolio-work-management-governance.md`, `ai-session-governance.md`를 GitHub main에서 확인하고 Git ref/SHA와 승인 상태를 기록한다. `jira-field-taxonomy.md`는 실제 승인·발효 뒤에만 활성 계약으로 적용한다.
2. 대상 Issue Type, 실제 Jira Field schema/option ID/Transition, Role·Primary Jira·Owner 권한을 확인한다. **G0~G4 현재 단계·해당 Issue/유형의 Cutover 상태**를 확인하지 못하면 Target 분류 쓰기를 중단한다.
3. **G0 또는 미전환 대상:** 현행 승인 정책과 실제 Legacy Jira metadata를 따른다. 신규 Dropdown·Concern이 이미 존재한다고 가정하지 않는다. 기존 승인 범위의 Comment, Link, 비분류 Update 및 Transition을 신규 분류 필드 부재만으로 차단하지 않는다.
4. **전환된 대상의 분류 쓰기/Create:** 지원되는 Issue Type에서 Product 1개, Component 1개, Concern 0~3개를 검증하고 정확한 새 Field/Option ID만 쓴다. 허용값 밖·소유권 불명확·권한 불명확·필드 미지원이면 **해당 분류 쓰기를 중단**한다.
5. 재사용 가능한 검증 SHA는 동일 세션에서만 재사용하며, 새 세션·정책 변경·관리 필드 변경·일괄 작업 전에 다시 확인한다. 실제 쓰기 직전 대상 Issue 최신 상태/권한/타입을 재확인한다. Policy 접근 실패·권위 충돌 시 의심 상태를 성공으로 표현하지 않는다. 세션 기억은 SSOT가 아니다.

**Jira 쓰기 종류별 Gate:** (a) Create/소유권·분류 필드 변경에는 대상 유형·전환 단계 검증 필수; (b) Status/Comment/Link/무관한 Field 변경은 해당 역할과 Workflow Gate를 검사하고 분류 값을 건드리지 않는다; (c) 모든 Write는 요청 밖 필드를 보존하고 결과를 재조회한다.

### 7.2 Create

- 기존 중복 이슈 탐색과 에픽·이슈 유형·Primary Repository를 확인.
- Product Owner·Component·Concern을 검증하고 필요한 작업 Scope, DoD, Gate를 기재.
- 승인된 범위에서만 생성. 결과 재조회 후 실제 저장값 확인.
- 분류 정책 전문을 이슈 본문에 매번 붙여 넣지 않는다(정본 링크/정책 버전만 필요 시 기록).

### 7.3 Read / Update

- 실제 `customfield_*`·Jira system fields 구분; 이름과 추천 default label로 타입을 추정하지 않음.
- 요청받은 Field만 수정, 기타 필드는 보존. 소유권 이전(Product 변경)은 추가 승인 대상.
- 미병합 PR, Writer 구현, 테스트, 실제 배포 완료를 혼동하지 않는다.

### 7.4 Transition / Comment / Link

- 기존 승인된 Writer→Independent Review→Owner Merge Gate와 Evidence 규칙을 따른다.
- Done은 해당 Ticket의 Merge/Verification DoD 충족 시에만. 출시/운영 배포는 별도 증거.
- 댓글/이슈 링크도 원격 쓰기. 역할·대상 명시 없으면 수행하지 않는다.
- Reviewer/Portfolio Audit은 READ-ONLY, Jira 메타데이터 Maintainer는 승인된 대상·필드만.

### 7.5 Delete / Bulk Migration

- Delete 기본 금지. 중복/폐기 이슈는 이력 보존 및 관계 정리.
- Bulk 이전은 명시적 Owner 승인·안전한 스냅샷·필드 ID 매핑·소량 Pilot·Before/After Diff·오류 중단·복구안을 갖춘 별도 Change로 다룬다.
- Deprecated 필드 삭제는 모든 대상 검증과 조회/자동화 전환 뒤 별도 승인.

## 8. 적용 Gate와 전환기 Read/Write SSOT (F2)

### 8.0 경량 G2/G3 실행 경로 (Fast Track)

**적용 조건:** 단일 RPL 프로젝트에서 Owner가 **대상·필드·유형·적용 시점**을 명시 승인한 **소량·단일 Writer·직렬 실행·Owner 감독형 수동 작업 또는 Owner 승인형 AI Jira Writer 작업**에만 적용한다. 이 절은 문서 PR 병합만으로 Jira Write나 G3 Cutover 권한을 부여하지 않는다. 무인·동시·복수 Writer·대량 Create는 아래 §8.1의 완전한 Intent/Origin Registry 계약을 그대로 적용한다.

1. **대상 확정:** 이미 완료된 과거 76건은 기본 이전 대상에서 제외한다. RPL-40 폐기, HOLD Owner 미결정, Subtask/Story 등 Target 미지원 유형은 강제 이전하지 않는다. 출처 불명 RPL-112/113/114는 권위를 추정하지 않고 격리한다. RPL-111 SQS 계약/Description 변경은 Jira 필드 이전과 별도 승인이다.
2. **경량 증거 대장:** 버전 관리된 **단일 CSV/JSON 대장과 필요한 버전 관리 연결 근거**에 `IssueKey, IssueType, Origin(legacy_migration|target_create|unknown), Before/After Product·Component·Concern, Legacy SnapshotRef, OwnerApprovalRef, Jira ChangelogRef, TargetFieldIDs/OptionIDs, ImpactPreservationRef, Phase, VerifiedAt, ReadAuthority, WriteAuthority, RollbackRef, CutoverApprovalRef, Exception`을 남긴다. `target_create`에는 조건부로 `CreateRequestId`, `CreateActivationRef`, `ActivationRef/EffectiveFrom/EffectiveTo`와 생성 전 영속 `pending` Intent 근거를 연결하고, 기존 Legacy Snapshot은 `not_applicable`로 표시한다. 원본 Snapshot은 별도 보존하고 SHA/버전으로 참조한다. **별도의 Registry 서버·DB 설치를 수동 소량 작업의 선행조건으로 요구하지 않는다.** 대장이 없는 이슈의 신규 Target 권위는 허용하지 않는다.
3. **G2 최소 안전 검증:** 적용 전 실제 Jira 현재값·수정 대상·Field/Option ID·필드 지원 여부를 확인하고 원본 Snapshot을 보관한다. 승인된 소량 배치만 수정하며, 저장 후 Target 값·Changelog·비대상 필드 불변·영향 보존을 **대상 전수 재조회**하고 그 근거를 대장에 연결한다. Description을 건드리지 않는 **필드 전용 업데이트에 전체 Native ADF 복구 번들을 일률 강제하지 않는다**. 실패 시 배치를 중단하고 자동 Rollback하지 않는다.
4. **G3 승인형 Create/전환:** Jira Admin의 Legacy required/default와 Target option/required를 확인·조정한 뒤, 별도 승인된 **1~2건 시험 Create**, 실제 저장값 재조회, AI Writer·Reader/Board·Automation의 단일 권위 검증 및 복구 경로 확인을 거친 **지원 Issue Type만** 활성화한다. 기존 Legacy 이슈는 `Phase=staged|verified` 동안 `ReadAuthority=legacy`, 분류 `WriteAuthority=frozen`을 유지한다. Target 저장 후 값·영향 보존·원본 Snapshot을 재검증하고, 저장 승인이 아닌 별도 Owner `CutoverApprovalRef`가 있을 때만 `Phase=cutover`, `ReadAuthority=target`, `WriteAuthority=target`으로 전환한다. 신규 Target Create는 Jira 호출 전에 고유 `CreateRequestId`와 승인된 유형별 `ActivationRef/EffectiveFrom/EffectiveTo` 기간을 확인하고 `pending` Intent를 영속 등록한다. 응답 `IssueKey`를 연결하고 Target 저장값을 재조회한 뒤 `Origin=target_create`, `Phase=create_ready`, `ReadAuthority=target`, `WriteAuthority=target`, `Legacy SnapshotRef=not_applicable`을 대장에 영속 등록해야 성공 처리한다. 결과 불명확·재조회 불일치·Origin 등록 실패면 성공 보고나 재생성을 하지 않고 `create_pending`/`create_quarantined`, `ReadAuthority=none`, 분류 `WriteAuthority=frozen`, `UNKNOWN_ORIGIN`으로 격리한다. 승인된 Maintainer가 `CreateRequestId`와 알려진 IssueKey를 대조해 검증·권위 등록을 복구한다.
5. **권위·종료:** Legacy 이슈의 G3 전환은 승인된 대상에만 적용한다. 미입증 Target Create는 `UNKNOWN_ORIGIN`으로 분류 Write/Read/집계에서 격리한다. 같은 이슈의 이중 SSOT, 무단 Legacy fallback, dual-write는 금지한다. G3 종료 후에도 **G4 Legacy 삭제는 별도 승인까지 보류**한다.

**범위 우선순위:** 이 §8.0은 **Owner 감독형 소량·단일 Writer·직렬 실행**에서 아래 §8/§8.1의 별도 Registry 서버 구축 및 대형 Migration Manifest 시스템 구현 대신 버전 관리된 단일 대장과 연결 근거를 허용하는 경량 경로다. **경량화는 저장 형태만 대체하며, 아래 §8/§8.1의 권위·보존·승인·실패 격리 lifecycle을 생략하지 않는다.** 무인·동시·복수 Writer·대량 Create는 §8.1의 완전한 계약을 그대로 따른다. 승인·Jira Create 시험·Rollback 증거가 없으면 G3 활성화를 중단한다.

**핵심: 정책의 승인·병합, Jira 신규 Field 생성, 개별 Issue 데이터 이전, Board/Filter Cutover는 각각 별도의 사건이다.** 코드와 문서의 승인만으로 신규 Jira 분류가 자동 활성화되지 않는다.

| 단계 | 분류 Read 권위 | 신규 Create / 분류 Write | Comment·Transition·비분류 Update | 이동/복구 조건 |
|---|---|---|---|---|
| **G0 문서 제안/승인** | 기존 `customfield_10042/10043/10044` 및 기존 승인 정책. 신규 계약은 검토용 | **기존 현행 Field만**; 새 옵션/새 필드 사용 금지 | 기존 승인 Writer/Role/Workflow로 수행 가능 | 문서 승인/병합은 Admin 적용 아님 |
| **G1 신규 Admin Field 설정** | **기존 레거시 Field가 유효 권위**. 새 Field는 시험 대상 | 승인된 Pilot 전에는 신규 Field 쓰기 금지. Legacy Create는 실제 Issue Type 스키마 준수 | 계속 가능. Target 미존재/미전환 이유로 정지 금지 | Field ID·Option ID·Context·타입/필수/default·권한 실측 및 Snapshot, Pilot 승인 |
| **G2 승인 Pilot Issue 한정** | Pilot Manifest에 등재되어도 **Cutover 승인 + 재조회 검증 + `ReadAuthority=target` 확인 전까지 Legacy가 권위**. 승인·검증 완료된 Issue만 Target | Pilot Maintainer가 승인된 Target Field에 단방향 기록·검증. 완료 전 다른 분류 Writer는 정지; 일반 신규 Create는 G1 계약 | 역할/증거 Gate를 지키는 일반 Comment·Transition은 계속 가능 | Target 저장 → 재조회·원본/영향 보존 검증 → Human Cutover 승인 → Manifest 권위 전환 |
| **G3 활성 Issue 단계적 Cutover** | 기존 Issue는 승인·검증된 Migration Manifest, **신규 Target Create Issue는 검증된 Create Origin Manifest**를 기준으로 분류 권위 결정. 출처 불명은 분류 Read/Write 중단 | 승인된 Issue Type만 Target Create. **요청 사전 등록 → IssueKey 연결 → Target 필드 재조회 → 이슈별 권위 초기화**를 완료해야 성공 | 기존 승인 Workflow의 비분류 작업은 지속 | 기존 required/default·필드 시험뿐 아니라 Origin Registry/Reader·Rollback 검증 및 유형별 승인 |

| **G4 레거시 Cleanup 검토** | 승인된 범위는 Target; 미전환 과거 기록은 Legacy 이력 보존 | 대상 유형별 검증된 Target 경로만 | 기존 증거/링크 계속 유지 | 원본 보존·의존성 제거 확인 후 별도 Owner 승인. 자동 레거시 삭제 금지 |

**Migration Manifest 최소 필드(별도 승인된 기록/파일, Jira 새 필드로 가정 금지):**
`IssueKey`, `IssueType`, `Origin:legacy_migration|target_create`, `ExpectedLegacyHash/SnapshotRef`, `TargetFieldIDs/OptionIDs`, `TargetOwnerApprovalRef`, `ImpactPreservationRef`, `Phase:staged|verified|cutover|rolled_back|create_pending|create_ready|create_quarantined`, `ReadAuthority:legacy|target|none`, `WriteAuthority:legacy|target|frozen`, `CreateRequestId`, `CreateActivationRef`, `InitializedAt`, `MigratedAt`, `VerifiedAt`, `RollbackRef`, `CutoverApprovalRef`. **Origin별 조건부 필드:** 기존 Issue의 `legacy_migration`에는 원본 Snapshot·이슈별 Cutover 승인 필수. 신규 `target_create`에는 없는 Legacy Snapshot/기존 Issue Migration 승인을 만들어내지 않으며 `not_applicable`을 명시하고, 유형별 승인·Create 증거·저장값 재조회·권위 초기화 증거를 요구한다. `ReadAuthority=none`은 출처 검증 전 분류 차단용 상태다.

- **Pilot 승인 전개:** Manifest 등재·Target 저장만으로 권위를 바꾸지 않는다. ① Owner가 대상·필드·원본 스냅샷 승인 → ② Pilot Maintainer가 Target 저장 → ③ 저장값 재조회와 Target Owner/Component 검증 → ④ Cross-product 영향 보존/Legacy Snapshot 검증 → ⑤ 승인자가 검증 결과를 보고 **별도 Cutover 승인** → ⑥ Manifest의 `Phase=cutover`, `ReadAuthority=target`, `WriteAuthority=target`을 승인된 방식으로 갱신 → ⑦ 후속 Read에 반영한다.
- **기존 Legacy Issue의 검증 실패/승인 대기:** `Origin=legacy_migration`이고 `Phase=staged` 또는 `verified`면 **ReadAuthority=legacy**, 분류 `WriteAuthority=frozen`을 유지한다. 실패한 Target 기록을 격리하고 기존 Snapshot을 권위로 보존한다. 저장 성공·`VerifiedAt`·`CutoverApprovalRef` 중 하나만으로 Cutover를 추론하지 않는다. **이 Legacy fallback 규칙을 신규 `Origin=target_create`에 적용하지 않는다.**
- **Create 전환 Manifest/Checklist는 개별 Issue Manifest와 별도이다.** Issue Type별 `TypeId`, `LegacyRequired/DefaultState`, `TargetRequired/DefaultState`, `OptionIDs`, `VerifiedCreateRef`, `Writer/Board/AutomationReadinessRef`, `CreateOriginRegistryReadinessRef`, `CutoverApprovalRef`, `ActiveCreateAuthority:legacy|target`, `ActivationRef/EffectiveFrom/EffectiveTo`(전환 기간 이력), `RollbackRef`를 기록한다. 현재 테스트·Owner 승인 전까지 `legacy`이다. 유형별 CreateAuthority는 **미래 생성 경로**를 정할 뿐 기존 또는 이미 생성된 Issue의 ReadAuthority를 자동 변경하지 않는다.

- **이슈별 명시적 라우팅:** 기존 레거시 Issue의 `Phase=cutover` 승인·검증 전에는 Legacy 권위를 유지한다. **신규 Target Issue는 §8.1의 Create Origin·권위 초기화 규칙이 우선**한다. Manifest 미등재 이슈를 일률적으로 Legacy로 단정하거나 숨은 fallback/dual-write하지 않는다.
- **Issue Type별 Create 전환:** 실험·생성 경로 변경은 별도 Human 승인으로 대상 유형의 신규 Create를 일시 정지하거나 격리해 시행한다. **기존 Legacy required/default 정리 → 신규 Target required/option 확인 → Target-only 시험 Create·Origin 등록·Reader 재조회까지 검증 → 자동화·Writer/Board 경로 검증 → Create 전환 승인** 순서다. 기존 미이전 Legacy Issue와 새로운 Target Issue를 구분하는지 포함한다. 전환 중에는 분류 Create를 멈추고, 실패 시 승인된 이전 구성 복구 및 Create 재검증 없이 재개하지 않는다. 동일 유형의 Legacy/Target Create 동시 활성화 금지.
- **같은 Issue에서 분류 SSOT 두 개를 동시에 활성화하지 않는다.** 기존 Label은 Migration 도중 변동·삭제하지 않으며, Target 쓰기는 승인된 Maintainer가 수행한다. Legacy↔Target 값 차이는 `DRIFT`로 보고하고, 권위 미확인 상태에서는 **분류 수정만 WRITE STOP**. 일반 Comment/Transition은 역할·상태 기준을 독립 검증한다.
- **Rollback:** 기존 레거시 Issue의 Pilot을 철회하면 원본 Snapshot을 유지해 승인된 방식으로 권위를 전환하고 Target 기록을 격리한다. **신규 Target Create의 유형별 Rollback은 미래 Create만 바꾸며 이미 생성된 Target Issue를 자동 Legacy로 이전하지 않는다(§8.1).** 변경된 Jira 필수·기본값은 별도 Admin 복구 및 Create/Read 재검증 필요. Legacy 값 자동 재동기화 금지.
- **Board/Filter/Automation:** G2 Pilot의 기존 Board/Filter Legacy 기반 목록은 **과거 호환 View**일 수 있다. G3에서는 Manifest·Create Origin·승인된 Read Adapter로 **미이전 Legacy / 전환된 기존 Target / 신규 Target / UNKNOWN_ORIGIN**을 구분한다. 읽기 근거가 없으면 분류 조회/집계 성공을 주장하지 않으며, 검증된 대상 범위만 표시한다. 기존 Jira JQL과 자동화에서 두 필드를 암묵적으로 OR 결합하지 않는다.
- **기존 완료 이슈:** v1.1의 전량 Backfill 금지 유지. 활성·재활성화 대상만 기본 Migration Scope. 완료 이슈 전량 이전은 별도 Owner 승인·백업·복구/검증 Gate 필요.
- **미확정 운영 사항:** Migration Manifest 및 신규 Create Intent/Origin Registry의 영속 저장소·권한·조회 경로·장애 복구 구현, G3 Create 유형별 승인·정지·복구, Jira Admin Field ID/Option/Required, 지원 불가 유형의 분류는 Owner/Admin 결정과 실제 시험 전까지 활성화하지 않는다.


### 8.1 신규 Target Create Issue의 권위 초기화 (N1)

**운영 모드 구분:** 무인·동시·복수 Writer·대량 Create에는 아래 Intent/Origin Registry 전체 계약을 적용한다. 별도로 승인된 **소량·단일 Writer·직렬 실행·Owner 감독형 수동 작업 또는 Owner 승인형 AI Jira Writer 작업**은 §8.0의 버전 관리 대장과 연결 근거를 영속 Origin 근거로 사용할 수 있지만, 실제 Required/Default 확인·Create 검증·불명확한 결과 격리·단일 분류 권위는 생략할 수 없다.

**구분:** 기존 레거시 Issue의 이전은 `Origin=legacy_migration`과 이슈별 승인·Snapshot을 따른다. **신규 Target Create Issue는 Legacy Snapshot이 없으므로** 별도 출처 기록(`Origin=target_create`)과 **생성 직후 개별 Issue 권위 초기화**를 사용한다. 두 경우 모두 이슈별 유효 권위가 있어야 읽고 쓸 수 있으며, 유형별 `ActiveCreateAuthority=target`만으로 과거 Issue를 Target으로 바꾸지 않는다.

**G3 Create 활성화 전제:** Owner가 승인한 유형별 Create Cutover, `ActivationRef/EffectiveFrom/EffectiveTo` 기간 이력, 실제 Field/Option·Required/Default, 승인된 Writer, 영속적인 Create Intent/Origin Manifest 저장소 및 이를 조회하는 **Reader/Board/Automation 경로**가 검증돼야 한다. 이 조건과 신규 Origin 초기화까지 포함한 격리 시험 Create가 실패하면 해당 유형의 Target Create를 활성화하지 않는다.

**승인된 Jira Create Writer의 순서:**

1. 실제 유형·활성화 기간·옵션·Owner/Role을 확인하고 **Jira Create 호출 전에** 고유한 `CreateRequestId`로 지속 저장되는 `Create Intent`(`TypeId`, `ActivationRef`, 옵션/필드, 요청 주체, `pending`)를 먼저 기록한다. 이는 추후 생성 결과가 불명확할 때 대조할 근거다.
2. 승인된 **Target 분류 필드만** 보낸다. Jira가 반환한 `IssueKey`를 Intent에 연결하고, 새 Issue를 **재조회**해 Issue Type·Target Product/Component/Concern·옵션 저장값과 요청의 일치 여부를 확인한다.
3. 저장된 값을 확인한 뒤 `IssueKey`의 Origin Manifest를 **`Origin=target_create`, `Phase=create_ready`, `ReadAuthority=target`, `WriteAuthority=target`** 및 `CreateRequestId`·`CreateActivationRef`·`VerifiedAt`·`InitializedAt`·유형별 Cutover 승인 근거와 함께 **영속 등록**한다. **개별 등록 완료 이후에만 정상 Create 성공을 보고하고 일반 분류 Read/Write를 개방**한다. 별도 Legacy→Target 이슈 이전 승인이나 존재하지 않는 Legacy Snapshot은 요구하지 않는다.
4. **Create 결과 불명확·재조회 불일치·Origin 등록 실패:** 성공을 보고하지 않고 Intent 및 알려진 `IssueKey`를 `create_pending` 또는 `create_quarantined`로 보존한다. 해당 Issue 분류는 **`ReadAuthority=none / WriteAuthority=frozen`**으로 취급하고 Reader/집계에서 `UNKNOWN_ORIGIN`으로 격리한다. **Legacy 값 공란을 이용한 대체 조회·자동 재생성·중복 Create 재시도를 금지**한다. 승인된 Maintainer가 요청 ID와 Jira 실재 이슈를 대조하여 멱등적으로 검증·권위 등록을 복구한다. Jira 자체의 idempotency 제공을 가정하지 않는다. 비분류 Comment·Transition은 독립된 Role/Workflow Gate를 계속 적용한다.

**라우팅 결정 순서:** ① 기존 `legacy_migration` Manifest가 있는 Issue는 해당 전환 상태를 따른다. ② `target_create` Manifest가 있는 Issue는 `create_ready` 및 재조회 근거가 유효할 때만 Target, 아니면 분류 중단. ③ Manifest 미등재 Issue는 유형별 **과거 활성화 기간 이력·생성 출처 기록**을 대조해 기존 Legacy임이 입증되면 Legacy다. **Target Create가 가능한 기간에 생성됐거나, Issue Type 변경·외부 생성·시각 경계 등으로 출처가 불명확하면 `UNKNOWN_ORIGIN`으로 분류 Read/Write와 집계를 중단**하고 재조사한다. 생성 시각·현행 Issue Type·Target 필드의 공란만으로 권위를 추측하지 않는다.

**Create Rollback:** 유형별 `ActiveCreateAuthority`를 이전 Legacy Create 계약으로 되돌려도 **이미 생성된 `target_create` Issue는 Target 권위와 출처 이력을 유지**한다. 향후 생성 경로에만 변경을 적용하고 활성화 기간 이력을 보존한다. 기존 Target-created Issue를 Legacy로 변경하려면 별도 승인·Snapshot·양방향 필드 검증을 포함한 **이슈별 역방향 이전**이 필요하다. Origin Registry/Reader 장애 중에는 신규 분류 Create를 중단한다. **이 절차는 제안 계약이며 실제 저장소·운영 구현·Create 시험은 아직 미검증이다.**

**문서 PR Merge ≠ Jira Admin 적용 ≠ 티켓 분류 이전 ≠ Board Cutover ≠ Runtime 배포.**

## 9. AI 세션에서 짧게 참조하는 규칙

```text
Jira 원격 쓰기 전에 GitHub main에서 승인·발효된
portfolio-work-management-governance.md와
ai-session-governance.md의 SHA·역할을 확인한다.
jira-field-taxonomy.md는 승인·발효 및 해당 이슈의
G0~G4 Cutover 상태를 확인한 경우에만 적용한다.
신규 Create/분류 수정은 Issue Type의 실제 지원·Field/Option을 검증한다.
Target Create 이슈는 Origin 등록·재조회 검증 전 분류 Read/Write를 중단한다.
미전환 이슈의 Comment/Transition은 기존 승인 계약으로 진행할 수 있다.
권위 불명확·미승인 소유권 변경·대량 수정·삭제는 중단한다.
```

이는 실행 지침이며 **강제 검증 코드를 대신하지 않는다**. 실제 강한 제약은 Jira 선택형 Field 설정 및 향후 Jira Writer Adapter/Validator에 적용한다.
