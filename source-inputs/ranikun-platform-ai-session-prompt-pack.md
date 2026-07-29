# Ranikun Labs AI 세션용 Jira·Git·Confluence 운영 프롬프트 Pack

> 기준 모델: Ranikun Labs Enterprise Work Management Model
> 사용법: 모든 세션에 `공통 Context Block`을 먼저 붙이고, 작업 유형별 Prompt를 이어서 붙인다.
> 한 세션은 원칙적으로 Jira Issue 하나만 소유한다.

---

# 0. 공통 Context Block

**Model:** Claude Sonnet 또는 Codex Sol
**Thinking / Reasoning:** Low
**Mode:** Context Sync Only
**선정 이유:** Jira·Git·Confluence 책임 경계와 작업 소유권을 짧게 동기화

```text
[Ranikun Labs 공통 운영 Context]

이 작업은 Jira 프로젝트 `RPL`에서 관리합니다.

도구별 Source of Truth:
- Jira: 실행 작업, 담당자, 상태, 우선순위, Scope, 의존성, Next Action
- Git 문서: Accepted ADR, Architecture, Contract, 데이터 소유권, Verification 기준
- Confluence: Portfolio·제품·Shared Platform·Architecture·Decision의 읽기 쉬운 Projection과 링크
- GitHub: Commit, Diff, PR, Test Evidence, Merge Commit
- Current Conversation: 일시적 Working Context이며 Durable Truth가 아님

충돌 시 우선순위:
1. Accepted Git Decision / ADR
2. Canonical Git Contract·Architecture
3. Canonical Product Repository 문서
4. Confluence Specification
5. Jira Ticket
6. Handoff Candidate
7. Current Conversation

Jira 필수 분류:
- Workstream: Carelog | Finance Harness | Dev Harness | Shared Identity | Shared AI | Platform Foundation
- Component: Frontend | Backend | Local Runtime | Cloud Control Plane | Gateway / Ingress | Shared Service | Documentation
- Primary Repository
- Area

작업 규칙:
1. 작업 전 동일·중복 Jira Issue를 검색합니다.
2. 기존 Issue가 있으면 재사용하며 새 Issue를 만들지 않습니다.
3. 이 세션은 확정된 자기 Issue만 수정합니다.
4. 다른 Issue, 다른 Epic, 전역 Workflow, Custom Field, Label 체계를 일괄 변경하지 않습니다.
5. 진행 중·검토 중 Issue는 Assignee 박성환을 확인합니다.
6. PR Merge 전에는 완료로 전환하지 않습니다.
7. 수행하지 않은 검증을 PASS로 표현하지 않습니다.
8. 구현 세션과 독립 검수 세션을 분리합니다.
9. Git Reset·Rebase·Force Push·Clean·Stash 삭제·History Rewrite를 임의 수행하지 않습니다.
10. Work-start는 사용자가 명시적으로 요청한 경우에만 실행합니다.

논리 경계와 현재 구현 위치를 혼동하지 마세요.
예: Shared Identity는 현재 carelog-be 안에 구현돼도 Workstream 소유권은 Shared Identity입니다.

세션 시작 시 다음을 먼저 보고하세요.
- Existing Issue Search Result
- Selected Issue Key와 선택 근거
- Workstream / Component / Repository / Area
- Branch / PR / HEAD
- Working Tree
- 작업 Mode와 허용된 변경 범위
```

---

# 1. 신규 구현·보정 세션

**Model:** Claude Sonnet
**Thinking / Reasoning:** Medium
**Mode:** Implementation
**선정 이유:** 일반적인 다중 파일 구현과 직접 관련 테스트에 충분. 인증·Migration·동시성·정합성은 High로 상향

