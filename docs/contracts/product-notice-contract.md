---
title: Product Notice Contract
status: draft
implementation_status: missing
owner: product
last_reviewed: 2026-07-20
supersedes: []
superseded_by: []
related_adrs:
  - ADR-0011
source_inputs:
  - docs/product/v1-completion-criteria.md
  - docs/contracts/work-start-contract.md
  - docs/architecture/local-cloud-human-boundary.md
  - docs/decisions/decision-log.md
---

# Product Notice Contract

## 1. 문서 목적

이 문서는 Public V1의 Local Product Notice Channel 계약을 정의한다.

Notice Channel의 목적은 기능 추가가 아니다.

정확한 목적은 다음과 같다.

```text
Public V1을 설치한 사용자가
향후 V2 출시, 보안, 호환성 공지를
터미널에서 인지할 수 있게 한다
```

Public V1은 Cloud-independent 제품이다.

따라서 사용자에게 도달할 수 있는 경로가 Release Page 외에는 존재하지 않는다.

Notice Channel은 그 도달 경로 하나만 담당한다.

Notice는 다음과 동일하지 않다.

```text
자동 Update
자동 설치
자동 Login
Cloud 연결
Telemetry
Handoff Candidate
Result Basic
Task Context
Workflow State
```

---

## 2. 책임 경계

## 2.1 Notice Contract가 소유하는 책임

```text
Notice 표시 Trigger
Cache-first Display 규칙
Next-run Visibility 규칙
Notice Failure Boundary
전송 금지 데이터 범위
Manifest Safety 규칙
Local State 분류
Dismiss / Opt-out 의미
Runtime Policy 축
```

## 2.2 Notice Contract가 소유하지 않는 책임

```text
Work-start 입력·출력 Contract
Candidate 의미
Human Review 의미
Handoff Scope
Result Truthfulness
Runtime Capability 판정
Execution Policy 승인
Release 일정
Manifest 게시 운영 절차
```

## 2.3 다른 Contract와의 관계

```text
Work-start Contract
= Candidate Seed 생성 계약

Product Notice Contract
= Work-start 실행에 부수하는 Local 정보 표시 계약
```

두 Contract는 Trigger를 공유할 뿐 데이터와 상태를 공유하지 않는다.

```text
Notice
∉ Work-start Artifact
∉ Handoff Seed
∉ Result Basic
∉ Project Context
```

Notice는 기존 Contract에 새 필드나 새 상태를 추가하지 않는다.

다음과 같은 Workflow State를 만들지 않는다.

```text
Ready for Handoff
Notice Reviewed
Update Required
```

---

## 3. V1 불변조건

1. Notice는 명시적 Work-start 실행에만 부수한다.
2. Notice 실패는 Work-start 결과를 바꾸지 않는다.
3. Notice는 Local Cache Snapshot만으로 표시를 결정한다.
4. Notice는 사용자 작업 데이터를 전송하지 않는다.
5. Notice는 Manifest 내용을 실행하지 않는다.
6. 사용자는 개별 Notice를 dismiss할 수 있다.
7. 사용자는 원격 확인 전체를 opt-out할 수 있다.
8. Notice는 자동 Update, 자동 설치, 자동 Login을 수행하지 않는다.
9. Network 없이 제품 핵심 기능이 정상 동작한다.
10. Notice는 상주 Daemon, Scheduler, OS Service를 요구하지 않는다.

---

# Part I. Trigger

## 4. 표시 Trigger

Notice 표시는 다음 조건에서만 발생한다.

```text
성공적으로 시작된 명시적 Work-start 실행
```

`명시적`의 의미는 Work-start Contract의 Runtime Entry Consent 정의를 따른다.

Notice Contract는 그 정의를 재정의하지 않는다.

## 5. 표시 금지 경로

다음 경로에서는 Network 호출, Cache Refresh, Notice 표시가 모두 발생하지 않는다.

```text
UserPromptSubmit Hook
Natural Suggestion
Synthetic Event
Worker Session
Result Basic 생성
기본 Doctor 실행
기본 setup.sh 실행
```

Suggestion 상태는 Work-start Engine 실행이 아니다.

따라서 Suggestion 상태에서 Notice가 표시되면 Contract 위반이다.

Worker Session은 Main Session의 Notice 상태를 상속하지 않는다.

## 6. 표시 위치

```text
현재 Work-start 출력 말미
```

Notice는 Work-start Summary, Handoff Seed, Starter Prompt 본문에 삽입되지 않는다.

Notice는 출력 스트림에만 존재하며 Artifact 파일에 기록되지 않는다.

---

# Part II. Display Model

