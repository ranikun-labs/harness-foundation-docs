---
title: "Local Product Notice는 Cache-first Display와 비차단 One-shot Refresh로 분리한다"
adr_id: "ADR-0011"
document_status: accepted
decision_status: accepted
decision_scope: architecture
owner: architecture
authors:
  - foundation-worker
reviewers: []
approvers: []
created_at: "2026-07-20"
reviewed_at: "2026-07-20"
approved_at: null
effective_from: null
implementation_status: not_verifiable
constraints:
  - "명시적 Work-start 실행에만 부수한다"
  - "Notice 실패는 fail-open이며 Work-start exit code에 영향을 주지 않는다"
  - "현재 실행의 표시는 실행 시작 시점 Cache Snapshot으로 결정한다"
  - "상주 Daemon, Scheduler, OS Service를 도입하지 않는다"
  - "Manifest 내용을 실행하지 않는다"
affected_docs:
  - docs/contracts/product-notice-contract.md
  - docs/contracts/work-start-contract.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/product/v1-completion-criteria.md
  - docs/testing/v1-fixture-plan.md
  - docs/decisions/decision-log.md
evidence_refs: []
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-0011: Local Product Notice는 Cache-first Display와 비차단 One-shot Refresh로 분리한다

---

## 1. Decision Summary

```text
We will Public V1의 Product Notice를
표시 경로와 획득 경로로 분리한다.

표시는 실행 시작 시점 Local Cache Snapshot만으로 결정하고,
획득은 Work-start Core 이후에 시작하는
짧은 비차단 one-shot Refresher가 담당한다.

Refresher 결과는 현재 실행 출력에 삽입하지 않고
다음 명시적 Work-start부터 표시 대상이 된다.
```

적용 Scope는 Public V1의 Local Product Services 경계이며,
Work-start Contract의 입력·출력 의미는 변경하지 않는다.

핵심 제약은 fail-open, 상주 Process 부재, Artifact 불변이다.

---

## 2. Status

### Document Status

```text
accepted
```

### Decision Status

```text
accepted
```

이 ADR은 Architecture Scope만 확정한다.

```text
ADR-0011 accepted
≠ Notice Runtime 구현 완료
≠ Public V1 Release 준비 완료
```

Notice의 Product Scope 채택은 DEC-054가 소유한다.

---

## 3. Decision Scope

```text
decision_scope: architecture
```

역할 구분:

```text
Owner: architecture
Author: foundation-worker
Reviewer: 미지정
Approver: 미지정
Implementation Owner: Product Notice Worker
```

### Scope In

- Notice 표시 경로와 획득 경로의 분리
- Work-start와 Notice Module 사이의 호출 경계
- Refresh Process 형태와 수명
- Cache와 User Choice State의 저장 경계
- Notice 실패의 전파 차단 지점

### Scope Out

- Public V1에 Notice를 포함할지 여부 (Product Decision)
- Manifest Schema 필드 정의 (Contract)
- TTL·Timeout 수치 (Release Policy)
- Fixture Assertion (Testing)
- Runtime 지원 사실
- 현재 구현 완료 상태

---

## 4. Context

### Observed

- Public V1은 Cloud-independent 제품이며 Control Plane이 없다.
- `docs/architecture/local-cloud-human-boundary.md` §6.3은 V1 Cloud 책임을 `없음`으로 고정한다.
- `docs/contracts/work-start-contract.md` §3은 Work-start의 Local-only 동작을 불변조건으로 둔다.
- Work-start는 사용자가 명시적으로 실행하는 유일한 정기 진입점이다.
- 제품 Runtime이 읽을 canonical Version Source가 아직 존재하지 않는다.

### Assumed

- V2 출시 시점에 Public V1 사용자 다수가 Release Page를 주기적으로 확인하지 않는다.
- 보안 공지가 필요한 상황이 Public V1 수명 안에 발생할 수 있다.
- 사용자 다수가 Network 가용 환경에서 Work-start를 실행한다.

