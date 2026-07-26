---
title: Finance Harness Report
status: draft
implementation_status: partial
owner: finance
snapshot_repository: finance-harness-docs
snapshot_path: /Users/work/Documents/금융 문서 패키지/finance-harness-docs
snapshot_branch: main
snapshot_commit: 8d38aed38ba67f8e1fe98ecde21790297620eb81
snapshot_date: 2026-07-14
last_reviewed: 2026-07-14
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0004
  - ADR-0005
  - ADR-0008
  - ADR-0009
source_inputs:
  - finance-harness-docs
  - finance-knowledge-architecture
  - finance-product-policy
  - finance-local-experiment
---

# Finance Harness Report

## 1. 문서 목적

이 문서는 Finance Harness의 현재 Knowledge Contract, Product Contract, Runtime 준비 상태를 기록한다.

목적은 다음과 같다.

1. `finance-harness-docs`에 존재하는 문서와 실제 Runtime 활성화 상태를 구분한다.
2. Product-MVP Lens 17개의 작성·배치·검증 상태를 정리한다.
3. Lens, PolicyGuard, Catalog, Routing, Fixture, Regression의 현재 Gap을 식별한다.
4. Finance Contract MVP와 Local Finance Experiment의 완료 조건을 정의한다.
5. 아직 물리화되지 않은 `finance-harness` Backend를 현재 구현처럼 오해하지 않도록 한다.
6. Development Harness와 공유하는 Contract와 공유하지 않는 Domain Model을 구분한다.
7. Product / Legal / Operations와 Runtime 집행 책임을 구분한다.
8. 다음 Finance 문서 및 구현 인계의 입력을 제공한다.

이 문서는 새로운 금융 상품 구조를 설계하지 않는다.

Finance Harness의 목표 제품 경계는 다음 문서를 따른다.

```text
docs/master/product-architecture-master.md
docs/roadmap/product-roadmap.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
```

이 문서는 특정 시점의 **Finance Knowledge and Runtime Readiness Snapshot**이다.

---

## 2. Snapshot 기준

기본 분석 기준:

```text
Repository: finance-harness-docs
Local path: /Users/work/Documents/금융 문서 패키지/finance-harness-docs
Branch: main
Commit: 8d38aed38ba67f8e1fe98ecde21790297620eb81
Date: 2026-07-14
```

이 문서의 기본 판정은 위 Commit의 tracked 상태를 기준으로 한다.

이 Snapshot은 다음을 중심으로 판단한다.

```text
Canonical document placement
Knowledge Artifact metadata
Lens inventory
PolicyGuard contract
Catalog / Routing
Fixture / Regression
Professional Standards
Human Review
Runtime activation readiness
```

다음은 별도 물리 구현으로 취급한다.

```text
finance-harness Backend
Finance Product Database
User/Auth integration
Journal persistence
Market Data integration
Production PolicyGuard execution
Finance Audit Evidence
```

`finance-harness-docs`에 문서가 존재한다는 사실만으로 위 Runtime이 구현됐다고 판정하지 않는다.

### Post-snapshot Delta

기준 Commit 이후 최신 `main`에는 다음이 추가됐다.

```text
신규 7개 Lens key Catalog 등록
신규 7개 Lens inactive Routing 경계 추가
Product-MVP topic Risk / Data Grounding Fixture 추가
Adversarial coverage 추가
Inactive Lens Regression Coverage Matrix 추가
06 Professional Standards canonical 계층 추가
Evidence / Uncertainty Standard 추가
Response Quality Rubric 추가
Human Review Protocol 추가
```

위 변경은 기준 Commit 판정과 혼합하지 않고 별도 최신 상태로 기록한다.

Historical Snapshot과 최신 `main` 상태를 하나의 현재 상태처럼 합치지 않는다.

## 3. Executive Summary

Finance Harness의 제품 방향은 명확하게 고정돼 있다.

```text
Learn
→ Checklist
→ Journal
→ Review
```

제품이 하지 않는 것:

```text
수익률 예측
종목 추천
매수·매도 판단
목표가·손절가 제시
자동매매
사용자 판단 책임 대체
```

현재 가장 많이 진척된 부분:

```text
Finance Knowledge Architecture
Core Rules / Safety / Runtime Contract
Product-MVP Lens Inventory
신규 Lens 7개 작성과 canonical 배치
PolicyGuard 방향
Knowledge Artifact Metadata
Product / Legal / Operations 경계
Professional Standards / Human Review 트랙
```

현재 가장 큰 Gap:

```text
기존 Core Lens 10개 Metadata Backfill
17개 Registry 정합성
신규 7개 Safe Routing
신규 7개 Lens-specific Fixture
Executable Regression
Runtime-loadable 검증
Routable 검증
Activation Gate
Local Finance Experiment E2E
finance-harness Runtime 물리화
```

핵심 판단:

```text
Finance Knowledge Contract
= 상당 부분 문서화됨

Finance Runtime Readiness
= 부분 완료

Finance Product Backend
= 목표 상태 / 미구현
```

문서 수량이나 Lens 작성 완료만으로 Product-MVP 완료로 판정할 수 없다.

Product-MVP는 다음 연결이 닫혀야 한다.

```text
Lens
→ Catalog
→ Routing
→ Fixture
→ Regression
→ PolicyGuard
→ Activation Gate
→ Human Review
```

현재 Finance Harness는 **Knowledge Contract 구축 단계에서 Runtime Activation 준비 단계로 이동 중**이다.

---

## 4. 제품 정의

## 4.1 제품 정체성

Finance Harness는 금융 교육·판단 전 점검·기록·복기를 지원한다.

외부 제품 표현 후보:

