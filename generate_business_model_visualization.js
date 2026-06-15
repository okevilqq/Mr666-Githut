const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '20260602 链商平台 技术部会议整理');
const outFile = path.join(outDir, '链商2.0_商业模式全景图_思维导图与动态指标.html');

// ========== DATA FROM V3.2 MODEL ==========
const { COLORS, META } = require('./lib/constants');

const C = {
    MAIN: COLORS.DEEP_BLUE, DARK: '#2C3E50', LIGHT: COLORS.LIGHT_BG, WHITE: COLORS.WHITE,
    BLACK: COLORS.DARK_GRAY, GRAY: COLORS.MID_GRAY, RED: COLORS.RED, GREEN: COLORS.GREEN,
    ORANGE: COLORS.WARM_ORANGE, HEADER: '#1a1a2e', YELLOW: COLORS.YELLOW,
    LIGHT_ORANGE: '#FFF5F0', LIGHT_RED: '#FFF5F5', LIGHT_GREEN: '#F0FFF4',
    PURPLE: '#8E44AD', TEAL: '#16A085',
};

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>链商2.0 · 链生活品牌 — 商业模式全景图 | 思维导图 · 动态指标 · 策略可视化</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js">
</script>
<style>
/* ====== CSS RESET & BASE ====== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'${FONT.body}','Microsoft YaHei','PingFang SC',sans-serif;color:${C.BLACK};background:#0a0a14;line-height:1.7;overflow-x:hidden}

/* ====== PARTICLES BG ====== */
#particles-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.3}

