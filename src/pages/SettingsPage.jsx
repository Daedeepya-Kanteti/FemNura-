import React, { useState } from "react";
import { Download, Trash2, ShieldCheck, Check, FileText } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Disclaimer, Button, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import { downloadPrintableHtmlFile } from "../utils/printHelper.js";

export default function SettingsPage() {
  const {
    userName,
    userEmail,
    currentAccount,
    userSettings,
    updateSettings,
    symptoms,
    moods,
    cycleEntries,
    reminders,
    doctorSessions,
    trustedContacts,
    emergencyProfile,
    userLocation,
    isLocationEnabled,
    toggleLocationTracking,
    setManualLocation,
    CITY_PRESETS,
    locationNotice,
  } = useDemoData();

  const notif = userSettings?.notifications ?? true;
  const dataSharing = userSettings?.dataSharing ?? false;

  const setNotif = (val) => updateSettings({ notifications: typeof val === "function" ? val(notif) : val });
  const setDataSharing = (val) => updateSettings({ dataSharing: typeof val === "function" ? val(dataSharing) : val });

  const generateHealthReportHtml = () => {
    const primaryContact = trustedContacts[0] || { name: "Not assigned", phone: "N/A", relation: "N/A" };
    const secondaryContact = trustedContacts[1] || null;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FemNura Complete Health Record - ${userName || "Patient"}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #2e1f2d;
              margin: 30px;
              line-height: 1.5;
              background: #fff;
            }
            @media print {
              body { margin: 15mm; }
              @page { size: A4; margin: 12mm 15mm; }
              .no-print { display: none !important; }
            }
            .header {
              border-bottom: 2px solid #5f3860;
              padding-bottom: 14px;
              margin-bottom: 22px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .logo { font-size: 26px; font-weight: bold; color: #5f3860; font-family: Georgia, serif; }
            .tagline { font-size: 13px; color: #7a5689; font-weight: 600; margin-top: 2px; }
            .meta { font-size: 12px; color: #555; text-align: right; }
            .badge { background: #5f3860; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            h2 {
              color: #4b234d;
              font-size: 15px;
              border-bottom: 1.5px solid #e5dbe7;
              padding-bottom: 5px;
              margin-top: 24px;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .grid-box {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              background: #faf7fc;
              border: 1px solid #e2d7e5;
              border-radius: 8px;
              padding: 12px 16px;
              margin-bottom: 16px;
              font-size: 13px;
            }
            .grid-item strong { color: #5f3860; display: block; font-size: 11px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
            th {
              background: #f3ecf5;
              color: #421845;
              text-align: left;
              padding: 8px 10px;
              border: 1px solid #dcd0e0;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 11px;
            }
            td { padding: 8px 10px; border: 1px solid #e8dfea; color: #333; vertical-align: top; }
            tr:nth-child(even) { background: #fdfbfe; }
            .sev-mild { color: #2e7d32; font-weight: 600; }
            .sev-moderate { color: #d97706; font-weight: 600; }
            .sev-severe { color: #dc2626; font-weight: 700; }
            .empty-text { font-style: italic; color: #888; font-size: 12px; padding: 8px 0; }
            ol { padding-left: 20px; margin: 6px 0; }
            li { margin-bottom: 6px; font-size: 13px; color: #333; }
            .footer {
              margin-top: 35px;
              font-size: 11px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 12px;
              text-align: center;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">FemNura</div>
              <div class="tagline">Your Health. Your Priority.</div>
              <div style="margin-top: 6px;"><span class="badge">Official Health Data Dossier (PDF)</span></div>
            </div>
            <div class="meta">
              <strong>Patient:</strong> ${userName || "Patient"}<br/>
              <strong>Email / ID:</strong> ${userEmail || currentAccount?.id || "N/A"}<br/>
              <strong>Export Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br/>
              <strong>Language / Locale:</strong> English
            </div>
          </div>

          <h2>1. Emergency & Medical ID Overview</h2>
          <div class="grid-box">
            <div class="grid-item"><strong>Blood Group</strong> <span style="font-size:16px; font-weight:bold; color:#dc2626;">${emergencyProfile?.bloodGroup || "O+"}</span></div>
            <div class="grid-item"><strong>Known Allergies</strong> ${emergencyProfile?.allergies || "None declared"}</div>
            <div class="grid-item"><strong>Medical Conditions</strong> ${emergencyProfile?.conditions || "None declared"}</div>
            <div class="grid-item"><strong>Emergency Notes</strong> ${emergencyProfile?.emergencyNotes || "Call primary contact immediately."}</div>
            <div class="grid-item"><strong>Primary Emergency Contact</strong> ${primaryContact.name} (${primaryContact.relation}) — ${primaryContact.phone}</div>
            ${secondaryContact ? `<div class="grid-item"><strong>Secondary Contact</strong> ${secondaryContact.name} (${secondaryContact.relation}) — ${secondaryContact.phone}</div>` : ""}
          </div>

          <h2>2. Recorded Symptoms History (${symptoms.length} Total Logs)</h2>
          ${
            symptoms.length === 0
              ? `<div class="empty-text">No symptoms recorded in this patient partition.</div>`
              : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 22%;">Date & Time</th>
                    <th style="width: 24%;">Symptom Name</th>
                    <th style="width: 16%;">Severity</th>
                    <th style="width: 38%;">Patient Notes / Context</th>
                  </tr>
                </thead>
                <tbody>
                  ${symptoms
                    .map(
                      (s) => `
                    <tr>
                      <td>${new Date(s.date).toLocaleString()}</td>
                      <td><strong>${s.name}</strong></td>
                      <td><span class="${s.severity === "Severe" ? "sev-severe" : s.severity === "Moderate" ? "sev-moderate" : "sev-mild"}">${s.severity}</span></td>
                      <td>${s.notes || "—"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
          }

          <h2>3. Emotional Wellness & Mood Log (${moods.length} Entries)</h2>
          ${
            moods.length === 0
              ? `<div class="empty-text">No mood entries recorded yet.</div>`
              : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 24%;">Date & Time</th>
                    <th style="width: 26%;">Recorded Mood</th>
                    <th style="width: 50%;">Reflections / Emotional Triggers</th>
                  </tr>
                </thead>
                <tbody>
                  ${moods
                    .map(
                      (m) => `
                    <tr>
                      <td>${new Date(m.date).toLocaleString()}</td>
                      <td><strong>${m.mood}</strong></td>
                      <td>${m.notes || "—"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
          }

          <h2>4. Menstrual Health Records (${cycleEntries.length} Entries)</h2>
          ${
            cycleEntries.length === 0
              ? `<div class="empty-text">No menstrual cycle entries recorded yet.</div>`
              : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 24%;">Date & Time</th>
                    <th style="width: 26%;">Cycle Phase</th>
                    <th style="width: 20%;">Flow Level</th>
                    <th style="width: 30%;">Notes & Cramp Context</th>
                  </tr>
                </thead>
                <tbody>
                  ${cycleEntries
                    .map(
                      (c) => `
                    <tr>
                      <td>${new Date(c.date).toLocaleString()}</td>
                      <td><strong>${c.phase}</strong></td>
                      <td>${c.flow || "—"}</td>
                      <td>${c.notes || "—"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
          }

          <h2>5. Doctor-Prep Questions & Consultation History (${doctorSessions.length} Sessions)</h2>
          ${
            doctorSessions.length === 0
              ? `<div class="empty-text">No doctor question sessions generated yet.</div>`
              : doctorSessions
                  .map(
                    (ds, i) => `
                <div style="background:#faf7fc; border:1px solid #e2d7e5; border-radius:8px; padding:12px 16px; margin-bottom:12px;">
                  <strong style="color:#5f3860;">Session #${i + 1} — ${new Date(ds.date).toLocaleDateString()}</strong>
                  <ol>
                    ${ds.questions.map((q) => `<li>${q}</li>`).join("")}
                  </ol>
                </div>
              `
                  )
                  .join("")
          }

          <h2>6. Scheduled Health Reminders (${reminders.length} Reminders)</h2>
          ${
            reminders.length === 0
              ? `<div class="empty-text">No reminders scheduled.</div>`
              : `
              <table>
                <thead>
                  <tr>
                    <th>Reminder Title</th>
                    <th>Scheduled Alarm Time</th>
                    <th>Repeat Frequency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${reminders
                    .map(
                      (r) => `
                    <tr>
                      <td><strong>${r.title}</strong></td>
                      <td>${r.time || "09:00"}</td>
                      <td>${r.frequency || "Daily"}</td>
                      <td>${r.active ? "Active" : "Paused"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
          }

          <div class="footer">
            <strong>Clinical Disclaimer:</strong> FemNura provides personal health tracking, symptom organization, and doctor-visit preparation. It does not provide medical diagnoses or replace a licensed healthcare professional. Always consult your physician for medical evaluations.<br/>
            <em>FemNura — Your Health. Your Priority. Privately compiled for ${userName || "Patient"}.</em>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    return html;
  };

  const downloadHealthReportAsHtml = () => {
    const html = generateHealthReportHtml();
    downloadPrintableHtmlFile(html, `FemNura-Health-Record-${(userName || "Patient").replace(/\s+/g, "_")}.html`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Settings & Privacy"
        title="Your preferences"
        subtitle="Manage how FemNura works for you. Credentials and records are safely partitioned on your device."
      />

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Profile & Security</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Display name" value={userName || "Friend"} />
          <Field label="Account Email" value={userEmail || "Local Saved Profile"} />
          <Field label="Storage state" value="Private partition active" />
          <Field label="Credentials" value="Google-style 1-click login enabled" />
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Notification & Privacy Preferences</h2>
        <div className="divide-y divide-plum-100">
          <Row
            title="Reminder notifications"
            desc="Receive gentle local nudges for hydration, mood check-ins, and medications."
            checked={notif}
            onChange={() => setNotif((v) => !v)}
          />
          <Row
            title="Share anonymised insights for research"
            desc="Optional, off by default. Never shared with advertisers or third parties."
            checked={dataSharing}
            onChange={() => setDataSharing((v) => !v)}
          />
          <Row
            title="Emergency GPS location tracking"
            desc="Opt-in only. Calculates exact distances to nearby hospital emergency rooms in the SOS protocol and includes your live coordinates in emergency alerts."
            checked={isLocationEnabled}
            onChange={() => toggleLocationTracking(!isLocationEnabled)}
          />
        </div>
        {isLocationEnabled && userLocation && (
          <div className="mt-4 p-4 rounded-2xl bg-lavender-50/70 border border-plum-200 text-xs text-plum-900 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      userLocation.source === "gps" ? "bg-emerald-500 animate-pulse" : "bg-plum-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      userLocation.source === "gps" ? "text-emerald-800" : "text-plum-800"
                    }`}
                  >
                    {userLocation.source === "gps"
                      ? "Active On-Device GPS Lock"
                      : "Network / Area Location Active"}
                  </span>
                </div>
                <p className="font-bold text-plum-950 text-xs">
                  📍 {userLocation.address || `${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°`}
                </p>
                {userLocation.isApproximate && userLocation.permissionRestricted && (
                  <p className="text-[11px] text-plum-600 mt-1">
                    Browser GPS hardware access was blocked or denied by the browser/iframe sandbox. Regional area coordinates are used to calculate distances to hospital ERs and triage centers.
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold text-plum-700 bg-plum-100 border border-plum-200 px-2 py-0.5 rounded-full shrink-0">
                {userLocation.source === "gps" ? `±${userLocation.accuracy}m` : "Area Mode"}
              </span>
            </div>

            {/* Quick City Presets */}
            <div className="pt-2 border-t border-plum-200/60">
              <span className="text-[10px] uppercase font-bold text-plum-600 block mb-1.5">
                Switch City / Emergency Care Area:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CITY_PRESETS?.map((preset) => {
                  const targetLat = preset.latitude ?? preset.lat;
                  const targetLng = preset.longitude ?? preset.lng;
                  const isCurrent =
                    userLocation &&
                    Math.abs((userLocation.latitude ?? userLocation.lat) - targetLat) < 0.04 &&
                    Math.abs((userLocation.longitude ?? userLocation.lng) - targetLng) < 0.04;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setManualLocation(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? "bg-plum-900 text-white border-plum-900 font-bold shadow-2xs"
                          : "bg-white hover:bg-lavender-100 text-plum-900 border-plum-200 font-medium"
                      }`}
                    >
                      {isCurrent && "✓ "}
                      {preset.name.split(" (")[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-plum-800">Your Data Sovereignty</h2>
          <Badge tone="sage">Your Data Stays Yours</Badge>
        </div>
        <p className="text-sm text-plum-600 leading-relaxed mb-5">
          FemNura stores your symptoms, moods, cycle details, and documents directly in your private device storage partition. You can export a full copy of your health records at any time.
        </p>

        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={downloadHealthReportAsHtml}
            className="gap-2 bg-plum-800 hover:bg-plum-900 shadow-sm text-sm font-bold text-white px-6 py-3 cursor-pointer"
            title="Download complete health record"
          >
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </Card>

      <Disclaimer compact />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-plum-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-plum-800 font-semibold text-sm">{value}</p>
    </div>
  );
}

function Row({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div>
        <p className="font-semibold text-plum-800 text-sm">{title}</p>
        <p className="text-xs text-plum-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onChange}
        aria-pressed={checked}
        className={`w-14 h-8 rounded-full p-1 transition-colors focus-ring shrink-0 cursor-pointer ${
          checked ? "bg-sage-500" : "bg-plum-200"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
