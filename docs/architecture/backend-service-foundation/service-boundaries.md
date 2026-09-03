# Backend Service Foundation — Service Boundaries

- Status: Draft
- Scope: Backend Service Foundation (MSA backend services: Carelog, Finance Harness backend, Shared Identity)
- Canonical owner: `harness-foundation-docs`
- Applies to: Shared Identity, Carelog, Finance Harness, future Harness backend services
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Decision record: `DEC-059` (terminology and Carelog registration), `DEC-067` / `ADR-0017` (Gateway·Identity physicalization approved; extraction/cutover remains incomplete)
- Term scope: "Backend Service Foundation" (this directory) is distinct from `oh-my-ai`'s "Shared Platform" (`DEC-005`, `docs/architecture/shared-core-and-extensions.md`), which remains the AI harness product family's domain-neutral Contract boundary. See `docs/architecture/backend-service-foundation/README.md` §2.
- Repository-map note: `Shared Identity` is the canonical logical service name (per `DEC-059`). `DEC-067` replaces the `identity-platform` candidate with `ranikun-labs/platform-services`, locating Identity at `platform-core/identity`. The Repository exists; the approved Identity extraction/cutover and production Runtime are not complete. `platform-core/shared-ai` is a separate Phase 1 logical module whose RPL-107 synchronous OpenAI Slice A implementation is tracked by the Shared AI current projection. `Carelog` remains the current Identity implementation host until cutover evidence.

## 1. Purpose

This document defines service ownership boundaries shared by the Harness product family.

It determines:

- which service owns each class of data and behavior;
- which identifiers may cross service boundaries;
- which responsibilities must not be duplicated by product services;
- which implementation details belong in each MSA repository rather than Foundation.

This document does not define concrete table DDL, Java packages, API paths, message topics, deployment topology, or migration scripts.

## 2. Boundary principles

1. Each service owns its business capability, data lifecycle, database schema, and write model.
2. A service must not read or write another service's database directly.
3. Cross-service relationships use stable identifiers and explicit API or event contracts.
4. Product-specific profiles, roles, consent, and domain state remain in the product service.
5. Shared Identity owns authentication identity, not every concept called a user or customer.
6. A CRM customer, journal owner, manager profile, or organization member is not automatically a Shared Identity aggregate.
7. Physical service extraction and logical module separation are different states and must be recorded separately.
8. Decision accepted, implementation completed, runtime supported, fixture passed, and product released are separate statuses.
9. Shared AI owns product-neutral execution mechanisms, while each Product Service owns its prompts, workflow, domain policy, tools, validation, and business effects.
10. A `platform-core` module must not use another module's internal entity or repository, modify another module's table, or share a mutable entity.
11. Module interaction uses an explicit public API, contract, or event and preserves future independent extraction.

## 3. Target service map

```text
Spring Cloud Gateway
└── External Ingress / Security Boundary

Shared Identity
├── Platform Account
├── Password Credential
├── External Identity
├── Session / Token
└── Account Lifecycle

Carelog
├── Manager Profile
├── Organization / Workspace
├── CRM Customer
├── Customer Timeline
└── Follow-up / Handoff

Finance Harness
├── Finance Profile
├── Finance Consent
├── Analysis
├── Journal
├── Review
└── PolicyGuard / Lens Execution Context

Dev Harness Backend / Control Plane — Long-term logical ownership
├── V2 Personal Managed Workflow
│   ├── Personal Project Profile / Context
│   ├── Task / Execution / Approval
│   └── Personal Cloud History
└── V3 Team / Workspace / Organization Governance
    ├── Shared Workspace / Team-scoped Project
    ├── RBAC / Organization Policy
    └── Team Audit / Shared Approval

Shared AI
├── Provider Adapter
├── Model Alias
├── Rate Limit / Usage / Cost
└── Product-neutral Execution Mechanism
```

The Gateway is not a Portfolio Product Service. This target map does not assert that
each logical service currently exists as an independent runtime.

Target physical topology (`ADR-0017` / `DEC-067`):

```text
ranikun-labs/platform-services          repository existing
├── gateway-app                         independent SCG / WebFlux process
└── platform-core                       independent Spring MVC process
    ├── identity                        ACTIVE target
    ├── shared-ai                       Phase 1 same-JVM logical module; RPL-107 sync Slice A implemented
    ├── commerce                        DEFERRED
    └── audit                           DEFERRED
```

`gateway-app` and `platform-core` must not be combined into one Spring Boot
application. `platform-core/shared-ai` is the Phase 1 same-JVM logical module.
RPL-107 implements its first synchronous OpenAI model execution in that module;
independent Process extraction, Streaming and Product release remain separate scope.

The Dev Harness boundary preserves `DEC-003`, `DEC-004`, and `DEC-043`: V2 is a
personal managed workflow, while team Workspace and Organization governance remain
V3. This map does not approve Workspace implementation in V2.

## 4. Shared Identity boundary

### 4.1 Owned responsibilities

Shared Identity owns:

- stable platform account identifier;
- account status and lifecycle;
- password credential;
- external identity linkage such as OAuth provider identity;
- authentication session;
- access-token and refresh-token issuance;
- token revocation and signing-key lifecycle;
- authentication-facing security controls;
- account lifecycle events.

### 4.2 Data owned by Shared Identity

Representative concepts:

```text
PlatformAccount
PasswordCredential
ExternalIdentity
AuthenticationSession
RefreshToken or RefreshSession
SigningKeyMetadata
```

Concrete schema names belong in the Shared Identity repository.

### 4.3 Responsibilities not owned by Shared Identity

