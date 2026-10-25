# 🌸 FemNura — Your Health. Your Priority.
### *AI-Assisted Women's Healthcare Companion & Longitudinal Clinical Preparation Platform*

[![Live Website](https://img.shields.io/badge/Live_Published_Website-femnura.app-7B5689?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React_18_%7C_Vite_%7C_TailwindCSS_%7C_Framer_Motion-rose?style=for-the-badge)](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app)
[![Data Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side_Sovereignty-2E7D32?style=for-the-badge&logo=shield)](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app)

---

## 🔗 Live Published Website

> **Access the live deployed application here:**  
> ### 🌐 **https://femnura.ai.studio**

---

## ⚡ Account Access & Evaluation Guide

FemNura is engineered with strict client-side data isolation and privacy sovereignty. When visiting from a new device or browser, guest sessions are clean and isolated without leaking any prior user's personal health profile.

You can explore the platform through either of two paths:

### Path A: Explore the Pre-Loaded Demo Profile
To experience a complete longitudinal history with pre-populated health logs, cycle records, lab documents, and clinical questions:
1. Open the [Live Website](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app).
2. Click **Log In** on the top navigation bar or the hero section.
3. Enter the demo profile credentials:
   - **Email:** `example@gmail.com`
   - **Password / PIN:** *(Leave blank or enter any PIN)*
4. Click **Log In to Dashboard**.
5. **Pre-configured live records include:**
   - Logged symptoms (Fatigue, Mild headache).
   - Menstrual cycle tracking (Day 14 Ovulation phase, medium flow).
   - Medical History Vault with clinical records (`Routine_Blood_Panel_Q3.pdf`).
   - Doctor Q-Gen appointment preparation session with structured questions.
   - Configured Care Circle with primary emergency contact and emergency medical card.

### Path B: Create a Fresh Account
1. Open the [Live Website](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app).
2. Click **Get Started** or select the **Sign Up** tab.
3. Enter your Full Name, Email, optional Password/PIN, and select health priority tags.
4. Experience a clean-slate onboarding with private, device-isolated storage.

---

## 💡 The Problem & Clinical Mission

Women frequently navigate healthcare systems where physical signals are dismissed or normalized:
- **Medical Gaslighting & Delayed Diagnosis:** Symptoms like chronic fatigue, debilitating cramps, and hormonal shifts are often minimized as "just stress" or "normal pain," causing multi-year diagnostic delays for conditions such as endometriosis, PCOS, and autoimmune disorders.
- **The "10-Minute Appointment" Barrier:** Consultations with doctors are brief. Patients walk into clinics feeling rushed, struggling to recall symptom frequencies, duration, or correlations with their cycle.
- **Emergency Vulnerability:** In acute health situations, first responders and emergency personnel often lack immediate access to blood group, known drug allergies, or emergency next-of-kin contacts.
- **Privacy Concerns:** Commercial tracking applications frequently monetize or leak sensitive reproductive telemetry to third-party ad brokers.

**FemNura bridges this divide by turning daily observations into structured, clinically articulate records—keeping every data point private, secure, and under the user's sovereign control.**

---

## 📱 Complete Feature Tour (Every Module on the Website)

### 1. 🏠 Landing Page & Dynamic Navigation
- **Responsive Navigation Bar:** High-contrast Emergency SOS trigger button, guest **Log In** and **Sign Up** actions, or active user profile badge with direct dashboard access and one-click **Log Out**.
- **Interactive Dashboard Preview:** Dynamic preview showing cycle phase, current mood, recent symptoms, and doctor questions count. Displays live user data when logged in, or clean sample metrics for guests without exposing personal identities.
- **Hero & Philosophy Sections:** Anti-dismissal clinical philosophy, core benefits, and 4-step workflow (*Create your space*, *Log what matters*, *See it come together*, *Walk in prepared*).
- **Switch Profile Modal:** Quickly switch between saved local profiles or add a new family member profile on the shared device.

### 2. 🔐 Authentication & Onboarding (`/start`)
- **Dual-Tab Authentication Portal:** Dedicated **Log In** and **Sign Up** tabs with automatic URL query parameter synchronization (`?tab=login`, `?tab=signup`).
- **Log In Screen:** Email and optional password/PIN inputs, "Remember me on this device" toggle, and a list of profiles saved on the current device with one-click access and profile deletion.
- **Sign Up Screen:** Name, email, optional password/PIN, and multi-select health priority chips (*Tracking symptoms & fatigue*, *Understanding my cycle*, *Emotional wellness*, *Getting ready for doctor visits*, *Organising medical records*).
- **Session Protection:** Auth guards on all `/app/*` routes automatically redirect unauthenticated visits to the login portal.

### 3. 📊 Dashboard (`/app`)
- **Real-Time Header Widget:** Live ticking clock, day, and date widget.
- **Active Account Bar:** Displays the current user's avatar, name, email, and an "Isolated Health Storage" badge. Quick buttons allow switching profiles or adding a new member profile.
- **Red Flag High-Alert Banner:** Real-time symptom analysis automatically detects acute, high-risk symptoms (e.g., severe unilateral pelvic pain, thunderclap headache, heavy bleeding soaking through pads) and renders an urgent banner with direct emergency calling and hospital locator triggers.
- **Overview Metric Cards:** Quick summary counters for Symptoms, Mood reflections, Cycle phase & flow, and Active reminders.
- **Doctor Preparation Card:** Displays count of ready doctor questions with a direct link to the Q-Gen sheet.
- **Clinical Remedy Integration:** Clicking on any logged symptom, mood, or cycle phase opens an evidence-based clinical comfort guide.

### 4. 🩺 Smart Symptom Tracker (`/app/symptoms`)
- **Quick-Log Symptom Chips:** 14 common symptom presets (*Fatigue, Headache, Bloating, Cramps, Nausea, Back pain, Breast tenderness, Low appetite, Insomnia, Dizziness, Joint pain, Skin changes, Severe one-sided pelvic pain, Heavy bleeding soaking pad*) plus custom symptom entry.
- **Severity Classification:** Three clinical tiers: **Mild**, **Moderate**, and **Severe**.
- **Contextual Notes:** Free-form input to capture specific triggers, duration, and body areas.
- **Search & Filter:** Instant search query matching symptom names and notes, with severity filters (*All, Mild, Moderate, Severe*).
- **Symptom Remedy Action:** Each logged item includes an instant "Remedy" button opening verified self-care protocols and medical warning signs.
- **Entry Management:** One-click deletion with immediate local storage synchronization.

### 5. 🧘 Emotional Wellness & Mood Tracker (`/app/mood`)
- **Five Mood Archetypes:** **Joyful**, **Calm**, **Neutral**, **Low**, and **Irritable** with distinctive color-coded iconography.
- **Daily Reflection Journaling:** Add personal thoughts, stress triggers, and emotional reflections.
- **Instant Comfort Protocols:** Logging a mood automatically opens a tailored clinical wellness guide covering immediate comfort exercises and nutrition recommendations.
- **Chronological History:** Visual list of past entries with timestamps and personal reflections.

### 6. 🩸 Menstrual Health & Cycle Tracker (`/app/cycle`)
- **Four Hormonal Phases:** **Menstrual**, **Follicular**, **Ovulation**, and **Luteal** with tailored phase color themes.
- **Flow Level Logging:** **Light**, **Medium**, and **Heavy** flow indicators.
- **Cycle Notes:** Record physical signals, ovulation spotting, or energy shifts.
- **Phase Alignment Protocol:** Instant access to cycle-specific nutrition (e.g., iron and magnesium during menstruation, zinc and antioxidants during ovulation).
- **Logged History Timeline:** Comprehensive log of cycle dates, flow volumes, and phase transitions.

### 7. 📋 AI Doctor Q-Gen (`/app/doctor-qgen`)
- **Clinical Preparation Engine:** Synthesizes user-logged symptoms, severity levels, cycle phases, and emotional reflections into prioritized discussion points for medical appointments.
- **Doctor & Clinic Personalization:** Inputs for Doctor's Name and Custom Visit Concerns.
- **Red Flag Awareness:** Flags critical symptoms in bold clinical language for immediate discussion.
- **One-Click Clipboard Copy:** Copies formatted questions and patient summary directly to the clipboard.
- **Download Preparation Brief:** Generates and downloads a clean, printable HTML appointment brief ready for doctor visits.
- **Session History:** Retains past generated doctor question sessions with timestamp and baseline metrics.

### 8. 📁 Medical History Vault (`/app/vault`)
- **Eight Medical Document Categories:** *Lab report, Prescription, Imaging, Doctor's note, Blood work, Vaccination, Discharge summary, Other*.
- **Real File Uploads:** Upload real PDF, image, and text reports with local browser persistence.
- **Curated Sample Documents:** Pre-loaded test records (*Complete Blood Count Panel, Pelvic Ultrasound, Thyroid Profile*) for instant review.
- **Smart Filtering & Search:** Search by document title, attending physician, or medical facility, alongside category filter chips.
- **Document Preview Modal:** Full-screen modal to inspect document details, clinical notes, and file metadata.
- **Download & Document Management:** Individual file download and deletion options.

### 9. 🪪 Care Circle & Emergency Medical Card (`/app/care-circle`)
- **Trusted Emergency Contacts:** Add family members, partners, or friends with full name, relationship, and international country calling codes (`+91`, `+1`, `+44`, `+61`, `+81`, etc.).
- **In-Line Contact Editing:** Edit contact details or remove contacts with real-time synchronization.
- **Emergency Medical Profile:** Patient Name, Blood Group (*O+, O-, A+, A-, B+, B-, AB+, AB-*), Known Drug & Food Allergies, Medical Conditions, and Emergency Directives.
- **View Alert Page Button:** Opens the dedicated high-contrast Emergency View (`/emergency`).
- **Download Button:** Downloads a printable Emergency Medical ID Card (HTML) formatted to carry in a purse, wallet, or phone case.

### 10. 🚨 Emergency Alert View (`/emergency`)
- **First-Responder High-Contrast Screen:** Dark-mode medical emergency view optimized for rapid readability under emergency conditions.
- **Critical Medical Data Display:** Immediate visibility of Patient Name, Blood Group, Allergies, Chronic Conditions, and Emergency Notes.
- **One-Tap Emergency Dialing:** Direct dial buttons for Primary and Secondary emergency contacts with formatted dialable phone links.
- **Sync Care Circle Button:** Real-time synchronization pulling the latest contact and medical edits.
- **Download Emergency Card:** Download the full printable emergency medical ID card file.
- **Share Alert Link:** One-click copying of the emergency alert URL to clipboard.

### 11. 🆘 Global Emergency SOS Protocol Modal
- **Accessible Everywhere:** Sticky SOS triggers on the landing page, dashboard desktop header, mobile top bar, and sidebar.
- **Direct Emergency Services Calling:** 1-tap call button dialing national emergency services (112).
- **Direct Next-of-Kin Calling:** 1-tap call button for the user's primary Care Circle contact.
- **Live Hospital & ER Locator:**
  - Real-time distance calculation in kilometers to nearby medical centers.
  - Category filters: **All**, **Maternity**, **Trauma**, and **Government** hospitals.
  - Directions button linking directly to Google Maps navigation for each facility.
- **Multi-Tier Geolocation Engine:**
  - High-accuracy on-device GPS hardware lock.
  - Automatic network-based fallback when browser permissions are restricted in sandboxes.
  - City preset switcher (*Hyderabad, Bangalore, Mumbai, Delhi, Chennai, Kolkata, Pune, London, New York*).
  - Search by neighborhood or city name.

### 12. ⏰ Adaptive Reminders (`/app/reminders`)
- **Customizable Prompts:** Title, frequency (*Daily, Weekly, Interval*), and time selector.
- **Interactive Audio Chime:** Test and trigger gentle reminder sound chimes (`playReminderChime`) using the Web Audio API.
- **In-Line Editing:** Update reminder title, time, or active state directly from the list.
- **Preset Quick Buttons:** One-tap presets for *Drink water*, *Log mood*, *Take vitamins*, and *Check cycle*.

### 13. 🌿 Nudge & Nourish (`/app/nudge-nourish`)
- **Self-Care Habit Routines:** Pre-built daily wellness nudges including Hydration, Morning stretch, Nutrient-rich lunch, Posture reset, and Evening wind-down.
- **Audio & Voice Encouragement:** Integrates Web Audio chimes and Web Speech synthesis to deliver gentle spoken reminders and wellness encouragement.
- **Sound & Voice Controls:** Independent toggles for audio chimes, voice guidance, and habit completion tracking.

### 14. 📜 Health Timeline (`/app/timeline`)
- **Unified Narrative:** Aggregates symptoms, mood reflections, and cycle phases into a single chronological feed.
- **Filtering & Search:** Filter by event type (*All, Symptoms, Moods, Cycle*) and search across event titles and personal notes.
- **Interactive Remedy Access:** Click any timeline event to immediately view its corresponding evidence-based clinical remedy.

### 15. 📚 Women's Health Education Hub (`/app/education`)
- **80 Evidence-Based Guides:** Minimum of 20 comprehensive guides across each core health domain:
  - *Cycle & Hormones*
  - *Symptoms & Signals*
  - *Doctor Visit Prep*
  - *Emotional Health*
  - *Holistic Remedies*
  - *Red Flag Warnings*
- **Searchable Index:** Instant search matching article titles, clinical summaries, and topics.
- **Article Reader Modal:** In-depth view featuring clinical overview, key takeaways, and "When to speak with a physician" instructions.

### 16. ⚙️ Settings & Data Sovereignty (`/app/settings`)
- **Profile Summary:** User display name, email, account identifier, and avatar badge.
- **Gentle Notifications Toggle:** Enable or disable reminder prompts.
- **Complete Health Record Download:** Downloads a comprehensive, printable HTML health dossier compiling patient profile, emergency medical details, trusted contacts, full symptom logs, mood history, cycle timeline, and past doctor preparation sessions.
- **Geolocation & Area Settings:** Toggle location tracking, inspect active GPS/Network coordinates and accuracy meters, switch between 9 city presets, or search custom addresses.

---

## 🏗️ Technical Architecture & Engineering Details

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          FemNura Architecture                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────────┐                     ┌───────────────────────────┐
│     Client Presentation   │                     │      Storage & Context    │
├───────────────────────────┤                     ├───────────────────────────┤
│ • React 18 SPA (Vite)     │                     │ • DemoDataContext (React) │
│ • Tailwind CSS (Tokens)   │◄───────────────────►│ • Per-User Partitioning   │
│ • Framer Motion           │                     │   (femnura_userdata_v2_*) │
│ • Lucide Icons            │                     │ • Zero Third-Party Leak   │
└───────────────────────────┘                     └───────────────────────────┘
           │                                                 │
           ▼                                                 ▼
┌───────────────────────────┐                     ┌───────────────────────────┐
│   Hardware & Web APIs     │                     │   Clinical Helpers        │
├───────────────────────────┤                     ├───────────────────────────┤
│ • HTML5 Geolocation       │                     │ • Red Flag Detector       │
│ • Reverse Geocoding       │                     │ • Evidence Remedy Library │
│ • Web Audio Chimes        │                     │ • 80 Peer-Reviewed Guides │
│ • Web Speech Synthesis    │                     │ • Clinical Q-Gen Builder  │
└───────────────────────────┘                     └───────────────────────────┘
```

| Technology | Purpose in FemNura |
| :--- | :--- |
| **React 18** | Modular component architecture, hooks (`useCallback`, `useMemo`, `useState`, `useEffect`) |
| **Vite 5** | ESM compilation, fast hot module replacement, optimized production build |
| **React Router DOM v6** | Client-side routing, protected dashboard layout, query parameter handling |
| **Tailwind CSS** | Custom healthcare design system (Plum, Lavender, Sage, Rose, Ivory) |
| **Framer Motion** | Animated modals, view transitions, floating preview cards |
| **Lucide React** | Medical, clinical, and navigation iconography |
| **HTML5 Geolocation API** | Distance calculation to nearest emergency rooms and triage centers |
| **Web Audio API** | Synthesized reminder chimes and habit notifications |
| **Web Speech API** | Voice encouragement engine in Nudge & Nourish |
| **LocalStorage Engine** | Per-user isolated storage partitioning with backup and export capabilities |

---

## 💻 Local Setup & Development

To run the application locally:

```bash
# 1. Clone or extract the project repository
cd femnura

# 2. Install all required dependencies
npm install

# 3. Start the Vite local development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

To build for production:

```bash
npm run build
```

---

## 🌐 Deployment Information

- **Published Web Application URL:**  
  [https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app](https://ais-pre-pvnlwmbt6ajezw5xelb4ru-983671979486.asia-southeast1.run.app)
- **Primary Demo Account:** `example@gmail.com` *(Password optional)*

---
*FemNura — Your Health. Your Priority.*
