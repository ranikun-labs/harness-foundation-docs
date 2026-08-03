---
title: "Mac mini Primary와 AWS DR 기반 배포·재해복구 경계를 정의한다"
adr_id: "ADR-0016"
document_status: draft
decision_status: open
decision_scope: architecture
owner: architecture
authors: []
reviewers: []
approvers: []
created_at: "2026-08-03"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_started
constraints:
  - "이 ADR은 Architecture 후보를 검토하며 Runtime 구현이나 배포 완료를 승인하지 않는다"
  - "현재 사실, 사용자 승인 목표, Planning Candidate, Deferred 기술을 분리한다"
  - "RTO와 RPO는 실제 Restore·Failover Drill 전까지 target_not_verified 상태다"
  - "기존 ADR-0012~0015와 DEC-064~065를 supersede하지 않는다"
  - "System Catalog와 Confluence는 Projection이며 Canonical Architecture Decision이 아니다"
  - "실제 Secret, Credential, Host, IP, Account ID와 Backup 위치를 기록하지 않는다"
affected_docs:
  - docs/adr/README.md
  - docs/decisions/decision-log.md
evidence_refs:
  - RPL-42
  - RPL-42-comment-10144
  - RPL-20
  - RPL-23
  - RPL-31
  - RPL-33
  - ADR-0012
  - ADR-0013
  - ADR-0014
  - ADR-0015
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-0016: Mac mini Primary와 AWS DR 기반 배포·재해복구 경계를 정의한다

> **상태 경고**
>
> ```text
> Proposed architecture candidate
> ≠ Accepted decision
> ≠ Runtime implemented
> ≠ Infrastructure provisioned
> ≠ RTO/RPO achieved
> ≠ Disaster recovery verified
> ```
>
> RPL-42 Comment 10144의 사용자 입력은 Architecture Target과 Decision Driver를
> 고정한다. Docker Compose, ECR, ECS Fargate, S3 또는 Cloudflare Load Balancing의
> 채택이나 Runtime 운영을 증명하지 않는다.

---

## 1. Decision Summary

이 ADR은 Mac mini Primary와 AWS DR 사이에서 Ranikun Labs 서비스의 배포·복구
경계를 결정하기 위한 Architecture Record다. 현재 `decision_status`는 `open`이다.
RPL-42 Comment 10144로 비용, RTO, RPO, Failover, Write Policy와 운영 대응 목표가
승인 입력으로 고정됐지만, 이를 달성할 기술은 후속 Writer Slice의 대안 비교와
독립 검수 이후에만 결정한다. 실제 Runtime, Infrastructure와 운영 상태는 검증되지
않았다.

```text
Approved target input
≠ Technology adoption
≠ Runtime evidence
≠ Target achievement
```

---

## 2. Status

### Document Status

현재:

```text
document_status: draft
```

Draft 작성은 Architecture 승인이 아니다.

### Decision Status

현재:

```text
decision_status: open
```

Decision Input Lock은 Technology Adoption이 아니다.

### Implementation Status

현재:

```text
implementation_status: not_started
```

ADR Accepted는 Runtime 구현 완료와 다르다. Merge 전 RPL-42를 완료 상태로
전환하지 않는다.

---

## 3. Decision Scope

```text
decision_scope: architecture
```

### Scope In

- Primary Deployment Boundary
- Application Packaging Boundary
- Image Architecture
- Container Registry Failure Domain
- AWS DR Runtime Boundary
- Traffic Failover and Failback
- Data Backup / Restore / Promotion
- Write Enable and Fencing
- Stateful Recovery Order
- Secret and Configuration Boundary
- RTO / RPO Target State
- Observability and DR Drill
- Cost Guardrail
- Deferred Technology Re-evaluation Trigger

### Scope Out

