---
title: "서비스 간 메시징 목표를 SQS로 변경하고 환경 격리를 불변조건으로 정한다"
adr_id: "ADR-0023"
document_status: in_review
decision_status: accepted_with_constraints
decision_status_scope: owner_policy_direction_only
decision_scope: architecture
owner: architecture
authors: [codex]
reviewers: []
approvers: []
created_at: "2026-10-13"
reviewed_at: "2026-10-13"
approved_at: null
effective_from: null
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "Provider 목표 승인은 AWS V1 즉시 Provisioning 승인이 아니다"
  - "NATS 신규 구현과 Local NATS / Production SQS 이중 Provider 운영을 채택하지 않는다"
  - "Local 기본값은 Broker 없음; 내부 Job은 Spring Boot Application Worker + JPA"
  - "Dev/Production Queue, DLQ, IAM 및 구성 경계를 격리한다"
  - "Standard/FIFO, SNS, 운영 수치와 AWS 계정 분리는 요구사항 기반 후속 결정이다"
  - "Owner 승인은 SQS 목표 정책 방향에 한정하며 공식 문서 최종 승인과 Supersession / 발효일은 미확인이다"
  - "AWS Dev / Production Provisioning은 실행되지 않았고 승인되지 않았다"
affected_docs:
  - docs/adr/ADR-0015-platform-communication-messaging-scaling.md
  - docs/adr/ADR-0021-shared-audit-foundation-architecture.md
  - docs/adr/ADR-0022-aws-v1-mvp-primary-runtime.md
  - docs/decisions/decision-log.md
  - catalog/system-catalog.yaml
evidence_refs:
  - "Owner task decision, 2026-10-13, including Additional Local Messaging Decision"
  - "https://github.com/ranikun-labs/harness-foundation-docs/pull/32"
  - docs/testing/2026-10-13-shared-environment-acceptance.md
supersedes: []
superseded_by: []
remaining_valid_scope:
  - "HTTP/JSON, Direct internal call, Gateway ingress 및 SSE 계약"
  - "Shared Audit Producer 의미, Durability 분류, Schema/Outbox Ownership, Append Ledger, Gate 선후관계"
replacement_decision_refs: [DEC-072]
---

# ADR-0023: SQS 목표 Provider와 Dev / Production 격리

> **Owner 승인 범위:** `decision_status: accepted_with_constraints`는 SQS 목표에 관한 정책 방향에만 적용한다.
> ADR 문서는 `document_status: in_review`이며 공식 문서 최종 승인은 미확인이다. Formal
> Supersession과 발효일도 미확인이라 `supersedes: []`, `effective_from: null`을 유지한다.
> AWS Dev / Production Provisioning은 실행되지 않았고 승인되지 않았다. `reviewed_at`은 문서
> 검토일이며 Owner 최종 승인일이 아니다.

## 1. 결정과 승인 범위

Owner는 서비스 간 비동기 메시징의 목표 Provider를 **AWS SQS**로 선택하고, NATS JetStream 신규 구현과
Local NATS / Production SQS 이중 운영을 정책 방향에서 제외했다. HTTP/JSON 동기 통신과 SSE 정책은 유지한다.
이 범위는 Owner 정책 방향 승인이다. ADR 최종 문서 승인, 공식 Supersession 및 발효일은 미확인이다.
AWS Dev / Production Provisioning은 승인되거나 실행되지 않았다.

Local 개발은 기본적으로 Broker 없이 실행한다. 단위 테스트는 Port의 Test Double을
사용할 수 있다. SQS 통합이 필요할 때만 호환 에뮬레이터를 검토한다. 에뮬레이터의
통과 결과로 AWS IAM·KMS·FIFO·Redrive 동작을 검증했다고 주장하지 않는다.
실제 동작은 Gate 1의 별도 Dev Queue 생성 승인을 받은 뒤 격리된 **AWS Dev SQS**에서 검증한다.
현재 이 승인은 없으며 이 Task에서 AWS 리소스를 생성하지 않는다.

## 2. 변경 이력과 대안

