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

## 2. Four-runtime deployment topology

The baseline is four independent EC2 runtimes. The initial t4g sizes below are candidates,
not capacity commitments. Services use private VPC addresses for internal HTTP/JSON and SSE.

~~~text
Cloudflare Tunnel (validation candidate; outbound only)
                │
       EC2 #1 Gateway / WebFlux
          ├─────┼──────────┐
          ▼     ▼          ▼
 EC2 #2 Core  EC2 #3     EC2 #4
  / MVC       Finance    Carelog
  └ Valkey     │           │
       └────────┴───────────┴── Private TLS ── RDS PostgreSQL (one instance)
~~~

| Host | Process | Initial size | Inbound boundary |
|---|---|---|---|
| EC2 #1 | Gateway / WebFlux | t4g.small | No direct Internet ingress; Tunnel only after approval |
| EC2 #2 | Platform Core / MVC: Identity, Shared AI, Shared Audit; Valkey candidate | t4g.medium | HTTP only from Gateway; PostgreSQL from Core |
| EC2 #3 | Finance Backend | t4g.small | HTTP only from Gateway; PostgreSQL from Finance |
| EC2 #4 | Carelog Backend | t4g.small | HTTP only from Gateway; PostgreSQL from Carelog |

Mac mini is Development/Test only. No PostgreSQL container is used in Production. Valkey
co-location on Core is the cost-first candidate; a dedicated Valkey EC2 remains an alternative.
For co-location, run Valkey on the Core Compose bridge network and publish host TCP/6379 only
through a Compose port mapping bound only to `${VALKEY_PRIVATE_ENI_IP}` on a private-only ENI:
```yaml
ports:
  - target: 6379
    published: "6379"
    protocol: tcp
    host_ip: ${VALKEY_PRIVATE_ENI_IP}
```
Core-local clients use the Docker bridge. Gateway and Carelog reach the endpoint over VPC private networking.
The attached Security Group allows TCP/6379 only from the Gateway and Carelog Security Groups;
it has no public CIDR rule. Do not bind/publish the port on a Public interface or `0.0.0.0`.
The ENI choice, ACL/credential, contention, failure scope and blacklist recovery risk remain
Owner gates before deployment.

## 3. Four-EC2 / RDS capacity candidates

### 3.1 Runtime and memory evidence

The fixed baseline has four JVMs: Gateway (Java 17), Platform Core (Java 21), Finance (Java 21)
and Carelog (Java 17), based on the inspected repositories. Runtime RSS, heap/native memory,
CPU demand, image architecture support and request concurrency are UNKNOWN. The Owner-selected
Graviton candidates are:

| Service | EC2 candidate | EBS candidate |
|---|---:|---:|
| Gateway | t4g.small | 24 GiB |
| Platform Core + co-located Valkey | t4g.medium | 30 GiB |
| Finance | t4g.small | 24 GiB |
| Carelog | t4g.small | 24 GiB |
| Dedicated Valkey alternative | t4g.small | 24 GiB, additional |

All four images require ARM64 build and smoke evidence. Measure JVM Heap and Native Memory, process
and Container RSS, GC pauses, CPU/credit behavior and Valkey contention before sizing is accepted.
Each service's instance type, AMI, EBS size, IAM role, Security Group and detailed monitoring
setting remains independently configurable.

The shared RDS is one private PostgreSQL instance. PostgreSQL 16 and 18.x appear in current
development history, so a common exact engine version and parameter family remain blocked on
JDBC/Flyway compatibility checks for all three DB owners. RDS Multi-AZ and class are separate
availability/cost Owner decisions; the estimate below assumes Single-AZ.

## 4. Seoul AWS cost estimate

No resource is deployed and no bill exists. The following are estimates from working public
catalog rates, not an AWS Calculator quote. The 30-day scenario uses 720 EC2/RDS/public-IP
hours and prorates EBS GB-month by 720/730. V1 assumes 3×t4g.small + 1×t4g.medium, disks
24/30/24/24 GiB, one Single-AZ db.t4g.medium RDS with 20 GiB, and one public IPv4 per EC2.

