import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ShieldAlert,
  Phone,
  AlertTriangle,
  Heart,
  Droplet,
  FileText,
  User,
  ArrowLeft,
  CheckCircle,
  Share2,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import {
  COUNTRY_CODES,
  formatPhoneNumberWithCode,
  getDialableNumber,
} from "../utils/countryCodes.js";

export default function EmergencyView() {
  const [params] = useSearchParams();
  const [contactCodes, setContactCodes] = useState({});

  // Read data from URL parameters
  const uid = params.get("uid") || "";
  const name = params.get("name") || params.get("user") || "Patient";
  const bloodGroup = params.get("bg") || "O+";
  const allergies = params.get("al") || "None known / declared";
  const conditions = params.get("cd") || "None reported";
  const emergencyNotes =
    params.get("nt") || "Please contact my primary emergency contact immediately.";

  // Contacts
  const c1Name = params.get("c1n") || "";
  const c1Phone = params.get("c1p") || "";
  const c1Rel = params.get("c1r") || "Primary contact";

  const c2Name = params.get("c2n") || "";
  const c2Phone = params.get("c2p") || "";
  const c2Rel = params.get("c2r") || "Secondary contact";

  // If on the same device and user data exists in localStorage, pull latest state
  let localData = null;
  if (uid && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`femnura_userdata_v2_${uid}`);
      if (raw) localData = JSON.parse(raw);
    } catch {}
  }

  const finalName = localData?.userName || name;
  const finalBloodGroup = localData?.emergencyProfile?.bloodGroup || bloodGroup;
  const finalAllergies = localData?.emergencyProfile?.allergies || allergies;
  const finalConditions = localData?.emergencyProfile?.conditions || conditions;
  const finalNotes = localData?.emergencyProfile?.emergencyNotes || emergencyNotes;

  const contactsList = [];
  if (localData?.trustedContacts && localData.trustedContacts.length > 0) {
    contactsList.push(...localData.trustedContacts);
  } else {
    if (c1Name || c1Phone) {
      contactsList.push({ name: c1Name || "Primary Contact", phone: c1Phone, relation: c1Rel });
    }
    if (c2Name || c2Phone) {
      contactsList.push({ name: c2Name || "Secondary Contact", phone: c2Phone, relation: c2Rel });
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FemNura Emergency Medical ID - ${finalName}`,
        text: `Emergency medical information for ${finalName}. Blood Group: ${finalBloodGroup}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Emergency link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/app/care-circle"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Care Circle
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-white px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 transition-colors cursor-pointer"
          >
            <Share2 size={13} /> Share Link
          </button>
        </div>

        {/* Emergency Alert Banner */}
        <div className="bg-rose-600 text-white rounded-2xl p-5 mb-6 shadow-xl border-2 border-rose-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md">
              <ShieldAlert size={28} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-rose-800/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                FIRST RESPONDER MEDICAL ALERT
              </span>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Emergency Medical Profile
              </h1>
            </div>
          </div>
          <p className="text-xs text-rose-100 mt-2 font-medium">
            This card contains approved medical conditions, critical notes, and verified emergency contacts to assist first responders.
          </p>
        </div>

        {/* Patient Identity & Blood Type */}
        <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-6 mb-5 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Patient Name
              </p>
              <h2 className="font-display text-2xl font-bold text-white">{finalName}</h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                <CheckCircle size={13} /> FemNura Verified ID
              </p>
            </div>
            <div className="text-center bg-rose-950/80 border-2 border-rose-500 rounded-2xl px-5 py-3 shadow-md shrink-0">
              <span className="text-[10px] font-bold text-rose-300 uppercase block tracking-wider">
                Blood Group
              </span>
              <span className="text-2xl font-black text-white font-mono">{finalBloodGroup}</span>
            </div>
          </div>
        </div>

        {/* Critical Medical Conditions */}
        <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-6 mb-5 shadow-lg space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Known Medical Conditions
              </h3>
            </div>
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 text-white font-medium text-sm">
              {finalConditions || "None declared by patient"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplet size={18} className="text-rose-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300">
                Known Allergies (Critical)
              </h3>
            </div>
            <div className="bg-rose-950/40 rounded-xl p-4 border border-rose-900/60 text-rose-100 font-medium text-sm">
              {finalAllergies || "None declared by patient"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
                Emergency Instructions for Responders
              </h3>
            </div>
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 text-slate-200 text-sm leading-relaxed">
              {finalNotes}
            </div>
          </div>
        </div>

        {/* Emergency Contacts with 1-Click Dial */}
        <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Emergency Contacts (Click to Call)
            </h3>
          </div>

          {contactsList.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No emergency contacts configured yet.</p>
          ) : (
            <div className="space-y-3">
              {contactsList.map((c, i) => {
                const code = contactCodes[i] || "+91";
                const formattedPhone = formatPhoneNumberWithCode(c.phone, code);
                const dialableNumber = getDialableNumber(c.phone, code);

                return (
                  <div
                    key={i}
                    className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-base font-bold text-white">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.relation || "Emergency Contact"}</p>

                      {/* Small dropdown for country code near contact */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Country:</span>
                          <select
                            value={code}
                            onChange={(e) =>
                              setContactCodes((prev) => ({ ...prev, [i]: e.target.value }))
                            }
                            className="text-xs font-mono font-bold text-emerald-400 bg-transparent focus:outline-none cursor-pointer"
                            aria-label={`Select country calling code for ${c.name}`}
                          >
                            {COUNTRY_CODES.map((item) => (
                              <option
                                key={item.code}
                                value={item.code}
                                className="bg-slate-900 text-white"
                              >
                                {item.flag} {item.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          {formattedPhone}
                        </span>
                      </div>
                    </div>

                    {c.phone ? (
                      <a
                        href={`tel:${dialableNumber}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                        title={`Call ${c.name} (${dialableNumber})`}
                      >
                        <Phone size={16} /> Call {formattedPhone}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">No phone listed</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Safety & Authenticity Disclaimer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-5 space-y-1">
          <p className="font-semibold text-slate-300">
            FemNura Emergency Card — Your Health. Your Priority.
          </p>
          <p>
            Provided for first response situations. Seek qualified emergency medical personnel immediately in severe medical events.
          </p>
        </div>
      </div>
    </div>
  );
}