### Trigger

- Public V1을 오픈소스 상품으로 공개하기로 확정하면서, 기존 사용자에게 V2 출시·보안·호환성 공지를 전달할 경로가 없다는 문제가 드러났다.

---

## 5. Problem Statement

```text
How should Public V1이 Cloud 의존과 상주 Process 없이
제품 공지를 사용자 터미널에 도달시키면서
Work-start의 결정성, 실패 격리, Artifact 순수성을 유지할 수 있는가
```

---

## 6. Drivers

```text
- Local-first boundary
- Failure isolation
- Deterministic output
- Human control
- Truthfulness
- Maintenance cost
- Migration path to V2
```

---

## 7. Constraints

### Hard Constraint

```text
Notice 실패가 Work-start exit code와 Artifact 생성에 영향을 주지 않는다
사용자 작업 데이터를 전송하지 않는다
Network 없이 제품 핵심 기능이 동작한다
Manifest 내용을 실행하지 않는다
상주 Daemon, Scheduler, OS Service를 도입하지 않는다
```

### Preference

```text
Notice 지연 도달을 허용한다
표시 개수를 보수적으로 제한한다
```

### Assumption

```text
Work-start 실행 빈도가 공지 도달에 충분하다
```

### Known Limitation

```text
Work-start를 실행하지 않는 사용자에게는 공지가 도달하지 않는다
새 Notice는 최소 1회 실행만큼 지연된다
```

이 제한은 Safety Invariant를 완화하지 않는다.

---

## 8. Considered Options

### Option A — Blocking Fetch and Immediate Display

**Description**

```text
Work-start 실행 중 Manifest를 동기 조회하고
그 결과를 현재 출력에 즉시 표시한다
```

**Advantages**

```text
- 공지 지연이 없다
- 구현이 단순하다
```

**Disadvantages**

```text
- Work-start 지연이 Network 상태에 종속된다
- 출력이 Network 응답 시점에 의존해 결정적이지 않다
- Offline 환경에서 체감 성능이 나빠진다
```

**Risks**

```text
- Timeout 처리 실패가 Work-start 실패로 전파된다
- Fixture가 Network Mock 없이 재현되지 않는다
```

**Rejected or selected reason**

```text
Rejected.
Failure isolation과 Deterministic output Driver를 동시에 위반한다.
```

---

### Option B — Resident Daemon with Scheduled Refresh

**Description**

```text
설치 시 상주 Process 또는 OS Scheduler를 등록하고
주기적으로 Manifest를 갱신한다
```

**Advantages**

```text
- 공지 최신성이 가장 높다
- Work-start 실행과 무관하게 갱신된다
```

**Disadvantages**

```text
- Public V1이 상주 Process를 요구하는 제품이 된다
- OS별 등록·해제·권한 처리 비용이 크다
- 제거 누락 시 사용자 시스템에 잔존물이 남는다
```

**Risks**

```text
- Uninstall 후 잔존 Process
- 사용자 신뢰 손상
- Sidecar를 V1 선결 조건으로 만드는 방향과 충돌
```

**Rejected or selected reason**

```text
Rejected.
Local-first boundary와 Maintenance cost Driver에 정면으로 반한다.
로드맵은 Sidecar조차 초기 V2 선결 조건이 아니라고 고정하고 있다.
```

---

### Option C — Cache-first Display with Non-blocking One-shot Refresh

**Description**

```text
표시는 실행 시작 시점 Cache Snapshot으로 결정하고
획득은 Work-start Core 이후 시작하는
짧은 비차단 one-shot process가 담당한다

Refresher 결과는 다음 실행부터 표시된다
```

**Advantages**

```text
- Work-start 소요 시간이 Network에 종속되지 않는다
- 출력이 시작 시점 Local 상태만으로 결정된다
- Fixture가 Cache 상태 조작만으로 재현된다
- 상주 Process가 없다
- Offline이 정상 경로다
```

