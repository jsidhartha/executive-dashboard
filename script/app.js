// ===== FIX: boot gating to avoid using SAMPLE before it's defined =====
let __booted = false;

// ================== Theme (auto from browser, with icon override) ==================
const themeIcon = document.getElementById('themeIcon');
const themeSvg = document.getElementById('themeSvg');
const media = window.matchMedia('(prefers-color-scheme: dark)');
function currentTheme(){
  return document.documentElement.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
}
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  paintThemeIcon();
  // Only rerender after the app has finished booting
  if (__booted) {
    renderAll();
  }
}
function paintThemeIcon(){
  const t = currentTheme();
  themeSvg.innerHTML = t === 'dark'
    ? '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>' // moon
    : '<svg viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79L3.17 4.85l1.79 1.8 1.8-1.81zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.22 19.78l1.79-1.79-1.41-1.41-1.8 1.79 1.42 1.41zM20 13h3v-2h-3v2zM19.78 4.22l-1.41 1.41 1.79 1.8 1.41-1.42-1.79-1.79zM12 1h-2v3h2V1zm6.24 16.95l1.79 1.8 1.41-1.42-1.79-1.79-1.41 1.41zM7 12a5 5 0 1010 0 5 5 0 00-10 0z"/></svg>'; // sun
}
// Initialize to system theme and keep in sync (no render yet)
applyTheme(media.matches ? 'dark' : 'light');
media.addEventListener('change', e => applyTheme(e.matches ? 'dark' : 'light'));
// Icon toggles between dark/light (override)
themeIcon.addEventListener('click', () => applyTheme(currentTheme()==='dark' ? 'light' : 'dark'));

// ================== Targets (from Catalog) ==================
const KPI_TARGETS = {
  pipelineCoverage: 3.0, pipelineMin: 2.0, winRate: 30, avgDiscount: 20, partnerSourced: 35, proposalDays: 10,
  csat: 85, nps: 40, fcr: 70, dso: 60, billingAccuracy: 98, forecastAccVar: 10, sla: 95, automation: 30,
};

// ================== Mock Data ==================
const SAMPLE = {
  periods: { QTD: ['Jul', 'Aug', 'Sep'], MTD: ['W1','W2','W3','W4'], LastQ: ['Apr','May','Jun'] },
  segments: ['Enterprise','Mid-Market','SMB'],
  sales: {
    bookings: { Enterprise: [2.4, 2.9, 3.6], 'Mid-Market': [1.6, 1.8, 2.1], SMB: [0.8, 1.0, 1.2] },
    forecast: { Enterprise: [2.2, 3.0, 3.4], 'Mid-Market': [1.7, 1.9, 2.0], SMB: [0.7, 0.9, 1.1] },
    pipelineByStage: { stages: ['Prospect','Qualify','Proposal','Negotiation','Commit'], Enterprise: [3.0,2.2,1.8,1.1,0.9], 'Mid-Market':[2.8,2.0,1.3,0.8,0.6], SMB:[2.0,1.5,0.9,0.6,0.4] },
    winRate: { Enterprise: [32,33,35], 'Mid-Market':[28,30,31], SMB:[22,24,26] },
    avgDiscount: { Enterprise: [18,17,16], 'Mid-Market':[21,20,19], SMB:[24,23,22] },
    dealSize: { Enterprise: [180,195,210], 'Mid-Market':[95,100,110], SMB:[32,36,38] },
    cycleDays: { Enterprise: [45,43,40], 'Mid-Market':[38,36,34], SMB:[28,27,25] },
    partnerSourced: { Enterprise: [38,36,37], 'Mid-Market':[33,34,35], SMB:[28,30,32] },
    pipelineCoverage: { Enterprise: [3.4,3.2,3.1], 'Mid-Market':[2.8,2.6,2.9], SMB:[2.1,2.3,2.5] },
    proposalDays: { Enterprise: [9,10,8], 'Mid-Market':[11,10,9], SMB:[13,12,11] }
  },
  cs: { csat: [86,88,84], nps: [42,45,40], fcr: [71,73,75], tickets:[420,390,410], backlog:[60,55,48], vendorSla:[95,96,97] },
  finance: { dso:[58,62,55], billingAcc:[98.2,97.8,98.6], forecastAcc:[8,12,9], revMix:[45,35,20], cogs:[30,25,20,15,10], margin:[58,60,57] },
  ops: { mttrP1:[3.8,4.2,3.5], mttrP2:[7.5,8.1,7.2], sla:[94,95,96], automation:[28,29,31], incidents:[20,18,22], avail:[99.7,99.8,99.9] }
};

