# 链邦赋商通_品牌战略总案 - Design Spec

> Human-readable design narrative. Machine-readable contract: `spec_lock.md`.

## I. Project Information

| Item | Value |
| ---- | ----- |
| **Project Name** | 链邦赋商通_品牌战略总案 |
| **Canvas Format** | PPT 16:9 (1280×720) |
| **Page Count** | 73 |
| **Design Style** | soft-rounded — 圆润卡片、温和层次、亲切可近 |
| **Target Audience** | 创始人与核心团队（内部战略对齐）+ 潜在投资人/合作方 |
| **Use Case** | 内部战略评审、品牌方向决策、投资人路演 |
| **Created Date** | 2026-06-18 |

---

## II. Canvas Specification

| Property | Value |
| -------- | ----- |
| **Format** | PPT 16:9 |
| **Dimensions** | 1280×720 |
| **viewBox** | `0 0 1280 720` |
| **Margins** | left/right 60px, top/bottom 50px |
| **Content Area** | 1160×620 (60px margins) |

---

## III. Visual Theme

### Theme Style

- **Mode**: `pyramid` — 结论先行，MECE论证。每页标题即结论，正文支撑论证。
- **Visual style**: `soft-rounded` — 圆角卡片（rx 12-16）、柔和阴影、温暖舒适留白。
- **Theme**: Light theme — 暖白主背景
- **Tone**: 温暖专业 — 可信但不冷，亲切但不随意，匹配「老街坊组织者」品牌人格

### Color Scheme

用户已明确定义品牌色，直接锁定：

| Role | HEX | Purpose |
| ---- | --- | ------- |
| **Background** | `#FAFAF5` | 暖白主背景（60%） |
| **Secondary bg** | `#F0EDE8` | 卡片背景、区块底色 |
| **Surface** | `#F5F0EA` | 面板浮起、图表底色 |
| **Primary** | `#E67E22` | 标题装饰、关键区块、强调色（25%） |
| **Accent** | `#1A5276` | 数据高亮、链接、次要强调（15%） |
| **Secondary accent** | `#D4A574` | 柔和过渡、木色调细节 |
| **Body text** | `#2C2C2C` | 正文（暖白底对比度≥10:1） |
| **Secondary text** | `#7F8C8D` | 说明文字、脚注 |
| **Tertiary text** | `#A0A0A0` | 辅助信息、页码 |
| **Border/divider** | `#D4A574` | 卡片边框、分隔线 |
| **Grid** | `#E8E3DC` | 图表网格线 |
| **Success** | `#1E8449` | 正向指标、合规通过 |
| **Warning** | `#C0392B` | 风险标记、红线 |

### Gradient Scheme

```xml
<!-- 封面渐变 — 暖橙到深海蓝 -->
<linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#E67E22" stop-opacity="0.12"/>
  <stop offset="50%" stop-color="#FAFAF5" stop-opacity="0"/>
  <stop offset="100%" stop-color="#1A5276" stop-opacity="0.08"/>
</linearGradient>

<!-- 卷分隔页渐变 -->
<linearGradient id="chapterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#E67E22" stop-opacity="0.15"/>
  <stop offset="100%" stop-color="#FAFAF5" stop-opacity="0"/>
</linearGradient>

<!-- 卡片微阴影 -->
<filter id="cardShadow" x="-2%" y="-2%" width="104%" height="108%">
  <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#2C2C2C" flood-opacity="0.06"/>
</filter>
```

---

## IV. Typography System

### Font Plan

**Typography direction**: 温暖人文 × 清晰现代 — 楷体标题呼应「老街坊」温度，微软雅黑正文保证可读性。

| Role | Chinese | English | Fallback tail |
| ---- | ------- | ------- | ------------- |
| **Title** | `KaiTi` | `Georgia` | `serif` |
| **Body** | `"Microsoft YaHei", "PingFang SC"` | `Arial` | `sans-serif` |
| **Emphasis** | same as Body | same as Body | — |
| **Code** | — | — | — |

**Per-role font stacks**:

- Title: `KaiTi, Georgia, "Microsoft YaHei", serif`
- Body: `"Microsoft YaHei", "PingFang SC", Arial, sans-serif`
- Emphasis: same as Body

### Font Size Hierarchy

**Baseline**: Body font size = **20px**（中等密度，适合每页5-8信息点）

| Purpose | Ratio to body | Value @ body=20 | Weight |
| ------- | ------------- | --------------- | ------ |
| Cover title | 3-4x | 60-80px | Bold |
| Chapter opener | 2-2.5x | 40-50px | Bold |
| Page title | 1.5-2x | 30-40px | Bold |
| Hero number | 1.5-2x | 30-40px | Bold |
| Subtitle | 1.2-1.5x | 24-30px | SemiBold |
| **Body content** | **1x** | **20px** | Regular |
| Annotation / caption | 0.7-0.85x | 14-17px | Regular |
| Page number / footnote | 0.5-0.65x | 10-13px | Regular |

---

## V. Layout Principles

### Page Structure

- **Header area**: Title band 100px from top, 60-1160px content width
- **Content area**: 500px height (y=120 to y=620), flexible arrangement
- **Footer area**: 40px bottom band (y=680 to y=720), page number + source

### Layout Pattern Library

