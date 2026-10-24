import React, { useState } from "react";
import { Download, Trash2, ShieldCheck, Check, Globe } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Disclaimer, Button, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

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
  } = useDemoData();

  const notif = userSettings?.notifications ?? true;
  const dataSharing = userSettings?.dataSharing ?? false;
  const language = userSettings?.language || "English";

  const [exportSuccess, setExportSuccess] = useState(false);

  const setNotif = (val) => updateSettings({ notifications: typeof val === "function" ? val(notif) : val });
  const setDataSharing = (val) => updateSettings({ dataSharing: typeof val === "function" ? val(dataSharing) : val });
  const setLanguage = (val) => updateSettings({ language: val });

  const exportAllData = () => {
    const exportPayload = {
      app: "FemNura",
      tagline: "Your Health. Your Priority.",
      exportDate: new Date().toISOString(),
      user: {
        id: currentAccount?.id,
        name: userName,
        email: userEmail,
      },
      healthRecords: {
        symptoms,
        moods,
        cycleEntries,
        reminders,
        doctorSessions,
        trustedContacts,
        emergencyProfile,
        settings: userSettings,
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FemNura_${(userName || "health").toLowerCase()}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
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
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-plum-600" />
          <h2 className="font-display text-lg font-semibold text-plum-800">Language & Regional Preferences</h2>
        </div>
        <p className="text-xs text-plum-500 mb-4">Choose your preferred reading and interface language.</p>
        <div className="flex flex-wrap gap-2">
          {["English", "Hindi", "Spanish", "French", "Arabic"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                language === l
                  ? "bg-plum-700 text-white border-plum-700 shadow-2xs"
                  : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-plum-400 mt-3">
          Active preference: <strong className="text-plum-700">{language}</strong>. Date formatting and reminders adapt to this regional locale.
        </p>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-plum-800">Your Data Sovereignty</h2>
          <Badge tone="sage">Your Data Stays Yours</Badge>
        </div>
        <p className="text-sm text-plum-600 leading-relaxed mb-5">
          FemNura stores your symptoms, moods, cycle details, and documents directly in your private device storage partition. You can export a full copy of your health records at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={exportAllData} className="gap-2">
            {exportSuccess ? <Check size={14} className="text-sage-600" /> : <Download size={14} />}
            {exportSuccess ? "Data Exported!" : "Export My Complete Health Data (JSON)"}
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
