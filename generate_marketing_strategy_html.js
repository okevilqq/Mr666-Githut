const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
const outFile = path.join(outDir, '链商平台_营销策略制定方案_V2.0_可视化演示.html');

// ========== DATA FROM V3.2 MODEL & MARKETING STRATEGY (链商2.0) ==========
const { COLORS, META } = require('./lib/constants');

const C = {
    MAIN: COLORS.DEEP_BLUE, DARK: '#2C3E50', LIGHT: COLORS.LIGHT_BG, WHITE: COLORS.WHITE,
    BLACK: COLORS.DARK_GRAY, GRAY: COLORS.MID_GRAY, RED: COLORS.RED, GREEN: COLORS.GREEN,
    ORANGE: COLORS.WARM_ORANGE, HEADER: '#1a1a2e', YELLOW: COLORS.YELLOW,
    LIGHT_ORANGE: '#FFF5F0', LIGHT_RED: '#FFF5F5', LIGHT_GREEN: '#F0FFF4',
};

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>链商2.0 · 链生活品牌 — 平台营销策略制定方案 V2.0</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<style>
/* ====== CSS RESET & BASE ====== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'${FONT.body}','Microsoft YaHei','PingFang SC',sans-serif;color:${C.BLACK};background:#f0f2f5;line-height:1.7;overflow-x:hidden}

/* ====== NAVIGATION ====== */
.side-nav{position:fixed;left:0;top:0;width:260px;height:100vh;background:${C.HEADER};z-index:1000;overflow-y:auto;padding:20px 0;box-shadow:2px 0 20px rgba(0,0,0,0.15);transition:transform 0.3s}
.side-nav .nav-logo{text-align:center;padding:10px 20px 20px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:10px}
.side-nav .nav-logo h3{color:#fff;font-size:16px;font-weight:700;letter-spacing:1px}
.side-nav .nav-logo small{color:${C.GRAY};font-size:11px}
.side-nav a{display:block;padding:10px 24px;color:rgba(255,255,255,0.7);text-decoration:none;font-size:13px;border-left:3px solid transparent;transition:all 0.2s}
.side-nav a:hover,.side-nav a.active{color:#fff;background:rgba(255,255,255,0.06);border-left-color:${C.ORANGE}}
.side-nav a.chapter{font-weight:700;font-size:14px;color:#fff;margin-top:8px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06)}
.side-nav a.appendix{font-size:12px;opacity:0.8}
.nav-toggle{display:none;position:fixed;top:12px;left:12px;z-index:1001;background:${C.HEADER};color:#fff;border:none;width:40px;height:40px;border-radius:8px;font-size:20px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.3)}

/* ====== MAIN CONTENT ====== */
.main-content{margin-left:260px;padding:0}
.section{padding:60px 50px;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
.section:nth-child(even){background:#fff}
.section:nth-child(odd){background:#f8f9fb}

/* ====== HERO ====== */
.hero{background:linear-gradient(135deg,${C.HEADER} 0%,${C.MAIN} 50%,${C.DARK} 100%);color:#fff;text-align:center;padding:80px 50px;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 50%,rgba(230,126,34,0.15) 0%,transparent 70%),radial-gradient(circle at 70% 30%,rgba(26,82,118,0.3) 0%,transparent 60%);pointer-events:none}
.hero .hero-badge{display:inline-block;background:${C.ORANGE};color:#fff;padding:6px 20px;border-radius:20px;font-size:14px;font-weight:700;letter-spacing:2px;margin-bottom:20px}
.hero h1{font-size:clamp(28px,5vw,48px);font-weight:900;margin:20px 0;position:relative;text-shadow:0 2px 20px rgba(0,0,0,0.3)}
.hero .hero-subtitle{font-size:clamp(16px,2.5vw,22px);color:rgba(255,255,255,0.75);margin-bottom:40px;position:relative}
.hero .hero-stats{display:flex;gap:30px;flex-wrap:wrap;justify-content:center;position:relative}
.hero .stat-card{background:rgba(255,255,255,0.08);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:25px 30px;min-width:150px;text-align:center}
.hero .stat-card .stat-num{font-size:36px;font-weight:900;color:${C.ORANGE};display:block}
.hero .stat-card .stat-label{font-size:13px;color:rgba(255,255,255,0.65);margin-top:6px;display:block}

/* ====== SECTION HEADERS ====== */
.section-title{text-align:center;margin-bottom:50px}
.section-title .ch-num{display:inline-block;background:${C.MAIN};color:#fff;padding:4px 16px;border-radius:12px;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:10px}
.section-title h2{font-size:clamp(22px,3vw,32px);color:${C.DARK};font-weight:900}
.section-title .ch-desc{color:${C.GRAY};font-size:16px;margin-top:8px}

/* ====== CARDS ====== */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1200px;margin:0 auto;width:100%}
.card{background:#fff;border-radius:16px;padding:30px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.04);transition:transform 0.2s,box-shadow 0.2s}
.card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.1)}
.card.blue{border-left:5px solid ${C.MAIN}}
.card.orange{border-left:5px solid ${C.ORANGE}}
.card.green{border-left:5px solid ${C.GREEN}}
.card.red{border-left:5px solid ${C.RED}}
.card h4{font-size:18px;color:${C.DARK};margin-bottom:12px;font-weight:700}
.card p,.card li{font-size:15px;color:${C.BLACK};line-height:1.8}
.card ul{list-style:none;padding:0}
.card ul li::before{content:'▸ ';color:${C.MAIN};font-weight:700}

/* ====== CALLOUT BOX ====== */
.callout{max-width:1200px;margin:20px auto;padding:24px 30px;border-radius:12px;width:100%}
.callout.info{background:${C.LIGHT};border-left:6px solid ${C.MAIN}}
.callout.warning{background:${C.LIGHT_ORANGE};border-left:6px solid ${C.ORANGE}}
.callout.danger{background:${C.LIGHT_RED};border-left:6px solid ${C.RED}}
.callout.success{background:${C.LIGHT_GREEN};border-left:6px solid ${C.GREEN}}
.callout h4{font-size:17px;font-weight:700;margin-bottom:10px}
.callout.info h4{color:${C.MAIN}}
.callout.warning h4{color:${C.ORANGE}}
.callout.danger h4{color:${C.RED}}
.callout.success h4{color:${C.GREEN}}
.callout p,.callout li{font-size:15px;color:${C.BLACK};line-height:1.8}

/* ====== TABLES ====== */
.table-wrap{max-width:1200px;margin:20px auto;overflow-x:auto;width:100%;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
table{width:100%;border-collapse:collapse;font-size:14px}
thead th{background:${C.HEADER};color:#fff;padding:14px 16px;font-weight:700;text-align:center;white-space:nowrap;font-size:13px}
tbody td{padding:12px 16px;text-align:center;border-bottom:1px solid #eee;font-size:14px}
tbody tr:nth-child(even){background:${C.LIGHT}}
tbody tr:hover{background:#e8f0f8}
.highlight-row{background:#FFF9F0!important;font-weight:700}

/* ====== CHARTS AREA ====== */
.chart-container{max-width:1000px;margin:0 auto;width:100%;position:relative}
.chart-container canvas{max-height:420px}
.chart-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:30px;max-width:1200px;margin:0 auto;width:100%}
.chart-card{background:#fff;border-radius:16px;padding:25px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
.chart-card h4{font-size:15px;color:${C.DARK};text-align:center;margin-bottom:15px;font-weight:700}

/* ====== FLOW DIAGRAM ====== */
.flow-diagram{display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;max-width:1200px;margin:20px auto;padding:20px 0}
.flow-node{background:#fff;border-radius:14px;padding:22px 28px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08);min-width:180px;border-top:4px solid ${C.MAIN}}
.flow-node.highlight{border-top-color:${C.ORANGE};background:linear-gradient(180deg,#FFF9F0 0%,#fff 100%)}
.flow-arrow{font-size:28px;color:${C.GRAY};margin:0 8px;font-weight:700}
.flow-node .node-title{font-weight:700;font-size:16px;color:${C.DARK}}
.flow-node .node-pct{font-size:28px;font-weight:900;color:${C.ORANGE};display:block;margin:6px 0}
.flow-node .node-desc{font-size:12px;color:${C.GRAY}}

/* ====== TIMELINE ====== */
.timeline{max-width:1200px;margin:20px auto;position:relative;padding:20px 0}
.timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:3px;background:${C.MAIN};transform:translateX(-50%);border-radius:2px}
.timeline-item{display:flex;align-items:flex-start;margin-bottom:40px;position:relative}
.timeline-item:nth-child(odd){flex-direction:row}
.timeline-item:nth-child(even){flex-direction:row-reverse}
.timeline-content{width:45%;background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
.timeline-dot{width:16px;height:16px;background:${C.ORANGE};border-radius:50%;position:absolute;left:50%;transform:translateX(-50%);border:3px solid #fff;box-shadow:0 0 0 3px ${C.ORANGE};z-index:1;top:20px}
.timeline-content h4{color:${C.MAIN};font-weight:700;margin-bottom:8px}
.timeline-content .phase-tag{display:inline-block;padding:3px 12px;border-radius:10px;font-size:12px;font-weight:700;margin-bottom:10px}
.timeline-content .phase-tag.p1{background:${C.LIGHT};color:${C.MAIN}}
.timeline-content .phase-tag.p2{background:${C.LIGHT_ORANGE};color:${C.ORANGE}}
.timeline-content .phase-tag.p3{background:${C.LIGHT_GREEN};color:${C.GREEN}}

/* ====== METRIC GAUGE ====== */
.metric-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:1200px;margin:20px auto;width:100%}
.metric-card{background:#fff;border-radius:14px;padding:22px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
.metric-card .metric-value{font-size:38px;font-weight:900;color:${C.MAIN}}
.metric-card .metric-label{font-size:13px;color:${C.GRAY};margin-top:4px}
.metric-card .metric-sub{font-size:12px;color:${C.GRAY};margin-top:2px}
.metric-card.warn .metric-value{color:${C.ORANGE}}
.metric-card.danger .metric-value{color:${C.RED}}
.metric-card.good .metric-value{color:${C.GREEN}}

/* ====== COMPLIANCE ====== */
.compliance-list{max-width:900px;margin:20px auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:15px}
.compliance-item{display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:10px;font-size:15px}
.compliance-item.pass{background:${C.LIGHT_GREEN};color:${C.GREEN}}
.compliance-item.fail{background:${C.LIGHT_RED};color:${C.RED}}
.compliance-item .ci-icon{font-size:22px}

/* ====== FOOTER ====== */
.doc-footer{background:${C.HEADER};color:rgba(255,255,255,0.65);text-align:center;padding:40px;font-size:14px}
.doc-footer .footer-brand{color:#fff;font-size:18px;font-weight:700;margin-bottom:8px}
.doc-footer .redline-note{color:${C.RED};font-size:13px;margin-top:12px;font-weight:700}

/* ====== RESPONSIVE ====== */
@media(max-width:1024px){
  .side-nav{transform:translateX(-100%)}
  .side-nav.open{transform:translateX(0)}
  .main-content{margin-left:0}
  .nav-toggle{display:flex;align-items:center;justify-content:center}
  .section{padding:40px 24px;min-height:auto}
  .hero{padding:60px 24px;min-height:auto}
  .timeline::before{left:20px}
  .timeline-item,.timeline-item:nth-child(even){flex-direction:row}
  .timeline-content{width:calc(100% - 50px);margin-left:40px}
  .timeline-dot{left:20px}
  .chart-row{grid-template-columns:1fr}
  .flow-diagram{flex-direction:column}
  .flow-arrow{transform:rotate(90deg)}
}

@media print{
  .side-nav,.nav-toggle{display:none!important}
  .main-content{margin-left:0}
  .section{min-height:auto;page-break-inside:avoid;padding:20px 0}
  .hero{min-height:auto;padding:30px 0}
  body{font-size:12px}
}

/* ====== ANIMATION ====== */
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.animate{animation:fadeInUp 0.6s ease-out forwards}

/* ====== PARAM TABLE HIGHLIGHT ====== */
.param-adjustable{background:#FFFDE8!important}
.param-locked{background:#FFF5F5!important}

/* ====== GANTT STYLE ====== */
.gantt-row{display:flex;align-items:center;gap:0;margin:6px 0;font-size:13px}
.gantt-label{width:120px;text-align:right;padding-right:14px;font-weight:700;color:${C.DARK};flex-shrink:0}
.gantt-bar-wrap{flex:1;height:28px;background:#eee;border-radius:14px;position:relative;overflow:hidden}
.gantt-bar{height:100%;border-radius:14px;display:flex;align-items:center;padding-left:12px;font-size:11px;color:#fff;font-weight:700}
.gantt-bar.p1{background:linear-gradient(90deg,${C.MAIN},#2980B9)}
.gantt-bar.p2{background:linear-gradient(90deg,${C.ORANGE},#F39C12)}
.gantt-bar.p3{background:linear-gradient(90deg,${C.GREEN},#27AE60)}
</style>
</head>
<body>

<!-- ====== MOBILE NAV TOGGLE ====== -->
<button class="nav-toggle" onclick="document.querySelector('.side-nav').classList.toggle('open')">☰</button>

<!-- ====== SIDE NAVIGATION ====== -->
<nav class="side-nav" id="sideNav">
  <div class="nav-logo">
    <h3>🔗 链商2.0</h3>
    <small>社区商业数字经营平台 · V2.0</small>
  </div>
  <a href="#hero" class="active">🏠 封面总览</a>
  <a href="#ch1" class="chapter">第一章 · 执行摘要</a>
  <a href="#ch2" class="chapter">第二章 · 营销经济基础</a>
  <a href="#ch3" class="chapter">第三章 · 三元营销体系</a>
  <a href="#ch4" class="chapter">第四章 · 三级推广网络</a>
  <a href="#ch5" class="chapter">第五章 · 商家端营销策略</a>
  <a href="#ch6" class="chapter">第六章 · 消费者端营销策略</a>
  <a href="#ch7" class="chapter">第七章 · 营销预算与财务模型</a>
  <a href="#ch8" class="chapter">第八章 · 全渠道营销渗透</a>
  <a href="#ch9" class="chapter">第九章 · 营销效果度量体系</a>
  <a href="#ch10" class="chapter">第十章 · 实施路线图</a>
  <a href="#app-a" class="appendix">附录A · 营销术语合规速查表</a>
  <a href="#app-b" class="appendix">附录B · 营销工具参数配置表</a>
  <a href="#app-c" class="appendix">附录C · 竞品营销对标</a>
</nav>

<!-- ====== MAIN CONTENT ====== -->
<div class="main-content">

<!-- ====== HERO / COVER ====== -->
<section class="hero" id="hero">
  <div class="hero-badge">链商2.0 · V2.0 · 2026年6月 · 品牌战略部</div>
  <h1>平台营销策略制定方案</h1>
  <p class="hero-subtitle">面向社区商业的数字经营平台 —— 商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励</p>
  <div class="hero-stats">
    <div class="stat-card">
      <span class="stat-num">4.0%</span>
      <span class="stat-label">平台营销池率</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">3</span>
      <span class="stat-label">三券全平台跨店通用</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">3+3+1</span>
      <span class="stat-label">三元营销 + 三级推广</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">40,500</span>
      <span class="stat-label">月盈亏平衡笔数</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">100%</span>
      <span class="stat-label">合规红线通过率</span>
    </div>
  </div>
  <p style="margin-top:40px;color:rgba(255,255,255,0.5);font-size:14px">帮助商家提升复购率 · 帮助用户获得持续消费权益 · 帮助社区形成可持续商业循环</p>
</section>

<!-- ====== CHAPTER 1: EXECUTIVE SUMMARY ====== -->
<section class="section" id="ch1">
  <div class="section-title">
    <span class="ch-num">CHAPTER 1</span>
    <h2>执行摘要 · 链商2.0定位</h2>
    <p class="ch-desc">社区商业数字经营平台 · 四大核心机制 · 六大核心判断</p>
  </div>

  <div class="card-grid">
    <div class="card blue">
      <h4>🏪 商户独立经营</h4>
      <p>每个商家拥有独立店铺页面——平台商家(精品深度定制)、联盟商家(模板化轻定制)、综合商城(标准化极简)——<strong>"千面千店"</strong>，品牌统一中的差异化。</p>
    </div>
    <div class="card orange">
      <h4>🔄 生态会员互通</h4>
      <p>消费者在一个商家消费即可成为全平台会员——所有权益（代金券/积分/消费金）<strong>在所有商家通用</strong>，一次消费、全生态受益。</p>
    </div>
    <div class="card green">
      <h4>🔁 消费权益流转</h4>
      <p>在A店获得的代金券可在B店使用、在C店获得的积分可在D店兑换——权益不绑定商家。消费流转路径：<strong>平台商家→联盟商家→综合商城</strong>（软性引导）。</p>
    </div>
    <div class="card blue">
      <h4>💰 真实交易激励</h4>
      <p>平台仅在商家实际产生交易时获取服务费——<strong>零固定费用、零预充值、零资金占用</strong>。"交易即服务费结算"——商家先盈利，平台后服务费结算。</p>
    </div>
    <div class="card orange">
      <h4>📊 营销预算自动生成</h4>
      <p>每笔交易自动计提 <strong>3.5-4%</strong> 进入营销池（汇付托管），无需平台预支资金。跨店通兑消耗的券/积分/消费金均从统一营销池结算。</p>
    </div>
    <div class="card green">
      <h4>🎯 三元营销全平台通用🆕</h4>
      <p>代金券=获客钩子（5%/30%/90天/<strong>全平台通用🆕</strong>），积分=留存引擎（1:100/20%/2年/全平台通用），消费金=长期锁客（30%/12月/家庭可转/全平台通用）。</p>
    </div>
  </div>

  <!-- Key Data Chart -->
  <div class="chart-row" style="margin-top:40px">
    <div class="chart-card">
      <h4>📊 三大业态营销池率对比</h4>
      <canvas id="chart_pool_rate"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 九场景每¥100交易营销池金额</h4>
      <canvas id="chart_9scenarios"></canvas>
    </div>
  </div>
</section>

<!-- ====== CHAPTER 2: MARKETING ECONOMICS ====== -->
<section class="section" id="ch2">
  <div class="section-title">
    <span class="ch-num">CHAPTER 2</span>
    <h2>营销经济基础</h2>
    <p class="ch-desc">营销三大资金来源 · 九场景营销池 · 交易量增长曲线 · 风控释放机制</p>
  </div>

  <div class="card-grid">
    <div class="card blue">
      <h4>① 代金券营销池（marketingPool）</h4>
      <p>每笔交易计提 <strong>3.5-4%</strong>，汇付托管，专用于代金券发放和核销结算。这是唯一的"可主动支配"营销预算。</p>
    </div>
    <div class="card orange">
      <h4>② 平台服务费（platformFee）</h4>
      <p><strong>5-6%</strong>，平台主营业务收入。积分兑换成本从此支出（100积分=¥1由平台承担）。不是营销预算，但支撑积分体系运转。</p>
    </div>
    <div class="card green">
      <h4>③ 消费金池（consumerCredit）</h4>
      <p><strong>2-3%</strong>，汇付托管，消费金计提来源。专款专用，不可挪作他用。</p>
    </div>
  </div>

  <div class="chart-row" style="margin-top:30px">
    <div class="chart-card">
      <h4>📈 营销预算随交易量自动增长</h4>
      <canvas id="chart_growth"></canvas>
    </div>
    <div class="chart-card">
      <h4>🥧 营销池预算分配模型</h4>
      <canvas id="chart_budget_pie"></canvas>
    </div>
  </div>

  <div class="callout danger" style="margin-top:30px">
    <h4>⛔ 三大铁律（营销经济学核心约束）</h4>
    <p>① 营销总支出 ≤ 营销池余额（永不透支） ② 代金券核销金额 ≤ 营销池当月收入（当月平衡） ③ 积分兑换成本 ≤ 平台服务费收入的30%（平台利润底线）</p>
  </div>
</section>

<!-- ====== CHAPTER 3: TRIPLE MARKETING SYSTEM ====== -->
<section class="section" id="ch3">
  <div class="section-title">
    <span class="ch-num">CHAPTER 3</span>
    <h2>三元营销体系战术设计</h2>
    <p class="ch-desc">FABE买点转化 · 代金券/积分/消费金 · 三券叠加计算器 · 合规检查</p>
  </div>

  <!-- FABE Cards -->
  <div class="card-grid">
    <div class="card blue">
      <h4>🎫 代金券 — 获客钩子</h4>
      <table style="font-size:14px;width:100%">
        <tr><td style="color:${C.GRAY};text-align:left">发放率</td><td><strong>5%</strong>（订单额）</td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">抵扣上限</td><td><strong>30%</strong>/单</td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">有效期</td><td><strong>90天</strong></td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">资金来源</td><td>营销池 3.5-4%</td></tr>
      </table>
      <p style="margin-top:10px;font-size:13px;color:${C.GRAY}">FABE: 自动发放→零门槛到账→越买越省→核销率65%</p>
    </div>
    <div class="card orange">
      <h4>⭐ 积分 — 留存引擎</h4>
      <table style="font-size:14px;width:100%">
        <tr><td style="color:${C.GRAY};text-align:left">赚取率</td><td><strong>1分/¥1</strong></td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">兑换率</td><td><strong>100:1</strong>（100分=¥1）</td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">抵扣上限</td><td><strong>20%</strong>/单</td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">有效期</td><td><strong>2年</strong></td></tr>
      </table>
      <p style="margin-top:10px;font-size:13px;color:${C.GRAY}">FABE: 消费即积分→长期有效→会员升级→积分用户消费频次3.2次vs1.7次</p>
    </div>
    <div class="card green">
      <h4>🎁 消费金 — 长期锁客</h4>
      <table style="font-size:14px;width:100%">
        <tr><td style="color:${C.GRAY};text-align:left">计提率</td><td><strong>2-3%</strong></td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">核销上限</td><td><strong>30%</strong>/单</td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">有效期</td><td><strong>12个月</strong></td></tr>
        <tr><td style="color:${C.GRAY};text-align:left">转让</td><td>直系亲属</td></tr>
      </table>
      <p style="margin-top:10px;font-size:13px;color:${C.GRAY}">FABE: 消费自动积累→家庭共享→全年97折→家庭用户消费高47%</p>
    </div>
  </div>

  <!-- Stacked order breakdown chart -->
  <div class="chart-row" style="margin-top:30px">
    <div class="chart-card">
      <h4>🧮 三券叠加计算器：¥100订单消费者视角</h4>
      <canvas id="chart_order_breakdown"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 三元营销工具对比雷达</h4>
      <canvas id="chart_triple_radar"></canvas>
    </div>
  </div>

  <div class="callout success" style="margin-top:20px">
    <h4>✅ 三条合规红线全部通过</h4>
    <p>代金券/积分/消费金均为"消费营销权益"，非金融产品。不可兑现 ✓ · 无资金池（汇付托管）✓ · 不承诺收益 ✓</p>
  </div>
</section>

<!-- ====== CHAPTER 4: PROMOTION NETWORK ====== -->
<section class="section" id="ch4">
  <div class="section-title">
    <span class="ch-num">CHAPTER 4</span>
    <h2>三级推广网络营销激活</h2>
    <p class="ch-desc">城市服务商 → 服务站 → 推广者 · 营销工具包 · 收入测算 · 合规边界</p>
  </div>

  <!-- 3-Tier Flow Diagram -->
  <div class="flow-diagram">
    <div class="flow-node highlight">
      <div class="node-title">🏙️ 城市服务商</div>
      <span class="node-pct">1%</span>
      <div class="node-desc">区域合伙人<br>城市级活动策划<br>商家招商激励</div>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-node">
      <div class="node-title">🏪 服务站</div>
      <span class="node-pct">35%</span>
      <div class="node-desc">社区节点管理者<br>推广者招募培训<br>线下触点运营</div>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-node">
      <div class="node-title">🙋 推广者</div>
      <span class="node-pct">65%</span>
      <div class="node-desc">一线获客推广<br>专属推广码/链接<br>内容转发素材库</div>
    </div>
  </div>
  <p style="text-align:center;font-size:13px;color:${C.GRAY};margin-top:10px">三级体系符合《禁止传销条例》≤3层要求 · 零入门费 · 收入基于交易量</p>

  <!-- Income comparison chart -->
  <div class="chart-row" style="margin-top:30px">
    <div class="chart-card">
      <h4>💰 三级推广者月度收入测算对比</h4>
      <canvas id="chart_income"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 各业态推广佣金占比</h4>
      <canvas id="chart_promotion_split"></canvas>
    </div>
  </div>

  <div class="callout danger" style="margin-top:20px">
    <h4>⛔ 推广合规红线</h4>
    <p>≤3层服务费结算 · 零入门费（免费注册）· 收入基于交易量（非人头费）· 禁止多级返佣 · 禁止承诺收益</p>
  </div>
</section>

<!-- ====== CHAPTER 5: MERCHANT MARKETING ====== -->
<section class="section" id="ch5">
  <div class="section-title">
    <span class="ch-num">CHAPTER 5</span>
    <h2>商家端营销策略</h2>
    <p class="ch-desc">入驻激励 · 四层分级营销 · 联盟vs平台差异 · 自助工具 · 餐饮SOP</p>
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <h4>🏅 商家等级金字塔与营销支持力度</h4>
      <canvas id="chart_merchant_tier"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 平台商家 vs 联盟商家 服务费结算结构对比</h4>
      <canvas id="chart_platform_vs_alliance"></canvas>
    </div>
  </div>

  <div class="callout info" style="margin-top:20px">
    <h4>🍜 餐饮新店30天营销日历（SOP模板）</h4>
    <p>Day 1-3 开业预热 → Day 4-7 开业爆单（¥15券×200张）→ Day 8-14 复购养成（¥5复购券+积分翻倍）→ Day 15-21 私域沉淀（社群300人）→ Day 22-30 稳定运营（进入白银等级）</p>
  </div>
</section>

<!-- ====== CHAPTER 6: CONSUMER MARKETING ====== -->
<section class="section" id="ch6">
  <div class="section-title">
    <span class="ch-num">CHAPTER 6</span>
    <h2>消费者端营销策略</h2>
    <p class="ch-desc">7阶段生命周期地图 · 新人大礼包 · 三段式复购唤醒 · 社区裂变 · 分层运营</p>
  </div>

  <!-- Lifecycle Funnel -->
  <div class="chart-container" style="max-width:900px">
    <h4 style="text-align:center;color:${C.DARK};margin-bottom:16px">🔄 用户生命周期营销地图（7阶段 × 工具组合 × KPI）</h4>
    <canvas id="chart_lifecycle"></canvas>
  </div>

  <div class="chart-row" style="margin-top:30px">
    <div class="chart-card">
      <h4>👤 用户分层与月营销预算</h4>
      <canvas id="chart_user_tiers"></canvas>
    </div>
    <div class="chart-card">
      <h4>🎁 新人大礼包成本结构（人均¥25）</h4>
      <canvas id="chart_new_user_gift"></canvas>
    </div>
  </div>

  <div class="callout info" style="margin-top:20px">
    <h4>🔄 三段式自动唤醒机制</h4>
    <p>① 代金券到期提醒（60/75/85天递进）→ ② 积分到期提醒（90/30/7天递进）→ ③ 消费金将过期提醒（90/30天递进）。推送渠道：小程序服务通知 > 微信模板消息 > 短信</p>
  </div>
</section>

<!-- ====== CHAPTER 7: BUDGET & FINANCE ====== -->
<section class="section" id="ch7">
  <div class="section-title">
    <span class="ch-num">CHAPTER 7</span>
    <h2>营销预算与财务模型</h2>
    <p class="ch-desc">月度预算表 · 代金券消耗预测 · 积分成本 · ROI框架 · 敏感性分析</p>
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <h4>📊 营销池月度预算分配（按交易量等级）</h4>
      <canvas id="chart_budget_stack"></canvas>
    </div>
    <div class="chart-card">
      <h4>📈 代金券消耗预测模型（三档场景）</h4>
      <canvas id="chart_voucher_consumption"></canvas>
    </div>
  </div>

  <div class="chart-row" style="margin-top:20px">
    <div class="chart-card">
      <h4>🎯 营销ROI五维分析</h4>
      <canvas id="chart_roi"></canvas>
    </div>
    <div class="chart-card">
      <h4>📉 敏感性分析：代金券发放率调整影响</h4>
      <canvas id="chart_sensitivity"></canvas>
    </div>
  </div>

  <div class="callout success" style="margin-top:20px">
    <h4>✅ 核心结论：营销预算充裕，挑战在"如何高效花出去"</h4>
    <p>即使乐观估计下，代金券核销消耗仅占营销池的4.9%。月交易量突破80,000笔后，营销预算突破¥300,000/月，可启动大规模获客和品牌投放。</p>
  </div>
</section>

<!-- ====== CHAPTER 8: OMNI-CHANNEL ====== -->
<section class="section" id="ch8">
  <div class="section-title">
    <span class="ch-num">CHAPTER 8</span>
    <h2>全渠道营销渗透</h2>
    <p class="ch-desc">奥美全渠道方法论 · 11触点工具配置 · 买点一致性 · 渠道优先级</p>
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <h4>📡 渠道优先级与资源分配（三阶段演进）</h4>
      <canvas id="chart_channel_allocation"></canvas>
    </div>
    <div class="chart-card">
      <h4>🎯 全渠道营销工具配置热力图</h4>
      <canvas id="chart_channel_heatmap"></canvas>
    </div>
  </div>

  <div class="callout info" style="margin-top:20px">
    <h4>🔑 消费者一句话记忆</h4>
    <p style="font-size:18px;text-align:center;font-weight:700;color:${C.MAIN}">"在链生活，每次消费都在为下次省钱——自动的、越花越省"</p>
    <p style="text-align:center;font-size:13px;color:${C.GRAY}">以上核心买点必须在所有渠道统一表达——可换表达方式，不能换逻辑</p>
  </div>
</section>

<!-- ====== CHAPTER 9: MEASUREMENT ====== -->
<section class="section" id="ch9">
  <div class="section-title">
    <span class="ch-num">CHAPTER 9</span>
    <h2>营销效果度量体系</h2>
    <p class="ch-desc">8大核心指标 · 分阶段KPI · 周度看板 · 联动预警机制</p>
  </div>

  <!-- KPI Metric Cards -->
  <div class="metric-row">
    <div class="metric-card good">
      <div class="metric-value">≤¥20</div>
      <div class="metric-label">CAC（用户获取成本）</div>
      <div class="metric-sub">冷启动期目标 | 预警线：>¥25</div>
    </div>
    <div class="metric-card good">
      <div class="metric-value">≥25%</div>
      <div class="metric-label">30日复购率</div>
      <div class="metric-sub">冷启动期目标 | 预警线：<20%</div>
    </div>
    <div class="metric-card good">
      <div class="metric-value">≥55%</div>
      <div class="metric-label">代金券核销率</div>
      <div class="metric-sub">冷启动期目标 | 预警线：<50%</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">≤85%</div>
      <div class="metric-label">营销池消耗率</div>
      <div class="metric-sub">冷启动期目标 | 预警线：>90%</div>
    </div>
    <div class="metric-card good">
      <div class="metric-value">1.12</div>
      <div class="metric-label">综合营销ROI</div>
      <div class="metric-sub">基准场景（50k笔/月）</div>
    </div>
    <div class="metric-card good">
      <div class="metric-value">11.1</div>
      <div class="metric-label">推广者ROI</div>
      <div class="metric-sub">获客效率极高</div>
    </div>
  </div>

  <!-- KPI trend chart -->
  <div class="chart-container" style="margin-top:30px;max-width:900px">
    <h4 style="text-align:center;color:${C.DARK};margin-bottom:16px">📈 分阶段KPI目标演进</h4>
    <canvas id="chart_kpi_evolution"></canvas>
  </div>

  <div class="callout warning" style="margin-top:20px">
    <h4>⚠️ 6项自动预警规则</h4>
    <p>🔴 营销池透支（消耗>计提×110%）→暂停新券发放 | 🔴 CAC超标（连续2周>¥25）→暂停付费获客 | 🟡 核销率骤降（周环比-10%）→A/B测试 | 🟡 消费金过期潮→加大提醒推送 | 🟡 推广者流失（周-15%）→回归激励 | 🟡 城市数据分化→1对1沟通</p>
  </div>
</section>

<!-- ====== CHAPTER 10: ROADMAP ====== -->
<section class="section" id="ch10">
  <div class="section-title">
    <span class="ch-num">CHAPTER 10</span>
    <h2>实施路线图</h2>
    <p class="ch-desc">3阶段 · 6个决策节点 · 3个风险预案 · 12月时间线</p>
  </div>

  <!-- Timeline -->
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="phase-tag p1">Phase 1 · 冷启动期</span>
        <h4>公测 — 第3月：代金券驱动获客</h4>
        <p>月交易量 5,000→20,000 · 营销池 ¥1.9万→¥7.6万 · 推广者≥50人</p>
        <p style="font-size:13px;color:${C.GRAY}">里程碑：券核销率≥55% · 首单转化率≥25% · 复购率≥25% · CAC≤¥20</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D1(第2月末): 月交易量<1万→启动城市服务商加速计划</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D2(第3月末): 复购率<20%→诊断券参数并调整</p>
        <p style="font-size:13px;color:${C.RED}">风险预案 R1: 交易量<5千→缩小券面额至¥3-5，聚焦3个核心社区</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="phase-tag p2">Phase 2 · 增长期</span>
        <h4>第4-6月：消费金+推广者双引擎发力</h4>
        <p>月交易量 20,000→50,000 · 营销池 ¥7.6万→¥19.2万 · 活跃推广者≥200人</p>
        <p style="font-size:13px;color:${C.GRAY}">里程碑：消费金家庭共享开通率≥15% · 推广者人均GMV≥¥3,500 · 平台盈利</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D3(第4月末): 推广者人均GMV<$2,500→优化素材库+Top10奖励</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D4(第5月末): 消费金使用率<40%→核销上限提至35%</p>
        <p style="font-size:13px;color:${C.RED}">风险预案 R2: 营销池消耗>80%→削减城市活动预算·压缩券发放率至4%</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="phase-tag p3">Phase 3 · 成熟期</span>
        <h4>第7-12月：三元自动化+AI个性化营销</h4>
        <p>月交易量 50,000→80,000+ · 营销池 ¥19.2万→¥30.6万+ · 城市服务商覆盖10城</p>
        <p style="font-size:13px;color:${C.GRAY}">里程碑：AI个性化券推荐上线 · 年GMV破¥1亿 · 营销ROI>2.0 · NPS≥50</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D5(第8月末): 评估第三方DSP广告投放平台</p>
        <p style="font-size:13px;color:${C.ORANGE}">决策节点 D6(第11月末): 评估"链生活会员付费体系"</p>
        <p style="font-size:13px;color:${C.RED}">风险预案 R3: 用户增长见顶→新城市攻坚计划+拓展新业态</p>
      </div>
    </div>
  </div>

  <!-- Gantt Chart -->
  <div style="max-width:1000px;margin:30px auto">
    <h4 style="text-align:center;color:${C.DARK};margin-bottom:16px">📅 12个月执行甘特图</h4>
    <div class="gantt-row"><div class="gantt-label">交易量目标</div><div class="gantt-bar-wrap"><div class="gantt-bar p1" style="width:100%">5k → 100k 笔/月</div></div></div>
    <div class="gantt-row"><div class="gantt-label">代金券</div><div class="gantt-bar-wrap"><div class="gantt-bar p1" style="width:100%">全程覆盖</div></div></div>
    <div class="gantt-row"><div class="gantt-label">积分</div><div class="gantt-bar-wrap"><div class="gantt-bar p1" style="width:25%">轻量</div><div class="gantt-bar p2" style="width:75%;position:absolute;left:25%">常规 → 翻倍</div></div></div>
    <div class="gantt-row"><div class="gantt-label">消费金</div><div class="gantt-bar-wrap"><div class="gantt-bar p2" style="width:83%;position:absolute;left:17%">家庭共享 → 全面运营</div></div></div>
    <div class="gantt-row"><div class="gantt-label">推广者</div><div class="gantt-bar-wrap"><div class="gantt-bar p1" style="width:100%">启动 → 拓展 → 规模化 → 激励竞赛</div></div></div>
    <div class="gantt-row"><div class="gantt-label">城市服务商</div><div class="gantt-bar-wrap"><div class="gantt-bar p2" style="width:83%;position:absolute;left:17%">首批3城 → 5城 → 7城 → 10城 → 全国</div></div></div>
    <div class="gantt-row"><div class="gantt-label">公域内容</div><div class="gantt-bar-wrap"><div class="gantt-bar p2" style="width:58%;position:absolute;left:42%">视频号 → 抖音 → 小红书 → 全渠道</div></div></div>
    <div class="gantt-row"><div class="gantt-label">AI营销</div><div class="gantt-bar-wrap"><div class="gantt-bar p3" style="width:50%;position:absolute;left:50%">券推荐 → 全AI个性化</div></div></div>
  </div>
</section>

<!-- ====== APPENDIX A: COMPLIANCE ====== -->
<section class="section" id="app-a">
  <div class="section-title">
    <span class="ch-num">APPENDIX A</span>
    <h2>营销术语合规速查表</h2>
    <p class="ch-desc">10类禁用→合规映射 · 绝对禁用词 · 合规用语</p>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>类别</th><th style="color:${C.RED}">⛔ 禁止使用</th><th style="color:${C.GREEN}">✅ 必须使用</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td>代金券描述</td><td style="color:${C.RED}">优惠券/折扣券</td><td style="color:${C.GREEN}">营销优惠/消费抵扣券</td><td>所有券相关文案</td></tr>
        <tr><td>积分描述</td><td style="color:${C.RED}">返利/返现/回扣</td><td style="color:${C.GREEN}">会员回馈/消费积分</td><td>所有积分相关文案</td></tr>
        <tr><td>消费金描述</td><td style="color:${C.RED}">储值金/余额/账户余额</td><td style="color:${C.GREEN}">消费让利/消费权益金</td><td>所有消费金相关文案</td></tr>
        <tr><td>营销池描述</td><td style="color:${C.RED}">营销基金/营销资本</td><td style="color:${C.GREEN}">平台营销额度/营销预算池</td><td>内部文档</td></tr>
        <tr><td>收益类</td><td style="color:${C.RED}">收益/赚钱/分红</td><td style="color:${C.GREEN}">服务费/增收/佣金</td><td>推广者/商家文案</td></tr>
        <tr><td>投资类</td><td style="color:${C.RED}">投资/红利/增值回报</td><td style="color:${C.GREEN}">权益升级/消费权益</td><td>会员体系文案</td></tr>
        <tr><td>金融类</td><td style="color:${C.RED}">资本/变现/金融/理财</td><td style="color:${C.GREEN}">资源/转化/平台服务</td><td>全部文档</td></tr>
        <tr><td>创业类</td><td style="color:${C.RED}">创业/零门槛创业/副业</td><td style="color:${C.GREEN}">参与推广/开展推广</td><td>推广者招募</td></tr>
        <tr><td>全球类</td><td style="color:${C.RED}">全球化/国际/跨国</td><td style="color:${C.GREEN}">全国化/本地化/区域</td><td>品牌定位文案</td></tr>
        <tr><td>数据权益</td><td style="color:${C.RED}">数据确权/数据资产</td><td style="color:${C.GREEN}">数据权益管理/数据驱动</td><td>技术/产品文案</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout danger" style="margin-top:20px">
    <h4>⛔ 绝对禁用词</h4>
    <p>币 · Token · 通证 · 投资回报 · 稳赚 · 躺赚 · 数字资产交易 · 资本集群 · 资本化运作 · 资金池 · 备付金 · 承诺收益</p>
  </div>
  <div class="callout success" style="margin-top:10px">
    <h4>✅ 合规用语</h4>
    <p>消费权益 · 会员权益 · 商家营销额度 · 权益升级 · 消费活跃度指数 · 商家服务费计算规则 · 服务费 · 增收 · 转化 · 参与推广 · 全国化 · 数据权益管理 · 数据驱动经营</p>
  </div>
</section>

<!-- ====== APPENDIX B: PARAMETERS ====== -->
<section class="section" id="app-b">
  <div class="section-title">
    <span class="ch-num">APPENDIX B</span>
    <h2>营销工具参数配置表</h2>
    <p class="ch-desc">16项可调参数集中管理 · 调整权限 · 影响说明</p>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>参数名称</th><th>当前值</th><th>可调范围</th><th>调整权限</th><th>调整影响</th></tr>
      </thead>
      <tbody>
        <tr class="param-adjustable"><td>营销池率(平台)</td><td><strong>4.00%</strong></td><td>2-8%</td><td>品牌+运营</td><td>直接影响代金券总预算</td></tr>
        <tr class="param-adjustable"><td>营销池率(联盟)</td><td><strong>3.50%</strong></td><td>2-8%</td><td>品牌+运营</td><td>联盟商家营销支持力度</td></tr>
        <tr class="param-adjustable"><td>营销池率(电商)</td><td><strong>3.50%</strong></td><td>2-8%</td><td>品牌+运营</td><td>电商营销支持力度</td></tr>
        <tr class="param-adjustable"><td>代金券发放率</td><td><strong>5%</strong></td><td>3-10%</td><td>品牌部</td><td>每笔消费发放券的面额</td></tr>
        <tr class="param-adjustable"><td>代金券抵扣上限</td><td><strong>30%</strong></td><td>20-50%</td><td>品牌部</td><td>单笔订单最大券使用比例</td></tr>
        <tr class="param-adjustable"><td>代金券有效期</td><td><strong>90天</strong></td><td>30-180天</td><td>品牌部</td><td>券的紧迫感和核销率</td></tr>
        <tr class="param-adjustable"><td>积分赚取率</td><td><strong>1分/¥1</strong></td><td>0.5-2分/¥1</td><td>品牌部</td><td>积分发放速度和用户感知</td></tr>
        <tr class="param-adjustable"><td>积分兑换率</td><td><strong>100:1</strong></td><td>80:1-200:1</td><td>品牌+财务</td><td>平台积分兑换成本</td></tr>
        <tr class="param-adjustable"><td>积分抵扣上限</td><td><strong>20%</strong></td><td>10-30%</td><td>品牌部</td><td>积分使用频率</td></tr>
        <tr class="param-adjustable"><td>积分有效期</td><td><strong>2年</strong></td><td>1-3年</td><td>品牌部</td><td>积分沉淀和用户留存</td></tr>
        <tr class="param-adjustable"><td>消费金率(平台)</td><td><strong>3.00%</strong></td><td>1-5%</td><td>品牌部</td><td>消费金积累速度</td></tr>
        <tr class="param-adjustable"><td>消费金率(联盟)</td><td><strong>2.00%</strong></td><td>1-5%</td><td>品牌部</td><td>联盟用户消费金竞争力</td></tr>
        <tr class="param-adjustable"><td>消费金核销上限</td><td><strong>30%</strong></td><td>20-40%</td><td>品牌部</td><td>单笔消费金使用比例</td></tr>
        <tr class="param-adjustable"><td>消费金有效期</td><td><strong>12个月</strong></td><td>6-24个月</td><td>品牌+财务</td><td>消费金沉淀周期</td></tr>
        <tr class="param-adjustable"><td>服务站:推广者拆分</td><td><strong>35:65</strong></td><td>20:80-50:50</td><td>运营+服务站</td><td>推广者和服务站的激励平衡</td></tr>
        <tr class="param-adjustable"><td>风控备用金</td><td><strong>2.00%</strong></td><td>1-3%</td><td>财务+法务</td><td>风险覆盖和营销池释放</td></tr>
      </tbody>
    </table>
  </div>
  <p style="text-align:center;color:${C.GRAY};font-size:14px;margin-top:16px">建议每季度进行一次参数回顾和调优，基于营销度量数据做出数据驱动的调整决策</p>
</section>

<!-- ====== APPENDIX C: COMPETITIVE ====== -->
<section class="section" id="app-c">
  <div class="section-title">
    <span class="ch-num">APPENDIX C</span>
    <h2>竞品营销对标</h2>
    <p class="ch-desc">美团 · 抖音本地生活 · 有赞 · 链商2.0 7维对比</p>
  </div>

  <div class="chart-container" style="max-width:800px">
    <h4 style="text-align:center;color:${C.DARK};margin-bottom:16px">🎯 四平台营销能力雷达对比</h4>
    <canvas id="chart_competitive_radar"></canvas>
  </div>

  <div class="card-grid" style="margin-top:30px">
    <div class="card blue">
      <h4>① 营销预算自动化</h4>
      <p>每笔交易自动产生营销预算，无需商家预存、无需平台垫资——美团/抖音都需要商家或平台主动投入。</p>
    </div>
    <div class="card orange">
      <h4>② 三元营销全平台通用🆕</h4>
      <p>代金券(拉新)+积分(留存)+消费金(锁客)——<strong>三者均跨店通用</strong>，消费者权益不绑定商家——竞品通常只有1-2种工具且店域封闭。</p>
    </div>
    <div class="card green">
      <h4>③ 全生态会员权益互通🆕</h4>
      <p>一次消费、全平台受益——在A店得的券去B店用，在C店赚的积分去D店兑——竞品无此跨店权益互通机制。</p>
    </div>
    <div class="card blue">
      <h4>④ 三级推广网络低成本获客</h4>
      <p>推广者收入基于交易量，CAC天然低于广告投放——美团依赖骑手，抖音依赖内容投放，成本更高。</p>
    </div>
    <div class="card orange">
      <h4>⑤ 消费金家庭共享</h4>
      <p>社区家庭场景的独特裂变机制——竞品无此功能，形成差异化壁垒。</p>
    </div>
    <div class="card green">
      <h4>⑥ 千面千店·商户独立经营🆕</h4>
      <p>每个商家拥有独立品牌店铺——平台商家深度定制+联盟商家模板化+商城标准化——竞品多为统一模板。</p>
    </div>
  </div>

  <div class="callout warning" style="margin-top:20px">
    <h4>⚠️ 风险提示</h4>
    <p>美团/抖音拥有巨大的流量优势和品牌认知度，链商2.0作为新平台在冷启动期无法正面竞争。策略上应聚焦<strong>"社区深耕+全平台权益互通+消费流转体系"</strong>，在局部市场（单个城市/单个社区）建立密度优势后再拓展。</p>
  </div>
</section>

<!-- ====== FOOTER ====== -->
<div class="doc-footer">
  <div class="footer-brand">🔗 链商2.0 · 链生活品牌</div>
  <p>平台营销策略制定方案 V2.0 | 基于 V3.2 服务费结算与核销模型（跨店通兑版）延伸设计 | 2026年6月 · 品牌战略部</p>
  <p style="margin-top:8px;color:${C.MAIN}"><strong>链商2.0定位：面向社区商业的数字经营平台——商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励</strong></p>
  <p style="margin-top:8px">所有营销参数均为建议值，可根据实际运营数据调优。任何参数调整需经运营提案→品牌评估→技术确认→法务审核→管理层审批。</p>
  <p class="redline-note">营销策略核心原则：营销预算随交易量自动增长（零预付）· 代金券/积分/消费金全平台通用+不可兑现（零金融风险）· 三级推广收入基于交易量（零传销风险）· 跨店通兑不构成二清（汇付直清）</p>
  <p style="margin-top:20px;font-size:12px">© 2026 链商平台运营方（母公司 母公司 子公司）· 企业宣传策划专员 Mr666</p>
</div>

</div><!-- /main-content -->

<!-- ====== CHARTS SCRIPT ====== -->
<script>
// ====== COMMON ======
Chart.defaults.font.family = "'Microsoft YaHei','PingFang SC',sans-serif";
Chart.defaults.font.size = 13;
const C_MAIN = '${C.MAIN}', C_DARK = '${C.DARK}', C_ORANGE = '${C.ORANGE}';
const C_GREEN = '${C.GREEN}', C_RED = '${C.RED}', C_GRAY = '${C.GRAY}';
const C_LIGHT = '${C.LIGHT}';

// ====== CH1: 营销池率对比 ======
new Chart(document.getElementById('chart_pool_rate'), {
    type: 'bar',
    data: {
        labels: ['平台模式','联盟模式','电商模式'],
        datasets: [{
            label: '营销池率',
            data: [4.00, 3.50, 3.50],
            backgroundColor: [C_MAIN, C_ORANGE, C_GREEN],
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => ctx.raw.toFixed(2) + '%' } }
        },
        scales: {
            y: { beginAtZero: true, max: 5, ticks: { callback: v => v + '%' }, title: { display: true, text: '营销池率' } }
        }
    }
});

// ====== CH1: 九场景营销池金额 ======
new Chart(document.getElementById('chart_9scenarios'), {
    type: 'bar',
    data: {
        labels: ['S1平台\\n汇付','S2平台\\n余额','S3平台\\n消费金','S4联盟\\n汇付','S5联盟\\n余额','S6联盟\\n消费金','S7电商\\n汇付','S8电商\\n余额','S9电商\\n消费金'],
        datasets: [{
            label: '每¥100交易营销池(¥)',
            data: [4.00, 4.00, 2.80, 3.50, 3.50, 2.45, 3.50, 3.50, 2.45],
            backgroundColor: [
                C_MAIN,C_MAIN,C_MAIN+'88',
                C_ORANGE,C_ORANGE,C_ORANGE+'88',
                C_GREEN,C_GREEN,C_GREEN+'88'
            ],
            borderRadius: 6,
        }]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => '¥' + ctx.raw.toFixed(2) } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => '¥'+v }, title: { display: true, text: '营销池金额' } } }
    }
});

// ====== CH2: 营销预算增长曲线 ======
new Chart(document.getElementById('chart_growth'), {
    type: 'line',
    data: {
        labels: ['20,000','30,000','40,500(盈亏平衡)','50,000','80,000','100,000'],
        datasets: [
            {
                label: '月营销池收入(¥)',
                data: [76000, 114000, 160000, 191500, 306000, 383000],
                borderColor: C_MAIN, backgroundColor: C_MAIN+'22', fill: true, tension: 0.3, borderWidth: 3,
            },
            {
                label: '月固定成本(¥)',
                data: [190000, 190000, 190000, 190000, 250000, 300000],
                borderColor: C_RED, borderDash: [8,4], borderWidth: 2, fill: false,
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => '¥' + ctx.raw.toLocaleString() } },
            annotation: undefined
        },
        scales: {
            y: { ticks: { callback: v => '¥' + (v/1000).toFixed(0) + 'k' }, title: { display: true, text: '金额' } }
        }
    }
});

// ====== CH2: 营销池预算分配饼图 ======
new Chart(document.getElementById('chart_budget_pie'), {
    type: 'doughnut',
    data: {
        labels: ['代金券预算(70%)','推广者激励(15%)','城市级活动(10%)','机动储备(5%)'],
        datasets: [{
            data: [70, 15, 10, 5],
            backgroundColor: [C_MAIN, C_ORANGE, C_GREEN, C_GRAY],
            borderWidth: 2, borderColor: '#fff',
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => ctx.label + ': ¥' + (191500*ctx.raw/100).toFixed(0) + ' (基准50k笔)' } }
        }
    }
});

// ====== CH3: ¥100订单分解 ======
new Chart(document.getElementById('chart_order_breakdown'), {
    type: 'bar',
    data: {
        labels: ['步骤0\\n订单金额','步骤1\\n代金券抵扣','步骤2\\n积分抵扣','步骤3\\n消费金抵扣','步骤4\\n实际支付'],
        datasets: [{
            label: '金额(¥)',
            data: [100.00, 5.00, 10.00, 25.50, 59.50],
            backgroundColor: [C_GRAY, C_MAIN, C_ORANGE, C_GREEN, C_DARK],
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => '¥' + ctx.raw.toFixed(2) } },
        },
        scales: { y: { beginAtZero: true, ticks: { callback: v => '¥'+v }, title: { display: true, text: '金额' } } }
    }
});

// ====== CH3: 三元工具雷达 ======
new Chart(document.getElementById('chart_triple_radar'), {
    type: 'radar',
    data: {
        labels: ['获客能力','留存能力','锁客能力','裂变能力','用户感知价值','合规安全性'],
        datasets: [
            { label: '代金券', data: [95, 40, 30, 60, 75, 95], borderColor: C_MAIN, backgroundColor: C_MAIN+'22', borderWidth: 2 },
            { label: '积分', data: [30, 85, 60, 35, 60, 95], borderColor: C_ORANGE, backgroundColor: C_ORANGE+'22', borderWidth: 2 },
            { label: '消费金', data: [40, 60, 95, 85, 80, 95], borderColor: C_GREEN, backgroundColor: C_GREEN+'22', borderWidth: 2 },
        ]
    },
    options: {
        responsive: true,
        scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } }
    }
});

// ====== CH4: 三级收入对比 ======
new Chart(document.getElementById('chart_income'), {
    type: 'bar',
    data: {
        labels: ['城市服务商','服务站','推广者(兼职)','推广者(全职)'],
        datasets: [{
            label: '月收入(¥)',
            data: [20000, 6000, 878, 3510],
            backgroundColor: [C_MAIN, C_ORANGE, C_GRAY, C_GREEN],
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => '¥' + ctx.raw.toLocaleString() + '/月' } } },
        scales: { y: { ticks: { callback: v => '¥'+v.toLocaleString() }, title: { display: true, text: '月收入' } } }
    }
});

// ====== CH4: 推广佣金占比 ======
new Chart(document.getElementById('chart_promotion_split'), {
    type: 'bar',
    data: {
        labels: ['平台模式','联盟模式','电商模式'],
        datasets: [
            { label: '服务站(35%)', data: [3.15, 3.50, 2.10], backgroundColor: C_MAIN, borderRadius: 0 },
            { label: '推广者(65%)', data: [5.85, 6.50, 3.90], backgroundColor: C_ORANGE, borderRadius: 0 },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label.split('(')[0] + ': ' + ctx.raw.toFixed(2) + '%' } } },
        scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => v+'%' }, title: { display: true, text: '佣金占比' } } }
    }
});

// ====== CH5: 商家等级金字塔 ======
new Chart(document.getElementById('chart_merchant_tier'), {
    type: 'bar',
    data: {
        labels: ['🥉 青铜\\n<¥5,000','🥈 白银\\n¥5k-2万','🥇 黄金\\n¥2万-8万','💎 钻石\\n>¥8万'],
        datasets: [
            { label: '代金券发放率', data: [5, 6, 7, 8], backgroundColor: C_MAIN, borderRadius: 6 },
            { label: '积分翻倍频率(次/月)', data: [0, 1, 4, 8], backgroundColor: C_ORANGE, borderRadius: 6 },
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { callback: v => v+(v<=8&&v>=3?'%':'次') }, title: { display: true, text: '营销支持力度' } } }
    }
});

// ====== CH5: 平台vs联盟 ======
new Chart(document.getElementById('chart_platform_vs_alliance'), {
    type: 'bar',
    data: {
        labels: ['商家服务费结算','平台费用','推广佣金','营销池','消费金'],
        datasets: [
            { label: '平台商家', data: [75.4, 5.0, 9.0, 4.0, 3.0], backgroundColor: C_MAIN, borderRadius: 6 },
            { label: '联盟商家', data: [71.4, 9.5, 10.0, 3.5, 2.0], backgroundColor: C_ORANGE, borderRadius: 6 },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%' } } },
        scales: { y: { ticks: { callback: v => v+'%' }, title: { display: true, text: '占比' } } }
    }
});

// ====== CH6: 用户生命周期漏斗 ======
new Chart(document.getElementById('chart_lifecycle'), {
    type: 'bar',
    data: {
        labels: ['①认知','②首单','③复购','④活跃','⑤忠诚','⑥流失预警','⑦召回'],
        datasets: [
            { label: '月营销预算/人(¥)', data: [5, 18, 12, 25, 50, 15, 30], backgroundColor: [C_GRAY,C_MAIN,C_ORANGE,C_ORANGE,C_GREEN,C_RED,C_MAIN], borderRadius: 8 },
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => '预算: ¥' + ctx.raw + '/人' } }
        },
        scales: { y: { ticks: { callback: v => '¥'+v }, title: { display: true, text: '营销预算' } } }
    }
});

// ====== CH6: 用户分层 ======
new Chart(document.getElementById('chart_user_tiers'), {
    type: 'bar',
    data: {
        labels: ['普通用户','银卡会员','金卡会员','钻石会员'],
        datasets: [
            { label: '月营销预算/人(¥)', data: [18, 35, 60, 100], backgroundColor: [C_GRAY, C_MAIN, C_ORANGE, C_GREEN], borderRadius: 8 },
        ]
    },
    options: {
        responsive: true,
        scales: { y: { ticks: { callback: v => '¥'+v }, title: { display: true, text: '月营销预算' } } }
    }
});

// ====== CH6: 新人大礼包 ======
new Chart(document.getElementById('chart_new_user_gift'), {
    type: 'doughnut',
    data: {
        labels: ['代金券 ¥15 (营销池)','积分200分 ¥2 (营销池)','消费金 ¥10 (消费金池)','其他 ¥3'],
        datasets: [{
            data: [15, 2, 10, 3],
            backgroundColor: [C_MAIN, C_ORANGE, C_GREEN, C_GRAY],
            borderWidth: 2, borderColor: '#fff',
        }]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.label + ': ¥' + ctx.raw } } }
    }
});

// ====== CH7: 营销池月度预算堆叠 ======
new Chart(document.getElementById('chart_budget_stack'), {
    type: 'bar',
    data: {
        labels: ['30,000笔\\n(亏损期)','40,500笔\\n(盈亏平衡)','50,000笔\\n(微利)','80,000笔\\n(健康)','100,000笔\\n(扩张)'],
        datasets: [
            { label: '代金券预算(70%)', data: [79800, 112000, 134050, 214200, 268100], backgroundColor: C_MAIN },
            { label: '推广者激励(15%)', data: [17100, 24000, 28725, 45900, 57450], backgroundColor: C_ORANGE },
            { label: '城市级活动(10%)', data: [11400, 16000, 19150, 30600, 38300], backgroundColor: C_GREEN },
            { label: '机动储备(5%)', data: [5700, 8000, 9575, 15300, 19150], backgroundColor: C_GRAY },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ¥' + ctx.raw.toLocaleString() } } },
        scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => '¥'+(v/1000).toFixed(0)+'k' }, title: { display: true, text: '预算金额' } } }
    }
});

// ====== CH7: 代金券消耗预测 ======
new Chart(document.getElementById('chart_voucher_consumption'), {
    type: 'bar',
    data: {
        labels: ['保守估计\\n(55%核销)','基准估计\\n(65%核销)','乐观估计\\n(75%核销)'],
        datasets: [
            { label: '月核销金额(¥)', data: [4125, 8125, 15000], backgroundColor: [C_MAIN, C_ORANGE, C_GREEN], borderRadius: 8 },
            { label: '营销池占比(%)', data: [3.6, 4.2, 4.9], backgroundColor: [C_MAIN+'88', C_ORANGE+'88', C_GREEN+'88'], borderRadius: 8 },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label.includes('%') ? ctx.raw.toFixed(1)+'%' : '¥'+ctx.raw.toLocaleString() } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => v>1000?'¥'+(v/1000).toFixed(0)+'k':v+'%' }, title: { display: true, text: '金额 / 占比' } } }
    }
});

// ====== CH7: ROI分析 ======
new Chart(document.getElementById('chart_roi'), {
    type: 'bar',
    indexAxis: 'y',
    data: {
        labels: ['综合营销ROI','代金券ROI','积分ROI','消费金ROI','推广者ROI'],
        datasets: [{
            label: 'ROI值',
            data: [1.12, 4.0, 18.75, 0.32, 11.1],
            backgroundColor: [C_DARK, C_MAIN, C_ORANGE, C_GREEN, C_RED],
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => 'ROI: ' + ctx.raw.toFixed(2) } },
        },
        scales: { x: { title: { display: true, text: 'ROI值 (越高越好)' } } }
    }
});

// ====== CH7: 敏感性分析 ======
new Chart(document.getElementById('chart_sensitivity'), {
    type: 'line',
    data: {
        labels: ['3%(保守)','5%(基准)','8%(积极)','10%(激进)'],
        datasets: [
            { label: '月核销金额(¥)', data: [4875, 8125, 13000, 16250], borderColor: C_MAIN, borderWidth: 3, tension: 0.3, yAxisID: 'y' },
            { label: '营销池消耗占比(%)', data: [2.5, 4.2, 6.8, 8.5], borderColor: C_RED, borderWidth: 2, borderDash: [6,3], tension: 0.3, yAxisID: 'y1' },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label.includes('%') ? ctx.raw.toFixed(1)+'%' : '¥'+ctx.raw.toLocaleString() } } },
        scales: {
            y: { type: 'linear', position: 'left', ticks: { callback: v => '¥'+(v/1000).toFixed(0)+'k' }, title: { display: true, text: '核销金额' } },
            y1: { type: 'linear', position: 'right', ticks: { callback: v => v+'%' }, title: { display: true, text: '消耗占比' }, grid: { drawOnChartArea: false } },
        }
    }
});

