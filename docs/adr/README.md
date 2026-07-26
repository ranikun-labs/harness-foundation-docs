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
| [ADR-0013](./ADR-0013-target-deployment-and-data-boundaries.md) | accepted_with_constraints | 목표 Deployment Unit과 PostgreSQL 데이터 소유권 경계를 정의한다 | `Shared Platform Server` 명칭 범위는 ADR-0014로 partial supersession |
| [ADR-0014](./ADR-0014-shared-services-deployment-unit-naming.md) | accepted | Identity·Commerce·Audit 공동 배포 후보를 Shared Services Deployment Unit으로 구분한다 | ADR-0013의 물리 명칭 범위를 partial supersede; DEC-060과 연결 |
