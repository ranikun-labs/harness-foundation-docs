# Shared Audit Producer Event Contract and Identity Initial Catalog

- Status: Draft — canonical AU-G1 contract; AU-G1 review passed
- Contract scope: AU-G1 producer wire contract and canonical event-policy registry
- Canonical owner: `harness-foundation-docs`
- Architecture predecessor: [ADR-0021](../../adr/ADR-0021-shared-audit-foundation-architecture.md) / DEC-070
- AU-G2B implementation evidence: `ranikun-labs/platform-services@2009a46e68fb2289654b52065958a18313d9f6ce`
- Producer semantic boundary: Implemented
- Runtime supported: No
- Product released: No

## 1. Status boundary

This document specializes the
[Shared Event Envelope Contract](./event-envelope-contract.md) for durable forensic and
accountability facts produced for Shared Audit. It is product-neutral and applies to future
producers including Shared Identity, Carelog, Finance, Shared AI, Notification, and
Subscription & Payments.

```text
AU-G1 canonical contract and Identity catalog
+ AU-G2 producer semantic publisher boundary implemented
!= JetStream stream or consumer deployed
!= audit schema created
!= producer outbox implemented
!= Identity instrumented
!= replay or reconciliation mechanism implemented
```

Shared Audit is not application logging, metrics, tracing, debugging telemetry, event sourcing,
or Product primary business storage. The producer owns the fact and its meaning. Shared Audit
owns the append-only forensic record after consumption.

### 1.1 AU-G2 producer boundary implementation status

At `platform-services/main@2009a46e68fb2289654b52065958a18313d9f6ce`,
`platform-core:shared-audit` is a non-executable Java 21 `java-library` logical feature module
composed opt-in into `platform-core:app`. It provides a provider-neutral `AuditPublisher`,
static policy resolution by `event_type` and `schema_version`, producer-side actor/resource,
per-event payload and privacy validation, and an internal `AuditEventCapture` mechanism boundary.

`Accepted` means that canonical validation and policy resolution succeeded and the selected
capture mechanism accepted custody according to its capability. It does not mean broker
publication, broker acknowledgement, Audit PostgreSQL persistence, consumer processing,
durable replay, or exactly-once behavior. The default capture remains unavailable, and
`SECURITY_CRITICAL` events cannot be `Accepted` until AU-G8 supplies the required
durability-capable capture.

This implementation status does not add transport or persistence metadata to the producer
wire contract. In particular, `recorded_at` remains consumer/store persistence metadata.

## 2. Resolved design choices

| Area | Alternatives considered | Governing evidence and trade-off | AU-G1 decision |
|---|---|---|---|
| Envelope | Reuse Foundation unchanged; unrelated Audit shape; Foundation specialization | ADR-0021 §6.6 requires alignment but permits unsafe aggregate identifiers to be absent | Specialized Foundation envelope with Audit context fields |
| Actor | Flat identifier; unlimited principal kinds; typed actor | Anonymous failures need an actor without an identifier; future AI execution must not force a new identity class | Required typed `actor`; optional `originating_actor` |
| Producer/product/tenant | One overloaded field; three explicit concepts | Shared Identity can produce on behalf of Carelog; tenant may not exist or be safely known | Stable producer is required; product and tenant are conditional |
| Resource | Universal aggregate; optional primary resource | Anonymous failures cannot safely identify an account | Optional primary resource; no fabricated identifier |
| Action/outcome | Arbitrary strings; large domain-specific enums; small governed vocabulary | Cross-product querying needs bounded meanings without encoding every domain | Governed action vocabulary and `SUCCEEDED` / `REJECTED` / `FAILED` |
| Event naming | Transport names; outcome only in a field; namespaced facts | Foundation requires namespaced past-tense facts; some outcomes change privacy and policy | Lower-case namespaced fact; outcome suffix only when semantically material |
| Versioning | Version every edit; never version; compatibility-based versioning | Foundation versions incompatible payload changes | Start at 1; increment for breaking changes; new type for changed fact meaning |
| Policy placement | Serialize policy on every event; central registry | Inclusion, retention, and recovery policy are static per event type/version | Static policy registry, not repeated wire payload |
| Identity catalog | One generic authentication event; distinct forensic facts | Occurrence, privacy, and durability differ across flows | Fourteen canonical Audit event types plus explicit observability-only dispositions |
| Logout | One composite fact; decomposed facts; decomposed plus summary | Current code writes Redis first and PostgreSQL second without distributed atomicity | Two mutation-aligned facts; no higher-level completion event |