## 7. Cache-first Display

현재 실행에서 표시할 Notice는 실행 시작 시점의 Local Cache Snapshot으로 결정한다.

```text
Work-start 시작
→ Cache Snapshot 읽기
→ 이 Snapshot으로 표시 대상 확정
→ 실행 중 Snapshot을 다시 평가하지 않음
```

Cache가 존재하지 않으면 표시 대상은 없다.

Cache 부재는 오류가 아니다.

## 8. Next-run Visibility

현재 실행 중 Remote에서 새로 받은 Notice는 현재 출력에 삽입하지 않는다.

```text
현재 실행에서 갱신된 Cache
→ 다음 명시적 Work-start부터 표시 대상
```

이 규칙의 목적은 출력 결정성이다.

Remote 응답 시점에 따라 같은 실행의 출력이 달라지면 Fixture가 결정적으로 재현되지 않는다.

## 9. Active Notice 선택

Cache Snapshot에서 다음을 모두 만족하는 Notice만 표시 대상이다.

```text
Schema가 지원 범위 안이다
Audience Version Match를 만족한다
Dismiss되지 않았다
Max Impressions에 도달하지 않았다
유효 기간 안이다
```

동시에 복수 Notice가 활성이면 표시 개수 상한을 적용한다.

상한과 우선순위 기준은 Release Policy가 소유한다.

## 10. Rendering

```text
Plain-text
```

Notice 본문은 Markdown, HTML, ANSI Escape, Shell Command로 해석되지 않는다.

Manifest가 제공한 문자열은 표시 전에 제어문자를 제거한다.

Notice는 사용자 입력을 요구하지 않는다.

```text
Prompt 없음
확인 대기 없음
Blocking Input 없음
```

---

# Part III. Refresh Model

## 11. Refresh Trigger

```text
Cache가 stale이고
Opt-out 상태가 아니면
비차단 one-shot Refresher를 실행한다
```

Refresh는 Work-start Core 실행 이후에 시작한다.

Work-start는 Refresher 종료를 기다리지 않는다.

## 12. Refresher 형태

Refresher는 상주 Daemon이 아니다.

```text
짧은 비차단 one-shot process
→ Manifest 조회
→ 검증
→ Cache atomic 갱신
→ 종료
```

Refresher는 별도 사용자 출력을 생성하지 않는다.

```text
성공 메시지 없음
실패 메시지 없음
Progress 표시 없음
```

Refresher는 Scheduler, Cron, OS Service를 등록하지 않는다.

## 13. Refresh 실패

Refresh 실패는 조용히 종료한다.

```text
기존 정상 Cache는 보존한다
실패로 Cache를 비우지 않는다
실패를 Work-start 오류로 승격하지 않는다
```

실패 유형은 Local Debug Log에만 남길 수 있으며 사용자 출력 경로가 아니다.

---

# Part IV. Failure Boundary

## 14. Fail-open 원칙

Notice 관련 모든 실패는 fail-open이다.

Notice 실패는 다음에 영향을 주지 않는다.

```text
Work-start exit code
Candidate 생성
Human Review State
Context Gap
Starter Prompt
Result Basic
Skill Routing 결과
Risk Candidate
Provenance
```

## 15. 실패 분류

다음은 모두 정상 동작으로 취급한다.

```text
Cache 없음
Cache 손상
Invalid JSON
Unsupported Schema
Network 불가
Timeout
DNS 실패
TLS 실패
HTTP 오류 응답
Lock 획득 실패
Cache 쓰기 실패
State 파일 손상
```

각 경우의 결과는 동일하다.

```text
Notice 표시 없음 또는 직전 유효 Cache 기준 표시
Work-start 정상 완료
```

## 16. Offline 동작

Network가 전혀 없는 환경에서 Work-start는 정상 완료해야 한다.

Offline은 Known Limitation이 아니라 지원 대상 환경이다.

---

# Part V. Privacy

## 17. 전송 금지 데이터

Notice 경로는 다음을 전송하지 않는다.

```text
Prompt
Task
Repository 이름
Git Remote
작업 경로
Branch
Commit
Candidate
Artifact
사용자 코드
Skill 후보
Context 목록
Usage Log
Machine ID
Account 식별자
```

Notice 요청은 사용자 데이터를 담은 Request Body를 가지지 않는다.

```text
정적 Manifest에 대한 읽기 전용 요청
```

## 18. Network Metadata 노출

전송 금지 목록은 요청 자체가 아무 정보도 남기지 않는다는 의미가 아니다.

일반적인 HTTPS 요청 과정에서 다음이 Manifest Host와 그 경로상 네트워크 구성 요소에 노출될 수 있다.