Shared Identity must not own:

- Carelog CRM customers;
- Finance journals or analyses;
- product-specific onboarding state;
- product-specific organization membership unless explicitly promoted to a separate shared capability;
- product-specific authorization policy;
- product-specific consent;
- billing or subscription state unless a separate Commerce service is adopted;
- large product profiles containing domain-specific fields.

### 4.4 Identity identifier

`identity_user_id` or an equivalent canonical name refers to the stable Shared Identity account identifier.

Requirements:

- immutable after issuance;
- globally unique within the platform;
- not derived from email, login ID, phone number, or provider subject;
- safe to store as a weak cross-service reference;
- not reused after account deletion.

## 5. Carelog boundary

### 5.1 Owned responsibilities

Carelog owns:

- manager product profile;
- organization or workspace state;
- CRM customer data;
- customer timeline and notes;
- follow-up workflow;
- handoff workflow;
- Carelog-specific roles and permissions;
- Carelog-specific consent and retention policy.

### 5.2 Principal boundary

A Carelog `MANAGER` may be connected to a Shared Identity account.

A Carelog `CUSTOMER` is an externally managed CRM customer and is not a platform login principal by default.

Canonical rule:

```text
CRM Customer != Identity User
```

A CRM customer must not be backfilled into Shared Identity merely because the record is stored in a table historically named `users`.

### 5.3 Cross-service reference

Carelog may store:

```text
manager.identity_user_id
```

or a compatibility field such as `account_id`.

This value is a logical reference to Shared Identity and must not use a cross-database foreign key.

## 6. Finance Harness boundary

### 6.1 Owned responsibilities

Finance Harness owns:

- Finance profile;
- Finance-specific consent;
- question and analysis request;
- PolicyGuard execution;
- Lens routing and execution metadata;
- journal and review;
- product-specific usage state;
- product-specific retention and deletion;
- Finance authorization rules.

### 6.2 Identity integration

Finance Harness consumes Shared Identity through:

- locally validated access tokens;
- explicit Identity API calls only when current account state or account management is required;
- account lifecycle events when asynchronous propagation is required.

Finance Harness must not create a duplicate generic authentication user model.

A product-specific `FinanceProfile` is permitted and should reference the stable identity identifier.

## 7. Shared AI and Product AI boundary

Shared AI owns product-neutral technical execution concerns:

- provider adapters and provider credential ownership;
- model aliases;
- timeout and bounded retry mechanisms;
- rate limit and concurrency controls;
- usage and cost metering;
- shared observability;
- provider failure handling;
- technical safety and streaming mechanisms.

Each Product Service owns:

- product-specific system prompts and domain context;
- input and corpus selection;
- product workflow and domain policy;
- retrieval policy;
- product-tool meaning and permission;
- domain validation;
- result persistence and business application.

Provider-neutral RAG adapters, embedding runtime, vector infrastructure, shared AI
orchestration, and a common AI job runtime remain candidates. Their concrete
ownership and adoption require a follow-up decision after a real use case.

## 8. Service-to-service ownership rules

| Concern | Canonical owner |
|---|---|
| Account authentication | Shared Identity |
| Password hash | Shared Identity |
| OAuth provider linkage | Shared Identity |
| Token signing and refresh | Shared Identity |
| Carelog manager profile | Carelog |
| CRM customer | Carelog |
| Finance profile | Finance Harness |
| Finance journal and review | Finance Harness |
| Product-specific role | Relevant product service |
| Product-specific consent | Relevant product service |
| Product-neutral AI execution mechanism | Shared AI |
| Product prompt, workflow, policy, tool, validation, and result | Relevant product service |
| Shared event envelope | Foundation |
| Concrete event payload | Publishing service repository |
| Concrete DDL and indexes | Owning service repository |
| Incident and recovery procedure | Owning service repository |

## 9. Communication boundary

A service may interact with another service only through an approved contract:

```text
Synchronous API
Asynchronous Event
Locally validated signed token
```

The following are prohibited:

```text
Cross-service table read
Cross-service table write
Cross-database foreign key
Shared ORM entity
Shared mutable database schema
Unversioned event payload
```

## 10. Transitional state

Logical separation inside Carelog precedes the approved but not-started physical Shared
Identity extraction.

During transition:

- existing login behavior may remain compatible;
- Carelog may temporarily contain account and credential modules;
- the target ownership boundary must still be preserved;
- compatibility identifiers must be marked transitional;
- a transitional token claim must not become a permanent cross-product contract by accident.

The physical extraction sequence is RPL-52 → RPL-53 → RPL-54 → RPL-55 under
`ADR-0017`. RPL-27 is retargeted only after G4, followed by RPL-50. Copying code or
starting a process is not migration completion; behavior, data, security, cutover and
rollback evidence belong in the implementation repositories.

## 11. Documents required in each MSA repository

Each service repository should create these documents when the corresponding implementation exists:

```text
docs/architecture/service-overview.md
docs/architecture/identity-integration.md
docs/data/persistence-model.md
docs/contracts/published-events.md
docs/contracts/consumed-events.md
docs/runbooks/
```

Bounded-context documents should additionally define:

- aggregate roots;
- invariants;
- state transitions;
- transaction boundaries;
- ports and adapters;
- commands and queries;
- published and consumed events.

## 12. Change control

A change requires Foundation review when it:

- moves ownership between services;
- introduces shared mutable data;
- changes the canonical identity identifier;
- changes the cross-service authentication model;
- changes event-envelope semantics;
- permits a new form of cross-service data access.

A service-local implementation change does not require a Foundation change when it preserves the existing shared boundary and contract.
