const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
const outFile = path.join(outDir, '链商2.0_商业模式与核算模型_思维导图.xmind');

// ========== COLOR SYSTEM (for topic styling) ==========
const { COLORS, META } = require("./lib/constants");

const C = {
    MAIN: COLORS.DEEP_BLUE, DARK: '#2C3E50', LIGHT: COLORS.LIGHT_BG,
    RED: COLORS.RED, GREEN: COLORS.GREEN, ORANGE: COLORS.WARM_ORANGE,
    GRAY: COLORS.MID_GRAY, PURPLE: '#8E44AD', TEAL: '#16A085',
    HEADER: '#1a1a2e', YELLOW: COLORS.YELLOW,
};

// ========== ID GENERATOR ==========
let idCounter = 0;
function genId(prefix) {
    idCounter++;
    const ts = Date.now() + idCounter;
    return `${prefix || ''}${ts.toString(36)}${idCounter.toString(36)}`;
}

function ts() { return Date.now() + (idCounter++); }

// ========== BUILD MIND MAP DATA ==========
function buildMindMapData() {
    const rootId = genId('root_');

    // Helper to create a topic node
    function topic(title, children, opts) {
        opts = opts || {};
        const node = {
            id: genId('t'),
            title: title,
            structureClass: opts.structureClass || '',
        };
        if (opts.note) node.note = opts.note;
        if (opts.markers) node.markers = opts.markers;
        if (opts.color) node.color = opts.color;
        if (children && children.length > 0) {
            node.children = children;
        }
        return node;
    }

    function t(title, children, opts) { return topic(title, children, opts); }

    // Markers
    const M = {
        priority1: { 'marker-id': 'priority-1' },
        priority2: { 'marker-id': 'priority-2' },
        priority3: { 'marker-id': 'priority-3' },
        taskStart: { 'marker-id': 'task-start' },
        flag: { 'marker-id': 'flag' },
        star: { 'marker-id': 'star' },
        arrowUp: { 'marker-id': 'arrow-up' },
        info: { 'marker-id': 'symbol-info' },
        newFlag: { 'marker-id': 'month-new' },
    };

    // ============ BRANCH 1: 链商2.0 核心定位 ============
    const branch1 = t('一、链商2.0 核心定位与品牌', [
        t('链商2.0定位', [
            t('面向社区商业的数字经营平台', null, { color: C.MAIN }),
            t('社区商业数字化基础设施', null, { color: C.MAIN }),
        ], { markers: [M.star] }),
        t('三大目标', [
            t('帮助商家提升复购率'),
            t('帮助用户获得持续消费权益'),
            t('帮助社区形成可持续商业循环'),
        ]),
        t('四大核心机制', [
            t('商户独立经营', [
                t('自主定价、自主营销、自主管理'),
                t('平台不干预商家日常运营'),
            ]),
            t('生态会员互通', [
                t('一次注册，全平台通行'),
                t('权益在任一商家获得，全平台可用'),
            ]),
            t('消费权益流转', [
                t('代金券/积分/消费金 三券互通'),
                t('消费流转体系：平台→联盟→商城'),
            ]),
            t('真实交易激励', [
                t('交易即分润原则'),
                t('零固定费用、零预充值、零资金占用'),
                t('平台仅在实际交易发生时获取服务费'),
            ]),
        ], { markers: [M.flag] }),
        t('品牌归属', [
            t('链生活品牌 — 链邦科技'),
            t('全球拼购 (GGbingo) 子公司'),
        ]),
        t('品牌使命', [
            t('让社区商业更简单'),
            t('让消费权益真正属于消费者'),
        ]),
    ], { color: C.MAIN });

    // ============ BRANCH 2: 两大核心体系 ============
    const branch2 = t('二、两大核心体系', [
        t('消费流转体系', [
            t('平台商家 (第一优先级)', [
                t('搜索加权 +2'),
                t('优先展示入口'),
                t('品牌认证蓝标'),
                t('深度自定义 (品牌色/故事/视频/相册)'),
                t('Premium layout 高信息密度'),
            ], { color: C.MAIN }),
            t('联盟商家 (第二优先级)', [
                t('搜索基准位 0'),
                t('延伸履约网络'),
                t('社区好店绿标'),
                t('6套模板 + 轻定制 (品牌色/横幅)'),
                t('Standard layout 标准信息密度'),
            ], { color: C.TEAL }),
            t('综合商城 (第三优先级)', [
                t('搜索加权 -2'),
                t('补充供给'),
                t('平台自营灰标'),
                t('标准化模板，不可自定义'),
                t('Minimal layout 极简密度'),
            ], { color: C.GRAY }),
            t('软性优先级原则', [
                t('消费者可自由浏览所有商家'),
                t('仅默认排序有优先级引导'),
                t('可通过筛选/搜索/分类/地图找到任何商家'),
                t('非强制路径——尊重消费者选择权'),
            ]),
        ], { markers: [M.star, M.newFlag] }),
        t('全生态会员权益互通体系', [
            t('核心逻辑：消费者在任一商家获得权益，均可在全平台任意商家使用'),
            t('代金券全平台通用 🆕', [
                t('A店获得 → B店使用'),
                t('营销池统一结算'),
                t('汇付直清，不构成二清'),
            ]),
            t('积分全平台通用', [
                t('全平台消费均可累积积分'),
                t('全平台消费均可抵扣积分'),
            ]),
            t('消费金全平台通用', [
                t('全平台消费均可核销消费金'),
                t('消费金池汇付托管'),
            ]),
            t('跨店通兑结算机制 🆕', [
                t('消费者在商家B使用商家A产生的券'),
                t('商家B从营销池获得等额结算'),
                t('营销池由全平台所有交易统一注资'),
                t('双边利益在统计上自然平衡'),
            ]),
        ], { markers: [M.star, M.newFlag] }),
    ], { color: C.ORANGE });

    // ============ BRANCH 3: 分润核销模型 V3.2 ============
    const branch3 = t('三、分润核销模型 V3.2', [
        t('支付渠道成本', [
            t('汇付收单: 0.60%', null, { color: C.RED }),
            t('余额支付: 0.10%', null, { color: C.GREEN }),
            t('消费金核销: 0.00%', null, { color: C.GREEN }),
            t('二次提现成本: 0.10%', [
                t('适用: 平台商家/联盟商家/平台/服务站/推广者/城市服务商'),
                t('豁免: 消费者数字账户/营销池/风控备用金/支付渠道'),
            ]),
        ], { markers: [M.priority1] }),
        t('平台商家 × 3种支付方式', [
            t('场景1: 汇付收单 (100%)', [
                t('渠道 0.60% | 商家 75.40% | 平台 5.00%'),
                t('服务站+推广者 9.00% | 城市 1.00%'),
                t('消费金 3.00% | 营销池 4.00% | 风控 2.00%'),
            ], { color: C.MAIN }),
            t('场景2: 余额支付', [
                t('渠道降至0.10%，节省0.50%归入消费金'),
                t('消费金从3.00%→3.50%'),
            ], { color: C.TEAL }),
            t('场景3: 消费金核销', [
                t('30%消费金抵扣 + 70%现金(同场景1)'),
                t('消费者节省渠道成本'),
            ], { color: C.PURPLE }),
            t('服务站内部分配: 服务站35% ↑ 推广者65%'),
        ]),
        t('联盟商家 × 3种支付方式', [
            t('场景4: 汇付收单 (100%)', [
                t('渠道 0.60% | 商家 71.40% | 平台渠道费 4.50%'),
                t('平台 5.00% | 服务站+推广者 10.00%'),
                t('城市 1.00% | 消费金 2.00% | 营销池 3.50% | 风控 2.00%'),
            ], { color: C.MAIN }),
            t('场景5: 余额支付'),
            t('场景6: 消费金核销'),
            t('服务站内部分配: 服务站35% ↑ 推广者65%'),
        ]),
        t('综合商城 × 3种支付方式', [
            t('场景7: 汇付收单 (100%)', [
                t('渠道 0.60% | 商家 77.90% | 平台 6.00%'),
                t('服务站+推广者 6.00% | 城市 1.00%'),
                t('消费金 3.00% | 营销池 3.50% | 风控 2.00%'),
            ], { color: C.MAIN }),
            t('场景8: 余额支付'),
            t('场景9: 消费金核销'),
            t('服务站内部分配: 服务站35% ↑ 推广者65%'),
        ]),
        t('九方利益分配 (汇付收单场景)', [
            t('1. 支付渠道 (0.60%) — 汇付天下'),
            t('2. 商家 (71.40%~77.90%) — 核心收入'),
            t('3. 平台服务费 (5.00%~6.00%) — 平台收入'),
            t('4. 平台商家渠道费 (仅联盟 4.50%)'),
            t('5. 服务站+推广者 (6.00%~10.00%)'),
            t('6. 城市服务商 (1.00%) 🆕'),
            t('7. 消费者消费金 (2.00%~3.00%)'),
            t('8. 代金券营销池 (3.50%~4.00%)'),
            t('9. 风控备用金 (2.00% 汇付托管)'),
        ]),
        t('关键原则', [
            t('所有场景100%分配，零留存'),
            t('无充值、无资金池'),
            t('交易即分润 — 零固定费用'),
            t('汇付全程托管，平台不经手资金'),
        ], { markers: [M.priority1] }),
    ], { color: C.MAIN });

    // ============ BRANCH 4: 三元营销体系 ============
    const branch4 = t('四、三元营销体系', [
        t('代金券 🆕全平台通用', [
            t('发放率: 每笔消费额的 5%'),
            t('抵扣上限: 单笔消费的 30%'),
            t('有效期: 90天'),
            t('成本承担: 平台营销池'),
            t('跨店使用: A店获得→B店使用'),
        ], { markers: [M.newFlag] }),
        t('积分', [
            t('累积率: ¥1消费 = 1积分'),
            t('兑换率: 100积分 = ¥1'),
            t('抵扣上限: 单笔消费的 20%'),
            t('有效期: 2年'),
            t('成本承担: 平台服务费'),
            t('全平台通用'),
        ]),
        t('消费金', [
            t('核销上限: 单笔消费的 30%'),
            t('有效期: 12个月'),
            t('转让限制: 仅限直系亲属'),
            t('成本承担: 消费者预充值池'),
            t('全平台通用'),
        ]),
        t('营销池统一结算机制', [
            t('全平台所有交易按3.5%~4%注资'),
            t('汇付托管，统一公共池'),
            t('非"每个商家独立子池"'),
            t('任何商家接受的券，从统一池获等额结算'),
        ]),
        t('三元FABE转化', [
            t('Features: 三券体系覆盖所有消费场景'),
            t('Advantages: 全平台通用→使用场景无限扩大'),
            t('Benefits: 消费者"在哪花都在省，在哪得的券都能用"'),
            t('Evidence: 跨店核销率提升→GMV增长→营销池扩大'),
        ]),
    ], { color: C.ORANGE });

    // ============ BRANCH 5: 三级管理网络 ============
    const branch5 = t('五、三级管理网络', [
        t('城市服务商 (区域合伙人)', [
            t('层级: 第一级'),
            t('提成: 每笔交易1% (来自分账池)'),
            t('职责: 区域招商/服务站招募与管理/城市营销活动/政府关系'),
            t('独立于服务站/推广者佣金池'),
        ], { markers: [M.newFlag] }),
        t('服务站 (社区节点)', [
            t('层级: 第二级'),
            t('收入: 佣金池×35%管理费'),
            t('职责: 社区商家招募/推广者管理/本地化服务'),
        ]),
        t('推广者 (一线推广)', [
            t('层级: 第三级'),
            t('收入: 佣金池×65%'),
            t('收入来源: 服务站发放'),
            t('职责: 邀请商家入驻/消费者拉新/推广素材传播'),
        ]),
        t('管理层级关系', [
            t('城市服务商 → 服务站 → 推广者'),
            t('城市服务商拿区域提成，服务站拿管理费'),
            t('两者利益不重叠，各司其职'),
        ]),
    ], { color: C.PURPLE });

    // ============ BRANCH 6: 千面千店 ============
    const branch6 = t('六、千面千店 · 页面设计层级', [
        t('平台商家 — Premium 精品', [
            t('信息密度: 高 (High)'),
            t('视觉规格: 品牌色自定义 + 品牌故事区 + 视频 + 相册'),
            t('搜索加权: +2'),
            t('认证标识: 品牌认证蓝标'),
            t('模板选择: 深度自定义，无模板限制'),
        ], { color: C.MAIN }),
        t('联盟商家 — Standard 标准', [
            t('信息密度: 中 (Standard)'),
            t('视觉规格: 品牌色 + 横幅 轻定制'),
            t('搜索加权: 0 (基准位)'),
            t('认证标识: 社区好店绿标'),
            t('模板选择: 6套模板可选'),
        ], { color: C.TEAL }),
        t('综合商城 — Minimal 极简', [
            t('信息密度: 低 (Minimal)'),
            t('视觉规格: 标准化模板，不可自定义'),
            t('搜索加权: -2'),
            t('认证标识: 平台自营灰标'),
            t('模板选择: 无选择，统一模板'),
        ], { color: C.GRAY }),
        t('设计六维度对比', [
            t('信息密度: 高 → 中 → 低'),
            t('视觉自由度: 深度自定义 → 轻定制 → 标准化'),
            t('搜索优先级: +2 → 0 → -2'),
            t('认证标识: 蓝标 → 绿标 → 灰标'),
            t('页面组件: 完整组件 → 标准组件 → 基础组件'),
            t('品牌表达: 全面 → 适度 → 最小化'),
        ]),
    ], { color: C.MAIN });

    // ============ BRANCH 7: 盈亏平衡模型 ============
    const branch7 = t('七、盈亏平衡模型', [
        t('月固定成本: ¥190,000', [
            t('技术基础设施: ¥50,000'),
            t('人员工资: ¥80,000'),
            t('办公场地: ¥20,000'),
            t('市场推广: ¥30,000'),
            t('合规审计: ¥10,000'),
        ]),
        t('单笔交易经济模型', [
            t('平均服务费/笔: ¥5.33 (平台/联盟/商城均值)'),
            t('平均渠道成本/笔: ¥0.60'),
            t('毛利润/笔: ¥4.73'),
            t('固定成本分摊/笔: ¥3.80 (@50,000笔)'),
            t('净利润/笔: ¥0.93 (@50,000笔)'),
        ]),
        t('盈亏平衡分析', [
            t('盈亏平衡点: 40,500笔/月'),
            t('日均交易: 1,350笔 (@40,500笔/月)'),
            t('目标月交易: 50,000笔'),
            t('净利润率: 0.89% (@50,000笔)'),
            t('盈亏平衡达成率: 123.5%'),
        ], { markers: [M.star] }),
        t('敏感性分析', [
            t('交易量±10% → 净利润变动±¥4,730/月'),
            t('固定成本±10% → 盈亏平衡点±4,181笔'),
            t('平台费率±0.5% → 净利润变动±¥2,500/月'),
        ]),
    ], { color: C.GREEN });

    // ============ BRANCH 8: 合规风控 ============
    const branch8 = t('八、合规风控体系', [
        t('三条合规红线', [
            t('1. 积分不可兑现', [
                t('积分仅可用于消费抵扣'),
                t('不可兑换现金/转账/提现'),
            ], { markers: [M.priority1] }),
            t('2. 不可形成资金池', [
                t('汇付天下全程托管'),
                t('平台不经手消费者资金'),
                t('无充值、无预存机制'),
            ], { markers: [M.priority1] }),
            t('3. 不可承诺收益', [
                t('不可使用"稳赚""躺赚""投资回报"'),
                t('不可暗示经济回报/增值预期'),
                t('合规术语："服务费"→非"收益"'),
            ], { markers: [M.priority1] }),
        ], { markers: [M.flag], color: C.RED }),
        t('14项合规术语映射', [
            t('"数字资产" → "消费权益/会员权益"'),
            t('"数字信用债券" → "商家营销额度"'),
            t('"资产增值" → "权益升级"'),
            t('"消费信用分" → "消费活跃度指数"'),
            t('"分润算法优化引擎" → "商家服务费计算规则"'),
            t('"收益/盈利" → "服务费/增收"'),
            t('"红利/增值回报" → "权益升级/消费权益"'),
            t('"资本(化)" → "资源/产业"'),
            t('"变现" → "转化"'),
            t('"创业" → "参与/开展推广"'),
            t('"全球化" → "全国化/本地化"'),
            t('"数据确权" → "数据权益管理"'),
            t('"数据即资产" → "数据驱动经营"'),
            t('禁止: "币" "Token" "通证" "投资回报" "稳赚" "躺赚"'),
        ]),
        t('风控参数', [
            t('风控备用金: 2.00% (汇付托管)'),
            t('跨店通兑不构成二清: 汇付直清'),
            t('100%去金融中心化'),
        ]),
        t('跨店通兑合规审查', [
            t('✅ 不触碰积分不可兑现红线: 仍是消费抵扣权益'),
            t('✅ 不形成资金池: 营销池汇付托管，平台不经手'),
            t('✅ 不构成二清: 汇付直接向接受商家结算'),
        ]),
    ], { color: C.RED });

    // ============ BRANCH 9: 消费时序引导 ============
    const branch9 = t('九、消费时序引导 (四阶段)', [
        t('阶段1: 品牌认知', [
            t('用户通过推广者/社区活动/线上渠道进入平台'),
            t('首次接触平台商家Premium页面'),
            t('注册会员，建立消费档案'),
        ]),
        t('阶段2: 首次消费', [
            t('在平台商家完成首次消费'),
            t('获得代金券(5%) + 积分(1:1) + 消费金'),
            t('了解"三券全平台通用"权益'),
        ]),
        t('阶段3: 跨店探索', [
            t('携带平台商家获得的券，探索联盟商家'),
            t('在联盟商家使用券 → 发现新商家'),
            t('再次获得新券 → 循环探索'),
        ]),
        t('阶段4: 生态覆盖', [
            t('消费全面覆盖平台→联盟→商城'),
            t('权益持续累积，消费选择最大化'),
            t('成为生态会员，享受持续性消费权益'),
        ]),
    ], { color: C.TEAL });

    // ============ BRANCH 10: 技术架构 ============
    const branch10 = t('十、技术架构与支付体系', [
        t('支付基础设施', [
            t('汇付天下 — 支付收单'),
            t('汇付天下 — 分账清算'),
            t('汇付天下 — 资金托管'),
            t('微信商户号 — 二次提现通道'),
        ]),
        t('账户体系', [
            t('消费者数字权益账户 (积分/代金券/消费金)'),
            t('商家结算账户 (交易款结算)'),
            t('服务站管理账户 (佣金管理)'),
            t('推广者佣金账户 (推广收入)'),
            t('城市服务商提成账户'),
        ]),
        t('系统模块', [
            t('千面千店CMS (三级商家页面管理)'),
            t('营销池管理系统 (三券发行/核销/结算)'),
            t('消费权益引擎 (积分计算/代金券发放)'),
            t('风控合规引擎 (反洗钱/交易监控)'),
            t('三级管理后台 (城市/服务站/推广者)'),
            t('数据分析平台 (商家/用户/交易分析)'),
        ]),
        t('资金流转路径', [
            t('消费者支付 → 汇付收单 → 实时分账 → 九方到账'),
            t('消费者用券 → 营销池结算 → 商家等额到账'),
            t('各方提现 → 微信商户号 → 银行账户 (0.1%)'),
        ]),
    ], { color: C.DARK });

    // ============ BRANCH 11: 关键指标体系 ============
    const branch11 = t('十一、关键指标体系 (KPI Scorecard)', [
        t('商家增长', [
            t('平台商家入驻数: 目标50家/月'),
            t('联盟商家入驻数: 目标200家/月'),
            t('商家留存率: 目标>85%'),
        ]),
        t('用户增长', [
            t('月活用户: 目标50,000+'),
            t('注册转化率: 目标>30%'),
            t('用户留存率 (30日): 目标>60%'),
        ]),
        t('交易指标', [
            t('月交易笔数: 目标50,000笔'),
            t('月GMV: 目标¥5,000,000 (@¥100均单)'),
            t('盈亏平衡: 40,500笔/月'),
            t('净利润率: 0.89%'),
        ]),
        t('营销效率', [
            t('代金券核销率: 目标>40%'),
            t('积分使用率: 目标>30%'),
            t('跨店使用率: 目标>25%'),
            t('ROI (营销支出/GMV增量): 目标>5x'),
        ]),
        t('合规风控', [
            t('风控备用金充足率: 2.00%'),
            t('合规术语命中率: 0% (零禁用词)'),
            t('用户投诉率: <0.1%'),
            t('资金结算时效: T+1'),
        ]),
    ], { color: C.MAIN });

    // ============ BRANCH 12: 版本演进 ============
    const branch12 = t('十二、模型版本演进', [
        t('V1.0 — 初始分润模型', [
            t('6方利益分配'),
            t('12种子模型'),
            t('4项P0问题识别'),
        ]),
        t('V2.0 — 修订版 (6/4会议)', [
            t('无充值、无资金池'),
            t('扣除渠道成本'),
            t('六方利益分配'),
            t('盈亏平衡模型建立'),
        ]),
        t('V3.0 — 链商2.0版', [
            t('三元营销体系建立'),
            t('消费流转体系引入'),
            t('九场景分账模型'),
        ]),
        t('V3.1 — 城市服务商版', [
            t('新增城市服务商1%提成'),
            t('营销池相应调整 (4.5%→4%)'),
            t('三级管理体系建立'),
        ]),
        t('V3.2 — 跨店通兑版 (当前)', [
            t('🆕 跨店通用权益结算'),
            t('🆕 千面千店页面设计规范'),
            t('🆕 交易即分润原则正式确立'),
            t('🆕 消费时序引导机制'),
            t('🆕 全生态会员权益互通体系'),
            t('核心分账比例100%不变'),
        ], { markers: [M.star, M.newFlag] }),
    ], { color: C.GRAY });

    // ============ ROOT ============
    const root = {
        id: rootId,
        title: '链商2.0 · 链生活品牌\n商业模式全景图 & 核算模型\nV3.2 · 跨店通兑版',
        structureClass: 'org.xmind.ui.map.unbalanced',
        children: [
            branch1, branch2, branch3, branch4, branch5, branch6,
            branch7, branch8, branch9, branch10, branch11, branch12,
            // 原核算模型独立分支
            t('📊 原始核算模型 — 9场景100%分配一览', [
                t('平台商家 (汇付)', [t('渠道0.6+商家75.4+平台5+服务站9+城市1+消费金3+营销池4+风控2=100')]),
                t('平台商家 (余额)', [t('渠道降至0.1，消费金从3→3.5')]),
                t('平台商家 (消费金核销)', [t('30%消费金抵扣+70%标准分账')]),
                t('联盟商家 (汇付)', [t('渠道0.6+商家71.4+渠道费4.5+平台5+服务站10+城市1+消费金2+营销池3.5+风控2=100')]),
                t('联盟商家 (余额)', [t('渠道降至0.1')]),
                t('联盟商家 (消费金核销)', [t('30%消费金抵扣+70%标准分账')]),
                t('综合商城 (汇付)', [t('渠道0.6+商家77.9+平台6+服务站6+城市1+消费金3+营销池3.5+风控2=100')]),
                t('综合商城 (余额)', [t('渠道降至0.1')]),
                t('综合商城 (消费金核销)', [t('30%消费金抵扣+70%标准分账')]),
                t('六方利益对照表', [
                    t('平台商家: ¥75.40/¥100'),
                    t('联盟商家: ¥71.40/¥100'),
                    t('综合商城: ¥77.90/¥100'),
                    t('平台服务费: ¥5.00~6.00/¥100'),
                    t('推广体系: ¥6.00~10.00/¥100'),
                    t('城市服务商: ¥1.00/¥100'),
                ]),
                t('三元营销参数一览', [
                    t('代金券: 5%发放 | 30%上限 | 90天 | 全平台通用'),
                    t('积分: 1¥=1积分 | 100:1兑换 | 20%上限 | 2年 | 全平台通用'),
                    t('消费金: 30%核销上限 | 12月有效 | 全平台通用'),
                    t('营销池: 全平台交易3.5-4%注资 | 汇付托管'),
                ]),
                t('月固定成本 ¥190,000', [
                    t('盈亏平衡 40,500笔/月'),
                    t('目标 50,000笔/月'),
                    t('净利润率 0.89%'),
                    t('毛利率 88.7%'),
                ]),
            ], { color: C.MAIN, markers: [M.priority1] }),
        ],
    };

    return root;
}

