# Finding Delta Fix Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: Writer
- Mode: Finding Delta Fix
- Review Verdict / Head: `<verdict>` / `<reviewed sha>`

## Primary Jira

- Issue: `<same Primary Issue as original Writer>`
- Findings: `<blocking finding identifiers>`
- Writer Context: `<resumed session or exact handoff reference>`

## Repository / Base / Head

- Repository: `<owner/repository>`
- Base: `<branch@sha>`
- Working Branch / Expected Head: `<existing branch>` / `<sha>`
- Existing PR / Reviewed Head: `<number>` / `<sha>`

## 허용 작업

- 기존 Writer Session 재개 또는 기존 Writer Context의 정확한 Handoff 인계
- 동일 Primary Jira, Branch와 PR 유지
- 명시된 Finding의 최소 보정
- 작은 후속 Commit·Push와 Primary Issue Evidence 갱신

## 금지 작업

- 통과 영역 재설계·재작성
- 새 Issue·Branch·PR 생성, Ready 전환, Merge
- Reviewer 또는 Approver Metadata 선제 입력

## Verification

- Finding 해소와 통과 영역 Regression을 함께 확인한다.
- 새 Head와 Changed Files를 기록한다.

## 최종 보고

- Finding별 보정, 변경 파일, Commit / Head, 검증, 유지된 상태

## Next Single Action

`<independent re-review of the new head>`