```text
AI 투자 체크리스트
AI 투자 기록
AI 투자 공부 노트
투자 질문 보정 도구
투자 복기 도구
```

피해야 하는 표현:

```text
AI 투자자문
AI 종목추천
AI 매수·매도 판단
AI 리딩
AI 자동매매
AI 포트폴리오 관리
```

## 4.2 핵심 사용자 흐름

```text
사용자 질문
→ 질문 재해석
→ 적용 Lens 선택
→ 체크 항목 생성
→ PolicyGuard 검수
→ ChecklistResult
→ JournalCandidate
→ 사용자 수정·확정
→ Review
```

## 4.3 사용자 책임

AI는 판단을 대신하지 않는다.

사용자는 다음 권한과 책임을 유지한다.

```text
질문 확인
Context 제공 범위 선택
Checklist 검토
JournalCandidate 수정
Journal 확정
Review 결과 수용 여부 결정
삭제·내보내기
```

---

## 5. Repository 책임

## 5.1 `finance-harness-docs`

소유 책임:

```text
Finance Knowledge Contract
Safety Contract
Runtime Contract
Lens Definition
Lens Catalog
Routing Contract
Fixture
Regression
Product / Legal / Operations Policy
Finance Product Service Policy (`service-policy/finance-product-policy.md`)
Launch Experiment Values (`service-policy/finance-launch-experiment-values.md`)
Professional Standards
Human Review Protocol
Artifact Metadata
Exposure Policy
```

소유하지 않는 책임:

```text
AnalysisRequest Runtime 저장
LensRun 실행 기록
PolicyGuardRun 실행 기록
ChecklistResult 저장
Journal 저장
ReviewRecord 저장
Finance Entitlement 계산
Finance Usage 집계
User Deletion 실제 집행
Audit Evidence Runtime 저장
```

## 5.2 `finance-harness`

목표 Runtime 책임:

```text
Backend Architecture
API Contract implementation
Domain implementation
Persistence / Migration
Contract Loading
Activation Gate
Lens Selection
Lens Execution
PolicyGuard Execution
Run / Result Storage
ChecklistResult
JournalCandidate
Journal
ReviewRecord
Deletion / Export
Access History
Audit Evidence
Finance Entitlement
Finance Usage
Operational Evidence
```

현재 `finance-harness` Runtime의 구현 완료 상태는 이 Snapshot에서 확인되지 않는다.

`finance-harness`는 canonical Finance Product Policy 또는 canonical Launch
Experiment Values를 소유하지 않는다. Backend Architecture와 구현은
`finance-harness-docs`의 canonical Product Policy를 source input으로 참조하며,
그 상태·원칙·값을 재정의하지 않는다.

따라서 다음은 목표 상태다.

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
FinanceUsage
FinanceEntitlement
```

---

## 6. Knowledge Architecture

기준 Commit `8d38aed`의 canonical 물리 계층:

```text
00-core
├── 0-a-safety-core
├── 0-b-lens-infra
├── 0-c-runtime-contract
└── 0-d-knowledge-architecture

01-core-analysis-lenses
02-asset-class-long-term
03-domain-deep-dive
```

논리 책임:

```text
Regression / Verification
= 00-core/0-a 및 0-c에 분산

05 Product / Legal / Operations
= 기준 Commit에서는 legacy-review-pending

06 Professional Standards
= 기준 Commit에서는 legacy-review-pending
= 최신 main에서 canonical 계층으로 승격
```

계층 책임:

| 계층 | 책임 |
|---|---|
| 00-core | 안전, Lens Infra, Runtime Contract, Knowledge Architecture |
| 01 | 기존 Core Lens 10개 |
| 02 | ETF·채권 등 Asset Class 특화 Lens |
| 03 | 산업·시장·지역 구조 Deep-Dive Lens |
| Regression / Verification | 00-core/0-a 및 0-c에 분산된 논리 책임 |
| 05 | 제품 정책, 법률, 데이터, 운영 후보 문서 |
| 06 | Professional Standards, Human Review |

판정:

```text
기준 Commit: 00~03 canonical
최신 main: 06 추가 canonical
05: 여전히 review-pending
```

강점:

- Lens 문서와 Product Policy를 분리한다.
- Safety와 Runtime Contract를 Lens보다 상위에 둔다.
- Fixture와 Regression 책임이 00-core 아래에 존재한다.
- Professional Standards를 Product 기능과 분리한다.
- 문서 존재와 Runtime 활성화를 분리할 구조가 있다.

남은 과제:

- 각 계층 README와 Catalog 간 참조 일치
- 기존 Core Lens 10개 Metadata Backfill
- `document_id`와 실제 경로 정합성
- Deprecated / Active 문서 탐색 규칙
- Owner와 Review 주기
- Runtime-loadable 허용 목록
- User-facing `exposure_class` 허용 목록
- 05 Product / Legal / Operations의 canonical 여부 결정

## 7. Product-MVP Lens Inventory

현재 Product-MVP Lens:

```text
기존 Core Lens 10개
+ Asset Class Lens 2개
+ Domain Deep-Dive Lens 5개
= 총 17개
```

신규 7개:

### Asset Class

```text
ETF / Index Structure
Bond
```

### Domain Deep-Dive

```text
Semiconductor Cycle
AI Compute Value Chain
Korea Equity Structure
US Equity Structure
Earnings Revision
```

Commodity는 현재 Product-MVP 범위가 아니다.

```text
Commodity
= P2 이후 후보
```

신규 7개는 작성 및 canonical 배치가 완료된 상태로 본다.

다만 다음은 별도 판정이다.

```text
문서 작성 완료
≠ Catalog 등록 완료
≠ Routing 연결 완료
≠ Fixture 완료
≠ Regression 완료
≠ Runtime-loadable
≠ Routable
≠ Product 활성화
```

---

## 8. Lens 상태 모델

Lens는 최소 다음 축으로 판정해야 한다.

```text
lifecycle_status
implementation_status
runtime_loadable
routable
fixture_refs
activation_gate
exposure_class
```

각 축의 의미:

| 축 | 질문 |
|---|---|
| lifecycle_status | 문서가 Draft·Active·Deprecated 중 어디인가 |
| implementation_status | Contract만 존재하는가, 검증됐는가 |
| runtime_loadable | Runtime Loader가 읽을 수 있는가 |
| routable | 사용자 요청에서 선택 대상인가 |
| fixture_refs | 검증 Fixture가 연결돼 있는가 |
| activation_gate | 어떤 조건에서 실제 활성화되는가 |
| exposure_class | 내부 전용인가, 사용자 응답 경로에 노출 가능한가 |

하나의 `status: active`로 모든 의미를 합치지 않는다.

Metadata Standard는 Target Contract다.

```text
신규 Product-MVP Lens 7개
= 주요 Metadata Envelope 적용

