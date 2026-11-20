(() => {
  'use strict';
  const D = window.ATLAS_DATA, R = window.ATLAS_READING, H = window.ATLAS_AUDIT;
  const root = document.getElementById('content');
  if (!D || !R || !H || !Array.isArray(D.syllabi) || !Array.isArray(R.modules)) {
    root.innerHTML = '<div class="error">站点资料加载不完整，请检查 assets/data.js、reading-data.js 和 audit-data.js。</div>';
    return;
  }
  const byId = new Map(D.syllabi.concat(R.pending).map(x => [x.id, x]));
  const moduleById = new Map(R.modules.map(x => [x.module_id, x]));
  const auditById = new Map(H.decisions.map(x => [x.source_id, x]));
  const $ = id => document.getElementById(id);
  const escape = str => String(str == null ? '' : str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https?:\/\/[^\s<>"']+$/i.test(String(u || '')) ? String(u) : '';
  const link = (u, label='打开原始来源') => safeUrl(u) ? `<a href="${escape(u)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>` : `<span class="muted">原始链接缺失</span>`;
  const directionIds = x => Array.isArray(x) ? x : String(x || '').match(/T\d\d/g) || [];
  const dir = id => D.directions.find(x => x.id === id);
  const sourceDirections = x => directionIds(x.directions);
  const nS = id => D.syllabi.filter(s => sourceDirections(s).includes(id)).length;
  const nM = id => R.modules.filter(m => sourceDirections(m).includes(id)).length;
  const nE = id => R.readings.filter(e => sourceDirections(e).includes(id)).length;
  const favoriteKey = 'syllabusAtlas:localFavorites:v3';
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem(favoriteKey) || '[]')); } catch (_) {}
  const saveFavorites = () => { try {localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));} catch (_) {} };
  const state = {q:'', dir:'all', tier:'all', access:'all', page:1, moduleQ:'', moduleDir:'all', modulePage:1,
    auditQ:'', auditAction:'all', auditPage:1, lastPage:'overview', drawer:null, pageName:'overview'};
  const labels = {overview:'Overview',directions:'Research directions',syllabi:'Full syllabi',modules:'Selected modules',pending:'Pending sources',map:'Knowledge map',audit:'Source audit',usage:'How to use'};
  const cardTag = (text, klass='') => `<span class="pill ${klass}">${escape(text)}</span>`;
  const accessTag = s => cardTag((s.access || '未注明')+' · 材料可见性', s.access==='A' ? 'dark':'soft');
  const tierTag = s => cardTag(s.action==='核心主干' ? '原核心主干' : '原专题补充', s.action==='核心主干'?'':'blue');
  const order = d => D.directions.indexOf(d);
  const svgPalette = ['#4d8978','#c28e61','#7c9a82','#638aaa','#a18a72','#8e9a63','#9a819c','#468d9b','#b08f58','#477c6b'];
  const countFmt = obj => Object.entries(obj).map(([k,v])=>k+':'+v).join(', ');
  const go = h => { if (location.hash===h) route(); else location.hash=h; };
  function renderHeading(kicker, title, desc, extra='') {
    return `<div class="heading"><div><div class="eyebrow">${escape(kicker)}</div><h1 class="title">${escape(title)}</h1><p class="subline">${escape(desc)}</p></div>${extra}</div>`;
  }
  function divsSelect(selected='all') {
    return `<option value="all">全部研究方向</option>`+D.directions.map(d=>`<option value="${d.id}"${selected===d.id?' selected':''}>${d.id} · ${escape(d.label)}</option>`).join('');
  }
  function kpi(n,l,note) { return `<div class="kpi"><label>${escape(l)}</label><b class="number">${n}</b><small>${escape(note)}</small></div>`; }
  function dircard(d){
    return `<button type="button" class="dircard" data-dir="${d.id}"><div class="dirhead"><span class="dir-id">${d.id} / READING FIELD</span><span class="stage">${escape(d.stage)}</span></div><h3>${escape(d.label)}</h3><div class="english">${escape(d.en)}</div><p>${escape(d.goal)}</p><div class="dirfoot"><span><b>${nS(d.id)}</b> 整份课纲 · <b>${nM(d.id)}</b> 专题单元</span><i>查看 →</i></div></button>`;
  }
  function overview(){
    const featured=['T01','T02','T03','T10'];
    const max=Math.max(...D.directions.map(d=>nS(d.id)));
    const liked=[...favorites].map(id=>byId.get(id)).filter(Boolean).slice(0,5);
    return `<section class="hero"><div class="eyebrow">PERSONAL RESEARCH READING LIBRARY · UPDATED 2026.11.20</div><h1>把课程资料整理成<br><em>十条独立研究路径</em></h1><p>以经过四轮检索、再筛选的个人阅读工作台为准。整份紧密相关的课纲与“只取相关单元”的来源分开展示，历史删除决定另行归档，避免研究资料过载。</p><div class="hero-actions"><a class="btn primary" href="./reading-lists/">进入十方向阅读清单 ↗</a><button type="button" class="btn ghost" data-go="#directions">按研究方向查看课纲</button><button type="button" class="btn ghost" data-go="#usage">如何使用这些资料</button></div></section>
      <a class="reading-library-callout" href="./reading-lists/"><div><span class="eyebrow">READING LISTS / 已建立</span><h2>从课程来源，进入具体阅读</h2><p>按十方向、84个知识专题查找作品，查看完整引文、阅读理由和原课纲依据，并下载阅读工作台。</p></div><span class="callout-arrow" aria-hidden="true">↗</span></a>
      <div class="kpis">${kpi(89,'FULL SYLLABI / 整份课纲','59 原核心主干 + 30 原专题补充')}${kpi(30,'EXTRACTED MODULES / 相关单元','仅保留与研究直接相关的部分')}${kpi(88,'READING CLUES / 阅读线索','尚未逐篇完成文献核验')}${kpi(9,'PENDING SOURCES / 待补原件','单独存放，不混入可读目录')}</div>
      <div class="notice"><b>计数说明：</b>89份是来源或版本记录，不是89门独立课程。30组摘录来自不整份保留的资料；88条书目保留原课纲的阅读标记与出处，不能视为最终核实的必读清单。233条历史筛选决定只供审计。</div>
      <section class="section"><div class="sectop"><h2>优先研究方向</h2><a href="#directions">查看完整十方向 →</a></div><div class="direction-grid">${featured.map(id=>dircard(dir(id))).join('')}</div></section>
      <section class="section grid2"><div class="panel"><div class="sectop"><h2>十个方向的来源覆盖</h2><a href="#map">学科关系图 →</a></div>${D.directions.map(d=>`<div class="bar-row"><label title="${escape(d.label)}">${escape(d.label)}</label><div class="bar-track"><span style="width:${Math.max(2,100*nS(d.id)/max)}%;background:${svgPalette[order(d)]}"></span></div><b>${nS(d.id)}</b></div>`).join('')}<div class="tiny">同一来源可支持多个方向，故各方向数量不相加。</div></div>
      <div class="panel"><h2 style="margin:0 0 15px;font-size:16px">从课纲到阅读清单</h2><div class="steps">${[['01','选一个方向','打开该方向的推荐来源，不必同时处理十个领域。'],['02','先看主题结构','观察不同课程如何安排理论、争论和经验研究。'],['03','提取与核实','保留原始出处和阅读要求，核对具体文献信息。'],['04','进入实际阅读清单','打开新阅读库，按知识问题查看作品、阅读顺序与出处。']].map(s=>`<div class="step"><span class="stepnum">${s[0]}</span><div><b>${s[1]}</b><p>${s[2]}</p></div></div>`).join('')}</div><div class="notice"><b>个人标记：</b>可收藏课纲；收藏只保存在当前浏览器，不会自动同步至 GitHub 或其他设备。</div>${liked.length?`<h3 style="font-size:13px">近期收藏</h3>${liked.map(s=>`<div class="overview-module"><a href="#source/${encodeURIComponent(s.id)}">${escape(s.id)} · ${escape(s.title)}</a></div>`).join('')}`:''}</div></section>`;
  }
  function directions(){
    return renderHeading('01 / Research reading fields','十个独立的阅读方向','每个方向独立组织课程结构，允许少量共享来源，但不会把它们硬合为一门课程。')+
       `<div class="direction-grid">${D.directions.map(dircard).join('')}</div>`;
  }
  function directionPage(id){
    const d=dir(id);if(!d)return `<div class="empty">未知的研究方向。<a href="#directions">返回目录</a></div>`;
    const sources=D.syllabi.filter(s=>sourceDirections(s).includes(id));
    const mods=R.modules.filter(m=>sourceDirections(m).includes(id));
    const pending=R.pending.filter(p=>sourceDirections(p).includes(id));
    const starters=d.starter_ids.map(x=>byId.get(x)||R.modules.find(m=>m.source_id===x)).filter(Boolean);
    return renderHeading(id+' / '+d.en,d.label,d.goal,`<button type="button" class="btn" data-go="#directions">返回十方向</button>`)+
      `<div class="kpis">${kpi(sources.length,'整份课纲','与本方向有关的完整来源')}${kpi(mods.length,'相关单元','从跨领域课程提取的部分')}${kpi(nE(id),'阅读线索','仅专题摘录内的具体书目')}${kpi(pending.length,'待补来源','缺全文或指定阅读的线索')}</div>
       <div class="panel"><div class="eyebrow">FIRST STEP / 起步建议</div><p style="font-size:15px;margin:9px 0 6px;font-weight:650">${escape(d.first_step)}</p><p class="subline">建议优先查看：${d.starter_ids.map(x=>`<code>${escape(x)}</code>`).join('　')}。这些是导航入口，不表示已完成完整书目提取。</p></div>
       <section class="section"><div class="sectop"><h2>推荐先查看的来源</h2><a href="#syllabi?dir=${id}">完整列表 →</a></div><div class="cards">${starters.length?starters.map(x=>x.id?coursecard(x):modulecard(x)).join(''):'<div class="empty">推荐来源目前只在历史审核或专题摘录中。请使用编号在课程／单元目录中查找。</div>'}</div></section>
       <section class="section"><div class="sectop"><h2>本方向的整份课纲</h2><a href="#syllabi?dir=${id}">查看全部 ${sources.length} 条 →</a></div><div class="cards">${sources.slice(0,6).map(coursecard).join('')}</div></section>
       <section class="section"><div class="sectop"><h2>专题单元与相关阅读</h2><a href="#modules?dir=${id}">查看全部 ${mods.length} 组 →</a></div><div class="cards">${mods.length?mods.slice(0,4).map(modulecard).join(''):'<div class="empty">没有单独提取的跨领域课程单元。整份保留的课纲仍可能包含有关阅读。</div>'}</div></section>
       ${pending.length?`<section class="section"><div class="sectop"><h2>等待补充的来源</h2><a href="#pending">查看待补来源 →</a></div><div class="cards">${pending.slice(0,3).map(coursecard).join('')}</div></section>`:''}`;
  }
  function coursecard(s){
    const isPending=R.pending.some(p=>p.id===s.id),liked=favorites.has(s.id);
    return `<article class="coursecard"><div class="cardrow"><span class="mono">${escape(s.id)}</span><div class="badges">${isPending?cardTag('待补原件','gold'):tierTag(s)}${accessTag(s)}</div></div><h3>${escape(s.title)}</h3><div class="cardmeta">${escape(s.institution)} · ${escape(s.year)} · ${escape(s.level || '未标层级')}</div><div class="summary">${escape(s.fit || s.use_note || '来源摘要待补充')}</div><div class="cardbottom"><span>${sourceDirections(s).map(id=>escape(id)).join(' / ')} · ${escape(s.source_type||'课程来源')}</span><div class="badges"><button type="button" class="cardlink" data-fav="${escape(s.id)}" aria-label="收藏或取消收藏">${liked?'★ 收藏':'☆ 收藏'}</button><button type="button" class="cardlink" data-source="${escape(s.id)}">详情 →</button></div></div></article>`;
  }
  function modulesFor(m){return R.readings.filter(e=>e.module_id===m.module_id)}
  function modulecard(m){
    return `<article class="modulecard"><div class="cardrow"><span class="mono">${escape(m.module_id)} · ${escape(m.source_id)}</span><span class="pill blue">只取相关单元</span></div><h3>${escape(m.module_subject)}</h3><div class="cardmeta">${escape(m.source_title)} · ${escape(m.institution)}</div><div class="module-quote"><b>${modulesFor(m).length}</b>条待核阅读关联 · ${escape(m.unit_location)}</div><p>${escape(m.selection_reason)}</p><div class="cardbottom"><span>${sourceDirections(m).join(' / ')} · ${escape(m.fidelity||'来源需进一步核查')}</span><button class="cardlink" type="button" data-module="${escape(m.module_id)}">展开阅读 →</button></div></article>`;
  }
  function getSyllabi(){
    const q=state.q.toLocaleLowerCase().trim();return D.syllabi.filter(s=>{
      if(state.dir!=='all'&&!sourceDirections(s).includes(state.dir))return false;
      if(state.tier!=='all'&&(state.tier==='core'?s.action!=='核心主干':s.action!=='专题补充'))return false;
      if(state.access!=='all'&&s.access!==state.access)return false;
      const hay=[s.id,s.title,s.institution,s.instructor,s.year,s.source_type,s.fit,s.topics,s.reading_examples,s.limitations].join(' ').toLocaleLowerCase();
      return !q||hay.includes(q);
    });
  }
  function syllabusPage(){
    return renderHeading('02 / Full syllabus archive','整份保留的课程与书单','仅保留与你的十个阅读方向有系统关系的89条来源／版本记录。支持筛选原核心主干、专题补充和资料可见性。',`<button type="button" class="btn" data-export="syllabi">导出当前筛选 CSV</button>`)+
      `<div class="tabs"><button class="tab ${state.tier==='all'?'active':''}" data-tier="all">全部整份保留 <b>89</b></button><button class="tab ${state.tier==='core'?'active':''}" data-tier="core">原核心主干 <b>59</b></button><button class="tab ${state.tier==='supplement'?'active':''}" data-tier="supplement">原专题补充 <b>30</b></button></div>
      <div class="searchfilters"><label class="searchbox"><i>⌕</i><input id="syllabusSearch" type="search" aria-label="检索整份课纲" placeholder="课程名、教授、学校、研究主题…" value="${escape(state.q)}"></label><select id="syllabusDir" class="select" aria-label="筛选研究方向">${divsSelect(state.dir)}</select><select id="accessFilter" class="select" aria-label="资料可见性"><option value="all">全部可见性</option>${['A','B','C','D'].map(x=>`<option value="${x}" ${state.access===x?'selected':''}>${x} · 原资料标记</option>`).join('')}</select><button type="button" data-reset="syllabi" class="btn small">清除筛选</button></div>
      <div class="resultline" id="sylResultInfo"></div><div class="cards" id="sylResultCards"></div><div class="pager" id="sylPager"></div>`;
  }
  function pages(el,page,max,key){
    if(!el)return;el.innerHTML=max<=1?'':`<button type="button" data-page="${key}:prev" ${page<=1?'disabled':''}>上一页</button><span>第 ${page} / ${max} 页</span><button type="button" data-page="${key}:next" ${page>=max?'disabled':''}>下一页</button>`;
  }
  function drawSyllabi(){
    const list=getSyllabi(), max=Math.max(1,Math.ceil(list.length/12));state.page=Math.min(max,state.page);
    $('sylResultInfo').innerHTML=`匹配 <strong>${list.length}</strong> 条课程来源／版本 · 全部89条，其中59条原核心主干、30条原专题补充`;
    $('sylResultCards').innerHTML=list.length?list.slice((state.page-1)*12,state.page*12).map(coursecard).join(''):'<div class="empty" style="grid-column:1/-1">没有符合筛选条件的课程。</div>';
    pages($('sylPager'),state.page,max,'syllabi');
  }
  function getModules(){const q=state.moduleQ.toLocaleLowerCase().trim();return R.modules.filter(m=>(state.moduleDir==='all'||sourceDirections(m).includes(state.moduleDir))&&(!q||[m.module_id,m.source_id,m.module_subject,m.source_title,m.institution,m.unit_location,m.selection_reason].join(' ').toLocaleLowerCase().includes(q)));}
  function modulePage(){
    return renderHeading('03 / Selective reading extraction','只提取真正相关的专题单元','对只有局部关联的课程，不保留整门 syllabus；展示相关周次、原始主题、原课纲链接及88条有来源标记的阅读线索。',`<button class="btn" type="button" data-export="readings">导出88条阅读线索 CSV</button>`)+
    `<div class="notice"><b>尚未完成文献核验：</b>有些摘录仅沿用前轮课程卡片，只有两份PDF在最新一轮重新核查。阅读标记依原课纲转录；“参考阅读”与“必读”不可混用。</div>`+
    `<div class="searchfilters"><label class="searchbox"><i>⌕</i><input type="search" id="moduleSearch" value="${escape(state.moduleQ)}" placeholder="专题、来源、周次…" aria-label="检索专题单元"></label><select class="select" id="moduleDir" aria-label="专题方向">${divsSelect(state.moduleDir)}</select><button class="btn small" data-reset="modules" type="button">清除筛选</button></div><div class="resultline" id="modResultInfo"></div><div class="cards" id="modResultCards"></div><div class="pager" id="modPager"></div>`;
  }
  function drawModules(){const list=getModules(),max=Math.max(1,Math.ceil(list.length/12));state.modulePage=Math.min(state.modulePage,max);$('modResultInfo').innerHTML=`匹配 <strong>${list.length}</strong> 组专题单元 · 全部30组 / 88条书目线索`;$('modResultCards').innerHTML=list.length?list.slice((state.modulePage-1)*12,state.modulePage*12).map(modulecard).join(''):'<div class="empty" style="grid-column:1/-1">该研究方向暂无单独摘录的专题模块。整份课程中的阅读没有在此重复计入。</div>';pages($('modPager'),state.modulePage,max,'modules');}
  function pendingPage(){return renderHeading('04 / To-be-collected sources','待补原件与阅读清单','这9条仍有研究价值，但尚未取得足够完整的课程正文或指定阅读；不计入89份可用整份课纲。')+`<div class="cards">${R.pending.map(coursecard).join('')}</div>`;}
  function graphPage(){
    const ids=D.directions.map(x=>x.id),centers={};const width=1100,height=690,cx=550,cy=340,rr=237;
    ids.forEach((id,i)=>{const a=-Math.PI/2+i*Math.PI*2/ids.length;centers[id]={x:cx+rr*Math.cos(a),y:cy+rr*Math.sin(a)};});
    // Connections represent distinct shared source IDs assigned to both reading fields.
    const sourceSets={};for(const id of ids){sourceSets[id]=new Set(D.syllabi.concat(R.modules).filter(s=>sourceDirections(s).includes(id)).map(s=>s.id||s.source_id));}
    const lines=[];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
      const a=ids[i],b=ids[j],same=[...sourceSets[a]].filter(x=>sourceSets[b].has(x)).length;
      if(same>0)lines.push(`<line x1="${centers[a].x}" y1="${centers[a].y}" x2="${centers[b].x}" y2="${centers[b].y}" stroke="#92b8a9" stroke-width="${Math.min(13,1+same*.9)}" opacity="${Math.min(.7,.16+same*.075)}"><title>${a} / ${b} 共有${same}条来源</title></line>`);
    }
    const dots=ids.map((id,i)=>{
      const d=dir(id),c=centers[id];const n=nS(id),rad=49+Math.min(13,n/4);
      return `<g data-dir="${id}" role="button" tabindex="0" aria-label="查看${escape(d.label)}"><circle class="node-circle" cx="${c.x}" cy="${c.y}" r="${rad}" fill="${svgPalette[i]}" stroke="#fff" stroke-width="3"/><text x="${c.x}" y="${c.y-10}" text-anchor="middle" fill="white" font-size="16" font-weight="750" pointer-events="none">${id}</text><text x="${c.x}" y="${c.y+11}" text-anchor="middle" fill="white" font-size="11" pointer-events="none">${escape(d.label)}</text><text x="${c.x}" y="${c.y+28}" text-anchor="middle" fill="#e5f4e8" font-size="11" pointer-events="none">${n} syllabi</text><title>${escape(d.label)} · ${n}份课纲</title></g>`;
    }).join('');
    return renderHeading('05 / Course overlaps','十个方向的课程关联图','连线表示两个方向共用来源的数量，并非文献共引、学科影响力或因果关系。点击节点进入对应的独立阅读目录。')+
      `<div class="map-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="十个研究方向以及共用课程来源的可视化网络"><circle cx="${cx}" cy="${cy}" r="${rr+90}" fill="none" stroke="#e6efe9" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="${rr-70}" fill="none" stroke="#edf3ef" stroke-width="1.2"/>${lines.join('')}${dots}</svg><div class="map-legend">节点大小依据该方向整份保留课纲数量；若某课程支持多个方向，则会在对应来源集合中各出现一次。历史删除的课程不参与本图。</div></div>`;
  }
  function getAudits(){const q=state.auditQ.toLocaleLowerCase().trim();return H.decisions.filter(a=>(state.auditAction==='all'||a.new_action===state.auditAction)&&(!q||[a.source_id,a.title,a.reason,a.source_round,a.new_action].join(' ').toLocaleLowerCase().includes(q)));}
  function auditPage(){
    const actions=[...new Set(H.decisions.map(x=>x.new_action))];
    const counts=actions.map(x=>[x,H.decisions.filter(y=>y.new_action===x).length]);
    return renderHeading('06 / Provenance ledger','233条历史筛选决定','每条保留旧状态、新处理方式及理由；用于追溯筛选决策，不属于日常的89份课纲清单。',`<a href="./assets/audit.csv" download class="btn">下载全部审计 CSV</a>`)+
      `<div class="notice"><b>不要混淆：</b>“整份保留”“仅保留相关单元”“合并”“删除”是编辑处理方式；A/B/C描述来源资料是否可见，不是相关性评分。公开文件不包含文献全文或收费课程资料。</div>`+
      `<div class="fieldgroup" style="margin:15px 0">${counts.map(([a,n])=>`<span class="pill soft">${escape(a)}：${n}</span>`).join('')}</div>`+
      `<div class="searchfilters"><label class="searchbox"><i>⌕</i><input type="search" id="auditSearch" value="${escape(state.auditQ)}" placeholder="来源编号、课程、删除原因…" aria-label="检索历史审核"></label><select id="auditAction" class="select"><option value="all">全部处理方式</option>${actions.map(a=>`<option value="${escape(a)}" ${state.auditAction===a?'selected':''}>${escape(a)}</option>`).join('')}</select></div><div class="resultline" id="auditResultInfo"></div><div class="tablewrap"><table class="audit-table"><thead><tr><th>来源</th><th>课程原名</th><th>历史处理</th><th>最终处理</th><th>理由</th><th>原始来源</th></tr></thead><tbody id="auditRows"></tbody></table></div><div class="pager" id="auditPager"></div>`;
  }
  function drawAudits(){const list=getAudits(),max=Math.max(1,Math.ceil(list.length/17));state.auditPage=Math.min(max,state.auditPage);$('auditResultInfo').innerHTML=`匹配 <strong>${list.length}</strong> 条记录 · 全部历史决定 233 条`;$('auditRows').innerHTML=list.slice((state.auditPage-1)*17,state.auditPage*17).map(a=>`<tr><td><span class="mono">${escape(a.source_id)}</span></td><td class="audit-title">${escape(a.title)}</td><td>${escape(a.old_action)}</td><td>${escape(a.new_action)}</td><td class="audit-reason">${escape(a.reason)}</td><td>${link(a.url,'官网')}</td></tr>`).join('');pages($('auditPager'),state.auditPage,max,'audit');}
  function usagePage(){return renderHeading('07 / Workflow','如何把这些 syllabus 用起来','本平台是来源索引和阅读提取工作台，而不是已编写完成的博士资格考书单。')+
      `<div class="detailcolumns"><div class="detailpanel"><div class="eyebrow">STEP 1</div><h3>按独立研究方向入手</h3><p>点击“十个研究方向”，先从自己当前论文最需要的方向开始，例如 T01 婚配、T02 家庭人口学或 T10 社会变迁人口学。</p><a class="btn" href="#directions">进入十方向</a></div><div class="detailpanel"><div class="eyebrow">STEP 2</div><h3>用整份课纲理解知识组织</h3><p>优先阅读与研究紧密相关的完整课纲，比较它们如何组织理论传统、重要争论和每周阅读。站内59条原核心、30条原专题补充都属于最终整份保留。</p><a class="btn" href="#syllabi">查看89份来源</a></div><div class="detailpanel"><div class="eyebrow">STEP 3</div><h3>从局部相关课程只取专题</h3><p>进入30组“相关单元”，只保留与研究直接对应的周次和文献。88条引用包含不同核验程度，必须逐篇核对作者、题名、出版信息及原课程阅读标记。</p><a class="btn" href="#modules">查看专题摘录</a></div><div class="detailpanel"><div class="eyebrow">STEP 4</div><h3>建立十份自己的阅读清单</h3><p>按问题组织核心理论、经验研究和方法，标明“来自原课纲”或“自行补充”；只有确定完整书目信息后再进入正式博士 Reading List。</p><a class="btn" href="#audit">查核来源记录</a></div></div>
      <section class="section panel"><h3 style="margin-top:0">与本地个人工作簿的关系</h3><p>网站公开的是同一版本的来源索引，包含89／30／88／9的结构和233条处理决定。阅读进度、笔记及DOI核验仍应以个人 Excel 工作台或其他本地笔记系统管理；本网站的“收藏”只存于当前浏览器，不会上传或自动同步。</p><p>如需维护内容，请修改最终工作簿的数据，经核对后重新导出静态数据并提交 GitHub。课程原件及学术论文如有版权限制，只保留原站链接与文献元数据，不要直接公开分发。</p></section>`;}
  function drawerSource(id){
    const s=byId.get(id),a=auditById.get(id);
    if(!s){
      if(a)return `<div class="eyebrow">HISTORICAL SOURCE · ${escape(id)}</div><h2>${escape(a.title)}</h2>${cardTag(a.new_action,'gold')}<div class="drawer-info"><b>历史处理理由</b><p>${escape(a.reason)}</p></div><p>${link(a.url)}</p>`;
      return '<div class="empty">没有找到该来源的条目。</div>';
    }
    const isPending=R.pending.some(x=>x.id===id),related=R.modules.filter(m=>m.source_id===id);
    const others=D.syllabi.filter(x=>x.group && x.group===s.group && x.id!==id);
    return `<div class="eyebrow">${isPending?'PENDING SOURCE':'FULL SYLLABUS'} · ${escape(s.id)}</div><h2>${escape(s.title)}</h2><div class="badges">${isPending?cardTag('待补来源','gold'):tierTag(s)}${accessTag(s)}${sourceDirections(s).map(x=>cardTag(x,'soft')).join('')}</div><p>${escape(s.fit || s.use_note || '')}</p><div class="drawer-actions">${safeUrl(s.url)?`<a class="btn primary" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">打开原始 syllabus ↗</a>`:''}<button class="btn" type="button" data-fav="${escape(s.id)}">${favorites.has(s.id)?'★ 已收藏':'☆ 收藏来源'}</button></div><dl class="kv"><dt>学校／机构</dt><dd>${escape(s.institution)}</dd><dt>教师／编制者</dt><dd>${escape(s.instructor||'未列明')}</dd><dt>原课程年份</dt><dd>${escape(s.year||'未注明')}</dd><dt>来源与层级</dt><dd>${escape(s.source_type||'课程来源')} · ${escape(s.level||'待核')}</dd><dt>所属方向</dt><dd>${sourceDirections(s).map(id=>escape(dir(id)?.label||id)).join('、')}</dd><dt>原始核验日期</dt><dd>${escape(s.checked_date||'参见来源档案')}</dd></dl><div class="drawer-info"><b>保留理由／使用建议</b><p>${escape(s.use_note||s.decision_reason||'该来源是目前工作台正式保留的课程或书单条目。')}</p><b>访问及阅读限制</b><p>${escape(s.limitations||'暂无额外说明，需按原链接核实具体阅读。')}</p></div>${others.length?`<h3>同源版本（另${others.length}条）</h3><div class="list-compact">${others.map(x=>`<button type="button" data-source="${escape(x.id)}">${escape(x.id)} · ${escape(x.year)} · ${escape(x.title)}</button>`).join('')}</div>`:''}${related.length?`<h3>摘录单元</h3><div class="list-compact">${related.map(m=>`<button type="button" data-module="${escape(m.module_id)}">${escape(m.module_id)} · ${escape(m.module_subject)}</button>`).join('')}</div>`:''}`;
  }
  function drawerModule(id){const m=moduleById.get(id);if(!m)return '<div class="empty">没有找到这个专题单元。</div>';
    const entries=modulesFor(m);return `<div class="eyebrow">SELECTED MODULE · ${escape(m.module_id)}</div><h2>${escape(m.module_subject)}</h2><div class="badges">${cardTag('只保留相关单元','blue')}${sourceDirections(m).map(x=>cardTag(x,'soft')).join('')}</div><p>${escape(m.selection_reason)}</p><dl class="kv"><dt>来源编号</dt><dd>${escape(m.source_id)}</dd><dt>原课程</dt><dd>${escape(m.source_title)}</dd><dt>机构／年份</dt><dd>${escape(m.institution)} · ${escape(m.year)}</dd><dt>原始位置</dt><dd>${escape(m.unit_location)}</dd><dt>核验状态</dt><dd>${escape(m.fidelity)}</dd><dt>摘录理由</dt><dd>${escape(m.reading_policy||m.selection_reason)}</dd></dl><div class="drawer-actions">${safeUrl(m.url)?`<a class="btn primary" href="${escape(m.url)}" target="_blank" rel="noopener noreferrer">打开原始课程 ↗</a>`:''}</div><h3>${entries.length} 条相关阅读摘录</h3><div class="reading-list">${entries.map(e=>`<article class="reading"><span class="mono">${escape(e.entry_id)} · ${escape(e.location)}</span><b>${escape(e.original_or_transcribed_citation)}</b><p><strong>原阅读标记：</strong>${escape(e.reading_status)}</p><p><strong>本次核验：</strong>${escape(e.source_check)}</p>${e.note?`<p>${escape(e.note)}</p>`:''}${link(e.source_url,'原课程出处')}</article>`).join('')||'<div class="empty">本单元尚无可直接转录的文献条目。</div>'}</div><div class="notice"><b>注意：</b>此处是原课纲转录的候选阅读，不代表已经独立核验作者、出版年份及 DOI。</div>`;
  }
  function showDrawer(kind,id){
    const body=kind==='source'?drawerSource(id):drawerModule(id);
    $('drawerBody').innerHTML=body;$('overlay').hidden=false;$('overlay').classList.add('visible');$('drawer').classList.add('open');$('drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('closeDrawer').focus();state.drawer={kind,id};
  }
  function hideDrawer(){if(!$('drawer').classList.contains('open'))return;$('overlay').classList.remove('visible');$('overlay').hidden=true;$('drawer').classList.remove('open');$('drawer').setAttribute('aria-hidden','true');document.body.style.overflow='';state.drawer=null;}
  function route(){
    hideDrawer();
    const hash=decodeURIComponent(location.hash.slice(1)||'overview');const [path,query]=hash.split('?');
    const params=new URLSearchParams(query||'');
    if(path.startsWith('source/')||path.startsWith('course/')){render('syllabi');showDrawer('source',path.split('/').slice(1).join('/'));return;}
    if(path.startsWith('module/')){render('modules');showDrawer('module',path.split('/').slice(1).join('/'));return;}
    if(path.startsWith('direction/')){render('direction',path.split('/')[1]);return;}
    if(path==='library'){render('syllabi');return;}if(path==='reading'||path==='works'){render('modules');return;}
    if(path==='syllabi'&&params.get('dir'))state.dir=params.get('dir');
    if(path==='modules'&&params.get('dir'))state.moduleDir=params.get('dir');
    render(labels[path]?path:'overview');
  }
  function render(page,id){
    state.pageName=page;
    let html;
    if(page==='overview')html=overview();else if(page==='directions')html=directions();else if(page==='direction')html=directionPage(id);else if(page==='syllabi')html=syllabusPage();else if(page==='modules')html=modulePage();else if(page==='pending')html=pendingPage();else if(page==='map')html=graphPage();else if(page==='audit')html=auditPage();else html=usagePage();
    root.innerHTML=html;
    $('breadcrumb').textContent=page==='direction'?(dir(id)?.en||'Reading field'):(labels[page]||'Overview');
    document.querySelectorAll('[data-nav]').forEach(n=>{const active=n.getAttribute('data-nav')===(page==='direction'?'directions':page);n.classList.toggle('active',active);n.setAttribute('aria-current',active?'page':'false');});
    $('sidebar').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');
    if(page==='syllabi')drawSyllabi();if(page==='modules')drawModules();if(page==='audit')drawAudits();
    window.scrollTo(0,0);
  }
  function csvDownload(name,rows,cols){
    const quote=v=>'"'+String(v==null?'':(Array.isArray(v)?v.join('、'):v)).replace(/"/g,'""')+'"';
    const data=[cols.map(x=>quote(x[1])).join(',')].concat(rows.map(row=>cols.map(x=>quote(row[x[0]])).join(','))).join('\r\n');
    const blob=new Blob(['\ufeff'+data],{type:'text/csv;charset=utf-8'}),object=URL.createObjectURL(blob),a=document.createElement('a');a.href=object;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(object),1200);
  }
  document.addEventListener('click',event=>{
    const x=event.target.closest('[data-dir],[data-go],[data-source],[data-module],[data-fav],[data-tier],[data-page],[data-reset],[data-export]');
    if(!x)return;
    if(x.hasAttribute('data-dir')){go('#direction/'+x.dataset.dir);return;}
    if(x.hasAttribute('data-go')){go(x.dataset.go);return;}
    if(x.hasAttribute('data-source')){showDrawer('source',x.dataset.source);return;}
    if(x.hasAttribute('data-module')){showDrawer('module',x.dataset.module);return;}
    if(x.hasAttribute('data-fav')){const id=x.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();if(state.drawer){showDrawer(state.drawer.kind,state.drawer.id);}else if(state.pageName==='syllabi')drawSyllabi();else render(state.pageName);return;}
    if(x.hasAttribute('data-tier')){state.tier=x.dataset.tier;state.page=1;render('syllabi');return;}
    if(x.hasAttribute('data-reset')){if(x.dataset.reset==='syllabi'){state.q='';state.dir='all';state.access='all';state.tier='all';state.page=1;render('syllabi')}else{state.moduleQ='';state.moduleDir='all';state.modulePage=1;render('modules')}return;}
    if(x.hasAttribute('data-export')){
      if(x.dataset.export==='syllabi')csvDownload('syllabus-atlas-89-filtered.csv',getSyllabi(),[['id','来源ID'],['title','课程名称'],['institution','学校'],['instructor','教师'],['year','课程年份'],['level','课程层级'],['action','前轮优先级'],['directions','研究方向'],['url','原始来源'],['limitations','使用限制']]);
      else csvDownload('syllabus-atlas-88-reading-excerpts.csv',R.readings,[['entry_id','条目编号'],['module_id','模块编号'],['source_id','原课程编号'],['directions','所属方向'],['original_or_transcribed_citation','引用转录'],['reading_status','原课阅读标记'],['source_check','核验状态'],['source_url','原纲链接']]);
      return;
    }
    if(x.hasAttribute('data-page')){const [which,move]=x.dataset.page.split(':');if(which==='syllabi'){state.page=Math.max(1,state.page+(move==='prev'?-1:1));drawSyllabi();}else if(which==='modules'){state.modulePage=Math.max(1,state.modulePage+(move==='prev'?-1:1));drawModules();}else{state.auditPage=Math.max(1,state.auditPage+(move==='prev'?-1:1));drawAudits();}window.scrollTo({top:0,behavior:'smooth'});}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='syllabusSearch'){state.q=e.target.value;state.page=1;drawSyllabi();}
    if(e.target.id==='moduleSearch'){state.moduleQ=e.target.value;state.modulePage=1;drawModules();}
    if(e.target.id==='auditSearch'){state.auditQ=e.target.value;state.auditPage=1;drawAudits();}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='syllabusDir'){state.dir=e.target.value;state.page=1;drawSyllabi();}
    if(e.target.id==='accessFilter'){state.access=e.target.value;state.page=1;drawSyllabi();}
    if(e.target.id==='moduleDir'){state.moduleDir=e.target.value;state.modulePage=1;drawModules();}
    if(e.target.id==='auditAction'){state.auditAction=e.target.value;state.auditPage=1;drawAudits();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideDrawer();if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-dir]')?.tagName?.toLowerCase()==='g'){e.preventDefault();go('#direction/'+e.target.closest('[data-dir]').dataset.dir);}});
  $('closeDrawer').addEventListener('click',hideDrawer);$('overlay').addEventListener('click',hideDrawer);
  $('menuToggle').addEventListener('click',()=>{const open=!$('sidebar').classList.contains('open');$('sidebar').classList.toggle('open',open);$('menuToggle').setAttribute('aria-expanded',String(open));});
  $('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){state.q=e.target.value;state.dir='all';state.tier='all';state.access='all';state.page=1;go('#syllabi');render('syllabi');}});
  window.addEventListener('hashchange',route);
  route();
})();