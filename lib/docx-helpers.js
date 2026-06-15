// ============================================================================
// 链商2.0 · 文档生成公共库 (docx-helpers)
// Shared helper functions for all generate_*.js scripts
// ============================================================================
// Usage:
//   const { C, h1, h2, h3, p, b, n, divider, pageBreak,
//           dataTable, infoTable, flowBox, calloutBox,
//           redline, greenCheck, fmt, pct,
//           createDoc } = require('./lib/docx-helpers');
// ============================================================================

const docx = require('docx');
const fs = require('fs');
const path = require('path');

const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType, PageBreak
} = docx;

// ============================================================================
// 1. COLOR CONSTANTS
// ============================================================================

// Standard palette — used by ~25 scripts
const C = {
    MAIN:   '#1A5276',
    DARK:   '#2C3E50',
    LIGHT:  '#EBF5FB',
    WHITE:  '#FFFFFF',
    BLACK:  '#333333',
    GRAY:   '#7F8C8D',
    RED:    '#C0392B',
    GREEN:  '#1E8449',
    ORANGE: '#E67E22',
    HEADER: '#1a1a2e',
    YELLOW: '#F39C12',
};

// Extended brand colors (链商2.0 visual identity)
const BRAND = {
    BRAND_RED:   '#D62828',  // 链商红 — primary CTA
    TECH_BLUE:   '#1F5EFF',  // 科技蓝 — data/links
    DARKGRAY:    '#333333',  // body text
    GOLD:        '#D4A843',  // 代金券金
    WARM_ORANGE: '#F27E34',
    DEEP_GREEN:  '#0E6655',
    LIGHT_GRAY:  '#F5F6FA',
    SKY:         '#5DADE2',
    CORAL:       '#E74C3C',
    MINT:        '#27AE60',
    WARM_BG:     '#FDEBD0',  // warm beige
    SOFT_BG:     '#F8F9FA',  // soft card bg
};

// ============================================================================
// 2. HEADING HELPERS
// ============================================================================

/**
 * h1(t, opts) — Heading 1 with bottom border
 * @param {string} t - heading text
 * @param {object} [opts] - override border color, spacing, size
 */
function h1(t, opts) {
    opts = opts || {};
    return new Paragraph({
        text: t,
        heading: HeadingLevel.HEADING_1,
        spacing: {
            before: opts.before || 400,
            after:  opts.after  || 200,
        },
        border: {
            bottom: {
                style: BorderStyle.SINGLE,
                size:  opts.borderSize || 2,
                color: opts.borderColor || C.MAIN,
            },
        },
    });
}

/**
 * h2(t, opts) — Heading 2
 */
function h2(t, opts) {
    opts = opts || {};
    return new Paragraph({
        text: t,
        heading: HeadingLevel.HEADING_2,
        spacing: {
            before: opts.before || 300,
            after:  opts.after  || 150,
        },
    });
}

/**
 * h3(t, opts) — Heading 3
 */
function h3(t, opts) {
    opts = opts || {};
    return new Paragraph({
        text: t,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            before: opts.before || 200,
            after:  opts.after  || 100,
        },
    });
}

// ============================================================================
// 3. TEXT HELPERS
// ============================================================================

/**
 * p(t, opts) — Body paragraph
 * @param {string} t - text content
 * @param {object} [opts] - { bold, color, size, font, align, indent, after, line, italics }
 */
function p(t, opts) {
    opts = opts || {};
    return new Paragraph({
        children: [
            new TextRun({
                text: t,
                size:    opts.size    || 21,
                font:    opts.font    || '微软雅黑',
                bold:    !!opts.bold,
                color:   opts.color   || C.BLACK,
                italics: !!opts.italics,
            }),
        ],
        spacing: {
            after: opts.after || 80,
            line:  opts.line  || 360,
        },
        alignment: opts.align,
        indent:    opts.indent,
    });
}

/**
 * b(t, opts) — Bullet point with indent
 */
function b(t, opts) {
    opts = opts || {};
    return new Paragraph({
        children: [
            new TextRun({
                text:  '• ' + t,
                size:  opts.size  || 21,
                font:  opts.font  || '微软雅黑',
                bold:  !!opts.bold,
                color: opts.color || C.BLACK,
            }),
        ],
        spacing: {
            after: opts.after || 60,
            line:  opts.line  || 340,
        },
        indent: opts.indent || { left: 600 },
    });
}

/**
 * n(i, t, opts) — Numbered list item
 * @param {number} i - item number
 * @param {string} t - text
 * @param {object} [opts]
 */
