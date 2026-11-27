# AI Development Main 인계 노트

갱신일 2026-11-27 KST. 이 파일을 이 세션의 상태 기록으로 사용한다. 기존 결정은 이 노트와 Git·Jira·Confluence 정본을 먼저 대조한다. 이전 AI Main 대화는 빠진 결정의 출처가 필요할 때 확인한다.

## 사용자가 할 수 있는 것

Finance 일반 분석에는 질문 입력, 체크리스트 확인, 분석 제출, 완료 시 Analysis·Observations 표시 경로가 있다. 모의 모델에서 화면 표시까지 확인됐다. 실모델 답변은 아래 검수에서 Finance 검증에 걸려 화면에 표시되지 않았다.

## 이번에 확인한 것

| 구성 | 검수 고정 커밋 | 트리 |
|---|---|---|
| Finance BE | `4a8e5bd1c9249ad238adefc26bd8564b50f46db4` | `a7cdb16670f5a5a090337f1110548c998628c04f` |
| Platform | `0ffd37bb43e3855519c5eee30e1de1284ed4fabb` | `20d8b308b616eb3694b4a8b8885425ae87883fbe` |
| Finance FE | `024d805f63589e8697b568b1cb8bd577f814a861` | `0ba61418caa972f1af23c5bdfda0dea6416f9742` |

- Codex Cloud 실검수 요청 `de0b78ea-f637-4a93-b099-9ef54c71e3e5`가 브라우저, Finance, Shared AI에서 일치했다. Shared AI 실행 ID는 `008989d4-7be9-48ec-bdd3-045773a2777d`다. `gpt-5.4-mini` 호출 1회와 응답 수신을 확인했다. Finance는 HTTP 200과 `FAILED`를 응답했고 진단은 `failureCode=OUTPUT_REJECTED detail=UNSUPPORTED_FINANCIAL_CONTENT`였다. 로컬 증거는 `work/finance-live.npkp68Uk/corrected/evidence/`의 `browser.json`, `finance.log`, `platform-metadata.txt`에 있다.
- 고정 validator는 다섯 출력 필드에 정규식을 적용해 `interest rate`, `inflation`, `금리` 같은 단어가 등장하면 문맥과 무관하게 거절한다. Finance 서비스 정책 §1은 금융 개념 설명을 허용하며, §2 및 PolicyGuard 규칙 §5는 매매 지시·목표가·비중 지시 등을 금지한다. 로컬 정본은 `finance-harness-docs/00-core/0-a-safety-core/`이고 확인 리비전은 `5326977691b420f573a469c0bb7635de26fe2aba`다.
- 합성 재현은 지시·목표가, 중립적인 분산투자 설명, 같은 설명에 금리와 채권 가격의 일반 관계를 추가한 경우를 비교한다. 테스트는 `work/finance-rule-diagnostic/be`의 격리 사본에만 추가했다. 분산 설명은 `COMPLETED`, 금리와 채권 가격의 일반 관계를 추가한 설명은 `FAILED / UNSUPPORTED_FINANCIAL_CONTENT`로 오탐, 매수 지시·목표가는 같은 규칙으로 의도대로 거절됐다. `OutputRejectionRuleReproTest` 28개와 `FinanceSharedAiHttpClientTests` 12개가 통과했다. 증거는 격리 사본의 `build/test-results/test/` XML에 있다. 이번 진단에서 실모델 호출은 0회였다.
- 독립 검토에서 거절 규칙의 일치 범위, 적용 순서, 정본의 허용 범위를 확인했다. 고정 BE 어댑터의 기존 출력 계약은 매매 조언·목표가·전망·근거 없는 사실을 이미 제한한다.

## 남은 문제와 승인

- 실검수 증거에 일치 필드와 문구가 없어 당시 응답의 오탐 여부는 미확정이다. 실모델 호출 승인 1회는 사용 완료했다.
- Finance 거절 규칙의 로컬 변경과 합성 검증은 승인받아 완료했다. 현재 패치의 독립 검수는 외부에서 진행한다. 제품·금융 안전정책 변경, 추가 실모델 호출, 데이터 저장·전송, 푸시·PR·병합·배포는 각 승인 범위에 따른다.
- Carelog의 최근 완료 방문 3건 + 더보기는 Product Owner 결정 대기다. RPL-62는 HOLD다. 운영 Memory는 OFF다. 로그인·Gateway·DB·배포는 Normal Main 소유다.

## Spring AI 병렬 실행 순서

- **Finance** — 첫 사용자 기능은 일반 교육 답변을 Analysis·Observations에서 읽는 것이다. Finance 거절 규칙 보완과 교육·금지 출력의 합성 회귀를 로컬에서 완료해 외부 독립 검수에 인계한다. 일지 AI 복기는 원본 접근 권한·입출력·사용자 저장 경계 확인을 후속으로 둔다.
- **Carelog** — 후보 첫 사용자 기능은 권한이 있는 고객의 방문 준비 요약이다. Git·Jira·Confluence 정본을 대조했다. 방문 준비 기능의 구현·검증 승인 및 그에 묶인 고정 SHA는 미확인이다. 최근 완료 방문 3건 + 더보기는 제품 결정 대기다.
- **Shared AI** — 두 트랙의 실행·Evidence 계약을 공통으로 확인한다. 각 서비스가 입력 범위와 최종 출력 검증을 소유한다. 대화 Context와 명시적 Memory는 후속 큐에서 관리한다.

## Finance 로컬 변경과 외부 검수 인계

- 고정 BE `4a8e5bd1c9249ad238adefc26bd8564b50f46db4`에서 영어 금리와 채권 가격의 일반 설명 문장과 몇 가지 동의 표현을 통과시켰다. 같은 답변의 매수·매도 지시, 목표가, 가격 전망, 현재 금리 수치 등은 합성 회귀에서 차단했다. 허용 범위는 검증한 영어 문장 형태로 한정된다.
- 구현 위치 `work/finance-rule-refinement-be`. 기준 커밋에 적용할 패치 `work/finance-rule-refinement-be.patch`, SHA-256 `ded83508719e0d2bf690f34ca221072cf84ad33f313d08e953774f106a65854a`. 고정 원본에 `git apply --check` 통과. 로컬 변경은 커밋되지 않았다.
- 작업자 검증은 키를 제거한 상태에서 `./gradlew test --tests 'labs.ranikun.finance.generalanalysis.*' --no-daemon --offline`으로 실행했다. 93건 중 87건 통과, 6건 건너뜀(실모델 테스트 포함), 실패·오류 0건. XML은 구현 위치의 `build/test-results/test/`에 있다. 추가 실모델 호출 0회.
- 외부 독립 검수는 NOT_RUN이다. 기준 커밋과 패치 SHA-256을 검증한 뒤 중립 문장 주변의 금지 표현, 문장 경계, 다른 출력 필드의 혼합 사례를 재검증한다.

## Finance 한국어 프롬프트와 합성 회귀

