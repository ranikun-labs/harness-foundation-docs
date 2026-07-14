# Source Inputs

이 디렉터리는 ChatGPT, Codex, 사람의 검토 결과 중 아직 canonical 문서로 정리되지 않은 승인 입력 또는 검토 대상 원문을 보관한다.

## 허용 내용

- 승인 검토 대상 원문
- 사람의 리뷰 결과
- Chat Session에서 추출한 원문
- Codex 작업 결과 중 canonical 반영 전 검토 대상
- Source Input의 상태, 출처, 반영 여부, 대상 Commit 기록

## 금지 내용

- 민감한 Prompt
- 계정정보, 토큰, 비밀번호
- canonical 문서에 직접 들어가야 할 정리된 본문
- 출처와 상태가 없는 임의 메모

## 상태

Source Input 상태는 다음 중 하나를 사용한다.

- `raw`: 원문 보관 상태
- `reviewed`: 검토되었지만 canonical 반영 여부가 확정되지 않음
- `accepted-source`: canonical 반영 근거로 승인됨
- `rejected`: 반영하지 않기로 결정됨
- `superseded`: 다른 Source Input으로 대체됨

## 운영 원칙

- AI 답변은 자동 Source of Truth가 아니다.
- 승인되지 않은 내용을 canonical 문서에 섞지 않는다.
- Source Input의 원문을 조용히 수정하지 않는다.
- canonical 반영 여부와 대상 Commit을 기록한다.
- 대체된 Source Input은 삭제하지 않고 상태를 표시한다.
- 민감한 Prompt나 계정정보를 저장하지 않는다.

## Canonical 반영 흐름

1. Source Input
2. 내용 검수
3. 기존 문서와 충돌 확인
4. 명시적 승인
5. Master, Roadmap, Architecture, ADR 반영
6. Commit