- Dockerfile 구현
- Docker Compose 구현
- Terraform 구현
- AWS Resource 생성
- ECR, GHCR 또는 Harbor 생성
- ECS, EC2 또는 EKS 배포
- RDS 또는 Aurora 생성
- Cloudflare Load Balancer 설정
- Production Secret 또는 Credential 기록
- 실제 Backup·Restore 수행
- Application Code 변경
- RPL-27 구현
- RPL-33 Carryover Minor 처리
- System Catalog 즉시 수정
- Confluence Projection 수정
- Product SLA 승인
- Runtime 지원 또는 배포 완료 주장
- DEC-066 Record 생성
- ADR Index 등록
- Architecture Supporting README 생성

---

## 4. Context

### 4.1 Source Authority and Evidence Boundary

| Source Class | Reference | Authority | Permitted Use | Not Evidence Of |
|---|---|---|---|---|
| Canonical Internal Architecture | ADR-0012 | Accepted Git Architecture | Identity·Commerce 논리 경계 보존 | 물리 배포 또는 독립 Runtime |
| Canonical Internal Architecture | ADR-0013 | Accepted Git Architecture | Deployment Unit과 데이터 소유권 보존 | 물리 Host 또는 배포 완료 |
| Canonical Internal Architecture | ADR-0014 | Accepted Git Architecture | Shared Services 명칭 보존 | 실제 공동 배포 |
| Canonical Internal Architecture | ADR-0015 | Accepted Git Architecture | 통신 기본값과 Deferred Trigger 보존 | NATS·Kubernetes Runtime |
| Canonical Internal Architecture | DEC-064 | Accepted Git Decision | 통신·메시징·확장 승인 규칙 | Deployment/DR 기술 채택 |
| Canonical Internal Architecture | DEC-065 | Accepted Git Decision | Writer·Reviewer와 Canonical Owner Governance | RPL-42 Architecture 승인 |
| Work State / Human Input | RPL-42 | Jira Work State | Scope, 상태, 완료 조건과 후속 작업 추적 | Git Architecture 승인 또는 Runtime |
| Work State / Human Input | RPL-42 Comment 10144 | Human-approved Target Input | 비용·복구 목표와 Decision Driver 고정 | 기술 채택 또는 목표 달성 |
| Reviewed Projection | RPL-31 / Confluence Page 2129924 | Reviewed Projection | System Landscape 탐색과 상위 Source 연결 | Canonical Architecture 또는 Production 배포 |
| Reviewed Projection | RPL-33 / `catalog/system-catalog.yaml` | Machine-readable Projection | 검수된 Architecture 상태의 자동화용 탐색 | Canonical Decision 또는 Runtime Service Discovery |
| External Primary Evidence | Docker official documentation | Vendor Capability Evidence | Packaging·health·image capability 비교 | Ranikun Labs 채택 또는 Runtime 구현 |
| External Primary Evidence | AWS official documentation | Vendor Capability Evidence | AWS Runtime·Registry·Data capability 비교 | AWS Resource 존재 또는 운영 준비 |
| External Primary Evidence | PostgreSQL official documentation | Vendor Capability Evidence | Backup·WAL·restore·replication capability 비교 | 현재 Backup 또는 Restore 성공 |
| External Primary Evidence | Cloudflare official documentation | Vendor Capability Evidence | Tunnel·monitor·traffic steering capability 비교 | 실제 Failover 구성 |
| External Primary Evidence | Terraform official documentation | Vendor Capability Evidence | Infrastructure lifecycle과 state risk 비교 | Terraform 채택 또는 적용 완료 |

External Vendor 문서는 제품 Capability를 설명한다. Ranikun Labs의 Adoption,
Infrastructure Provisioning, Runtime 구현 또는 운영 성공을 증명하지 않는다.

### 4.2 Evidence Priority

높은 순서부터 다음 우선순위를 사용한다.

1. Accepted Git ADR / Decision
2. Merged Canonical Repository State
3. Approved Human Decision Input in RPL-42
4. Jira Work State
5. Reviewed Confluence Projection
6. System Catalog Projection
7. Official Vendor Capability Documentation
8. Planning Notes and AI Session Context

