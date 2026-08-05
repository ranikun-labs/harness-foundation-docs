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
| `planning_leader` | 현재 Driver 비교에서 선두인 후보이며 Decision 승인 전 상태 |
| `planning_candidate` | 후속 비교·검수 대상이며 아직 채택되지 않은 후보 |
| `conditionally_viable` | 명시된 조건과 검증을 충족하면 선택 가능한 후보 |
| `open` | Architecture 선택이 아직 결정되지 않은 상태 |
| `deferred` | Trigger 또는 선행 Evidence 전까지 결정을 미룬 상태 |
| `not_recommended` | 현재 Driver 기준 우선순위가 낮지만 영구 배제하지 않은 상태 |
| `verification_required` | 판단 또는 승인 전에 지정 Evidence가 필요한 상태 |
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

planning_leader
≠ selected
≠ adopted
≠ implementation approved
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

### 4.8 Slice 3 Official Capability Evidence

Accessed date: `2026-08-04`

| Source | Capability Evidence | Not Evidence Of |
|---|---|---|
| [Docker Multi-platform Builds](https://docs.docker.com/build/building/multi-platform/) | Manifest list, platform variant, Buildx와 build strategy | Product image compatibility 또는 build 성공 |
| [Docker Compose Services](https://docs.docker.com/reference/compose-file/services/) | Healthcheck, dependency, resource, restart와 runtime configuration | 현재 Compose 운영 |
| [Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/) | Service별 secret file 주입 | Secret 원본 보호 또는 현재 구성 |
| [Docker Image Pull by Digest](https://docs.docker.com/reference/cli/docker/image/pull/) | Immutable digest pull | Rollback 검증 완료 |
| [Docker Compose in Production](https://docs.docker.com/compose/how-tos/production/) | Single-server production override와 recreate 방식 | Host HA 또는 Ranikun Labs 채택 |
| [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) | OCI/Docker artifact와 token authentication | GHCR package 존재 |
| [GitHub Packages Permissions](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages) | Package role과 repository permission model | 현재 Organization ownership |
| [Amazon ECR Image Push](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-push.html) | OCI image와 multi-architecture manifest push | ECR repository 존재 |
| [Amazon ECR Lifecycle Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) | Image expiration/archive rule과 preview | Rollback digest 보존 정책 설정 |
| [Amazon ECR Private Registry Replication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html) | Cross-region/cross-account replication capability | DR Region 요구 또는 복제 구성 |
| [Harbor Repository and Artifact Documentation](https://goharbor.io/docs/2.14.0/working-with-projects/working-with-images/repositories/) | OCI artifact, digest와 image index 관리 | Harbor instance 존재 |
| [Harbor Installation Prerequisites](https://goharbor.io/docs/2.14.0/install-config/installation-prereqs/) | 설치 자원과 자체 운영 prerequisite | 1인 운영 적합성 또는 HA 완료 |

Vendor 문서는 제품 Capability, 지원 Configuration, 지원 Architecture와 운영상
제약만 증명한다. 현재 Runtime 구성, 비용 상한 충족, Product Image 호환 또는
장애 복구 검증을 증명하지 않는다.

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
- Harbor를 Mac mini Primary와 동일 Failure Domain에 배치하지 않는다.
- Primary Runtime Host 상실이 유일한 승인 복구 Image의 상실로 이어지지 않아야
  한다.

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

### 8.1 Primary Deployment Problem

단일 Mac mini에서 여러 Product·Shared Service 후보를 운영하면서 재시작,
Health Check, 설정 주입, Resource 제한, Rollback과 AWS DR Artifact 재사용을
어떤 배포 방식으로 일관되게 제공할 것인가?

### 8.2 Primary Deployment Evaluation Matrix

| Criterion | Native Host Process | Docker Compose | K3s / Kubernetes | VM Appliance |
|---|---|---|---|---|
| Process Supervision | acceptable, supervisor 의존 | strong | strong | acceptable, guest OS 의존 |
| Restart Policy | acceptable | strong | strong | acceptable |
| Health Check | weak, service별 편차 | strong | strong | weak |
| Readiness 표현 | weak | acceptable | strong | weak |
| Dependency Ordering | weak | acceptable | strong | weak |
| Configuration Injection | weak, host drift | strong | strong | weak, image 결합 |
| Secret Injection | weak, host별 절차 | acceptable | strong | weak |
| Resource Limit | weak | acceptable | strong | acceptable |
| Resource Isolation | weak | acceptable | strong | strong |
| Log Collection | acceptable | acceptable | strong | acceptable |
| Observability Integration | acceptable | acceptable | strong | acceptable |
| Deployment Reproducibility | weak | strong | strong | acceptable |
| Immutable Artifact 사용 | weak | strong | strong | acceptable, OS 결합 |
| Rollback | weak | strong candidate | strong | acceptable, coarse-grained |
| Host Reboot Recovery | acceptable, supervisor 검증 필요 | acceptable, test required | strong | acceptable |
| Mac mini 적합성 | strong for single app | acceptable, verification_required | high overhead | medium |
| AWS DR Artifact 재사용 | weak | strong | medium, local/cloud 차이 | weak |
| Operational Complexity | medium | low | high | medium |
| Upgrade Complexity | medium | medium | high | high |
| Storage / Network Complexity | low but implicit | medium | high | medium |
| 1인 운영 적합성 | acceptable for one app | strong candidate | weak | weak |
| Failure Domain | single host | single host | single node면 동일 | host image와 결합 |
| ADR-0015 Kubernetes Trigger | not_applicable | trigger evidence not_found | trigger evidence not_found | not_applicable |

#### Native Host Process

**Advantages**

- 초기 도구 수가 적다.
- Host Resource 접근이 직접적이다.
- 단일 Application에는 단순할 수 있다.

**Disadvantages and risks**

- Service별 Runtime, 언어 Version과 OS Package가 drift할 수 있다.
- Process Supervisor 품질에 재시작과 Host reboot 복구가 의존한다.
- Health와 Readiness 의미가 Service마다 달라질 수 있다.
- Rollback이 Binary·JAR·설정 교체 절차에 의존한다.
- AWS DR Runtime과 Artifact 모델이 달라질 수 있다.
- Secret, Environment와 Deployment Evidence가 Host별로 달라질 수 있다.

```text
planning assessment: not_recommended
```

실제 Service가 하나이고 Container 도입 비용이 더 크다는 Evidence가 생기면
재평가할 수 있다. 이 평가는 최종 비채택이 아니다.

#### Docker Compose

**Advantages**

- OCI Image로 Application Runtime을 고정할 수 있다.
- Service별 Health Check, Restart Policy, Environment와 Secret Injection을
  구조화할 수 있다.
- Resource Limit과 Host reboot 복구 절차의 후보를 제공한다.
- Digest 기반 Image 선택과 Rollback을 설계할 수 있다.
- Mac mini와 AWS DR에서 동일 Image를 재사용할 수 있다.
- Kubernetes보다 운영 복잡도가 낮아 1인 운영 Driver에 상대적으로 적합하다.

**Disadvantages and risks**

- Host 자체 HA와 Multi-host Scheduling을 제공하지 않는다.
- 단일 Host Failure를 해결하지 않는다.
- Storage와 Network Failure는 별도 설계가 필요하다.
- Secret 원본 보호를 자동 해결하지 않는다.
- Compose File과 운영 Override의 Version 관리가 필요하다.
- Stateful Service 복구와 Image Build·Registry·Promotion은 별도 Concern이다.

```text
planning assessment: planning_leader
adoption state: open
```

**Verification required**

- 실제 Docker Engine / Compose Version
- Product Image Build
- Service Health / Readiness
- Resource 사용량
- Host Reboot Test
- Digest Rollback Test

낮은 운영 복잡도, 동일 Artifact 재사용, 재현 가능한 Rollback 후보와
Kubernetes Trigger 미충족이 현재 Driver상 선두인 이유다.

#### K3s / Kubernetes

ADR-0015 Trigger:

- 복수 물리 Node
- Service Replica
- 자동 수평 확장
- Zero-downtime Deployment 요구
- 다수 운영자
- Compose 또는 단일 Host 운영의 측정된 병목

```text
trigger evidence: not_found
planning state: deferred
```

Control Plane, upgrade, CNI/DNS, Ingress, Storage Class/Persistent Volume,
backup, certificate, secret, observability와 Node lifecycle 운영이 필요하다.
Local K3s와 AWS EKS의 운영·Network·Storage 차이도 별도 검증 대상이다.

서비스 개수 증가만으로 Kubernetes Trigger가 충족되지 않는다. `deferred`는
영구 배제 또는 불필요 판정이 아니다.

#### VM Appliance

**Advantages**

- 전체 Environment Snapshot과 Host 수준 격리를 제공할 수 있다.
- 긴급 Bare-metal Host 복구 Image 후보가 될 수 있다.

**Disadvantages and risks**

- Application Artifact와 OS Artifact가 결합된다.
- Patch, Security Update와 큰 Image 배포 책임이 생긴다.
- AWS Runtime 이식성과 Service별 독립 Rollback이 약하다.
- Compose/OCI와 병행하면 Artifact가 중복된다.

```text
planning assessment: not_recommended
```

전체 Host Image는 Application Deployment보다 별도 Host Recovery Procedure
후보로 재검토할 수 있다.

### 8.3 Primary Deployment Planning Result

```text
Current planning leader: Docker Compose

Reason:
- single-host operation
- one-person operational capacity
- reproducible OCI artifact
- digest-based rollback candidate
- AWS DR image reuse
- Kubernetes triggers not verified

Decision state: open

Blocking verification:
- actual Mac mini runtime
- Docker Engine / Compose compatibility
- product container build
- health/readiness behavior
- stateful volume boundary
- host reboot and rollback test
```

이 결과는 Considered Option 평가이며 Decision이 아니다.

### 8.4 Image Architecture Problem

Mac mini Primary와 AWS DR Runtime이 동일 Source Revision과 동일 Release
Identity를 사용하면서 ARM64·AMD64 차이를 안전하게 처리할 Image Architecture는
무엇인가?

Mac mini M4는 Jira Baseline이며 실제 Runtime Hardware는 `runtime_unverified`다.

### 8.5 Image Architecture Matrix

| Criterion | ARM64-only | AMD64-only | Multi-platform OCI Image |
|---|---|---|---|
| Mac mini Compatibility | conditionally_viable | emulation 가능성 | strong candidate after verification |
| AWS Fargate Compatibility | verification_required | verification_required | verification_required |
| AWS EC2 Choice | ARM instance 중심 | broad x86 choice | broad ARM/x86 choice |
| Graviton 사용 가능성 | strong | not_applicable | strong |
| Emergency x86 Runtime | weak | strong | strong |
| Local Build Speed | strong if ARM verified | weak if emulated | medium |
| Emulation Requirement | low | high candidate | medium, build strategy 의존 |
| Native Dependency Risk | high until verified | medium until verified | high, 양쪽 검증 필요 |
| Build Complexity | low | low | high |
| CI Complexity | low | low | high |
| Test Matrix | one platform | one platform | ARM64 + AMD64 |
| Image Size | one platform | one platform | manifest 전체 저장량 증가 |
| Release Identity | platform-specific | platform-specific | one manifest reference candidate |
| Manifest List | not_applicable | not_applicable | strong |
| Per-platform Digest | strong | strong | required |
| Immutable Deployment | strong with digest | strong with digest | strong with manifest/platform digest |
| Rollback | acceptable if retained | acceptable if retained | acceptable if all digests retained |
| Security Scan | one platform | one platform | platform별 required |
| SBOM / Provenance | one platform | one platform | platform별 required |
| Current Evidence | unknown | unknown | unknown |

#### ARM64-only

Apple Silicon Primary 및 Graviton AWS Runtime과 일치하고 emulation을 줄일 수 있는
비용·성능 후보다. 반면 x86-only Native Dependency, 일부 Vendor Image·Agent와
Emergency AMD64 Runtime 선택을 제한할 수 있다.

```text
planning assessment: conditionally_viable
verification: verification_required
```

실제 Mac Architecture와 모든 Dependency 검증 전 Planning Leader가 아니다.

#### AMD64-only

AWS와 Vendor Image, x86 전용 Dependency 및 Emergency EC2 선택 폭이 넓을 수
있다. 반면 Apple Silicon에서 emulation, Local Build/Run 성능 저하와 Primary/DR
Architecture 불일치가 생길 수 있고 ARM64 비용·성능 선택을 잃는다.

```text
planning assessment: conditionally_viable
verification: verification_required
```

Mac Primary에 부적합할 가능성을 검증해야 하지만 최종 배제하지 않는다.

#### Multi-platform OCI Image

**Advantages**

- 하나의 Release Tag 또는 Manifest Reference로 ARM64/AMD64 variant를 연결한다.
- ARM64 Mac과 ARM64/AMD64 AWS 선택 및 Emergency Runtime 폭을 보존한다.
- 동일 Source Revision 기반 Release와 Platform별 Digest를 추적할 수 있다.
- Primary와 DR의 Artifact 모델을 통일할 수 있다.

**Disadvantages and risks**

- Build 시간과 Platform별 Test Matrix가 증가한다.
- Native Dependency Build가 Platform별로 실패할 수 있다.
- Manifest와 Child Digest를 함께 관리해야 한다.
- 같은 Tag여도 Platform Blob은 서로 다르다.
- Security Scan과 SBOM을 Platform별로 확인해야 한다.
- CI 장애 시 Emergency Build 절차가 필요하다.

```text
planning assessment: planning_leader
adoption state: open
```

**Verification required**

- Product Repository별 Dockerfile
- Base Image Multi-architecture 지원
- JNI / Native Library와 OS Package
- ARM64 Test와 AMD64 Test
- Manifest Inspection
- Per-platform Digest 기록
- Rollback Rehearsal
- Emergency Build Path

### 8.6 Release Identity Boundary

최종 채택 전 Candidate Requirement:

| Field | Candidate meaning |
|---|---|
| `source_revision` | Build 입력 Source Commit |
| `release_version` | 사람이 추적하는 Release Identity |
| `image_tag` | 가변 alias일 수 있는 Registry Reference |
| `manifest_digest` | Multi-platform manifest의 immutable identity |
| `platform` | `os/architecture` target |
| `platform_digest` | 실제 실행되는 Platform manifest/blob identity |
| `built_at` | Build 시각 |
| `build_evidence` | 재현 가능한 Build 기록 |
| `security_scan_state` | Platform별 scan 상태 |
| `promotion_state` | Candidate/approved promotion 상태 |
| `rollback_candidate` | 보존된 이전 승인 digest 여부 |

- Mutable Tag만으로 Production Release를 식별하지 않는다.
- Deployment Evidence는 Digest를 기록해야 한다.
- Manifest Digest와 Platform-specific Digest를 구분한다.
- Rollback 대상 Digest는 Registry Retention에서 보존돼야 한다.
- Same tag는 same binary를 의미하지 않는다.
- Image 존재는 Runtime 검증 완료를 의미하지 않는다.

실제 Tag Convention과 Registry Policy는 아직 `open`이다.

### 8.7 Registry Problem

Primary Host 전체를 잃어도 승인된 Application Image를 검증 가능한 Digest로
가져와 AWS DR Runtime을 복구할 수 있도록 Registry를 어떤 Failure Domain과
권한 경계에 배치할 것인가?

### 8.8 Registry Matrix

| Criterion | ECR | GHCR | Harbor | No Registry |
|---|---|---|---|---|
| Primary Host Failure Independence | strong | strong | independent host면 acceptable | weak, build env 의존 |
| AWS DR Integration | strong candidate | acceptable, external pull | acceptable, network 필요 | weak |
| AWS IAM Integration | strong | weak | weak | not_applicable |
| GitHub Integration | acceptable | strong | acceptable | build source만 의존 |
| Multi-platform Manifest | strong | strong | strong | weak |
| Digest Pull | strong | strong | strong | weak |
| Authentication | IAM/token | token | local project/account | ad-hoc |
| Read / Push Role Separation | strong | strong | acceptable | weak |
| Public / Private Pull | private strong, public 별도 | both | configurable | not_applicable |
| Retention | lifecycle rule | verification_required | self-managed | weak |
| Lifecycle Policy | strong | verification_required | self-managed | not_applicable |
| Replication | cross-region/account candidate | unknown | self-managed | not_applicable |
| Cross-region Availability | configurable | vendor failure domain | HA/replication required | weak |
| Availability Coupling | AWS Region/account | GitHub | own infrastructure | build environment |
| Backup Requirement | policy/replication decision | export/retention decision | high | artifact archive required |
| Upgrade Requirement | low, managed | low, managed | high | build toolchain 유지 |
| Security Patch Responsibility | managed service boundary | managed service boundary | operator | build environment owner |
| Operational Complexity | low | low | high | high during recovery |
| Vendor Lock-in | AWS | GitHub | self-hosted stack | build tooling |
| Cost Predictability | measurement_required | measurement_required | measurement_required | measurement_required |
| One-person Operation | strong candidate | strong candidate | weak | weak |
| Cost Cap Compatibility | measurement_required | measurement_required | measurement_required | measurement_required |
| Current Runtime Evidence | runtime_unverified | runtime_unverified | runtime_unverified | runtime_unverified |

Region, usage, retention과 replication이 확정되지 않았으므로 정확한 비용을
기록하지 않는다.

#### AWS ECR

**Advantages**

- ECS/Fargate와 IAM 기반 연결 후보이며 OCI multi-architecture manifest와 digest
  pull을 지원한다.
- Lifecycle Policy, Account/Region 권한 분리와 cross-region/cross-account
  replication 후보가 있다.
- AWS DR Runtime과 운영 경계를 통합할 수 있다.

**Disadvantages and risks**

- AWS Account/Region에 종속되고 DR Region 장애와 Registry Failure Domain이
  결합될 수 있다.
- Replication 비용·정책과 IAM/Network 접근 설정이 필요하다.
- Lifecycle 오설정으로 Rollback Image를 삭제할 수 있다.
- Primary Mac의 pull credential과 Vendor Lock-in을 관리해야 한다.

```text
planning assessment: planning_leader if AWS DR is selected
adoption state: open
```

Required evidence: AWS account access, `ap-northeast-2` service availability, IAM
ownership, cost estimate, retention policy, rollback digest retention과 cross-region
requirement.

#### GHCR

Source Repository/Package 연결, GitHub Actions build 후보, OCI multi-platform
artifact와 digest pull을 제공하고 AWS Region과 다른 Failure Domain을 제공할 수
있다. Public/Private distribution 선택도 가능하다.

PAT/GitHub Token, Package visibility와 Repository 권한, Organization/Personal
ownership을 구분해야 한다. AWS Runtime은 External Registry Network에 의존하고
GitHub 장애가 DR pull에 영향을 줄 수 있으며 AWS IAM과 직접 통합되지 않는다.

```text
planning assessment: planning_candidate
preferred when: registry independence from AWS is a stronger driver
```

ECR과 GHCR의 우열은 Driver 우선순위에 따라 달라진다.

#### Harbor

Self-hosted OCI Registry로 Repository/Project, digest와 image index를 직접 통제할
수 있다. 반면 설치, upgrade, backup, HA, TLS, storage, security patch와 Registry
자체 DR을 운영해야 한다. 별도 Host와 Database/Storage가 필요할 수 있어 1인
운영 부담이 높다.

```text
Hard Constraint:
Harbor를 Mac mini Primary와 동일 Failure Domain에 배치하지 않는다.

planning assessment: deferred

re-evaluation trigger:
- independent registry infrastructure required
- vendor-hosted registry prohibited
- operational capacity for HA and backup available
```

`deferred`는 Harbor의 영구 거부가 아니다.

#### No Registry

장애 시 Source에서 다시 Build하거나 Local tar를 수동 전달하면 승인 Digest와
Provenance가 약해진다. Build Environment 상실, Dependency Download 실패,
복구시간 증가, 동일 Binary 재현 실패와 Rollback Artifact 부족 위험이 있다.

```text
planning assessment: not_recommended
```

Local Export Artifact는 긴급 보조 경로가 될 수 있으나 Canonical Registry를
대체하지 않는다.

### 8.9 Registry Failure Domain Rule

```text
Primary Runtime Host failure
must not automatically remove
the only approved recovery image.
```

- Registry는 Mac mini Primary와 독립된 Failure Domain이어야 한다.
- Build/Push 권한과 Pull 권한을 분리한다.
- DR Runtime은 Read-only Pull 권한을 사용한다.
- Lifecycle Policy가 Rollback Digest를 실수로 삭제하지 않도록 보호한다.
- Registry Credential 상실에 대한 Break-glass 절차가 필요하다.
- Registry 장애 시 이전 승인 Image를 가져올 보조 전략이 필요하다.
- Image Retention/Backup은 Database Backup과 별도 Concern이다.

### 8.10 Candidate Relationship

```text
Docker Compose planning leader
→ OCI Image required

Multi-platform OCI Image planning leader
→ Registry must preserve manifest and platform digests

AWS ECR conditional planning leader
→ integration benefit if AWS DR is selected
```

- Compose 선택은 ECR 선택을 강제하지 않는다.
- Multi-platform 선택은 Fargate 선택을 강제하지 않는다.
- AWS DR 선택은 Registry를 반드시 AWS에 두도록 강제하지 않는다.

### 8.11 Slice 4 Official Capability Evidence

Accessed date: `2026-08-05`

| Source | Capability Evidence | Not Evidence Of |
|---|---|---|
| [AWS Fargate for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) | Server/Cluster 관리 없이 Container 실행, Task별 격리 경계, AWS가 platform version(kernel/runtime) patch, `awsvpc` networking, ALB `ip` target 연계 | Ranikun Labs 채택 또는 실제 Task 실행 |
| [ECS Task Definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) | Image, CPU/Memory, Environment, Secret, IAM Task Role, Container Health Check, Log Configuration 정의 | 현재 Task Definition 존재 |
| [ECS Service Definition Parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html) | `desiredCount`(0 설정 가능), `healthCheckGracePeriodSeconds`, Load Balancer Target Group 등록, Deployment Controller | 현재 Service 존재 또는 Cold Idle 운영 |
| [Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) | Listener, Target Group, Health Check, ACM 기반 TLS Termination, Security Group, L7 Routing | ALB 존재 또는 운영 |
| [ALB Target Group Health Checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) | HTTP(S) Path Probe, Healthy/Unhealthy Threshold, Interval, 전량 Unhealthy 시 fail-open | 현재 Target Health 검증 |
| [EC2 Automatic Instance Recovery](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html) | System Status Check 실패 시 다른 Host로 migrate, Instance ID/IP/EBS 유지, RAM 손실, Instance Status Check·App/OS-level 실패는 대상 아님, 단일 Instance는 resilient system 아님 | 현재 EC2 또는 복구 구성 |
| [EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) | Launch 시 Bootstrap 실행, 기본 1회 실행, 16KB 제한, opaque data, AWS API 사용 시 Instance Profile 필요 | 현재 Bootstrap 자동화 |
| [ECS Task IAM Role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) | Task Role(App의 AWS 접근)과 Execution Role(Image Pull)의 분리, Task별 Credential, `taskArn` 기반 Auditability | 현재 IAM Role 구성 |
| [Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) | Managed Control Plane, Shared Responsibility, Node/Add-on/Upgrade/Networking은 고객 책임, Cluster별 과금 | EKS 채택 필요 또는 존재 |
| [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | Origin이 Edge로 outbound-only 연결, inbound Port 미개방 | 현재 Tunnel 운영 |
| [Cloudflare Load Balancing](https://developers.cloudflare.com/load-balancing/) | Load Balancer/Pool/Origin/Monitor/Steering, Pool 간 Failover | 현재 Load Balancing 구성 |
| [Cloudflare Health Monitors](https://developers.cloudflare.com/load-balancing/monitors/) | HTTP/TCP/ICMP 등 Probe, Region별 복수 Data Center, majority-healthy 판정 | 현재 Health Monitor 구성 |
| [Cloudflare Pools](https://developers.cloudflare.com/load-balancing/pools/) | Endpoint 그룹, Monitor 연결, Healthy Endpoint만 반환 | 현재 Pool 구성 |
| [Terraform State](https://developer.hashicorp.com/terraform/language/state) | Resource-Object Binding, Remote Backend, State Locking, Secret 포함으로 secure storage 필요 | Terraform 적용 완료 |

Vendor 문서는 Capability, 지원 Configuration, 서비스 책임 경계, Health Check/Routing 기능과 IAM·Network 구성 가능성만 증명한다. Ranikun Labs 채택, 현재 AWS Resource·Cloudflare Load Balancing 존재, 비용 상한 충족, RTO/RPO 달성 또는 Failover 검증을 증명하지 않는다.

### 8.12 AWS DR Runtime Problem

Mac mini Primary 전체를 사용할 수 없을 때, 동일한 승인 Release Image를 사용해 Gateway와 Product Application을 AWS에서 4시간 RTO Target 내에 복구하면서, 평상시 고정비와 1인 운영 복잡도를 제한할 Runtime Boundary는 무엇인가?

```text
RTO 4h = target_not_verified
Application Runtime 선택 ≠ RTO 달성
PostgreSQL Backup/Restore 상세 = Slice 5
```

이번 Slice는 Application Runtime을 비교한다. Application Runtime 선택만으로 RTO 달성을 주장하지 않는다.

### 8.13 AWS DR Runtime Matrix

| Criterion | ECS Fargate + ALB | EC2 + Docker Compose | EKS | No Predefined Runtime |
|---|---|---|---|---|
| Cold Standby 적합성 | strong, `desiredCount 0` | acceptable, stopped instance | weak, Control Plane 상시 | weak, 즉석 구성 |
| 평상시 Fixed Cost | ALB 고정비 존재, Task 0 | EBS/상시 시 비용, stopped 시 절감 | Cluster 시간당 고정비 | 평상시 near-zero, incident 시 급증 |
| Incident-time Startup Time | Task Pull+Start (measurement_required) | Instance Boot+Bootstrap (measurement_required) | Cluster/Node 준비 (measurement_required) | unknown, 예측 불가 |
| Host OS 관리 | AWS 책임 | operator 책임 | Node는 operator 책임 | operator 책임 |
| Container Runtime 관리 | AWS 책임 | operator 책임 | operator 책임 | operator 책임 |
| Control Plane 관리 | AWS 책임 | not_applicable | 고객 부담(managed지만 운영 존재) | not_applicable |
| Patch 책임 | AWS(platform version) | operator | operator(Node)+AWS(Plane) | operator |
| Desired Count 0 / Idle | strong | stopped instance로 근사 | weak | not_applicable |
| Multi-platform OCI Image 지원 | verification_required | verification_required | verification_required | weak |
| ECR Integration | strong | acceptable | strong | weak |
| GHCR Integration | acceptable, external pull | acceptable | acceptable | acceptable |
| Digest 기반 배포 | strong | strong | strong | weak |
| IAM Role 분리 | strong, Task/Execution Role | acceptable, Instance Profile | strong, IRSA | weak |
| Secret Injection | acceptable, Secret/SSM 연계 | acceptable, host 절차 | strong | weak |
| Environment Injection | strong | strong | strong | weak |
| Health Check | strong, container+ALB | acceptable, compose+ALB/tunnel | strong | weak |
| Readiness 표현 | acceptable, grace period | acceptable | strong | weak |
| ALB Target Registration | strong, `ip` target | acceptable, instance/ip target | strong, controller | weak |
| TLS Termination | strong, ALB+ACM | ALB 또는 tunnel 의존 | strong | weak |
| Horizontal Replica | strong | weak, 단일 host | strong | weak |
| Emergency Scale-out | strong | weak | strong | weak |
| Stateful Volume 적합성 | weak, ephemeral (PostgreSQL 부적합) | acceptable, EBS | acceptable, PV | weak |
| PostgreSQL Runtime과 분리 | required, Task 외부 | required, 별도 판단(Slice 5) | required | unknown |
| Observability | acceptable, CloudWatch | operator 구성 | strong | weak |
| Log 수집 | strong, log driver | operator 구성 | strong | weak |
| Rollback | strong, digest/task revision | strong, digest | strong | weak |
| Terraform 재현성 | strong | acceptable | acceptable | weak |
| Incident Complexity | medium | medium-high | high | high |
| One-person Operation | strong candidate | conditionally_viable | weak | weak |
| RTO 4시간 가능성 | measurement_required | measurement_required | measurement_required | unknown |
| Cost Cap 적합성 | measurement_required | measurement_required | measurement_required | measurement_required |
| Current Runtime Evidence | runtime_unverified | runtime_unverified | runtime_unverified | runtime_unverified |
| Verification Requirement | verification_required | verification_required | verification_required | verification_required |
| Failure Domain | AWS Region/Account | AWS Region/AZ/Host | AWS Region/Account | build env/operator |

단순 점수가 아닌 후보별 설명은 8.14~8.17에서 상술한다.

### 8.14 ECS Fargate + ALB Analysis

**Planning Candidate 장점**

- EC2 Host OS를 직접 운영하지 않는 Container Runtime 후보다.
- Task Definition으로 Application Runtime(Image·CPU/Memory·Env·Secret·Health)을 정의할 수 있다.
- `desiredCount`로 Task 수를 제어하고 0에 가까운 Idle 상태를 만들 수 있다.
- ALB Target Group Health Check로 Readiness를 연계할 수 있다.
- IAM Task Role과 Execution Role을 분리할 수 있다.
- ECR과 IAM 기반으로 연계할 수 있다.
- Mac mini와 DR에서 동일 OCI Image를 재사용할 수 있다.
- 필요 시 Replica를 늘릴 수 있다.
- Terraform으로 재생성할 수 있고 Incident 시 Host Provisioning 단계를 줄일 수 있다.

**한계와 위험**

- ECS Service, Task Definition, IAM, VPC, Security Group, ALB를 운영해야 한다.
- Fargate Runtime과 Local Compose 사이에 Configuration Drift가 생길 수 있다.
- Task Startup과 Image Pull 시간, ALB Target Health 대기 시간이 있다.
- NAT Gateway 또는 Network 경로 비용이 생길 수 있다.
- ECR/GHCR 접근 경계를 관리해야 한다.
- Stateful PostgreSQL을 Fargate Task 내부에 두지 않아야 하며 Ephemeral Filesystem에 의존하지 않아야 한다.
- Secret Store와 Configuration Source가 별도로 필요하다.
- 같은 Region의 ALB/ECS/ECR는 Region 장애 시 동시 영향 가능성이 있다.
- Task를 0에 가깝게 유지해도 ALB 등 고정비가 남을 수 있다.
- 비용 상한은 측정이 필요하고, Fargate가 RTO 4시간을 자동 보장하지 않는다.

```text
planning assessment: planning_leader
condition: AWS Application DR Runtime을 관리형 Container 방식으로 운영할 경우
adoption state: open
```

**Verification required**

AWS Account/IAM · `ap-northeast-2` 가용성 · ARM64/AMD64 Task Runtime · Image Pull · Task Startup · ALB Target Healthy 시간 · `desiredCount` 0→1(또는 equivalent) 복구 · Secret Injection · Network Egress · Cost Estimate · Terraform Recreation · Read-only Boot · Write Enable Gate · Full DR Drill.

ECS Fargate를 최종 채택하지 않는다.

### 8.15 EC2 + Docker Compose Analysis

**장점**

- Primary Compose 운영 모델과 유사성이 높은 후보다.
- 동일 Compose File 또는 Override를 재사용할 수 있다.
- Host 수준 Debugging이 용이하고 Emergency SSH/Console 접근이 가능하다.
- Application과 Supporting Process를 단일 Instance에서 기동할 수 있다.
- Fargate 제약이 있는 Native Dependency에 대응할 수 있다.
- 단일 EC2를 중지 상태로 두거나 Incident 때 생성하는 후보다.
- ALB 또는 직접 Tunnel Target이 될 수 있다.

**한계와 위험**

- OS Patch와 Hardening, Docker Engine·Compose 설치와 Version 관리 책임이 있다.
- Instance Bootstrap 시간과 User Data 실패 가능성, AMI Drift가 있다.
- Host Failure와 Application Failure가 결합되고 단일 EC2 자체 HA가 없다.
- SSH/Key/Break-glass, EBS Volume/Backup, Host Monitoring을 관리해야 한다.
- Incident 때 사람이 더 많은 절차를 수행하고 Cold Provisioning이 RTO를 초과할 수 있다.
- Configuration Drift와 Manual Recovery 의존이 증가한다.
- EC2 위 PostgreSQL 배치 여부는 Slice 5에서 별도 판단한다.
- EC2 Automatic Instance Recovery는 System Status Check 실패만 대상이며 App/OS-level 실패나 Host 상실 전체를 대체하지 않는다.

```text
planning assessment: conditionally_viable
adoption state: open
```

**Preferred when**: Compose 동등성이 최우선 · Fargate 호환성 미검증 · 낮은 빈도의 Cold DR · 운영자가 EC2 Bootstrap을 감당 가능.

ECS Fargate보다 무조건 열등하다고 판단하지 않는다.

### 8.16 EKS Analysis

ADR-0015 Trigger를 유지한다.

```text
trigger evidence: not_found
planning state: deferred
```

EKS는 Control Plane, Node 또는 Fargate Profile, CNI, Ingress/ALB Controller, IRSA, Cluster Upgrade, Kubernetes Version, Helm, Persistent Volume, Backup, Observability, Certificate, Secret, Node Lifecycle 운영 부담이 있고, Local Compose와 EKS Manifest의 Drift와 1인 운영 부담이 크다.

**재평가 Trigger**: 복수 물리 Node · 지속적 Multi-replica · 자동 Scale-out · Zero-downtime Deployment · 여러 서비스의 독립 Scheduling · 다수 운영자 · Compose/ECS의 측정된 한계 · EKS 운영비와 복잡도를 정당화하는 요구.

```text
서비스 수 증가만으로 EKS Trigger는 충족되지 않는다.
```

EKS를 영구 거부하지 않는다.

### 8.17 No Predefined Runtime Analysis

Incident 발생 후 Console에서 Resource를 수동 구성하고, Image를 다시 Build하거나 Runtime을 즉석 결정하며, IaC 없이 수동으로 VPC/Instance/Load Balancer를 생성하고, 문서 또는 개인 기억에 의존하는 방식이다.

**위험**: RTO 예측 불가 · IAM/Network 오설정 · 승인 Artifact와 Digest 불일치 · Human Error · Repeatability 부족 · Drill 불가 · Restore와 Traffic 절차 결합 · Operator 부재 시 복구 곤란 · Evidence 부족.

```text
planning assessment: not_recommended
```

단, Break-glass Manual Procedure는 Canonical Runtime 정의의 보조 수단으로 별도로 존재할 수 있다.

### 8.18 AWS Runtime Planning Result

```text
Current planning leader: ECS Fargate + Application Load Balancer
Conditional alternative: EC2 + Docker Compose
Deferred: EKS
Not recommended as canonical path: No Predefined AWS Runtime
Decision state: open
```

**Blocking verification**: Actual Application Image Compatibility · AWS Account/IAM · Region · VPC/Security Group · Image Pull · Task/Instance Startup · ALB Health · Secret/Configuration · Read-only Startup · Cost Estimate · Full DR Drill.

Planning Leader는 Accepted Decision이 아니다.

### 8.19 Traffic Failover Problem

Mac mini Primary 장애가 감지됐을 때, 오탐으로 AWS DR를 활성 Writer로 만들거나 Primary와 DR가 동시에 Write하는 Split-brain을 만들지 않으면서, 언제 누가 어떤 Evidence를 확인하고 사용자 Traffic을 전환할 것인가?

### 8.20 Traffic State Vocabulary

실제 Runtime State Machine을 구현·채택하지 않는다. 아래는 Failover Procedure 논의를 위한 Architecture State Vocabulary다.

| State | Entry Condition | 금지 행위 |
|---|---|---|
| PRIMARY_HEALTHY | Liveness·Readiness·Write Readiness 정상 | 불필요한 Failover |
| PRIMARY_SUSPECTED | Health Signal 이상 감지, 미확정 | 이 신호만으로 Write 전환 |
| PRIMARY_UNAVAILABLE | Primary 서비스 불가 확인 | Fencing 없이 DR Write |
| DR_PREPARING | Incident 선언 후 DR 준비 시작 | Traffic 전환 |
| DR_RESTORING | PostgreSQL Restore/Promotion 진행 | Write Enable |
| DR_READ_ONLY | DR Runtime이 Read-only로 기동 | Business Write |
| DR_VALIDATING | Consistency/Business Read Check 진행 | Traffic Failover 승인 |
| DR_WRITE_APPROVED | Fencing+Restore+Consistency 후 Write 승인 | Fencing 미확인 상태 승격 |
| TRAFFIC_FAILOVER_APPROVED | Traffic 전환 승인 완료 | Rollback Target 없이 전환 |
| DR_ACTIVE | DR가 활성 Writer | Primary 동시 Write 허용 |
| FAILBACK_PREPARING | Primary 복구 후 Failback 준비 | 자동 Failback |
| PRIMARY_RESTORING | Primary Re-seed/동기화 진행 | Primary Write |
| PRIMARY_READ_ONLY | Primary가 Read-only로 기동 | Primary Business Write |
| PRIMARY_VALIDATING | Primary Consistency Validation | Traffic Failback 승인 |
| FAILBACK_APPROVED | Failback 승인 완료 | DR 즉시 종료 |
| PRIMARY_ACTIVE | Primary가 다시 활성 Writer | DR 동시 Write |
| INCIDENT_CLOSED | Incident 종료, Evidence 보존 | Evidence 미기록 종료 |

### 8.21 Health Detection Analysis

Health Detection Source 후보: Cloudflare Health Monitor · Cloudflare Tunnel 상태 · Application External Health Endpoint · Gateway Health Endpoint · Operator Observation · Infrastructure Monitoring · Database Availability Signal.

```text
Liveness PASS ≠ Readiness PASS ≠ Write Readiness PASS
```

- **Liveness**: Process 또는 Endpoint가 응답하는가?
- **Readiness**: 사용자 요청을 안전하게 처리할 준비가 됐는가?
- **Write Readiness**: Business Write를 안전하게 허용할 수 있는가?

Cloudflare Health Check 성공만으로 Write Enable을 승인하지 않는다.

### 8.22 Failure Classification Matrix

| Failure Type | Primary Failure | DR 필요 | App Restart로 해결 | Traffic Failover | DB Restore | Human Approval |
|---|---|---|---|---|---|---|
| Application Process Failure | 부분 | 아니오 | 가능 | 아니오 | 아니오 | 낮음 |
| Gateway Failure | 부분 | 조건부 | 가능 | 조건부 | 아니오 | 조건부 |
| Docker/Host Runtime Failure | 예 | 조건부 | 가능성 있음 | 조건부 | 아니오 | 예 |
| Mac mini Host Failure | 예 | 예 | 불가 | 예 | 가능성 있음 | 예 |
| Home/Office Network Failure | 예(접근) | 조건부 | 불가 | 조건부 | 아니오 | 예 |
| Power Failure | 예 | 예 | 불가 | 예 | 가능성 있음 | 예 |
| Cloudflare Tunnel Failure | 아니오(접근 계층) | 아니오 | 조건부 | 아니오 | 아니오 | 조건부 |
| PostgreSQL Failure | 예(데이터) | 조건부 | 불가 | 조건부 | 예 | 예 |
| Redis Failure | 부분 | 아니오 | 가능(ephemeral) | 아니오 | 아니오 | 낮음 |
| Registry Failure | 아니오 | 아니오(복구 Image 영향) | 아니오 | 아니오 | 아니오 | 조건부 |
| AWS Region/Service Failure | 아니오 | DR 자체 영향 | 아니오 | 조건부 | 조건부 | 예 |
| Operator Unavailable | 상황별 | 상황별 | 불가(승인 부재) | 지연 | 지연 | 차단 |
| False Positive Health Failure | 아니오 | 아니오 | not_applicable | 금지 | 금지 | 예(억제) |

`Tunnel Down ≠ Database Write 불가능`. 접근 계층 장애와 데이터 계층 장애를 구분한다.

### 8.23 Traffic Failover Matrix

| Criterion | Fully Automatic | Detection + Human Approval | Fully Manual | DNS-only Manual |
|---|---|---|---|---|
| Detection Speed | strong | acceptable(자동 감지) | weak | weak |
| False Positive Risk | high | low(사람 확인) | low | medium |
| Split-brain Risk | high | low | medium | high |
| Dual Writer Risk | high | low | medium | high |
| Operator Burden | low | medium | high | medium |
| 1인 운영 적합성 | weak(오설정 탐지難) | strong | conditionally_viable | weak |
| RTO Predictability | strong if 정상 | medium(operator 의존) | weak | weak |
| Write Safety | weak | strong | medium | weak |
| Data Restore Coordination | weak | strong | medium | weak |
| Read-only Boot 지원 | weak | strong | medium | weak |
| Evidence Requirement | low | high | medium | low |
| Auditability | weak | strong | medium | weak |
| Rollback | weak | acceptable | medium | weak, cache 혼재 |
| Failback Safety | weak(자동 Failback 위험) | strong(수동 승인) | medium | weak |
| Cloudflare Integration | LB 자동 failover | Monitor+수동 전환 | 수동 | DNS record 변경 |
| Implementation Complexity | high | medium | low | low |
| Cost | LB/health 비용 | LB/health 비용 | low | low |
| Current Evidence | runtime_unverified | runtime_unverified | runtime_unverified | runtime_unverified |
| Verification Requirement | verification_required | verification_required | verification_required | verification_required |

#### 8.23.1 Fully Automatic Failover

**장점**: 빠른 Traffic 전환 가능성 · Operator 부재 시 자동 대응.

**위험**: Health Check 오탐 · Primary가 실제 Write 가능 상태로 복귀 · DB 미Restore 상태에서 Traffic 유입 · Dual Writer · Split-brain · Cloudflare Routing과 Database Promotion의 비동기 · 자동 Failback 위험 · 1인 운영에서 자동화 오설정 탐지 곤란.

```text
planning assessment: not_recommended for initial release
```

**re-evaluation trigger**: Fencing 자동화 · Database Promotion 자동화 · Write Lease · 충분한 Drill · False Positive 통계 · Runbook 자동 검증 · Independent Review. 영구 거부하지 않는다.

#### 8.23.2 Health Detection + Human Approval

**장점**: Detection은 자동화, Write Enable과 Traffic Switch는 사람 승인 · Restore·Consistency Evidence 확인 · 오탐 대응 · Split-brain 방지 · 1인 운영에서 자동화 범위 제한 · Incident Audit 가능.

**위험**: Operator 부재 시 RTO 초과 · 승인 절차 불명확 시 지연 · 승인자 오판 · Fencing/Restore Evidence를 수동 수집할 수 있음 · 야간·부재 시간 대응 한계.

```text
planning assessment: planning_leader
adoption state: open
approval owner: 박성환
operator response target: 가능한 경우 인지 후 1시간 이내 착수
24/7 SLA: none
```

#### 8.23.3 Fully Manual Detection and Failover

**장점**: 자동 오탐 없음 · 단순한 초기 구현.

**위험**: 장애 인지 지연 · Operator 부재 · RTO 예측 곤란 · 수동 판단 누락 · Health Evidence 부족 · 반복 Drill 곤란 · 절차 편차.

```text
planning assessment: conditionally_viable as temporary fallback
```

Canonical Planning Leader로 지정하지 않는다.

#### 8.23.4 DNS-only Manual Switch

DNS Record 변경 · TTL과 Resolver Cache 영향 · Application/Database 준비와 무관하게 Traffic만 변경할 위험 · Failback 시 Cache 혼재 · Read-only/Write 승인 상태 표현 부족.

```text
planning assessment: not_recommended as sole failover mechanism
```

Cloudflare Load Balancing 또는 Tunnel Steering 대안과 비교하되 실제 Cloudflare 구성을 주장하지 않는다.

### 8.24 Traffic Planning Result

```text
Current planning leader: Health Detection + Human-approved Failover
Not recommended initially: Fully Automatic Failover
Temporary fallback: Fully Manual Detection and Failover
Not recommended as sole mechanism: DNS-only Manual Switch
Decision state: open
```

### 8.25 Fencing Invariant

```text
DR Write Enable must not occur until the Primary writer has been fenced
or its inability to write has been independently established.
```

한국어 의미: **Primary Writer가 Fence되었거나 Write 불가능이 독립적으로 확인되기 전에는 DR Write를 활성화하지 않는다.**

Fencing 후보: Primary Host Power-off 확인 · Primary Network Isolation · Database Write Credential Revocation · Tunnel Disable · Application Stop · Storage Lock 또는 Write Lease · Operator Physical Confirmation · Independent Monitoring Confirmation.

```text
Traffic Switch ≠ Fencing
Health Check Failure ≠ Fencing
Tunnel Down ≠ Database Write 불가능
```

현재 Fencing 방식은 `open`이다.

### 8.26 Write Enable Gate

DR Write 허용을 위한 최소 Gate 후보(순서):

1. Incident 선언
2. Primary 상태 Evidence 수집
3. Primary Fencing 또는 Independent Write-impossibility 확인
4. AWS DR Runtime 준비
5. PostgreSQL Restore 또는 Promotion 완료
6. Migration Compatibility 확인
7. Application Read-only Boot
8. Database Connectivity 확인
9. Consistency Check
10. Critical Business Read Check
11. Secret/Configuration 확인
12. Operator 승인
13. Write Enable
14. Controlled Write Probe
15. Traffic Failover 승인

```text
Runtime Healthy ≠ Write Enabled
Database Connected ≠ Data Consistent
Read-only Boot PASS ≠ Traffic Failover Approved
```

### 8.27 Traffic Failover Gate

Traffic 전환 전 최소 Evidence 후보: DR Runtime Healthy · ALB 또는 Target Health 정상 · Application Readiness 정상 · Database Restore 완료 · Read-only Business Check · Fencing Evidence · Write Enable 승인 · Controlled Write Probe · Audit Record · Rollback Target 준비 · Operator 승인.

Cloudflare Health Monitor만으로 Failover하지 않는다.

### 8.28 Read-only First Invariant

```text
복구된 DR Runtime은 가능한 경우 처음에는 Read-only 상태로 기동한다.
```

Read-only 단계 목적: Database Restore 검증 · Application Schema 검증 · Secret/Configuration 검증 · Business Read Check · Migration Compatibility 검증 · Write 전 Evidence 확보.

Read-only 구현 방식은 아직 `open`이다. 후보: Application-level Feature Flag · Database Read-only Credential · Gateway Write Method Block · Maintenance Mode · Combination. 이번 Slice에서 하나를 채택하지 않는다.

### 8.29 Failback Invariant

```text
Automatic failback is prohibited for the initial architecture candidate.
```

한국어 의미: **초기 Architecture 후보에서 자동 Failback을 금지한다.**

Failback 최소 후보 순서:

1. 기존 Primary 복구
2. Primary Runtime과 Image Digest 확인
3. Database Re-seed 또는 동기화
4. Primary Read-only Boot
5. Consistency Validation
6. AWS DR Write Freeze
7. Primary Write 승인
8. Controlled Write Probe
9. Traffic Failback 승인
10. AWS DR Read-only 전환
11. AWS DR 종료 또는 Cold 상태
12. Incident 종료

이 순서는 Planning Candidate이며 실행 Runbook이 아니다.

### 8.30 Split-brain Prevention

- 동시에 두 Writer를 허용하지 않는다.
- Traffic Routing은 Writer Authority를 결정하지 않는다.
- Database Write Credential은 Writer Authority와 연계돼야 한다.
- Failover 승인 전 Primary 재접속 가능성을 확인한다.
- Failback 중 AWS DR를 바로 종료하지 않는다.
- Write Authority 변경은 Audit Evidence를 요구한다.
- Automatic Failback을 금지한다.
- Unknown 상태에서는 Write보다 Manual Review를 우선한다.

### 8.31 Cloudflare Responsibility Boundary

Cloudflare의 Candidate 역할: External Health Observation · Traffic Steering · Pool/Origin 선택 · Tunnel Endpoint 접근 · Failover Target 전환.

Cloudflare가 소유하지 않는 책임: PostgreSQL Restore · Data Consistency · Write Authority · Primary Fencing · Secret Rotation · Application Migration Compatibility · Incident Approval.

```text
Cloudflare Traffic Failover ≠ Disaster Recovery Completion
Cloudflare Health Check ≠ Business Write Safety
```

### 8.32 AWS / Cloudflare Failure Domain

분리 대상 Failure Domain: Mac mini Host · Local Power · Local Network · Cloudflare · AWS Account · AWS Region · VPC · ALB · ECS/Fargate · EC2 · ECR · S3/Backup Storage · IAM · DNS · Operator.

결합 위험 분석:

- ECS + ALB + ECR가 같은 Region에 있으면 Region 장애에 동시 결합될 수 있다.
- AWS DR와 ECR를 분리하려면 GHCR를 선택할 수 있다(§8.8 Registry 대안과 연결).
- Cloudflare 장애 시 Primary와 DR 모두 접근 불가할 수 있다.
- Operator 단일 인물 의존이 별도 Failure Domain이다.

최종 Multi-region 설계를 채택하지 않는다. Cross-region DR는 `deferred`를 유지한다.

### 8.33 Observability Candidate Requirements

Signal 후보: Primary External Health · Tunnel Health · Gateway Liveness · Gateway Readiness · Application Readiness · PostgreSQL Availability · Backup Freshness · WAL Archive Freshness · Registry Pull Test · AWS Task/Instance State · ALB Target Health · DR Read-only State · Current Write Authority · Last Failover Drill · Last Restore Drill · Operator Acknowledgement.

실제 Monitoring Tool을 채택하지 않는다.

### 8.34 Audit Evidence Candidate

Failover/Failback 과정에서 남길 Evidence 후보: Incident ID · Detection Time · Operator Acknowledgement Time · Primary State · Fencing Evidence · Backup/Restore Reference · Restored Point-in-time · Image Manifest Digest · Platform Digest · Configuration Version · Secret Version Reference · Read-only Check Result · Consistency Check Result · Write Approval · Traffic Approval · Failover Time · Failback Time · Drill/Incident 구분 · Owner.

실제 Secret, Credential, Host, IP, Bucket 이름을 ADR에 기록하지 않는다.

### 8.35 RTO Stage Analysis

RTO 4시간 Target을 다음 단계로 분해한다. 각 시간은 현재 `unknown` 또는 `measurement_required`다.

| Stage | Current State |
|---|---|
| Detection | measurement_required |
| Operator Acknowledgement | measurement_required |
| Incident Classification | measurement_required |
| AWS Runtime Provision | measurement_required |
| Image Pull | measurement_required |
| Database Restore | measurement_required(Slice 5) |
| Application Read-only Boot | measurement_required |
| Validation | measurement_required |
| Write Approval | measurement_required |
| Traffic Switch | measurement_required |

```text
RTO Target ≠ Sum of verified stage durations
```

정확한 시간을 발명하지 않는다. Full DR Drill 전 RTO는 `target_not_verified`다.

### 8.36 Cost Boundary

비용 Concern 후보: ALB 고정비 · Fargate Task 실행비 · EC2 Instance/EBS · NAT Gateway · Data Transfer · ECR/GHCR Storage · Cloudflare Load Balancing · Logging · Monitoring · Backup Storage · Terraform State Backend.

```text
status: measurement_required
```

사용자 승인 Guardrail(§4.6과 일치): 월 고정비 목표 50,000원 이하 · Hard Cap 100,000원. Burst Incident/Drill 비용은 고정비와 분리해 기록한다. 정확한 Vendor 가격은 기록하지 않는다.

---

## 9. Decision

**No architecture option is accepted in Slice 4.**

현재 Decision은 `open`이다. Slice 3의 Primary Deployment, Image Architecture,
Registry 평가는 그대로 Planning 상태로 보존되며 Slice 4에서 Accepted로 승격되지
않는다. Slice 4는 AWS DR Runtime과 승인 기반 Traffic Failover 대안의 현재 평가만
추가한다.

```text
Preserved Slice 3 planning leaders (still open, not accepted):
- Primary Deployment: Docker Compose
- Image Architecture: Multi-platform OCI Image
- Registry: AWS ECR if AWS DR is selected
  Conditional alternative: GHCR when Registry failure-domain independence from AWS is prioritized
  Deferred: K3s / Kubernetes, Harbor

Slice 4 planning leaders (open, not accepted):
- AWS Application DR Runtime: ECS Fargate + Application Load Balancer
- Traffic Failover: Health Detection + Human-approved Failover

Conditional alternative:
- EC2 + Docker Compose

Deferred:
- EKS
- Fully Automatic Failover
- Cross-region DR

Initial candidate prohibition:
- Automatic Failback

AWS DR Runtime Decision: open
Traffic Failover Decision: open
```

이 문구는 Considered Option 평가이며 Accepted Decision이 아니다. 다음 표현을
사용하지 않는다: "We will use ECS Fargate", "ECR을 채택한다", "Cloudflare Load
Balancing을 사용한다", "자동 전환을 구성한다", "ALB가 운영 중이다", "DR 환경이
준비됐다", "RTO 4시간을 달성했다", "Failover가 검증됐다".

These planning evaluations require later RPL-42 decision approval.

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

No decision has been accepted in this section. 아래는 Slice 4 Planning Leader가
현재 Driver에서 앞선 이유이며 채택 근거가 아니다.

- **관리형 Container가 1인 운영 Driver에 부합한다.** ECS Fargate는 Host OS와
  Container Runtime Patch를 AWS 책임으로 두어 Incident 시 Host Provisioning 단계를
  줄일 수 있다. 이는 Slice 3의 Docker Compose Planning Leader와 동일 OCI Image를
  재사용한다는 전제와 모순되지 않는다.
- **Cold Standby와 비용 Driver를 함께 만족할 후보다.** `desiredCount 0`으로 Task를
  Idle에 둘 수 있으나 ALB 등 고정비가 남을 수 있어 비용은 `measurement_required`다.
- **EC2 + Compose는 Compose 동등성이 최우선이거나 Fargate 호환성이 미검증일 때
  우월할 수 있어** conditionally_viable로 보존한다.
- **오탐과 Split-brain 위험이 자동 전환의 속도 이점을 상회한다.** 그래서 Traffic은
  Detection은 자동화하되 Write Enable과 Traffic Switch는 사람 승인을 요구하는
  방식이 현재 앞선다.
- **RTO 4시간은 단계별 측정 전까지 Runtime 선택으로 보장되지 않는다.** Runtime
  후보 선택은 RTO 달성 주장과 분리된다.

이 Rationale은 후속 RPL-42 Slice의 검증과 독립 Review 전까지 Decision이 아니다.

---

## 11. Consequences

No decision has been accepted in this section. 아래는 Planning Leader가 채택될
경우의 예상 결과 후보이며 현재 발생한 사실이 아니다.

### 채택 시 긍정 후보

- Primary와 DR가 동일 OCI Image와 Digest를 재사용할 수 있다.
- Incident 절차가 Fencing → Restore → Read-only → Consistency → Write Enable →
  Traffic 순서로 구조화되어 Split-brain 위험이 감소한다.
- Human Approval Gate로 오탐 기반 자동 전환을 방지한다.
- Terraform 재현으로 Cold Standby Provisioning을 반복 가능하게 만들 수 있다.

### 채택 시 부담 후보

- ECS/ALB/IAM/VPC/Security Group과 Cloudflare, Secret Store 운영 표면이 늘어난다.
- Fargate와 Local Compose 사이 Configuration Drift 관리가 필요하다.
- ALB 등 고정비와 Incident/Drill Burst 비용이 발생할 수 있다.
- Operator 부재 시 Human Approval 의존이 RTO를 초과시킬 수 있다.

### 하지 않는 것

- 이 Slice는 ADR-0013 Data Ownership과 ADR-0015 Deferred Trigger를 바꾸지 않는다.
- AWS에 여러 Service를 배치해도 Logical Service Boundary를 통합하지 않는다.
- Runtime, Infrastructure, Cloudflare 구성, RTO/RPO 달성을 주장하지 않는다.

---

## 12. Human Authority Impact

No decision has been accepted in this section. 아래 Human Authority Matrix는
Failover/Failback Action의 승인 경계를 논의하기 위한 Architecture Candidate이며
실행 권한 위임이나 Runtime Approval이 아니다.

| Action | Automated Signal | Human Decision Required | Evidence | Owner |
|---|---|---|---|---|
| Incident Declare | Health/Monitor 이상 | 예 | Detection Log, Operator Ack | 박성환 |
| Primary Unavailable 판정 | Health/Tunnel/DB Signal | 예 | 복수 Signal 상관, Operator 확인 | 박성환 |
| Primary Fencing 승인 | 없음(수동) | 예 | Power-off/Isolation/Credential Revocation 증거 | 박성환 |
| DR Runtime Start | 조건부 Trigger 가능 | 예(초기) | Runtime State, Image Digest | 박성환 |
| Database Restore 시작 | 없음 | 예 | Backup/WAL Reference (Slice 5) | 박성환 |
| Read-only Boot 승인 | Runtime Health | 예 | Read-only State, Schema Check | 박성환 |
| Write Enable 승인 | 없음 | 예 | Fencing+Restore+Consistency Evidence | 박성환 |
| Traffic Failover 승인 | Target/Readiness Health | 예 | Failover Gate Evidence, Rollback Target | 박성환 |
| Failback 시작 | Primary 복구 Signal | 예 | Primary Runtime/Digest 확인 | 박성환 |
| Primary Write Enable | 없음 | 예 | Primary Consistency, DR Write Freeze | 박성환 |
| Traffic Failback 승인 | Primary Readiness | 예 | Failback Gate Evidence | 박성환 |
| Incident Close | 없음 | 예 | Audit Evidence 보존 | 박성환 |

현재 Approval Owner는 박성환이며 24/7 SLA가 아니다. Future delegated operator와
automated system은 Owner 후보로만 기록하고 이번 Slice에서 위임하지 않는다.

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

Container Image와 Registry는 Local Runtime과 별도 Failure Domain을 갖는 복구
Artifact Concern이다. Image Retention은 PostgreSQL Backup 보존을 대체하지 않고,
Database Backup도 Application Image를 대체하지 않는다.

### Slice 4 DR Runtime Data Boundary

- AWS DR Application Runtime 후보(ECS Fargate/EC2)는 Stateful PostgreSQL을 자신의
  Ephemeral Filesystem 또는 Task 내부에 두지 않는다. Business Data SSOT의 물리
  복구는 Slice 5에서 별도 판단한다.
- AWS에 Application Runtime을 배치하더라도 각 Product/Service의 Data Ownership과
  Migration Owner는 통합되지 않는다(§4.4, ADR-0013 유지).
- 같은 ALB, VPC 또는 Account를 공유해도 Service Ownership 통합을 뜻하지 않는다.
- Write Authority는 Traffic Routing이 아니라 Database Write Credential과 연계되어야
  하며, 어느 시점에도 단일 Writer만 허용한다(§8.30).
- AWS DR Runtime, ECR, ALB가 같은 Region에 있으면 Region 장애에 결합될 수 있어
  Registry Failure Domain 분리(§8.8, §8.32)와 함께 검토한다.

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

No decision has been accepted in this section. 아래는 Slice 4 Architecture 후보를
승인하기 전 필요한 검증 후보이며 각 상태는 `not_run` 또는 `verification_required`다.

### Runtime

- Fargate Task Start · EC2 Bootstrap · Image Pull by Digest · ARM64/AMD64
  Compatibility · ALB Target Healthy · Read-only Boot · Secret Injection · Config
  Injection · Rollback.

### Failover

- Health False Positive · Primary Host Loss · Local Network Loss · Tunnel Loss ·
  Primary Fencing · DR Read-only · Write Approval · Traffic Switch · Traffic
  Rollback.

### Failback

- Primary Restore · Database Re-seed · Primary Read-only · DR Write Freeze · Write
  Authority Transfer · Traffic Failback.

### Negative Tests

- Fencing Evidence 없음 · Restore 미완료 · Consistency Check 실패 · Secret 불일치 ·
  Image Digest 불일치 · Operator Approval 없음 · Cloudflare Health만 정상 · Primary
  재등장 · Operator 부재. 각 경우 Write가 거부되고 Manual Review로 진행되어야 한다.

```text
각 검증 상태: not_run / verification_required
```

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

최종 절차가 아닌 Candidate Architecture Requirement다.

### Migration Candidate Requirements

- 현재 Native Process 존재 여부 조사
- Product별 Container Build
- ARM64 / AMD64 Test
- Registry Push
- Digest Promotion
- Compose Candidate Deployment
- Health / Readiness 확인
- Host Reboot Test

### Rollback Candidate Requirements

- 이전 Manifest Digest 보존
- 이전 Platform Digest 보존
- Config / Secret Version 호환
- Database Migration Compatibility
- Compose 또는 후속 Runtime에서 이전 Digest 재기동
- Rollback 후 Health와 Business Check

```text
Application rollback
≠ Database rollback
```

Database Migration Rollback은 별도 구현 Decision이 필요할 수 있다.

### Slice 4 Failover / Failback Candidate Order

- Failover 방향은 Write Enable Gate(§8.26)와 Traffic Failover Gate(§8.27)를 따른다.
- Failback 방향은 Failback Invariant(§8.29)의 후보 순서를 따르며 Automatic Failback을
  금지한다.
- Traffic Rollback을 위해 이전 활성 경로(Primary 또는 DR)를 Rollback Target으로
  준비한다.
- Failback 중 AWS DR를 즉시 종료하지 않고 Read-only로 전환한 뒤 Cold 상태로 되돌린다.

```text
Traffic switch ≠ Write authority transfer
Automatic failback = prohibited (initial candidate)
```

- Product Repository별 Dockerfile 존재 여부와 대상 revision을 조사해야 한다.
- ARM64/AMD64 Native Dependency와 platform별 test 결과를 조사해야 한다.
- 실제 PostgreSQL Version, Size와 WAL 생성률을 측정해야 한다.
- 실제 데이터 크기로 Restore Drill을 수행해야 한다.
- Cloudflare Tunnel과 Load Balancing 구성 Evidence를 확인해야 한다.
- AWS Account, Region과 IAM Boundary를 확인해야 한다.
- ECR/GHCR 비교 전 Authentication Owner를 확인해야 한다.
- Terraform State의 저장, 암호화, 접근과 복구 Boundary를 확인해야 한다.
- Secret Inventory와 Primary Host 상실 시 Revocation 절차가 필요하다.
- Compose 후보의 Health와 Readiness 의미를 Product별로 검증해야 한다.
- Registry의 Build/Push와 Read-only Pull Identity Owner를 분리해야 한다.
- Manifest Digest와 Platform Digest를 Deployment Evidence에 함께 기록할 수 있는지
  검증해야 한다.
- Lifecycle/Retention 정책이 최소 Rollback Image를 보존하는지 검증해야 한다.
- Local Export Artifact는 Registry 장애 보조 경로로만 검토해야 한다.
- AWS DR Runtime 후보의 ARM64/AMD64 Task/Instance 호환성과 Image Pull·Startup
  시간을 측정해야 한다.
- `desiredCount 0` 또는 stopped instance 등 Cold Idle 상태의 고정비를 산정해야 한다.
- ALB를 상시 유지할지 Incident 때 생성할지, NAT Gateway 없이 필요한 접근을 구성할
  수 있는지 검증해야 한다.
- Fencing Mechanism과 Read-only 구현 방식을 후보 중에서 검증·선택해야 한다.
- Write Authority를 기술적으로 표현하는 방법(Write Credential/Lease 등)을 검증해야
  한다.
- Human Approval을 수행할 Interface와 Audit Evidence 저장 위치·Owner를 정해야 한다.
- Cloudflare Tunnel/Load Balancing의 실제 운영 여부와 Health Endpoint의
  Liveness/Readiness/Write Readiness 분리를 확인해야 한다.
- Terraform State의 저장, 암호화, Locking, 접근·복구 경계를 확인해야 한다.

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
- Compose는 Host 자체 HA 또는 Stateful Recovery를 제공하지 않는다.
- Multi-platform Build는 Product별 Native Dependency와 Test Evidence가 없다.
- ECR, GHCR와 Harbor의 현재 Repository/Runtime Evidence가 없다.
- Registry 비용은 Region, usage, retention과 replication 전까지
  `measurement_required`다.
- Digest 기반 Rollback은 아직 rehearsal Evidence가 없다.
- 1인 Operator 의존이며 24/7 SLA가 없어 Operator 부재 시 RTO를 초과할 수 있다.
- 실제 AWS Account·IAM과 Cloudflare Load Balancing 구성이 미검증이다.
- 실제 DB 크기와 Restore 시간, ALB/Fargate 비용, Cold Standby Provision 시간이
  미측정이다.
- Fencing Mechanism과 Read-only 구현 방식이 미결정이다.
- Cross-region DR는 `deferred`, Automatic Failover는 초기 `not_recommended`,
  Automatic Failback은 초기 후보에서 금지 상태다.
- AWS DR Runtime 후보의 RTO 4시간 달성 여부는 Full DR Drill 전 `target_not_verified`다.

---

## 21. Open Questions

Comment 10144에서 승인된 비용, RTO/RPO, Failover, Write, 응답시간, 초기 Managed
DB 정책과 Drill 주기는 Open Question으로 되돌리지 않는다.

### Primary

- 실제 Mac mini Hardware와 OS는 무엇인가?
- Docker Engine과 Compose를 설치·운영할 수 있는가?
- 현재 Service별 Memory / CPU 요구량은 얼마인가?
- Stateful Volume은 어디에 배치되는가?
- Host Reboot 후 자동 복구 요구는 무엇인가?

### Image

- 각 Product에 Dockerfile이 존재하는가?
- Base Image가 ARM64와 AMD64를 지원하는가?
- Native Dependency가 있는가?
- Platform별 Test는 어디에서 실행할 것인가?
- Emergency Build는 어떤 환경에서 수행하는가?

### Registry

- AWS Account와 IAM Owner는 누구인가?
- ECR과 GHCR 중 AWS 독립 Failure Domain이 더 중요한가?
- Registry 고정비와 Network 비용이 Cost cap에 포함되는가?
- Retention 기간과 최소 Rollback Digest 수는 얼마인가?
- Cross-region Replication이 필요한가?
- Break-glass Pull Credential은 어떻게 보관하는가?

### AWS Runtime

- Fargate와 EC2 중 실제 Application 호환성이 높은가?
- `desiredCount 0` 또는 equivalent Cold 상태가 비용 목표에 맞는가?
- ALB를 상시 유지할 것인가, Incident 때 생성할 것인가?
- NAT Gateway 없이 필요한 접근을 구성할 수 있는가?
- ECR과 GHCR 중 Failure Domain 우선순위는 무엇인가?
- Terraform State를 어디에 둘 것인가?

### Traffic

- 현재 Cloudflare Tunnel이 실제 운영 중인가?
- Load Balancing 기능을 사용할 것인가?
- Health Endpoint의 Liveness/Readiness/Write Readiness를 어떻게 분리할 것인가?
- Human Approval을 어떤 Interface에서 수행할 것인가?
- Primary Fencing Evidence는 무엇인가?
- Write Authority를 기술적으로 어떻게 표현할 것인가?

### Failback

- DR 중 발생한 Write를 Primary에 어떻게 반영할 것인가?
- Database Re-seed 방식은 무엇인가?
- Failback 중 Maintenance Window가 필요한가?
- AWS DR를 언제 Cold 상태로 되돌릴 것인가?

### Verification

- 4시간 RTO를 Cold Standby로 달성 가능한가?
- Operator 부재 시 Escalation은 어떻게 하는가?
- Drill Evidence의 저장 위치와 Owner는 무엇인가?

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

### External Capability Evidence

- Docker official documentation: Multi-platform, Compose Services, Secrets,
  Digest Pull, Production
- GitHub official documentation: Container Registry, Packages Permissions
- AWS official documentation: ECR Push, Lifecycle Policies, Private Replication
- Harbor official documentation: Repositories, Installation Prerequisites
- AWS official documentation (Slice 4): Fargate for ECS, Task Definition, Service
  Definition Parameters, Application Load Balancer, ALB Target Group Health Checks,
  EC2 Automatic Instance Recovery, EC2 User Data, ECS Task IAM Role, Amazon EKS
- Cloudflare official documentation (Slice 4): Tunnel, Load Balancing, Health
  Monitors, Pools
- Terraform official documentation (Slice 4): Terraform State

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
| 2026-08-04 | open | open | not_applicable | not_applicable | Slice 3에서 Primary Deployment, Image와 Registry 대안을 비교 | RPL-42 / Comment 10144 |
| 2026-08-05 | open | open | not_applicable | not_applicable | Slice 4에서 AWS DR Runtime과 승인 기반 Traffic Failover 대안을 비교 | RPL-42 / Comment 10144 |

이 History는 Architecture Option Approval이 아니다.

---

## 25. Review Checklist

### Scope

- [x] Architecture Scope In·Out을 분리했다.
- [x] Product Scope와 Runtime 구현을 변경하지 않는다.
- [ ] 후속 Slice에서 대안과 선택 근거를 완성한다.

### Alternatives

- [x] AWS DR Runtime과 Traffic Failover의 실질적 대안을 비교했다.
- [x] 선택 이유(Planning Leader)를 Driver와 연결했다.
- [x] Slice 3·Slice 4 모두 Architecture Option을 채택하지 않았다.

### Safety

- [x] Write Enable과 Fencing을 Decision Scope에 포함했다.
- [x] Fencing·Write Enable·Traffic Failover·Read-only·Failback Invariant를 정의했다.
- [x] 실제 Secret, Credential, Host, IP와 Account ID를 기록하지 않았다.
- [x] Slice 4에서 AWS/Cloudflare Failure Domain 결합 위험을 검토했다.

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
No architecture option is accepted in Slice 4.
```

### Constraints

Front Matter와 Section 7의 Constraints를 적용한다.

### Effective Scope

```text
Evidence Boundary, Decision Input State, and
Slice 3~4 Considered Option evaluations only
(Primary Deployment / Image / Registry / AWS DR Runtime / Traffic Failover)
```

### Required Follow-up

- ADR-0016 Slice 5 - PostgreSQL Backup, Restore, Promotion and RTO/RPO Matrix
- 후속 Slice의 대안 비교와 독립 Review
- ADR Index와 DEC-066 연결은 별도 Slice

### Review and Approval

```text
reviewed_at: null
approved_at: null
approvers: []
```

Architecture Option, Runtime 구현과 Infrastructure Provisioning은 승인되지 않았다.
