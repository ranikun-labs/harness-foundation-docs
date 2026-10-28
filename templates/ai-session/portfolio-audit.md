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

> **v1.3 EFFECTIVE (2026-10-28T17:20:26+09:00):** 원 정책 PR #49와 Closure PR #51(`769ff99309a266c677b30104015672cc07e3df83`)이 병합됐다. 기존 전사 `진행 중 + 검토 중 ≤3` 상한은 **Workstream별 Active Objective 1개 + Objective 내부 병렬 실행**으로 부분 대체됐다. 기존 정본·Writer/Reviewer·Owner Merge·Production Gate는 보존한다. Reviewer의 실효 모델·Fast 설정은 UNKNOWN으로, 이 활성화 기록의 별도 독립 검수는 NOT_RUN으로 표기한다.

- Workstream별 **Active Objective 1개**, 대표 Jira·Owner·Coordinator·완료 조건·다른 Workstream 의존성
- Objective별 Primary Jira, 실제 진행·검토·WAIT·완료 상태; 상위 Epic/하위 Task 동시 ACTIVE는 그 자체로 오류가 아님
- Writer별 Sole Writer Session, Branch/Worktree, 수정 파일·모듈, 공유 API/Schema·계약 충돌
- 고정 Base/HEAD 독립 Reviewer, Finding, 새 HEAD 재검수, PR Fan-in/통합 E2E, Owner Merge·Production Gate
- 전사 ACTIVE 총수는 관찰 지표이며, v1.3 발효 후 숫자만으로 Jira 상태 변경·작업 차단하지 않음
- Jira 분류·Assignee·PR/Head·Canonical Link의 실제 증거와 Source Revision

## 최종 보고

- Scope, WIP, Gap, Drift, Blocker, 제안된 우선순위와 미검증 항목

## Next Single Action

`<one approved remediation or admin proposal>`
