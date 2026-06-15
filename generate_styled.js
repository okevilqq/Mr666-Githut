const ExcelJS = require('exceljs');
const path = require('path');
const { COLORS, META } = require('./lib/constants');

// ============================================================
// 基础配置
// ============================================================
const PLAN_START = new Date(2026, 5, 1);
const PLAN_END = new Date(2026, 7, 28);
const PRE_START = new Date(2026, 4, 19);
const PRE_END = new Date(2026, 4, 29);

// ============================================================
// 色标体系
// ============================================================
const TC = { // Type Colors
    '调研分析': { bg: '3498DB', font: 'FFFFFF', label: '调研分析', icon: '🔍' },
    '策略规划': { bg: '2C3E50', font: 'FFFFFF', label: '策略规划', icon: '🎯' },
    '品牌创意': { bg: '8E44AD', font: 'FFFFFF', label: '品牌创意', icon: '💡' },
    '视觉设计': { bg: 'E67E22', font: 'FFFFFF', label: '视觉设计', icon: '🎨' },
    '内容产出': { bg: '27AE60', font: 'FFFFFF', label: '内容产出', icon: '📝' },
    '商业模型': { bg: 'E74C3C', font: 'FFFFFF', label: '商业模型', icon: '📊' },
    '会议汇报': { bg: '7F8C8D', font: 'FFFFFF', label: '会议汇报', icon: '📋' },
    '归档整理': { bg: '1ABC9C', font: 'FFFFFF', label: '归档整理', icon: '🗂️' },
    '产品需求': { bg: 'D35400', font: 'FFFFFF', label: '产品需求', icon: '🖥️' },
};
const PC = { // Phase Colors
    '前期': { bg: '95A5A6', font: 'FFFFFF' },
    '第1月·品牌地基期': { bg: '1A5276', font: 'FFFFFF' },
    '第2月·品牌建设期': { bg: '922B21', font: 'FFFFFF' },
    '第3月·品牌交付期': { bg: '1E8449', font: 'FFFFFF' },
};
const HEADER_BG = '1a1a2e';
const HEADER_FONT = 'FFFFFF';
const ALT_ROW_BG = 'F8F9FA';
const BORDER_COLOR = 'DEE2E6';
const DONE_BG = 'D5F5E3';
const DONE_FONT = '1E8449';
const PENDING_BG = 'FDEBD0';
const PENDING_FONT = 'B9770E';

// ============================================================
// 辅助函数
// ============================================================
function fmtDate(d) { return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; }
function isWeekday(d) { return d.getDay() !== 0 && d.getDay() !== 6; }
function dayCN(d) { return ['日','一','二','三','四','五','六'][d.getDay()]; }
function getWeek(d, start) { return Math.floor((d - start) / (1000*60*60*24) / 7) + 1; }
function getAllWorkDays(s, e) { const r=[]; for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){if(isWeekday(d))r.push(new Date(d));} return r; }

// ============================================================
// 样式工厂
// ============================================================
function styleHeader(row, ws, colCount) {
    row.height = 28;
    for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c);
        cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+HEADER_BG} };
        cell.font = { name:FONT.body, size:10, bold:true, color:{argb:'FF'+HEADER_FONT} };
        cell.alignment = { vertical:'middle', horizontal:'center', wrapText:true };
        cell.border = {
            top:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
            bottom:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
            left:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
            right:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
        };
    }
}

function applyCellStyle(cell, opts={}) {
    const { bg, font, bold, align, border } = opts;
    if (bg) cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+bg} };
    if (font) cell.font = { name:FONT.body, size:9, bold:!!bold, color:{argb:'FF'+font} };
    else cell.font = { name:FONT.body, size:9 };
    cell.alignment = { vertical:'middle', horizontal: align || 'left', wrapText:true };
    cell.border = {
        top:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
        bottom:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
        left:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
        right:{style:'thin',color:{argb:'FF'+BORDER_COLOR}},
    };
}

function applyTypeColor(cell, type, bold) {
    const c = TC[type] || { bg:'CCCCCC', font:'333333' };
    applyCellStyle(cell, { bg:c.bg, font:c.font, bold, align:'center' });
}

function applyPhaseColor(cell, phase) {
    const c = PC[phase];
    if (c) applyCellStyle(cell, { bg:c.bg, font:c.font, bold:true, align:'center' });
    else applyCellStyle(cell, { align:'center' });
}

function applyAltRow(row, isAlt) {
    if (!isAlt) return;
    row.eachCell(cell => {
        if (!cell.fill || !cell.fill.fgColor || cell.fill.fgColor.argb === 'FFFFFFFF' || !cell.fill.fgColor.argb) {
            cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+ALT_ROW_BG} };
        }
    });
}

// ============================================================
// 数据层
// ============================================================
function getPreWorkData() {
    return [
        { date:'2026/05/19', dow:'一', phase:'前期', taskTheme:'链商项目培训学习',
            tasks:[['链商平台介绍与商业模式理解（培训课件1-8）','调研分析',3],['数字化转型与链商合作共赢课程','调研分析',2],['城市服务商机制与数字资产管理课程','调研分析',2],['整理培训笔记与初步理解文档','归档整理',1]],
            dlv:'培训笔记 / 链商项目初步理解文档', kpi:'培训课程8节全覆盖 / 笔记≥3000字', collab:'教培部', ai:'Claude（培训内容整理）' },
        { date:'2026/05/20', dow:'二', phase:'前期', taskTheme:'全球拼购母公司体系调研',
            tasks:[['全球拼购企业介绍与公司架构学习（含宣传片）','调研分析',2],['2025公司介绍PPT深度研读与业务版图梳理','调研分析',2],['跨境电商+链商双赛道协同关系分析','策略规划',2],['撰写《全球拼购体系架构认知总结》','归档整理',2]],
            dlv:'《全球拼购（GGbingo）总结》', kpi:'母公司业务版图覆盖≥6大板块 / 链商与母公司协同关系清晰' },
        { date:'2026/05/21', dow:'三', phase:'前期', taskTheme:'新品牌命名策划+会议+品牌手册优化',
            tasks:[['新品牌命名策划：方向/关键词池/初选方案','品牌创意',2.5],['链商会议参与与纪要整理','会议汇报',1.5],['链商品牌手册初稿研读与优化建议撰写','内容产出',2],['"链商"注册可行性、使用风险与品牌价值分析','调研分析',2]],
            dlv:'《新品牌命名策划》《会议纪要》《品牌手册优化建议》《"链商"注册可行性分析》', kpi:'命名关键词≥80个 / 优化建议≥10条 / 可行性分析5维度', collab:'部门主管、合规部', ai:'Claude' },
        { date:'2026/05/22', dow:'四', phase:'前期', taskTheme:'新品牌平台构思+赛道对比分析',
            tasks:[['新品牌平台模式构思：社区入口+本地生活+商家共赢','策略规划',2.5],['平台核心逻辑推导：先社区后平台/先服务后规模','策略规划',1.5],['本地生活赛道全方位对比分析（美团/阿里/抖音/京东/高德等10+平台）','调研分析',3],['撰写周总结和周计划报告','归档整理',1]],
            dlv:'《新品牌平台构思》《本地生活赛道对比分析》《周总结和计划报告》', kpi:'平台模型≥4要素 / 赛道覆盖≥10平台 / 对比维度≥15项', collab:'部门主管', ai:'Claude' },
        { date:'2026/05/23', dow:'五', phase:'前期', taskTheme:'品牌营销工作目标分解',
            tasks:[['链商品牌营销全链路目标体系设计','策略规划',2],['年度/季度/月度营销目标逐级分解','策略规划',2],['品牌营销预算框架搭建','商业模型',2],['品牌营销工作目标分解表撰写定稿','内容产出',2]],
            dlv:'《链商品牌营销工作目标分解表》《品牌营销预算》', kpi:'目标层级≥4级 / 指标项≥20项 / 预算5大板块' },
        { date:'2026/05/25', dow:'日', phase:'前期', taskTheme:'链商概念设计（旺店链）+案例方案收集',
            tasks:[['旺店链品牌概念设计（方案A+B视觉稿）','视觉设计',3],['实体经济数字化转型核心关键点研究','调研分析',1.5],['新品牌命名核心元素体系梳理','品牌创意',1.5],['本地生活平台Slogan方法+分类范例收集','品牌创意',2]],
            dlv:'《旺店链概念设计》《数字化转型关键点》《命名核心元素》《Slogan方法+范例》', kpi:'概念方案≥2套 / 案例≥8个 / Slogan方法≥5类', collab:'设计师', ai:'Claude+MJ' },
        { date:'2026/05/26', dow:'一', phase:'前期', taskTheme:'品牌手册V2+火星链概念+海报文案',
            tasks:[['链商品牌手册V2迭代修订（V2.1→V2.2）','内容产出',2.5],['火星链品牌概念设计与Logo视觉探索','视觉设计',2],['火星链品牌落地配套方案撰写','策略规划',1.5],['链商宣传海报文案3版撰写+修改意见整理','内容产出',2]],
            dlv:'《品牌手册V2.2》《火星链概念设计+Logo》《海报文案×3》', kpi:'手册迭代2版 / Logo≥3稿 / 海报文案≥3版×3张', collab:'设计师', ai:'Claude+MJ' },
        { date:'2026/05/27', dow:'二', phase:'前期', taskTheme:'组织架构+协作机制+链生活概念定调',
            tasks:[['全球拼购&链邦科技组织架构完整版梳理','调研分析',2],['链商资源与协作机制沟通梳理','会议汇报',2],['链生活品牌概念设计（火星链→链生活关键转折）','品牌创意',2.5],['链生活概念方案初稿与命名定调','品牌创意',1.5]],
            dlv:'《组织架构完整版》《资源与协作机制》《链生活概念设计》', kpi:'组织架构覆盖≥100人 / 协作机制≥6项 / 概念方案完整', collab:'管理层、跨部门', ai:'Claude' },
        { date:'2026/05/28', dow:'三', phase:'前期', taskTheme:'链生活品牌体系文件集中产出',
            tasks:[['链生活品牌定位体系战略手册','策略规划',2],['链生活品牌战略总纲体系','策略规划',2],['链生活品牌视觉与超级符号体系手册','视觉设计',1.5],['商业模式+分润机制+品牌策略+护城河体系','商业模型',2.5]],
            dlv:'7份品牌核心文档（定位/总纲/视觉/商业模式/分润/策略/护城河）', kpi:'7份文档同日交付 / 总字数≥5万字', ai:'Claude' },
        { date:'2026/05/29', dow:'四', phase:'前期', taskTheme:'执行落地文件+顶层设计+技术沟通',
            tasks:[['30天冷启动动作表+样板社区选择标准','内容产出',2],['城市服务商管理办法+单社区财务模型','商业模型',2],['链商项目×技术部沟通清单','产品需求',1.5],['集团顶层设计全集+白皮书+BP+招商手册+工作日志终稿','内容产出',2.5]],
            dlv:'执行文件4份+顶层设计1份+对外文件3份', kpi:'当日交付≥8份文档 / 体系闭环', collab:'技术部、管理层', ai:'Claude' },
    ];
}

