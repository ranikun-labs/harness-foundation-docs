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
- ADR-0013의 Deployment Unit과 Data Ownership은 변경하지 않는다.
- ADR-0015의 Communication Default와 Deferred Technology Trigger는 유지한다.
- RPL-42는 Runtime Placement와 Recovery Boundary만 후속 결정한다.
- 물리 배포 선택은 논리 Service Boundary를 합치지 않는다.
- 같은 Host 또는 같은 DB Cluster 사용은 Data Ownership 통합을 뜻하지 않는다.

### 4.5 Verified Facts

#### Repository / Governance Facts

- `verified_fact`: Foundation Repository의 Canonical main은
  `034bb175ce45c571d84292c701989d830f2bf8c3`이다.
- `verified_fact`: RPL-42는 `진행 중`이며 Resolution은 `None`이다.
- `verified_fact`: ADR-0016은 `draft` / `open` / `not_started` 상태다.
- `verified_fact`: RPL-42 Comment 10144는 박성환이 작성한 사용자 승인 Target
  Input이다.
- `verified_fact`: System Catalog와 Confluence System Landscape는 Projection이다.
- `verified_fact`: Projection은 Runtime Deployment Evidence가 아니다.

#### Existing Architecture Facts

- `verified_fact`: PostgreSQL은 Business Data Source of Truth다.
- `verified_fact`: Redis는 Session, Cache와 Ephemeral State이며 Business SSOT가
  아니다.
- `verified_fact`: 각 Product/Service가 자신의 데이터와 Migration을 소유한다.
- `verified_fact`: Cross-service Database 직접 접근, Foreign Key와 OLTP JOIN은
  금지된다.
- `verified_fact`: 내부 동기 통신 기본값은 HTTP/JSON이다.
- `verified_fact`: AI Streaming 목표 Transport는 SSE다.
- `verified_fact`: NATS JetStream은 Trigger 충족 전 현재 Runtime이 아니다.
- `verified_fact`: Kubernetes는 ADR-0015 Trigger 충족 Evidence 없이 채택하지
  않는다.
- `not_implemented`: Shared Identity 독립 Runtime은 구현되지 않았다.
- `not_implemented`: Shared AI Runtime은 구현되지 않았다.
- `not_implemented`: Finance Harness Backend는 구현되지 않았다.
- `not_implemented`: Dev Harness Cloud Runtime은 구현되지 않았다.

#### Repository Evidence Facts

- `verified_fact`: `care-log/carelog-be` local repository snapshot
  `docs/RPL-28-oauth-state-client-binding-contract@1b16a14a4a2b924dd84301e100752d029c03679b`
  에서 Carelog Gateway와 Application의 Spring Boot entrypoint가 확인됐다.
- `verified_fact`: 같은 snapshot에 `docker-compose.yml`은 존재하고 Dockerfile은
  발견되지 않았다. 이 관찰은 해당 branch/SHA에 한정된다.
- Repository Module 또는 Compose 파일 존재는 Production Deployment, 실제 운영
  방식 또는 운영 Traffic Evidence가 아니다.
- Carelog Auth/OAuth 구현은 Shared Identity 독립 Runtime 구현을 의미하지 않는다.
- Dockerfile과 Compose의 최종 존재·호환성·사용 상태는 각 Product Repository의
  결정 대상 revision과 Runtime Evidence로 다시 검증해야 한다.

다음은 Verified Fact로 승격하지 않는다.

- Mac mini가 실제 Production Primary라는 주장
- Docker Compose가 현재 운영 배포 방식이라는 주장
- Cloudflare Tunnel이 실제 운영 Traffic을 처리한다는 주장
- PostgreSQL이 실제 Mac mini에 설치됐다는 주장
- Backup 또는 WAL Archive가 현재 동작한다는 주장
- AWS DR 환경이 준비됐다는 주장

### 4.6 Approved Architecture Targets

RPL-42 Comment 10144의 입력을 Technology 선택과 분리해 기록한다.

