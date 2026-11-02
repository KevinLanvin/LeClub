# Le Club Téteghem

Marketing site for a dog-training club ("club canin") in Téteghem, France. Built with
[Astro](https://astro.build) + SCSS, content partly editable via Netlify CMS (Decap).

## Stack

- **Astro 5** (`.astro` components, file-based routing under `src/pages/`)
- **SCSS** (`lang='scss'`, always `scoped` on section/component `<style>` blocks)
- **Netlify Identity + Netlify CMS** for editing the courses schedule (`public/admin/`)
- No JS framework (React/Vue/etc.) — interactivity is plain `<script>` (e.g. the mobile
  hamburger menu in `Header.astro`) or pure CSS.
- Fonts: `Jomolhari` (titles) and `Poppins` (body), loaded via Google Fonts in
  `MainLayout.astro`.

Dev commands: `npm run dev` (astro dev), `npm run build`, `npm run preview`.

## Structure

- `src/pages/*.astro` — one file per route: `index` (`/`), `activites`, `inscription`,
  `le-club`, `contact`, `merci` (form confirmation page).
  A page is just a `<Layout>` composing `sections/*` in order — pages should stay thin;
  put actual content/markup in a section, not the page.
- `src/layouts/MainLayout.astro` — wraps every page with `<Header/>` + `<main><slot/></main>` + `<Footer/>`,
  global fonts, and `main.scss`. Takes a `title` prop.
- `src/sections/*.astro` — big page blocks (hero, "why us", activity descriptions, etc.).
  One file per section, named after its content (`Introduction`, `JoinUs`, `Why`,
  `PuppySchool`, `Reeducation`, `Walks`, `Education`, `Guided`, `Activities`,
  `ActivitiesIntroduction`, `MoreThanClub`, `InscriptionIntro`, `LeClubIntro`,
  `WhatMakesTheClub`, `TeamCollage`, `PresidentWord`, `ContactCTA`, `Membership`, `ContactForm`,
  `ThankYou`). Sections are currently **hardcoded content**,
  not prop-driven — reusability across pages happens by importing the same section file
  into multiple pages, not by parameterizing one.
- `src/components/` — smaller reusable pieces:
  - `Header.astro`, `Footer.astro` — site chrome. Header: nav links, "S'inscrire" (`/inscription`)
    and "Contact" (`/contact`) buttons wrapped in `<a>`, mobile hamburger menu (the header buttons
    are hidden on mobile, so the menu repeats them as links). Footer: logo, Facebook group,
    external link, address/hours, copyright (no legal notice page yet).
  - Anchors used by the nav: `#planning` (`Courses.astro`), `#ecole-du-chiot`, `#education`,
    `#reeducation`, `#balades` (the matching sections on `/activites`). `main.scss` sets
    `scroll-padding-top` so the sticky header doesn't hide targets.
  - `GotQuestions.astro` — "Une question avant de venir ?" card, used by `ContactCTA.astro`.
  - `PracticalInfo.astro` — "Infos pratiques" card (hours, address + itinerary map, Facebook), used by
    `JoinUs.astro` and `ContactForm.astro`.
  - `Courses.astro` — renders the schedule table from the `courses` content collection.
  - `LetMeGuideYou.astro`, `NoJudgement.astro` — "action card" content blocks meant to sit
    over a background-image section (see `Guided.astro` / `Education.astro`'s `.no-judgement`
    wrapper for the pattern: `display:flex; justify-content:end` over `background-image`).
    Each card is its own file even though the outer `.action-card` CSS is duplicated between
    them — follow that convention when adding a new one rather than abstracting it.
  - `Location.astro`, `SignUpDetails.astro` — small, currently minimal/WIP.
  - `components/atoms/Button.astro` — the only shared atom. Props: `inverted` (boolean) for
    outline vs filled style, `href` (renders an `<a>` instead of a `<button>`; other attributes
    such as `target`/`rel` are forwarded). Without `href` it's a plain `<button>`.
  - `components/atoms/Card.astro` — used by `Activities.astro`'s grid.
- `src/icons/*.astro` — inline SVG icon components, each takes a `class` prop for styling
  (`star`, `location`, `location-bis`, `time`, `shop`, `arrow`, `facebook`, `gift`, `surprise`,
  `surprise-accent`, `header-before`, `header-after`).
- `src/styles/` — SCSS partials imported via `@use`, always aliased to their filename:
  `_colors.scss` (`colors.$main`, `colors.$accent`, `colors.$background`, `colors.$text`,
  `colors.$white`, plus light variants like `colors.$main-light`/`$main-lighter`,
  `colors.$accent-light`/`$accent-lighter`, `colors.$red`, `colors.$blue`, `colors.$table-row`),
  `_gutters.scss` (spacing scale `gutters.$small`…`$extra-extra-large`, and widths
  `gutters.$max-width` / `$small-max-width` / `$mobile-width`), `_borders.scss`
  (`borders.$radius`, `$radius-small`, `$standard`, `$button`), `_shadows.scss`
  (`shadows.$card`), `_fonts.scss` (`fonts.$family-title`, `$title`, `$title-mobile`,
  `$subtitle`, `$small`, `$regular`). `main.scss` is the global stylesheet imported once
  in `MainLayout.astro`.
- `src/content/courses/index.md` — the single content-collection entry driving the
  schedule table (`Courses.astro`), edited via `/admin` (Netlify CMS) in production. Schema
  in `src/content/config.ts`: a `days` list, each day with its own `date` (YYYY-MM-DD) and
  `courses`, so several days per week are possible; days are sorted by date when rendered.
  The same structure is declared in `public/admin/config.yml` (keep both in sync).
- `public/images/` — photos/illustrations, referenced by absolute path (`/images/...`).
  Photos are **WebP**, capped at 2400px on the long edge (quality 80; ~90 for small images).
  Convert new photos to `.webp` before committing — never commit multi-MB JPG/PNG originals.
  Logos are **SVG** (`logo-club.svg`, `logo-no-text.svg`, vectorized from the raster logo in
  Figma, which only exists as PNG there). Don't keep two files with identical content: reuse
  the existing file (e.g. `le-club-au-poil-1.webp` serves several sections).
- `public/icons/` — a few standalone SVGs referenced via CSS `content: url(...)` (e.g.
  quote marks in `Why.astro`, `heart-orange.svg` / `check-orange.svg` bullet markers).
- `public/admin/` — Netlify CMS (Decap) config (`config.yml`) + entry point for editing the
  courses schedule at `/admin`.
- Design source: Figma file `22g4Xg8Vu4cOQQwHCxMp3B` ("Le Club de Teteghem"), page
  "🎨 Maquettes" (node `300:2549`): desktop frames Home, Page Activités, Page Inscription,
  Page Le Club. The 375px "Home Page" / "Menu" frames there are a template from another
  project, not this site. There is no local `maquettes/` folder anymore.
- **Membership** (`Membership.astro`, on `/inscription`): 2026-2027 prices, deadlines and required
  documents come from the club's PDF fliers (HelloAsso URLs for registration and renewal are
  constants in the frontmatter). Update it each season (renewal deadline, prices, URLs).
