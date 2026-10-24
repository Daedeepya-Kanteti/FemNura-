import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const DemoDataContext = createContext(null);

const SAVED_ACCOUNTS_KEY = "femnura_saved_accounts_v1";
const LAST_LOGIN_KEY = "femnura_last_login_account_v1";
const DATA_PREFIX = "femnura_data_v1_";

// Initial seed account if none exists in localStorage
const DEFAULT_ACCOUNT = {
  id: "acc_default_daedeepya",
  name: "Daedeepya",
  email: "daedeepyakanteti@gmail.com",
  avatarColor: "#7B5689",
  lastLoginTime: new Date().toISOString(),
  focus: ["Tracking symptoms & fatigue", "Understanding my cycle", "Getting ready for doctor visits"],
};

const INITIAL_DEFAULT_DATA = {
  symptoms: [
    { id: 101, name: "Fatigue", severity: "Mild", notes: "Afternoon energy dip after work", date: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 102, name: "Mild headache", severity: "Mild", notes: "Relieved after drinking water", date: new Date(Date.now() - 86400000).toISOString() },
    { id: 103, name: "Low appetite", severity: "Mild", notes: "Skipped breakfast", date: new Date(Date.now() - 86400000 * 2).toISOString() },
  ],
  moods: [
    { id: 201, mood: "Calm", notes: "Felt peaceful during evening walk", date: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 202, mood: "Joyful", notes: "Good conversation with family", date: new Date(Date.now() - 86400000 * 1.5).toISOString() },
  ],
  cycleEntries: [
    { id: 301, phase: "Ovulation", flow: "Medium", notes: "Day 14 - Fertile window, feeling energetic", date: new Date(Date.now() - 86400000).toISOString() },
    { id: 302, phase: "Follicular", flow: "Light", notes: "Cycle day 10, steady energy", date: new Date(Date.now() - 86400000 * 4).toISOString() },
  ],
  reminders: [
    { id: 401, title: "Drink water reminder", frequency: "Every 2 hours", active: true, kind: "wellness" },
    { id: 402, title: "Log today's mood", frequency: "Daily, evening", active: true, kind: "mood" },
    { id: 403, title: "Take daily iron supplement", frequency: "Daily, morning", active: true, kind: "wellness" },
  ],
  vaultFiles: [
    { id: 501, name: "Routine_Blood_Panel_Q3.pdf", size: 428000, category: "Lab report", date: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 502, name: "Annual_Checkup_Summary.pdf", size: 195000, category: "Doctor's note", date: new Date(Date.now() - 86400000 * 30).toISOString() },
  ],
  doctorSessions: [
    {
      id: 601,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      questions: [
        "I've noticed fatigue 3 times recently — could this be related to iron levels or stress, and what should I monitor?",
        "My recent cycle phase was Ovulation (Day 14) — is there anything specific I should pay closer attention to?",
        "Based on what I've shared, are there any follow-up tests or check-ins you'd suggest?",
      ],
      basedOn: { symptoms: 3, moods: 2, cycle: 2 },
    },
  ],
  trustedContacts: [
    { id: 701, name: "Deepya (Primary)", relation: "Self / Emergency Contact", phone: "+1 (555) 234-5678" },
  ],
  settings: {
    notifications: true,
    dataSharing: false,
    language: "English",
  },
};

function safeLocalStorageGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn("localStorage read failed:", e);
    return fallback;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