No new ADR is required. ADR-0021 already approved the architecture and explicitly delegated the
producer contract, event catalog, policy fields, and logout re-derivation to AU-G1.

## 3. Canonical producer wire contract

Wire field names use `snake_case`. JVM or other internal names may follow language conventions,
but serialization must preserve these names and meanings.

```json
{
  "event_id": "018f6e8c-0f4d-7c21-b0d3-4f4d71f8f001",
  "event_type": "identity.authentication.login_succeeded",
  "schema_version": 1,
  "occurred_at": "2026-09-09T06:00:00.000Z",
  "producer": "system.shared-identity",
  "actor": {
    "actor_type": "AUTHENTICATED_USER",
    "actor_id": "018f6e8b-b7a0-73c3-b31f-9897df1b6f83",
    "roles": ["MANAGER"]
  },
  "product": "system.carelog",
  "tenant": {
    "tenant_type": "organization",
    "tenant_id": "018f6e8a-c901-7e8f-87f4-79c65f7e7d0d"
  },
  "resource": {
    "resource_type": "platform_account",
    "resource_id": "018f6e8b-b7a0-73c3-b31f-9897df1b6f83"
  },
  "action": "AUTHENTICATE",
  "outcome": "SUCCEEDED",
  "correlation_id": "018f6e89-90f2-7b21-a070-5a0ec8cd0081",
  "payload": {
    "authentication_method": "PASSWORD"
  }
}
```

The example is a contract illustration, not runtime evidence.

### 3.1 Required fields

| Field | Type | Rule |
|---|---|---|
| `event_id` | String | Globally unique immutable logical occurrence identifier; stable across retry, redelivery, and replay |
| `event_type` | String | Registered namespaced forensic fact |
| `schema_version` | Positive integer | Schema version for the stable event type; starts at `1` |
| `occurred_at` | RFC 3339 UTC string | Producer-owned time at which the stated fact became true |
| `producer` | String | Stable logical producer identifier; use the system catalog identifier when one exists |
| `actor` | Object | Executor actor snapshot following §4 |
| `action` | String | Registered canonical action following §7 |
| `outcome` | String | One of `SUCCEEDED`, `REJECTED`, or `FAILED` |
| `payload` | Object | Bounded event-specific attributes; an empty object is valid |

### 3.2 Conditional fields

| Field | Presence rule |
|---|---|
| `originating_actor` | Include only when a different trusted actor initiated the executor's action |
| `product` | Required when the producer reliably knows it is acting for an originating Product; otherwise absent |
| `tenant` | Required when the fact is scoped to a reliably established tenant; otherwise absent |
| `resource` | Include only when a safe, stable primary resource is known |
| `correlation_id` | Required when part of a request or workflow; create one at an ingress that has none |
| `causation_id` | Required when a command or event directly caused the fact |
| `trace_id` | Optional diagnostic correlation when available and safe; stable if included |

Absent conditional fields are omitted rather than populated with empty strings, sentinel IDs, or
fabricated values.

### 3.3 Time ownership

The producer owns `event_id` and `occurred_at`. `occurred_at` is not publish, receive, retry, or
wall-clock processing time.

`recorded_at` is not a producer wire field. The Shared Audit consumer/store creates it only after
durable append succeeds. Broker timestamps, delivery attempts, consumer receive time, database row
IDs, and quarantine metadata are also persistence or transport metadata, not producer content.

## 4. Actor model

`actor.actor_type` is required and has this closed baseline vocabulary:

| Actor type | `actor_id` | Meaning |
|---|---|---|
| `AUTHENTICATED_USER` | Required | A trusted platform account principal; identifier is opaque |
| `ANONYMOUS` | Prohibited | No trusted platform principal was established |
| `SYSTEM` | Required | Stable logical service, scheduler, or automation principal; never a runtime instance ID |

