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
- Reviewed Base / PR Base: `<branch@sha>` / `<branch@sha>`
- Reviewed Head: `<exact sha>`
- Local / Remote / PR Head: `<sha>` / `<sha>` / `<sha>`

## 허용 작업

- 모든 Gate 충족 후 Ready 전환과 일반 Merge Commit
- Merge Commit Parent와 Base Branch의 Reviewed Head 포함 여부 확인
- Merge 성공 후 Primary Issue 최종 댓글, Evidence와 Status 갱신

## 금지 작업

- Branch Push, Commit 생성, 코드·문서·Finding 수정
- Base 변경, 검수되지 않은 Metadata Commit 추가
- 검수되지 않은 Head Merge
- Conflict 자동 해결, Rebase·Force Push·History Rewrite
- Merge 실패 시 Jira 완료

## Verification

- PR Base = Reviewed Base, PR Head = Reviewed Head
- Local / Remote / PR Head = Reviewed Head
- Reviewed Head 이후 미검수 Commit = 0, Blocker = 0, Major = 0
- 필수 Verification PASS와 Not Performed 기록
- Mergeable / CLEAN과 Human Approval Metadata
- 승인 Metadata Commit이 필요하면 Writer가 생성하고 해당 Head를 독립 검수
- Merge Commit Parent, Final Base SHA와 Reviewed Head 포함 여부

## 최종 보고

- 승인 Metadata, Ready, Merge 결과, SHA, Jira 상태, Working Tree

## Next Single Action

`<post-merge projection or follow-up issue>`
