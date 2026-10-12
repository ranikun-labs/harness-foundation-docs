---
title: "AWS V1 MVP Production Primary Runtime을 4개 독립 EC2로 정한다"
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
  - "V1 Production Primary는 ap-northeast-2의 EC2와 Docker Compose이며 Gateway, Platform Core, Finance, Carelog를 각각 독립 EC2에 둔다"
  - "공통 RDS PostgreSQL 물리 Instance 한 개를 사용하되 Database/Schema/Role/Migration 소유권은 서비스별로 보존하고 공통 Version은 호환성 Gate 이후 정한다"
  - "Valkey 서버는 Valkey 공식 Image로 고정하고 Platform Core 동거를 우선 후보로 두되 최종 위치는 Owner 승인 대상이다"
  - "Cloudflare Tunnel은 우선 검증 후보이며 선택된 Ingress가 아니다"
  - "Grafana Cloud Free와 EC2별 Alloy를 중앙 관측 후보로 두며 계측 부재를 측정 완료로 처리하지 않는다"
  - "7일은 Baseline 측정 목표이며 기간 경과만으로 리소스를 변경하거나 삭제하지 않는다"
  - "V2 통합과 장기 후보는 동일 기능·보안·복구 증거 및 별도 Owner 결정을 요구한다"
  - "이 ADR은 AWS 자원 생성, Grafana Cloud 가입, Runtime 구현, Production 배포 또는 Go-Live를 승인하지 않는다"
affected_docs:
  - docs/adr/README.md
  - docs/decisions/decision-log.md
  - docs/decisions/README.md
  - docs/architecture/README.md
  - docs/architecture/backend-service-foundation/README.md
  - docs/architecture/backend-service-foundation/aws-v1-mvp-deployment-plan.md
  - docs/architecture/backend-service-foundation/aws-v2-optimization-roadmap.md
evidence_refs:
  - OWNER-DECISION-2026-10-12
  - REPO-HEADS-2026-10-12
  - ADR-0015
  - ADR-0016
  - ADR-0020
  - ADR-0021
supersedes: []
superseded_by: []
superseded_scope:
  - "ADR-0016의 V1 Production Primary인 Mac mini 배치만 AWS EC2 Primary로 대체한다"
  - "ADR-0016의 AWS를 DR 전용으로 두는 해석만 대체한다"
  - "ADR-0016의 역사적 4시간 RTO / 15분 RPO를 새 AWS Primary 목표에 자동 적용하는 해석만 대체한다"
remaining_valid_scope:
  - "ADR-0016 원문과 당시 Mac mini Primary 결정 이력"
  - "Failover, Promotion, Write Enable, Fencing은 Human Approval을 유지하고 무검증 Write를 금지한다"
  - "기존 4시간 RTO / 15분 RPO는 과거 DR 시나리오의 이력으로 남으며 새 AWS Primary 목표가 아니다"
replacement_decision_refs:
  - ADR-0016
  - DEC-071
---

# ADR-0022: AWS V1 MVP Production Primary Runtime을 4개 독립 EC2로 정한다

> Owner가 지정한 AWS Primary 방향은 고정되어 있다. 이 ADR은 PR #32가 Merge되기 전까지
> Foundation Docs의 Canonical 반영이 완료되지 않은 제안이다. 문서 Merge도 AWS 배포
> 승인이나 운영 준비 완료를 뜻하지 않는다.

## 1. 결정

Ranikun Labs의 모든 Product와 Shared Platform이 공통으로 사용하는 Production
Infrastructure는 서울 Region ap-northeast-2에 둔다. V1은 기존 Spring Runtime과
인증·데이터 계약을 보존하면서 서비스별 독립 배포, 재시작, JVM 및 자원 측정이 가능한
EC2 + Docker Compose 기반이다.