`roles` is an optional, bounded array of decision-time role/context values. `ADMIN` is a role or
authorization context on an authenticated actor, not a fourth actor type.

For the minimum future AI case, the executor is a `SYSTEM` actor with a stable logical identifier.
When a trusted user or system initiated that execution, `originating_actor` may contain the same
shape. This does not create an AI-specific principal class or authorize the action.

An actor snapshot is evidence, not authorization. Consumers and readers must apply current
authorization independently.

## 5. Producer, Product, and tenant

- `producer` identifies the logical service that created and owns the fact. Deployment instance,
  pod, host, and transport adapter names are not producer identities.
- `product` identifies the originating Product context. It does not replace the producer. For
  example, `system.shared-identity` may produce on behalf of `system.carelog`.
- `tenant.tenant_type` identifies the Product-defined tenant kind and `tenant.tenant_id` is its
  opaque stable identifier. Both are required when `tenant` is present.
- Product and tenant context must come from trusted request, command, token, or authoritative state.
  They must not be inferred from untrusted login input, OAuth callback query data, or rejected
  credentials.
- Platform-global and safely anonymous facts may omit both Product and tenant.

## 6. Resource model

`resource` contains a required `resource_type` and a conditionally present opaque `resource_id`.
Omit the entire object when no safe primary resource exists. A resource identifier is a logical
reference only and creates no physical foreign key or cross-module read authority.

For actions involving multiple resources, select one true primary resource. Put additional bounded,
typed opaque references in explicitly named event payload fields. Do not introduce an unbounded
generic resources bag, concatenate identifiers, or fabricate an aggregate.

Anonymous login, OAuth authentication rejection, refresh rejection, and rejected bearer events do
not carry a platform account resource derived from the submitted credential or token.

## 7. Action and outcome

Initial actions are `CREATE`, `UPDATE`, `AUTHENTICATE`, `AUTHORIZE`,
`INITIATE_AUTHORIZATION`, `REFRESH`, `REVOKE`, `VERIFY`, `READ`, and `EXECUTE`.
New canonical action values require catalog/contract review and must follow the compatibility
rules in §9. Producers may not emit arbitrary unregistered actions or invent synonyms.

| Outcome | Meaning |
|---|---|
| `SUCCEEDED` | The action named by the event reached its defined successful occurrence point |
| `REJECTED` | An expected security, policy, validation, conflict, or business decision denied the action |
| `FAILED` | An unexpected operation or system failure occurred after the action was attempted |

`FAILED` does not turn generic telemetry into an Audit fact. A failure is published only when its
event type is explicitly cataloged as forensic/accountability evidence.

## 8. Event type naming

Event types use lower-case dot-separated namespaces and `snake_case` tokens:

```text
<owner_domain>.<capability_or_resource>.<past_tense_fact>
```

Names describe facts, never commands, transports, consumers, or log messages. Outcome may appear in
the fact name when it distinguishes occurrence, privacy, or policy semantics, as with
`login_succeeded` and `login_rejected`. The wire `outcome` remains required and must agree with the
registered event type.

A spelling change is an event type change. An event type must not be renamed in place or reused for
a different fact.

## 9. Schema versioning and compatibility

- Every event type starts at `schema_version: 1`.
- Adding an optional field is non-breaking only when absence preserves existing meaning and consumers
  are required to ignore unknown optional fields. It does not require a version increment.
- Adding a required field, making an optional field required, removing a field, changing a field
  type/format, or narrowing accepted values is breaking and increments `schema_version`.
- Enum expansion is breaking by default. It is non-breaking only when that field was explicitly
  defined as open and all consumers preserve an unknown-value path.
- A field, action, outcome, or event type meaning must never be silently reinterpreted.
- If the fact or occurrence point changes, create a new `event_type`; a version increment cannot
  disguise a new fact.
- Consumers declare supported event types and versions. Tolerant consumers are deployed before a
  producer emits a compatible addition or new supported version.
- Retry and replay preserve the original event type, version, identifier, occurrence time, and
  producer content.

## 10. Duplicate and integrity identity

