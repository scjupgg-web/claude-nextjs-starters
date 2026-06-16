# Claude Code → Slack 모바일 알림 설정

## Context
Claude Code가 **권한을 요청할 때**와 **작업이 완료되었을 때** Slack 모바일 앱으로 알림을 받기 위한 훅 통합 구현.  
Claude Code Hook 이벤트(`Notification`, `Stop`)를 Slack Incoming Webhook과 연결해 자리를 비워도 작업 상태를 모바일로 확인 가능하게 함.

---

## 훅 이벤트 매핑

| 요구사항 | 훅 이벤트 | 이유 |
|---|---|---|
| 권한 요청시 | `Notification` | 권한 요청 등 사용자 주의가 필요한 시점에 발화. `PreToolUse`는 auto-approved 도구도 포함해 노이즈 과다 |
| 작업 완료시 | `Stop` | Claude 응답 완전 완료 시점에 정확히 발화 |

---

## 파일 구조

```
.claude/
  hooks/
    slack-notify.sh          # 공통 Slack 전송 함수
    notify-permission.sh     # Notification 훅 → 권한 요청 알림
    notify-stop.sh           # Stop 훅 → 작업 완료 알림
  .env.slack                 # Webhook URL (이미 .gitignore의 .env* 패턴으로 제외됨)
  settings.local.json        # 훅 설정 추가
```

> `.env.slack` 파일명은 기존 `.gitignore`의 `.env*` 패턴에 자동으로 매칭되어 별도 gitignore 수정 불필요.

---

## 구현 단계

### Step 1 — Slack Incoming Webhook URL 획득 (사용자 작업)

1. https://api.slack.com/apps → "Create New App" → "From scratch"
2. App 이름: `Claude Code Bot`, 워크스페이스 선택
3. 좌측 "Incoming Webhooks" → 활성화 ON
4. "Add New Webhook to Workspace" → 알림받을 채널 선택
5. 생성된 URL 복사: `https://hooks.slack.com/services/T.../B.../...`
6. **모바일 알림**: Slack 앱 → 해당 채널 → 알림 설정 → "모든 메시지"

---

### Step 2 — `.claude/.env.slack` 생성

```bash
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/여기에_붙여넣기"
SLACK_USERNAME="Claude Code Bot"
```

---

### Step 3 — `.claude/hooks/slack-notify.sh` (공통 라이브러리)

```bash
#!/bin/bash
CONFIG_FILE="$(dirname "$0")/../.env.slack"

send_slack_message() {
    local title="$1"
    local message="$2"
    local color="$3"

    [ -f "$CONFIG_FILE" ] || return 0
    . "$CONFIG_FILE"
    [ -z "$SLACK_WEBHOOK_URL" ] && return 0

    local payload
    payload=$(python -c "
import json
data = {
    'username': '${SLACK_USERNAME:-Claude Code Bot}',
    'icon_emoji': ':robot_face:',
    'attachments': [{
        'color': '$color',
        'title': '$title',
        'text': '$message',
        'footer': 'Claude Code',
        'mrkdwn_in': ['text']
    }]
}
print(json.dumps(data, ensure_ascii=False))
" 2>/dev/null)

    [ -z "$payload" ] && return 0

    curl -s --max-time 5 -X POST \
        -H 'Content-type: application/json' \
        --data "$payload" \
        "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 &
    disown $! 2>/dev/null || true
}
```

---

### Step 4 — `.claude/hooks/notify-permission.sh` (Notification 훅)

stdin JSON: `{"session_id":"...", "transcript_path":"...", "message":"..."}`

```bash
#!/bin/bash
SCRIPT_DIR="$(dirname "$0")"
. "$SCRIPT_DIR/slack-notify.sh"

INPUT=$(cat)

NOTIFICATION_MSG=$(echo "$INPUT" | python -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('message', ''))
" 2>/dev/null)

SESSION_ID=$(echo "$INPUT" | python -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('session_id', 'unknown')[:8])
" 2>/dev/null)

# 권한/대기 관련 키워드 필터링 (불필요한 알림 방지)
IS_PERMISSION=$(echo "$NOTIFICATION_MSG" | python -c "
import sys
msg = sys.stdin.read().lower()
keywords = ['permission', 'allow', 'approve', 'waiting', 'blocked', 'need your', 'confirm']
print('yes' if any(k in msg for k in keywords) else 'no')
" 2>/dev/null)

if [ "$IS_PERMISSION" = "yes" ]; then
    send_slack_message \
        "🔐 Claude Code 권한 요청" \
        "*세션:* \`$SESSION_ID\`\n*내용:* $NOTIFICATION_MSG\n\n_확인이 필요합니다._" \
        "warning"
fi

exit 0
```

