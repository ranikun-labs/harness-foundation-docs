---
title: "공통 Account와 제품 Membership, 개인 BillingSubject의 소유권을 정렬한다"
adr_id: "ADR-0024"
document_status: in_review
decision_status: accepted_with_constraints
decision_status_scope: owner_policy_direction_only
decision_scope: architecture
owner: architecture
authors: [codex]
reviewers: []
approvers: []
created_at: "2026-10-13"
reviewed_at: "2026-10-13"
approved_at: null
effective_from: null
implementation_status: not_verifiable
constraints:
  - "Owner 승인 범위는 논리 정책이며 전체 제품 구현·배포 완료가 아니다"
  - "Organization Billing은 MVP 범위에서 제외한다"
  - "탈퇴·법정 보존 상세 정책은 Proposed이며 수치·즉시 차단 수준을 확정하지 않는다"
affected_docs:
  - docs/adr/ADR-0012-shared-identity-commerce-boundary.md
  - docs/architecture/backend-service-foundation/service-boundaries.md
  - docs/decisions/decision-log.md
evidence_refs:
  - "Owner task decision, 2026-10-13, Other Owner Decisions to Align"
supersedes: [ADR-0012]
superseded_by: []
superseded_scope:
  - "ADR-0012의 Product Membership을 Shared Commerce가 소유하는 포괄적 표현"
remaining_valid_scope:
  - "Identity와 Commerce의 동급 독립 논리 경계, Commerce 물리화 유예와 V1 Local OSS 독립성"
replacement_decision_refs: [DEC-073]
---

# ADR-0024: Identity / Commerce / Product Owner 정책 정렬

> **Owner Review 보완:** `decision_status`는 2026-10-13 요청에서 명시된 정책 방향에만
> 적용한다. 이 ADR 전체의 상세 설계·최종 문서 승인이나 Supersession의 공식 발효를
> 증명하지 않는다. `document_status: in_review`를 유지하고 공식 승인 기록은 확인되지
> 않아 `approvers: []`, `approved_at: null`, `effective_from: null`로 둔다.
> `reviewed_at`은 문서 검토일이며 Owner 최종 승인일이 아니다.

## 1. 결정과 기존 충돌

ADR-0012 / DEC-057은 Shared Commerce에 `Product Membership`을 포함한다.
이번 Owner 결정에 따라 **제품별 User / Membership은 Product가 소유**하고
Commerce는 구독·Billing·Payment·상업적 Entitlement를 소유한다. Membership과
유료 Entitlement는 같은 개념이 아니다. 기존 본문을 지우지 않고 이 범위만 부분 대체한다.

공통 `PlatformAccount`, 제품별 OAuth App, 공통 SSO·제품별 인가, 명시적 Social
Account Linking과 개인 BillingSubject는 기존 ADR의 누락된 정책을 구체화한다.
Identity 물리화 ADR-0017, PostgreSQL ADR-0020과 Audit ADR-0021의 독립 Ownership은
유지한다. 이 ADR은 Commerce 구현·결제 Provider·Migration·제품 출시를 승인하지 않는다.

## 2. 확정 정책과 Data Ownership

| 경계 | Owner가 확정한 책임 | 다른 경계와의 계약 |
|---|---|---|
| Identity | 공통 PlatformAccount, Credential, ExternalIdentity, 인증·Session·Token·SSO | 제품은 안정적 opaque Account ID를 Weak Reference로 소비 |
| Carelog / Finance | 각 제품의 User, Membership, Onboarding, Consent, Role/Permission과 인가 | 공통 로그인은 제품 가입·권한 부여를 자동 의미하지 않음 |
| OAuth App | Carelog / Finance별 App 분리 | Identity가 인증·Linkage를 관리하되 Client 설정·Redirect·State·제품 Audience 경계를 분리 |
| Commerce | 개인 BillingSubject 기반 Subscription, Billing, Payment와 상업적 Entitlement | Product Membership을 대체하지 않고 각 제품은 자체 접근 인가를 집행 |
| Shared AI | 공통 실행 경계와 구현된 Capability의 기존 소유권 유지 | Product 데이터·Prompt·Workflow·인가 정책을 이전하지 않음 |

OAuth App 분리는 사용자 계정의 제품별 복제를 의미하지 않는다. 같은 PlatformAccount를
공유할 수 있지만 Provider Subject는 Provider/App의 식별 Scope를 확인해야 한다.
제품 App이 다르다는 이유로 Subject나 Email을 전역 동일인 증명으로 해석하지 않는다.
Shared SSO는 인증 공유이며 제품 Membership과 상업적 Entitlement 검사를 우회하지 않는다.

