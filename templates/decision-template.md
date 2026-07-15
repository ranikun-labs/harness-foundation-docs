---
title: "<Decision title>"
decision_id: "DEC-XXXX"
document_status: draft
decision_status: open
decision_scope: "<product | architecture | contract | safety | quality_release>"
owner: "<decision owner>"
authors: []
reviewers: []
approvers: []
implementers: []
created_at: "YYYY-MM-DD"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_verifiable
constraints: []
consequences: []
affected_docs: []
evidence_refs: []
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# DEC-XXXX: <Decision Title>

> 이 Template은 Product·Architecture·Contract·Safety·Quality Decision의
> 현재 상태, 선택, 근거, 영향과 Supersession을 기록한다.
>
> ```text
> Decision Record
> = 해당 Decision의 선택·Scope·근거·제약·영향과
>   상태 전환 이력의 canonical record
>
> Decision Log
> = 전체 Decision의 현재 상태와
>   Supersession 관계를 조회하는 canonical index
>
> Review 수행
> ≠ Decision Approval
>
> Decision Accepted
> ≠ Implementation Completed
> ≠ Runtime Supported
> ≠ Fixture Passed
> ≠ Product Released
> ```

---

## 1. Decision Summary

결정을 한 문단으로 요약한다.

```text
We will ...
```

요약에는 다음을 포함한다.

```text
무엇을 결정하는가
어느 Scope에 적용되는가
핵심 제약은 무엇인가
현재 상태는 무엇인가
```

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

Document Status는 Record 자체의 작성·검수 Lifecycle이다.

Decision Status는 선택의 현재 Governance 상태다.

Document Status와 Decision Status를 혼합하지 않는다.

예를 들어 다음 조합은 유효할 수 있다.

```text
document_status: accepted
decision_status: rejected
```

이는 Rejected Decision과 근거가
완전하게 기록·검수됐다는 의미다.

```text
문서 작성 완료
≠ Decision Accepted

Decision Accepted
≠ Implementation Completed
```

---

## 3. Decision Scope

`decision_scope`는 다음 중 정확히 하나의
Primary Scope를 사용한다.

```text
product
architecture
contract
safety
quality_release
```

다른 Scope에 대한 영향은 각 Impact Section에 기록한다.

복수 Scope의 독립 채택이 필요하면
Scope별 Decision Record를 분리하고 상호 Reference한다.

현재:

```text
<decision_scope>
```

`owner`는 책임 주체이며 `decision_scope`와 동일한 의미가 아니다.

```text
Owner
≠ Author
≠ Reviewer
≠ Approver
≠ Implementer
```

동일 인물이 복수 역할을 맡는 경우에도
각 역할과 권한 근거를 별도로 기록한다.

### Scope In

```text
- <included decision concern>
```

### Scope Out

```text
- <excluded concern>
```

Scope Out은 다른 canonical owner의 책임을 침범하지 않도록 작성한다.

---

## 4. Canonical Ownership

| Concern | Canonical Owner |
|---|---|
| Product Scope | Product documents and accepted Product Decision |
| Architecture Boundary | Architecture documents and accepted ADR / Architecture Decision |
| Contract Meaning | Contract documents and accepted Contract Decision |
| Safety Invariant | Safety Decision and affected Product·Architecture·Contract documents |
| Release Requirement | Product Completion Criteria |
| Testing Evidence | Testing documents and actual evidence |
| POC Lifecycle·Outcome | POC documents |
| Current Decision Status | Decision Log |

이 Decision이 다른 Scope의 변경을 요구하면 별도 Decision과 문서 갱신이 필요하다.

---

## 5. Context

결정이 필요한 배경을 작성한다.

포함할 내용:

```text
현재 문제
기존 결정
관찰된 제약
사용자 가치
Architecture·Contract 영향
Safety Invariant
변경하지 않을 전제
```

### Observed

```text
- <verified or directly observed fact>
```

### User Asserted

```text
- <user-provided fact not independently verified>
```

### Inferred

```text
- <inference from available sources>
```

### Not Verifiable

```text
- <claim that cannot currently be verified>
```

Observed·Asserted·Inferred를 하나의 확정 사실로 합치지 않는다.

---

## 6. Decision Question

결정해야 하는 질문을 한 문장으로 작성한다.

```text
Should ...
```

좋은 질문:

```text
선택지가 존재
Scope가 명확
Decision owner가 명확
영향 문서를 식별 가능
```

---

## 7. Decision Drivers

판단 기준을 우선순위와 함께 작성한다.

| Priority | Driver | Why it matters |
|---:|---|---|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |

예:

```text
Human control
Truthfulness
Local-first boundary
Safety
Extension independence
Migration cost
Backward compatibility
Maintenance cost
Product value
```

Driver는 선택한 해결책 자체가 아니다.

---

## 8. Constraints

Front Matter의 `constraints`와 일치해야 한다.

```text
- <hard constraint>
```

다음을 구분한다.

```text
Hard Constraint
Preference
Assumption
Known Limitation
```

Safety Invariant를 Preference나 Known Limitation으로 낮추지 않는다.

---

## 9. Options Considered

최소 두 개의 실질적인 선택지를 기록한다.

실질적인 선택지가 하나뿐이라면
그 이유와 선택을 제한한 Hard Constraint를 명시하고,
형식을 채우기 위한 가짜 Option을 만들지 않는다.

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

**Required follow-up**

```text
- <follow-up>
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

**Required follow-up**

```text
- <follow-up>
```

---

### Option C — <Optional Name>

필요한 경우에만 추가한다.

형식을 채우기 위해 가짜 대안을 만들지 않는다.

---

## 10. Decision

선택한 방향을 명확히 작성한다.

```text
- <decision rule>
- <boundary>
- <owner>
- <applicable scope>
```

Decision 본문은 다음을 포함해야 한다.

```text
무엇이 허용되는가
무엇이 금지되는가
어떤 조건에서 적용되는가
어떤 문서가 변경돼야 하는가
```

---

## 11. Rationale

선택 이유를 Driver·Option 비교와 연결한다.

```text
Driver
→ Option comparison
→ Chosen trade-off
```

다음만으로 결정하지 않는다.

```text
구현이 쉬워서
현재 코드가 그래서
일단 빨리 하려고
```

Implementation Convenience는 Hard Safety와 canonical ownership을 덮을 수 없다.

---

## 12. Constraints and Conditions

`accepted_with_constraints`인 경우 반드시 기록한다.

```text
- <constraint>
- <support boundary>
- <known limitation>
- <revisit condition>
```

제약이 해제되면 단순 문구 삭제가 아니라 Decision Review가 필요하다.

---

## 13. Consequences

### Positive

```text
- <expected benefit>
```

### Negative

```text
- <cost or limitation>
```

### Operational

```text
- <ongoing responsibility>
```

### New Risks

```text
- <newly introduced risk>
```

### Deferred Consequences

```text
- <consequence postponed to a later version>
```

`consequences`가 없으면 빈 목록으로 기록한다.

---

## 14. Human Authority Impact

| Gate | Changed? | Effect | Separate Decision Required? |
|---|---:|---|---:|
| Candidate Review |  |  |  |
| Handoff Approval |  |  |  |
| Policy Review |  |  |  |
| Action Approval |  |  |  |
| Projection Review |  |  |  |
| Invocation Approval |  |  |  |
| Result Review |  |  |  |
| Repository Apply |  |  |  |
| Context Promotion |  |  |  |
| Cloud Opt-in |  |  |  |
| Retention·Deletion |  |  |  |

다음 비동치를 유지한다.

```text
Handoff Approval
≠ Action Approval

Projection Review
≠ Invocation Approval

Result Review
≠ Repository Apply
≠ Context Promotion
```

Invocation Approval은 Local Invocation이
승인된 POC 또는 별도 Product Decision으로 활성화된 경우에만 적용한다.

적용되지 않으면 `not_applicable`과 근거를 기록한다.

Template에 이 Gate가 있다는 사실만으로
Local Invocation이 Accepted Product Scope가 되지 않는다.

Human Gate 추가·삭제·병합·완화·책임 이전은 관련 Product·Contract·Safety 영향 검토가 필요하다.

---

## 15. Product Impact

### User

```text
- <affected user>
```

### User Value

```text
- <value gained or lost>
```

### Version Scope

```text
V1 / V2 / V3 / no change
```

### Scope Change

```text
No change
```

또는:

```text
<accepted Product Decision required>
```

Architecture·Contract·Safety Decision만으로 Product Scope를 조용히 변경하지 않는다.

---

## 16. Architecture Impact

```text
- Component Boundary
- Dependency Direction
- Shared Core·Extension
- Local·Cloud Boundary
- Data Boundary
- Runtime Adapter
- Process Supervisor
```

Architecture 변경이 있다면:

```text
관련 ADR
affected architecture documents
migration impact
```

를 기록한다.

---

## 17. Contract Impact

영향받는 Contract:

```text
- <root-relative path>
```

영향 유형:

```text
Input Meaning
Output Meaning
State Axis
Human Gate
Validation Rule
Reference Rule
Owner Responsibility
```

Contract 의미를 변경하면 별도 Contract Decision과 canonical Contract 수정이 필요하다.

---

## 18. Safety and Privacy Impact

### Safety Invariant

```text
- <affected invariant>
```

### Secret

```text
- <secret handling impact>
```

### Personal·Sensitive Data

```text
- <data impact>
```

### Local·Cloud Boundary

```text
- <transfer or storage impact>
```

### Failure Handling

```text
- <timeout, cancellation, cleanup, scope escape impact>
```

Safety 실패를 Known Limitation으로 우회하지 않는다.

---

## 19. Testing and Release Impact

### Product Release Requirement

```text
No change
```

또는:

```text
<required Completion Criteria change>
```

### Testing

```text
- Fixture Coverage
- Assertion
- Manual E2E
- Evidence Format
```

다음을 구분한다.

```text
Release Requirement
= Product Completion Criteria ownership

