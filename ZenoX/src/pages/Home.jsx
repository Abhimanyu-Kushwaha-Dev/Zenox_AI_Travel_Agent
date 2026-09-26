import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SearchHero from "@/components/routewise/SearchHero";
import LoadingJourney from "@/components/routewise/LoadingJourney";
import TripCard from "@/components/routewise/TripCard";

export default function Home() {
  const [planning, setPlanning] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    base44.entities.Itinerary.list("-created_date", 3)
      .then(setRecent)
      .catch(() => {});
  }, []);

  async function handlePlan(query) {
    const res = await base44.functions.invoke("planTrip", { query });
    return res.data;
  }

  if (planning) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <LoadingJourney />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-10">
        <SearchHero onPlan={(q) => { setPlanning(true); return handlePlan(q); }} />
      </section>

      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-semibold text-foreground">Your recent trips</h2>
            <Link to="/trips" className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              All trips <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        </section>
      )}

      {/* Feature strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Sparkles, title: "Grounded in real sources", body: "Every recommendation is backed by live web search — not hallucinated." },
            { icon: Compass, title: "Day-by-day detail", body: "Timed activities, dining, stays and transport, tailored to your request." },
            { icon: ArrowRight, title: "Budget & weather ready", body: "A realistic cost breakdown and forecast arrive with your plan." }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl bg-card border border-border p-6">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}