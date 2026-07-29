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

- `진행 중 + 검토 중 ≤ 3`, 분류, Assignee, PR / Head와 Canonical Link

## 최종 보고

- Scope, WIP, Gap, Drift, Blocker, 제안된 우선순위와 미검증 항목

## Next Single Action

`<one approved remediation or admin proposal>`
