/* DURF design system v1.1: topbalk met sitemenu, thema-keuze, embed-gedrag,
   feedbackknop en window.DURF (themakleuren, leads, partners, logo-URL's).
   Gebruik in <head>, zonder defer:  <script src=".../durf-nav.js"></script>
   Optioneel: <div id="durf-topbar"></div> bovenaan <body>; anders wordt de balk
   vooraan in <body> geplaatst. Het menu staat op één plek: SITES hieronder. */
(function () {
  'use strict';

  var BASE = 'https://durf-project.github.io/';
  var DS = BASE + 'durf-design-system/';
  var LOGO = DS + 'assets/favicon.svg';

  // De zes thema's, gelijk aan durf-themes.json (bron: de DURF-roadmap).
  // Pagina's lezen dit via window.DURF.themes in plaats van eigen kleurlijsten.
  var DATA = {
    "version": "1.1.0",
    "source": "DURF roadmap workbook; theme coordinators from the DURF full proposal, section 4.2 Team composition",
    "project": {
      "name": "Dutch Repository Federation",
      "short": "DURF",
      "start": "2026-06-01",
      "end": "2030-05-31",
      "manager": {
        "name": "Maurice Vanderfeesten",
        "institution": "VU Amsterdam"
      },
      "techLead": {
        "name": "Cristina Huidiu",
        "institution": "WUR"
      }
    },
    "themes": [
      {
        "n": 1,
        "name": "Governance of the Federation and Netherlands Research Portal",
        "short": "Governance",
        "colour": "#EE7628",
        "token": "--durf-theme-1",
        "lead": {
          "name": "Alastair Dunning",
          "institution": "TU Delft",
          "contact": "Alastair Dunning, theme lead at TU Delft, with co-lead Maurice Vanderfeesten (VU Amsterdam)",
          "coLead": {
            "name": "Maurice Vanderfeesten",
            "institution": "VU Amsterdam"
          }
        },
        "partners": [
          {
            "name": "SURF",
            "role": "community management, legal advice, project assistance"
          }
        ]
      },
      {
        "n": 2,
        "name": "Metadata Quality Improvement",
        "short": "Metadata",
        "colour": "#F6DA44",
        "token": "--durf-theme-2",
        "lead": {
          "name": "Rutger de Jong",
          "institution": "Leiden University",
          "contact": "Rutger de Jong, theme lead at Leiden University"
        },
        "partners": [
          {
            "name": "WUR",
            "role": "tech lead"
          },
          {
            "name": "SURF",
            "role": "community management, legal advice, project assistance, architect"
          },
          {
            "name": "KB",
            "role": "WISH"
          }
        ]
      },
      {
        "n": 3,
        "name": "Full Text Capture",
        "short": "Fulltext",
        "colour": "#177ABF",
        "token": "--durf-theme-3",
        "lead": {
          "name": "Pascal Braak",
          "institution": "University of Amsterdam",
          "contact": "Pascal Braak, theme lead at the University of Amsterdam"
        },
        "partners": [
          {
            "name": "WUR",
            "role": "tech lead"
          },
          {
            "name": "SURF",
            "role": "community management, legal advice, project assistance"
          }
        ]
      },
      {
        "n": 4,
        "name": "KB National Library e-Depot Archiving",
        "short": "Archive",
        "colour": "#17A95D",
        "token": "--durf-theme-4",
        "lead": {
          "name": "Simone Kortekaas",
          "institution": "KB National Library",
          "contact": "Simone Kortekaas, theme lead at the KB National Library"
        },
        "partners": [
          {
            "name": "WUR",
            "role": "tech lead"
          },
          {
            "name": "SURF",
            "role": "legal"
          }
        ]
      },
      {
        "n": 5,
        "name": "Metadata Distribution & Discovery Optimization",
        "short": "Discovery",
        "colour": "#5C1B61",
        "token": "--durf-theme-5",
        "lead": {
          "name": "Rutger de Jong",
          "institution": "Leiden University",
          "contact": "Rutger de Jong, theme lead at Leiden University"
        },
        "partners": [
          {
            "name": "WUR",
            "role": "tech lead"
          }
        ]
      },
      {
        "n": 6,
        "name": "NL Research Portal Update",
        "short": "Portal",
        "colour": "#83201B",
        "token": "--durf-theme-6",
        "lead": {
          "name": "Naomi Wahls van Gils",
          "institution": "TU Delft",
          "contact": "Naomi Wahls van Gils, theme lead at TU Delft"
        },
        "partners": []
      }
    ]
  };

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

  // Publieke API. Bestaat window.DURF al (een tweede kopie van dit script), dan vullen we aan.
  var API = window.DURF = window.DURF || {};
  API.version = DATA.version;
  API.base = DS;
  API.project = DATA.project;
  API.themes = DATA.themes;
  API.theme = function (n) { n = Number(n); return DATA.themes.filter(function (t) { return t.n === n; })[0] || null; };
  API.assets = { logo: DS + 'assets/durf-logo.svg', mark: DS + 'assets/durf-mark.svg', favicon: DS + 'assets/favicon.svg', og: DS + 'assets/durf-og.png' };
  var SCRIPT = document.currentScript || {};
  var OPT = SCRIPT.dataset || {};   // data-topbar="off", data-durf-theme="N" op de script-tag

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


  /* ---------- Feedbackknop ----------
     Zwevende knop rechtsonder op elke pagina met een uitnodigende dialoog. De
     feedback gaat als vooraf ingevuld issue naar de repo waar de pagina staat
     (sjabloon .github/ISSUE_TEMPLATE/feedback.yml), of per e-mail naar FEEDBACK_EMAIL.
     Gebouwd in een shadow root: de stijl botst niet met oat, marimo of de pagina
     zelf en leest wel de DURF-tokens (custom properties gaan door de shadow-grens). */
  var FEEDBACK_EMAIL = 'durf@surf.nl';
  var ORG = 'https://github.com/durf-project/';
  // Repo per eerste padsegment; onbekende adressen (404) gaan naar de home.
  var FEEDBACK_REPOS = ['project-page', 'position-paper', 'durf-gantt', 'durf-data-mesh-architecture', 'dashboards', 'durf-design-system'];
  // Wie de feedback leest en beantwoordt. Per thema (dashboards zetten data-durf-theme)
  // en per site. Pas namen hier aan, dan volgen alle pagina's.
  // Namen per thema komen uit DATA hierboven (lead.contact).
  var THEME_LEADS = {};
  DATA.themes.forEach(function (t) { THEME_LEADS[t.n] = { theme: t.name, lead: t.lead.contact }; });
  var SITE_CONTACTS = {
    'position-paper': 'the authors of the position paper',
    'durf-data-mesh-architecture': 'Maurice Vanderfeesten, author of this page',
    'durf-gantt': 'the DURF theme leads',
    'dashboards': 'the DURF theme leads'
  };
  var DEFAULT_CONTACT = 'the DURF team';

  function feedbackTarget() {
    var seg = location.pathname.split('/').filter(Boolean)[0];
    var repo = root.getAttribute('data-feedback-repo') || (FEEDBACK_REPOS.indexOf(seg) >= 0 ? seg : 'project-page');
    var n = OPT.durfTheme || root.getAttribute('data-durf-theme');
    var t = THEME_LEADS[n];
    var who = t ? t.lead : (SITE_CONTACTS[seg] || DEFAULT_CONTACT);
    var about = t ? 'Theme ' + n + ', ' + t.theme : '';
    return { repo: repo, who: who, about: about };
  }

  function pageUrl() {
    var u = new URL(location.href);
    u.searchParams.delete('embed'); u.searchParams.delete('theme');
    return u.toString();
  }

  var FB_CSS =
    ':host{all:initial}' +
    '*{box-sizing:border-box}' +
    '.fab{position:fixed;right:max(1rem,env(safe-area-inset-right));bottom:max(1rem,env(safe-area-inset-bottom));z-index:90;display:inline-flex;align-items:center;gap:.5rem;' +
      'padding:.6rem 1rem;border:0;border-radius:999px;cursor:pointer;font:600 .9375rem/1.2 var(--font-sans,system-ui,sans-serif);' +
      'background:var(--accent-solid,#177ABF);color:var(--accent-on,#fff);box-shadow:0 .25rem 1rem rgba(0,0,0,.18)}' +
    '.fab:hover{filter:brightness(1.08)}.fab:focus-visible{outline:2px solid var(--foreground,#050E1D);outline-offset:3px}' +
    '.fab svg{width:1.1rem;height:1.1rem}' +
    '@media (max-width:40rem){.fab span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.fab{padding:.75rem}}' +
    '@media print{.fab{display:none}}' +
    'dialog{width:min(34rem,calc(100vw - 2rem));max-height:calc(100dvh - 2rem);padding:0;border:1px solid var(--border,#EAECF0);border-radius:.75rem;' +
      'background:var(--card,#fff);color:var(--foreground,#050E1D);font:400 1rem/1.55 var(--font-sans,system-ui,sans-serif);box-shadow:0 1.5rem 3rem rgba(5,14,29,.3)}' +
    'dialog::backdrop{background:rgba(5,14,29,.5)}' +
    'form{display:flex;flex-direction:column;max-height:calc(100dvh - 2rem);margin:0}' +
    '.body{padding:1.25rem 1.5rem .5rem;overflow-y:auto}' +
    'h2{margin:0 0 .5rem;font:800 1.375rem/1.25 var(--font-heading,var(--font-sans,system-ui,sans-serif));letter-spacing:-.01em}' +
    'p{margin:0 0 .75rem}.muted{color:var(--muted-foreground,#5E6873);font-size:.875rem}' +
    '.who{margin:.25rem 0 1rem;padding:.75rem 1rem;border-radius:.5rem;background:var(--muted,#F4F6F8);font-size:.9375rem}' +
    'a{color:var(--link,#177ABF);font-weight:600}' +
    'label{display:block;margin:.75rem 0 .25rem;font-weight:700;font-size:.9375rem}' +
    'textarea,input{width:100%;padding:.55rem .7rem;border:1px solid var(--input,#CDD0D5);border-radius:.5rem;background:var(--background,#fff);color:inherit;font:inherit}' +
    'textarea{min-height:7.5rem;resize:vertical}textarea:focus,input:focus{outline:2px solid var(--ring,#177ABF);outline-offset:0;border-color:transparent}' +
    '.page{font-size:.8125rem;color:var(--muted-foreground,#5E6873);overflow-wrap:anywhere}' +
    '.actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;padding:1rem 1.5rem 1.25rem;border-top:1px solid var(--border,#EAECF0)}' +
    'button{font:600 .9375rem/1.2 var(--font-sans,system-ui,sans-serif);padding:.6rem 1rem;border-radius:.5rem;cursor:pointer;border:1px solid var(--input,#CDD0D5);background:transparent;color:inherit}' +
    'button.primary{background:var(--accent-solid,#177ABF);border-color:var(--accent-solid,#177ABF);color:var(--accent-on,#fff)}' +
    'button.ghost{border-color:transparent;margin-right:auto}' +
    'button:focus-visible{outline:2px solid var(--ring,#177ABF);outline-offset:2px}' +
    '.hint{margin:.5rem 0 0;font-size:.8125rem;color:var(--danger,#C0364A)}';

  function buildFeedback() {
    if (document.getElementById('durf-feedback')) return;
    var host = document.createElement('div');
    host.id = 'durf-feedback';
    var sh = host.attachShadow({ mode: 'open' });
    var tgt = feedbackTarget();
    var esc2 = esc;
    sh.innerHTML = '<style>' + FB_CSS + '</style>' +
      '<button class="fab" type="button" aria-haspopup="dialog">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '<span>Feedback</span></button>' +
      '<dialog aria-labelledby="fb-title"><form method="dialog">' +
        '<div class="body">' +
          '<h2 id="fb-title">We would love to hear from you</h2>' +
          '<p>Every remark helps: a question, an idea, a figure that looks off, a typo, or something you liked. We read feedback as a sign that you care, never as criticism. DURF is something we build together, as a community.</p>' +
          '<p class="who">Your feedback is read and answered by <strong>' + esc2(tgt.who) + '</strong>' + (tgt.about ? ' (' + esc2(tgt.about) + ')' : '') + '. ' +
            'You can also write to <a href="mailto:' + FEEDBACK_EMAIL + '">' + FEEDBACK_EMAIL + '</a>.</p>' +
          '<label for="fb-text">Your feedback</label>' +
          '<textarea id="fb-text" placeholder="What would you like to share?"></textarea>' +
          '<label for="fb-contact">Your name or e-mail <span class="muted">(optional, if you would like a reply)</span></label>' +
          '<input id="fb-contact" type="text" autocomplete="email">' +
          '<p class="page">About: <span id="fb-page"></span></p>' +
          '<p class="hint" id="fb-hint" hidden>Write a few words first, then choose how to send it.</p>' +
          '<p class="muted">On GitHub your feedback becomes a public issue (a GitHub account is needed). By e-mail it reaches the team directly.</p>' +
        '</div>' +
        '<div class="actions">' +
          '<button type="submit" class="ghost" value="cancel">Cancel</button>' +
          '<button type="button" id="fb-mail">Send by e-mail</button>' +
          '<button type="button" class="primary" id="fb-gh">Continue on GitHub</button>' +
        '</div>' +
      '</form></dialog>';

    var dlg = sh.querySelector('dialog'), fab = sh.querySelector('.fab');
    var text = sh.getElementById('fb-text'), contact = sh.getElementById('fb-contact'), hint = sh.getElementById('fb-hint');
    fab.addEventListener('click', function () {
      tgt = feedbackTarget();
      sh.getElementById('fb-page').textContent = document.title + ' (' + pageUrl() + ')';
      hint.hidden = true;
      dlg.showModal();
      text.focus();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    text.addEventListener('input', function () { if (text.value.trim()) hint.hidden = true; });
    function ready() { if (text.value.trim()) return true; hint.hidden = false; text.focus(); return false; }
    function title() { return 'Feedback: ' + document.title; }
    sh.getElementById('fb-gh').addEventListener('click', function () {
      if (!ready()) return;
      var q = new URLSearchParams({ template: 'feedback.yml', title: title(), page: pageUrl(), feedback: text.value, contact: contact.value });
      window.open(ORG + tgt.repo + '/issues/new?' + q.toString(), '_blank', 'noopener');
      dlg.close();
    });
    sh.getElementById('fb-mail').addEventListener('click', function () {
      if (!ready()) return;
      var body = text.value + '\n\n' + (contact.value ? 'From: ' + contact.value + '\n' : '') + 'Page: ' + pageUrl() + '\n';
      location.href = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + encodeURIComponent(title()) + '&body=' + encodeURIComponent(body);
      dlg.close();
    });
    document.body.appendChild(host);
  }

  // Favicon van het design system als de pagina er zelf geen heeft.
  function favicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    var l = document.createElement('link');
    l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = LOGO;
    document.head.appendChild(l);
  }

  function start() {
    favicon();
    if (OPT.topbar !== 'off') build();
    // Niet in embeds: daar is de pagina een onderdeel van een andere pagina.
    if (!root.hasAttribute('data-embed')) buildFeedback();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
