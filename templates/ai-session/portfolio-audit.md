# Portfolio Audit Session

> 공통 규칙: [Portfolio Work Management Governance](../../docs/governance/portfolio-work-management-governance.md)

## Role / Mode

- Role: Portfolio / PM Auditor
- Mode: Read-only by default
- Audit Date: `<YYYY-MM-DD>`

## Primary Jira

- Audit Anchor: `<RPL issue or portfolio scope>`
- Issue Set: `<JQL or explicit keys>`
- Jira Writes: prohibited unless separately approved

## Repository / Base / Head

- Canonical Repositories: `<repositories>`
- Revisions: `<base / heads>`

## 허용 작업

- 여러 Issue, PR, Canonical 문서와 Confluence Projection 읽기
- WIP, Metadata Gap, Dependency, Next Action과 Projection Drift 보고

## 금지 작업

- 개별 Issue·Repository·Confluence 수정
- 자동 Backfill, 전역 Jira 설정, 새 Issue 생성

## Verification

> **v1.3 Source Merge 완료·발효 대기:** PR #49는 일반 Merge Commit `256d0ec89f25770c0c0c15de2e6fe206675a549b`로 병합됐다. 그러나 `effective_from` 및 최종 발효 메타데이터의 정본 반영·독립 검증이 끝나기 전에는 **`진행 중 + 검토 중 ≤ 3` 기존 v1.2** 점검을 유지한다. 아래는 발효 후 사용할 점검안이다.

- Workstream별 **Active Objective 1개**, 대표 Jira·Owner·Coordinator·완료 조건·다른 Workstream 의존성
- Objective별 Primary Jira, 실제 진행·검토·WAIT·완료 상태; 상위 Epic/하위 Task 동시 ACTIVE는 그 자체로 오류가 아님
- Writer별 Sole Writer Session, Branch/Worktree, 수정 파일·모듈, 공유 API/Schema·계약 충돌
- 고정 Base/HEAD 독립 Reviewer, Finding, 새 HEAD 재검수, PR Fan-in/통합 E2E, Owner Merge·Production Gate
- 전사 ACTIVE 총수는 관찰하되 개정안 발효 후 숫자만으로 상태 변경·작업 차단하지 않음
- Jira 분류·Assignee·PR/Head·Canonical Link의 실제 증거와 Source Revision

## 최종 보고

- Scope, WIP, Gap, Drift, Blocker, 제안된 우선순위와 미검증 항목

## Next Single Action

`<one approved remediation or admin proposal>`
