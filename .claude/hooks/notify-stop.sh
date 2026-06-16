#!/bin/bash
# Claude Code Stop 훅 → 작업 완료 시 Slack 알림 전송
# stdin: {"session_id":"...", "transcript_path":"..."}

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

# transcript(JSONL)에서 마지막 어시스턴트 메시지 요약 추출
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
