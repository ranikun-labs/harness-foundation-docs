# ADR 제안 — 3개 제품 공통 MSA의 통신·스트리밍·비동기 메시징 프로토콜 선택

> **Status:** Proposed
> **Decision Scope:** Carelog, Finance Harness, Dev Harness, Shared Identity, Shared AI
> **Decision Owner:** Harness Foundation Architecture
> **Date:** 2026-07-29
> **Related Architecture:** `Carelog-Finance-Dev-Harness-공통-MSA-플랫폼-설계-v2.md`

---

## 1. Context

Carelog, Finance Harness, Dev Harness는 서로 다른 제품 도메인을 소유하지만 계정·OAuth·Token·AI Provider 호출·공통 사용량·감사 후처리 책임을 공유한다.

초기 Runtime 조건:

- 단일 Mac mini M4
- 서비스별 인스턴스 우선 1개
- Kubernetes 미사용
- Spring 기반 서비스 비중이 높음
- GPT API·DB 처리 시간이 내부 네트워크 지연보다 큼
- 비용과 1인 운영 관리 복잡도가 주요 제약
- CDC·장기 Event Log 요구는 아직 없음

---

## 2. Decision

| 목적 | 결정 |
|---|---|
| 외부 API | HTTP/JSON |
| 내부 동기 호출 | HTTP/JSON |
| AI Token Streaming | SSE |
| 감사·후처리·비동기 Job | 첫 실제 요구 발생 시 NATS JetStream |
| 비즈니스 Source of Truth | PostgreSQL |
| 세션·OAuth state·Cache·Rate Limit | Redis |

추가 결정:

1. 내부 서비스 호출은 Spring Cloud Gateway를 거치지 않는다.
2. Shared Identity를 일반 제품 요청마다 호출하지 않는다.
3. Shared Commerce는 Cache 또는 Local Projection을 우선한다.
4. 사용자 요청 하나당 필수 동기 Downstream은 가급적 하나 이하로 제한한다.
5. 유실되면 안 되는 이벤트에만 Transactional Outbox를 적용한다.
6. Consumer는 At-least-once와 중복 전달을 전제로 멱등하게 구현한다.
7. JetStream은 전달·재시도·단기 Replay 채널이며 비즈니스 원본이 아니다.

---

## 3. Rationale

### HTTP/JSON

- Spring·브라우저·모바일의 기본 도구 재사용
- 로컬 개발과 장애 재현이 단순함
- 단일 장비 내부 호출에서 Protocol Overhead가 지배적이지 않음
- GPT API와 DB 지연이 전체 응답시간의 대부분
- 서비스 인스턴스가 하나라 복잡한 L7 분산이 불필요

### SSE

- 단방향 AI Token Streaming에 적합
- 일반 HTTP 인프라와 관측 도구 재사용
- WebSocket Session 관리 불필요
- 브라우저·모바일 웹 연동이 단순함

### NATS JetStream

- ACK, Durable Consumer, Redelivery, 단기 Replay
- 단일 Mac mini에서 Kafka보다 낮은 운영 복잡도
- Go와 Spring 모두 지원
- 현재 CDC·Kafka Connect·장기 Event Log 요구가 없음

---

## 4. Deferred Alternatives

### gRPC

다음 Trigger가 실제로 확인될 때 일부 구간에만 도입한다.

- 지속적인 내부 초당 수천 건 호출
- JSON 직렬화가 실제 CPU 병목
- 대용량 Binary Payload 반복 전송
- 양방향 Streaming이 핵심
- Go·Spring 간 Proto·SDK 자동 생성 필요
- 내부 p99를 수 ms 단위로 줄여야 함

### Kafka

다음 Trigger가 발생할 때 검토한다.

- CDC와 Debezium
- 수개월 이상 장기 Event Log
- 다수 분석 Consumer의 독립 Replay
- Kafka Connect·Streams
- 지속적인 초당 수만~수십만 Event
- 물리 노드 3대 이상과 Replication

### Kubernetes

다음 조건이 동시에 증가할 때 검토한다.

- 여러 물리 노드
- 서비스별 Replica와 Auto Scaling
- 무중단 배포·자동 복구
- 운영자 다수
- 서비스·배포 빈도 증가
- Docker Compose 운영이 실제 병목

---

## 5. Consequences

### Positive

- 초기 운영 포인트와 비용 감소
- 개발·디버깅·E2E 단순화
- 브라우저·Spring·Go 호환성
- 기술별 점진적 교체 가능
- 긴 동기 호출 체인 억제
- 인프라 선행 개발 방지

### Negative

- HTTP DTO Versioning 필요
- Proto보다 약한 Runtime Schema 강제
- 단일 Mac mini는 물리 HA 없음
- JetStream R1은 장비 전체 손실 방어 불가
- 서비스 증가 시 Compose 운영 한계 가능
- Gateway 인증 Context의 명확한 신뢰 계약 필요

---

## 6. Operational Rules

1. 내부 호출은 Service-to-Service 주소를 사용한다.
2. 모든 내부 Client에 Timeout을 둔다.
3. Retry는 멱등 요청과 일시 장애에만 제한한다.
4. Circuit Breaker로 제품 Core와 AI·외부 Provider 장애를 분리한다.
5. HTTP와 Event에 Correlation ID를 전달한다.
6. Event ACK는 Consumer DB Commit 이후 수행한다.
7. Consumer DB는 `UNIQUE(event_id)` 또는 동등한 중복 방어를 가진다.
8. PostgreSQL·Redis·NATS는 off-host backup과 복구 기준을 가진다.
9. Protocol 변경은 계측 결과와 명시적 Trigger를 근거로 한다.

---

## 7. Final Decision

```text
동기 API       HTTP/JSON
AI Streaming   SSE
비동기 Event   NATS JetStream
Business SSOT  PostgreSQL
단기 상태       Redis
```

gRPC, Kafka, Kubernetes는 기술 선호가 아니라 실제 계측과 운영 Trigger가 생긴 뒤 제한적으로 도입한다.