// ================== State & helpers ==================
let segment = 'all';
let period = 'QTD';
const sections = ['overview','sales','cs','finance','ops','settings'];

function statusClass(key, value){
  switch(key){
    case 'pipelineCoverage': return value >= KPI_TARGETS.pipelineCoverage ? 'ok' : (value >= KPI_TARGETS.pipelineMin ? 'warn' : 'bad');
    case 'winRate': return value >= KPI_TARGETS.winRate ? 'ok' : (value >= KPI_TARGETS.winRate * 0.8 ? 'warn' : 'bad');
    case 'avgDiscount': return value <= KPI_TARGETS.avgDiscount ? 'ok' : (value <= KPI_TARGETS.avgDiscount * 1.2 ? 'warn' : 'bad');
    case 'partnerSourced': return value >= KPI_TARGETS.partnerSourced ? 'ok' : (value >= KPI_TARGETS.partnerSourced * 0.8 ? 'warn' : 'bad');
    case 'proposalDays': return value <= KPI_TARGETS.proposalDays ? 'ok' : (value <= KPI_TARGETS.proposalDays * 1.2 ? 'warn' : 'bad');
    case 'csat': return value >= KPI_TARGETS.csat ? 'ok' : (value >= KPI_TARGETS.csat*0.95 ? 'warn' : 'bad');
    case 'nps': return value >= KPI_TARGETS.nps ? 'ok' : (value >= KPI_TARGETS.nps*0.9 ? 'warn' : 'bad');
    case 'fcr': return value >= KPI_TARGETS.fcr ? 'ok' : (value >= KPI_TARGETS.fcr*0.9 ? 'warn' : 'bad');
    case 'dso': return value <= KPI_TARGETS.dso ? 'ok' : (value <= KPI_TARGETS.dso*1.1 ? 'warn' : 'bad');
    case 'billingAccuracy': return value >= KPI_TARGETS.billingAccuracy ? 'ok' : (value >= KPI_TARGETS.billingAccuracy*0.98 ? 'warn' : 'bad');
    case 'forecastAccVar': return value <= KPI_TARGETS.forecastAccVar ? 'ok' : (value <= KPI_TARGETS.forecastAccVar*1.2 ? 'warn' : 'bad');
    case 'sla': return value >= KPI_TARGETS.sla ? 'ok' : (value >= KPI_TARGETS.sla*0.95 ? 'warn' : 'bad');
    case 'automation': return value >= KPI_TARGETS.automation ? 'ok' : (value >= KPI_TARGETS.automation*0.9 ? 'warn' : 'bad');
    default: return 'warn';
  }
}
function labels(){ return SAMPLE.periods[period]; }
function segs(){ return segment === 'all' ? SAMPLE.segments : [segment]; }
function lastIdx(){ return labels().length - 1; }
function chartOpts(){
  const styles = getComputedStyle(document.documentElement);
  const grid = styles.getPropertyValue('--grid').trim();
  const axis = styles.getPropertyValue('--muted').trim();
  return { responsive:true, plugins:{ legend:{ labels:{ color: axis } }, tooltip:{ mode:'index', intersect:false } }, scales:{ x:{ ticks:{ color: axis }, grid:{ color: grid } }, y:{ ticks:{ color: axis }, grid:{ color: grid } } } };
}

// ================== Sidebar nav ==================
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    const target = el.getAttribute('data-target');
    sections.forEach(id => { const sec = document.getElementById(id); if(id === target) sec.classList.add('active'); else sec.classList.remove('active'); });
    renderAll();
  });
});