// ========== GENERATE XMIND XML ==========
function generateContentXML(root) {
    let xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
    xml += '<xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" version="2.0">\n';

    // Generate sheet
    const sheetId = genId('sheet');
    xml += `  <sheet id="${sheetId}" timestamp="${ts()}">\n`;
    xml += `    <title>链商2.0 商业模式全景图 V3.2</title>\n`;
    xml += generateTopicXML(root, '    ');
    xml += '  </sheet>\n';
    xml += '</xmap-content>\n';
    return xml;
}

function generateTopicXML(node, indent) {
    let xml = '';
    const structureClass = node.structureClass || '';

    let topicAttrs = `id="${node.id}" timestamp="${ts()}"`;
    if (structureClass) {
        topicAttrs += ` structure-class="${structureClass}"`;
    }

    xml += `${indent}<topic ${topicAttrs}>\n`;

    // Title
    const titleText = escapeXml(node.title);
    if (titleText.includes('\n')) {
        // Multi-line title
        xml += `${indent}  <title>\n`;
        const lines = titleText.split('\n');
        for (const line of lines) {
            xml += `${indent}    <xhtml:p>${line}</xhtml:p>\n`;
        }
        xml += `${indent}  </title>\n`;
    } else {
        xml += `${indent}  <title>${titleText}</title>\n`;
    }

    // Markers
    if (node.markers && node.markers.length > 0) {
        xml += `${indent}  <marker-refs>\n`;
        for (const m of node.markers) {
            xml += `${indent}    <marker-ref marker-id="${m['marker-id']}"/>\n`;
        }
        xml += `${indent}  </marker-refs>\n`;
    }

    // Note
    if (node.note) {
        xml += `${indent}  <notes>\n`;
        xml += `${indent}    <xhtml:p>${escapeXml(node.note)}</xhtml:p>\n`;
        xml += `${indent}  </notes>\n`;
    }

    // Labels (color)
    if (node.color) {
        xml += `${indent}  <labels>\n`;
        xml += `${indent}    <label svg:fill="${node.color}" font-color="#ffffff">●</label>\n`;
        xml += `${indent}  </labels>\n`;
    }

    // Children
    if (node.children && node.children.length > 0) {
        xml += `${indent}  <children>\n`;
        xml += `${indent}    <topics type="attached">\n`;
        for (const child of node.children) {
            xml += generateTopicXML(child, indent + '      ');
        }
        xml += `${indent}    </topics>\n`;
        xml += `${indent}  </children>\n`;
    }

    xml += `${indent}</topic>\n`;
    return xml;
}

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateStylesXML() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xmap-styles xmlns="urn:xmind:xmap:xmlns:style:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <styles>
    <style id="default" type="topic">
      <topic-properties svg:fill="#1A5276" line-color="#1A5276" line-width="2pt" shape-class="org.xmind.topicShape.roundedRect" color="#ffffff" font-family="微软雅黑" font-size="14pt"/>
    </style>
    <style id="level1" type="topic">
      <topic-properties svg:fill="#2C3E50" line-color="#2C3E50" line-width="2pt" shape-class="org.xmind.topicShape.roundedRect" color="#ffffff" font-family="微软雅黑" font-size="13pt"/>
    </style>
    <style id="level2" type="topic">
      <topic-properties svg:fill="#EBF5FB" line-color="#1A5276" line-width="1.5pt" shape-class="org.xmind.topicShape.roundedRect" color="#333333" font-family="微软雅黑" font-size="12pt"/>
    </style>
    <style id="level3" type="topic">
      <topic-properties line-color="#7F8C8D" line-width="1pt" color="#333333" font-family="微软雅黑" font-size="11pt"/>
    </style>
  </styles>
  <master-styles/>