// ====== CH8: 渠道资源分配 ======
new Chart(document.getElementById('chart_channel_allocation'), {
    type: 'bar',
    data: {
        labels: ['小程序端内','推广者地推','社区服务站','微信社群','视频号/抖音','小红书','城市服务商活动'],
        datasets: [
            { label: '冷启动期', data: [40, 35, 15, 10, 0, 0, 0], backgroundColor: C_MAIN, borderRadius: 6 },
            { label: '增长期', data: [30, 25, 15, 15, 10, 5, 0], backgroundColor: C_ORANGE, borderRadius: 6 },
            { label: '成熟期', data: [25, 15, 15, 15, 15, 10, 5], backgroundColor: C_GREEN, borderRadius: 6 },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw + '%' } } },
        scales: { y: { ticks: { callback: v => v+'%' }, title: { display: true, text: '资源投入占比' } } }
    }
});

// ====== CH8: 渠道热力图数据（用条形图替代） ======
new Chart(document.getElementById('chart_channel_heatmap'), {
    type: 'bar',
    data: {
        labels: ['小程序首页','搜索页','订单确认页','支付成功页','服务通知','社区服务站','商家门店','城市服务商','视频号','小红书','抖音本地'],
        datasets: [
            { label: '代金券', data: [5,4,5,5,4,3,3,3,3,3,3], backgroundColor: C_MAIN, borderRadius: 0 },
            { label: '积分', data: [4,0,4,4,4,0,0,0,3,4,0], backgroundColor: C_ORANGE, borderRadius: 0 },
            { label: '消费金', data: [4,0,4,4,4,0,0,0,3,3,0], backgroundColor: C_GREEN, borderRadius: 0 },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': 强度 ' + ctx.raw + '/5' } } },
        scales: { y: { max: 5, ticks: { stepSize: 1 }, title: { display: true, text: '工具配置强度(0-5)' } } }
    }
});

