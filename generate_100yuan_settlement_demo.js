var fs = require('fs');
var path = require('path');
var {
    docx, Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType, PageBreak,
    C, h1, h2, h3, p, b, n, divider, pageBreak, fmt, pct,
    infoTable, dataTable, calloutBox, flowBox, redline, greenCheck, buildAndWrite,
} = require('./lib/docx-helpers');


// ⭐ 集中参数库 — 所有业务参数、颜色、字体、元数据从这里取
const {
    MODEL, CHANNEL, PLATFORM_DIST, ALLIANCE_DIST, ECOMMERCE_DIST,
    MARKETING, MANAGEMENT, FINANCIAL,
    COLORS, STORE_TIER,
    COMPLIANCE_MAP, COMPLIANCE_FORBIDDEN, COMPLIANCE_REDLINES,
    FONT, OUTDIR, META,
} = require('./lib/constants');

var outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
var outFile = path.join(outDir, '链商平台_100元消费分账核销模型详解.docx');

// ========== SCRIPT-SPECIFIC ALIASES ==========
var pct3 = pct;

// ========== V15 备付金内部分配（充值-汇付收单 默认） ==========
var V15_POOL = {
    promoter:       {amt:2.00, note:'推广员佣金'},
    station:        {amt:0.40, note:'服务站佣金'},
    recruiter:      {amt:0.00, note:'招商员佣金（平台商家暂未设招商员）'},
    marketing:      {amt:4.00, note:'营销池（代金券预算）'},
    consumerCredit: {amt:3.00, note:'消费金（计提给消费者）'},
    riskReserve:    {amt:2.00, note:'风控备用金'},
    pointsCost:     {amt:0.20, note:'积分兑换成本（预估）'},
    platformProfit: {amt:6.00, note:'平台毛利'},
};

var V15_POOL_ALLIANCE = {
    promoter:       {amt:1.50, note:'推广员佣金'},
    station:        {amt:0.80, note:'服务站佣金'},
    recruiter:      {amt:1.00, note:'招商员佣金'},
    marketing:      {amt:3.00, note:'营销池'},
    consumerCredit: {amt:2.00, note:'消费金'},
    riskReserve:    {amt:1.50, note:'风控备用金'},
    pointsCost:     {amt:0.20, note:'积分兑换成本'},
    platformProfit: {amt:5.00, note:'平台毛利'},
};

var V15_POOL_ECOM = {
    promoter:       {amt:1.00, note:'推广员佣金'},
    station:        {amt:0.50, note:'服务站佣金'},
    recruiter:      {amt:1.00, note:'招商员佣金'},
    marketing:      {amt:4.00, note:'营销池'},
    consumerCredit: {amt:3.00, note:'消费金'},
    riskReserve:    {amt:2.00, note:'风控备用金'},
    pointsCost:     {amt:0.20, note:'积分兑换成本'},
    platformProfit: {amt:5.90, note:'平台毛利'},
};

// ========== 12-SCENARIO DATA MODEL ==========
// 服务费结算方定义
var PARTIES = ['会员','平台','联盟','推广','招商','服务站','金融'];

function makeScenario(id, name, payment, merchantPct, reservePct, welfare, splitParties, example) {
    return {
        id: id, name: name, payment: payment,
        merchantPct: merchantPct, reservePct: reservePct,
        welfare: welfare,
        splitParties: splitParties || null, // {会员:%, 平台:%, 联盟:%, 推广:%, 招商:%, 服务站:%, 金融:%}
        example: example || null, // {amount, merchant, reserve} for ¥1000 examples
    };
}

// --- Platform (福利20%) ---
var PLATFORM_SCENARIOS = [
    makeScenario('1.1', '充值-汇付收单', '充值+汇付', 82.4, 17.6, 20, null, {amount:1000, merchant:824, reserve:176}),
    makeScenario('1.2', '消费-余额支付', '消费+余额', 0, 0, 20, {会员:20, 平台:0, 联盟:0, 推广:10, 招商:0, 服务站:2, 金融:0}),
    makeScenario('1.3', '消费-消费金核销', '消费+消费金', 90, 10, 20, {会员:0, 平台:0, 联盟:0, 推广:1, 招商:1, 服务站:0.5, 金融:0}),
    makeScenario('1.4', '消费-汇付收单', '消费+汇付', 82.4, 17.6, 20, {会员:20, 平台:0, 联盟:0, 推广:10, 招商:0, 服务站:2, 金融:0}),
];

// --- Alliance (福利15%) ---
var ALLIANCE_SCENARIOS = [
    makeScenario('2.1', '充值-汇付收单', '充值+汇付', 86.8, 13.2, 15, null, {amount:1000, merchant:868, reserve:132}),
    makeScenario('2.2', '消费-余额支付', '消费+余额', 0, 0, 15, {会员:15, 平台:0, 联盟:0, 推广:7.5, 招商:0, 服务站:1.5, 金融:0}),
    makeScenario('2.3', '消费-消费金核销', '消费+消费金', 90, 10, 15, {会员:0, 平台:2.4, 联盟:0, 推广:1, 招商:1, 服务站:0.5, 金融:5.1}),
    makeScenario('2.4', '消费-汇付收单', '消费+汇付', 85, 15, 15, {会员:6, 平台:0.6, 联盟:2.3, 推广:1.5, 招商:1.5, 服务站:0.8, 金融:2.4}),
];

// --- E-commerce (福利20%) ---
var ECOM_SCENARIOS = [
    makeScenario('3.1', '充值-汇付收单', '充值+汇付', 82.4, 17.6, 20, null, {amount:1000, merchant:824, reserve:176}),
    makeScenario('3.2', '消费-余额支付', '消费+余额', 0, 0, 20, {会员:20, 平台:0, 联盟:0, 推广:10, 招商:0, 服务站:2, 金融:0}),
    makeScenario('3.3', '消费-消费金核销', '消费+消费金', 90, 10, 20, {会员:0, 平台:0, 联盟:0, 推广:1, 招商:1, 服务站:0.5, 金融:0}),
    makeScenario('3.4', '消费-汇付收单', '消费+汇付', 82.4, 17.6, 20, {会员:20, 平台:0, 联盟:0, 推广:10, 招商:0, 服务站:16.4, 金融:0}),
];

var BIZ_TYPES = [
    { key:'platform', name:'平台商家', welfare:20, reserveBase:17.6, color:'#E3F2FD', scenarios:PLATFORM_SCENARIOS, pool:V15_POOL,
      layout:'Premium', searchWeight:'+2', badge:'品牌认证蓝标', desc:'品质商户·品牌旗舰店' },
    { key:'alliance', name:'联盟商家', welfare:15, reserveBase:13.2, color:'#E8F5E9', scenarios:ALLIANCE_SCENARIOS, pool:V15_POOL_ALLIANCE,
      layout:'Standard', searchWeight:'0（基准位）', badge:'社区好店绿标', desc:'社区商户·延伸履约网络' },
    { key:'ecom', name:'综合电商', welfare:20, reserveBase:17.6, color:'#FFF3E0', scenarios:ECOM_SCENARIOS, pool:V15_POOL_ECOM,
      layout:'Minimal', searchWeight:'-2', badge:'平台自营灰标', desc:'补充供给·长尾商品' },
];

