---
title: Jira Governance v1.2/v1.0 — Owner 최종 승인 기록
record_id: GOV-JIRA-POLICY-APPROVAL-2026-10-15
recorded_at: "2026-10-15"
owner_approval_status: approved
document_status: approved_pending_merge
effective_from: null
implementation_status: not_started
source_pr: "https://github.com/ranikun-labs/harness-foundation-docs/pull/38"
independent_reviewed_head_before_approval_metadata: "54c3cdd68b049b7d5b1ad7a1827a9874c6289990"
independent_review_verdict_before_approval_metadata: "PASS — N1 CLOSED (user-provided Sol review)"
final_metadata_delta_review: pending
merge_gate: pending_separate_owner_authorization
related_policies:
  - docs/governance/portfolio-work-management-governance.md
  - docs/governance/jira-field-taxonomy.md
  - docs/governance/jira-taxonomy-g0-owner-decision-2026-10-15.md
---

# Governance v1.2 / Jira Taxonomy v1.0 — Owner 최종 승인 (2026-10-15)

> **승인됨(정책 결정) / 미발효(병합 전) / Jira 미적용.**
> Owner는 2026-10-15 대화에서 "Governance v1.2와 Jira Taxonomy v1.0 전체 정책을 Owner로서 최종 승인하시겠습니까?"라는 명시적 승인 요청에 `"ㅇㅋㅇㅋㅇㅋ 좋아"`로 동의했다. 이 기록은 **G0 다섯 결정만이 아니라 전체 정책 문서의 채택**을 기록한다.

## 승인 범위

- **Portfolio Work Management Governance v1.2 전체:** RPL 단일 프로젝트, Product/Component/Concern 주 책임 분류, Concern별 Canonical Owner, 역할별 CRUD 권한, AI Session 작업 경계, Independent Review·Merge Gate, 작업 Lifecycle 및 Jira G0~G4 Rollout 계약.
- **Jira Field Taxonomy & AI CRUD Gate v1.0 전체:** Product 9개(일반 사용 후보 8개 + 별도 활성화 승인 전 `commerce` 예약), Component 5개, Concern 14개, 대표 Owner/영향 보존, Issue Type별 Field 지원 한계, 기존 Issue Migration 및 신규 Target Create Origin/권위 초기화, 실패 격리, Rollback, Writer Fail-closed 조건.
- **기존 G0 결정 기록은 유지:** `RPL-51` 주 Product `platform-foundation`, 영향 `gateway`·`identity`·`carelog`. RPL-51 Component와 일부 Issue Type의 직접 저장 방식 등 문서상 별도 보류 사항은 그대로 보류한다.

## 독립 검수·발효 경계

- Owner 승인 직전 문서 HEAD `54c3cdd68b049b7d5b1ad7a1827a9874c6289990`에 대해 별도 Sol Independent Reviewer가 **PASS / N1 CLOSED / Blocker 0·Major 0·Minor 0** 결과를 보고했다. **GitHub 공식 Review로 제출됐다는 뜻은 아니다.**
- **이번 승인·효력 메타데이터 변경으로 생성되는 새 HEAD는 아직 독립적으로 검수되지 않았다.** 따라서 PR #38 Draft 상태를 유지하고 최신 main/Base와 승인 계보, G0 분류/전체 정책 승인, `approved_at` 및 `effective_from: null`의 정합성을 재검수한다.
- **`decision_status: accepted`는 정책 채택, `effective_from: null`은 미발효를 뜻한다.** PR #38이 독립 재검수와 별도의 Owner Merge Gate를 거쳐 `main`에 병합되기 전에는 **기존 main v1.1이 유효한 운영 계약**이다.
- 정책 발효 시점은 **별도 Merge 승인 후 실제 main 반영 시점**으로 확정하며, 병합 전 임의의 날짜·예상 병합일을 `effective_from`에 기록하지 않는다. 발효 시각과 Merge Commit/SHA의 추적 가능한 증거는 별도 후속 기록으로 남긴다.
- **Jira Admin Field/Option 생성·Required/Default 변경, Issue Create/Update, Migration/Pilot, Board/Automation 전환은 승인하지 않았다.** 모두 Owner/Admin/운영 실행 Gate와 검증 증거를 별도로 요구한다. `implementation_status: not_started` 유지.
- 다른 Repository·PR·Jira·Confluence·AWS V1 작업은 승인·변경 범위 밖이다.

## 다음 Gate

새 HEAD의 **Sol Independent Metadata Delta Review (READ-ONLY)** → 별도의 **Owner PR Merge 명시 승인** → GitHub main 병합 및 발효 시각·SHA 증거 기록 → Jira Admin G1 → 승인된 Pilot G2.