// ================== Reusable chart helper ==================
const charts = new Map();
function makeChart(id, type, data, opts){ if(charts.has(id)){ charts.get(id).destroy(); } const ctx = document.getElementById(id).getContext('2d'); const c = new Chart(ctx, { type, data, options: opts || chartOpts() }); charts.set(id, c); return c; }

// ================== Reusable table (search + sort) ==================
function makeTable(containerId, columns, rows){
  const wrap = document.getElementById(containerId);
  const toolbar = document.createElement('div'); toolbar.className = 'table-toolbar';
  const search = document.createElement('input'); search.className = 'search'; search.placeholder = 'Search…';
  const count = document.createElement('span'); count.className = 'kpi-sub';
  toolbar.appendChild(search); toolbar.appendChild(count);

  const table = document.createElement('table'); table.className = 'table';
  const thead = document.createElement('thead'); const trh = document.createElement('tr');
  columns.forEach((c,i)=>{ const th = document.createElement('th'); th.textContent = c.label; th.className='sortable'; th.dataset.key=c.key; th.dataset.dir=''; const ind = document.createElement('span'); ind.className='sort-ind'; ind.textContent=''; th.appendChild(ind); trh.appendChild(th); });
  thead.appendChild(trh);
  const tbody = document.createElement('tbody');
  table.appendChild(thead); table.appendChild(tbody);

  wrap.innerHTML = ''; wrap.appendChild(toolbar); wrap.appendChild(table);

  function render(data){ tbody.innerHTML=''; data.forEach(r=>{ const tr=document.createElement('tr'); columns.forEach(c=>{ const td=document.createElement('td'); td.textContent = r[c.key]; tr.appendChild(td); }); tbody.appendChild(tr); }); count.textContent = `${data.length} rows`; }

  let filtered = rows.slice(); render(filtered);

  // Search
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    filtered = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    render(filtered);
  });

  // Sort
  thead.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key; const dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';
      thead.querySelectorAll('th').forEach(x=>{ x.dataset.dir=''; x.querySelector('.sort-ind').textContent=''; });
      th.dataset.dir = dir; th.querySelector('.sort-ind').textContent = dir === 'asc' ? '▲' : '▼';
      filtered.sort((a,b)=> (a[key] > b[key] ? 1 : -1) * (dir==='asc'?1:-1));
      render(filtered);
    });
  });
}