// 注：计划期每日数据与 V2 脚本一致，此处通过 buildAllDays() 调用生成
// 为控制脚本长度，数据层直接从 generate_plan_v2.js 的逻辑精简迁移

function generatePlanDays() {
    const days = getAllWorkDays(PLAN_START, PLAN_END);
    const plan = [];
    for (const d of days) {
        const dayNum = (() => { let c=0; for(let cur=new Date(PLAN_START);cur<=d;cur.setDate(cur.getDate()+1)){if(isWeekday(cur))c++;} return c; })();
        const week = getWeek(d, PLAN_START);
        const entry = { dayNum, date:fmtDate(d), week, dow:dayCN(d), phase:'', phaseGroup:'', tasks:[], dlv:'', kpi:'', collab:'', ai:'' };

        // ---- 第1周 ----
        if(week===1){ entry.phaseGroup='第1月·品牌地基期'; entry.phase='赛道调研与竞品分析';
            if(dayNum===1){entry.tasks=[['入职手续与部门对接，确认试用期考核标准','会议汇报',1.5],['梳理项目现有资料，建立品牌知识文件夹','归档整理',1.5],['行业市场基础调研：规模/趋势/政策','调研分析',2.5],['Claude生成行业数据概览框架','调研分析',1.5],['整理调研笔记，标注关键判断点','归档整理',1]];entry.dlv='《3个月工作计划表》\n《行业基础数据汇总》初稿';entry.kpi='计划获批 / 数据覆盖≥5维度';entry.collab='人事部、部门主管';entry.ai='Claude';}
            else if(dayNum===2){entry.tasks=[['【跨部门】与技术部（数字化中心）沟通会议：了解技术支撑模块功能、系统架构、接口能力、开发排期','会议汇报',2],['竞品数据采集：美团/阿里/抖音/京东核心指标','调研分析',1.5],['统一维度建对比框架：定位/模式/市占/UE','调研分析',1.5],['Claude辅助：竞品信息补全+UE模型推演','调研分析',1.5],['整理《技术沟通会议纪要》+《竞品矩阵对比表》第一梯队部分','归档整理',1.5]];entry.dlv='《技术沟通会议纪要》\n《竞品矩阵对比表》第一梯队部分';entry.kpi='了解≥5个技术模块 / 覆盖4大平台 / 维度≥15项';entry.collab='数字化中心（张冬/江周辉）';entry.ai='Claude';}
            else if(dayNum===3){entry.tasks=[['第二梯队：高德/小红书/快手/百度/朴朴','调研分析',1.5],['特色玩家：社区团购/本地团长/垂直服务','调研分析',1.5],['Claude：差异化模式归纳+竞争定位图','策略规划',1.5],['竞品矩阵全景对比汇总','调研分析',1.5],['【公测对接】梳理平台公测涉及的品牌触点：前端页面/商户端/商圈/联盟店铺页/收银台/知识库','产品需求',2]];entry.dlv='《竞品矩阵对比表》完整版\n《公测品牌触点清单》';entry.kpi='覆盖≥10平台 / 差异化判断≥3条 / 触点清单≥15项';entry.collab='数字化中心（公测对接）';entry.ai='Claude';}
            else if(dayNum===4){entry.tasks=[['用户端痛点深挖：好店难找/优惠分散/售后难','调研分析',1.5],['Claude：痛点场景+情绪价值链归纳','调研分析',1.5],['商家端痛点：获客贵/抽佣重/不沉淀/缺复购','调研分析',1.5],['【公测对接】系统现有UI品牌审查：截图记录公测版品牌相关界面，标注需统一的品牌元素（色彩/字体/Logo位/文案调性）','视觉设计',2],['合并输出痛点图谱+品牌审查问题清单','策略规划',1.5]];entry.dlv='《三方痛点与机会图谱》\n《公测版UI品牌审查问题清单》';entry.kpi='痛点≥28条 / 品牌问题≥15条 / 每条有对应建议';entry.collab='数字化中心（UI审查）';entry.ai='Claude';}
            else if(dayNum===5){entry.tasks=[['完成《市场机会与可行性报告》','策略规划',1.5],['判断：是否值得做/切入点/风险可控性','策略规划',1],['【公测对接】输出《公测品牌准备清单》：模板设计/知识库内容/入驻指南/品牌触点 四大模块待办分工','产品需求',1.5],['第1周成果汇总+知识库归档','归档整理',1.5],['撰写《周总结和周计划报告》（含公测品牌冲刺预告）','归档整理',1],['部门周会：汇报调研成果+公测品牌准备计划','会议汇报',1.5]];entry.dlv='《市场机会与可行性报告》\n《公测品牌准备清单》\n《周总结和计划报告》';entry.kpi='本周7份文档 / 公测清单4大模块明确 / 主管评分≥80';entry.collab='部门主管、数字化中心';entry.ai='Claude';}
        }
        // ---- 第2周（公测冲刺周：6/8-6/12，预计6/12公测上线） ----
        else if(week===2){ entry.phaseGroup='第1月·品牌地基期'; entry.phase='【公测冲刺】品牌定位+平台上线准备';
            if(dayNum===6){entry.tasks=[['品牌品类/人群/场景定义（含千店千面差异化定位初案）','策略规划',2],['【公测冲刺】店铺模板设计Brief：3套餐饮+3套电商，每套全功能展示、品牌色系统一','视觉设计',2.5],['Claude三轮推演：3个差异化定位方案','策略规划',1.5],['与设计师对齐模板方向+品牌视觉规范','会议汇报',1],['《品牌定位3方案对比》框架+《店铺模板设计Brief》','内容产出',1]];entry.dlv='《品牌定位3方案对比》初稿\n《店铺模板设计Brief》（3餐饮+3电商）';entry.kpi='≥3方案/模板Brief 6套明确/品牌色系统一';entry.collab='设计师、数字化中心';entry.ai='Claude';}
            else if(dayNum===7){entry.tasks=[['【公测冲刺】3套餐饮模板视觉初稿：蓝色系/红色系/淡雅系，全功能模块布局','视觉设计',3],['品牌战略公式+增长飞轮模型（精简版，锚定千店千面核心逻辑）','策略规划',2],['【公测冲刺】知识库品牌内容框架：商家操作指南/品牌规范/FAQ','内容产出',2],['与设计师审核餐饮模板初稿','会议汇报',1]];entry.dlv='3套餐饮模板初稿\n《品牌战略模型图》精简版\n《知识库品牌内容框架》';entry.kpi='餐饮模板3套初稿/战略模型飞轮≥5步/知识库≥3模块';entry.collab='设计师、数字化中心';entry.ai='Claude+MJ';}
            else if(dayNum===8){entry.tasks=[['【公测冲刺】3套电商模板视觉初稿：物流版/自提版/综合版','视觉设计',3],['【公测冲刺】商家入驻品牌指南：平台商家&联盟商家分别需准备的品牌物料清单（Logo/VI色/轮播图/小程序资料）','内容产出',2],['品牌使命愿景价值观（精简版，可在公测后深化）','品牌创意',2],['与设计师审核电商模板初稿','会议汇报',1]];entry.dlv='3套电商模板初稿\n《商家入驻品牌物料指南》\n《品牌使命愿景价值观V1.0》精简版';entry.kpi='电商模板3套初稿/入驻指南2类商家覆盖/使命愿景≥3+3';entry.collab='设计师、数字化中心、商务';entry.ai='Claude+MJ';}
            else if(dayNum===9){entry.tasks=[['【跨部门】公测前品牌准备评审会：6套模板终审+知识库内容+入驻指南+品牌触点全覆盖检查','会议汇报',2.5],['模板终稿修订：根据评审意见调整','视觉设计',2],['知识库品牌内容定稿（图文+短视频脚本）','内容产出',2],['与数字化中心确认品牌元素已正确部署至公测版本','产品需求',1.5]];entry.dlv='6套店铺模板终稿\n《知识库品牌内容》定稿\n《公测品牌准备评审纪要》';entry.kpi='模板6套评审通过/知识库内容就绪/品牌触点覆盖率100%';entry.collab='管理层、数字化中心、设计师';entry.ai='Claude+MJ';}
            else if(dayNum===10){entry.tasks=[['【公测上线日】平台公测品牌支持：检查所有品牌触点线上效果','产品需求',2],['紧急品牌问题修复（如有）','视觉设计',1.5],['品牌定位方案汇报（管理层，结合公测实际展示）','会议汇报',2],['第2周成果汇总+公测品牌问题日志','归档整理',1],['周报+部门周会：公测品牌首日反馈','会议汇报',1.5]];entry.dlv='6套模板终稿\n《品牌定位3方案对比》终稿\n公测品牌问题日志\n周报';entry.kpi='公测品牌触点零重大缺陷/定位方案管理层评审/模板全部可商用';entry.collab='管理层、部门主管、数字化中心';entry.ai='Claude+MJ';}
        }
        // ---- 第3周（6/15-6/19：品牌命名收尾+营销工具定稿+品牌体系深化） ----
        else if(week===3){ entry.phaseGroup='第1月·品牌地基期'; entry.phase='品牌命名定稿+工具包交付+体系深化';
            // Day 11 (6/15 Mon) — 已完成 ✅
            if(dayNum===11)setDay(entry,[[['✅ 品牌命名终稿确定：链邦赋商通（历经V2→V3→V4→赋商版5轮迭代）','品牌创意',2],['✅ 商标注册启动：第35/42/9类，委托北京捷佳联合，¥2,000','归档整理',2],['✅ 市场拓展营销工具包 V1.0 交付（5部分21章，docx格式）','内容产出',2.5],['✅ 招商会销讲PPT生成脚本完成（29页，pptx格式，含演讲备注+Q&A）','内容产出',1.5]],'链邦赋商通命名终稿\n商标注册代理协议（IP-2026-001）\n市场拓展营销工具包 V1.0\n招商会销讲PPT V1.0','品牌名确定/商标3类提交/工具包21章/PPT 29页','合规部、北京捷佳联合','Claude']);
            // Day 12 (6/16 Tue) — 明日
            if(dayNum===12)setDay(entry,[[['Slogan体系完善：基于链邦赋商通品牌名生成3端口号（消费者/商家/推广者）','品牌创意',2],['Claude批量：每端20条→精选3条，含释义与应用场景','品牌创意',2],['招商会销讲PPT审阅：29页逐页检查+演讲备注完善+过渡语优化','内容产出',2],['品牌话语体系整合：命名+Slogan+定位语+电梯演讲统一口径','内容产出',1.5],['商标注册进度跟进：确认钉钉审批+乙方（捷佳联合）进度','归档整理',0.5]],'《品牌话语体系与Slogan》（链邦赋商通版）\n《招商会PPT V1.1》修订版','Slogan≥60条候选/精选≥9条/PPT审阅完成/商标审批推进','管理层（钉钉审批）','Claude']);
            // Day 13 (6/17 Wed)
            if(dayNum===13)setDay(entry,[[['品牌执行手册审阅：小程序品牌规范7章+3附录逐章检查与修订','内容产出',2.5],['千面千店页面文案规范深化（平台/联盟/商城3级差异化文案标准）','内容产出',2],['合规术语全平台审查：扫描已生成全部文档（≥15份）的用词一致性','调研分析',2],['公测品牌触点回顾：对比6/12公测以来的品牌问题日志，产出改进清单','调研分析',1.5]],'《品牌执行手册 V1.1》修订版\n《千面千店文案规范》\n《全平台合规术语审查报告》','手册审阅7章/文案规范3级/合规扫描零违规/触点问题≤5项','数字化中心（公测反馈）','Claude']);
            // Day 14 (6/18 Thu)
            if(dayNum===14)setDay(entry,[[['品牌视觉一致性审查：跨全部文档的色彩/字体/Logo使用规范性检查','视觉设计',2.5],['分润模型V3.2对外版定稿：投资人版+商家版双版本口径统一','内容产出',2],['画册Brief V3.0与市场工具包交叉对照：内容去重+缺失补充清单','归档整理',1.5],['合同档案归档确认：IP-2026-001整理+未来合同模板框架准备','归档整理',2]],'《品牌视觉一致性审查报告》\n《分润模型V3.2对外版》双版本\n合同档案归档确认','视觉审查≥10文档/分润对外版2版本/合同归档完整','财务部（分润口径确认）','Claude']);
            // Day 15 (6/19 Fri)
            if(dayNum===15)setDay(entry,[[['第3周成果汇总：全部新增/修订文档清点+版本确认','归档整理',2],['第1月进度追踪：对比原计划，标记提前/滞后/新增项，输出偏差分析','策略规划',1.5],['第4周（月度汇报周）准备工作预排：汇报材料+PPT框架+跨部门对齐','策略规划',1.5],['周报撰写+知识库更新（Notion同步）','归档整理',2],['部门周会：汇报品牌命名成果+工具包交付+月度汇报预告','会议汇报',1]],'周报\n第1月进度追踪表\n第4周预排计划','新增≥8份文档/进度偏差≤10%/第4周计划明确','部门主管、跨部门协作方','Claude+Notion AI']);
        }
        else if(week===4){ entry.phaseGroup='第1月·品牌地基期'; entry.phase='战略总纲与月度汇报';
            if(dayNum===16)setDay(entry,[[['整合1-3周成果','策略规划',2],['战略总纲框架搭建','策略规划',2],['Claude：框架展开+逻辑串联','策略规划',2],['核心逻辑章节撰写','内容产出',2]],'《品牌战略总纲体系》50%','战略定义清晰/4条逻辑完整','','Claude']);
            if(dayNum===17)setDay(entry,[[['战略定位+升级路径+竞争定位','策略规划',2],['5大护城河详述','策略规划',2],['5大战略体系撰写','内容产出',2.5],['全稿审查定稿','归档整理',1.5]],'《品牌战略总纲体系V1.0》','≥10模块/≥8000字/自检通过','','Claude']);
            if(dayNum===18)setDay(entry,[[['vs传统电商差异论证','策略规划',2],['vs传统本地平台差异论证','策略规划',2],['vs社区团购差异论证','策略规划',2],['差异化话术提炼','品牌创意',2]],'《品牌差异化战略说明》','对比≥12条/辩驳通过/话术可用','','Claude']);
            if(dayNum===19)setDay(entry,[[['【跨部门】月度汇报前跨部门对齐会：同步各部门进度、需求、协同事项','会议汇报',1.5],['第1月全成果梳理','归档整理',1.5],['Claude：1页纸摘要','归档整理',1],['月度PPT制作','会议汇报',2.5],['预演+修改+归档','会议汇报',1.5]],'《第1月品牌地基成果包》/月度PPT\n《跨部门协同纪要》','文档≥15份/PPT≤15页/对齐≥3部门','管理层、数字化中心、运营部','Claude+Notion AI']);
            if(dayNum===20)setDay(entry,[[['管理层月度汇报','会议汇报',2.5],['收集反馈+记录决策','会议汇报',1],['《月度总结与下月计划》','归档整理',2],['调整第2月计划','策略规划',1.5],['周报','归档整理',1]],'《月度总结与下月计划》','汇报通过/反馈≤5条/第2月确认','管理层','Claude']);
        }
        // ---- 第5-13周 ----
        else if(week===5){ entry.phaseGroup='第2月·品牌建设期'; entry.phase='品牌视觉体系（公测模板基础上深化）';
            if(dayNum===21)setDay(entry,[[['品牌气质关键词+视觉策略框架（结合公测6套模板反馈优化）','策略规划',2],['给设计师完整Brief撰写（含Logo/超级符号/色彩/字体/物料）','视觉设计',2],['MJ Prompt库：Logo×5组（链生活品牌方向）','视觉设计',2],['公测模板迭代：根据2周使用数据优化6套模板','视觉设计',1],['与设计师对齐完整视觉方向','会议汇报',1]],'《品牌视觉策略Brief》/MJ Prompt库\n公测模板迭代V1.1','气质词≥6/Brief完整/Prompt 5组/模板优化≥6处','设计师','Claude+MJ']);
            if(dayNum===22)setDay(entry,[[['MJ批量出图：50+概念','视觉设计',3],['初筛+分类→保留30张','视觉设计',2],['精选Top3×5方向=15张','视觉设计',2],['撰写《Logo概念方向稿》','视觉设计',1]],'《Logo概念方向稿》','MJ≥50/精选≥15/5方向','设计师','MJ']);
            if(dayNum===23)setDay(entry,[[['超级符号设计：链环+定位点+微笑曲线','视觉设计',2.5],['色彩体系：蓝+橙+辅助系','视觉设计',2],['字体体系+层级','视觉设计',1.5],['《视觉手册》文字部分','内容产出',2]],'《视觉与超级符号体系手册》文字稿','符号≥3层/色值≥6/字体≥3','','Claude']);
            if(dayNum===24)setDay(entry,[[['与设计师确定Logo方向','会议汇报',1.5],['Logo标准制图','视觉设计',2],['多版本：标准/横/竖/反白/图标/简化','视觉设计',2.5],['Logo禁止规范+源文件','视觉设计',2]],'《Logo标准规范文件》（含源文件）','Logo≥6版/规范≥10条','设计师','MJ']);
            if(dayNum===25)setDay(entry,[[['插画+摄影风格指南','视觉设计',2],['辅助图形系统','视觉设计',2],['视觉手册全稿定稿','内容产出',2],['第5周汇总+周报+周会','会议汇报',2]],'《视觉与超级符号体系手册》完整版','手册100%/Logo获批','设计师','Claude+MJ']);
        }
        else if(week===6){ entry.phaseGroup='第2月·品牌建设期'; entry.phase='品牌内容体系（含公测知识库迭代）';
            if(dayNum===26)setDay(entry,[[['品牌缘起+理念故事（融入千店千面、无资金池等差异化叙事）','品牌创意',2],['Claude 5版故事→精选1版','品牌创意',1.5],['场景适配：官网/招商/融资/社区','品牌创意',1.5],['【知识库迭代】公测知识库品牌内容V2.0：补充品牌故事/价值观/语调指南','内容产出',2],['撰写《品牌故事体系》','内容产出',1]],'《品牌故事体系》\n知识库品牌内容V2.0','故事≥4版/场景适配/知识库模块≥5','','Claude']);
            if(dayNum===27)setDay(entry,[[['品牌人格+语调关键词','品牌创意',2],['分场景语调：客服/社群/招商/广告/公关','内容产出',2],['禁忌词库+正反示例','内容产出',2],['撰写《品牌语调与文案规范》','内容产出',2]],'《品牌语调与文案规范》','语调≥8/禁忌≥30/场景≥5','','Claude']);
            if(dayNum===28)setDay(entry,[[['官网首页文案+CTA+信任证据','内容产出',2.5],['"关于我们""商家合作"页面','内容产出',2.5],['用户权益+社区服务页','内容产出',2],['统稿','内容产出',1]],'《品牌核心页面文案》50%','首页≥5模块','','Claude']);
            if(dayNum===29)setDay(entry,[[['全页面一致性检查','归档整理',2],['内容策略：类型/渠道/节奏/选题','策略规划',2.5],['内容日历：月→周→日','内容产出',2],['撰写《品牌内容策略与日历》','内容产出',1.5]],'《品牌核心页面文案》终稿\n《品牌内容策略与日历》','页面≥8/日历≥30天','','Claude']);
            if(dayNum===30)setDay(entry,[[['内容日历与文案组对齐','会议汇报',1.5],['文案规范同步全员','会议汇报',1],['内容资产归档知识库','归档整理',1.5],['第6周汇总+周报+周会','会议汇报',4]],'品牌内容资产包 / 周报','4文档交付/周报准时','文案组','Claude+Notion AI']);
        }
        else if(week===7){ entry.phaseGroup='第2月·品牌建设期'; entry.phase='商业模式与招商体系';
            if(dayNum===31)setDay(entry,[[['收入结构设计：5大板块','商业模型',2.5],['分润机制：试跑→增长→长期阶梯','商业模型',2.5],['会员体系：等级/权益/盈利','商业模型',2],['撰写《商业模式说明》','内容产出',1]],'《商业模式说明》初稿','收入≥5/分润3阶段/会员≥4级','财务部','Claude']);
            if(dayNum===32)setDay(entry,[[['招商定位+目标对象','策略规划',2],['重点行业筛选：8大行业','策略规划',2],['招商路径+竞争力梳理','策略规划',2],['撰写《招商战略体系》','内容产出',2]],'《招商战略体系》','行业≥8/路径≥6步','','Claude']);
            if(dayNum===33)setDay(entry,[[['通用版招商手册','内容产出',3],['餐饮行业定制版','内容产出',2],['家政+美业定制版','内容产出',2],['三版交叉比对','归档整理',1]],'《招商手册》×4版','手册≥4/FAQ≥15/口径一致','','Claude']);
            if(dayNum===34)setDay(entry,[[['商家全生命周期：8阶段','策略规划',2.5],['动作清单+话术+验收标准','内容产出',2.5],['商家准入评分+ABCD评级','商业模型',2],['撰写《商家合作SOP》','内容产出',1]],'《商家合作SOP》','流程≥8/评分≥5/评级ABCD','','Claude']);
            if(dayNum===35)setDay(entry,[[['三文档逻辑闭环检查','归档整理',2],['合规部审核招商话术','会议汇报',1.5],['终稿修订','内容产出',1.5],['第7周汇总+周报+周会','会议汇报',3]],'商业体系3文档定稿 / 周报','逻辑闭环/合规通过','合规部','Claude']);
        }
        else if(week===8){ entry.phaseGroup='第2月·品牌建设期'; entry.phase='品牌全案整合与月报';
            if(dayNum===36)setDay(entry,[[['梳理1-2月全部产出','归档整理',2.5],['全案目录树：模块→文档→版本→状态','归档整理',2],['版本+命名统一','归档整理',2],['跨文档引用标注','归档整理',1.5]],'《品牌全案体系目录》','覆盖全部/版本统一/引用清晰','','Claude']);
            if(dayNum===37)setDay(entry,[[['逻辑闭环：战略→定位→视觉→内容→招商','归档整理',2.5],['逐链审查：前提→结论→证据','归档整理',2.5],['缺口清单+逐项补足','内容产出',2],['撰写《品牌体系完整性自查表》','归档整理',1]],'《品牌体系完整性自查表》','审查≥20/缺口≤5/评分≥85','','Claude']);
            if(dayNum===38)setDay(entry,[[['第2月全成果+1页纸摘要','归档整理',2],['月度PPT（含视觉展示）','会议汇报',3],['预演+修改','会议汇报',2],['全部归档知识库','归档整理',1]],'《第2月品牌全案成果包》/月度PPT','新增≥15份/PPT≤20页','管理层','Claude+Notion AI']);
            if(dayNum===39)setDay(entry,[[['管理层月度汇报','会议汇报',2.5],['展示全案完整度+逻辑闭环','会议汇报',1.5],['收集反馈+确认第3月方向','会议汇报',1],['《月度总结与下月计划》','归档整理',2],['阶段性归档','归档整理',1]],'《月度总结与下月计划》/反馈记录','汇报通过/体系完整度≥90%','管理层','Claude']);
            if(dayNum===40)setDay(entry,[[['根据反馈微调','内容产出',1.5],['第3月详细计划确认','策略规划',1.5],['【跨部门】与设计/视频/数字化中心第3月协作排期确认','会议汇报',2],['跨部门资源需求清单+协作SOP初稿','归档整理',1],['第8周汇总+周报+周会','会议汇报',2]],'周报 / 第3月排期表 / 跨部门资源需求清单','调整完毕/排期确认/≥3部门对齐','设计师/视频组/数字化中心','Claude']);
        }
        else if(week===9){ entry.phaseGroup='第3月·品牌交付期'; entry.phase='落地执行文件';
            if(dayNum===41)setDay(entry,[[['样板社区定义+选择原则','策略规划',2],['硬性准入6条','策略规划',2],['100分制评分模型7维度','策略规划',2],['撰写《样板社区选择标准》','内容产出',2]],'《样板社区选择标准》','准入≥6/评分≥7维度/100分制','','Claude']);
            if(dayNum===42)setDay(entry,[[['冷启动4阶段设计','策略规划',2],['D1-D14逐日动作','内容产出',3],['判断标准+数据指标','商业模型',2],['50%进度','内容产出',1]],'《30天冷启动动作表》50%','每天≥4条/验收标准量化','','Claude']);
            if(dayNum===43)setDay(entry,[[['D15-D30逐日动作','内容产出',2.5],['商家招募话术+合作方案','内容产出',2],['首场社区活动方案','内容产出',1.5],['全表审查+完整版','归档整理',2]],'《30天冷启动动作表》完整版','30天每天≥4条/指标≥5','','Claude']);
            if(dayNum===44)setDay(entry,[[['核心参数假设表','商业模型',2],['收入结构：5板块','商业模型',2],['成本+3情景测算','商业模型',2.5],['撰写《单社区财务模型》','内容产出',1.5]],'《单社区财务模型》','参数≥15/收入≥5/3情景','财务部','Claude']);
            if(dayNum===45)setDay(entry,[[['服务商准入6维度','策略规划',1.5],['授权等级5级体系','策略规划',1.5],['培训认证+绩效考核+KPI','商业模型',1.5],['【跨部门】执行前跨部门对齐会：确认业务/技术/运营三方配合机制','会议汇报',1.5],['《城市服务商管理办法》+周报+执行对齐纪要','内容产出',2]],'《城市服务商管理办法》/周报/跨部门执行对齐纪要','授权≥5级/KPI≥15/三方对齐确认','业务部/数字化中心/运营部','Claude']);
        }
        else if(week===10){ entry.phaseGroup='第3月·品牌交付期'; entry.phase='融资路演材料';
            if(dayNum===46)setDay(entry,[[['白皮书框架+Part01-06','内容产出',4],['排版风格确定','内容产出',1],['50%进度','内容产出',3]],'《商业生态白皮书》50%','完成6Part/每Part≥2000字','','Claude']);
            if(dayNum===47)setDay(entry,[[['Part07-15撰写','内容产出',3.5],['全稿逻辑审查+图表','归档整理',2],['终审：一致性+数据验证','归档整理',1.5],['《商业生态白皮书V1.0》定稿','内容产出',1]],'《商业生态白皮书V1.0》','≥15Part/≥20000字/图表≥8','','Claude']);
            if(dayNum===48)setDay(entry,[[['BP逻辑线设计','策略规划',2],['每页核心信息+数据','内容产出',2.5],['Gamma AI生成PPT初稿','内容产出',2],['与设计师对接美化','会议汇报',1.5]],'《融资路演BP》内容版+视觉版初稿','BP≤15页/每页≤3信息/数据有源','设计师','Claude+Gamma']);
            if(dayNum===49)setDay(entry,[[['BP修改+设计师美化','内容产出',2],['BP宣讲演练','会议汇报',2],['招商手册Canva AI设计稿','视觉设计',2],['BP+招商手册终稿','归档整理',2]],'《BP》终稿 /《招商手册》设计版','两份可对外使用','设计师','Gamma+Canva AI']);
            if(dayNum===50)setDay(entry,[[['路演材料包汇总统一','归档整理',2],['对外视觉一致性检查','归档整理',1.5],['路演话术3版本','内容产出',2.5],['第10周汇总+周报+周会','会议汇报',2]],'路演材料包 / 话术3版 / 周报','材料≥4/话术≥3/视觉统一','','Claude']);
        }
        else if(week===11){ entry.phaseGroup='第3月·品牌交付期'; entry.phase='品牌物料与PRD';
            if(dayNum===51)setDay(entry,[[['物料清单：7种','视觉设计',2],['MJ出每种概念','视觉设计',2.5],['物料文案','内容产出',2],['设计师制作','视觉设计',1.5]],'《社区线下物料包》50%','物料≥7/每种≥2版','设计师','MJ+Claude+Canva']);
            if(dayNum===52)setDay(entry,[[['物料审核+定稿','视觉设计',2.5],['社媒素材+Canva批量模板','视觉设计',2.5],['剪映AI：片头片尾模板','内容产出',2],['《社媒视觉素材库》打包','归档整理',1]],'《社区线下物料包》终稿\n《社媒视觉素材库》','社媒≥15/视频≥5','设计师/视频组','Canva+剪映AI']);
            if(dayNum===53)setDay(entry,[[['小程序功能架构','产品需求',2.5],['页面流程：3端','产品需求',2.5],['数据+非功能需求','产品需求',2],['撰写《PRD》','内容产出',1]],'《产品需求文档PRD》','功能≥8/页面≥20/数据≥15/可开发','数字化中心','Claude']);
            if(dayNum===54)setDay(entry,[[['Logo使用规范','内容产出',2],['色彩+字体规范','内容产出',2],['物料模板规范','内容产出',2],['合规审核+定稿','会议汇报',2]],'《品牌使用规范手册》','规范≥50/禁止≥20/模板≥10','合规部','Claude']);
            if(dayNum===55)setDay(entry,[[['链宝IP概念+MJ出图','视觉设计',2.5],['IP应用延展','视觉设计',2],['设计师精修','视觉设计',1.5],['第11周汇总+周报+周会','会议汇报',2]],'链宝IP初稿 / 周报','IP≥3方向/MJ≥20张','设计师','MJ+Claude']);
        }
        else if(week===12){ entry.phaseGroup='第3月·品牌交付期'; entry.phase='总结归档与交接';
            if(dayNum===56)setDay(entry,[[['全案产出汇总清点','归档整理',2.5],['版本终审统一','归档整理',2],['缺失项最后补足','内容产出',2],['《品牌全案最终目录》','归档整理',1.5]],'《品牌全案最终目录》','文档≥40份/零缺失','','Claude']);
            if(dayNum===57)setDay(entry,[[['Notion知识库架构设计','归档整理',2.5],['全部文档导入+分类+标签','归档整理',3],['权限设置+使用指南','归档整理',1.5],['知识库上线','归档整理',1]],'Notion品牌资产知识库','模块≥8/100%覆盖/引用≥30','','Notion AI']);
            if(dayNum===58)setDay(entry,[[['三个月成果回顾+数据','归档整理',2.5],['AI方法论总结','归档整理',2.5],['问题反思+经验','归档整理',1.5],['《试用期述职报告》','内容产出',1.5]],'《试用期述职报告》','数据完整/方法论/反思≥3','','Claude']);
            if(dayNum===59)setDay(entry,[[['终期汇报PPT+预演','会议汇报',3],['品牌工作交接文档','归档整理',2.5],['部门协作机制建立','会议汇报',1.5],['《交接与协作手册》','归档整理',1]],'终期汇报PPT /《交接与协作手册》','PPT≤20页/交接覆盖全部','部门全员','Claude']);
            if(dayNum===60)setDay(entry,[[['终期述职汇报','会议汇报',2.5],['全案成果展示','会议汇报',1.5],['人事转正面谈','会议汇报',1.5],['三备份最终归档','归档整理',2],['工作总结','归档整理',0.5]],'汇报通过/转正评估表/全归档','通过/转正/归档100%/≥85分','管理层/人事部/主管','']);
        }
        else if(week===13){ entry.phaseGroup='第3月·品牌交付期'; entry.phase='缓冲补足与转正收尾';
            if(dayNum===61)setDay(entry,[[['清点全部交付物状态','归档整理',2],['优先补齐遗漏项','内容产出',3],['文档终版修订锁定','归档整理',2],['知识库最后更新','归档整理',1]],'补足文档/知识库终版','交付物100%/知识库终版','','Claude+Notion AI']);
            if(dayNum===62)setDay(entry,[[['述职报告主管预审修订','归档整理',2],['【跨部门】品牌资产交接确认会：各协作部门逐一确认签收','会议汇报',1.5],['三个月产出最终盘点','归档整理',1.5],['《品牌建设AI方法论总结》','归档整理',1.5],['转正申请材料整理','归档整理',1.5]],'《述职报告》终稿 /《AI方法论总结》/交接确认签收','主管预审通过/方法论可复制/交接确认≥3部门','部门主管、数字化中心、设计师','Claude']);
            if(dayNum===63)setDay(entry,[[['终期PPT最终修改','会议汇报',2],['汇报预演：≥2轮','会议汇报',3],['时间控制≤20分钟','会议汇报',1],['逐模块交接确认签字','归档整理',2]],'终期PPT终稿 /《交接确认签字表》','预演≥2/≤20分钟/100%交接','部门全员','']);
            if(dayNum===64)setDay(entry,[[['终期述职汇报（正式）','会议汇报',2.5],['全案展示+答疑','会议汇报',2],['人事转正面谈','会议汇报',1.5],['提交转正申请+记录评价','归档整理',2]],'汇报完成/转正评估表/评价记录','通过/≥85/转正提交','管理层/人事部/主管','']);
            if(dayNum===65)setDay(entry,[[['三备份归档确认','归档整理',2.5],['知识库进维护模式','归档整理',1.5],['主管试用期回顾面谈','会议汇报',1.5],['确认转正后方向与目标','会议汇报',1.5],['试用期结束','归档整理',1]],'三备份归档/工作总结/转正后计划','归档100%/三备份/方向明确','部门主管','']);
        }
        plan.push(entry);
    }
    return plan;
}
function setDay(entry, data) { entry.tasks=data[0]; entry.dlv=data[1]; entry.kpi=data[2]; entry.collab=data[3]||''; entry.ai=data[4]||''; }

