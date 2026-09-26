import React from "react";
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

const ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  "partly-cloudy": CloudSun,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  fog: CloudFog
};

export default function WeatherStrip({ weather = [], currency }) {
  if (!weather.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
      {weather.map((d, i) => {
        const Icon = ICONS[d.icon] || CloudSun;
        return (
          <div key={i} className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center text-center">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {d.date || `Day ${d.day}`}
            </span>
            <Icon className="w-7 h-7 text-accent mb-2" />
            <span className="text-sm font-medium text-foreground">{d.condition}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {d.temp_high}° / {d.temp_low}°
            </span>
          </div>
        );
      })}
    </div>
  );
}