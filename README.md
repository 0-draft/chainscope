<div align="center">

<img src="./public/logo.svg" alt="chainscope" width="320" />

# chainscope

*the supply chain, in six surfaces.*

[live](https://0-draft.github.io/chainscope) · [ci](https://github.com/0-draft/chainscope/actions) · [mit](./LICENSE)

</div>

---

A spacebar-driven visual explainer for software supply chain security.

Six stages from keyboard to kubelet. Six real attacks (2020 to 2026). Six defenses you can audit today. Each press of `space` is one mental beat.

## the six surfaces

| # | stage | the question |
| - | ----- | ------------ |
| 01 | source | who can change the code, and how do you know they meant to? |
| 02 | deps | your code is mostly other people's code. whose, exactly? |
| 03 | build | the artifact is not the source. who turned one into the other? |
| 04 | publish | the artifact has a name now. who put it there? |
| 05 | distribute | the name resolves to bytes somewhere. to whose? |
| 06 | consume | the artifact is on the box. should it be allowed to run? |

Anchor incidents: xz-utils, Shai-Hulud, tj-actions, LiteLLM/TeamPCP, pgserve, SUNSPOT.

## stack

- Astro 6 + React 19 islands, hydrate only the deck
- TypeScript strict, Biome, Vitest
- Motion 12 for slide transitions and pipeline animation
- Tailwind v4 via `@theme`
- GitHub Pages via `actions/deploy-pages`

## develop

```sh
npm install
npm run dev      # http://localhost:4321/chainscope
npm run check    # lint + typecheck + test + audit + build
npm run build    # static output to dist/
```

The site is configured for `https://0-draft.github.io/chainscope`. Links use `import.meta.env.BASE_URL`. Forking? Change `site` and `base` in `astro.config.mjs`.

## keys

| key | action |
| --- | ------ |
| `space` / `→` / `PageDown` | advance |
| `←` / `PageUp` / `Backspace` | back |
| `Home` / `End` | first / last |
| `r` | restart |

## license

MIT. See [LICENSE](./LICENSE).
