---
title: Local, Cloud, and Human Responsibility Boundary
status: draft
implementation_status: mixed
owner: product
last_reviewed: 2026-07-14
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0001
  - ADR-0002
  - ADR-0005
  - ADR-0006
  - ADR-0008
  - ADR-0010
source_inputs: []
---

# Local, Cloud, and Human Responsibility Boundary

## 1. 문서 목적

이 문서는 `oh-my-ai` 제품군에서 다음 책임 경계를 정의한다.

1. 반드시 Local에 남아야 하는 데이터와 실행은 무엇인지
2. Cloud가 처리할 수 있는 데이터와 기능은 무엇인지
3. 사람이 직접 승인·수정·거부해야 하는 단계는 무엇인지
4. V1, V2, V3에서 책임 경계가 어떻게 달라지는지
5. Development Harness와 Finance Harness가 같은 원칙을 어떻게 다르게 구현하는지
6. Metadata-only, Reviewed Handoff, Full Context 전송을 어떻게 구분하는지
7. Auth, Entitlement, Billing이 Local 실행과 어떻게 분리되는지
8. Sidecar, Remote Execution, Managed Memory가 언제 허용되는지
9. 장애·구독 만료·Cloud 불가 상태에서도 어떤 기능이 유지돼야 하는지
10. AI·Cloud·Runtime 결과가 Human Review 없이 Truth로 승격되지 않도록 하는 기준

이 문서의 목적은 모든 기능을 Local 또는 Cloud 한쪽으로 몰아넣는 것이 아니다.

정확한 목적은 다음과 같다.

> 원문과 실행은 기본적으로 Local에 두고, Cloud는 명시적으로 허용된 Metadata·관리·후보 생성만 담당하며, 중요한 판단과 승격은 사람이 통제한다.

---

## 2. 핵심 결론

```text
Local
= 원문 Context
+ Development Repository와 사용자 Local 데이터
+ Runtime 실행
+ Secret
+ 직접 수정
+ 검증
+ Local Artifact
```

```text
Product Domain Service
= 명시적 정책과 동의에 따라 저장되는
Finance Journal·Review 등 Product-owned Domain Data
```

```text
Cloud
= Identity
+ Entitlement
+ 선택된 Metadata
+ 관리형 Task 관계
+ Candidate 생성
+ Ranking / Recommendation
+ 조직 정책
```

```text
Human
= 전송 승인
+ Scope 승인
+ 실행 승인
+ 결과 검수
+ Truth 승격
+ 데이터 삭제·보존 선택
+ 위험 Override
```

기본 원칙:

```text
Local-first
Cloud-optional by stage
Human-controlled
Explicit transmission
Candidate before truth
Fail-safe and fail-local
```

---

## 3. 세 책임 주체

## 3.1 Local Responsibility

Local은 사용자의 실행 환경과 원문 데이터를 소유한다.

Development 예:

```text
Repository
Source Code
Local Documents
Branch / Commit
Worktree
Diff
Shell Command
Validation Output
Runtime Credential
Provider CLI Session
Local Handoff / Result Artifact
```

Finance 예:

```text
사용자 입력 원문
로컬 실험용 Context
수동 Market Context
Journal Draft
사용자 첨부 원본
Local PolicyGuard 결과
```

Local은 Cloud 기능을 사용하더라도 원문 데이터의 기본 소유 위치다.

## 3.2 Cloud Responsibility

Cloud는 관리·상업·후보 생성·조직 기능을 담당할 수 있다.

```text
User Identity
Device Identity
Subscription
Entitlement
Usage / Quota
Task Metadata
Session Binding Metadata
Result Metadata
Candidate Ranking
Runtime Recommendation
Approval Queue
Organization Policy
Audit Metadata
```

Cloud가 데이터를 처리할 수 있다는 사실은 모든 원문 데이터를 전송해도 된다는 의미가 아니다.

## 3.3 Human Responsibility

해당 데이터와 정책 범위에 대해 권한을 가진 Human Actor는 다음 최종 권한을 유지한다.

Human Actor는 개인 사용자, Project Owner, Organization Administrator 또는 법적 Retention 권한자일 수 있다.

하위 범위의 Human Actor는 상위 조직 정책을 더 위험한 방향으로 완화할 수 없다.

```text
무엇을 Cloud로 보낼지 결정
어떤 Scope를 Worker에게 허용할지 결정
고위험 명령 실행 승인
Result Accept / Edit / Reject
Candidate Promotion 승인
문서와 Runtime 활성화 구분
데이터 보존·삭제·내보내기 선택
Policy Override 책임
```