/* ====== NAVIGATION ====== */
.side-nav{position:fixed;left:0;top:0;width:250px;height:100vh;background:rgba(26,26,46,0.95);z-index:1000;overflow-y:auto;padding:20px 0;box-shadow:2px 0 30px rgba(0,0,0,0.5);transition:transform 0.3s;backdrop-filter:blur(20px)}
.side-nav .nav-logo{text-align:center;padding:10px 20px 20px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:10px}
.side-nav .nav-logo h3{color:#fff;font-size:15px;font-weight:700;letter-spacing:1px}
.side-nav .nav-logo small{color:${C.GRAY};font-size:10px}
.side-nav a{display:block;padding:10px 20px;color:rgba(255,255,255,0.6);text-decoration:none;font-size:12px;border-left:3px solid transparent;transition:all 0.2s}
.side-nav a:hover,.side-nav a.active{color:#fff;background:rgba(255,255,255,0.04);border-left-color:${C.ORANGE}}
.side-nav a.section-header{font-weight:700;font-size:13px;color:#fff;margin-top:8px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06)}
.nav-toggle{display:none;position:fixed;top:12px;left:12px;z-index:1001;background:${C.HEADER};color:#fff;border:none;width:40px;height:40px;border-radius:8px;font-size:20px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.5)}

/* ====== MAIN CONTENT ====== */
.main-content{margin-left:250px;position:relative;z-index:1}
.section{padding:80px 60px;min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative}
.section:nth-child(odd){background:rgba(255,255,255,0.02)}
.section:nth-child(even){background:rgba(255,255,255,0.04)}

/* ====== HERO ====== */
.hero{background:linear-gradient(135deg,${C.HEADER} 0%,${C.MAIN} 40%,#0d3b5e 70%,${C.HEADER} 100%);color:#fff;text-align:center;padding:100px 50px;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 40%,rgba(230,126,34,0.2) 0%,transparent 50%),radial-gradient(circle at 70% 60%,rgba(26,82,118,0.4) 0%,transparent 50%),radial-gradient(circle at 50% 80%,rgba(142,68,173,0.15) 0%,transparent 40%);pointer-events:none}
.hero .hero-badge{display:inline-block;background:linear-gradient(135deg,${C.ORANGE},#f39c12);color:#fff;padding:8px 24px;border-radius:24px;font-size:13px;font-weight:700;letter-spacing:3px;margin-bottom:24px;position:relative;z-index:1;box-shadow:0 4px 20px rgba(230,126,34,0.3)}
.hero .glitch-text{font-size:clamp(36px,6vw,60px);font-weight:900;margin:20px 0;position:relative;z-index:1;text-shadow:0 0 40px rgba(26,82,118,0.5)}
.hero .glitch-text .accent{color:${C.ORANGE};text-shadow:0 0 30px rgba(230,126,34,0.5)}
.hero .hero-subtitle{font-size:clamp(14px,1.8vw,18px);color:rgba(255,255,255,0.7);margin-bottom:50px;position:relative;z-index:1;max-width:800px;line-height:1.8}
.hero .hero-stats{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;position:relative;z-index:1}
.hero .stat-card{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px 32px;min-width:170px;text-align:center;transition:all 0.3s}
.hero .stat-card:hover{background:rgba(255,255,255,0.1);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.3)}
.hero .stat-card .stat-num{font-size:40px;font-weight:900;color:${C.ORANGE};display:block;line-height:1}
.hero .stat-card .stat-label{font-size:12px;color:rgba(255,255,255,0.55);margin-top:10px;display:block;line-height:1.4}
.hero .scroll-hint{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:1;animation:bounce 2s infinite}
.hero .scroll-hint span{display:block;width:30px;height:30px;border-right:2px solid rgba(255,255,255,0.5);border-bottom:2px solid rgba(255,255,255,0.5);transform:rotate(45deg)}
@keyframes bounce{0%,100%{opacity:0.3;transform:translateX(-50%) translateY(0)}50%{opacity:1;transform:translateX(-50%) translateY(10px)}}

/* ====== SECTION HEADERS ====== */
.section-title{text-align:center;margin-bottom:50px;position:relative}
.section-title .ch-num{display:inline-block;background:linear-gradient(135deg,${C.MAIN},${C.DARK});color:#fff;padding:6px 20px;border-radius:16px;font-size:11px;font-weight:700;letter-spacing:3px;margin-bottom:14px;box-shadow:0 4px 15px rgba(26,82,118,0.3)}
.section-title h2{font-size:clamp(24px,3.5vw,36px);color:#fff;font-weight:900;letter-spacing:1px}
.section-title .ch-desc{color:${C.GRAY};font-size:15px;margin-top:10px}

/* ====== MIND MAP ====== */
#mindmap-container{width:100%;height:800px;position:relative;background:rgba(255,255,255,0.02);border-radius:20px;border:1px solid rgba(255,255,255,0.06);overflow:hidden}
#mindmap-svg{width:100%;height:100%}
.mindmap-node{cursor:pointer;transition:all 0.3s}
.mindmap-node:hover{filter:brightness(1.3)}
.mindmap-tooltip{position:absolute;background:rgba(26,26,46,0.95);color:#fff;padding:12px 18px;border-radius:10px;font-size:13px;pointer-events:none;opacity:0;transition:opacity 0.2s;border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(10px);z-index:10;max-width:300px;box-shadow:0 8px 30px rgba(0,0,0,0.5)}

/* ====== CARDS ====== */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;max-width:1300px;margin:0 auto;width:100%}
.card-grid.sm{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card{background:rgba(255,255,255,0.03);border-radius:18px;padding:30px;border:1px solid rgba(255,255,255,0.08);transition:all 0.3s;position:relative;overflow:hidden}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.3);border-color:rgba(255,255,255,0.15)}
.card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%}
.card.blue::before{background:${C.MAIN}}
.card.orange::before{background:${C.ORANGE}}
.card.green::before{background:${C.GREEN}}
.card.red::before{background:${C.RED}}
.card.purple::before{background:${C.PURPLE}}
.card.teal::before{background:${C.TEAL}}
.card h4{font-size:18px;color:#fff;margin-bottom:12px;font-weight:700}
.card .card-icon{font-size:32px;margin-bottom:12px;display:block}
.card p,.card li{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8}
.card ul{list-style:none;padding:0}
.card ul li::before{content:'▸ ';color:${C.ORANGE};font-weight:700}
.card .metric-big{font-size:42px;font-weight:900;color:${C.ORANGE};display:block;line-height:1.1}
.card .metric-label{font-size:12px;color:${C.GRAY};margin-top:4px}

/* ====== CALLOUT ====== */
.callout{max-width:1300px;margin:20px auto;padding:24px 30px;border-radius:14px;width:100%}
.callout.info{background:rgba(235,245,251,0.06);border-left:6px solid ${C.MAIN}}
.callout.warning{background:rgba(255,245,240,0.06);border-left:6px solid ${C.ORANGE}}
.callout.danger{background:rgba(255,245,245,0.06);border-left:6px solid ${C.RED}}
.callout.success{background:rgba(240,255,244,0.06);border-left:6px solid ${C.GREEN}}
.callout h4{font-size:17px;font-weight:700;margin-bottom:10px}
.callout.info h4{color:${C.MAIN}}
.callout.warning h4{color:${C.ORANGE}}
.callout.danger h4{color:${C.RED}}
.callout.success h4{color:${C.GREEN}}
.callout p,.callout li{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8}

/* ====== FLOW DIAGRAM ====== */
.flow-container{max-width:1300px;margin:0 auto;width:100%;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:16px;padding:30px}
.flow-box{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:18px 24px;text-align:center;min-width:130px;transition:all 0.3s;position:relative}
.flow-box:hover{background:rgba(255,255,255,0.1);transform:scale(1.05)}
.flow-box.highlight{background:rgba(230,126,34,0.12);border-color:${C.ORANGE}}
.flow-box.primary{background:rgba(26,82,118,0.2);border-color:${C.MAIN}}
.flow-box .flow-title{font-size:14px;font-weight:700;color:#fff;display:block}
.flow-box .flow-sub{font-size:11px;color:${C.GRAY};margin-top:4px}
.flow-arrow{color:${C.ORANGE};font-size:24px;font-weight:900;display:flex;align-items:center}

/* ====== TABLES ====== */
.table-wrap{max-width:1300px;margin:20px auto;overflow-x:auto;width:100%;border-radius:14px}
.dt-table{width:100%;border-collapse:collapse;font-size:13px}
.dt-table thead th{background:${C.HEADER};color:#fff;padding:14px 14px;font-weight:700;text-align:center;white-space:nowrap;font-size:12px;border-bottom:2px solid ${C.ORANGE}}
.dt-table tbody td{padding:11px 14px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;color:rgba(255,255,255,0.8)}
.dt-table tbody tr:nth-child(even){background:rgba(255,255,255,0.02)}
.dt-table tbody tr:hover{background:rgba(26,82,118,0.1)}
.dt-table .highlight-cell{color:${C.ORANGE};font-weight:700}

/* ====== CHARTS ====== */
.chart-container{max-width:1100px;margin:0 auto;width:100%;position:relative}
.chart-container canvas{max-height:420px}
.chart-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(450px,1fr));gap:30px;max-width:1300px;margin:0 auto;width:100%}

/* ====== KPI DASHBOARD ====== */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;max-width:1300px;margin:0 auto;width:100%}
.kpi-card{background:rgba(255,255,255,0.03);border-radius:16px;padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.06);transition:all 0.3s}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.3)}
.kpi-card .kpi-val{font-size:38px;font-weight:900;display:block;line-height:1.1}
.kpi-card .kpi-label{font-size:11px;color:${C.GRAY};margin-top:6px;display:block}
.kpi-card .kpi-change{font-size:12px;margin-top:4px}
.kpi-card .kpi-change.up{color:${C.GREEN}}
.kpi-card .kpi-change.warn{color:${C.ORANGE}}

/* ====== GAUGE ====== */
.gauge-container{display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap;max-width:1300px;margin:0 auto}
.gauge-item{text-align:center}
.gauge-item canvas{max-width:200px}
.gauge-item .gauge-label{color:#fff;font-size:13px;font-weight:700;margin-top:8px}
.gauge-item .gauge-sub{color:${C.GRAY};font-size:11px}

/* ====== TIMELINE ====== */
.timeline{max-width:1100px;margin:0 auto;position:relative;padding:20px 0}
.timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,transparent,rgba(230,126,34,0.4),rgba(26,82,118,0.4),transparent);transform:translateX(-50%)}
.timeline-item{display:flex;align-items:center;margin:30px 0;position:relative}
.timeline-item:nth-child(odd){flex-direction:row}
.timeline-item:nth-child(even){flex-direction:row-reverse}
.timeline-dot{width:16px;height:16px;border-radius:50%;position:absolute;left:50%;transform:translateX(-50%);z-index:2}
.timeline-dot.orange{background:${C.ORANGE};box-shadow:0 0 16px ${C.ORANGE}}
.timeline-dot.blue{background:${C.MAIN};box-shadow:0 0 16px ${C.MAIN}}
.timeline-dot.green{background:${C.GREEN};box-shadow:0 0 16px ${C.GREEN}}
.timeline-content{width:45%;padding:20px 24px;background:rgba(255,255,255,0.03);border-radius:14px;border:1px solid rgba(255,255,255,0.06)}
.timeline-content h4{color:#fff;font-size:16px;margin-bottom:6px}
.timeline-content p{color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6}

/* ====== SANKEY FLOW ====== */
#sankey-container{width:100%;height:600px;position:relative}
#sankey-svg{width:100%;height:100%}
.sankey-link{transition:opacity 0.3s}
.sankey-link:hover{opacity:0.8}

/* ====== FOOTER ====== */
.footer{text-align:center;padding:40px;background:rgba(26,26,46,0.8);color:${C.GRAY};font-size:12px;border-top:1px solid rgba(255,255,255,0.05)}

/* ====== RESPONSIVE ====== */
@media(max-width:768px){
  .side-nav{transform:translateX(-100%)}
  .side-nav.open{transform:translateX(0)}
  .nav-toggle{display:flex;align-items:center;justify-content:center}
  .main-content{margin-left:0}
  .section{padding:50px 20px}
  .hero{padding:60px 20px}
  .hero .hero-stats{gap:10px}
  .hero .stat-card{min-width:130px;padding:18px 16px}
  .hero .stat-card .stat-num{font-size:28px}
  #mindmap-container{height:500px}
  .flow-container{flex-direction:column}
  .flow-arrow{transform:rotate(90deg)}
  .chart-row{grid-template-columns:1fr}
  .card-grid{grid-template-columns:1fr}
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .timeline::before{left:20px}
  .timeline-item,.timeline-item:nth-child(even){flex-direction:row}
  .timeline-dot{left:20px}
  .timeline-content{width:calc(100% - 50px);margin-left:30px}
}

@media print{
  .side-nav,.nav-toggle{display:none}
  .main-content{margin-left:0}
  .section{page-break-inside:avoid;min-height:auto;padding:30px}
}
</style>
</head>
<body>

<!-- ====== SIDE NAVIGATION ====== -->
<nav class="side-nav" id="sideNav">
  <div class="nav-logo">
    <h3>🔗 链商2.0 · 链生活</h3>
    <small>商业模式全景图 · V3.2</small>
  </div>
  <a href="#hero" class="active">🏠 全景总览</a>
  <a href="#mindmap" class="section-header">🧠 商业模式思维导图</a>
  <a href="#coresystems">🔗 两大核心体系</a>
  <a href="#distribution">💰 分润模型全景</a>
  <a href="#scenarios">📊 九场景动态对比</a>
  <a href="#dashboard" class="section-header">📈 动态指标仪表盘</a>
  <a href="#marketing">🎯 三元营销体系</a>
  <a href="#crossstore">🔄 跨店通兑结算</a>
  <a href="#breakeven">⚖️ 盈亏平衡分析</a>
  <a href="#journey">🗺️ 消费流转旅程</a>
  <a href="#kpi" class="section-header">🏆 关键指标体系</a>
  <a href="#merchants">🏪 三级商家对比</a>
  <a href="#compliance">🛡️ 合规风控仪表</a>
</nav>
<button class="nav-toggle" id="navToggle" onclick="toggleNav()">☰</button>

<!-- ====== MAIN CONTENT ====== -->
<div class="main-content">

<!-- ====== HERO ====== -->
<section class="hero" id="hero">
  <div class="hero-badge">链商 2.0 · 商业模式全景图</div>
  <h1 class="glitch-text">
    面向<span class="accent">社区商业</span>的数字经营平台
  </h1>
  <p class="hero-subtitle">
    商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励<br>
    两大体系驱动：消费流转体系 + 全生态会员权益互通体系
  </p>
  <div class="hero-stats">
    <div class="stat-card">
      <span class="stat-num">100<span style="font-size:18px">%</span></span>
      <span class="stat-label">去金融中心化<br>零资金池·汇付直清</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">9</span>
      <span class="stat-label">分账场景<br>3商家×3支付全覆盖</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">9<span style="font-size:18px">方</span></span>
      <span class="stat-label">利益分配<br>含城市服务商三级体系</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">3<span style="font-size:18px">券</span></span>
      <span class="stat-label">全平台跨店通用<br>代金券·积分·消费金</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">40,500<span style="font-size:14px">笔/月</span></span>
      <span class="stat-label">盈亏平衡点<br>净利润率0.89%</span>
    </div>
  </div>
  <div class="scroll-hint"><span></span></div>
</section>

<!-- ====== SECTION 1: MIND MAP ====== -->
<section class="section" id="mindmap">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 1</div>
    <h2>🧠 链商2.0 商业模式思维导图</h2>
    <p class="ch-desc">交互式思维导图 · 悬停查看详情 · 点击展开/折叠节点</p>
  </div>
  <div id="mindmap-container">
    <svg id="mindmap-svg"></svg>
    <div class="mindmap-tooltip" id="mindmapTooltip"></div>
  </div>
  <div class="callout info" style="margin-top:20px">
    <h4>💡 思维导图说明</h4>
    <p>以"链商2.0 数字经营平台"为中心，向外辐射六大板块：核心定位、两大体系、分润模型、三元营销、三级管理、合规风控。悬停节点查看详情，拖拽画布平移视图。</p>
  </div>
</section>

<!-- ====== SECTION 2: TWO CORE SYSTEMS ====== -->
<section class="section" id="coresystems">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 2</div>
    <h2>🔗 链商2.0 两大核心体系</h2>
    <p class="ch-desc">消费流转体系（软性优先级引导）+ 全生态会员权益互通体系（三券全平台通用）</p>
  </div>

  <div class="callout warning" style="margin-bottom:30px">
    <h4>⚡ 体系一：消费流转体系 — 从"随意逛"到"有序消费"</h4>
  </div>
  <div class="flow-container">
    <div class="flow-box primary">
      <span class="flow-title">🏪 平台商家</span>
      <span class="flow-sub">Premium 精品布局<br>搜索加权 +2<br>品牌认证蓝标</span>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-box highlight">
      <span class="flow-title">🏠 联盟商家</span>
      <span class="flow-sub">Standard 标准布局<br>搜索基准位<br>社区好店绿标</span>
    </div>
    <div class="flow-arrow">→</div>
    <div class="flow-box">
      <span class="flow-title">🛒 综合商城</span>
      <span class="flow-sub">Minimal 极简布局<br>搜索加权 -2<br>平台自营灰标</span>
    </div>
  </div>
  <p style="text-align:center;color:${C.GRAY};font-size:13px;margin-top:10px">▲ 软性优先级引导（非强制路径）：消费者可自由浏览所有商家，仅默认排序有优先</p>

  <div class="callout success" style="margin-top:40px;margin-bottom:30px">
    <h4>⚡ 体系二：全生态会员权益互通体系 — 在A店获得、在B店使用</h4>
  </div>
  <div class="card-grid sm">
    <div class="card orange">
      <span class="card-icon">🎫</span>
      <h4>代金券 · 全平台通用 🆕</h4>
      <ul>
        <li>每笔消费发放 5%</li>
        <li>单笔最多抵扣 30%</li>
        <li>有效期 90 天</li>
        <li>成本：营销池 3.5-4%</li>
        <li>🆕 跨店通用，营销池统一结算</li>
      </ul>
    </div>
    <div class="card blue">
      <span class="card-icon">⭐</span>
      <h4>积分 · 全平台通用</h4>
      <ul>
        <li>¥1 消费 = 1 积分</li>
        <li>100积分 = ¥1 抵扣</li>
        <li>单笔最多抵扣 20%</li>
        <li>有效期 2 年</li>
        <li>成本：平台服务费承担</li>
      </ul>
    </div>
    <div class="card green">
      <span class="card-icon">💎</span>
      <h4>消费金 · 全平台通用</h4>
      <ul>
        <li>每笔消费返 2-3%</li>
        <li>单笔最多核销 30%</li>
        <li>有效期 12 个月</li>
        <li>可转直系亲属</li>
        <li>成本：消费金池 2-3%</li>
      </ul>
    </div>
  </div>
</section>

<!-- ====== SECTION 3: DISTRIBUTION MODEL ====== -->
<section class="section" id="distribution">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 3</div>
    <h2>💰 分润模型全景 — 资金流向图</h2>
    <p class="ch-desc">消费者¥100 → 汇付天下监管账户 → 实时直清至九方 · 平台不经手资金</p>
  </div>
  <div id="sankey-container">
    <svg id="sankey-svg"></svg>
  </div>
  <div class="chart-row" style="margin-top:30px">
    <div class="chart-container">
      <canvas id="chartPlatformDist"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartAllianceDist"></canvas>
    </div>
  </div>
  <div class="chart-container" style="margin-top:20px">
    <canvas id="chartEcomDist"></canvas>
  </div>
</section>

<!-- ====== SECTION 4: 9 SCENARIOS ====== -->
<section class="section" id="scenarios">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 4</div>
    <h2>📊 九场景分账模型 · 动态对比</h2>
    <p class="ch-desc">3 商家类型 × 3 支付方式 = 9 场景全覆盖 · 每场景 ¥100 分账明细</p>
  </div>
  <div class="chart-row">
    <div class="chart-container">
      <canvas id="chartScenarioComparison"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartPaymentMethodImpact"></canvas>
    </div>
  </div>
  <div class="table-wrap" style="margin-top:30px">
    <table class="dt-table">
      <thead>
        <tr><th>场景</th><th>商家收入</th><th>平台服务费</th><th>服务站+推广者</th><th>城市服务商</th><th>消费金</th><th>营销池</th><th>风控备用金</th><th>渠道成本</th><th>合计</th></tr>
      </thead>
      <tbody>
        <tr><td>平台·汇付</td><td class="highlight-cell">75.40</td><td>5.00</td><td>9.00</td><td>1.00</td><td>3.00</td><td>4.00</td><td>2.00</td><td>0.60</td><td>100</td></tr>
        <tr><td>平台·余额</td><td class="highlight-cell">75.40</td><td>5.00</td><td>9.00</td><td>1.00</td><td>3.50</td><td>4.00</td><td>2.00</td><td>0.10</td><td>100</td></tr>
        <tr><td>平台·消费金核销</td><td class="highlight-cell">82.78</td><td>3.50</td><td>6.30</td><td>0.70</td><td>2.10</td><td>2.80</td><td>1.40</td><td>0.42</td><td>100</td></tr>
        <tr><td>联盟·汇付</td><td class="highlight-cell">71.40</td><td>5.00</td><td>10.00</td><td>1.00</td><td>2.00</td><td>3.50</td><td>2.00</td><td>0.60</td><td>100</td></tr>
        <tr><td>联盟·余额</td><td class="highlight-cell">71.40</td><td>5.00</td><td>10.00</td><td>1.00</td><td>2.50</td><td>3.50</td><td>2.00</td><td>0.10</td><td>100</td></tr>
        <tr><td>联盟·消费金核销</td><td class="highlight-cell">79.98</td><td>3.50</td><td>7.00</td><td>0.70</td><td>2.10</td><td>2.45</td><td>1.40</td><td>0.42</td><td>100</td></tr>
        <tr><td>商城·汇付</td><td class="highlight-cell">77.90</td><td>6.00</td><td>6.00</td><td>1.00</td><td>3.00</td><td>3.50</td><td>2.00</td><td>0.60</td><td>100</td></tr>
        <tr><td>商城·余额</td><td class="highlight-cell">77.90</td><td>6.00</td><td>6.00</td><td>1.00</td><td>3.50</td><td>3.50</td><td>2.00</td><td>0.10</td><td>100</td></tr>
        <tr><td>商城·消费金核销</td><td class="highlight-cell">83.93</td><td>4.20</td><td>4.20</td><td>0.70</td><td>2.10</td><td>2.45</td><td>1.40</td><td>0.42</td><td>100</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ====== SECTION 5: FINANCIAL DASHBOARD ====== -->
<section class="section" id="dashboard">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 5</div>
    <h2>📈 动态财务指标仪表盘</h2>
    <p class="ch-desc">平台经营指标 · 盈亏平衡分析 · 敏感性测试 · 毛利率瀑布图</p>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid" style="margin-bottom:30px">
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.ORANGE}">¥190,000</span>
      <span class="kpi-label">月度固定成本</span>
      <span class="kpi-change up">技术¥50K+人员¥80K+场地¥20K+营销¥30K+合规¥10K</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.MAIN}">¥5.33</span>
      <span class="kpi-label">平均平台服务费/笔</span>
      <span class="kpi-change">(5%+5%+6%)/3 × ¥100</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.GREEN}">¥4.73</span>
      <span class="kpi-label">平均毛利/笔</span>
      <span class="kpi-change up">服务费¥5.33 - 渠道¥0.60</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.RED}">¥3.80</span>
      <span class="kpi-label">固定成本/笔 (@50K笔)</span>
      <span class="kpi-change warn">¥190K ÷ 50,000笔</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.GREEN}">¥0.93</span>
      <span class="kpi-label">平均净利润/笔</span>
      <span class="kpi-change up">毛利¥4.73 - 固定¥3.80</span>
    </div>
    <div class="kpi-card">
      <span class="kpi-val" style="color:${C.ORANGE}">40,500</span>
      <span class="kpi-label">盈亏平衡点（笔/月）</span>
      <span class="kpi-change warn">¥190K ÷ ¥4.73/笔</span>
    </div>
  </div>

  <div class="chart-row">
    <div class="chart-container">
      <canvas id="chartBreakeven"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartWaterfall"></canvas>
    </div>
  </div>
  <div class="chart-row" style="margin-top:20px">
    <div class="chart-container">
      <canvas id="chartSensitivity"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartProfitability"></canvas>
    </div>
  </div>
