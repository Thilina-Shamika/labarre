/* LaBarre Galleries — category listing + full filter sidebar (shares assets/inventory.js) */
(function(){
  const TAX = [
    {name:"Collect by Countries", link:true},
    {name:"Collect by States", link:true},
    {name:"Uncancelled Stocks and Bonds", subs:["Chinese Bonds","Cuban Stocks and Bonds","German Stocks and Bonds","Japan Stocks and Bonds","Mexican Stocks & Bonds","Russian Bonds"]},
    {name:"Autographs", key:"autographs", subs:["Autographed Stocks & Bonds","Autographs of Famous People","Autographed Books","Exclusive Autograph Specials","Famous Americans on Stocks & Bonds","Phonograph Stocks & Bonds"]},
    {name:"Stocks and Bonds", key:"stocks-bonds", subs:["Alaska & Hawaii","Aviation Stocks","Breweries & Distilleries","Civil War","Colonial Bonds","Confederate Bonds","Connecticut Revolutionary War Bonds, Pay Orders, etc.","Early Stocks and Bonds","Foreign Bonds","General Bonds","Mining Bonds","Mining Stocks","New York Land & Real Estate","Northern Pacific RR Archives","Railroad Bonds","Railroad Stocks","Real Estate","Southern State Bonds","Specimen Stocks & Bonds","Sports Stocks & Bonds","Telephone & Telegraph","Texas Stocks and Bonds, etc.","Utility Stocks & Bonds","Western Stocks & Bonds","World's Fair"]},
    {name:"Currency", key:"currency", subs:["Foreign","U.S.","Checks","Coins"]},
    {name:"Americana", key:"americana", subs:["Advertising Art Calendars","Animation Cels","Cigar Box Labels","Civil War","Fruit Crate Labels","Presidential","Slavery Documents","Souvenir Cards","Sports Memorabilia","Stamps","Tobacco Labels","Miscellaneous"]},
    {name:"Articles - Stocks and Bonds", link:true},
  ];
  const esc = s => String(s).replace(/&(?!amp;|lt;|#)/g,'&amp;').replace(/</g,'&lt;');
  const money = n => '$'+n.toLocaleString();

  document.addEventListener('DOMContentLoaded', function(){
    const grid = document.getElementById('grid');
    if(!grid || !window.LBsearch || !window.LB_INVENTORY) return;
    const S = window.LBsearch;
    const slug = document.body.dataset.page;
    const all = window.LB_INVENTORY.filter(i=>i.cat===slug);
    const START = 8, BATCH = 4;
    let shown = START, sortMode = 'feat';

    const F = {cat:slug, q:'', field:'all', subs:[], pmin:'', pmax:'', ymin:'', ymax:'',
      st:[], cond:[], size:[], printer:'all', region:'all', state:'all', city:'all', type:[],
      signed:false, coupons:false, unc:false, sort:'rel', view:'grid'};
    const fParam = new URLSearchParams(location.search).get('f');
    if(fParam) F.subs = [fParam];

    const uniq = k => Array.from(new Set(all.map(i=>i[k]))).filter(v=>v && v!=='—').sort();
    const cnt = pred => all.filter(pred).length;
    const DECADES = [[1700,1799,"1700s"],[1800,1859,"1800–1859"],[1860,1879,"Civil War era"],[1880,1899,"Gilded Age"],[1900,1929,"1900–1929"],[1930,1959,"1930–1959"],[1960,2000,"1960 onward"]];
    const SIZES = [["sm","Under 8 in"],["md","8 – 14 in"],["lg","14 – 20 in"],["xl","Over 20 in"]];
    const CONDS = ["Choice Uncirculated","Extremely Fine","Very Fine","Fine","Good"];
    const STATS = [["available","Available now"],["auction","At auction"],["sold","Include sold &amp; archive"],["soldonly","Only sold items"]];

    /* ---------- sidebar ---------- */
    const side = document.getElementById('filtersSide');
    function multi(key, label, value, count){
      const on = F[key].indexOf(value)!==-1;
      return '<a data-multi="'+key+'" data-v="'+encodeURIComponent(value)+'" class="'+(count?'':'muted')+(on?' active':'')+'">'+label+(count?'<span class="cnt">'+count+'</span>':'')+'</a>';
    }
    function single(key, label, value, count){
      const on = F[key]===value;
      return '<a data-single="'+key+'" data-v="'+encodeURIComponent(value)+'" class="'+(count?'':'muted')+(on?' active':'')+'">'+label+(count?'<span class="cnt">'+count+'</span>':'')+'</a>';
    }
    function group(name, body, open){
      return '<div class="fgroup'+(open?' open':'')+'"><button class="gh" type="button">'+name+'<span class="chev"></span></button><div class="fsubs">'+body+'</div></div>';
    }
    function sidebarHTML(){
      const taxGroups = TAX.map(function(g){
        if(g.link) return '<div class="fgroup islink"><button class="gh" type="button" data-link="1">'+esc(g.name)+'<span class="chev"></span></button></div>';
        const subs = g.subs.map(s=>multi('subs', esc(s), s, cnt(i=>i.tags.indexOf(s)!==-1))).join('');
        return group(esc(g.name), subs, g.key===slug || F.subs.some(s=>g.subs.indexOf(s)!==-1));
      }).join('');
      const states = uniq('state').filter(v=>F.region==='all'||all.some(i=>i.state===v&&i.region===F.region));
      const cities = uniq('city').filter(v=>(F.state==='all'||all.some(i=>i.city===v&&i.state===F.state))&&(F.region==='all'||all.some(i=>i.city===v&&i.region===F.region)));
      return '<div class="fs-head"><span class="t">Filter</span>'+
        '<button class="clr" id="fsClear">Clear all</button>'+
        '<button class="fs-close" id="fsClose" aria-label="Close filters"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
        '<div class="fs-scroll">'+
        group('Availability', STATS.map(([k,l])=>multi('st', l, k, k==='soldonly'?cnt(i=>i.st==='sold'):cnt(i=>i.st===k))).join(''), F.st.length>0)+
        group('Product type', uniq('type').map(t=>multi('type', esc(t), t, cnt(i=>i.type===t))).join(''), F.type.length>0)+
        group('Date', DECADES.map(([a,b,l])=>'<a data-yr="'+a+'-'+b+'" class="'+(cnt(i=>i.yr>=a&&i.yr<=b)?'':'muted')+(F.ymin==a&&F.ymax==b?' active':'')+'">'+l+'<span class="cnt">'+cnt(i=>i.yr>=a&&i.yr<=b)+'</span></a>').join(''), !!F.ymin)+
        group('Price', [[0,50],[50,150],[150,400],[400,1000],[1000,5000],[5000,null]].map(function(b){
          const lab = b[1]?money(b[0])+' – '+money(b[1]):money(b[0])+'+';
          const c = cnt(i=>i.pr>=b[0] && (!b[1]||i.pr<=b[1]));
          return '<a data-pr="'+b[0]+'-'+(b[1]||'')+'" class="'+(c?'':'muted')+(F.pmin==b[0]&&String(F.pmax)==String(b[1]||'')?' active':'')+'">'+lab+'<span class="cnt">'+c+'</span></a>';
        }).join(''), !!F.pmin)+
        group('Region', uniq('region').map(r=>single('region', esc(r), r, cnt(i=>i.region===r))).join(''), F.region!=='all')+
        group('State / country', states.map(r=>single('state', esc(r), r, cnt(i=>i.state===r))).join('') || '<span class="fnote">No states in this selection</span>', F.state!=='all')+
        group('City / area', cities.map(r=>single('city', esc(r), r, cnt(i=>i.city===r))).join('') || '<span class="fnote">No cities in this selection</span>', F.city!=='all')+
        group('Printer / engraver', uniq('printer').map(r=>single('printer', esc(r), r, cnt(i=>i.printer===r))).join(''), F.printer!=='all')+
        group('Size', SIZES.map(([k,l])=>{const b=S.SIZEBUCKET[k];return multi('size', l, k, cnt(i=>S.longest(i)>=b[0]&&S.longest(i)<b[1]));}).join(''), F.size.length>0)+
        group('Condition', CONDS.map(c=>multi('cond', c, c, cnt(i=>i.cond===c))).join(''), F.cond.length>0)+
        group('Features', [['signed','Signed or autographed',cnt(i=>i.signed)],['coupons','Coupons attached',cnt(i=>i.coupons)],['unc','Uncancelled',cnt(i=>i.unc)]]
          .map(([k,l,c])=>'<a data-bool="'+k+'" class="'+(c?'':'muted')+(F[k]?' active':'')+'">'+l+'<span class="cnt">'+c+'</span></a>').join(''), F.signed||F.coupons||F.unc)+
        taxGroups+
        '<a class="fs-adv" href="Search.html?cat='+encodeURIComponent(slug)+'">Advanced search across all departments →</a>'+
        '</div>';
    }
    function wireSidebar(){
      if(!side) return;
      side.innerHTML = sidebarHTML();
      side.querySelectorAll('.fgroup:not(.islink) .gh').forEach(function(h){
        h.addEventListener('click', function(){ h.parentElement.classList.toggle('open'); });
      });
      side.querySelectorAll('.fsubs a').forEach(function(a){
        a.addEventListener('click', function(e){
          e.preventDefault();
          const d = a.dataset;
          if(d.multi){ const v = decodeURIComponent(d.v); const i = F[d.multi].indexOf(v); i<0?F[d.multi].push(v):F[d.multi].splice(i,1); }
          else if(d.single){ const v = decodeURIComponent(d.v); F[d.single] = (F[d.single]===v)?'all':v; if(d.single==='region'){F.state='all';F.city='all';} if(d.single==='state'){F.city='all';} }
          else if(d.yr){ const [a1,b1] = d.yr.split('-'); if(F.ymin==a1&&F.ymax==b1){F.ymin='';F.ymax='';} else {F.ymin=a1;F.ymax=b1;} }
          else if(d.pr){ const [a1,b1] = d.pr.split('-'); if(F.pmin==a1&&String(F.pmax)===b1){F.pmin='';F.pmax='';} else {F.pmin=a1;F.pmax=b1;} }
          else if(d.bool){ F[d.bool] = !F[d.bool]; }
          shown = START; apply(); closeMobile();
        });
      });
      const clr = document.getElementById('fsClear');
      if(clr) clr.addEventListener('click', reset);
      const cls = document.getElementById('fsClose');
      if(cls) cls.addEventListener('click', closeMobile);
    }
    function reset(){
      Object.assign(F, {subs:[],pmin:'',pmax:'',ymin:'',ymax:'',st:[],cond:[],size:[],printer:'all',region:'all',state:'all',city:'all',type:[],signed:false,coupons:false,unc:false});
      shown = START; apply();
    }

    /* ---------- mobile drawer ---------- */
    const overlay = document.createElement('div'); overlay.className='filter-overlay'; document.body.appendChild(overlay);
    const toggle = document.getElementById('filterToggle');
    function openMobile(){ side && side.classList.add('open'); overlay.classList.add('open'); }
    function closeMobile(){ side && side.classList.remove('open'); overlay.classList.remove('open'); }
    if(toggle) toggle.addEventListener('click', openMobile);
    overlay.addEventListener('click', closeMobile);

    const sel = document.getElementById('sortSel');
    if(sel) sel.addEventListener('change', function(){ sortMode = sel.value; shown = START; apply(); });
    const more = document.getElementById('loadMore');
    if(more) more.addEventListener('click', function(){ shown += BATCH; render(); });

    /* ---------- chips ---------- */
    const CHIPLABEL = {available:'Available now',auction:'At auction',sold:'Incl. sold',soldonly:'Sold only'};
    function chips(){
      const c = [];
      F.subs.forEach(v=>c.push(['subs',v,esc(v)]));
      F.type.forEach(v=>c.push(['type',v,esc(v)]));
      F.st.forEach(v=>c.push(['st',v,CHIPLABEL[v]||v]));
      F.size.forEach(v=>c.push(['size',v,(SIZES.find(x=>x[0]===v)||[,''])[1]]));
      F.cond.forEach(v=>c.push(['cond',v,v]));
      if(F.ymin) c.push(['yr','',F.ymin+' – '+F.ymax]);
      if(F.pmin) c.push(['pr','',money(+F.pmin)+(F.pmax?' – '+money(+F.pmax):'+')]);
      ['region','state','city','printer'].forEach(k=>{ if(F[k]!=='all') c.push([k,'',esc(F[k])]); });
      ['signed','coupons','unc'].forEach(k=>{ if(F[k]) c.push([k,'',{signed:'Signed',coupons:'Coupons attached',unc:'Uncancelled'}[k]]); });
      return c;
    }
    function drawChips(){
      const af = document.getElementById('activeFilters');
      if(!af) return;
      const c = chips();
      af.innerHTML = c.length
        ? '<span class="lead">Filtered:</span>'+c.map(([k,v,l])=>'<span class="chip">'+l+'<button data-k="'+k+'" data-v="'+encodeURIComponent(v)+'" aria-label="Remove filter">×</button></span>').join('')+'<button class="chip clearall" id="chipClear">Clear all</button>'
        : '';
      af.querySelectorAll('.chip button[data-k]').forEach(function(b){
        b.addEventListener('click', function(){
          const k = b.dataset.k, v = decodeURIComponent(b.dataset.v);
          if(Array.isArray(F[k])) F[k] = F[k].filter(x=>x!==v);
          else if(k==='yr'){ F.ymin=''; F.ymax=''; }
          else if(k==='pr'){ F.pmin=''; F.pmax=''; }
          else if(typeof F[k]==='boolean') F[k]=false;
          else F[k]='all';
          shown = START; apply();
        });
      });
      const ca = document.getElementById('chipClear');
      if(ca) ca.addEventListener('click', reset);
    }

    /* ---------- render ---------- */
    let data = [];
    function sortData(arr){
      if(sortMode==='pl') return arr.sort((a,b)=>a.pr-b.pr);
      if(sortMode==='ph') return arr.sort((a,b)=>b.pr-a.pr);
      if(sortMode==='az') return arr.sort((a,b)=>S.strip(a.h).localeCompare(S.strip(b.h)));
      if(sortMode==='yo') return arr.sort((a,b)=>a.yr-b.yr);
      if(sortMode==='yn') return arr.sort((a,b)=>b.yr-a.yr);
      return arr.sort((a,b)=>b.yr-a.yr);
    }
    function apply(){
      data = sortData(all.filter(i=>S.match(i,F)));
      wireSidebar();
      drawChips();
      render();
    }
    function card(it){
      const sold = it.st==='sold';
      const badge = sold?['sold','Sold']:(it.st==='auction'?['auc','At Auction']:it.signed?['sgn','Signed']:['','Available']);
      return '<a href="Product.html?id='+it.id+'" class="prod'+(sold?' is-sold':'')+'"><div class="pimg">'+
        '<div class="pshot"><span class="badge '+badge[0]+'">'+badge[1]+'</span><img src="'+it.img+'" alt="'+S.strip(it.h)+'" loading="lazy">'+
        '<span class="zoom"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg></span></div></div>'+
        '<div class="pbody"><span class="e">'+it.type+' · '+it.yr+'</span><h3>'+it.h+'</h3><span class="d">'+it.d+'</span>'+
        '<div class="specrow"><span>'+it.w+'″ × '+it.ht+'″</span><span>'+it.cond+'</span><span>'+it.state+'</span></div>'+
        '<div class="prow"><span class="pr"><span class="s">'+(sold?'Realized':'Buy Now')+'</span>'+money(sold?it.realized:it.pr)+'</span>'+
        (sold?'<span class="solddt">'+it.sold+'</span>':'<span class="add">Add to Cart<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>')+
        '</div></div></a>';
    }
    function render(){
      const cEl = document.getElementById('count'); if(cEl) cEl.textContent = data.length;
      if(!data.length){
        grid.innerHTML = '<div class="empty-grid" style="grid-column:1/-1;">Nothing in this department matches those filters.<br><button class="btn btn-line" id="emptyClear" type="button">Clear filters</button></div>';
        const ec = document.getElementById('emptyClear'); if(ec) ec.addEventListener('click', reset);
      } else {
        grid.innerHTML = data.slice(0, shown).map(card).join('');
      }
      const left = data.length - shown;
      if(more) more.style.display = (left<=0 || !data.length) ? 'none' : '';
      const rem = document.getElementById('rem');
      if(rem) rem.textContent = !data.length ? '' : (left<=0 ? 'Showing all '+data.length+' pieces' : left+' more piece'+(left===1?'':'s'));
    }
    apply();
  });
})();
