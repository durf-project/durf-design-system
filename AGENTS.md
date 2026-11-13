# Rules for working on and with the DURF design system

This repository is the shared look of every DURF site (project page, position paper, roadmap, data contracts, dashboards). Several live sites load `durf.css` and `durf-nav.js` straight from GitHub Pages, so every change here reaches them at once.

## Using it in a page

Load, in this order, in `<head>`:

```html
<link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/lib/oat.min.css">
<link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/durf.css">
<link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/durf-site.css">   <!-- only for section pages -->
<script src="https://durf-project.github.io/durf-design-system/durf-nav.js"></script>            <!-- no defer -->
<script src="https://durf-project.github.io/durf-design-system/lib/oat.min.js" defer></script>
<script src="https://durf-project.github.io/durf-design-system/durf-site.js" defer></script>      <!-- only for Markdown pages -->
```

- Colours, fonts, radii and shadows only through tokens (`var(--…)` from `durf.css`); never raw hex values in pages. Theme colours: `data-theme-n="1"` to `"6"` or `--durf-theme-N`, `-ink`, `-tint`, `-on`.
- Theme names, leads and partners come from `window.DURF.themes` or `durf-themes.json`; do not hard-code lists of theme colours or names.
- Plain HTML first: semantic elements styled by Oat (`<button>`, `<details>`, `<table>`, `role="alert"`), plus the `durf-` classes. Check light and dark, and 390 px wide.
- Do not load Oat from a CDN as well as from `lib/`. Old pages that load Oat 1.0.0 from jsDelivr keep working; move them to `lib/` when you touch them.
- Unknown figures are shown as unknown (`Unknown`, `Not yet measured`, `.is-unknown`), never guessed.
- Page text: English, sentence case headings, no em dashes, plain cooperative tone.

## Changing the design system

- Stay backward compatible: keep class names, tokens, data attributes (`data-accent`, `data-theme-n`, `data-topbar="off"`, `data-durf-theme`, `data-feedback-repo`), the localStorage key `durf-theme`, the embed contract (`?embed`, `html[data-embed]`, `postMessage` type `durf-embed-theme`) and the feedback button.
- Theme data lives twice: `durf-themes.json` and `DATA` in `durf-nav.js`. Change both together; they must stay identical.
- The site menu is `SITES` in `durf-nav.js`, and only there.
- `assets/durf-mark.svg` is the owner's original file with a C2PA manifest: never edit it. `assets/durf-logo.svg` (the logo used everywhere: the mark without ring text), `assets/durf-logo-ring.svg` (round logo, ring text as outlines, Nunito ExtraBold) and the PNG icons are generated from it.
- `assets/img/scholarly-corpus-logo.svg` is also an original with a C2PA manifest: never edit it; `tools/corpus-logo-text.py` makes the version with text from it.
- Do not edit `lib/` by hand: those are the published Oat 1.0.0 and marked 13.0.3 files with their licences.
- Before a release, test this page, `examples/site-demo/` and at least one existing site page against the local copy, light and dark, at 1440 and 390 px, and look at the screenshots.
- `README.md` is in Dutch and holds the changelog; update it with every change.