기존 Core Lens 10개
= legacy Metadata 사용
= document_id, runtime_loadable, routable,
  activation_gate 등 Backfill 필요
```

신규 7개에 Metadata가 적용됐다는 이유로 전체 17개 Migration이 완료됐다고 판정하지 않는다.

## 9. Current Status Matrix

| 영역 | 기준 Commit 상태 | 최신 main 상태 | Product-MVP 판정 |
|---|---:|---:|---|
| Product positioning | Defined | Defined | 완료 |
| Learn→Checklist→Journal→Review | Defined | Defined | 완료 |
| Core Rules | Documented | Documented | 대체로 완료 |
| Safety Contract | Documented | Documented | 대체로 완료 |
| Runtime Contract | Documented | Documented | 부분 완료 |
| Core Lens 10 | Canonical | Canonical | 문서 기준 완료 |
| New Lens 7 | Canonical placement / inactive | 동일 | 문서 기준 완료 |
| Product-MVP Lens 17 inventory | Defined | Defined | 완료 |
| Lens Catalog | 기존 10개 | 17개 key 등록 | 부분 완료 |
| Routing Contract | 기존 10개 | 신규 7개 inactive 경계 | 부분 완료 |
| Lens별 Fixture | 신규 7개 `fixture_refs: []` | Risk 소재 Fixture 추가 | 부분 완료 |
| Regression Suite | 문서 중심 | Coverage Matrix 추가 | 부분 완료 |
| PolicyGuard Contract | Documented / substantial | 동일 | 부분 완료 |
| Output Validation | Contract documented | 동일 | 부분 완료 |
| Professional Standards | canonical 범위 아님 | 06 canonical | 부분 완료 |
| Human Review Protocol | canonical 범위 아님 | Documented-only | 부분 완료 |
| Artifact Metadata Standard | Target defined | 동일 | Core 10 Backfill 필요 |
| Exposure Policy | 일부 적용 | 일부 적용 | 부분 완료 |
| Activation Gate | Gate ID만 존재 | 실행·승인 기록 없음 | 미완료 |
| Local Finance Experiment | E2E 종료 근거 없음 | 동일 | 미완료 |
| Finance Runtime | Not verified | Not verified | Future |
| Finance Database | Not verified | Not verified | Future |
| User/Auth integration | Not verified | Not verified | Future |
| Journal persistence | Target only | Target only | Future |
| Audit Evidence | Target only | Target only | Future |

핵심 구분:

```text
Professional / Artifact Human Review
= 최신 06 문서에 존재

End-user JournalCandidate Human Review
= Product Runtime 방향만 존재
= 구현 미확인
```

# Part I. Implemented or Defined Assets

## 10. Core Rules and Safety

판정:

```text
Documented / Canonical Direction Defined
```

핵심 원칙:

```text
투자 판단 대체 금지
매수·매도·목표가·손절가·수량·비중 제안 금지
체크리스트 중심
근거와 불확실성 표시
사용자 책임 유지
계좌연동 비필수
자동매매 금지
```

현재 가치:

- 모든 Lens보다 상위 제약을 제공한다.
- Product UI와 Prompt, PolicyGuard, Output Validator의 기준이 된다.
- 금융 표현 정책을 일관되게 만든다.
- Runtime이 Lens 문서만 읽고 위험한 행동 지시를 생성하는 것을 막는다.

현재 Gap:

- Input Guard, Generation Guard, Output Guard의 실행 Contract 연결
- 금지 표현만이 아니라 의미 기반 위반 Fixture
- PolicyGuard Version과 Lens Version의 Compatibility
- 위반 시 차단·재작성·로그 정책
- False Positive / False Negative Regression

---

## 11. Runtime Contract

판정:

```text
Documented / Partial
```

목표 흐름:

```text
AnalysisRequest
→ ContextSnapshot
→ Lens Selection
→ LensRun
→ PolicyGuardRun
→ ChecklistResult
→ JournalCandidate
→ Human Review
```

현재 문서상 핵심 경계:

- Lens 정의와 Runtime 실행을 분리
- 문서 존재와 활성화를 분리
- Runtime 결과를 Candidate로 취급
- Human Review 전 Journal 확정 금지
- Development Task Tree를 Finance에 강제하지 않음

현재 Gap:

- Loader가 읽을 최소 Schema
- Lens Input / Output Contract
- Routing 결과 형식
- PolicyGuard 결과 형식
- Failure State
- Missing Context 처리
- Multiple Lens Composition 규칙
- Version Compatibility
- Runtime Activation Gate

---

## 12. Artifact Metadata Standard

판정:

```text
Defined Target Contract
Repository-wide Migration Incomplete
```

핵심 기능:

```text
영구 document_id
artifact_type
lifecycle_status
implementation_status
runtime_loadable
routable
fixture_refs
activation_gate
supersedes 관계
exposure_class
```

현재 적용 상태:

```text
신규 Product-MVP Lens 7개
= 주요 Envelope 적용

