# DURF design system

Een dunne laag bovenop [oat](https://oat.ink) (`@knadh/oat@1.0.0`, MIT) voor alle DURF-sites: tokens, het logo, de zes themakleuren, de topbalk met sitemenu, de feedbackknop en componenten voor pagina's die uit Markdown worden opgebouwd. Versie 1.1. De documentatie met voorbeelden staat op https://durf-project.github.io/durf-design-system/ en een complete voorbeeldsite op https://durf-project.github.io/durf-design-system/examples/site-demo/.

## Bestanden

durf.css: tokens (ook de themakleuren), oat opnieuw ingekleurd, en de basiscomponenten (topbalk, paginakop, tag, kerncijfer, callout, themablok, themastip, kleurstrook, voet).
durf-nav.js: topbalk met sitemenu, themakeuze (systeem, licht, donker), embed-gedrag, feedbackknop en `window.DURF`.
durf-site.css en durf-site.js: secties voor landingspagina's uit Markdown (hero, kerncijfers, statement, kaarten, features, tijdlijn, media, band, lopende tekst, accordeon), sectienavigatie en sitevoet.
durf-themes.json: de zes thema's met nummer, naam, korte naam, kleur, lead en partners.
lib/: oat 1.0.0 (`oat.min.css`, `oat.min.js`, licentie `oat.LICENSE`) en marked 13.0.3 (`marked.min.js`, licentie `marked.LICENSE.md`), meegeleverd zodat niets van een CDN hoeft te komen.
assets/: het logo en de iconen (zie Logo).
index.html: de documentatiepagina. examples/site-demo/: de voorbeeldsite met alle layouts.

## Gebruik in een repo

Zet dit in de head van elke pagina, in deze volgorde. Laad `durf-nav.js` zonder defer, dan wordt het thema gezet voordat er iets getekend is.

    <link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/lib/oat.min.css">
    <link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/durf.css">
    <script src="https://durf-project.github.io/durf-design-system/durf-nav.js"></script>
    <script src="https://durf-project.github.io/durf-design-system/lib/oat.min.js" defer></script>

Bouw je de pagina op uit Markdown, voeg dan toe:

    <link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/durf-site.css">
    <script src="https://durf-project.github.io/durf-design-system/durf-site.js" defer></script>

Pagina's die oat nog laden van `https://cdn.jsdelivr.net/npm/@knadh/oat@1.0.0/oat.min.css` blijven werken; het is hetzelfde bestand. Bij een volgende wijziging stap je over op de regels hierboven. `oat.min.js` is nieuw en optioneel: het is alleen nodig voor oat's tabs, dropdowns, toasts en tooltips.

Optioneel kies je een accent per site met `<html data-accent="theme-2">` (`theme-1` tot en met `theme-6`) of met een kleurnaam (`orange`, `yellow`, `blue`, `green`, `purple`, `red`). De topbalk komt vanzelf vooraan in de body, of op de plek van `<div id="durf-topbar"></div>`.

## Logo

Alles is vector, er zitten geen rasterbeelden in de SVG's.

    https://durf-project.github.io/durf-design-system/assets/durf-logo.svg         rond logo met ringtekst
    https://durf-project.github.io/durf-design-system/assets/durf-mark.svg         beeldmerk, origineel bestand van de eigenaar (met C2PA-herkomstgegevens, niet bewerken)
    https://durf-project.github.io/durf-design-system/assets/favicon.svg           beeldmerk, vierkant en klein, ook in de topbalk
    https://durf-project.github.io/durf-design-system/assets/favicon-32.png
    https://durf-project.github.io/durf-design-system/assets/apple-touch-icon.png  180 × 180
    https://durf-project.github.io/durf-design-system/assets/durf-mark-512.png
    https://durf-project.github.io/durf-design-system/assets/durf-og.png           1200 × 630, voor og:image

In `durf-logo.svg` staat de ringtekst als lijnen (Nunito ExtraBold, SIL Open Font License), zodat het logo er ook als `<img>` overal hetzelfde uitziet. Heeft een pagina geen eigen favicon, dan zet `durf-nav.js` `favicon.svg`.

## Themakleuren

De bron is de DURF-roadmap. Per thema N (1 tot en met 6) zijn er vier tokens:

    --durf-theme-N        de merkkleur, in licht en donker gelijk
    --durf-theme-N-ink    tekstkleur in de themakleur, leesbaar op de paginakleur (licht en donker)
    --durf-theme-N-tint   zachte achtergrond in de themakleur
    --durf-theme-N-on     tekstkleur op een vlak in de volle themakleur

| Nr | Thema | Kort | Kleur | Lead |
|---|---|---|---|---|
| 1 | Governance of the Federation and Netherlands Research Portal | Governance | #EE7628 | Simone Kortekaas (KB) en Maurice Vanderfeesten (SURF) |
| 2 | Metadata Quality Improvement | Metadata | #F6DA44 | Rutger de Jong (Leiden University) |
| 3 | Full Text Capture | Fulltext | #177ABF | Pascal Braak (University of Amsterdam) |
| 4 | KB National Library e-Depot Archiving | Archive | #17A95D | Ingeborg Verheul (KB National Library) |
| 5 | Metadata Distribution & Discovery Optimization | Discovery | #5C1B61 | Rutger de Jong (Leiden University) |
| 6 | NL Research Portal Update | Portal | #83201B | vacant |

Zet `data-theme-n="N"` op een element, dan krijgt het `--theme-color`, `--theme-ink`, `--theme-tint` en `--theme-on`, en kleuren `.durf-theme-block`, `.durf-theme-dot`, `.durf-theme-chip`, `.durf-tag`, kaarten, kerncijfers en tijdlijnpillen mee.

## JavaScript en JSON

`durf-nav.js` zet `window.DURF`, synchroon, dus ook bruikbaar in een script direct erna:

    DURF.version      "1.1.0"
    DURF.project      { name, short, start: "2026-06-01", end: "2030-05-31", lead, manager (= lead, voor 1.1-pagina's), techLead }
    DURF.themes       [{ n, name, short, colour, token, lead: { name, institution, contact }, partners: [{ name, role }] }, ...]
    DURF.theme(n)     één thema, of null
    DURF.assets       { logo, mark, favicon, og }   volledige URL's
    DURF.site         (alleen met durf-site.js) { render, renderSection, parseFrontMatter, layouts }

Dezelfde gegevens staan in `durf-themes.json` voor scripts en bouwstappen. Gebruik ze in plaats van eigen kleurlijsten; kleur in CSS met de tokens of `data-theme-n`, niet met `colour`.

## Markdown-sites

`durf-site.js` bouwt een pagina op uit Markdown-bestanden, naar het voorbeeld van de PID2Portal-pagina van SURF. Het leest `content/sections.json` en de bestanden in `content/`, relatief aan de pagina, en zet de secties in `<main id="durf-sections">` (of `#sections`). `sections.json` is een lijst bestandsnamen (`["00-hero.md", "01-stats.md"]`) of `{ "sections": ["about", "themes"] }`. Een `content/footer.md` komt in `#durf-footer`. Elk element met `data-durf-section-nav` krijgt links naar de secties met een `nav:`-label. Opties op de script-tag: `data-content="content/"` en `data-target="#durf-sections"`. Na het tekenen volgt het event `durf:rendered`. Marked wordt zo nodig vanzelf geladen uit `lib/`. De opbouw van de pagina staat in `examples/site-demo/index.html`; kopieer die als begin.

Elk bestand begint met front matter:

    ---
    layout: cards        # hero | stats | statement | cards | features | timeline | media | band | prose | accordion
    id: themes           # anker (anders de bestandsnaam zonder nummer)
    nav: Themes          # label in de sectienavigatie (weglaten = niet tonen)
    eyebrow: Six themes  # klein label boven de kop
    theme: 3             # optioneel: de sectie in themakleur 3
    background: muted    # optioneel: muted of tint
    columns: 2           # alleen cards: vast aantal kolommen
    theme-dots: true     # koppen die met "1." tot "6." beginnen krijgen een themastip
    ---

De afspraken per layout:

hero: `# Titel` met `*nadruk*` in de accentkleur, een alinea en een lijst met links (knoppen). Zonder `image:` staat het ronde logo ernaast; `image`, `image2`, `image-alt` en `image2-alt` geven schermafbeeldingen in een kader met gekleurde blokken; `visual: none` laat de rechterkant weg.
stats: elk item `- **waarde** label`. De waarden `Unknown`, `Not yet measured`, `n/a`, `TBD`, `?` en `-` worden als onbekend getoond: gedempt, met een stippellijn en het label "Not yet measured". Verzin geen cijfers; schrijf Unknown. Met `{theme-3}` vooraan kies je de kleur van een item, anders lopen de zes themakleuren rond.
statement: één grote zin op een vlak in de themakleur (standaard thema 5, paars), met het eyebrow als label tussen twee lijnen.
cards: `## Kop` en intro, daarna elk `### Kop` een kaart. Direct onder de kop kan een blok regels staan met `theme: 2`, `tags: Draft, Live`, `number: 1`, `date: June 2026`. Een losse afbeelding wordt de kaartafbeelding. `theme` geeft een gekleurde bovenrand en het label "Theme 2 · Metadata".
features: elk `###` een rij met afbeelding en tekst, om en om; zonder afbeelding een tekstrij.
timeline: elk item `- **Jun 2026** wat er gebeurde`; de datums worden gekleurde pillen op een lijn (op mobiel onder elkaar).
media: tekst naast een video (een alinea met alleen een video.edu.nl- of YouTube-link) of een losse afbeelding.
band: een oproep in een gekleurd vlak (accent van de site, of `theme:`), met knoppen.
prose: lopende tekst op leesbreedte, met een citaat als accent.
accordion: elk `###` (of, als er geen `###` is, elk `##`) wordt een ingeklapt item; een kop daarboven is de sectietitel. `open: first` of `open: all` klapt open. Onder een itemkop kan `date:` en `theme:` staan. Een link naar `#anker-van-item` klapt het item open.

Overal geldt: een lijst waarvan de laatste items alleen een link zijn, wordt een rij knoppen (de eerste is de hoofdknop). Externe links openen in een nieuw tabblad.

De klassen werken ook met de hand in HTML: `.durf-section` met `.durf-layout-<layout>`, `.durf-section-head`, `.durf-eyebrow`, `.durf-actions`, `.durf-hero`, `.durf-stats`/`.durf-stat` (met `.is-unknown`), `.durf-statement`, `.durf-grid` met `.durf-card.durf-card--site`, `.durf-feature`, `.durf-timeline`, `.durf-media`, `.durf-band`, `.durf-accordion`, `.durf-subnav`, `.durf-footer--site` en `.durf-colour-strip`.

## Het menu aanpassen

Het menu staat in de lijst `SITES` bovenin `durf-nav.js`. Pas het daar aan en alle sites volgen. De actieve pagina wordt herkend aan het eerste deel van het pad (`/position-paper/`, `/dashboards/` enzovoort). Het eerste item, Home, is de projectpagina (`/project-page/`). Het DURF-logo links in de balk gaat naar https://durf-project.github.io/, dat via de repo `durf-project.github.io` doorverwijst naar diezelfde projectpagina. Het logo in de balk komt sinds 1.1 uit `durf-design-system/assets/`.

## Feedbackknop

`durf-nav.js` zet op elke pagina rechtsonder een zwevende knop Feedback. Die opent een uitnodigende dialoog: alle feedback helpt, we lezen het als betrokkenheid en niet als kritiek, en we bouwen DURF samen. De dialoog noemt wie de feedback leest en beantwoordt, en het adres durf@surf.nl. Versturen kan op twee manieren. De ene opent een vooraf ingevuld issue in de repo waar de pagina staat, met het sjabloon `.github/ISSUE_TEMPLATE/feedback.yml` (velden `page`, `feedback`, `contact`). De andere opent een e-mail aan durf@surf.nl.

Wie antwoordt volgt per thema uit de leads in de themagegevens (`lead.contact`, bijvoorbeeld "Rutger de Jong, theme lead at Leiden University") en per site uit `SITE_CONTACTS` in `durf-nav.js`. Een dashboard geeft zijn thema door met `data-durf-theme="2"` op `<html>` of op de script-tag. De repo volgt uit het eerste deel van het pad; onbekende adressen gaan naar `project-page`, en `data-feedback-repo` op `<html>` overschrijft dat. In embeds (`?embed`) verschijnt de knop niet.

De knop zit in een shadow root, zodat hij niet botst met oat, marimo of de pagina zelf, maar leest wel de DURF-tokens. Daardoor werkt hij ook op pagina's zonder `durf.css`. Voor zulke pagina's, zoals de marimo-dashboards, laad je alleen het script zonder topbalk:

    <script src="https://durf-project.github.io/durf-design-system/durf-nav.js" data-topbar="off" data-durf-theme="4"></script>

## Afspraken met de bestaande sites

De themasleutel is `durf-theme` in localStorage, dezelfde als in de position paper. De embed-afspraak (`html[data-embed]`, `postMessage` met `durf-embed-theme`) blijft werken, en de topbalk, paginakop, sectienavigatie en voet verdwijnen in embeds.

Voor een dashboard met oat's sidebar-layout trekt `durf.css` de hoogte van de topbalk af van `#app-shell`. De losse back-bar kan dan weg.

## Uitrollen

De repo staat op GitHub Pages (branch main, map root), dus na een merge zijn de URL's hierboven meteen bijgewerkt. Wil je versies vastzetten, gebruik dan een tag en laad via jsDelivr: `https://cdn.jsdelivr.net/gh/durf-project/durf-design-system@v1.1.0/durf.css`.

## Wijzigingen

### 1.1.3

Nieuw icoon `assets/icons/puzzle-piece.svg`: een puzzelstuk zoals in het DURF-logo, en de klasse `.durf-puzzle` die het in de themakleur toont, met het themanummer erin (`<span class="durf-puzzle" data-theme-n="3">3</span>`). De roadmap gebruikt dezelfde vorm. De standaard tagline is nu "Making the Dutch scholarly corpus global, open and resilient" (alt-tekst van het logo in de hero, de voorbeeldsite en `durf-og.png`). De ringtekst in het logo zelf is niet veranderd.

### Waarom geen fonts-, components- of iconenmap zoals in het SURF design system

Het DURF design system is een dunne laag: lettertypes (Nunito en Source Sans 3) komen van Google Fonts via `durf.css`, de componenten zijn klassen in `durf.css` en `durf-site.css` bovenop Oat (`lib/`), en er is geen React-bundel. Het neemt geen onderdelen van het SURF design system over. De SURF-pictogrammen staan er niet in, omdat dat SURF-merkmateriaal is zonder vermelde licentie; eigen iconen staan in `assets/icons/`.

### 1.1.2

Nieuwe leads: thema 1 Simone Kortekaas (KB) en Maurice Vanderfeesten (SURF), thema 4 Ingeborg Verheul (KB), thema 6 vacant (`lead.vacant: true`; de feedbackdialoog noemt dan het projectteam). Projectlead is Lois van Zomeren (VU Amsterdam): `DURF.project.lead`, en `manager` wijst naar dezelfde persoon.

### 1.1.1

Het ronde logo krijgt in donker een lichtere ringtekst (`assets/durf-logo-dark.svg`, `durf.css` wisselt hem vanzelf voor elke `<img>` met `durf-logo.svg`). `durf-site.js` opent een accordeon-item ook als de `#hash` later verandert, springt na het laden van afbeeldingen nog eens naar het doel, en geeft koppen nooit een id die al op de pagina bestaat.

### 1.1

Oat 1.0.0 en marked 13.0.3 zitten nu in `lib/`; de nieuwe head-regels laden alles van de site van het design system, zonder jsDelivr. De oude jsDelivr-regel blijft werken.
Nieuw vector-logo: het beeldmerk van de eigenaar (`assets/durf-mark.svg`, ongewijzigd) en een rond logo met de ringtekst als lijnen (`assets/durf-logo.svg`), plus favicon (SVG en PNG 32, 180 en 512) en een deelafbeelding. De topbalk gebruikt het nieuwe beeldmerk; pagina's zonder favicon krijgen er een.
Themakleuren als tokens: `--durf-theme-1` tot en met `--durf-theme-6` met `-ink`, `-tint` en `-on`, en `--durf-red`. `data-theme-n` volgt nu de roadmap (1 oranje, 2 geel, 3 blauw, 4 groen, 5 paars, 6 rood); in 1.0 stonden de nummers verkeerd. Accenten `red` en `theme-1` tot en met `theme-6` erbij, en `--accent-ink` en `--accent-tint`.
`durf-themes.json` en `window.DURF` met de themagegevens, leads (met namen uit het projectvoorstel) en partners. De feedbackdialoog noemt de lead bij naam.
`durf-site.css` en `durf-site.js`: secties uit Markdown met tien layouts, sectienavigatie, sitevoet en de voorbeeldsite `examples/site-demo/`.
Kleinere toevoegingen in `durf.css`: `.durf-kpi.is-unknown`, `.durf-theme-dot`, `.durf-theme-chip`, `.durf-tag[data-theme-n]`, `.durf-colour-strip`, en `a.button` houdt de knopkleur.

### 1.0

Tokens over oat, topbalk met sitemenu, themaknop, embed-gedrag, documentatiepagina en de feedbackknop.

## Licentie

EUPL-1.2, zie `LICENSE`. Oat is MIT-gelicenseerd (c) Kailash Nadh, marked is MIT-gelicenseerd (c) Christopher Jeffrey en MarkedJS; beide staan met hun licentie in `lib/`. De ringtekst van het logo is gezet in Nunito (SIL Open Font License 1.1). `durf-site.js` en `durf-site.css` zijn bewerkt naar de PID2Portal-pagina van SURF (EUPL-1.2).
