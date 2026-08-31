---
title: "RPL-55 Slice A′ interim service authentication for the CRM identity projection"
adr_id: "ADR-0019"
document_status: accepted
decision_status: accepted_with_constraints
decision_scope: architecture
owner: "Foundation Architecture / Backend Service Foundation communication architecture"
authors:
  - codex
reviewers:
  - "independent architecture/security review (RPL55_SLICEA_INTERIM_SERVICE_AUTH_RATIFIED)"
approvers:
  - "Foundation Architecture"
created_at: "2026-08-31"
reviewed_at: "2026-08-31"
approved_at: "2026-08-31"
effective_from: "2026-08-31"
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
constraints:
  - "Exactly one relationship is in scope: platform-identity → Carelog Product Backend, direct internal HTTP, the exact CRM identity projection endpoint."
  - "The service credential is dedicated, endpoint-scoped, symmetric, environment-provisioned, high entropy, at least 32 characters, and separate from gateway.internal-secret."
  - "Authentication and authorization failure must not be mapped to projection absence or 404."
  - "The mechanism is interim and exclusive to RPL-55 Slice A′; reuse requires a separate accepted decision."
  - "No portfolio-wide service-authentication HOW or generic service-authentication platform is selected."
affected_docs:
  - docs/adr/ADR-0015-platform-communication-messaging-scaling.md
  - docs/adr/ADR-0017-shared-platform-gateway-identity-physicalization.md
  - docs/adr/README.md
  - docs/architecture/backend-service-foundation/service-communication-policy.md
  - docs/decisions/decision-log.md
evidence_refs:
  - RPL-55
  - RPL55_SLICEA_INTERIM_SERVICE_AUTH_RATIFIED
supersedes: []
superseded_by: []
superseded_scope: []
remaining_valid_scope: []
replacement_decision_refs: []
---

# ADR-0019: RPL-55 Slice A′ interim service authentication for the CRM identity projection

## 1. Decision Summary

For RPL-55 Slice A′, authorize exactly one direct internal HTTP relationship:

```text
platform-identity
    → direct internal HTTP
    → Carelog Product Backend
    → GET /api/v1/internal/identity/claims/{accountId}
```

The endpoint is a Carelog-owned CRM Identity projection read. It returns only the
projection needed by this integration:

```text
organizationId
role
publicId
```

The interim wire contract is:

```http
X-Service-Id: platform-identity
X-Service-Secret: <opaque dedicated shared secret>
```

No other caller, direction, endpoint, method, service relationship, or authority is
approved by this ADR.

## 2. Status

```text
document_status: accepted
decision_status: accepted_with_constraints
implementation_status: not_started
runtime_support_status: not_supported
product_release_status: not_released
```

This status records the ratified architecture decision. It does not claim that the
Carelog or platform-services implementation, runtime support, deployment, or release
exists.

Ratification reference:

```text
RPL55_SLICEA_INTERIM_SERVICE_AUTH_RATIFIED
```
## 3. Scope

### Scope In

- The single `platform-identity` caller and Carelog Product Backend direction above.
- Direct internal HTTP to the exact `GET /api/v1/internal/identity/claims/{accountId}` route.
- A dedicated endpoint-scoped symmetric service credential for that relationship.
- The service-principal, public-edge, security-boundary, and failure semantics required by this integration.

### Scope Out

- Any other caller, direction, route, HTTP method, service relationship, or authority.
- User authentication, user token semantics, Gateway trust redesign, Identity redesign, or Carelog Product authorization redesign.
- A generic internal API framework or portfolio-wide service-authentication standard.
- Concrete Shared AI service authentication. Shared AI OD-5 remains separately scoped and open.
- Vault, KMS, PKI, a service JWT platform, OAuth2 client credentials, service mesh, a workload identity platform, or a generic IAM framework as requirements of this decision.
- Production code, deployment changes, the Carelog Foundation pin, or implementation evidence.

## 4. Context and Ownership

`platform-identity` needs a bounded synchronous read of the CRM Identity projection
owned by Carelog for the RPL-55 Slice A′ cutover. The relationship is intentionally
narrow: Carelog remains the projection owner and the authoritative verifier of the
service credential, while `platform-identity` is only the named service caller.

The internal call does not route through the public Gateway. This is a service-to-service
projection read, not an end-user authentication flow and not an Identity ownership
transfer.

