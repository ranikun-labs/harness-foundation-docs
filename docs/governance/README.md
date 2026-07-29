---
title: Platform Governance Index
status: accepted
decision_status: accepted_with_constraints
owner: governance
last_reviewed: 2026-07-29
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
└── ai-session-governance.md
```

| 문서 | 책임 |
|---|---|
| [Portfolio Work Management Governance](portfolio-work-management-governance.md) | Jira·Git·GitHub·Confluence의 Concern별 소유권, 작업 분류, Lifecycle, WIP, Rollout |
| [AI Session Governance](ai-session-governance.md) | Session Role, 읽기·쓰기 권한, Primary Issue, 진실성, Git 안전, 종료 보고 |

두 문서는 `DEC-065`에 의해 승인된 Platform Governance다. 이 승인 사실만으로
Jira·Confluence 설정 적용이나 Rollout 완료를 의미하지 않는다.

원본 설계 문서는 [`source-inputs/`](../../source-inputs/README.md)에 보존한다.
원본은 역사적 입력이며 Canonical 정책이 아니다.

Supporting Architecture Input은 논리 Service와 현재 구현 Host의 분리 같은
Governance 예시만 보강한다. Architecture 판단의 우선순위는
`ADR-0015 / DEC-064 > 현재 Foundation Canonical > Primary Governance
Inputs > Supporting Architecture Inputs`다.
