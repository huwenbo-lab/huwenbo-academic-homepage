(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const asText = value => Array.isArray(value) ? value.map(asText).filter(Boolean).join('；') : value && typeof value === 'object' ? Object.values(value).map(asText).filter(Boolean).join('；') : String(value ?? '');
  const externalUrl = value => { try { const url = new URL(String(value)); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const externalLink = (url, label, className = '') => { const safe = externalUrl(url); return safe ? `<a href="${escape(safe)}" target="_blank" rel="noopener noreferrer"${className ? ` class="${escape(className)}"` : ''}>${label}</a>` : ''; };
  const data = window.READING_LIBRARY;
  if (!data || !Array.isArray(data.works)) {
    $('resultCount').textContent = '阅读清单暂未载入。';
    $('readingCards').innerHTML = '<div class="empty-state"><h3>暂时无法载入阅读清单</h3><p>请刷新页面重试，也可以下载完整阅读包离线阅读。</p><a class="button" href="./">重新载入</a></div>';
    return;
  }

  const directions = [...(data.directions || [])].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const directionById = new Map(directions.map(direction => [String(direction.id), direction]));
  const directionName = direction => asText(direction?.name || direction?.label || direction?.title || direction?.id);
  const topics = [...(data.topics || [])].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const topicById = new Map(topics.map(topic => [String(topic.id), topic]));
  const topicDirection = topic => asText(topic?.direction || String(topic?.id || '').split('.')[0]);
  const topicName = topic => asText(topic?.title || topic?.name || topic?.id);
  const sourceById = new Map((data.source_audit || []).map(source => [String(source.source_id), source]));
  const works = data.works.map((work, index) => ({...work, id:String(work.id || `work-${index + 1}`), mappings:Array.isArray(work.mappings) ? work.mappings.map(mapping => ({...mapping,priority:mapping.priority === '深化' ? '专题深化' : mapping.priority})) : [], source_links:Array.isArray(work.source_links) ? work.source_links : []}));
  const workById = new Map(works.map(work => [work.id, work]));
  const authorName = author => author.literal || author.name || [author.family, author.given].filter(Boolean).join(', ');
  const authorLine = work => ((work.authors || []).map(authorName).filter(Boolean).join('; ') || '作者未列明') + ((work.authors || []).length && work.authors.every(author => author.creatorType === 'editor') ? ' (eds.)' : '');
  const normalize = text => asText(text).normalize('NFKC').toLocaleLowerCase().replace(/[‐‑–—]/g, '-');
  const searchIndex = new Map(works.map(work => [work.id, normalize([
    work.title, authorLine(work), work.year, work.container, work.doi,
    ...work.mappings.flatMap(mapping => [mapping.direction, mapping.topic, topicName(topicById.get(mapping.topic)), mapping.reason]),
    ...work.source_links.flatMap(source => [source.source_id, source.location])
  ].join(' '))]));
  const priorities = ['all', '第一轮', '专题深化', '方法工具'];
  const progressStatuses = ['not-started','planned','reading','done'];
  const progressLabels = {'not-started':'未开始','planned':'计划读','reading':'正在读','done':'已读完'};
  const progressKey = 'syllabusAtlas:readingProgress:v1';
  function loadReadingProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(progressKey) || '{}');
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return Object.create(null);
      const clean = Object.create(null);
      for (const [id,status] of Object.entries(raw)) {
        if (workById.has(id) && progressStatuses.includes(status) && status !== 'not-started') clean[id] = status;
      }
      return clean;
    } catch { return Object.create(null); }
  }
  let readingProgress = loadReadingProgress();
  const progressFor = id => readingProgress[id] || 'not-started';
  function saveReadingProgress() {
    try {
      localStorage.setItem(progressKey,JSON.stringify(readingProgress));
      return true;
    } catch {
      toast('无法保存到本机浏览器，请及时导出 JSON 备份');
      return false;
    }
  }
  function progressSelectFor(work) {
    const current = progressFor(work.id);
    return '<label class="card-progress"><span>我的进度</span><select data-progress-id="' + escape(work.id) + '" aria-label="' + escape(work.title) + ' 的阅读状态">'
      + progressStatuses.map(status => '<option value="' + status + '"' + (current === status ? ' selected' : '') + '>' + progressLabels[status] + '</option>').join('')
      + '</select></label>';
  }
  function renderProgress() {
    const counts = {planned:0,reading:0,done:0};
    for (const work of works) {
      const status = progressFor(work.id);
      if (counts[status] !== undefined) counts[status] += 1;
    }
    const percent = works.length ? Math.round(100*counts.done/works.length) : 0;
    $('progressSummary').textContent = '已读完 ' + counts.done + ' / ' + works.length + ' 部 · ' + percent + '%';
    $('progressBreakdown').textContent = '计划读 ' + counts.planned + ' · 正在读 ' + counts.reading + ' · 已读完 ' + counts.done;
    $('progressBar').style.width = percent + '%';
    $('progressTrack').setAttribute('aria-valuenow',String(percent));
  }

  const pageSize = 12;
  const defaults = {direction:'all', topic:'all', priority:'all', progress:'all', query:'', sort:'reading', page:1};
  let state = {...defaults};
  let filtered = [];
  let searchTimer;
  let toastTimer;

  function readLocation() {
    const params = new URLSearchParams(location.search);
    state = {...defaults, direction:params.get('direction') || 'all', topic:params.get('topic') || 'all', priority:params.get('priority') || 'all', progress:params.get('progress') || 'all', query:params.get('q') || '', sort:params.get('sort') || 'reading', page:Number(params.get('page') || 1)};
    if (!directionById.has(state.direction)) state.direction = 'all';
    if (!topicById.has(state.topic)) state.topic = 'all';
    if (state.topic !== 'all') state.direction = topicDirection(topicById.get(state.topic));
    if (!priorities.includes(state.priority)) state.priority = 'all';
    if (state.progress !== 'all' && !progressStatuses.includes(state.progress)) state.progress = 'all';
    if (!['reading', 'newest', 'oldest', 'author'].includes(state.sort)) state.sort = 'reading';
    if (!Number.isInteger(state.page) || state.page < 1) state.page = 1;
  }
  function writeLocation() {
    const params = new URLSearchParams();
    if (state.direction !== 'all') params.set('direction', state.direction);
    if (state.topic !== 'all') params.set('topic', state.topic);
    if (state.priority !== 'all') params.set('priority', state.priority);
    if (state.progress !== 'all') params.set('progress', state.progress);
    if (state.query) params.set('q', state.query);
    if (state.sort !== 'reading') params.set('sort', state.sort);
    if (state.page > 1) params.set('page', String(state.page));
    const query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? `?${query}` : '') + location.hash);
  }
  function scopedMappings(work, usePriority = true) {
    return work.mappings.filter(mapping =>
      (state.direction === 'all' || mapping.direction === state.direction) &&
      (state.topic === 'all' || mapping.topic === state.topic) &&
      (!usePriority || state.priority === 'all' || mapping.priority === state.priority));
  }
  function matchesSearch(work) {
    const terms = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    return terms.every(term => searchIndex.get(work.id).includes(term));
  }
  function directionWorks(id, priority = '') {
    return works.filter(work => work.mappings.some(mapping => (id === 'all' || mapping.direction === id) && (!priority || mapping.priority === priority)));
  }
  function mappingOrder(a, b) {
    const rank = {'第一轮':0,'专题深化':1,'方法工具':2};
    const directionDifference = String(a.direction).localeCompare(String(b.direction));
    const priorityDifference = (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
    const sequenceDifference = (Number(a.sequence) || 999) - (Number(b.sequence) || 999);
    const topicDifference = String(a.topic).localeCompare(String(b.topic));
    return directionDifference || priorityDifference || (a.priority === '第一轮' && b.priority === '第一轮' ? sequenceDifference || topicDifference : topicDifference || sequenceDifference);
  }
  function orderedMappings(work) { return scopedMappings(work).sort(mappingOrder); }
  function sortWorks(a, b) {
    if (state.sort === 'newest') return (Number(b.year) || 0) - (Number(a.year) || 0) || a.title.localeCompare(b.title);
    if (state.sort === 'oldest') return (Number(a.year) || 0) - (Number(b.year) || 0) || a.title.localeCompare(b.title);
    if (state.sort === 'author') return authorLine(a).localeCompare(authorLine(b)) || (Number(a.year) || 0) - (Number(b.year) || 0);
    const am = orderedMappings(a)[0] || {}, bm = orderedMappings(b)[0] || {};
    return mappingOrder(am, bm) || a.title.localeCompare(b.title);
  }
  function publicationText(work) {
    if (work.type === 'book') {
      let edition = asText(work.edition);
      if (/^\d+$/.test(edition)) { const n = Number(edition); const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({1:'st',2:'nd',3:'rd'}[n % 10] || 'th'); edition = `${n}${suffix} ed.`; }
      else if (/^\d+(st|nd|rd|th)$/i.test(edition)) edition += ' ed.';
      return [edition,asText(work.container || work.publisher)].filter(Boolean).join(', ');
    }
    if (work.type === 'bookSection') return [work.container ? `In ${asText(work.container)}${work.pages ? ` (pp. ${asText(work.pages)})` : ''}` : '',asText(work.publisher)].filter(Boolean).join('. ');
    const container = asText(work.container);
    const volume = asText(work.volume), issue = asText(work.issue), pages = asText(work.pages);
    const serial = `${volume}${issue ? `(${issue})` : ''}`;
    return [container, serial, pages].filter(Boolean).join(', ');
  }
  function fullCitation(work) {
    if (work.citation) return work.citation + (primaryUrl(work) ? ' ' + primaryUrl(work) : '');
    const publication = publicationText(work);
    const doi = asText(work.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
    return `${authorLine(work)} (${asText(work.year || 'n.d.')}), ${asText(work.title)}.${publication ? ` ${publication}.` : ''}${doi ? ` https://doi.org/${doi}` : work.url ? ` ${work.url}` : ''}`;
  }
  function primaryUrl(work) {
    const doi = asText(work.doi).trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
    return doi ? externalUrl(`https://doi.org/${doi}`) : externalUrl(work.url || work.verification_url);
  }
  function renderStatic() {
    const version = asText(data.version || '2026-11-20');
    $('sideVersion').textContent = version.replace(/-/g, '.');
    $('footerVersion').textContent = version;
    if (data.scope_note) $('scopeNote').textContent = asText(data.scope_note);
    if (data.priority_note) $('priorityNote').textContent = asText(data.priority_note).replace('source_links.original_reading_status','作品出处');
    $('libraryStats').innerHTML = [[works.length,'独立作品'],[directions.length,'阅读方向'],[topics.length,'知识专题']].map(([count,label]) => `<div><dt>${label}</dt><dd>${count}</dd></div>`).join('');
    $('directionSelect').innerHTML = '<option value="all">全部十方向</option>' + directions.map(direction => `<option value="${escape(direction.id)}">${escape(direction.id)} · ${escape(directionName(direction))}</option>`).join('');
    $('directionDownloads').innerHTML = directions.map(direction => `<a href="./lists/${encodeURIComponent(direction.id)}.md" download><code>${escape(direction.id)}</code>${escape(directionName(direction))} ↓</a>`).join('');
  }
  function renderNavigation() {
    $('directionNav').innerHTML = `<button type="button" class="all-directions" data-action="direction" data-value="all" aria-pressed="${state.direction === 'all'}"><span class="direction-code" aria-hidden="true">▦</span><span>全部阅读</span><span class="direction-count">${works.length}</span></button>` + directions.map(direction => `<button type="button" data-action="direction" data-value="${escape(direction.id)}" aria-pressed="${state.direction === direction.id}"><span class="direction-code">${escape(direction.id)}</span><span>${escape(directionName(direction))}</span><span class="direction-count">${directionWorks(direction.id).length}</span></button>`).join('');
  }
  function renderContext() {
    const direction = directionById.get(state.direction);
    const firstCount = directionWorks(state.direction, '第一轮').length;
    const selectedTopic = topicById.get(state.topic);
    const contextTitle = direction ? directionName(direction) : '从领域入口开始，沿知识问题深化';
    const description = direction ? asText(direction.description || direction.goal) : '每个方向保留自己的理论与经验基础。第一轮建立共同问题，专题深化展开争论，方法工具用于检查具体研究对象与证据。作品按身份去重，各方向保留独立用途。';
    const path = direction ? asText(direction.reading_path || direction.first_step) : '选定方向与专题 → 阅读作品与用途 → 打开出版记录 → 回到原课纲确认位置与要求。';
    const gaps = direction ? (data.gaps || []).filter(gap => asText(gap.topic || gap.direction).includes(direction.id)) : [];
    const gapMarkup = gaps.length ? `<details class="coverage-details"><summary>本方向的覆盖说明 · ${gaps.length}</summary>${gaps.map(gap => `<p><b>${escape(asText(gap.topic))}</b>${escape(asText(gap.reason))}</p>`).join('')}</details>` : '';
    $('fieldContext').innerHTML = `<div class="context-head"><div class="context-copy"><span class="context-code">${escape(direction ? `${direction.id} / READING FIELD` : 'TEN FIELDS / ONE TRACEABLE LIBRARY')}</span><h2>${escape(contextTitle)}</h2><p class="context-description">${escape(description)}</p></div><div class="context-actions"><button type="button" class="button primary" data-action="first"${firstCount ? '' : ' disabled'}>进入第一轮 <span class="button-count">${firstCount} 篇 →</span></button>${direction ? `<a class="button" href="./lists/${encodeURIComponent(direction.id)}.md" download>下载本方向清单 ↓</a>` : '<a class="button" href="#downloads">保存阅读工作台 ↓</a>'}</div></div>${path ? `<p class="context-path"><b>阅读路径</b>${escape(path)}</p>` : ''}${selectedTopic ? `<div class="topic-context"><strong>${escape(selectedTopic.id)} · ${escape(topicName(selectedTopic))}</strong>${selectedTopic.question ? `<p>${escape(asText(selectedTopic.question))}</p>` : ''}${selectedTopic.scope ? `<p>范围：${escape(asText(selectedTopic.scope))}</p>` : ''}</div>` : ''}${gapMarkup}`;
  }
  function renderTopicOptions() {
    let html = '<option value="all">全部专题</option>';
    const selectedDirections = state.direction === 'all' ? directions : directions.filter(direction => direction.id === state.direction);
    for (const direction of selectedDirections) {
      const options = topics.filter(topic => topicDirection(topic) === direction.id);
      if (!options.length) continue;
      html += `<optgroup label="${escape(direction.id)} · ${escape(directionName(direction))}">${options.map(topic => `<option value="${escape(topic.id)}">${escape(topic.id)} · ${escape(topicName(topic))}</option>`).join('')}</optgroup>`;
    }
    $('topicSelect').innerHTML = html;
    $('topicSelect').value = state.topic;
  }
  function renderPriorityTabs() {
    const eligible = works.filter(work => scopedMappings(work, false).length && matchesSearch(work));
    $('priorityTabs').innerHTML = priorities.map(priority => {
      const count = priority === 'all' ? eligible.length : eligible.filter(work => scopedMappings(work, false).some(mapping => mapping.priority === priority)).length;
      return `<button type="button" data-action="priority" data-value="${priority}" aria-pressed="${state.priority === priority}">${priority === 'all' ? '全部' : priority}<span>${count}</span></button>`;
    }).join('');
  }
  function purposeMarkup(mapping) {
    const topic = topicById.get(mapping.topic);
    return `<div class="reading-purpose"><button type="button" class="purpose-topic" data-action="topic" data-value="${escape(mapping.topic)}"><code>${escape(mapping.topic)}</code>${escape(topicName(topic) || mapping.topic)}</button><span class="purpose-priority">${escape(mapping.priority || '')}${mapping.sequence && mapping.priority === '第一轮' ? ` · 方向内顺序 ${escape(mapping.sequence)}` : ''}</span><p>${escape(asText(mapping.reason))}</p></div>`;
  }
  function sourceMarkup(work) {
    const links = work.source_links.map(source => {
      const audit = sourceById.get(String(source.source_id));
      const title = asText(audit?.title || source.source_title || source.source_id || '原始来源');
      const url = source.source_url || audit?.url;
      return `<section class="source-item"><h4><code>${escape(source.source_id || '')}</code>${externalLink(url, `${escape(title)} ↗`) || escape(title)}</h4><dl><dt>原件位置</dt><dd>${escape(asText(source.location || '未列位置'))}</dd><dt>原阅读标记</dt><dd>${escape(asText(source.original_reading_status || '原件未注明'))}</dd>${source.evidence ? `<dt>出处依据</dt><dd>${escape(asText(source.evidence))}</dd>` : ''}</dl></section>`;
    }).join('');
    const notes = asText(work.bibliographic_notes || work.version_note || work.version_notes || work.notes);
    return `<details class="source-details"><summary><span>${work.source_links.length ? '原课纲出处与核验' : '补充依据与核验'}</span><span class="source-summary-note">${work.source_links.length ? `${work.source_links.length} 条出处` : '整理者补充'}${notes ? ' · 含版本说明' : ''}</span></summary><div class="source-body">${links || '<p class="citation-publication">该作品为补缺阅读，未标作原课纲指定；依据见下方书目记录。</p>'}<div class="verification-info"><p><b>书目核验：</b>${escape(asText(work.verification_status || '参见原书目'))}${work.verification_date ? ` · ${escape(work.verification_date)}` : ''}${externalLink(work.verification_url, '　查看核验记录 ↗')}</p><p><b>阅读状态：</b>${escape(asText(work.reading_status || '本表核实书目与出处，不表示已完成作品全文评阅。'))}</p></div>${notes ? `<div class="version-note"><b>版本与校订</b>${escape(notes)}</div>` : ''}</div></details>`;
  }
  function cardMarkup(work) {
    const mappings = orderedMappings(work);
    const labels = [...new Set(mappings.map(mapping => mapping.priority).filter(Boolean))];
    const type = {journalArticle:'期刊论文',book:'图书',bookSection:'书章',report:'研究报告',preprint:'预印本',webpage:'网页资料'}[work.type] || '文献';
    const publication = publicationText(work);
    const url = primaryUrl(work);
    const visiblePurposes = mappings.slice(0, 2).map(purposeMarkup).join('');
    const remaining = mappings.slice(2);
    const origin = work.bibliography_origin && work.bibliography_origin !== '课程列示' ? `<span class="origin-label">${escape(work.bibliography_origin)}</span>` : '';
    return `<article class="reading-card" id="work-${escape(work.id)}" data-work="${escape(work.id)}"><div class="card-top"><div class="card-labels">${labels.map(label => `<span class="priority-label ${label === '专题深化' ? 'deep' : label === '方法工具' ? 'method' : ''}">${escape(label)}</span>`).join('')}${origin}<span class="type-label">${escape(type)}</span><span class="work-id">${escape(work.id)}</span></div><div class="card-actions">${progressSelectFor(work)}<button type="button" class="copy-citation" data-action="copy" data-value="${escape(work.id)}" aria-label="复制 ${escape(work.title)} 的完整引文">复制引文</button></div></div><p class="citation-authors">${escape(authorLine(work))} <span class="citation-year">(${escape(work.year || 'n.d.')})</span></p><h3 class="work-title">${externalLink(url, escape(work.title)) || escape(work.title)}</h3><p class="citation-publication">${escape(publication)}${publication ? '.' : ''}</p><div class="why-read"><p class="why-title">WHY READ / 为什么读</p>${visiblePurposes}${remaining.length ? `<details class="more-purposes"><summary>另外 ${remaining.length} 个专题用途</summary>${remaining.map(purposeMarkup).join('')}</details>` : ''}</div>${work.reading_scope ? `<p class="reading-scope">阅读范围：${escape(asText(work.reading_scope))}</p>` : ''}<div class="card-links">${externalLink(url, work.doi ? 'DOI / 出版记录 ↗' : '打开出版记录 ↗')}${work.url && externalUrl(work.url) !== url ? externalLink(work.url, '文献页面 ↗') : ''}${work.doi ? `<span class="doi-text">${escape(asText(work.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, ''))}</span>` : ''}</div>${sourceMarkup(work)}</article>`;
  }
  function renderActiveFilters() {
    const chips = [];
    if (state.direction !== 'all') chips.push(['direction',`${state.direction} · ${directionName(directionById.get(state.direction))}`]);
    if (state.topic !== 'all') chips.push(['topic',`${state.topic} · ${topicName(topicById.get(state.topic))}`]);
    if (state.priority !== 'all') chips.push(['priority',state.priority]);
    if (state.progress !== 'all') chips.push(['progress',progressLabels[state.progress]]);
    if (state.query) chips.push(['query',`搜索：${state.query}`]);
    $('activeFilters').innerHTML = chips.map(([key,label]) => `<button type="button" class="filter-chip" data-action="remove" data-value="${key}" aria-label="移除筛选 ${escape(label)}">${escape(label)}<span aria-hidden="true">×</span></button>`).join('');
  }
  function renderPagination(pageCount) {
    if (pageCount <= 1) { $('pagination').innerHTML = ''; return; }
    const pages = new Set([1,pageCount,state.page-1,state.page,state.page+1].filter(page => page >= 1 && page <= pageCount));
    const items = [...pages].sort((a,b) => a-b);
    let html = `<button type="button" data-action="page" data-value="${state.page-1}"${state.page === 1 ? ' disabled' : ''}>上一页</button>`;
    let last = 0;
    for (const page of items) {
      if (last && page - last > 1) html += '<span aria-hidden="true">…</span>';
      html += `<button type="button" data-action="page" data-value="${page}" aria-label="第 ${page} 页"${page === state.page ? ' aria-current="page"' : ''}>${page}</button>`;
      last = page;
    }
    html += `<button type="button" data-action="page" data-value="${state.page+1}"${state.page === pageCount ? ' disabled' : ''}>下一页</button>`;
    $('pagination').innerHTML = html;
  }
  function renderResults() {
    filtered = works.filter(work => scopedMappings(work).length && matchesSearch(work) && (state.progress === 'all' || progressFor(work.id) === state.progress)).sort(sortWorks);
    const pageCount = Math.max(1,Math.ceil(filtered.length/pageSize));
    state.page = Math.min(state.page,pageCount);
    const start = (state.page-1)*pageSize;
    const visible = filtered.slice(start,start+pageSize);
    const mappingCount = filtered.reduce((sum,work) => sum + scopedMappings(work).length,0);
    const title = state.topic !== 'all' ? topicName(topicById.get(state.topic)) : state.direction !== 'all' ? directionName(directionById.get(state.direction)) : '全部阅读';
    $('resultsTitle').textContent = title + (state.priority !== 'all' ? ` · ${state.priority}` : '');
    $('resultCount').textContent = `${filtered.length} 个独立作品 · ${mappingCount} 个专题用途${filtered.length > pageSize ? ` · 当前 ${start+1}–${start+visible.length}` : ''}`;
    $('readingCards').innerHTML = visible.length ? visible.map(cardMarkup).join('') : '<div class="empty-state"><h3>没有符合当前条件的作品</h3><p>可以减少关键词，切换专题，或取消优先级筛选后继续查找。</p><button type="button" class="button" data-action="reset">查看全部阅读</button></div>';
    renderActiveFilters();
    renderPriorityTabs();
    renderPagination(pageCount);
    renderProgress();
    writeLocation();
  }
  function renderAll() {
    $('directionSelect').value = state.direction;
    $('searchInput').value = state.query;
    $('sortSelect').value = state.sort;
    $('progressSelect').value = state.progress;
    renderNavigation();
    renderTopicOptions();
    renderContext();
    renderResults();
  }
  function update(patch, full = true) {
    clearTimeout(searchTimer);
    state = {...state,...patch,page:patch.page || 1};
    if (full) renderAll(); else renderResults();
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; },2500);
  }
  async function copyCitation(id) {
    const work = workById.get(id);
    if (!work) return;
    const citation = fullCitation(work);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(citation);
      toast('已复制完整引文');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = citation;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      textarea.remove();
      toast(success ? '已复制完整引文' : '未能自动复制，请选择作品引文后复制。');
    }
  }


  function exportProgress() {
    const payload = {schema:'SyllabusAtlasReadingProgress/1',exported_at:new Date().toISOString(),statuses:readingProgress};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'syllabus-atlas-reading-progress.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    toast('已导出本机阅读进度');
  }
  async function importProgress(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 300000) throw new Error('File too large');
      const parsed = JSON.parse(await file.text());
      if (!parsed || parsed.schema !== 'SyllabusAtlasReadingProgress/1' || !parsed.statuses || typeof parsed.statuses !== 'object' || Array.isArray(parsed.statuses)) throw new Error('Wrong data format');
      const clean = Object.create(null);
      for (const [id,status] of Object.entries(parsed.statuses)) {
        if (workById.has(id) && progressStatuses.includes(status) && status !== 'not-started') clean[id] = status;
      }
      if (!window.confirm('导入将替换当前浏览器中的所有阅读状态。确定继续？')) return;
      readingProgress = clean;
      saveReadingProgress();
      renderAll();
      toast('已导入 ' + Object.keys(clean).length + ' 条阅读记录');
    } catch {
      toast('导入失败：请使用本工作台导出的进度 JSON 文件');
    } finally { event.target.value = ''; }
  }

  document.addEventListener('click',event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const {action,value} = button.dataset;
    if (action === 'direction') update({direction:value,topic:'all'});
    if (action === 'topic' && topicById.has(value)) update({direction:topicDirection(topicById.get(value)),topic:value});
    if (action === 'priority') update({priority:value});
    if (action === 'first') update({priority:'第一轮',topic:'all',query:''});
    if (action === 'reset') update({...defaults});
    if (action === 'copy') copyCitation(value);
    if (action === 'remove') {
      if (value === 'direction') update({direction:'all',topic:'all'});
      else if (value === 'query') update({query:''});
      else update({[value]:'all'});
    }
    if (action === 'page') { update({page:Math.max(1,Number(value))},false); $('reading-results').scrollIntoView({block:'start'}); $('reading-results').focus({preventScroll:true}); }
  });
  $('resetFilters').addEventListener('click',() => update({...defaults}));
  $('directionSelect').addEventListener('change',event => update({direction:event.target.value,topic:'all'}));
  $('topicSelect').addEventListener('change',event => { const topic = topicById.get(event.target.value); update({topic:event.target.value,...(topic ? {direction:topicDirection(topic)} : {})}); });
  $('sortSelect').addEventListener('change',event => update({sort:event.target.value},false));
  $('progressSelect').addEventListener('change',event => update({progress:event.target.value}));
  $('exportProgress').addEventListener('click',exportProgress);
  $('importProgress').addEventListener('change',importProgress);
  document.addEventListener('change',event => {
    const select = event.target.closest && event.target.closest('select[data-progress-id]');
    if (!select) return;
    const id = select.dataset.progressId, status = select.value;
    if (!workById.has(id) || !progressStatuses.includes(status)) return;
    if (status === 'not-started') delete readingProgress[id]; else readingProgress[id] = status;
    saveReadingProgress();
    renderProgress();
    if (state.progress !== 'all') renderResults();
  });

  $('searchInput').addEventListener('input',event => { state.query = event.target.value; state.page = 1; clearTimeout(searchTimer); searchTimer = setTimeout(renderResults,140); });
  $('searchInput').addEventListener('keydown',event => { if (event.key === 'Enter') { clearTimeout(searchTimer); renderResults(); } });
  window.addEventListener('popstate',() => { readLocation(); renderAll(); });
  readLocation();
  renderStatic();
  renderAll();
})();
