// =============================================================================
// generate_investment_pitch_ppt.js
// 链邦赋商通（链商2.0）招商会销讲PPT逐页脚本 · 完整演示版
//
// 输出：20260615 市场拓展营销工具包/链邦赋商通_招商会销讲PPT_V1.0.pptx
//
// 结构：20页标准演示 + 15题Q&A附录 + 开场/结尾仪式
// 每页包含：标题、核心信息、讲述要点（备注）、过渡语
// =============================================================================

const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// ========== BRAND CONSTANTS ==========
const { COLORS, META } = require("./lib/constants");

const BRAND = {
    DEEP_BLUE:   COLORS.DEEP_BLUE,
    CHAIN_RED:   COLORS.CHAIN_RED,
    TECH_BLUE:   COLORS.TECH_BLUE,
    WARM_ORANGE: COLORS.WARM_ORANGE,
    DARK_GRAY:   COLORS.DARK_GRAY,
    MID_GRAY:    COLORS.MID_GRAY,
    LIGHT_BG:    COLORS.LIGHT_BG,
    SOFT_BG:     COLORS.SOFT_BG,
    WHITE:       COLORS.WHITE,
    RED:         COLORS.RED,
    GREEN:       COLORS.GREEN,
    GOLD:        COLORS.GOLD,
    BLACK:       '#1a1a2e',
};

const FONT = {
    title: 'Microsoft YaHei',
    body: 'Microsoft YaHei',
};

// ========== OUTPUT CONFIG ==========
const OUT_DIR = path.join(__dirname, '20260615 市场拓展营销工具包');
const OUT_FILE = path.join(OUT_DIR, '链邦赋商通_招商会销讲PPT_V1.0.pptx');

// ========== PRESENTATION SETUP ==========
const pres = new pptxgen();

pres.defineLayout({ name: 'CUSTOM_16x9', width: 16, height: 9 });
pres.layout = 'CUSTOM_16x9';

// ========== OPACITY-APPROXIMATED COLORS (pptxgenjs only supports 6-digit hex, not rgba) ==========
// White at various opacities over dark backgrounds → approximated as lighter grays
const W90 = 'E6E6E6';  // rgba(255,255,255,0.9)
const W75 = 'BFBFBF';  // rgba(255,255,255,0.75)
const W70 = 'B3B3B3';  // rgba(255,255,255,0.7)
const W65 = 'A6A6A6';  // rgba(255,255,255,0.65)
const W50 = '808080';  // rgba(255,255,255,0.5)
const W45 = '737373';  // rgba(255,255,255,0.45)
const W40 = '666666';  // rgba(255,255,255,0.4)
const W30 = '4D4D4D';  // rgba(255,255,255,0.3)

// ========== SLIDE MASTER HELPERS ==========

/**
 * Add a standard content slide with title bar + body + speaker notes
 */
function contentSlide(title, bullets, notes, opts) {
    opts = opts || {};
    const slide = pres.addSlide();
    const titleColor = opts.titleColor || BRAND.DEEP_BLUE;
    const accentColor = opts.accentColor || BRAND.CHAIN_RED;

    // Top accent line
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.06,
        fill: { color: accentColor },
    });

    // Title bar background
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0.06, w: '100%', h: 0.95,
        fill: { color: titleColor },
    });

    // Title text
    slide.addText(title, {
        x: 0.8, y: 0.15, w: '90%', h: 0.75,
        fontSize: 28, fontFace: FONT.title, color: BRAND.WHITE, bold: true,
        align: 'left', valign: 'middle',
    });

    // Page number indicator
    if (opts.pageNum) {
        slide.addText(opts.pageNum, {
            x: '85%', y: 0.15, w: '12%', h: 0.75,
            fontSize: 14, fontFace: FONT.body, color: W50,
            align: 'right', valign: 'middle',
        });
    }

    // Body content
    const bodyY = 1.3;
    if (typeof bullets === 'string') {
        slide.addText(bullets, {
            x: 0.8, y: bodyY, w: '85%', h: 6.8,
            fontSize: 16, fontFace: FONT.body, color: BRAND.DARK_GRAY,
            align: 'left', valign: 'top', lineSpacingMultiple: 1.6,
            paraSpaceAfter: 8,
        });
    } else if (Array.isArray(bullets)) {
        const textObjs = bullets.map(function(b, i) {
            if (typeof b === 'string') {
                return { text: b, options: { fontSize: 16, fontFace: FONT.body, color: BRAND.DARK_GRAY, breakType: i > 0 ? 'break' : undefined, paraSpaceAfter: 10, bullet: { code: '2022' } } };
            } else {
                // Object with text + level/color
                var level = b.level || 0;
                var prefix = level === 0 ? '• ' : (level === 1 ? '    ◦ ' : '        ▪ ');
                return { text: prefix + b.text, options: { fontSize: b.size || 15, fontFace: FONT.body, color: b.color || BRAND.DARK_GRAY, bold: b.bold || false, breakType: 'break', paraSpaceAfter: 6 } };
            }
        });

        // Build text runs manually for proper bullet formatting
        var runs = [];
        bullets.forEach(function(b, i) {
            if (i > 0) runs.push({ text: '\n', options: { fontSize: 8 } });
            if (typeof b === 'string') {
                runs.push({ text: '• ' + b, options: { fontSize: 16, fontFace: FONT.body, color: BRAND.DARK_GRAY, paraSpaceAfter: 10 } });
            } else if (b.subtitle) {
                runs.push({ text: b.text, options: { fontSize: b.size || 17, fontFace: FONT.body, color: b.color || titleColor, bold: true, paraSpaceAfter: 4 } });
            } else if (b.header) {
                runs.push({ text: b.text, options: { fontSize: b.size || 20, fontFace: FONT.body, color: b.color || accentColor, bold: true, paraSpaceAfter: 8 } });
            } else {
                var level = b.level || 0;
                var prefix = level === 0 ? '• ' : (level === 1 ? '    ◦ ' : '        ▪ ');
                runs.push({ text: prefix + b.text, options: { fontSize: b.size || 15, fontFace: FONT.body, color: b.color || BRAND.DARK_GRAY, bold: b.bold || false, paraSpaceAfter: 6 } });
            }
        });

        slide.addText(runs, {
            x: 0.8, y: bodyY, w: '85%', h: 6.8,
            align: 'left', valign: 'top', lineSpacingMultiple: 1.5,
        });
    }

    // Bottom accent line
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 8.7, w: '100%', h: 0.04,
        fill: { color: accentColor },
    });

    // Footer
    slide.addText('链邦赋商通 · 招商演示', {
        x: 0.5, y: 8.8, w: '50%', h: 0.2,
        fontSize: 9, fontFace: FONT.body, color: BRAND.MID_GRAY,
        align: 'left',
    });

    // Speaker notes
    if (notes) {
        slide.addNotes(notes);
    }

    return slide;
}

/**
 * Section divider slide
 */
function sectionSlide(title, subtitle, color) {
    const slide = pres.addSlide();
    color = color || BRAND.DEEP_BLUE;

    // Full background
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: color },
    });

    // Decorative line
    slide.addShape(pres.ShapeType.rect, {
        x: 1.5, y: 3.8, w: 2.5, h: 0.06,
        fill: { color: BRAND.WHITE },
    });

    // Title
    slide.addText(title, {
        x: 1.5, y: 2.8, w: '80%', h: 1.2,
        fontSize: 36, fontFace: FONT.title, color: BRAND.WHITE, bold: true,
        align: 'left', valign: 'middle',
    });

    // Subtitle
    if (subtitle) {
        slide.addText(subtitle, {
            x: 1.5, y: 4.1, w: '80%', h: 0.8,
            fontSize: 18, fontFace: FONT.body, color: W75,
            align: 'left', valign: 'top',
        });
    }
    return slide;
}

/**
 * Cover slide
 */
