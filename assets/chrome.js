/* LaBarre Galleries — shared site chrome (header, nav, footer + interactions) */
(function(){
  const HOME = "home.html";
  const home = encodeURI(HOME);

  const NAV = [
    {label:"New Items",          href:"New Items.html",        page:"new"},
    {label:"Autographs",        href:"Autographs.html",       page:"autographs"},
    {label:"Stocks &amp; Bonds", href:"Stocks and Bonds.html", page:"stocks-bonds"},
    {label:"Currency",          href:"Currency.html",         page:"currency"},
    {label:"Americana",         href:"Americana.html",        page:"americana"},
    {label:"Auctions",          href:"Auctions.html",         page:"auctions"},
    {label:"Shop by Decade",    href:"Shop by Decade.html",   page:"decades"},
    {label:"Events",            href:"Events.html",           page:"events"},
    {label:"Testimonials",      href:"Testimonials.html",     page:"testimonials"},
    {label:"About",             href:"About.html",            page:"about"},
  ];

  // ===== mega menu data =====
  const MEGA = {
    "autographs":{ cat:"Autographs.html", img:"assets/col-baltimore-ohio.jpg",
      cols:[
        {h:"Browse", subs:["Autographed Stocks & Bonds","Autographs of Famous People","Autographed Books","Exclusive Autograph Specials"]},
        {h:"By Subject", subs:["Famous Americans on Stocks & Bonds","Civil War","Railroad Stocks","Utility Stocks & Bonds"]},
        {h:"Formats", subs:["Railroad Bonds","Telephone & Telegraph","Real Estate","PASS-CO Authenticated"]},
      ],
      feat:{k:"Featured",h:"Signed by Chrysler",p:"B&O Railroad stock, endorsed by Jack F. Chrysler."} },
    "stocks-bonds":{ cat:"Stocks and Bonds.html", img:"assets/col-broadway-rr.jpg",
      cols:[
        {h:"Transport", subs:["Railroad Stocks","Railroad Bonds","Aviation Stocks","Automotive Stocks","Shipping Stocks"]},
        {h:"Industry & Finance", subs:["Mining Bonds","Mining Stocks","Utility Stocks & Bonds","Banking Stocks","Oil Stocks and Bonds"]},
        {h:"Regions & Eras", subs:["Colonial Bonds","Confederate Bonds","Foreign Bonds","Western Stocks & Bonds","Specimen Stocks & Bonds"]},
      ],
      feat:{k:"Featured Bond",h:"Broadway & 7th Ave. RR",p:"1884 $1,000 mortgage bond, eagle vignette."} },
    "currency":{ cat:"Currency.html", img:"assets/col-china-book.jpg",
      cols:[
        {h:"Paper Money", subs:["U.S.","Foreign","Checks"]},
        {h:"Coins & Specie", subs:["Coins"]},
      ],
      feat:{k:"Reference",h:"Foreign Bonds & Paper Money",p:"An illustrated collector's compendium."} },
    "americana":{ cat:"Americana.html", img:"assets/col-hawaiian-bell.jpg",
      cols:[
        {h:"Documents", subs:["Presidential","Civil War","Slavery Documents","Souvenir Cards"]},
        {h:"Ephemera", subs:["Advertising Art Calendars","Tobacco Labels","Cigar Box Labels","Music Sheets"]},
        {h:"Collectibles", subs:["Sports Memorabilia","Stamps","Animation Cels","Miscellaneous"]},
      ],
      feat:{k:"Featured",h:"Territorial Hawaii",p:"A Kingdom-era telephone specimen."} },
    "decades":{ cat:"Shop by Decade.html", img:"assets/col-southern-electric.jpg",
      cols:[
        {h:"By Decade", subs:[["1700s · Colonial & Founding","Shop by Decade.html"],["1800s · A Young Republic","Shop by Decade.html"],["1860s · Civil War Era","Shop by Decade.html"]]},
        {h:"\u00a0", subs:[["1880s · The Gilded Age","Shop by Decade.html"],["1900s · Industrial Boom","Shop by Decade.html"],["1920s · Roaring Twenties","Shop by Decade.html"]]},
      ],
      feat:{k:"Explore",h:"A walk through time",p:"Browse the inventory by the decade that made it."} },
    "auctions":{ cat:"Auctions.html", img:"assets/col-hawaiian-bell.jpg",
      cols:[
        {h:"Live Now", subs:[["Open Lots","Auctions.html"],["How Bidding Works","Auctions.html"],["Your Watchlist","Cart.html"],["Past Results","Archive.html"]]},
      ],
      feat:{k:"On the Block",h:"Rarities Sale \u2116 14",p:"300+ lots closing live this week."} },
  };
  function megaLink(cat, s){
    if(Array.isArray(s)) return '<a href="'+encodeURI(s[1])+'">'+s[0]+'</a>';
    return '<a href="'+encodeURI(cat)+'?f='+encodeURIComponent(s)+'">'+s+'</a>';
  }
  const PRODS = {
    "autographs":[{img:"assets/col-baltimore-ohio.jpg",h:"B&O Railroad, Signed",pr:290},{img:"assets/col-broadway-rr.jpg",h:"Presidential Endorsement",pr:8500}],
    "stocks-bonds":[{img:"assets/col-broadway-rr.jpg",h:"Broadway & 7th Ave. RR",pr:375},{img:"assets/col-hawaiian-bell.jpg",h:"Hawaiian Bell Telephone",pr:260}],
    "currency":[{img:"assets/col-china-book.jpg",h:"Foreign Bonds & Paper Money",pr:95},{img:"assets/col-southern-electric.jpg",h:"Obsolete Bank Note",pr:120}],
    "americana":[{img:"assets/col-hawaiian-bell.jpg",h:"Territorial Hawaii Specimen",pr:260},{img:"assets/col-broadway-rr.jpg",h:"War-Date Document",pr:8500}],
    "decades":[{img:"assets/col-southern-electric.jpg",h:"Gilded-Age Utility Bond",pr:120},{img:"assets/col-midwest-realty.jpg",h:"Modern Realty Stock",pr:45}],
    "auctions":[{img:"assets/col-broadway-rr.jpg",h:"Lot 214 · Broadway RR",pr:"Bid $335"},{img:"assets/col-baltimore-ohio.jpg",h:"Lot 221 · B&O Railroad",pr:"Bid $280"}],
  };
  const MEGA_INTRO = {
    "autographs":{t:"Autographs",p:"Signed certificates, letters and books &mdash; every hand verified in house.",n:"420+ signed pieces"},
    "stocks-bonds":{t:"Stocks &amp; Bonds",p:"Six million pieces of scripophily, from colonial issues to uncancelled bonds.",n:"1,900+ certificates"},
    "currency":{t:"Currency &amp; Coins",p:"U.S. and world paper money, obsoletes, errors, checks and specie.",n:"310+ notes &amp; coins"},
    "americana":{t:"Americana",p:"Presidential documents, label art, ephemera and the odd corners of history.",n:"640+ documents"},
    "decades":{t:"Shop by Decade",p:"Walk the inventory chronologically, 1700s through the twentieth century.",n:"Seven decades"},
    "auctions":{t:"Live Auctions",p:"Open lots closing this week, with reserve-free rarities each sale.",n:"300+ lots live"},
  };
  const MEGA_QUICK = [
    ["New Arrivals","New Items.html"],
    ["Live Auctions","Auctions.html"],
    ["Sold Archive","Archive.html"],
    ["Wholesale Lots","Wholesale.html"],
    ["Free Appraisals","Free Appraisals.html"],
  ];
  function megaPanel(page){
    const m = MEGA[page];
    if(!m) return '';
    const intro = MEGA_INTRO[page] || {t:'', p:'', n:''};
    const cols = m.cols.map(function(c){
      return '<div class="mega-col"><h4>'+c.h+'</h4>'+c.subs.map(function(s){return megaLink(m.cat,s);}).join('')+'</div>';
    }).join('');
    const prods = (PRODS[page]||[]).map(function(p){
      const price = (typeof p.pr === 'number') ? '$'+p.pr.toLocaleString() : p.pr;
      return '<a class="mp-card" href="Product.html"><div class="mpi"><img src="'+p.img+'" alt=""></div><div class="mpb"><h5>'+p.h+'</h5><span class="pr">'+price+'</span></div>'+
        '<span class="mparrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
    }).join('');
    const quick = MEGA_QUICK.map(function(q){ return '<a href="'+encodeURI(q[1])+'">'+q[0]+'</a>'; }).join('');
    return '<div class="mega-wrap"><div class="mega">'+
      '<div class="inner">'+
        '<div class="mega-intro">'+
          '<span class="mi-k">Department</span>'+
          '<h3>'+intro.t+'</h3>'+
          '<p>'+intro.p+'</p>'+
          '<a class="mi-all" href="'+encodeURI(m.cat)+'">Browse all'+
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'+
          '<span class="mi-n">'+intro.n+'</span>'+
        '</div>'+
        '<div class="mega-cols">'+cols+'</div>'+
        '<div class="mega-prods"><span class="mp-head">'+m.feat.k+'</span>'+prods+'</div>'+
      '</div>'+
      '<div class="mega-foot"><div class="mf-in"><span class="mf-k">Quick paths</span><div class="mf-links">'+quick+'</div>'+
        '<span class="mf-help">Need help? <a href="Contact.html">Talk to a specialist</a></span></div></div>'+
      '</div></div>';
  }

  function header(page){
    const navLinks = NAV.map(function(n){
      const active = n.page===page ? 'active' : '';
      const panel = megaPanel(n.page);
      if(panel){
        return '<div class="navitem"><a href="'+encodeURI(n.href)+'" class="has-mega '+active+'">'+n.label+'<span class="ncaret"></span></a>'+panel+'</div>';
      }
      return '<a href="'+encodeURI(n.href)+'" class="'+active+'">'+n.label+'</a>';
    }).join('');
    return `
<div class="util"><div class="wrap">
  <span class="l">Speak with a specialist · (603) 882-2411 · 1-800-717-9529</span>
  <div class="r">
    <a href="Sell to Us.html">Sell to Us</a>
    <a href="Free Appraisals.html">Free Appraisals</a>
    <a href="Contact.html">Contact &amp; Help</a>
    <a href="Account.html">Account</a>
  </div>
</div></div>

<header class="mast">
  <div class="mast-actions left">
    <button class="ibtn" id="searchToggle" aria-label="Search">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    </button>
  </div>
  <div class="mast-top">
    <a href="${home}" class="crest"><img src="assets/labarre-logo.png" alt="George H. LaBarre Galleries, Inc."></a>
  </div>
  <div class="mast-actions">
    <a class="ibtn" href="Account.html" aria-label="Account">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>
    </a>
    <a class="ibtn cartwrap" href="Cart.html" id="cartBtn" aria-label="Cart">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H2"/></svg>
      <span class="c">2</span>
    </a>
  </div>
</header>

<nav class="cats" id="navbar"><div class="wrap">${navLinks}</div></nav>

<div class="searchband" id="searchband"><div class="wrap">
  <div class="lbl"><span class="t">Search the Inventory</span><span class="ln"></span></div>
  <form class="bigsearch" onsubmit="return false;">
    <div class="search-scope">
      <select id="searchCat" aria-label="Search category">
        <option value="all">All Categories</option>
        <option value="autographs">Autographs</option>
        <option value="stocks-bonds">Stocks &amp; Bonds</option>
        <option value="currency">Currency &amp; Coins</option>
        <option value="americana">Americana</option>
        <option value="auctions">Auctions</option>
        <option value="archive">Archive</option>
      </select>
    </div>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input type="text" id="searchInput" placeholder="Search 2,400+ signed letters, certificates, currency &amp; bonds…">
    <button class="btn btn-navy" type="submit">Search
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </button>
  </form>
  <div class="searchhints">
    <span class="h">Popular searches</span>
    <a>Lincoln signed</a>
    <a>Confederate currency</a>
    <a>Mining bonds</a>
    <a>Railroad stocks</a>
    <a>Aviation autographs</a>
  </div>
</div></div>`;
  }

  function footer(){
    return `
<footer class="site" id="footer"><div class="wrap">
  <div class="ftop">
    <div class="fbrand">
      <a href="${home}" class="crest"><img src="assets/labarre-logo.png" alt="LaBarre Galleries"></a>
      <p>Original autographs, stock &amp; bond certificates, currency, and historical Americana for collectors of every kind.</p>
      <ul class="fcontact">
        <li><span>Landline</span><b>(603) 882-2411</b></li>
        <li><span>Toll-Free</span><b>1-800-717-9529</b></li>
        <li><span>Cell &amp; Text</span><b>(603) 769-9007</b></li>
        <li><span>Fax</span><b>(603) 882-4797</b></li>
        <li><span>Email</span><b>mail@glabarre.com</b></li>
        <li><span>WhatsApp · Teams</span><b>By appointment</b></li>
      </ul>
    </div>
    <div class="fcol">
      <h5>Shop</h5>
      <a href="New Items.html">New Items</a>
      <a href="Autographs.html">Autographs</a>
      <a href="Stocks and Bonds.html">Stocks &amp; Bonds</a>
      <a href="Currency.html">Currency &amp; Coins</a>
      <a href="Americana.html">Americana</a>
      <a href="Auctions.html">Live Auctions</a>
    </div>
    <div class="fcol">
      <h5>Collectors</h5>
      <a href="About Collecting.html">About Collecting</a>
      <a href="Wholesale.html">Wholesale</a>
      <a href="Shop by Decade.html">Shop by Decade</a>
      <a href="Archive.html">Archive</a>
      <a href="Articles.html">Articles</a>
      <a href="Related Links.html">Related Links</a>
      <a href="Authenticity Guarantee.html">Authenticity Guarantee</a>
      <a href="Sell to Us.html">Sell to Us</a>
      <a href="Free Appraisals.html">Free Appraisals</a>
    </div>
    <div class="fcol">
      <h5>Gallery</h5>
      <a href="About.html">Our Story</a>
      <a href="Events.html">Events</a>
      <a href="Testimonials.html">Testimonials</a>
      <a href="Contact.html">Contact</a>
      <a href="Shipping.html">Shipping</a>
      <a href="Returns.html">Returns</a>
      <a href="Journal.html">Journal</a>
    </div>
  </div>
  <div class="fbot">
    <span>© 2026 George H. LaBarre Galleries, Inc. All rights reserved.</span>
    <span class="pays">VISA · MC · AMEX · PAYPAL</span>
  </div>
</div></footer>`;
  }

  window.LB = {header, footer, HOME:home};

  // ===== chrome interactions =====
  document.addEventListener('DOMContentLoaded', function(){
    const nav = document.getElementById('navbar');
    if(nav){
      window.addEventListener('scroll', function(){
        const top = nav.getBoundingClientRect().top;
        nav.classList.toggle('stuck', top<=0 && window.scrollY>120);
      });
    }
    const st = document.getElementById('searchToggle');
    const si = document.getElementById('searchInput');
    if(st && si){
      st.addEventListener('click', function(){
        document.getElementById('searchband').scrollIntoView===undefined; // no-op guard
        window.scrollTo({top:0, behavior:'smooth'});
        setTimeout(()=>si.focus(), 320);
      });
    }
    document.querySelectorAll('.searchhints a').forEach(function(a){
      a.addEventListener('click', function(){
        if(si){ si.value = a.textContent; si.focus(); window.scrollTo({top:0, behavior:'smooth'}); }
      });
    });

    // ===== side cart drawer =====
    initCart();
  });

  var DEFAULT_CART = [
    {img:"assets/col-broadway-rr.jpg", e:"Bond · New York, 1884", h:"Broadway & Seventh Ave. Railroad", price:375, qty:1},
    {img:"assets/col-baltimore-ohio.jpg", e:"Stock · 1958 · Signed", h:"Baltimore & Ohio Railroad Co.", price:290, qty:1},
  ];
  function loadCart(){
    try{ var s = localStorage.getItem('lb_cart'); if(s) return JSON.parse(s); }catch(e){}
    return DEFAULT_CART.slice();
  }
  function saveCart(c){ try{ localStorage.setItem('lb_cart', JSON.stringify(c)); }catch(e){} }

  function initCart(){
    var cart = loadCart();
    var fmt = function(n){ return '$' + n.toLocaleString(); };

    document.body.insertAdjacentHTML('beforeend',
      '<div class="cart-overlay" id="cartOverlay"></div>' +
      '<aside class="cart-drawer" id="cartDrawer" aria-hidden="true">' +
        '<div class="cd-head"><h3>Your Cart<span class="ct" id="cdCount"></span></h3>' +
          '<button class="cd-close" id="cdClose" aria-label="Close cart"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="cd-items" id="cdItems"></div>' +
        '<div class="cd-empty" id="cdEmpty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H2"/></svg><span>Your cart is empty.</span></div>' +
        '<div class="cd-foot" id="cdFoot">' +
          '<div class="cd-sub"><span class="k">Subtotal</span><span class="v" id="cdSub"></span></div>' +
          '<p class="cd-note" id="cdNote"></p>' +
          '<a href="Cart.html" class="btn btn-navy">Checkout<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
          '<a href="Cart.html" class="btn btn-line">View Full Cart</a>' +
        '</div>' +
      '</aside>');

    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    var itemsEl = document.getElementById('cdItems');
    var emptyEl = document.getElementById('cdEmpty');
    var footEl = document.getElementById('cdFoot');

    function render(){
      var count = cart.reduce(function(s,i){return s+i.qty;},0);
      document.querySelectorAll('.cartwrap .c').forEach(function(b){ b.textContent = count; b.style.display = count>0?'':'none'; });
      document.getElementById('cdCount').textContent = count ? '· ' + count + ' item' + (count>1?'s':'') : '';
      var has = cart.length > 0;
      emptyEl.style.display = has ? 'none' : 'flex';
      footEl.style.display = has ? '' : 'none';
      itemsEl.innerHTML = cart.map(function(it,i){
        return '<div class="cd-item"><div class="th"><img src="' + it.img + '" alt="' + it.h + '"></div>' +
          '<div><span class="e">' + it.e + '</span><h4>' + it.h + '</h4>' +
          '<div class="ln"><div class="qty"><button data-dec="' + i + '">−</button><span class="qn">' + it.qty + '</span><button data-inc="' + i + '">+</button></div>' +
          '<span class="rm" data-rm="' + i + '">Remove</span></div></div>' +
          '<span class="lp">' + fmt(it.price*it.qty) + '</span></div>';
      }).join('');
      var sub = cart.reduce(function(s,i){return s+i.price*i.qty;},0);
      var subEl = document.getElementById('cdSub'); if(subEl) subEl.textContent = fmt(sub);
      var noteEl = document.getElementById('cdNote');
      if(noteEl) noteEl.textContent = sub>0 && sub<500 ? 'Add ' + fmt(500-sub) + ' more for free U.S. shipping.' : (sub>=500 ? 'You qualify for free U.S. shipping.' : '');
      saveCart(cart);
    }
    function open(){ render(); overlay.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
    function close(){ overlay.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }

    itemsEl.addEventListener('click', function(e){
      var inc=e.target.closest('[data-inc]'), dec=e.target.closest('[data-dec]'), rm=e.target.closest('[data-rm]');
      if(inc){ cart[+inc.dataset.inc].qty++; render(); }
      else if(dec){ var it=cart[+dec.dataset.dec]; if(it.qty>1){it.qty--;} else {cart.splice(+dec.dataset.dec,1);} render(); }
      else if(rm){ cart.splice(+rm.dataset.rm,1); render(); }
    });
    overlay.addEventListener('click', close);
    document.getElementById('cdClose').addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });

    var btn = document.getElementById('cartBtn');
    if(btn) btn.addEventListener('click', function(e){
      // let the dedicated Cart page act as the drawer's "full cart"; icon opens drawer
      if(document.body.dataset.page === 'cart') return; // on cart page, just navigate/no-op
      e.preventDefault(); open();
    });

    // expose for product/category "add to cart"
    window.LBcart = {
      add:function(item){
        var ex = cart.find(function(c){return c.h===item.h;});
        if(ex){ ex.qty += (item.qty||1); } else { cart.push(Object.assign({qty:1}, item)); }
        render(); open();
      },
      open:open, close:close, render:render
    };

    render();
  }
})();
