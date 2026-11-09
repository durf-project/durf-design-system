Je werkt in de repo durf-design-system van de GitHub-organisatie durf-project.

1. Controleer dat de repo bestaat en main bevat (index.html, durf.css, durf-nav.js, README.md, LICENSE). Maak hem anders aan met `gh repo create durf-project/durf-design-system --public --source=. --push`.
2. Zet GitHub Pages aan op branch main, map root, en wacht tot https://durf-project.github.io/durf-design-system/ een 200 geeft. Controleer ook durf.css en durf-nav.js op die URL.
3. Rol het design system uit in de repos position-paper, dashboards, durf-gantt en durf-data-mesh-architecture. Doe per repo een aparte branch en pull request. Per pagina:
   - laad oat.min.css (https://cdn.jsdelivr.net/npm/@knadh/oat@1.0.0/oat.min.css), daarna durf.css en durf-nav.js (zonder defer, in de head) van de Pages-URL;
   - verwijder de eigen thema-, kleur- en fontvariabelen en de eigen header, back-bar en themaknop die door durf.css en durf-nav.js worden vervangen;
   - kies een accent met data-accent op html (dashboards thema 2: yellow);
   - behoud de bestaande embed-afspraak (html[data-embed], postMessage durf-embed-theme) en de localStorage-sleutel durf-theme;
   - in dashboards: vervang de back-bar door de topbalk en gebruik de hoogte-variabele --topbar-h voor #app-shell.
4. Open elke pagina in een headless browser (Playwright) in licht en donker, desktop en 390 px breed, en controleer op console-fouten en op werkende menulinks. Zet screenshots in de pull request.
5. Wijzig het menu alleen in de lijst SITES in durf-nav.js. Gebruik geen em-dashes en geen opsommingstekens in doorlopende teksten.
6. Tag de design-system repo als v1.0.0 zodra alles werkt.

Rapporteer per repo wat er veranderd is en wat nog openstaat.
