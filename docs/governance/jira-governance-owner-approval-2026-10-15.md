---
title: Jira Governance v1.2/v1.0 — Owner 최종 승인 기록
record_id: GOV-JIRA-POLICY-APPROVAL-2026-10-15
recorded_at: "2026-10-15"
owner_approval_status: approved
document_status: accepted
effective_from: "2026-10-15T15:03:00+09:00"
merge_commit_sha: "3faf402a8603aa87449070ba0833b862df46bd3f"
merged_at: "2026-10-15T15:03:00+09:00"
implementation_status: not_started
source_pr: "https://github.com/ranikun-labs/harness-foundation-docs/pull/38"
independent_reviewed_head_before_approval_metadata: "54c3cdd68b049b7d5b1ad7a1827a9874c6289990"
independent_review_verdict_before_approval_metadata: "PASS — N1 CLOSED (user-provided Sol review)"
final_metadata_delta_review: passed_independent_sol_user_reported
final_metadata_reviewed_head: "7387371319bb7c5b841e4363e05f3bb848f8ed4b"
merge_gate: approved_and_executed
merge_method: merge_commit
related_policies:
  - docs/governance/portfolio-work-management-governance.md
  - docs/governance/jira-field-taxonomy.md
  - docs/governance/jira-taxonomy-g0-owner-decision-2026-10-15.md
---

# Governance v1.2 / Jira Taxonomy v1.0 — Owner 최종 승인 (2026-10-15)

> **Owner 정책 승인 및 2026-10-15 15:03 KST main 병합으로 정책 발효 / Jira Admin·Migration 미적용.**
> Owner는 2026-10-15 대화에서 "Governance v1.2와 Jira Taxonomy v1.0 전체 정책을 Owner로서 최종 승인하시겠습니까?"라는 명시적 승인 요청에 `"ㅇㅋㅇㅋㅇㅋ 좋아"`로 동의했다. 이 기록은 **G0 다섯 결정만이 아니라 전체 정책 문서의 채택**을 기록한다.

## 승인 범위

- **Portfolio Work Management Governance v1.2 전체:** RPL 단일 프로젝트, Product/Component/Concern 주 책임 분류, Concern별 Canonical Owner, 역할별 CRUD 권한, AI Session 작업 경계, Independent Review·Merge Gate, 작업 Lifecycle 및 Jira G0~G4 Rollout 계약.
- **Jira Field Taxonomy & AI CRUD Gate v1.0 전체:** Product 9개(일반 사용 후보 8개 + 별도 활성화 승인 전 `commerce` 예약), Component 5개, Concern 14개, 대표 Owner/영향 보존, Issue Type별 Field 지원 한계, 기존 Issue Migration 및 신규 Target Create Origin/권위 초기화, 실패 격리, Rollback, Writer Fail-closed 조건.
- **기존 G0 결정 기록은 유지:** `RPL-51` 주 Product `platform-foundation`, 영향 `gateway`·`identity`·`carelog`. RPL-51 Component와 일부 Issue Type의 직접 저장 방식 등 문서상 별도 보류 사항은 그대로 보류한다.

## 독립 검수·병합 증거

- 이전 문서 설계 검수 HEAD `54c3cdd6`: 별도 Sol **PASS / N1 CLOSED / Blocker·Major·Minor 0/0/0**.
- 승인 메타데이터 최종 HEAD `7387371319bb7c5b841e4363e05f3bb848f8ed4b`: 별도 Sol Independent Delta Review **PASS / 0/0/0**(사용자가 제공한 세션 결과이며 GitHub 공식 Review 제출 증거는 아님).
- 별도 Owner가 병합을 명시 승인했다. [PR #38](https://github.com/ranikun-labs/harness-foundation-docs/pull/38)의 [Merge Commit `3faf402a`](https://github.com/ranikun-labs/harness-foundation-docs/commit/3faf402a8603aa87449070ba0833b862df46bd3f)은 **2026-10-15 15:03 KST**에 생성됐다. 부모는 `97d9f98b`(이전 main)와 `73873713`(검수 HEAD), 개별 커밋 8개를 보존한다.
- `effective_from: "2026-10-15T15:03:00+09:00"`은 실제 병합 시각이다. 기존 v1.1의 승인 이력은 보존한다.

## Jira 실행 경계 및 다음 Gate

**Jira Field/Option 생성, Required/Default 변경, Issue Migration/Pilot, Origin Registry 구현·운영, Board/Automation Cutover는 실행하지 않았다.** `implementation_status: not_started`를 유지한다. 다음은 **Jira Admin G1의 실제 스키마·권한·복구 절차 확인과 별도 실행 승인**, 이후 소량 Pilot G2다. 이 메타데이터 정합화 변경 자체도 독립 검수와 별도 Merge Gate를 따른다.
