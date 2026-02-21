import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Users, MapPin, Sparkles, Phone, ArrowRight, Star } from "lucide-react";
import heroImage from "@/assets/hero-dog.jpg";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  color: string;
  delay: number;
  rotate: number;
}

const StatCard = ({ icon, value, label, color, delay, rotate }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotate: rotate * 2 }}
    animate={{ opacity: 1, y: 0, rotate }}
    transition={{ duration: 0.7, delay, type: "spring", stiffness: 90, damping: 15 }}
    whileHover={{ rotate: 0, scale: 1.06, zIndex: 10 }}
    className="glass-card rounded-[22px] p-5 relative overflow-hidden cursor-default shadow-card bg-white/40 backdrop-blur-md border border-white/60"
    style={{ transformOrigin: "center bottom" }}
  >
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-12 translate-x-8 -translate-y-8"
      style={{ background: color }}
    />
    <div
      className="w-11 h-11 rounded-2xl mb-3 flex items-center justify-center text-xl shadow-sm"
      style={{ background: color }}
    >
      {icon}
    </div>
    <div className="text-[28px] font-black leading-none text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      {value}
    </div>
    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{label}</div>
  </motion.div>
);

interface HeroSectionProps {
  stats: {
    total_animals_rescued: number;
    total_volunteers: number;
    total_ngos: number;
    total_nodes: number;
  } | null;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } } };

// Decorative petal component
const FloatingPetal = ({ top, left, delay, color, scale }: { top: string, left: string, delay: number, color: string, scale: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.4, scale }}
    className="absolute pointer-events-none animate-drift z-0"
    style={{ top, left, animationDelay: `${delay}s`, color }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C12 2 15 10 22 12C15 14 12 22 12 22C12 22 9 14 2 12C9 10 12 2 12 2Z" />
    </svg>
  </motion.div>
);

const MARQUEE_ITEMS = ["Adopt Don't Shop 🐾", "Delhi Rescue Network ✨", "Save A Life Today 🌸", "Volunteer With Us 💛", "Rescue · Heal · Relove 🐕"];

export const HeroSection = ({ stats }: HeroSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={ref} id="home" className="relative min-h-[110vh] flex items-center pt-24 pb-32 overflow-hidden grain bg-white">
      {/* Parallax hero bg */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: `url(${heroImage})`, y: imgY }}
      />

      {/* Layered overlays for Blossom depth (warmer, brighter) */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #fff 0%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.7) 65%, transparent 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #fff 10%, transparent 40%)" }} />

      {/* Blossom Floating Elements */}
      <FloatingPetal top="15%" left="55%" delay={0} color="#ffbed2" scale={1.2} />
      <FloatingPetal top="45%" left="65%" delay={2} color="#f72585" scale={0.8} />
      <FloatingPetal top="70%" left="50%" delay={4} color="#ffd60a" scale={1.5} />
      <FloatingPetal top="25%" left="80%" delay={1} color="#9b5de5" scale={0.6} />
      <FloatingPetal top="60%" left="90%" delay={3} color="#06d6a0" scale={1} />

      {/* Background abstract shapes */}
      <div className="absolute top-20 left-[52%] w-[500px] h-[500px] blob opacity-[0.06] blur-2xl" style={{ background: "var(--grad-candy)" }} />
      <div className="absolute top-60 right-20 w-80 h-80 blob-2 opacity-[0.08] float-2 blur-xl" style={{ background: "var(--grad-honey)" }} />

      <motion.div className="container mx-auto px-5 md:px-8 relative z-10" style={{ y: textY }}>
        <div className="max-w-4xl grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Eyebrow tag */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[11px] font-black uppercase tracking-[0.14em] mb-7 shadow-card bg-white/60 border border-white">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-gradient">Delhi's Premium Rescue Org</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-[clamp(48px,8vw,92px)] font-black leading-[0.95] mb-8 text-foreground"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Nurturing<br />
              Kindness{" "}
              <span className="relative inline-block">
                <span className="text-gradient">Everywhere</span>
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full h-4"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M5 8 C50 2 150 2 295 8"
                    fill="none"
                    stroke="#ff2d78"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={item}
              className="text-[18px] text-muted-foreground leading-relaxed mb-12 max-w-xl font-medium"
            >
              Experience the blossom of compassion. We unite Delhi's hearts to rescue, heal, and find forever homes for our furry street friends.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-16">
              <motion.button
                onClick={() => document.getElementById("emergency")?.scrollIntoView({ behavior: "smooth" })}
                className="relative overflow-hidden px-8 py-4.5 rounded-full text-white font-black text-[16px] tracking-wide shadow-glow-primary group"
                style={{ background: "var(--grad-fire)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Phone className="w-4.5 h-4.5" />
                  Request Assistance
                </span>
                <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              <motion.button
                onClick={() => document.getElementById("volunteer")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4.5 rounded-full glass font-black text-[16px] text-foreground group border-2 border-primary/20 hover:border-primary/40 transition-all"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  Join The Movement
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side Stats Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 gap-4 self-center lg:pt-12"
          >
            <StatCard icon="🐾" value={stats ? `${(stats.total_animals_rescued / 1000).toFixed(0)}K+` : "22K+"} label="Compassionate Rescues" color="var(--grad-fire)" delay={0.8} rotate={-2} />
            <StatCard icon="🌸" value={stats?.total_volunteers?.toString() || "850+"} label="Blossom Members" color="var(--grad-candy)" delay={0.9} rotate={2} />
            <StatCard icon="🤝" value={stats?.total_ngos?.toString() || "24"} label="Trusted Partners" color="var(--grad-ocean)" delay={1.0} rotate={-1} />
          </motion.div>
        </div>
      </motion.div>

      {/* Blossom Marquee Strip */}
      <div className="absolute bottom-8 left-0 right-0 py-6 overflow-hidden border-y border-foreground/5 bg-white/30 backdrop-blur-sm z-20">
        <div className="animate-marquee flex gap-12">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="flex-shrink-0 text-[16px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-12">
              {item}
              <span className="w-2 h-2 rounded-full bg-primary/30" />
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10" style={{ background: "linear-gradient(to top, #fff 10%, transparent 100%)" }} />
    </section>
  );
};
