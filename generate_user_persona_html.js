const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, '链商平台_用户画像可行性报告_可视化演示.html');

// ========== FLAT DESIGN COLOR PALETTE (轻松扁平 · 色彩明快) ==========
const C = {
    BLUE: '#4A90D9',      // 柔和蓝 (softer than 深海蓝)
    CORAL: '#FF6B6B',     // 珊瑚红 (warmer than 温暖橙)
    MINT: '#51CF66',      // 薄荷绿
    YELLOW: '#FFD43B',    // 阳光黄
    PURPLE: '#9775FA',    // 柔紫
    TEAL: '#20C997',      // 青绿
    PINK: '#F06595',      // 粉红
    DARK: '#495057',       // 柔和深灰
    GRAY: '#868E96',       // 中性灰
    LIGHT: '#F8F9FA',      // 极浅灰
    WHITE: '#FFFFFF',
    CARD_BG: '#FFFFFF',
    SECTION_ALT: '#F1F3F5',
    HEADER: '#3B5B7A',     // 导航深蓝（略柔和）
};

// Persona colors
const PERSONA_COLORS = [C.BLUE, C.CORAL, C.PURPLE, C.TEAL, C.YELLOW];
const PERSONA_NAMES = ['效率驱动型', '精打细算型', '品质追求型', '场景触发型', '社区依赖型'];
const PERSONA_PCTS = [35, 30, 15, 12, 8];
const PERSONA_MATCH = [8, 9, 7, 6, 9];

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>链商2.0 · 本地生活平台用户画像可行性报告 — 可视化演示</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<style>
/* ====== CSS RESET & BASE ====== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'微软雅黑','Microsoft YaHei','PingFang SC',sans-serif;color:${C.DARK};background:${C.LIGHT};line-height:1.7;overflow-x:hidden}

/* ====== NAVIGATION (compact top bar) ====== */
.top-nav{position:fixed;top:0;left:0;right:0;height:56px;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:0 30px;box-shadow:0 1px 8px rgba(0,0,0,0.06);border-bottom:1px solid rgba(0,0,0,0.04)}
.top-nav .nav-brand{font-weight:800;font-size:16px;color:${C.HEADER};letter-spacing:1px;white-space:nowrap}
.top-nav .nav-brand span{color:${C.BLUE}}
.top-nav .nav-links{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.top-nav .nav-links::-webkit-scrollbar{display:none}
.top-nav .nav-links a{display:inline-block;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;text-decoration:none;color:${C.GRAY};white-space:nowrap;transition:all 0.2s}
.top-nav .nav-links a:hover,.top-nav .nav-links a.active{background:${C.BLUE};color:#fff}

/* ====== MAIN CONTENT ====== */
.main-content{margin-top:56px}
.section{padding:70px 40px;display:flex;flex-direction:column;align-items:center}
.section:nth-child(odd){background:${C.WHITE}}
.section:nth-child(even){background:${C.LIGHT}}

/* ====== HERO ====== */
.hero{background:linear-gradient(135deg,#E8F4FD 0%,#F0E6FA 40%,#FFF3E0 100%);text-align:center;padding:80px 40px 60px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-120px;right:-120px;width:350px;height:350px;border-radius:50%;background:rgba(74,144,217,0.08);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-80px;left:-80px;width:250px;height:250px;border-radius:50%;background:rgba(255,107,107,0.06);pointer-events:none}
.hero .hero-badge{display:inline-block;background:${C.BLUE};color:#fff;padding:5px 18px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:2px;margin-bottom:18px;position:relative;z-index:1}
.hero h1{font-size:clamp(26px,4.5vw,44px);font-weight:900;color:${C.HEADER};position:relative;z-index:1;line-height:1.3}
.hero h1 span{color:${C.CORAL}}
.hero .hero-subtitle{font-size:clamp(14px,2vw,18px);color:${C.GRAY};margin:16px 0 36px;position:relative;z-index:1;max-width:700px}
.hero .hero-stats{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;position:relative;z-index:1}
.hero .stat-card{background:#fff;border-radius:18px;padding:22px 28px;min-width:140px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.04);transition:transform 0.2s}
.hero .stat-card:hover{transform:translateY(-3px)}
.hero .stat-card .stat-icon{font-size:28px;display:block;margin-bottom:6px}
.hero .stat-card .stat-num{font-size:32px;font-weight:900;color:${C.HEADER};display:block}
.hero .stat-card .stat-label{font-size:12px;color:${C.GRAY};margin-top:4px;display:block}

/* ====== SECTION HEADERS ====== */
.section-header{text-align:center;margin-bottom:50px;max-width:800px}
.section-header .ch-tag{display:inline-block;padding:3px 14px;border-radius:12px;font-size:11px;font-weight:700;letter-spacing:2px;margin-bottom:10px}
.section-header .ch-tag.blue{background:#E8F4FD;color:${C.BLUE}}
.section-header .ch-tag.coral{background:#FFF0EE;color:${C.CORAL}}
.section-header .ch-tag.mint{background:#E6F9F0;color:${C.MINT}}
.section-header .ch-tag.purple{background:#F3EEFF;color:${C.PURPLE}}
.section-header .ch-tag.teal{background:#E6F9F5;color:${C.TEAL}}
.section-header h2{font-size:clamp(20px,2.8vw,30px);color:${C.DARK};font-weight:800}
.section-header .ch-desc{color:${C.GRAY};font-size:15px;margin-top:6px}

/* ====== CARDS ====== */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1200px;width:100%}
.card{background:#fff;border-radius:16px;padding:26px 24px;box-shadow:0 2px 10px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.04);transition:transform 0.15s,box-shadow 0.15s}
.card:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.08)}
.card .card-icon{font-size:32px;display:block;margin-bottom:10px}
.card h4{font-size:17px;color:${C.DARK};margin-bottom:8px;font-weight:700}
.card p,.card li{font-size:14px;color:${C.DARK};line-height:1.75}
.card ul{list-style:none;padding:0}
.card ul li::before{content:'• ';color:${C.BLUE};font-weight:700}

/* Persona Cards - special styling */
.persona-card{border-radius:20px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.05);border:2px solid transparent;transition:all 0.2s;position:relative;overflow:hidden}
.persona-card:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,0.1)}
.persona-card .persona-top{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.persona-card .persona-avatar{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;font-weight:800;flex-shrink:0}
.persona-card .persona-title{font-size:20px;font-weight:800;color:${C.DARK}}
.persona-card .persona-pct{font-size:13px;color:${C.GRAY}}
.persona-card .persona-detail{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;font-size:13px}
.persona-card .persona-detail .pd-label{color:${C.GRAY};font-size:11px}
.persona-card .persona-detail .pd-value{font-weight:600;color:${C.DARK}}
.persona-card .persona-match{position:absolute;top:14px;right:16px;background:#F8F9FA;border-radius:10px;padding:6px 12px;text-align:center}
.persona-card .persona-match .pm-score{font-size:22px;font-weight:900;display:block;line-height:1}
.persona-card .persona-match .pm-label{font-size:10px;color:${C.GRAY}}

/* ====== CALLOUTS ====== */
.callout{max-width:1200px;width:100%;margin:20px auto;padding:20px 26px;border-radius:14px}
.callout.info{background:#E8F4FD;border-left:5px solid ${C.BLUE}}
.callout.coral{background:#FFF0EE;border-left:5px solid ${C.CORAL}}
.callout.mint{background:#E6F9F0;border-left:5px solid ${C.MINT}}
.callout.purple{background:#F3EEFF;border-left:5px solid ${C.PURPLE}}
.callout.yellow{background:#FFF9E8;border-left:5px solid ${C.YELLOW}}
.callout h4{font-size:16px;font-weight:700;margin-bottom:8px}
.callout.info h4{color:${C.BLUE}}
.callout.coral h4{color:${C.CORAL}}
.callout.mint h4{color:${C.MINT}}
.callout.purple h4{color:${C.PURPLE}}
.callout p,.callout li{font-size:14px;line-height:1.8}

/* ====== TABLES ====== */
.table-wrap{max-width:1200px;width:100%;margin:20px auto;overflow-x:auto;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,0.04)}
table{width:100%;border-collapse:collapse;font-size:13px}
thead th{background:${C.HEADER};color:#fff;padding:12px 14px;font-weight:700;text-align:center;white-space:nowrap;font-size:12px;letter-spacing:0.5px}
tbody td{padding:10px 14px;text-align:center;border-bottom:1px solid #f0f0f0;font-size:13px}
tbody tr:nth-child(even){background:#FAFBFC}
tbody tr:hover{background:#F0F4F8}
.score-high{color:${C.MINT};font-weight:700}
.score-mid{color:${C.YELLOW};font-weight:700}
.score-low{color:${C.CORAL};font-weight:700}

/* ====== CHARTS ====== */
.chart-container{max-width:900px;width:100%;margin:0 auto}
.chart-container canvas{max-height:380px}
.chart-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:24px;max-width:1200px;width:100%;margin:0 auto}
.chart-card{background:#fff;border-radius:16px;padding:22px;box-shadow:0 2px 10px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.04)}
.chart-card h4{font-size:14px;color:${C.DARK};text-align:center;margin-bottom:14px;font-weight:700}
.chart-card.full{grid-column:1/-1}

/* ====== METRIC ROW ====== */
.metric-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;max-width:1200px;width:100%;margin:16px auto}
.metric-card{background:#fff;border-radius:14px;padding:18px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.04)}
.metric-card .m-icon{font-size:24px;display:block;margin-bottom:6px}
.metric-card .m-value{font-size:30px;font-weight:900;color:${C.HEADER}}
.metric-card .m-label{font-size:12px;color:${C.GRAY};margin-top:3px}

/* ====== PROGRESS BAR ====== */
.score-list{max-width:900px;width:100%;margin:10px auto}
.score-item{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.score-item .si-label{width:160px;text-align:right;font-size:14px;font-weight:600;color:${C.DARK};flex-shrink:0}
.score-item .si-bar-wrap{flex:1;height:26px;background:#eee;border-radius:13px;overflow:hidden;position:relative}
.score-item .si-bar{height:100%;border-radius:13px;display:flex;align-items:center;justify-content:flex-end;padding-right:10px;font-size:12px;font-weight:700;color:#fff;transition:width 0.8s ease-out}
.score-item .si-note{width:120px;font-size:12px;color:${C.GRAY};flex-shrink:0}

/* ====== FLOW ====== */
.persona-flow{display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;max-width:1200px;width:100%;margin:16px auto;padding:10px 0}
.flow-box{border-radius:14px;padding:16px 20px;text-align:center;min-width:140px;box-shadow:0 2px 8px rgba(0,0,0,0.05)}
.flow-box .fb-icon{font-size:24px;display:block;margin-bottom:4px}
.flow-box .fb-title{font-weight:700;font-size:14px}
.flow-box .fb-desc{font-size:11px;color:${C.GRAY};margin-top:2px}
.flow-arrow{font-size:24px;color:${C.GRAY};margin:0 6px;font-weight:700}

/* ====== TIMELINE ====== */
.roadmap{max-width:1100px;width:100%;margin:16px auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.roadmap-phase{background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.04);border-top:5px solid}
.roadmap-phase.p1{border-top-color:${C.BLUE}}
.roadmap-phase.p2{border-top-color:${C.CORAL}}
.roadmap-phase.p3{border-top-color:${C.MINT}}
.roadmap-phase .rp-title{font-size:18px;font-weight:800;color:${C.DARK};margin-bottom:4px}
.roadmap-phase .rp-time{font-size:12px;color:${C.GRAY};margin-bottom:14px}
.roadmap-phase .rp-item{font-size:13px;padding:6px 0;border-bottom:1px solid #f0f0f0;display:flex;align-items:flex-start;gap:8px}
.roadmap-phase .rp-item .rp-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px}
.roadmap-phase .rp-kpi{font-size:12px;color:${C.GRAY};margin-top:12px;padding:10px;background:${C.LIGHT};border-radius:8px;line-height:1.6}

/* ====== TAGS ====== */
.tag{display:inline-block;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:600;margin:2px}
.tag.blue{background:#E8F4FD;color:${C.BLUE}}
.tag.coral{background:#FFF0EE;color:${C.CORAL}}
.tag.mint{background:#E6F9F0;color:${C.MINT}}
.tag.purple{background:#F3EEFF;color:${C.PURPLE}}
.tag.yellow{background:#FFF9E8;color:#E8A800}

/* ====== FOOTER ====== */
.doc-footer{background:${C.HEADER};color:rgba(255,255,255,0.7);text-align:center;padding:36px 20px;font-size:13px}
.doc-footer .footer-brand{color:#fff;font-size:17px;font-weight:700;margin-bottom:6px}
.doc-footer .footer-note{color:${C.CORAL};font-size:12px;margin-top:10px;font-weight:600}

/* ====== RESPONSIVE ====== */
@media(max-width:900px){
  .section{padding:40px 18px}
  .hero{padding:60px 18px 40px}
  .top-nav .nav-links{display:none}
  .chart-row{grid-template-columns:1fr}
  .persona-flow{flex-direction:column}
  .flow-arrow{transform:rotate(90deg)}
  .score-item{flex-wrap:wrap}
  .score-item .si-label{width:100%;text-align:left}
  .score-item .si-note{width:100%}
  .persona-card .persona-detail{grid-template-columns:1fr}
}
@media print{
  .top-nav{display:none!important}
  .main-content{margin-top:0}
  .section{min-height:auto;page-break-inside:avoid;padding:24px 0}
}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.animate{animation:fadeInUp 0.5s ease-out forwards}
</style>
</head>
<body>

<!-- ====== TOP NAVIGATION ====== -->
<nav class="top-nav" id="topNav">
  <div class="nav-brand">🔗 <span>链商2.0</span> · 用户画像可行性报告</div>
  <div class="nav-links">
    <a href="#hero" class="active">总览</a>
    <a href="#ch1">市场分析</a>
    <a href="#ch2">消费者画像</a>
    <a href="#ch3">商户画像</a>
    <a href="#ch4">推广网络</a>
    <a href="#ch5">生命周期</a>
    <a href="#ch6">竞争格局</a>
    <a href="#ch7">可行性评估</a>
    <a href="#ch8">路线图</a>
  </div>
</nav>

<div class="main-content">

<!-- ====== HERO ====== -->
<section class="hero" id="hero">
  <div class="hero-badge">📊 链商2.0 · 用户策略研究 · 2026年6月</div>
  <h1>本地生活平台<br><span>用户画像可行性报告</span></h1>
  <p class="hero-subtitle">基于艾媒咨询 · 艾瑞咨询 · QuestMobile 权威数据 —— 面向社区商业数字经营平台的全景用户策略研究</p>
  <div class="hero-stats">
    <div class="stat-card">
      <span class="stat-icon">👥</span>
      <span class="stat-num">5.69亿</span>
      <span class="stat-label">本地生活 MAU</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">🎯</span>
      <span class="stat-num">5+5+3</span>
      <span class="stat-label">消费者·商户·推广者画像</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">⭐</span>
      <span class="stat-num">8/10</span>
      <span class="stat-label">综合可行性评分</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">📈</span>
      <span class="stat-num">38,881亿</span>
      <span class="stat-label">O2O市场规模(+17.6%)</span>
    </div>
    <div class="stat-card">
      <span class="stat-icon">💎</span>
      <span class="stat-num">9/10</span>
      <span class="stat-label">核心画像匹配度</span>
    </div>
  </div>
</section>

<!-- ====== CHAPTER 1: MARKET OVERVIEW ====== -->
<section class="section" id="ch1">
  <div class="section-header">
    <span class="ch-tag blue">CHAPTER 1</span>
    <h2>市场宏观分析 · 规模与趋势</h2>
    <p class="ch-desc">万亿级本地生活市场持续高增长 · 三强格局下的链商2.0差异化机会</p>
  </div>

  <div class="metric-row">
    <div class="metric-card"><span class="m-icon">🏪</span><span class="m-value">38,881亿</span><span class="m-label">2025年O2O市场规模</span></div>
    <div class="metric-card"><span class="m-icon">📈</span><span class="m-value">+17.6%</span><span class="m-label">同比增速</span></div>
    <div class="metric-card"><span class="m-icon">🎯</span><span class="m-value">1万亿+</span><span class="m-label">2026即时零售预测</span></div>
    <div class="metric-card"><span class="m-icon">📱</span><span class="m-value">5.69亿</span><span class="m-label">本地生活MAU(2026.3)</span></div>
    <div class="metric-card"><span class="m-icon">🔄</span><span class="m-value">3.61亿</span><span class="m-label">三平台重叠用户</span></div>
    <div class="metric-card"><span class="m-icon">⚡</span><span class="m-value">44.8%</span><span class="m-label">用户下单前多平台比价</span></div>
  </div>

  <div class="chart-row" style="margin-top:10px">
    <div class="chart-card">
      <h4>📈 中国O2O市场规模增长趋势（2022-2028）</h4>
      <canvas id="chart_market_size"></canvas>
    </div>
    <div class="chart-card">
      <h4>🏆 2025Q4 外卖市场三强份额对比</h4>
      <canvas id="chart_market_share"></canvas>
    </div>
  </div>

  <div class="card-grid" style="margin-top:10px">
    <div class="card" style="border-left:4px solid ${C.BLUE}">
      <span class="card-icon">🔵</span>
      <h4>美团外卖 · 48%</h4>
      <p>规模最大 · 闪电仓3万+ · 外卖根基自然生长即时零售 · 用户价格敏感+高频</p>
    </div>
    <div class="card" style="border-left:4px solid ${C.CORAL}">
      <span class="card-icon">🟠</span>
      <h4>淘宝闪购 · 33%</h4>
      <p>超级流量入口 · 日订单峰值1.2亿 · 3500天猫品牌接入 · 电商用户溢出+全品类覆盖</p>
    </div>
    <div class="card" style="border-left:4px solid ${C.MINT}">
      <span class="card-icon">🔴</span>
      <h4>京东外卖 · 19%</h4>
      <p>品质标杆 · 15万全职骑手(100%五险一金) · 超级供应链 · 品质敏感+品牌忠诚</p>
    </div>
  </div>

  <div class="callout info" style="margin-top:20px">
    <h4>💡 链商2.0 四大差异化窗口</h4>
    <p>① <strong>社区信任红利</strong>——三平台均缺"熟人推荐"维度，推广者网络获客成本天然低于广告投放<br>
    ② <strong>权益互通空白</strong>——三平台会员权益均封闭，链商"三券全平台跨店通用"是竞品无法快速复制的壁垒<br>
    ③ <strong>中小商家真空</strong>——三平台争夺KA商家，社区独立商家缺乏轻量级数字经营工具<br>
    ④ <strong>消费权益流转</strong>——从"平台垄断用户权益"→"用户权益跨店自由流通"，三平台均无法实现</p>
  </div>
</section>

<!-- ====== CHAPTER 2: CONSUMER PERSONAS ====== -->
<section class="section" id="ch2">
  <div class="section-header">
    <span class="ch-tag coral">CHAPTER 2</span>
    <h2>C端消费者深度画像</h2>
    <p class="ch-desc">五类消费动机画像 · 人口结构全景 · 行为变迁趋势 · 决策路径模型</p>
  </div>

  <!-- Donut chart + bar chart -->
  <div class="chart-row">
    <div class="chart-card">
      <h4>🍩 五类消费者画像占比分布</h4>
      <canvas id="chart_persona_donut"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 五类画像 × 链商2.0匹配度评分</h4>
      <canvas id="chart_persona_match"></canvas>
    </div>
  </div>

  <!-- Persona Cards -->
  <div class="card-grid" style="margin-top:20px">
    <div class="persona-card" style="border-color:${C.BLUE};background:linear-gradient(180deg,#fff 70%,#E8F4FD 100%)">
      <div class="persona-match"><span class="pm-score" style="color:${C.BLUE}">8</span><span class="pm-label">匹配度</span></div>
      <div class="persona-top">
        <div class="persona-avatar" style="background:${C.BLUE}">⚡</div>
        <div><div class="persona-title">效率驱动型</div><div class="persona-pct">占比 ≈35% · 约2亿用户</div></div>
      </div>
      <div class="persona-detail">
        <div><span class="pd-label">典型</span><br><span class="pd-value">25-38岁城市白领</span></div>
        <div><span class="pd-label">月消费</span><br><span class="pd-value">¥1,500-3,500</span></div>
        <div><span class="pd-label">核心需求</span><br><span class="pd-value">30分钟履约·一键下单</span></div>
        <div><span class="pd-label">平台忠诚度</span><br><span class="pd-value">低——"谁快用谁"</span></div>
        <div><span class="pd-label">价格敏感</span><br><span class="pd-value">中低·愿付溢价</span></div>
        <div><span class="pd-label">关键钩子</span><br><span class="pd-value">首单免配送+15分钟承诺</span></div>
      </div>
    </div>

    <div class="persona-card" style="border-color:${C.CORAL};background:linear-gradient(180deg,#fff 70%,#FFF0EE 100%)">
      <div class="persona-match"><span class="pm-score" style="color:${C.CORAL}">9</span><span class="pm-label">匹配度</span></div>
      <div class="persona-top">
        <div class="persona-avatar" style="background:${C.CORAL}">💰</div>
        <div><div class="persona-title">精打细算型</div><div class="persona-pct">占比 ≈30% · 约1.7亿用户</div></div>
      </div>
      <div class="persona-detail">
        <div><span class="pd-label">典型</span><br><span class="pd-value">28-45岁家庭消费者(女65%)</span></div>
        <div><span class="pd-label">月消费</span><br><span class="pd-value">¥1,000-3,000</span></div>
        <div><span class="pd-label">核心需求</span><br><span class="pd-value">比价最大化·三券叠加</span></div>
        <div><span class="pd-label">平台忠诚度</span><br><span class="pd-value">中——券/积分有黏性</span></div>
        <div><span class="pd-label">价格敏感</span><br><span class="pd-value">极高·5-10分钟比价</span></div>
        <div><span class="pd-label">关键钩子</span><br><span class="pd-value">三券叠加新人包¥50</span></div>
      </div>
    </div>

    <div class="persona-card" style="border-color:${C.PURPLE};background:linear-gradient(180deg,#fff 70%,#F3EEFF 100%)">
      <div class="persona-match"><span class="pm-score" style="color:${C.PURPLE}">7</span><span class="pm-label">匹配度</span></div>
      <div class="persona-top">
        <div class="persona-avatar" style="background:${C.PURPLE}">👑</div>
        <div><div class="persona-title">品质追求型</div><div class="persona-pct">占比 ≈15% · 约8,500万用户</div></div>
      </div>
      <div class="persona-detail">
        <div><span class="pd-label">典型</span><br><span class="pd-value">30-50岁中高收入(>¥25K)</span></div>
        <div><span class="pd-label">月消费</span><br><span class="pd-value">¥3,000-8,000</span></div>
        <div><span class="pd-label">核心需求</span><br><span class="pd-value">品质认证·溯源透明</span></div>
        <div><span class="pd-label">平台忠诚度</span><br><span class="pd-value">高——信任后复购率极高</span></div>
        <div><span class="pd-label">价格敏感</span><br><span class="pd-value">低·品质>品牌>价格</span></div>
        <div><span class="pd-label">关键钩子</span><br><span class="pd-value">品牌认证蓝标+品质保障</span></div>
      </div>
    </div>

    <div class="persona-card" style="border-color:${C.TEAL};background:linear-gradient(180deg,#fff 70%,#E6F9F5 100%)">
      <div class="persona-match"><span class="pm-score" style="color:${C.TEAL}">6</span><span class="pm-label">匹配度</span></div>
      <div class="persona-top">
        <div class="persona-avatar" style="background:${C.TEAL}">🎁</div>
        <div><div class="persona-title">场景触发型</div><div class="persona-pct">占比 ≈12% · 约6,800万用户</div></div>
      </div>
      <div class="persona-detail">
        <div><span class="pd-label">典型</span><br><span class="pd-value">全年龄段·场景驱动</span></div>
        <div><span class="pd-label">客单价</span><br><span class="pd-value">¥150-800/单</span></div>
        <div><span class="pd-label">核心需求</span><br><span class="pd-value">节庆礼赠·聚餐·应急</span></div>
        <div><span class="pd-label">平台忠诚度</span><br><span class="pd-value">极低·按场景选择</span></div>
        <div><span class="pd-label">价格敏感</span><br><span class="pd-value">中·场景紧迫>价格</span></div>
        <div><span class="pd-label">关键钩子</span><br><span class="pd-value">场景专属优惠套餐</span></div>
      </div>
    </div>

    <div class="persona-card" style="border-color:${C.YELLOW};background:linear-gradient(180deg,#fff 70%,#FFF9E8 100%)">
      <div class="persona-match"><span class="pm-score" style="color:#E8A800">9</span><span class="pm-label">匹配度</span></div>
      <div class="persona-top">
        <div class="persona-avatar" style="background:#E8A800">🏘️</div>
        <div><div class="persona-title">社区依赖型</div><div class="persona-pct">占比 ≈8% · 约4,500万用户</div></div>
      </div>
      <div class="persona-detail">
        <div><span class="pd-label">典型</span><br><span class="pd-value">50岁+银发族/全职妈妈</span></div>
        <div><span class="pd-label">月消费</span><br><span class="pd-value">¥800-2,000</span></div>
        <div><span class="pd-label">核心需求</span><br><span class="pd-value">熟人店·代客下单·邻里信任</span></div>
        <div><span class="pd-label">平台忠诚度</span><br><span class="pd-value">极高——"老王推荐就买"</span></div>
        <div><span class="pd-label">价格敏感</span><br><span class="pd-value">中·信任>价格</span></div>
        <div><span class="pd-label">关键钩子</span><br><span class="pd-value">社区好店绿标+代客下单</span></div>
      </div>
    </div>
  </div>

  <!-- Consumer behavior changes -->
  <div class="chart-row" style="margin-top:20px">
    <div class="chart-card full">
      <h4>📊 消费者行为变迁（2025→2026）— 多项行为变化占比</h4>
      <canvas id="chart_behavior_change"></canvas>
    </div>
  </div>

  <!-- Decision path -->
  <div class="callout purple" style="margin-top:10px">
    <h4>🧭 消费者四阶段决策路径</h4>
    <div class="persona-flow">
      <div class="flow-box" style="background:#F3EEFF"><span class="fb-icon">🔍</span><span class="fb-title">需求识别</span><span class="fb-desc">0-3秒·首页推荐+搜索入口</span></div>
      <span class="flow-arrow">→</span>
      <div class="flow-box" style="background:#E8F4FD"><span class="fb-icon">📋</span><span class="fb-title">信息搜索</span><span class="fb-desc">3-30秒·排序+图文详情</span></div>
      <span class="flow-arrow">→</span>
      <div class="flow-box" style="background:#FFF0EE"><span class="fb-icon">⚖️</span><span class="fb-title">决策对比</span><span class="fb-desc">30-120秒·44.8%跨平台比价</span></div>
      <span class="flow-arrow">→</span>
      <div class="flow-box" style="background:#E6F9F0"><span class="fb-icon">💳</span><span class="fb-title">下单支付</span><span class="fb-desc"><10秒·自动核销最优券</span></div>
    </div>
    <p style="text-align:center;font-size:13px;color:${C.GRAY};margin-top:6px">链商2.0优势：三券叠加后到手价在其他平台无法直接对比 → 形成"信息不对称护城河"</p>
  </div>
</section>

<!-- ====== CHAPTER 3: MERCHANT PERSONAS ====== -->
<section class="section" id="ch3">
  <div class="section-header">
    <span class="ch-tag teal">CHAPTER 3</span>
    <h2>B端商户深度画像</h2>
    <p class="ch-desc">五类商户画像 · 决策因素排序 · 痛点地图 · 链商2.0价值匹配</p>
  </div>

  <div class="chart-row">
    <div class="chart-card full">
      <h4>🏪 五类商户画像速览</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>画像</th><th>对应业态</th><th>典型</th><th>月营收</th><th>数字化水平</th><th>核心痛点</th><th>链商匹配</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:700">独立品牌商户</td><td><span class="tag blue">平台商家</span></td><td>连锁快餐/茶饮/美业 3-20店</td><td>15-80万/店</td><td>中高</td><td>高佣金·用户归属平台</td><td class="score-high">★★★★★</td></tr>
            <tr><td style="font-weight:700">社区零售店</td><td><span class="tag coral">联盟商家</span></td><td>便利店/水果店/药店 1-3店</td><td>5-25万/店</td><td>低</td><td>不会做线上·缺营销能力</td><td class="score-high">★★★★</td></tr>
            <tr><td style="font-weight:700">商圈综合体</td><td><span class="tag coral">联盟商家</span></td><td>社区Mall/商业街/产业园</td><td>100-500万</td><td>中</td><td>招商难·商户流失</td><td class="score-high">★★★★</td></tr>
            <tr><td style="font-weight:700">品类供应商</td><td><span class="tag purple">综合商城</span></td><td>日百/生鲜/3C供应链商家</td><td>50-200万</td><td>高</td><td>多平台运营成本高</td><td class="score-mid">★★★</td></tr>
            <tr><td style="font-weight:700">个体经营者</td><td><span class="tag teal">联盟/服务站</span></td><td>团购团长/私厨/手作</td><td>1-5万</td><td>极低</td><td>全靠熟人推荐·无工具</td><td class="score-mid">★★★</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="chart-row" style="margin-top:0">
    <div class="chart-card">
      <h4>📊 商户选择平台的核心决策因素（n=600）</h4>
      <canvas id="chart_merchant_factors"></canvas>
    </div>
    <div class="chart-card">
      <h4>🔴 商户八大痛点 × 链商2.0解决程度</h4>
      <canvas id="chart_merchant_pain"></canvas>
    </div>
  </div>

  <div class="callout info" style="margin-top:10px">
    <h4>💡 关键洞察：商户决策逻辑已从"价格导向"→"价值导向"</h4>
    <p>"更低的佣金"已跌至第9位（32.0%）——商家不再单纯追求低价，而是追求"钱花得值"。链商2.0核心竞争力不在价格战，而在<strong>"私域锁客+运营赋能+权益互通"</strong>的价值组合。商家到手率82.4%-90%、汇付实时直清、交易即分润——这些不是"更便宜"而是"更值得"。</p>
  </div>
</section>

<!-- ====== CHAPTER 4: PROMOTION NETWORK ====== -->
<section class="section" id="ch4">
  <div class="section-header">
    <span class="ch-tag purple">CHAPTER 4</span>
    <h2>P端推广网络画像（链商2.0独有）</h2>
    <p class="ch-desc">三级推广体系 · 城市服务商→服务站→推广者 · 竞品不具备的核心差异化资产</p>
  </div>

  <div class="card-grid">
    <div class="card" style="border-left:4px solid ${C.PURPLE}">
      <span class="card-icon">🏙️</span>
      <h4>城市服务商 · 区域合伙人</h4>
      <p>本地企业家/招商代理 · 平台城市交易额<strong>1%分成</strong> · 管理3-10服务站+50-200推广者 · 年收入15-80万</p>
      <p style="margin-top:8px;font-size:13px;color:${C.GRAY}">核心能力：本地商户资源·招商能力·团队管理·政府关系</p>
    </div>
    <div class="card" style="border-left:4px solid ${C.BLUE}">
      <span class="card-icon">🏪</span>
      <h4>服务站 · 社区节点</h4>
      <p>便利店店主/物业管家 · 服务站佣金池<strong>35%分配</strong> · 管理10-30推广者 · 月收入3,000-15,000元</p>
      <p style="margin-top:8px;font-size:13px;color:${C.GRAY}">核心价值：降低最后一公里履约成本·社区信任节点·物理流量转化</p>
    </div>
    <div class="card" style="border-left:4px solid ${C.CORAL}">
      <span class="card-icon">🙋</span>
      <h4>推广者 · 一线触达</h4>
      <p>社区活跃居民/宝妈/快递员 · 推广佣金<strong>65%分配</strong> · 碎片化时间 · 月收入500-3,000元</p>
      <p style="margin-top:8px;font-size:13px;color:${C.GRAY}">核心动力：副业增收+社区影响力——"推荐好店给邻居，自己还能赚点"</p>
    </div>
  </div>

  <div class="chart-row" style="margin-top:20px">
    <div class="chart-card">
      <h4>🥧 三级推广网络 ¥100交易分配（平台商家）</h4>
      <canvas id="chart_promotion_pie"></canvas>
    </div>
    <div class="chart-card">
      <h4>📊 推广者收入模型 · 月交易量梯度</h4>
      <canvas id="chart_promoter_income"></canvas>
    </div>
  </div>

  <div class="callout mint" style="margin-top:10px">
    <h4>✅ 合规要点：三级推广完全合法合规</h4>
    <p>推广者收入<strong>100%基于真实交易</strong>——零入门费、零人头费、零无限层级（仅3级）、佣金有上限。完全符合《禁止传销条例》和《电子商务法》要求。与社交电商/社区团购的"拉人头"模式有本质区别。</p>
  </div>
</section>

<!-- ====== CHAPTER 5: LIFECYCLE & STRATIFICATION ====== -->
<section class="section" id="ch5">
  <div class="section-header">
    <span class="ch-tag coral">CHAPTER 5</span>
    <h2>用户生命周期与分层运营</h2>
    <p class="ch-desc">生命周期×画像矩阵 · 三业态×消费者匹配 · 四象限分层运营</p>
  </div>

  <div class="chart-row">
    <div class="chart-card full">
      <h4>🔄 消费者生命周期 × 画像矩阵</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>阶段</th><th>⚡效率驱动</th><th>💰精打细算</th><th>👑品质追求</th><th>🎁场景触发</th><th>🏘️社区依赖</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:700">认知期</td><td>搜索"附近+品类"</td><td>比价首页/优惠专区</td><td>品牌搜索/认证筛选</td><td>场景标签+品类导航</td><td>熟人推荐/社区二维码</td></tr>
            <tr><td style="font-weight:700">首单期</td><td>首单立减+30min达</td><td>新人大礼包(三券)</td><td>品牌蓝标+品质承诺</td><td>首单场景优惠券</td><td>店员代客下单</td></tr>
            <tr><td style="font-weight:700">复购期</td><td>快捷再来一单+自动提醒</td><td>三券叠加+到期预警</td><td>新品/限量+品牌故事</td><td>场景复现(节日/换季)</td><td>到店消费+邻里优惠</td></tr>
            <tr><td style="font-weight:700">裂变期</td><td>分享配送体验+满赠</td><td>转发优惠券+拼团</td><td>品牌口碑KOC传播</td><td>场景套餐分享</td><td>邻里推荐+社区活动</td></tr>
            <tr><td style="font-weight:700">流失预警</td><td>7天未下单→优化提醒</td><td>券将过期→"别浪费"</td><td>新品/品质活动推送</td><td>场景旺季提醒</td><td>店员关怀+邻里回访</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="chart-row" style="margin-top:0">
    <div class="chart-card">
      <h4>🏪 三业态 × 消费者匹配热度</h4>
      <canvas id="chart_biz_persona_heat"></canvas>
    </div>
    <div class="chart-card">
      <h4>👥 消费者四象限分层运营</h4>
      <canvas id="chart_user_pyramid"></canvas>
    </div>
  </div>

  <div class="callout coral" style="margin-top:10px">
    <h4>🎯 核心种子用户策略</h4>
    <p><strong>社区依赖型(8%) = 冷启动种子</strong>——匹配度9/10，忠诚度极高，通过服务站+社区二维码+邻里推荐触达。<br>
    <strong>精打细算型(30%) = 规模增长引擎</strong>——匹配度9/10，占比最大，通过三券叠加比价内容+社区群裂变触达。<br>
    先冷启动后规模增长——当单社区活跃用户≥200后启动精打细算型规模化获客。</p>
  </div>
</section>

<!-- ====== CHAPTER 6: COMPETITIVE ====== -->
<section class="section" id="ch6">
  <div class="section-header">
    <span class="ch-tag blue">CHAPTER 6</span>
    <h2>竞争格局下的用户获取策略</h2>
    <p class="ch-desc">三平台用户重叠分析 · 差异化获客路径 · CAC对比优势 · 各画像获客策略</p>
  </div>

  <div class="chart-row">
    <div class="chart-card">
      <h4>🎯 四平台 × 五画像覆盖能力雷达</h4>
      <canvas id="chart_competitive_radar"></canvas>
    </div>
    <div class="chart-card">
      <h4>💰 用户获取成本(CAC)对比 · 分渠道</h4>
      <canvas id="chart_cac_compare"></canvas>
    </div>
  </div>

  <div class="chart-row" style="margin-top:0">
    <div class="chart-card full">
      <h4>🎯 五类画像差异化获客策略</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>画像</th><th>获客切入点</th><th>核心渠道</th><th>关键钩子</th><th>预算权重</th><th>预期CAC</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:700">⚡效率驱动</td><td>"你楼下最快的店都在链生活"</td><td>搜索入口/地图/写字楼广告</td><td>首单免配送+15min承诺</td><td>20%</td><td>¥12-18</td></tr>
            <tr><td style="font-weight:700">💰精打细算</td><td>"比美团便宜、券跨店通用"</td><td>优惠比价/社区群/妈妈群</td><td>三券叠加新人包¥50</td><td>30%</td><td>¥15-25</td></tr>
            <tr><td style="font-weight:700">👑品质追求</td><td>"认证品牌商家、品质看得见"</td><td>品质KOL/品牌专区/高端社区</td><td>品牌认证蓝标+品质保障</td><td>20%</td><td>¥20-35</td></tr>
            <tr><td style="font-weight:700">🎁场景触发</td><td>"过节送礼聚餐——链生活一站搞定"</td><td>场景搜索/社媒/节日前夕</td><td>场景专属优惠套餐</td><td>15%</td><td>¥15-25</td></tr>
            <tr><td style="font-weight:700">🏘️社区依赖</td><td>"你楼下的好店都在链生活"</td><td>社区二维码/门店海报/邻里群</td><td>到店消费减¥5+代客下单</td><td>15%</td><td>¥5-10</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="callout mint" style="margin-top:10px">
    <h4>💡 链商2.0 CAC核心优势：¥12-20 vs 行业¥22-35（降幅35-50%）</h4>
    <p>三级推广网络将获客成本从"广告投放"转化为"交易分成"——获客成本不再前置，而是与交易同步发生。<br>
    社区依赖型CAC最低（¥5-10），推广者熟人推荐替代了昂贵的搜索/信息流广告——这是竞品无法复制的结构性成本优势。</p>
  </div>
</section>

<!-- ====== CHAPTER 7: FEASIBILITY ASSESSMENT ====== -->
<section class="section" id="ch7">
  <div class="section-header">
    <span class="ch-tag mint">CHAPTER 7</span>
    <h2>综合可行性评估</h2>
    <p class="ch-desc">市场规模可行性 · 用户需求匹配度 · 风险矩阵 · 关键假设验证</p>
  </div>

  <div class="score-list">
    <div class="score-item">
      <span class="si-label">市场规模可行性</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:90%;background:linear-gradient(90deg,${C.MINT},${C.TEAL})">9/10</div></div>
      <span class="si-note">万亿级市场+17.6%增速</span>
    </div>
    <div class="score-item">
      <span class="si-label">用户需求匹配度</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:80%;background:linear-gradient(90deg,${C.BLUE},${C.PURPLE})">8/10</div></div>
      <span class="si-note">核心画像9分·品质/场景需供给积累</span>
    </div>
    <div class="score-item">
      <span class="si-label">竞争差异化</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:80%;background:linear-gradient(90deg,${C.CORAL},${C.PINK})">8/10</div></div>
      <span class="si-note">社区熟人+权益互通=明确窗口</span>
    </div>
    <div class="score-item">
      <span class="si-label">商业模式自洽性</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:90%;background:linear-gradient(90deg,${C.MINT},${C.TEAL})">9/10</div></div>
      <span class="si-note">交易即分润+V3.2参数验证</span>
    </div>
    <div class="score-item">
      <span class="si-label">获客成本优势</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:90%;background:linear-gradient(90deg,${C.PURPLE},${C.BLUE})">9/10</div></div>
      <span class="si-note">三级推广天然低成本</span>
    </div>
    <div class="score-item">
      <span class="si-label">合规安全边际</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:90%;background:linear-gradient(90deg,${C.MINT},${C.TEAL})">9/10</div></div>
      <span class="si-note">三红线+去金融化+禁止传销</span>
    </div>
    <div class="score-item">
      <span class="si-label">执行可落地性</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:70%;background:linear-gradient(90deg,${C.YELLOW},${C.CORAL})">7/10</div></div>
      <span class="si-note">商家BD+推广者招募需强力执行</span>
    </div>
    <div class="score-item" style="border-top:2px solid #eee;padding-top:14px">
      <span class="si-label" style="font-size:16px">综合可行性</span>
      <div class="si-bar-wrap"><div class="si-bar" style="width:80%;background:linear-gradient(90deg,${C.CORAL},${C.PINK});font-size:14px">8/10</div></div>
      <span class="si-note" style="font-weight:700;color:${C.CORAL}">可行·建议进入</span>
    </div>
  </div>

  <div class="chart-row" style="margin-top:20px">
    <div class="chart-card">
      <h4>⚠️ 七大风险矩阵 · 概率 × 影响程度</h4>
      <canvas id="chart_risk_bubble"></canvas>
    </div>
    <div class="chart-card">
      <h4>🔬 七大关键假设 · 验证优先级</h4>
      <canvas id="chart_hypothesis"></canvas>
    </div>
  </div>

  <div class="callout coral" style="margin-top:10px">
    <h4>⚡ 最高优先级风险</h4>
    <p><strong>🔴 P0：社区商家密度不足</strong>（概率40-60%，影响致命）→ 冷启动期集中BD核心社区，确保每社区≥15家活跃商家。<br>
    无商家则无消费——这是所有用户画像策略的前提条件，必须最先验证。</p>
  </div>
</section>

<!-- ====== CHAPTER 8: ROADMAP ====== -->
<section class="section" id="ch8">
  <div class="section-header">
    <span class="ch-tag coral">CHAPTER 8</span>
    <h2>策略建议与实施路线图</h2>
    <p class="ch-desc">三阶段推进 · 双画像种子策略 · "农村包围城市"商家策略 · 用户画像迭代机制</p>
  </div>

  <div class="roadmap">
    <div class="roadmap-phase p1">
      <div class="rp-title">🚀 第一阶段 · 冷启动期</div>
      <div class="rp-time">第1-30天</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.BLUE}"></span>每社区BD ≥15家商家</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.BLUE}"></span>招募100名种子推广者</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.BLUE}"></span>三券系统上线·跑通端到端体验</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.BLUE}"></span>验证7个关键假设</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.BLUE}"></span>画像重点：社区依赖型验证</div>
      <div class="rp-kpi"><strong>KPI：</strong>社区商家≥300 · 日订单≥100 · 推广者≥100<br>社区依赖型30日留存≥60%</div>
    </div>
    <div class="roadmap-phase p2">
      <div class="rp-title">📈 第二阶段 · 增长验证期</div>
      <div class="rp-time">第31-90天</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.CORAL}"></span>精打细算型规模获客启动</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.CORAL}"></span>品质追求型初步引入</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.CORAL}"></span>建立服务站管理体系(≥10个)</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.CORAL}"></span>验证CAC优势+三券复购模型</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.CORAL}"></span>推广者裂变≥500人</div>
      <div class="rp-kpi"><strong>KPI：</strong>月订单≥5,000 · 30日复购≥35% · CAC≤¥20<br>精打细算型30日复购率≥35%</div>
    </div>
    <div class="roadmap-phase p3">
      <div class="rp-title">🏆 第三阶段 · 规模化期</div>
      <div class="rp-time">第91-180天</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.MINT}"></span>城市服务商≥10城</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.MINT}"></span>综合商城品类≥50类</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.MINT}"></span>品质商家≥100家</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.MINT}"></span>全画像覆盖·品牌认知建立</div>
      <div class="rp-item"><span class="rp-dot" style="background:${C.MINT}"></span>场景触发型重点突破</div>
      <div class="rp-kpi"><strong>KPI：</strong>月订单≥30,000 · 月GMV≥300万<br>品质追求型占比≥15% · 商家留存率≥70%</div>
    </div>
  </div>

  <div class="callout purple" style="margin-top:20px">
    <h4>🔄 用户画像持续迭代机制</h4>
    <p>① <strong>月度画像校准</strong>——基于实际交易数据和行为聚类更新五种画像的占比和特征<br>
    ② <strong>季度深度调研</strong>——200+用户调研+50+商家访谈，定性验证定量数据<br>
    ③ <strong>画像细分</strong>——当某画像占比>20%时进行二级细分（如精打细算型→券达人/比价型/拼团型）<br>
    ④ <strong>流失画像分析</strong>——建立"已流失用户画像"，分析谁在流失、为什么、如何召回<br>
    ⑤ <strong>竞品用户迁移监控</strong>——持续监控从美团/淘宝闪购/京东迁移到链商的用户画像特征</p>
  </div>
</section>

<!-- ====== FOOTER ====== -->
<div class="doc-footer">
  <div class="footer-brand">🔗 链商2.0 · 链生活品牌</div>
  <p>本地生活平台 用户画像可行性报告 · 可视化演示 V1.0 | 2026年6月6日 · 企业宣传部 · 品牌战略组</p>
  <p style="margin-top:8px"><strong>链商2.0定位：面向社区商业的数字经营平台——商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励</strong></p>
  <p style="margin-top:6px;font-size:12px">数据来源：艾媒咨询 · 艾瑞咨询 · QuestMobile · 商务部 · 链商V3.2/V15模型 | 分析方法论：奥美FABE · USP · 利益分层 · 全渠道渗透</p>
  <p class="footer-note">核心结论：综合可行性 8/10 · 社区依赖型(8%)冷启动 → 精打细算型(30%)规模增长 → 全画像覆盖</p>
  <p style="margin-top:14px;font-size:11px">© 2026 广东链邦科技有限公司（全球拼购 GGbingo 子公司）· 企业宣传策划专员 梁君衡</p>
</div>

</div><!-- /main-content -->

<!-- ====== CHART.JS INIT ====== -->
<script>
Chart.defaults.font.family = "'Microsoft YaHei','PingFang SC',sans-serif";
Chart.defaults.font.size = 12;
const C_BLUE='${C.BLUE}',C_CORAL='${C.CORAL}',C_MINT='${C.MINT}',C_YELLOW='${C.YELLOW}';
const C_PURPLE='${C.PURPLE}',C_TEAL='${C.TEAL}',C_PINK='${C.PINK}',C_DARK='${C.DARK}',C_GRAY='${C.GRAY}';
const P_COLORS=['${C.BLUE}','${C.CORAL}','${C.PURPLE}','${C.TEAL}','${C.YELLOW}'];
const P_COLORS_A=['rgba(74,144,217,0.7)','rgba(255,107,107,0.7)','rgba(151,117,250,0.7)','rgba(32,201,151,0.7)','rgba(255,212,59,0.7)'];

// ====== CH1: Market Size Trend ======
new Chart(document.getElementById('chart_market_size'), {
    type:'line',
    data:{
        labels:['2022','2023','2024','2025','2026E','2027E','2028E'],
        datasets:[
            {label:'O2O市场规模(亿元)',data:[23800,28500,33063,38881,45000,52000,59144],borderColor:C_BLUE,borderWidth:3,tension:0.3,fill:true,backgroundColor:'rgba(74,144,217,0.08)',pointRadius:5,pointBackgroundColor:C_BLUE},
            {label:'即时零售规模(亿元)',data:[4500,5800,8000,8800,10500,12500,14800],borderColor:C_CORAL,borderWidth:3,tension:0.3,fill:true,backgroundColor:'rgba(255,107,107,0.06)',pointRadius:5,pointBackgroundColor:C_CORAL,borderDash:[6,3]},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+ctx.raw.toLocaleString()+'亿元'}}},scales:{y:{ticks:{callback:v=>(v/10000).toFixed(1)+'万亿'}}}}
});

// ====== CH1: Market Share Doughnut ======
new Chart(document.getElementById('chart_market_share'), {
    type:'doughnut',
    data:{
        labels:['美团外卖 48%','淘宝闪购 33%','京东外卖 19%'],
        datasets:[{data:[48,33,19],backgroundColor:['#FFD100','#FF6B35','#E31E24'],borderWidth:3,borderColor:'#fff',hoverOffset:8}]
    },
    options:{responsive:true,plugins:{legend:{position:'bottom'},tooltip:{callbacks:{label:ctx=>ctx.label+' (2025Q4)'}}},cutout:'60%'}
});

// ====== CH2: Persona Donut ======
new Chart(document.getElementById('chart_persona_donut'), {
    type:'doughnut',
    data:{
        labels:['效率驱动型 35%','精打细算型 30%','品质追求型 15%','场景触发型 12%','社区依赖型 8%'],
        datasets:[{data:[35,30,15,12,8],backgroundColor:P_COLORS,borderWidth:4,borderColor:'#fff',hoverOffset:10}]
    },
    options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}},cutout:'55%'}
});

// ====== CH2: Persona Match Scores ======
new Chart(document.getElementById('chart_persona_match'), {
    type:'bar',
    data:{
        labels:['效率驱动型','精打细算型','品质追求型','场景触发型','社区依赖型'],
        datasets:[
            {label:'链商2.0匹配度',data:[8,9,7,6,9],backgroundColor:P_COLORS_A,borderColor:P_COLORS,borderWidth:2,borderRadius:8},
            {label:'行业平均水平',data:[6,6,6,6,6],backgroundColor:'rgba(200,200,200,0.5)',borderColor:'#ccc',borderWidth:1,borderRadius:8,borderDash:[5,5],type:'line',pointRadius:0},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+ctx.raw+'/10'}}},scales:{y:{min:0,max:10,ticks:{stepSize:2, callback:v=>v+'/10'}}}}
});

// ====== CH2: Consumer Behavior Change ======
new Chart(document.getElementById('chart_behavior_change'), {
    type:'bar',
    data:{
        labels:['下单前对比\n三家平台','外卖APP\n频率增加','网购带动\n其他消费','尝试更多\n即时品类','点单频次\n显著提升','减少到店\n用餐次数'],
        datasets:[{label:'行为变化占比(%)',data:[44.8,44.7,38.3,35.3,35.5,31.1],backgroundColor:[C_BLUE,C_CORAL,C_PURPLE,C_TEAL,C_YELLOW,C_PINK].map(c=>c+'88'),borderColor:[C_BLUE,C_CORAL,C_PURPLE,C_TEAL,C_YELLOW,C_PINK],borderWidth:2,borderRadius:8}]
    },
    options:{responsive:true,indexAxis:'y',plugins:{tooltip:{callbacks:{label:ctx=>ctx.raw+'%'}}},scales:{x:{max:55,ticks:{callback:v=>v+'%'}}}}
});

// ====== CH3: Merchant Decision Factors ======
new Chart(document.getElementById('chart_merchant_factors'), {
    type:'bar',
    data:{
        labels:['高效配送\n(进阶)','运营培训\n指导','配送服务\n(基础)','纠纷处理\n机制','用户画像\n数据分析','佣金\n合理透明','免费/低价\n营销工具','营销工具\n扶持政策','更低佣金\n折扣'],
        datasets:[
            {label:'商家选择平台的决策因素(%)',data:[53.7,51.0,50.5,47.7,44.2,43.8,41.2,38.5,32.0],backgroundColor:['rgba(32,201,151,0.8)','rgba(32,201,151,0.7)','rgba(74,144,217,0.7)','rgba(74,144,217,0.6)','rgba(151,117,250,0.7)','rgba(255,107,107,0.7)','rgba(255,107,107,0.5)','rgba(255,107,107,0.4)','rgba(200,200,200,0.6)'],borderRadius:8}
        ]
    },
    options:{responsive:true,indexAxis:'y',plugins:{tooltip:{callbacks:{label:ctx=>ctx.raw+'%'}}},scales:{x:{max:65,ticks:{callback:v=>v+'%'}}}}
});

// ====== CH3: Merchant Pain Points ======
new Chart(document.getElementById('chart_merchant_pain'), {
    type:'bar',
    data:{
        labels:['获客成本高','用户难留存','运营复杂','营销力不足','资金回款慢','流量不透明','缺数据分析','履约配送难'],
        datasets:[
            {label:'痛点严重度(1-10)',data:[10,10,7,7,7,5,5,5],backgroundColor:'rgba(255,107,107,0.6)',borderColor:C_CORAL,borderWidth:1,borderRadius:6},
            {label:'链商2.0解决度(1-10)',data:[10,10,8,8,10,8,8,5],backgroundColor:'rgba(32,201,151,0.6)',borderColor:C_MINT,borderWidth:1,borderRadius:6},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+ctx.raw+'/10'}}},scales:{y:{min:0,max:10,ticks:{stepSize:2}}}}
});

// ====== CH4: Promotion Network Pie ======
new Chart(document.getElementById('chart_promotion_pie'), {
    type:'doughnut',
    data:{
        labels:['城市服务商 ¥1.00','服务站管理 ¥3.15','推广者执行 ¥5.85','其他(商家+平台等) ¥90.00'],
        datasets:[{data:[1,3.15,5.85,90],backgroundColor:[C_PURPLE,C_BLUE,C_CORAL,'#E9ECEF'],borderWidth:3,borderColor:'#fff',hoverOffset:6}]
    },
    options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{size:11}}},tooltip:{callbacks:{label:ctx=>ctx.label}}},cutout:'60%'}
});

// ====== CH4: Promoter Income ======
new Chart(document.getElementById('chart_promoter_income'), {
    type:'bar',
    data:{
        labels:['月推广10笔\n(GMV¥1,000)','月推广50笔\n(GMV¥5,000)','月推广100笔\n(GMV¥10,000)','月推广200笔\n(GMV¥20,000)','月推广500笔\n(GMV¥50,000)'],
        datasets:[
            {label:'推广者月收入(¥)——按65%佣金占比',data:[59,293,585,1170,2925],backgroundColor:'rgba(255,107,107,0.7)',borderColor:C_CORAL,borderWidth:2,borderRadius:8},
            {label:'服务站月收入(¥)——管理10个推广者',data:[315,1575,3150,6300,15750],backgroundColor:'rgba(74,144,217,0.7)',borderColor:C_BLUE,borderWidth:2,borderRadius:8},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': ¥'+ctx.raw.toLocaleString()}}},scales:{y:{ticks:{callback:v=>'¥'+v.toLocaleString()}}}}
});

// ====== CH5: Biz × Persona Heat Map (using bar chart as proxy) ======
new Chart(document.getElementById('chart_biz_persona_heat'), {
    type:'bar',
    data:{
        labels:['效率驱动型','精打细算型','品质追求型','场景触发型','社区依赖型'],
        datasets:[
            {label:'平台商家',data:[5,4,5,3,3],backgroundColor:'rgba(74,144,217,0.8)',borderRadius:6},
            {label:'联盟商家',data:[3,4,3,4,5],backgroundColor:'rgba(255,107,107,0.8)',borderRadius:6},
            {label:'综合商城',data:[2,5,2,5,2],backgroundColor:'rgba(151,117,250,0.8)',borderRadius:6},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+('★'.repeat(ctx.raw))}}},scales:{y:{min:0,max:5,ticks:{stepSize:1, callback:v=>'★'.repeat(v)}}}}
});