// ====== CH9: KPI演进 ======
new Chart(document.getElementById('chart_kpi_evolution'), {
    type: 'line',
    data: {
        labels: ['冷启动\\n(公测-第3月)','增长期\\n(第4-6月)','成熟期\\n(第7-12月)'],
        datasets: [
            { label: 'CAC目标(¥)', data: [20, 18, 15], borderColor: C_MAIN, borderWidth: 3, tension: 0.2, yAxisID: 'y' },
            { label: '30日复购率(%)', data: [25, 30, 35], borderColor: C_ORANGE, borderWidth: 3, tension: 0.2, yAxisID: 'y1' },
            { label: '券核销率(%)', data: [55, 60, 65], borderColor: C_GREEN, borderWidth: 3, tension: 0.2, yAxisID: 'y1' },
            { label: '推广者人均GMV(¥)', data: [2000, 3500, 5000], borderColor: C_RED, borderWidth: 2, borderDash: [6,3], tension: 0.2, yAxisID: 'y' },
        ]
    },
    options: {
        responsive: true,
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label.includes('%') ? ctx.raw+'%' : (ctx.raw>100?'¥'+ctx.raw.toLocaleString():'¥'+ctx.raw) } } },
        scales: {
            y: { type: 'linear', position: 'left', ticks: { callback: v => '¥'+(v>=1000?(v/1000).toFixed(0)+'k':v) }, title: { display: true, text: '金额指标' } },
            y1: { type: 'linear', position: 'right', ticks: { callback: v => v+'%' }, title: { display: true, text: '比率指标(%)' }, grid: { drawOnChartArea: false } },
        }
    }
});