| Pattern | Suitable Scenarios |
| ------- | ----------------- |
| **Single column centered** | Covers, conclusions, key points, executive summary |
| **Asymmetric split (3:7)** | Chart vs. takeaway, key number vs. explanation |
| **Top-bottom split** | Process flows, timelines, ultra-wide comparison tables |
| **Three/four column cards** | Feature lists, parallel points, values, three formats comparison |
| **Matrix grid (2×2)** | Two-axis classifications, SWOT, quadrant analysis |
| **Z-pattern / waterfall** | Case studies, methodology overview |
| **Center-radiating** | Ecosystem maps, two-system architecture |
| **Full-bleed + floating text** | Covers, chapter dividers, volume transitions |
| **Negative-space-driven** | Hero quotes, closing statement, mission/vision pages |

### Spacing Specification

**Universal**:

| Element | Value |
| ------- | ----- |
| Safe margin from canvas edge | 60px |
| Content block gap | 32px |
| Icon-text gap | 12px |

**Card-based layouts**:

| Element | Value |
| ------- | ----- |
| Card gap | 24px |
| Card padding | 28px |
| Card border radius | 14px |
| Single-row card height | 540px |
| Three-column card width | 360px |

---

## VI. Icon Usage Specification

### Source

- **Built-in icon library**: `tabler-filled` — 平滑曲线、有机造型、中等重量、亲切可近
- **Usage method**: SVG placeholder `<use data-icon="tabler-filled/icon-name" .../>`

### Recommended Icon List

| Purpose | Icon Path | Page |
| ------- | --------- | ---- |
| 定位/生态位 | `tabler-filled/target` | P05 |
| 使命 | `tabler-filled/flag` | P10 |
| 愿景 | `tabler-filled/eye` | P11 |
| 价值观 | `tabler-filled/shield` | P13 |
| 品牌人格 | `tabler-filled/user` | P14 |
| 视觉方向 | `tabler-filled/palette` | P16 |
| 广告语 | `tabler-filled/message` | P17 |
| 命名 | `tabler-filled/tag` | P18 |
| 商业模型 | `tabler-filled/chart-pie` | P21-P29 |
| 结算/分账 | `tabler-filled/calculator` | P23-P24 |
| 营销 | `tabler-filled/megaphone` | P25 |
| 盈亏平衡 | `tabler-filled/gauge` | P26 |
| 商家/店铺 | `tabler-filled/building-store` | P27 |
| 管理体系 | `tabler-filled/hierarchy` | P28 |
| 执行/路线图 | `tabler-filled/road` | P30-P38 |
| 信息/数据 | `tabler-filled/database` | P31 |
| 验证/飞轮 | `tabler-filled/repeat` | P32 |
| 复制/扩展 | `tabler-filled/arrows-move` | P33 |
| 传教士/IP | `tabler-filled/broadcast` | P34 |
| 预算/财务 | `tabler-filled/coin` | P36 |
| 社区/地点 | `tabler-filled/map-pin` | P37 |
| 风险/合规 | `tabler-filled/alert-triangle` | P39-P46 |
| 红线 | `tabler-filled/ban` | P40 |
| 术语/替换 | `tabler-filled/arrows-exchange` | P41 |
| 附录/记录 | `tabler-filled/notebook` | P47-P53 |
| 竞品分析 | `tabler-filled/zoom-scan` | P48 |
| 方法论 | `tabler-filled/books` | P49 |
| 决策记录 | `tabler-filled/gavel` | P50 |
| 资产清单 | `tabler-filled/archive` | P51 |
| 下一步 | `tabler-filled/arrow-forward` | P52 |
| 消费者 | `tabler-filled/users` | various |
| 商家 | `tabler-filled/building` | various |
| 增长/趋势 | `tabler-filled/trending-up` | various |
| 连接/流转 | `tabler-filled/link` | various |

---

## VII. Visualization Reference List

Catalog read: 71 templates

