---
title: "Mac mini Primary와 AWS DR 기반 배포·재해복구 경계를 정의한다"
adr_id: "ADR-0016"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors: []
reviewers:
  - codex
approvers:
  - 박성환
created_at: "2026-08-03"
reviewed_at: "2026-08-06"
approved_at: "2026-08-06T01:04:27+09:00"
effective_from: "2026-08-06"
implementation_status: not_started
constraints:
  - "승인 범위는 Architecture Direction이며 Production Adoption, Runtime 구현이나 배포 완료를 승인하지 않는다"
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
  - RPL-42-explicit-user-approval-2026-08-06
  - DEC-066
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
> Architecture direction accepted_with_constraints
> ≠ Runtime implemented
> ≠ Infrastructure provisioned
> ≠ Production adoption approved
> ≠ RTO/RPO achieved
> ≠ Disaster recovery verified
> ```
>
> RPL-42 Comment 10144의 사용자 입력은 Architecture Target과 Decision Driver를
> 고정한다. Docker Compose, ECR/GHCR, ECS Fargate/EC2, S3 또는 Cloudflare Load Balancing의
> 채택이나 Runtime 운영을 증명하지 않는다.

---

## 1. Decision Summary

이 ADR은 Mac mini Primary와 AWS DR 사이에서 Ranikun Labs 서비스의 배포·복구
기준 방향을 제약과 함께 승인한다. RPL-42의 명시적 사용자 승인에 따라 Mac mini +
Docker Compose Primary, EC2 + Docker Compose Application DR, 별도 EC2 PostgreSQL Warm
Physical Standby + 독립 PITR, GHCR 우선 검증과 Human-approved Failover/Failback을
Runtime Discovery와 Isolated Spike·Restore Drill의 기준으로 사용한다. 실제 Runtime,
Infrastructure, Production Adoption과 목표 달성은 검증·승인되지 않았다.

```text
Architecture direction accepted_with_constraints
≠ Production topology adopted
≠ Runtime evidence
≠ Target achievement
```

---

## 2. Status

### Document Status

현재:

```text
document_status: accepted
```

문서가 승인됐어도 Production Adoption이나 Runtime 구현 완료를 의미하지 않는다.

### Decision Status

현재:

```text
decision_status: accepted_with_constraints
Architecture Direction Accepted: Yes
Production Adoption: not_approved
Runtime Evidence: runtime_unverified
RTO/RPO: target_not_verified
```

승인 범위는 Runtime Discovery와 Isolated Spike·Restore Drill의 기준 방향이다.

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
- `verified_fact`: ADR-0016은 사용자 승인에 따라 `accepted` /
  `accepted_with_constraints` / `not_started` 상태다.
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
| Standby | `planning_candidate` | Cold Restore와 Warm Physical Standby 비교 | 비용·복구·운영 부담 측정 필요 |
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

### 4.9 Slice 5 Official Capability Evidence

Accessed date: `2026-08-05`

| Source | Capability Evidence | Not Evidence Of |
|---|---|---|
| [PostgreSQL Continuous Archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html) | Base Backup + WAL Archive(`archive_command`), `restore_command`, `recovery_target_time/xid/lsn/name`, `recovery_target_timeline`, PITR마다 새 Timeline 생성, Timeline History File, 복구 시간은 Replay할 WAL 양에 비례, `postgresql.conf`/`pg_hba.conf`는 WAL로 복구되지 않음 | 현재 Backup 또는 WAL Archive 동작 |
| [pg_basebackup](https://www.postgresql.org/docs/current/app-pgbasebackup.html) | 실행 중 Cluster의 물리 Base Backup, Backup Manifest(checksum), `-X stream/fetch/none`, plain/tar 형식, REPLICATION 권한 필요 | 현재 Base Backup 존재 |
| [pg_verifybackup](https://www.postgresql.org/docs/current/app-pgverifybackup.html) | Manifest 기반 4단계 무결성 검증, WAL 검증(plain), "test restore는 여전히 필요", 모든 문제를 탐지하지 못함 | Restore 성공 또는 Business Consistency |
| [PostgreSQL Log-Shipping / Streaming Replication](https://www.postgresql.org/docs/current/warm-standby.html) | `standby.signal`, 연속 WAL Replay, File-based(async, `archive_timeout` 손실창) vs Streaming(async 기본 <1s), `pg_ctl promote`/`pg_promote()`, Failover 후 Old Primary에 재접속 안 함, 동일 Major Version·동일 Hardware Architecture 필요 | 현재 Standby 존재 또는 Replication 동작 |
| [PostgreSQL Replication Slots](https://www.postgresql.org/docs/current/warm-standby.html) | 필요한 WAL만 자동 보존, 단절 시 `pg_wal` 소진 위험, `max_slot_wal_keep_size` 완화 | 현재 Slot 구성 |
| [pg_rewind](https://www.postgresql.org/docs/current/app-pgrewind.html) | Timeline 분기 후 재동기화, `wal_log_hints` 또는 data checksum 필요, 분기점까지 WAL 필요, 실패 시 대상 복구 불가 | Failback 성공 또는 조건 충족 |
| [PostgreSQL Hot Standby](https://www.postgresql.org/docs/current/hot-standby.html) | Recovery 중 Read-only Query, `transaction_read_only` 항상 true, XID 미할당, 모든 Write 차단, eventually consistent | 현재 Standby 검증 |
| [PostgreSQL SQL Dump](https://www.postgresql.org/docs/current/backup-dump.html) | 논리 Backup, dump 시점 snapshot, PITR 없음, Role 선존재 필요, Version/Architecture 이식성 | Canonical DR 충분성 |
| [Amazon S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) | WORM, Retention Period + Legal Hold, Governance/Compliance Mode, Versioning 필요, Compliance는 root도 삭제 불가 | 현재 Bucket 또는 Immutability 구성 |
| [Amazon S3 Default Encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html) | 모든 Bucket SSE-S3 기본, SSE-KMS/DSSE-KMS 옵션, at-rest 암호화 | 현재 Bucket 존재 또는 Key 접근 |
| [Amazon EBS Snapshots](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html) | 증분 Point-in-time Backup, S3-backed(직접 접근 불가), Region 내 AZ 복제, AWS 자동 backup 아님(고객 책임), Snapshot으로 새 Volume 복원, Snapshot Lock | 현재 Snapshot 존재 |
| [Amazon RDS Point-in-time Recovery](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) | Automated Backup + Transaction Log(약 5분 간격 S3 업로드), Retention 창 내 새 Instance로 복원, `LatestRestorableTime` | RDS 구성 또는 채택 |
| [Amazon RDS Multi-AZ](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html) | 동기 Standby, 자동 Failover, 단일 Standby는 Read 미제공, Backup 대체 아님 | RDS 구성 또는 채택 |
| [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html) | 중앙 Backup Plan/Vault, EBS·RDS·EC2·S3·EFS 등 지원, Vault Lock WORM, 독립 암호화, Cross-region/account | 현재 Backup 구성 |

Vendor 문서는 PostgreSQL/AWS Capability, 지원 Configuration, Recovery·Replication
방식, 서비스 책임 경계, 제한사항만 증명한다. 현재 Backup·WAL Archive·S3 Bucket·RDS
존재, Restore 성공, 15분 RPO 또는 4시간 RTO 달성, Ranikun Labs 채택을 증명하지 않는다.

### 4.10 Slice 6 Official Capability Evidence

Accessed date: `2026-08-05`

| Source | Capability Evidence | Not Evidence Of |
|---|---|---|
| [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) | Recovery objective 정의, 주기적 Data Recovery, DR 구현 Test와 Game Day 필요성 | 현재 Recovery Objective 달성 또는 Drill 실행 |
| [AWS Defined Recovery Strategies](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_disaster_recovery.html) | Backup/Restore, Pilot Light, Warm Standby, Multi-site 간 RTO/RPO·비용·복잡도 Trade-off와 IaC 사용 | Candidate A~D 채택 또는 비용 충족 |
| [AWS Disaster Recovery Options](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) | Backup/Restore는 낮은 비용·복잡도와 높은 복구시간, Warm Standby는 축소된 기능 환경을 상시 유지하며 DR 전략을 정기 평가·시험해야 함 | AWS DR Runtime 존재 또는 Full Drill 성공 |
| [Terraform Dependency Graph](https://developer.hashicorp.com/terraform/internals/graph) | Dependency 완료 후 독립 Node를 병렬 처리하는 Graph 실행 모델 | RPL-42 Infrastructure 재현 또는 안전한 Writer 활성화 |
| [Terraform Plan](https://developer.hashicorp.com/terraform/cli/commands/plan) | Configuration과 State를 비교한 변경 Preview 및 저장 Plan 적용 | Terraform State, Provider, Plan 또는 Apply 실행 |

Slice 6은 기존 Slice 3~5 공식 Source와 위 Source를 통합 Capability Evidence로만
사용한다. 공식 문서도 Adoption, Runtime, 비용, 복구 성공 또는 RTO/RPO 달성 Evidence를
대체하지 않는다.

### 4.11 Candidate Reframe Official Capability Evidence

Accessed date: `2026-08-05`

| Source | Capability Evidence | Not Evidence Of |
|---|---|---|
| [Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) | Virtual Server, Security Group, EBS와 탄력적 기동 | EC2 또는 Compose Runtime 존재 |
| [EC2 User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) | Launch-time Bootstrap, 기본 1회 실행과 기동 시간 증가 가능성 | Bootstrap 성공 또는 RTO 달성 |
| [IAM Roles for EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) | 장기 AWS Credential 배포 없이 Instance Profile 임시 Credential 사용 | 현재 IAM Role 존재 |
| [Amazon EBS](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html) | EC2용 Persistent Block Storage와 Snapshot | Standby Disk 존재 또는 Backup 충분성 |
| [Fargate Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html) | Task별 ENI와 외부 Registry용 Internet/NAT 또는 ECR VPC Endpoint 경로 | Network 또는 Pull 성공 |
| [ECS Private Registry Authentication](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/private-auth.html) | Non-AWS Private Registry Credential을 Secrets Manager와 Task Execution Role로 전달 | GHCR Pull 성공 또는 단순성 |
| [Amazon ECR Authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) | IAM Principal 기반 Authorization Token 또는 Credential Helper | ECR Repository 또는 Pull 성공 |
| [Amazon ECR with ECS](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_ECS.html) | ECS/Fargate Task Execution Role의 ECR Image Pull 권한 | ECR이 모든 Runtime에 필수 |
| [Amazon ECR Pricing](https://aws.amazon.com/ecr/pricing/) | Storage와 Data Transfer 기반 Billing 구조 | 비용 Guardrail 충족 |
| [Application Load Balancer Pricing](https://aws.amazon.com/elasticloadbalancing/pricing/) | 실행 시간과 사용량 단위의 Billing 구조 | 실제 고정비 또는 Guardrail 충족 |
| [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) | OCI Image, GitHub Actions `GITHUB_TOKEN`, Private Pull PAT, Digest Pull | GHCR Package 또는 Credential 존재 |
| [GitHub Packages Billing](https://docs.github.com/en/billing/concepts/product-billing/github-packages) | Plan·Visibility·Storage·Transfer에 따른 Billing 측정 항목 | GHCR 비용 우위 또는 Guardrail 충족 |
| [Docker Compose in Production](https://docs.docker.com/compose/how-tos/production/) | Single-server Production Override와 변경 재적용 | Host HA 또는 EC2 적합성 검증 |
| [Docker Compose Profiles](https://docs.docker.com/compose/how-tos/profiles/) | 선택 Service의 Profile 기반 기동 | DR Override 적합성 또는 구성 완료 |
| [Docker Image Pull by Digest](https://docs.docker.com/reference/cli/docker/image/pull/) | Tag 대신 immutable Digest로 동일 Image Pinning | 해당 Digest의 Runtime 호환성 |

PostgreSQL Streaming Replication, Hot Standby, Replication Slot, Promotion,
Continuous Archiving/PITR, `pg_basebackup`, `pg_rewind`와 Timeline 근거는 §4.9를
재사용한다. Warm Standby는 활성화 시간을 줄일 수 있지만 비동기 Replication Lag,
동일 Major Version, Disk/WAL Retention, Monitoring, Promotion과 Timeline 운영을 추가한다.

Cloudflare Tunnel은 Origin에서 Edge로 연결하는 Capability이며 EC2 Gateway를 Origin으로
둘 수 있는 후보를 뒷받침한다. Cloudflare Load Balancing의 Monitor/Pool/Steering은
복수 Origin Health Routing 후보지만 Authoritative Fencing이나 Writer Authority를
증명하지 않는다. 위 공식 문서는 Candidate Reframe의 Capability Evidence일 뿐 실제
Account, Resource, 비용, 복구 시간, RTO/RPO 또는 채택을 증명하지 않는다.

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

- 이 ADR은 Architecture Direction만 승인하며 Production Adoption, Runtime 구현이나 배포
  완료를 승인하지 않는다.
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

```text
Architecture Direction Accepted
≠ Production Adoption Approved

Planning Leader
≠ Production Topology

First Validation Target
≠ Runtime Implemented
```

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
- `planning_candidate`: Warm Physical Standby+독립 PITR로 승인된 RTO/RPO 목표를
  검증할 수 있다.
- `planning_candidate`: Product별 Multi-platform Image를 만들 수 있다.
- `planning_candidate`: EC2 Compose 후보가 현재 Application과 호환되고 Fargate보다
  1인 운영 절차가 단순할 수 있다.
- `planning_candidate`: WAL Archive로 15분 RPO Target을 검증할 수 있다.

Assumption은 Constraint나 Fact로 승격하지 않는다.

#### Acceptance Constraints

- 실제 Mac mini Runtime Inventory가 완료되지 않았다.
- Docker Engine/Compose Runtime과 Product Image 호환성이 검증되지 않았다.
- PostgreSQL Version·Extension과 Shared Library가 확인되지 않았다.
- Database Size와 WAL Rate가 측정되지 않았다.
- Warm EC2/EBS/Network와 Monitoring 비용은 `measurement_required`다.
- Replication Lag·Slot·WAL Retention·Disk Full 위험이 검증되지 않았다.
- Base Backup + Continuous WAL Archive/PITR Prototype이 구현되지 않았다.
- GHCR Private Image Pull과 Credential Rotation이 검증되지 않았다.
- EC2 Compose Bootstrap과 Incident-time Provision 시간이 검증되지 않았다.
- Cloudflare Tunnel DR Origin이 검증되지 않았다.
- EC2 Compose/Fargate+ALB 및 Warm/Cold 비교 Spike가 실행되지 않았다.
- Authoritative Fencing과 Read-only Mechanism이 구현되지 않았다.
- Warm Standby Promotion과 Final-sync Failback Drill이 실행되지 않았다.
- Monthly Restore Check와 Quarterly Full DR Drill이 실행되지 않았다.
- RTO 4시간과 RPO 15분은 `target_not_verified`다.
- Production Security Review가 완료되지 않았다.

위 Constraint 중 하나도 현재 Runtime 부재를 단정하지 않는다. 해당 상태는
`runtime_unverified`, `measurement_required` 또는 `verification_required`로 기록한다.

#### Known Limitations

- 1인 운영이므로 Operator 부재 시 RTO Target을 초과할 수 있다.
- Warm Standby 후보는 비용·Network·Lag·Slot/Disk 운영에, Cold PITR 대안은
  Provision과 Restore 시간에 민감하다.
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

Decision state: accepted_with_constraints for architecture direction
Production adoption: not_approved

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
| Operational Complexity | low within AWS, IAM/Region 관리 필요 | low within GitHub, pull credential 관리 필요 | high | high during recovery |
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
planning assessment: conditional alternative, especially for ECS/Fargate
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
planning assessment: first_validation_target for EC2 Compose candidate
preferred when: GitHub build/release 연계와 AWS Region 독립 Failure Domain이 더 강한 driver
```

EC2에서 Private GHCR를 Pull하려면 최소 권한 PAT와 Rotation·Break-glass 보관이 필요하다.
Fargate에서 외부 Private Registry를 쓰면 Secrets Manager와 Task Execution Role 경계가
추가된다. ECR은 ECS/Fargate에서 IAM 통합 이점이 크지만 Registry 필요성이 ECR 필수성을
뜻하지 않는다. Dual-publish는 Registry 장애 대응을 늘리지만 Retention·Permission·
Release Promotion을 두 벌 운영하므로 초기 1인 운영 경로로 권장하지 않는다.

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

#### 8.8.1 ECR vs GHCR Reframe Matrix

| Criterion | ECR | GHCR | Dual-publish | Incident-time Build |
|---|---|---|---|---|
| GitHub Actions Build | AWS Credential/OIDC 설계 | `GITHUB_TOKEN` 강점 | 두 Publish Gate | Build Dependency 전부 필요 |
| ECS IAM Integration | strong | External Secret 필요 | ECR 경로 strong | weak |
| EC2 Pull Authentication | Instance Role+ECR Token | 최소 권한 PAT | 두 Credential | Build Credential |
| Private Image / Digest | supported / supported | supported / supported | supported | 이전 검증 Digest 보장 불가 |
| Multi-platform Manifest | supported | supported | 두 Registry 정합성 필요 | Incident Build 시간 증가 |
| Storage / Transfer Cost | `measurement_required` | `measurement_required` | 양쪽 측정 | Incident 비용/시간 측정 |
| Lifecycle / Retention | AWS Policy | GitHub Package Policy 검증 | 두 정책 | Artifact Retention 없음 |
| Permission / Credential | IAM 중심 | Package 권한+PAT | 두 Control Plane | Build/Source 권한 집중 |
| AWS Region / GitHub Coupling | AWS Region/Account | GitHub/External Network | 둘 다 | Source+Dependency Network |
| Registry Failure Domain | AWS DR와 결합 가능 | AWS와 분리 가능 | 복수 경로 | Registry 장애 회피 대신 Build 실패 위험 |
| MSA Image 증가 | Repository/IAM 증가 | Package/Permission 증가 | 둘 다 증가 | Build 시간 선형 증가 가능 |
| 1인 운영 | Fargate 시 강점 | EC2+GitHub 흐름 시 강점 후보 | 초기 과다 | not recommended |
| Break-glass Pull | IAM/Token Runbook | PAT/Export Runbook | 두 Runbook | 재빌드 Runbook |
| Current Evidence | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` |
| Measurement Required | Storage/Transfer/Lifecycle | Storage/Bandwidth/Auth | Promotion/Retention 일치 | Build/RTO/Dependency |
| Planning State | conditional alternative | first validation target | deferred | not recommended |

Git Tag/Release는 Source Version, Release Note, Commit Reference와 Build Trigger를 소유한다.
Container Registry는 실행 OCI Artifact, Manifest/Platform Digest, Pull, Rollback,
Retention과 Permission을 소유한다. 따라서 Registry는 필요하지만 ECR일 필요는 없고,
Incident-time Rebuild는 이전 검증 Artifact 재사용을 대체하지 않는다.

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

GHCR first validation target
→ GitHub build/release와 EC2 Compose 경로 단순성 검증

ECR conditional alternative
→ ECS/Fargate 선택 시 IAM integration benefit 검증
```

- Compose 선택은 ECR 선택을 강제하지 않는다.
- Multi-platform 선택은 Fargate 선택을 강제하지 않는다.
- AWS DR 선택은 Registry를 반드시 AWS에 두도록 강제하지 않는다.
- Git Tag는 Source/Release Identity와 Build Trigger를 소유하지만 실행 가능한 OCI
  Artifact, Manifest/Platform Digest, Pull, Rollback과 Retention을 소유하지 않는다.
- Incident-time Rebuild는 이전에 검증한 Artifact 재사용이 아니다.

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
| One-person Operation | conditional; Host 부담↓, ECS 객체↑ | first validation target; Host 부담↑, 모델 수↓ 가능 | weak | weak |
| RTO 4시간 가능성 | measurement_required | measurement_required | measurement_required | unknown |
| Cost Cap 적합성 | measurement_required | measurement_required | measurement_required | measurement_required |
| Current Runtime Evidence | runtime_unverified | runtime_unverified | runtime_unverified | runtime_unverified |
| Verification Requirement | verification_required | verification_required | verification_required | verification_required |
| Failure Domain | AWS Region/Account | AWS Region/AZ/Host | AWS Region/Account | build env/operator |

단순 점수가 아닌 후보별 설명은 8.14~8.17에서 상술한다.

#### 8.13.1 One-person Operations Application Reframe Matrix