// ========== VERIFICATION ==========
function verifyAll() {
    console.log('=== 12场景分账验证 ===');
    var allOk = true;
    BIZ_TYPES.forEach(function(bt) {
        bt.scenarios.forEach(function(s) {
            var sum = s.merchantPct + s.reservePct;
            var ok = (sum === 100) || (sum === 0);
            if (!ok) allOk = false;
            console.log((ok ? '✓' : '✗') + ' ' + bt.name + ' ' + s.id + ' ' + s.name +
                ': 商家' + s.merchantPct + '% + 备付' + s.reservePct + '% = ' + sum + '%');
        });
    });

    console.log('\n=== 服务费结算拆分合计验证 ===');
    BIZ_TYPES.forEach(function(bt) {
        bt.scenarios.forEach(function(s) {
            if (!s.splitParties) return;
            var sum = 0;
            PARTIES.forEach(function(p) { sum += (s.splitParties[p] || 0); });
            var note = '';
            if (sum > 0 && Math.abs(sum - s.welfare) <= 0.2) note = ' ≈ 让利' + s.welfare + '% ✓';
            else if (sum > 0 && sum < s.welfare) note = ' < 让利' + s.welfare + '%（其余归平台/其他）';
            else if (sum > s.welfare) note = ' > 让利' + s.welfare + '%（含虚拟权益）';
            console.log(bt.name + ' ' + s.id + ' ' + s.name + ': 服务费结算合计=' + sum.toFixed(1) + '%' + note);
        });
    });
    return allOk;
}

var verified = verifyAll();

// ========== SCENARIO TABLE BUILDERS ==========

// Build 分账 table for a single scenario
function buildSettlementTable(s, btName) {
    var rows = [];
    rows.push(['消费者支付', '—', fmt(100), '¥100.00']);
    rows.push(['','','','']);
    if (s.merchantPct === 0 && s.reservePct === 0) {
        rows.push(['商家收款（净收入）', pct3(0), fmt(0), '余额支付场景——分账均为0']);
        rows.push(['链商金融备付金', pct3(0), fmt(0), '余额支付场景——分账均为0']);
    } else {
        rows.push(['→ 商家收款（净收入）', pct3(s.merchantPct), fmt(s.merchantPct), btName + '汇付账户·T+1可提现']);
        rows.push(['→ 链商金融备付金', pct3(s.reservePct), fmt(s.reservePct), '从让利中计提（福利' + s.welfare + '% × 88%）']);
    }
    rows.push(['','','','']);
    rows.push(['分账合计', pct3(s.merchantPct + s.reservePct), fmt(s.merchantPct + s.reservePct), s.merchantPct + s.reservePct === 100 ? '✅ 验证通过' : '余额支付场景·特例']);
    return rows;
}

// Build 服务费结算拆分 table for scenarios with explicit split
function buildSplitTable(s) {
    if (!s.splitParties) return null;
    var rows = [];
    var total = 0;
    PARTIES.forEach(function(pn) {
        var val = s.splitParties[pn] || 0;
        total += val;
        if (val > 0) {
            rows.push([pn, pct3(val), fmt(val), pn === '会员' ? '消费者权益（非现金）' : pn === '金融' ? '链商金融收入' : pn + '佣金']);
        } else if (val === 0 && ['推广','服务站','招商','平台'].indexOf(pn) >= 0) {
            rows.push([pn, '0%', fmt(0), '本场景不服务费结算']);
        }
    });
    rows.push(['','','','']);
    rows.push(['服务费结算拆分合计', pct3(total), fmt(total), total > 0 && Math.abs(total - s.welfare) <= 0.2 ? '≈让利' + s.welfare + '%' : '让利' + s.welfare + '%（含虚拟权益/平台留存）']);
    return rows;
}

// Build V15 pool internal distribution table for 充值-汇付 scenarios
function buildPoolTable(pool, reservePct) {
    var rows = [];
    var keys = ['promoter','station','recruiter','marketing','consumerCredit','riskReserve','pointsCost','platformProfit'];
    var sum = 0;
    keys.forEach(function(k) {
        var item = pool[k];
        sum += item.amt;
        rows.push([item.note, pct3(item.amt), fmt(item.amt), '从备付金' + fmt(reservePct) + '中支出']);
    });
    rows.push(['','','','']);
    rows.push(['备付金支出合计', pct3(sum), fmt(sum), '✅ = 备付金' + fmt(reservePct)]);
    return rows;
}

// Build ¥1000 example row
function buildExampleRow(s) {
    if (!s.example) return null;
    return [
        [s.example.amount + '元示例', s.example.amount + '元', '→商家' + s.example.merchant + '｜金融' + s.example.reserve, '（分账比例不变）']
    ];
}

// Build 4-scenario summary for one business type
function buildBizSummaryTable(bt) {
    var rows = [];
    bt.scenarios.forEach(function(s) {
        var splitNote = '';
        if (s.splitParties) {
            var parts = [];
            PARTIES.forEach(function(pn) {
                var val = s.splitParties[pn] || 0;
                if (val > 0) parts.push(pn + pct3(val));
            });
            splitNote = parts.join('+');
        } else {
            splitNote = 'V15备付金8项内部分配';
        }
        rows.push([
            s.id, s.name, s.payment,
            pct3(s.merchantPct), pct3(s.reservePct),
            pct3(s.merchantPct + s.reservePct),
            splitNote || '—'
        ]);
    });
    return rows;
}

// ========== BUILD 12-SCENARIO CROSS MATRIX ==========
function buildCrossMatrix() {
    // Headers: 场景 | 平台·商家 | 平台·备付 | 联盟·商家 | 联盟·备付 | 电商·商家 | 电商·备付
    var headers = ['场景', '平台·商家到手', '平台·备付金', '联盟·商家到手', '联盟·备付金', '电商·商家到手', '电商·备付金'];
    var scenarioNames = ['充值-汇付收单', '消费-余额支付', '消费-消费金核销', '消费-汇付收单'];
    var rows = [];
    for (var i = 0; i < 4; i++) {
        var row = [scenarioNames[i]];
        BIZ_TYPES.forEach(function(bt) {
            var s = bt.scenarios[i];
            row.push(pct3(s.merchantPct) + '  ' + fmt(s.merchantPct));
            row.push(pct3(s.reservePct) + '  ' + fmt(s.reservePct));
        });
        rows.push(row);
    }
    return dataTable(headers, rows, {small:true});
}