| Input | State | Approved value | Verification |
|---|---|---|---|
| 월 DR 고정비 목표 | `approved_target` | 월 50,000원 이하 | Resource·Traffic별 비용 산정 필요 |
| 월 DR 고정비 Hard cap | `approved_target` | 월 100,000원 이하 | 실제 청구 항목 검토 필요 |
| Gateway/Carelog RTO | `target_not_verified` | 4시간 | Full DR Drill 필요 |
| PostgreSQL RPO | `target_not_verified` | 15분 | Backup/WAL Gap과 Restore Drill 필요 |
| Failover | `approved_target` | Health Detection + Human Approval | 승인·감사 흐름 검증 필요 |
| Write Policy | `approved_target` | Fencing·Restore·Consistency 검증 전 Write 금지 | Fencing과 Write Enable Evidence 필요 |
| Operator Response | `approved_target` | 가능한 경우 장애 인지 후 1시간 이내 착수 | 실제 On-call 가능 시간 확인 필요 |
| 24/7 SLA | `approved_target` | 현재 없음 | Product SLA와 혼합하지 않음 |
| AWS Region | `planning_candidate` | `ap-northeast-2` | AWS Account, 데이터 위치와 서비스 가용성 확인 필요 |
| Managed DB Primary | `approved_target` | 초기 미채택 | Data DR 대안 비교에서 제약으로 사용 |
| Standby | `planning_candidate` | Cold Standby initial candidate | Provision·Restore 시간 측정 필요 |
| Drill | `approved_target` | 월간 Restore Check + 분기 Full DR Drill | Evidence 보존 절차 필요 |
| Approval Owner | `approved_target` | 박성환 | Failover·Write·Failback Authority 구체화 필요 |

```text
RTO target = 4 hours
≠ Fargate selection
≠ Warm Standby selection
≠ RTO achievement

RPO target = 15 minutes
≠ WAL backup operation evidence
≠ RPO achievement
```

### 4.7 Runtime-unverified Assumptions

| Item | State | Required Evidence |
|---|---|---|
| 실제 Mac mini 모델, CPU Architecture와 Memory | `runtime_unverified` | Hardware inventory |
| Mac mini의 실제 Production Primary 여부 | `runtime_unverified` | Deployment와 Traffic evidence |
| 현재 실행 중인 서비스 목록 | `unknown` | Process/container/service inventory |
| Docker Engine / Compose 사용 여부와 Version | `runtime_unverified` | Host runtime inventory |
| 배포 시작·재시작·Rollback 방식 | `unknown` | 운영 절차와 실행 evidence |
| PostgreSQL 실제 Host와 Version | `runtime_unverified` | Database runtime inventory |
| PostgreSQL DB 크기와 일일 변경량 | `unknown` | Database metrics |
| Base Backup 존재 여부 | `runtime_unverified` | Versioned backup evidence |
| WAL Archive 존재 여부와 Archive Gap | `runtime_unverified` | Archive status와 gap metrics |
| Redis 실제 Host와 Persistence 설정 | `runtime_unverified` | Redis runtime configuration evidence |
| Uploaded Asset 또는 Local File 존재 여부 | `unknown` | Product data inventory |
| Cloudflare Tunnel 실제 운영 적용 여부 | `runtime_unverified` | Connector와 traffic evidence |
| Cloudflare Load Balancing 구성 여부 | `runtime_unverified` | Load Balancer configuration evidence |
| Domain / DNS 소유와 실제 Traffic | `unknown` | Registrar, DNS와 traffic evidence |
| AWS Account 존재와 접근 권한 | `runtime_unverified` | Account와 IAM access evidence |
| AWS 실제 Region 사용 가능 여부 | `unknown` | Account quota, policy와 service availability |
| VPC, ALB, ECS, RDS, S3 Resource 존재 여부 | `runtime_unverified` | AWS inventory |
| ECR 또는 GHCR Registry 존재 여부 | `runtime_unverified` | Registry inventory와 ownership |
| Multi-platform Image Build 가능 여부 | `unknown` | Product별 build/test evidence |
| 현재 Secret Storage와 Rotation 절차 | `runtime_unverified` | Redacted secret inventory와 rotation record |
| 현재 Monitoring / Alerting | `runtime_unverified` | Monitor, alert와 ownership evidence |
| 현재 Restore Drill Evidence | `runtime_unverified` | Versioned drill result |
| 실제 Operator On-call 가능 시간 | `unknown` | 운영자 대응 합의와 escalation policy |