| Criterion | Fargate + ALB | EC2 + Compose | Fargate without persistent ALB candidate | Manual EC2 Build |
|---|---|---|---|---|
| Primary Runtime 유사성 | medium | strong | medium | weak |
| Configuration Drift | Compose→Task/Service 변환 | Compose/Override 재사용 후보 | Task/Service+임시 ingress | high |
| Host OS / Docker 관리 | AWS | operator | AWS | operator/ad-hoc |
| ECS/IAM 관리 | Service·Task·Task/Execution Role | Instance Role 중심 | 동일+ingress 별도 | ad-hoc 위험 |
| ALB 필요성 | 안정적 진입점 후보 | optional | 영구 생략 가능성만 `deferred` | optional |
| Health Check | Container+Target Group | Compose+Gateway/Tunnel | Container+별도 ingress | 편차 큼 |
| Cloudflare Tunnel 직접 연결 | ALB Origin 후보 | EC2 Gateway 직접 Origin 후보 | Task 주소 수명/등록 검증 필요 | 수동 변경 위험 |
| Multi-service Compose | 별도 Task 정의 필요 | strong | 별도 Task 정의 필요 | 수동 |
| Service별 독립 Scale | strong | weak | strong | weak |
| Incident Startup | Pull+Task+Target 측정 | Boot+Bootstrap+Pull 측정 | Task+ingress 측정 | unknown |
| Cold State | Task 0, ALB 별도 | stopped/incident provision | Task 0+incident ingress | 가능, 반복성 낮음 |
| Fixed / Burst Cost | ALB 고정+Task burst 측정 | EBS 등 고정+Instance burst 측정 | ingress 생성비 측정 | RTO 손실 비용 포함 측정 |
| Debug / Break-glass | ECS/CloudWatch, Task Exec 별도 | SSH/Console+Docker | ECS/CloudWatch | 수동 |
| Native Dependency | Fargate 호환성 검증 | Host 선택 폭 | Fargate 호환성 검증 | Host 선택 폭 |
| Image / Registry | Digest; ECR 강점, GHCR Secret | Digest; ECR Role 또는 GHCR PAT | 동일 Fargate 경계 | 재빌드 유혹 |
| Secret / Environment | ECS Secret/Task Definition | Secret Source/Compose Override | ECS Secret/Task Definition | ad-hoc 위험 |
| Logs / Rollback | Log Group+Task Revision/Digest | Host Log+Compose/Digest | Log Group+Task Revision/Digest | 약함 |
| Terraform 재현성 | strong candidate | strong candidate | ingress까지 검증 | weak |
| 1인 운영 | Host 책임 감소, Control Plane 객체 증가 | Host 책임 증가, Runtime 모델 단순화 가능 | ingress Runbook 추가 | weak |
| Current Evidence | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` |
| Verification | Task/IAM/ALB/Cost | Bootstrap/Patch/Tunnel/Cost | 주소 안정성/ingress/Cost | RTO/오류율 |

현재 Logical Service 수만으로 Fargate가 자동으로 단순해지지는 않는다. Emergency
Cold DR, Multi-replica·독립 Scale Evidence 부재, Primary Compose라는 조건에서는
EC2 Compose가 Host 책임을 받는 대신 Compose/Task 이중 모델과 ALB/Target Group을
줄일 가능성이 있어 first validation target으로 앞선다.

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
planning assessment: conditional alternative
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
planning assessment: first_validation_target
adoption state: open
```

**Preferred when**: Compose 동등성이 최우선 · Emergency Cold DR · Multi-replica/독립
Scale Evidence 없음 · 운영자가 EC2 Bootstrap/Patch를 감당 가능.

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
Current planning leader / first validation target: EC2 + Docker Compose
Entry first validation: Cloudflare Tunnel direct to EC2 Gateway, ALB initially omitted
Conditional alternative: ECS Fargate + Application Load Balancer
Deferred: EKS
Not recommended as canonical path: No Predefined AWS Runtime
Decision state: accepted_with_constraints for architecture direction
Production adoption: not_approved
```

**Blocking verification**: Actual Application Image Compatibility · AWS Account/IAM · Region · VPC/Security Group · Image Pull · Task/Instance Startup · ALB Health · Secret/Configuration · Read-only Startup · Cost Estimate · Full DR Drill.

Planning Leader는 Accepted Decision이 아니다. ALB는 Fargate 후보에는
`required_for_fargate_candidate`, EC2 Compose 후보에는
`optional_for_ec2_compose_candidate`이며 통합 Runtime 선택 전 상태는
`deferred_until_runtime_choice`다.

#### 8.18.1 ALB Necessity Assessment

| Option | Value | Boundary | Planning State |
|---|---|---|---|
| Always-on ALB | 안정적 L7 Entry, Target Group, Health, Multi-AZ/Replica 분배 | 평상시 고정비와 ECS/Target Group 운영 | conditional for persistent Fargate |
| Incident-created ALB | 평상시 ALB 비용을 줄일 가능성 | 생성·DNS/Cloudflare 연결·Target Healthy가 RTO 경로 | conditional, measurement_required |
| EC2 + Cloudflare Tunnel, no ALB | 단일 Gateway Origin과 Primary 유사 Entry | 단일 Host, Tunnel Bootstrap·Origin 전환 검증 필요 | first validation target |
| Fargate + ALB | Task IP 변화에 대한 안정적 Entry와 Replica 분배 | ECS/IAM/ALB/Target Group 구성 필요 | retained alternative |
| Fargate without persistent ALB | 평상시 ALB 생략 가능성 | 공식 ingress, 주소 수명, Health와 Human Runbook 타당성 미확정 | deferred question |

ALB는 HTTP/S Load Balancing, Target Group Health Check, Multi-AZ Target, TLS Termination과
Replica Distribution을 제공한다. 단일 EC2 Cold DR, Spring Cloud Gateway, Cloudflare
Tunnel direct Origin, Human-approved Traffic이라는 초기 조건에서는 필수가 아니다.
단, Fargate 또는 Multi-replica/Multi-AZ가 선택되면 다시 우선 후보가 된다. ALB Health나
Cloudflare Monitor는 Observation이며 Fencing 또는 Database Write Impossibility가 아니다.

### 8.19 Traffic Failover Problem

Mac mini Primary 장애가 감지됐을 때, 오탐으로 AWS DR를 활성 Writer로 만들거나 Primary와 DR가 동시에 Write하는 Split-brain을 만들지 않으면서, 언제 누가 어떤 Evidence를 확인하고 사용자 Traffic을 전환할 것인가?

### 8.20 Traffic State Vocabulary

실제 Runtime State Machine을 구현·채택하지 않는다. 아래는 Failover Procedure 논의를 위한 Architecture State Vocabulary다.

| State | Entry Condition | 금지 행위 |
|---|---|---|
| PRIMARY_HEALTHY | Liveness·Readiness·Write Readiness 정상 | 불필요한 Failover |
| PRIMARY_SUSPECTED | Health Signal 이상 감지, 미확정 | 이 신호만으로 Write 전환 |
| PRIMARY_UNAVAILABLE | Primary 서비스 불가 확인 | Authoritative Fencing 없이 DR Write |
| DR_PREPARING | Incident 선언 후 DR 준비 시작 | Traffic 전환 |
| DR_RESTORING | PostgreSQL Restore/WAL Replay 진행 | Write Enable |
| DR_READ_ONLY | DR Runtime이 Read-only로 기동 | Business Write |
| DR_VALIDATING | Database/Application Read-only Check 진행 | Promotion 승인 |
| DR_PROMOTION_PENDING | DB/App Read-only PASS, Promotion 승인 대기 | 승인 없는 Promotion |
| DR_DATABASE_PROMOTED | Promotion 완료, Writer Authority Record 갱신 | Application Write 자동 활성화 |
| DR_WRITE_APPROVED | 별도 Application Write 승인 완료 | Controlled Write 전 Traffic 전환 |
| TRAFFIC_FAILOVER_APPROVED | Traffic 전환 승인 완료 | Rollback Target 없이 전환 |
| DR_ACTIVE | DR가 활성 Writer | Primary 동시 Write 허용 |
| FAILBACK_PREPARING | Primary 복구 후 Failback 준비 | 자동 Failback |
| PRIMARY_RESTORING | Primary Re-seed/동기화 진행 | Primary Write |
| DR_WRITE_FROZEN | Failback Cutover 승인 후 DR 신규 Write 중단 | Final Boundary 미기록 전 전이 |
| FAILBACK_FINAL_SYNC | Cutover Boundary 기준 Final Catch-up·검증 진행 | Primary Promotion |
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
Decision state: accepted_with_constraints for architecture direction
Production adoption: not_approved
```

### 8.25 Fencing Invariant

```text
DR Write Enable must not occur until the Primary writer has been fenced
or its inability to write has been independently established.
```

한국어 의미: **Primary Writer가 Fence되었거나 Write 불가능이 서로 독립적인 Evidence로
충분히 입증되기 전에는 DR Write를 활성화하지 않는다.**

#### A. Authoritative Fencing Mechanism Candidate

Primary의 Business Write를 직접 불가능하게 만드는 후보: Database Write Credential
Revocation 또는 비활성화 · Storage Lock 또는 Exclusive Write Lease 이전 · Primary Host
Power-off를 독립 Evidence로 확인 · Primary의 Database Write 경로를 차단하는 검증된
Network Isolation · Database Writer Process 또는 Database Runtime의 종료를 독립적으로
확인하는 Mechanism · 동등한 Write Authority Control.

각 후보는 구현된 상태가 아니며 `open / verification_required`다.

#### B. Supporting Containment Action

장애 범위를 줄이는 후보: Application Stop · Gateway Stop · Cloudflare Tunnel Disable ·
Traffic Route 제거 · Maintenance Mode · Primary Application Credential 제거.

```text
Supporting Containment Action alone ≠ Authoritative Fencing
```

#### C. Observation / Evidence Signal

판단을 돕지만 Write를 직접 막지 않는 Signal 후보: Cloudflare Health Failure · Tunnel
Down · Application Health Failure · Infrastructure Monitoring · Operator Observation ·
Independent Monitoring Confirmation · Physical Observation.

```text
Observation alone ≠ Fencing Mechanism
Health Failure ≠ Database Write Impossibility
Tunnel Disable ≠ Database Write Impossibility
Application Stop ≠ Database Write Impossibility
```

#### DR Write Fencing Gate

DR Write는 1) 하나 이상의 Authoritative Fencing Mechanism이 적용되고 검증됐거나,
2) Primary의 Business Write 불가능이 서로 독립적인 Evidence로 충분히 입증된 경우에만
승인 후보가 된다. Supporting Containment Action 또는 Observation만으로는 DR Write를
허용하지 않는다.

```text
Traffic Switch ≠ Fencing
Health Check Failure ≠ Fencing
Tunnel Down ≠ Database Write 불가능
```

현재 Authoritative Fencing 방식과 독립 Evidence의 충분성 기준은 `open / verification_required`다.

### 8.26 Write Enable Gate

DR Write 허용을 위한 최소 Gate 후보(순서):

1. Incident 선언
2. Primary 상태 Evidence 수집
3. Authoritative Fencing 적용·검증 또는 서로 독립적인 Write-impossibility Evidence 확인
4. AWS Database/Application Runtime 준비
5. Restore Target 도달
6. PostgreSQL을 Read-only 또는 Recovery-safe 상태로 기동
7. Database-level Validation
8. Application Runtime을 강제 Read-only 상태로 기동
9. Application Read-only Query와 Critical Business Read 검증
10. Database Promotion Approval
11. PostgreSQL Promotion
12. Database Writer Authority Record 갱신
13. Application Write Enable Approval
14. Controlled Write Probe
15. Traffic Failover Approval

```text
Runtime Healthy ≠ Write Enabled
Database Connected ≠ Data Consistent
Application Read-only PASS ≠ Database Promoted
Database Promotion Approval ≠ Application Write Approval
Database Promotion Success ≠ Application Write Enabled
Controlled Write PASS ≠ Traffic Failover Approved
```

### 8.27 Traffic Failover Gate

Traffic 전환 전 최소 Evidence 후보: DR Runtime Healthy · ALB 또는 Target Health 정상 ·
Application Readiness 정상 · Database Restore 완료 · Database/Application Read-only
Validation · Authoritative Fencing Evidence 또는 독립 Write-impossibility Proof · Database
Promotion Approval/실행 · Writer Authority Record · Application Write Enable 승인 ·
Controlled Write Probe · Audit Record · Rollback Target 준비 · Operator 승인.

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

Failback 최소 후보 순서: 기존 Primary 복구·호환 확인 → 초기 Re-seed → Primary Initial
Read-only Validation → Failback Cutover Window 승인 → AWS DR 신규 Business Write Freeze →
Final Write/Cutover Boundary 기록 → Primary Final WAL/Data Catch-up → Timeline·LSN·Business
Boundary Validation → Primary Final Read-only Validation → AWS DR Writer Authority 해제 승인 →
Primary Promotion/Writer Authority 활성화 → Controlled Write Probe → Traffic Failback 승인 →
AWS DR Read-only/Cold 전환 → Incident Close.

```text
DR Write Freeze ≠ Final Catch-up Complete
Initial Re-seed ≠ Failback Promotion Approved
Traffic Failback ≠ Writer Authority Transfer
```

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

비용 Concern 후보: Warm EC2 Compute · Warm EBS · Replication Transfer · Incident-time EC2
Application · ALB 고정비 · Fargate Task · NAT Gateway · ECR Storage/Transfer · GHCR
Storage/Bandwidth · S3 Backup/WAL · Cloudflare Load Balancing · Logging/Monitoring · Terraform
State Backend · Drill Burst.

```text
status: measurement_required
```

사용자 승인 Guardrail(§4.6과 일치): 월 고정비 목표 50,000원 이하 · Hard Cap 100,000원. Burst Incident/Drill 비용은 고정비와 분리해 기록한다. 정확한 Vendor 가격은 기록하지 않는다.

### 8.37 Data DR Problem

Mac mini에 위치할 가능성이 있는 PostgreSQL Business SSOT를 잃었을 때, 승인된 Backup와 WAL Evidence를 사용해 최대 15분 RPO Target과 4시간 RTO Target 안에서 AWS에 복구하되, Primary와 DR가 동시에 Write하지 않고 복구 시점을 검증 가능한 형태로 어떻게 선택·복원·승격할 것인가?

```text
PostgreSQL Host = runtime_unverified
Version / Size / WAL Rate / Extension = unknown
Backup 존재 = runtime_unverified
RTO 4h / RPO 15m = target (not achieved)
```

이번 Slice는 Architecture 비교다. Backup Script나 Database Resource를 만들지 않는다.

### 8.38 Recovery Strategy Matrix

| Criterion | Cold Base Backup + WAL | Warm Physical Standby | Managed Primary | Dump-only / Manual |
|---|---|---|---|---|
| Business SSOT 적합성 | strong | strong | strong(Architecture 변경) | weak |
| PostgreSQL Native Recovery | strong | strong | managed | weak |
| Point-in-time Recovery | strong | strong(+base backup) | strong(managed) | weak, dump 시점만 |
| RPO 15분 가능성 | conditionally_viable, archive lag 의존 | strong candidate | strong(약 5분 log) | weak |
| RTO 4시간 가능성 | measurement_required | measurement_required(단축 가능) | measurement_required | weak |
| Continuous WAL 필요 | 필요 | 필요 | managed | 불필요 |
| Streaming Replication 필요 | 불필요 | 필요 | managed | 불필요 |
| Base Backup 필요 | 필요 | 필요(초기) | managed | not_applicable |
| Backup Verification | pg_verifybackup 후보 | 동일 + standby | managed | 제한적 |
| Recovery Timeline 관리 | 필요 | 필요(promotion 후) | managed | not_applicable |
| Restore Target 선택 | strong(PITR) | acceptable | strong | weak |
| Promotion | 복구 후 promote | pg_ctl promote/pg_promote() | managed failover | not_applicable |
| Old Primary Fencing | 필요 | 필요 | managed 경계 | 필요 |
| Split-brain 위험 | medium(수동 통제) | medium(timeline divergence) | low(managed) | medium |
| Primary/DR Version 호환 | 필요 | 동일 Major 필요 | managed | 이식성 높음 |
| Extension 호환 | 필요 | 필요 | 제약 가능 | 부분 |
| Major Version 제약 | 복구 Runtime 일치 | 동일 Major 필수 | vendor 지원 목록 | 완화 |
| Storage 용량 | base+WAL | base+WAL+standby | managed | dump 크기 |
| WAL 생성량 영향 | archive 부하 | archive+stream 부하 | managed | not_applicable |
| Network Bandwidth 영향 | archive 전송 | 지속 stream | managed | dump 전송 |
| 평상시 고정비 | low(off-host storage) | medium-high(상시 compute) | high(상시 managed) | low |
| Incident Burst Cost | restore compute | 낮음(이미 warm) | 낮음 | restore compute |
| One-person Operation | strong candidate | conditionally_viable | acceptable(운영 위임) | weak |
| Operational Complexity | medium | high | medium(managed) | low-medium |
| Monitoring | archive/backup 관측 | +lag/slot 관측 | managed metric | 제한적 |
| Archive Gap 탐지 | 필요 | 필요 | managed | not_applicable |
| Replication Lag 탐지 | not_applicable | 필요 | managed | not_applicable |
| Backup Encryption | 후보(at rest/in transit) | 동일 | managed(KMS) | 후보 |
| Off-host Storage | required | required | managed | required |
| Immutability | S3 Object Lock 후보 | 동일 | managed 경계 | 후보 |
| Credential Separation | Backup/Restore 분리 후보 | +replication cred | managed IAM | 부분 |
| Restore Drill | 필요 | 필요 | 필요 | 필요 |
| Failback Complexity | re-seed 가능성 | pg_rewind 조건부/re-seed | managed 경계 재설계 | rebuild |
| Re-seed 필요성 | 높음 | 조건부(pg_rewind) | 낮음 | 높음 |
| Terraform 재현성 | acceptable | acceptable | strong(managed) | weak |
| Current Evidence | runtime_unverified | runtime_unverified | runtime_unverified | runtime_unverified |
| Verification Requirement | verification_required | verification_required | verification_required | verification_required |

각 대안의 근거는 8.39~8.42에서 상술한다.

#### 8.38.1 One-person Operations Database Reframe Matrix

| Criterion | Cold Restore | Warm Physical Standby | Warm Standby + PITR Backup | Managed Primary |
|---|---|---|---|---|
| 평상시 비용 | Object Storage 중심 | Compute+EBS+Network | Standby+Backup Storage | Managed 상시 비용 |
| RPO/RTO 가능성 | Archive/Restore 속도 의존 | Replication Lag/Promotion 의존 | Replication+독립 Restore 선택지 | Managed 기능 의존 |
| Base Backup / WAL Archive | required / required | 초기 Base 필요, Archive 없으면 PITR 부재 | required / required | managed boundary |
| Streaming / Network | 불필요 / Archive 전송 | required / 단절 시 Lag | required+Archive / 둘 다 관측 | managed |
| Slot/WAL/Disk | Archive 보존 | Slot·Retained WAL·Standby Disk | 동일+Backup Retention | managed |
| Version/Extension | Restore Runtime 일치 | Primary/Standby 일치 | 둘 다 필요 | Vendor 지원 범위 |
| Read-only / Promotion | Restore 후 검증/승격 | Standby Query/승격 | Standby Query/승격+PITR 대체 | managed boundary |
| Timeline / Failback | 새 Timeline, Re-seed | Promotion 분기, Re-seed/조건부 rewind | 동일 | 별도 Migration 경계 |
| 잘못된 삭제·손상 전파 | PITR Target으로 회피 후보 | Standby에 전파 가능 | PITR Backup으로 회피 후보 | Backup/PITR 의존 |
| Fencing | required | required | required | required at architecture boundary |
| Monitoring | Archive Gap | Lag/Slot/Disk | Archive+Lag+Slot+Disk | managed+operator |
| Restore Drill | required | Standby 장애 대비 required | required | required |
| 1인 운영 | 절차 길지만 상시 운영 낮음 | 상시 운영 높음 | 가장 높은 운영 표면이나 복구 선택지 | Primary 변경 부담 |
| Current Evidence / Cost | `runtime_unverified` / `measurement_required` | 동일 | 동일 | 동일 |
| Verification | Size/WAL/Restore | Network/Lag/Promotion | 앞의 두 경로와 독립 Backup | Migration/Cost/Compatibility |
| Planning State | retained alternative | incomplete alone | first validation target | deferred |

```text
Warm Standby != Backup
Streaming Replication != PITR
RPO 15 minutes != upload WAL once every 15 minutes
```

RPO Target은 Continuous 또는 bounded-delay WAL Archive, Archive Gap/Lag, Warm Standby
Replication Lag와 복원된 Business Event Boundary로 검증한다. Standby는 Primary의 삭제나
손상도 Replay할 수 있으므로 Base Backup, Continuous WAL Archive, Restore Point,
Integrity Verification과 Restore Drill을 별도 유지한다.

### 8.39 Cold Base Backup + WAL Analysis

**Candidate 장점**

- PostgreSQL Native Base Backup과 WAL Replay를 사용할 수 있다.
- Primary Host와 분리된 Off-host Backup이 가능하다.
- 평상시 AWS Compute를 최소화할 수 있다.
- 특정 복구 시점(PITR)을 선택할 수 있다.
- Cold Standby Cost Guardrail과 정렬된다.
- 장애 전 승인된 Backup와 WAL을 사용하고 복구 Runtime을 Incident 때 생성할 수 있다.
- Warm Standby보다 상시 운영 부담이 낮을 수 있다.
- Restore Drill로 절차를 검증할 수 있다.
- 동일 Major Version과 Extension을 복구하는 후보다.

