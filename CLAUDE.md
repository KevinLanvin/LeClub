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

- `src/pages/*.astro` — one file per route (`index.astro` = `/`, `activites.astro` = `/activites`).
  A page is just a `<Layout>` composing `sections/*` in order — pages should stay thin;
  put actual content/markup in a section, not the page.
- `src/layouts/MainLayout.astro` — wraps every page with `<Header/>` + `<main><slot/></main>` + `<Footer/>`,
  global fonts, and `main.scss`. Takes a `title` prop.
- `src/sections/*.astro` — big page blocks (hero, "why us", activity descriptions, etc.).
  One file per section, named after its content (`Introduction`, `JoinUs`, `Why`,
  `PuppySchool`, `Reeducation`, `Walks`, `Education`, `Guided`, `Activities`,
  `ActivitiesIntroduction`, `MoreThanClub`). Sections are currently **hardcoded content**,
  not prop-driven — reusability across pages happens by importing the same section file
  into multiple pages, not by parameterizing one.
- `src/components/` — smaller reusable pieces:
  - `Header.astro`, `Footer.astro` — site chrome (Footer is currently a minimal placeholder bar).
  - `Courses.astro` — renders the schedule table from the `courses` content collection.
  - `LetMeGuideYou.astro`, `NoJudgement.astro` — "action card" content blocks meant to sit
    over a background-image section (see `Guided.astro` / `Education.astro`'s `.no-judgement`
    wrapper for the pattern: `display:flex; justify-content:end` over `background-image`).
    Each card is its own file even though the outer `.action-card` CSS is duplicated between
    them — follow that convention when adding a new one rather than abstracting it.
  - `Location.astro`, `SignUpDetails.astro` — small, currently minimal/WIP.
  - `components/atoms/Button.astro` — the only shared atom. Props: `inverted` (boolean) for
    outline vs filled style. **Does not support `href`** — always renders a `<button>`, even
    though a few call sites (`Why.astro`) pass `href` as if it were a link (dead prop, no-op).
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
  in `src/content/config.ts`.
- `public/images/` — photos/illustrations, referenced by absolute path (`/images/...`).
  **Not optimized** — multi-MB source photos are committed as-is; this is the existing
  convention, not an oversight to silently fix.
- `public/icons/` — a few standalone SVGs referenced via CSS `content: url(...)` (e.g.
  quote marks in `Why.astro`, `heart-orange.svg` / `check-orange.svg` bullet markers).
- `public/admin/` — Netlify CMS (Decap) config (`config.yml`) + entry point for editing the
  courses schedule at `/admin`.
- `maquettes/` — design mockups (PNG exports from Figma/similar) dropped in by the user as
  reference when asking for a new page; not part of the built site.

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