- 격리 사본 `work/finance-korean-guardrail-be`에서 질문을 그대로 넘기고 사용자에게 표시되는 문자열을 한국어로 작성하도록 프롬프트에 명시했다. 기존 JSON 필드와 금지 출력 지시를 유지했다.
- 금리와 채권 가격을 설명하는 일부 한국어 문장은 통과했다. 같은 설명에 한국어 매수·매도 지시, 목표 가격, 현재 금리 수치를 섞은 합성 답변은 `UNSUPPORTED_FINANCIAL_CONTENT`로 거절됐다. 검증 범위는 테스트한 문장 형태에 한정된다.
- 오프라인 일반 분석 테스트 89건 통과, 6건 건너뜀, 실패·오류 0건. 추가 실모델 호출 0회. 증거 XML은 격리 사본의 `build/test-results/test/`에 있다.
- 검수 후보 `work/finance-korean-guardrail-be.patch`는 고정 BE에 적용 가능하며 SHA-256은 `709e93993cfdc886f19770b50f17049469f925c57dbb99c427d351ae06333cc1`이다. 앞선 영어 패치를 보존했다. 한국어 후보의 독립 검수는 외부 대기다.
- 프롬프트 검사 전용 스킬은 실행 환경에서 확인되지 않아 Finance 프롬프트 템플릿과 고정 코드의 JSON 출력 계약을 직접 대조했다.

## Finance 순수 한국어 브라우저 검증

- 한국어 질문만으로는 기존 입력 분류에서 BLOCKED였다. 확정 교육 질문 한 문장만 전체 일치로 허용하는 좁은 입력 패치를 별도로 적용했다. 기존 위험·미확정 검사 우선순위와 다른 질문 처리 경로를 유지했다.
- 기준 BE `4a8e5bd1c9249ad238adefc26bd8564b50f46db4`, FE `024d805f63589e8697b568b1cb8bd577f814a861`. 순수 한국어 질문 → 체크리스트 → 합성 Shared AI HTTP → Finance 판정 → 기존 Analysis·Observations 표시를 확인했다. 교육 답변 COMPLETED, 매수·매도·목표가 출력 3건 FAILED / OUTPUT_REJECTED / UNSUPPORTED_FINANCIAL_CONTENT. 요청 ID pass 4410a1b0-2b81-4cb0-8086-aff3d8991570, buy f15c4619-0cec-4ada-9e87-8285d32bf9e0, sell 86c545f0-3f51-4d6e-836c-c11aa620f235, target 4261a100-bb4e-4c96-9fa2-c836cd41873e. 추가 GPT 호출 0회.
- 브라우저 증거 `work/finance-ko-browser/native-browser.json`, 화면 `work/finance-ko-browser/native-all-analysis.png`, 테스트 XML `work/finance-ko-browser/be/build/test-results/test/`. 외부 검수용 통합 패치 `work/finance-ko-browser/korean-browser-candidate.patch`, SHA-256 `58cf2fb0ebec06a1053b3a7edd83e180469b07dbd6294c4f87cb64b507f8021b`. 기준 BE에 적용 검사 통과. 외부 독립 검수 대기.

## Carelog 방문 준비 승인과 합성 검증

