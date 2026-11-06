# My D&D

Een persoonlijke webapp voor character management, uitsluitend gericht op **D&D 5e (2014)**. De 2024-regels maken geen deel uit van dit project.

## Run locally
```bash
npm install
npm run dev
```
Build: `npm run build`.

## Scope
- Meerdere characters beheren, aanmaken, verwijderen en exporteren.
- Character play met ability scores, skills (inclusief vastgezette skills), combat, hit points, death saves, conditions, rests, spells, inventory, currency, features en notes.
- Afzonderlijk spellbook met zoekfunctie en filters voor level, class, school, bronboek en character. Character-spells worden automatisch opgenomen in het overzicht.
- Printbare character sheet-weergave.
- Eerste algemene Library-navigatie voor toekomstige contentcategorieën.
- Dice roller en lokale roll history.
- Lokale opslag zonder account of server.
- Import review voordat een character wordt opgeslagen.
- Opslagmodel voorbereid op een latere synchronisatielaag.

Niet in scope: 2024-regels, multiplayer, campagne-samenwerking, gedeelde logs/inventaris en VTT.

## Imports
- My D&D JSON backup/import.
- Invulbare PDF-formuliervelden uitlezen met pdf-lib; bedoeld als eerste importpad voor de officiële D&D Beyond 2014 character-sheet PDF.
- Aurora Builder `.dnd5e`-bestanden worden als XML ingelezen. De importer haalt onder meer naam, species, multiclass-verdeling, subclass, level, ability scores, skill- en saving throw-proficiencies, equipment, currency, attacks, spells/spell slots, features, talen en backstory op. Afgeleide/ontbrekende velden zoals HP worden niet verzonnen; de import toont waarschuwingen. Portraitbestanden die alleen als lokaal pad in Aurora staan, worden niet meegenomen. De importer is getest op de structuur van een aangeleverd Aurora 1.0.3-bestand, maar moet nog in de browser/app zelf worden gevalideerd.
- D&D Beyond URL-import is nog niet geactiveerd. Een volledige URL-import vraagt een server-side connector/proxy; de browser heeft geen betrouwbare cross-origin toegang tot D&D Beyond. De onofficiële route is niet gegarandeerd.

Bronvelden die uit PDF/Aurora-bestanden worden gelezen, blijven als importmetadata bij het character bewaard om de mapping later te verbeteren. Controleer de import altijd.

## Architecture
- React + Vite.
- Canonical character model in `src/lib/character.js`.
- Import adapters in `src/lib/importers.js`.
- Local-first opslag; online opslag en synchronisatie worden later als aparte adapter toegevoegd.
- Ruleset vast op `5e-2014`.

## Later
1. D&D Beyond import uitbreiden met een betrouwbare server-side importflow.
2. Aurora-import valideren en volledig mappen met een echt .dnd5e-bestand.
3. Character creator en level-up workflow.
4. Synchronisatie tussen apparaten, accounts, conflictbehandeling en offline queue.
5. Meer complete 2014-regelsengine en content. Content blijft voorlopig leeg en wordt alleen toegevoegd als de licentie/rechten dat toestaan.

Independent fan project; not affiliated with Wizards of the Coast, D&D Beyond or Aurora Builder.
