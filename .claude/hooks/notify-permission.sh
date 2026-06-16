#!/bin/bash
# Claude Code Notification 훅 → 권한 요청 감지 시 Slack 알림 전송
# stdin: {"session_id":"...", "transcript_path":"...", "message":"..."}

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

# 권한/대기 관련 키워드만 필터링 (일반 알림에는 Slack 미전송)
IS_PERMISSION=$(echo "$NOTIFICATION_MSG" | python -c "
import sys
msg = sys.stdin.read().lower()
keywords = ['permission', 'allow', 'approve', 'waiting', 'blocked', 'need your', 'confirm', 'authorization']
print('yes' if any(k in msg for k in keywords) else 'no')
" 2>/dev/null)

if [ "$IS_PERMISSION" = "yes" ]; then
    send_slack_message \
        "🔐 Claude Code 권한 요청" \
        "*세션:* \`$SESSION_ID\`\n*내용:* $NOTIFICATION_MSG\n\n_확인이 필요합니다._" \
        "warning"
fi

exit 0