`event_id` is the deduplication key. The canonical producer-content fingerprint covers every
producer-owned wire field except `event_id`: `event_type`, `schema_version`, `occurred_at`,
`producer`, actor fields, Product/tenant/resource context, `action`, `outcome`, correlation and
causation fields, optional stable `trace_id`, and the complete event-specific `payload`.

It excludes `recorded_at` and all broker, transport, delivery, consumer, persistence, and quarantine
metadata.

```text
same event_id + same canonical producer content
-> idempotent duplicate; no new logical fact

same event_id + different canonical producer content
-> integrity violation; do not mutate the canonical ledger; quarantine and alert
```

All included producer content is immutable across retry and replay. Exact canonical JSON and database
fingerprint mechanics belong to AU-G4.

## 11. Event-policy registry boundary

The following are static registry metadata, not fields repeated in every wire event:

```text
affected_business_invariant
audit_inclusion
durability_class
foundation_criticality
retention_class
acceptable_loss_window
duplicate_tolerance
retry_policy
replay_policy
reconciliation_policy
classification_owner
approval_reference
```

The canonical policy key is `event_type` plus `schema_version`. The AU-G2 producer boundary
resolves this static policy before capture; a future consumer uses the same key for its own
canonical validation. An unregistered or unclassified Audit event is treated as critical and is
not silently accepted.

`durability_class` maps one-to-one to Foundation `criticality` with the same value:
`SECURITY_CRITICAL`, `SECURITY_DECISION`, `BUSINESS_CRITICAL`, or `INFORMATIONAL`.
`BUSINESS_CRITICAL` must be classified per event and does not inherit
`SECURITY_CRITICAL` publication semantics automatically.

### 11.1 Policy vocabulary

| Field | Value | Contract meaning |
|---|---|---|
| `acceptable_loss_window` | `NONE_AFTER_COMMIT` | No fact loss is accepted after the authoritative PostgreSQL mutation commits |
|  | `OCCURRENCE_TO_ACK_RESIDUAL` | Direct publication has a documented occurrence-to-ack crash/failure window |
|  | `SIDE_EFFECT_TO_ACK_RESIDUAL` | A non-transactional Redis/external side effect can succeed before publish acknowledgement |
|  | `BOUNDED_BEST_EFFORT` | Loss is allowed for this informational fact after the bounded attempt |
| `duplicate_tolerance` | `IDEMPOTENT_SAME_ID_SAME_CONTENT` | Duplicate delivery is normal only when identifier and producer content agree |
| `retry_policy` | `DURABLE_UNTIL_POLICY_EXHAUSTION` | Producer-owned durable record is retried in bounded cycles until configured exhaustion, then alerted |
|  | `DIRECT_BOUNDED_ACK` | Direct acknowledged publication uses bounded attempts/backoff; exact values belong to AU-G3/AU-G8 |
|  | `BEST_EFFORT_BOUNDED` | Fail-open bounded attempt; no durable recovery promise |
| `replay_policy` | `DURABLE_SOURCE_SAME_EVENT_ID` | Replay comes from the producer-owned durable source and preserves the logical event |
|  | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | Replay is allowed only while the original immutable event remains available; never reconstruct it |
|  | `NO_PRODUCER_RECOVERY_REQUIRED` | No producer recovery replay is promised; broker redelivery still preserves the ID |
| `reconciliation_policy` | `PRODUCER_DURABLE_PUBLICATION_STATE` | Detect unpublished/stuck durable records and reconcile publication from that source |
|  | `STATE_CHECK_ONLY_NO_FACT_RECONSTRUCTION` | Current authoritative state may be checked when safe, but it cannot recreate the historical fact |
|  | `NO_SAFE_RECONSTRUCTION` | No authoritative durable source can safely reconstruct the exact occurrence |
|  | `NONE_REQUIRED` | No reconciliation is required for the informational fact |

### 11.2 Class-level recovery rules

- A `SECURITY_CRITICAL` PostgreSQL mutation requires a future producer-owned outbox in the same local
  transaction. It uses a stable `event_id`, detects unpublished/stuck records, retries until policy
  exhaustion, alerts on exhaustion, and reconciles from the durable producer source. Replay never
  creates a new logical event. Loss after commit is effectively zero by contract.