| 이전 결정 / 대안 | 이번 결정 | 유지 범위 / 근거 |
|---|---|---|
| ADR-0015 / DEC-064: 첫 Use Case 이후 JetStream | SQS 목표 Owner 정책 방향; 공식 Supersession / 발효일 미확인 | 동기 통신·Envelope·멱등성과 조건부 Outbox 유지 |
| ADR-0021 / DEC-070: Shared Audit의 JetStream 승인 | SQS 목표 Owner 정책 방향; 공식 Supersession / 발효일 미확인 | Audit 의미·Producer Boundary·Ledger·Durability 유지 |
| Local NATS + Production SQS | 미채택 | 환경별 의미 차이와 두 Provider의 운영·테스트 부담 |
| 모든 내부 Job도 외부 Broker 사용 | 미채택 | 서비스 내부 Worker + JPA로 단순한 실행·상태 복구 |
| SQS를 AWS V1에 즉시 추가 | 미승인 | 구체 Use Case·보안·비용·운영 Gate가 먼저 필요 |

이전 ADR의 당시 승인 본문과 날짜를 보존한다. 이 문서에는 formal supersession 관계나 발효일을 기록하지 않는다.
[AWS V1 ADR-0022](./ADR-0022-aws-v1-mvp-primary-runtime.md)는 PR #32 병합 뒤에도
`in_review`이며 공식 문서 승인은 미확인이다. 본 정책은 AWS V1의 Broker 미배포 경계를
유지하면서 Provider 목표를 정렬한다. 기존 Gate 선후관계를 유지하고 AU-G3 SQS Transport는
Owner 정책 방향으로 기록한다. 공식 Supersession과 발효일은 미확인이다.

## 3. Standard / FIFO와 구독 모델 — Use Case별 결정

| 요구 | 검토 기준 | 확정하지 않은 것 |
|---|---|---|
| 순서 의존이 없고 중복·역순을 처리할 수 있음 | Standard: 높은 처리량, best-effort ordering, at-least-once | 모든 Queue의 기본 종류 |
| Aggregate별 엄격한 순서가 업무 불변조건 | FIFO: `MessageGroupId` 경계·그룹 내 직렬 처리·처리량·Head-of-line blocking 검증 | 전역 순서나 end-to-end exactly-once |
| 동일 업무 Consumer의 여러 인스턴스 | 한 Queue의 Competing Consumer: 메시지는 한 인스턴스가 처리하되 재전달 가능 | 각 서비스가 모든 메시지를 받는 Broadcast |
| 독립 구독자가 각자 모든 Event를 받아야 함 | 구독자별 Queue와 DLQ 필요 | 단일 Queue 공유로 Fan-out 구현 |
| 다중 구독·필터링·독립 Retry/Lag가 실제 필요 | SNS → 구독자별 SQS 검토; Topic/Queue 종류와 Ordering 호환성 검증 | SNS 기본 도입 |

FIFO의 Broker 중복 제거 창은 Consumer DB Commit 이후 Crash나 장기 Replay의
멱등성을 대체하지 않는다. `aggregate_version` 등 역순 처리 계약은 Event Owner가
정한다. SNS를 사용하지 않는 다중 발행도 구독 누락·부분 실패·재시도 책임을 명시해야 한다.

## 4. Delivery / Idempotency / Retry 계약

- 모든 Consumer는 중복 전달을 정상으로 취급한다. 안정적인 canonical `event_id`를
  Retry·Outbox 재발행·DLQ Redrive에서도 유지한다. SQS `MessageId`는 Domain Identity가 아니다.
- Consumer별 `(consumer, event_id)` 또는 동등한 Unique 제약과 Domain Side Effect를
  같은 Local Transaction에 기록한다. Commit 후 현재 receipt handle로 `DeleteMessage`한다.
  Commit 후 Delete 전에 Crash하면 재전달을 멱등 처리한다. 실패 전 삭제하지 않는다.
- 같은 ID·같은 canonical Payload는 중복이다. 다른 Payload는 Integrity Violation으로
  기존 Ledger를 바꾸지 않고 제한된 Quarantine·Alert·Terminal Handling으로 보낸다.
- Visibility Timeout은 실제 처리 시간·DB Commit·네트워크 여유로 정하며, 긴 처리는
  제한된 연장/Heartbeat와 Crash 회수를 검토한다. Timeout은 실행 Lock이 아니다.
- 일시 실패에만 bounded exponential backoff + jitter를 적용한다. 비정상 Payload,
  미지원 Schema와 권한 오류는 무한 Retry하지 않는다. API Retry와 재수신 시도 예산을
  합산해 중첩 Retry 폭주를 막는다. 구체 값은 Use Case 측정 전 확정하지 않는다.
- Consumer 동시성·Batch·DB Pool·외부 호출을 제한한다. Queue Age, In-flight,
  처리 지연, 실패율, Outbox 정체와 DLQ 수를 관측하고 Poison이 다른 업무를 막지 않게 한다.