```text
Client IP Address
요청 시각
User-Agent 등 요청 Header
TLS 협상 Metadata
요청 대상 경로
```

이 노출은 HTTPS 요청의 일반 속성이며 제품이 별도로 수집·전송하는 데이터가 아니다.

이를 이유로 Notice를 Telemetry로 분류하지 않는다.

```text
Notice Fetch
≠ Telemetry
≠ Usage Reporting
≠ Analytics
```

전체 opt-out은 이 Network Metadata 노출까지 제거하는 유일한 수단이다.

Public Documentation은 이 사실을 축소해 표현하지 않는다.

## 19. Audience Match 위치

Audience 판정은 Local에서 수행한다.

```text
Manifest는 Audience 조건을 기술한다
Local Runtime이 자신의 Version으로 Match를 판정한다
```

서버가 사용자별 Audience를 계산하지 않는다.

---

# Part VI. Manifest Safety

## 20. Source

```text
공식 GitHub-controlled HTTPS Source
```

HTTPS만 허용한다.

Redirect를 다른 Host로 따라가지 않는다.

Manifest Source는 Release Policy가 소유하며 Work-start Contract가 소유하지 않는다.

## 21. Schema

```text
schema_version 필수
```

규칙:

```text
schema_version 없음
→ Manifest 전체 무시

알 수 없는 schema_version
→ Manifest 전체 무시

Invalid JSON
→ Manifest 전체 무시
```

부분 해석을 시도하지 않는다.

알 수 없는 Schema에서 일부 필드만 읽는 것은 Unknown을 Supported로 승격하는 것과 같다.

## 22. Content 제한

```text
Plain-text Message만 허용
Markdown 금지
HTML 금지
Shell Command 금지
ANSI Escape 금지
Template 치환 금지
```

Message 길이 상한을 적용한다.

상한 수치는 Release Policy가 소유한다.

## 23. Action URL

Notice는 선택적으로 참고 URL을 포함할 수 있다.

```text
공식 HTTPS Action URL Allowlist
```

Allowlist 밖의 URL을 가진 Notice는 해당 Notice만 무시한다.

URL은 표시만 하며 자동으로 열지 않는다.

## 24. 실행 금지

```text
Manifest 기반 명령 실행 금지
Manifest 기반 파일 다운로드 금지
Manifest 기반 설치 금지
Manifest 기반 설정 변경 금지
Manifest 기반 Skill 로드 금지
```

Manifest는 데이터이며 코드가 아니다.

## 25. Signature

Manifest 서명 검증은 이 Contract의 요구사항이 아니다.

현재 신뢰 근거는 다음이다.

```text
HTTPS Transport
공식 Host 고정
Content 실행 금지
Plain-text 제한
Action URL Allowlist
```

서명 도입은 별도 Decision 대상이며, 서명 부재를 근거로 위 제한을 완화하지 않는다.

---

# Part VII. Local State

## 26. State 분류

Notice의 Local State는 두 종류이며 같은 파일에 저장하지 않는다.

| 구분 | 의미 | 삭제 영향 |
|---|---|---|
| Manifest Cache | Remote Manifest의 Local 사본 | 삭제 가능. 다음 Refresh에서 재획득 |
| User Choice State | Dismiss, Opt-out, Impression 기록 | 삭제 시 사용자 선택이 사라짐 |

권장 개념 위치:

```text
${XDG_CACHE_HOME:-$HOME/.cache}/oh-my-ai/notice-manifest.json
${XDG_CONFIG_HOME:-$HOME/.config}/oh-my-ai/notice-state.json
```

실제 경로는 XDG Base Directory 규칙을 따른다.

Manifest Cache는 XDG Cache 영역에 두고,
Dismiss·Opt-out·Impression 같은 User Choice State는 XDG Config 영역에 둔다.

Product Notice의 Manifest Cache와 User Choice State는
Installation-scoped Runtime Cache와 Installation-scoped User Choice State이며
Task·Workflow Artifact가 아니다.

따라서 OPEN-006 Local Artifact Root의 범위에 포함되지 않는다.

```text
OPEN-006 Local Artifact Root
= Task·Workflow Artifact 저장 위치
  (Work-start Summary, Handoff, Result, Projection, Evidence 등)

Product Notice Local State
= Installation-scoped Runtime Cache / User Choice State
= Repository·Task와 무관하게 설치 단위로 존재
```

두 축은 서로 다른 질문에 답한다.

```text
OPEN-006
→ 이 Repository·Session의 산출물을 어디 둘까

Product Notice Local State
→ 이 설치의 전역 선호를 어디 둘까
```