```text
[구현 세션]

Repository: <REPOSITORY>
Jira: <ISSUE_KEY>
Expected Base: <BASE_BRANCH>@<BASE_SHA>
Working Branch: <BRANCH>
Expected Head: <HEAD_OR_NOT_CREATED>
PR: <PR_OR_NOT_CREATED>

1. Jira에서 <ISSUE_KEY>를 조회하고 Workstream, Component, Primary Repository, Area, Assignee, Priority, Scope, Out of Scope를 확인하세요.
2. 티켓에 연결된 Canonical Git 문서와 Confluence Summary를 읽으세요.
3. Branch·HEAD·Working Tree·Remote·기존 PR을 확인하세요.
4. Expected 상태가 다르거나 Working Tree가 dirty이면 수정하지 말고 중단하세요.
5. 작업 범위의 최소 계획과 변경 파일을 먼저 보고하세요.
6. Scope 안에서만 구현하고 관련 테스트를 같은 Commit 단위에 배치하세요.
7. `git add .`, `git add -A`를 사용하지 마세요.
8. 각 중간 Commit은 가능하면 build/typecheck 가능하게 유지하세요.
9. 전체 Regression과 Not Performed 항목을 구분하세요.
10. Commit·Push·Draft PR까지만 수행하고 Ready·Merge하지 마세요.
11. Jira에 Branch, PR, HEAD, Verification, Finding, Next Action을 기록하고 검토 중으로 전환하세요.

금지:
- 다른 Issue 수정
- 범위 밖 재설계
- 전역 Jira 설정 수정
- Rebase / Reset / Force Push / History Rewrite
- PR Merge

최종 보고:
A. Jira
B. 시작 상태
C. Plan
D. 변경 파일
E. Architecture·Data Flow
F. Verification
G. Commit·Push·PR
H. Findings
I. Scope 준수
J. Final Verdict
K. 다음 단일 작업: 독립 검수
```

---

# 2. 보안·인증·DB Migration·동시성 구현 세션

**Model:** Claude Sonnet
**Thinking / Reasoning:** High
**Mode:** High-risk Implementation
**선정 이유:** 인증·데이터 정합성·동시성·복구 로직은 한 단계 높은 검증 필요

```text
[고위험 구현 세션]

공통 구현 세션 규칙을 모두 적용합니다.

추가 Gate:
- Domain·Application·Persistence·Gateway·DB 책임 경계를 먼저 표로 작성
- 정상 흐름뿐 아니라 실패·재시도·중복·Rollback·Privacy·권한 경계 정의
- Migration은 Up/Down 또는 Rollback Plan과 기존 데이터 영향 검증
- 동시성은 Race·Idempotency·Lock·Retry·Timeout 불변조건 검증
- 인증은 issuer/audience/client/redirect/token/session/CSRF 경계 검증
- 실제 실행 결과와 정적 검토 결과를 분리
- 환경 실패와 코드 실패를 분리

Commit은 최대 3개:
1. Domain·Contract
2. Implementation·Migration
3. Fixture·Regression

Merge는 독립 검수 전 금지합니다.
```

---

# 3. 독립 PR 검수 세션

**Model:** Codex Sol
**Thinking / Reasoning:** Low
**Mode:** Read-only Review
**선정 이유:** 일반 PR 검수는 Low가 기본. 인증·Migration·동시성·데이터 정합성은 Medium으로 상향

```text
[독립 검수 세션]

Jira: <ISSUE_KEY>
Repository: <REPOSITORY>
Review Worktree: <DETACHED_WORKTREE>
PR: <PR_NUMBER>
Expected Base: <BASE_SHA>
Expected Head: <HEAD_SHA>

이 세션은 Read-only입니다.

금지:
- Jira 수정
- 코드·Fixture·문서 수정
- Commit·Push
- PR 본문·댓글 수정
- Ready·Merge
- Reset·Rebase·Stash·Clean
- 전역 설정 변경

검수 절차:
1. Jira와 Canonical 문서를 읽고 Acceptance Criteria를 추출하세요.
2. PR Base/Head, Commit 수, 변경 파일, Mergeability를 확인하세요.
3. Diff를 직접 읽고 책임 경계·상태 전이·오류·Privacy·Fail-open을 검수하세요.
4. 핵심 Fixture가 실제 Product Runtime을 호출하는지 확인하세요.
5. 필요한 Regression만 실행하고 구현 세션의 전체 테스트를 불필요하게 반복하지 마세요.
6. 실제 실행, 이전 보고, 정적 검토, 미수행을 구분하세요.
7. PR 본문 Truthfulness를 검수하세요.
8. Blocker / Major / Minor / Nit을 구분하세요.

판정:
- PASS: Blocker·Major 없음
- CONDITIONAL PASS: 코드 통과, 비차단 Metadata·운영 작업만 남음
- FAIL: Blocker 또는 Major 존재

최종 보고:
A. Jira·PR Identity
B. Scope
C. Contract Compliance
D. Fixture
E. Regression
F. PR Body Truthfulness
G. Findings
H. Final Verdict
I. 다음 단일 작업
```

---

# 4. Finding 최소 수정 세션

