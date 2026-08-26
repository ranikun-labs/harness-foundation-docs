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
| [ADR-0013](./ADR-0013-target-deployment-and-data-boundaries.md) | accepted_with_constraints | 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다 | 명칭은 ADR-0014, Gateway·Identity 물리화와 Audit 영구 금지 해석은 ADR-0017로 partial supersession |
| [ADR-0014](./ADR-0014-shared-services-deployment-unit-naming.md) | accepted | Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다 | ADR-0013 명칭을 대체; 구체 Process는 ADR-0017이 partial supersede |
| [ADR-0015](./ADR-0015-platform-communication-messaging-scaling.md) | accepted_with_constraints | 공통 플랫폼 통신·메시징·확장 기준을 정의한다 | Shared Identity 추출 미승인만 ADR-0017로 partial supersession; 통신 불변조건 유지 |
| [ADR-0016](./ADR-0016-primary-deployment-and-disaster-recovery.md) | accepted_with_constraints | Mac mini Primary와 AWS DR 기반 배포·재해복구 경계를 정의한다 | implementation `not_started`; Production Adoption `not_approved`; RPL-42 / DEC-066 |
| [ADR-0017](./ADR-0017-shared-platform-gateway-identity-physicalization.md) | accepted_with_constraints | Shared Gateway와 Shared Identity의 물리화를 승인한다 | Gateway·Identity only; implementation/runtime/release `not_started` / `not_supported` / `not_released`; DEC-067 |
| [ADR-0018](./ADR-0018-shared-ai-platform-core-placement.md) | in_review / open | Shared AI Phase 1을 Platform Core 논리 모듈로 배치한다 | Option B decision proposal; ADR-0017 §7 placement assumption만 partial supersession 후보; Shared AI ADR-0005 coordinated approval 필요 |