Notice Opt-out은 Notice 확인 전체 단위이며 Repository 단위가 아니다.

Task Artifact Root에 종속시키면 Repository마다 Opt-out을 다시 해야 하는 모순이 생긴다.

정확한 파일명과 Repository-local Fallback 경로는 Product Worker 범위다.

## 27. Cache 영역 규칙

Manifest Cache는 언제든 삭제될 수 있는 영역으로 취급한다.

```text
Cache 삭제
→ 기능 손실 없음
→ 사용자 선택 손실 없음
```

Cache 영역에 사용자 선택을 저장하면 Contract 위반이다.

## 28. User Choice State 규칙

```text
Dismiss는 Notice ID 단위다
Opt-out은 Notice 확인 전체 단위다
Impression Count는 Notice ID 단위다
```

State 파일이 손상되면 다음과 같이 처리한다.

```text
Opt-out 판정 불가
→ 안전측으로 원격 확인을 수행하지 않는다

Dismiss 판정 불가
→ 표시하지 않는다
```

State 손상 시 더 많이 표시하거나 더 많이 통신하는 방향으로 복구하지 않는다.

## 29. Atomic Write

Cache와 State 갱신은 atomic write로 수행한다.

```text
임시 파일 기록
→ fsync
→ rename
```

부분 기록된 파일이 정상 Cache로 읽히면 안 된다.

---

# Part VIII. Runtime Policy

## 30. Policy 축

다음 축은 Contract가 소유한다.

```text
TTL 존재
Hard Timeout 존재
Concurrent Refresh 중복 방지
Atomic Cache Write
Local SemVer Audience Match
Max Impressions 존재
Notice별 Dismiss
전체 Notice Check Opt-out
기존 정상 Cache 보존
```

다음 수치는 Release Policy가 소유하며 Contract 상수로 고정하지 않는다.

```text
TTL 값
Hard Timeout 값
Max Impressions 값
동시 표시 Notice 개수 상한
Message 길이 상한
Retry 횟수
```

수치 변경은 Contract 변경이 아니다.

## 31. Concurrent Refresh

동시에 여러 Work-start가 실행될 수 있다.

```text
Refresh는 Local Lock으로 중복을 방지한다
Lock 획득 실패는 정상 종료다
Lock 대기는 하지 않는다
```

Lock 구현 방식은 Contract가 소유하지 않는다.

Stale Lock이 영구히 Refresh를 막지 않아야 한다.

## 32. Version Match

Audience Match는 Runtime-readable SemVer를 사용한다.

```text
Local Runtime Version
→ Manifest Audience 조건과 비교
→ Match 시에만 표시 대상
```

Version을 읽을 수 없으면 Match를 판정하지 않는다.

```text
Version Unknown
→ Notice 표시 없음
```

Unknown을 Match로 추정하지 않는다.

Runtime-readable Version Source의 형태는 별도 Decision과 Product Worker 범위다.

## 33. Opt-out 의미

```text
Opt-out 활성
→ Cache 읽기 없음
→ 표시 없음
→ Refresh 없음
→ Network 호출 없음
```

Opt-out은 표시만 끄는 것이 아니라 원격 확인 자체를 끈다.

Opt-out 상태에서 Network 호출이 발생하면 Contract 위반이다.

---

# Part IX. Module Boundary

## 34. 개념 모듈

```text
Local Product Services
└─ Notice Module
   ├─ read_for_display
   ├─ select_active_notice
   ├─ render_notice
   └─ refresh_if_stale
```

## 35. 통합 인터페이스

Work-start는 다음 인터페이스만 알아야 한다.

```text
notice_snapshot = notice.read_for_display(current_version)

기존 Work-start Core 실행

notice.render(notice_snapshot)

notice.refresh_if_stale_nonblocking(current_version)
```

Work-start Contract는 다음 내부 구현을 소유하지 않는다.

```text
GitHub Manifest URL
Manifest Schema 세부 구조
Lock 구현
Atomic Write 구현
Cache 파일 내부 구조
향후 Cloud API
```

이 경계의 목적은 향후 Notice Source가 GitHub Manifest에서 다른 형태로 바뀌어도 Work-start Contract를 변경하지 않는 것이다.

---

# Part X. Validation

## 36. Contract Validation

다음을 검증한다.

```text
명시적 Work-start 외 경로에서 Notice 미발생
Suggestion 상태에서 Network 미발생
Cache Snapshot 기준 표시 결정
현재 실행 Remote 결과의 현재 출력 미삽입
Notice 실패의 Work-start exit code 무영향
Artifact 내용 불변
Opt-out 상태의 Network 미발생
Manifest 내용 미실행
Cache 삭제 후 사용자 선택 보존
```