낮은 우선순위 Source는 높은 우선순위 결정을 덮지 않는다.

```text
AI Session and local temporary path
≠ Canonical evidence

Repository module existence
≠ Production deployment evidence

Jira Mac mini M4 input
≠ Verified hardware evidence
```

### 4.3 State Vocabulary

| State | Meaning |
|---|---|
| `verified_fact` | Stable Source 또는 직접 검증으로 확인된 사실 |
| `approved_target` | 권한 있는 사용자가 승인한 목표이며 달성 Evidence는 별도인 상태 |
| `planning_candidate` | 후속 비교·검수 대상이며 아직 채택되지 않은 후보 |
| `open` | Architecture 선택이 아직 결정되지 않은 상태 |
| `deferred` | Trigger 또는 선행 Evidence 전까지 결정을 미룬 상태 |
| `not_implemented` | 해당 기능이나 Runtime이 구현되지 않았음이 확인된 상태 |
| `runtime_unverified` | 실행 여부를 판단할 Runtime Evidence가 확보되지 않은 상태 |
| `target_not_verified` | 승인 목표가 Drill 또는 측정으로 달성 검증되지 않은 상태 |
| `not_applicable` | 해당 Concern이 현재 Scope에 적용되지 않는 상태 |
| `unknown` | 사실, 상태 또는 책임을 판단할 Evidence가 부족한 상태 |

```text
approved_target ≠ achieved
planning_candidate ≠ adopted
runtime_unverified ≠ not_running
deferred ≠ rejected
```

### 4.4 Existing Decision Preservation

| Existing Record | Preserved Scope | RPL-42 Scope | Supersession |
|---|---|---|---|
| ADR-0012 | Identity / Commerce logical boundary | Deployment and recovery | none |
| ADR-0013 | Deployment Units and data ownership | Physical Primary / DR placement | none |
| ADR-0014 | Shared Services naming | Host placement | none |
| ADR-0015 | HTTP/SSE and deferred technology triggers | Deployment/network/recovery | none |
| DEC-064 | Communication adoption rule | Deployment/DR | none |
| DEC-065 | Writer/reviewer governance | RPL-42 process | none |

```text
Existing ADR Supersession: none
```

- Kubernetes Trigger는 ADR-0015를 유지한다.
- Product와 Shared Service의 데이터 소유권은 ADR-0013을 유지한다.
- 이 ADR은 Service Boundary를 재설계하지 않는다.

### 4.5 User-approved Target Inputs

RPL-42 Comment 10144의 입력을 Technology 선택과 분리해 기록한다.

| Input | State | Approved value |
|---|---|---|
| 월 DR 고정비 목표 | `approved_target` | 월 50,000원 이하 |
| 월 DR 고정비 Hard cap | `approved_target` | 월 100,000원 이하 |
| Gateway/Carelog RTO | `target_not_verified` | 4시간 |
| PostgreSQL RPO | `target_not_verified` | 15분 |
| Failover | `approved_target` | Health Detection + Human Approval |
| Write Policy | `approved_target` | Fencing·Restore·Consistency 검증 전 Write 금지 |
| Operator Response | `approved_target` | 가능한 경우 장애 인지 후 1시간 이내 착수, 24/7 SLA 아님 |
| AWS Region | `planning_candidate` | `ap-northeast-2` |
| Managed DB Primary | `approved_target` | 초기 미채택 |
| Standby | `planning_candidate` | Cold Standby initial candidate |
| Drill | `approved_target` | 월간 Restore Check + 분기 Full DR Drill |
| Approval Owner | `approved_target` | 박성환 |

```text
RTO target = 4 hours
≠ Fargate selection
≠ Warm Standby selection
≠ RTO achievement

RPO target = 15 minutes
≠ WAL backup operation evidence
≠ RPO achievement
```