</section>

<!-- ====== SECTION 6: MARKETING TRIPLE SYSTEM ====== -->
<section class="section" id="marketing">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 6</div>
    <h2>🎯 三元营销体系 · FABE 动态对比</h2>
    <p class="ch-desc">代金券 · 积分 · 消费金 — 三者独立账户 · 可叠加使用 · 均不可兑现</p>
  </div>
  <div class="chart-row">
    <div class="chart-container">
      <canvas id="chartTripleRadar"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartTripleStack"></canvas>
    </div>
  </div>
  <div class="chart-container" style="margin-top:20px">
    <canvas id="chartConsumerBenefitFlow"></canvas>
  </div>
</section>

<!-- ====== SECTION 7: CROSS-STORE SETTLEMENT ====== -->
<section class="section" id="crossstore">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 7</div>
    <h2>🔄 跨店通兑结算机制 · V3.2 核心创新</h2>
    <p class="ch-desc">代金券/积分/消费金全平台通用 — 营销池统一结算 — 汇付直清不构成二清</p>
  </div>

  <!-- Flow diagram -->
  <div class="flow-container" style="flex-direction:column;align-items:stretch">
    <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:14px">
      <div class="flow-box">
        <span class="flow-title">🧑 消费者</span>
        <span class="flow-sub">在商家A消费¥100<br>获得¥5代金券</span>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-box primary">
        <span class="flow-title">🏪 商家A</span>
        <span class="flow-sub">发行方<br>营销池计提¥4</span>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-box highlight">
        <span class="flow-title">🗂️ 营销池</span>
        <span class="flow-sub">汇付托管<br>全平台统一池</span>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-box">
        <span class="flow-title">🏠 商家B</span>
        <span class="flow-sub">接收方<br>¥5券→营销池结算</span>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-box primary">
        <span class="flow-title">💰 商家B到账</span>
        <span class="flow-sub">¥95现金 + ¥5营销池<br>= ¥100 完整收入</span>
      </div>
    </div>
  </div>

  <div class="chart-row" style="margin-top:30px">
    <div class="chart-container">
      <canvas id="chartCrossStoreFlow"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartPoolBalance"></canvas>
    </div>
  </div>

  <div class="card-grid sm" style="margin-top:30px">
    <div class="card green">
      <h4>✅ 合规验证 1</h4>
      <p>积分不可兑现：三者均为消费抵扣权益，跨店使用不改变其消费权益属性</p>
    </div>
    <div class="card green">
      <h4>✅ 合规验证 2</h4>
      <p>不可形成资金池：营销池汇付托管，仅改变池内支付对象，不增加池规模</p>
    </div>
    <div class="card green">
      <h4>✅ 合规验证 3</h4>
      <p>不可承诺收益：跨店通兑是权益扩大（更方便使用），非收益承诺</p>
    </div>
    <div class="card green">
      <h4>✅ 合规验证 4</h4>
      <p>跨店通兑 ≠ 二清：汇付直接向接受商家结算，平台不经手资金</p>
    </div>
  </div>
