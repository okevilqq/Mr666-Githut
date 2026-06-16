const XLSX = require('@e965/xlsx');
const path = require('path');
const { COLORS, META } = require('./lib/constants');

// ============================================================
// 配置
// ============================================================
const START_DATE = new Date(2026, 5, 1); // June 1, 2026 (Monday)
const END_DATE = new Date(2026, 7, 28);  // Aug 28, 2026 (Friday)
const DAILY_HOURS = 8;

// ============================================================
// 辅助函数
// ============================================================
function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
}
function getWeekNumber(d) {
    const start = new Date(START_DATE);
    const diff = Math.floor((d - start) / (1000 * 60 * 60 * 24));
    return Math.floor(diff / 7) + 1;
}
function isWeekday(d) {
    return d.getDay() !== 0 && d.getDay() !== 6;
}
function getDayOfWeekCN(d) {
    return ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
}

// ============================================================
// 每日计划数据生成
// ============================================================
function generateDailyPlan() {
    const days = [];
    let current = new Date(START_DATE);
    const end = new Date(END_DATE);

    while (current <= end) {
        if (isWeekday(current)) {
            days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }

    const plan = days.map((d, idx) => {
        const week = getWeekNumber(d);
        const dayOfWeek = getDayOfWeekCN(d);
        const dayNum = idx + 1;
        const entry = {
            dayNum,
            date: formatDate(d),
            week,
            dayOfWeek,
            phase: '',
            phaseColor: '',
            taskTheme: '',
            morningTasks: '',
            morningHours: 4,
            afternoonTasks: '',
            afternoonHours: 4,
            deliverables: '',
            kpis: '',
            collaborators: '',
            aiTools: '',
            notes: ''
        };

        // ================ 第 1 个月：品牌地基期 ================
        if (week === 1) {
            entry.phase = '第1月·品牌地基期';
            entry.phaseColor = '#1a5276';

            if (dayNum === 1) {
                entry.taskTheme = '试用期启动 & 行业全景扫描';
                entry.morningTasks = '1. 入职手续与部门对接，确认试用期考核标准\n2. 梳理项目现有资料，建立品牌知识文件夹\n3. 制定并提交《3个月工作计划表》给人事';
                entry.afternoonTasks = '4. 行业市场基础调研：本地生活市场规模、增长趋势、政策环境\n5. AI辅助：Claude 生成行业数据概览框架\n6. 整理调研笔记，标注关键判断点';
                entry.deliverables = '《3个月工作计划表》\n《行业基础数据汇总》初稿';
                entry.kpis = '计划获批 / 数据覆盖 ≥5个维度 / 当日工时利用率 ≥90%';
                entry.collaborators = '人事部、部门主管';
                entry.aiTools = 'Claude（行业调研框架）';
            } else if (dayNum === 2) {
                entry.taskTheme = '竞品矩阵搭建（第一梯队）';
                entry.morningTasks = '1. 竞品数据采集：美团、阿里系、抖音、京东\n2. 按统一维度（定位/模式/市占/UE/优劣势）建对比框架\n3. Claude 辅助：竞品信息补全与校验';
                entry.afternoonTasks = '4. 第一梯队深度对比：即时零售 + 到店业务 UE 模型梳理\n5. 整理《竞品矩阵对比表》第一梯队部分\n6. 标注差异化空间与可切入机会';
                entry.deliverables = '《竞品矩阵对比表》第一梯队部分';
                entry.kpis = '覆盖4大平台 / UE模型数据≥10项 / 差异化空间≥3个';
                entry.aiTools = 'Claude（竞品数据整理+UE模型推演）';
            } else if (dayNum === 3) {
                entry.taskTheme = '竞品矩阵搭建（第二梯队+区域玩家）';
                entry.morningTasks = '1. 第二梯队竞品分析：高德、小红书、快手、百度、朴朴\n2. 特色玩家模式梳理：社区团购、本地团长、垂直服务\n3. Claude 辅助：差异化模式归纳';
                entry.afternoonTasks = '4. 竞品矩阵汇总：合并第一/第二梯队，形成全景对比\n5. 输出《竞品矩阵对比表》完整版\n6. 初步判断链生活差异化切入角度';
                entry.deliverables = '《竞品矩阵对比表》完整版';
                entry.kpis = '覆盖 ≥10个平台 / 对比维度 ≥15项 / 差异化判断 ≥3条';
                entry.aiTools = 'Claude（矩阵补全+差异分析）';
            } else if (dayNum === 4) {
                entry.taskTheme = '三方痛点深挖（用户+商家+社区）';
                entry.morningTasks = '1. 用户端痛点调研：附近好店难找、优惠分散、售后困难等\n2. Claude 辅助：归纳用户痛点场景与情绪价值链\n3. 整理《用户痛点与需求图谱》';
                entry.afternoonTasks = '4. 商家端痛点调研：获客贵、抽佣重、用户不沉淀、缺复购\n5. 社区端痛点调研：服务分散、活动不足、邻里脱节\n6. 合并输出《三方痛点与机会图谱》初稿';
                entry.deliverables = '《三方痛点与机会图谱》初稿';
                entry.kpis = '用户痛点 ≥10条 / 商家痛点 ≥10条 / 社区痛点 ≥8条 / 每个痛点有对应机会方向';
                entry.aiTools = 'Claude（痛点场景归纳+情绪价值链推演）';
            } else if (dayNum === 5) {
                entry.taskTheme = '市场机会判断 & 周复盘';
                entry.morningTasks = '1. 完成《市场机会与可行性报告》\n2. 判断：是否值得做、切入点在哪、风险可控性\n3. Claude 辅助：机会推演与风险评估';
                entry.afternoonTasks = '4. 第1周成果汇总与归档\n5. 撰写《周总结和周计划报告》\n6. 部门周会：汇报本周成果与下周计划';
                entry.deliverables = '《市场机会与可行性报告》\n《周总结和周计划报告》';
                entry.kpis = '本周5份文档交付 / 主管评分 ≥80 / 周报提交准时';
                entry.collaborators = '部门主管、部门周会';
                entry.aiTools = 'Claude（机会推演+周报整理）';
            }
        } else if (week === 2) {
            entry.phase = '第1月·品牌地基期';
            entry.phaseColor = '#1a5276';

            if (dayNum === 6) {
                entry.taskTheme = '品牌核心定位推导';
                entry.morningTasks = '1. 定义品牌品类归属、核心人群、使用场景\n2. Claude 对话：3轮定位推演，出3个定位方案\n3. 3方案对比：差异点、优劣、适用条件';
                entry.afternoonTasks = '4. 品牌五维模型构建：用户/商家/社区/平台/城市\n5. 撰写《品牌定位3方案对比》\n6. 内部初审，标注推荐方案与理由';
                entry.deliverables = '《品牌定位3方案对比》';
                entry.kpis = '≥3个定位方案 / 每个方案含完整五维模型 / 推荐方案有≥5个支撑论据';
                entry.aiTools = 'Claude（多版本定位推演+维度填充）';
            } else if (dayNum === 7) {
                entry.taskTheme = '品牌战略模型设计';
                entry.morningTasks = '1. 品牌战略公式设计：社区入口×商家生态×用户复购×服务履约\n2. 增长飞轮模型：社区触达→消费→增长→复购→活跃→收益\n3. Claude 辅助：战略逻辑推演与漏洞检查';
                entry.afternoonTasks = '4. 竞争壁垒设计：社区壁垒/用户壁垒/商家壁垒/服务壁垒/城市壁垒\n5. 撰写《品牌战略模型图》\n6. 与竞品战略差异化对比验证';
                entry.deliverables = '《品牌战略模型图》';
                entry.kpis = '战略公式完整 / 飞轮环节 ≥5步 / 壁垒维度 ≥5个 / 差异化对比通过';
                entry.aiTools = 'Claude（战略推演+逻辑审查）';
            } else if (dayNum === 8) {
                entry.taskTheme = '品牌使命/愿景/价值观';
                entry.morningTasks = '1. 品牌使命起草：链接社区美好生活，让服务回到用户身边\n2. Claude 发散：出20条使命候选 → 精选5条\n3. 品牌愿景起草：成为中国最具社区连接力的城市生活服务平台';
                entry.afternoonTasks = '4. 核心价值观体系：用户第一/服务优先/商家共赢/社区深耕/长期主义/合规透明\n5. 每条价值观配核心含义+管理要求\n6. 撰写《品牌使命愿景价值观 V1.0》';
                entry.deliverables = '《品牌使命愿景价值观 V1.0》';
                entry.kpis = '使命候选 ≥5条 / 愿景候选 ≥5条 / 价值观 ≥6条 / 每条有含义说明';
                entry.aiTools = 'Claude（使命愿景批量发散+精选）';
            } else if (dayNum === 9) {
                entry.taskTheme = '定位方案内部评审';
                entry.morningTasks = '1. 准备定位方案汇报材料（含竞品对比、定位推导、3方案对比）\n2. Claude 辅助：生成汇报摘要与决策建议\n3. 与管理层预约评审会';
                entry.afternoonTasks = '4. 内部评审会议：陈述方案 + 收集反馈\n5. 记录评审意见，确定修改方向\n6. 开始《品牌定位体系战略手册》修订';
                entry.deliverables = '定位汇报材料\n评审会议纪要';
                entry.kpis = '会议决策效率（≤2小时） / 反馈意见记录完整 / 修改方向明确';
                entry.collaborators = '管理层、部门主管';
                entry.aiTools = 'Claude（汇报摘要）';
            } else if (dayNum === 10) {
                entry.taskTheme = '定位定稿 & 周复盘';
                entry.morningTasks = '1. 根据评审意见修改定位方案\n2. 完成《品牌定位体系战略手册》终稿\n3. 定位文档归档';
                entry.afternoonTasks = '4. 第2周成果汇总与归档\n5. 撰写《周总结和周计划报告》\n6. 部门周会：汇报定位成果';
                entry.deliverables = '《品牌定位体系战略手册》终稿\n《周总结和周计划报告》';
                entry.kpis = '定位手册完整度100% / 管理层签字确认 / 周报提交准时';
                entry.collaborators = '部门主管、部门周会';
                entry.aiTools = 'Claude（文档终稿整理）';
            }
        } else if (week === 3) {
            entry.phase = '第1月·品牌地基期';
            entry.phaseColor = '#1a5276';

            if (dayNum === 11) {
                entry.taskTheme = '品牌命名策略 & 关键词池';
                entry.morningTasks = '1. 制定命名策略：命名标准（5条硬性+5条加分）、关键词池定义\n2. Claude 辅助：根据定位推导100+命名关键词\n3. 关键词分类：连接系/社区系/生活系/创新系/融合系';
                entry.afternoonTasks = '4. 命名方向定义：5大方向各含核心逻辑与示例\n5. 撰写《品牌命名策略与标准》\n6. 同步合规部：商标检索标准对齐';
                entry.deliverables = '《品牌命名策略与标准》';
                entry.kpis = '关键词 ≥100个 / 命名方向 ≥5个 / 命名标准 ≥10条';
                entry.collaborators = '合规部（张扬谦·商标标准对齐）';
                entry.aiTools = 'Claude（关键词批量生成+分类）';
            } else if (dayNum === 12) {
                entry.taskTheme = '候选名称批量生成';
                entry.morningTasks = '1. Claude 批量生成：每个方向20个候选 = 100个候选名\n2. 初筛：剔除不合标准、难记、有负面联想 → 保留50个\n3. 二次筛选：读音测试、品牌感评估 → 保留Top 20';
                entry.afternoonTasks = '4. Top 20 名称释义撰写：每个名称配含义、联想、适用场景\n5. 撰写《候选名称Top 20》\n6. 内部小范围测试（请3-5位同事盲选）';
                entry.deliverables = '《候选名称Top 20》';
                entry.kpis = '初始候选 ≥100个 / Top 20 各配释义 / 内部测试 ≥3人';
                entry.aiTools = 'Claude（名称批量生成+释义撰写）';
            } else if (dayNum === 13) {
                entry.taskTheme = '商标预查 & 可用性验证';
                entry.morningTasks = '1. Top 10 名称在国家商标局官网预查\n2. 企查查/天眼查验证企业名称冲突\n3. 域名（.com/.cn）可用性查询';
                entry.afternoonTasks = '4. 社交媒体账号名（微信/抖音/小红书）可用性检查\n5. 撰写《商标预查报告》：每个名称的注册风险评级\n6. 与合规部确认商标注册可行性';
                entry.deliverables = '《商标预查报告》';
                entry.kpis = '预查 ≥10个名称 / 5维度检查（商标/企业名/域名/社媒/近似商标）/ 风险评级明确';
                entry.collaborators = '合规部（张扬谦·商标注册确认）';
                entry.aiTools = '网络搜索（商标/域名查询辅助）';
            } else if (dayNum === 14) {
                entry.taskTheme = '品牌命名终稿评审';
                entry.morningTasks = '1. 准备命名终稿汇报：Top 5 名称 + 商标预查结论 + 推荐意见\n2. Claude 辅助：命名方案汇报摘要\n3. 管理层命名评审会';
                entry.afternoonTasks = '4. 确定品牌主名称 + 备用名 2-3 个\n5. 撰写《品牌命名终稿》\n6. 启动商标注册流程（委托合规部）';
                entry.deliverables = '《品牌命名终稿》\n商标注册委托单';
                entry.kpis = '主名称确定 / 备用名 ≥2个 / 商标注册流程已启动';
                entry.collaborators = '管理层、合规部';
                entry.aiTools = 'Claude（汇报摘要）';
            } else if (dayNum === 15) {
                entry.taskTheme = '品牌话语体系 & 周复盘';
                entry.morningTasks = '1. Slogan 体系设计：主口号+用户端+商家端+社区端\n2. Claude 批量：每端出30条 → 各精选3条\n3. 话语体系整合：核心表达、场景话术、品牌语调初稿';
                entry.afternoonTasks = '4. 第3周成果汇总与归档\n5. 撰写《周总结和周计划报告》\n6. 部门周会：汇报命名与话语体系成果';
                entry.deliverables = '《品牌话语体系与 Slogan》初稿\n《周总结和周计划报告》';
                entry.kpis = 'Slogan ≥120条候选 / 精选 ≥12条 / 覆盖4端 / 周报准时';
                entry.collaborators = '部门主管、部门周会';
                entry.aiTools = 'Claude（Slogan批量生成）';
            }
        } else if (week === 4) {
            entry.phase = '第1月·品牌地基期';
            entry.phaseColor = '#1a5276';

            if (dayNum === 16) {
                entry.taskTheme = '品牌战略总纲撰写（上）';
                entry.morningTasks = '1. 整合第1-3周成果：行业分析→定位→命名→话语体系\n2. 战略总纲框架搭建：战略定义→战略逻辑→使命体系\n3. Claude 辅助：框架展开与逻辑串联';
                entry.afternoonTasks = '4. 品牌战略核心逻辑章节："先社区后平台；先服务后规模；先盈利后服务费结算；先复购后增长"\n5. 使命/愿景/价值观章节融入\n6. 文档进度：完成前50%';
                entry.deliverables = '《品牌战略总纲体系》50%进度';
                entry.kpis = '战略定义清晰 / 4条战略逻辑每条约300字 / 使命体系完整';
                entry.aiTools = 'Claude（文档展开+逻辑串联）';
            } else if (dayNum === 17) {
                entry.taskTheme = '品牌战略总纲撰写（下）';
                entry.morningTasks = '1. 战略定位体系：战略定位→升级路径→竞争定位\n2. 战略护城河体系：5大壁垒详述\n3. 用户/商家/社区/增长/内容5大战略体系撰写';
                entry.afternoonTasks = '4. 全稿通读与逻辑审查\n5. 完成《品牌战略总纲体系 V1.0》\n6. Claude 辅助：漏洞检查+补缺';
                entry.deliverables = '《品牌战略总纲体系 V1.0》完整版';
                entry.kpis = '文档 ≥10个模块 / 总字数 ≥8000字 / 逻辑自检通过 / 无前后矛盾';
                entry.aiTools = 'Claude（全稿逻辑审查+漏洞修补）';
            } else if (dayNum === 18) {
                entry.taskTheme = '品牌差异化战略论证';
                entry.morningTasks = '1. 与传统电商差异：流量→社区/广告→服务/抽佣→共赢/单次→复购\n2. 与传统本地平台差异：中心化→社区化/大促→长期/流量→关系\n3. Claude 辅助：逐条论证+反方辩驳';
                entry.afternoonTasks = '4. 与社区团购差异：商品→服务/低价→关系/团长→生态/补贴→复购\n5. 撰写《品牌差异化战略说明》\n6. 差异化话术提炼（对外宣传用）';
                entry.deliverables = '《品牌差异化战略说明》';
                entry.kpis = '对比维度 ≥12条 / 每条约100字论证 / 反方辩驳通过 / 话术可对外使用';
                entry.aiTools = 'Claude（差异论证+反方辩驳检验）';
            } else if (dayNum === 19) {
                entry.taskTheme = '第1月成果汇总 & 管理层汇报准备';
                entry.morningTasks = '1. 第1月全成果梳理：文档目录、版本号、关键结论\n2. Claude 辅助：生成"1页纸月度摘要"\n3. 汇报 PPT 制作：战略→定位→命名→差异化';
                entry.afternoonTasks = '4. PPT 预演与修改\n5. 材料归档至品牌知识库（Notion）\n6. 与管理层确认汇报时间';
                entry.deliverables = '《第1月品牌地基成果包》\n月度汇报 PPT';
                entry.kpis = '文档 ≥15份 / PPT ≤15页 / 归档完整 / 汇报预约确认';
                entry.collaborators = '管理层';
                entry.aiTools = 'Claude（月度摘要+Notion AI归档）';
            } else if (dayNum === 20) {
                entry.taskTheme = '管理层月度汇报 & 月复盘';
                entry.morningTasks = '1. 向管理层汇报第1月成果：战略总纲、定位手册、命名、差异化\n2. 收集反馈，确认第2月方向\n3. 记录决策事项与调整要求';
                entry.afternoonTasks = '4. 撰写《月度总结与下月计划》\n5. 撰写《周总结和周计划报告》\n6. 根据反馈调整第2月计划细节';
                entry.deliverables = '《月度总结与下月计划》\n《周总结和周计划报告》\n管理层反馈记录';
                entry.kpis = '汇报通过 / 反馈 ≤5条修改 / 第2月方向确认 / 月报准时';
                entry.collaborators = '管理层、部门主管';
                entry.aiTools = 'Claude（月报整理+反馈响应）';
            }
        }

        // ================ 第 2 个月：品牌建设期 ================
        else if (week >= 5 && week <= 8) {
            entry.phase = '第2月·品牌建设期';
            entry.phaseColor = '#c0392b';

            if (dayNum === 21) {
                entry.taskTheme = '品牌视觉策略制定';
                entry.morningTasks = '1. 品牌气质关键词定义：温暖/社区感/信任感/烟火气/便民感/连接感\n2. 视觉策略框架：风格方向、情绪板、竞品视觉对比\n3. Claude 辅助：视觉策略文档撰写';
                entry.afternoonTasks = '4. 给设计师的《品牌视觉策略 Brief》撰写\n5. Midjourney Prompt 准备：Logo 方向×5组关键词\n6. 与设计师（林敬民/李俊坚）对齐视觉方向';
                entry.deliverables = '《品牌视觉策略 Brief》\nMJ Prompt 库（5组）';
                entry.kpis = '气质关键词 ≥6个 / Brief 完整度100% / 设计师对齐确认 / MJ Prompt 5组';
                entry.collaborators = '设计师（林敬民、李俊坚）';
                entry.aiTools = 'Claude（视觉策略）+ Midjourney（概念Prompt准备）';
            } else if (dayNum === 22) {
                entry.taskTheme = 'Logo 概念生成（AI+人工）';
                entry.morningTasks = '1. Midjourney 批量出图：5组Prompt × 各10张 = 50+概念\n2. 概念初筛：剔除不符合定位、风格偏离 → 保留30张\n3. 按5个方向分类归档';
                entry.afternoonTasks = '4. 精选每个方向Top 3 = 15个优质概念\n5. 撰写《Logo 概念方向稿》：5方向各附参考图+评语\n6. 与设计师讨论精修方向';
                entry.deliverables = '《Logo 概念方向稿》（5方向×3概念）';
                entry.kpis = 'MJ 出图 ≥50张 / 精选 ≥15张 / 5方向各3张 / 设计师反馈收集';
                entry.collaborators = '设计师（林敬民、李俊坚）';
                entry.aiTools = 'Midjourney（Logo概念批量生成）';
            } else if (dayNum === 23) {
                entry.taskTheme = '超级符号 & 色彩体系';
                entry.morningTasks = '1. 超级符号设计：链环+定位点+微笑曲线结构定义\n2. Claude 辅助：符号含义体系——每个元素配3层解读\n3. 品牌色彩体系：主色（链生活蓝 #2F80ED）+ 辅色（温暖橙 #FF8A34）+ 辅助色系';
                entry.afternoonTasks = '4. 字体体系：中文（思源黑体）+ 英文 + 使用层级\n5. 撰写《品牌视觉与超级符号体系手册》文字部分\n6. 设计师并行启动 Logo 精修';
                entry.deliverables = '《品牌视觉与超级符号体系手册》文字稿';
                entry.kpis = '符号含义 ≥3层 / 色值定义 ≥6个 / 字体推荐 ≥3组 / 使用层级明确';
                entry.aiTools = 'Claude（符号含义体系+色彩推理）';
            } else if (dayNum === 24) {
                entry.taskTheme = 'Logo 精修 & 多版本规范';
                entry.morningTasks = '1. 与设计师确定最终 Logo 方向\n2. Logo 标准制图：网格规范、安全间距、最小尺寸\n3. 多版本制作：标准版/横版/竖版/反白版/图标版/简化版';
                entry.afternoonTasks = '4. Logo 使用规范：禁止拉伸/改色/换字体/加描边/低清/复杂背景\n5. 输出《Logo 标准规范文件》\n6. 视觉手册插图补充';
                entry.deliverables = '《Logo 标准规范文件》（含源文件）';
                entry.kpis = 'Logo ≥6个版本 / 规范条目 ≥10条 / 源文件交付 / 设计师确认';
                entry.collaborators = '设计师（林敬民/李俊坚·精修执行）';
                entry.aiTools = 'Midjourney（微调参考）';
            } else if (dayNum === 25) {
                entry.taskTheme = '视觉手册完成 & 周复盘';
                entry.morningTasks = '1. 品牌插画风格定义+摄影风格指南\n2. 辅助图形系统：链环路径/地图线/定位图标/微笑曲线/服务波纹\n3. 视觉手册全稿整合与定稿';
                entry.afternoonTasks = '4. 第5周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：展示Logo与视觉体系成果';
                entry.deliverables = '《品牌视觉与超级符号体系手册》完整版\n《周总结和周计划报告》';
                entry.kpis = '视觉手册完整度100% / Logo获批 / 周报准时';
                entry.collaborators = '部门主管、设计师';
                entry.aiTools = 'Claude（手册整合）+ MJ（插画方向参考）';
            }
        } else if (week === 6) {
            entry.phase = '第2月·品牌建设期';
            entry.phaseColor = '#c0392b';

            if (dayNum === 26) {
                entry.taskTheme = '品牌故事体系构建';
                entry.morningTasks = '1. 品牌缘起故事：为什么做链生活（行业痛点切入）\n2. 品牌理念故事：链接社区美好生活的初心\n3. Claude 发散去：出5版故事框架 → 精选1版深化';
                entry.afternoonTasks = '4. 创始人/团队故事框架（如需）\n5. 品牌故事场景适配：官网版/招商版/融资版/社区版\n6. 撰写《品牌故事体系》';
                entry.deliverables = '《品牌故事体系》';
                entry.kpis = '故事版本 ≥4个 / 各版本适配场景明确 / 情感共鸣测试通过（内测≥3人）';
                entry.aiTools = 'Claude（多版本故事+场景适配）';
            } else if (dayNum === 27) {
                entry.taskTheme = '品牌语调指南';
                entry.morningTasks = '1. 品牌人格定义："懂社区、懂生活、可信赖的社区生活伙伴"\n2. 语调关键词：温暖/真诚/接地气/可靠/共赢/长期\n3. Claude 辅助：每关键词配正面示例+反面示例';
                entry.afternoonTasks = '4. 分场景语调规范：客服/社群/招商/广告/公关\n5. 禁忌词库：金融化/区块链/保本/躺赚/高冷/互联网黑话\n6. 撰写《品牌语调与文案规范》';
                entry.deliverables = '《品牌语调与文案规范》';
                entry.kpis = '语调维度 ≥8个 / 正反示例各 ≥5条 / 禁忌词 ≥30条 / 分场景 ≥5个';
                entry.aiTools = 'Claude（语调体系+正反示例+禁忌词库）';
            } else if (dayNum === 28) {
                entry.taskTheme = '核心页面文案产出（上）';
                entry.morningTasks = '1. 官网首页文案：主标题/副标题/价值主张/CTA/信任证据\n2. Claude 量产：每模块出5版 → 精选1版\n3. "关于我们"页面：品牌缘起/使命/愿景/价值观/团队';
                entry.afternoonTasks = '4. 商家合作页：为什么加入/合作模式/成功案例框架/入驻流程\n5. 用户权益页：会员权益/省钱攻略/使用指引\n6. 撰写《品牌核心页面文案》50%进度';
                entry.deliverables = '《品牌核心页面文案》50%';
                entry.kpis = '首页文案 ≥5模块 / 各模块 ≥5版候选 / 商家页转化逻辑清晰';
                entry.aiTools = 'Claude（文案批量生成+精选）';
            } else if (dayNum === 29) {
                entry.taskTheme = '核心页面文案产出（下）& 内容策略';
                entry.morningTasks = '1. 社区服务页/招商合作页/帮助中心页文案\n2. 全页面文案统一性检查（语调/价值观/关键词一致性）\n3. 完成《品牌核心页面文案》终稿';
                entry.afternoonTasks = '4. 内容策略制定：内容类型/渠道矩阵/发布节奏/选题规划\n5. 内容日历模板：月度主题→周选题→日发布\n6. 撰写《品牌内容策略与日历》';
                entry.deliverables = '《品牌核心页面文案》终稿\n《品牌内容策略与日历》';
                entry.kpis = '页面文案 ≥8个 / 一致性检查通过 / 内容日历覆盖 ≥30天';
                entry.aiTools = 'Claude（文案终稿+内容日历生成）';
            } else if (dayNum === 30) {
                entry.taskTheme = '内容体系定稿 & 周复盘';
                entry.morningTasks = '1. 内容策略日历与文案组（唐佳富）对齐\n2. 文案规范同步至企业宣传部全员\n3. 内容资产归档到品牌知识库';
                entry.afternoonTasks = '4. 第6周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：汇报内容体系成果';
                entry.deliverables = '《周总结和周计划报告》\n品牌内容资产包';
                entry.kpis = '内容体系4份文档交付 / 文案组对齐确认 / 周报准时';
                entry.collaborators = '文案组（唐佳富）、部门周会';
                entry.aiTools = 'Claude（归档整理）+ Notion AI（知识库更新）';
            }
        } else if (week === 7) {
            entry.phase = '第2月·品牌建设期';
            entry.phaseColor = '#c0392b';

            if (dayNum === 31) {
                entry.taskTheme = '商业模式设计';
                entry.morningTasks = '1. 收入结构设计：商家服务费/交易佣金/会员收入/活动收入/品牌合作\n2. Claude 辅助：收入模型推演——各板块定价逻辑与占比\n3. 服务费结算机制设计：试跑→增长→长期合作的阶梯式服务费结算模型';
                entry.afternoonTasks = '4. 会员体系设计：等级/权益/成长路径/盈利逻辑\n5. 撰写《商业模式说明》\n6. 与财务部初步对接收入口径';
                entry.deliverables = '《商业模式说明》初稿';
                entry.kpis = '收入板块 ≥5个 / 服务费结算模型3阶段 / 会员等级 ≥4级 / 财务口径对齐';
                entry.collaborators = '财务部';
                entry.aiTools = 'Claude（收入模型推演+服务费结算阶梯设计）';
            } else if (dayNum === 32) {
                entry.taskTheme = '招商战略体系';
                entry.morningTasks = '1. 招商核心定位："先帮你赚钱，再和你服务费结算"\n2. 招商目标对象定义：高频消费×高复购×本地生活服务型商家\n3. 重点招商行业筛选：餐饮/生鲜/家政/美业/教育/亲子/维修/健康';
                entry.afternoonTasks = '4. 招商转化路径：触达→案例沟通→试跑→导流→复盘→长期合作\n5. 招商核心竞争力梳理\n6. 撰写《招商战略体系》';
                entry.deliverables = '《招商战略体系》';
                entry.kpis = '目标行业 ≥8个 / 转化路径 ≥6步 / 竞争力 ≥5条 / 每行业有定制策略';
                entry.aiTools = 'Claude（招商策略+行业筛选逻辑）';
            } else if (dayNum === 33) {
                entry.taskTheme = '招商手册撰写（通用版+行业版）';
                entry.morningTasks = '1. 通用版招商手册：定位/模式/优势/合作流程/案例/FAQ\n2. Claude 量产：各模块出3版 → 精选1版\n3. 餐饮行业定制版：餐饮商家痛点+链生活方案+收益测算';
                entry.afternoonTasks = '4. 家政行业定制版\n5. 美业行业定制版\n6. 三版手册交叉比对，确保口径一致';
                entry.deliverables = '《招商手册》通用版+餐饮版+家政版+美业版';
                entry.kpis = '手册 ≥4版 / 各版 ≥10页 / FAQ ≥15条 / 口径一致性检查通过';
                entry.aiTools = 'Claude（招商文案量产+行业定制）';
            } else if (dayNum === 34) {
                entry.taskTheme = '商家合作 SOP';
                entry.morningTasks = '1. 商家全生命周期流程：筛选→拜访→签约→上架→试跑→增长→复购→长期\n2. 每阶段配：动作清单/话术/时间/验收标准\n3. Claude 辅助：流程展开+检查清单';
                entry.afternoonTasks = '4. 商家准入评分表：资质/履约/让利/复购潜力/配合度\n5. 商家评级体系：A/B/C/D 四级\n6. 撰写《商家合作标准操作流程》';
                entry.deliverables = '《商家合作标准操作流程》';
                entry.kpis = '流程 ≥8阶段 / 每阶段 ≥5个动作 / 评分维度 ≥5个 / 评级标准明确';
                entry.aiTools = 'Claude（SOP流程展开+检查清单）';
            } else if (dayNum === 35) {
                entry.taskTheme = '商业模式体系定稿 & 周复盘';
                entry.morningTasks = '1. 商业模式/招商/SOP 三份文档逻辑闭环检查\n2. 与合规部确认招商话术边界（严禁保本/躺赚/固定收益承诺）\n3. 文档最终修订与定稿';
                entry.afternoonTasks = '4. 第7周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：汇报商业模式与招商体系';
                entry.deliverables = '商业体系3份文档定稿\n《周总结和周计划报告》';
                entry.kpis = '三文档逻辑闭环 / 合规审查通过 / 周报准时';
                entry.collaborators = '合规部（张扬谦）、部门周会';
                entry.aiTools = 'Claude（逻辑闭环审查）';
            }
        } else if (week === 8) {
            entry.phase = '第2月·品牌建设期';
            entry.phaseColor = '#c0392b';

            if (dayNum === 36) {
                entry.taskTheme = '品牌全案整合（上）';
                entry.morningTasks = '1. 梳理第1-2月所有产出物：战略/定位/命名/视觉/内容/商业模式/招商\n2. 建立全案目录树：按模块→文档→版本→状态的层级\n3. Claude 辅助：生成《品牌全案体系目录》';
                entry.afternoonTasks = '4. 文档版本统一：检查所有文件的版本号、日期、署名\n5. 文档命名规范统一：日期+品牌+文件类型+版本号\n6. 标注各文档之间的引用关系';
                entry.deliverables = '《品牌全案体系目录》\n文档命名规范统一';
                entry.kpis = '目录覆盖所有已产出文档 / 版本号统一 / 引用关系清晰';
                entry.aiTools = 'Claude（目录生成+版本核查）';
            } else if (dayNum === 37) {
                entry.taskTheme = '体系交叉校验 & 缺口补足';
                entry.morningTasks = '1. 逻辑闭环检查：战略→定位→视觉→内容→招商是否自洽\n2. Claude 逐链审查：每个逻辑链条配"前提→结论→证据"\n3. 识别体系漏洞与不一致';
                entry.afternoonTasks = '4. 缺口清单整理：按严重程度排优先级\n5. 逐项补足：撰写缺失/薄弱模块\n6. 撰写《品牌体系完整性自查表》';
                entry.deliverables = '《品牌体系完整性自查表》\n缺口补足文档';
                entry.kpis = '审查链条 ≥20条 / 缺口 ≤5个 / 补足率100% / 自查评分 ≥85分';
                entry.aiTools = 'Claude（逐链逻辑审查+缺口识别）';
            } else if (dayNum === 38) {
                entry.taskTheme = '第2月成果汇总 & 管理层汇报准备';
                entry.morningTasks = '1. 第2月全成果梳理：新增文档目录、关键决策、里程碑\n2. Claude 辅助：生成"1页纸月度摘要"\n3. 月度汇报 PPT 制作（含视觉成果展示）';
                entry.afternoonTasks = '4. PPT 预演 + 修改\n5. 全部成果归档至品牌知识库（Notion AI）\n6. 与管理层确认汇报时间';
                entry.deliverables = '《第2月品牌全案成果包》\n月度汇报 PPT';
                entry.kpis = '新增文档 ≥15份 / PPT ≤20页 / 归档完整 / 汇报预约确认';
                entry.collaborators = '管理层';
                entry.aiTools = 'Claude（月度摘要）+ Notion AI（归档）';
            } else if (dayNum === 39) {
                entry.taskTheme = '管理层月度汇报';
                entry.morningTasks = '1. 向管理层汇报第2月成果：视觉体系、内容体系、商业模式、招商体系\n2. 展示品牌全案完整度与逻辑闭环\n3. 收集反馈，确认第3月方向';
                entry.afternoonTasks = '4. 撰写《月度总结与下月计划》\n5. 根据反馈调整第3月计划\n6. 品牌全案体系阶段性归档';
                entry.deliverables = '《月度总结与下月计划》\n管理层反馈记录';
                entry.kpis = '汇报通过 / 反馈 ≤3条 / 第3月方向确认 / 品牌体系完整度 ≥90%';
                entry.collaborators = '管理层、部门主管';
                entry.aiTools = 'Claude（月报整理+反馈响应）';
            } else if (dayNum === 40) {
                entry.taskTheme = '第2月收尾 & 周复盘';
                entry.morningTasks = '1. 根据管理层反馈微调品牌体系\n2. 第3月详细计划确认\n3. 跨部门协作排期（设计师/视频组/数字化中心）';
                entry.afternoonTasks = '4. 第8周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：月度复盘';
                entry.deliverables = '《周总结和周计划报告》\n第3月协作排期表';
                entry.kpis = '调整项全部完成 / 第3月排期确认 / 周报准时';
                entry.collaborators = '部门主管、设计师、视频组、数字化中心';
                entry.aiTools = 'Claude（文档微调+排期表）';
            }
        }

        // ================ 第 3 个月：品牌交付期 ================
        else if (week >= 9 && week <= 13) {
            entry.phase = '第3月·品牌交付期';
            entry.phaseColor = '#1e8449';

            if (dayNum === 41) {
                entry.taskTheme = '样板社区选择标准';
                entry.morningTasks = '1. 样板社区定义与选择原则：先验证模型再追求规模\n2. 硬性准入门槛：户数/入住率/生活半径/商家基础/触达入口/执行可达\n3. Claude 辅助：标准展开与评分模型设计';
                entry.afternoonTasks = '4. 优先画像：成熟生活型社区/中产家庭型/多小区聚合/老社区更新\n5. 100分制评分模型：7大维度×权重×高分标准×低分预警\n6. 撰写《样板社区选择标准》';
                entry.deliverables = '《样板社区选择标准》';
                entry.kpis = '硬性门槛 ≥6条 / 评分维度 ≥7个 / 评分标准100分制 / 调研清单完整';
                entry.aiTools = 'Claude（标准设计+评分模型）';
            } else if (dayNum === 42) {
                entry.taskTheme = '30天冷启动动作表（上）';
                entry.morningTasks = '1. 冷启动4阶段：底盘搭建(1-7天)→种子激活(8-14天)→交易转化(15-21天)→复盘复制(22-30天)\n2. D1-D14 逐日动作设计：每日核心目标/具体动作/责任角色/验收标准/关键数据\n3. Claude 辅助：逐日动作展开';
                entry.afternoonTasks = '4. 每阶段判断标准：是否具备进入下一阶段条件\n5. 关键数据指标体系设计\n6. 文档进度50%';
                entry.deliverables = '《30天冷启动动作表》50%';
                entry.kpis = 'D1-D14 每天动作 ≥4条 / 验收标准量化 / 数据指标明确';
                entry.aiTools = 'Claude（逐日动作展开+指标设计）';
            } else if (dayNum === 43) {
                entry.taskTheme = '30天冷启动动作表（下）';
                entry.morningTasks = '1. D15-D30 逐日动作设计\n2. 商家招募话术+合作方案\n3. 种子用户拉新流程+社群话术';
                entry.afternoonTasks = '4. 首场社区福利活动方案设计\n5. D1-D30 全表逻辑审查\n6. 撰写《30天冷启动动作表》完整版';
                entry.deliverables = '《30天冷启动动作表》完整版';
                entry.kpis = 'D1-D30 每天 ≥4条动作 / 责任角色明确 / 验收标准量化 / 数据指标 ≥5个';
                entry.aiTools = 'Claude（逐日动作+活动方案+话术）';
            } else if (dayNum === 44) {
                entry.taskTheme = '单社区财务模型';
                entry.morningTasks = '1. 核心参数假设表：社区体量/注册率/月活率/付费率/客单价/佣金率\n2. 收入结构模型：商家服务费+交易佣金+会员+活动+广告\n3. Claude 辅助：三种情景测算（保守/基准/进取）';
                entry.afternoonTasks = '4. 成本结构：启动成本+固定成本+变动成本+服务商服务费结算\n5. 盈亏平衡分析与回本周期测算\n6. 撰写《单社区财务模型》';
                entry.deliverables = '《单社区财务模型》';
                entry.kpis = '参数 ≥15项 / 收入来源 ≥5项 / 成本分项 ≥8项 / 3情景测算完整';
                entry.collaborators = '财务部';
                entry.aiTools = 'Claude（财务模型设计+情景测算）';
            } else if (dayNum === 45) {
                entry.taskTheme = '城市服务商管理办法 & 周复盘';
                entry.morningTasks = '1. 服务商准入标准：主体资质/团队配置/本地资源/资金/执行/合规\n2. 授权机制：意向期→试运营→片区→城市→整改→退出\n3. 培训认证体系+绩效考核+KPI';
                entry.afternoonTasks = '4. 服务费结算结算与风控退出机制\n5. 撰写《城市服务商管理办法》\n6. 第9周成果汇总+周报';
                entry.deliverables = '《城市服务商管理办法》\n《周总结和周计划报告》';
                entry.kpis = '授权等级 ≥5级 / 考核维度 ≥6个 / KPI ≥15项 / 周报准时';
                entry.aiTools = 'Claude（制度设计+KPI体系）';
            }
        } else if (week === 10) {
            entry.phase = '第3月·品牌交付期';
            entry.phaseColor = '#1e8449';

            if (dayNum === 46) {
                entry.taskTheme = '商业生态白皮书撰写（上）';
                entry.morningTasks = '1. 白皮书框架：战略总纲→行业痛点→生态架构→用户价值→商家价值→社区价值\n2. Part 01-03 撰写：链生活是什么/为什么需要社区入口/五方协同生态\n3. Claude 辅助：长篇结构化展开';
                entry.afternoonTasks = '4. Part 04-06 撰写：用户从消费到复购/商家从流量到共赢/社区服务站与最后一公里\n5. 进度50%\n6. 白皮书排版风格确定';
                entry.deliverables = '《商业生态白皮书》50%';
                entry.kpis = '完成 Part 01-06 / 每Part ≥2000字 / 逻辑连贯';
                entry.aiTools = 'Claude（长篇结构化展开）';
            } else if (dayNum === 47) {
                entry.taskTheme = '商业生态白皮书撰写（下）';
                entry.morningTasks = '1. Part 07-12 撰写：商业模式/单社区模型/冷启动/服务商/品牌资产/数据中台\n2. Part 13-15 撰写：风控/路线图/附录\n3. 全稿通读与逻辑审查';
                entry.afternoonTasks = '4. 排版与图表补充\n5. 撰写《商业生态白皮书 V1.0》完整版\n6. Claude 终审：逻辑一致性+数据交叉验证';
                entry.deliverables = '《商业生态白皮书 V1.0》完整版';
                entry.kpis = '≥15个Part / 总字数 ≥20000字 / 图表 ≥8张 / 逻辑终审通过';
                entry.aiTools = 'Claude（全稿撰写+终审）';
            } else if (dayNum === 48) {
                entry.taskTheme = '融资路演 BP 撰写';
                entry.morningTasks = '1. BP 逻辑线：问题→方案→市场→模式→竞争→团队→财务→融资计划\n2. Claude 辅助：每页核心信息提炼+数据支撑\n3. BP 内容稿撰写';
                entry.afternoonTasks = '4. BP 视觉化：Gamma/美图AI PPT 生成初稿\n5. 与设计师（李锐）对接 PPT 美化需求\n6. 撰写《融资路演 BP》内容版+视觉版初稿';
                entry.deliverables = '《融资路演 BP》内容版+视觉版初稿';
                entry.kpis = 'BP ≤15页 / 每页核心信息 ≤3条 / 数据均有来源 / 视觉风格统一';
                entry.collaborators = '设计师（李锐）';
                entry.aiTools = 'Claude（BP内容）+ Gamma（AI PPT生成）';
            } else if (dayNum === 49) {
                entry.taskTheme = 'BP 定稿 & 招商手册视觉化';
                entry.morningTasks = '1. 根据内容反馈修改 BP\n2. 设计师完成 PPT 美化\n3. BP 宣讲演练与修改';
                entry.afternoonTasks = '4. 招商手册视觉化：Canva AI 出设计稿\n5. 设计师精修\n6. BP + 招商手册终稿';
                entry.deliverables = '《融资路演 BP》终稿\n《招商手册》设计版';
                entry.kpis = 'BP 终稿确认 / 招商手册设计版完成 / 两份文档可对外使用';
                entry.collaborators = '设计师（李锐）';
                entry.aiTools = 'Gamma（PPT）+ Canva AI（手册排版）';
            } else if (dayNum === 50) {
                entry.taskTheme = '路演材料汇总 & 周复盘';
                entry.morningTasks = '1. 路演材料包汇总：BP+白皮书+招商手册+品牌手册\n2. 统一对外视觉：所有材料风格/色系/字体一致性检查\n3. 对外话术准备：5分钟路演稿+3分钟精简版+1分钟电梯演讲';
                entry.afternoonTasks = '4. 第10周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：路演材料预演';
                entry.deliverables = '路演材料包\n路演话术（3版本）\n《周总结和周计划报告》';
                entry.kpis = '材料包 ≥4份 / 话术 ≥3版本 / 对外视觉统一 / 周报准时';
                entry.collaborators = '部门周会';
                entry.aiTools = 'Claude（路演话术+统一性检查）';
            }
        } else if (week === 11) {
            entry.phase = '第3月·品牌交付期';
            entry.phaseColor = '#1e8449';

            if (dayNum === 51) {
                entry.taskTheme = '社区线下物料包设计';
                entry.morningTasks = '1. 物料清单：社区门贴/活动海报/商家台卡/展架/权益卡/工服/手提袋\n2. Midjourney 出每种物料的视觉概念\n3. 物料文案撰写（Claude批量）';
                entry.afternoonTasks = '4. 设计师制作物料设计稿（Canva/Illustrator）\n5. 物料印刷规格标注\n6. 《社区线下物料包》进度50%';
                entry.deliverables = '《社区线下物料包》50%';
                entry.kpis = '物料种类 ≥7种 / 每种 ≥2版设计 / 印刷规格完整';
                entry.collaborators = '设计师（骆媛媛、陈柳英）';
                entry.aiTools = 'Midjourney（物料概念）+ Claude（物料文案）+ Canva（排版）';
            } else if (dayNum === 52) {
                entry.taskTheme = '物料包定稿 & 社媒素材库';
                entry.morningTasks = '1. 物料设计稿审核与修改\n2. 《社区线下物料包》定稿\n3. 社媒素材清单：头像/封面/朋友圈海报/短视频封面/推文模板';
                entry.afternoonTasks = '4. Canva AI 批量生成社媒模板\n5. 剪映 AI：短视频片头/片尾/转场模板\n6. 《社媒视觉素材库》打包';
                entry.deliverables = '《社区线下物料包》终稿\n《社媒视觉素材库》';
                entry.kpis = '物料定稿 / 社媒模板 ≥15个 / 视频模板 ≥5个 / 品牌一致性检查通过';
                entry.collaborators = '设计师、视频组（许继忠、董建明）';
                entry.aiTools = 'Canva AI（社媒模板）+ 剪映 AI（视频模板）';
            } else if (dayNum === 53) {
                entry.taskTheme = '产品需求文档 PRD';
                entry.morningTasks = '1. 小程序功能架构设计：社区首页/商家列表/领券/核销/会员/个人中心\n2. 页面流程图：用户端+商家端+服务商端\n3. Claude 辅助：功能需求结构化展开';
                entry.afternoonTasks = '4. 数据需求：注册/领券/核销/复购/CRM/看板\n5. 非功能需求：性能/安全/兼容性\n6. 撰写《产品需求文档 PRD》';
                entry.deliverables = '《产品需求文档 PRD》';
                entry.kpis = '功能模块 ≥8个 / 页面 ≥20个 / 数据指标 ≥15个 / 可直接用于开发';
                entry.collaborators = '数字化中心（张冬/江周辉）';
                entry.aiTools = 'Claude（PRD结构化+功能展开）';
            } else if (dayNum === 54) {
                entry.taskTheme = '品牌使用规范手册';
                entry.morningTasks = '1. Logo使用规范：最小尺寸/安全间距/色彩版本/禁止示例\n2. 色彩使用规范：主色/辅色/辅助色/使用比例/禁止搭配\n3. 字体使用规范：中英文/层级/替代方案';
                entry.afternoonTasks = '4. 物料模板规范：海报/名片/PPT/邮件签名/社媒模板\n5. 撰写《品牌使用规范手册》\n6. 合规部审核对外承诺用语';
                entry.deliverables = '《品牌使用规范手册》';
                entry.kpis = '规范条目 ≥50条 / 禁止示例 ≥20个 / 模板 ≥10个 / 合规审核通过';
                entry.collaborators = '合规部（张扬谦）';
                entry.aiTools = 'Claude（规范条目展开+示例生成）';
            } else if (dayNum === 55) {
                entry.taskTheme = '品牌IP设计 & 周复盘';
                entry.morningTasks = '1. 品牌IP"链宝"概念设计：形象方向/性格/应用场景\n2. MJ 出IP概念稿 → 设计师精修\n3. IP应用延展：表情包/社区导视/活动物料';
                entry.afternoonTasks = '4. 第11周成果汇总\n5. 撰写《周总结和周计划报告》\n6. 部门周会：展示物料包与PRD成果';
                entry.deliverables = '链宝 IP 初稿\n《周总结和周计划报告》';
                entry.kpis = 'IP概念 ≥3方向 / MJ出图 ≥20张 / 物料包+PRD交付 / 周报准时';
                entry.collaborators = '设计师、部门周会';
                entry.aiTools = 'Midjourney（IP概念）+ Claude（IP人设）';
            }
        } else if (week === 13) {
            entry.phase = '第3月·品牌交付期';
            entry.phaseColor = '#1e8449';

            if (dayNum === 61) {
                entry.taskTheme = '缓冲补足：未完成项收尾';
                entry.morningTasks = '1. 清点全部交付物完成状态\n2. 优先补齐遗漏或未达标项\n3. 文档终版修订与版本锁定';
                entry.afternoonTasks = '4. 品牌知识库最后更新\n5. 跨部门反馈收集（设计师/技术/合规）\n6. 缓冲日：处理临时需求';
                entry.deliverables = '补足文档\n知识库终版';
                entry.kpis = '交付物清单100%完成 / 知识库终版上线';
                entry.aiTools = 'Claude（查漏补缺）+ Notion AI（知识库终版）';
            } else if (dayNum === 62) {
                entry.taskTheme = '述职报告终稿 & 转正材料准备';
                entry.morningTasks = '1. 述职报告最终修订（根据部门主管预审意见）\n2. 转正申请材料准备\n3. 三个月产出物最终盘点';
                entry.afternoonTasks = '4. 个人成长总结与职业规划\n5. AI辅助品牌建设方法论沉淀\n6. 撰写《品牌建设AI方法论总结》';
                entry.deliverables = '《试用期述职报告》终稿\n《品牌建设AI方法论总结》';
                entry.kpis = '述职报告主管预审通过 / 方法论可复制 / 个人规划明确';
                entry.collaborators = '部门主管';
                entry.aiTools = 'Claude（述职终稿+方法论沉淀）';
            } else if (dayNum === 63) {
                entry.taskTheme = '终期汇报预演 & 交接确认';
                entry.morningTasks = '1. 终期汇报PPT最终修改\n2. 汇报预演（至少2轮完整演练）\n3. 时间控制：目标20分钟内完成';
                entry.afternoonTasks = '4. 品牌工作交接：逐模块与对应同事确认\n5. 品牌资产权限移交\n6. 撰写《交接确认签字表》';
                entry.deliverables = '终期汇报PPT终稿\n《交接确认签字表》';
                entry.kpis = '预演≥2轮 / 时间≤20分钟 / 交接100%确认 / 签字完成';
                entry.collaborators = '部门全员';
            } else if (dayNum === 64) {
                entry.taskTheme = '终期述职汇报（正式）';
                entry.morningTasks = '1. 向管理层做终期述职汇报\n2. 品牌全案成果展示（战略→定位→视觉→内容→招商→落地）\n3. 现场答疑与反馈收集';
                entry.afternoonTasks = '4. 人事部转正评估面谈\n5. 提交转正申请材料\n6. 记录管理层终期评价';
                entry.deliverables = '终期汇报完成\n转正评估表\n管理层评价记录';
                entry.kpis = '汇报通过 / 管理层评分≥85 / 转正申请提交 / 反馈记录完整';
                entry.collaborators = '管理层、人事部、部门主管';
            } else if (dayNum === 65) {
                entry.taskTheme = '全部归档 & 试用期收尾';
                entry.morningTasks = '1. 全部工作文档最终归档（本地+云端+Notion三备份）\n2. 品牌知识库关闭编辑权限，进入维护模式\n3. 撰写《试用期工作总结》（最终版）';
                entry.afternoonTasks = '4. 与部门主管做试用期回顾面谈\n5. 确认转正后工作方向与目标\n6. 试用期结束，准备进入正式工作阶段';
                entry.deliverables = '三备份归档完成\n《试用期工作总结》终版\n转正后工作计划初稿';
                entry.kpis = '归档100% / 三备份确认 / 面谈完成 / 转正后方向明确';
                entry.collaborators = '部门主管';
                entry.notes = '试用期结束';
            }
        } else if (week === 12) {
            entry.phase = '第3月·品牌交付期';
            entry.phaseColor = '#1e8449';

            if (dayNum === 56) {
                entry.taskTheme = '三个月成果总梳理';
                entry.morningTasks = '1. 全案产出物汇总：按4大类（战略/品牌/商业/落地）清点\n2. 版本终审：所有文档统一版本号、日期、最终状态\n3. Claude 辅助：《品牌全案最终目录》生成';
                entry.afternoonTasks = '4. 缺失项最后补足\n5. 文档原件+PDF归档\n6. 撰写《品牌全案最终目录》';
                entry.deliverables = '《品牌全案最终目录》\n全案文档原件包';
                entry.kpis = '文档总数 ≥40份 / 零缺失 / 版本统一 / 归档完整';
                entry.aiTools = 'Claude（目录生成+终审）';
            } else if (dayNum === 57) {
                entry.taskTheme = '品牌资产知识库搭建';
                entry.morningTasks = '1. Notion AI 品牌知识库架构：按模块/文档类型/使用场景建导航\n2. 全部文档导入+分类+标签\n3. 建立跨文档引用链接';
                entry.afternoonTasks = '4. 权限设置：只读/编辑/管理员分层\n5. 知识库使用指南撰写\n6. 知识库上线';
                entry.deliverables = 'Notion 品牌资产知识库\n知识库使用指南';
                entry.kpis = '模块 ≥8个 / 文档覆盖率100% / 引用链接 ≥30条 / 权限分层明确';
                entry.aiTools = 'Notion AI（知识库搭建+分类+标签）';
            } else if (dayNum === 58) {
                entry.taskTheme = '试用期述职报告撰写';
                entry.morningTasks = '1. 工作成果回顾：3个月/12周/60天完整产出\n2. 方法论总结：AI辅助品牌建设的系统方法论\n3. Claude 辅助：报告结构化+数据支撑';
                entry.afternoonTasks = '4. 问题与反思：遇到的困难/解决方式/经验教训\n5. 下一步计划：转正后的品牌工作规划\n6. 撰写《试用期述职报告》';
                entry.deliverables = '《试用期述职报告》';
                entry.kpis = '成果数据完整 / 方法论可复制 / 反思 ≥3条 / 下阶段规划清晰';
                entry.aiTools = 'Claude（述职报告撰写+数据整理）';
            } else if (dayNum === 59) {
                entry.taskTheme = '管理层终期汇报准备 & 交接文档';
                entry.morningTasks = '1. 终期汇报 PPT 制作：3个月旅程→核心成果→方法论→展望\n2. 汇报预演：控制在20分钟内\n3. 品牌全案 Demo 展示准备';
                entry.afternoonTasks = '4. 品牌工作交接文档：谁负责什么/文件在哪/下一步动作\n5. 部门协作机制建立：品牌审核流程/内容更新规范/跨部门协作路径\n6. 撰写《品牌工作交接与协作手册》';
                entry.deliverables = '终期汇报 PPT\n《品牌工作交接与协作手册》';
                entry.kpis = 'PPT ≤20页 / 交接文档覆盖所有模块 / 协作机制可执行';
                entry.collaborators = '部门全员';
                entry.aiTools = 'Claude（PPT内容+交接文档）';
            } else if (dayNum === 60) {
                entry.taskTheme = '终期汇报 & 转正评估';
                entry.morningTasks = '1. 向管理层做终期述职汇报\n2. 品牌全案成果展示\n3. 收集终期评价与反馈';
                entry.afternoonTasks = '4. 人事部转正评估面谈\n5. 全部文档最终归档\n6. 个人总结：三个月成长与下一步';
                entry.deliverables = '终期汇报通过\n转正评估表\n全部工作归档完成';
                entry.kpis = '汇报通过 / 转正获批 / 归档100% / 主管评价 ≥85分';
                entry.collaborators = '管理层、人事部、部门主管';
                entry.notes = '试用期结束，进入正式工作阶段';
            }
        }

        return entry;
    });

    return plan;
}

// ============================================================
// 生成 Excel
// ============================================================
function generateExcel() {
    const plan = generateDailyPlan();

    // ---- Sheet 1: 每日工作计划 ----
    const dailyHeaders = [
        '序号', '日期', '第几周', '星期', '工作阶段', '当日主题',
        '上午工作内容（4h）', '下午工作内容（4h）',
        '交付物', '关键考核指标（KPI）',
        '协作方', 'AI工具', '备注'
    ];
    const dailyData = plan.map(e => [
        e.dayNum, e.date, `第${e.week}周`, e.dayOfWeek, e.phase, e.taskTheme,
        e.morningTasks, e.afternoonTasks,
        e.deliverables, e.kpis,
        e.collaborators || '—', e.aiTools || '—', e.notes || ''
    ]);
    dailyData.unshift(dailyHeaders);

    // ---- Sheet 2: 周度汇总 ----
    const weeklyHeaders = [
        '周次', '日期范围', '工作阶段', '本周主题', '核心产出', '关键指标',
        '协作部门', 'AI工具使用', '风险与备注'
    ];
    const weekData = [];
    const weekThemes = {
        1: { theme: '赛道调研 & 竞品分析', output: '行业数据汇总/竞品矩阵/三方痛点图谱/市场机会报告', kpis: '完成5份调研文档 / 覆盖10+平台 / 差异化空间明确', collab: '部门主管', ai: 'Claude（行业调研+竞品分析+痛点归纳）', risk: '—' },
        2: { theme: '品牌定位 & 战略模型', output: '定位方案对比/战略模型/使命愿景价值观/定位手册终稿', kpis: '定位获批 / 战略模型完整 / 管理层认可', collab: '管理层、部门主管', ai: 'Claude（定位推演+战略逻辑+会议摘要）', risk: '管理层决策节奏可能延迟' },
        3: { theme: '品牌命名 & 商标预查', output: '命名策略/候选Top20/商标预查报告/命名终稿', kpis: '命名获批 / 商标可用性确认 / 注册流程启动', collab: '合规部、管理层', ai: 'Claude（名称生成+释义）+网络搜索（商标查重）', risk: '商标被占用需备选方案' },
        4: { theme: '战略总纲 & 月度汇报', output: '战略总纲体系/差异化论证/Slogan体系/月报', kpis: '战略文档≥8000字 / 差异化论证通过 / 月度汇报通过', collab: '管理层、部门主管', ai: 'Claude（文档展开+逻辑审查+月报摘要）', risk: '—' },
        5: { theme: '品牌视觉体系', output: '视觉策略Brief/Logo概念稿/超级符号手册/Logo规范文件', kpis: 'Logo获批 / 视觉手册完整 / 6+版本Logo交付', collab: '设计师（林敬民、李俊坚）', ai: 'Midjourney（Logo概念）+Claude（视觉策略）', risk: '设计师排期冲突' },
        6: { theme: '品牌内容体系', output: '品牌故事/语调指南/核心页面文案/内容策略日历', kpis: '4份文档交付 / 文案一致性通过 / 内容日历覆盖30天', collab: '文案组（唐佳富）', ai: 'Claude（故事/语调/文案+日历）', risk: '—' },
        7: { theme: '商业模式 & 招商体系', output: '商业模式说明/招商战略/招商手册×4/商家SOP', kpis: '商业逻辑闭环 / 合规审查通过 / 招商手册4版交付', collab: '财务部、合规部', ai: 'Claude（收入模型+招商文案+SOP流程）', risk: '合规边界需反复确认' },
        8: { theme: '品牌全案整合 & 月报', output: '全案体系目录/完整性自查/缺口补足/月报', kpis: '体系完整度≥90% / 缺口≤5个 / 月度汇报通过', collab: '管理层、部门主管', ai: 'Claude（全案整合+逻辑审查）+Notion AI（归档）', risk: '—' },
        9: { theme: '落地执行文件', output: '样板社区标准/30天冷启动表/财务模型/服务商管理办法', kpis: '4份执行文档交付 / 可直接用于城市试点', collab: '财务部', ai: 'Claude（标准设计+动作展开+财务建模+KPI体系）', risk: '财务参数需试点验证' },
        10: { theme: '融资路演材料', output: '商业生态白皮书/融资BP/招商手册设计版/路演话术', kpis: '白皮书≥20000字 / BP≤15页 / 对外材料视觉统一', collab: '设计师（李锐）', ai: 'Claude（白皮书+BP）+Gamma（PPT）+Canva（排版）', risk: '—' },
        11: { theme: '品牌物料 & PRD', output: '社区物料包/社媒素材库/PRD/品牌规范手册/链宝IP', kpis: '物料≥7种 / 社媒模板≥15个 / PRD可开发 / 规范≥50条', collab: '设计师、视频组、数字化中心', ai: 'MJ+Canva+剪映AI+Claude', risk: '开发排期需与技术部对齐' },
        12: { theme: '总结汇报 & 归档交接', output: '全案目录/品牌知识库/述职报告/交接手册/终期汇报', kpis: '全案文档≥40份 / 归档100% / 转正获批', collab: '管理层、人事部、部门全员', ai: 'Claude+Notion AI（知识库+述职+交接）', risk: '—' },
        13: { theme: '缓冲补足 & 转正收尾', output: '述职报告终稿/交接确认签字/终期汇报/转正评估/三备份归档', kpis: '交付物100%完成 / 汇报通过 / 转正获批 / 归档三备份', collab: '管理层、人事部、部门主管', ai: 'Claude+Notion AI（终稿+方法论+归档）', risk: '—' },
    };

    for (let w = 1; w <= 13; w++) {
        const info = weekThemes[w];
        const weekDays = plan.filter(e => e.week === w);
        const dateRange = weekDays.length > 0
            ? `${weekDays[0].date} ~ ${weekDays[weekDays.length - 1].date}`
            : '';
        const phase = w <= 4 ? '第1月·品牌地基期' : (w <= 8 ? '第2月·品牌建设期' : '第3月·品牌交付期');
        weekData.push([
            `第${w}周`, dateRange, phase, info.theme, info.output, info.kpis,
            info.collab, info.ai, info.risk
        ]);
    }
    weekData.unshift(weeklyHeaders);

    // ---- Sheet 3: 月度里程碑 ----
    const monthHeaders = ['月份', '阶段名称', '核心目标', '关键里程碑', '交付物数量', '考核标准', 'AI工具使用', '协作部门'];
    const monthData = [
        ['第1个月', '品牌地基期',
            '确定品牌战略方向、完成命名与商标预查、输出战略总纲',
            'W1: 赛道全景分析完成\nW2: 品牌定位获批\nW3: 品牌命名确定\nW4: 战略总纲+差异化定稿',
            '≥15份文档',
            '战略方向获管理层确认 / 商标预查通过 / 定位手册完整度100%',
            'Claude（深度推理+文档展开+内容量产）',
            '管理层、部门主管、合规部'],
        ['第2个月', '品牌建设期',
            '完成品牌视觉体系、内容体系、商业模式、招商体系全案',
            'W5: Logo定型+视觉手册完成\nW6: 内容体系4件套交付\nW7: 商业模式+招商体系定稿\nW8: 品牌全案整合+月报通过',
            '≥15份文档',
            '品牌体系完整度≥90% / Logo获批 / 招商手册可对外 / 合规审查通过',
            'Claude+Midjourney+Canva+Notion AI',
            '设计师、文案组、财务部、合规部'],
        ['第3个月', '品牌交付期',
            '完成落地执行文件、融资路演材料、全套物料，实现品牌从纸面到可执行',
            'W9: 执行文件4件套交付\nW10: 白皮书+BP+路演材料定稿\nW11: 物料包+PRD+品牌规范\nW12: 全案归档+述职+转正',
            '≥15份文档',
            '全案文档≥40份 / BP可对外路演 / PRD可开发 / 知识库上线 / 转正获批',
            'Claude+MJ+Canva+Gamma+剪映+Notion AI',
            '管理层、人事部、设计师、视频组、数字化中心、合规部']
    ];
    monthData.unshift(monthHeaders);

    // ---- Sheet 4: 交付物清单 ----
    const dlvHeaders = ['序号', '交付物名称', '所属阶段', '计划完成周', '文件类型', '协作方', '状态'];
    const deliverables = [
        [1, '3个月工作计划表', '地基期', 'W1', 'Excel', '人事部', '待完成'],
        [2, '行业基础数据汇总', '地基期', 'W1', 'Word', '—', '待完成'],
        [3, '竞品矩阵对比表（含UE模型）', '地基期', 'W1', 'Word', '—', '待完成'],
        [4, '三方痛点与机会图谱', '地基期', 'W1', 'Word', '—', '待完成'],
        [5, '市场机会与可行性报告', '地基期', 'W1', 'Word', '—', '待完成'],
        [6, '品牌定位3方案对比', '地基期', 'W2', 'Word', '—', '待完成'],
        [7, '品牌战略模型图', '地基期', 'W2', 'Word', '—', '待完成'],
        [8, '品牌使命愿景价值观 V1.0', '地基期', 'W2', 'Word', '—', '待完成'],
        [9, '品牌定位体系战略手册', '地基期', 'W2', 'Word', '管理层', '待完成'],
        [10, '品牌命名策略与标准', '地基期', 'W3', 'Word', '—', '待完成'],
        [11, '候选名称Top 20', '地基期', 'W3', 'Word', '—', '待完成'],
        [12, '商标预查报告', '地基期', 'W3', 'Word', '合规部', '待完成'],
        [13, '品牌命名终稿', '地基期', 'W3', 'Word', '管理层', '待完成'],
        [14, '品牌话语体系与Slogan', '地基期', 'W3-W4', 'Word', '—', '待完成'],
        [15, '品牌战略总纲体系 V1.0', '地基期', 'W4', 'Word', '—', '待完成'],
        [16, '品牌差异化战略说明', '地基期', 'W4', 'Word', '—', '待完成'],
        [17, '第1月品牌地基成果包', '地基期', 'W4', '文件夹', '管理层', '待完成'],
        [18, '品牌视觉策略 Brief', '建设期', 'W5', 'Word', '设计师', '待完成'],
        [19, 'Logo 概念方向稿', '建设期', 'W5', 'PDF/PNG', '设计师', '待完成'],
        [20, '品牌视觉与超级符号体系手册', '建设期', 'W5', 'Word', '设计师', '待完成'],
        [21, 'Logo 标准规范文件（含源文件）', '建设期', 'W5', 'AI/PNG/PDF', '设计师', '待完成'],
        [22, '品牌故事体系', '建设期', 'W6', 'Word', '—', '待完成'],
        [23, '品牌语调与文案规范', '建设期', 'W6', 'Word', '文案组', '待完成'],
        [24, '品牌核心页面文案', '建设期', 'W6', 'Word', '—', '待完成'],
        [25, '品牌内容策略与日历', '建设期', 'W6', 'Word', '文案组', '待完成'],
        [26, '商业模式说明', '建设期', 'W7', 'Word', '财务部', '待完成'],
        [27, '招商战略体系', '建设期', 'W7', 'Word', '—', '待完成'],
        [28, '招商手册（通用版+行业版×3）', '建设期', 'W7', 'Word', '合规部', '待完成'],
        [29, '商家合作标准操作流程', '建设期', 'W7', 'Word', '—', '待完成'],
        [30, '品牌全案体系目录', '建设期', 'W8', 'Word', '—', '待完成'],
        [31, '品牌体系完整性自查表', '建设期', 'W8', 'Word', '—', '待完成'],
        [32, '第2月品牌全案成果包', '建设期', 'W8', '文件夹', '管理层', '待完成'],
        [33, '样板社区选择标准', '交付期', 'W9', 'Word', '—', '待完成'],
        [34, '30天冷启动动作表', '交付期', 'W9', 'Word', '—', '待完成'],
        [35, '单社区财务模型', '交付期', 'W9', 'Excel', '财务部', '待完成'],
        [36, '城市服务商管理办法', '交付期', 'W9', 'Word', '—', '待完成'],
        [37, '商业生态白皮书 V1.0', '交付期', 'W10', 'Word/PDF', '—', '待完成'],
        [38, '融资路演 BP（内容版+视觉版）', '交付期', 'W10', 'PPT/PDF', '设计师', '待完成'],
        [39, '路演话术（3版本）', '交付期', 'W10', 'Word', '—', '待完成'],
        [40, '社区线下物料包', '交付期', 'W11', 'AI/PNG/PDF', '设计师', '待完成'],
        [41, '社媒视觉素材库', '交付期', 'W11', 'PSD/PNG/MP4', '设计师、视频组', '待完成'],
        [42, '产品需求文档 PRD', '交付期', 'W11', 'Word', '数字化中心', '待完成'],
        [43, '品牌使用规范手册', '交付期', 'W11', 'Word/PDF', '合规部', '待完成'],
        [44, '链宝 IP 初稿', '交付期', 'W11', 'AI/PNG', '设计师', '待完成'],
        [45, '品牌全案最终目录', '交付期', 'W12', 'Word', '—', '待完成'],
        [46, 'Notion 品牌资产知识库', '交付期', 'W12', 'Notion', '部门全员', '待完成'],
        [47, '试用期述职报告', '交付期', 'W12', 'Word', '人事部', '待完成'],
        [48, '品牌工作交接与协作手册', '交付期', 'W12', 'Word', '部门全员', '待完成'],
        [49, '终期汇报 PPT', '交付期', 'W12', 'PPT', '管理层', '待完成'],
        [50, '周总结和计划报告（×12）', '全程', 'W1-W12', 'Excel', '部门主管', '持续'],
        [51, '月度总结与下月计划（×3）', '全程', 'W4/W8/W12', 'Word', '管理层', '待完成'],
    ];
    dlvHeaders.unshift(dlvHeaders);
    deliverables.unshift(dlvHeaders);

    // ---- Sheet 5: AI 工具使用计划 ----
    const aiHeaders = ['工具名称', '类型', '使用阶段', '使用频次', '核心应用场景', '预计产出效率提升', '月费'];
    const aiData = [
        ['Claude', 'AI 文本/推理', '全程（W1-W12）', '每日', '策略推演、文档展开、文案量产、话术生成、竞品分析、财务建模、逻辑审查、汇报摘要', '3-5倍文案产出效率', '~$20/月'],
        ['Midjourney', 'AI 图像生成', 'W5/W11 集中使用', '集中期每日', 'Logo概念、超级符号延展、IP设计、海报概念、物料视觉方向', '50+概念图/小时 vs 传统3-5张/天', '~$30/月'],
        ['Canva Pro', '在线设计平台', 'W10-W11', '集中期每日', '招商手册排版、社媒模板、物料排版、品牌模板库', '10倍物料排版效率', '~$15/月'],
        ['Notion AI', '知识管理+AI', '全程（每周）', '每周1-2次', '品牌资产库、文档归档、知识管理、工作日志、周报整理', '知识检索时间减少80%', '~$15/月'],
        ['Gamma/美图AI PPT', 'AI PPT生成', 'W10', '集中3-5次', '路演BP初稿、月度汇报PPT、招商宣讲PPT', 'PPT初稿时间从2天缩短至2小时', '~$10/月'],
        ['剪映专业版', 'AI视频剪辑', 'W11', '集中3-5次', '短视频片头/片尾模板、探店视频初剪、社媒视频素材', '视频模板效率提升5倍', '免费'],
    ];
    aiData.unshift(aiHeaders);

    // ---- 创建 Workbook ----
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(wb, ws1, '每日工作计划');

    const ws2 = XLSX.utils.aoa_to_sheet(weekData);
    XLSX.utils.book_append_sheet(wb, ws2, '周度汇总');

    const ws3 = XLSX.utils.aoa_to_sheet(monthData);
    XLSX.utils.book_append_sheet(wb, ws3, '月度里程碑');

    const ws4 = XLSX.utils.aoa_to_sheet(deliverables);
    XLSX.utils.book_append_sheet(wb, ws4, '交付物清单');

    const ws5 = XLSX.utils.aoa_to_sheet(aiData);
    XLSX.utils.book_append_sheet(wb, ws5, 'AI工具使用计划');

    // ---- 设置列宽 ----
    const dailyColWidths = [
        { wch: 5 }, { wch: 12 }, { wch: 8 }, { wch: 6 }, { wch: 18 },
        { wch: 28 }, { wch: 50 }, { wch: 50 },
        { wch: 40 }, { wch: 50 },
        { wch: 25 }, { wch: 30 }, { wch: 15 }
    ];
    ws1['!cols'] = dailyColWidths;

    const weeklyColWidths = [
        { wch: 8 }, { wch: 22 }, { wch: 18 }, { wch: 25 },
        { wch: 50 }, { wch: 40 },
        { wch: 25 }, { wch: 35 }, { wch: 25 }
    ];
    ws2['!cols'] = weeklyColWidths;

    // ---- 写入文件 ----
    const outputPath = path.join(__dirname, '梁君衡_3个月品牌全案工作计划表.xlsx');
    XLSX.writeFile(wb, outputPath);
    console.log('Excel file generated: ' + outputPath);
    console.log('Sheets: 每日工作计划(' + (dailyData.length - 1) + '天), 周度汇总(' + (weekData.length - 1) + '周), 月度里程碑(' + (monthData.length - 1) + '月), 交付物清单(' + (deliverables.length - 1) + '项), AI工具使用计划(' + (aiData.length - 1) + '项)');
}

generateExcel();
