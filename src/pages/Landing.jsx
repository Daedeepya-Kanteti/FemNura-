import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  CalendarHeart,
  Smile,
  BellRing,
  Stethoscope,
  ShieldCheck,
  FileText,
  BookOpenText,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { Button, Card, SectionHeading, Badge, FadeIn, Disclaimer } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const features = [
  {
    icon: HeartPulse,
    title: "Smart Symptom Tracker",
    desc: "Log how you feel in moments, see patterns build over time, and understand your body's signals instead of dismissing them.",
    tone: "rose",
  },
  {
    icon: Smile,
    title: "Emotional Wellness Tracker",
    desc: "Track your mood alongside your physical health so emotional patterns never go unseen again.",
    tone: "lavender",
  },
  {
    icon: CalendarHeart,
    title: "Menstrual Health Tracker",
    desc: "Understand your cycle with clarity — not guesswork — with gentle, adaptive predictions.",
    tone: "plum",
  },
  {
    icon: BellRing,
    title: "Adaptive Reminders",
    desc: "Reminders that respect your real schedule, not generic pings you'll swipe away.",
    tone: "sage",
  },
  {
    icon: Stethoscope,
    title: "AI Doctor Q-Gen",
    desc: "Walk into appointments prepared, with thoughtful questions generated from your own logged history.",
    tone: "rose",
  },
  {
    icon: FileText,
    title: "Medical History Vault",
    desc: "Keep records, reports, and prescriptions organised and ready whenever you need them.",
    tone: "lavender",
  },
  {
    icon: BookOpenText,
    title: "Women's Health Education Hub",
    desc: "Clear, trustworthy information written for real life, not clinical jargon.",
    tone: "sage",
  },
  {
    icon: Users,
    title: "Care Circle",
    desc: "Bring trusted people into your health journey, on your own terms.",
    tone: "plum",
  },
];

const steps = [
  { title: "Create your space", desc: "Set up your private FemNura profile in minutes — no overwhelming forms." },
  { title: "Log what matters", desc: "Track symptoms, mood, and cycle details whenever they happen, in your own words." },
  { title: "See it come together", desc: "FemNura organises your entries into a clear timeline and gentle insights." },
  { title: "Walk in prepared", desc: "Generate thoughtful doctor questions and share records when you need to." },
];

const toneMap = {
  rose: "bg-rose-50 text-rose-600",
  lavender: "bg-lavender-50 text-plum-600",
  plum: "bg-plum-50 text-plum-700",
  sage: "bg-sage-50 text-sage-700",
};

