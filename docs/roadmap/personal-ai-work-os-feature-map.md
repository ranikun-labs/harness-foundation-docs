---
title: Personal AI Work OS — 사용자 기능 지도와 우선순위
status: proposed
document_role: reference_only_user_facing_projection
implementation_status: partial_unverified
owner: dev-harness
date: "2026-10-27"
source_refs:
  - "https://ranikunlabs.atlassian.net/wiki/spaces/RLAB/pages/21495809"
  - "https://ranikunlabs.atlassian.net/browse/RPL-112"
  - "https://github.com/ranikun-labs/oh-my-ai/pull/86"
---

# Personal AI Work OS — 기능 지도와 진행 순서

**한 줄 목표:** “AI에게 업무를 말하면 필요한 자료와 기존 작업을 확인하고, 승인된 일을 실행·검수하며, 여러 업무의 진행 상황과 다음 결정을 이해하기 쉽게 알려주는 개인 AI 업무 체계.”

이 문서는 **사용자에게 어떤 기능이 생기는지** 설명하는 검토용 안내다. [Confluence 개요](https://ranikunlabs.atlassian.net/wiki/spaces/RLAB/pages/21495809)는 읽기 쉬운 현황 안내, [Jira RPL-112](https://ranikunlabs.atlassian.net/browse/RPL-112)와 하위 이슈는 실무 상태, [Work OS 설계 PR #86](https://github.com/ranikun-labs/oh-my-ai/pull/86)은 미채택 기술 계약 후보가 소유한다. 이 문서 자체는 Foundation Governance, 기존 V1/V2/V3 제품 로드맵, AI 지침 적용 권한이나 새로운 시스템 구현 승인이 아니다.

## 1. 대화와 업무 계획에 사용할 기능명

| 코드 | 공식 기능명 | 사용자가 기대하는 결과 | 2026-10-27 기준 상태 | 관련 Jira |
| --- | --- | --- | --- | --- |
| **F1** | **한글화·핵심정리** | PR·Commit·Jira·ADR·Markdown·Confluence를 실험 일지 대신 **문제 → 개선 → 검증 → 남은 일** 중심으로 쉽게 작성 | Private 원칙과 #86 설계 계약 존재. 공용 Skill·자동 저장 전 품질 검사는 미구현/미검증 | RPL-112·114·115·118 |
| **F2** | **AI 업무 파악** | “로그인 오류 고쳐줘”에서 의도·기존 Jira·관련 코드/문서·Skill 후보를 필요한 만큼 찾아 보여줌 | 기존 Skill Index·Advisory Hook 일부 구현, #85 Draft. Runtime 통합 미검증 | RPL-113 |
| **F3** | **AI 작업 실행·검수** | 승인된 **업무 한 건**을 실제 실행하고 독립 검수·결과 보고까지 완주 | Worker/Result 계약 존재, 전체 실제 E2E NOT_RUN | RPL-115 |
| **F4** | **AI-driven 연속 운영** | 승인된 Objective 안에서 다음 READY 재배정, BLOCKED 격리, Checkpoint/Resume, 전체 Fan-in | 로컬 합성 Fixture 34/34 PASS는 별도 세션 보고. 실제 Subagent·통합 E2E NOT_RUN | RPL-115·116 |
| **F5** | **멀티 AI 환경 연동** | 같은 지침을 각 환경에 맞게 적용하고 ChatGPT·Codex·Claude 및 가능한 실행기/Skill을 선택 | Private #2 Validator CI PASS. 실제 설치·Runtime별 동작 및 모델/Speed Guard 미검증 | RPL-114·116·117·118 |
| **F6** | **통합 업무 오케스트레이션** | Jira 업무·의존성과 GitHub PR/코드·Docs 계약·Confluence 목표를 함께 보아 **전체 우선순위·차단·진척·다음 결정**을 조정 | 목표 아키텍처/계약 초안. 다중 업무의 실제 지속적인 통합 관제 미구현·미검증 | RPL-112·113·115·118 |

**상태 읽는 법:** “계약/후보 존재” ≠ “실제 Runtime에서 동작” ≠ “독립 Review/Source Merge 완료”. Jira는 완료/진행 상태의 운영 원본이며, 기술 PASS의 증거는 PR/CI/실측 결과를 따른다.

## 2. 겹치는 것처럼 보이는 기능의 정확한 경계

- **F1 = 상시 기본 작성 품질 + 선택형 전문 Skill:** 산출물 저장 시 독자 중심 표현과 사실 보존은 늘 적용할 목표 원칙이다. 긴 문서 교정, 형식별 전문 Review/rewrite가 필요할 때 별도 `engineering-communication-ko` Skill 후보를 선택한다. Private 지침에 전체 절차를 복사하지 않으며 **현재 자동 로딩·저장 전 검사 구현을 보장하지 않는다**. 실험·감사 로그는 원자료가 본래 산출물이면 보존하되 먼저 이해하기 쉬운 요약을 제공한다.
- **F2 = 지금 요청한 한 업무의 진입·맥락 확인; F6 = 여러 업무·도구·목표의 지속적인 통합 판단.** F6은 F2에서 확보한 출처/Version을 재사용하고, 다른 Workstream까지 포함한 의존·우선순위·변경 Drift와 Owner 결정을 종합한다. F6은 단순 Wiki 검색의 새 이름이 아니다.
- **F3 = 단일 승인 작업의 실행·독립 검수·완료 증거; F4 = 동일 Objective 내 여러 F3 실행을 이어 관리하는 운영 모드.** F4의 재배정·중단·Resume·Fan-in은 F3의 PASS 하나로 입증되지 않는다.
- **F5 = 모든 실행 기능이 의존하는 연결 계층:** Private 지침(정책·모델/권한) → Runtime Adapter(웹/클라우드/로컬 능력 확인) → Public `oh-my-ai` Skill/Hook(실제 발견·로딩) → 지원되는 Actor/Tool(승인된 실행). Skill 파일 발견·지침 텍스트 참조·실제 로딩·실행·검증은 서로 다르다.
- **F6 = 최종 통합 경험:** Jira는 업무 상태, GitHub/승인 Git Docs는 코드·검증·계약, Confluence는 사람용 Projection, 기존 Git Docs 묶음은 목적별 지식 참조다. 변경을 일괄 자동 동기화하거나 Authority를 임의 승격하지 않는다.

## 3. 지금 우선 처리할 기능 순서

1. **P0 — F1 한글화·핵심정리의 실제 작성 적용:** #86 §5 초안을 기준으로 기존 PR 템플릿/작성 경로에 최소 점검 연결, Commit·PR·MD 실제 Before/After 검증. Skill 중복 여부 감사 후 최소 구현 결정.
2. **P0 — F2 AI 업무 파악 완성:** #85 독립 Review/기존 Finding Closure와 필요한 Jira·정본·Skill 확인, 불필요한 Jira 생성 금지.
3. **P0 — F3 업무 한 건 E2E:** 실제 지원 가능한 환경 하나에서 Intent → Context → 실행 → 독립 Review → 사람용 최종 결과 재현.
4. **P1 — F4 연속 운영 실증:** 34/34 합성 Fixture의 실제 인계/재현과 READY 재배정·BLOCKED 격리·Checkpoint/Resume·Fan-in 실사용 검증. 정책과 Scope Owner 승인 선행.
5. **병행 기반 — F5 멀티 AI 환경 연동:** F2/F3부터 필요한 Runtime의 Capability/비용·실제 Skill/모델/Speed를 점진 확인하고 후속 환경으로 확대.
6. **후속 최종 목표 — F6 통합 업무 오케스트레이션:** 각 기능을 활용해 전체 Workstream의 Jira·PR·Docs·Confluence 현황, 의존성·Drift·우선순위·차단·Owner 결정을 연계하는 상위 운영 경험을 완성.

**첫 번째 사용자 MVP:** “PR 수정 시작해줘” → 기존 Issue/Docs/PR 확인 → 해당 환경에서 승인된 작업 실행 → 고정 HEAD 독립 검수 → 사람이 읽기 쉬운 결과 보고. **모든 환경 통합이나 F6 완성을 기다리지 않고 하나의 지원 환경에서 먼저 증명한다.**

## 4. Governance·책임·오해 방지

- Main Personal AI 세션은 F1~F6 통합 설계·검증과 [Governance #49](https://github.com/ranikun-labs/harness-foundation-docs/pull/49)를 조정한다. Jira Legacy G2/G3/G4 이전 및 필드 정리는 별도 세션이 수행하며, [Foundation G2 #47](https://github.com/ranikun-labs/harness-foundation-docs/pull/47)은 Closure 증거만 연계한다.
- 현재 발효된 Foundation Governance **v1.2**를 따른다. [v1.3 PR #49](https://github.com/ranikun-labs/harness-foundation-docs/pull/49)의 Workstream별 Active Objective/병렬 실행 정책은 아직 Draft/NOT_EFFECTIVE다. Personal AI `/async-batch` 범위도 현재 승인된 개인 사이드프로젝트로 한정된다.
- Owner의 30~60분 확인은 목표 운영 주기이며, 백그라운드 상주·세션 종료 후 자동 재시작/알림·자동 Git Merge/Production을 약속하지 않는다.
- 별도 승인 없이 Jira/Confluence/Git의 데이터·정본 자동 변경, 신규 중앙 Scheduler, 제품·상용 V2/V3 아키텍처 변경을 진행하지 않는다.

**관련 증거:** [RPL-112](https://ranikunlabs.atlassian.net/browse/RPL-112), [#86](https://github.com/ranikun-labs/oh-my-ai/pull/86), [#85](https://github.com/ranikun-labs/oh-my-ai/pull/85), [Private #2](https://github.com/aixion1506/ai-instructions/pull/2). 34/34는 별도 세션이 제공한 보고이며 이 문서 작성에서 재실행하지 않았다.
