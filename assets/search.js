/* LaBarre Galleries — typeahead + advanced search engine */
(function(){
  const CATNAME = {"autographs":"Autographs","stocks-bonds":"Stocks & Bonds","currency":"Currency & Coins","americana":"Americana"};
  const CATPAGE = {"autographs":"Autographs.html","stocks-bonds":"Stocks and Bonds.html","currency":"Currency.html","americana":"Americana.html"};
  const strip = s => String(s).replace(/&amp;/g,'&').replace(/&[a-z]+;/g,' ');
  const norm  = s => strip(s).toLowerCase();
  const esc   = s => String(s).replace(/&(?!amp;|lt;|gt;|#)/g,'&amp;').replace(/</g,'&lt;');

  function inv(){ return window.LB_INVENTORY || []; }

  function mark(text, q){
    const t = strip(text); if(!q) return esc(t);
    const i = t.toLowerCase().indexOf(q.toLowerCase());
    if(i<0) return esc(t);
    return esc(t.slice(0,i))+'<b>'+esc(t.slice(i,i+q.length))+'</b>'+esc(t.slice(i+q.length));
  }

  /* ---------- filtering ---------- */
  function parseQS(){
    const p = new URLSearchParams(location.search), g = k => p.get(k) || '';
    return {
      q:g('q'), field:g('field')||'all', cat:g('cat')||'all',
      subs:(g('subs')?g('subs').split('|').filter(Boolean):[]),
      pmin:g('pmin'), pmax:g('pmax'), ymin:g('ymin'), ymax:g('ymax'),
      st:(g('st')?g('st').split('|').filter(Boolean):[]),
      cond:(g('cond')?g('cond').split('|').filter(Boolean):[]),
      size:(g('size')?g('size').split('|').filter(Boolean):[]),
      printer:g('printer')||'all', region:g('region')||'all',
      type:(g('type')?g('type').split('|').filter(Boolean):[]),
      state:g('state')||'all', city:g('city')||'all',
      signed:g('signed')==='1', coupons:g('coupons')==='1', unc:g('unc')==='1',
      sort:g('sort')||'rel', view:g('view')||'grid'
    };
  }
  function toQS(f){
    const p = new URLSearchParams();
    const put = (k,v) => { if(v && v!=='all' && v!=='rel' && v!=='grid' && !(Array.isArray(v)&&!v.length)) p.set(k, Array.isArray(v)?v.join('|'):v); };
    put('q',f.q); if(f.field!=='all') put('field',f.field); put('cat',f.cat); put('subs',f.subs);
    put('pmin',f.pmin); put('pmax',f.pmax); put('ymin',f.ymin); put('ymax',f.ymax);
    put('st',f.st); put('cond',f.cond); put('size',f.size);
    put('printer',f.printer); put('region',f.region);
    put('type',f.type); put('state',f.state); put('city',f.city);
    if(f.signed) p.set('signed','1'); if(f.coupons) p.set('coupons','1'); if(f.unc) p.set('unc','1');
    put('sort',f.sort); put('view',f.view);
    return p.toString();
  }
  const SIZEBUCKET = {sm:[0,8], md:[8,14], lg:[14,20], xl:[20,999]};
  function longest(it){ return Math.max(it.w, it.ht); }

  function match(it, f){
    if(f.q){
      const q = norm(f.q);
      const hay = f.field==='title' ? norm(it.h)
                : f.field==='desc'  ? norm(it.d)
                : f.field==='ref'   ? norm(it.ref+' '+it.id)
                : norm([it.h,it.d,it.tags.join(' '),it.printer,it.region,it.ref,it.id,it.yr].join(' '));
      if(!q.split(/\s+/).every(w=>hay.includes(w))) return false;
    }
    if(f.cat!=='all' && it.cat!==f.cat) return false;
    if(f.subs.length && !f.subs.some(s=>it.tags.includes(s))) return false;
    if(f.pmin && it.pr < +f.pmin) return false;
    if(f.pmax && it.pr > +f.pmax) return false;
    if(f.ymin && it.yr < +f.ymin) return false;
    if(f.ymax && it.yr > +f.ymax) return false;
    if(f.st.length){
      if(f.st.includes('soldonly')){ if(it.st!=='sold') return false; }
      else if(!f.st.includes(it.st)) return false;
    } else if(it.st==='sold') return false;               // sold hidden unless asked for
    if(f.cond.length && !f.cond.includes(it.cond)) return false;
    if(f.size.length && !f.size.some(k=>{ const b=SIZEBUCKET[k]; const L=longest(it); return L>=b[0] && L<b[1]; })) return false;
    if(f.printer!=='all' && it.printer!==f.printer) return false;
    if(f.region!=='all' && it.region!==f.region) return false;
    if(f.type && f.type.length && !f.type.includes(it.type)) return false;
    if(f.state && f.state!=='all' && it.state!==f.state) return false;
    if(f.city && f.city!=='all' && it.city!==f.city) return false;
    if(f.signed && !it.signed) return false;
    if(f.coupons && !it.coupons) return false;
    if(f.unc && !it.unc) return false;
    return true;
  }
  function sortItems(list, f){
    const s = f.sort;
    const by = {
      pl:(a,b)=>a.pr-b.pr, ph:(a,b)=>b.pr-a.pr,
      yo:(a,b)=>a.yr-b.yr, yn:(a,b)=>b.yr-a.yr,
      sz:(a,b)=>longest(a)-longest(b), szd:(a,b)=>longest(b)-longest(a),
      rz:(a,b)=>(b.realized||0)-(a.realized||0),
      rel:(a,b)=>{
        if(!f.q) return b.yr-a.yr;
        const q = norm(f.q);
        const sc = it => (norm(it.h).startsWith(q)?0:norm(it.h).includes(q)?1:2);
        return sc(a)-sc(b) || a.pr-b.pr;
      }
    };
    return list.slice().sort(by[s]||by.rel);
  }

  /* ---------- typeahead ---------- */
  function suggestions(q){
    const nq = norm(q), out = [];
    if(nq.length<2) return out;
    const items = inv().filter(it=>norm(it.h+' '+it.d+' '+it.ref).includes(nq));
    const seen = new Set();
    items.forEach(function(it){
      const key = strip(it.h);
      if(seen.has(key) || out.length>=5) return;
      seen.add(key);
      out.push({kind:'item', label:it.h, meta:(CATNAME[it.cat]||'')+' · '+it.yr+' · $'+it.pr.toLocaleString(), href:'Product.html?id='+it.id});
    });
    const tags = new Set();
    inv().forEach(it=>it.tags.forEach(function(t){ if(norm(t).includes(nq)) tags.add(t); }));
    Array.from(tags).slice(0,3).forEach(function(t){
      const c = inv().filter(x=>x.tags.includes(t)).length;
      out.push({kind:'cat', label:t, meta:c+' items', href:'Search.html?subs='+encodeURIComponent(t)});
    });
    return out;
  }
  function scopes(q){
    const e = encodeURIComponent(q);
    return [
      {label:'All inventory', href:'Search.html?q='+e},
      {label:'Titles only', href:'Search.html?q='+e+'&field=title'},
      {label:'Sold &amp; archive only', href:'Search.html?q='+e+'&st=soldonly'},
      {label:'Auction lots only', href:'Search.html?q='+e+'&st=auction'}
    ];
  }
  function initTypeahead(){
    const input = document.getElementById('searchInput');
    const form  = document.getElementById('searchForm') || (input && input.closest('form'));
    if(!input) return;
    const box = document.createElement('div');
    box.className = 'sug'; box.setAttribute('role','listbox');
    (input.parentElement.classList.contains('searchbar') ? input.parentElement : input.parentElement).appendChild(box);
    let cur = -1, rows = [];
    function close(){ box.classList.remove('on'); cur = -1; }
    function draw(){
      const q = input.value.trim();
      if(q.length<2){ close(); return; }
      const sug = suggestions(q);
      rows = sug.concat(scopes(q).map(s=>({kind:'scope',label:s.label,href:s.href})));
      const items = sug.filter(s=>s.kind==='item'), cats = sug.filter(s=>s.kind==='cat');
      let html = '';
      if(items.length) html += '<div class="sg"><span class="sgh">Items</span>'+items.map(s=>'<a class="srow" href="'+s.href+'"><span class="sl">'+mark(s.label,q)+'</span><span class="sm">'+s.meta+'</span></a>').join('')+'</div>';
      if(cats.length) html += '<div class="sg"><span class="sgh">Categories</span>'+cats.map(s=>'<a class="srow" href="'+s.href+'"><span class="sl">'+mark(s.label,q)+'</span><span class="sm">'+s.meta+'</span></a>').join('')+'</div>';
      html += '<div class="sg scopes"><span class="sgh">Search &ldquo;'+esc(strip(q))+'&rdquo; in</span>'+
        scopes(q).map(s=>'<a class="srow scope" href="'+s.href+'"><span class="sl">'+s.label+'</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>').join('')+'</div>';
      if(!items.length && !cats.length) html = '<div class="sg"><span class="sgh">No title matches &mdash; try a broader search</span></div>'+html;
      box.innerHTML = html;
      box.classList.add('on');
      rows = Array.prototype.slice.call(box.querySelectorAll('.srow'));
    }
    input.addEventListener('input', draw);
    input.addEventListener('focus', function(){ if(input.value.trim().length>1) draw(); });
    input.addEventListener('keydown', function(e){
      if(!box.classList.contains('on')) return;
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){
        e.preventDefault();
        cur = (cur + (e.key==='ArrowDown'?1:-1) + rows.length) % rows.length;
        rows.forEach((r,i)=>r.classList.toggle('on', i===cur));
      } else if(e.key==='Enter' && cur>=0){ e.preventDefault(); rows[cur].click(); }
      else if(e.key==='Escape') close();
    });
    document.addEventListener('click', function(e){ if(!box.contains(e.target) && e.target!==input) close(); });
    if(form) form.addEventListener('submit', function(e){
      e.preventDefault();
      const cat = document.getElementById('searchCat');
      const p = new URLSearchParams();
      if(input.value.trim()) p.set('q', input.value.trim());
      if(cat && cat.value && cat.value!=='all') p.set('cat', cat.value);
      location.href = 'Search.html' + (p.toString()?'?'+p.toString():'');
    });
    document.querySelectorAll('.searchhints a').forEach(function(a){
      a.setAttribute('href','Search.html?q='+encodeURIComponent(a.textContent.trim()));
    });
  }

  window.LBsearch = {parseQS:parseQS, toQS:toQS, match:match, sort:sortItems, inv:inv, CATNAME:CATNAME, CATPAGE:CATPAGE, strip:strip, esc:esc, longest:longest, SIZEBUCKET:SIZEBUCKET};
  document.addEventListener('DOMContentLoaded', initTypeahead);
})();
