// =============================================================================
// generate_marketing_toolkit.js
// 链邦赋商通（链商2.0）市场拓展营销工具包 V1.0
//
// 覆盖全层级工具：地推人员 → 市场部/BD → 招商会专用
// 5大部分 · 21个章节 · 单文件输出
//
// 输出：20260615 市场拓展营销工具包/链邦赋商通_市场拓展营销工具包_V1.0.docx
// =============================================================================

// ========== IMPORTS ==========
const {
    C, BRAND, h1, h2, h3, p, b, n,
    divider, pageBreak, spacer,
    dataTable, infoTable,
    flowBox, calloutBox, calloutInline,
    redline, greenCheck,
    fmt, pct, pct1,
    complianceScan, createDoc, buildAndWrite,
    docx, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType
} = require('./lib/docx-helpers');

const {
    MODEL, CHANNEL, PLATFORM_DIST, ALLIANCE_DIST, ECOMMERCE_DIST,
    MARKETING, MANAGEMENT, FINANCIAL,
    COLORS, STORE_TIER,
    COMPLIANCE_MAP, COMPLIANCE_FORBIDDEN, COMPLIANCE_REDLINES,
    FONT, META,
} = require('./lib/constants');

const path = require('path');
const fs = require('fs');

// ========== OUTPUT CONFIG ==========
const OUT_DIR_NAME = '20260615 市场拓展营销工具包';
const OUT_FILE_NAME = '链邦赋商通_市场拓展营销工具包_V1.0.docx';
const OUT_DIR = path.join(__dirname, OUT_DIR_NAME);
const OUT_FILE = path.join(OUT_DIR, OUT_FILE_NAME);
const DOC_TITLE = '链邦赋商通（链商2.0）市场拓展营销工具包';

// ========== CUSTOM HELPERS ==========

// Helper 1: Script Dialog Table — for B1 door-to-door scripts
// rows: Array of [step, speaker, lineText, tip]
function scriptDialog(rows, opts) {
    opts = opts || {};
    var headerColor = opts.headerColor || C.HEADER;
    var borderColor = opts.borderColor || C.MAIN;

    // Header row
    var headerCells = ['环节', '角色', '话术内容', '注意事项'].map(function(t) {
        return new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text: t, bold: true, color: C.WHITE, size: 18, font: FONT.body })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 }
            })],
            width: t === '话术内容' ? { size: 4200, type: WidthType.DXA }
                 : t === '注意事项' ? { size: 2000, type: WidthType.DXA }
                 : { size: 1200, type: WidthType.DXA },
            shading: { fill: headerColor, type: ShadingType.CLEAR }
        });
    });

    var tableRows = [new TableRow({ children: headerCells, tableHeader: true })];

    rows.forEach(function(row, idx) {
        var bg = idx % 2 === 0 ? C.LIGHT : C.WHITE;
        var cells = [
            // Step
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: String(row[0]), color: C.MAIN, bold: true, size: 17, font: FONT.body })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 30, after: 30 }
                })],
                width: { size: 1200, type: WidthType.DXA },
                shading: { fill: bg, type: ShadingType.CLEAR }
            }),
            // Speaker
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: row[1], color: C.DARK, bold: true, size: 17, font: FONT.body })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 30, after: 30 }
                })],
                width: { size: 1200, type: WidthType.DXA },
                shading: { fill: bg, type: ShadingType.CLEAR }
            }),
            // Script line
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: row[2], color: C.BLACK, size: 17, font: FONT.body })],
                    spacing: { before: 30, after: 30 }
                })],
                width: { size: 4200, type: WidthType.DXA },
                shading: { fill: bg, type: ShadingType.CLEAR }
            }),
            // Tip
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: row[3] || '', color: C.GRAY, size: 16, font: FONT.body, italics: true })],
                    spacing: { before: 30, after: 30 }
                })],
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: bg, type: ShadingType.CLEAR }
            })
        ];
        tableRows.push(new TableRow({ children: cells }));
    });

    return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
    });
}

// Helper 2: Phase Card — colored header banner + bulleted content
// items: Array of strings (bullet points)
function phaseCard(title, period, items, color) {
    color = color || C.MAIN;
    var children = [];

    // Banner header
    children.push(new Paragraph({
        children: [new TextRun({ text: title, bold: true, color: C.WHITE, size: 24, font: FONT.body })],
        spacing: { before: 200, after: 80 },
        indent: { left: 300 }
    }));
    if (period) {
        children.push(new Paragraph({
            children: [new TextRun({ text: period, color: C.WHITE, size: 18, font: FONT.body, italics: true })],
            spacing: { before: 0, after: 120 },
            indent: { left: 300 }
        }));
    }

    var headerCell = new TableCell({
        children: children,
        shading: { fill: color, type: ShadingType.CLEAR },
        width: { size: 100, type: WidthType.PERCENTAGE }
    });

    var rows = [new TableRow({ children: [headerCell] })];

    // Content rows with bullets
    items.forEach(function(item, idx) {
        var bg = idx % 2 === 0 ? C.WHITE : C.LIGHT;
        var cell = new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text: '▸  ' + item, color: C.BLACK, size: 19, font: FONT.body })],
                spacing: { before: 50, after: 50 },
                indent: { left: 300 }
            })],
            shading: { fill: bg, type: ShadingType.CLEAR },
            width: { size: 100, type: WidthType.PERCENTAGE }
        });
        rows.push(new TableRow({ children: [cell] }));
    });

    return new Table({
        rows: rows,
        width: { size: 100, type: WidthType.PERCENTAGE }
    });
}

// Helper 3: FAQ Block — grouped Q&A section
// faqs: Array of [question, answer] pairs
function faqBlock(title, faqs, color) {
    color = color || C.MAIN;
    var children = [];

    // Section header
    children.push(new Paragraph({
        children: [new TextRun({ text: '▌' + title, bold: true, color: color, size: 22, font: FONT.body })],
        spacing: { before: 300, after: 200 }
    }));

    faqs.forEach(function(faq, idx) {
        // Q
        children.push(new Paragraph({
            children: [
                new TextRun({ text: 'Q' + (idx + 1) + '. ', bold: true, color: C.MAIN, size: 20, font: FONT.body }),
                new TextRun({ text: faq[0], bold: true, color: C.DARK, size: 20, font: FONT.body })
            ],
            spacing: { before: 160, after: 60 },
            indent: { left: 200 }
        }));
        // A
        children.push(new Paragraph({
            children: [new TextRun({ text: faq[1], color: C.BLACK, size: 19, font: FONT.body })],
            spacing: { before: 0, after: 120 },
            indent: { left: 500 }
        }));
    });

    return children;
}