// ============================================================
// 构建所有天数
// ============================================================
function buildAllDays() {
    const pre = getPreWorkData();
    const plan = generatePlanDays();
    const all = [];
    for (let i = 0; i < pre.length; i++) {
        all.push({ ...pre[i], dayNum: -(pre.length - i), week:0 });
    }
    for (const p of plan) all.push(p);
    return all;
}

// ============================================================
// Sheet 1: 每日工作计划（色标美化版）
// ============================================================
function buildDailySheet(wb, allDays) {
    const ws = wb.addWorksheet('1-每日工作计划', {
        views:[{state:'frozen',ySplit:1}],
        properties:{tabColor:{argb:'FF1A5276'}}
    });

    const headers = ['序号','日期','周','星期','阶段','当日主题','任务内容','工作类型','工时','色条','交付物','KPI指标','协作方','AI工具'];
    const hRow = ws.addRow(headers);
    styleHeader(hRow, ws, headers.length);

    let rowIdx = 2;
    const altSet = new Set();
    let prevDayNum = null;
    let altFlag = false;

    for (const day of allDays) {
        if (day.dayNum !== prevDayNum) { altFlag = !altFlag; prevDayNum = day.dayNum; }
        const tasks = day.tasks || [];
        const numRows = Math.max(tasks.length, 1);

        for (let i = 0; i < numRows; i++) {
            const t = tasks[i] || { content:'', type:'', hours:0 };
            const row = ws.addRow([]);
            const isFirst = (i === 0);

            if (isFirst) {
                row.getCell(1).value = day.dayNum;
                applyCellStyle(row.getCell(1), { align:'center' });
                row.getCell(2).value = day.date;
                applyCellStyle(row.getCell(2), { align:'center' });
                row.getCell(3).value = day.week === 0 ? '前期' : `第${day.week}周`;
                applyCellStyle(row.getCell(3), { align:'center' });
                row.getCell(4).value = day.dow || day.dayOfWeek || '';
                applyCellStyle(row.getCell(4), { align:'center', bold:true });
                row.getCell(5).value = day.phase || '';
                applyPhaseColor(row.getCell(5), day.phase);
                row.getCell(6).value = day.taskTheme || '';
                applyCellStyle(row.getCell(6), { bold:true });
            }
            row.getCell(7).value = t.content || '';
            applyCellStyle(row.getCell(7), {});
            row.getCell(8).value = t.type || '';
            if (t.type) applyTypeColor(row.getCell(8), t.type);
            row.getCell(9).value = t.hours || '';
            applyCellStyle(row.getCell(9), { align:'center' });

            // 色条单元格
            if (t.hours > 0) {
                const barLen = Math.max(1, Math.round(t.hours / 8 * 35));
                row.getCell(10).value = '█'.repeat(barLen) + ' ' + t.hours + 'h';
                if (t.type && TC[t.type]) {
                    applyCellStyle(row.getCell(10), { bg:TC[t.type].bg, font:TC[t.type].font, align:'left', bold:true });
                } else {
                    applyCellStyle(row.getCell(10), { align:'left' });
                }
            }

            if (isFirst) {
                row.getCell(11).value = day.dlv || '';
                applyCellStyle(row.getCell(11), {});
                row.getCell(12).value = day.kpi || '';
                applyCellStyle(row.getCell(12), {});
                row.getCell(13).value = day.collab || day.collaborators || '';
                applyCellStyle(row.getCell(13), { align:'center' });
                row.getCell(14).value = day.ai || day.aiTools || '';
                applyCellStyle(row.getCell(14), { align:'center' });
            }

            // 交替行底色
            if (altFlag) {
                for (let c = 1; c <= 14; c++) {
                    const cell = row.getCell(c);
                    const hasFill = cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb && cell.fill.fgColor.argb !== 'FFFFFFFF';
                    if (!hasFill) {
                        cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+ALT_ROW_BG} };
                    }
                }
            }
            // 前期已完成行用绿色淡底
            if (day.week === 0 && isFirst) {
                for (let c = 1; c <= 14; c++) {
                    const cell = row.getCell(c);
                    const hasCustomFill = cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb &&
                        cell.fill.fgColor.argb !== 'FFFFFFFF' && cell.fill.fgColor.argb !== 'FF'+ALT_ROW_BG;
                    if (!hasCustomFill) {
                        cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFF0FFF0'} };
                    }
                }
            }

            rowIdx++;
        }
    }

    // 列宽
    ws.columns = [
        {width:5},{width:10},{width:7},{width:5},{width:22},{width:26},
        {width:48},{width:10},{width:7},{width:40},
        {width:38},{width:42},{width:18},{width:16}
    ];
    ws.autoFilter = { from:'A1', to:'N1' };
}