---

### Step 5 — `.claude/hooks/notify-stop.sh` (Stop 훅)

stdin JSON: `{"session_id":"...", "transcript_path":"..."}`

```bash
#!/bin/bash
SCRIPT_DIR="$(dirname "$0")"
. "$SCRIPT_DIR/slack-notify.sh"

INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | python -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('session_id', 'unknown')[:8])
" 2>/dev/null)

TRANSCRIPT_PATH=$(echo "$INPUT" | python -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('transcript_path', ''))
" 2>/dev/null)

# transcript에서 마지막 어시스턴트 메시지 요약 추출 (JSONL 형식)
SUMMARY=""
if [ -f "$TRANSCRIPT_PATH" ]; then
    SUMMARY=$(python -c "
import json
try:
    with open('$TRANSCRIPT_PATH', 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f if l.strip()]
    for line in reversed(lines):
        try:
            entry = json.loads(line)
            if entry.get('role') == 'assistant':
                content = entry.get('content', '')
                text = ''
                if isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get('type') == 'text':
                            text = block.get('text', '')[:200]
                            break
                elif isinstance(content, str):
                    text = content[:200]
                if text:
                    print(text.replace(chr(10), ' '))
                    break
        except:
            continue
except:
    pass
" 2>/dev/null)
fi

MSG_TEXT="${SUMMARY:-작업이 완료되었습니다.}"

send_slack_message \
    "✅ Claude Code 작업 완료" \
    "*세션:* \`$SESSION_ID\`\n*요약:* $MSG_TEXT" \
    "good"

exit 0
```

---

### Step 6 — `.claude/settings.local.json` 훅 섹션 업데이트

기존 `hooks` 섹션에 `Notification`과 `Stop` 추가:

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        { "type": "command", "command": "echo \"Test Hooks!\" >> ./test-hooks-logs.txt" }
      ]
    }
  ],
  "Notification": [
    {
      "matcher": "",
      "hooks": [
        { "type": "command", "command": "bash .claude/hooks/notify-permission.sh" }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "",
      "hooks": [
        { "type": "command", "command": "bash .claude/hooks/notify-stop.sh" }
      ]
    }
  ]
}
```

---

## 검증 방법

```bash
# 1. Stop 훅 직접 테스트 (Slack에 완료 알림이 오면 성공)
echo '{"session_id":"test-abc123","transcript_path":""}' | bash .claude/hooks/notify-stop.sh

# 2. Notification 훅 권한 요청 시뮬레이션
echo '{"session_id":"test-abc123","transcript_path":"","message":"Waiting for permission to run Bash command"}' | bash .claude/hooks/notify-permission.sh

# 3. Notification 훅 일반 알림 (필터링 확인 — Slack 알림 오면 안 됨)
echo '{"session_id":"test-abc123","transcript_path":"","message":"Task is in progress"}' | bash .claude/hooks/notify-permission.sh

# 4. 실제 Claude Code 세션에서 확인
# → deny 목록에 없는 명령어 실행 유도 후 권한 요청 발생 여부 확인
```

---

## 주의사항

- **비블로킹**: `curl &` + `disown`으로 Slack 전송이 Claude Code 작업을 지연시키지 않음
- **Notification 필터링**: `notify-permission.sh`의 `keywords` 목록은 실제 Claude Code 권한 메시지 패턴 확인 후 조정 필요
- **Python 의존성**: Windows 11 기본 Python 사용. `python` 명령이 없으면 `python3`으로 변경
- **경로**: `bash .claude/hooks/...` 명령은 프로젝트 루트 기준 상대경로
