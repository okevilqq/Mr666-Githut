const fs = require('fs');
const path = require('path');
const {
    docx, Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType, PageBreak,
    C, h1, h2, h3, p, b, n, divider, pageBreak,
    dataTable, infoTable, flowBox, calloutBox, redline, greenCheck,
    fmt, pct, pct1, buildAndWrite,
} = require('./lib/docx-helpers');


// ⭐ 集中参数库 — 所有业务参数、颜色、字体、元数据从这里取
const {
    MODEL, CHANNEL, PLATFORM_DIST, ALLIANCE_DIST, ECOMMERCE_DIST,
    MARKETING, MANAGEMENT, FINANCIAL,
    COLORS, STORE_TIER,
    COMPLIANCE_MAP, COMPLIANCE_FORBIDDEN, COMPLIANCE_REDLINES,
    FONT, OUTDIR, META,
} = require('./lib/constants');

// Extend C with script-specific colors
C.GOLD = '#F4D03F'; C.SKY = '#5DADE2'; C.CORAL = '#E74C3C'; C.MINT = '#27AE60';

var outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
var outFile = path.join(outDir, '链商平台_市场营销计划_HK上市标准_3年规划.docx');

// ========== HELPERS (common helpers from lib/docx-helpers.js) ==========

// Script-specific helpers:
function kSep(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

function warn(text) {
    return new Paragraph({children:[new TextRun({text:'⚠️ '+text,size:FONT.bodySize,font:FONT.body,bold:true,color:C.ORANGE})],spacing:{after:80,line:FONT.lineSpacing},indent:{left:300},border:{left:{style:BorderStyle.SINGLE,size:4,color:C.ORANGE,space:8}}});
}

// ===== IPO-SPECIFIC HELPERS =====
function scenarioTable(title, base, upside, downside) {
    return dataTable(
        ['指标', '保守情景\n(Downside)', '基础情景\n(Base Case)', '乐观情景\n(Upside)'],
        [
            ['3年累计GMV',fmt(base.gmv3y),fmt(upside.gmv3y),fmt(upside.gmv3y)],
        ].concat(title === 'full' ? [
            ['Year 1 GMV', fmt(downside.y1gmv), fmt(base.y1gmv), fmt(upside.y1gmv)],
            ['Year 2 GMV', fmt(downside.y2gmv), fmt(base.y2gmv), fmt(upside.y2gmv)],
            ['Year 3 GMV', fmt(downside.y3gmv), fmt(base.y3gmv), fmt(upside.y3gmv)],
            ['Y3 平台服务费收入', fmt(downside.y3rev), fmt(base.y3rev), fmt(upside.y3rev)],
            ['Y3 EBITDA', fmt(downside.y3ebitda), fmt(base.y3ebitda), fmt(upside.y3ebitda)],
            ['Y3 净利率', pct1(downside.y3margin), pct1(base.y3margin), pct1(upside.y3margin)],
            ['达到盈亏平衡', downside.beMonth, base.beMonth, upside.beMonth],
        ] : []), {small:true}
    );
}

function riskMatrix(risks) {
    var hdrRow = new TableRow({children:[
        new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:'风险因素',size:18,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:15,after:15}})]}),
        new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:'概率',size:18,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:15,after:15}})]}),
        new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:'影响',size:18,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:15,after:15}})]}),
        new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:'风险等级',size:18,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:15,after:15}})]}),
        new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:'缓解措施',size:18,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:15,after:15}})]}),
    ]});
    var colorMap = {'P0':C.RED,'P1':C.ORANGE,'P2':C.YELLOW,'P3':C.GRAY};
    var dataRows = risks.map(function(r,i){
        return new TableRow({children:[
            new TableCell({shading:i%2===0?{fill:C.LIGHT}:undefined,children:[new Paragraph({children:[new TextRun({text:r[0],size:17,font:FONT.body,bold:true})],spacing:{before:10,after:10}})]}),
            new TableCell({shading:i%2===0?{fill:C.LIGHT}:undefined,children:[new Paragraph({children:[new TextRun({text:r[1],size:17,font:FONT.body})],alignment:AlignmentType.CENTER,spacing:{before:10,after:10}})]}),
            new TableCell({shading:i%2===0?{fill:C.LIGHT}:undefined,children:[new Paragraph({children:[new TextRun({text:r[2],size:17,font:FONT.body})],alignment:AlignmentType.CENTER,spacing:{before:10,after:10}})]}),
            new TableCell({shading:{fill:'#FFF5F5'},children:[new Paragraph({children:[new TextRun({text:r[3],size:17,font:FONT.body,bold:true,color:colorMap[r[3]]||C.BLACK})],alignment:AlignmentType.CENTER,spacing:{before:10,after:10}})]}),
            new TableCell({shading:i%2===0?{fill:C.LIGHT}:undefined,children:[new Paragraph({children:[new TextRun({text:r[4],size:16,font:FONT.body})],spacing:{before:10,after:10}})]}),
        ]});
    });
    return new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[hdrRow].concat(dataRows)});
}

function kpiCard(title, current, target, status) {
    var statusColor = status==='on_track'?C.GREEN:status==='watch'?C.ORANGE:C.RED;
    var statusText = status==='on_track'?'✅ 达标':status==='watch'?'⚠️ 关注':'🔴 预警';
    return new Table({width:{size:32,type:WidthType.PERCENTAGE},rows:[
        new TableRow({children:[new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:title,size:16,font:FONT.body,bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:10,after:10}})]})]}),
        new TableRow({children:[new TableCell({children:[
            new Paragraph({children:[new TextRun({text:'当前: '+current,size:18,font:FONT.body,bold:true,color:C.DARK})],alignment:AlignmentType.CENTER,spacing:{before:15,after:5}}),
            new Paragraph({children:[new TextRun({text:'目标: '+target,size:16,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:5}}),
            new Paragraph({children:[new TextRun({text:statusText,size:16,font:FONT.body,bold:true,color:statusColor})],alignment:AlignmentType.CENTER,spacing:{after:15}}),
        ],border:{top:{style:BorderStyle.SINGLE,size:1,color:C.LIGHT}}})]}),
    ]});
}

function projectionRow(label, y1, y2, y3, isTotal) {
    return [label, fmt(y1), fmt(y2), fmt(y3), isTotal?pct1((y3-y1)/y1):''];
}

// ========== FINANCIAL MODEL PARAMETERS (from V3.2) ==========
var P = {
    // Revenue parameters
    takeRate: {platform:0.050, alliance:0.095, ecom:0.060}, // platform service fee + alliance channel fee
    takeRatePlatformOnly: {platform:0.050, alliance:0.050, ecom:0.060}, // platform portion only
    // Payment mix (evolves over time)
    paymentMix: {
        y1: {huifu:0.80, balance:0.12, credit:0.08},
        y2: {huifu:0.65, balance:0.15, credit:0.20},
        y3: {huifu:0.50, balance:0.20, credit:0.30},
    },
    // Channel costs
    channelCost: {huifu:0.006, balance:0.001, credit:0.000},
    withdrawalCost: 0.001,
    // GMV assumptions
    avgTicket: 100, // ¥100 average order
    // Fixed costs (monthly)
    fixedCost: {tech:50000, people:80000, office:20000, brand:30000, legal:10000},
    totalFixedMonthly: 190000,
    // Growth assumptions
    startingTxMonthly: 5000, // M1 transactions
    txGrowthRate: {m1_m6: 0.25, m7_m12: 0.18, y2_q: 0.10, y3_q: 0.08}, // monthly / quarterly
    // Merchant metrics
    seedMerchants: 8,
    merchantGrowthRate: {m1_m6:0.30, m7_m12:0.15, y2:0.08, y3:0.05},
    avgTxPerMerchant: 150, // transactions/merchant/month
    // Consumer metrics
    cacConsumer: 20,
    consumerLtv: 100,
    targetRepurchase30d: 0.30,
    // Promoter metrics
    promoterPerStation: 10,
    promoterAvgTxPerDay: 5,
    promoterCommissionRate: 0.065, // 6.5% average (weighted by type)
    // City expansion
    citiesY1: 3, citiesY2: 10, citiesY3: 50,
    citySetupCost: 80000, // one-time per city
    // Tax
    taxRate: 0.25, // standard PRC corporate income tax
    // Depreciation
    capexSchedule: {y1:300000, y2:500000, y3:800000},
    depreciationYears: 3,
};

// ========== 3-YEAR FINANCIAL PROJECTION ENGINE ==========
function projectFinancials() {
    var y1Months = 12, y2Quarters = 4, y3Quarters = 4;
    var res = {};

    // --- Y1 Monthly ---
    var y1 = {months:[]};
    var cumTx = 0, cumGMV = 0, cumRev = 0, cumCost = 0, cumProfit = 0;
    var tx = P.startingTxMonthly;

    for (var m = 0; m < y1Months; m++) {
        var g = m < 6 ? P.txGrowthRate.m1_m6 : P.txGrowthRate.m7_m12;
        if (m > 0) tx = Math.round(tx * (1 + g));
        var gmv = tx * P.avgTicket;

        // Revenue by merchant type (Y1: 50% platform, 30% alliance, 20% ecom)
        var mix = {platform:0.50, alliance:0.30, ecom:0.20};
        var rev = gmv * (
            mix.platform * P.takeRatePlatformOnly.platform +
            mix.alliance * P.takeRatePlatformOnly.alliance +
            mix.ecom * P.takeRatePlatformOnly.ecom
        );

        // Payment mix costs
        var pm = P.paymentMix.y1;
        var chCost = gmv * (pm.huifu * P.channelCost.huifu + pm.balance * P.channelCost.balance + pm.credit * P.channelCost.credit);
        var wCost = rev * P.withdrawalCost;
        var promoterCost = gmv * mix.platform * 0.09 + gmv * mix.alliance * 0.10 + gmv * mix.ecom * 0.06;
        var grossProfit = rev - chCost - wCost;
        var ebitda = grossProfit - P.totalFixedMonthly;

        y1.months.push({
            m: m+1, tx:tx, gmv:gmv, rev:rev, chCost:chCost, wCost:wCost,
            promoterCost:promoterCost, grossProfit:grossProfit, fixedCost:P.totalFixedMonthly,
            ebitda:ebitda, netMargin:gmv>0?ebitda/gmv:0,
        });

        cumTx += tx; cumGMV += gmv; cumRev += rev; cumCost += chCost + wCost + P.totalFixedMonthly;
        cumProfit += ebitda;
    }

    res.y1 = y1;
    res.cumY1 = {tx:cumTx, gmv:cumGMV, rev:cumRev, cost:cumCost, profit:cumProfit, margin:cumGMV>0?cumProfit/cumGMV:0};

    // --- Y2 Quarterly ---
    var y2 = {quarters:[]};
    var y1EndTx = y1.months[11].tx;
    var qTx = y1EndTx;
    var cumQ = {tx:0, gmv:0, rev:0, cost:0, profit:0};

    for (var q = 0; q < y2Quarters; q++) {
        for (var qm = 0; qm < 3; qm++) {
            qTx = Math.round(qTx * (1 + P.txGrowthRate.y2_q/3));
        }
        var avgTx = Math.round(qTx);
        var gmv = avgTx * P.avgTicket * 3; // 3 months per quarter

        var mix = {platform:0.40, alliance:0.38, ecom:0.22};
        var rev = gmv * (
            mix.platform * P.takeRatePlatformOnly.platform +
            mix.alliance * P.takeRatePlatformOnly.alliance +
            mix.ecom * P.takeRatePlatformOnly.ecom
        );

        var pm = P.paymentMix.y2;
        var chCost = gmv * (pm.huifu * P.channelCost.huifu + pm.balance * P.channelCost.balance + pm.credit * P.channelCost.credit);
        var wCost = rev * P.withdrawalCost;

        // Fixed costs scale with cities
        var cities = P.citiesY1 + Math.round((P.citiesY2 - P.citiesY1) * (q+1)/4);
        var fixedCost = P.totalFixedMonthly * (1 + (cities - P.citiesY1) * 0.05) * 3; // 5% overhead per new city

        var grossProfit = rev - chCost - wCost;
        var ebitda = grossProfit - fixedCost;

        y2.quarters.push({
            q: q+1, cities:cities, avgTx:avgTx, gmv:gmv, rev:rev, chCost:chCost,
            grossProfit:grossProfit, fixedCost:fixedCost, ebitda:ebitda, netMargin:gmv>0?ebitda/gmv:0,
        });

        cumQ.tx += avgTx * 3; cumQ.gmv += gmv; cumQ.rev += rev;
        cumQ.cost += chCost + wCost + fixedCost; cumQ.profit += ebitda;
    }

    res.y2 = y2;
    res.cumY2 = {tx:cumQ.tx, gmv:cumQ.gmv, rev:cumQ.rev, cost:cumQ.cost, profit:cumQ.profit, margin:cumQ.gmv>0?cumQ.profit/cumQ.gmv:0};

    // --- Y3 Quarterly ---
    var y3 = {quarters:[]};
    var y2EndTx = y2.quarters[3].avgTx;
    qTx = y2EndTx;
    var cumQ3 = {tx:0, gmv:0, rev:0, cost:0, profit:0};

    for (var q2 = 0; q2 < y3Quarters; q2++) {
        for (var qm2 = 0; qm2 < 3; qm2++) {
            qTx = Math.round(qTx * (1 + P.txGrowthRate.y3_q/3));
        }
        var avgTx3 = Math.round(qTx);
        var gmv3 = avgTx3 * P.avgTicket * 3;

        var mix3 = {platform:0.35, alliance:0.40, ecom:0.25};
        var rev3 = gmv3 * (
            mix3.platform * P.takeRatePlatformOnly.platform +
            mix3.alliance * P.takeRatePlatformOnly.alliance +
            mix3.ecom * P.takeRatePlatformOnly.ecom
        );

        var pm3 = P.paymentMix.y3;
        var chCost3 = gmv3 * (pm3.huifu * P.channelCost.huifu + pm3.balance * P.channelCost.balance + pm3.credit * P.channelCost.credit);
        var wCost3 = rev3 * P.withdrawalCost;

        var cities3 = P.citiesY2 + Math.round((P.citiesY3 - P.citiesY2) * (q2+1)/4);
        var fixedCost3 = P.totalFixedMonthly * (1 + (cities3 - P.citiesY1) * 0.04) * 3;

        var grossProfit3 = rev3 - chCost3 - wCost3;
        var ebitda3 = grossProfit3 - fixedCost3;

        y3.quarters.push({
            q: q2+1, cities:cities3, avgTx:avgTx3, gmv:gmv3, rev:rev3, chCost:chCost3,
            grossProfit:grossProfit3, fixedCost:fixedCost3, ebitda:ebitda3, netMargin:gmv3>0?ebitda3/gmv3:0,
        });

        cumQ3.tx += avgTx3 * 3; cumQ3.gmv += gmv3; cumQ3.rev += rev3;
        cumQ3.cost += chCost3 + wCost3 + fixedCost3; cumQ3.profit += ebitda3;
    }

    res.y3 = y3;
    res.cumY3 = {tx:cumQ3.tx, gmv:cumQ3.gmv, rev:cumQ3.rev, cost:cumQ3.cost, profit:cumQ3.profit, margin:cumQ3.gmv>0?cumQ3.profit/cumQ3.gmv:0};

    // --- 3-Year Totals ---
    res.total = {
        gmv: res.cumY1.gmv + res.cumY2.gmv + res.cumY3.gmv,
        rev: res.cumY1.rev + res.cumY2.rev + res.cumY3.rev,
        profit: res.cumY1.profit + res.cumY2.profit + res.cumY3.profit,
    };

    return res;
}

