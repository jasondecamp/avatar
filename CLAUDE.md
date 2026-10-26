# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Avatar Creator is a single-package Vite + React 18 SPA (the avatar builder) managed with pnpm, hosted at https://mimsy.me/. It uses plain React state plus a `localStorage` snapshot helper, with no Redux, no router, and no API calls.

The repo used to be a Lerna monorepo with a scaffolded `@avatar/library` package (Redux generators, routing, contexts, Storybook) derived from `moved-react`. None of it was ever used, so it was removed and the app flattened to the repo root (2026-10-25). It's still in git history, but don't reintroduce it by default. Add routing, global state, or shared packages only when a feature needs them, after agreeing it with Jason.

## Common Commands

```bash
pnpm install
pnpm start             # dev server (VITE_PORT from .env, default 8060)
pnpm build             # production build → dist/
pnpm preview           # serve dist/ locally
pnpm run deploy        # rsync dist/ to https://mimsy.me/ (/var/www/mimsy.me); run `pnpm build` first. `pnpm deploy` is a pnpm built-in, so `run` is required
```

**Every push to `main` auto-deploys to production** via `.github/workflows/deploy.yml`. It builds, then runs `pnpm run deploy` with a dedicated deploy key (repo secrets `DEPLOY_SSH_KEY` and `DEPLOY_KNOWN_HOSTS`). Treat merging to `main` as shipping.

`main` is protected by the "Protect main" ruleset, which applies to admins too with no bypass. Every change lands on a branch and merges through a pull request. No approving review is required, force-pushes are blocked, and the branch can't be deleted.

There is no test runner or ESLint config yet. Verify changes with `pnpm build`.

The app reads no `import.meta.env` variables. `.env` only sets `VITE_PORT` for the dev server. If runtime config is ever needed, use `VITE_*` vars with Vite's standard `.env.[mode]` files rather than adding `dotenv-cli`.

## pnpm Configuration

- `pnpm-workspace.yaml` holds pnpm settings (it's not a multi-package workspace). Dependency `overrides` go there too: a `pnpm.overrides` block in `package.json` is silently ignored. Use exact versions for overrides and confirm the lockfile's `overrides:` section changed.
- Dependency build scripts are blocked unless approved under `allowBuilds` (currently only `esbuild`). Approve with `pnpm approve-builds <pkg>`, and deny packages whose scripts are only banners.
- pnpm doesn't hoist undeclared dependencies, so every imported package must be in `package.json`.

## Composition Over Configuration (important)

This is a strong preference. It applies to every component design and refactor decision.

- **Compose with children, not config props.** Build a shared component as a compound component: a root with attached subcomponents (for example, a `Panel` with `Panel.Title`, `Panel.Content` and `Panel.Actions`), arranged as children by whoever uses it. Don't build a props or slots API (`title={…} footer={…} actions={[…]}`), and don't drive rendering from config arrays.
- **Delegate variation to subcomponents.** When a component starts collecting boolean flags, `type`/`variant` switches, or render-prop slots to cover different cases, split those cases into separate components that share smaller pieces.
- **Share state through context.** A compound root provides context with a safe default value, so a subcomponent still renders when used on its own.
- **Reserve rendering engines for truly dynamic content.** Data-driven rendering is acceptable only when the structure is unknown until runtime (e.g. the avatar's character layer and form data). It's never acceptable for general-purpose UI.
- **Declarative over imperative.** Use React's model rather than direct DOM manipulation, imperative listeners, or manual syncing, and use effects only when necessary.

When reviewing or proposing designs, flag config-heavy APIs as a design problem, not a nit.

## Architecture

```
src/
  index.jsx                    # createRoot → <App />
  core/components/App.jsx      # <LayoutBasic><Builder /></LayoutBasic>
  features/
    builder/
      characters/              # per-character layer definitions (base, human, vampire, …)
      components/              # Builder, Stage, CarouselRow, CharacterRow, BodyRow, RecentSnapshots
        styles/                # *.module.scss + _variables.scss
      services/                # layers.js (LAYER_STACK order, part blend modes, layer resolver), export.js (image generation), snapshots.js (localStorage), helpers.js
      index.jsx                # barrel
    common/
      components/LayoutBasic.jsx
      index.jsx
```

- Layer stacking is defined once, in `LAYER_STACK` (`features/builder/services/layers.js`). The stage z-indexes, the PNG export and the snapshot thumbnails all read it. Picker row order is separate (`getCharacterLayerOptions`).
- A part can blend with the layers beneath it (`screen`, `multiply`, `color`, …) through `PART_BLEND_MODES` in the same file. The stage sets it as `mix-blend-mode` on the part's row (each row is its own stacking context), and the export uses the canvas `globalCompositeOperation`.
- Parts are 800×800 PNG or SVG files in `characters/<character>/<layer>/`; the file name is the picker label. To create new parts, use the `layer-part`, `outfit-part` and `headgear-part` skills in `.claude/skills/`.
- State lives in React (`useState`/`useMemo`) inside `Builder`. Recent snapshots persist through `features/builder/services/snapshots.js` (`localStorage`).
- Organize code by feature: `features/[featureName]/{components,services}` plus an `index.jsx` barrel. Features don't import from sibling features; shared code goes in `features/common`.

## Styling

- Dart Sass. Component styles are CSS modules (`*.module.scss`) in a `styles/` folder next to the component, imported as `CSS`.
- Global styles live in `core/components/styles/App.scss`; builder-wide SCSS variables live in `features/builder/components/styles/_variables.scss`. The Clavo font loads from the Typekit `<link>` in `index.html`.
- Don't invent class names that don't exist, and don't use inline `style` for static values; reserve it for values computed at runtime.
- Default new CSS `transition` durations to `0.2s`.
- `border-radius: 50%` isn't the same as a large pill radius: on a non-square element it draws an ellipse.

## Code Style Preferences

- Single quotes, and only straight quotes as string delimiters. Curly quotes can appear inside display strings only.
- Arrow-function components and callbacks, with destructured props.
- Named exports, not default exports.
- One component per file, with the file named after the component.
- Prefer semantic HTML elements.
- Use `classnames` for conditional classes instead of template-literal interpolation. Write a plain string as `className='foo'`, never `className={'foo'}`.
- Use `value != null` instead of `!!value` for boolean coercion.
- `onClick={() => fn()}` and `onClick={fn}` aren't equivalent, because React passes the event as the first argument. Check the callee's signature before unwrapping one into the other.
- UI labels use sentence case ("Recent snapshots"), never Title Case on every word.
- Imports go in groups: React, external libraries, then relative imports, with a blank line between groups.

## Dependency Upgrades

For a major-version bump, grep for the library's whole API surface: the bare import name and every property access, including config or `defaults` objects, not just call verbs. Check the migration guide's list of removed APIs. Then smoke-test a real boot (`pnpm start` or `pnpm build`), because no tests exercise the app's boot path.