</section>

<!-- ====== SECTION 8: BREAKEVEN ANALYSIS ====== -->
<section class="section" id="breakeven">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 8</div>
    <h2>⚖️ 盈亏平衡与利润结构分析</h2>
    <p class="ch-desc">固定成本结构 · 边际贡献 · 盈亏平衡点 · 利润敏感性</p>
  </div>

  <div class="gauge-container">
    <div class="gauge-item">
      <canvas id="gaugeBreakeven" width="200" height="200"></canvas>
      <span class="gauge-label">盈亏平衡达成率</span>
      <span class="gauge-sub">@50,000笔/月 → 123.5%</span>
    </div>
    <div class="gauge-item">
      <canvas id="gaugeMargin" width="200" height="200"></canvas>
      <span class="gauge-label">毛利率</span>
      <span class="gauge-sub">平台服务费毛利率 88.7%</span>
    </div>
    <div class="gauge-item">
      <canvas id="gaugeNetMargin" width="200" height="200"></canvas>
      <span class="gauge-label">净利润率</span>
      <span class="gauge-sub">@50K笔 → 0.93%</span>
    </div>
  </div>

  <div class="chart-row" style="margin-top:30px">
    <div class="chart-container">
      <canvas id="chartCostStructure"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartMarginWaterfall"></canvas>
    </div>
  </div>
</section>

<!-- ====== SECTION 9: CONSUMPTION JOURNEY ====== -->
<section class="section" id="journey">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 0 9</div>
    <h2>🗺️ 消费流转旅程图 · 四阶段时序引导</h2>
    <p class="ch-desc">从品牌认知到生态覆盖 — 软性引导 · 非强制路径 · 消费权益持续积累</p>
  </div>

  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-dot orange"></div>
      <div class="timeline-content">
        <h4>🔍 阶段1 · 品牌认知</h4>
        <p>首次接触链商2.0 → 首页/搜索优先展示平台商家（搜索加权+2、品牌认证蓝标）→ 浏览精品页面（品牌故事/视频/相册/高信息密度）</p>
      </div>
      <div style="width:45%"></div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot blue"></div>
      <div style="width:45%"></div>
      <div class="timeline-content">
        <h4>🛍️ 阶段2 · 首次消费</h4>
        <p>在平台商家完成首单 ¥100 → 自动获得：¥5代金券 + 100积分 + ¥3消费金（全平台通用）→ 三券入账，可在任意商家使用</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot orange"></div>
      <div class="timeline-content">
        <h4>🔄 阶段3 · 跨店探索</h4>
        <p>持有的代金券/积分/消费金"可以在任意商家使用"→ 自然引导至联盟商家消费 → 享受社区便利（沐足/便利店/生鲜）→ 使用A店获得的券在B店消费</p>
      </div>
      <div style="width:45%"></div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot green"></div>
      <div style="width:45%"></div>
      <div class="timeline-content">
        <h4>🌐 阶段4 · 生态覆盖</h4>
        <p>高频消费锁定在平台商家+联盟商家 → 综合商城作为品类补充 → 消费者权益持续积累 → 越消费·越有权益·越离不开链商生态</p>
      </div>
    </div>
  </div>
</section>

<!-- ====== SECTION 10: KPI SCORECARD ====== -->
<section class="section" id="kpi">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 1 0</div>
    <h2>🏆 关键指标体系 · KPI Scorecard</h2>
    <p class="ch-desc">平台经营核心指标 · 三级权重 · 目标值 vs 当前预估</p>
  </div>

  <div class="table-wrap">
    <table class="dt-table">
      <thead>
        <tr><th>指标类别</th><th>指标名称</th><th>权重</th><th>目标值</th><th>当前预估</th><th>达成率</th><th>趋势</th></tr>
      </thead>
      <tbody>
        <tr><td rowspan="3" style="font-weight:700;color:${C.ORANGE}">🏪<br>商家增长</td><td>平台商家入驻数</td><td>P0</td><td>≥50家</td><td>待上线</td><td>—</td><td>—</td></tr>
        <tr><td>联盟商家入驻数</td><td>P0</td><td>≥200家</td><td>待上线</td><td>—</td><td>—</td></tr>
        <tr><td>商家月均复购率</td><td>P0</td><td>≥40%</td><td>模型预测35-45%</td><td>—</td><td>—</td></tr>
        <tr><td rowspan="3" style="font-weight:700;color:${C.MAIN}">👥<br>用户增长</td><td>月活跃消费者(MAU)</td><td>P0</td><td>≥100,000</td><td>模型假设50,000</td><td>50%</td><td style="color:${C.ORANGE}">→</td></tr>
        <tr><td>月交易笔数</td><td>P0</td><td>≥50,000笔</td><td>盈亏平衡40,500笔</td><td>123.5%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>消费者月均复购率</td><td>P1</td><td>≥35%</td><td>三元营销预估40%</td><td>114%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td rowspan="4" style="font-weight:700;color:${C.GREEN}">💰<br>财务指标</td><td>月GMV</td><td>P0</td><td>≥¥5,000,000</td><td>¥5,000,000 (@50K笔×¥100)</td><td>100%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>平台月服务费收入</td><td>P0</td><td>≥¥250,000</td><td>¥266,500</td><td>106.6%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>平台月净利润</td><td>P0</td><td>≥¥0 (正利润)</td><td>¥46,500</td><td>✅</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>净利润率</td><td>P1</td><td>≥0.5%</td><td>0.93%</td><td>186%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td rowspan="3" style="font-weight:700;color:${C.PURPLE}">🎯<br>营销效率</td><td>代金券核销率</td><td>P0</td><td>≥30%</td><td>跨店通兑预估45%+</td><td>150%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>消费金核销率</td><td>P1</td><td>≥25%</td><td>预估30%</td><td>120%</td><td style="color:${C.GREEN}">↑</td></tr>
        <tr><td>跨店通兑占比</td><td>P1</td><td>≥20%</td><td>🆕 V3.2新增指标</td><td>—</td><td>—</td></tr>
        <tr><td rowspan="3" style="font-weight:700;color:${C.RED}">🛡️<br>风控合规</td><td>风控备用金覆盖率</td><td>P0</td><td>≥2%交易额</td><td>2.00%</td><td>100%</td><td style="color:${C.GREEN}">✅</td></tr>
        <tr><td>合规红线零命中</td><td>P0</td><td>100%零命中</td><td>3条红线全通过</td><td>100%</td><td style="color:${C.GREEN}">✅</td></tr>
        <tr><td>客诉率</td><td>P1</td><td>≤0.5%</td><td>待上线验证</td><td>—</td><td>—</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ====== SECTION 11: THREE-TIER MERCHANT COMPARISON ====== -->
<section class="section" id="merchants">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 1 1</div>
    <h2>🏪 三级商家 · 千面千店对比</h2>
    <p class="ch-desc">平台商家(Premium) vs 联盟商家(Standard) vs 综合商城(Minimal) — 六维雷达对比</p>
  </div>
  <div class="chart-row">
    <div class="chart-container">
      <canvas id="chartMerchantRadar"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartMerchantBar"></canvas>
    </div>
  </div>
  <div class="card-grid" style="margin-top:30px">
    <div class="card blue">
      <span class="card-icon">🏪</span>
      <h4>平台商家 · Premium</h4>
      <ul>
        <li>信息密度：高 · 精品布局</li>
        <li>搜索加权：+2 位</li>
        <li>品牌认证蓝标</li>
        <li>深度自定义（品牌色/故事/视频/相册）</li>
        <li>商家收入：75.40%</li>
        <li>推广佣金池：9%</li>
      </ul>
    </div>
    <div class="card orange">
      <span class="card-icon">🏠</span>
      <h4>联盟商家 · Standard</h4>
      <ul>
        <li>信息密度：中 · 标准布局</li>
        <li>搜索基准位</li>
        <li>社区好店绿标</li>
        <li>6套模板+轻定制（品牌色/横幅）</li>
        <li>商家收入：71.40%</li>
        <li>推广佣金池：10%</li>
      </ul>
    </div>
    <div class="card purple">
      <span class="card-icon">🛒</span>
      <h4>综合商城 · Minimal</h4>
      <ul>
        <li>信息密度：低 · 极简布局</li>
        <li>搜索加权：-2 位</li>
        <li>平台自营灰标</li>
        <li>标准化模板，不可自定义</li>
        <li>商家收入：77.90%</li>
        <li>推广佣金池：6%</li>
      </ul>
    </div>
  </div>
</section>

<!-- ====== SECTION 12: COMPLIANCE ====== -->
<section class="section" id="compliance">
  <div class="section-title">
    <div class="ch-num">S E C T I O N · 1 2</div>
    <h2>🛡️ 合规风控仪表板</h2>
    <p class="ch-desc">三条红线 · 14项禁用术语 · 牌照与监管合规全景</p>
  </div>

  <div class="card-grid sm" style="margin-bottom:30px">
    <div class="card red">
      <h4>⛔ 红线一</h4>
      <p><strong>积分不可兑现</strong><br>积分/代金券/消费金均定义为"消费营销权益"，不可兑换现金、不可购买金融产品</p>
    </div>
    <div class="card red">
      <h4>⛔ 红线二</h4>
      <p><strong>不可形成资金池</strong><br>汇付天下持牌支付机构直清，平台在任何环节不持有/滞留/归集消费者资金</p>
    </div>
    <div class="card red">
      <h4>⛔ 红线三</h4>
      <p><strong>不可承诺收益</strong><br>所有文档/营销/产品文案中，禁止任何语言暗示经济回报、稳赚、躺赚</p>
    </div>
  </div>

  <div class="chart-row">
    <div class="chart-container">
      <canvas id="chartComplianceStatus"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="chartRiskMatrix"></canvas>
    </div>
  </div>

  <div class="callout success" style="margin-top:20px">
    <h4>✅ V3.2 合规验证结论</h4>
    <p>跨店通兑机制不触碰任何合规红线：① 代金券/积分/消费金仍为消费抵扣权益（非现金兑换）② 营销池汇付托管，跨店结算仅改变支付对象（非新增资金池）③ "全平台通用"是权益使用范围扩大（非收益承诺）④ 汇付直清模式确保跨店通兑不构成二清</p>
  </div>