- Jira RPL-62는 HOLD이며 백엔드 계약 확정 대기다. Confluence Carelog 로드맵은 PROPOSED / NOT_EFFECTIVE다. 향후 승인된 워크스페이스 → 고객 → 예정 방문 범위에서 브리핑하는 방향이다. [RPL-62](https://ranikunlabs.atlassian.net/browse/RPL-62) · [Carelog](https://ranikunlabs.atlassian.net/wiki/spaces/RLAB/pages/753665/Carelog)
- Git 조회 당시 원격 Carelog BE dev `5d6aa88cdf44d01ca07a8fa8265a8c7cb0c2a995`, Carelog Architecture main `aba36e32b1805c0d38cc7d129fcf4219c9e50047`, Shared AI Architecture main `f60551b46a99c96b05e85737807d137a8c306791`은 정본 조회 시점의 참조다. 방문 준비 구현 승인에 연결된 고정 SHA는 미확인이다.
- 합성 시나리오 1. 권한이 있는 W1/C1의 예정 방문 E1을 조회하면 승인된 범위의 데이터와 출처 참조만 반환한다.
- 합성 시나리오 2. 다른 워크스페이스·고객, 소속이 다른 방문, 철회된 권한은 조회나 모델 실행 전에 차단하고 내용·출처를 노출하지 않는다.
- 합성 시나리오 3. 결과의 기록 기반 주장은 허용된 출처 참조와 일치해야 한다. 참조 누락·불일치는 결과를 표시하기 전에 거절한다. 브리핑 생성만으로 Carelog 기록을 자동 저장하지 않는다.
- AI 방문 준비 테스트는 계약 HOLD로 NOT_RUN이다. 별도로 원격 Carelog BE dev `5d6aa88cdf44d01ca07a8fa8265a8c7cb0c2a995`에서 기존 비AI 고객·방문권한 테스트 30건을 Gradle 8.13·JDK 17·합성 Testcontainers PostgreSQL로 실행했다. 실패·오류·스킵 0건. 타 조직의 고객 조회·수정과 방문 조회 404, 고객별 방문 필터와 인증 경계를 확인했다. XML `work/carelog-auth-check/carelog-be/build/test-results/test/`. 최근 완료 방문 3건 + 더보기는 Product Owner 결정 대기다. [Personal AI R&R](https://ranikunlabs.atlassian.net/wiki/spaces/RLAB/pages/26411011/07-1.+Personal+AI+R+R)

## Finance 일지 AI 복기 후보 검증

- RPL-138의 승인 범위는 본인 일지 1건의 내부·비영구 복기다. 권한과 PolicyGuard를 먼저 확인하고 기록 사실·사용자 추론·누락 근거·중립 질문을 출처와 함께 검증한다. AI 결과와 원본은 저장하지 않는다. 별도의 수동 복기 명시 저장은 기존 흐름이다. [RPL-138](https://ranikunlabs.atlassian.net/browse/RPL-138)
- 별도 Draft PR #13의 고정 후보 `11adc572a99730bfe16f6c124c21275b01b704be`, 트리 `8b727e85ddd8dcd1289906cc7efce7025d627b19`에서 지정 테스트 40건 통과. 누락·타인 기록, 권한·정책, 인용 결속, 미지원 출력, 저장 불변을 검증했다. 증거 `work/finance-journal-ai-candidate/build/test-results/test/`. [PR #13](https://github.com/ranikun-labs/finance-harness-be/pull/13)
- 기준 BE `4a8e5bd1c9249ad238adefc26bd8564b50f46db4`의 수동 복기 통합 테스트 3건 통과. 소유자·타인·인증·삭제·이전 리비전·저장 동작을 검증했다. 증거 `work/finance-journal-pinned/build/test-results/test/`. 후보는 이 BE에 미통합이며 한국어 사용자 화면과 AI 결과 저장은 미검증이다.

## 다음 행동과 작업 큐

| 영역 | 현재 상태와 근거 | 다음 행동 |
|---|---|---|
| Finance Agent | 일반 분석은 모의 화면 표시 통과, 실모델 Finance 거절. 고정 커밋과 요청 증거는 위 참조 | 아래 패치의 외부 독립 검수 |
| 일지 AI 복기 | 고정 BE 수동 복기 3건과 별도 Draft PR #13 내부 비영구 AI 복기 후보 40건 통과 | 후보 통합 대상과 한국어 화면 계약 확인 |
| Shared AI | 고정 Platform의 격리 Finance 연동에서 실제 OpenAI 응답 수신 확인. Finance가 최종 출력 검증 소유 | 승인된 소비자 연동의 실행·Evidence 계약을 재사용하고 출력 객체와 검증 책임 유지 |
| Carelog AI | Shared AI Consumer Use-Case Matrix에 치료 준비 설계 초안이 있다. 최근 완료 방문 3건 + 더보기 결정 대기 | 백엔드 계약 확정 후 승인된 SHA에서 아래 합성 검증을 실행 |
| 대화 Context | Shared AI ADR-0004가 실행 범위와 격리 메타데이터를 정의한다. 대화 문맥 기능의 확정 구현·검증은 미확인 | 다음 승인 작업에서 턴 문맥의 범위, 수명, 권한을 정본에서 확인 |
| 명시적 Memory | 운영 OFF. 승인된 운영 활성화 작업 없음 | 명시적 저장·조회·삭제의 승인 범위와 검증 증거를 확인한 뒤 진행 |

Shared AI 설계 확인 리비전은 `shared-ai-architecture@0882173ccb1f91ce085f6828e00bfc67090351ba`다. 후속 작업이 들어오면 기존 결정과 고정 SHA를 대조하고, 사용자 기능과 이번 범위를 먼저 공유한다. 승인 범위 안의 구현·테스트·독립 검토를 이어가며 단순 실행과 증거 대조는 경량 실행자에게 맡긴다.

## 2026-11-27 일지 복기·방문 준비 설계 수락 이후 인수 계획

- Finance Docs #24 병합 `fb058948572c9e943176530cf0fa003d7e901a66`. Owner는 결정적 한국어 템플릿과 승인된 질문 우선의 설계 방향을 수락했다. RPL-138 내부 합성 구현 위임은 별도다. [Docs #24](https://github.com/ranikun-labs/finance-harness-docs/pull/24) · [RPL-138 승인 기록](https://ranikunlabs.atlassian.net/browse/RPL-138?focusedCommentId=10879)
- Finance BE main `06cbfc83c6bae707313999f68751d37e72f58d62`과 Draft #17 `c305788e2e1b1ba6575afb230d133ce78be3fb82`은 분기했다. #17 전용 5커밋, main 전용 40커밋. #13 `11adc572a99730bfe16f6c124c21275b01b704be`은 각각 4·51커밋. #17 통합 후보와 #13 근거를 재사용한다. main의 인증·일지 조회·revision·삭제·수동 저장을 보존하고, 정확 근거 결속·한국어 결정적 출력·반환 전 권한과 revision 재확인 및 늦은 응답 폐기를 F-01~08에 매핑한다. 기존 CI와 정적 검수는 기존 고정 후보의 근거다.
- Carelog Architecture #5 병합 `839ad3ded1d6b909edc61dbf99a9618e0cea18a2`. Owner는 현재 유효 Assistant 세션 안에서 임시 결과 유지 방식을 수락했다. BE 기본 브랜치 dev `5d6aa88cdf44d01ca07a8fa8265a8c7cb0c2a995`는 관측 기준이며 승인 구현 핀은 아니다. PLANNED 합성 후보도 별도 구현 승인 및 Writer 인수가 필요하다. RPL-62 HOLD, 실제 메모 저장 BLOCKED, 최근 완료 방문 3건 + 더보기 결정 대기. [Docs #5](https://github.com/ranikun-labs/carelog-architecture/pull/5) · [RPL-62 승인 기록](https://ranikunlabs.atlassian.net/browse/RPL-62?focusedCommentId=10880)
- 두 트랙의 기존 Jira·PR·로컬 worktree를 확인했다. 활성 구현 Writer Task ID·점유·위임 수락은 확인되지 않았다. PR 작성자 및 이전 Worker ID는 현재 Writer 점유의 근거가 아니다. 기존 Writer에게 인수 가능 여부를 확인하고 Owner가 범위와 위임을 승인할 때까지 신규 핵심 구현은 시작 전이다. 운영 Memory OFF. 공개 API·FE, 실데이터·실모델, 병합·배포 별도 승인.

### 위임 재확인과 기준 갱신

- Finance BE main `06cbfc83c6bae707313999f68751d37e72f58d62`, Draft #13·#17 SHA는 유지. 최신 Jira 구현 위임과 활성 Writer 수락·점유 근거 미확인.
- Carelog BE dev는 `a68f11892cee6547d6f1b3c9dcf63903569f7191`로 4커밋 전진. 내부 인증·루프백·배포 기반 변경이 포함된다. 기존 권한 30건 결과는 이전 `5d6aa88c`에만 귀속한다. 현재 RPL-62 BE PR과 위임은 미확인. HOLD·실제 저장 BLOCKED 유지.
- 두 신규 구현, 새 후보의 합성 검증, 추가 실모델 호출은 NOT_RUN. Finance 일반 분석은 독립 검수 ZIP 첨부 문제로 별도 추적한다.

### Owner 위임 후 로컬 합성 구현 결과

- Finance `ad464848e286214e7955ccab0472cba535fcb786` (base `06cbfc83`), 합성 45/45. 한국어 렌더링, 정확한 필드·revision, 반환 직전 소유자·원본 재확인. F-01 가정 부재/구체 가정 구분 미완료, F-06 선택·취소·삭제 후 복원·경쟁 미검증. 새 Hosted CI·외부 독립 검수 NOT_RUN.
- Carelog `241af5703e5be9e9eee50104eef46ae7b71f74af` (base `a68f1189`), 합성 7/7. 미연결 단일 PLANNED fixture에서 출처·세션 재열람·늦은 응답 차단을 검증. 실제 인가·범용 기록 선택·Consumer 통합 미검증. RPL-62 HOLD와 실제 저장 BLOCKED 유지.
- 외부 검수용 패치·XML·절차 ZIP `work/product-ai-external-review.zip` SHA-256 `7f1acd8518fb60b3cffb8de6672b2cc655a3d61a687d0693861910c4b555d70b`. 원격 게시 및 외부 검수 미실행. 기존 Writer의 활성 점유는 확인되지 않아 두 기존 PR 브랜치를 보존하고 별도 사본에서 작업했다.

### GPT-6.2 Sol Medium 독립 검수 결과

- Finance `ad464848e286214e7955ccab0472cba535fcb786` 수정 필요. 고정 HEAD 격리 재실행 45/45. MAJOR 2건. F-01 사용자 판단 전체를 미확인 가정으로 반복해 구체 가정과 가정 없음 구분 누락. F-05 Evidence 내부 참조의 허용 범위 및 revision 결속 검증 누락. 서버의 반환 직전 소유자 범위와 원본 snapshot 재조회 확인. 실제 권한 철회·UI 취소/선택, Hosted CI 및 실모델 NOT_RUN. 증거 `work/finance-rpl138-independent-review/build/test-results/test/`.
- Carelog `241af5703e5be9e9eee50104eef46ae7b71f74af` 수정 필요. 고정 HEAD 집중 테스트 7/7 재실행. P2 2건 별도 합성 재현. 단일 fixture 검사 전에 미승인 이력을 생성기로 전달함. 선택과 불일치하는 이전 요청이 정상 최신 결과를 지움. CRM 쓰기 경로 부재 확인. 실제 인가·CRM·FE·Shared AI·Hosted CI·실모델 NOT_RUN.
- 본 검수는 구현 Writer와 분리해 진행했다. 두 후보의 수정은 시작 전이며 RPL-62 HOLD, 실제 메모 저장 BLOCKED 유지.

### 독립 검수 지적 수정 후보

- Finance `77cb737e2813bf2c915d8bf2f33373d573f29dd0` (부모 `ad464848`, tree `b7edaa3d3a134d6471991415cb753846636516df`) 합성 45/45. F-01 지원하는 한국어 표현 두 유형의 명시 가정을 정확 인용하고 미탐지·부정을 구분. F-05는 기존 opaque source refs에 일지·필드·revision 규약 및 생산자 부재로 BLOCKED. 누적 패치 `work/finance-rpl138-premise-full.patch`.
- Carelog `43ab712f64316d78f5e0d011d81c70a6371632a4` (부모 `241af570`, tree `7b9e82dd07f50fcb1b6eab8da6b30610d5ada7d4`) 합성 9/9. 미승인 기록 생성 전 차단, 늦은 다른 선택의 요청이 진행 중·완료 최신 결과를 보존. 누적 패치 `work/carelog-preparation-candidate-v2.patch`.
- 두 새 후보의 독립 Delta 검수와 Hosted CI는 NOT_RUN. 실모델·원격 쓰기 0. RPL-62 HOLD, 실제 저장 BLOCKED, 운영 Memory OFF.

### 수정 후보 독립 Delta 재검수

- 기존 GPT-6.2 Sol Medium 검수자 재사용. Finance `77cb737e2813bf2c915d8bf2f33373d573f29dd0`: 기존 합성 45/45 PASS, 별도 컴파일 코드 가정 검사 5/8 PASS. F-01 OPEN/MAJOR, ‘예상 안 했다’·‘생각하지 않았다’ 오분류와 앞 절 혼입 재현. F-05 계약 BLOCKED. 전체 수정 필요.
- Carelog `43ab712f64316d78f5e0d011d81c70a6371632a4`: 로컬 합성 Delta PASS, 9/9, 기존 P2 두 건 CLOSED, 새 지적 0. 미승인 입력 생성기 0회, 이전 선택 조회 0회와 최신 결과 보존, 권한 철회 후 응답 폐기 확인. 실제 연동은 NOT_RUN, RPL-62 HOLD·저장 BLOCKED 유지.

### Finance F-01 부정 표현·인용 경계 수정 후보

- HEAD `0ff916074776dbe719a264547b67cdb61a2235c5`, 부모 `77cb737e2813bf2c915d8bf2f33373d573f29dd0`, tree `d1006acf2b4c86112e9431eb8ab546a06f1ea29e`. 새 회귀 3건은 수정 전 실패, 수정 후 전체 48/48 PASS, 스킵 0. 작업자 환경에서 이전 독립 검사 8/8 재실행 PASS. 새 HEAD의 독립 Delta는 NOT_RUN.
- ‘예상 안 했다’와 ‘생각하지 않았다’는 긍정 가정으로 분류하지 않으며, 앞 절이 있는 사례는 해당 가정 원문만 인용한다. 제한된 긍정 표현 이외에는 지원 범위에서 미탐지로 표시한다.
- 증분 `work/finance-rpl138-negation.patch`, 누적 `work/finance-rpl138-negation-full.patch` SHA-256 `ea7eb4a27d3ee688a850207c7d166f6fe990255d4ffa16a5b5889bddf8903f37`. F-05 BLOCKED, Carelog 변경 없음. 실모델·원격 쓰기 0.

### 구현 중 검토 운영 방식

- Owner 결정: 수정 단위마다 독립 재검수를 반복하지 않는다. 승인된 구현을 계속 진행하면서 필요한 합성·회귀 테스트와 증거를 쌓는다. 구현 범위가 끝나면 고정 후보 및 남은 이슈를 모아 독립 검토를 한 번 진행한다. 앞선 항목의 즉시 Delta 재검수 제안은 이 결정으로 대체한다.
- Finance F-01의 다음 독립 검토는 최종 검토에 포함한다. F-05 출처 계약 결정 및 RPL-62 HOLD·저장 BLOCKED는 기존 범위를 따른다.

### MVP 착수 후 계약 결정안

- 기존 Terra Low 작업자 `fin_resume`·`care_resume` 병렬 재사용. 이 실행의 별도 F4 런타임 관측 및 Fast 상태는 UNKNOWN. 신규 구현·테스트·독립 검수 NOT_RUN. 승인된 로컬 합성 후보 유지.
- Finance 출처 결속 결정안 `work/finance-f05-decision/decision-packet.md`. 추천은 요청 범위 opaque snapshot 참조의 Finance 소유 매핑 및 신뢰 생산자 검증. ProductTool/Context 전달 경계와 단일 사실 포트에서 묶음 또는 필드별 사실 처리 결정을 함께 승인해야 한다. Conversation과 시장자료 범위 미승인.
- Carelog Consumer·명시 저장 결정안 `work/carelog-consumer-save-decisions.md`. 기존 전체 메모 교체 경로에는 클라이언트가 본 버전과 저장 의도 식별자가 없어 동시 편집·재전송 계약이 필요하다. RPL-62 HOLD·실제 저장 BLOCKED·3건+더보기 제품 결정 대기를 유지한다.

### dev-main-flow MVP 병렬 실행 체크포인트

- oh-my-ai master `a5c96a6cae636128fcaeac53785b3da1ad9f70e3` dev-main-flow/F4 `MANUAL_READ_APPLY`. UTC 시작 2026-11-27T09:56:33Z, 예산 60분, 마감 2026-11-27T10:56:33Z, 종료 2026-11-27T09:59:19Z. Finance·Carelog Writer 재사용, 실효 설정 UNKNOWN.
- Finance/Shared AI: Platform main `e6b7ad43511315194c3c6fb7dd016f31b3345917`에서도 단일 opaque sourceReference 생산 계약 유지. F-05 OWNER_GATE. `work/finance-mvp-handoff.zip`에 최신 패치, 기존 XML, F-05 14개 합성 시나리오(NOT_RUN) 준비. Conversation/OpenDART Docs #25 Draft·NOT_EFFECTIVE.
- Finance 일반 분석: 기존 ZIP 무결성 확인. 채팅 첨부 경로 부재로 외부 전달 BLOCKED 유지.
- Carelog: dev `a68f1189`, 후보 `43ab712f` 및 기존 합성 독립 PASS 유지. 패치가 고정 diff와 일치. 실제 Consumer/명시 저장 OWNER_GATE, RPL-62 HOLD, 저장 BLOCKED. 기존 원격 Writer 점유 확인 불가.
- 신규 제품 코드·테스트·독립 검수·CI·배포 NOT_RUN. 기존 후보는 미병합. AI 현황 구조 부분 검사는 통과했다. 증거는 `work/mvp-f4-ai-status.md`.

### MVP 추천안 수락 후 병렬 후보

- Finance 일반 분석: 로컬 HEAD `3d10af33bdb9b6b438ec3bda7b8dc2c8958133b4`, base `4a8e5bd1`, tree `80bdb453aa44934f750f41ea4ee263a0607be0a5`. 순수 한국어 교육 질문 10개 제한 형태, 기존 영어 흐름 및 위험 우선 판정. 일반 회귀 98건 중 92 PASS, 6 SKIP, 실패 0. 합성 브라우저 교육 답변 1건 COMPLETED 및 한국어 화면 표시, 매수·매도·목표가 3건 OUTPUT_REJECTED. 자료 `work/finance-ko-browser/finance-ko-synthetic-evidence-fixed.zip` SHA-256 `b2740868d50c120bd7013e6648ce6940e5ee899c7d009ffe5d248ecd4a8c016a`. 지정 첨부 경로 없음.
- Carelog 예정 방문 준비+저장: 로컬 HEAD `f2a1b4e80051680f6dea94fac887d26ee6deaaac`, 부모 `43ab712f`, tree `991a8e990c44e0f601b4ede499dbe69aca63e4a2`. 기존 9건과 신규 4건, 13/13 PASS. 권한과 신선도, 기존 메모 보존, 저장 의도 중복·충돌은 합성 원자 포트에서 검증했다. 실제 인가·DB·FE 미연결. `work/carelog-preparation-save-candidate.patch` SHA-256 `0a0d4385652a6ed53e29df8f13b89878b8649b0bb869e87d17af0cf8d6ba0177`. 운영 RPL-62 HOLD, 실제 저장 BLOCKED.
- Finance 대화/OpenDART Docs #25 `db1e4476` Draft/NOT_EFFECTIVE로 확인. 보존, 데이터 이용권한, 공개 API 및 새 Primary 범위를 확정하기 전 제품 구현으로 집계하지 않는다.
- Finance 일지 출처 결속 단독 후보 `bf575202e4f6e5d4313ebfba17fae2e3bda238c6`, tree `271cff1b37d06b3c3703a681324ad05d30c4cc4f`, 49/49 PASS. 요청별 opaque 참조와 fact/model graph 검사. 같은 레지스트리를 공유하는 내부 합성 생산자만 허용, 기존 HTTP는 일지 본문 전송 전에 차단. 실제 교차 서비스 생산자 미구현.
- Finance 결합 후보 `24b63d9e29aa27bbf69529944dae4fb333e40629`, tree `bb1eb4f68d160e5af2b9d8743b9511a2cc0b708b`, 원본 main `06cbfc83`. 선택 합성 회귀 74 PASS, 4 SKIP, 실패 0. 일반 분석 정책/출력과 F-05 가드를 로컬에서 결합. 기존 독립 진단 확장 코드 없음. 누적 패치 `work/finance-combined-full.patch`.
- 결합 HEAD에서 한국어 교육 합성 직접 HTTP COMPLETED, 매수 지시 FAILED. FE `024d805f`가 체크리스트 확인 응답 revision을 요구하지만 결합 BE에서는 미반환. 일반 UI 분석 제출·출력 화면 BLOCKED. 근거 `work/finance-combined-evidence/`. 이전 일반 분석 전용 BE 후보의 화면 PASS를 승격하지 않는다.
- 세 후보 증거 ZIP `work/mvp-recommended-evidence.zip` 로컬 생성. 공개 API/FE 수정, 실모델, 실제 데이터, 통합 DB 저장, Hosted CI, 최종 독립 검수 및 원격 쓰기는 미실행. 

### 화면·출처·저장 연결 실행 결과

- Finance 일반 분석 FE `024d805f`와 로컬 BE `8f1e0614e40b3ebba8ae1c1a6babe473c855f0df` (parent `24b63d9`, tree `07e88b564b484fadc01b0bfa95d455f03a227207`). revision 확인 후 교육 답변 화면 표시, 매수 지시 FAILED/null, in-flight 수정·readback stale 차단. 일반 합성 55 PASS/4 SKIP, 실패 0. 구형 클라이언트가 expectedRevision을 생략하면 400, 프로세스 내 저장/락에 한정.
- Finance 일지/Shared AI 합성 브리지 Finance `1f25c2ecaeff8b985c6b632f0c242f76dc99a0c8`, Platform `3dc171356f7afcbf0b5ddd49c770d34c7654e16b`. 실제 Shared AI 핸들러를 실행한 동일 JVM의 시험용 HTTP, 허위 출처 및 두 번째 홉 미인증 거절. Finance 1/1, Platform 8/8. 첫 홉 미인증·공유 레지스트리로 실제 다중 프로세스 신뢰 미입증. 운영 일지 HTTP는 전송 전 차단 유지. 일반 revision과 일지 브리지는 각각 동일 부모의 별도 로컬 후보.
- Carelog `f2a1b4e`의 기존 이벤트 API와 동시성 합성 PostgreSQL 7/7. 조직·MANAGER 확인과 별도 ACTIVE 관계를 발견했으나 접근 권한의 정본 관계로 확인되지 않았다. 기존 메모 전체 교체 PATCH는 새 저장 계약에 연결하지 않았다. 실제 저장 BLOCKED, RPL-62 HOLD.
- 증거 ZIP `work/mvp-integration-evidence.zip` SHA-256 `51f8e1260784ff22bb5f0e8c8bc6dabd511a450f76e1b72049bdf0a44ef5db39`. 실모델·원격 쓰기·배포 0, 마지막 독립 검수 NOT_RUN.

### 병렬 검증 후속 결과

- 실모델 1회 및 답변 원문 검수 명시 승인 후 Finance BE `8f1e0614`, FE `024d805f`, Platform `0ffd37b` 격리 조합 실제 gpt-5.4-mini 1회(자동 재시도 0). 요청 `505bdf11-a4bf-43d5-ae52-698d7aa65b54` 일치, Provider 응답 수신, Finance HTTP 200/FAILED, 화면 답변 미노출. 키는 Platform에만 전달. 작업자 오프라인 재현 1/1: 전체 답변 거절 및 금리 단어가 남는 여섯 필드 단독 거절, 현재 중립 문장 마스크가 응답 문장을 포괄하지 않는다. 세부 rule code는 이 HEAD 로그에 없음. 원문 0600 검수 전용 `work/finance-live-once-20261127/interpretation.txt`, 재사용 ZIP에서 제외.
- Finance 일지 별도 프로세스 합성 HEAD `fe061b7df50d6196ca6b56eeb80ffd53597f891c`, Platform `3dc171356f7afcbf0b5ddd49c770d34c7654e16b`. 2/2 PASS. 양쪽 loopback bearer, 이전 revision 참조 재생 거부. 운영 신뢰·실제 일지 전송 미연결.
- Carelog PostgreSQL 시험 HEAD `6b10a34683a17f8962ba12517b466fdf6393a26b`. 3/3 PASS, 시험 테이블·합성 인가에서 기존 메모 보존, 동시 편집 거부, 동일 저장 의도 1회 반영 확인. 고객 인가 정본·운영 버전/저장 계약 대기. RPL-62 HOLD, 실제 저장 BLOCKED.
- 묶음 `work/mvp-parallel-evidence.zip`. 최종 독립 검수 및 Hosted CI NOT_RUN. 원격 쓰기·배포 0.

### 실제 한국어 답변 재생 및 통합 후보

- Finance 일반 분석 가드레일 변경 `a235f5f1b5470551f7112bc108a3545916d2b842` + FE `024d805f`에서 보관 실답변 재생 COMPLETED, Analysis/Observations 화면 표시, 같은 답변에 매수 지시 추가 FAILED. 추가 GPT 0. 원문과 화면은 비공개 로컬 자료에 유지하고 재사용 묶음에서는 제외. evidenceNote의 '3개'는 실제 근거 건수와 일치하지 않으며 화면 통과가 근거 충실 검증은 아니다.
- Finance 결합 HEAD `f869866d50ced86bf2b71048330f03be0b8075b8`, tree `a930805d96a39d74ee05f1a047c1f525ce50983e`, 77/77 합성 PASS. 원격 BE main 기준 누적 패치 `work/finance-revision-bridge-final.patch`. 브라우저 재생은 가드레일 후보에 귀속. 운영 일지 서비스 간 인증·인가가 없다는 로컬 시험 계약 근거를 확인해 운영 전송 차단 유지.
- Carelog PostgreSQL HEAD `09e35053a436d4578f2050ea2174b017fb6a01cf` 5/5. 단조 버전 시험, 편집·복원 후 stale 거절, 메모/버전/intent 함께 롤백. 승인된 운영 권한·내구 계약 대기, RPL-62 HOLD·실제 저장 BLOCKED.
- 대화/OpenDART Docs #25 `db1e4476` Draft 유지 확인. 묶음 `work/mvp-offline-replay-handoff.zip`. 최종 독립 검수·Hosted CI·실사용 E2E NOT_RUN, 원격 쓰기/배포 0.

### 승인된 mTLS·고객 인가 로컬 통합 검증

- Finance 일반 분석 `e4868c5b6b33f5477c09bf4de1f052eea77bc7b0` 고정, 88 PASS/4 live SKIP. 원본 전 필드 정책 검사 뒤 사용자 evidenceNote를 중립 문구로 교체. 고정 FE `024d805f` 브라우저 재생에서 한국어 답변과 서버 문구 표시, 모델의 근거 개수 문구 미표시, 합성 매수 지시 차단. 사실 검증 전반을 보장하지 않는다.
- 명시 승인된 Finance–Shared AI 로컬 mTLS 일지 시험 `da8b8d438a042af60ba3c83a08f8ac09126bdcfb`, 원본 `e4868c5`, Platform fixture `3dc17135`. 48/48 PASS. 별도 JVM 양쪽 HTTPS, 테스트 인증서, 서비스·작업 권한 검증, 잘못된 CA/호스트명과 무권한·오래된 참조 차단. 시험 인증서/키 폐기. 운영 신뢰/인증 체계와 실제 일지 전송 미연결.
- 명시 승인된 Carelog 인가·저장 로컬 시험 `85fb58e6508354f9514510142d2eca1d4a3141de` 8/8 PASS. 같은 조직의 인증 관리자와 ACTIVE 고객 관계를 로컬 PostgreSQL 트랜잭션에서 확인. 다른 조직·고객, 비활성, 이전 버전, 중복/요청 내용 충돌 검증. 시험용 권한 객체 및 버전/intent 저장 구조. 운영 API/FE·내구 스키마·일반 메모 쓰기·철회 경쟁 미검증. RPL-62 HOLD와 실제 저장 BLOCKED 유지.
- Docs #25 `db1e4476` Draft 유지. 재사용 근거 `work/mvp-local-contract-evidence.zip`. 신규 live, 실데이터, 원격 쓰기 0, Hosted CI·최종 검수·배포 NOT_RUN.

### dev-main-flow 사용자 흐름 통합 게이트

- 현재 고정 후보는 Finance mTLS 로컬 `da8b8d43`, 일반 화면 `e4868c5b`, Carelog 로컬 DB 시험 `85fb58e6`. 작업 트리 clean 및 기존 증거 ZIP 무결성 재확인. 기존 PASS의 SHA 귀속 유지, 신규 제품 변경과 테스트 NOT_RUN.
- 2026-11-27 현 조회 Finance Docs #25 `db1e4476`, Carelog Architecture #6 `ec75eacb`는 Draft/OPEN이며 승인 근거 없음. oh-my-ai dev-main-flow/F4 원문 `a5c96a6` 및 Prompt Preflight PR #217 기준 수동 적용.
- 이번 승인 선택 요청: Finance 일지 로컬 인증 BE·FE 연결, Carelog 로컬 HTTP·FE 및 모든 메모 쓰기 버전 연결, Finance 대화·OpenDART 범위 결정. 이전 승인(mTLS 테스트 및 합성 PostgreSQL 시험)은 완료했고 재요청하지 않는다. 운영 데이터·서비스·저장·배포 미승인, GPT 재호출 별도. 최종 독립 검수는 구현이 모인 뒤 1회.

### 승인된 Finance·Carelog 로컬 BE·FE 화면 연결

- Finance BE `6595db954d9509847cec081dd7c8353e6582abbb`, FE `93257e614b994b031653b4790a39f85565343497`, Platform 시험 `3dc17135`. 고정 조합 Chromium 1/1, FE 10/10. 개발용 일지 화면에 한국어 복기+출처 revision 4. 시험 HTTP로 실제 Finance 서비스 및 별도 JVM Shared AI mTLS 실행. 인증 실패 401 및 이전 revision 409는 조회·모델 실행 전 차단. 일지 상세 GET은 Playwright 합성이며 실제 운영/상시 Spring HTTP 엔드포인트 아님. TypeScript·범위 lint·프로덕션 빌드의 개발 전용 경로 부재 검사 PASS.
- Carelog BE `f8cca791686b359adc1510c6de5d8759ceeb3e33`, FE `9f705c3a652e57308c246b28edabd56a58375276`. 별도 React 개발 패널의 동일 출처 프록시→loopback 시험 서버→실제 로컬 합성 PostgreSQL. 9/9, 브라우저 준비/저장 200, 권한 403, stale 409 및 기존 메모 보존·한 번만 추가. 기존 Assistant 제품 라우팅/실제 Gateway 인가/일반 운영 PATCH는 미연결. RPL-62 HOLD·운영 저장 BLOCKED.
- 패치/테스트/합성 캡처 `work/mvp-ui-integration-evidence.zip`. 실데이터, 추가 GPT, 운영 저장, 원격 쓰기 및 배포 0건. Hosted CI·최종 독립 검수 NOT_RUN.

### dev-main-flow 기존 제품 화면의 로컬 경로 검증

- oh-my-ai `a5c96a6` dev-main-flow/F4, /senior Prompt Preflight 원문 수동 적용. Terra Low 기존 Writer 2명 재사용, 실효 모델·Fast UNKNOWN.
- Finance BE `59eb5c98a2cf9893db5342aed96a75bddfab87c0` / FE `f6e54bbd586d4ad5aaf380f4b63b4caeb2cbee0f`, Platform fixture `3dc17135`. 기존 상세 화면에서 실제 Spring/합성 PostgreSQL GET, 시험 복기 POST 및 별도 JVM mTLS 사용. 고정 SHA 브라우저 1/1, BE 41/41, FE 90/90 PASS. 한국어 결과·출처, 401/404/409, 허용 경로 1 dispatch 및 저장 불변. 시험 게이트웨이 및 test-classpath 복기 endpoint. 운영 통합 아님.
- Carelog BE `980121e9cb02b70c388e02663a335093d08485de` / FE `f3ebdb68f9432609036d2c0a92ef76310e60e7bf`. 기존 AssistantPage/Surface 개발·시험 설정에서 브라우저 준비/저장 200, 미인가 403, stale 409 추가 쓰기 0. 합성 PostgreSQL 9/9 및 FE typecheck. 합성 principal, test-only 버전/의도, 고정 합성 브리핑. 운영 Gateway·일반 PATCH·실제 AI 미연결. RPL-62 HOLD·실제 저장 BLOCKED.
- 현 Finance Docs #25 `db1e4476`, Carelog Architecture #6 `ec75eacb` Draft. 다음 승인 항목은 운영 서비스 인증/출처·Finance 화면, Carelog 운영 인가/저장/모든 쓰기 버전 및 #25 MVP 범위. 추가 GPT 별도 권한. 최종 검수 및 Hosted CI NOT_RUN. 로컬 산출물 `work/mvp-product-route-evidence.zip`, 원격 쓰기/실데이터/배포 0.

### MVP 첫 출시 범위 및 운영 경계 승인 후 실행

- Owner: Finance 일반분석·일지·대화를 첫 출시 범위로 확정. OpenDART는 이용 계약 확정 후 후속, 운영 Memory OFF. Finance와 Carelog 운영 연결 코드 후보는 승인, 실제 데이터·실모델·원격 쓰기·병합·배포는 미승인.
- Terra Low 기존 Finance/Carelog Writer와 대화 Writer 병렬, dev-main-flow/Prompt Preflight 수동 적용. 최종 검수는 구현 묶음 완료 후 1회 유지.
- Finance Journal 원본 `59eb5c98` + 패치 tree `0fcbe617edb8b5bebd71b670b5dc5217e9f0ae06` 51/51, Platform 원본 `3dc17135` + tree `90e6f0434da40d5a46a9edd811d4c8898399475f` 3/3. Finance 데이터 허용 없으면 프롬프트 전에 차단, Platform mTLS test gate의 인증·권한 검사 본문 전, 합성 Spring 브라우저 회귀 유지. 운영 서비스 신원과 허용 필드·보존 승인 대기.
- Carelog BE `ccfce29c9d6b4aa17cad858d1db12ae28335b64c` / FE `101e664ee7c49833e5cd4bc3ada11226f79a5629`. 일반 메모 PATCH version 검증과 FE 보존, 새 시험 Spring 경로 4/4, FE 9/9. 실제 생성 결과/출처/세션 결속·중복 키 보존 정책 및 기존 클라이언트 전환·새 endpoint 브라우저 미완료. RPL-62 HOLD, 운영 저장 BLOCKED.
- Finance 대화 `5f3b177394746418f8555ea44eb8703a35cd597d` 5/5 합성 시험. 운영 대화 DB/HTTP/UI는 보존·삭제·인가 세부 계약 미확정으로 미구현. 결정 문서 `work/finance-conversation-synthetic/CONVERSATION-SYNTHETIC.md`.
- 증거 `work/mvp-approved-candidates.zip`. 새 live·원격 쓰기/배포 0. Hosted CI 및 최종 독립 검수 NOT_RUN.
- 앞선 패치 tree의 최종 로컬 고정: Finance BE `ba128bafd0dd6dfd186184fe6e90593bfbf528f6`, Platform `d6b280044b442d78b077f558c081c894590fdc4c`. Finance 브라우저는 기존 합성 mTLS 핸들러 fixture를 사용했고 새 Platform Spring filter는 별도 테스트다. 같은 배포형 경로에서 맞물린 운영 검증으로 집계하지 않는다.

### 로컬 MVP 종단 간 병렬 결과

- dev-main-flow/F4 및 /senior 원문 수동 적용, 기존 Terra Low Writer 3명 병렬. 최종 독립 검수는 구현 묶음 후 한 번으로 유지.
- Finance 복기 BE `6c396ebdcc42e5452be2e14d8a1cb44e95799665`, Platform `14d78f00387fe2669e54a4678f1a60ae0c359e74`, FE `f6e54bbd`. 브라우저→실제 Spring/PostgreSQL→별도 JVM Platform Spring/Tomcat mTLS→근거→한국어 복기 종단 간 합성 통과. Finance 39/39, Platform 3/3. 401/403/404/409 및 오래된 근거 차단·비저장 확인. 운영 신원·허용 필드·보존 정책 미승인.
- Carelog BE `7591696f67ca286d20127c1557a7612a5369c337` / FE `101e664e`, 13/13. 실제 Assistant 개발 경로 → MockMvc/Gateway 헤더 필터 → 새 시험 Spring 저장 controller → 합성 PostgreSQL. 브라우저 403 무기록, 200 저장, 일반 편집 후 409로 최신 값 보존. 세션·결과 결속은 로컬 시험 브리지에 한정, 실제 Gateway 운영 및 보존 미승인. RPL-62 HOLD, 운영 저장 BLOCKED.
- 대화 BE 합성 `9acb5b1e5cc509b3f6f6637cf9e77f8f795d74e9`, FE 개발 `1a734ff545d2b891ce1e088887ed10d3702ab3b1`. 합성 브라우저 임시 사용→명시 저장→서버 재시작→이어가기→삭제 PASS. 별도 React 개발 진입점 및 Node·합성 Postgres, 기존 제품 경로·운영 인가·턴 검증·보존/삭제 규약 미구현.
- `work/mvp-e2e-local.zip` 로컬 근거. 추가 GPT·실데이터·원격 쓰기·배포 0. Hosted CI 및 최종 독립 검수 NOT_RUN. OpenDART 후속, 운영 Memory OFF.

### 중간 중단 없이 이어서 수행한 로컬 MVP

- Finance 대화 기존 앱 DEV/test 라우트 FE `f5cf6986ea37109d0a4f5d9221baa3c7d88e012b`, 합성 PostgreSQL `9acb5b1e`. 기존 앱 메뉴→임시 사용→명시 저장→서버 재시작→다시 열기→삭제 브라우저 PASS, 기존 라우터 131/131. 플래그 off/프로덕션 빌드에서 비노출 확인. 실제 인가·턴 검증·운영 저장 미연결.
- Carelog 시험 저장 준비 결속 `7b7bf4d600e02155b5f3a2429e13e785690b8c86` 14/14(브라우저 포함), actor/org/session/event/customer/revision/만료 검증, 위조/다른 세션 무기록. 후속 `e3258f1949cbcbb36c41927b0562d5c91b3d6417` 7/7 집중 PostgreSQL. 같은 세션 새 준비와 이전 저장 양쪽 순서에서 동시 수정 직렬화. 브라우저는 앞선 binding 후보에 귀속. 운영 세션/다중 프로세스 결속 미입증, 실제 저장 BLOCKED 및 RPL-62 HOLD 유지.
- 승인 선택 요청을 한 묶음으로 발송: Finance 일지 합성 스테이징 서비스 연결, 대화 운영 설계 전 로컬 저장 계약, Finance 일반 분석 새 GPT 1회. 응답 확인 전에는 의존 작업을 실행하지 않는다. 기존 승인은 재사용한다.
- 로컬 증거 `work/mvp-continuation-evidence.zip`. 추가 GPT·실데이터·원격 변경·배포 0. 최종 독립 검수 NOT_RUN. Docs #25/#6 Draft 유지.

### dev-main-flow 통합 후보 및 Normal Main 인계 준비

- oh-my-ai `a5c96a6` dev-main-flow/F4 수동 적용, /senior Prompt Preflight 적용, 기존 Terra Low 3명 재사용. 독립 검수는 최종 구현 후 1회.
- Finance FE `76f11c9ed99f0211ca265fbb783cf7c1585614b7`에 합성 사용자 선택·전환 및 로그아웃에서 이전 대화 초기화. 이전 f5의 고정 A 사용 문제를 재현 후 수정. FE 131/131, typecheck 및 production bundle marker 검사. 동일 브라우저 통합 1/1: 일지 BE `6c396ebd`·Platform `14d78f00`→대화 BE `9acb5b1e`의 A 저장/B 실제 목록 요청/로컬 로그아웃→일지 재진입에서 이전 임시 응답 미노출. 일지·대화의 synthetic identity는 별도이므로 공통 로그인/전체 로그아웃은 미검증.
- Carelog BE `e3258f1949cbcbb36c41927b0562d5c91b3d6417`, FE `101e664ee7c49833e5cd4bc3ada11226f79a5629` 최신 동일 SHA에서 기존 Assistant 브라우저+세션 경쟁 합성 PostgreSQL 16/16. 403 무기록·200 저장·409 일반 편집 보존. MockMvc 및 합성 주체, 운영 Gateway/저장 미연결.
- Normal Main 승인용 계약 제안 `work/mvp-normal-handoff/owner-decisions.md`. 공통 실제 identity/tenant, 세션 전환과 철회, 개인 일지 필드/보존, 대화 저장/삭제, Carelog 모든 note writer 버전과 저장의도 보존을 명시. 외부 송신 없음. 증거 ZIP `work/mvp-normal-handoff.zip`.
- 추가 GPT·실데이터·원격 쓰기·배포 0, Hosted CI·최종 독립 검수 NOT_RUN. 운영 MVP 아직 미완료. RPL-62 HOLD, 운영 저장 BLOCKED, 운영 Memory OFF, OpenDART 후속.

### MVP 통합 실행 재개 · 2026-11-27

- 시작 2026-11-27 14:47 UTC, 기본 실행 예산 60분, 기준 마감 15:47 UTC. 작업 원문 `oh-my-ai a5c96a6` dev-main-flow/F4 및 `1de26375` Prompt Preflight를 읽어 적용. Native 실행 증거는 없음.
- Git 정본 실조회 Finance Docs #25 `db1e4476`, Carelog Architecture #6 `ec75eacb` 모두 Draft/OPEN. 두 PR 모두 본문상 v0.2 검수 대기. Jira RPL-138은 내부 비영구 복기와 Hosted CI·독립 검수를 수락 기준으로 명시. RPL-62는 설명상 HOLD — BLOCKED_BACKEND_CONTRACT. Confluence Carelog v6는 실제 브리핑을 AI 인수 목표로, Personal AI R&R v13은 Normal/AI 분리 및 Writer 권한 별도 위임을 명시.
- Preflight: 승인된 합성과 운영 완료 조건을 분명히 했다. 앞선 GPT 원문 검수 승인 1회는 요청 `505bdf11-a4bf-43d5-ae52-698d7aa65b54`에서 사용했다. 현재 운영 변경 권한의 확대 근거 없음.
- 병렬 READY: 기존 Terra Low의 Finance 일지·Shared AI 합성 경계, Finance 대화 화면의 요청 경쟁, Carelog 최신 후보 일반 HTTP 경계. 기존 PASS를 재사용하고 미입증 동작만 재현한다.
- REVIEW_ONLY: 기존 Finance 일반 분석 보관 응답 재생, 매수 지시 차단, 근거 표시 정책을 최종 출시 패키지에 유지한다. 최종 후보 묶음에서 외부 독립 검수 1회. RPL-138 기존 독립 검수 지적은 해당 지적이 해소된 최종 HEAD로 확인해야 하며 과거 HEAD 판정을 전용하지 않는다.
- OWNER_GATE: Finance 일지 서비스 신원·실제 전송 허용 필드·보존, 대화의 공통 로그인·저장·삭제 계약, Carelog 실제 consumer·인가·공통 메모 revision/멱등성. 별도 실모델 승인과 병합·배포 권한은 기존 권한 경계를 따른다. OpenDART 후속, 운영 Memory OFF, 최근 완료 방문 3건 + 더보기 제품 결정 대기.
- 최종 MVP 수락 기준: Finance 한국어 분석 실제 성공 화면과 금지 출력 차단, 실제 사용자 경계에서 본인 일지 근거 복기 및 권한·revision 변경 후 결과 폐기, 동일 사용자의 대화 저장·복구·삭제와 교차 사용자 차단, Carelog PLANNED 출처 브리핑과 명시 저장 및 모든 메모 작성자의 충돌·재전송 검증. 계약 확정 뒤 각 트랙을 동시에 연결하고, 최종 HEAD 고정 → 해당 CI → 외부 독립 검수 1회 → 별도 승인된 병합·배포 → 대상 환경 수락 확인 순서.

**통합 실행 결과 · 2026-11-27 14:51 UTC**

- Finance 대화 FE `2b654991de90ccd22c00251e9ded5500d04626f6`에서 합성 사용자 전환·로그아웃 시 진행 중 요청을 취소한다. PostgreSQL이 A의 메시지를 반영한 뒤 응답을 지연하고 B로 전환한 브라우저 재현에서 후속 완료 요청 0회, A 결과 노출 0건. 기존 저장·복구·삭제 흐름, flag-off, typecheck PASS. 서버에 이미 반영된 A 메시지와 pending 실행의 복구는 운영 대화 계약에서 정해야 한다.
- Finance 일지 FE에서 A 처리 중 A→B→A 후 로딩이 남는 문제를 수정했다. 선택·revision 변경 시 상태 초기화 및 늦은 응답 폐기. 합성 3/3 및 타입 검사 PASS. 두 수정을 쌓은 FE `84822b1bb00a6894c44a1c7c6d692b5bc218d62b`, tree `c544891fe18fd8dfcec0cc9ebb28c576b3da7dc5`. 같은 FE의 일지·대화 통합 브라우저 1/1, BE `6c396ebd`, Platform `14d78f00387fe2669e54a4678f1a60ae0c359e74`, 대화 BE `9acb5b1e`. 공통 로그인/전체 로그아웃 미입증.
- Carelog BE `175452a36f583bda8200f7b39f6f5c52f623fa16`, tree `111a3eea67c7164cf446285fb911c90d1c17fb0b`, FE `101e664ee7c49833e5cd4bc3ada11226f79a5629`. 10/10 PASS. 기존 Assistant → 시험 프로토콜 브리지 → 실제 루프백 Spring HTTP → 합성 PostgreSQL. 403 무기록, 200 저장·재전송 한 번, 409 충돌 및 일반 HTTP PATCH 최신 메모 보존. 브라우저는 합성 인증과 세션을 사용. 세션 경합 7/7은 이전 BE `e3258f1`에 귀속.
- 추가 실모델·실데이터·원격 변경·배포 0. Hosted CI·최종 외부 독립 검수·운영 수락은 NOT_RUN. RPL-62 HOLD, 실제 저장 BLOCKED. 운영 MVP 연결은 앞서 기록한 Normal Main 정본 인증·인가 및 저장 계약에 의존한다. 해당 초안은 현 세션 보관, 외부 송신 없음.
- 확인한 기존 병합 설계: Finance Docs #24 `fb058948572c9e943176530cf0fa003d7e901a66`, Carelog Architecture #5 `839ad3ded1d6b909edc61dbf99a9618e0cea18a2`. 이 승인 범위를 운영 계약 Draft에 확대하지 않는다.
- 새 증거/패치/화면 포함 `work/mvp-normal-handoff.zip` SHA-256 `3e642f7f290d9bddb8f9ee23ec2bba7756a96b2c86cb34ccb83ac58a3f33b3f4`. 검증 가능한 로컬 추가 항목을 완료했고 남은 운영 연결은 계약 승인 대기. 외부 Writer의 현재 점유와 Native Skill 실행·실효 모델은 확인되지 않았다.

### Normal Main 회신 인수

- 공통 Identity는 사용자·세션, 각 제품은 데이터 권한을 담당한다는 원칙 확인. 계정 전환·전체 로그아웃·처리 중 권한 철회 및 적용 SHA는 미확정.
- Finance의 명시 저장 Journal과 임시 AI 결과의 구분 및 Shared AI의 제품 API 경계 확인. 실제 전송 필드, 서비스 인증·작업 권한, 대화 보존·삭제·복구는 미확정.
- Carelog 명시적 확인·편집 후 저장 원칙 확인. 실제 관리자·고객 인가, 결과·세션 결속, 메모 공통 버전·중복 방지 계약과 적용 SHA는 미확정. RPL-62 HOLD 및 운영 저장 BLOCKED 유지.
- Normal Main이 자료를 찾지 못했다고 회신. 이 환경에서 /workspace/work/mvp-normal-handoff.zip 및 본 노트 존재와 ZIP 무결성 확인. ZIP SHA-256 3e642f7f290d9bddb8f9ee23ec2bba7756a96b2c86cb34ccb83ac58a3f33b3f4. 별도 환경에서는 실제 파일 전달 필요. 실제 운영 계약 승인으로 간주하지 않는다.