- **`TeamCollage.astro`**: photo positions come from the Figma frame (1440 x 748), expressed as
  centre/size in px in the `layout` array and converted to % (the section keeps a 1440/748 ratio
  on desktop). Placement is passed as CSS variables so the mobile grid rules can override it;
  entries flagged `decor` (repeated crops of the same photo) are hidden on mobile.
- **`ContactCTA.astro`**: takes a `ratio` prop (image width / height). On desktop (> 1440px) the
  section keeps that ratio so the whole photo stays visible at any screen width.
- **Itinerary map** (`PracticalInfo.astro`): `public/images/itineraire.webp` is a static map of the club
  (137 Route de Furnes, 51.041009 / 2.431721) stitched from OpenStreetMap tiles, attribution
  included in the image — keep it. The "Voir l'itinéraire" link opens Google Maps directions.
- **Contact form** (`ContactForm.astro`): Netlify Forms (`data-netlify`, name `contact`) with a
  honeypot field (`bot-field`), posting to `/merci`. Only detected on a deployed Netlify build;
  notifications are configured in the Netlify UI. Consider reCAPTCHA/Turnstile if spam appears.

## SCSS variables — full reference

Every `<style lang='scss' scoped>` block that needs color, spacing, radius, shadow, or
type-scale values must `@use` the relevant partial and pull from these — **never hardcode
a hex/px/rem value that already exists here**, even if it means adding an `@use` line you
wouldn't otherwise need. When matching a mockup, sample the pixel color/size and match it
to the closest token below before considering a new one.

### `_colors.scss` (`@use '../styles/colors'`)

