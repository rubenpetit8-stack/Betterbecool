/* Page templates. Layout, shared furniture and one renderer per page type.
   Content lives in ../content/*.json — edit that for prices, areas and contact
   details. Edit this file when you want to change the words around them. */

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const money = (n) => "£" + Number(n).toLocaleString("en-GB");

import { unitArt } from "./illustrations.mjs";
export { unitArt, housePlacementDiagram } from "./illustrations.mjs";

/* Vercel serves /pricing.html at /pricing (cleanUrls in vercel.json), so every
   link, canonical and sitemap entry we emit drops the extension — otherwise
   each internal click would cost a redirect hop. The files on disk keep their
   .html names; only the URLs change. */
export const pretty = (p) =>
  p.replace(/\/index\.html(?=$|[#?])/, "/").replace(/\.html(?=$|[#?])/, "");

/* ------------------------------------------------------------------ icons */

const ICON = {
  check: '<path d="M9.6 16.6 5 12l1.4-1.4 3.2 3.2 8-8L19 7.2z"/>',
  phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z"/>',
  whatsapp: '<path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.9 9.9 0 0 0 4.88 1.25h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2m0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.24 8.24 0 0 1 12.8-10.2 8.18 8.18 0 0 1 2.42 5.85c0 4.56-3.71 8.2-8.24 8.2m4.52-6.16c-.25-.13-1.47-.72-1.69-.8s-.4-.13-.56.12c-.17.25-.64.8-.79.97s-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.44s-.56-1.34-.76-1.84c-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.44.06-.66.31s-.87.85-.87 2.07.89 2.4 1.01 2.56c.13.17 1.75 2.67 4.24 3.74 1.58.68 2.2.74 2.99.62.48-.07 1.47-.6 1.67-1.18s.21-1.08.15-1.18c-.06-.11-.23-.17-.48-.29"/>',
  mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z"/>',
  shield: '<path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm-1.2 15L7 12.2l1.4-1.4 2.4 2.4 5-5 1.4 1.4z"/>',
  clock: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5"/>',
  snow: '<path d="M22 11h-3.2l2.3-2.3-1.4-1.4L16 10h-3v-3l2.7-3.7-1.4-1.4L12 4.2V1h-2v3.2L7.7 1.9 6.3 3.3 9 7v3H6L2.3 7.3 1 8.7 3.2 11H0v2h3.2L.9 15.3l1.4 1.4L6 13h3v3l-2.7 3.7 1.4 1.4L10 19.8V23h2v-3.2l2.3 2.3 1.4-1.4L13 17v-3h3l3.7 2.7 1.4-1.4L18.8 13H22z"/>',
  pound: '<path d="M6 21v-2h1.5c.9 0 1.5-.7 1.5-1.6V13H6v-2h3V8.6C9 5.9 10.9 4 13.6 4c1.9 0 3.4.9 4.2 2.4l-1.8 1a2.5 2.5 0 0 0-2.4-1.4c-1.5 0-2.6 1-2.6 2.6V11h4v2h-4v4.4c0 .6-.2 1.1-.5 1.6H19v2z"/>'
};

export const icon = (name, size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICON[name] || ""}</svg>`;

/* -------------------------------------------------------------------- logo */

const logoMark = (size = 30) => `
<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <rect width="40" height="40" rx="10" fill="url(#cl-g)"/>
  <path d="M11 15h18M11 20h18M11 25h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".92"/>
  <circle cx="28.5" cy="25" r="2.6" fill="#fff" opacity=".92"/>
  <defs>
    <linearGradient id="cl-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0c6fa8"/><stop offset="1" stop-color="#17a2b8"/>
    </linearGradient>
  </defs>
</svg>`;

/* ------------------------------------------------------------ shared parts */

function header(site, path) {
  const nav = site.nav.map((n) => {
    const current = n.href === path || (n.href.startsWith(path) && path !== "/index.html");
    return `<a href="${esc(pretty(n.href))}"${current ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`;
  }).join("");

  return `
<header class="site-header">
  <div class="wrap header-bar">
    <a class="brand" href="/">
      ${logoMark(32)}
      <span>${esc(site.name)}<small>Installation &amp; servicing</small></span>
    </a>
    <nav class="site-nav" aria-label="Main">${nav}</nav>
    <div class="header-cta">
      <a class="header-tel" href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a>
      <a class="btn btn--primary btn--sm" href="/contact">Get a quote</a>
    </div>
  </div>
</header>`;
}

function footer(site, areas) {
  const areaLinks = areas.slice(0, 8)
    .map((a) => `<li><a href="/areas/${esc(a.slug)}">${esc(a.name)}</a></li>`).join("");

  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/" style="margin-bottom:12px">${logoMark(30)}<span>${esc(site.name)}</span></a>
        <p class="muted small">${esc(site.description)}</p>
        <p class="small">
          ${icon("pin", 15)} ${esc(site.address.street)}, ${esc(site.address.locality)} ${esc(site.address.postcode)}
        </p>
      </div>
      <div>
        <h4>What we do</h4>
        <ul>
          <li><a href="/pricing#single-room">One-room systems</a></li>
          <li><a href="/pricing#multi-room">Multi-room systems</a></li>
          <li><a href="/pricing#concealed">Concealed &amp; ducted</a></li>
          <li><a href="/pricing#business">Business &amp; offices</a></li>
          <li><a href="/pricing#care">Servicing &amp; repairs</a></li>
        </ul>
      </div>
      <div>
        <h4>Areas</h4>
        <ul>${areaLinks}<li><a href="/areas">All areas we cover</a></li></ul>
      </div>
      <div>
        <h4>Talk to us</h4>
        <ul>
          <li><a href="tel:${esc(site.phoneHref)}">${esc(site.phone)}</a></li>
          <li><a href="https://wa.me/${esc(site.whatsapp)}">WhatsApp us</a></li>
          <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
        </ul>
        <p class="small muted" style="margin-top:12px">
          ${site.hours.map((h) => `${esc(h.days)} ${esc(h.open)}–${esc(h.close)}`).join("<br>")}<br>${esc(site.hoursNote)}
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(site.legalName)}. F-Gas certified · REFCOM registered · Fully insured.</span>
      <span>Guide prices shown are starting prices for a standard installation and are confirmed in writing after a free survey.</span>
    </div>
  </div>
</footer>`;
}

function mobileBar(site) {
  return `
<nav class="mobile-bar" aria-label="Quick contact">
  <a href="tel:${esc(site.phoneHref)}">${icon("phone", 20)}Call</a>
  <a href="https://wa.me/${esc(site.whatsapp)}">${icon("whatsapp", 20)}WhatsApp</a>
  <a class="is-primary" href="/contact">${icon("pound", 20)}Get a quote</a>
</nav>`;
}

/* ------------------------------------------------------------ structured data */

function localBusinessLd(site, areas) {
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": site.domain + "/#business",
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.domain + "/",
    telephone: site.phoneHref,
    email: site.email,
    image: site.domain + "/assets/og-image.png",
    logo: site.domain + "/assets/logo.svg",
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.latitude, longitude: site.address.longitude },
    areaServed: [
      { "@type": "City", name: "London" },
      ...areas.map((a) => ({ "@type": "Place", name: a.name }))
    ],
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.includes("Saturday")
        ? ["Saturday"]
        : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: h.open,
      closes: h.close
    })),
    knowsAbout: [
      "Air conditioning installation", "Split system air conditioning",
      "Multi-split air conditioning", "Ducted air conditioning",
      "Air conditioning servicing", "F-Gas regulations", "TM44 inspections"
    ],
    sameAs: Object.values(site.social).filter(Boolean)
  };
}

