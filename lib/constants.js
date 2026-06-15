// ============================================================================
// 链商2.0 · 集中参数库 (lib/constants.js)
// SINGLE SOURCE OF TRUTH for all model parameters, ratios, and rules.
// When leadership changes a parameter, change it HERE — all 26 scripts follow.
// ============================================================================
// Usage:
//   const { MODEL, COLORS, COMPLIANCE, FONT, OUTDIR } = require('./lib/constants');
//   const { C, BRAND, h1, p, ... } = require('./lib/docx-helpers');
// ============================================================================

// ============================================================================
// 1. PAYMENT CHANNEL COSTS
// ============================================================================

const CHANNEL = {
    /** 汇付天下收单费率 (微信/支付宝扫码支付) */
    HUIFU_ACQUIRING: 0.006,          // 0.6%
    /** 余额支付渠道成本 */
    BALANCE_PAYMENT: 0.001,          // 0.1%
    /** 消费金核销渠道成本 */
    VOUCHER_REDEMPTION: 0,           // 0%
    /** 二次提现成本 (微信商户号→银行账户) */
    SECONDARY_WITHDRAWAL: 0.001,     // 0.1%
};

// ============================================================================
// 2. BASE DISTRIBUTION RATIOS (三大业态 × 汇付收单)
// All sum to 100%. These are the 6/4 meeting consensus parameters.
// ============================================================================

/** 平台商家 (Platform) — 汇付收单分账 */
const PLATFORM_DIST = {
    channel:        0.006,  // 支付渠道 (汇付)
    merchant:       0.754,  // 商家 75.4%
    platform:       0.050,  // 平台服务费 5%
    station_promoter: 0.090, // 服务站+推广者 9%
    city_partner:   0.010,  // 城市服务商 1%
    consumer_voucher: 0.030, // 消费金 3%
    marketing_pool: 0.040,  // 营销池 4%
    risk_reserve:   0.020,  // 风控备用金 2%
};

/** 联盟商家 (Alliance) — 汇付收单分账 */
const ALLIANCE_DIST = {
    channel:        0.006,  // 支付渠道 (汇付)
    merchant:       0.714,  // 商家 71.4%
    platform_channel_fee: 0.045, // 平台渠道费 4.5%
    platform:       0.050,  // 平台服务费 5%
    station_promoter: 0.100, // 服务站+推广者 10%
    city_partner:   0.010,  // 城市服务商 1%
    consumer_voucher: 0.020, // 消费金 2%
    marketing_pool: 0.035,  // 营销池 3.5%
    risk_reserve:   0.020,  // 风控备用金 2%
};

/** 综合商城 (E-commerce) — 汇付收单分账 */
const ECOMMERCE_DIST = {
    channel:        0.006,  // 支付渠道 (汇付)
    merchant:       0.779,  // 商家 77.9%
    platform:       0.060,  // 平台服务费 6%
    station_promoter: 0.060, // 服务站+推广者 6%
    city_partner:   0.010,  // 城市服务商 1%
    consumer_voucher: 0.030, // 消费金 3%
    marketing_pool: 0.035,  // 营销池 3.5%
    risk_reserve:   0.020,  // 风控备用金 2%
};

// ============================================================================
// 3. TRIPLE MARKETING PARAMETERS (三元营销)
// ============================================================================

const MARKETING = {
    /** 代金券 (Cash Voucher) */
    voucher: {
        issueRate:    0.05,   // 发放比例：交易额×5%
        maxDeduction: 0.30,   // 抵扣上限：订单金额30%
        validityDays: 90,     // 有效期：90天
        universal:    true,   // 全平台通用 🆕
    },
    /** 积分 (Points) */
    points: {
        exchangeRate: 100,    // 兑换率：1元=100积分
        maxDeduction: 0.20,   // 抵扣上限：订单金额20%
        validityDays: 730,    // 有效期：2年
        universal:    true,   // 全平台通用 🆕
    },
    /** 消费金 (Consumer Credit) */
    credit: {
        maxRedemption: 0.30,  // 核销上限：订单金额30%
        validityDays:  365,   // 有效期：12个月
        universal:     true,  // 全平台通用 🆕
    },
};

// ============================================================================
// 4. THREE-TIER MANAGEMENT STRUCTURE (三级管理体系)
// ============================================================================

const MANAGEMENT = {
    /** 城市服务商 (区域合伙人) */
    cityPartner: {
        shareOfReserve: 0.01,    // 从备付金池分1%
        role: '区域合伙人',
    },
    /** 服务站 (社区节点) */
    station: {
        internalSplitStation: 0.35, // 服务站自留35%
        internalSplitPromoter: 0.65, // 推广者分配65%
        role: '社区节点',
    },
    /** 推广者 (一线推广) */
    promoter: {
        role: '一线推广',
    },
};

// ============================================================================
// 5. BREAKEVEN & FINANCIAL METRICS
// ============================================================================

const FINANCIAL = {
    /** 月盈亏平衡交易笔数 */
    breakevenTransactions: 40500,
    /** 净利率 */
    netMargin: 0.0089,          // 0.89%
    /** 风险备用金 (汇付托管，不可动用) */
    riskReserveRate: 0.02,      // 2%
    /** 营销池范围 */
    marketingPoolMin: 0.035,    // 3.5%
    marketingPoolMax: 0.04,     // 4%
};

// ============================================================================
// 6. BRAND COLOR SYSTEM
// ============================================================================