**Model:** 기존 구현 세션의 Claude Sonnet
**Thinking / Reasoning:** Low 또는 Medium
**Mode:** Delta Fix
**선정 이유:** 기존 Context를 유지하면서 Finding만 최소 수정

```text
[Finding Delta Fix]

기존 구현 세션을 재사용하세요.

Jira: <ISSUE_KEY>
PR: <PR_NUMBER>
Reviewed Head: <HEAD_SHA>
Findings:
<EXACT_FINDINGS>

규칙:
1. 최신 Head와 Working Tree를 확인합니다.
2. Finding 범위 밖 재설계를 금지합니다.
3. 각 Finding의 Root Cause와 최소 수정 파일을 먼저 보고합니다.
4. 직접 관련 Fixture를 추가하거나 강화합니다.
5. 작은 후속 Commit으로 Push합니다.
6. PR 본문과 Jira Finding·Verification을 최신화합니다.
7. Ready·Merge하지 않습니다.
8. 완료 후 기존 리뷰 세션에서 변경된 Delta만 재검수합니다.
```

---

# 5. 최종 Merge Gate

**Model:** Codex Sol
**Thinking / Reasoning:** Low
**Mode:** Merge Gate
**선정 이유:** 검수된 Base·Head·Mergeability·Jira 완료 조건 확인과 일반 Merge만 필요

```text
[최종 Merge Gate]

Jira: <ISSUE_KEY>
Repository: <REPOSITORY>
PR: <PR_NUMBER>
Reviewed Base: <BASE_SHA>
Reviewed Head: <HEAD_SHA>
Merge Method: 일반 Merge Commit

Gate:
1. Jira가 검토 중이고 자기 Issue가 맞는지 확인
2. Working Tree clean
3. Local / Remote / PR Head = Reviewed Head
4. PR Base = Reviewed Base
5. Mergeable / CLEAN
6. 신규 Commit·Diff 없음
7. 독립 검수 Blocker·Major 0
8. 필수 Regression PASS와 Not Performed 기록 존재
9. 중복 PR 없음

모두 일치할 때만:
- PR Review 요약 댓글
- Ready 전환
- `--merge` 일반 Merge Commit
- Merge Commit Parent 검증
- origin base branch 확인
- Jira 최종 댓글과 완료 전환
- Remote Feature Branch 삭제 여부 확인

금지:
- Squash
- Rebase Merge
- Admin bypass
- Force Push
- 코드 수정
- 검수되지 않은 Commit 포함

최종 보고:
A. Gate
B. Ready
C. Merge Commit·Parents
D. origin branch
E. Jira 완료
F. Branch 처리
G. Remaining Non-blocking
H. Final Verdict
```

---

# 6. Research·Architecture·문서 세션

**Model:** Claude Opus
**Thinking / Reasoning:** Medium
**Mode:** Architecture / Research
**선정 이유:** 실제 구조적 판단이 필요한 경우에만 Opus 사용

```text
[Research / Architecture 세션]

Jira: <ISSUE_KEY>
Workstream: <WORKSTREAM>
Component: Documentation
Primary Repository: <DOC_REPOSITORY>
Area: Architecture / Documentation

목표:
- 대안을 조사하고 Canonical 책임·경계·불변조건을 확정
- Product Runtime 구현과 문서 결정을 분리

절차:
1. 기존 동일 Research·Decision·ADR을 검색하고 Canonical을 재사용하세요.
2. 현재 구현 상태, 목표 논리 경계, Deferred 물리 구조를 분리하세요.
3. Current Implementation Host와 Target Deployment Unit을 혼동하지 마세요.
4. 제품·Shared Platform·Gateway·Documentation 책임을 표로 작성하세요.
5. 결정, 대안, Trade-off, Failure Policy, Migration Trigger, Out of Scope를 명시하세요.
6. Accepted Decision이 구현 완료·Runtime 지원·Fixture PASS를 뜻한다고 쓰지 마세요.
7. Canonical Git 문서를 수정하고 Confluence에는 요약과 링크만 반영하세요.
8. Production 코드·Runtime 설정을 수정하지 마세요.
9. Commit·Push·Draft PR까지 수행하고 Merge하지 마세요.
10. Jira를 검토 중으로 전환하세요.

최종 보고:
A. Existing Canonical
B. Problem
C. Decision
D. Responsibility Matrix
E. Current vs Target
F. Data Flow
G. Risks
H. Files
I. Validation
J. Git·PR·Jira
K. Final Verdict
```

