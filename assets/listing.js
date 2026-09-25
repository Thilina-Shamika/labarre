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
    const qParam = new URLSearchParams(location.search).get('q');
    if(qParam) F.q = qParam;

    const uniq = k => Array.from(new Set(all.map(i=>i[k]))).filter(v=>v && v!=='—').sort();
    const cnt = pred => all.filter(pred).length;
    const DECADES = [[1700,1799,"1700s"],[1800,1859,"1800–1859"],[1860,1879,"Civil War era"],[1880,1899,"Gilded Age"],[1900,1929,"1900–1929"],[1930,1959,"1930–1959"],[1960,2000,"1960 onward"]];
    const SIZES = [["sm","Under 8 in"],["md","8 – 14 in"],["lg","14 – 20 in"],["xl","Over 20 in"]];
    const CONDS = ["Choice Uncirculated","Extremely Fine","Very Fine","Fine","Good"];
    const STATS = [["available","Available now"],["auction","At auction"],["sold","Include sold &amp; archive"],["soldonly","Only sold items"]];

    /* ---------- sidebar: advanced search rail, scoped to this department ---------- */
    const side = document.getElementById('filtersSide');
    const own = (TAX.find(g=>g.key===slug)||{subs:[]}).subs;
    const SUBS = own.filter(s=>all.some(i=>i.tags.indexOf(s)!==-1));
    const PRICE_BANDS = [[0,50],[50,150],[150,400],[400,1000],[1000,5000],[5000,null]];
    const YR_BANDS = [[1700,1799],[1800,1865],[1866,1899],[1900,1945],[1946,2000]];
    const openSet = new Set(['Keyword','Price','Availability']);
    const q = s => String(s).replace(/"/g,'&quot;');
    function grp(name, body, extra){
      if(!body) return '';
      return '<details class="fgrp" data-g="'+name+'"'+(openSet.has(name)?' open':'')+'><summary>'+name+(extra?' <span class="c">'+extra+'</span>':'')+'</summary>'+body+'</details>';
    }
    function ck(attr, val, label, c, on){
      if(!c && !on) return '';
      return '<label class="fck"><input type="checkbox" data-'+attr+'="'+q(val)+'"'+(on?' checked':'')+'><span>'+label+'</span><b>'+c+'</b></label>';
    }
    function selHTML(id, key, anyLabel, vals){
      if(vals.length<1) return '';
      return '<select id="'+id+'" class="fsel"><option value="all">'+anyLabel+'</option>'+vals.map(v=>'<option value="'+q(v)+'"'+(F[key]===v?' selected':'')+'>'+esc(v)+' ('+cnt(i=>i[key]===v)+')</option>').join('')+'</select>';
    }
    function sidebarHTML(){
      const types = uniq('type');
      const pBands = PRICE_BANDS.filter(([a,b])=>cnt(i=>i.pr>=a&&(!b||i.pr<=b)));
      const yBands = YR_BANDS.filter(([a,b])=>cnt(i=>i.yr>=a&&i.yr<=b));
      const states = uniq('state').filter(v=>F.region==='all'||all.some(i=>i.state===v&&i.region===F.region));
      const cities = uniq('city').filter(v=>(F.state==='all'||all.some(i=>i.city===v&&i.state===F.state))&&(F.region==='all'||all.some(i=>i.city===v&&i.region===F.region)));
      const feats = [['signed','Signed or autographed'],['coupons','Coupons attached'],['unc','Uncancelled']].map(([k,l])=>ck('bool',k,l,cnt(i=>i[k]),F[k])).join('');
      const has = F.q||F.subs.length||F.pmin||F.pmax||F.ymin||F.ymax||F.st.length||F.cond.length||F.size.length||F.type.length||F.signed||F.coupons||F.unc||['printer','region','state','city'].some(k=>F[k]!=='all');
      return '<div class="rail-top"><h3>Refine '+esc(S.CATNAME[slug]||'')+'</h3>'+
          (has?'<button class="clr" id="fsClear" type="button">Clear all</button>':'')+
          '<button class="fs-close" id="fsClose" type="button" aria-label="Close filters"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
        grp('Keyword', '<form class="frow" id="fsQ"><input type="text" id="fsQin" placeholder="Company, signer, item ID…" value="'+q(S.strip(F.q))+'"><button class="btn btn-navy" type="submit" style="padding:8px 12px;">Go</button></form>')+
        grp('Subcategory', SUBS.length?'<div class="fscroll">'+SUBS.map(s=>ck('sub',s,esc(s),cnt(i=>i.tags.indexOf(s)!==-1),F.subs.indexOf(s)!==-1)).join('')+'</div>':'', SUBS.length)+
        grp('Price', '<div class="frow"><input type="number" id="fsPmin" placeholder="Min $" value="'+F.pmin+'"><span class="dash">–</span><input type="number" id="fsPmax" placeholder="Max $" value="'+F.pmax+'"></div>'+
          (pBands.length?'<div class="bands">'+pBands.map(([a,b])=>'<button type="button" class="band'+(F.pmin==a&&String(F.pmax)===String(b||'')?' on':'')+'" data-pa="'+a+'" data-pb="'+(b||'')+'">'+(b?money(a)+'–'+money(b):money(a)+'+')+'</button>').join('')+'</div>':''))+
        grp('Date of issue', yBands.length?'<div class="frow"><input type="number" id="fsYmin" placeholder="From" value="'+F.ymin+'"><span class="dash">–</span><input type="number" id="fsYmax" placeholder="To" value="'+F.ymax+'"></div><div class="bands">'+yBands.map(([a,b])=>'<button type="button" class="band'+(F.ymin==a&&F.ymax==b?' on':'')+'" data-ya="'+a+'" data-yb="'+b+'">'+a+'–'+b+'</button>').join('')+'</div>':'')+
        grp('Availability', STATS.map(([k,l])=>ck('st',k,l,k==='soldonly'?cnt(i=>i.st==='sold'):cnt(i=>i.st===k),F.st.indexOf(k)!==-1)).join(''))+
        grp('Product type', types.length>1||F.type.length?types.map(t=>ck('type',t,esc(t),cnt(i=>i.type===t),F.type.indexOf(t)!==-1)).join(''):'')+
        grp('Size', SIZES.map(([k,l])=>{const b=S.SIZEBUCKET[k];return ck('size',k,l,cnt(i=>S.longest(i)>=b[0]&&S.longest(i)<b[1]),F.size.indexOf(k)!==-1);}).join(''), 'longest edge')+
        grp('Condition', CONDS.map(c=>ck('cond',c,c,cnt(i=>i.cond===c),F.cond.indexOf(c)!==-1)).join(''))+
        grp('Features', feats)+
        grp('Printer / engraver', selHTML('fsPrinter','printer','Any printer',uniq('printer')))+
        grp('Region', selHTML('fsRegion','region','Anywhere',uniq('region')))+
        grp('State / country', selHTML('fsState','state','Any state',states))+
        grp('City / area of issue', selHTML('fsCity','city','Any city',cities))+
        '<div class="rail-foot"><p class="hint">Can\'t find it? <a href="Contact.html">Tell us what you\'re hunting</a> and we\'ll write when it arrives.</p></div>';
    }
    function tog(arr,v){ const i=arr.indexOf(v); i<0?arr.push(v):arr.splice(i,1); }
    function go(){ shown = START; apply(); }
    function wireSidebar(){
      if(!side) return;
      const st = side.scrollTop;
      side.innerHTML = sidebarHTML();
      side.scrollTop = st;
    }
    if(side){
      side.classList.add('adv-rail');
      side.addEventListener('toggle', function(e){ const d=e.target; if(d.dataset&&d.dataset.g){ d.open?openSet.add(d.dataset.g):openSet.delete(d.dataset.g); } }, true);
      side.addEventListener('change', function(e){
        const t = e.target, d = t.dataset;
        if(d.sub!==undefined) tog(F.subs,d.sub);
        else if(d.st!==undefined) tog(F.st,d.st);
        else if(d.type!==undefined) tog(F.type,d.type);
        else if(d.size!==undefined) tog(F.size,d.size);
        else if(d.cond!==undefined) tog(F.cond,d.cond);
        else if(d.bool!==undefined) F[d.bool]=t.checked;
        else if(t.id==='fsPmin') F.pmin=t.value; else if(t.id==='fsPmax') F.pmax=t.value;
        else if(t.id==='fsYmin') F.ymin=t.value; else if(t.id==='fsYmax') F.ymax=t.value;
        else if(t.id==='fsPrinter') F.printer=t.value;
        else if(t.id==='fsRegion'){ F.region=t.value; F.state='all'; F.city='all'; }
        else if(t.id==='fsState'){ F.state=t.value; F.city='all'; }
        else if(t.id==='fsCity') F.city=t.value;
        else return;
        go();
      });
      side.addEventListener('click', function(e){
        const b = e.target.closest('.band');
        if(b){
          if(b.dataset.pa!==undefined){ if(b.classList.contains('on')){F.pmin='';F.pmax='';} else {F.pmin=b.dataset.pa;F.pmax=b.dataset.pb;} }
          else { if(b.classList.contains('on')){F.ymin='';F.ymax='';} else {F.ymin=b.dataset.ya;F.ymax=b.dataset.yb;} }
          go(); return;
        }
        if(e.target.closest('#fsClear')){ reset(); return; }
        if(e.target.closest('#fsClose')) closeMobile();
      });
      side.addEventListener('submit', function(e){
        if(e.target.id!=='fsQ') return;
        e.preventDefault(); F.q = document.getElementById('fsQin').value.trim(); go();
      });
    }
    function reset(){
      Object.assign(F, {q:'',subs:[],pmin:'',pmax:'',ymin:'',ymax:'',st:[],cond:[],size:[],printer:'all',region:'all',state:'all',city:'all',type:[],signed:false,coupons:false,unc:false});
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
      if(F.q) c.push(['q','','“'+esc(S.strip(F.q))+'”']);
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
          else if(k==='q') F.q='';
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