| Candidate | EC2 | EBS | RDS | Public IPv4 | 30-day base | 7-day projection |
|---|---:|---:|---:|---:|---:|---:|
| V1: four independent EC2 | $74.88 | $11.45 | $73.44 | $14.40 | **$174.17 (~₩244k)** | **$40.64 (~₩56.9k)** |
| V2: two t4g.medium, 30 GiB each | $59.90 | $7.67 | $73.44 | $7.20 | **$148.21 (~₩207k)** | **$34.58 (~₩48.4k)** |
| V2: one t4g.large, 40 GiB | $59.90 | $5.87 | $73.44 | $3.60 | **$142.81 (~₩200k)** | **$33.32 (~₩46.6k)** |

V2 is a cost comparison only; four JVMs have not been shown to fit either candidate. A seven-day
projection is not a seven-day actual bill. A second 2-host fleet overlapping V1 for a week adds
about $16.92; one larger host adds about $15.66, assuming the existing RDS is shared. Co-located
Valkey is the cost-first design; a separate t4g.small Valkey host with 24 GiB and IPv4 adds about
$20.73/30 days and $4.84/7 days.

Unknowns excluded from the totals: egress, CloudWatch/API/alarm charges, snapshots beyond the
assumed retention, retained EBS, Terraform state, CPU-credit overage, tax, Cloudflare, Grafana
quota exceedance and load-generator cost. RDS/EBS/backup/IP charges can remain after stopping an
EC2 application. Reprice in the AWS Calculator after Region, Engine, HA and storage decisions.
The desired KRW 10,000 monthly cost is a goal, not a V1 cap.

## 5. VPC / Subnet / Security Group

Use VPC 10.42.0.0/16, two public EC2 subnets and two private RDS subnets in distinct AZs.
The current cost-first candidate places all four EC2s and a Single-AZ RDS in the first AZ; the
second private subnet satisfies RDS DB Subnet Group requirements. This is not multi-AZ
application availability. RDS Public Access is false.

Gateway has no Internet-origin inbound rule. Backend application ports accept traffic from the
Gateway Security Group only. RDS TCP/5432 accepts only Core, Finance and Carelog Security Groups.
Valkey TCP/6379 is bound to the Core host's private-only ENI address and its Security Group
accepts only the Gateway/Carelog Security Groups; public address binding and public CIDR ingress
are prohibited. SSH/22 is absent; SSM is the administration path. Cloudflare Tunnel, if selected,
connects outbound on its approved transport.

No NAT Gateway, ALB or VPC Endpoint is created by default. With public EC2 IPv4, outbound HTTPS
443 reaches SSM, the selected registry, package sources, Grafana Cloud and approved external APIs;
the Gateway can also use outbound TCP/UDP 7844 for Cloudflare Tunnel. This broad 443 Egress and
public IPv4 cost/exposure need Owner review. Without public IPv4, add and cost a reviewed NAT or
the required VPC Endpoints. No route opens direct application ingress.

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

## 7. Docker Compose service placement

Each runtime has a separate Compose stack, deployment/restart boundary and immutable image digest.
Gateway is the only application entrypoint. Gateway-to-Core/Finance/Carelog traffic is Private
HTTP/JSON; AI uses SSE. Each service keeps its JWT/OAuth/Refresh Token and internal authorization contracts.
The secret
store remains an Owner decision; no provider is selected. After approval, a per-EC2 instance
profile may read only exact secret resources required by that host. A trusted host-side fetcher
delivers only each container's required values as a read-only file mount accessible to that
service UID; application containers must not obtain instance-profile credentials through IMDS.
Do not put secrets in image layers, user data, source control, command arguments, shell history,
or ordinary logs. The EC2 Role is not the RDS Master Role. For co-located Valkey, use the Core
Docker bridge and the private-only ENI/port binding plus Security Group source references described
above.

## 8. Valkey Persistence / Security

- Use the official Valkey Docker Image. Valkey Version / Tag is UNKNOWN and must remain an
  explicit Owner input.
- Preserve current Spring Data Redis / Lettuce clients, Redis package names and property names.
- The existing platform config names include PLATFORM_GATEWAY_REDIS_* and
  PLATFORM_IDENTITY_REDIS_*; do not rename them merely because the server changes.
