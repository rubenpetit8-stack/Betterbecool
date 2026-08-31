#!/usr/bin/env node
/* Better Be Cool — static site generator.
 *
 *   node build.mjs
 *
 * Reads content/*.json, writes a complete static site into public/.
 * No dependencies, no npm install. Node 18+.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  layout, esc, money, icon, pretty, quoteBuilder, ctaBand, trustBar, housePlacementDiagram,
  faqSection, faqLd, priceCard, extrasTable
} from "./lib/templates.mjs";
import { cropPngHeight, pngSize } from "./lib/png.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");
const read = (f) => JSON.parse(readFileSync(join(root, "content", f), "utf8"));

const site = read("site.json");
const services = read("services.json");
const { areas, alsoCover } = read("areas.json");
const { faqs } = read("faq.json");

const allItems = services.groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g })));
const itemById = Object.fromEntries(allItems.map((i) => [i.id, i]));
const popular = allItems.filter((i) => i.popular);

const write = (rel, html) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return rel;
};

const pages = [];
const page = (rel, opts) => {
  write(rel, layout({ site, areas, path: "/" + rel, ...opts }));
  pages.push({ rel, priority: opts.priority ?? 0.7 });
};

/* =========================================================== home ========= */

const homeBody = `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${esc(site.address.locality)} · Greater London &amp; the M25</span>
      <h1>Air conditioning installed properly, anywhere in London</h1>
      <p class="lede">${esc(site.description)}</p>
      <ul class="hero-points">
        <li>${icon("check", 18)}<span>Prices published on this site — pick what you want and see the cost before you speak to anyone</span></li>
        <li>${icon("check", 18)}<span>Free survey, then a fixed written price that doesn't move</span></li>
        <li>${icon("check", 18)}<span>F-Gas certified engineers and our own Part P electricians</span></li>
        <li>${icon("check", 18)}<span>Straight advice on planning permission before you spend anything</span></li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--primary" href="#build">Build your quote</a>
        <a class="btn btn--ghost" href="tel:${esc(site.phoneHref)}">${icon("phone")} ${esc(site.phone)}</a>
        <a class="btn btn--ghost" href="https://wa.me/${esc(site.whatsapp)}">${icon("whatsapp")} WhatsApp</a>
      </div>
    </div>

    <div class="hero-card">
      <h2>What people actually pay</h2>
      <p class="small muted">Fitted, including VAT. Starting prices for a standard installation.</p>
      <table style="min-width:0">
        <tbody>
          ${popular.slice(0, 3).map((i) => `
          <tr>
            <td style="padding-left:0"><strong>${esc(i.name)}</strong><span class="note">${esc(i.spec)}</span></td>
            <td class="num" style="padding-right:0">from ${money(i.from)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      <a class="btn btn--brand btn--block" style="margin-top:16px" href="/pricing">See every option and price</a>
      <p class="small muted" style="margin:12px 0 0">${esc(services.guideNote)}</p>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:28px">
      <span class="eyebrow">What you can buy</span>
      <h2>Four ways to cool a London property</h2>
      <p class="lede">Every option below both cools in summer and heats in winter. Which one is right for you comes down to how many rooms, and what you're allowed to put outside.</p>
    </div>
    <div class="grid grid--4">
      ${services.groups.map((g) => {
        const cheapest = g.items.filter((i) => !i.poa).sort((a, b) => a.from - b.from)[0];
        return `
      <a class="card card--link card--flag" href="/pricing#${esc(g.id)}">
        <h3>${esc(g.title)}</h3>
        <p class="small muted">${esc(g.blurb.split(". ")[0])}.</p>
        <p class="small"><strong>${cheapest ? "from " + money(cheapest.from) : "Priced on survey"}</strong>${g.business ? " excl. VAT" : ""}</p>
      </a>`;
      }).join("")}
    </div>
  </div>
</section>

<section class="section section--tint" id="popular">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:28px">
      <span class="eyebrow">Guide prices</span>
      <h2>The three systems we fit most</h2>
      <p class="lede">${esc(services.vatNote)} ${esc(services.guideNote)}</p>
    </div>
    <div class="grid grid--3">
      ${popular.slice(0, 3).map((i) => priceCard(i, i.group)).join("")}
    </div>
    <p style="margin-top:24px"><a class="btn btn--ghost" href="/pricing">Every system, extra and service plan, itemised →</a></p>
  </div>
</section>

<section class="section" id="outdoor-unit">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">The question everyone asks first</span>
      <h2>Where does the outdoor unit go?</h2>
      <p class="lede">Every system needs one box outside. Where it can go decides what you can have fitted, what it costs, and whether you need planning permission — so we settle it at the free survey, before you commit to anything.</p>
    </div>
    <figure class="diagram" style="margin:0">
      ${housePlacementDiagram()}
      <figcaption>A typical London terrace. The condenser sits on the rear wall above the extension roof, with short runs up to the bedrooms.</figcaption>
    </figure>
    <div class="grid grid--3" style="margin-top:22px">
      <div class="card card--flag"><h3 style="font-size:1rem">Rear elevation, nearly always</h3><p class="small" style="margin:0">Above the kitchen extension it is invisible from the street, and the pipe run to the bedrooms stays short — which keeps both the price and the running cost down.</p></div>
      <div class="card card--flag"><h3 style="font-size:1rem">Ground level where there's room</h3><p class="small" style="margin:0">On anti-vibration feet behind planting it is quieter to live with than a unit fixed to a wall, easier to service, and nothing is drilled through a finished elevation.</p></div>
      <div class="card card--flag"><h3 style="font-size:1rem">One box beats four</h3><p class="small" style="margin:0">A multi-split runs several rooms from a single condenser. In a conservation area that is often the difference between an application succeeding and being refused.</p></div>
    </div>
    <p style="margin-top:22px"><a class="btn btn--ghost btn--sm" href="/#faq">Read the planning answer in full →</a></p>
  </div>
</section>

<section class="section" id="process">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:28px">
      <span class="eyebrow">How it works</span>
      <h2>From first message to a working system</h2>
      <p class="lede">Most single-room installations are done within two weeks of your first call, and finished inside a day.</p>
    </div>
    <ol class="steps">
      <li><h3>You tell us the rooms</h3><p>Build a list on this site, send it on WhatsApp, or just call. Two minutes is enough.</p></li>
      <li><h3>Free survey</h3><p>We measure the rooms, calculate the heat load properly, agree where the outdoor unit goes and check your electrics.</p></li>
      <li><h3>Fixed written quote</h3><p>Itemised, valid for 60 days, with the planning position spelled out. No pressure and no charge if you walk away.</p></li>
      <li><h3>Installation</h3><p>Two engineers, floors covered, one day for most single systems. Pressure tested, vacuumed and commissioned before we leave.</p></li>
      <li><h3>Handover and aftercare</h3><p>Certificates, warranty registered in your name, controls explained, and a reminder when the first service is due.</p></li>
    </ol>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap grid grid--2" style="align-items:start;gap:40px">
    <div>
      <span class="eyebrow">No surprises</span>
      <h2>What's in every installation price</h2>
      <p class="lede">This is the part cheap quotes leave out, then charge for on the day.</p>
      <ul class="ticks">${services.includedInEvery.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>
    <div>
      <span class="eyebrow">Why us</span>
      <h2>Credentials you can check</h2>
      <div class="grid" style="gap:12px">
        ${site.credentials.map((c) => `
        <div class="card" style="padding:16px">
          <h3 style="font-size:1rem;margin-bottom:.2em">${icon("shield", 16)} ${esc(c.label)}</h3>
          <p class="small muted" style="margin:0">${esc(c.detail)}</p>
        </div>`).join("")}
      </div>
      <p class="small muted" style="margin-top:14px">We fit ${site.brands.slice(0, -1).map(esc).join(", ")} and ${esc(site.brands.slice(-1)[0])}, and we'll tell you which suits your property rather than which we have in the van.</p>
    </div>
  </div>
</section>

<section class="section" id="build">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Itemised quote builder</span>
      <h2>Pick exactly what you want</h2>
      <p class="lede">Tick the rooms and any extras, see the running cost, then send the list straight to us on WhatsApp or by email. Nothing leaves your browser until you press send.</p>
    </div>
    ${quoteBuilder()}
  </div>
</section>

<section class="section section--tint" id="areas">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Where we work</span>
      <h2>All of Greater London</h2>
      <p class="lede">Free surveys inside the M25. These are the areas we work in most — each one has its own notes on property types, planning and where the outdoor unit usually goes.</p>
    </div>
    <div class="grid grid--3">
      ${areas.slice(0, 6).map((a) => `
      <a class="card card--link" href="/areas/${esc(a.slug)}">
        <h3>${icon("pin", 16)} ${esc(a.name)}</h3>
        <div class="postcodes">${a.postcodes.map((p) => `<span>${esc(p)}</span>`).join("")}</div>
        <p class="small muted">${esc(a.property)}</p>
      </a>`).join("")}
    </div>
    <p style="margin-top:22px"><a class="btn btn--ghost" href="/areas">All areas we cover →</a></p>
  </div>
</section>

${faqSection(faqs)}
${ctaBand(site)}`;

page("index.html", {
  title: `Air Conditioning Installation London | ${site.name}`,
  description: "F-Gas certified air conditioning installation across London. Guide prices published up front, free survey, fixed written quote. Single rooms from £1,895 fitted.",
  body: homeBody,
  jsonLd: [faqLd(faqs)],
  priority: 1.0
});

/* ======================================================== pricing ========= */

const offerCatalogLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Air conditioning installation",
  provider: { "@id": site.domain + "/#business" },
  areaServed: { "@type": "City", name: "London" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Air conditioning installation options",
    itemListElement: services.groups.map((g) => ({
      "@type": "OfferCatalog",
      name: g.title,
      itemListElement: g.items.map((i) => ({
        "@type": "Offer",
        name: i.name,
        description: i.spec || "",
        ...(i.poa ? {} : {
          price: String(i.from),
          priceCurrency: "GBP",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: String(i.from),
            priceCurrency: "GBP",
            minPrice: String(i.from),
            valueAddedTaxIncluded: !g.business
          }
        }),
        availability: "https://schema.org/InStock",
        url: site.domain + "/contact?item=" + i.id
      }))
    }))
  }
};

const pricingBody = `
<div class="wrap breadcrumb"><a href="/">Home</a> → What it costs</div>

<section class="section" style="padding-top:26px">
  <div class="wrap">
    <div class="narrow">
      <span class="eyebrow">Itemised, in public</span>
      <h1>What air conditioning costs in London</h1>
      <p class="lede">Every system, every optional extra and every service plan, with a starting price against it. Most installers make you ring up to find out. We'd rather you knew before you called.</p>
      <div class="notice" style="margin:22px 0">
        <p><strong>${esc(services.vatNote)}</strong></p>
        <p class="small">${esc(services.guideNote)}</p>
      </div>
      <div class="btn-row">
        <a class="btn btn--primary" href="/contact">Build an itemised quote</a>
        <a class="btn btn--ghost" href="tel:${esc(site.phoneHref)}">${icon("phone")} ${esc(site.phone)}</a>
      </div>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    ${services.groups.map((g) => `
    <div class="price-group" id="${esc(g.id)}">
      <header>
        <h2>${esc(g.title)}</h2>
        <p class="lede">${esc(g.blurb)}</p>
      </header>
      <div class="grid grid--3">${g.items.map((i) => priceCard(i, g)).join("")}</div>
    </div>`).join("")}
  </div>
</section>

<section class="section section--tint" id="included">
  <div class="wrap narrow">
    <span class="eyebrow">Always included</span>
    <h2>What every installation price covers</h2>
    <p class="lede">If a cheaper quote doesn't list these, it isn't cheaper.</p>
    <ul class="ticks" style="margin-top:18px">${services.includedInEvery.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  </div>
</section>

<section class="section" id="extras">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:22px">
      <span class="eyebrow">Optional extras</span>
      <h2>The things that can push a price up</h2>
      <p class="lede">Not everyone needs any of these. We confirm which apply to you at the survey — before you commit, not on the day.</p>
    </div>
    ${extrasTable(services.extras, { note: "Prices include VAT for homes. Business work is quoted excluding VAT." })}
  </div>
</section>

<section class="section section--tint" id="care">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:22px">
      <span class="eyebrow">Aftercare</span>
      <h2>Servicing, warranty and repairs</h2>
      <p class="lede">An annual service keeps the manufacturer warranty valid and stops the two faults that account for most callouts: a blocked drain and a filthy filter.</p>
    </div>
    ${extrasTable(services.care, { note: "Business systems above 5 tonnes CO₂ equivalent must be leak tested by law. We track your dates and remind you." })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Build it yourself</span>
      <h2>Put your own list together</h2>
      <p class="lede">Add the rooms you want done, see the running total, and send the itemised list to us however you prefer.</p>
    </div>
    ${quoteBuilder()}
  </div>
</section>

${ctaBand(site, {
  heading: "Not sure which system you need?",
  text: "That's what the free survey is for. Tell us the rooms and we'll tell you honestly what they need — including when the answer is that you don't need as much as you thought."
})}`;

page("pricing.html", {
  title: `Air Conditioning Prices London — Itemised | ${site.name}`,
  description: "Every air conditioning option priced: single-room splits from £1,895 fitted, multi-room from £3,450, ducted from £4,500, plus extras and service plans. Including VAT.",
  body: pricingBody,
  jsonLd: [offerCatalogLd],
  priority: 0.9
});

/* ========================================================== areas ========= */

const areasBody = `
<div class="wrap breadcrumb"><a href="/">Home</a> → Areas we cover</div>

<section class="section" style="padding-top:26px">
  <div class="wrap">
    <div class="narrow">
      <span class="eyebrow">Greater London &amp; the M25</span>
      <h1>Air conditioning installers across London</h1>
      <p class="lede">We survey free anywhere inside the M25. Below are the areas we work in most often, with what we've learned about their housing stock, their councils and where the outdoor unit realistically goes.</p>
      <div class="btn-row" style="margin-top:18px">
        <a class="btn btn--primary" href="/contact">Get a free survey</a>
        <a class="btn btn--ghost" href="tel:${esc(site.phoneHref)}">${icon("phone")} ${esc(site.phone)}</a>
      </div>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    <div class="grid grid--3">
      ${areas.map((a) => `
      <a class="card card--link" href="/areas/${esc(a.slug)}">
        <h3>${icon("pin", 16)} ${esc(a.name)}</h3>
        <div class="postcodes">${a.postcodes.map((p) => `<span>${esc(p)}</span>`).join("")}</div>
        <p class="small muted">${esc(a.property)}</p>
        <p class="small" style="margin:0"><strong>Read the local notes →</strong></p>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap narrow">
    <h2>And everywhere else in London</h2>
    <p class="lede">We cover all 32 boroughs and the City. If your area isn't listed above, it isn't a problem — it just doesn't have its own page yet.</p>
    <ul class="pill-list" style="margin-top:18px">${alsoCover.map((n) => `<li><span class="pill">${esc(n)}</span></li>`).join("")}</ul>
    <p class="small muted" style="margin-top:16px">Outside the M25? Call us — we take work in the immediate home counties fringe, but we'll tell you if you're better served by someone local.</p>
  </div>
</section>

${ctaBand(site)}`;

page("areas.html", {
  title: `Air Conditioning Installers Across London | ${site.name}`,
  description: "Air conditioning installation across all of Greater London — Clapham, Islington, Kensington, Richmond, Canary Wharf, Hackney, Wimbledon, Hampstead, Ealing and the City. Free surveys inside the M25.",
  body: areasBody,
  priority: 0.8
});

for (const area of areas) {
  const local = (area.popular || []).map((id) => itemById[id]).filter(Boolean);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.domain + "/" },
        { "@type": "ListItem", position: 2, name: "Areas we cover", item: site.domain + "/areas" },
        { "@type": "ListItem", position: 3, name: area.name, item: `${site.domain}/areas/${area.slug}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Air conditioning installation",
      provider: { "@id": site.domain + "/#business" },
      areaServed: { "@type": "Place", name: area.name, address: { "@type": "PostalAddress", addressLocality: area.name, addressRegion: "Greater London", addressCountry: "GB" } },
      description: area.intro
    }
  ];

  const body = `
<div class="wrap breadcrumb"><a href="/">Home</a> → <a href="/areas">Areas</a> → ${esc(area.name)}</div>

<section class="section" style="padding-top:26px">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${area.postcodes.map(esc).join(" · ")}</span>
      <h1>Air conditioning installation in ${esc(area.name)}</h1>
      <p class="lede">${esc(area.intro)}</p>
      <div class="btn-row" style="margin-top:18px">
        <a class="btn btn--primary" href="/contact">Book a free survey</a>
        <a class="btn btn--ghost" href="tel:${esc(site.phoneHref)}">${icon("phone")} ${esc(site.phone)}</a>
        <a class="btn btn--ghost" href="https://wa.me/${esc(site.whatsapp)}">${icon("whatsapp")} WhatsApp</a>
      </div>
    </div>
    <div class="hero-card">
      <h2>${esc(area.name)} at a glance</h2>
      <p class="small muted" style="margin-bottom:14px">${esc(area.property)}</p>
      <ul class="ticks small">
        <li>Free survey — ${esc(area.name)} is inside our M25 area</li>
        <li>F-Gas certified engineers and Part P electricians</li>
        <li>Honest planning advice before you spend anything</li>
        <li>Fixed written price, valid 60 days</li>
      </ul>
      <a class="btn btn--brand btn--block" style="margin-top:16px" href="/contact">Get my price</a>
    </div>
  </div>
</section>

${trustBar(site)}

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:24px">
      <span class="eyebrow">Local knowledge</span>
      <h2>What we've learned installing in ${esc(area.name)}</h2>
    </div>
    <div class="grid grid--3">
      ${area.notes.map((n) => `
      <div class="card card--flag">
        <h3 style="font-size:1rem">${esc(n.title)}</h3>
        <p class="small" style="margin:0">${esc(n.body)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:24px">
      <span class="eyebrow">Before you commit</span>
      <h2>We settle the outdoor unit first</h2>
      <p class="lede">It decides what you can have, what it costs and whether you need permission. We work it out at the free survey and tell you straight — including when the answer is that an application is unlikely to succeed.</p>
    </div>
    <figure class="diagram" style="margin:0">
      ${housePlacementDiagram()}
      <figcaption>Where the outdoor unit usually ends up on a ${esc(area.name)} property. Yours is settled on site, not from a drawing.</figcaption>
    </figure>
    <div class="btn-row" style="margin-top:22px">
      <a class="btn btn--primary" href="/contact">Book a free survey</a>
      <a class="btn btn--ghost" href="https://wa.me/${esc(site.whatsapp)}">${icon("whatsapp")} Send us a photo of the back of the house</a>
    </div>
  </div>
</section>

${local.length ? `
<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:24px">
      <span class="eyebrow">Popular here</span>
      <h2>What ${esc(area.name)} customers usually buy</h2>
      <p class="lede">${esc(services.vatNote)}</p>
    </div>
    <div class="grid grid--3">${local.map((i) => priceCard(i, i.group)).join("")}</div>
    <p style="margin-top:22px"><a class="btn btn--ghost" href="/pricing">See every option and price →</a></p>
  </div>
</section>` : ""}

<section class="section">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Itemised quote</span>
      <h2>Build your ${esc(area.name)} quote</h2>
      <p class="lede">Pick your rooms, add anything else you need, and send it over. We'll come back with a survey date.</p>
    </div>
    ${quoteBuilder()}
  </div>
</section>

<section class="section section--tint">
  <div class="wrap narrow">
    <h2>Nearby areas</h2>
    <ul class="pill-list" style="margin-top:14px">
      ${areas.filter((a) => a.slug !== area.slug).map((a) => `<li><a href="/areas/${esc(a.slug)}">${esc(a.name)}</a></li>`).join("")}
    </ul>
  </div>
</section>

${ctaBand(site, {
  heading: `Cooling a property in ${area.name}?`,
  text: "Free survey, fixed written price, and a straight answer on planning before you commit to anything."
})}`;

  page(`areas/${area.slug}.html`, {
    title: `Air Conditioning Installation ${area.name} (${area.postcodes[0]}) | ${site.name}`,
    description: `Air conditioning installation in ${area.name} — ${area.postcodes.join(", ")}. F-Gas certified, free survey, fixed written quotes. ${area.property}`,
    body,
    jsonLd: ld,
    priority: 0.7
  });
}

/* ======================================================== contact ========= */

const contactBody = `
<div class="wrap breadcrumb"><a href="/">Home</a> → Contact</div>

<section class="section" style="padding-top:26px;padding-bottom:30px">
  <div class="wrap">
    <div class="narrow">
      <span class="eyebrow">Three ways, all of them quick</span>
      <h1>Get an itemised quote</h1>
      <p class="lede">Build your list below and send it in one tap, or just call us. Whichever you pick, the next step is a free survey and a fixed written price.</p>
    </div>
    <div class="contact-methods" style="margin-top:26px">
      <a class="contact-method" href="tel:${esc(site.phoneHref)}">
        <span class="ico">${icon("phone", 22)}</span>
        <span><b>${esc(site.phone)}</b><span class="sub">${esc(site.hours[0].days)} ${esc(site.hours[0].open)}–${esc(site.hours[0].close)}</span></span>
      </a>
      <a class="contact-method" href="https://wa.me/${esc(site.whatsapp)}">
        <span class="ico">${icon("whatsapp", 22)}</span>
        <span><b>WhatsApp</b><span class="sub">Send photos of the rooms — it speeds things up</span></span>
      </a>
      <a class="contact-method" href="mailto:${esc(site.email)}">
        <span class="ico">${icon("mail", 22)}</span>
        <span><b>${esc(site.email)}</b><span class="sub">We reply the same working day</span></span>
      </a>
      <div class="contact-method" style="cursor:default">
        <span class="ico">${icon("clock", 22)}</span>
        <span><b>Opening hours</b><span class="sub">${site.hours.map((h) => `${esc(h.days)} ${esc(h.open)}–${esc(h.close)}`).join("<br>")}<br>${esc(site.hoursNote)}</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:10px">
  <div class="wrap">
    ${quoteBuilder()}
  </div>
</section>

<section class="section section--tint">
  <div class="wrap grid grid--2" style="gap:36px;align-items:start">
    <div>
      <h2>Where we are</h2>
      <p>${esc(site.address.street)}<br>${esc(site.address.locality)} ${esc(site.address.postcode)}</p>
      <p class="small muted">We're an installation business rather than a showroom, so please call before visiting. Surveys happen at your property and they're free anywhere inside the M25.</p>
      <p><a href="/areas">See every area we cover →</a></p>
    </div>
    <div>
      <h2>Before you call, it helps to know</h2>
      <ul class="ticks">
        <li>Roughly which rooms you want cooled, and their approximate size</li>
        <li>Whether it's a house or a flat — and if a flat, whether you own the freehold</li>
        <li>Whether you're in a conservation area or a listed building</li>
        <li>Where you think the outdoor unit could go — a photo of the rear elevation is ideal</li>
      </ul>
      <p class="small muted" style="margin-top:14px">Don't worry if you don't know any of it. That's what the survey is for.</p>
    </div>
  </div>
</section>`;

page("contact.html", {
  title: `Contact — Free Survey & Fixed Quote | ${site.name}`,
  description: `Get an itemised air conditioning quote for your London property. Call ${site.phone}, message us on WhatsApp, or build your list online in a minute.`,
  body: contactBody,
  jsonLd: [{
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact " + site.name,
    url: site.domain + "/contact",
    mainEntity: { "@id": site.domain + "/#business" }
  }],
  priority: 0.9
});

/* ============================================================ 404 ========= */

write("404.html", layout({
  site, areas, path: "/404.html", noindex: true,
  title: `Page not found | ${site.name}`,
  description: "That page doesn't exist.",
  body: `
<section class="section">
  <div class="wrap narrow center">
    <h1>That page has moved on</h1>
    <p class="lede">It happens. Here's where most people were heading.</p>
    <div class="btn-row" style="justify-content:center;margin-top:22px">
      <a class="btn btn--primary" href="/pricing">See prices</a>
      <a class="btn btn--ghost" href="/contact">Get a quote</a>
      <a class="btn btn--ghost" href="/">Home</a>
    </div>
  </div>
</section>`
}));

/* ============================================ social preview image ======== */
/* Rendered from lib/*.html into the source assets/ directory and committed, so
   a build on a machine without Chromium — Vercel's builder, for one — keeps the
   images that are already there instead of shipping a site with none. */

// The share image and the iOS home-screen icon are rendered from HTML with
// headless Chromium so there is one source of truth for the branding. Both are
// committed to the repo, so a machine without Chromium still builds fine.
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

// Headless paints only its viewport, which this build makes shorter than the
// window it was given, so a fixed-size render comes out clipped. Render with
// vertical headroom and trim the surplus rows back off.
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

for (const s of shots) {
  if (!existsSync(join(root, "assets", s.png))) console.warn(`  ! assets/${s.png} missing — see README.`);
}

/* ======================================================== assets ========== */

mkdirSync(join(out, "assets"), { recursive: true });
cpSync(join(root, "assets"), join(out, "assets"), { recursive: true });

// The quote builder's data, generated from the same JSON the pages are built
// from, so a price can never be right on the page and wrong in the builder.
const catalogue = {
  business: { whatsapp: site.whatsapp, email: site.email, phone: site.phoneHref },
  vatNote: services.vatNote,
  groups: services.groups.map((g) => ({
    id: g.id, title: g.title, business: !!g.business,
    items: g.items.map((i) => ({
      id: i.id, name: i.name, spec: i.spec, from: i.from ?? null,
      poa: !!i.poa, unitLabel: i.unitLabel
    }))
  })),
  extras: services.extras,
  care: services.care
};
writeFileSync(join(out, "assets", "catalogue.js"),
  "/* Generated by build.mjs — do not edit. Edit content/services.json instead. */\n" +
  "window.CATALOGUE = " + JSON.stringify(catalogue) + ";\n");

/* ============================================== robots & sitemap ========== */

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
