/* DURF design system v1.1: durf-site.js
   Renders a page from Markdown files with front matter, in DURF style.
   Adapted from the PID2Portal landing page (surf-ori/pid2portal-project, EUPL-1.2).

   Usage (after durf.css, durf-site.css and durf-nav.js):
     <main id="durf-sections"></main>
     <script src="https://durf-project.github.io/durf-design-system/durf-site.js" defer></script>

   The script reads content/sections.json and content/<file>.md relative to the page.
   sections.json is either ["00-hero.md", "01-stats.md"] or { "sections": ["about", "themes"] }.
   An optional content/footer.md is rendered into #durf-footer.
   Options on the script tag: data-content="content/" (folder), data-target="#durf-sections".
   Conventions per layout: see README.md, section "Markdown-sites". */
(function () {
  'use strict';

  var SCRIPT = document.currentScript || {};
  var OPT = SCRIPT.dataset || {};
  var HERE = SCRIPT.src ? SCRIPT.src.replace(/[^/]*$/, '') : 'https://durf-project.github.io/durf-design-system/';
  var CONTENT = (OPT.content || 'content/').replace(/\/?$/, '/');
  var META_KEYS = ['icon', 'tags', 'number', 'status', 'date', 'theme', 'image', 'link'];
  var UNKNOWN = /^(unknown|not yet measured|not measured|n\/?a|tbd|tbc|\?|-|–)$/i;

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function kids(node) {
    return Array.prototype.slice.call(node.childNodes).filter(function (n) {
      return !(n.nodeType === 3 && !n.textContent.trim()) && n.nodeType !== 8;
    });
  }

  function parseFrontMatter(text) {
    var meta = {};
    text = text.replace(/^﻿/, '').replace(/\r\n/g, '\n');
    var m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!m) return { meta: meta, body: text };
    m[1].split('\n').forEach(function (line) {
      var kv = line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*(\s#.*)?$/);
      if (kv) meta[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, '');
    });
    return { meta: meta, body: text.slice(m[0].length) };
  }

  function toFragment(md) {
    var t = document.createElement('template');
    t.innerHTML = window.marked.parse(md, { gfm: true });
    return t.content;
  }

  function themeOf(n) {
    n = parseInt(n, 10);
    return n >= 1 && n <= 6 ? n : null;
  }

  function themeInfo(n) {
    return window.DURF && window.DURF.theme ? window.DURF.theme(n) : null;
  }

  function isExternal(a) {
    return /^https?:\/\//.test(a.getAttribute('href') || '') && a.hostname !== location.hostname;
  }

  // A list item that holds nothing but one link.
  function linkOnly(li) {
    var links = li.querySelectorAll('a');
    if (links.length !== 1) return null;
    return li.textContent.trim() === links[0].textContent.trim() ? links[0] : null;
  }

  // Trailing link-only list items become a row of buttons; the first one is the main button.
  function buttonize(root) {
    root.querySelectorAll('ul').forEach(function (ul) {
      if (ul.closest('.durf-actions')) return;
      var items = Array.prototype.slice.call(ul.children);
      var k = items.length;
      while (k > 0 && linkOnly(items[k - 1])) k--;
      if (k === items.length) return;
      var row = el('div', 'durf-actions');
      items.slice(k).forEach(function (li, i) {
        var a = linkOnly(li);
        a.classList.add('button');
        if (i > 0) a.classList.add('outline');
        a.insertAdjacentHTML('beforeend', '<span class="durf-arrow" aria-hidden="true">' + (isExternal(a) ? '↗' : '→') + '</span>');
        row.appendChild(a);
        li.remove();
      });
      ul.after(row);
      if (!ul.children.length) ul.remove();
    });
  }

  // A paragraph with only a video link becomes an embedded player.
  function embedVideos(root) {
    root.querySelectorAll('p').forEach(function (p) {
      var a = p.querySelector('a');
      if (!a || p.textContent.trim() !== a.textContent.trim()) return;
      var src = null, m;
      if ((m = a.href.match(/^https:\/\/video\.edu\.nl\/w\/([\w-]+)/))) src = 'https://video.edu.nl/videos/embed/' + m[1];
      else if ((m = a.href.match(/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/))) src = 'https://www.youtube-nocookie.com/embed/' + m[1];
      if (!src) return;
      var wrap = el('div', 'durf-video');
      var f = document.createElement('iframe');
      f.src = src; f.title = a.textContent.trim() || 'Video'; f.loading = 'lazy';
      f.allowFullscreen = true; f.setAttribute('allow', 'fullscreen');
      wrap.appendChild(f);
      p.replaceWith(wrap);
    });
  }

  function decorateLinks(root) {
    root.querySelectorAll('a[href]').forEach(function (a) {
      if (isExternal(a)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    root.querySelectorAll('img').forEach(function (img) { img.loading = 'lazy'; img.decoding = 'async'; });
  }

  // Headings that start with "1." to "6." get a dot in that theme colour (front matter theme-dots: true).
  function themeDots(root) {
    root.querySelectorAll('h2, h3, .durf-accordion__title').forEach(function (h) {
      var m = /^\s*(?:Theme\s+)?([1-6])[.:]\s/i.exec(h.textContent);
      if (!m) return;
      (h.classList.contains('durf-accordion__title') ? h.parentNode.parentNode : h).setAttribute('data-theme-n', m[1]);
      h.insertAdjacentHTML('afterbegin', '<span class="durf-theme-dot" aria-hidden="true"></span>');
    });
  }

  // "key: value" lines straight under a card heading.
  function takeMeta(nodes) {
    var meta = {};
    var first = nodes[0];
    if (!first || first.tagName !== 'P') return meta;
    var lines = first.textContent.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var ok = lines.length && lines.every(function (l) {
      var m = l.match(/^([a-z]+)\s*:\s*(.+)$/i);
      return m && META_KEYS.indexOf(m[1].toLowerCase()) > -1;
    });
    if (!ok) return meta;
    lines.forEach(function (l) {
      var m = l.match(/^([a-z]+)\s*:\s*(.+)$/i);
      meta[m[1].toLowerCase()] = m[2];
    });
    nodes.shift();
    return meta;
  }

  function tagsHtml(tags) {
    if (!tags) return '';
    return '<div class="durf-tags">' + tags.split(',').map(function (t) {
      t = t.trim();
      var tone = /production|live|done|ready|published|gereed/i.test(t) ? ' data-tone="good"'
        : /draft|concept|planned|soon|preview/i.test(t) ? ' data-tone="draft"'
        : /risk|late|blocked/i.test(t) ? ' data-tone="warn"' : '';
      var th = /^theme\s+([1-6])$/i.exec(t);
      if (th) tone = ' data-theme-n="' + th[1] + '"';
      return '<span class="durf-tag"' + tone + '>' + esc(t) + '</span>';
    }).join('') + '</div>';
  }

  function themeChip(n) {
    var t = themeInfo(n);
    return '<span class="durf-theme-chip" data-theme-n="' + n + '">Theme ' + n + (t ? ' · ' + esc(t.short) : '') + '</span>';
  }

  // Split nodes into an intro and groups that each start with a heading of the given level.
  function splitBy(nodes, tag) {
    var intro = [], groups = [], cur = null;
    nodes.forEach(function (n) {
      if (n.tagName === tag) { cur = { head: n, nodes: [] }; groups.push(cur); }
      else if (cur) cur.nodes.push(n);
      else intro.push(n);
    });
    return { intro: intro, groups: groups };
  }

  function isImagePara(n) {
    return n.tagName === 'P' && n.children.length === 1 && n.firstElementChild.tagName === 'IMG' && !n.textContent.trim();
  }

  function takeImage(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (isImagePara(nodes[i])) return nodes.splice(i, 1)[0].firstElementChild;
    }
    return null;
  }

  function sectionHeader(meta, introNodes) {
    var head = el('div', 'durf-section-head');
    if (meta.eyebrow) head.appendChild(el('p', 'durf-eyebrow', esc(meta.eyebrow)));
    introNodes.forEach(function (n) { head.appendChild(n); });
    return head;
  }

  /* ---------- layouts ---------- */

  var layouts = {
    hero: function (frag, meta, inner) {
      var grid = el('div', 'durf-hero');
      var text = el('div', 'durf-hero__text');
      if (meta.eyebrow) text.appendChild(el('p', 'durf-eyebrow', esc(meta.eyebrow)));
      text.appendChild(frag);
      grid.appendChild(text);
      var vis = el('div', 'durf-hero__visual');
      // Coloured blocks in four theme colours behind the visual, like the SURF template cover.
      var blocks = '<span class="durf-blk" data-theme-n="1" aria-hidden="true"></span><span class="durf-blk" data-theme-n="2" aria-hidden="true"></span>' +
        '<span class="durf-blk" data-theme-n="4" aria-hidden="true"></span><span class="durf-blk" data-theme-n="3" aria-hidden="true"></span>';
      if (meta.image) {
        vis.innerHTML = blocks +
          '<figure class="durf-frame durf-frame--a"><img src="' + esc(meta.image) + '" alt="' + esc(meta['image-alt'] || '') + '"></figure>' +
          (meta.image2 ? '<figure class="durf-frame durf-frame--b"><img src="' + esc(meta.image2) + '" alt="' + esc(meta['image2-alt'] || '') + '"></figure>' : '');
      } else if (meta.visual !== 'none') {
        vis.classList.add('durf-hero__visual--logo');
        var src = meta.visual && meta.visual !== 'logo' ? meta.visual : HERE + 'assets/durf-logo.svg';
        vis.innerHTML = '<img class="durf-hero__logo" src="' + esc(src) + '" alt="' + esc(meta['image-alt'] || 'Dutch Repository Federation: making Dutch research global, open and resilient') + '">';
      }
      if (vis.childNodes.length) grid.appendChild(vis); else grid.classList.add('durf-hero--text-only');
      inner.appendChild(grid);
    },

    stats: function (frag, meta, inner) {
      var nodes = kids(frag);
      var list = null, intro = [], after = [];
      nodes.forEach(function (n) {
        if (n.tagName === 'UL' && !list) list = n; else (list ? after : intro).push(n);
      });
      if (intro.length || meta.eyebrow) inner.appendChild(sectionHeader(meta, intro));
      var ul = el('ul', 'durf-stats');
      if (list) Array.prototype.slice.call(list.children).forEach(function (li, i) {
        var item = el('li', 'durf-stat');
        var th = null;
        li.innerHTML = li.innerHTML.replace(/\{theme-([1-6])\}\s*/, function (_, n) { th = n; return ''; });
        item.setAttribute('data-theme-n', th || (i % 6) + 1);
        var strong = li.querySelector('strong');
        var value = strong ? strong.textContent.trim() : '';
        if (strong) strong.remove();
        if (UNKNOWN.test(value)) {
          item.classList.add('is-unknown');
          item.appendChild(el('span', 'durf-stat__value', value === '?' || value === '-' || value === '–' || /^n\/?a$/i.test(value) ? 'Unknown' : esc(value.charAt(0).toUpperCase() + value.slice(1))));
          item.appendChild(el('span', 'durf-stat__label', li.innerHTML.trim()));
          if (!/not yet measured/i.test(value)) item.appendChild(el('span', 'durf-stat__note', 'Not yet measured'));
        } else {
          item.appendChild(el('span', 'durf-stat__value', esc(value)));
          item.appendChild(el('span', 'durf-stat__label', li.innerHTML.trim()));
        }
        ul.appendChild(item);
      });
      inner.appendChild(ul);
      after.forEach(function (n) { var d = el('div', 'durf-stats__after'); d.appendChild(n); inner.appendChild(d); });
    },

    statement: function (frag, meta, inner) {
      var box = el('div', 'durf-statement');
      if (meta.eyebrow) box.appendChild(el('p', 'durf-statement__label', esc(meta.eyebrow)));
      kids(frag).forEach(function (n) {
        if (n.tagName === 'P' && !box.querySelector('.durf-statement__text') && !n.querySelector('img')) n.className = 'durf-statement__text';
        box.appendChild(n);
      });
      inner.appendChild(box);
    },

    cards: function (frag, meta, inner) {
      var parts = splitBy(kids(frag), 'H3');
      inner.appendChild(sectionHeader(meta, parts.intro));
      var grid = el('div', 'durf-grid');
      if (meta.columns) grid.style.setProperty('--cols', meta.columns);
      parts.groups.forEach(function (g) {
        var cm = takeMeta(g.nodes);
        var img = takeImage(g.nodes);
        var th = themeOf(cm.theme);
        var card = el('article', 'durf-card durf-card--site');
        if (th) { card.setAttribute('data-theme-n', th); card.classList.add('has-theme'); }
        if (img) {
          var media = el('figure', 'durf-card__media');
          media.appendChild(img);
          card.appendChild(media);
        }
        var body = el('div', 'durf-card__body');
        var top = el('div', 'durf-card__top');
        if (cm.date) top.appendChild(el('span', 'durf-card__date', esc(cm.date)));
        else if (cm.number) top.appendChild(el('span', 'durf-card__number', esc(cm.number)));
        else if (th) top.innerHTML = themeChip(th);
        top.insertAdjacentHTML('beforeend', tagsHtml(cm.tags));
        if (top.childNodes.length) body.appendChild(top);
        body.appendChild(g.head);
        g.nodes.forEach(function (n) { body.appendChild(n); });
        card.appendChild(body);
        grid.appendChild(card);
      });
      inner.appendChild(grid);
    },

    features: function (frag, meta, inner) {
      var parts = splitBy(kids(frag), 'H3');
      inner.appendChild(sectionHeader(meta, parts.intro));
      parts.groups.forEach(function (g, i) {
        var cm = takeMeta(g.nodes);
        var img = takeImage(g.nodes);
        var row = el('article', 'durf-feature' + (i % 2 ? ' durf-feature--flip' : '') + (img ? '' : ' durf-feature--text'));
        var th = themeOf(cm.theme);
        if (th) row.setAttribute('data-theme-n', th);
        if (img) {
          var fig = el('figure', 'durf-frame durf-feature__media');
          fig.appendChild(img);
          row.appendChild(fig);
        }
        var text = el('div', 'durf-feature__text');
        if (th) text.insertAdjacentHTML('beforeend', themeChip(th));
        text.insertAdjacentHTML('beforeend', tagsHtml(cm.tags));
        text.appendChild(g.head);
        g.nodes.forEach(function (n) { text.appendChild(n); });
        row.appendChild(text);
        inner.appendChild(row);
      });
    },

    timeline: function (frag, meta, inner) {
      var intro = [], list = null, after = [];
      kids(frag).forEach(function (n) {
        if (n.tagName === 'UL' && !list) list = n; else (list ? after : intro).push(n);
      });
      inner.appendChild(sectionHeader(meta, intro));
      var ol = el('ol', 'durf-timeline');
      if (list) Array.prototype.slice.call(list.children).forEach(function (li, i) {
        var item = el('li', 'durf-timeline__item');
        var th = null;
        li.innerHTML = li.innerHTML.replace(/\{theme-([1-6])\}\s*/, function (_, n) { th = n; return ''; });
        item.setAttribute('data-theme-n', th || (i % 6) + 1);
        var strong = li.querySelector('strong');
        if (strong) { item.appendChild(el('span', 'durf-timeline__pill', strong.innerHTML)); strong.remove(); }
        item.appendChild(el('span', 'durf-timeline__text', li.innerHTML.trim()));
        ol.appendChild(item);
      });
      ol.style.setProperty('--n', ol.children.length || 1);
      inner.appendChild(ol);
      after.forEach(function (n) { inner.appendChild(n); });
    },

    media: function (frag, meta, inner) {
      var head = [], vids = [];
      // Videos, and standalone images, go to the side; the rest is the text.
      kids(frag).forEach(function (n) {
        if (isImagePara(n)) { vids.push(n.firstElementChild); return; }
        (n.classList && n.classList.contains('durf-video') ? vids : head).push(n);
      });
      var grid = el('div', 'durf-media');
      grid.appendChild(sectionHeader(meta, head));
      var side = el('div', 'durf-media__side');
      vids.forEach(function (n) { var f = el('div', 'durf-frame'); f.appendChild(n); side.appendChild(f); });
      grid.appendChild(side);
      inner.appendChild(grid);
    },

    band: function (frag, meta, inner) {
      var box = el('div', 'durf-band');
      box.appendChild(sectionHeader(meta, kids(frag)));
      inner.appendChild(box);
    },

    prose: function (frag, meta, inner) {
      var box = el('div', 'durf-prose durf-site-prose');
      box.appendChild(sectionHeader(meta, kids(frag)));
      inner.appendChild(box);
    },

    // Every item heading becomes a collapsed <details>. Items are ### when the file has any,
    // otherwise ##; a heading above that level is the section title. front matter open: first|all.
    accordion: function (frag, meta, inner) {
      var nodes = kids(frag);
      var level = meta.item ? meta.item.toUpperCase() : (nodes.some(function (n) { return n.tagName === 'H3'; }) ? 'H3' : 'H2');
      var parts = splitBy(nodes, level);
      inner.appendChild(sectionHeader(meta, parts.intro));
      var list = el('div', 'durf-accordion');
      parts.groups.forEach(function (g, i) {
        var d = el('details');
        var sm = el('summary', null, '<span class="durf-accordion__title">' + g.head.innerHTML + '</span>');
        var id = g.head.id || '';
        if (id) d.id = id;
        var cm = takeMeta(g.nodes);
        if (cm.date) sm.insertAdjacentHTML('beforeend', '<span class="durf-accordion__date">' + esc(cm.date) + '</span>');
        var th = themeOf(cm.theme);
        if (th) d.setAttribute('data-theme-n', th);
        d.appendChild(sm);
        var body = el('div', 'durf-accordion__body');
        g.nodes.forEach(function (n) { body.appendChild(n); });
        d.appendChild(body);
        if (meta.open === 'all' || (meta.open === 'first' && i === 0)) d.open = true;
        list.appendChild(d);
      });
      inner.appendChild(list);
    }
  };

  /* ---------- #hash: open accordion items and land below the topbar ---------- */
  function openHash() {
    if (!location.hash) return;
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!t) return;
    if (t.tagName === 'DETAILS') t.open = true;
    var d = t.closest && t.closest('details'); if (d) d.open = true;
    t.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  /* ---------- rendering ---------- */

  var USED_IDS = {};

  function slug(s) {
    return String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function renderSection(name, text) {
    var parsed = parseFrontMatter(text);
    var meta = parsed.meta;
    var layout = layouts[meta.layout] ? meta.layout : 'prose';
    var frag = toFragment(parsed.body);
    embedVideos(frag);
    buttonize(frag);
    decorateLinks(frag);
    var sectionId = meta.id || name.replace(/\.md$/, '').replace(/^\d+[a-z]?-/, '');
    USED_IDS[sectionId] = true;
    // Heading ids must be unique on the page: a heading with the same text as its
    // section ("## Announcements" in #announcements) gets a suffix instead.
    frag.querySelectorAll('h2, h3').forEach(function (h) {
      if (h.id) { USED_IDS[h.id] = true; return; }
      var base = slug(h.textContent) || 'section', id = base, i = 2;
      while (USED_IDS[id] || document.getElementById(id)) id = base + '-' + (i++);
      USED_IDS[id] = true; h.id = id;
    });

    var section = el('section', 'durf-section durf-layout-' + layout);
    section.id = sectionId;
    section.dataset.source = CONTENT + name;
    var th = themeOf(meta.theme);
    if (th) section.setAttribute('data-theme-n', th);
    if (meta.background) section.setAttribute('data-background', meta.background);
    var inner = el('div', 'durf-shell' + (meta.width === 'narrow' ? ' narrow' : ''));
    layouts[layout](frag, meta, inner);
    if (meta['theme-dots'] === 'true' || meta['theme-dots'] === 'yes') themeDots(inner);
    section.appendChild(inner);
    var label = section.querySelector('h1, h2');
    if (label) {
      if (!label.id) label.id = section.id + '-title';
      section.setAttribute('aria-labelledby', label.id);
    }
    return { section: section, nav: meta.nav };
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' (' + r.status + ')');
      return r.text();
    });
  }

  function target() {
    return document.querySelector(OPT.target || '#durf-sections') || document.getElementById('sections');
  }

  function showError(err) {
    var box = target();
    if (!box) return;
    box.innerHTML = '<div class="durf-shell"><div class="durf-callout" data-tone="bad" role="alert"><p><strong>The page content could not be loaded.</strong> ' +
      esc(String(err && err.message || err)) + '. Opening the page straight from disk does not work; start a small web server in this folder, ' +
      'for example <code>python3 -m http.server</code>, and open <code>http://localhost:8000</code>.</p></div></div>';
  }

  // Section links: fill every [data-durf-section-nav] (or #durf-section-nav) with the nav: labels.
  function setupNav(entries) {
    var navs = document.querySelectorAll('[data-durf-section-nav], #durf-section-nav');
    if (!navs.length) return;
    var all = [];
    navs.forEach(function (nav) {
      entries.forEach(function (e) {
        if (!e.nav) return;
        var a = el('a', null, esc(e.nav));
        a.href = '#' + e.section.id;
        nav.appendChild(a);
        all.push(a);
      });
    });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (obs) {
      obs.forEach(function (o) {
        if (!o.isIntersecting) return;
        all.forEach(function (l) {
          if (l.getAttribute('href') === '#' + o.target.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    entries.forEach(function (e) { if (e.nav) io.observe(e.section); });
  }

  function sectionFiles(cfg) {
    var list = Array.isArray(cfg) ? cfg : (cfg && cfg.sections) || [];
    return list.map(function (f) { return /\.md$/.test(f) ? f : f + '.md'; });
  }

  function render() {
    var box = target();
    if (!box) return;
    fetchText(CONTENT + 'sections.json')
      .then(function (t) {
        return Promise.all(sectionFiles(JSON.parse(t)).map(function (f) {
          return fetchText(CONTENT + f).then(function (txt) { return renderSection(f, txt); });
        }));
      })
      .then(function (entries) {
        box.innerHTML = '';
        entries.forEach(function (e) { box.appendChild(e.section); });
        setupNav(entries);
        openHash();
        // Lazy images above the target change the layout while they load: jump again once they are in.
        window.addEventListener('load', function () { openHash(); }, { once: true });
        window.addEventListener('hashchange', function () { openHash(); });
        document.dispatchEvent(new CustomEvent('durf:rendered', { detail: { sections: entries.map(function (e) { return e.section.id; }) } }));
      })
      .catch(showError);

    var foot = document.getElementById('durf-footer');
    if (foot) fetchText(CONTENT + 'footer.md').then(function (t) {
      var f = toFragment(parseFrontMatter(t).body);
      decorateLinks(f);
      foot.appendChild(f);
    }).catch(function () {});
  }

  function withMarked(cb) {
    if (window.marked) return cb();
    var s = document.createElement('script');
    s.src = HERE + 'lib/marked.min.js';
    s.onload = cb;
    s.onerror = function () { showError(new Error('the Markdown library did not load')); };
    document.head.appendChild(s);
  }

  // Exposed for pages that render their own Markdown with the same conventions.
  window.DURF = window.DURF || {};
  window.DURF.site = { render: render, renderSection: function (name, text) { return renderSection(name, text).section; }, parseFrontMatter: parseFrontMatter, layouts: Object.keys(layouts) };

  function start() { withMarked(render); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
