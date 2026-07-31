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

## Current Slice

현재 Slice는 역할 설명과 YAML 골격만 정의한다. Source Registry, Actor,
System, Communication Relation, Data Group, Architecture Gate와 Taxonomy의
실제 항목은 후속 Slice에서 검수된 근거를 바탕으로 채운다.