## 5. Considered Options

### Option A — Dedicated endpoint-scoped symmetric service credential

**Description**

Use the dedicated `X-Service-Id` and `X-Service-Secret` contract for this one caller,
direction, and projection endpoint.

**Advantages**

- Small, explicit interim boundary for the immediate RPL-55 integration.
- Keeps service authentication separate from user authentication and the gateway secret.
- Allows Carelog to enforce the exact projection-read authority locally.

**Disadvantages and Risks**

- Secret rotation and provisioning remain an operational responsibility until a future
  deployment-authentication decision replaces the mechanism.
- A shared secret must not be reused outside this explicitly accepted scope.

**Decision**

Selected with the constraints and boundaries in this ADR.

### Option B — Adopt the future deployment authentication mechanism now

**Description**

Select a portfolio mechanism such as service JWT, workload identity, mTLS, or another
approved deployment-architecture mechanism for this integration.

**Rejected or deferred reason**

The portfolio-wide concrete service-authentication HOW remains owned by future
Deployment Architecture. Selecting it here would exceed RPL-55 Slice A′ and would
prematurely close an open foundation question.

### Option C — Reuse the gateway secret or user/gateway identity headers

**Description**

Treat `gateway.internal-secret`, a user bearer token, or gateway/user identity headers
as the service credential.

**Rejected reason**

This collapses distinct security concepts, broadens authority, and makes credential
failure ambiguous. It is prohibited by this ADR.

## 6. Decision — Credential and Endpoint Boundary

The approved interim mechanism is one dedicated endpoint-scoped symmetric service
credential:

```text
X-Service-Id:     platform-identity
X-Service-Secret: <opaque dedicated shared secret>
```

The credential MUST be:

- separate from `gateway.internal-secret`;
- different in value from `gateway.internal-secret`;
- separately namespaced;
- environment-provisioned;
- high entropy and at least 32 characters;
- never logged, including in error, access, trace, or diagnostic output; and
- startup-invalid while this integration is enabled if missing, blank, shorter than
  32 characters, or equal to the gateway secret.

The fixed service ID and secret authenticate only the one approved caller to the one
approved projection-read boundary. Carelog remains the authoritative service-credential
verifier.

## 7. Authority Boundary

The credential grants exactly:

```text
platform-identity
    → read CRM identity projection by accountId
```

It grants no authority to:

- impersonate a Carelog user;
- assert `X-User-Id`;
- assert `organizationId`, `role`, or `publicId`;
- access customer or event APIs;
- invoke unrelated Carelog endpoints;
- perform writes; or
- replace end-user authentication.

The `platform-identity` service principal and a Carelog user principal are different
security concepts. A service credential authenticates the caller as a service; it does
not establish or replace the identity of an end user.

## 8. Security Boundary

Carelog must enforce the internal route through an isolated internal security boundary,
conceptually:

```text
dedicated internal SecurityFilterChain
    ↓
authenticate X-Service-Id + X-Service-Secret
    ↓
fixed platform-identity service principal
    ↓
projection-read authority
    ↓
exact GET projection endpoint
    ↓
deny unrelated internal path/method access
```

The internal path must not rely on `GatewayHeaderAuthFilter`, `UserPrincipal`, user
identity headers, or `TenantContext`. Normal Carelog user and gateway security behavior
must remain unchanged.

Both public gateways must, as defense in depth:

- reject `/api/v1/internal/**`; and
- strip externally supplied `X-Service-Id` and `X-Service-Secret` headers.

Gateway denial is not the sole security boundary. Carelog remains the authoritative
verifier and must deny the internal route when the service identity is absent, invalid,
or outside the exact projection authority.

## 9. Failure Semantics

| Condition | Response |
|---|---:|
| Missing service credential | `403` |
| Invalid service ID or secret | `403` |
| User bearer token substituted | `403` |
| Gateway credential or user headers substituted | `403` |
| Valid service identity and active account | `200` |
| Valid service identity and missing account | `404` |
| Valid service identity and soft-deleted account | `404` |
| Malformed account ID | `400` |
| Runtime or persistence failure | `500` |

Only an authenticated, legitimate projection absence may become `404`.
Authentication or authorization failure MUST NEVER be represented as `404`. This
prevents credential failure from being interpreted by the consumer as `Optional.empty`
or onboarding eligibility.

