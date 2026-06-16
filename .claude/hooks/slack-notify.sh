#!/bin/bash
# 공통 Slack 전송 함수 - notify-permission.sh, notify-stop.sh에서 source로 로드
CONFIG_FILE="$(dirname "$0")/../.env.slack"

send_slack_message() {
    local title="$1"
    local message="$2"
    local color="$3"

    [ -f "$CONFIG_FILE" ] || return 0
    . "$CONFIG_FILE"
    [ -z "$SLACK_WEBHOOK_URL" ] && return 0

    # Python으로 JSON 생성 후 curl에 직접 파이프 (변수 경유 시 한국어 인코딩 깨짐 방지)
    python -c "
import json, sys
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
sys.stdout.buffer.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
" 2>/dev/null | curl -s --max-time 5 -X POST \
        -H 'Content-type: application/json; charset=utf-8' \
        --data-binary @- \
        "$SLACK_WEBHOOK_URL" > /dev/null 2>&1
}
