---
title: "AWS V1 MVP Production Primary Runtime을 4개 독립 EC2로 정한다"
adr_id: "ADR-0022"
document_status: in_review
decision_status: accepted_with_constraints
decision_status_scope: owner_policy_direction_only
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-10-12"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "V1 Production Primary는 ap-northeast-2의 EC2와 Docker Compose이며 Gateway, Platform Core, Finance, Carelog를 각각 독립 EC2에 둔다"
  - "공통 RDS PostgreSQL 물리 Instance와 단일 Application Database를 사용하며 서비스별 Schema/Role/Migration 소유권을 보존하고 공통 Version은 호환성 Gate 이후 정한다"
  - "Valkey 서버는 Valkey 공식 Image를 사용하고 Core 동거는 후보로 검토하며, 동거 시 TCP/6379는 Private ENI와 허용된 Security Group 경로만 제공하고 Public 노출을 금지한다"
  - "Cloudflare Tunnel은 우선 검증 후보이며 선택된 Ingress가 아니다"
  - "Grafana Cloud Free와 EC2별 Alloy를 중앙 관측 후보로 두며 계측 부재를 측정 완료로 처리하지 않는다"
  - "최초 7일 Baseline은 Owner 승인 Pilot/Go-Live가 대표 트래픽을 제공한 뒤 시작하며, 기간 경과만으로 리소스를 변경하거나 삭제하지 않는다"
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
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-0022: AWS V1 MVP Production Primary Runtime을 4개 독립 EC2로 정한다

> Owner 정책 방향은 2026-10-12 요청에 따라 제약과 함께 승인됐다. 이 ADR 문서는
> `in_review`이며 공식 문서 최종 승인자·승인일은 확인되지 않았다. ADR-0016의 제안된
> 부분 대체 관계와 발효일도 확인되지 않았으므로 이 문서에서 형식상 supersession으로
> 기록하지 않는다. AWS Provisioning, Runtime 구현·배포와 Production Go-Live는 승인되거나
> 실행되지 않았다. 문서 Merge도 이 운영 승인을 의미하지 않는다.

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

모든 서비스는 공통 RDS PostgreSQL 물리 Instance와 하나의 Ranikun Labs
Application Database를 사용한다. RDS는 Private이며 최소 두 AZ의 Subnet Group을 둔다.
RDS Multi-AZ 여부, Instance Class, 백업 보존, Recovery 목표는 가용성과 비용 근거를
검토해 Owner가 정한다. PostgreSQL 16과 18 계열 설정 이력이 다르므로 Platform, Finance,
Carelog의 JDBC와 Flyway 호환성 검증 전에는 공통 Engine Version을 고르지 않는다.

물리 Instance와 Application Database 공유는 데이터 소유권 공유를 뜻하지 않는다.
ADR-0020에 따라 각 서비스는 자기 Schema, Role/Grant와 Migration 이력을 소유한다.
서비스별 Database를 추가하지 않는다. Terraform은 Flyway를 실행하지 않고 RDS Master
Credential을 애플리케이션에 전달하지 않는다.

V1 서버 구현체 후보는 Valkey다. 기존 Spring Data Redis/Lettuce 계약과 OAuth State
GETDEL, TTL, JWT Blacklist, Lua Rate Limiter와 fail-closed 동작은 유지한다. Platform
Core EC2 동거는 비용 우선 후보이며 전용 EC2는 비교 대안이다. 동거를 선택하면 Valkey는
Core Compose의 bridge network에서 실행한다. Container 내부 TCP/6379은 해당 network에서
수신하고, Compose는 `host_ip: ${VALKEY_PRIVATE_ENI_IP}`로만 host TCP/6379를 공개한다.
이 주소는 Valkey용 Private ENI이며 Public IPv4/EIP를 연결하지 않는다. Core 내부 client는
Docker bridge network를, Gateway/Carelog client는 Private VPC 경로를 사용한다.
Security Group의 TCP/6379 Ingress는 Gateway와 Carelog Security Group 참조로만 허용하고
CIDR 공개 규칙을 두지 않는다. Public Interface bind, `0.0.0.0:6379`, `::/0`,
`0.0.0.0/0` 규칙은 금지한다. ENI, ACL·credential, CPU/Memory 경합과 복구는 별도
Owner Gate다. Blacklist 데이터 손실은 인증 우회 위험이므로 복구/무효화 검증 전 Release
Blocker다.

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
ECS/Fargate, Lambda 전면 전환, Aurora Serverless v2 및 신규 Broker Provisioning을
요구하지 않는다. 새 NATS 구현은 현재 목표에서 제외되며, 현재 Owner 정책 방향은 SQS
Target이다. SQS는 target 방향만을 뜻하며 Queue 유형·Use Case 승인·AWS Provisioning을
뜻하지 않는다. 이 Provider 정책 문서는 stacked PR #37에서 별도 검토 중이고, 공식 문서
최종 승인 및 ADR-0021과의 형식상 supersession 발효 여부는 확인되지 않았다.

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