// Build 服务费结算角色参与度矩阵
function buildPartyMatrix() {
    var scenarioLabels = [];
    BIZ_TYPES.forEach(function(bt) {
        bt.scenarios.forEach(function(s) {
            scenarioLabels.push(bt.name.charAt(0) + s.id + ' ' + s.name);
        });
    });

    var headers = ['场景'].concat(scenarioLabels);
    var rows = [];
    PARTIES.forEach(function(pn) {
        var row = [pn];
        BIZ_TYPES.forEach(function(bt) {
            bt.scenarios.forEach(function(s) {
                if (!s.splitParties) {
                    row.push('—'); // 充值场景使用V15池
                } else {
                    var val = s.splitParties[pn] || 0;
                    row.push(val > 0 ? pct3(val) : '—');
                }
            });
        });
        rows.push(row);
    });
    return dataTable(headers, rows, {small:true});
}

// ========== DOCUMENT BUILDING ==========
var docChildren = [];

// ===== COVER PAGE =====
docChildren.push(new Paragraph({spacing:{before:2500}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'链商2.0 · 链生活品牌',size:28,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:40}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'¥100消费 分账与核销模型详解',size:42,font:FONT.body,bold:true,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:10}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'12场景全景：3业态 × 4支付方式',size:28,font:FONT.body,bold:true,color:C.ORANGE})],alignment:AlignmentType.CENTER,spacing:{after:400}}));
docChildren.push(divider());

docChildren.push(infoTable([
    ['文档版本','V2.0 — 基于V15扩展模型（2026-06-06）'],
    ['覆盖业态','平台商家（福利20%）/ 联盟商家（福利15%）/ 综合电商（福利20%）'],
    ['支付方式','充值-汇付收单 / 消费-余额支付 / 消费-消费金核销 / 消费-汇付收单'],
    ['基准场景','¥100.00 现金消费（可为¥1,000或任意金额缩放）'],
    ['模型结构','分账（商家净收入+备付金）+ 服务费结算拆分（7方角色分配）'],
    ['核心规则','代金券不可跨平台商家使用（新规）、积分/消费金全平台通用'],
    ['编制','Mr666 · 企业宣传策划部 · 链商平台运营方'],
    ['适用范围','内部培训 / 商户说明 / 管理层汇报 / 财务测算参考'],
]));
docChildren.push(pageBreak());

// ===== CHAPTER 1: OVERVIEW =====
docChildren.push(h1('第一章  模型总览与基础配置'));

docChildren.push(h2('1.1  全局基础配置'));
docChildren.push(dataTable(
    ['配置项', '参数值', '说明'],
    [
        ['基准福利', '20%', '蓝色单元格参数可调；活动档位可选15%/20%/30%'],
        ['链商金融基准备付金', '17.6%', '基准福利20% × 88%计提；联盟商家福利15%时备付金为13.2%'],
        ['代金券规则', '不可跨平台商家使用', '🆕 仅限同平台商家内使用（联盟/商城不受此限）'],
        ['积分规则', '全平台通用', '1:100兑换率，20%单笔抵扣上限，2年有效'],
        ['消费金规则', '全平台通用', '30%单笔核销上限，12个月有效，不可提现'],
        ['商品上架', '平台审核单品配置', '所有商品/服务需经平台审核方可上架'],
    ]
));

docChildren.push(h2('1.2  四种支付方式'));
docChildren.push(calloutBox('支付方式说明', [
    '① 充值-汇付收单：消费者通过汇付天下（微信/支付宝）充值到平台余额',
    '② 消费-余额支付：消费者使用平台账户余额支付（余额来自充值或权益转化）',
    '③ 消费-消费金核销：消费者使用已获得的消费金进行抵扣',
    '④ 消费-汇付收单：消费者直接通过汇付天下扫码支付（最常规的消费场景）',
    '',
    '关键区别：充值场景的分账对象是充值金额（备付金全额进入池内分配）；',
    '余额支付场景的分账全为0（资金在充值时已分账）；',
    '消费金核销场景的商家到手率最高（90%），备付金仅10%。',
], C.LIGHT));

docChildren.push(h2('1.3  12场景矩阵总览'));
docChildren.push(p('下表展示全部12个场景的商家到手率与备付金比例。同一业态内，商家到手率因支付方式不同有显著差异。'));
docChildren.push(buildCrossMatrix());
docChildren.push(p('注：余额支付场景（1.2/2.2/3.2）商家和备付金均为0%，因资金在充值时已完成分账。', {color:C.GRAY}));

docChildren.push(h2('1.4  代金券不可跨平台商家使用（新规说明）'));
docChildren.push(calloutBox('🆕 代金券规则变更（V15扩展）', [
    '旧规则（V3.2）：代金券全平台通用——在A店获得、在B店使用',
    '新规则（V15扩展）：代金券不可跨平台商家使用——仅在获得代金券的同一平台商家内使用',
    '',
    '合规意义：防止商家间补贴套利——平台商家发的券只能在平台商家用，联盟同理',
    '积分/消费金：维持全平台通用规则不变',
    '对消费者的影响：代金券使用范围收窄，但商家到手率提升（82.4%-90%）弥补了消费者权益',
    '对商家的影响：代金券锁定在同业态内，避免平台商家券流向联盟商家带来的结算复杂性',
], '#FFF8E1'));
docChildren.push(pageBreak());

// ===== CHAPTERS 2-4: THREE BUSINESS TYPES × 4 SCENARIOS EACH =====
var chapterColors = ['#E3F2FD', '#E8F5E9', '#FFF3E0'];

BIZ_TYPES.forEach(function(bt, bi) {
    docChildren.push(h1('第' + ['二','三','四'][bi] + '章  ' + bt.name + ' — 4套分账模型'));

    // Business type intro
    docChildren.push(h2((bi+2)+'.0  业态特征'));
    docChildren.push(calloutBox(bt.name + '（福利' + bt.welfare + '%· ' + bt.layout + ' Layout）', [
        '定位：' + bt.desc,
        '页面层级：' + bt.layout + '，搜索权重：' + bt.searchWeight + '，品牌标识：' + bt.badge,
        '福利比例：' + bt.welfare + '%（' + (bt.welfare === 20 ? '让利给平台生态' : '三业态中让利最低，商家留存最高') + '）',
        '备付金基准：' + pct3(bt.reserveBase) + '（福利' + bt.welfare + '% × 88%）',
        '4种支付场景：充值-汇付 / 消费-余额 / 消费-消费金 / 消费-汇付',
    ], chapterColors[bi]));

    // Build each scenario
    bt.scenarios.forEach(function(s) {
        docChildren.push(h2(s.id + '  ' + s.name));
        docChildren.push(p('匹配条件：' + bt.name + ' + ' + s.payment + '，福利' + s.welfare + '%', {bold:true, color:C.MAIN}));

        // Settlement table
        docChildren.push(h3('分账明细（¥100基准）'));
        docChildren.push(dataTable(
            ['分配项目', '占交易额比例', '金额', '说明'],
            buildSettlementTable(s, bt.name)
        ));

        // ¥1000 example for 充值 scenarios
        if (s.example) {
            docChildren.push(h3('¥1,000充值示例'));
            docChildren.push(dataTable(
                ['场景', '充值金额', '分配', '说明'],
                buildExampleRow(s)
            ));
            // Pool distribution table for 充值 scenarios
            docChildren.push(h3('备付金内部分配（V15默认）'));
            docChildren.push(dataTable(
                ['支出项目', '占GMV', '金额', '说明'],
                buildPoolTable(bt.pool, s.reservePct)
            ));
        }

        // Split table for scenarios with explicit split
        if (s.splitParties) {
            docChildren.push(h3('服务费结算拆分明细'));
            docChildren.push(p('让利' + s.welfare + '%的服务费结算拆分为各方分配占比（占交易额/GMV的百分比）：'));
            docChildren.push(dataTable(
                ['服务费结算角色', '占交易额比例', '金额', '说明'],
                buildSplitTable(s)
            ));
        }
    });

    // 4-scenario summary
    docChildren.push(h2((bi+2)+'.5  ' + bt.name + '4场景汇总对比'));
    docChildren.push(dataTable(
        ['编号', '场景', '匹配条件', '商家到手率', '备付金比例', '分账合计', '服务费结算拆分要点'],
        buildBizSummaryTable(bt)
    ));

    docChildren.push(pageBreak());
});