기존 Core Lens 10개
= legacy Metadata 사용
= document_id 미적용
= runtime_loadable / routable 미표기
= activation_gate 미적용
```

현재 가치:

- 파일 경로와 논리 Identity를 분리한다.
- Snapshot과 현재 Canonical을 구분한다.
- Fixture 접근과 User Routing을 구분한다.
- Report와 Handoff를 권위 문서로 오해하지 않도록 한다.
- 문서 상태와 Runtime 활성화 상태를 분리한다.

현재 Gap:

- 기존 Core Lens 10개 Metadata Backfill
- 전체 17개 `document_id` Registry 검증
- `document_id` 중복 검증
- `artifact_type`과 경로 계층 검증
- Deprecated 문서 참조 검증
- `fixture_refs` 존재 검증
- `runtime_loadable` / `routable` 조합 검증
- CI Validator

## 13. New Lens 7

판정:

```text
Authored / Canonically Placed
```

포함:

```text
ETF / Index Structure
Bond
Semiconductor Cycle
AI Compute Value Chain
Korea Equity Structure
US Equity Structure
Earnings Revision
```

현재 가치:

- Asset Class와 Domain Deep-Dive 구조를 실제 문서로 검증했다.
- 한국·미국 주식 구조 차이를 분리했다.
- 반도체와 AI Compute를 단순 종목 Lens가 아닌 Value Chain / Cycle 관점으로 확장했다.
- Earnings Revision을 실적 변화 판단 축으로 추가했다.

현재 Gap:

```text
Catalog
Routing
Fixture
Regression
Activation
```

신규 7개가 작성됐다는 이유로 즉시 Product Routing 대상이 돼서는 안 된다.

---

## 14. Product / Legal / Operations

판정:

```text
Documented / Partial
```

정책 정의 책임:

```text
서비스 제공 범위
금지 범위
Consent
Data Minimization
Retention
Deletion
Export
Access Control
Audit Policy
Market Data Source Policy
OCR / Image Policy
Marketing Language
Complaint Handling
```

현재 강점:

- 제품을 투자 판단 도구가 아닌 체크리스트·기록·복기 도구로 제한한다.
- 사용자 직접 입력 중심의 초기 범위를 채택한다.
- 계좌연동과 자동매매를 초기 범위에서 제외한다.
- OCR과 Market Data를 Local Experiment 필수 Gate에서 제외한다.
- Finance 데이터와 Development Metadata를 분리한다.

현재 Gap:

- 최종 법률 검토
- 실제 Consent UI
- Retention 기간
- User Deletion SLA
- Export 형식
- Market Data License 검증
- LLM Provider 데이터 처리 계약
- Incident / Complaint Runbook

---

## 15. Professional Standards and Human Review

판정:

```text
기준 Commit:
Professional Standards / Human Review
= canonical 범위에 없음

최신 main:
06-professional-standards
= Canonical

Human Review Protocol
= Documented-only
```

목표:

```text
금융 결과의 품질 기준
전문가 검토 절차
근거 수준
불확실성 표현
검토자 책임
승인·반려·수정
```

구분:

```text
Professional / Artifact Human Review
= 문서·응답·Release-facing 검토
= 최신 06 Contract에 존재

End-user JournalCandidate Human Review
= 사용자가 Candidate를 수정·확정·거부하는 Product Runtime
= 구현 미확인
```

중요 원칙:

- Lens 작성 완료와 Professional Approval은 다르다.
- Runtime Fixture 통과와 전문가 검토는 다르다.
- Human Review Protocol은 PolicyGuard와 대체 관계가 아니다.
- Professional Review와 Journal Review를 같은 Contract로 합치지 않는다.
- Reviewer 결과도 Candidate이며 Canonical 승격 절차가 필요하다.

현재 Gap:

- Professional Review Pilot
- 실제 Review Evidence
- Sign-off 기록
- End-user Journal Review Contract
- 주기적 재검토 기준
- 시장 구조 변화 시 재검토 Trigger
- 법률 Review와 금융 전문 Review 분리

# Part II. Partial or Missing Product-MVP Assets

## 16. Lens Catalog

판정:

```text
기준 Commit: Partial
최신 main: 17개 key 등록 / 신규 7개 inactive
```

Catalog가 소유해야 하는 것:

```text
lens_id
document_id
display_name
category
owner
purpose
supported_questions
required_context
prohibited_use
lifecycle_status
implementation_status
runtime_loadable
routable
fixture_refs
activation_gate
version
```

기준 Commit 상태:

```text
기존 Core Lens 10개만 Catalog에 정의
신규 7개는 Catalog 미등록
```

최신 main 상태:

```text
신규 7개 Lens key와 canonical path 등록 완료
신규 7개는 catalog-known / routing-inactive
```

현재 Gap:

- 기존 Core Lens 10개 Metadata Backfill
- 17개 `document_id`·path·category·상태 정합성
- 신규 7개 `fixture_refs` 연결
- 신규 7개 Regression Activation
- `runtime_loadable` / `routable` 전환 기준
- Deprecated Lens 제외
- Duplicate Purpose 검출
- Human-readable Name과 `document_id` 구분

Catalog 등록은 Runtime 활성화를 의미하지 않는다.

## 17. Routing Contract

판정:

```text
Partial
```

Routing의 목표:

```text
User Question
+ Available Context
+ Product Policy
→ Lens Candidate
→ Human 또는 Runtime Selection
```

Routing이 하지 않는 것:

```text
매수·매도 판단
수익률 예측
활성화되지 않은 Lens 선택
Fixture 없는 Lens의 무조건 선택
Development Skill Routing 재사용 강제
```

필요한 Routing 정보:

```text
intent
asset class
market
industry
time horizon
question type
required evidence
safety flags
selected lens candidates
selection reason
missing context
```

현재 Gap:

- Positive Routing Fixture
- Negative Routing Fixture
- Multi-Lens Conflict
- No-match
- Ambiguous Question
- Unsafe Intent Redirect
- Missing Context
- Deprecated Lens Exclusion
- Activation Gate Enforcement

---

## 18. Fixture

판정:

```text
기준 Commit:
- 기존 Core Lens 10개용 Routing / PolicyGuard Fixture Contract 존재
- 신규 7개 fixture_refs 비어 있음
- 실행 가능한 Fixture Runner 미확인