function n(i, t, opts) {
    opts = opts || {};
    return new Paragraph({
        children: [
            new TextRun({
                text:  i + '. ' + t,
                size:  opts.size  || 21,
                font:  opts.font  || '微软雅黑',
                bold:  !!opts.bold,
                color: opts.color || C.BLACK,
            }),
        ],
        spacing: {
            after: opts.after || 60,
            line:  opts.line  || 340,
        },
        indent: opts.indent || { left: 600 },
    });
}

// ============================================================================
// 4. LAYOUT HELPERS
// ============================================================================

/** divider() — Empty spacer paragraph */
function divider() {
    return new Paragraph({ spacing: { after: 200 }, children: [] });
}

/** pageBreak() — Manual page break */
function pageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
}

/**
 * spacer(h) — Vertical spacer of custom height
 * @param {number} h — spacing.after in twips (default 200)
 */
function spacer(h) {
    h = h || 200;
    return new Paragraph({ spacing: { after: h }, children: [] });
}

// ============================================================================
// 5. TABLE HELPERS
// ============================================================================

/**
 * dataTable(headers, rows, opts) — Generic data table
 * @param {string[]} headers - column headers
 * @param {Array<string[]>} rows - 2D array of cell values
 * @param {object} [opts] - { small, headerColor, headerTextColor, alignHeaders }
 */
function dataTable(headers, rows, opts) {
    opts = opts || {};
    var hdrSize = opts.small ? 17 : 19;
    var cellSize = opts.small ? 16 : 18;
    var hdrFill = opts.headerColor || C.HEADER;
    var hdrText = opts.headerTextColor || C.WHITE;

    var hdrRow = new TableRow({
        children: headers.map(function (h) {
            return new TableCell({
                shading: { fill: hdrFill },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: h,
                                size: hdrSize,
                                font: '微软雅黑',
                                bold: true,
                                color: hdrText,
                            }),
                        ],
                        alignment: opts.alignHeaders || AlignmentType.CENTER,
                        spacing: { before: 20, after: 20 },
                    }),
                ],
            });
        }),
    });

    var dataRows = rows.map(function (r, i) {
        var cells = Array.isArray(r) ? r : [r];
        return new TableRow({
            children: cells.map(function (c) {
                return new TableCell({
                    shading: i % 2 === 0 ? { fill: C.LIGHT } : undefined,
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: String(c || '—'),
                                    size: cellSize,
                                    font: '微软雅黑',
                                }),
                            ],
                            spacing: { before: 15, after: 15 },
                        }),
                    ],
                });
            }),
        });
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [hdrRow].concat(dataRows),
    });
}

/**
 * infoTable(rows, opts) — Two-column key:value info table
 * @param {Array<[string,string]>} rows - [[label, value], ...]
 * @param {object} [opts] - { labelWidth, valueWidth, labelColor, fontSize }
 */
function infoTable(rows, opts) {
    opts = opts || {};
    var lw = opts.labelWidth || 18;
    var vw = opts.valueWidth || 82;
    var fs = opts.fontSize || 20;
    var lc = opts.labelColor || C.MAIN;

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map(function (kv) {
            return new TableRow({
                children: [
                    new TableCell({
                        width: { size: lw, type: WidthType.PERCENTAGE },
                        shading: { fill: C.LIGHT },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: kv[0],
                                        size: fs,
                                        font: '微软雅黑',
                                        bold: true,
                                        color: lc,
                                    }),
                                ],
                                alignment: AlignmentType.RIGHT,
                                spacing: { before: 30, after: 30 },
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: vw, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: kv[1],
                                        size: fs,
                                        font: '微软雅黑',
                                    }),
                                ],
                                spacing: { before: 30, after: 30 },
                            }),
                        ],
                    }),
                ],
            });
        }),
    });
}

// ============================================================================
// 6. CALLOUT / ALERT HELPERS
// ============================================================================

/**
 * flowBox(text, isRed) — Prominent bordered alert box
 * @param {string} text
 * @param {boolean} [isRed] — red alert style if true, blue info style otherwise
 */
function flowBox(text, isRed) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: isRed ? '#FFF5F5' : C.LIGHT },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: text,
                                        size: 18,
                                        font: '微软雅黑',
                                        bold: isRed,
                                        color: isRed ? C.RED : C.DARK,
                                    }),
                                ],
                                spacing: { before: 15, after: 15 },
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                        border: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 1,
                                color: isRed ? C.RED : C.MAIN,
                            },
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 1,
                                color: isRed ? C.RED : C.MAIN,
                            },
                        },
                    }),
                ],
            }),
        ],
    });
}