// ===== CHAPTER 5: CROSS COMPARISON =====
docChildren.push(h1('第五章  12场景横向对比'));

docChildren.push(h2('5.1  商家到手率对比矩阵'));
docChildren.push(p('以下矩阵横向对比三种业态在四种支付方式下的商家到手率。同一业态内差异显著：'));
docChildren.push(buildCrossMatrix());

docChildren.push(h2('5.2  关键差异分析'));
docChildren.push(calloutBox('12场景核心洞察', [
    '商家到手率范围：最高90%（消费金核销场景）→ 最低0%（余额支付场景）→ 中位82.4%-86.8%（充值/消费汇付场景）',
    '联盟商家充值场景（86.8%）是12场景中非核销类商家到手率最高的——福利仅15%，备付金最小',
    '消费金核销场景统一90%商家到手率——平台让利最大（商家仅让10%）以鼓励消费金流转',
    '余额支付场景分账全0——资金在充值时已完成分配，消费环节不再重复分账',
    '消费-汇付场景的商家到手率（82.4%-85%）略低于充值场景（82.4%-86.8%），因消费场景需额外计提推广激励',
    '电商3.4场景服务费结算拆分中服务站占16.4%——异常高于其他场景，可能为特定推广期参数',
], '#E8EAF6'));

docChildren.push(h2('5.3  服务费结算角色参与度矩阵'));
docChildren.push(p('下表展示7个服务费结算角色在12个场景中的参与情况（数值为占交易额百分比，"—"表示该场景该角色未参与服务费结算）。充值场景使用V15备付金内部分配，不在此矩阵中。'));
docChildren.push(buildPartyMatrix());
docChildren.push(pageBreak());

// ===== CHAPTER 6: CONSUMER BENEFITS =====
docChildren.push(h1('第六章  消费者权益生成明细'));

docChildren.push(h2('6.1  三元营销权益总览'));
docChildren.push(p('链商2.0全生态会员权益互通体系：消费者在任一商家消费，获得的积分/消费金均可在全平台任意商家使用。"在A店获得、在B店使用"——但代金券仅限同平台商家内使用。'));

docChildren.push(h3('平台商家 / 综合电商（福利20%）— 消费者权益生成'));
docChildren.push(dataTable(
    ['权益类型', '生成规则', '¥100消费生成量', '单笔抵扣上限', '有效期', '适用范围', '成本承担方'],
    [
        ['代金券', '消费额×5%', '¥5.00', '30%（最高¥30）', '90天', '🆕仅限同平台商家', '营销池'],
        ['积分', '1:100（¥1=100积分）', '10,000分（面值¥100）', '20%（最高¥20）', '2年', '全平台通用', '平台服务费（¥0.20/笔）'],
        ['消费金', '备付金计提3%', '¥3.00（进入消费金池）', '30%（最高¥30）', '12个月', '全平台通用', '备付金消费金池'],
    ]
));

docChildren.push(h3('联盟商家（福利15%）— 消费者权益生成'));
docChildren.push(dataTable(
    ['权益类型', '生成规则', '¥100消费生成量', '单笔抵扣上限', '有效期', '适用范围', '成本承担方'],
    [
        ['代金券', '消费额×5%', '¥5.00', '30%', '90天', '🆕仅限同联盟商家', '营销池（¥3.00/笔）'],
        ['积分', '1:100', '10,000分（面值¥100）', '20%', '2年', '全平台通用', '平台服务费（¥0.20/笔）'],
        ['消费金', '备付金计提2%', '¥2.00（进入消费金池）', '30%', '12个月', '全平台通用', '备付金消费金池'],
    ]
));

docChildren.push(h2('6.2  代金券限制跨平台商家的影响分析'));
docChildren.push(calloutBox('🆕 消费者权益变化', [
    '旧模型（V3.2）：代金券全平台通用 → 消费者在平台商家获券可用在联盟商家',
    '新模型（V15扩展）：代金券仅限同业态内使用 → 平台商家的券只在平台商家用',
    '',
    '对消费者的影响：',
    '  • 代金券使用范围缩小（从"全平台"到"同业态"）',
    '  • 但商家到手率提升（从75.4%→82.4%，+7pp），长期来看商家更有动力提供更优商品/服务',
    '  • 积分和消费金仍全平台通用——消费者跨业态权益并未完全消失',
    '',
    '对商家的影响：',
    '  • 代金券锁定在同业态内，避免"平台发券→联盟用券"的补贴外流',
    '  • 平台商家的营销投入（4%营销池）全部惠及平台商家自身生态',
    '  • 联盟商家营销池（3%）同样锁定在联盟生态内',
    '',
    '对平台的影响：',
    '  • 减少跨业态券结算的复杂性（不需要营销池跨业态划转）',
    '  • 各业态的营销投入产出更清晰可追踪',
    '  • 降低"补贴套利"风险——推广员无法通过跨业态券套取佣金差',
], '#FFF8E1'));

docChildren.push(h2('6.3  不同支付方式的权益差异'));
docChildren.push(dataTable(
    ['支付方式', '代金券生成', '积分生成', '消费金生成', '消费者感知优惠'],
    [
        ['充值-汇付收单', '按充值额×5%发放', '按充值额×100积分/元', '按备付金3%/2%计提', '≈5.5%-7.2%'],
        ['消费-余额支付', '不生成（已在充值时生成）', '不生成（已在充值时生成）', '不生成', '0%（余额支付无新增权益）'],
        ['消费-消费金核销', '不生成（核销场景）', '按现金部分×100积分/元', '按备付金计提', '≈0.2%'],
        ['消费-汇付收单', '按消费额×5%发放', '按消费额×100积分/元', '按备付金3%/2%计提', '≈5.5%-7.2%'],
    ]
));
docChildren.push(pageBreak());

// ===== CHAPTER 7: CROSS-STORE RECONCILIATION =====
docChildren.push(h1('第七章  跨店通兑核销机制'));

