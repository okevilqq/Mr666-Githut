#!/usr/bin/env bash
# ============================================================================
# 链商2.0 · 一键重生成全部文档
# Usage:
#   ./regenerate_all.sh              # 全部生成
#   ./regenerate_all.sh --subset core      # 核心：工作计划+分润模型
#   ./regenerate_all.sh --subset marketing # 营销策略类
#   ./regenerate_all.sh --subset naming    # 品牌命名类
#   ./regenerate_all.sh --subset viz       # 可视化类
#   ./regenerate_all.sh --list             # 列出所有分组
# ============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
FAILED_SCRIPTS=""

run_one() {
    local script="$1"
    local label="$2"
    echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} 生成: ${YELLOW}$label${NC} ($script)"
    if node "$script"; then
        echo -e "  ${GREEN}✅ 完成${NC}"
        ((PASS++)) || true
    else
        echo -e "  ${RED}❌ 失败${NC}"
        ((FAIL++)) || true
        FAILED_SCRIPTS="$FAILED_SCRIPTS\n  - $script ($label)"
    fi
    echo ""
}

# ============================================================================
# Script groupings
# ============================================================================

CORE=(
    "generate_styled.js:工作总计划表 (xlsx)"
    "generate_v3_settlement_model.js:分润核销模型 V3.2"
    "generate_compliance_framework.js:法律合规框架"
    "generate_brand_execution_manual.js:小程序品牌执行手册"
)

SETTLEMENT=(
    "generate_settlement_analysis.js:分账核销分析 V1.0"
    "generate_revised_settlement_model.js:修订分润模型 V2.0"
    "generate_v3_settlement_model.js:分润核销模型 V3.2"
    "generate_digital_asset_strategy.js:消费权益×分润融合策略"
    "generate_margin_strategy.js:净利率策略框架"
    "generate_100yuan_settlement_demo.js:100元分账演示"
)

MARKETING=(
    "generate_marketing_strategy.js:营销策略方案 V2.0"
    "generate_marketing_strategy_html.js:营销策略 HTML 可视化"
    "generate_hk_ipo_marketing_plan.js:HK IPO 市场营销计划"
    "generate_margin_strategy.js:净利率策略框架"
    "generate_p0_marketing_deliverables.js:P0 营销交付物"
    "generate_p1p2_marketing_deliverables.js:P1P2 营销交付物"
)

NAMING=(
    "generate_brand_naming_proposal.js:品牌命名提案 V2.0"
    "generate_new_brand_naming_v3.js:全新命名方案 V3.0"
    "generate_fushang_naming.js:赋商创意命名方案 V1.0"
    "generate_new_naming_v4.js:全新命名方案 V4.0"
)

VIZ=(
    "generate_business_model_visualization.js:商业模式全景图 HTML"
    "generate_xmind_mindmap.js:商业模式 XMind 思维导图"
    "generate_marketing_strategy_html.js:营销策略 HTML 可视化"
)

BROCHURE=(
    "generate_brochure_brief_v3.js:企业画册策划简报 V3.0"
    "generate_brochure_revision_plan.js:画册合规审查修改方案"
    "generate_brochure_brief.js:画册简报 V1.0"
)

DELIVERABLES=(
    "generate_day3_deliverables.js:Day3 竞品矩阵+触点清单"
    "generate_day4_deliverables.js:Day4 痛点图谱+UI审查"
    "generate_day5_deliverables.js:Day5 可行性+公测清单+周报"
    "generate_beta_brand_review.js:公测品牌审查报告"
    "generate_template_brief.js:店铺模板设计Brief"
    "generate_meeting_minutes.js:会议纪要"
    "generate_user_persona_feasibility.js:用户画像可行性"
    "generate_multi_role_evaluation.js:多角色客观评估"
)

ALL=(
    "${CORE[@]}"
    "${SETTLEMENT[@]}"
    "${MARKETING[@]}"
    "${NAMING[@]}"
    "${VIZ[@]}"
    "${BROCHURE[@]}"
    "${DELIVERABLES[@]}"
)

# Deduplicate ALL
declare -A SEEN
UNIQUE_ALL=()
for entry in "${ALL[@]}"; do
    script_name="${entry%%:*}"
    if [[ -z "${SEEN[$script_name]}" ]]; then
        SEEN[$script_name]=1
        UNIQUE_ALL+=("$entry")
    fi
done

# ============================================================================
# Parse args
# ============================================================================

SUBSET="all"

case "${1:-}" in
    --subset)
        SUBSET="${2:-all}"
        ;;
    --list)
        echo "可用分组:"
        echo "  core         — 核心文档（工作总计划+分润模型+合规+执行手册）"
        echo "  settlement   — 分润核销模型全系列"
        echo "  marketing    — 营销策略类"
        echo "  naming       — 品牌命名全系列"
        echo "  viz          — 可视化（HTML思维导图+XMind）"
        echo "  brochure     — 画册/简报类"
        echo "  deliverables — 工作日交付物"
        echo "  all          — 全部（默认）"
        exit 0
        ;;
    --help|-h)
        echo "Usage: ./regenerate_all.sh [--subset core|settlement|marketing|naming|viz|brochure|deliverables|all]"
        echo "       ./regenerate_all.sh --list"
        exit 0
        ;;
esac

# ============================================================================
# Run
# ============================================================================

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  链商2.0 · 文档批量生成${NC}"
echo -e "${BLUE}  分组: ${YELLOW}$SUBSET${NC}"
echo -e "${BLUE}  时间: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Resolve subset to array
case "$SUBSET" in
    core)         TARGET=("${CORE[@]}") ;;
    settlement)   TARGET=("${SETTLEMENT[@]}") ;;
    marketing)    TARGET=("${MARKETING[@]}") ;;
    naming)       TARGET=("${NAMING[@]}") ;;
    viz)          TARGET=("${VIZ[@]}") ;;
    brochure)     TARGET=("${BROCHURE[@]}") ;;
    deliverables) TARGET=("${DELIVERABLES[@]}") ;;
    all)          TARGET=("${UNIQUE_ALL[@]}") ;;
    *)
        echo -e "${RED}未知分组: $SUBSET${NC}"
        echo "可用: core, settlement, marketing, naming, viz, brochure, deliverables, all"
        exit 1
        ;;
esac

for entry in "${TARGET[@]}"; do
    script="${entry%%:*}"
    label="${entry#*:}"
    run_one "$script" "$label"
done

# ============================================================================
# Summary
# ============================================================================

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "  合计: ${GREEN}$PASS 通过${NC}"
if [ "$FAIL" -gt 0 ]; then
    echo -e "        ${RED}$FAIL 失败${NC}"
    echo -e "  失败列表: $FAILED_SCRIPTS"
fi
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
