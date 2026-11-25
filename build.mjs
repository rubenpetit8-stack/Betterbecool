#!/usr/bin/env node
/* Foreman — static site generator.
 *
 *   node build.mjs
 *
 * Reads content/*.json, writes a complete static site into public/.
 * No dependencies, no npm install. Node 18+.
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  layout, esc, money, icon, pretty, ctaBand, trustBar,
  faqSection, faqLd, unitArt, schematicBackdrop
} from "./lib/templates.mjs";
import { cropPngHeight, pngSize } from "./lib/png.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");
const read = (f) => JSON.parse(readFileSync(join(root, "content", f), "utf8"));

const site = read("site.json");
const product = read("product.json");
const planData = read("plans.json");
const { segments } = read("segments.json");
const { faqs } = read("faq.json");
const plans = planData.plans;

const write = (rel, html) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const pages = [];
const page = (rel, opts) => {
  write(rel, layout({ site, segments, plans, path: "/" + rel, ...opts }));
  pages.push({ rel, priority: opts.priority ?? 0.7 });
};

/* ------------------------------------------------------------ components */

const planCard = (p) => `
<article class="card price-card plan${p.popular ? " is-popular" : ""}">
  ${p.popular ? '<span class="tag">Most take this</span>' : ""}
  <h3>${esc(p.name)}</h3>
  <p class="spec">${esc(p.spec)}</p>
  <div class="price">
    <b>${money(p.price)}</b><span class="per">${esc(p.unit)}, excl. VAT</span>
  </div>
  <ul class="ticks">${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  <a class="btn btn--brand btn--sm" href="${esc(pretty(site.navCta.href))}">${esc(p.cta)}</a>
</article>`;

/* The demo that matters. A text thread is what this product looks like from the
   customer's side and from the trade's phone — far more convincing than a
   screenshot of a dashboard nobody opens. */
const thread = () => `
<div class="thread" role="img" aria-label="A text conversation: a missed call at 8:42pm turns into an automatic reply, qualifying questions, an itemised quote the same evening, and a follow-up on Saturday that wins the job.">
  <div class="thread-meta">Tuesday, 8:42pm — you are on another job</div>
  <div class="msg msg--event">Missed call from 07700 900482</div>
  <div class="msg msg--out">
    <span class="msg-who">Foreman → customer · 8:42pm</span>
    Hi, sorry we missed you — this is Dave's office line. We install air conditioning across south London. Which rooms were you thinking of, and whereabouts are you?
  </div>
  <div class="msg msg--in">
    <span class="msg-who">Customer · 8:51pm</span>
    Hi! Two bedrooms upstairs, we're in SW4. Victorian terrace. How much roughly?
  </div>
  <div class="msg msg--out">
    <span class="msg-who">Foreman → customer · 8:51pm</span>
    Two bedrooms off one outdoor unit is usually £3,400–£3,900 fitted including VAT, depending on the pipe run. Do you own the house, and is there a rear extension the outdoor unit could sit above?
  </div>
  <div class="msg msg--in">
    <span class="msg-who">Customer · 8:55pm</span>
    Yes we own it, and there's a kitchen extension at the back.
  </div>
  <div class="msg msg--event">Foreman texts you: “SW4 twin multi-split. Owner, rear extension, budget OK. Survey Thu 2pm or Fri 9am? Reply 1 or 2.”</div>
  <div class="msg msg--out">
    <span class="msg-who">Foreman → customer · 9:04pm</span>
    Great — here's a written quote: <span class="link-ish">dave-aircon.co.uk/q/8841</span>. Dave can survey Thursday at 2pm or Friday at 9am, whichever suits.
  </div>
  <div class="thread-meta">Saturday — still no reply</div>
  <div class="msg msg--out">
    <span class="msg-who">Foreman → customer · Sat 10:15am</span>
    Morning! Just checking the quote reached you on Tuesday. Is it the price, the timing, or have you gone with someone else? Happy either way — it just helps us know.
  </div>
  <div class="msg msg--in">
    <span class="msg-who">Customer · Sat 10:40am</span>
    Sorry, meant to reply! Thursday 2pm works.
  </div>
  <div class="msg msg--won">Survey booked. You never picked up your phone.</div>
</div>`;

/* ============================================================ home ======= */

