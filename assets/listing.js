/* LaBarre Galleries — category listing + filter sidebar */
(function(){
  const IMG = {
    broadway:"assets/col-broadway-rr.jpg",
    midwest:"assets/col-midwest-realty.jpg",
    bo:"assets/col-baltimore-ohio.jpg",
    china:"assets/col-china-book.jpg",
    southern:"assets/col-southern-electric.jpg",
    hawaii:"assets/col-hawaiian-bell.jpg",
  };
  const CATALOG = {
    "autographs":[
      {img:IMG.bo, badge:"Signed", e:"Stock · 1958", h:"Baltimore &amp; Ohio Railroad, Signed", d:"100 shares, endorsed by Jack F. Chrysler.", pr:290, tags:["Autographed Stocks & Bonds","Railroad Stocks","Famous Americans on Stocks & Bonds"]},
      {img:IMG.broadway, badge:"Rare", e:"Letter · 1863", h:"Presidential Endorsement", d:"One page, ink on laid paper, war date.", pr:8500, tags:["Autographs of Famous People","Civil War"]},
      {img:IMG.hawaii, badge:"New", e:"Document · 1880", h:"Hawaiian Bell, Officer-Signed", d:"Specimen countersigned by the secretary.", pr:260, tags:["Autographed Stocks & Bonds","Telephone & Telegraph"]},
      {img:IMG.southern, badge:"Signed", e:"Bond · 1960", h:"Utility Financier's Autograph Bond", d:"Full coupon sheet, presentation ink.", pr:120, tags:["Autographed Stocks & Bonds","Utility Stocks & Bonds"]},
      {img:IMG.midwest, badge:"Available", e:"Stock · 1975", h:"Midwest Realty, Founder-Signed", d:"200 shares, original signature.", pr:45, tags:["Autographed Stocks & Bonds","Real Estate"]},
      {img:IMG.china, badge:"Reference", e:"Compendium", h:"Signed Scholar's Reference", d:"Inscribed by John M. Thomson.", pr:95, tags:["Autographed Books"]},
      {img:IMG.broadway, badge:"Available", e:"Bond · 1884", h:"Railroad Treasurer's Bond", d:"No. 212, signed with partial coupons.", pr:340, tags:["Autographed Stocks & Bonds","Railroad Bonds"]},
      {img:IMG.bo, badge:"Available", e:"Stock · 1955", h:"B&amp;O Railroad, Countersigned", d:"50 shares, brown border.", pr:165, tags:["Autographed Stocks & Bonds","Railroad Stocks"]},
      {img:IMG.hawaii, badge:"New", e:"Document · 1880", h:"Telephone Charter Autograph", d:"Single specimen, presentation.", pr:145, tags:["Autographed Stocks & Bonds","Telephone & Telegraph"]},
      {img:IMG.southern, badge:"Available", e:"Bond · 1962", h:"Generating Co. Signed Series", d:"$500 series, engraved signature.", pr:115, tags:["Autographed Stocks & Bonds","Utility Stocks & Bonds"]},
    ],
    "stocks-bonds":[
      {img:IMG.broadway, badge:"New", e:"Bond · New York, 1884", h:"Broadway &amp; Seventh Avenue Railroad", d:"$1,000 mortgage bond, eagle vignette.", pr:375, tags:["Railroad Bonds","Early Stocks and Bonds"]},
      {img:IMG.bo, badge:"Signed", e:"Stock · 1958", h:"The Baltimore &amp; Ohio Railroad Co.", d:"100 shares — Jack F. Chrysler.", pr:290, tags:["Railroad Stocks","Autographed Stocks & Bonds"]},
      {img:IMG.southern, badge:"Available", e:"Bond · 1960", h:"Southern Electric Generating Co.", d:"$1,000 bond, full coupon sheet.", pr:120, tags:["Utility Stocks & Bonds","General Bonds"]},
      {img:IMG.hawaii, badge:"Rare", e:"Stock · Honolulu, 1880", h:"Hawaiian Bell Telephone Company", d:"Unissued specimen pair.", pr:260, tags:["Telephone & Telegraph","Specimen Stocks & Bonds","Alaska & Hawaii"]},
      {img:IMG.midwest, badge:"Available", e:"Stock · Utah, 1975", h:"Midwest Realty &amp; Finance, Inc.", d:"200 shares, green border.", pr:45, tags:["Real Estate","New York Land & Real Estate"]},
      {img:IMG.broadway, badge:"Available", e:"Bond · 1884", h:"Broadway &amp; Seventh Ave. Railroad", d:"No. 212, partial coupons.", pr:340, tags:["Railroad Bonds"]},
      {img:IMG.bo, badge:"Available", e:"Stock · 1955", h:"The Baltimore &amp; Ohio Railroad Co.", d:"50 shares, brown.", pr:165, tags:["Railroad Stocks"]},
      {img:IMG.southern, badge:"Available", e:"Bond · 1962", h:"Southern Electric Generating Co.", d:"$500 series.", pr:115, tags:["Utility Stocks & Bonds"]},
      {img:IMG.hawaii, badge:"Available", e:"Stock · 1880", h:"Hawaiian Bell Telephone Co.", d:"Single specimen.", pr:145, tags:["Telephone & Telegraph","Specimen Stocks & Bonds"]},
      {img:IMG.midwest, badge:"Available", e:"Stock · 1974", h:"Midwest Realty &amp; Finance", d:"100 shares.", pr:38, tags:["Real Estate"]},
      {img:IMG.broadway, badge:"New", e:"Bond · 1886", h:"Standard Mining Co. Bond", d:"Steel-engraved vignette, uncancelled.", pr:320, tags:["Mining Bonds","Mining Stocks","Western Stocks & Bonds"]},
      {img:IMG.china, badge:"Reference", e:"Compendium", h:"Historic Foreign Bonds of China", d:"John M. Thomson reference.", pr:95, tags:["Foreign Bonds","Chinese Bonds"]},
    ],
    "currency":[
      {img:IMG.china, badge:"Reference", e:"Compendium", h:"Foreign Bonds &amp; Paper Money", d:"Illustrated reference, hardbound.", pr:95, tags:["Foreign"]},
      {img:IMG.southern, badge:"New", e:"Note · 1962", h:"Obsolete Bank Note Series", d:"Crisp, engraved, uncirculated.", pr:120, tags:["U.S."]},
      {img:IMG.midwest, badge:"Available", e:"Scrip · 1975", h:"Depression-Era Scrip", d:"Local issue, fine condition.", pr:45, tags:["U.S."]},
      {img:IMG.broadway, badge:"Rare", e:"Note · 1884", h:"Railroad Payment Note", d:"Vignette border, signed.", pr:340, tags:["U.S."]},
      {img:IMG.bo, badge:"Available", e:"Coupon · 1958", h:"Coupon Bond Sheet", d:"Attached coupons, unredeemed.", pr:165, tags:["U.S."]},
      {img:IMG.hawaii, badge:"New", e:"Territorial · 1880", h:"Territorial Paper", d:"Honolulu issue, specimen.", pr:260, tags:["U.S."]},
      {img:IMG.southern, badge:"Available", e:"Note · 1960", h:"Utility Payment Certificate", d:"Full coupon sheet.", pr:115, tags:["U.S."]},
      {img:IMG.midwest, badge:"Available", e:"Scrip · 1974", h:"Municipal Scrip", d:"Green border, crisp.", pr:38, tags:["U.S."]},
    ],
    "americana":[
      {img:IMG.broadway, badge:"Rare", e:"1863 · Civil War", h:"Presidential War-Date Document", d:"One page, ink on laid paper.", pr:8500, tags:["Presidential","Civil War"]},
      {img:IMG.hawaii, badge:"New", e:"1880 · Territorial", h:"Hawaiian Telephone Americana", d:"Specimen from the Kingdom era.", pr:260, tags:["Souvenir Cards","Miscellaneous"]},
      {img:IMG.china, badge:"Reference", e:"Compendium", h:"Historical Reference Volume", d:"Illustrated, inscribed.", pr:95, tags:["Miscellaneous"]},
      {img:IMG.bo, badge:"Signed", e:"1958 · Industry", h:"Chrysler-Signed Railroad Piece", d:"100 shares, autograph.", pr:290, tags:["Presidential","Miscellaneous"]},
      {img:IMG.southern, badge:"Available", e:"1960 · Industry", h:"Mid-Century Utility Bond", d:"Engraved, full coupons.", pr:120, tags:["Miscellaneous"]},
      {img:IMG.broadway, badge:"Available", e:"1884 · Gilded Age", h:"Gilded-Age Railroad Bond", d:"Eagle vignette.", pr:375, tags:["Advertising Art Calendars","Miscellaneous"]},
      {img:IMG.midwest, badge:"Available", e:"1975 · Modern", h:"Western Realty Certificate", d:"200 shares.", pr:45, tags:["Miscellaneous"]},
      {img:IMG.hawaii, badge:"Available", e:"1880 · Territorial", h:"Island Charter Specimen", d:"Single piece.", pr:145, tags:["Stamps","Miscellaneous"]},
    ],
  };

  // taxonomy: {name, page? , subs:[]}  — page set means "is a category we have a page for"
  const TAX = [
    {name:"Collect by Countries", link:true},
    {name:"Collect by States", link:true},
    {name:"Uncancelled Stocks and Bonds", subs:["Chinese Bonds","Cuban Stocks and Bonds","German Stocks and Bonds","Japan Stocks and Bonds","Mexican Stocks & Bonds","Russian Bonds"]},
    {name:"Autographs", key:"autographs", subs:["Autographed Stocks & Bonds","Autographs of Famous People","Autographed Books","Exclusive Autograph Specials"]},
    {name:"Stocks and Bonds", key:"stocks-bonds", subs:["Alaska & Hawaii","Animals on Stocks and Bonds","Agricultural Stocks & Bonds","Atchison, Topeka & Santa Fe Railroad Archive","Automotive Stocks","Automotive Bonds","Aviation Stocks","Aviation Bonds","Banking Bonds","Banking Stocks","Breweries & Distilleries","Canal Stocks & Bonds","Candy & Ice Cream Stocks","Cattle, Horses & Meat Packing","Certificate #1 Stocks & Bonds","Civil War","Clocks and Watches","Clubs","Colonial Bonds","Confederate Bonds","Connecticut Revolutionary War Bonds, Pay Orders, etc.","Early Stocks and Bonds","Early Turnpike Stocks","Entertainment Stocks & Bonds","Express","Famous Americans on Stocks & Bonds","Foreign Stocks","Foreign Checks","Foreign Bonds","Foreign Documents","Foreign Miscellaneous","General Stocks","General Bonds","Gun Stocks & Bonds","High Denominations Stocks and Bonds","Hotel Stocks & Bonds","Ice Companies","Imprinted Revenues","Indians","Insurance","Investment Stocks and Bonds","Japan Stocks and Bonds","Lumber Stocks & Bonds","Medical & Pharmaceutical Stocks","Mining Stocks","Mining Bonds","New York Land & Real Estate","Northern Pacific RR Archives","Oil Stocks and Bonds","PASS-CO Authenticated","Patents","Phonograph Stocks & Bonds","Photography","Printers & Publishers","Proofs","Quarry Stocks and Bonds","Radio Stocks","Railroad Equipment","Railroad Stocks","Railroad Bonds","Real Estate","Shipping Stocks","Shipping Bonds","Southern State Bonds","Space","Specimen Stocks & Bonds","Sports Stocks & Bonds","Telephone & Telegraph","Texas Stocks and Bonds, etc.","Tobacco & Cigar Stocks and Bonds","U. S. Treasury Bonds, etc.","Utility Stocks & Bonds","Washington & Lincoln on Stocks & Bonds","Western Stocks & Bonds","World's Fair"]},
    {name:"Currency", key:"currency", subs:["Foreign","U.S.","Checks","Coins"]},
    {name:"Americana", key:"americana", subs:["Ad Notes","Advertising Art Calendars","Animation Cels","Tobacco Labels","Cigar Box Labels","Civil War","Fruit Crate Labels","Music Sheets","Slavery Documents","Souvenir Cards","Sports Memorabilia","Stamps","Presidential","Miscellaneous"]},
    {name:"Miscellaneous", subs:["George LaBarre Gallery Gift Cards","American Bank Note Company","200 Greatest & Wealthiest Americans","Gifts, Collections & Framed Pieces","Supplies, Books, Albums","Wholesale","Collector's Insight & Advice","Scripophily FAQs","Printed Catalogs","Lists"]},
    {name:"Articles - Stocks and Bonds", link:true},
  ];
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

  document.addEventListener('DOMContentLoaded', function(){
    const grid = document.getElementById('grid');
    if(!grid) return;
    const slug = document.body.dataset.page;
    const all = (CATALOG[slug] || []).slice();
    const START = 8, BATCH = 4;
    let shown = START, activeSub = null, sortMode = 'feat', data = all.slice();
    const fParam = new URLSearchParams(location.search).get('f');
    if(fParam) activeSub = fParam;

    // counts per subcategory within this category
    const counts = {};
    all.forEach(it => (it.tags||[]).forEach(t => { counts[t] = (counts[t]||0)+1; }));

    // ---- sidebar ----
    const side = document.getElementById('filtersSide');
    if(side){
      side.innerHTML =
        '<div class="fs-head"><span class="t">Filter</span>'+
        '<button class="clr" id="fsClear">Clear all</button>'+
        '<button class="fs-close" id="fsClose" aria-label="Close filters"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
        '<div class="fs-scroll">' + TAX.map(g => {
          const openCls = (g.key === slug) ? ' open' : '';
          if(g.link){
            return '<div class="fgroup islink"><button class="gh" type="button" data-link="1">'+esc(g.name)+'<span class="chev"></span></button></div>';
          }
          const subs = g.subs.map(s => {
            const c = counts[s] || 0;
            return '<a data-sub="'+encodeURIComponent(s)+'" class="'+(c?'':'muted')+'">'+esc(s)+(c?'<span class="cnt">'+c+'</span>':'')+'</a>';
          }).join('');
          return '<div class="fgroup'+openCls+'"><button class="gh" type="button">'+esc(g.name)+'<span class="chev"></span></button><div class="fsubs">'+subs+'</div></div>';
        }).join('') + '</div>';

      side.querySelectorAll('.fgroup:not(.islink) .gh').forEach(function(h){
        h.addEventListener('click', function(){ h.parentElement.classList.toggle('open'); });
      });
      side.querySelectorAll('.fsubs a').forEach(function(a){
        a.addEventListener('click', function(e){
          e.preventDefault();
          const sub = decodeURIComponent(a.dataset.sub);
          activeSub = (activeSub === sub) ? null : sub;
          shown = START; apply(); closeMobile();
        });
      });
      document.getElementById('fsClear').addEventListener('click', function(){ activeSub=null; shown=START; apply(); });
      document.getElementById('fsClose').addEventListener('click', closeMobile);
      // preset filter from mega-menu: open its group
      if(activeSub){
        side.querySelectorAll('.fsubs a').forEach(function(a){
          if(decodeURIComponent(a.dataset.sub) === activeSub) a.closest('.fgroup').classList.add('open');
        });
      }
    }

    // ---- mobile toggle + overlay ----
    const overlay = document.createElement('div'); overlay.className='filter-overlay'; document.body.appendChild(overlay);
    const toggle = document.getElementById('filterToggle');
    function openMobile(){ side && side.classList.add('open'); overlay.classList.add('open'); }
    function closeMobile(){ side && side.classList.remove('open'); overlay.classList.remove('open'); }
    if(toggle) toggle.addEventListener('click', openMobile);
    overlay.addEventListener('click', closeMobile);

    // ---- sort + load more ----
    const sel = document.getElementById('sortSel');
    if(sel) sel.addEventListener('change', function(){ sortMode = sel.value; shown = START; apply(); });
    const more = document.getElementById('loadMore');
    if(more) more.addEventListener('click', function(){ shown += BATCH; render(); });

    function sortData(arr){
      if(sortMode==='pl') arr.sort((a,b)=>a.pr-b.pr);
      else if(sortMode==='ph') arr.sort((a,b)=>b.pr-a.pr);
      else if(sortMode==='az') arr.sort((a,b)=>a.h.replace(/&amp;/g,'&').localeCompare(b.h.replace(/&amp;/g,'&')));
      return arr;
    }
    function apply(){
      data = all.filter(it => !activeSub || (it.tags||[]).indexOf(activeSub) !== -1);
      sortData(data);
      side && side.querySelectorAll('.fsubs a').forEach(a => a.classList.toggle('active', decodeURIComponent(a.dataset.sub)===activeSub));
      // active filter chip
      const af = document.getElementById('activeFilters');
      if(af){
        af.innerHTML = activeSub
          ? '<span class="lead">Filtered:</span><span class="chip">'+esc(activeSub)+'<button id="chipX" aria-label="Remove filter">×</button></span>'
          : '';
        const x = document.getElementById('chipX');
        if(x) x.addEventListener('click', function(){ activeSub=null; shown=START; apply(); });
      }
      const clr = document.getElementById('fsClear'); if(clr) clr.classList.toggle('show', !!activeSub);
      render();
    }
    function card(it){
      return '<a href="Product.html" class="prod"><div class="pimg"><span class="badge">'+it.badge+'</span>'+
        '<div class="pshot"><img src="'+it.img+'" alt="'+it.h.replace(/&amp;/g,'&')+'" loading="lazy"></div>'+
        '<span class="zoom"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg></span></div>'+
        '<div class="pbody"><span class="e">'+it.e+'</span><h3>'+it.h+'</h3><span class="d">'+it.d+'</span>'+
        '<div class="prow"><span class="pr"><span class="s">Buy Now</span>$'+it.pr.toLocaleString()+'</span><span class="add">Add to Cart<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></div></a>';
    }
    function render(){
      const cEl = document.getElementById('count'); if(cEl) cEl.textContent = data.length;
      if(data.length === 0){
        grid.innerHTML = '<div class="empty-grid" style="grid-column:1/-1;">No pieces currently listed under &ldquo;'+esc(activeSub||'')+'&rdquo; in this category.<br><button class="btn btn-line" id="emptyClear" type="button">Clear filter</button></div>';
        const ec = document.getElementById('emptyClear'); if(ec) ec.addEventListener('click', function(){ activeSub=null; shown=START; apply(); });
      } else {
        grid.innerHTML = data.slice(0, shown).map(card).join('');
      }
      const left = data.length - shown;
      if(more){
        if(left<=0 || data.length===0){ more.style.display='none'; }
        else { more.style.display=''; }
      }
      const rem = document.getElementById('rem');
      if(rem) rem.textContent = data.length===0 ? '' : (left<=0 ? 'Showing all '+data.length+' pieces' : left+' more piece'+(left===1?'':'s'));
    }
    apply();
  });
})();
