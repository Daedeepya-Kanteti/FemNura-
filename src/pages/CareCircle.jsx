import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Phone,
  ShieldAlert,
  Printer,
  Edit2,
  Check,
  Heart,
  Eye,
  CheckCircle2,
  ShieldCheck,
  FileText,
  X,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import {
  COUNTRY_CODES,
  formatPhoneNumberWithCode,
  getDialableNumber,
} from "../utils/countryCodes.js";

export default function CareCircle() {
  const {
    userName,
    userEmail,
    currentAccount,
    trustedContacts,
    addTrustedContact,
    updateTrustedContact,
    removeTrustedContact,
    emergencyProfile,
    updateEmergencyProfile,
    updateAccountName,
  } = useDemoData();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [contactCodes, setContactCodes] = useState({});

  // Editing state for contacts
  const [editingContactId, setEditingContactId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRelation, setEditRelation] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCode, setEditCode] = useState("+91");

  // In-app Medical Alert Card Modal Preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [syncToast, setSyncToast] = useState("");

  const triggerSyncToast = (msg) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(""), 3500);
  };

  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [patientName, setPatientName] = useState(userName || "");
  const [bloodGroup, setBloodGroup] = useState(emergencyProfile?.bloodGroup || "O+");
  const [allergies, setAllergies] = useState(emergencyProfile?.allergies || "None known");
  const [conditions, setConditions] = useState(emergencyProfile?.conditions || "None reported");
  const [emergencyNotes, setEmergencyNotes] = useState(
    emergencyProfile?.emergencyNotes || "Please contact my primary emergency contact immediately."
  );

  // Synchronize local states immediately whenever emergencyProfile or userName updates
  useEffect(() => {
    if (emergencyProfile) {
      setBloodGroup(emergencyProfile.bloodGroup || "O+");
      setAllergies(emergencyProfile.allergies || "");
      setConditions(emergencyProfile.conditions || "");
      setEmergencyNotes(emergencyProfile.emergencyNotes || "");
    }
    if (userName) {
      setPatientName(userName);
    }
  }, [emergencyProfile, userName]);

  const primaryContact = trustedContacts[0] || { name: "", phone: "", relation: "Primary contact" };
  const secondaryContact = trustedContacts[1] || { name: "", phone: "", relation: "Secondary contact" };

  const currentEmergencyUrl = typeof window !== "undefined"
    ? `/emergency?uid=${encodeURIComponent(currentAccount?.id || "default")}&name=${encodeURIComponent(patientName || userName || "Friend")}&bg=${encodeURIComponent(bloodGroup || "O+")}&al=${encodeURIComponent(allergies || "None")}&cd=${encodeURIComponent(conditions || "None")}&nt=${encodeURIComponent(emergencyNotes || "Call contact immediately.")}&c1n=${encodeURIComponent(primaryContact.name || "")}&c1p=${encodeURIComponent(primaryContact.phone || "")}&c1r=${encodeURIComponent(primaryContact.relation || "")}&c2n=${encodeURIComponent(secondaryContact.name || "")}&c2p=${encodeURIComponent(secondaryContact.phone || "")}&c2r=${encodeURIComponent(secondaryContact.relation || "")}`
    : "/emergency";

  const submitContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const formatted = formatPhoneNumberWithCode(phone.trim(), countryCode);
    addTrustedContact({
      name: name.trim(),
      relation: relation.trim() || "Trusted contact",
      phone: formatted,
    });
    setName("");
    setRelation("");
    setPhone("");
    triggerSyncToast("✓ Contact saved! Medical Alert page is now updated.");
  };

  const handleStartEditContact = (c) => {
    setEditingContactId(c.id);
    setEditName(c.name || "");
    setEditRelation(c.relation || "");
    setEditPhone(c.phone || "");
    setEditCode(contactCodes[c.id] || "+91");
  };

  const handleSaveEditContact = (id) => {
    if (!editName.trim() || !editPhone.trim()) return;
    const formatted = formatPhoneNumberWithCode(editPhone.trim(), editCode);
    updateTrustedContact(id, {
      name: editName.trim(),
      relation: editRelation.trim() || "Trusted contact",
      phone: formatted,
    });
    setEditingContactId(null);
    triggerSyncToast("✓ Contact updated! Medical Alert page is now synchronized.");
  };

  const handleRemoveContact = (id) => {
    removeTrustedContact(id);
    triggerSyncToast("✓ Contact removed. Medical Alert page updated.");
  };

  const saveMedicalProfile = (e) => {
    e.preventDefault();
    const updatedPatientName = patientName.trim() || userName;
    updateEmergencyProfile({
      patientName: updatedPatientName,
      bloodGroup,
      allergies: allergies.trim(),
      conditions: conditions.trim(),
      emergencyNotes: emergencyNotes.trim(),
    });
    if (patientName.trim() && patientName.trim() !== userName) {
      updateAccountName(updatedPatientName);
    }
    setIsEditingMedical(false);
    triggerSyncToast("✓ Emergency Medical ID saved! View Medical Alert page is live updated.");
  };

  const handlePrintCard = () => {
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FemNura Emergency Medical Wallet Card - ${userName || "Patient"}</title>
    <style>
      @page {
        size: auto;
        margin: 15mm;
      }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #2e1f2d; background: #fff; }
      .card { width: 380px; border: 2px solid #5f3860; border-radius: 14px; padding: 22px; background: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.08); margin: 0 auto; }
      .badge { background: #dc2626; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
      h2 { margin: 10px 0 4px 0; font-size: 20px; color: #421845; }
      .row { margin: 8px 0; font-size: 13px; line-height: 1.4; }
      .label { font-weight: bold; color: #6b4c6e; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 2px; }
      .val { font-weight: 600; color: #1e1120; }
      .notice { margin-top: 16px; padding: 10px 12px; background: #fdf2f8; border-left: 3px solid #db2777; border-radius: 6px; font-size: 11px; color: #831843; font-weight: 600; }
      .footer { font-size: 10px; color: #888; margin-top: 14px; text-align: center; border-top: 1px solid #eee; padding-top: 8px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="badge">EMERGENCY MEDICAL ID</span>
        <strong style="color:#5f3860; font-size:15px; letter-spacing:0.5px;">FemNura</strong>
      </div>
      <h2>${userName || "Patient"}</h2>
      <div class="row"><span class="label">Blood Group:</span> <span class="val" style="color:#dc2626; font-size:16px;">${bloodGroup}</span></div>
      <div class="row"><span class="label">Known Conditions:</span> <span class="val">${conditions || "None declared"}</span></div>
      <div class="row"><span class="label">Allergies:</span> <span class="val">${allergies || "None declared"}</span></div>
      <div class="row"><span class="label">Primary Emergency Contact:</span> <span class="val">${primaryContact.name ? `${primaryContact.name} (${primaryContact.relation}) - ${primaryContact.phone}` : "Not assigned"}</span></div>
      ${secondaryContact.name ? `<div class="row"><span class="label">Secondary Contact:</span> <span class="val">${secondaryContact.name} (${secondaryContact.relation}) - ${secondaryContact.phone}</span></div>` : ""}
      <div class="row"><span class="label">Emergency Note:</span> <span class="val">${emergencyNotes || "Call primary contact immediately."}</span></div>
      
      <div class="notice">
        FIRST RESPONDERS: In an emergency, please contact the primary emergency contact above immediately.
      </div>
      <div class="footer">Fold and carry in wallet or purse. FemNura — Your Health. Your Priority.</div>
    </div>
  </body>
</html>`;

    const existingIframe = document.getElementById("femnura-wallet-card-frame");
    if (existingIframe) existingIframe.remove();

    const printFrame = document.createElement("iframe");
    printFrame.id = "femnura-wallet-card-frame";
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
    <div>
      <PageHeader
        eyebrow="Care Circle & Emergency Tools"
        title="Bring trusted people into your journey"
        subtitle="Organise your emergency contacts and medical alert card. Stored privately on your device, under your control."
      />

      {/* Real-time synchronization notification */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{syncToast}</p>
            </div>
            <Link
              to={currentEmergencyUrl}
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 flex items-center gap-1 shrink-0"
            >
              Check Alert View <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* EMERGENCY MEDICAL CARD */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full bg-gradient-to-br from-white via-lavender-50/30 to-rose-50/20 border-plum-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                  <ShieldAlert size={13} /> Emergency ID
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingMedical(!isEditingMedical)}
                  className="p-1.5 text-plum-500 hover:text-plum-900 hover:bg-lavender-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={13} /> {isEditingMedical ? "Close" : "Edit"}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-plum-400 font-semibold uppercase tracking-wider">Patient Name</p>
                <p className="font-display text-xl font-bold text-plum-900">{patientName || userName || "Friend"}</p>
                <p className="text-xs text-plum-500">{userEmail}</p>
              </div>

              {isEditingMedical ? (
                <form onSubmit={saveMedicalProfile} className="space-y-3 mb-4 text-xs">
                  <div>
                    <label className="font-bold text-plum-700 block mb-1">Patient Name on Emergency ID</label>
                    <input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Full Legal or Preferred Name"
                      className="w-full rounded-lg border border-plum-200 px-3 py-1.5 bg-white text-plum-900 font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-plum-700 block mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full rounded-lg border border-plum-200 px-3 py-1.5 bg-white text-plum-900"
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-plum-700 block mb-1">Known Allergies</label>
                    <input
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts"
                      className="w-full rounded-lg border border-plum-200 px-3 py-1.5 bg-white text-plum-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-plum-700 block mb-1">Medical Conditions</label>
                    <input
                      value={conditions}
                      onChange={(e) => setConditions(e.target.value)}
                      placeholder="e.g. Asthma, Thyroid, PCOS"
                      className="w-full rounded-lg border border-plum-200 px-3 py-1.5 bg-white text-plum-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-plum-700 block mb-1">Emergency Instructions</label>
                    <textarea
                      rows={2}
                      value={emergencyNotes}
                      onChange={(e) => setEmergencyNotes(e.target.value)}
                      className="w-full rounded-lg border border-plum-200 px-3 py-1.5 bg-white text-plum-900 resize-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="sm" className="w-full justify-center">
                    <Check size={14} /> Save Medical ID & Sync Alert
                  </Button>
                </form>
              ) : (
                <div className="space-y-3 text-xs mb-5">
                  <div className="bg-white/80 rounded-xl p-3 border border-plum-100 flex items-center justify-between">
                    <span className="font-semibold text-plum-500">Blood Group</span>
                    <span className="font-bold text-rose-600 text-sm bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                      {bloodGroup}
                    </span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-plum-100">
                    <p className="font-semibold text-plum-500 mb-0.5">Allergies</p>
                    <p className="font-medium text-plum-800">{allergies || "None declared"}</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-plum-100">
                    <p className="font-semibold text-plum-500 mb-0.5">Known Conditions</p>
                    <p className="font-medium text-plum-800">{conditions || "None declared"}</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-plum-100">
                    <p className="font-semibold text-plum-500 mb-0.5">Emergency Note</p>
                    <p className="font-medium text-plum-800">{emergencyNotes || "Contact primary contact"}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="p-4 bg-white rounded-2xl border border-plum-200/80 mb-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-plum-950 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-600" />
                    First Responder Profile
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-600" />
                    Auto-Synced
                  </span>
                </div>
                <p className="text-[11px] text-plum-600 leading-relaxed">
                  Every change here instantly reflects on your <strong>VIEW MEDICAL ALERT</strong> page and printable emergency card.
                </p>
                {primaryContact.name && (
                  <div className="pt-2 border-t border-plum-100 text-xs">
                    <span className="text-[10px] font-bold text-plum-400 uppercase block">Primary Contact</span>
                    <span className="font-semibold text-plum-900">{primaryContact.name} ({primaryContact.relation})</span>
                    <span className="font-mono text-plum-700 block text-[11px] mt-0.5">{primaryContact.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={currentEmergencyUrl}
                    className="block w-full"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold gap-1.5 border-plum-200 hover:border-plum-400 text-plum-900"
                    >
                      <Eye size={13} className="text-rose-600" /> View Alert Page
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full justify-center text-xs font-semibold gap-1 text-plum-700 border-plum-200 hover:bg-lavender-50"
                  >
                    <FileText size={13} /> Quick Preview
                  </Button>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrintCard}
                  className="w-full justify-center text-xs font-semibold gap-1.5 bg-plum-800 hover:bg-plum-900"
                >
                  <Printer size={14} /> Print Wallet Emergency Card
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* TRUSTED CONTACTS LIST & ADD FORM */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-plum-800 mb-2">Add a Trusted Contact</h2>
            <p className="text-xs text-plum-500 mb-4">
              Add family, partners, or friends you want reachable in case you need assistance or health support.
            </p>
            <form onSubmit={submitContact} className="grid sm:grid-cols-3 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name *"
                required
                className="rounded-xl border border-plum-200 px-4 py-2.5 text-sm focus-ring bg-ivory/60"
              />
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Relationship (e.g. Sister, Partner)"
                className="rounded-xl border border-plum-200 px-4 py-2.5 text-sm focus-ring bg-ivory/60"
              />
              <div className="flex gap-1.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-xl border border-plum-200 px-2 py-2.5 text-xs font-mono font-bold focus-ring bg-ivory/60 text-plum-900 cursor-pointer shrink-0"
                  title="Select Country Calling Code"
                  aria-label="Country Calling Code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number *"
                  required
                  className="w-full rounded-xl border border-plum-200 px-4 py-2.5 text-sm focus-ring bg-ivory/60"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="sm:col-span-3 justify-center text-sm"
                disabled={!name.trim() || !phone.trim()}
              >
                <Plus size={16} /> Save to Care Circle
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-plum-800">Your Care Circle</h2>
              <Badge tone="sage">{trustedContacts.length} Contacts</Badge>
            </div>

            {trustedContacts.length === 0 ? (
              <EmptyState
                icon={<Users size={24} />}
                title="No contacts added yet"
                description="Add someone you'd want contacted if you ever needed rapid care or support."
              />
            ) : (
              <div className="space-y-3">
                {trustedContacts.map((c, i) => {
                  const isEditing = editingContactId === c.id;
                  const code = contactCodes[c.id] || "+91";
                  const formattedPhone = formatPhoneNumberWithCode(c.phone, code);
                  const dialNum = getDialableNumber(c.phone, code);

                  if (isEditing) {
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border-2 border-plum-400 bg-lavender-50/50 shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-plum-900 uppercase">
                            Edit Contact: {c.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingContactId(null)}
                            className="text-plum-400 hover:text-plum-800 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Full Name"
                            className="rounded-lg border border-plum-300 px-3 py-1.5 text-xs bg-white text-plum-900"
                          />
                          <input
                            value={editRelation}
                            onChange={(e) => setEditRelation(e.target.value)}
                            placeholder="Relationship"
                            className="rounded-lg border border-plum-300 px-3 py-1.5 text-xs bg-white text-plum-900"
                          />
                          <div className="flex gap-1">
                            <select
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                              className="rounded-lg border border-plum-300 px-1 py-1.5 text-xs font-mono font-bold bg-white text-plum-900"
                            >
                              {COUNTRY_CODES.map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.flag} {item.code}
                                </option>
                              ))}
                            </select>
                            <input
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="Phone"
                              className="w-full rounded-lg border border-plum-300 px-3 py-1.5 text-xs bg-white text-plum-900"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingContactId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleSaveEditContact(c.id)}
                            disabled={!editName.trim() || !editPhone.trim()}
                          >
                            <Check size={13} /> Save Changes
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-plum-100 hover:border-plum-300 transition-colors bg-white shadow-2xs gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-lavender-100 text-plum-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                          {(c.name[0] || "C").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-plum-900 text-sm truncate">{c.name}</p>
                            {i === 0 && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs font-medium text-plum-600">{c.relation}</span>
                            <span className="text-plum-300">•</span>
                            {/* Country code dropdown near contact */}
                            <div className="inline-flex items-center gap-1 bg-lavender-50 border border-plum-200 rounded-lg px-2 py-0.5 shadow-2xs">
                              <span className="text-[10px] font-bold text-plum-400 uppercase">Country:</span>
                              <select
                                value={code}
                                onChange={(e) =>
                                  setContactCodes((prev) => ({ ...prev, [c.id]: e.target.value }))
                                }
                                className="text-xs font-mono font-bold text-plum-900 bg-transparent focus:outline-none cursor-pointer"
                                title="Country Calling Code"
                              >
                                {COUNTRY_CODES.map((item) => (
                                  <option key={item.code} value={item.code}>
                                    {item.flag} {item.code}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <a
                              href={`tel:${dialNum}`}
                              className="text-xs text-plum-700 hover:text-plum-950 underline flex items-center gap-1 font-semibold font-mono"
                              title={`Call ${c.name} (${dialNum})`}
                            >
                              <Phone size={11} /> {formattedPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditContact(c)}
                          title="Edit contact details"
                          className="p-2 text-plum-500 hover:text-plum-900 hover:bg-lavender-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(c.id)}
                          title="Remove contact"
                          className="p-2 text-plum-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* QUICK PREVIEW MODAL FOR MEDICAL ALERT CARD */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-slate-900 text-slate-100 border-2 border-rose-500/80 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-rose-950/80 to-slate-900 border-b border-rose-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                      Live Medical Alert View
                    </span>
                    <h3 className="font-display text-base font-bold text-white">
                      {patientName || userName || "Patient"} • {bloodGroup}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Patient Full Name</span>
                  <span className="font-bold text-white text-sm">{patientName || userName || "Patient"}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                    <span className="font-semibold text-slate-400 block mb-1">Blood Group</span>
                    <span className="font-mono text-base font-black text-rose-400">{bloodGroup}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                    <span className="font-semibold text-slate-400 block mb-1">Status</span>
                    <span className="font-semibold text-emerald-400">✓ Auto-Synced</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                  <span className="font-bold text-amber-300 block mb-1">Known Medical Conditions</span>
                  <p className="text-slate-200">{conditions || "None declared"}</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60">
                  <span className="font-bold text-rose-300 block mb-1">Known Allergies</span>
                  <p className="text-rose-100 font-medium">{allergies || "None declared"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                  <span className="font-bold text-cyan-300 block mb-1">Emergency Instructions</span>
                  <p className="text-slate-300">{emergencyNotes || "Call primary contact immediately."}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <span className="font-bold text-emerald-300 block">Emergency Contacts ({trustedContacts.length})</span>
                  {trustedContacts.length === 0 ? (
                    <p className="text-slate-400 italic">No contacts added yet.</p>
                  ) : (
                    trustedContacts.map((c, i) => (
                      <div key={c.id || i} className="flex items-center justify-between py-1 border-b border-slate-700/60 last:border-0">
                        <div>
                          <span className="font-bold text-white">{c.name}</span>{" "}
                          <span className="text-slate-400">({c.relation})</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-semibold">{c.phone}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <Link
                  to={currentEmergencyUrl}
                  onClick={() => setShowPreviewModal(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  <ExternalLink size={13} /> Open Fullscreen Alert Page
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrintCard}
                    className="text-xs text-slate-300 border-slate-700 hover:bg-slate-800"
                  >
                    <Printer size={13} /> Print
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPreviewModal(false)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Disclaimer compact />
    </div>
  );
}