```text
runtime_unverified
≠ false
≠ not running
```

`runtime_unverified`는 확인 Evidence가 없다는 의미다. 대상이 존재하지 않거나
실행되지 않는다고 판정하지 않는다.

---

## 5. Problem Statement

Ranikun Labs는 단일 Host Primary 서비스를 어떤 Artifact와 운영 경계로 패키징하고
운영·복구·Failback해야 Mac mini 상실 시 승인된 비용과 운영 역량을 넘지 않으면서,
필요한 데이터 손실 허용 구간을 지키고 이중 Writer를 만들지 않은 채 AWS DR
환경으로 복구할 수 있는가?

---

## 6. Drivers

- 단일 Primary Host 장애에서 복구할 수 있어야 한다.
- Business Data Loss Window를 승인된 목표 안으로 제한해야 한다.
- Dual Writer와 Split-brain을 방지해야 한다.
- 1인 운영자가 감당 가능한 운영 복잡도를 유지해야 한다.
- 평상시 고정비 목표와 Hard cap을 넘지 않아야 한다.
- 동일 Application Artifact를 Primary와 DR에서 재사용할 수 있어야 한다.
- Secret과 Backup을 Primary Host와 분리해 보존할 수 있어야 한다.
- RTO/RPO를 실제 Restore·Failover Drill로 검증할 수 있어야 한다.
- 기존 Service Boundary와 Data Ownership을 보존해야 한다.
- Trigger 없는 Kubernetes 선도입을 방지해야 한다.
- Repository, Projection과 Runtime 상태를 과장하지 않아야 한다.
- Failover, Write Enable과 Failback의 Human Approval 경계를 보존해야 한다.
- Primary 장애와 Registry 장애를 동일 Failure Domain에 결합하지 않아야 한다.
- Host 관리 부담과 복구 시 수동 작업을 측정 가능하게 줄여야 한다.

Driver는 해결책 이름이나 기술 채택 선언이 아니다.

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

#### Hard Architecture Constraints

- 기존 ADR-0012~0015를 supersede하지 않는다.
- Product/Service별 데이터와 Migration 소유권을 유지한다.
- Cross-service Database 직접 접근, Foreign Key와 OLTP JOIN을 금지한다.
- PostgreSQL을 Business Data SSOT로 유지한다.
- Redis를 Business SSOT로 승격하지 않는다.
- 기존 Primary를 Fence하지 않은 상태에서 DR Writer를 활성화하지 않는다.
- Restore 또는 Promotion과 Consistency 검증 전 Write를 허용하지 않는다.
- Secret을 Image 또는 Git Repository에 포함하지 않는다.
- 실제 Host, IP, Account ID, Credential과 Backup 위치를 Foundation Repository에
  기록하지 않는다.
- System Catalog와 Confluence를 Canonical Decision으로 사용하지 않는다.
- Kubernetes 재검토는 ADR-0015 Trigger를 따른다.
- Runtime 구현은 별도 Jira와 구현 Repository가 소유한다.

#### Approved Operational Constraints

- 평상시 DR 고정비 목표는 월 50,000원 이하이고 Hard cap은 월 100,000원이다.
- Gateway/Carelog RTO Target은 4시간이며 `target_not_verified`다.
- PostgreSQL RPO Target은 15분이며 `target_not_verified`다.
- Write Enable은 Human Approval을 요구한다.
- 현재 24/7 SLA를 약속하지 않는다.
- 월간 Restore Check와 분기 Full DR Drill을 목표로 한다.

#### Assumptions Requiring Verification

- `runtime_unverified`: Primary 후보 Hardware가 Mac mini M4다.
- `planning_candidate`: AWS 서울 Region을 사용할 수 있다.
- `planning_candidate`: Cold Standby로 승인된 RTO/RPO 목표를 충족할 수 있다.
- `planning_candidate`: Product별 Multi-platform Image를 만들 수 있다.
- `planning_candidate`: Managed container runtime 후보가 현재 Application과 호환된다.
- `planning_candidate`: WAL Archive로 15분 RPO Target을 검증할 수 있다.

Assumption은 Constraint나 Fact로 승격하지 않는다.

#### Known Limitations