// ========== PART DIVIDER ==========
function buildPartDivider(partLabel, partTitle, partSubtitle, color) {
    color = color || C.MAIN;
    return [].concat(
        pageBreak(),
        spacer(600),
        new Paragraph({
            children: [new TextRun({ text: partLabel, bold: true, color: color, size: 28, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 100 }
        }),
        divider(),
        new Paragraph({
            children: [new TextRun({ text: partTitle, bold: true, color: C.DARK, size: 40, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: partSubtitle, color: C.GRAY, size: 22, font: FONT.body, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 }
        }),
        divider(),
        new Paragraph({
            children: [],
            border: { bottom: { color: color, size: 6, space: 1, style: BorderStyle.SINGLE } },
            spacing: { before: 0, after: 300 }
        })
    );
}

// ========== COVER PAGE ==========
function buildCover() {
    return [].concat(
        spacer(1200),
        new Paragraph({
            children: [new TextRun({ text: META.platform, bold: true, color: C.MAIN, size: 52, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '（' + META.platformLegacy + '）', color: C.GRAY, size: 24, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 }
        }),
        divider(),
        new Paragraph({
            children: [],
            border: { bottom: { color: BRAND.BRAND_RED, size: 4, space: 1, style: BorderStyle.SINGLE } },
            spacing: { before: 0, after: 400 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '市场拓展营销工具包', bold: true, color: C.DARK, size: 44, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: 'Marketing Toolkit for Market Expansion', color: C.GRAY, size: 22, font: FONT.body, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 600 }
        }),
        divider(),
        spacer(400),
        new Paragraph({
            children: [new TextRun({ text: 'V1.0  |  2026年6月15日', color: C.GRAY, size: 20, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: META.company, color: C.GRAY, size: 20, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: META.creator, color: C.GRAY, size: 20, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        spacer(400),
        divider(),
        new Paragraph({
            children: [new TextRun({ text: '适用角色：地推人员 · 市场部/BD · 招商会组织者 · 管理层', color: C.GRAY, size: 18, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '包含：话术脚本 · 数据表单 · 策略工具 · 流程清单 · 签约模板 · 附录', color: C.GRAY, size: 18, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 }
        }),
        pageBreak()
    );
}

// ========== END PAGE ==========
function buildEndPage() {
    return [].concat(
        spacer(800),
        new Paragraph({
            children: [new TextRun({ text: '— 工具包完 —', color: C.GRAY, size: 28, font: FONT.body, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 }
        }),
        divider(),
        new Paragraph({
            children: [new TextRun({ text: META.platform + ' · 市场拓展营销工具包 V1.0', color: C.MAIN, size: 22, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '编制：' + META.creator + '  |  ' + META.company, color: C.GRAY, size: 18, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '品牌：' + META.brand + '  |  ' + META.parent, color: C.GRAY, size: 18, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        new Paragraph({
            children: [new TextRun({ text: '商标：' + META.registeredTrademark + '（第35/42/9类注册中）', color: C.GRAY, size: 18, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 }
        }),
        spacer(200),
        flowBox('本文档为内部工作工具，所含话术、表单、策略仅供团队使用。所有对外材料须经品牌审核后发布。参数如有更新以 lib/constants.js 为准。', false),
        spacer(200),
        new Paragraph({
            children: [new TextRun({ text: '© 2026 ' + META.company + '  |  ' + META.parent, color: C.GRAY, size: 16, font: FONT.body })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 0 }
        })
    );
}

// =============================================================================
// PART E: APPENDICES (附录) — built first as reference for other sections
// =============================================================================

// E1: Complete Parameter Reference
function buildE1_ParameterReference() {
    var children = [].concat(
        h1('E1  全参数速查手册'),
        p('以下为链邦赋商通平台全部核心参数，按类别整理，供各角色随时查阅。所有参数以 lib/constants.js 为准，修改须经运营提案→品牌评估→技术确认→法务审核→管理层审批。'),
        divider(),

        h2('一、支付渠道成本'),
        dataTable(
            ['参数项', '费率', '说明'],
            [
                ['汇付收单（微信/支付宝扫码）', pct(CHANNEL.HUIFU_ACQUIRING), '主流支付方式'],
                ['余额支付', pct(CHANNEL.BALANCE_PAYMENT), '消费者使用平台余额'],
                ['消费金核销', pct(CHANNEL.VOUCHER_REDEMPTION), '消费金使用时零渠道成本'],
                ['二次提现（微信商户号→银行账户）', pct(CHANNEL.SECONDARY_WITHDRAWAL), '商家/平台/服务站/推广者/城市服务商均适用']
            ],
            { small: true }
        ),

        divider(),
        h2('二、三业态分账比例'),
        p('以下为使用汇付收单（0.6%）时的完整分账结构。', { bold: false }),

        h3('平台商家分账（汇付收单）'),
        dataTable(
            ['分配方', '比例', '说明'],
            [
                ['支付渠道', pct(PLATFORM_DIST.channel), '汇付收单成本'],
                ['商家', pct(PLATFORM_DIST.merchant), '商家实际到手'],
                ['平台服务费', pct(PLATFORM_DIST.platform), '平台运营收入'],
                ['服务站+推广者', pct(PLATFORM_DIST.station_promoter), '佣金池，内部分配35:65'],
                ['城市服务商', pct(PLATFORM_DIST.city_partner), '区域合伙人独立提成'],
                ['消费金', pct(PLATFORM_DIST.consumer_voucher), '用户消费权益积累'],
                ['营销池', pct(PLATFORM_DIST.marketing_pool), '代金券发放+推广激励+活动'],
                ['风控备用金', pct(PLATFORM_DIST.risk_reserve), '汇付托管，应对异常交易'],
                ['合计', '100.00%', '——']
            ],
            { small: true }
        ),

        h3('联盟商家分账（汇付收单）'),
        dataTable(
            ['分配方', '比例', '说明'],
            [
                ['支付渠道', pct(ALLIANCE_DIST.channel), '汇付收单成本'],
                ['商家', pct(ALLIANCE_DIST.merchant), '商家实际到手'],
                ['平台渠道费', pct(ALLIANCE_DIST.platform_channel_fee), '平台引流+渠道服务费'],
                ['平台服务费', pct(ALLIANCE_DIST.platform), '平台运营收入'],
                ['服务站+推广者', pct(ALLIANCE_DIST.station_promoter), '佣金池（联盟商家给更高激励）'],
                ['城市服务商', pct(ALLIANCE_DIST.city_partner), '区域合伙人独立提成'],
                ['消费金', pct(ALLIANCE_DIST.consumer_voucher), '用户消费权益积累'],
                ['营销池', pct(ALLIANCE_DIST.marketing_pool), '代金券发放+推广激励+活动'],
                ['风控备用金', pct(ALLIANCE_DIST.risk_reserve), '汇付托管'],
                ['合计', '100.00%', '——']
            ],
            { small: true }
        ),

        h3('综合商城分账（汇付收单）'),
        dataTable(
            ['分配方', '比例', '说明'],
            [
                ['支付渠道', pct(ECOMMERCE_DIST.channel), '汇付收单成本'],
                ['商家', pct(ECOMMERCE_DIST.merchant), '平台自营，商家比例最高'],
                ['平台服务费', pct(ECOMMERCE_DIST.platform), '平台运营收入'],
                ['服务站+推广者', pct(ECOMMERCE_DIST.station_promoter), '佣金池'],
                ['城市服务商', pct(ECOMMERCE_DIST.city_partner), '区域合伙人独立提成'],
                ['消费金', pct(ECOMMERCE_DIST.consumer_voucher), '用户消费权益积累'],
                ['营销池', pct(ECOMMERCE_DIST.marketing_pool), '代金券发放+推广激励+活动'],
                ['风控备用金', pct(ECOMMERCE_DIST.risk_reserve), '汇付托管'],
                ['合计', '100.00%', '——']
            ],
            { small: true }
        ),

        divider(),
        h2('三、三元营销参数'),
        dataTable(
            ['参数', '代金券', '积分', '消费金'],
            [
                ['发放/累积率', pct(MARKETING.voucher.issueRate) + '（每笔交易）', '1元=100积分', pct(PLATFORM_DIST.consumer_voucher) + '/' + pct(ALLIANCE_DIST.consumer_voucher) + '/' + pct(ECOMMERCE_DIST.consumer_voucher) + '（平台/联盟/商城）'],
                ['抵扣上限', pct(MARKETING.voucher.maxDeduction) + '（订单金额）', pct(MARKETING.points.maxDeduction) + '（订单金额）', pct(MARKETING.credit.maxRedemption) + '（订单金额）'],
                ['有效期', MARKETING.voucher.validityDays + '天', MARKETING.points.validityDays + '天（2年）', MARKETING.credit.validityDays + '天（12个月）'],
                ['全平台通用', MARKETING.voucher.universal ? '是' : '否', MARKETING.points.universal ? '是' : '否', MARKETING.credit.universal ? '是' : '否'],
                ['主要用途', '获客拉新', '留存复购', '长期锁客'],
                ['资金来源', '营销池', '平台服务费', '对应业态消费金比例']
            ],
            { small: true }
        ),

        divider(),
        h2('四、三级管理体系'),
        dataTable(
            ['层级', '角色', '收入来源', '占比/分配', '核心职责'],
            [
                ['L1 城市服务商', MANAGEMENT.cityPartner.role, '独立提成', pct(MANAGEMENT.cityPartner.shareOfReserve), '区域市场开拓、服务商招募、城市级活动策划'],
                ['L2 服务站', MANAGEMENT.station.role, '佣金池内部分配', pct(MANAGEMENT.station.internalSplitStation) + '（服务站留存35%）', '社区商户服务、消费者维护、推广者管理'],
                ['L3 推广者', MANAGEMENT.promoter.role, '佣金池内部分配', pct(MANAGEMENT.station.internalSplitPromoter) + '（推广者获得65%）', '商户拓展、消费者拉新、一线推广执行']
            ],
            { small: true }
        ),
        p('注：佣金池 = 商家交易额 × 服务站+推广者比例。以平台商家为例，9%佣金池中，服务站留35%（3.15%），推广者得65%（5.85%）。', { color: C.GRAY, size: 18 }),

        divider(),
        h2('五、财务基准'),
        dataTable(
            ['指标', '数值', '说明'],
            [
                ['月盈亏平衡交易笔数', fmt(FINANCIAL.breakevenTransactions) + ' 笔/月', '覆盖固定运营成本的最低交易量'],
                ['净利润率', pct1(FINANCIAL.netMargin), '盈亏平衡点净利率'],
                ['风控备用金比例', pct1(FINANCIAL.riskReserveRate), '汇付托管，应对异常交易'],
                ['营销池最低比例', pct1(FINANCIAL.marketingPoolMin), '联盟/商城业态'],
                ['营销池最高比例', pct1(FINANCIAL.marketingPoolMax), '平台商家业态']
            ],
            { small: true }
        ),

        divider(),
        h2('六、商家分层权重'),
        dataTable(
            ['层级', '类型', '搜索权重', '认证标识', '页面布局', '自定义程度'],
            [
                ['平台商家', STORE_TIER.premium.name, '+' + STORE_TIER.premium.weight, STORE_TIER.premium.badge, STORE_TIER.premium.layout, '深度自定义（品牌色/故事/视频/相册）'],
                ['联盟商家', STORE_TIER.standard.name, STORE_TIER.standard.weight + '（基准位）', STORE_TIER.standard.badge, STORE_TIER.standard.layout, '6套模板+轻定制（品牌色/横幅）'],
                ['综合商城', STORE_TIER.minimal.name, STORE_TIER.minimal.weight, STORE_TIER.minimal.badge, STORE_TIER.minimal.layout, '标准化模板，不可自定义']
            ],
            { small: true }
        ),

        divider(),
        flowBox('参数修改审批流程：运营提案 → 品牌评估 → 技术确认 → 法务审核 → 管理层审批。未经审批不得在对外材料中使用非标准参数。', false)
    );
    return children;
}

// E2: Brand Visual Identity Summary
function buildE2_BrandVisualSummary() {
    var children = [].concat(
        h1('E2  品牌视觉规范摘要'),
        p('以下为链邦赋商通（链生活）品牌视觉识别系统的核心规范摘要。完整品牌执行手册见《链商小程序品牌执行手册》。'),
        divider(),

        h2('一、品牌色系统'),
        dataTable(
            ['色板', '色值', '名称', '用途'],
            [
                ['深海蓝', COLORS.DEEP_BLUE, 'Primary / 主色', '文档标题、重点强调、品牌标识'],
                ['链商红', COLORS.CHAIN_RED, 'Accent / CTA', '行动按钮、招商物料、地推工具标识'],
                ['科技蓝', COLORS.TECH_BLUE, 'Data / Link', '数据展示、超链接、市场部工具标识'],
                ['温暖橙', COLORS.WARM_ORANGE, 'Emphasis', '重要提示、CTA辅助色'],
                ['深空灰', COLORS.DARK_GRAY, 'Body Text', '正文文字'],
                ['中灰', COLORS.MID_GRAY, 'Auxiliary', '辅助说明、脚注、次要信息'],
                ['浅蓝背景', COLORS.LIGHT_BG, 'Background', '表格交替行、信息卡片背景'],
                ['软白背景', COLORS.SOFT_BG, 'Card BG', '卡片式布局背景'],
                ['警示红', COLORS.RED, 'Warning', '合规红线、禁止事项、风险提示'],
                ['合规绿', COLORS.GREEN, 'Pass / Success', '合规通过、绿色通道、成功标识'],
                ['代金券金', COLORS.GOLD, 'Voucher', '代金券/招商会相关'],
                ['米色暖底', COLORS.WARM_BG, 'Warm BG', '温暖提示卡片']
            ],
            { small: true }
        ),

        divider(),
        h2('二、Logo使用规范'),
        b('标准版本：水平版（主推）、垂直版、图标版、反白版'),
        b('安全间距：Logo四周留白 ≥ Logo高度的1/4'),
        b('最小尺寸：印刷 ≥ 15mm宽，屏幕 ≥ 100px宽'),
        b('底线标识文案：「由链商·链生活提供技术与运营支持」'),
        b('禁止行为：拉伸变形、改变颜色、添加阴影/描边、置于复杂背景上'),

        divider(),
        h2('三、字体规范'),
        dataTable(
            ['场景', '字体', '字号', '字重'],
            [
                ['文档大标题', '微软雅黑', '28-52pt（Word）', 'Bold'],
                ['章节标题', '微软雅黑', '22-26pt', 'Bold'],
                ['正文', '微软雅黑', '18-21pt', 'Regular'],
                ['表格内容', '微软雅黑', '16-19pt', 'Regular'],
                ['小程序界面', 'PingFang SC / 微软雅黑', '按组件规范', '按组件规范'],
                ['价格数字', 'DIN / PingFang SC', '按场景', 'Bold']
            ],
            { small: true }
        ),

        divider(),
        h2('四、五大部件色系分工'),
        p('本工具包五大部件各使用独立主题色，便于快速识别和翻找：'),
        dataTable(
            ['部件', '主题色', '色值', '适用场景'],
            [
                ['第一部分：通用基础', '深海蓝', COLORS.DEEP_BLUE, '全员通用'],
                ['第二部分：地推工具', '链商红', COLORS.CHAIN_RED, '一线地推团队'],
                ['第三部分：市场部/BD', '科技蓝', COLORS.TECH_BLUE, '专业商务场景'],
                ['第四部分：招商会', '代金券金', COLORS.GOLD, '招商/合作洽谈'],
                ['第五部分：附录', '深空灰', COLORS.DARK_GRAY, '全员参考查阅']
            ],
            { small: true }
        ),

        divider(),
        calloutBox('品牌一致性原则', [
            '所有对外物料必须使用统一的品牌色、Logo和字体',
            '不得自行修改品牌色值或Logo样式',
            '地推物料使用链商红为主色调，商务文档使用深海蓝',
            '品牌资产获取和审核请联系品牌策划部（梁君衡）'
        ], C.LIGHT)
    );
    return children;
}

// E3: Full Compliance Cross-Reference
function buildE3_ComplianceCrossReference() {
    var children = [].concat(
        h1('E3  合规术语对照表'),
        p('以下为完整合规术语对照，适用于所有对外宣传材料、话术脚本、招商文档。凡使用左侧词汇的材料，在对外发布前必须替换为右侧合规表述。'),
        divider(),

        h2('一、三条不可逾越的红线'),
        flowBox('红线1：积分不可兑现 —— 积分仅可用于平台内消费抵扣，不可兑换现金、不可转账、不可提现', true),
        flowBox('红线2：不可形成资金池 —— 未取得支付牌照前，平台不设资金池，所有交易资金由汇付直接清分至各方账户', true),
        flowBox('红线3：不可承诺收益 —— 任何语言不得暗示"稳赚""躺赚""投资回报"，推广者收入基于真实交易且不固定', true),

        divider(),
        h2('二、术语强制替换表'),
        p('以下术语在对外材料中必须使用右侧合规表述。违反将导致法律风险。', { bold: true, color: C.RED }),

        dataTable(
            ['禁止使用', '必须使用', '适用场景'],
            [
                ['数字资产', '消费权益 / 会员权益', '所有对外材料'],
                ['数字信用债券', '商家营销额度', '商家协议/宣传'],
                ['资产增值', '权益升级', '营销材料'],
                ['消费信用分', '消费活跃度指数', '产品说明'],
                ['分润算法优化引擎', '商家服务费计算规则', '技术文档'],
                ['收益 / 盈利', '服务费 / 增收', '对外宣传/招商'],
                ['红利 / 增值回报', '权益升级 / 消费权益', '用户协议'],
                ['资本（化）', '资源 / 产业', '禁止金融暗示'],
                ['变现', '转化', '商业描述'],
                ['创业', '参与推广 / 开展推广', '推广者招募'],
                ['全球化', '全国化 / 本地化', '当前阶段聚焦国内'],
                ['数据确权', '数据权益管理', '隐私政策'],
                ['数据即资产', '数据驱动经营', '商业描述'],
                ['优惠券 / 折扣券', '营销优惠 / 消费抵扣券', '小程序/宣传'],
                ['返利 / 返现 / 回扣', '会员回馈 / 消费积分', '商家/用户'],
                ['储值金 / 余额', '消费让利 / 消费权益金', '产品界面']
            ],
            { small: true }
        ),

        divider(),
        h2('三、绝对禁用词（9项）'),
        p('以下词汇在任何对外材料中绝对禁止出现，一旦出现将构成严重合规事故。', { bold: true, color: C.RED }),
        dataTable(
            ['序号', '禁用词', '风险等级', '法律风险说明'],
            COMPLIANCE_FORBIDDEN.map(function(word, idx) {
                var risk = (word === '币' || word === 'Token' || word === '通证') ? '极高——可能被认定为虚拟货币'
                    : (word === '投资回报' || word === '稳赚' || word === '躺赚') ? '极高——承诺收益'
                    : (word === '数字资产交易') ? '极高——金融监管'
                    : '高——金融/资本暗示';
                return [String(idx + 1), word, '⛔ ' + (idx < 3 ? '极高' : idx < 6 ? '极高' : '高'), risk];
            }),
            { small: true }
        ),

        divider(),
        h2('四、发布前自检清单'),
        p('任何对外材料发布前，逐项确认以下10项：', { bold: true }),
        [1,2,3,4,5,6,7,8,9,10].map(function(i) {
            var items = [
                '是否含有"币/Token/通证"等虚拟货币暗示词汇？',
                '是否含有"投资回报/稳赚/躺赚"等收益承诺？',
                '是否使用"数字资产"代替"消费权益"？',
                '是否使用"收益/盈利"代替"服务费/增收"？',
                '是否使用"变现"代替"转化"？',
                '是否使用"创业"代替"参与推广"？',
                '是否暗示积分可兑换现金？',
                '是否暗示平台存在资金池？',
                '是否使用"全球化"而非"全国化/本地化"？',
                '所有数据是否有可靠来源且不超过6个月？'
            ];
            return p('□  ' + items[i-1], { indent: { left: 400 }, size: 19 });
        }),

        divider(),
        greenCheck('合规不仅仅是不违规——合规是品牌信任的基石。每一条合规要求背后都是真实的监管风险和用户信任。'),
        divider(),

        h2('五、合规口诀'),
        flowBox('不承诺收益 · 不碰资金池 · 积分不兑现 · 术语用合规的 · 数据有来源 · 发布前自检', true)
    );
    return children;
}

// =============================================================================
// PART A: UNIVERSAL FOUNDATION (通用基础工具)
// =============================================================================

// A1: Elevator Pitch Cards
function buildA1_ElevatorPitch() {
    var children = [].concat(
        h1('A1  平台价值一句话与电梯演讲卡'),
        p('以下为面向不同角色的30秒电梯演讲标准话术。结构：吸引注意（10秒）+ 价值主张（15秒）+ 行动号召（5秒）。'),
        divider(),

        h2('一、四角色电梯演讲'),

        h3('🎯 面向消费者（10+15+5秒）'),
        calloutBox('消费者30秒', [
            '【吸引】你好！你知道在社区周边消费，每一笔都能省、每一笔都能攒吗？',
            '【价值】链邦赋商通是我们社区的商家经营平台——在附近任意合作商家消费，都能获得代金券、积分和消费金。更重要的是，在A店获得的券，在B店也能用！全平台通用，没有限制。',
            '【行动】扫码注册，新人即送¥25消费礼包。来，我帮你扫一下——'
        ], C.LIGHT),

        h3('🏪 面向商家（10+15+5秒）'),
        calloutBox('商家30秒', [
            '【吸引】老板您好！我是链邦赋商通的服务人员——想跟您聊一个帮您提升复购率、且不收固定费用的方案。',
            '【价值】我们是社区商业数字经营平台，跟美团不一样——我们只收5-6%服务费（美团收18-22%），而且只在您实际成交时才收，零固定费用、零预充值。消费者在您店里消费后获得的代金券、积分，可以去其他商家用——反过来，其他店的顾客也会被引导到您这来。',
            '【行动】这是我们的商家入驻引导表，15分钟就能完成注册。现在入驻还有公测期特别扶持——'
        ], '#FDEBD0'),

        h3('🤝 面向推广者（10+15+5秒）'),
        calloutBox('推广者30秒', [
            '【吸引】您对社区熟、喜欢跟人打交道吗？我们正在找社区推广伙伴。',
            '【价值】推广者在链邦赋商通帮助商家入驻和消费者注册，每一笔真实交易都有佣金。平台商家的佣金池是9%，推广者分65%——不设入门费、零保证金、完全基于真实交易。',
            '【行动】这是推广者自评清单，您看看自己适合哪种模式——兼职还是全职——我们都有对应的支持方案。'
        ], C.LIGHT),

        h3('💼 面向投资人/合作伙伴（10+15+5秒）'),
        calloutBox('投资人/合作伙伴30秒', [
            '【吸引】中国社区商业市场规模超万亿，但数字化渗透率不到5%——这是一个巨大的蓝海。',
            '【价值】链邦赋商通通过"交易即分润+全平台权益互通+千面千店"三大差异化机制，构建了独特的竞争壁垒。盈亏平衡仅需40,500笔/月，轻资产、无库存、合规底线全部满足。',
            '【行动】这是我们的一页纸平台概览——如果您感兴趣，我可以安排一次30分钟的完整演示。'
        ], '#FDEBD0'),

        divider(),
        h2('二、平台一页纸介绍'),
        infoTable([
            ['平台名称', META.platform + '（' + META.platformLegacy + '）'],
            ['品牌', META.brand + '（Chain Life）'],
            ['运营公司', META.company],
            ['母公司', META.parent],
            ['平台定位', '面向社区商业的数字经营平台——商户独立经营、生态会员互通、消费权益流转、真实交易激励'],
            ['四大核心机制', '① 商户独立经营（千面千店） ② 生态会员互通（全平台会员） ③ 消费权益流转（跨店通兑） ④ 真实交易激励（交易即分润）'],
            ['核心标语', '在链生活，在哪花都在省，在哪得的券都能用'],
            ['三大业态', '平台商家（深度定制+搜索加权） / 联盟商家（模板化+社区好店） / 综合商城（标准化+平台自营）'],
            ['服务费率', '平台商家≈5% / 联盟商家≈4.5%+引流费 / 综合商城≈6% ——远低于美团18-22%'],
            ['盈亏平衡', fmt(FINANCIAL.breakevenTransactions) + '笔/月，净利润率' + pct1(FINANCIAL.netMargin)],
            ['合规状态', '三条红线全部满足：积分不兑现·无资金池·不承诺收益'],
            ['商标状态', META.registeredTrademark + ' 第35/42/9类注册中（' + META.trademarkAgency + '）']
        ]),

        divider(),
        h2('三、五大投资/合作亮点'),
        dataTable(
            ['序号', '亮点', '核心论据'],
            [
                ['1', '蓝海市场', '中国社区商业市场超万亿，数字化渗透率<5%，竞品未形成垄断'],
                ['2', '差异化定位', '唯一实现"跨店通兑+交易即分润+零固定费用"的平台'],
                ['3', '轻资产模式', '无库存、无物流、无资金池——全部交易由汇付直接清分'],
                ['4', '合规壁垒', '三条红线全部通过，16项术语强制替换，零合规事故'],
                ['5', '网络效应', '六方增长飞轮：消费者⇄商家⇄推广者⇄服务站⇄城市服务商⇄平台']
            ],
            { small: false }
        )
    );
    return children;
}

// A2: Compliance Red Line Quick Reference Card
function buildA2_ComplianceQuickRef() {
    var children = [].concat(
        h1('A2  合规红线速查卡'),
        p('以下为面向一线团队（地推/BD/招商）的合规速查卡。任何对外沟通前，请花2分钟过一遍本页。'),
        divider(),

        h2('一、三条红线（不可触碰）'),
        redline('红线1：积分不可兑现 —— 积分仅可用于平台内消费抵扣，不可兑换现金、不可转账、不可提现。向任何人解释积分规则时，必须明确此点。'),
        redline('红线2：不可形成资金池 —— 未取得支付牌照前，平台不设资金池。所有交易资金由汇付（持牌支付机构）直接清分至各方账户。不可使用"平台存管""余额""储值"等暗示资金池的词汇。'),
        redline('红线3：不可承诺收益 —— 推广者收入基于真实交易产生，不固定、不保证、不承诺。禁止使用"稳赚""躺赚""月入X万""投资回报"等任何形式收益承诺语言。'),

        divider(),
        h2('二、一线团队最容易踩的5个坑'),
        dataTable(
            ['序号', '常见错误说法', '为什么危险', '正确说法'],
            [
                ['1', '"帮您多赚钱"', '暗示收益承诺', '"帮您提升复购率和客流"'],
                ['2', '"这个券可以当钱用"', '代金券≠货币', '"这个券可以在任意合作商家抵扣消费金额"'],
                ['3', '"积分可以攒着换东西"', '暗示积分=货币', '"积分可以在消费时抵扣，100积分抵1元"'],
                ['4', '"等于免费入驻开店"', '"免费"是敏感营销词', '"零固定费用，仅在您实际成交时收取服务费"'],
                ['5', '"您发展下级还能拿提成"', '暗示多级分销', '"您的推广收入基于您拓展的商家实际交易额"']
            ],
            { small: true }
        ),

        divider(),
        h2('三、一句话合规自查'),
        p('每次对外说话前，自问："我这句话会被理解为承诺收益吗？会被理解为金融操作吗？会用到了禁用词吗？"', { bold: true, color: C.RED }),
        p('如果任何一个答案是"是"——换一种说法。'),
        flowBox('合规口诀：不承诺收益·不碰资金池·积分不兑现·术语用合规的——记不住就拍下这一页', true)
    );
    return children;
}

// A3: Core Data Quick Reference Sheet
function buildA3_DataQuickRef() {
    var children = [].concat(
        h1('A3  核心数据速查表'),
        p('以下为地推和BD最常用到的关键数字。"一句记住"可作为口头引用。'),
        divider(),

        h2('一、商家最关心的数字'),
        dataTable(
            ['商家会问', '标准答案', '一句话记住'],
            [
                ['你们收多少服务费？', '平台商家约5%，联盟商家约4.5%+引流费，综合商城约6%', '比美团低至少3倍'],
                ['我实际到手多少？', '平台商家约75.4%，联盟商家约71.4%，综合商城约77.9%', '到手超过七成'],
                ['什么时候结算？', '交易完成即时清分（汇付直清，T+0到账）', '成交即到账'],
                ['有固定费用吗？', '零固定费用、零预充值、零保证金', '三零政策'],
                ['多久能上线？', '标准流程7天（资料准备→审核→装修→上线）', '7天开店'],
                ['客户数据归谁？', '客户消费数据归商家所有，平台不截留', '数据归你']
            ],
            { small: false }
        ),

        divider(),
        h2('二、推广者最关心的数字'),
        dataTable(
            ['推广者会问', '标准答案', '核心逻辑'],
            [
                ['我能挣多少？', '基于您拓展商家的实际交易额——平台商家推广者约获5.85%，联盟商家约6.5%，综合商城约3.9%', '收入=交易额×佣金比例'],
                ['需要交钱吗？', '零入门费、零保证金、零培训费', '完全零门槛'],
                ['要发展下线吗？', '不需要。您的收入直接来自您拓展商家的交易额', '单层推广、合规透明'],
                ['多久能见收入？', '商家上线后产生第一笔交易即开始有收入', '交易即分润'],
                ['收入怎么提现？', '通过微信商户号提现至银行卡，渠道费0.1%', '自主提现']
            ],
            { small: false }
        ),

        divider(),
        h2('三、消费者最关心的数字'),
        dataTable(
            ['消费者会问', '标准答案'],
            [
                ['有什么优惠？', '新人注册即送¥25消费礼包（含代金券+积分），日常消费每笔可得代金券和积分'],
                ['券能在哪用？', '全平台任意合作商家通用！在A店得的券去B店也能用'],
                ['积分怎么用？', '消费时自动抵扣，100积分=1元，最高抵扣订单20%'],
                ['券会过期吗？', '代金券90天，积分2年，消费金12个月——都有充足时间使用']
            ],
            { small: false }
        ),

        divider(),
        h2('四、管理层/KPI核心数字'),
        dataTable(
            ['指标', '数值', '意义'],
            [
                ['月盈亏平衡点', fmt(FINANCIAL.breakevenTransactions) + '笔', '覆盖固定成本的最低交易量'],
                ['盈亏平衡时月GMV', '约¥4,050,000（按客单价¥100估算）', '财务可持续的起点'],
                ['净利润率', pct1(FINANCIAL.netMargin), '盈亏平衡时的净利率'],
                ['城市服务商分成', pct(MANAGEMENT.cityPartner.shareOfReserve), '独立于佣金池的区域分成'],
                ['推广者最高佣金', '约6.5%（联盟商家）', '联盟商家给推广者更高激励']
            ],
            { small: false }
        ),

        divider(),
        calloutBox('一句话记住这些数字', [
            '商家到手超七成，服务费不到美团1/3',
            '推广者零门槛加入，交易即分润',
            '消费者全平台通用，在哪花都在省',
            '平台盈亏平衡4万笔/月，轻资产高合规'
        ], C.LIGHT)
    );
    return children;
}

// =============================================================================
// PART B: GROUND PUSH TEAM TOOLS (地推人员工具)
// =============================================================================

// B1: Standard Door-to-Door Scripts
function buildB1_DoorToDoorScripts() {
    var children = [].concat(
        h1('B1  地推标准话术脚本'),
        p('以下为三套完整的标准话术脚本，覆盖地推三大核心场景：商户首次接触、消费者招募、推广者招募。每套话术均包含完整对话流程和注意事项。'),
        divider(),

        h2('脚本一：商户首次接触（8个环节）'),
        p('适用场景：进店与老板/店长首次沟通。目标：获得15分钟深度沟通机会，留下入驻引导表。', { color: C.GRAY }),
        scriptDialog([
            ['1', '推广者', '老板您好！我是链邦赋商通在本社区的服务人员，今天专门来拜访咱们这片区的商家——方便聊2分钟吗？', '选老板空闲时段（非饭点/非忙时），不要上来就推销'],
            ['2', '推广者', '我先简单介绍一下：链邦赋商通是咱们社区的数字经营平台，帮助商家提升复购率的。（递上平台一页纸）跟美团最大区别是——我们不收固定费用，只在您实际成交时收服务费。', '先用一句话引起好奇，再递资料；不要一次说太多'],
            ['3', '推广者', '举个例子：假设您店里一笔¥100的订单，通过微信扫码支付——您到手大约¥75.4。服务费只有约5%，比美团的18-22%低很多。', '用具体数字，帮老板算账；强调"到手"而非"扣费"'],
            ['4', '推广者', '更重要的是——消费者在您这消费后能获得代金券和积分。这些券在我们平台所有商家都能用。也就是说，其他店的顾客会被引导到您这来——这就是"跨店通兑"。', '"跨店通兑"是核心卖点，必须讲清楚A店获券B店使用'],
            ['5', '推广者', '入驻也很简单——标准流程7天就能上线。我们提供6套店面模板，您选一套，上传几张照片、填一下基本信息就行。不需要技术背景。', '强调"简单""快"，打消技术门槛顾虑'],
            ['6', '推广者', '老板，我可以现在帮您在手机上注册一下吗？大概15分钟就能完成第一步。注册不收费、不上线不收费，您先看看后台是什么样的——', '低门槛行动号召；"不收费"必须每次强调'],
            ['7', '推广者', '（如对方犹豫）没关系！这是我的联系方式和我们平台资料。您可以先看看，或者问问周围已经入驻的商家。我三天后再来拜访您，您有任何问题随时找我。', '不强行推进，留资料+约定回访'],
            ['8', '推广者', '（如对方同意注册）太好了！您先扫码，我一步步帮您操作。第一步是填写店铺基本信息——', '引导注册流程，转入B2入驻引导表']
        ]),

        divider(),
        h2('脚本二：消费者招募（5个环节）'),
        p('适用场景：社区活动/商场入口/商铺门口设点。目标：引导扫码注册，完成首单。', { color: C.GRAY }),
        scriptDialog([
            ['1', '推广者', '您好！咱们社区刚上线了一个新的消费平台——链邦赋商通。以后在附近合作商家消费都有优惠。（递上单页）可以了解一下，扫个码就行！', '微笑+单手递单页，不要拦路拦截'],
            ['2', '推广者', '现在扫码注册，新人有¥25消费礼包——含一张¥5无门槛代金券和200积分。这些券在附近所有合作商家都能用，比如那边的XX餐厅和XX便利店——', '先说有礼包，降低注册心理门槛；举附近具体商家例子'],
            ['3', '推广者', '以后每次在合作商家消费，都能自动获得代金券和积分。积分可以当钱花，而且券在哪家店得的、在别家店也能用。在链生活，在哪花都在省！', '传达"全平台通用"的核心价值；用标语收尾'],
            ['4', '推广者', '来，我帮您扫一下小程序码——（打开手机展示小程序码）注册只需要10秒，绑定微信就行。注册完您马上就能看到附近有哪些合作商家——', '直接行动引导，降低操作难度'],
            ['5', '推广者', '注册好了！您打开小程序首页就能看到附近的商家。试试搜索您常去的店——如果没有，您可以推荐商家入驻，推荐成功还有额外积分奖励哦！', '注册后立即引导首次使用体验']
        ]),

        divider(),
        h2('脚本三：推广者招募（6个环节）'),
        p('适用场景：面对活跃消费者/社区意见领袖/有兼职意愿的居民。目标：完成推广者注册。', { color: C.GRAY }),
        scriptDialog([
            ['1', '推广者', '您好！我看您对这个平台挺感兴趣的——想不想了解一下我们的社区推广伙伴计划？', '观察对方反应——对平台有兴趣是前提'],
            ['2', '推广者', '推广者就是帮助附近商家入驻平台、帮助邻居们注册使用。每一笔真实交易都有佣金——平台商家推广者约获得5.85%、联盟商家约6.5%。零入门费、零保证金。', '先讲收益模式再讲工作要求'],
            ['3', '推广者', '给您算一下：如果您拓展10家平台商家，每家月均100笔交易、客单价¥50——您的月佣金大约是10×100×50×5.85%≈¥2,925。这只是10家保守估算。', '算一笔具体的账，让收入可感知'],
            ['4', '推广者', '推广很灵活——可以兼职做，把日常逛街、聊天顺便变成收入；也可以全职做，专注跑商家。时间完全自由，您自己安排。', '强调灵活性，打消"绑定"顾虑'],
            ['5', '推广者', '我们的体系是单层推广——您的收入直接来自您拓展商家的交易额，不需要发展下线、不需要拉人头。这跟那些多级分销完全不一样，我们是合规透明的。', '主动打消"拉人头"顾虑，强调合规'],
            ['6', '推广者', '注册推广者也很简单——扫码填一下基本信息，10分钟完成。我们有完整的培训材料和辅导支持，不会让您一个人摸索。扫码试试？', '低门槛行动号召']
        ]),

        divider(),
        h2('四、常见异议及应对（10条）'),
        dataTable(
            ['序号', '常见异议', '应对话术', '证据/支撑'],
            [
                ['1', '"已经有美团了，不需要"', '美团是外卖和到店平台，我们是帮您经营复购的平台——互补不冲突。而且美团收18-22%，我们只收5%左右。', '竞品费率对比见C5'],
                ['2', '"效果怎么样？有人用吗？"', '平台刚上线，我们是第一批拓展，现在入驻享受最好的位置和扶持政策。等商家多了再进来，竞争就大了。', '先发优势逻辑'],
                ['3', '"太麻烦了，没时间搞"', '标准流程7天，其中您的操作时间总共不到2小时。我们有专人上门辅导，您只需要提供基本资料。', 'B2入驻引导表7天神速'],
                ['4', '"不会用、不懂技术"', '完全不需要技术背景。就像发朋友圈一样简单——拍照、填字、发布。我们有6套模板，选一套就行。', '现场展示小程序商家端'],
                ['5', '"是不是要先交钱？"', '绝不需要。零固定费用、零预充值、零保证金——只在您实际成交时收取服务费。成交才收费，不成交不收。', '三零政策，强调"成交才收费"'],
                ['6', '"我的客户数据安全吗？"', '客户消费数据归您所有，平台不截留、不出售。您可以随时导出自己的客户数据。', '数据归属承诺'],
                ['7', '"你们能撑多久？"', '我们是广东链邦科技，母公司是全球拼购（GGbingo），有扎实的资本和技术背景。平台是长期战略，不是短期项目。', META.parent + '背书'],
                ['8', '"我朋友之前做类似的被坑了"', '很多平台确实有问题——收高额入驻费、承诺流量但不兑现、甚至搞多级分销。我们全部不一样——零固定费用+交易即分润+单层推广，完全合规。', '差异化对比，强调合规'],
                ['9', '"让我考虑考虑"', '没问题！我留一份资料给您，3天后再来。这期间您可以先看看周边已经入驻的商家后台是什么样的——（展示成功案例）', '约定回访，展示案例'],
                ['10', '"我老婆/老公不同意"', '那正好，约个时间我一起给两位讲解，这样你们可以一起讨论决策。很多夫妻店都是一起入驻的——', '不绕开决策人']
            ],
            { small: true }
        )
    );
    return children;
}

// B2: Merchant Onboarding Checklist
function buildB2_MerchantOnboarding() {
    var children = [].concat(
        h1('B2  商户入驻引导表'),
        p('以下为商户入驻全流程引导表。推广者/服务站人员可打印此页，逐项引导商家完成。'),
        divider(),

        h2('一、「7天开店倒计时」清单'),
        dataTable(
            ['天数', '阶段', '商家需要做的事', '推广者/服务站协助', '预计耗时'],
            [
                ['Day 1', '扫码注册', '微信扫码 → 授权登录 → 选择商家类型', '现场演示小程序，解答初步疑问', '15分钟'],
                ['Day 2', '资料准备', '准备营业执照/身份证/银行卡/店铺照片（门头+环境+产品各3张）', '提供资料清单，帮忙拍照', '30分钟'],
                ['Day 3', '信息填写', '填写店铺名称/类别/地址/营业时间/联系方式/简介', '协助填写，审核信息准确性', '20分钟'],
                ['Day 4', '选择模板', '从6套模板中选择1套 → 设置品牌色 → 上传横幅图', '展示6套模板效果，给出建议', '15分钟'],
                ['Day 5', '商品上架', '添加首批商品（至少5个）→ 设置价格 → 上传商品图', '协助商品拍摄和定价建议', '1-2小时'],
                ['Day 6', '审核修正', '平台审核 → 如有问题修正 → 二次提交', '跟进审核进度，帮助修正', '视情况'],
                ['Day 7', '正式上线', '确认上线 → 测试下单 → 开始营业 → 分享店铺码', '庆祝上线+首单引导+分享话术', '10分钟']
            ],
            { small: true }
        ),

        divider(),
        h2('二、商户资料采集表'),
        p('以下信息在入驻注册时需要填写，请提前准备。推广者可帮商家逐项确认。'),
        dataTable(
            ['序号', '信息项', '填写内容', '备注'],
            [
                ['1', '店铺名称', '___________________________', '与营业执照一致或简称'],
                ['2', '经营品类', '□ 餐饮 □ 零售 □ 服务 □ 其他___', '可多选'],
                ['3', '详细地址', '___________________________', '需精确到门牌号'],
                ['4', '联系人', '___________________________', '通常为店主/店长'],
                ['5', '联系电话', '___________________________', '用于审核通知和客服'],
                ['6', '营业时间', '____:____ 至 ____:____', '格式如09:00-22:00'],
                ['7', '营业执照号', '___________________________', '个体户或公司均可'],
                ['8', '法人身份证号', '___________________________', '仅用于实名认证'],
                ['9', '结算银行卡', '___________________________', '须与法人一致'],
                ['10', '店铺门头照', '需3张：门头全景/店内环境/招牌产品', '推广者可帮忙拍摄'],
                ['11', '商户类型', '□ 平台商家 □ 联盟商家', '详见分层说明'],
                ['12', '推荐人', '___________________________', '推广者姓名或ID']
            ],
            { small: true }
        ),

        divider(),
        h2('三、冷启动扶持计划摘要'),
        calloutBox('公测期商家扶持（适用至2026年9月30日）', [
            '首月服务费减免50%：上线首月平台服务费减半',
            '新人礼包成本由平台承担：首批50单新人代金券成本由营销池全额补贴',
            '首页推荐位7天：上线首周进入「新店推荐」模块',
            '推广者专属对接：每位新商家匹配1位推广者，提供7天贴身辅导',
            '社区活动优先参与权：平台组织的社区推广活动，新商家优先参与'
        ], C.LIGHT),

        divider(),
        h2('四、「服务站上门服务确认单」'),
        p('以下为服务站人员上门服务后的确认单模板（可打印使用）：'),
        infoTable([
            ['商家名称', '___________________________'],
            ['服务日期', '____年____月____日'],
            ['服务人员', '___________________________'],
            ['服务内容', '□ 平台介绍  □ 注册引导  □ 资料采集  □ 模板选择  □ 商品上架  □ 其他___'],
            ['商家反馈', '___________________________'],
            ['下一步计划', '___________________________'],
            ['商家签字', '___________________________'],
            ['服务人员签字', '___________________________']
        ])
    );
    return children;
}

// B3: Consumer QR Scan Guide Card
function buildB3_ConsumerScanGuide() {
    var children = [].concat(
        h1('B3  消费者扫码引导卡'),
        p('以下为面向消费者的标准引导话术和二维码布置指南。适用于社区活动、商铺门口、电梯间等场景。'),
        divider(),

        h2('一、标准招呼话术（按场景）'),
        dataTable(
            ['场景', '标准话术', '配合动作'],
            [
                ['社区门口/电梯间', '您好！咱们社区的合作商家现在都在链邦赋商通上——扫码注册有新人礼包！', '微笑展示小程序码卡片'],
                ['商铺门口（配合商家）', '欢迎光临！本店已入驻链邦赋商通——扫码点单有优惠，新人还送¥25礼包！', '指向收银台旁的二维码立牌'],
                ['社区活动现场', '来来来，扫码领券！注册就送¥5无门槛代金券，附近十几家店都能用！', '手持二维码牌，配合小礼品'],
                ['街头/商圈', '您好打扰一下——我们社区刚上线了优惠平台，注册只要10秒——', '单手递单页，先递后说']
            ],
            { small: false }
        ),

        divider(),
        h2('二、二维码布置指南'),
        p('二维码的最佳布置位置和形式：'),
        b('最佳位置（按扫码转化率排序）：收银台旁（最高）> 餐桌/展架 > 店门口 > 电梯间 > 社区公告栏'),
        b('推荐形式：亚克力立牌（收银台）+ 桌贴（餐桌）+ 海报（店门口/社区）+ 便携卡片（推广者随身）'),
        b('设计要点：链商红（#D62828）为主色、小程序码居中、一句话引导文案、新人礼包信息'),
        b('二维码尺寸：立牌≥8×8cm，桌贴≥5×5cm，海报≥15×15cm'),
        b('定期维护：每月检查二维码是否可正常扫描，如有褪色/损坏立即更换'),

        divider(),
        h2('三、新人欢迎礼包说明'),
        calloutBox('新人礼包内容（总价值约¥25）', [
            '¥5无门槛代金券 × 1张（有效期90天，全平台通用）',
            '200积分 = ¥2抵扣额度（有效期2年，全平台通用）',
            '首次消费额外加赠50积分',
            '推荐好友注册再送¥3代金券（被推荐人也得¥3）',
            '新人专享：注册后7天内首笔消费享双倍积分'
        ], C.LIGHT),

        divider(),
        h2('四、消费者常见问题（Top 5）'),
        dataTable(
            ['问题', '标准回答'],
            [
                ['"这个安全吗？个人信息会泄露吗？"', '完全安全。我们只获取微信公开信息（昵称和头像），不收集身份证/银行卡等敏感信息。平台由广东链邦科技运营，母公司是全球拼购，正规企业。'],
                ['"券真的能用吗？不会有限制吧？"', '真的能用，全平台通用。在任意合作商家消费时自动抵扣——比如¥50的订单，用¥5代金券后实际支付¥45。抵扣规则透明，没有任何隐藏条件。'],
                ['"附近有哪些店可以用？"', '打开小程序首页就能看到附近的合作商家。现在已经有XX家店入驻了，包括XX餐厅、XX便利店……（列举具体商家）'],
                ['"券会过期吗？积分怎么用？"', '代金券有效期90天，积分有效期2年——都够用很久。积分在消费时自动抵扣，100积分=¥1，最高抵扣订单20%。'],
                ['"以后不想用了怎么办？"', '随时可以在微信里删除小程序，没有任何绑定。积分和券不用也不会扣钱——它们只是优惠权益，不影响您的任何东西。']
            ],
            { small: true }
        )
    );
    return children;
}

// B4: Promoter Recruitment Form
function buildB4_PromoterRecruitment() {
    var children = [].concat(
        h1('B4  推广者招募表单'),
        p('以下为推广者招募全流程工具：自评清单 → 收入测算 → 权责说明 → 注册流程。推广者可自行评估是否适合加入。'),
        divider(),

        h2('一、推广者自评清单'),
        p('请逐项勾选——如果你符合其中6项以上，说明你非常适合做推广者：', { bold: true }),
        [
            '你对所在社区/片区非常熟悉，知道哪里有什么店', '你喜欢跟人聊天、交朋友，不排斥主动跟陌生人搭话', '你有一定的空闲时间（哪怕是周末或下班后）', '你对手机App/小程序操作比较熟练', '你有自己的人脉圈子（邻居群/家长群/同事群等）', '你希望有一份额外的灵活收入', '你能接受"收入不固定"——多劳多得，少劳少得', '你没有"一夜暴富"的期望——知道踏踏实实做才有回报', '你诚实守信，不会为了拉人而夸大宣传', '你对链邦赋商通平台认可，愿意向别人推荐'
        ].map(function(item, idx) {
            return p('□  ' + (idx + 1) + '. ' + item, { indent: { left: 400 }, size: 19 });
        }),

        divider(),
        h2('二、推广者收入测算（3种情景）'),
        p('以下为三种典型推广情景的月收入估算。实际收入基于您拓展商家的真实交易额，不固定、不保证。', { color: C.GRAY }),

        h3('情景A：兼职保守型（每周投入10小时）'),
        dataTable(
            ['参数', '估算值', '计算方式'],
            [
                ['拓展商家数', '5家', '每月新增1-2家，维持5家活跃'],
                ['月均交易笔数/商家', '80笔', '中小商家日均2-3笔线上交易'],
                ['平均客单价', '¥40', '社区餐饮/便利店典型客单价'],
                ['佣金比例', '5.85%', '平台商家推广者分成'],
                ['月佣金收入', '≈ ¥936', '5 × 80 × 40 × 5.85%'],
                ['其他收入（推荐奖励等）', '≈ ¥200', '消费者拉新奖励/活动奖励'],
                ['合计月收入', '≈ ¥1,136', '——']
            ],
            { small: true }
        ),

        h3('情景B：兼职进取型（每周投入20小时）'),
        dataTable(
            ['参数', '估算值', '计算方式'],
            [
                ['拓展商家数', '15家', '包含平台商家10家+联盟商家5家'],
                ['月均交易笔数/商家', '100笔', '商家活跃度提升'],
                ['平均客单价', '¥50', '品类覆盖更广'],
                ['加权佣金比例', '≈ 6.07%', '平台5.85%×10 + 联盟6.5%×5'],
                ['月佣金收入', '≈ ¥4,553', '15 × 100 × 50 × 6.07%'],
                ['其他收入', '≈ ¥500', '消费者拉新/活动奖励'],
                ['合计月收入', '≈ ¥5,053', '——']
            ],
            { small: true }
        ),

        h3('情景C：全职投入型（每周投入40小时）'),
        dataTable(
            ['参数', '估算值', '计算方式'],
            [
                ['拓展商家数', '30家', '包含平台20家+联盟8家+商城2家'],
                ['月均交易笔数/商家', '120笔', '深度维护，帮助商家提升线上交易'],
                ['平均客单价', '¥60', '包含部分高客单价商家'],
                ['加权佣金比例', '≈ 5.94%', '综合三种业态'],
                ['月佣金收入', '≈ ¥12,830', '30 × 120 × 60 × 5.94%'],
                ['其他收入', '≈ ¥1,000', '消费者拉新/活动奖励/月度高绩效奖励'],
                ['合计月收入', '≈ ¥13,830', '——']
            ],
            { small: true }
        ),

        p('⚠️ 重要提示：以上为估算示例，不代表承诺或保证。实际收入因地区、商家质量、个人能力、市场环境等因素而异。推广者收入完全基于真实交易，不固定、不保证。', { color: C.RED, bold: true }),

        divider(),
        h2('三、推广者权责速览'),
        infoTable([
            ['推广者权利', '推广者义务'],
            ['获得商家交易佣金', '不使用违规话术，不承诺收益'],
            ['自主安排工作时间', '不夸大平台能力，不虚假宣传'],
            ['获得平台培训和支持', '保护商家和消费者信息安全'],
            ['参与平台活动和激励计划', '遵守平台规则和合规要求'],
            ['随时退出，无任何费用', '不发展下线，不收取入门费']
        ]),

        divider(),
        h2('四、推广者注册流程'),
        dataTable(
            ['步骤', '操作', '说明'],
            [
                ['Step 1', '扫码进入推广者注册页面', '通过现有推广者/服务站分享的专属链接'],
                ['Step 2', '填写基本信息（姓名/手机/所在区域）', '须实名认证'],
                ['Step 3', '阅读并同意推广者协议', '重点阅读收入模式和合规条款'],
                ['Step 4', '完成在线培训（约30分钟）', '平台介绍+话术培训+合规培训'],
                ['Step 5', '通过考核（10道选择题）', '80分通过，可反复考'],
                ['Step 6', '获取专属推广码/链接', '即可开始推广']
            ],
            { small: true }
        ),
        flowBox('推广者零入门费 · 零保证金 · 收入基于真实交易 · 随时退出 · 完全合规', false)
    );
    return children;
}

// B5: Daily/Weekly Report Templates
function buildB5_DailyWeeklyReport() {
    var children = [].concat(
        h1('B5  地推日报/周报模板'),
        p('以下为地推团队标准日报和周报模板。可打印使用或拍照上传至工作群。'),
        divider(),

        h2('一、地推日报模板'),
        infoTable([
            ['日期', '____年____月____日'],
            ['推广者姓名', '___________________________'],
            ['所属服务站', '___________________________'],
            ['工作时段', '____:____ 至 ____:____，共____小时'],
            ['天气', '□ 晴 □ 阴 □ 雨 □ 其他____']
        ]),
        p(''),

        h3('当日走访记录'),
        dataTable(
            ['时间', '商户名称', '品类', '联系人', '沟通摘要', '下一步行动', '预计签约时间'],
            [
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '']
            ],
            { small: true }
        ),

        p(''),
        h3('当日数据汇总'),
        infoTable([
            ['走访商家数', '____家'],
            ['深度沟通（>10分钟）', '____家'],
            ['现场注册', '____家'],
            ['预约回访', '____家'],
            ['消费者扫码注册', '____人'],
            ['推广者招募', '____人'],
            ['当日问题/反馈', '___________________________']
        ]),

        divider(),
        h2('二、地推周报模板'),
        infoTable([
            ['报告周期', '____年____月____日 — ____月____日（第____周）'],
            ['推广者姓名', '___________________________'],
            ['所属服务站', '___________________________']
        ]),
        p(''),

        h3('本周关键指标'),
        dataTable(
            ['指标', '本周完成', '累计完成', '月度目标', '达成率'],
            [
                ['走访商家数', '', '', '', ''],
                ['新注册商家', '', '', '', ''],
                ['商家上线数', '', '', '', ''],
                ['消费者注册', '', '', '', ''],
                ['推广者招募', '', '', '', ''],
                ['工作小时数', '', '', '', '']
            ],
            { small: true }
        ),

        p(''),
        h3('商家Pipeline追踪器'),
        p('请更新每个商家的当前状态：线索→已接触→已演示→已签约→已激活', { color: C.GRAY }),
        dataTable(
            ['商家名称', '阶段', '接触日期', '预计签约', '障碍/备注'],
            [
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', ''],
                ['', '□线索 □接触 □演示 □签约 □激活', '', '', '']
            ],
            { small: true }
        ),

        p(''),
        h3('本周工作总结与下周计划'),
        infoTable([
            ['本周亮点', '___________________________'],
            ['遇到的主要困难', '___________________________'],
            ['需要支持的事项', '___________________________'],
            ['下周重点目标', '___________________________'],
            ['下周计划走访片区', '___________________________']
        ])
    );
    return children;
}

// =============================================================================
// PART C: MARKETING & BD TOOLS (市场部/BD工具)
// =============================================================================

// C1: Investment Event Presentation Slide-by-Slide Script
function buildC1_PresentationScript() {
    var children = [].concat(
        h1('C1  招商会销讲PPT逐页脚本'),
        p('以下为30分钟标准招商演示的20页逐页脚本。每页包含：标题、核心信息、讲述要点、过渡语。可直接用作PPT制作的逐页大纲。'),
        divider(),

        h2('一、演示整体结构'),
        dataTable(
            ['页码', '模块', '标题', '时长'],
            [
                ['P01', '封面', '链邦赋商通——面向社区商业的数字经营平台', '30秒'],
                ['P02', '开场钩子', '一个社区商家每天流失多少顾客？', '1分钟'],
                ['P03', '行业痛点', '本地商家的三大经营困境', '1.5分钟'],
                ['P04', '市场机会', '万亿社区商业市场的数字化蓝海', '1.5分钟'],
                ['P05', '平台定位', '链邦赋商通：我们做什么、不做什么', '1.5分钟'],
                ['P06', '核心创新', '四大核心机制——重新定义社区商业', '2分钟'],
                ['P07', '模式总图', '交易即分润——一张图看懂商业模式', '2分钟'],
                ['P08', '消费流转', '从平台商家→联盟商家→综合商城——消费流转飞轮', '2分钟'],
                ['P09', '权益互通', '跨店通兑——在A店获券、B店使用', '1.5分钟'],
                ['P10', '三元营销', '代金券+积分+消费金——三引擎驱动复购', '1.5分钟'],
                ['P11', '千面千店', '三大业态、差异化服务——每个商家都有专属阵地', '1分钟'],
                ['P12', '分账体系', '透明分账——每笔交易清清楚楚', '1.5分钟'],
                ['P13', '三级网络', '城市服务商→服务站→推广者——三级管理体系', '1.5分钟'],
                ['P14', '合规体系', '三条红线+16项术语替换——合规即壁垒', '1.5分钟'],
                ['P15', '竞品对比', '链邦赋商通 vs 美团/抖音/有赞——五大维度全面对比', '2分钟'],
                ['P16', '财务模型', '盈亏平衡40,500笔/月——轻资产模式的财务逻辑', '2分钟'],
                ['P17', '合作模式', '城市服务商/服务站/推广者——三种合作方式', '1.5分钟'],
                ['P18', '发展规划', '三阶段发展路线图', '1.5分钟'],
                ['P19', '行动号召', '现在加入——公测期的先发优势', '1分钟'],
                ['P20', 'Q&A + 尾页', '感谢聆听·期待合作', '2分钟']
            ],
            { small: true }
        ),

        divider(),
        h2('二、关键页面逐页脚本（精选）'),

        h3('P02 开场钩子——"一个社区商家每天流失多少顾客？"'),
        calloutBox('讲述要点', [
            '开场抛出一个具体数字：一个社区餐饮店，每天进店100人，其中约70人是周边居民',
            '但这70人中，有多少会成为回头客？——答案是不到15人',
            '为什么？因为商家没有工具跟顾客建立长期关系——顾客今天来、明天忘',
            '"但如果有一个平台——顾客每次消费都有记录、有积分、有优惠券——而且这些券在隔壁店也能用——顾客还会忘吗？"',
            '由此引出链邦赋商通'
        ], C.LIGHT),

        h3('P06 核心创新——"四大核心机制"'),
        calloutBox('讲述要点', [
            '① 商户独立经营（千面千店）：平台商家深度自定义→联盟商家模板化→综合商城标准化。每个商家有专属的品牌页面。',
            '② 生态会员互通：消费者在任意一家店消费，即成为全平台会员——无需反复注册。',
            '③ 消费权益流转（跨店通兑）：A店消费获券 → B店也能用。这是我们的核心差异化——全平台权益互通。',
            '④ 真实交易激励（交易即分润）：零固定费用、零预充值——只在商家实际成交时收取服务费。'
        ], C.LIGHT),

        h3('P14 合规体系——"合规即壁垒"'),
        calloutBox('讲述要点', [
            '很多平台在合规上踩坑——资金池、多级分销、收益承诺——最后被监管清理。',
            '链邦赋商通从第一天就建立三条红线：积分不兑现、不碰资金池、不承诺收益。',
            '16项术语强制替换——从"数字资产"到"消费权益"，从"收益"到"服务费"——每一个词都经过法务审核。',
            '"合规不是限制——合规是我们的护城河。监管越严格，合规平台越有优势。"'
        ], C.LIGHT),

        h3('P19 行动号召——"公测期的先发优势"'),
        calloutBox('讲述要点', [
            '公测期是最佳进入时机——现在入驻的商家享受最好的搜索权重、最低的服务费率、最多的扶持资源。',
            '城市服务商：首批仅开放XX个城市/区域——先到先占位。',
            '推广者：第一批推广者享受最高佣金比例和最完整的培训支持。',
            '"在这个万亿市场里，位置比努力更重要——今天的位置决定了明天的份额。"'
        ], C.LIGHT),

        divider(),
        h2('三、Q&A预演（15题精选）'),
        dataTable(
            ['序号', '可能提问', '标准回答'],
            [
                ['1', '你们跟美团有什么区别？', '美团是外卖+到店平台，收18-22%服务费。我们是社区经营平台，收5%左右，帮商家提升复购率，不是抢他们的外卖订单。'],
                ['2', '凭什么说能帮商家提升复购？', '三元营销体系——代金券拉新、积分留客、消费金锁客——三个工具协同，配合跨店通兑的客流引导。'],
                ['3', '跨店通兑合法吗？', '完全合法。消费者权益在平台内部流转——资金由汇付（持牌支付机构）直接清分，不形成资金池，不构成"二清"。'],
                ['4', '你们有支付牌照吗？', '我们不持有资金——所有交易由汇付（持牌支付机构）直接清分至各方账户。平台只收服务费，不触碰交易资金。'],
                ['5', '推广者模式是不是传销？', '绝对不是。推广者只有一层，收入基于自己拓展商家的交易额。零入门费、不发展下线、不拉人头——完全符合监管。'],
                ['6', '平台能撑多久？', '我们的母公司是全球拼购（GGbingo），有足够的资本和战略定力。盈亏平衡仅需40,500笔/月，财务模型健康。'],
                ['7', '商家数据安全吗？', '客户消费数据归商家所有，平台不截留、不出售。商家可以随时导出自己的客户数据。'],
                ['8', '如果商家要退出？', '随时退出，无违约金、无任何费用。已产生的交易正常结算，未使用的代金券由平台回收。'],
                ['9', '城市服务商有什么权限？', '区域合伙人身份——独立经营权。负责区域内的服务站招募和管理，获得区域总交易额的1%分成。'],
                ['10', '收入是固定的吗？', '不固定。推广者/服务商收入完全基于实际交易——多劳多得、少劳少得、不劳不得。我们不对收入做任何承诺。'],
                ['11', '你们融过资吗？', '目前由母公司全球拼购战略支持。根据业务发展需要适时启动外部融资。'],
                ['12', '技术团队实力如何？', '我们有独立的技术团队，小程序基于微信生态开发，支付对接汇付——技术架构稳定、可扩展。'],
                ['13', '公测期有什么特殊政策？', '首月服务费减半、新人礼包平台补贴、首页推荐位7天、推广者专属对接——公测期是最佳入驻窗口。'],
                ['14', '竞品来了怎么办？', '我们的核心壁垒是"跨店通兑"——这需要同时建立消费者、商家、推广者三边网络，先发优势极强。'],
                ['15', '下一步怎么合作？', '根据您的角色——城市服务商/服务站/推广者/商家——我们有对应的合作方案。我们可以会后一对一详细沟通。']
            ],
            { small: true }
        ),

        divider(),
        h2('四、开场与结尾仪式'),
        calloutBox('开场仪式（P01→P02，约1分钟）', [
            '1. 主持人介绍：欢迎各位来到链邦赋商通招商说明会',
            '2. 播放15秒品牌短片（如有）或展示封面页',
            '3. 讲者自我介绍+今日议程概览',
            '4. 抛出钩子问题："在座各位——你们觉得一个社区商家，每天流失的最大成本是什么？"',
            '5. 等待3秒 → 翻到P02："不是房租、不是人工——是那些来了但没再回来的顾客。"'
        ], C.LIGHT),
        calloutBox('结尾仪式（P19→P20，约2分钟）', [
            '1. 总结三个关键数字："5%服务费、40,500笔盈亏平衡、零固定费用"',
            '2. 重申价值主张："在链生活，在哪花都在省，在哪得的券都能用"',
            '3. 行动号召："公测期窗口有限——今天会后，我们的同事会在洽谈区等候各位。不管您今天是来了解、来考察、还是来合作——我们都准备好了。"',
            '4. 感谢+联系方式+洽谈指引',
            '5. 最后一句："谢谢各位。我们在洽谈区见。"'
        ], C.LIGHT),

        divider(),
        p('📌 以上脚本可配合实际PPT使用。演示者应根据现场氛围灵活调整节奏和内容深度。Q&A环节建议安排1-2位同事协助回答问题。', { color: C.GRAY, italics: true })
    );
    return children;
}

// C2: Merchant Tiering & Conversion Strategy
function buildC2_MerchantConversion() {
    var children = [].concat(
        h1('C2  商家分层转化策略表'),
        p('以下为商家分层管理工具和转化漏斗，帮助BD团队制定精准的商家拓展和运营策略。'),
        divider(),

        h2('一、商家资格矩阵（按业态和品类）'),
        dataTable(
            ['业态', '适合品类', '月GMV门槛', '服务费率', '搜索权重', '推荐占比'],
            [
                ['平台商家', '品牌餐饮/连锁零售/生活服务品牌', '≥¥20,000', '≈5%', '+2（优先展示）', '30%'],
                ['联盟商家', '社区餐饮/便利店/美发/药店/维修', '≥¥5,000', '≈4.5%+引流费', '0（基准位）', '55%'],
                ['综合商城', '标品零售/日用品/食品饮料', '不限', '≈6%', '-2（补充展示）', '15%']
            ],
            { small: true }
        ),

        divider(),
        h2('二、三段转化漏斗'),
        dataTable(
            ['阶段', '定义', '进入标准', '退出标准（进入下一阶段）', '典型周期', 'BD核心动作', '参考转化率'],
            [
                ['线索→意向', '从获取商家信息到商家表达兴趣', '获取商家联系方式或进店拜访', '商家同意产品演示或索要详细资料', '1-3天', '进店拜访/电话初访/发送平台一页纸', '30-40%'],
                ['意向→签约', '从表达兴趣到完成入驻注册', '商家同意产品演示', '完成小程序注册+资料提交', '3-7天', '产品演示/异议处理/协助注册/展示成功案例', '40-50%'],
                ['签约→激活', '从注册完成到产生首笔线上交易', '注册+资料提交完成', '≥5个商品上架+完成首笔真实交易', '3-7天', '模板选择指导/商品上架协助/首单引导/分享话术', '60-70%']
            ],
            { small: true }
        ),
        p('整体转化率（线索→激活）：约 7-14%（30%×45%×65%）。提升关键在"意向→签约"阶段——异议处理能力直接影响转化。', { color: C.GRAY }),

        divider(),
        h2('三、分层支持策略'),
        dataTable(
            ['商家层级', '月GMV范围', '复购率', '营销支持', 'BD维护频率'],
            [
                ['🥉 青铜', '< ¥5,000', '< 15%', '基础模板 + 自助工具 + 平台通用活动', '月度回访'],
                ['🥈 白银', '¥5,000 - 20,000', '15-30%', '代金券发放比例提升至6% + 社区活动优先', '双周回访'],
                ['🥇 黄金', '¥20,000 - 80,000', '30-50%', '首页推荐位 + 定制化营销方案 + 专属BD对接', '每周沟通'],
                ['💎 钻石', '> ¥80,000', '> 50%', '城市服务商1对1 + 品牌联合推广 + 数据看板', '随时响应']
            ],
            { small: true }
        ),

        divider(),
        h2('四、按品类异议处理指南'),
        dataTable(
            ['品类', '主要顾虑', '应对策略', '关键说服点'],
            [
                ['餐饮', '"已经有美团了""抽成太高"', '强调互补而非替代——堂食复购是美团做不了的', '跨店通兑：隔壁餐厅的顾客会被导流到你的店'],
                ['零售/便利店', '"客人本来就常来，不需要"', '积分和代金券让常客来得更勤、买得更多', '积分留客：100积分=¥1，常客每月多来2次'],
                ['生活服务（美发/美甲）', '"客人预约为主，线上没用"', '线上展示+预约+评价体系提升新客获取', '新客获取：社区3公里内的新居民找不到你的店'],
                ['药店/维修', '"低频消费不适合"', '低频更需要会员体系——一次服务后积分锁定下次', '消费金：低频高客单价场景最适合消费金锁客']
            ],
            { small: true }
        )
    );
    return children;
}

// C3: Regional Market Penetration Battle Map
function buildC3_MarketPenetration() {
    var children = [].concat(
        h1('C3  区域市场渗透作战图'),
        p('以下为区域市场拓展的标准框架和工具模板，供城市服务商和市场部制定区域渗透计划使用。'),
        divider(),

        h2('一、市场分析框架'),
        p('在选择目标社区/片区时，使用以下6维度评估：'),
        dataTable(
            ['评估维度', '权重', '评分标准', '数据来源'],
            [
                ['居住人口密度', '25%', '高(>1万/km²)=5分 / 中=3分 / 低=1分', '公开数据/实地调研'],
                ['商业密度（商户数/km²）', '25%', '高(>200家)=5分 / 中=3分 / 低=1分', '地图POI数据/实地走访'],
                ['竞品渗透率', '20%', '低(<10%商家已用竞品)=5分 / 中=3分 / 高=1分', '竞品App查询/商家访谈'],
                ['人均消费水平', '10%', '高=5分 / 中=3分 / 低=1分', '区域经济数据'],
                ['社区封闭性', '10%', '高（封闭社区/大型小区）=5分 / 中=3分 / 低=1分', '实地调研'],
                ['交通便利度', '10%', '地铁/公交覆盖=5分 / 公交=3分 / 偏远=1分', '地图分析']
            ],
            { small: true }
        ),
        p('综合评分 = Σ(维度分×权重)，≥4.0分为优先渗透目标，3.0-3.9分为次优目标，<3.0分为暂缓目标。', { color: C.GRAY }),

        divider(),
        h2('二、三期渗透计划'),
        phaseCard('🔍 侦查期（第1-2周）', '目标：摸清片区商业全貌', [
            '完成目标片区6维度评估打分',
            '走访片区内所有潜在合作商家（≥50家），记录品类/规模/经营状态/现有平台使用情况',
            '绘制片区商户分布热力图（按品类着色）',
            '访谈10位以上商家老板，了解经营痛点和数字化意愿',
            '确定3-5个突破口（最适合首攻的社区或街道）',
            '招聘或指派该片区的推广者/服务站候选人'
        ], C.MAIN),

        phaseCard('⚡ 突破期（第3-6周）', '目标：建立标杆商家群', [
            '集中攻克3-5个突破口，目标签约30-50家商家',
            '先签3-5家"种子商家"——品类覆盖餐饮+零售+服务，便于展示跨店通兑效果',
            '种子商家开业首周重点运营——确保首单破零 + 消费者扫码注册',
            '利用种子商家案例进行片区传播——"隔壁那家XX店已经入驻了"',
            '同步招募推广者——从活跃消费者和种子商家中转化',
            '每周评估突破进度——如果4周签约<20家，分析原因并调整策略'
        ], BRAND.BRAND_RED),

        phaseCard('🌐 覆盖期（第7-12周）', '目标：形成片区网络效应', [
            '从突破口向周边扩散——以老带新，利用已入驻商家的口碑',
            '片区商家覆盖率达到30%（约150家以上）',
            '消费者注册渗透率达到片区居民的15%',
            '推广者网络成型——每1万人配置至少1位推广者',
            '启动片区级营销活动——"XX社区消费节"——全片区商家参与',
            '数据监测：片区月交易量、商家活跃率、消费者复购率',
            '达标后转常态化运营——BD团队转向下一片区'
        ], BRAND.TECH_BLUE),

        divider(),
        h2('三、资源配置模板'),
        p('以下为单个标准片区（覆盖3-5万人口、150-300家商户）的推荐资源配置：'),
        dataTable(
            ['资源类型', '侦查期（2周）', '突破期（4周）', '覆盖期（6周）', '合计（12周）'],
            [
                ['BD人力', '1人全职', '2-3人全职', '1-2人全职', '——'],
                ['推广者', '——', '3-5人兼职', '5-10人兼职', '——'],
                ['营销预算', '¥2,000（调研）', '¥15,000（活动+物料）', '¥20,000（片区活动）', '¥37,000'],
                ['物料', '平台一页纸×100份', '入驻引导表+海报+立牌', '社区活动物料+横幅', '——'],
                ['关键产出', '片区评估报告', '30-50家签约+15家激活', '覆盖率30%+网络成型', '——']
            ],
            { small: true }
        ),

        divider(),
        h2('四、Go/No-Go决策节点'),
        calloutBox('决策点1：侦查期结束（第2周末）', [
            'Go条件：综合评分≥3.0分、商家沟通意愿积极（>30%愿意进一步了解）',
            'No-Go条件：综合评分<2.5分或竞品渗透率>50%且商家满意度高',
            '条件触发：如果评分≥3.0但商家意愿低——调整话术和切入点，延长侦查期1周'
        ], C.LIGHT),
        calloutBox('决策点2：突破期中期（第4周末）', [
            'Go条件：签约≥20家、激活≥8家、消费者注册≥500人',
            'No-Go条件：签约<10家或激活<3家、消费者注册<200人',
            '条件触发：如果签约达标但激活低——重点投入首单引导和商家运营支持'
        ], C.LIGHT)
    );
    return children;
}

// C4: Triple Marketing Configuration Calculator
function buildC4_TripleMarketingCalc() {
    var children = [].concat(
        h1('C4  三元营销配置计算器'),
        p('以下为代金券、积分、消费金三种营销工具的配置参考和情景模拟。BD人员可用此工具为商家定制营销方案。'),
        divider(),

        h2('一、三元营销工具概览'),
        dataTable(
            ['维度', '代金券（获客钩子）', '积分（留存引擎）', '消费金（长期锁客）'],
            [
                ['核心功能', '拉新获客', '促进复购', '锁定长期关系'],
                ['发放/累积规则', pct(MARKETING.voucher.issueRate) + ' 每笔交易额', '1元消费 = 100积分', '平台商家3% / 联盟2% / 商城3%'],
                ['使用上限', '最高抵扣订单' + pct1(MARKETING.voucher.maxDeduction), '最高抵扣订单' + pct1(MARKETING.points.maxDeduction), '最高抵扣订单' + pct1(MARKETING.credit.maxRedemption)],
                ['有效期', MARKETING.voucher.validityDays + '天', MARKETING.points.validityDays + '天（2年）', MARKETING.credit.validityDays + '天（12个月）'],
                ['全平台通用', '是 ✓', '是 ✓', '是 ✓'],
                ['资金来源', '营销池（3.5-4%）', '平台服务费', '对应业态消费金比例'],
                ['典型场景', '新店开业/节日大促/老带新', '日常复购/积分翻倍日/叠加优惠', '家庭共享/社区拼团/年度回馈'],
                ['对商家影响', '让利吸引新客，短期让利换长期客流', '提升客单价和复购频次', '锁定高价值顾客的长期消费']
            ],
            { small: true }
        ),

        divider(),
        h2('二、配置参数影响分析'),
        p('调整各项参数对商家和平台的影响：'),
        dataTable(
            ['参数调整', '对消费者的影响', '对商家的影响', '对营销池的影响', '建议范围'],
            [
                ['代金券发放率 ↑（5%→8%）', '获得更多代金券，吸引力增强', '更多新客进店，但让利增加', '营销池消耗增加60%', '公测期可提至8%'],
                ['代金券抵扣上限 ↑（30%→40%）', '大额消费更省，使用意愿增强', '大单转化率提升', '营销池消耗增加', '不建议——影响客单价分布'],
                ['积分兑换率 ↓（100:1→200:1）', '积分"不值钱"，使用意愿下降', '留存效果减弱', '平台成本降低', '不建议——100:1是行业心理线'],
                ['消费金比例 ↑（3%→5%）', '长期锁客效果增强', '锁定高价值顾客，但当前让利增加', '需从其他分配方调整', '仅对钻石商家考虑'],
                ['代金券有效期 ↓（90天→30天）', '紧迫感增强，但可能引发不满', '短期客流爆发', '未使用券回收，营销池回流', '节日营销时可缩短至30天']
            ],
            { small: true }
        ),

        divider(),
        h2('三、三券叠加黄金法则'),
        flowBox('三券可叠加使用，但总抵扣不超过订单金额的50%。优先级：消费金（优先抵扣）→ 代金券 → 积分（最后抵扣）。消费者支付顺序：订单金额 - 消费金 - 代金券 - 积分 = 实际支付。', false),

        divider(),
        h2('四、营销预算影响模拟'),
        p('以下为不同交易量下营销池规模和分配参考（以平台商家4%营销池为例）：'),
        dataTable(
            ['月交易笔数', '月GMV（按¥100客单价）', '营销池总额', '代金券预算(70%)', '推广激励(15%)', '活动(10%)', '机动(5%)'],
            [
                ['1万笔', '¥100万', '¥40,000', '¥28,000', '¥6,000', '¥4,000', '¥2,000'],
                ['2万笔', '¥200万', '¥80,000', '¥56,000', '¥12,000', '¥8,000', '¥4,000'],
                ['4.05万笔（盈亏平衡）', '¥405万', '¥162,000', '¥113,400', '¥24,300', '¥16,200', '¥8,100'],
                ['8万笔', '¥800万', '¥320,000', '¥224,000', '¥48,000', '¥32,000', '¥16,000'],
                ['10万笔', '¥1,000万', '¥400,000', '¥280,000', '¥60,000', '¥40,000', '¥20,000']
            ],
            { small: true }
        ),
        p('注：以上为平台商家（4%营销池）的模拟。联盟商家为3.5%，综合商城为3.5%，对应数字按比例调整。', { color: C.GRAY, size: 18 }),
        calloutBox('对BD的建议', [
            '向商家推荐营销方案时，优先讲"三元叠加"效果——单券力度有限，三券叠加效果明显',
            '不必一开始就调参数——标准配置已能满足大多数场景',
            '重点关注代金券发放率——这是商家最敏感的"让利感"指标',
            '消费金适合推荐给高客单价、低频消费的商家（如家电维修、大额餐饮）'
        ], C.LIGHT)
    );
    return children;
}

// C5: Competitive Response Talking Points Library
function buildC5_CompetitiveResponse() {
    var children = [].concat(
        h1('C5  竞品应对话术库'),
        p('以下为面对竞品时的标准化应对话术。每个战场包含：竞品攻击点、我方回应、证据支撑、适用场景。'),
        divider(),

        h2('一、vs 美团（6大战场）'),
        h3('战场1：服务费对比'),
        calloutBox('竞品攻击点', ['"你们比美团便宜？便宜没好货吧"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['美团收18-22%是因为他们要做外卖配送、要做全国广告投放、要养几万人的地推团队。我们不做外卖配送、专注社区复购——所以成本结构完全不同。便宜不是因为我们"差"，是因为我们做的不是同一件事。', '美团财报：外卖业务take rate约18-22%；链商平台商家服务费≈5%', '商家质疑价格']
            ],
            { small: true }
        ),

        h3('战场2：流量对比'),
        calloutBox('竞品攻击点', ['"美团有6亿用户，你们才多少用户？"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['美团的流量是全国性的泛流量——一个北京的用户不会在美团上订你社区店的餐。我们的流量是社区精准流量——注册用户就是你3公里内的潜在顾客。100个精准流量比1万个泛流量对社区商家有价值得多。', '社区商业>"3公里服务半径"特征；精准流量转化率远高于泛流量', '商家质疑用户量']
            ],
            { small: true }
        ),

        h3('战场3：复购能力'),
        calloutBox('竞品攻击点', ['"美团也能做会员、发优惠券啊"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['美团的会员和优惠券是平台级别的——消费者对美团忠诚，不对你的店忠诚。我们的三元营销是商家级别的——代金券、积分、消费金围绕你的店运转。而且跨店通兑意味着——消费者在隔壁店得的券，也能到你店用。（美团做不到这点）', '美团优惠券=平台券，仅在特定商家可用；链商代金券=全平台通用', '商家比较会员体系']
            ],
            { small: true }
        ),

        h3('战场4：数据归属'),
        calloutBox('竞品攻击点', ['"美团也提供商家数据分析啊"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['美团给你看的是他们让你看的数据——客户联系方式、消费偏好这些核心数据他们不会给你。在链商，客户消费数据归你所有——你可以导出、分析、直接触达。我们不截留数据。', '数据归属承诺是链商的核心差异化', '商家关注数据安全']
            ],
            { small: true }
        ),

        h3('战场5：入驻成本'),
        calloutBox('竞品攻击点', ['"美团入驻也很简单啊，上传资料就行了"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['美团的"简单"后面跟着的是——竞价排名费、推广通费用、活动报名费……这些隐形成本加起来远超表面上的服务费。链商——零固定费用、零竞价排名费、零活动报名费。就是字面意思的零。', '美团商家后台有多个付费推广入口；链商不对基础功能收费', '商家比较总成本']
            ],
            { small: true }
        ),

        h3('战场6：长期关系'),
        calloutBox('竞品攻击点', ['"做哪个平台不是做？能赚钱就行"'], C.LIGHT),
        dataTable(
            ['我方回应', '证据/数据支撑', '适用场景'],
            [
                ['做美团，你是美团的履约点——顾客来因为美团，走因为美团，跟你没关系。做链商，顾客是你的顾客——他们的消费记录、积分、优惠券全部围绕你的店。一个帮你建立自己的客户资产，一个让你越来越依赖平台。选哪个？', '平台vs自营关系对比', '商家长期战略考虑']
            ],
            { small: true }
        ),

        divider(),
        h2('二、vs 抖音本地生活（4大战场）'),
        dataTable(
            ['战场', '我方回应要点', '关键差异'],
            [
                ['流量性质', '抖音是内容流量——用户刷到你的视频才来，不刷就不来。我们是社区刚需流量——用户要吃饭、要买东西，自然打开小程序找附近的店。', '冲动消费 vs 刚需复购'],
                ['用户留存', '抖音用户跟着内容走——哪个商家拍得好去哪家。我们的用户跟着权益走——在哪个商家攒了积分就回哪家。前者靠爆款，后者靠体系。', '内容驱动 vs 权益驱动'],
                ['商家门槛', '抖音需要商家会拍视频、会做直播、会运营账号——对社区小店来说门槛太高。我们的商家只需要会拍照、填信息——用发朋友圈的难度经营一个线上店。', '内容能力要求 vs 零内容门槛'],
                ['成本结构', '抖音除了服务费，商家还需要投入内容制作成本（拍摄/剪辑/运营）和可能的投放费用。链商只有服务费，无额外投入。', '隐性成本差异']
            ],
            { small: true }
        ),

        divider(),
        h2('三、vs 有赞/微盟（3大战场）'),
        dataTable(
            ['战场', '我方回应要点', '关键差异'],
            [
                ['价格门槛', '有赞基础版年费¥6,800起——对社区小店是一笔不小的固定投入。链商零固定费用，成交才收费——没有经营风险。', '年费制 vs 交易分成制'],
                ['流量来源', '有赞给你一个工具——但流量从哪来？你自己想办法。链商不仅给你工具，还通过跨店通兑从全平台给你导流。', '工具型 vs 平台型'],
                ['生态协同', '有赞的商家是孤岛——A店的会员跟B店没关系。链商的会员全平台互通——消费者在平台任意商家消费都在为你积累潜在客流。', '单店封闭 vs 生态互通']
            ],
            { small: true }
        ),

        divider(),
        h2('四、竞品异议应对总表（20条精选）'),
        p('以下为按频率排序的商家竞品异议及标准应对。BD团队应熟练掌握前10条。', { bold: true }),
        dataTable(
            ['序号', '异议/攻击点', '一句话回应', '深入说明'],
            [
                ['1', '美团比你们大', '"大不代表对你好——美团的流量不是你的流量"', '美团做全国、你开店在一个社区。对你来说，100个社区精准用户>1万个全国泛用户。'],
                ['2', '抖音比你们火', '"火的是内容，不是你的店——昨天爆款今天可能没人看"', '抖音的算法决定流量极不稳定。社区消费是每天都要发生的，需要稳定的复购体系。'],
                ['3', '你们没有知名度', '"今天的不知名=明天的先发优势——最早上船的商家占最好的位置"', '等平台做大了再进来，你的搜索排名已经在第3页以后了。'],
                ['4', '怕平台做不起来', '"我们有母公司全球拼购的战略支持，这不是短期项目"', META.parent + '背书+盈亏平衡仅40,500笔/月。'],
                ['5', '已经是美团/抖音的付费商家', '"不冲突——我们是互补关系，帮您把一次性顾客变成回头客"', '多平台经营是趋势。链商聚焦复购，其他平台做获客，各司其职。'],
                ['6', '觉得抽成还是太高', '"5%换复购率提升10-20%——您的综合利润是增长的"', '不要只看费率，看综合收益：复购率提升→月GMV增长→总利润增长。'],
                ['7', '担心平台会涨价', '"我们公开分账比例，参数修改须经五步审批——不是随便能改的"', '透明的分账体系写在平台规则里，不会暗中涨价。'],
                ['8', '怕被平台绑架', '"您的客户数据归您——随时可以导出、随时可以退出——零违约金"', '我们没有锁客机制——商家来去自由。（这正是我们的底气）'],
                ['9', '觉得线上对线下没帮助', '"客人到店是一次性的——但有了积分和券，他们下次还会想起来你这"', '线上不是替代线下，是帮您把一次性的线下客流变成持续的线上关系。'],
                ['10', '说"考虑考虑"就没下文了', '"我完全理解——您需要时间评估。这样，我这周五下午再来一次，您先看看这份资料"', '给期限、留资料、定回访——不要让"考虑考虑"变成永远的拖延。'],
                ['11', '已经有会员系统了', '"您的会员系统只能在您的店用——我们的会员系统能让隔壁店的顾客也变成您的顾客"', '跨店通兑是任何单店会员系统不可能做到的。'],
                ['12', '担心消费者不愿意下载App', '"不需要下载App——微信小程序，扫码即用，10秒注册"', '零下载门槛=消费者转化率远高于需要下载App的平台。'],
                ['13', '觉得平台同质化', '"你见过哪个平台能让顾客在A店消费、B店用券？这就是我们的独特之处"', '跨店通兑目前没有竞品真正做到——这是我们的护城河。'],
                ['14', '怕麻烦、懒得弄', '"全程我们上门服务，您只需要提供基本资料——总共不到2小时的操作"', '7天开店倒计时见B2——操作时间2小时，其余由服务团队完成。'],
                ['15', '更信任大品牌', '"大品牌能给社区小店提供个性化服务吗？我们的服务站就在你隔壁"', '大平台是冰冷的——我们是社区里的人，是你的邻居。'],
                ['16', '说已经在用竞品而且满意', '"太好了——说明您认可数字化经营。多一个平台多一个渠道，不冲突"', '满意的商家是最好的合作对象——他们对数字化工具有认知，上手更快。'],
                ['17', '觉得没有成功案例', '"公测期刚启动——第一批入驻的商家就是未来的成功案例。你想成为案例本人还是听别人讲案例？"', '首批商家享有最好的政策和位置——这是先发红利。'],
                ['18', '合伙人/配偶不同意', '"那约个时间我一起给两位讲解——决策一起做，入驻后一起经营"', '不绕过决策人——家庭式决策在社区商业中非常普遍。'],
                ['19', '担心平台收集太多数据', '"我们只收集经营必需的数据——不收集客户隐私——数据归你所有"', '明确说明数据范围和归属——打消隐私顾虑。'],
                ['20', '觉得"以后再说"', '"公测期的扶持政策是限时的——以后入驻没有首月服务费减半、没有首页推荐7天"', '制造合理紧迫感——公测期确实是特殊窗口。']
            ],
            { small: true }
        ),
        greenCheck('BD团队应该定期（建议每周）进行竞品话术演练——每人抽一条异议，现场回应，队友点评。这是提升团队战斗力的最有效方式。')
    );
    return children;
}

// =============================================================================
// PART D: INVESTMENT EVENT TOOLS (招商会专用工具)
// =============================================================================

// D1: Investment Event Full-Cycle Execution Checklist
function buildD1_EventExecution() {
    var children = [].concat(
        h1('D1  招商会全流程执行清单'),
        p('以下为一场标准招商会（30-50人规模）的全流程执行清单。可根据实际规模和形式调整。'),
        divider(),

        h2('一、会前14天倒计时'),
        dataTable(
            ['倒计时', '任务', '负责人', '完成标志'],
            [
                ['D-14', '确定招商会目标、规模、主题、日期', '市场部负责人', '招商会立项确认'],
                ['D-13', '预订场地（容纳50-80人，含演示区+洽谈区）', '行政/BD', '场地确认书'],
                ['D-12', '确定邀请名单（商家/推广者/城市服务商候选人）', 'BD团队', '邀请名单定稿'],
                ['D-11', '设计并制作邀请函（电子版+纸质版）', '品牌部', '邀请函定稿'],
                ['D-10', '发送首轮邀请（微信+短信+电话）', 'BD团队', '发出≥80%邀请'],
                ['D-9', '准备演示设备和环境（投影/音响/网络/小程序演示机）', '技术支持', '设备调试完成'],
                ['D-8', '制作招商会PPT和演示材料', '市场部/品牌部', 'PPT定稿'],
                ['D-7', '准备物料清单（见下方）中的印刷品', '品牌部/行政', '物料到货'],
                ['D-6', '主持人+讲者彩排（第一轮）', '全团队', '彩排完成+修改意见'],
                ['D-5', '发送第二轮邀请+确认出席', 'BD团队', '确认出席率≥60%'],
                ['D-4', '准备签约工具包（意向书/商户登记表/合同模板）', '法务/BD', '签约包就绪'],
                ['D-3', '主持人+讲者彩排（第二轮，全流程）', '全团队', '全流程走通'],
                ['D-2', '场地布置（横幅/展架/签到台/洽谈区/演示区）', '行政/BD', '场地就绪'],
                ['D-1', '最终确认出席名单+发送提醒+最终walk-through', 'BD/全团队', '一切就绪']
            ],
            { small: true }
        ),

        divider(),
        h2('二、活动日Run-of-Show'),
        dataTable(
            ['时间', '环节', '内容', '负责人', '备注'],
            [
                ['13:00-13:30', '签到+暖场', '来宾签到、领取资料袋、引导入座。循环播放品牌短片。', '签到组', '准备签到表和铭牌'],
                ['13:30-13:35', '开场', '主持人欢迎辞、介绍议程、暖场互动。', '主持人', '控制在5分钟以内'],
                ['13:35-14:05', '主题演讲', '30分钟标准演示（C1脚本）。', '主讲人', '严格控时，不拖堂'],
                ['14:05-14:20', '小程序演示', '现场演示消费者端+商家端小程序。', '演示人', '准备测试账号'],
                ['14:20-14:35', '成功案例/视频', '播放1-2个种子商家采访视频或PPT展示。', '——', '如无视频可用PPT'],
                ['14:35-14:50', '茶歇+自由交流', '来宾自由交流、观看展板、操作演示机。', '全团队', 'BD主动与目标来宾攀谈'],
                ['14:50-15:10', 'Q&A环节', '主讲人+BD负责人回答现场提问。', '主讲人+BD负责人', '准备15道标准Q&A'],
                ['15:10-15:20', '合作模式介绍', '城市服务商/服务站/推广者/商家四种合作方式简述。', 'BD负责人', '引导至洽谈区'],
                ['15:20-16:00', '一对一洽谈', 'BD人员与意向来宾一对一沟通、答疑、推进签约。', 'BD团队', '每人准备签约工具包'],
                ['16:00-16:15', '现场签约仪式', '确认合作意向的来宾现场签署意向书。', 'BD+法务', '准备拍照留念'],
                ['16:15-16:30', '闭幕+感谢', '主持人总结、感谢来宾、引导后续跟进。', '主持人', '收集反馈问卷']
            ],
            { small: true }
        ),

        divider(),
        h2('三、场地物料清单'),
        dataTable(
            ['类别', '物料名称', '数量', '备注'],
            [
                ['品牌展示', '主背景板（3×2m）', '1块', '链商红+Logo'],
                ['品牌展示', '易拉宝/X展架', '4个', '入口1/签到处1/讲台两侧各1'],
                ['品牌展示', '品牌短片/PPT', '1份', '循环播放'],
                ['印刷资料', '平台一页纸（A4双面）', '60份', '见A1'],
                ['印刷资料', '合作方案手册', '40份', '按角色分发'],
                ['印刷资料', '签约工具包', '20份', '见D5'],
                ['印刷资料', '品牌画册（如有）', '30份', '精装版给VIP'],
                ['签到用品', '签到表/电子签到二维码', '1份', '含姓名/联系方式/意向角色'],
                ['签到用品', '来宾铭牌/胸贴', '60个', '颜色按角色区分'],
                ['签到用品', '资料袋', '50个', '含一页纸+手册+名片'],
                ['演示设备', '投影仪+幕布', '1套', '提前测试'],
                ['演示设备', '音响+话筒', '2支', '主讲1+Q&A1'],
                ['演示设备', '演示用手机/平板', '2台', '登录测试账号'],
                ['茶歇', '饮品+小食', '50人份', '中场茶歇'],
                ['其他', '签约拍照背景板', '1块', '签约仪式专用'],
                ['其他', '反馈问卷（纸质/电子）', '50份', '离场时回收']
            ],
            { small: true }
        ),

        divider(),
        h2('四、会后7天跟进'),
        dataTable(
            ['会后天数', '跟进动作', '负责人'],
            [
                ['当天', '发送感谢短信/微信给所有参会来宾', 'BD团队（各自跟进自己负责的来宾）'],
                ['D+1', '汇总签约意向、录入CRM、分配跟进人', 'BD负责人'],
                ['D+2', '电话跟进所有表达了意向但未现场签约的来宾', 'BD团队'],
                ['D+3', '约见面深度沟通（高意向→本周内完成会面）', 'BD团队'],
                ['D+5', '发送补充资料（投资测算模板/商家案例等）', 'BD团队'],
                ['D+7', '完成首轮跟进报告：签约率、意向率、反馈汇总', 'BD负责人→市场部']
            ],
            { small: true }
        ),
        flowBox('招商会核心指标：到场率 ≥ 邀请数的60%、意向率 ≥ 到场数的40%、签约率 ≥ 意向数的50%、会后7天二次签约 ≥ 意向数的20%', false)
    );
    return children;
}

// D2: City Partner Recruitment Package
function buildD2_CityPartnerRecruitment() {
    var children = [].concat(
        h1('D2  城市服务商招募方案'),
        p('以下为城市服务商（区域合伙人）招募的完整工具包：角色概览、收入模型、自评清单、合同要点。'),
        divider(),

        h2('一、城市服务商角色概览'),
        infoTable([
            ['角色名称', MANAGEMENT.cityPartner.role + '（区域合伙人）'],
            ['定位', '区域市场的独立经营者——负责区域内服务站招募、商家拓展、消费者推广的全链路管理'],
            ['收入模式', '区域总交易额的' + pct(MANAGEMENT.cityPartner.shareOfReserve) + '（独立于服务站佣金池）'],
            ['主要职责', '1. 招募和管理区域服务站 2. 制定区域市场拓展计划 3. 对接本地商家资源 4. 组织区域级营销活动 5. 维护区域政府/社区关系'],
            ['核心权限', '服务站审批权、区域活动策划权、区域商家准入建议权、区域数据查看权'],
            ['合同期限', '首次签约1年，含3个月考核期。考核达标后自动续约。'],
            ['考核指标', '签约后3个月内：服务站≥3个、活跃商家≥50家、月交易量≥3,000笔'],
            ['退出机制', '考核期未达标：协商调整或终止。合同期未满主动退出：须提前30天书面通知。']
        ]),

        divider(),
        h2('二、城市服务商收入测算（3种情景）'),
        p('以下为三种典型城市（区域）的收入估算。实际收入基于区域内全部商家真实交易额，不固定、不保证。', { color: C.GRAY }),

        h3('情景A：小型区域（覆盖5万人口、1个商业中心）'),
        dataTable(
            ['参数', '保守估算', '标准估算', '乐观估算'],
            [
                ['区域活跃商家数', '60家', '100家', '150家'],
                ['月均交易笔数/商家', '80笔', '120笔', '150笔'],
                ['平均客单价', '¥45', '¥55', '¥65'],
                ['月总GMV', '¥216,000', '¥660,000', '¥1,462,500'],
                ['城市服务商收入（1%）', '¥2,160/月', '¥6,600/月', '¥14,625/月']
            ],
            { small: true }
        ),

        h3('情景B：中型区域（覆盖20万人口、3-5个商业中心）'),
        dataTable(
            ['参数', '保守估算', '标准估算', '乐观估算'],
            [
                ['区域活跃商家数', '200家', '350家', '500家'],
                ['月均交易笔数/商家', '100笔', '130笔', '160笔'],
                ['平均客单价', '¥50', '¥60', '¥70'],
                ['月总GMV', '¥1,000,000', '¥2,730,000', '¥5,600,000'],
                ['城市服务商收入（1%）', '¥10,000/月', '¥27,300/月', '¥56,000/月']
            ],
            { small: true }
        ),

        h3('情景C：大型区域（覆盖50万人口、10+商业中心）'),
        dataTable(
            ['参数', '保守估算', '标准估算', '乐观估算'],
            [
                ['区域活跃商家数', '500家', '800家', '1,200家'],
                ['月均交易笔数/商家', '120笔', '150笔', '180笔'],
                ['平均客单价', '¥60', '¥70', '¥80'],
                ['月总GMV', '¥3,600,000', '¥8,400,000', '¥17,280,000'],
                ['城市服务商收入（1%）', '¥36,000/月', '¥84,000/月', '¥172,800/月']
            ],
            { small: true }
        ),

        p('⚠️ 重要提示：以上全部为估算示例，不代表承诺或保证。城市服务商收入完全基于区域内真实交易，不固定、不保证。', { color: C.RED, bold: true }),

        divider(),
        h2('三、城市服务商资格自评'),
        p('请逐项评估——符合8项以上者适合申请城市服务商：', { bold: true }),
        [
            '你在目标区域有至少2年的生活/工作经验，对本地商业环境非常熟悉',
            '你有本地商家资源或商会/行业协会关系',
            '你有团队管理经验，能够招募和领导3人以上的BD团队',
            '你有一定的启动资金（建议¥30,000-50,000用于前3个月运营成本）',
            '你有正规的经营主体（公司或个体工商户），能够签署正式合同',
            '你认同链邦赋商通的经营理念和合规底线',
            '你有足够的抗压能力——前3个月可能收入较低，需要耐心培育市场',
            '你具备良好的沟通能力和商务谈判经验',
            '你对社区商业数字化有热情和信心',
            '你愿意接受平台的培训和考核体系'
        ].map(function(item, idx) {
            return p('□  ' + (idx + 1) + '. ' + item, { indent: { left: 400 }, size: 19 });
        }),

        divider(),
        h2('四、城市服务商合同核心条款（摘要）'),
        dataTable(
            ['条款', '内容摘要', '注意事项'],
            [
                ['合作性质', '区域合伙人，非雇佣关系，非代理关系——城市服务商为独立经营主体', '独立承担经营成本和税务责任'],
                ['区域范围', '合同明确划定地理区域范围——城市服务商在该区域内享有独家合作权', '区域范围以街道/行政边界明确界定'],
                ['收入结算', '区域总交易额×1%，月结。通过汇付直接清分至城市服务商账户。', '平台不触碰城市服务商收入——直清到账'],
                ['考核期', '签约后3个月考核期。考核指标：服务站≥3个、活跃商家≥50家、月交易量≥3,000笔。', '未达标可延长1个月或协商终止'],
                ['终止条款', '任一方提前30天书面通知可终止。终止后已完成交易的收入正常结算。', '无违约金——但未到期营销投入不予退还'],
                ['合规要求', '城市服务商须遵守平台合规政策，不得使用违规话术、不得承诺收益、不得发展多级下线。', '违规三次（经书面警告）即终止合作']
            ],
            { small: true }
        ),
        redline('城市服务商合同须经法务审核后签署，以上仅为摘要参考。正式合同以法务审核版本为准。'),
        flowBox('城市服务商是区域合伙人，不是代理商——拥有独立经营权，同时承担独立经营风险。这是我们与"收代理费"模式的核心区别。', false)
    );
    return children;
}

// D3: Service Station Recruitment Brochure
function buildD3_StationRecruitment() {
    var children = [].concat(
        h1('D3  服务站招商手册'),
        p('以下为服务站（社区节点）的招商完整工具包：角色定位、盈亏测算、区域规划、30天启动SOP。'),
        divider(),

        h2('一、服务站角色定位'),
        infoTable([
            ['角色名称', MANAGEMENT.station.role + '（社区节点）'],
            ['定位', '社区级服务枢纽——管理社区内的推广者、服务社区商家、维护社区消费者关系'],
            ['收入来源', '佣金池内部分配的' + pct(MANAGEMENT.station.internalSplitStation) + '（服务站留存35%，其余65%分配给推广者）'],
            ['上级', '城市服务商（区域合伙人）'],
            ['下级', '推广者（一线推广人员）'],
            ['核心职责', '1. 招募和管理社区推广者 2. 服务社区商家（入驻辅导+日常运营） 3. 组织社区级推广活动 4. 维护消费者社群 5. 收集市场反馈'],
            ['推荐管理规模', '每位服务站管理5-15位推广者，覆盖3-5个社区']
        ]),

        divider(),
        h2('二、服务站盈亏测算'),
        p('以下为单个服务站（覆盖3-5个社区、管理8位推广者）的月度盈亏测算：', { color: C.GRAY }),

        dataTable(
            ['项目', '保守', '标准', '乐观', '计算逻辑'],
            [
                ['覆盖商家数', '30家', '50家', '80家', '推广者人均拓展3-6家'],
                ['月总GMV', '¥180,000', '¥400,000', '¥800,000', '商家数×月均交易额×客单价'],
                ['佣金池总额（9%平台）', '¥16,200', '¥36,000', '¥72,000', '月GMV × 9%'],
                ['服务站收入（35%）', '¥5,670', '¥12,600', '¥25,200', '佣金池 × 35%'],
                ['运营成本（房租+设备）', '¥1,500', '¥2,500', '¥3,500', '社区小型办公室或居家办公'],
                ['营销物料+活动', '¥500', '¥1,000', '¥2,000', '海报/立牌/社区活动物资'],
                ['交通+通讯', '¥300', '¥500', '¥800', '社区内交通以电动自行车为主'],
                ['月净利润', '¥3,370', '¥8,600', '¥18,900', '服务站收入 - 运营成本'],
            ],
            { small: true }
        ),
        p('⚠️ 以上为测算示例，实际盈亏取决于商家质量、消费者活跃度、推广者能力等因素。', { color: C.RED, bold: false, size: 18 }),

        divider(),
        h2('三、区域规划指南'),
        calloutBox('如何定义服务站的服务范围', [
            '地理范围：3-5个相邻社区或1-2个街道辖区——确保服务站人员能在15分钟内骑电动自行车到达任意合作商家',
            '人口规模：覆盖1.5-3万居民——此规模可支撑30-80家合作商家',
            '商业密度：至少50家潜在合作商家（餐饮/零售/服务），日均人流量>2,000人次的核心商圈',
            '竞争评估：竞品渗透率<30%为优先区域——查询方法：打开美团/抖音搜索该区域商家数量',
            '社区特征：大型封闭式小区>开放式老旧小区>商业街区>——封闭社区的自然社交传播效率最高'
        ], C.LIGHT),

        divider(),
        h2('四、服务站30天启动SOP'),
        dataTable(
            ['周', '阶段', '核心任务', '关键产出', '检查节点'],
            [
                ['W1', '筹备期', '① 确定服务范围 ② 租赁/布置办公点 ③ 注册服务站账号 ④ 参加平台培训', '办公点就绪+账号开通+培训通过', 'W1末：城市服务商现场检查办公点'],
                ['W2', '建队期', '① 招募首批3-5位推广者 ② 培训推广者（话术+工具+合规） ③ 片区商户走访（至少30家）', '推广者团队到位+商户走访报告', 'W2末：推广者考核通过+走访报告提交'],
                ['W3', '攻单期', '① 推广者开始独立拜访 ② 重点攻克10-15家意向商家 ③ 协助商家入驻注册', '10家以上签约+5家以上激活', 'W3末：检查签约和激活数据'],
                ['W4', '运营期', '① 已激活商家首单追踪 ② 启动消费者推广（扫码注册） ③ 建立商家服务群', '月交易量≥500笔+消费者≥200人', 'W4末：月度报告+次月计划']
            ],
            { small: true }
        ),

        divider(),
        redline('服务站不可独立招募下级服务站——服务站之间为平级协作关系，上下级仅存在于"城市服务商→服务站→推广者"三级体系。'),
        calloutBox('服务站与城市服务商的关系', [
            '城市服务商：区域战略制定者——决定"打哪里、怎么打"',
            '服务站：社区战术执行者——负责"带兵打仗、服务商家"',
            '推广者：一线战斗单元——负责"拜访商家、拉新用户"',
            '三者是协作关系，不是多级分销——每一层的收入都基于实际交易，而非"人头费"'
        ], C.LIGHT)
    );
    return children;
}

// D4: Investor & Partner FAQ Manual
function buildD4_InvestorFAQ() {
    var children = [].concat(
        h1('D4  投资人及合作伙伴FAQ手册'),
        p('以下为面向投资人、战略合作伙伴、城市服务商候选人的50题FAQ，按8大主题分类。'),
        divider()
    );

    // Topic 1
    children = children.concat(faqBlock('一、平台定位与商业模式（8题）', [
        ['链邦赋商通到底是做什么的？', '我们是面向社区商业的数字经营平台。帮助社区商家（餐饮/零售/服务）建立线上店铺、实现会员管理和复购提升。核心差异化在于"跨店通兑"——消费者在任意商家获得的代金券/积分/消费金，可以在全平台通用。'],
        ['跟美团/饿了么有什么区别？', '美团/饿了么是外卖配送平台，核心价值是"送货上门"。我们是社区经营平台，核心价值是"复购提升"——帮商家把一次性顾客变成长期回头客。我们不碰外卖配送，也不跟美团抢外卖订单。'],
        ['为什么说"跨店通兑"是核心壁垒？', '跨店通兑需要同时建立消费者、商家、推广者三方网络——消费者越多→商家越愿意入驻→商家越多→消费者越多。这个网络效应一旦形成，后来者很难突破。目前市场上没有竞品真正实现这一点。'],
        ['目标市场有多大？', '中国社区商业（本地生活服务+社区零售）市场规模超万亿。目前数字化渗透率不到5%——绝大多数社区商家还在用纸质记账、微信群接龙的原始方式。这5%到50%的渗透过程就是我们的市场空间。'],
        ['平台的收入模式是什么？', '平台收入=商家交易额×服务费率。不靠广告、不靠排名竞价、不靠入驻费——纯交易分润模式。这确保平台利益与商家利益一致——商家交易越多，平台收入越多。'],
        ['为什么选择社区商业而非大商圈？', '大商圈（购物中心/商业街）已经被美团、大众点评等平台充分覆盖。社区商业是有巨大价值但被忽视的"蚂蚁市场"——单个商家规模小、但数量庞大、且复购需求强烈。'],
        ['商家为什么要选择你们而不是自己做小程序？', '自己做小程序需要技术投入、运营能力、还需要自己引流。我们不仅提供零门槛的工具，更重要的是提供生态流量——跨店通兑机制让全平台商家互相导流。单个商家自己做小程序永远做不到这一点。'],
        ['"交易即分润"是什么意思？', '零固定费用、零预充值、零保证金——平台只在商家实际产生交易时收取服务费。商家没有交易=平台没有任何收入。这跟收年费/入驻费的模式有本质区别——我们不从商家"没赚到的钱"里收费。']
    ], C.MAIN));

    // Topic 2
    children = children.concat(faqBlock('二、财务与盈利（7题）', [
        ['平台什么时候能盈利？', '月交易量达到40,500笔时实现盈亏平衡（覆盖固定运营成本）。按平均客单价¥100估算，月GMV约¥405万。盈亏平衡点净利率约0.89%。'],
        ['盈亏平衡点为什么这么低？', '因为我们轻资产——无库存、无物流、无门店、无资金池。主要固定成本是技术团队和运营团队。40,500笔/月的盈亏平衡点在平台型公司中属于较低水平。'],
        ['服务费够覆盖成本吗？', '服务费5-6%是毛利。去除支付渠道费（0.6%）和各项分配（商家/推广者/消费金/营销池/风控），平台净留存约5%（平台商家）。这个净留存用于覆盖技术开发和运营成本——在规模效应下完全足够。'],
        ['营销池的钱谁出？怎么管理？', '营销池来自每笔交易的固定比例分配（3.5-4%），由汇付托管。用于发放代金券、推广者激励、城市级活动。平台不自由支配——每笔营销支出都有明确规则和审批流程。'],
        ['风控备用金2%是做什么的？', '应对异常交易——退款、纠纷、欺诈等。由汇付托管，平台不自由动用。当备用金超过一定阈值时，超出部分可转入营销池。这是平台的风控防火墙。'],
        ['后续需要融资吗？', '目前由母公司全球拼购战略支持，可以覆盖从0到盈亏平衡的运营成本。后续根据扩张速度决定是否引入外部融资——如果城市复制速度远超预期，可能需要融资加速。但核心商业模式不依赖资本驱动。'],
        ['3年财务预测的核心假设是什么？', '城市从1→5→20个的三阶段扩张、商家数从100→1,000→5,000家、月交易量从4万→20万→80万笔。详见HK IPO营销计划中的完整三表财务模型。']
    ], BRAND.TECH_BLUE));

    // Topic 3
    children = children.concat(faqBlock('三、技术与产品（5题）', [
        ['技术架构是怎样的？', '前端：微信小程序（消费者端+商家端+推广者端）。后端：基于云原生架构，支持弹性扩容。支付：对接汇付天下，实现多方可配置分账。数据：商家/消费者数据隔离，商家数据归商家所有。'],
        ['为什么选微信小程序而不是独立App？', '社区消费场景中，"下载App"是极高的门槛——消费者不会为了在楼下便利店省几块钱去下载App。微信小程序扫码即用、10秒注册——零下载门槛对应最高转化率。'],
        ['支付安全怎么保障？', '所有交易通过汇付天下（持有央行颁发的支付业务许可证）处理——资金在汇付体系内直接清分至各方账户，平台不触碰交易资金。支付链路全程加密，PCI-DSS合规。'],
        ['如果交易量暴增，系统能撑住吗？', '架构设计支持水平扩展——按城市/区域分库分表，单区域容量可支撑10万笔/日。超过阈值自动触发扩容。公测前会进行压力测试验证。'],
        ['商家端有什么功能？', '商品管理、订单管理、会员管理、数据看板、营销工具配置（代金券/积分规则）、店铺装修（模板选择+自定义）、收入结算查询、客服工具。']
    ], C.DARK));

    // Topic 4
    children = children.concat(faqBlock('四、市场竞争（7题）', [
        ['最大的竞争对手是谁？', '目前没有完全对标的直接竞争对手。美团本地生活是最强的间接竞争对手（但做的是到店+外卖，不是社区复购）。省团生活是较接近的竞品（异业联盟模式，62万+商家），但省团不做跨店通兑和交易即分润。'],
        ['如果美团也做"跨店通兑"怎么办？', '美团的规模既是优势也是包袱——庞大的商家体系意味着改分账规则会牵动数以百万计商家的利益。我们从小做起、规则清晰、灵活迭代。而且美团的核心商业模式是"流量分发"——跟他们做"商家复购"是本质不同的两套体系。'],
        ['抖音也在做本地生活，威胁大吗？', '抖音的核心优势是内容流量——适合冲动消费和品牌曝光，但不适合社区商家的日常复购经营。你会在抖音上关注"楼下便利店"的账号吗？不太会。但你会每天打开链商看看附近有什么优惠。'],
        ['如果出现一个Copycat怎么办？', '商业模型可以复制，但三个东西复制不了：①先发优势建立的商家网络和消费者习惯 ②"跨店通兑"机制下已经形成的权益互通网络 ③我们在合规上的积累——合规壁垒不是一天建立的。'],
        ['平台的护城河是什么？', '五道护城河：①跨店通兑的网络效应 ②交易即分润的商家信任 ③合规体系的法律壁垒 ④3级管理体系的渠道深度 ⑤先发优势形成的品牌认知和数据积累。'],
        ['你们比省团生活好在哪？', '省团生活是纯联盟模式，商家之间简单互推。我们有三业态分层（平台/联盟/商城）+三元营销体系（代金券/积分/消费金）+三级管理体系（城市服务商/服务站/推广者）。体系完整度和精细度远超省团。而且我们更合规——省团的某些推广模式存在监管风险。'],
        ['行业的赢家通吃效应强吗？', '社区商业不同于社交网络——不是纯赢家通吃的市场。不同社区、不同城市之间相对独立，本地化服务能力比全国性网络更重要。我们采用城市合伙人模式，让本地团队经营本地市场——这比全国统一运营更有效。']
    ], BRAND.BRAND_RED));

    // Topic 5
    children = children.concat(faqBlock('五、合规与监管（6题）', [
        ['积分体系是否涉及虚拟货币监管？', '不涉及。我们的积分不可兑现、不可转账、不可提现——仅在平台内部用于消费抵扣。完全符合《单用途商业预付卡管理办法》和《电子商务法》的要求。三条红线第一条就是"积分不可兑现"。'],
        ['资金池问题怎么解决？', '我们完全不设资金池。所有交易资金由汇付天下（持牌支付机构）直接清分——消费者支付→汇付→按分账比例即时清分至商家/平台/推广者/城市服务商/营销池/风控备用金各自账户。平台只收服务费，不触碰交易资金。'],
        ['这个模式需要支付牌照吗？', '平台自身不需要——因为我们不持有客户资金、不设资金池、不开展支付结算业务。支付和清分全部由汇付（持有央行支付业务许可证）完成。平台的定位是"技术服务+运营服务"，不是"支付服务"。'],
        ['三级推广体系合规吗？', '合规。核心三点：①只有三级（城市服务商→服务站→推广者），不超过法律限制 ②每一层的收入基于实际交易而非"人头费" ③零入门费、零保证金——不依赖拉人头牟利。完全不同于法律禁止的多级传销。'],
        ['遇到了监管检查怎么办？', '我们有完整的合规框架和法务支持。所有规则和文案都经过合规审核。三条红线+16项术语替换+9项绝对禁用词——合规不是应付监管，而是刻在业务基因里。遇到检查只需配合提供资料即可。'],
        ['消费者数据隐私怎么保护？', '收集最小必要数据（微信公开信息+消费记录），不收集敏感个人信息。数据存储加密，商家和消费者数据隔离。《隐私政策》和《用户协议》明示数据使用范围。符合《个人信息保护法》要求。']
    ], C.GREEN));

    // Topic 6
    children = children.concat(faqBlock('六、团队与执行（5题）', [
        ['创始团队背景是什么？', '核心团队来自广东链邦科技（全球拼购子公司）。创始人及管理层具有电商平台运营、社区商业拓展、品牌策划的复合背景。技术团队有丰富的微信生态开发经验。'],
        ['团队目前多少人？', '目前为公测筹备期，核心团队约XX人——含技术开发、市场拓展、品牌策划、合规法务。随着业务扩张，团队规模将按城市复制节奏同步增长。'],
        ['如何保证执行力？', '三级管理体系本身就是执行力的保证——城市服务商有独立经营权、服务站有社区扎根优势、推广者有一线作战灵活性。加上明确的考核指标和透明的收入机制，每一层都有清晰的激励。'],
        ['如果核心人员离开怎么办？', '平台的核心竞争力不在于个别人员，而在于体系——合规框架、分账规则、品牌定位、技术架构——这些都是制度化而非人格化的。且母公司全球拼购提供战略和人才储备支持。'],
        ['如何招募和培训推广者？', '推广者主要从两个渠道来：①活跃消费者的自然转化 ②社区意见领袖的定向招募。培训通过在线平台完成（30分钟视频+考核），服务站提供线下辅导。零门槛进入+灵活工作时间+交易即分润=持续吸引推广者。']
    ], C.GRAY));

    // Topic 7
    children = children.concat(faqBlock('七、风险与应对（7题）', [
        ['最大的风险是什么？', '按优先级：①政策监管风险（已通过合规体系应对）②市场竞争风险（已通过跨店通兑壁垒应对）③商家冷启动风险（已通过公测期扶持应对）④团队执行风险（已通过三级管理体系应对）⑤技术安全风险（已通过汇付+云原生架构应对）。'],
        ['如果经济下行影响消费怎么办？', '社区消费（吃饭、买菜、理发、修东西）是刚需——经济好的时候要吃、经济不好的时候也要吃。甚至经济下行时，消费者对"省钱""优惠"更敏感——我们的代金券和积分体系反而更有吸引力。'],
        ['如果微信调整小程序政策？', '微信小程序是腾讯的核心生态，政策总体稳定可预期。即使有调整，我们的小程序功能集中在交易和会员管理——属于微信鼓励的"线上线下融合"场景。不会被政策针对。'],
        ['如果汇付出现技术故障？', '汇付是持牌支付机构，有严格的系统可用性要求（≥99.99%）。我们有备用支付方案和应急处理流程。且消费金核销（0%渠道费）可在汇付异常时作为临时过渡方案。'],
        ['如果商家刷单/欺诈怎么办？', '风控系统实时监控——异常交易模式自动触发审核。风控备用金2%用于覆盖欺诈损失。首次违规警告+扣减营销额度，二次封禁。推广者参与刷单一并处罚。'],
        ['如果城市服务商能力不足？', '3个月考核期就是筛选机制——考核不达标则协商调整或终止。我们会给城市服务商足够的培训和支持，但也会果断替换不合格的合伙人。区域市场的质量比数量重要。'],
        ['如果出现负面舆情？', '我们有品牌部和法务部协同的舆情应对机制。核心原则：快速响应、真诚沟通、事实说话、合规兜底。不删帖、不对抗、不推诿——用事实和时间化解质疑。']
    ], C.GRAY));

    // Topic 8
    children = children.concat(faqBlock('八、合作方式与条款（5题）', [
        ['如何成为城市服务商？', '提交申请→资格审查→面试→签署合同→缴纳履约保证金（¥5,000-20,000，按区域规模）→参加培训→启动运营。全程约2-4周。详见D2。'],
        ['如何成为服务站？', '由所属区域的城市服务商招募和管理。申请→城市服务商面试→平台备案→签署合同→参加培训→启动运营。无保证金（由城市服务商决定是否收取）。详见D3。'],
        ['如何成为推广者？', '扫码注册→实名认证→在线培训（30分钟）→通过考核→获取推广码。完全零门槛，随时可以开始。详见B4。'],
        ['如何成为平台商家？', '扫码注册→选择业态→填写店铺信息→上传资料→平台审核→选择模板→上架商品→正式上线。标准流程7天。详见B2。'],
        ['合作是否有排他性？', '城市服务商：在合同约定区域内享有独家合作权。服务站和推广者：非排他——但全职投入的推广者通常无精力服务多个平台。商家：完全非排他——可以同时使用美团/抖音/有赞等任何平台。']
    ], BRAND.GOLD));

    return children;
}

// D5: Event Signing Toolkit
function buildD5_EventSigning() {
    var children = [].concat(
        h1('D5  招商会签约工具包'),
        p('以下为招商会现场签约所需的标准文档模板。以下为参考模板，正式签约须经法务审核。'),
        divider(),

        h2('一、合作意向书模板'),
        p('（以下为参考框架，正式版本由法务提供）', { color: C.GRAY, italics: true }),
        divider(),

        p('合作意向书', { bold: true, size: 24, align: AlignmentType.CENTER }),
        p('Letter of Intent', { color: C.GRAY, size: 18, align: AlignmentType.CENTER, italics: true }),
        spacer(200),

        infoTable([
            ['甲方（平台方）', META.company],
            ['乙方（合作方）', '___________________________（公司/个人全称）'],
            ['统一社会信用代码/身份证号', '___________________________'],
            ['法定代表人/本人', '___________________________'],
            ['联系电话', '___________________________'],
            ['意向合作角色', '□ 城市服务商  □ 服务站  □ 推广者  □ 平台商家  □ 联盟商家'],
            ['意向合作区域', '___________________________（城市/区域）'],
            ['意向签署日期', '____年____月____日']
        ]),

        spacer(200),
        p('甲乙双方经友好协商，就乙方加入链邦赋商通平台（以下简称"平台"）开展合作事宜，达成以下意向：', { bold: true }),
        divider(),

        b('一、合作意向：乙方有意向以【合作角色】身份加入平台，在【合作区域】范围内开展平台推广/经营/服务活动。'),
        b('二、排他性约定：□ 乙方在合作区域内享有独家合作权（适用于城市服务商） □ 无排他性约定（适用于其他角色）'),
        b('三、履约保证金：乙方应于正式合同签署后3个工作日内向甲方支付履约保证金¥__________元（大写：__________________）。合同正常终止后，保证金无息退还。'),
        b('四、考核期约定：自正式合同生效之日起3个月为考核期。考核指标以正式合同约定为准。考核未达标，双方协商调整或终止合作。'),
        b('五、下一步计划：双方约定于____年____月____日前完成正式合同签署。乙方于签署正式合同前应完成：□ 主体资质审核  □ 区域评估  □ 团队组建  □ 平台培训'),
        b('六、保密条款：本意向书内容及双方在洽谈过程中获取的对方商业信息，未经对方书面同意，不得向第三方披露。'),
        b('七、法律效力：本意向书为双方合作意愿的表达，除第六条（保密条款）外，不构成具有法律约束力的合同。正式权利义务以双方签署的正式合同为准。'),
        b('八、本意向书一式两份，甲乙双方各执一份，自双方签字（盖章）之日起生效。'),

        spacer(300),
        dataTable(
            ['', '甲方（平台方）', '乙方（合作方）'],
            [
                ['公司/姓名', META.company, '___________________________'],
                ['授权代表', '___________________________', '___________________________'],
                ['签字/盖章', '', ''],
                ['日期', '____年____月____日', '____年____月____日']
            ],
            { small: true }
        ),

        divider(),
        h2('二、合作方信息采集表'),
        infoTable([
            ['合作方全称', '___________________________'],
            ['统一社会信用代码/身份证号', '___________________________'],
            ['法定代表人/本人', '___________________________'],
            ['注册地址/居住地址', '___________________________'],
            ['联系电话', '___________________________'],
            ['电子邮箱', '___________________________'],
            ['意向合作角色', '□ 城市服务商  □ 服务站  □ 推广者  □ 其他___________'],
            ['意向合作区域', '___________________________'],
            ['现有团队规模', '____人（含自己）'],
            ['现有商家/客户资源', '___________________________'],
            ['是否已有经营主体', '□ 是（公司/个体户） □ 否'],
            ['可投入启动资金', '¥__________元'],
            ['可投入时间', '□ 全职  □ 兼职（每周____小时）'],
            ['从何渠道了解平台', '□ 招商会  □ 朋友推荐  □ 地推人员  □ 线上  □ 其他___________'],
            ['备注/特殊需求', '___________________________']
        ]),

        divider(),
        h2('三、合作方尽调清单（适用于城市服务商/服务站）'),
        p('以下为平台对合作方的基础尽调项——在正式签约前需完成。', { bold: true }),
        dataTable(
            ['序号', '尽调项', '检查方式', '备注'],
            [
                ['1', '主体资格：营业执照/身份证核实', '国家企业信用信息公示系统/身份证查验', '经营状态正常、无法人失信记录'],
                ['2', '司法风险：失信被执行/诉讼记录', '中国执行信息公开网/裁判文书网', '无未决重大诉讼'],
                ['3', '行业经验：过往相关从业经历核实', '简历核实+电话背调', '有本地商业/BD经验者优先'],
                ['4', '资金实力：启动资金证明', '银行流水/存款证明（近3个月）', '满足对应角色的资金门槛'],
                ['5', '本地资源：商家/社区关系网络', '面试评估+提供5个以上商家联系方式用于核实', '有本地商家资源者优先'],
                ['6', '团队能力：核心成员背景', '简历+面试', '城市服务商须有团队管理经验'],
                ['7', '合规意识：对平台合规要求的理解', '合规培训后测评（≥80分通过）', '不合规意识者一票否决'],
                ['8', '信用记录：个人/企业信用', '征信报告（近6个月）', '无严重逾期或不良信用记录']
            ],
            { small: true }
        ),

        divider(),
        h2('四、签约后30天入驻计划'),
        dataTable(
            ['周', '里程碑', '核心任务', '平台支持', '检查节点'],
            [
                ['W1', '签约+开通', '签署正式合同、开通平台账号、完成基础培训', '合同模板+账号开通+培训课程', '账号开通+培训完成'],
                ['W2', '团队/店铺', '城市服务商：组建BD团队；商家：装修店铺', '招聘支持+模板选择指导', '团队到位/店铺上线'],
                ['W3', '首单破零', '商家：完成首笔交易；服务商：拓展首批商家', '首单引导+推广话术', '首单完成+首批拓展'],
                ['W4', '月度复盘', '提交月度经营报告、制定次月计划', '数据看板+月度复盘模板', '月报提交+次月计划确认']
            ],
            { small: true }
        ),

        divider(),
        redline('以上全部模板为参考框架，正式签约须经法务审核。合作意向书第六条（保密条款）具有法律约束力。'),
        calloutBox('签约现场注意事项', [
            '所有签字文件一式两份，甲乙双方各执一份',
            '签约代表须出示授权委托书（如非法定代表人本人签字）',
            '履约保证金须通过对公账户转账，不接受现金',
            '签约后即安排对接人——不要让合作方"签了约不知道找谁"',
            '建议签约后安排合影留念——既是仪式感，也是品牌传播素材'
        ], C.LIGHT)
    );
    return children;
}

// =============================================================================
// COMPLIANCE CHECK
// =============================================================================
function runComplianceCheck(children) {
    console.log('\n🔍 合规扫描中...\n');
    var result = complianceScan(children, { silent: false });
    if (result.errors.length > 0) {
        console.log('\n⛔ 发现合规禁用词，请修复后重新生成！');
        result.errors.forEach(function(e) { console.log('   ❌ ' + e); });
    }
    if (result.warnings.length > 0) {
        console.log('\n⚠️  发现建议替换术语：');
        result.warnings.forEach(function(w) { console.log('   ⚠️  ' + w); });
    }
    if (result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✅ 合规检查通过——未发现禁止词汇和建议替换术语\n');
    }
    return result;
}

// =============================================================================
// MAIN BUILD PIPELINE
// =============================================================================
async function main() {
    console.log('🚀 开始生成链邦赋商通 · 市场拓展营销工具包 V1.0');
    console.log('══════════════════════════════════════════\n');

    // Assemble all children in order
    var children = [].concat(
        // Cover
        buildCover(),

        // ═══ Part A: Universal Foundation ═══
        buildPartDivider('第一部分', '通用基础工具', '适用于所有角色的平台基础知识与合规底线', C.MAIN),
        buildA1_ElevatorPitch(),
        pageBreak(),
        buildA2_ComplianceQuickRef(),
        pageBreak(),
        buildA3_DataQuickRef(),
        pageBreak(),

        // ═══ Part B: Ground Push Team ═══
        buildPartDivider('第二部分', '地推人员工具', '一线地面推广团队实战手册——话术·表单·日报', BRAND.BRAND_RED),
        buildB1_DoorToDoorScripts(),
        pageBreak(),
        buildB2_MerchantOnboarding(),
        pageBreak(),
        buildB3_ConsumerScanGuide(),
        pageBreak(),
        buildB4_PromoterRecruitment(),
        pageBreak(),
        buildB5_DailyWeeklyReport(),
        pageBreak(),

        // ═══ Part C: Marketing & BD ═══
        buildPartDivider('第三部分', '市场部/BD工具', '市场拓展与商务谈判专业工具——策略·脚本·计算器', BRAND.TECH_BLUE),
        buildC1_PresentationScript(),
        pageBreak(),
        buildC2_MerchantConversion(),
        pageBreak(),
        buildC3_MarketPenetration(),
        pageBreak(),
        buildC4_TripleMarketingCalc(),
        pageBreak(),
        buildC5_CompetitiveResponse(),
        pageBreak(),

        // ═══ Part D: Investment Event ═══
        buildPartDivider('第四部分', '招商会专用工具', '招商活动全流程工具箱——从筹备到签约', BRAND.GOLD),
        buildD1_EventExecution(),
        pageBreak(),
        buildD2_CityPartnerRecruitment(),
        pageBreak(),
        buildD3_StationRecruitment(),
        pageBreak(),
        buildD4_InvestorFAQ(),
        pageBreak(),
        buildD5_EventSigning(),
        pageBreak(),

        // ═══ Part E: Appendices ═══
        buildPartDivider('第五部分', '附录', '参数速查·品牌规范·合规对照——随时备查', C.DARK),
        buildE1_ParameterReference(),
        pageBreak(),
        buildE2_BrandVisualSummary(),
        pageBreak(),
        buildE3_ComplianceCrossReference(),
        pageBreak(),

        // End page
        buildEndPage()
    );

    // Run compliance check
    runComplianceCheck(children);

    // Build and write
    console.log('📦 正在生成文档...\n');
    var outPath = await buildAndWrite(children, OUT_FILE, {
        title: DOC_TITLE,
        margins: FONT.margin,
        fontSize: FONT.bodySize
    });

    console.log('══════════════════════════════════════════');
    console.log('✅ 市场拓展营销工具包已生成：');
    console.log('   ' + outPath);
    console.log('');
    console.log('📊 文档结构：5 大部分 · 21 个章节');
    console.log('   Part A 通用基础工具：3 章（电梯演讲/合规速查/数据速查）');
    console.log('   Part B 地推人员工具：5 章（话术/入驻/扫码/招募/日报）');
    console.log('   Part C 市场部/BD工具：5 章（销讲/分层/渗透/三元营销/竞品）');
    console.log('   Part D 招商会专用工具：5 章（执行/城市服务商/服务站/FAQ/签约）');
    console.log('   Part E 附录：3 章（参数/品牌/合规）');
    console.log('');
    console.log('👥 适用角色：地推人员 / 市场部BD / 招商会组织者 / 管理层');
    console.log('📁 输出目录：' + OUT_DIR);
    console.log('══════════════════════════════════════════');
}

main().catch(function(err) {
    console.error('❌ 生成失败：', err);
    process.exit(1);
});