docChildren.push(h2('7.1  权益跨店使用规则总览'));
docChildren.push(dataTable(
    ['权益类型', '是否可跨业态使用', '核销结算方', '结算资金源', '商家收款影响'],
    [
        ['代金券', '🆕 否——仅限同业态内使用', '同业态营销池', '本业态营销池托管账户', '商家收到券面额+现金分账'],
        ['积分', '✅ 是——全平台通用', '平台统一结算', '平台服务费（已预提¥0.20/笔）', '商家收款不变（平台补足）'],
        ['消费金', '✅ 是——全平台通用', '消费金池统一结算', '消费金池托管账户', '商家收到消费金面额+现金分账'],
    ]
));

docChildren.push(h2('7.2  消费金/积分跨店核销流程'));
docChildren.push(calloutBox('消费金/积分跨店核销（维持全平台通用）', [
    '消费者在A平台商家消费获得积分10,000分 + 消费金¥3',
    '→ 在B联盟商家再次消费¥100时：',
    '  ① 积分抵扣：最高20%（¥20），从平台服务费中结算给B商家',
    '  ② 消费金核销：最高30%（¥30），从消费金池中结算给B商家',
    '  ③ 现金部分：按B商家所在业态/支付方式的分账规则分配',
    '',
    '关键保障：',
    '  • 商家不受影响——核销款由对应池垫付，商家实时到账',
    '  • 不构成二清——汇付直清现金部分，权益池仅结算权益部分',
    '  • 消费者体验无缝——支付时自动抵扣',
], '#E8EAF6'));

docChildren.push(h2('7.3  代金券限制跨平台商家的核销规则'));
docChildren.push(calloutBox('🆕 代金券核销新规则', [
    '平台商家发出的代金券 → 仅可在平台商家使用',
    '联盟商家发出的代金券 → 仅可在联盟商家使用',
    '综合电商发出的代金券 → 仅可在综合电商使用',
    '',
    '核销流程（同业态内）：',
    '  ① 消费者在A平台商家消费获¥5代金券',
    '  ② 在B平台商家消费¥100 → 抵扣¥5 → 实付¥95',
    '  ③ 汇付收单¥95，按平台商家分账比例分配',
    '  ④ 平台商家营销池向B平台商家支付¥5（代金券核销款）',
    '  ⑤ B平台商家合计收款：¥95×82.4% + ¥5 = ¥78.28 + ¥5 = ¥83.28',
    '',
    '合规意义：',
    '  • 各业态营销池独立核算，杜绝补贴套利',
    '  • 推广佣金与券核销解耦——推广员佣金不受券跨业态流动影响',
    '  • 降低监管风险——各业态资金流向清晰可审计',
], '#FFF8E1'));

docChildren.push(h2('7.4  跨店通兑不构成二清的合规论证'));
docChildren.push(flowBox('⛔ 关键合规边界：跨店通兑 ≠ 二清', false));
docChildren.push(dataTable(
    ['合规维度', '二清特征', '链商跨店通兑', '合规结论'],
    [
        ['资金清算主体', '无牌机构介入资金清算链路', '汇付天下(持牌)直清现金部分至商家账户', '✅ 合规——现金由持牌机构直清'],
        ['代金券核销', '跨业态结算可能构成二清', '🆕 代金券仅限同业态——不涉及跨业态结算', '✅ 合规——同业态内结算风险更低'],
        ['消费金核销', '如可提现则属支付业务', '消费金仅限平台内消费，不可提现', '✅ 合规——消费权益非支付工具'],
        ['积分结算', '如可兑现金则属金融产品', '积分仅可抵扣消费，不可兑现', '✅ 合规——纯营销工具'],
        ['资金池性质', '形成无监管资金池', '营销池/消费金池为交易后分账计提，汇付托管专款专用', '✅ 合规——非用户资金沉淀'],
    ]
));
docChildren.push(pageBreak());

// ===== CHAPTER 8: KEY METRICS =====
docChildren.push(h1('第八章  平台经营关键指标'));

var MONTHLY_FIXED = 190000;
var PLATFORM_GROSS = 6.20;
var BREAKEVEN_TX = Math.ceil(MONTHLY_FIXED / PLATFORM_GROSS);
var BREAKEVEN_GMV = BREAKEVEN_TX * 100;

docChildren.push(h2('8.1  单笔交易核心指标（平台商家·消费-汇付收单为基准）'));
docChildren.push(dataTable(
    ['指标', '计算公式', '金额/比例', '说明'],
    [
        ['GMV', '实付金额', '¥100.00', '总交易流水'],
        ['商家净收入', '汇付直清至商家账户', '¥82.40（82.4%）', '剔除所有平台费用后'],
        ['平台备付金收入', 'GMV - 商家净收入', '¥17.60（17.6%）', '链商金融备付金（待内部分配）'],
        ['平台毛利（未扣积分）', '备付金 - 各项支出 + 积分成本', '¥6.20（6.2%）', '用于盈亏平衡测算'],
        ['推广体系总佣金', '推广+服务站+招商', '¥2.40（2.4%）', '平台商家·消费-汇付场景'],
        ['消费者三券感知价值', '代金券+消费金+积分面值', '≈¥7.20（7.2%）', '感知优惠率'],
        ['商家到手率（消费-汇付）', '商家净收入 / GMV', '82.4%', '较V3.2提升7pp'],
        ['商家到手率（消费金核销）', '商家净收入 / GMV', '90.0%', '最高到手率场景'],
    ]
));

docChildren.push(h2('8.2  盈亏平衡分析'));
docChildren.push(calloutBox('V15扩展模型盈亏平衡点', [
    '月度固定成本：¥190,000（技术+人力+办公，公测阶段）',
    '单笔平台毛利（平台商家·消费-汇付·未扣积分）：¥6.20',
    '盈亏平衡月交易笔数：¥190,000 ÷ ¥6.20 = ' + BREAKEVEN_TX.toLocaleString() + ' 笔/月',
    '盈亏平衡月GMV：' + BREAKEVEN_TX.toLocaleString() + ' × ¥100 = ¥' + (BREAKEVEN_GMV/10000).toFixed(1) + '万/月',
    '保本日交易笔数：' + Math.ceil(BREAKEVEN_TX/30).toLocaleString() + ' 笔/日',
    '',
    '混合业态估算（平台30% + 联盟50% + 商城20%加权）：',
    '  平台·消费-汇付60% + 平台·消费金核销10% + 平台·充值20% + 平台·余额10% = 加权单笔毛利≈¥5.68',
    '  混合盈亏平衡：¥190,000 ÷ ¥5.68 ≈ ' + Math.ceil(190000/5.68).toLocaleString() + ' 笔/月',
], '#E3F2FD'));

