# CLAUDE.md

## Project
Shopify store for Khalis Ghiza — a Pakistani premium dry fruits and nut blends brand. Theme is Dawn 16.0.0. Currency is PKR. Customers are mostly in Pakistan, mostly on mobile, many pay cash on delivery.

## Hard rules for all work in this repo

- **NEVER modify existing Dawn files** (`sections/`, `snippets/`, `assets/` that shipped with Dawn). Always create NEW files. This keeps the theme update-safe so a future Dawn upgrade doesn't clobber custom work.
- Every new section goes in `sections/` as its own `.liquid` file with a unique name prefixed `kg-` (e.g. `sections/kg-trust-badges.liquid`). Same prefix convention for any new snippet (`snippets/kg-*.liquid`) or new standalone asset (`assets/kg-*.svg`, etc.).
- Every new section MUST include a `{% schema %}` block with a `"presets"` array so it can be added and configured from the Theme Editor. Never hardcode text a shop owner would want to change — expose it as a setting (`text`, `richtext`, `image_picker`, `url`, etc.).
- Use Dawn's existing CSS custom properties, never hardcoded colors or one-off values:
  - `rgb(var(--color-foreground))`, `rgb(var(--color-background))`, `rgba(var(--color-foreground), 0.08)` for borders
  - `var(--font-body-family)`, `var(--font-heading-family)`
  - `var(--page-width)`
  - `var(--buttons-radius)`, `var(--inputs-radius)`
  - Spacing: `var(--spacing-sections-desktop)` / `var(--spacing-sections-mobile)`, `var(--grid-desktop-horizontal-spacing)` / `var(--grid-mobile-horizontal-spacing)`
  - All defined globally in [layout/theme.liquid](layout/theme.liquid#L126-L247) — read it before introducing a new custom property.
- Scope all CSS to a unique class prefix matching the section name (e.g. `.kg-trust-badges__*`). No global selectors, no rules added to Dawn's shared `component-*.css` files.
- Wrap section content in `<div class="page-width">` (optionally with `section-{{ section.id }}-padding` alongside it) to match Dawn's layout grid — this is the convention used throughout Dawn (e.g. [sections/collage.liquid:22](sections/collage.liquid#L22), [sections/multicolumn.liquid:28](sections/multicolumn.liquid#L28)).
- No jQuery, no external JS libraries, no CDN scripts. Vanilla JS only, and only when genuinely needed.

## Responsive rules — every section, no exceptions
Each section must be fully designed and usable at BOTH ends, not merely "not broken" at one of them:
- Mobile: must work at 360px wide. Tap targets at least 44×44px. No horizontal page scroll ever — if a table or wide element must overflow, it gets its own `overflow-x` container, never the body.
- Desktop: must look composed at 1440px+. Content respects `var(--page-width)` and never stretches into a single unreadable line. Don't just centre a mobile layout in a wide empty space — use the extra width deliberately.
- Design the breakpoints for the content, not a fixed list. Dawn's own breakpoints are 750px and 990px (`@media screen and (min-width: 750px)` / `990px`) — match them.
- Use ONE set of markup that CSS adapts. Never render hidden duplicate markup for mobile and desktop.
- After building, describe how the section looks and behaves at 360px, at 750px, and at 1440px.

## Performance rules — non-negotiable
This store's speed score must not regress:
- ZERO external requests. No CDN scripts, no Google Fonts, no icon fonts. Icons are inline SVG. Never add a font.
- Section CSS goes in a `{% stylesheet %}` tag and JS in a `{% javascript %}` tag inside the section file — Shopify bundles these into one theme-wide file rather than one per section (Dawn itself uses this pattern, e.g. [sections/header.liquid:329](sections/header.liquid#L329)).
- NEVER output a full-size image. Use the `image_url` filter with explicit widths plus a `srcset` and a correct `sizes` attribute matching the real rendered width (see the pattern in [snippets/card-product.liquid:123-133](snippets/card-product.liquid#L123-L133)).
- Every `<img>` MUST have explicit `width` and `height` attributes or an `aspect-ratio` box. Layout shift is the most common way a custom section wrecks Core Web Vitals.
- `loading="lazy"` and `decoding="async"` on every image EXCEPT a possible above-the-fold LCP element, which gets `fetchpriority="high"` and no lazy.
- No scroll or resize event listeners — use `IntersectionObserver` or `ResizeObserver`. No `setInterval` polling.
- No CSS `@import`. Animate only `transform` and `opacity`, always inside a `prefers-reduced-motion` guard.

## Context that should shape section design
- **Cash on delivery**: many customers pay COD, not card. If a section touches checkout/cart messaging, don't assume prepaid-only flows (e.g. don't hide/disable COD-relevant info, avoid card-only iconography).
- **PKR currency**: prices render via Shopify's `money` filters already configured for the shop's currency — don't hardcode `$` or other currency symbols in new sections.
