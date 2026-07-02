const XLSX = require('@e965/xlsx');
const path = require('path');
const { COLORS, META } = require('./lib/constants');

// ============================================================
// 日期与阶段配置
// ============================================================
const PRE_START = new Date(2026, 4, 19); // May 19 (Monday)
const PRE_END = new Date(2026, 4, 29);   // May 29
const PLAN_START = new Date(2026, 5, 1);  // June 1 (Monday)
const PLAN_END = new Date(2026, 7, 28);   // Aug 28

// ============================================================
// 工作类型色系（用于色条标示）
// ============================================================
const WORK_COLORS = {
    '调研分析':   { fill: '3498DB', font: 'FFFFFF', desc: '行业调研/竞品分析/数据采集/用户研究' },
    '策略规划':   { fill: '2C3E50', font: 'FFFFFF', desc: '品牌定位/战略模型/商业逻辑/差异化论证' },
    '品牌创意':   { fill: '8E44AD', font: 'FFFFFF', desc: '命名/口号/品牌故事/创意概念/IP设计' },
    '视觉设计':   { fill: 'E67E22', font: 'FFFFFF', desc: 'Logo/VI/海报/物料/MJ出图/设计师对接' },
    '内容产出':   { fill: '27AE60', font: 'FFFFFF', desc: '文案撰写/内容策略/招商手册/SOP/白皮书' },
    '商业模型':   { fill: 'E74C3C', font: 'FFFFFF', desc: '收入模型/服务费结算机制/会员体系/财务测算' },
    '会议汇报':   { fill: '7F8C8D', font: 'FFFFFF', desc: '管理层汇报/部门周会/评审会/跨部门沟通' },
    '归档整理':   { fill: '1ABC9C', font: 'FFFFFF', desc: '文档归档/知识库/版本管理/交接整理' },
    '产品需求':   { fill: 'D35400', font: 'FFFFFF', desc: 'PRD撰写/功能设计/技术沟通/系统规划' },
};

// ============================================================
// 辅助函数
// ============================================================
function fmtDate(d) {
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
}
function dayOfWeekCN(d) { return ['日','一','二','三','四','五','六'][d.getDay()]; }
function isWeekday(d) { return d.getDay() !== 0 && d.getDay() !== 6; }
function getPlanWeek(d) {
    const diff = Math.floor((d - PLAN_START) / (1000*60*60*24));
    return Math.floor(diff / 7) + 1;
}
function getDayNum(d) {
    // returns overall day number: pre-work = negative offset, plan = 1-65
    if (d < PLAN_START) {
        let count = 0;
        for (let cur = new Date(PRE_START); cur <= d; cur.setDate(cur.getDate()+1)) {
            if (isWeekday(cur)) count++;
        }
        return -count; // negative for pre-work
    } else {
        let count = 0;
        for (let cur = new Date(PLAN_START); cur <= d; cur.setDate(cur.getDate()+1)) {
            if (isWeekday(cur)) count++;
        }
        return count;
    }
}
function getAllWorkingDays(start, end) {
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
        if (isWeekday(d)) days.push(new Date(d));
    }
    return days;
}

// ============================================================
// 前期工作数据（5/19-5/29）
// ============================================================
function getPreWorkData() {
    return [
        { date: '2026/05/19', dayOfWeek: '一', phase: '前期·项目熟悉期', taskTheme: '链商项目培训学习',
            tasks: [
                { content: '链商平台介绍与商业模式理解（培训课件1-8）', type: '调研分析', hours: 3 },
                { content: '数字化转型与链商合作共赢课程学习', type: '调研分析', hours: 2 },
                { content: '城市服务商机制与数字资产管理课程', type: '调研分析', hours: 2 },
                { content: '整理培训笔记与初步理解文档', type: '归档整理', hours: 1 },
            ],
            deliverables: '培训笔记 / 链商项目初步理解文档', kpis: '培训课程8节全覆盖 / 笔记≥3000字', collab: '教培部', ai: 'Claude（培训内容整理）' },

        { date: '2026/05/20', dayOfWeek: '二', phase: '前期·项目熟悉期', taskTheme: '母公司体系调研',
            tasks: [
                { content: '母公司企业介绍与公司架构学习（含宣传片）', type: '调研分析', hours: 2 },
                { content: '2025公司介绍PPT深度研读与业务版图梳理', type: '调研分析', hours: 2 },
                { content: '跨境电商+链商双赛道协同关系分析', type: '策略规划', hours: 2 },
                { content: '撰写《母公司体系架构认知总结》', type: '归档整理', hours: 2 },
            ],
            deliverables: '《母公司总结》', kpis: '母公司业务版图覆盖≥6大板块 / 链商与母公司协同关系清晰', collab: '—', ai: 'Claude（总结梳理）' },

        { date: '2026/05/21', dayOfWeek: '三', phase: '前期·品牌启动期', taskTheme: '新品牌命名策划+会议+品牌手册',
            tasks: [
                { content: '链商"新品牌命名策划：命名方向、关键词池、初选方案', type: '品牌创意', hours: 2.5 },
                { content: '链商会议全程参与与纪要整理', type: '会议汇报', hours: 1.5 },
                { content: '链商品牌手册初稿研读与优化建议撰写', type: '内容产出', hours: 2 },
                { content: '"链商"品牌名注册可行性、使用风险与品牌价值分析', type: '调研分析', hours: 2 },
            ],
            deliverables: '《新品牌命名策划》/《会议纪要》/《品牌手册优化建议》/《"链商"注册可行性分析》', kpis: '命名关键词≥80个 / 优化建议≥10条 / 可行性分析覆盖5维度', collab: '部门主管、合规部', ai: 'Claude（命名生成+分析+建议）' },

        { date: '2026/05/22', dayOfWeek: '四', phase: '前期·品牌启动期', taskTheme: '新品牌平台构思+赛道对比分析',
            tasks: [
                { content: '新品牌平台模式构思：社区入口+本地生活+商家共赢模型', type: '策略规划', hours: 2.5 },
                { content: '平台核心逻辑推导：先社区后平台/先服务后规模', type: '策略规划', hours: 1.5 },
                { content: '本地生活赛道全方位对比分析（美团/阿里/抖音/京东/高德/小红书等）', type: '调研分析', hours: 3 },
                { content: '撰写周总结和周计划报告', type: '归档整理', hours: 1 },
            ],
            deliverables: '《新品牌平台构思》/《本地生活赛道对比分析》/《周总结和计划报告》', kpis: '平台模型≥4要素 / 赛道覆盖≥10平台 / 对比维度≥15项', collab: '部门主管', ai: 'Claude（赛道分析+模型推演+周报）' },

        { date: '2026/05/23', dayOfWeek: '五', phase: '前期·品牌启动期', taskTheme: '品牌营销工作目标分解',
            tasks: [
                { content: '链商品牌营销全链路目标体系设计', type: '策略规划', hours: 2 },
                { content: '年度/季度/月度营销目标逐级分解', type: '策略规划', hours: 2 },
                { content: '品牌营销预算框架搭建', type: '商业模型', hours: 2 },
                { content: '品牌营销工作目标分解表撰写与定稿', type: '内容产出', hours: 2 },
            ],
            deliverables: '《链商品牌营销工作目标分解表》/《品牌营销预算》', kpis: '目标层级≥4级 / 指标项≥20项 / 预算框架5大板块', collab: '—', ai: 'Claude（目标分解+预算框架）' },

        { date: '2026/05/25', dayOfWeek: '日→一', phase: '前期·概念探索期', taskTheme: '链商概念设计（旺店链）+案例方案收集',
            tasks: [
                { content: '旺店链品牌概念设计（方案A+方案B视觉稿）', type: '视觉设计', hours: 3 },
                { content: '实体经济数字化转型核心关键点研究', type: '调研分析', hours: 1.5 },
                { content: '新品牌命名核心元素体系梳理', type: '品牌创意', hours: 1.5 },
                { content: '本地生活平台Slogan制定方法+分类范例收集', type: '品牌创意', hours: 2 },
            ],
            deliverables: '《旺店链概念设计》/《实体经济与数字化关键点》/《命名核心元素》/《Slogan方法+范例》', kpis: '概念方案≥2套 / 案例≥8个 / Slogan方法≥5类', collab: '设计师', ai: 'Claude+MJ（概念设计+素材收集）' },

        { date: '2026/05/26', dayOfWeek: '二', phase: '前期·概念探索期', taskTheme: '品牌手册V2+火星链概念+海报文案',
            tasks: [
                { content: '链商品牌手册V2版本迭代修订（V2.1→V2.2）', type: '内容产出', hours: 2.5 },
                { content: '火星链品牌概念设计与Logo视觉探索', type: '视觉设计', hours: 2 },
                { content: '火星链品牌落地配套方案撰写', type: '策略规划', hours: 1.5 },
                { content: '链商宣传海报文案3版撰写+修改意见整理', type: '内容产出', hours: 2 },
            ],
            deliverables: '《品牌手册V2.2》/《火星链概念设计+Logo》/《海报文案×3》/《修改意见》', kpis: '手册迭代2版 / Logo≥3稿 / 海报文案≥3版×3张 / 修改意见逐条标注', collab: '设计师', ai: 'Claude+MJ（手册+Logo+海报文案）' },

        { date: '2026/05/27', dayOfWeek: '三', phase: '前期·体系成型期', taskTheme: '组织架构+协作机制+链生活概念',
            tasks: [
                { content: '母公司&链商平台运营方组织架构完整版文档梳理', type: '调研分析', hours: 2 },
                { content: '链商资源与协作机制沟通与梳理', type: '会议汇报', hours: 2 },
                { content: '链生活品牌概念设计（从火星链→链生活的关键转折）', type: '品牌创意', hours: 2.5 },
                { content: '链生活概念方案初稿与命名定调', type: '品牌创意', hours: 1.5 },
            ],
            deliverables: '《组织架构完整版文档》/《资源与协作机制》/《链生活概念设计》', kpis: '组织架构覆盖≥100人 / 协作机制模块≥6项 / 链生活概念方案≥1套', collab: '管理层、跨部门', ai: 'Claude（组织梳理+概念设计）' },

        { date: '2026/05/28', dayOfWeek: '四', phase: '前期·体系成型期', taskTheme: '链生活品牌体系文件集中产出',
            tasks: [
                { content: '链生活品牌定位体系战略手册撰写', type: '策略规划', hours: 2 },
                { content: '链生活品牌战略总纲体系撰写', type: '策略规划', hours: 2 },
                { content: '链生活品牌视觉与超级符号体系手册撰写', type: '视觉设计', hours: 1.5 },
                { content: '链生活商业模式+服务费结算机制+品牌策略+护城河体系撰写', type: '商业模型', hours: 2.5 },
            ],
            deliverables: '《定位手册》/《战略总纲》/《视觉手册》/《商业模式》/《服务费结算模型》/《策略方案》/《护城河体系》', kpis: '品牌体系7份核心文档交付 / 总字数≥5万字', collab: '—', ai: 'Claude（全文档体系并行产出）' },

        { date: '2026/05/29', dayOfWeek: '五', phase: '前期·体系成型期', taskTheme: '链生活执行落地文件+技术沟通+顶层设计',
            tasks: [
                { content: '链生活30天冷启动动作表+样板社区选择标准', type: '内容产出', hours: 2 },
                { content: '城市服务商管理办法+单社区财务模型', type: '商业模型', hours: 2 },
                { content: '链商项目×技术部沟通清单准备', type: '产品需求', hours: 1.5 },
                { content: '链生活集团顶层设计全集+白皮书+BP+招商手册+工作日志终稿', type: '内容产出', hours: 2.5 },
            ],
            deliverables: '《冷启动表》/《样板社区标准》/《服务商管理》/《财务模型》/《技术沟通清单》/《顶层设计全集》/《白皮书》/《BP》/《招商手册》', kpis: '执行文件4份+顶层设计1份+对外文件3份 / 当日交付≥8份文档', collab: '技术部、管理层', ai: 'Claude（执行文件+顶层设计并行产出）' },
    ];
}

