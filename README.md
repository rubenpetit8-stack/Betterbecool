# Foreman — website

Foreman is an AI sales desk sold to trades: plumbers, heating engineers, air
conditioning and HVAC contractors. It answers enquiries, qualifies them, quotes
from the customer's own price book, chases until there is an answer, and books
the survey. Subscription software, £249–£999 a month.

This repository is the marketing site. No framework, no build dependencies, no
database and no server — `node build.mjs` turns the JSON in `content/` into a
finished site in `public/`, and `public/` is what deploys.

---

## The rule that matters

**The product is in early access. Nothing here may claim a capability that is
not built, and nothing may claim a result that has not been measured.**

`stage` in `content/site.json` is set to `early-access` and the copy is written
for it — the founding-customer framing is not a growth hack, it is what lets the
site be honest while the software is young. Flip it to `live` when it ships.

Two specific traps:

- **No outcome claims.** "Our customers win 32% more work" stays out until it is
  measured on real accounts and you can show the working. A sceptical trade will
  ask, and "it's just marketing" loses the deal.
- **No integrations you have not built.** `content/product.json` lists
  integration *categories* deliberately — "your job management system", not
  named products. Name one you have not tested and the demo ends there.

The three statistics on the home page (`product.problems`) are industry-shaped
framing, not measured claims about Foreman. Source them properly before launch
or soften them to "most" and "often".

---

## Before you launch

| What | Where | Why |
|---|---|---|
| Product name | `content/site.json` → `name` | **"Foreman" is a placeholder.** Appears in the logo, titles, schema and every CTA. Changing it is this line plus `assets/logo.svg`. |
| Phone / WhatsApp | `content/site.json` | Ofcom reserved drama numbers — they cannot reach a real person. A buyer evaluating £499/mo software *will* ring the number. |
| Email and domain | `content/site.json` | `foreman.build` is not registered. |
| Plan prices | `content/plans.json` | £249 / £499 / £999. The £499 anchor was the brief; the others exist to make it the obvious middle. |
| Founding offer | `content/plans.json` | "Half price for as long as you stay" is expensive to honour at scale. Decide deliberately. |
| DPA | — | See `/privacy`. The page makes commitments; a solicitor has to turn them into a document you can hand a cautious buyer. |

---

## Editing it

Everything a non-developer changes is JSON in `content/`.

| File | What's in it |
|---|---|
| `content/site.json` | Name, contact, stage, the trust points in the bar |
| `content/product.json` | **The six capabilities**, the problem framing, the approval promise |
| `content/plans.json` | Pricing, founding offer, and the ROI calculator's model |
| `content/segments.json` | Per-trade pages at `/for-<slug>` |
| `content/faq.json` | Objections — also becomes Google's FAQ markup |

Page wording lives in `build.mjs`; the header, footer and layout in
`lib/templates.mjs`.

```bash
node build.mjs          # writes public/
npm run serve           # build, then http://localhost:8080
npm run dev             # serve what's already built
```

Node 18 or newer. No `npm install` — there are no dependencies.

---

## The two things that sell it

**The thread on `/demo`.** A missed call at 8:42pm becoming a booked survey,
written as a text conversation. For this audience that is far more convincing
than a dashboard screenshot, because texting is how they actually experience
the product. It is hand-written in `build.mjs` (`thread()`) — keep it specific
and keep it boring. Realistic beats impressive.

**The ROI calculator on `/demo#roi`.** Four inputs a tradesperson knows off the
top of their head, one number out.

The model is deliberately pessimistic, and that is the point:

- Of enquiries never properly answered, only **60%** of the work you would have
  won counts as lost (`lostShare`) — some ring back, some were never real.
- Of that, Foreman recovers **half** (`recoveredShare`), converting at the same
  rate as enquiries already answered. In reality fast replies convert *better*.

On the defaults that gives roughly £52k leaking, £26k recoverable, 4.4× the cost
of the Crew plan. An earlier, looser model produced 25× — which is the kind of
number that makes a buyer stop believing the rest of the page. If you adjust
`content/plans.json`, keep it conservative for the same reason.

---

## Deploying — Vercel

`vercel.json` carries the whole configuration: build command, output directory,
clean URLs, cache and security headers. Nothing is set in the dashboard.

```bash
npx vercel --prod       # or push to main, which deploys itself
```

Set `domain` in `content/site.json` to the real domain once you have it — it
feeds canonical URLs, the sitemap and the share card, all of which must be
absolute.

### About the URLs

`cleanUrls` is on, so pages serve at `/pricing` and `/for-plumbers` rather than
`.html`. The generator emits links, canonicals and sitemap entries in that form
and `/pricing.html` permanently redirects, so there is one address per page.
`serve.mjs` mirrors that locally, which is why it exists instead of a plain file
server.

---

## Getting found

Be realistic: **SEO is not how you sell this.** Trades do not search for "AI
sales software" — they do not know it exists. The site is built to be the thing
you point people at, not the thing that finds them.

What actually works for this product, in order:

1. **Outbound, by trade.** The four `/for-<trade>` pages exist so a cold email
   can land on a page that describes that person's Tuesday, not a generic one.
2. **Trade-to-trade referral.** Plumbers buy what other plumbers rate. The
   founding-customer programme is a referral engine if you treat it as one.
3. **Merchant and wholesaler partnerships.** Plumb Center, BSS, Wolseley branch
   counters reach more trades in a week than any ad campaign.
4. **Trade associations and shows** — CIPHE, the F-Gas and REFCOM lists,
   InstallerSHOW.
5. Search, eventually, on cost-shaped queries once there is something to rank.

The `/demo` page is the asset all of those point at. Send the link, let the
thread do the work.

---

## Files

```
foreman/
├── build.mjs              # the generator — run this
├── serve.mjs              # local preview, behaves like Vercel
├── vercel.json            # deploy config
├── content/               # everything you edit
│   ├── site.json
│   ├── product.json
│   ├── plans.json
│   ├── segments.json
│   └── faq.json
├── lib/
│   ├── templates.mjs      # layout, header, footer, FAQ, CTA band
│   ├── illustrations.mjs  # line drawings + the schematic backdrop
│   ├── png.mjs            # PNG cropper for generated images
│   ├── og-image.html      # the share card, rendered to PNG at build time
│   └── icon-180.html      # the iOS icon, likewise
├── assets/
│   ├── styles.css         # the whole design system
│   ├── roi.js             # the calculator
│   └── logo.svg, favicon.svg, og-image.png, apple-touch-icon.png
└── public/                # GENERATED — deploy this, don't edit it
```

### Regenerating the images

`assets/og-image.png` and `assets/apple-touch-icon.png` render from `lib/*.html`
with headless Chromium, then get cropped to size. Both are committed as source,
which matters: **Vercel's builders have no Chromium**, so the build there keeps
the committed images rather than shipping without them. `SKIP_IMAGES=1` skips
the step.

---

## History

This repository previously held two earlier businesses — an air conditioning
installation company, then a lead-generation marketplace. Both are in the git
history if the copy or the London-specific research is ever useful. The design
system, the line drawings and the schematic backdrops carried across all three.