최신 main:
- 신규 7개 소재의 Risk / Data Grounding Fixture 추가
- Adversarial coverage 추가
- 신규 Lens Safe Routing / Output / Missing Context /
  Journal Conversion Fixture는 미완료
- 신규 7개 fixture_refs는 계속 빈 목록
```

Fixture 유형:

```text
Routing Fixture
Lens Input / Output Fixture
PolicyGuard Fixture
Red-team Fixture
Missing Context Fixture
Ambiguous Question Fixture
Truthfulness Fixture
Journal Conversion Fixture
Review Fixture
```

Lens별 최소 Fixture:

```text
정상 질문
경계 질문
잘못된 대상 질문
필수 Context 누락
추천성 질문
근거 부족
상충 Evidence
오래된 데이터
```

Fixture가 없는 Lens는 문서로 존재하더라도 Runtime Activation 대상이 아니다.

Risk 소재 Fixture가 있다는 사실만으로 Lens-specific Activation Fixture가 완료된 것은 아니다.

## 19. Regression

판정:

```text
기준 Commit:
PolicyGuard Alignment Report와 Red Team Contract는 존재
신규 7개 Lens Regression Coverage Matrix와 실행 Runner는 없음

최신 main:
Inactive Product-MVP Lens 7개용 Regression Coverage Matrix 존재
단, activation record가 아니며
safe content routing과 Lens-specific response validation은 deferred

실행 가능한 Regression Runner와 Runtime Gate는 여전히 미확인
```

필요 Regression:

```text
Routing Regression
PolicyGuard Regression
Output Structure Regression
Forbidden Language Regression
Evidence / Assumption Separation
Lens Version Regression
Catalog Reference Regression
Metadata Validation
Exposure Validation
Activation Gate Regression
```

Regression 실패 시:

```text
Runtime 활성화 차단
Routable 상태 해제
Candidate 유지
Human Review 요청
```

문서 자체를 자동 수정하지 않는다.

최신 상태 Drift:

```text
최신 Fixture의 PI-04
= BLOCK_PROMPT_INJECTION

기존 Alignment Report의 PI-04
= 과거 REFUSE_AND_REDIRECT 기록 유지
```

Alignment Report는 기준 시점을 명시하거나 `superseded` 상태를 표시해야 한다.

## 20. Activation Gate

판정:

```text
Missing or Not Closed
```

Lens 활성화 최소 조건:

```text
Canonical Document
Valid Metadata
Catalog Registration
Routing Rule
Positive Fixture
Negative Fixture
PolicyGuard Compatibility
Regression Pass
Exposure Allowed
Owner Review
```

권장 상태 흐름:

```text
documented
→ cataloged
→ fixture-linked
→ regression-verified
→ runtime-loadable
→ routable
→ activated
```

각 상태는 자동으로 다음 상태를 의미하지 않는다.

---

## 21. Local Finance Experiment

판정:

```text
Designed / Not Closed E2E
```

최소 실험:

```text
Manual AnalysisRequest
→ Selected Lens
→ PolicyGuard Check
→ ChecklistResult
→ JournalCandidate
→ Human Review
```

기본 입력:

```text
User Text Input
Manual Market Context
```

필수 성공 조건:

- 질문을 Checklist로 변환
- 적용 Lens와 이유 표시
- Context 부족 표시
- 추천성 표현 차단
- ChecklistResult 생성
- JournalCandidate 생성
- 사용자 수정 후 확정
- 당시 판단과 사후 결과 분리
- Development Repository 개념 없이 동작

필수가 아닌 것:

```text
OCR
Image Storage
Real-time Market Data
Broker Account
Portfolio Sync
Paid Entitlement
Finance Cloud Backend
```

---

# Part III. Runtime and Product Physicalization

## 22. Finance Runtime

현재 판정:

```text
Future / Not Verifiable
```

목표 책임:

```text
Contract Loader
Catalog Loader
Routing Engine
Lens Executor
PolicyGuard
Output Validator
Activation Gate
Audit Evidence
```

현재 문서만으로 확인할 수 없는 것:

- 실제 Loader 구현
- 실제 Routing 구현
- PolicyGuard Runtime
- Output Validator 실행
- Lens Version Pinning
- Fixture Runner
- Regression Runner
- Audit Log
- Failure Recovery

미구현 자체는 현재 구조 충돌이 아니다.

---

## 23. Finance Product Backend

현재 판정:

```text
Future / Not Verifiable
```

목표 Domain:

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
FinanceUsage
FinanceEntitlement
```

목표 데이터 경계:

```text
finance_db
```

금지:

```text
Development DB 직접 조회
Identity DB 직접 조회
Cross-service Foreign Key
Shared Core 공용 DB
Repository / Worktree 모델 상속
```

초기 물리화:

```text
Modular Monolith first
```

초기부터 다음을 Microservice로 분리하지 않는다.

```text
Lens Service
Journal Service
Review Service
PolicyGuard Service
```

---

## 24. Identity and Entitlement

Finance Product에 필요한 Identity:

```text
User
Authentication
Token
Common Membership if required
```

Finance가 소유할 수 있는 Product 권한:

```text
Premium Lens Access
Analysis Limit
Journal Limit
Review Limit
Usage / Quota
```

구분:

```text
Identity
= 사용자가 누구인가

Finance Entitlement
= 어떤 Finance 기능을 사용할 수 있는가

PolicyGuard
= 어떤 표현과 결과가 허용되는가
```

Finance Contract MVP와 Local Finance Experiment는 Identity 완성을 기다리지 않는다.

---

## 25. Data Policy Enforcement

정책 정의:

```text
finance-harness-docs
```

Runtime 집행:

```text
finance-harness
```

공통 인증 증적:

```text
Shared Identity
```

Runtime이 보관해야 할 증적 후보:

```text
Consent version
Deletion result
Export event
Journal access history
PolicyGuard violation
Lens version
Context timestamp
Human review state
Audit event
```

현재 구현 여부는 확인되지 않는다.

---

# Part IV. Product-MVP Readiness

## 26. Product-MVP 정의

Finance Product-MVP는 단순히 Lens 17개가 존재하는 상태가 아니다.

최소 완료 정의:

```text
Core Rules
+ Safety
+ Runtime Contract
+ Lens 17
+ Catalog
+ Routing
+ Fixture
+ Regression
+ PolicyGuard
+ Activation Gate
+ Local Finance Experiment
+ Human Review
```

Product Backend와 결제 기능은 별도 단계다.

---

## 27. Readiness Matrix

| 완료 축 | 기준 Commit | 최신 main | MVP Blocking |
|---|---:|---:|---:|
| Product Positioning | Complete | Complete | Yes |
| Core Rules | Mostly Complete | Mostly Complete | Yes |
| Safety | Mostly Complete | Mostly Complete | Yes |
| Runtime Contract | Partial | Partial | Yes |
| Lens Inventory 17 | Complete | Complete | Yes |
| Lens Documents | Complete by document scope | 동일 | Yes |
| Catalog | 기존 10개 | 17 key 등록 | Yes |
| Routing | 기존 10개 | 신규 7개 inactive | Yes |
| Fixture | 신규 7개 비연결 | Risk 소재 부분 보강 | Yes |
| Regression | 문서 중심 | Matrix 존재 / Runner 미완료 | Yes |
| PolicyGuard Contract | Documented / substantial | 동일 | Yes |
| Output Validator | Contract-only | 동일 | Yes |
| Metadata Standard | Target defined | Core 10 Backfill 필요 | Yes |
| Exposure Policy | 일부 적용 | 일부 적용 | Yes |
| Activation Gate | Gate ID만 존재 | 실행·승인 기록 없음 | Yes |
| Professional Standards | canonical 아님 | Canonical | Yes |
| Human Review Protocol | canonical 아님 | Contract-only | Yes |
| Local Finance Experiment | Not Closed | Not Closed | Yes |
| Finance Backend | Future | Future | Product phase |
| Identity Integration | Future | Future | Product phase |
| Billing / Entitlement | Future | Future | Commercial phase |

## 28. 추정 진척률

### 기준 Commit `8d38aed` 계획 추정

```text
Knowledge Document Completion
= 약 60~70% (대표값 65%)

Runtime-ready Product-MVP
= 약 30~40% (대표값 35%)
```

### 최신 main 계획 추정

```text
Knowledge Document Completion
= 약 75~85% (대표값 80%)

Runtime-ready Product-MVP
= 약 40~50% (대표값 45%)
```

이 수치는 문서 수나 코드 라인 수가 아니다.

다음 완료 Gate를 가중 평가한 계획용 범위다.

```text
Lens
→ Catalog
→ Routing
→ Fixture
→ Regression
→ PolicyGuard
→ Activation Gate
→ Human Review
→ Local E2E
```

### Cloud Finance Product

```text
설계 단계 / 구현률 산정 부적절
```

Backend가 아직 확인되지 않으므로 임의 구현률을 제시하지 않는다.

## 29. P0 Gap

Finance Contract MVP를 막는 항목:

```text
기존 Core Lens 10개 Metadata Backfill
17 Lens Registry 정합성
신규 7개 Safe Routing
신규 7개 Lens-specific Fixture
신규 7개 fixture_refs 연결
PolicyGuard Runtime 검증
Output Validator Runtime 검증
Executable Regression Runner 또는 반복 검증 절차
Activation Gate 실행·승인 기록
Runtime-loadable / Routable 판정
Local Finance Experiment E2E
End-user Journal Human Review 최소 Contract
05 Product / Legal / Operations canonical 책임 확정
```

## 30. P1 Gap

Product 품질을 높이는 항목:

```text
Alignment Report 최신화 또는 superseded 표기
Metadata CI Validator
Output Validator 강화
Red-team Case 확장
Professional Review Evidence
Exposure Policy 검증
Market Data Source Review
Consent / Retention 상세
Journal / Review Good-Bad Example
Lens Version Compatibility
Missing Context UX
```

## 31. P2 Gap

후속 확장:

```text
OCR
Image Input
Delayed Market Data
Watchlist
Premium Lens
Finance Usage / Quota
Cloud Journal Persistence
Cross-device Review
Professional Reviewer Workflow
Commodity Lens
```

