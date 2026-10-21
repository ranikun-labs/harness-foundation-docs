---
title: "Jira G2 Migration — Current Status Projection (2026-10-21)"
projection_status: draft_for_owner_review
as_of: "2026-10-21 KST"
governance_main_sha: "8afda5417957176e5c7a3cb8c0fc1b0017a7c7cd"
source_authority: Jira current fields + archived issue-specific Library evidence
read_authority: legacy
write_authority: frozen
g3_cutover_approval: null
---

# Jira G2 — Current Status Projection (2026-10-21)

> **현재 관측 상태의 비파괴적 Projection 초안.** 2026-10-15 G0/Governance 승인 문서의 시점별 역사 기록·ADR의 `implementation_status`·정책적 의미를 덮어쓰지 않는다. GitHub Merge, Jira 새 Write, G3 권위 이전을 선언하는 문서가 아니다.

## 인원/범위

Jira RPL 전체 **118건**. Target Product+Component 동시 저장 **24건**, Target 미입력 **94건 = statusCategory Done 76 + 미완료 18**. 그 18건은 **HOLD 11 + 미지원 Issue Type 6 + 폐기 RPL-40 1**. Target 부분 저장 0건. 이력상의 Done statusCategory 전체는 81건(완료 상태인데 Target 기입된 5건을 포함). RPL-66의 상태명이 `준비`더라도 statusCategory는 `done`이므로 Done 76에 포함하며 자동 Backfill 대상이 아니다.

**24건은 '저장된 Target' 수이고 '동일 수준의 복구 증거를 가진 24건'이라는 뜻이 아니다.** 21건은 Target 이력·개별 단계별 검증 근거가 있으며, RPL-112/113/114 3건은 생성 출처/Owner Approval/Original Snapshot 미확인 `UNKNOWN_ORIGIN`으로 분류 Read/Write를 별도 격리한다. Pilot/Batch1 10건의 일부 Snapshot은 Native ADF 전체가 아니라 Migration-scoped evidence이므로 복구 완전성은 별도 문제다.

## 실행 이력과 Before/After 근거

| Cohort | 건수 | Target 변경 근거 | Native ADF/복구 범위 | 권위 |
|---|---:|---|---|---|
| G2 Pilot | 5 | `10926~10930` | Scoped evidence; Full Native ADF Before 불명 | Legacy |
| G2 Batch 1 | 5 | `10931~10935` | Scoped evidence; Full Native ADF Before 불명 | Legacy |
| G2-C 첫 실행(2/5/6/107) | 4 | `10950~10953` | Native ADF Description Before/After 증거 | Legacy |
| G2-C READY2(3/47) | 2 | `10968~10969` | Scoped Snapshot/검증 이력, 전체 ADF 정확성 별도 증거 수준 확인 | Legacy |
| G2-C RPL-27/55 | 2 | `10970~10971` | Library Full Native ADF Pre/Post·RollbackRef, SHA | Legacy |
| G2-C Batch 3(34/46/51) | 3 | `10972~10974` | Library Full Native ADF Pre/Post·RollbackRef, SHA | Legacy |
| Personal AI 112/113/114 | 3 | Target field stored; target-set Changelog 미확인 | Original Create/Owner Origin/Before Snapshot 없음 | **UNKNOWN_ORIGIN / Read none-unverified** |
| 합계 | **24** | 현행 Target 저장 수 | 품질 차등 표기 | **G3 미승인** |

### Batch 3 보관 증거 (원본 건드리지 않음)

