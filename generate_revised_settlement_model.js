const docx = require('docx');
const fs = require('fs');
const path = require('path');

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType, PageBreak } = docx;

const C = {
    MAIN:'#1A5276', DARK:'#2C3E50', LIGHT:'#EBF5FB', WHITE:'#FFFFFF',
    BLACK:'#333333', GRAY:'#7F8C8D', RED:'#C0392B', GREEN:'#1E8449',
    ORANGE:'#E67E22', HEADER:'#1a1a2e', YELLOW:'#F39C12',
};

const outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
const outFile = path.join(outDir, '链商平台_修订版分润核销模型_V2.0.docx');

// ========== HELPERS ==========
function h1(t) { return new Paragraph({ text:t, heading:HeadingLevel.HEADING_1, spacing:{before:400,after:200}, border:{bottom:{style:BorderStyle.SINGLE,size:2,color:C.MAIN}} }); }
function h2(t) { return new Paragraph({ text:t, heading:HeadingLevel.HEADING_2, spacing:{before:300,after:150} }); }
function h3(t) { return new Paragraph({ text:t, heading:HeadingLevel.HEADING_3, spacing:{before:200,after:100} }); }
function p(t,o) { o=o||{}; return new Paragraph({ children:[new TextRun({text:t,size:21,font:'微软雅黑',...o})], spacing:{after:80,line:360} }); }
function b(t,o) { o=o||{}; return new Paragraph({ children:[new TextRun({text:'  • '+t,size:21,font:'微软雅黑',...o})], spacing:{after:60,line:340}, indent:{left:600} }); }
function n(i,t,o) { o=o||{}; return new Paragraph({ children:[new TextRun({text:i+'. '+t,size:21,font:'微软雅黑',...o})], spacing:{after:60,line:340}, indent:{left:600} }); }
function divider() { return new Paragraph({spacing:{after:200},children:[]}); }
function pageBreak() { return new Paragraph({children:[new PageBreak()]}); }

function infoTable(rows) {
    return new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:rows.map(function(kv){return new TableRow({children:[
        new TableCell({width:{size:18,type:WidthType.PERCENTAGE},shading:{fill:C.LIGHT},children:[new Paragraph({children:[new TextRun({text:kv[0],size:20,font:'微软雅黑',bold:true,color:C.MAIN})],alignment:AlignmentType.RIGHT,spacing:{before:30,after:30}})]}),
        new TableCell({width:{size:82,type:WidthType.PERCENTAGE},children:[new Paragraph({children:[new TextRun({text:kv[1],size:20,font:'微软雅黑'})],spacing:{before:30,after:30}})]}),
    ]})})});
}

function dataTable(headers, rows, opts) {
    opts = opts || {};
    var hdrRow = new TableRow({children: headers.map(function(h){return new TableCell({shading:{fill:C.HEADER},children:[new Paragraph({children:[new TextRun({text:h,size:opts.small?17:19,font:'微软雅黑',bold:true,color:C.WHITE})],alignment:AlignmentType.CENTER,spacing:{before:20,after:20}})]})})});
    var dataRows = rows.map(function(r,i){return new TableRow({children: r.map(function(c){return new TableCell({shading:i%2===0?{fill:C.LIGHT}:undefined,children:[new Paragraph({children:[new TextRun({text:String(c||'—'),size:opts.small?16:18,font:'微软雅黑'})],spacing:{before:15,after:15}})]})})})});
    return new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[hdrRow].concat(dataRows)});
}

function flowBox(text, isRed) {
    return new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
        new TableRow({children:[new TableCell({shading:{fill:isRed?'#FFF5F5':C.LIGHT},children:[new Paragraph({children:[new TextRun({text:text,size:18,font:'微软雅黑',bold:isRed,color:isRed?C.RED:C.DARK})],spacing:{before:15,after:15},alignment:AlignmentType.CENTER})],border:{top:{style:BorderStyle.SINGLE,size:1,color:isRed?C.RED:C.MAIN},bottom:{style:BorderStyle.SINGLE,size:1,color:isRed?C.RED:C.MAIN}}})]}),
    ]});
}