Social Account Linking은 **재인증을 거친 명시적 사용자 동의·요청**으로 수행한다.
Email 일치, 이미 로그인했다는 이유 또는 OAuth Callback만으로 자동 Link하지 않는다.
기존 계정의 통제권과 새 Provider 인증, Link 충돌·이미 연결된 계정의 안전한 처리를
검증한다. 구체 재인증 강도·유효시간·지원 Provider/App 매핑은 후속 Identity/Security
Contract가 소유하며 임의 수치를 추가하지 않는다.

개인 BillingSubject와 PlatformAccount 사이의 연결은 논리 참조다. 개인 구독의
정확한 상품·가격·상태·취소/환불·Entitlement 갱신 방식은 Commerce/Product 후속
계약으로 남긴다. **Organization Billing은 MVP에서 제외**한다. 기존 제품 Organization/
Membership 개념이나 장기 V3 검토까지 삭제하는 결정으로 확대하지 않는다.

ADR-0020의 Schema/Role/Migration Ownership을 유지한다. 다른 서비스의 Table 직접
조회·갱신, Cross-service FK/OLTP JOIN과 탈퇴 시 타 Schema 직접 삭제를 허용하지 않는다.
API/Token/Event/Projection 계약으로 협력하며 실제 비동기 Provider와 내부 Job 실행은
[ADR-0023](./ADR-0023-sqs-messaging-and-environment-isolation.md)이 소유한다.
서비스 내부 DB의 FK/Unique/Index/Transaction은 계속 사용한다.

## 3. 탈퇴·보존 — 방향과 Proposed 상세 구분

Owner가 제시한 방향은 **C 중심 Lean Hybrid**다. Identity의 Account Lifecycle과
Product/Commerce의 데이터 보존 책임을 분리하고 MVP에 과도한 중앙 오케스트레이션을
추가하지 않는 방향으로 검토한다. `C`의 상세 실행 모델을 이 문서가 임의 정의하거나
기존 법적 검토를 대체하지 않는다.

다음은 **Proposed / 미결정**이며 확정된 Owner 정책 방향의 범위에 포함되지 않는다.

| 항목 | 후속 Owner / Review | 확정 전 제약 |
|---|---|---|
| 탈퇴 요청·완료와 재가입 상태 모델, C 실행 경계 | Identity + Product + Architecture | 삭제·탈퇴 완료 또는 구현 완료를 주장하지 않음 |
| 즉시 접근 차단 수준, Token/Session/SSO 및 제품 반영 SLA | Identity + Security + Product | 모든 기존 Token 즉시 무효화 등을 임의 약속하지 않음 |
| 데이터별 법적 근거·보존기간·목적 제한·접근권 | Product + Commerce + Legal/Compliance | 법정 기간을 임의 숫자로 결정하지 않음 |
| Tombstone 내용·수명·재사용/재가입·삭제 증명 | Identity + Privacy + Product | 수명·PII 보존 범위를 확정하지 않음 |
| 이벤트/Job 실패·중복·재처리와 Backups/Audit의 삭제 경계 | 각 데이터 Owner + Operations | 무조건 전파 완료·복구 후 삭제 완료를 주장하지 않음 |

Shared Audit의 Retention Class와 Append-only·통제된 Lifecycle DELETE 규칙은
ADR-0021에 따른다. 구체 보존기간은 여전히 AU-G4 Product/Compliance Policy이며
승인 전 자동 Audit 삭제를 활성화하지 않는다. 제안은 실제 데이터 삭제나 보존 의무를
승인하는 명령이 아니다.

## 4. 대안·결과와 Authority

통합 Identity에 Product User/인가/Billing을 모두 넣는 대안은 소유권과 장애 범위를
확대하므로 채택하지 않는다. 제품마다 독립 Account/SSO를 복제하는 대안도 공통 Account
방향과 충돌한다. 제품별 OAuth App은 설정·보안 경계를 명확히 하지만 App 매핑·
운영과 Linking 검증 부담이 늘어난다. 개인 BillingSubject는 MVP를 줄이되 Organization
결제는 후속 범위로 남긴다.

승인된 논리 방향과 부분 Supersession을 DEC-073으로 기록한다. Proposed Lifecycle 상세,
재인증 강도와 Commerce 구현 계약은 각 Owner의 후속 검토가 필요하다. 기존
Identity / Shared AI / Carelog / Finance의 부분 구현 Evidence를 전체 정책 구현 완료로
확대하지 않는다. Human Review·Merge·AWS Apply·Production Release 권한은 추가하지 않는다.