- 1인 운영이므로 Operator 부재 시 RTO Target을 초과할 수 있다.
- Cold Standby 후보는 실제 Provision과 Restore 시간에 민감하다.
- 비용 상한은 AWS Resource와 Traffic이 확정되기 전까지 추정 Target이다.
- 실제 DB 크기와 WAL 양이 없어 복구시간을 계산할 수 없다.
- Production Traffic Evidence가 없다.
- Cross-region Region Failure는 현재 Scope에서 `deferred`다.
- RTO/RPO는 Drill 전 달성 상태가 아니다.

Preference, Assumption과 Known Limitation은 Hard Constraint와 혼합하지 않는다.

---

## 8. Considered Options

Pending later RPL-42 writer slice.
No decision has been accepted in this section.

Compose, Image Architecture, Registry, AWS Runtime, Data DR, Traffic 전환과
Infrastructure 관리 대안은 후속 Slice에서 실질적으로 비교한다.

---

## 9. Decision

**No architecture option is accepted in Slice 2.**

현재 Decision은 `open`이다. Slice 2는 Verified Fact, Approved Target,
Planning Candidate와 Runtime-unverified 상태를 분리한다.

| Technology | State |
|---|---|
| Docker Compose | `planning_candidate` |
| Multi-platform Image | `planning_candidate` |
| ECR | `planning_candidate` |
| ECS Fargate + ALB | `planning_candidate` |
| Cold Restore | `planning_candidate` |
| S3 Backup/WAL | `planning_candidate` |
| Cloudflare Approval-gated Failover | `planning_candidate` |
| Terraform | `planning_candidate` |
| Kubernetes / EKS / Helm / Harbor | `deferred` |

이 표는 비교할 상태만 정의하며 Architecture 선택을 승인하지 않는다.

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

### Local Boundary

다음은 Local 배치 후보 범위다. 실제 배치 상태는 모두 `runtime_unverified`다.

- Application Runtime Primary 후보
- PostgreSQL Primary 후보
- Redis Ephemeral Runtime 후보
- Local Secret Source 후보

### Cloud Boundary

다음은 후속 Slice에서 판단할 `planning_candidate` 또는 `open` 범위다.

- Container Image Registry
- AWS Application DR Runtime
- Off-host Backup / WAL Storage
- Secret / Configuration Store
- Monitoring / Alerting
- Traffic Failover Target

### Data Classes

| Data Class | Current Evidence State | Canonical Owner |
|---|---|---|
| PostgreSQL Business Data | `verified_fact`: Business SSOT, 물리 위치는 `runtime_unverified` | 해당 Product/Service |
| Redis Session / Cache | `verified_fact`: ephemeral, 물리 위치·persistence는 `runtime_unverified` | 해당 Runtime Product/Service |
| Uploaded Asset / Local File | `unknown` | 존재할 경우 해당 Product |
| Container Image | `planning_candidate`, 현재 Registry와 build 상태는 `runtime_unverified` | Product build/release owner |
| Backup / WAL | 존재·보존·gap 모두 `runtime_unverified` | Business Data owner와 Operations |
| Secret / Credential | 저장·rotation 상태 `runtime_unverified` | Credential별 Service/Operations owner |
| Deployment Metadata | `unknown` | 구현 Repository와 Operations |
| DR Evidence | `target_not_verified` | DR Drill owner와 RPL-42 후속 구현 Jira |
| Audit Event / Projection | `deferred`, 현재 Business Primary Store 아님 | Producer 원본 의미 / Audit Consumer Projection 후보 |

같은 Host 또는 같은 Database Cluster에 배치하더라도 Logical Owner와 Migration
Owner는 통합되지 않는다.

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

- Product Repository별 Dockerfile 존재 여부와 대상 revision을 조사해야 한다.
- ARM64/AMD64 Native Dependency와 platform별 test 결과를 조사해야 한다.
- 실제 PostgreSQL Version, Size와 WAL 생성률을 측정해야 한다.
- 실제 데이터 크기로 Restore Drill을 수행해야 한다.
- Cloudflare Tunnel과 Load Balancing 구성 Evidence를 확인해야 한다.
- AWS Account, Region과 IAM Boundary를 확인해야 한다.
- ECR/GHCR 비교 전 Authentication Owner를 확인해야 한다.
- Terraform State의 저장, 암호화, 접근과 복구 Boundary를 확인해야 한다.
- Secret Inventory와 Primary Host 상실 시 Revocation 절차가 필요하다.