Human Review는 단순 UI 단계가 아니라 제품 불변조건이다.

---

## 4. 기본 데이터 분류

모든 데이터는 전송 전에 최소 다음 범주로 분류한다.

| 분류 | 의미 | 기본 위치 | Cloud 전송 |
|---|---|---|---|
| Secret | Token, API Key, Credential, Private Key | Local only | 금지 |
| Raw Source | Source Code, 원문 문서, 전체 대화, 전체 Journal | Local | 기본 금지 |
| Sensitive Domain Data | 금융 기록, 개인 메모, 사용자 행동 원문 | Product Domain | 명시적 정책 필요 |
| Reviewed Artifact | 사람이 검수한 Handoff, Result, Checklist, JournalCandidate | Local / Product Domain | 명시적 승인 후 가능 |
| Metadata | ID, 상태, Timestamp, Runtime 종류, Hash | Local + Cloud 가능 | 정책 범위 내 가능 |
| Candidate | Ranking, 추천, 연결 후보 | Cloud 또는 Local | Truth로 자동 승격 금지 |
| Canonical Decision | 승인된 결정, 정책, 문서 | Source of Truth | 승인된 경로만 |
| Telemetry | 기능 사용·성공·실패 메타데이터 | Local buffer / Cloud | 원문 제외 조건 |
| Product Announcement | 제품 공지 Manifest, 공지 본문 | Remote → Local Cache | 수신 전용. 사용자 데이터 송신 없음 |

분류되지 않은 데이터는 Raw Source로 취급한다.

`Product Announcement`는 방향이 반대인 유일한 분류다.

```text
다른 분류
= Local 데이터를 Cloud로 보낼지 판단

Product Announcement
= Remote 정적 데이터를 Local로 읽어올지 판단
```

Product Announcement 수신은 사용자 데이터 전송이 아니므로 Telemetry로 분류하지 않는다.

---

## 5. 기본 전송 모드

제품군 공통 명칭은 `Reviewed Artifact`를 사용한다.

Development의 `Reviewed Handoff`와 Finance의 `Reviewed Checklist`·`JournalCandidate`는 이 공통 범주의 Domain별 구현이다.

제품은 최소 다음 전송 모드를 구분한다.

## 5.1 Local-only

```text
원문 전송 없음
Cloud 호출 없음
Local Artifact만 사용
Local Runtime만 실행
```

적용:

- V1 기본값
- Offline 사용
- 민감 Repository
- 사용자가 Cloud를 원하지 않는 경우

## 5.2 Metadata-only

```text
Task ID
Run ID
Status
Runtime Type
Timestamp
Result 존재 여부
Validation 상태
Redacted Error Code
```

원문 Prompt, Source Code, 전체 Diff, 전체 Journal은 보내지 않는다.

적용:

- V2 Managed Workflow 기본 후보
- Usage / Quota
- Device / Entitlement
- Task Linking Metadata

## 5.3 Reviewed Artifact

사람이 검수한 구조화 Artifact만 전송한다.

Development 예:

```text
Reviewed Handoff
Redacted Result Summary
```

Finance 예:

```text
Reviewed Checklist
JournalCandidate
Review Summary
```

공통 필드 예:

```text
Goal 또는 Request
Scope
Confirmed Facts
Assumptions
Open Issues
Validation 또는 Policy Summary
Redacted Result Summary
```

적용:

- Cloud Candidate 생성
- Parent–Child Task 연결
- Cross-device 전달
- 관리형 Review

## 5.4 Full Context Opt-in

원문 또는 광범위한 Context 전송은 명시적 Opt-in이 있을 때만 허용한다.

요구 조건:

```text
전송 범위 표시
전송 목적 표시
수신자 표시
보존 기간 표시
삭제 경로 표시
민감정보 Redaction
재사용 여부 표시
사용자 확인
```

Full Context는 기본값이 아니다.

V1에는 포함하지 않는다.

## 5.5 Inbound Announcement Read

위 5.1~5.4는 Local 데이터의 송신 모드다.

이 모드는 방향이 반대이며 별도로 구분한다.

```text
정적 Remote Manifest에 대한 읽기 전용 HTTPS 요청
Request Body에 사용자 데이터 없음
응답은 Local Cache에만 기록
```

전송 금지:

```text
Prompt
Task
Repository 이름
Git Remote
작업 경로
Branch / Commit
Candidate
Artifact
사용자 코드
Machine ID
Account 식별자
```

