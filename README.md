# Twelve:21 Braids & Crowns: website

A launch-ready spec website for **Twelve:21 Braids & Crowns**, Vanessa's hair studio at 3701 John Young Pkwy, Suite 100-7, Orlando, FL 32804 (Princeton / Silver Star area). Built by Couture House Co. (hello@couturehouse.co).

- Live preview (canonical): https://twelve21-braids-crowns.netlify.app/
- Booking (every "Book" button): https://twelve21braidsandcrowns.as.me/
- Proposed custom domain: **twelve21braidsandcrowns.com** (check availability before the pitch)

## Concept: "Precision & Quality lives here" + the 12:21 timestamp

Her Instagram highlight covers spell 1 / 2 / 1 / 2 in gold numerals with crowns as the colon. The site turns that into a timestamp system:
a thin gold clock whose hands sweep and settle at 12:21 on load, Bodoni Moda numerals, section labels written as timestamps (12:21:01, 12:21:02 ...), and a crown colon in the wordmark.

- Palette (v2, strictly her gold and black): ink #121212, espresso #2A1F1A, champagne gold #C9A24B (gold text on dark #D9B865, bronze #8A6A22 for gold on light, AA), ivory #F8F3EA for long reading sections. The v1 palm-green accent and sand grounds are retired.
- Type (self-hosted, Fontsource): DM Serif Display (display), Bodoni Moda (numerals, prices, timestamps), Figtree (body).
- Scrollbars: metallic gold thumb on ink track; inner scrollers (chip rows, retwist table, gallery filters) gold on ink, bronze on ivory.

### v2 "Gold Line" art (Oct 12 2026)
Gold-foil hairline illustrations on matte black, restyled in her palette. Every still and loop is passed through one gradient map
(ink > bronze #8A6A22 > gold #C9A24B > #D9B865 > champagne) so no copper or rose cast survives and the art ground is exactly the page ink.
The illustrated clock halo IS the 12:21 clock: the art has no hands; the site draws them as an SVG overlay (gold gradient, 1px ink
outline, tapered tips, centre pin) in the art's own pixel space, stacked on the poster and the video in one exact-aspect box.

| Art | Where |
| --- | --- |
| Hero loop (desktop 16:9 / phone 9:16) + live hands | Home hero. Desktop: figure + clock left, headline right. Phone: figure centred, headline below her chin over an ink fade |
| Studio loop (16:9 / 1:1 phone crop) + live hands | Home, "Yes, it's ME" (Vanessa's real photos sit just below) |
| Hands braiding | Price-finder intro panel (home + services), gallery page header |
| Back view | Policies page header |
| Emblem (clock + crown, baked hands removed, live hands) | Section divider (home, services), CTA band on every page, services + visit headers, 404 |

### Motion: "gold leaf being drawn" (CSS + IntersectionObserver + rAF, no libraries; off under `prefers-reduced-motion`; content visible without JS)
1. Hero + studio clocks: SVG hands sweep 12:00 to 12:21 (minute 126deg, hour 10.5deg, 1.8 s ease-out), then a tiny gold "second" spark ticks around the rim once a second. Reduced motion: posters only, hands static at 12:21.
2. Loops: muted, inline, looping; poster webp is the LCP image; phones download only the phone file; paused off-screen and in background tabs; Save-Data gets posters only.
3. Hairline rules draw themselves under every heading (stroke-dashoffset), then the crown at the end is inked; art-panel frames trace around once; divider rules draw outward from the emblem.
4. A single gold-foil shimmer sweeps across the gold words of each heading as it arrives.
5. Timestamp markers tick up second by second (12:21:00 to 12:21:0N) as each section arrives.
6. Emblem dividers: the hands follow scroll from 11:00 and settle on 12:21 as the emblem reaches mid-screen. 404: the hands race three laps and land on 12:21 ("running late").
3. Price finders: loc retwist (length x style, 22 menu prices) and silk press (length x density). Accessible radio groups; styles not offered at a length are disabled and the finder falls back to the nearest option with a note, never a dead end. Price ticks in on change.
4. Gallery: staggered "braid" grid (alternate columns offset), cards rise in a zig-zag order; filters and a keyboard lightbox.
5. Policies: cards flip up as they enter; COMMUNICATION is KEY! gets a gold highlight pulse.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero + clock, proof bar, "Yes, it's ME" intro to Vanessa, six service categories with starting prices, price finder (tabs), gallery teaser, Google 5.0 / 135 reviews, quick facts, FAQ, CTA |
| `services.html` | Full Acuity menu by category with times, prices and inclusion tags, retwist price table, both price finders, pricing FAQ |
| `policies.html` | Every booking policy in her words, organized as 10 cards |
| `gallery.html` | 40 client photos with filters and lightbox |
| `visit.html` | Address, directions, contact, how booking works, Netlify consultation form, FAQ |
| `404.html` | Branded "This page is running late" page (root-absolute paths) |

## Files

- `assets/css/fonts.css`, `assets/css/site.css`: linked with `?v=20261012b`. **Bump the version on every CSS change, on every page** (Netlify caches /assets for a year).
- `assets/js/js-flag.js` (adds `.js` to `<html>`, external so the CSP needs no inline script), `assets/js/site.js` (menu, reveals, finders, tabs, gallery, form).
- `assets/fonts/`: 5 woff2 files. `assets/img/`: WebP photos (`name.webp` + `name-800.webp` where wider than 900px), `share-2.jpg` (1200x630 link preview card; `share.jpg` is the retired v1 card, kept so old cached links still resolve), favicons, `gold-line-*` art (posters, panels, emblem PNG).
- `assets/video/`: `gold-line-{hero-desktop,hero-mobile,studio,studio-mobile}.{webm,mp4}` (VP9 + H.264, no audio, faststart, 0.3 to 1.1 MB each).
- `robots.txt`, `sitemap.xml`, `llms.txt` (AI answer-engine fact sheet with the full menu), `site.webmanifest`, `netlify.toml` (security headers incl. strict CSP, caching, pretty URLs, `/book` redirect to Acuity, internal .md files return 404).

## Preview locally

```
cd twelve21-braids-crowns
python3 -m http.server 8080
```
Open http://localhost:8080/. Double-clicking `index.html` also works (relative paths), except the 404 page.

## Deploy (Netlify)

1. Push this folder to a new GitHub repo.
2. Netlify: Add new site, import from GitHub, no build command, publish directory `.`. Name the site `twelve21-braids-crowns` so the canonical URLs match.
3. Forms: Netlify detects `consult-request` on deploy. Turn on email notifications under Site settings, Forms.
4. Custom domain: when the owner buys twelve21braidsandcrowns.com, replace `https://twelve21-braids-crowns.netlify.app/` everywhere (canonical, og:url, og:image, twitter:image, JSON-LD, sitemap.xml, robots.txt, llms.txt) and bump the CSS version.
