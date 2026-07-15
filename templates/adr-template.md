---
title: "<ADR title>"
adr_id: "ADR-XXXX"
document_status: draft
decision_status: open
decision_scope: architecture
owner: "<decision owner>"
authors: []
reviewers: []
approvers: []
created_at: "YYYY-MM-DD"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_verifiable
constraints: []
affected_docs: []
evidence_refs: []
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-XXXX: <ADR Title>

> 이 Template은 Architecture Decision의 맥락·대안·선택·결과를 기록한다.
>
> ADR은 Architecture Scope의 상세 근거다.
>
> ```text
> Accepted ADR
> ≠ Accepted Product Scope
> ≠ Runtime Support Evidence
> ≠ Implementation Completion
> ```
>
> Product Scope, Contract 의미, P0 Release Requirement를 변경하려면
> 해당 canonical owner의 별도 Decision과 문서 변경이 필요하다.
>
> Review 수행은 Approval을 자동 의미하지 않는다.

---

## 1. Decision Summary

결정을 한 문단으로 요약한다.

```text
We will ...
```

요약에는 다음을 포함한다.

```text
선택한 Architecture 방향
적용 Scope
핵심 제약
```

요약만 읽고도 무엇을 결정했는지 알 수 있어야 한다.

---

## 2. Status

### Document Status

```text
draft
in_review
accepted
deprecated
superseded
archived
```

현재:

```text
<document_status>
```

### Decision Status

```text
open
experiment
accepted
accepted_with_constraints
deferred
rejected
superseded
```

현재:

```text
<decision_status>
```

`decision_status: experiment`는
Architecture Decision이 아직 실험 단계라는 의미다.

다음과 동일하지 않다.

```text
POC Lifecycle
POC Outcome
Runtime 실행 상태
Product 채택 상태
```

관련 POC의 Lifecycle·Outcome은
POC 문서 Reference로 연결하며 ADR이 직접 판정하지 않는다.

Document Status는 ADR Record의 작성·검수 Lifecycle이다.

Decision Status는 Architecture 선택의 현재 Governance 상태다.

Document Status와 Decision Status를 혼합하지 않는다.

예를 들어 다음 조합은 유효할 수 있다.

```text
document_status: accepted
decision_status: rejected
```

이는 Rejected Decision과 근거가
완전하게 기록·검수된 ADR을 의미한다.

```text
문서 작성 완료
≠ Decision Accepted

Decision Accepted
≠ Implementation Completed
```

---

## 3. Decision Scope

```text
decision_scope: architecture
```

Owner와 역할을 구분한다.

```text
Owner
≠ Author
≠ Reviewer
≠ Approver
≠ Implementation Owner
```

동일 인물이 복수 역할을 맡는 경우에도
각 역할과 권한 근거를 명시적으로 기록한다.

이 ADR이 소유하는 Architecture Scope를 작성한다.

예:

```text
Component Boundary
Dependency Direction
Data Boundary
Local·Cloud Boundary
Shared Core·Extension Boundary
Runtime Adapter Responsibility
Process Supervision Boundary
```

### Scope In

```text
- <included architecture concern>
```

### Scope Out

```text
- Product Priority
- Product Pricing
- Contract Field 전체
- Fixture Assertion
- Runtime 지원 사실
- 현재 구현 완료 상태
```

Scope Out은 필요에 맞게 추가한다.

---

## 4. Context

이 결정이 필요한 배경을 작성한다.

포함할 내용:

```text
현재 문제
기존 구조
관찰된 제약
관련 Product Requirement
관련 Contract
Safety Invariant
변경하지 않을 전제
```

Observed Fact와 Assumption을 구분한다.

### Observed

```text
- <directly observed or verified fact>
```

### Assumed

```text
- <assumption or not_verifiable condition>
```

### Trigger

```text
- <event, requirement, conflict, or risk that triggered this ADR>
```

---

## 5. Problem Statement

해결할 Architecture 문제를 한 문장으로 작성한다.

```text
How should ...
```