function calloutBox(title, content, color) {
    var paras = [new Paragraph({children:[new TextRun({text:title,size:19,font:'微软雅黑',bold:true,color:C.MAIN})],spacing:{before:15,after:5}})];
    for (var i = 0; i < content.length; i++) {
        paras.push(new Paragraph({children:[new TextRun({text:'  '+content[i],size:18,font:'微软雅黑'})],spacing:{after:4}}));
    }
    return new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[
        new TableRow({children:[new TableCell({
            shading:{fill:color||C.LIGHT},
            children: paras,
            border:{left:{style:BorderStyle.SINGLE,size:4,color:C.MAIN,space:6}},
            spacing:{before:15,after:15}
        })]})
    ]});
}

function redline(text) {
    return new Paragraph({
        children:[new TextRun({text:'⛔ '+text,size:21,font:'微软雅黑',bold:true,color:C.RED})],
        spacing:{after:80,line:360}, indent:{left:300},
        border:{left:{style:BorderStyle.SINGLE,size:6,color:C.RED,space:8}},
    });
}

// ========== MODEL PARAMETERS ==========
// Payment channel cost (WeChat/Alipay standard rate)
var CHANNEL_COST_RATE = 0.006;  // 0.6%
var WITHDRAW_COST_PER_TXN = 1;  // ¥1 per withdrawal

// Distribution ratios for each merchant type (of total consumer spend)
// All ratios sum to 100%

// Platform merchant scenario
var PLATFORM_RATIOS = {
    channelCost:    0.006,  // 0.60% 支付渠道成本
    merchant:       0.794,  // 79.40% 平台商家收入
    platformFee:    0.080,  // 8.00% 平台服务费
    promoter:       0.050,  // 5.00% 推广者佣金
    station:        0.040,  // 4.00% 服务站佣金
    consumerBenefit:0.030,  // 3.00% 消费者权益
};

// Alliance merchant scenario
var ALLIANCE_RATIOS = {
    channelCost:    0.006,  // 0.60%
    allianceMerchant:0.744, // 74.40% 联盟商家收入
    platformMerchant:0.050, // 5.00% 平台商家渠道费
    platformFee:    0.070,  // 7.00% 平台服务费
    promoter:       0.060,  // 6.00% 推广者佣金
    station:        0.050,  // 5.00% 服务站佣金
    consumerBenefit:0.020,  // 2.00% 消费者权益
};

// Comprehensive e-commerce scenario
var ECOM_RATIOS = {
    channelCost:    0.006,  // 0.60%
    ecomMerchant:   0.824,  // 82.40% 综合电商收入
    platformFee:    0.080,  // 8.00% 平台服务费
    promoter:       0.040,  // 4.00% 推广者佣金
    station:        0.020,  // 2.00% 服务站佣金
    consumerBenefit:0.030,  // 3.00% 消费者权益
};

var CONSUME_AMOUNT = 100; // ¥100 base

function calc(ratios) {
    var result = {};
    var keys = Object.keys(ratios);
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = Math.round(CONSUME_AMOUNT * ratios[keys[i]] * 100) / 100;
    }
    return result;
}

function fmt(yuan) { return '¥' + yuan.toFixed(2); }

var platCalc = calc(PLATFORM_RATIOS);
var allianceCalc = calc(ALLIANCE_RATIOS);
var ecomCalc = calc(ECOM_RATIOS);

// ========== PLATFORM METRICS ==========
// Assume: 1 consumer at each of 3 merchant types, each spending ¥100
var totalGMV = CONSUME_AMOUNT * 3; // ¥300
var platRevenue = platCalc.platformFee + allianceCalc.platformFee + ecomCalc.platformFee;
var platChannelCost = platCalc.channelCost + allianceCalc.channelCost + ecomCalc.channelCost;
var platGrossProfit = platRevenue - platChannelCost;