/* -------------------------------------------------------------------- layout */

export function layout({ site, areas, path, title, description, body, jsonLd = [], noindex = false }) {
  const url = site.domain + pretty(path);
  const blocks = [localBusinessLd(site, areas), ...jsonLd]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n");

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta name="theme-color" content="#0c6fa8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1621" media="(prefers-color-scheme: dark)">
<meta name="geo.region" content="GB-LND">
<meta name="geo.placename" content="London">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${esc(site.domain)}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(site.domain)}/assets/og-image.png">

<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/styles.css">
${blocks}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(site, path)}
<main id="main">
${body}
</main>
${footer(site, areas)}
${mobileBar(site)}
<script src="/assets/catalogue.js"></script>
<script src="/assets/quote.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------ quote builder */

export function quoteBuilder({ compact = false } = {}) {
  return `
<div class="quote quote-builder">
  <div class="quote-grid">
    <div class="quote-main">
      <div class="q-step">
        <h3><i>1</i> Home or business?</h3>
        <div class="btn-row">
          <button type="button" class="btn btn--sm btn--brand" data-mode="home" aria-pressed="true">A home</button>
          <button type="button" class="btn btn--sm btn--ghost" data-mode="business" aria-pressed="false">A business</button>
        </div>
      </div>

      <div class="q-step">
        <h3><i>2</i> Pick your systems</h3>
        <p class="small muted">Tap a row to add it. Add one per room you want cooled.</p>
        <div data-systems></div>
      </div>

      <div class="q-step">
        <h3><i>3</i> Anything else? <span class="small muted" style="font-weight:400">Optional</span></h3>
        <p class="small muted">Only add these if you already know you need them — we'll confirm at survey either way.</p>
        <div data-extras></div>
      </div>

      <div class="q-step">
        <h3><i>4</i> Servicing and cover <span class="small muted" style="font-weight:400">Optional</span></h3>
        <div data-care></div>
      </div>
    </div>

    <aside class="quote-side" aria-label="Your itemised estimate">
      <h3 style="margin-bottom:.6em">Your estimate</h3>
      <div data-summary></div>
      <div class="total">
        <span class="label">Guide total</span>
        <span class="amount" data-total>—</span>
      </div>
      <p class="small muted" data-vat style="margin-bottom:16px"></p>
      <div class="hint-box" data-hint hidden></div>

      <h3 style="font-size:1rem;margin-bottom:.5em">Where do we send it?</h3>
      <div class="field">
        <label for="q-name">Your name</label>
        <input id="q-name" name="name" type="text" autocomplete="name" required>
        <p class="err" data-err="name"></p>
      </div>
      <div class="field">
        <label for="q-phone">Phone <span class="hint">— fastest way to book a survey</span></label>
        <input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
        <p class="err" data-err="phone"></p>
      </div>
      <div class="field">
        <label for="q-email">Email</label>
        <input id="q-email" name="email" type="email" autocomplete="email" inputmode="email">
        <p class="err" data-err="email"></p>
      </div>
      <div class="field">
        <label for="q-postcode">Postcode</label>
        <input id="q-postcode" name="postcode" type="text" autocomplete="postal-code" placeholder="e.g. SW4 7AA">
        <p class="err" data-err="postcode"></p>
      </div>
      <div class="field">
        <label for="q-when">Best time for a survey</label>
        <select id="q-when" name="when">
          <option value="">No preference</option>
          <option>Weekday morning</option>
          <option>Weekday afternoon</option>
          <option>Weekday evening</option>
          <option>Saturday morning</option>
          <option>As soon as possible</option>
        </select>
      </div>
      <div class="field">
        <label for="q-notes">Anything we should know? <span class="hint">— optional</span></label>
        <textarea id="q-notes" name="notes" placeholder="Flat or house, which rooms, conservation area, when you need it done…"></textarea>
      </div>

      <div class="send-row">
        <button type="button" class="btn btn--primary btn--block" data-send="whatsapp">${icon("whatsapp")} Send on WhatsApp</button>
        <button type="button" class="btn btn--brand btn--block" data-send="email">${icon("mail")} Send by email</button>
        <button type="button" class="btn btn--ghost btn--block btn--sm" data-send="copy">Copy my list</button>
        <button type="button" class="btn btn--ghost btn--block btn--sm" data-send="reset">Start again</button>
      </div>
      <p class="copy-ok" data-flash role="status" aria-live="polite"></p>
      <p class="small muted">Your list stays in this browser until you send it. We never see it unless you press one of the buttons above.</p>
    </aside>
  </div>
</div>
${compact ? "" : ""}`;
}

