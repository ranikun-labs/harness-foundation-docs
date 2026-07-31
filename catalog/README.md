# Ranikun Labs System Catalog

## Purpose

이 디렉터리는 Ranikun Labs의 검수된 System Landscape를 AI와 자동화가 먼저
읽을 수 있는 machine-readable Architecture Projection으로 제공한다.

## Canonical Priority

Catalog를 해석할 때 다음 우선순위를 따른다.

1. Accepted Git Architecture / Contracts
2. Merged Repository State
3. Jira Work State
4. Reviewed System Landscape Projection
5. System Catalog Projection

Catalog는 상위 근거를 요약하는 Projection이며 상위 근거를 대체하거나
재정의하지 않는다.

## Explicit Non-role

Catalog는 다음이 아니다.

- Canonical Architecture Contract
- Runtime Service Discovery
- Kubernetes Manifest
- Gateway Route Configuration
- Authorization Configuration
- Production Configuration
- Auto-deployment Source of Truth

## Source Baseline

- Landscape Jira: `RPL-31`
- Confluence Page ID: `2129924`
- Reviewed Version: `3`
- Final Publication Version: `4`
- Review State: `Reviewed — Approved for System Catalog Projection`

## Expected Final Counts

- Systems: `10`
- Communication Relations: `17`
- Data Groups: `19`
- Architecture Gates: `12`

`actors`는 Systems 10개 수량에 포함하지 않는다. Product Client 등 외부
참여자는 `actor.*` ID를 사용한다.

## Stable ID Convention

각 항목은 다음 형식의 Stable ID를 사용한다.

```text
src.<kebab-case>
actor.<kebab-case>
system.<kebab-case>
relation.<kebab-case>
data.<kebab-case>
gate.<kebab-case>
```

정규식 의미는 다음과 같다.

```regex
^(src|actor|system|relation|data|gate)\.[a-z0-9]+(-[a-z0-9]+)*$
```

- 모든 Reference는 표시 이름이 아니라 Stable ID로 연결한다.
- 표시 이름 변경이 ID 변경을 강제하지 않도록 논리 역할 기반 ID를 사용한다.
- `primary_repository`와 `current_implementation_hosts`는 이후 System 항목에서
  별도 필드로 유지한다.
- `release`, `lifecycle`, `verification`은 별도 구조로 유지한다.

## State Separation

Catalog는 다음 상태와 경계를 혼합하지 않는다.

- decision status
- implementation status
- runtime support status
- product release status
- verification status
- logical boundary
- implementation host
- runtime deployment
- lifecycle

예를 들어 Decision의 승인 여부는 구현 완료, Runtime 지원, 배포 또는 출시를
의미하지 않는다.

## Unknown Policy

확인되지 않았거나 아직 결정되지 않은 값에는 의미에 맞게 다음 표현을
사용한다.

- `not_implemented`
- `planned`
- `deferred`
- `repository_unconfirmed`
- `verification_required`
- `gate_dependent`
- `null`

다음 표현이나 값은 사용하지 않는다.

- 빈 문자열
- `TBD`
- `N/A`
- 추측한 Repository
- 실제 Secret
- Credential
- 내부 IP
- 실제 Hostname

## Validation Scope

이번 Catalog Jira에서는 다음 검증을 수행한다.

- YAML parse
- Stable ID uniqueness
- Reference integrity
- Counts `10 / 17 / 19 / 12`
- Jira key / URL format
- Secret / Credential / Private IP 검사
- `git diff --check`

이번 작업은 Repository에 영구 Validator를 추가하지 않는다. JSON Schema,
Validator Script와 CI는 repository-wide convention을 확정하는 후속 결정
대상이다.

## Source Registry

`sources`는 Catalog가 참조하는 근거의 위치, authority와 상태 차원을
machine-readable하게 연결한다. Source Registry는 근거의 내용을 복제하거나
새 canonical contract를 만들지 않는다.

Source authority는 다음 역할을 구분한다.

- `canonical`: Foundation의 승인된 Git 문서와 Decision
- `supporting`: 현재 Draft 또는 보조 Architecture 문서
- `canonical_for_carelog_oauth_binding`: Carelog OAuth binding concern에 한정된
  canonical contract