- A `SECURITY_DECISION` uses bounded acknowledged publication and does not universally require an
  outbox. Its accepted residual loss window is explicit. Reconciliation is permitted only when
  authoritative state remains safely inspectable and must not claim recovery of an unreconstructable
  historical decision.
- A `BUSINESS_CRITICAL` event receives its own invariant and recovery classification. No Security
  class behavior is assumed merely from the name.
- An `INFORMATIONAL` event is fail-open and may accept bounded loss as its registry entry states.
- For Redis or external authoritative mutations, no Product DB + side-effect + publish atomicity,
  exactly-once, or 2PC is claimed. Publication is bounded and acknowledged, failure emits metric and
  alert, and reconciliation is bounded to safely reconstructable state. Otherwise the residual loss
  limitation remains explicit.

## 12. Shared Identity initial Audit event catalog

All entries below are contract definitions only. Identity has no Audit instrumentation at the
evidence pin.

### 12.1 Event classification and occurrence

| ID | Canonical `event_type` | Candidate disposition | Action / outcome | Inclusion | Durability / Foundation criticality | Retention | Occurrence point |
|---|---|---|---|---|---|---|---|
| ID-AUD-01 | `identity.authentication.login_succeeded` | Login succeeded | `AUTHENTICATE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Credential and eligibility checks succeed and token/session issuance commits |
| ID-AUD-02 | `identity.authentication.login_rejected` | Login failed as an expected credential/eligibility rejection | `AUTHENTICATE` / `REJECTED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Final safe rejection reason is selected before the response; unexpected system failure remains observability unless separately cataloged |
| ID-AUD-03 | `identity.authentication.refresh_rejected` | Refresh rejected | `REFRESH` / `REJECTED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Final invalid, expired, missing, account-status, or eligibility rejection is selected |
| ID-AUD-04 | `identity.authentication.access_token_revoked` | Logout Redis fact | `REVOKE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Redis access-token blacklist write succeeds |
| ID-AUD-05 | `identity.authentication.refresh_sessions_revoked` | Logout PostgreSQL fact | `REVOKE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_CRITICAL` | `SECURITY_SHORT` | Refresh/session deletion and its future producer-owned outbox record commit in one Identity transaction |
| ID-AUD-06 | `identity.oauth.authentication_succeeded` | OAuth authenticated | `AUTHENTICATE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Provider principal is verified, linked account is active/eligible, and token/session issuance commits |
| ID-AUD-07 | `identity.oauth.authentication_rejected` | OAuth authentication rejected | `AUTHENTICATE` / `REJECTED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Invalid state, provider rejection, unverified principal, inactive account, or orphaned link produces the final rejection |
| ID-AUD-08 | `identity.oauth.principal_verified_unlinked` | Verified but unlinked OAuth principal | `VERIFY` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Provider principal verification succeeds and authoritative link lookup returns no platform account |
| ID-AUD-09 | `identity.account.registered` | Account registered | `CREATE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_CRITICAL` | `SECURITY_LONG` | Account and password credential plus future `identity.audit_outbox` record commit atomically |
| ID-AUD-10 | `identity.credential.password_changed` | Password changed | `UPDATE` / `SUCCEEDED` | `MUST_AUDIT` | `SECURITY_CRITICAL` | `SECURITY_LONG` | Password credential update plus future `identity.audit_outbox` record commit atomically |
| ID-AUD-11 | `identity.authentication.refresh_succeeded` | Refresh succeeded | `REFRESH` / `SUCCEEDED` | `SHOULD_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | Locked refresh session is validated and rotation commits |
| ID-AUD-12 | `identity.oauth.authorization_started` | OAuth authorization started | `INITIATE_AUTHORIZATION` / `SUCCEEDED` | `SHOULD_AUDIT` | `INFORMATIONAL` | `INFORMATIONAL_SHORT` | Product client, redirect, and return target validate; state save and provider URL construction succeed |
| ID-AUD-13 | `identity.authorization.product_access_rejected` | Meaningful Product/account authorization rejected | `AUTHORIZE` / `REJECTED` | `SHOULD_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | An authenticated principal reaches a Product/account policy boundary and a meaningful denial is final |
| ID-AUD-14 | `identity.authentication.bearer_rejected` | High-signal revoked/replay/policy bearer rejection | `AUTHENTICATE` / `REJECTED` | `SHOULD_AUDIT` | `SECURITY_DECISION` | `SECURITY_SHORT` | A trusted boundary classifies a revoked, replayed, or policy-invalid bearer; generic invalid parsing is excluded |

