# DURF design system

Een dunne laag bovenop [oat](https://oat.ink) (`@knadh/oat@1.0.0`, MIT), gebaseerd op de huidige look van de position paper en de dashboards.

## Bestanden

durf.css: tokens, oat opnieuw ingekleurd, en de componenten (topbalk, paginakop, tag, kerncijfer, callout, themablok, voet).
durf-nav.js: topbalk met sitemenu, themakeuze (systeem, licht, donker) en embed-gedrag.
index.html: de documentatiepagina met alle onderdelen.

## Gebruik in een repo

Zet dit in de head van elke pagina. Laad het script zonder defer, dan wordt het thema gezet voordat er iets getekend is.

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@knadh/oat@1.0.0/oat.min.css">
    <link rel="stylesheet" href="https://durf-project.github.io/durf-design-system/durf.css">
    <script src="https://durf-project.github.io/durf-design-system/durf-nav.js"></script>

Optioneel kies je een accent per site met `<html data-accent="yellow">` (blue, orange, purple, green, yellow). De topbalk komt vanzelf vooraan in de body, of op de plek van `<div id="durf-topbar"></div>`.

## Het menu aanpassen

Het menu staat in de lijst `SITES` bovenin `durf-nav.js`. Pas het daar aan en alle sites volgen. De actieve pagina wordt herkend aan het eerste deel van het pad (`/position-paper/`, `/dashboards/` enzovoort). Het eerste item, Home, is de projectpagina (`/project-page/`). Het DURF-logo links in de balk gaat naar https://durf-project.github.io/, dat via de repo `durf-project.github.io` doorverwijst naar diezelfde projectpagina. Logo en favicon komen uit `project-page/assets/`.

## Feedbackknop

`durf-nav.js` zet op elke pagina rechtsonder een zwevende knop Feedback. Die opent een uitnodigende dialoog: alle feedback helpt, we lezen het als betrokkenheid en niet als kritiek, en we bouwen DURF samen. De dialoog noemt wie de feedback leest en beantwoordt, en het adres durf@surf.nl. Versturen kan op twee manieren. De ene opent een vooraf ingevuld issue in de repo waar de pagina staat, met het sjabloon `.github/ISSUE_TEMPLATE/feedback.yml` (velden `page`, `feedback`, `contact`). De andere opent een e-mail aan durf@surf.nl.

Wie antwoordt staat in `THEME_LEADS` (per thema) en `SITE_CONTACTS` (per site) in `durf-nav.js`. Een dashboard geeft zijn thema door met `data-durf-theme="2"` op `<html>` of op de script-tag. De repo volgt uit het eerste deel van het pad; onbekende adressen gaan naar `project-page`, en `data-feedback-repo` op `<html>` overschrijft dat. In embeds (`?embed`) verschijnt de knop niet.

De knop zit in een shadow root, zodat hij niet botst met oat, marimo of de pagina zelf, maar leest wel de DURF-tokens. Daardoor werkt hij ook op pagina's zonder `durf.css`. Voor zulke pagina's, zoals de marimo-dashboards, laad je alleen het script zonder topbalk:

    <script src="https://durf-project.github.io/durf-design-system/durf-nav.js" data-topbar="off" data-durf-theme="4"></script>

## Afspraken met de bestaande sites

De themasleutel is `durf-theme` in localStorage, dezelfde als in de position paper. De embed-afspraak (`html[data-embed]`, `postMessage` met `durf-embed-theme`) blijft werken, en de topbalk, paginakop en voet verdwijnen in embeds.

Voor een dashboard met oat's sidebar-layout trekt `durf.css` de hoogte van de topbalk af van `#app-shell`. De losse back-bar kan dan weg.

## Uitrollen

Zet deze map als repo `durf-design-system` in de organisatie en zet GitHub Pages aan. De URL's hierboven gaan dan werken. Wil je versies vastzetten, gebruik dan een tag en laad via jsDelivr: `https://cdn.jsdelivr.net/gh/durf-project/durf-design-system@v1.0.0/durf.css`.

## Licentie

EUPL-1.2, zie `LICENSE`. Oat is MIT-gelicenseerd (c) Kailash Nadh en wordt niet meegeleverd, maar via jsDelivr geladen.
