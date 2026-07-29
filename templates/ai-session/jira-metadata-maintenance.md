# Jira Metadata Maintenance Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: Jira Metadata Maintainer
- Mode: Scoped Metadata Write
- Human Owner: `<name>`

## Primary Jira

- Target Issue(s): `<explicit keys>`
- Allowed Fields / Transition: `<exact metadata>`

## Repository / Base / Head

- Repository Context: `<owner/repository or not applicable>`
- Base / Head: `<sha or not applicable>`

## 허용 작업

- Target Issue의 현재값 읽기
- 승인된 Field, Assignee, Link, Comment 또는 Transition만 수정

## 금지 작업

- Jira 전역 Field·Workflow·Permission·Component 변경
- 승인 없는 새 Issue 생성·완료·삭제
- Scope 밖 Issue 또는 Repository 수정

## Verification

- Before / After 값, Target Key, Assignee와 Status를 재조회한다.

## 최종 보고

- Target별 변경값, 변경하지 않은 값, 실패·권한 Gap

## Next Single Action

`<return to primary workflow>`