| Page | Template | Path | Summary-quote (verbatim) | Usage |
| ---- | -------- | ---- | ------------------------ | ----- |
| P05 | venn_diagram | `templates/charts/venn_diagram.svg` | "Pick for 2-3 overlapping sets where the intersection is the message. Skip if no overlap exists (use icon_grid)." | 生态位三圆交集：市场空白 ∩ 用户需求 ∩ 自身能力 |
| P07 | vertical_pillars | `templates/charts/vertical_pillars.svg` | "Pick for 1×3 / 1×4 / 1×5 vertical column layout where each pillar = one independent category with title + bullets" | C+ 四层定位结构展示 |
| P10 | icon_grid | `templates/charts/icon_grid.svg` | "Pick for 4-9 parallel features/capabilities/services as icon cards" | 使命三层结构 + 案例对比 |
| P13 | icon_grid | `templates/charts/icon_grid.svg` | "Pick for 4-9 parallel features/capabilities/services as icon cards" | 四条价值观卡片式展示 |
| P19 | process_flow | `templates/charts/process_flow.svg` | "Pick for 3-8 sequential steps connected by simple arrows" | 品牌价值体系金字塔流程 |
| P22 | hub_spoke | `templates/charts/hub_spoke.svg` | "Pick for 1 core capability + 4-8 surrounding capabilities" | 两大体系架构图 |
| P24 | stacked_bar_chart | `templates/charts/stacked_bar_chart.svg` | "Pick when each category splits into 2-4 internal parts and total still matters. Skip if only comparing totals (use bar_chart)." | 三种业态分账比例堆叠柱状图 |
| P26 | gauge_chart | `templates/charts/gauge_chart.svg` | "Pick for one hero metric's goal achievement rate. Skip for multiple metrics (use bullet_chart for target+actual or progress_bar_chart for completion %)." | 盈亏平衡仪表盘 |
| P28 | top_down_tree | `templates/charts/top_down_tree.svg` | "Pick for hierarchical top-down tree 2-4 levels deep with parent→children reporting/decomposition lines" | 三级管理与推广体系 |
| P35 | timeline | `templates/charts/timeline.svg` | "Pick for 3-8 milestone events on a horizontal time axis (no duration). Skip for tasks with start/end ranges (use gantt_chart) or vertical layout (use roadmap_vertical)." | 三段序列全景时间轴 |
| P36 | donut_chart | `templates/charts/donut_chart.svg` | "Pick for 3-6 part proportions where a center KPI/total deserves emphasis. Skip if no center value to feature (use pie_chart)." | 三步预算分配饼图 |
| P40 | icon_grid | `templates/charts/icon_grid.svg` | "Pick for 4-9 parallel features/capabilities/services as icon cards" | 三条红线展示 |
| P42 | icon_grid | `templates/charts/icon_grid.svg` | "Pick for 4-9 parallel features/capabilities/services as icon cards" | 消费金五不展示 |
| P45 | consulting_table | `templates/charts/consulting_table.svg` | "Pick for high-density tables with embedded micro bar visuals (consulting/financial reports). Skip for plain text data (use basic_table)." | 风险矩阵热力图 |
| P48 | comparison_table | `templates/charts/comparison_table.svg` | "Pick for 2-4 plans/products compared across many feature rows (dense matrix). Skip for pricing-tier marketing layout (use comparison_columns)." | 竞品分析对比表 |

**Runners-up considered** (3 entries minimum):

- `quadrant_text_bullets` | rejected for P07: C+ 四层定位是垂直优先级结构（主轴→助推器→消费者→生态）而非 2×2 矩阵
- `circular_stages` | rejected for P19: 品牌价值体系是线性推导链路（定位→使命→愿景→价值观→人格），非循环闭环
- `funnel_chart` | rejected for P35: 三段序列非漏斗递减——每一段有独立准入/退出标准，时间轴更合适

---

## VIII. Image Resource List

**No images in this deck.** All visual power comes from SVG-native layouts, brand-color gradients, chart templates, and icon accents. Covers and chapter dividers use `<linearGradient>` backgrounds built from the brand color palette (§III Gradient Scheme).

No image resource list is needed.

---

## IX. Content Outline

### Part 1: 战略定位 — 我是谁（P01-P20）

#### P01 · Cover

- **Layout**: Full-screen gradient background + centered title block
- **Title**: 链邦赋商通 · 链生活
- **Subtitle**: 品牌战略总案 — 面向社区商业的数字经营平台
- **Info**: V1.0 | 2026-06-18 | 内部战略文件 | 广东链邦科技有限公司
- **Core message**: 这不是另一个美团——这是一个全新的品类：社区商业数字经营生态。

#### P02 · 目录

- **Layout**: Agenda list — numbered items + brief description per section
- **Title**: 目录
- **Core message**: 五卷结构化呈现：定位→模型→执行→合规→附录，完整品牌战略全景。
- **Visualization**: agenda_list
- **Content**: 卷一·战略定位（P01-P20）/ 卷二·商业模型（P21-P29）/ 卷三·执行路线图（P30-P38）/ 卷四·风险与合规（P39-P46）/ 卷五·附录（P47-P53）

#### P03 · 执行摘要（1/2）— 一句话战略

- **Layout**: Single column centered — hero statement + supporting bullets
- **Title**: 链邦赋商通：让每一家认真经营的小店，不再从零开始经营每一天
- **Core message**: 我们不替代商家，不控制流量，不碰资金——我们帮商家建立属于自己的经营关系。
- **Content**:
  - 三大目标：①帮助商家提升复购率 ②帮助用户获得持续消费权益 ③帮助社区形成可持续商业循环
  - 核心差异化：不是「更好的美团」——美团优化交易效率，链邦赋商通创造关系价值。

#### P04 · 执行摘要（2/2）— 战略全景

- **Layout**: Center-radiating — core platform + three radiating systems
- **Title**: 战略全景：消费流转 × 权益互通 × 三级推广
- **Core message**: 三大系统咬合成一个飞轮：消费流转体系 + 全生态会员权益互通体系 + 三级推广网络，底层是交易即服务费结算。
- **Visualization**: hub_spoke
- **Content**: 消费流转体系（平台商家→联盟商家→综合商城）/ 权益互通体系（代金券·积分·消费金全平台通用）/ 三级推广网络（城市服务商→服务站→推广者）/ 底层：交易即服务费结算 · 汇付直清 · 零资金池

#### P05 · 生态位

- **Layout**: Asymmetric split (3:7) — venn diagram left, analysis right
- **Title**: 生态位 = 市场空白 ∩ 用户需求 ∩ 自身能力
- **Core message**: 社区商业数字经营品类完全空白——有品类无品牌，这是链邦赋商通最重要的战略资产。
- **Visualization**: venn_diagram
- **Content**:
  - 市场空白：本地生活被美团/抖音占据，但「社区商家经营生态」品类空白——CR5不可计算 🟢P0
  - 用户需求：社区商家真实痛点——「服务了无数人，却留不住任何关系」🟢P0
  - 自身能力：小程序已上线、汇付单店分账已跑通、V3.2模型已设计 🟡可验证

