import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Smile,
  CalendarHeart,
  Stethoscope,
  Sparkles,
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileText,
  UserCheck,
  UserPlus,
  ChevronDown,
  X,
  Trash2,
  User,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, Badge, Disclaimer, FadeIn } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import RemedyModal from "../components/RemedyModal.jsx";
import { getRemedyForSymptom, getRemedyForMood, getRemedyForCycle } from "../data/remedies.js";
import { detectRedFlags } from "../utils/redFlags.js";
import RedFlagAlertBanner from "../components/RedFlagAlertBanner.jsx";

export default function Dashboard() {
  const {
    userName,
    userEmail,
    currentAccount,
    savedAccounts,
    loginWithAccount,
    registerOrLogin,
    removeSavedAccount,
    symptoms,
    moods,
    cycleEntries,
    reminders,
    doctorSessions,
  } = useDemoData();

  const navigate = useNavigate();
  const [dismissedFlagId, setDismissedFlagId] = useState(null);

  // Switch Account Modal & Form states
  const [switchAccountModalOpen, setSwitchAccountModalOpen] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [newAccName, setNewAccName] = useState("");
  const [newAccEmail, setNewAccEmail] = useState("");
  const [newAccPassword, setNewAccPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwitchAccount = (account) => {
    if (account.id === currentAccount?.id) {
      setSwitchAccountModalOpen(false);
      return;
    }
    loginWithAccount(account);
    setSwitchAccountModalOpen(false);
    setShowAddAccountForm(false);
    triggerToast(`Switched profile to ${account.name}!`);
  };

  const handleCreateNewAccount = (e) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const trimmedName = newAccName.trim();
    const cleanEmail =
      newAccEmail.trim() ||
      `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now().toString().slice(-4)}@femnura.app`;

    registerOrLogin({
      name: trimmedName,
      email: cleanEmail,
      password: newAccPassword,
    });

    setNewAccName("");
    setNewAccEmail("");
    setNewAccPassword("");
    setShowAddAccountForm(false);
    setSwitchAccountModalOpen(false);
    triggerToast(`Created and switched to ${trimmedName}'s profile!`);
  };

  const handleDeleteSavedAccount = (e, acc) => {
    e.stopPropagation();
    if (savedAccounts.length <= 1) {
      triggerToast("Cannot delete the only saved account.");
      return;
    }
    if (window.confirm(`Remove saved account "${acc.name}" and its local data?`)) {
      removeSavedAccount(acc.id);
      triggerToast(`Account "${acc.name}" removed.`);
    }
  };

  // Check recent symptoms for any clinical red flags
  const activeRedFlag = React.useMemo(() => {
    for (const s of symptoms.slice(0, 5)) {
      const match = detectRedFlags(s.name, s.notes || "");
      if (match) return match;
    }
    return null;
  }, [symptoms]);

  const showRedFlagBanner = activeRedFlag && dismissedFlagId !== activeRedFlag.id;

  // Instant Remedy Modal state
  const [remedyModalOpen, setRemedyModalOpen] = useState(false);
  const [currentRemedy, setCurrentRemedy] = useState(null);
  const [modalItemType, setModalItemType] = useState("symptom");
  const [modalItemName, setModalItemName] = useState("");

  const openRemedy = (type, name) => {
    let remedy = null;
    if (type === "symptom") remedy = getRemedyForSymptom(name);
    else if (type === "mood") remedy = getRemedyForMood(name);
    else if (type === "cycle") remedy = getRemedyForCycle(name);

    if (remedy) {
      setCurrentRemedy(remedy);
      setModalItemType(type);
      setModalItemName(name);
      setRemedyModalOpen(true);
    }
  };

  const activeReminders = reminders.filter((r) => r.active).length;
  const latestMood = moods[0];
  const latestSymptom = symptoms[0];

  return (
    <div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-plum-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-plum-700 text-sm font-semibold max-w-md"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        showBack={true}
        backTo="/"
        backLabel="Back to Home"
        eyebrow="Your dashboard"
        title={`Good to see you, ${userName || "Friend"} 🌿`}
        subtitle="Here's a gentle overview of where things stand. Nothing is tracked unless you log it."
        action={
          <button
            type="button"
            onClick={() => setSwitchAccountModalOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-plum-200/90 shadow-2xs hover:shadow-xs hover:border-plum-300 transition-all cursor-pointer text-left focus-ring"
            title="Switch account profile"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0"
              style={{ backgroundColor: currentAccount?.avatarColor || "#7B5689" }}
            >
              {(userName?.[0] || "F").toUpperCase()}
            </div>
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-plum-900 truncate max-w-[120px]">{userName || "Friend"}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-lavender-100 text-plum-700">Active</span>
              </div>
              <span className="text-[11px] text-plum-500 truncate block max-w-[140px]">{userEmail || "Local profile"}</span>
            </div>
            <UserCheck size={16} className="text-plum-600 shrink-0 ml-0.5" />
          </button>
        }
      />

      {/* Account Profile Bar with Direct Switch Account Trigger */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-plum-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
            style={{ backgroundColor: currentAccount?.avatarColor || "#7B5689" }}
          >
            {(userName?.[0] || "F").toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs sm:text-sm font-bold text-plum-900 truncate">
                Active Account: <span className="text-plum-800">{userName || "Friend"}</span>
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck size={11} /> Isolated Health Storage
              </span>
            </div>
            <p className="text-xs text-plum-500 truncate mt-0.5">
              {userEmail || "Signed in with local profile credentials"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSwitchAccountModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer focus-ring"
          >
            <UserCheck size={14} />
            <span>Switch Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAddAccountForm(true);
              setSwitchAccountModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-lavender-50 hover:bg-lavender-100 text-plum-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-plum-200/80 cursor-pointer focus-ring"
            title="Add a new profile"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add Profile</span>
          </button>
        </div>
      </div>

      {/* Emergency Red Flag High Alert Banner if acute symptoms are detected */}
      {showRedFlagBanner && (
        <RedFlagAlertBanner
          flag={activeRedFlag}
          onDismiss={() => setDismissedFlagId(activeRedFlag.id)}
        />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={HeartPulse}
          tone="rose"
          label="Symptom entries"
          value={symptoms.length}
          hint={latestSymptom ? `Last: ${latestSymptom.name}` : "Nothing logged yet"}
          to="/app/symptoms"
        />
        <StatCard
          icon={Smile}
          tone="lavender"
          label="Mood entries"
          value={moods.length}
          hint={latestMood ? `Last: ${latestMood.mood}` : "Nothing logged yet"}
          to="/app/mood"
        />
        <StatCard
          icon={CalendarHeart}
          tone="plum"
          label="Cycle entries"
          value={cycleEntries.length}
          hint={cycleEntries[0] ? `Last: ${cycleEntries[0].phase}` : "Nothing logged yet"}
          to="/app/cycle"
        />
        <StatCard
          icon={BellRing}
          tone="sage"
          label="Active reminders"
          value={activeReminders}
          hint="Tap to manage"
          to="/app/reminders"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <FadeIn className="lg:col-span-2">
          <Card className="p-6 sm:p-7 h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-plum-800">Quick actions</h2>
              <Sparkles size={18} className="text-rose-400" />
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <QuickAction to="/app/symptoms" label="Log a symptom" desc="Takes under a minute" icon={HeartPulse} />
              <QuickAction to="/app/vault" label="Medical Vault" desc="Upload reports & prescriptions" icon={FileText} />
              <QuickAction to="/app/mood" label="Log your mood" desc="How are you feeling today?" icon={Smile} />
              <QuickAction to="/app/doctor-qgen" label="Prepare for a visit" desc="Generate doctor questions" icon={Stethoscope} />
              <QuickAction
                onClick={() => setSwitchAccountModalOpen(true)}
                label="Switch Account"
                desc={`Currently: ${userName || "Active user"}`}
                icon={UserCheck}
              />
              <QuickAction to="/app/reminders" label="Reminders" desc="Medications, water & mood" icon={BellRing} />
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="p-6 sm:p-7 h-full bg-gradient-to-br from-plum-900 via-plum-950 to-plum-900 text-white flex flex-col border-2 border-plum-700/70 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                <Sparkles size={13} className="text-amber-200" /> AI Insight
              </span>
              <span className="text-[11px] font-semibold text-rose-300">
                Grounded in your logs
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2 leading-snug">
              {symptoms.length || moods.length
                ? "A gentle pattern from your recorded entries"
                : "Your personal insights will appear here"}
            </h3>

            <p className="text-sm text-slate-100 font-medium leading-relaxed flex-1">
              {symptoms.length || moods.length ? (
                <>
                  You have logged{" "}
                  <span className="font-extrabold text-amber-300 bg-plum-800 px-2 py-0.5 rounded border border-plum-600">
                    {symptoms.length} symptom{symptoms.length === 1 ? "" : "s"}
                  </span>{" "}
                  and{" "}
                  <span className="font-extrabold text-amber-300 bg-plum-800 px-2 py-0.5 rounded border border-plum-600">
                    {moods.length} mood log{moods.length === 1 ? "" : "s"}
                  </span>{" "}
                  so far. As you log consistently, FemNura reflects honest, clear observations back to you for your next doctor discussion.
                </>
              ) : (
                "Once you log a few symptoms or moods, FemNura will reflect gentle, honest observations here — based only on what you've actually recorded, never fabricated or alarmist."
              )}
            </p>

            <Link to="/app/timeline" className="mt-5">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center bg-white text-plum-950 font-bold border-2 border-white hover:bg-lavender-50 shadow-md text-xs sm:text-sm"
              >
                View full timeline <ArrowRight size={15} />
              </Button>
            </Link>
          </Card>
        </FadeIn>
      </div>

      {/* Instant Evidence-Based Remedy & Comfort Bar */}
      <FadeIn className="mb-8">
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-rose-50/50 via-white to-lavender-50/50 border border-plum-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-2xs">
                  <Sparkles size={12} className="text-amber-200" /> Instant Clinical Remedies
                </span>
                <span className="text-xs text-plum-500 font-semibold">Researched Relief Guides</span>
              </div>
              <h3 className="font-display text-lg font-bold text-plum-950 mt-1">
                Feeling uncomfortable right now?
              </h3>
              <p className="text-xs text-plum-600 max-w-xl">
                Select an issue below for verified, immediate steps, herbal support, and clinical rationale (ACOG, Cleveland Clinic & Mayo Clinic evidence):
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: "Cramps", type: "symptom", icon: "🌸" },
                { name: "Fatigue", type: "symptom", icon: "⚡" },
                { name: "Headache", type: "symptom", icon: "🧠" },
                { name: "Bloating", type: "symptom", icon: "🍃" },
                { name: "Low", type: "mood", label: "Low Mood", icon: "💭" },
                { name: "Luteal", type: "cycle", label: "PMS / Luteal", icon: "🌙" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => openRemedy(item.type, item.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-plum-800 border border-plum-200 hover:border-plum-400 hover:bg-lavender-50 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span>{item.label || item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </FadeIn>

      {doctorSessions.length > 0 && (
        <FadeIn className="mb-8">
          <Card className="p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Your latest doctor-prep session</h2>
            <p className="text-sm text-plum-500 mb-3">{new Date(doctorSessions[0].date).toLocaleString()}</p>
            <ul className="space-y-2">
              {doctorSessions[0].questions.slice(0, 3).map((q, i) => (
                <li key={i} className="text-sm text-plum-700 bg-lavender-50 rounded-xl px-4 py-3">
                  {q}
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>
      )}

      <Disclaimer />

      {/* Instant Evidence-Based Remedy Modal */}
      <RemedyModal
        isOpen={remedyModalOpen}
        onClose={() => setRemedyModalOpen(false)}
        remedy={currentRemedy}
        itemType={modalItemType}
        itemName={modalItemName}
      />

      {/* Switch Account Modal */}
      <AnimatePresence>
        {switchAccountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-plum-950/65 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-plum-100 w-full max-w-lg overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-plum-800 via-plum-900 to-plum-950 text-white p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Switch Account Profile</h3>
                    <p className="text-xs text-plum-200">
                      Each profile keeps separate symptoms, cycle & records
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSwitchAccountModalOpen(false);
                    setShowAddAccountForm(false);
                  }}
                  className="p-1.5 text-plum-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Account list */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum-700 mb-2">
                    Select Profile ({savedAccounts.length})
                  </label>
                  <div className="divide-y divide-plum-100 border border-plum-200 rounded-2xl overflow-hidden bg-white">
                    {savedAccounts.map((acc) => {
                      const isActive = currentAccount?.id === acc.id;
                      const initial = (acc.name?.[0] || "U").toUpperCase();

                      return (
                        <div
                          key={acc.id}
                          onClick={() => handleSwitchAccount(acc)}
                          className={`flex items-center justify-between p-3.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-lavender-50/80 ring-1 ring-inset ring-plum-300"
                              : "hover:bg-lavender-50/40"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                              style={{ backgroundColor: acc.avatarColor || "#7B5689" }}
                            >
                              {initial}
                            </div>
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-plum-900 text-sm truncate">{acc.name}</p>
                                {isActive && (
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Current
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-plum-500 truncate">{acc.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {!isActive && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSwitchAccount(acc);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-plum-100 hover:bg-plum-800 hover:text-white text-plum-800 text-xs font-bold transition-all cursor-pointer"
                              >
                                Switch
                              </button>
                            )}

                            {savedAccounts.length > 1 && !isActive && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSavedAccount(e, acc)}
                                className="p-1.5 text-plum-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove saved account"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add Another Profile Accordion / Form */}
                {!showAddAccountForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAddAccountForm(true)}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-plum-200 hover:border-plum-400 text-plum-700 hover:bg-lavender-50/50 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <UserPlus size={16} className="text-plum-600" />
                    <span>+ Add Another User Profile</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleCreateNewAccount}
                    className="p-4 rounded-2xl border border-plum-200 bg-lavender-50/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-plum-900 flex items-center gap-1.5">
                        <UserPlus size={14} className="text-plum-700" /> Create & Switch to New Profile
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddAccountForm(false)}
                        className="text-xs text-plum-400 hover:text-plum-700 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-plum-700 mb-1">
                        Full Name / Nickname *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAccName}
                        onChange={(e) => setNewAccName(e.target.value)}
                        placeholder="e.g. Deepya, Mom, Maya"
                        className="w-full rounded-xl border border-plum-200 px-3 py-2 text-xs text-plum-900 focus-ring bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-plum-700 mb-1">
                        Email Address (optional)
                      </label>
                      <input
                        type="email"
                        value={newAccEmail}
                        onChange={(e) => setNewAccEmail(e.target.value)}
                        placeholder="e.g. deepya@example.com (or auto-generated)"
                        className="w-full rounded-xl border border-plum-200 px-3 py-2 text-xs text-plum-900 focus-ring bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-plum-700 mb-1">
                        Password (optional)
                      </label>
                      <input
                        type="password"
                        value={newAccPassword}
                        onChange={(e) => setNewAccPassword(e.target.value)}
                        placeholder="Optional local password"
                        className="w-full rounded-xl border border-plum-200 px-3 py-2 text-xs text-plum-900 focus-ring bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Create & Switch Now</span>
                    </button>
                  </form>
                )}

                {/* Footer link to full login screen */}
                <div className="pt-2 border-t border-plum-100 flex items-center justify-between text-xs text-plum-500">
                  <span>Looking for full login screen?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSwitchAccountModalOpen(false);
                      navigate("/start");
                    }}
                    className="font-bold text-plum-700 hover:text-plum-900 hover:underline cursor-pointer"
                  >
                    Open Account Manager &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, tone, label, value, hint, to }) {
  const tones = {
    rose: "bg-rose-50 text-rose-600",
    lavender: "bg-lavender-50 text-plum-600",
    plum: "bg-plum-50 text-plum-700",
    sage: "bg-sage-50 text-sage-700",
  };
  return (
    <Link to={to}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card hover className="p-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${tones[tone]}`}>
            <Icon size={19} />
          </div>
          <p className="font-display text-2xl font-semibold text-plum-800">{value}</p>
          <p className="text-sm font-semibold text-plum-500 mt-0.5">{label}</p>
          <p className="text-xs text-plum-400 mt-1">{hint}</p>
        </Card>
      </motion.div>
    </Link>
  );
}

function QuickAction({ to, label, desc, icon: Icon, onClick }) {
  const inner = (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex items-start gap-3 p-4 rounded-2xl border border-plum-100 hover:border-plum-300 bg-ivory/60 transition-colors h-full text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-plum-100 text-plum-700 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-sm font-semibold text-plum-800">{label}</p>
        <p className="text-xs text-plum-500 mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full text-left cursor-pointer focus-ring rounded-2xl block"
      >
        {inner}
      </button>
    );
  }

  return <Link to={to} className="block h-full">{inner}</Link>;
}

