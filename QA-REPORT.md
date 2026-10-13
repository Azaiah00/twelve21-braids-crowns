# QA report: Twelve:21 Braids & Crowns, v2 "Gold Line" (Oct 12 2026)

Folder: `/home/claude/salons/sites-v2/twelve21-braids-crowns` (copy of the shipped v1; the original is untouched).
QA scripts: `/home/claude/salons/qa/twelve21-v2` (`qa.py`, `shots.py`, `art.py`, `gen.py`, `peek.py`), served with production CSP headers on port 8907.
CSS version on every page: `?v=20261012b`.

## Results (qa.py, all PASS)

| Check | Result |
| --- | --- |
| No emoji (all text files) | PASS |
| No lorem / TODO / coming soon | PASS |
| Exactly one H1 per page | PASS |
| Every img has alt + width + height | PASS |
| JSON-LD parses (HairSalon, WebSite, FAQPage, BreadcrumbList, ImageGallery) | PASS |
| Local links, srcset/imagesrcset and CSS url() assets resolve | PASS |
| No inline style attributes (strict CSP) | PASS |
| CSS version on every stylesheet link | PASS |
| Absolute canonical URLs resolve to files | PASS |
| Titles <= 60, descriptions <= 155 | PASS |
| Stable-scrolling block is the last rule; no overflow clip on html/body/main | PASS |
| Videos: H.264 MP4 + VP9 WebM, video stream only (no audio), moov before mdat (faststart), each < 2.5 MB (largest 1.05 MB) | PASS |
| No console errors or CSP violations at 390 / 768 / 1440, all pages | PASS |
| No horizontal overflow at 390 / 768 / 1440 | PASS |
| Overflow sampled every 100 ms while scrolling at 360 / 390 / 414 | PASS |
| Sticky header sticks | PASS |
| Price finders match the Acuity menu (22 retwist + 6 silk press combos, home + services) | PASS |
| Finder has no dead ends (unavailable style falls back with a consultation note) | PASS |
| Retwist table matches the menu | PASS |
| Mobile menu: open, aria-expanded, Esc closes and returns focus | PASS |
| Gallery filters + keyboard lightbox | PASS |
| Form validation + success state | PASS |
| JS disabled: all content visible (hands render at 12:21) | PASS |
| Reduced motion: content visible; no video requested; posters only; hands static at 12:21; second spark hidden | PASS |
| Right video per viewport (1440, 1280: desktop file; 768, 414, 390, 360: phone hero file; studio phone crop at < 700px); the other file and the other poster are never requested | PASS |
| Poster, video and SVG hands share one identical box at every width (hands stay on the ring centre) | PASS |
| Hero and studio hands settle at exactly 12:21 (hour 10.5deg, minute 126deg) | PASS |
| Hero video pauses when scrolled off-screen | PASS |
| Text contrast WCAG AA (about 1,850 text elements over 6 pages x 2 widths, 0 failures) | PASS |
| Tap targets >= 44px | PASS |

## Art checks (art.py + visual)
- **Colour:** raw Kie renders measured hue 27 to 31deg (copper/rose drift) against the brand gold at 41 to 43deg. Every still and loop was graded through one gradient map in her palette: ink #121212 > bronze #8A6A22 > gold #C9A24B > #D9B865 > champagne. Result: champagne gold on ink only.
- **Edges:** the art ground decodes to #121212 (video) or within 1 level of it (webp posters). Edge overlays paint exact ink where a box edge falls inside the page, and the emblem is a lossless palette PNG blended with `lighten`. No rectangle edges are visible at 390, 768, 1440 or 1920. Pixel sampling across the hero art edge at 1920 shows only uniform ±1 gradient dithering.
- **Clock geometry** was measured by a circle fit on the graded first frame and re-fitted on the last frame (drift 0.6 to 2.6 px). Hero desktop centre 24.41% / 41.01%, r 19.32% of width; hero phone 49.93% / 49.97%, r 42.93%. These match README.txt within 0.33%. Studio: README's values were about 8 px off the tick ring, so the measured fit (56.63% / 35.79%, r 19.56%) is used.
- **Loops:** Kling's last frame duplicates frame 0, so it was dropped, and an 8-frame (0.33 s) crossfade of the tail into the head was added. Measured on lossless frames, the seam is now below normal frame-to-frame motion on all four loops (hero phone 0.20 vs adjacent max 0.36). Posters are frame 0 of the exact frames the videos were encoded from.
- **Hands vs face:** at 12:21 both hands and the minute-hand tail fall over the braids and hair, never her face, on the desktop hero, phone hero, studio desktop and studio phone. On the phone hero, the headline starts below her chin, over an ink fade.

## Screenshots (`/home/claude/salons/qa/twelve21-v2/shots/`)
`{index,services,policies,gallery,visit,404}-{390,768,1440}.png` (full page, reveals settled), `hands-proof.png` (hands close-ups and reduced-motion hero), `hands-studio-1440.png`, `hands-studio-390.png`, `reduced-motion-index-1440.png`, `mobile-menu-390.png`, `lightbox-1280.png`, `nojs-index-390.png`.
Note: the fixed mobile Call/Book bar appears mid-image in full-page phone captures. That is a capture artifact; on a phone it sits at the bottom of the screen.