- `/하네스/jira-g2-continuation-20261021/jira-g2c-batch3-prewrite-snapshot-20261021.zip`: SHA-256 `f6068b3e2b5ad077951ce003f3fdde2484ecf4029c55ce9b4f0b62b8776b266b`.
- `/하네스/jira-g2-continuation-20261021/jira-g2c-batch3-postwrite-verified-20261021.zip`: SHA-256 `adc6e6c3addda91d400f35178603ce52d4c8ee893d6a0819e487bb9c069bad5b`.
- RPL-34 `finance/backend` Changelog `10972`; RPL-46 `carelog/frontend` `10973`; RPL-51 `platform-foundation/backend` `10974` + 원본 Native ADF 21 top nodes와 승인 Addendum 5 nodes.
- RPL-51 Component는 2026-10-15의 **G0 Owner 결정 당시 미결정**이었으나 2026-10-21 별도 Batch 3 Owner 승인과 실제 Jira 저장으로 `backend(10028)`가 검증됐다. 이 둘을 '과거 결정이 틀림'이라고 정정하지 않는다.

## 상태·권위 Gate

- G0: Owner 정책 승인·GitHub 정본 반영 완료.
- G1: Jira Product(Target) `customfield_10108`, Component(Target) `customfield_10109`, Concern(Target) `customfield_10110` 실제 생성 및 유효 Option 확인(활성 타입 Epic/Task/Feature/Bug/Research). 이 상태는 신규 Target Create Cutover 승인이 아니다.
- G2: 저장된 24 중 최초 출처 확인된 21, UNKNOWN_ORIGIN 3. 추가 18건을 조건 없이 자동 이전하지 않음.
- G3: **미승인/미실행.** 분류 ReadAuthority `legacy`, WriteAuthority `frozen` (Origin 미증명 3건은 `none/unknown` 분류 격리), CutoverApprovalRef `null`.
- G4: 미승인. Legacy 삭제·Required 해제·Board/Automation Reader 변경·완료 이력 Backfill·미지원 이슈 자동 보정 금지.
- RPL-111은 JetStream 역사적 Jira 구현 명세와 현행 ADR-0023 SQS Provider가 불일치. ADR-0023 목표 승인 = AWS Queue/DLQ Provisioning·Code 구현 승인 아님.
- 기존 Confluence [G2 Pilot Evidence Index](https://ranikunlabs.atlassian.net/wiki/spaces/RLAB/pages/20709377)는 2026-10-19의 Pilot 시점 기록. 새 Projection으로 덮어쓰거나 무단 갱신하지 않는다.

## 미해결 결정 묶음

1. RPL-36/37/41 중복/정본, RPL-1/4/7 제품·Component 경계, RPL-11 Duplicate, RPL-62 AI Production Contract HOLD와 Metadata 분리.
2. RPL-93/95 기승인 `dev-harness/backend`의 Cross-product 영향 증거 보존 + 별도 정확한 Jira Write 승인.
3. RPL-111 SQS canonical Description/AC 최소 정합화, 이후 Target `audit/backend` 승인 Writer 분리.
4. RPL-112/113/114 Origin Registry 증거 수집·격리; 추정 원본 Snapshot 소급 조작 금지.
5. Subtask/Story 등 6건 별도 Issue Type 정책/Owner 승인; RPL-40 폐기 제외 유지.
6. Cutover 이전 Create Origin Registry 영속성, Reader/Board/Automation, Legacy required/default, Rollback 기술 증거는 G3로 넘긴다.

## 정본/현재 Blob SHA

- `harness-foundation-docs/main@8afda5417957176e5c7a3cb8c0fc1b0017a7c7cd`
- Portfolio `b6ddad42489a1bfd3912572d60f36622d7555bdb`
- Taxonomy `9bb39081288ab47ba0e18c6ad7d8e193d16e714f`
- AI Session `d923ddcc77fc39348760d5934c88a971e7f72833`
- Owner Policy `505c77de210a4054ed14adf5bdbec03283aa1c9c`
- ADR-0023 `3659d4e3f9490d36bdf7313cabbc9dd4c8b5b9f3`

## 검증/제약

이 문서는 Source 변경 전 **초안**이다. GitHub 전체 텍스트 diff에 대한 `git apply --check`, 별도 Human/Agent 독립 Review, Jira G3 E2E는 현재 NOT_RUN. 문서 PR Merge는 별도 Owner 승인 필요.
