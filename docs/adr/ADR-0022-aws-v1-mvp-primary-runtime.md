---
title: "AWS V1 MVP Production Primary Runtime을 EC2와 Docker Compose로 정한다"
adr_id: "ADR-0022"
document_status: proposed
decision_status: accepted_with_constraints
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers:
  - "Architecture Owner (fixed decision supplied in 2026-10-12 request)"
created_at: "2026-10-12"
reviewed_at: null
approved_at: "2026-10-12"
effective_from: null
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "V1 Production Primary는 AWS ap-northeast-2의 EC2와 Docker Compose다"
  - "RDS PostgreSQL은 Private 접근만 허용하고 Schema·Migration·권한 소유권은 서비스별로 보존한다"
  - "Valkey 공식 Docker Image를 사용하고 기존 Spring Data Redis/Lettuce 계약과 Client 이름을 보존한다"
  - "Valkey 버전, AOF/RDB, Volume, Backup, RDS Multi-AZ, Backup Retention, 신규 RPO/RTO는 별도 Owner 결정 전 고정하지 않는다"
  - "Cloudflare Tunnel은 우선 검증 후보이며 Ingress로 확정하지 않는다"
  - "V2 후보 기술과 NATS Broker Runtime을 V1 필수 도입으로 해석하지 않는다"
  - "이 ADR은 AWS Resource 생성, Production 배포, Runtime 구현 또는 운영 완료를 승인하지 않는다"
affected_docs:
  - docs/adr/README.md
  - docs/architecture/backend-service-foundation/README.md
  - docs/architecture/backend-service-foundation/aws-v1-mvp-deployment-plan.md
  - docs/architecture/backend-service-foundation/aws-v2-optimization-roadmap.md
  - docs/handoffs/README.md
evidence_refs:
  - OWNER-DECISION-2026-10-12
  - REPO-HEADS-2026-10-12
  - ADR-0015
  - ADR-0016
  - ADR-0017
  - ADR-0018
  - ADR-0020
  - ADR-0021
supersedes:
  - ADR-0016
superseded_by: []
superseded_scope:
  - "ADR-0016의 V1 Production Primary인 Mac mini + Docker Compose 배치"
  - "ADR-0016의 V1에서 AWS를 DR 전용으로 두는 배치 해석"
  - "ADR-0016의 기존 DR 시나리오 RPO/RTO 수치를 새 AWS Primary의 목표로 자동 적용하는 범위"
remaining_valid_scope:
  - "ADR-0016의 원본 기록과 과거 Mac mini Primary 결정 이력"
  - "복구·Failover 시 Human Approval, Write Fencing과 무검증 Write 금지 원칙"
  - "ADR-0016의 기존 4시간 RTO / 15분 RPO는 그 당시 DR 시나리오의 기록으로 보존하며 새 AWS Primary에 적용하지 않음"
replacement_decision_refs:
  - ADR-0022
---

# ADR-0022: AWS V1 MVP Production Primary Runtime을 EC2와 Docker Compose로 정한다

> **기록 상태**
>
> Owner Decision은 이 요청에서 고정됐다. 이 ADR은 현재 PR 후보이므로 Repository에
> 아직 Merge되지 않았다. Merge 전에는 Canonical 결정 반영이 완료됐거나 Production
> 배포가 승인됐다고 표현하지 않는다.
>
> **상태 경계**
>
> Architecture direction accepted_with_constraints
> ≠ Infrastructure provisioned
> ≠ Runtime implemented
> ≠ Production traffic promoted
> ≠ Backup / Restore verified
> ≠ RPO / RTO achieved

## 1. Decision Summary

