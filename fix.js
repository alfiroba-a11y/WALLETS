(() => {
  const style = document.createElement('style');
  style.textContent = `.mobile-nav{display:none}.crypto{padding:12px 0;border-top:1px solid #e4e6df}.privacy{font-family:monospace;letter-spacing:1px}@media(max-width:700px){.mobile-nav{position:fixed;z-index:10;bottom:0;left:0;right:0;height:66px;background:#fff;border-top:1px solid #e4e6df;display:grid;grid-template-columns:repeat(4,1fr)}.mobile-nav button{border:0;background:#fff;color:#70756f;font-size:11px}.mobile-nav button.active{color:#137650;font-weight:bold}main{padding-bottom:76px}}`;
  document.head.append(style);
  const mobile = document.createElement('nav');
  mobile.className = 'mobile-nav';
  mobile.innerHTML = '<button data-v="home">⌂<br>Home</button><button data-v="activity">◷<br>Activity</button><button data-v="cards">▣<br>Cards</button><button data-v="profile">◉<br>Profile</button>';
  document.querySelector('#app').append(mobile);
  const originalRender = window.render;
  window.render = function () {
    originalRender();
    const h = new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Nairobi',hour:'numeric',hour12:false}).format(new Date());
    const greeting = Number(h) < 12 ? 'GOOD MORNING' : Number(h) < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
    const small = document.querySelector('header small'); if (small) small.textContent = greeting;
    const cards = document.getElementById('cards');
    if (cards) { const c=user.card, crypto=(user.cryptoWallets||[]).map(x=>`<div class="crypto"><b>${x.asset} wallet</b><br><span class="privacy">${x.address}</span></div>`).join(''); cards.innerHTML=`<div class="head"><h2>Payment methods</h2></div><div class="box"><h3>Cards</h3>${c?`<h3>${c.brand} · •••• ${c.last4}</h3><p class="muted">${c.name} · ${c.country||user.country} · Expires ${c.expiry}</p><button onclick="card()">Edit linked card</button>`:`<p class="muted">No card linked.</p><button onclick="card()">Link card</button>`}<h3 style="margin-top:22px">Crypto</h3>${crypto||'<p class="muted">No crypto wallets linked.</p>'}</div>`; }
    document.querySelectorAll('.mobile-nav button').forEach(b=>b.classList.toggle('active',document.getElementById(b.dataset.v).classList.contains('active')));
  };
  window.card = function () { modal(`<h2>Link card</h2><p class="muted">Only card type, country, last four digits and expiry are saved.</p><form id="f"><div class="field"><label>Name on card</label><input name="name" value="${user.card?.name||user.name}" required></div><div class="field"><label>Card type</label><select name="brand"><option>Visa</option><option>Mastercard</option><option>American Express</option></select></div><div class="field"><label>Card country</label><select name="country">${Object.keys(rates).map(x=>`<option ${x===(user.card?.country||user.country)?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Last four digits</label><input name="last4" pattern="\\d{4}" maxlength="4" required></div><div class="field"><label>Expiry</label><input name="expiry" placeholder="12/29" required></div><button class="primary">Save linked card</button></form>`);$('f').onsubmit=async e=>{e.preventDefault();try{save(await api('/api/card','POST',Object.fromEntries(new FormData(e.target))));closeM()}catch(e){alert(e.message)}} };
  document.addEventListener('click', e => { const b=e.target.closest('.mobile-nav button'); if(b){ nav(b.dataset.v); document.querySelectorAll('.mobile-nav button').forEach(x=>x.classList.toggle('active',x===b)); } });
  window.render();
})();
