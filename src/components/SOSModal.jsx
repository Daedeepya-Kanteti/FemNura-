import React, { useState, useMemo } from "react";
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
  Navigation,
  Compass,
  Check,
  RefreshCw,
  Copy,
  Clock,
  Radio,
  CheckCircle2,
  ShieldCheck,
  Search,
  Globe,
  Building2,
  Info,
} from "lucide-react";
import { useDemoData } from "../context/DemoDataContext.jsx";
import {
  getSortedHealthCenters,
  getDirectionsUrl,
  formatDistance,
  openNearestEmergencyCare,
} from "../utils/location.js";

export default function SOSModal({ isOpen, onClose }) {
  const {
    userName,
    currentAccount,
    trustedContacts,
    emergencyProfile,
    userLocation,
    isLocationEnabled,
    locationLoading,
    locationError,
    locationNotice,
    toggleLocationTracking,
    refreshLocation,
    setManualLocation,
    searchAndSetLocation,
    CITY_PRESETS,
  } = useDemoData();

  const [copiedLink, setCopiedLink] = useState(false);
  const [filterType, setFilterType] = useState("All"); // All, Maternity, Trauma, Government
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [areaChangeToast, setAreaChangeToast] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Directly select preset area and immediately recalculate distances
  const handleSelectArea = (preset) => {
    setManualLocation(preset);
    const cityName = preset.city || preset.name.split(" (")[0];
    setAreaChangeToast(`📍 Area updated to ${cityName}! Hospital distances recalculated.`);
    setTimeout(() => setAreaChangeToast(""), 3500);
  };

  const handleSearchArea = async () => {
    if (!customSearchQuery.trim()) return;
    setSearchStatus("Searching area...");
    const ok = await searchAndSetLocation(customSearchQuery);
    if (ok) {
      setSearchStatus("Area updated!");
      setAreaChangeToast(`📍 Area updated to ${customSearchQuery.trim()}! Hospital distances recalculated.`);
      setTimeout(() => {
        setSearchStatus("");
        setAreaChangeToast("");
        setShowAreaPicker(false);
      }, 2500);
    } else {
      setSearchStatus("Area not found. Try a major city or district name.");
    }
  };

  // Dynamically sort emergency centers based on live coordinates or chosen area
  const sortedHealthCenters = useMemo(() => {
    return getSortedHealthCenters(
      userLocation?.latitude ?? userLocation?.lat ?? null,
      userLocation?.longitude ?? userLocation?.lng ?? null,
      filterType
    );
  }, [userLocation, filterType]);

  if (!isOpen) return null;

  const copyLiveLocationLink = () => {
    if (!userLocation) return;
    const url = `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const sendEmergencySMS = (contact) => {
    let locationSnippet = "";
    if (userLocation) {
      const typeLabel = userLocation.source === "gps" ? "live GPS location" : "current area location";
      locationSnippet = ` My ${typeLabel}: https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}${
        userLocation.address ? ` (${userLocation.address})` : ""
      }.`;
    }

    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS: Hi ${contact.name}, this is ${userName || "FemNura user"}. I am experiencing an urgent medical emergency and need immediate assistance!${locationSnippet} Please call me or send help right now.`
    );
    window.open(`sms:${contact.phone}?&body=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-plum-950/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-rose-500 w-full max-w-xl overflow-hidden my-auto"
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
                Emergency Assistance & Triage
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 mt-2 leading-relaxed">
            If you or someone near you is experiencing severe pain, hemorrhage, or trauma, contact emergency services immediately.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Emergency Care Area & Location Control Card */}
          <div className="rounded-2xl border-2 border-plum-200/90 bg-lavender-50/60 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-plum-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-extrabold uppercase tracking-wider text-plum-950">
                      Emergency Care Area:{" "}
                      <span className="text-rose-700 underline decoration-rose-300">
                        {userLocation?.city || userLocation?.address?.split(",")[0] || "Vijayawada"}
                      </span>
                    </p>
                  </div>
                  <p className="text-[11px] text-plum-600 truncate max-w-xs sm:max-w-md">
                    {userLocation?.address || "Vijayawada, Andhra Pradesh"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAreaPicker((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Choose a different city or area"
                >
                  <Building2 size={13} />
                  <span>{showAreaPicker ? "Hide Search" : "Change Area"}</span>
                </button>
                <button
                  type="button"
                  onClick={copyLiveLocationLink}
                  className="p-1.5 rounded-xl bg-white hover:bg-plum-100 text-plum-800 text-xs font-semibold border border-plum-200 flex items-center gap-1 cursor-pointer"
                  title="Copy location coordinate link"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Confirmation Toast upon Changing Area */}
            {areaChangeToast && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{areaChangeToast}</span>
              </div>
            )}

            {/* Quick 1-Click City Preset Pills */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-plum-600 flex items-center gap-1">
                  <Globe size={11} className="text-plum-500" />
                  Select City / Region (Instant Hospital Distance Update):
                </span>
                <span className="text-[10px] font-mono text-plum-500 hidden sm:inline">
                  {userLocation?.latitude?.toFixed(3)}°N, {userLocation?.longitude?.toFixed(3)}°E
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CITY_PRESETS.map((preset) => {
                  const targetLat = preset.latitude ?? preset.lat;
                  const targetLng = preset.longitude ?? preset.lng;
                  const isCurrent =
                    userLocation &&
                    Math.abs((userLocation.latitude ?? userLocation.lat) - targetLat) < 0.04 &&
                    Math.abs((userLocation.longitude ?? userLocation.lng) - targetLng) < 0.04;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectArea(preset)}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? "bg-plum-900 text-white border-plum-900 font-extrabold shadow-2xs ring-2 ring-plum-400/40"
                          : "bg-white hover:bg-lavender-100 text-plum-900 border-plum-200 font-medium"
                      }`}
                      title={`Switch to ${preset.name}`}
                    >
                      {isCurrent && <Check size={12} className="text-emerald-300" />}
                      <span>{preset.name.split(" (")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Area Search Bar (Toggled or Direct) */}
            {showAreaPicker && (
              <div className="pt-2 border-t border-plum-200/70 space-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customSearchQuery}
                      onChange={(e) => setCustomSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchArea();
                      }}
                      placeholder="Type any city or neighborhood (e.g. Visakhapatnam, Tirupati, Pune)..."
                      className="w-full text-xs px-3 py-2 pl-8 rounded-xl border border-plum-300 bg-white focus:outline-none focus:border-plum-600 focus:ring-1 focus:ring-plum-400"
                    />
                    <Search size={13} className="absolute left-2.5 top-2.5 text-plum-400" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchArea}
                    className="px-3.5 py-2 rounded-xl bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Set Area
                  </button>
                </div>
                {searchStatus && (
                  <p className="text-[11px] text-plum-700 font-semibold pl-1">{searchStatus}</p>
                )}
              </div>
            )}
          </div>

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
                    <p className="text-xs font-bold leading-tight">Women's 24/7 Helpline</p>
                    <p className="text-base font-extrabold font-mono">181 (Toll Free)</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">Call</span>
              </a>
            </div>
          </div>

          {/* Section 2: Real-Time Nearby Emergency Health Centers */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-plum-900 flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-600" /> Nearest Hospital ERs & Triage Centers
              </p>
              <button
                type="button"
                onClick={() => openNearestEmergencyCare(userLocation, setIsLocating)}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Live Map Search</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Direct 1-Tap Hospital Finder for Chosen Area */}
            <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-50 border-2 border-rose-300/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
                      Emergency Hospital Router
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-plum-950 leading-snug">
                    Find Nearest Emergency Care in {userLocation?.city || "Selected Area"}
                  </h4>
                  <p className="text-[11px] text-plum-600 mt-0.5">
                    Opens Google Maps directly centered on your active care area ({userLocation?.city || "Vijayawada"}) without requiring API keys or hardware GPS prompts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openNearestEmergencyCare(userLocation, setIsLocating)}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 active:scale-[0.98] text-white shadow-sm shadow-rose-600/30 transition-all cursor-pointer group shrink-0"
                  title={`Find Nearest Emergency Care in ${userLocation?.city || "Selected Area"}`}
                >
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-80" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                  <span>{isLocating ? "Opening Maps..." : `Find Nearest Emergency Care in ${userLocation?.city || "Area"}`}</span>
                  <ExternalLink size={13} className="text-rose-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Informative Status Label */}
              <p className="text-[10px] text-plum-600 mt-2 pt-2 border-t border-rose-100 flex items-center gap-1.5 font-medium">
                <Navigation size={11} className="text-rose-600 shrink-0" />
                <span>
                  📍 Route Origin: <strong className="text-plum-900">{userLocation?.city || userLocation?.address || "Selected Area"}</strong> ({userLocation?.latitude?.toFixed(3)}°N, {userLocation?.longitude?.toFixed(3)}°E) • All hospital directions start from here!
                </span>
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5">
              {[
                { id: "All", label: "All Centers" },
                { id: "Maternity", label: "Women & Maternity (24/7)" },
                { id: "Trauma", label: "Trauma & ICU" },
                { id: "Government", label: "Government General" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterType === f.id
                      ? "bg-plum-800 text-white shadow-2xs"
                      : "bg-white text-plum-700 border border-plum-200 hover:bg-lavender-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Health Center Cards */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {sortedHealthCenters.slice(0, 5).map((hc) => (
                <div
                  key={hc.id}
                  className="p-3.5 rounded-2xl bg-white border border-plum-200 hover:border-plum-300 transition-all shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          {hc.type}
                        </span>
                        {hc.is24x7 && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 24/7 ER Open
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-plum-950 text-xs sm:text-sm leading-snug">
                        {hc.name}
                      </h4>
                      <p className="text-[11px] text-plum-600 line-clamp-1 mt-0.5">
                        {hc.specialty}
                      </p>
                      <p className="text-[11px] text-plum-400 truncate mt-0.5">
                        {hc.address}
                      </p>
                    </div>

                    {/* Real-time distance indicator */}
                    {hc.distanceKm != null ? (
                      <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                        <span className="block text-xs font-black text-emerald-900 font-mono">
                          {formatDistance(hc.distanceKm)}
                        </span>
                        {hc.driveTime && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-0.5 mt-0.5">
                            <Clock size={10} /> ~{hc.driveTime} min
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-plum-400 bg-plum-50 px-2 py-1 rounded-lg shrink-0">
                        GPS off
                      </span>
                    )}
                  </div>

                  {/* Actions for this Health Center */}
                  <div className="flex items-center justify-between pt-1 border-t border-plum-100/70 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${hc.emergencyPhone || hc.phone}`}
                        className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Call Emergency Room"
                      >
                        <PhoneCall size={12} /> Call ER
                      </a>
                      <a
                        href={`tel:${hc.phone}`}
                        className="px-2.5 py-1 rounded-xl bg-lavender-50 hover:bg-lavender-100 text-plum-800 font-bold border border-plum-200 transition-colors cursor-pointer hidden xs:inline-flex"
                      >
                        Reception
                      </a>
                    </div>

                    <a
                      href={getDirectionsUrl(hc, userLocation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-plum-800 hover:bg-plum-900 text-white font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title={`Get route from ${userLocation?.city || userLocation?.address || "your selected area"} to ${hc.name}`}
                    >
                      <Navigation size={12} />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Care Circle & Emergency SMS with Live Location */}
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
                      {userLocation && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={10} /> Pre-fills your live GPS link in SMS
                        </span>
                      )}
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
                        title="Send pre-filled emergency SMS with live GPS location"
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
