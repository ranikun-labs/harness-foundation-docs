---
title: "AWS V1 MVP Deployment Plan"
status: draft
implementation_status: not_started
owner: architecture
created_at: "2026-10-12"
last_reviewed: "2026-10-12"
source_inputs:
  - docs/adr/ADR-0022-aws-v1-mvp-primary-runtime.md
  - docs/adr/ADR-0015-platform-communication-messaging-scaling.md
  - docs/adr/ADR-0016-primary-deployment-and-disaster-recovery.md
  - docs/adr/ADR-0017-shared-platform-gateway-identity-physicalization.md
  - docs/adr/ADR-0018-shared-ai-platform-core-placement.md
  - docs/adr/ADR-0020-shared-platform-postgresql-schema-ownership.md
  - docs/adr/ADR-0021-shared-audit-foundation-architecture.md
---

# AWS V1 MVP Deployment Plan

> This is a planning document, not infrastructure evidence. It does not create AWS
> Resources, approve Production cutover, or assert that any service is deployed.

## 1. Status and Constraints

- Target Region: ap-northeast-2 (Seoul).
- Production Primary: EC2 + Docker Compose.
- PostgreSQL: private RDS PostgreSQL.
- State Store: official Valkey Docker Image inside the EC2 Host.
- Mac mini remains Development / Test only.
- Cloudflare Tunnel is a first validation candidate, not a selected Ingress.
- Internal synchronous calls remain HTTP/JSON. AI streaming uses SSE.
- Existing JWT / Refresh Token / OAuth contracts remain unchanged.
- Monthly 10,000 KRW is a goal, not a hard cap. Release speed and operational stability
  have higher priority.
- No AWS Resource has been created or changed in this task.

## 2. Deployment Topology

<pre>
Internet Clients
    │
    └── Cloudflare Tunnel (validation gate; not selected)
              │ outbound tunnel connection
              ▼
EC2, Seoul, one Compose Host
    ├── Platform Gateway: Spring Cloud Gateway / WebFlux
    ├── Platform Core: Spring MVC; Identity + Shared AI + Shared Audit Modules
    ├── Finance Backend: independent Spring Service
    ├── Carelog Backend: independent Spring Service
    └── Valkey: official Docker Image; internal Docker Network only
              │
              └── PostgreSQL 5432 over private VPC path
                         ▼
              RDS PostgreSQL, Private Subnet
              └── one Application Database; service-owned Schemas
</pre>

Production Compose must not start a PostgreSQL Container. RDS is the external database
endpoint. The Gateway is the sole application ingress. Platform Core, Finance, Carelog
and Valkey do not publish Host ports. If Cloudflare Tunnel passes its validation gate,
its origin must reach the Gateway through a loopback-only Host binding or an equivalent
private path.

The actual Repository also contains a Carelog Gateway Process. The fixed Owner target names
one shared Gateway; do not add the Carelog Gateway to Production without a separate Cutover
check. If it remains active, add its JVM and capacity to the estimate.

## 3. EC2 / RDS Capacity Candidates

### 3.1 Actual JVM Count and Memory Evidence

The fixed Runtime contains four JVMs:

| Process | Existing Build Evidence | JVM |
|---|---|---|
| Platform Gateway | platform-services has a separate Gateway Dockerfile; JVM target 17 | 1 |
| Platform Core | platform-services has a separate Core Dockerfile; Java 21 | 1 |
| Finance Backend | finance-harness-be uses Java 21 / Spring Boot 4.1.0 | 1 |
| Carelog Backend | carelog-be uses Java 17 / Spring Boot 3.4.5 | 1 |

Shared Identity, Shared AI and Shared Audit are Platform Core Modules and add no JVM.
Carelog Gateway is outside the fixed Runtime count unless a later Cutover requires it.

Current Dockerfiles / Compose do not set a measured per-process heap, cgroup Memory limit,
or CPU limit. Production RSS, heap, CPU, request concurrency, PostgreSQL connection count
and load profile are UNKNOWN. There is no measured memory value to treat as a fact.

### 3.2 Recommended Sizing Candidates