#### P06 · 品类定义

- **Layout**: Comparison table —左右双列对比
- **Title**: 品类定义权是链邦赋商通最重要的战略资产
- **Core message**: 如果被归类为「本地生活平台」→ 和美团/抖音比流量→必输。如果成功定义「社区商业数字经营」→ 规则自己定。
- **Visualization**: comparison_table
- **Content**: 美团/抖音本地生活 vs 链邦赋商通：品类·核心逻辑·商家角色·消费者关系·收入模式·商家间关系·六维对比 / 案例：拼多多拒绝「低价版淘宝」→品类定义成功；有赞接受「微信里的淘宝」→活在淘宝影子里

#### P07 · C+ 四层定位结构

- **Layout**: Vertical pillars — 4-column layered structure
- **Title**: C+ = 品类占位（主轴）× 竞争对立（助推器）× 消费者价值 × 生态组织模式
- **Core message**: 先有「我们是谁」（品类占位），再有「我们不是谁」（竞争对立）——B主A辅，顺序不能反。
- **Visualization**: vertical_pillars
- **Content**:
  - 品类占位（对准公众/行业）：社区商业数字经营生态——「你到底是干嘛的」
  - 竞争对立（对准商家）：帮商家从流量依赖走向经营自主——「为什么选你不选美团」
  - 消费者价值（对准消费者）：让每一次社区消费都留下价值——「我为什么来、为什么留」
  - 生态组织模式（对准团队/内部）：连接社区商业，让商家从竞争走向协作——「我们到底在建立什么」

#### P08 · 定位方法选择——决策树回溯

- **Layout**: Decision tree flowchart — left to right branching
- **Title**: 品类定义权的战略选择决定定位方法
- **Core message**: 如果品类=「本地生活平台」→有领导品牌（美团）→进入对立型。如果品类=「社区商业数字经营生态」→没有领导品牌→品类占位型✅。
- **Content**: 决策树第1问→第2问→第3问→第4问 完整路径 / 方法论溯源：《品牌全案策略指南2.0》决策树二 + 里斯&特劳特《定位》

#### P09 · 品牌价值画布

- **Layout**: 6-card grid — 2×3 layout
- **Title**: 品牌价值画布：把生态位翻译成品牌身份
- **Core message**: 链邦赋商通 = 帮社区商家建立经营关系——去中心化、关系归属商家、跨店权益互通。
- **Content**: 生态位·目标用户·核心价值·差异化·信任状·品牌人格 六格卡片

#### P10 · 使命

- **Layout**: Pyramid structure — 三层使命 + 案例对比
- **Title**: 使命：让每一家认真经营的小店，不再从零开始经营每一天
- **Core message**: 社区面馆老板服务了无数人却留不住任何关系——链邦赋商通存在，是让社区商家第一次拥有属于自己的经营关系。
- **Visualization**: icon_grid
- **Content**:
  - 最深（内部）：结束社区商业的「关系每天都在消失」
  - 中层（团队/投资人）：让每一家认真经营的小店，不再从零开始经营每一天
  - 表层（对外沟通）：让每一次社区消费都留下价值
  - 参照案例：Costco·日本商店街协同组合·美团会员通（反例）

#### P11 · 愿景

- **Layout**: Time-axis comparison — 今天 vs 十年后 × 双视角（消费者+商家）
- **Title**: 愿景：让经营关系成为社区商业最重要的资产
- **Core message**: 十年后，消费者不再记得「我在哪个平台买东西」，商家晚上关店后看到的不只是「今天卖了多少」。
- **Content**:
  - 最深：让平台退后一步，让商家重新成为主角
  - 中层：重建社区商业的连接，让经营关系成为最重要的商业资产
  - 表层：让每一次真实消费，都成为社区信任网络的一部分
  - 参照案例：Shopify·日本まちづくり会社·美团优选（反例）

#### P12 · 使命→愿景 逻辑链

- **Layout**: Process flow — 三步逻辑推导
- **Title**: 使命→愿景：从「结束每日归零」到「让信任在社区流动和沉淀」
- **Core message**: 存在理由 = 结束每日归零 × 让信任在社区流动和沉淀。
- **Visualization**: process_flow
- **Content**: 使命（不再从零开始经营每一天）→ 解决「关系每天都在消失」→ 愿景（让经营关系成为最重要的商业资产）→ 交易关系→关系网络

#### P13 · 价值观体系

- **Layout**: 4-card icon grid + 3 scenario tests
- **Title**: 价值观不是你说了什么，而是你面对诱惑时真的拒绝了什么
- **Core message**: 三条戒律+一条裁判规则：真实交易·长期信任·商家自主·生态健康。
- **Visualization**: icon_grid
- **Content**:
  - ①真实交易优于增长幻觉：不做金融化——消费金五不
  - ②长期信任优于短期收益：不碰资金——汇付直清
  - ③商家经营自主优于平台控制：不做竞价排名
  - ④生态健康高于单方利益：前三条的裁判规则
  - 三个未来价值观测试：竞价排名·T+7沉淀资金·代金券抵扣上限