V1 Production Primary는 서울 Region ap-northeast-2의 EC2 위 Docker Compose다.
PostgreSQL은 RDS로 관리하고, Valkey는 EC2 안의 별도 Docker Container로 실행한다.
Spring Cloud Gateway / WebFlux는 독립 Gateway Process이고, Identity·Shared AI·Shared
Audit은 하나의 Spring MVC Platform Core JVM 안에 둔다. Finance와 Carelog는 독립
Spring Service JVM을 유지한다. 내부 호출은 HTTP/JSON, AI Streaming은 SSE다.

Mac mini는 Production Primary에서 제외하고 개발·테스트 용도로 둔다. Cloudflare Tunnel은
우선 검토하지만 Ingress Decision으로 확정하지 않는다. 월 10,000 KRW는 비용 목표이지
상한이 아니며, 빠른 MVP 출시와 운영 안정성을 우선한다.

## 2. Status

| 축 | 현재 상태 | 의미 |
|---|---|---|
| Owner Decision | 고정 | 요청에 명시된 V1 Runtime 방향 |
| ADR Record | proposed | 문서 PR이 Merge되기 전 Canonical 반영 전 |
| Implementation | not_started | 배포 코드·이미지·AWS Resource는 아직 확인되지 않음 |
| Runtime Support | not_supported | Production Runtime 검증 Evidence 없음 |
| Production Release | not_released | E2E, Backup / Restore, Go-Live Gate 미통과 |
| Valkey Version / 운영 설정 | UNKNOWN | Image tag, AOF/RDB, Volume, Backup 정책 미결정 |
| RDS HA / Recovery | UNKNOWN | Multi-AZ, Retention, V1 RPO/RTO 미결정 |
| Ingress | open | Cloudflare Tunnel 우선 검토, 미확정 |

이 문서의 Owner Decision 상태는 문서 제출 요청에 포함된 고정 입력이다. Review,
Merge, Runtime 검증과 Production 승격은 별도 상태다.

## 3. Context / Problem

기존 ADR-0016은 Mac mini + Docker Compose를 Primary로, AWS를 Disaster Recovery로
배치하는 방향을 기록한다. 이번 Owner Decision은 V1 Production Primary를 AWS로 옮기며,
Mac mini를 Production Primary에서 제외한다. 기존 문서를 고쳐 과거 결정을 지우지 않고
이번 ADR에서 대체 범위를 명시해야 한다.

현재 Repository에는 Platform Gateway와 Platform Core의 Dockerfile / Compose가 있으나
배포 범위는 Platform 두 Process에 한정된다. Finance와 Carelog에는 현재 Dockerfile이
없다. Platform Compose는 개발용 PostgreSQL 16과 redis:7을 포함하며, Production
Topology의 증거가 아니다. 네 Service의 RDS Schema / Role / Migration, 이미지 빌드,
CI/CD, Valkey 호환성, Health / Recovery Evidence는 아직 갖춰지지 않았다.

### 확인된 Repository Snapshot

확인일은 2026-10-12다. SHA는 Repository 실제 HEAD이며 Production 상태를 증명하지 않는다.

| Repository | Branch | HEAD SHA | 확인 사실 |
|---|---|---|---|
| harness-foundation-docs | main | 3722a30d8d6a7d12c55376061e07a6a9b5b14ba6 | ADR-0015 / 0016 / 0020 / 0021, ADR Index, 문서 규칙 |
| platform-services | main | 02821f230ce828ceffd6f126b056d3a018abd509 | Gateway/Core Dockerfile과 Compose, Identity·Shared AI·Shared Audit module |
| finance-harness-be | main | 2b4a18e84a448400237b13c4afecc3cbb4504892 | Java 21 / Spring Boot 4.1.0, Flyway, PostgreSQL 18.4 Testcontainers |
| carelog-be | dev | daf55ab033ee155786b93fe26c37e758121ee541 | Java 17 / Spring Boot 3.4.5, Flyway, PostgreSQL 16·Redis 개발 Compose |

네 Repository의 Open Issue 조회 결과는 모두 0건이다. 저장소별 구현 Blocker와 계획은
AWS MVP Deployment Plan에 기록한다.