## 37. 최소 Fixture

Fixture ID와 상세 Assertion은 `docs/testing/v1-fixture-plan.md`가 소유한다.

이 Contract는 다음 범주가 반드시 존재해야 함을 요구한다.

```text
Cache 상태별 동작
Manifest 유효성별 동작
Version Match 동작
사용자 선택 동작
동시성 동작
경로 격리 동작
Artifact 불변 동작
```

## 38. 완료 조건

```text
Contract 확정
Fixture 존재 및 통과
Public Documentation에 Notice 목적·전송 범위·Opt-out 방법 명시
Offline 동작 검증
Artifact diff에 Notice 혼입 없음 검증
```

Public Documentation이 Network Metadata 노출을 생략하면 완료로 판정하지 않는다.

---

# Part XI. Non-goals

## 39. V1 비목표

```text
Cloud Notice API
사용자별 서버 Audience
Account / Device별 상태 동기화
Telemetry
Marketing Tracking
Push Notification
자동 Update
자동 V2 설치
자동 Login
상주 Daemon
Scheduler
OS Service
Rich UI
서명 Manifest 구현
```

## 40. 채택하지 않는 방향

### Notice를 Work-start Artifact에 기록

Artifact는 작업 전달 Contract다.

Notice가 Artifact에 들어가면 Handoff diff와 Result diff가 제품 공지에 오염된다.

### Remote 결과를 현재 실행에 즉시 반영

출력이 네트워크 응답 시점에 의존하게 되며 Fixture가 결정적으로 재현되지 않는다.

### Notice 실패를 사용자에게 보고

사용자는 공지 채널 장애를 해결할 수 없다.

보고는 소음이며 fail-open 원칙과 충돌한다.

### Notice를 Workflow State로 승격

Human Review Gate와 Candidate State 의미가 오염된다.

### 상주 Process로 주기 갱신

Public V1은 설치 후 상주 Process를 요구하지 않는 제품이다.

---

# Part XII. Open Decisions

## 41. 미결정 사항

1. Manifest Host와 경로
2. Manifest Schema 상세 필드
3. TTL·Timeout·Max Impressions 초기값
4. 동시 표시 Notice 개수 상한
5. Action URL Allowlist 초기 목록
6. Notice 심각도 구분 도입 여부
7. Manifest 서명 도입 시점
8. Debug Log 위치와 보존 기간
9. Opt-out 설정 노출 방식

미결정 사항을 구현자가 임의로 확정하지 않는다.

---

## 42. 불변조건

1. Notice는 명시적 Work-start에만 부수한다.
2. Notice 실패는 fail-open이다.
3. Notice는 사용자 작업 데이터를 전송하지 않는다.
4. Notice는 Artifact에 기록되지 않는다.
5. 현재 실행의 표시는 시작 시점 Cache로 결정한다.
6. 새로 받은 Notice는 다음 실행부터 표시한다.
7. Manifest는 실행 대상이 아니다.
8. Unknown Schema를 부분 해석하지 않는다.
9. Cache와 사용자 선택 State를 분리한다.
10. Opt-out은 Network 호출 자체를 제거한다.
11. Version Unknown을 Match로 추정하지 않는다.
12. Notice는 새 Workflow State를 만들지 않는다.
13. Network 없이 제품 핵심 기능이 동작한다.
14. Notice는 상주 Process를 요구하지 않는다.

---

## 43. 관련 문서

```text
docs/contracts/README.md
docs/contracts/work-start-contract.md
docs/product/v1-completion-criteria.md
docs/architecture/local-cloud-human-boundary.md
docs/testing/v1-fixture-plan.md
docs/decisions/decision-log.md
docs/adr/ADR-0011-local-product-notice-channel.md
```

---

## 44. 검수 관점

### 제품

- Public V1 사용자에게 V2 공지가 도달할 수 있는가
- Notice가 제품 핵심 가치를 방해하지 않는가
- Offline 사용자가 불이익을 받지 않는가

### Contract

- Work-start Contract와 책임이 중복되지 않는가
- Handoff·Result Contract 의미를 변경하지 않는가
- 새 Workflow State를 만들지 않는가

### 안전

- 전송 금지 목록이 실제 구현 가능한가
- Network Metadata 노출을 정직하게 표현했는가
- Manifest 실행 경로가 완전히 차단됐는가
- Opt-out이 Network까지 제거하는가

### 검증

- Fixture가 결정적으로 재현 가능한가
- Artifact 불변이 검증되는가
- 동시 실행이 검증되는가