#### P14 · 品牌人格——老街坊组织者

- **Layout**: Personality card — full-width profile + comparison examples
- **Title**: 品牌人格：老街坊组织者——38-45岁，有耐心，擅长连接，不控制
- **Core message**: 「管家」有上下级关系→升级为「组织者」——平等、连接、成全。核心特质：有耐心。
- **Content**:
  - 人格画像6维：原型·年龄·穿着·说话方式·最常说的一句话·现实原型
  - 关键修正：老街坊管家→老街坊组织者
  - 三个说话方式示例对照
  - 参照：三顿半·瑞幸·观夏

#### P15 · 品牌故事 ⚠️

- **Layout**: Story framework card — centered with 「待创始人确认」标记
- **Title**: 品牌故事：那个「必须做」的瞬间
- **Core message**: ⚠️待创始人确认。品牌故事是整个体系中唯一不能推演和编造的模块。
- **Content**:
  - 推荐故事框架（概率最高）：看到认真经营的小店老板，服务了无数顾客却留不住任何关系
  - 三个候选故事原点及概率评估
  - 参照案例：Airbnb·Patagonia·拼多多的起源时刻

#### P16 · 视觉方向

- **Layout**: Asymmetric split — color pie right, mood board left
- **Title**: 视觉方向：傍晚六点半的社区商业街
- **Core message**: 最大的视觉风险不是不好看，而是看起来像金融科技平台。色彩体系已从蓝色主导反转为暖白主导。
- **Content**:
  - 新旧色彩体系对照：旧60%深海蓝→新60%暖白 / 旧30%科技蓝→新25%木色+暖橙 / 旧10%白→新15%深海蓝
  - 三色详解：暖白#FAFAF5·木色暖橙#E67E22·深海蓝#1A5276
  - 第一眼感受排序：可信→亲切→专业
  - 视觉参考：MUJI·星巴克早期社区店·傍晚六点半的社区商业街

#### P17 · 广告语体系

- **Layout**: Three-tier pyramid + candidate comparison table
- **Title**: 广告语：三层沟通——定位语对内，广告语对外
- **Core message**: 「让每一次消费，都留下点什么」vs「让好生意，留在社区」——待定。
- **Content**:
  - 三层结构：品牌定位语（战略层）·广告语（用户层）·品牌片语言（信仰层）
  - 广告语二选一对照
  - 九条候选广告语全记录
  - 竞品广告语对照：三顿半·瑞幸·拼多多·Airbnb

#### P18 · 命名体系

- **Layout**: Three-tier pyramid + character breakdown
- **Title**: 命名：链邦赋商通（B端）× 链生活（C端）
- **Core message**: 「链邦赋商通」建立可信度，「链生活」进入日常生活。
- **Content**:
  - 三层命名：企业/平台名·消费者品牌·口语传播名
  - 五字拆解：链·邦·赋·商·通
  - 名称一致性校验结果
  - 命名迭代路径：V2→V3→V4→赋商版→链邦赋商通（最终）

#### P19 · 品牌价值体系全景

- **Layout**: Process flow — 自上而下推导链 + consistency matrix
- **Title**: 品牌价值体系全景：一致性交叉检验全部通过✅
- **Core message**: 10对交叉检验全部通过。唯一缺口：品牌故事标记「待创始人确认」——这是润色缺口，非结构性矛盾。
- **Visualization**: process_flow
- **Content**: 定位→使命→愿景→价值观→故事→人格→视觉→广告语→命名 完整链条 / Layer 1 一致性交叉检验矩阵（10对全部✅）

#### P20 · 卷一总结

- **Layout**: 5-card summary — 品牌五要素一句话
- **Title**: 卷一总结：品牌五要素一句话
- **Core message**: 定位·使命·愿景·价值观·人格——五要素全部自洽，形成完整品牌身份。
- **Content**: 五要素各一句话总结卡片

### Part 2: 商业模型 — 我怎么运转（P21-P29）

#### P21 · 卷二封面

- **Layout**: Chapter divider — gradient left band + title + core principle
- **Title**: 卷二 · 商业模型 — 我怎么运转
- **Core message**: 交易即服务费结算——平台仅在实际交易发生时获取服务费。零固定费用、零预充值、零资金占用。

#### P22 · 两大体系架构

- **Layout**: Hub-spoke — 中心平台 + 两大体系辐射
- **Title**: 两大体系：消费流转 × 权益互通
- **Core message**: 体系一决定商家怎么被找到，体系二决定价值怎么在商家间流动。
- **Visualization**: hub_spoke
- **Content**:
  - 体系一·消费流转：平台商家（优先·搜索+2·蓝标）→联盟商家（标准·基准位·绿标）→综合商城（补充·搜索-2·灰标）
  - 体系二·权益互通：消费者在任一商家获得权益（代金券/积分/消费金），均可在全平台任意商家使用

#### P23 · V3.2 服务费结算模型——六大原则

- **Layout**: 6 numbered steps — icon + principle + explanation
- **Title**: V3.2 服务费结算模型：六大核心原则
- **Core message**: 交易即结算·汇付直清·跨店通兑不构成二清·消费金五不·100%去金融中心化·风控备用金2%。
- **Visualization**: numbered_steps
- **Content**: 六大原则各配简短解释 / 消费金五不复核逻辑

#### P24 · 三种业态分账比例

