import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  HeartPulse,
  Smile,
  BellRing,
  History,
  Stethoscope,
  CalendarHeart,
  FileText,
  BookOpenText,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  UserCheck,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import RealtimeClockWidget from "../components/RealtimeClockWidget.jsx";
import SOSModal from "../components/SOSModal.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

// Dedicated clock/bell with sparkles icon for Nudge & Nourish
function NudgeNavIcon({ size = 18, className = "" }) {
  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <BellRing size={size} />
      <Sparkles
        size={Math.max(9, Math.round(size * 0.55))}
        className="absolute -top-1 -right-1 text-rose-500 fill-rose-300"
      />
    </span>
  );
}

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/symptoms", label: "Symptom Tracker", icon: HeartPulse },
  { to: "/app/mood", label: "Mood Tracker", icon: Smile },
  { to: "/app/cycle", label: "Cycle Tracker", icon: CalendarHeart },
  { to: "/app/reminders", label: "Reminders", icon: BellRing },
  { to: "/app/nudge-nourish", label: "Nudge & Nourish", icon: NudgeNavIcon },
  { to: "/app/timeline", label: "Health Timeline", icon: History },
  { to: "/app/doctor-qgen", label: "Doctor Q-Gen", icon: Stethoscope },
  { to: "/app/vault", label: "Medical Vault", icon: FileText },
  { to: "/app/education", label: "Education Hub", icon: BookOpenText },
  { to: "/app/care-circle", label: "Care Circle", icon: Users },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const { isDemoActive, userName, userEmail, currentAccount, logoutUser } = useDemoData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isDemoActive || !currentAccount) navigate("/start?tab=login");
  }, [isDemoActive, currentAccount]);

  const handleLogout = () => {
    logoutUser();
    navigate("/start?tab=login");
  };

  if (!isDemoActive || !currentAccount) return null;

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-plum-100 fixed h-screen">
        <div className="px-6 py-7 border-b border-plum-100">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {nav.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>
        <div className="p-4 border-t border-plum-100">
          {/* Direct SOS Button in Sidebar */}
          <button
            type="button"
            onClick={() => setSosOpen(true)}
            className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ring-2 ring-rose-200/80 animate-pulse"
            title="Open Emergency SOS Protocol"
          >
            <AlertTriangle size={15} className="text-white" />
            <span>SOS Emergency Call</span>
          </button>

          <div className="flex items-center gap-3 px-2 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
              style={{ backgroundColor: currentAccount?.avatarColor || "#7B5689" }}
            >
              {(userName?.[0] || "F").toUpperCase()}
            </div>
            <div className="text-sm min-w-0">
              <p className="font-semibold text-plum-800 truncate">{userName || "Friend"}</p>
              <p className="text-plum-400 text-xs truncate">{userEmail || "Saved credentials"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/start?tab=login")}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-700 bg-lavender-50 hover:bg-lavender-100 px-2.5 py-2 rounded-lg transition-colors focus-ring cursor-pointer"
            >
              <UserCheck size={14} /> Switch
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-500 hover:text-rose-600 px-2.5 py-2 rounded-lg hover:bg-rose-50 transition-colors focus-ring cursor-pointer"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-plum-100 flex items-center justify-between px-3.5 h-16 shadow-2xs">
        {/* Left side: Menu (three lines icon), Back button, and Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* That three lines icon menu placed on the left side */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-xl text-plum-800 hover:text-plum-950 hover:bg-lavender-100 transition-colors focus-ring cursor-pointer"
            aria-label="Open navigation menu"
            title="Open Menu"
          >
            <Menu size={22} />
          </button>

          {location.pathname !== "/app" ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-plum-600 hover:text-plum-900 rounded-lg hover:bg-lavender-50 transition-colors focus-ring flex items-center gap-1 text-xs font-semibold cursor-pointer"
              aria-label="Back to previous page"
              title="Go back"
            >
              <ArrowLeft size={18} />
              <span className="hidden xs:inline">Back</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="p-2 text-plum-600 hover:text-plum-900 rounded-lg hover:bg-lavender-50 transition-colors focus-ring flex items-center gap-1 text-xs font-semibold cursor-pointer"
              aria-label="Back to Home"
              title="Home"
            >
              <ArrowLeft size={18} />
              <span className="hidden xs:inline">Home</span>
            </button>
          )}

          <Logo size="sm" withTagline={false} />
        </div>

        {/* Right side: SOS Emergency button & Real-time Clock Widget */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSosOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black tracking-wider flex items-center gap-1 shadow-xs ring-2 ring-rose-200/90 animate-pulse cursor-pointer shrink-0"
            title="Open Emergency SOS Protocol"
            aria-label="Emergency SOS"
          >
            <AlertTriangle size={13} className="text-white" />
            <span>SOS</span>
          </button>
          <RealtimeClockWidget />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-plum-900/40 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col border-r border-plum-100"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-plum-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-plum-600 hover:text-plum-900 focus-ring rounded-lg cursor-pointer"
                  aria-label="Close navigation menu"
                  title="Close Menu"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {nav.map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setMobileOpen(false)} />
                ))}
              </nav>
              <div className="p-4 border-t border-plum-100">
                <div className="flex items-center gap-3 px-2 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                    style={{ backgroundColor: currentAccount?.avatarColor || "#7B5689" }}
                  >
                    {(userName?.[0] || "F").toUpperCase()}
                  </div>
                  <div className="text-sm min-w-0">
                    <p className="font-semibold text-plum-800 truncate">{userName || "Friend"}</p>
                    <p className="text-plum-400 text-xs truncate">{userEmail || "Saved credentials"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/start?tab=login");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-700 bg-lavender-50 hover:bg-lavender-100 px-2.5 py-2.5 rounded-lg transition-colors focus-ring"
                  >
                    <UserCheck size={14} /> Switch
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-500 hover:text-rose-600 px-2.5 py-2.5 rounded-lg hover:bg-rose-50 transition-colors focus-ring"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop sticky top bar with real-time clock & calendar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-plum-100/70 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-semibold text-plum-600">
            <span className="font-display text-plum-900 font-bold tracking-wide">FemNura</span>
            <span className="text-plum-300">•</span>
            <span className="text-plum-600 font-medium">Your Health. Your Priority.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSosOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold tracking-wide flex items-center gap-1.5 shadow-sm ring-2 ring-rose-200/90 transition-all hover:scale-105 cursor-pointer animate-pulse"
              title="Immediate Emergency Assistance, ER Locator & Care Circle SOS"
            >
              <AlertTriangle size={15} className="text-white" />
              <span>SOS Emergency</span>
            </button>
            <RealtimeClockWidget />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>

      {/* Global Emergency SOS Protocol Modal */}
      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}

function SidebarLink({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors focus-ring ${
          isActive ? "bg-plum-700 text-white" : "text-plum-600 hover:bg-lavender-50"
        }`
      }
    >
      <item.icon size={18} />
      {item.label}
    </NavLink>
  );
}