**한계와 위험**

- Base Backup Download와 WAL Replay 시간이 Database Size·WAL 양에 민감하다.
- Archive Gap이 있으면 RPO를 달성할 수 없다.
- Backup 손상 시 복구 불가, Restore Environment를 Incident 때 준비해야 할 수 있다.
- PostgreSQL Version·Extension 호환이 필요하고 Restore Target을 잘못 선택할 위험이 있다.
- 최신 미전송 WAL 구간이 손실될 수 있다.
- Backup Encryption Key 접근과 Backup Catalog/Metadata가 필요하다.
- 복구 후 Write Enable 전 Validation이 필요하고 Failback 시 Primary Re-seed 가능성이 있다.
- Full Drill 전 RTO/RPO를 검증할 수 없다.

```text
planning assessment: retained alternative for low fixed cost
adoption state: open
```

**Required verification**: Actual PostgreSQL Version · Extension Inventory · Database Size · WAL Generation Rate · Base Backup Duration · WAL Archive Lag · Archive Gap Detection · Restore Download Time · WAL Replay Time · PITR Target Selection · Backup Verification · Read-only Startup · Consistency Check · Promotion · Full DR Drill.

Cold Restore를 최종 채택하지 않는다.

### 8.40 Warm Physical Standby Analysis

**Candidate 장점**

- 지속적 WAL 수신으로 더 짧은 RPO가 가능할 수 있다.
- Restore 단계 일부를 축소할 수 있다.
- Hot Standby로 Read-only 검증이 가능하다.
- Incident 시 Promotion 시간을 단축할 수 있다.
- Backup과 Replication을 병행하고 Replication Lag를 지속 관측할 수 있다.

**한계와 위험**

- AWS Compute와 Storage 상시 비용이 발생한다.
- Primary-Standby Network 연결과 Replication Credential 관리가 필요하다.
- Replication Slot 또는 WAL Retention 위험(`pg_wal` 소진)이 있다.
- Network 단절 시 WAL 축적과 Standby Lag가 생긴다.
- 동일 Major Version과 Extension·Hardware Architecture 정합성이 필요하다.
- Standby 운영·Patch 책임과 Promotion 후 Timeline Divergence가 있다.
- Old Primary 재등장 시 Split-brain 위험, Failback을 위한 Re-seed 또는 pg_rewind 검토가 필요하다.
- 1인 운영 복잡도가 증가하고 Cost Guardrail을 초과할 수 있다.

```text
planning assessment: first_validation_target only with independent PITR backup
adoption state: open
```

**Preferred when**: Database Recovery Speed가 Application보다 우선 · Cold Restore 시간이
unknown이거나 RTO를 위협 · 상시 비용이 Guardrail 안에 있음 · Replication 운영과
Monitoring/Drill 가능 · Base Backup/WAL PITR를 별도 유지.

Warm Standby가 반드시 더 안전하다고 단정하지 않는다.

### 8.41 Managed PostgreSQL Primary Analysis

Business Primary 자체를 RDS PostgreSQL 등 Managed Service로 이전하고 Automated Backup, Snapshot, PITR, Multi-AZ Capability를 활용하는 후보다.

**장점**: Host OS와 일부 Backup 운영 부담 감소 · Managed Backup/PITR(약 5분 log) · Multi-AZ 동기 Standby와 자동 Failover · AWS Runtime/Network Integration · Managed Monitoring/Maintenance.

**한계와 위험**: 현재 승인 Target은 Managed DB Primary **초기 미채택** · Primary Architecture 자체 변경 · 월 고정비 증가 · Local Mac mini 중심 모델 변경 · 인터넷·AWS 의존 증가 · Version/Extension 제약 가능 · Migration·Cutover 별도 프로젝트 · Data Transfer/Downtime/Rollback 설계 · Vendor Lock-in · Cost Guardrail 충돌 가능 · 현재 Size/Workload 부재로 판단 불가.

```text
planning assessment: deferred / initially_not_adopted
```

**re-evaluation trigger**: Local Primary Reliability 한계 · Cold/Warm DR 운영 복잡도 과다 · 비용 대비 운영효율 우위 · Availability 요구 증가 · 실제 Workload/비용 측정 · Migration 승인.

Managed Primary를 영구 거부하지 않는다.

### 8.42 Logical Dump-only / Manual Rebuild Analysis

pg_dump 또는 Application Export만 보존하고 Incident 시 새 Database에 Import하며 WAL 기반 PITR이 없는 방식이다.

**가능한 장점**: 논리적 이식 Export · 일부 Schema/Data Migration 활용 · 작은 DB에서 단순 · Selective Restore.

**한계와 위험**: 15분 RPO 달성 곤란 · Large DB Restore 장시간 · Dump 시점 이후 손실 · Transaction Consistency/Restore 순서 · Roles/Grants/Extensions/Settings 누락 가능 · Binary vs Logical 차이 · Incident 때 수동 환경 구성 · RTO 예측 불가 · PITR 불가 · Continuous Recovery Evidence 부족 · Full SSOT Recovery 경로로 불충분.

```text
planning assessment: not_recommended as canonical DR
```

단, Logical Portability · Schema Inspection · Selective Recovery · Migration · Secondary Safety Export 용도의 보조 수단으로 유지할 수 있다.

### 8.43 Recovery Planning Result

```text
Current planning leader / first validation target: AWS EC2 Warm Physical Standby + independent Base Backup / Continuous WAL PITR
Conditional alternative: Base Backup + Continuous WAL Archive 기반 Cold Restore
Deferred / initially not adopted: Managed PostgreSQL Primary
Not recommended as canonical recovery: Logical Dump-only / Incident-time Manual Rebuild
Decision state: accepted_with_constraints for architecture direction
Production adoption: not_approved
```

**Blocking verification**: Actual PostgreSQL Version · Extension Inventory · Database Size · WAL Rate · Backup Duration · Archive Lag · Restore Time · Replay Time · Cost · Full Restore Drill · Failover Drill · Failback Drill.

Planning Leader는 Accepted Decision이 아니다. Warm Compute, EBS, Replication Network,
Patch, Lag, Slot/WAL Retention, Disk Full, Rebuild, Promotion과 Timeline 운영은 모두
`measurement_required` 또는 `verification_required`다.

### 8.44 Backup Artifact Model

| Artifact | Content Owner | Storage Owner | Integrity Evidence | Retention | Encryption | Restore Use | Runtime Evidence |
|---|---|---|---|---|---|---|---|
| Base Backup | Business Data owner | Off-host storage owner | Manifest/checksum | open | required | 물리 복원 시작점 | runtime_unverified |
| Backup Manifest | Business Data owner | Off-host storage owner | pg_verifybackup | base backup와 동일 | required | 무결성 검증 | runtime_unverified |
| WAL Segment | Business Data owner | Off-host storage owner | archive 검증 | open | required | Replay | runtime_unverified |
| Timeline History File | Business Data owner | Off-host storage owner | 존재 확인 | WAL과 동일 | required | Timeline 선택 | runtime_unverified |
| Recovery Metadata | Operations | Catalog owner | 필드 검증 | open | 후보 | Target 선택 | unknown |
| Backup Catalog Entry | Operations | Catalog owner | 필드 검증 | open | 후보 | Backup 발견 | unknown |
| PostgreSQL Version Reference | Business Data owner | Catalog owner | Inventory 대조 | 영구 | not_applicable | 호환 확인 | unknown |
| Extension Inventory Reference | Business Data owner | Catalog owner | Inventory 대조 | 영구 | not_applicable | 호환 확인 | unknown |
| Configuration Version Reference | Operations | Config source owner | Version 대조 | open | 후보 | 재구성 | runtime_unverified |
| Encryption Key Reference | Security/Operations | Key store owner | 접근 test | 별도 | key material | 복호화 | runtime_unverified |
| Integrity Verification Result | Operations | Evidence store owner | 검증 로그 | open | 후보 | 승인 근거 | not_run |
| Restore Drill Result | DR Drill owner | Evidence store owner | Drill 로그 | open | 후보 | RTO/RPO 근거 | not_run |
| Retention State | Operations | Storage owner | Policy 검토 | open | not_applicable | Coverage 판단 | unknown |
| Deletion Protection State | Operations | Storage owner | Lock 확인 | open | not_applicable | 삭제 방지 | unknown |

실제 파일명, Bucket, Host, Credential은 기록하지 않는다.

### 8.45 Backup Storage Failure Domain

```text
Primary Host failure must not remove the only usable database backup,
WAL archive, backup manifest, or decryption path.
```

한국어 의미: **Primary Host 장애가 유일하게 사용 가능한 DB Backup, WAL Archive, Backup Manifest 또는 복호화 경로를 제거해서는 안 된다.**

- Primary Mac mini와 Off-host Storage를 분리한다.
- Backup Credential과 Application Credential을 분리한다.
- Backup Write 권한과 Restore Read 권한을 분리하는 후보.
- Backup Storage가 Primary Filesystem에만 존재하지 않는다.
- Encryption Key를 Backup Data와 같은 단일 Failure Domain에만 두지 않는다.
- Retention 오설정으로 모든 Restore Point가 제거되지 않도록 방지한다(S3 Object Lock/Versioning 후보).
- Backup Storage 손상 또는 계정 잠금에 대한 Break-glass를 고려한다.
- Region 장애와 Backup Storage Region 결합을 분석한다. Cross-region Backup은 `deferred`를 유지한다.

S3를 최종 채택하지 않는다. **Off-host encrypted object storage planning candidate**로 기록한다.

### 8.46 Backup Encryption Boundary

후보 요구사항: Backup at rest encryption · Backup in transit encryption · Encryption Key Reference 분리 · Restore Operator 최소 권한 · Application Runtime은 Backup 삭제 권한 없음 · DR Runtime은 필요 시 Read-only Restore 권한 후보 · Key Loss 시 복구 불가 위험 · Key Rotation과 Old Backup 복구 가능성 · Break-glass · Audit Evidence.

실제 KMS Key ID, Secret, Credential은 기록하지 않는다.

```text
Encryption Capability ≠ Restore Verification
```

### 8.47 Base Backup Boundary

```text
Base Backup + Required WAL = Point-in-time Recovery Candidate
Base Backup만 존재 ≠ RPO 15분 달성
```

Base Backup은 특정 시점의 Database Physical State를 제공하지만 그 자체만으로 최신 RPO를 제공하지 않는다.

Base Backup 후보 검증: Start/End Time · PostgreSQL Version · Backup Manifest · Integrity Verification · Required WAL 범위 · Storage Size · Transfer Duration · Restore Duration · Last Successful Restore · Retention State.

정확한 Backup 주기를 확정하지 않는다. Frequency는 `measurement_required` / `open`을 유지한다.

### 8.48 WAL Archive Boundary

WAL Archive 후보 요구사항: Continuous 또는 bounded-delay archive · Archive 성공/실패 관측 · Last Archived WAL · Archive Lag · Archive Gap 탐지 · Duplicate Segment 처리 · Partial File 방지 · Compression 후보 · Encryption · Retention · Timeline History 보존 · Restore 접근 · Failed Archive Alert · Storage Full Alert.

```text
WAL Archive Process Running ≠ WAL Archive Complete
Last Archive Timestamp ≠ Recoverable Restore Point
```

15분 RPO Target을 주장하려면 WAL 생성 시간 · Archive 완료 시간 · Missing Segment 없음 · Base Backup 연결 가능 · Restore Drill Replay · Target Point 검증이 필요하다.

### 8.49 RPO State Model

State Vocabulary: `rpo_target_defined` · `backup_missing` · `base_backup_available` · `wal_archive_unknown` · `wal_archive_lagging` · `wal_archive_gap_detected` · `recoverable_point_estimated` · `recoverable_point_verified` · `rpo_target_not_verified` · `rpo_target_met_in_drill` · `rpo_target_breached`.

```text
Archive Lag ≤ 15분 ≠ RPO Verified
```

RPO는 성공한 Restore Drill과 복구 시점 검증 전까지 `target_not_verified`다.

### 8.50 Restore Target Selection

복구 목표 후보와 위험:

| Target Candidate | 주요 위험 |
|---|---|
| Latest Consistent Point | Corruption 이후 시점 복구 가능성 |
| Incident Detection 이전 시점 | Detection 시각 부정확 |
| Operator-selected Timestamp | Timezone 오류, Clock Drift, Operator 입력 오류 |
| Transaction ID | Application Event와 DB Time 불일치 |
| LSN | 사람이 판단하기 어려움 |
| Named Recovery Point | 사전 생성 필요 |
| End of Available WAL | Missing WAL·Wrong Timeline 위험 |

Restore Target 선택은 Human Approval이 필요한 후보로 기록한다. Owner: 박성환. 정확한 Target Syntax를 구현·채택하지 않는다.

### 8.51 Restore State Model

구현된 State Machine이 아니라 Architecture Vocabulary다.

| State | Entry Condition | 금지 행위 |
|---|---|---|
| BACKUP_STATE_UNKNOWN | Backup 상태 미확인 | Restore 시작 |
| BACKUP_CATALOG_VALIDATING | Catalog 조회 시작 | Base Backup 선택 |
| BASE_BACKUP_SELECTED | 후보 Base Backup 식별 | Manifest 미검증 진행 |
| WAL_RANGE_VALIDATING | 필요한 WAL 범위 확인 | Target 확정 |
| RESTORE_TARGET_SELECTED | Target 선택·승인 | 승인 없이 복원 |
| RESTORE_ENVIRONMENT_PREPARING | Runtime 준비 | Version 미확인 복원 |
| BASE_BACKUP_RESTORING | Base Backup 복원 진행 | WAL Replay 병행 승격 |
| WAL_REPLAYING | WAL Replay 진행 | Write Enable |
| RECOVERY_TARGET_REACHED | Target 도달 | Consistency 미검증 승격 |
| DATABASE_READ_ONLY | Read-only 기동 | Business Write |
| DATABASE_VALIDATING | Validation 진행 | Promotion 승인 |
| APPLICATION_READ_ONLY_VALIDATING | Application 강제 Read-only 검증 | Promotion·Business Write |
| DATABASE_PROMOTION_PENDING | DB/App Read-only Validation 통과, 승인 대기 | Fencing 미확인 승격 |
| DATABASE_WRITE_APPROVED | Fencing+Validation 후 승인 | 승인 범위 초과 |
| DATABASE_ACTIVE_WRITER | 활성 Writer | Old Primary 동시 Write |
| OLD_PRIMARY_RESEED_REQUIRED | Old Primary 재사용 판정 | 검증 없이 Writer 복귀 |
| FAILBACK_DATABASE_PREPARING | Failback DB 준비 | 자동 Failback |
| FAILBACK_FINAL_SYNC | DR Final Boundary 기준 Catch-up·검증 | Primary Promotion |
| INCIDENT_DATABASE_CLOSED | Evidence 보존 후 종료 | Evidence 미기록 종료 |

### 8.52 Restore Order Candidate

Backup/Restore 선행 후보 순서: Incident 선언 → Authoritative Fencing Evidence 또는 독립
Write-impossibility Proof → Backup Catalog/Manifest/WAL 연속성 확인 → Restore Target
선택·승인 → AWS Database Runtime과 Version·Extension 준비 → Base Backup Restore → WAL
Replay → Restore Target 도달.

#### Canonical Promotion Planning Sequence

1. Restore Target 도달
2. PostgreSQL을 Read-only 또는 Recovery-safe 상태로 기동
3. Database-level Validation
4. Application Runtime을 강제 Read-only 상태로 기동
5. Application Read-only Query와 Critical Business Read 검증
6. Database Promotion Approval
7. PostgreSQL Promotion
8. Database Writer Authority Record 갱신
9. Application Write Enable Approval
10. Controlled Write Probe
11. Traffic Failover Approval
12. DR Active

Application Read-only Validation은 Promotion 전에 실행하는 Planning Candidate다. 복구
Database가 Promotion 전 Read-only 검증을 제공하는 실제 방식은 `open`이며 PostgreSQL
Hot Standby · Recovery-safe Read-only Runtime · Read-only Role · Application-level Write
Block · Gateway Write Block · Combination 후보 중 하나를 채택하지 않는다.

```text
Restore Complete ≠ Promotion Approved
Recovery Target Reached ≠ Data Consistency Verified
Database Started ≠ Application Write Safe
Application Read-only PASS ≠ Database Promoted
Database Promoted ≠ Application Write Approved
Controlled Write PASS ≠ Traffic Failover Approved
```

이 순서는 Planning Candidate이며 실행 Runbook이 아니다.

### 8.53 Database Read-only Validation

Promotion 전 최소 Validation 후보: PostgreSQL Startup · Recovery-safe 상태와 Restore
Target 도달 확인 · Expected Database 목록 · Schema Version · Migration Version · Extension
Availability · Role/Grant Availability · Critical Table 존재 · Referential/Logical Invariant ·
Recent Business Record · Restore Target 시각 · Timeline · WAL Replay 종료 지점 · Application
강제 Read-only 기동 · Application Read-only Query · Critical Business Read · Audit/Projection
상태.

Read-only 구현 방식은 `open`이다. 후보: PostgreSQL Hot Standby · Read-only Database Role · Transaction Read-only · Application Feature Flag · Gateway Write Block · Combination. 이번 Slice에서 하나를 채택하지 않는다.

### 8.54 Promotion Invariant

```text
A restored or standby PostgreSQL instance must not be promoted to the
active writer until the old Primary writer has been fenced and the
recovered database has passed approved validation.
```

한국어 의미: **복원되거나 Standby인 PostgreSQL Instance는 Old Primary Writer가 Fence되고 복구된 Database가 승인된 Validation을 통과하기 전에는 활성 Writer로 승격되지 않는다.**

Promotion 조건 후보: Old Primary Authoritative Fencing 또는 독립 Write-impossibility Proof ·
Correct Restore Target · Required WAL Replay 완료 · Version/Extension Compatibility · Schema/
Migration Compatibility · Database Read-only Validation · Application 강제 Read-only 기동 ·
Application Read-only Query와 Critical Business Read · Secret/Role 확인 · Promotion Owner
승인 · Audit Evidence 생성.

```text
Database Promotion Approval ≠ Application Write Approval
Database Promotion Success ≠ Application Write Enabled
```

Promotion 명령이나 Tool을 최종 채택하지 않는다. `pg_ctl promote` 또는 `pg_promote()`는 Capability Evidence로만 언급한다.

### 8.55 Writer Authority

Database Writer Authority 후보 속성: Current Writer Environment · Database Instance Identity ·
Timeline · Promotion Approval/Time · Incident ID · Approval Owner · Fencing Evidence · Write
Credential Version · Application Release Digest · Configuration Version · Last Validation
Result · Failback Cutover Boundary Reference · Final Synchronization Result.

```text
Traffic Destination ≠ Database Writer Authority
Database Credential Possession ≠ Approved Writer Authority
Promotion Command Success ≠ Application Write Approval
```

Writer Authority 변경은 Audit Evidence가 필요하다.

### 8.56 Timeline Divergence

- Promotion 이후 새로운 Timeline이 생성될 수 있다.
- Old Primary는 과거 Timeline에 남는다.
- Old Primary의 자동 재접속을 금지한다.
- Old Primary를 그대로 Writer로 복귀시키면 Split-brain 위험이 있다.
- Failback 전 Re-seed 또는 동기화가 필요하다.
- DR 신규 Business Write를 Freeze한 뒤 Final Write Boundary를 기록하고, 그 Boundary까지
  Primary가 Catch-up됐음을 Timeline·LSN·Business Evidence로 검증해야 한다.
- pg_rewind는 조건부 Capability(`wal_log_hints` 또는 checksum, 분기점 WAL 필요)다.
- WAL 보존과 Timeline History가 필요하며 Backup Chain은 Promotion 이후 새 Timeline을 따라야 한다.

```text
Old Primary Restart ≠ Safe Failback
```

Promotion 이후 Old Primary는 검증 없이 Writer가 될 수 없다.

### 8.57 Failback / Re-seed Boundary

#### Canonical Failback Planning Sequence

1. Mac mini Host·PostgreSQL Runtime 복구
2. PostgreSQL Version·Extension 호환 확인
3. Mac Primary 초기 Re-seed
4. Mac Database를 Read-only 상태로 기동
5. Initial Schema·Business Validation
6. Failback Cutover Window 승인
7. AWS DR Application의 신규 Business Write Freeze
8. AWS DR Database의 Final Write Boundary 기록
9. Cutover Boundary Evidence 기록
10. Mac Primary로 Final WAL/Data Catch-up
11. Final Catch-up 완료 확인
12. Timeline·LSN·Business Boundary 일치 검증
13. Mac Primary Final Read-only Validation
14. AWS DR Writer Authority 해제 승인
15. Mac Primary Promotion Approval
16. Mac Primary Writer Authority 활성화
17. Controlled Write Probe
18. Traffic Failback Approval
19. AWS DR를 Read-only 상태로 전환
20. AWS DR를 Cold 상태로 전환
21. Incident Close

