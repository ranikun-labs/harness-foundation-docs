---
title: "Shared AI Phase 1을 Platform Core 논리 모듈로 배치한다"
adr_id: "ADR-0018"
document_status: in_review
decision_status: open
decision_scope: architecture
owner: architecture
authors:
  - codex
reviewers: []
approvers: []
created_at: "2026-08-26"
reviewed_at: null
approved_at: null
effective_from: null
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "이 Decision은 Shared AI Phase 1 physical placement만 다루며 logical ownership을 변경하지 않는다"
  - "Gateway는 독립 WebFlux Process를 유지하고 Platform Core는 단일 Spring MVC Process다"
  - "같은 JVM은 Module·Data·Schema·Migration Ownership 통합을 의미하지 않는다"
  - "Runtime language, framework와 exact version은 RPL-103 Technology Stage로 deferred한다"
  - "Shared AI 구현과 Platform Core refactor는 이 ADR의 구현 범위가 아니다"
  - "Shared AI ADR-0005와 양쪽 owner approval 전에는 이 partial supersession이 효력을 갖지 않는다"
affected_docs:
  - docs/adr/README.md
  - README.md
  - docs/architecture/repository-service-boundaries.md
evidence_refs:
  - RPL-103
  - RPL-104
  - ADR-0017
  - shared-ai-architecture/ADR-0001
  - shared-ai-architecture/ADR-0002
  - shared-ai-architecture/ADR-0003
  - shared-ai-architecture/ADR-0004
  - shared-ai-architecture/ADR-0005
supersedes:
  - ADR-0017 (partial; effective only after coordinated acceptance)
superseded_by: []
superseded_scope:
  - "ADR-0017 §7의 Shared AI를 platform-services/platform-core에 넣지 않는다는 placement assumption"
  - "ADR-0017 §7의 future independent Python Runtime을 Phase 1 기본 placement처럼 기술한 assumption"
remaining_valid_scope:
  - "Gateway의 independent WebFlux Process"
  - "Platform Core의 one-process Spring MVC modular monolith"
  - "Identity/Commerce/Audit logical module target과 Commerce/Audit deferral"
  - "Module/Data/Schema/Migration ownership과 cross-service DB 접근 금지"
  - "RPL-53/G2, RPL-54/G3, RPL-55/G4 migration sequence와 behavior-preserving extraction"
replacement_decision_refs:
  - shared-ai-architecture/ADR-0005
---

# ADR-0018: Shared AI Phase 1을 Platform Core 논리 모듈로 배치한다

> **Review 상태 경고**
>
> ```text
> Option B selected as the decision proposal
> + document_status: in_review
> + decision_status: open
> != canonical acceptance
> != RPL-103 complete
> != runtime technology selected
> != implementation started
> ```

## 1. Decision Summary

Shared AI Phase 1 placement로 `platform-core`의 same-JVM logical module을 선택한다.
이 decision proposal은 `shared-ai-architecture` ADR-0005와 coordinated acceptance 된
후에만 효력을 갖는다.

```text
platform-services
├── gateway-app                         independent WebFlux process
└── platform-core                       one Spring MVC process
    ├── app                             only executable host
    ├── identity                        library / logical module
    ├── shared-ai                       future library / logical module
    ├── commerce                        future / deferred
    └── audit                           future / deferred
```

Shared AI의 independent process는 폐기하지 않고 evidence-triggered extraction target으로
유지한다. Runtime language/framework/version은 RPL-103 Technology Stage에서 계속 결정한다.

## 2. Status and Effective Condition