- Valkey TCP/6379 may be published only on its private-only ENI address using Compose `host_ip`;
  the Security Group allows only Gateway/Carelog Security Group sources. No Public Interface bind,
  public IP association on the Valkey ENI, `0.0.0.0:6379`, or public CIDR Ingress is allowed.
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
- Secret Store is unselected. Compare AWS Systems Manager Parameter Store SecureString and AWS
  Secrets Manager using secret count, rotation, access audit, API cost and operator effort.
- The injection contract uses the EC2 instance profile with least-privilege reads limited to the
  exact approved secret resources used by that host; the Core host role is limited to Core/Valkey
  secrets and each other host role to its service secrets. No long-lived AWS key is distributed.
- A trusted host-side fetcher mounts only each container's required values as read-only files
  scoped to the service UID. The application container must not access IMDS credentials. Verify
  a file-binding adapter preserves each application's existing property contract without logging
  values. Store choice, exact resources, rotation and fetcher remain Owner gates.
- Never inject the RDS Master Credential. Keep secret values out of user data, image layers,
  environment dumps, command arguments, shell history, source control and ordinary logs.
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

## 12. Central health and monitoring

Grafana Cloud Free is the preferred central UI candidate; verify current 10k active-series quota,
14-day retention and API behavior against the selected stack before adoption. Grafana is not
installed on EC2. Each host runs Alloy with 30-second host, Docker/cAdvisor, JVM process and
available Spring Actuator scrapes. cAdvisor requires privileged host/Docker access, which is
root-equivalent and needs a security Owner decision. Do not add Node Exporter/cAdvisor duplicates.

Required comparisons include CPU/memory/disk/network and T4g CPU credits; Container RSS; JVM
Heap/Max/Non-Heap/GC/thread/process RSS; HTTP RPS/P50/P95/P99/error/timeout; JDBC pool and query
latency; RDS connections/CPU/free memory/storage/read-write latency; Valkey memory/clients/
commands/eviction/latency; restart/health/deploy timestamp and itemized monthly cost. Labels use
service, instance, environment. RDS CloudWatch integration and Valkey exporter use explicit IAM
and bounded scrape configuration; no extra exporter is added without need.

The inspected Gateway/Core and Finance repositories lack the Prometheus registry/endpoint;
Carelog lacks Actuator. Application metrics therefore remain UNKNOWN until their separate
owner tasks merge and return real samples. See coordination issues #34, #35, #36. Grafana Cloud
retention is separate from redacted seven-day Evidence in the infrastructure repository. Alerts
initially cover host telemetry absence and sustained CPU; notification contact and policy must
be configured and tested by the Owner.

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

## 14. Cloudflare Tunnel validation gate

Cloudflare Tunnel is a preferred validation candidate, not an accepted Production Ingress. Verify
account/plan, DNS/TLS, token-file delivery, outbound TCP/UDP 7844, origin reachability to Gateway,
tunnel loss/reconnect behavior, logging and monthly cost. Confirm no direct EC2-origin inbound
path exists. Do not promote external traffic before written Owner acceptance. Any alternative
Ingress needs a separate decision and revised cost/security evidence.

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
- ADR-0021 / DEC-070 records a historical NATS JetStream approval; that historical record is
  preserved, but new NATS implementation is not the current Owner target.
