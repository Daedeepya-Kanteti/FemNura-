import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  LogIn,
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
    loginUser,
    signupUser,
    removeSavedAccount,
  } = useDemoData();

  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL query params or state
  const queryParams = new URLSearchParams(location.search);
  const paramTab = queryParams.get("tab") || queryParams.get("mode");

  const [activeTab, setActiveTab] = useState(() => {
    if (paramTab === "signup" || paramTab === "register") return "signup";
    if (paramTab === "login" || paramTab === "signin") return "login";
    return savedAccounts && savedAccounts.length > 0 ? "login" : "login";
  });

  // Keep active tab in sync if query param changes
  useEffect(() => {
    if (paramTab === "signup" || paramTab === "register") {
      setActiveTab("signup");
    } else if (paramTab === "login" || paramTab === "signin") {
      setActiveTab("login");
    }
  }, [paramTab]);

  // Log In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRememberMe, setLoginRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  // Sign Up Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupRememberMe, setSignupRememberMe] = useState(true);
  const [signupFocus, setSignupFocus] = useState([]);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const toggleFocus = (f) =>
    setSignupFocus((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const formatLastActive = (dateString) => {
    if (!dateString) return "Saved profile";
    try {
      const d = new Date(dateString);
      const diffHours = Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.round(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Saved profile";
    }
  };

  // Handle direct login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    if (!loginEmail.trim()) {
      setLoginError("Please enter your email address.");
      return;
    }

    const res = loginUser({
      email: loginEmail.trim(),
      password: loginPassword,
      rememberMe: loginRememberMe,
    });

    if (res.success) {
      setLoginSuccess(`Welcome back, ${res.account.name || "friend"}! Restoring your health records...`);
      setTimeout(() => {
        navigate("/app");
      }, 400);
    } else {
      setLoginError(res.error || "Unable to log in. Please check your credentials.");
    }
  };

  // Handle direct sign up submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupName.trim()) {
      setSignupError("Please enter your name.");
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError("Please enter your email address.");
      return;
    }

    const res = signupUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      focus: signupFocus,
      rememberMe: signupRememberMe,
    });

    if (res.success) {
      setSignupSuccess(`Account created for ${res.account.name}! Opening your dashboard...`);
      setTimeout(() => {
        navigate("/app");
      }, 400);
    } else {
      setSignupError(res.error || "Unable to create account. Please try again.");
    }
  };

  // Handle clicking a saved device profile
  const handleSelectSavedAccount = (acc) => {
    setLoginError("");
    setLoginEmail(acc.email);
    loginWithAccount(acc);
    setLoginSuccess(`Welcome back, ${acc.name}! Restoring your health records...`);
    setTimeout(() => {
      navigate("/app");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-grad-hero flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
      {/* Top Header Bar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum-700 hover:text-plum-950 bg-white/80 hover:bg-white border border-plum-200/90 px-3 py-1.5 rounded-xl transition-all shadow-2xs focus-ring cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <Link to="/">
          <Logo size="sm" />
        </Link>
      </div>

      <Card className="w-full max-w-lg p-6 sm:p-9 relative overflow-hidden shadow-xl border-plum-100 bg-white/95 backdrop-blur-md">
        {/* Tab Toggle Switch */}
        <div className="grid grid-cols-2 p-1 bg-lavender-100/70 rounded-2xl mb-6 border border-plum-200/70">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
              setSignupError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "login"
                ? "bg-white text-plum-900 shadow-sm"
                : "text-plum-600 hover:text-plum-900 hover:bg-white/50"
            }`}
          >
            <LogIn size={15} />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setLoginError("");
              setSignupError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "signup"
                ? "bg-white text-plum-900 shadow-sm"
                : "text-plum-600 hover:text-plum-900 hover:bg-white/50"
            }`}
          >
            <UserPlus size={15} />
            <span>Sign Up</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: LOG IN */}
          {activeTab === "login" && (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 text-center">
                <h1 className="font-display text-2xl font-bold text-plum-950">
                  Welcome to FemNura
                </h1>
                <p className="text-xs sm:text-sm text-plum-600 mt-1">
                  Log in to access your private symptom logs, cycle insights, and saved records.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600 animate-spin" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              {/* Profiles saved on THIS device only */}
              {savedAccounts && savedAccounts.length > 0 && (
                <div className="mb-5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-plum-700 block mb-2">
                    Saved on this device
                  </label>
                  <div className="divide-y divide-plum-100 border border-plum-200/90 rounded-2xl overflow-hidden bg-white/80 shadow-2xs">
                    {savedAccounts.map((acc) => {
                      const isLast = lastLoginAccount?.id === acc.id;
                      const initial = (acc.name?.[0] || "U").toUpperCase();

                      return (
                        <div
                          key={acc.id}
                          onClick={() => handleSelectSavedAccount(acc)}
                          className="group flex items-center justify-between p-3.5 hover:bg-lavender-50/70 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-2xs shrink-0"
                              style={{ backgroundColor: acc.avatarColor || "#7B5689" }}
                            >
                              {initial}
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-plum-900 text-sm truncate">{acc.name}</p>
                                {isLast && (
                                  <span className="text-[10px] font-bold bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full shrink-0">
                                    Last active
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-plum-500 truncate">{acc.email}</p>
                              <p className="text-[10px] text-plum-400 mt-0.5 flex items-center gap-1">
                                <Clock size={10} /> {formatLastActive(acc.lastLoginTime)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              title="Remove profile from this device"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSavedAccount(acc.id);
                              }}
                              className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                            <span className="text-xs font-bold text-plum-700 bg-lavender-100 group-hover:bg-plum-800 group-hover:text-white px-2.5 py-1.5 rounded-xl transition-all">
                              Log in
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-plum-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-plum-400">
                      Or log in with email
                    </span>
                    <div className="flex-grow border-t border-plum-200"></div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="email"
                      required
                      autoFocus={!savedAccounts || savedAccounts.length === 0}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block">
                      Password / PIN
                    </label>
                    <span className="text-[11px] text-plum-400 font-normal">
                      (Optional if not configured)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password or PIN"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-10 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-plum-400 hover:text-plum-700 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginRememberMe}
                      onChange={(e) => setLoginRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-plum-700 accent-plum-700 border-plum-300 focus:ring-plum-500"
                    />
                    <span className="text-xs text-plum-700 font-medium">
                      Remember me on this device
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center py-3 text-sm font-semibold shadow-md cursor-pointer"
                    disabled={!loginEmail.trim()}
                  >
                    <span>Log In to Dashboard</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-plum-100 text-center">
                <p className="text-xs text-plum-600">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setLoginError("");
                    }}
                    className="font-bold text-plum-800 hover:text-plum-950 underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === "signup" && (
            <motion.div
              key="signup-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 text-center">
                <h1 className="font-display text-2xl font-bold text-plum-950">
                  Create Your Account
                </h1>
                <p className="text-xs sm:text-sm text-plum-600 mt-1">
                  Private, confidential, and saved to your device. No medical ads, ever.
                </p>
              </div>

              {signupError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{signupError}</span>
                </div>
              )}

              {signupSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600 animate-spin" />
                  <span>{signupSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Maya Sharma, Sarah, Elena"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. maya@example.com"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-4 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block">
                      Create Password / PIN
                    </label>
                    <span className="text-[11px] text-plum-400 font-normal">
                      (Optional personal security)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Choose a password or PIN"
                      className="w-full rounded-xl border border-plum-200 pl-10 pr-10 py-3 text-sm text-plum-900 focus-ring bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-plum-400 hover:text-plum-700 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Health Focus Area */}
                <div className="pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-plum-700 block mb-2">
                    What are your main health priorities? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {focusOptions.map((f) => {
                      const isSelected = signupFocus.includes(f);
                      return (
                        <button
                          type="button"
                          key={f}
                          onClick={() => toggleFocus(f)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-plum-800 text-white border-plum-800 font-semibold shadow-2xs"
                              : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="signupRemember"
                    checked={signupRememberMe}
                    onChange={(e) => setSignupRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-plum-700 accent-plum-700 border-plum-300 focus:ring-plum-500"
                  />
                  <label htmlFor="signupRemember" className="text-xs text-plum-700 font-medium cursor-pointer">
                    Remember me on this device for quick login
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center py-3 text-sm font-semibold shadow-md cursor-pointer"
                    disabled={!signupName.trim() || !signupEmail.trim()}
                  >
                    <span>Create Profile & Enter FemNura</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-plum-100 text-center">
                <p className="text-xs text-plum-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setSignupError("");
                    }}
                    className="font-bold text-plum-800 hover:text-plum-950 underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security & Privacy Pledge Footer */}
        <div className="mt-6 pt-4 border-t border-plum-100/80 flex items-center justify-center gap-2 text-xs text-plum-500">
          <ShieldCheck size={14} className="text-sage-600 shrink-0" />
          <span>Your health records stay on your device and are never shared.</span>
        </div>
      </Card>
    </div>
  );
}
