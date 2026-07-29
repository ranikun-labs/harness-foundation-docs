# AI Session Templates

이 디렉터리의 Template은 작업 유형별로 필요한 최소 Session Contract를
제공한다.

공통 운영 규칙:

- [AI Session Governance](../../docs/governance/ai-session-governance.md)
- [Portfolio Work Management Governance](../../docs/governance/portfolio-work-management-governance.md)

Template은 공통 규칙을 복제하지 않는다. `<...>` Placeholder를 실제
Primary Jira, Repository, Base, Head, Scope와 Verification으로 교체한다.
적용되지 않거나 확인하지 못한 값은 삭제하거나 추정하지 말고
`not applicable` 또는 `not verified`로 기록한다.

| Template | 용도 | Jira 쓰기 |
|---|---|---|
| [implementation.md](implementation.md) | 일반 변경 작성 | Primary Issue 하나 |
| [high-risk-implementation.md](high-risk-implementation.md) | 보안·데이터·Runtime 등 고위험 변경 | Primary Issue 하나 |
| [independent-review.md](independent-review.md) | 고정 Head 독립 검수 | 금지 |
| [finding-delta-fix.md](finding-delta-fix.md) | Review Finding만 보정 | 기존 Primary Issue |
| [merge-gate.md](merge-gate.md) | 검수된 Head 승인·병합 | 병합 대상 Primary Issue |
| [architecture-research.md](architecture-research.md) | Architecture 조사·Decision 후보 | Research Issue 하나 |
| [jira-metadata-maintenance.md](jira-metadata-maintenance.md) | 승인된 Jira Metadata 보정 | 명시된 Target만 |
| [portfolio-audit.md](portfolio-audit.md) | WIP·Metadata·Projection Read-only Audit | 기본 금지 |
| [handoff.md](handoff.md) | 다음 Session용 Continuity Artifact | 기본 금지 |

Model과 Reasoning 값은 실행 권고이며 Jira·Git·Architecture 권한을 부여하지
않는다.
