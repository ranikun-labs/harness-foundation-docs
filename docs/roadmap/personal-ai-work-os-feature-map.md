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
| **F1** | **한국어 커뮤니케이션 품질 (한글화·핵심정리)** | PR·Commit·Jira·ADR·Markdown·Confluence를 실험 일지 대신 **문제 → 개선 → 검증 → 남은 일** 중심으로 쉽게 작성 | Private 원칙과 #86 설계 계약 존재. 공용 Skill·자동 저장 전 품질 검사는 미구현/미검증 | RPL-112·114·115·118 |
| **F2** | **AI 업무 파악** | “로그인 오류 고쳐줘”에서 의도·기존 Jira·관련 코드/문서·Skill 후보를 필요한 만큼 찾아 보여줌 | 기존 Skill Index·Advisory Hook 일부 구현, #85 Draft. Runtime 통합 미검증 | RPL-113 |
| **F3** | **AI 작업 실행·검수** | 승인된 **업무 한 건**을 실제 실행하고 독립 검수·결과 보고까지 완주 | Worker/Result 계약 존재, 전체 실제 E2E NOT_RUN | RPL-115 |
| **F4** | **AI-driven 연속 운영** | 승인된 Objective 안에서 다음 READY 재배정, BLOCKED 격리, Checkpoint/Resume, 전체 Fan-in | 로컬 합성 Fixture 34/34 PASS는 별도 세션 보고. 실제 Subagent·통합 E2E NOT_RUN | RPL-115·116 |
| **F5** | **멀티 AI 환경 연동** | 같은 지침을 각 환경에 맞게 적용하고 ChatGPT·Codex·Claude 및 가능한 실행기/Skill을 선택 | Private #2 Validator CI PASS. 실제 설치·Runtime별 동작 및 모델/Speed Guard 미검증 | RPL-114·116·117·118 |
| **F6** | **통합 업무 브리핑 → 오케스트레이션** | Jira 업무·의존성과 GitHub PR/코드·Docs 계약·Confluence 목표를 함께 보아 **전체 우선순위·차단·진척·다음 결정**을 조정 | 목표 아키텍처/계약 초안. 다중 업무의 실제 지속적인 통합 관제 미구현·미검증 | RPL-112·113·115·118 |

**상태 읽는 법:** “계약/후보 존재” ≠ “실제 Runtime에서 동작” ≠ “독립 Review/Source Merge 완료”. Jira는 완료/진행 상태의 운영 원본이며, 기술 PASS의 증거는 PR/CI/실측 결과를 따른다.

## 2. 겹치는 것처럼 보이는 기능의 정확한 경계

- **F1 = 상시 기본 작성 품질 + 선택형 전문 Skill:** 산출물 저장 시 독자 중심 표현과 사실 보존은 늘 적용할 목표 원칙이다. 긴 문서 교정, 형식별 전문 Review/rewrite가 필요할 때 별도 `engineering-communication-ko` Skill 후보를 선택한다. Private 지침에 전체 절차를 복사하지 않으며 **현재 자동 로딩·저장 전 검사 구현을 보장하지 않는다**. 실험·감사 로그는 원자료가 본래 산출물이면 보존하되 먼저 이해하기 쉬운 요약을 제공한다.
- **F2 = 지금 요청한 한 업무의 진입·맥락 확인; F6 = 여러 업무·도구·목표의 지속적인 통합 판단.** F6은 F2에서 확보한 출처/Version을 재사용하고, 다른 Workstream까지 포함한 의존·우선순위·변경 Drift와 Owner 결정을 종합한다. F6은 단순 Wiki 검색의 새 이름이 아니다.
- **F3 = 단일 승인 작업의 실행·독립 검수·완료 증거; F4 = 동일 Objective 내 여러 F3 실행을 이어 관리하는 운영 모드.** F4의 재배정·중단·Resume·Fan-in은 F3의 PASS 하나로 입증되지 않는다.
- **F5 = 모든 실행 기능이 의존하는 연결 계층:** Private 지침(정책·모델/권한) → Runtime Adapter(웹/클라우드/로컬 능력 확인) → Public `oh-my-ai` Skill/Hook(실제 발견·로딩) → 지원되는 Actor/Tool(승인된 실행). Skill 파일 발견·지침 텍스트 참조·실제 로딩·실행·검증은 서로 다르다.
- **F6 = 최종 통합 경험:** Jira는 업무 상태, GitHub/승인 Git Docs는 코드·검증·계약, Confluence는 사람용 Projection, 기존 Git Docs 묶음은 목적별 지식 참조다. 변경을 일괄 자동 동기화하거나 Authority를 임의 승격하지 않는다.