| 호스트 | Runtime | 크기 후보 |
|---|---|---|
| EC2 #1 | Spring Cloud Gateway / WebFlux | t4g.small |
| EC2 #2 | Platform Core / Spring MVC: Shared Identity, Shared AI, Shared Audit | t4g.medium |
| EC2 #3 | Finance Backend | t4g.small |
| EC2 #4 | Carelog Backend | t4g.small |

크기와 ARM64는 초기 후보일 뿐 확정 용량이 아니다. 실제 JVM Heap/Native Memory,
Container RSS, CPU Credit, 이미지 호환성과 부하 시험으로 검증한다. Mac mini는
개발·테스트 용도이며 Production Primary에서 제외한다.

## 2. Database와 State Store

모든 서비스는 공통 RDS PostgreSQL 물리 Instance 한 개를 사용한다. RDS는 Private이며
최소 두 AZ의 Subnet Group을 둔다. RDS Multi-AZ 여부, Instance Class, 백업 보존,
Recovery 목표는 가용성과 비용 근거를 검토해 Owner가 정한다. PostgreSQL 16과 18 계열
설정 이력이 다르므로 Platform, Finance, Carelog의 JDBC와 Flyway 호환성 검증 전에는
공통 Engine Version을 고르지 않는다.

물리 Instance 공유는 데이터 소유권 공유를 뜻하지 않는다. 서비스는 자체 Database 또는
Schema, Role/Grant와 Migration 이력을 소유한다. Terraform은 Flyway를 실행하지 않고
RDS Master Credential을 애플리케이션에 전달하지 않는다. 이 결정은 ADR-0020의
서비스 데이터 소유권을 바꾸지 않는다.

V1 서버 구현체는 Valkey다. 기존 Spring Data Redis/Lettuce 계약과 OAuth State GETDEL,
TTL, JWT Blacklist, Lua Rate Limiter와 fail-closed 동작은 유지한다. Platform Core EC2
안에 Valkey Container를 동거시키는 안을 비용 우선 후보로 설계하고, Core와 Gateway/
Carelog 간 Private VPC 통신·CPU/Memory 경합·장애 영향 검토 후 최종 위치를 Owner가
승인한다. 전용 EC2는 비교 대안이다. Public Port는 열지 않는다. Blacklist 데이터
손실은 인증 우회 위험이 있으므로 복구/무효화 검증 전 Release Blocker다.

## 3. Network와 Ingress

EC2 간 호출은 Private IP 또는 내부 DNS의 HTTP/JSON이며 AI Streaming은 SSE다. Gateway만
외부 요청의 진입점이다. SSH/22는 기본 차단하고 SSM Session Manager를 우선한다.
RDS와 Prometheus Endpoint는 Public 접근을 허용하지 않는다.

NAT Gateway, ALB와 VPC Endpoint는 필수성·비용 검증 없이 기본 생성하지 않는다. 이 선택은
상시 비용을 낮추지만 EC2의 패키지, Registry, SSM, Cloudflare, Grafana Cloud와 외부 API
연결을 위해 Public IPv4와 Outbound 경로를 필요로 할 수 있다. 구체 경로·Egress 권한·
IPv4 비용과 노출면은 배포 전 승인한다.

Cloudflare Tunnel은 Outbound 연결 방식의 우선 검증 후보이지 최종 채택이 아니다.
검증 전에는 외부 Ingress 준비 완료로 표현하지 않는다. V1에서 Kubernetes/EKS,
ECS/Fargate, Lambda 전면 전환, Aurora Serverless v2 및 새 NATS/SQS/PGMQ 배포를
요구하지 않는다. ADR-0021의 Audit Architecture 승인은 V1 Broker 배포를 의미하지 않는다.

## 4. Central Observability와 Baseline

각 EC2에서 Grafana Alloy가 Host, Container, Java Process 및 제공되는 경우
Actuator/Micrometer 지표를 Grafana Cloud로 보낸다. EC2마다 Grafana를 설치하지 않는다.
RDS CloudWatch 지표와 Alloy 내 Valkey Exporter는 권한·카디널리티·비용을 확인한 뒤
선택한다. 모든 지표는 service, instance, environment를 구분한다. Prometheus Endpoint는
외부에 공개하지 않는다.

