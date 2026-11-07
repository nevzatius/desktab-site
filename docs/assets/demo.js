/* Desktab interactive demo — plain JavaScript, no libraries, no network requests,
   no cookies, no localStorage. All state lives in memory and is lost on reload. */
(function () {
  'use strict';

  var host = document.getElementById('dz');
  if (!host) return;

  var LANG = ((document.documentElement.lang || 'en').slice(0, 2) === 'tr') ? 'tr' : 'en';
  var I = LANG === 'tr' ? 1 : 0;

  var TXT = {
    newFolder: ['New folder', 'Yeni klasör'],
    workspaces: ['Workspaces', 'Çalışma alanları'],
    view: ['View', 'Görünüm'],
    search: ['Search files', 'Dosyalarda ara'],
    all: ['All', 'Tümü'],
    docs: ['Documents', 'Belgeler'],
    pdf: ['PDF', 'PDF'],
    images: ['Images', 'Görseller'],
    folders: ['Folders', 'Klasörler'],
    items: ['items', 'öğe'],
    item1: ['item', 'öğe'],
    back: ['Back', 'Geri'],
    forward: ['Forward', 'İleri'],
    up: ['Up one level', 'Üst klasör'],
    addWs: ['New workspace', 'Yeni çalışma alanı'],
    wsLimit: ['Free includes up to 2 workspaces. Pro adds unlimited workspaces.', 'Ücretsiz sürüm en fazla 2 çalışma alanı içerir. Pro sınırsız çalışma alanı ekler.'],
    iconSize: ['Icon size', 'Simge boyutu'],
    large: ['Large icons', 'Büyük simgeler'],
    medium: ['Medium icons', 'Orta simgeler'],
    small: ['Small icons', 'Küçük simgeler'],
    open: ['Open', 'Aç'],
    rename: ['Rename', 'Yeniden adlandır'],
    del: ['Delete (to Recycle Bin)', 'Sil (Geri Dönüşüm Kutusu’na)'],
    movedTo: ['Moved “%a” into “%b”.', '“%a”, “%b” içine taşındı.'],
    movedWs: ['Moved “%a” to workspace “%b”.', '“%a”, “%b” çalışma alanına taşındı.'],
    movedUp: ['Moved “%a” to “%b”.', '“%a”, “%b” konumuna taşındı.'],
    recycled: ['“%a” moved to the Recycle Bin. (In the app, deleted items go to the Windows Recycle Bin.)', '“%a” Geri Dönüşüm Kutusu’na taşındı. (Uygulamada silinen öğeler Windows Geri Dönüşüm Kutusu’na gider.)'],
    undo: ['Undo', 'Geri al'],
    restored: ['Restored “%a”.', '“%a” geri yüklendi.'],
    empty: ['This folder is empty.', 'Bu klasör boş.'],
    noMatch: ['Nothing matches.', 'Eşleşen öğe yok.'],
    proLocked: ['%a is a Pro feature.', '%a bir Pro özelliğidir.'],
    pTitle: ['Personalize', 'Kişiselleştir'],
    pTheme: ['Theme', 'Tema'],
    light: ['Light', 'Açık'],
    dark: ['Dark', 'Koyu'],
    pStyle: ['Style', 'Stil'],
    modern: ['Modern', 'Modern'],
    classic: ['Classic', 'Klasik'],
    pCorners: ['Window corners', 'Pencere köşeleri'],
    rounded: ['Rounded', 'Yuvarlak'],
    square: ['Square', 'Köşeli'],
    pSize: ['Icon size', 'Simge boyutu'],
    sSmall: ['Small', 'Küçük'],
    sMedium: ['Medium', 'Orta'],
    sLarge: ['Large', 'Büyük'],
    pBg: ['Background (this workspace)', 'Arka plan (bu çalışma alanı)'],
    bgBlue: ['Blue waves', 'Mavi dalgalar'],
    bgPurple: ['Purple bubbles', 'Mor baloncuklar'],
    bgSunset: ['Sunset', 'Gün batımı'],
    bgGraphite: ['Graphite', 'Grafit'],
    pPanel: ['Panel', 'Panel'],
    opaque: ['Opaque', 'Opak'],
    semi: ['Semi-transparent', 'Yarı saydam'],
    transp: ['Transparent', 'Saydam'],
    pAnim: ['Animated wallpaper', 'Hareketli duvar kâğıdı'],
    gifVideo: ['GIF / video', 'GIF / video'],
    reset: ['Reset demo', 'Demoyu sıfırla'],
    pro: ['Pro', 'Pro'],
    keysHint: ['Keyboard: arrow keys move the selected icon, Enter opens, F2 renames, Delete removes.', 'Klavye: ok tuşları seçili simgeyi taşır, Enter açar, F2 yeniden adlandırır, Delete siler.'],
    winLabel: ['Interactive Desktab demo window', 'Etkileşimli Desktab demo penceresi']
  };
  function t(k) { return TXT[k][I]; }
  function fmt(s, a, b) { return s.replace('%a', a).replace('%b', b); }

  /* ---------- demo data ---------- */
  var seq = 0;
  function mk(type, name, extra) {
    var o = { id: 'i' + (++seq), type: type, name: name[I] };
    if (extra) for (var k in extra) o[k] = extra[k];
    if (type === 'folder' && !o.children) o.children = [];
    return o;
  }
  function G(a, b) { return { g: [a, b] }; }

  function initialData() {
    seq = 0;
    var atlas = {
      id: 'w1', name: ['Project Atlas', 'Proje Atlas'][I], drive: ['P:\\Project Atlas', 'P:\\Proje Atlas'][I], bg: 'blue', stack: [], fwd: [],
      items: [
        mk('img', ['Cover Design.png', 'Kapak Tasarımı.png'], G('#6d5bd0', '#2a2f7a')),
        mk('pdf', ['Budget Summary.pdf', 'Bütçe Özeti.pdf']),
        mk('txt', ['Notes.txt', 'Notlar.txt']),
        mk('docx', ['Weekly Plan.docx', 'Haftalık Plan.docx']),
        mk('folder', ['Meeting Notes', 'Toplantı Notları'], { children: [
          mk('docx', ['Kickoff.docx', 'Açılış.docx']), mk('txt', ['Action Items.txt', 'Yapılacaklar.txt'])
        ] }),
        mk('pdf', ['Roadmap.pdf', 'Yol Haritası.pdf']),
        mk('folder', ['Client Files', 'Müşteri Dosyaları'], { children: [
          mk('docx', ['Client List.docx', 'Müşteri Listesi.docx']), mk('pdf', ['Invoice Template.pdf', 'Fatura Şablonu.pdf']), mk('pdf', ['Contract.pdf', 'Sözleşme.pdf'])
        ] }),
        mk('folder', ['Images', 'Görseller'], { children: [
          mk('img', ['Team Event.jpg', 'Takım Etkinliği.jpg'], G('#3fb7a0', '#bfe8c8')),
          mk('img', ['Color Palette.png', 'Renk Paleti.png'], G('#e4708b', '#f6a0b4')),
          mk('img', ['Logo Draft v2.png', 'Logo Taslağı v2.png'], G('#4c8df0', '#9cc3ff')),
          mk('img', ['Banner.png', 'Afiş.png'], G('#f2a05a', '#f7c98a'))
        ] }),
        mk('folder', ['Archive 2025', 'Arşiv 2025'], { children: [
          mk('pdf', ['Report 2025.pdf', 'Rapor 2025.pdf']), mk('docx', ['Old Plan.docx', 'Eski Plan.docx'])
        ] }),
        mk('txt', ['Task List.txt', 'Görev Listesi.txt']),
        mk('img', ['Logo Draft.png', 'Logo Taslağı.png'], G('#4c8df0', '#9cc3ff')),
        mk('video', ['Promo Video.mp4', 'Tanıtım Videosu.mp4'], G('#0b8f7a', '#1a5fd0'))
      ]
    };
    var design = {
      id: 'w2', name: ['Design', 'Tasarım'][I], drive: ['P:\\Design', 'P:\\Tasarım'][I], bg: 'purple', stack: [], fwd: [],
      items: [
        mk('video', ['Animation Draft.mp4', 'Animasyon Taslağı.mp4'], G('#e8662c', '#a02f3a')),
        mk('img', ['Concept 01.png', 'Konsept 01.png'], G('#3f86ec', '#9bc3ff')),
        mk('folder', ['Inspiration', 'İlham'], { children: [
          mk('img', ['Study 01.jpg', 'Çalışma 01.jpg'], G('#f2a05a', '#f7c98a')),
          mk('img', ['Study 02.jpg', 'Çalışma 02.jpg'], G('#3fb7a0', '#bfe8c8')),
          mk('img', ['Study 03.jpg', 'Çalışma 03.jpg'], G('#8a8f9b', '#c9ccd4'))
        ] }),
        mk('docx', ['Brief.docx', 'Brif.docx']),
        mk('folder', ['Deliverables', 'Teslimatlar'], { children: [
          mk('img', ['Final Logo.png', 'Son Logo.png'], G('#4c8df0', '#9cc3ff')), mk('pdf', ['Handoff.pdf', 'Teslim.pdf'])
        ] }),
        mk('img', ['Concept 02.png', 'Konsept 02.png'], G('#e4708b', '#f6a0b4')),
        mk('pdf', ['Brand Guide.pdf', 'Marka Rehberi.pdf']),
        mk('img', ['Concept 03.png', 'Konsept 03.png'], G('#5a4fc0', '#2a2f7a'))
      ]
    };
    return [atlas, design];
  }

  /* ---------- state ---------- */
  var ws, active, selId = null, filter = 'all', query = '', drag = null, lastTap = { id: null, t: 0 }, recycled = [], menuEl = null, toastTimer = null;
  var cfg;

  function resetAll() {
    ws = initialData(); active = ws[0]; selId = null; filter = 'all'; query = ''; recycled = [];
    cfg = { theme: 'light', style: 'modern', corners: 'rounded', size: 'medium' };
    ws.forEach(function (w) { layout(w.items); });
  }

  function cur() { var s = active.stack; return s.length ? s[s.length - 1].children : active.items; }

  function layout(list) {
    var cols = 4, n = list.length, rows = Math.max(3, Math.ceil(n / cols));
    list.forEach(function (it, i) {
      if (typeof it.cx === 'number') return;
      var c = i % cols, r = Math.floor(i / cols);
      var jx = (((i * 37) % 11) - 5) / 170, jy = (((i * 53) % 9) - 4) / 120;
      it.cx = (c + 0.5) / cols + jx; it.cy = (r + 0.5) / rows + jy;
    });
  }
  function ensureLayout(list) {
    // keep positions already set; assign free slots to any item without one
    var need = list.filter(function (it) { return typeof it.cx !== 'number'; });
    if (!need.length) return;
    var cols = 4, rows = 3, taken = list.filter(function (it) { return typeof it.cx === 'number'; });
    need.forEach(function (it) {
      var best = null;
      for (var r = 0; r < Math.max(rows, 3) && !best; r++) for (var c = 0; c < cols && !best; c++) {
        var x = (c + 0.5) / cols, y = (r + 0.5) / rows;
        var clash = taken.some(function (o) { return Math.abs(o.cx - x) < 0.16 && Math.abs(o.cy - y) < 0.2; });
        if (!clash) best = { x: x, y: y };
      }
      if (!best) best = { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.7 };
      it.cx = best.x; it.cy = best.y; taken.push(it);
    });
  }

  /* ---------- icons ---------- */
  function uid() { return 'g' + (++seq); }
  function iconSvg(it) {
    var u = uid(), s;
    switch (it.type) {
      case 'folder':
        s = '<path d="M5 10.5A3.5 3.5 0 0 1 8.5 7H19l4 4.5h16.5A3.5 3.5 0 0 1 43 15v22a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 37z" fill="#f2c860"/><path d="M5 17h38v20a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 37z" fill="#ffdf8a"/>';
        break;
      case 'img':
      case 'video':
        s = '<defs><linearGradient id="' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + it.g[1] + '"/><stop offset="1" stop-color="' + it.g[0] + '"/></linearGradient></defs><rect x="5" y="9" width="38" height="30" rx="3" fill="url(#' + u + ')"/><circle cx="16" cy="19" r="5" fill="#fff" opacity=".28"/><circle cx="31" cy="29" r="7" fill="#fff" opacity=".18"/>';
        if (it.type === 'video') s += '<circle cx="24" cy="24" r="8.5" fill="#fff" opacity=".92"/><path d="M21.5 19.8v8.4l7-4.2z" fill="#26324a"/>';
        break;
      default:
        s = '<path d="M11 4h18l9 9v28a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff" stroke="#c9cfda" stroke-width="1.2"/><path d="M29 4v7a2 2 0 0 0 2 2h7z" fill="#e2e6ee"/>';
        if (it.type === 'pdf') s += '<rect x="8" y="22" width="30" height="12" fill="#e5222b"/><text x="23" y="31.4" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="8.6" font-weight="700" fill="#fff">PDF</text>';
        else if (it.type === 'docx') s += '<path d="M14 17h18M14 21h18M14 25h12" stroke="#c9cfda" stroke-width="1.6"/><text x="23" y="36" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="7.4" font-weight="700" fill="#7b8496">DOCX</text>';
        else s += '<path d="M14 18h18M14 22h18M14 26h18M14 30h12" stroke="#c9cfda" stroke-width="1.6"/>';
    }
    return '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + s + '</svg>';
  }

  function typeOf(it) { return it.type === 'folder' ? 'folders' : it.type === 'img' ? 'images' : it.type === 'pdf' ? 'pdf' : (it.type === 'docx' || it.type === 'txt') ? 'docs' : 'other'; }
  function matches(it) {
    if (filter !== 'all' && typeOf(it) !== filter) return false;
    if (query && it.name.toLowerCase().indexOf(query.toLowerCase()) < 0) return false;
    return true;
  }
  function find(id) { var l = cur(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- build UI ---------- */
  var el = {};
  function build() {
    host.innerHTML =
      '<div class="dz-window" id="dz-window" role="group" aria-label="' + esc(t('winLabel')) + '">' +
        '<div class="dz-bar">' +
          '<span class="dz-app"><span class="dz-logo" aria-hidden="true"></span><span class="dz-title" id="dz-title"></span></span>' +
          '<button type="button" class="dz-btn" id="dz-new"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg><span>' + esc(t('newFolder')) + '</span></button>' +
          '<button type="button" class="dz-btn" id="dz-wsmenu" aria-haspopup="menu" aria-label="' + esc(t('workspaces')) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m8 2 6 3-6 3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3"/></svg><span>' + esc(t('workspaces')) + '</span><svg class="dz-caret" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>' +
          '<button type="button" class="dz-btn" id="dz-viewmenu" aria-haspopup="menu" aria-label="' + esc(t('view')) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5"/><path d="M8 2.5v11M2.5 8h11"/></svg><span>' + esc(t('view')) + '</span><svg class="dz-caret" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>' +
          '<label class="dz-search"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.8" cy="6.8" r="4"/><path d="m10 10 3.5 3.5"/></svg><input id="dz-q" type="search" placeholder="' + esc(t('search')) + '" aria-label="' + esc(t('search')) + '" autocomplete="off"></label>' +
          '<span class="dz-wc" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '</div>' +
        '<div class="dz-tabs"><div class="dz-tablist" id="dz-tabs" role="tablist"></div>' +
          '<div class="dz-chips" id="dz-chips" role="group"></div></div>' +
        '<div class="dz-nav" id="dz-nav" hidden></div>' +
        '<div class="dz-canvas bg-blue" id="dz-canvas" tabindex="-1"></div>' +
        '<div class="dz-status"><span id="dz-count"></span><span id="dz-path"></span></div>' +
        '<div class="dz-toast" id="dz-toast" role="status" aria-live="polite"></div>' +
      '</div>' +
      '<p class="dz-keys">' + esc(t('keysHint')) + '</p>' +
      '<div class="dz-panel" id="dz-panel"><h3>' + esc(t('pTitle')) + '</h3><div class="dz-groups" id="dz-groups"></div>' +
        '<button type="button" class="dz-reset" id="dz-reset">' + esc(t('reset')) + '</button></div>';

    ['window', 'title', 'new', 'wsmenu', 'viewmenu', 'q', 'tabs', 'chips', 'nav', 'canvas', 'count', 'path', 'toast', 'groups', 'reset'].forEach(function (k) { el[k] = document.getElementById('dz-' + k); });

    buildChips(); buildPanel();
    el.new.addEventListener('click', newFolder);
    el.wsmenu.addEventListener('click', function () { var r = el.wsmenu.getBoundingClientRect(); menuAt(r.left, r.bottom + 4, wsEntries()); });
    el.viewmenu.addEventListener('click', function () { var r = el.viewmenu.getBoundingClientRect(); menuAt(r.left, r.bottom + 4, sizeEntries()); });
    el.q.addEventListener('input', function () { query = el.q.value.trim(); renderIcons(); });
    el.reset.addEventListener('click', function () { resetAll(); el.q.value = ''; render(); toast(''); Array.prototype.forEach.call(el.chips.children, function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-f') === 'all')); }); });
    bindCanvas();
  }

  function buildChips() {
    var defs = [['all', 'all'], ['docs', 'docs'], ['pdf', 'pdf'], ['images', 'images'], ['folders', 'folders']];
    el.chips.innerHTML = defs.map(function (d) { return '<button type="button" class="dz-chip" data-f="' + d[0] + '" aria-pressed="' + (filter === d[0]) + '">' + esc(t(d[1])) + '</button>'; }).join('');
    el.chips.addEventListener('click', function (e) {
      var b = e.target.closest('.dz-chip'); if (!b) return;
      filter = b.getAttribute('data-f');
      Array.prototype.forEach.call(el.chips.children, function (c) { c.setAttribute('aria-pressed', String(c === b)); });
      renderIcons();
    });
  }

  var BGS = [['blue', 'bgBlue'], ['purple', 'bgPurple'], ['sunset', 'bgSunset'], ['graphite', 'bgGraphite']];
  function seg(name, label, opts) {
    return '<div class="dz-group"><div class="dz-glabel" id="dzl-' + name + '">' + esc(t(label)) + '</div><div class="dz-seg" role="radiogroup" aria-labelledby="dzl-' + name + '" data-g="' + name + '">' +
      opts.map(function (o) {
        var lock = o[2] ? ' aria-disabled="true" data-lock="1"' : '';
        return '<button type="button" role="radio" aria-checked="' + (o[3] ? 'true' : 'false') + '" data-v="' + o[0] + '"' + lock + '>' + esc(t(o[1])) + (o[2] ? '<span class="dz-pro"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.4"/><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7"/></svg>' + esc(t('pro')) + '</span>' : '') + '</button>';
      }).join('') + '</div></div>';
  }
  function buildPanel() {
    var swatches = '<div class="dz-group"><div class="dz-glabel" id="dzl-bg">' + esc(t('pBg')) + '</div><div class="dz-swatches" role="radiogroup" aria-labelledby="dzl-bg" data-g="bg">' +
      BGS.map(function (b) { return '<button type="button" role="radio" class="dz-sw bg-' + b[0] + '" data-v="' + b[0] + '" aria-checked="false" aria-label="' + esc(t(b[1])) + '" title="' + esc(t(b[1])) + '"></button>'; }).join('') + '</div></div>';
    el.groups.innerHTML =
      seg('theme', 'pTheme', [['light', 'light', 0, 1], ['dark', 'dark']]) +
      seg('style', 'pStyle', [['modern', 'modern', 0, 1], ['classic', 'classic']]) +
      seg('corners', 'pCorners', [['rounded', 'rounded', 0, 1], ['square', 'square']]) +
      seg('size', 'pSize', [['small', 'sSmall'], ['medium', 'sMedium', 0, 1], ['large', 'sLarge']]) +
      swatches +
      seg('panel', 'pPanel', [['opaque', 'opaque', 0, 1], ['semi', 'semi', 1], ['transp', 'transp', 1]]) +
      seg('anim', 'pAnim', [['gif', 'gifVideo', 1]]);
    el.groups.addEventListener('click', function (e) {
      var b = e.target.closest('button[role=radio]'); if (!b) return;
      var g = b.parentNode.getAttribute('data-g'), v = b.getAttribute('data-v');
      if (b.getAttribute('data-lock')) { toast(fmt(t('proLocked'), b.textContent.replace(t('pro'), '').trim())); return; }
      if (g === 'bg') active.bg = v; else cfg[g] = v;
      applyCfg(); renderIcons();
    });
  }

  function applyCfg() {
    var w = el.window;
    w.setAttribute('data-theme', cfg.theme); w.setAttribute('data-style', cfg.style); w.setAttribute('data-corners', cfg.corners); w.setAttribute('data-size', cfg.size);
    el.canvas.className = 'dz-canvas bg-' + active.bg;
    Array.prototype.forEach.call(el.groups.querySelectorAll('[data-g]'), function (grp) {
      var g = grp.getAttribute('data-g'), val = g === 'bg' ? active.bg : cfg[g];
      Array.prototype.forEach.call(grp.querySelectorAll('[role=radio]'), function (b) {
        if (b.getAttribute('data-lock')) return;
        b.setAttribute('aria-checked', String(b.getAttribute('data-v') === (g === 'panel' ? 'opaque' : val)));
      });
    });
  }

  /* ---------- rendering ---------- */
  function render() {
    renderTabs(); renderNav(); applyCfg(); renderIcons();
  }
  function renderTabs() {
    el.title.textContent = active.name;
    el.tabs.innerHTML = ws.map(function (w) {
      return '<button type="button" role="tab" class="dz-tab" data-w="' + w.id + '" aria-selected="' + (w === active) + '">' + esc(w.name) + '</button>';
    }).join('') + '<button type="button" class="dz-tab dz-add" id="dz-add" aria-label="' + esc(t('addWs')) + '" title="' + esc(t('addWs')) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg></button>';
  }
  function renderNav() {
    var s = active.stack;
    if (!s.length) { el.nav.hidden = true; el.nav.innerHTML = ''; return; }
    el.nav.hidden = false;
    var arrow = function (d) { return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var crumbs = '<button type="button" class="dz-crumb" data-level="0">' + esc(active.name) + '</button>';
    s.forEach(function (f, i) { crumbs += '<span class="dz-sep" aria-hidden="true">›</span><button type="button" class="dz-crumb" data-level="' + (i + 1) + '"' + (i === s.length - 1 ? ' aria-current="location"' : '') + '>' + esc(f.name) + '</button>'; });
    el.nav.innerHTML =
      '<button type="button" class="dz-nb" data-a="back" aria-label="' + esc(t('back')) + '" title="' + esc(t('back')) + '">' + arrow('M10 3 5 8l5 5') + '</button>' +
      '<button type="button" class="dz-nb" data-a="fwd" aria-label="' + esc(t('forward')) + '" title="' + esc(t('forward')) + '"' + (active.fwd.length ? '' : ' disabled') + '>' + arrow('m6 3 5 5-5 5') + '</button>' +
      '<button type="button" class="dz-nb" data-a="up" aria-label="' + esc(t('up')) + '" title="' + esc(t('up')) + '">' + arrow('M8 13V4M4 7.5 8 3.5l4 4') + '</button>' +
      '<div class="dz-crumbs">' + crumbs + '</div>';
  }
  function renderIcons() {
    var list = cur(); ensureLayout(list);
    var html = list.map(function (it) {
      return '<div class="dz-ic' + (it.type === 'folder' ? ' is-folder' : '') + (it.id === selId ? ' sel' : '') + (matches(it) ? '' : ' dim') + '" role="button" tabindex="0" data-id="' + it.id + '" style="left:' + (it.cx * 100).toFixed(3) + '%;top:' + (it.cy * 100).toFixed(3) + '%" aria-label="' + esc(it.name) + '">' + iconSvg(it) + '<span class="dz-name">' + esc(it.name) + '</span></div>';
    }).join('');
    el.canvas.innerHTML = html + (list.length ? '' : '<p class="dz-empty">' + esc(t('empty')) + '</p>');
    var shown = list.filter(matches).length;
    if (list.length && !shown) el.canvas.insertAdjacentHTML('beforeend', '<p class="dz-empty">' + esc(t('noMatch')) + '</p>');
    el.count.textContent = list.length + ' ' + (list.length === 1 ? t('item1') : t('items'));
    el.path.textContent = active.drive + active.stack.map(function (f) { return '\\' + f.name; }).join('');
    Array.prototype.forEach.call(el.tabs.querySelectorAll('.dz-tab[data-w]'), function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-w') === active.id)); });
  }

  /* ---------- selection / navigation ---------- */
  function select(id) {
    selId = id;
    Array.prototype.forEach.call(el.canvas.querySelectorAll('.dz-ic'), function (n) { n.classList.toggle('sel', n.getAttribute('data-id') === id); });
  }
  function openItem(it) {
    if (it.type !== 'folder') { toast(it.name); return; }
    active.stack.push(it); active.fwd = []; selId = null; renderNav(); renderIcons();
    var first = el.canvas.querySelector('.dz-ic'); if (first) first.focus({ preventScroll: true });
  }
  function goUp(n) {
    var s = active.stack, popped = false;
    while (n-- > 0 && s.length) { active.fwd.push(s.pop()); popped = true; }
    if (popped) { selId = null; renderNav(); renderIcons(); }
  }
  /* ---------- actions ---------- */
  function newFolder() {
    var f = mk('folder', ['New folder', 'Yeni klasör']);
    var l = cur(); l.push(f); ensureLayout(l); selId = f.id; renderIcons(); renameStart(f.id);
  }
  function renameStart(id) {
    var n = el.canvas.querySelector('.dz-ic[data-id="' + id + '"] .dz-name'), it = find(id); if (!n || !it) return;
    var inp = document.createElement('input'); inp.className = 'dz-rename'; inp.value = it.name; inp.setAttribute('aria-label', t('rename'));
    n.replaceWith(inp); inp.focus(); inp.select();
    var done = false;
    function end(save) {
      if (done) return; done = true;
      if (save && inp.value.trim()) it.name = inp.value.trim().slice(0, 60);
      renderIcons(); renderNav();
      var back = el.canvas.querySelector('.dz-ic[data-id="' + id + '"]'); if (back) back.focus({ preventScroll: true });
    }
    inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') end(true); else if (e.key === 'Escape') end(false); });
    inp.addEventListener('blur', function () { end(true); });
    inp.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  }
  function remove(id) {
    var l = cur(), i = l.findIndex(function (o) { return o.id === id; }); if (i < 0) return;
    var it = l.splice(i, 1)[0]; recycled.push({ it: it, list: l, i: i }); selId = null; renderIcons();
    toast(fmt(t('recycled'), it.name), true);
  }
  function undo() {
    var r = recycled.pop(); if (!r) return;
    r.list.splice(Math.min(r.i, r.list.length), 0, r.it); renderIcons(); toast(fmt(t('restored'), r.it.name));
  }
  function moveInto(it, folder, label) {
    var l = cur(), i = l.indexOf(it); if (i < 0 || it === folder) return false;
    l.splice(i, 1); delete it.cx; delete it.cy; folder.children.push(it); selId = null; renderIcons();
    toast(fmt(label || t('movedTo'), it.name, folder.name)); return true;
  }

  /* ---------- context / dropdown menus ---------- */
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  function sizeEntries() {
    return [{ h: t('iconSize') }, { l: t('large'), c: cfg.size === 'large', f: function () { cfg.size = 'large'; applyCfg(); } }, { l: t('medium'), c: cfg.size === 'medium', f: function () { cfg.size = 'medium'; applyCfg(); } }, { l: t('small'), c: cfg.size === 'small', f: function () { cfg.size = 'small'; applyCfg(); } }];
  }
  function wsEntries() {
    return ws.map(function (w) { return { l: w.name, c: w === active, f: function () { switchTo(w); } }; });
  }
  function switchTo(w) { active = w; selId = null; render(); }
  function menuAt(x, y, entries) {
    closeMenu();
    var m = document.createElement('div'); m.className = 'dz-menu'; m.setAttribute('role', 'menu');
    entries.forEach(function (e) {
      if (e.h) { var h = document.createElement('div'); h.className = 'dz-mh'; h.textContent = e.h; m.appendChild(h); return; }
      if (e.sep) { m.appendChild(document.createElement('hr')); return; }
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', e.c !== undefined ? 'menuitemradio' : 'menuitem');
      if (e.c !== undefined) b.setAttribute('aria-checked', String(!!e.c));
      b.innerHTML = '<span class="dz-ck">' + (e.c ? '✓' : '') + '</span>' + esc(e.l);
      b.addEventListener('click', function () { closeMenu(); e.f(); });
      m.appendChild(b);
    });
    el.window.appendChild(m); menuEl = m;
    var wr = el.window.getBoundingClientRect(), mr = m.getBoundingClientRect();
    var left = Math.min(x - wr.left, wr.width - mr.width - 6), top = Math.min(y - wr.top, wr.height - mr.height - 6);
    m.style.left = Math.max(6, left) + 'px'; m.style.top = Math.max(6, top) + 'px';
    var first = m.querySelector('button'); if (first) first.focus({ preventScroll: true });
    m.addEventListener('keydown', function (e) {
      var bs = Array.prototype.slice.call(m.querySelectorAll('button')), i = bs.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    });
  }
  document.addEventListener('pointerdown', function (e) { if (menuEl && !menuEl.contains(e.target) && !e.target.closest('#dz-wsmenu, #dz-viewmenu')) closeMenu(); });

  /* ---------- toast ---------- */
  function toast(msg, withUndo) {
    clearTimeout(toastTimer);
    el.toast.innerHTML = '';
    if (!msg) { el.toast.classList.remove('on'); return; }
    var s = document.createElement('span'); s.textContent = msg; el.toast.appendChild(s);
    if (withUndo) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t('undo'); b.addEventListener('click', function () { undo(); toast(''); }); el.toast.appendChild(b); }
    el.toast.classList.add('on');
    toastTimer = setTimeout(function () { el.toast.classList.remove('on'); }, withUndo ? 7000 : 3200);
  }

  /* ---------- canvas interaction ---------- */
  function bindCanvas() {
    var c = el.canvas;

    c.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      closeMenu();
      var n = e.target.closest('.dz-ic');
      if (!n || e.target.closest('.dz-rename')) { if (!n) select(null); return; }
      var it = find(n.getAttribute('data-id')); if (!it) return;
      select(it.id);
      var cr = c.getBoundingClientRect(), r = n.getBoundingClientRect();
      drag = { n: n, it: it, sx: e.clientX, sy: e.clientY, ox: r.left + r.width / 2 - cr.left, oy: r.top + r.height / 2 - cr.top, moved: false, target: null, pid: e.pointerId };
      try { n.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });

    c.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved) { if (Math.hypot(dx, dy) < 5) return; drag.moved = true; drag.n.classList.add('drag'); }
      e.preventDefault();
      var cr = c.getBoundingClientRect(), hw = drag.n.offsetWidth / 2, hh = drag.n.offsetHeight / 2;
      var x = Math.max(hw, Math.min(cr.width - hw, drag.ox + dx)), y = Math.max(hh, Math.min(cr.height - hh, drag.oy + dy));
      drag.n.style.left = x + 'px'; drag.n.style.top = y + 'px';
      var under = document.elementsFromPoint(e.clientX, e.clientY), tgt = null;
      for (var k = 0; k < under.length && !tgt; k++) {
        var cand = under[k].closest('.dz-ic.is-folder, .dz-crumb, .dz-tab[data-w]');
        if (cand && cand.classList.contains('dz-tab') && cand.getAttribute('data-w') === active.id) cand = null;
        if (cand && cand !== drag.n) tgt = cand;
      }
      if (tgt !== drag.target) {
        if (drag.target) drag.target.classList.remove('drop');
        if (tgt) tgt.classList.add('drop');
        drag.target = tgt;
      }
    });

    function finish(e, cancel) {
      if (!drag || e.pointerId !== drag.pid) return;
      var d = drag; drag = null;
      d.n.classList.remove('drag'); if (d.target) d.target.classList.remove('drop');
      try { d.n.releasePointerCapture(d.pid); } catch (err) { /* ignore */ }
      if (cancel) { renderIcons(); return; }
      if (d.moved) {
        if (d.target && d.target.classList.contains('is-folder')) {
          var f = find(d.target.getAttribute('data-id'));
          if (f && moveInto(d.it, f)) return;
        } else if (d.target && d.target.classList.contains('dz-tab')) {
          var tw = ws.filter(function (x) { return x.id === d.target.getAttribute('data-w'); })[0], l2 = cur(), i2 = l2.indexOf(d.it);
          if (tw && i2 >= 0) { l2.splice(i2, 1); delete d.it.cx; delete d.it.cy; tw.items.push(d.it); ensureLayout(tw.items); selId = null; renderIcons(); toast(fmt(t('movedWs'), d.it.name, tw.name)); return; }
        } else if (d.target && d.target.classList.contains('dz-crumb')) {
          var lvl = parseInt(d.target.getAttribute('data-level'), 10), s = active.stack;
          if (lvl < s.length) {
            var dest = lvl === 0 ? active.items : s[lvl - 1].children, l = cur(), i = l.indexOf(d.it);
            if (i >= 0) { l.splice(i, 1); delete d.it.cx; delete d.it.cy; dest.push(d.it); ensureLayout(dest); selId = null; renderIcons(); toast(fmt(t('movedUp'), d.it.name, lvl === 0 ? active.name : s[lvl - 1].name)); return; }
          }
        }
        var cr = c.getBoundingClientRect(), hw = d.n.offsetWidth / 2, hh = d.n.offsetHeight / 2;
        var x = parseFloat(d.n.style.left), y = parseFloat(d.n.style.top);
        d.it.cx = Math.max(hw / cr.width, Math.min(1 - hw / cr.width, x / cr.width));
        d.it.cy = Math.max(hh / cr.height, Math.min(1 - hh / cr.height, y / cr.height));
        d.n.style.left = (d.it.cx * 100) + '%'; d.n.style.top = (d.it.cy * 100) + '%';
        return;
      }
      var now = Date.now();
      if (lastTap.id === d.it.id && now - lastTap.t < 380) { lastTap = { id: null, t: 0 }; openItem(d.it); }
      else lastTap = { id: d.it.id, t: now };
    }
    c.addEventListener('pointerup', function (e) { finish(e, false); });
    c.addEventListener('pointercancel', function (e) { finish(e, true); });

    c.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var n = e.target.closest('.dz-ic');
      if (n) {
        var it = find(n.getAttribute('data-id')); if (!it) return; select(it.id);
        menuAt(e.clientX, e.clientY, [
          { l: t('open'), f: function () { openItem(it); } },
          { l: t('rename'), f: function () { renameStart(it.id); } },
          { sep: 1 },
          { l: t('del'), f: function () { remove(it.id); } }
        ]);
      } else {
        select(null);
        menuAt(e.clientX, e.clientY, [{ l: t('newFolder'), f: newFolder }, { sep: 1 }].concat(sizeEntries()));
      }
    });

    c.addEventListener('keydown', function (e) {
      var n = e.target.closest('.dz-ic'); if (!n || e.target.classList.contains('dz-rename')) return;
      var it = find(n.getAttribute('data-id')); if (!it) return;
      var step = 0.03, dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step; else if (e.key === 'ArrowRight') dx = step; else if (e.key === 'ArrowUp') dy = -step; else if (e.key === 'ArrowDown') dy = step;
      if (dx || dy) { e.preventDefault(); it.cx = Math.max(0.05, Math.min(0.95, it.cx + dx)); it.cy = Math.max(0.08, Math.min(0.92, it.cy + dy)); n.style.left = (it.cx * 100) + '%'; n.style.top = (it.cy * 100) + '%'; return; }
      if (e.key === 'Enter') { e.preventDefault(); openItem(it); }
      else if (e.key === 'F2') { e.preventDefault(); renameStart(it.id); }
      else if (e.key === 'Delete') { e.preventDefault(); remove(it.id); }
      else if (e.key === ' ') { e.preventDefault(); select(it.id); }
    });
    c.addEventListener('focusin', function (e) { var n = e.target.closest('.dz-ic'); if (n && n.getAttribute('data-id') !== selId) select(n.getAttribute('data-id')); });

    // tabs, nav, window-level
    el.tabs.addEventListener('click', function (e) {
      var b = e.target.closest('.dz-tab'); if (!b) return;
      if (b.id === 'dz-add') { toast(t('wsLimit')); return; }
      var w = ws.filter(function (x) { return x.id === b.getAttribute('data-w'); })[0]; if (w) switchTo(w);
    });
    el.nav.addEventListener('click', function (e) {
      var cr = e.target.closest('.dz-crumb'), nb = e.target.closest('.dz-nb');
      if (cr) { goUp(active.stack.length - parseInt(cr.getAttribute('data-level'), 10)); return; }
      if (!nb) return;
      var a = nb.getAttribute('data-a');
      if (a === 'back' || a === 'up') goUp(1);
      else if (a === 'fwd' && active.fwd.length) { active.stack.push(active.fwd.pop()); selId = null; renderNav(); renderIcons(); }
    });
    el.window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- init ---------- */
  resetAll(); build(); render();
})();
