import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Users,
  X,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  MessageSquare,
  Navigation,
} from "lucide-react";
import { useDemoData } from "../context/DemoDataContext.jsx";
import { openNearestEmergencyCare } from "../utils/location.js";

export default function RedFlagAlertBanner({
  flag, // { title, concern, id }
  onDismiss,
  customDismissible = true,
  className = "",
}) {
  const { trustedContacts, userName } = useDemoData();
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const primaryContact = trustedContacts[0] || null;

  const handleFindNearestEmergencyCare = () => {
    openNearestEmergencyCare(setIsLocating);
  };

  if (!flag) return null;

  const handleNotifyContact = (contact) => {
    const text = encodeURIComponent(
      `URGENT HEALTH ALERT: Hi ${contact.name}, this is ${userName || "FemNura user"}. I am experiencing acute symptoms (${flag.title}) and may need emergency medical assistance. Please check on me or call me immediately.`
    );
    window.open(`sms:${contact.phone}?&body=${text}`, "_blank");
  };

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, y: -10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        role="alert"
        aria-live="assertive"
        className={`rounded-2xl border-2 border-rose-500/90 bg-gradient-to-r from-rose-50 via-white to-rose-50/70 p-4 sm:p-5 shadow-lg shadow-rose-100/60 mb-6 relative overflow-hidden ${className}`}
      >
        {/* Subtle accent bar on top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500" />

        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-rose-200/60 animate-pulse mt-0.5">
            <AlertTriangle size={24} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ⚠️ Urgent Medical Advisory
                </span>
                {flag.title && (
                  <span className="text-xs font-bold text-rose-900 hidden xs:inline">
                    • {flag.title}
                  </span>
                )}
              </div>

              {customDismissible && onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="p-1 rounded-lg text-rose-500 hover:text-rose-900 hover:bg-rose-100/80 transition-colors cursor-pointer"
                  title="Dismiss alert"
                  aria-label="Dismiss urgent medical advisory"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-plum-950 mt-1.5 leading-snug">
              These symptoms may require immediate medical attention. Please do not wait for routine appointments.
            </h3>

            {flag.concern && (
              <p className="text-xs sm:text-sm text-plum-700 mt-1 leading-relaxed">
                <strong className="text-rose-950 font-bold">Clinical Priority:</strong> {flag.concern}
              </p>
            )}

            {/* Direct Emergency SOS & Hospital Locator Section */}
            <div className="mt-4 pt-3.5 border-t border-rose-200/90 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-wrap">
                {/* Prominent Hospital Locator CTA with Live Radar Indicator */}
                <button
                  type="button"
                  onClick={handleFindNearestEmergencyCare}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 active:scale-[0.98] text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer group shrink-0"
                  title="Find Nearest Emergency Care using live device GPS"
                >
                  {/* Subtle pulsating live-radar indicator */}
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <span>{isLocating ? "Locating Nearest Hospitals..." : "Find Nearest Emergency Care"}</span>
                  <ExternalLink size={14} className="text-rose-200 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Quick-Dial Emergency Hotlines (108 / 112 / 181) as Fallbacks */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 shadow-2xs transition-all cursor-pointer"
                    title="Call 108 Emergency Ambulance"
                  >
                    <PhoneCall size={13} className="text-rose-600" />
                    <span>108 (Ambulance)</span>
                  </a>

                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 shadow-2xs transition-all cursor-pointer"
                    title="Call 112 National Emergency"
                  >
                    <PhoneCall size={13} className="text-rose-600" />
                    <span>112 (National ER)</span>
                  </a>

                  <a
                    href="tel:181"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 shadow-2xs transition-all cursor-pointer hidden sm:inline-flex"
                    title="Call 24/7 Women's Helpline"
                  >
                    <ShieldAlert size={13} />
                    <span>181 (Helpline)</span>
                  </a>

                  {/* Notify Emergency Contacts */}
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-lavender-100 hover:bg-lavender-200 text-plum-900 border border-lavender-300 shadow-2xs transition-all cursor-pointer"
                    title="Notify primary and trusted contacts from your Care Circle"
                  >
                    <Users size={13} className="text-plum-700" />
                    <span className="hidden xs:inline">Notify Contacts</span>
                    {primaryContact && (
                      <span className="text-[10px] bg-plum-800 text-white px-1.5 py-0.2 rounded-full font-semibold">
                        {primaryContact.name}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Informative Status Label */}
              <p className="text-[11px] text-plum-600 flex items-center gap-1.5 font-medium">
                <Navigation size={12} className="text-rose-500 shrink-0" />
                <span>Uses device GPS for real-time routing (No Google Maps API key required)</span>
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Emergency Contact Quick Notify Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border-2 border-rose-300 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-100/70 to-lavender-100/60 border-b border-rose-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-plum-950">
                      Notify Your Care Circle
                    </h4>
                    <p className="text-[11px] text-plum-600">
                      Reach trusted contacts immediately
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-1.5 text-plum-500 hover:text-plum-900 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {trustedContacts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-plum-600 mb-3">
                      No emergency contacts configured yet.
                    </p>
                    <Link
                      to="/app/care-circle"
                      onClick={() => setShowContactModal(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 underline"
                    >
                      Set up Emergency Contacts in Care Circle <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  trustedContacts.map((contact, idx) => (
                    <div
                      key={contact.id || idx}
                      className="p-3.5 rounded-2xl bg-lavender-50/60 border border-plum-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-plum-900 text-sm">{contact.name}</p>
                          <span className="text-[10px] font-semibold bg-white text-plum-600 px-2 py-0.5 rounded-full border border-plum-200">
                            {contact.relation}
                          </span>
                        </div>
                        <p className="text-xs font-mono font-medium text-plum-600 mt-0.5">
                          {contact.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${contact.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Call immediately"
                        >
                          <PhoneCall size={12} /> Call
                        </a>
                        <button
                          type="button"
                          onClick={() => handleNotifyContact(contact)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-plum-800 border border-plum-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Send pre-filled emergency SMS"
                        >
                          <MessageSquare size={12} className="text-rose-600" /> SMS
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <div className="pt-2 border-t border-plum-100 flex items-center justify-between">
                  <Link
                    to="/app/care-circle"
                    onClick={() => setShowContactModal(false)}
                    className="text-xs font-semibold text-plum-600 hover:text-plum-900 flex items-center gap-1"
                  >
                    Open Care Circle & Emergency QR <ChevronRight size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="text-xs font-semibold text-plum-500 hover:text-plum-800 px-3 py-1.5 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