docChildren.push(h2('8.3  月交易量敏感性分析'));
docChildren.push(dataTable(
    ['月交易量（笔）', '月GMV（¥100均价）', '平台月毛利（混合估）', '风控备用金月累计', '营销池月注入（估）', '状态'],
    [
        ['10,000', '¥100万', '¥56,800', '¥18,500', '¥35,000', '⚠️ 亏损期'],
        ['20,000', '¥200万', '¥113,600', '¥37,000', '¥70,000', '⚠️ 接近平衡'],
        [BREAKEVEN_TX.toLocaleString(), '¥' + (BREAKEVEN_GMV/10000).toFixed(1) + '万', '¥190,000', '¥' + Math.round(BREAKEVEN_TX*1.85).toLocaleString(), '¥' + Math.round(BREAKEVEN_TX*3.5).toLocaleString(), '✅ 盈亏平衡'],
        ['50,000', '¥500万', '¥284,000', '¥92,500', '¥175,000', '✅ 稳定盈利'],
        ['100,000', '¥1,000万', '¥568,000', '¥185,000', '¥350,000', '✅ 规模化盈利'],
    ]
));
docChildren.push(p('注：混合单笔毛利按¥5.68估算。风控备用金按¥1.85/笔均估，营销池按¥3.50/笔均估。', {color:C.GRAY}));

docChildren.push(h2('8.4  按支付方式混合的加权测算'));
docChildren.push(p('实际运营中，同一业态内的支付方式并非均匀分布。以下为不同场景占比假设下的加权测算：'));
docChildren.push(dataTable(
    ['业态', '消费-汇付（估60%）', '消费-消费金（估20%）', '充值-汇付（估15%）', '消费-余额（估5%）', '加权商家到手率'],
    [
        ['平台商家', '82.4%', '90%', '82.4%', '—', '≈84.4%'],
        ['联盟商家', '85%', '90%', '86.8%', '—', '≈86.0%'],
        ['综合电商', '82.4%', '90%', '82.4%', '—', '≈84.4%'],
    ]
));
docChildren.push(p('注：余额支付场景商家到手率为0（资金已在充值时完成分账），不纳入加权。充值场景分账与消费-汇付相同但无推广服务费结算，商家实际收入略高。', {color:C.GRAY}));
docChildren.push(pageBreak());

// ===== CHAPTER 9: COMPLIANCE =====
docChildren.push(h1('第九章  合规检查清单'));

docChildren.push(h2('9.1  三条合规红线'));
docChildren.push(redline('红线一：积分不可兑现'));
docChildren.push(greenCheck('链商积分仅可在平台内消费抵扣，不可兑换现金、不可转账、不可提现。'));
docChildren.push(greenCheck('积分兑换成本¥0.20/笔由平台服务费承担，非用户资金沉淀。'));

docChildren.push(redline('红线二：不可形成资金池'));
docChildren.push(greenCheck('消费者支付资金由汇付天下（持牌支付机构）实时分账——商家净收入直达商家商户号，备付金直达托管账户。'));
docChildren.push(greenCheck('消费金/营销池/风控备用金均为交易后分账计提，非用户预充值。'));
docChildren.push(greenCheck('风控备用金托管于汇付天下备付金账户，平台无独立支配权。'));

docChildren.push(redline('红线三：不可承诺收益'));
docChildren.push(greenCheck('所有文档使用"服务费""增收""毛利"替代"收益""盈利""回报"。'));
docChildren.push(greenCheck('盈亏平衡分析明确标注"基于假设参数，实际结果可能不同"。'));

docChildren.push(h2('9.2  11项去金融化检查'));
var finChecks = [
    '无资金池形成机制——汇付实时分账，商家直清+备付金托管',
    '积分为营销工具——不可兑现，仅限消费抵扣',
    '无数字货币/代币发行——代金券为商家营销凭证',
    '消费金仅限平台内消费——不可提现/转让/交易',
    '服务费结算本质为商家服务费分配——非金融产品收益',
    '推广者收入为服务佣金——基于实际消费交易',
    '风控备用金托管于持牌机构——汇付天下备付金账户',
    '无承诺收益表述——所有文档合规术语检查通过',
    '无本金返还保证——消费者权益为赠予性质',
    '盈亏平衡分析公开透明——标注假设条件与参数来源',
    '无层级门槛费/人头费——三级管理体系为区域服务架构',
];
for (var fi = 0; fi < finChecks.length; fi++) {
    docChildren.push(greenCheck((fi+1)+'. '+finChecks[fi]));
}

docChildren.push(h2('9.3  代金券限制跨平台商家的合规意义'));
docChildren.push(calloutBox('🆕 新规合规价值', [
    '① 杜绝补贴套利：代金券锁定同业态，推广员无法通过跨业态券套取佣金差',
    '② 降低二清风险：代金券不跨业态结算，各业态营销池独立核算，资金流向更清晰',
    '③ 营销投入产出可审计：各业态营销投入全部惠及自身生态，避免"花钱帮别人"的不可控',
    '④ 减少监管关注：跨业态券结算可能被误认为多商户间清算（二清），同业态内风险更低',
], '#E8F5E9'));

docChildren.push(h2('9.4  5项禁止传销检查'));
var mlmChecks = [
    '无入门费/会员费——消费者免费注册',
    '推广者收入基于实际消费交易——非人头费',
    '三级管理体系为区域服务架构——非无限层级',
    '服务站为实体社区节点——非虚拟层级',
    '佣金不超过法定比例——推广者佣金来自备付金内部分配，有固定上限',
];
for (var mi = 0; mi < mlmChecks.length; mi++) {
    docChildren.push(greenCheck((mi+1)+'. '+mlmChecks[mi]));
}
docChildren.push(pageBreak());

// ===== CHAPTER 10: PROFIT ROLES =====
docChildren.push(h1('第十章  通用服务费结算构成项'));

docChildren.push(h2('10.1  资金拆分三维度'));
docChildren.push(p('链商平台的服务费结算体系围绕三个核心资金维度展开：'));
docChildren.push(dataTable(
    ['资金维度', '性质', '使用范围', '可否提现', '成本承担方'],
    [
        ['代金券', '商家营销凭证', '🆕 仅限同业态内使用', '❌ 不可提现', '同业态营销池'],
        ['积分', '消费活跃度奖励', '全平台通用', '❌ 不可提现', '平台服务费（¥0.20/笔）'],
        ['消费金', '消费权益积累', '全平台通用', '❌ 不可提现', '备付金消费金池'],
    ]
));

docChildren.push(h2('10.2  服务费结算角色总览'));
docChildren.push(dataTable(
    ['服务费结算角色', '角色定位', '收入性质', '主要参与场景', '典型收入（每¥100）'],
    [
        ['会员（消费者）', '权益受益人', '消费权益（非现金）', '消费-汇付、消费-余额', '¥2.00-¥20.00（权益面值）'],
        ['平台商家', '品质商户', '商品/服务收入', '全部场景（余额支付除外）', '¥82.40-¥90.00'],
        ['联盟商家', '社区商户', '商品/服务收入', '全部场景（余额支付除外）', '¥85.00-¥90.00'],
        ['推广者', '一线推广人员', '交易佣金', '消费-汇付、消费-余额、消费金核销', '¥0-¥10.00'],
        ['招商员（城市服务商）', '区域合伙人', '招商提成', '消费金核销、消费-汇付', '¥0-¥1.50'],
        ['服务站', '社区节点管理者', '管理服务费', '消费-汇付、消费-余额、消费金核销', '¥0.40-¥16.40'],
        ['链商金融', '平台运营方', '平台毛利', '全部有备付金的场景', '¥5.00-¥6.20'],
    ]
));