</xmap-styles>`;
}

function generateManifestXML() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest xmlns="urn:xmind:xmap:xmlns:manifest:1.0">
  <file-entry full-path="content.xml" media-type="text/xml"/>
  <file-entry full-path="styles.xml" media-type="text/xml"/>
  <file-entry full-path="META-INF/" media-type=""/>
</manifest>`;
}

// ========== PURE NODE.JS ZIP CREATOR ==========
// Simple ZIP format implementation — no external dependencies
function createZipFile(zipPath, files) {
    // files: [{ name: string, content: Buffer }]
    const localFileHeaders = [];
    const centralDirEntries = [];
    let dataOffset = 0;

    // Write local file headers + data
    const dataBuffers = [];
    for (const file of files) {
        const nameBuffer = Buffer.from(file.name, 'utf-8');
        const contentBuffer = file.content;
        const crc = crc32(contentBuffer);

        // Local file header
        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0);          // signature
        localHeader.writeUInt16LE(20, 4);                   // version needed
        localHeader.writeUInt16LE(0x0800, 6);               // flags (UTF-8)
        localHeader.writeUInt16LE(0, 8);                    // compression (stored)
        localHeader.writeUInt16LE(0, 10);                   // mod time
        localHeader.writeUInt16LE(0, 12);                   // mod date
        localHeader.writeUInt32LE(crc, 14);                  // CRC-32
        localHeader.writeUInt32LE(contentBuffer.length, 18); // compressed size
        localHeader.writeUInt32LE(contentBuffer.length, 22); // uncompressed size
        localHeader.writeUInt16LE(nameBuffer.length, 26);    // filename length
        localHeader.writeUInt16LE(0, 28);                    // extra field length

        dataBuffers.push(localHeader);
        dataBuffers.push(nameBuffer);
        dataBuffers.push(contentBuffer);

        // Central directory entry
        const cdEntry = Buffer.alloc(46);
        cdEntry.writeUInt32LE(0x02014b50, 0);               // signature
        cdEntry.writeUInt16LE(20, 4);                        // version made by
        cdEntry.writeUInt16LE(20, 6);                        // version needed
        cdEntry.writeUInt16LE(0x0800, 8);                    // flags (UTF-8)
        cdEntry.writeUInt16LE(0, 10);                        // compression
        cdEntry.writeUInt16LE(0, 12);                        // mod time
        cdEntry.writeUInt16LE(0, 14);                        // mod date
        cdEntry.writeUInt32LE(crc, 16);                      // CRC-32
        cdEntry.writeUInt32LE(contentBuffer.length, 20);     // compressed size
        cdEntry.writeUInt32LE(contentBuffer.length, 24);     // uncompressed size
        cdEntry.writeUInt16LE(nameBuffer.length, 28);        // filename length
        cdEntry.writeUInt16LE(0, 30);                        // extra field length
        cdEntry.writeUInt16LE(0, 32);                        // file comment length
        cdEntry.writeUInt16LE(0, 34);                        // disk number start
        cdEntry.writeUInt16LE(0, 36);                        // internal attrs
        cdEntry.writeUInt32LE(0, 38);                        // external attrs
        cdEntry.writeUInt32LE(dataOffset, 42);               // relative offset

        centralDirEntries.push(cdEntry);
        centralDirEntries.push(nameBuffer);

        dataOffset += 30 + nameBuffer.length + contentBuffer.length;
    }

    // End of central directory record
    const cdStart = dataOffset;
    let cdSize = 0;
    for (const entry of centralDirEntries) {
        cdSize += entry.length;
    }

    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);       // signature
    eocd.writeUInt16LE(0, 4);                  // disk number
    eocd.writeUInt16LE(0, 6);                  // disk with CD
    eocd.writeUInt16LE(files.length, 8);       // entries on disk
    eocd.writeUInt16LE(files.length, 10);      // total entries
    eocd.writeUInt32LE(cdSize, 12);            // CD size
    eocd.writeUInt32LE(cdStart, 16);           // CD offset
    eocd.writeUInt16LE(0, 20);                 // comment length

    // Concatenate everything
    const allBuffers = [...dataBuffers, ...centralDirEntries, eocd];
    return Buffer.concat(allBuffers);
}

