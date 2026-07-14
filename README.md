# oh-my-ai Documentation Repository

이 Repository는 `oh-my-ai` 제품의 비공개 제품 문서, 아키텍처 문서, 의사결정 기록을 Git으로 관리하기 위한 문서 Source of Truth다.

이 Repository는 코드 저장소가 아니다. 코드, 서버, 빌드 스크립트, 실행 구현은 이곳에서 관리하지 않는다.

Chat Session은 작업 맥락이고, Git 문서는 지속 가능한 Source of Truth다.

## Canonical 문서와 Source Input

Canonical 문서는 명시적으로 검수되고 승인되어 현재 기준으로 채택된 문서다. Master, Roadmap, Architecture, Product, ADR 문서가 여기에 해당할 수 있다.

Source Input은 ChatGPT, Codex, 사람의 검토 결과, 회의 메모 등 canonical 문서로 정리되기 전의 승인 입력 또는 검토 대상 원문이다. Source Input이 존재한다는 사실만으로 canonical 결정이 되지 않는다.

Canonical 반영 흐름은 다음 순서를 따른다.

1. Source Input 보관
2. 내용 검수
3. 기존 문서와 충돌 확인
4. 명시적 승인
5. Master, Roadmap, Architecture, ADR 중 적절한 대상에 반영
6. Commit 기록

## Source of Truth 우선순위

문서 간 충돌이 있을 때는 다음 우선순위를 따른다.

1. Accepted ADR
2. Canonical Master Document
3. Product / Technical Roadmap
4. Architecture Documents
5. Product 및 Extension 세부 문서
6. Decision Log
7. Session Handoff
8. Accepted Source Input
9. Raw Source Input
10. Chat Session / Notion Memo

ADR은 개별 결정의 이유를 보존한다. Master Document는 현재 전체 상태를 설명한다.

## 주요 디렉터리

- [source-inputs/](source-inputs/): canonical 반영 전 Source Input 원문과 상태 기록
- [docs/master/](docs/master/): 승인된 전체 제품 기준 문서의 위치
- [docs/roadmap/](docs/roadmap/): 승인된 제품 및 기술 로드맵 문서의 위치
- [docs/architecture/](docs/architecture/): 승인된 아키텍처 설명 문서의 위치
- [docs/product/](docs/product/): 승인된 제품 및 Extension 세부 문서의 위치
- [docs/adr/](docs/adr/): Architecture Decision Record 관리 위치
- [docs/decisions/](docs/decisions/): Decision Log 관리 위치
- [docs/handoffs/](docs/handoffs/): Session Handoff 기록 위치
- [docs/research/](docs/research/): 조사, 비교, 검토 자료의 위치
- [templates/](templates/): ADR, Decision, Handoff 템플릿

## 문서 Metadata

주요 문서는 다음 Metadata 형식을 사용할 수 있다.

```yaml
---
title: 문서 제목
status: draft | canonical | superseded | archived
owner: product
last_reviewed: YYYY-MM-DD
supersedes: []
superseded_by: []
related_adrs: []
source_inputs: []
---
```

문서 상태 의미는 다음과 같다.

- `draft`: 작성 또는 검토 중이며 아직 canonical이 아님
- `canonical`: 명시적으로 승인된 현재 기준 문서
- `superseded`: 다른 문서나 ADR에 의해 대체됨
- `archived`: 현재 운영 기준에서는 제외되지만 기록 보존을 위해 남김

## ADR 운영 방식

ADR 상태는 다음 중 하나를 사용한다.

- `proposed`
- `accepted`
- `rejected`
- `superseded`

Accepted ADR의 결론이 바뀌면 기존 ADR 본문을 조용히 다시 작성하지 않는다. 새 ADR을 추가하고, 기존 ADR의 상태와 `superseded_by`를 갱신한다.

ADR은 결정의 배경, 선택한 결론, 근거, 결과, 대안을 기록한다. 실제 제품 결정이 승인되지 않은 상태에서는 내용이 채워진 ADR을 만들지 않는다.

## 새로운 결정을 추가하는 절차

1. 관련 Source Input을 [source-inputs/](source-inputs/)에 보관한다.
2. Source Input 상태와 출처를 기록한다.
3. 기존 canonical 문서, Decision Log, ADR과 충돌 여부를 확인한다.
4. 결정 단위가 명확하면 [templates/adr-template.md](templates/adr-template.md)를 사용해 ADR을 작성한다.
5. 운영상 요약 기록이 필요하면 [templates/decision-template.md](templates/decision-template.md)를 사용해 Decision Log에 반영한다.
6. 승인 후 관련 canonical 문서에 반영하고 Commit으로 남긴다.

## 기존 결정을 변경하는 절차

1. 변경 근거가 되는 Source Input을 확인한다.
2. 영향을 받는 ADR, Master, Roadmap, Architecture, Product 문서를 찾는다.
3. Accepted ADR을 변경하는 경우 새 ADR을 작성한다.
4. 대체되는 문서는 삭제하지 않고 `superseded` 상태와 대체 대상을 기록한다.
5. Decision Log에 변경 이력을 남긴다.
6. 하나의 Commit에서 변경 이유와 영향을 명확히 남긴다.

## Git, Chat Session, Notion의 역할

Git 문서는 지속 가능한 Source of Truth다. 승인된 원문, canonical 문서, ADR, Decision Log, Handoff는 Git에서 관리한다.

Chat Session은 작업 맥락, 초안 작성, 검토 대화의 역할을 한다. Chat Session의 답변은 자동으로 Source of Truth가 되지 않는다.

Notion은 Dashboard와 Link Index로만 사용한다. Git 문서의 원문을 Notion에 중복 관리하지 않는다.

## 다른 제품 Repository와의 관계

다른 제품 Repository와의 관계, 코드 상태, 구현 여부, 배포 상태는 제공되고 승인된 Source Input을 기준으로만 작성한다. 이 Repository의 초기 골격에서는 제품 구조나 구현 상태를 추론하지 않는다.

## 파일명과 링크 규칙

- 파일명은 영어 kebab-case를 사용한다.
- 문서 간 링크는 상대경로를 사용한다.
- 같은 개념에 여러 용어를 만들지 않는다.
- 승인되지 않은 제품 내용은 canonical 문서에 섞지 않는다.
- 과도한 문서 계층을 추가하지 않는다.