</section>

<!-- ====== FOOTER ====== -->
<div class="footer">
  <p>链商2.0 · 链生活品牌 | 商业模式全景图 V3.2 | 面向社区商业的数字经营平台</p>
  <p style="margin-top:6px">商户独立经营 · 生态会员互通 · 消费权益流转 · 真实交易激励 | 编制：梁君衡（企业宣传部）| 2026年6月6日</p>
  <p style="margin-top:6px;color:rgba(255,255,255,0.3)">数据来源：分润核销模型 V3.2 · 营销策略制定方案 V2.0 · 品牌执行手册 · 法律合规框架</p>
</div>

</div><!-- /main-content -->

<!-- ====== SCRIPTS ====== -->
<script>
// ====== NAV TOGGLE ======
function toggleNav(){document.getElementById('sideNav').classList.toggle('open')}

// ====== ACTIVE NAV LINK ON SCROLL ======
const sections=document.querySelectorAll('.section,.hero');
const navLinks=document.querySelectorAll('.side-nav a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{const top=s.offsetTop-100;if(window.scrollY>=top)current=s.getAttribute('id')});
  navLinks.forEach(a=>{a.classList.remove('active');if(a.getAttribute('href')==='#'+current)a.classList.add('active')});
});

// ====== COMMON CHART DEFAULTS ======
Chart.defaults.color='rgba(255,255,255,0.6)';
Chart.defaults.borderColor='rgba(255,255,255,0.06)';
Chart.defaults.font.family="'Microsoft YaHei','PingFang SC',sans-serif";
const chartOptions=(extra)=>({responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'rgba(255,255,255,0.7)',padding:16,usePointStyle:true,pointStyleWidth:8}}},scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}},y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}}},...extra});