- **Layout**: Stacked bar chart — 3 bars × 8 components
- **Title**: 分账比例：平台商家75.4% · 联盟商家71.4% · 综合商城77.9%
- **Core message**: 三种业态差异源于渠道成本和推广依赖度的不同——商家始终是最大受益方。
- **Visualization**: stacked_bar_chart
- **Content**:
  - 平台商家（汇付收单）：渠道0.6% + 商家75.4% + 平台5% + 服务站+推广者9% + 城市服务商1% + 消费金3% + 营销池4% + 风控2%
  - 联盟商家差异：商家71.4%（-4%因平台承担渠道费4.5%）+ 服务站+推广者10%（+1%因更依赖推广）
  - 综合商城差异：商家77.9%（最高·自带流量）+ 平台6%（最高·运营成本）

#### P25 · 三元营销参数体系

- **Layout**: 3-column card cards — 代金券·积分·消费金
- **Title**: 三元营销：代金券·积分·消费金——全平台通用
- **Core message**: 在A店获得，在B店使用——跨店通用是整个模型的发动机。
- **Content**:
  - 代金券：发放比5%·抵扣上限30%·有效期90天·全平台通用
  - 积分：兑换率1:100·抵扣上限20%·有效期2年·全平台通用
  - 消费金：核销上限30%·有效期12个月·全平台通用
  - 🆕跨店通用机制：营销池统一结算·汇付直清·不构成二清

#### P26 · 盈亏平衡分析

- **Layout**: Gauge chart center + sensitivity table right
- **Title**: 盈亏平衡：40,500笔/月，净利率0.89%
- **Core message**: 按日均3-5笔/商户计算需270-450家活跃商户——先验证飞轮，后追求规模。
- **Visualization**: gauge_chart
- **Content**: 盈亏平衡仪表盘 / 敏感性分析三情景（悲观·基准·乐观）：日均交易笔数·所需商户数·商户获客转化率

#### P27 · 千面千店页面体系

- **Layout**: 3-tier comparison — Premium·Standard·Minimal
- **Title**: 千面千店：不是强制路径，是软性优先级引导
- **Core message**: 消费者可自由浏览所有商家——仅默认排序有优先。不是强买强卖，是给认真经营的商家更好的展示。
- **Content**:
  - 平台商家：Premium·高信息密度·搜索+2·品牌认证蓝标·深度自定义
  - 联盟商家：Standard·标准信息密度·搜索基准位·社区好店绿标·6套模板+轻定制
  - 综合商城：Minimal·极简密度·搜索-2·平台自营灰标·标准化模板

#### P28 · 三级管理与推广体系

- **Layout**: Top-down tree — 3-tier organizational hierarchy
- **Title**: 三级管理：城市服务商→服务站→推广者
- **Core message**: 城市服务商不是代理商——核心能力是「组织」，不是「销售」。
- **Visualization**: top_down_tree
- **Content**: 城市服务商（区域合伙人·1%分账）→服务站（社区节点·佣金池内35:65分配）→推广者（一线推广·兼职起步）/ 三角色定位与核心能力对比

#### P29 · 卷二总结

- **Layout**: KPI cards — 10 key numbers
- **Title**: 卷二总结：商业模型关键数字
- **Core message**: 盈亏平衡40,500笔·净利率0.89%·商家最高分账77.9%——数据驱动，参数化运营。
- **Visualization**: kpi_cards
- **Content**: 10项关键指标一览：盈亏平衡点·净利率·商家最高分账·渠道成本·城市服务商分账·风控备用金·营销池·代金券抵扣上限·积分抵扣上限·消费金核销上限

### Part 3: 执行路线图 — 我怎么做（P30-P38）

#### P30 · 卷三封面

- **Layout**: Chapter divider — gradient band + status dashboard teaser
- **Title**: 卷三 · 执行路线图 — 我怎么做
- **Core message**: 核心诊断：战略资产过剩，组织资产归零。这不是坏事——意味着没有错误路径的沉没成本。

#### P31 · 第〇段——信息补全

- **Layout**: 4-quadrant info-gathering checklist
- **Title**: 第〇段：在动任何执行之前，先填满信息黑洞
- **Core message**: 12个问题，5天（6/18-6/22）。答案可以是「零」或「未启动」，但不能是「不知道」。
- **Content**:
  - 四象限：向数字化中心（张冬/江周辉）·向运营/BD负责人·向创始人·自我确认
  - 12个必须回答的问题 + 当前状态 + 获取方式
  - 退出标准：12个问题全部有明确答案

#### P32 · 第一段——验证飞轮

- **Layout**: 3-column parallel plan — P1-1·P1-2·P1-3
- **Title**: 第一段：在一个试点社区内，让飞轮转起来
- **Core message**: 最重要的验证不是「技术能不能做」，而是「消费者愿不愿意在A店领券B店用」。
- **Content**:
  - P1-1 跨店清算技术验证（生死线）：汇付对接→测试环境→2-3家真实交易
  - P1-2 试点社区启动（增长发动机）：社区密度>城市规模>消费能力·20家商户+500消费者
  - P1-3 最小案例生产（复制工具）：3-5个可复用样板案例 / 准入+退出标准

#### P33 · 第二段——复制验证