Cutover Boundary Evidence 후보: Incident ID · DR Timeline Reference · Final LSN Reference ·
Last Committed Business Event Boundary · Final WAL Segment Reference · Write Freeze Time ·
Database Validation Result · Application Validation Result · Approval Owner · Audit Record.
실제 LSN 값이나 Business Data는 ADR에 기록하지 않는다.

`failback_final_sync`는 DR Write Freeze 후 Cutover Boundary를 기준으로 Final Catch-up과
Boundary Validation을 수행하는 Architecture State 후보다.

Failback Promotion 금지 조건: Final Boundary 기록 없음 · Final WAL/Data Catch-up 불완전 ·
Timeline 불일치 · LSN 또는 Business Boundary 불일치 · Primary Read-only Validation 실패 ·
DR Write가 다시 활성화됨 · Writer Authority 불명확 · Human Approval 없음.

Automatic Database Failback은 금지 후보를 유지한다. Re-seed와 Final Catch-up 방법은
`open`이다. 후보: New Base Backup · Physical Copy · pg_rewind 조건부 · Logical Migration ·
Managed Migration Tool. 이번 ADR에서 하나를 채택하지 않는다.

### 8.58 Replication Slot / WAL Retention Risk

Warm Standby 후보 분석: Replication Slot이 WAL 삭제를 막아 Disk를 소진할 가능성 · Standby 장기 단절 · WAL Retention 증가 · Slot Monitoring 필요 · Slot Drop 또는 Recovery 절차 · Archive와 Streaming의 역할 분리 · Standby 재구축 조건 · Lag Threshold · Storage Full Failure.

Replication Slot은 현재 채택 상태가 아니다. Capability와 위험으로만 기록한다(`max_slot_wal_keep_size` 완화 후보).

### 8.59 PostgreSQL Version / Extension Boundary

확인 전 `unknown`: PostgreSQL Major/Minor Version · Extension 목록/Version · Collation · Locale · Encoding · Timezone · Roles · Tablespaces · Custom Configuration · Shared Library · Native Dependency.

```text
Same Container Image ≠ Same Database Compatibility
Same PostgreSQL Major Version ≠ Extension Compatibility Verified
```

Version/Extension Inventory가 없으면 Restore Approval을 내릴 수 없다.

### 8.60 Backup Retention Candidate

Retention Concern: Base Backup 보존 수 · WAL 보존 기간 · Timeline History · Restore Point Coverage · Monthly Restore Check · Quarterly Full DR Drill · Legal/Privacy Retention · Storage Cost · Accidental Deletion · Compromised Backup · Key Rotation · Promotion 이후 Timeline.

정확한 일수·Backup 수를 확정하지 않는다.

```text
status: open / measurement_required
Retention ≠ Verified Restore Coverage
Backup Count ≠ Recoverable Point Count
```

### 8.61 Backup Integrity

검증 후보: Backup Manifest · Checksum · pg_verifybackup 또는 동등 Capability · Object Storage Integrity · File Count · Required WAL Presence · Timeline History Presence · Encryption Decryption Test · Restore Test · Schema Validation.

```text
Checksum PASS ≠ Full Restore PASS
Backup Download PASS ≠ PostgreSQL Startup PASS
PostgreSQL Startup PASS ≠ Business Consistency PASS
```

### 8.62 Monitoring Candidate

Signal 후보: Last Successful Base Backup · Last Backup Verification · Last Successful Restore · Last Archived WAL · WAL Archive Lag · Archive Failure Count · Missing WAL · Backup Storage Usage · Backup Retention Deletion · Encryption Key Availability · Replication Lag · Replication Slot Retained WAL · Primary Disk Usage · Standby Disk Usage · Current Timeline · Current Writer Authority · Last Promotion · Last Failback · RPO Estimate · RTO Drill Result.

실제 Monitoring Tool을 채택하지 않는다.

### 8.63 Audit Evidence Candidate (Data DR)

Backup/Restore/Promotion/Failback Evidence 후보: Incident ID · Backup ID Reference · Base
Backup Start/End · Backup Manifest Reference · Backup Integrity Result · Last Archived WAL ·
Restore Target · Recovery Timeline · Replayed WAL Range · Recovery Target Reached Time ·
PostgreSQL Version · Extension Inventory Reference · Database Runtime Identity · Database/
Application Read-only Validation Result · Promotion Approval/Result · Writer Authority Record ·
Write Probe Result · Failover Time · Failback Re-seed Reference · DR Final Write Boundary
Reference · Final WAL/LSN Reference · Write Freeze Time · Final Catch-up Result · Timeline/LSN/
Business Boundary Validation Result · Failback Time · Drill/Real Incident 구분 · Owner.

실제 Secret, Bucket, Account, Host, IP는 기록하지 않는다.

### 8.64 RPO Stage Analysis

| Stage | Current State |
|---|---|
| Transaction WAL 생성 | unknown |
| WAL Segment/Partial 준비 | measurement_required |
| Archive 전송 시작 | measurement_required |
| Archive 전송 완료 | measurement_required |
| Archive Object 검증 | measurement_required |
| Catalog 반영 | unknown |
| Restore 시 WAL 발견 | measurement_required |
| WAL Replay 가능성 | measurement_required |
| Restore Target 검증 | measurement_required |

```text
RPO 15분 Target ≠ Archive Process가 실행 중
RPO 15분 Target ≠ Last WAL Timestamp가 15분 이내
```

RPO 달성은 Restore Drill에서 실제 복구 시점과 Business Data를 확인해야 한다.

### 8.65 RTO Stage Analysis (Database)

| Stage | Current State |
|---|---|
| Incident Detection | measurement_required |
| Operator Acknowledgement | measurement_required |
| Primary Fencing | measurement_required |
| Backup Catalog Selection | measurement_required |
| AWS Database Runtime Provision | measurement_required |
| Base Backup Download | measurement_required |
| Base Backup Restore | measurement_required |
| WAL Replay | measurement_required |
| PostgreSQL Startup | measurement_required |
| Read-only Validation | measurement_required |
| Application Read Check | measurement_required |
| Promotion Approval | measurement_required |
| Write Probe | measurement_required |
| Traffic Failover | measurement_required |

```text
RTO 4시간 Target ≠ Σ Verified Database Stage Duration
```

정확한 시간을 발명하지 않는다. Full DR Drill 전 `target_not_verified`를 유지한다.

### 8.66 Data DR Cost Boundary

비용 Concern: Base Backup Storage · WAL Storage · Storage Request · Data Transfer · Encryption Key Service · EC2 Database Runtime · EBS Storage · EBS Snapshot · Warm Standby Compute · Monitoring · Log Retention · Restore Drill · Cross-region Copy · Managed Database.

```text
status: measurement_required
```

사용자 승인 Guardrail(§4.6과 일치): 월 DR 고정비 목표 50,000원 이하 · Hard Cap 100,000원. Incident/Drill Burst Cost는 고정비와 분리한다. 정확한 Vendor 가격은 기록하지 않는다.

### 8.67 Drill Policy Candidate

사용자 승인 Input(§4.6)을 유지한다: Monthly Restore Check · Quarterly Full DR Drill.

- **Monthly Restore Check** 후보 범위: Backup 발견 · Manifest/Integrity · Decryption 가능 · 제한된 Restore · PostgreSQL Startup · 기본 Read Check.
- **Quarterly Full DR Drill** 후보 범위: Mac Primary 장애 가정 · AWS Runtime Provision ·
  Full PostgreSQL Restore · WAL Replay · Database/Application Read-only Validation · Promotion
  Approval/실행 Simulation · Writer Authority Record · Controlled Write · Traffic Failover
  Simulation · Initial Re-seed · DR Write Freeze · Cutover Boundary · Final Catch-up/Boundary
  Validation · Primary Promotion/Traffic Failback Simulation · RTO/RPO 측정.

실제 Drill이 실행됐다고 주장하지 않는다. Drill Evidence 저장 위치는 `open`이다.

### 8.68 Integrated Recovery Problem

Mac mini Primary 전체가 사용할 수 없을 때, 어떤 Artifact·Authority·Runtime·Database·
Traffic 순서로 AWS DR 환경을 준비하고 검증해야 하며, 어떤 Evidence가 부족하면 Write
또는 Traffic 전환을 중단해야 하는가?

이 질문은 동일 승인 Release Image, Off-host Backup와 WAL, Primary Fencing, Database
Restore, Read-only Validation, Writer Authority, Application Readiness, Human Approval,
Traffic Failover, Failback/Re-seed, RTO/RPO 측정, 비용과 1인 운영 제약을 하나의 복구
흐름으로 연결한다. Logical Service와 Data Ownership은 ADR-0012~0015를 유지하며 물리
배치가 논리 소유권을 합치지 않는다.

### 8.69 Integrated Candidate Topologies

#### Candidate A — Existing Managed Application Cold DR

- Primary 후보: Mac mini + Docker Compose.
- Artifact 후보: 동일 승인 Multi-platform OCI Image와 Digest.
- Registry 후보: AWS DR 조건부 ECR, GHCR 대안.
- AWS Application 후보: ECS Fargate + ALB.
- AWS Database 후보: Application과 분리된 EC2/EBS PostgreSQL Cold Restore Runtime.
- Backup 후보: Primary 밖의 암호화 Object Storage에 Base Backup + WAL.
- Recovery 후보: Authoritative Fencing → Restore → Database/Application Read-only Validation
  → Human Promotion Approval → Promotion/Writer Authority Record → Application Write Approval.
- Traffic 후보: Cloudflare Detection + Human Approval.
- Failback 후보: Initial Re-seed/Read-only Validation → DR Write Freeze → Cutover Boundary →
  Final Catch-up/Boundary Validation → Human Promotion Approval.

평가: 기존 통합 후보이며 현재는 `retained_alternative`. Accepted가 아니며 Database EC2
Runtime도 `open`이고 `runtime_unverified`다.

#### Candidate B — Compose-aligned Application + Warm Database DR

- Primary와 AWS Application 후보: 각각 Mac mini + Docker Compose, EC2 + Docker
  Compose.
- Application Compute는 stopped 또는 Incident-time Provision 후보이며 Cloudflare Tunnel을
  EC2 Gateway에 직접 연결하고 ALB는 초기 생략 후보로 둔다.
- Database 후보: Application Host와 분리한 별도 EC2 Warm Physical Standby.
- Backup 후보: Standby와 별도로 Off-host Object Storage에 Base Backup + Continuous WAL.
- Registry 후보: GHCR first validation, ECR alternative.
- Data/Traffic 후보: Fencing 후 Human-approved Promotion/Write/Traffic.
- 장점 후보: Primary Runtime 유사성, Database 활성화 시간 단축 가능성, AWS Application
  평상시 Compute 최소화.
- 위험: Host OS/Docker/PostgreSQL Patch, Replication Lag/Slot/Disk, GHCR Pull Credential,
  Tunnel Bootstrap, Warm Compute/EBS 비용, 단일 App Host.

평가: 현재 사용자 조건에 가장 맞는 `planning_leader / first_validation_target`.
Accepted가 아니며 비용·Network·Bootstrap·Promotion·Drill Evidence가 필요하다.

#### Candidate C — Fargate Application + Warm Database

- AWS Application 후보: Fargate + ALB.
- AWS Database 후보: Warm Physical Standby.
- Backup 후보: Base Backup + WAL Archive를 Standby와 병행.
- Registry 후보: ECR/GHCR 비교.
- Traffic 후보: Human-approved Failover.

평가: Application Host 운영 부담보다 ECS Control Plane과 ALB가 단순하다는 Spike 결과가
있을 때의 `conditional` hybrid candidate.

#### Candidate D — EC2 Compose + Cold Database Restore

- AWS Application 후보: EC2 + Docker Compose.
- Database 후보: 별도 Runtime에 Cold Base Backup + WAL Restore.
- Registry 후보: GHCR/ECR 비교.
- Traffic 후보: Human-approved Failover.

평가: Compose 동등성과 낮은 평상시 Database Compute 비용을 우선할 때의
`conditional` candidate. Database Restore 시간이 Critical Path를 위협할 수 있다.

#### Deferred Candidate — Managed Primary

- Managed PostgreSQL Primary와 AWS 중심 Application Runtime 후보.
- 평가: `deferred` / initially not adopted. Primary Architecture 변경, Migration, 비용과
  운영 경계에 별도 Decision이 필요하다.

### 8.70 Integrated Topology Matrix

| Criterion | Candidate A | Candidate B | Candidate C | Candidate D |
|---|---|---|---|---|
| User RTO Target | `target_not_verified` | `target_not_verified` | `target_not_verified` | `target_not_verified` |
| PostgreSQL RPO Target | `target_not_verified` | `target_not_verified` | `target_not_verified` | `target_not_verified` |
| Fixed Cost | `measurement_required` | `measurement_required` | `measurement_required` | `measurement_required` |
| Incident Burst Cost | `measurement_required` | `measurement_required` | `medium` | `measurement_required` |
| One-person Operation | `acceptable` | `strong candidate` | `conditional` | `acceptable` |
| Primary/DR Artifact Reuse | `strong` | `strong` | `acceptable` | `acceptable` |
| Application Runtime Consistency | `acceptable` | `strong` | `acceptable` | `strong` |
| Database Recovery Speed | `measurement_required` | `strong candidate` | `strong candidate` | `measurement_required` |
| Backup Dependency | `high` | `high` | `high` | `high` |
| Continuous Replication Dependency | `low` | `high` | `high` | `low` |
| Host OS Responsibility | `medium` | `high` | `medium` | `high` |
| Container Runtime Responsibility | `low` | `high` | `medium` | `high` |
| Kubernetes Dependency | `low` | `low` | `low` | `low` |
| Registry Failure Domain | `verification_required` | `verification_required` | `verification_required` | `verification_required` |
| Backup Failure Domain | `verification_required` | `verification_required` | `verification_required` | `verification_required` |
| AWS Region Coupling | `high` | `high` | `high` | `high` |
| Cloudflare Coupling | `high` | `high` | `high` | `high` |
| Split-brain Risk | `medium` | `medium` | `high` | `medium` |
| Fencing Complexity | `high` | `high` | `high` | `high` |
| Read-only Validation | `verification_required` | `verification_required` | `verification_required` | `verification_required` |
| Promotion Complexity | `high` | `high` | `high` | `medium` |
| Failback Complexity | `high` | `high` | `high` | `high` |
| Re-seed Requirement | `high` | `high` | `high` | `verification_required` |
| Drill Complexity | `high` | `high` | `high` | `high` |
| Observability | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` |
| Auditability | `verification_required` | `verification_required` | `verification_required` | `verification_required` |
| Terraform Reproducibility | `verification_required` | `verification_required` | `verification_required` | `verification_required` |
| Current Evidence | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` |
| Blocking Verification | `blocked_by_evidence` | `blocked_by_evidence` | `blocked_by_evidence` | `blocked_by_evidence` |
| Decision Readiness | `retained_alternative` | `planning_leader` | `conditionally_viable` | `conditionally_viable` |

평가값은 상대적 Architecture Candidate 평가다. `strong`도 Runtime 성공이나 Target
달성을 의미하지 않는다.

#### 8.70.1 Final Integrated Topology Comparison

| Criterion | Topology 1 — Fargate/Cold/ECR | Topology 2 — EC2 Compose/Warm/GHCR | Topology 3 — Fargate/Warm/Measured Registry |
|---|---|---|---|
| Fixed Cost | ALB·Backup·Monitoring 측정 | Warm EC2/EBS·Backup·Monitoring 측정 | ALB+Warm DB 측정 |
| Application Recovery | Task/ALB 기동 측정 | Bootstrap/Compose/Tunnel 측정 | Task/ALB 기동 측정 |
| Database Recovery | Restore/Replay가 Critical Path | Lag 정상 시 Promotion 단축 가능 | Lag 정상 시 Promotion 단축 가능 |
| Primary Runtime Similarity / Drift | medium / Task 정의 Drift | strong / Host 차이 | medium / Task 정의 Drift |
| Control Planes / Managed Components | ECS+ALB+IAM+Cloudflare | EC2+IAM+Cloudflare+PostgreSQL | ECS+ALB+EC2 DB+IAM+Cloudflare |
| Host Responsibility | DB Restore Host | App Host+DB Host | DB Host |
| Registry / ALB | ECR first / ALB | GHCR first, ECR alt / no ALB initially | measured / ALB |
| Cloudflare Dependency | Human-approved route to ALB | Human-approved route to EC2 Tunnel | Human-approved route to ALB |
| App/DB Failure Domain | separate | separate EC2 mandatory | separate |
| RTO / RPO Potential | Restore time unknown / archive lag | Promotion candidate / replication+archive lag | Promotion candidate / replication+archive lag |
| Backup Safety | Base+WAL | Standby와 독립 Base+WAL | Standby와 독립 Base+WAL |
| Promotion / Failback | high / final-sync | high / final-sync+standby timeline | high / final-sync+standby timeline |
| One-person / MSA | Host↓, ECS 객체↑ | Runtime 모델↓, Host 책임↑ | 가장 넓은 운영 표면 |
| Terraform Complexity | ECS/ALB/DB Restore | App EC2+DB EC2+Tunnel | ECS/ALB+DB EC2 |
| Current Evidence | `runtime_unverified` | `runtime_unverified` | `runtime_unverified` |
| Verification Work | Fargate/ALB+Cold Restore | EC2 Bootstrap+Tunnel+Replication+PITR | Fargate/ALB+Replication+PITR |
| Decision Risk | Cold Restore가 RTO 위협 | Warm 비용/운영과 단일 App Host | 관리 표면과 고정비 최대 가능성 |
| Planning Result | retained alternative | planning leader / first validation | retained hybrid alternative |

#### 8.70.2 MSA Management Point Analysis

현재 Logical Service 후보는 Spring Cloud Gateway, Carelog Core, Finance Harness, Dev
Harness, Shared Identity, Shared AI와 향후 Shared Commerce/Audit Consumer다. 이 목록은
실제 동시 Runtime·Traffic·독립 Scale Evidence가 아니다.

- Registry는 Service별 Image Naming, Release/Platform Digest, Rollback, Retention,
  Permission과 CI Publish를 표준화한다. Registry는 필요하지만 ECR일 필요는 없다.
- Fargate는 Host OS/Docker Daemon, 일부 Scheduling·Restart·Scale을 줄인다. 대신
  Service별 Task Definition, ECS Service, Task/Execution Role, Network/Security Group,
  ALB/Target Group, Health, Log Group, Secret과 Deployment Definition을 늘린다.
- EC2 Compose는 Primary와 유사한 Compose/Override, Local Network, 단일 Host Debug를
  제공한다. 대신 Host Patch, Docker/Compose Version, Bootstrap, Instance Security,
  Disk/Monitoring과 Single-host Failure를 운영한다.
- 현재 Scale과 Emergency DR 조건에서는 Service 수만으로 Fargate를 우선하지 않는다.
  Multi-replica, Service별 독립 Scale, Zero-downtime Deployment 또는 Host 운영 부담이
  측정되면 Fargate를 재평가한다.

#### 8.70.3 Candidate Reframe Verdict and Re-evaluation Triggers

```text
Candidate Reframe Verdict: ADOPT_REVISED_PLANNING_LEADER
Application: EC2 + Docker Compose first validation
Database: separate EC2 Warm Physical Standby + independent Base Backup/WAL PITR first validation
Registry: GHCR first validation / ECR alternative
Entry: Cloudflare Tunnel direct to EC2 Gateway first validation
ALB: deferred until Fargate or multi-replica requirement
Traffic: automated health detection + human approval
Failback: automatic prohibited
Decision state: accepted_with_constraints for architecture direction
Production adoption readiness: verification_required
```

- EC2 Compose → Fargate: Multi-replica 지속 운영, Service별 독립 Scale, Host Patch 부담,
  Zero-downtime 배포, Bootstrap이 RTO 위협, Host 장애 증가, Fargate Spike 우위.
- Warm Standby → Cold Restore: Guardrail 초과, Replication 운영 부담, Network 불안정,
  Cold Restore Drill의 충분한 RTO, RPO 요구 완화.
- GHCR → ECR: ECS/Fargate 선택, IAM 통합 요구, GHCR Credential 부담, External Pull
  장애, 측정된 ECR Lifecycle/비용 우위.
- ALB 도입: Fargate, Multi-AZ/Replica, AWS 내부 Health Routing, Direct Tunnel 검증 실패.

위 판정은 Planning Leader 우선순위만 바꾼다. Production Adoption, Resource 존재,
비용 Guardrail 충족 또는 RTO/RPO 달성을 뜻하지 않는다.

### 8.71 End-to-end Recovery Dependency Graph

```text
Incident Detection
→ Operator Acknowledgement
→ Failure Classification
→ Primary Fencing
→ Backup/WAL Validation
→ Warm Standby Catch-up Validation
  OR Cold Database Runtime Provision → Base Backup Restore → WAL Replay
→ Database Read-only Validation
→ Application Runtime Start
→ Application Read-only Validation
→ Database Promotion Approval
→ PostgreSQL Promotion
→ Database Writer Authority Record Update
→ Application Write Enable Approval
→ Controlled Write Probe
→ Traffic Failover Approval
→ DR Active
```

