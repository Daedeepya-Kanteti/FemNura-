import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { Button, Card, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const focusOptions = [
  "Tracking symptoms & fatigue",
  "Understanding my cycle",
  "Emotional wellness",
  "Getting ready for doctor visits",
  "Organising medical records",
];

export default function Onboarding() {
  const {
    savedAccounts,
    lastLoginAccount,
    loginWithAccount,
    registerOrLogin,
    removeSavedAccount,
  } = useDemoData();

  const navigate = useNavigate();

  // If there are saved accounts, start on the Google-style account selector
  const [view, setView] = useState(() => (savedAccounts && savedAccounts.length > 0 ? "choose_account" : "create_account"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [focus, setFocus] = useState([]);
  const [selectedAccountForPassword, setSelectedAccountForPassword] = useState(null);

  const toggleFocus = (f) =>
    setFocus((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const handleSelectSavedAccount = (account) => {
    loginWithAccount(account);
    navigate("/app");
  };

  const handleCreateOrLoginSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    registerOrLogin({
      name: name.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}@femnura.app`,
      password,
      focus,
    });
    navigate("/app");
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return "Saved account";
    try {
      const d = new Date(dateString);
      const diffHours = Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.round(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Saved account";
    }
  };

  return (
    <div className="min-h-screen bg-grad-hero flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum-600 hover:text-plum-950 bg-white/80 hover:bg-white border border-plum-200/80 px-3 py-1.5 rounded-xl transition-all shadow-xs focus-ring"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <Link to="/">
          <Logo size="sm" />
        </Link>
      </div>

      <Card className="w-full max-w-lg p-7 sm:p-9 relative overflow-hidden shadow-xl border-plum-100">
        <AnimatePresence mode="wait">
          {/* VIEW 1: GOOGLE-STYLE ACCOUNT CHOOSER */}
          {view === "choose_account" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-lavender-100 text-plum-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <User size={22} />
                </div>
                <h1 className="font-display text-2xl font-semibold text-plum-900">Choose an account</h1>
                <p className="text-sm text-plum-600 mt-1">to continue to FemNura</p>
              </div>

              {/* Saved accounts list */}
              <div className="divide-y divide-plum-100 border border-plum-200/80 rounded-2xl overflow-hidden mb-6 bg-white/70">
                {savedAccounts.map((acc) => {
                  const isLast = lastLoginAccount?.id === acc.id;
                  const initial = (acc.name?.[0] || "U").toUpperCase();

                  return (
                    <div
                      key={acc.id}
                      className="group flex items-center justify-between p-4 hover:bg-lavender-50/70 transition-all cursor-pointer"
                      onClick={() => handleSelectSavedAccount(acc)}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
                          style={{ backgroundColor: acc.avatarColor || "#7B5689" }}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-plum-900 text-sm truncate">{acc.name}</p>
                            {isLast && (
                              <span className="text-[10px] font-semibold bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full shrink-0">
                                Last logged in
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-plum-500 truncate">{acc.email}</p>
                          <p className="text-[11px] text-plum-400 mt-0.5 flex items-center gap-1">
                            <Clock size={10} /> Active {formatLastActive(acc.lastLoginTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          title="Remove saved account"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedAccount(acc.id);
                          }}
                          className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-plum-400 group-hover:text-plum-700 transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-center bg-white/80 border-plum-200 hover:bg-white text-plum-800"
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setView("create_account");
                  }}
                >
                  <UserPlus size={16} /> Use another account
                </Button>

                <div className="flex flex-col items-center justify-center gap-2 text-xs text-plum-500 pt-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-sage-600" />
                    <span>Your login credentials & health data are saved securely.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-xs text-plum-500 hover:text-plum-800 font-semibold inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Return to Home page
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 2: NEW / ANOTHER ACCOUNT FORM */}
          {view === "create_account" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h1 className="font-display text-2xl font-semibold text-plum-900">Sign in to FemNura</h1>
                {savedAccounts.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setView("choose_account")}
                    className="text-xs font-semibold text-plum-600 hover:text-plum-900 flex items-center gap-1 bg-lavender-100/60 hover:bg-lavender-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Saved accounts ({savedAccounts.length})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-xs font-semibold text-plum-600 hover:text-plum-900 flex items-center gap-1 bg-lavender-100/60 hover:bg-lavender-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Back to Home
                  </button>
                )}
              </div>

              <p className="text-sm text-plum-600 mb-6 leading-relaxed">
                Enter your details to create or access your profile. Credentials and health logs are saved for instant one-click login next time.
              </p>

              <form onSubmit={handleCreateOrLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      autoFocus
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Daedeepya, Sarah, Maya"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Email Address (optional)
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. daedeepyakanteti@gmail.com"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Password / PIN (optional)
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Keep optional or enter a personal PIN"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                {/* Focus areas */}
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-2">
                    What matters most right now?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {focusOptions.map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => toggleFocus(f)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          focus.includes(f)
                            ? "bg-plum-700 text-white border-plum-700 font-semibold"
                            : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-plum-700 accent-plum-700 border-plum-300 focus:ring-plum-500"
                  />
                  <label htmlFor="remember" className="text-xs text-plum-700 font-medium cursor-pointer">
                    Save login credentials for quick 1-click login like Google
                  </label>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center py-3 text-sm font-semibold"
                    disabled={!name.trim()}
                  >
                    Save & Continue to Dashboard <ArrowRight size={16} />
                  </Button>
                </div>
              </form>

              <div className="text-center mt-5 pt-4 border-t border-plum-100 flex items-center justify-center gap-4">
                {savedAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView("choose_account")}
                    className="text-xs text-plum-500 hover:text-plum-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Back to saved accounts
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-xs text-plum-400 hover:text-plum-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} /> Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