최초 7일 Baseline은 Owner가 별도로 승인한 Pilot 또는 Go-Live가 대표 트래픽을
제공하기 시작한 뒤 기록한다. Pilot 증거는 Pilot으로 표시하며, 대표 트래픽과 같은
Baseline window로 인정한다는 Owner 승인이 없는 한 7일 Baseline에 포함하지 않는다.
이 관측 기간은 최초 Go-Live의 사전 Gate가 아니라 V2 최적화를 위한 증거다. 시작일,
대표 트래픽 기준, 안정 일수 기준, Pilot/Go-Live 일정과 중단 기준은 미결정이며 추정해
승인하지 않는다. 서비스별 CPU/RSS/JVM/GC, HTTP Latency와 오류, Container 재시작,
DB Connection, Valkey와 비용을 기록한다. 세 명 수준의 실사용만으로 P95/P99를 비교하지
않는다. 동일 k6 Scenario·데이터·동시성·Ramp·Duration을 사용하고 Warm-up과 부하
생성기 병목을 분리한다. Production 부하에는 별도 Owner 승인, 읽기 전용 대상, 제한과
중단 기준이 필요하다.

## 5. V2 비용·성능 최적화

7일 경과만으로 Infrastructure를 변경하거나 삭제하지 않는다. 동일 기능, 요청 부하,
Dataset, Image Digest, JVM 설정을 맞춘 Evidence로 4 EC2를 2대 또는 1대로 통합할 후보를
검토한다. JVM Heap/Native Memory와 GC, Docker 제한, RDS Class, Connection Pool과
불필요한 상시 자원을 함께 최적화한다.

전환은 새 후보 환경 생성, 이미지와 Route/Cloudflare/DB/Valkey/Secret/Monitoring 확인,
동일 부하 비교, 승인된 Canary, Rollback 창, 기존 V1 보존 순서로 진행한다. 공통 RDS,
영속 Volume과 복구 Snapshot을 자동 교체/삭제하지 않는다. Terraform Destroy/Replace에는
명시적 별도 Owner 승인이 필요하다.

Aurora Serverless v2, Managed Valkey, PGMQ, ECS/Lambda는 장기 검토 후보이지 도입
의무가 아니다. SQS는 현재 Owner 정책 Target 방향이지만 Queue 유형과 사용 사례는
미결정이고 이 ADR은 AWS Queue Provisioning을 승인하지 않는다. 월 비용 감소, API 지연/
오류율, GC/Memory 안정성, 실패 영향과 복구 능력을 함께 만족할 때 별도 구현·운영 승인을
검토한다. 월 ₩10,000은 최적화 목표이지 V1의 예산 상한이 아니다.

## 6. 기존 결정과의 관계

ADR-0016의 원문과 과거 승인 기록은 보존한다. Owner 정책 방향은 Mac mini
Production Primary와 AWS DR-only 해석을 제한적으로 바꾸려는 것이지만, 이 ADR 문서는
in_review다. 공식 최종 문서 승인과 발효일이 확인될 때까지 ADR-0016과의 형식상
부분 대체 관계는 발효된 것으로 표시하지 않는다. Human 승인 Failover/Write Fencing
원칙 및 역사적 RTO/RPO 기록은 보존한다.

ADR-0015의 HTTP/JSON, SSE와 Messaging 경계와 ADR-0020의 단일 Application Database,
서비스별 Schema/Role/Migration 소유권은 유지한다. ADR-0021/DEC-070의 NATS JetStream
승인은 역사적 결정 기록으로 보존하되, 새 NATS 구현 목표는 현재 Owner 방향에서 제외한다.
현재 SQS Target 방향과 미Provisioning 상태는 stacked PR #37에서 별도 검토 중이며, 이는
AWS Resource 생성 승인이 아니다.

## 7. 승인 Gate와 상태

AWS Account/Region과 Egress, RDS 공통 Engine/HA/Backup, Valkey 위치·지속성·복구,
ARM64 이미지와 Secret 주입, Cloudflare Ingress, Observability 권한·보존, 비용 및
Rollback을 Owner가 승인해야 Infrastructure 계획이 실행 가능하다. Terraform Plan에서
Destroy/Replace가 나오면 계획을 중지한다.

Owner policy direction: accepted_with_constraints; ADR document: in_review;
official final document approval: unconfirmed; ADR-0016 supersession/effective date:
unconfirmed; AWS provisioning: not approved and not performed; Runtime: not deployed;
Monitoring: not collecting; Production Go-Live: not approved.