**Disadvantages**

```text
- 새 Notice가 최소 1회 실행만큼 지연된다
- Cache와 State 두 저장 영역을 관리해야 한다
```

**Risks**

```text
- 동시 실행 시 Refresh 중복
- 부분 기록된 Cache 파일
```

**Rejected or selected reason**

```text
Selected.
지연은 제품 공지 용도에서 허용 가능한 비용이며,
그 대가로 실패 격리와 출력 결정성을 모두 확보한다.
동시성·부분 기록 위험은 Local Lock과 Atomic Write로 경계 안에서 처리된다.
```

---

## 9. Decision

```text
- Notice 표시 경로와 획득 경로를 분리한다
- 표시는 실행 시작 시점 Cache Snapshot만으로 결정한다
- 현재 실행에서 획득한 Notice는 현재 출력에 삽입하지 않는다
- Refresh는 Work-start Core 실행 이후 시작하는 비차단 one-shot process다
- Refresher는 Cache만 갱신하고 사용자 출력을 생성하지 않는다
- Notice 실패는 Notice Module 경계 안에서 종료한다
- Manifest Cache와 User Choice State는 서로 다른 저장 영역에 둔다
- Work-start는 Notice Module의 통합 인터페이스만 알고 내부 구현을 소유하지 않는다
```

Dependency 방향:

```text
Work-start
→ Notice Module

Notice Module
↛ Work-start
```

Notice Module은 Work-start의 Candidate, Handoff Seed, Result 상태를 읽지 않는다.

### Ownership

| Concern | Canonical Owner | This ADR Changes It? |
|---|---|---:|
| Product Scope | Product documents and Product Decision | No / DEC-054가 소유 |
| Architecture Boundary | Architecture documents and ADR | Yes |
| Contract Meaning | `docs/contracts/product-notice-contract.md` | No / Contract가 소유 |
| Release Requirement | Product Completion Criteria | No / DEC-054 경유 |
| Testing Evidence | Testing documents and evidence | No |

---

## 10. Rationale

```text
Failure isolation Driver
→ Option A는 Network 실패를 실행 경로에 올린다
→ Option C는 실패를 Refresher 종료로 흡수한다
→ Option C 선택

Deterministic output Driver
→ Option A의 출력은 응답 시점에 의존한다
→ Option C의 출력은 시작 시점 Local 상태 함수다
→ Option C 선택

Local-first boundary Driver
→ Option B는 상주 Process를 제품 전제로 만든다
→ Option C는 실행 시에만 살아있는 process만 사용한다
→ Option C 선택

Maintenance cost Driver
→ Option B는 OS Matrix 전체에 등록·해제·권한 처리를 요구한다
→ Option C는 파일 두 개와 Lock 하나로 닫힌다
→ Option C 선택
```

지연 도달은 구현 편의가 아니라 명시적으로 지불하기로 한 비용이다.

제품 공지는 초 단위 최신성이 요구되는 데이터가 아니다.

---

## 11. Consequences

### Positive

```text
- Work-start 실행 시간이 Network 상태와 무관해진다
- Offline 환경이 예외 경로가 아니라 정상 경로가 된다
- Notice Fixture가 Network Mock 없이 Cache 파일 조작만으로 재현된다
- Notice Source가 향후 변경돼도 Work-start Contract를 바꾸지 않는다
```

### Negative

```text
- 새 Notice 도달이 최소 1회 실행만큼 지연된다
- 저장 영역이 두 곳으로 늘어난다
- Work-start를 실행하지 않는 사용자에게는 공지가 도달하지 않는다
```

### Neutral / Operational

```text
- Manifest 게시 운영 절차가 Release Policy에 추가된다
- TTL·Timeout 수치 조정이 Contract 변경 없이 가능하다
```