Verification Suite·Evidence
= Testing ownership
```

`quality_release` Scope의 Decision은
Release Requirement 또는 Verification Policy의
채택·변경 상태를 기록한다.

실제 Fixture Result·Manual E2E 통과나
Product Release 완료를 판정하지 않는다.

Release Requirement는 Product Completion Criteria가,
Verification Suite·Evidence는 Testing이 소유한다.

Decision 자체가 Fixture 통과를 증명하지 않는다.

---

## 20. Roadmap Impact

```text
roadmap_item_refs:
- <item ID>
```

기록할 내용:

```text
Priority
Version Target
Dependency
Entry Criteria
Completion Condition
```

Decision Accepted만으로 Roadmap Item을 `completed`로 만들지 않는다.

---

## 21. POC and Experiment

Decision Status가 `experiment`이거나 POC에 의존하면 기록한다.

```text
poc_refs:
- <POC path or experiment ID>
```

구분:

```text
decision_status
poc_lifecycle
poc_outcome
```

예:

```text
decision_status: experiment
poc_lifecycle: completed
poc_outcome: validated_with_constraints
```

POC Outcome은 Product Decision Status를 자동 변경하지 않는다.

---

## 22. Evidence

필요 Evidence:

```text
- Product analysis
- Architecture analysis
- Contract review
- Fixture result
- Manual E2E
- POC result
- Security review
- Legal review
- Operational evidence
- User research
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

해당 값은 보조 Metadata로 사용할 수 있으나
Stable·Versioned Evidence Reference를 대체하지 않는다.

Evidence 존재는 Decision Accepted를 자동 의미하지 않는다.

---

## 23. Implementation and Verification

### Implementation Status

```text
not_started
in_progress
implemented
partially_implemented
not_verifiable
not_applicable
```

현재:

```text
<implementation_status>
```

`implemented` 또는 `partially_implemented`를 사용하려면
최소 다음을 연결한다.

```text
implementation evidence reference
source revision
observed_at
environment
verified scope
```

해당 정보를 확인하지 못하면
`not_verifiable`을 유지한다.

### Verification

```text
- <verification reference>
```

```text
Decision accepted
≠ implementation verified
```

---

## 24. Documentation Impact

Affected Documents:

```text
- <root-relative path>
```

확인할 항목:

```text
Product docs
Architecture docs
Contracts
Testing
POC
Roadmap
Public docs
Templates
Handoffs
```

Public Documentation은 현재 유효한 `accepted` 또는
`accepted_with_constraints` Decision만 현재 지원 사실로 표현할 수 있다.

---

## 25. Migration

### Migration Steps

```text
- <step>
```

### Compatibility

```text
- <compatibility impact>
```

### Rollback

```text
- <rollback path>
```

### Irreversible Effects

```text
- <effect or none>
```

Migration이 없으면 `not_applicable`과 근거를 기록한다.

---

## 26. Open Questions

```text
- <question>
```

Open Question을 Decision 본문에서 이미 확정된 사실로 표현하지 않는다.

별도 Decision이 필요하면 Reference를 생성한다.

---

## 27. Status-specific Requirements

### Open

```text
Question
Options
Owner
Blocker
Decision timing
Affected docs
```

Open Decision을 Product Commitment로 표현하지 않는다.

### Experiment

```text
Hypothesis
POC reference
Threshold
Safety condition
Outcome handling
```

### Accepted

```text
Effective scope
Affected docs
Required follow-up
```

### Accepted with Constraints

```text
Constraints
Support boundary
Known limitations
Revisit condition
```

