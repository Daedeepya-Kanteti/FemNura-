import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { reverseGeocodeCoords } from "../utils/location.js";

const DemoDataContext = createContext(null);

const SAVED_ACCOUNTS_KEY = "femnura_saved_accounts_v2";
const LAST_LOGIN_KEY = "femnura_last_login_account_v2";
const USER_STORAGE_PREFIX = "femnura_userdata_v2_";

// Initial seed account for primary default user
const DEFAULT_ACCOUNT = {
  id: "acc_daedeepyakanteti_gmail_com",
  name: "Daedeepya",
  email: "daedeepyakanteti@gmail.com",
  avatarColor: "#7B5689",
  lastLoginTime: new Date().toISOString(),
  focus: ["Tracking symptoms & fatigue", "Understanding my cycle", "Getting ready for doctor visits"],
};

const SEED_DATA_FOR_DEFAULT = {
  symptoms: [
    { id: 101, name: "Fatigue", severity: "Mild", notes: "Afternoon energy dip after work", date: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 102, name: "Mild headache", severity: "Mild", notes: "Relieved after drinking water", date: new Date(Date.now() - 86400000).toISOString() },
  ],
  moods: [
    { id: 201, mood: "Calm", notes: "Felt peaceful during evening walk", date: new Date(Date.now() - 3600000 * 8).toISOString() },
  ],
  cycleEntries: [
    { id: 301, phase: "Ovulation", flow: "Medium", notes: "Day 14 - Fertile window", date: new Date(Date.now() - 86400000).toISOString() },
  ],
  reminders: [
    { id: 401, title: "Drink water reminder", frequency: "Every 2 hours", active: true, kind: "interval" },
    { id: 402, title: "Log today's mood", frequency: "Daily, evening", time: "20:00", active: true, kind: "mood" },
  ],
  vaultFiles: [
    { id: 501, name: "Routine_Blood_Panel_Q3.pdf", size: 428000, category: "Lab report", date: new Date(Date.now() - 86400000 * 12).toISOString() },
  ],
  doctorSessions: [
    {
      id: 601,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      questions: [
        "I've noticed fatigue recently — could this be related to iron levels or stress?",
        "My recent cycle phase was Ovulation — is there anything specific I should monitor?",
      ],
      basedOn: { symptoms: 2, moods: 1, cycle: 1 },
    },
  ],
  trustedContacts: [
    { id: 701, name: "Deepya (Primary)", relation: "Self / Emergency Contact", phone: "+1 (555) 234-5678" },
  ],
  emergencyProfile: {
    bloodGroup: "O+",
    allergies: "None known",
    conditions: "None reported",
    emergencyNotes: "Please contact primary emergency contact immediately.",
  },
  settings: {
    notifications: true,
    dataSharing: false,
    language: "English",
    locationTracking: false,
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
    console.warn("localStorage write failed, attempting payload optimization:", e);
    try {
      if (value && typeof value === "object" && Array.isArray(value.vaultFiles)) {
        // Strip or trim very large dataUrls (> 80KB) from persistent storage to prevent quota crash
        const optimized = {
          ...value,
          vaultFiles: value.vaultFiles.map((vf) => ({
            ...vf,
            dataUrl: vf.dataUrl && vf.dataUrl.length > 80000 ? null : vf.dataUrl,
          })),
        };
        localStorage.setItem(key, JSON.stringify(optimized));
      }
    } catch (e2) {
      console.warn("localStorage recovery write failed:", e2);
    }
  }
}

function getUserStorage(userId) {
  if (!userId) return null;
  return safeLocalStorageGet(`${USER_STORAGE_PREFIX}${userId}`, null);
}

function saveUserStorage(userId, data) {
  if (!userId) return;
  safeLocalStorageSet(`${USER_STORAGE_PREFIX}${userId}`, data);
}