function coverSlide() {
    const slide = pres.addSlide();

    // Full dark background
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: BRAND.BLACK },
    });

    // Top accent stripe
    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.08,
        fill: { color: BRAND.CHAIN_RED },
    });

    // Brand name (small, top left)
    slide.addText('链邦赋商通', {
        x: 1.0, y: 0.6, w: '50%', h: 0.5,
        fontSize: 16, fontFace: FONT.body, color: BRAND.CHAIN_RED, bold: true,
        align: 'left', valign: 'middle',
    });

    // Main title
    slide.addText('招商会销讲演示', {
        x: 1.0, y: 2.5, w: '85%', h: 1.5,
        fontSize: 44, fontFace: FONT.title, color: BRAND.WHITE, bold: true,
        align: 'left', valign: 'middle',
    });

    // Decorative red line
    slide.addShape(pres.ShapeType.rect, {
        x: 1.0, y: 4.15, w: 1.8, h: 0.06,
        fill: { color: BRAND.CHAIN_RED },
    });

    // Subtitle
    slide.addText('面向社区商业的数字经营平台', {
        x: 1.0, y: 4.4, w: '85%', h: 0.8,
        fontSize: 22, fontFace: FONT.body, color: W70,
        align: 'left', valign: 'top',
    });

    // Bottom info
    slide.addText('广东链邦科技有限公司  |  2026年6月', {
        x: 1.0, y: 7.2, w: '85%', h: 0.5,
        fontSize: 14, fontFace: FONT.body, color: W45,
        align: 'left', valign: 'middle',
    });

    slide.addText('演示时长：30分钟  |  目标听众：潜在城市服务商 / 服务站 / 推广者 / 商家', {
        x: 1.0, y: 7.6, w: '85%', h: 0.4,
        fontSize: 11, fontFace: FONT.body, color: W30,
        align: 'left', valign: 'middle',
    });

    slide.addNotes(
        '【开场前准备】\n' +
        '1. 确认投影/屏幕显示正常，颜色不失真\n' +
        '2. 确认翻页笔、计时器就绪\n' +
        '3. 调试麦克风音量\n' +
        '4. 准备名片、一页纸介绍、合作方案手册\n' +
        '5. 确认Q&A环节协助同事分工\n\n' +
        '【演示时长控制】\n' +
        '总时长30分钟，20页演示+10分钟Q&A。\n' +
        '每页平均1.5分钟——严格控时，不拖堂。\n' +
        '如时间紧张，P11/P13可加速为30秒快讲。'
    );
}

/**
 * End slide
 */
function endSlide() {
    const slide = pres.addSlide();

    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: BRAND.BLACK },
    });

    slide.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.08,
        fill: { color: BRAND.CHAIN_RED },
    });

    slide.addText('感谢聆听 · 期待合作', {
        x: 1.0, y: 2.8, w: '85%', h: 1.2,
        fontSize: 42, fontFace: FONT.title, color: BRAND.WHITE, bold: true,
        align: 'center', valign: 'middle',
    });

    slide.addShape(pres.ShapeType.rect, {
        x: '43%', y: 4.2, w: '14%', h: 0.05,
        fill: { color: BRAND.CHAIN_RED },
    });

    slide.addText('在链生活，在哪花都在省，在哪得的券都能用', {
        x: 1.0, y: 4.5, w: '85%', h: 0.8,
        fontSize: 18, fontFace: FONT.body, color: W65,
        align: 'center', valign: 'top',
    });

    slide.addText('链邦赋商通  |  面向社区商业的数字经营平台', {
        x: 1.0, y: 6.5, w: '85%', h: 0.5,
        fontSize: 14, fontFace: FONT.body, color: W40,
        align: 'center', valign: 'middle',
    });

    slide.addText('广东链邦科技有限公司  |  全球拼购（GGbingo）子公司', {
        x: 1.0, y: 6.9, w: '85%', h: 0.4,
        fontSize: 12, fontFace: FONT.body, color: W30,
        align: 'center', valign: 'middle',
    });
}

// ============================================================================
// P01: 封面
// ============================================================================
coverSlide();

