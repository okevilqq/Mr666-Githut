#!/bin/bash
# ============================================================
# claude_to_obsidian.sh
# 将 Claude Code 对话产出转化为 Obsidian 笔记
# 用法:
#   echo "会议内容..." | ./脚本/claude_to_obsidian.sh meeting "主题"
#   ./脚本/claude_to_obsidian.sh note "标题" "内容..."
# ============================================================

VAULT="/Users/[user]/Mr666-项目文件夹"
INBOX="$VAULT/知识库/收件箱"
DATE=$(date +"%Y%m%d")
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

mode="${1:-note}"
title="${2:-无标题}"
body="${3:-}"

if [ -z "$body" ] && [ ! -t 0 ]; then
    body=$(cat)
fi

create_note() {
    local filepath="$1"
    local content="$2"

    cat > "$filepath" << EOF
---
type: claude-output
mode: $mode
created: $DATE
timestamp: $TIMESTAMP
tags: [claude, $mode]
---

# $title

> 🤖 由 Claude Code 生成 · $TIMESTAMP

$content

## 关联

- [[🏠 首页]]
- [[🌱 自生长机制]]
EOF

    echo "✅ 已创建: $filepath"
    echo "   在 Obsidian 中打开: [[$(basename "$filepath" .md)]]"
}

if [ "$mode" = "meeting" ]; then
    filepath="$VAULT/会议纪要/$DATE $title.md"
    create_note "$filepath" "$body"
else
    filepath="$INBOX/$DATE $title.md"
    create_note "$filepath" "$body"
fi