| Stage | Inputs | Required Evidence | Owner | Blocks | State |
|---|---|---|---|---|---|
| Incident Detection | Health·Operator Signal | Timestamped Detection | Automated System observation | Acknowledgement | `runtime_unverified` |
| Operator Acknowledgement | Detection | Operator Ack | 박성환 | Classification | `not_run` |
| Failure Classification | Correlated Signals | Failure Class와 영향 | 박성환 | Fencing | `verification_required` |
| Primary Fencing | Classification | Authoritative Mechanism 또는 독립 Write-impossibility Proof | 박성환 | Writer transfer | `verification_required` |
| Backup/WAL Validation | Catalog·Manifest·WAL | Integrity, Gap, decryptability | 박성환 | Standby/PITR safety | `runtime_unverified` |
| Warm Standby Catch-up Validation | Streaming/Archive/Version Inventory | Lag, final received/replayed boundary, Timeline | 박성환 | DB Validation | `not_run` |
| Cold Database Runtime Provision (alternative) | IaC·Version Inventory | Runtime Identity, Version, Extension | 박성환 | Base Restore | `planning_candidate` |
| Base Backup Restore (alternative) | Selected Backup | Restore Log, Manifest match | 박성환 | WAL Replay | `not_run` |
| WAL Replay (alternative) | Required WAL range | Gap-free Replay, Timeline | 박성환 | DB Validation | `not_run` |
| Database Read-only Validation | Restored Cluster | Recovery-safe Read-only, Schema, Critical Read | 박성환 | App Start | `not_run` |
| Application Runtime Start | DB Read-only Validation+Digest·Config·Secret | 강제 Read-only Runtime Evidence | 박성환 | App Validation | `runtime_unverified` |
| Application Read-only Validation | App+DB read-only | Query, Business Read, Schema Compatibility | 박성환 | Promotion Approval | `not_run` |
| Database Promotion Approval | Fencing+DB/App Validation | Approval Record | 박성환 | Promotion | `verification_required` |
| PostgreSQL Promotion | Promotion Approval | Promotion Result·Timeline | 박성환 | Authority Record | `not_run` |
| Database Writer Authority Record Update | Promotion Result | Single Writer·Timeline·Approval Evidence | 박성환 | App Write Approval | `verification_required` |
| Application Write Enable Approval | Authority Record inputs | Single Writer Evidence와 별도 Approval | 박성환 | Write Probe | `verification_required` |
| Controlled Write Probe | Approved DR Writer | Write·Readback·Audit Result | 박성환 | Traffic Approval | `not_run` |
| Traffic Failover Approval | All prior Evidence | Target, Rollback, Human Approval | 박성환 | DR Active | `verification_required` |
| DR Active | Traffic switched | User Recovery Confirmation | 박성환 | Incident operation | `blocked_by_evidence` |

Failback Dependency 후보는 Primary Runtime 복구 → Initial Re-seed/Read-only Validation →
Cutover Window 승인 → DR Write Freeze → Final Write/Cutover Boundary 기록 →
`failback_final_sync` → Timeline·LSN·Business Boundary Validation → Primary Final Read-only →
DR Writer Authority 해제/Primary Promotion 승인 → Primary Authority 활성화/Controlled Write →
Traffic Failback → DR Read-only/Cold → Incident Close 순서를 보존한다.

```text
Application Runtime은 Database Validation을 건너뛰지 않는다.
Application Read-only Validation은 Database Promotion보다 먼저 수행한다.
Database Promotion은 Application Write Approval을 대체하지 않는다.
Traffic Failover는 Writer Authority 이전을 대체하지 않는다.
Health Check는 Fencing을 대체하지 않는다.
Restore 완료는 Promotion 승인을 대체하지 않는다.
```

### 8.72 RTO Critical Path Candidate

| Stage | Duration | Parallelizable | Blocking Dependency | Evidence Required | Drill Measurement Required |
|---|---|---|---|---|---:|
| 1. Detection | `unknown / measurement_required` | No | Incident 발생 | Detection timestamp | Yes |
| 2. Operator Acknowledgement | `unknown / measurement_required` | No | Detection | Ack timestamp | Yes |
| 3. Classification | `unknown / measurement_required` | Partially | Ack | Correlated failure evidence | Yes |
| 4. Fencing | `unknown / measurement_required` | Partially | Classification | Authoritative mechanism/proof evidence | Yes |
| 5. Application Runtime Preparation | `unknown / measurement_required` | Yes | Incident declaration | EC2 Bootstrap/Image/Tunnel evidence | Yes |
| 6. Warm Standby Catch-up Validation | `unknown / measurement_required` | Partially | Fencing+replication evidence | Lag/received/replayed boundary | Yes |
| 7. Cold PITR Fallback Preparation | `unknown / measurement_required` | Yes | Standby 불가 또는 PITR 선택 | Backup integrity/runtime evidence | Yes |
| 8. Cold Base Restore/WAL Replay (alternative) | `unknown / measurement_required` | No | Fallback 선택 | Restore/WAL continuity/timeline | Yes |
| 9. Database Validation | `unknown / measurement_required` | No | Standby catch-up 또는 Replay | DB read evidence | Yes |
| 10. Application Startup | `unknown / measurement_required` | No | DB read-only validation | Digest/config/forced read-only | Yes |
| 11. Application Validation | `unknown / measurement_required` | No | Startup | Query/business read evidence | Yes |
| 12. Promotion Approval | `unknown / measurement_required` | No | Fencing+DB/App validation | Human approval | Yes |
| 13. Promotion/Authority Record | `unknown / measurement_required` | No | Promotion approval | Timeline/single-writer record | Yes |
| 14. Application Write Approval/Probe | `unknown / measurement_required` | No | Authority record | Approval/write/readback result | Yes |
| 15. Traffic Switch | `unknown / measurement_required` | No | Probe+approval | Traffic audit | Yes |

RTO 4시간은 위 Stage의 Drill 측정 전 `target_not_verified`다. 정확한 시간이나 병렬화
효과를 발명하지 않는다.

### 8.73 Parallelization Boundary

병렬 준비 후보: EC2 Application Bootstrap · Image Pull · Warm Standby Lag/Timeline 확인 ·
Backup Catalog 확인 · Secret/Configuration 확인 · Operator Evidence 준비 · Fargate/ALB
대안 Definition 준비.

직렬 Gate: Authoritative Fencing 또는 독립 Write-impossibility Proof 이전 Write Enable 금지 ·
Warm Standby Catch-up 또는 Cold Base Restore 이후 WAL Replay · Database Read-only Validation 이후 Application 강제 Read-only
Validation · Application Read-only Validation 이후 Promotion Approval/실행 · Writer Authority
Record 이후 Application Write Approval · Controlled Write 이후 Traffic Failover.

```text
Parallel Preparation ≠ Parallel Writer Activation
```

Terraform Dependency Graph의 병렬 실행 Capability도 Writer Authority Gate를 자동으로
만족시키지 않는다.

### 8.74 Abort / Stop Conditions

| Condition | Automatic Stop | Human Review | Allowed Fallback | Write Allowed |
|---|---:|---:|---|---:|
| Primary Fencing 불확실 | Yes | Required | Maintenance, 추가 격리 | No |
| Supporting Action/Observation만 있고 Authoritative Fencing 없음 | Yes | Required | 추가 Mechanism/독립 Evidence | No |
| Backup Manifest 불일치 | Yes | Required | 다른 검증 Backup | No |
| WAL Gap | Yes | Required | 이전 Recovery Point 재선택 | No |
| Restore Target 불명확 | Yes | Required | Target Evidence 재수집 | No |
| PostgreSQL Version 불일치 | Yes | Required | 호환 Runtime 재구성 | No |
| Extension 누락 | Yes | Required | Extension 설치·재복구 | No |
| Schema/Migration 불일치 | Yes | Required | 승인 Digest/Schema 재선택 | No |
| Database Read Validation 실패 | Yes | Required | 재복구 또는 Maintenance | No |
| Business Read Validation 실패 | Yes | Required | 재복구 또는 Partial Maintenance | No |
| Secret/Configuration 불일치 | Yes | Required | Version 재선택 | No |
| Image Digest 불일치 | Yes | Required | 승인 Digest 재확보 | No |
| Controlled Write 실패 | Yes | Required | DR Write Freeze·조사 | No |
| Human Approval 없음 | Yes | Required | Maintenance | No |
| Writer Authority 불명확 | Yes | Required | Authority 재구성 | No |
| Cloudflare Target만 Healthy이고 Database Evidence 없음 | Yes | Required | Maintenance/Manual Review | No |
| Operator가 상황을 확정할 수 없음 | Yes | Required | Maintenance/지원 안내 | No |
| Final Boundary 기록 없음 | Yes | Required | DR Write Freeze 유지·Evidence 재수집 | No |
| Final WAL/Data Catch-up 불완전 | Yes | Required | Final Sync 재개 | No |
| Timeline 불일치 | Yes | Required | Re-seed/Sync 방식 재검토 | No |
| LSN 또는 Business Boundary 불일치 | Yes | Required | Boundary 재검증 | No |
| Primary Final Read-only Validation 실패 | Yes | Required | Primary 재동기화/검증 | No |
| Failback Freeze 후 DR Write 재활성화 | Yes | Required | 새 Boundary 기록·Final Sync 재실행 | No |

Unknown 상태에서는 Write를 금지하고 Traffic은 Maintenance 또는 Manual Review 후보로
제한한다. Unknown Evidence를 소비해 Candidate를 승격하거나 Architecture Decision을
승인하지 않는다.

### 8.75 Maintenance / Degraded Mode Candidates

| Mode | Purpose | Writer Authority | Runtime State |
|---|---|---|---|
| Full Maintenance | 불확실한 복구 중 모든 Business 처리 중단 | Not granted | `runtime_unverified` |
| Read-only Service | 검증된 Read만 제한 제공 | Not granted | `runtime_unverified` |
| Partial Product Availability | 복구된 무상태 기능만 제한 제공 | Scope-specific, open | `runtime_unverified` |
| Static Status Page | Recovery 상태와 안내 제공 | Not applicable | `runtime_unverified` |
| Manual Resume / Support Guidance | Operator 승인 후 재개 경로 안내 | Not granted | `runtime_unverified` |
| Retry-after Response | 일시적 재시도 신호 | Not granted | `runtime_unverified` |

```text
Partial Availability ≠ DR Complete
Read-only Service ≠ Writer Authority Granted
```

사용자 UX와 제공 Mode는 Slice 6에서 채택하지 않는다.

### 8.76 Integrated Failure Domain Map

| Failure Domain | Primary Impact | DR Impact | Shared Coupling | Mitigation Candidate |
|---|---|---|---|---|
| Mac mini Host | Primary 전체 중단 | 직접 영향 없음 후보 | Primary App+DB 결합 가능 | Off-host Artifact/Backup |
| Local Power | Primary 중단 | 직접 영향 없음 후보 | Router·Host 동시 중단 | AWS DR, 외부 Detection |
| Local Network | Traffic/Archive 중단 | 최신 WAL Gap 가능 | Tunnel·Backup 전송 | Lag 관찰, Manual Review |
| Router | Primary 접근 중단 | Fencing 불확실 가능 | Local Network | 독립 Fencing Evidence |
| Cloudflare Account | Traffic Control 상실 | DR 전환 불가 | Primary/DR 공통 Provider | Break-glass·Account Review |
| Cloudflare Network | Public Traffic 영향 | DR도 영향 | 단일 Edge Provider | Maintenance, 대안은 open |
| AWS Account | DR 전체 영향 | DR 불가 | ECR·ECS·ALB·EC2·S3·IAM | IAM/Account Boundary |
| AWS Region | DR 전체 영향 | DR 불가 | ECR+ECS+ALB+EC2+EBS | Cross-region `deferred` |
| VPC | DR 통신 중단 | App/DB 접근 불가 | ALB·ECS·EC2 | Terraform·Network Drill |
| ALB | Application ingress 중단 | Traffic 수용 불가 | ECS Target | Health+Fallback 설계 |
| ECS/Fargate | DR App 중단 | Candidate A 영향 | ECR·IAM·VPC | EC2 alternative |
| EC2 | DB 또는 Compose DR 중단 | Candidate A/B/C 영향 | Host OS·EBS | App/DB Host 분리 |
| EBS | PostgreSQL Storage 영향 | Restore/DB 중단 | EC2 AZ/Region | Backup 재복구 |
| ECR | Image Pull 중단 | ECS/EC2 Start 지연 | AWS Account/Region/IAM | GHCR alternative, digest export |
| GHCR | Image Pull 중단 | Alternative 경로 중단 | GitHub Account/Network | ECR conditional |
| S3/Object Storage | Backup/WAL 접근 중단 | Restore 불가 | Region·IAM·Key | Retention·복제는 open |
| IAM | AWS 작업 중단 | Provision/Pull/Restore 불가 | AWS 전체 Control Plane | 최소권한·break-glass |
| Encryption Key | Backup Decrypt 불가 | Restore 불가 | Backup와 Key 결합 위험 | 분리 보관·복구 시험 |
| DNS | 사용자 경로 중단 | Traffic Switch 지연 | Cloudflare/Registrar | 상태 페이지·Manual Review |
| Operator | 승인/판단 중단 | RTO 초과 가능 | 단일 인물 Authority | Future delegated operator |
| Repository/CI | Build/IaC 접근 중단 | Bootstrap 지연 | Image/Config/Plan | 승인 Digest·Artifact 보존 |
| Registry Credential | Pull 중단 | Runtime Start 불가 | Registry/IAM | Versioned break-glass |
| Backup Credential | Backup/WAL 접근 중단 | Restore 불가 | Object Store/IAM | 분리 Owner·복구 시험 |

ECR+ECS+ALB의 같은 Region 결합, Cloudflare 단일 Provider 결합, 단일 Operator 의존,
Backup Data와 Decryption Key 결합을 Decision 전 검증한다. Primary와 Registry, Primary와
유일 Backup은 같은 Host에 두지 않는다. Application과 PostgreSQL을 같은 EC2에 합치면
Host Failure Domain이 다시 결합되므로 초기 후보에서 분리한다. Cross-region은
`deferred`다.

### 8.77 Trust / Authority Boundary

| Authority | Current Owner | Future Candidate | Automated System Boundary |
|---|---|---|---|
| Architecture Decision Authority | 박성환 | Future delegated reviewer | Evidence collection only |
| Incident Declaration Authority | 박성환 | Future delegated operator | Detection only |
| Primary Fencing Authority | 박성환 | Future delegated operator | Non-destructive validation only |
| Backup Selection Authority | 박성환 | Future delegated operator | Catalog/Integrity evidence only |
| Restore Target Authority | 박성환 | Future delegated operator | Candidate calculation only |
| Database Promotion Authority | 박성환 | Future delegated operator | Never initial owner |
| Application Write Enable Authority | 박성환 | Future delegated operator | Never initial owner |
| Traffic Failover Authority | 박성환 | Future delegated operator | Health observation only |
| Failback Authority | 박성환 | Future delegated operator | Preparation only |
| Incident Close Authority | 박성환 | Future delegated operator | Evidence collection only |

Automated System 후보 범위는 Detection, Evidence Collection, Health Observation,
Runtime Preparation과 Non-destructive Validation까지다. Database Writer Promotion,
Write Authority Transfer, Traffic Failover Final Approval, Automatic Failback과 Incident
Close를 초기 Candidate에서 소유하지 않는다.

### 8.78 Integrated Human Authority Matrix

기존 §12 Human Authority Matrix와 Database Authority Matrix를 삭제하지 않고 다음
End-to-end Projection으로 연결한다.

| Action | Automated Signal | Human Decision | Required Evidence | Owner | Audit Required |
|---|---|---|---|---|---:|
| Incident Declare | Health/Operator Signal | Required | Detection·Ack | 박성환 | Yes |
| Primary Unavailable 판정 | Correlated Signals | Required | Failure Classification | 박성환 | Yes |
| Primary Fencing | Mechanism/Observation Evidence | Required | Authoritative Mechanism 또는 독립 Write-impossibility Proof | 박성환 | Yes |
| Backup 선택 | Catalog/Integrity | Required | Manifest·Decrypt·WAL Range | 박성환 | Yes |
| Restore Target 선택 | Candidate boundary | Required | Business/WAL boundary | 박성환 | Yes |
| Database Restore 시작 | Runtime readiness | Required | Incident·Backup·Target | 박성환 | Yes |
| Database Read-only 승인 | DB validation | Required | Version·Extension·Schema·Read | 박성환 | Yes |
| Application Read-only 승인 | App readiness | Required | Digest·Config·Business Read | 박성환 | Yes |
| Database Promotion 승인 | DB/App validation passed | Required | Fencing+Restore+DB/App Read-only+Timeline | 박성환 | Yes |
| PostgreSQL Promotion | Approval present | Required | Promotion Approval·Result·Timeline | 박성환 | Yes |
| Writer Authority Record 갱신 | Promotion result | Required | Single Writer·Timeline·Approval | 박성환 | Yes |
| Write Credential 활성화 | None | Required | Writer Authority Record+별도 App Write Approval | 박성환 | Yes |
| Controlled Write Probe 승인 | Write readiness | Required | Single Writer·Rollback Target | 박성환 | Yes |
| Traffic Failover 승인 | Target Health | Required | Probe+Traffic Gate | 박성환 | Yes |
| Failback 시작 | Primary recovery signal | Required | Incident/DR Authority | 박성환 | Yes |
| Primary Re-seed | Re-seed progress | Required | Source Timeline·Method | 박성환 | Yes |
| Failback Cutover Window 승인 | Read-only validation | Required | Initial Re-seed·Schema·Business Read | 박성환 | Yes |
| DR Write Freeze | None | Required | Freeze·Credential Evidence | 박성환 | Yes |
| Final Write/Cutover Boundary 기록 | WAL/Business signal | Required | Timeline·LSN·Business Boundary Reference | 박성환 | Yes |
| Final Catch-up·Boundary Validation | Sync progress | Required | Catch-up Result·Timeline/LSN/Business Match | 박성환 | Yes |
| DR Writer Authority 해제 | Final validation passed | Required | Final Primary Read-only·DR Freeze | 박성환 | Yes |
| Primary Promotion | Authority release approved | Required | Final Sync+Primary Promotion Approval | 박성환 | Yes |
| Traffic Failback 승인 | Primary readiness | Required | Write Probe+Rollback Target | 박성환 | Yes |
| Incident Close | Evidence completeness | Required | Final Authority·Timeline·Findings | 박성환 | Yes |

### 8.79 Integrated Writer Authority Record Candidate

| Field | Purpose |
|---|---|
| `incident_id` | Incident 상관관계 |
| `authority_state` | Single Writer 상태 |
| `active_environment` | 현재 활성 환경 참조 |
| `database_identity_reference` | Database Runtime Identity 참조 |
| `timeline_reference` | PostgreSQL Timeline 참조 |
| `application_release_digest` | 승인 Release Digest |
| `configuration_version_reference` | Configuration Version 참조 |
| `secret_version_reference` | Secret Version 참조 |
| `fencing_evidence_reference` | Primary/DR Fencing Evidence 참조 |
| `restore_evidence_reference` | Backup·WAL·Restore Evidence 참조 |
| `validation_evidence_reference` | DB/App Validation 참조 |
| `final_write_boundary_reference` | Failback DR Final Write/Cutover Boundary 참조 |
| `final_wal_reference` | Final Catch-up 대상 WAL/LSN 참조 |
| `final_sync_validation_reference` | Timeline·LSN·Business Boundary 일치 Evidence 참조 |
| `approved_by` | Human Approver |
| `approved_at` | Approval Timestamp |
| `superseded_authority_reference` | 직전 Authority Record 참조 |
| `failback_state` | Failback 진행 상태 |

이는 Architecture Candidate이며 구현된 Schema가 아니다. 실제 Secret, Host, IP,
Domain, Account ID를 기록하지 않는다.

State 후보: `primary_authoritative` · `authority_unknown` · `primary_fenced` ·
`dr_read_only` · `dr_promotion_pending` · `dr_authoritative` · `failback_pending` ·
`dr_write_frozen` · `failback_final_sync` · `primary_read_only` · `primary_promotion_pending` ·
`primary_authoritative_restored` · `incident_closed`.

### 8.80 Write Authority Transition Matrix

