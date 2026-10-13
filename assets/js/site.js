/* Twelve:21 Braids & Crowns — site script (vanilla, no dependencies) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BOOK = 'https://twelve21braidsandcrowns.as.me/';

  /* ---------- Mobile menu ---------- */
  var btn = doc.querySelector('.menu-btn'), nav = doc.getElementById('mnav');
  if (btn && nav) {
    var closeBtn = nav.querySelector('.mnav-close');
    var open = function () {
      nav.hidden = false; btn.setAttribute('aria-expanded', 'true');
      doc.body.style.overflow = 'hidden';
      (nav.querySelector('a') || closeBtn).focus();
    };
    var close = function (ret) {
      nav.hidden = true; btn.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = '';
      if (ret !== false) btn.focus();
    };
    btn.addEventListener('click', function () { nav.hidden ? open() : close(); });
    closeBtn && closeBtn.addEventListener('click', function () { close(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) close(); });
    nav.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href').charAt(0) === '#') close(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  var targets = doc.querySelectorAll('.rv, .hd, .laser, .cta-band, .art-panel, .emblem-div');
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        // already on screen at load: reveal on next frame so the transition still plays
        requestAnimationFrame(function () { el.classList.add('is-in'); });
      } else { io.observe(el); }
    });
  }

  /* ---------- Gold Line v2: looping art. Poster first (LCP); phones load only the phone file; paused off-screen ---------- */
  var hasIO = 'IntersectionObserver' in window;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  function setupLoop(box) {
    var video = box.querySelector('.art-video');
    if (!video || reduce || saveData || !hasIO || !window.matchMedia) return; // posters only
    var mq = window.matchMedia(box.getAttribute('data-mq'));
    var isHero = !!box.closest('.hero');
    var cur = null, onScreen = false;
    function file() { return box.getAttribute(mq.matches ? 'data-d' : 'data-m'); }
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    function load() {
      var f = file();
      if (cur === f) return;
      cur = f; box.classList.remove('is-playing');
      while (video.firstChild) video.removeChild(video.firstChild);
      [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(function (t) {
        var so = doc.createElement('source'); so.src = f + '.' + t[0]; so.type = t[1]; video.appendChild(so);
      });
      video.muted = true; video.preload = 'auto'; video.load();
      if (onScreen) play();
    }
    video.addEventListener('playing', function () { box.classList.add('is-playing'); });
    if (mq.addEventListener) mq.addEventListener('change', function () { if (cur) load(); });
    var near = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { near.disconnect(); load(); } }, { rootMargin: '400px 0px' });
    var vis = new IntersectionObserver(function (en) {
      onScreen = en[0].isIntersecting;
      if (onScreen) { if (cur) play(); } else if (cur) video.pause();
    }, { threshold: 0 });
    function start() { near.observe(box); vis.observe(box); }
    if (isHero && doc.readyState !== 'complete') window.addEventListener('load', start); else start();
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) video.pause(); else if (onScreen && cur) play(); });
  }
  doc.querySelectorAll('.art-box[data-loop]').forEach(setupLoop);

  /* ---------- Live clock hands (rotated through the SVG transform attribute: no inline styles, strict CSP) ---------- */
  function Hands(svg) {
    var c = svg.getAttribute('data-c'), h = svg.querySelector('.oh-h'), m = svg.querySelector('.oh-m'), s = svg.querySelector('.oh-s');
    this.svg = svg; this.hasSpark = !!s;
    this.set = function (hd, md) {
      h.setAttribute('transform', 'rotate(' + hd.toFixed(2) + ' ' + c + ')');
      m.setAttribute('transform', 'rotate(' + md.toFixed(2) + ' ' + c + ')');
    };
    this.spark = function (deg) { if (s) s.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' ' + c + ')'); };
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  // 12:00 -> 12:21 (minute 126deg, hour 10.5deg); 'turns' adds whole minute-hand laps (the 404 "running late" spin)
  function sweep(list, ms, turns, done) {
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms), k = easeOut(p);
      list.forEach(function (H) { H.set((10.5 + turns * 30) * k, (126 + turns * 360) * k); });
      if (p < 1) requestAnimationFrame(step);
      else { list.forEach(function (H) { H.set(10.5, 126); }); if (done) done(); }
    }
    requestAnimationFrame(step);
  }
  // a tiny gold "second" spark rides the rim, one tick per second, only while on screen
  function startSpark(list, box) {
    var sp = list.filter(function (H) { return H.hasSpark; });
    if (!sp.length) return;
    var sec = 0, on = true;
    sp.forEach(function (H) { H.svg.classList.add('live'); });
    new IntersectionObserver(function (en) { on = en[0].isIntersecting; }).observe(box);
    setInterval(function () {
      if (!on || doc.hidden) return;
      var from = sec * 6, t0 = null; sec = (sec + 1) % 60;
      (function st(ts) {
        if (ts === undefined) return requestAnimationFrame(st);
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 260), k = easeOut(p);
        sp.forEach(function (H) { H.spark(from + 6 * k); });
        if (p < 1) requestAnimationFrame(st);
      })();
    }, 1000);
  }
  // emblem dividers: hands follow scroll from 11:00 and settle on 12:21 as the emblem reaches mid-screen
  function scrollHands(g) {
    var H = g.list[0], active = false, raf = 0;
    function upd() {
      raf = 0;
      var r = g.box.getBoundingClientRect(), vh = window.innerHeight;
      var k = easeOut(Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.55))));
      H.set(10.5 - (1 - k) * 40.5, 126 - (1 - k) * 486);
    }
    upd(); H.svg.classList.add('armed');
    new IntersectionObserver(function (en) { active = en[0].isIntersecting; if (active) upd(); }).observe(g.box);
    window.addEventListener('scroll', function () { if (active && !raf) raf = requestAnimationFrame(upd); }, { passive: true });
  }
  var groups = [];
  doc.querySelectorAll('.art-box').forEach(function (box) {
    groups.push({ box: box, mode: 'sweep', list: [].map.call(box.querySelectorAll('svg.hands'), function (s) { return new Hands(s); }) });
  });
  doc.querySelectorAll('.emblem[data-hands]').forEach(function (em) {
    var s = em.querySelector('svg.hands');
    if (s) groups.push({ box: em, mode: em.getAttribute('data-hands'), list: [new Hands(s)] });
  });
  groups.forEach(function (g) {
    if (reduce || !hasIO) { g.list.forEach(function (H) { H.svg.classList.add('armed'); }); return; } // static at 12:21
    if (g.mode === 'scroll') return scrollHands(g);
    g.list.forEach(function (H) { H.set(0, 0); H.svg.classList.add('armed'); }); // rest at 12:00 until seen
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      var late = g.mode === 'late';
      sweep(g.list, late ? 2800 : 1800, late ? 3 : 0, function () { startSpark(g.list, g.box); });
    }, { threshold: 0.35 });
    io.observe(g.box);
  });

  /* ---------- Timestamp markers tick up to their second as each section arrives ---------- */
  var stamps = [].filter.call(doc.querySelectorAll('.stamp-t'), function (el) { return /^12:21:\d\d$/.test(el.textContent); });
  if (stamps.length && !reduce && hasIO) {
    var sio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        sio.unobserve(en.target);
        var el = en.target, goal = parseInt(el.getAttribute('data-t'), 10), n = 0;
        (function next() {
          el.textContent = '12:21:' + (n < 10 ? '0' : '') + n;
          el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
          if (n++ < goal) setTimeout(next, 120);
        })();
      });
    }, { threshold: 0.6 });
    stamps.forEach(function (el) {
      el.setAttribute('data-t', el.textContent.slice(6));
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // already in view at load: leave as is
      el.textContent = '12:21:00'; sio.observe(el);
    });
  }

  /* ---------- Price finders ---------- */
  var DATA = {
    locs: {
      title: 'Loc Retwist',
      includes: 'Based on 125 or fewer locs and 3/4 in. or less of new growth. Shampoo included. Comb, palm roll and/or Locksmith technique.',
      lengths: { top: 'Just the top', ear: 'Ear to neck', shoulder: 'Shoulder', mid: 'Mid back', waist: 'Waist' },
      styles: { none: 'No style', basic: 'Basic style', twist: '2-strand / rope / plaits', knots: 'Loc knots / petals', combo: 'Combination' },
      prefer: ['twist', 'basic', 'none', 'combo', 'knots'],
      price: {
        top:      { none: [100, '1 hr 30 min'], basic: [110, '2 hr'], twist: [115, '2 hr'] },
        ear:      { none: [105, '3 hr'], basic: [115, '2 hr'], twist: [130, '2 hr'], combo: [150, '2 hr'] },
        shoulder: { none: [125, '3 hr'], basic: [135, '4 hr'], twist: [150, '4 hr'], knots: [165, '2 hr'], combo: [175, '2 hr'] },
        mid:      { none: [135, '3 hr'], basic: [145, '3 hr'], twist: [175, '4 hr'], knots: [185, '3 hr'], combo: [210, '4 hr'] },
        waist:    { none: [165, '1 hr 30 min'], basic: [175, '4 hr 30 min'], twist: [190, '4 hr'], knots: [205, '4 hr'], combo: [225, '4 hr'] }
      }
    },
    silk: {
      title: 'Silk Press',
      includes: 'Deep cleanse, condition, hydrate, blow out and press.',
      lengths: { short: 'Short', medium: 'Medium', long: 'Long' },
      styles: { fine: 'Fine', thick: 'Thick' },
      prefer: ['fine', 'thick'],
      price: {
        short:  { fine: [120, '2 hr'], thick: [135, '2 hr'] },
        medium: { fine: [135, '2 hr 15 min'], thick: [150, '2 hr 15 min'] },
        long:   { fine: [150, '2 hr 35 min'], thick: [165, '2 hr 35 min'] }
      }
    }
  };
  window.T21_FINDER_DATA = DATA; // exposed for QA tests

  function initFinder(f) {
    var key = f.getAttribute('data-finder'), d = DATA[key];
    if (!d) return;
    f.hidden = false;
    var out = {
      price: f.querySelector('.result-price'), time: f.querySelector('.result-time span'),
      name: f.querySelector('.result-name'), note: f.querySelector('.result-note')
    };
    var lenInputs = f.querySelectorAll('input[data-len]'), styInputs = f.querySelectorAll('input[data-style]');
    var last = null;
    function val(list) { for (var i = 0; i < list.length; i++) if (list[i].checked) return list[i]; return null; }
    function update(changed) {
      var L = val(lenInputs), note = '';
      if (!L) { lenInputs[0].checked = true; L = lenInputs[0]; }
      var len = L.getAttribute('data-len'), avail = d.price[len];
      styInputs.forEach(function (inp) {
        var ok = !!avail[inp.getAttribute('data-style')];
        inp.disabled = !ok;
        inp.parentNode.title = ok ? '' : 'Not on the menu for ' + d.lengths[len];
      });
      var S = val(styInputs);
      if (!S || S.disabled) {
        var wanted = S ? S.getAttribute('data-style') : null, pick = null;
        for (var i = 0; i < d.prefer.length && !pick; i++) if (avail[d.prefer[i]]) pick = d.prefer[i];
        f.querySelector('input[data-style="' + pick + '"]').checked = true;
        S = f.querySelector('input[data-style="' + pick + '"]');
        if (wanted) note = d.styles[wanted] + ' isn’t on the menu for ' + d.lengths[len].toLowerCase() + ' locs, so this shows ' + d.styles[pick].toLowerCase() + '. Not sure what fits? Book a $25 consultation.';
      }
      var sty = S.getAttribute('data-style'), row = avail[sty];
      var label = d.title + ' · ' + d.lengths[len] + ' · ' + d.styles[sty];
      if (key === 'silk') label = d.title + ' · ' + d.lengths[len] + ' ' + d.styles[sty];
      out.price.textContent = '$' + row[0];
      out.time.textContent = row[1];
      out.name.textContent = label;
      out.note.textContent = note;
      f.setAttribute('data-result', len + ':' + sty + ':' + row[0] + ':' + row[1]);
      if (changed && last !== row[0] && !reduce) {
        out.price.classList.remove('tick'); void out.price.offsetWidth; out.price.classList.add('tick');
      }
      last = row[0];
    }
    f.addEventListener('change', function () { update(true); });
    update(false);
  }
  doc.querySelectorAll('[data-finder]').forEach(initFinder);

  /* ---------- Tabs (finder switcher) ---------- */
  doc.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = list.querySelectorAll('[role="tab"]');
    list.hidden = false;
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
          select(tabs[n], true);
        }
      });
    });
    select(tabs[0]);
  });

  /* ---------- Gallery: stagger, filters, lightbox ---------- */
  var grid = doc.querySelector('.g-grid');
  function cols() { return window.innerWidth >= 860 ? 4 : 2; }
  function layout() {
    if (!grid) return;
    var vis = grid.querySelectorAll('.g-item:not([hidden])'), c = cols();
    grid.classList.add('js-laid');
    vis.forEach(function (el, i) {
      var col = i % c, row = Math.floor(i / c);
      el.classList.toggle('off', col % 2 === 1);
      // "braid" order: alternate columns arrive in a zig-zag
      el.style.transitionDelay = reduce ? '0ms' : ((col * 90) + (row % 2) * 45) + 'ms';
    });
    var count = doc.querySelector('.g-count');
    if (count) count.textContent = vis.length + (vis.length === 1 ? ' look' : ' looks');
  }
  if (grid) {
    layout();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
    var fbtns = doc.querySelectorAll('.filters button');
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        grid.querySelectorAll('.g-item').forEach(function (it) {
          it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f);
          if (!it.hidden) it.classList.add('is-in');
        });
        layout();
      });
    });
  }

  var lb = doc.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap span'), lbNum = lb.querySelector('.lb-cap b');
    var items = [], idx = 0, opener = null;
    function show(i) {
      idx = (i + items.length) % items.length;
      var a = items[idx], im = a.querySelector('img');
      lbImg.src = a.getAttribute('href'); lbImg.alt = im.alt;
      lbCap.textContent = im.alt;
      lbNum.textContent = (idx + 1) + ' / ' + items.length;
    }
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a.g-item');
      if (!a) return;
      e.preventDefault();
      items = Array.prototype.slice.call(doc.querySelectorAll('a.g-item:not([hidden])'));
      opener = a; show(items.indexOf(a));
      lb.hidden = false; doc.body.style.overflow = 'hidden';
      lb.querySelector('.lb-x').focus();
    });
    function closeLb() { lb.hidden = true; doc.body.style.overflow = ''; lbImg.removeAttribute('src'); if (opener) opener.focus(); }
    lb.querySelector('.lb-x').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button'), first = f[0], lastB = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); lastB.focus(); }
        else if (!e.shiftKey && doc.activeElement === lastB) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Services chip nav: highlight current category ---------- */
  var chips = doc.querySelectorAll('.chips-nav a');
  if (chips.length && 'IntersectionObserver' in window) {
    var map = {};
    chips.forEach(function (c) { map[c.getAttribute('href').slice(1)] = c; });
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          chips.forEach(function (c) { c.classList.remove('is-on'); c.removeAttribute('aria-current'); });
          var c = map[en.target.id]; c.classList.add('is-on'); c.setAttribute('aria-current', 'true');
          var ul = c.parentNode.parentNode;
          if (ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: c.offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) cio.observe(s); });
  }

  /* ---------- Netlify form ---------- */
  var form = doc.querySelector('form[data-netlify]');
  if (form) {
    var ok = doc.getElementById('form-ok');
    function setErr(field, msg) {
      var w = field.closest('.field'), e = w && w.querySelector('.err');
      if (w) w.classList.toggle('invalid', !!msg);
      if (e) e.textContent = msg || '';
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    function check() {
      var good = true, first = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var v = (f.value || '').trim(), msg = '';
        if (f.type === 'checkbox') { if (!f.checked) msg = 'Please confirm to continue.'; }
        else if (!v) msg = 'Please fill this in.';
        else if (f.type === 'tel' && v.replace(/\D/g, '').length < 10) msg = 'Enter a 10-digit phone number.';
        else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email address.';
        setErr(f, msg);
        if (msg) { good = false; first = first || f; }
      });
      var em = form.querySelector('input[type="email"]:not([required])');
      if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { setErr(em, 'Enter a valid email address.'); good = false; first = first || em; }
      if (first) first.focus();
      return good;
    }
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check()) return;
      var local = /^(localhost|127\.0\.0\.1|)$/.test(location.hostname) || location.protocol === 'file:';
      var done = function (msg) {
        form.hidden = true; ok.hidden = false;
        if (msg) ok.querySelector('p').textContent = msg;
        ok.focus();
      };
      if (local) { done('Preview mode: the form works once the site is live on Netlify. For now, text (775) 487-1221.'); return; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () { done('Something interrupted the send. Please text (775) 487-1221 or book a $25 consultation online.'); });
    });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
  }
})();
