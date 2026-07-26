# Documentation Ownership and Placement

- Status: Draft
- Scope: Harness Foundation and all MSA repositories
- Canonical owner: `harness-foundation-docs`
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Term scope: This document belongs to the Backend Service Foundation (`DEC-059`), covering MSA backend service repositories (e.g. Carelog, Finance Harness backend, Shared Identity). This "Foundation" scope is a sibling to, not a replacement for, the existing `oh-my-ai` product-family Foundation scope (`docs/architecture/README.md`, `docs/contracts/README.md`).

## 1. Purpose

This document defines where architecture, contract, domain, implementation, AI-instruction, and operational documents must live.

Its purpose is to prevent:

- Foundation becoming a dump of service-specific implementation details;
- the same shared contract being copied differently across repositories;
- domain rules being hidden only in `CLAUDE.md`;
- operational knowledge being mixed with product decisions;
- documents being created too early without an implementation owner.

## 2. Documentation layers

| Layer | Canonical location | Responsibility |
|---|---|---|
| Platform Foundation | `harness-foundation-docs` | Shared MSA architecture, common contracts, cross-service decisions |
| Service architecture | Each MSA repository `docs/architecture/` | Service modules, dependencies, integration application |
| Service data design | Each MSA repository `docs/data/` | Actual schema, FK, indexes, retention, migration |
| Service contracts | Each MSA repository `docs/contracts/` | Concrete APIs and event payloads |
| Domain design | Each MSA repository `docs/domains/` or bounded-context `README.md` | Aggregate, invariants, state transition, transaction |
| Operations | Each MSA repository `docs/runbooks/` | Recovery, replay, key rotation, reconciliation |
| AI work instructions | Repository or bounded-context `CLAUDE.md` | Rules for AI-assisted code and document changes |
| Workspace navigation | Optional parent-directory `CLAUDE.md` | Repository map and cross-repository reading order |
| Personal defaults | User-level Claude or Codex configuration | Personal working style only |

## 3. Foundation ownership

Foundation owns documents that apply to more than one service or define the relationship between services.

Examples:

- service boundaries;
- database ownership;
- cross-service reference policy;
- synchronous and asynchronous communication policy;
- distributed consistency baseline;
- shared identity-token contract;
- common event envelope;
- platform-level idempotency contract;
- cross-service ADR;
- documentation placement policy.

Foundation does not own:

- concrete table names;
- service package structure;
- domain state-machine details;
- service-specific API paths;
- service-specific event payload;
- retry counts;
- actual Kafka, NATS, or queue configuration;
- concrete partition size;
- production recovery command.

## 4. Service repository ownership

Each MSA repository owns how it implements Foundation standards.

Recommended structure:

```text
<service-repository>/
├── CLAUDE.md
└── docs/
    ├── architecture/
    │   ├── service-overview.md
    │   ├── module-boundaries.md
    │   ├── dependency-map.md
    │   └── identity-integration.md
    ├── domains/
    │   └── <bounded-context>.md
    ├── data/
    │   ├── persistence-model.md
    │   ├── migration-plan.md
    │   └── partitioning-retention.md
    ├── contracts/
    │   ├── public-api.md
    │   ├── published-events.md
    │   └── consumed-events.md
    └── runbooks/
        ├── event-reprocessing.md
        └── consistency-reconciliation.md
```

This is a placement map, not a requirement to create every file immediately.

Create a document when:

- the corresponding capability exists;
- the design is being implemented;
- another developer or AI session needs the contract;
- an operational procedure must be repeatable.

## 5. Domain-level ownership

A domain or bounded-context document should define:

- purpose and vocabulary;
- aggregate root;
- entity and value-object roles;
- invariants;
- commands and queries;
- state transitions;
- transaction boundaries;
- concurrency control;
- ports and adapters;
- published and consumed events;
- data lifecycle;
- prohibited dependencies.

Do not create a separate document for every technical package such as:

```text
controller
service
repository
dto
config
```

