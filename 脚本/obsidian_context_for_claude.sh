#!/bin/bash
# ============================================================
# obsidian_context_for_claude.sh
# 从 Obsidian Vault 提取知识，供 Claude Code 对话时参考
# 用法: ./脚本/obsidian_context_for_claude.sh [领域]
#   ./脚本/obsidian_context_for_claude.sh model    # 输出结算模型知识
#   ./脚本/obsidian_context_for_claude.sh brand    # 输出品牌知识
#   ./脚本/obsidian_context_for_claude.sh all      # 输出全部知识摘要
# ============================================================

VAULT="/Users/mac/Downloads/君衡 项目文件夹"
KNOWLEDGE_DIR="$VAULT/知识库"

domain="${1:-all}"

# 输出知识摘要
output_note() {
    local file="$1"
    echo ""
    echo "---"
    echo "📄 $(basename "$file")"
    echo "---"
    # 只输出 frontmatter + 前50行（避免上下文过载）
    head -50 "$file"
    echo "...(截断)"
    echo ""
}

case "$domain" in
    brand|品牌)
        echo "## 🧠 品牌知识"
        for f in "$KNOWLEDGE_DIR/品牌"/*.md; do
            [ -f "$f" ] && output_note "$f"
        done
        ;;
    model|模型|settlement)
        echo "## 💰 结算模型知识"
        for f in "$KNOWLEDGE_DIR/模型"/*.md; do
            [ -f "$f" ] && output_note "$f"
        done
        ;;
    compliance|合规)
        echo "## ⚖️ 合规知识"
        for f in "$KNOWLEDGE_DIR/合规"/*.md; do
            [ -f "$f" ] && output_note "$f"
        done
        ;;
    naming|命名)
        echo "## 📛 命名知识"
        for f in "$KNOWLEDGE_DIR/命名"/*.md; do
            [ -f "$f" ] && output_note "$f"
        done
        ;;
    all|*)
        echo "# 链邦赋商通 · 知识摘要"
        echo "> 提取自 Obsidian 知识库"
        echo ""
        for dir in "$KNOWLEDGE_DIR"/*/; do
            dirname=$(basename "$dir")
            if [ "$dirname" = "收件箱" ] || [ "$dirname" = "Claude Memory" ]; then
                continue
            fi
            echo ""
            echo "## 📂 $dirname"
            for f in "$dir"*.md; do
                if [ -f "$f" ]; then
                    echo "- [[$(basename "$f" .md)]]"
                fi
            done
        done
        ;;
esac