- `reviewed_projection`: 검수된 Confluence System Landscape Projection
- `work_state`: Jira의 작업 상태
- `release_evidence`: 공개 GitHub Release evidence

Source 상태는 하나의 합성 상태로 합치지 않는다. 문서·Decision·작업·검수·출시
상태는 각각 적용 가능한 차원(`document_status`, `decision_status`,
`work_state`, `review_state`, `release_status`)에 기록한다. 적용되지 않는
차원은 생략하거나 `null`을 사용한다.

후속 Slice에서 Source를 추가할 수 있지만, 기존 Stable ID를 다른 근거의 의미로
재사용하지 않는다.

## External Actors and Participant Mapping

`actors`는 10개 Portfolio System 수량에 포함되지 않는 외부 참여자를 표현한다.
외부 Client, 외부 Provider, Inventory 외부 Edge 구성요소가 대상이다.

- External Gateway는 `system.spring-cloud-gateway`로 매핑한다.
- Shared Identity Endpoint는 `system.shared-identity`의 공개 Endpoint 역할이다.
- Finance Frontend는 `system.finance-harness`의 현재 Frontend 역할이다.
- Product Backend는 해당 제품 System의 Backend 역할이며 별도 Actor가 아니다.
- Product, Identity, Any high-volume service, Event producers 등의 집합 Caller는
  Relation Slice에서 `participant_scope`로 표현한다.
- 집합 Caller를 가짜 System 또는 Actor로 생성하지 않는다.

Actor는 named external participant이고, generic participant scope는 Relation의
집합 Caller/참여 범위를 나타낸다는 점에서 구분한다.

## System Inventory

검수된 Portfolio System은 정확히 10개이며 `actors`는 이 수에 포함하지 않는다.
System Stable ID는 현재 Implementation Host가 아니라 논리 역할을 기준으로 한다.

각 System은 다음 차원을 별도 필드로 유지한다.

- `primary_repository`와 `current_implementation_hosts`
- `logical_boundary_status`와 `runtime_deployment`
- `lifecycle`, `release`, `verification`

따라서 논리 경계가 존재하면서 독립 Runtime이 아직 구현되지 않은 상태를 함께
표현할 수 있다. `repository_unconfirmed`는 단일 Primary Repository가 아직
확정되지 않았음을 뜻하고, `not_implemented`는 해당 Repository 또는 Runtime이
아직 없음을 뜻한다.

System Dependency는 System 항목의 문자열이나 가짜 Reference가 아니라 Relation
Registry에서 표현한다. Data Owner Reference는 Data Group Slice 이후에 연결한다.

## Communication Relations

검수된 Communication Relation은 정확히 17개다.

- External: `8`
- Internal: `5`
- Deferred: `3`
- Negative: `1`

실제 Registry Entity는 `kind: ref`와 Stable ID를 사용한다. Generic 역할은
`kind: scope`를 사용하며 Scope Participant는 Inventory에 추가하지 않는다. 같은
System 내부의 Frontend와 Backend는 같은 `ref`를 사용하고 `role`로 구분한다.
`via`는 중간 경유 Entity일 뿐 별도 Relation Count를 만들지 않는다.

`negative`는 Planned 또는 Deferred Relation이 아니라 현재 금지되었거나 부재한
계약을 표현한다. Adoption Trigger가 있어도 자동 도입 후보라는 뜻이 아니다.

Identity와 AI 불변조건은 관련 Relation의 `constraints`에 포함한다. 이를 별도
Relation으로 만들거나 Count를 늘리지 않는다.

이번 Slice에서는 Data Group이 아직 없으므로 `data.*`를 참조하지 않는다. Data
Ownership은 임시 구조로 의미를 보존하고, Data Slice에서 필요하면 실제 `data.*`
Reference를 연결하되 Relation 수와 의미는 바꾸지 않는다.

## Current Slice

현재 Slice는 Source Registry, External Actor Registry, System Inventory 10개와
Communication Relation 17개를 등록한다. Data Group, Architecture Gate와
Taxonomy의 실제 항목은 후속 Slice에서 검수된 근거를 바탕으로 채운다.