// ============================================================
// 计划期每日数据（6/1 - 8/28，共65工作日）
// ============================================================
function generatePlanDays() {
    const days = getAllWorkingDays(PLAN_START, PLAN_END);
    const plan = [];

    for (const d of days) {
        const dayNum = getDayNum(d);
        const week = getPlanWeek(d);
        const dow = dayOfWeekCN(d);
        const dateStr = fmtDate(d);
        const entry = {
            dayNum, date: dateStr, week, dayOfWeek: dow,
            phase: '', phaseGroup: '', tasks: [],
            deliverables: '', kpis: '', collaborators: '', aiTools: ''
        };

        // ==================== 第1周：赛道调研 ====================
        if (week === 1) {
            entry.phaseGroup = '第1月·品牌地基期';
            entry.phase = '赛道调研与竞品分析';

            if (dayNum === 1) { // Jun 1 Mon
                entry.tasks = [
                    { content: '入职手续与部门对接，确认试用期考核标准与3个月目标', type: '会议汇报', hours: 1.5 },
                    { content: '梳理项目现有资料，建立品牌知识文件夹结构', type: '归档整理', hours: 1.5 },
                    { content: '行业市场基础调研：本地生活市场规模、增长趋势、政策环境', type: '调研分析', hours: 2.5 },
                    { content: 'AI辅助：Claude生成行业数据概览框架与关键数据点', type: '调研分析', hours: 1.5 },
                    { content: '整理调研笔记，标注关键判断点与待验证假设', type: '归档整理', hours: 1 },
                ];
                entry.deliverables = '《3个月工作计划表》\n《行业基础数据汇总》初稿';
                entry.kpis = '计划获批 / 数据覆盖≥5维度 / 当日任务完成率100%';
                entry.collaborators = '人事部、部门主管';
                entry.aiTools = 'Claude（行业调研框架+数据整理）';
            } else if (dayNum === 2) { // Jun 2 Tue
                entry.tasks = [
                    { content: '竞品数据采集：美团、阿里系、抖音、京东核心数据', type: '调研分析', hours: 2 },
                    { content: '按统一维度建对比框架：定位/模式/市占/UE/优劣势', type: '调研分析', hours: 1.5 },
                    { content: 'Claude辅助：竞品信息补全校验 + UE模型数据推演', type: '调研分析', hours: 2 },
                    { content: '第一梯队深度对比：即时零售+到店业务核心差异点', type: '调研分析', hours: 1.5 },
                    { content: '整理《竞品矩阵对比表》第一梯队部分', type: '归档整理', hours: 1 },
                ];
                entry.deliverables = '《竞品矩阵对比表》第一梯队部分';
                entry.kpis = '覆盖4大平台 / 对比维度≥15项 / UE模型数据≥10项';
                entry.aiTools = 'Claude（竞品数据整理+UE模型推演）';
            } else if (dayNum === 3) { // Jun 3 Wed
                entry.tasks = [
                    { content: '第二梯队竞品分析：高德、小红书、快手、百度、朴朴', type: '调研分析', hours: 2 },
                    { content: '特色玩家模式梳理：社区团购、本地团长、垂直服务', type: '调研分析', hours: 1.5 },
                    { content: 'Claude辅助：差异化模式归纳与竞争定位图', type: '策略规划', hours: 1.5 },
                    { content: '竞品矩阵汇总：合并第一/第二梯队，形成全景对比', type: '调研分析', hours: 2 },
                    { content: '初步判断链生活差异化切入角度与机会窗口', type: '策略规划', hours: 1 },
                ];
                entry.deliverables = '《竞品矩阵对比表》完整版';
                entry.kpis = '覆盖≥10平台 / 对比维度≥15项 / 差异化判断≥3条';
                entry.aiTools = 'Claude（矩阵补全+差异分析+定位图）';
            } else if (dayNum === 4) { // Jun 4 Thu
                entry.tasks = [
                    { content: '用户端痛点深挖：附近好店难找/优惠分散/售后困难/服务不稳定', type: '调研分析', hours: 2 },
                    { content: 'Claude辅助：归纳用户痛点场景与情绪价值链', type: '调研分析', hours: 1.5 },
                    { content: '商家端痛点深挖：获客贵/抽佣重/用户不沉淀/缺复购', type: '调研分析', hours: 2 },
                    { content: '社区端痛点深挖：服务分散/活动不足/邻里脱节', type: '调研分析', hours: 1.5 },
                    { content: '合并输出，每痛点标注对应机会方向', type: '策略规划', hours: 1 },
                ];
                entry.deliverables = '《三方痛点与机会图谱》初稿';
                entry.kpis = '用户痛点≥10条/商家痛点≥10条/社区痛点≥8条/每条对应机会方向';
                entry.aiTools = 'Claude（痛点场景归纳+情绪价值链推演）';
            } else if (dayNum === 5) { // Jun 5 Fri
                entry.tasks = [
                    { content: '完成《市场机会与可行性报告》终稿', type: '策略规划', hours: 2 },
                    { content: '判断结论：是否值得做/切入点在哪/风险可控性评估', type: '策略规划', hours: 1.5 },
                    { content: '第1周成果汇总＋全部文档归档至品牌知识库', type: '归档整理', hours: 1.5 },
                    { content: '撰写《周总结和周计划报告》', type: '归档整理', hours: 1.5 },
                    { content: '部门周会：汇报本周调研成果与下周定位计划', type: '会议汇报', hours: 1.5 },
                ];
                entry.deliverables = '《市场机会与可行性报告》\n《周总结和周计划报告》';
                entry.kpis = '本周5份文档交付 / 主管评分≥80 / 周报提交准时';
                entry.collaborators = '部门主管、部门周会';
                entry.aiTools = 'Claude（机会推演+周报整理）';
            }
        }

        // ==================== 第2周：品牌定位 ====================
        else if (week === 2) {
            entry.phaseGroup = '第1月·品牌地基期';
            entry.phase = '品牌定位与战略模型';

            if (dayNum === 6) { // Jun 8 Mon
                entry.tasks = [
                    { content: '品牌品类归属、核心人群、使用场景定义', type: '策略规划', hours: 2 },
                    { content: 'Claude三轮定位推演：出3个差异化定位方案', type: '策略规划', hours: 2.5 },
                    { content: '品牌五维模型构建：用户/商家/社区/平台/城市', type: '策略规划', hours: 2 },
                    { content: '3方案对比分析：差异点/优劣/适用条件/推荐理由', type: '策略规划', hours: 1.5 },
                ];
                entry.deliverables = '《品牌定位3方案对比》';
                entry.kpis = '≥3个定位方案 / 每个方案含完整五维模型 / 推荐方案有≥5个支撑论据';
                entry.aiTools = 'Claude（多版本定位推演+维度填充）';
            } else if (dayNum === 7) { // Jun 9 Tue
                entry.tasks = [
                    { content: '品牌战略公式设计：社区入口×商家生态×用户复购×服务履约', type: '策略规划', hours: 2 },
                    { content: '增长飞轮模型：社区触达→消费→增长→复购→活跃→收益', type: '策略规划', hours: 2 },
                    { content: '竞争壁垒设计：社区/用户/商家/服务/城市五大壁垒', type: '策略规划', hours: 2 },
                    { content: 'Claude辅助：战略逻辑推演与漏洞检查', type: '策略规划', hours: 1 },
                    { content: '与竞品战略差异化对比验证', type: '策略规划', hours: 1 },
                ];
                entry.deliverables = '《品牌战略模型图》';
                entry.kpis = '战略公式完整 / 飞轮环节≥5步 / 壁垒维度≥5个 / 差异化验证通过';
                entry.aiTools = 'Claude（战略推演+逻辑审查+漏洞检查）';
            } else if (dayNum === 8) { // Jun 10 Wed
                entry.tasks = [
                    { content: '品牌使命起草与推敲', type: '品牌创意', hours: 1.5 },
                    { content: 'Claude发散：出20条使命候选→精选5条', type: '品牌创意', hours: 1.5 },
                    { content: '品牌愿景起草与推敲', type: '品牌创意', hours: 1.5 },
                    { content: '核心价值观体系：6大价值观+每条配含义+管理要求', type: '品牌创意', hours: 2 },
                    { content: '撰写《品牌使命愿景价值观V1.0》', type: '内容产出', hours: 1.5 },
                ];
                entry.deliverables = '《品牌使命愿景价值观 V1.0》';
                entry.kpis = '使命候选≥5条/愿景候选≥5条/价值观≥6条/每条有执行含义';
                entry.aiTools = 'Claude（使命愿景批量发散+精选）';
            } else if (dayNum === 9) { // Jun 11 Thu
                entry.tasks = [
                    { content: '准备定位方案汇报材料：竞品对比+定位推导+3方案对比', type: '会议汇报', hours: 2 },
                    { content: 'Claude辅助：生成汇报摘要与决策建议', type: '会议汇报', hours: 1 },
                    { content: '内部评审会议：陈述方案+收集管理层反馈', type: '会议汇报', hours: 2 },
                    { content: '记录评审意见，逐条标注修改方向', type: '归档整理', hours: 1.5 },
                    { content: '开始《品牌定位体系战略手册》修订', type: '内容产出', hours: 1.5 },
                ];
                entry.deliverables = '定位汇报材料\n评审会议纪要';
                entry.kpis = '决策效率≤2小时 / 反馈记录完整≥10条 / 修改方向明确';
                entry.collaborators = '管理层、部门主管';
                entry.aiTools = 'Claude（汇报摘要+纪要整理）';
            } else if (dayNum === 10) { // Jun 12 Fri
                entry.tasks = [
                    { content: '根据评审意见修改定位方案', type: '策略规划', hours: 2 },
                    { content: '完成《品牌定位体系战略手册》终稿', type: '内容产出', hours: 2 },
                    { content: '定位文档归档＋版本锁定', type: '归档整理', hours: 1 },
                    { content: '第2周成果汇总', type: '归档整理', hours: 1 },
                    { content: '撰写《周总结和周计划报告》+部门周会', type: '会议汇报', hours: 2 },
                ];
                entry.deliverables = '《品牌定位体系战略手册》终稿\n《周总结和周计划报告》';
                entry.kpis = '定位手册完整度100% / 管理层签字确认 / 周报准时';
                entry.collaborators = '部门主管、部门周会';
                entry.aiTools = 'Claude（文档终稿+逻辑审查）';
            }
        }

        // ==================== 第3周：品牌命名 ====================
        else if (week === 3) {
            entry.phaseGroup = '第1月·品牌地基期';
            entry.phase = '品牌命名与商标预查';

            if (dayNum === 11) { // Jun 15
                entry.tasks = [
                    { content: '命名策略制定：命名标准10条+关键词池定义', type: '品牌创意', hours: 2 },
                    { content: 'Claude辅助：根据定位推导100+命名关键词', type: '品牌创意', hours: 2 },
                    { content: '关键词五向分类：连接系/社区系/生活系/创新系/融合系', type: '品牌创意', hours: 2 },
                    { content: '命名方向定义：5大方向各含核心逻辑+示例', type: '品牌创意', hours: 1 },
                    { content: '同步合规部商标检索标准', type: '会议汇报', hours: 1 },
                ];
                entry.deliverables = '《品牌命名策略与标准》';
                entry.kpis = '关键词≥100个 / 命名方向≥5个 / 命名标准≥10条';
                entry.collaborators = '合规部';
                entry.aiTools = 'Claude（关键词批量生成+分类）';
            } else if (dayNum === 12) { // Jun 16
                entry.tasks = [
                    { content: 'Claude批量生成：每方向20个候选=100个候选名', type: '品牌创意', hours: 2.5 },
                    { content: '初筛：剔除不合标准→保留50个', type: '品牌创意', hours: 1.5 },
                    { content: '二次筛选：读音测试+品牌感评估→保留Top20', type: '品牌创意', hours: 2 },
                    { content: 'Top20名称释义撰写：每名配含义+联想+适用场景', type: '品牌创意', hours: 1 },
                    { content: '内部小范围盲选测试：请3-5位同事参与', type: '会议汇报', hours: 1 },
                ];
                entry.deliverables = '《候选名称Top 20》';
                entry.kpis = '初始候选≥100个/Top20各配释义/内部测试≥3人';
                entry.aiTools = 'Claude（名称批量生成+释义撰写）';
            } else if (dayNum === 13) { // Jun 17
                entry.tasks = [
                    { content: 'Top10名称国家商标局官网预查', type: '调研分析', hours: 2 },
                    { content: '企查查/天眼查企业名称冲突验证', type: '调研分析', hours: 1.5 },
                    { content: '域名（.com/.cn）可用性查询', type: '调研分析', hours: 1.5 },
                    { content: '社交媒体账号名（微信/抖音/小红书）可用性检查', type: '调研分析', hours: 1.5 },
                    { content: '撰写《商标预查报告》：风险评级+合规部确认', type: '内容产出', hours: 1.5 },
                ];
                entry.deliverables = '《商标预查报告》';
                entry.kpis = '预查≥10个名称/5维度检查/风险评级明确';
                entry.collaborators = '合规部';
                entry.aiTools = '网络搜索（商标+域名+社媒查询辅助）';
            } else if (dayNum === 14) { // Jun 18
                entry.tasks = [
                    { content: '准备命名终稿汇报：Top5+商标预查结论+推荐意见', type: '会议汇报', hours: 2 },
                    { content: '管理层命名评审会：陈述+答疑', type: '会议汇报', hours: 1.5 },
                    { content: '确定品牌主名称+备用名2-3个', type: '品牌创意', hours: 1 },
                    { content: '撰写《品牌命名终稿》', type: '内容产出', hours: 1.5 },
                    { content: '启动商标注册流程（委托合规部）', type: '归档整理', hours: 2 },
                ];
                entry.deliverables = '《品牌命名终稿》\n商标注册委托单';
                entry.kpis = '主名称确定/备用名≥2个/商标注册流程已启动';
                entry.collaborators = '管理层、合规部';
            } else if (dayNum === 15) { // Jun 19
                entry.tasks = [
                    { content: 'Slogan体系设计：主口号+用户端+商家端+社区端', type: '品牌创意', hours: 2.5 },
                    { content: 'Claude批量：每端出30条→各精选3条', type: '品牌创意', hours: 2 },
                    { content: '话语体系整合：核心表达+场景话术+品牌语调初稿', type: '内容产出', hours: 1.5 },
                    { content: '第3周成果汇总+周报', type: '归档整理', hours: 1 },
                    { content: '部门周会：汇报命名与话语体系', type: '会议汇报', hours: 1 },
                ];
                entry.deliverables = '《品牌话语体系与Slogan》初稿\n《周总结和周计划报告》';
                entry.kpis = 'Slogan≥120条/精选≥12条/覆盖4端/周报准时';
                entry.collaborators = '部门周会';
                entry.aiTools = 'Claude（Slogan批量生成+话语体系）';
            }
        }

        // ==================== 第4周 ====================
        else if (week === 4) {
            entry.phaseGroup = '第1月·品牌地基期';
            entry.phase = '战略总纲与月度汇报';

            if (dayNum === 16) { entry.tasks = [
                { content: '整合第1-3周成果：行业分析→定位→命名→话语体系', type: '策略规划', hours: 2 },
                { content: '战略总纲框架搭建：战略定义→战略逻辑→使命体系', type: '策略规划', hours: 2 },
                { content: 'Claude辅助：框架展开+逻辑串联', type: '策略规划', hours: 2 },
                { content: '品牌战略核心逻辑章节撰写', type: '内容产出', hours: 2 },
            ]; entry.deliverables = '《品牌战略总纲体系》50%'; entry.kpis = '战略定义清晰/4条战略逻辑完整'; entry.aiTools = 'Claude（文档展开+逻辑串联）'; }
            else if (dayNum === 17) { entry.tasks = [
                { content: '战略定位体系：定位→升级路径→竞争定位', type: '策略规划', hours: 2 },
                { content: '战略护城河体系：5大壁垒详述', type: '策略规划', hours: 2 },
                { content: '用户/商家/社区/增长/内容5大战略体系撰写', type: '内容产出', hours: 2.5 },
                { content: '全稿通读+逻辑审查，完成《品牌战略总纲体系V1.0》', type: '归档整理', hours: 1.5 },
            ]; entry.deliverables = '《品牌战略总纲体系V1.0》完整版'; entry.kpis = '≥10个模块/≥8000字/逻辑自检通过'; entry.aiTools = 'Claude（逻辑审查+漏洞修补）'; }
            else if (dayNum === 18) { entry.tasks = [
                { content: '与传统电商差异逐条论证', type: '策略规划', hours: 2 },
                { content: '与传统本地平台差异逐条论证', type: '策略规划', hours: 2 },
                { content: '与社区团购差异逐条论证', type: '策略规划', hours: 2 },
                { content: '差异化话术提炼（对外宣传用）', type: '品牌创意', hours: 2 },
            ]; entry.deliverables = '《品牌差异化战略说明》'; entry.kpis = '对比维度≥12条/反方辩驳通过/话术可对外'; entry.aiTools = 'Claude（差异论证+反方辩驳）'; }
            else if (dayNum === 19) { entry.tasks = [
                { content: '第1月全成果梳理：文档目录+版本号+关键结论', type: '归档整理', hours: 2 },
                { content: 'Claude辅助：1页纸月度摘要', type: '归档整理', hours: 1 },
                { content: '月度汇报PPT制作', type: '会议汇报', hours: 3 },
                { content: 'PPT预演+修改+材料归档', type: '会议汇报', hours: 2 },
            ]; entry.deliverables = '《第1月品牌地基成果包》\n月度汇报PPT'; entry.kpis = '文档≥15份/PPT≤15页/归档完整'; entry.collaborators = '管理层'; entry.aiTools = 'Claude+Notion AI'; }
            else if (dayNum === 20) { entry.tasks = [
                { content: '向管理层汇报第1月成果：战略总纲+定位+命名+差异化', type: '会议汇报', hours: 2.5 },
                { content: '收集反馈+记录决策事项', type: '会议汇报', hours: 1 },
                { content: '撰写《月度总结与下月计划》', type: '归档整理', hours: 2 },
                { content: '根据反馈调整第2月计划细节', type: '策略规划', hours: 1.5 },
                { content: '撰写《周总结和周计划报告》', type: '归档整理', hours: 1 },
            ]; entry.deliverables = '《月度总结与下月计划》\n管理层反馈记录'; entry.kpis = '汇报通过/反馈≤5条/第2月方向确认'; entry.collaborators = '管理层、部门主管'; entry.aiTools = 'Claude（月报+反馈响应）'; }
        }

        // ==================== 第5-8周占位（后续同结构展开，此处聚焦前两周细节） ====================
        else if (week === 5) {
            entry.phaseGroup = '第2月·品牌建设期'; entry.phase = '品牌视觉体系';
            if (dayNum === 21) { entry.tasks = [
                { content: '品牌气质关键词定义+视觉策略框架', type: '策略规划', hours: 2.5 },
                { content: '给设计师的《品牌视觉策略Brief》撰写', type: '视觉设计', hours: 2 },
                { content: 'MJ Prompt库准备：Logo方向×5组关键词', type: '视觉设计', hours: 2 },
                { content: '与设计师对齐视觉方向', type: '会议汇报', hours: 1.5 },
            ]; entry.deliverables = '《品牌视觉策略Brief》/MJ Prompt库'; entry.kpis = '气质关键词≥6个/Brief完整/MJ Prompt5组'; entry.collaborators = '设计师'; entry.aiTools = 'Claude+Midjourney'; }
            else if (dayNum === 22) { entry.tasks = [
                { content: 'MJ批量出图：5组Prompt×各10张=50+概念', type: '视觉设计', hours: 3 },
                { content: '概念初筛+分类归档→保留30张', type: '视觉设计', hours: 2 },
                { content: '精选每个方向Top3=15个优质概念', type: '视觉设计', hours: 2 },
                { content: '撰写《Logo概念方向稿》+设计师讨论', type: '会议汇报', hours: 1 },
            ]; entry.deliverables = '《Logo概念方向稿》'; entry.kpis = 'MJ≥50张/精选≥15张/5方向各3张'; entry.collaborators = '设计师'; entry.aiTools = 'Midjourney'; }
            else if (dayNum === 23) { entry.tasks = [
                { content: '超级符号设计：链环+定位点+微笑曲线结构定义', type: '视觉设计', hours: 2.5 },
                { content: '色彩体系：链生活蓝+温暖橙+辅助色系', type: '视觉设计', hours: 2 },
                { content: '字体体系+使用层级设计', type: '视觉设计', hours: 1.5 },
                { content: '《品牌视觉与超级符号体系手册》文字部分', type: '内容产出', hours: 2 },
            ]; entry.deliverables = '《视觉与超级符号体系手册》文字稿'; entry.kpis = '符号含义≥3层/色值≥6个/字体≥3组'; entry.aiTools = 'Claude（符号含义+色彩推理）'; }
            else if (dayNum === 24) { entry.tasks = [
                { content: '与设计师确定最终Logo方向', type: '会议汇报', hours: 1.5 },
                { content: 'Logo标准制图：网格规范+安全间距+最小尺寸', type: '视觉设计', hours: 2 },
                { content: '多版本制作：标准版/横版/竖版/反白版/图标版/简化版', type: '视觉设计', hours: 2.5 },
                { content: 'Logo使用禁止规范+源文件交付', type: '视觉设计', hours: 2 },
            ]; entry.deliverables = '《Logo标准规范文件》（含源文件）'; entry.kpis = 'Logo≥6版本/规范条目≥10条'; entry.collaborators = '设计师'; entry.aiTools = 'MJ（微调参考）'; }
            else if (dayNum === 25) { entry.tasks = [
                { content: '插画风格+摄影风格指南', type: '视觉设计', hours: 2 },
                { content: '辅助图形系统设计', type: '视觉设计', hours: 2 },
                { content: '视觉手册全稿整合定稿', type: '内容产出', hours: 2 },
                { content: '第5周成果汇总+周报+部门周会', type: '会议汇报', hours: 2 },
            ]; entry.deliverables = '《视觉与超级符号体系手册》完整版'; entry.kpis = '视觉手册完整度100%/Logo获批'; entry.collaborators = '设计师'; entry.aiTools = 'Claude+MJ'; }
        }
        else if (week === 6) {
            entry.phaseGroup = '第2月·品牌建设期'; entry.phase = '品牌内容体系';
            const w6Tasks = {
                26: [['品牌缘起+理念故事框架','品牌创意',2],['Claude出5版故事→精选1版深化','品牌创意',2],['品牌故事场景适配：官网/招商/融资/社区版','品牌创意',2],['撰写《品牌故事体系》','内容产出',2]],
                27: [['品牌人格定义+语调关键词体系','品牌创意',2],['分场景语调规范：客服/社群/招商/广告/公关','内容产出',2],['禁忌词库+正反示例撰写','内容产出',2],['撰写《品牌语调与文案规范》','内容产出',2]],
                28: [['官网首页文案：标题/价值主张/CTA/信任证据','内容产出',2.5],['"关于我们"+"商家合作"页面文案','内容产出',2.5],['用户权益页+社区服务页文案','内容产出',2],['《品牌核心页面文案》统稿','内容产出',1]],
                29: [['全页面文案统一性检查','归档整理',2],['内容策略制定：类型/渠道/节奏/选题','策略规划',2.5],['内容日历模板：月度→周→日','内容产出',2],['撰写《品牌内容策略与日历》','内容产出',1.5]],
                30: [['内容日历与文案组对齐','会议汇报',1.5],['文案规范同步企业宣传部全员','会议汇报',1],['内容资产归档知识库','归档整理',1.5],['第6周成果汇总+周报+部门周会','会议汇报',4]],
            };
            const d26 = dayNum - 26;
            if (w6Tasks[dayNum]) {
                entry.tasks = w6Tasks[dayNum].map(t => ({ content: t[0], type: t[1], hours: t[2] }));
            }
            if (dayNum === 26) { entry.deliverables = '《品牌故事体系》'; entry.kpis = '故事版本≥4个'; entry.aiTools = 'Claude'; }
            else if (dayNum === 27) { entry.deliverables = '《品牌语调与文案规范》'; entry.kpis = '语调维度≥8个/禁忌词≥30条'; entry.aiTools = 'Claude'; }
            else if (dayNum === 28) { entry.deliverables = '《品牌核心页面文案》50%'; entry.kpis = '首页文案≥5模块'; entry.aiTools = 'Claude'; }
            else if (dayNum === 29) { entry.deliverables = '《品牌核心页面文案》终稿+《品牌内容策略与日历》'; entry.kpis = '页面≥8个/内容日历≥30天'; entry.aiTools = 'Claude'; }
            else if (dayNum === 30) { entry.deliverables = '品牌内容资产包+周报'; entry.kpis = '4份文档交付/周报准时'; entry.collaborators = '文案组'; entry.aiTools = 'Claude+Notion AI'; }
        }
        else if (week === 7) {
            entry.phaseGroup = '第2月·品牌建设期'; entry.phase = '商业模式与招商体系';
            const w7d = {
                31: { tasks: [['收入结构设计：5大板块定价逻辑','商业模型',2.5],['服务费结算机制：试跑→增长→长期阶梯模型','商业模型',2.5],['会员体系设计：等级/权益/盈利逻辑','商业模型',2],['撰写《商业模式说明》','内容产出',1]], dlv: '《商业模式说明》初稿', kpi: '收入≥5板块/服务费结算3阶段/会员≥4级', collab: '财务部', ai: 'Claude' },
                32: { tasks: [['招商核心定位+目标对象定义','策略规划',2],['重点行业筛选：餐饮/生鲜/家政/美业/教育/亲子/维修/健康','策略规划',2],['招商转化路径+核心竞争力梳理','策略规划',2],['撰写《招商战略体系》','内容产出',2]], dlv: '《招商战略体系》', kpi: '目标行业≥8个/转化路径≥6步', ai: 'Claude' },
                33: { tasks: [['通用版招商手册撰写','内容产出',3],['餐饮行业定制版招商手册','内容产出',2],['家政+美业定制版撰写','内容产出',2],['三版交叉比对口径一致','归档整理',1]], dlv: '《招商手册》×4版', kpi: '手册≥4版/FAQ≥15条/口径一致', ai: 'Claude' },
                34: { tasks: [['商家全生命周期流程：8阶段设计','策略规划',2.5],['每阶段动作清单+话术+验收标准','内容产出',2.5],['商家准入评分表+评级体系','商业模型',2],['撰写《商家合作SOP》','内容产出',1]], dlv: '《商家合作SOP》', kpi: '流程≥8阶段/评分≥5维度/评级ABCD', ai: 'Claude' },
                35: { tasks: [['商业模式+招商+SOP三文档逻辑闭环检查','归档整理',2],['合规部审核招商话术边界','会议汇报',1.5],['三文档终稿修订','内容产出',1.5],['第7周成果汇总+周报+部门周会','会议汇报',3]], dlv: '商业体系3文档定稿+周报', kpi: '逻辑闭环/合规通过/周报准时', collab: '合规部', ai: 'Claude' },
            };
            if (w7d[dayNum]) {
                entry.tasks = w7d[dayNum].tasks.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = w7d[dayNum].dlv; entry.kpis = w7d[dayNum].kpi;
                entry.collaborators = w7d[dayNum].collab || ''; entry.aiTools = w7d[dayNum].ai || '';
            }
        }
        else if (week === 8) {
            entry.phaseGroup = '第2月·品牌建设期'; entry.phase = '品牌全案整合与月报';
            const w8d = {
                36: { tasks: [['梳理第1-2月全部产出物目录','归档整理',2.5],['建立全案目录树：模块→文档→版本→状态','归档整理',2],['文档版本+命名规范统一','归档整理',2],['标注各文档间引用关系','归档整理',1.5]], dlv: '《品牌全案体系目录》', kpi: '目录覆盖全部文档/版本统一/引用清晰', ai: 'Claude' },
                37: { tasks: [['逻辑闭环检查：战略→定位→视觉→内容→招商','归档整理',2.5],['逐链审查：前提→结论→证据','归档整理',2.5],['缺口清单整理+逐项补足','内容产出',2],['撰写《品牌体系完整性自查表》','归档整理',1]], dlv: '《品牌体系完整性自查表》+补足文档', kpi: '审查链≥20条/缺口≤5个/评分≥85', ai: 'Claude' },
                38: { tasks: [['第2月全成果梳理+1页纸摘要','归档整理',2],['月度汇报PPT制作（含视觉成果展示）','会议汇报',3],['PPT预演+修改','会议汇报',2],['全部成果归档品牌知识库','归档整理',1]], dlv: '《第2月品牌全案成果包》+月度PPT', kpi: '新增文档≥15份/PPT≤20页', collab: '管理层', ai: 'Claude+Notion AI' },
                39: { tasks: [['向管理层汇报第2月成果','会议汇报',2.5],['展示品牌全案完整度+逻辑闭环','会议汇报',1.5],['收集反馈+确认第3月方向','会议汇报',1],['撰写《月度总结与下月计划》','归档整理',2],['品牌全案阶段性归档','归档整理',1]], dlv: '《月度总结与下月计划》+反馈记录', kpi: '汇报通过/反馈≤3条/体系完整度≥90%', collab: '管理层', ai: 'Claude' },
                40: { tasks: [['根据反馈微调品牌体系','内容产出',2],['第3月详细计划确认','策略规划',1.5],['跨部门协作排期（设计师/视频/数字化）','会议汇报',2],['第8周成果汇总+周报+部门周会','会议汇报',2.5]], dlv: '《周总结和周计划报告》+排期表', kpi: '调整完成/排期确认/周报准时', collab: '设计师/视频组/数字化中心', ai: 'Claude' },
            };
            if (w8d[dayNum]) {
                entry.tasks = w8d[dayNum].tasks.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = w8d[dayNum].dlv; entry.kpis = w8d[dayNum].kpi;
                entry.collaborators = w8d[dayNum].collab || ''; entry.aiTools = w8d[dayNum].ai || '';
            }
        }

        // ==================== 第9-13周 (精简但完整) ====================
        else if (week === 9) {
            entry.phaseGroup = '第3月·品牌交付期'; entry.phase = '落地执行文件';
            const d = {
                41: { t: [['样板社区定义+选择原则','策略规划',2],['硬性准入门槛6条设计','策略规划',2],['100分制评分模型：7维度','策略规划',2],['撰写《样板社区选择标准》','内容产出',2]], dlv: '《样板社区选择标准》', kpi: '硬性门槛≥6条/评分维度≥7个/100分制', ai: 'Claude' },
                42: { t: [['冷启动4阶段设计','策略规划',2],['D1-D14逐日动作设计','内容产出',3],['每阶段判断标准+数据指标','商业模型',2],['文档进度50%','内容产出',1]], dlv: '《30天冷启动动作表》50%', kpi: '每天≥4条动作/验收标准量化', ai: 'Claude' },
                43: { t: [['D15-D30逐日动作设计','内容产出',2.5],['商家招募话术+合作方案','内容产出',2],['首场社区福利活动方案','内容产出',1.5],['全表逻辑审查+撰完完整版','归档整理',2]], dlv: '《30天冷启动动作表》完整版', kpi: '30天每天≥4条/数据指标≥5个', ai: 'Claude' },
                44: { t: [['核心参数假设表设计','商业模型',2],['收入结构模型：5板块','商业模型',2],['成本结构+3情景测算','商业模型',2.5],['撰写《单社区财务模型》','内容产出',1.5]], dlv: '《单社区财务模型》', kpi: '参数≥15项/收入≥5项/3情景完整', collab: '财务部', ai: 'Claude' },
                45: { t: [['服务商准入标准6维度','策略规划',2],['授权等级5级体系','策略规划',1.5],['培训认证+绩效考核+KPI','商业模型',2],['撰写《城市服务商管理办法》+周报','内容产出',2.5]], dlv: '《城市服务商管理办法》+周报', kpi: '授权≥5级/考核≥6维度/KPI≥15项', ai: 'Claude' },
            };
            if (d[dayNum]) {
                entry.tasks = d[dayNum].t.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = d[dayNum].dlv; entry.kpis = d[dayNum].kpi;
                entry.collaborators = d[dayNum].collab || ''; entry.aiTools = d[dayNum].ai || '';
            }
        }
        else if (week === 10) {
            entry.phaseGroup = '第3月·品牌交付期'; entry.phase = '融资路演材料';
            const d = {
                46: { t: [['白皮书框架+Part01-06撰写','内容产出',4],['排版风格确定','内容产出',1],['进度50%','内容产出',3]], dlv: '《商业生态白皮书》50%', kpi: '完成6Part/每Part≥2000字', ai: 'Claude' },
                47: { t: [['Part07-15撰写','内容产出',3.5],['全稿逻辑审查+图表补充','归档整理',2],['终审：逻辑一致性+数据验证','归档整理',1.5],['撰完《商业生态白皮书V1.0》','内容产出',1]], dlv: '《商业生态白皮书V1.0》', kpi: '≥15Part/≥20000字/图表≥8张', ai: 'Claude' },
                48: { t: [['BP逻辑线设计','策略规划',2],['每页核心信息+数据支撑','内容产出',2.5],['Gamma AI生成PPT初稿','内容产出',2],['与设计师对接美化需求','会议汇报',1.5]], dlv: '《融资路演BP》内容版+视觉版初稿', kpi: 'BP≤15页/每页≤3条信息/数据有来源', collab: '设计师', ai: 'Claude+Gamma' },
                49: { t: [['BP内容修改+设计师美化','内容产出',2],['BP宣讲演练','会议汇报',2],['招商手册Canva AI设计稿','视觉设计',2],['BP+招商手册终稿','归档整理',2]], dlv: '《BP》终稿+《招商手册》设计版', kpi: '两份文档可对外使用', collab: '设计师', ai: 'Gamma+Canva AI' },
                50: { t: [['路演材料包汇总统一','归档整理',2],['对外视觉一致性检查','归档整理',1.5],['路演话术3版本撰写','内容产出',2.5],['第10周成果汇总+周报+部门周会','会议汇报',2]], dlv: '路演材料包+路演话术3版+周报', kpi: '材料≥4份/话术≥3版/视觉统一/周报准时', ai: 'Claude' },
            };
            if (d[dayNum]) {
                entry.tasks = d[dayNum].t.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = d[dayNum].dlv; entry.kpis = d[dayNum].kpi;
                entry.collaborators = d[dayNum].collab || ''; entry.aiTools = d[dayNum].ai || '';
            }
        }
        else if (week === 11) {
            entry.phaseGroup = '第3月·品牌交付期'; entry.phase = '品牌物料与PRD';
            const d = {
                51: { t: [['物料清单设计：7种物料','视觉设计',2],['MJ出每种物料视觉概念','视觉设计',2.5],['物料文案撰写','内容产出',2],['设计师制作设计稿','视觉设计',1.5]], dlv: '《社区线下物料包》50%', kpi: '物料≥7种/每种≥2版/印刷规格完整', collab: '设计师', ai: 'MJ+Claude+Canva' },
                52: { t: [['物料审核修改+定稿','视觉设计',2.5],['社媒素材清单+Canva批量生成模板','视觉设计',2.5],['剪映AI：视频片头/片尾模板','内容产出',2],['《社媒视觉素材库》打包','归档整理',1]], dlv: '《社区线下物料包》终稿+《社媒视觉素材库》', kpi: '社媒模板≥15个/视频模板≥5个', collab: '设计师/视频组', ai: 'Canva+剪映AI' },
                53: { t: [['小程序功能架构设计','产品需求',2.5],['页面流程图：用户+商家+服务商端','产品需求',2.5],['数据需求+非功能需求','产品需求',2],['撰写《产品需求文档PRD》','内容产出',1]], dlv: '《产品需求文档PRD》', kpi: '功能≥8个/页面≥20个/数据≥15项/可开发', collab: '数字化中心', ai: 'Claude' },
                54: { t: [['Logo使用规范条目','内容产出',2],['色彩+字体使用规范','内容产出',2],['物料模板规范（海报/名片/PPT/邮件）','内容产出',2],['合规部审核+终稿','会议汇报',2]], dlv: '《品牌使用规范手册》', kpi: '规范≥50条/禁止示例≥20个/模板≥10个', collab: '合规部', ai: 'Claude' },
                55: { t: [['链宝IP概念设计+MJ出图','视觉设计',2.5],['IP应用延展：表情包/导视/物料','视觉设计',2],['设计师精修','视觉设计',1.5],['第11周成果汇总+周报+部门周会','会议汇报',2]], dlv: '链宝IP初稿+周报', kpi: 'IP≥3方向/MJ≥20张/周报准时', collab: '设计师', ai: 'MJ+Claude' },
            };
            if (d[dayNum]) {
                entry.tasks = d[dayNum].t.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = d[dayNum].dlv; entry.kpis = d[dayNum].kpi;
                entry.collaborators = d[dayNum].collab || ''; entry.aiTools = d[dayNum].ai || '';
            }
        }
        else if (week === 12) {
            entry.phaseGroup = '第3月·品牌交付期'; entry.phase = '总结归档与交接';
            const d = {
                56: { t: [['全案产出物汇总清点','归档整理',2.5],['版本终审统一','归档整理',2],['缺失项最后补足','内容产出',2],['撰写《品牌全案最终目录》','归档整理',1.5]], dlv: '《品牌全案最终目录》+全案文档包', kpi: '文档≥40份/零缺失/版本统一', ai: 'Claude' },
                57: { t: [['Notion AI品牌知识库架构设计','归档整理',2.5],['全部文档导入+分类+标签','归档整理',3],['权限设置+使用指南撰写','归档整理',1.5],['知识库正式上线','归档整理',1]], dlv: 'Notion品牌资产知识库+使用指南', kpi: '模块≥8个/覆盖率100%/引用≥30条', ai: 'Notion AI' },
                58: { t: [['三个月成果回顾+数据整理','归档整理',2.5],['AI辅助品牌建设方法论总结','归档整理',2.5],['问题反思+经验教训','归档整理',1.5],['撰写《试用期述职报告》','内容产出',1.5]], dlv: '《试用期述职报告》', kpi: '成果数据完整/方法论可复制/反思≥3条', ai: 'Claude' },
                59: { t: [['终期汇报PPT制作+预演','会议汇报',3],['品牌工作交接文档撰写','归档整理',2.5],['部门协作机制建立','会议汇报',1.5],['撰写《品牌工作交接与协作手册》','归档整理',1]], dlv: '终期汇报PPT+《交接与协作手册》', kpi: 'PPT≤20页/交接覆盖全部/机制可执行', collab: '部门全员', ai: 'Claude' },
                60: { t: [['向管理层终期述职汇报','会议汇报',2.5],['品牌全案成果展示','会议汇报',1.5],['人事部转正评估面谈','会议汇报',1.5],['全部文档三备份最终归档','归档整理',2],['撰写最终版工作总结','归档整理',0.5]], dlv: '终期汇报通过+转正评估表+全归档', kpi: '汇报通过/转正获批/归档100%/主管≥85', collab: '管理层/人事部/部门主管' },
            };
            if (d[dayNum]) {
                entry.tasks = d[dayNum].t.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = d[dayNum].dlv; entry.kpis = d[dayNum].kpi;
                entry.collaborators = d[dayNum].collab || ''; entry.aiTools = d[dayNum].ai || '';
            }
        }
        else if (week === 13) {
            entry.phaseGroup = '第3月·品牌交付期'; entry.phase = '缓冲补足与转正收尾';
            const d = {
                61: { t: [['清点全部交付物完成状态','归档整理',2],['优先补齐遗漏或未达标项','内容产出',3],['文档终版修订与版本锁定','归档整理',2],['品牌知识库最后更新','归档整理',1]], dlv: '补足文档+知识库终版', kpi: '交付物清单100%完成/知识库终版上线', ai: 'Claude+Notion AI' },
                62: { t: [['述职报告根据主管预审意见修订','归档整理',2.5],['转正申请材料准备','归档整理',2],['三个月产出物最终盘点','归档整理',1.5],['撰写《品牌建设AI方法论总结》','归档整理',2]], dlv: '《述职报告》终稿+《AI方法论总结》', kpi: '主管预审通过/方法论可复制', collab: '部门主管', ai: 'Claude' },
                63: { t: [['终期汇报PPT最终修改','会议汇报',2],['汇报预演：至少2轮完整演练','会议汇报',3],['时间控制：目标20分钟','会议汇报',1],['逐模块交接确认+撰写《交接确认签字表》','归档整理',2]], dlv: '终期PPT终稿+《交接确认签字表》', kpi: '预演≥2轮/≤20分钟/100%交接确认', collab: '部门全员' },
                64: { t: [['向管理层终期述职汇报（正式）','会议汇报',2.5],['品牌全案成果展示+现场答疑','会议汇报',2],['人事部转正评估面谈','会议汇报',1.5],['提交转正申请材料+记录管理层评价','归档整理',2]], dlv: '终期汇报完成+转正评估表+评价记录', kpi: '汇报通过/管理层≥85/转正提交', collab: '管理层/人事部/部门主管' },
                65: { t: [['全部文档三备份归档确认','归档整理',2.5],['知识库关闭编辑权限进入维护模式','归档整理',1.5],['与部门主管试用期回顾面谈','会议汇报',1.5],['确认转正后工作方向与目标','会议汇报',1.5],['试用期结束：进入正式工作阶段','归档整理',1]], dlv: '三备份归档+《试用期工作总结》+转正后计划', kpi: '归档100%/三备份确认/转正后方向明确', collab: '部门主管' },
            };
            if (d[dayNum]) {
                entry.tasks = d[dayNum].t.map(t => ({ content: t[0], type: t[1], hours: t[2] }));
                entry.deliverables = d[dayNum].dlv; entry.kpis = d[dayNum].kpi;
                entry.collaborators = d[dayNum].collab || ''; entry.aiTools = d[dayNum].ai || '';
            }
        }

        plan.push(entry);
    }
    return plan;
}

