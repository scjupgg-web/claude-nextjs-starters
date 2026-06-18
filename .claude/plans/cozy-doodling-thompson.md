# 플랜: notify-stop.sh MESSAGE 버그 수정

## Context
`notify-stop.sh`는 Claude Code Stop 훅으로, 작업 완료 시 Slack에 알림을 보내는 스크립트다.
Slack 메시지에 `$MESSAGE` 값을 포함시키려 했지만, 두 가지 버그로 인해 아무것도 출력되지 않는다.

---

## 버그 원인 분석

### 버그 1: `INPUT` 읽기 전에 `jq` 호출 (5번째 줄)
```bash
MESSAGE=$(jq -r '.hook_event_name')   # ← stdin을 여기서 소비하려 하지만
INPUT=$(cat)                           # ← stdin은 여기서 읽어야 함
```
- `jq -r '.hook_event_name'`는 stdin에서 JSON을 읽으려 하지만, stdin은 아직 `cat`으로 받기 전이다.
- 더 큰 문제: `INPUT=$(cat)`이 실행될 때는 이미 stdin이 닫혔거나 비어 있을 수 있다.
- 결과: `MESSAGE`는 빈 문자열 또는 jq 오류

### 버그 2: `MESSAGE` 변수를 사용하지 않고 명령으로 실행 (57번째 줄)
```bash
MESSAGE          # ← 이건 변수 출력이 아니라 "MESSAGE"라는 명령 실행 시도
```
- `$MESSAGE`가 아닌 `MESSAGE`만 쓰면 bash는 이를 명령어로 인식한다.
- `MESSAGE`라는 명령이 없으면 "command not found" 오류만 발생하고 넘어감.
- 결과: `$MESSAGE`가 Slack 메시지에 아무 값도 넣지 못함

---

## 수정 방법

### 수정 1: stdin을 먼저 읽고 jq로 파싱
```bash
INPUT=$(cat)   # stdin 먼저 읽기

MESSAGE=$(echo "$INPUT" | jq -r '.hook_event_name // ""')
```

### 수정 2: 57번째 줄의 `MESSAGE` 제거 (불필요한 라인)
```bash
# MESSAGE  ← 이 줄 삭제
```
`$MESSAGE`는 이미 61번째 줄 `send_slack_message` 호출 안에서 사용되고 있으므로,
별도로 출력하는 로직은 필요 없다.

---

## 수정 후 최종 코드 (변경 부분)

```bash
#!/bin/bash
# Claude Code Stop 훅 → 작업 완료 시 Slack 알림 전송
# stdin: {"session_id":"...", "transcript_path":"..."}

SCRIPT_DIR="$(dirname "$0")"
. "$SCRIPT_DIR/slack-notify.sh"

INPUT=$(cat)   # stdin 먼저 읽기

MESSAGE=$(echo "$INPUT" | jq -r '.hook_event_name // ""')

SESSION_ID=$(echo "$INPUT" | python -c "
...
```

변경 요약:
1. `INPUT=$(cat)` 을 파일 상단으로 이동 (5번째 줄보다 먼저)
2. `MESSAGE=$(jq -r '.hook_event_name')` → `MESSAGE=$(echo "$INPUT" | jq -r '.hook_event_name // ""')`
3. 57번째 줄 `MESSAGE` (단독 라인) 삭제

---

## 검증
- 훅 실행 후 Slack 메시지의 `*메시지:* $MESSAGE` 부분에 실제 `hook_event_name` 값이 표시되는지 확인
- `hook_event_name`이 없는 경우 빈 문자열(`""`)로 graceful하게 처리되는지 확인