---

# Part V. Recommended Work Sequence

## 32. Step 1 — Inventory Freeze

목표:

```text
Product-MVP Lens 17개와 상태를 하나의 Inventory로 고정
```

완료 조건:

- 신규 7개 `document_id` 확인
- 기존 Core Lens 10개 `document_id` Backfill
- 전체 17개 Registry 검증
- Category 확정
- Owner 확정
- 문서 경로와 `document_id` 연결
- Commodity 제외 확인
- Deprecated / Duplicate 제거

## 33. Step 2 — Catalog Completion

목표:

```text
Runtime과 사람이 동일 Lens 목록을 참조
```

완료 조건:

- 17개 전체 Catalog 등록
- 신규 7개 Metadata 연결
- runtime_loadable / routable 초기값
- fixture_refs 필드
- activation_gate 필드
- Exposure 분류

---

## 34. Step 3 — Routing Contract and Fixtures

목표:

```text
질문이 어떤 Lens 후보로 연결되는지 검증
```

최소 Fixture:

- Lens별 Positive 1개 이상
- Lens별 Negative 1개 이상
- Ambiguous
- No-match
- Unsafe Intent
- Missing Context
- Multi-Lens Candidate

Routing은 활성화되지 않은 Lens를 반환하지 않는다.

---

## 35. Step 4 — Lens and PolicyGuard Fixtures

목표:

```text
Lens 출력과 안전 경계를 검증
```

최소 검증:

- 출력 구조
- 근거와 가정 분리
- 데이터 시점 표시
- 추천성 표현 금지
- 목표가·손절가·수량·비중 금지
- Context 부족 표시
- JournalCandidate 변환 가능

---

## 36. Step 5 — Regression and Activation Gate

목표:

```text
문서 작성 완료를 Runtime 활성화와 분리
```

Activation 최소 조건:

```text
Metadata valid
Catalog registered
Routing fixture pass
Lens fixture pass
PolicyGuard fixture pass
Regression pass
Owner review
Exposure allowed
```

---

## 37. Step 6 — Local Finance Experiment

목표:

```text
Text / Manual Context만으로 전체 사용자 가치 검증
```

흐름:

```text
Question
→ Lens Candidate
→ Selection Reason
→ Checklist
→ PolicyGuard
→ JournalCandidate
→ Human Review
```

OCR과 Market Data는 제외한다.

---

## 38. Step 7 — Product Runtime Handoff

Local Experiment가 통과한 뒤 다음 구현 인계를 작성한다.

```text
Finance Runtime Contract
Catalog Loader
Routing Engine
Lens Executor
PolicyGuard
Output Validator
Journal / Review Domain
Audit Evidence
```

이 단계에서도 Development Worktree·Agent 모델을 재사용하지 않는다.

---

# Part VI. Risks

## 39. Lens 수량을 완료율로 오해

위험:

```text
17개 Lens 작성
= Product-MVP 완료
```

실제:

```text
Lens 작성
= Knowledge Asset 준비
```

대응:

```text
Catalog / Routing / Fixture / Regression / Activation을 Release Gate로 사용
```

---

## 40. 문서 존재를 Runtime Active로 오해

대응 Metadata:

```text
lifecycle_status
implementation_status
runtime_loadable
routable
activation_gate
```

Runtime은 디렉터리를 단순 순회해 모든 Markdown을 로딩하지 않는다.

---

## 41. PolicyGuard를 금지어 필터로 축소

위험:

- 우회 표현 탐지 실패
- 문맥상 추천성 표현 누락
- 정상 교육 답변 차단
- False Positive 증가

대응:

```text
Input Guard
Generation Guard
Output Guard
Semantic Fixture
Red-team Regression
```

---

## 42. Finance를 Development Runtime에 종속

금지:

```text
Repository
Branch
Commit
Worktree
Diff
WriterLease
AgentProcess
```

Finance는 Domain-neutral Request / Run / Result / Review 원칙만 공유한다.

---

## 43. Market Data와 OCR 조기 유입

위험:

- License와 재제공 문제
- 민감 이미지 저장
- 보안 범위 확대
- E2E 가치 검증 지연

대응:

```text
Text Input
+ Manual Market Context
```

로 먼저 Local Experiment를 완료한다.

---

## 44. Human Review 형식화

위험:

Human Review가 단순 버튼 승인으로 축소될 수 있다.

검토 대상:

```text
적용 Lens
근거
가정
누락 Context
PolicyGuard 결과
Checklist
JournalCandidate
```

사용자가 결과를 수정할 수 있어야 한다.

---

## 45. Knowledge Contract와 Runtime Drift

위험:

- 문서는 갱신됐지만 Runtime은 구버전 사용
- Catalog와 실제 Loader 불일치
- Fixture가 다른 Version 검증
- Deprecated Lens가 Routing됨

대응:

```text
document_id
version
fixture_refs
catalog reference
runtime loader version
activation record
```

---

# Part VII. Decisions and Open Issues

## 46. 확정된 판단

1. Finance의 제품 흐름은 Learn → Checklist → Journal → Review다.
2. 수익률 예측과 매수·매도 추천은 제품 목적이 아니다.
3. Product-MVP Lens는 현재 17개다.
4. 기존 Core 10개를 유지한다.
5. 신규 7개는 ETF/Index, Bond, Semiconductor, AI Compute, Korea Equity, US Equity, Earnings Revision이다.
6. Commodity는 P2 이후다.
7. Lens 작성과 Runtime 활성화를 분리한다.
8. Catalog, Routing, Fixture, Regression은 서로 다른 Contract다.
9. Finance Knowledge 원문은 `finance-harness-docs`가 소유한다.
10. Finance Runtime 실행과 Domain 데이터는 `finance-harness`가 소유한다.
11. Professional Standards와 Human Review는 별도 트랙이다.
12. Finance Contract MVP와 Local Experiment는 Development V2 전체에 종속되지 않는다.
13. Finance는 Development Repository·Worktree·Diff 모델을 상속하지 않는다.
14. OCR과 Market Data는 Local Experiment의 필수 Gate가 아니다.
15. PolicyGuard와 Human Review는 서로를 대체하지 않는다.
16. Cloud 또는 AI 결과는 Candidate이며 자동 Truth가 아니다.
17. Finance 데이터 정책 정의와 Runtime 집행을 분리한다.

