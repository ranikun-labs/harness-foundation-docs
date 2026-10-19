# AGENTS.md — Foundation Docs 작업 규칙

이 지침의 적용 범위는 **현재 `harness-foundation-docs` 저장소**이다.
다른 Repository의 Codex 세션에 이 파일이 자동 전파된다고 가정하지 않는다.

## Jira 또는 Jira 분류 문서를 다룰 때

1. `docs/governance/portfolio-work-management-governance.md`,
   `docs/governance/ai-session-governance.md`,
   `docs/governance/jira-field-taxonomy.md`를 확인한다.
2. **Jira 원격 쓰기 전에 GitHub `main`의 승인·발효 문서와 현재 Jira Field metadata/allowed options를 실제로 조회**한다.
   작업 브랜치의 `proposed`·`in_review` 문서는 작성·검토 용도로만 사용한다.
   승인 전 제안된 Product·Component·Concern 필드를 Jira에 있다고 가정하면 안 된다.
3. 작업 요청의 Role, Primary Issue, 명시적 쓰기 대상·필드·승인 범위를 먼저 검증한다.
   Reviewer/Portfolio Audit은 Jira Comment/Link 포함 **원격 쓰기 금지**.
4. Product 1개는 **목표 책임 원칙**이며, 실제 신규 Dropdown 저장은 Jira Issue Type별 지원과 Taxonomy G0~G4 Cutover를 확인한 경우만 수행한다. `Subtask/Story/Tech Debt` 등 기존 생성 스키마에 필드가 없다면 임의로 전달하거나 Parent에서 승인 Owner를 추론하지 않는다.
   정책이 아직 발효되지 않았거나 Manifest의 전환 대상이 아니면 **기존 승인 Governance/실제 레거시 필드 계약**을 따른다. 신규 옵션·권위 없는 분류 변경·불명확한 Owner는 중단하되, 현행 정책상 허용된 Comment/Transition/비분류 Update를 신규 Target 필드 부재만으로 막지 않는다. 임의 fallback·dual-write 금지.
5. Before/After 재조회 결과와 참조한 Policy의 Git SHA, Jira Issue Key, 실제 변경·미변경 필드를 최종 보고한다.
6. Jira 전역 설정 변경·대량 이관·삭제·PR Merge는 반드시 별도 Owner 승인 Gate를 거친다.
7. 기존 코딩 작업의 코드·PR·검증 계약은 따로 존중한다. Jira Governance 확인은 Jira 쓰기 작업의 Gate이지 모든 읽기·빌드 작업의 상시 선행조건이 아니다.

이 문서는 Governance를 복제하지 않는다. 정책 충돌 시 **승인·발효된 Canonical 문서**를 우선하고, 불명확한 경우 실패-닫힘으로 처리한다.


## PR 작성 및 본문 갱신
- PR 생성 또는 본문 수정 전에 대상 base 브랜치의 `.github/PULL_REQUEST_TEMPLATE.md` 실제 내용을 확인한다.
- 저장소에 작업 유형별 전용 PR 템플릿이 있으면 현재 작업과 맞는 형식을 우선한다.
- `/핵심정리` 형식은 한국어로 `목적`, `변경`, `검증`, `Finding`, `Source Merge`, `Production Gate`, `참조`를 구분해 작성한다.
- 실제 실행한 검증과 근거만 기록하고, 실행하지 않은 항목은 `PASS`가 아니라 `NOT_RUN`으로 표시한다.
- 작성자(Writer)의 검증 결과와 독립 Reviewer의 판정을 구분한다. 독립 `PASS`는 검수한 코드 HEAD가 명시되고 근거가 일치할 때만 기록한다.
- 코드 HEAD, base 브랜치, 테스트 명령·결과·링크가 실제 ref와 실행 근거에 맞는지 확인한다.
- Source Merge 승인과 Production 배포 승인을 별도 Gate로 기록한다. PR 본문 작성만으로 Merge 승인을 간주하지 않는다.
- Secret, PII, 민감한 SQL 파라미터를 본문에 기록하지 않는다. 필요한 설명에는 비식별·마스킹한 예시만 사용한다.
