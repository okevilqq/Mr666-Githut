// ============================================================================
// 链商2.0 · 文档生成脚本模板
// ============================================================================
// 使用方法：
//   1. 复制本文件 → generate_YOUR_SCRIPT.js
//   2. 全局搜索替换 __PLACEHOLDER__ 标记
//   3. 在 "YOUR CONTENT" 区域填充文档内容
//   4. 运行：node generate_YOUR_SCRIPT.js
// ============================================================================
// 占位符说明：
//   __SCRIPT_NAME__    → 脚本文件名（如 generate_xxx.js）
//   __OUTPUT_FILE__    → 输出文件路径
//   __DOC_TITLE__      → 文档标题（metadata + H1）
//   __SHORT_DESC__     → 一句话说明文档用途
// ============================================================================

const {
    C, BRAND, h1, h2, h3, p, b, n,
    divider, pageBreak, spacer,
    dataTable, infoTable,
    flowBox, calloutBox, calloutInline,
    redline, greenCheck,
    fmt, pct, pct1,
    createDoc, buildAndWrite,
} = require('./lib/docx-helpers');

// ⭐ 集中参数库 — 所有业务参数从这里取，不要硬编码
const {
    MODEL, CHANNEL, PLATFORM_DIST, ALLIANCE_DIST, ECOMMERCE_DIST,
    MARKETING, MANAGEMENT, FINANCIAL,
    COLORS, STORE_TIER,
    COMPLIANCE_MAP, COMPLIANCE_FORBIDDEN, COMPLIANCE_REDLINES,
    FONT, OUTDIR, META,
} = require('./lib/constants');

const path = require('path');

// ============================================================================
// OUTPUT CONFIG — 修改这里
// ============================================================================

const OUT_FILE = path.join(__dirname, OUTDIR, '__OUTPUT_FILE__');
const DOC_TITLE = '__DOC_TITLE__';

// ============================================================================
// CONTENT BUILDERS — 在这里组织你的文档内容
// ============================================================================

function buildCover() {
    return [
        h1(DOC_TITLE),
        p('链商2.0 · ' + META.company, { color: C.GRAY, align: require('docx').AlignmentType.CENTER }),
        divider(),
    ];
}

function buildChapter1() {
    return [
        h2('一、概述'),
        p('此处填写概述内容。链商2.0定位：' + [
            '商户独立经营', '生态会员互通', '消费权益流转', '真实交易激励'
        ].join('·')),
        divider(),
        // 示例：使用集中参数
        calloutBox('核心参数引用示例', [
            '支付渠道成本：' + pct(CHANNEL.HUIFU_ACQUIRING),
            '平台商家到手率：' + pct(PLATFORM_DIST.merchant),
            '盈亏平衡：' + FINANCIAL.breakevenTransactions.toLocaleString() + ' 笔/月',
            '净利率：' + pct(FINANCIAL.netMargin),
        ], C.LIGHT, { borderColor: COLORS.DEEP_BLUE }),
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// YOUR CONTENT HERE — 按章节填充你的文档内容
// 每个 buildChapterN() 返回一个 Paragraph/Table 数组
// ═══════════════════════════════════════════════════════════════════════════

function buildChapter2() {
    return [
        h2('二、'),
        p('待填充'),
    ];
}

function buildChapter3() {
    return [
        h2('三、'),
        p('待填充'),
    ];
}

// ... 继续添加章节 (通常 10 章 + 3 附录)

function buildAppendices() {
    return [
        pageBreak(),
        h2('附录'),
        h3('附录A：'),
        p('待填充'),
        divider(),
        h3('附录B：'),
        p('待填充'),
        divider(),
        h3('附录C：'),
        p('待填充'),
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// END YOUR CONTENT
// ═══════════════════════════════════════════════════════════════════════════

// ============================================================================
// COMPLIANCE CHECK — 自动扫描非合规术语（生成完成后在控制台输出警告）
// ============================================================================

function runComplianceCheck(children) {
    // 简易文本提取（提取 Paragraph 中的 text）
    function extractText(el) {
        if (!el) return '';
        if (typeof el === 'string') return el;
        // Paragraph
        if (el.root && el.root.length) {
            return el.root.map(function(r) { return r.text || ''; }).join('');
        }
        // Table → 递归提取单元格文本
        if (el.root && Array.isArray(el.root)) {
            return el.root.map(extractText).join(' ');
        }
        // 数组递归
        if (Array.isArray(el)) return el.map(extractText).join(' ');
        return '';
    }

    var fullText = '';
    try {
        fullText = children.map(extractText).join(' ');
    } catch(e) {
        fullText = '';
    }

    var warnings = [];
    COMPLIANCE_FORBIDDEN.forEach(function(word) {
        if (fullText.indexOf(word) !== -1) {
            warnings.push('⛔ 禁用词发现: "' + word + '"');
        }
    });

    Object.keys(COMPLIANCE_MAP).forEach(function(bad) {
        if (fullText.indexOf(bad) !== -1) {
            warnings.push('⚠️ 建议替换: "' + bad + '" → "' + COMPLIANCE_MAP[bad] + '"');
        }
    });

    if (warnings.length > 0) {
        console.log('\n📋 === 合规术语检查 (' + DOC_TITLE + ') ===');
        warnings.forEach(function(w) { console.log('  ' + w); });
        console.log('📋 === 检查完毕 (' + warnings.length + ' 项警告) ===\n');
    } else {
        console.log('✅ 合规术语检查通过: ' + DOC_TITLE);
    }
}

// ============================================================================
// BUILD & OUTPUT
// ============================================================================

async function main() {
    var children = [].concat(
        buildCover(),
        buildChapter1(),
        buildChapter2(),
        buildChapter3(),
        // 添加更多章节...
        buildAppendices()
    );

    // 生成前自动合规检查
    runComplianceCheck(children);

    var outPath = await buildAndWrite(children, OUT_FILE, { title: DOC_TITLE });
    console.log('✅ 文档已生成: ' + outPath);
}

main().catch(function(err) {
    console.error('❌ 生成失败:', err);
    process.exit(1);
});
