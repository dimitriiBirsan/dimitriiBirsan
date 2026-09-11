# dimitrii.dev

Dumitru Birsan’s bilingual engineering site: current freelance work, selected project summaries, technical writing, and Dark Patterns Lab.

Astro generates static HTML. MDX is used for writing and Markdown for projects. The homepage and Lab index each include one Svelte island for the featured talk’s affix drawer. About, skills, work, and writing pages ship no application JavaScript. The interactive Lab also uses a small browser script; there is no React runtime, analytics, contact form, or third-party font request.

## Local development

Use Node **24.16.0 or newer** and npm. The pinned version is in `.nvmrc`.

```sh
npm ci
npm run dev
```

Astro prints the local URL. English routes are at `/`; Italian routes are under `/it/`. Writing keeps the existing `/blog/` URL, and selected work lives under `/work/`.

## Build and validation

```sh
npx playwright install chromium
npm run validate
```

Validation checks formatting, Astro/TypeScript, translation routing, the production build, internal links and fragments, unique metadata, reciprocal language links, heading structure, images, feeds, sitemap, and the JavaScript budget. Playwright checks navigation, keyboard access, the Lab, missing pages, and mobile layouts at 320px in both languages and themes. Axe checks WCAG A/AA rules; automated checks do not replace manual accessibility review.

Useful commands:

| Command                          | Purpose                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `npm run dev`                    | Development server                                          |
| `npm run build`                  | Static output in `dist/` and production security headers    |
| `npm run preview`                | Astro’s preview of the build                                |
| `node scripts/serve-preview.mjs` | Preview with the production CSP at `http://127.0.0.1:4322/` |
| `npm run check`                  | Astro and TypeScript diagnostics                            |
| `npm test`                       | Translation routing tests                                   |
| `npm run test:routes`            | Validate generated HTML and references                      |
| `npm run test:browser`           | Browser tests against a production preview                  |
| `npm run format`                 | Format maintained source files                              |
| `npm audit`                      | Dependency security audit                                   |

## Content workflow

Writing lives in `src/content/blog/`, retained to preserve the existing content structure. Projects live in `src/content/projects/`. Both use Astro Content Collections, defined in `src/content.config.ts`.

Add an English file and an Italian counterpart with the same `translationKey`. Filenames can use the existing `name.mdx` / `name.it.mdx` convention; the key determines the public URL. Both files need `lang`, a unique title, a description, and `draft: false` (the default). Drafts are excluded from routes, listings, RSS, and the sitemap. Keep both translations in draft until ready to publish together; route validation will reject a missing counterpart.

Posts also require `pubDate` and can have `updatedDate`, `tags`, `heroImage`, and `heroAlt`. Use ISO dates. Keep topic names consistent between translations so topic routes remain reciprocal. `showHero: false` retains a post’s existing social image without displaying decorative artwork in the article. Use semantic headings beginning at H2; the layout supplies H1, dates, and BlogPosting metadata. Use fenced code blocks for examples and `ImageGallery.astro` for responsive local photography.

Projects require `category`, `technologies`, `order`, and optionally `featured`. Write context, challenge, personal contribution, architecture, and outcome/current status. Keep ongoing work distinct from demonstrated results. Never invent measurements, ownership, or private details. The public project summaries intentionally omit client names and proprietary systems.

`src/data/experience.ts` is the single source for role dates, canonical company names, client responsibilities, and education. It represents one freelance role starting in March 2026, with Dreamonkey s.r.l. and ErSistemi SPA as clients. Descriptive client labels are not contractual job titles. Contact details are centralized in `src/consts.ts`; the existing professional email is retained.

## Translation workflow

English is the source. Rewrite Italian naturally while retaining company names, professional titles, technology names, and protocol names. Shared page templates live in `src/components/`; their bilingual copy is rendered at build time. `src/utils/i18n.ts` normalizes URLs and generates EN, IT, and x-default alternates. Every translated page canonicalizes to itself. Old `.it` article slugs and Dark Patterns URLs redirect to their replacements.