const homeBody = `
<section class="hero">
  ${schematicBackdrop()}
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">For plumbers, heating engineers and AC installers</span>
      <h1>The AI sales team for trades</h1>
      <p class="lede">${esc(site.description)}</p>
      <ul class="hero-points">
        <li>${icon("check", 18)}<span>Replies to every enquiry in under a minute, including Sunday night</span></li>
        <li>${icon("check", 18)}<span>Quotes from your price book — your rates, your margins, your letterhead</span></li>
        <li>${icon("check", 18)}<span>Chases the quote until you get a yes or a no</span></li>
        <li>${icon("check", 18)}<span>You approve every word, until you decide you don't need to</span></li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--primary" href="${esc(pretty(site.navCta.href))}">Book a demo</a>
        <a class="btn btn--ghost" href="/demo#roi">What is silence costing you?</a>
      </div>
      <p class="small muted" style="margin-top:14px;max-width:52ch">${esc(site.stageNotice)}</p>
    </div>
    <div class="hero-card">
      <h2>The job you lost last Tuesday</h2>
      <p class="small muted">They rang at 8:42pm. You were under a floor. They rang someone else at 8:49pm.</p>
      <div class="mini-thread">
        <div class="msg msg--event">Missed call · 8:42pm</div>
        <div class="msg msg--out"><span class="msg-who">Foreman · 8:42pm</span>Sorry we missed you — which rooms were you thinking of, and whereabouts are you?</div>
        <div class="msg msg--in"><span class="msg-who">Customer · 8:51pm</span>Two bedrooms, SW4. How much roughly?</div>
      </div>
      <a class="btn btn--brand btn--block" style="margin-top:16px" href="/demo">See the whole conversation</a>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:30px">
      <span class="eyebrow">The problem</span>
      <h2>${esc(product.problemHeading)}</h2>
      <p class="lede">${esc(product.problemLede)}</p>
    </div>
    <div class="grid grid--3">
      ${product.problems.map((p) => `
      <div class="stat-card">
        <b>${esc(p.stat)}</b>
        <p class="stat-label">${esc(p.label)}</p>
        <p class="small muted" style="margin:0">${esc(p.note)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="section section--tint" id="does">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:30px">
      <span class="eyebrow">What it does</span>
      <h2>${esc(product.doesHeading)}</h2>
      <p class="lede">${esc(product.doesLede)}</p>
    </div>
    <div class="grid grid--2">
      ${product.capabilities.map((c, i) => `
      <article class="card cap-card">
        <figure>${unitArt(c.art)}</figure>
        <h3><i>${i + 1}</i> ${esc(c.title)}</h3>
        <p>${esc(c.body)}</p>
        <ul class="ticks small">${c.detail.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
      </article>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap grid grid--2" style="gap:40px;align-items:start">
    <div>
      <span class="eyebrow">The thing everyone asks first</span>
      <h2>${esc(product.approvalHeading)}</h2>
      <p class="lede">${esc(product.approvalBody)}</p>
      <p style="margin-top:18px"><a class="btn btn--ghost btn--sm" href="/#faq">The rest of the awkward questions →</a></p>
    </div>
    <div>
      <h2>${esc(product.integrationsHeading)}</h2>
      <p class="lede">${esc(product.integrationsBody)}</p>
      <ul class="ticks" style="margin-top:14px">${product.integrations.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Your trade</span>
      <h2>It works differently depending on what you fit</h2>
      <p class="lede">An emergency plumber and a commercial HVAC contractor lose work in completely different places. Pick yours.</p>
    </div>
    <div class="grid grid--4">
      ${segments.map((x) => `
      <a class="card card--link card--flag" href="/for-${esc(x.slug)}">
        <h3>${esc(x.name)}</h3>
        <p class="small muted">${esc(x.pain)}</p>
        <p class="small" style="margin:0"><strong>How it helps →</strong></p>
      </a>`).join("")}
    </div>
  </div>
</section>

${faqSection(faqs, {
  eyebrow: "Straight answers",
  heading: "What trades ask before they buy",
  lede: "Starting with the one everybody asks, which is whether it will embarrass you in front of a customer."
})}

${ctaBand(site, {
  heading: "See it answer a real enquiry",
  text: "Twenty minutes on a call, with your own numbers and your own price list. If it would not pay for itself we will say so."
})}`;

page("index.html", {
  title: `${site.name} — ${site.tagline}`,
  description: "Foreman answers every enquiry in under a minute, quotes from your own price book, and chases until you get an answer. An AI sales team for plumbers, heating engineers and air conditioning installers.",
  body: homeBody,
  jsonLd: [faqLd(faqs)],
  priority: 1.0
});

/* ========================================================== pricing ====== */

page("pricing.html", {
  title: `Pricing | ${site.name}`,
  description: "Foreman pricing: £249 a month for sole traders, £499 for a crew of up to five, £999 for multiple teams. Monthly rolling, no setup fee, founding customers half price.",
  priority: 0.9,
  body: `
<div class="wrap breadcrumb"><a href="/">Home</a> → Pricing</div>

<section class="section" style="padding-top:26px">
  <div class="wrap">
    <div class="narrow">
      <span class="eyebrow">Pricing</span>
      <h1>${esc(planData.heading)}</h1>
      <p class="lede">${esc(planData.lede)}</p>
      <div class="notice" style="margin:22px 0">
        <p><strong>${esc(planData.foundingOffer.headline)}</strong></p>
        <p class="small" style="margin:0">${esc(planData.foundingOffer.body)}</p>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="grid grid--3">${plans.map(planCard).join("")}</div>
    <p class="small muted" style="margin-top:20px">${esc(planData.note)}</p>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap narrow">
    <span class="eyebrow">The honest bit</span>
    <h2>${esc(planData.guaranteeHeading)}</h2>
    <p class="lede">${esc(planData.guaranteeBody)}</p>
    <p style="margin-top:20px"><a class="btn btn--primary" href="/demo#roi">Work out whether it would pay for itself →</a></p>
  </div>
</section>

${trustBar(site)}

${faqSection(faqs.slice(-3), {
  eyebrow: "On price",
  heading: "Why it costs what it costs",
  lede: "The three questions that come up once people see the number."
})}

${ctaBand(site, {
  heading: "Twenty minutes, your numbers",
  text: "Bring your price list and a rough idea of your enquiry volume. We will tell you straight whether this is worth it for you."
})}`
});

/* ============================================================= demo ====== */

page("demo.html", {
  title: `See it work | ${site.name}`,
  description: "Watch Foreman turn a missed call into a booked survey, and work out what unanswered enquiries are costing your business.",
  priority: 0.9,
  body: `
<div class="wrap breadcrumb"><a href="/">Home</a> → See it work</div>

<section class="section" style="padding-top:26px">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:28px">
      <span class="eyebrow">A real enquiry, end to end</span>
      <h1>A missed call on Tuesday night</h1>
      <p class="lede">This is the whole product. A call you could not answer becomes a qualified job with a survey in the diary, and the only thing you did was reply “1” to a text.</p>
    </div>
    ${thread()}
  </div>
</section>

<section class="section section--tint" id="roi">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Your numbers</span>
      <h2>${esc(planData.roi.heading)}</h2>
      <p class="lede">${esc(planData.roi.lede)}</p>
    </div>
    <div class="roi" data-roi-root>
      <div class="roi-controls" data-roi-controls></div>
      <div class="roi-result">
        <span class="roi-label">Work you are losing a year</span>
        <span class="roi-figure" data-roi-lost>—</span>
        <p class="small muted">About <strong data-roi-lostjobs>—</strong> a year that never got a proper reply.</p>
        <hr>
        <span class="roi-label">What Foreman could realistically recover</span>
        <span class="roi-figure roi-figure--good" data-roi-recovered>—</span>
        <p class="small muted">Against <strong data-roi-cost>—</strong> a year on the Crew plan.</p>
        <p class="roi-verdict" data-roi-verdict></p>
        <button type="button" class="btn btn--ghost btn--sm" data-roi-reset>Reset</button>
      </div>
    </div>
    <p class="small muted" style="margin-top:16px;max-width:72ch">${esc(planData.roi.assumptions.note)} Nothing you type here is sent anywhere.</p>
  </div>
</section>

<section class="section" id="book">
  <div class="wrap grid grid--2" style="gap:40px;align-items:start">
    <div>
      <span class="eyebrow">Book a demo</span>
      <h2>Twenty minutes, on your numbers</h2>
      <p class="lede">We set Foreman up against your actual price list and run a real enquiry through it while you watch. If it would not pay for itself on your volumes, we will tell you on the call rather than sell you something.</p>
      <div class="contact-methods" style="margin-top:22px;grid-template-columns:1fr">
        <a class="contact-method" href="mailto:${esc(site.email)}?subject=${encodeURIComponent("Foreman demo")}">
          <span class="ico">${icon("mail", 22)}</span>
          <span><b>${esc(site.email)}</b><span class="sub">Tell us your trade and roughly how many enquiries a week</span></span>
        </a>
        <a class="contact-method" href="tel:${esc(site.phoneHref)}">
          <span class="ico">${icon("phone", 22)}</span>
          <span><b>${esc(site.phone)}</b><span class="sub">${esc(site.hours[0].days)} ${esc(site.hours[0].open)}–${esc(site.hours[0].close)}</span></span>
        </a>
        <a class="contact-method" href="https://wa.me/${esc(site.whatsapp)}">
          <span class="ico">${icon("whatsapp", 22)}</span>
          <span><b>WhatsApp</b><span class="sub">Easiest if you are on site</span></span>
        </a>
      </div>
    </div>
    <div>
      <h2>Bring these and it is quicker</h2>
      <ul class="ticks">
        <li>Your price list, in whatever state it is in</li>
        <li>Roughly how many enquiries you get a week</li>
        <li>What a typical job is worth to you</li>
        <li>An honest guess at how many you never get back to</li>
      </ul>
      <div class="notice" style="margin-top:20px">
        <p class="small" style="margin:0"><strong>Early access.</strong> ${esc(site.stageNotice)}</p>
      </div>
    </div>
  </div>
</section>`
});

/* ========================================================= segments ====== */

for (const seg of segments) {
  page(`for-${seg.slug}.html`, {
    title: `${site.name} for ${seg.name} — ${site.tagline}`,
    description: seg.intro.slice(0, 155),
    priority: 0.8,
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.domain + "/" },
        { "@type": "ListItem", position: 2, name: seg.nav, item: `${site.domain}/for-${seg.slug}` }
      ]
    }],
    body: `
<div class="wrap breadcrumb"><a href="/">Home</a> → ${esc(seg.nav)}</div>

<section class="hero" style="padding-top:30px">
  ${schematicBackdrop()}
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${esc(seg.nav)}</span>
      <h1>${esc(site.name)} for ${esc(seg.name.toLowerCase())}</h1>
      <p class="lede">${esc(seg.intro)}</p>
      <div class="btn-row" style="margin-top:18px">
        <a class="btn btn--primary" href="${esc(pretty(site.navCta.href))}">Book a demo</a>
        <a class="btn btn--ghost" href="/demo#roi">What is it costing you?</a>
      </div>
    </div>
    <div class="hero-card">
      <h2>“${esc(seg.pain)}”</h2>
      <p class="small muted">Meanwhile the enquiry goes to whoever picks up. Foreman covers exactly that gap.</p>
      <ul class="ticks small" style="margin:16px 0">
        ${seg.jobs.map((j) => `<li>${esc(j)}</li>`).join("")}
      </ul>
      <a class="btn btn--brand btn--block" href="/demo">See it handle one</a>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Where the work leaks</span>
      <h2>Three things that cost ${esc(seg.name.toLowerCase())} money</h2>
    </div>
    <div class="grid grid--3">
      ${seg.notes.map((n) => `
      <div class="card card--flag">
        <h3 style="font-size:1.02rem">${esc(n.title)}</h3>
        <p class="small" style="margin:0">${esc(n.body)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">The same six jobs</span>
      <h2>What it does for you specifically</h2>
      <p class="lede">The capabilities are the same whatever you fit. What changes is the questions it asks and the price book it quotes from.</p>
    </div>
    <div class="grid grid--3">
      ${product.capabilities.map((c) => `
      <div class="card">
        <h3 style="font-size:1rem">${esc(c.title)}</h3>
        <p class="small muted" style="margin:0">${esc(c.body)}</p>
      </div>`).join("")}
    </div>
    <p style="margin-top:22px"><a class="btn btn--ghost" href="/pricing">See what it costs →</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <h2>Other trades</h2>
    <ul class="pill-list" style="margin-top:14px">
      ${segments.filter((x) => x.slug !== seg.slug).map((x) => `<li><a href="/for-${esc(x.slug)}">${esc(x.nav)}</a></li>`).join("")}
    </ul>
  </div>
</section>

${ctaBand(site, {
  heading: "See it answer one of your enquiries",
  text: "Twenty minutes, your price list, a real enquiry run end to end while you watch."
})}`
  });
}

/* ========================================================== privacy ====== */

page("privacy.html", {
  title: `Privacy | ${site.name}`,
  description: "What Foreman does with your data and your customers' data: who can see it, what it is used for, and what happens if you leave.",
  priority: 0.3,
  body: `
<div class="wrap breadcrumb"><a href="/">Home</a> → Privacy</div>
<section class="section" style="padding-top:26px">
  <div class="wrap narrow">
    <span class="eyebrow">Plain English</span>
    <h1>Your data, and your customers' data</h1>
    <p class="lede">You would be trusting us with your price book and your customer list — the two most commercially sensitive things you own. So here is exactly what happens to them.</p>

    <h2>We never train on your data</h2>
    <p>Your customer records, your conversations and your prices are not used to train any model, ours or anyone else's. They are not shared with other customers and they are never sold. If that is not in the contract you are offered, do not sign it — with us or with anybody else.</p>

    <h2>Your customers' details</h2>
    <p>When Foreman talks to your customer on your behalf, that conversation and those contact details belong to you, exactly as they would if your office manager had taken the call. We process them to run the service for you and for nothing else. You remain the data controller; we are your processor.</p>

    <h2>What we hold about you</h2>
    <p>Your account details, your price book, your enquiry and quote history, and the usage data we need to keep the service running and bill you correctly.</p>

    <h2>If you leave</h2>
    <p>We export everything — customers, conversations, quotes, price book — in a format you can actually use, and delete our copy within 30 days. There is no exit fee and we will not hold your data hostage to keep you.</p>

    <h2>Sub-processors</h2>
    <p>We use third parties for hosting, messaging and the language models themselves. We will name them on request and tell you in advance if that list changes.</p>

    <h2>Getting in touch</h2>
    <p>Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> for a copy of what we hold, a correction, or deletion. If we have not put something right you can complain to the Information Commissioner's Office at ico.org.uk.</p>

    <div class="notice" style="margin-top:28px">
      <p class="small" style="margin:0"><strong>Before launch:</strong> this page states commitments — no training on customer data, processor status, 30-day deletion, named sub-processors. Have a solicitor turn them into a DPA you can hand to a cautious buyer, because the good ones will ask for it.</p>
    </div>
  </div>
</section>`
});

/* ============================================================== 404 ====== */

write("404.html", layout({
  site, segments, plans, path: "/404.html", noindex: true,
  title: `Page not found | ${site.name}`,
  description: "That page doesn't exist.",
  body: `
<section class="section">
  <div class="wrap narrow center">
    <h1>That page has moved on</h1>
    <p class="lede">Here's where most people were heading.</p>
    <div class="btn-row" style="justify-content:center;margin-top:22px">
      <a class="btn btn--primary" href="/demo">See it work</a>
      <a class="btn btn--ghost" href="/pricing">Pricing</a>
      <a class="btn btn--ghost" href="/">Home</a>
    </div>
  </div>
</section>`
}));

/* =========================================== social preview image ======== */

const shots = [
  { html: "og-image.html", png: "og-image.png", w: 1200, h: 630 },
  { html: "icon-180.html", png: "apple-touch-icon.png", w: 180, h: 180 }
];

const chromium = ["/opt/pw-browsers/chromium", "/usr/bin/chromium",
  "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].find((p) => existsSync(p));

const shoot = (args) => execFileSync(chromium, [
  "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  "--force-device-scale-factor=1", "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=4000", ...args
], { stdio: "ignore" });

const HEADROOM = 260;

if (chromium && !process.env.SKIP_IMAGES) {
  for (const s of shots) {
    const src = join(root, "lib", s.html);
    const dest = join(root, "assets", s.png);
    if (!existsSync(src)) continue;
    try {
      shoot([`--window-size=${s.w},${s.h + HEADROOM}`, `--screenshot=${dest}`, "file://" + src]);
      cropPngHeight(dest, s.h);
      const got = pngSize(dest);
      if (got.w !== s.w || got.h !== s.h) {
        console.warn(`  ! ${s.png} is ${got.w}x${got.h}, expected ${s.w}x${s.h}`);
      }
    } catch (e) {
      console.warn(`  ! could not render assets/${s.png}: ${e.message}`);
    }
  }
}

/* =========================================================== assets ====== */

mkdirSync(join(out, "assets"), { recursive: true });
cpSync(join(root, "assets"), join(out, "assets"), { recursive: true });

// The calculator's numbers live in content, not in the script.
writeFileSync(join(out, "assets", "roi-config.js"),
  "/* Generated by build.mjs — edit content/plans.json instead. */\n" +
  "window.ROI_CONFIG = " + JSON.stringify({
    defaults: planData.roi.defaults,
    assumptions: {
      lostShare: planData.roi.assumptions.lostShare,
      recoveredShare: planData.roi.assumptions.recoveredShare
    },
    planPrice: (plans.find((p) => p.popular) || plans[0]).price
  }) + ";\n");

/* ================================================ robots & sitemap ======= */

const today = new Date().toISOString().slice(0, 10);

writeFileSync(join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map((p) =>
    `  <url><loc>${site.domain}${pretty("/" + p.rel)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${p.priority.toFixed(1)}</priority></url>`
  ).join("\n") +
  `\n</urlset>\n`);

writeFileSync(join(out, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

console.log(`Built ${pages.length + 1} pages into public/`);
for (const p of pages) console.log("  · " + p.rel);