| Variable | Value | Usage seen in codebase |
|---|---|---|
| `colors.$main` | `#224f3c` | dark green — headings, primary brand color, badges |
| `colors.$accent` | `#f95900` | orange — highlighted words in titles, primary CTA accents |
| `colors.$background` | `#fffaf1` | cream — default `body` background |
| `colors.$text` | `#3e4945` | body text color, `borders.$standard` |
| `colors.$white` | `#fff` | card backgrounds |
| `colors.$blue` | `#c7e4f2` | course-level badge ("Rééducation") |
| `colors.$red` | `#ffe6dc` | pink/salmon section backgrounds, course-level badge ("Avancé"/"CSAU") |
| `colors.$accent-light` | `#fcf0eb` | pale orange background |
| `colors.$accent-lighter` | `#e3733f` | link color, `Button` filled bg, `borders.$button` |
| `colors.$main-light` | `#d6e8d0` | light green section backgrounds |
| `colors.$main-lighter` | `#f0ffdc` | very pale green info-card backgrounds |
| `colors.$blue-lighter` | `#e8f3ff` | pale blue section background |
| `colors.$table-row` | `#fff3dd` | striped table row background |

### `_fonts.scss` (`@use '../styles/fonts'`)

| Variable | Value | Usage |
|---|---|---|
| `fonts.$family-title` | `Jomolhari` | all `h1`/`h2`/`h3`-style headings (body text stays default `Poppins`, set globally) |
| `fonts.$small` | `14px` | fine print |
| `fonts.$regular` | `1rem` | body text |
| `fonts.$subtitle` | `1.5rem` | card/step sub-headings |
| `fonts.$title` | `3rem` | desktop section titles (pair with `line-height: fonts.$title`) |
| `fonts.$title-mobile` | `2rem` | mobile section titles — swap in inside the `1440px` media query |

### `_gutters.scss` (`@use '../styles/gutters'`)

| Variable | Value | Usage |
|---|---|---|
| `gutters.$extra-small` | `0.25rem` | tightest spacing |
| `gutters.$small` | `0.5rem` | |
| `gutters.$normal` | `1rem` | default gap/padding |
| `gutters.$large` | `1.5rem` | |
| `gutters.$extra-large` | `2rem` | card padding |
| `gutters.$extra-extra-large` | `2.5rem` | section padding |
| `gutters.$max-width` | `1440px` | outermost content width |
| `gutters.$small-max-width` | `calc($max-width - 10rem)` | most section containers (`JoinUs`, `Courses`, `Introduction`) |
| `gutters.$mobile-width` | `calc(100% - 2 * $normal)` | mobile container width |

### `_borders.scss` (`@use '../styles/borders'`)

| Variable | Value | Usage |
|---|---|---|
| `borders.$radius` | `24px` | standard card/section corner radius |
| `borders.$radius-small` | `8px` | buttons, small chips |
| `borders.$standard` | `1px solid colors.$text` | outlined card border (e.g. `JoinUs .how`) |
| `borders.$button` | `1px solid colors.$accent-lighter` | inverted-button/disclaimer border |

### `_shadows.scss` (`@use '../styles/shadows'`)

| Variable | Value | Usage |
|---|---|---|
| `shadows.$card` | `0px 11px 12.6px 0px rgba(219, 212, 200, 1)` | floating card drop shadow (e.g. `Introduction .informations`) |

`main.scss` is the only file that imports these globally (resets, `body`, `ul`, `a`,
`button`, `h2`) — everything else must `@use` the partials it needs per-component, since
Astro `<style scoped>` blocks don't inherit imports from elsewhere.

## Conventions

- Breakpoint is uniformly `@media (max-width: 1440px)` for the mobile/tablet layout — sections
  define desktop styles first, then override in one mobile block at the bottom of the same
  `<style>`.
- Section-level color/background choices map directly onto `_colors.scss` tokens — when
  matching a mockup, sample the color and match it to an existing token rather than
  introducing a new hex value.
- New page = thin `.astro` file in `src/pages/` importing `MainLayout` + existing `sections/`
  where content already matches; only add a new section/component file when nothing existing
  fits, following the naming/structure conventions above (one file per content variant, not
  prop-driven variants).
- **Styling a class passed into a child component from the parent's `<style scoped>` requires
  `:global(.the-class)`.** Astro's scoping attribute is only added to elements written directly
  in the current file — it does NOT propagate onto a child component's root element (e.g.
  `<Heart class='heart' />` renders `<svg class="heart">` with no scope attribute). A plain
  `.heart { ... }` rule compiles to `.heart[data-astro-cid-xxx]`, which silently matches
  nothing, so every size/position change appears to do nothing. Existing examples of the
  correct pattern: `Introduction.astro`'s `:global(.surprise)`, `Guided.astro`'s
  `:global(.guided-card)`, `ContactCTA.astro`'s `:global(.contact-cta-card)`. If a style change
  on a passed-in class has no visible effect, check for a missing `:global()` before anything
  else.