export function DemoDataProvider({ children }) {
  // Load saved accounts from localStorage or initialize with default
  const [savedAccounts, setSavedAccounts] = useState(() => {
    const existing = safeLocalStorageGet(SAVED_ACCOUNTS_KEY, null);
    if (existing && Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
    // Seed default account
    const initial = [DEFAULT_ACCOUNT];
    safeLocalStorageSet(SAVED_ACCOUNTS_KEY, initial);
    safeLocalStorageSet(`${DATA_PREFIX}${DEFAULT_ACCOUNT.id}`, INITIAL_DEFAULT_DATA);
    return initial;
  });

  // Track the last login account
  const [lastLoginAccount, setLastLoginAccount] = useState(() => {
    const last = safeLocalStorageGet(LAST_LOGIN_KEY, null);
    if (last) return last;
    return DEFAULT_ACCOUNT;
  });

  // Currently active user session
  const [currentAccount, setCurrentAccount] = useState(() => {
    // By default, restore last login account as active so user doesn't have to re-login every page refresh
    const last = safeLocalStorageGet(LAST_LOGIN_KEY, null);
    return last || DEFAULT_ACCOUNT;
  });

  const [isDemoActive, setIsDemoActive] = useState(() => {
    // If there is an active account, session is active
    return Boolean(currentAccount);
  });

  // Data states for current active account
  const [symptoms, setSymptoms] = useState([]);
  const [moods, setMoods] = useState([]);
  const [cycleEntries, setCycleEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [vaultFiles, setVaultFilesState] = useState([]);
  const [doctorSessions, setDoctorSessions] = useState([]);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [userSettings, setUserSettings] = useState({ notifications: true, dataSharing: false, language: "English" });

  // Load account data whenever currentAccount changes
  const loadAccountData = useCallback((account) => {
    if (!account?.id) return;
    const accountData = safeLocalStorageGet(`${DATA_PREFIX}${account.id}`, null);
    if (accountData) {
      setSymptoms(accountData.symptoms || []);
      setMoods(accountData.moods || []);
      setCycleEntries(accountData.cycleEntries || []);
      setReminders(accountData.reminders || []);
      setVaultFilesState(accountData.vaultFiles || []);
      setDoctorSessions(accountData.doctorSessions || []);
      setTrustedContacts(accountData.trustedContacts || []);
      setUserSettings(accountData.settings || { notifications: true, dataSharing: false, language: "English" });
    } else {
      // New account with clean starter data
      const starter = {
        ...INITIAL_DEFAULT_DATA,
        trustedContacts: [
          { id: Date.now(), name: account.name, relation: "Self / Emergency", phone: "+1 (555) 019-2831" },
        ],
      };
      safeLocalStorageSet(`${DATA_PREFIX}${account.id}`, starter);
      setSymptoms(starter.symptoms);
      setMoods(starter.moods);
      setCycleEntries(starter.cycleEntries);
      setReminders(starter.reminders);
      setVaultFilesState(starter.vaultFiles);
      setDoctorSessions(starter.doctorSessions);
      setTrustedContacts(starter.trustedContacts);
      setUserSettings(starter.settings);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    if (currentAccount) {
      loadAccountData(currentAccount);
    }
  }, [currentAccount, loadAccountData]);

  // Persist current account data whenever any piece changes
  const persistCurrentData = useCallback(
    (overrides = {}) => {
      if (!currentAccount?.id) return;
      const dataToSave = {
        symptoms: overrides.symptoms ?? symptoms,
        moods: overrides.moods ?? moods,
        cycleEntries: overrides.cycleEntries ?? cycleEntries,
        reminders: overrides.reminders ?? reminders,
        vaultFiles: overrides.vaultFiles ?? vaultFiles,
        doctorSessions: overrides.doctorSessions ?? doctorSessions,
        trustedContacts: overrides.trustedContacts ?? trustedContacts,
        settings: overrides.settings ?? userSettings,
        updatedAt: new Date().toISOString(),
      };
      safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, dataToSave);
    },
    [currentAccount, symptoms, moods, cycleEntries, reminders, vaultFiles, doctorSessions, trustedContacts, userSettings]
  );

  // Auto-sync data changes to localStorage immediately
  useEffect(() => {
    if (currentAccount?.id && isDemoActive) {
      persistCurrentData();
    }
  }, [symptoms, moods, cycleEntries, reminders, vaultFiles, doctorSessions, trustedContacts, userSettings, persistCurrentData, currentAccount, isDemoActive]);

  // Actions for data pushing - all saved permanently!
  const addSymptom = (entry) => {
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setSymptoms((prev) => {
      const updated = [newEntry, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), symptoms: updated });
      return updated;
    });
  };

  const deleteSymptom = (id) => {
    setSymptoms((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), symptoms: updated });
      return updated;
    });
  };

  const addMood = (entry) => {
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setMoods((prev) => {
      const updated = [newEntry, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), moods: updated });
      return updated;
    });
  };

  const deleteMood = (id) => {
    setMoods((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), moods: updated });
      return updated;
    });
  };

  const addCycleEntry = (entry) => {
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setCycleEntries((prev) => {
      const updated = [newEntry, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), cycleEntries: updated });
      return updated;
    });
  };

  const deleteCycleEntry = (id) => {
    setCycleEntries((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), cycleEntries: updated });
      return updated;
    });
  };

  const addReminder = (entry) => {
    const newEntry = { id: Date.now() + Math.random(), active: true, ...entry };
    setReminders((prev) => {
      const updated = [newEntry, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), reminders: updated });
      return updated;
    });
  };

  const toggleReminder = (id) => {
    setReminders((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item));
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), reminders: updated });
      return updated;
    });
  };

  const deleteReminder = (id) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), reminders: updated });
      return updated;
    });
  };

  const setVaultFiles = (updaterOrFiles) => {
    setVaultFilesState((prev) => {
      const updated = typeof updaterOrFiles === "function" ? updaterOrFiles(prev) : updaterOrFiles;
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), vaultFiles: updated });
      return updated;
    });
  };

  const addDoctorSession = (session) => {
    const newSession = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...session };
    setDoctorSessions((prev) => {
      const updated = [newSession, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), doctorSessions: updated });
      return updated;
    });
  };

  const addTrustedContact = (contact) => {
    const newContact = { id: Date.now() + Math.random(), ...contact };
    setTrustedContacts((prev) => {
      const updated = [newContact, ...prev];
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), trustedContacts: updated });
      return updated;
    });
  };

  const removeTrustedContact = (id) => {
    setTrustedContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), trustedContacts: updated });
      return updated;
    });
  };

  const updateSettings = (newSettings) => {
    setUserSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (currentAccount?.id) safeLocalStorageSet(`${DATA_PREFIX}${currentAccount.id}`, { ...safeLocalStorageGet(`${DATA_PREFIX}${currentAccount.id}`, {}), settings: updated });
      return updated;
    });
  };

  // Google-style Login and Account Management
  const loginWithAccount = (account) => {
    if (!account) return;
    const updatedAccount = { ...account, lastLoginTime: new Date().toISOString() };

    // Update in savedAccounts list
    setSavedAccounts((prev) => {
      const existingIdx = prev.findIndex((a) => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = updatedAccount;
      } else {
        updated = [updatedAccount, ...prev];
      }
      safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
      return updated;
    });

    safeLocalStorageSet(LAST_LOGIN_KEY, updatedAccount);
    setLastLoginAccount(updatedAccount);
    setCurrentAccount(updatedAccount);
    setIsDemoActive(true);
    loadAccountData(updatedAccount);
  };

  const registerOrLogin = ({ name, email, password = "", focus = [] }) => {
    const trimmedName = name?.trim() || "Friend";
    const trimmedEmail = email?.trim() || `${trimmedName.toLowerCase().replace(/\s+/g, "")}@femnura.app`;
    const accountId = `acc_${trimmedEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    const newAccount = {
      id: accountId,
      name: trimmedName,
      email: trimmedEmail,
      avatarColor: ["#7B5689", "#A64D79", "#3D7A68", "#C05621", "#4A5568"][Math.floor(Math.random() * 5)],
      lastLoginTime: new Date().toISOString(),
      focus,
      credentials: { email: trimmedEmail, password },
    };

    setSavedAccounts((prev) => {
      const filtered = prev.filter((a) => a.id !== accountId && a.email.toLowerCase() !== trimmedEmail.toLowerCase());
      const updated = [newAccount, ...filtered];
      safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
      return updated;
    });

    safeLocalStorageSet(LAST_LOGIN_KEY, newAccount);
    setLastLoginAccount(newAccount);
    setCurrentAccount(newAccount);
    setIsDemoActive(true);
    loadAccountData(newAccount);
  };

  const removeSavedAccount = (idToRemove) => {
    setSavedAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== idToRemove);
      safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
      return updated;
    });

    if (lastLoginAccount?.id === idToRemove) {
      const remaining = savedAccounts.filter((a) => a.id !== idToRemove);
      const nextLast = remaining[0] || null;
      setLastLoginAccount(nextLast);
      safeLocalStorageSet(LAST_LOGIN_KEY, nextLast);
    }

    if (currentAccount?.id === idToRemove) {
      setIsDemoActive(false);
      setCurrentAccount(null);
    }
  };

  // Start demo / login helper for onboarding
  const startDemo = (name, email) => {
    registerOrLogin({ name, email });
  };

  // Log out - does NOT wipe user data! Keeps all data intact in localStorage!
  const endDemo = () => {
    setIsDemoActive(false);
  };

  // Helper to retrieve last login data for display on the front page
  const getLastLoginData = () => {
    const lastAcc = lastLoginAccount || savedAccounts[0] || DEFAULT_ACCOUNT;
    const accountData = safeLocalStorageGet(`${DATA_PREFIX}${lastAcc.id}`, null) || INITIAL_DEFAULT_DATA;
    return {
      account: lastAcc,
      data: accountData,
    };
  };

  const value = {
    // Current user
    userName: currentAccount?.name || "Friend",
    userEmail: currentAccount?.email || "",
    currentAccount,
    isDemoActive,
    // Saved credentials / accounts
    savedAccounts,
    lastLoginAccount,
    loginWithAccount,
    registerOrLogin,
    removeSavedAccount,
    startDemo,
    endDemo,
    getLastLoginData,
    // Data stores (all persisted)
    symptoms,
    addSymptom,
    deleteSymptom,
    moods,
    addMood,
    deleteMood,
    cycleEntries,
    addCycleEntry,
    deleteCycleEntry,
    reminders,
    toggleReminder,
    addReminder,
    deleteReminder,
    vaultFiles,
    setVaultFiles,
    doctorSessions,
    addDoctorSession,
    trustedContacts,
    addTrustedContact,
    removeTrustedContact,
    userSettings,
    updateSettings,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