// ============================================================
// Sheet 2: 甘特图（色条版）
// ============================================================
function buildGanttSheet(wb, allDays) {
    const ws = wb.addWorksheet('2-甘特图(色条)', {
        properties:{tabColor:{argb:'FFE67E22'}}
    });

    const streams = [
        { name:'🔍 调研分析', key:'调研分析', color:'3498DB' },
        { name:'🎯 策略规划', key:'策略规划', color:'2C3E50' },
        { name:'💡 品牌创意', key:'品牌创意', color:'8E44AD' },
        { name:'🎨 视觉设计', key:'视觉设计', color:'E67E22' },
        { name:'📝 内容产出', key:'内容产出', color:'27AE60' },
        { name:'📊 商业模型', key:'商业模型', color:'E74C3C' },
        { name:'📋 会议汇报', key:'会议汇报', color:'7F8C8D' },
        { name:'🗂️ 归档整理', key:'归档整理', color:'1ABC9C' },
        { name:'🖥️ 产品需求', key:'产品需求', color:'D35400' },
    ];

    const weekLabels = ['前期\n5/19-29'];
    for (let w=1; w<=13; w++) weekLabels.push(`第${w}周`);
    for (let w=1; w<=13; w++) weekLabels.push(`W${w}概要`); // not used

    // Actually let me just use 14 columns: 0=前期, 1-13=week1-13
    const weeks = 14; // 0..13

    // Header
    const hRow = ws.addRow(['工作流','色标', ...weekLabels.slice(0, weeks)]);
    styleHeader(hRow, ws, weeks+2);
    // Phase group merge
    ws.mergeCells(1,3, 1,6); // 前期+W1-4 month1
    ws.mergeCells(1,7, 1,10); // W5-8 month2
    ws.mergeCells(1,11, 1,16); // W9-13 month3

    // Compute stream hours per week
    const swh = {};
    for (const s of streams) { swh[s.key] = {}; for(let w=0;w<weeks;w++) swh[s.key][w]=0; }
    for (const day of allDays) {
        const w = day.week;
        for (const t of (day.tasks||[])) {
            if (swh[t.type] !== undefined) swh[t.type][w] = (swh[t.type][w]||0) + (t.hours||0);
        }
    }

    for (const s of streams) {
        const row = ws.addRow([]);
        row.getCell(1).value = s.name;
        applyCellStyle(row.getCell(1), { bg:s.color, font:'FFFFFF', bold:true, align:'left' });
        row.getCell(2).value = '■■■';
        applyCellStyle(row.getCell(2), { bg:s.color, font:s.color, align:'center' });

        for (let w = 0; w < weeks; w++) {
            const hours = swh[s.key][w] || 0;
            const cell = row.getCell(3 + w);
            if (hours > 0) {
                const blocks = Math.max(1, Math.min(20, Math.round(hours / 2)));
                cell.value = '█'.repeat(blocks);
                applyCellStyle(cell, { bg:s.color, font:s.color, align:'center', bold:true });
            } else {
                cell.value = '';
                applyCellStyle(cell, { align:'center' });
            }
            // Add a note with actual hours
            if (hours > 0) cell.note = { texts:[{text:s.name+': '+hours.toFixed(1)+'h'}], margins:{inset:100} };
        }
        row.height = 22;
    }

    // Add total row
    const totalRow = ws.addRow([]);
    totalRow.getCell(1).value = '📌 周总工时';
    applyCellStyle(totalRow.getCell(1), { bg:'1a1a2e', font:'FFFFFF', bold:true, align:'left' });
    totalRow.getCell(2).value = '';
    applyCellStyle(totalRow.getCell(2), { bg:'1a1a2e' });
    for (let w = 0; w < weeks; w++) {
        let total = 0;
        for (const s of streams) total += swh[s.key][w] || 0;
        const cell = totalRow.getCell(3 + w);
        cell.value = total > 0 ? total.toFixed(0)+'h' : '';
        applyCellStyle(cell, { bg:'1a1a2e', font:'FFFFFF', bold:true, align:'center' });
    }

    ws.columns = [
        {width:18},{width:6},
        ...Array(weeks).fill({width:12})
    ];
}

