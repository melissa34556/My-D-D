# My D&D

An independent, personal-use D&D character manager and rules companion. The project is a web app, designed to work locally without accounts or multiplayer.

## Run locally

```bash
npm install
npm run dev
```

Build with `npm run build`.

## Product scope

### In scope
- Character library: create, edit, duplicate, delete, import and export characters.
- Character builder with guided choices and validation.
- Character sheet with derived statistics and editable details.
- Level advancement, multiclassing and class feature/resource tracking.
- Ability scores, skills, saving throws, proficiencies and passive scores.
- Combat: HP, temporary HP, hit dice, death saves, initiative, conditions, rests and actions.
- Spells: spellbook, preparation, spell slots, concentration and casting details.
- Equipment, inventory, attunement, currency, weight and derived modifiers.
- Dice roller with advantage/disadvantage, formulas and roll history.
- Personal encounter builder and combat tracker.
- Rules/content framework and compendium search, initially with empty content collections.
- Homebrew authoring framework, initially with no bundled custom content.
- Local-first storage, backup and portable import/export.

### Explicitly out of scope for now
- User accounts and D&D Beyond profile integration.
- Campaign collaboration, inviting players, shared logs or shared inventories.
- Multiplayer and real-time synchronization.
- Virtual tabletop, maps, tokens and shared play surfaces.
- Bundled official content databases. Content will be populated later from sources we are permitted to use.

## Character imports

Planned import paths:
1. D&D Beyond's own exported, fillable character-sheet PDF.
2. A documented My D&D JSON format for backup and transfer.
3. Optional import from a D&D Beyond public character URL only if it can be implemented reliably and in a way compatible with the site's terms and technical restrictions. D&D Beyond does not provide a supported public character API, so this must not be a dependency.

Import should show a review/confirmation screen, preserve the original file, map supported fields, and report anything that could not be imported. A PDF may not contain every underlying choice or full source detail, so the importer must not silently invent missing data.

## Technical direction

- React + Vite.
- Separate ruleset adapters for D&D 5e (2014) and D&D 5e (2024).
- A canonical internal character data model, independent of any external character builder.
- Content is data-driven and kept separate from rules/character logic.
- Local persistence first; no backend required for the initial personal-use version.

## Aurora research

Aurora Builder is useful as a reference for guided character creation, level-up and multiclass flows, structured content elements, and extensible content repositories. Its original Windows application is discontinued; the public Aurora GitHub organization exposes archived content/repository resources, not a maintained source-code base for directly embedding the original application. We may adapt ideas and compatible data concepts, but will not copy code or content without confirming its licence.

Independent fan project; not affiliated with Wizards of the Coast, D&D Beyond, or Aurora Builder. Use only content you have rights to use.