/**
 * calloutBox(title, content, color) — Left-bordered callout with title + bullet content
 * @param {string} title - bold title line
 * @param {string[]} content - array of content lines
 * @param {string} [color] - background shading color (default C.LIGHT)
 * @param {object} [opts] - { borderColor, titleSize, contentSize }
 */
function calloutBox(title, content, color, opts) {
    opts = opts || {};
    color = color || C.LIGHT;
    var borderColor = opts.borderColor || C.MAIN;
    var titleSize = opts.titleSize || 19;
    var contentSize = opts.contentSize || 18;

    var paras = [
        new Paragraph({
            children: [
                new TextRun({
                    text: title,
                    size: titleSize,
                    font: '微软雅黑',
                    bold: true,
                    color: C.MAIN,
                }),
            ],
            spacing: { before: 15, after: 5 },
        }),
    ];

    for (var i = 0; i < content.length; i++) {
        paras.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: '  ' + content[i],
                        size: contentSize,
                        font: '微软雅黑',
                    }),
                ],
                spacing: { after: 4 },
            })
        );
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: { fill: color },
                        children: paras,
                        border: {
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 4,
                                color: borderColor,
                                space: 6,
                            },
                        },
                        spacing: { before: 15, after: 15 },
                    }),
                ],
            }),
        ],
    });
}

/**
 * calloutInline(text, type) — Inline icon+text callout (brochure style)
 * @param {string} text
 * @param {string} [type] - 'info'|'success'|'warning'|'danger'|'highlight'
 */
function calloutInline(text, type) {
    type = type || 'info';
    var colors = {
        info:      C.MAIN,
        success:   C.GREEN,
        warning:   C.ORANGE,
        danger:    C.RED,
        highlight: BRAND.GOLD || '#D4A843',
    };
    var icons = {
        info:      '💡',
        success:   '✅',
        warning:   '⚠️',
        danger:    '🔴',
        highlight: '✨',
    };

    return new Paragraph({
        children: [
            new TextRun({
                text: (icons[type] || '💡') + ' ' + text,
                size: 21,
                font: '微软雅黑',
                bold: true,
                color: colors[type] || C.MAIN,
            }),
        ],
        spacing: { before: 100, after: 100 },
        indent: { left: 400 },
        border: {
            left: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: colors[type] || C.MAIN,
            },
        },
    });
}

// ============================================================================
// 7. COMPLIANCE / STATUS HELPERS
// ============================================================================

/**
 * redline(text) — Red warning paragraph with ⛔ icon + left border
 */
function redline(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: '⛔ ' + text,
                size: 21,
                font: '微软雅黑',
                bold: true,
                color: C.RED,
            }),
        ],
        spacing: { after: 80, line: 360 },
        indent: { left: 300 },
        border: {
            left: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: C.RED,
                space: 8,
            },
        },
    });
}

/**
 * greenCheck(text) — Green success paragraph with ✅ icon
 */
function greenCheck(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: '✅ ' + text,
                size: 21,
                font: '微软雅黑',
                color: C.GREEN,
            }),
        ],
        spacing: { after: 60, line: 340 },
        indent: { left: 300 },
    });
}

// ============================================================================
// 8. FORMATTING HELPERS
// ============================================================================

/** fmt(yuan) — Format a number as ¥X.XX */
function fmt(yuan) {
    return '¥' + yuan.toFixed(2);
}

/** pct(rate) — Format a decimal rate as XX.XX% */
function pct(rate) {
    return (rate * 100).toFixed(2) + '%';
}

/** pct1(rate) — Format as XX.X% (1 decimal) */
function pct1(rate) {
    return (rate * 100).toFixed(1) + '%';
}

// ============================================================================
// 8.5. COMPLIANCE AUTO-SCAN
// ============================================================================

/**
 * complianceScan(textOrChildren) — Scan text for non-compliant terminology
 * Call before finalizing any document. Returns { warnings[], errors[] }.
 *
 * @param {string|Paragraph[]} input - plain text string or array of Paragraph/Table elements
 * @param {object} [opts] - { silent: true } to suppress console output
 * @returns {{ warnings: string[], errors: string[] }}
 */
