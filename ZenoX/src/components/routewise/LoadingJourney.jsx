import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Compass, CloudSun, Wallet, BookOpen } from "lucide-react";

const STEPS = [
  { icon: Compass, label: "Understanding your trip" },
  { icon: BookOpen, label: "Searching the web for real sources" },
  { icon: CloudSun, label: "Checking the weather" },
  { icon: Wallet, label: "Estimating your budget" },
  { icon: Plane, label: "Crafting your day-by-day plan" }
];

export default function LoadingJourney() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/15"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Plane className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <AnimatePresence key={i}>
              {(active || done) && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 text-sm transition ${active ? "text-foreground" : "text-muted-foreground/60"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span>{s.label}</span>
                  {active && (
                    <motion.span
                      className="ml-auto flex gap-1"
                    >
                      {[0,1,2].map((d) => (
                        <motion.span key={d} className="w-1 h-1 rounded-full bg-primary"
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        />
                      ))}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}