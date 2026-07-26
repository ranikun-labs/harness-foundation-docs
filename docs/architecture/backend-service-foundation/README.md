---
title: Backend Service Foundation — Architecture Index
status: draft
implementation_status: not_verifiable
owner: architecture
last_reviewed: 2026-07-26
supersedes: []
superseded_by: []
source_inputs:
  - docs/architecture/backend-service-foundation/service-boundaries.md
  - docs/architecture/backend-service-foundation/database-ownership-and-reference-policy.md
  - docs/architecture/backend-service-foundation/service-communication-policy.md
  - docs/architecture/backend-service-foundation/distributed-consistency-policy.md
  - docs/architecture/backend-service-foundation/documentation-ownership-and-placement.md
related_decisions:
  - DEC-057
---

# Backend Service Foundation — Architecture

## 1. 문서 목적

이 디렉터리는 Carelog, Finance Harness Backend, Shared Identity 등 실제 MSA Backend Service가 공통으로 따라야 하는 서비스 경계, 데이터베이스 소유권, 통신 방식, 분산 정합성 원칙을 관리한다.

이 디렉터리의 문서는 아직 어느 것도 Accepted Decision이 아니며(용어·Repository 지도 등록 자체는 `DEC-057`로 accepted), 실제 구현·배포가 존재함을 의미하지 않는다.

```text
docs/architecture/backend-service-foundation/
├── README.md
├── service-boundaries.md
├── database-ownership-and-reference-policy.md
├── service-communication-policy.md
├── distributed-consistency-policy.md
└── documentation-ownership-and-placement.md
```

---

## 2. 용어 경계 — "Shared Platform"과의 관계

`DEC-057`(2026-07-26, accepted)에 따라 이 디렉터리는 "Shared Platform"이라는 이름을 사용하지 않는다.

| | 이 디렉터리 | 기존 `oh-my-ai`의 Shared Platform |
|---|---|---|
| Canonical 명칭 | **Backend Service Foundation** | Shared Platform |
| Canonical 문서 | `docs/architecture/backend-service-foundation/*` (본 디렉터리) | `docs/architecture/shared-core-and-extensions.md` |
| 근거 | `DEC-057` (accepted) | `DEC-005` (accepted), 루트 `README.md` Invariant #5 |
| 의미 | Carelog·Finance Harness Backend·Shared Identity 등 **실제 MSA Backend Service**가 공유하는 Identity·DB Ownership·Communication·Consistency 원칙 | `oh-my-ai` **AI Harness 제품군**(Development Extension·Finance Extension)이 공유하는 Domain-neutral Contract·Vocabulary 경계 (WorkItem/Run/Result/Policy/Provenance 등) |
| 성격 | Infra / Physical Architecture 원칙 (DB, JWT, Event, 통신) | Product / Logical Contract 경계 (Task 상태, Human Review, Candidate) |
| Repository 대상 | Carelog, Finance Harness Backend, Shared Identity | `oh-my-ai`, `oh-my-ai-control-plane`, `finance-harness`, `identity-platform` |

이름이 분리됐으므로 두 개념은 더 이상 혼동될 위험이 없다. `DEC-005`와 루트 `README.md`의 "Shared Platform" 정의는 이번 명칭 확정으로 변경되지 않는다.

관련 참고: `docs/architecture/shared-core-and-extensions.md`, `docs/decisions/decision-log.md` DEC-005, DEC-057.

---

## 3. Repository 지도와의 관계

`DEC-057`에 따라 다음 관계가 확정됐다.

| 본 디렉터리 용어 | `repository-service-boundaries.md` 대상 | 상태 |
|---|---|---|
| Shared Identity | `identity-platform` (§7.4) — 후보 Repository 명칭 | Canonical 논리 서비스명은 `Shared Identity`로 확정. 실제 Repository 이름은 물리 분리 시 확정 |
| Finance Harness | `finance-harness` (§7.3) | 책임 범위 일치. 본 디렉터리는 그 물리 구현(DB·통신·정합성) 정책을 보강 |
| Carelog | `§7.7` (신규 등록) | 기존 Product Service. 현재 Auth Phase A 논리 분리 단계, Shared Identity 물리 분리 미착수 |

---

## 4. 문서 색인

| Document | Purpose | Status | Applies to | Canonical owner | Implementation status |
|---|---|---|---|---|---|
| [service-boundaries.md](./service-boundaries.md) | 서비스별 데이터·행동 소유권, Shared Identity/Carelog/Finance Harness 경계 정의 | Draft | Shared Identity, Carelog, Finance Harness, future services | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |
| [database-ownership-and-reference-policy.md](./database-ownership-and-reference-policy.md) | DB 소유권, FK 사용 기준, Cross-service Weak Reference 원칙 | Draft | All MSA repositories | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |
| [service-communication-policy.md](./service-communication-policy.md) | 동기 API / 비동기 Event / 로컬 검증 Token 선택 기준 | Draft | Inter-service communication | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |
| [distributed-consistency-policy.md](./distributed-consistency-policy.md) | Outbox, Idempotency, Reconciliation, Saga 등 분산 정합성 원칙 | Draft | Cross-service workflows | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |
| [documentation-ownership-and-placement.md](./documentation-ownership-and-placement.md) | Foundation vs 각 MSA 레포 vs Domain 문서 배치 원칙 | Draft | Foundation + all MSA repositories | `harness-foundation-docs` | Not implemented / Not runtime-supported / Not released |

각 문서의 내용(서비스 경계·DB·통신·정합성 원칙)은 아직 Draft이며 별도 accepted Decision이 등록되기 전까지 canonical candidate로만 취급한다.

---

## 5. 상태 원칙

```text
Status: Draft
Implementation completed: No
Runtime supported: No
Product released: No
```

`DEC-057`은 명칭·Repository 지도 등록만 accepted 상태이며, 위 5개 문서의 기술적 내용 자체를 accepted로 전환하지 않는다. Decision Record 또는 실제 구현 Evidence 없이 이 상태를 올리지 않는다.

---

## 6. 관련 문서

```text
docs/architecture/README.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/contracts/backend-service-foundation/README.md
docs/master/product-architecture-master.md
docs/decisions/decision-log.md (DEC-005, DEC-057)
```