// ============================================================================
// P02: 开场钩子 —— "一个社区商家每天流失多少顾客？"
// ============================================================================
contentSlide(
    '一个社区商家，每天流失多少顾客？',
    [
        { text: '一个社区餐饮店，日均进店100人，其中约70人是周边居民', level: 0 },
        { text: '但这70人中，有多少会成为回头客？', level: 0, bold: true },
        { text: '不到15人——回头率不足15%', level: 0, color: BRAND.CHAIN_RED, bold: true },
        { text: '', level: 0 },
        { header: true, text: '为什么？', color: BRAND.DEEP_BLUE },
        { text: '没有工具跟顾客建立长期关系', level: 0 },
        { text: '顾客今天来、明天忘——商家只能靠位置和运气', level: 0 },
        { text: '平台（美团/抖音）抽成18-22%，但只给流量、不给"关系"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '但如果……', color: BRAND.CHAIN_RED },
        { text: '每次消费都有记录、有积分、有代金券', level: 0 },
        { text: '而且这些券在隔壁店也能用', level: 0, bold: true },
        { text: '顾客还会忘吗？——这就是链邦赋商通', level: 0, color: BRAND.DEEP_BLUE, bold: true },
    ],
    '【讲述要点·P02 · 约1分钟】\n' +
    '1. 开场抛出具体数字，引发共鸣——在座商户老板都会点头\n' +
    '2. "不到15人"——停顿2秒，让数字落地\n' +
    '3. "为什么？"——反问，让听众自己先想3秒\n' +
    '4. 关键转折："但如果……"——语气变化，从沉重到期待\n' +
    '5. 最后一句要肯定，语调上扬——引出品牌名\n' +
    '\n' +
    '【过渡语】\n' +
    '"好，那我们先来看看——本地商家到底面临哪些具体的经营困境？" → 翻P03',
    { pageNum: 'P02', accentColor: BRAND.CHAIN_RED }
);

// ============================================================================
// P03: 行业痛点 —— "本地商家的三大经营困境"
// ============================================================================
contentSlide(
    '本地商家的三大经营困境',
    [
        { header: true, text: '❶ 获客难 —— 流量越来越贵', color: BRAND.CHAIN_RED },
        { text: '外卖平台抽成18-22%，商家利润被严重挤压', level: 1 },
        { text: '抖音/小红书引流：投入大、不确定性高、难持续', level: 1 },
        { text: '线下自然客流：受位置限制，增长空间有限', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '❷ 留客难 —— 顾客来了也留不住', color: BRAND.WARM_ORANGE },
        { text: '无有效会员管理工具——顾客今天来明天忘', level: 1 },
        { text: '纸质会员卡/微信群：低效、易流失、难触达', level: 1 },
        { text: '缺乏个性化营销手段——无法识别高价值顾客', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '❸ 竞争难 —— 连锁品牌碾压独立商家', color: BRAND.TECH_BLUE },
        { text: '连锁品牌有统一的数字化系统、会员体系、品牌势能', level: 1 },
        { text: '独立商家没有"数字武器"——同场竞技、武器不对等', level: 1 },
        { text: '中国6,000万+社区商家，数字化渗透率 < 10%', level: 1, bold: true },
    ],
    '【讲述要点·P03 · 约1.5分钟】\n' +
    '1. 三大困境逐一展开，每一点都举一个具体例子\n' +
    '2. "获客难"——引用商家真实吐槽："美团抽成太高了"\n' +
    '3. "留客难"——场景化："你去一家餐厅吃了顿饭，三天后你还记得它吗？"\n' +
    '4. "竞争难"——对比连锁品牌vs独立商家的不对等\n' +
    '5. 最后一个数字"数字化渗透率<10%"要做强调——这是机会信号\n' +
    '\n' +
    '【过渡语】\n' +
    '"三大困境背后，其实是一个巨大的市场机会——我们来看数据。" → 翻P04',
    { pageNum: 'P03' }
);

// ============================================================================
// P04: 市场机会 —— "万亿社区商业市场的数字化蓝海"
// ============================================================================
contentSlide(
    '万亿社区商业市场的数字化蓝海',
    [
        { header: true, text: '市场规模', color: BRAND.DEEP_BLUE },
        { text: '中国社区商业市场规模：15万亿+', level: 0, bold: true, color: BRAND.CHAIN_RED },
        { text: '覆盖全国60万+社区，服务8亿+城镇居民', level: 0 },
        { text: '社区消费场景：高频（日均3-5次）× 刚需（餐饮/零售/服务）× 信任驱动', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '数字化渗透率：< 10%', color: BRAND.DEEP_BLUE },
        { text: '对标：电商渗透率35%+，外卖渗透率25%+', level: 0 },
        { text: '社区商业是"数字化最后的处女地"', level: 0, bold: true },
        { text: '', level: 0 },
        { header: true, text: '增量空间', color: BRAND.DEEP_BLUE },
        { text: '每提升1%渗透率 = 1,500亿新增数字化市场', level: 0 },
        { text: '从10%→20%渗透率 = 1.5万亿增量', level: 0, bold: true, color: BRAND.CHAIN_RED },
        { text: '', level: 0 },
        { header: true, text: '关键趋势', color: BRAND.DEEP_BLUE },
        { text: '微信小程序生态成熟——社区商家数字化门槛已降至零', level: 0 },
        { text: '消费者习惯已养成——扫码点餐/支付/领券 已成日常', level: 0 },
        { text: '支付+分账基础设施完善——汇付等持牌机构提供合规底层', level: 0 },
    ],
    '【讲述要点·P04 · 约1.5分钟】\n' +
    '1. "15万亿"——用类比："相当于电商市场的三分之二，但数字化程度只有电商的四分之一"\n' +
    '2. "数字化最后的处女地"——这是一个强有力的概念，要强调\n' +
    '3. 渗透率对比图表式呈现——让听众看到差距=看到机会\n' +
    '4. 三个关键趋势逐一说明——回答"为什么是现在？"\n' +
    '\n' +
    '【过渡语】\n' +
    '"这么大的市场，需要一个什么样的平台？——我们来介绍链邦赋商通。" → 翻P05',
    { pageNum: 'P04' }
);

// ============================================================================
// P05: 平台定位 —— "我们做什么、不做什么"
// ============================================================================
contentSlide(
    '链邦赋商通——我们做什么、不做什么',
    [
        { header: true, text: '✅ 我们做什么', color: BRAND.GREEN },
        { text: '帮助商家提升复购率——三元营销体系驱动回头客', level: 0 },
        { text: '帮助用户获得持续消费权益——消费即积累，权益全平台通用', level: 0 },
        { text: '帮助社区形成可持续商业循环——商家/消费者/推广者三边共赢', level: 0 },
        { text: '提供SaaS级数字经营工具——千面千店+会员管理+数据分析', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '❌ 我们不做', color: BRAND.RED },
        { text: '不抢商家外卖订单——我们是经营工具，不是流量贩子', level: 0 },
        { text: '不截留商家客户数据——客户数据归商家所有，平台不碰', level: 0 },
        { text: '不碰交易资金——汇付直接清分，平台零接触', level: 0 },
        { text: '不承诺收益——不暗示"稳赚""躺赚""投资回报"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '一句话定位', color: BRAND.DEEP_BLUE },
        { text: '链邦赋商通 = 面向社区商业的数字经营平台', level: 0, bold: true, color: BRAND.CHAIN_RED },
        { text: '商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励', level: 0 },
    ],
    '【讲述要点·P05 · 约1.5分钟】\n' +
    '1. "做什么"和"不做什么"同样重要——先说"做什么"建立认知，再说"不做什么"建立信任\n' +
    '2. "不碰交易资金"——强调汇付直清，这是合规信任的关键点\n' +
    '3. "不承诺收益"——展示合规态度，在金融监管严格的当下这是加分项\n' +
    '4. 最后"一句话定位"用朗读的语气，四个短语有节奏感\n' +
    '5. 可补充："简单说——我们帮社区商家免费开店，按实际成交收取服务费，不做流量中间商。"\n' +
    '\n' +
    '【过渡语】\n' +
    '"定位清楚了，那我们的核心创新在哪里？——四大机制，重新定义社区商业。" → 翻P06',
    { pageNum: 'P05' }
);

// ============================================================================
// P06: 核心创新 —— "四大核心机制"
// ============================================================================
contentSlide(
    '四大核心机制——重新定义社区商业',
    [
        { header: true, text: '① 商户独立经营 · 千面千店', color: BRAND.CHAIN_RED },
        { text: '平台商家深度自定义（品牌色/故事/视频）→ 联盟商家6套模板+轻定制 → 综合商城标准化', level: 1 },
        { text: '每个商家都有专属的品牌页面——不是"千店一面"的列表', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '② 生态会员互通 · 一次消费、全平台会员', color: BRAND.WARM_ORANGE },
        { text: '消费者在任意一家店消费，即成为全平台会员——无需反复注册', level: 1 },
        { text: '会员等级、积分、权益——跨商家累积和通用', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '③ 消费权益流转 · 跨店通兑', color: BRAND.TECH_BLUE },
        { text: '在A店消费获得的代金券/积分/消费金 → 在B店也能用', level: 1 },
        { text: '全平台权益互通——这是我们的核心差异化壁垒', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: '④ 交易即分润 · 零固定费用', color: BRAND.GREEN },
        { text: '商家零入驻费、零年费、零预充值——只在成交时收取服务费', level: 1 },
        { text: '平台不碰资金——汇付（持牌支付机构）直接清分至各方账户', level: 1 },
    ],
    '【讲述要点·P06 · 约2分钟】\n' +
    '1. 这是全演示最核心的一页——需要放慢节奏，逐一展开\n' +
    '2. 每讲一个机制，举一个具体场景例子\n' +
    '   - ①"比如一家烘焙店，可以在自己页面放品牌故事、制作过程视频——跟连锁品牌一样专业"\n' +
    '   - ②"消费者在李记面馆注册了会员，去隔壁张姐便利店自动识别会员身份"\n' +
    '   - ③"在李记吃面攒的代金券，去张姐便利店买水也能用——这就是跨店通兑"\n' +
    '   - ④"商家不用交一分钱年费——今天成交1笔收1笔服务费，没成交就免费"\n' +
    '3. ①→④有递进关系：独立经营是基础→会员互通是纽带→跨店通兑是壁垒→交易即分润是信任\n' +
    '\n' +
    '【过渡语】\n' +
    '"四大机制的核心，可以用一张图说清楚——来看我们的商业模式总图。" → 翻P07',
    { pageNum: 'P06' }
);

// ============================================================================
// P07: 商业模式总图 —— "交易即分润"
// ============================================================================
contentSlide(
    '交易即分润——一张图看懂商业模式',
    [
        { subtitle: true, text: '消费者支付（¥100为例）→ 汇付（持牌支付机构）→ 实时分账至各方', color: BRAND.DEEP_BLUE, size: 18 },
        { text: '', level: 0 },
        { header: true, text: '平台商家 · 分账结构', color: BRAND.DEEP_BLUE },
        { text: '支付渠道 0.6% | 商家 75.4% | 平台 5% | 服务站+推广者 9% | 城市服务商 1% | 消费金 3% | 营销池 4% | 风控备用金 2%', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '联盟商家 · 分账结构', color: BRAND.DEEP_BLUE },
        { text: '支付渠道 0.6% | 商家 71.4% | 平台渠道费 4.5% | 平台 5% | 服务站+推广者 10% | 城市服务商 1% | 消费金 2% | 营销池 3.5% | 风控备用金 2%', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '综合商城 · 分账结构', color: BRAND.DEEP_BLUE },
        { text: '支付渠道 0.6% | 商家 77.9% | 平台 6% | 服务站+推广者 6% | 城市服务商 1% | 消费金 3% | 营销池 3.5% | 风控备用金 2%', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '核心原则', color: BRAND.CHAIN_RED },
        { text: '平台不碰资金：所有资金由汇付（持牌支付机构）直接清分至各方账户', level: 0, bold: true },
        { text: '零资金池：无充值、无预存、无沉淀资金——完全合规', level: 0 },
        { text: '交易即分润：平台仅在实际交易发生时获取服务费', level: 0 },
    ],
    '【讲述要点·P07 · 约2分钟】\n' +
    '1. 先讲流程——"消费者支付的那一刻，钱怎么走？"\n' +
    '2. 强调汇付的角色——"我们选择汇付作为支付合作伙伴，因为它是持牌机构，资金安全有保障"\n' +
    '3. 三种业态分账结构快速过——不需要每个数字都讲，重点讲：\n' +
    '   - 商家拿大头（71-78%）\n' +
    '   - 平台只收5-6%服务费\n' +
    '   - 服务站+推广者有9-10%的激励空间\n' +
    '4. 三条核心原则用强调语气——这是信任的基石\n' +
    '5. 可选补充："很多人问——你们自己不做支付，怎么赚钱？回答：我们不赚支付的钱，我们赚服务的钱。"\n' +
    '\n' +
    '【过渡语】\n' +
    '"分账是骨架，那血肉是什么？——消费者在平台上的流转路径。" → 翻P08',
    { pageNum: 'P07' }
);

// ============================================================================
// P08: 消费流转飞轮
// ============================================================================
contentSlide(
    '消费流转飞轮——从平台商家到综合商城',
    [
        { header: true, text: '三大业态 · 软性优先级（非强制路径）', color: BRAND.DEEP_BLUE },
        { text: '', level: 0 },
        { header: true, text: '🥇 平台商家 —— 优先展示入口', color: BRAND.CHAIN_RED },
        { text: '品牌认证蓝标 | 搜索权重+2 | Premium深度自定义布局 | 高信息密度', level: 1 },
        { text: '适合：品牌餐饮 / 连锁零售 / 生活服务品牌', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🥈 联盟商家 —— 延伸履约网络', color: BRAND.WARM_ORANGE },
        { text: '社区好店绿标 | 搜索基准位 | 6套模板+轻定制 | 标准信息密度', level: 1 },
        { text: '适合：社区餐饮 / 便利店 / 美发 / 药店 / 维修', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🥉 综合商城 —— 补充供给', color: BRAND.MID_GRAY },
        { text: '平台自营灰标 | 搜索权重-2 | 标准化模板 | 极简信息密度', level: 1 },
        { text: '适合：标品零售 / 日用品 / 食品饮料', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '消费流转逻辑', color: BRAND.GREEN },
        { text: '消费者从平台商家发现 → 在联盟商家消费 → 延伸至综合商城补充', level: 0 },
        { text: '软性优先级≠强制路径：消费者可自由筛选/搜索/分类/地图找到任何商家', level: 0, bold: true },
    ],
    '【讲述要点·P08 · 约2分钟】\n' +
    '1. 用"商场"做类比——"平台商家就像商场一楼的品牌旗舰店，联盟商家是二楼三楼的特色店，综合商城是地下的超市"\n' +
    '2. 强调"软性优先级"——不是强制路径，消费者始终自由选择\n' +
    '3. "搜索权重+2/0/-2"——解释：平台商家排在前面，但消费者搜"火锅"都能找到\n' +
    '4. 消费流转路径是自然形成的，不是平台强制安排的\n' +
    '5. 关键概念——"飞轮"：越多优质商家→越多消费者→越多商家入驻→越多消费者\n' +
    '\n' +
    '【过渡语】\n' +
    '"消费流转的核心引擎是什么？——跨店通兑的权益体系。" → 翻P09',
    { pageNum: 'P08' }
);

// ============================================================================
// P09: 跨店通兑 —— "在A店获券，在B店使用"
// ============================================================================
contentSlide(
    '跨店通兑——在A店获券，在B店使用',
    [
        { subtitle: true, text: '全生态会员权益互通体系 · 链邦赋商通核心壁垒', color: BRAND.CHAIN_RED, size: 18 },
        { text: '', level: 0 },
        { header: true, text: '什么是跨店通兑？', color: BRAND.DEEP_BLUE },
        { text: '消费者在任一商家获得的权益（代金券/积分/消费金），可在全平台任意商家使用', level: 0 },
        { text: '场景：在李记面馆消费获¥5代金券 → 在张姐便利店买水直接抵扣', level: 0, bold: true },
        { text: '', level: 0 },
        { header: true, text: '为什么这是我们的核心壁垒？', color: BRAND.DEEP_BLUE },
        { text: '需要同时建立三方网络——消费者端 + 商家端 + 推广者端', level: 0 },
        { text: '先发优势极强——网络一旦形成，竞品难以复制', level: 0, bold: true },
        { text: '', level: 0 },
        { header: true, text: '合规保障', color: BRAND.GREEN },
        { text: '营销池统一结算——跨店通兑由营销资金池统一核销', level: 0 },
        { text: '汇付直清——不构成"二清"，完全符合支付监管要求', level: 0 },
        { text: '每一笔权益流转都有完整记录——可追踪、可审计', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '对商家的价值', color: BRAND.WARM_ORANGE },
        { text: '你的顾客在隔壁店消费后，可能带着代金券来你的店', level: 0 },
        { text: '同样——你的顾客也可能去隔壁店消费 → 生态共赢', level: 0 },
    ],
    '【讲述要点·P09 · 约1.5分钟】\n' +
    '1. 先用一句话说清楚"跨店通兑"是什么——用具体场景\n' +
    '2. "壁垒"概念——"美团做了十几年也没做跨店通兑，因为需要同时搞定消费者和商家两端"\n' +
    '3. "合规保障"——这是潜在合作方最关心的问题："合法吗？"→ 必须主动说明\n' +
    '4. "对商家的价值"——"不是你给别家导流，是大家一起做大蛋糕"\n' +
    '5. 可补充类比："就像银联——你的银行卡在任何ATM都能取钱，因为网络是互通的。链邦赋商通要做社区消费权益的‘银联’。"\n' +
    '\n' +
    '【过渡语】\n' +
    '"跨店通兑靠什么工具实现？——三引擎驱动的三元营销体系。" → 翻P10',
    { pageNum: 'P09' }
);

// ============================================================================
// P10: 三元营销 —— "代金券+积分+消费金"
// ============================================================================
contentSlide(
    '三元营销——三引擎驱动复购',
    [
        { subtitle: true, text: '代金券拉新 · 积分留客 · 消费金锁客', color: BRAND.CHAIN_RED, size: 18 },
        { text: '', level: 0 },
        { header: true, text: '🎫 代金券（Cash Voucher）', color: BRAND.CHAIN_RED },
        { text: '发放比例：交易额×5% | 抵扣上限：订单金额30% | 有效期：90天 | 全平台通用 ✓', level: 1 },
        { text: '作用：拉新获客——"首次消费送券，下次再来"', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '⭐ 积分（Points）', color: BRAND.GOLD },
        { text: '兑换率：1元=100积分 | 抵扣上限：订单金额20% | 有效期：2年 | 全平台通用 ✓', level: 1 },
        { text: '作用：留存——"每次消费都攒积分，积分当钱花"', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '💰 消费金（Consumer Credit）', color: BRAND.WARM_ORANGE },
        { text: '核销上限：订单金额30% | 有效期：12个月 | 全平台通用 ✓', level: 1 },
        { text: '作用：锁客——"大额消费获消费金，锁定长期复购"', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '协同效应', color: BRAND.DEEP_BLUE },
        { text: '新客到店 → 消费获代金券（拉新）→ 再次消费攒积分（留客）→ 大额消费获消费金（锁客）→ 循环复购', level: 0, bold: true },
    ],
    '【讲述要点·P10 · 约1.5分钟】\n' +
    '1. 开场先讲"三个工具各有分工"——不是堆砌功能\n' +
    '2. 代金券：拉新——"就像新店开业的优惠券，但我们是自动发的"\n' +
    '3. 积分：留客——"每次消费都在攒，攒够了就能抵现——让顾客「舍不得」走"\n' +
    '4. 消费金：锁客——"消费越多返越多，下次消费直接抵扣——把「回头」变成习惯"\n' +
    '5. "全平台通用"反复强调——这是跟所有竞品的最大差异\n' +
    '\n' +
    '【过渡语】\n' +
    '"三个工具给到商家，但每个商家的店铺都不一样——来看千面千店。" → 翻P11',
    { pageNum: 'P10' }
);

// ============================================================================
// P11: 千面千店 —— "每个商家都有专属阵地"
// ============================================================================
contentSlide(
    '千面千店——每个商家都有专属阵地',
    [
        { header: true, text: '平台商家 · Premium', color: BRAND.CHAIN_RED },
        { text: '品牌认证蓝标 | 深度自定义：品牌色/品牌故事/视频/相册 | 高信息密度 | 搜索加权+2', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '联盟商家 · Standard', color: BRAND.WARM_ORANGE },
        { text: '社区好店绿标 | 6套模板+轻定制：品牌色/横幅 | 标准信息密度 | 搜索基准位', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '综合商城 · Minimal', color: BRAND.MID_GRAY },
        { text: '平台自营灰标 | 标准化模板，不可自定义 | 极简信息密度 | 搜索加权-2', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '设计理念', color: BRAND.DEEP_BLUE },
        { text: '让每个商家都能展现自己的独特价值——不是"千店一面"的流水线', level: 0, bold: true },
        { text: '品牌商家有品牌页面的品质感，社区小店有社区店的亲切感', level: 0 },
    ],
    '【讲述要点·P11 · 约1分钟】\n' +
    '1. 快速过——这一页是"展示"而非"讲解"\n' +
    '2. 重点讲"不是千店一面"——对比美团/饿了么的统一列表格式\n' +
    '3. 实物演示效果更好——建议准备手机投屏展示3个业态的页面截图\n' +
    '\n' +
    '【过渡语】\n' +
    '"商家有了专属阵地，钱怎么分？——透明分账体系。" → 翻P12',
    { pageNum: 'P11' }
);

// ============================================================================
// P12: 透明分账 —— "每笔交易清清楚楚"
// ============================================================================
contentSlide(
    '透明分账——每笔交易清清楚楚',
    [
        { subtitle: true, text: '三大业态分账比例 · 全部100%透明公示', color: BRAND.DEEP_BLUE, size: 17 },
        { text: '', level: 0 },
        { header: true, text: '平台商家（品牌餐饮/连锁零售/生活服务品牌）', color: BRAND.CHAIN_RED },
        { text: '商家75.4% | 平台5% | 服务站+推广者9% | 城市服务商1% | 消费金3% | 营销池4% | 风控2% | 渠道0.6%', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '联盟商家（社区餐饮/便利店/美发/药店/维修）', color: BRAND.WARM_ORANGE },
        { text: '商家71.4% | 平台渠道费4.5% | 平台5% | 服务站+推广者10% | 城市服务商1% | 消费金2% | 营销池3.5% | 风控2% | 渠道0.6%', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '综合商城（标品零售/日用品/食品饮料）', color: BRAND.MID_GRAY },
        { text: '商家77.9% | 平台6% | 服务站+推广者6% | 城市服务商1% | 消费金3% | 营销池3.5% | 风控2% | 渠道0.6%', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '商家拿大头（71-78%）| 平台仅收5-6%服务费 | 零固定费用', color: BRAND.GREEN, size: 16 },
    ],
    '【讲述要点·P12 · 约1.5分钟】\n' +
    '1. 透明是关键——"每一笔交易的每一分钱去向，都清清楚楚"\n' +
    '2. 对比竞品："美团抽18-22%，我们抽5-6%——差别在哪？我们不做配送，我们把钱省给商家和推广者"\n' +
    '3. "服务站+推广者9-10%"——这是推广激励的动力来源\n' +
    '4. "风控2%"——汇付托管，平台不能动用——这是安全垫\n' +
    '5. 数字不必逐行念——重点讲商家、平台、推广者三方的分配逻辑\n' +
    '\n' +
    '【过渡语】\n' +
    '"推广者怎么参与？服务站怎么建？——三级管理体系。" → 翻P13',
    { pageNum: 'P12' }
);

// ============================================================================
// P13: 三级管理体系
// ============================================================================
contentSlide(
    '三级管理体系——城市服务商 → 服务站 → 推广者',
    [
        { header: true, text: '🏙️ 城市服务商（区域合伙人）', color: BRAND.CHAIN_RED },
        { text: '独立经营权 | 区域总交易额1%分成 | 负责区域内服务站招募和管理', level: 1 },
        { text: '首批仅开放有限城市/区域——先到先占位', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🏪 服务站（社区节点）', color: BRAND.TECH_BLUE },
        { text: '服务站+推广者佣金池 | 服务站自留35% | 推广者65%', level: 1 },
        { text: '需要：固定场地 + 运营团队 + 社区关系', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🚶 推广者（一线推广）', color: BRAND.GREEN },
        { text: '零门槛参与 | 获得佣金池65%中的个人份额 | 多劳多得、少劳少得、不劳不得', level: 1 },
        { text: '收入基于自己拓展商家的实际交易额——非人头费、非入门费', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: '核心原则', color: BRAND.RED },
        { text: '仅一层推广关系——不发展下线、不拉人头——完全符合监管', level: 0, bold: true },
    ],
    '【讲述要点·P13 · 约1.5分钟】\n' +
    '1. 三级管理体系要一句话说清层级关系："城市服务商管一个区域→服务站管一个社区→推广者管一片商家"\n' +
    '2. 重点强调合规——"仅一层推广关系，不发展下线"\n' +
    '3. "多劳多得"逻辑——不做收入承诺，但说清楚收入来源\n' +
    '4. 城市服务商是"区域合伙人"——不只是拿分成，是独立经营权\n' +
    '\n' +
    '【过渡语】\n' +
    '"三级管理+分账+跨店通兑——这套体系合规吗？——合规是我们的护城河。" → 翻P14',
    { pageNum: 'P13' }
);

// ============================================================================
// P14: 合规体系 —— "合规即壁垒"
// ============================================================================
contentSlide(
    '合规即壁垒——三条红线筑起护城河',
    [
        { header: true, text: '🚫 红线一：积分不可兑现', color: BRAND.RED },
        { text: '积分只能在平台内消费使用，不可兑换现金、不可提现、不可转账', level: 1 },
        { text: '不涉及金融兑换——纯粹的消费激励工具', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🚫 红线二：不可形成资金池', color: BRAND.RED },
        { text: '所有交易资金由汇付（持牌支付机构）直接清分至各方账户', level: 1 },
        { text: '平台不触碰资金——无充值、无预存、无沉淀', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: '🚫 红线三：不可承诺收益', color: BRAND.RED },
        { text: '推广者/服务商收入基于实际交易——不做任何收入承诺或回报暗示', level: 1 },
        { text: '禁止使用"稳赚""躺赚""投资回报""增值"等诱导性语言', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🛡️ 16项术语强制替换 + 9个绝对禁用词', color: BRAND.DEEP_BLUE },
        { text: '"数字资产"→"消费权益" | "收益"→"服务费" | "变现"→"转化" | "创业"→"参与推广" …等16组替换', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '合规不是限制——合规是我们的护城河', color: BRAND.GREEN, size: 18 },
        { text: '监管越严格，合规平台越有优势——不合规的竞品被清理，我们留下来', level: 0, bold: true },
    ],
    '【讲述要点·P14 · 约1.5分钟】\n' +
    '1. 三条红线逐一展开，每条先讲"红线内容"再讲"我们怎么做的"\n' +
    '2. 语气要严肃坚定——"这三条红线不是口号，是写进代码和合同里的铁律"\n' +
    '3. "汇付直清"是多次出现的核心概念——反复强调建立信任\n' +
    '4. "16项术语替换"——展示品牌的专业性和法务严谨\n' +
    '5. 最后一句上升高度——"合规即壁垒"是一个强有力的概念，讲到这句要放慢、加重\n' +
    '6. 可补充案例："过去三年，P2P、虚拟币、传销式微商——多少不合规的平台消失了？合规才能走远。"\n' +
    '\n' +
    '【过渡语】\n' +
    '"体系建立起来了，跟竞争对手比怎么样？——五大维度全面对比。" → 翻P15',
    { pageNum: 'P14' }
);

// ============================================================================
// P15: 竞品对比
// ============================================================================
contentSlide(
    '链邦赋商通 vs 竞品——五大维度全面对比',
    [
        { header: true, text: '🆚 vs 美团（6大战场）', color: BRAND.CHAIN_RED },
        { text: '服务费率：5% vs 18-22% | 核心差异：我们不抢外卖订单，我们帮商家做复购', level: 1 },
        { text: '商家数据：归商家所有 vs 平台截留 | 跨店互通：✓ vs ✗ | 会员体系：全平台互通 vs 单店独立', level: 1 },
        { text: '定位：商家经营工具 vs 外卖流量平台——互补而非替代', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: '🆚 vs 抖音（4大战场）', color: BRAND.TECH_BLUE },
        { text: '交易闭环：✓ vs ✗（种草引流）| 社区深度：精耕社区 vs 泛流量 | 稳定性：持续经营 vs 爆款依赖', level: 1 },
        { text: '成本结构：按成交收费 vs 投流费用+内容制作——确定性更强', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🆚 vs 有赞/微盟（3大战场）', color: BRAND.GREEN },
        { text: '模式：生态平台 vs 纯SaaS工具 | 年费：免年费 vs ¥6,800+ | 跨店互通：✓ vs ✗', level: 1 },
        { text: '有赞给商家一个独立店铺——我们给商家一个互联互通的社区商业网络', level: 1, bold: true },
    ],
    '【讲述要点·P15 · 约2分钟】\n' +
    '1. 竞品对比要注意语气——不是贬低竞品，是客观比较差异\n' +
    '2. "不是替代美团/抖音——是互补"——这个态度很重要，显得成熟专业\n' +
    '3. 核心差异一句话："他们做流量分发，我们做复购经营"\n' +
    '4. vs有赞——"有赞给你开一家店，我们帮你融入一个社区网络"\n' +
    '5. 这一页可能会引发Q&A提问——准备好竞品相关的更多细节\n' +
    '\n' +
    '【过渡语】\n' +
    '"竞争优势有了，账算得过来吗？——来看看财务模型。" → 翻P16',
    { pageNum: 'P15' }
);

// ============================================================================
// P16: 财务模型
// ============================================================================
contentSlide(
    '轻资产模式的财务逻辑',
    [
        { header: true, text: '盈亏平衡', color: BRAND.CHAIN_RED },
        { text: '40,500笔/月 —— 假设月GMV ¥202.5万（笔均¥50），即可覆盖全部运营成本', level: 0, bold: true },
        { text: '对比：美团头部城市单个BD月GMV约¥50-80万——一个小型团队即可达成盈亏平衡', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '平台净利率', color: BRAND.DEEP_BLUE },
        { text: '0.89%（盈亏平衡点）→ 规模效应后逐年提升', level: 0 },
        { text: '轻资产模式：零库存、零门店、零配送——边际成本趋近于零', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '收入结构', color: BRAND.DEEP_BLUE },
        { text: '平台服务费（5-6%）+ 平台渠道费（联盟4.5%）+ 增值服务（未来）', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '成本结构', color: BRAND.DEEP_BLUE },
        { text: '技术研发 + 运营团队 + 市场营销 + 城市服务商/服务站/推广者佣金', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '关键优势', color: BRAND.GREEN },
        { text: '零库存风险 | 零门店租金 | 零配送成本 | 规模效应显著 | 边际成本趋零', level: 0 },
    ],
    '【讲述要点·P16 · 约2分钟】\n' +
    '1. "40,500笔"是关键数字——让听众记一个数字：四万笔\n' +
    '2. 类比："一个中型社区每天约2,000笔消费——20个这样的社区就够盈亏平衡了"\n' +
    '3. "轻资产"是核心卖点——零库存零门店零配送，对比京东/美团的资产之重\n' +
    '4. 不展开详细P&L——留给一对一沟通或尽调材料\n' +
    '5. 如果听众是投资者，可补充："母公司全球拼购（GGbingo）提供战略资金支持"\n' +
    '\n' +
    '【过渡语】\n' +
    '"财务模型健康，那怎么合作？——三种方式，总有适合你的。" → 翻P17',
    { pageNum: 'P16' }
);

// ============================================================================
// P17: 合作模式
// ============================================================================
contentSlide(
    '三种合作方式——选择适合你的角色',
    [
        { header: true, text: '🏙️ 城市服务商 · 区域合伙人', color: BRAND.CHAIN_RED },
        { text: '适合：有区域商业资源的企业/个人 | 有一定资金实力和管理能力', level: 1 },
        { text: '权益：区域独家经营权 | 区域总交易额1%分成 | 自建服务站体系', level: 1 },
        { text: '条件：资质审核 + 合作协议 + 区域保证金', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🏪 服务站 · 社区节点', color: BRAND.TECH_BLUE },
        { text: '适合：有固定场地的社区经营者 | 便利店/驿站/物业等', level: 1 },
        { text: '权益：服务站+推广者佣金池35% | 社区独家经营权', level: 1 },
        { text: '条件：场地审核 + 服务协议 + 运营团队', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🚶 推广者 · 一线推广', color: BRAND.GREEN },
        { text: '适合：任何有志于社区商业推广的个人 | 零门槛、零投入', level: 1 },
        { text: '权益：佣金池65%中的个人份额 | 注册即开始 | 多劳多得', level: 1 },
        { text: '条件：实名认证 + 服务协议 + 零费用', level: 1 },
        { text: '', level: 0 },
        { header: true, text: '🏪 商家入驻 · 零门槛', color: BRAND.WARM_ORANGE },
        { text: '零入驻费 | 零年费 | 零预充值 | 按成交收服务费 | 随时退出、无违约金', level: 0, bold: true },
    ],
    '【讲述要点·P17 · 约1.5分钟】\n' +
    '1. 四种角色逐一介绍——快速过，根据听众构成侧重讲\n' +
    '   - 如果听众主要是投资人/企业家 → 侧重城市服务商\n' +
    '   - 如果听众主要是社区店主 → 侧重服务站\n' +
    '   - 如果听众主要是个人 → 侧重推广者\n' +
    '2. "零门槛"是商家入驻的最大卖点——重点强调\n' +
    '3. "随时退出、无违约金"——消除顾虑\n' +
    '\n' +
    '【过渡语】\n' +
    '"合作方式清楚了，那我们接下来的发展规划是什么？" → 翻P18',
    { pageNum: 'P17' }
);

// ============================================================================
// P18: 发展规划
// ============================================================================
contentSlide(
    '三阶段发展路线图',
    [
        { header: true, text: 'Phase 1 · 公测冲刺期（2026.6 - 2026.8）', color: BRAND.CHAIN_RED },
        { text: '验证产品-市场匹配（PMF）| 打磨核心体验 | 建立标杆案例', level: 1 },
        { text: '目标：首批100商家 + 10城市服务商 + 100推广者 | 实现盈亏平衡', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: 'Phase 2 · 区域扩张期（2026.9 - 2027.2）', color: BRAND.WARM_ORANGE },
        { text: '城市复制模型 | 网络效应初步形成 | 品牌认知建立', level: 1 },
        { text: '目标：覆盖5城 + 500商家 + 50服务商 | 月交易突破10万笔', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: 'Phase 3 · 规模增长期（2027.3+）', color: BRAND.TECH_BLUE },
        { text: '品牌势能爆发 | 生态闭环成型 | 全国复制加速', level: 1 },
        { text: '目标：全国主要城市覆盖 | 跨店通兑网络效应最大化 | 启动下一轮融资', level: 1, bold: true },
        { text: '', level: 0 },
        { header: true, text: '每一步都有Go/No-Go决策节点——不盲目扩张，数据驱动决策', color: BRAND.GREEN },
    ],
    '【讲述要点·P18 · 约1.5分钟】\n' +
    '1. 三阶段节奏清晰——不浮夸、不画大饼，每个阶段都有可验证的目标\n' +
    '2. "Go/No-Go决策节点"——展示管理理性："我们不会无脑扩张，每一阶段达标才推进下一步"\n' +
    '3. Phase 1是当前——"我们现在就在第一阶段，你加入的是从0到1的创业团队"\n' +
    '4. Phase 3留有余地——"全国复制"而非"全球化"，聚焦国内，务实可信\n' +
    '\n' +
    '【过渡语】\n' +
    '"发展规划清晰了——那现在加入有什么好处？为什么是现在？" → 翻P19',
    { pageNum: 'P18' }
);

// ============================================================================
// P19: 行动号召
// ============================================================================
contentSlide(
    '现在加入——公测期的先发优势',
    [
        { subtitle: true, text: '在万亿市场里，位置比努力更重要——今天的位置决定明天的份额', color: BRAND.CHAIN_RED, size: 18 },
        { text: '', level: 0 },
        { header: true, text: '🏪 首批入驻商家 · 黄金窗口', color: BRAND.CHAIN_RED },
        { text: '最高搜索权重（+2）——公测期过后不再开放', level: 0 },
        { text: '最低服务费率——首批商家享受费率优惠锁定', level: 0 },
        { text: '首页推荐位7天 + 新人礼包平台补贴 + 专属BD对接', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '🏙️ 首批城市服务商 · 区域独占', color: BRAND.TECH_BLUE },
        { text: '先到先占位——一个区域只签一家城市服务商', level: 0, bold: true },
        { text: '首批城市服务商享受费率优惠锁定和先发品牌红利', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '🚶 首批推广者 · 最高红利', color: BRAND.GREEN },
        { text: '第一批推广者享受最高佣金比例和最完整的培训支持', level: 0 },
        { text: '公测期入驻的商家——都是你的第一批客户资源', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '⏰ 公测期窗口有限——6月12日公测启动，窗口期不等人', color: BRAND.WARM_ORANGE, size: 17 },
    ],
    '【讲述要点·P19 · 约1分钟】\n' +
    '1. 这是全演示的情感高点——语气要从理性转为感性，从分析转为号召\n' +
    '2. 第一句引用"位置比努力更重要"——停顿，让这句话落地\n' +
    '3. 分角色逐一号召——根据听众构成有侧重\n' +
    '4. "公测期窗口有限"——制造适度的紧迫感，但不过度施压\n' +
    '5. 最后动作指引要清晰——"今天会后要去哪、找谁、做什么"\n' +
    '\n' +
    '【过渡语】\n' +
    '"我的分享到这里——接下来交给Q&A。谢谢各位。" → 翻P20',
    { pageNum: 'P19', accentColor: BRAND.CHAIN_RED }
);

// ============================================================================
// P20: Q&A + 尾页
// ============================================================================
endSlide();

// ============================================================================
// 附录幻灯片：Q&A预演（15题精选）
// ============================================================================
sectionSlide('Q&A 预演手册', '15题精选 · 标准回答 · 8大主题覆盖', BRAND.DEEP_BLUE);

// Q&A slides - 5 questions per slide, 3 slides total
var qaData = [
    { q: '你们跟美团有什么区别？', a: '美团是外卖+到店平台，收18-22%服务费。我们是社区经营平台，收5%左右，帮商家提升复购率——不是抢外卖订单，是互补关系。' },
    { q: '凭什么说能帮商家提升复购？', a: '三元营销体系——代金券拉新、积分留客、消费金锁客——三个工具协同，配合跨店通兑实现客流引导。商家是自主经营，我们提供工具。' },
    { q: '跨店通兑合法吗？', a: '完全合法。消费者权益在平台内部流转——资金由汇付（持牌支付机构）直接清分，不形成资金池，不构成"二清"。营销池统一结算，每笔可追踪审计。' },
    { q: '你们有支付牌照吗？', a: '我们不持有资金——所有交易由汇付（持牌支付机构）直接清分至各方账户。平台只收服务费，不触碰交易资金，不需要支付牌照。' },
    { q: '推广者模式是不是传销？', a: '绝对不是。推广者只有一层，收入基于自己拓展商家的交易额。零入门费、不发展下线、不拉人头——完全符合《禁止传销条例》要求。' },
    { q: '平台能撑多久？资金够吗？', a: '母公司全球拼购（GGbingo）提供战略资金支持。盈亏平衡仅需40,500笔/月——财务模型健康，轻资产模式资金需求小。根据发展需要适时启动外部融资。' },
    { q: '商家数据安全吗？', a: '客户消费数据归商家所有，平台不截留、不出售、不分析。商家可随时导出自己的客户数据。数据权益归商家——这是我们的基本原则。' },
    { q: '如果商家要退出怎么办？', a: '随时退出，无违约金、无任何费用。已产生的交易正常结算，未使用的代金券由平台营销池回收。入驻零门槛，退出零成本。' },
    { q: '城市服务商有什么权限？', a: '区域合伙人身份——独立经营权。负责区域内的服务站招募和管理，获得区域总交易额1%分成。首批仅开放有限区域，先到先占位。' },
    { q: '收入是固定的吗？能赚多少？', a: '推广者/服务商收入完全基于实际交易——多劳多得、少劳少得、不劳不得。我们不承诺任何收入数字——每个人的收入取决于自己的努力和市场条件。' },
    { q: '技术团队实力如何？', a: '独立技术团队，小程序基于微信生态开发，支付对接汇付。技术架构：微信小程序（前端）+ 云服务（后端）+ 汇付（支付清分）——稳定、可扩展。' },
    { q: '公测期有什么特殊政策？', a: '首月服务费减半、新人礼包平台补贴、首页推荐位7天、推广者专属对接。公测期是最佳入驻窗口——费率和搜索权重政策过后不再开放。' },
    { q: '竞品进来怎么办？壁垒在哪？', a: '核心壁垒是"跨店通兑"——需要同时建立消费者、商家、推广者三边网络。先发优势极强，网络一旦形成竞品难以复制。合规体系也是壁垒——监管越严我们越稳。' },
    { q: '你们融过资吗？下一轮什么时候？', a: '目前由母公司全球拼购战略支持。根据业务发展需要——Phase 1验证PMF → 适时启动首轮融资。今天在座的各位有机会参与早期。' },
    { q: '下一步怎么合作？具体流程？', a: '根据角色不同：商家→扫码注册→资料提交→开店上线（3-7天）。推广者→实名认证→协议签署→开始拓展（1天）。城市服务商→资质审核→协议签署→区域启动（7-14天）。今天会后可一对一详细沟通。' },
];

// Q&A Slide 1 (Q1-Q5)
(function() {
    var slide = pres.addSlide();
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: BRAND.DEEP_BLUE } });
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0.06, w: '100%', h: 0.85, fill: { color: BRAND.DEEP_BLUE } });
    slide.addText('Q&A 预演手册（Q1-Q5）', { x: 0.8, y: 0.15, w: '85%', h: 0.65, fontSize: 24, fontFace: FONT.title, color: BRAND.WHITE, bold: true, align: 'left', valign: 'middle' });

    var rows = [];
    // Header
    rows.push([
        { text: '#', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true, align: 'center' } },
        { text: '可能提问', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
        { text: '标准回答', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
    ]);
    for (var i = 0; i < 5 && i < qaData.length; i++) {
        var bgColor = i % 2 === 0 ? BRAND.SOFT_BG : BRAND.WHITE;
        rows.push([
            { text: String(i + 1), options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DEEP_BLUE, bold: true, align: 'center' } },
            { text: qaData[i].q, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY, bold: true } },
            { text: qaData[i].a, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY } },
        ]);
    }
    slide.addTable(rows, {
        x: 0.5, y: 1.2, w: '93%',
        colW: [0.4, 2.8, 9.5],
        border: { type: 'solid', color: BRAND.MID_GRAY, pt: 0.5 },
        rowH: [0.4, 1.35, 1.35, 1.35, 1.35, 1.35],
    });
    slide.addNotes('Q&A环节建议：\n1. 安排1-2位同事协助回答问题\n2. 主讲人回答核心问题，同事负责补充\n3. 遇到不确定的问题——"这个问题我记录下来，会后给您详细答复"\n4. 控制Q&A时长：10分钟，约可回答6-8个问题\n5. 第一个问题由团队同事先举手提问"暖场"——打破沉默');
})();

// Q&A Slide 2 (Q6-Q10)
(function() {
    var slide = pres.addSlide();
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: BRAND.DEEP_BLUE } });
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0.06, w: '100%', h: 0.85, fill: { color: BRAND.DEEP_BLUE } });
    slide.addText('Q&A 预演手册（Q6-Q10）', { x: 0.8, y: 0.15, w: '85%', h: 0.65, fontSize: 24, fontFace: FONT.title, color: BRAND.WHITE, bold: true, align: 'left', valign: 'middle' });

    var rows = [];
    rows.push([
        { text: '#', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true, align: 'center' } },
        { text: '可能提问', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
        { text: '标准回答', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
    ]);
    for (var i = 5; i < 10 && i < qaData.length; i++) {
        var bgColor = i % 2 === 0 ? BRAND.SOFT_BG : BRAND.WHITE;
        rows.push([
            { text: String(i + 1), options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DEEP_BLUE, bold: true, align: 'center' } },
            { text: qaData[i].q, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY, bold: true } },
            { text: qaData[i].a, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY } },
        ]);
    }
    slide.addTable(rows, {
        x: 0.5, y: 1.2, w: '93%',
        colW: [0.4, 2.8, 9.5],
        border: { type: 'solid', color: BRAND.MID_GRAY, pt: 0.5 },
        rowH: [0.4, 1.35, 1.35, 1.35, 1.35, 1.35],
    });
})();

