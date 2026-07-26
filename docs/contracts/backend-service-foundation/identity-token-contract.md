# Shared Identity Token Contract

- Status: Draft
- Scope: User access tokens issued by Shared Identity and consumed by Harness product services
- Canonical owner: `harness-foundation-docs`
- Implementation completed: No
- Runtime supported: No
- Product released: No
- Term scope: This document belongs to the Backend Service Foundation (`DEC-057`). "Shared Identity" is the canonical logical service name; `identity-platform` (`docs/architecture/repository-service-boundaries.md` §7.4) is a candidate repository name pending physical separation. "Harness product services" refers to backend MSA services (e.g. Carelog, Finance Harness backend), not `oh-my-ai` Runtime Adapters or its "Shared Platform" (`DEC-005`).

## 1. Purpose

This document defines the stable cross-service access-token contract.

It defines token semantics that product services may rely on. It does not define concrete Spring Security configuration, key storage, OAuth-provider configuration, login UI, refresh-token schema, or deployment secrets.

## 2. Token model

Shared Identity issues a signed access token.

Product services validate the token locally using trusted signing-key material.

```text
Client
→ Shared Identity
→ Signed access token
→ Product API
→ Local signature and claim validation
```

A product service should not call Shared Identity on every authenticated request solely to identify the principal.

## 3. Canonical principal

The JWT subject is the stable platform account identifier.

```text
sub = platform_account_id
```

Requirements:

- immutable;
- non-semantic;
- not an email;
- not a phone number;
- not an OAuth provider subject;
- not a Carelog CRM customer ID;
- not a Finance profile ID;
- not reused after deletion.

The canonical application representation may be named `identity_user_id` or `account_id`, but each service must document its chosen local field name.

## 4. Required claims

| Claim | Requirement | Meaning |
|---|---|---|
| `iss` | Required | Trusted Shared Identity issuer |
| `sub` | Required | Stable platform account identifier |
| `aud` | Required | Intended product API or approved audience |
| `iat` | Required | Issued-at time |
| `exp` | Required | Expiration time |
| `jti` | Required | Unique token identifier |
| `sid` | Conditional | Authentication session identifier when session-aware revocation is supported |

Numeric date claims follow JWT numeric-date semantics.

## 5. Audience

A consumer must verify that its expected audience is present.

Recommended model:

```text
aud = finance-api
aud = carelog-api
```

A broad platform-wide audience should not be used merely for convenience.

Multi-audience tokens require explicit review because they increase token reuse across services.

## 6. Optional claims

Optional shared claims may include:

| Claim | Purpose |
|---|---|
| `auth_time` | Time of primary authentication |
| `amr` | Authentication method references |
| `acr` | Authentication assurance context |
| `tenant_hint` | Non-authoritative routing hint only, if adopted |
| `token_version` | Token-contract compatibility marker if required |

Optional claims must not become authorization sources unless the contract explicitly says so.

## 7. Claims prohibited by default

Do not place these in the shared token by default:

- password or credential metadata;
- full user profile;
- address;
- phone number;
- arbitrary OAuth provider payload;
- Carelog CRM customer data;
- Finance journal or analysis data;
- product-specific permissions;
- rapidly changing product roles;
- secrets;
- raw consent documents.

Product-specific role or membership should normally be resolved inside the product service.

A small authorization claim may be introduced only through a reviewed contract when stale-token behavior is acceptable.

## 8. Validation requirements

A consuming service must verify:

1. supported signature algorithm;
2. trusted issuer;
3. expected audience;
4. signature;
5. expiration;
6. issued-at sanity;
7. required claim presence;
8. subject format;
9. token type if the issuer uses a token-type claim;
10. key validity and rotation state.

A service must not accept unsigned tokens or select an algorithm solely from untrusted token input.

## 9. Signing keys and rotation

Shared Identity owns:

- key generation;
- private-key protection;
- public-key publication;
- active-key selection;
- rotation;
- emergency revocation.

Product services should consume public verification keys through an approved mechanism such as JWKS.

Rotation must support overlap:

```text
new key published
→ consumers refresh
→ new tokens use new key
→ old access tokens remain verifiable for bounded lifetime
→ old key retired
```

Concrete cache duration and refresh behavior belong in each product-service repository.

## 10. Token lifetime

Access tokens should be short-lived relative to account lifecycle changes.

The concrete lifetime is an implementation decision and must balance:

- security;
- Identity availability;
- revocation requirements;
- product UX;
- key rotation;
- account-deactivation propagation.

Refresh tokens or sessions are owned and validated by Shared Identity and are not accepted by product APIs.

## 11. Revocation and account state

Local JWT validation means a recently deactivated account may retain access until one of these applies:

- access token expires;
- session-aware revocation check is performed;
- product service receives an account lifecycle event;
- high-risk operation performs current-state verification.

Each product service must define which operations require stronger current-state assurance.

## 12. Error behavior

A product API should distinguish at least:

```text
missing credentials
invalid token
expired token
wrong audience
insufficient product authorization
account locally disabled
```

External error payloads must not reveal signing-key or validation internals.

The shared HTTP error-envelope contract may be defined separately.

## 13. Transitional compatibility

During Carelog migration, a temporary compatibility claim may be used only when required.

Examples may include a legacy Carelog user identifier.

Rules:

- it is non-canonical;
- it must be clearly named as legacy;
- it must have a removal plan;
- new product services must not depend on it;
- Shared Identity must not adopt product-specific identifiers as its primary subject.

The target remains:

```text
sub = stable platform account ID
```

## 14. Service-to-service identity

This contract covers user access tokens.

Service-to-service authentication requires a separate contract because:

- the principal is a workload, not a user;
- audience and authorization differ;
- token lifetime and rotation may differ;
- user-delegation semantics must be explicit.

## 15. Product-service obligations

Each consuming service repository must document:

```text
docs/architecture/identity-integration.md
```

It should define:

- expected issuer;
- expected audience;
- local principal type;
- local account/profile mapping;
- signing-key cache behavior;
- account-deactivation behavior;
- high-risk current-state checks;
- local authorization source;
- migration compatibility.

## 16. Security restrictions

- Never log a full access token.
- Never persist access tokens as general application data.
- Never use a token claim without validating the token first.
- Never use email as the canonical principal key.
- Never trust product roles from an unspecified claim.
- Never allow one service to mint user tokens unless explicitly authorized as part of Shared Identity.
