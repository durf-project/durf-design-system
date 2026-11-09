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

Het menu staat in de lijst `SITES` bovenin `durf-nav.js`. Pas het daar aan en alle sites volgen. De actieve pagina wordt herkend aan het eerste deel van het pad (`/position-paper/`, `/dashboards/` enzovoort).

## Afspraken met de bestaande sites

De themasleutel is `durf-theme` in localStorage, dezelfde als in de position paper. De embed-afspraak (`html[data-embed]`, `postMessage` met `durf-embed-theme`) blijft werken, en de topbalk, paginakop en voet verdwijnen in embeds.

Voor een dashboard met oat's sidebar-layout trekt `durf.css` de hoogte van de topbalk af van `#app-shell`. De losse back-bar kan dan weg.

## Uitrollen

Zet deze map als repo `durf-design-system` in de organisatie en zet GitHub Pages aan. De URL's hierboven gaan dan werken. Wil je versies vastzetten, gebruik dan een tag en laad via jsDelivr: `https://cdn.jsdelivr.net/gh/durf-project/durf-design-system@v1.0.0/durf.css`.

## Licentie

EUPL-1.2, zie `LICENSE`. Oat is MIT-gelicenseerd (c) Kailash Nadh en wordt niet meegeleverd, maar via jsDelivr geladen.