Audience 판정은 Local에서 수행한다.

서버가 사용자별 대상을 계산하지 않는다.

Network Metadata 노출:

```text
Client IP Address
요청 시각
요청 Header
TLS 협상 Metadata
요청 대상 경로
```

이는 HTTPS 요청의 일반 속성이며 제품이 수집·전송하는 데이터가 아니다.

이 사실을 Public 문서에서 축소하지 않는다.

전체 Opt-out이 이 노출을 제거하는 유일한 수단이다.

적용:

```text
V1 Local Product Notice Channel
```

이 모드는 Cloud Account, Auth, Entitlement, Control Plane을 도입하지 않는다.

```text
Inbound Announcement Read
≠ Metadata-only 전송
≠ Telemetry
≠ Cloud Sync
≠ Managed Workflow
```

---

## 6. V1 책임 경계

## 6.1 V1 기본 구조

```text
Local-only
Artifact-based
Human-controlled
No Account
No Cloud Dependency
```

흐름:

```text
Work-start
→ Local Candidate Artifact
→ Human Review
→ Structured Handoff
→ 사용자가 Runtime 직접 실행
→ Result Basic
→ Human Review
→ 수동 반영
```

## 6.2 V1 Local 책임

```text
설치
Context 탐색
Skill Routing 후보 계산
Handoff 생성
Runtime Instruction Projection
사용자 직접 Runtime 실행
Result Basic 생성
Validation 기록
Local Usage Log
Product Notice Cache 및 사용자 선택 State 관리
Notice Audience Match 판정
```

## 6.3 V1 Cloud 책임

없음.

V1은 Cloud 없이 전체 Workflow를 완료할 수 있어야 한다.

Local Product Notice Channel은 이 진술을 바꾸지 않는다.

```text
Notice Manifest Host
= 정적 파일 제공 지점

Cloud 책임
= 사용자 데이터 보관, 상태 관리, 인증, 실행 조정
```

Manifest Host는 사용자 데이터를 받지 않고, 상태를 보관하지 않으며,
사용자별 판정을 수행하지 않는다.

따라서 Cloud 책임 주체가 아니다.

Notice는 다음 조건을 모두 만족하므로 V1의 Cloud-independent 성질을 유지한다.

```text
실패해도 Workflow가 완료된다
opt-out해도 Workflow가 완료된다
Network가 없어도 Workflow가 완료된다
Account와 Auth를 요구하지 않는다
```

Notice가 이 조건 중 하나라도 위반하면 Cloud 의존으로 재분류하고
별도 Product Decision을 요구한다.

## 6.4 V1 Human 책임

```text
Handoff 내용 확인
Scope / Do Not Touch 확인
Runtime 선택
실행 여부 결정
Result 검수
검증 결과 확인
Repository 또는 Main Session 반영
```

## 6.5 V1에서 금지되는 것

```text
Cloud Account 필수
Auth 필수
Task ID Server 발급
자동 Prompt 전달
자동 Result 회수
자동 Context 업로드
자동 Memory 저장
자동 Truth 승격
사용자 승인 또는 명시적으로 선택한 Execution Mode의 범위를 벗어난 자동 Repository 수정
```

---

## 7. V2 Local Invocation PoC 책임 경계

## 7.1 목적

Local Runtime 실행과 Result 수집이 가능한지 검증한다.

Auth와 Cloud 상용 기능을 선결 조건으로 두지 않는다.

## 7.2 Local 책임

```text
Local Task File 생성
local_correlation_id 발급
Runtime Process 실행
Initial Prompt 전달
Process 상태 수집
Result 파일·출력·Diff 수집
Failure / Timeout 기록
Human Review Surface 제공
```

## 7.3 Cloud 책임

PoC에는 필수 Cloud 책임이 없다.

선택적으로 비식별 PoC Metadata를 수집할 수 있으나, PoC 성공 조건에 포함하지 않는다.

## 7.4 Human 책임

```text
Runtime 실행 승인
Task File 검수
Result 누락·부분 결과 확인
Accept / Edit / Reject
PoC 결과를 정식 Contract에 반영할지 결정
```

## 7.5 Identifier 경계

```text
local_correlation_id
= PoC 실행 귀속

provider_session_id
= Adapter Metadata

session_binding_id
= V2 Managed Workflow의 정식 관리형 식별자
```

PoC 식별자를 영구 Global Identity로 승격하지 않는다.

---

## 8. V2 Managed Workflow Technical Core

## 8.1 Local 책임