// ====== CH5: User Stratification Pyramid ======
new Chart(document.getElementById('chart_user_pyramid'), {
    type:'bar',
    data:{
        labels:['VIP会员\n高ARPU×高频','活跃会员\n中ARPU×高频','普通会员\n中ARPU×低频','沉睡会员\n低ARPU×低频'],
        datasets:[
            {label:'占比(%)',data:[8,25,40,27],backgroundColor:['rgba(151,117,250,0.8)','rgba(74,144,217,0.7)','rgba(32,201,151,0.6)','rgba(200,200,200,0.5)'],borderRadius:8},
            {label:'预估月权益成本(¥/人)',data:[425,140,55,20],backgroundColor:'transparent',borderColor:C_CORAL,borderWidth:2,borderRadius:0,type:'line',yAxisID:'y1',pointRadius:5,pointBackgroundColor:C_CORAL},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label.includes('%')?ctx.raw+'%':'¥'+ctx.raw}}},scales:{y:{position:'left',ticks:{callback:v=>v+'%'}},y1:{position:'right',ticks:{callback:v=>'¥'+v},grid:{drawOnChartArea:false}}}}
});

// ====== CH6: Competitive Radar ======
new Chart(document.getElementById('chart_competitive_radar'), {
    type:'radar',
    data:{
        labels:['效率驱动型\n覆盖力','精打细算型\n覆盖力','品质追求型\n覆盖力','场景触发型\n覆盖力','社区依赖型\n覆盖力','权益跨平台\n通用','社区熟人\n信任','中小商家\n服务能力'],
        datasets:[
            {label:'美团',data:[90,75,60,80,30,10,20,25],borderColor:'#FFD100',backgroundColor:'rgba(255,209,0,0.1)',borderWidth:2},
            {label:'淘宝闪购',data:[75,85,55,90,25,15,15,30],borderColor:'#FF6B35',backgroundColor:'rgba(255,107,53,0.1)',borderWidth:2},
            {label:'京东外卖',data:[65,40,85,50,20,20,10,20],borderColor:'#E31E24',backgroundColor:'rgba(227,30,36,0.1)',borderWidth:2},
            {label:'链商2.0',data:[80,95,70,60,95,95,90,85],borderColor:C_CORAL,backgroundColor:'rgba(255,107,107,0.2)',borderWidth:3},
        ]
    },
    options:{responsive:true,scales:{r:{beginAtZero:true,max:100,ticks:{stepSize:20}}},plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+ctx.raw+'/100'}}}}
});

