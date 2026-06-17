#!/bin/bash
# ============================================================
# sync_memory_to_obsidian.sh
# 将 Claude Code Memory 系统同步为 Obsidian 笔记
# 实现：Claude Memory ↔ Obsidian Vault 双向同步
# ============================================================

set -e

MEMORY_DIR="$HOME/.claude/projects/-Users-mac-Downloads---------/memory"
VAULT_DIR="/Users/mac/Downloads/君衡 项目文件夹/知识库/Claude Memory"
VERSION=$(date +"%Y%m%d-%H%M%S")

echo "🔗 同步 Claude Memory → Obsidian Vault"
echo "============================================"
echo "源: $MEMORY_DIR"
echo "目标: $VAULT_DIR"
echo "时间: $VERSION"
echo ""

# 确保目标目录存在
mkdir -p "$VAULT_DIR"

# 同步每个 memory 文件
for f in "$MEMORY_DIR"/*.md; do
    if [ ! -f "$f" ]; then continue; fi

    filename=$(basename "$f")

    # 跳过 MEMORY.md 索引文件
    if [ "$filename" = "MEMORY.md" ]; then
        cp "$f" "$VAULT_DIR/_MEMORY_INDEX.md"
        echo "  📋 已同步索引: _MEMORY_INDEX.md"
        continue
    fi

    # 提取 frontmatter name
    name=$(grep "^name:" "$f" | head -1 | sed 's/name: *//' | tr -d ' ' | tr '[:upper:]' '[:lower:]')
    if [ -z "$name" ]; then
        name=$(echo "$filename" | sed 's/.md$//')
    fi

    # 复制并增强 frontmatter（加 Obsidian 兼容字段）
    target="$VAULT_DIR/${name}.md"

    # 检查是否有变化
    if [ -f "$target" ]; then
        if cmp -s "$f" "$target" 2>/dev/null; then
            echo "  ✅ 无变化: ${name}.md"
            continue
        fi
    fi

    # 复制并添加 Obsidian frontmatter
    python3 -c "
import re, sys

with open('$f', 'r') as src:
    content = src.read()

# 提取 frontmatter
fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if fm_match:
    fm = fm_match.group(1)
    body = content[fm_match.end():]

    # 添加 Obsidian 字段
    if 'type:' not in fm:
        fm += '\ntype: memory'
    if 'obsidian_sync:' not in fm:
        fm += f'\nobsidian_sync: $VERSION'

    new_content = f'---\n{fm}\n---\n{body}'
else:
    new_content = f'---\ntype: memory\nobsidian_sync: $VERSION\n---\n\n{content}'

with open('$target', 'w') as dst:
    dst.write(new_content)
"
    echo "  🔄 已同步: ${name}.md"
done

echo ""
echo "✅ 同步完成！在 Obsidian 中打开 [[知识库/Claude Memory/]] 查看"
echo "   Dataview 查询: \`\`\`dataview TABLE type FROM \"knowledge-base/Claude Memory\"\`\`\`"
