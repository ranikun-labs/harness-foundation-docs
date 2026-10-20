---
title: "Jira G2-C — Owner Product/Component Classification Approval (7 issues)"
document_status: proposed
decision_scope: jira_governance
owner: governance
owner_decision_date: "2026-10-19"
owner_decision_status: approved_classification_only
migration_execution_status: not_approved
read_authority: legacy
write_authority: frozen
source_baseline: "harness-foundation-docs/main@6f80a366c3a71dbd8f85e5088f5dc7272937a511"
---

# Jira G2-C — Owner 분류 승인 기록 (2026-10-19)

## 1. 결정과 효력 경계

Ranikun Labs Owner는 **Product=실제 주 소유 시스템 하나**, **Component=대표 기술 영역 하나**라는 승인된 Taxonomy 원칙에 따라 아래 7건의 **Target Product/Component 분류만** 승인했다. 이 기록은 Owner가 2026-10-19 직접 명시한 Classification Approval에 기반하며, Jira Issue의 현재 Target 저장값이나 Migrated 상태를 뜻하지 않는다.

- 승인: 논리적 Product / Component 매핑 7건
- 미승인: Concern 지정, Jira Issue·Field·Description·Status·Parent·Link 원격 변경, G2 Batch Write, G3 Cutover, Legacy 제거
- 유지: 기존 Legacy Product·Component·Labels, 원문 Description, Cross-product 영향 근거, 현재 Issue Type / Parent / 관계
- 기존 Pilot 5건(RPL-75/78/91/69/81)과 Batch 1 5건(RPL-63/64/68/88/98)은 재처리하지 않는다.

## 2. Owner가 승인한 정확한 매핑