// ================== Overview ==================
function renderOverviewKPIs(){
  const grid = document.getElementById('kpiOverview'); grid.innerHTML='';
  const idx = lastIdx(); const chosen = segs();
  const avg = (k)=> { let t=0; chosen.forEach(s=> t+= SAMPLE.sales[k][s][idx]); return +(t/ chosen.length).toFixed(1); };
  const sum = (k)=> { let t=0; chosen.forEach(s=> t+= SAMPLE.sales[k][s][idx]); return +t.toFixed(1); };
  const cards = [
    { key:'pipelineCoverage', label:'Pipeline Coverage (2Q)', val: `${avg('pipelineCoverage')}x` },
    { key:'winRate', label:'Win Rate', val: `${avg('winRate')}%` },
    { key:'avgDiscount', label:'Avg Discount', val: `${avg('avgDiscount')}%` },
    { key:'partnerSourced', label:'Partner-Sourced', val: `${avg('partnerSourced')}%` },
    // 4 more cards
    { key: 'dealSize', label: 'Avg Deal Size', val: `$${avg('dealSize')}k` },
    { key: 'cycleDays', label: 'Sales Cycle', val: `${avg('cycleDays')}d` },
    { key: 'proposalDays', label: 'Proposal Cycle', val: `${avg('proposalDays')}d` },
    { key: 'bookings', label: 'Bookings (This Period)', val: `$${sum('bookings')}M` },
  ];
  cards.forEach(k=>{ const card=document.createElement('div'); card.className='card'; const num=parseFloat(String(k.val).replace(/[^0-9.]/g,'')); const dotClass = statusClass(k.key, num); card.innerHTML=`<h3>${k.label}</h3><div class="kpi-value"><span class="kpi-dot ${dotClass}"></span>${k.val}</div><div class="kpi-sub">Segment: ${segment==='all'?'All':segment} • Period: ${period}</div>`; grid.appendChild(card); });
}
function renderOverviewCharts(){
  const labs = labels(); const opts = chartOpts();
  makeChart('ovPipeChart','line',{ labels: labs, datasets: segs().map(s=> ({ label:s, data:SAMPLE.sales.pipelineCoverage[s], borderWidth:2, fill:false })) }, opts);
  makeChart('ovWinChart','line',{ labels: labs, datasets: segs().map(s=> ({ label:s, data:SAMPLE.sales.winRate[s], borderWidth:2, fill:false })) }, opts);
  const idx = lastIdx(); let total=0; let count=0; (segment==='all'?SAMPLE.segments:[segment]).forEach(s=> total+=SAMPLE.sales.partnerSourced[s][idx]); const avgPartner=+(total/((segment==='all')?3:1)).toFixed(1);
  makeChart('ovPartnerChart','doughnut',{ labels:['Partner','Other'], datasets:[{ data:[avgPartner, 100-avgPartner] }] });
  // extra charts
  // Pie: bookings mix by segment (latest point)
  const mix = SAMPLE.segments.map(s=> SAMPLE.sales.bookings[s][idx]);
  makeChart('ovPie','pie',{ labels: SAMPLE.segments, datasets:[{ data: mix }] });
  // Bar: bookings by segment over time
  makeChart('ovBar','bar',{ labels: labs, datasets: SAMPLE.segments.map(s=> ({ label:s, data:SAMPLE.sales.bookings[s] })) }, { ...opts, plugins:{ ...opts.plugins, legend:{ position:'bottom', labels:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() } } } });
  // Donut: discount buckets (mock)
  makeChart('ovDonut','doughnut',{ labels:['0-10%','10-20%','20%+'], datasets:[{ data:[35,45,20] }] });
  // Polar: cycle days (avg by segment)
  const pol = SAMPLE.segments.map(s=> SAMPLE.sales.cycleDays[s][idx]);
  makeChart('ovPolar','polarArea',{ labels: SAMPLE.segments, datasets:[{ data: pol }] });
  // Radar: deal size comparison
  const ds = SAMPLE.segments.map(s=> SAMPLE.sales.dealSize[s][idx]);
  makeChart('ovRadar','radar',{ labels: SAMPLE.segments, datasets:[{ label:'Avg Deal Size (k)', data: ds }] });
  // Area: forecast vs actual (stacked line with fill)
  const labs2 = labs, actual = labs2.map((_,i)=> SAMPLE.segments.reduce((t,s)=> t+SAMPLE.sales.bookings[s][i],0)), fcst = labs2.map((_,i)=> SAMPLE.segments.reduce((t,s)=> t+SAMPLE.sales.forecast[s][i],0));
  makeChart('ovArea','line',{ labels: labs2, datasets:[{ label:'Actual', data: actual, fill:true, borderWidth:2 },{ label:'Forecast', data: fcst, fill:true, borderWidth:2 }] }, opts);
}
function renderOverviewTable(){
  const cols=[{key:'opportunity',label:'Opportunity'},{key:'segment',label:'Segment'},{key:'stage',label:'Stage'},{key:'amount',label:'Amount ($k)'}, {key:'owner',label:'Owner'}];
  const rows=[
    {opportunity:'Acme Renewal', segment:'Enterprise', stage:'Negotiation', amount:420, owner:'Alex'},
    {opportunity:'Globex Suite', segment:'Mid-Market', stage:'Proposal', amount:210, owner:'Priya'},
    {opportunity:'Initech POC', segment:'SMB', stage:'Qualify', amount:85, owner:'Diego'},
    {opportunity:'Umbrella Add-on', segment:'Enterprise', stage:'Commit', amount:310, owner:'Chen'},
    {opportunity:'Soylent Expansion', segment:'Mid-Market', stage:'Prospect', amount:140, owner:'Maya'},
  ];
  makeTable('ovTableWrap', cols, rows);
}
function renderOverview(){ renderOverviewKPIs(); renderOverviewCharts(); renderOverviewTable(); }