좋은 문제 정의:

```text
명확한 Scope
선택 가능한 대안 존재
Architecture 책임
검증 가능한 결과
```

피해야 할 표현:

```text
잘 만들기
최적화하기
확장 가능하게 하기
알아서 분리하기
```

---

## 6. Drivers

결정에 영향을 준 우선순위를 작성한다.

```text
- Human control
- Local-first boundary
- Truthfulness
- Extension independence
- Failure isolation
- Migration cost
- Backward compatibility
- Maintenance cost
```

Driver는 해결책 자체가 아니라 판단 기준이다.

---

## 7. Constraints

Front Matter의 `constraints`와 일치해야 한다.

```text
- <hard constraint>
- <regulatory or product constraint>
- <compatibility constraint>
```

다음을 명확히 구분한다.

```text
Hard Constraint
Preference
Assumption
Known Limitation
```

Safety Invariant를 단순 Preference로 낮추지 않는다.

---

## 8. Considered Options

최소 두 개의 실질적인 대안을 기록한다.

### Option A — <Name>

**Description**

```text
<option description>
```

**Advantages**

```text
- <advantage>
```

**Disadvantages**

```text
- <disadvantage>
```

**Risks**

```text
- <risk>
```

**Rejected or selected reason**

```text
<reason>
```

---

### Option B — <Name>

**Description**

```text
<option description>
```

**Advantages**

```text
- <advantage>
```

**Disadvantages**

```text
- <disadvantage>
```

**Risks**

```text
- <risk>
```

**Rejected or selected reason**

```text
<reason>
```

---

### Option C — <Optional Name>

필요한 경우 추가한다.

존재하지 않는 대안을 채우기 위해 형식적인 Option을 만들지 않는다.

---

## 9. Decision

선택한 방향을 구체적으로 작성한다.

```text
- <decision rule>
- <boundary>
- <dependency direction>
- <ownership>
```

### Ownership

| Concern | Canonical Owner | This ADR Changes It? |
|---|---|---:|
| Product Scope | Product documents and Product Decision | No / separate decision required |
| Architecture Boundary | Architecture documents and ADR | Yes |
| Contract Meaning | Contract documents and Contract Decision | No / separate decision required |
| Release Requirement | Product Completion Criteria | No |
| Testing Evidence | Testing documents and evidence | No |

해당 ADR이 Architecture 밖의 변경을 요구하면 관련 Decision Reference를 작성한다.

---

## 10. Rationale

왜 이 대안을 선택했는지 Drivers와 연결해 설명한다.

```text
Driver
→ Option 비교
→ 선택 이유
```

단순히 다음처럼 쓰지 않는다.

```text
가장 좋아 보여서
구현이 쉬워서
현재 코드가 그래서
```

Implementation Convenience는 Hard Safety와 canonical ownership을 덮을 수 없다.

---

## 11. Consequences

### Positive

```text
- <expected benefit>
```

### Negative

```text
- <cost or limitation>
```

### Neutral / Operational

```text
- <ongoing operational consequence>
```

### New Risks

```text
- <new risk introduced by the decision>
```

`consequences`가 없으면 빈 목록으로 명시한다.

---

## 12. Human Authority Impact

다음 Gate에 미치는 영향을 작성한다.

| Gate | Changed? | Effect |
|---|---:|---|
| Candidate Review |  |  |
| Handoff Approval |  |  |
| Policy Review |  |  |
| Action Approval |  |  |
| Projection Review |  |  |
| Invocation Approval |  |  |
| Result Review |  |  |
| Repository Apply |  |  |
| Context Promotion |  |  |
| Cloud Opt-in |  |  |

Invocation Approval은 Local Invocation이
승인된 POC 또는 별도 Product Decision으로 활성화된 경우에만 적용한다.

적용되지 않는 ADR에서는 `not_applicable`과 근거를 기록한다.

이 Gate를 표에 포함했다는 사실만으로
Local Invocation이 Accepted Product Scope가 되지 않는다.

