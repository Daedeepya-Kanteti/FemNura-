import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/symptoms", label: "Symptom Tracker", icon: HeartPulse },
  { to: "/app/mood", label: "Mood Tracker", icon: Smile },
  { to: "/app/cycle", label: "Cycle Tracker", icon: CalendarHeart },
  { to: "/app/reminders", label: "Reminders", icon: BellRing },
  { to: "/app/timeline", label: "Health Timeline", icon: History },
  { to: "/app/doctor-qgen", label: "Doctor Q-Gen", icon: Stethoscope },
  { to: "/app/vault", label: "Medical Vault", icon: FileText },
  { to: "/app/education", label: "Education Hub", icon: BookOpenText },
  { to: "/app/care-circle", label: "Care Circle", icon: Users },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const { isDemoActive, userName, userEmail, currentAccount, endDemo } = useDemoData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDemoActive) navigate("/start");
  }, [isDemoActive]);

  const handleLogout = () => {
    endDemo();
    navigate("/");
  };

  if (!isDemoActive) return null;

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
              onClick={() => navigate("/start")}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-700 bg-lavender-50 hover:bg-lavender-100 px-2.5 py-2 rounded-lg transition-colors focus-ring"
            >
              <UserCheck size={14} /> Switch
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-plum-500 hover:text-rose-600 px-2.5 py-2 rounded-lg hover:bg-rose-50 transition-colors focus-ring"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-plum-100 flex items-center justify-between px-5 h-16">
        <Logo size="sm" withTagline={false} />
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-plum-700 focus-ring">
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-plum-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-plum-100">
                <Logo size="sm" />
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-plum-600 focus-ring rounded-lg">
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
                      navigate("/start");
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
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
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
