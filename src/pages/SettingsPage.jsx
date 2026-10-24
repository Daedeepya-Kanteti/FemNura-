import React, { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function SettingsPage() {
  const { userName, userEmail, userSettings, updateSettings } = useDemoData();
  const notif = userSettings?.notifications ?? true;
  const dataSharing = userSettings?.dataSharing ?? false;
  const language = userSettings?.language || "English";

  const setNotif = (val) => updateSettings({ notifications: typeof val === "function" ? val(notif) : val });
  const setDataSharing = (val) => updateSettings({ dataSharing: typeof val === "function" ? val(dataSharing) : val });
  const setLanguage = (val) => updateSettings({ language: val });

  return (
    <div>
      <PageHeader eyebrow="Settings & Privacy" title="Your preferences" subtitle="Manage how FemNura works for you. Credentials and entries are saved to your device." />

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Display name" value={userName || "Friend"} />
          <Field label="Account Email" value={userEmail || "Local Saved Profile"} />
          <Field label="Storage state" value="Saved to this device" />
          <Field label="Credentials" value="Google-style auto-save enabled" />
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Preferences</h2>
        <div className="divide-y divide-plum-100">
          <Row title="Reminder notifications" desc="Receive gentle nudges for the reminders you set up." checked={notif} onChange={() => setNotif((v) => !v)} />
          <Row title="Share anonymised insights for research" desc="Optional, off by default. Never shared without your consent." checked={dataSharing} onChange={() => setDataSharing((v) => !v)} />
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Language</h2>
        <div className="flex flex-wrap gap-2">
          {["English", "Hindi", "Spanish", "French", "Arabic"].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                language === l ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {language !== "English" && (
          <p className="text-xs text-plum-400 mt-3">
            Full regional-language translation is planned for a future phase and is not yet available in this demo.
          </p>
        )}
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-3">Privacy & data</h2>
        <p className="text-sm text-plum-500 leading-relaxed">
          In this demo, your entries exist only for your current session and are not stored on any server. A
          published version of FemNura would require a secure, authenticated backend to keep your health
          information private and retrievable across sessions.
        </p>
      </Card>

      <Disclaimer compact />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-plum-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-plum-800 font-semibold">{value}</p>
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
        className={`w-14 h-8 rounded-full p-1 transition-colors focus-ring shrink-0 ${checked ? "bg-sage-500" : "bg-plum-200"}`}
      >
        <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
