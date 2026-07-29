---
title: "공통 플랫폼 통신·메시징·확장 기준을 정의한다"
adr_id: "ADR-0015"
document_status: draft
decision_status: open
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-07-29"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "현재 Runtime, 목표 논리 구조, Deferred 기술을 분리한다"
  - "내부 서비스 호출은 외부 Gateway를 경유하지 않는다"
  - "일반 Product 요청마다 Shared Identity를 동기 호출하지 않는다"
  - "Shared AI는 Product Prompt·Workflow·Domain Policy를 소유하지 않는다"
  - "NATS JetStream, gRPC, Kafka, Kubernetes는 Trigger 충족 전 도입하지 않는다"
  - "실제 Secret 값과 Host·IP를 Architecture Repository에 저장하지 않는다"
affected_docs:
  - docs/adr/README.md
  - docs/architecture/backend-service-foundation/README.md
  - docs/architecture/backend-service-foundation/service-boundaries.md
  - docs/architecture/backend-service-foundation/service-communication-policy.md
  - docs/architecture/backend-service-foundation/distributed-consistency-policy.md
  - docs/contracts/backend-service-foundation/identity-token-contract.md
  - docs/decisions/decision-log.md
evidence_refs:
  - "DEC-057"
  - "DEC-058"
  - "DEC-059"
  - "DEC-060"
  - "RPL-14"
  - "care-log/carelog-be PR #37"
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-0015: 공통 플랫폼 통신·메시징·확장 기준을 정의한다

> 이 ADR은 Backend Service Foundation의 공통 선택을 기록하는 Proposed
> Architecture Decision이다.
>
> ```text
> Decision accepted
> ≠ Runtime implemented
> ≠ Infrastructure provisioned
> ≠ Product released
> ```

## 1. Decision Summary

Ranikun Labs의 Product Service와 Shared Service는 외부·내부 동기 통신에
HTTP/JSON을 기본으로 사용하고, AI Token Streaming에는 SSE를 사용한다.
내부 서비스 호출은 외부 Ingress인 Gateway를 경유하지 않는 Direct HTTP다.

비동기 Event·Job은 첫 명확한 Use Case가 생긴 뒤 NATS JetStream을 도입한다.
gRPC, Kafka, Kubernetes는 서비스 수가 아니라 측정된 병목과 운영 요구가
각 Trigger를 충족할 때 일부 범위에 한해 별도 Decision으로 검토한다.

이 ADR은 통신 선택과 도입 Trigger를 소유한다. 구체적인 API, Event Payload,
Timeout 값, Broker 설정, Migration과 운영 Runbook은 각 Service Repository가
소유한다.

## 2. Status

```text
document_status: draft
decision_status: open
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

이 ADR은 Draft PR 단계에서 승인된 결정이 아니다. Merge Review에서 Architecture
승인이 확인되면 `document_status`와 `decision_status`를 별도로 전환한다.

## 3. Decision Scope

### Scope In

- 외부 API와 내부 동기 호출의 기본 Protocol
- AI Token Streaming 기본 Transport
- 동기 호출 Chain과 실패 격리 원칙
- Shared Identity 호출 제한
- Shared AI와 Product의 책임 경계
- NATS JetStream 도입 조건과 기본 Delivery 원칙
- gRPC, Kafka, Kubernetes 도입 Trigger
- 공통 데이터 소유권과 Source of Truth
- Foundation, Service Repository, Private Ops의 문서 소유권

### Scope Out

- Product별 API Path, DTO와 Error Payload
- 실제 Service Authentication, Discovery와 Network 구성
- Event Payload 상세와 Subject 이름
- 실제 Timeout·Retry 횟수와 Circuit Breaker 설정
- NATS, Kafka, Kubernetes 설치와 운영 설정
- PostgreSQL·Redis Provisioning과 Migration
- 실제 Secret, Credential, Host, IP와 Backup 위치
- Carelog Auth 물리 추출과 현재 Runtime 변경

## 4. Context

### Observed

- `DEC-057`은 Shared Identity와 Shared Commerce의 논리 경계를 분리했다.
- `DEC-058`과 `ADR-0013`은 목표 Deployment Unit과 데이터 소유권을 정했다.
- `DEC-059`는 Backend Service Foundation을 공통 Architecture·Contract의
  Canonical 위치로 확정했다.
- `DEC-060`과 `ADR-0014`는 Shared Services Deployment Unit 명칭만
  부분 대체했으며 실제 배포를 승인하지 않았다.
- Service Communication, Distributed Consistency, Identity Token,
  Event Envelope 문서는 공통 후보 규칙을 이미 설명하지만 기술 선택을
  승인하는 별도 ADR은 없었다.
- Carelog는 첫 적용 Evidence이며 Foundation이 소유하는 Runtime이 아니다.

```text
Current Carelog evidence
Cloudflare Tunnel
→ Spring Cloud Gateway
→ carelog-be
   ├── Auth/OAuth Module
   └── Carelog Core
