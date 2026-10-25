import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  reverseGeocodeCoords,
  getFallbackNetworkLocation,
  searchCoordinatesForQuery,
  CITY_PRESETS,
  DEFAULT_AREA,
} from "../utils/location.js";

const DemoDataContext = createContext(null);

const SAVED_ACCOUNTS_KEY = "femnura_saved_accounts_v2";
const LAST_LOGIN_KEY = "femnura_last_login_account_v2";
const USER_STORAGE_PREFIX = "femnura_userdata_v2_";
const SELECTED_AREA_KEY = "femnura_selected_area_v2";

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
    { id: 701, name: "Deepya (Primary)", relation: "Self / Emergency Contact", phone: "+91 98480 22338" },
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
      ? [{ id: Date.now() + 3, name: `${account.name} (Emergency)`, relation: "Self / Emergency", phone: "+91 98480 12345" }]
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
  // Saved accounts list - starts empty on fresh devices/browsers unless previously saved
  const [savedAccounts, setSavedAccounts] = useState(() => {
    const existing = safeLocalStorageGet(SAVED_ACCOUNTS_KEY, null);
    if (existing && Array.isArray(existing)) {
      return existing;
    }
    return [];
  });

  // Track the last login account - null on fresh devices
  const [lastLoginAccount, setLastLoginAccount] = useState(() => {
    return safeLocalStorageGet(LAST_LOGIN_KEY, null);
  });

  // Currently active user session - null until someone logs in or signs up
  const [currentAccount, setCurrentAccount] = useState(() => {
    return safeLocalStorageGet(LAST_LOGIN_KEY, null);
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
      // If default account or Daedeepya email, provide seed data; otherwise create completely clean fresh storage
      data =
        account.id === DEFAULT_ACCOUNT.id ||
        account.email?.toLowerCase() === DEFAULT_ACCOUNT.email.toLowerCase()
          ? SEED_DATA_FOR_DEFAULT
          : createFreshUserStorage(account);
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
        locationTracking: true,
      }
    );
    if (data.selectedArea) {
      const lat = Number(data.selectedArea.latitude ?? data.selectedArea.lat);
      const lng = Number(data.selectedArea.longitude ?? data.selectedArea.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setUserLocation({
          ...data.selectedArea,
          latitude: lat,
          longitude: lng,
          lat,
          lng,
        });
      }
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    if (currentAccount) {
      loadUserStorageIntoState(currentAccount);
    }
  }, [currentAccount, loadUserStorageIntoState]);

  // Real-time synchronization across windows and tabs (e.g. Care Circle edits syncing to Emergency View)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!currentAccount?.id) return;
      if (
        !e.key ||
        e.key === `${USER_STORAGE_PREFIX}${currentAccount.id}` ||
        e.key === SAVED_ACCOUNTS_KEY ||
        e.key === LAST_LOGIN_KEY
      ) {
        loadUserStorageIntoState(currentAccount);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentAccount, loadUserStorageIntoState]);

  const refreshData = useCallback(() => {
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

  const updateTrustedContact = (id, updatedFields) => {
    if (!currentAccount?.id) return;
    setTrustedContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );

    const userStorage = getUserStorage(currentAccount.id) || {};
    const updated = (userStorage.trustedContacts || []).map((c) =>
      c.id === id ? { ...c, ...updatedFields } : c
    );
    saveUserStorage(currentAccount.id, {
      ...userStorage,
      trustedContacts: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateAccountName = (newName) => {
    if (!currentAccount?.id || !newName?.trim()) return;
    const trimmed = newName.trim();
    const updatedAccount = { ...currentAccount, name: trimmed };
    setCurrentAccount(updatedAccount);
    setSavedAccounts((prev) =>
      prev.map((a) => (a.id === updatedAccount.id ? { ...a, name: trimmed } : a))
    );
    safeLocalStorageSet(LAST_LOGIN_KEY, updatedAccount);
    const accounts = safeLocalStorageGet(SAVED_ACCOUNTS_KEY, []);
    const updatedAccounts = accounts.map((a) =>
      a.id === updatedAccount.id ? { ...a, name: trimmed } : a
    );
    safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updatedAccounts);

    const userStorage = getUserStorage(currentAccount.id) || {};
    saveUserStorage(currentAccount.id, {
      ...userStorage,
      userName: trimmed,
      updatedAt: new Date().toISOString(),
    });
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

  // Active Location state for Emergency Care & Hospital Triage
  // Defaults to stored selected area or regional default so distances are ALWAYS available immediately
  const [userLocation, setUserLocation] = useState(() => {
    const stored = safeLocalStorageGet(SELECTED_AREA_KEY, null);
    if (stored && (stored.latitude != null || stored.lat != null)) {
      const lat = Number(stored.latitude ?? stored.lat);
      const lng = Number(stored.longitude ?? stored.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          ...stored,
          latitude: lat,
          longitude: lng,
          lat,
          lng,
        };
      }
    }
    return DEFAULT_AREA;
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationNotice, setLocationNotice] = useState(null);

  // Fallback to network/IP or regional preset when browser GPS is blocked, denied, or unavailable
  const fallbackToNetworkLocation = useCallback(
    async (reasonText) => {
      try {
        const netLoc = await getFallbackNetworkLocation();
        const loc = {
          ...netLoc,
          isApproximate: true,
          permissionRestricted: true,
          fallbackReason: reasonText || "Browser permission restricted",
          timestamp: new Date().toISOString(),
        };
        setUserLocation(loc);
        safeLocalStorageSet(SELECTED_AREA_KEY, loc);
        setLocationLoading(false);
        setLocationError(null);
        setLocationNotice(
          "Network/area location is active so hospital triage and emergency distances work seamlessly."
        );
        return loc;
      } catch (err) {
        setUserLocation(DEFAULT_AREA);
        safeLocalStorageSet(SELECTED_AREA_KEY, DEFAULT_AREA);
        setLocationLoading(false);
        setLocationError(null);
        setLocationNotice("Default regional center active.");
        return DEFAULT_AREA;
      }
    },
    []
  );

  const fetchCurrentLocation = useCallback(
    (onSuccess, onError) => {
      setLocationLoading(true);
      setLocationError(null);

      if (typeof window === "undefined" || !navigator.geolocation) {
        fallbackToNetworkLocation("Geolocation API is not supported by your browser").then((loc) => {
          onSuccess?.(loc);
        });
        return;
      }

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
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy),
            address,
            city: address.split(",")[0] || "Live GPS Area",
            source: "gps",
            isApproximate: false,
            permissionRestricted: false,
            timestamp: new Date().toISOString(),
          };

          setUserLocation(loc);
          safeLocalStorageSet(SELECTED_AREA_KEY, loc);
          setLocationLoading(false);
          setLocationError(null);
          setLocationNotice(null);
          onSuccess?.(loc);
        },
        async (err) => {
          console.warn("Browser GPS access rejected or unavailable:", err);
          let reason = "Browser location permission was not granted";
          if (err?.code === 1) {
            reason = "Location permission denied in browser (or restricted by iframe sandbox).";
          } else if (err?.code === 2) {
            reason = "GPS position unavailable on device.";
          } else if (err?.code === 3) {
            reason = "GPS location request timed out.";
          }

          // Rather than halting in a broken state, seamlessly activate network/city fallback!
          const fallbackLoc = await fallbackToNetworkLocation(reason);
          onSuccess?.(fallbackLoc);
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000,
        }
      );
    },
    [fallbackToNetworkLocation]
  );

  // Allow user to manually choose any city, preset, or custom address
  // Supports both { lat, lng } and { latitude, longitude } and immediately updates state & storage
  const setManualLocation = useCallback(
    (customLoc) => {
      if (!customLoc) return null;
      const lat = customLoc.latitude ?? customLoc.lat;
      const lng = customLoc.longitude ?? customLoc.lng ?? customLoc.lon;
      if (lat == null || lng == null) return null;

      const numLat = Number(lat);
      const numLng = Number(lng);
      if (isNaN(numLat) || isNaN(numLng)) return null;

      const cityName =
        customLoc.city ||
        (customLoc.name ? customLoc.name.split(" (")[0] : "") ||
        "Selected Area";

      const loc = {
        latitude: numLat,
        longitude: numLng,
        lat: numLat,
        lng: numLng,
        accuracy: customLoc.accuracy || 1000,
        address: customLoc.address || customLoc.name || "Selected Location",
        city: cityName,
        region: customLoc.region || "",
        source: "manual",
        isApproximate: false,
        permissionRestricted: false,
        timestamp: new Date().toISOString(),
      };

      setUserLocation(loc);
      safeLocalStorageSet(SELECTED_AREA_KEY, loc);

      // Persist to user settings & storage so it reflects immediately across all components
      setUserSettings((prev) => {
        const updated = { ...(prev || {}), locationTracking: true };
        if (currentAccount?.id) {
          const userStorage = getUserStorage(currentAccount.id) || {};
          saveUserStorage(currentAccount.id, {
            ...userStorage,
            selectedArea: loc,
            settings: updated,
            updatedAt: new Date().toISOString(),
          });
        }
        return updated;
      });

      setLocationLoading(false);
      setLocationError(null);
      setLocationNotice(null);
      return loc;
    },
    [currentAccount?.id]
  );

  // Search by query (e.g. city or neighborhood name) and set coordinates
  const searchAndSetLocation = useCallback(
    async (query) => {
      if (!query || !query.trim()) return false;
      setLocationLoading(true);
      try {
        const lower = query.trim().toLowerCase();
        // Check local presets first for instant matching
        const matchedPreset = CITY_PRESETS.find(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.city?.toLowerCase().includes(lower) ||
            p.address?.toLowerCase().includes(lower)
        );
        if (matchedPreset) {
          setManualLocation(matchedPreset);
          setLocationLoading(false);
          return true;
        }

        const result = await searchCoordinatesForQuery(query);
        if (result) {
          setManualLocation(result);
          setLocationLoading(false);
          return true;
        }
      } catch (e) {
        console.warn("Search location failed:", e);
      }
      setLocationLoading(false);
      return false;
    },
    [setManualLocation]
  );

  const toggleLocationTracking = useCallback(
    (enable) => {
      if (enable) {
        updateSettings({ locationTracking: true });
        if (!userLocation) {
          setUserLocation(DEFAULT_AREA);
        }
      } else {
        updateSettings({ locationTracking: false });
      }
    },
    [updateSettings, userLocation]
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
      const idx = prev.findIndex((a) => a.id === account.id || a.email?.toLowerCase() === account.email?.toLowerCase());
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

  // Dedicated Log In function
  const loginUser = ({ email, password = "", rememberMe = true }) => {
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your email address." };
    }

    // Special check for Daedeepya demo profile so her rich data is preserved across devices
    if (cleanEmail === DEFAULT_ACCOUNT.email.toLowerCase()) {
      const acc = {
        ...DEFAULT_ACCOUNT,
        lastLoginTime: new Date().toISOString(),
      };
      if (rememberMe) {
        setSavedAccounts((prev) => {
          const filtered = prev.filter((a) => a.email?.toLowerCase() !== cleanEmail);
          const updated = [acc, ...filtered];
          safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
          return updated;
        });
      }
      safeLocalStorageSet(LAST_LOGIN_KEY, acc);
      setLastLoginAccount(acc);
      setCurrentAccount(acc);
      setIsDemoActive(true);

      let existingData = getUserStorage(acc.id);
      if (!existingData) {
        existingData = SEED_DATA_FOR_DEFAULT;
        saveUserStorage(acc.id, existingData);
      }
      loadUserStorageIntoState(acc);
      return { success: true, account: acc };
    }

    // Check existing saved accounts on this device
    const existingAcc = savedAccounts.find((a) => a.email?.toLowerCase() === cleanEmail);
    if (existingAcc) {
      if (existingAcc.credentials?.password && password && existingAcc.credentials.password !== password) {
        return { success: false, error: "Incorrect password for this account. Please try again." };
      }
      const updated = {
        ...existingAcc,
        lastLoginTime: new Date().toISOString(),
      };
      if (password && !existingAcc.credentials?.password) {
        updated.credentials = { email: cleanEmail, password };
      }
      if (rememberMe) {
        setSavedAccounts((prev) => {
          const list = prev.map((a) => (a.id === existingAcc.id ? updated : a));
          safeLocalStorageSet(SAVED_ACCOUNTS_KEY, list);
          return list;
        });
      }
      safeLocalStorageSet(LAST_LOGIN_KEY, updated);
      setLastLoginAccount(updated);
      setCurrentAccount(updated);
      setIsDemoActive(true);
      loadUserStorageIntoState(updated);
      return { success: true, account: updated };
    }

    // If account was not saved on this device, check/initialize isolated storage for this email
    const accountId = `acc_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const namePrefix = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const inferredName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);

    const newAccount = {
      id: accountId,
      name: inferredName || "User",
      email: cleanEmail,
      avatarColor: ["#7B5689", "#A64D79", "#2C7A7B", "#C05621", "#4A5568", "#6B46C1"][
        Math.abs(cleanEmail.charCodeAt(0) || 0) % 6
      ],
      lastLoginTime: new Date().toISOString(),
      focus: [],
      credentials: { email: cleanEmail, password },
    };

    if (rememberMe) {
      setSavedAccounts((prev) => {
        const filtered = prev.filter((a) => a.id !== accountId);
        const updated = [newAccount, ...filtered];
        safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
        return updated;
      });
    }

    safeLocalStorageSet(LAST_LOGIN_KEY, newAccount);
    setLastLoginAccount(newAccount);
    setCurrentAccount(newAccount);
    setIsDemoActive(true);

    let existingData = getUserStorage(accountId);
    if (!existingData) {
      existingData = createFreshUserStorage(newAccount);
      saveUserStorage(accountId, existingData);
    }
    loadUserStorageIntoState(newAccount);
    return { success: true, account: newAccount };
  };

  // Dedicated Sign Up function
  const signupUser = ({ name, email, password = "", focus = [], rememberMe = true }) => {
    const trimmedName = name?.trim();
    if (!trimmedName) {
      return { success: false, error: "Please enter your name." };
    }
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your email address." };
    }

    const accountId = `acc_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    const newAccount = {
      id: accountId,
      name: trimmedName,
      email: cleanEmail,
      avatarColor: ["#7B5689", "#A64D79", "#2C7A7B", "#C05621", "#4A5568", "#6B46C1"][
        Math.abs(cleanEmail.charCodeAt(0) || 0) % 6
      ],
      lastLoginTime: new Date().toISOString(),
      focus,
      credentials: { email: cleanEmail, password },
    };

    if (rememberMe) {
      setSavedAccounts((prev) => {
        const filtered = prev.filter((a) => a.id !== accountId && a.email?.toLowerCase() !== cleanEmail);
        const updated = [newAccount, ...filtered];
        safeLocalStorageSet(SAVED_ACCOUNTS_KEY, updated);
        return updated;
      });
    }

    safeLocalStorageSet(LAST_LOGIN_KEY, newAccount);
    setLastLoginAccount(newAccount);
    setCurrentAccount(newAccount);
    setIsDemoActive(true);

    let existingStorage = getUserStorage(accountId);
    if (!existingStorage) {
      existingStorage =
        cleanEmail === DEFAULT_ACCOUNT.email.toLowerCase()
          ? SEED_DATA_FOR_DEFAULT
          : createFreshUserStorage(newAccount);
      saveUserStorage(accountId, existingStorage);
    }

    loadUserStorageIntoState(newAccount);
    return { success: true, account: newAccount };
  };

  // Register a new user or sign in with distinct credentials
  const registerOrLogin = ({ name, email, password = "", focus = [] }) => {
    return signupUser({ name, email, password, focus, rememberMe: true });
  };

  // Full clean logout function
  const logoutUser = () => {
    setCurrentAccount(null);
    setIsDemoActive(false);
    setLastLoginAccount(null);
    try {
      localStorage.removeItem(LAST_LOGIN_KEY);
    } catch (e) {
      console.warn("Could not remove last login key", e);
    }
    setSymptoms([]);
    setMoods([]);
    setCycleEntries([]);
    setReminders([]);
    setVaultFilesState([]);
    setDoctorSessions([]);
    setTrustedContacts([]);
    setEmergencyProfileState({
      bloodGroup: "O+",
      allergies: "None known",
      conditions: "None reported",
      emergencyNotes: "Please contact primary emergency contact immediately.",
    });
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
      logoutUser();
    }
  };

  const startDemo = (name, email) => {
    signupUser({ name, email, rememberMe: true });
  };

  const endDemo = () => {
    logoutUser();
  };

  // Helper to retrieve the last logged-in user and THAT user's exact storage data for the front page
  const getLastLoginData = () => {
    const acc = currentAccount || lastLoginAccount || null;
    if (!acc) {
      return {
        account: null,
        data: null,
      };
    }
    const accountData =
      getUserStorage(acc.id) ||
      (acc.id === DEFAULT_ACCOUNT.id || acc.email?.toLowerCase() === DEFAULT_ACCOUNT.email.toLowerCase()
        ? SEED_DATA_FOR_DEFAULT
        : createFreshUserStorage(acc));
    return {
      account: acc,
      data: accountData,
    };
  };

  const value = {
    // Current active user
    userName: currentAccount?.name || "Friend",
    userEmail: currentAccount?.email || "",
    currentAccount,
    isDemoActive,
    // Authentication & multi-profile management
    savedAccounts,
    lastLoginAccount,
    loginWithAccount,
    loginUser,
    signupUser,
    logoutUser,
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
    updateTrustedContact,
    removeTrustedContact,
    emergencyProfile,
    updateEmergencyProfile,
    updateAccountName,
    refreshData,
    userSettings,
    updateSettings,
    // Geolocation tracking
    userLocation,
    isLocationEnabled: userSettings?.locationTracking !== false,
    locationLoading,
    locationError,
    locationNotice,
    toggleLocationTracking,
    refreshLocation,
    setManualLocation,
    searchAndSetLocation,
    CITY_PRESETS,
    DEFAULT_AREA,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
