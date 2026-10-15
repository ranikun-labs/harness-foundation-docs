---
title: Jira Taxonomy G0 — Owner 분류 결정
record_id: GOV-JIRA-G0-2026-10-15
recorded_at: "2026-10-15"
owner_decision_status: approved
document_status: in_review
implementation_status: not_started
policy_effective_from: null
policy_merge_status: pending_independent_review_and_owner_merge_gate
related_pull_request: "https://github.com/ranikun-labs/harness-foundation-docs/pull/38"
pr_head_observed_at_owner_decision: "bffff29f7f8acffa9f4f68bb21c7ce8712b0abe8"
related_policies:
  - docs/governance/portfolio-work-management-governance.md
  - docs/governance/jira-field-taxonomy.md
---
# Jira Taxonomy G0 — Owner 분류 결정 (2026-10-15)

> **Owner가 아래 다섯 개의 분류·책임 결정을 승인했다.** 승인 근거는 2026-10-15 Ranikun Labs Owner가 해당 ChatGPT 세션에서 `"Jira Governance G0 추천안 5개를 Owner로서 승인해"`라고 명시적으로 확인한 것이다. 이는 정책의 정식 발효·GitHub 독립 리뷰·PR 병합 또는 Jira 필드/이슈 원격 변경에 대한 승인이 아니다. 이 파일은 승인 범위의 **기록**이며 승인 후 운영 전환을 자동화하는 명령이 아니다.

## 1. 승인된 분류·책임 범위

| ID | Owner 승인 사항 | 효력·제약 |
|---|---|---|
| G0-1 Product | 논리적 Product 식별자 9개: `carelog`, `finance`, `gateway`, `identity`, `ai`, `audit`, `commerce`, `platform-foundation`, `dev-harness`. 각 Issue의 주 Product는 **정확히 하나** | `commerce`는 **예약된 논리 식별자**다. 향후 별도 Scope/활성화 승인이 있기 전에는 신규 운영 티켓의 Product 선택값으로 **사용하지 않는다**. 나머지 8개도 Jira Admin 적용·유형별 Cutover 전까지 현재 필드의 활성 옵션으로 오인하지 않는다 |
| G0-2 Component | `backend`, `frontend`, `infra`, `documentation`, `ai` 다섯 개 | 기술 작업의 대표 영역 하나. Jira Issue Type별 저장 가능 여부·필수화는 별도 Admin Gate |
| G0-3 Concern | `auth`, `security`, `idempotency`, `concurrency`, `consistency`, `integration`, `migration`, `cutover`, `observability`, `reliability`, `performance`, `architecture`, `contract`, `regression` 총 14개 | 선택 0~3개. Jira UI/API에서 최대 3개 강제 가능한지는 Admin Gate에서 확인 |
| G0-4 Subtask | Parent의 Product는 **참고용 맥락**이며 Subtask 자신의 확정·저장된 Product로 자동 상속하거나 Owner 승인으로 간주하지 않는다 | Subtask 필드 직접 저장 지원 여부·저장 대안은 Jira Admin 검증 뒤 별도 결정. 동일하게 생성 필드가 미노출된 Story/Tech Debt의 적용 방식도 미확정 |
| G0-5 RPL-51 | Cross-product Epic `RPL-51`의 대표 Product는 **`platform-foundation`**. 영향받는 Product는 `gateway`, `identity`, `carelog` | Jira 이슈 값의 즉각적인 변경이 아니다. 관계·근거를 보존하고 승인된 Pilot/Manifest·스냅샷·Cutover 전에는 기존 Product 복수값을 제거하지 않는다 |

## 2. RPL-51 영향 보존의 승인 범위

- **Primary Product:** `platform-foundation`. Gateway·Identity 물리 추출과 Carelog 전환을 아우르는 프로그램의 총괄 범위에 대한 **Owner 결정**이다. 세부 하위 Ticket은 실제 논리적 책임 Product를 각각 소유한다.
- **Affected Product:** `gateway` — Shared Gateway 추출 관련 `RPL-53`을 근거 후보로 확인.
- **Affected Product:** `identity` — Shared Identity 추출 관련 `RPL-54`를 근거 후보로 확인.
- **Affected Product:** `carelog` — Carelog Cutover/Regression 관련 `RPL-55`를 근거 후보로 확인.
- 관련 Issue의 **현재 실제 Link, Issue Type, 제목, 최신 상태 및 Description**은 Jira에 기록하기 직전에 재검증한다. 단순히 이 문서의 예시로 Link가 생성된 것으로 간주하지 않는다.
- 현행 `RPL-51` Product 값 `carelog`와 `platform-foundation`, Component 값 `backend`와 `infra`는 **원본 기록으로 보존**한다. G0-5는 **Component 대표값을 결정하지 않았다**. 그 값을 임의로 `backend`나 `infra`로 확정하지 않는다.

## 3. 승인하지 않은 범위와 활성화 조건

다음 항목은 **G0 승인 대상 밖**이며 승인·검증을 따로 요구한다.

- PR #38의 독립 Reviewer PASS·Ready 전환·Merge. 이 결정 기록을 추가하는 Writer Commit은 **새 HEAD**이므로 기존 리뷰 결과를 승계하지 않는다. 기존 독립 Sol Reviewer의 Delta/Closure와 최신 main 통합 점검을 우선한다.
- Governance 전체 문서의 `accepted` 전환 및 `effective_from` 설정. 승인된 G0 분류안도 **PR #38이 검수·Owner Merge Gate를 거쳐 main의 유효 계약이 되기 전에는 운영 정책이 아니다**.
- Jira Product/Component/Concern Custom Field 생성·Option 등록·필수/기본값 해제, 기존 필드 제거.
- 이슈 생성·댓글·수정·Transition·Link, `RPL-51`을 포함한 실제 이슈 마이그레이션. 별도 Role·Scope/Target·Pilot 승인 필요.
- Team-managed Issue Type별 필드 지원·Create 검증 및 Legacy↔Target Migration Manifest 저장·Cutover 승인.
- 과거 완료 이슈 전량 Backfill, 다른 Repository 코드·PR·배포·AWS V1/Observability 작업.

**필요한 순서:** Owner G0 결정 기록 → Writer 문서 변경 → 독립 Reviewer Delta/Closure → Owner의 명시적 PR Merge Gate → 승인된 정책 발효 → Jira Admin G1 → 승인된 소량 Pilot G2 → 단계별 G3/G4.

**이 기록은 과거 승인된 v1.1 Governance를 무효화하지 않는다.** G1~G4까지 해당 대상의 실질적인 Jira Read/Write 권위는 승인된 Taxonomy §8의 단계별 계약 및 현재 실제 필드에 따른다.