| From | To | Required Evidence | Human Approval | Forbidden When |
|---|---|---|---:|---|
| `primary_authoritative` | `authority_unknown` | Incident declaration | Yes | Incident 근거 없음 |
| `authority_unknown` | `primary_fenced` | Authoritative Mechanism 또는 독립 Write-impossibility Proof | Yes | Supporting Action/Observation만 존재 |
| `primary_fenced` | `dr_read_only` | Restore+Read-only Startup | Yes | Backup/WAL/Version 불일치 |
| `dr_read_only` | `dr_promotion_pending` | DB·Application 강제 Read-only·Business Read Validation | Yes | Validation 실패 |
| `dr_promotion_pending` | `dr_authoritative` | Promotion Approval+실행+Authority Record | Yes | 다른 Writer 가능/Record 불완전 |
| `dr_authoritative` | `failback_pending` | Primary 복구 계획 | Yes | Incident 안정화 전 |
| `failback_pending` | `dr_write_frozen` | Initial Re-seed/Read Validation+Cutover 승인+DR Write Freeze | Yes | DR 신규 Write 지속 |
| `dr_write_frozen` | `failback_final_sync` | Final Write/Cutover Boundary Record | Yes | Boundary 없음/DR Write 재활성화 |
| `failback_final_sync` | `primary_read_only` | Final Catch-up+Timeline/LSN/Business Boundary Validation | Yes | Catch-up/Boundary 불일치 |
| `primary_read_only` | `primary_promotion_pending` | Final Primary Read Validation+DR Authority 해제 승인 | Yes | Schema/Business Read 실패/DR Writer 가능 |
| `primary_promotion_pending` | `primary_authoritative_restored` | Primary Promotion Approval+Authority 활성화+Write Probe | Yes | DR Writer Authority 잔존 |
| `primary_authoritative_restored` | `incident_closed` | Traffic Failback+Evidence 보존 | Yes | 미해결 Finding |

동시에 두 `authoritative` Writer 상태가 존재해서는 안 된다. 상태 전이 Record가
불완전하면 `authority_unknown`으로 취급하고 Write를 금지한다.
`dr_authoritative` 전이는 Database Writer Authority를 나타내며 Application Write는 별도
Approval 전까지 비활성 상태를 유지한다.

### 8.81 Failover Timeline Candidate

| Point | Event | Audit Evidence Candidate |
|---|---|---|
| T0 | Detection | Detection timestamp/source |
| T1 | Operator Acknowledgement | Ack record |
| T2 | Primary Fenced | Fencing reference |
| T3 | Backup Selected | Backup/manifest reference |
| T4 | Database Runtime Ready | Runtime identity/version |
| T5 | Base Restore Complete | Restore log |
| T6 | WAL Replay Complete | WAL range/timeline |
| T7 | Database Validation Complete | Read-only validation |
| T8 | Application Read-only Ready | Digest/readiness/business read |
| T9 | Promotion Approved/Executed, Authority Recorded | Approval/result/timeline/authority record |
| T10 | Write Probe Passed | Write/readback evidence |
| T11 | Traffic Switched | Traffic approval/change reference |
| T12 | User Recovery Confirmed | User-facing validation |

RTO 측정 후보는 `T12 - T0`다. 각 Timestamp는 Audit Evidence 후보이며 Full Drill 전
검증된 RTO 값이 아니다.

Failback 측정 후보 순서: F0 Initial Re-seed/Read-only Validation 완료 → F1 Cutover Window
승인 → F2 DR Write Freeze → F3 Final Write/Cutover Boundary 기록 → F4 Final Catch-up 완료 →
F5 Timeline·LSN·Business Boundary Validation 완료 → F6 Primary Final Read-only 완료 → F7 DR
Writer Authority 해제/Primary Promotion 승인 → F8 Primary Authority/Write Probe 완료 → F9
Traffic Failback → F10 Incident Close. 정확한 Duration은 `measurement_required`다.

### 8.82 RPO Evidence Candidate

- Last Committed Business Event Time
- Last Required WAL Generation Time
- Last Archived WAL Completion Time
- Last Recoverable WAL Sequence
- Restore Target Time
- Restored Business Event Time
- Missing Segment Check
- Timeline Reference
- Drill-measured Data Loss Window

```text
Last Archived Time ≠ Verified Business Recovery Point

RPO candidate measurement
= Incident Data Boundary - Verified Restored Business Boundary
```

Incident Data Boundary와 Business Event의 정확한 계산·상관 방식은 `open`이고 Drill
Evidence가 필요하다.

### 8.83 Integrated Drill Matrix

| Drill | Scope | Destructive | Production Traffic | Measures RTO | Measures RPO | Frequency Candidate |
|---|---|---:|---:|---:|---:|---|
| Backup Presence Check | Catalog·Base·WAL 존재 | No | No | No | No | Monthly Restore Check |
| Backup Integrity Check | Manifest·Decrypt·Gap | No | No | No | Partially | Monthly Restore Check |
| Limited Restore Check | 제한 Restore·Startup·Read | Isolated only | No | Partially | Partially | Monthly Restore Check |
| Full Database Restore Drill | Full Base+WAL+Validation | Isolated only | No | Yes | Yes | Quarterly Full DR Drill |
| Application Read-only Drill | Digest·Config·Business Read | No | No | Yes | No | Quarterly Full DR Drill |
| Traffic Failover Simulation | Health·Approval·Synthetic switch | Approval required | Open | Yes | No | Quarterly Full DR Drill |
| Writer Authority Transfer Simulation | Authoritative Fencing·DB/App Read-only·Promotion·Record | Approval required | No | Yes | No | Quarterly Full DR Drill |
| Full Failback/Re-seed Drill | Initial Re-seed·Freeze·Boundary·Final Catch-up·Validation·return | Isolated only | Open | Yes | Partially | Quarterly/Event-driven |
| Security Credential Loss Drill | Registry/Backup/Key access loss | No real destruction | No | Partially | Partially | Event-driven Drill |
| Operator Unavailable Tabletop | Escalation·Maintenance decision | No | No | Partially | No | Before Major Architecture Change |

Monthly/Quarterly는 승인 Input으로 유지한다. 나머지 Frequency는 Candidate이며 Backup,
Runtime 또는 Major Architecture 변경 후 Event-driven Drill을 검토한다.

### 8.84 Monthly Restore Check Scope

최소 후보: Backup Catalog 발견 · Base Backup 존재 · Manifest/Integrity 확인 ·
Decryption 가능 · Required WAL 범위 확인 · 제한된 Restore · PostgreSQL Startup · Schema
Version 확인 · Critical Read Query · Evidence 기록.

Monthly Check만으로 Full Traffic Failover, Writer Promotion, Full RTO, Full RPO와
Failback은 검증되지 않는다.

### 8.85 Quarterly Full DR Drill Scope

최소 후보: Primary Host Loss 가정 · Detection · Operator Acknowledgement · Fencing
Simulation 또는 승인된 실제 격리 · AWS Runtime Provision · Image Pull · Full PostgreSQL
Restore · WAL Replay · Database Read-only Validation · Application 강제 Read-only Startup과
Critical Business Read · Promotion Approval/실행 Simulation · Writer Authority Record · 별도
Application Write Approval · Controlled Write · Traffic Failover Simulation · RTO 측정 · RPO
측정 · Initial Re-seed/Read-only Validation · DR Write Freeze · Cutover Boundary 기록 · Final
WAL/Data Catch-up · Timeline/LSN/Business Boundary Validation · Primary Promotion/Traffic
Failback Simulation · Incident Close Evidence.

실제 Production Traffic 사용 여부는 `open`이며 별도 승인 없이는 사용하지 않는다.

### 8.86 Drill Safety Boundary

금지 또는 별도 승인이 필요한 행위: 실제 Production Writer 중복 생성 · Production
Credential 무승인 폐기 · 실제 Traffic 무승인 전환 · Backup Retention 삭제 · 실제
Encryption Key 폐기 · Production Database Promotion · Production Data Directory 덮어쓰기 ·
실제 DNS/Cloudflare 무승인 변경.

Drill에서도 Supporting Containment Action/Observation만으로 Production DR Write를
허용하거나, Failback Final Synchronization Gate를 생략해 Production Primary를
Promotion해서는 안 된다.

Drill Mode 후보: Isolated Sandbox · Dedicated AWS DR Environment · Read-only Restore ·
Synthetic Traffic · Controlled Maintenance Window. Slice 6에서 하나를 채택하지 않는다.

### 8.87 Drill Evidence Schema Candidate

| Field | Purpose |
|---|---|
| `drill_id`, `drill_type` | Drill 식별과 유형 |
| `started_at`, `completed_at` | 전체 측정 경계 |
| `scope` | 포함·제외 범위 |
| `source_backup_reference` | Source Backup 참조 |
| `restore_target_reference` | 복구 목표 참조 |
| `application_release_digest` | 실행 Artifact Digest |
| `database_version_reference` | PostgreSQL Version 참조 |
| `extension_inventory_reference` | Extension Inventory 참조 |
| `rto_measurement`, `rpo_measurement` | 측정 결과와 단위 |
| `stage_measurements` | Critical Path 단계별 결과 |
| `failed_stage` | 실패 단계 |
| `findings` | 발견 사항 |
| `remediation_owner` | 후속 조치 Owner |
| `next_due` | 다음 점검 후보일 |
| `approved_by` | 승인자 |
| `evidence_location_reference` | Evidence Store 참조 |

이는 Architecture Candidate이며 실제 Evidence Store는 `open`이다.

### 8.88 Decision Readiness Matrix

| Area | Current State | Evidence Available | Blocking Evidence | Decision Ready |
|---|---|---|---|---|
| Primary Runtime | `runtime_unverified` | Planning comparison | Host/runtime inventory | `blocked_by_runtime_discovery` |
| Image Architecture | `planning_leader` | Official capability | Product build/test | `partially` |
| Registry | `planning_leader / GHCR first validation` | Official capability | Account/ownership/auth/cost | `partially` |
| AWS Application Runtime | `planning_leader / EC2 Compose first validation` | Official capability | EC2/Fargate prototype | `blocked_by_runtime_discovery` |
| Traffic Failover | `approved_target` | Human direction/invariant | Current traffic state | `partially` |
| Primary Fencing | `verification_required` | Invariant | Mechanism/proof | `no` |
| Read-only Mode | `runtime_unverified` | Validation requirement | Implementation/prototype | `no` |
| PostgreSQL Backup | `runtime_unverified` | Official capability | Design/prototype | `no` |
| WAL Archive | `runtime_unverified` | Official capability | Gap/lag evidence | `no` |
| Restore Runtime | `planning_leader / warm standby first validation` | Official capability | inventory/network/cost/drill | `no` |
| Promotion | `verification_required` | Invariant | Procedure/drill | `blocked_by_drill` |
| Writer Authority | `planning_candidate` | State/record candidate | Storage/control design | `blocked_by_security_design` |
| Failback/Re-seed | `verification_required` | Boundary/candidate order | Full drill | `blocked_by_drill` |
| Cloudflare | `runtime_unverified` | Official capability | Account/config discovery | `blocked_by_runtime_discovery` |
| IAM | `runtime_unverified` | Role boundary candidate | Account/IAM design | `blocked_by_security_design` |
| Secret Management | `runtime_unverified` | Version reference candidate | Storage/rotation/recovery | `blocked_by_security_design` |
| Terraform | `planning_candidate` | Official capability | State/provider/spike | `partially` |
| Monitoring | `runtime_unverified` | Signal requirements | Runtime observability | `no` |
| Cost | `measurement_required` | Approved guardrail | Resource/usage estimate | `blocked_by_cost_measurement` |
| Monthly Drill | `approved_target / not_run` | Scope defined | Restore evidence | `blocked_by_drill` |
| Quarterly Drill | `approved_target / not_run` | Scope defined | Full DR evidence | `blocked_by_drill` |
| RTO | `target_not_verified` | 4-hour target | Stage/full drill measurement | `blocked_by_drill` |
| RPO | `target_not_verified` | 15-minute target | WAL/business boundary measurement | `blocked_by_drill` |

### 8.89 Verified and Unverified Boundary

Architecture Level에서 확인된 것: User-approved Cost/RTO/RPO Target · Human-approved
Failover 방향 · Existing ADR Preservation · Planning Leader 후보 · Failure Domain과
Invariant · 필요한 Test/Drill 종류 · Authority Boundary.

아직 확인되지 않은 것: 실제 Mac mini Hardware · 실제 Docker/Compose Runtime · 실제
PostgreSQL Host/Version · Database Size · WAL Rate · Backup 존재 · WAL Archive 존재 · AWS
Account/IAM · EC2 Compose Bootstrap · GHCR Private Pull · Warm Standby Network/Lag ·
Fargate/ALB 대안 호환성 · Cloudflare 실제 구성 ·
Fencing 구현 · Read-only 구현 · Restore 성공 · Promotion 성공 · Cost · RTO/RPO.

### 8.90 Production Adoption Evidence Gates

| # | Blocker | Classification |
|---:|---|---|
| 1 | Runtime Inventory | `runtime_discovery_required` |
| 2 | PostgreSQL Version/Extension Inventory | `runtime_discovery_required` |
| 3 | Database Size/WAL Measurement | `measurement_required` |
| 4 | Backup/Archive Prototype | `implementation_required` |
| 5 | Warm Standby/Cold Restore 비용·복구 비교 | `measurement_required` |
| 6 | Authoritative Fencing Mechanism과 독립 Proof 기준 | `architecture_decision_required` |
| 7 | Read-only Mechanism | `architecture_decision_required` |
| 8 | Writer Authority Storage/Control과 Failback Final Sync Gate | `architecture_decision_required` |
| 9 | AWS Account/IAM Boundary | `runtime_discovery_required` |
| 10 | Cloudflare Current State | `runtime_discovery_required` |
| 11 | Image Compatibility | `implementation_required` |
| 12 | Cost Estimate | `measurement_required` |
| 13 | Monthly Restore Evidence | `drill_required` |
| 14 | Quarterly Full DR Drill Evidence | `drill_required` |
| 15 | RTO/RPO Measurement | `measurement_required` |
| 16 | Production Security Review | `independent_review_required` |

### 8.91 Post-direction Allowed and Prohibited Work

Architecture Direction 승인 후 허용된 Evidence 작업: Runtime Inventory · Cost Estimate · AWS Account/
IAM Discovery · Cloudflare State Discovery · PostgreSQL Inventory · Isolated Backup
Prototype · Isolated Restore Drill · Image Compatibility Test · Terraform Spike · Read-only
Mechanism Spike · Fencing Design · Evidence Schema Design. 실제 Production 변경은 별도
Jira와 승인에 의해서만 가능하다.

Production Adoption 승인 전 금지: Production Primary 변경 · Production Database Migration · RDS
Primary 전환 · Automatic Failover/Failback 활성화 · Cloudflare Traffic 정책 변경 ·
Production Credential 폐기 · Production Backup Retention 삭제 · Writer Promotion 자동화 ·
RTO/RPO 달성 표현 · Production Adoption 완료 표현 · PR Merge 전 RPL-42 완료 전환.

### 8.92 Integrated Decision Candidate Summary

```text
Current integrated planning candidate:
- Mac mini Primary: Docker Compose
- Artifact: Multi-platform OCI Image
- Registry: GHCR first validation, ECR alternative
- AWS Application DR: EC2 + Docker Compose first validation, separate from Database Host
- AWS Entry: Cloudflare Tunnel direct to EC2 Gateway first validation, ALB initially omitted
- AWS Database DR: separate EC2 Warm Physical Standby first validation
- Data Safety: independent Base Backup + Continuous WAL Archive/PITR retained
- Traffic: Health Detection + Human Approval
- Write: Fencing + Read-only Validation + Human Promotion Approval
- Failback: Re-seed + Human Approval
- Drill: Monthly Restore Check + Quarterly Full DR Drill
- IaC: Terraform planning candidate
- Kubernetes: deferred
- Automatic Failover: deferred / not recommended initially
- Automatic Failback: prohibited initial candidate
- Managed PostgreSQL Primary: deferred

Decision state: accepted_with_constraints for architecture direction
Production adoption readiness: verification_required
```

### 8.93 Integrated Alternatives Summary

| Alternative | State | Boundary |
|---|---|---|
| ECS Fargate + ALB Application DR | conditional alternative | Managed Runtime/Scale/ALB Spike 우위 시 |
| Cold Base Backup + WAL Restore | conditional alternative | Warm 비용·운영 부담 또는 Network가 부적합할 때 |
| ECR | conditional alternative | ECS/Fargate/IAM 통합이 우선일 때 |
| Incident-created ALB | conditional alternative | Direct Tunnel 또는 persistent ALB가 부적합할 때 |
| Managed PostgreSQL Primary | deferred | Primary Migration Decision 필요 |
| EKS | deferred | ADR-0015 Trigger 필요 |
| Fully Manual Failover | not recommended initially | Detection 지연·절차 편차 |
| Fully Automatic Failover | not recommended initially | Fencing·Split-brain Evidence 부족 |
| DNS-only Switch | not recommended as sole mechanism | Writer Authority/Readiness 미보장 |
| Dump-only Recovery | not recommended as sole mechanism | PITR/RPO 불충분 |

### 8.94 Integrated Consequence Candidates

현재 Architecture Direction을 Production에 채택할 경우의 긍정 후보: Primary/DR Compose 모델 유사성 ·
평상시 Application Compute 제한 가능성 · 동일 OCI Artifact 재사용 · Database Promotion
시간 단축 가능성 · Human-approved Write/Traffic · Standby와 독립된 PostgreSQL PITR ·
명확한 Authority Evidence · Drill 가능한 단계 분리.

부정 후보: Warm EC2/EBS 상시 비용 · Host OS/Docker/PostgreSQL Patch · Replication
Network/Lag/Slot/Disk 운영 · GHCR Private Pull Credential · 단일 Application Host ·
1인 Operator 의존 · Manual Approval로 RTO 초과 가능 · Failback/Re-seed 복잡성 ·
Cost 측정 필요 · Cross-region 부재.

### 8.95 Architecture Decision Readiness Gate

| Gate | Required Evidence | Current State |
|---|---|---|
| A — Document Completeness | All matrices/invariants/alternatives, ADR 보존, Truthfulness | `complete` |
| B — Runtime Discovery | Host, Runtime, PostgreSQL, Backup, Cloudflare, AWS/IAM | `not_started` |
| C — Feasibility | Image Build, Fargate/EC2 Start, Restore, Read-only, Fencing, Promotion | `not_started` |
| D — Measurement | Cost, Stage Durations, WAL Lag, Restore Time, RTO/RPO | `not_started` |
| E — Drill | Monthly Restore, Quarterly Full DR, Failback/Re-seed | `not_started` |
| F — Governance | Independent Review, Human Decision, DEC-066, ADR Index, Decision Log, PR Merge Gate | `verification_required` |

Gate A와 Architecture Direction 승인은 Runtime Evidence나 Production Adoption을 뜻하지
않는다. Gate F의 문서화·PR 작업은 진행할 수 있지만 Production Adoption은 B~E와
Security Review, Independent Merge Gate 전 승인할 수 없다.

### 8.96 Follow-up Jira Candidates

| # | Candidate | Architecture / Runtime Boundary |
|---:|---|---|
| 1 | Runtime Inventory and Evidence | Discovery only |
| 2 | Container Image and Compose Baseline | Product runtime implementation |
| 3 | AWS Account / IAM / Network Foundation | Security architecture 후 implementation |
| 4 | Registry and Release Digest | Artifact governance 후 implementation |
| 5 | PostgreSQL Backup / WAL Prototype | Isolated data prototype |
| 6 | PostgreSQL Restore Drill | Isolated drill/evidence |
| 7 | AWS Application DR Prototype | Non-production runtime prototype |
| 8 | Fencing and Writer Authority | Authority design 후 control implementation |
| 9 | Read-only Application Mode | Product behavior implementation |
| 10 | Cloudflare Failover Prototype | Non-production traffic prototype |
| 11 | Terraform Foundation | State/security decision 후 IaC implementation |
| 12 | Observability and Audit Evidence | Evidence architecture 후 runtime implementation |
| 13 | Full DR Drill | Integrated verification |
| 14 | Failback/Re-seed Drill | Isolated destructive-boundary verification |

이번 Slice는 Jira를 생성하지 않고 Architecture와 Runtime 구현을 분리한 후보만 기록한다.

### 8.97 Portfolio / Governance Projection Candidate

RPL-31 Landscape와 RPL-33 Catalog에 향후 반영할 후보: Primary Runtime Placement · DR
Runtime Candidate · Backup Storage Boundary · Writer Authority · Traffic Failover Boundary ·
Drill Ownership. Architecture Accepted 이후 Projection Update가 필요하며 현재 Catalog와
Confluence는 수정하지 않는다.

---

## 9. Decision

RPL-42의 명시적 사용자 승인에 따라 다음 Architecture Direction을 제약과 함께
채택한다. 이는 Runtime Discovery와 Isolated Spike·Restore Drill의 기준이며 Production
Adoption이나 Resource 생성 승인이 아니다.

```text
decision_status: accepted_with_constraints
implementation_status: not_started
Production Adoption: not_approved
Runtime Evidence: runtime_unverified
RTO/RPO: target_not_verified
```

### Accepted Architecture Direction

