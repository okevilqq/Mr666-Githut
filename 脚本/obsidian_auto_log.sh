#!/bin/bash
# ============================================================
# obsidian_auto_log.sh
# 在 regenerate_all.sh 完成后自动记录变更到 Obsidian
# ============================================================

LOG_FILE="/Users/[user]/Mr666-项目文件夹/知识库/变更日志.md"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
DATE=$(date +"%Y-%m-%d")

# 确保日志文件存在
if [ ! -f "$LOG_FILE" ]; then
    cat > "$LOG_FILE" << 'HEADER'
---
type: log
domain: system
created: 2026-06-17
tags: [changelog, auto]
---

# 📝 知识库变更日志

> 每次 `regenerate_all.sh` 运行后自动记录

```dataview
TABLE date as "日期", action as "操作", files as "影响文件"
FROM "知识库"
WHERE type = "log"
SORT date DESC
LIMIT 30
```

---

HEADER
fi

# 追加变更记录
echo "" >> "$LOG_FILE"
echo "## $DATE" >> "$LOG_FILE"
echo "- **时间**: $TIMESTAMP" >> "$LOG_FILE"
echo "- **操作**: $1" >> "$LOG_FILE"
echo "- **执行者**: regenerate_all.sh" >> "$LOG_FILE"

if [ -n "$2" ]; then
    echo "- **详情**: $2" >> "$LOG_FILE"
fi

echo "📝 Obsidian 变更日志已更新: $LOG_FILE"
