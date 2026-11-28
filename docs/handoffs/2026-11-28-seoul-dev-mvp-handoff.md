---
handoff_id: seoul-dev-mvp-20261128
title: Carelog·Finance 서울 DEV MVP 인계
status: draft
created_at: 2026-11-28
created_by: Normal Main Codex
reviewed_at: null
reviewed_by: null
source_session: Normal Main
target_context: Codex Cloud Normal Main
scope: 기본 MVP 배포 준비 및 AI 운영 계약 인계
source_of_truth_refs:
  - docs/handoffs/README.md
  - docs/decisions/decision-log.md
supersedes: []
superseded_by: []
retention_owner: Normal Main
retention_reason: 세션 간 배포 상태와 승인 경계 보존
archive_condition: 서울 DEV 인수 완료 및 후속 기록 연결
---

# Carelog·Finance 서울 DEV MVP 인계

기본 MVP는 두 제품에서 초대 없이 가입하고 비밀번호로 로그인한 뒤 데이터를 저장하고 새로고침 후 다시 열 수 있어야 한다. 두 번째 계정의 접근은 서버에서 거부해야 한다. Carelog는 고객·일정, Finance는 저널로 검증한다.

| 작업 | 확인된 근거와 현재 상태 | 다음 작업과 담당 |
|---|---|---|
| 이미지 | 서울 ECR에서 Core `b38996ef…152c`, 8443 프록시 `aee3aa12…980d`, trust-init `6ceb52e0…6d81` 확인. TLS 소스 `1ad65fb3`. 프록시는 빌드 중 Cloud 프록시 CA를 마운트했고 최종 이미지에는 포함하지 않았다는 발행 보고가 있다. | Normal Main이 기존 발행본을 사용하고 배포 입력에서 전체 digest를 검증한다. |
| 인프라 | [후보 B](https://github.com/ranikun-labs/platform-infra/commit/865138736fa38a18171cb566720a12e21ec587c6)의 세 루트가 Terraform 1.10.5 validate 통과. 가입 ON·Finance 생성 plan은 NOT_RUN. AWS 상태 조회에서 Core :3, Gateway :3, Carelog :6 및 구 Core용 Carelog 8080 ingress를 확인했다는 보고가 있다. | Normal Main이 보존 입력을 대조하고 Carelog 단독 plan 가능 여부부터 확인한다. Finance 서비스·태스크 패밀리와 롤백 기준은 신규 생성으로 다룬다. |
| Finance 설정 | 새 세션의 AWS 메타데이터와 Terraform 참조 조회에서 Finance DB 전용 Secret 및 Gateway↔Finance trusted-context Secret의 기존 참조를 찾지 못했다. | DB 담당자와 Normal Main이 DB URL 대상, 전용 계정과 스키마 권한, 필요한 Secret 참조 및 ECS 실행 역할 권한을 정리해 생성 승인을 요청한다. |
| DB·Valkey | 실제 Flyway 이력 미확인. 소스 체크섬은 Core V3 `1006919839`, Carelog V9 `1045282328`, Finance V5 `882677658`. Valkey TLS의 태스크 설정은 확인됐고 실제 핸드셰이크는 미확인이다. | DB 담당자가 승인된 VPC 읽기 경로에서 적용 상태와 TLS 연결을 확인한다. |
| Worker | 실제 Worker·도메인·Gateway 연결·가입 및 로그인 요청 제한 미확인. Finance 후보 이름은 `finance-fe-dev`와 `finance-harness-fe-dev`. | Cloudflare 담당자 또는 승인된 읽기 경로에서 실제 대상과 설정을 확인한다. |
| AI | [고정 인계](https://github.com/ranikun-labs/harness-foundation-docs/tree/e71cb3d14eee230d4efcccaccf8a7adeeb7b2523/docs/handoffs/2026-11-27-ai-mvp)의 합성 검증을 재사용한다. Finance FE `84822b1b` 사용자 전환 및 Carelog BE `175452a3` 경합 7/7은 후속 세션 보고이며 해당 원격 인계에 미반영이다. | Normal Main이 공통 인증·철회, Finance 전송 필드·대화 보존, Carelog 메모 버전·중복 방지 계약을 정리한다. AI Main은 기능 구현과 최종 검수를 담당한다. RPL-62 HOLD, 운영 저장 BLOCKED, 운영 Memory OFF. |

AWS SSO는 Cloud 런타임별로 새 로그인이 필요할 수 있다. 새 세션의 환경 설정과 실제 엔드포인트 접근을 확인한다. 이전 Cloud에서는 IAM·ELB 조회가 네트워크 정책에 막혔고, AWS 로그인에 성공한 세션에서도 Finance Secret 참조는 확인되지 않았다.

Terraform plan, DB 및 Worker 확인은 병렬로 진행한다. 계획에서 기존 서비스 교체·삭제 여부와 롤백 경로를 확인한 뒤 ECS·Worker 배포 및 필요한 화면 반영을 한 번에 승인받는다. Terraform apply, 배포, 실제 AI 데이터 전송과 저장은 별도 승인 범위다. 자격증명과 보호 입력은 승인된 비공개 경로에서 관리한다.

## 문서 위치와 담당

| 기록 | 저장소와 경로 | 담당 범위 |
|---|---|---|
| 서울 DEV 전체 현황 | `harness-foundation-docs/docs/handoffs/2026-11-28-seoul-dev-mvp-handoff.md` | Normal Main이 배포·인수 상태와 다음 승인 대상을 갱신한다. |
| AWS 배포와 롤백 | [platform-infra/docs/seoul-dev-deployment-handoff.md](https://github.com/ranikun-labs/platform-infra/blob/4f9610ce2d2b5d276f43fc91d156bc021ba8157a/docs/seoul-dev-deployment-handoff.md) | 인프라 담당이 Terraform 입력, ECS·ECR 연결, DB 검증과 롤백 절차를 기록한다. |
| 공용 인증과 라우팅 | [platform-services/docs/runbooks/seoul-dev-auth-routing.md](https://github.com/ranikun-labs/platform-services/blob/52693d511271b52fa0babd53f3552791bf912c1a/docs/runbooks/seoul-dev-auth-routing.md) | Core·Gateway 담당이 가입, 요청 인증, 라우팅, 로그아웃 동작을 기록한다. |
| Carelog 제품 인수 | [carelog-architecture/architecture/mvp-acceptance.md](https://github.com/ranikun-labs/carelog-architecture/blob/c40fb5fc24d19c80a8a2daa98c4aa067cf1d2534/architecture/mvp-acceptance.md) | Carelog 담당이 고객·일정과 계정 격리의 브라우저 인수 근거를 기록한다. |
| Finance 제품 인수 | [finance-harness-docs/05-product-legal-ops/mvp-acceptance.md](https://github.com/ranikun-labs/finance-harness-docs/blob/cc1fe6801a95a52f802bb59d32b2035d222e51bf/05-product-legal-ops/mvp-acceptance.md) | Finance 담당이 저널과 계정 격리의 브라우저 인수 근거를 기록한다. |
| AI 후보와 합성 증거 | [AI Main 고정 인계](https://github.com/ranikun-labs/harness-foundation-docs/tree/e71cb3d14eee230d4efcccaccf8a7adeeb7b2523/docs/handoffs/2026-11-27-ai-mvp) | AI Main이 후보·실행 증거·독립 검수를 관리한다. |

위 링크는 각 문서를 기록한 고정 커밋을 가리킨다.