// CRC-32 implementation
function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i];
        for (let j = 0; j < 8; j++) {
            if (crc & 1) {
                crc = (crc >>> 1) ^ 0xEDB88320;
            } else {
                crc = crc >>> 1;
            }
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ========== CREATE XMIND FILE ==========
function createXmind() {
    console.log('Building mind map data structure...');
    const root = buildMindMapData();

    console.log('Generating content.xml...');
    const contentXML = generateContentXML(root);

    console.log('Generating styles.xml...');
    const stylesXML = generateStylesXML();

    console.log('Generating META-INF/manifest.xml...');
    const manifestXML = generateManifestXML();

    // Ensure output directory exists
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Build file list
    const files = [
        { name: 'content.xml', content: Buffer.from(contentXML, 'utf-8') },
        { name: 'styles.xml', content: Buffer.from(stylesXML, 'utf-8') },
        { name: 'META-INF/manifest.xml', content: Buffer.from(manifestXML, 'utf-8') },
    ];

    console.log('\nCreating XMind (ZIP) archive with pure Node.js...');
    console.log(`  content.xml: ${(files[0].content.length / 1024).toFixed(1)} KB`);
    console.log(`  styles.xml: ${(files[1].content.length / 1024).toFixed(1)} KB`);
    console.log(`  manifest.xml: ${(files[2].content.length / 1024).toFixed(1)} KB`);

    const zipBuffer = createZipFile(outFile, files);

    // Remove existing output file
    if (fs.existsSync(outFile)) {
        fs.unlinkSync(outFile);
    }

    // Write the XMind file
    fs.writeFileSync(outFile, zipBuffer);

    // Verify output
    if (fs.existsSync(outFile)) {
        const stats = fs.statSync(outFile);
        console.log(`\n✅ XMind file generated successfully!`);
        console.log(`   File: ${outFile}`);
        console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
        console.log(`   Content: ${files.length} files in ZIP archive`);
        console.log(`\n   Open with: XMind 8+ / XMind 2020+ / XMind.app`);
    } else {
        console.log('\n❌ Failed to generate XMind file.');
    }
}

// ========== RUN ==========
console.log('=' .repeat(60));
console.log(' 链商2.0 · 商业模式与核算模型 · XMind思维导图生成器');
console.log('='.repeat(60));
console.log();

createXmind();