```text
Runtime 실행
Repository / Local Context 접근
Local Result 수집
Diff / Validation 생성
Local Secret 보관
Local Policy Enforcement
Redaction
Local Artifact Import / Export
```

## 8.2 Cloud 또는 Managed Metadata 책임

기술 Core에서는 다음을 관리할 수 있다.

```text
Task Identity
Parent–Child Link
SessionBinding Metadata
ExecutionRun Metadata
ResultArtifact Metadata
Local Device Reference
Entitlement Extension Point
Review State
```

이 단계의 Local Device Reference는 User-bound Device Registration이 아니다.

이 단계의 Entitlement Extension Point는 Subscription 또는 Billing 기반 권한 계산이 아니다.

## 8.3 Human 책임

```text
Task Scope 승인
Runtime 선택 또는 Override
고위험 실행 승인
Result Candidate 검수
부모 Task 반영 승인
Context 전송 범위 결정
```

---

## 9. V2 Commercial Launch 책임 경계

## 9.1 Cloud 책임

```text
User
Authentication
User-bound Device
Plan
Subscription
Billing
Entitlement
Usage / Quota
Package Manifest
License Renewal
Feature Gate
조건부 Package Channel
조건부 Offline Grace
```

## 9.2 Local 책임

```text
Credential 안전 저장
Entitlement 결과 캐시
Local Runtime 실행
Local Repository 보호
Offline Local V1 유지
Premium 기능 Gate 적용
사용자 데이터 보존
```

## 9.3 Human 책임

```text
로그인 및 기기 등록
데이터 전송 설정
Subscription 관리
삭제·내보내기
Premium 실행 승인
Account Closure 확인
```

## 9.4 Community와 Commercial Access 경계

V2 CLI 업데이트는 Login 또는 Subscription과 동일하지 않다.

```text
Update
≠ Login

Login
≠ Subscription

Authentication
≠ Entitlement

Community Access
≠ Authentication Required
```

Anonymous Community는 Cloud·Billing·Entitlement 서버 장애와 무관하게
Local Manual Workflow를 계속 사용할 수 있어야 한다.

Signed-in Free는 Product-facing 상태다.
내부 Architecture는 후속 Decision에서 최소 다음 축을 분리해야 한다.

```text
Identity:
anonymous | authenticated

Commercial Access:
community | trial | pro | future power
```

이 문서는 위 축을 구체 State Schema로 확정하지 않는다.

## 9.5 Commercial Failure Isolation

다음은 유지한다.

```text
Billing 장애
↛ V1 Local 기능 차단

Entitlement 서버 장애
→ 조건부 Grace 또는 Premium 제한

구독 만료
→ Premium 신규 실행 제한
→ 사용자 Local 데이터 유지
→ V1 Community 계속 사용

Account Closure
→ Cloud 데이터 삭제 절차
→ Local Repository 자동 삭제 금지
```

Entitlement는 사용권 관리다.

```text
Entitlement
≠ Local 데이터 소유권
≠ 사용자 파일 삭제 권한
≠ 핵심 IP 완전 보호 수단
```

---

## 10. V2 Managed Intelligence 책임 경계

## 10.1 Cloud가 생성할 수 있는 것

```text
Task Linking Candidate
Context Selection Candidate
Skill Ranking
Runtime Recommendation
Conflict Candidate
Result Review Candidate
Approval Queue Candidate
Memory Candidate
Automation Candidate
```

## 10.2 Cloud가 직접 확정할 수 없는 것

```text
Confirmed Fact
Confirmed Decision
Canonical Memory
Production Skill
Repository Merge
Finance Journal
Policy Override
```

## 10.3 Human Promotion

```text
Cloud Candidate
→ Evidence 표시
→ Human Review
→ Accept / Edit / Reject
→ Canonical Promotion
```

Ranking 또는 Recommendation 실패는 기본 Local Workflow를 막지 않아야 한다.

---

## 11. V3 Team / Enterprise 책임 경계

## 11.1 Cloud / Organization 책임

```text
Workspace
Project
Organization
RBAC
SSO
Organization Policy
Project Policy
Approval Workflow
Team Audit
Retention Policy
Policy Override Audit
```

## 11.2 Local 책임

```text
Repository 원문
Local Runtime
Local Secret
Local Validation
Local Redaction
Organization Policy의 Local Enforcement
```

## 11.3 Human 책임

```text
조직 관리자 정책 승인
Project Owner Context 승인
고위험 예외 승인
Audit 검토
Retention / Legal Hold 결정
사용자·조직 권한 변경
```

