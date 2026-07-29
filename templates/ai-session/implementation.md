# Implementation Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: Writer
- Mode: Implementation
- Model / Reasoning: `<recommended model>` / `<reasoning>`

## Primary Jira

- Issue: `<RPL-XXX>`
- Scope / Next Action: `<scope>`

## Repository / Base / Head

- Repository: `<owner/repository>`
- Base: `<branch@sha>`
- Working Branch: `<branch>`
- Expected Head: `<sha or new branch from base>`

## 허용 작업

- Primary Issue Scope의 변경, 검증, 명시적 Stage·Commit·Push, Draft PR
- Primary Issue에 Branch, PR, Head와 실제 Evidence 기록

## 금지 작업

- Scope 밖 파일·Repository·Issue 수정
- 자기 결과의 독립 승인, Merge, Merge 전 Jira 완료
- 파괴적 Git 작업과 수행하지 않은 검증의 PASS 표기

## Verification

- `<command or check>`
- 변경 파일, Base Diff, Status와 Secret·Runtime 범위를 확인한다.

## 최종 보고

- Jira, Branch / Head, 변경 파일, Commit / PR, 검증, 미수행 항목, Risk

## Next Single Action

`<independent review request>`