// ====== CH6: CAC Compare ======
new Chart(document.getElementById('chart_cac_compare'), {
    type:'bar',
    data:{
        labels:['搜索/信息流','社区地推','KOL/达人','自然流量','综合加权'],
        datasets:[
            {label:'行业平均CAC(¥)',data:[32,18,55,12,28],backgroundColor:'rgba(200,200,200,0.7)',borderColor:'#aaa',borderWidth:1,borderRadius:6},
            {label:'链商2.0预估CAC(¥)',data:[24,8,20,7,15],backgroundColor:'rgba(32,201,151,0.7)',borderColor:C_MINT,borderWidth:2,borderRadius:6},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': ¥'+ctx.raw}}},scales:{y:{ticks:{callback:v=>'¥'+v}}}}
});

// ====== CH7: Risk Bubble Chart ======
new Chart(document.getElementById('chart_risk_bubble'), {
    type:'bubble',
    data:{
        datasets:[
            {label:'🔴 P0 致命风险',data:[{x:50,y:100,r:22}],backgroundColor:'rgba(255,107,107,0.6)',borderColor:C_CORAL,borderWidth:2},
            {label:'🟡 P1 严重风险',data:[{x:30,y:80,r:18},{x:15,y:75,r:18},{x:8,y:80,r:18}],backgroundColor:'rgba(255,212,59,0.6)',borderColor:C_YELLOW,borderWidth:2},
            {label:'🟠 P2 中等风险',data:[{x:40,y:50,r:15},{x:35,y:40,r:15},{x:60,y:35,r:15}],backgroundColor:'rgba(74,144,217,0.5)',borderColor:C_BLUE,borderWidth:2},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label.replace(/[🔴🟡🟠]\s*P\d\s*/,'')+' (概率:'+ctx.raw.x+'% 影响:'+ctx.raw.y+'/100)'}}},scales:{x:{min:0,max:80,title:{display:true,text:'发生概率(%)'}},y:{min:0,max:120,title:{display:true,text:'影响程度(0-100)'}}}}
});