export default function Landing() {
  return (
    <div className="bg-ivory text-charcoal overflow-x-hidden">
      <Nav />
      <Hero />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorks />
      <WhoItsFor />
      <SafetySection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const { getLastLoginData, isDemoActive } = useDemoData();
  const { account } = getLastLoginData();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ivory/80 border-b border-plum-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-plum-700/90">
          <a href="#features" className="hover:text-plum-900 transition-colors">Features</a>
          <a href="#how" className="hover:text-plum-900 transition-colors">How it works</a>
          <a href="#who" className="hover:text-plum-900 transition-colors">Who it's for</a>
          <a href="#safety" className="hover:text-plum-900 transition-colors">Our approach</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/start">
            <Button variant="ghost" size="sm">
              {account ? "Switch account" : "Log in"}
            </Button>
          </Link>
          <Link to={isDemoActive ? "/app" : "/start"}>
            <Button variant="primary" size="sm">
              {account ? `Continue as ${account.name}` : "Start Your Health Journey"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { getLastLoginData, isDemoActive } = useDemoData();
  const { account } = getLastLoginData();

  return (
    <section className="relative bg-grad-hero pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge tone="rose">AI-Powered Women's Healthcare Companion</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-plum-900 mt-5"
          >
            Your Health.
            <br />
            <span className="text-gradient">Your Priority.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-6 text-lg text-plum-700/90 leading-relaxed max-w-xl"
          >
            Life gets busy. Your health shouldn't get overlooked. FemNura helps you understand your symptoms, track
            your well-being, organise your health information, and take more informed steps towards caring for
            yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to={isDemoActive ? "/app" : "/start"}>
              <Button variant="primary" size="lg">
                {account ? `Continue as ${account.name}` : "Start Your Health Journey"} <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">Explore FemNura</Button>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex items-center gap-6 text-sm text-plum-600"
          >
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-sage-600" /> Private & saved by design</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-sage-600" /> Built for real life</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -top-10 -left-8 w-40 h-40 bg-lavender-200/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-6 w-44 h-44 bg-rose-200/50 rounded-full blur-3xl" />
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const { getLastLoginData } = useDemoData();
  const { account, data } = getLastLoginData();

  const name = account?.name || "Friend";
  const avatarLetter = (name[0] || "F").toUpperCase();
  const avatarColor = account?.avatarColor || "#7B5689";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Cycle phase from real logged data
  const latestCycle = data?.cycleEntries?.[0];
  const cycleTitle = latestCycle ? latestCycle.phase : "Day 14";
  const cycleSubtitle = latestCycle?.flow ? `${latestCycle.flow} flow` : "Fertile window";

  // Mood from real logged data
  const latestMood = data?.moods?.[0];
  const moodTitle = latestMood ? latestMood.mood : "Calm";
  const moodSubtitle = latestMood?.notes ? latestMood.notes.slice(0, 24) : "Trending steady";

  // Symptoms from real logged data
  const symptomsList =
    data?.symptoms && data.symptoms.length > 0
      ? data.symptoms.slice(0, 3).map((s) => s.name)
      : ["No active symptoms", "All logged clear"];

  // Prepared questions count from real logged data
  const questionsCount =
    data?.doctorSessions?.[0]?.questions?.length ||
    (data?.symptoms?.length ? Math.min(data.symptoms.length + 1, 3) : 0);

  return (
    <div className="relative animate-float">
      <Card className="p-6 lg:p-7 relative z-10 shadow-lg border-plum-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-plum-400 font-semibold uppercase tracking-wide">{greeting}</p>
              <span className="text-[10px] font-semibold bg-lavender-100 text-plum-700 px-2 py-0.5 rounded-full">
                Last login profile
              </span>
            </div>
            <p className="font-display text-xl font-semibold text-plum-800">Hi, {name} 👋</p>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarLetter}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-rose-50 rounded-2xl p-4">
            <p className="text-xs text-rose-600 font-semibold mb-1">Cycle phase</p>
            <p className="font-display text-2xl font-semibold text-plum-800">{cycleTitle}</p>
            <p className="text-xs text-rose-500 mt-1 truncate">{cycleSubtitle}</p>
          </div>
          <div className="bg-sage-50 rounded-2xl p-4">
            <p className="text-xs text-sage-700 font-semibold mb-1">Mood this week</p>
            <p className="font-display text-2xl font-semibold text-plum-800">{moodTitle}</p>
            <p className="text-xs text-sage-600 mt-1 truncate">{moodSubtitle}</p>
          </div>
        </div>

        <div className="bg-lavender-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-plum-500 font-semibold">Recent symptoms logged</p>
            <span className="text-[11px] text-plum-400">
              {data?.symptoms?.length || 0} total logged
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {symptomsList.map((s, idx) => (
              <span
                key={`${s}-${idx}`}
                className="bg-white text-plum-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-plum-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-gradient-to-r from-plum-900 to-plum-950 rounded-2xl p-4 text-white shadow-sm border border-plum-700">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-rose-500/30 text-rose-300 flex items-center justify-center shrink-0 border border-rose-400/40">
              <Sparkles size={17} className="text-amber-300" />
            </span>
            <p className="text-sm font-bold text-white">
              {questionsCount > 0
                ? `${questionsCount} question${questionsCount === 1 ? "" : "s"} ready for your doctor visit`
                : "Ready to generate doctor questions"}
            </p>
          </div>
          <Link to="/app/doctor-qgen" className="text-xs font-bold text-amber-300 hover:text-white underline pl-2">
            View Sheet →
          </Link>
        </div>
      </Card>
    </div>
  );
}

function TrustStrip() {
  const items = [
    "No fabricated diagnoses",
    "Built on your real logged data",
    "Private, encrypted health vault",
    "Designed with safety in mind",
  ];
  return (
    <div className="border-y border-plum-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm font-semibold text-plum-600">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-sage-500" /> {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Everything in one calm place"
          title="A healthcare companion built around your actual life"
          subtitle="FemNura brings together the tools women need to notice patterns, understand their bodies, and walk into healthcare conversations prepared — without clutter or overwhelm."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {features.map((f, idx) => (
            <FadeIn key={f.title} delay={idx * 0.05}>
              <Card hover className="p-6 h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${toneMap[f.tone]}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-plum-800 mb-2">{f.title}</h3>
                <p className="text-sm text-plum-600/90 leading-relaxed">{f.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-24 lg:py-32 bg-plum-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff22,transparent_40%),radial-gradient(circle_at_80%_80%,#ffffff22,transparent_40%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <SectionHeading
          eyebrow="How FemNura works"
          title="From first log to a confident doctor visit"
          subtitle="A simple, guided flow that grows with you, built so even first-time users feel at ease."
          light
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <div className="relative bg-white/5 border border-white/15 rounded-xl2 p-6 h-full">
                <span className="font-display text-4xl font-semibold text-lavender-200/60">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-lg font-semibold text-white mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-lavender-100/80 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoItsFor() {
  const audiences = [
    { title: "Housewives", desc: "Managing a household often means your own health waits. FemNura keeps a quiet record while you handle everything else." },
    { title: "Working women", desc: "Between meetings and deadlines, symptoms get noted mentally and forgotten. FemNura remembers for you." },
    { title: "Students & young adults", desc: "Learn your body's patterns early, and build healthy habits that last — without feeling clinical." },
    { title: "Anyone who delays self-care", desc: "If you've ever said \"I'll deal with it later,\" FemNura gently helps later actually arrive." },
  ];
  return (
    <section id="who" className="py-24 lg:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Designed for real women"
          title="Whoever you are, your health deserves a place"
          subtitle="FemNura is built to feel approachable no matter your comfort with technology or how busy your life already is."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {audiences.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.06}>
              <Card hover className="p-6 h-full bg-gradient-to-br from-white to-lavender-50/40">
                <h3 className="font-display text-lg font-semibold text-plum-800 mb-2">{a.title}</h3>
                <p className="text-sm text-plum-600/90 leading-relaxed">{a.desc}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our approach to safety"
          title="Technology that supports — never replaces — real care"
          subtitle="FemNura helps you understand your own information more clearly. It is honest about what it can and cannot do."
          center
        />
        <div className="mt-10">
          <Disclaimer />
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mt-8">
          {[
            { icon: ShieldCheck, text: "Your data stays yours, with clear access controls." },
            { icon: Sparkles, text: "AI insights are drawn only from what you've actually logged." },
            { icon: HeartPulse, text: "We encourage professional evaluation when it matters." },
          ].map((item) => (
            <div key={item.text} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-ivory border border-plum-100">
              <item.icon className="text-plum-600" size={24} />
              <p className="text-sm text-plum-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 lg:py-28 bg-grad-hero">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-plum-900 mb-5">
            Your health deserves a priority, not an afterthought.
          </h2>
          <p className="text-plum-600 text-lg mb-9 max-w-xl mx-auto">
            Start your FemNura journey today and give yourself the same care you give everyone else.
          </p>
          <Link to="/start">
            <Button variant="primary" size="lg">Start Your Health Journey <ArrowRight size={18} /></Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-plum-900 text-lavender-100/80 py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <Logo light />
          <p className="text-sm mt-4 max-w-sm text-lavender-100/70 leading-relaxed">
            FemNura provides health tracking, educational information, and tools to prepare for healthcare
            appointments. It does not diagnose conditions or replace a qualified healthcare professional.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white mb-3">FemNura</p>
          <p>Your Health. Your Priority.</p>
          <p className="mt-6 text-lavender-100/50">© {new Date().getFullYear()} FemNura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
