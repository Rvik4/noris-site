/* Спільний скрипт сайту NORIS. Налаштування — у config.js, тут нічого міняти не треба. */
(function () {
  "use strict";

  var CFG = window.NORIS_CONFIG || {};

  function val(key) {
    var v = CFG[key];
    return v === undefined || v === null ? "" : String(v).trim();
  }
  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /* ---------- значення з config.js ---------- */
  each("[data-cfg]", function (el) {
    var v = val(el.getAttribute("data-cfg"));
    if (v) {
      el.textContent = v;
    } else if (el.hasAttribute("data-required")) {
      el.classList.add("missing");
    }
  });
  each("[data-show-if]", function (el) {
    if (val(el.getAttribute("data-show-if"))) el.hidden = false;
  });

  var email = val("supportEmail");
  var emailOk = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(email);
  each("[data-mail]", function (a) {
    if (emailOk) {
      a.href = "mailto:" + email;
      a.textContent = email;
    } else {
      a.classList.add("missing");
    }
  });

  var sha = val("installerSha256");
  var hashRow = document.getElementById("hashRow");
  if (hashRow && /^[a-f0-9]{64}$/i.test(sha)) {
    document.getElementById("hashValue").textContent = sha.toLowerCase();
    hashRow.hidden = false;
  }

  /* ---------- кнопки «Купити»: лише https-адреса з налаштувань ---------- */
  var checkout = null;
  try {
    var u = new URL(val("checkoutUrl"));
    if (u.protocol === "https:") checkout = u.href;
  } catch (e) { checkout = null; }

  var soon = document.getElementById("soon");
  each("[data-buy]", function (a) {
    if (checkout) {
      a.href = checkout;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (soon && typeof soon.showModal === "function") soon.showModal();
      });
    }
  });

  /* ---------- плавний перехід до розділів ---------- */
  each('a[href^="#"]:not([data-buy])', function (a) {
    a.addEventListener("click", function (ev) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      ev.preventDefault();
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- далі — лише для головної сторінки ---------- */
  if (!document.documentElement.hasAttribute("data-i18n-page")) return;

  var EN = {
    navPrograms: "Software", navPay: "Payment", navSafe: "Security", navFaq: "FAQ",
    h1a: "Websites without the ads.", h1b: "One payment, no subscription.",
    lead: "NORIS AdBlock removes ads in browsers on Windows 10 and 11. Pay once and use every feature with no limits.",
    buy: "Buy for $9.99", howPay: "How payment works",
    demoNote: "A demonstration, not a real site",
    ad1: "MEGA SALE −90%! TODAY ONLY", ad2: "This one trick changes everything!",
    ad3: "You are our millionth visitor! Claim your prize", ad4: "Download free NOW",
    hPrograms: "NORIS software",
    abDesc: "An ad blocker for Windows. It installs like any other program and removes ads on the sites you open in your browsers.",
    abF1: "Windows 10 and Windows 11", abF2: "One payment, a lifetime license", abF3: "Every feature included, no paid tiers",
    once: "one time, no subscription",
    asName: "NORIS voice assistant", asBadge: "In development",
    asDesc: "Control your computer by voice: NORIS runs commands and changes Windows settings when you ask. It does not touch your personal files.",
    hPay: "How buying works",
    s1t: "Press “Buy”", s1d: "A secure page of the payment service opens.",
    s2t: "Pay by card", s2d: "Only the payment service sees your card details, not us.",
    s3t: "Get an email", s3d: "A link to the installer arrives in your inbox.",
    s4t: "Install", s4d: "Run the installer and the ads on websites are gone.",
    hSafe: "How we protect your data",
    g1t: "You never enter your card here", g1d: "Payment happens on the payment service’s page. We never see or store your card number.",
    g2t: "No accounts, no passwords", g2d: "This site has no sign-up, so there is no database of your data that could be stolen.",
    g3t: "No trackers", g3d: "This page loads no analytics, ad networks or third-party scripts.",
    g4t: "Verify the installer", g4d: "Compare the SHA-256 checksum of the file you downloaded with this one:",
    hFaq: "Common questions",
    q1: "Is this a subscription?", a1: "No. You pay $9.99 once and get a lifetime license.",
    q2: "Which systems does NORIS AdBlock run on?", a2: "Windows 10 and Windows 11.",
    q3: "Does it block ads inside YouTube videos?", a3: "No. NORIS AdBlock blocks ads on websites, but not video ads inside YouTube.",
    q4: "Is it safe to pay?", a4: "Yes. Payment happens on the payment service’s page over a secure connection. This site never receives or stores your card details.",
    q5: "When will the NORIS voice assistant be released?", a5: "It is still in development. We will announce the release date on this site.",
    q6: "Can I get a refund?", a6a: "Yes. Write to us within", a6b: "days of your purchase and we will refund your money.",
    support: "Support:", taxId: "Tax ID",
    fTerms: "Terms of sale", fRefund: "Payment and refunds", fPrivacy: "Privacy",
    fNote: "These documents are in Ukrainian.",
    soonT: "Sales open soon", soonD: "The payment page is still being connected. Please check back a little later.",
    soonMail: "Questions are welcome at", close: "Close"
  };
  var STATUS = {
    uk: { off: "Захист вимкнено — увімкніть перемикач", on: "Заблоковано оголошень: 4" },
    en: { off: "Protection is off — flip the switch", on: "Ads blocked: 4" }
  };
  var TITLES = { uk: "NORIS — програми для Windows", en: "NORIS — software for Windows" };

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var UK = {};
  nodes.forEach(function (el) { UK[el.getAttribute("data-i18n")] = el.textContent; });

  var lang = "uk";
  try {
    var saved = localStorage.getItem("noris-lang");
    if (saved === "uk" || saved === "en") lang = saved;
  } catch (e) { /* сховище недоступне — лишаємо українську */ }

  var blocked = false;
  var sw = document.getElementById("adSwitch");
  var page = document.getElementById("demoPage");
  var status = document.getElementById("demoStatus");

  function render() {
    var dict = lang === "en" ? EN : UK;
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.textContent = dict[key] !== undefined ? dict[key] : UK[key];
    });
    if (status) status.textContent = STATUS[lang][blocked ? "on" : "off"];
    each("[data-lang]", function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
  }

  each("[data-lang]", function (b) {
    b.addEventListener("click", function () {
      lang = b.getAttribute("data-lang");
      try { localStorage.setItem("noris-lang", lang); } catch (e) { /* не критично */ }
      render();
    });
  });

  if (sw && page) {
    sw.addEventListener("click", function () {
      blocked = !blocked;
      sw.setAttribute("aria-checked", String(blocked));
      page.classList.toggle("blocked", blocked);
      if (status) status.textContent = STATUS[lang][blocked ? "on" : "off"];
    });
  }

  render();
})();
