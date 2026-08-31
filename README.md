# Better Be Cool — website

A complete, self-contained marketing site for an air conditioning installation
business covering London. Static HTML, no framework, no dependencies, no
database. It exists to do three things:

1. **Get found** — local SEO structure, one page per area, structured data
   Google can read, and pages that load fast enough to rank.
2. **Be easy to contact** — call, WhatsApp and email on every screen, plus a
   sticky contact bar on mobile.
3. **Show what you can buy** — every system, extra and service plan priced in
   public, with an itemised quote builder that sends the customer's own list
   straight to you.

This is a standalone project. It has no framework, no build dependencies, no
database and no server — `node build.mjs` turns the JSON in `content/` into a
finished site in `public/`, and `public/` is what you deploy.

---

## Before you launch — replace these

The site is fully built, but four things are deliberately placeholders. Every
one of them is in **`content/site.json`**.

| Field | Currently | Why |
|---|---|---|
| `phone` / `phoneHref` | `020 7946 0123` | Ofcom reserves `020 7946 0xxx` for fiction, so it can never ring a real person by accident. |
| `whatsapp` | `447700900123` | Same — `07700 900xxx` is the reserved drama mobile range. |
| `email` | `hello@betterbecool.co.uk` | You don't own the domain yet. |
| `address` + `latitude`/`longitude` | A Herne Hill industrial estate | Your real trading address. The coordinates feed the map data Google reads. |

Also review, because they are claims a customer can hold you to:

- `credentials` in `content/site.json` — **F-Gas certification and REFCOM
  registration are legal requirements, not marketing.** Don't publish them until
  they're true. The same goes for the insurance figure and Part P.
- `legalName` — set this once the company is registered at Companies House.
- Prices in `content/services.json` — see below.

There are **no customer reviews or testimonials anywhere on the site, and no
star-rating markup**. That's deliberate: invented reviews are illegal under the
Digital Markets, Competition and Consumers Act 2024, and fake `AggregateRating`
markup gets a site penalised by Google. Collect real ones and add them then.

---

## Editing it

Everything a non-developer needs to change is JSON in `content/`.