## 10. Relation to Existing Decisions

ADR-0019 is a compatible, narrowly scoped follow-up. It does not rewrite ADR-0015 or
ADR-0017 historically.

- **ADR-0015** continues to own the broader future deployment and service-authentication
  direction, including the rule that the concrete mechanism is defined by deployment
  architecture before production release.
- **ADR-0017** continues to own the Shared Gateway/Identity physicalization target and
  the behavior-preserving extraction and cutover intent. This ADR supplies one bounded
  RPL-55 cutover relationship; it does not establish portfolio-wide service auth.
- **Shared AI OD-5** remains separately scoped and open for its concrete service-credential
  HOW. ADR-0019 neither closes nor constrains it beyond general Foundation
  service-boundary principles, and Shared AI is not the owner of this decision.

## 11. Interim Status and Future Supersession

The accepted interim meaning is:

> RPL-55 Slice A′ may use one dedicated endpoint-scoped symmetric service credential
> solely for `platform-identity` to read the Carelog-owned CRM identity projection
> through `GET /api/v1/internal/identity/claims/{accountId}`.

This mechanism is INTERIM and scoped exclusively to RPL-55 Slice A′. It:

- does not close the portfolio-wide service-authentication HOW;
- does not close Shared AI OD-5;
- does not transfer ownership to Shared AI;
- is not the permanent inter-service authentication standard;
- creates no precedent requiring another service or endpoint to use shared secrets; and
- requires a separate accepted decision for reuse by another caller, direction, route,
  method, or authority.

Future Deployment Architecture may supersede the credential mechanics with service JWT,
workload identity, mTLS, or another approved mechanism. Supersession changes
authentication and transport mechanics only. It MUST NOT change:

- Product ownership;
- projection direction;
- endpoint semantics;
- response semantics; or
- the Product ↔ Identity projection contract.

## 12. Consequences

### Positive

- The RPL-55 consumer receives a current Carelog-owned projection through a direct,
  explicit internal contract.
- Service authentication, user authentication, and public Gateway header trust remain
  distinct boundaries.
- Authentication failure cannot be silently converted into projection absence.

### Negative and Operational

- The integration needs separate environment provisioning, validation, and eventual
  rotation of its dedicated secret.
- The mechanism is intentionally limited and must not be copied into another integration
  without a new accepted decision.
- A future deployment-authentication decision may require a mechanics-only migration.

## 13. Implementation and Verification Boundary

This ADR records architecture constraints only. Carelog and platform-services own the
implementation, configuration, secret provisioning, tests, runtime evidence, and
cutover evidence in their respective repositories. No implementation completion or
runtime support is implied by acceptance of this ADR.

The implementation must preserve the isolated internal security boundary, exact route
and method, authority boundary, public-edge defense in depth, and failure semantics
recorded above. It must also preserve ADR-0017's behavior-preserving cutover intent.

## 14. Related Records

### Decisions

- [DEC-068](../decisions/decision-log.md) — concise Decision Log projection of this ADR
- DEC-064 — Foundation communication and deployment-authentication ownership principles

### ADRs

- [ADR-0015](./ADR-0015-platform-communication-messaging-scaling.md) — broader communication and future service-authentication direction
- [ADR-0017](./ADR-0017-shared-platform-gateway-identity-physicalization.md) — Gateway/Identity physicalization and behavior-preserving cutover

### Affected Documents

- [ADR index](./README.md)
- [Service Communication Policy](../architecture/backend-service-foundation/service-communication-policy.md)
- [Decision Log](../decisions/decision-log.md)

## 15. Acceptance Record

### Decision

```text
decision_status: accepted_with_constraints
```

### Effective Scope

```text
One direct internal HTTP relationship:
platform-identity → Carelog Product Backend
GET /api/v1/internal/identity/claims/{accountId}
```

### Required Follow-up

- Implementation repositories must provide the implementation and runtime evidence
  without changing the scope of this ADR.
- Future Deployment Architecture owns any permanent authentication/transport replacement.

### Approved By

```text
Foundation Architecture
```

### Approved At

```text
2026-08-31
```

### Approval Authority Reference

```text
RPL55_SLICEA_INTERIM_SERVICE_AUTH_RATIFIED
```