## 4. Owner Decision — Fixed

| Boundary | V1 결정 |
|---|---|
| AWS Region | ap-northeast-2 (Seoul) |
| Primary Compute | EC2 |
| Deployment | Docker Compose |
| Database | RDS PostgreSQL |
| State Store | Valkey |
| Valkey Runtime | EC2 내부 Docker Container |
| Gateway | Spring Cloud Gateway / WebFlux 독립 Process |
| Platform Core | 단일 Spring MVC JVM: Shared Identity, Shared AI, Shared Audit |
| Product Runtime | Finance Backend와 Carelog Backend는 각각 독립 Spring Service |
| Internal Communication | HTTP/JSON |
| AI Streaming | SSE |
| Authentication | 기존 JWT / Refresh Token / OAuth 계약 유지 |
| Data Ownership | 서비스별 PostgreSQL Schema / Migration / DB 권한 소유권 유지 |
| Mac mini | Production Primary에서 제외, 개발·테스트 용도 |
| Ingress | Cloudflare Tunnel 우선 검토, 미확정 |
| Cost | 월 10,000 KRW 목표, Hard Cap 아님; 출시 속도와 안정성 우선 |

## 5. EC2 + Docker Compose 선택 이유

- 기존 Platform Repository에는 Gateway와 Platform Core의 독립 Dockerfile 및 Compose
  기반이 있어 소규모 단일 Host Runtime으로 이어갈 수 있다.
- 한 Host의 Compose는 현재 V1의 네 JVM과 Valkey를 빠르게 배치하고 로컬 Docker로
  구성 검증하기 쉽다.
- EC2 운영 경계가 명확하고 ECS / Lambda 도입보다 첫 배포에 필요한 구성 요소와
  운영 절차가 적다.
- 별도 RDS를 사용하므로 Application Host와 Business Data의 장애·수명주기를 분리한다.
- 비용 목표는 상한이 아니므로, 운영 안정성·출시 시간을 우선한다.

Trade-off는 EC2 한 대가 Application 단일 장애점이며, Host 자원과 Compose Lifecycle을
직접 운영해야 한다는 점이다. Compose는 Host HA, 자동 복구, 스케일 아웃 또는 Database
Durability를 제공하지 않는다. JVM 메모리와 CPU 사용량이 미측정됐으므로 후보 사양은
실측 후 바꿀 수 있다.

## 6. RDS PostgreSQL 선택 이유와 Data Ownership

RDS는 V1의 PostgreSQL 운영·Patch·Backup / PITR 기능을 관리형 DB 경계로 분리한다.
Architecture target은 ADR-0020과 같이 하나의 Physical PostgreSQL Instance와 하나의
Ranikun Labs Application Database이며, Data Ownership은 Schema 단위로 분리한다.

- identity Schema는 Shared Identity가 소유한다.
- carelog Schema와 해당 Migration은 Carelog가 소유한다.
- finance Schema와 해당 Migration은 Finance가 소유한다.
- audit Schema와 해당 Migration은 Shared Audit이 소유한다. 현재 Schema / Store는
  생성·배포됐다고 확인되지 않는다.
- 각 서비스는 자기 Schema만 쓰며 다른 Schema에 직접 접근하지 않는다.
- Cross-service Foreign Key와 OLTP Cross-schema JOIN은 추가하지 않는다.
- Role / Grant와 Flyway 설정을 각 Repository에서 검증한다. Superuser나 공용
  Application Role을 서비스 권한으로 사용하지 않는다.

ADR-0020을 대체하지 않는다. RDS Engine Major Version, 정확한 DB Class, Multi-AZ,
Storage, Backup Retention은 별도 검증·Owner Decision이 필요하다.

## 7. Valkey와 Redis Client 호환성

