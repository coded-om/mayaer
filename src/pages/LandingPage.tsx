import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import Lenis from "lenis";
import { useTranslation } from "react-i18next";
import {
  TbLayoutDashboard,
  TbMoonStars,
  TbTarget,
  TbChevronDown,
  TbArrowLeft,
  TbChartBar,
  TbShieldCheck,
  TbDeviceMobile,
  TbSparkles,
  TbWallet,
  TbCash,
  TbCoins,
  TbCoin,
  TbArrowUpRight,
  TbArrowDownRight,
  TbArrowUp,
  TbCheck,
  TbClock,
  TbBolt,
  TbDiamond,
  TbUsers,
  TbTrendingUp,
  TbReceipt,
  TbQuestionMark,
  TbPlus,
} from "react-icons/tb";
import logoNoBg from "@/assets/logo-with-out-bg.png";
import { useAuthStore } from "@/store/authStore";
import GradientText from "@/components/reactbits/GradientText";
import ShinyText from "@/components/reactbits/ShinyText";
import Aurora from "@/components/reactbits/Aurora";
import { AuthModal } from "@/components/auth/AuthModal";
import { OmaniRial } from "@/components/ui/OmaniRial";

/* ──────────────────────────────────────────────
   Floating financial nodes (like crypto nodes in ref)
   ────────────────────────────────────────────── */
const floatingNodes = [
  {
    icon: TbWallet,
    labelKey: "floatingNodes.savings",
    value: "12,500",
    x: "8%",
    y: "18%",
    delay: 0,
    color: "#4DFFCC",
  },
  {
    icon: TbCash,
    labelKey: "floatingNodes.expenses",
    value: "8,230",
    x: "85%",
    y: "15%",
    delay: 0.4,
    color: "#FFD700",
  },
  {
    icon: TbCoins,
    labelKey: "floatingNodes.investment",
    value: "45,000",
    x: "5%",
    y: "62%",
    delay: 0.8,
    color: "#A78BFA",
  },
  {
    icon: TbCoin,
    labelKey: "floatingNodes.zakat",
    value: "1,640",
    x: "88%",
    y: "58%",
    delay: 1.2,
    color: "#F472B6",
  },
];

const features = [
  {
    icon: TbLayoutDashboard,
    titleKey: "features.smartDashboard",
    descKey: "features.smartDashboardDesc",
    color: "text-teal-400",
    glow: "rgba(20, 210, 170, 0.15)",
  },
  {
    icon: TbMoonStars,
    titleKey: "features.zakatCalculator",
    descKey: "features.zakatCalculatorDesc",
    color: "text-yellow-400",
    glow: "rgba(250, 204, 21, 0.15)",
  },
  {
    icon: TbTarget,
    titleKey: "features.financialGoals",
    descKey: "features.financialGoalsDesc",
    color: "text-purple-400",
    glow: "rgba(192, 132, 252, 0.15)",
  },
  {
    icon: TbChartBar,
    titleKey: "features.detailedReports",
    descKey: "features.detailedReportsDesc",
    color: "text-sky-400",
    glow: "rgba(56, 189, 248, 0.15)",
  },
  {
    icon: TbShieldCheck,
    titleKey: "features.advancedSecurity",
    descKey: "features.advancedSecurityDesc",
    color: "text-emerald-400",
    glow: "rgba(52, 211, 153, 0.15)",
  },
  {
    icon: TbDeviceMobile,
    titleKey: "features.responsiveDesign",
    descKey: "features.responsiveDesignDesc",
    color: "text-orange-400",
    glow: "rgba(251, 146, 60, 0.15)",
  },
];