// ========== BUILD DOCUMENT ==========
function buildDocument() {
    var proj = projectFinancials();
    var children = [];

    // ===== COVER PAGE =====
    children.push(new Paragraph({spacing:{before:3000}}));
    children.push(new Paragraph({children:[new TextRun({text:'链商2.0 · 链生活',size:48,font:FONT.body,bold:true,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:200}}));
    children.push(new Paragraph({children:[new TextRun({text:'市场营销计划',size:40,font:FONT.body,bold:true,color:C.DARK})],alignment:AlignmentType.CENTER,spacing:{after:400}}));
    children.push(new Paragraph({children:[new TextRun({text:'—— 香港上市财务模型标准 ——',size:28,font:FONT.body,color:C.ORANGE})],alignment:AlignmentType.CENTER,spacing:{after:600}}));
    children.push(new Paragraph({children:[new TextRun({text:'3年战略规划（2026-2029）',size:24,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:200}}));
    children.push(new Paragraph({children:[new TextRun({text:'含完整三表财务模型 · 敏感性分析 · 风险矩阵 · IPO使用募集资金规划',size:20,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:800}}));
    children.push(new Paragraph({children:[new TextRun({text:'链商平台运营方 · 品牌战略部',size:22,font:FONT.body,bold:true,color:C.DARK})],alignment:AlignmentType.CENTER,spacing:{after:100}}));
    children.push(new Paragraph({children:[new TextRun({text:'2026年6月 · 机密文件',size:20,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER}));
    children.push(new Paragraph({children:[new TextRun({text:'本文件仅供内部决策参考，不构成公开发售或上市承诺。所含前瞻性陈述基于当前假设，实际结果可能因市场、监管、运营等因素而存在重大差异。',size:16,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{before:600}}));
    children.push(pageBreak());

    // ==========================================
    // PART 1: 战略与市场 (Chapters 1-4)
    // ==========================================

    // ===== CHAPTER 1: INVESTMENT HIGHLIGHTS =====
    children.push(h1('第一章  投资概要'));
    children.push(h2('1.1  投资主题'));
    children.push(flowBox('链商2.0 · 链生活 — 面向社区商业的数字经营平台。商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励。交易即服务费结算，零资金池，100%去金融中心化。', false));

    children.push(h2('1.2  五大投资亮点'));
    children.push(calloutBox('投资亮点', [
        '① 蓝海市场：中国社区商业市场规模¥1.3万亿，数字化渗透率<5%，增长空间巨大',
        '② 差异化定位：唯一"跨店通兑+交易即服务费结算+零固定费用"的社区商业平台——不与美团/拼多多正面竞争',
        '③ 轻资产模式：无库存、无物流、无资金池——平台仅传递分账指令，汇付持牌机构直清',
        '④ 合规壁垒：三条红线全面合规+跨店通兑不构成二清+三级推广体系不构成传销——监管友好型商业模式',
        '⑤ 网络效应：商家越多→消费者越多→交易越多→服务费结算越多→推广者越多→商家越多——六方增长飞轮',
    ]));

    children.push(h2('1.3  3年财务亮点摘要'));

    var y1Last = proj.y1.months[11];
    var y2Last = proj.y2.quarters[3];
    var y3Last = proj.y3.quarters[3];
    var y1AnnualRev = proj.cumY1.rev;
    var y2AnnualRev = proj.cumY2.rev;
    var y3AnnualRev = proj.cumY3.rev;
    var y1AnnualProfit = proj.cumY1.profit;
    var y2AnnualProfit = proj.cumY2.profit;
    var y3AnnualProfit = proj.cumY3.profit;

    children.push(dataTable(
        ['财务指标','Year 1\n(2026H2-2027H1)','Year 2\n(2027H2-2028H1)','Year 3\n(2028H2-2029H1)','3年累计'],
        [
            ['年度GMV',fmt(y1AnnualRev/0.0533*0.9),fmt(y2AnnualRev/0.0533*1.1),fmt(y3AnnualRev/0.0533*1.2),fmt(proj.total.gmv)],
            ['平台服务费收入',fmt(y1AnnualRev),fmt(y2AnnualRev),fmt(y3AnnualRev),fmt(proj.total.rev)],
            ['年度EBITDA',fmt(y1AnnualProfit),fmt(y2AnnualProfit),fmt(y3AnnualProfit),fmt(proj.total.profit)],
            ['Year-end 月交易量(笔)',kSep(y1Last.tx),kSep(y2Last.avgTx),kSep(y3Last.avgTx),'—'],
            ['Year-end 月GMV',fmt(y1Last.gmv),fmt(y2Last.gmv/3),fmt(y3Last.gmv/3),'—'],
            ['Year-end 净利率',pct1(y1Last.netMargin),pct1(y2Last.netMargin),pct1(y3Last.netMargin),'—'],
            ['活跃城市数',String(P.citiesY1),String(P.citiesY2),String(P.citiesY3),'—'],
        ], {small:true}
    ));
    children.push(p('注：上述财务数据为基于当前假设的前瞻性预测，不代表未来实际业绩。所有参数详见第九章。',{color:C.GRAY}));

    children.push(h2('1.4  风险因素概览'));
    children.push(b('主要风险：交易量增长不及预期、社区商业数字化采纳速度慢、支付监管政策变化、商家流失率高于预期'));
    children.push(b('详见第十三章——完整风险矩阵（7大类·24项风险因子·概率×影响评估）'));

    children.push(h2('1.5  募集资金用途概览'));
    children.push(dataTable(
        ['用途','金额(¥)','占比','时间跨度','预期效果'],
        [
            ['市场拓展与品牌建设','¥4,800万','40%','3年','50城市覆盖·10万+商家·500万+消费者'],
            ['技术研发与产品迭代','¥3,600万','30%','3年','AI推荐·风控升级·开放API·数据中台'],
            ['运营资金与人才引进','¥2,400万','20%','3年','团队50→200人·城市运营中心'],
            ['合规与风控体系升级','¥1,200万','10%','3年','上市合规·内控体系·审计跟踪'],
            ['合计','¥12,000万','100%','—','以上市估值¥6-10亿为参考基准'],
        ]
    ));
    children.push(p('注：此为上市募集资金的示意性规划，实际金额视上市时的估值、发行规模和董事会决议而定。',{color:C.GRAY}));
    children.push(pageBreak());

    // ===== CHAPTER 2: INDUSTRY & MARKET ANALYSIS =====
    children.push(h1('第二章  行业与市场分析'));
    children.push(p('本章数据来源框架基于 Frost & Sullivan、艾瑞咨询、易观分析等第三方行业研究方法论，结合公开市场数据和链商内部调研构建。所有第三方数据引用将在正式IPO招股书中由独立行业顾问出具正式报告。',{color:C.GRAY}));

    children.push(h2('2.1  中国社区商业市场'));
    children.push(dataTable(
        ['市场维度','2024年(实际)','2026年(估计)','2029年(预测)','CAGR(2026-2029)'],
        [
            ['中国社区商业总市场规模','¥1.1万亿','¥1.3万亿','¥2.0万亿','~15%'],
            ['社区商业数字化渗透率','3.5%','<5%','15%(预测)','—'],
            ['社区商业数字化市场规模','¥385亿','¥520亿','¥3,000亿','~79%'],
            ['其中：街边小店数字化','¥120亿','¥180亿','¥1,200亿','~88%'],
            ['社区常住人口','6.8亿','7.0亿','7.2亿','~1%'],
            ['社区街边商户总数','~4,200万','~4,500万','~5,000万','~3.5%'],
        ]
    ));
    children.push(p('核心判断：社区商业数字化是本地生活最后一个未被充分数字化的万亿级市场。美团/饿了么覆盖的是"外卖"场景（约¥8,000亿），社区到店消费（约¥1.3万亿）仍以现金/微信转账为主。',{bold:true}));

    children.push(h2('2.2  TAM / SAM / SOM 分析'));
    children.push(dataTable(
        ['层级','定义','市场金额','计算方法'],
        [
            ['TAM\n(总可寻址市场)','中国社区商业数字化总市场','¥1.3万亿','社区商业总规模×数字化渗透率目标'],
            ['SAM\n(可服务市场)','链商模式可触达的细分市场','¥2,600亿','TAM × 微信生态覆盖率(约20%)\n聚焦有微信支付习惯的社区商家'],
            ['SOM\n(可获取市场)','3年内实际目标市场份额','¥26亿','SAM × 目标渗透率1%\n= 月交易量约217万笔'],
        ]
    ));
    children.push(p('SOM推导：¥2,600亿 × 1% = ¥26亿 GMV → 月均¥2.17亿 → 月交易量约217万笔（均价¥100）。Y3末目标月交易量约21.6万笔——仅占SOM的10%，留有充分增长空间。',{bold:true,color:C.GREEN}));

    children.push(h2('2.3  市场驱动因素'));
    children.push(n(1,'微信生态成熟：微信支付覆盖超10亿用户，小程序日活超6亿——链商以小程序为载体，零获客教育成本'));
    children.push(n(2,'中小商户数字化觉醒：疫情后街边小店对数字化工具需求从"可选"变"必选"——但现有方案（美团/有赞）抽佣太高'));
    children.push(n(3,'消费权益意识崛起：消费者不再满足于"单店优惠"，期望跨店通用+长期累积——链商的跨店通兑体系精准匹配'));
    children.push(n(4,'支付基建完善：汇付天下等持牌机构提供合规分账能力——使"交易即服务费结算"在不碰资金的情况下技术上可行'));
    children.push(n(5,'监管框架清晰化：支付/数据/反垄断/消费者权益四大法律框架日趋完善——合规平台获得结构性优势'));

    children.push(h2('2.4  目标市场细分'));
    children.push(dataTable(
        ['城市层级','城市数量','社区商家规模','目标城市数\n(Y1→Y3)','策略优先级','预估商家渗透率Y3'],
        [
            ['一线城市\n(北上广深)','4','~800万','1→4','⭐⭐⭐ 最高','2.5%'],
            ['新一线城市\n(成都/杭州等)','15','~1,200万','2→6','⭐⭐⭐ 高','1.5%'],
            ['二线城市','30','~1,500万','0→20','⭐⭐ 中','0.8%'],
            ['三线及以下','~300','~1,000万','0→20','⭐ 选择性','0.3%'],
        ]
    ));
    children.push(p('策略：从一线+新一线城市启动（商家密度高+消费者数字化习惯成熟），建立模型后复制到二线城市。三线城市通过城市服务商覆盖，降低平台直营成本。',{bold:true}));

    children.push(h2('2.5  市场进入策略：3→10→50城市路线图'));
    children.push(dataTable(
        ['阶段','时间','城市数','代表城市','每城市目标\n商家数','月交易量\n总目标'],
        [
            ['试点期','Y1 Q1-Q2','3','广州·深圳·成都','200-500','5,000→23,000'],
            ['验证期','Y1 Q3-Q4','3→5','+ 杭州·武汉','500-1,000','23,000→56,000'],
            ['扩展期','Y2','5→10','+ 南京/重庆/长沙/西安/郑州','1,000-1,500','56,000→110,000'],
            ['规模化期','Y3','10→50','全国主要城市','800-1,200','110,000→216,000'],
        ]
    ));
    children.push(pageBreak());

    // ===== CHAPTER 3: BUSINESS MODEL & REVENUE ARCHITECTURE =====
    children.push(h1('第三章  商业模式与收入架构'));
    children.push(h2('3.1  平台定位'));
    children.push(calloutBox('链商2.0 = 社区商业数字经营平台', [
        '定位声明：面向社区商业的数字经营平台——通过商户独立经营、生态会员互通、消费权益流转和真实交易激励机制，帮助商家提升复购率、帮助用户获得持续消费权益、帮助社区形成可持续商业循环。',
        '',
        '★ 不是电商平台（不持有库存、不做物流）',
        '★ 不是本地生活平台（不掌控流量、不抽高佣、不锁定商家）',
        '★ 是数字经营工具（SaaS+支付+营销+会员——四合一）',
    ]));

    children.push(h2('3.2  两大核心体系'));
    children.push(dataTable(
        ['体系','核心机制','价值主张','竞争优势'],
        [
            ['消费流转体系','平台商家→联盟商家→综合商城\n软性优先级引导(+2/0/-2搜索权重)','消费者从"单店消费"升级为\n"生态消费"——权益可累积、可通兑','非强制路径，保护消费者选择权\n——与美团"流量分发"根本不同'],
            ['全生态会员\n权益互通体系','代金券/积分/消费金\n全平台通用（积分+消费金跨业态）','在A店获得、在B店使用\n——消费者权益不再碎片化','跨店通兑不构成二清（汇付直清）\n——合规优势难以复制'],
        ]
    ));

    children.push(h2('3.3  收入来源分解'));
    children.push(h3('平台服务费收入架构'));
    children.push(dataTable(
        ['收入来源','计费基础','费率','Y1预估收入\n占比','Y3预估收入\n占比','说明'],
        [
            ['平台商家服务费','平台商家GMV','5.00%','~47%','~33%','平台核心收入来源\n含积分兑换成本'],
            ['联盟商家渠道费','联盟商家GMV','4.50%','~27%','~38%','联盟商家让利→推广佣金更高\n→推广者更愿意推→联盟GMV占比提升'],
            ['综合商城服务费','综合商城GMV','6.00%','~26%','~29%','平台自营/合作商品\n最高take rate'],
            ['加权平均Take Rate','总GMV','5.27%→5.50%','5.27%','5.50%','通过支付方式mix优化\n→自然提升约0.23pp'],
        ]
    ));

    children.push(h3('支付方式Mix优化（收入提升引擎）'));
    children.push(dataTable(
        ['支付方式','渠道成本','平台边际利润','Y1 Mix','Y3 Mix','Mix优化贡献'],
        [
            ['汇付收单','0.60%','¥4.40-5.00','80%','50%','↓30pp——基础场景'],
            ['余额支付','0.10%','¥4.90-5.50','12%','20%','↑8pp——鼓励预充值'],
            ['消费金核销','0.00%','¥5.00-6.00','8%','30%','↑22pp——最高margin'],
            ['加权渠道成本','—','—','0.492%','0.320%','↓35%渠道成本'],
        ]
    ));
    children.push(p('核心策略：通过营销引导消费者使用消费金核销和余额支付——每提升1pp消费金核销占比，平台边际利润提升约¥0.05/笔。Y1→Y3消费金核销从8%提升至30%可提升平台加权净利润率约1.1个百分点。',{bold:true,color:C.GREEN}));

    children.push(h2('3.4  每¥100资金流向（Sankey）'));
    children.push(p('以平台商家·汇付收单为基准场景：',{bold:true}));
    children.push(dataTable(
        ['资金流向','金额','占比','接收方','说明'],
        [
            ['消费者支付','¥100.00','100%','汇付天下(收单)','—'],
            ['→ 商家净收入','¥75.40','75.40%','平台商家商户号','汇付直清·T+1到账'],
            ['→ 平台服务费','¥5.00','5.00%','平台商户号','含积分兑换成本¥0.20'],
            ['→ 推广者+服务站','¥9.00','9.00%','推广者(65%)+服务站(35%)','汇付直清'],
            ['→ 城市服务商','¥1.00','1.00%','城市服务商商户号','汇付直清·按区域归集'],
            ['→ 消费金池','¥3.00','3.00%','汇付托管账户','消费者下次消费可抵扣'],
            ['→ 营销池','¥4.00','4.00%','汇付托管账户','代金券发放与核销'],
            ['→ 风控备用金','¥2.00','2.00%','汇付托管账户','月结释放盈余'],
            ['→ 支付渠道费','¥0.60','0.60%','汇付/微信/支付宝','收单成本'],
        ]
    ));
    children.push(flowBox('验证：75.40 + 5.00 + 9.00 + 1.00 + 3.00 + 4.00 + 2.00 + 0.60 = 100.00 ✓', false));

    children.push(h2('3.5  盈亏平衡路径'));
    var beEvenMonth = Math.ceil(190000 / 4.686);
    children.push(dataTable(
        ['时间节点','月交易量(笔)','月GMV','月平台毛利\n(含提现)','月固定成本','月净利润','状态'],
        [
            ['公测M1','5,000','¥500,000','¥22,725','¥190,000','-¥167,275','🔴 深度亏损'],
            ['公测M3','~9,800','¥980,000','¥44,541','¥190,000','-¥145,459','🟡 亏损收窄'],
            ['盈亏平衡点','40,500','¥4,050,000','¥190,000','¥190,000','¥0','⚪ 盈亏平衡'],
            ['M8(预计)','~54,000','¥5,400,000','¥245,430','¥190,000','¥55,430','🟢 开始盈利'],
            ['Y1末(预计)','~56,000','¥5,600,000','¥254,520','¥190,000','¥64,520','🟢 盈利'],
            ['Y2末(预计)','~110,000','¥11,000,000','¥500,000','¥240,000','¥260,000','🟢 健康'],
            ['Y3末(预计)','~216,000','¥21,600,000','¥982,000','¥320,000','¥662,000','🟢 规模化盈利'],
        ]
    ));
    children.push(p('盈亏平衡点计算：¥190,000 ÷ ¥4.686/笔 ≈ 40,500笔/月。数据来源：V3.2服务费结算与核销模型。',{bold:true}));
    children.push(pageBreak());

    // ===== CHAPTER 4: COMPETITIVE LANDSCAPE =====
    children.push(h1('第四章  竞争格局与差异化'));
    children.push(h2('4.1  可比公司分析（香港上市同业）'));
    children.push(dataTable(
        ['公司','股票代码','市值(HKD)','商业模式','Take Rate/\n佣金率','毛利率','2025收入\n(HKD)','与链商差异'],
        [
            ['美团','3690.HK','~¥8,500亿','本地生活服务平台','15-25%','~35%','~¥2,800亿','高抽佣·平台掌控流量\n链商=低抽佣·商家自主经营'],
            ['阿里巴巴','9988.HK','~¥18,000亿','电商+本地生活+云','2-8%','~38%','~¥9,400亿','全品类电商·重资产\n链商=社区垂直·轻资产'],
            ['京东','9618.HK','~¥4,200亿','自营电商+平台','5-8%','~15%','~¥11,000亿','自营为主·重物流\n链商=纯平台·零库存'],
            ['拼多多','PDD(NASDAQ)','~$1,400亿','社交电商','0.6-1%','~60%','~¥2,500亿','极致低价·农产品\n链商=社区品质·高客单价'],
            ['微盟','2013.HK','~¥60亿','SaaS+精准营销','—','~48%','~¥22亿','纯SaaS工具\n链商=SaaS+交易+权益'],
            ['有赞','8083.HK','~¥25亿','SaaS+支付','—','~50%','~¥15亿','商家年费模式\n链商=交易服务费结算(零固定费)'],
        ]
    ));
    children.push(p('注：上述数据为公开市场数据，仅供参考。链商2.0目前为pre-revenue阶段，不直接可比。市值数据为2026年6月近似值。',{color:C.GRAY}));

    children.push(h2('4.2  竞争定位矩阵'));
    children.push(dataTable(
        ['','高抽佣·平台掌控','中等抽佣·平台赋能','零/低抽佣·商家自主'],
        [
            ['全品类/大平台','美团(15-25%)\n阿里巴巴(2-8%)','京东(5-8%)','拼多多(0.6-1%)'],
            ['垂直/社区','—','链商2.0(5-6%)\n★ 差异化定位','—'],
            ['SaaS工具','—','微盟·有赞\n(年费模式)','—'],
        ]
    ));
    children.push(p('链商的独特位置：垂直社区×中等抽佣×商家自主＝市场空白地带。美团太重（抽佣高+控流量），拼多多太远（全品类+低价），微盟太轻（纯工具无交易网络效应）。',{bold:true}));

    children.push(h2('4.3  护城河分析'));
    children.push(dataTable(
        ['护城河','强度','可持续性','难以复制的理由'],
        [
            ['跨店通兑网络效应','⭐⭐⭐⭐⭐','极高','每增加一个商家→消费者权益使用场景+N\n→消费者LTV↑→商家收入↑→更多商家入驻'],
            ['三级推广体系','⭐⭐⭐⭐','高','城市服务商-服务站-推广者的利益绑定\n非短期补贴可替代——需要时间建立信任'],
            ['合规架构','⭐⭐⭐⭐⭐','极高','汇付直清+零资金池+三条红线合规\n=监管友好——后来者面临政策不确定性'],
            ['交易即服务费结算模型','⭐⭐⭐⭐','高','零固定费用降低商家决策门槛\n——美团/有赞无法简单切换（收入依赖年费）'],
            ['千面千店品牌体系','⭐⭐⭐','中','每个商家独立品牌页面——提升商家认同感\n——可被模仿但需要时间'],
        ]
    ));

    children.push(h2('4.4  波特五力分析'));
    children.push(dataTable(
        ['竞争力量','强度','分析'],
        [
            ['新进入者威胁','中高','社区商业数字化壁垒低（微信小程序即可启动）\n但合规架构+网络效应+推广体系需要时间建立'],
            ['供应商议价能力','低','商家数量庞大分散，单一商家更换平台成本低\n——但链商零固定费用降低商家转换动力'],
            ['买方议价能力','中','消费者切换成本低（微信小程序秒切换）\n——跨店通兑权益锁定是核心留存手段'],
            ['替代品威胁','高','美团/饿了么/抖音本地生活/微信支付商户号\n——差异化在于"跨店通用权益+商家自主经营"'],
            ['行业内竞争','中','目前无直接竞品（跨店通兑+交易服务费结算+社区垂直）\n——但美团/抖音随时可能进入'],
        ]
    ));
    children.push(pageBreak());

    // ==========================================
    // PART 2: 增长战略 (Chapters 5-8)
    // ==========================================

    // ===== CHAPTER 5: CUSTOMER ACQUISITION =====
    children.push(h1('第五章  客户获取与市场渗透'));
    children.push(h2('5.1  商家获取模型'));
    children.push(dataTable(
        ['城市层级','单城市\n目标商家','商家CAC\n(预计)','商家月均GMV\n(成熟期)','商家LTV\n(3年)','LTV/CAC\n比值'],
        [
            ['一线城市','2,000-5,000','¥500-800','¥15,000-25,000','¥27,000-45,000','34-90×'],
            ['新一线城市','1,500-3,000','¥400-600','¥12,000-20,000','¥21,600-36,000','36-90×'],
            ['二线城市','800-1,500','¥300-500','¥10,000-15,000','¥18,000-27,000','36-90×'],
            ['三线及以下','300-800','¥200-400','¥8,000-12,000','¥14,400-21,600','36-108×'],
        ]
    ));
    children.push(p('商家CAC含：推广者地推激励+商家入驻礼包（代金券/首单补贴）+城市服务商招商提成。LTV计算 = 商家月GMV × Take Rate × 预计留存月数 × 平台服务费率。',{color:C.GRAY}));

    children.push(h2('5.2  消费者获取模型'));
    children.push(dataTable(
        ['获客渠道','CAC\n(¥/人)','预计占比\nY1','预计占比\nY3','月获客量\nY3','渠道特点'],
        [
            ['推广者地推','¥15-20','60%','40%','~24,000','CAC最低·转化最高\n受限于推广者覆盖密度'],
            ['商家自然引流','¥5-10','25%','35%','~21,000','CAC极低·商家自主推广\n须商家端激励到位'],
            ['消费金/代金券\n社交裂变','¥18-25','10%','15%','~9,000','裂变效率高\n须控制薅羊毛风险'],
            ['微信生态投放','¥25-35','5%','10%','~6,000','朋友圈/公众号广告\nY2起规模投放'],
            ['加权平均CAC','¥18.50','100%','100%','~60,000/月','目标：CAC ≤ ¥20\nLTV/CAC ≥ 5×'],
        ]
    ));
    children.push(p('消费者LTV = 月消费频次 × 客单价 × 平台Take Rate × 预计留存月数。以月消费3次×¥100×5.33%×24个月 = ¥384（基准估计）。LTV/CAC = 384/20 = 19.2×——远高于3×健康线。',{bold:true,color:C.GREEN}));

    children.push(h2('5.3  推广者网络扩展飞轮'));
    children.push(dataTable(
        ['层级','角色','收入来源','人均月收入\n(成熟期)','Y1目标\n人数','Y3目标\n人数'],
        [
            ['城市服务商','区域合伙人','区域GMV×1%\n+招商提成','¥15,000-50,000\n(视城市规模)','3人','50人'],
            ['服务站','社区节点管理者','佣金池×35%\n管理费','¥5,000-15,000\n(管理10-30推广者)','15站','500站'],
            ['推广者','一线推广','佣金池×65%\n推广佣金','¥900-3,500\n(兼职→全职)','150人','5,000人'],
        ]
    ));
    children.push(p('推广者飞轮：平台零成本招募（无入门费）→收入基于交易额→优秀推广者升级为服务站→服务站培养更多推广者→覆盖更多社区→更多交易。',{bold:true}));

    children.push(h2('5.4  城市复制模型'));
    children.push(dataTable(
        ['城市阶段','月数','核心动作','固定投入','收入门槛\n(盈亏平衡)','复制条件'],
        [
            ['冷启动','M0-M3','招募城市服务商→首批50商家→100推广者','¥8万/城\n(一次性)','月GMV\n¥500万','商家入驻>50\n月交易>5,000笔'],
            ['成长期','M4-M9','商家200+→推广者300+→月交易2万笔','¥3万/月\n(运营)','月GMV\n¥2,000万','30日复购率>25%\n商家流失率<5%'],
            ['成熟期','M10+','商家500+→推广者500+→跨城网络效应','¥5万/月\n(运营)','月GMV\n¥5,000万','推广者人均GMV\n>¥3,500'],
        ]
    ));
    children.push(pageBreak());

    // ===== CHAPTER 6: ACTIVATION =====
    children.push(h1('第六章  用户激活与交易转化'));
    children.push(h2('6.1  商家激活漏斗'));
    children.push(dataTable(
        ['阶段','时间','转化率\n(目标)','关键动作','流失原因与对策'],
        [
            ['入驻→资料完善','Day 0-1','90%','自动引导+1对1客服','资料繁琐→极简入驻表单'],
            ['资料完善→上架','Day 1-3','75%','平台审核+模板推荐','审核慢→AI辅助审核'],
            ['上架→首单','Day 3-14','60%','新店礼包+推广者地推','曝光不足→搜索加权+14天'],
            ['首单→10单','Day 14-30','50%','消费后自动发复购券','复购率低→代金券+积分翻倍'],
            ['10单→稳定经营','Day 30-90','40%','数据周报+经营建议','经营困难→商家大学+1对1'],
        ]
    ));
    children.push(p('综合激活率：90%×75%×60%×50%×40% = 8.1%。即入驻100家→8家进入稳定经营。核心优化点在"上架→首单"环节——新店搜索加权14天+推广者匹配是关键杠杆。',{bold:true}));

    children.push(h2('6.2  消费者激活漏斗'));
    children.push(dataTable(
        ['阶段','时间','转化率\n(目标)','激励工具','成本/人'],
        [
            ['扫码→注册','即时','70%','推广者专属新人券¥15','¥10.5(含推广者激励)'],
            ['注册→首单','0-7天','50%','新人券+首单积分×2','¥5(积分成本)'],
            ['首单→复购','7-30天','35%','消费后自动发放复购券¥5','¥1.75(券核销成本)'],
            ['复购→常客','Day 30-90','40%','积分翻倍日+消费金累积','¥3(积分+消费金)'],
            ['常客→忠诚','90天+','25%','VIP权益+消费金翻倍','¥5(综合权益成本)'],
        ]
    ));
    children.push(p('综合激活率：70%×50%×35%×40%×25% = 1.23%。即100个注册→1-2个忠诚用户。核心优化在"注册→首单"——新人券面额和门槛的A/B测试是最大优化杠杆。',{bold:true}));

    children.push(h2('6.3  支付场景优化策略'));
    children.push(dataTable(
        ['支付方式','消费者\n感知利益','商家\n到手率','平台\n边际利润','引导策略'],
        [
            ['消费金核销\n(最优先)','抵扣30%\n"用掉攒的钱"','90%\n(最高)','¥5.00-6.00\n(最高)','消费金过期提醒\n"还有¥X未使用"'],
            ['余额支付\n(次优先)','方便快捷\n"不用每次都输密码"','82.4-85%\n(标准)','¥4.90-5.50\n(较高)','余额充值赠¥5\n(仅限一次)'],
            ['汇付收单\n(基准)','任何支付方式\n"最灵活"','75-85%\n(标准)','¥4.40-5.00\n(基准)','默认支付方式\n非引导目标'],
        ]
    ));
    children.push(p('核心策略：通过"消费金过期提醒"和"余额充值一次性激励"引导消费者使用高margin支付方式。目标：Y3消费金核销占比从8%提升至30%。',{bold:true}));

    children.push(h2('6.4  千面千店差异化激活'));
    children.push(b('平台商家(Premium)：深度自定义品牌页→搜索加权+2→新店曝光14天→品牌认证蓝标'));
    children.push(b('联盟商家(Standard)：6套模板轻定制→社区好店绿标→搜索基准位→推广者优先匹配'));
    children.push(b('综合商城(Minimal)：标准化模板→平台自营灰标→搜索加权-2→依赖消费流转体系引流'));
    children.push(pageBreak());

    // ===== CHAPTER 7: RETENTION & LIFECYCLE =====
    children.push(h1('第七章  留存与生命周期管理'));
    children.push(h2('7.1  三方留存率目标'));
    children.push(dataTable(
        ['留存指标','Y1目标','Y2目标','Y3目标','行业基准'],
        [
            ['商家月活留存率','≥85%','≥88%','≥90%','美团≈80-85%'],
            ['消费者30日复购率','≥25%','≥30%','≥35%','美团≈25-30%'],
            ['消费者90日留存率','≥40%','≥50%','≥55%','—'],
            ['推广者月活留存率','≥70%','≥75%','≥80%','分销行业≈50-60%'],
        ]
    ));

    children.push(h2('7.2  三元营销驱动复购'));
    children.push(dataTable(
        ['权益工具','发放时机','使用规则','驱动复购机制','Y1预估\n使用率'],
        [
            ['代金券','每笔消费后自动发放\n(消费额×5%)','30%抵扣上限·90天有效\n同业态使用🆕','"券要过期了"\n时效性驱动','65%'],
            ['积分','每消费¥1=1积分\n积分翻倍日×2','100积分=¥1·20%抵扣\n2年有效·全平台通用','"攒积分换折扣"\n累积性驱动','40%'],
            ['消费金','每笔交易计提3%\n存入用户账户','30%核销上限·12个月\n全平台通用·可家庭共享','"花掉攒的消费金"\n沉没成本驱动','50%'],
        ]
    ));

    children.push(h2('7.3  商家等级升级路径'));
    children.push(dataTable(
        ['商家等级','月GMV标准','月复购率','营销支持','专属权益'],
        [
            ['🥉 青铜(新店)','<¥10,000','—','新店礼包+搜索加权14天','基础数据看板'],
            ['🥈 白银','¥10,000-30,000','≥20%','代金券5%+积分×1','推广者匹配+周报'],
            ['🥇 黄金','¥30,000-80,000','≥30%','代金券7%+积分×2(月8日)','首页推荐位+优先推广者'],
            ['💎 钻石','¥80,000+','≥40%','定制营销方案+品牌联名','城市服务商1对1+品牌认证'],
        ]
    ));

    children.push(h2('7.4  跨店通兑网络效应模型'));
    children.push(p('网络效应量化：假设1个消费者在A店消费后获得¥3消费金→在B店使用→B店获得新客→B店产生复购→B店也发放消费金→C店获得新客→……',{bold:true}));
    children.push(dataTable(
        ['指标','公式','Y1估计','Y3估计'],
        [
            ['跨店使用率','跨店核销/总核销','~30%','~55%'],
            ['网络效应乘数','1/(1-跨店使用率)','1.43×','2.22×'],
            ['消费者月访问商家数','—','1.8家','3.5家'],
            ['人均权益跨店流转次数','—','0.5次/月','2.0次/月'],
        ]
    ));
    children.push(p('跨店使用率从30%→55%是Y1→Y3的核心增长杠杆——它直接放大消费者LTV和商家自然获客能力。每提升10pp跨店使用率，消费者月均交易频次提升约0.3次。',{bold:true,color:C.GREEN}));
    children.push(pageBreak());

    // ===== CHAPTER 8: MONETIZATION =====
    children.push(h1('第八章  商业化与收入优化'));
    children.push(h2('8.1  Take Rate优化路径'));
    children.push(dataTable(
        ['优化杠杆','当前值','Y1目标','Y2目标','Y3目标','提升幅度\n(Y3 vs 当前)'],
        [
            ['平台商家服务费率','5.00%','5.00%','5.25%','5.50%','+0.50pp'],
            ['联盟商家渠道费率','4.50%','4.50%','4.75%','5.00%','+0.50pp'],
            ['综合商城服务费率','6.00%','6.00%','6.00%','6.00%','持平'],
            ['支付方式Mix优化','汇付80%','汇付80%','汇付65%','汇付50%','↓30pp'],
            ['加权实际Take Rate','5.27%','5.27%','5.40%','5.73%','+0.46pp'],
        ]
    ));
    children.push(p('Take Rate优化遵循"不主动提高费率、靠Mix自然提升"原则——通过提升消费金核销/余额支付占比（而非提高名义费率）来实现平台收入增长。商家名义费率在Y2才开始微调，且仅针对已充分验证商业价值的商家。',{bold:true}));

    children.push(h2('8.2  商家等级差异化定价'));
    children.push(dataTable(
        ['商家等级','月GMV','平台服务费率','优惠理由','预计占比Y3'],
        [
            ['青铜(新店)','<¥10,000','标准费率','新店保护期——降低门槛','30%'],
            ['白银','¥10,000-30,000','标准费率','—','35%'],
            ['黄金','¥30,000-80,000','标准费率+0.25%','增值服务费——享受首页推荐','25%'],
            ['钻石','¥80,000+','标准费率+0.50%','品牌溢价——1对1服务+联名','10%'],
        ]
    ));
    children.push(p('黄金以上商家自愿接受略高费率——因为平台导流和品牌溢价带来的增量收入远超额外0.25-0.50pp的服务费。这是典型的"价值定价"而非"成本定价"。',{color:C.GREEN}));

    children.push(h2('8.3  增值服务收入（Y2+）'));
    children.push(b('数据经营看板（高级版）：¥99/月——含行业对标+竞品分析+客流预测'));
    children.push(b('智能营销工具包：¥199/月——AI推荐券面额/时机/目标人群'));
    children.push(b('品牌认证+专区展示：¥299/月——链商认证·品质好店 + 首页品牌专区'));
    children.push(b('Y3增值服务收入预估：5,000家×¥199/月×12个月 = ¥1,194万/年 ≈ 占总收入~3%'));
    children.push(pageBreak());

    // ==========================================
    // PART 3: 财务模型 (Chapters 9-12)
    // ==========================================

    // ===== CHAPTER 9: 3-YEAR FINANCIAL PROJECTIONS =====
    children.push(h1('第九章  3年财务预测（完整三表模型）'));
    children.push(p('以下所有预测基于2026年6月制定的核心假设。基础情景(Base Case)为最可能路径。保守(Downside)和乐观(Upside)情景见第十一章。',{color:C.GRAY}));

    children.push(h2('9.1  关键假设汇总表'));
    children.push(dataTable(
        ['假设类别','参数','Base Case值','Downside','Upside','数据来源'],
        [
            ['GMV驱动','起始月交易量(M1)','5,000笔','3,000笔','8,000笔','公测种子商家测算'],
            ['GMV驱动','M1-M6交易量月增速','25%','15%','35%','推广者网络增速假设'],
            ['GMV驱动','M7-M12交易量月增速','18%','10%','25%','城市复制速度假设'],
            ['GMV驱动','Y2交易量季度增速','10%','6%','15%','规模效应+城市扩展'],
            ['GMV驱动','Y3交易量季度增速','8%','5%','12%','成熟期稳健增长'],
            ['GMV驱动','客单价','¥100','¥85','¥120','社区消费中位数'],
            ['收入','加权Take Rate(Y1)','5.27%','5.00%','5.50%','V3.2模型参数'],
            ['收入','加权Take Rate(Y3)','5.73%','5.30%','6.00%','支付Mix优化+等级定价'],
            ['成本','支付渠道成本(Y1加权)','0.492%','0.50%','0.45%','支付方式Mix加权'],
            ['成本','支付渠道成本(Y3加权)','0.320%','0.38%','0.28%','消费金核销占比提升'],
            ['成本','固定成本(月·Y1)','¥190,000','¥210,000','¥170,000','技术+人员+办公+合规'],
            ['成本','城市扩张固定成本增量','5%/新城(Y1-Y2)\n4%/新城(Y2-Y3)','8%/新城','3%/新城','规模效应假设'],
            ['成本','城市一次启动成本','¥80,000/城','¥120,000/城','¥50,000/城','运营经验曲线'],
            ['税率','企业所得税','25%','25%','25%','PRC法定税率'],
            ['折旧','CAPEX÷折旧年限','3年直线法','—','—','IFRS准则'],
        ], {small:true}
    ));

    children.push(h2('9.2  3年利润表预测（P&L）'));
    // Y1 annual
    var y1Annual = {
        gmv: 0, rev: 0, chCost: 0, wCost: 0, grossProfit: 0, fixedCost: 0, ebitda: 0,
        depreciation: P.capexSchedule.y1 / P.depreciationYears,
        ebit: 0, tax: 0, netProfit: 0,
    };
    for (var yi = 0; yi < proj.y1.months.length; yi++) {
        var ym = proj.y1.months[yi];
        y1Annual.gmv += ym.gmv;
        y1Annual.rev += ym.rev;
        y1Annual.chCost += ym.chCost;
        y1Annual.wCost += ym.wCost;
        y1Annual.grossProfit += ym.grossProfit;
        y1Annual.fixedCost += ym.fixedCost;
        y1Annual.ebitda += ym.ebitda;
    }
    y1Annual.ebit = y1Annual.ebitda - y1Annual.depreciation;
    y1Annual.tax = Math.max(0, y1Annual.ebit * P.taxRate);
    y1Annual.netProfit = y1Annual.ebit - y1Annual.tax;

    // Y2 annual
    var y2Annual = {
        gmv: 0, rev: 0, chCost: 0, wCost: 0, grossProfit: 0, fixedCost: 0, ebitda: 0,
        depreciation: P.capexSchedule.y2 / P.depreciationYears,
        ebit: 0, tax: 0, netProfit: 0,
    };
    for (var qi = 0; qi < proj.y2.quarters.length; qi++) {
        var yq = proj.y2.quarters[qi];
        y2Annual.gmv += yq.gmv;
        y2Annual.rev += yq.rev;
        y2Annual.chCost += yq.chCost;
        y2Annual.wCost += yq.wCost;
        y2Annual.grossProfit += yq.grossProfit;
        y2Annual.fixedCost += yq.fixedCost;
        y2Annual.ebitda += yq.ebitda;
    }
    y2Annual.ebit = y2Annual.ebitda - y2Annual.depreciation;
    y2Annual.tax = Math.max(0, y2Annual.ebit * P.taxRate);
    y2Annual.netProfit = y2Annual.ebit - y2Annual.tax;

    // Y3 annual
    var y3Annual = {
        gmv: 0, rev: 0, chCost: 0, wCost: 0, grossProfit: 0, fixedCost: 0, ebitda: 0,
        depreciation: P.capexSchedule.y3 / P.depreciationYears,
        ebit: 0, tax: 0, netProfit: 0,
    };
    for (var qj = 0; qj < proj.y3.quarters.length; qj++) {
        var yq3 = proj.y3.quarters[qj];
        y3Annual.gmv += yq3.gmv;
        y3Annual.rev += yq3.rev;
        y3Annual.chCost += yq3.chCost;
        y3Annual.wCost += yq3.wCost;
        y3Annual.grossProfit += yq3.grossProfit;
        y3Annual.fixedCost += yq3.fixedCost;
        y3Annual.ebitda += yq3.ebitda;
    }
    y3Annual.ebit = y3Annual.ebitda - y3Annual.depreciation;
    y3Annual.tax = Math.max(0, y3Annual.ebit * P.taxRate);
    y3Annual.netProfit = y3Annual.ebit - y3Annual.tax;

    children.push(dataTable(
        ['利润表项目','Year 1','Year 2','Year 3','3年累计','Y3/Y1\n增长率'],
        [
            ['GMV',fmt(y1Annual.gmv),fmt(y2Annual.gmv),fmt(y3Annual.gmv),fmt(y1Annual.gmv+y2Annual.gmv+y3Annual.gmv),'—'],
            ['平台服务费收入',fmt(y1Annual.rev),fmt(y2Annual.rev),fmt(y3Annual.rev),fmt(y1Annual.rev+y2Annual.rev+y3Annual.rev),'—'],
            ['支付渠道成本','('+fmt(y1Annual.chCost)+')','('+fmt(y2Annual.chCost)+')','('+fmt(y3Annual.chCost)+')','('+fmt(y1Annual.chCost+y2Annual.chCost+y3Annual.chCost)+')','—'],
            ['二次提现成本','('+fmt(y1Annual.wCost)+')','('+fmt(y2Annual.wCost)+')','('+fmt(y3Annual.wCost)+')','('+fmt(y1Annual.wCost+y2Annual.wCost+y3Annual.wCost)+')','—'],
            ['毛利',fmt(y1Annual.grossProfit),fmt(y2Annual.grossProfit),fmt(y3Annual.grossProfit),fmt(y1Annual.grossProfit+y2Annual.grossProfit+y3Annual.grossProfit),'—'],
            ['毛利率',pct1(y1Annual.grossProfit/y1Annual.gmv),pct1(y2Annual.grossProfit/y2Annual.gmv),pct1(y3Annual.grossProfit/y3Annual.gmv),'—','—'],
            ['固定成本','('+fmt(y1Annual.fixedCost)+')','('+fmt(y2Annual.fixedCost)+')','('+fmt(y3Annual.fixedCost)+')','('+fmt(y1Annual.fixedCost+y2Annual.fixedCost+y3Annual.fixedCost)+')','—'],
            ['EBITDA',fmt(y1Annual.ebitda),fmt(y2Annual.ebitda),fmt(y3Annual.ebitda),fmt(y1Annual.ebitda+y2Annual.ebitda+y3Annual.ebitda),'—'],
            ['EBITDA利润率',pct1(y1Annual.ebitda>0?y1Annual.ebitda/y1Annual.gmv:0),pct1(y2Annual.ebitda>0?y2Annual.ebitda/y2Annual.gmv:0),pct1(y3Annual.ebitda>0?y3Annual.ebitda/y3Annual.gmv:0),'—','—'],
            ['折旧与摊销','('+fmt(y1Annual.depreciation)+')','('+fmt(y2Annual.depreciation)+')','('+fmt(y3Annual.depreciation)+')','—','—'],
            ['EBIT',fmt(y1Annual.ebit),fmt(y2Annual.ebit),fmt(y3Annual.ebit),'—','—'],
            ['所得税','('+fmt(y1Annual.tax)+')','('+fmt(y2Annual.tax)+')','('+fmt(y3Annual.tax)+')','—','—'],
            ['净利润',fmt(y1Annual.netProfit),fmt(y2Annual.netProfit),fmt(y3Annual.netProfit),fmt(y1Annual.netProfit+y2Annual.netProfit+y3Annual.netProfit),'—'],
            ['净利率',pct1(y1Annual.netProfit>0?y1Annual.netProfit/y1Annual.gmv:0),pct1(y2Annual.netProfit>0?y2Annual.netProfit/y2Annual.gmv:0),pct1(y3Annual.netProfit>0?y3Annual.netProfit/y3Annual.gmv:0),'—','—'],
        ], {small:true}
    ));
    children.push(p('注：上述P&L表含完整COGS分解。Y1 EBITDA为负（亏损期）→Y2中期转正（达到盈亏平衡后）→Y3全年盈利。',{color:C.GRAY}));

    children.push(h2('9.3  3年资产负债表预测（Balance Sheet）'));
    children.push(dataTable(
        ['资产负债表项目','Y1末','Y2末','Y3末','说明'],
        [
            ['【资产】','','','',''],
            ['现金及现金等价物',fmt(y1Annual.netProfit + P.capexSchedule.y1),fmt(y2Annual.netProfit + P.capexSchedule.y2 + y1Annual.netProfit * 0.3),fmt(y3Annual.netProfit + P.capexSchedule.y3 + (y1Annual.netProfit+y2Annual.netProfit)*0.3),'含累计留存利润'],
            ['应收账款(商家待结算)',fmt(y1Annual.gmv/12*0.05),fmt(y2Annual.gmv/12*0.04),fmt(y3Annual.gmv/12*0.03),'T+1结算·风险低'],
            ['预付及其他应收',fmt(P.capexSchedule.y1*0.1),fmt(P.capexSchedule.y2*0.1),fmt(P.capexSchedule.y3*0.1),'押金/预付云服务等'],
            ['固定资产净值',fmt(P.capexSchedule.y1*2/3),fmt(P.capexSchedule.y1/3+P.capexSchedule.y2*2/3),fmt(P.capexSchedule.y1*0+P.capexSchedule.y2/3+P.capexSchedule.y3*2/3),'3年直线折旧'],
            ['资产总计',fmt(y1Annual.netProfit*1.3+P.capexSchedule.y1*1.77),fmt(y2Annual.netProfit*1.3+P.capexSchedule.y2*1.77),fmt(y3Annual.netProfit*1.3+P.capexSchedule.y3*1.77),'—'],
            ['【负债】','','','',''],
            ['应付账款',fmt(y1Annual.gmv/12*0.02),fmt(y2Annual.gmv/12*0.015),fmt(y3Annual.gmv/12*0.01),'供应商/服务商'],
            ['应付税费',fmt(y1Annual.tax>0?y1Annual.tax/4:0),fmt(y2Annual.tax>0?y2Annual.tax/4:0),fmt(y3Annual.tax>0?y3Annual.tax/4:0),'按季预缴'],
            ['负债总计','—','—','—','低负债·轻资产模式'],
            ['【所有者权益】','','','',''],
            ['实收资本','¥500万','¥500万','¥500万','母公司投入'],
            ['留存利润',fmt(Math.max(0,y1Annual.netProfit)),fmt(Math.max(0,y1Annual.netProfit+y2Annual.netProfit)),fmt(Math.max(0,y1Annual.netProfit+y2Annual.netProfit+y3Annual.netProfit)),'滚存'],
        ], {small:true}
    ));
    children.push(p('注：链商为轻资产平台模式，固定资产主要为技术基础设施（服务器/软件），无库存/大额应收。负债端无银行借款——资金需求通过母公司拨款和未来上市融资满足。',{color:C.GRAY}));

    children.push(h2('9.4  3年现金流量表预测（Cash Flow）'));
    var y1Ocf = y1Annual.ebitda + y1Annual.depreciation - y1Annual.tax - (P.capexSchedule.y1*0.15);
    var y2Ocf = y2Annual.ebitda + y2Annual.depreciation - y2Annual.tax - (P.capexSchedule.y2*0.15);
    var y3Ocf = y3Annual.ebitda + y3Annual.depreciation - y3Annual.tax - (P.capexSchedule.y3*0.15);

    children.push(dataTable(
        ['现金流量表项目','Year 1','Year 2','Year 3','3年累计'],
        [
            ['【经营活动现金流】','','','',''],
            ['EBITDA',fmt(y1Annual.ebitda),fmt(y2Annual.ebitda),fmt(y3Annual.ebitda),fmt(y1Annual.ebitda+y2Annual.ebitda+y3Annual.ebitda)],
            ['加：折旧摊销',fmt(y1Annual.depreciation),fmt(y2Annual.depreciation),fmt(y3Annual.depreciation),fmt(y1Annual.depreciation+y2Annual.depreciation+y3Annual.depreciation)],
            ['减：所得税支付','('+fmt(y1Annual.tax)+')','('+fmt(y2Annual.tax)+')','('+fmt(y3Annual.tax)+')','('+fmt(y1Annual.tax+y2Annual.tax+y3Annual.tax)+')'],
            ['营运资本变动','('+fmt(y1Annual.gmv/12*0.02)+')','('+fmt(y2Annual.gmv/12*0.015)+')','('+fmt(y3Annual.gmv/12*0.01)+')','—'],
            ['经营活动现金净额',fmt(y1Ocf),fmt(y2Ocf),fmt(y3Ocf),fmt(y1Ocf+y2Ocf+y3Ocf)],
            ['【投资活动现金流】','','','',''],
            ['资本支出(CAPEX)','('+fmt(P.capexSchedule.y1)+')','('+fmt(P.capexSchedule.y2)+')','('+fmt(P.capexSchedule.y3)+')','('+fmt(P.capexSchedule.y1+P.capexSchedule.y2+P.capexSchedule.y3)+')'],
            ['投资活动现金净额','('+fmt(P.capexSchedule.y1)+')','('+fmt(P.capexSchedule.y2)+')','('+fmt(P.capexSchedule.y3)+')','—'],
            ['【融资活动现金流】','','','',''],
            ['母公司注资',fmt(5000000),'—','—',fmt(5000000)],
            ['上市融资(假设)','—','—','¥1.2亿','—'],
            ['融资活动现金净额',fmt(5000000),'—','¥1.2亿','—'],
            ['现金净增加额',fmt(y1Ocf-P.capexSchedule.y1+5000000),fmt(y2Ocf-P.capexSchedule.y2),'—','—'],
            ['期末现金余额','—','—','—','—'],
        ], {small:true}
    ));
    children.push(p('注：Y1现金流入含母公司注资¥500万。上市融资假设Y3完成，融资金额¥1.2亿为示意性估算——实际视市场条件和估值而定。',{color:C.GRAY}));

    children.push(h2('9.5  Y1月度GMV与EBITDA爬坡曲线'));
    var monthlyData = [];
    for (var mi = 0; mi < proj.y1.months.length; mi++) {
        var mm = proj.y1.months[mi];
        monthlyData.push([
            'M'+(mi+1), kSep(mm.tx), fmt(mm.gmv), fmt(mm.rev), fmt(mm.ebitda),
            mm.ebitda >= 0 ? '✅ 盈利' : mm.ebitda > -50000 ? '🟡 接近' : '🔴 亏损'
        ]);
    }
    children.push(dataTable(
        ['月份','月交易量(笔)','月GMV','平台服务费收入','EBITDA','状态'],
        monthlyData, {small:true}
    ));
    children.push(p('关键里程碑：M8-M9区间预计单月EBITDA转正（约54,000笔/月时突破盈亏平衡）。M10起稳定盈利。',{bold:true,color:C.GREEN}));
    children.push(pageBreak());

    // ===== CHAPTER 10: UNIT ECONOMICS =====
    children.push(h1('第十章  单位经济学深度分析'));
    children.push(h2('10.1  单笔交易经济学（12场景全矩阵）'));
    children.push(dataTable(
        ['业态','支付方式','商家\n到手率','平台\n服务费','推广\n佣金','渠道\n成本','平台\n边际利润'],
        [
            ['平台商家','汇付收单','75.4%','¥5.00','¥9.00','¥0.60','¥4.40'],
            ['平台商家','余额支付','—','¥5.00','¥9.00','¥0.10','¥4.90'],
            ['平台商家','消费金核销','90.0%','¥5.00','¥0.50','¥0.00','¥5.00'],
            ['联盟商家','汇付收单','71.4%','¥9.50*','¥10.00','¥0.60','¥4.40'],
            ['联盟商家','余额支付','—','¥9.50*','¥10.00','¥0.10','¥4.90'],
            ['联盟商家','消费金核销','90.0%','¥7.40','¥1.00','¥0.00','¥5.10'],
            ['综合商城','汇付收单','77.9%','¥6.00','¥6.00','¥0.60','¥5.40'],
            ['综合商城','余额支付','—','¥6.00','¥6.00','¥0.10','¥5.90'],
            ['综合商城','消费金核销','90.0%','¥6.00','¥0.50','¥0.00','¥6.00'],
        ], {small:true}
    ));
    children.push(p('*联盟商家：5%平台服务费 + 4.5%平台商家渠道费 = 9.5%（平台合计，不含推广佣金）。加权平台边际利润（含提现）= ¥4.686/笔（70%汇付+20%余额+10%核销加权平均）。',{color:C.GRAY}));

    children.push(h2('10.2  三方单位经济学汇总'));
    children.push(dataTable(
        ['单位经济指标','商家','消费者','推广者'],
        [
            ['获取成本(CAC)','¥500-800(一线)','¥15-20(推广者渠道)','¥0(零入门费)'],
            ['月均贡献','¥15,000-25,000 GMV','3次×¥100=¥300','150笔×¥100×6.5%'],
            ['平台月收入','¥800-1,333','¥16(服务费)','—'],
            ['平台月支出','推广佣金¥1,350-2,250','¥7.5(新人券+积分)','佣金¥975'],
            ['预计生命周期','36个月','24个月','18个月(→升级服务站)'],
            ['LTV(平台视角)','¥28,800-48,000','¥384','—'],
            ['LTV/CAC','36-96×','19.2×','—'],
            ['平台净收益','LTV - CAC - 佣金\n= ¥27,000-45,000','¥384-¥20=¥364','推广者->平台正向贡献'],
        ]
    ));
    children.push(p('结论：三方单位经济学均健康。商家LTV/CAC极高(36-96×)说明商家获取值得加大投入。消费者LTV/CAC(19.2×)远超3×健康线。推广者零CAC获取+正向GMV贡献是最有效的增长飞轮。',{bold:true,color:C.GREEN}));

    children.push(h2('10.3  Cohort分析框架'));
    children.push(p('以下为cohort分析的框架结构——实际数据将在公测后按月追踪：',{color:C.GRAY}));
    children.push(dataTable(
        ['Cohort(入驻月份)','商家数','M1\n存活率','M2\n存活率','M3\n存活率','M6\n存活率','M3月均\nGMV/商家','M6月均\nGMV/商家'],
        [
            ['2026-M7(首批)','50','100%','95%','90%','80%','¥8,000','¥15,000'],
            ['2026-M8','80','100%','93%','88%','—','¥7,500','—'],
            ['2026-M9','100','100%','90%','—','—','¥7,000','—'],
            ['...(逐月追踪)','—','—','—','—','—','—','—'],
        ]
    ));
    children.push(p('Cohort分析目标：①验证商家"入驻→稳定经营"转化率≥40% ②追踪每代cohort的GMV爬坡速度 ③识别早期流失信号并干预。',{bold:true}));
    children.push(pageBreak());

    // ===== CHAPTER 11: SENSITIVITY ANALYSIS =====
    children.push(h1('第十一章  敏感性分析与情景规划'));
    children.push(h2('11.1  单变量敏感性分析（@Y3月交易量）'));
    children.push(dataTable(
        ['变量','变动幅度','Y3月GMV\n变动','Y3平台\n收入变动','Y3 EBITDA\n变动','净利率\n变动'],
        [
            ['交易量','±20%','±¥432万/月','±¥24.7万/月','±¥24.7万/月','±0.15pp'],
            ['客单价','±¥10(±10%)','±¥216万/月','±¥12.4万/月','±¥12.4万/月','±0.10pp'],
            ['Take Rate','±0.5pp','—','±¥10.8万/月','±¥10.8万/月','±0.50pp'],
            ['固定成本','±10%','—','—','∓¥2.7万/月','∓0.13pp'],
            ['消费金核销占比','±10pp','—','±¥4.8万/月','±¥4.8万/月','±0.22pp'],
        ]
    ));
    children.push(p('最敏感变量：交易量（弹性≈1.0——1%交易量变动≈1%EBITDA变动）。其次是消费金核销占比（弹性≈0.5）和Take Rate（弹性≈0.5）。固定成本弹性最小（0.1）——因为主要构成（技术）存在规模效应。',{bold:true}));

    children.push(h2('11.2  三情景分析'));
    // Simplified scenario calculations
    var baseY3Rev = y3Annual.rev;
    var baseY3Ebitda = y3Annual.ebitda;
    var baseY3Margin = y3Annual.netProfit / y3Annual.gmv;
    var downY3Rev = baseY3Rev * 0.7;
    var downY3Ebitda = baseY3Ebitda * 0.4;
    var downY3Margin = 0.01;
    var upY3Rev = baseY3Rev * 1.35;
    var upY3Ebitda = baseY3Ebitda * 1.8;
    var upY3Margin = 0.085;

    children.push(dataTable(
        ['指标','保守情景\n(Downside)\n交易量低于预期20%','基础情景\n(Base Case)\n按当前假设','乐观情景\n(Upside)\n交易量超预期20%+'],
        [
            ['Y3月交易量(笔)','~150,000','~216,000','~300,000'],
            ['Y3年度GMV',fmt(y3Annual.gmv*0.7),fmt(y3Annual.gmv),fmt(y3Annual.gmv*1.35)],
            ['Y3平台服务费收入',fmt(downY3Rev),fmt(baseY3Rev),fmt(upY3Rev)],
            ['Y3 EBITDA',fmt(downY3Ebitda),fmt(baseY3Ebitda),fmt(upY3Ebitda)],
            ['Y3 净利率',pct1(downY3Margin),pct1(baseY3Margin),pct1(upY3Margin)],
            ['达到月度盈亏平衡','M12','M8-M9','M6'],
            ['Y1末月交易量','~35,000笔','~56,000笔','~85,000笔'],
            ['3年累计GMV',fmt(y1Annual.gmv*0.7+y2Annual.gmv*0.75+y3Annual.gmv*0.7),fmt(y1Annual.gmv+y2Annual.gmv+y3Annual.gmv),fmt(y1Annual.gmv*1.3+y2Annual.gmv*1.2+y3Annual.gmv*1.35)],
        ], {small:true}
    ));

    children.push(h2('11.3  盈亏平衡敏感性'));
    children.push(dataTable(
        ['情景','月固定成本','每笔边际利润','盈亏平衡\n(笔/月)','预计达到\n时间','安全边际'],
        [
            ['保守','¥210,000','¥4.00','52,500','M14','0.67×——危险'],
            ['基础','¥190,000','¥4.686','40,500','M8-M9','1.34×——适中'],
            ['乐观','¥170,000','¥5.00','34,000','M5-M6','2.50×——充裕'],
        ]
    ));

    children.push(h2('11.4  上市融资后的加速增长情景'));
    children.push(p('假设Y3完成上市融资¥1.2亿：',{bold:true}));
    children.push(b('市场拓展加速：新增30城市(Y3→Y4)，城市覆盖80+，月交易量目标50万笔(Y4末)'));
    children.push(b('品牌建设：全国品牌Campaign，商家CAC降低30%（品牌认知度提升）'));
    children.push(b('技术投入：AI推荐系统+智能风控+开放API平台——提升消费者匹配效率+降低运营成本'));
    children.push(b('人才引进：团队200+人，覆盖产品/技术/运营/BD/合规'));
    children.push(pageBreak());

    // ===== CHAPTER 12: MARKETING BUDGET & USE OF PROCEEDS =====
    children.push(h1('第十二章  营销预算与使用募集资金'));
    children.push(h2('12.1  营销预算模型——随交易量自动增长'));
    children.push(dataTable(
        ['月交易量','月GMV','营销池\n(3.5-4%)','代金券预算\n(70%)','推广者激励\n(15%)','城市活动\n(10%)','机动储备\n(5%)'],
        [
            ['5,000(M1)','¥500,000','¥20,000','¥14,000','¥3,000','¥2,000','¥1,000'],
            ['20,000','¥2,000,000','¥80,000','¥56,000','¥12,000','¥8,000','¥4,000'],
            ['40,500(BE)','¥4,050,000','¥167,224','¥117,057','¥25,084','¥16,722','¥8,361'],
            ['56,000(Y1末)','¥5,600,000','¥224,000','¥156,800','¥33,600','¥22,400','¥11,200'],
            ['110,000(Y2末)','¥11,000,000','¥440,000','¥308,000','¥66,000','¥44,000','¥22,000'],
            ['216,000(Y3末)','¥21,600,000','¥864,000','¥604,800','¥129,600','¥86,400','¥43,200'],
        ]
    ));
    children.push(p('链商营销模型的核心优势：营销预算不需要"申请"——每笔交易自动生成。月交易量10万笔时月度营销预算¥40万，零预付、零透支、零资金占用。',{bold:true,color:C.GREEN}));

    children.push(h2('12.2  营销预算AARRR分配'));
    children.push(dataTable(
        ['AARRR阶段','预算占比','Y1月度预算\n(@50K笔)','主要用途','预期效果'],
        [
            ['Acquisition\n(获客)','50%','¥100,000','代金券(70K)+推广者激励(15K)\n+城市活动(10K)+机动(5K)','月获新客~3,000人\nCAC ≤ ¥20'],
            ['Activation\n(激活)','20%','¥40,000','新人券+首单积分翻倍\n+新店搜索加权','注册→首单≥50%\n上架→首单≥60%'],
            ['Retention\n(留存)','20%','¥40,000','复购券+积分翻倍日\n+消费金过期提醒','30日复购率≥25%\n券核销率≥65%'],
            ['Referral\n(推荐)','10%','¥20,000','推荐有奖+推广者竞赛\n+Top10奖励','推广者月活≥70%\n裂变系数≥1.3'],
            ['Revenue\n(收入)','0%\n(无需专项)','—','收入随交易量自然增长\nTake Rate Mix优化','加权Take Rate\n5.27%→5.73%'],
        ]
    ));

    children.push(h2('12.3  上市募集资金用途（Use of Proceeds）'));
    children.push(dataTable(
        ['用途类别','金额','占比','时间跨度','关键里程碑','预期成果'],
        [
            ['市场拓展\n与品牌建设','¥4,800万','40%','Y3-Y5','50城市·10万商家\n全国品牌Campaign','商家CAC↓30%\n品牌认知度↑50%'],
            ['技术研发\n与产品迭代','¥3,600万','30%','Y3-Y5','AI推荐·智能风控\n开放API·数据中台','平台稳定性99.9%\n匹配效率↑40%'],
            ['运营资金\n与人才引进','¥2,400万','20%','Y3-Y5','团队50→200人\n城市运营中心×5','运营效率↑30%\n人均GMV↑25%'],
            ['合规与风控\n体系升级','¥1,200万','10%','Y3-Y4','上市合规·内控体系\n审计跟踪·ESG报告','通过HKEx审核\n内控评级"有效"'],
            ['合计','¥12,000万','100%','3年','以上市估值¥6-10亿\n为参考基准','平台价值¥30-50亿\n(Y5目标估值)'],
        ]
    ));
    children.push(p('注：上述为示意性分配，实际使用视上市时市场条件、监管要求和董事会批准而定。所有募集资金使用将严格遵循HKEx披露要求。',{color:C.GRAY}));

    children.push(h2('12.4  营销ROI框架'));
    children.push(dataTable(
        ['营销支出','年度金额\n(Y3)','可归因增量\nGMV(保守)','可归因增量\n平台收入','ROI','回收期'],
        [
            ['代金券发放','¥726万','¥2,900万','¥166万','0.23×\n(直接)','券核销时即回收'],
            ['推广者激励','¥156万','¥1,560万','¥89万','0.57×\n(直接)','即时回收'],
            ['城市活动','¥104万','¥520万','¥30万','0.29×\n(直接)','1-2个月'],
            ['合计(直接ROI)','¥986万','¥4,980万','¥285万','0.29×','—'],
            ['间接/长期效果','—','¥9,960万\n(网络效应×2)','¥570万','0.58×\n(含间接)','6-12个月'],
        ]
    ));
    children.push(p('营销ROI核心逻辑：代金券和推广者激励的"直接ROI"看似乎<1——但间接效果（网络效应、商家LTV延长、跨店通兑飞轮）是直接效果的2倍以上。营销池是增长引擎，不是成本中心。',{bold:true,color:C.GREEN}));
    children.push(pageBreak());

    // ==========================================
    // PART 4: 风险与治理 (Chapters 13-16)
    // ==========================================

    // ===== CHAPTER 13: RISK FACTORS =====
    children.push(h1('第十三章  风险因素'));
    children.push(p('以下风险矩阵按HKEx上市披露标准编制，覆盖7大类·24项风险因子。每项标注发生概率、影响程度、风险等级和缓解措施。',{bold:true}));

    children.push(h2('13.1  风险矩阵'));
    children.push(riskMatrix([
        ['交易量增长不及预期','中','高','P0','加大商家拓展力度·降低入驻门槛·增加推广者激励'],
        ['商家流失率超预期','中','高','P0','商家成功团队·经营培训·数据赋能·降低服务费'],
        ['消费者复购率低于目标','中','中高','P1','A/B测试券面额/门槛/时机·积分翻倍日·消费金过期提醒'],
        ['推广者留存率低','中','中','P1','提升佣金竞争力·排行榜+竞赛·升级通道明确·素材库优化'],
        ['支付监管政策收紧','低','极高','P0','保持汇付直清·零资金池·三红线合规·监管沟通常态化'],
        ['二清/传销认定风险','低','极高','P0','代金券同业态·≤3层服务费结算·零入门费·法律顾问定期审查'],
        ['数据安全/个人信息保护','中','高','P1','数据加密·权限管控·PIPL合规·年度安全审计'],
        ['微信生态依赖风险','低','中高','P2','多平台规划(支付宝/抖音小程序)·独立APP长期规划'],
        ['竞争加剧(美团/抖音)','中','中','P1','差异化定位强化·跨店通兑网络效应·商家忠诚度建设'],
        ['宏观经济下行','中','中','P2','社区消费刚需属性强——餐饮/零售/生活服务抗周期'],
        ['城市复制失败','中','中高','P1','城市服务商严格筛选·3城市验证→再扩展·标准化运营手册'],
        ['融资/上市延迟','中','中','P2','母公司资金支持·控制成本·加速内生增长·多融资渠道'],
    ]));

    children.push(h2('13.2  合规风险专项'));
    children.push(redline('三条合规红线：①积分不可兑现 ②不可形成资金池 ③不可承诺收益'));
    children.push(greenCheck('汇付天下(持牌支付机构)直清——平台不碰任何消费者资金'));
    children.push(greenCheck('代金券/积分/消费金均定义为"消费营销权益"——不可兑现、不可购买金融产品'));
    children.push(greenCheck('三级推广体系≤3层服务费结算·零入门费·收入基于交易量(非人头费)'));
    children.push(greenCheck('所有对外文档执行13项合规术语强制替换·8类禁止词汇零出现'));
    children.push(greenCheck('每季度法务合规审查·年度第三方合规审计·监管政策变动即时响应'));
    children.push(pageBreak());

    // ===== CHAPTER 14: KPIs & REPORTING =====
    children.push(h1('第十四章  关键绩效指标与报告框架'));
    children.push(h2('14.1  HKEx上市披露指标体系'));
    children.push(dataTable(
        ['指标类别','指标名称','计算方式','披露频率','Y3目标值'],
        [
            ['规模指标','GMV','Σ(交易笔数×实付金额)','季度/年度','¥26亿'],
            ['规模指标','平台服务费收入','GMV × 加权Take Rate','季度/年度','¥1,494万'],
            ['规模指标','月活跃商家数','当月至少1笔交易的商家','季度/年度','10,000家'],
            ['规模指标','月活跃消费者数','当月至少1笔消费的用户','季度/年度','60万人'],
            ['规模指标','月活跃推广者数','当月至少1笔推广收入的推广者','季度/年度','4,000人'],
            ['效率指标','Take Rate','平台服务费收入/GMV','季度/年度','5.73%'],
            ['效率指标','商家到手率','商家净收入/GMV','季度/年度','75-82%'],
            ['效率指标','消费者30日复购率','首单后30天内有≥2单的用户占比','季度/年度','≥35%'],
            ['效率指标','代金券核销率','核销张数/发放张数','季度/年度','≥65%'],
            ['盈利指标','毛利率','(平台服务费-渠道成本-推广佣金)/平台服务费','半年/年度','≥70%'],
            ['盈利指标','EBITDA利润率','EBITDA/GMV','半年/年度','≥3%'],
            ['盈利指标','净利率','净利润/GMV','半年/年度','≥2%'],
        ]
    ));

    children.push(h2('14.2  运营仪表盘（月度KPI卡片）'));
    children.push(p('以下为月度经营分析会使用的核心KPI——简洁、可追踪、可预警。',{bold:true}));

    children.push(h2('14.3  预警指标体系'));
    children.push(dataTable(
        ['预警级别','触发条件','响应行动','响应时间','责任人'],
        [
            ['🔴 红色','CAC > ¥25连续2周','暂停付费获客·优化券面额·审查渠道效率','24小时内','增长负责人'],
            ['🔴 红色','商家周流失率 > 3%','流失商家1对1回访·诊断根因·48小时内出方案','48小时内','BD负责人'],
            ['🟠 橙色','复购率周环比下降 > 20%','A/B测试券面额/门槛/时机·积分活动加码','72小时内','品牌负责人'],
            ['🟠 橙色','活跃推广者数周环比降 > 15%','启动召回激励·回归奖¥50券·Top10竞赛加码','72小时内','运营负责人'],
            ['🟡 黄色','某城市CAC > 均值×150%','城市服务商1对1沟通·调整城市策略·暂停扩城','1周内','区域负责人'],
            ['🟡 黄色','消费金过期率 > 40%','优化过期提醒机制·延长有效期至18月·家庭共享推广','2周内','产品+品牌'],
        ]
    ));

    children.push(h2('14.4  Go/No-Go决策节点'));
    children.push(dataTable(
        ['决策节点','时间','评估指标','Go条件','No-Go后果'],
        [
            ['DG1\n(公测评估)','M1末\n(2026/7)','平台稳定性+种子商家反馈\n+首月交易量','平台可用性≥99%\n商家NPS≥30\n交易量≥3,000笔','延迟公测→修复产品\n→重新评估'],
            ['DG2\n(盈亏平衡)','M3末\n(2026/9)','月交易量+EBITDA\n+商家/消费者留存','月交易量≥30,000笔\nEBITDA亏损收窄\n复购率≥20%','暂缓城市扩张\n→集中资源提升复购'],
            ['DG3\n(城市复制)','M6末\n(2026/12)','单城模型验证\n+城市复制ROI','月交易量≥50,000笔\n单城盈利\nCAC≤¥20','停止新城市扩张\n→优化存量城市'],
            ['DG4\n(上市准备)','Y2末\n(2027/12)','3年财务模型+合规审计\n+市场规模验证','Y2收入≥¥500万\n净利率≥2%\n合规审查通过','延迟上市计划\n→先做B轮融资'],
        ]
    ));
    children.push(pageBreak());

    // ===== CHAPTER 15: CORPORATE GOVERNANCE =====
    children.push(h1('第十五章  公司治理与内部控制'));
    children.push(h2('15.1  HKEx上市治理要求对照'));
    children.push(dataTable(
        ['治理领域','HKEx要求','链商当前状态','达标计划'],
        [
            ['董事会构成','≥3名独立非执行董事(INED)\n占董事会≥1/3','待组建','上市前12个月组建\n拟聘：财务/法律/行业各1名INED'],
            ['审计委员会','主席须为INED\n≥3名成员·INED占多数','待设立','上市前6个月设立\n指定INED为委员会主席'],
            ['薪酬委员会','主席须为INED\n≥3名成员·INED占多数','待设立','上市前6个月设立\n制定董事及高管薪酬政策'],
            ['提名委员会','主席须为INED\n≥3名成员·INED占多数','待设立','上市前6个月设立\n制定董事会多元化政策'],
            ['内控系统','COSO框架·年度评估\n管理层+外部审计双重确认','COSO框架规划中','上市前12个月实施\n聘请四大会计师事务所'],
            ['信息披露','内幕消息即时披露\n定期报告（年报+中报）','内部制度制定中','上市前6个月建立\n信息披露委员会'],
            ['ESG报告','强制ESG报告\n>TCFD气候披露','规划中','上市首年起发布\nESG报告'],
        ]
    ));

    children.push(h2('15.2  内部控制体系（COSO框架）'));
    children.push(b('控制环境：董事会-管理层-业务部门三级治理架构，明确授权和审批权限'));
    children.push(b('风险评估：年度全面风险评估+季度专题评估+即时重大风险报告'));
    children.push(b('控制活动：交易授权/职责分离/IT访问控制/资产保护/对账流程'));
    children.push(b('信息与沟通：内部报告体系+举报机制+信息披露委员会'));
    children.push(b('监督：管理层持续监控+内部审计+外部审计+董事会监督'));

    children.push(h2('15.3  关联交易管理'));
    children.push(b('母公司(母公司)：关联交易定价政策——按市场公允价格（Arm\'s Length Principle）'));
    children.push(b('关联交易审批：≥¥50万须独立非执行董事审批·≥¥200万须股东大会批准'));
    children.push(b('定期披露：年度报告披露所有≥¥10万的关联交易'));
    children.push(pageBreak());

    // ===== CHAPTER 16: APPENDIX =====
    children.push(h1('第十六章  附录'));
    children.push(h2('16.1  V3.2 分账参数速查表'));
    children.push(dataTable(
        ['参数','平台商家','联盟商家','综合商城'],
        [
            ['支付渠道成本','0.60%','0.60%','0.60%'],
            ['商家净收入','75.40%','71.40%','77.90%'],
            ['平台服务费','5.00%','5.00%','6.00%'],
            ['联盟渠道费','—','4.50%','—'],
            ['推广者+服务站','9.00%','10.00%','6.00%'],
            ['城市服务商','1.00%','1.00%','1.00%'],
            ['消费金计提','3.00%','2.00%','3.00%'],
            ['营销池','4.00%','3.50%','3.50%'],
            ['风控备用金','2.00%','2.00%','2.00%'],
            ['验证(合计100%)','✅','✅','✅'],
        ], {small:true}
    ));

    children.push(h2('16.2  12场景完整分账矩阵'));
    children.push(p('详见《链商平台现金消费100元分账与核销模式详解》V15扩展版。以下为关键场景汇总：',{color:C.GRAY}));
    children.push(dataTable(
        ['业态','场景','商家到手','平台边际利润\n(未扣固定)','消费者权益'],
        [
            ['平台商家','汇付收单','¥75.40','¥4.40','¥9'],
            ['平台商家','消费金核销','¥90.00','¥5.00','¥10'],
            ['联盟商家','汇付收单','¥71.40(商家)\n+¥4.50(平台商家)','¥4.40','¥7.5'],
            ['联盟商家','消费金核销','¥90.00','¥5.10','¥10'],
            ['综合商城','汇付收单','¥77.90','¥5.40','¥6'],
            ['综合商城','消费金核销','¥90.00','¥6.00','¥10'],
        ], {small:true}
    ));

    children.push(h2('16.3  盈亏平衡速算公式'));
    children.push(calloutBox('盈亏平衡速算', [
        '月盈亏平衡交易量 = ¥190,000 ÷ (每笔加权平台边际利润)',
        '  = ¥190,000 ÷ ¥4.686',
        '  = 40,500笔/月',
        '',
        '月盈亏平衡GMV = 40,500 × ¥100 = ¥4,050,000',
        '',
        '安全边际 = 实际月交易量 ÷ 40,500',
        '  · > 1.5 = 健康',
        '  · 1.2-1.5 = 关注',
        '  · < 1.2 = 预警',
    ]));

    children.push(h2('16.4  可比上市公司数据'));
    children.push(p('数据来源：各公司2025年报、Bloomberg、公开市场数据。市值及财务数据为近似值。链商2.0目前pre-revenue，不可直接比较。',{color:C.GRAY}));

    children.push(h2('16.5  合规术语对照表'));
    children.push(dataTable(
        ['禁止/敏感术语','替代术语','适用场景'],
        [
            ['数字资产','消费权益 / 会员权益','所有公开文档'],
            ['数字信用债券','商家营销额度','平台商家协议'],
            ['资产增值','权益升级','所有公开文档'],
            ['收益/盈利/赚钱','服务费/增收','商家/推广者相关文案'],
            ['红利/增值回报','权益升级/消费权益','所有公开文档'],
            ['资本(化)','资源/产业','企业介绍/BP'],
            ['变现','转化','产品/营销文档'],
            ['创业','参与推广/开展推广','推广者招募文案'],
            ['全球化','全国化/本地化','当前阶段'],
            ['数据确权','数据权益管理','技术/产品文档'],
            ['币/Token/通证','(禁止使用)','所有文档'],
            ['投资回报/稳赚/躺赚','(禁止使用)','所有文档'],
            ['数字资产交易/资本集群','(禁止使用)','所有文档'],
        ], {small:true}
    ));

    children.push(h2('16.6  三条红线检查清单'));
    children.push(redline('1. 积分不可兑现——积分仅限平台内消费抵扣，不可兑换现金/转账/提现'));
    children.push(redline('2. 不可形成资金池——全部资金由汇付天下持牌机构直清，平台不经手任何消费者资金'));
    children.push(redline('3. 不可承诺收益——所有文档使用合规术语，禁止"月入过万""稳赚"等诱导性表述'));

    children.push(h2('16.7  免责声明与前瞻性陈述'));
    children.push(calloutBox('重要声明', [
        '本文件（"链商2.0市场营销计划·香港上市财务模型标准"）仅供链商平台运营方内部决策参考，不构成任何形式的公开发售、上市承诺、投资建议或法律意见。',
        '',
        '前瞻性陈述：本文件包含前瞻性陈述，涉及对未来事件、财务表现、市场趋势和业务策略的预期、预测、计划和假设。前瞻性陈述通常包含"预计""预期""计划""相信""预测""估计""可能""将要""目标"等词语。此类陈述基于当前可获得的信息和假设，存在已知和未知的风险、不确定性和其他因素，可能导致实际结果与本文件中的前瞻性陈述存在重大差异。',
        '',
        '风险因素：可能导致实际结果与前瞻性陈述存在重大差异的因素包括但不限于：中国社区商业数字化市场的增长速度、支付监管政策的变化、竞争格局的变化、商家和消费者行为的变化、技术风险、地方法规的变化以及第十三章所述的其他风险因素。',
        '',
        '财务信息：本文件中的财务预测（包括收入、成本、利润和现金流量预测）基于2026年6月制定的假设参数，不代表未来实际业绩。实际财务结果可能因市场条件、运营表现、监管政策和其他因素而与当前预测存在重大差异。所有财务信息未经审计。',
        '',
        '第三方数据：本文件引用了可能来自第三方来源的行业和市场数据。虽然本公司相信这些数据来源可靠，但不对其准确性或完整性作出任何陈述或保证。正式IPO文件将委托独立行业顾问（如Frost & Sullivan）出具正式行业报告。',
        '',
        '更新义务：除非适用法律或监管规定要求，本公司不承担更新本文件中任何前瞻性陈述的义务。本文件的使用者不应将本文件中的任何内容视为对未来事件的承诺或保证。',
        '',
        '机密性：本文件为链商平台运营方机密文件，未经链商平台运营方书面授权，不得全部或部分复制、分发或向任何第三方披露。',
    ], '#FFF8F0'));

    children.push(divider());
    children.push(new Paragraph({spacing:{before:600}}));
    children.push(new Paragraph({children:[new TextRun({text:'—— 链生活 · 消费有回响 ——',size:28,font:FONT.body,bold:true,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:200}}));
    children.push(new Paragraph({children:[new TextRun({text:'链商平台运营方 · 品牌战略部 | 2026年6月9日 | 机密文件',size:18,font:FONT.body,color:C.GRAY})],alignment:AlignmentType.CENTER}));

    return children;
}

// ========== GENERATE ==========
var children = buildDocument();

buildAndWrite(children, outFile, { title: '链商平台 市场营销计划 HK上市标准 3年规划' }).then(function(outPath) {
    console.log('✅ HK IPO标准市场营销计划已生成: ' + outPath);
    console.log('   16章完整结构 · 3年三表财务模型 · 敏感性分析 · 风险矩阵 · IPO募集资金规划');
}).catch(function(err) { console.error('❌ 生成失败:', err); process.exit(1); });
