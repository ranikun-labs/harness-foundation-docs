# Merge Gate Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: Merge Gate Operator
- Mode: Approval Metadata / Ready / Merge
- Human Approver: `<name>`

## Primary Jira

- Issue: `<merge target Primary Issue>`
- Required Final Status: `<status after successful merge>`

## Repository / Base / Head

- Repository / PR: `<owner/repository>` / `<number>`
- Base: `<branch@sha>`
- Reviewed Head: `<exact sha>`

## 허용 작업

- 승인 Metadata, 동일 Branch Push, Ready 전환, 일반 Merge Commit
- Merge 성공 후 Primary Issue Evidence와 Status 갱신

## 금지 작업

- 검수되지 않은 Head Merge
- Conflict 자동 해결, Rebase·Force Push·History Rewrite
- Merge 실패 시 Jira 완료

## Verification

- PR Head = Reviewed Head, Base 최신, Mergeable, Checks와 Human Approval
- Merge Commit, Final main SHA와 Head 포함 여부

## 최종 보고

- 승인 Metadata, Ready, Merge 결과, SHA, Jira 상태, Working Tree

## Next Single Action

`<post-merge projection or follow-up issue>`