// ================== Sales ==================
function renderSalesKPIs(){
  const grid = document.getElementById('kpiSales'); grid.innerHTML='';
  const idx = lastIdx(); const chosen = segs();
  const sum = (k)=> { let t=0; chosen.forEach(s=> t+= SAMPLE.sales[k][s][idx]); return +t.toFixed(2); };
  const avg = (k)=> { let t=0; chosen.forEach(s=> t+= SAMPLE.sales[k][s][idx]); return +(t/ chosen.length).toFixed(1); };
  const cards = [
    { key:'bookings', label:'Bookings (This Period)', val: `$${sum('bookings')}M` },
    { key:'pipelineCoverage', label:'Pipeline Coverage (2Q)', val: `${avg('pipelineCoverage')}x` },
    { key:'winRate', label:'Win Rate', val: `${avg('winRate')}%` },
    { key:'avgDiscount', label:'Avg Discount', val: `${avg('avgDiscount')}%` },
  ];
  cards.forEach(k=>{ const card=document.createElement('div'); card.className='card'; const n=parseFloat(String(k.val).replace(/[^0-9.]/g,'')); card.innerHTML=`<h3>${k.label}</h3><div class="kpi-value"><span class="kpi-dot ${statusClass(k.key,n)}"></span>${k.val}</div><div class="kpi-sub">Segment: ${segment==='all'?'All':segment} • Period: ${period}</div>`; grid.appendChild(card); });
}
function renderSalesCharts(){
  const labs = labels(); const opts = chartOpts(); const chosen = segs();
  const sum = (key,i)=> chosen.reduce((t,s)=> t + SAMPLE.sales[key][s][i], 0);
  const actual = labs.map((_,i)=> +sum('bookings',i).toFixed(2));
  const fcst   = labs.map((_,i)=> +sum('forecast',i).toFixed(2));
  makeChart('bookingsChart','line',{ labels: labs, datasets:[{ label:'Bookings ($M)', data: actual, borderWidth:2, fill:false }] }, opts);
  makeChart('forecastChart','bar',{ labels: labs, datasets:[{ label:'Actual ($M)', data: actual },{ label:'Forecast ($M)', data: fcst }] }, { ...opts, plugins:{ ...opts.plugins, legend:{ position:'bottom', labels:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() } } } });
  makeChart('stageChart','bar',{ labels: SAMPLE.sales.pipelineByStage.stages, datasets: chosen.map(s=> ({ label:s, data:SAMPLE.sales.pipelineByStage[s], stack:'p' })) }, { ...opts, scales:{ x:{ stacked:true, ticks:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() }, grid:{ color:getComputedStyle(document.documentElement).getPropertyValue('--grid').trim() } }, y:{ stacked:true, ticks:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() }, grid:{ color:getComputedStyle(document.documentElement).getPropertyValue('--grid').trim() } } } });
  // 6 more
  const idx = lastIdx();
  makeChart('salesPie','pie',{ labels:SAMPLE.segments, datasets:[{ data:SAMPLE.segments.map(s=> SAMPLE.sales.bookings[s][idx]) }] });
  makeChart('salesBar','bar',{ labels:SAMPLE.segments, datasets:[{ label:'Win %', data:SAMPLE.segments.map(s=> SAMPLE.sales.winRate[s][idx]) }, { label:'Discount %', data:SAMPLE.segments.map(s=> SAMPLE.sales.avgDiscount[s][idx]) }] }, opts);
  makeChart('salesDonut','doughnut',{ labels:['<$50k','$50-200k','>$200k'], datasets:[{ data:[22,41,37] }] });
  makeChart('salesPolar','polarArea',{ labels:SAMPLE.segments, datasets:[{ data:SAMPLE.segments.map(s=> SAMPLE.sales.cycleDays[s][idx]) }] });
  makeChart('salesRadar','radar',{ labels:SAMPLE.segments, datasets:[{ label:'Partner %', data:SAMPLE.segments.map(s=> SAMPLE.sales.partnerSourced[s][idx]) }] });
  makeChart('salesArea','line',{ labels: labs, datasets:[{ label:'Coverage', data: labs.map((_,i)=> +(chosen.reduce((t,s)=> t + SAMPLE.sales.pipelineCoverage[s][i],0)/chosen.length).toFixed(2)), fill:true, borderWidth:2 }] }, opts);
}
function renderSalesTable(){
  const cols=[{key:'order',label:'Order #'},{key:'account',label:'Account'},{key:'segment',label:'Segment'},{key:'amount',label:'Amount ($k)'},{key:'rep',label:'Rep'}];
  const rows=[ {order:'SO-10231',account:'Acme',segment:'Enterprise',amount:260,rep:'Alex'}, {order:'SO-10232',account:'Globex',segment:'Mid-Market',amount:120,rep:'Priya'}, {order:'SO-10233',account:'Initech',segment:'SMB',amount:48,rep:'Diego'}, {order:'SO-10234',account:'Umbrella',segment:'Enterprise',amount:390,rep:'Chen'}, {order:'SO-10235',account:'Soylent',segment:'Mid-Market',amount:150,rep:'Maya'} ];
  makeTable('salesTableWrap', cols, rows);
}
function renderSales(){ renderSalesKPIs(); renderSalesCharts(); renderSalesTable(); }

