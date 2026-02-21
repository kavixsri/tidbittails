import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Phone, Heart, Sparkles } from "lucide-react";
import logo from "@/assets/tidbit-tails-logo.png";

const navLinks = [
  { href: "home", label: "Home" },
  { href: "nodes", label: "Network" },
  { href: "ngos", label: "NGOs" },
  { href: "emergency", label: "Emergency" },
  { href: "events", label: "Events" },
  { href: "volunteer", label: "Volunteer" },
  { href: "pupcafe", label: "Pup Café" },
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  // Blossom transformation: higher transparency, stronger blur
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.65)"]
  );
  const headerBlur = useTransform(scrollY, [0, 80], [0, 32]);
  const headerY = useTransform(scrollY, [0, 80], [0, 4]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-2 pointer-events-none"
      style={{ y: headerY }}
    >
      <motion.div
        className="w-[95%] max-w-7xl rounded-full border border-white/40 shadow-glass pointer-events-auto overflow-hidden"
        style={{
          backgroundColor: headerBg,
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="container mx-auto px-6 h-16 md:h-[72px] flex items-center justify-between">
          {/* Logo with Blossom Entrance */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
            className="flex items-center gap-3 group"
          >
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div
                className="absolute -inset-1 rounded-full opacity-40 blur-lg"
                style={{ background: "var(--grad-candy)" }}
              />
              <img
                src={logo}
                alt="Tidbit Tails"
                className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white/80 shadow-sm"
              />
            </motion.div>
            <div className="leading-none">
              <span className="block font-black text-[18px] tracking-tight text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                TIDBIT <span className="text-gradient">TAILS</span>
              </span>
              <span className="block text-[10px] tracking-[0.2em] font-black text-primary/60 uppercase mt-0.5">
                Delhi · Network
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={`#${link.href}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="relative px-4 py-2 text-[13px] font-black text-muted-foreground/80 hover:text-primary transition-all duration-300 rounded-full hover:bg-white/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA row */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.button
              onClick={() => scrollTo("emergency")}
              className="relative overflow-hidden px-6 py-2.5 rounded-full text-white text-[13px] font-black tracking-wide shadow-glow-primary group"
              style={{ background: "var(--grad-fire)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-white" />
                SOS Help
              </span>
              <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full bg-white/40 text-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                  <Menu className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/80 backdrop-blur-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`#${link.href}`}
                    onClick={(e) => { e.preventDefault(); setIsOpen(false); setTimeout(() => scrollTo(link.href), 120); }}
                    className="text-[17px] font-black text-foreground hover:text-primary transition-all py-3 px-4 rounded-2xl hover:bg-white/60"
                  >
                    {link.label}
                  </a>
                ))}
                <motion.button
                  onClick={() => { setIsOpen(false); setTimeout(() => scrollTo("emergency"), 120); }}
                  className="mt-4 w-full py-4 rounded-full text-white font-black text-[15px] shadow-glow-primary"
                  style={{ background: "var(--grad-fire)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  🚨 Report Emergency
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};
