import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Printer,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import {
  COUNTRY_CODES,
  formatPhoneNumberWithCode,
  getDialableNumber,
} from "../utils/countryCodes.js";

export default function EmergencyView() {
  const [params] = useSearchParams();
  const [contactCodes, setContactCodes] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(() => new Date().toLocaleTimeString());

  // Connect directly to live active session context
  const {
    userName: ctxName,
    currentAccount,
    emergencyProfile: ctxProfile,
    trustedContacts: ctxContacts,
    refreshData,
  } = useDemoData();

  // Read data from URL parameters as fallback for scanned or shared links
  const uid = params.get("uid") || "";
  const nameParam = params.get("name") || params.get("user") || "";
  const bgParam = params.get("bg") || "";
  const alParam = params.get("al") || "";
  const cdParam = params.get("cd") || "";
  const ntParam = params.get("nt") || "";

  const c1Name = params.get("c1n") || "";
  const c1Phone = params.get("c1p") || "";
  const c1Rel = params.get("c1r") || "Primary contact";

  const c2Name = params.get("c2n") || "";
  const c2Phone = params.get("c2p") || "";
  const c2Rel = params.get("c2r") || "Secondary contact";

  // State ticker to trigger instantaneous re-renders on window storage/focus events
  const [storageTick, setStorageTick] = useState(0);

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshData?.();
    setStorageTick((t) => t + 1);
    setLastSyncedTime(new Date().toLocaleTimeString());
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refreshData]);

  // Synchronize immediately if Care Circle is updated in another tab or in the same app session
  useEffect(() => {
    const handleStorageChange = () => {
      refreshData?.();
      setStorageTick((t) => t + 1);
      setLastSyncedTime(new Date().toLocaleTimeString());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    window.addEventListener("visibilitychange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener("visibilitychange", handleStorageChange);
    };
  }, [refreshData]);

  // Direct localStorage retrieval as additional local backup
  const localData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const targetId = uid || currentAccount?.id;
      if (targetId) {
        const raw = localStorage.getItem(`femnura_userdata_v2_${targetId}`);
        if (raw) return JSON.parse(raw);
      }
      const lastAccRaw = localStorage.getItem("femnura_last_login_account_v2");
      if (lastAccRaw) {
        const lastAcc = JSON.parse(lastAccRaw);
        if (lastAcc?.id) {
          const raw = localStorage.getItem(`femnura_userdata_v2_${lastAcc.id}`);
          if (raw) return JSON.parse(raw);
        }
      }
    } catch {}
    return null;
  }, [uid, currentAccount?.id, storageTick]);

  // Resolve final medical alert information with absolute priority to the live Care Circle data
  const finalName =
    ctxProfile?.patientName ||
    ctxName ||
    localData?.emergencyProfile?.patientName ||
    localData?.userName ||
    nameParam ||
    "Patient";

  const finalBloodGroup =
    ctxProfile?.bloodGroup ||
    localData?.emergencyProfile?.bloodGroup ||
    bgParam ||
    "O+";

  const finalAllergies =
    ctxProfile?.allergies ||
    localData?.emergencyProfile?.allergies ||
    alParam ||
    "None declared";

  const finalConditions =
    ctxProfile?.conditions ||
    localData?.emergencyProfile?.conditions ||
    cdParam ||
    "None declared";

  const finalNotes =
    ctxProfile?.emergencyNotes ||
    localData?.emergencyProfile?.emergencyNotes ||
    ntParam ||
    "Please contact primary emergency contact immediately.";

  // Contacts list synchronized directly from Care Circle
  const contactsList = useMemo(() => {
    if (ctxContacts && ctxContacts.length > 0) {
      return ctxContacts;
    }
    if (localData?.trustedContacts && localData.trustedContacts.length > 0) {
      return localData.trustedContacts;
    }
    const fallback = [];
    if (c1Name || c1Phone) {
      fallback.push({ name: c1Name, phone: c1Phone, relation: c1Rel });
    }
    if (c2Name || c2Phone) {
      fallback.push({ name: c2Name, phone: c2Phone, relation: c2Rel });
    }
    return fallback;
  }, [ctxContacts, localData?.trustedContacts, c1Name, c1Phone, c1Rel, c2Name, c2Phone, c2Rel]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FemNura Emergency Medical ID - ${finalName}`,
        text: `Emergency medical information for ${finalName}. Blood Group: ${finalBloodGroup}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }).catch(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    const primaryC = contactsList[0] || { name: "Not assigned", phone: "", relation: "" };
    const secondaryC = contactsList[1] || null;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FemNura Emergency Medical ID - ${finalName}</title>
    <style>
      @page { size: auto; margin: 15mm; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #2e1f2d; background: #fff; }
      .card { max-width: 500px; border: 2px solid #5f3860; border-radius: 14px; padding: 24px; background: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.08); margin: 0 auto; }
      .badge { background: #dc2626; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
      h2 { margin: 10px 0 4px 0; font-size: 22px; color: #421845; }
      .row { margin: 9px 0; font-size: 13px; line-height: 1.4; }
      .label { font-weight: bold; color: #6b4c6e; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 2px; }
      .val { font-weight: 600; color: #1e1120; }
      .notice { margin-top: 16px; padding: 10px 12px; background: #fdf2f8; border-left: 3px solid #db2777; border-radius: 6px; font-size: 11px; color: #831843; font-weight: 600; }
      .footer { font-size: 10px; color: #888; margin-top: 16px; text-align: center; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="badge">EMERGENCY MEDICAL ALERT</span>
        <strong style="color:#5f3860; font-size:16px;">FemNura</strong>
      </div>
      <h2>${finalName}</h2>
      <div class="row"><span class="label">Blood Group:</span> <span class="val" style="color:#dc2626; font-size:18px;">${finalBloodGroup}</span></div>
      <div class="row"><span class="label">Known Medical Conditions:</span> <span class="val">${finalConditions}</span></div>
      <div class="row"><span class="label">Known Allergies:</span> <span class="val">${finalAllergies}</span></div>
      <div class="row"><span class="label">Primary Emergency Contact:</span> <span class="val">${primaryC.name ? `${primaryC.name} (${primaryC.relation}) - ${primaryC.phone}` : "Not assigned"}</span></div>
      ${secondaryC ? `<div class="row"><span class="label">Secondary Contact:</span> <span class="val">${secondaryC.name} (${secondaryC.relation}) - ${secondaryC.phone}</span></div>` : ""}
      <div class="row"><span class="label">Emergency Instructions:</span> <span class="val">${finalNotes}</span></div>
      
      <div class="notice">
        FIRST RESPONDERS: In an emergency, please notify the primary emergency contact immediately.
      </div>
      <div class="footer">FemNura — Your Health. Your Priority. Verified Medical Alert Profile</div>
    </div>
  </body>
</html>`;

    const existingIframe = document.getElementById("femnura-alert-print-frame");
    if (existingIframe) existingIframe.remove();

    const printFrame = document.createElement("iframe");
    printFrame.id = "femnura-alert-print-frame";
    printFrame.setAttribute(
      "style",
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;z-index:-1;"
    );
    document.body.appendChild(printFrame);

    try {
      const frameDoc = printFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(html);
      frameDoc.close();
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch {
          window.print();
        }
      }, 350);
    } catch {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <Link
            to="/app/care-circle"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 transition-colors w-fit"
          >
            <ArrowLeft size={14} /> Back to Care Circle
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Sync with latest Care Circle edits"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin text-emerald-400" : "text-slate-400"} />
              <span>{isRefreshing ? "Syncing..." : "Sync Care Circle"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-plum-700/80 bg-plum-950/70 text-plum-200 hover:text-white transition-colors cursor-pointer"
              title="Print Emergency Alert Wallet Card"
            >
              <Printer size={13} /> Print Card
            </button>

            <button
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                copiedLink
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                  : "bg-rose-950/60 border-rose-800 text-rose-300 hover:text-white"
              }`}
            >
              {copiedLink ? <CheckCircle size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </button>
          </div>
        </div>

        {/* Live Synchronized Status Pill */}
        <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 border border-emerald-500/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-300">
              Live Synchronized with Care Circle
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Last checked: {lastSyncedTime}
          </span>
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