### Deferred

```text
Defer reason
Revisit condition
Target version or dependency
Risk
```

`deferred` 상태로 Active Scope에 복귀시키지 않는다.

재개하려면:

```text
Revisit Condition 충족 확인
기존 Deferred Decision과 근거 검토
새 accepted 또는 accepted_with_constraints Decision
영향 문서 갱신
Human Review
```

가 필요하다.

### Rejected

```text
Rejected option
Reason
Prohibited reintroduction scope
Reconsideration condition
```

다른 이름으로 조용히 재도입하지 않는다.

재검토하려면 새 근거·변경된 Scope·Reconsideration Condition을 포함한
새 Decision Record를 생성하고 기존 Rejected Decision을 Reference한다.

기존 Rejected Record의 의미를 수정하지 않는다.

### Superseded

```text
Replacement reference
Superseded scope
Effective date
```

---

## 28. Supersession

### Full Supersession

```text
기존 decision_status: superseded
기존 superseded_by: [DEC-XXXX]
신규 supersedes: [DEC-YYYY]
```

### Partial Supersession

잔여 유효 Scope가 존재하는 동안 기존 Decision은
`accepted` 또는 `accepted_with_constraints`를 유지한다.

Front Matter와 본문에 다음을 함께 기록한다.

```text
superseded_scope:
remaining_valid_scope:
replacement_decision_refs:
```

기존 Decision 전체가 유효하지 않을 때만 `superseded`로 전환한다.

---

## 29. Decision History

| Date | Previous Status | New Status | Reviewed By | Approved By | Reason | Reference |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | open | accepted |  |  |  |  |

Open → Accepted는 다음 중 하나로 추적한다.

```text
새 Accepted Decision Record
또는
불변 Status Transition Record
```

Review 수행은 Decision Approval을 자동 의미하지 않는다.

Approval이 필요하지 않은 상태 전환이면
`Approved By`에 `not_applicable`과 근거를 기록한다.

조용한 본문 수정만으로 상태를 변경하지 않는다.

`reviewed_at` 갱신만으로 다른 Decision을 대체하지 않는다.

---

## 30. Related Records

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
- <POC path or ID>
```

### Roadmap Items

```text
- <roadmap item ID>
```

### Source Inputs

```text
- <SRC-ID>
```

---

## 31. Review Checklist

### Scope and Ownership

- [ ] `decision_scope`가 정확히 하나의 Primary Scope다.
- [ ] Owner·Author·Reviewer·Approver·Implementer가 구분된다.
- [ ] Approver의 권한 근거가 기록됐다.
- [ ] 다른 canonical owner의 책임을 침범하지 않는다.
- [ ] Scope In·Out이 명확하다.

### Decision Quality

- [ ] Decision Question이 명확하다.
- [ ] 실질적인 Option을 비교했다.
- [ ] Rationale이 Driver와 연결된다.
- [ ] Constraints와 Consequences를 기록했다.

### Safety

- [ ] Human Gate 영향을 검토했다.
- [ ] Secret·Sensitive Data를 검토했다.
- [ ] Local·Cloud Boundary를 검토했다.
- [ ] Scope Escape·Timeout·Cleanup을 검토했다.
- [ ] Safety 실패를 Known Limitation으로 우회하지 않는다.

### Traceability

- [ ] `decision_id`가 유일하다.
- [ ] `affected_docs`가 실제 영향 문서만 포함한다.
- [ ] `evidence_refs`가 Stable·Versioned Reference다.
- [ ] 임시 Session·Attachment·Process ID를 canonical Evidence로 사용하지 않았다.
- [ ] Decision History가 상태 전환을 보존한다.
- [ ] Supersession Reference가 양방향이다.

### Truthfulness

- [ ] Observed·Asserted·Inferred를 구분했다.
- [ ] Decision Accepted와 Implementation 완료를 구분했다.
- [ ] POC Outcome과 Decision Status를 구분했다.
- [ ] 검증되지 않은 상태는 `not_verifiable`로 기록했다.
- [ ] Public Documentation이 제약을 누락하지 않는다.

---

## 32. Acceptance Record

### Decision Status

```text
<decision_status>
```

### Effective Scope

```text
<scope>
```

### Constraints

```text
<constraints or []>
```

### Required Follow-up

```text
- <follow-up>
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
<decision authority or governance reference>
```

### Effective From

```text
<date or null>
```

이 Section은 Human Review 결과를 기록한다.

Template 작성자·`authors`·`reviewers`·`implementers`는
명시적 권한 근거 없이 Approver가 되지 않는다.
