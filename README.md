# CSkilled — Qaf-inspired site

Static Arabic (RTL) marketing site for CSkilled, deployed on Vercel. No build step: every page is a self-contained HTML file plus a small shared layer in `assets/`.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/track-python`, `/track-cpp`, `/track-ai` | `track-*.html` |
| `/diploma-python`, `/diploma-dsa-python`, `/diploma-cpp`, `/diploma-dsa-cpp`, `/diploma-ml`, `/diploma-dl` | `diploma-*.html` |
| `/instructor`, `/community`, `/faq`, `/contact` | matching `.html` |
| `/terms`, `/privacy`, `/refund` | policy pages |
| any unknown URL | `404.html` |

`vercel.json` turns on clean URLs (`/faq` serves `faq.html`) and redirects the original upload names (`cskilled-*-qaf.html`) to the new URLs.

## Shared layer (`assets/`)

- `site.js`
  - **`LINKS`**: the WhatsApp, Telegram, Discord, LinkedIn, Facebook, Google Scholar and login URLs used by every button marked `data-link="…"`. Fill these in once and every page updates. Empty values fall back to an in-site page (`/contact` or `/community`); LinkedIn, Facebook and Scholar are hidden while empty.
  - Mobile menu (hamburger under 1180px) for the inner pages. The home page has its own menu and responsive styles, so it loads `site.js` only.
  - Home-page quiz («ابدأ رحلتك»): picks a diploma from the visitor's answers and points «ابدأ المشاهدة الآن» at that diploma's free first lecture.
  - Contact form: validates the e-mail, opens the visitor's mail app addressed to `support@cskilled.com`, and pre-fills the message when the visitor arrives from a pricing button (`/contact?program=…&plan=…&currency=…`).
- `site.css`: mobile/tablet layout for the page components, plus the mobile menu styles.
- `favicon.svg`, `og-image.png`: browser icon and social share image.

## Content still to confirm

Values shown as dashed `[[…]]` chips (USD instalments, lecture counts per unit, testimonials, community numbers, events…) are placeholders from the design. Replace them with confirmed content in the HTML.

## Local preview

```sh
npx serve .
```

## Caching

Pages load `assets/site.css` and `assets/site.js` with a `?v=` version tag. After editing either file, update the tag in every page so browsers fetch the new copy, e.g.:

```sh
V=$(cat assets/site.css assets/site.js | sha1sum | cut -c1-8)
sed -i -E "s#(/assets/site\.(css|js))(\?v=[0-9a-f]+)?\"#\1?v=$V\"#g" *.html
```
