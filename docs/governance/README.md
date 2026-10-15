---
title: Platform Governance Index
status: accepted
decision_status: accepted
owner_approval_ref: docs/governance/jira-governance-owner-approval-2026-10-15.md
effective_from: "2026-10-15T15:03:00+09:00"
merge_commit_sha: "3faf402a8603aa87449070ba0833b862df46bd3f"
merged_at: "2026-10-15T15:03:00+09:00"
owner: governance
last_reviewed: null
source_inputs:
  - source-inputs/ranikun-platform-enterprise-work-management-governance.md
  - source-inputs/ranikun-platform-ai-session-prompt-pack.md
supporting_architecture_inputs:
  - source-inputs/ADR-PROPOSED-공통-MSA-통신-메시징-프로토콜-선택.md
  - source-inputs/Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md
---

# Platform Governance

이 디렉터리는 Ranikun Labs의 작업 관리와 AI Session 운영 규칙을 관리한다.

```text
docs/governance/
├── portfolio-work-management-governance.md
├── ai-session-governance.md
├── jira-field-taxonomy.md
├── jira-taxonomy-g0-owner-decision-2026-10-15.md
└── jira-governance-owner-approval-2026-10-15.md
```

| 문서 | 책임 |
|---|---|
| [Portfolio Work Management Governance](portfolio-work-management-governance.md) | Jira·Git·GitHub·Confluence의 Concern별 소유권, 작업 분류, Lifecycle, WIP, Rollout |
| [AI Session Governance](ai-session-governance.md) | Session Role, 읽기·쓰기 권한, Primary Issue, 진실성, Git 안전, 종료 보고 |
| [Jira Field Taxonomy & AI CRUD Gate](jira-field-taxonomy.md) | **v1.0 Owner 승인·main 발효 / Jira G1 미실행**: 허용값, 이관·CRUD Gate |
| [Jira G0 Owner 분류 결정 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md) | 2026-10-15 G0 분류·RPL-51 Owner 승인 이력 |
| [Jira Governance 전체 Owner 승인 기록](jira-governance-owner-approval-2026-10-15.md) | **v1.2 Portfolio + v1.0 Taxonomy Owner 승인·Merge 증거**, Jira 적용은 별도 G1~G4 |

**승인 계보:** [Portfolio v1.1 고정 원문](https://github.com/ranikun-labs/harness-foundation-docs/blob/bf5667d7853f155715ebb4b0096cbd1cbe3deac7/docs/governance/portfolio-work-management-governance.md)의 이력은 보존한다.
[G0 결정 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md)과 [v1.2/v1.0 전체 정책 승인](jira-governance-owner-approval-2026-10-15.md)은 별도 Owner 결정이다.
Sol 최종 Metadata Delta PASS HEAD `73873713`과 별도 Owner Merge 승인 후 [PR #38](https://github.com/ranikun-labs/harness-foundation-docs/pull/38)이 [Merge Commit `3faf402a`](https://github.com/ranikun-labs/harness-foundation-docs/commit/3faf402a8603aa87449070ba0833b862df46bd3f)으로 **2026-10-15 15:03 KST `main` 병합·발효**됐다.

**정책 발효 ≠ Jira Admin/Issue Migration/Pilot 완료**. `catalog/system-catalog.yaml`과 Confluence의 새 효력 정보 동기화는 후속 Change Gate로 관리하며, 기존 v1.1 고정 참조는 유지한다.

원본 설계 문서는 [`source-inputs/`](../../source-inputs/README.md)에 보존한다.
원본은 역사적 입력이며 Canonical 정책이 아니다.

Supporting Architecture Input은 논리 Service와 현재 구현 Host의 분리 같은
Governance 예시만 보강한다. Architecture 판단의 우선순위는
`ADR-0015 / DEC-064 > 현재 Foundation Canonical > Primary Governance
Inputs > Supporting Architecture Inputs`다.
