---
title: Runtime Healthcheck and CI Failure Diagnosis
status: draft
implementation_status: partially_verified_nonprod
owner: architecture
last_reviewed: 2026-10-23
source_inputs:
  - https://github.com/ranikun-labs/platform-services/pull/35
  - https://github.com/ranikun-labs/platform-services/actions/runs/39916789876
  - https://github.com/ranikun-labs/platform-services/actions/runs/39918713612
related_adrs:
  - ADR-0017
  - ADR-0020
---

# Runtime Healthcheck·CI 실패 분류 — Gateway/Identity/Carelog

## 1. 목적·정본 관계

CI가 빨간색이라는 사실만으로 **제품 코드 장애**로 결론 내리면 안 된다. 이번 문서는 부팅/의존성/포트/Healthcheck/제품 테스트 실패를 구분하고 다음 기능 개발에도 **동일한 검수 기준**을 적용하도록 하는 **Draft Architecture/운영 검증 지침**이다.

- **제품 증거 정본:** [RPL-55 G4 원인·해결·검사 로그](https://github.com/ranikun-labs/platform-services/blob/def052bc5f7d3c7d477cc1f3c594f5d7fea7f770/docs/testing/evidence/rpl-55-g4-ci-failure-analysis-20261023.md) / [E2E 16/16 기준선과 선택 실행 계약](https://github.com/ranikun-labs/platform-services/blob/f2cc25f650203f22bef7e665cbe91ed76bfa22fd/docs/testing/evidence/rpl-55-g4-e2e-baseline-and-test-selection-20261023.md)
- **Jira:** [RPL-55](https://ranikunlabs.atlassian.net/browse/RPL-55)는 진행 중이며 완료/운영 전환 승인 아니다.
- **Confluence:** Shared Platform/Shared Identity/Carelog는 이해를 돕는 최신 아키텍처 Projection이다.
- **기존 승인 Architecture:** [ADR-0017](../../adr/ADR-0017-shared-platform-gateway-identity-physicalization.md)·[ADR-0020](../../adr/ADR-0020-shared-platform-postgresql-schema-ownership.md). 본 문서는 기존 ADR을 변경하지 않는다.

## 2. 어디서 실행되고 왜 Healthcheck가 실패했나?

```text
[GitHub Actions] BuildKit(Docker 이미지 생성)
             ↓
 [PostgreSQL Identity] [PostgreSQL Carelog] [Valkey] [Fake Kakao]
             ↓
       Gateway (WebFlux / API ingress)
             ↓
       Platform Core Identity (MVC / Auth·JWT)
             ↔ Carelog Internal Claims (Product owner)
             ↓
       Gateway 검증 헤더
             ↓
       Carelog CRM Customer API (MVC)
             ↓
       16개 실제 비운영 HTTP/보안 Assertion
```

**실측 사실:** 첫 G4 [Run #39916789876](https://github.com/ranikun-labs/platform-services/actions/runs/39916789876)에서 Carelog는 Flyway V1~V8 적용 완료·`Tomcat started on port 8080`·Spring 시작 성공. 그러나 Product Dockerfile은 `8081/actuator/health/readiness`(독립 관리 포트)를 확인했고 격리 실행에서는 그 관리 엔드포인트 준비가 되지 않아 `container unhealthy`로 실패했다. 그래서 **제품 HTTP Assertion은 미실행**이다.

**수정:** [Commit `4f6f85e`](https://github.com/ranikun-labs/platform-services/commit/4f6f85e1d05a37b6043dbbf568ca2ba496aa9bf8)에서 **G4 테스트 전용 Compose Override**만 `8080` TCP 접속 검사로 교체. 앱/Prod Dockerfile 변경 없음. [Run #39917815264](https://github.com/ranikun-labs/platform-services/actions/runs/39917815264) 13/13 PASS → [Run #39918713612](https://github.com/ranikun-labs/platform-services/actions/runs/39918713612) 강화 16/16 PASS.

**관측/기준의 분리:**

| 검사 | 무슨 증거인가? | 무엇을 보장하지 못하나? |
| --- | --- | --- |
| `started` 또는 JVM Boot Log | 프로세스·Spring 부팅 | Health·의존성 Ready |
| `8080` TCP 검사 | 앱 Listener 열림 (liveness 가까움) | Actuator readiness, DB/Valkey 연결 또는 Auth API 성공 |
| `8081/actuator/health/readiness` | **관리 포트/Actuator가 활성화된 Profile에서** 애플리케이션 준비성 검사 | 별도 Product E2E 및 Production Rollback 성공 |
| 실제 E2E 16개 HTTP Assertions | 해당 고정 코드·가짜 계정·비운영 DB에서 Auth/Customer/격리 계약 동작 | 실 Kakao, 실 운영 DB/Token, 전체 가입·롤백 |

**구현 검토 규칙:** Profile, `server.port`, `management.server.port`, Actuator 노출 설정, readiness 경로, Docker Image `HEALTHCHECK`, Compose `healthcheck`, 의존 서비스 readiness, 인입 Gateway Route를 비교한다. 임시 테스트 TCP Override를 Production Healthcheck에 복사하지 않는다. 모든 서비스가 8080/8081을 쓰는 것으로 일반화하지 않는다.

## 3. Platform BuildKit 실패도 별도 분류한다

[Run #39909684823](https://github.com/ranikun-labs/platform-services/actions/runs/39909684823), [#39909837157](https://github.com/ranikun-labs/platform-services/actions/runs/39909837157)에서는 BuildKit이 Compose의 Optional Proxy CA Secret 기본값 `/dev/null`을 읽는 데 권한 상승을 요구했다(`--allow=fs.read=/dev/null`). 애플리케이션 부팅 전 차단이므로 제품 회귀가 아니다.

[수정 뒤 성공 Run #39910025905](https://github.com/ranikun-labs/platform-services/actions/runs/39910025905)에서는 **비운영 테스트 Workflow**에 `CODEX_PROXY_CERT=./docs/testing/evidence/.gitkeep`를 지정, BuildKit Workspace 내부 파일 경로를 사용해 정상 빌드·Gateway↔Identity 결합 회귀 120/120 PASS. 기본 Compose의 `/dev/null` 계약을 모든 환경에서 안전하다고 간주해서는 안 되며, 별도 CI 수정 경로를 해당 Runner에서 재사용해야 한다.

## 4. 실패 판별 매트릭스 (다음 개발 표준 후보)

| 실패 위치 | 분류 | 우선 검사 | 검증 후 행동 |
| --- | --- | --- | --- |
| Gradle/Image/BuildKit | `BUILD_ENV` | Proxy·Secret 파일 경로, Cache, Docker/BuildKit 권한 | 해당 Build Step만 재실행 |
| App 시작·Flyway | `APP_BOOT` | Migration 순서/Owner Schema·Env·프로파일·실행 포트 | Startup/DB 표적 테스트 |
| 컨테이너 unhealthy | `PROBE_CONFIG` | Liveness vs Readiness, Healthcheck Port/Path/Timeout, 관리 리스너 활성화 | 환경별 Probe 계약 정렬 뒤 표적 재검증 |
| PostgreSQL/Valkey/Claims 연동 | `DEPENDENCY` | Connection, Healthcheck, Timeout, Retry, Fail-closed | 의존성 통합 테스트 |
| HTTP/API Assertion | `PRODUCT_REGRESSION` | Token Issuer/Audience, Header sanitization, Tenant Owner, API Contract | 기능별 테스트 및 Finding 수정 |
| 재현·로그 부족 | `UNKNOWN` | Run ID·고정 SHA·로그·Active Profile | PASS/FAIL 원인 확정 유보 |

GitHub Actions 자체 경고(구버전 checkout/setup-java)는 **실패 원인과 분리**해서 기술 부채로 관리한다.

## 5. 증거·재검증·운영 승격 규칙

- 반드시 **Issue/PR, SHA, Run ID, 실패 Step, 기대·관측 값, Active Profile·Probe 계약, Root Cause, 수정 Commit, 후속 성공 Run, 남은 위험**을 연결한다.
- 한 번 실패한 Run은 기록에서 지우지 않는다. 대신 `historical_failed → root_cause_identified → fixed_in_test_overlay → verified_success`로 **Finding Lifecycle**을 보존한다.
- 일반 개발은 변경 기능의 Unit/Component/Integration 우선. Auth·신뢰 헤더·조직 격리 계약 변경, 다중 서비스 Fan-in, Production 출시·전환 Gate 때만 전체 E2E 검토한다.
- 비운영 E2E PASS ≠ 독립 Reviewer PASS ≠ Source Merge ≠ Production Readiness/Go-Live.
- RPL-55 Source Merge와 운영 Actuator/포트/보안 Role·데이터·롤백 변경은 별도 Owner 승인을 요구한다.

## 6. 저장소 단위 실측 조회 경계

2026-10-23 GitHub에서 접근 가능한 Ranikun Labs **14개 저장소, 총 15개 Actions Run** 확인. 실패 3건 모두 위의 과거 Platform 실행이며 후속 성공 기록 존재. Carelog BE·Finance BE·oh-my-ai·Shared AI FastAPI PoC에서 조회된 Run은 성공. **9개 저장소에서 조회 Run 0건**은 CI 미설정/미실행/미검증 상태이지 PASS가 아니다. GitHub Actions가 아닌 Jenkins·Codex Cloud·외부 CI 전체 감사는 별도 범위다.
