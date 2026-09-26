import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import TripCard from "@/components/routewise/TripCard";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Itinerary.list("-created_date", 50)
      .then(setTrips)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight">Saved trips</h1>
          <p className="text-muted-foreground mt-1.5">Every itinerary you've planned, ready to revisit.</p>
        </div>
        <Button asChild className="gap-2"><Link to="/"><Plus className="w-4 h-4" /> New trip</Link></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>
      ) : trips.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-dashed border-border">
          <h2 className="font-display text-2xl font-semibold text-foreground">No trips yet</h2>
          <p className="text-muted-foreground mt-2">Describe a trip and RouteWise will plan it for you.</p>
          <Button asChild className="mt-6"><Link to="/">Plan your first trip</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((t) => <TripCard key={t.id} trip={t} />)}
        </div>
      )}
    </div>
  );
}