## 2-1. F1의 실행 구조: 기본 작성 품질 + 한국어 윤문 Skill

**F1의 최종 사용자 경험:** 사용자가 따로 명령하지 않아도 AI가 PR·Commit·Jira·Markdown·Confluence를 **(a) 자연스러운 한국어**와 **(b) 제3자가 이해할 수 있는 업무 결과**로 작성하고, 저장 전에 원문 사실과 실제 검증 증거가 유지됐는지 점검한다.

- **상시 기본값 — 업무 핵심정리:** 글의 목적·이전 문제 → 실제 변경과 효과 → 테스트·미검증 → 남은 결정 순서로 작성한다. 내부 시행착오·도구 실행 기록은 본문이 아니라 Evidence에 보존한다. 단순 기술 코드·로그·인용·감사 증거는 필요하면 원형을 유지한다.
- **선택형 전문 Skill — 한국어 자연화:** 어색한 번역체·AI 상투어·과도한 피동·장식 표현을 필요한 부분만 교정한다. 'AI 흔적만 진단', '다듬어줘', 특정 분량·문체 요청에 적합하다. 윤문으로 새로운 사실이나 결과를 생성하지 않는다.
- **참고 방법론:** [NomaDamas/k-skill의 korean-humanizer 가이드](https://github.com/NomaDamas/k-skill/blob/main/docs/features/korean-humanizer.md). 해당 프로젝트는 **MIT License**. 탐지→윤문→감사, 원래 의미·고유명사·수치 보존, 과수정 경고/중단 기준을 참고한다. 원본 Skill의 내용·CLI를 무단 설치·복사하거나 우리 Runtime에서 이미 동작한다고 주장하지 않는다. 실제 채택 시 공급망·License 공지와 테스트를 별도로 확인한다.
- **범위 경계:** 한국어 윤문은 사실 검증·독립 Review가 아니다. 핵심정리도 PR/CI를 실제 실행하거나 Source Merge를 승인하지 않는다. 자동 적용은 Private/Runtime Adapter와 Public 작성 경로 연동 및 실제 설치 검증이 있어야 완료된다.

**F1 실사용 완료 기준:** 별도 `/한글화` 입력 없이 승인된 실행 환경에서 **Commit·PR·Markdown 각 1건 이상**을 작성할 때 기준이 적용되고, 원문 SHA/수치/경로/계약/테스트 PASS·NOT_RUN/승인 상태가 유지됨을 확인한다. 자연스러움은 사람이 Before/After를 검수하고, 자동 검사는 보조 신호로만 사용한다. 부적절한 수정은 원문 유지·수동 Handoff를 선택한다.

## 2-2. F6은 처음부터 읽기 전용으로 제공한다

**F6 Lite — 통합 업무 브리핑:** “지금 뭐가 진행 중이고, 무엇이 막혔고, 다음으로 뭘 해야 해?”라고 물으면 Jira의 실제 상태·GitHub PR/CI·승인 Git Docs·Confluence 목표를 출처별로 읽고 **완료·진행·차단·Owner 결정·다음 추천**을 한 번에 보여준다. 자동 Jira/Docs 수정은 하지 않는다. 각 도구의 데이터가 서로 다르면 충돌을 표시하고 권위 있는 소스를 확인한다.

**F6 Full — 통합 업무 오케스트레이션:** F2의 요청 파악·F3의 실행 검수·F4의 승인 범위 내 연속 운영·F5의 도구 연결을 조정해 실제 업무를 진전시킨다. F6 Lite와 달리 실행과 변경이 포함되므로 각각의 Owner·Governance·Writer Gate가 필요하다. **완료 기준:** 복수 업무의 의존·차단·PR 검증·다음 우선순위를 증거로 보고하고, 승인된 범위의 실행과 통합 결과를 명확히 구분해 재현한다.

## 2-3. F4 — AI-driven 연속 운영 (Codex Cloud 우선)

**앞으로 이 운영 방식을 부르는 이름은 F4. AI-driven 연속 운영이다.** 사용자 약속은 “승인된 목표 안에서는 AI가 독립 업무를 이어서 처리하고, Owner는 협업 모드에서는 대략 1시간, 집중/장기 위임 모드에서는 3~6시간 등 선택한 검토 시점에 핵심 성과·차단·중요 결정만 확인한다”이다. 여러 Writer를 동시에 돌리는 `/async-batch`는 **F4 안의 병렬 모드**이고, 여러 프로젝트 전체를 조정하는 **F6 통합 업무 오케스트레이션과는 구분**한다.

**권장 실행 방식:** 현재 지원·권한이 확인된 경우 **Codex Cloud의 격리된 작업 공간**을 우선 실행 후보로 사용한다. 한 Objective의 독립된 Primary Jira 작업마다 **별도 작업 공간·작업 지시·변경 파일 영역**을 할당한다. Cloud에서 실제 Subagent 생성 API가 있는지 여부는 환경별로 확인하며, **Cloud의 복수 작업 공간과 한 세션 내부 Subagent 자동 위임은 동일한 기능이라고 가정하지 않는다**. 지원된다면 Cloud 작업 내부의 읽기/분석 및 충돌 없는 세부 작업만 Subagent로 Fan-out한다. 비용·작업량이 작거나 Cloud 도구가 없으면 지원 가능한 현재 실행기 또는 명시적 Handoff를 사용한다.

| 사용자 기준 운영 단계 | 반드시 지킬 조건 | 완료 확인 |
| --- | --- | --- |
| **목표 승인** | 기존 Governance·Owner가 승인한 Objective와 범위, Primary Jira 식별. 현재 발효 v1.2 WIP 한도 적용 | Objective·Issue·승인 범위·지원 Runtime 확인 |
| **병렬 배정** | Git Worktree/Branch/수정 경로가 겹치지 않는 READY만 별도 Writer에 배정. 공유 API·DB·Auth는 Owner·순서 선확정 | 충돌 없는 작업별 Assignment |
| **연속 처리** | 완료 슬롯에 같은 승인 범위의 다음 READY를 배정. 막힌 업무는 BLOCKED로 격리하고 다른 READY는 진행 | 다음 배정 근거·Checkpoint |
| **독립 검수** | Writer 자체 PASS, CI PASS, 독립 Reviewer PASS, 통합 E2E PASS를 따로 판단. 변경 HEAD는 재검수 | HEAD·테스트·Finding·Reviewer Evidence |
| **Owner 검토** | 실제 성과/검증 → 진행/차단 → 다음 READY → 승인 필요한 결정으로 짧게 보고. Merge·정본 승격·배포는 별도 Owner 승인 | 사람이 바로 판단할 한국어 브리핑 |

### 위임 시간에 따라 바뀌는 세 가지 운영 모드

F4의 **운영 모드**는 단순 Scheduler 주기가 아니다. Owner 복귀·확인 간격을 나타내는 `review_horizon`과 작업별 `execution_budget`, 승인된 `execution_scope`·`risk_limit`·`cost_budget`·`max_parallel_tasks`·`stop_conditions`·`handoff_requirements`를 별도로 조합한다. `review_horizon` 프리셋 `1h/3h/6h`는 체크인·보고 시점이며 `execution_budget`가 아니다. 해당 시간 동안의 연속 실행, 자동 재개 또는 Runtime capability를 뜻하지 않는다. 사용자가 자리를 비워도 새 승인이나 전사 WIP 예외는 생기지 않는다.

| 공식 모드 | Owner 상황 | AI가 할 일 | Owner가 돌아올 때 받는 것 |
| --- | --- | --- | --- |
| **F4-1H / 협업 모드** | 대화하며 일하고 빠르게 검토 | 이미 승인된 작은 작업 묶음, 1시간 내외 체크포인트 | 핵심 결과·현재 차단·필요 결정 간단 브리핑 |
| **F4-3H / 집중 위임 모드** | 다른 업무·외출·집중 시간 | 독립 READY의 연속 배정, 완료별 Evidence와 Checkpoint 축적 | 완료한 PR/Commit·검증·실패·다음 READY·중요 결정의 중간 깊이 인계 |
| **F4-6H / 장기 위임 모드** | 휴식·취침·장시간 부재 | 승인 범위 내 여러 작업을 연결해 진행. 위험 작업은 중단하고 다른 안전한 READY 수행 | 변경 순서, 작업별 HEAD/테스트/독립 Review, 실패·재시도·차단·남은 승인과 다음 추천을 확인하는 상세 복귀 리포트 |

**체크인·실행 예산 정책:** `review_horizon` `1h/3h/6h`는 Owner 복귀·보고 주기이고 실제 코딩 시간과 별도다. 각 무인 코딩 실행의 `execution_budget`은 실행 상한이다. 초기 실행 예산은 `30m`와 `1h`; `3h`/`6h` 실행은 해당 Runtime의 무인 실행 E2E Evidence와 별도 Owner 승인이 모두 갖춰진 뒤에만 허용한다. `CUSTOM`에는 Owner가 `execution_scope`, `risk_limit`, `cost_budget`, `max_parallel_tasks`, `stop_conditions`, `checkpoint_ref` 및 `evidence_refs` 요건을 구체적으로 승인해야 한다. 이 사용자용 Projection은 예산 설정의 Runtime 지원이나 F4 완료를 증명하지 않으며, 실제 지원과 effective budget은 실행 Evidence로 별도 확인한다. 어떤 예산도 Task가 해당 시간 내내 실행된다는 보장은 아니다. 중간 Checkpoint는 실제 Task 완료·의존성/위험 변화·Runtime 이벤트 기준으로 남긴다. Owner 부재 중에도 별도의 정책 위험·비용 한도·토큰/Tool 제한·실패 누적·예산 초과·Shared Contract 충돌이 발생하면 즉시 안전하게 중단한다. 오류 때문에 중단돼도 이미 검증된 결과는 보존하고 자동 재시도는 신뢰할 수 있는 멱등 조건에서만 한다.

**Owner 복귀 프로토콜:** (1) 지금까지 **실제로 완료한 업무**, (2) PR/HEAD와 테스트·Reviewer·통합 상태, (3) 막힌 업무와 영향, (4) 다음 승인 범위의 READY, (5) 결정이 필요한 사항을 구분해 기록한다. 리뷰 시 Owner가 `계속 진행 / 방향 수정 / 승인 보류 / 중단 / 모드 변경(F4-1H↔3H↔6H)`을 선택하면 **그 시점의 Checkpoint를 기준으로 새 승인 범위**를 재평가한다. Owner가 부재하는 동안 미응답 승인을 자동 긍정하지 않는다.

**실제 지원 경계:** 현재 활성화된 **매시간 자동 점검**은 별도 실행으로 소스를 조회·브리핑할 뿐 F4-3H·F4-6H의 3/6시간 상주 개발을 실현하지 않는다. Codex Cloud Task/내부 Subagent의 생성·실행·상태 추적/재개가 검증되어야 해당 모드를 실제 E2E PASS로 선언할 수 있다. 예약 자동화 주기와 위임 기간은 별도 설정이다. 현재 즉시 운용 중인 설정은 1시간 간격 상태 점검이며 3/6시간 모드는 설계·미구현 상태다.

### 실제 Codex Cloud 첫 검증 작업 (RPL-115, 구현과 검증 별개)

**Pilot 전제:** 현재 ChatGPT 메인 세션의 연결 도구에는 Codex Cloud Task 생성·실행 상태 조회가 없다. **Cloud 환경의 리포지터리 접근·실제 Tool 지원·Owner의 실행 Scope를 확인해야** Cloud Pilot을 시작할 수 있다. 이번 문서나 스케줄 생성만으로 Cloud Task가 실행된 것은 아니다. 별도 Cloud 환경에서 승인된 Pilot이 수행되면 다음 독립 작업으로 나눠 증거를 모은다.

1. **읽기 전용 Runner-A — F4 실행 능력 확인:** Codex Cloud가 `ranikun-labs/oh-my-ai`를 읽고 Node 테스트·환경 정보·Skill Index를 확인할 수 있는지 실측. Runtime·버전·Source SHA·PASS/NOT_RUN 기록. 코드 수정 금지.
2. **읽기 전용 Runner-B — 충돌·의존성 점검:** RPL-115, 현재 발효 v1.2, 관련 PR의 Branch/Writer/파일 소유권을 확인하고 READY/REVIEW_ONLY/BLOCKED 후보를 작성. Jira/PR 수정 금지.
3. **구현 Runner-C (별도 착수 Gate 이후):** 기존 RPL-115 Local Fixture/Queue 구현의 Source를 확보하고 **기존 코드 재사용**을 우선한다. 작업별 Writer가 배정된 별도 Branch/Worktree에서 다음 READY 재배정·BLOCKED 격리·Checkpoint/Resume·Fan-in 검증. 소스 없는 상태에서 중복 Engine 작성 금지.
4. **Independent Reviewer (구현 완료 후 별도 Session):** 실제 HEAD/Base·테스트 증거 검수. Writer·Reviewer 같은 작업 공간 혼용 금지. Verdict와 잔여 Risk를 Main에 인계한다.

**F4 완료 기준:** 실제 지원된 Cloud/Runtime에서 승인된 작업의 충돌 없는 병렬 배정 1회, 완료 후 다음 READY 재배정 1회, BLOCKED 격리 1회, Checkpoint/Resume 1회 및 고정 HEAD의 독립 Reviewer/Fan-in을 재현한다. 외부 도구 미지원·승인 미충족은 NOT_RUN/BLOCKED이며 모의 테스트 PASS로 대체할 수 없다.

**Owner 복귀 주기와 정기 자동화의 차이:** [현재 시간별 점검 자동화]는 한 시간마다 별도로 소스를 조회·점검하는 기능일 뿐 상주 코딩 Worker, Cloud Task 배정, 세션 종료 후 무인 Resume를 보장하지 않는다. Codex Cloud 작업이 실제로 만들어진 뒤 해당 작업의 실행·진행 여부를 별도 실측해야 한다.

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
- 현재 발효된 Foundation Governance **v1.2**와 전사 WIP≤3 상한을 따른다. [v1.3 PR #49](https://github.com/ranikun-labs/harness-foundation-docs/pull/49)의 Source Merge는 완료됐지만 병합만으로 v1.3이 발효되지는 않았다. [후속 발효 메타데이터 PR #51](https://github.com/ranikun-labs/harness-foundation-docs/pull/51)은 아직 열려 있고 미병합이며, 현재 `main`의 `effective_from`은 `null`이다. Governance v1.3은 #51 메타데이터가 승인·병합되고 `effective_from`이 검증될 때까지 **NOT_EFFECTIVE**이며, 그동안 v1.2의 WIP≤3이 계속 적용된다. 이 기능 지도는 사람용 reference projection이며 정책 권한이나 발효 근거가 아니다.
- Owner의 1/3/6시간 확인은 선택 가능한 검토 주기 목표이며, 백그라운드 상주·세션 종료 후 자동 재시작/알림·자동 Git Merge/Production을 약속하지 않는다.
- 별도 승인 없이 Jira/Confluence/Git의 데이터·정본 자동 변경, 신규 중앙 Scheduler, 제품·상용 V2/V3 아키텍처 변경을 진행하지 않는다.

**관련 증거:** [RPL-112](https://ranikunlabs.atlassian.net/browse/RPL-112), [#86](https://github.com/ranikun-labs/oh-my-ai/pull/86), [#85](https://github.com/ranikun-labs/oh-my-ai/pull/85), [Private #2](https://github.com/aixion1506/ai-instructions/pull/2). 34/34는 별도 세션이 제공한 보고이며 이 문서 작성에서 재실행하지 않았다.
