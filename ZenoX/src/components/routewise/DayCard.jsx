import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Clock, UtensilsCrossed, BedDouble, Bus } from "lucide-react";

const CAT_COLOR = {
  sightseeing: "bg-primary/10 text-primary",
  nature: "bg-emerald-100 text-emerald-700",
  food: "bg-amber-100 text-amber-700",
  culture: "bg-violet-100 text-violet-700",
  relaxation: "bg-sky-100 text-sky-700",
  shopping: "bg-rose-100 text-rose-700"
};

export default function DayCard({ day, currency = "USD" }) {
  const [open, setOpen] = useState(true);
  const fmt = (n) => (n ? new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(n) : null);

  return (
    <div className="rounded-3xl bg-card border border-border overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shrink-0">
          <span className="text-[10px] uppercase tracking-wider opacity-80">Day</span>
          <span className="text-lg font-display font-semibold leading-none">{day.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-semibold text-foreground truncate">{day.title}</h3>
          {day.theme && <p className="text-sm text-muted-foreground truncate">{day.theme}</p>}
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-1">
              <div className="relative pl-6 space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                {day.activities?.map((a, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-card border-2 border-primary" />
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-sm font-medium tabular-nums text-primary">{a.time}</span>
                      <h4 className="font-medium text-foreground">{a.title}</h4>
                      {a.category && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${CAT_COLOR[a.category] || "bg-muted text-muted-foreground"}`}>{a.category}</span>
                      )}
                    </div>
                    {a.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.description}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      {a.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>}
                      {a.duration && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>}
                      {fmt(a.cost) && <span className="tabular-nums">{fmt(a.cost)}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {day.dining?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Dining
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {day.dining.map((d, i) => (
                      <div key={i} className="rounded-xl bg-muted/40 px-3.5 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{d.name}</span>
                          {d.price_range && <span className="text-xs text-muted-foreground shrink-0">{d.price_range}</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{d.meal}{d.cuisine ? ` · ${d.cuisine}` : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(day.accommodation || day.transportation) && (
                <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-3 text-sm">
                  {day.accommodation && (
                    <div className="flex gap-2"><BedDouble className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /><div><span className="text-xs uppercase tracking-wider text-muted-foreground block">Stay</span><span className="text-foreground">{day.accommodation}</span></div></div>
                  )}
                  {day.transportation && (
                    <div className="flex gap-2"><Bus className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /><div><span className="text-xs uppercase tracking-wider text-muted-foreground block">Getting around</span><span className="text-foreground">{day.transportation}</span></div></div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}