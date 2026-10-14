# Architecture Decision Records

이 디렉터리는 ADR을 관리하는 위치다.

## 책임

- 개별 결정의 배경, 결론, 근거, 결과 보존
- Accepted ADR의 변경 이력 보존
- Master, Roadmap, Architecture 문서와 결정 단위 연결

## 허용 내용

- `proposed`, `accepted`, `rejected`, `superseded` 상태의 ADR
- 관련 Source Input, Decision Log, canonical 문서 링크

## 금지 내용

- 승인되지 않은 내용이 채워진 ADR
- Accepted ADR 본문의 조용한 재작성
- 제품 구조나 기술 결정을 임의로 설계한 ADR

## 템플릿

새 ADR은 [templates/adr-template.md](../../templates/adr-template.md)를 사용한다.

## ADR Index

| ADR | Status | Title | Relationship |
|---|---|---|---|
| [ADR-0012](./ADR-0012-shared-identity-commerce-boundary.md) | accepted | Shared Identity와 Shared Commerce의 논리적 책임 경계를 분리한다 | ADR-0013/0014가 이 논리 경계를 유지 |
| [ADR-0013](./ADR-0013-target-deployment-and-data-boundaries.md) | accepted_with_constraints | 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다 | 명칭은 ADR-0014, Gateway·Identity 물리화와 Audit 영구 금지 해석은 ADR-0017, PostgreSQL target placement는 ADR-0020 / DEC-069로 partial supersession |
| [ADR-0014](./ADR-0014-shared-services-deployment-unit-naming.md) | accepted | Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다 | ADR-0013 명칭을 대체; 구체 Process는 ADR-0017이 partial supersede |
| [ADR-0015](./ADR-0015-platform-communication-messaging-scaling.md) | accepted_with_constraints | 공통 플랫폼 통신·메시징·확장 기준을 정의한다 | Shared Identity 추출 미승인만 ADR-0017로 partial supersession; 통신 불변조건 유지 |
| [ADR-0016](./ADR-0016-primary-deployment-and-disaster-recovery.md) | accepted_with_constraints | Mac mini Primary와 AWS DR 기반 배포·재해복구 경계를 정의한다 | 원본 승인 기록과 역사 본문을 보존; ADR-0022의 일부 대체 방향은 제안됐으나 ADR 문서 최종 승인·발효일이 확인되지 않아 formal supersession은 미확정; 과거 RPO/RTO와 Human-approved Failover / Write Fencing 원칙을 보존 |
| [ADR-0017](./ADR-0017-shared-platform-gateway-identity-physicalization.md) | accepted_with_constraints | Shared Gateway와 Shared Identity의 물리화를 승인한다 | Gateway·Identity only; implementation/runtime/release `not_started` / `not_supported` / `not_released`; DEC-067 |
| [ADR-0018](./ADR-0018-shared-ai-platform-core-placement.md) | accepted | Shared AI Phase 1을 Platform Core 논리 모듈로 배치한다 | Effective 2026-08-26; ADR-0017 §7 placement assumption만 partial supersede; Shared AI ADR-0005 coordinated acceptance; technology deferred |
| [ADR-0019](./ADR-0019-rpl-55-slice-a-interim-service-auth.md) | accepted_with_constraints | RPL-55 Slice A′의 임시 서비스 인증 경계를 기록한다 | `platform-identity` → Carelog CRM identity projection의 단일 endpoint-scoped credential; DEC-068; portfolio-wide service auth 아님 |
| [ADR-0020](./ADR-0020-shared-platform-postgresql-schema-ownership.md) | accepted_with_constraints | Shared Platform PostgreSQL를 단일 Application Database와 Schema Ownership으로 정렬한다 | ADR-0013 §6의 PostgreSQL target placement를 partial supersede; DEC-069 |
| [ADR-0021](./ADR-0021-shared-audit-foundation-architecture.md) | accepted_with_constraints | Shared Audit Foundation Architecture와 JetStream 활성화 방향을 기록한다 | 과거 승인된 Audit/JetStream 결정과 AU-G2 경계를 보존; 신규 NATS 구현은 현재 Owner 목표가 아님. SQS Target 방향은 stacked PR #37에서 검토 중이며 ADR 최종 승인·formal supersession은 미확정; Runtime `not_supported`; DEC-070 |
| [ADR-0022](./ADR-0022-aws-v1-mvp-primary-runtime.md) | in_review (decision: accepted_with_constraints; scope: owner_policy_direction_only) | AWS V1 MVP Production Primary Runtime을 4개 독립 EC2로 정한다 | Owner 정책 방향 승인과 ADR 문서 최종 승인은 구분; 공식 승인자/날짜 및 ADR-0016 partial supersession 발효일 미확인; 7일 Baseline은 승인된 Pilot/Go-Live 후 대표 트래픽에서 시작하며 AWS provisioning은 미승인·미실행; ADR-0015/0020/0021의 유효 범위를 보존하고 NATS/SQS 대상 정렬은 PR #37과 Integration 필요