Package-level documentation is justified only when a package represents a meaningful bounded context or contains unusual architectural constraints.

## 6. `CLAUDE.md` placement

### 6.1 User-level

User-level instructions should contain only personal defaults, for example:

- commit language;
- preferred patch size;
- general review style.

They must not contain Harness-specific service boundaries or product contracts.

### 6.2 Workspace parent directory

An optional non-canonical workspace file may map sibling repositories.

Example:

```text
/Users/work/Github/harness-platform/
├── CLAUDE.md
├── harness-foundation-docs/
├── identity-service/
├── finance-harness-backend/
└── carelog-backend/
```

The workspace `CLAUDE.md` may state:

- repository purpose;
- shared reading order;
- source-of-truth locations;
- cross-repository change checklist.

It is not a substitute for versioned canonical documents.

### 6.3 Foundation repository root

`harness-foundation-docs/CLAUDE.md` should define:

- Foundation scope;
- canonical document categories;
- decision-status discipline;
- prohibition on service-specific implementation detail;
- required cross-document links.

### 6.4 Service repository root

Each service root `CLAUDE.md` should define:

- service ownership;
- mandatory Foundation references;
- prohibited cross-service access;
- local build and test commands;
- local code-change boundaries;
- service-specific documentation ownership.

### 6.5 Bounded context

A nested `CLAUDE.md` is appropriate only when a bounded context has distinct rules that materially affect code changes.

Avoid creating nested instruction files for ordinary technical layers.

## 7. Canonical source and duplication

A shared rule has one canonical Foundation document.

Service repositories may summarize the rule, but must:

- link or name the canonical document;
- avoid copying the entire shared contract;
- document only the service-specific application;
- record intentional deviations through an ADR.

Example:

```text
Foundation:
Cross-service FK is prohibited.

Finance service:
finance_profile.identity_user_id is stored without a physical FK.
```

## 8. Document status

Documents should declare status when ambiguity is possible.

Recommended statuses:

```text
Draft
Proposed
Accepted
Superseded
Deprecated
Archived
```

Status dimensions must remain separate:

```text
Decision accepted
Implementation completed
Runtime supported
Fixture passed
Product released
```

A document being present does not prove implementation.

## 9. Required Foundation index

The Backend Service Foundation README should list:

- document title;
- canonical path;
- status;
- affected services;
- superseded document if any;
- implementation status where relevant.

## 10. Change workflow

### Shared change

When a change affects multiple services:

1. update or propose the Foundation architecture or contract;
2. record a cross-service ADR when ownership or compatibility changes;
3. identify affected MSA repositories;
4. update each service implementation document;
5. implement and test per service;
6. verify cross-service compatibility;
7. update status separately.

### Local change

When a change stays inside one service and preserves shared contracts:

1. update the service document;
2. update the domain document if invariants change;
3. implement and test locally;
4. no Foundation change is required.

## 11. Initial MSA repository checklist

When a new MSA repository is created, it should initially contain only:

```text
CLAUDE.md
docs/architecture/service-overview.md
docs/data/persistence-model.md
```

Add these when the service exposes or consumes them:

```text
docs/contracts/public-api.md
docs/contracts/published-events.md
docs/contracts/consumed-events.md
```

Add domain and runbook documents during actual design and operation.

Each MSA repository's own documents are created at the point implementation actually begins. A service repository that does not yet exist is not created solely to hold documentation in advance.

## 12. Current placement decision

The Foundation repository should remain an independent Git repository located alongside the service repositories at the local workspace level.

It should not be placed only in:

- user-global Claude settings;
- user-global Codex settings;
- one product repository;
- one service source tree.

Recommended relationship:

```text
harness-platform/
├── harness-foundation-docs/      # Independent Git repository
├── identity-service/             # Independent Git repository
├── finance-harness-backend/      # Independent Git repository
├── carelog-backend/              # Independent Git repository
└── finance-harness-fe/           # Independent Git repository
```