| Concern | Accepted direction | Boundary / Re-evaluation |
|---|---|---|
| Primary | Mac mini + Docker Compose | Runtime inventory와 Compose compatibility 필요 |
| Application DR first validation | EC2 + Docker Compose; Database Host와 분리; stopped 또는 incident-time provision 후보 | Host patch/bootstrap 부담이 크면 Fargate 재평가 |
| Application DR alternative | ECS Fargate + ALB | Multi-replica, independent scale, zero-downtime 또는 EC2 host 부담 시 재평가 |
| Database DR first validation | Application EC2와 분리된 EC2 PostgreSQL Warm Physical Standby | 비용·network·replication 운영 검증 필요 |
| Data Safety | Standby와 독립된 Base Backup + Continuous WAL Archive/PITR, integrity와 restore drill | Warm Standby는 Backup이 아님 |
| Database DR alternative | Cold Base Backup + WAL Restore | Warm 비용·network·운영 부적합 또는 Cold Restore RTO 충족 시 재평가 |
| Registry | Container Registry required; GHCR first validation; ECR alternative | Fargate 채택 또는 GHCR credential 부담 시 ECR 재평가 |
| Release Evidence | Git Tag와 OCI Manifest/Platform Digest 분리 | Incident rebuild는 검증 Artifact를 대체하지 않음 |
| AWS Entry | Cloudflare Tunnel → EC2 Gateway first validation | 실제 connector/origin 검증 필요 |
| ALB | `deferred_until_runtime_choice` | Fargate·Multi-AZ·Multi-replica·Direct Tunnel 실패 시 재평가 |
| Traffic | Automatic Health Detection/Evidence Collection + Human-approved Write/Traffic Failover | Health는 Fencing이나 Writer Authority가 아님 |
| Failback | Automatic Failback 금지; DR Write Freeze → Cutover Boundary → Final WAL/Data Catch-up → Boundary Validation → Human-approved Primary Promotion → Controlled Write → Traffic Failback | Final-sync와 Human Approval 생략 금지 |
| IaC | Terraform planning direction | State/security 결정과 별도 구현 승인 필요 |
| Kubernetes | `deferred` | ADR-0015 Trigger 전 도입하지 않음 |

### Production Adoption Gate

Production Adoption은 별도 승인 대상이다. Runtime Inventory, 비용 모델, Security Review,
PITR Prototype, EC2/GHCR/Tunnel/Fargate 비교, Promotion/Failback Drill과 Full DR Drill의
Evidence를 통과하기 전에는 `not_approved`를 유지한다.

다음 표현을 사용하지 않는다: "EC2가 존재한다", "Warm Standby가 실행 중이다",
"Replication이 구성됐다", "Base Backup/WAL Archive가 동작한다", "GHCR/ECR Repository가
존재한다", "Direct Tunnel이 구성됐다", "ALB가 불필요하다고 검증됐다", "Terraform이
적용됐다", "비용 목표를 충족했다", "RTO 4시간을 달성했다", "RPO 15분을 달성했다",
"Production Adoption이 완료됐다".

Architecture Direction 승인 이후에도 각 first validation target의 Runtime Adoption은
`verification_required`다.

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

Architecture Direction은 제약과 함께 승인됐다. 아래는 first validation target이 현재
Driver에서 앞선 이유이며 Production Adoption 또는 Runtime 성공 근거가 아니다.

- **EC2 Compose는 Emergency DR와 Primary Runtime 유사성을 함께 검증하는 가장 작은
  Application Spike다.** Host Patch 책임은 늘지만 Task Definition, ECS Service, ALB와
  Target Group을 초기 경로에서 줄일 가능성이 있다. Bootstrap/운영 부담이 더 크다는
  Evidence가 나오면 Fargate + ALB로 재평가한다.
- **ALB는 Fargate에는 강한 기본 Entry지만 단일 EC2에는 필수가 아니다.** Cloudflare
  Tunnel direct to Gateway를 먼저 검증하고 Fargate/Multi-replica/Direct Tunnel 실패 시
  ALB를 재평가한다.
- **Warm Physical Standby는 Database Recovery Speed 우선 조건과 정렬될 가능성이
  크다.** 그러나 Backup이 아니므로 Base Backup+Continuous WAL PITR를 독립 유지하며,
  상시 비용·Lag·Slot·Disk·Patch·Network 운영은 `measurement_required`다.
- **GHCR는 GitHub Build/Release와 EC2 Pull 경로를 먼저 검증한다.** Private PAT 관리가
  부담이거나 Fargate/ECS를 선택하면 ECR IAM 통합을 재평가한다.
- **오탐과 Split-brain 위험이 자동 전환의 속도 이점을 상회한다.** 그래서 Traffic은
  Detection은 자동화하되 Write Enable과 Traffic Switch는 사람 승인을 요구하는
  방식이 현재 앞선다.
- **RTO 4시간은 단계별 측정 전까지 Runtime 선택으로 보장되지 않는다.** Runtime
  후보 선택은 RTO 달성 주장과 분리된다.

이 Rationale은 승인된 Architecture Direction을 설명하지만 후속 Evidence 전까지
Production Adoption 근거가 아니다.

### Slice 5 Rationale (Architecture direction accepted, runtime unverified)

- **PostgreSQL Native PITR가 Business SSOT와 RPO/RTO Driver에 가장 직접적이다.** Base
  Backup + Continuous WAL Archive는 Warm Standby와 독립된 PITR 안전망이다. RPO는
  Archive/Replication Lag와 Business Boundary, RTO는 Promotion 또는 Restore/Replay
  시간에 의존해 `measurement_required`다.
- **Warm Physical Standby는 Database Recovery Speed가 우선인 현재 조건에서 first
  validation target이다.** 상시 비용과 1인 운영 복잡도가 Guardrail을 넘거나 Network/
  Replication 운영이 부적합하면 Cold Restore로 되돌린다.
- **Managed Primary는 승인된 초기 미채택 제약과 Primary Architecture 변경 부담으로
  deferred다.** 영구 거부가 아니다.
- **Dump-only는 PITR 부재와 RPO 달성 곤란으로 Canonical DR로 부적합**하며 보조
  Export 용도로만 유지한다.
- **Promotion과 Failback은 Fencing·Validation·Timeline 관리 없이는 Split-brain을
  만든다.** 그래서 Promotion Invariant와 Automatic Failback 금지 후보를 유지한다.

이 Slice 5 Rationale도 Full Restore/Failover/Failback Drill 전까지 Production Adoption
근거가 아니다.

### Slice 6 Rationale (Architecture direction accepted, production not adopted)

- Candidate B는 Compose 동등성과 Warm Database 활성화 가능성을 연결해 현재 사용자
  조건에서 `planning_leader`다. Host와 Replication 운영 부담 때문에 검증이 필수다.
- Candidate A는 Fargate/ALB의 관리형 Application 장점과 낮은 Database 고정비를 가진
  대안으로 보존한다.
- Candidate C는 Fargate 운영 Spike가 우세하면서 Database Recovery Speed가 필요할 때의
  Hybrid 대안이고, Candidate D는 Warm 비용/운영이 부적합할 때의 Compose+Cold 대안이다.
- Health, Runtime 준비와 Evidence 수집은 병렬화할 수 있지만 Writer Authority 전이는
  Fencing·Validation·Human Approval을 따라 직렬이어야 한다.
- Document Completeness만으로 Runtime Feasibility, Cost 또는 RTO/RPO를 증명할 수 없으므로
  Production Adoption Readiness는 `verification_required`다.

이 Slice 6 Rationale은 승인된 Architecture Direction의 비교 근거이며 Runtime 또는
Production Adoption Evidence가 아니다.

---

## 11. Consequences

Architecture Direction은 승인됐지만 아래 결과는 Runtime에 실제 발생한 사실이 아니라
Production Adoption 시 예상되는 결과다.

### 채택 시 긍정 후보

- Primary와 DR가 동일 OCI Image와 Digest를 재사용할 수 있다.
- Incident 절차가 Fencing → Restore → Read-only → Consistency → Write Enable →
  Traffic 순서로 구조화되어 Split-brain 위험이 감소한다.
- Human Approval Gate로 오탐 기반 자동 전환을 방지한다.
- Terraform 재현으로 EC2 Application과 별도 Warm Standby 경계를 반복 검증할 수 있다.

### 채택 시 부담 후보

- Application/Database EC2 Host Patch, Docker/PostgreSQL Runtime, IAM/VPC/Security Group,
  Cloudflare와 Secret Store 운영 표면이 늘어난다.
- Warm Standby의 Compute/EBS, Replication Lag/Slot/Disk와 Timeline을 상시 관리해야 한다.
- GHCR Private Pull Credential과 외부 Registry Dependency를 관리해야 한다.
- 단일 EC2 Application Host 장애와 Incident-time Bootstrap 실패가 RTO를 위협할 수 있다.
- Operator 부재 시 Human Approval 의존이 RTO를 초과시킬 수 있다.

### 하지 않는 것

- 이 Slice는 ADR-0013 Data Ownership과 ADR-0015 Deferred Trigger를 바꾸지 않는다.
- AWS에 여러 Service를 배치해도 Logical Service Boundary를 통합하지 않는다.
- Runtime, Infrastructure, Cloudflare 구성, RTO/RPO 달성을 주장하지 않는다.

### Slice 5 Consequences (Architecture direction accepted, runtime unverified)

채택 시 긍정 후보:

- PITR로 특정 시점 복구와 Restore Drill 기반 RTO/RPO 측정이 가능해진다.
- Off-host 암호화 Backup과 Storage Failure Domain 분리로 Primary 상실이 유일한
  복구 경로를 제거하지 않는다.
- Promotion Invariant·Writer Authority·Timeline 관리로 Split-brain 위험이 감소한다.

채택 시 부담 후보:

- Base Backup·WAL Archive·Catalog·Encryption Key 운영 표면이 늘어난다.
- Restore/Replay 시간이 Database Size와 WAL 양에 민감하다.
- Warm Standby를 병행하면 상시 비용과 Slot/Lag 관리 부담이 증가한다.
- Failback은 Re-seed 또는 조건부 pg_rewind가 필요할 수 있다.

하지 않는 것:

- PostgreSQL은 Business SSOT, Redis는 Business SSOT 아님을 유지한다(ADR-0013).
- 같은 PostgreSQL Cluster 사용도 Logical Ownership을 통합하지 않는다.
- Backup 존재, WAL Archive 동작, Restore 성공, RPO/RTO 달성을 주장하지 않는다.

### Slice 6 Consequences (Architecture direction accepted, production not adopted)

채택 시 긍정 후보: Primary/DR Compose 유사성 · 평상시 Application Compute 제한 가능성 ·
동일 OCI Artifact 재사용 · Warm Database 활성화 단축 가능성 · Human-approved
Write/Traffic · Standby와 독립된 PostgreSQL Native PITR · 명확한 Authority Evidence.

채택 시 부담 후보: Warm EC2/EBS 상시 비용 · Application/Database Host 운영 ·
Replication Network/Lag/Slot/Disk · GHCR Credential · 1인 Operator 의존 · Approval 지연 ·
Failback/Re-seed 복잡성 · Cost 측정 필요 · Cross-region 부재.

---

## 12. Human Authority Impact

Architecture Direction의 Human Authority 경계를 승인한다. 아래 Matrix는
Failover/Failback Action의 승인 기준이며 실행 권한 위임이나 Runtime Approval이 아니다.

| Action | Automated Signal | Human Decision Required | Evidence | Owner |
|---|---|---|---|---|
| Incident Declare | Health/Monitor 이상 | 예 | Detection Log, Operator Ack | 박성환 |
| Primary Unavailable 판정 | Health/Tunnel/DB Signal | 예 | 복수 Signal 상관, Operator 확인 | 박성환 |
| Primary Fencing 승인 | Mechanism/Observation Signal | 예 | Authoritative Mechanism 또는 독립 Write-impossibility Proof | 박성환 |
| DR Runtime Start | 조건부 Trigger 가능 | 예(초기) | Runtime State, Image Digest | 박성환 |
| Standby Catch-up 또는 Cold Restore 시작 | 없음 | 예 | Lag/Timeline 또는 Backup/WAL Reference | 박성환 |
| Database Read-only 승인 | Runtime Health | 예 | Recovery-safe Read-only, Schema Check | 박성환 |
| Application Read-only 승인 | Application Readiness | 예 | 강제 Read-only, Query, Critical Business Read | 박성환 |
| Database Promotion 승인 | DB/App Validation | 예 | Fencing+Restore+DB/App Read-only Evidence | 박성환 |
| Application Write Enable 승인 | 없음 | 예 | Promotion Result+Writer Authority Record | 박성환 |
| Traffic Failover 승인 | Target/Readiness Health | 예 | Failover Gate Evidence, Rollback Target | 박성환 |
| Failback 시작 | Primary 복구 Signal | 예 | Primary Runtime/Digest 확인 | 박성환 |
| Failback Cutover/Final Sync 승인 | 없음 | 예 | DR Freeze+Boundary+Final Catch-up Validation | 박성환 |
| Primary Write Enable | 없음 | 예 | DR Authority 해제+Primary Final Read-only+Promotion | 박성환 |
| Traffic Failback 승인 | Primary Readiness | 예 | Failback Gate Evidence | 박성환 |
| Incident Close | 없음 | 예 | Audit Evidence 보존 | 박성환 |

현재 Approval Owner는 박성환이며 24/7 SLA가 아니다. Future delegated operator와
automated system은 Owner 후보로만 기록하고 이번 Slice에서 위임하지 않는다.

### Database Authority Matrix (Slice 5)

기존 Human Authority Matrix를 보존하면서 Database Action의 승인 경계를 추가한다.

| Action | Automated Signal | Human Decision Required | Evidence | Owner |
|---|---|---|---|---|
| Backup Policy 승인 | 없음 | 예 | Retention/Encryption 정책 | 박성환 |
| Backup Delete 승인 | 없음 | 예 | Retention/Lock 상태, 삭제 사유 | 박성환 |
| Restore 시작 | Incident Signal | 예 | Incident 선언, Fencing 착수 | 박성환 |
| Base Backup 선택 | Catalog 조회 | 예 | Manifest/Integrity | 박성환 |
| Restore Target 선택 | 없음 | 예 | Target Evidence(§8.50) | 박성환 |
| WAL Gap 예외 처리 | Gap 탐지 | 예 | Gap 범위, 영향 평가 | 박성환 |
| Database Read-only 승인 | Recovery 종료 | 예 | Read-only Validation | 박성환 |
| Application Read-only 승인 | Application Readiness | 예 | 강제 Read-only Query+Critical Business Read | 박성환 |
| Promotion 승인 | DB/App Validation 통과 | 예 | Authoritative Fencing + DB/App Validation Evidence | 박성환 |
| Write Credential 활성화 | 없음 | 예 | Writer Authority Record | 박성환 |
| Database Writer Authority 변경 | 없음 | 예 | Audit Evidence | 박성환 |
| Failback 시작 | Primary 복구 Signal | 예 | Primary Version/Extension 확인 | 박성환 |
| Re-seed 승인 | 없음 | 예 | Re-seed 방식/Evidence | 박성환 |
| DR Write Freeze/Cutover Boundary 승인 | 없음 | 예 | Initial Validation+Final Boundary Evidence | 박성환 |
| Final Catch-up 승인 | Sync Signal | 예 | Timeline·LSN·Business Boundary 일치 | 박성환 |
| DR Writer Authority 해제/Primary Promotion | Validation 통과 | 예 | Final Primary Read-only+Single Writer Evidence | 박성환 |
| Old Primary 폐기 | 없음 | 예 | Timeline/Divergence 판단 | 박성환 |
| Incident Database Close | 없음 | 예 | Audit Evidence 보존 | 박성환 |

현재 Human Approval Owner는 박성환이며 24/7 SLA가 아니다. Future delegated operator와
automated system은 Owner 후보로만 기록한다.

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

다음은 이 ADR에서 비교됐지만 채택되지 않은 `planning_candidate` 또는 `open` 범위다.

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

### Slice 5 State Class Recovery Matrix

| State Class | Canonical Owner | Backup Required | Restore Required | Rebuild Allowed | Promotion Impact |
|---|---|---|---|---|---|
| PostgreSQL Business Data | 해당 Product/Service | 예 | 예 | 아니오(SSOT) | Promotion 대상 |
| PostgreSQL Roles / Grants | 해당 Product/Service | 예 | 예 | 부분(재적용) | Write 권한 전제 |
| PostgreSQL Extensions | 해당 Product/Service | 참조 필요 | 설치 필요 | 예(재설치) | 호환 전제 |
| PostgreSQL Configuration | Operations | 예(별도) | 예 | 예(재구성) | 기동 전제 |
| Migration Metadata | 해당 Product/Service | 예(DB 내) | 예 | 아니오 | Compatibility 전제 |
| Uploaded Asset / Local Business File | 존재 시 해당 Product | runtime_unverified | 조건부 | 조건부 | 낮음 |
| Redis Session / Cache | 해당 Runtime | 아니오 | 아니오 | 예(재생성) | 없음(SSOT 아님) |
| Container Image | Product build/release owner | Registry 보존 | Digest Pull | 재빌드 후보 | Runtime 전제 |
| Secrets / Credentials | Credential별 owner | 별도 Source | 별도 확보 | rotate 후보 | 접근 전제 |
| Deployment Metadata | 구현 Repo/Operations | 조건부 | 조건부 | 예 | 낮음 |
| Backup / WAL | Business Data owner + Operations | 자신이 Backup | 자신이 Restore 근거 | 아니오 | Restore 근거 |
| Audit / DR Evidence | DR Drill owner | 예(보존) | 참조 | 아니오 | 승인 근거 |
| Projection / Derived Data | Producer/Consumer | 아니오(재파생) | 아니오 | 예(재빌드) | Source 이후 |
| NATS State | 현재 Runtime 아님 | not_applicable | not_applicable | deferred | not_applicable |

- PostgreSQL Business Data는 반드시 복구한다.
- Redis는 Business SSOT가 아니므로 일반적으로 재생성 후보다.
- Container Image는 Registry에서 Digest로, Secret은 별도 Secret Source에서 확보한다.
- NATS는 현재 Runtime이 아니므로 이번 Recovery Scope에서 `not_applicable`/`deferred`다.
- Uploaded Asset은 실제 존재 여부와 Ownership이 `runtime_unverified`다.

### Slice 5 Stateful Recovery Order

최소 후보 순서: 1) Incident/Authoritative Fencing Evidence 2) Secret and Configuration 3)
Warm Standby Lag/Timeline 및 Backup Catalog 4) Standby Catch-up 또는 Cold PostgreSQL Base
Backup/WAL Fallback 5) PostgreSQL Read-only Validation 6) Uploaded
Business Asset 7) Application Runtime 강제 Read-only 8) Application Query/Critical Business
Read 9) Database Promotion Approval/실행 10) Writer Authority Record 11) Redis/Projection
Rebuild 12) Application Write Approval 13) Controlled Write Probe 14) Traffic Failover 15)
Audit Closure.

```text
Application Runtime 시작 ≠ Stateful Recovery 완료
Redis Ready ≠ Business Data Ready
Projection Ready ≠ Source of Truth Ready
```

---

## 14. Shared Core and Extension Impact

Architecture Direction 승인으로 Shared Core나 Extension의 구현·배치가 승인되지 않는다.

이 ADR은 Shared Identity, Shared AI, Shared Commerce 또는 Audit Consumer의
독립 Runtime 구현을 승인하지 않으며 기존 Shared Core/Extension Ownership을 변경하지
않는다.

---

## 15. Contract Impact

Architecture Direction 승인으로 기존 Contract 의미가 변경되지 않는다.

- 이 ADR의 Architecture Candidate 분석은 Contract 의미, Field, Validation 또는 Human
  Gate를 변경하지 않는다.
- Backup/Restore/Promotion은 Runtime·Data 복구 Concern이며 Token/Event/API Contract를
  변경하지 않는다.
- Writer Authority와 Fencing은 Data 계층 Invariant이며 기존 Contract Field를 추가하거나
  수정하지 않는다.

---

## 16. Product and Roadmap Impact

### Product Scope

```text
No change
```

### Roadmap

Architecture Direction 승인으로 Product Scope가 변경되지 않는다.

ADR 작성은 Product SLA, Release Requirement 또는 Roadmap Commitment를 생성하지
않는다. Runtime Discovery, Prototype와 Drill은 별도 승인된 후속 Jira 후보로만 남는다.

---

## 17. Testing and Evidence

Architecture Direction 승인 후 Production Adoption 전에 필요한 검증이며 각 상태는
`not_run` 또는 `verification_required`다.

### Runtime

- EC2 Compose Bootstrap · GHCR Private Pull by Digest · Cloudflare Tunnel to EC2 Gateway ·
  ARM64/AMD64 Compatibility · Read-only Boot · Secret/Config Injection · Rollback · Fargate
  Task/ALB 동일 Image 대안 비교.

### Failover

- Health False Positive · Primary Host Loss · Local Network Loss · Tunnel Loss ·
  Authoritative Fencing Mechanism · Supporting Containment/Observation-only 거부 · Database
  Read-only · Application 강제 Read-only · Promotion Approval/실행 · Writer Authority Record ·
  별도 Application Write Approval · Controlled Write · Traffic Switch · Traffic Rollback.

### Failback