### New Risks

```text
- Stale Lock이 Refresh를 지속적으로 차단할 수 있다
- Cache 경로가 사용자 정리 도구에 의해 반복 삭제될 수 있다
- Manifest Host 침해 시 Plain-text Message가 사용자에게 표시될 수 있다
```

세 번째 위험은 Content 실행 금지와 Action URL Allowlist로 영향 범위를 표시 문자열로 제한한다.

제거되지 않으며, 서명 도입은 별도 Decision 대상이다.

---

## 12. Human Authority Impact

| Gate | Changed? | Effect |
|---|---:|---|
| Candidate Review | No | Notice는 Candidate에 포함되지 않는다 |
| Handoff Approval | No | Notice는 Handoff 필드가 아니다 |
| Policy Review | No | 변경 없음 |
| Action Approval | No | Notice는 Action을 요구하지 않는다 |
| Projection Review | No | 변경 없음 |
| Invocation Approval | not_applicable | Local Invocation은 이 ADR 범위가 아니다 |
| Result Review | No | Notice는 Result에 포함되지 않는다 |
| Repository Apply | No | Notice는 Repository를 수정하지 않는다 |
| Context Promotion | No | Notice는 Project Context가 아니다 |
| Cloud Opt-in | No | Notice는 Cloud Account를 요구하지 않는다 |

Notice는 Human Gate를 추가·삭제·병합·완화하지 않는다.

Notice 표시는 승인이 아니며 사용자 응답을 요구하지 않는다.

```text
Notice 표시
≠ Human Review
≠ Approval
≠ Consent
```

---

## 13. Local·Cloud·Data Impact

### Data Classes

```text
- Product Announcement Metadata (Remote → Local, 읽기 전용)
- User Choice State (Local only)
```

### Local Boundary

```text
- Prompt, Task, Repository 식별자, Path, Candidate, Artifact, 사용자 코드 전부 Local에 남는다
- Dismiss, Opt-out, Impression 기록은 Local에만 존재한다
- Audience Match 판정은 Local에서 수행한다
```

### Cloud Boundary

```text
- 제품이 전송하는 사용자 데이터는 없다
- 요청은 정적 Manifest에 대한 읽기 전용 HTTPS 요청이다
- Request Body에 사용자 데이터를 담지 않는다
```

### Sensitive Data

```text
- Secret, Credential, Personal Data 전송 없음
- HTTPS 요청의 일반 속성으로 Client IP와 요청 시각이 Manifest Host에 노출될 수 있음
```

이 노출은 제품이 수집하는 데이터가 아니며 Telemetry로 분류하지 않는다.

전체 opt-out이 이 노출을 제거하는 유일한 수단이다.

이 사실은 Public Documentation에 축소 없이 기술한다.

기존 Cloud Opt-in은 이 Data Class에 자동 적용되지 않으며, 반대로 Notice Opt-out이 다른 Cloud 경로 동의를 의미하지도 않는다.

---

## 14. Shared Core and Extension Impact

| Area | Impact |
|---|---|
| Shared Core | Local Product Services 하위에 Notice Module 경계를 신설한다 |
| Development Extension | 변경 없음. Work-start 호출 지점만 통합 인터페이스를 사용한다 |
| Finance Extension | 변경 없음 |
| Cross-extension dependency | 없음. Notice Module은 Extension을 참조하지 않는다 |

Notice Module은 Domain-neutral하다.

특정 Extension의 편의를 Shared Core 의무로 승격하지 않는다.

---

## 15. Contract Impact

영향받는 Contract:

```text
- docs/contracts/product-notice-contract.md
- docs/contracts/work-start-contract.md
```

구분:

```text
docs/contracts/product-notice-contract.md
= 신규 Contract
= 이 ADR이 Architecture Constraint를 제공

docs/contracts/work-start-contract.md
= Reference 및 책임 경계 명시 추가
= 기존 입력·출력·상태 의미 변경 없음
```