/* ----------------------------------------------------------------- sections */

export function ctaBand(site, { heading, text } = {}) {
  return `
<section class="cta-band">
  <div class="wrap center">
    <h2>${esc(heading || "Get a fixed price, free")}</h2>
    <p class="lede" style="margin-inline:auto">${esc(text || "Tell us which rooms you want cooled and we'll book a free survey. No charge, no obligation, and a written fixed price before anything is ordered.")}</p>
    <div class="btn-row" style="justify-content:center;margin-top:22px">
      <a class="btn btn--primary" href="/contact">Build my quote</a>
      <a class="btn btn--ghost" href="tel:${esc(site.phoneHref)}">${icon("phone")} ${esc(site.phone)}</a>
      <a class="btn btn--ghost" href="https://wa.me/${esc(site.whatsapp)}">${icon("whatsapp")} WhatsApp</a>
    </div>
  </div>
</section>`;
}

export function trustBar(site) {
  return `
<div class="trustbar">
  <div class="wrap">
    <ul>${site.credentials.map((c) => `<li>${icon("shield", 16)}${esc(c.label)}</li>`).join("")}</ul>
  </div>
</div>`;
}

export function faqSection(faqs) {
  return `
<section class="section" id="faq">
  <div class="wrap">
    <div class="narrow" style="margin-bottom:26px">
      <span class="eyebrow">Straight answers</span>
      <h2>The questions we get asked every week</h2>
      <p class="lede">Including the one most installers avoid: whether you need planning permission.</p>
    </div>
    <div class="faq">
      ${faqs.map((f) => `
      <details>
        <summary>${esc(f.q)}</summary>
        <div class="answer"><p>${esc(f.a)}</p></div>
      </details>`).join("")}
    </div>
  </div>
</section>`;
}