| Resource | Candidate | Published Capacity | Role / Limit |
|---|---|---|---|
| EC2 | m7g.xlarge | 4 vCPU, 16 GiB RAM | Initial four-JVM + Valkey load-test candidate; not a measured capacity commitment |
| EC2 lower-cost comparison | m7g.large | 2 vCPU, 8 GiB RAM | Compare only after per-process RSS / heap and CPU limits are measured |
| RDS PostgreSQL economy candidate | db.t4g.medium, Single-AZ | 2 vCPU, 4 GiB RAM | Initial integration / low-load candidate; burst CPU and low memory require measurement |
| RDS PostgreSQL stable alternative | db.m7g.large | candidate size must be confirmed in current Region / Engine calculator | Compare if T-class sustained CPU or Memory becomes limiting |
| RDS storage | gp3, 20–50 GiB candidate | RDS PostgreSQL gp3 minimum is 20 GiB | Actual DB size / WAL / growth are UNKNOWN; set after inventory |

All sizes remain ESTIMATE. m7g.xlarge is chosen as the first capacity test because the target
has four separate Spring JVMs and no committed memory limits. This is not a claim that
16 GiB is sufficient or that 4 vCPU meets a latency SLO. The four services must be built and
measured on the selected CPU architecture. The EC2 target is ARM64; build and smoke-test
all four Images on ARM64 before choosing Graviton.

RDS db.t4g.medium is a cost comparison candidate, not a fixed Production class. AWS documents
that T4g classes are burstable and may incur CPU Credit charges in Unlimited mode. If sustained
database CPU is likely, compare a non-burstable class using measured workload and official
pricing. No PostgreSQL Engine Major Version is selected: current repository evidence spans
PostgreSQL 16 and 18.4 Testcontainers.

