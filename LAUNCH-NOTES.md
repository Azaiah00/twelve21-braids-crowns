# Launch notes: Twelve:21 Braids & Crowns

Everything below needs Vanessa's confirmation or action before or at launch. Facts verified 12 Oct 2026 (Acuity menu and policies captured live; Google, Instagram, Linktree, directories).

## Domain
- Live preview domain (canonical everywhere): https://twelve21-braids-crowns.netlify.app/
- Proposed custom domain: **twelve21braidsandcrowns.com** (matches the Acuity subdomain). Availability not confirmed: check before the pitch.

## Pitch points
- No real website: Google's Website field points to Linktree (5 buttons, no services, prices, photos, address or reviews).
- Her full menu and policies live only inside the JavaScript-rendered Acuity page, which Google cannot read. The new site puts every price, time and policy in indexable HTML, plus `llms.txt` and schema for AI answer engines.
- 135 five-star Google reviews are not showcased anywhere she owns.
- Directory data is inconsistent (MapQuest phone typo (757), three different hour sets, stale review counts).

## Facts to confirm
1. **Hours.** Only Google's Monday 9 AM to 5 PM is verified. Other sources conflict: Birdeye Mon to Fri 9 to 6, Sat closed; BuyBlack Mon to Fri 9 to 5, Sat 8 to 2; MapQuest Mon to Sat 8 to 5. The site says "By appointment, open times show live on the booking page" and the schema has **no openingHoursSpecification**. Get her real weekly hours, then add them to the site, schema, Google and every directory.
2. **Phone** (775) 487-1221 is a Nevada area code but is the number on Google. Confirm it takes calls and texts (the site offers both). Ask MapQuest/Yext to fix the (757) typo.
3. **Vanessa's photos.** The intro uses `vanessa-in-the-studio.webp` (IG post: her in her chair; the photo was a mirror selfie, so it was flipped horizontally so the "Twelve:21 Braids & Crowns" sign reads correctly) and `vanessa-portrait.webp` (her IG profile picture, captioned "Vanessa, Twelve:21 Braids & Crowns"). Judged to be her by matching several of her own posts. Confirm, and ask for a professional portrait. Only her first name is used; "Vanessa D." is not shown.
4. **Deposit amount** was not shown in the captured policies, so the site says "non-refundable deposit" without a figure. Add the amount if she wants it shown.
5. **Policy wording conflict:** the Sick Policy says cancellations/no-shows forfeit the deposit plus **50%** of the service; the Reschedule/Cancellation policy says no call/no show/same-day cancellation is deposit forfeiture plus **100%** and no future bookings. Both are shown as written. Ask which applies when.
6. **Retwist durations as listed on Acuity look inconsistent** (for example Ear-to-neck no style 3 hr but basic 2 hr; Waist no style 1 hr 30 min; Shoulder knots 2 hr). Shown exactly as listed. Ask her to check those appointment types in Acuity.
7. **Kids:** Atly calls the studio kid-friendly, but her own policy is "NO KIDS under 12 years old". The site follows her policy (clients 12+) and does not market kids' braids.
8. **Men's services:** the intro says men's styles started her hair career (her IG caption). Confirm she wants that line.
9. **Her words used on the site** come from her own captions/bio: "Precision & Quality lives here!", "Yes, it's ME", "Beautiful hair is expected. How you're cared for is what makes the difference.", "One thing about me... I'll never sacrifice the health of your hair just to achieve a style.", "Some people see a silk press. I see trust." (lightly edited), "COMMUNICATION is KEY!", "COME CAMERA READY!!!", and the consultation description. Emoji were removed. Confirm she is happy with them.
10. **Reviews:** the home page shows paraphrased review themes (stitch braids, curly bun, warm and friendly atmosphere, above and beyond, lasting 8+ weeks) attributed to "Google review" / "Review summary on Atly", with no names. Only the Google 5.0 / 135 rating is in schema (home page only). Ask permission to quote 3 to 5 real Google reviews with first names.
11. **Not claimed anywhere:** any meaning of "12:21", years in business, licenses, "pain-free", product brands, email address, staff besides Vanessa. "The House of Twelve:21" and "Twelve:21 Luxe Silk Experience" (from recent captions) are not used; add them if she wants that branding.
12. **Home summary prices** are the lowest menu price per category; knotless shows "Installs from $200" (touch-ups from $125 are for her previous clients only).
13. **Geo coordinates** in schema (28.5821472, -81.4159934) come from a directory (hairaide). Confirm against her Google pin.

## v2 "Gold Line" art (Oct 12 2026)
- **Credit:** Line-art series: Couture House original illustrations restyled in Twelve:21 gold/black and animated with Kie.ai (Nano Banana Pro + Kling 2.1 Pro); owned by Couture House, licensed to the salon with the site.
- The illustrations are stylised, not portraits of Vanessa or any client. Her real photos stay in "Yes, it's ME" and the gallery.
- The hero photo from v1 (sleek braided ponytail) now lives in the gallery only. The link-preview card is `share-2.jpg` (gold-line hero art with the 12:21 hands, wordmark, 5.0 from 135 Google reviews). It uses a new filename because iMessage and Facebook cache previews by image URL.
- Colour: every art file was graded through her palette (ink, bronze, champagne gold); the raw Kie renders leaned copper/rose and must not be used directly.
- The v1 palm-green accent was retired so the whole site reads gold on black.

## Menu
- Copied from Acuity on 12 Oct 2026. Service names were lightly formatted for readability (for example "Silk Press, Medium, Fine"). Every price block carries "Prices from Acuity Scheduling, October 12, 2026. Final price confirmed at booking."
- All "Book" buttons go to the main Acuity page. If she shares appointment-type IDs, the finder buttons can deep-link to the exact service.
- `/book` redirects to Acuity (netlify.toml) for short links on cards and flyers.

## Photos
- All 40 gallery photos and Vanessa's two portraits come from her public Instagram (@twelve21_braidsandcrowns) and **must be approved by Vanessa**; confirm every client shown is fine appearing (her policy already tells clients they are photographed for marketing).
- Excluded on purpose: highlight graphics, studio-renovation and POV/text-overlay posts, beach and balloon posts, collaboration/workshop posts that show other braiders' work (006, 045, 047, 050, 051), the mannequin post, and photos centering younger children.
- One gallery photo shows a prom style (`loc-ponytail-curls-prom.webp`); the client may be a teen. Confirm or swap.
- Ask for original, higher-resolution files: most Instagram exports are 720px wide.
- **Logo:** no logo file was available. The site uses a typographic wordmark (crown colon from her highlight covers) and a 12:21 clock mark. Her gold acrylic salon sign (script "Twelve:21" with a rat-tail-comb T, "BRAIDS & CROWNS") is the real logo: ask for the vector file and swap it in.

## Forms
- Netlify form `consult-request` on visit.html (name, mobile, optional email, service, hair length, message; honeypot). Works once deployed on Netlify; on localhost it shows a preview message. Turn on email notifications to her inbox after deploy.

## Google Business Profile actions
- Change the Website field from Linktree to the new site; add the booking link; make hours match the site.
- Upload the best gallery photos; keep Linktree as a secondary link if she likes it.
