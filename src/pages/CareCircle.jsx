import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import {
  Users,
  Plus,
  Trash2,
  QrCode,
  Phone,
  ShieldAlert,
  Printer,
  Edit2,
  Check,
  Heart,
  AlertCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function CareCircle() {
  const {
    userName,
    userEmail,
    currentAccount,
    trustedContacts,
    addTrustedContact,
    removeTrustedContact,
    emergencyProfile,
    updateEmergencyProfile,
  } = useDemoData();

  const [qrDataUrl, setQrDataUrl] = useState("");

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(emergencyProfile?.bloodGroup || "O+");
  const [allergies, setAllergies] = useState(emergencyProfile?.allergies || "None known");
  const [conditions, setConditions] = useState(emergencyProfile?.conditions || "None reported");
  const [emergencyNotes, setEmergencyNotes] = useState(
    emergencyProfile?.emergencyNotes || "Please contact my primary emergency contact immediately."
  );

  const primaryContact = trustedContacts[0] || { name: "", phone: "", relation: "Primary contact" };
  const secondaryContact = trustedContacts[1] || { name: "", phone: "", relation: "Secondary contact" };

  const currentEmergencyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/emergency?uid=${encodeURIComponent(currentAccount?.id || "default")}&name=${encodeURIComponent(userName || "Friend")}&bg=${encodeURIComponent(bloodGroup || "O+")}&al=${encodeURIComponent(allergies || "None")}&cd=${encodeURIComponent(conditions || "None")}&nt=${encodeURIComponent(emergencyNotes || "Call contact immediately.")}&c1n=${encodeURIComponent(primaryContact.name || "")}&c1p=${encodeURIComponent(primaryContact.phone || "")}&c1r=${encodeURIComponent(primaryContact.relation || "")}&c2n=${encodeURIComponent(secondaryContact.name || "")}&c2p=${encodeURIComponent(secondaryContact.phone || "")}&c2r=${encodeURIComponent(secondaryContact.relation || "")}`
    : "";

  useEffect(() => {
    if (!currentEmergencyUrl) return;
    QRCode.toDataURL(currentEmergencyUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#361638",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Could not generate emergency QR:", err));
  }, [currentEmergencyUrl]);

  const submitContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addTrustedContact({ name: name.trim(), relation: relation.trim() || "Trusted contact", phone: phone.trim() });
    setName("");
    setRelation("");
    setPhone("");
  };

  const saveMedicalProfile = (e) => {
    e.preventDefault();
    updateEmergencyProfile({
      bloodGroup,
      allergies: allergies.trim(),
      conditions: conditions.trim(),
      emergencyNotes: emergencyNotes.trim(),
    });
    setIsEditingMedical(false);
  };

  const handlePrintCard = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FemNura Emergency Medical Wallet Card - ${userName || "Patient"}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #2e1f2d; background: #fafafa; }
            .card { width: 360px; border: 2px solid #5f3860; border-radius: 14px; padding: 20px; background: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.1); margin: 0 auto; }
            .badge { background: #dc2626; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
            h2 { margin: 10px 0 4px 0; font-size: 20px; color: #421845; }
            .row { margin: 7px 0; font-size: 13px; line-height: 1.4; }
            .label { font-weight: bold; color: #6b4c6e; font-size: 11px; text-transform: uppercase; }
            .val { font-weight: 600; color: #1e1120; }
            .qr-section { margin-top: 14px; text-align: center; border-top: 1px dashed #d1c4d4; padding-top: 12px; }
            .qr-img { width: 130px; height: 130px; border-radius: 8px; border: 1px solid #ddd; }
            .qr-instruction { font-size: 11px; color: #666; margin-top: 6px; font-weight: 500; }
            .footer { font-size: 10px; color: #888; margin-top: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge">EMERGENCY MEDICAL ID</span>
              <strong style="color:#5f3860; font-size:15px; letter-spacing:0.5px;">FemNura</strong>
            </div>
            <h2>${userName || "Patient"}</h2>
            <div class="row"><span class="label">Blood Group:</span> <span class="val" style="color:#dc2626; font-size:15px;">${bloodGroup}</span></div>
            <div class="row"><span class="label">Known Conditions:</span> <span class="val">${conditions || "None declared"}</span></div>
            <div class="row"><span class="label">Allergies:</span> <span class="val">${allergies || "None declared"}</span></div>
            <div class="row"><span class="label">Primary Emergency Contact:</span> <span class="val">${primaryContact.name ? `${primaryContact.name} (${primaryContact.relation}) - ${primaryContact.phone}` : "Not assigned"}</span></div>
            <div class="row"><span class="label">Emergency Note:</span> <span class="val">${emergencyNotes || "Call primary contact immediately."}</span></div>
            
            <div class="qr-section">
              ${qrDataUrl ? `<img src="${qrDataUrl}" class="qr-img" alt="Scannable Emergency QR" />` : ""}
              <div class="qr-instruction">Scan with any phone camera to view full emergency profile & 1-click call contact</div>
            </div>
            <div class="footer">Fold and carry in wallet or purse. FemNura — Your Health. Your Priority.</div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Care Circle & Emergency Tools"
        title="Bring trusted people into your journey"
        subtitle="Organise your emergency contacts and medical alert card. Stored privately on your device, under your control."
      />

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
                <p className="font-display text-xl font-bold text-plum-900">{userName || "Friend"}</p>
                <p className="text-xs text-plum-500">{userEmail}</p>
              </div>

              {isEditingMedical ? (
                <form onSubmit={saveMedicalProfile} className="space-y-3 mb-4 text-xs">
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
                    <Check size={14} /> Save Medical ID
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
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-plum-200/80 mb-3 shadow-2xs text-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Emergency QR Code for ${userName}`}
                    className="w-36 h-36 rounded-xl border border-plum-100 shadow-2xs"
                  />
                ) : (
                  <div className="w-36 h-36 bg-lavender-50 rounded-xl flex items-center justify-center text-xs text-plum-400">
                    Generating QR...
                  </div>
                )}
                <p className="text-[11px] font-bold text-plum-700 mt-2 flex items-center gap-1">
                  <QrCode size={13} className="text-rose-500" /> Scannable First Responder QR
                </p>
                <p className="text-[10px] text-plum-400 mt-0.5">
                  Unique to {userName}'s account & medical profile
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  to={currentEmergencyUrl.replace(window.location.origin, "")}
                  target="_blank"
                  className="w-full block"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center text-xs font-semibold gap-1.5 border-plum-200 hover:border-plum-400 text-plum-800"
                  >
                    <Eye size={14} className="text-plum-600" /> Preview Emergency Scan View
                  </Button>
                </Link>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrintCard}
                  className="w-full justify-center text-xs font-semibold gap-1.5 bg-plum-800 hover:bg-plum-900"
                >
                  <Printer size={14} /> Print Wallet Card (with QR)
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
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number *"
                required
                className="rounded-xl border border-plum-200 px-4 py-2.5 text-sm focus-ring bg-ivory/60"
              />
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
                {trustedContacts.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-plum-100 hover:border-plum-300 transition-colors bg-white shadow-2xs"
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
                        <p className="text-xs text-plum-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-plum-600">{c.relation}</span>
                          <span>•</span>
                          <a
                            href={`tel:${c.phone}`}
                            className="text-plum-700 hover:text-plum-950 underline flex items-center gap-1 font-semibold"
                          >
                            <Phone size={11} /> {c.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTrustedContact(c.id)}
                      title="Remove contact"
                      className="p-2 text-plum-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-ring"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Disclaimer compact />
    </div>
  );
}