## 5. DLQ / Redrive / Recovery

업무 Queue별 실패 격리·소유권에 맞는 DLQ, `maxReceiveCount`, 보존·경보·Runbook을
Provisioning 전에 정의한다. Standard는 원본 enqueue 시점 기반의 만료 의미를
고려해 DLQ 보존을 Source보다 길게 검토하며, FIFO의 Timestamp/Ordering 차이도 검증한다.
Queue는 영구 Audit Archive나 무제한 Replay Store가 아니다.

Redrive는 원인 수정·Payload/Schema 확인·멱등성·처리량 제한·승인된 대상 Queue 확인
후 운영자가 수행한다. 실패를 그대로 무한 Redrive하거나 Production 데이터를 Dev로
보내지 않는다. `redriveAllowPolicy`는 같은 환경의 승인된 Source ARN만 허용한다.
DLQ 조회·이동·Purge 권한은 일반 Consumer와 분리한다. 민감 Payload를 로그에 출력하지 않는다.

## 6. Critical Event와 Shared Audit

[기존 Criticality 규칙](../architecture/backend-service-foundation/distributed-consistency-policy.md#51-event-criticality-governance)을 재사용한다.
DB Commit 후 Event 유실이 필수 Business/Security 불변조건을 깨는 경우 Domain
변경과 Producer-owned Outbox를 같은 Local Transaction에 기록한다. 미분류는 Critical로
취급하고 비중요 Event의 유실 허용 범위는 Owner가 기록한다. 모든 Event에 Outbox를 강제하지 않는다.

Outbox Publisher는 Worker + JPA로 Lease·재시도·정체 탐지를 수행할 수 있다.
SQS Send 성공은 전송 수락이며 Consumer 처리·Audit Ledger 영속화를 의미하지 않는다.
Send 성공 후 Outbox 완료 기록 전에 Crash하면 같은 `event_id`로 재발행한다.
외부/Redis Side Effect와 DB가 Transaction을 공유하지 못하는 잔여 유실 창은
ADR-0021의 제한·관측·Producer별 Reconciliation 정책을 유지한다.

Shared Audit의 [Producer Contract](../contracts/backend-service-foundation/shared-audit-event-contract.md)와
provider-neutral `AuditPublisher`는 유지한다. AU-G2B의 `Accepted`는 Capture Capability에
따른 Custody이며 SQS Send나 Ledger Commit 증거가 아니다. SDK·Queue URL·receipt handle은
Adapter 내부에 둔다. Producer는 `recorded_at`을 만들지 않는다. SQS Consumer/Store가
검증된 canonical Fact를 Append-only `audit` Ledger에 Commit한 뒤 메시지를 삭제한다.
`SECURITY_CRITICAL`의 durability-capable capture Gate, AU-G8 → AU-G7 순서,
Producer Schema의 Outbox와 Consumer Schema의 Ledger 분리, Privacy 및 Query 권한은 유지한다.

## 7. Dev / Production 격리 — Architecture Invariant

| 경계 | 필수 계약 |
|---|---|
| Queue / DLQ | Dev와 Production은 각각 별도 리소스, Queue URL·ARN·Redrive 대상 사용 |
| 구성 | Environment별 URL·ARN·Region·계정 Allowlist; 시작 시 불일치하면 fail-closed. Prod Consumer도 Dev를 처리하지 않음 |
| IAM / Credential | 환경·Service·역할별 분리. Dev Role은 Prod Send/Receive/Delete/ChangeVisibility와 DLQ 접근 불가. 공유 장기 Credential 금지; Prod Role에도 Dev Queue 권한을 주지 않음 |
| Resource Policy | 정확한 Queue ARN·Principal로 최소 권한; Dev Principal을 Prod Policy에서 배제. Wildcard Resource/Principal·교차 환경 Grant 금지 |
| SNS 사용 시 | 환경별 Topic·Subscription; Queue Policy의 SNS `SourceArn`/`SourceAccount` 제한 |
| 운영 권한 | 환경별 DLQ 조회·Redrive·Purge·설정 변경 Role 분리. Consumer에 CreateQueue/Purge/정책 수정 권한 부여하지 않음 |
| Secret / 암호화 | TLS 강제, Payload 최소화, 설정/Secret Store 접근 분리. SSE-SQS 또는 SSE-KMS 선택은 별도 보안 검토; KMS 사용 시 환경별 Key·Key Policy와 encrypt/decrypt 권한 경계 검증 |
| Naming / IaC | `<environment>-<service>-<purpose>[-dlq]`를 논리 규칙으로 사용; FIFO 선택 시 `.fifo`. 정확한 이름은 Use Case 계약. 공유 IaC 소유자는 `platform-infra`, 의미·Consumer·운영 Owner는 해당 Service |
| Local / AWS Dev | 에뮬레이터는 Local Test일 뿐 AWS Dev가 아님. Local 기본 Broker 없음; 실제 검증에는 Dev 전용 Principal·Queue·DLQ만 사용 |

Queue 이름만 다르게 만드는 것은 격리가 아니다. IAM Identity Policy, Queue Resource
Policy, KMS/Secret, 실행 구성과 운영 Role 전체를 검토한다. Dev→Prod 접근 거부와
Prod→Dev 구성 거부를 Negative Test로 증명해야 한다. AWS 계정 자체 분리 여부는
Owner의 별도 결정이며, 동일 계정도 위 격리 의무를 면제하지 않는다.
이 문서에는 실제 ARN·URL·Credential을 넣지 않으며 AWS 환경이 배포됐다고 가정하지 않는다.

## 8. 비용·운영·보안과 Provisioning Trigger

SQS는 Broker 서버·업그레이드 운영을 줄이지만 AWS/Region/네트워크에 의존한다.
Send/Receive/Delete/Empty Poll, Payload 크기, FIFO, SNS Fan-out, KMS 호출,
CloudWatch, 데이터 전송과 Private Endpoint/NAT 비용을 함께 추정한다. Long Poll/Batch는
비용을 줄일 수 있으나 지연·부분 Batch 실패·Visibility와 정합성을 검토한다.
현재 가격·실제 비용·용량은 미측정이며 Free Tier를 운영 예산 근거로 확정하지 않는다.

Provisioning은 순서가 고정된 세 Gate로 나눈다. SQS Target 정책 방향만으로 리소스 생성 권한이 생기지 않는다.

1. **Gate 1 — Use Case / 설계 / IAM / 비용 검토와 Dev 생성 승인.** 구체 Workflow, Producer·Consumer, SLO,
   Criticality, Standard/FIFO와 구독 구조, Retry·Visibility·DLQ, 최소권한 IAM, IaC 소유권, 비용·보존·관측과
   Redrive Runbook을 검토한다. 이 Gate에서 별도 Owner가 승인할 수 있는 범위는 격리된 AWS Dev Queue/DLQ
   생성까지다.
2. **Gate 2 — 격리 AWS Dev Queue 생성 후 실제 검증.** Gate 1 승인이 기록된 뒤에만 Dev 리소스를 만든다.
   중복·역순·Crash·Timeout·Poison·Redrive 동작과 Dev/Production 교차 접근 거부를 실제 AWS Dev에서
   검증하고 결과를 남긴다.
3. **Gate 3 — Production 준비 검토와 별도 Owner 승인.** Gate 2 증거를 바탕으로 운영·비용·보안·Rollback
   준비를 검토하고, Production 리소스 생성 전 별도의 Owner 승인을 받는다. Gate 1 승인이나 Dev 검증은
   Production 승인이 아니다.

현재 Dev 생성 승인은 확인되지 않았으며 이 Task에서 AWS 리소스 생성이나 Provisioning 승인을 수행하지 않는다.

내부 Job은 Spring Boot Application Worker + JPA로 실행한다. DB는 FK/Unique/Index,
Transaction과 작업 상태·Lease·재시도 상태의 영속성을 담당한다. `pg_cron`, PGMQ,
별도 Saga 서버나 별도 Broker를 MVP 기본 의존성으로 추가하지 않는다. Worker 운영과
다중 인스턴스 Claim/재실행 안전성은 구현 Owner의 계약이며 이 Task는 구현하지 않는다.

## 9. 미결정과 검증 근거

특정 Queue 종류·SNS·Timeout/시도/보존 수치·계정 분리·KMS 방식·Provisioning 시점은
미결정이다. Owner 정책 방향은 AWS Dev 또는 Production Queue 생성을 승인하지 않는다.
현재 Provisioning은 실행되지 않았고 승인되지 않았다. Repository Apply는 이 문서 PR에
한정되며 AWS Apply·Merge·Production Release 권한을 추가하지 않는다.

설계 참고: [SQS Standard](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html),
[FIFO](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html),
[Visibility](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html),
[DLQ](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html),
[SNS → SQS](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html).
이는 설계 참고이며 이번 Task의 AWS Runtime 검증 증거가 아니다.