| Issue | Product (Target) | Component (Target) | 결정 이유 |
|---|---|---|---|
| [RPL-2](https://ranikunlabs.atlassian.net/browse/RPL-2) | `identity` | `documentation` | Kakao PKCE 공식 지원 범위·Provider-neutral Core capability 조사 및 계약 문서화 |
| [RPL-5](https://ranikunlabs.atlassian.net/browse/RPL-5) | `identity` | `backend` | ExternalIdentity 매칭·로그인·미연결 계정 409 계약 구현 |
| [RPL-6](https://ranikunlabs.atlassian.net/browse/RPL-6) | `identity` | `backend` | OAuth 흐름의 Redis·DB·Kakao Mock 서버 통합 검증 |
| [RPL-93](https://ranikunlabs.atlassian.net/browse/RPL-93) | `dev-harness` | `backend` | Task↔Session Association·Runtime observation/act Developer Workflow Product Layer |
| [RPL-95](https://ranikunlabs.atlassian.net/browse/RPL-95) | `dev-harness` | `backend` | User-local Runtime State·atomic publication·locking 구현 |
| [RPL-107](https://ranikunlabs.atlassian.net/browse/RPL-107) | `audit` | `backend` | Shared Audit의 독립 소유권·Producer/Consumer/Ledger 기반 Epic |
| [RPL-111](https://ranikunlabs.atlassian.net/browse/RPL-111) | `audit` | `backend` | Shared Audit의 Producer-side Transport Adapter; AWS 공유 IaC는 별도 책임 |

모든 **Concern(Target)은 이번 Owner 승인 범위 밖**이다. Concern에 임의 기본값을 넣거나 빈 값을 일괄 초기화하지 않는다.

## 3. Cross-product 보존 규칙

- **RPL-2·5·6:** Parent는 RPL-1(Carelog 로그인 Epic)이지만 하위 이슈는 공용 Identity 정책·기능을 소유한다. Carelog의 소비/통합·제품 로그인 완료 영향과 RPL-1 Parent 관계를 마이그레이션 전 별도 보존한다. Parent의 Product를 자동 복사하지 않는다.
- **RPL-93·95:** Legacy Product에는 carelog / finance-harness / platform-foundation 등 복수 영향 기록이 있다. 대표 Owner만 `dev-harness`로 분류하며 각 영향 Product와 의미·근거를 Snapshot/Impact Preservation Checklist로 검증한다. 기존 Legacy 복수값을 삭제하거나 임의로 축소하지 않는다.
- **RPL-107·111:** 공통 Audit는 `audit` 소유이며 최초 Identity Producer는 소유권 근거가 아니다. RPL-111의 과거 JetStream 설명은 역사 기록이다. ADR-0023의 정식 발효 후 별도 Jira Description/AC 정합화 절차를 수행한다. 본 분류 결정은 SQS 코드 구현·AWS Provisioning 승인과 무관하다.
- 다른 Epic/Issue의 대표 소유권, 특히 RPL-51 Component와 RPL-1·4·7 등 HOLD 사례는 이번 결정으로 승인되지 않는다.

영향 관계 기록은 [Jira Taxonomy §2.1](./jira-field-taxonomy.md)의 `Cross-product ownership (Jira migration proposal)` 계약을 따르며, Jira에 적용하기 전 현재 Description·Parent·관계와 Owner 증거를 재검증한다.

## 4. G2 Migration Mapping — 승인과 실행 분리

| Issue | customfield_10108 — Product | customfield_10109 — Component | customfield_10110 — Concern |
|---|---|---|---|
| RPL-2 | identity | documentation | 미승인 · 변경 금지 |
| RPL-5 | identity | backend | 미승인 · 변경 금지 |
| RPL-6 | identity | backend | 미승인 · 변경 금지 |
| RPL-93 | dev-harness | backend | 미승인 · 변경 금지 |
| RPL-95 | dev-harness | backend | 미승인 · 변경 금지 |
| RPL-107 | audit | backend | 미승인 · 변경 금지 |
| RPL-111 | audit | backend | 미승인 · 변경 금지 |

위는 **논리 매핑 승인**이다. Jira Option ID와 이슈 유형별 Allowed Options / Edit Metadata는 이 승인으로 검증됐다고 간주하지 않는다. Writer Payload와 Batch 구성은 아래 조건이 충족된 후 별도 Owner 승인을 받아야 한다.

## 5. 실제 Write 이전 Gate (현재 미충족)

1. Jira 원격 최신 이슈·Parent·Legacy·Target·Description 원문(가능하면 원본 ADF)·관계 및 업데이트 시각 재조회
2. Product/Component 옵션 ID, Issue Type/Context, Edit Metadata의 유효성 확인; Concern은 미지정 유지
3. 이슈별 Before Snapshot, 변동 검출 방법, 간단한 Manifest와 Impact Preservation 기록 작성·Owner 검토
4. 정확한 Issue 목록과 변경할 셀, 단일 Writer, 배타적 변경 창, Rollback/후검증 기준에 대한 **별도 G2 실행 승인**
5. Write 직전 Snapshot과 현재 응답 동일성 확인, Target-only Write, 저장 후 Changelog·비대상 필드/ADF 보존 검증
6. 충돌·불일치·접근 문제 발생 시 중단; 변경된 Target만 안전하게 복구하고 다른 Writer 변경을 덮어쓰지 않음

**Authority 유지:** `ReadAuthority=legacy` / `WriteAuthority=frozen`. G3 Cutover는 별도 Owner 결정이며 본 문서로 활성화하지 않는다.

## 6. 근거

- [Jira Field Taxonomy](./jira-field-taxonomy.md) 및 [G0 Owner Decision](./jira-taxonomy-g0-owner-decision-2026-10-15.md)
- 2026-10-19 Owner Classification Approval: RPL-2, RPL-5, RPL-6, RPL-93, RPL-95, RPL-107, RPL-111의 Product/Component만 승인
- 2026-10-19 Jira READ-ONLY Description·Parent·Legacy/Target 검증 및 각 제품/Platform 실제 소스 경계 대조
- GitHub 정본 Baseline: `6f80a366c3a71dbd8f85e5088f5dc7272937a511`

**이력/상태 주의:** 본 결정 기록의 GitHub Merge 여부는 별도 검토·병합 절차로 확인한다. 문서 생성 또는 PR 생성만으로 Jira Migration이 실행되지 않는다.