// Generate blank fresh storage for a new distinct user
function createFreshUserStorage(account) {
  return {
    symptoms: [],
    moods: [],
    cycleEntries: [],
    reminders: [
      { id: Date.now() + 1, title: "Drink water reminder", frequency: "Every 2 hours", active: true, kind: "wellness" },
      { id: Date.now() + 2, title: "Log today's mood", frequency: "Daily, evening", active: true, kind: "mood" },
    ],
    vaultFiles: [],
    doctorSessions: [],
    trustedContacts: account?.name
      ? [{ id: Date.now() + 3, name: `${account.name} (Emergency)`, relation: "Self / Emergency", phone: "+1 (555) 012-3456" }]
      : [],
    emergencyProfile: {
      bloodGroup: "O+",
      allergies: "None known",
      conditions: "None reported",
      emergencyNotes: "Please contact primary emergency contact immediately.",
    },
    settings: {
      notifications: true,
      dataSharing: false,
      language: "English",
      locationTracking: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function DemoDataProvider({ children }) {
  // Saved accounts list
  const [savedAccounts, setSavedAccounts] = useState(() => {
    const existing = safeLocalStorageGet(SAVED_ACCOUNTS_KEY, null);
    if (existing && Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
    // Seed default account on first use
    const initial = [DEFAULT_ACCOUNT];
    safeLocalStorageSet(SAVED_ACCOUNTS_KEY, initial);
    saveUserStorage(DEFAULT_ACCOUNT.id, SEED_DATA_FOR_DEFAULT);
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
    const last = safeLocalStorageGet(LAST_LOGIN_KEY, null);
    return last || DEFAULT_ACCOUNT;
  });

  const [isDemoActive, setIsDemoActive] = useState(() => Boolean(currentAccount));

  // Current active user's isolated data states
  const [symptoms, setSymptoms] = useState([]);
  const [moods, setMoods] = useState([]);
  const [cycleEntries, setCycleEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [vaultFiles, setVaultFilesState] = useState([]);
  const [doctorSessions, setDoctorSessions] = useState([]);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [emergencyProfile, setEmergencyProfileState] = useState({
    bloodGroup: "O+",
    allergies: "None known",
    conditions: "None reported",
    emergencyNotes: "Please contact primary emergency contact immediately.",
  });
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    dataSharing: false,
    language: "English",
    locationTracking: false,
  });

  // Function to load a specific user's isolated storage into state
  const loadUserStorageIntoState = useCallback((account) => {
    if (!account?.id) return;
    let data = getUserStorage(account.id);
    if (!data) {
      // If default account, provide seed data; otherwise create completely clean fresh storage
      data = account.id === DEFAULT_ACCOUNT.id ? SEED_DATA_FOR_DEFAULT : createFreshUserStorage(account);
      saveUserStorage(account.id, data);
    }

    setSymptoms(data.symptoms || []);
    setMoods(data.moods || []);
    setCycleEntries(data.cycleEntries || []);
    setReminders(data.reminders || []);
    setVaultFilesState(data.vaultFiles || []);
    setDoctorSessions(data.doctorSessions || []);
    setTrustedContacts(data.trustedContacts || []);
    setEmergencyProfileState(data.emergencyProfile || {
      bloodGroup: "O+",
      allergies: "None known",
      conditions: "None reported",
      emergencyNotes: "Please contact primary emergency contact immediately.",
    });
    setUserSettings(
      data.settings || {
        notifications: true,
        dataSharing: false,
        language: "English",
        locationTracking: false,
      }
    );
  }, []);

  // Initial load on mount
  useEffect(() => {
    if (currentAccount) {
      loadUserStorageIntoState(currentAccount);
    }
  }, [currentAccount, loadUserStorageIntoState]);

  // MUTATION METHODS: Save strictly and directly to the CURRENT USER'S isolated storage
  const addSymptom = (entry) => {
    if (!currentAccount?.id) return;
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setSymptoms((prev) => [newEntry, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newEntry, ...(userStorage.symptoms || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, symptoms: updated, updatedAt: new Date().toISOString() });
  };

  const deleteSymptom = (id) => {
    if (!currentAccount?.id) return;
    setSymptoms((prev) => prev.filter((s) => s.id !== id));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.symptoms || []).filter((s) => s.id !== id);
    saveUserStorage(currentAccount.id, { ...userStorage, symptoms: updated, updatedAt: new Date().toISOString() });
  };

  const addMood = (entry) => {
    if (!currentAccount?.id) return;
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setMoods((prev) => [newEntry, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newEntry, ...(userStorage.moods || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, moods: updated, updatedAt: new Date().toISOString() });
  };

  const deleteMood = (id) => {
    if (!currentAccount?.id) return;
    setMoods((prev) => prev.filter((m) => m.id !== id));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.moods || []).filter((m) => m.id !== id);
    saveUserStorage(currentAccount.id, { ...userStorage, moods: updated, updatedAt: new Date().toISOString() });
  };

  const addCycleEntry = (entry) => {
    if (!currentAccount?.id) return;
    const newEntry = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...entry };
    setCycleEntries((prev) => [newEntry, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newEntry, ...(userStorage.cycleEntries || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, cycleEntries: updated, updatedAt: new Date().toISOString() });
  };

  const deleteCycleEntry = (id) => {
    if (!currentAccount?.id) return;
    setCycleEntries((prev) => prev.filter((c) => c.id !== id));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.cycleEntries || []).filter((c) => c.id !== id);
    saveUserStorage(currentAccount.id, { ...userStorage, cycleEntries: updated, updatedAt: new Date().toISOString() });
  };

  const addReminder = (entry) => {
    if (!currentAccount?.id) return;
    const newEntry = { id: Date.now() + Math.random(), active: true, ...entry };
    setReminders((prev) => [newEntry, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newEntry, ...(userStorage.reminders || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, reminders: updated, updatedAt: new Date().toISOString() });
  };

  const toggleReminder = (id) => {
    if (!currentAccount?.id) return;
    setReminders((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.reminders || []).map((item) => (item.id === id ? { ...item, active: !item.active } : item));
    saveUserStorage(currentAccount.id, { ...userStorage, reminders: updated, updatedAt: new Date().toISOString() });
  };

  const deleteReminder = (id) => {
    if (!currentAccount?.id) return;
    setReminders((prev) => prev.filter((r) => r.id !== id));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.reminders || []).filter((r) => r.id !== id);
    saveUserStorage(currentAccount.id, { ...userStorage, reminders: updated, updatedAt: new Date().toISOString() });
  };

  const updateReminder = (id, updatedFields) => {
    if (!currentAccount?.id) return;
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.reminders || []).map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveUserStorage(currentAccount.id, {
      ...userStorage,
      reminders: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateReminderTime = (id, newTime) => {
    if (!currentAccount?.id) return;
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, time: newTime } : item))
    );

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.reminders || []).map((item) =>
      item.id === id ? { ...item, time: newTime } : item
    );
    saveUserStorage(currentAccount.id, {
      ...userStorage,
      reminders: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const setVaultFiles = (updaterOrFiles) => {
    if (!currentAccount?.id) return;
    setVaultFilesState((prev) => {
      const updated = typeof updaterOrFiles === "function" ? updaterOrFiles(prev) : updaterOrFiles;
      const userStorage = getUserStorage(currentAccount.id) || {};
      saveUserStorage(currentAccount.id, { ...userStorage, vaultFiles: updated, updatedAt: new Date().toISOString() });
      return updated;
    });
  };

  const addDoctorSession = (session) => {
    if (!currentAccount?.id) return;
    const newSession = { id: Date.now() + Math.random(), date: new Date().toISOString(), ...session };
    setDoctorSessions((prev) => [newSession, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newSession, ...(userStorage.doctorSessions || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, doctorSessions: updated, updatedAt: new Date().toISOString() });
  };

  const addTrustedContact = (contact) => {
    if (!currentAccount?.id) return;
    const newContact = { id: Date.now() + Math.random(), ...contact };
    setTrustedContacts((prev) => [newContact, ...prev]);

    const userStorage = getUserStorage(currentAccount.id) || createFreshUserStorage(currentAccount);
    const updated = [newContact, ...(userStorage.trustedContacts || [])];
    saveUserStorage(currentAccount.id, { ...userStorage, trustedContacts: updated, updatedAt: new Date().toISOString() });
  };

  const removeTrustedContact = (id) => {
    if (!currentAccount?.id) return;
    setTrustedContacts((prev) => prev.filter((c) => c.id !== id));

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.trustedContacts || []).filter((c) => c.id !== id);
    saveUserStorage(currentAccount.id, { ...userStorage, trustedContacts: updated, updatedAt: new Date().toISOString() });
  };

  const updateSettings = (newSettings) => {
    if (!currentAccount?.id) return;
    setUserSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      const userStorage = getUserStorage(currentAccount.id) || {};
      saveUserStorage(currentAccount.id, { ...userStorage, settings: updated, updatedAt: new Date().toISOString() });
      return updated;
    });
  };

  const updateEmergencyProfile = (newProfile) => {
    if (!currentAccount?.id) return;
    setEmergencyProfileState((prev) => {
      const updated = { ...prev, ...newProfile };
      const userStorage = getUserStorage(currentAccount.id) || {};
      saveUserStorage(currentAccount.id, { ...userStorage, emergencyProfile: updated, updatedAt: new Date().toISOString() });
      return updated;
    });
  };

  // Real-time Geolocation tracking with user opt-in control
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const fetchCurrentLocation = useCallback((onSuccess, onError) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      const err = "Geolocation is not supported by your browser";
      setLocationError(err);
      onError?.(err);
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        let address = "Detecting neighborhood...";
        try {
          address = await reverseGeocodeCoords(latitude, longitude);
        } catch (e) {
          address = `Coordinates: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
        }

        const loc = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          address,
          timestamp: new Date().toISOString(),
        };

        setUserLocation(loc);
        setLocationLoading(false);
        setLocationError(null);
        onSuccess?.(loc);
      },
      (err) => {
        let msg = "Could not retrieve GPS coordinates.";
        if (err.code === 1) msg = "Location permission denied in browser.";
        else if (err.code === 2) msg = "GPS position unavailable. Please check device location settings.";
        else if (err.code === 3) msg = "Location request timed out. Please try again.";

        setLocationError(msg);
        setLocationLoading(false);
        onError?.(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const toggleLocationTracking = useCallback(
    (enable) => {
      if (enable) {
        updateSettings({ locationTracking: true });
        fetchCurrentLocation();
      } else {
        updateSettings({ locationTracking: false });
        setUserLocation(null);
        setLocationError(null);
      }
    },
    [fetchCurrentLocation]
  );

  const refreshLocation = useCallback(() => {
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  // If user previously enabled location tracking in settings, refresh when account loads
  useEffect(() => {
    if (userSettings?.locationTracking && !userLocation && !locationLoading) {
      fetchCurrentLocation();
    }
  }, [userSettings?.locationTracking]);

  // Google-Style Login with Account Selection
  const loginWithAccount = (account) => {
    if (!account) return;
    const updatedAccount = { ...account, lastLoginTime: new Date().toISOString() };

    setSavedAccounts((prev) => {
      const idx = prev.findIndex((a) => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = updatedAccount;
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

    // Explicitly load THIS account's storage only
    loadUserStorageIntoState(updatedAccount);
  };

  // Register a new user or sign in with distinct credentials
  const registerOrLogin = ({ name, email, password = "", focus = [] }) => {
    const trimmedName = name?.trim() || "User";
    const cleanEmail = email?.trim().toLowerCase() || `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}@femnura.app`;
    // Unique account ID per email
    const accountId = `acc_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    const newAccount = {
      id: accountId,
      name: trimmedName,
      email: cleanEmail,
      avatarColor: ["#7B5689", "#A64D79", "#2C7A7B", "#C05621", "#4A5568", "#6B46C1"][Math.floor(Math.random() * 6)],
      lastLoginTime: new Date().toISOString(),
      focus,
      credentials: { email: cleanEmail, password },
    };

    setSavedAccounts((prev) => {
      const filtered = prev.filter((a) => a.id !== accountId && a.email.toLowerCase() !== cleanEmail);
      const updated = [newAccount, ...filtered];
      safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
      return updated;
    });

    safeLocalStorageSet(LAST_LOGIN_KEY, newAccount);
    setLastLoginAccount(newAccount);
    setCurrentAccount(newAccount);
    setIsDemoActive(true);

    // If this user has never had storage before, initialize fresh empty storage for this user
    let existingStorage = getUserStorage(accountId);
    if (!existingStorage) {
      existingStorage = createFreshUserStorage(newAccount);
      saveUserStorage(accountId, existingStorage);
    }

    loadUserStorageIntoState(newAccount);
  };

  const removeSavedAccount = (idToRemove) => {
    setSavedAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== idToRemove);
      safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
      return updated;
    });

    // Delete this user's isolated data storage
    try {
      localStorage.removeItem(`${USER_STORAGE_PREFIX}${idToRemove}`);
    } catch (e) {
      console.warn("Could not remove user storage:", e);
    }

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

  const startDemo = (name, email) => {
    registerOrLogin({ name, email });
  };

  const endDemo = () => {
    setIsDemoActive(false);
  };

  // Helper to retrieve the last logged-in user and THAT user's exact storage data for the front page
  const getLastLoginData = () => {
    const lastAcc = lastLoginAccount || savedAccounts[0] || DEFAULT_ACCOUNT;
    const accountData = getUserStorage(lastAcc.id) || (lastAcc.id === DEFAULT_ACCOUNT.id ? SEED_DATA_FOR_DEFAULT : createFreshUserStorage(lastAcc));
    return {
      account: lastAcc,
      data: accountData,
    };
  };

  const value = {
    // Current active user
    userName: currentAccount?.name || "Friend",
    userEmail: currentAccount?.email || "",
    currentAccount,
    isDemoActive,
    // Google-style credentials & accounts
    savedAccounts,
    lastLoginAccount,
    loginWithAccount,
    registerOrLogin,
    removeSavedAccount,
    startDemo,
    endDemo,
    getLastLoginData,
    // Per-user isolated data stores
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
    updateReminder,
    updateReminderTime,
    deleteReminder,
    vaultFiles,
    setVaultFiles,
    doctorSessions,
    addDoctorSession,
    trustedContacts,
    addTrustedContact,
    removeTrustedContact,
    emergencyProfile,
    updateEmergencyProfile,
    userSettings,
    updateSettings,
    // Geolocation tracking
    userLocation,
    isLocationEnabled: Boolean(userSettings?.locationTracking),
    locationLoading,
    locationError,
    toggleLocationTracking,
    refreshLocation,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