// Q&A Slide 3 (Q11-Q15)
(function() {
    var slide = pres.addSlide();
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: BRAND.DEEP_BLUE } });
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0.06, w: '100%', h: 0.85, fill: { color: BRAND.DEEP_BLUE } });
    slide.addText('Q&A 预演手册（Q11-Q15）', { x: 0.8, y: 0.15, w: '85%', h: 0.65, fontSize: 24, fontFace: FONT.title, color: BRAND.WHITE, bold: true, align: 'left', valign: 'middle' });

    var rows = [];
    rows.push([
        { text: '#', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true, align: 'center' } },
        { text: '可能提问', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
        { text: '标准回答', options: { fontSize: 11, fontFace: FONT.body, color: BRAND.WHITE, bold: true } },
    ]);
    for (var i = 10; i < 15 && i < qaData.length; i++) {
        var bgColor = i % 2 === 0 ? BRAND.SOFT_BG : BRAND.WHITE;
        rows.push([
            { text: String(i + 1), options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DEEP_BLUE, bold: true, align: 'center' } },
            { text: qaData[i].q, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY, bold: true } },
            { text: qaData[i].a, options: { fontSize: 10, fontFace: FONT.body, color: BRAND.DARK_GRAY } },
        ]);
    }
    slide.addTable(rows, {
        x: 0.5, y: 1.2, w: '93%',
        colW: [0.4, 2.8, 9.5],
        border: { type: 'solid', color: BRAND.MID_GRAY, pt: 0.5 },
        rowH: [0.4, 1.35, 1.35, 1.35, 1.35, 1.35],
    });
})();

