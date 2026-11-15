(function () {
  "use strict";
  const D = window.SYLLABUS_DATA;
  if (!D || !Array.isArray(D.resources)) {
    document.body.innerHTML = '<div style="padding:3rem;font:16px sans-serif">资料文件未加载。请确认 assets/data.js 存在。</div>';
    return;
  }
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const url = s => /^https?:\/\/[^\s<>"']+$/i.test(String(s || "")) ? s : "";
  const link = (href, label, cls) => url(href) ? '<a class="' + esc(cls || "text-link") + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>' : "";
  const byId = Object.fromEntries(D.resources.map(x => [x.id, x]));
  const unitById = Object.fromEntries(D.units.map(x => [x.unit_id, x]));
  const unitsFor = id => D.units.filter(x => x.resource_id === id);
  const readsFor = id => D.readings.filter(x => x.resource_id === id);
  const readingSourceIds = [...new Set(D.readings.map(x => x.resource_id))].filter(id => !!byId[id]);
  const levelType = r => /本科|混合层级/.test(r.level) ? "undergraduate" : /(博士|硕士|研究生)/.test(r.level) ? "graduate" : "unknown";
  const hasEast = r => r.east_asia && r.east_asia !== "未特别标注";
  const theme = [
    { name:"社会人口学",short:"社会人口学",letter:"P",c:"#4b827b",t:"#e5f2eb" },
    { name:"婚姻、家庭与生育",short:"婚姻家庭",letter:"F",c:"#b0784c",t:"#fbf0e4" },
    { name:"东亚家庭与社会",short:"东亚家庭",letter:"E",c:"#b66e63",t:"#f9eeea" },
    { name:"分层、教育与财富",short:"社会分层",letter:"S",c:"#6684a4",t:"#ecf1f8" },
    { name:"生命历程与青年",short:"生命历程",letter:"L",c:"#8a7aaf",t:"#f0edf7" },
    { name:"性别、工作与家庭",short:"性别与家庭",letter:"G",c:"#7c9a69",t:"#f0f5e9" },
    { name:"文化、观念与变迁",short:"文化观念",letter:"C",c:"#a18761",t:"#f8f2e7" },
    { name:"人口学方法与模拟",short:"人口学方法",letter:"M",c:"#4b97a1",t:"#e8f5f5" },
    { name:"研究设计、测量与网络",short:"研究设计",letter:"R",c:"#6c838a",t:"#eff2f3" }
  ];
  const state = { view:"overview", query:"", topic:"", status:"", level:"", east:false, extracted:false, round2:false, libraryPage:1, workPage:1, workQuery:"", workDoi:"", mapFocus:"", readingId:readingSourceIds.includes("S072") ? "S072" : readingSourceIds[0] };
  const labels = { overview:"Overview", library:"Syllabus archive", map:"Knowledge map", reading:"Reading paths", works:"Bibliography", sources:"Sources & methods" };
  const perPage = 12;
  function statusPill(r) {
    const name = r.status === "A" ? "A · 已见阅读" : r.status === "B" ? "B · 部分材料" : "C · 待补正文";
    return '<span class="pill ' + (r.status === "A" ? "" : r.status === "B" ? "amber" : "terra") + '">' + esc(name) + '</span>';
  }
  function badges(r) {
    return statusPill(r) + (hasEast(r) ? '<span class="pill east">东亚／亚洲相关</span>' : "") + (r.round_added === 2 ? '<span class="pill new">第二轮</span>' : "");
  }
  function topicMeta(name) { return theme.find(t => t.name === name) || theme[0]; }
  function sourceCount(name) { return D.resources.filter(r => r.topic === name).length; }
  function sourceGradeCount(name) { return D.resources.filter(r => r.topic === name && r.status === "A").length; }
  function init() {
    $("kpi-resources").textContent = D.stats.resources;
    $("kpi-domains").textContent = theme.length;
    $("kpi-units").textContent = D.stats.units;
    $("kpi-readings").textContent = D.stats.readings;
    theme.forEach(t => {
      const o = document.createElement("option"); o.value = t.name; o.textContent = t.name; $("topic-filter").appendChild(o);
    });
    readingSourceIds.sort((a,b) => a.localeCompare(b));
    readingSourceIds.forEach(id => {
      const r=byId[id];const o=document.createElement("option");o.value=id;o.textContent=id+" · "+r.title; $("reading-source-select").appendChild(o);
    });
    $("reading-source-select").value = state.readingId;
    renderOverview(); renderLibrary(); renderMap(); renderReading(); renderWorks(); renderSources(); bindEvents();
    route();
  }
  function renderOverview() {
    $("topic-grid").innerHTML = theme.map(t => {
      const n=sourceCount(t.name), a=sourceGradeCount(t.name);
      return '<button class="topic-card" type="button" data-topic="' + esc(t.name) + '" style="--topic-color:'+t.c+';--topic-tint:'+t.t+'"><div class="topic-head"><span class="topic-icon">'+t.letter+'</span><span class="topic-count">'+n+' 条记录</span></div><div class="topic-title">'+esc(t.name)+'</div><div class="topic-foot"><span>A级可见 '+a+' / '+n+'</span><span>探索 ↗</span></div><div class="topic-progress" aria-label="A级资料占比"><i style="width:'+(100*a/n).toFixed(1)+'%"></i></div></button>';
    }).join("");
    const max=Math.max(...theme.map(t => sourceCount(t.name)));
    $("topic-bars").innerHTML = theme.map(t => {
      const n=sourceCount(t.name);
      return '<div class="bar-row"><label title="'+esc(t.name)+'">'+esc(t.short)+'</label><div class="bar-track"><div class="bar-fill" style="width:'+(100*n/max).toFixed(1)+'%;background:'+t.c+'"></div></div><b>'+n+'</b></div>';
    }).join("");
  }
  function matchesLibrary() {
    const q=state.query.toLocaleLowerCase().trim();
    return D.resources.filter(r => {
      if(state.topic && r.topic !== state.topic) return false;
      if(state.status && r.status !== state.status) return false;
      if(state.level && levelType(r) !== state.level) return false;
      if(state.east && !hasEast(r)) return false;
      if(state.extracted && !readsFor(r.id).length) return false;
      if(state.round2 && r.round_added !== 2) return false;
      const hay=[r.id,r.title,r.institution,r.teacher,r.topic,r.summary,r.year,r.east_asia,r.note].join(" ").toLocaleLowerCase();
      return !q || hay.includes(q);
    }).sort((a,b) => a.id.localeCompare(b.id));
  }
  function resourceCard(r) {
    const count=readsFor(r.id).length;
    return '<article class="resource-card" role="button" tabindex="0" data-open-id="'+esc(r.id)+'" aria-label="查看'+esc(r.title)+'详情">'
      +'<div class="card-top"><span class="card-id">'+r.id+'</span><div class="badges">'+badges(r)+'</div></div>'
      +'<h3>'+esc(r.title)+'</h3><div class="meta-line"><span>'+esc(r.institution)+'</span><span>· '+esc(r.year)+'</span></div>'
      +'<p>'+esc(r.summary || "来源信息与课程描述待补充")+'</p>'
      +'<div class="card-bottom"><span>'+esc(r.level)+' · '+esc(r.topic)+(count ? " · "+count+"条试提取阅读" : "")+'</span><button type="button" data-open-id="'+esc(r.id)+'">查看详情 ↗</button></div></article>';
  }
  function pagination(nodeId, page, max, target) {
    if(max<=1){$(nodeId).innerHTML="";return;}
    $(nodeId).innerHTML='<button type="button" data-page-action="'+target+'-prev" '+(page===1?"disabled":"") +'>上一页</button><span>'+page+' / '+max+'</span><button type="button" data-page-action="'+target+'-next" '+(page===max?"disabled":"")+'>下一页</button>';
  }
  function renderLibrary() {
    const arr=matchesLibrary(), max=Math.max(1,Math.ceil(arr.length/perPage));
    state.libraryPage=Math.min(state.libraryPage,max);
    const start=(state.libraryPage-1)*perPage;
    $("library-count").innerHTML = '匹配 <b>'+arr.length+'</b> 条资料记录 · 全库 '+D.stats.resources+' 条';
    $("library-results").innerHTML=arr.length ? arr.slice(start,start+perPage).map(resourceCard).join("") : '<div class="empty" style="grid-column:1/-1">未找到匹配课程。可清除部分筛选条件后再试。</div>';
    pagination("library-pagination",state.libraryPage,max,"library");
  }
  function renderMap() {
    const svg=$("map-svg"),tip=$("map-tooltip"),stage=$("map-stage");
    const ns="http://www.w3.org/2000/svg";
    const coords=[[193,115],[535,108],[873,115],[193,273],[535,273],[873,273],[193,433],[535,433],[873,433]];
    svg.setAttribute("viewBox","0 0 1060 540");
    svg.innerHTML="";
    const el=(type,attrs,parent)=>{const x=document.createElementNS(ns,type);Object.entries(attrs||{}).forEach(([k,v])=>x.setAttribute(k,String(v)));(parent||svg).appendChild(x);return x;};
    theme.forEach((t,i)=>{
      const pair=coords[i],cx=pair[0],cy=pair[1];
      const items=D.resources.filter(r => r.topic===t.name);
      const lines=el("g",{"class":"graph-lines","data-group":String(i)});
      const nodes=el("g",{"class":"graph-nodes","data-group":String(i)});
      items.forEach((r,j)=>{
        const ring=Math.floor(j/10), k=j%10, n=Math.min(10,items.length-ring*10);
        const theta=-Math.PI/2+(Math.PI*2*(k/n))+i*.085;
        const rad=62+ring*22+(j%2)*5;
        const x=cx+rad*Math.cos(theta),y=cy+rad*Math.sin(theta);
        el("line",{x1:cx,y1:cy,x2:x,y2:y,"class":"graph-edge"},lines);
        const node=el("g",{"class":"graph-course","data-resource":r.id,tabindex:"0",role:"button","aria-label":r.title},nodes);
        el("circle",{cx:x,cy:y,r:r.status==="A"?"6":"5.4",fill:r.status==="A"?t.c:"#c8a66f",stroke:"#fff","stroke-width":"1.2"},node);
        el("title",{},node).textContent=r.id+" · "+r.title;
      });
      const parent=el("g",{"class":"graph-topic","data-topic":t.name,tabindex:"0",role:"button","aria-label":t.name+"，"+items.length+"条记录"});
      el("circle",{cx:cx,cy:cy,r:43,stroke:t.c,fill:t.t},parent);
      el("text",{x:cx,y:cy-3,"text-anchor":"middle","font-size":"12.2"},parent).textContent=t.short;
      el("text",{x:cx,y:cy+15,"text-anchor":"middle","class":"graph-count"},parent).textContent=items.length+" records";
      el("title",{},parent).textContent=t.name+" · "+items.length+"条记录";
    });
    applyMapFocus();
    svg.onmousemove=function(e){
      const node=e.target.closest("[data-resource]");
      if(!node){tip.style.display="none";return;}
      const r=byId[node.getAttribute("data-resource")];
      if(!r)return;
      tip.innerHTML='<strong>'+esc(r.title)+'</strong><span>'+esc(r.institution)+' · '+r.id+' · '+esc(r.status)+'</span>';
      tip.style.display="block";
      const box=stage.getBoundingClientRect();
      tip.style.left=Math.min(Math.max(4,e.clientX-box.left+13),Math.max(4,box.width-286))+"px";
      tip.style.top=Math.min(Math.max(4,e.clientY-box.top+8),Math.max(4,box.height-90))+"px";
    };
    svg.onmouseleave=function(){tip.style.display="none";};
    svg.onclick=function(e){
      const r=e.target.closest("[data-resource]"),t=e.target.closest("[data-topic]");
      if(r){location.hash="course/"+r.getAttribute("data-resource");}
      else if(t){state.mapFocus=t.getAttribute("data-topic");applyMapFocus();}
    };
    svg.onkeydown=function(e){
      if(e.key==="Enter"||e.key===" "){
        const target=e.target.closest("[data-resource],[data-topic]");
        if(target){e.preventDefault();target.dispatchEvent(new MouseEvent("click",{bubbles:true}));}
      }
    };
  }
  function applyMapFocus() {
    const name=state.mapFocus, focus=!!name;
    const topic=theme.find(t=>t.name===name);
    $("map-focus-title").textContent=focus?name:"全部9个研究领域";
    $("map-focus-description").textContent=focus?"此领域目前收录 "+sourceCount(name)+" 条资料记录，其中 "+sourceGradeCount(name)+" 条为 A 类可见阅读；点击右侧进入筛选。":"92个小节点为资料与版本记录（不是92门独立课程）；颜色及连线展示人工学科归类关系。";
    $("map-focus-open").textContent=focus?"筛选该领域课程 ↗":"浏览全部课程 ↗";
    $("map-svg").querySelectorAll("[data-group]").forEach(g => {g.style.opacity=!focus||Number(g.getAttribute("data-group"))===theme.indexOf(topic)?"1":".17";});
    $("map-svg").querySelectorAll(".graph-topic").forEach(g=>{const chosen=!focus||g.getAttribute("data-topic")===name;g.style.opacity=chosen?"1":".3";});
  }
  function renderReading() {
    const r=byId[state.readingId];
    if(!r){$("reading-results").innerHTML='<div class="empty">尚无已提取的课程阅读。</div>';return;}
    const units=unitsFor(r.id),edges=readsFor(r.id);
    $("reading-source-select").value=r.id;
    $("reading-source-info").innerHTML='<b>'+esc(r.title)+'</b><br>'+esc(r.institution)+' · '+esc(r.year)+'<br><br>'+esc(r.extraction_scope||"选择性试提取，非完整课纲")+"<br><br>"+link(r.url,"原始课程来源");
    $("reading-summary").innerHTML='<b>'+units.length+' 个原主题单元</b><br>'+edges.length+' 条本次整理的阅读关联<br>未提取的部分不在此处显示。';
    const unassigned=edges.filter(e=>!e.unit_id || !unitById[e.unit_id]);
    const timeline=units.map(u=>{
      const rr=edges.filter(e=>e.unit_id===u.unit_id);
      return '<article class="unit"><small>'+esc(u.source_unit)+' · '+esc(u.unit_id)+'</small><h3>'+esc(u.original_heading)+'</h3><div class="unit-meta">整理者标签：'+esc(u.tags||"未设置")+' · 已试提取 '+rr.length+' 条阅读</div>'
      +(rr.length?rr.map(readingItem).join(""):'<p style="color:#83938c;font-size:11px;margin:12px 0 0">该单元暂未录入具体阅读，并不表示课程没有安排阅读。</p>')
      +'</article>';
    }).join("");
    if(unassigned.length)timeline.concat();
    const extras=unassigned.length?'<article class="unit"><small>课程级别 · 未匹配原周次</small><h3>其他已提取阅读</h3><div class="unit-meta">原始资料未明确将以下阅读安排在某个周次，故不自行分配单元。</div>'+unassigned.map(readingItem).join("")+'</article>':"";
    $("reading-results").innerHTML='<div class="panel" style="padding:20px 24px"><div class="page-eyebrow">Selected source · '+esc(r.id)+'</div><h2 style="font-size:17px;margin:8px 0 6px">'+esc(r.title)+'</h2><p style="font-size:11px;color:#81928d;margin:0">下面保留原课纲主题，不将编辑补充标签冒充课程原文。</p></div><div class="timeline">'+timeline+extras+'</div>';
  }
  function readingItem(e) {
    const d=e.doi_as_listed?'<p>DOI（原课纲列示，未独立核验）：'+link("https://doi.org/"+e.doi_as_listed,e.doi_as_listed)+'</p>':"";
    return '<div class="reading-item"><span class="pill neutral">'+esc(e.requirement||"阅读要求未细分")+'</span><h4>'+esc(e.title_as_listed)+'</h4><p>'+esc(e.authors_as_listed)+' ('+esc(e.year_as_listed)+')'+(e.publication_as_listed?" · "+esc(e.publication_as_listed):"")+'</p>'+d+'<p>'+link(e.source_url,"核对原始出处")+'</p></div>';
  }
  function matchesWorks() {
    const q=state.workQuery.toLocaleLowerCase().trim();
    return D.works.filter(w=>{
      const yes=!!w.doi_first_source;
      if(state.workDoi==="yes"&&!yes||state.workDoi==="no"&&yes)return false;
      const hay=[w.work_id,w.title,w.authors_first_source,w.year_first_source,w.source_ids].join(" ").toLocaleLowerCase();
      return !q||hay.includes(q);
    }).sort((a,b)=>a.work_id.localeCompare(b.work_id));
  }
  function renderWorks() {
    const arr=matchesWorks(),size=15,max=Math.max(1,Math.ceil(arr.length/size));
    state.workPage=Math.min(state.workPage,max);
    $("works-count").innerHTML='匹配 <b>'+arr.length+'</b> 条初步书目实体 · 共 '+D.works.length+' 条';
    const page=arr.slice((state.workPage-1)*size,state.workPage*size);
    $("works-results").innerHTML=page.length?page.map(w=>{
      const ss=w.source_ids.split(/[;,]\s*/).filter(Boolean), id=ss[0];
      return '<article class="reference"><div class="ref-id">'+esc(w.work_id)+'</div><div><h3>'+esc(w.title)+'</h3><p>'+esc(w.authors_first_source)+' · '+esc(w.year_first_source)+'</p><p>原课程：'+esc(ss.join("、")||"见关联表")+(w.doi_first_source?' · '+link("https://doi.org/"+w.doi_first_source,"DOI（课纲所列）"):"")+'</p></div><button type="button" data-open-id="'+esc(id)+'">查看课程 ↗</button></article>';
    }).join(""):'<div class="empty">没有匹配的文献条目。</div>';
    pagination("works-pagination",state.workPage,max,"works");
  }
  function renderSources() {
    $("source-list").innerHTML=D.portals.map(p=>'<article class="source-card"><small>'+esc(p.id)+' · '+esc(p.type)+'</small><h3>'+esc(p.name)+'</h3><p>'+esc(p.note)+'</p>'+link(p.url,"访问来源入口")+'</article>').join("");
  }
  function showView(view) {
    if(!labels[view])view="overview";
    state.view=view;
    document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+view));
    document.querySelectorAll("[data-nav]").forEach(el=>{const active=el.getAttribute("data-nav")===view;el.classList.toggle("active",active);el.setAttribute("aria-current",active?"page":"false");});
    $("breadcrumb-current").textContent=labels[view];
    $("sidebar").classList.remove("open");$("mobile-toggle").setAttribute("aria-expanded","false");
    window.scrollTo({top:0,behavior:"instant"});
  }
  function route() {
    const h=decodeURIComponent(location.hash.slice(1).trim()||"overview");
    if(h.indexOf("course/")===0){
      const id=h.slice(7);showView("library");if(byId[id])openDrawer(id);else hideDrawer();return;
    }
    hideDrawer();showView(labels[h]?h:"overview");
  }
  function navigate(view) {location.hash=view; if(location.hash==="#"+view)route();}
  function openDrawer(id) {
    const r=byId[id];if(!r)return;
    const us=unitsFor(id),rr=readsFor(id);
    $("drawer-label").textContent="SOURCE RECORD · "+id;
    $("drawer-body").innerHTML='<div class="badges">'+badges(r)+'</div><h2 id="drawer-title">'+esc(r.title)+'</h2><p style="font-size:12px;color:#758b81;line-height:1.8">'+esc(r.summary)+'</p>'
      +'<dl class="resource-details"><dt>学校 / 单位</dt><dd>'+esc(r.institution)+'</dd><dt>教师</dt><dd>'+esc(r.teacher||"原资料未列明")+'</dd><dt>课程年份</dt><dd>'+esc(r.year)+'</dd><dt>层级及类型</dt><dd>'+esc(r.level)+' · '+esc(r.type)+'</dd><dt>研究领域</dt><dd>'+esc(r.topic)+'</dd><dt>区域关联</dt><dd>'+esc(r.east_asia)+'</dd><dt>阅读可见性</dt><dd>'+esc(r.reading_visibility)+'</dd><dt>原件是否归档</dt><dd>'+(r.original_saved?"已归档":"未归档（仅保留外部链接）")+'</dd><dt>资料核验时间</dt><dd>'+esc(r.checked)+'</dd></dl>'
      +'<div class="drawer-actions">'+(url(r.url)?'<a class="primary-button" href="'+esc(r.url)+'" target="_blank" rel="noopener">打开原始课程 ↗</a>':"")+(r.portal_url?'<a class="outline-button" href="'+esc(r.portal_url)+'" target="_blank" rel="noopener">院系 / 教师入口 ↗</a>':"")+(rr.length?'<button class="outline-button" data-reading-id="'+id+'">浏览已提取阅读</button>':"")+'</div>'
      +'<div class="drawer-note"><b>版本与访问备注</b><br>'+esc(r.note||"来源表未列额外限制。")+'<br><br><b>整理范围</b><br>'+esc(r.extraction_scope||"未逐篇提取")+'。A/B/C描述可见程度，不是课程质量评级。</div>'
      +(us.length?'<section class="drawer-units"><h3>已整理的原课程主题（'+us.length+'）</h3>'+us.map(u=>'<div class="drawer-unit"><small>'+esc(u.source_unit)+' · '+esc(u.unit_id)+'</small><strong>'+esc(u.original_heading)+'</strong><small>整理者标签：'+esc(u.tags)+'</small></div>').join("")+'</section>':"");
    $("drawer-backdrop").classList.add("visible");$("drawer").classList.add("visible");$("drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("drawer-close").focus();
  }
  function hideDrawer() {
    $("drawer-backdrop").classList.remove("visible");$("drawer").classList.remove("visible");$("drawer").setAttribute("aria-hidden","true");document.body.style.overflow="";
  }
  function clearFilters() {
    state.query="";state.topic="";state.status="";state.level="";state.east=false;state.extracted=false;state.round2=false;state.libraryPage=1;
    ["library-search","topic-filter","status-filter","level-filter"].forEach(id=>$(id).value="");
    ["east-only","extracted-only","round2-only"].forEach(id=>$(id).checked=false);
    renderLibrary();
  }
  function filterTopic(name) {
    clearFilters();state.topic=name;$("topic-filter").value=name;navigate("library");renderLibrary();
  }
  function saveCSV() {
    const fields=[["id","编号"],["topic","研究领域"],["title","课程原名"],["institution","机构"],["year","年份"],["level","课程层级"],["status","核验状态"],["east_asia","区域关联"],["teacher","教师"],["url","原始链接"],["note","来源备注"]];
    const quote=s=>'"'+String(s==null?"":s).replace(/"/g,'""')+'"';
    const rows=[fields.map(f=>quote(f[1])).join(",")].concat(matchesLibrary().map(r=>fields.map(f=>quote(r[f[0]])).join(",")));
    const blob=new Blob(["\uFEFF"+rows.join("\r\n")],{type:"text/csv;charset=utf-8"});
    const href=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=href;a.download="syllabus-atlas-filtered-2026-11-15.csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);
  }
  function bindEvents() {
    window.addEventListener("hashchange",route);
    document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>navigate(b.getAttribute("data-nav"))));
    document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.getAttribute("data-go"))));
    document.addEventListener("click",function(e){
      const topic=e.target.closest("[data-topic]"),resource=e.target.closest("[data-open-id]"),read=e.target.closest("[data-reading-id]"),page=e.target.closest("[data-page-action]");
      if(topic && !topic.closest("#map-svg")){filterTopic(topic.getAttribute("data-topic"));return;}
      if(resource){e.stopPropagation();const id=resource.getAttribute("data-open-id");if(byId[id])location.hash="course/"+id;return;}
      if(read){state.readingId=read.getAttribute("data-reading-id");renderReading();navigate("reading");return;}
      if(page){
        const act=page.getAttribute("data-page-action");
        if(act==="library-prev")state.libraryPage=Math.max(1,state.libraryPage-1);
        if(act==="library-next")state.libraryPage+=1;
        if(act==="works-prev")state.workPage=Math.max(1,state.workPage-1);
        if(act==="works-next")state.workPage+=1;
        if(act.startsWith("library"))renderLibrary();else renderWorks();
        window.scrollTo({top:0,behavior:"smooth"});
      }
    });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape" && $("drawer").classList.contains("visible")){navigate("library");return;}
      if(e.target.matches("[data-open-id]")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();location.hash="course/"+e.target.getAttribute("data-open-id");}
    });
    $("drawer-backdrop").addEventListener("click",()=>navigate("library"));
    $("drawer-close").addEventListener("click",()=>navigate("library"));
    $("mobile-toggle").addEventListener("click",()=>{
      const open=!$("sidebar").classList.contains("open");$("sidebar").classList.toggle("open",open);$("mobile-toggle").setAttribute("aria-expanded",String(open));
    });
    $("global-search").addEventListener("keydown",function(e){if(e.key==="Enter"){state.query=this.value;$("library-search").value=state.query;state.libraryPage=1;renderLibrary();navigate("library");}});
    $("library-search").addEventListener("input",function(){state.query=this.value;state.libraryPage=1;renderLibrary();});
    $("topic-filter").addEventListener("change",function(){state.topic=this.value;state.libraryPage=1;renderLibrary();});
    $("status-filter").addEventListener("change",function(){state.status=this.value;state.libraryPage=1;renderLibrary();});
    $("level-filter").addEventListener("change",function(){state.level=this.value;state.libraryPage=1;renderLibrary();});
    [["east-only","east"],["extracted-only","extracted"],["round2-only","round2"]].forEach(pair=>$(pair[0]).addEventListener("change",function(){state[pair[1]]=this.checked;state.libraryPage=1;renderLibrary();}));
    $("clear-filters").addEventListener("click",clearFilters);
    $("csv-export").addEventListener("click",saveCSV);
    $("map-reset").addEventListener("click",()=>{state.mapFocus="";applyMapFocus();});
    $("map-focus-open").addEventListener("click",()=>filterTopic(state.mapFocus));
    $("reading-source-select").addEventListener("change",function(){state.readingId=this.value;renderReading();});
    $("works-search").addEventListener("input",function(){state.workQuery=this.value;state.workPage=1;renderWorks();});
    $("works-doi-filter").addEventListener("change",function(){state.workDoi=this.value;state.workPage=1;renderWorks();});
  }
  init();
})();