// ====== APP C: 竞品雷达 ======
new Chart(document.getElementById('chart_competitive_radar'), {
    type: 'radar',
    data: {
        labels: ['营销工具丰富度','全平台权益互通🆕','用户留存能力','获客效率','商家自主权','千面千店🆕','营销预算灵活性','合规安全性','差异化壁垒'],
        datasets: [
            { label: '美团', data: [60, 20, 55, 70, 40, 15, 35, 80, 50], borderColor: '#FFD100', backgroundColor: '#FFD10022', borderWidth: 2 },
            { label: '抖音本地生活', data: [55, 25, 50, 85, 30, 20, 40, 70, 65], borderColor: '#FF0050', backgroundColor: '#FF005022', borderWidth: 2 },
            { label: '有赞', data: [70, 30, 65, 45, 85, 55, 50, 75, 55], borderColor: '#00A0E9', backgroundColor: '#00A0E922', borderWidth: 2 },
            { label: '链商2.0', data: [90, 95, 85, 80, 80, 90, 95, 95, 90], borderColor: C_ORANGE, backgroundColor: C_ORANGE+'33', borderWidth: 3 },
        ]
    },
    options: {
        responsive: true,
        scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
        plugins: {
            tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw + '/100' } }
        }
    }
});

// ====== ACTIVE NAV ON SCROLL ======
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section,.hero');
    const navLinks = document.querySelectorAll('.side-nav a');
    let current = '';
    sections.forEach(s => {
        const top = s.offsetTop - 100;
        if (scrollY >= top) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
});