- Primary Restore · Initial Re-seed · Primary Initial Read-only · Cutover Window 승인 · DR Write
  Freeze · Final Write/Cutover Boundary 기록 · Final WAL/Data Catch-up · Timeline/LSN/Business
  Boundary Validation · Primary Final Read-only · DR Writer Authority 해제 · Primary Promotion/
  Authority 활성화 · Controlled Write · Traffic Failback.

### Negative Tests

- Authoritative Fencing 없이 Supporting Action/Observation만 존재 · Restore 미완료 ·
  Consistency Check 실패 · Secret 불일치 · Image Digest 불일치 · Operator Approval 없음 ·
  Cloudflare Health만 정상 · Primary 재등장 · Operator 부재 · Final Boundary 없음 · Final
  Catch-up/Boundary Validation 실패 · Freeze 후 DR Write 재활성화. 각 경우 Write 또는
  Failback Promotion이 거부되고 Manual Review로 진행되어야 한다.

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

### Slice 5 Data DR Verification Candidates

각 상태는 `not_run` 또는 `verification_required`다.

- **Backup**: Base Backup 생성 · Manifest 검증 · Encryption · Off-host Storage ·
  Retention · Deletion Protection · Missing Base Backup · Corrupt Base Backup.
- **WAL**: Archive 정상 · Archive Failure · Archive Lag · Missing Segment · Duplicate
  Segment · Timeline Change · Storage Full · Network Loss.
- **Restore**: Empty Runtime Restore · Specific Timestamp PITR · Latest Consistent
  Point · Missing WAL Failure · Wrong Version Failure · Missing Extension Failure ·
  Wrong Timeline Failure · Read-only Startup · Business Read Validation.
- **Promotion**: Primary Authoritative Fencing/독립 Proof · Supporting Action-only 거부 ·
  Database Read-only · Application 강제 Read-only Query/Business Read · Promotion 승인 없음 ·
  Promotion 후 Timeline · Writer Authority Record · 별도 Application Write Approval · Old
  Primary Reappearance · Write Credential Activation · Controlled Write Probe.
- **Failback**: Initial Re-seed · pg_rewind 조건부 가능성 · Old Primary Data 폐기 · Primary
  Initial Read-only · AWS Write Freeze · Final Write/Cutover Boundary · Final WAL/Data Catch-up ·
  Timeline/LSN/Business Boundary Validation · Primary Final Read-only · DR Writer Authority
  해제 · Primary Promotion/Authority Transfer · Traffic Failback.
- **Negative**: Backup 없음 · WAL Gap · Decryption 실패 · Restore Target 불명확 ·
  Schema Version 불일치 · Extension 불일치 · Operator Approval 없음 · Fencing
  Evidence 없음 · Primary 재접속 가능 · RPO 초과 · RTO 초과. 각 경우 Promotion/Write가
  거부되고 Manual Review로 진행되어야 한다.

Drill Policy(§8.67)의 Monthly Restore Check와 Quarterly Full DR Drill은 승인된 목표로
유지되며 실제 실행 여부는 `not_run`이다.

### Slice 6 Integrated Recovery Verification Candidates

각 상태는 `not_run`, `runtime_unverified` 또는 `verification_required`다.

- **Topology**: Candidate A/B/C Application·Database Host 분리 · 승인 Digest 재사용 ·
  Candidate D 포함 Registry/Backup Failure Domain 분리 · Warm Standby와 Backup 분리.
- **Dependency**: Authoritative Fencing 없는 Writer 전이 거부 · Database Validation 전
  Application Start 거부 · Application Read-only Validation 전 Promotion 거부 · Promotion/
  Authority Record 전 Application Write 거부 · Write Probe 전 Traffic Switch 거부.
- **Abort**: Manifest 불일치 · WAL Gap · Version/Extension/Schema 불일치 · Secret/Config/
  Digest 불일치 · Approval 부재에서 Write/Traffic Stop.
- **Authority**: Writer Authority Record 전이 · Dual-authoritative State 거부 · Failback 중
  DR Write Freeze → Cutover Boundary → `failback_final_sync` → Boundary Validation 전이.
- **Drill**: Monthly Restore Check · Quarterly Full DR Drill · RTO Stage Timestamp · RPO
  Business Boundary · Evidence Schema 보존.

```text
Document completeness ≠ runtime feasibility
Partial availability ≠ DR complete
```

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

### Slice 5 Database Recovery / Rollback Candidate Order

- Database 복구 방향은 Restore Order(§8.52)와 Promotion Invariant(§8.54)를 따른다.
- Database Rollback은 Application Rollback과 구분한다. Application Digest Rollback이
  Database Migration Rollback을 의미하지 않는다.
- Failback 방향은 Failback/Re-seed Boundary(§8.57)를 따르며 Automatic Database
  Failback을 금지한다.
- Restore Target 오선택에 대비해 다른 Recovery Point로 재복구할 수 있도록 Backup/WAL을
  보존한다(§8.60 Retention).

```text
Recovery Target Reached ≠ Data Consistency Verified
Promotion ≠ Reversible without new restore
```

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
- Authoritative Fencing Mechanism, Supporting Containment Action과 Observation의 구현·검증
  경계를 정하고 Read-only 구현 방식을 후보 중에서 검증·선택해야 한다.
- Write Authority를 기술적으로 표현하는 방법(Write Credential/Lease 등)을 검증해야
  한다.
- Human Approval을 수행할 Interface와 Audit Evidence 저장 위치·Owner를 정해야 한다.
- Cloudflare Tunnel/Load Balancing의 실제 운영 여부와 Health Endpoint의
  Liveness/Readiness/Write Readiness 분리를 확인해야 한다.
- Terraform State의 저장, 암호화, Locking, 접근·복구 경계를 확인해야 한다.
- 실제 PostgreSQL Major/Minor Version, Extension·Shared Library Inventory, Locale/
  Encoding/Collation을 조사해야 한다.
- Database Size와 WAL 생성률을 측정하고 Base Backup 주기·WAL Retention을 산정해야 한다.
- Base Backup·WAL Archive의 Off-host Storage, Encryption Key 관리, Immutability(예:
  Object Lock/Versioning) 후보를 검증해야 한다.
- Archive Lag/Gap 탐지와 Missing/Duplicate/Partial Segment 처리 방식을 검증해야 한다.
- Restore용 AWS PostgreSQL Runtime(EC2 등), Version/Extension 설치 순서, Read-only
  기동 방식을 검증해야 한다.
- pg_verifybackup 또는 동등 무결성 검증과 실제 Restore Drill로 복구 가능성을 확인해야
  한다.
- Promotion Interface, Write Credential 활성화/폐기, Writer Authority 기록 위치를
  정해야 한다. Promotion 전 Application 강제 Read-only Validation을 구현해야 한다.
- Failback Re-seed 방식(New Base Backup/Physical Copy/조건부 pg_rewind 등)과 pg_rewind
  전제(`wal_log_hints` 또는 checksum)를 검증해야 한다.
- Failback Cutover Boundary 기록, Final WAL/Data Catch-up과 Timeline·LSN·Business Boundary
  일치 검증 방식을 정해야 한다.
- Monthly Restore Check와 Quarterly Full DR Drill의 Evidence 저장 위치·Owner를 정해야
  한다.
- Integrated Writer Authority Record의 저장·동시성 제어·감사 보존 방식을 정해야 한다.
- Maintenance, Read-only와 Partial Availability의 Product UX와 Write 차단 방식을
  검증해야 한다.
- Critical Path 각 Stage와 Failover Timeline T0~T12를 Drill에서 측정해야 한다.
- RPO의 Incident Data Boundary와 Verified Restored Business Boundary 상관 방식을
  검증해야 한다.
- Candidate A의 Cold Restore Critical Path, Candidate B의 App/DB Host 분리와 Warm
  Replication 운영, Candidate C의 Fargate+Warm 관리 표면, Candidate D의 Compose+Cold
  비용/복구 Trade-off를 비교해야 한다.

Candidate Reframe 이후 Evidence 우선순위:

1. PostgreSQL Version/Extension/Size/WAL Inventory
2. Warm Standby 최소 Instance/EBS Cost Model
3. Replication Lag와 Network Feasibility
4. Base Backup/WAL Archive Prototype
5. GHCR Private Pull from EC2
6. EC2 Compose Bootstrap
7. Cloudflare Tunnel to EC2 Gateway
8. Fargate + ALB 동일 Image Compatibility
9. EC2 Compose vs Fargate Operational Comparison
10. Warm Standby Promotion Drill
11. Final-sync Failback Drill
12. Production Adoption Gate

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
- Warm Standby 후보는 상시 비용·Network·Lag·Slot/Disk·Patch 운영에 민감하고,
  Cold PITR 대안은 Infrastructure Provision과 Data Restore 시간에 민감하다.
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
- 실제 DB 크기와 Restore 시간, Replication Lag, Warm EC2/EBS, ALB/Fargate와
  Incident EC2 Bootstrap 비용·시간이 미측정이다.
- Authoritative Fencing Mechanism/독립 Proof 기준과 Read-only 구현 방식이 미결정이다.
- Cross-region DR는 `deferred`, Automatic Failover는 초기 `not_recommended`,
  Automatic Failback은 초기 후보에서 금지 상태다.
- AWS DR Runtime 후보의 RTO 4시간 달성 여부는 Full DR Drill 전 `target_not_verified`다.
- 실제 PostgreSQL Host·Version·Extension Inventory가 미검증이고 Database Size와 WAL
  Rate가 미측정이다.
- Base Backup과 WAL Archive 존재 여부가 미확인이며 Archive Gap 탐지·Backup Encryption·
  Restore Runtime이 미구현이다.
- Promotion Procedure와 Failback Re-seed/Final Synchronization 방식(조건부 pg_rewind 포함)이
  미결정이다.
- Warm Standby Cost/Network/운영 부담과 Cross-region Backup(`deferred`)이 미측정·미결정이다.
- Full Restore/Failover/Failback Drill이 `not_run`이라 RPO 15분·RTO 4시간은
  `target_not_verified`다.
- Integrated Candidate A~D 모두 Runtime Inventory, Cost, Fencing, Read-only와 Drill
  Evidence가 부족해 Production Adoption Readiness는 `verification_required`다.
- Operator 단일 인물 의존과 Cloudflare/AWS 단일 Provider 결합은 해소되지 않았다.
- Slice 5에서 `## 19. Implementation Notes` 구조 Header 누락이 복구됐고 현재 Canonical
  Tip의 26개 주요 Section 구조는 정상이다. Runtime Architecture 의미 변경은 없다.

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
- EC2에서 Private GHCR Read Credential을 어떻게 최소 권한·Rotation·Break-glass로
  관리할 것인가?
- GHCR Pull Spike와 ECR IAM Pull Spike 중 1인 운영 절차가 실제로 더 단순한가?
- Registry 고정비와 Network 비용이 Cost cap에 포함되는가?
- Retention 기간과 최소 Rollback Digest 수는 얼마인가?
- Cross-region Replication이 필요한가?
- Break-glass Pull Credential은 어떻게 보관하는가?

### AWS Runtime

- EC2 Compose Bootstrap과 Fargate Task 중 실제 Application 호환성·기동·운영 절차가
  더 단순한가?
- stopped/Incident-created EC2 Application 상태가 비용 목표와 RTO에 맞는가?
- Cloudflare Tunnel direct to EC2 Gateway가 ALB 없이 검증되는가?
- Fargate 대안을 선택할 때 ALB를 상시 유지할 것인가, Incident 때 생성할 것인가?
- NAT Gateway 없이 필요한 접근을 구성할 수 있는가?
- ECR과 GHCR 중 Failure Domain 우선순위는 무엇인가?
- Terraform State를 어디에 둘 것인가?

### Traffic

- 현재 Cloudflare Tunnel이 실제 운영 중인가?
- Load Balancing 기능을 사용할 것인가?
- Health Endpoint의 Liveness/Readiness/Write Readiness를 어떻게 분리할 것인가?
- Human Approval을 어떤 Interface에서 수행할 것인가?
- 어떤 Authoritative Fencing Mechanism으로 Primary Business Write를 차단하는가?
- Supporting Containment Action/Observation과 독립 Write-impossibility Proof의 충분성은
  어떻게 판정하는가?
- Write Authority를 기술적으로 어떻게 표현할 것인가?

### Failback

- DR 중 발생한 Write를 Primary에 어떻게 반영할 것인가?
- Database Re-seed 방식은 무엇인가?
- DR Final Write/Cutover Boundary와 Final WAL/Data Catch-up 완료를 어떤 Evidence로
  판정하는가?
- Failback 중 Maintenance Window가 필요한가?
- AWS DR를 언제 Cold 상태로 되돌릴 것인가?

### Verification

- Warm Standby Promotion 경로와 Cold PITR Fallback 중 4시간 RTO를 달성 가능한가?
- Operator 부재 시 Escalation은 어떻게 하는가?
- Drill Evidence의 저장 위치와 Owner는 무엇인가?

### PostgreSQL Runtime (Slice 5)

- 실제 PostgreSQL Version은 무엇인가?
- Database Size와 WAL Rate는 얼마인가?
- Extension과 Shared Library는 무엇인가?
- Tablespace 또는 Local Path 의존이 있는가?
- Roles/Grants/Configuration은 어떻게 보존할 것인가?

### Backup (Slice 5)

- Base Backup 방식은 무엇인가?
- Off-host Storage는 무엇인가?
- Backup Frequency와 Retention은 얼마인가?
- WAL Archive 지연 허용치는 어떻게 측정할 것인가?
- Backup Encryption Key는 어디에서 관리하는가?
- Immutability가 필요한가?

### Restore (Slice 5)

- 별도 EC2 Warm Standby의 Version/Extension/EBS/Network 후보가 타당한가?
- Restore용 Image 또는 AMI는 어떻게 관리하는가?
- PITR Target을 어떤 Evidence로 선택하는가?
- Read-only Validation은 어떤 방식인가?
- Application Runtime을 Promotion 전에 어떤 방식으로 강제 Read-only 기동하는가?
- Extension 설치 순서는 무엇인가?

### Promotion (Slice 5)

- Primary Fencing은 기술적으로 무엇인가?
- Writer Authority는 어디에 기록하는가?
- Write Credential을 어떻게 활성화·폐기하는가?
- Promotion Interface는 무엇인가?

### Database Failback (Slice 5)

- Mac Primary를 어떻게 Re-seed하는가?
- pg_rewind 조건을 충족할 수 있는가?
- DR Write를 언제 Freeze하는가?
- Freeze 후 Final Boundary와 Timeline·LSN·Business Boundary 일치를 어떻게 검증하는가?
- Failback Maintenance Window가 필요한가?

### Data DR Verification (Slice 5)

- Warm Standby Promotion과 Cold Restore Fallback 각각 4시간 RTO가 가능한가?
- Replication Lag, Archive Lag/Gap과 Business Boundary로 15분 RPO가 가능한가?
- Monthly Check와 Quarterly Drill Evidence는 어디에 보존하는가?

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
- PostgreSQL official documentation (Slice 5): Continuous Archiving and PITR,
  pg_basebackup, pg_verifybackup, Log-Shipping/Streaming Replication, Replication
  Slots, pg_rewind, Hot Standby, SQL Dump
- AWS official documentation (Slice 5): S3 Object Lock, S3 Default Encryption, EBS
  Snapshots, RDS Point-in-time Recovery, RDS Multi-AZ, AWS Backup
- AWS official documentation (Slice 6): Well-Architected Reliability Pillar, Defined
  Recovery Strategies, Disaster Recovery Options in the Cloud
- Terraform official documentation (Slice 6): Dependency Graph, Plan
- AWS official documentation (Candidate Reframe): EC2, User Data, EC2 IAM Role, EBS,
  ECR Authentication, ECR with ECS, ECR Billing Structure, ECS Private Registry Authentication
- GitHub official documentation (Candidate Reframe): Container Registry Authentication,
  Package Permissions, Package Billing Structure
- Docker official documentation (Candidate Reframe): Compose Production, Digest Pull,
  Multi-platform Image

### Affected Documents

- `docs/adr/README.md`
- `docs/decisions/decision-log.md`

Affected Documents는 DEC-066 Governance Record와 ADR Index에서 연결하며 Production
Projection은 별도 Evidence와 승인 없이는 갱신하지 않는다.

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
| 2026-08-05 | open | open | not_applicable | not_applicable | Slice 5에서 PostgreSQL Backup/Restore/Promotion과 RPO/RTO 검증 경계를 비교 | RPL-42 / Comment 10144 |
| 2026-08-05 | open | open | not_applicable | not_applicable | Slice 6에서 통합 복구 흐름, Drill과 Decision Readiness 조건을 연결 | RPL-42 / Comment 10144 |
| 2026-08-05 | open | open | not_applicable | not_applicable | 1인 운영 조건으로 EC2 Compose·Warm Standby+PITR·GHCR 우선 검증 방향을 재비교 | RPL-42 Human-provided Planning Input |
| 2026-08-06 | open | accepted_with_constraints | codex | 박성환 | Independent PASS 뒤 Runtime Discovery와 Isolated Spike·Restore Drill 기준 방향을 조건부 승인 | RPL-42 explicit user approval / review target `28bd677995dc7ed787ef2cecf3229d97313d1947` |

이 History는 Architecture Option Approval이 아니다.

---

## 25. Review Checklist

### Scope

- [x] Architecture Scope In·Out을 분리했다.
- [x] Product Scope와 Runtime 구현을 변경하지 않는다.
- [x] 대안과 Planning Leader 선택 근거를 통합 Candidate 관점으로 완성했다.

### Alternatives

- [x] AWS DR Runtime과 Traffic Failover의 실질적 대안을 비교했다.
- [x] 선택 이유(Planning Leader)를 Driver와 연결했다.
- [x] Slice 3·Slice 4 후보를 first validation/alternative로 구분하고 Production Adoption과 분리했다.
- [x] Slice 6에서 Candidate A~D를 통합 비교하고 Production Adoption과 분리했다.

### Safety

- [x] Write Enable과 Fencing을 Decision Scope에 포함했다.
- [x] Fencing·Write Enable·Traffic Failover·Read-only·Failback Invariant를 정의했다.
- [x] Slice 5에서 Promotion Invariant·Writer Authority·Backup Storage Failure Domain을 정의했다.
- [x] 실제 Secret, Credential, Host, IP, Account ID, Bucket을 기록하지 않았다.
- [x] Slice 4~5에서 AWS/Cloudflare/Backup Storage Failure Domain 결합 위험을 검토했다.
- [x] Slice 6에서 Abort, Writer Authority 전이와 Drill Safety Boundary를 정의했다.

### Traceability

- [x] `adr_id`와 Source Authority를 기록했다.
- [x] Owner, Author, Reviewer, Approver를 분리했다.
- [x] Supersession이 `none`임을 기록했다.
- [x] ADR Index와 Decision Log를 DEC-066 Governance Record로 연결한다.

### Truthfulness

- [x] Approved Target과 Target Achievement를 분리했다.
- [x] Planning Candidate와 Adoption을 분리했다.
- [x] Repository Module과 Production Deployment를 분리했다.
- [x] Runtime 구현 상태를 `not_started`로 기록했다.
- [x] Architecture Direction은 `accepted_with_constraints`, Production Adoption은
  `not_approved`, RTO/RPO는 `target_not_verified`로 기록했다.

---

## 26. Acceptance Record

### Decision

```text
decision_status: accepted_with_constraints
Architecture Direction Accepted: Yes
Production Adoption: not_approved
Runtime Implementation: not_started
RTO/RPO: target_not_verified
```

### Constraints

Front Matter와 Section 7의 Constraints를 적용한다.

### Effective Scope

```text
Approval Scope: Architecture Direction only
Runtime Discovery and Isolated Spike/Restore Drill baseline
Production Resource and Runtime Adoption excluded
```

### Approval Evidence

| Field | Value |
|---|---|
| Decision Owner | 박성환 |
| Decision Source | RPL-42 explicit user approval |
| Approval Scope | Architecture Direction only |
| Production Adoption | `not_approved` |
| Runtime Implementation | `not_started` |
| Runtime Evidence | `runtime_unverified` |
| Independent Review | `PASS` |
| Blocking / Major / Minor | `0 / 0 / 0` |
| Review Target | `28bd677995dc7ed787ef2cecf3229d97313d1947` |
| Candidate Reframe Verdict | `PASS_WITH_CONDITIONS` |
| Reviewer Recommendation | `ACCEPT_REVISED_DIRECTION_WITH_CONSTRAINTS` |
| Existing ADR Supersession | `none` |

### Required Follow-up

- Runtime/PostgreSQL Inventory와 Cost/Network Feasibility 확인
- Isolated PITR, GHCR Pull, EC2 Bootstrap, Direct Tunnel과 Fargate 비교 Spike
- Warm Promotion, Final-sync Failback과 Full DR Drill
- 승인 Metadata 포함 Final HEAD의 Independent PR Review와 Merge Gate
- Production Adoption 별도 Decision

### Review and Approval

```text
reviewed_at: 2026-08-06
approved_at: 2026-08-06T01:04:27+09:00
approvers: [박성환]
```

Architecture Direction만 승인됐다. Runtime 구현, Infrastructure Provisioning과 Production
Adoption은 승인되지 않았다.