// ================== CS ==================
function renderCSKPIs(){
  const grid = document.getElementById('kpiCS'); grid.innerHTML='';
  const idx = lastIdx();
  const kpis = [
    { key:'csat', label:'CSAT (30d)', val:SAMPLE.cs.csat[idx] },
    { key:'nps', label:'NPS (90d)', val:SAMPLE.cs.nps[idx] },
    { key:'fcr', label:'First Contact Resolution', val:SAMPLE.cs.fcr[idx] },
    { key:'sla', label:'Vendor SLA', val:96 },
  ];
  kpis.forEach(k=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML=`<h3>${k.label}</h3><div class="kpi-value"><span class="kpi-dot ${statusClass(k.key,k.val)}"></span>${k.val}${k.key==='nps'?'':'%'}</div><div class="kpi-sub">Period: ${period}</div>`; grid.appendChild(card); });
}
function renderCSCharts(){
  const labs = labels(); const opts = chartOpts();
  makeChart('csCsatChart','line',{ labels: labs, datasets:[{ label:'CSAT %', data:SAMPLE.cs.csat, borderWidth:2, fill:false }] }, opts);
  makeChart('csNpsChart','bar',{ labels: labs, datasets:[{ label:'NPS', data:SAMPLE.cs.nps }] }, opts);
  makeChart('csFcrChart','line',{ labels: labs, datasets:[{ label:'FCR %', data:SAMPLE.cs.fcr, borderWidth:2, fill:false }] }, opts);
  makeChart('csPie','pie',{ labels:['P1','P2','P3'], datasets:[{ data:[10,25,65] }] });
  makeChart('csBar','bar',{ labels:['P1','P2','P3'], datasets:[{ label:'Backlog', data:[30,22,18] }] }, opts);
  makeChart('csDonut','doughnut',{ labels:['Within SLA','Breach'], datasets:[{ data:[96,4] }] });
  makeChart('csPolar','polarArea',{ labels:['NOC','SOC','Support'], datasets:[{ data:[5,4,6] }] });
  makeChart('csRadar','radar',{ labels:['Escalations','Reopens','Transfers'], datasets:[{ label:'Events', data:[7,12,9] }] });
  makeChart('csArea','line',{ labels: labs, datasets:[{ label:'CSAT', data:SAMPLE.cs.csat, fill:true, borderWidth:2 },{ label:'NPS', data:SAMPLE.cs.nps, fill:true, borderWidth:2 }] }, opts);
}
function renderCSTable(){
  const cols=[{key:'ticket',label:'Ticket #'},{key:'acct',label:'Account'},{key:'prio',label:'Priority'},{key:'status',label:'Status'},{key:'owner',label:'Owner'}];
  const rows=[ {ticket:'INC-2091',acct:'Acme',prio:'P1',status:'Open',owner:'Nina'}, {ticket:'INC-2092',acct:'Globex',prio:'P2',status:'Resolved',owner:'Sam'}, {ticket:'INC-2093',acct:'Initech',prio:'P3',status:'Open',owner:'Lee'}, {ticket:'INC-2094',acct:'Umbrella',prio:'P2',status:'In Progress',owner:'Ari'}, {ticket:'INC-2095',acct:'Soylent',prio:'P3',status:'Resolved',owner:'Iris'} ];
  makeTable('csTableWrap', cols, rows);
}
function renderCS(){ renderCSKPIs(); renderCSCharts(); renderCSTable(); }