const COLORS = {
    // Primary palette
    DEEP_BLUE:   '#1A5276',  // 深海蓝 — 商务文档主色
    CHAIN_RED:   '#D62828',  // 链商红 — 画册/CTA
    TECH_BLUE:   '#1F5EFF',  // 科技蓝 — 数据/链接
    WARM_ORANGE: '#E67E22',  // 温暖橙 — 强调/CTA

    // Neutral
    DARK_GRAY:   '#333333',  // 正文
    MID_GRAY:    '#7F8C8D',  // 辅助文字
    LIGHT_BG:    '#EBF5FB',  // 浅蓝背景
    SOFT_BG:     '#F8F9FA',  // 柔和卡片背景
    WHITE:       '#FFFFFF',

    // Status
    RED:         '#C0392B',  // 警告/红线
    GREEN:       '#1E8449',  // 合规/通过
    YELLOW:      '#F39C12',  // 注意
    GOLD:        '#D4A843',  // 代金券金

    // Extended
    DEEP_GREEN:  '#0E6655',
    CORAL:       '#E74C3C',
    MINT:        '#27AE60',
    SKY:         '#5DADE2',
    WARM_BG:     '#FDEBD0',
};

// ============================================================================
// 7. STORE-TYPE SEARCH WEIGHTS (千面千店 软性优先级)
// ============================================================================

const STORE_TIER = {
    premium: {
        name: '平台商家',
        searchWeight: +2,
        badge: '品牌认证·蓝标',
        layout: 'Premium — 深度自定义',
        customization: '品牌色/故事/视频/相册',
    },
    standard: {
        name: '联盟商家',
        searchWeight: 0,
        badge: '社区好店·绿标',
        layout: 'Standard — 6套模板+轻定制',
        customization: '品牌色/横幅',
    },
    minimal: {
        name: '综合商城',
        searchWeight: -2,
        badge: '平台自营·灰标',
        layout: 'Minimal — 标准化模板',
        customization: '不可自定义',
    },
};

// ============================================================================
// 8. COMPLIANCE TERMINOLOGY MAP (MANDATORY)
// ============================================================================

const COMPLIANCE_MAP = {
    // 必须替换
    '数字资产':     '消费权益 / 会员权益',
    '数字信用债券':  '商家营销额度',
    '资产增值':     '权益升级',
    '消费信用分':    '消费活跃度指数',
    '分润算法优化引擎': '商家服务费计算规则',
    '收益':        '服务费 / 增收',
    '盈利':        '服务费 / 增收',
    '红利':        '权益升级 / 消费权益',
    '增值回报':     '权益升级 / 消费权益',
    '资本':        '资源 / 产业',
    '资本化':      '资源化 / 产业化',
    '变现':        '转化',
    '创业':        '参与推广 / 开展推广',
    '全球化':      '全国化 / 本地化',
    '数据确权':     '数据权益管理',
    '数据即资产':   '数据驱动经营',
};

/** 绝对禁用词 — 出现在任何文档中应立即警告 */
const COMPLIANCE_FORBIDDEN = [
    '币', 'Token', '通证', '投资回报',
    '稳赚', '躺赚', '数字资产交易',
    '资本集群', '资本化运作',
];

/** 三条合规红线 (6/2 技术会议) */
const COMPLIANCE_REDLINES = [
    '积分不可兑现 (points cannot be converted to cash)',
    '不可形成资金池 (no capital pool without payment license)',
    '不可承诺收益 (no guaranteed returns in any language)',
];

// ============================================================================
// 9. FONT & FORMATTING DEFAULTS
// ============================================================================

const FONT = {
    /** 正文字体 */
    body: '微软雅黑',
    /** 正文字号 (half-points, 21 = 10.5pt) */
    bodySize: 21,
    /** 默认行间距 (twips) */
    lineSpacing: 360,
    /** 页面边距 (twips, 1440 = 1 inch) */
    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
};

// ============================================================================
// 10. OUTPUT DIRECTORY
// ============================================================================

const OUTDIR = '20260602 链商平台 技术部会议整理';

// ============================================================================
// 11. DOCUMENT META
// ============================================================================

const META = {
    creator: '链邦科技 · 梁君衡',
    company: '广东链邦科技有限公司',
    parent: '全球拼购 (GGbingo)',
    brand: '链生活 (Chain Life)',
    platform: '链邦赋商通',
    platformLegacy: '链商2.0',           // 过渡期兼容旧称
    registeredTrademark: '链邦赋商通',    // 2026-06-15 商标注册中（第35/42/9类）
    trademarkAgency: '北京捷佳联合管理咨询有限公司',
};

// ============================================================================
// 12. AGGREGATED MODEL REFERENCE (for convenience)
// ============================================================================

const MODEL = {
    channel: CHANNEL,
    platform: PLATFORM_DIST,
    alliance: ALLIANCE_DIST,
    ecommerce: ECOMMERCE_DIST,
    marketing: MARKETING,
    management: MANAGEMENT,
    financial: FINANCIAL,
    storeTier: STORE_TIER,
};

// ============================================================================
// 13. EXPORTS
// ============================================================================

module.exports = {
    CHANNEL,
    PLATFORM_DIST,
    ALLIANCE_DIST,
    ECOMMERCE_DIST,
    MARKETING,
    MANAGEMENT,
    FINANCIAL,
    COLORS,
    STORE_TIER,
    COMPLIANCE_MAP,
    COMPLIANCE_FORBIDDEN,
    COMPLIANCE_REDLINES,
    FONT,
    OUTDIR,
    META,
    MODEL,
};
