# Session Handoff

> 권한과 Lifecycle: [AI Session Governance](../../docs/governance/ai-session-governance.md) · [Handoff Governance](../../docs/handoffs/README.md)

## Role / Mode

- From Role / Session: `<role>`
- To Role / Mode: `<next role>`
- Handoff Status: `<candidate | ready | consumed>`

## Primary Jira

- Issue: `<RPL-XXX>`
- Current Status / Next Action: `<status>` / `<action>`

## Repository / Base / Head

- Repository: `<owner/repository>`
- Base / Branch / Head: `<values>`
- PR / Reviewed Head: `<values or not applicable>`

## 허용 작업

- 확인된 상태, Decision, Evidence, Finding과 남은 작업 전달
- 새 Session이 재검증해야 할 값 명시

## 금지 작업

- 새 실행·쓰기·승인 권한 부여
- 미검증 값을 사실 또는 PASS로 승격
- Secret·Credential·실제 Host/IP 포함

## Verification

- 전달 직전 Jira, Git Status, Head, PR와 필요한 외부 상태를 재확인한다.

## 최종 보고

- 완료, 변경, 검증, 미완료, Blocker, Do Not Touch, References

## Next Single Action

`<exactly one action for the receiving session>`
