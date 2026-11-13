---
title: Jira 업무 계층 — Epic·Story·Feature
document_status: proposed
decision_status: owner_direction_recorded
implementation_status: jira_hierarchy_not_configured
owner: governance
---

# Jira 업무 계층 — Epic·Story·Feature

## 한 줄 규칙

업무는 **Epic → (필요하면 Story) → Feature**로 관리한다. Story로 묶을 필요가 없는 Feature는 Epic 바로 아래에 둔다.

이 규칙은 Developer AI Platform 전용이 아니라 RPL에서 관리하는 업무 전반에 적용한다. 제품별 책임과 기존 Jira 권한은 그대로 유지하며, 모든 Developer AI Platform 업무를 기존 Personal AI Epic 하나에 몰아넣지 않는다.

## 각 티켓의 역할

| 유형 | 무엇을 나타내나 | 종료 판단 |
|---|---|---|
| **Epic** | 여러 작업이 함께 달성하는 큰 사용자·제품 결과 | Epic의 결과와 하위 작업의 완료 조건을 확인 |
| **Story** | 여러 Feature가 공유하는 하나의 사용자 결과나 설계 단계를 묶는 선택적 중간 단위 | 묶음의 결과가 분명하고 하위 Feature를 추적할 이유가 있을 때 사용 |
| **Feature** | 독립적으로 계획·구현·검증·인수할 수 있는 사용자 기능 또는 변경 | 자체 목표, 범위, 수락 기준, 검증 증거로 완료 판단 |
| **Sub-task** | 한 Feature를 수행하는 내부 구현 단계 | 독립 제품 결과를 대표하지 않음 |

Story를 모든 Epic에 강제하지 않는다. Story가 단순히 계층을 채우는 빈 티켓이 되면 생략한다. 반대로 여러 Feature가 같은 사용자 결과나 설계 완료 조건에 묶여 있다면 Story를 사용해 그 관계를 드러낸다. 서로 선후행·연관 관계만 있는 티켓은 부모·자식으로 위장하지 않고 Jira Issue Link를 사용한다.

## 목표 구조 예시

Story가 실제로 여러 Feature를 묶을 때:

```text
Epic: 사용자가 업무를 안전하게 완료하고 결과를 확인한다
└── Story: 승인된 업무 계획을 생성하고 추적한다
    ├── Feature: 요청에서 목표·범위·완료 기준을 추출한다
    └── Feature: 승인 후 Jira 부모·자식 티켓을 생성하고 재조회한다
```

중간 묶음이 불필요할 때:

```text
Epic: 사용자가 업무를 안전하게 완료하고 결과를 확인한다
├── Feature: 실행 상태를 다시 불러온다
└── Feature: 완료 보고에서 실제 검증 근거를 연결한다
```

## 현재 Jira RPL 설정

2026-11-13에 RPL 프로젝트의 Issue Type 메타데이터를 조회했다.

| Jira 유형 | 조회된 계층 단계 | 현재 부모 관계 |
|---|---:|---|
| Epic | 1 | 상위 목표 |
| Story | 0 | Epic 아래에 배치 가능 |
| Feature | 0 | Epic 아래에 배치 가능 |
| Sub-task | -1 | 일반 이슈 아래의 실행 하위 단계 |

현재 Jira에서는 Epic→Story와 Epic→Feature는 표현할 수 있지만 **Story→Feature를 실제 Parent 관계로 표현할 수 없다.** Story와 Feature가 같은 계층 단계이기 때문이다.

## 설정이 맞춰질 때까지의 처리

- 실제 의미가 맞으면 Epic→Feature로 기록한다.
- Story가 꼭 필요한 업무는 Story→Feature 관계가 지원되는 설정이나 Owner가 승인한 대체 방식을 확인하기 전까지 그 관계를 실제 Jira 계층처럼 기록하지 않는다.
- Issue Link나 Sub-task를 Story→Feature의 대체 Parent 관계라고 부르지 않는다.
- Jira 전역 계층·프로젝트 Issue Type 설정은 이 문서 변경에 포함되지 않는다. 관리자 설정 변경은 별도 영향 검토와 Owner 승인 대상이다.
- 기존 티켓·브랜치·Owner·완료 기준을 새 계층에 맞춘다는 이유로 소급 변경하지 않는다.

## 티켓 작성 흐름

새 요청이나 추가 기능이 들어오면 다음을 한 번에 준비한다.

1. 기존 Epic·Story·Feature를 검색해 중복과 현재 Parent를 확인한다.
2. 독립적인 완료 기준이 있는 일을 Feature로 분리하고, 필요할 때만 Story 묶음을 제안한다.
3. 한국어 F1 미리보기에 티켓 유형, 제목, 목적, 범위, 수락 기준, 검증 방법, Parent 후보, 의존성을 함께 표시한다.
4. Jira가 현재 계층을 저장할 수 있는지 확인하고, 저장할 수 없는 관계는 불일치로 표시한다.
5. 기존 Jira 쓰기 권한 경계에 따라 승인된 티켓만 생성하고, 생성 후 Issue Type·Parent·내용을 다시 읽어 확인한다.
6. 티켓 생성은 코드 수정·브랜치 생성·PR·병합·종료 승인을 대신하지 않는다.

이 문서는 분류와 Parent 계약을 정의한다. 실제 티켓 생성 자동화나 Jira 설정이 구현됐다는 의미가 아니다.

## 정본과 표시 위치

- **Jira:** 실제 업무 티켓, Parent, 상태, 담당, 수락 기준
- **harness-foundation-docs:** 이 계층과 Jira 거버넌스의 정본
- **oh-my-ai:** FX와 `jira-ticket`이 이 구조를 해석·미리보기·생성하는 제품 계약
- **Confluence:** 위 정본으로 연결되는 사람이 읽기 쉬운 문서 색인과 설명

현재 문서 변경은 계층 모델을 명시하는 제안이다. Jira 관리 설정, 기존 이슈 생성·수정, 자동화를 수행하지 않는다.