// ============================================================
// 构建 Excel
// ============================================================
function buildExcel() {
    const preWork = getPreWorkData();
    const planDays = generatePlanDays();
    const allDays = [...preWork.map((pw, i) => {
        // convert pre-work to unified format
        return {
            dayNum: -(preWork.length - i),
            date: pw.date,
            week: 0,
            dayOfWeek: pw.dayOfWeek,
            phase: pw.phase,
            phaseGroup: '',
            tasks: pw.tasks,
            deliverables: pw.deliverables,
            kpis: pw.kpis,
            collaborators: pw.collab || '',
            aiTools: pw.ai || '',
        };
    }), ...planDays];

    // ======== Sheet 1: 每日工作计划（含色条） ========
    const header1 = ['序号','日期','周','星期','阶段','当日主题',
        '任务内容','工作类型','工时(h)','色条',
        '交付物','KPI指标','协作方','AI工具'];
    const rows1 = [header1];

    for (const day of allDays) {
        const tasks = day.tasks || [];
        const totalHours = tasks.reduce((s, t) => s + (t.hours || 0), 0);
        const firstRow = true;
        for (let i = 0; i < Math.max(tasks.length, 1); i++) {
            const t = tasks[i] || { content: '', type: '', hours: 0 };
            const colorHex = WORK_COLORS[t.type] ? WORK_COLORS[t.type].fill : 'CCCCCC';
            // 色条：用 █ 字符 + 颜色标注
            const barLen = Math.max(1, Math.round((t.hours || 0) / 8 * 40));
            const colorBar = '█'.repeat(barLen) + ' ' + (t.hours || '') + 'h';

            if (i === 0) {
                rows1.push([
                    day.dayNum, day.date,
                    day.week === 0 ? '前期' : `第${day.week}周`,
                    day.dayOfWeek, day.phase,
                    firstRow ? (day.taskTheme || '') : '',
                    t.content, t.type, t.hours || '',
                    colorBar,
                    day.deliverables || '', day.kpis || '',
                    day.collaborators || '', day.aiTools || ''
                ]);
            } else {
                rows1.push(['','','','','','',
                    t.content, t.type, t.hours || '', colorBar,
                    '','','','']);
            }
        }
    }

    // ======== Sheet 2: 甘特图/时间轴 ========
    // 构建甘特图：Y轴=工作流，X轴=周
    const streams = [
        { name: '调研分析', key: '调研分析', color: '3498DB' },
        { name: '策略规划', key: '策略规划', color: '2C3E50' },
        { name: '品牌创意', key: '品牌创意', color: '8E44AD' },
        { name: '视觉设计', key: '视觉设计', color: 'E67E22' },
        { name: '内容产出', key: '内容产出', color: '27AE60' },
        { name: '商业模型', key: '商业模型', color: 'E74C3C' },
        { name: '会议汇报', key: '会议汇报', color: '7F8C8D' },
        { name: '归档整理', key: '归档整理', color: '1ABC9C' },
        { name: '产品需求', key: '产品需求', color: 'D35400' },
    ];

    const ganttHeader = ['工作流', '色标'];
    // 前期周 + 13个计划周
    const preWeekLabel = '前期\n5/19-5/29';
    const weekLabels = [preWeekLabel];
    for (let w = 1; w <= 13; w++) {
        weekLabels.push(`第${w}周`);
    }
    ganttHeader.push(...weekLabels);
    const ganttRows = [ganttHeader];

    // 统计每周各类工作的总时长
    const streamWeekHours = {};
    for (const s of streams) {
        streamWeekHours[s.key] = {};
        for (let w = 0; w <= 13; w++) {
            streamWeekHours[s.key][w] = 0;
        }
    }

    for (const day of allDays) {
        const w = day.week; // 0=前期, 1-13=计划周
        for (const t of (day.tasks || [])) {
            if (streamWeekHours[t.type]) {
                streamWeekHours[t.type][w] = (streamWeekHours[t.type][w] || 0) + (t.hours || 0);
            }
        }
    }

    for (const s of streams) {
        const row = [s.name, ''];
        for (let w = 0; w <= 13; w++) {
            const hours = streamWeekHours[s.key][w] || 0;
            // 用 █ 表示密度：每2小时一个方块，最多40h=20方块
            const blocks = Math.min(20, Math.round(hours / 2));
            row.push(hours > 0 ? '█'.repeat(Math.max(1, blocks)) : '');
        }
        ganttRows.push(row);
    }

    // ======== Sheet 3: 周度汇总 ========
    const wh = ['周次','日期范围','阶段','本周主题','核心产出','关键指标','协作部门','AI工具'];
    const wr = [wh];
    const weekThemes = {
        0: { theme: '项目熟悉+概念探索', output: '培训总结/命名策划/赛道分析/概念设计/品牌体系雏形', kpis: '品牌体系7份核心文档/概念方案3版/赛道覆盖10+平台', collab: '教培部/管理层/合规部/设计师', ai: 'Claude+MJ（多线并行）' },
        1: { theme: '赛道调研与竞品分析', output: '行业数据/竞品矩阵/三方痛点图谱/市场机会报告', kpis: '5份调研文档/覆盖10+平台/差异化空间明确', collab: '部门主管', ai: 'Claude' },
        2: { theme: '品牌定位与战略模型', output: '定位方案3版/战略模型/使命愿景价值观/定位手册终稿', kpis: '定位获批/战略模型完整/管理层认可', collab: '管理层', ai: 'Claude' },
        3: { theme: '品牌命名与商标预查', output: '命名策略/候选Top20/商标预查报告/命名终稿/Slogan体系', kpis: '命名获批/商标可用/注册启动', collab: '合规部/管理层', ai: 'Claude+网络搜索' },
        4: { theme: '战略总纲与月度汇报', output: '战略总纲体系/差异化论证/首月成果包', kpis: '战略≥8000字/差异化通过/月度汇报通过', collab: '管理层', ai: 'Claude+Notion AI' },
        5: { theme: '品牌视觉体系', output: '视觉策略Brief/Logo概念稿/超级符号手册/Logo规范文件', kpis: 'Logo获批/视觉手册完整/Logo≥6版本', collab: '设计师', ai: 'MJ+Claude' },
        6: { theme: '品牌内容体系', output: '品牌故事/语调指南/核心文案/内容策略日历', kpis: '4份文档交付/文案一致性通过/日历≥30天', collab: '文案组', ai: 'Claude' },
        7: { theme: '商业模式与招商体系', output: '商业模式说明/招商战略/招商手册×4/商家SOP', kpis: '商业逻辑闭环/合规通过/招商手册4版', collab: '财务部/合规部', ai: 'Claude' },
        8: { theme: '品牌全案整合与月报', output: '全案目录/完整性自查/缺口补足/第2月成果包', kpis: '体系完整度≥90%/缺口≤5个/月度汇报通过', collab: '管理层', ai: 'Claude+Notion AI' },
        9: { theme: '落地执行文件', output: '样板社区标准/30天冷启动/财务模型/服务商管理办法', kpis: '4份执行文档/可直接用于试点', collab: '财务部', ai: 'Claude' },
        10: { theme: '融资路演材料', output: '白皮书/融资BP/招商手册设计版/路演话术', kpis: '白皮书≥20000字/BP≤15页/对外统一', collab: '设计师', ai: 'Claude+Gamma+Canva' },
        11: { theme: '品牌物料与PRD', output: '社区物料包/社媒素材库/PRD/品牌规范手册/链宝IP', kpis: '物料≥7种/社媒模板≥15个/PRD可开发', collab: '设计师/视频组/数字化中心', ai: 'MJ+Canva+剪映+Claude' },
        12: { theme: '总结归档与交接', output: '全案目录/知识库/述职报告/交接手册/终期汇报', kpis: '文档≥40份/归档100%/转正获批', collab: '管理层/人事部/部门全员', ai: 'Claude+Notion AI' },
        13: { theme: '缓冲补足与转正收尾', output: '述职终稿/交接确认/终期汇报/转正评估/三备份归档', kpis: '100%完成/汇报通过/转正获批/三备份', collab: '管理层/人事部/部门主管', ai: 'Claude+Notion AI' },
    };

    for (let w = 0; w <= 13; w++) {
        const info = weekThemes[w];
        const weekDays = allDays.filter(d => d.week === w);
        const dateRange = weekDays.length > 0 ?
            `${weekDays[0].date} ~ ${weekDays[weekDays.length-1].date}` : '';
        const phaseLabel = w === 0 ? '前期·项目启动' :
            (w <= 4 ? '第1月·品牌地基期' : (w <= 8 ? '第2月·品牌建设期' : '第3月·品牌交付期'));
        const weekLabel = w === 0 ? '前期' : `第${w}周`;
        wr.push([weekLabel, dateRange, phaseLabel, info.theme, info.output, info.kpis, info.collab, info.ai]);
    }

    // ======== Sheet 4: 月度里程碑 ========
    const mh = ['月份','阶段','核心目标','关键里程碑','交付物数量','考核标准','AI工具','协作部门'];
    const mr = [mh];
    mr.push(['前期\n(5/19-5/29)', '项目启动期',
        '快速熟悉项目、产出品牌体系雏形、探索3版概念方案',
        '5/19-20: 培训+母公司调研\n5/21-23: 命名+赛道+营销目标\n5/25-26: 旺店链+火星链概念\n5/27-29: 链生活体系成型',
        '≥20份文档',
        '品牌体系7份核心文档/概念方案3版/赛道覆盖10+平台',
        'Claude+MJ（多线并行）', '教培部/管理层/合规部/设计师']);
    mr.push(['第1个月\n(6/1-6/26)', '品牌地基期',
        '确定品牌战略方向、完成命名与商标预查、输出战略总纲',
        'W1: 赛道全景分析\nW2: 品牌定位获批\nW3: 品牌命名确定\nW4: 战略总纲+月报',
        '≥15份文档',
        '战略方向管理层确认/商标预查通过/定位手册完整度100%',
        'Claude（深度推理+文档展开+内容量产）', '管理层/部门主管/合规部']);
    mr.push(['第2个月\n(6/29-7/24)', '品牌建设期',
        '完成品牌视觉体系、内容体系、商业模式、招商体系全案',
        'W5: Logo定型+视觉手册\nW6: 内容体系4件套\nW7: 商业模式+招商体系\nW8: 全案整合+月报',
        '≥15份文档',
        '品牌体系完整度≥90%/Logo获批/招商手册可对外/合规审查通过',
        'Claude+MJ+Canva+Notion AI', '设计师/文案组/财务部/合规部']);
    mr.push(['第3个月\n(7/27-8/28)', '品牌交付期',
        '完成落地执行文件、融资路演材料、全套物料，实现品牌从纸面到可执行',
        'W9: 执行文件4件套\nW10: 白皮书+BP+路演\nW11: 物料包+PRD+品牌规范\nW12-13: 全案归档+述职+转正',
        '≥15份文档',
        '全案文档≥40份/BP可对外路演/PRD可开发/知识库上线/转正获批',
        'Claude+MJ+Canva+Gamma+剪映+Notion AI', '管理层/人事部/设计师/视频组/数字化中心/合规部']);

    // ======== Sheet 5: 交付物清单 ========
    const dh = ['序号','交付物名称','所属阶段','计划完成','文件类型','协作方','状态'];
    const dr = [dh];
    const deliverables = [
        // 前期
        [1,'链商项目培训总结','前期','5/19','Word','—','✅ 已完成'],
        [2,'母公司体系架构认知总结','前期','5/20','Word','—','✅ 已完成'],
        [3,'新品牌命名策划','前期','5/21','Word','—','✅ 已完成'],
        [4,'链商品牌手册优化建议','前期','5/21','Word','—','✅ 已完成'],
        [5,'"链商"注册可行性分析','前期','5/21','Word','合规部','✅ 已完成'],
        [6,'新品牌平台构思','前期','5/22','Word','—','✅ 已完成'],
        [7,'本地生活赛道对比分析','前期','5/22','Word','—','✅ 已完成'],
        [8,'链商品牌营销工作目标分解表','前期','5/23','Word','—','✅ 已完成'],
        [9,'品牌营销预算框架','前期','5/23','Word','—','✅ 已完成'],
        [10,'旺店链概念设计（方案A+B）','前期','5/25','PNG/Word','设计师','✅ 已完成'],
        [11,'新品牌命名核心元素体系','前期','5/25','Word','—','✅ 已完成'],
        [12,'Slogan制定方法+分类范例','前期','5/25','Word','—','✅ 已完成'],
        [13,'链商品牌手册V2.2','前期','5/26','Word','—','✅ 已完成'],
        [14,'火星链概念设计+Logo','前期','5/26','PNG/Word','设计师','✅ 已完成'],
        [15,'链商宣传海报文案×3版','前期','5/26','Word','—','✅ 已完成'],
        [16,'母公司&链商平台运营方组织架构','前期','5/27','Word','—','✅ 已完成'],
        [17,'链商资源与协作机制','前期','5/27','Word','跨部门','✅ 已完成'],
        [18,'链生活概念设计方案','前期','5/27','Word','—','✅ 已完成'],
        [19,'链生活品牌定位体系战略手册','前期','5/28','Word','—','✅ 已完成'],
        [20,'链生活品牌战略总纲体系','前期','5/28','Word','—','✅ 已完成'],
        [21,'链生活品牌视觉与超级符号体系手册','前期','5/28','Word','—','✅ 已完成'],
        [22,'链生活商业模式说明','前期','5/28','Word','—','✅ 已完成'],
        [23,'链生活服务费结算机制与会员体系','前期','5/28','Word','—','✅ 已完成'],
        [24,'链生活品牌策略与营销落地方案','前期','5/28','Word','—','✅ 已完成'],
        [25,'链生活战略升级与护城河体系','前期','5/28','Word','—','✅ 已完成'],
        [26,'链生活30天冷启动动作表','前期','5/29','Word','—','✅ 已完成'],
        [27,'链生活样板社区选择标准','前期','5/29','Word','—','✅ 已完成'],
        [28,'链生活城市服务商管理办法','前期','5/29','Word','—','✅ 已完成'],
        [29,'链生活单社区财务模型','前期','5/29','Excel','财务部','✅ 已完成'],
        [30,'链生活集团顶层设计全集','前期','5/29','Word','—','✅ 已完成'],
        [31,'链生活商业生态白皮书','前期','5/29','Word','—','✅ 已完成'],
        [32,'链生活融资路演BP','前期','5/29','PDF','—','✅ 已完成'],
        [33,'链生活城市服务商招商手册','前期','5/29','Word','—','✅ 已完成'],
        // 第1月
        [34,'3个月工作计划表','第1月','W1','Excel','人事部','⏳ 待完成'],
        [35,'行业基础数据汇总','第1月','W1','Word','—','⏳ 待完成'],
        [36,'竞品矩阵对比表（含UE模型）','第1月','W1','Word','—','⏳ 待完成'],
        [37,'三方痛点与机会图谱','第1月','W1','Word','—','⏳ 待完成'],
        [38,'市场机会与可行性报告','第1月','W1','Word','—','⏳ 待完成'],
        [39,'品牌定位3方案对比','第1月','W2','Word','—','⏳ 待完成'],
        [40,'品牌战略模型图','第1月','W2','Word','—','⏳ 待完成'],
        [41,'品牌使命愿景价值观V1.0','第1月','W2','Word','—','⏳ 待完成'],
        [42,'品牌定位体系战略手册（新品牌）','第1月','W2','Word','管理层','⏳ 待完成'],
        [43,'品牌命名策略与标准','第1月','W3','Word','—','⏳ 待完成'],
        [44,'候选名称Top20','第1月','W3','Word','—','⏳ 待完成'],
        [45,'商标预查报告','第1月','W3','Word','合规部','⏳ 待完成'],
        [46,'品牌命名终稿','第1月','W3','Word','管理层','⏳ 待完成'],
        [47,'品牌话语体系与Slogan','第1月','W3-W4','Word','—','⏳ 待完成'],
        [48,'品牌战略总纲体系V1.0（新品牌）','第1月','W4','Word','—','⏳ 待完成'],
        [49,'品牌差异化战略说明','第1月','W4','Word','—','⏳ 待完成'],
        [50,'第1月品牌地基成果包','第1月','W4','文件夹','管理层','⏳ 待完成'],
        // 第2月
        [51,'品牌视觉策略Brief','第2月','W5','Word','设计师','⏳ 待完成'],
        [52,'Logo概念方向稿（MJ）','第2月','W5','PDF/PNG','设计师','⏳ 待完成'],
        [53,'品牌视觉与超级符号体系手册（新品牌）','第2月','W5','Word','设计师','⏳ 待完成'],
        [54,'Logo标准规范文件（含源文件）','第2月','W5','AI/PNG/PDF','设计师','⏳ 待完成'],
        [55,'品牌故事体系','第2月','W6','Word','—','⏳ 待完成'],
        [56,'品牌语调与文案规范','第2月','W6','Word','文案组','⏳ 待完成'],
        [57,'品牌核心页面文案','第2月','W6','Word','—','⏳ 待完成'],
        [58,'品牌内容策略与日历','第2月','W6','Word','文案组','⏳ 待完成'],
        [59,'商业模式说明（新品牌）','第2月','W7','Word','财务部','⏳ 待完成'],
        [60,'招商战略体系','第2月','W7','Word','—','⏳ 待完成'],
        [61,'招商手册（通用版+行业版×3）','第2月','W7','Word','合规部','⏳ 待完成'],
        [62,'商家合作SOP','第2月','W7','Word','—','⏳ 待完成'],
        [63,'品牌全案体系目录','第2月','W8','Word','—','⏳ 待完成'],
        [64,'品牌体系完整性自查表','第2月','W8','Word','—','⏳ 待完成'],
        [65,'第2月品牌全案成果包','第2月','W8','文件夹','管理层','⏳ 待完成'],
        // 第3月
        [66,'样板社区选择标准（新品牌）','第3月','W9','Word','—','⏳ 待完成'],
        [67,'30天冷启动动作表（新品牌）','第3月','W9','Word','—','⏳ 待完成'],
        [68,'单社区财务模型（新品牌）','第3月','W9','Excel','财务部','⏳ 待完成'],
        [69,'城市服务商管理办法（新品牌）','第3月','W9','Word','—','⏳ 待完成'],
        [70,'商业生态白皮书（新品牌V1.0）','第3月','W10','Word/PDF','—','⏳ 待完成'],
        [71,'融资路演BP（内容版+视觉版）','第3月','W10','PPT/PDF','设计师','⏳ 待完成'],
        [72,'路演话术（3版本）','第3月','W10','Word','—','⏳ 待完成'],
        [73,'社区线下物料包','第3月','W11','AI/PNG/PDF','设计师','⏳ 待完成'],
        [74,'社媒视觉素材库','第3月','W11','PSD/PNG/MP4','设计师/视频组','⏳ 待完成'],
        [75,'产品需求文档PRD','第3月','W11','Word','数字化中心','⏳ 待完成'],
        [76,'品牌使用规范手册','第3月','W11','Word/PDF','合规部','⏳ 待完成'],
        [77,'链宝IP初稿','第3月','W11','AI/PNG','设计师','⏳ 待完成'],
        [78,'品牌全案最终目录','第3月','W12','Word','—','⏳ 待完成'],
        [79,'Notion品牌资产知识库','第3月','W12','Notion','部门全员','⏳ 待完成'],
        [80,'试用期述职报告','第3月','W12-W13','Word','人事部','⏳ 待完成'],
        [81,'品牌工作交接与协作手册','第3月','W12','Word','部门全员','⏳ 待完成'],
        [82,'终期汇报PPT','第3月','W12-W13','PPT','管理层','⏳ 待完成'],
        [83,'品牌建设AI方法论总结','第3月','W13','Word','—','⏳ 待完成'],
        [84,'交接确认签字表','第3月','W13','Word','部门全员','⏳ 待完成'],
        [85,'周总结和计划报告（×16）','全程','持续','Excel','部门主管','⏳ 持续'],
        [86,'月度总结与下月计划（×3）','全程','W4/W8/W12','Word','管理层','⏳ 待完成'],
    ];
    for (const d of deliverables) { dr.push(d); }

    // ======== Sheet 6: AI工具使用计划 ========
    const ah = ['工具','类型','阶段','频次','核心应用场景','效率提升','月费'];
    const ar = [ah];
    ar.push(['Claude','AI文本/推理','全程','每日','策略推演/文档展开/文案量产/话术/竞品/财务建模/逻辑审查/汇报摘要','3-5倍文案效率','~$20/月']);
    ar.push(['Midjourney','AI图像','W5/W11集中','集中期每日','Logo概念/超级符号/IP设计/海报概念/物料视觉','50+张/小时 vs 传统3-5张/天','~$30/月']);
    ar.push(['Canva Pro','在线设计','W10-W11','集中期每日','招商手册排版/社媒模板/物料排版/品牌模板库','10倍排版效率','~$15/月']);
    ar.push(['Notion AI','知识管理','全程','每周1-2次','品牌资产库/文档归档/知识管理/工作日志/周报','检索时间减80%','~$15/月']);
    ar.push(['Gamma/美图AI','AI PPT','W10','3-5次','路演BP初稿/月度汇报PPT/招商宣讲PPT','2天→2小时','~$10/月']);
    ar.push(['剪映专业版','AI视频','W11','3-5次','短视频片头片尾/探店初剪/社媒视频模板','5倍视频效率','免费']);

    // ======== 创建 Workbook ========
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.aoa_to_sheet(rows1);
    XLSX.utils.book_append_sheet(wb, ws1, '1-每日工作计划');

    const ws2 = XLSX.utils.aoa_to_sheet(ganttRows);
    XLSX.utils.book_append_sheet(wb, ws2, '2-甘特图(色条)');

    const ws3 = XLSX.utils.aoa_to_sheet(wr);
    XLSX.utils.book_append_sheet(wb, ws3, '3-周度汇总');

    const ws4 = XLSX.utils.aoa_to_sheet(mr);
    XLSX.utils.book_append_sheet(wb, ws4, '4-月度里程碑');

    const ws5 = XLSX.utils.aoa_to_sheet(dr);
    XLSX.utils.book_append_sheet(wb, ws5, '5-交付物清单');

    const ws6 = XLSX.utils.aoa_to_sheet(ar);
    XLSX.utils.book_append_sheet(wb, ws6, '6-AI工具使用计划');

    // 列宽
    ws1['!cols'] = [
        {wch:5},{wch:10},{wch:6},{wch:5},{wch:22},{wch:26},
        {wch:48},{wch:10},{wch:8},{wch:45},
        {wch:38},{wch:42},{wch:20},{wch:18}
    ];
    ws3['!cols'] = [{wch:8},{wch:22},{wch:18},{wch:25},{wch:50},{wch:40},{wch:25},{wch:35}];
    ws5['!cols'] = [{wch:5},{wch:40},{wch:12},{wch:8},{wch:12},{wch:18},{wch:10}];

    const outputPath = path.join(__dirname, 'Mr666_3个月品牌全案工作计划表.xlsx');
    XLSX.writeFile(wb, outputPath);
    console.log(`✅ 生成成功: ${outputPath}`);
    console.log(`📊 6个工作表: 每日计划(${rows1.length-1}行) | 甘特图 | 周度汇总(${wr.length-1}周) | 月度里程碑(${mr.length-1}月) | 交付物(${dr.length-1}项) | AI工具(${ar.length-1}项)`);
}

buildExcel();
