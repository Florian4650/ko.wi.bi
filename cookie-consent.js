/* =========================================================================
   COOKIE-CONSENT für bwl-kompakt.com
   -------------------------------------------------------------------------
   DSGVO-konformes Opt-in-Banner. Lädt Google Analytics & Google Ads ERST
   nach aktiver Zustimmung. Ohne Zustimmung wird NICHTS getrackt.

   EINBINDUNG: Eine einzige Zeile vor </body> in jede HTML-Seite:
       <script src="cookie-consent.js" defer></script>

   KONFIGURATION: Trage unten bei CONFIG deine echten IDs ein, sobald du
   Analytics und Ads eingerichtet hast. Vorher einfach leer lassen ("") –
   dann zeigt das Banner sich trotzdem korrekt, lädt aber nichts.
   ========================================================================= */

(function () {
  "use strict";

  // ----------------------- CONFIG (hier deine IDs eintragen) ---------------
  var CONFIG = {
    ga4Id:        "",   // z.B. "G-XXXXXXXXXX"  (Google Analytics 4 Mess-ID)
    googleAdsId:  "",   // z.B. "AW-XXXXXXXXXX" (Google Ads Conversion-ID)
    gtmId:        "",   // z.B. "GTM-XXXXXXX"   (Google Tag Manager – falls genutzt)
    consentName:  "kowibi_consent",  // Name des Einwilligungs-Cookies
    consentDays:  180                // Gültigkeit der Entscheidung in Tagen
  };
  // -------------------------------------------------------------------------

  // --- kleine Cookie-Helfer ---
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() +
      ";path=/;SameSite=Lax";
  }
  function getCookie(name) {
    var match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return match ? match.pop() : "";
  }

  // --- Tracking-Skripte laden (erst nach Zustimmung aufgerufen) ---
  function loadTracking() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());

    // Google Tag Manager
    if (CONFIG.gtmId) {
      var gtm = document.createElement("script");
      gtm.async = true;
      gtm.src = "https://www.googletagmanager.com/gtm.js?id=" + CONFIG.gtmId;
      document.head.appendChild(gtm);
    }
    // Google Analytics 4
    if (CONFIG.ga4Id) {
      var ga = document.createElement("script");
      ga.async = true;
      ga.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.ga4Id;
      document.head.appendChild(ga);
      gtag("config", CONFIG.ga4Id, { anonymize_ip: true });
    }
    // Google Ads
    if (CONFIG.googleAdsId) {
      if (!CONFIG.ga4Id) {
        var aw = document.createElement("script");
        aw.async = true;
        aw.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.googleAdsId;
        document.head.appendChild(aw);
      }
      gtag("config", CONFIG.googleAdsId);
    }
  }

  // --- Banner-HTML + Styles erzeugen ---
  function buildBanner() {
    var style = document.createElement("style");
    style.textContent = [
      ".cc-overlay{position:fixed;inset:0;background:rgba(15,25,40,.45);z-index:99998;backdrop-filter:blur(2px);}",
      ".cc-banner{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;",
        "width:min(560px,calc(100% - 32px));background:#fff;color:#222;border-radius:14px;",
        "box-shadow:0 12px 40px rgba(15,25,40,.28);padding:24px 24px 20px;font-family:Arial,Helvetica,sans-serif;}",
      ".cc-banner h2{margin:0 0 8px;font-size:18px;color:#1F3A5F;}",
      ".cc-banner p{margin:0 0 14px;font-size:14px;line-height:1.55;color:#444;}",
      ".cc-banner a{color:#2E75B6;text-decoration:underline;}",
      ".cc-btns{display:flex;flex-wrap:wrap;gap:10px;}",
      ".cc-btn{flex:1 1 auto;min-width:130px;border:0;border-radius:9px;padding:12px 16px;",
        "font-size:14px;font-weight:700;cursor:pointer;transition:opacity .15s;}",
      ".cc-btn:hover{opacity:.88;}",
      ".cc-accept{background:#1F3A5F;color:#fff;}",
      ".cc-decline{background:#eef1f5;color:#1F3A5F;}",
      ".cc-settings-link{display:inline-block;margin-top:12px;font-size:12px;color:#777;",
        "background:none;border:0;cursor:pointer;text-decoration:underline;padding:0;}",
      ".cc-reopen{position:fixed;left:16px;bottom:16px;z-index:99997;width:42px;height:42px;",
        "border-radius:50%;border:0;background:#1F3A5F;color:#fff;font-size:20px;cursor:pointer;",
        "box-shadow:0 4px 14px rgba(15,25,40,.25);display:none;}",
      "@media(max-width:520px){.cc-banner{bottom:0;border-radius:14px 14px 0 0;width:100%;}}"
    ].join("");
    document.head.appendChild(style);

    var overlay = document.createElement("div");
    overlay.className = "cc-overlay";
    overlay.id = "cc-overlay";

    var banner = document.createElement("div");
    banner.className = "cc-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<h2>Wir respektieren Ihre Privatsph&auml;re</h2>' +
      '<p>Wir verwenden Cookies, um die Nutzung unserer Website zu verstehen und ' +
      'unsere Inhalte zu verbessern. Statistik- und Marketing-Cookies werden nur ' +
      'mit Ihrer Einwilligung geladen. Technisch notwendige Funktionen bleiben ' +
      'immer aktiv. Mehr dazu in unserer ' +
      '<a href="datenschutz.html">Datenschutzerkl&auml;rung</a>.</p>' +
      '<div class="cc-btns">' +
        '<button class="cc-btn cc-accept" id="cc-accept">Alle akzeptieren</button>' +
        '<button class="cc-btn cc-decline" id="cc-decline">Nur notwendige</button>' +
      '</div>';

    var reopen = document.createElement("button");
    reopen.className = "cc-reopen";
    reopen.id = "cc-reopen";
    reopen.title = "Cookie-Einstellungen";
    reopen.innerHTML = "&#9881;";

    document.body.appendChild(overlay);
    document.body.appendChild(banner);
    document.body.appendChild(reopen);

    function hide() {
      overlay.style.display = "none";
      banner.style.display = "none";
      reopen.style.display = "block";
    }
    function show() {
      overlay.style.display = "block";
      banner.style.display = "block";
      reopen.style.display = "none";
    }

    document.getElementById("cc-accept").addEventListener("click", function () {
      setCookie(CONFIG.consentName, "accepted", CONFIG.consentDays);
      loadTracking();
      hide();
    });
    document.getElementById("cc-decline").addEventListener("click", function () {
      setCookie(CONFIG.consentName, "declined", CONFIG.consentDays);
      hide();
    });
    reopen.addEventListener("click", show);

    return { show: show, hide: hide };
  }

  // --- Start: Entscheidung prüfen ---
  function init() {
    var ui = buildBanner();
    var choice = getCookie(CONFIG.consentName);
    if (choice === "accepted") {
      loadTracking();
      ui.hide();
    } else if (choice === "declined") {
      ui.hide();
    } else {
      ui.show(); // noch keine Entscheidung -> Banner zeigen
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