변경하지 않는 Contract:

```text
docs/contracts/handoff-basic-contract.md
docs/contracts/result-basic-contract.md
docs/contracts/runtime-capability-contract.md
docs/contracts/execution-policy-contract.md
```

Notice를 기존 Handoff·Result Contract에 삽입하지 않는다.

---

## 16. Product and Roadmap Impact

### Product Scope

```text
Separate Product Decision required: DEC-054
```

이 ADR은 Notice를 Public V1에 포함할지 결정하지 않는다.

Runtime 구조만 결정한다.

### Roadmap

```text
- Phase 1 — V1 Community 포함 범위에 Local Product Notice Channel 추가 (DEC-054 경유)
- Phase 2 이후 Cloud Notice API로의 전환은 이 ADR 범위 밖
```

---

## 17. Testing and Evidence

필요 Evidence:

```text
- Architecture analysis
- Contract review
- Fixture result
- Manual E2E
```

현재 상태:

```text
Architecture analysis: 이 ADR 본문
Contract review: docs/contracts/product-notice-contract.md 작성 완료
Fixture result: Not Performed
Manual E2E: Not Performed
```

Fixture와 Manual E2E는 계획만 존재하며 실행 결과가 없다.

```text
implementation_status: not_verifiable
```

Evidence 존재는 Implementation Completed를 의미하지 않는다.

---

## 18. Migration and Rollback

### Migration

```text
- 기존 사용자 설정 변경 없음
- 신규 Cache·State 파일은 최초 실행 시 생성
- 기존 Artifact 경로·형식 변경 없음
```

### Compatibility

```text
- Notice Module 부재 상태와 존재 상태의 Work-start Artifact가 동일하다
- 이전 버전 Artifact 재사용에 영향 없음
```

### Rollback

```text
- Notice Module 호출 제거만으로 이전 동작으로 복귀
- Cache·State 파일 삭제로 잔존물 제거
- Work-start Contract 변경이 없으므로 역방향 Migration 불필요
```

### Irreversible Effects

```text
- 없음
```

Rollback 경로가 존재하므로 별도 Human Review를 요구하지 않는다.

---

## 19. Implementation Notes

```text
- Refresher는 부모 종료와 무관하게 살아남되 수명 상한을 가진다
- Lock은 stale 판정 기준을 가져야 한다
- Cache 읽기 실패와 Cache 부재를 같은 경로로 처리한다
- Version 판독 실패는 표시 없음으로 처리한다
```

Implementation Notes는 실행 코드의 Source of Truth가 아니다.

```text
ADR accepted
≠ implementation completed
```

---

## 20. Known Limitations

허용 가능한 제한:

```text
새 Notice의 1회 실행 지연
Work-start 미실행 사용자에 대한 미도달
Notice 심각도 구분 부재
Manifest 서명 부재
```

허용할 수 없는 우회:

```text
Notice 실패의 Work-start 전파
Manifest 내용 실행
사용자 작업 데이터 전송
Opt-out 상태에서의 Network 호출
Artifact에 Notice 혼입
```

---

## 21. Open Questions

```text
- Manifest Host와 경로
- Refresher 수명 상한과 Lock stale 기준
- Notice 심각도 구분 도입 여부
- Manifest 서명 도입 시점
- Cache 경로와 Local Artifact Root 결정의 정합 (OPEN-006)
```

위 항목은 확정된 사실로 표현하지 않는다.

---

## 22. Related Records

### Decisions

```text
- DEC-054
- DEC-055
- DEC-056
- DEC-001
- DEC-051
```

### ADRs

```text
- 없음
```

### POCs

```text
- 없음
```

### Roadmap Items

```text
- Phase 1 — V1 Community
```

### Affected Documents

