# ZenoX (RouteWise — Premium AI Travel Agent)

ZenoX is a premium, AI-powered travel-planning application. Describe a trip in one
sentence and the AI travel agent builds a complete, source-backed itinerary —
day by day, with weather, budget, dining, accommodation and citations.

## Stack
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion + Recharts
- AI agent: Base44 backend function using Gemini (with live Google web-search grounding)
- Storage: Base44 entities (Itinerary)

## Structure
- index.html              — app shell, fonts (Fraunces + Inter), meta
- src/                    — frontend
  - App.jsx              — router (Plan / Itinerary / Saved trips)
  - index.css            — design tokens (warm cream + deep-teal palette)
  - pages/               — Home, ItineraryResult, SavedTrips
  - components/routewise/ — SearchHero, LoadingJourney, ItineraryDetail,
                           DayCard, WeatherStrip, BudgetBreakdown,
                           SourcesList, TripCard, TopNav, Layout
- base44/
  - entities/Itinerary.jsonc   — itinerary data schema
  - functions/planTrip/entry.ts — the AI travel agent (Gemini + web grounding)
- tailwind.config.js / vite.config.js / package.json — config

## The AI agent (base44/functions/planTrip/entry.ts)
Receives a natural-language trip request, calls Gemini with live web search
(add_context_from_internet) to ground recommendations in real sources, returns
a structured itinerary (destination, summary, constraints, daily activities,
dining, accommodation, budget breakdown, weather forecast, source URLs, tips),
generates a cinematic cover image, and persists it to the Itinerary entity.

## Run
```bash
npm install
npm run dev
```