- **Layout**: 3-column plan — P2-1·P2-2·P2-3
- **Title**: 第二段：从「创始人亲自谈」切换到「推广者复制」
- **Core message**: 验证推广网络的可行性——推广者能不能复制「创始人谈商家的方式」？
- **Content**:
  - P2-1 扩量：20→50家商户·引入1-2名推广者试点
  - P2-2 推广者最小培训体系：商家话术·入驻指南·常见拒绝应对·样板案例集·「带着走一轮」培训方式
  - P2-3 内容体系组织化：商家端3篇·消费者端5篇·行业端1篇·招商端1份 / 准入+退出标准

#### P34 · 第三段——品类传教士

- **Layout**: Dual timeline — 创始人线 + 梁君衡线
- **Title**: 第三段：不投广告，做认知播种
- **Core message**: 品类传教士的核心任务不是推广品牌，是定义品类——让行业先理解品类，再记住品牌。
- **Content**:
  - 创始人（品类传教士·公开IP）：行业沙龙每月1次·深度访谈·定义品类
  - 梁君衡（品牌架构师·半公开IP）：深度文章每季度1篇·36氪/虎嗅/人人都是产品经理·建立心智锚点
  - 准入条件：两人都有内容输出的意愿和能力 / 退出标准：公测期内≥2次对外发声

#### P35 · 三段序列总览

- **Layout**: Timeline — 第〇段→第一段→第二段→第三段（并行）
- **Title**: 三段序列：先开一枪，再开一炮，最后范弗里特弹药量
- **Core message**: 大多数项目死在枪还没开就直接弹药量——先活一个，再复制活的。
- **Visualization**: timeline
- **Content**: 第〇段（本周）→第一段（6下-7中）验证飞轮→第二段（7下-8中）复制验证→第三段（贯穿）品类传教士 / 华为·美团千团大战·Amazon Type 1/2 方法论对照

#### P36 · 预算分配框架

- **Layout**: Donut chart + 3-column budget allocation + 三不投 red cards
- **Title**: 预算顺序 > 预算金额：公测期三步预算
- **Core message**: 先验证飞轮，后优化产品。同样的预算，投千面千店升级→得到「更漂亮」；投试点社区+50家商户+真实交易→得到「真相」。
- **Visualization**: donut_chart
- **Content**:
  - P1 支付与跨店验证 35%：赌一个答案——不管结果如何都要花
  - P2 试点社区 40%：养一个飞轮——花好了能带来持续增长
  - P3 内容体系 25%：做复制工具——P1P2确认后ROI最高
  - 三不投：❌品牌广告投流·❌大规模城市招商·❌深度UI/千面千店2.0

#### P37 · 试点社区选择标准

- **Layout**: Radar chart + selection criteria + candidate map placeholder
- **Title**: 试点社区：尚未做出的关键 Type 1 决策
- **Core message**: 社区密度（3km半径业态混搭程度）> 城市规模 > 消费能力。
- **Content**: 三维雷达图 / 建议实地考察流程 / 候选区域：广州周边可控区域

#### P38 · 卷三总结

- **Layout**: Priority matrix table — P0/P1/P2/P3 + ❌
- **Title**: 卷三总结：执行优先级一页纸
- **Core message**: P0信息补全→P1跨店验证+试点→P2扩量+内容→P3品类传教士。❌品牌广告/城市招商/深度UI。
- **Content**: 7项执行动作按优先级排列：做什么·为什么先做·什么时候做·退出标准

### Part 4: 风险与合规 — 什么不能做（P39-P46）

#### P39 · 卷四封面

- **Layout**: Chapter divider — warning accent gradient
- **Title**: 卷四 · 风险与合规 — 什么不能做
- **Core message**: 三条红线不可触碰。任何一条被突破，项目生存权归零。

#### P40 · 三条红线

- **Layout**: 3-card icon grid — red alert theme
- **Title**: 三条红线：积分不可兑现 · 不可形成资金池 · 不可承诺收益
- **Core message**: 每条红线背后是具体的法律法规——不是「建议」，是生存条件。
- **Visualization**: icon_grid
- **Content**: 三条红线各配：具体要求·为什么是生死线·违反后果

#### P41 · 合规术语映射表

- **Layout**: 16-row comparison table — 红列（禁用词）vs 绿列（替换词）
- **Title**: 16组强制术语替换：从「数字资产」到「消费权益」
- **Core message**: 语言即合规——用错一个词可能触发监管误判。
- **Content**: 16组 ❌禁用词→✅强制替换词+替换原因

#### P42 · 消费金五不

- **Layout**: 5-card icon grid — prohibition theme
- **Title**: 消费金五不：不可充值·不可提现·不可转让·不可买卖·不可兑现
- **Core message**: 「五不」中任何一项被突破→消费金可能被认定为「预付卡」或「电子货币」→触发支付监管。
- **Visualization**: icon_grid
- **Content**: 五项禁止各配说明 / 五不复核逻辑

#### P43 · 信息黑洞清单

- **Layout**: Risk table — 红黄绿三色标注 + 负责人
- **Title**: 13个信息黑洞：不知道=盲目行动
- **Core message**: 8项🔴P0·5项🟡P1——第〇段必须全部填补。
- **Content**: 13个信息黑洞：严重程度·负责方·对战略的影响 / 红黄绿三色标注

#### P44 · 待验证假设清单

