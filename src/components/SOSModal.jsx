import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Users,
  X,
  ShieldAlert,
  ExternalLink,
  MessageSquare,
  QrCode,
  Heart,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useDemoData } from "../context/DemoDataContext.jsx";

export default function SOSModal({ isOpen, onClose }) {
  const {
    userName,
    currentAccount,
    trustedContacts,
    emergencyProfile,
  } = useDemoData();

  if (!isOpen) return null;

  const primaryContact = trustedContacts[0] || null;

  const sendEmergencySMS = (contact) => {
    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS: Hi ${contact.name}, this is ${userName || "FemNura user"}. I am experiencing an urgent medical emergency and need immediate help. Please call me or send assistance to my location right now.`
    );
    window.open(`sms:${contact.phone}?&body=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-plum-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-rose-500 w-full max-w-lg overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
      >
        {/* Urgent Alert Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-plum-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-rose-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close SOS modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md ring-4 ring-rose-400/50 animate-pulse">
              <AlertTriangle size={26} className="text-rose-600" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase bg-rose-950/80 text-rose-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-rose-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-ping" />
                Emergency SOS Protocol
              </span>
              <h2 id="sos-modal-title" className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                Emergency Assistance
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 mt-2 leading-relaxed">
            If you or someone around you is in immediate danger or experiencing acute pain, please call emergency services right away.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: 1-Tap Emergency Hotlines */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-950 mb-2.5 flex items-center gap-1.5">
              <PhoneCall size={14} className="text-rose-600" /> 1-Tap Emergency Hotlines
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-between shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">National Ambulance</p>
                    <p className="text-base font-extrabold font-mono">108 / 112</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">Call</span>
              </a>

              <a
                href="tel:181"
                className="p-3 rounded-2xl bg-plum-800 hover:bg-plum-900 text-white flex items-center justify-between shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">Women's Helpline</p>
                    <p className="text-base font-extrabold font-mono">181 (24/7)</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">Call</span>
              </a>
            </div>
          </div>

          {/* Section 2: Hospital ER Locator */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 shadow-2xs">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-plum-950 truncate">Need Hospital Triage?</p>
                <p className="text-[11px] text-plum-600 truncate">Locate nearest open emergency rooms via GPS</p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/emergency+hospital+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-100/80 text-rose-700 border border-rose-300 text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>Find ER</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Section 3: Care Circle & Trusted Contacts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-plum-900 flex items-center gap-1.5">
                <Users size={14} className="text-plum-600" /> Notify Trusted Contacts
              </p>
              <Link
                to="/app/care-circle"
                onClick={onClose}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline flex items-center gap-0.5"
              >
                Manage Contacts <ChevronRight size={12} />
              </Link>
            </div>

            {trustedContacts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-lavender-50/60 border border-dashed border-plum-200 text-center">
                <p className="text-xs text-plum-600 mb-2">No personal emergency contacts added yet.</p>
                <Link
                  to="/app/care-circle"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"
                >
                  Add Emergency Contacts in Care Circle
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {trustedContacts.map((contact, idx) => (
                  <div
                    key={contact.id || idx}
                    className="p-3 rounded-2xl bg-lavender-50/70 border border-plum-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-plum-900 truncate">{contact.name}</p>
                        <span className="text-[10px] bg-white text-plum-600 px-2 py-0.2 rounded-full border border-plum-200 shrink-0">
                          {contact.relation}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-plum-600 mt-0.5">{contact.phone}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${contact.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Call immediately"
                      >
                        <PhoneCall size={12} /> Call
                      </a>
                      <button
                        type="button"
                        onClick={() => sendEmergencySMS(contact)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-plum-800 border border-plum-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Send pre-filled emergency SMS"
                      >
                        <MessageSquare size={12} className="text-rose-600" /> SMS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Emergency Medical ID Summary */}
          <div className="p-4 rounded-2xl bg-plum-50/70 border border-plum-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-plum-800 flex items-center gap-1">
                <Heart size={13} className="text-rose-600" /> Medical ID (For First Responders)
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                Blood Group: {emergencyProfile?.bloodGroup || "O+"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-plum-800">
              <div>
                <span className="font-semibold text-plum-500 block text-[10px] uppercase">Allergies:</span>
                <span className="truncate block">{emergencyProfile?.allergies || "None declared"}</span>
              </div>
              <div>
                <span className="font-semibold text-plum-500 block text-[10px] uppercase">Conditions:</span>
                <span className="truncate block">{emergencyProfile?.conditions || "None declared"}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-plum-200/80 flex items-center justify-between text-[11px]">
              <span className="text-plum-600 truncate">{emergencyProfile?.emergencyNotes || "Call emergency contact immediately."}</span>
              <Link
                to="/app/care-circle"
                onClick={onClose}
                className="text-rose-700 font-bold hover:underline shrink-0 flex items-center gap-1"
              >
                <QrCode size={13} /> View QR Card
              </Link>
            </div>
          </div>

          {/* Close Action */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-plum-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close Emergency Protocol
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
