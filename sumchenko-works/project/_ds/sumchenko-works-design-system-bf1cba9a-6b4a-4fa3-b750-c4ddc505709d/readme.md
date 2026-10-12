# Sumchenko Works — Design System

**Sumchenko Works** — портфолио цифровых проектов, объединяющее разработку, системный анализ и проектирование программных решений. Здесь представлены реализованные идеи, архитектурные решения, техническая документация и артефакты проектирования. От концепции до работающего продукта — с использованием современных технологий и AI-инструментов.

One product surface: the **portfolio website** (case studies, architecture schemes, documentation artifacts, contact). The site should feel like exploring a carefully engineered digital system — a lab, not a template developer portfolio.

Tagline (from the logo): **IDEAS / SYSTEMS / PRODUCTS**.

## Sources
- `uploads/Пиксельный логотип Sumchenko Works.png` — lockup, white on black (1254²). Copied to `assets/logo/lockup-dark-source.png`.
- `uploads/Пиксельный логотип Sumchenko Works (1).png` — lockup, black on off-white. Copied to `assets/logo/lockup-light-source.png`.
- Written brief (visual direction, fonts, palette, motion) supplied in chat. No codebase, Figma, or existing site was provided — components and the UI kit are authored from the brief.
- Fonts: Google Fonts — [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans). Self-hosted woff2 (latin, latin-ext, cyrillic, cyrillic-ext) in `fonts/`.
- Icons: [Pixelarticons](https://github.com/halfmage/pixelarticons) v1.8.1 (MIT) — **substitution**, no icon set was supplied.

---

## CONTENT FUNDAMENTALS

- **Language:** Russian first. English is reserved for technical notation (stack names, component labels in diagrams: `GATEWAY`, `LEDGER`), artifact codes (`ADR-007`, `C4-L2`) and the tagline.
- **Voice:** first person singular, quiet and exact — «Отвечу в течение двух рабочих дней», «Опишите контекст, и я предложу формат работы». Address the reader as «вы» (lowercase), never «ты». No hype, no exclamation marks, no «уникальный / инновационный».
- **Sentence shape:** short declaratives that state what the thing *does*. Headlines are nouns or compact statements: «Проекты», «Документация», «Сначала модель, потом код», «Обсудим систему?».
- **Casing:** sentence case for headings and body. **UPPERCASE only in JetBrains Mono labels** (nav, meta, badges, buttons) with +0.08em tracking. Pixel display text is never uppercase.
- **Technical register:** indices and codes are part of the voice — `01 / Работы`, `P—03 · 2025`, `FIG. 03 — архитектура`, `X 024 · Y 118`, `§ 2.1`. Use the em dash in codes (`P—03`), middle dot `·` as the meta separator, slash ` / ` between index and name, arrow `→` for flow/periods (`2025.03 → 2025.11`).
- **Numbers:** zero-padded indices (`01`, `002`), ISO-ish dates `2025.03`, units with thin context (`2.4 MB`, `7 записей`).
- **Emoji:** never. Unicode used as glyphs: `→ ← · / § × [ ]`.
- **Errors & states:** plain and specific — «Проверьте адрес», «0 результатов — попробуйте другой запрос». Error text is prefixed with `!!` in mono.

Examples:
> 01 / Работы — **Избранное** — 6 проектов · 2024—2026
> «Каждый проект начинается со схемы: границы системы, данные, контракты. Документация — часть продукта, а не приложение к нему.»
> Button labels: СМОТРЕТЬ ПРОЕКТЫ →, РАЗБОР ПРОЕКТА →, СКАЧАТЬ, [ ПОДРОБНЕЕ ]

---

## VISUAL FOUNDATIONS

**Direction.** Technical minimalism × pixel graphics × Swiss grid × engineering drawings. Expression comes from type, composition, white space, geometry and line work — not decoration.

**Color.** Strictly monochrome. Light theme is primary: paper `#F7F7F5`, white surfaces `#FFFFFF`, ink `#111111`, ash `#E8E8E5` (secondary surfaces), stone `#A3A3A0` (secondary text), rule `#D1D1CD` (dividers, grids). Dark: void `#080808`, carbon `#171717`, bone `#F2F2F0`, graphite `#777774`. Additions (flagged): slate `#62625F` (AA-safe small meta text on paper — stone is only 2.4:1), soot `#232322` and smoke `#2E2E2D` (dark secondary surface / hairlines — graphite is too heavy for grids). Always style with semantic tokens (`--bg --surface --surface-2 --fg --fg-2 --fg-3 --line --line-strong --inverse-bg --inverse-fg`); `[data-theme="dark"]` swaps them. No hue anywhere, including focus and error states.

**Type.** Three families, strict roles:
- *Pixelify Sans* (`--font-pixel`) — display headlines, section titles, artifact codes. Regular 400, lh 0.95, −0.01em. One pixel element per view region; never for body or UI.
- *JetBrains Mono* (`--font-mono`) — nav, buttons, labels, metadata, spec values, diagram labels. 11–13px; caps + 0.08em for labels.
- *IBM Plex Sans* (`--font-sans`) — body 16/1.6, lead 18–22, h1–h3 in Medium 500.
Display and heading sizes are fluid `clamp()`.

**Grid & spacing.** 12 columns, gutter 12→24, margin 20→64, max 1440. 4px base scale (`--space-1…10`), section rhythm `--space-section` 80→176. Editorial asymmetry: index/meta in cols 1–2, content offset into cols 3–12; hero text 7 cols vs art 5 cols. Breakpoints 1000 and 640 (kit), 760 (nav).

**Backgrounds.** Flat paper. Texture comes only from functional patterns: a 24px **dot grid** (`.sw-dotgrid`), a **line grid** for drawings (`.sw-linegrid`), and the interactive **PixelField**. No photos, gradients, noise, glass or illustrations. Imagery = diagrams (IsoDiagram) and the pixel mark.

**Lines & borders.** 1px hairlines (`--line`) everywhere; strong 1px ink border on hover/focus; dashed for drafts, planned items, error inputs and links in diagrams. Crop-mark **corner ticks** (9px L-shapes) frame interactive cards on hover. Coordinate markers (`+ X 024 · Y 118`) annotate figure corners.

**Corners.** 0 radius. 2px max if a context demands it. The only round shapes: radio dot.

**Shadows / elevation.** No blurred shadows. Layering via border, inversion (ink panel), or a hard 4px offset `--shadow-pixel` for dialogs; 2px `--shadow-pixel-sm` on checkbox hover.

**Cards.** White surface, 1px `--line`, square, 24px padding. Interactive: border → ink + corner ticks slide in. Variants: flat, sunken (ash, no border), inverse (one per section max).

**States.**
- Hover: inversion (primary button ink→outline, secondary outline→ink), border to ink, ghost buttons gain `[ ]` brackets, arrow icons nudge 3px right, rows get a white surface.
- Press: translate(1px,1px) on buttons; pressed/selected = inverted.
- Focus-visible: 2px solid `--focus` outline, 2px offset — never removed.
- Disabled: 35–40% opacity.
- Transparency used only for overlays (`--overlay`), disabled states and toast secondary text. No blur.

**Motion.** Short, precise, never theatrical. Easing `--ease-out` cubic-bezier(.2,.7,.2,1) for UI; `--ease-in-out` for draws; `--ease-pixel` steps(6) for pixel things (switch thumb, theme wipe uses steps(8)). Durations 80 / 140 / 220 / 420 / 900 (draw) ms, 24ms stagger. Signature moves: logo assembles from scattered pixels (~900ms, left→right sweep); diagrams stroke-draw back-to-front then faces fill; sections fade up 10px on scroll; PixelField pixels swell near the cursor in quantized steps; theme toggle = stepped top-down wipe (View Transitions) with 360ms colour cross-fade fallback. No parallax, no loops except the 2-step status blink. `prefers-reduced-motion` zeroes all duration tokens and disables reveals.

**Layout rules.** Sticky 56px header with bottom hairline; everything else scrolls. Toasts fixed bottom-right. Generous empty space is intentional — don't fill it.

---

## ICONOGRAPHY

- **Set:** Pixelarticons (24×24 grid, filled, square pixels) — chosen to match the pixel mark. **Substitution**: no icons were supplied. 55 SVGs copied to `assets/icons/`; the same path data is embedded in the `Icon` component (`<Icon name="arrow-right" />`, `currentColor`, `shape-rendering: crispEdges`).
- Sizes 16 (inline/UI), 24 (lists, docs), 32 max. Never mix with outline icon sets.
- Icons are functional only (direction, action, file type). No decorative icon grids, no emoji.
- Unicode glyphs act as micro-icons in text: `→ ← · / § × [ ]`, plus the CSS crosshair in `Coord`.
- Logo assets in `assets/logo/`: `lockup-ink.png` / `lockup-paper.png` (transparent, stacked lockup), `mark-ink.png` / `mark-paper.png` (SW orbit mark), `wordmark-ink.png` / `wordmark-paper.png`, `tagline-ink.png`, original sources, and `mark-grid.txt` (50×35 pixel sampling used by `PixelLogo`). Transparent versions were derived programmatically from the supplied PNGs (luminance → alpha); nothing was redrawn. There is no vector logo.

---

## INDEX

```
styles.css                 global entry — @imports only
tokens/                    fonts.css · colors.css · typography.css · spacing.css · motion.css · base.css
components/sw-components.css   all component classes (prefix sw-)
components/
  actions/      Button, IconButton
  forms/        Input (+Field), Select, Checkbox (+Radio), Switch
  display/      Card, Badge (+Tag), SpecList
  navigation/   NavBar, Tabs
  feedback/     Dialog, Toast, Tooltip
  brand/        Icon, PixelLogo, ThemeToggle, SectionHead (+Coord)
  graphics/     IsoDiagram, PixelField
guidelines/                foundation specimen cards (Colors, Type, Spacing, Motion, Brand)
ui_kits/portfolio/         interactive website recreation — see its README.md
assets/logo/  assets/icons/
fonts/                     self-hosted woff2
thumbnail.html  SKILL.md
_dev/                      local preview shim (not part of the system)
```

### Components
- **Button** — primary / secondary / ghost; sm·md·lg; icons.
- **IconButton** — outline / solid / bare; pressed state.
- **Input** (and **Field**) — label, hint, monochrome error, prefix icon, multiline.
- **Select** — native select, mono, pixel chevron.
- **Checkbox**, **Radio** — square box / round dot.
- **Switch** — square thumb, stepped motion.
- **Card** — surface / flat / sunken / inverse; crop-mark ticks.
- **Badge**, **Tag** — status markers; topic / filter chips.
- **SpecList** — technical key/value sheet.
- **NavBar** — sticky header, numbered links, mobile sheet.
- **Tabs** — underline / segmented, numbered, keyboard.
- **Dialog**, **Toast**, **Tooltip**.
- **Icon** — Pixelarticons subset.
- **PixelLogo** — mark as assembling, cursor-reactive pixels.
- **ThemeToggle** — light/dark with stepped wipe.
- **SectionHead**, **Coord** — section opener, coordinate marker.
- **IsoDiagram** — isometric architecture scheme with line-draw reveal.
- **PixelField** — interactive dot-matrix field.

### Intentional additions
No source defined a component inventory, so the standard set above was authored. Brand-specific additions beyond the standard set: Icon (wrapper for the glyph set), PixelLogo, ThemeToggle, SectionHead/Coord, SpecList, IsoDiagram, PixelField, NavBar — each implements a requirement in the brief (pixel logo assembly, theme switching, coordinate markers, technical captions, isometric schemes, pixel reaction to the user, compact navigation).

### UI kits
- `ui_kits/portfolio/` — Home, Projects, Case study, Contact.