```text
- docs/contracts/product-notice-contract.md
- docs/contracts/work-start-contract.md
- docs/architecture/local-cloud-human-boundary.md
- docs/product/v1-completion-criteria.md
- docs/testing/v1-fixture-plan.md
- docs/decisions/decision-log.md
```

---

## 23. Supersession

### Full Supersession

```text
해당 없음
```

### Partial Supersession

```text
해당 없음
```

이 ADR은 기존 ADR을 대체하지 않는다.

DEC-001의 `V1은 Cloud 없이 완결된다`는 결정을 대체하지 않는다.

```text
Cloud 없이 완결
= 제품 핵심 기능이 Network 없이 동작

Notice
= 선택적, fail-open, opt-out 가능한 읽기 전용 부가 경로
```

Notice가 실패하거나 opt-out돼도 V1 Workflow 전체가 완료 가능하므로
`Cloud 없이 완결` 조건은 유지된다.

---

## 24. Decision History

| Date | Previous Status | New Status | Reviewed By | Approved By | Reason | Reference |
|---|---|---|---|---|---|---|
| 2026-07-20 | open | accepted | not_applicable | not_applicable | Public V1 공지 도달 경로 부재 해소 | DEC-054 |

Approval 권한자가 지정되지 않아 `Approved By`는 `not_applicable`로 기록한다.

이후 Governance Approval이 수행되면 별도 행으로 추가한다.

---

## 25. Review Checklist

### Scope

- [x] Architecture Scope가 명확하다.
- [x] Product Scope를 독자적으로 변경하지 않는다.
- [x] Contract 의미 변경은 별도 Contract 문서로 연결됐다.
- [x] Scope In·Out이 명확하다.

### Alternatives

- [x] 실질적인 대안을 비교했다.
- [x] 선택 이유가 Driver와 연결된다.
- [x] Implementation Convenience만으로 결정하지 않았다.

### Safety

- [x] Human Gate 영향이 기록됐다.
- [x] Secret·Local·Cloud Boundary를 검토했다.
- [x] Scope Escape와 Process Cleanup을 검토했다.
- [x] Known Limitation으로 Safety 실패를 우회하지 않는다.

### Traceability

- [x] `adr_id`가 유일하다.
- [x] Owner·Author·Reviewer·Approver가 구분됐다.
- [x] `decision_scope`가 기록됐다.
- [x] `affected_docs`가 실제 영향 문서만 포함한다.
- [x] `evidence_refs`가 비어 있음을 명시했다.
- [x] Supersession Reference가 없음을 명시했다.

### Truthfulness

- [x] Observed·Assumed를 구분했다.
- [x] POC Lifecycle과 혼동하지 않았다.
- [x] ADR Accepted와 Implementation Completed를 구분했다.
- [x] 검증되지 않은 상태는 `not_verifiable`로 표시했다.

---

## 26. Acceptance Record

### Decision

```text
decision_status: accepted
```

### Constraints

```text
명시적 Work-start 실행에만 부수한다
Notice 실패는 fail-open이며 Work-start exit code에 영향을 주지 않는다
현재 실행의 표시는 실행 시작 시점 Cache Snapshot으로 결정한다
상주 Daemon, Scheduler, OS Service를 도입하지 않는다
Manifest 내용을 실행하지 않는다
```

### Effective Scope

```text
Public V1 Local Product Services의 Notice Module 경계와
Work-start ↔ Notice 호출 방향
```

### Required Follow-up

```text
- Manifest Host·경로 확정
- Refresher 수명 상한과 Lock stale 기준 확정
- Notice Fixture 실행 및 결과 기록
- Manual E2E 수행
- Runtime-readable Version Source 구현 (DEC-055)
```

### Approved By

```text
not_applicable
```

### Approved At

```text
not_applicable
```

### Approval Authority Reference

```text
Governance Approver 미지정.
Foundation 문서 계층의 architecture owner 권한으로 document_status만 accepted로 기록한다.
```
