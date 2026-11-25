/* Foreman — "what is the silence costing you" calculator.
 *
 * The single most persuasive thing on a B2B page for this audience is their own
 * numbers. Four inputs they know off the top of their head, one figure out.
 *
 * Deliberately conservative: it assumes recovered enquiries convert at the SAME
 * rate as ones already answered, when in practice a fast reply converts better.
 * A calculator that flatters the buyer gets dismissed by exactly the sceptical
 * operator we want. Everything runs in the browser; nothing is sent anywhere.
 */

(function () {
  "use strict";

  var root = document.querySelector("[data-roi-root]");
  if (!root || !window.ROI_CONFIG) return;

  var CFG = window.ROI_CONFIG;
  var S = Object.assign({}, CFG.defaults);

  var money = function (n) {
    return "£" + Math.round(n).toLocaleString("en-GB");
  };

  var FIELDS = [
    { key: "enquiries", label: "Enquiries a week", min: 1, max: 100, step: 1,
      hint: "Calls, forms and messages — everything that could become a job", fmt: function (v) { return v; } },
    { key: "jobValue", label: "Average job value", min: 200, max: 15000, step: 100,
      hint: "What a typical won job is worth to you", fmt: money },
    { key: "winRate", label: "Of the ones you reply to, how many convert?", min: 5, max: 90, step: 1,
      hint: "Your gut figure is fine", fmt: function (v) { return v + "%"; } },
    { key: "missed", label: "How many never get a proper reply?", min: 0, max: 80, step: 1,
      hint: "Missed calls, forms you got to days later, quotes never chased", fmt: function (v) { return v + "%"; } }
  ];

  function calc() {
    var perYear = S.enquiries * 52;
    var unanswered = perYear * (S.missed / 100);
    // Not every unanswered enquiry is a lost job — some ring back, some were
    // never real. lostShare is the portion genuinely gone.
    var lostJobs = unanswered * (S.winRate / 100) * CFG.assumptions.lostShare;
    var lostRevenue = lostJobs * S.jobValue;

    var recoveredJobs = lostJobs * CFG.assumptions.recoveredShare;
    var recoveredRevenue = recoveredJobs * S.jobValue;

    var cost = CFG.planPrice * 12;
    return {
      lostJobs: lostJobs,
      lostRevenue: lostRevenue,
      recoveredJobs: recoveredJobs,
      recoveredRevenue: recoveredRevenue,
      cost: cost,
      multiple: cost > 0 ? recoveredRevenue / cost : 0,
      paysForItself: recoveredRevenue > cost
    };
  }

  function render() {
    var r = calc();

    root.querySelector("[data-roi-lost]").textContent = money(r.lostRevenue);
    root.querySelector("[data-roi-lostjobs]").textContent =
      r.lostJobs < 1 ? "under one job" : Math.round(r.lostJobs) + (Math.round(r.lostJobs) === 1 ? " job" : " jobs");
    root.querySelector("[data-roi-recovered]").textContent = money(r.recoveredRevenue);
    root.querySelector("[data-roi-cost]").textContent = money(r.cost);

    var verdict = root.querySelector("[data-roi-verdict]");
    if (r.recoveredRevenue <= 0) {
      verdict.textContent = "On these numbers nothing is leaking — which is worth knowing too.";
      verdict.className = "roi-verdict";
    } else if (r.paysForItself) {
      verdict.innerHTML = "That is <strong>" + r.multiple.toFixed(1) + "×</strong> what Foreman costs over a year.";
      verdict.className = "roi-verdict roi-verdict--good";
    } else {
      verdict.textContent = "On these numbers Foreman would not pay for itself, and we would tell you so on the call.";
      verdict.className = "roi-verdict roi-verdict--warn";
    }

    FIELDS.forEach(function (f) {
      var out = root.querySelector('[data-out="' + f.key + '"]');
      if (out) out.textContent = f.fmt(S[f.key]);
    });
  }

  // Build the controls rather than hand-writing four near-identical blocks.
  var controls = root.querySelector("[data-roi-controls]");
  controls.innerHTML = FIELDS.map(function (f) {
    return (
      '<div class="roi-field">' +
        '<label for="roi-' + f.key + '">' + f.label +
          '<output data-out="' + f.key + '"></output>' +
        "</label>" +
        '<input type="range" id="roi-' + f.key + '" name="' + f.key + '" ' +
          'min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + S[f.key] + '">' +
        '<span class="roi-hint">' + f.hint + "</span>" +
      "</div>"
    );
  }).join("");

  root.addEventListener("input", function (e) {
    if (!e.target.name || !(e.target.name in S)) return;
    S[e.target.name] = Number(e.target.value);
    render();
  });

  var reset = root.querySelector("[data-roi-reset]");
  if (reset) {
    reset.addEventListener("click", function () {
      S = Object.assign({}, CFG.defaults);
      FIELDS.forEach(function (f) {
        var el = root.querySelector("#roi-" + f.key);
        if (el) el.value = S[f.key];
      });
      render();
    });
  }

  render();
})();
