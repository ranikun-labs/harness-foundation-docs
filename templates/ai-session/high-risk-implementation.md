# High-risk Implementation Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md)

## Role / Mode

- Role: High-risk Writer
- Mode: `<security | data | migration | runtime | broad repository change>`
- Risk Owner: `<human>`

## Primary Jira

- Issue: `<RPL-XXX>`
- Approved Risk Scope: `<scope>`

## Repository / Base / Head

- Repository: `<owner/repository>`
- Base: `<branch@sha>`
- Working Branch / Expected Head: `<branch>` / `<sha>`

## 허용 작업

- 승인된 Target과 Recovery 경계 안의 변경
- 사전 상태·대상·Rollback 조건 확인과 Evidence 기록

## 금지 작업

- 승인 없는 Production·Runtime·Secret·Migration 실행
- 대상 추정, Conflict 자동 해결, Review·Human Gate 생략
- Scope 밖 Jira 또는 Repository 수정

## Verification

- Preflight: `<state and target checks>`
- Safety / Recovery: `<checks>`
- Change: `<tests and diff checks>`

## 최종 보고

- 실제 변경, 영향, Recovery, 검증, 잔여 Risk와 중단 조건

## Next Single Action

`<independent high-risk review>`
