import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Trash2, QrCode, AlertTriangle, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function CareCircle() {
  const { trustedContacts, addTrustedContact, removeTrustedContact } = useDemoData();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addTrustedContact({ name: name.trim(), relation: relation.trim() || "Trusted contact", phone: phone.trim() });
    setName("");
    setRelation("");
    setPhone("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Care Circle & Emergency Tools"
        title="Bring trusted people into your journey"
        subtitle="Add people you'd want informed in an emergency. On your terms, nothing automatic."
      />

      <div className="flex items-start gap-3 bg-plum-50 border border-plum-100 rounded-2xl px-5 py-4 mb-6 text-sm text-plum-700">
        <Users size={18} className="shrink-0 mt-0.5 text-plum-600" />
        <p>
          Your trusted contacts and emergency circle are saved securely to your personal account on this device.
        </p>
      </div>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Add a trusted contact</h2>
        <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60" />
          <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relationship (e.g. Sister)" className="rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-xl border border-plum-200 px-4 py-3 focus-ring bg-ivory/60" />
          <Button type="submit" variant="primary" className="sm:col-span-3 justify-center" disabled={!name.trim() || !phone.trim()}>
            <Plus size={16} /> Add contact
          </Button>
        </form>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Your Care Circle</h2>
        {trustedContacts.length === 0 ? (
          <EmptyState icon={<Users size={24} />} title="No trusted contacts yet" description="Add someone you'd want informed if you ever needed support quickly." />
        ) : (
          <div className="space-y-3">
            {trustedContacts.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 rounded-2xl border border-plum-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-lavender-100 text-plum-700 font-bold flex items-center justify-center">{c.name[0].toUpperCase()}</div>
                  <div>
                    <p className="font-semibold text-plum-800">{c.name}</p>
                    <p className="text-sm text-plum-500 flex items-center gap-1"><Phone size={12} /> {c.phone} · {c.relation}</p>
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

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-700 flex items-center justify-center"><QrCode size={18} /></div>
          <h2 className="font-display text-lg font-semibold text-plum-800">Emergency QR Card</h2>
        </div>
        <p className="text-sm text-plum-500 mb-2">
          A scannable card with essential emergency info is planned for a future phase, once secure record sharing is
          configured. It is not available in this demo.
        </p>
      </Card>

      <Disclaimer compact />
    </div>
  );
}