```text
document_status: in_review
decision_status: open
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

다음이 모두 충족된 뒤 accepted/effective 상태로 전환할 수 있다.

1. Foundation owner가 이 ADR을 승인한다.
2. Shared AI owner가 coordinated ADR-0005를 승인한다.
3. 양쪽 ADR의 superseded/non-superseded scope가 일치한다.

한쪽 ADR만으로 상대 owner의 canonical decision을 덮어쓰지 않는다.

## 3. Scope

### Scope In

- Shared AI Phase 1 process placement
- Platform Core host와 feature module 실행 경계
- same-JVM resource rationale와 failure acceptance
- module ownership/dependency rule
- future Shared AI extraction seam과 trigger
- ADR-0017 §7 placement assumption의 제한적 partial supersession
- RPL-54 전 Platform Core host ordering

### Scope Out

- Kotlin/Java, Spring Boot/Spring AI/LangChain/LangGraph 선택
- exact dependency/version matrix
- pgvector, NATS 또는 streaming implementation
- Gradle, application, Identity와 Shared AI 코드 변경
- Commerce/Audit activation
- Product authorization, policy, workflow와 data ownership 변경
- RPL-103 completion 또는 Jira mutation

## 4. Canonical Reality and Conflict

Fresh source anchors:

| Repository | Ref | SHA / state |
|---|---|---|
| `harness-foundation-docs` | `origin/main` | `69fceb267094756913f400f8b4045590bd0e8ac5` |
| `shared-ai-architecture` | `origin/main` | `95c9da5da8cb3764ae3d54d4175b2c9cd17fb94f` |
| `platform-services` | `origin/main` | `31636aa43937a0119318de0fe7bc2e51ebfda3d0` |
| `shared-ai-runtime` | comparison evidence branch HEAD | `e23cb4f1c4f02114bda08d1d2b99ba56911f0476`; no `main` ref observed |

ADR-0017은 Gateway와 Platform Core의 two-process topology 및 Platform Core
one-process modular monolith를 승인했다. 동시에 §7에서 Shared AI는
`platform-services/platform-core`에 넣지 않고 future independent Python Runtime으로
검토한다고 기록했다.

RPL-97, RPL-99~102가 logical architecture를 구체화한 뒤에도 physical placement와
technology는 deferred 상태였다. RPL-103 Stage A는 이 placement conflict만 해소한다.

## 5. Preserved Logical Architecture

다음은 이 ADR의 supersession 대상이 아니다.

```text
Product authorization semantics = Product-owned
Identifier != Authorization
Runtime Projection != Semantic SoT
exact structured fact = Product Tool / SSOT
narrative/document = Retriever / RAG
query-time current authorization > cached historical scope
child capability scope cannot implicitly widen parent scope
Evidence != authorization proof
Shared AI cannot directly access Product DB
provider/framework type != canonical contract
```

RPL-97 및 Shared AI ADR-0001~0004의 ownership과 isolation contract는 그대로 유지한다.

## 6. Considered Options

### Option A — Independent Runtime / Process

장점:

- AI workload scaling과 deployment 독립
- OOM, GC, thread, streaming과 provider failure isolation
- Python-only/GPU/local-model dependency 수용

비용:

- 별도 runtime/container/ApplicationContext 또는 Python server
- health, observability, connection pool과 deployment 고정 비용
- network serialization, service credential, timeout/retry와 discovery 필요

독립 process는 future trigger가 확인될 때 선택할 수 있으나 Phase 1 기본값으로 선택하지
않는다.

### Option B — Platform Core Logical Module / Same JVM

장점:

- Spring process, embedded server, actuator, container와 observability baseline 공유
- internal network/auth/serialization 비용 없이 typed in-process boundary 사용
- 현재 small-scale 운영과 ADR-0017의 modular-monolith target에 정렬
- G3 전에 최종 Platform Core host를 확정해 이중 consolidation 방지

비용:

- process failure, heap/metaspace, GC, startup/readiness와 deploy/rollback 공유
- AI long call, retry, streaming, payload와 executor saturation이 Identity에 영향 가능
- dependency/classpath compatibility 공동 관리

## 7. Decision Proposal — Option B

Option B를 Phase 1 placement로 선택한다.

```text
:gateway-app                  executable; independent WebFlux process

