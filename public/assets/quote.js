/* Better Be Cool — itemised quote builder.
   Reads window.CATALOGUE (generated into catalogue.js at build time), lets the
   visitor tick exactly what they want, keeps a running "from" total, then hands
   the itemised list straight to WhatsApp, email or the clipboard.

   No dependencies, no network calls: nothing here can leak a customer's details
   anywhere except to the contact channel they choose themselves. */

(function () {
  "use strict";

  var mount = document.getElementById("quote-builder");
  if (!mount || !window.CATALOGUE) return;

  var CAT = window.CATALOGUE;
  var BIZ = CAT.business;
  var STORE_KEY = "betterbecool.quote.v1";

  var state = {
    mode: "home",
    qty: {},          // itemId -> quantity
    details: { name: "", phone: "", email: "", postcode: "", when: "", notes: "" }
  };

  /* ---------------- helpers ---------------- */

  function money(n) {
    return "£" + Math.round(n).toLocaleString("en-GB");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function allItems() {
    var out = [];
    CAT.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        out.push(Object.assign({ groupId: g.id, groupTitle: g.title, business: !!g.business }, it));
      });
    });
    CAT.extras.forEach(function (x) {
      out.push(Object.assign({ groupId: "extras", groupTitle: "Optional extras", kind: "extra", from: x.price }, x));
    });
    CAT.care.forEach(function (x) {
      out.push(Object.assign({ groupId: "care", groupTitle: "Servicing & aftercare", kind: "care", from: x.price }, x));
    });
    return out;
  }

  var ITEMS = allItems();
  var byId = {};
  ITEMS.forEach(function (it) { byId[it.id] = it; });

  // Render from the normalised list, not the raw JSON: extras and care items
  // carry `price` in content/services.json and `from` only after normalising.
  var EXTRAS = ITEMS.filter(function (i) { return i.kind === "extra"; });
  var CARE = ITEMS.filter(function (i) { return i.kind === "care"; });

  function selected() {
    return Object.keys(state.qty)
      .filter(function (id) { return state.qty[id] > 0 && byId[id]; })
      .map(function (id) { return { item: byId[id], qty: state.qty[id] }; });
  }

  function totals() {
    var known = 0, hasPoa = false;
    selected().forEach(function (row) {
      if (row.item.poa) hasPoa = true;
      else known += (row.item.from || 0) * row.qty;
    });
    return { known: known, hasPoa: hasPoa };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        state.mode = saved.mode === "business" ? "business" : "home";
        state.qty = saved.qty && typeof saved.qty === "object" ? saved.qty : {};
        Object.keys(state.details).forEach(function (k) {
          if (typeof (saved.details || {})[k] === "string") state.details[k] = saved.details[k];
        });
      }
    } catch (e) { /* ignore corrupt state */ }
  }

  /* ---------------- rendering ---------------- */

  function optionRow(it) {
    var price = it.poa
      ? "On survey"
      : (it.price === 0 ? "Included" : money(it.from));
    return (
      '<div class="opt" data-item="' + esc(it.id) + '">' +
        '<div class="qty" role="group" aria-label="Quantity of ' + esc(it.name) + '">' +
          '<button type="button" data-step="-1" aria-label="Remove one ' + esc(it.name) + '">−</button>' +
          '<output data-qty-for="' + esc(it.id) + '">0</output>' +
          '<button type="button" data-step="1" aria-label="Add one ' + esc(it.name) + '">+</button>' +
        '</div>' +
        '<div>' +
          '<span class="opt-name">' + esc(it.name) + '</span>' +
          '<span class="opt-spec">' + esc(it.spec || it.note || "") + '</span>' +
        '</div>' +
        '<div class="opt-price">' + esc(price) +
          '<small>' + esc(it.unitLabel || "") + '</small>' +
        '</div>' +
      '</div>'
    );
  }

  function groupsForMode() {
    return CAT.groups.filter(function (g) {
      return state.mode === "business" ? !!g.business : !g.business;
    });
  }

  function renderOptions() {
    var host = mount.querySelector("[data-systems]");
    host.innerHTML = groupsForMode().map(function (g) {
      return (
        '<fieldset style="border:0;padding:0;margin:0 0 18px">' +
          '<legend style="font-weight:650;font-size:.95rem;padding:0 0 8px">' + esc(g.title) + '</legend>' +
          '<div class="opt-list">' + g.items.map(optionRow).join("") + "</div>" +
        "</fieldset>"
      );
    }).join("");

    mount.querySelector("[data-extras]").innerHTML =
      '<div class="opt-list">' + EXTRAS.map(optionRow).join("") + "</div>";

    mount.querySelector("[data-care]").innerHTML =
      '<div class="opt-list">' + CARE.map(optionRow).join("") + "</div>";

    syncQtyDisplay();
  }

  function syncQtyDisplay() {
    mount.querySelectorAll("[data-qty-for]").forEach(function (out) {
      out.textContent = state.qty[out.getAttribute("data-qty-for")] || 0;
    });
    mount.querySelectorAll(".opt").forEach(function (el) {
      var q = state.qty[el.getAttribute("data-item")] || 0;
      el.classList.toggle("is-chosen", q > 0);
      el.style.borderColor = q > 0 ? "var(--brand)" : "";
      el.style.background = q > 0 ? "var(--brand-tint)" : "";
    });
  }

  function renderSummary() {
    var rows = selected();
    var list = mount.querySelector("[data-summary]");
    var t = totals();

    if (!rows.length) {
      list.innerHTML = '<p class="summary-empty">Nothing picked yet. Add a system above and your itemised estimate builds here.</p>';
    } else {
      list.innerHTML = '<ul class="summary-list">' + rows.map(function (r) {
        var line = r.item.poa
          ? "On survey"
          : (r.item.price === 0 ? "Included" : money((r.item.from || 0) * r.qty));
        return "<li><span>" + esc(r.item.name) + (r.qty > 1 ? " × " + r.qty : "") +
               "</span><span>" + esc(line) + "</span></li>";
      }).join("") + "</ul>";
    }

    mount.querySelector("[data-total]").textContent = rows.length ? "from " + money(t.known) : "—";
    mount.querySelector("[data-vat]").textContent = state.mode === "business"
      ? "Excluding VAT. " + (t.hasPoa ? "Items marked on survey are designed and priced after we visit." : "")
      : "Including VAT at 20%. " + (t.hasPoa ? "Items marked on survey are priced after we visit." : "");

    // Nudge towards a multi-split when several single systems are ticked.
    var singles = rows.filter(function (r) { return r.item.groupId === "single-room"; })
                      .reduce(function (n, r) { return n + r.qty; }, 0);
    var hint = mount.querySelector("[data-hint]");
    if (singles >= 2 && state.mode === "home") {
      hint.hidden = false;
      hint.innerHTML = "<strong>Worth asking about:</strong> " + singles +
        " separate systems means " + singles + " boxes outside. A multi-split runs them all from one outdoor unit — usually cheaper, and often the difference between getting planning permission and not.";
    } else {
      hint.hidden = true;
    }
  }

  /* ---------------- message building ---------------- */

  function summaryText() {
    var rows = selected();
    var t = totals();
    var d = state.details;
    var L = [];

    L.push("Air conditioning enquiry — " + (state.mode === "business" ? "Business" : "Home"));
    L.push("");

    if (rows.length) {
      L.push("What I'm after:");
      rows.forEach(function (r) {
        var price = r.item.poa ? "priced on survey"
          : (r.item.price === 0 ? "included" : "from " + money((r.item.from || 0) * r.qty));
        L.push("  • " + r.qty + " × " + r.item.name + " (" + price + ")");
      });
      L.push("");
      L.push("Guide total: from " + money(t.known) +
        (state.mode === "business" ? " excl. VAT" : " incl. VAT") +
        (t.hasPoa ? ", plus the items priced on survey" : ""));
    } else {
      L.push("I haven't picked specific units — I'd like advice on what suits the property.");
    }

    L.push("");
    L.push("My details:");
    L.push("  Name: " + (d.name || "—"));
    L.push("  Phone: " + (d.phone || "—"));
    L.push("  Email: " + (d.email || "—"));
    L.push("  Postcode: " + (d.postcode || "—"));
    L.push("  Best time to survey: " + (d.when || "—"));
    if (d.notes) { L.push(""); L.push("Notes: " + d.notes); }

    return L.join("\n");
  }

  /* ---------------- validation ---------------- */

  function setError(name, message) {
    var input = mount.querySelector('[name="' + name + '"]');
    var box = mount.querySelector('[data-err="' + name + '"]');
    if (!input || !box) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      box.textContent = message;
      box.classList.add("show");
    } else {
      input.removeAttribute("aria-invalid");
      box.textContent = "";
      box.classList.remove("show");
    }
  }

  function validate(focusFirst) {
    var d = state.details;
    var ok = true, first = null;

    if (!d.name.trim()) { setError("name", "Please tell us your name."); ok = false; first = first || "name"; }
    else setError("name", "");

    var hasPhone = d.phone.replace(/[^0-9]/g, "").length >= 10;
    var hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim());
    if (!hasPhone && !hasEmail) {
      setError("phone", "We need either a phone number or an email address to reply to.");
      ok = false; first = first || "phone";
    } else setError("phone", "");

    if (d.email.trim() && !hasEmail) { setError("email", "That email address doesn't look right."); ok = false; first = first || "email"; }
    else setError("email", "");

    if (!d.postcode.trim()) { setError("postcode", "Your postcode tells us whether you're inside our free-survey area."); ok = false; first = first || "postcode"; }
    else setError("postcode", "");

    if (!ok && focusFirst && first) {
      var el = mount.querySelector('[name="' + first + '"]');
      if (el) { el.focus(); el.scrollIntoView({ block: "center", behavior: "smooth" }); }
    }
    return ok;
  }

  function flash(msg) {
    var el = mount.querySelector("[data-flash]");
    el.textContent = msg;
    clearTimeout(flash._t);
    flash._t = setTimeout(function () { el.textContent = ""; }, 4000);
  }

  /* ---------------- events ---------------- */

  mount.addEventListener("click", function (e) {
    var stepBtn = e.target.closest("[data-step]");
    if (stepBtn) {
      var row = stepBtn.closest(".opt");
      var id = row.getAttribute("data-item");
      var next = (state.qty[id] || 0) + Number(stepBtn.getAttribute("data-step"));
      state.qty[id] = Math.max(0, Math.min(20, next));
      if (!state.qty[id]) delete state.qty[id];
      syncQtyDisplay(); renderSummary(); save();
      return;
    }

    // Clicking anywhere else on an unselected row adds the first one.
    var opt = e.target.closest(".opt");
    if (opt && !e.target.closest(".qty")) {
      var oid = opt.getAttribute("data-item");
      if (!state.qty[oid]) {
        state.qty[oid] = 1;
        syncQtyDisplay(); renderSummary(); save();
      }
      return;
    }

    var modeBtn = e.target.closest("[data-mode]");
    if (modeBtn) {
      state.mode = modeBtn.getAttribute("data-mode");
      mount.querySelectorAll("[data-mode]").forEach(function (b) {
        var on = b.getAttribute("data-mode") === state.mode;
        b.setAttribute("aria-pressed", String(on));
        b.className = "btn btn--sm " + (on ? "btn--brand" : "btn--ghost");
      });
      renderOptions(); renderSummary(); save();
      return;
    }

    var send = e.target.closest("[data-send]");
    if (send) {
      var how = send.getAttribute("data-send");
      if (how === "reset") {
        state.qty = {};
        syncQtyDisplay(); renderSummary(); save();
        flash("Cleared.");
        return;
      }
      if (!validate(true)) return;
      var text = summaryText();

      if (how === "whatsapp") {
        window.open("https://wa.me/" + BIZ.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        flash("Opening WhatsApp with your itemised list.");
      } else if (how === "email") {
        var subject = "Air conditioning enquiry — " + (state.details.postcode || "London");
        window.location.href = "mailto:" + BIZ.email +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(text);
        flash("Opening your email app with the details filled in.");
      } else if (how === "copy") {
        var done = function () { flash("Copied — paste it into an email, a text or a message to us."); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
        } else fallbackCopy(text, done);
      }
    }
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { flash("Couldn't copy automatically — select the summary and copy it."); }
    document.body.removeChild(ta);
  }

  mount.addEventListener("input", function (e) {
    var name = e.target.name;
    if (name && Object.prototype.hasOwnProperty.call(state.details, name)) {
      state.details[name] = e.target.value;
      save();
    }
  });

  mount.addEventListener("blur", function (e) {
    if (e.target.name && Object.prototype.hasOwnProperty.call(state.details, e.target.name)) validate(false);
  }, true);

  /* ---------------- boot ---------------- */

  load();
  mount.querySelectorAll("[data-mode]").forEach(function (b) {
    var on = b.getAttribute("data-mode") === state.mode;
    b.setAttribute("aria-pressed", String(on));
    b.className = "btn btn--sm " + (on ? "btn--brand" : "btn--ghost");
  });
  Object.keys(state.details).forEach(function (k) {
    var el = mount.querySelector('[name="' + k + '"]');
    if (el) el.value = state.details[k];
  });

  // Deep link: /contact.html?item=split-35 pre-selects a system.
  var wanted = new URLSearchParams(location.search).get("item");
  if (wanted && byId[wanted]) {
    state.qty[wanted] = state.qty[wanted] || 1;
    if (byId[wanted].business) state.mode = "business";
  }

  renderOptions();
  renderSummary();
})();