// ====== MIND MAP (D3-style SVG) ======
(function(){
  const svg=document.getElementById('mindmap-svg');
  const tooltip=document.getElementById('mindmapTooltip');
  const container=document.getElementById('mindmap-container');
  const W=container.clientWidth, H=800;
  svg.setAttribute('viewBox',\`0 0 \${W} \${H}\`);

  // Mind map tree data
  const treeData={
    name:'链商2.0\\n数字经营平台',
    color:'${C.ORANGE}',size:28,
    children:[
      {name:'核心定位',color:'${C.MAIN}',size:20,children:[
        {name:'社区商业数字经营平台',color:'${C.GREEN}',desc:'面向社区商业，非纯电商/非纯O2O'},
        {name:'商户独立经营',color:'${C.GREEN}',desc:'每个商家拥有独立小程序主体'},
        {name:'生态会员互通',color:'${C.GREEN}',desc:'消费者在一个生态内积累权益'},
        {name:'消费权益流转',color:'${C.GREEN}',desc:'三券全平台通用·跨店通兑'},
        {name:'真实交易激励',color:'${C.GREEN}',desc:'交易即分润·零固定费用'},
      ]},
      {name:'两大体系',color:'${C.ORANGE}',size:20,children:[
        {name:'消费流转体系',color:'${C.PURPLE}',desc:'平台商家→联盟商家→综合商城\\n软性优先级(+2/0/-2)',children:[
          {name:'平台商家',color:'${C.MAIN}',desc:'Premium·搜索加权+2·蓝标'},
          {name:'联盟商家',color:'${C.MAIN}',desc:'Standard·基准位·绿标'},
          {name:'综合商城',color:'${C.MAIN}',desc:'Minimal·加权-2·灰标'},
        ]},
        {name:'全生态会员权益互通',color:'${C.PURPLE}',desc:'在A店获得·在B店使用',children:[
          {name:'代金券·全平台通用🆕',color:'${C.ORANGE}',desc:'5%发放·30%抵扣上限·90天'},
          {name:'积分·全平台通用',color:'${C.MAIN}',desc:'1:100兑换·20%抵扣上限·2年'},
          {name:'消费金·全平台通用',color:'${C.GREEN}',desc:'2-3%返利·30%核销上限·12个月'},
        ]},
      ]},
      {name:'分润模型',color:'${C.TEAL}',size:20,children:[
        {name:'9场景全覆盖',color:'${C.MAIN}',desc:'3商家类型×3支付方式=9场景'},
        {name:'九方利益分配',color:'${C.MAIN}',desc:'含城市服务商·三级管理体系'},
        {name:'汇付直清',color:'${C.GREEN}',desc:'持牌支付机构·实时分账'},
        {name:'100%去金融中心化',color:'${C.GREEN}',desc:'平台不经手任何消费者资金'},
        {name:'营销池统一结算',color:'${C.ORANGE}',desc:'跨店通兑·汇付托管·3.5-4%'},
        {name:'风控备用金',color:'${C.RED}',desc:'2%·汇付托管·退款/争议/合规'},
      ]},
      {name:'三元营销',color:'${C.YELLOW}',size:20,children:[
        {name:'代金券',color:'${C.ORANGE}',desc:'消费额5%·90天·全平台通用🆕'},
        {name:'积分',color:'${C.MAIN}',desc:'1:1累积·100:1兑换·2年'},
        {name:'消费金',color:'${C.GREEN}',desc:'2-3%返利·12个月·可转亲属'},
      ]},
      {name:'三级管理',color:'${C.PURPLE}',size:20,children:[
        {name:'城市服务商 1%',color:'${C.MAIN}',desc:'区域合伙人·招商·政府关系'},
        {name:'服务站 35%管理费',color:'${C.MAIN}',desc:'社区节点·招募培训·配送'},
        {name:'推广者 65%佣金',color:'${C.GREEN}',desc:'一线推广·扫码地推·引流'},
      ]},
      {name:'合规风控',color:'${C.RED}',size:20,children:[
        {name:'三条红线',color:'${C.RED}',desc:'积分不可兑现\\n不可形成资金池\\n不可承诺收益'},
        {name:'14项禁用术语',color:'${C.RED}',desc:'数字资产→消费权益\\n变现→转化\\n币/Token/通证→禁止'},
        {name:'汇付持牌监管',color:'${C.GREEN}',desc:'央行监管·持牌支付机构'},
        {name:'跨店通兑≠二清',color:'${C.GREEN}',desc:'汇付直清·平台不经手'},
      ]},
    ]
  };

  // Layout algorithm: radial tree
  const cx=W/2, cy=H/2, baseRadius=80, levelGap=140;

  function layoutRadial(node,angle0,angle1,radius){
    if(!node.children||node.children.length===0){
      node.x=cx+radius*Math.cos((angle0+angle1)/2);
      node.y=cy+radius*Math.sin((angle0+angle1)/2);
      return;
    }
    node.x=cx+radius*Math.cos((angle0+angle1)/2);
    node.y=cy+radius*Math.sin((angle0+angle1)/2);
    const totalAngle=angle1-angle0;
    const gap=totalAngle*0.05;
    const usableAngle=totalAngle-gap;
    const sliceAngle=usableAngle/node.children.length;
    const startAngle=angle0+gap/2;
    for(let i=0;i<node.children.length;i++){
      const a0=startAngle+i*sliceAngle;
      const a1=a0+sliceAngle;
      layoutRadial(node.children[i],a0,a1,radius+levelGap);
    }
  }
  layoutRadial(treeData,-Math.PI/2,Math.PI*1.5,baseRadius);

  // Collect all nodes for rendering
  const allNodes=[];
  function collect(node,parent,depth){
    allNodes.push({node,parent,depth});
    if(node.children)node.children.forEach(c=>collect(c,node,depth+1));
  }
  collect(treeData,null,0);

  // Draw edges
  const edgesGroup=document.createElementNS('http://www.w3.org/2000/svg','g');
  svg.appendChild(edgesGroup);
  allNodes.forEach(({node,parent})=>{
    if(!parent)return;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',parent.x);line.setAttribute('y1',parent.y);
    line.setAttribute('x2',node.x);line.setAttribute('y2',node.y);
    line.setAttribute('stroke','rgba(255,255,255,0.15)');
    line.setAttribute('stroke-width','1.5');
    edgesGroup.appendChild(line);
  });

  // Draw nodes
  const nodesGroup=document.createElementNS('http://www.w3.org/2000/svg','g');
  svg.appendChild(nodesGroup);
  allNodes.forEach(({node,depth})=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','mindmap-node');
    g.setAttribute('transform',\`translate(\${node.x},\${node.y})\`);

    const r=node.size||(depth===0?40:depth<=1?28:18);
    const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('r',r);
    circle.setAttribute('fill',node.color||'${C.MAIN}');
    circle.setAttribute('stroke','rgba(255,255,255,0.3)');
    circle.setAttribute('stroke-width','1.5');
    if(depth===0)circle.setAttribute('filter','url(#glow)');
    g.appendChild(circle);

    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    const lines=(node.name||'').split('\\n');
    const fontSize=depth===0?13:depth<=1?10:8;
    lines.forEach((line,i)=>{
      const tspan=document.createElementNS('http://www.w3.org/2000/svg','tspan');
      tspan.textContent=line;
      tspan.setAttribute('x','0');
      tspan.setAttribute('dy',i===0?\`-\${(lines.length-1)*fontSize*0.6}px\`:\`\${fontSize*1.2}px\`);
      tspan.setAttribute('text-anchor','middle');
      tspan.setAttribute('fill','#fff');
      tspan.setAttribute('font-size',fontSize);
      tspan.setAttribute('font-weight','600');
      text.appendChild(tspan);
    });
    g.appendChild(text);

    // Hover events
    g.addEventListener('mouseenter',(e)=>{
      if(node.desc){
        tooltip.textContent=node.desc.replace(/\\n/g,' · ');
        tooltip.style.opacity='1';
        tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+15)+'px';
        tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-40)+'px';
      }
    });
    g.addEventListener('mousemove',(e)=>{
      tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+15)+'px';
      tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-40)+'px';
    });
    g.addEventListener('mouseleave',()=>{tooltip.style.opacity='0'});

    nodesGroup.appendChild(g);
  });

  // Add glow filter
  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  const filter=document.createElementNS('http://www.w3.org/2000/svg','filter');
  filter.setAttribute('id','glow');
  filter.innerHTML='<feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
  defs.appendChild(filter);
  svg.insertBefore(defs,svg.firstChild);

  // Pan & zoom
  let panX=0,panY=0,scale=1,isPanning=false,startX,startY;
  svg.addEventListener('mousedown',(e)=>{if(e.target===svg||e.target.tagName==='line'){isPanning=true;startX=e.clientX-panX;startY=e.clientY-panY;svg.style.cursor='grabbing'}});
  window.addEventListener('mousemove',(e)=>{if(isPanning){panX=e.clientX-startX;panY=e.clientY-startY;svg.querySelectorAll('g').forEach(g=>g.setAttribute('transform',\`translate(\${panX},\${panY}) scale(\${scale})\`))}});
  window.addEventListener('mouseup',()=>{isPanning=false;svg.style.cursor='grab'});
  svg.addEventListener('wheel',(e)=>{e.preventDefault();scale=Math.max(0.3,Math.min(3,scale+(e.deltaY>0?-0.1:0.1)));svg.querySelectorAll('g').forEach(g=>g.setAttribute('transform',\`translate(\${panX},\${panY}) scale(\${scale})\`))});
  svg.style.cursor='grab';
})();

// ====== SANKEY DISTRIBUTION FLOW ======
(function(){
  const svg=document.getElementById('sankey-svg');
  const container=document.getElementById('sankey-container');
  const W=container.clientWidth, H=600;
  svg.setAttribute('viewBox',\`0 0 \${W} \${H}\`);

  const padL=120,padR=40,padT=20,padB=20;
  const nodes=[
    {id:'consumer',label:'消费者\\n支付¥100',x:0,y:0,col:'${C.ORANGE}',w:100},
    {id:'huifu',label:'汇付天下\\n监管账户',x:1,y:0,col:'${C.MAIN}',w:110},
    {id:'channel',label:'支付渠道\\n0.6%',x:2,y:-2.5,col:'${C.GRAY}',w:90},
    {id:'merchant',label:'商家\\n75.4%',x:2,y:-0.8,col:'${C.GREEN}',w:90},
    {id:'platform',label:'平台服务费\\n5%',x:2,y:1.2,col:'${C.MAIN}',w:90},
    {id:'station',label:'服务站+推广者\\n9%',x:2,y:3.8,col:'${C.PURPLE}',w:100},
    {id:'city',label:'城市服务商\\n1%🆕',x:2,y:5.2,col:'${C.TEAL}',w:90},
    {id:'credit',label:'消费金池\\n3%',x:2,y:-3.5,col:'${C.ORANGE}',w:90},
    {id:'marketing',label:'营销池\\n4%',x:2,y:6.4,col:'${C.YELLOW}',w:90},
    {id:'risk',label:'风控备用金\\n2%',x:2,y:7.5,col:'${C.RED}',w:90},
  ];
  const totalH=H-padT-padB;
  const colW=(W-padL-padR)/3;
  nodes.forEach(n=>{
    n.sx=padL+n.x*colW;
    n.ex=n.sx+(n.w||80);
    n.sy=padT+n.y*(totalH/10)+totalH/2-(n.w?n.w/2:20);
    n.ey=n.sy+(n.w||80);
  });

  // Links (consumer→huifu→all)
  const links=[
    {s:nodes[0],t:nodes[1],v:100,label:'¥100'},
    {s:nodes[1],t:nodes[2],v:0.6,label:'¥0.60'},
    {s:nodes[1],t:nodes[3],v:75.4,label:'¥75.40'},
    {s:nodes[1],t:nodes[4],v:5,label:'¥5.00'},
    {s:nodes[1],t:nodes[5],v:9,label:'¥9.00'},
    {s:nodes[1],t:nodes[6],v:1,label:'¥1.00'},
    {s:nodes[1],t:nodes[7],v:3,label:'¥3.00'},
    {s:nodes[1],t:nodes[8],v:4,label:'¥4.00'},
    {s:nodes[1],t:nodes[9],v:2,label:'¥2.00'},
  ];

  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  svg.appendChild(defs);

  // Draw links
  links.forEach(l=>{
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    const x1=l.s.ex, x2=l.t.sx;
    const y1=l.s.sy+(l.s.ey-l.s.sy)*0.5;
    const y2=l.t.sy+(l.t.ey-l.t.sy)*0.5;
    const cp=Math.abs(x2-x1)*0.4;
    const d=\`M\${x1},\${y1} C\${x1+cp},\${y1} \${x2-cp},\${y2} \${x2},\${y2}\`;
    path.setAttribute('d',d);
    path.setAttribute('fill','none');
    path.setAttribute('stroke',l.t.col||'rgba(255,255,255,0.2)');
    path.setAttribute('stroke-width',Math.max(2,l.v*3));
    path.setAttribute('opacity','0.5');
    path.setAttribute('class','sankey-link');
    svg.appendChild(path);

    // Label
    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    text.textContent=l.label;
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    text.setAttribute('x',mx);text.setAttribute('y',my-6);
    text.setAttribute('text-anchor','middle');
    text.setAttribute('fill','rgba(255,255,255,0.7)');
    text.setAttribute('font-size','11');
    text.setAttribute('font-weight','700');
    svg.appendChild(text);
  });

  // Draw nodes
  nodes.forEach(n=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x',n.sx);rect.setAttribute('y',n.sy);
    rect.setAttribute('width',n.ex-n.sx);rect.setAttribute('height',n.ey-n.sy);
    rect.setAttribute('rx','8');rect.setAttribute('fill',n.col);
    rect.setAttribute('opacity','0.85');rect.setAttribute('stroke','rgba(255,255,255,0.2)');
    g.appendChild(rect);

    const text=document.createElementNS('http://www.w3.org/2000/svg','text');
    const mx=n.sx+(n.ex-n.sx)/2, my=n.sy+(n.ey-n.sy)/2;
    const lines=n.label.split('\\n');
    lines.forEach((line,i)=>{
      const tspan=document.createElementNS('http://www.w3.org/2000/svg','tspan');
      tspan.textContent=line;
      tspan.setAttribute('x',mx);tspan.setAttribute('dy',i===0?\`-\${(lines.length-1)*7}px\`:'14px');
      tspan.setAttribute('text-anchor','middle');
      tspan.setAttribute('fill','#fff');
      tspan.setAttribute('font-size',i===0?'12':'10');
      tspan.setAttribute('font-weight',i===0?'700':'400');
      text.appendChild(tspan);
    });
    g.appendChild(text);
    svg.appendChild(g);
  });
})();

// ====== CHART 1: Platform Distribution Doughnut ======
new Chart(document.getElementById('chartPlatformDist'),{
  type:'doughnut',
  data:{labels:['平台商家 75.4%','服务站+推广者 9%','平台服务费 5%','营销池 4%','消费金 3%','风控备用金 2%','城市服务商 1%','支付渠道 0.6%'],
    datasets:[{data:[75.4,9,5,4,3,2,1,0.6],backgroundColor:['${C.GREEN}','${C.PURPLE}','${C.MAIN}','${C.YELLOW}','${C.ORANGE}','${C.RED}','${C.TEAL}','${C.GRAY}'],borderWidth:2,borderColor:'rgba(10,10,20,0.8)'}]},
  options:{...chartOptions(),plugins:{...chartOptions().plugins,title:{display:true,text:'平台商家·汇付收单 分账结构 (¥100)',color:'#fff',font:{size:15}}}}}
});

// ====== CHART 2: Alliance Distribution Doughnut ======
new Chart(document.getElementById('chartAllianceDist'),{
  type:'doughnut',
  data:{labels:['联盟商家 71.4%','服务站+推广者 10%','平台服务费 5%','平台商家渠道费 4.5%','营销池 3.5%','风控备用金 2%','消费金 2%','城市服务商 1%','支付渠道 0.6%'],
    datasets:[{data:[71.4,10,5,4.5,3.5,2,2,1,0.6],backgroundColor:['${C.GREEN}','${C.PURPLE}','${C.MAIN}','${C.DARK}','${C.YELLOW}','${C.RED}','${C.ORANGE}','${C.TEAL}','${C.GRAY}'],borderWidth:2,borderColor:'rgba(10,10,20,0.8)'}]},
  options:{...chartOptions(),plugins:{...chartOptions().plugins,title:{display:true,text:'联盟商家·汇付收单 分账结构 (¥100)',color:'#fff',font:{size:15}}}}}
});

// ====== CHART 3: E-commerce Distribution Bar ======
new Chart(document.getElementById('chartEcomDist'),{
  type:'bar',
  data:{labels:['支付渠道','商城收入','平台服务费','服务站+推广者','城市服务商','消费金','营销池','风控备用金'],
    datasets:[
      {label:'汇付收单',data:[0.6,77.9,6,6,1,3,3.5,2],backgroundColor:'${C.MAIN}',borderRadius:6},
      {label:'余额支付',data:[0.1,77.9,6,6,1,3.5,3.5,2],backgroundColor:'${C.ORANGE}',borderRadius:6},
      {label:'消费金核销',data:[0.42,57.53,4.2,4.2,0.7,2.1,2.45,1.4],backgroundColor:'${C.GREEN}',borderRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'综合商城·三支付方式分账对比 (¥100)',color:'#fff',font:{size:15}}}}),indexAxis:'y'}
});

// ====== CHART 4: Scenario Comparison ======
new Chart(document.getElementById('chartScenarioComparison'),{
  type:'bar',
  data:{labels:['平台·汇付','平台·余额','平台·消费金','联盟·汇付','联盟·余额','联盟·消费金','商城·汇付','商城·余额','商城·消费金'],
    datasets:[
      {label:'商家收入',data:[75.4,75.4,82.78,71.4,71.4,79.98,77.9,77.9,83.93],backgroundColor:'${C.GREEN}'},
      {label:'平台+渠道',data:[5.6,5.1,3.92,5.6,5.1,3.92,6.6,6.1,4.62],backgroundColor:'${C.MAIN}'},
      {label:'推广+城市',data:[10,10,7,11,11,7.7,7,7,4.9],backgroundColor:'${C.PURPLE}'},
      {label:'营销+风控',data:[6,6,4.2,5.5,5.5,3.85,5.5,5.5,3.85],backgroundColor:'${C.ORANGE}'},
      {label:'消费金',data:[3,3.5,2.1,2,2.5,2.1,3,3.5,2.1],backgroundColor:'${C.YELLOW}'},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'九场景商家收入与各方分配对比 (¥100)',color:'#fff',font:{size:15}}}}),scales:{x:{stacked:true,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}},y:{stacked:true,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}}}}
});

// ====== CHART 5: Payment Method Impact ======
new Chart(document.getElementById('chartPaymentMethodImpact'),{
  type:'line',
  data:{labels:['平台商家','联盟商家','综合商城'],
    datasets:[
      {label:'汇付收单·商家收入',data:[75.4,71.4,77.9],borderColor:'${C.MAIN}',backgroundColor:'${C.MAIN}20',fill:true,tension:0.3,pointRadius:6},
      {label:'余额支付·商家收入',data:[75.4,71.4,77.9],borderColor:'${C.ORANGE}',backgroundColor:'${C.ORANGE}20',fill:true,tension:0.3,pointRadius:6,borderDash:[5,5]},
      {label:'消费金核销·商家收入',data:[82.78,79.98,83.93],borderColor:'${C.GREEN}',backgroundColor:'${C.GREEN}20',fill:true,tension:0.3,pointRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'支付方式对商家收入影响对比',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 6: Breakeven Analysis ======
(function(){
  const fixedCost=190000, avgProfit=4.73, bePoint=Math.ceil(41806);
  const volumes=[10000,20000,30000,41806,50000,60000,80000,100000];
  const revenues=volumes.map(v=>v*5.33);
  const costs=volumes.map(v=>fixedCost+v*0.60);
  const profits=volumes.map(v=>v*4.73-fixedCost);

  new Chart(document.getElementById('chartBreakeven'),{
    type:'line',
    data:{labels:volumes.map(v=>v>=1000?(v/10000).toFixed(1)+'万':'0'),
      datasets:[
        {label:'平台收入 (服务费)',data:revenues,borderColor:'${C.MAIN}',backgroundColor:'${C.MAIN}20',fill:true,tension:0.3,pointRadius:5},
        {label:'总成本 (固定+渠道)',data:costs,borderColor:'${C.RED}',backgroundColor:'${C.RED}20',fill:true,tension:0.3,pointRadius:5},
        {label:'净利润',data:profits,borderColor:'${C.GREEN}',backgroundColor:'${C.GREEN}20',fill:true,tension:0.3,pointRadius:5,borderWidth:3},
      ]},
    options:{...chartOptions({plugins:{title:{display:true,text:'盈亏平衡分析 · 月交易笔数 vs 收入/成本/利润',color:'#fff',font:{size:15}},annotation:{annotations:{line1:{type:'line',xMin:bePoint,xMax:bePoint,borderColor:'${C.ORANGE}',borderWidth:2,label:{display:true,content:'BEP: '+bePoint+'笔',position:'start'}}}}}})}
  });
  // Add BEP marker manually
  const canvas=document.getElementById('chartBreakeven');
  const ctx=canvas.getContext('2d');
  const origDraw=canvas.__chartjs_draw;
})();

// ====== CHART 7: Waterfall ======
new Chart(document.getElementById('chartWaterfall'),{
  type:'bar',
  data:{labels:['GMV','-渠道成本','=净收入','-商家分账','-推广佣金','-城市服务商','-消费金','-营销池','-风控','=平台收入','-固定成本','=净利润'],
    datasets:[{data:[100,-0.6,null,-75.4,-9,-1,-3,-4,-2,null,-3.8,null],
      backgroundColor:['${C.ORANGE}','${C.RED}','transparent','${C.GREEN}','${C.PURPLE}','${C.TEAL}','${C.YELLOW}','${C.YELLOW}','${C.RED}','transparent','${C.RED}','transparent'],
      borderRadius:4}],
    options:{...chartOptions({plugins:{title:{display:true,text:'平台利润瀑布图 · ¥100交易 (平台商家·汇付)',color:'#fff',font:{size:15}},tooltip:{callbacks:{label:ctx=>'¥'+ctx.raw.toFixed(2)}}}})}
});

// ====== CHART 8: Sensitivity Analysis ======
(function(){
  const baseVol=50000, basePrice=100;
  const scenarios=[
    {label:'基准',vol:50000,price:100},
    {label:'+20%笔数',vol:60000,price:100},
    {label:'+20%客单价',vol:50000,price:120},
    {label:'+20%双增',vol:60000,price:120},
    {label:'-20%笔数',vol:40000,price:100},
    {label:'-20%客单价',vol:50000,price:80},
  ];
  const profits=scenarios.map(s=>s.vol*(s.price*0.0533-0.60)-190000);
  new Chart(document.getElementById('chartSensitivity'),{
    type:'bar',
    data:{labels:scenarios.map(s=>s.label+'\\n('+s.vol/10000+'万笔×¥'+s.price+')'),
      datasets:[{label:'月净利润 (¥)',data:profits,backgroundColor:profits.map(p=>p>=0?'${C.GREEN}':'${C.RED}'),borderRadius:8}]},
    options:{...chartOptions({plugins:{title:{display:true,text:'利润敏感性分析 · 交易笔数 & 客单价变动',color:'#fff',font:{size:15}}}})}
  });
})();

// ====== CHART 9: Profitability Metrics ======
new Chart(document.getElementById('chartProfitability'),{
  type:'bar',
  data:{labels:['毛利率','净利率','边际贡献率','固定成本率'],
    datasets:[{label:'平台商家',data:[88.7,0.93,94.4,76.0],backgroundColor:'${C.MAIN}',borderRadius:6},
      {label:'联盟商家',data:[88.7,0.93,94.4,76.0],backgroundColor:'${C.ORANGE}',borderRadius:6},
      {label:'综合商城',data:[90.9,1.5,95.0,73.3],backgroundColor:'${C.GREEN}',borderRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'三大商家类型·平台盈利指标对比 (%)',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 10: Triple Marketing Radar ======
new Chart(document.getElementById('chartTripleRadar'),{
  type:'radar',
  data:{labels:['发放比例','抵扣上限','有效期(天)','成本来源占比','跨店通用','可转让','不可兑现'],
    datasets:[
      {label:'代金券 🆕全平台通用',data:[5,30,90,4,100,0,100],borderColor:'${C.ORANGE}',backgroundColor:'${C.ORANGE}20',pointRadius:5,pointBackgroundColor:'${C.ORANGE}'},
      {label:'积分',data:[100,20,730,0,100,0,100],borderColor:'${C.MAIN}',backgroundColor:'${C.MAIN}20',pointRadius:5,pointBackgroundColor:'${C.MAIN}'},
      {label:'消费金',data:[3,30,365,3,100,50,100],borderColor:'${C.GREEN}',backgroundColor:'${C.GREEN}20',pointRadius:5,pointBackgroundColor:'${C.GREEN}'},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'三元营销体系·六维雷达对比',color:'#fff',font:{size:15}}}},scales:{r:{grid:{color:'rgba(255,255,255,0.1)'},ticks:{backdropColor:'transparent',color:'rgba(255,255,255,0.5)'},pointLabels:{color:'rgba(255,255,255,0.7)'}}})}
});

// ====== CHART 11: Triple Stack ======
new Chart(document.getElementById('chartTripleStack'),{
  type:'bar',
  data:{labels:['代金券','积分','消费金'],
    datasets:[
      {label:'发放率 (% of GMV)',data:[5,1,3],backgroundColor:'${C.ORANGE}',borderRadius:6},
      {label:'核销上限 (% of order)',data:[30,20,30],backgroundColor:'${C.MAIN}',borderRadius:6},
      {label:'有效期 (月)',data:[3,24,12],backgroundColor:'${C.GREEN}',borderRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'三元营销工具·核心参数对比',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 12: Consumer Benefit Flow ======
new Chart(document.getElementById('chartConsumerBenefitFlow'),{
  type:'line',
  data:{labels:['第1次','第2次','第3次','第4次','第5次','第6次','第7次','第8次','第9次','第10次'],
    datasets:[
      {label:'累积代金券 (¥)',data:[5,9.5,13.5,17,20,22.5,24.5,26,27.5,28.5],borderColor:'${C.ORANGE}',fill:true,backgroundColor:'${C.ORANGE}15',tension:0.3},
      {label:'累积积分 (¥等值)',data:[1,2.9,4.7,6.4,8,9.5,10.9,12.2,13.4,14.5],borderColor:'${C.MAIN}',fill:true,backgroundColor:'${C.MAIN}15',tension:0.3},
      {label:'累积消费金 (¥)',data:[3,5.8,8.4,10.8,13,15,16.8,18.4,19.8,21],borderColor:'${C.GREEN}',fill:true,backgroundColor:'${C.GREEN}15',tension:0.3},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'消费者权益累积模拟 · 10次消费(@¥100/次)·全平台通用',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 13: Cross-store Flow ======
new Chart(document.getElementById('chartCrossStoreFlow'),{
  type:'bar',
  data:{labels:['券在发行店使用','券跨店使用(同城)','券跨店使用(跨城)'],
    datasets:[
      {label:'消费者实付',data:[70,68,68],backgroundColor:'${C.MAIN}',borderRadius:6},
      {label:'券抵扣',data:[30,30,30],backgroundColor:'${C.ORANGE}',borderRadius:6},
      {label:'商家结算收入',data:[100,100,100],backgroundColor:'${C.GREEN}',borderRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'跨店通兑·商家收入不变原则 (¥100订单)',color:'#fff',font:{size:15}}}}),scales:{x:{stacked:false},y:{stacked:false}}}
});

// ====== CHART 14: Pool Balance ======
new Chart(document.getElementById('chartPoolBalance'),{
  type:'line',
  data:{labels:['周一','周二','周三','周四','周五','周六','周日'],
    datasets:[
      {label:'营销池注入 (万元)',data:[2.8,2.6,2.9,3.1,3.5,3.8,3.2],borderColor:'${C.MAIN}',tension:0.4,pointRadius:4,fill:true,backgroundColor:'${C.MAIN}15'},
      {label:'营销池支出·核销 (万元)',data:[2.2,2.5,2.4,2.8,3.2,3.6,3.0],borderColor:'${C.ORANGE}',tension:0.4,pointRadius:4,fill:true,backgroundColor:'${C.ORANGE}15'},
      {label:'营销池净余额 (万元)',data:[6.5,6.6,7.1,7.4,7.7,7.9,8.1],borderColor:'${C.GREEN}',tension:0.4,pointRadius:4,borderWidth:3,borderDash:[3,3]},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'营销池周度注入/支出/余额模拟 (汇付托管)',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 15: Cost Structure ======
new Chart(document.getElementById('chartCostStructure'),{
  type:'doughnut',
  data:{labels:['技术基础设施 ¥50K','人员工资 ¥80K','办公场地 ¥20K','营销推广 ¥30K','合规法务 ¥10K'],
    datasets:[{data:[50000,80000,20000,30000,10000],backgroundColor:['${C.MAIN}','${C.ORANGE}','${C.GREEN}','${C.PURPLE}','${C.RED}'],borderWidth:2,borderColor:'rgba(10,10,20,0.8)'}]},
  options:{...chartOptions(),plugins:{...chartOptions().plugins,title:{display:true,text:'月度固定成本结构 · 总计 ¥190,000',color:'#fff',font:{size:15}}}}}
});

// ====== CHART 16: Margin Waterfall ======
new Chart(document.getElementById('chartMarginWaterfall'),{
  type:'bar',
  data:{labels:['GMV/笔','渠道成本','=净收入','固定成本/笔','=净利润/笔'],
    datasets:[{data:[100,0.60,null,3.80,null],
      backgroundColor:['${C.ORANGE}','${C.RED}','transparent','${C.RED}','transparent'],
      borderRadius:4}],
  options:{...chartOptions({plugins:{title:{display:true,text:'单笔交易利润瀑布 · @50,000笔/月',color:'#fff',font:{size:15}}}})}
});

// ====== GAUGE CHARTS ======
function drawGauge(canvasId, value, max, color, label){
  const canvas=document.getElementById(canvasId);
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const cx=100,cy=110,r=85;
  const startAngle=Math.PI*0.75, endAngle=Math.PI*2.25;
  const angle=startAngle+(endAngle-startAngle)*Math.min(value/max,1);

  ctx.clearRect(0,0,200,200);

  // Background arc
  ctx.beginPath();ctx.arc(cx,cy,r,startAngle,endAngle);
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=16;ctx.stroke();

  // Value arc with gradient
  const grad=ctx.createLinearGradient(0,0,200,0);
  grad.addColorStop(0,color);grad.addColorStop(1,color+'88');
  ctx.beginPath();ctx.arc(cx,cy,r,startAngle,angle);
  ctx.strokeStyle=grad;ctx.lineWidth=16;ctx.stroke();

  // Center text
  ctx.fillStyle='#fff';ctx.font='bold 32px "Microsoft YaHei"';
  ctx.textAlign='center';ctx.fillText((value/max*100).toFixed(1)+'%',cx,cy-5);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='12px "Microsoft YaHei"';
  ctx.fillText(label,cx,cy+22);
}

setTimeout(()=>{
  drawGauge('gaugeBreakeven',50000,41806,'${C.ORANGE}','@50K笔/月');
  drawGauge('gaugeMargin',88.7,100,'${C.GREEN}','毛利率');
  drawGauge('gaugeNetMargin',0.93,2,'${C.MAIN}','净利润率');
},300);

// ====== CHART 17: Merchant Radar ======
new Chart(document.getElementById('chartMerchantRadar'),{
  type:'radar',
  data:{labels:['信息密度','搜索权重','页面自定义度','商家收入%','推广佣金%','品牌标识强度','消费者权益','平台服务支持'],
    datasets:[
      {label:'平台商家 Premium',data:[95,100,90,75,70,95,85,90],borderColor:'${C.MAIN}',backgroundColor:'${C.MAIN}15',pointRadius:5},
      {label:'联盟商家 Standard',data:[65,60,45,71,85,60,70,70],borderColor:'${C.ORANGE}',backgroundColor:'${C.ORANGE}15',pointRadius:5},
      {label:'综合商城 Minimal',data:[30,20,10,78,50,25,60,50],borderColor:'${C.GREEN}',backgroundColor:'${C.GREEN}15',pointRadius:5},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'三级商家·千面千店八维雷达对比',color:'#fff',font:{size:15}}}}),scales:{r:{grid:{color:'rgba(255,255,255,0.1)'},ticks:{backdropColor:'transparent',color:'rgba(255,255,255,0.5)'},pointLabels:{color:'rgba(255,255,255,0.7)'}}})}
});

// ====== CHART 18: Merchant Bar ======
new Chart(document.getElementById('chartMerchantBar'),{
  type:'bar',
  data:{labels:['商家收入','平台服务费','推广佣金池','消费金','营销池'],
    datasets:[
      {label:'平台商家',data:[75.4,5,9,3,4],backgroundColor:'${C.MAIN}',borderRadius:6},
      {label:'联盟商家',data:[71.4,5,10,2,3.5],backgroundColor:'${C.ORANGE}',borderRadius:6},
      {label:'综合商城',data:[77.9,6,6,3,3.5],backgroundColor:'${C.GREEN}',borderRadius:6},
    ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'三大商家·分账结构对比 (汇付收单·¥100)',color:'#fff',font:{size:15}}}})}
});

// ====== CHART 19: Compliance Status ======
new Chart(document.getElementById('chartComplianceStatus'),{
  type:'bar',
  data:{labels:['积分不可兑现','无资金池','不承诺收益','汇付持牌','跨店≠二清','14项术语','数据安全','消费者保护'],
    datasets:[{label:'合规达标率 %',data:[100,100,100,100,100,100,95,95],backgroundColor:['${C.GREEN}','${C.GREEN}','${C.GREEN}','${C.GREEN}','${C.GREEN}','${C.GREEN}','${C.ORANGE}','${C.ORANGE}'],borderRadius:8}]},
  options:{...chartOptions({plugins:{title:{display:true,text:'合规风控达标仪表 · 八项指标',color:'#fff',font:{size:15}}}}),scales:{y:{max:110,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)',callback:v=>v+'%'}}}}
});

// ====== CHART 20: Risk Matrix ======
new Chart(document.getElementById('chartRiskMatrix'),{
  type:'scatter',
  data:{datasets:[
    {label:'低概率·高影响',data:[{x:15,y:85}],backgroundColor:'${C.RED}',pointRadius:12},
    {label:'中概率·中影响',data:[{x:40,y:55},{x:50,y:45}],backgroundColor:'${C.ORANGE}',pointRadius:12},
    {label:'高概率·低影响',data:[{x:75,y:20}],backgroundColor:'${C.YELLOW}',pointRadius:12},
    {label:'低概率·低影响',data:[{x:20,y:15},{x:10,y:25}],backgroundColor:'${C.GREEN}',pointRadius:12},
  ]},
  options:{...chartOptions({plugins:{title:{display:true,text:'风险矩阵 · 概率 vs 影响程度',color:'#fff',font:{size:15}}}}),scales:{x:{title:{display:true,text:'发生概率 %',color:'rgba(255,255,255,0.5)'},min:0,max:100,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}},y:{title:{display:true,text:'影响程度 %',color:'rgba(255,255,255,0.5)'},min:0,max:100,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'rgba(255,255,255,0.5)'}}}}
});

console.log('✅ 链商2.0 商业模式全景图 · 思维导图 · 动态指标仪表盘 · 全部图表已渲染完成');
console.log('📊 总计: 思维导图(1) + Sankey资金流(1) + Chart.js图表(20) + 仪表盘(3) + 数据表格(2) + 卡片(12+)');
console.log('🔗 数据来源: 分润核销模型 V3.2 · 营销策略制定方案 V2.0');
</script>
</body>
</html>`;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, html, 'utf-8');
console.log('✅ Generated: ' + outFile);
console.log('📊 链商2.0 商业模式全景图 · 思维导图 + 动态指标 + 策略可视化');
console.log('   包含: 交互式思维导图 | Sankey资金流向图 | 20+ Chart.js动态图表 | 3个仪表盘 | KPI Scorecard | 合规仪表');
