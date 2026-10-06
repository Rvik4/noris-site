/* Перевірка заповнення config.js. Нічого нікуди не надсилає. */
(function () {
  "use strict";
  var list = document.getElementById("checkList");
  var sum = document.getElementById("checkSum");
  var C = window.NORIS_CONFIG;

  if (!C || typeof C !== "object") {
    sum.textContent = "Файл config.js не завантажився. Найчастіше причина — випадково видалена лапка або кома. Порівняйте його з початковою версією.";
    sum.classList.add("missing");
    return;
  }

  function val(k) { var v = C[k]; return v === undefined || v === null ? "" : String(v).trim(); }
  function isHttps(s) { try { return new URL(s).protocol === "https:"; } catch (e) { return false; } }
  function any(s) { return s.length > 0; }

  var rules = [
    { k: "checkoutUrl",   name: "Посилання на оплату", need: true,  test: isHttps, hint: "Повна адреса сторінки оплати, починається з https://" },
    { k: "supportEmail",  name: "Пошта підтримки",     need: true,  test: function (s) { return /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(s); }, hint: "Наприклад: support@ваш-домен" },
    { k: "sellerName",    name: "Продавець (ФОП)",     need: true,  test: any, hint: "Як у реєстрації ФОП" },
    { k: "sellerTaxId",   name: "РНОКПП",              need: true,  test: function (s) { return /^\d{10}$/.test(s); }, hint: "Рівно 10 цифр" },
    { k: "sellerAddress", name: "Адреса продавця",     need: true,  test: any, hint: "Наприклад: Україна, м. Київ" },
    { k: "offerDate",     name: "Дата оферти",         need: true,  test: any, hint: "Дата публікації оферти, наприклад 01.11.2026" },
    { k: "refundDays",    name: "Днів на повернення",  need: true,  test: function (s) { return /^\d+$/.test(s) && Number(s) > 0; }, hint: "Ціле число, наприклад 14" },
    { k: "sellerPhone",   name: "Телефон",             need: false, test: any, hint: "Платіжні сервіси часто вимагають телефон на сайті" },
    { k: "installerSha256", name: "SHA-256 інсталятора", need: false, test: function (s) { return /^[a-f0-9]{64}$/i.test(s); }, hint: "64 символи: цифри й літери a–f" }
  ];

  var needed = 0, done = 0;
  rules.forEach(function (r) {
    var v = val(r.k), filled = v.length > 0, good = filled && r.test(v);
    var cls, label;
    if (good) { cls = "ok"; label = "Готово"; }
    else if (filled) { cls = "bad"; label = "Помилка"; }
    else if (r.need) { cls = "bad"; label = "Немає"; }
    else { cls = "warn"; label = "Бажано"; }
    if (r.need) { needed++; if (good) done++; }

    var li = document.createElement("li");
    li.className = cls;
    var st = document.createElement("span"); st.className = "state"; st.textContent = label;
    var nm = document.createElement("span"); nm.textContent = r.name + " (" + r.k + ")";
    var sm = document.createElement("small"); sm.textContent = good ? v : r.hint;
    li.appendChild(st); li.appendChild(nm); li.appendChild(sm);
    list.appendChild(li);
  });

  sum.textContent = done === needed
    ? "Усі обов’язкові поля заповнено (" + done + " з " + needed + ")."
    : "Заповнено " + done + " з " + needed + " обов’язкових полів.";
})();