- The current Owner policy direction designates SQS as the target, tracked in stacked
  [PR #37](https://github.com/ranikun-labs/harness-foundation-docs/pull/37). Its ADR/document
  approval and formal supersession/effective date are unconfirmed. Queue type and use case remain
  open; no SQS/NATS AWS resource is provisioned or approved here.
- If a real V1 asynchronous use case is identified, define durability / retry / replay requirements
  and pass separate design, IAM, cost and Dev gates before any resource is created.

## 16. MVP Go-Live checklist

- [ ] DEC-071 Owner policy direction is recorded; ADR-0022 document review/final approval and ADR-0016 partial-supersession effective status are explicit, with historical ADR-0016 content preserved.
- [ ] Private platform-infra repository, independent implementation PR, CI checks and state bootstrap review are complete.
- [ ] AWS account, ap-northeast-2, subnets, egress and Security Groups are approved.
- [ ] ARM64 builds, digest-pinned images, four independent Compose stacks and rollback pass.
- [ ] RDS exact engine version is compatible with every JDBC/Flyway owner; TLS, schema/role grants and ownership are verified.
- [ ] RDS class, Multi-AZ, backup retention and new RPO/RTO are explicit Owner decisions; restore evidence exists.
- [ ] Valkey placement, credentials, noeviction, persistence, monitoring and blacklist recovery/invalidations pass.
- [ ] Cloudflare Tunnel passes its validation gate or another Ingress has a separate approval.
- [ ] Alloy labels and Grafana dashboards receive real metrics; app 계측 issue results are verified; alert contact path is tested.
- [ ] Pre-Go-Live smoke/load evidence and production-load approval (if used) meet the separately approved Go-Live gate.
- [ ] Shared AI SSE, Shared Audit, Auth, Finance and Carelog E2E release gates pass.
- [ ] After explicitly approved Pilot/Go-Live begins representative traffic, capture the first seven-day baseline with cost, images, JVM flags, dataset and Dashboard export. This is post-Go-Live V2 evidence, not a prerequisite for the initial Go-Live. Pilot observations count only if an Owner confirms they represent the baseline workload and window.
- [ ] Cost Calculator estimate and V2 rollback proposal are reviewed.
- [ ] Owner explicitly approves Go/No-Go. No automatic Apply, Merge, traffic promotion or EC2 deletion.

## 17. Repository Inspection and Deployment Blockers

Snapshot at the branches and HEADs in ADR-0022:

| Repository | Verified Evidence | Blocker |
|---|---|---|
| harness-foundation-docs | ADR-0016 accepted historical record; ADR-0020: one Application DB with service Schemas; ADR-0021 / DEC-070: historical JetStream approval; new NATS implementation is not the current Owner target; PR #37 tracks SQS target direction but remains in review, with no AWS provisioning | ADR-0022 document approval/formal partial supersession are unconfirmed; preserve ADR-0016 history and integrate #37 policy separately |
| platform-services | Compose runs Gateway, Platform Core, local postgres:16-alpine, redis:7-alpine; Gateway / Core Dockerfiles exist; current Compose publishes 8080 / 8081; shared-audit is included in platform-core/settings.gradle.kts and app/build.gradle.kts | First blocker: platform-core/app/Dockerfile omits shared-audit/build.gradle.kts and shared-audit/src even though the included project is an app dependency; Docker image build is expected to fail at Gradle configuration, but was not executed in this documentation task. Production image / network configuration absent; no CI workflow; local Compose is not production |
| finance-harness-be | Java 21, Spring Boot 4.1.0, Flyway; Postgres 18.4 Testcontainers; configuration is environment-backed | No Dockerfile / Compose / GitHub Actions workflow; test uses finance_db and does not prove the ADR-0020 finance Schema / Role |
| carelog-be | Java 17, Spring Boot 3.4.5, Flyway; PostgreSQL 16 + redis:7 development Compose; V1 baseline is public Schema | No application Dockerfile / CI workflow; Compose has a committed local password and publishes DB / Redis host ports; no Actuator dependency or Application health check; public-to-carelog migration needs rehearsal |
| Shared AI | Same-JVM library; synchronous OpenAI Slice is implemented; no production provider / SSE release evidence | Current README defers streaming; Owner-required AI SSE E2E gate is open |
| Shared Audit | Java library module exists and Platform Core app depends on it; default capture implementation is Unavailable | No durable capture / store / production release evidence |

No AWS Resource or Production Runtime was inspected or changed. GitHub branch visibility does not
prove a cloud account or permission. Any resource state not directly evidenced is UNKNOWN.

## 18. GitHub Issues implementation map

The initial 14 implementation issues remain in their owning repositories. A focused open-issue
search for Actuator/Micrometer/Prometheus/metrics/observability found no instrumentation-specific
duplicates in the three application repositories. Four cross-repository coordination tickets were
created in Foundation Docs because application repositories are read-only in this session and the
private platform-infra repository does not exist yet. These tickets request handoff; they are not
AWS or application-code approvals.

### New infrastructure / instrumentation handoffs

| Owner | Task | Issue |
|---|---|---|
| platform-infra | Create private repository and open Terraform/Compose/Observability implementation PR | [Foundation Docs #33](https://github.com/ranikun-labs/harness-foundation-docs/issues/33) |
| platform-services | Gateway/Core private Prometheus, HTTP/JVM/JDBC metrics | [Foundation Docs #35](https://github.com/ranikun-labs/harness-foundation-docs/issues/35) |
| finance-harness-be | Finance Micrometer Prometheus and JDBC metrics | [Foundation Docs #34](https://github.com/ranikun-labs/harness-foundation-docs/issues/34) |
| carelog-be | Actuator readiness and Micrometer Prometheus metrics | [Foundation Docs #36](https://github.com/ranikun-labs/harness-foundation-docs/issues/36) |

### Existing V1 implementation issues

| Workstream | Repository issue |
|---|---|
| First blocker: Platform Core Docker build inputs for Shared Audit | [platform-services#20](https://github.com/ranikun-labs/platform-services/issues/20) |
| Official Valkey local server and command/flow compatibility | [platform-services#21](https://github.com/ranikun-labs/platform-services/issues/21) |
| EC2 production Compose foundation (single-host assumptions require Owner review against this four-host ADR) | [platform-services#22](https://github.com/ranikun-labs/platform-services/issues/22) |
| Shared Identity RDS schema/role/migration | [platform-services#23](https://github.com/ranikun-labs/platform-services/issues/23) |
| Gateway / Identity Auth E2E | [platform-services#24](https://github.com/ranikun-labs/platform-services/issues/24) |
| Immutable image CI/CD and rollback | [platform-services#25](https://github.com/ranikun-labs/platform-services/issues/25) |
| Shared AI SSE / Shared Audit release gate | [platform-services#26](https://github.com/ranikun-labs/platform-services/issues/26) |
| Finance image, schema, secret configuration, health and CI | [finance-harness-be#5](https://github.com/ranikun-labs/finance-harness-be/issues/5) |
| Finance Auth / product E2E | [finance-harness-be#6](https://github.com/ranikun-labs/finance-harness-be/issues/6) |
| Carelog image, schema migration, secret configuration, health and CI | [carelog-be#47](https://github.com/ranikun-labs/carelog-be/issues/47) |
| Carelog Auth / product E2E | [carelog-be#48](https://github.com/ranikun-labs/carelog-be/issues/48) |
| AWS network, secret store, and Cloudflare Tunnel gate | [Foundation Docs #30](https://github.com/ranikun-labs/harness-foundation-docs/issues/30) |
| Backup/restore, monitoring and recovery objectives | [Foundation Docs #29](https://github.com/ranikun-labs/harness-foundation-docs/issues/29) |
| Final Go-Live evidence gate | [Foundation Docs #31](https://github.com/ranikun-labs/harness-foundation-docs/issues/31) |

## 19. Remaining Owner decisions

1. Common PostgreSQL Engine Version, parameter family, class and Multi-AZ decision after JDBC/Flyway review.
2. RDS backup retention, snapshots, encryption, restore evidence and new RPO/RTO.
3. Valkey co-location vs dedicated EC2; image digest/version, credentials/ACL, AOF/RDB, volume and recovery.
4. AWS account/identity, Terraform state bucket, egress/public IPv4 and detailed monitoring costs.
5. ARM64 support, immutable image registry, deployment identity and secret rotation.
6. Cloudflare Tunnel validation and fallback Ingress decision.
7. Grafana Cloud Free limits, service-account scopes, contact point, cardinality and retention.
8. Application instrumentation Owner issues and actual endpoint/metric evidence.
9. Production load approval, safe route/dataset, concurrency and stop thresholds.
10. Seven-day baseline start/representative-traffic and stable-day criteria after Go-Live, Pilot vs Go-Live timing, and V2 migration/rollback approver. Exact operational values remain undecided.
11. Shared AI SSE and Shared Audit production release gates.
12. Explicit Go-Live Owner and redacted evidence location.