```text
Implementation note
≠ implementation approval
≠ implementation completion

implementation_status: not_started
```

Implementation Notes는 실행 코드나 운영 구성의 Source of Truth가 아니다.

---

## 20. Known Limitations

- 1인 운영이므로 Operator 부재 시 RTO Target을 초과할 수 있다.
- Cold Standby 후보는 실제 Infrastructure Provision과 Data Restore 시간에
  민감하다.
- 비용 목표는 AWS Resource, Network와 Traffic 구성 전까지 검증되지 않는다.
- 실제 PostgreSQL 크기와 WAL 생성량이 없어 Restore 시간을 계산할 수 없다.
- Production Deployment와 Traffic Evidence가 없다.
- Cross-region AWS Region Failure 복구는 현재 Scope에서 `deferred`다.
- RTO 4시간과 RPO 15분은 Drill 전 `target_not_verified`다.
- Product Repository snapshot의 Compose 파일 존재는 Runtime 사용을 증명하지
  않는다.
- Dockerfile이 해당 snapshot에서 발견되지 않았지만 다른 결정 대상 revision의
  부재까지 증명하지 않는다.

---

## 21. Open Questions

Comment 10144에서 승인된 비용, RTO/RPO, Failover, Write, 응답시간, 초기 Managed
DB 정책과 Drill 주기는 Open Question으로 되돌리지 않는다.

### Runtime Discovery

- 실제 Primary Host Specification은 무엇인가?
- 어떤 서비스가 실제 운영 중인가?
- Docker/Compose가 현재 사용되는가?
- PostgreSQL과 Redis는 어디에 위치하는가?
- 실제 DB Size와 WAL 생성량은 얼마인가?
- Uploaded Asset 또는 Local File Business Data가 존재하는가?

### Existing Operations

- 현재 Backup은 존재하는가?
- 마지막 Restore 성공 Evidence는 있는가?
- 현재 Monitoring과 Alert Owner는 누구인가?
- Cloudflare Tunnel과 Load Balancing은 실제 구성돼 있는가?
- Domain과 DNS의 Canonical Owner는 누구인가?

### AWS / Registry

- AWS Account와 IAM 접근은 준비됐는가?
- `ap-northeast-2` 사용 제약은 없는가?
- ECR과 GHCR 중 Failure Domain 우선순위는 무엇인가?
- NAT Gateway 또는 VPC Endpoint 비용이 Cost cap 안에 들어오는가?

### Verification

- Cold Standby로 4시간 RTO Target을 충족할 수 있는가?
- WAL Archive로 15분 RPO Target을 충족할 수 있는가?
- Multi-platform Image가 모든 Product에서 동작하는가?
- Operator 부재 시 Escalation은 어떻게 하는가?
- Full Failback Drill 범위는 어디까지인가?

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

### Repository Evidence

- `aixion1506/harness-foundation-docs@034bb175ce45c571d84292c701989d830f2bf8c3`
- `care-log/carelog-be@1b16a14a4a2b924dd84301e100752d029c03679b`

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
| 2026-08-04 | open | open | not_applicable | not_applicable | Slice 2에서 Verified Fact, Target, Candidate와 Runtime-unverified 상태를 분리 | RPL-42 / Comment 10144 |

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
- [x] Slice 2에서 Architecture Option을 채택하지 않았다.

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
No architecture option is accepted in Slice 2.
```

### Constraints

Front Matter와 Section 7의 Constraints를 적용한다.

### Effective Scope

```text
Evidence Boundary and Decision Input State only
```

### Required Follow-up

- ADR-0016 Slice 3 - Primary Deployment, Image Architecture and Registry Matrix
- 후속 Slice의 대안 비교와 독립 Review
- ADR Index와 DEC-066 연결은 별도 Slice

### Review and Approval

```text
reviewed_at: null
approved_at: null
approvers: []
```

Architecture Option, Runtime 구현과 Infrastructure Provisioning은 승인되지 않았다.
