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
  const [isLocating, setIsLocating] = useState(false);

  // Dynamically sort emergency centers based on live user GPS coordinates
  const sortedHealthCenters = useMemo(() => {
    return getSortedHealthCenters(
      userLocation?.latitude ?? null,
      userLocation?.longitude ?? null,
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
          {/* User Location Tracking Control Card */}
          <div className="rounded-2xl border-2 border-plum-200/90 bg-lavender-50/50 p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isLocationEnabled ? "bg-emerald-600 text-white" : "bg-plum-100 text-plum-700"}`}>
                  <Compass size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-plum-950">Emergency Location Services</p>
                  <p className="text-[11px] text-plum-600">Calculates distance & drive time to nearest hospital ERs</p>
                </div>
              </div>

              {/* User Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-plum-700 hidden sm:inline">
                  {isLocationEnabled ? "Tracking Active" : "Location OFF"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleLocationTracking(!isLocationEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isLocationEnabled ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={isLocationEnabled}
                  title={isLocationEnabled ? "Disable location tracking" : "Enable location tracking"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isLocationEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Location Active Display */}
            {isLocationEnabled ? (
              <div className="mt-3 pt-3 border-t border-plum-200/70 space-y-2.5">
                {locationLoading ? (
                  <div className="flex items-center gap-2 text-xs text-plum-700 bg-white/80 p-2.5 rounded-xl border border-plum-200">
                    <RefreshCw size={14} className="animate-spin text-plum-600" />
                    <span>Detecting current location and calculating hospital triage distances...</span>
                  </div>
                ) : userLocation ? (
                  <div className="bg-white p-3 rounded-xl border border-plum-200 shadow-2xs space-y-2.5">
                    {/* Notice if browser GPS hardware was denied/restricted */}
                    {userLocation.isApproximate && userLocation.permissionRestricted && (
                      <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <Info size={15} className="text-amber-700 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-bold text-amber-950">
                            Browser GPS permission restricted or blocked by iframe
                          </p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            FemNura has automatically switched to network/area location so emergency hospital ER distances, drive times, and directions still work! You can also pick your exact city below.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              userLocation.source === "gps" ? "bg-emerald-500 animate-pulse" : "bg-plum-500"
                            }`}
                          />
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider ${
                              userLocation.source === "gps" ? "text-emerald-800" : "text-plum-800"
                            }`}
                          >
                            {userLocation.source === "gps"
                              ? "Live GPS Coordinates"
                              : userLocation.source === "manual"
                              ? "Manual Area Selected"
                              : "Network / Regional Location"}
                          </span>
                          <span className="text-[10px] text-plum-400">
                            ({userLocation.source === "gps" ? `±${userLocation.accuracy}m` : "Approx. Area"})
                          </span>
                        </div>
                        <p className="text-xs font-bold text-plum-900 truncate">
                          📍 {userLocation.address || `${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°`}
                        </p>
                        <p className="text-[11px] font-mono text-plum-500 mt-0.5">
                          {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowAreaPicker((prev) => !prev)}
                          className="px-2 py-1.5 rounded-lg bg-plum-100 hover:bg-plum-200 text-plum-900 text-xs font-bold border border-plum-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Change City or Area"
                        >
                          <Building2 size={12} />
                          <span className="text-[11px]">{showAreaPicker ? "Close" : "Change Area"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={copyLiveLocationLink}
                          className="p-1.5 rounded-lg bg-lavender-50 hover:bg-lavender-100 text-plum-800 text-xs font-semibold border border-plum-200 flex items-center gap-1 cursor-pointer"
                          title="Copy Google Maps coordinate link"
                        >
                          {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span className="text-[11px] hidden xs:inline">{copiedLink ? "Copied" : "Copy"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={refreshLocation}
                          className="p-1.5 rounded-lg bg-lavender-50 hover:bg-lavender-100 text-plum-800 border border-plum-200 cursor-pointer"
                          title="Retry or refresh GPS coordinates"
                        >
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable City & Area Picker */}
                    {showAreaPicker && (
                      <div className="pt-2.5 mt-2 border-t border-plum-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-bold text-plum-900 uppercase tracking-wider flex items-center gap-1">
                            <Globe size={12} className="text-plum-600" /> Select Quick City Preset:
                          </p>
                          <button
                            type="button"
                            onClick={refreshLocation}
                            className="text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw size={11} /> Retry Browser GPS
                          </button>
                        </div>

                        {/* City Preset Buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {CITY_PRESETS.map((preset) => {
                            const isCurrent =
                              Math.abs(userLocation.latitude - preset.lat) < 0.05 &&
                              Math.abs(userLocation.longitude - preset.lng) < 0.05;
                            return (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  setManualLocation(preset);
                                  setShowAreaPicker(false);
                                }}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                  isCurrent
                                    ? "bg-plum-800 text-white border-plum-800 shadow-2xs"
                                    : "bg-lavender-50/70 hover:bg-lavender-100 text-plum-900 border-plum-200"
                                }`}
                              >
                                {preset.name.split(" (")[0]}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Area Search Bar */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={customSearchQuery}
                              onChange={(e) => setCustomSearchQuery(e.target.value)}
                              onKeyDown={async (e) => {
                                if (e.key === "Enter" && customSearchQuery.trim()) {
                                  setSearchStatus("Searching...");
                                  const ok = await searchAndSetLocation(customSearchQuery);
                                  setSearchStatus(ok ? "Area set!" : "Location not found");
                                  if (ok) {
                                    setTimeout(() => {
                                      setShowAreaPicker(false);
                                      setSearchStatus("");
                                    }, 1000);
                                  }
                                }
                              }}
                              placeholder="Or search city, town, or area..."
                              className="w-full text-xs px-2.5 py-1.5 pl-7 rounded-lg border border-plum-200 bg-white focus:outline-none focus:border-plum-500"
                            />
                            <Search size={12} className="absolute left-2.5 top-2 text-plum-400" />
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!customSearchQuery.trim()) return;
                              setSearchStatus("Searching...");
                              const ok = await searchAndSetLocation(customSearchQuery);
                              setSearchStatus(ok ? "Area set!" : "Not found");
                              if (ok) {
                                setTimeout(() => {
                                  setShowAreaPicker(false);
                                  setSearchStatus("");
                                }, 1000);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                          >
                            Set Area
                          </button>
                        </div>
                        {searchStatus && (
                          <p className="text-[10px] text-plum-600 font-medium pl-1">{searchStatus}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : locationError ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{locationError}</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Pick a city below to calculate emergency hospital distances:
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {CITY_PRESETS.slice(0, 4).map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setManualLocation(preset)}
                          className="px-2 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-bold hover:bg-amber-100 cursor-pointer"
                        >
                          {preset.name.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-plum-600 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span>
                    Privacy Mode: Device GPS is off. You can enable GPS or pick your city directly to calculate ER distances:
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleLocationTracking(true)}
                      className="font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      Turn On GPS
                    </button>
                    <span className="text-plum-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        toggleLocationTracking(true);
                        setShowAreaPicker(true);
                      }}
                      className="font-bold text-plum-800 hover:text-plum-950 underline cursor-pointer"
                    >
                      Change Area
                    </button>
                  </div>
                </div>

                {/* Quick 1-tap city selection buttons right from Privacy Mode */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {CITY_PRESETS?.slice(0, 5).map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        toggleLocationTracking(true);
                        setManualLocation(preset);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-lavender-100 text-plum-900 border border-plum-200 text-[10px] font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      📍 {preset.name.split(" (")[0]}
                    </button>
                  ))}
                </div>
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
                onClick={() => openNearestEmergencyCare(setIsLocating)}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Live Map Search</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Direct 1-Tap Live Geolocation Hospital Finder */}
            <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-50 border-2 border-rose-300/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
                      Live Hospital Radar
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-plum-950 leading-snug">
                    Launch Instant GPS Emergency Routing
                  </h4>
                  <p className="text-[11px] text-plum-600 mt-0.5">
                    Uses native device GPS to locate closest 24/7 hospitals on Google Maps without any API keys.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openNearestEmergencyCare(setIsLocating)}
                  disabled={isLocating}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 active:scale-[0.98] text-white shadow-sm shadow-rose-600/30 transition-all cursor-pointer group shrink-0"
                  title="Find Nearest Emergency Care using live device GPS"
                >
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-80" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                  <span>{isLocating ? "Locating..." : "Find Nearest Emergency Care"}</span>
                  <ExternalLink size={13} className="text-rose-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Informative Status Label */}
              <p className="text-[10px] text-plum-500 mt-2 pt-2 border-t border-rose-100 flex items-center gap-1.5 font-medium">
                <Navigation size={11} className="text-rose-600 shrink-0" />
                <span>Uses device GPS for real-time routing (No Google Maps API key required)</span>
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
                      href={getDirectionsUrl(hc.lat, hc.lng, hc.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-xl bg-plum-800 hover:bg-plum-900 text-white font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
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
