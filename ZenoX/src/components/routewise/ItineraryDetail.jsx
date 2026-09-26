import React from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Users, Wallet, Lightbulb, Link2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";
import DayCard from "./DayCard";
import WeatherStrip from "./WeatherStrip";
import BudgetBreakdown from "./BudgetBreakdown";
import SourcesList from "./SourcesList";

const fade = (delay) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" }
});

export default function ItineraryDetail({ itinerary }) {
  const c = itinerary.budget_currency || "USD";
  const fmt = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n || 0);
  const con = itinerary.constraints || {};

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[42vh] min-h-[320px] rounded-b-[2.5rem] overflow-hidden -mt-6">
        {itinerary.cover_image_url ? (
          <Image src={itinerary.cover_image_url} className="w-full h-full" fittingType="fill" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/25 via-accent/20 to-primary/15" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <motion.div {...fade(0)}>
            <div className="flex items-center gap-2 text-white/85 text-sm mb-2">
              <MapPin className="w-4 h-4" />{itinerary.destination}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight text-balance max-w-3xl">
              {itinerary.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        {/* Summary + meta chips */}
        <motion.div {...fade(0.05)} className="rounded-3xl bg-card border border-border shadow-sm p-6 sm:p-8">
          <p className="text-lg text-foreground/90 leading-relaxed">{itinerary.summary}</p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Meta icon={CalendarDays} label={`${itinerary.duration_days} days`} />
            {con.travelers && <Meta icon={Users} label={`${con.travelers} traveler${con.travelers > 1 ? "s" : ""}`} />}
            {itinerary.budget_total > 0 && <Meta icon={Wallet} label={fmt(itinerary.budget_total)} />}
            {con.dates && <Meta icon={CalendarDays} label={con.dates} />}
            {con.preferences?.map((p, i) => <Badge key={i} variant="secondary" className="rounded-full font-normal">{p}</Badge>)}
          </div>
        </motion.div>

        {/* Weather */}
        {itinerary.weather?.length > 0 && (
          <Section title="Weather forecast" icon={null}>
            <WeatherStrip weather={itinerary.weather} currency={c} />
          </Section>
        )}

        {/* Budget */}
        {itinerary.budget_breakdown?.length > 0 && (
          <Section title="Budget breakdown" icon={<Wallet className="w-5 h-5 text-primary" />}>
            <BudgetBreakdown breakdown={itinerary.budget_breakdown} total={itinerary.budget_total} currency={c} />
          </Section>
        )}

        {/* Days */}
        <Section title="Your day-by-day plan" icon={<CalendarDays className="w-5 h-5 text-primary" />}>
          <div className="space-y-4">
            {itinerary.days?.map((d, i) => (
              <motion.div key={i} {...fade(i * 0.04)}>
                <DayCard day={d} currency={c} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Tips */}
        {itinerary.tips?.length > 0 && (
          <Section title="Travel tips" icon={<Lightbulb className="w-5 h-5 text-primary" />}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {itinerary.tips.map((t, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-foreground/85 leading-relaxed rounded-2xl bg-card border border-border p-4">
                  <span className="text-primary font-display font-semibold">{i + 1}.</span>{t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Sources */}
        {itinerary.sources?.length > 0 && (
          <Section title="Sources" icon={<Link2 className="w-5 h-5 text-primary" />} subtitle="Recommendations grounded in these references">
            <SourcesList sources={itinerary.sources} />
          </Section>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted/60 text-foreground">
      <Icon className="w-3.5 h-3.5 text-primary" />{label}
    </span>
  );
}

function Section({ title, icon, subtitle, children }) {
  return (
    <motion.section {...fade(0)} className="mt-12">
      <div className="flex items-center gap-2.5 mb-5">
        {icon}
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}