- **Layout**: 7-row assumption table — 假设·验证方法·验证时机·Plan B
- **Title**: 7个待验证假设：每个假设都有 Plan B
- **Core message**: 假设不成立不可怕——可怕的是假设不成立但不知道。
- **Content**: 7项假设各配：验证方法·验证时机·如果假设不成立

#### P45 · 风险矩阵

- **Layout**: Risk heatmap — 影响×概率 矩阵
- **Title**: 风险矩阵：8项已识别风险——跨店清算不可行=核心价值主张崩塌
- **Core message**: 🔴P0风险2项·🟡P1风险5项·🟢P2风险1项——全部已配缓解措施。
- **Visualization**: consulting_table
- **Content**: 8项风险：影响·概率·等级·缓解措施 / 风险热力图定位

#### P46 · 卷四总结

- **Layout**: Single column — 合规底线摘要
- **Title**: 卷四总结：合规底线一页纸
- **Core message**: 三条红线+16组术语+消费金五不+100%去金融化+汇付直清——任何对外材料必须经过合规术语扫描。
- **Content**: 合规框架五要素总结

### Part 5: 附录（P47-P53）

#### P47 · 附录A：22轮战略推导记录摘要

- **Layout**: Timeline table — Phase 1A→1B→1D→3A→3B
- **Title**: 附录A：22轮战略推导——从信息采集到执行校验
- **Core message**: 每轮对话产出核心结论，22轮无废轮——完整推导链可追溯。
- **Content**: 6阶段·22轮·模块·核心结论 时间序列表

#### P48 · 附录B：竞品分析摘要

- **Layout**: Comparison table — 8 competitors × 4 dimensions
- **Title**: 附录B：8家竞品——从美团到日本商店街
- **Core message**: 没有直接竞品——链邦赋商通开辟的是全新品类。
- **Visualization**: comparison_table
- **Content**: 美团·抖音生活·有赞·Shopify·兴盛优选·日本商店街·Costco·拼多多——各配核心差异+对链邦赋商通的启示

#### P49 · 附录C：方法论溯源

- **Layout**: Methodology table — 模块·方法论/框架·来源
- **Title**: 附录C：每一个策略判断都能溯源到具体方法论
- **Core message**: 生态位分析·决策树·四层定位·使命三层·价值观过滤器——全部来自《品牌全案策略指南2.0》及经典理论框架。
- **Content**: 15个模块的方法论溯源表

#### P50 · 附录D：关键决策记录

- **Layout**: Decision log table — 8 key decisions with rationale
- **Title**: 附录D：8个关键决策——每一个都有决策依据和替代方案
- **Core message**: 从品类定义到试点社区选择——没有「拍脑袋」，每个决策可复盘。
- **Content**: 8项决策：决策·日期·决策依据·替代方案

#### P51 · 附录E：内容资产清单

- **Layout**: Asset inventory — categorized card grid
- **Title**: 附录E：12项已完成内容资产——26个脚本+模板体系
- **Core message**: 战略资产已完成建设——下一步是将组织资产从零补上。
- **Content**: 模型·合规·执行·手册·营销·画册·命名·评估·可视化·思维导图·记录 12大类资产清单

#### P52 · 附录F：下一步行动清单

- **Layout**: Action checklist — priority-sorted table
- **Title**: 附录F：7项下一步行动——从审阅到知识库同步
- **Core message**: ①审阅本总案→②确认品牌故事→③启动第〇段信息补全→④试点社区考察→⑤冻结V1.0→⑥生成PPTX→⑦同步知识库。
- **Content**: 7项行动：负责人·时限·优先级

#### P53 · 封底

- **Layout**: Full-screen gradient + centered closing quote
- **Title**: 链邦赋商通 · 链生活
- **Core message**: 让每一家认真经营的小店，不再从零开始经营每一天。
- **Content**: 品牌使命结语 / 梁君衡 · 企业宣传策划专员 · 广东链邦科技有限公司 · 2026-06-18

---

## X. Speaker Notes Requirements

- **Filename**: match SVG name (`01_cover.md` → `01_cover.svg`)
- **Style**: Conclusion-first — first sentence of each page's notes is the takeaway, then 2-3 supporting facts. Composed, authoritative. Pyramid mode register.
- **Timing**: ~45 minutes total presentation, ~35 seconds average per page
- **Purpose**: persuade — internal strategy alignment and investor readiness
- **Language**: 中文（简体）

---

## XI. Technical Constraints Reminder

### SVG Generation Must Follow:

1. viewBox: `0 0 1280 720`
2. Background uses `<rect>` elements
3. Text wrapping uses `<tspan>` (`<foreignObject>` FORBIDDEN)
4. Transparency uses `fill-opacity` / `stroke-opacity`; `rgba()` FORBIDDEN
5. FORBIDDEN: `mask`, `<style>`, `class`, `foreignObject`
6. FORBIDDEN: `textPath`, `animate*`, `script`
7. Text characters: raw Unicode only; HTML named entities FORBIDDEN. XML reserved chars escaped as `&amp; &lt; &gt; &quot; &apos;`
8. `clipPath` allowed ONLY on `<image>` elements — single shape child
9. `<g opacity="...">` FORBIDDEN — set opacity on each child element individually
10. Inline styles only; external CSS and `@font-face` FORBIDDEN
11. Card border radius: rx=14 consistent deck-wide (soft-rounded style)
12. Soft shadow filter available via `<filter id="cardShadow">` in `<defs>`
