# Jira Metadata Maintenance Session

> 공통 규칙: [AI Session Governance](../../docs/governance/ai-session-governance.md) · [Portfolio Work Governance](../../docs/governance/portfolio-work-management-governance.md) · [Jira Taxonomy/CRUD Gate](../../docs/governance/jira-field-taxonomy.md) (**승인·발효 여부 확인 필수**)

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

## Jira 쓰기 사전 Gate

- GitHub `main`의 승인·발효된 정책 파일을 실제로 조회하여 경로·SHA·문서 상태를 기록한다. 이 템플릿의 Proposed Taxonomy만으로 새 필드가 발효됐다고 간주하지 않는다.
- 대상 Jira Issue, Role, 허용된 필드, Jira Field ID/Option ID와 현재값, 변경 후 기대값을 사전 확인한다.
- Jira의 신규 옵션 자동 생성, 추정 매핑, 명시 승인 없는 Product(소유권) 이전을 금지한다.
- 현재 Jira Issue Type에 따른 실제 지원 필드 및 Taxonomy의 G0~G4/Migration Manifest 상태를 확인한다. 미전환 Issue는 승인된 레거시 정책으로 운영한다.
- 신규 분류 필드 미존재/미발효만으로 기존 Comment·Transition·비분류 Update를 중단하지 않는다. 분류 권위 충돌, 임의 fallback/dual-write, Owner 미승인 소유권 이전·일괄 수정에는 **해당 분류 WRITE STOP**.
- SSOT 접근 실패, 실제 Jira 설정과 발효 정책 불일치 시 검증하지 않은 원격 쓰기를 중단한다.

## 허용 작업

- Target Issue의 현재값 읽기
- 승인된 Field, Assignee, Link, Comment 또는 Transition만 수정

## 금지 작업

- Jira 전역 Field·Workflow·Permission·Component 변경
- 승인 없는 새 Issue 생성·완료·삭제
- Scope 밖 Issue 또는 Repository 수정

## Verification

- Before / After 값, Target Key, Assignee와 Status를 재조회한다.
- 적용한 정책 Git SHA, Jira 실제 Field/Option ID, 변경 실패·미변경 필드를 보고한다.

## 최종 보고

- Target별 변경값, 변경하지 않은 값, 실패·권한 Gap

## Next Single Action

`<return to primary workflow>`