// ============================================================
// Sheet 3: 周度汇总
// ============================================================
function buildWeeklySheet(wb, allDays) {
    const ws = wb.addWorksheet('3-周度汇总', {
        properties:{tabColor:{argb:'FF27AE60'}}
    });
    const headers = ['周次','日期范围','阶段','本周主题','核心产出','关键指标','协作部门','AI工具'];
    const hRow = ws.addRow(headers);
    styleHeader(hRow, ws, headers.length);

    const wInfo = {
        0:{t:'项目熟悉+品牌概念探索',o:'培训总结/命名策划/赛道分析/概念设计×3/品牌体系雏形7份核心文档',k:'品牌体系7份+概念方案3版+赛道覆盖10+平台',c:'教培部/管理层/合规部/设计师',a:'Claude+MJ'},
        1:{t:'赛道调研+公测品牌准备启动',o:'行业数据汇总/竞品矩阵/三方痛点图谱/市场机会报告/技术会议纪要/公测品牌触点清单/UI品牌审查/公测准备清单',k:'7份文档/覆盖10+平台/公测品牌4大模块待办明确',c:'部门主管/数字化中心',a:'Claude'},
        2:{t:'【公测冲刺】品牌定位+平台上线准备',o:'6套店铺模板（3餐饮+3电商）/品牌定位3方案/战略模型/知识库品牌内容/商家入驻品牌指南/公测品牌评审纪要',k:'模板6套可商用/公测品牌触点零重大缺陷/定位方案管理层评审',c:'管理层/数字化中心/设计师/商务',a:'Claude+MJ'},
        3:{t:'品牌命名定稿+工具包交付+体系深化',o:'链邦赋商通命名终稿/商标注册启动/市场拓展工具包V1.0/招商会PPT V1.0/Slogan话语体系/执行手册审阅/合规审查/视觉一致性审查/分润对外版',k:'品牌名确定/商标3类提交/工具包21章/PPT29页/新增≥8份文档',c:'管理层/合规部/数字化中心/财务部/北京捷佳联合',a:'Claude'},
        4:{t:'战略总纲与月度汇报',o:'战略总纲体系/差异化论证/首月成果包/跨部门协同纪要',k:'战略≥8000字/差异化通过/月报通过/跨部门对齐≥3部门',c:'管理层/数字化中心/运营部',a:'Claude+Notion'},
        5:{t:'品牌视觉体系（公测模板基础上深化）',o:'视觉Brief/Logo概念50+/超级符号手册/Logo规范文件6+版本/公测模板迭代V1.1',k:'Logo获批/视觉手册100%/Logo≥6版/模板迭代优化≥6处',c:'设计师',a:'MJ+Claude'},
        6:{t:'品牌内容体系（含公测知识库迭代）',o:'品牌故事/语调指南/核心页面文案/内容策略日历/知识库品牌内容V2.0',k:'5文档交付/文案一致性/知识库模块≥5',c:'文案组',a:'Claude'},
        7:{t:'商业模式与招商体系',o:'商业模式说明/招商战略/招商手册×4/商家SOP',k:'商业闭环/合规通过/手册4版',c:'财务部/合规部',a:'Claude'},
        8:{t:'品牌全案整合与月报',o:'全案目录/完整性自查/缺口补足/第2月成果包/跨部门资源需求清单',k:'完整度≥90%/缺口≤5/月报通过/排期确认≥3部门',c:'管理层/设计师/视频组/数字化中心',a:'Claude+Notion'},
        9:{t:'落地执行文件',o:'样板社区标准/30天冷启动/财务模型/服务商管理办法/跨部门执行对齐纪要',k:'4份执行文档/可直接试点/三方对齐确认',c:'财务部/业务部/数字化中心/运营部',a:'Claude'},
        10:{t:'融资路演材料',o:'白皮书20000+/融资BP/招商手册设计版/路演话术3版',k:'白皮书≥20000字/BP≤15页/对外统一',c:'设计师',a:'Claude+Gamma+Canva'},
        11:{t:'品牌物料与PRD',o:'社区物料包/社媒素材库/PRD/品牌规范手册/链宝IP',k:'物料≥7/社媒≥15/PRD可开发',c:'设计师/视频组/数字化',a:'MJ+Canva+剪映+Claude'},
        12:{t:'总结归档与交接',o:'全案目录/知识库上线/述职报告/交接手册/终期PPT',k:'文档≥40/归档100%/转正',c:'管理层/人事部/全员',a:'Claude+Notion'},
        13:{t:'缓冲补足与转正收尾',o:'述职终稿/交接确认签收/终期汇报/转正评估/三备份归档',k:'100%完成/汇报通过/转正/三备份/交接确认≥3部门',c:'管理层/人事部/主管/数字化中心/设计师',a:'Claude+Notion'},
    };

    for (let w = 0; w <= 13; w++) {
        const info = wInfo[w];
        const weekDays = allDays.filter(d => d.week === w);
        const dr = weekDays.length>0 ? `${weekDays[0].date}~${weekDays[weekDays.length-1].date}` : '';
        const wl = w===0?'前期':`第${w}周`;
        const phase = w===0?'前期·项目启动':(w<=4?'第1月·品牌地基期':(w<=8?'第2月·品牌建设期':'第3月·品牌交付期'));
        const row = ws.addRow([wl, dr, phase, info.t, info.o, info.k, info.c, info.a]);
        applyCellStyle(row.getCell(1), { align:'center', bold:true });
        applyCellStyle(row.getCell(2), { align:'center' });
        applyPhaseColor(row.getCell(3), phase.includes('第1月')?'第1月·品牌地基期':(phase.includes('第2月')?'第2月·品牌建设期':(phase.includes('第3月')?'第3月·品牌交付期':'前期')));
        for (let c=4;c<=8;c++) applyCellStyle(row.getCell(c), {});
        if (w===0) { for(let c=1;c<=8;c++) row.getCell(c).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF0FFF0'}}; }
        row.height = 36;
    }
    ws.columns = [{width:8},{width:22},{width:20},{width:26},{width:50},{width:42},{width:22},{width:30}];
}

// ============================================================
// Sheet 4: 月度里程碑
// ============================================================
function buildMonthSheet(wb) {
    const ws = wb.addWorksheet('4-月度里程碑', {
        properties:{tabColor:{argb:'FF8E44AD'}}
    });
    const headers = ['月份','阶段名称','核心目标','关键里程碑','交付物数量','考核标准','AI工具','协作部门'];
    const hRow = ws.addRow(headers);
    styleHeader(hRow, ws, headers.length);

    const data = [
        ['前期\n(5/19-5/29)','项目启动期','快速熟悉、产出品牌雏形、探索3版概念','5/19-20:培训+母公司调研\n5/21-23:命名+赛道+营销目标\n5/25-26:旺店链+火星链概念设计\n5/27-29:链生活品牌体系成型','33份','品牌体系7份核心文档/概念方案3版/赛道覆盖10+平台','Claude+MJ','教培部/管理层/合规部/设计师'],
        ['第1个月\n(6/1-6/26)','品牌地基期\n（含公测冲刺）','确定战略方向、完成命名与商标预查、输出战略总纲、配合平台6/12公测上线','W1:赛道全景+公测品牌准备\nW2:【公测冲刺】6套模板+知识库+入驻指南+6/12公测上线\nW3:命名+公测反馈→W4:战略总纲+月报','28份','战略方向管理层确认/商标预查通过/定位手册100%/公测品牌触点零重大缺陷/6套模板可商用','Claude+MJ','管理层/部门主管/合规部/数字化中心/设计师'],
        ['第2个月\n(6/29-7/24)','品牌建设期','完成视觉/内容/商业模式/招商四大体系全案','W5:Logo定型+视觉手册\nW6:内容体系4件套\nW7:商业模式+招商体系\nW8:全案整合+月报','15份','体系完整度≥90%/Logo获批/招商手册可对外/合规通过','Claude+MJ+Canva+Notion AI','设计师/文案组/财务部/合规部'],
        ['第3个月\n(7/27-8/28)','品牌交付期','完成落地执行/融资路演/全套物料，实现从纸面到可执行','W9:执行文件4件套\nW10:白皮书+BP+路演材料\nW11:物料包+PRD+品牌规范\nW12-13:归档+述职+转正','21份','全案≥40份/BP可路演/PRD可开发/知识库上线/转正获批','Claude+MJ+Canva+Gamma+剪映+Notion','管理层/人事部/设计师/视频组/数字化/合规部'],
    ];

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const row = ws.addRow(d);
        row.height = 80;

        // Phase color
        const phaseKeys = ['前期','第1月·品牌地基期','第2月·品牌建设期','第3月·品牌交付期'];
        applyPhaseColor(row.getCell(1), phaseKeys[i]);
        applyPhaseColor(row.getCell(2), phaseKeys[i]);
        for (let c=3;c<=8;c++) applyCellStyle(row.getCell(c), {});
        applyCellStyle(row.getCell(4), {}); // milestones have newlines

        // 前期 done 标记
        if (i===0) {
            row.getCell(5).value = '✅ 33份已完成';
            applyCellStyle(row.getCell(5), { bg:'D5F5E3', font:'1E8449', bold:true, align:'center' });
        }
    }
    ws.columns = [{width:14},{width:16},{width:36},{width:32},{width:14},{width:38},{width:28},{width:28}];
}