---

## 47. 미결정 사항

1. 기존 Core Lens 10개의 최종 Display Name
2. 기존 Core Lens 10개의 `document_id` Backfill과 신규 7개를 포함한 전체 17개 Registry 검증
3. Lens Category의 최종 Enum
4. Runtime Loader 직렬화 형식
5. Routing Rule 표현 방식
6. Multi-Lens Composition 방식
7. Lens별 최소 Fixture 개수
8. Regression 실행 도구
9. PolicyGuard Runtime 구현 방식
10. Output Validator 구현 방식
11. Activation 승인 주체
12. Professional Reviewer 구성
13. Finance Local Experiment UI
14. Journal 저장 형식
15. Finance Product Backend 기술 스택
16. Market Data Provider
17. Finance Entitlement 모델
18. Consent와 Retention 구체 기간
19. OCR 도입 여부
20. Commodity Lens 도입 시점

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 48. 다음 문서에 제공하는 입력

### Finance Completion Criteria

```text
17 Lens Inventory
Catalog
Routing
Fixture
Regression
PolicyGuard
Activation Gate
Local E2E
Human Review
```

### Lens Catalog Contract

```text
lens_id
document_id
category
owner
purpose
status
runtime_loadable
routable
fixture_refs
activation_gate
exposure
```

### Routing Contract

```text
intent
context
candidate lens
selection reason
missing context
safety redirect
```

### Fixture Plan

```text
Routing
Lens Output
PolicyGuard
Red-team
Missing Context
Journal
Review
```

### Runtime Handoff

```text
Loader
Catalog
Router
Executor
PolicyGuard
Validator
Audit
```

---

## 49. 불변조건

1. Lens 문서 존재와 Runtime 활성화를 구분한다.
2. Product-MVP는 Lens 17개 작성만으로 완료되지 않는다.
3. Catalog, Routing, Fixture, Regression, Activation Gate가 필요하다.
4. Runtime은 모든 Markdown을 자동 로딩하지 않는다.
5. 활성화되지 않은 Lens를 Routing하지 않는다.
6. PolicyGuard 실패 결과를 사용자 응답으로 승격하지 않는다.
7. Human Review 전 JournalCandidate를 Journal로 확정하지 않는다.
8. 실행 근거와 가정을 구분한다.
9. 데이터 시점과 출처를 표시한다.
10. Finance는 Development 실행 모델을 상속하지 않는다.
11. Finance Contract MVP는 Development V2 전체를 기다리지 않는다.
12. OCR과 Market Data는 초기 E2E 필수가 아니다.
13. Finance 정책 문서는 `finance-harness-docs`가 소유한다.
14. Runtime 집행과 Audit Evidence는 `finance-harness`가 소유한다.
15. Product Domain 데이터는 `finance_db` 경계를 가진다.
16. Shared Core를 이유로 공용 DB를 만들지 않는다.
17. Professional Standards와 Human Review를 Lens 작성 완료로 대체하지 않는다.
18. Candidate를 자동 Canonical Truth로 승격하지 않는다.
19. Historical Snapshot과 최신 main 상태를 혼합하지 않는다.
20. 신규 7개 Metadata 적용을 전체 17개 Migration 완료로 간주하지 않는다.
21. Professional Artifact Review와 End-user Journal Review를 구분한다.
22. Regression Matrix 존재를 Activation 완료로 간주하지 않는다.

## 50. 관련 문서

```text
docs/master/product-architecture-master.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/architecture/local-cloud-human-boundary.md
docs/roadmap/product-roadmap.md
docs/product/development-harness-report.md
Finance Completion Criteria
Status: planned document

Finance Lens Catalog Contract
Status: planned document

Finance Routing Contract
Status: planned document

Finance Fixture Plan
Status: planned document

Finance Runtime Implementation Handoff
Status: planned document

docs/decisions/decision-log.md
```

---

## 51. 검수 관점

### Finance Knowledge Architecture

- 00~06 계층과 실제 Repository가 일치하는가
- Product-MVP Lens 17개 판정이 정확한가
- 신규 7개의 작성·배치 상태가 정확한가
- Catalog·Routing·Fixture·Regression Gap이 정확한가
- Metadata와 Activation 상태 구분이 맞는가

### Finance Product

- Learn→Checklist→Journal→Review가 유지되는가
- 추천·예측 제품으로 오해될 표현이 없는가
- Local Experiment 최소 범위가 적절한가
- Journal과 Review의 Human 책임이 유지되는가

### 하네스 메인 브랜치

- Finance가 독립 Extension으로 유지되는가
- Development 전용 Runtime 개념이 유입되지 않았는가
- Shared Core와 Commercial Capability 경계가 맞는가
- Finance Contract 작업이 Development V2에 종속되지 않는가

### 구현 인계

- Runtime 팀이 Catalog·Routing·Fixture·Activation Gate를 이해할 수 있는가
- 문서 존재와 Runtime 활성화를 구분할 수 있는가
- P0 Gap이 구현 순서로 변환 가능한가
