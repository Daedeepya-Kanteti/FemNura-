/**
 * FemNura Print & Export Engine
 * 
 * Provides robust printing across browser environments, including sandboxed
 * iframes (where visibility:hidden or 0x0 iframes and window.open are suppressed).
 * Features:
 *  - Primary: Dedicated In-DOM print portal with pure @media print isolation
 *  - Secondary: Non-zero layout iframe with opacity 0.001
 *  - Fallback & Direct Export: One-click "Download Printable HTML / PDF" file
 */

/**
 * Executes a clean print of arbitrary HTML content.
 * @param {string} htmlContent - Full HTML string or inner content to print
 * @param {string} [docTitle] - Document title for the print header
 * @param {string} [fallbackDownloadName] - Filename if user saves as HTML
 * @returns {Promise<boolean>}
 */
export function printHtmlDirect(htmlContent, docTitle = "FemNura Document", fallbackDownloadName = "femnura-document.html") {
  return new Promise((resolve) => {
    // 1. Ensure print portal container exists in DOM
    let portal = document.getElementById("femnura-print-portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "femnura-print-portal";
      portal.setAttribute("aria-hidden", "true");
      document.body.appendChild(portal);
    }

    // 2. Format content for portal
    portal.innerHTML = htmlContent;

    // 3. Mark body as printing active
    const originalTitle = document.title;
    if (docTitle) {
      document.title = docTitle;
    }

    document.body.classList.add("femnura-printing-active");

    // Clean up function after print completes or cancels
    let isCleanedUp = false;
    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      document.body.classList.remove("femnura-printing-active");
      document.title = originalTitle;
      if (portal) {
        portal.innerHTML = "";
      }
      window.removeEventListener("afterprint", cleanup);
      resolve(true);
    };

    window.addEventListener("afterprint", cleanup);

    // Give browser brief tick to paint the print portal in DOM
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn("Direct window.print encountered an error, trying iframe fallback:", err);
        // Fallback to layout iframe
        printViaLayoutIframe(htmlContent, docTitle).then(cleanup);
        return;
      }

      // Fallback timeout in case onafterprint doesn't fire in certain browsers
      setTimeout(cleanup, 2000);
    }, 120);
  });
}

/**
 * Iframe fallback using real rendering dimensions with opacity: 0.001
 * so Blink/WebKit calculates the box layout tree properly.
 */
export function printViaLayoutIframe(htmlContent, docTitle = "FemNura Document") {
  return new Promise((resolve) => {
    const existing = document.getElementById("femnura-layout-print-frame");
    if (existing) existing.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "femnura-layout-print-frame";
    // Important: Must NOT have visibility:hidden or width:0;height:0
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;opacity:0.001;pointer-events:none;z-index:-9999;border:0;";
    document.body.appendChild(iframe);

    try {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch {
          window.print();
        }
        setTimeout(() => {
          if (iframe && iframe.parentNode) iframe.remove();
          resolve(true);
        }, 1500);
      }, 300);
    } catch {
      if (iframe && iframe.parentNode) iframe.remove();
      window.print();
      resolve(true);
    }
  });
}

/**
 * Download a standalone, self-contained printable HTML document.
 * This can be double-clicked on any computer/phone to open in a full browser
 * and automatically print with 100% fidelity.
 */
export function downloadPrintableHtmlFile(htmlContent, filename = "femnura-record.html") {
  // Ensure the HTML has the auto-print script if not already present
  let finalHtml = htmlContent;
  if (!finalHtml.includes("window.print()")) {
    finalHtml = finalHtml.replace(
      "</body>",
      `<script>window.addEventListener("load", function() { setTimeout(function() { window.print(); }, 400); });</script></body>`
    );
  }

  const blob = new Blob([finalHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Builds standard Wallet Medical ID Card HTML
 */
export function generateWalletCardHtml({
  patientName = "Patient",
  bloodGroup = "O+",
  allergies = "None declared",
  conditions = "None declared",
  emergencyNotes = "Please contact primary emergency contact immediately.",
  primaryContact = { name: "Not assigned", phone: "", relation: "" },
  secondaryContact = null,
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>FemNura Emergency Medical ID Wallet Card - ${patientName}</title>
  <style>
    @page {
      size: auto;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 16px;
      color: #2e1f2d;
      background: #ffffff;
    }
    .print-wrapper {
      max-width: 440px;
      margin: 0 auto;
    }
    .card {
      border: 2.5px solid #5f3860;
      border-radius: 16px;
      padding: 22px;
      background: #ffffff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f3ebf6;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .badge {
      background: #dc2626;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .brand {
      color: #5f3860;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }
    .patient-name {
      font-size: 22px;
      font-weight: 800;
      color: #421845;
      margin: 0 0 14px 0;
    }
    .field {
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #7a5689;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: #1e1120;
    }
    .val-blood {
      font-size: 18px;
      font-weight: 800;
      color: #dc2626;
    }
    .val-contact {
      color: #421845;
      font-weight: 700;
    }
    .notice {
      margin-top: 14px;
      padding: 10px 12px;
      background: #fdf2f8;
      border-left: 3.5px solid #db2777;
      border-radius: 6px;
      font-size: 11px;
      color: #831843;
      font-weight: 700;
      line-height: 1.4;
    }
    .footer {
      font-size: 10px;
      color: #888888;
      margin-top: 14px;
      text-align: center;
      border-top: 1px dashed #dddddd;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="print-wrapper">
    <div class="card">
      <div class="header">
        <span class="badge">EMERGENCY MEDICAL ID</span>
        <span class="brand">FemNura</span>
      </div>
      <h1 class="patient-name">${patientName}</h1>

      <div class="field">
        <span class="label">Blood Group</span>
        <span class="val val-blood">${bloodGroup}</span>
      </div>

      <div class="field">
        <span class="label">Primary Emergency Contact</span>
        <span class="val val-contact">
          ${primaryContact?.name ? `${primaryContact.name} (${primaryContact.relation || "Contact"}) — ${primaryContact.phone}` : "Not assigned"}
        </span>
      </div>

      ${
        secondaryContact?.name
          ? `
      <div class="field">
        <span class="label">Secondary Emergency Contact</span>
        <span class="val val-contact">
          ${secondaryContact.name} (${secondaryContact.relation || "Contact"}) — ${secondaryContact.phone}
        </span>
      </div>
      `
          : ""
      }

      <div class="field">
        <span class="label">Known Medical Conditions</span>
        <span class="val">${conditions || "None declared"}</span>
      </div>

      <div class="field">
        <span class="label">Known Allergies</span>
        <span class="val">${allergies || "None declared"}</span>
      </div>

      <div class="field">
        <span class="label">Emergency Instructions</span>
        <span class="val">${emergencyNotes || "Please contact the emergency contacts listed above immediately."}</span>
      </div>

      <div class="notice">
        FIRST RESPONDERS: In the event of an emergency, please notify the primary emergency contact immediately.
      </div>

      <div class="footer">
        Cut / Fold along border to carry in wallet or phone pouch.<br/>
        FemNura — Your Health. Your Priority. Verified Medical Alert Profile
      </div>
    </div>
  </div>
</body>
</html>`;
}