// Assumed fixed costs (monthly, scaled to per-transaction)
var monthlyFixedCosts = {
    techInfra: 50000,    // cloud servers, CDN, database
    staff: 80000,        // tech + operations + brand team (5-8 people)
    office: 20000,       // office rent + utilities
    marketing: 30000,    // brand marketing
    compliance: 10000,   // legal + compliance
};
var totalMonthlyFixed = 0;
var costKeys = Object.keys(monthlyFixedCosts);
for (var i = 0; i < costKeys.length; i++) {
    totalMonthlyFixed += monthlyFixedCosts[costKeys[i]];
}
// Assume 50,000 transactions per month for break-even analysis
var assumedMonthlyTxns = 50000;
var fixedCostPerTxn = totalMonthlyFixed / assumedMonthlyTxns;

// ========== DOCUMENT ==========
var doc = new Document({
    styles:{default:{document:{run:{font:'微软雅黑',size:21}}}},
    sections:[{
        properties:{page:{margin:{top:1440,bottom:1440,left:1440,right:1440}}},
        children:[

            // ===== COVER =====
            new Paragraph({children:[new TextRun({text:'链商平台 · 链生活品牌',size:28,font:'微软雅黑',color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:40}}),
            new Paragraph({children:[new TextRun({text:'修订版分润与核销模型',size:40,font:'微软雅黑',bold:true,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:20}}),
            new Paragraph({children:[new TextRun({text:'V2.0 —— 基于6月4日会议共识',size:28,font:'微软雅黑',bold:true,color:C.MAIN})],alignment:AlignmentType.CENTER,spacing:{after:30}}),
            new Paragraph({children:[new TextRun({text:'—— 无充值 · 无资金池 · 渠道成本扣除 · 六方利益分配 ——',size:20,font:'微软雅黑',color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:300}}),
            infoTable([
                ['文档性质','修订版分润核销模型 · 基于6月4日会议共识重新设计'],
                ['文档版本','V2.0'],
                ['编制日期','2026年6月4日'],
                ['编制人','梁君衡（企业宣传部）'],
                ['核心变更','① 取消充值板块 ② 扣除支付提现渠道成本 ③ 资金不经平台（汇付直清） ④ 新增推广者/服务站分润'],
                ['适用场景','消费者在平台商家 / 联盟商家 / 综合商城各消费¥100'],
                ['关联文档','《分账与核销模型分析报告 V1.0》《法律合规框架》《品牌执行手册》'],
            ]),
            divider(),

            // ===== 一、核心变更 =====
            h1('第一章  会议共识与核心变更'),

            h2('1.1  与 V1.0 模型的四大区别'),
            dataTable(
                ['变更项','V1.0（6月3日分析版）','V2.0（6月4日会议共识）','变更理由'],
                [
                    ['充值板块','平台商家/联盟商家/综合电商\n各有充值场景（4个子模型）','充值板块全部取消\n仅保留消费场景','充值资金涉嫌“资金池”，且充值场景中联盟商家分账为0%的逻辑缺陷无法修复，直接取消'],
                    ['资金流转','链邦备付金账户作为中转枢纽\n平台先收款→再分账','汇付监管账户直接分账到各方\n平台不经手资金','合规红线第2条：不可形成资金池'],
                    ['分润方','平台商家/联盟商家/综合电商\n+链商金融备付','消费者 + 商家 + 平台 + 推广者\n+ 服务站 + 支付渠道 六方分配','新增推广者和服务站两个利益方，体现社区裂变模式'],
                    ['渠道成本','未计入模型','明确扣除 0.6% 支付渠道费\n+¥1/笔提现费','实际经营硬成本，必须计入模型'],
                ]
            ),
            divider(),

            h2('1.2  新模型设计原则'),
            n(1,'零资金停留：消费者付款→汇付监管账户→实时直清到各方汇付商户号，平台在任何环节不触碰资金',{bold:true}),
            n(2,'硬成本优先扣除：支付渠道费（0.6%）作为第一优先级从交易额中扣除，剩余金额按比例分配',{bold:true}),
            n(3,'六方利益模型：每笔交易涉及消费者、商家、平台、推广者、服务站、支付渠道六个利益方',{bold:true}),
            n(4,'消费者权益可追踪：消费者获得的权益（让利）进入个人消费金账户，可在后续消费中核销，不可兑现',{bold:true}),
            divider(),
            pageBreak(),

            // ===== 二、资金流转路径 =====
            h1('第二章  资金流转路径（修订版）'),

            h2('2.1  当前架构（V1.0 × 已废弃）'),
            flowBox('消费者 ——付款——→ 链邦备付金账户（平台控制） ——分账——→ 各商家账户', true),
            p('⚠️ 已废弃：平台触碰资金，构成资金池 + 二清',{color:C.RED}),
            divider(),

            h2('2.2  新架构（V2.0 √ 会议共识）'),
            flowBox('消费者在商家小程序下单支付 ¥100', false),
            p('↓',{alignment:AlignmentType.CENTER}),
            flowBox('汇付天下监管账户（持牌支付机构托管）── 平台不经手资金', false),
            p('↓ 扣除支付渠道费 0.6%(¥0.60)',{alignment:AlignmentType.CENTER}),
            p('↓ 汇付按分账指令实时直清到各方汇付商户号',{alignment:AlignmentType.CENTER}),
            p('',{}),
            dataTable(
                ['收款方','平台商家场景','联盟商家场景','综合商城场景','结算周期'],
                [
                    ['支付渠道','¥0.60 (0.6%)','¥0.60 (0.6%)','¥0.60 (0.6%)','实时'],
                    ['商家','¥79.40','¥74.40','¥82.40','T+1'],
                    ['平台服务费','¥8.00','¥7.00','¥8.00','T+1'],
                    ['推广者佣金','¥5.00','¥6.00','¥4.00','T+1'],
                    ['服务站佣金','¥4.00','¥5.00','¥2.00','T+1'],
                    ['消费者权益','¥3.00','¥2.00','¥3.00','实时到账'],
                    ['合计','¥100.00','¥100.00','¥100.00','—'],
                ]
            ),
            divider(),

            h2('2.3  与 V1.0 的关键差异'),
            calloutBox('✅ 合规性提升', [
                '平台从“资金经手者”变为“分账指令传递者”，消除了资金池和二清风险',
                '“备付金账户”术语全部替换为“汇付监管分账账户”',
            ], C.LIGHT),
            divider(),
            pageBreak(),

            // ===== 三、三方场景详细模型 =====
            h1('第三章  三方消费场景详细模型'),
            p('假设条件：每位消费者各在平台商家、联盟商家、综合商城消费¥100。消费者权益进入个人消费金账户，可在下次消费核销。',{color:C.GRAY}),
            divider(),

            // Scenario A
            h2('3.1  场景A：消费者在平台商家消费 ¥100'),
            p('平台商家例如：老树根餐饮、玖玖餐饮。拥有独立主体小程序，是生态的核心节点。'),
            dataTable(
                ['利益方','角色定义','分配比例','分配金额','资金来源','结算方式'],
                [
                    ['① 支付渠道','微信/支付宝手续费','0.60%',fmt(platCalc.channelCost),'消费者支付额优先扣除','实时'],
                    ['② 平台商家','商品/服务的提供方','79.40%',fmt(platCalc.merchant),'消费者支付额','T+1到商家汇付商户号'],
                    ['③ 平台服务费','链商平台技术+运营服务','8.00%',fmt(platCalc.platformFee),'消费者支付额','T+1到链邦汇付商户号'],
                    ['④ 推广者佣金','引导消费者到店消费的推广人','5.00%',fmt(platCalc.promoter),'消费者支付额','T+1到推广者钱包'],
                    ['⑤ 服务站佣金','社区服务站（自提/配送/代客下单）','4.00%',fmt(platCalc.station),'消费者支付额','T+1到服务站钱包'],
                    ['⑥ 消费者权益','消费让利，进入个人消费金账户','3.00%',fmt(platCalc.consumerBenefit),'消费者支付额','实时到消费金账户'],
                    ['合计','—','100%','¥100.00','—','—'],
                ]
            ),
            divider(),

            // Scenario B
            h2('3.2  场景B：消费者在联盟商家消费 ¥100'),
            p('联盟商家例如：XXX沐足、社区小店。围绕平台商家的中小商户，拥有独立店铺页和收银台。'),
            dataTable(
                ['利益方','角色定义','分配比例','分配金额','说明'],
                [
                    ['① 支付渠道','微信/支付宝手续费','0.60%',fmt(allianceCalc.channelCost),'优先扣除'],
                    ['② 联盟商家','商品/服务提供方','74.40%',fmt(allianceCalc.allianceMerchant),'联盟商家直接收入'],
                    ['③ 平台商家渠道费','联盟商家所属的平台商家\n（引流+管理抽成）','5.00%',fmt(allianceCalc.platformMerchant),'老树根/玖玖等平台商家渠道费'],
                    ['④ 平台服务费','链商平台技术+运营','7.00%',fmt(allianceCalc.platformFee),'比平台商家场景低1个点'],
                    ['⑤ 推广者佣金','推广引流奖励','6.00%',fmt(allianceCalc.promoter),'联盟商家推广难度更大，佣金略高'],
                    ['⑥ 服务站佣金','社区服务站','5.00%',fmt(allianceCalc.station),'联盟商家更依赖服务站履约'],
                    ['⑦ 消费者权益','消费让利','2.00%',fmt(allianceCalc.consumerBenefit),'联盟商家利润空间较小，让利比例略低'],
                    ['合计','—','100%','¥100.00','—'],
                ]
            ),
            divider(),

            // Scenario C
            h2('3.3  场景C：消费者在综合商城消费 ¥100'),
            p('综合商城是链邦直营的电商业务（链邦子户），没有中间平台商家环节，结构最简单。'),
            dataTable(
                ['利益方','角色定义','分配比例','分配金额','说明'],
                [
                    ['① 支付渠道','微信/支付宝手续费','0.60%',fmt(ecomCalc.channelCost),'优先扣除'],
                    ['② 综合商城','链邦直营电商收入','82.40%',fmt(ecomCalc.ecomMerchant),'最高商家分成'],
                    ['③ 平台服务费','链商平台技术+运营','8.00%',fmt(ecomCalc.platformFee),'与平台商家场景持平'],
                    ['④ 推广者佣金','推广引流奖励','4.00%',fmt(ecomCalc.promoter),'电商自带流量，推广依赖较低'],
                    ['⑤ 服务站佣金','社区服务站','2.00%',fmt(ecomCalc.station),'电商场景服务站参与度较低'],
                    ['⑥ 消费者权益','消费让利','3.00%',fmt(ecomCalc.consumerBenefit),'与平台商家场景持平'],
                    ['合计','—','100%','¥100.00','—'],
                ]
            ),
            divider(),
            pageBreak(),

            // ===== 四、利益关系图 =====
            h1('第四章  六方利益关系图'),

            h2('4.1  利益流向图（以平台商家场景为例）'),
            p('消费者支付¥100 → 汇付监管账户 → 扣除渠道费¥0.60 → 剩余¥99.40分配：'),
            p(''),
            dataTable(
                ['利益方','得到','利益形式','使用场景','不可用途'],
                [
                    ['消费者','¥3.00消费金 + 商品/服务','消费权益（让利）','下次消费核销、转让给家人','不可兑现、不可购买金融产品'],
                    ['平台商家','¥79.40现金收入','汇付商户号直接到账','提现、经营、采购','—'],
                    ['链商平台','¥8.00服务费收入','平台运营收入','技术开发、人员、运营','—'],
                    ['推广者','¥5.00佣金','推广奖励','提现、继续推广','不可跨级抽佣（避免传销争议）'],
                    ['服务站','¥4.00佣金','服务站运营收入','站点运营、自提、配送','—'],
                ]
            ),
            divider(),

            h2('4.2  各方激励机制'),
            dataTable(
                ['角色','激励目标','收入模式','预估月收入（50单/天）'],
                [
                    ['消费者','省钱 + 攒权益','每笔消费返让利 2-3%','¥45-90/月（按每天一笔消费）'],
                    ['推广者','分享赚佣金','每笔成交佣金 4-6%','¥600-900/月（按每天带来5单）'],
                    ['服务站','服务社区赚服务费','每笔订单服务费 2-5%','¥3,000-7,500/月（按每天50单）'],
                    ['平台商家','经营收入+联盟渠道费','直销 79% + 联盟抽 5%','取决于客单价和流量'],
                    ['链商平台','服务费收入','每笔交易 7-8%','取决于平台总GMV'],
                ]
            ),
            divider(),
            pageBreak(),

            // ===== 五、平台经营指标 =====
            h1('第五章  平台经营指标分析'),

            h2('5.1  单次交易模型（三场景合计）'),
            p('假设：一位消费者分别在三种商家各消费¥100，合计GMV ¥300。'),
            divider(),

            dataTable(
                ['指标','计算公式','数值','说明'],
                [
                    ['总GMV','¥100 × 3','¥300.00','三场景合计交易额'],
                    ['支付渠道成本','¥300 × 0.6%','¥1.80','硬成本，不可避免'],
                    ['平台服务费收入','¥8.00 + ¥7.00 + ¥8.00','¥23.00','平台主营收入'],
                    ['平台毛利润','¥23.00 - ¥1.80','¥21.20','服务费收入 - 渠道成本'],
                    ['平台毛利率','¥21.20 / ¥300.00','7.07%','毛利 / GMV'],
                    ['平台抽成率(Take Rate)','¥23.00 / ¥300.00','7.67%','行业对标：美团 15-25%、抖音 2-5%'],
                ]
            ),
            divider(),

            h2('5.2  月度盈亏模型'),
            p('假设：平台每月50,000笔交易，客单价¥100，三种商家类型各卣三分之一。'),
            divider(),

            dataTable(
                ['指标','计算公式','月度数值','年度数值'],
                [
                    ['月GMV','50,000 × ¥100','¥5,000,000','¥60,000,000'],
                    ['支付渠道成本','GMV × 0.6%','-¥30,000','-¥360,000'],
                    ['平台服务费收入','GMV × 7.67%','+¥383,500','+¥4,602,000'],
                    ['毛利润','服务费 - 渠道费','¥353,500','¥4,242,000'],
                    ['固定成本合计','技术+人员+办公+营销+合规','-¥190,000','-¥2,280,000'],
                    ['  其中：技术基础设施','云服务器/CDN/数据库','-¥50,000','-¥600,000'],
                    ['  其中：人员成本','5-8人团队','-¥80,000','-¥960,000'],
                    ['  其中：办公场地','—','-¥20,000','-¥240,000'],
                    ['  其中：品牌营销','—','-¥30,000','-¥360,000'],
                    ['  其中：法务合规','—','-¥10,000','-¥120,000'],
                    ['净利润','毛利 - 固定成本','¥163,500','¥1,962,000'],
                    ['净利率','净利润 / GMV','3.27%','3.27%'],
                ]
            ),
            divider(),

            h2('5.3  盈亏平衡点分析'),
            dataTable(
                ['指标','数值','说明'],
                [
                    ['每笔交易平台毛利','¥7.07','平均每笔GMV¥100时的毛利润'],
                    ['每笔交易固定成本','¥3.80','¥190,000 / 50,000笔'],
                    ['每笔交易净利润','¥3.27','¥7.07 - ¥3.80'],
                    ['盈亏平衡点','26,864笔/月','¥190,000 / ¥7.07'],
                    ['盈亏平衡GMV','¥2,686,400/月','26,864 × ¥100'],
                    ['安全边际（距盈亏平衡点乘数）','1.86×','50,000 / 26,864'],
                ]
            ),
            p('结论：在客单价¥100、月交易量50,000笔的假设下，平台月度净利润约¥16.35万，净利率3.27%。盈亏平衡点为月交易量26,864笔。当前预测交易量为平衡点的1.86倍，存在安全边际。',{bold:true}),
            pageBreak(),

            // ===== 六、提现与核销 =====
            h1('第六章  提现与核销体系'),

            h2('6.1  各方提现规则'),
            dataTable(
                ['角色','提现对象','提现成本','最低提现额','结算周期','到账时效'],
                [
                    ['商家','商品收入 + 渠道费收入','¥1/笔','¥1','T+1','T+1 12:00前'],
                    ['推广者','推广佣金','¥1/笔','¥1','T+1','T+1 12:00前'],
                    ['服务站','服务站佣金','¥1/笔','¥1','T+1','T+1 12:00前'],
                    ['平台','平台服务费','¥1/笔','¥1','T+1','T+1 12:00前'],
                    ['消费者','消费权益（让利）','不可提现','—','—','仅限消费核销'],
                ]
            ),
            divider(),

            h2('6.2  消费金核销体系'),
            p('消费者获得的消费权益（让利）进入个人消费金账户，可在任何场景的下次消费中核销。'),
            dataTable(
                ['场景','规则','例子'],
                [
                    ['消费金获得','每笔消费自动获得让利，实时到账','消费¥100 → 得¥3消费金'],
                    ['消费金核销','下次消费时可抵扣，最高抵扣订单金额的30%','消费¥100 → 最多用¥30消费金抵扣'],
                    ['消费金转让','可转让给直系亲属（父母/配偶/子女）','—'],
                    ['消费金过期','获得后12个月有效，过期自动失效','—'],
                    ['不可用途','不可兑现、不可购买金融产品、不可转让给非直系亲属','合规红线第1条'],
                ]
            ),
            divider(),
            pageBreak(),

            // ===== 七、参数调优 =====
            h1('第七章  参数调优与敏感性分析'),

            h2('7.1  可调参数一览'),
            dataTable(
                ['参数','当前值','可调范围','调整影响','调整权限'],
                [
                    ['支付渠道费率','0.6%','0.38%-1.0%','影响所有方分配基数','不可调（微信/支付宝定价）'],
                    ['平台服务费率','7-8%','5-10%','直接影响平台收入和盈亏平衡点','管理层审批'],
                    ['推广者佣金率','4-6%','3-8%','影响推广动力和商家收入','运营部门'],
                    ['服务站佣金率','2-5%','1-6%','影响服务站参与度','运营部门'],
                    ['消费者让利率','2-3%','1-5%','影响消费者复购率','品牌部门'],
                    ['平台商家渠道费率','5%','3-8%','影响平台商家招募联盟商家的动力','商务部门'],
                ]
            ),
            divider(),

            h2('7.2  敏感性分析：平台服务费率 ±1%'),
            dataTable(
                ['服务费率','每笔平台收入','月度收入（5万笔）','月度净利润','盈亏平衡点'],
                [
                    ['6.67%（-1%）','¥6.67','¥333,500','¥113,500','32,892笔/月'],
                    ['7.67%（当前）','¥7.67','¥383,500','¥163,500','26,864笔/月'],
                    ['8.67%（+1%）','¥8.67','¥433,500','¥213,500','22,700笔/月'],
                ]
            ),
            p('分析：平台服务费率每提升1个百分点，月度净利润增加¥50,000，盈亏平衡点下降约4,164笔/月。',{bold:true}),
            divider(),
            pageBreak(),

            // ===== 八、与V1.0对照 =====
            h1('第八章  新旧模型对照'),

            h2('8.1  一笔交易的利益分配对比'),
            p('以平台商家消费¥100为例：'),
            dataTable(
                ['利益方','V1.0模型','V2.0模型','变化'],
                [
                    ['支付渠道','未计入','¥0.60 (0.6%)','★ 新增硬成本'],
                    ['商家收入','¥82.40 (82.4%)','¥79.40 (79.4%)','-3.0%（让给推广者+服务站+渠道）'],
                    ['平台服务费','¥17.60 (17.6%)\n（含“备付金”）','¥8.00 (8.0%)','-9.6%（去除备付金模式）'],
                    ['推广者佣金','—','¥5.00 (5.0%)','★ 新增'],
                    ['服务站佣金','—','¥4.00 (4.0%)','★ 新增'],
                    ['消费者权益','—','¥3.00 (3.0%)','★ 新增明确分配'],
                ]
            ),
            divider(),

            h2('8.2  合规状态对比'),
            dataTable(
                ['合规红线','V1.0状态','V2.0状态'],
                [
                    ['① 积分不可兑现','✅ 合规','✅ 合规（消费金仅限核销）'],
                    ['② 不可形成资金池','❌ 备付金账户涉嫌资金池','✅ 合规（汇付直清，平台不经手资金）'],
                    ['③ 不可承诺收益','✅ 合规','✅ 合规'],
                ]
            ),
            divider(),
            pageBreak(),

            // ===== 附录 =====
            h1('附录A  术语规范'),
            dataTable(
                ['废弃术语','替代术语','原因'],
                [
                    ['备付金','平台营销额度','避免与央行备付金混淆'],
                    ['链商金融','链商平台服务','去除“金融”暗示'],
                    ['消费福利','消费让利','“福利”可能被误解为固定承诺'],
                    ['分润','分账/消费让利分配','“分润”可能涉嫌收益承诺'],
                    ['链商金融备付分账比率','平台服务费率','精确描述业务本质'],
                    ['资管核销分账','消费让利分配','去除“资管”暗示'],
                ]
            ),
            divider(),

            h1('附录B  参数调整记录表'),
            dataTable(
                ['日期','版本','调整内容','调整原因','审批人'],
                [
                    ['2026/6/4','V2.0','取消充值板块，新增推广者/服务站分账，扣除渠道成本','6/4会议共识','待确认'],
                    ['','','','',''],
                    ['','','','',''],
                ]
            ),
            divider(),
            divider(),

            new Paragraph({children:[new TextRun({text:'—— 文档结束 ——',size:18,font:'微软雅黑',color:C.GRAY,italics:true})],alignment:AlignmentType.CENTER,spacing:{before:200}}),
            new Paragraph({children:[new TextRun({text:'本报告基于6月4日会议共识编制，所有分配比例均为建议值，可根据实际运营数据调优。',size:16,font:'微软雅黑',color:C.GRAY})],alignment:AlignmentType.CENTER,spacing:{after:20}}),
            new Paragraph({children:[new TextRun({text:'各方分配比例调整需经运营提案→品牌评估→技术确认→法务审核→管理层审批。',size:16,font:'微软雅黑',color:C.GRAY})],alignment:AlignmentType.CENTER}),

        ]} // end children
    ]} // end sections
); // end Document

// ========== GENERATE ==========
Packer.toBuffer(doc).then(function(buf) {
    fs.writeFileSync(outFile, buf);
    console.log('✅ 生成完成: ' + outFile);
    console.log('   文件大小: ' + (buf.length / 1024).toFixed(0) + ' KB');
}).catch(function(e) { console.error(e); });