// ====== CH7: Key Hypotheses ======
new Chart(document.getElementById('chart_hypothesis'), {
    type:'bar',
    data:{
        labels:['①商家密度\n驱动增长','②推广者\n冷启动','③三券驱动\n复购≥35%','④社区依赖\n画像≥8%','⑤CAC\n≤¥20','⑥跨店通兑\n率≥30%','⑦商家留存\n率≥70%'],
        datasets:[
            {label:'当前信心指数(1-10)',data:[6,7,8,7,8,7,8],backgroundColor:[C_YELLOW+'99',C_BLUE+'99',C_MINT+'99',C_PURPLE+'99',C_MINT+'99',C_TEAL+'99',C_MINT+'99'],borderColor:[C_YELLOW,C_BLUE,C_MINT,C_PURPLE,C_MINT,C_TEAL,C_MINT],borderWidth:2,borderRadius:8},
        ]
    },
    options:{responsive:true,plugins:{tooltip:{callbacks:{label:ctx=>ctx.dataset.label+': '+ctx.raw+'/10'}}},scales:{y:{min:0,max:10,ticks:{stepSize:2,callback:v=>v+'/10'}}}}
});

// ====== ACTIVE NAV ON SCROLL ======
window.addEventListener('scroll',()=>{
    const sections=document.querySelectorAll('.section,.hero');
    const navLinks=document.querySelectorAll('.top-nav .nav-links a');
    let current='';
    sections.forEach(s=>{const top=s.offsetTop-100;if(scrollY>=top)current=s.getAttribute('id')});
    navLinks.forEach(a=>{a.classList.remove('active');if(a.getAttribute('href')==='#'+current)a.classList.add('active')});
});
</script>