개인 사용자, Project Owner, Organization Administrator, 법적 Retention 권한자의 권한 범위는 동일하지 않다.

승인과 삭제 권한은 해당 데이터·정책의 소유 범위에 따라 제한한다.

조직 정책은 사용자보다 더 위험한 방향으로 Override될 수 없다.

예:

```text
Organization Policy: Source Upload 금지
User Setting: Source Upload 허용
→ 거부
```

---

## 12. Development Harness 경계

## 12.1 Local에 남아야 하는 것

```text
Repository 원문
Branch / Commit
전체 Diff
전체 Command Output
Runtime Credential
Provider CLI Session
Secret
Worktree
Local Path
검증 로그 원문
```

## 12.2 Cloud로 보낼 수 있는 Metadata 후보

```text
Repository logical reference
Commit hash
Task / Run ID
Runtime type
Validation status
Files changed count
Redacted error category
Result existence
Review state
```

실제 파일 경로와 Branch 이름은 민감정보가 될 수 있으므로 기본 Metadata에 자동 포함하지 않는다.

## 12.3 Reviewed Handoff 후보

```text
Goal
Scope
Do Not Touch
Confirmed Facts
Assumptions
Open Issues
Validation Summary
Redacted Diff Summary
```

## 12.4 Local 실행 우선

Development Runtime은 사용자가 로컬에서 인증한 공식 CLI 또는 공식 SDK/API를 사용한다.

`oh-my-ai`는 기본적으로 다음을 하지 않는다.

```text
Provider OAuth Token 복사
Provider Credential 중앙 저장
Consumer Subscription 재판매
Cloud에서 사용자 계정 대신 실행
```

---

## 13. Finance Harness 경계

Finance는 Development의 Local Repository 모델을 상속하지 않는다.

## 13.1 Finance Local Experiment

기본 입력:

```text
User Text Input
Manual Market Context
```

기본 책임:

```text
Local 또는 명시적 Product Session에서 입력 처리
Lens 선택
PolicyGuard 확인
ChecklistResult
JournalCandidate
Human Review
```

OCR, 이미지 저장, Market Data는 필수 Gate가 아니다.

## 13.2 Finance Product Cloud 책임

Finance Product가 물리화되면 다음 데이터는 `finance-harness`가 소유할 수 있다.

```text
AnalysisRequest
ContextSnapshot
LensRun
PolicyGuardRun
ChecklistResult
JournalCandidate
Journal
ReviewRecord
Finance Usage
Finance Entitlement
```

단, 정책 정의와 Runtime 집행을 구분한다.

```text
finance-harness-docs
= Consent / Retention / Deletion / Access / Audit Policy

finance-harness
= Storage / Access Control / Deletion / Audit Evidence 집행
```

## 13.3 Finance Human 책임

```text
사용자 질문 확인
JournalCandidate 수정
Journal 확정
Review 결과 수용 여부 결정
민감정보 저장 여부 선택
삭제·내보내기
```

AI는 사용자의 매수·매도 판단을 대신하지 않는다.

---

## 14. Secret과 Credential 경계

Secret은 항상 Local 또는 전용 Secret Store에 둔다.

금지:

```text
Prompt에 Token 포함
Handoff에 API Key 포함
Telemetry에 Secret 포함
Cloud Metadata에 Credential 원문 포함
ResultArtifact에 Private Key 포함
```

Provider Credential 원칙:

사용자 소유 Development Runtime Credential:

```text
사용자가 Provider에 직접 인증
Provider CLI 또는 공식 Credential Store가 보관
oh-my-ai는 가능하면 Credential 원문을 읽지 않음
```

Finance Backend 또는 Product Service가 소유하는 Provider Credential:

```text
Product 전용 Secret Store가 보관
사용자 Credential과 분리
Prompt, Telemetry, 일반 Metadata에 포함 금지
최소 권한과 Rotation 정책 적용
```

필요 시 Local Connector는 사용자 소유 Credential의 존재 여부만 확인한다.

---

## 15. Redaction 책임

Redaction은 전송 직전에 Local에서 수행하는 것을 기본으로 한다.

Redaction 대상 후보:

```text
Secret
Private Key
Email
Internal Hostname
Local Absolute Path
Customer Identifier
Ticket Confidential Field
Finance Sensitive Text
Account Number
Personal Note
```

Redaction 결과도 사람이 검수할 수 있어야 한다.

Cloud에서 Redaction을 전제로 Raw Source를 먼저 전송하는 방식은 기본 설계가 아니다.

---