Use dates for writing, career history, and education. About and skills are evergreen pages and have no publication metadata.

Keep the writing personal: describe what happened, what caught your attention, and what you worked on. Technical accuracy does not require résumé language. The interactive Lab keeps its original feature artwork and a deliberately rigged, local feature lottery; visitors can switch to a fair version that downloads `public/lab/sample.csv`. Its credits and rewards are fictional.

The showcase uses `TalkGachaCard.svelte`, with all copy in `src/data/featured-talk.ts`. The verified recording is linked there; add a slides action only when its URL is confirmed. Rarity and affixes are presentation metaphors. `LabPreview.astro` uses `client:visible` on the homepage and `client:idle` on the Lab index. Before hydration the content and links are usable; a no-JavaScript fallback shows the takeaways. Svelte owns only drawer state. All visual effects are CSS, run only on interaction, and respect reduced motion.

Tailwind 4 is built through its Vite plugin. `src/styles/talk-gacha.css` generates only the component’s `tw:` utilities and omits Preflight, keeping its styles separate from the rest of the site. `npm run check` validates both Astro and Svelte TypeScript. Browser checks exercise both hydration modes, the drawer with keyboard input, both languages, and 320/375/768/1024px layouts. The component accepts explicit localized strings and is independent of route prefixes; this repository currently uses `/` for English and `/it/` for Italian.

## Deployment architecture

```text
Pull request / main
  → npm ci → format → type check → unit tests → build
  → static route checks → browser / accessibility checks → dependency audit
  → main only: version tag → Docker build → GHCR
  → optional production job: exact image digest → SSH → Docker Compose
  → Traefik (HTTPS) → Nginx (static files)
```

The existing version-tagging workflow and Compose port mapping are retained. PRs validate without publishing images or changing production. The Dockerfile pins Node and Nginx image digests. The runtime includes only Nginx and static files. Traefik supplies TLS, redirects HTTP to HTTPS, and redirects the `www` hostname to the canonical hostname. Its `web` and `websecure` entrypoints and the external network must already exist.

Publishing to GHCR uses the existing `TOKEN` secret. Production deployment is opt-in: set repository variable `SITE_DEPLOY_ENABLED=true`, set `DEPLOY_PATH` to a provisioned absolute application directory, and configure these secrets:

- `DEPLOY_HOST` and `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_KNOWN_HOSTS`, containing the server’s independently verified SSH host key

The `production` GitHub environment can enforce release approvals. The server needs Docker Compose supporting `--wait`, access to the GHCR image, a production `.env` based on `.env.example`, and the configured Traefik network. Deployment copies the version-controlled Compose file and uses the built image digest. Previous Compose and image manifests are kept for an explicit rollback. No production files are edited manually by this build.

For a local container check:

```sh
docker build -t dimitrii-dev:local .
docker run --rm -p 9024:80 dimitrii-dev:local
```

## Security and maintenance

The production build hashes the emitted inline scripts and styles into `.astro/security-headers.conf`. Nginx loads that file to enforce CSP without `unsafe-inline` or `unsafe-eval`. Only same-origin resources are allowed; browser network connections, embedding, objects, and form submissions are disabled. Syntax-highlighting style attributes are allowed by exact hashes. The preview server uses the same generated policy for browser tests.

Nginx also sends HSTS, `nosniff`, a referrer policy, and a permissions policy. Security headers apply to assets as well as HTML. HSTS assumes production is served over HTTPS by Traefik. Local Astro development does not use the production CSP.

Use `npm ci` for reproducible installs. Update the lockfile, Node pin, and container image digests deliberately, then run validation. Production dependencies cover Astro, Svelte, MDX, RSS, sitemap generation, and image optimization. Tailwind, testing, and formatting tools are development dependencies. Existing event photography supplies the default social image; article-specific social images are retained and optimized.