// ============================================================================
// Q&A策略页
// ============================================================================
contentSlide(
    'Q&A环节 · 执行策略',
    [
        { header: true, text: '时间控制', color: BRAND.CHAIN_RED },
        { text: 'Q&A总时长：10分钟（严格控时，不拖堂）', level: 0 },
        { text: '预计回答 6-8 个问题 | 每个问题控制在1-1.5分钟', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '团队配合', color: BRAND.DEEP_BLUE },
        { text: '主讲人：回答核心战略/模式类问题', level: 0 },
        { text: '同事A（技术/产品）：补充产品细节和功能问题', level: 0 },
        { text: '同事B（商务/合作）：补充合作流程和合同问题', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '应对技巧', color: BRAND.DEEP_BLUE },
        { text: '第一个问题建议由团队同事"暖场提问"——打破沉默', level: 0 },
        { text: '听到重复问题时——"这个问题刚才有类似回答，我补充一点……"', level: 0 },
        { text: '遇到不确定的问题——"这个问题我记录下来，会后给您详细答复"（会后真记+真回）', level: 0 },
        { text: '遇到攻击性问题——微笑、感谢、转向："谢谢您的关注，我们的理解是……"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '会后动作', color: BRAND.GREEN },
        { text: '意向登记：安排专人引导填写合作意向表（见D5签约工具包）', level: 0 },
        { text: '资料分发：平台一页纸+合作方案手册+FAQ手册', level: 0 },
        { text: '一对一洽谈：7天内完成意向跟进（见D1 7天跟进清单）', level: 0 },
    ],
    '【Q&A执行要点】\n' +
    '1. Q&A是转化的关键环节——不是被动回答问题，是主动创造机会\n' +
    '2. 前3个问题最重要——设置"暖场问题"确保开场顺利\n' +
    '3. 每个问题回答三步法：确认问题→ 给出答案→ 关联平台价值\n' +
    '4. 最后一个问题回答完后，立即衔接结束语+行动号召\n' +
    '5. 控制节奏：主讲人主导，同事辅助——不要变成多人抢答',
    { pageNum: 'Q&A策略', titleColor: BRAND.DEEP_BLUE, accentColor: BRAND.CHAIN_RED }
);

// ============================================================================
// 开场与结尾仪式
// ============================================================================
sectionSlide('开场与结尾仪式', '演示前后的仪式化流程 · 提升专业感和仪式感', BRAND.CHAIN_RED);

contentSlide(
    '开场仪式（P01→P02 · 约1分钟）',
    [
        { header: true, text: '第一步：主持人介绍（15秒）', color: BRAND.DEEP_BLUE },
        { text: '"各位下午好，欢迎来到链邦赋商通招商说明会。我是今天的主讲人[姓名]。"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '第二步：品牌短片/封面展示（15秒）', color: BRAND.DEEP_BLUE },
        { text: '播放15秒品牌短片（如有）或PPT停留在封面页P01', level: 0 },
        { text: '"在开始之前，请允许我用15秒展示我们的品牌视觉。"（播放）', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '第三步：自我介绍+议程概览（15秒）', color: BRAND.DEEP_BLUE },
        { text: '"我是[姓名]，[职位]。今天我会用30分钟，带大家了解——链邦赋商通是什么、为什么现在加入、以及如何合作。"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '第四步：抛出钩子问题（10秒）', color: BRAND.CHAIN_RED },
        { text: '"在座各位——你们觉得一个社区商家，每天流失的最大成本是什么？"', level: 0, bold: true },
        { text: '等待3秒，目光扫视全场 → 翻到P02', level: 0 },
        { text: '"不是房租、不是人工——是那些来了但没再回来的顾客。"', level: 0, bold: true },
    ],
    '【开场检查清单】\n' +
    '☐ 设备：投影/屏幕/翻页笔/麦克风 全部测试通过\n' +
    '☐ 计时器：设置25分钟倒计时（留5分钟缓冲）\n' +
    '☐ 材料：名片/一页纸/合作方案手册 按座位预摆\n' +
    '☐ 暖场：第一个Q&A问题已安排好（由同事提问）\n' +
    '☐ 签到：签到表就绪，有专人引导\n' +
    '☐ 状态：深呼吸×3，微笑，开始！',
    { pageNum: '开场' }
);

contentSlide(
    '结尾仪式（P19→P20 · 约2分钟）',
    [
        { header: true, text: '第一步：总结三个关键数字（20秒）', color: BRAND.DEEP_BLUE },
        { text: '"最后，我想请大家记住三个数字："', level: 0 },
        { text: '"5%——我们的平台服务费。18-22%的竞品费率——我们把省下的留给商家和推广者。"', level: 0 },
        { text: '"40,500——我们的月盈亏平衡交易笔数。轻资产模式，不需要巨额融资就能盈利。"', level: 0 },
        { text: '"0——商家的固定费用。零入驻、零年费、零预充、零成本退出。"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '第二步：重申价值主张（15秒）', color: BRAND.DEEP_BLUE },
        { text: '"在链生活，在哪花都在省，在哪得的券都能用——这是我们给每一位消费者的承诺。"', level: 0, bold: true },
        { text: '', level: 0 },
        { header: true, text: '第三步：行动号召（20秒）', color: BRAND.CHAIN_RED },
        { text: '"公测期窗口有限。今天会后，我们的同事会在洽谈区等候各位。"', level: 0 },
        { text: '"不管您今天是来了解、来考察、还是来合作——我们都准备好了。"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '第四步：感谢+联系方式+洽谈指引（15秒）', color: BRAND.DEEP_BLUE },
        { text: '"感谢各位的时间。我的联系方式在屏幕下方——我们在洽谈区见。"', level: 0 },
        { text: '', level: 0 },
        { header: true, text: '最后一句（看向听众，微笑）', color: BRAND.CHAIN_RED },
        { text: '"谢谢各位。我们在洽谈区见。"', level: 0, bold: true, size: 18 },
    ],
    '【结尾检查清单】\n' +
    '☐ 三个数字确保讲清楚——听众离场应该至少记住一个\n' +
    '☐ "洽谈区"位置在结尾前由主持人说明\n' +
    '☐ 个人联系方式在P20上清晰展示\n' +
    '☐ 收PPT后不要立刻离场——留在台前30秒，方便听众上前交流\n' +
    '☐ 结束后第一时间记录意向名单，交给跟进团队',
    { pageNum: '结尾' }
);

// ============================================================================
// 演示节奏控制参考页
// ============================================================================
contentSlide(
    '演示节奏控制 · 30分钟时间分配',
    [
        { header: true, text: '⏱️ 时间分配', color: BRAND.CHAIN_RED },
        { text: '', level: 0 },
        { text: 'P01 封面 —— 开场前展示（不计时）', level: 0 },
        { text: '开场仪式 —— 1分钟', level: 0 },
        { text: 'P02 开场钩子 —— 1分钟', level: 0 },
        { text: 'P03 行业痛点 —— 1.5分钟', level: 0 },
        { text: 'P04 市场机会 —— 1.5分钟', level: 0 },
        { text: 'P05 平台定位 —— 1.5分钟', level: 0 },
        { text: 'P06 核心创新 —— 2分钟 ★ 重点页', level: 0 },
        { text: 'P07 商业模式 —— 2分钟 ★ 重点页', level: 0 },
        { text: 'P08 消费流转 —— 2分钟 ★ 重点页', level: 0 },
        { text: 'P09 跨店通兑 —— 1.5分钟', level: 0 },
        { text: 'P10 三元营销 —— 1.5分钟', level: 0 },
        { text: 'P11 千面千店 —— 1分钟 △ 可加速', level: 0 },
        { text: 'P12 透明分账 —— 1.5分钟', level: 0 },
        { text: 'P13 三级管理 —— 1.5分钟 △ 可加速', level: 0 },
        { text: 'P14 合规体系 —— 1.5分钟', level: 0 },
        { text: 'P15 竞品对比 —— 2分钟 ★ 重点页', level: 0 },
        { text: 'P16 财务模型 —— 2分钟 ★ 重点页', level: 0 },
        { text: 'P17 合作模式 —— 1.5分钟', level: 0 },
        { text: 'P18 发展规划 —— 1.5分钟', level: 0 },
        { text: 'P19 行动号召 —— 1分钟', level: 0 },
        { text: '结尾仪式 —— 1分钟', level: 0 },
        { text: 'Q&A互动 —— 10分钟', level: 0, bold: true },
        { text: '', level: 0 },
        { header: true, text: '总计：20分钟讲解 + 10分钟Q&A = 30分钟', color: BRAND.DEEP_BLUE },
        { text: '★ 重点页共5页（P06/P07/P08/P15/P16）—— 约10分钟，占讲解时间50%', level: 0 },
        { text: '△ 可加速页共2页（P11/P13）—— 如时间紧张可压缩至30秒快讲', level: 0 },
    ],
    '【节奏控制要点】\n' +
    '1. 重点页（★）放慢——每页2分钟，讲透\n' +
    '2. 过渡页快速过——P11千面千店/P13三级管理 必要时压缩\n' +
    '3. 每5页检查一次计时器——落后则加速，超前则深化重点页\n' +
    '4. Q&A严格10分钟——由主持人控制时间，15题备用\n' +
    '5. 预留5分钟缓冲——总时长不超过35分钟',
    { pageNum: '节奏' }
);

// ============================================================================
// WRITE FILE
// ============================================================================
console.log('正在生成招商会销讲PPT...');
console.log('结构：20页标准演示 + 3页Q&A附录 + 开场/结尾仪式 + 节奏控制');

pres.writeFile({ fileName: OUT_FILE })
    .then(function() {
        var stats = fs.statSync(OUT_FILE);
        console.log('✅ 招商会销讲PPT已生成: ' + OUT_FILE);
        console.log('   文件大小: ' + (stats.size / 1024).toFixed(1) + ' KB');
        console.log('   共 ' + (pres.slides ? pres.slides.length : '28') + ' 张幻灯片');
        console.log('   适用场合: 招商会 / 投资人路演 / 合作伙伴说明会');
        console.log('   演示时长: 30分钟（20分钟讲解 + 10分钟Q&A）');
        console.log('   每页均含: 标题 + 核心内容 + 讲述要点（备注栏）');
        console.log('   品牌色系: 链商红#D62828 + 深海蓝#1A5276 + 科技蓝#1F5EFF');
    })
    .catch(function(err) {
        console.error('❌ 生成失败: ' + err.message);
        console.error(err.stack);
    });
