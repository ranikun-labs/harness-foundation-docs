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

> **v1.3 제안 — 미발효:** 새 Governance §4와 DEC-074가 독립 검수·최종 Owner 승인·Source Merge를 거치고 **발효 시각·승인 메타데이터의 정본 반영 및 유효성이 확인되기 전까지**는 `진행 중 + 검토 중 ≤ 3` 현행 v1.2 점검을 유지한다. 아래 항목은 개정 후 사용할 점검안이다.

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
