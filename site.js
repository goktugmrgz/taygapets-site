(function () {
  var P = window.TAYGA_PRODUCTS || [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var SWATCH = { turuncu: '#e4572e', petrol: '#0f5f74', vizon: '#d9cbb8', pembe: '#f2b6c6' };
  var BLURB = {
    'Ekinoks': 'Çift renk, göğüste köpek nakışı',
    'Vera': 'Sırtta zarif kemer nakışı',
    'Hakuna Matata': 'El yazısı ve köpek portresi',
    'Girift': 'Sırtın tamamında desen'
  };
  var PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';

  function sw(c) { return c.length > 1 ? 'linear-gradient(135deg,' + SWATCH[c[0]] + ' 50%,' + SWATCH[c[1]] + ' 50%)' : SWATCH[c[0]]; }
  function card(p, i) {
    var sibs = P.filter(function (x) { return x.collection === p.collection; });
    var opts = sibs.map(function (x) {
      return '<button type="button" class="card-sw' + (x === p ? ' is-on' : '') + '" data-slug="' + x.slug + '" aria-pressed="' + (x === p) + '" title="' + x.colour + '" aria-label="' + x.colour + '"><i style="background:' + sw(x.colours) + '"></i></button>';
    }).join('');
    return '<li class="card rv" style="--d:' + ((i % 4) * 0.07) + 's"><a href="urun.html?u=' + p.slug + '">' +
      '<span class="card-pic"><img src="p-' + p.slug + '-0.webp" alt="' + p.name + '" width="720" height="1080" loading="lazy">' +
      '<img src="p-' + p.slug + '-1.webp" alt="" width="720" height="1080" loading="lazy">' +
      '<span class="card-tag">' + p.collection + '</span><span class="card-add" aria-hidden="true">' + PLUS + '</span></span>' +
      '<span class="card-meta"><b>' + p.name + '</b><span>' + p.price + '</span></span></a>' +
      '<div class="card-opts" role="group" aria-label="Renk seçenekleri">' + opts +
      '<span class="card-n">' + sibs.length + ' renk</span></div></li>';
  }
  /* colour dots under a card swap that card to the chosen colour */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.card-sw');
    if (!b) return;
    var p = bySlug(b.dataset.slug), li = b.closest('.card'), a = $('a', li), im = $$('.card-pic img', li);
    a.href = 'urun.html?u=' + p.slug;
    im[0].src = 'p-' + p.slug + '-0.webp'; im[0].alt = p.name;
    im[1].src = 'p-' + p.slug + '-1.webp';
    $('.card-meta b', li).textContent = p.name;
    $('.card-meta span', li).textContent = p.price;
    $$('.card-sw', li).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    if (window.tpLang) window.tpLang();
  });
  function bySlug(s) { for (var i = 0; i < P.length; i++) if (P[i].slug === s) return P[i]; return null; }

  /* home: new products (same four as the live site) */
  var homeGrid = $('#newGrid');
  if (homeGrid) {
    homeGrid.innerHTML = ['ekinoks-petrol-turuncu', 'vera-petrol', 'hakuna-vizon', 'girift-turuncu']
      .map(function (s, i) { return card(bySlug(s), i); }).join('');
  }

  /* shop */
  var shop = $('#shopGrid');
  if (shop) {
    var state = { c: '', sort: 'onerilen' };
    var q = new URLSearchParams(location.search).get('k');
    if (q) state.c = q;
    var chips = $$('.chip');
    var count = $('#count');
    var render = function () {
      var list = P.filter(function (p) { return !state.c || p.collection === state.c; });
      var price = function (p) { return parseFloat(p.price.replace(/[^\d,]/g, '').replace(',', '.')); };
      if (state.sort === 'artan') list.sort(function (a, b) { return price(a) - price(b); });
      if (state.sort === 'azalan') list.sort(function (a, b) { return price(b) - price(a); });
      if (state.sort === 'isim') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'tr'); });
      shop.innerHTML = list.map(card).join('');
      count.textContent = list.length + ' ürün';
      if (window.tpLang) window.tpLang();
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.c === state.c)); });
      $$('.rv', shop).forEach(function (el) { el.classList.add('in'); });
    };
    chips.forEach(function (c) {
      var n = P.filter(function (p) { return !c.dataset.c || p.collection === c.dataset.c; }).length;
      c.insertAdjacentHTML('beforeend', '<small>' + n + '</small>');
      c.addEventListener('click', function () { state.c = c.dataset.c; render(); });
    });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    render();
  }

  /* product page */
  var pdp = $('#pdp');
  if (pdp) {
    var slug = new URLSearchParams(location.search).get('u') || 'vera-petrol';
    var p = bySlug(slug) || bySlug('vera-petrol');
    document.title = p.name + ' · Tayga Pets';
    $('#pName').textContent = p.name;
    $('#pCrumb').textContent = p.name;
    $('#pKicker').textContent = p.collection + ' koleksiyonu';
    $('#pPrice').textContent = p.price;
    $('#pDesc').textContent = p.desc;
    $('#pImg0').src = 'p-' + p.slug + '-0.webp'; $('#pImg0').alt = p.name;
    $('#pImg1').src = 'p-' + p.slug + '-1.webp'; $('#pImg1').alt = p.name + ', ikinci görsel';
    $$('.pBuy').forEach(function (a) { a.href = p.shopier || 'https://www.shopier.com/taygapets'; });
    var hint = $('#sizeHint');
    var CH = [34, 42, 50, 58, 66], NK = [31, 35, 38, 43, 45];
    $$('.sizes button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.sizes button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var i = +b.textContent - 1;
        hint.textContent = b.textContent + ' beden: boyun ' + NK[i] + ' cm, göğüs ' + CH[i] + ' cm'; if (window.tpLang) window.tpLang();
      });
    });
    /* colour options: the other colours of the same model */
    var COLOUR = { turuncu: 'Turuncu', petrol: 'Petrol', vizon: 'Vizon', pembe: 'Pembe' };
    var sw = function (c) {
      var a = SWATCH[c[0]], b = SWATCH[c[1] || c[0]];
      return 'linear-gradient(135deg,' + a + ' 50%,' + b + ' 50%)';
    };
    $('#pColour').textContent = p.colour;
    $('#swatches').innerHTML = P.filter(function (x) { return x.collection === p.collection; }).map(function (x) {
      var on = x.slug === p.slug;
      return '<a role="listitem" class="swatch' + (on ? ' is-on' : '') + '" href="urun.html?u=' + x.slug + '"' + (on ? ' aria-current="true"' : '') +
        ' title="' + x.colour + '"><span style="background:' + sw(x.colours) + '"></span><img src="p-' + x.slug + '-0.webp" alt="" width="72" height="96" loading="lazy"><b>' + x.colour + '</b></a>';
    }).join('');

    /* size finder on the product page */
    var pChest = $('#pChest');
    pChest.addEventListener('input', function () {
      var v = parseFloat(String(pChest.value).replace(',', '.')), s = 0;
      for (var i = 0; i < CH.length; i++) if (v <= CH[i]) { s = i + 1; break; }
      if (!(v > 0)) return;
      if (!s) { hint.textContent = 'Bu ölçü için bize WhatsApp\'tan yazın, birlikte bakalım.'; return; }
      $$('.sizes button')[s - 1].click();
      hint.textContent = 'Önerilen beden: ' + s + ' (göğüs ' + CH[s - 1] + ' cm\'ye kadar)'; if (window.tpLang) window.tpLang();
    });

    /* reviews: only real ones are shown */
    var REVIEWS = { 'hakuna-pembe': [{ n: 'Elsa', r: 5, t: 'Pembiş Hakuna Matata sweatshirtümüz çok tatlı. Kumaş cinsi ve nakış kalitesi o kadar güzel ki...' }] };
    var STAR = '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>';
    var revs = REVIEWS[p.slug] || [];
    $('#revScore').innerHTML = revs.length ? '<span class="stars">' + STAR.repeat(5) + '</span> 5,0 · ' + revs.length + ' değerlendirme' : 'Bu ürün için henüz değerlendirme yok. İlk yorumu siz yazın.';
    $('#revList').innerHTML = revs.map(function (r) {
      return '<li><span class="stars" aria-label="' + r.r + ' yıldız">' + STAR.repeat(r.r) + '</span><p>"' + r.t + '"</p><b>' + r.n + '</b></li>';
    }).join('');
    $$('[data-open-review]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); var f = $('#yorumYaz'); if (f) { f.hidden = false; f.querySelector('input').focus(); } });
    });

    var rel = P.filter(function (x) { return x.collection === p.collection && x.slug !== p.slug; });
    if (rel.length < 4) rel = rel.concat(P.filter(function (x) { return x.collection !== p.collection; }).slice(0, 4 - rel.length));
    $('#related').innerHTML = rel.slice(0, 4).map(card).join('');
    if (window.tpLang) window.tpLang();
  }

  /* size finder */
  var chest = $('#chest');
  if (chest) {
    var rows = $$('.stable tbody tr'), ans = $('#sizeOut');
    chest.addEventListener('input', function () {
      var v = parseFloat(String(chest.value).replace(',', '.'));
      rows.forEach(function (r) { r.classList.remove('is-hit'); });
      if (!(v > 0)) { ans.textContent = ''; return; }
      var CH = [34, 42, 50, 58, 66], s = 0;
      for (var i = 0; i < CH.length; i++) if (v <= CH[i]) { s = i + 1; break; }
      if (!s) { ans.textContent = 'Bu ölçü için bize yazın, birlikte bakalım.'; return; }
      ans.textContent = 'Önerilen beden: ' + s; if (window.tpLang) window.tpLang();
      rows[s - 1].classList.add('is-hit');
    });
  }

  /* forms: no server, so each form becomes a ready WhatsApp message */
  $$('form[data-wa]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [f.dataset.wa];
      var amt = $('.amounts [aria-pressed="true"]', f);
      if (amt) lines.push('Tutar: ' + amt.textContent);
      var star = $('input[type=radio]:checked', f);
      if (star) lines.push('Puan: ' + star.value + '/5');
      if (location.search.indexOf('u=') > -1 && $('#pName')) lines.push('Ürün: ' + $('#pName').textContent);
      $$('input:not([type=radio]), textarea, select', f).forEach(function (el) {
        var lab = el.id && $('label[for="' + el.id + '"]', f);
        if (el.value) lines.push((lab ? lab.textContent.replace(' *', '') : '') + ': ' + el.value);
      });
      window.open('https://wa.me/905312682567?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      var d = document.createElement('p');
      d.className = 'done';
      d.textContent = f.dataset.done;
      f.replaceWith(d);
      if (window.tpLang) window.tpLang();
    });
  });
  $$('.amounts .chip').forEach(function (c, i, all) {
    c.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true');
      $('#giftAmount').textContent = c.textContent;
    });
  });


  /* language: TR / EN. Turkish text stays in the page; English comes from the EN table below. */
  var EN = {
    'Ana İçeriğe Atla': 'Skip to content',
    '1250 TL ve üzeri alışverişlerde kargo ücretsiz!': 'Free shipping on orders of 1250 TL and over!',
    '1250 TL ve üzeri alışverişlerde kargo ücretsiz': 'Free shipping on orders of 1250 TL and over',
    'Anasayfa': 'Home', 'Ana Sayfa': 'Home', 'Mağaza': 'Shop', 'Hakkımızda': 'About Us', 'Satış Noktalarımız': 'Stockists',
    'İletişim': 'Contact', 'Beden Tablosu': 'Size Chart', 'Hediye Kartı': 'Gift Card', 'e-Hediye Kartı': 'e-Gift Card',
    'Topluluğumuza Katılın': 'Join Our Community', 'E-posta': 'Email', 'Katıl': 'Join', 'Menü': 'Menu', 'Bilgi': 'Information',
    'Kargo & İade': 'Shipping & Returns', 'Kargo ve İade': 'Shipping and Returns', 'Gizlilik Politikası': 'Privacy Policy',
    'Mesafeli Satış Sözleşmesi': 'Distance Sales Agreement', 'Bizi Değerlendirin': 'Rate Us', 'Bizi Değerlendirin!': 'Rate Us!',
    'Bize Ulaşın': 'Get in Touch', 'Bizi Takip Edin': 'Follow Us', 'Bize yazın': 'Message us', 'Hav!': 'Woof!',
    'E-posta adresiniz': 'Your email address',
    'Siparişleriniz 1-3 iş günü içerisinde kargoya verilir': 'Orders ship within 1-3 business days',
    '7 gün içinde iade': 'Returns within 7 days',
    'Yeni Ürünlerimiz': 'New Arrivals', 'Alışveriş Yap': 'Shop Now', 'Koleksiyonlar': 'Collections',
    'Biz Kimiz?': 'Who We Are', 'Yerini Al': 'Leave a Review', 'Takip Et': 'Follow',
    'Tayga Pets ailesinin en yeni kareleri': 'The latest from the Tayga Pets family',
    'Görüşlerini biz ve diğer kullanıcılarımızla paylaşmaya ne dersin?': 'Would you like to share your thoughts with us and our customers?',
    'Tümünü gör': 'See all', 'Yol tarifi': 'Directions', 'Ara': 'Call',
    'Ürünlerimiz': 'Our Products', 'Hepsi': 'All', 'Sırala': 'Sort', 'Sırala: Önerilen': 'Sort: Recommended',
    'Fiyat: Düşükten yükseğe': 'Price: Low to high', 'Fiyat: Yüksekten düşüğe': 'Price: High to low', 'İsim: A-Z': 'Name: A-Z',
    'Renk:': 'Colour:', 'Beden (isteğe bağlı)': 'Size (optional)', 'Bedenimi bul': 'Find my size',
    'Köpeğinizin göğüs ölçüsü (cm)': "Your dog's chest (cm)",
    'Ön bacakların hemen arkasından, göğsün en derin noktasından ölçün.': 'Measure around the deepest part of the chest, just behind the front legs.',
    "Shopier'den Satın Al": 'Buy on Shopier', 'Satın alma ve ödeme Shopier üzerinden yapılır.': 'Purchase and payment are completed on Shopier.',
    'Kargolama': 'Shipping', 'İade ve Değişim': 'Returns and Exchanges', 'İade': 'Returns', 'Değişim': 'Exchanges',
    'Sipariş İptali': 'Order Cancellation', 'Hasarlı Ürünler': 'Damaged Items',
    'Değerlendirmeler': 'Reviews', 'Bu ürün için henüz değerlendirme yok. İlk yorumu siz yazın.': 'No reviews yet. Be the first to write one.',
    'Yorum yaz': 'Write a review', 'Puanınız': 'Your rating', 'Yorumunuz': 'Your review', 'Gönder': 'Send',
    'Bunları da sevebilirsiniz': 'You may also like',
    'Beden': 'Size', 'Boyun (cm)': 'Neck (cm)', 'Göğüs (cm)': 'Chest (cm)', 'Sırt (cm)': 'Back (cm)',
    'Ad': 'First name', 'Soyad': 'Last name', 'Hizmetlerimizi Değerlendirin': 'Rate our service',
    'En çok neyi beğendiniz?': 'What did you like most?', 'Kendimizi nasıl geliştirebiliriz?': 'How can we improve?',
    'Fotoğraf Gönder': 'Send a photo', 'Desteklenen dosyaları yükleyin (En fazla 15 MB)': 'Upload supported files (up to 15 MB)',
    'Tutar': 'Amount', 'Adet': 'Quantity', 'Hediye kartı kimin için?': 'Who is the gift card for?',
    'Başkası için': 'Someone else', 'Kendim için': 'Myself', 'Alıcı e-postası *': 'Recipient email *', 'Alıcı adı': 'Recipient name',
    'Teslimat tarihi': 'Delivery date', 'Teslimat zamanı': 'Delivery time', 'Şimdi': 'Now', 'Mesaj': 'Message',
    'Hemen Satın Al': 'Buy Now', 'Telefon': 'Phone', '1-3 iş günü': '1-3 business days',
    'Siparişleriniz bu süre içinde kargoya verilir': 'Your order ships within this time',
    '7 gün': '7 days', 'Teslim aldıktan sonra iade süresi': 'Return window after delivery',
    "1250 TL'ye kadar olan siparişlerde kargo ücreti": 'Shipping fee on orders up to 1250 TL',
    'Vera koleksiyonu': 'Vera collection', 'Ekinoks koleksiyonu': 'Ekinoks collection',
    'Hakuna Matata koleksiyonu': 'Hakuna Matata collection', 'Girift koleksiyonu': 'Girift collection',
    'Turuncu': 'Orange', 'Pembe': 'Pink', 'Vizon': 'Mink',
    "Yeni modeller ve haberler için bizi Instagram'da takip edin.": 'Follow us on Instagram for new designs and news.',
    'Köpeğinizin fotoğrafını WhatsApp sohbetine ekleyebilirsiniz.': "You can add a photo of your dog in the WhatsApp chat.",
    'WhatsApp ile Gönder': 'Send via WhatsApp', 'WhatsApp ile Sipariş Ver': 'Order via WhatsApp',
    'Hediye kartı her zaman iyi bir fikirdir. Bu hediyeyi kişiselleştirmek için bir tutar seçip özel bir mesaj yazın.': 'A gift card is always a good idea. Choose an amount and write a personal message to make it special.',
    'Hediye kartının süresi, satın alım tarihinden 6 ay sonra dolar.': 'The gift card expires 6 months after the purchase date.',
    'Alıcı e-postası': 'Recipient email',
    'Siparişiniz WhatsApp üzerinden alınır, ödeme bilgilerini size iletiriz.': 'Orders are taken on WhatsApp, and we will send you the payment details.',
    'WhatsApp açıldı. Mesajınızı gönderdiğinizde bize ulaşacak, teşekkürler!': 'WhatsApp is open. Your message will reach us once you send it. Thank you!'
  };
  var LONG = window.TP_EN || {};
  var EN_RX = [
    [/^(\d+) ürün$/, '$1 products'], [/^(\d+) renk$/, '$1 colours'], [/^([\d,]+) · 1 değerlendirme$/, '$1 · 1 review'], [/^([\d,]+) · (\d+) değerlendirme$/, '$1 · $2 reviews'],
    [/Turuncu/g, 'Orange'], [/Pembe/g, 'Pink'], [/Vizon/g, 'Mink'], [/Telefon:/, 'Phone:'], [/^Önerilen beden: (\d)(.*)$/, 'Suggested size: $1'], [/^(\d) beden: boyun (\d+) cm, göğüs (\d+) cm$/, 'Size $1: neck $2 cm, chest $3 cm'],
    [/^Bu ölçü için bize.*$/, 'Message us about this measurement and we will help.'], [/ koleksiyonu$/, ' collection']
  ];
  var orig = new WeakMap(), lang = 'tr';
  function toEn(s) {
    var t = s.trim(), lead = s.slice(0, s.indexOf(t)), tail = s.slice(s.indexOf(t) + t.length);
    if (!t) return s;
    if (EN[t]) return lead + EN[t] + tail;
    var k = t.replace(/\s+/g, ' ');
    if (LONG[k]) return lead + LONG[k] + tail;
    if (t.charAt(0) === '/' && EN[t.slice(1).trim()]) return lead + '/ ' + EN[t.slice(1).trim()] + tail;
    var r = t;
    EN_RX.forEach(function (x) { r = r.replace(x[0], x[1]); });
    return lead + r + tail;
  }
  function applyLang() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (n.parentElement.closest('script,style,svg,.review blockquote')) continue;
      if (!orig.has(n)) orig.set(n, n.nodeValue);
      var o = orig.get(n);
      n.nodeValue = lang === 'en' ? toEn(o) : o;
    }
    $$('[placeholder]').forEach(function (el) {
      if (!el.dataset.ph) el.dataset.ph = el.placeholder;
      el.placeholder = lang === 'en' ? toEn(el.dataset.ph) : el.dataset.ph;
    });
    document.documentElement.lang = lang;
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }
  window.tpLang = applyLang;
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('tp-lang', lang); } catch (e) {}
      applyLang();
    });
  });
  try { lang = localStorage.getItem('tp-lang') === 'en' ? 'en' : 'tr'; } catch (e) {}
  if (lang === 'en') applyLang();

  /* phone menu */
  var drawer = $('#drawer');
  $$('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      $$('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', String(open)); });
    });
  });

  /* header line */
  var top = $('.top');
  var heroImg = $('.hero-pic img');
  var sides = $$('.film-v.side');

  /* running cavalier: runs while the page moves, rests when it stops */
  var runner = $('.runner');
  var timer, lastY = window.scrollY, ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, y / max));
    top.classList.toggle('is-stuck', y > 8);
    if (runner) {
      runner.style.setProperty('--p', p.toFixed(4));
      if (y !== lastY) runner.classList.toggle('back', y < lastY);
      runner.classList.toggle('at-end', p > 0.995);
    }
    if (heroImg && !reduce) heroImg.parentNode.style.setProperty('--hs', (1.06 - Math.min(y, 600) / 600 * 0.06).toFixed(3));
    if (!reduce) sides.forEach(function (v, i) {
      var r = v.getBoundingClientRect();
      var c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      v.style.setProperty('--fy', (c * (i ? -60 : 60)).toFixed(1) + 'px');
    });
    lastY = y;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    if (runner && !reduce) {
      document.body.classList.add('running');
      clearTimeout(timer);
      timer = setTimeout(function () { document.body.classList.remove('running'); }, 160);
    }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* entrances arm on the first scroll so the page is complete at rest */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    window.addEventListener('scroll', function arm() {
      var vh = window.innerHeight;
      $$('.rv').forEach(function (el) {
        if (el.getBoundingClientRect().top < vh) el.classList.add('in'); else io.observe(el);
      });
      document.documentElement.classList.add('armed');
    }, { passive: true, once: true });
  }

  /* clips play only on screen */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !reduce) e.target.play().catch(function () {}); else e.target.pause(); });
    }, { threshold: 0.15 });
    $$('video').forEach(function (v) { vio.observe(v); });
  }
})();