→ Redis
→ PostgreSQL
```

현재 Carelog Runtime은 독립 Shared Identity, Shared AI, Finance Harness Backend,
Dev Harness Backend, NATS, gRPC, Kafka, Kubernetes를 운영하지 않는다.

### Target logical structure

```text
Spring Cloud Gateway
├── Carelog Core
├── Finance Harness Backend
├── Dev Harness Backend / Control Plane
├── Shared Identity
└── Shared AI
    └── External AI Provider
```

Gateway는 Portfolio Product Service가 아니라 외부 Ingress와 Security
Boundary다. 이 논리 구조는 각 Service의 즉시 구현·배포를 승인하지 않는다.

## 5. Drivers

- 작은 초기 운영 규모에서의 단순성
- 명확한 Service·Data Ownership
- 낮은 Temporal Coupling과 Cascading Failure 제한
- 실제 병목에 근거한 점진적 확장
- 중복 Delivery와 부분 실패에 대한 복구 가능성
- Product Policy와 공통 기술 실행 책임의 분리
- 현재 지원 사실을 과장하지 않는 상태 표현

## 6. Considered Options

### Option A — 단순 기본값과 Trigger 기반 점진 도입

HTTP/JSON과 SSE를 기본으로 하고, JetStream·gRPC·Kafka·Kubernetes는 실제
Use Case나 측정된 병목이 생긴 뒤 도입한다.

- 장점: 운영 복잡도와 초기 비용이 낮고 도입 근거를 검증할 수 있다.
- 단점: 후속 전환과 Contract 설계 작업이 필요하다.
- 선택 이유: 현재 Portfolio 규모와 단일 Host 출발점에 가장 적합하다.

### Option B — 처음부터 Broker·gRPC·Kubernetes 표준화

모든 Service에 메시지 Broker, Proto RPC와 Orchestration을 선제 적용한다.

- 장점: 초기부터 통일된 Infrastructure 형태를 만들 수 있다.
- 단점: 실제 병목과 무관한 운영 부담, 디버깅 비용과 장애면이 증가한다.
- 판정: Rejected.

### Option C — Service별 무제한 자율 선택

각 Service가 Protocol, Broker와 확장 Platform을 독립적으로 선택한다.

- 장점: Local 최적화가 쉽다.
- 단점: Contract Drift, 중복 운영, Cross-service 장애 분석 비용이 커진다.
- 판정: Rejected.

## 7. Decision

### 7.1 Communication defaults

| 목적 | 기본 선택 | 현재 지원 의미 |
|---|---|---|
| 외부 API | HTTP/JSON | Service별 실제 적용 상태는 각 Repository가 기록 |
| 내부 동기 호출 | HTTP/JSON | 목표 기본값이며 Service 추출 전에는 호출 자체가 없을 수 있음 |
| AI Token Streaming | SSE | Target 기본값, 현재 구현 완료를 의미하지 않음 |
| 비동기 Event·Job | 실제 요구 발생 후 NATS JetStream | 현재 미도입 |
| Business Source of Truth | PostgreSQL | Service별 논리 소유권 분리 |
| Session·Cache·단기 상태 | Redis | Business Source of Truth가 아님 |

```text
External Client
→ Gateway
→ Product or Shared Service
```

```text
Product Service
→ Direct HTTP
→ Shared Service
```

내부 호출을 다음처럼 외부 Gateway로 우회하지 않는다.

```text
Product Service
→ Gateway
→ Shared Service
```

Service Authentication, Discovery, mTLS와 실제 Private Network 구성은
Deployment Architecture의 후속 Decision이다.

### 7.2 Synchronous call invariants

- 사용자 요청 하나의 필수 동기 Downstream은 가급적 하나 이하로 제한한다.
- 긴 필수 동기 호출 Chain을 만들지 않는다.
- 모든 Cross-service 호출에는 Timeout이 있어야 한다.
- Retry는 멱등 요청 또는 Idempotency Key가 보장된 요청에 한정한다.
- Circuit Breaker, Error Mapping, Correlation ID 전달은 Consumer Adapter가
  소유한다.
- Security-sensitive 상태의 Fallback은 값을 추측하지 않고 fail closed한다.

### 7.3 Shared Identity calls

로그인·Refresh·계정 관리:

```text
Client
→ Gateway
→ Shared Identity
```

일반 Product API의 Target Flow:

```text
Client
→ Gateway authentication validation
→ trusted authentication context
→ Product-owned authorization
```

Product는 일반 요청마다 Identity를 호출하지 않는다. 직접 호출은 계정 상세,
Provider Linking, 재인증, 계정 정지·탈퇴, 관리자 처리, 특수 Introspection처럼
현재 Identity 상태가 필요한 제한된 Management Call에 한정한다.

구체적인 issuer, audience, JWKS와 인증 Context Header는
`identity-token-contract.md` 및 후속 Contract Decision이 소유한다.
Draft Contract를 현재 구현 사실로 해석하지 않는다.

Gateway가 Token을 검증해 인증 Context를 전달하는 Deployment에서는 Product가
외부 입력 Header를 그대로 신뢰하지 않고, Gateway가 외부 위조 Header를 제거한
뒤 재주입한 Context의 출처와 무결성을 검증해야 한다. 최종 Header Field·Version과
Gateway-to-Product 인증 방식은 후속 Contract다.

### 7.4 Shared AI and Product ownership

| Shared AI | Product Service |
|---|---|
| Provider Adapter | 제품별 System Prompt |
| API Key·Secret 소유 책임 | Domain Context와 입력 데이터 선택 |
| Model Alias | Product Workflow |
| Timeout·제한 Retry | 도메인 Policy |
| Rate Limit·Concurrency | Product Tool 의미와 사용 권한 |
| Usage·Cost | 도메인 결과 검증 |
| 공통 Observability | 결과 저장과 업무 반영 |
| Provider 장애 처리 | 제품별 규제·승인·보존 정책 |
| 기술적 Safety와 Streaming 기술 | Product 결과의 최종 책임 |

```text
Shared AI = AI를 어떻게 실행하는가
Product   = AI가 이 제품에서 무엇을 해야 하는가
```

Provider-neutral RAG Adapter, Embedding Runtime, Vector Infrastructure,
공통 AI Orchestration과 공통 AI Job Runtime 상세 구조는 Shared AI의
제품 중립 기술 Capability 후보다. 현재 구현 완료나 확정 소유권이 아니며,
실제 Use Case가 생긴 뒤 후속 Decision으로 정한다.

Product는 Corpus 선택, Retrieval Policy, Domain Validation과 결과 반영을
계속 소유한다.

### 7.5 SSE

AI Token Streaming의 Target Flow는 다음과 같다.

```text
Shared AI
→ Product
→ Gateway
→ Client
```

재연결, `Last-Event-ID`, 사용자 취소, Stream Timeout, Backpressure, 중간 장애,
결과 저장과 Stream 종료 정합성은 실제 Streaming 작업의 후속 Decision이다.

### 7.6 NATS JetStream

NATS는 현재 Runtime이 아니다. 장시간 AI Job, AI Usage·Cost 비동기 기록,
Audit Consumer, 계정 상태 전파, Notification, Entitlement Projection 중
첫 명확한 Use Case가 생긴 뒤 NATS Core가 아닌 JetStream을 검토한다.

도입 시 기본 원칙:

- At-least-once Delivery
- Idempotent Consumer
- `event_id` Unique 또는 동등한 중복 방지
- Consumer의 DB Commit 후 ACK
- MQ는 Business Source of Truth가 아님
- 유실되면 안 되는 중요한 Event에만 Transactional Outbox 적용
- 모든 Event에 Transactional Outbox를 강제하지 않음

공통 Event Envelope 의미는
`../contracts/backend-service-foundation/event-envelope-contract.md`를 따른다.
Event Envelope 상세, Subject Naming 상세, Retention, Dead Letter 처리,
Reconciliation, Publisher Failure, 첫 Producer·Consumer, Backup·Restore는
첫 Use Case ADR에서 확정한다.

### 7.7 Deferred technology triggers

#### gRPC

기본값이 아니다. 다음 중 하나 이상이 측정된 일부 경로에서만 검토한다.

- 지속적인 고빈도 내부 호출
- JSON Serialization의 CPU 병목
- 대용량 Binary Payload
- 양방향 Streaming
- 다중 언어 Proto SDK 필요
- 내부 p99 수 ms 최적화 요구

#### Kafka

다음 요구가 생기고 물리 Node와 운영 인력이 확보된 뒤 검토한다.

- CDC
- 장기 Event Log
- 대규모 Replay
- 다수 분석 Consumer
- Kafka Connect 또는 Streams

JetStream 도입은 Kafka 전환을 자동 의미하지 않는다.

#### Kubernetes

다음 운영 요구가 실제로 발생한 뒤 검토한다.

- 여러 물리 Node
- Service Replica
- 자동 수평 확장
- 무중단 배포
- 다수 운영자
- Compose 또는 단일 Host 운영이 실제 병목

Service 개수 증가만으로 gRPC, Kafka, Kubernetes를 도입하지 않는다.

### 7.8 Data ownership

- 각 Service만 자기 데이터와 Migration을 Write한다.
- 다른 Service DB 직접 Read·Write와 Cross-service FK를 금지한다.
- OLTP Cross-service Join을 금지하고 API, Event 또는 Projection을 사용한다.
- 단일 PostgreSQL에서도 Schema, DB User, Migration 소유권을 논리적으로
  분리할 수 있다.
- 물리 DB 분리는 SLA, 확장, 장애 격리 요구가 생긴 뒤 검토한다.
- PostgreSQL이 Business Source of Truth다.
- Redis와 MQ는 Business Source of Truth가 아니다.

상세 규칙은 `database-ownership-and-reference-policy.md`와
`distributed-consistency-policy.md`를 따른다.

### 7.9 Public contract, service configuration, and secrets

Foundation이 소유할 수 있는 공개 계약:

- issuer와 audience 명명 규칙
- JWKS 공개 계약
- 인증 Context Header 이름·버전
- 환경변수 명명 원칙
- NATS Subject 명명 원칙
- Secret 소유 책임

Service Repository가 소유:

- 실제 사용하는 환경변수 이름과 Secret 없는 예제
- Adapter와 구체적인 Timeout·Retry 값
- Migration과 실제 적용 상태

Private Ops 또는 Secret Manager가 소유:

- JWT Private Key
- Gateway Secret 실제 값
- DB·Redis Password
- OAuth Provider Client Secret
- AI Provider API Key
- Tunnel Token
- 실제 Host·IP와 Backup 위치

실제 Secret 값은 어떤 Git Repository에도 저장하지 않는다.

## 8. Ownership and relationship

| Concern | Canonical owner |
|---|---|
| 공통 Architecture Decision | `harness-foundation-docs` |
| 공통 Token·Event Contract | Foundation Contract 문서 |
| Service별 적용·편차 | 각 Service Repository |
| 실제 DB·Migration·API·Adapter | 각 Service Repository |
| 실제 Secret·Host·Backup 값 | Private Ops / Secret Manager |

이 ADR은 `DEC-057~060`과 `ADR-0012~0014`를 Supersede하지 않는다.
그 논리 경계, 데이터 소유권과 배포 후보를 통신·확장 선택으로 명확히 한다.

Carelog PR #37은 이 ADR의 Source of Truth가 아니라 선행 적용 Evidence다.
Foundation Decision이 승인된 뒤 Carelog 문서는 Foundation을 참조하고
Carelog의 현재 적용 상태와 Gap만 소유해야 한다.

## 9. Consequences

### Positive

- 공통 기술 선택의 Canonical Owner가 하나로 정리된다.
- 초기 운영 복잡도를 낮추면서 확장 Trigger를 잃지 않는다.
- Identity와 AI의 매 요청 Coupling 및 Product Policy 유출을 방지한다.
- Service Repository가 실제 구현과 운영 Evidence를 독립적으로 관리한다.

### Negative

- Deferred 기술 도입 시 후속 ADR과 Migration이 필요하다.
- HTTP/JSON 기본값은 일부 고빈도 경로에서 장기적으로 비효율적일 수 있다.
- Eventual Consistency 도입 시 Reconciliation과 운영 Runbook이 필요하다.

### Risks

- Draft Contract를 현재 구현 사실로 오해할 수 있다.
- Service 문서가 공통 규칙을 복제하면 Drift가 재발할 수 있다.
- Trigger를 측정하지 않으면 기술 도입이 감각적 선택으로 되돌아갈 수 있다.

## 10. Follow-up Decisions

- 내부 Service Authentication과 Discovery
- Identity issuer·audience·JWKS 및 인증 Context Header Contract 승인
- SSE 재연결·취소·Backpressure·저장 정합성
- 첫 JetStream Producer·Consumer와 운영 정책
- Provider-neutral RAG·Embedding·Vector·AI Job Runtime 소유권
- 실제 Trigger 충족 시 gRPC, Kafka 또는 Kubernetes 도입 ADR
- Foundation ADR 병합 후 Carelog 공통 ADR 중복 제거

## 11. Validation

- 현재·Target·Deferred 상태가 분리돼야 한다.
- NATS, gRPC, Kafka, Kubernetes를 현재 지원으로 표현하지 않아야 한다.
- 기존 Identity Token·Event Envelope Contract 의미와 충돌하지 않아야 한다.
- 실제 Secret, Host, IP 또는 운영 Credential이 없어야 한다.
- Service별 구현 세부가 Foundation Canonical로 승격되지 않아야 한다.