// ================== Finance ==================
function renderFinKPIs(){
  const grid = document.getElementById('kpiFin'); grid.innerHTML='';
  const idx = lastIdx();
  const kpis = [
    { key:'dso', label:'DSO', val:SAMPLE.finance.dso[idx] },
    { key:'billingAccuracy', label:'Billing Accuracy', val:SAMPLE.finance.billingAcc[idx] },
    { key:'forecastAccVar', label:'Forecast Variance', val:SAMPLE.finance.forecastAcc[idx] },
    { key:'margin', label:'Gross Margin (est.)', val:SAMPLE.finance.margin[idx] },
  ];
  kpis.forEach(k=>{ const card=document.createElement('div'); card.className='card'; const suff = (k.key==='dso')?' days':'%'; card.innerHTML=`<h3>${k.label}</h3><div class="kpi-value"><span class="kpi-dot ${statusClass(k.key,k.val)}"></span>${k.val}${suff}</div><div class="kpi-sub">Period: ${period}</div>`; grid.appendChild(card); });
}
function renderFinCharts(){
  const labs = labels(); const opts = chartOpts();
  makeChart('finDsoChart','line',{ labels: labs, datasets:[{ label:'DSO (days)', data:SAMPLE.finance.dso, borderWidth:2, fill:false }] }, opts);
  makeChart('finBillChart','bar',{ labels: labs, datasets:[{ label:'Billing Accuracy %', data:SAMPLE.finance.billingAcc }] }, opts);
  makeChart('finFcstAccChart','line',{ labels: labs, datasets:[{ label:'Forecast Variance %', data:SAMPLE.finance.forecastAcc, borderWidth:2, fill:true }] }, opts);
  makeChart('finPie','pie',{ labels:['Offer A','Offer B','Other'], datasets:[{ data:SAMPLE.finance.revMix }] });
  makeChart('finBar','bar',{ labels:['Cloud','Payroll','G&A','Tools','Other'], datasets:[{ label:'COGS/OpEx', data:SAMPLE.finance.cogs }] }, opts);
  makeChart('finDonut','doughnut',{ labels:['Gross Margin','COGS'], datasets:[{ data:[58,42] }] });
  makeChart('finPolar','polarArea',{ labels:['Compute','Storage','Egress','Other'], datasets:[{ data:[30,25,15,30] }] });
  makeChart('finRadar','radar',{ labels:['Rev','OpEx','COGS','EBITDA','Cash'], datasets:[{ label:'Index', data:[70,55,45,38,60] }] });
  makeChart('finArea','line',{ labels: labs, datasets:[{ label:'AR Aging 30+', data:[18,16,20], fill:true, borderWidth:2 }] }, opts);
}
function renderFinTable(){
  const cols=[{key:'invoice',label:'Invoice #'},{key:'account',label:'Account'},{key:'amount',label:'Amount ($k)'},{key:'due',label:'Due (days)'},{key:'status',label:'Status'}];
  const rows=[ {invoice:'INV-9911',account:'Acme',amount:210,due:12,status:'Open'}, {invoice:'INV-9912',account:'Globex',amount:130,due:5,status:'Paid'}, {invoice:'INV-9913',account:'Umbrella',amount:320,due:28,status:'Overdue'}, {invoice:'INV-9914',account:'Initech',amount:75,due:2,status:'Open'}, {invoice:'INV-9915',account:'Soylent',amount:98,due:17,status:'Open'} ];
  makeTable('finTableWrap', cols, rows);
}
function renderFinance(){ renderFinKPIs(); renderFinCharts(); renderFinTable(); }