export function faqLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}

export function priceCard(item, group) {
  const price = item.poa
    ? `<b>On survey</b>`
    : `<span class="from">from</span><b>${money(item.from)}</b>`;
  return `
<article class="card price-card${item.popular ? " is-popular" : ""}">
  ${item.popular ? '<span class="tag">Most fitted</span>' : ""}
  ${item.art ? `<figure>${unitArt(item.art)}</figure>` : ""}
  <h3>${esc(item.name)}</h3>
  <p class="spec">${esc(item.spec || "")}</p>
  <div class="price">${price}<span class="per">${esc(item.unitLabel || "")}</span></div>
  ${item.includes ? `<ul class="ticks">${item.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
  <a class="btn btn--brand btn--sm" href="/contact?item=${esc(item.id)}">Add to my quote</a>
</article>`;
}

export function extrasTable(rows, { caption, note } = {}) {
  return `
<div class="table-wrap">
  <table>
    ${caption ? `<caption>${esc(caption)}</caption>` : ""}
    <thead><tr><th scope="col">Item</th><th scope="col" class="num">Price</th></tr></thead>
    <tbody>
      ${rows.map((r) => `
      <tr>
        <td><strong>${esc(r.name)}</strong>${r.note ? `<span class="note">${esc(r.note)}</span>` : ""}</td>
        <td class="num">${r.price === 0 ? "Included" : money(r.price)}<span class="note" style="font-weight:400">${esc(r.unitLabel || "")}</span></td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>
${note ? `<p class="small muted" style="margin-top:10px">${esc(note)}</p>` : ""}`;
}