Human Gate를 추가·삭제·병합·완화하거나 승인 효과를 확대한다면
별도 Product·Contract·Safety Decision이 필요한지 확인한다.

```text
Handoff Approval
≠ Action Approval

Projection Review
≠ Invocation Approval

Result Review
≠ Repository Apply
```

---

## 13. Local·Cloud·Data Impact

### Data Classes

```text
- <data class>
```

### Local Boundary

```text
- <what remains local>
```

### Cloud Boundary

```text
- <what may leave local boundary>
```

### Sensitive Data

```text
- <secret, personal, confidential, restricted data impact>
```

Cloud 전송 범위가 확대되면 다음을 별도로 검토한다.

```text
Purpose
Destination
Retention
Deletion
Encryption
Access Control
Opt-in
Audit
Failure Handling
```

기존 Opt-in을 새로운 Data Class에 자동 적용하지 않는다.

---

## 14. Shared Core and Extension Impact

| Area | Impact |
|---|---|
| Shared Core |  |
| Development Extension |  |
| Finance Extension |  |
| Cross-extension dependency |  |

Shared Core 변경을 제안할 경우 다음을 기록한다.

```text
복수 Extension 요구 또는 Domain-neutral Safety·Contract Requirement
Domain-neutral Vocabulary
공통 Contract 필요성
Extension 독립성
Migration Cost
Backward Compatibility
```

한 Extension의 구현 편의를 Shared Core 의무로 승격하지 않는다.

---

## 15. Contract Impact

영향받는 Contract:

```text
- <root-relative contract path>
```

구분:

```text
Architecture Constraint 제공
Contract Meaning 변경
Contract Field 변경
Validation 변경
Human Gate 변경
Reference 변경
```

Contract 의미를 변경한다면 별도 Contract Decision과 canonical Contract 수정이 필요하다.

ADR 본문만으로 Contract를 변경하지 않는다.

---

## 16. Product and Roadmap Impact

### Product Scope

```text
No change
```

또는:

```text
Separate Product Decision required: <decision reference>
```

### Roadmap

```text
- <roadmap item reference or no change>
```

ADR 작성만으로 Roadmap Commitment를 생성하지 않는다.

---

## 17. Testing and Evidence

필요 Evidence:

```text
- Architecture analysis
- Contract review
- Fixture result
- Manual E2E
- POC result
- Security review
- Operational evidence
```

각 Reference:

```text
reference
source_revision
created_at
owner
scope
verification_state
```

Canonical Evidence Reference로 사용하지 않는 것:

```text
Provider Session ID
Chat Attachment ID
Local Temporary Path
Process PID
UI Component ID
```

해당 값은 보조 Metadata로 사용할 수 있으나,
Stable·Versioned Evidence Reference를 대체하지 않는다.

Evidence 존재는 Decision Accepted나 Implementation Completed를 자동 의미하지 않는다.

---

## 18. Migration and Rollback

### Migration

```text
- <migration step>
```

### Compatibility

```text
- <backward compatibility impact>
```

### Rollback

```text
- <rollback path>
```

### Irreversible Effects

```text
- <irreversible consequence or none>
```

Rollback이 불가능하면 명시하고 별도 Human Review를 요구한다.

---

## 19. Implementation Notes

```text
- <non-canonical implementation guidance>
```

Implementation Notes는 실행 코드의 Source of Truth가 아니다.

```text
ADR accepted
≠ implementation completed
```

실제 구현 상태를 확인하지 못하면:

```text
implementation_status: not_verifiable
```

로 유지한다.

---

## 20. Known Limitations

허용 가능한 제한:

```text
비핵심 UX 부족
지원 OS·Runtime 범위
비핵심 Manual Step
P1 Performance Gap
```

허용할 수 없는 우회:

```text
Human Approval 누락
Secret Safety 실패
Scope Escape
Result Truthfulness 실패
P0 Validation 실패
Process Cleanup 실패
```

`accepted_with_constraints`인 경우 제약과 Known Limitation을 명확히 기록한다.

