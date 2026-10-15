---
title: Platform Governance Index
status: in_review
decision_status: proposed
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
└── jira-taxonomy-g0-owner-decision-2026-10-15.md
```

| 문서 | 책임 |
|---|---|
| [Portfolio Work Management Governance](portfolio-work-management-governance.md) | Jira·Git·GitHub·Confluence의 Concern별 소유권, 작업 분류, Lifecycle, WIP, Rollout |
| [AI Session Governance](ai-session-governance.md) | Session Role, 읽기·쓰기 권한, Primary Issue, 진실성, Git 안전, 종료 보고 |
| [Jira Field Taxonomy & AI CRUD Gate](jira-field-taxonomy.md) | **G0 분류 결정 Owner 승인 / 정책은 미발효 제안**: 허용값, 이전·CRUD Gate |
| [Jira G0 Owner 분류 결정 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md) | **2026-10-15 G0 결정 5개 승인 범위·RPL-51 책임/영향·별도 독립 리뷰/병합/관리 Gate** |

**승인 계보:** [Portfolio Governance v1.1의 승인 원문](https://github.com/ranikun-labs/harness-foundation-docs/blob/bf5667d7853f155715ebb4b0096cbd1cbe3deac7/docs/governance/portfolio-work-management-governance.md)과 AI Session Governance v1.1은 DEC-065의 기존 승인 범위다. 링크 대상의 **Portfolio v1.2는 이 PR의 미승인 개정안**이며 v1.1 승인 사실을 승계해 자동 발효시키지 않는다.

이 Index 자체의 변경은 **PR #38의 `in_review` 제안**이다.
G0의 Product 9개(일반 후보 8 + `commerce` 예약), Component 5개, Concern 14개,
Subtask Parent 맥락 규칙, RPL-51 대표 Product=`platform-foundation` 결정은
[2026-10-15 Owner 승인 기록](jira-taxonomy-g0-owner-decision-2026-10-15.md)에 보존했다.
하지만 **G0 결정 승인 ≠ 전체 Governance 독립 검수 완료 ≠ 정책 발효 ≠ PR Merge**다.
PR은 기존 독립 Reviewer가 최신 HEAD의 Delta/Closure를 검증하고, 별도 Owner Merge
Gate를 확인할 때까지 Draft로 유지한다. `catalog/system-catalog.yaml`과
Confluence의 v1.1 참조는 승인·병합 전에 변경하지 않으며, 병합 후에는 기존
v1.1 고정 참조와 새 v1.2 효력 정보를 분리해 후속 동기화한다.

기존 Governance 승인이나 문서 PR Merge만으로 Jira·Confluence 설정 적용 또는 Rollout 완료를 의미하지 않는다.

원본 설계 문서는 [`source-inputs/`](../../source-inputs/README.md)에 보존한다.
원본은 역사적 입력이며 Canonical 정책이 아니다.

Supporting Architecture Input은 논리 Service와 현재 구현 Host의 분리 같은
Governance 예시만 보강한다. Architecture 판단의 우선순위는
`ADR-0015 / DEC-064 > 현재 Foundation Canonical > Primary Governance
Inputs > Supporting Architecture Inputs`다.
