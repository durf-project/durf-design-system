/* DURF topbalk met sitemenu, thema-keuze en embed-gedrag.
   Gebruik in <head>, zonder defer:  <script src=".../durf-nav.js"></script>
   Optioneel: <div id="durf-topbar"></div> bovenaan <body>; anders wordt de balk
   vooraan in <body> geplaatst. Het menu staat op één plek: SITES hieronder. */
(function () {
  'use strict';

  var BASE = 'https://durf-project.github.io/';
  var LOGO = BASE + 'project-page/assets/durf-favicon.png';

  // Eén bron voor het menu. Pas hier aan, alle sites volgen na een nieuwe release.
  var SITES = [
    { slug: 'project-page',               label: 'Home' },
    { slug: 'position-paper',             label: 'Position paper' },
    { slug: 'durf-gantt',                 label: 'Roadmap' },
    { slug: 'durf-data-mesh-architecture', label: 'Data contracts' },
    { slug: 'dashboards',                 label: 'Dashboards' }
  ];
  var EXTRA = [
    { href: 'https://github.com/durf-project', label: 'GitHub' }
  ];

  var root = document.documentElement;
  var KEY = 'durf-theme';

  // Thema zo vroeg mogelijk zetten, tegen een flits van het verkeerde thema
  function readTheme() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
  }
  applyTheme(readTheme());

  // Embed-modus: dezelfde postMessage-afspraak als de bestaande embeds
  if (new URLSearchParams(location.search).has('embed')) root.setAttribute('data-embed', '');
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'durf-embed-theme') applyTheme(e.data.theme);
  });

  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>'
  };
  var NEXT = { auto: 'light', light: 'dark', dark: 'auto' };
  var NAME = { auto: 'Thema: systeem', light: 'Thema: licht', dark: 'Thema: donker' };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    var host = document.getElementById('durf-topbar');
    var bar = document.createElement('header');
    bar.className = 'durf-topbar';

    var current = location.pathname.split('/').filter(Boolean)[0];
    var links = SITES.map(function (s) {
      var here = s.slug === current;
      return '<li><a href="' + BASE + s.slug + '/"' + (here ? ' aria-current="page"' : '') + '>' + esc(s.label) + '</a></li>';
    }).concat(EXTRA.map(function (x) {
      return '<li><a href="' + esc(x.href) + '">' + esc(x.label) + '</a></li>';
    })).join('');

    bar.innerHTML =
      '<div class="durf-topbar__inner">' +
        '<a class="durf-topbar__brand" href="' + BASE + '"><img src="' + LOGO + '" alt="">DURF</a>' +
        '<nav aria-label="DURF"><ul class="durf-topbar__nav" id="durf-nav-list">' + links + '</ul></nav>' +
        '<span class="durf-topbar__spacer"></span>' +
        '<button class="durf-topbar__btn" type="button" id="durf-theme-btn"></button>' +
        '<button class="durf-topbar__btn durf-topbar__menu-btn" type="button" aria-controls="durf-nav-list" aria-expanded="false" aria-label="Menu">' + ICON.menu + '</button>' +
      '</div>';

    // <nav> staat in de flex-rij; de lijst zelf moet op mobiel absoluut tegen de balk aan
    var nav = bar.querySelector('nav');
    nav.style.display = 'contents';

    if (host) host.replaceWith(bar); else document.body.insertBefore(bar, document.body.firstChild);

    var themeBtn = bar.querySelector('#durf-theme-btn');
    function paintTheme() {
      var t = readTheme() || 'auto';
      themeBtn.innerHTML = ICON[t];
      themeBtn.setAttribute('aria-label', NAME[t] + ' (klik om te wisselen)');
      themeBtn.title = NAME[t];
    }
    themeBtn.addEventListener('click', function () {
      var next = NEXT[readTheme() || 'auto'];
      try { if (next === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, next); } catch (e) {}
      applyTheme(next === 'auto' ? null : next);
      paintTheme();
    });
    paintTheme();

    var menuBtn = bar.querySelector('.durf-topbar__menu-btn');
    menuBtn.addEventListener('click', function () {
      var open = bar.hasAttribute('data-open');
      if (open) bar.removeAttribute('data-open'); else bar.setAttribute('data-open', '');
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { bar.removeAttribute('data-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
