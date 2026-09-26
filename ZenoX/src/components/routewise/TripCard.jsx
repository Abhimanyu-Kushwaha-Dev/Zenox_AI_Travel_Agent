import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function TripCard({ trip }) {
  return (
    <Link to={`/itinerary/${trip.id}`} className="group block rounded-3xl overflow-hidden bg-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        {trip.cover_image_url ? (
          <Image src={trip.cover_image_url} className="w-full h-full" fittingType="fill" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-xl font-semibold text-white leading-tight line-clamp-1">{trip.title}</h3>
          <div className="flex items-center gap-1.5 text-white/85 text-xs mt-1">
            <MapPin className="w-3 h-3" />{trip.destination}
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {trip.duration_days} days
        </div>
        <span className="text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          View trip <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}