Official instance references:
[EC2 general-purpose specifications](https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html),
[EC2 instance availability by Region](https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-instance-regions.html),
[RDS T4g specifications](https://aws.amazon.com/rds/instance-types/),
and [RDS PostgreSQL storage settings](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html).

## 4. AWS Monthly Cost Estimate

### 4.1 Assumptions

- Commercial AWS, Seoul, On-Demand Linux, 730 hours per month, no Savings Plan / RI.
- EC2 m7g.xlarge continuously running; 50 GiB gp3 root volume as a planning allowance.
- RDS db.t4g.medium, PostgreSQL, Single-AZ, continuously running, 20 GiB gp3.
- One EC2 public IPv4 for outbound Tunnel / image pull / SSM reachability. Inbound
  Security Group rules remain closed.
- No ALB and no NAT Gateway in the baseline. RDS remains private.
- Currency conversion 1 USD ≈ 1,400 KRW is an ESTIMATE, not an FX quote.
- No taxes, Cloudflare plan, AWS Support, public egress beyond the allowance, extra backup
  retention, multi-AZ standby, NAT Gateway, ALB, high CloudWatch ingestion or T4g CPU Credit
  overage is included.

### 4.2 Preliminary Estimate

| Item | Working Estimate | Status |
|---|---:|---|
| EC2 m7g.xlarge, 730 hours | about US$147 / month | ESTIMATE; candidate regional On-Demand rate must be recalculated |
| RDS PostgreSQL db.t4g.medium, Single-AZ, 730 hours | about US$74 / month | ESTIMATE; Engine / Region / deployment selection must be recalculated |
| EC2 gp3 50 GiB + RDS gp3 20 GiB | about US$7–12 / month | ESTIMATE; regional unit rate and actual volume UNKNOWN |
| One public IPv4 | about US$4 / month | ESTIMATE; confirm current rate |
| Basic logs / metrics allowance | US$0–20 / month | ESTIMATE; retention and volume UNKNOWN |
| Preliminary total | about US$233–257 / month, roughly ₩326,000–₩360,000 | ESTIMATE; not an AWS quote |

This base estimate is more than the 10,000 KRW monthly goal. The goal is not an absolute
budget cap and does not override the fixed priority of shipping quickly with operational
stability. This cost scenario intentionally uses Single-AZ RDS and excludes a NAT Gateway
and ALB; it is not a final Availability decision. A Multi-AZ RDS option adds at least another
database compute allocation and storage-related charges. Re-price before provisioning.

An official calculator quote was not available from the dynamic calculator during this
documentation run. The numerical rates above are planning estimates only. Recalculate and
save an AWS Pricing Calculator estimate for ap-northeast-2 immediately before any provisioning.

Official pricing references:
[EC2 On-Demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/),
[Amazon RDS for PostgreSQL pricing and calculator](https://aws.amazon.com/rds/postgresql/pricing/),
[Amazon EBS pricing](https://aws.amazon.com/ebs/pricing/),
[AWS Pricing Calculator](https://calculator.aws/),
[EC2 Seoul price-list index](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/ap-northeast-2/index.json),
[RDS Seoul price-list index](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonRDS/current/ap-northeast-2/index.json).

AWS's published price pages state that the calculator estimate varies with Region, instance,
deployment option and storage. T4g CPU-credit overage, automated backup overage, data transfer,
CloudWatch and public IPv4 can add cost. Keep those as UNKNOWN until the calculator estimate
and traffic assumptions are saved.

## 5. VPC / Subnet / Security Group

### Candidate Layout

- One VPC in ap-northeast-2.
- One EC2 Application subnet with outbound Internet routing for Tunnel, container registry,
  CloudWatch and Systems Manager. It may have a public IPv4 for outbound access, but no public
  inbound rule is required for an outbound Tunnel. A no-public-IP / VPC Endpoint alternative
  requires a separate cost and reachability check.
- At least two private subnets across Availability Zones for the RDS DB Subnet Group. RDS
  Public Access is false.
- NAT Gateway is not in the baseline cost because its fixed hourly and data charges may exceed
  this MVP's cost goal. If private-only EC2 egress is required, compare VPC Endpoints and NAT
  Gateway before selecting.
- EC2 inbound: no SSH rule; use Systems Manager or a separately approved administrative path.
  If Cloudflare Tunnel is used, its connection is outbound.
- RDS inbound: TCP 5432 from the EC2 Application Security Group only. Never allow 0.0.0.0/0.
- Valkey: no AWS Security Group port and no Docker Host Port mapping. Only the Docker
  Application Network can reach it.
- Application egress: document required HTTPS destinations and DNS path for Cloudflare,
  Registry, Secrets, Systems Manager and monitoring. Exact egress enforcement is UNKNOWN.
- Add separate IAM instance permissions for deploy, logs and secret retrieval. No static AWS
  credentials in the Image, Compose file or environment template.

## 6. RDS Private Access / Schema / Role / Migration

Target: one RDS PostgreSQL physical instance, one Application Database, and the service Schemas
owned as defined by ADR-0020. The plan does not create or migrate data.

| Schema | Owner | Current Repository Evidence / Blocker |
|---|---|---|
| identity | Platform Identity | V1 migration uses unqualified table names and does not establish identity Schema access |
| carelog | Carelog | Current baseline reflects public Schema; public-to-carelog migration needs its separate approved rehearsal |
| finance | Finance | Tests create finance_db; Flyway currently relies on the connection's default Schema |
| audit | Shared Audit | Target ownership is approved by ADR-0020 / ADR-0021; Schema and durable Store are not present |

Before production data is used, each Repository must:
1. Connect with its own Application Role and Migration Role or an explicitly reviewed equivalent.
2. Create / own only its Schema; migrations may not execute with a shared superuser.
3. Set the correct Flyway schema and Hibernate default schema or equivalent explicit binding.
4. Prove the role cannot read or write another service Schema.
5. Run migrations against the selected common PostgreSQL major and a clean database.
6. Test upgrade, failed migration recovery and rollback / forward-fix procedure.
7. Preserve no cross-service foreign keys, direct access or OLTP joins.

The common RDS PostgreSQL Major is a release blocker until Platform, Finance and Carelog migration
tests agree. The current PostgreSQL 16 / 18.4 drift must not be resolved by assumption.

## 7. Docker Compose Service Placement

Production Compose service set:

- platform-gateway: public application entry; host bind is loopback/private to the selected ingress.
- platform-core: one Spring MVC process hosting Identity, Shared AI and Shared Audit Modules.
- finance-service: private internal HTTP/JSON service.
- carelog-service: private internal HTTP/JSON service.
- valkey: official Valkey Image on the internal Docker Network only.
- cloudflared: optional only if the Cloudflare Tunnel gate passes; no selection is implied.

Do not add a PostgreSQL container to Production Compose. Do not publish Valkey 6379. Do not
publish Platform Core or Product Backend ports. Keep the existing Redis client / Spring
configuration contract until an explicit Contract Decision says otherwise.

The current platform-services Compose is a local Development topology: it uses PostgreSQL
16-alpine and redis:7-alpine and publishes Gateway / Core ports. Do not reuse it unchanged as
Production Compose. Its Valkey-compatible local configuration and Production override remain
implementation work.

## 8. Valkey Persistence / Security

- Use the official Valkey Docker Image. Valkey Version / Tag is UNKNOWN and must remain an
  explicit Owner input.
- Preserve current Spring Data Redis / Lettuce clients, Redis package names and property names.
- The existing platform config names include PLATFORM_GATEWAY_REDIS_* and
  PLATFORM_IDENTITY_REDIS_*; do not rename them merely because the server changes.
- Valkey Port 6379 must not be published to the EC2 Host or VPC.
- Use an authenticated Valkey endpoint or ACL and keep its credential in the chosen secret
  system. Exact ACL / password design is not selected.
- AOF, RDB, write frequency, fsync, named Volume, snapshot / backup interval and retention are
  UNKNOWN. Do not choose a production persistence profile in this plan.
- Validate GETDEL, TTL, EVAL and EVALSHA against the selected official Image through Lettuce
  / Spring Data Redis and SCG RateLimiter integration.
- Test expiry, one-time OAuth State consumption, restart, data loss, restore, JWT Blacklist
  behavior and RateLimiter failure behavior. JWT Blacklist loss must not silently turn a
  revoked still-valid token into an accepted request.
- Valkey is state, not a Business Data Source of Truth.

## 9. Environment / Secret Management

- No production .env or credential is committed to Git.
- Existing application variable contracts remain the source for binding. Never rename JWT,
  Refresh Token, OAuth, DB or Redis client properties as part of this architecture change.
- Secret Store is an Owner Decision. Compare AWS Systems Manager Parameter Store SecureString
  and AWS Secrets Manager using secret count, rotation, access audit, API cost and operator effort.
- Use an EC2 instance role with least-privilege read access rather than a long-lived AWS key.
- If Compose receives secrets as files, verify the application can read them without placing
  values in image layers, source control, shell history or ordinary logs.
- Separate runtime / health configuration from secrets. Keep local sample values clearly
  non-production.
- CI publishing credential and production runtime credential are separate identities.

## 10. Database Migration / Application Configuration

Platform, Finance and Carelog each own Flyway migrations for their Schema. RDS is one physical
service boundary, not a shared write permission.

Current evidence:
- Platform Compose uses PostgreSQL 16-alpine. Identity V1 creates unqualified tables.
- Finance README / integration test uses PostgreSQL 18.4-alpine3.24 and a separate finance_db.
- Carelog Compose uses PostgreSQL 16 and current V1 baseline reproduces tables in public.
- ADR-0020's target is identity, carelog, finance and future shared Schemas inside one
  Application Database.
- Shared Audit's audit Schema has not been created in the inspected implementation.

Required gate: common PostgreSQL major test matrix, explicit per-service default Schema / Flyway
configuration, least-privilege Grants, clean migration tests, and a separately rehearsed Carelog
public-to-carelog move. Do not change another Service's migration or data in its Repository task.

## 11. CI/CD / Image Version / Rollback

No GitHub Actions workflow was found in the inspected branches of platform-services,
finance-harness-be or carelog-be.

Required pipeline:
1. Build / unit and integration test for the exact commit.
2. Build a Linux ARM64 image for the EC2 Graviton candidate. Add AMD64 only if required by an
   approved fallback.
3. Push to the selected Registry after an explicit Registry decision. GHCR is only the first
   validation candidate in ADR-0016; ECR remains an alternative.
4. Record image digest, Git commit SHA, build metadata and dependency provenance.
5. Deploy one version at a time with database-forward migration compatibility checked.
6. Retain at least the previous known-good digest. Rollback updates the Compose image digest
   and rechecks Health / Auth / product smoke.
7. Do not rely on mutable latest tags.

Registry, package retention, OIDC / credentials, ARM64 runner availability and rollback operator
are UNKNOWN. A successful build job is not a deployed runtime.

## 12. Health / Monitoring

- Platform Gateway and Platform Core currently expose Actuator readiness endpoints in their
  local Compose configuration.
- Finance has Actuator health, liveness and readiness configuration.
- Carelog's inspected backend build does not include Actuator and its repository has no
  Application Container Health Check. Add this as deployment readiness work.
- Compose must use process readiness and dependency readiness; a running Container alone is
  not healthy.
- Track EC2 CPU, memory, disk, restart count and Docker health; RDS CPU, FreeStorageSpace,
  connections, latency, deadlocks and migration errors; Valkey memory, latency, evictions,
  rejected connections and persistence errors; Gateway 4xx / 5xx and API latency; Tunnel
  connectivity if selected.
- Memory metrics require a Host agent or another measured collection path. Its cost and
  retention are UNKNOWN.
- Logs must exclude tokens, OAuth codes, secrets and sensitive Finance / Carelog request data.
- Define an alert owner and tested notification path before Go-Live.

## 13. Backup / Restore / RPO / RTO

| Item | Current Plan State |
|---|---|
| RDS automated backup / PITR | Required candidate; retention and cost need Owner decision |
| RDS snapshot / long-term retention | UNKNOWN |
| RDS Multi-AZ | UNKNOWN; not selected |
| V1 RPO | UNKNOWN; do not copy ADR-0016's prior 15-minute value into this Primary |
| V1 RTO | UNKNOWN; do not copy ADR-0016's prior 4-hour value into this Primary |
| Valkey AOF / RDB / Volume / Backup | UNKNOWN; Owner decision and restore drill required |
| EC2 / Compose recovery target | UNKNOWN until image + config + restore drill |
| Backup encryption key / access | UNKNOWN |

Drill evidence must record restore point, data boundary, elapsed time, validation result, service
versions and operator actions. Restore to an isolated environment first, verify each Schema and
Flyway state, then run read-only smoke tests. Measure RPO / RTO against Owner-approved targets
only after those targets exist. Do not state that a backup succeeded without a restore test.

RDS automated backup retention can be configured over AWS-supported ranges; AWS documentation
explains that the chosen period is an operational setting, not a default to adopt without Owner
approval. Review the [RDS backup retention documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).

## 14. Cloudflare Tunnel Validation Gate

Cloudflare Tunnel is a candidate only. Before selecting it, verify:

1. Account, Zone, Domain ownership, plan and supported connector behavior.
2. EC2 connector can establish outbound connections without a public inbound Application Port.
3. Origin routes only to the Gateway; Platform Core, Finance, Carelog, RDS and Valkey stay private.
4. OAuth callback / redirect URI, forwarded client address and trusted proxy hop behavior.
5. SSE event streaming, idle / read timeout, buffering, reconnect and long-running AI responses.
6. Health / readiness behavior when the connector or origin restarts.
7. Secret rotation, connector restart and audit of Tunnel configuration.
8. Monthly Cloudflare and AWS egress cost estimate.

Failing any gate leaves Ingress unselected and requires a separate Architecture Decision before
using another ingress.

## 15. Auth / Product / AI / Audit E2E Release Gate

### Shared Gateway / Identity

- Existing JWT Access / Refresh contract and claims remain byte-for-byte compatible at the API boundary.
- Password and OAuth login, callback, state TTL, atomic GETDEL one-time consumption, token
  rotation, blacklist, logout and expiry pass end to end.
- SCG RateLimiter EVAL / EVALSHA behavior, trusted proxy input and fail-closed outage behavior
  pass against selected Valkey.
- Internal Gateway routing does not bypass authentication or authorization boundaries.

### Finance / Carelog

- Finance request identity comes from the existing verified Auth boundary, never the client body.
- Finance journal creation / validation, unauthorized no-write behavior and service Schema
  isolation pass against RDS.
- Carelog authentication, role / tenant access, existing OAuth / JWT contract, encrypted
  sensitive data and product journeys pass through the selected Gateway.
- Both services prove no direct access to another service Schema.

### Shared AI / Shared Audit

- Shared AI is currently a same-JVM library with a synchronous OpenAI Slice. The requested
  Production SSE path is not evidenced; it must stream through the Gateway before the AI gate passes.
- Model, provider credential source, timeout and streaming failure behavior remain explicit.
- Shared Audit's inspected default capture is Unavailable. Its release contract and required V1
  events must be evidenced before calling Audit production-ready.
- ADR-0021's NATS architecture approval remains. No Broker is deployed by this plan.
- If a real V1 asynchronous use case is identified, define its durability / retry / replay need
  as a separate Gate. Do not deploy a Broker solely because the Architecture was approved.

## 16. MVP Go-Live Checklist

- [ ] ADR-0022 is reviewed and merged; this plan's source HEADs and status are refreshed.
- [ ] AWS account / IAM / Region / VPC / subnets / Security Groups are approved.
- [ ] RDS engine major is compatible with Platform, Finance and Carelog migrations.
- [ ] RDS Multi-AZ, Backup Retention, V1 RPO and RTO have Owner decisions.
- [ ] Per-service Schema, Flyway ownership, Grants and cross-schema denial are proven.
- [ ] EC2 size is checked against measured JVM RSS / heap / CPU and load; ARM64 is proven.
- [ ] Finance / Carelog production Dockerfiles, Health checks and CI pipelines pass.
- [ ] Valkey version, access control, persistence policy and restore test pass.
- [ ] GETDEL / TTL / EVAL / EVALSHA compatibility and Auth failure behavior pass.
- [ ] Secret Store / rotation / operator recovery path is approved and exercised.
- [ ] Image Registry, digest deployment, rollback and database migration sequence are proven.
- [ ] Cloudflare Tunnel passes all gates or another ingress has a separate decision.
- [ ] Monitoring, alert ownership, RDS restore and EC2 rebuild drills are complete.
- [ ] Shared AI SSE and Shared Audit release gates pass.
- [ ] Auth, Finance, Carelog, AI and Audit E2E evidence is linked.
- [ ] Cost is recalculated through AWS Pricing Calculator with chosen HA, Storage, Backup,
      Logs, Network and Tax assumptions.
- [ ] Owner approves Production Go-Live explicitly.

## 17. Repository Inspection and Deployment Blockers

Snapshot at the branches and HEADs in ADR-0022:

| Repository | Verified Evidence | Blocker |
|---|---|---|
| harness-foundation-docs | ADR-0016 accepted_with_constraints: Mac mini Primary / AWS DR; ADR-0020: one Application DB with service Schemas; ADR-0021: NATS approved, broker not implied | New ADR must merge; old ADR-0016 history must remain |
| platform-services | Compose runs Gateway, Platform Core, local postgres:16-alpine, redis:7-alpine; Gateway / Core Dockerfiles exist; current Compose publishes 8080 / 8081; shared-audit is included in platform-core/settings.gradle.kts and app/build.gradle.kts | First blocker: platform-core/app/Dockerfile omits shared-audit/build.gradle.kts and shared-audit/src even though the included project is an app dependency; Docker image build is expected to fail at Gradle configuration, but was not executed in this documentation task. Production image / network configuration absent; no CI workflow; local Compose is not production |
| finance-harness-be | Java 21, Spring Boot 4.1.0, Flyway; Postgres 18.4 Testcontainers; configuration is environment-backed | No Dockerfile / Compose / GitHub Actions workflow; test uses finance_db and does not prove the ADR-0020 finance Schema / Role |
| carelog-be | Java 17, Spring Boot 3.4.5, Flyway; PostgreSQL 16 + redis:7 development Compose; V1 baseline is public Schema | No application Dockerfile / CI workflow; Compose has a committed local password and publishes DB / Redis host ports; no Actuator dependency or Application health check; public-to-carelog migration needs rehearsal |
| Shared AI | Same-JVM library; synchronous OpenAI Slice is implemented; no production provider / SSE release evidence | Current README defers streaming; Owner-required AI SSE E2E gate is open |
| Shared Audit | Java library module exists and Platform Core app depends on it; default capture implementation is Unavailable | No durable capture / store / production release evidence |

No AWS Resource or Production Runtime was inspected or changed. GitHub branch visibility does not
prove a cloud account or permission. Any resource state not directly evidenced is UNKNOWN.

## 18. GitHub Issues Implementation Map
Open-issue searches on 2026-10-12 found no existing open tasks in the four repositories.
The following 14 issues were created for the implementation plan. These issues are task
tracking, not approvals to change AWS resources or promote Production.

| Workstream | Repository issue |
|---|---|
| First blocker: Platform Core Docker build inputs for Shared Audit | [platform-services#20](https://github.com/ranikun-labs/platform-services/issues/20) |
| Official Valkey local server and command / flow compatibility | [platform-services#21](https://github.com/ranikun-labs/platform-services/issues/21) |
| EC2 production Docker Compose foundation | [platform-services#22](https://github.com/ranikun-labs/platform-services/issues/22) |
| Shared Identity RDS schema / role / migration | [platform-services#23](https://github.com/ranikun-labs/platform-services/issues/23) |
| Gateway / Identity Auth E2E | [platform-services#24](https://github.com/ranikun-labs/platform-services/issues/24) |
| Immutable image CI/CD and rollback | [platform-services#25](https://github.com/ranikun-labs/platform-services/issues/25) |
| Shared AI SSE / Shared Audit release gate | [platform-services#26](https://github.com/ranikun-labs/platform-services/issues/26) |
| Finance image, finance schema, secret configuration, health and CI | [finance-harness-be#5](https://github.com/ranikun-labs/finance-harness-be/issues/5) |
| Finance Auth / product E2E | [finance-harness-be#6](https://github.com/ranikun-labs/finance-harness-be/issues/6) |
| Carelog image, schema migration, secret configuration, health and CI | [carelog-be#47](https://github.com/ranikun-labs/carelog-be/issues/47) |
| Carelog Auth / product E2E | [carelog-be#48](https://github.com/ranikun-labs/carelog-be/issues/48) |
| AWS network, secret store, and Cloudflare Tunnel validation gate | [harness-foundation-docs#30](https://github.com/ranikun-labs/harness-foundation-docs/issues/30) |
| Backup / restore / monitoring and recovery objective evidence | [harness-foundation-docs#29](https://github.com/ranikun-labs/harness-foundation-docs/issues/29) |
| Final Go-Live evidence gate | [harness-foundation-docs#31](https://github.com/ranikun-labs/harness-foundation-docs/issues/31) |

## 19. Remaining Owner Decisions

1. Valkey exact Version / Tag.
2. Valkey AOF / RDB, Volume, Backup, Restore and credential / ACL policy.
3. Common RDS PostgreSQL Engine Major, RDS class, storage and actual deployment option.
4. RDS Multi-AZ decision.
5. V1 AWS Primary RPO, RTO, RDS Backup Retention and long-term snapshot policy.
6. AWS Account / IAM / VPC egress and Infrastructure Repository owner.
7. GHCR or ECR, Image retention and deploy authority.
8. AWS Secrets Manager or SSM Parameter Store / secret rotation.
9. Cloudflare Tunnel account / plan / Domain and test outcome.
10. Production memory / CPU / DB connection budget based on measured load.
11. Shared Audit V1 use cases and whether any asynchronous requirement exists.
12. Explicit Go-Live approver and evidence storage location.