// ================== Operations ==================
function renderOpsKPIs(){
  const grid = document.getElementById('kpiOps'); grid.innerHTML='';
  const idx = lastIdx();
  const kpis = [
    { key:'mttr', label:'MTTR P1', val:SAMPLE.ops.mttrP1[idx] },
    { key:'mttr', label:'MTTR P2', val:SAMPLE.ops.mttrP2[idx] },
    { key:'sla', label:'SLA Adherence', val:SAMPLE.ops.sla[idx] },
    { key:'automation', label:'Automation Takeover', val:SAMPLE.ops.automation[idx] },
  ];
  kpis.forEach(k=>{ const card=document.createElement('div'); card.className='card'; const suff = (k.key==='mttr')?'h':'%'; card.innerHTML=`<h3>${k.label}</h3><div class="kpi-value"><span class="kpi-dot ${statusClass(k.key,k.val)}"></span>${k.val}${suff}</div><div class="kpi-sub">Period: ${period}</div>`; grid.appendChild(card); });
}
function renderOpsCharts(){
  const labs = labels(); const opts = chartOpts();
  makeChart('opsMttrChart','line',{ labels: labs, datasets:[{ label:'MTTR P1 (h)', data:SAMPLE.ops.mttrP1, borderWidth:2, fill:false }, { label:'MTTR P2 (h)', data:SAMPLE.ops.mttrP2, borderWidth:2, fill:false }] }, opts);
  makeChart('opsSlaChart','bar',{ labels: labs, datasets:[{ label:'SLA %', data:SAMPLE.ops.sla }] }, opts);
  makeChart('opsAutoChart','line',{ labels: labs, datasets:[{ label:'Automation %', data:SAMPLE.ops.automation, borderWidth:2, fill:true }] }, opts);
  makeChart('opsPie','pie',{ labels:['Incidents','Requests','Changes'], datasets:[{ data:[46,38,16] }] });
  makeChart('opsBar','bar',{ labels:['Prometheus','SIEM','Uptime','Other'], datasets:[{ label:'Alerts', data:[120,90,60,45] }] }, opts);
  makeChart('opsDonut','doughnut',{ labels:['Success','Fail'], datasets:[{ data:[92,8] }] });
  makeChart('opsPolar','polarArea',{ labels:['NOC','SOC','AIOps','Support'], datasets:[{ data:[12,10,7,9] }] });
  makeChart('opsRadar','radar',{ labels:['Detect','Ack','Resolve','Prevent'], datasets:[{ label:'Index', data:[80,85,78,65] }] });
  makeChart('opsArea','line',{ labels: labs, datasets:[{ label:'Availability %', data:SAMPLE.ops.avail, fill:true, borderWidth:2 }] }, opts);
}
function renderOpsTable(){
  const cols=[{key:'incident',label:'Incident #'}, {key:'service',label:'Service'}, {key:'prio',label:'Priority'}, {key:'mttr',label:'MTTR (h)'}, {key:'status',label:'Status'}];
  const rows=[ {incident:'INC-5001',service:'API',prio:'P1',mttr:3.8,status:'Resolved'}, {incident:'INC-5002',service:'Batch',prio:'P2',mttr:7.2,status:'Resolved'}, {incident:'INC-5003',service:'Console',prio:'P3',mttr:1.4,status:'Open'}, {incident:'INC-5004',service:'Gateway',prio:'P2',mttr:4.9,status:'In Prog'}, {incident:'INC-5005',service:'Data',prio:'P1',mttr:2.6,status:'Resolved'} ];
  makeTable('opsTableWrap', cols, rows);
}
function renderOps(){ renderOpsKPIs(); renderOpsCharts(); renderOpsTable(); }

// ================== Controls & boot ==================
document.getElementById('segmentSelect').addEventListener('change', (e) => { segment = e.target.value; renderAll(); });
document.getElementById('periodSelect').addEventListener('change', (e) => { period = e.target.value; renderAll(); });

function renderAll(){
  try {
    renderOverview();
    renderSales();
    renderCS();
    renderFinance();
    renderOps();
  } catch (e) {
    console.error('[Render error]', e);
  }
}
// Final boot: now that everything is defined, allow theme to trigger a render
__booted = true;
// Render once
renderAll();