Account registration and password change are explicitly `MUST_AUDIT` plus
`SECURITY_CRITICAL`. Their security-significant PostgreSQL mutations cannot accept commit-to-publish
loss.

### 12.2 Per-event publication and recovery policy

All entries use `duplicate_tolerance: IDEMPOTENT_SAME_ID_SAME_CONTENT`.

| ID | `affected_business_invariant` | Acceptable loss | Retry | Replay | Reconciliation | Classification owner | Approval reference |
|---|---|---|---|---|---|---|---|
| ID-AUD-01 | Successful authentication decisions remain attributable | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `STATE_CHECK_ONLY_NO_FACT_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-02 | Rejected authentication attempts remain visible without account enumeration | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-03 | Refresh rejection decisions remain attributable without exposing credentials | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-04 | A successful current-access revocation remains forensically visible | `SIDE_EFFECT_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` + metric/alert on failure | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-05 | Committed refresh-session revocation is never silently lost | `NONE_AFTER_COMMIT` | `DURABLE_UNTIL_POLICY_EXHAUSTION` + alert | `DURABLE_SOURCE_SAME_EVENT_ID` | `PRODUCER_DURABLE_PUBLICATION_STATE` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-06 | Successful OAuth authentication decisions remain attributable | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `STATE_CHECK_ONLY_NO_FACT_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-07 | OAuth rejection decisions remain visible without principal enumeration | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-08 | Verified external principals lacking an account link remain visible without identifying the principal | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-09 | Every committed account-lifecycle creation has durable forensic evidence | `NONE_AFTER_COMMIT` | `DURABLE_UNTIL_POLICY_EXHAUSTION` + alert | `DURABLE_SOURCE_SAME_EVENT_ID` | `PRODUCER_DURABLE_PUBLICATION_STATE` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 owner-settled baseline |
| ID-AUD-10 | Every committed password mutation has durable forensic evidence | `NONE_AFTER_COMMIT` | `DURABLE_UNTIL_POLICY_EXHAUSTION` + alert | `DURABLE_SOURCE_SAME_EVENT_ID` | `PRODUCER_DURABLE_PUBLICATION_STATE` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 owner-settled baseline |
| ID-AUD-11 | Successful refresh decisions can be investigated without making refresh availability fail-closed | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `STATE_CHECK_ONLY_NO_FACT_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-12 | High-level authorization initiation can be correlated when available | `BOUNDED_BEST_EFFORT` | `BEST_EFFORT_BOUNDED` | `NO_PRODUCER_RECOVERY_REQUIRED` | `NONE_REQUIRED` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-13 | Material authorization denials remain attributable | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |
| ID-AUD-14 | High-signal bearer abuse or revocation decisions remain visible | `OCCURRENCE_TO_ACK_RESIDUAL` | `DIRECT_BOUNDED_ACK` | `CAPTURED_EVENT_SAME_EVENT_ID_ONLY` | `NO_SAFE_RECONSTRUCTION` | Shared Identity Domain Owner + Architecture/Security Review | ADR-0021 / DEC-070 / RPL-109 |

### 12.3 Actor, resource, and sensitive-data constraints

| ID | Actor | Resource | Allowed bounded payload | Sensitive-data constraint |
|---|---|---|---|---|
| ID-AUD-01 | `AUTHENTICATED_USER`; opaque account ID; relevant roles optional | `platform_account` with opaque account ID | Authentication method enum | No login ID, email, password/hash, access token, refresh token, JWT, or credential fingerprint |
| ID-AUD-02 | `ANONYMOUS`; no ID or roles | Absent | One non-enumerating reason such as `CREDENTIALS_REJECTED` | Same payload and reason whether the submitted account exists; no submitted/derived identifier |
| ID-AUD-03 | `ANONYMOUS`; no ID or roles | Absent | Coarse token-lifecycle reason | No token, JWT, token fingerprint, or account ID derived from the rejected token |
| ID-AUD-04 | `AUTHENTICATED_USER`; verified opaque account ID | `platform_account` with the same safe ID | Revocation scope enum only | No access token, JWT, Authorization header, blacklist key, or token-derived identifier |
| ID-AUD-05 | `AUTHENTICATED_USER`; verified opaque account ID | `platform_account` with the same safe ID | Session scope enum only | No refresh token, session secret, JWT, or token-derived identifier |
| ID-AUD-06 | `AUTHENTICATED_USER`; linked opaque account ID | `platform_account` with opaque account ID | Provider code and authentication method enum | No provider subject, email, provider token, authorization code, state, callback, or raw provider body |
| ID-AUD-07 | `ANONYMOUS`; no ID or roles | Absent | Provider code and coarse non-enumerating reason | No linked/derived account ID, provider subject, email, state, code, callback, or provider error body |
| ID-AUD-08 | `ANONYMOUS`; no platform actor ID | Absent | Provider code and `linkage_status: UNLINKED` | No provider subject, email, display name, onboarding payload, state, code, or derived account ID |
| ID-AUD-09 | Actual initiator; self-registration uses `ANONYMOUS` without ID | `platform_account` with newly committed opaque ID | Registration channel enum if approved | No login ID, email, raw password, password hash, or credential material |
| ID-AUD-10 | Actual authenticated/system executor; ADMIN is a role | Target `platform_account` with opaque ID | Change channel/reason enum if approved | No password, hash, credential fingerprint, reset token, or session/token value |
| ID-AUD-11 | `AUTHENTICATED_USER`; opaque account ID established only after validation | `platform_account` with opaque ID | Authentication method enum | No old/new refresh token, access token, JWT, token hash, or credential fingerprint |
| ID-AUD-12 | `ANONYMOUS`; no ID | Absent | Provider code, trusted Product, and client channel enum | No OAuth state, authorization URL/query, PKCE, nonce, return target, code, email, or provider subject |
| ID-AUD-13 | Trusted `AUTHENTICATED_USER` or `SYSTEM`; roles when relevant | Safe denied target when known; otherwise absent | Registered policy/reason code | No raw request/response, secret, token, or unnecessary Product data |
| ID-AUD-14 | `ANONYMOUS` by default; no identity inferred from rejected bearer | Absent | Coarse `REVOKED`, `REPLAY`, or `POLICY` reason | No bearer, JWT, Authorization header, token fingerprint/JTI, or derived account ID |

Product and tenant follow §5 in every row and are omitted when not reliably established.

### 12.4 Observability-only baseline

These signals have no canonical Audit `event_type`, durability class, retention class, replay, or
reconciliation policy. They remain logs/metrics/traces owned by the runtime observability boundary.
For every row, Audit actor/resource/action/outcome, `acceptable_loss_window`, retry/replay/
reconciliation metadata, `classification_owner`, and `approval_reference` are not applicable because
no Audit wire event is produced. The producing runtime owns the observability signal; RPL-109 under
ADR-0021 / DEC-070 approves the `OBSERVABILITY_ONLY` disposition.

| Candidate | Disposition | Occurrence boundary | Sensitive-data rule |
|---|---|---|---|
| Generic bearer validation failure | `OBSERVABILITY_ONLY` | Routine malformed, expired, missing, or unverifiable bearer handling | Never log token, Authorization header, parsed claims, or derived identity |
| JWT parse step | `OBSERVABILITY_ONLY` | Internal parse/validation step | Never log raw JWT or credential content |
| Successful OAuth state consume | `OBSERVABILITY_ONLY` | One-time state store consume succeeds | Never log state, PKCE, nonce, callback query, or stored record |
| Redis connection timeout | `OBSERVABILITY_ONLY` | Redis client operation times out | No key/value, token, state, or credential content |
| Provider HTTP latency/retry | `OBSERVABILITY_ONLY` | Provider adapter call/retry | No provider token, subject, raw body, query, or secret |
| Token generation internals | `OBSERVABILITY_ONLY` | JWT/token provider internal work | No token, key, claims dump, or secret |
| Generic protected-request 401 with no Authorization | `OBSERVABILITY_ONLY` | Security entry point rejects an unauthenticated request | No fabricated actor/resource and no full request dump |
| Startup/readiness | `OBSERVABILITY_ONLY` | Runtime lifecycle/health check | No environment, secret, credential, or full configuration dump |
| Runtime configuration validation failure | `OBSERVABILITY_ONLY` | Startup/runtime configuration check | No secret value or raw configuration dump |

A future accountable fact describing who changed production configuration is a separate candidate and
requires its own catalog classification; it is not this configuration-validation telemetry.

## 13. Logout re-derivation

At the evidence pin, `AuthServiceImpl.logout` performs:

```text
1. RedisTokenBlacklistAdapter.addToBlacklist(access token, remaining TTL)
2. TokenSessionJpaAdapter.deleteForAccount(account ID) in PostgreSQL
```

Redis must succeed before session deletion is attempted. Redis and PostgreSQL do not share a local
transaction. The chosen model is **decomposed forensic facts without a higher-level completion
event**:

1. `identity.authentication.access_token_revoked` occurs after the Redis write succeeds.
2. `identity.authentication.refresh_sessions_revoked` occurs only with successful PostgreSQL commit
   and, after AU-G8 exists, is captured by producer-owned `identity.audit_outbox` in that transaction.

If Redis fails, neither fact is true and session deletion is not attempted. If Redis succeeds and
PostgreSQL deletion or commit fails, only `access_token_revoked` is true. The request may fail, but
the completed Redis fact must not be hidden or relabeled as a complete logout. If both mutations
succeed, both facts exist and correlation metadata links them.

A single composite event is rejected because its completion point, durability, and partial-failure
meaning are ambiguous. Adding a third `logout_completed` event is rejected because it duplicates the
two facts and introduces another publication gap without adding authoritative state.

The Redis fact has a documented side-effect-to-ack residual loss window. It uses bounded acknowledged
publication plus metric/alert on failure and has no safe reconstruction source because Audit may not
retain the token or blacklist key. The PostgreSQL fact has no accepted post-commit loss window and
uses the future producer-owned durable source. AU-G8 owns those mechanisms; this contract only fixes
their required behavior.

## 14. Sensitive-data and anonymous privacy baseline

The following are prohibited by default in every actor, resource, context, payload, error,
quarantine projection, or free-form field:

```text
raw password or password hash
access token, refresh token, raw JWT, Authorization header
OAuth state, authorization code, PKCE verifier or challenge, nonce
provider access token or refresh token, Client Secret
provider raw HTTP body, raw provider error body, full callback/query
raw providerSubject
stacktrace or full request/response dump
loginId or email
credential fingerprint
```

Authenticated facts may use opaque internal account/resource identifiers when legitimate. Anonymous
authentication failures must use `actor_type: ANONYMOUS`, omit `actor_id` and unsafe resources, and
must not allow a reader to determine whether the submitted account exists. No hash or pseudonymous
correlation derived from submitted identity is introduced by default. Any exception requires an
explicit privacy/security policy approval and contract revision.

## 15. Implementation gates

AU-G2's producer semantic publisher boundary is implemented as recorded in §1.1. It remains
provider-neutral, performs no network or persistence work, and does not satisfy the later
transport, store, consumer, durability, query, or producer-integration gates.

In particular, `ID-AUD-05`, `ID-AUD-09`, and `ID-AUD-10` remain unable to claim `Accepted`
without the AU-G8 durability-capable capture. This contract preserves the ADR-0021 gate order;
the following work remains deferred:

- AU-G3: JetStream subject, transport, retry/configuration values, and operations
- AU-G4: append store, fingerprint/dedup SQL, retention durations, and deletion policy
- AU-G5: consumer
- AU-G8: outbox/durable publication, replay, reconciliation, monitoring, and alerting mechanisms
- AU-G6: query/API and reader authorization contract
- AU-G7: Identity instrumentation
- AU-G9: external producer and authentication contract

## 16. Contract validation obligations

Future fixtures must prove required/conditional field validation, anonymous omission rules, prohibited
data rejection, current and unsupported schema versions, compatible optional additions, stable retry
identity, idempotent duplicate behavior, conflicting-content integrity violation, and policy registry
coverage for every accepted event type/version.