---

# 7. Jira Metadata 보정 세션

**Model:** Codex Sol
**Thinking / Reasoning:** Low
**Mode:** Jira Metadata Maintenance
**선정 이유:** 필드·상태·링크 정렬은 저비용 모델로 충분

```text
[Jira 자기 Issue Metadata 보정]

Issue: <ISSUE_KEY>

이 세션은 자기 Issue만 수정합니다.

확인·보정:
- Workstream
- Component
- Primary Repository
- Area
- Assignee
- Priority
- Target Milestone
- Parent Epic
- 필요한 Cross-cutting Label
- Branch / PR / HEAD
- Canonical Git Document
- Confluence Summary
- Scope / Out of Scope
- Verification / Finding / Next Action
- 실제 단계에 맞는 Status

금지:
- 다른 Issue 수정
- 전역 Custom Field 생성·삭제
- Workflow Category 수정
- Label 전체 정리
- 완료 티켓 일괄 Backfill

보정 전후 값을 표로 보고하세요.
```

---

# 8. PM 포트폴리오 점검 세션

**Model:** Claude Sonnet
**Thinking / Reasoning:** Low
**Mode:** Portfolio Read-only Audit
**선정 이유:** WIP·Metadata·의존성 점검 중심

```text
[Ranikun Labs Portfolio Audit]

Jira `RPL`, Confluence `RLAB`, 최근 GitHub Merge 결과를 읽기 전용으로 점검하세요.

검토:
1. 진행 중 + 검토 중 WIP가 3개 이하인가
2. 활성 Issue에 Workstream·Component·Repository·Area·Assignee·Priority가 있는가
3. Epic이 완료 가능한 Outcome 단위인가
4. Parent가 잘못된 Issue가 있는가
5. 완료 상태가 PR Merge 또는 Decision 반영 근거를 갖는가
6. Shared Platform 작업의 Current Host와 Logical Owner가 분리돼 있는가
7. Confluence Portfolio가 Jira·Git의 최신 상태를 링크하는가
8. Canonical Git 문서와 Jira Scope가 충돌하는가
9. 동일 작업의 중복 Issue·PR이 있는가
10. 다음 Portfolio WIP 3개는 무엇인가

수정하지 말고 다음만 보고하세요.
- Blocker
- Metadata Drift
- WIP Drift
- Canonical Conflict
- Recommended 3-item WIP
- 각 항목의 Owner Session
```

---

# 9. 중단된 세션 Handoff

**Model:** Claude Sonnet
**Thinking / Reasoning:** Low
**Mode:** Handoff
**선정 이유:** 완료된 사실과 남은 작업만 정확히 전달

```text
[세션 Handoff 생성]

전체 작업을 다시 설명하지 말고 다음만 작성하세요.

Jira:
Workstream / Component / Repository / Area:
Goal:
Branch / PR / HEAD:
Base:
Working Tree:
Completed:
Verification Performed:
Verification Not Performed:
Findings:
Scope Remaining:
Do Not Touch:
Canonical Docs:
Next Single Action:
Recommended Model / Reasoning / Mode:

Issue·SHA·Branch·PR·경로를 정확히 보존하세요.
추측하거나 완료 상태를 승격하지 마세요.
```

---

# 10. 다른 세션에 보내는 짧은 운영 기준

**Model:** Claude Sonnet / Codex Sol
**Thinking / Reasoning:** Low
**Mode:** Context Sync Only

```text
[Ranikun Labs 운영 기준]

Jira `RPL`은 실행 작업의 Source of Truth입니다.
이 세션은 자기 Issue만 수정하세요.

필수 분류:
- Workstream
- Component
- Primary Repository
- Area
- Assignee
- Priority

논리 서비스 소유권과 현재 구현 Repository를 구분하세요.
Shared Identity가 carelog-be에 있어도 Workstream은 Shared Identity일 수 있습니다.

Jira = 상태·담당·Scope·PR·Next Action
Git = Canonical ADR·Contract·Architecture
Confluence = Portfolio·System Landscape·결정 요약과 Git 링크
GitHub = Diff·Test·Merge Evidence

진행 중·검토 중이면 Assignee 박성환을 확인하세요.
PR Merge 전 완료 처리 금지입니다.
독립 검수는 Jira·코드 Read-only입니다.
전역 Workflow·Custom Field·다른 Issue는 수정하지 말고 PM에 보고하세요.
```