// ============================================================
// Sheet 5: 交付物清单
// ============================================================
function buildDeliverablesSheet(wb) {
    const ws = wb.addWorksheet('5-交付物清单', {
        properties:{tabColor:{argb:'FFE74C3C'}}
    });
    const headers = ['序号','交付物名称','所属阶段','计划完成','文件类型','协作方','状态'];
    const hRow = ws.addRow(headers);
    styleHeader(hRow, ws, headers.length);

    const items = [
        // 前期 33项
        [1,'链商项目培训总结','前期','5/19','Word','—','✅ 已完成'],
        [2,'全球拼购体系架构认知总结','前期','5/20','Word','—','✅ 已完成'],
        [3,'新品牌命名策划','前期','5/21','Word','—','✅ 已完成'],
        [4,'链商会议纪要','前期','5/21','Word','—','✅ 已完成'],
        [5,'链商品牌手册优化建议','前期','5/21','Word','—','✅ 已完成'],
        [6,'"链商"注册可行性分析','前期','5/21','Word','合规部','✅ 已完成'],
        [7,'新品牌平台构思','前期','5/22','Word','—','✅ 已完成'],
        [8,'本地生活赛道对比分析','前期','5/22','Word','—','✅ 已完成'],
        [9,'周总结和计划报告①','前期','5/22','Excel','部门主管','✅ 已完成'],
        [10,'链商品牌营销工作目标分解表','前期','5/23','Word','—','✅ 已完成'],
        [11,'品牌营销预算框架','前期','5/23','Word','—','✅ 已完成'],
        [12,'实体经济数字化转型关键点','前期','5/25','Word','—','✅ 已完成'],
        [13,'新品牌命名核心元素体系','前期','5/25','Word','—','✅ 已完成'],
        [14,'Slogan制定方法+分类范例','前期','5/25','Word','—','✅ 已完成'],
        [15,'旺店链概念设计（方案A+B）','前期','5/25','PNG/Word','设计师','✅ 已完成'],
        [16,'链商品牌手册V2.2','前期','5/26','Word','—','✅ 已完成'],
        [17,'火星链概念设计+Logo稿×3','前期','5/26','PNG/Word','设计师','✅ 已完成'],
        [18,'火星链品牌落地配套方案','前期','5/26','Word','—','✅ 已完成'],
        [19,'链商宣传海报文案×3版','前期','5/26','Word','—','✅ 已完成'],
        [20,'全球拼购&链邦科技组织架构完整版','前期','5/27','Word','—','✅ 已完成'],
        [21,'链商资源与协作机制','前期','5/27','Word','跨部门','✅ 已完成'],
        [22,'链生活概念设计方案','前期','5/27','Word','—','✅ 已完成'],
        [23,'链生活品牌定位体系战略手册','前期','5/28','Word','—','✅ 已完成'],
        [24,'链生活品牌战略总纲体系','前期','5/28','Word','—','✅ 已完成'],
        [25,'链生活品牌视觉与超级符号体系手册','前期','5/28','Word','—','✅ 已完成'],
        [26,'链生活商业模式说明','前期','5/28','Word','—','✅ 已完成'],
        [27,'链生活分润机制与会员体系','前期','5/28','Word','—','✅ 已完成'],
        [28,'链生活品牌策略与营销落地方案','前期','5/28','Word','—','✅ 已完成'],
        [29,'链生活战略定位升级与护城河体系','前期','5/28','Word','—','✅ 已完成'],
        [30,'链生活30天冷启动动作表','前期','5/29','Word','—','✅ 已完成'],
        [31,'链生活样板社区选择标准','前期','5/29','Word','—','✅ 已完成'],
        [32,'链生活城市服务商管理办法','前期','5/29','Word','—','✅ 已完成'],
        [33,'链生活单社区财务模型','前期','5/29','Excel','财务部','✅ 已完成'],
        [34,'链生活集团顶层设计全集','前期','5/29','Word','—','✅ 已完成'],
        [35,'链生活商业生态白皮书V1.0（初版）','前期','5/29','Word','—','✅ 已完成'],
        [36,'链生活融资路演BP（初版）','前期','5/29','PDF','—','✅ 已完成'],
        [37,'链生活城市服务商招商手册（初版）','前期','5/29','Word','—','✅ 已完成'],
        [38,'链商×技术部沟通清单','前期','5/29','Word','技术部','✅ 已完成'],
        // 第1月 17项
        [39,'3个月工作计划表（本表）','第1月','W1','Excel','人事部','⏳ 待完成'],
        [40,'行业基础数据汇总','第1月','W1','Word','—','⏳ 待完成'],
        [41,'竞品矩阵对比表（含UE模型）','第1月','W1','Word','—','⏳ 待完成'],
        [42,'三方痛点与机会图谱','第1月','W1','Word','—','⏳ 待完成'],
        [43,'市场机会与可行性报告','第1月','W1','Word','—','⏳ 待完成'],
        [44,'品牌定位3方案对比','第1月','W2','Word','—','⏳ 待完成'],
        [45,'品牌战略模型图','第1月','W2','Word','—','⏳ 待完成'],
        [46,'品牌使命愿景价值观V1.0','第1月','W2','Word','—','⏳ 待完成'],
        [47,'品牌定位体系战略手册（新品牌）','第1月','W2','Word','管理层','⏳ 待完成'],
        [48,'链邦赋商通命名终稿（5轮迭代）','第1月','W3','Word','管理层','✅ 已完成'],
        [49,'商标注册代理协议 IP-2026-001','第1月','W3','PDF','合规部','✅ 已完成'],
        [50,'市场拓展营销工具包 V1.0（5部分21章）','第1月','W3','Word','—','✅ 已完成'],
        [51,'招商会销讲PPT V1.0（29页·pptx）','第1月','W3','PPTX','—','✅ 已完成'],
        [52,'品牌话语体系与Slogan（链邦赋商通版）','第1月','W3','Word','—','⏳ 待完成'],
        [53,'品牌执行手册 V1.1 + 千面千店文案规范','第1月','W3','Word','—','⏳ 待完成'],
        [54,'全平台合规术语审查 + 视觉一致性审查','第1月','W3','Word','—','⏳ 待完成'],
        [55,'分润模型V3.2对外版（双版本）','第1月','W3','Word','财务部','⏳ 待完成'],
        [56,'品牌战略总纲体系V1.0','第1月','W4','Word','—','⏳ 待完成'],
        [57,'品牌差异化战略说明','第1月','W4','Word','—','⏳ 待完成'],
        [58,'第1月品牌地基成果包','第1月','W4','文件夹','管理层','⏳ 待完成'],
        // 第2月
        [59,'品牌视觉策略Brief','第2月','W5','Word','设计师','⏳ 待完成'],
        [60,'Logo概念方向稿（MJ）','第2月','W5','PDF/PNG','设计师','⏳ 待完成'],
        [61,'品牌视觉与超级符号体系手册','第2月','W5','Word','设计师','⏳ 待完成'],
        [62,'Logo标准规范文件（含源文件）','第2月','W5','AI/PNG/PDF','设计师','⏳ 待完成'],
        [63,'品牌故事体系','第2月','W6','Word','—','⏳ 待完成'],
        [64,'品牌语调与文案规范','第2月','W6','Word','文案组','⏳ 待完成'],
        [65,'品牌核心页面文案','第2月','W6','Word','—','⏳ 待完成'],
        [66,'品牌内容策略与日历','第2月','W6','Word','文案组','⏳ 待完成'],
        [67,'商业模式说明','第2月','W7','Word','财务部','⏳ 待完成'],
        [68,'招商战略体系','第2月','W7','Word','—','⏳ 待完成'],
        [69,'招商手册（通用版+行业版×3）','第2月','W7','Word','合规部','⏳ 待完成'],
        [70,'商家合作SOP','第2月','W7','Word','—','⏳ 待完成'],
        [71,'品牌全案体系目录','第2月','W8','Word','—','⏳ 待完成'],
        [72,'品牌体系完整性自查表','第2月','W8','Word','—','⏳ 待完成'],
        [73,'第2月品牌全案成果包','第2月','W8','文件夹','管理层','⏳ 待完成'],
        // 第3月
        [74,'样板社区选择标准','第3月','W9','Word','—','⏳ 待完成'],
        [75,'30天冷启动动作表','第3月','W9','Word','—','⏳ 待完成'],
        [76,'单社区财务模型','第3月','W9','Excel','财务部','⏳ 待完成'],
        [77,'城市服务商管理办法','第3月','W9','Word','—','⏳ 待完成'],
        [78,'商业生态白皮书V1.0','第3月','W10','Word/PDF','—','⏳ 待完成'],
        [79,'融资路演BP（内容版+视觉版）','第3月','W10','PPT/PDF','设计师','⏳ 待完成'],
        [80,'路演话术（3版本）','第3月','W10','Word','—','⏳ 待完成'],
        [81,'社区线下物料包','第3月','W11','AI/PNG/PDF','设计师','⏳ 待完成'],
        [82,'社媒视觉素材库','第3月','W11','PSD/PNG/MP4','设计师/视频组','⏳ 待完成'],
        [83,'产品需求文档PRD','第3月','W11','Word','数字化中心','⏳ 待完成'],
        [84,'品牌使用规范手册','第3月','W11','Word/PDF','合规部','⏳ 待完成'],
        [85,'链宝IP初稿','第3月','W11','AI/PNG','设计师','⏳ 待完成'],
        [86,'品牌全案最终目录','第3月','W12','Word','—','⏳ 待完成'],
        [87,'Notion品牌资产知识库','第3月','W12','Notion','部门全员','⏳ 待完成'],
        [88,'试用期述职报告','第3月','W12-W13','Word','人事部','⏳ 待完成'],
        [89,'品牌工作交接与协作手册','第3月','W12','Word','部门全员','⏳ 待完成'],
        [90,'终期汇报PPT','第3月','W12-W13','PPT','管理层','⏳ 待完成'],
        [91,'品牌建设AI方法论总结','第3月','W13','Word','—','⏳ 待完成'],
        [92,'交接确认签字表','第3月','W13','Word','部门全员','⏳ 待完成'],
        [93,'周总结和计划报告（×16）','全程','持续','Excel','部门主管','⏳ 持续'],
        [94,'月度总结与下月计划（×3）','全程','W4/W8/W12','Word','管理层','⏳ 待完成'],
        [95,'技术沟通会议纪要（数字化中心）','第1月','W1','Word','数字化中心','⏳ 待完成'],
        [96,'跨部门协同纪要（月度汇报前对齐）','第1月','W4','Word','管理层/数字化中心/运营部','⏳ 待完成'],
        [97,'跨部门资源需求清单+协作SOP','第2月','W8','Word','设计师/视频组/数字化中心','⏳ 待完成'],
        [98,'跨部门执行对齐纪要（三方配合确认）','第3月','W9','Word','业务部/数字化中心/运营部','⏳ 待完成'],
        [99,'品牌资产交接确认签收表','第3月','W13','Word','部门主管/数字化中心/设计师','⏳ 待完成'],
        // 公测品牌冲刺交付物（新增）
        [100,'公测品牌触点清单','第1月','W1','Word','数字化中心','⏳ 待完成'],
        [101,'公测版UI品牌审查问题清单','第1月','W1','Word','数字化中心','⏳ 待完成'],
        [102,'公测品牌准备清单（4大模块）','第1月','W1','Word','数字化中心','⏳ 待完成'],
        [103,'店铺模板设计Brief（3餐饮+3电商）','第1月','W2','Word','设计师','⏳ 待完成'],
        [104,'6套店铺模板终稿（3餐饮+3电商）','第1月','W2','设计源文件','设计师/数字化中心','⏳ 待完成'],
        [105,'知识库品牌内容V1.0（图文+短视频脚本）','第1月','W2','Word/MP4','数字化中心','⏳ 待完成'],
        [106,'商家入驻品牌物料指南','第1月','W2','Word','商务/数字化中心','⏳ 待完成'],
        [107,'公测品牌准备评审纪要','第1月','W2','Word','管理层/数字化中心','⏳ 待完成'],
        [108,'公测品牌反馈周报①+②','第1月','W3','Word','数字化中心','⏳ 待完成'],
        [109,'公测模板迭代V1.1','第2月','W5','设计源文件','设计师','⏳ 待完成'],
        [110,'知识库品牌内容V2.0','第2月','W6','Word/MP4','文案组','⏳ 待完成'],
    ];

    for (const item of items) {
        const row = ws.addRow(item);
        applyCellStyle(row.getCell(1), { align:'center' });
        for (let c=2;c<=7;c++) applyCellStyle(row.getCell(c), c===7?{align:'center',bold:true}:{align:c===2?'left':'center'});

        // Status colors
        const status = item[6];
        if (status.includes('已完成')) {
            row.getCell(7).fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+DONE_BG} };
            row.getCell(7).font = { name:FONT.body, size:9, bold:true, color:{argb:'FF'+DONE_FONT} };
            // Also light green bg for the entire row
            for (let c=1;c<=7;c++) {
                const cell = row.getCell(c);
                const hasCustomFill = cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb &&
                    cell.fill.fgColor.argb !== 'FFFFFFFF';
                if (!hasCustomFill) {
                    cell.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFF0FFF0'} };
                }
            }
        } else if (status.includes('持续')) {
            row.getCell(7).fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FFD6EAF8'} };
            row.getCell(7).font = { name:FONT.body, size:9, bold:true, color:{argb:'FF2471A3'} };
        } else {
            row.getCell(7).fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+PENDING_BG} };
            row.getCell(7).font = { name:FONT.body, size:9, bold:true, color:{argb:'FF'+PENDING_FONT} };
        }

        // Bold for milestone items
        if ([39,47,51,55,59,70,75,76,84,85].includes(item[0])) {
            row.getCell(2).font = { name:FONT.body, size:9, bold:true };
        }
    }

    ws.columns = [{width:5},{width:42},{width:10},{width:10},{width:14},{width:16},{width:12}];
    ws.autoFilter = { from:'A1', to:'G1' };
}

