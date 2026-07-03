"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  animate,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Reveal — fades + slides content in when it scrolls into view.
 * Server-rendered children are passed through, so section content stays RSC.
 * -------------------------------------------------------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Stagger — animates a set of children in sequence on scroll into view.
 * -------------------------------------------------------------------------- */
const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerParent}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * CountUp — animates a number from 0 to `value` when it enters the viewport.
 * -------------------------------------------------------------------------- */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        setDisplay(
          v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        );
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Marquee — seamless infinite horizontal scroll of its children.
 * -------------------------------------------------------------------------- */
export function Marquee({
  children,
  speed = 30,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <motion.div
        className="flex shrink-0 items-center gap-12 pr-12"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex shrink-0 items-center gap-12 pr-12"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        aria-hidden
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * GlowCard — card that renders a soft radial glow following the cursor.
 * -------------------------------------------------------------------------- */
export function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const background = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x}px ${y}px, rgba(123,133,255,0.16), transparent 70%)`
  );

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Aurora — animated gradient blobs for hero backdrops.
 * -------------------------------------------------------------------------- */
export function Aurora({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full blur-[140px]"
        style={{ background: "rgba(75,70,232,0.30)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-120px] top-10 h-[420px] w-[420px] rounded-full blur-[140px]"
        style={{ background: "rgba(56,189,248,0.18)" }}
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-140px] left-1/3 h-[380px] w-[380px] rounded-full blur-[140px]"
        style={{ background: "rgba(123,133,255,0.20)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Floaty — gentle infinite float for decorative elements.
 * -------------------------------------------------------------------------- */
export function Floaty({
  children,
  className,
  amount = 10,
  duration = 5,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export { motion, useSpring };


/* ----------------------------------------------------------------------------
 * ScrollProgress — thin gradient bar pinned to the top, scaled by page scroll.
 * -------------------------------------------------------------------------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-brand-400 via-sky-400 to-brand-500"
      aria-hidden
    />
  );
}

/* ----------------------------------------------------------------------------
 * Parallax — translates children on the Y axis as the element scrolls through
 * the viewport. `speed` is the total travel in px.
 * -------------------------------------------------------------------------- */
export function Parallax({
  children,
  speed = 60,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