## 16. Provenance 책임

모든 Artifact와 Candidate는 최소 Provenance를 가져야 한다.

Development:

```text
Repository logical reference
Commit
Runtime
Provider metadata
Files read
Files changed
Commands run
Validation performed / not performed
```

Finance:

```text
Context timestamp
Lens version
PolicyGuard version
Evidence source
Assumption
User edit
Review date
```

Cloud가 Candidate를 생성한 경우 다음을 표시한다.

```text
입력 범위
사용한 Version
생성 시각
Confidence 또는 제한
누락 Context
Human Review 상태
```

---

## 17. Human Review Gate

최소 Human Gate:

| 단계 | 사람의 결정 |
|---|---|
| Context Selection | 포함·제외·Redaction |
| Handoff | Scope·Do Not Touch·Facts 확인 |
| Runtime Execution | 실행·명령·Writer 권한 승인 |
| Result | Accept·Edit·Reject |
| Validation | 실제 실행 여부와 결과 확인 |
| Candidate | Canonical 승격 여부 |
| Data Transfer | Local-only·Metadata-only·Reviewed Artifact·Full Context 선택 |
| Retention | 저장·삭제·내보내기 |
| Policy Override | 위험과 책임 확인 |

다음은 Human Review를 대체하지 않는다.

```text
높은 Confidence
다수 Runtime의 동일 결론
자동 Validation Pass
Cloud Ranking 1위
관리자 기본값
```

---

## 18. Failure Behavior

## 18.1 Cloud 불가

```text
V1 Local Workflow 유지
Local Artifact 생성 유지
V1 Local Runtime과 Community 기능 유지
Cloud Candidate 기능만 제한
```

V1 Local Runtime과 Community 기능은 Cloud·Billing·Entitlement 상태와 무관하게 유지한다.

Premium Local 기능은 마지막으로 확인된 Entitlement, 명시된 Offline Grace 또는 제품별 Fail-closed 정책에 따라 신규 실행만 제한할 수 있다.

## 18.2 Result 누락

```text
result_missing
partial_result
manual_result_required
```

완료로 자동 처리하지 않는다.

## 18.3 Validation 실패

```text
validation_failed
```

Result는 Candidate로 남고 Confirmed Fact로 승격되지 않는다.

## 18.4 Metadata Sync 실패

Local Artifact를 삭제하지 않는다.

재시도 또는 수동 Export 경로를 제공한다.

## 18.5 Entitlement 확인 실패

지원하는 배포 모델이라면 Grace를 적용할 수 있다.

Grace 종료 후 Premium 신규 실행만 제한한다.

V1 Local 기능과 사용자 데이터는 유지한다.

---

## 19. Sidecar와 Background Runtime

Sidecar는 초기 V2 선결 조건이 아니다.

초기 실행:

```text
Local CLI
→ subprocess 실행
→ 상태 파일
→ Result 수집
```

Sidecar 도입 후보 시점:

```text
CLI 종료 후 장기 실행
여러 Worker 병렬 관리
PTY 재접속
Process Supervision
Session Restore
Remote SSH Runtime
Local Event Streaming
```

Sidecar 책임은 Local 실행 관리다.

```text
Worktree
Process
PTY
Diff
Result Collection
Cleanup
```

Cloud Intelligence 책임을 Sidecar에 내려 핵심 판단 로직을 복제하지 않는다.

---

## 20. Remote Execution

Remote Execution은 후기 V2 이후 후보이며 기본값이 아니다.

허용 전 조건:

```text
실행 위치 표시
Credential 경계
Source 전송 범위
Retention
Audit
Network Trust
사용자 승인
Result 회수 방식
삭제 방식
```

Remote 실행이 있더라도 Human Review와 Candidate 원칙은 유지한다.

---

## 21. Telemetry와 Usage

허용 가능한 기본 Telemetry 후보:

```text
기능 호출 종류
성공 / 실패
Runtime 종류
Version
지연 시간
Error Category
전송 모드
Validation 여부
```

기본 금지:

```text
Source Code
Prompt 원문
전체 Handoff
전체 Result
전체 Terminal Output
전체 Diff
Finance Journal 원문
Secret
```

Telemetry는 제품 개선과 Usage / Quota 목적을 분리해 표시한다.

Product Notice는 Telemetry가 아니다.

```text
Telemetry
= Local 사용 정보를 외부로 송신

Product Notice
= 정적 공지를 외부에서 수신
```

Notice 경로로 사용 정보를 함께 보내는 설계는 채택하지 않는다.