현재 Application Repository 조사에서는 Gateway/Core와 Finance에 Prometheus Registry가
없고 Carelog에 Actuator가 없다. 따라서 HTTP/JVM/JDBC 지표 수집은 구현 완료가 아니다.
각 코드 소유팀의 별도 계측 Task를 수행하고 실제 샘플이 대시보드에 들어온 뒤 측정한다.
Grafana Cloud Free의 현재 시리즈/보존 한도는 가입 전에 재확인한다. Cloud 보존과 별개로
7일 실험의 Dashboard Export, Benchmark 요약, Image Digest와 비용 근거를 비밀정보 제거 후
Repository Evidence로 보관한다.

V1 운영을 시작한 뒤 최초 7일 동안 서비스별 CPU/RSS/JVM/GC, HTTP Latency와 오류,
Container 재시작, DB Connection, Valkey와 비용을 기록한다. 세 명 수준의 실사용만으로
P95/P99를 비교하지 않는다. 재현 가능한 동일 k6 Scenario·데이터·동시성·Ramp·Duration을
사용하고 Warm-up과 부하 생성기 병목을 분리한다. Production 부하에는 별도 Owner 승인,
읽기 전용 대상, 제한과 중단 기준이 필요하다.

## 5. V2 비용·성능 최적화

7일 경과만으로 Infrastructure를 변경하거나 삭제하지 않는다. 동일 기능, 요청 부하,
Dataset, Image Digest, JVM 설정을 맞춘 Evidence로 4 EC2를 2대 또는 1대로 통합할 후보를
검토한다. JVM Heap/Native Memory와 GC, Docker 제한, RDS Class, Connection Pool과
불필요한 상시 자원을 함께 최적화한다.

전환은 새 후보 환경 생성, 이미지와 Route/Cloudflare/DB/Valkey/Secret/Monitoring 확인,
동일 부하 비교, 승인된 Canary, Rollback 창, 기존 V1 보존 순서로 진행한다. 공통 RDS,
영속 Volume과 복구 Snapshot을 자동 교체/삭제하지 않는다. Terraform Destroy/Replace에는
명시적 별도 Owner 승인이 필요하다.

Aurora Serverless v2, Managed Valkey, SQS/PGMQ, ECS/Lambda는 장기 검토 후보이지 도입
의무가 아니다. 월 비용 감소, API 지연/오류율, GC/Memory 안정성, 실패 영향과 복구 능력을
함께 만족할 때 새 Decision으로 검토한다. 월 ₩10,000은 최적화 목표이지 V1의 예산 상한이
아니다.

## 6. 기존 결정과의 관계

ADR-0016은 삭제하거나 본문을 다시 쓰지 않는다. 본 ADR은 Mac mini를 Production Primary로
두던 범위와 AWS를 DR 전용으로 보던 해석만 부분 대체한다. Human 승인 Failover/Write
Fencing 원칙 및 역사적 RTO/RPO는 보존한다.

ADR-0015의 HTTP/JSON, SSE와 Messaging 경계, ADR-0020의 PostgreSQL Schema/Role/
Migration 소유권, ADR-0021의 Shared Audit/JetStream Architecture는 그대로 유지한다.
새 Broker는 V1 배포 범위가 아니다.

## 7. 승인 Gate와 상태

AWS Account/Region과 Egress, RDS 공통 Engine/HA/Backup, Valkey 위치·지속성·복구,
ARM64 이미지와 Secret 주입, Cloudflare Ingress, Observability 권한·보존, 비용 및
Rollback을 Owner가 승인해야 Infrastructure 계획이 실행 가능하다. Terraform Plan에서
Destroy/Replace가 나오면 계획을 중지한다.

Owner Decision: fixed; ADR Record: proposed; AWS Resource: not created; Runtime:
not deployed; Monitoring: not collecting; Production Release: not approved.
