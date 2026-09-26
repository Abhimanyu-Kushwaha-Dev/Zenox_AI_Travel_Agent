import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "5 days in Kyoto in autumn for two, mid-budget, love food & temples",
  "Romantic long weekend in Santorini, June, sunset views",
  "One week family adventure in Costa Rica, nature & wildlife",
  "3 days in Marrakech, markets and riads, December"
];

export default function SearchHero({ onPlan }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await onPlan(query.trim());
      if (res?.error) throw new Error(res.error);
      if (res?.itinerary?.id) navigate(`/itinerary/${res.itinerary.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-medium tracking-wide mb-7 border border-primary/15">
        <Sparkles className="w-3.5 h-3.5" />
        AI travel planning, grounded in real sources
      </div>

      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-foreground text-balance">
        Where will you<br className="hidden sm:block" /> wander next?
      </h1>
      <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
        Describe your dream trip in a sentence. RouteWise builds a complete,
        source-backed itinerary — day by day, with weather, budget and dining.
      </p>

      <form onSubmit={handleSubmit} className="mt-9">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur opacity-40 group-focus-within:opacity-70 transition duration-500" />
          <div className="relative flex items-center gap-2 bg-card rounded-2xl border border-border shadow-sm p-2 pl-5">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 5 days in Kyoto, autumn, two travelers, love food & temples"
              className="flex-1 bg-transparent border-0 outline-none text-base sm:text-lg placeholder:text-muted-foreground/60 py-2.5"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !query.trim()} className="rounded-xl h-12 px-5 sm:px-6 gap-2 text-base">
              {loading ? "Planning…" : <>Plan it <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive px-1">{error}</p>}
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setQuery(ex)}
            disabled={loading}
            className="text-xs sm:text-[13px] px-3.5 py-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </motion.div>
  );
}