Notice 요청에 사용 통계, 식별자, 실행 횟수를 부착하면 이 경계 위반이다.

---

## 22. Retention과 삭제

## 22.1 Local 데이터

Local 데이터 삭제는 사용자가 통제한다.

구독 만료나 Entitlement 실패를 이유로 자동 삭제하지 않는다.

## 22.2 Cloud Metadata

다음을 명시한다.

```text
보존 목적
보존 기간
삭제 조건
Account Closure 처리
Export 가능 여부
조직 Retention 우선순위
```

## 22.3 Finance 데이터

Finance 데이터는 별도 정책을 적용한다.

```text
Consent
Data Minimization
Retention
Deletion
Export
Access History
Audit Evidence
```

Development Metadata 정책을 그대로 재사용하지 않는다.

---

## 23. Public / Private 경계

Public 또는 공유 가능한 Contract:

```text
Local / Cloud / Human Vocabulary
Transmission Mode
Reviewed Artifact Contract
Redaction Contract
Adapter Boundary
Capability Declaration
Execution Policy
Truthfulness
Candidate / Promotion
Human Review
```

Private 또는 운영상 비공개일 수 있는 것:

```text
Ranking Algorithm
Runtime Recommendation Logic
Failure Mining Logic
Skill Promotion Criteria
Commercial Fraud Detection
Internal Abuse Policy
Security Detection Detail
```

Public Contract가 Private Algorithm의 결과를 설명할 수 있어야 한다.

---

## 24. 채택하지 않는 방향

### 24.1 Cloud-first Raw Context Upload

전체 Repository, 전체 대화, 전체 Journal을 기본 업로드하지 않는다.

### 24.2 Credential Proxy

사용자 Provider Credential을 중앙 수집해 대신 실행하는 구조를 기본 채택하지 않는다.

### 24.3 Cloud Result 자동 Truth 승격

Cloud Result와 Ranking은 Candidate다.

### 24.4 Entitlement 기반 Local 데이터 삭제

결제 종료를 이유로 Repository, Result, Diff, Journal을 삭제하지 않는다.

### 24.5 Human Review 제거

자동화 수준이 높아져도 중요 승격과 위험 실행에서 Human Gate를 제거하지 않는다.

### 24.6 Development 경계를 Finance에 강제

Finance에 Repository, Worktree, Diff, Agent Process를 요구하지 않는다.

### 24.7 Local에 모든 Intelligence 복제

핵심 Cloud Ranking·Promotion 로직을 Local Binary에 모두 내리지 않는다.

---

## 25. 책임 매트릭스

| 기능 | Local | Cloud | Human |
|---|---:|---:|---:|
| Source Code 보관 | Owner | 기본 미보관 | 전송 결정 |
| Runtime 실행 | Owner | 선택적 관리 Metadata | 실행 승인 |
| Secret 보관 | Owner | 금지 | 등록·회수 |
| Handoff 생성 | Owner | 후보 보강 가능 | 최종 검수 |
| Task Linking | Local manual / V2 metadata | Candidate / 관리 | 승인 |
| Result 수집 | Owner | Metadata / Candidate | Accept/Edit/Reject |
| Validation | Owner | 상태 수집 가능 | 결과 확인 |
| Context Ranking | Local basic / Cloud advanced | Candidate | 선택·수정 |
| Entitlement | Local cache / gate | 권한 계산 | 구독 관리 |
| Billing | 없음 | Owner | 결제·해지 |
| Journal 저장 | Finance Product | Finance Domain Owner | 작성·수정·삭제 |
| Candidate Promotion | 준비 | 후보 제공 | 최종 승인 |
| Retention | Local 사용자 | 정책 집행 | 선택·승인 |
| Organization Policy | Local enforcement | 관리·배포 | 관리자 승인 |

---

## 26. 현재 구현과 목표 상태

현재 public `oh-my-ai` Repository는 Development Extension의 Local CLI / Runtime 구현이다.

현재 V1에서 기대되는 방향:

```text
Local Context
Skill Routing
Work-start
Structured Handoff
Result Basic
Execution Policy
Human Review
```

현재 Shared Platform Cloud, Finance Runtime, V2 Managed Entity가 모두 구현되지 않은 것은 이 문서의 충돌이 아니다.

현재 구현 Gap은 별도 문서에서 관리한다.

```text
docs/product/development-harness-report.md
docs/product/v1-completion-criteria.md
```

---

## 27. 불변조건