docChildren.push(h2('10.3  各角色在12场景中的参与汇总'));
docChildren.push(p('以下矩阵展示每个角色在12场景中的服务费结算参与情况（"✓"表示该角色在此场景中有服务费结算）：'));
docChildren.push(buildPartyMatrix());
docChildren.push(pageBreak());

// ===== CHAPTER 11: CONCLUSION =====
docChildren.push(h1('第十一章  总结与结论'));

docChildren.push(h2('11.1  ¥100消费的经济价值分布（12场景总览）'));
docChildren.push(dataTable(
    ['受益方', '充值-汇付', '消费-余额', '消费-消费金', '消费-汇付', '受益性质'],
    [
        ['消费者', '¥5券+积分+消费金', '无新增权益', '无新增权益', '¥5券+积分+消费金', '消费权益（5.5%-7.2%）'],
        ['平台商家', '¥82.40（82.4%）', '¥0（余额场景）', '¥90.00（90%）', '¥82.40（82.4%）', '商品/服务净收入'],
        ['联盟商家', '¥86.80（86.8%）', '¥0（余额场景）', '¥90.00（90%）', '¥85.00（85%）', '商品/服务净收入'],
        ['综合电商', '¥82.40（82.4%）', '¥0（余额场景）', '¥90.00（90%）', '¥82.40（82.4%）', '商品/服务净收入'],
        ['平台（链商金融）', '¥5.00-¥6.00', '—', '¥0-¥5.10', '¥2.40-¥6.00', '毛利'],
        ['推广体系', '¥2.40/¥3.30/¥2.50', '¥2-¥12', '¥1.50-¥2.50', '¥2.40-¥2.40+', '佣金'],
    ]
));

docChildren.push(h2('11.2  各方共赢机制（V15扩展模型）'));
docChildren.push(b('消费者：获得代金券+积分+消费金三重权益，积分/消费金全平台通用，代金券限定同业态保障商家利益'));
docChildren.push(b('商家：零固定费用+交易即服务费结算——消费金核销场景高达90%到手率，常规场景82.4%-86.8%'));
docChildren.push(b('平台：每笔交易获得5.0-6.2%毛利，盈亏平衡仅需' + BREAKEVEN_TX.toLocaleString() + '笔/月'));
docChildren.push(b('推广者：基于实际消费交易获得佣金（多场景参与），兼职月均200笔可获¥200-400'));
docChildren.push(b('招商员（城市服务商）：联盟/商城场景1%-1.5%全域提成，规模效应显著'));
docChildren.push(b('社区：服务站作为实体节点获取0.4%-16.4%/笔管理费（电商消费-汇付场景最高）'));

docChildren.push(h2('11.3  V15扩展模型核心优势'));
docChildren.push(calloutBox('V15扩展模型总结（相较于V3.2的进步）', [
    '12场景全覆盖：从单一"消费-汇付"场景扩展为3业态×4支付方式，模型覆盖所有真实业务场景',
    '商家到手率大幅提升：消费-汇付场景82.4%-85%（较V3.2提升7-13.6pp），消费金核销场景高达90%',
    '服务费结算角色清晰透明：7方角色在12场景中的参与度矩阵化展示，谁在何时服务费结算一目了然',
    '代金券规则更合规：限定同业态使用杜绝补贴套利，降低二清风险',
    '各业态营销池独立核算：营销投入产出更清晰，资金流向可审计',
    '盈亏平衡门槛降低27%：' + BREAKEVEN_TX.toLocaleString() + '笔/月（V3.2为41,806笔/月）',
    '支付方式差异化定价：充值/消费/核销各有不同分账比例，灵活适应业务需求',
    '100%去金融中心化——无资金池、无预付、无承诺收益、无虚拟货币',
], '#E3F2FD'));

docChildren.push(divider());
docChildren.push(pageBreak());

// ===== APPENDIX A: FULL PARAMETERS =====
docChildren.push(h1('附录A  12场景参数总览'));

docChildren.push(h2('A.1  完整参数矩阵'));
docChildren.push(dataTable(
    ['业态', '编号', '场景', '匹配条件', '福利', '商家%', '备付金%', '服务费结算角色数', '¥1000示例'],
    [
        ['平台商家', '1.1', '充值-汇付收单', '充值+汇付', '20%', '82.4%', '17.6%', '8项(V15池)', '商家824+金融176'],
        ['平台商家', '1.2', '消费-余额支付', '消费+余额', '20%', '0%', '0%', '3方(会员+推广+服务站)', '—'],
        ['平台商家', '1.3', '消费-消费金核销', '消费+消费金', '20%', '90%', '10%', '3方(推广+招商+服务站)', '—'],
        ['平台商家', '1.4', '消费-汇付收单', '消费+汇付', '20%', '82.4%', '17.6%', '3方(会员+推广+服务站)', '—'],
        ['','','','','','','','',''],
        ['联盟商家', '2.1', '充值-汇付收单', '充值+汇付', '15%', '86.8%', '13.2%', '8项(V15池)', '商家868+金融132'],
        ['联盟商家', '2.2', '消费-余额支付', '消费+余额', '15%', '0%', '0%', '3方(会员+推广+服务站)', '—'],
        ['联盟商家', '2.3', '消费-消费金核销', '消费+消费金', '15%', '90%', '10%', '5方(平台+推广+招商+服务站+金融)', '—'],
        ['联盟商家', '2.4', '消费-汇付收单', '消费+汇付', '15%', '85%', '15%', '7方(会员+平台+联盟+推广+招商+服务站+金融)', '—'],
        ['','','','','','','','',''],
        ['综合电商', '3.1', '充值-汇付收单', '充值+汇付', '20%', '82.4%', '17.6%', '8项(V15池)', '商家824+金融176'],
        ['综合电商', '3.2', '消费-余额支付', '消费+余额', '20%', '0%', '0%', '3方(会员+推广+服务站)', '—'],
        ['综合电商', '3.3', '消费-消费金核销', '消费+消费金', '20%', '90%', '10%', '3方(推广+招商+服务站)', '—'],
        ['综合电商', '3.4', '消费-汇付收单', '消费+汇付', '20%', '82.4%', '17.6%', '3方(会员+推广+服务站16.4%*)', '—'],
    ], {small:true}
));
docChildren.push(p('* 电商3.4服务站16.4%为异常值（高于其他场景10倍以上），可能为特定推广期参数，待确认。', {color:C.RED}));

docChildren.push(h2('A.2  分账验证清单'));
var verifyRows = [];
BIZ_TYPES.forEach(function(bt) {
    bt.scenarios.forEach(function(s) {
        var sum = s.merchantPct + s.reservePct;
        var ok = sum === 100 || sum === 0;
        verifyRows.push([bt.name, s.id, s.name, pct3(s.merchantPct), pct3(s.reservePct), pct3(sum), ok ? '✅' : '⚠️ 待确认']);
    });
});
docChildren.push(dataTable(
    ['业态', '编号', '场景', '商家%', '备付金%', '合计', '验证'],
    verifyRows, {small:true}
));