function complianceScan(input, opts) {
    opts = opts || {};

    // Extract plain text from Paragraph/Table arrays
    var text = '';
    if (typeof input === 'string') {
        text = input;
    } else if (Array.isArray(input)) {
        text = input.map(function(el) {
            if (!el) return '';
            if (typeof el === 'string') return el;
            // Paragraph — has .root array of TextRuns
            if (el.root && Array.isArray(el.root)) {
                return el.root.map(function(r) { return (r && r.text) ? r.text : ''; }).join('');
            }
            // Table — recursive
            if (el.root && Array.isArray(el.root)) {
                return el.root.map(function(row) {
                    if (row && row.root) {
                        return row.root.map(function(cell) {
                            if (cell && cell.root) {
                                return cell.root.map(function(p) {
                                    if (p && p.root) {
                                        return p.root.map(function(r) { return (r && r.text) ? r.text : ''; }).join('');
                                    }
                                    return '';
                                }).join(' ');
                            }
                            return '';
                        }).join(' ');
                    }
                    return '';
                }).join(' ');
            }
            return '';
        }).join(' ');
    }

    // Forbidden words (hard errors)
    var FORBIDDEN = [
        '币', 'Token', '通证', '投资回报',
        '稳赚', '躺赚', '数字资产交易',
        '资本集群', '资本化运作',
    ];

    // Suggest-replace map (warnings)
    var MAP = {
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

    var errors = [];
    var warnings = [];

    FORBIDDEN.forEach(function(word) {
        if (text.indexOf(word) !== -1) {
            errors.push('⛔ 禁用词: "' + word + '" — 必须删除');
        }
    });

    Object.keys(MAP).forEach(function(bad) {
        if (text.indexOf(bad) !== -1) {
            warnings.push('⚠️ 建议替换: "' + bad + '" → "' + MAP[bad] + '"');
        }
    });

    if (!opts.silent) {
        if (errors.length + warnings.length === 0) {
            console.log('✅ 合规术语检查: 通过');
        } else {
            if (errors.length > 0) {
                console.log('\n⛔ === ' + errors.length + ' 项合规错误 ===');
                errors.forEach(function(e) { console.log('  ' + e); });
            }
            if (warnings.length > 0) {
                console.log('\n⚠️ === ' + warnings.length + ' 项合规提醒 ===');
                warnings.forEach(function(w) { console.log('  ' + w); });
            }
            console.log('');
        }
    }

    return { warnings: warnings, errors: errors };
}

// ============================================================================
// 9. DOCUMENT FACTORY
// ============================================================================

/**
 * createDoc(children, opts) — Create a standard Document with project defaults
 * @param {Paragraph[]} children - array of Paragraph/Table elements
 * @param {object} [opts]
 * @param {string} [opts.title] - document title metadata
 * @param {object} [opts.margins] - { top, bottom, left, right } in twips (default 1440 all)
 * @param {number} [opts.fontSize] - default font size in half-points (default 21)
 * @returns {Document}
 */
function createDoc(children, opts) {
    opts = opts || {};
    var margins = opts.margins || { top: 1440, bottom: 1440, left: 1440, right: 1440 };

    var props = {};
    if (opts.title) {
        props.title = opts.title;
        props.creator = '链邦科技 · 梁君衡';
        props.description = opts.title;
    }

    return new Document({
        properties: props,
        styles: {
            default: {
                document: {
                    run: {
                        font: '微软雅黑',
                        size: opts.fontSize || 21,
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: { margin: margins },
                },
                children: children,
            },
        ],
    });
}

/**
 * buildAndWrite(children, outFile, opts) — Build doc, pack, and write to disk
 * Convenience wrapper for the standard Packer.toBuffer → fs.writeFileSync pattern.
 *
 * @param {Paragraph[]} children - document body content
 * @param {string} outFile - full output path
 * @param {object} [opts] - passed to createDoc()
 */
async function buildAndWrite(children, outFile, opts) {
    var doc = createDoc(children, opts);
    var buffer = await Packer.toBuffer(doc);
    var dir = path.dirname(outFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outFile, buffer);
    return outFile;
}

// ============================================================================
// 10. EXPORTS
// ============================================================================

module.exports = {
    // Re-export docx classes that scripts commonly need
    docx,
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeadingLevel, ShadingType, PageBreak,

    // Color constants
    C,
    BRAND,

    // Headings
    h1, h2, h3,

    // Text
    p, b, n,

    // Layout
    divider, pageBreak, spacer,

    // Tables
    dataTable, infoTable,

    // Callouts / alerts
    flowBox, calloutBox, calloutInline,

    // Compliance / status
    redline, greenCheck, complianceScan,

    // Formatting
    fmt, pct, pct1,

    // Document factory
    createDoc, buildAndWrite,
};