// ============================================================
// Sheet 6: AI工具使用计划
// ============================================================
function buildAISheet(wb) {
    const ws = wb.addWorksheet('6-AI工具使用计划', {
        properties:{tabColor:{argb:'FF1ABC9C'}}
    });
    const headers = ['工具名称','类型','使用阶段','使用频次','核心应用场景','预计效率提升','月费参考'];
    const hRow = ws.addRow(headers);
    styleHeader(hRow, ws, headers.length);

    const data = [
        ['🤖 Claude','AI 文本/推理','全程（每日）','每日使用','策略推演、文档展开、文案量产、话术生成、竞品分析、财务建模、逻辑审查、汇报摘要','3-5倍文案产出效率','~$20/月'],
        ['🎨 Midjourney','AI 图像生成','W5/W11 集中使用','集中期每日','Logo概念（50+张/小时）、超级符号延展、IP设计、海报概念、物料视觉方向','50+概念图/小时 vs 传统3-5张/天','~$30/月'],
        ['📐 Canva Pro','在线设计平台','W10-W11','集中期每日','招商手册排版、社媒模板批量生成、物料设计、品牌模板库建设','10倍物料排版效率','~$15/月'],
        ['📚 Notion AI','知识管理+AI','全程（每周）','每周1-2次','品牌资产库搭建与维护、文档自动归档、知识管理、工作日志整理、周报辅助','知识检索时间减少80%/协作效率翻倍','~$15/月'],
        ['📊 Gamma/美图AI','AI PPT生成','W10集中','3-5次','融资路演BP初稿自动生成、月度汇报PPT、招商宣讲PPT','PPT初稿时间从2天缩短至2小时','~$10/月'],
        ['🎬 剪映专业版','AI 视频剪辑','W11集中','3-5次','短视频片头/片尾模板、探店视频初剪、社媒视频素材自动生成','视频模板效率提升5倍','免费'],
    ];

    for (const d of data) {
        const row = ws.addRow(d);
        for (let c=1;c<=7;c++) applyCellStyle(row.getCell(c), {align:c===1?'left':(c===5?'left':'center')});
        row.height = 32;
    }

    ws.columns = [{width:18},{width:16},{width:18},{width:14},{width:48},{width:28},{width:12}];
}

// ============================================================
// 主程序
// ============================================================
async function main() {
    const wb = new ExcelJS.Workbook();
    wb.creator = '梁君衡';
    wb.created = new Date();
    wb.title = '3个月品牌全案工作计划表';

    const allDays = buildAllDays();

    buildDailySheet(wb, allDays);
    buildGanttSheet(wb, allDays);
    buildWeeklySheet(wb, allDays);
    buildMonthSheet(wb);
    buildDeliverablesSheet(wb);
    buildAISheet(wb);

    const outPath = path.join(__dirname, '梁君衡_3个月品牌全案工作计划表.xlsx');
    await wb.xlsx.writeFile(outPath);
    console.log('✅ 已生成: ' + outPath);
    console.log(`📊 6工作表 | 每日计划 | 甘特图色条 | 周度14周 | 月度4阶段 | 交付物110项 | AI工具6项`);
}

main().catch(e => { console.error(e); process.exit(1); });