V1 State Store는 Redis Server가 아닌 공식 Valkey Docker Image다. 기존 Spring Data
Redis / Lettuce 의존, Redis라는 Package / Class / Client 이름과 Spring 설정 계약은
무조건 바꾸지 않는다. 기존 Auth·OAuth State·JWT Blacklist·SCG RateLimiter의 키,
TTL, failure behavior와 요청 계약을 보존한다.

배포 Gate에서 선택된 Image Version으로 GETDEL, TTL, EVAL, EVALSHA 호환성을 검증한다.
Valkey는 Docker Internal Network에서만 접근하며 Host Port를 Publish하지 않는다.
AOF / RDB, Volume, Backup, Restore, Secret과 ACL 설정은 아직 선택되지 않았으므로
임의 고정하지 않는다. 재시작, 만료, 데이터 유실, 복구 후 Auth·RateLimiter 동작을
검증하기 전 Production Ready로 보지 않는다.

## 8. Runtime / Module Ownership

- Gateway는 Spring Cloud Gateway / WebFlux 독립 JVM이다.
- Platform Core는 단일 Spring MVC JVM이다. Identity, Shared AI와 Shared Audit은
  독립 Runtime이나 추가 Process가 아니라 소유 Module로 둔다.
- Finance와 Carelog는 독립 JVM과 서비스별 API / Data Ownership을 유지한다.
- Shared AI / Audit Module이 Platform Core 같은 JVM에서 실행돼도 Module, Domain,
  Migration과 정책 소유권은 합쳐지지 않는다.
- Repository에는 Carelog Gateway Process도 존재하지만 이번 Owner Decision은 공용
  Gateway를 명시한다. 별도 Carelog Gateway를 Production에 포함할지는 별도 Cutover
  확인 전 V1 Count에 포함하지 않는다.
- 실제 목표 JVM은 Gateway 1, Platform Core 1, Finance 1, Carelog 1로 총 4개다.
  Shared AI와 Shared Audit은 Platform Core에 포함되므로 JVM을 추가하지 않는다.

## 9. Security / Network Boundary

- Public Traffic은 검증 후 선택한 Ingress에서 Gateway로만 전달한다. Gateway 외
  App Port, RDS 5432와 Valkey 6379를 인터넷에 열지 않는다.
- RDS는 Public Access를 끄고 Private Subnet에 둔다. RDS Security Group은 EC2
  Application Security Group만 5432로 허용한다.
- Valkey는 Docker 내부 Network에 두고 Host Port Mapping을 만들지 않는다.
- 현재 JWT / Refresh Token / OAuth 계약을 보존하고, OAuth State의 1회 소비 및 TTL,
  JWT Blacklist, RateLimiter의 장애 시 Fail-Closed 동작을 확인한다.
- Secret 값은 Repository, Image, 문서와 일반 로그에 기록하지 않는다. AWS 권한은
  Instance Role 같은 단기 권한을 후보로 검증하며 장기 Access Key를 배포하지 않는다.
- 내부 동기 호출은 HTTP/JSON, AI Token Stream은 SSE다. 내부 호출을 Public Gateway
  경유로 강제하지 않는다.
- TLS, RDS 인증서 검증, at-rest Encryption과 Secret Retrieval은 상세 구현 Gate에서
  확인한다.

## 10. Deployment / Recovery Decision

- CI에서 Test 후 Image를 빌드하고, 확정된 Registry에 commit 또는 release 식별자로
  불변 Image를 발행한다. 배포는 Tag가 아니라 digest를 기록하고 이전 digest로
  Rollback할 수 있어야 한다.
- Production Compose는 RDS를 외부 Database로 연결하고 로컬 PostgreSQL Container를
  포함하지 않는다.
- Compose는 Health Check, Restart Behavior, CPU / Memory Limit과 Log 경계를 명시한다.
  현재 CPU / Memory limit은 없으므로 값을 임의 고정하지 않고 JVM / Host 실측을 먼저
  남긴다.
