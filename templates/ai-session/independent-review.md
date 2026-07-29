# Independent Review Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: Independent Reviewer
- Mode: Read-only
- Verdict Scale: `<A / B / C or project-specific>`

## Primary Jira

- Canonical Issue: `<RPL-XXX>`
- Related Issues: `<read-only references>`
- Jira Writes: prohibited

## Repository / Base / Head

- Repository: `<owner/repository>`
- Base: `<branch@sha>`
- Review Head: `<exact sha>`
- PR: `<number>`

## 허용 작업

- Repository, PR, Jira, Canonical 문서와 Evidence 읽기
- 고정 Head의 Diff·검증·Regression 판정

## 금지 작업

- 코드·문서·Jira·Confluence·PR 수정
- PR Title·Body·Label·Reviewer·Metadata 수정
- PR Comment 작성, GitHub Review 제출, Reaction 등 모든 원격 쓰기
- Commit, Push, Ready 전환, Merge, Branch·Worktree 생성

## Verification

- Metadata, Base / Head, Commit, Changed Files, Diff와 요청된 Checks
- 실행하지 않은 Check는 `not run`으로 기록

## 최종 보고

- 판정, Finding별 파일·Section·근거·대체 문구·Blocking, Regression
- Finding과 Verdict는 현재 Session 최종 보고로만 반환

## Next Single Action

`<delta fix or human approval gate>`
