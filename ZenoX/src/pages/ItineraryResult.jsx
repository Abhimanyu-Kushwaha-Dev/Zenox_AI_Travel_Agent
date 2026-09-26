import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ItineraryDetail from "@/components/routewise/ItineraryDetail";

export default function ItineraryResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    base44.entities.Itinerary.get(id)
      .then((data) => { setItinerary(data); setNotFound(!data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!itinerary) return;
    await base44.entities.Itinerary.delete(itinerary.id);
    navigate("/trips");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }
  if (notFound || !itinerary) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground">Trip not found</h1>
        <p className="text-muted-foreground mt-2">This itinerary may have been removed.</p>
        <Button asChild className="mt-6"><Link to="/">Plan a new trip</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
      <div className="flex items-center justify-between py-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="gap-1.5 text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>
      <ItineraryDetail itinerary={itinerary} />
    </div>
  );
}