- RDS Backup / PITR와 Valkey Persistence / Backup / Restore를 각각 검증한다.
- RPO, RTO, RDS Multi-AZ와 Retention은 V1 Owner 미결정으로 남겨 둔다.
- Recovery Drill이 끝나기 전에 RPO / RTO 달성 또는 Multi-AZ 가용성을 주장하지 않는다.
- AWS Resource 생성과 Production 배포는 별도 변경 승인 후 운영자가 수행한다.

## 11. Alternatives Considered

| Option | 장점 | 비용 / 위험 | Decision |
|---|---|---|---|
| EC2 + Docker Compose + RDS PostgreSQL + Valkey Container | 단일 Host 운영 단순성, managed PostgreSQL, V1 요구에 직접 대응 | EC2 단일 장애점, 직접 Patch / Host 복구, CPU·Memory 경쟁 | V1 Owner Decision |
| EC2 Compose + Host PostgreSQL | 서비스 통합과 초기 구성 단순 | OS / Disk / Backup / Restore / DB Patch 운영 증가, App·DB 장애 도메인 결합 | 선택하지 않음; RDS Owner Decision과 불일치 |
| ECS / Lambda | 관리형 배포·Scale / Process 격리 옵션 | 초기 Container / IAM / Networking / Service 구성이 커짐; 현재 workload evidence 부족 | V2 후보, V1 필수 아님 |
| Mac mini Production Primary + AWS DR | 기존 ADR-0016의 History와 연속성 | V1 Owner Decision이 Production Primary에서 Mac mini를 제외 | 이 ADR이 명시된 범위만 대체 |
| Redis Server | 기존 Client 이름에 익숙함 | V1 Owner Decision은 Valkey Server를 명시 | 선택하지 않음; Client 명칭 유지 |
| Valkey를 ElastiCache로 배치 | 관리형 운영 | V1 Valkey 배치는 EC2 Docker Container로 고정 | V2 후보; V1에서 채택하지 않음 |

## 12. Risks and Constraints

- 단일 EC2 장애, AZ 장애 또는 Host Disk 손상은 Application 전체에 영향을 준다.
- 메모리 상한과 Xmx가 없고 JVM 4개의 실측 메모리·CPU가 없어 EC2 Class는
  Capacity Candidate일 뿐 검증된 용량이 아니다.
- 현재 Database Major Version이 Platform / Carelog PostgreSQL 16과 Finance
  PostgreSQL 18.4 Testcontainers로 다르다. 공통 RDS Engine Version 호환성 테스트가
  필요하다.
- Carelog / Finance / Identity의 현재 Flyway·Schema 초기화가 ADR-0020의 단일 DB와
  서비스 Schema Target에 맞지 않는다.
- Dockerfile / CI / Registry / Secret / Health / Rollback이 모두 Production Evidence를
  갖춘 것으로 확인되지 않는다.
- Valkey Version, persistence와 데이터 복구 정책은 미결정이며 Auth Security에 영향이 있다.
- Shared AI의 현재 구현은 동기 OpenAI Slice다. V1 Owner의 SSE 요구와 별도 Release
  Evidence가 필요하다.
- Shared Audit Module의 현재 Default Capture는 Unavailable이다. Durable Capture와
  Release를 주장하지 않는다. V1에서 실제 필요한 비동기 Use Case가 확인되면 별도 Gate를 연다.
- 비용은 Region·HA·Storage·Backup·Network·Usage·Tax·FX에 따라 달라지므로
  estimate는 공식 Pricing Calculator 재확인 전 견적이 아니다.

## 13. V2 Optimization Entry Conditions

V2 후보는 V1 Production에서 비용·Latency·CPU / Memory·PostgreSQL Connection / Query·
Valkey Latency / Memory·AI Latency·Deployment Time·복구 결과를 수집한 뒤 검토한다.
문제 → Baseline → Hypothesis → Change → Measurement → Decision 순서로 기록한다.