/* ─── Floating Transaction Card ─── */
function TransactionCard({
  icon: Icon,
  label,
  subLabel,
  value,
  unit,
  delay,
  color,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  subLabel: string;
  value: string;
  unit: React.ReactNode;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "backOut" }}>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 5 + delay * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/[0.10] backdrop-blur-xl px-4 py-2.5 shadow-xl">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10"
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex flex-col">
          <span className="text-white/80 text-xs font-arabic font-semibold leading-none">
            {label}
          </span>
          <span className="text-white/30 text-[10px] font-mono leading-none mt-0.5">
            {subLabel}
          </span>
        </div>
        <div className="flex flex-col items-end mr-2">
          <span className="text-white font-bold text-sm font-mono leading-none">
            {value}
          </span>
          <span className="text-white/30 text-[10px] font-mono leading-none mt-0.5">
            {unit}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Circular Step Dial (like the reference) ─── */
function StepDial() {
  const { t } = useTranslation();
  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
      <div className="absolute inset-3 rounded-full border border-white/[0.04]" />
      <div className="absolute inset-6 rounded-full border border-white/[0.03]" />

      {/* Inner dark area */}
      <div className="absolute inset-8 rounded-full bg-[#0A0F16] border border-white/[0.06] flex flex-col items-center justify-center">
        <TbBolt className="w-7 h-7 text-teal-400 mb-2" />
        <span className="font-arabic text-sm font-bold text-white">
          {t("landing.step01")}
        </span>
      </div>

      {/* Rotating arc highlight */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4DFFCC" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4DFFCC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeDasharray="60 540"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Small label dots around the dial */}
      {[
        { angle: -30, labelKey: "landing.budget" },
        { angle: 45, labelKey: "landing.goals" },
        { angle: 150, labelKey: "landing.zakat" },
      ].map((item) => {
        const rad = (item.angle * Math.PI) / 180;
        const r = 52;
        const cx = 50 + r * Math.cos(rad);
        const cy = 50 + r * Math.sin(rad);
        return (
          <div
            key={item.labelKey}
            className="absolute text-[9px] font-arabic text-white/30 font-medium"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: "translate(-50%, -50%)",
            }}>
            {t(item.labelKey)}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Scrolling Tags Row ─── */
const tagItems = [
  { labelKey: "tags.financialManagement", highlight: false },
  { labelKey: "tags.smartReports", highlight: false },
  { labelKey: "tags.advancedSecurity", highlight: true },
  { labelKey: "tags.zakatCalculation", highlight: false },
  { labelKey: "tags.financialGoals", highlight: false },
  { labelKey: "tags.modernDesign", highlight: false },
  { labelKey: "tags.expenseTracking", highlight: true },
  { labelKey: "tags.savingsPlan", highlight: false },
];

function ScrollingTags({
  direction = "right",
}: {
  direction?: "right" | "left";
}) {
  const items = [...tagItems, ...tagItems];
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ x: direction === "right" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-3 items-center whitespace-nowrap">
        {items.map((tag, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 shrink-0 border text-xs font-arabic font-medium ${
              tag.highlight
                ? "bg-teal-400/10 border-teal-400/30 text-teal-400"
                : "bg-white/[0.03] border-white/[0.08] text-white/40"
            }`}>
            <TbDiamond className="w-3 h-3" />
            {t(tag.labelKey)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({
  label,
  variant,
  delay,
}: {
  label: string;
  variant: "done" | "pending";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}>
      <div
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-arabic font-medium border ${
          variant === "done"
            ? "bg-teal-400/10 border-teal-400/25 text-teal-400"
            : "bg-white/[0.04] border-white/[0.10] text-white/40"
        }`}>
        {variant === "done" ? (
          <TbCheck className="w-3 h-3" />
        ) : (
          <TbClock className="w-3 h-3" />
        )}
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Connecting Lines (decorative) ─── */
function ConnectingLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      {/* Vertical line from top cards down */}
      <motion.line
        x1="35%"
        y1="25%"
        x2="35%"
        y2="85%"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.line
        x1="55%"
        y1="15%"
        x2="55%"
        y2="75%"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      />
      {/* Curved decorative line */}
      <motion.path
        d="M 15 50 Q 40 35 65 50"
        fill="none"
        stroke="rgba(77,255,204,0.06)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─── FAQ Accordion ─── */
const faqItems = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  return (
    <>
      {faqItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-right">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
                  <TbQuestionMark className="w-4 h-4 text-teal-400" />
                </div>
                <span className="font-arabic font-semibold text-sm text-white">
                  {t(item.qKey)}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <TbPlus className="w-3.5 h-3.5 text-white/40" />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden">
              <p className="px-5 pb-4 pr-16 font-arabic text-sm text-white/40 leading-relaxed">
                {t(item.aKey)}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("register");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-80px",
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const openAuth = (tab: "login" | "register" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      className="relative min-h-screen bg-[#050A10] overflow-x-hidden"
      dir={isRtl ? "rtl" : "ltr"}>
      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />

      {/* ─── AURORA BACKGROUND ─── */}
      {isMobile ? (
        /* Mobile: static CSS gradient — zero GPU cost */
        <div
          className="fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 140% 60% at 50% -10%, rgba(0,201,167,0.55) 0%, rgba(6,95,70,0.3) 45%, transparent 70%)",
          }}
        />
      ) : (
        /* Desktop: full WebGL aurora */
        <div className="fixed inset-0 z-0 opacity-60">
          <Aurora
            colorStops={["#00C9A7", "#4DFFCC", "#065F46"]}
            amplitude={1.2}
            blend={0.7}
            speed={0.8}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Radial overlay glow */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(20,210,170,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Dark vignette edges */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #050A10 100%)",
        }}
      />

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div className="relative z-10">
        {/* ─── TOP NAV ─── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 md:px-6 py-2.5">
            {/* Logo + Name */}
            <div className="flex items-center gap-2">
              <img
                src={logoNoBg}
                alt="معيار"
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Nav Links — desktop only */}
            <div className="hidden md:flex items-center gap-1">
              {(
                [
                  {
                    id: "features",
                    icon: TbSparkles,
                    labelKey: "landing.features",
                  },
                  { id: "stats", icon: TbChartBar, labelKey: "landing.stats" },
                  {
                    id: "faq",
                    icon: TbQuestionMark,
                    labelKey: "landing.faqTitle",
                  },
                ] as const
              ).map(({ id, icon: Icon, labelKey }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-arabic text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                  <Icon size={15} />
                  {t(labelKey)}
                </button>
              ))}
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                onClick={() => openAuth("login")}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-arabic text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                <TbArrowLeft size={15} className={isRtl ? "rotate-180" : ""} />
                {t("auth.login")}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() =>
                  i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
                }
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15 font-arabic text-xs font-bold text-white hover:bg-white/15 transition-all">
                {i18n.language === "ar" ? "EN" : "عر"}
              </button>

              {/* Auth button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => openAuth("register")}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 px-4 py-1.5 font-arabic text-sm text-white hover:bg-white/15 transition-all">
                {t("auth.createAccount")}
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* ─── HERO SECTION ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 pt-24 pb-16">
          {/* Floating financial nodes */}
          {floatingNodes.map((node) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.labelKey}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: node.delay + 0.5,
                  duration: 0.6,
                  ease: "backOut",
                }}
                className="absolute hidden md:flex flex-col items-center gap-1 pointer-events-none select-none"
                style={{ left: node.x, top: node.y }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4 + node.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${node.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: node.color }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/70 text-xs font-arabic font-medium leading-none">
                      {t(node.labelKey)}
                    </span>
                    <span
                      className="text-sm font-bold font-mono leading-none mt-0.5"
                      style={{ color: node.color }}>
                      {node.value}
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
              </motion.div>
            );
          })}

          {/* Hero content */}
          <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto gap-6 md:gap-8">
            {/* Main logo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}>
              <img
                src={logoNoBg}
                alt="معيار"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto"
              />
            </motion.div>

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/[0.06] px-4 py-1.5 backdrop-blur-sm">
                <TbSparkles className="w-4 h-4 text-teal-400" />
                <ShinyText
                  text={t("landing.pillBadge")}
                  speed={4}
                  color="#6B7280"
                  shineColor="#4DFFCC"
                  className="text-sm font-arabic font-medium"
                />
                <TbArrowLeft className="w-3.5 h-3.5 text-teal-400/70" />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openAuth("register")}
                className="flex items-center gap-2 rounded-xl bg-white text-[#050A10] px-7 py-3 font-arabic font-bold text-sm hover:bg-white/90 transition-all shadow-lg shadow-white/10">
                {t("landing.startFree")}
                <TbArrowUpRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("features")}
                className="flex items-center gap-2 rounded-xl bg-transparent border border-white/20 text-white px-7 py-3 font-arabic font-medium text-sm hover:bg-white/5 transition-all">
                {t("landing.discoverMore")}
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll indicator — bottom left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute bottom-8 left-8 hidden md:flex items-center gap-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
              <TbChevronDown className="w-4 h-4 text-teal-400" />
            </motion.div>
            <span className="font-mono text-xs text-white/30">
              01/02 . Scroll down
            </span>
          </motion.div>

          {/* Mobile scroll arrow */}
          <motion.button
            onClick={() => scrollTo("features")}
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-6 text-white/30 hover:text-white/60 transition-colors md:hidden">
            <TbChevronDown className="w-6 h-6" />
          </motion.button>
        </section>

        {/* ═══════════════════════════════════════════
           FEATURES — DeFi Wallet–style layout
           ═══════════════════════════════════════════ */}
        <section
          id="features"
          className="relative px-6 md:px-16 lg:px-24 py-20 md:py-28 overflow-hidden"
          ref={featuresRef}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="font-arabic text-3xl md:text-5xl font-black text-white mb-3">
              {t("landing.system")}{" "}
              <GradientText
                colors={["#4DFFCC", "#00C9A7", "#FFD700", "#00C9A7", "#4DFFCC"]}
                animationSpeed={6}
                className="inline">
                {t("landing.smartWallet")}
              </GradientText>
            </h2>
            <p className="font-arabic text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed">
              {t("landing.smartWalletDesc")}
            </p>

            {/* "How it works" pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6">
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 font-arabic text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                {t("landing.howItWorks")}
              </button>
            </motion.div>
          </motion.div>

          {/* ─── Main visual area ─── */}
          <div className="relative max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
            {/* Connecting lines SVG */}
            <ConnectingLines />

            {/* ── Column 1 (right in RTL): Balance card + transaction cards ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}>
              {/* Main balance card */}
              <div className="mb-8">
                <p className="font-arabic text-sm text-teal-400/60 mb-1">
                  {t("landing.smartWalletSystem")}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black text-white font-mono">
                    +12.5
                  </span>
                  <OmaniRial className="w-8 h-auto text-white/50 mb-1" />
                </div>
              </div>

              {/* Transaction cards */}
              <div className="hidden lg:flex flex-col gap-3">
                <TransactionCard
                  icon={TbArrowUp}
                  label={t("landing.txRevenue")}
                  subLabel={t("landing.txFromSalary")}
                  value="5,200"
                  unit={<OmaniRial className="w-4 h-auto opacity-50" />}
                  delay={0.4}
                  color="#4DFFCC"
                />
                <TransactionCard
                  icon={TbArrowDownRight}
                  label={t("landing.txExpense")}
                  subLabel={t("landing.txBill")}
                  value="1,038"
                  unit={<OmaniRial className="w-4 h-auto opacity-50" />}
                  delay={0.7}
                  color="#FFD700"
                />
                <TransactionCard
                  icon={TbCash}
                  label={t("landing.txSaving")}
                  subLabel={t("landing.txGoal")}
                  value="4,948"
                  unit={<OmaniRial className="w-4 h-auto opacity-50" />}
                  delay={1.0}
                  color="#A78BFA"
                />
              </div>

              {/* Status badges */}
              <div className="hidden lg:flex flex-wrap gap-2 mt-4">
                <StatusBadge
                  label={t("landing.statusComplete")}
                  variant="done"
                  delay={1.2}
                />
                <StatusBadge
                  label={t("landing.statusPending")}
                  variant="pending"
                  delay={1.5}
                />
                <StatusBadge
                  label={t("landing.statusPending")}
                  variant="pending"
                  delay={1.8}
                />
              </div>
            </motion.div>

            {/* ── Column 2 (left in RTL): Step dial + feature cards ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
                className="flex justify-center mt-12 lg:mt-0">
                <StepDial />
              </motion.div>

              {/* Feature list cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <Tilt
                      key={feat.titleKey}
                      tiltMaxAngleX={8}
                      tiltMaxAngleY={8}
                      glareEnable
                      glareMaxOpacity={0.08}
                      glareColor="#4DFFCC"
                      glareBorderRadius="12px"
                      scale={1.02}>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                        className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] transition-colors h-full">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: feat.glow,
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}>
                          <Icon className={`w-4 h-4 ${feat.color}`} />
                        </div>
                        <div>
                          <p className="font-arabic font-semibold text-white text-sm mb-0.5">
                            {t(feat.titleKey)}
                          </p>
                          <p className="font-arabic text-xs text-white/35 leading-relaxed">
                            {t(feat.descKey)}
                          </p>
                        </div>
                      </motion.div>
                    </Tilt>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Scrolling tags (two rows like reference) ─── */}
          <div className="mt-12 space-y-3 -mx-6 md:-mx-16 lg:-mx-24">
            <ScrollingTags direction="right" />
            <ScrollingTags direction="left" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           STATS — Bento grid insights
           ═══════════════════════════════════════════ */}
        <section
          id="stats"
          className="relative px-6 md:px-16 lg:px-24 py-20 md:py-28">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14">
            <h2 className="font-arabic text-3xl md:text-5xl font-black text-white mb-3">
              {t("landing.numbersThat")}{" "}
              <GradientText
                colors={["#4DFFCC", "#00C9A7", "#FFD700", "#00C9A7", "#4DFFCC"]}
                animationSpeed={6}
                className="inline">
                {t("landing.success")}
              </GradientText>
            </h2>
            <p className="font-arabic text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed">
              {t("landing.statsDesc")}
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
            {/* Card 1 — Big stat (spans 2 cols) */}
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#4DFFCC"
              glareBorderRadius="16px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="md:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                      <TbTrendingUp className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="font-arabic text-xs text-white/40">
                      {t("landing.savingsRate")}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black text-white font-mono">
                      <CountUp
                        end={94.7}
                        decimals={1}
                        duration={2.5}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    </span>
                    <span className="text-2xl text-teal-400 font-bold">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  {[
                    t("landing.budgetSetup"),
                    t("landing.expenseTracking"),
                    t("landing.goalAchievement"),
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[10px] font-arabic text-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Tilt>

            {/* Card 2 — Bar chart card */}
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#FFD700"
              glareBorderRadius="16px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8 min-h-[220px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                    <TbChartBar className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="font-arabic text-xs text-white/40">
                    {t("landing.monthlyExpenses")}
                  </span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-2 h-28 mt-4">
                  {[
                    { h: 45, label: t("landing.jan"), color: "bg-teal-400/60" },
                    { h: 72, label: t("landing.feb"), color: "bg-teal-400/80" },
                    {
                      h: 58,
                      label: t("landing.mar"),
                      color: "bg-yellow-400/70",
                    },
                    { h: 85, label: t("landing.apr"), color: "bg-teal-400" },
                    { h: 30, label: t("landing.may"), color: "bg-white/20" },
                    {
                      h: 65,
                      label: t("landing.jun"),
                      color: "bg-purple-400/60",
                    },
                  ].map((bar) => (
                    <div
                      key={bar.label}
                      className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${bar.h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`w-full rounded-md ${bar.color}`}
                        style={{ minHeight: 4 }}
                      />
                      <span className="text-[9px] font-arabic text-white/25">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Tilt>

            {/* Card 3 — Users stat */}
            <Tilt
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#A78BFA"
              glareBorderRadius="16px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 flex flex-col justify-between min-h-[180px]">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                  <TbUsers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-arabic text-xs text-white/40 mb-1">
                    {t("landing.activeUser")}
                  </p>
                  <span className="text-3xl font-black text-white font-mono">
                    <CountUp
                      end={2847}
                      separator=","
                      duration={2}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </span>
                </div>
              </motion.div>
            </Tilt>

            {/* Card 4 — Transactions stat */}
            <Tilt
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#38BDF8"
              glareBorderRadius="16px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 flex flex-col justify-between min-h-[180px]">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center">
                  <TbReceipt className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="font-arabic text-xs text-white/40 mb-1">
                    {t("landing.registeredTransaction")}
                  </p>
                  <span className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                    <CountUp
                      end={18.4}
                      decimals={1}
                      duration={2}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    <span className="text-lg font-black text-white/60">
                      ألف
                    </span>
                  </span>
                </div>
              </motion.div>
            </Tilt>

            {/* Card 5 — Growth cards (spans 2 cols) */}
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#4DFFCC"
              glareBorderRadius="16px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="md:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8 min-h-[180px]">
                <p className="font-arabic text-xs text-white/40 mb-4">
                  {t("landing.financialGrowthRate")}
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      label: t("landing.savingsGrowth"),
                      value: "19.2",
                      sub: "2,700",
                      color: "border-teal-400/30",
                      textColor: "text-teal-400",
                    },
                    {
                      label: t("landing.investmentGrowth"),
                      value: "24.5",
                      sub: "3,200",
                      color: "border-yellow-400/30",
                      textColor: "text-yellow-400",
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className={`flex-1 rounded-xl bg-white/[0.02] border ${card.color} p-4`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className={`w-1 h-4 rounded-full ${card.textColor} opacity-60`}
                        />
                        <span className="font-arabic text-xs text-white/50">
                          {card.label}
                        </span>
                      </div>
                      <span
                        className={`text-3xl font-black font-mono ${card.textColor}`}>
                        <CountUp
                          end={parseFloat(card.value)}
                          decimals={1}
                          duration={2}
                          enableScrollSpy
                          scrollSpyOnce
                        />
                      </span>
                      <p className="text-xs font-mono text-white/25 mt-1 flex items-center gap-1">
                        {card.sub}{" "}
                        <OmaniRial className="w-3.5 h-auto text-white/25" />
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Tilt>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           FAQ — الأسئلة الشائعة
           ═══════════════════════════════════════════ */}
        <section
          id="faq"
          className="relative px-6 md:px-16 lg:px-24 py-20 md:py-28">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14">
            <h2 className="font-arabic text-3xl md:text-5xl font-black text-white mb-3">
              {t("landing.faqTitle")}{" "}
              <GradientText
                colors={["#4DFFCC", "#00C9A7", "#FFD700", "#00C9A7", "#4DFFCC"]}
                animationSpeed={6}
                className="inline">
                {t("landing.faqHighlight")}
              </GradientText>
            </h2>
            <p className="font-arabic text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed">
              {t("landing.faqDesc")}
            </p>
          </motion.div>

          {/* FAQ items */}
          <div className="max-w-3xl mx-auto space-y-3">
            <FaqAccordion />
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-white/[0.06] px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src={logoNoBg}
                alt="معيار"
                className="w-6 h-6 object-contain opacity-50"
              />
              <span className="font-arabic text-sm text-white/30">
                {t("landing.copyright", { year: new Date().getFullYear() })}
              </span>
            </div>
            <p className="font-arabic text-xs text-white/20">
              {t("landing.footerTagline")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
