---
title: "Jira G2 — 118/118 Migration Completion Projection (2026-10-23)"
projection_status: verified_data_migration
as_of: "2026-10-23 KST"
scope: "RPL all 118 issues"
source_authority: live_jira_and_private_git_audit
read_authority: legacy_until_separate_g3_cutover
write_authority: frozen
g2_data_migration_status: passed
admin_metadata_review_status: pending
g3_cutover_approval: null
---

# Jira G2 — 전체 118건 데이터 이전 완료 (2026-10-23)

> **현재 Projection** — 2026-10-21의 [시점별 감사 기록](jira-g2-migration-status-projection-2026-10-21.md)은 역사 기록으로 유지한다. 이 문서는 2026-10-23 실제 Jira 전수 재조회·Git 증거에 근거한 최신 요약이다. **필드 저장 완료는 G3 Read/Write 권위 전환 또는 신규 생성 허가가 아니다.**

## 1. 30초 결론

RPL 전체 **118개 Jira 이슈의 신규 Target Product·Component가 모두 저장**됐다. Story 4건과 Subtask 8건도 기존 Target 필드 3개를 해당 유형에 연결한 후 이전했다. Target 둘 다 미입력 **0건**, 하나만 입력 **0건**. 기존 Legacy Product/Component/Labels, 제목·상태 등 비대상 필드의 보존 검증은 아래 근거 범위에서 PASS다.

| 구분 | 건수 | 근거 범위 |
|---|---:|---|
| 기존에 Target이 저장돼 있던 이슈 | 27 | 이번 전체 이전 전 기존 데이터. **RPL-112/113/114 Origin 미확인 격리 유지** |
| 2026-10-23 선행 이전 | 31 | Target Product·Component 변경 및 재조회·롤백 기록 |
| 2026-10-23 추가 이전 | 48 | Target Product·Component 변경 및 재조회·롤백 기록 |
| 2026-10-23 마지막 Story·Subtask | 12 | 관리자 기존 필드 연결·개별 Before/After·Jira Changelog·Rollback |
| **Target 저장 총합** | **118/118** | Jira JQL 전수 조회; **0 missing / 0 partial** |

변경 91건(31+48+12)의 롤백 원장이 저장됐으며, 앞서 존재하던 Target 27건에 새로운 변경이 발생했다는 뜻은 아니다. Jira Changelog를 삭제할 수 있는 완전한 시간 되돌리기를 약속하지 않는다. 기존 Legacy 권위는 유지한다.

## 2. 실제 변경·검증

- Jira Team-managed 프로젝트 `RPL`; Story (`10011`)·Subtask (`10008`)에 **이미 존재한** `Product (Target)` (`customfield_10108`), `Component (Target)` (`customfield_10109`), `Concern (Target)` (`customfield_10110`)을 재사용해 연결. 신규 필드·신규 옵션 생성 없음.
- Story 4건은 `dev-harness/ai`, Subtask 7건은 `dev-harness/infra`, 다른 Subtask 1건은 `dev-harness/backend`. 각 이슈의 본문·책임·Parent를 검토했으며 Parent만으로 대표 Product를 단정하지 않았다.
- 마지막 12건에 대해 변경 전후 Description Native ADF·제목·상태·Parent·Links·Legacy·Concern 보존 비교, 대상 Target Changelog 및 복구값 기록. 기존 106건은 Target 값과 Jira `updated`가 마지막 작업 전후 동일함을 확인.
- 최종 전수 검증은 118개 Issue를 페이지로 나누어 조회한 결과다. 전체 Description 일괄 응답은 시간 초과가 있었으며, 모든 이슈의 전체 Description을 동시에 새로 재검증했다고 주장하지 않는다.
- 변경된 12건의 관리자 화면 스크린샷은 캡처 타임아웃으로 확보하지 못했다. Jira UI 저장 신호·실제 API 메타데이터·Issue 필드 재조회로 검증했다.
- 단일 Writer 수행. **별도 독립 Reviewer·모델/Fast 설정·Native Node 테스트가 G2 최종 변경에서 실제 실행됐다는 주장은 하지 않는다.**