### 4.6 Observed, Assumed and Trigger

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Current Verified Facts, Assumptions and Constraints는 Slice 2에서 Source별로 분리한다.

---

## 5. Problem Statement

Ranikun Labs는 단일 Host Primary 서비스를 어떤 Artifact와 운영 경계로 패키징하고
운영·복구·Failback해야 Mac mini 상실 시 승인된 비용과 운영 역량을 넘지 않으면서,
필요한 데이터 손실 허용 구간을 지키고 이중 Writer를 만들지 않은 채 AWS DR
환경으로 복구할 수 있는가?

---

## 6. Drivers

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Driver는 해결책이 아니라 비용, 복구 목표, 운영 역량, Failure Isolation과
Truthfulness를 평가하는 기준으로 작성한다.

---

## 7. Constraints

### Hard Constraints

- 이 ADR은 Architecture 후보를 검토하며 Runtime 구현이나 배포 완료를 승인하지 않는다.
- 현재 사실, 사용자 승인 목표, Planning Candidate, Deferred 기술을 분리한다.
- RTO와 RPO는 실제 Restore·Failover Drill 전까지 `target_not_verified` 상태다.
- 기존 ADR-0012~0015와 DEC-064~065를 supersede하지 않는다.
- System Catalog와 Confluence는 Projection이며 Canonical Architecture Decision이 아니다.
- 실제 Secret, Credential, Host, IP, Account ID와 Backup 위치를 기록하지 않는다.

### Detailed Constraints

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Preference, Assumption과 Known Limitation은 Hard Constraint와 혼합하지 않는다.

---

## 8. Considered Options

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Compose, Image Architecture, Registry, AWS Runtime, Data DR, Traffic 전환과
Infrastructure 관리 대안은 후속 Slice에서 실질적으로 비교한다.

---

## 9. Decision

**No architecture option is accepted in Slice 1.**

현재 Decision은 `open`이다. Slice 1은 문서의 상태, Scope, Source Authority,
Evidence Priority와 상태 어휘만 고정한다.

### Ownership

| Concern | Canonical Owner | This Slice Changes It? |
|---|---|---:|
| Product Scope | Product documents and Product Decision | No |
| Architecture Boundary | Architecture documents and ADR | Evidence boundary only |
| Contract Meaning | Contract documents and Contract Decision | No |
| Release Requirement | Product Completion Criteria | No |
| Testing Evidence | Versioned testing and operational evidence | No |

---

## 10. Rationale

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

---

## 11. Consequences

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

---

## 12. Human Authority Impact

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Comment 10144는 Target Input Authority다. Architecture Option Approval, Repository
Merge, Runtime Action Approval 또는 Write Enable Approval로 확대 해석하지 않는다.

---

## 13. Local·Cloud·Data Impact

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Local Primary, Cloud DR, Business Data, ephemeral state와 Secret 경계는 후속
Slice에서 별도로 분석한다.

---

## 14. Shared Core and Extension Impact

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

이 ADR은 Shared Identity, Shared AI, Shared Commerce 또는 Audit Consumer의
독립 Runtime 구현을 승인하지 않는다.

---

## 15. Contract Impact

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Slice 1은 Contract 의미, Field, Validation 또는 Human Gate를 변경하지 않는다.

---

## 16. Product and Roadmap Impact

### Product Scope

```text
No change
```

### Roadmap

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

ADR 작성은 Product SLA, Release Requirement 또는 Roadmap Commitment를 생성하지
않는다.

---

## 17. Testing and Evidence

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

RTO/RPO는 실제 크기와 장애 조건을 반영한 Restore·Failover·Failback Drill
Evidence 전까지 `target_not_verified`를 유지한다.

Canonical Evidence로 사용하지 않는 항목:

- AI Session ID
- Local Temporary Path
- Process PID
- UI Component ID
- 검증되지 않은 구두 운영 상태

---

