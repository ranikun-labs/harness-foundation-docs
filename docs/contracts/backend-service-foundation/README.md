---
title: Backend Service Foundation — Contracts Index
status: draft
implementation_status: not_verifiable
owner: architecture
last_reviewed: 2026-07-26
supersedes: []
superseded_by: []
source_inputs:
  - docs/contracts/backend-service-foundation/identity-token-contract.md
  - docs/contracts/backend-service-foundation/event-envelope-contract.md
related_decisions:
  - DEC-057
---

# Backend Service Foundation — Contracts

## 1. 문서 목적

이 디렉터리는 Carelog, Finance Harness Backend, Shared Identity 등 실제 MSA Backend Service 간에 교환되는 인증 Token과 Integration Event의 공통 계약을 관리한다.

```text
docs/contracts/backend-service-foundation/
├── README.md
├── identity-token-contract.md
└── event-envelope-contract.md
```

---

## 2. 기존 `docs/contracts/*`와의 관계

기존 `docs/contracts/` 디렉터리(`work-start-contract.md`, `handoff-basic-contract.md`, `result-basic-contract.md`, `runtime-capability-contract.md`, `execution-policy-contract.md`, `product-notice-contract.md`)는 `oh-my-ai` AI Harness 제품의 Human-AI Workflow Contract(Work-start → Handoff → Result 흐름)를 다룬다.

본 디렉터리는 그와 전혀 다른 Scope, 즉 **MSA Backend Service 간 통신 계약**(JWT Claim, Event Envelope)을 다룬다.

두 Contract 군은 대상 시스템이 다르므로 중복이 아니며(Option C: 병존), 서로의 상태 축·필드·의미를 참조하거나 재정의하지 않는다.

용어 참고: `DEC-057`에 따라 본 디렉터리는 "Shared Platform"이라는 이름을 쓰지 않는다. Canonical 명칭은 "Backend Service Foundation"이며, `DEC-005`의 `oh-my-ai` "Shared Platform"과는 이름부터 분리되어 있다.

---

## 3. 문서 색인

| Document | Purpose | Status | Applies to | Canonical owner | Implementation status |
|---|---|---|---|---|---|
| [identity-token-contract.md](./identity-token-contract.md) | Shared Identity가 발급하고 Product Service가 로컬 검증하는 Access Token의 Claim 계약 | Draft | Shared Identity issuer, all consuming product services (Carelog, Finance Harness, future services) | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |
| [event-envelope-contract.md](./event-envelope-contract.md) | Cross-service Integration Event의 공통 Envelope 필드 계약 | Draft | All publishing/consuming MSA services | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |

---

## 4. 상태 원칙

```text
Status: Draft
Implementation completed: No
Runtime supported: No
Product released: No
```

`DEC-057`은 명칭 확정만 accepted 상태이며, 위 2개 문서의 기술적 내용 자체를 accepted로 전환하지 않는다.

---

## 5. 관련 문서

```text
docs/contracts/README.md
docs/architecture/backend-service-foundation/README.md
docs/architecture/backend-service-foundation/service-communication-policy.md
docs/architecture/backend-service-foundation/distributed-consistency-policy.md
docs/decisions/decision-log.md (DEC-005, DEC-057)
```