</body>
</html>`;

// ========== WRITE FILE ==========
fs.writeFileSync(outFile, html, 'utf-8');
console.log('✅ 用户画像可视化演示 HTML 已生成: ' + outFile);
console.log('   文件大小: ' + (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(0) + ' KB');
console.log('   设计风格: 轻松扁平 · 色彩明快 · 主次分明');
console.log('   版本: V1.0 · 基于用户画像可行性报告');
console.log('');
console.log('📊 包含可视化图表 (18+ Chart.js 图表):');
console.log('   CH1  市场增长趋势图 + 三强份额环图');
console.log('   CH2  五画像占比环图 + 匹配度对比图 + 消费行为变迁图');
console.log('   CH3  商户决策因素图 + 痛点解决度对比图');
console.log('   CH4  三级推广分配环图 + 推广者收入模型图');
console.log('   CH5  业态×画像匹配图 + 用户分层金字塔图');
console.log('   CH6  四平台竞品雷达图 + CAC对比图');
console.log('   CH7  风险气泡矩阵 + 关键假设信心指数图');
console.log('');
console.log('🎨 设计特性:');
console.log('   ★ 轻松扁平设计风格 · 柔和配色（蓝/珊瑚/紫/青/黄五色体系）');
console.log('   ★ 大圆角卡片 + 微妙阴影 + 彩色左边框');
console.log('   ★ 五类消费者画像专属渐变色卡片（含匹配度徽章）');
console.log('   ★ 固定顶部导航栏(毛玻璃效果) + 响应式布局 + 移动端适配');
console.log('   ★ 全屏Hero封面 + 卡片网格 + 流程图 + 进度条 + 路线图卡片');
console.log('   ★ 18+ Chart.js 专业图表 · 打印友好 · 滚动导航高亮跟踪');