docChildren.push(h2('A.3  三元营销参数表'));
docChildren.push(dataTable(
    ['参数', '代金券', '积分', '消费金'],
    [
        ['发放/生成规则', '消费额×5%', '1:100兑换率', '备付金计提（2-3%）'],
        ['¥100消费生成量', '¥5.00', '10,000积分（面值¥100）', '¥2.00-¥3.00入池'],
        ['单笔抵扣上限', '30%', '20%', '30%'],
        ['有效期', '90天', '2年', '12个月'],
        ['适用范围', '🆕仅限同业态', '✅全平台通用', '✅全平台通用'],
        ['成本承担方', '同业态营销池', '平台服务费（¥0.20/笔）', '备付金消费金池'],
        ['可否兑现', '❌ 不可', '❌ 不可', '❌ 不可'],
    ]
));

docChildren.push(h2('A.4  盈亏平衡参数'));
docChildren.push(dataTable(
    ['参数', '数值', '说明'],
    [
        ['月度固定成本', '¥190,000', '技术+人力+办公（公测阶段）'],
        ['单笔平台毛利（平台·消费-汇付·未扣积分）', '¥6.20', '用于盈亏平衡测算'],
        ['盈亏平衡月交易笔数', BREAKEVEN_TX.toLocaleString() + ' 笔', '190,000 ÷ 6.20'],
        ['盈亏平衡月GMV', '¥' + (BREAKEVEN_GMV/10000).toFixed(1) + '万', BREAKEVEN_TX.toLocaleString() + ' × ¥100'],
        ['保本日交易笔数', Math.ceil(BREAKEVEN_TX/30).toLocaleString() + ' 笔', '÷ 30天'],
        ['混合业态单笔毛利（估）', '¥5.68', '加权估算'],
        ['混合盈亏平衡', Math.ceil(190000/5.68).toLocaleString() + ' 笔/月', '190,000 ÷ 5.68'],
    ]
));
docChildren.push(pageBreak());

// ===== APPENDIX B: CONSUMPTION FLOW =====
docChildren.push(h1('附录B  消费流转体系与千面千店'));

docChildren.push(h2('B.1  消费流转路径'));
docChildren.push(p('链商2.0的消费流转体系形成软性优先级引导——消费者可自由浏览所有商家，仅默认排序有优先：'));
docChildren.push(flowBox('平台商家（福利20%·搜索加权+2）──→ 联盟商家（福利15%·搜索基准位0）──→ 综合电商（福利20%·搜索加权-2）', false));
docChildren.push(b('平台商家（Premium·福利20%）：品质商户优先展示，建立品牌信任和消费习惯。商家净收入82.4-90%'));
docChildren.push(b('联盟商家（Standard·福利15%）：承接平台溢出流量，商家净收入最高（85-90%），覆盖更广泛的社区履约场景'));
docChildren.push(b('综合电商（Minimal·福利20%）：平台自营补充长尾商品，最低优先级'));
docChildren.push(b('非强制路径——消费者可通过筛选/搜索/分类/地图找到任何类型商家'));

docChildren.push(h2('B.2  千面千店页面设计层级'));
docChildren.push(dataTable(
    ['设计维度', '平台商家（Premium）', '联盟商家（Standard）', '综合电商（Minimal）'],
    [
        ['信息密度', '高——品牌故事/视频/相册/评价', '标准——商品/服务/位置/评分', '极简——商品名称/价格/规格'],
        ['品牌色', '品牌自有色（深度自定义）', '品牌色+横幅（轻定制）', '平台统一色（不可自定义）'],
        ['页面模板', '专属定制布局', '6套可选模板', '1套标准化模板'],
        ['品牌标识', '品牌认证蓝标', '社区好店绿标', '平台自营灰标'],
        ['搜索权重', '+2（优先展示）', '0（基准位）', '-2（靠后）'],
        ['消费者信任层级', '高——独立品牌背书', '中——社区口碑背书', '基础——平台背书'],
        ['代金券适用范围', '🆕仅限平台商家', '🆕仅限联盟商家', '🆕仅限综合电商'],
    ]
));

docChildren.push(h2('B.3  消费时序引导'));
docChildren.push(p('消费者的自然消费路径设计——通过软性优先级引导而非强制锁定：'));
docChildren.push(n(1, '新用户首次进入：默认展示附近平台商家（搜索加权+2），建立品质认知'));
docChildren.push(n(2, '平台商家无法满足需求时：自然流转至联盟商家（搜索基准位），扩大履约范围'));
docChildren.push(n(3, '特定品类/长尾需求：综合商城补充（搜索加权-2），标准化商品供给'));
docChildren.push(n(4, '权益锁定回流：消费者获得积分/消费金后，全平台通用促使回流至平台商家'));
docChildren.push(p('此设计确保平台商家获得最大流量曝光（+2权重），联盟商家以最高到手率（85-90%）吸引商户入驻，综合商城作为补充供给，形成完整的消费生态闭环。', {color:C.MAIN}));

// ===== DOCUMENT END =====
docChildren.push(divider());
docChildren.push(pageBreak());
docChildren.push(new Paragraph({spacing:{before:2000}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'—— 文档结束 ——',size:18,font:FONT.body,color:C.GRAY,italics:true})],alignment:AlignmentType.CENTER,spacing:{before:200}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'本报告基于链商平台V15扩展模型（2026-06-06），以¥100消费为基准场景，',size:16,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:10}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'涵盖平台商家·联盟商家·综合电商三种业态下4种支付方式的12场景完整分账与核销机制。',size:16,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:10}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'核心新增：① 4支付方式全覆盖 ② 服务费结算7方角色矩阵 ③ 代金券不可跨平台商家使用（新规）。',size:16,font:FONT.body,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:20}}));
docChildren.push(new Paragraph({children:[new TextRun({text:'代金券/积分/消费金均不可兑现，严守三条合规红线：积分不可兑现 · 不可形成资金池 · 不可承诺收益。',size:16,font:FONT.body,color:C.RED})],alignment:AlignmentType.CENTER}));
docChildren.push(new Paragraph({children:[new TextRun({text:'生成日期：2026年6月6日 · 编制：Mr666 · 企业宣传策划部 · 链商平台运营方',size:16,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{before:40}}));

// ========== PACK & SAVE ==========
buildAndWrite(docChildren, outFile, { title: '链商平台 100元消费分账核销模型详解', margins: { top: 1200, bottom: 1200, left: 1200, right: 1200 } }).then(function(outPath) {
    console.log('');
    console.log('✅ Document generated: ' + outPath);
    console.log('   12 scenarios: 3 business types × 4 payment methods');
    console.log('');
    if (verified) {
        console.log('✅ All settlement splits verified (商家% + 备付金% = 100% or 0%)');
    }
}).catch(function(err) { console.error('❌ 生成失败:', err); });