| File | What's in it |
|---|---|
| `content/site.json` | Business name, phone, WhatsApp, email, address, hours, credentials, nav |
| `content/services.json` | **The itemised catalogue** — every system, extra and service plan, with prices |
| `content/areas.json` | The London areas that get their own page, and the local notes on each |
| `content/faq.json` | The questions on the home page (these also become Google's FAQ markup) |

Change a price in `content/services.json` and it updates the pricing page, the
area pages, the quote builder and the structured data Google reads — all from
that one edit. There is no second place to keep in sync.

Page wording lives in `build.mjs` (the page bodies) and `lib/templates.mjs`
(the header, footer, quote builder and cards).

### Build it

```bash
node build.mjs          # writes public/
```

Node 18 or newer. No `npm install` — there are no dependencies.

To preview locally:

```bash
npm run serve           # build, then http://localhost:8080
npm run dev             # serve what's already built
```

`serve.mjs` deliberately mirrors the two Vercel behaviours the site relies on —
extensionless URLs and a real 404 page — so a link that works locally works in
production. A plain file server would 404 on every internal link.

The generated `public/` directory is committed, so a host that doesn't run a
build step still serves the current site.

---

## Deploying — Vercel

`vercel.json` already carries the whole configuration: build command, output
directory, clean URLs and cache and security headers. You don't set anything in
the dashboard.

### Straight from your machine, no GitHub needed

```bash
npx vercel            # first run: log in, then answer the prompts
npx vercel --prod     # publish to the live URL
```

The first run links the folder to a new Vercel project and gives you a preview
URL; `--prod` promotes it. Re-run `npx vercel --prod` after any change. This is
the fastest way to see it live, and it needs no repository at all.

### From a Git repository (recommended once you're settled)

Push this project to its own GitHub repo, then **Add New → Project** in Vercel
and import it. Take every default — `vercel.json` supplies the rest. From then
on, every push to `main` deploys itself, and every branch gets its own preview
URL you can send to someone before it goes live.

### Then

Set `domain` in `content/site.json` to your real domain and redeploy. It's used
for canonical URLs, the sitemap and the social preview card, all of which must
be absolute. Add the domain under **Settings → Domains**; Vercel issues the
HTTPS certificate itself.

### About the URLs

`cleanUrls` is on, so pages are served at `/pricing` and
`/areas/clapham-battersea` rather than `/pricing.html`. The generator emits
links, canonicals and sitemap entries in that form, and `/pricing.html`
permanently redirects to `/pricing`, so there's only ever one address per page
for Google to index. Netlify and Cloudflare Pages do the same thing; a plain
static host such as GitHub Pages does not, so if you ever move, either keep the
extensions or check the new host supports it.

### Domain

Buy `betterbecool.co.uk` and point it at Vercel. A `.co.uk` reads as more
trustworthy to UK customers than `.com` for a local trade, and it's a mild
ranking signal for UK searches. Grab the `.com` too if it's free — it costs
little and stops someone else trading on the name.

The name doesn't contain "air conditioning" or "London", so it gives up the
small boost an exact-match domain used to bring. That matters much less than
it once did, and the site compensates where it counts: every page title, H1
and area page carries the words people actually search for.

---

## How the site is set up to be found

This is the part that decides whether the phone rings, so it's worth knowing
what's already done and what only you can do.

### Already built in

- **A page per area** — ten London areas, each with genuinely different copy
  about that area's housing stock, councils and planning constraints. Ten
  near-identical pages would be worse than one; these aren't.
- **Structured data** — `HVACBusiness` with your address, hours, service area
  and coordinates; a priced `OfferCatalog` of everything you sell; `FAQPage`
  markup that can put your answers directly into search results;
  `BreadcrumbList` on area pages.
- **`sitemap.xml` and `robots.txt`**, regenerated on every build.
- **Titles and meta descriptions** written per page around what people actually
  search for ("air conditioning installation london", "air conditioning cost",
  "air conditioning installers <area>").
- **Speed** — one small CSS file, one small JS file, no fonts, no trackers, no
  frameworks. Core Web Vitals are a ranking factor and this site is built to
  pass them.
- **Social preview image** at `assets/og-image.png`, so a shared link on
  WhatsApp looks like a business rather than a bare URL.
- **Mobile** — most trade searches are on a phone. Call and WhatsApp sit in a
  fixed bar at the bottom of every page.

### What you have to do yourself

In rough order of how much difference it makes:

1. **Google Business Profile.** For a local trade this matters more than the
   website. Free, at business.google.com. Verify the address, set the service
   area to Greater London, pick "HVAC contractor" as the category, add photos of
   real installations, and list your services. The map pack sits above the
   normal results.
2. **Reviews on that profile.** Ask every customer, on the day, while they're
   pleased. Volume and recency both count. This is the single biggest lever
   after having the profile at all.
3. **Google Search Console** — verify the domain, submit
   `https://yourdomain/sitemap.xml`. Then **Bing Webmaster Tools**, which also
   feeds ChatGPT and Copilot search results.
4. **Consistent name, address and phone** everywhere they appear — the site,
   Google, Checkatrade, Yell, Facebook. Inconsistency actively hurts local
   ranking, so decide the exact format once.
5. **Trade directories and accreditation listings** — REFCOM and manufacturer
   "find an installer" pages carry real weight because they're authoritative and
   they link back to you.
6. **Photos.** The one thing this site can't generate, and the thing that
   converts a nervous homeowner faster than any amount of copy. Photograph
   every job: the outdoor unit sited neatly, tidy trunking, the finished room,
   the elevation from the street showing you can barely tell. Put them on the
   area pages and the Google profile.

   Until you have them, the price cards carry line drawings of each unit type
   (`lib/illustrations.mjs`) so a customer can see what they're choosing
   between. These are honest about what they are — drawings, not photographs of
   work we've done. Replace them as the real pictures come in: drop the image
   into `assets/`, then swap `${unitArt(item.art)}` in `priceCard()` for an
   `<img>`. Photograph landscape, roughly 3:2, and keep the file under 300 KB.

Add new areas by appending to `content/areas.json` — a page, sitemap entry and
footer link are generated automatically. Write real local detail for each one.

---

## The quote builder

`assets/quote.js`, mounted on every `.quote-builder` on the page (the home
page, the pricing page, every area page and the contact page).

The customer picks systems, extras and service plans, sees a running "from"
total, fills in their details, and sends the itemised list to you by **WhatsApp**
or **email** — or copies it to the clipboard.

Worth understanding: **there is no server and no form service.** The list is
built in the customer's browser and stored only in their own `localStorage`, and
it goes nowhere until they press a button, at which point it opens their own
WhatsApp or email app with the message already written. That means:

- Nothing to host, nothing to pay for, no GDPR processor agreement, no spam.
- **You only receive an enquiry if the customer completes the send** in their
  own app. If you later want submissions to land in a database or an inbox
  automatically, add a form service (Formspree, Web3Forms, Netlify Forms) and
  post `summaryText()` to it in `assets/quote.js` — that function already
  produces the whole formatted enquiry.

Deep links work: `/contact.html?item=split-35` opens the builder with that
system already added. The "Add to my quote" buttons on the pricing cards use it.

---

## Files

```
betterbecool/
├── build.mjs              # the generator — run this
├── serve.mjs              # local preview, behaves like Vercel
├── vercel.json            # deploy config — build, clean URLs, headers
├── content/               # everything you edit
│   ├── site.json          #   business details
│   ├── services.json      #   the priced catalogue
│   ├── areas.json         #   London areas + local notes
│   └── faq.json           #   FAQs (also become Google FAQ markup)
├── lib/
│   ├── templates.mjs      # layout, header, footer, quote builder, cards
│   ├── png.mjs            # PNG cropper for the generated images
│   ├── og-image.html      # the social preview, rendered to PNG at build time
│   └── icon-180.html      # the iOS home-screen icon, likewise
├── assets/                # copied to public/assets
│   ├── styles.css         # the whole design system
│   ├── quote.js           # the itemised quote builder
│   ├── favicon.svg, logo.svg
└── public/                # GENERATED — deploy this, don't edit it
```

Anything in `public/` is overwritten on every build. Edit `content/`, `assets/`
or `lib/` instead.

### Regenerating the images

`assets/og-image.png` and `assets/apple-touch-icon.png` are rendered from
`lib/*.html` with headless Chromium if it's installed, then cropped to size and
copied into `public/` like any other asset. Both are committed as source, which
matters: **Vercel's build machines have no Chromium**, so the build there keeps
the committed images rather than shipping a site without them. Set
`SKIP_IMAGES=1` to skip the step entirely.

Edit `lib/og-image.html`, rebuild on a machine with Chrome or Chromium, and
commit the regenerated PNG.

---

## A note on the planning-permission content

The FAQ says that comfort cooling for a home generally needs planning
permission, unlike an air source heat pump installed for heating, which has
permitted development rights. That reflects how most London boroughs treat it,
and being straight about it is a genuine differentiator — most competitor sites
quietly avoid the question.

It is not legal advice, boroughs differ, and the position can change. The copy
says so. Keep it that way, and check the current position with the relevant
council before telling a specific customer where they stand.