:platform-core:app            only executable Spring MVC host
:platform-core:identity       library / logical module
:platform-core:shared-ai      future library / logical module
:platform-core:commerce       future / deferred
:platform-core:audit          future / deferred
```

Feature module은 `main()`, embedded server와 독립 `bootJar` deploy unit을 소유하지 않는다.
Host composition/wiring은 `platform-core:app`이 소유한다.

이 Gradle notation은 target boundary이며 이번 ADR에서 실제 module을 만들지 않는다.

## 8. Gateway Boundary

Gateway는 다음 이유로 별도 process를 유지한다.

- WebFlux/Netty edge runtime
- routing/security/rate limit
- independent scaling과 rollback
- long-lived connection isolation
- Platform Core MVC lifecycle과 분리

Gateway는 Platform Core feature module을 compile-time dependency로 참조하지 않는다.
두 process 사이에는 network boundary가 유지된다.

## 9. Module and Data Ownership

```text
platform-core:app
 ├─> identity
 ├─> shared-ai
 ├─> commerce
 └─> audit
```

Feature module 사이 direct internal dependency는 기본 금지한다.

금지:

- Shared AI의 Identity repository/internal service 접근
- Commerce의 Identity repository/internal service 접근
- cross-module DB table direct read/write
- cross-module FK/JOIN convenience coupling
- repository/entity 또는 shared mutable entity 노출

허용 경계:

- explicit public module API
- consumer-owned Port
- typed provider/framework-neutral contract

하나의 PostgreSQL physical instance를 사용할 수 있지만 schema, table, data와 migration
ownership은 분리한다. Cross-module transaction을 최소화하고 owner boundary를 우회하지 않는다.

## 10. Same-JVM Failure Acceptance

다음 failure boundary를 공유하는 비용을 명시적으로 수용한다.

```text
OOM / metaspace exhaustion / GC pause / process crash
startup and readiness failure
thread/executor starvation
dependency/classpath conflict
deployment and rollback unit
```

Phase 1 implementation/evaluation criteria:

- AI bounded executor와 concurrency limit
- provider timeout
- bulkhead/circuit-breaker seam
- payload/result limit
- module-specific latency/error/queue metrics
- heap/RSS/GC/thread 및 streaming saturation metrics
- AI dependency failure와 Identity readiness를 분리하는 health model

수치 threshold와 concrete library는 evidence 없이 고정하지 않는다.

## 11. Shared AI Extraction Seam

- public application API와 internal implementation을 분리한다.
- `ExecutionContext`, request, result와 Evidence reference를 provider/framework-neutral하게 유지한다.
- Product Tool, Current Authority, Retriever와 Model Gateway Port를 유지한다.
- Product/Identity DB 직접 접근을 금지한다.
- Shared AI storage가 필요하면 schema/migration ownership을 분리한다.
- transport는 adapter다.
- Phase 1은 in-process adapter를 사용한다.
- future에는 HTTP/SSE 또는 승인된 concrete async use case의 NATS adapter로 교체할 수 있다.
- 내부 호출에 network DTO, service discovery와 distributed retry를 미리 흉내 내지 않는다.

## 12. Extraction Triggers

다음 조건이 실제 evidence로 관찰되면 독립 process extraction을 재검토한다.

- independent scaling requirement
- sustained streaming concurrency
- AI workload가 Identity latency/SLO에 영향
- memory/RSS/GC pressure
- independent deployment cadence 필요
- AI failure blast-radius isolation 필요
- Python-only ML dependency가 load-bearing
- local embedding/reranker/model 또는 GPU 필요

관찰 지표는 concurrency, executor queue, stream count, latency, heap/RSS, GC, failure/restart
correlation과 deployment frequency다. Threshold는 운영 evidence로 후속 결정한다.

## 13. Identity / G3 Impact

`platform-services` fresh main의 Identity는 business extraction 전 inert scaffold다. 이
placement가 accepted 되면 다음 순서를 권장한다.

```text
1. RPL-103 Stage A topology canonical acceptance
2. platform-core host structural refactor
3. identity library module 전환
4. RPL-54 G3 behavior-preserving extraction
5. RPL-55 Carelog cutover
```

이는 독립 Identity JVM에 G3를 완료한 뒤 다시 host consolidation하는 이중 작업을 피한다.
이 ADR 자체는 structural refactor나 RPL-54 구현을 승인하지 않는다.

## 14. Verification Tool Boundary

Gradle dependency와 package boundary가 1차 방어선이다. Spring Modulith/ArchUnit은
dependency cycle, internal package access, allowed dependency와 public interface를 검사하는
verification-only 후보다.

모든 communication의 event화, event repository 선도입, Modulith annotation의 canonical
architecture 승격과 도구에 맞춘 domain package 왜곡은 승인하지 않는다.

## 15. Explicit Partial Supersession

이 ADR과 Shared AI ADR-0005가 accepted 되면 ADR-0017 §7의 다음 문구 범위만 부분
대체한다.

| ADR-0017 existing scope | Replacement |
|---|---|
| Shared AI를 `platform-services/platform-core`에 넣지 않는다 | Shared AI Phase 1은 Platform Core logical module / same JVM |
| future independent Python Runtime을 기본 placement 후보로 기술 | independent runtime은 evidence-triggered extraction target; language는 deferred |

Supersede하지 않는 ADR-0017 scope:

- independent Gateway WebFlux process
- Platform Core one-process Spring MVC modular monolith
- Identity/Commerce/Audit logical module target
- Commerce/Audit deferred 상태
- Module/Data/Schema/Migration ownership
- G2/G3 behavior-preserving extraction과 G4 cutover sequence
- implementation/runtime support/product release 상태 분리

ADR-0017 accepted history와 당시 scope는 rewrite하지 않는다. 이 ADR이 accepted 될 때
후속 decision으로 해당 placement assumption만 대체한다.

## 16. Technology and Implementation Deferred

```text
Kotlin vs Java
Spring Boot exact version
Spring AI exact version
Spring AI vs LangChain/LangGraph
pgvector
NATS
streaming implementation
provider/model
```

RPL-104 Python/FastAPI implementation은 comparison evidence이며 production technology
selection이나 independent-process acceptance가 아니다. RPL-103은 이 Stage A 뒤에도 open이다.

## 17. Consequences

Positive:

- 작은 운영 규모에서 capability별 process 고정 비용을 줄인다.
- 기존 Platform Core modular-monolith target을 확장한다.
- logical ownership을 유지하면서 future extraction seam을 명시한다.

Negative:

- Identity와 Shared AI가 process failure와 deploy/rollback을 공유한다.
- resource isolation, health 분리와 module verification 규율이 필요하다.

## 18. Migration and Rollback

이 ADR은 문서 decision만 만든다. 구현 migration은 별도 authority와 review가 필요하다.

승인 전 rollback은 이 branch/PR을 닫는 것이며 runtime effect는 없다. 승인 후에도 Shared AI
구현 전에는 placement decision만 존재한다. 구현 후 extraction은 §11~12의 seam과 trigger를
따르는 별도 decision이다.

## 19. Related Records

- ADR-0017 — Gateway/Identity physicalization 및 Platform Core modular-monolith target
- `shared-ai-architecture` ADR-0001~0004 — preserved logical architecture
- `shared-ai-architecture` ADR-0005 — coordinated Shared AI placement decision
- RPL-103 — Runtime Technology·Framework·Placement Boundary ADR
- RPL-104 — Python/FastAPI comparison evidence
- RPL-54 — G3 Identity extraction
- RPL-55 — Carelog cutover

## 20. Review Checklist

- [x] 두 실질적인 placement option을 비교했다.
- [x] partial supersession과 remaining valid scope를 분리했다.
- [x] Shared AI logical ownership을 변경하지 않는다.
- [x] same-JVM failure cost와 extraction trigger를 기록했다.
- [x] Technology selection과 구현을 deferred했다.
- [ ] Foundation owner approval
- [ ] Shared AI owner의 coordinated ADR-0005 approval
- [ ] accepted/effective 상태 전환 기록