// Close nav on link click (mobile)
document.querySelectorAll('.side-nav a').forEach(a => {
    a.addEventListener('click', () => {
        document.querySelector('.side-nav').classList.remove('open');
    });
});
</script>

</body>
</html>`;

// ========== WRITE FILE ==========
fs.writeFileSync(outFile, html, 'utf-8');
console.log('✅ 链商2.0 可视化演示 HTML 已生成: ' + outFile);
console.log('   文件大小: ' + (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(0) + ' KB');
console.log('   定位：社区商业数字经营平台——商户独立经营·生态会员互通·消费权益流转·真实交易激励');
console.log('   版本：V2.0 · 基于V3.2服务费结算与核销模型（跨店通兑版）');
console.log('');
console.log('📊 包含可视化图表：');
console.log('   CH1  营销池率对比柱状图 + 九场景营销池金额图');
console.log('   CH2  营销预算增长曲线 + 营销池预算分配饼图');
console.log('   CH3  ¥100订单分解图 + 三元工具能力雷达图');
console.log('   CH4  三级收入对比图 + 推广佣金占比堆叠图');
console.log('   CH5  商家等级金字塔图 + 平台vs联盟对比图');
console.log('   CH6  用户生命周期预算图 + 用户分层图 + 新人大礼包饼图');
console.log('   CH7  营销池月度预算堆叠图 + 代金券消耗预测 + ROI横向图 + 敏感性分析');
console.log('   CH8  渠道资源分配图 + 工具配置热力图');
console.log('   CH9  KPI三阶段演进图');
console.log('   APP  四平台竞品能力雷达图');
console.log('');
console.log('🎨 设计特性：');
console.log('   ★ 链商品牌色系（深海蓝#1A5276+温暖橙#E67E22+合规绿#1E8449）');
console.log('   ★ Chart.js 4.x 专业数据图表（22+张图表）');
console.log('   ★ 固定侧边导航 + 响应式布局 + 移动端适配');
console.log('   ★ 全屏Hero封面 + 卡片网格 + 时间轴 + 甘特图 + 流程图');
console.log('   ★ 打印友好 + 滚动动画 + 导航高亮跟踪');