---

## 21. Open Questions

```text
- <question>
```

Open Question을 Decision 본문에서 확정된 사실로 표현하지 않는다.

별도 Decision이 필요한 항목은 Reference를 남긴다.

---

## 22. Related Records

### Decisions

```text
- <DEC-ID>
```

### ADRs

```text
- <ADR-ID>
```

### POCs

```text
- <POC path or experiment reference>
```

### Roadmap Items

```text
- <roadmap item ID>
```

### Affected Documents

Front Matter의 `affected_docs`와 일치해야 한다.

```text
- <root-relative path>
```

---

## 23. Supersession

### Full Supersession

기존 ADR 전체를 대체하는 경우:

```text
기존 decision_status: superseded
기존 superseded_by: [ADR-XXXX]
신규 supersedes: [ADR-YYYY]
```

### Partial Supersession

일부 Scope만 대체하는 경우 기존 ADR은
잔여 유효 Scope가 존재하는 동안 `accepted` 또는
`accepted_with_constraints` 상태를 유지한다.

Front Matter와 본문에 다음을 함께 기록한다.

```text
superseded_scope:
remaining_valid_scope:
replacement_decision_refs:
```

기존 ADR 전체가 더 이상 유효하지 않을 때만 `superseded`로 전환한다.

---

## 24. Decision History

| Date | Previous Status | New Status | Reviewed By | Approved By | Reason | Reference |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | open | accepted |  |  |  |  |

Review 수행은 Decision Approval을 자동 의미하지 않는다.

Approval이 필요하지 않은 상태 전환이면
`Approved By`에 `not_applicable`과 근거를 기록한다.

조용한 본문 수정만으로 상태를 변경하지 않는다.

`reviewed_at` 갱신만으로 다른 ADR을 대체하지 않는다.

---

## 25. Review Checklist

### Scope

- [ ] Architecture Scope가 명확하다.
- [ ] Product Scope를 독자적으로 변경하지 않는다.
- [ ] Contract 의미 변경은 별도 Decision으로 연결됐다.
- [ ] Scope In·Out이 명확하다.

### Alternatives

- [ ] 실질적인 대안을 비교했다.
- [ ] 선택 이유가 Driver와 연결된다.
- [ ] Implementation Convenience만으로 결정하지 않았다.

### Safety

- [ ] Human Gate 영향이 기록됐다.
- [ ] Secret·Local·Cloud Boundary를 검토했다.
- [ ] Scope Escape와 Process Cleanup을 검토했다.
- [ ] Known Limitation으로 Safety 실패를 우회하지 않는다.

### Traceability

- [ ] `adr_id`가 유일하다.
- [ ] Owner·Author·Reviewer·Approver가 구분됐다.
- [ ] `decision_scope`가 기록됐다.
- [ ] `affected_docs`가 실제 영향 문서만 포함한다.
- [ ] `evidence_refs`가 Stable Reference를 사용한다.
- [ ] Supersession Reference가 양방향이다.

### Truthfulness

- [ ] Observed·Assumed를 구분했다.
- [ ] `decision_status: experiment`와 POC Lifecycle·Outcome을 구분했다.
- [ ] POC Outcome을 Product Decision으로 자동 승격하지 않았다.
- [ ] ADR Accepted와 Implementation Completed를 구분했다.
- [ ] 검증되지 않은 상태는 `not_verifiable`로 표시했다.

---

## 26. Acceptance Record

### Decision

```text
decision_status: <status>
```

### Constraints

```text
<constraints or []>
```

### Effective Scope

```text
<effective architecture scope>
```

### Required Follow-up

```text
- <follow-up item>
```

### Approved By

```text
<approver identity or not_applicable>
```

### Approved At

```text
<approval timestamp or not_applicable>
```

### Approval Authority Reference

```text
<decision authority, review record, or governance reference>
```

이 Section은 Human Review 결과를 기록한다.

`authors`·`reviewers`·Implementation Owner는
해당 권한 근거 없이 Approver가 되지 않는다.