Aurora Serverless v2, Upstash Redis, ElastiCache Serverless for Valkey, SQS Standard /
FIFO, PostgreSQL PGMQ, NATS JetStream, ECS / Lambda, 비동기 AI Worker와 DB Pool /
Query / Cache 최적화는 모두 후보이며 V2 필수 도입이 아니다. 실제 Async Use Case가
V1에서 발견되면 해당 요구와 durability를 별도 Architecture Gate로 기록한다.

## 14. Existing ADR 관계와 Supersession

| ADR | 계속 유효한 범위 | ADR-0022 관계 |
|---|---|---|
| ADR-0015 | 내부 HTTP/JSON, AI SSE, Deferred 기술 Trigger | 통신 기본값을 유지 |
| ADR-0016 | Mac mini Primary라는 기존 결정을 포함한 과거 기록; 당시 DR 안전 원칙 | Primary / AWS-DR-only 해석을 부분 대체; 원문은 수정·삭제하지 않음 |
| ADR-0017 | Gateway와 Identity의 물리화 / 소유 경계 | Gateway와 Platform Core Module 관계 유지 |
| ADR-0018 | Shared AI의 Platform Core 논리 Module 배치 | 같은 JVM 배치를 유지; Production AI / Streaming을 완료로 주장하지 않음 |
| ADR-0020 | 하나의 RDS PostgreSQL Application DB, 서비스별 Schema / Migration Ownership | 그대로 유지 |
| ADR-0021 | Shared Audit Architecture와 NATS JetStream 승인 상태 | Architecture 승인은 유지; Broker 미배포와 V1 채택을 구분 |

### Explicit Partial Supersession

이 ADR은 ADR-0016 원문을 수정하지 않고 다음 범위만 대체한다.

1. V1 Production Primary를 Mac mini에서 AWS EC2로 변경한다.
2. AWS를 V1의 DR-only target으로 두던 배치를 Primary로 변경한다.
3. ADR-0016의 기존 4시간 RTO / 15분 RPO는 과거 Mac mini Primary / AWS DR
   시나리오의 역사적 목표로 남기며 새 AWS Primary에는 적용하지 않는다. 이번 Owner
   Decision은 새 RPO / RTO를 설정하지 않았다.

ADR-0016의 Human-approved Failover / Write Fencing 원칙은 새 Recovery Decision이
대체하기 전까지 충돌하지 않는 범위에서 유지한다.

## 15. Open Owner Decisions / Gates

다음은 이 ADR에서 FIXED 처리하지 않는다.

- Valkey Image Version / Tag
- Valkey AOF / RDB, Volume, Backup, Restore 및 접근 인증 방식
- 공통 RDS PostgreSQL Engine Version과 DB Class
- RDS Multi-AZ 여부, Backup Retention, V1 RPO / RTO
- AWS Account / IAM / VPC / Egress와 IaC 소유 Repository
- GHCR / ECR 등 Image Registry와 비용 / Retention
- SSM Parameter Store / Secrets Manager 등 Secret Store
- Cloudflare Tunnel 계정 / Zone / Plan / 실제 Origin 검증
- ARM64 빌드·런타임 호환성
- API traffic / JVM memory / DB connection / workload baseline

## 16. Review and Adoption Boundary

이 ADR을 제안하는 PR은 Automatic Merge하지 않는다. Merge 이후에도 구현·운영
작업은 별도 Issue, PR과 Evidence가 필요하다. AWS Resource 생성, 변경, 삭제와
Production 배포는 이 문서 작성 권한에 포함되지 않는다.

Production adoption gate는 모든 V1 Service의 Image / CI, Secret, Network, Schema
권한, Valkey compatibility / restore, Gateway/Auth / Product / AI / Audit E2E, Backup /
Restore, Monitoring, Rollback과 Owner Go-Live Checklist가 통과할 때 별도로 기록한다.