## 18. Migration and Rollback

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Slice 1에는 Runtime Migration, Data Restore 또는 Rollback 실행이 없다.

---

## 19. Implementation Notes

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

```text
implementation_status: not_started
```

Implementation Notes는 실행 코드나 운영 구성의 Source of Truth가 아니다.

---

## 20. Known Limitations

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

현재 알려진 핵심 제한은 실제 Runtime, Hardware, Backup, Restore, Cloud Resource와
Traffic 상태가 검증되지 않았다는 점이다.

---

## 21. Open Questions

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

후속 Slice는 현재 사실, Application Artifact 제약, Backup 상태, 복구 측정 방법과
각 기술 대안의 비용·운영 한계를 Source Evidence로 확인한다.

---

## 22. Related Records

### Decisions

- DEC-064
- DEC-065

### ADRs

- ADR-0012
- ADR-0013
- ADR-0014
- ADR-0015

### Jira

- RPL-42
- RPL-42 Comment 10144
- RPL-20
- RPL-23
- RPL-31
- RPL-33

### Projections

- Confluence Page 2129924
- `catalog/system-catalog.yaml`

### Affected Documents

- `docs/adr/README.md`
- `docs/decisions/decision-log.md`

Affected Documents는 후속 Slice에서만 수정한다.

---

## 23. Supersession

```text
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []

Existing ADR Supersession: none
```

이 ADR은 ADR-0012~0015 또는 DEC-064~065의 전체·일부 Scope를 대체하지 않는다.

---

## 24. Decision History

| Date | Previous Status | New Status | Reviewed By | Approved By | Reason | Reference |
|---|---|---|---|---|---|---|
| 2026-08-03 | not_applicable | open | not_applicable | not_applicable | Slice 1에서 Evidence Boundary와 Target Input을 기록 | RPL-42 / Comment 10144 |

이 History는 Architecture Option Approval이 아니다.

---

## 25. Review Checklist

### Scope

- [x] Architecture Scope In·Out을 분리했다.
- [x] Product Scope와 Runtime 구현을 변경하지 않는다.
- [ ] 후속 Slice에서 대안과 선택 근거를 완성한다.

### Alternatives

- [ ] 실질적인 대안을 비교했다.
- [ ] 선택 이유를 Driver와 연결했다.
- [x] Slice 1에서 Architecture Option을 채택하지 않았다.

### Safety

- [x] Write Enable과 Fencing을 Decision Scope에 포함했다.
- [x] 실제 Secret, Credential, Host, IP와 Account ID를 기록하지 않았다.
- [ ] 후속 Slice에서 Local·Cloud·Data Failure Domain을 검토한다.

### Traceability

- [x] `adr_id`와 Source Authority를 기록했다.
- [x] Owner, Author, Reviewer, Approver를 분리했다.
- [x] Supersession이 `none`임을 기록했다.
- [ ] ADR Index와 Decision Log는 후속 Slice에서 연결한다.

### Truthfulness

- [x] Approved Target과 Target Achievement를 분리했다.
- [x] Planning Candidate와 Adoption을 분리했다.
- [x] Repository Module과 Production Deployment를 분리했다.
- [x] Runtime 구현 상태를 `not_started`로 기록했다.

---

## 26. Acceptance Record

### Decision

```text
decision_status: open
No architecture option is accepted in Slice 1.
```

### Constraints

Front Matter와 Section 7의 Constraints를 적용한다.

### Effective Scope

```text
Evidence Boundary and Decision Input State only
```

### Required Follow-up

- ADR-0016 Slice 2 - Current Verified Facts, Assumptions and Constraints
- 후속 Slice의 대안 비교와 독립 Review
- ADR Index와 DEC-066 연결은 별도 Slice

### Review and Approval

```text
reviewed_at: null
approved_at: null
approvers: []
```

Architecture Option, Runtime 구현과 Infrastructure Provisioning은 승인되지 않았다.