**비공개 감사 증거:** `ranikun-labs/platform-services` / `audit/jira-g2-full-118-20261023` / [Git Commit `530dd0f`](https://github.com/ranikun-labs/platform-services/commit/530dd0f88e5819158362b620ca1591779a50cba5)

- [최종 결과](https://github.com/ranikun-labs/platform-services/blob/530dd0f88e5819158362b620ca1591779a50cba5/governance/jira-g2-full-118/final118-result-20261023.md)
- `final118-verification-20261023.json`: 실제 118건 최종 상태
- `final12-before-after-rollback-20261023.json`: 마지막 12건 증거
- `admin-story-subtask-final12-20261023.json`: 관리자 변경 전후 메타데이터
- 선행 31·48건 롤백 명세와 `postresume-118-audit-20261023.json`: 이전 배치 증거

## 3. 아직 완료되지 않은 운영 Gate

| 항목 | 현재 판정 | 다음 결정 |
|---|---|---|
| **G2 데이터 저장** | **PASS — 118/118** | 별도 관리자·증거 검수 후 G2 Governance Closure |
| **관리자 Create 메타데이터** | **REVIEW_PENDING** | Story/Subtask `issuetype.required` 전후 `true→false` 원인·실제 생성 의미 확인. 사용자 조작으로 Required/Default를 변경했다는 증거 없음 |
| **G3 Task Target-only Create** | **BLOCKED** | Task 현행 Legacy Product/Component/Labels `required=true`; Legacy Product·Component에 복수 기본값 있음. **신규 Target Product/Component도 `required=false`여서 현재 G3 Trusted Gate가 요구하는 `required=true`와 불일치**. 시작일·담당자·기한 등 별도 필수 조건도 남음. Task Work Type 한정 Admin 범위·다른 유형 영향·승인 Gate 필요 |
| **G3 Connector 실연동** | **CHANGES_REQUIRED_BEFORE_LIVE** | 기존 PR [#83](https://github.com/ranikun-labs/oh-my-ai/pull/83) → [#84](https://github.com/ranikun-labs/oh-my-ai/pull/84) Draft. 이전에는 실제 Atlassian Rovo `structuredContent.issues.nodes/pageInfo`, API `self` 도메인·`webUrl` 정규화가 누락됐으나, [PR #84 최신 HEAD `9484ff2`](https://github.com/ranikun-labs/oh-my-ai/commit/9484ff255fab87790be837bc304fb797e8c4b1a7)에서 해당 2개 파일을 보완. Codex Cloud 실행 보고 기준 Native 5 Suite·회귀 118개 PASS. **실제 운영 Jira Connector 인증/InvokeTool E2E·Create는 계속 NOT_VERIFIED** |
| **Read Authority / G3 Cutover** | **NOT_APPROVED** | 기존 Legacy가 Read Authority. `RPL-112/113/114`는 출처 미증명으로 격리. Story/Subtask 포함 118건 전체 신규 권위 전환은 별도 Reader 타입 지원·Origin·증거 Gate 필요 |
| **G4 Legacy 삭제** | **NOT_APPROVED** | 신규 생성·Reader/Board/Automation 전환·복구 검증 이후 별도 승인 |
| RPL-111·RPL-82/83 | **별도 후속** | 전자는 과거 JetStream 본문과 새 SQS ADR 간 정합화, 후자는 중복 가능성 확인. 분류 저장 성공과 별개 |

**`issuetype.required` 참고:** 2026-10-23 현재 Story/Subtask는 `false`로 관측되지만 기존 Task도 `false`를 반환한다. 반면 Story/Task `summary.required=true`, Subtask `parent.required=true`는 유지된다. 이 관측만으로 실제 Jira 생성 필수조건이 삭제됐다고 결론 내리지 않으며, G3 생성 요청은 언제나 명시적 Issue Type을 전달한다.

## 4. 실행·권한 구분

- 이 문서는 **읽기 전용 Projection**이며, Jira Create/Update/Admin, Source Merge, G3 Activation, Target Read Authority Cutover, G4 Legacy 삭제의 실행 권한을 부여하지 않는다.
- 다음 게이트는 G3 Draft PR의 실제 Rovo 응답 정규화·Native 독립 검수와 Task의 Legacy required/default에 대한 **별도 Jira Admin 승인**이다. 시험 Create는 최대 1건이라도 승인·검증을 먼저 거쳐야 한다.
- Taxonomy v1.0의 2026-10-15 역사적 정책 승인 상태와 2026-10-21 감사 기록은 수정하지 않는다.