1. V1은 Cloud 없이 완결된다.
2. Source Code와 Secret은 기본적으로 Local에 남는다.
3. Cloud 전송은 명시적 Mode와 정책을 따른다.
4. 분류되지 않은 데이터는 Raw Source로 취급한다.
5. Full Context 전송은 명시적 Opt-in이다.
6. Cloud Candidate는 자동 Truth가 아니다.
7. Human Review는 중요 실행과 승격에서 유지된다.
8. Provider Credential은 기본적으로 Provider CLI 또는 공식 Store가 소유한다.
9. Billing 장애가 V1 Local 기능을 차단하지 않는다.
10. 구독 만료가 Local 사용자 데이터 삭제를 의미하지 않는다.
11. Entitlement는 사용권이지 데이터 소유권이 아니다.
12. Sidecar는 초기 V2 선결 조건이 아니다.
13. Development Runtime과 Finance Runtime은 같은 Local 모델을 강제하지 않는다.
14. Redaction은 기본적으로 Local 전송 직전에 수행한다.
15. Telemetry에 원문 Context와 Secret을 포함하지 않는다.
16. Result 누락과 Validation 실패를 완료로 표시하지 않는다.
17. Organization Policy는 더 위험한 사용자 Override를 허용하지 않는다.
18. Remote Execution은 별도 승인과 보안 경계 이후에만 허용한다.
19. 제품군 공통 전송 명칭은 Reviewed Artifact이며, Handoff는 Development 구현이다.
20. 승인 없는 자동 수정과 사용자가 사전 선택한 Execution Mode를 구분한다.
21. 사용자 소유 Runtime Credential과 Product Service Credential을 분리한다.
22. Human Actor의 권한은 개인·프로젝트·조직·법적 Retention 범위에 따라 제한된다.
23. Finance Product-owned Domain Data는 명시적 동의와 정책 아래 Product Domain Service에 저장될 수 있다.
24. Inbound Announcement Read는 사용자 데이터를 송신하지 않으며 Telemetry가 아니다.
25. Product Notice 실패와 Opt-out은 V1 Workflow 완료를 막지 않는다.
26. Notice Manifest Cache와 사용자 선택 State는 분리해 저장한다.

---

## 28. 미결정 사항

1. Metadata-only의 정확한 필드 목록
2. Reviewed Handoff의 직렬화 형식
3. Full Context Opt-in UI
4. Offline Grace 지원 여부와 기간
5. Local Entitlement Cache 형식
6. Device Identifier 생성 방식
7. Telemetry 기본 Opt-in / Opt-out 정책
8. Cloud Metadata Retention 기간
9. Finance Journal 암호화 범위
10. Remote Execution 지원 시점
11. Sidecar IPC 방식
12. Cross-device Resume의 데이터 범위
13. Organization Retention과 개인 삭제권 충돌 처리
14. Cloud Candidate 설명 가능성 표준
15. Redaction Rule 배포와 Versioning 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 29. 관련 문서

```text
docs/master/product-architecture-master.md
docs/architecture/repository-service-boundaries.md
docs/architecture/shared-core-and-extensions.md
docs/roadmap/product-roadmap.md
docs/product/development-harness-report.md
docs/product/finance-harness-report.md
docs/product/v1-completion-criteria.md
docs/poc/v2-local-invocation-poc.md
docs/decisions/decision-log.md
docs/contracts/product-notice-contract.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

---

## 30. 검수 관점

### 하네스 메인 브랜치

- V1이 Cloud 없이 완결되는가
- 현재 Local Runtime과 Adapter 책임에 맞는가
- Source·Secret·Diff·Validation 경계가 현실적인가
- V2 기능이 V1에 유입되지 않는가
- Billing·Entitlement 장애가 Local 기능을 과도하게 차단하지 않는가

### Finance 하네스

- Finance 데이터가 Development Metadata 정책에 흡수되지 않는가
- Journal·Review·PolicyGuard의 Human 책임이 유지되는가
- OCR·Market Data가 초기 필수 범위로 오해되지 않는가
- 정책 정의와 Runtime 집행이 분리되는가

### Identity

- Auth와 Device가 Local PoC 선결 조건이 아닌가
- Credential과 Identity Metadata가 구분되는가
- Entitlement가 데이터 삭제 권한으로 확대되지 않는가

### 제품·법률

- 전송 범위와 Retention이 사용자에게 설명 가능한가
- Full Context가 명시적 Opt-in인가
- 구독 종료와 데이터 삭제가 분리되는가
- 조직 정책과 사용자 권리가 충돌할 때 우선순위가 명확한가
