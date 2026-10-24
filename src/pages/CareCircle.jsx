import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function CareCircle() {
  const {
    userName,
    userEmail,
    trustedContacts,
    addTrustedContact,
    removeTrustedContact,
    emergencyProfile,
    updateEmergencyProfile,
  } = useDemoData();

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

    const primaryContact = trustedContacts[0] || { name: "Not assigned", phone: "N/A", relation: "N/A" };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FemNura Emergency Medical Wallet Card</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #2e1f2d; }
            .card { width: 340px; border: 2px solid #5f3860; border-radius: 12px; padding: 18px; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
            .badge { background: #e53e3e; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
            h2 { margin: 8px 0 2px 0; font-size: 18px; color: #5f3860; }
            .row { margin: 6px 0; font-size: 13px; }
            .label { font-weight: bold; color: #666; font-size: 11px; text-transform: uppercase; }
            .val { font-weight: 600; color: #222; }
            .qr-placeholder { margin-top: 12px; text-align: center; border: 1px dashed #aaa; padding: 10px; font-size: 11px; color: #666; border-radius: 6px; }
            .footer { font-size: 10px; color: #888; margin-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge">EMERGENCY MEDICAL ID</span>
              <strong style="color:#5f3860; font-size:14px;">FemNura</strong>
            </div>
            <h2>${userName || "Patient"}</h2>
            <div class="row"><span class="label">Blood Group:</span> <span class="val">${bloodGroup}</span></div>
            <div class="row"><span class="label">Allergies:</span> <span class="val">${allergies || "None"}</span></div>
            <div class="row"><span class="label">Medical Conditions:</span> <span class="val">${conditions || "None"}</span></div>
            <div class="row"><span class="label">Emergency Contact:</span> <span class="val">${primaryContact.name} (${primaryContact.relation}) - ${primaryContact.phone}</span></div>
            <div class="row"><span class="label">Emergency Notes:</span> <span class="val">${emergencyNotes || "Call contact immediately."}</span></div>
            <div class="footer">Fold & carry in wallet. FemNura — Your Health. Your Priority.</div>
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
              <div className="flex items-center justify-center p-3.5 bg-white rounded-2xl border border-plum-200/80 mb-3 shadow-2xs">
                {/* Visual SVG QR Code Matrix */}
                <div className="flex flex-col items-center text-center">
                  <svg width="110" height="110" viewBox="0 0 110 110" className="text-plum-900">
                    {/* Corner Position Targets */}
                    <rect x="5" y="5" width="30" height="30" rx="3" fill="#5f3860" />
                    <rect x="10" y="10" width="20" height="20" fill="white" />
                    <rect x="15" y="15" width="10" height="10" fill="#5f3860" />

                    <rect x="75" y="5" width="30" height="30" rx="3" fill="#5f3860" />
                    <rect x="80" y="10" width="20" height="20" fill="white" />
                    <rect x="85" y="15" width="10" height="10" fill="#5f3860" />

                    <rect x="5" y="75" width="30" height="30" rx="3" fill="#5f3860" />
                    <rect x="10" y="80" width="20" height="20" fill="white" />
                    <rect x="15" y="85" width="10" height="10" fill="#5f3860" />

                    {/* Matrix Mock Pattern */}
                    <circle cx="55" cy="20" r="3" fill="#9c5765" />
                    <circle cx="45" cy="30" r="3" fill="#5f3860" />
                    <circle cx="65" cy="30" r="3" fill="#5f3860" />
                    <circle cx="55" cy="55" r="5" fill="#7a5689" />
                    <circle cx="20" cy="55" r="3" fill="#5f3860" />
                    <circle cx="90" cy="55" r="3" fill="#5f3860" />
                    <circle cx="45" cy="80" r="3" fill="#9c5765" />
                    <circle cx="65" cy="80" r="3" fill="#5f3860" />
                    <circle cx="55" cy="90" r="3" fill="#5f3860" />
                  </svg>
                  <p className="text-[11px] font-semibold text-plum-600 mt-1 flex items-center gap-1">
                    <QrCode size={12} /> Emergency Scannable Card
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrintCard}
                className="w-full justify-center text-xs font-semibold gap-1.5"
              >
                <Printer size={14} /> Print Wallet Card
              </Button>
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
