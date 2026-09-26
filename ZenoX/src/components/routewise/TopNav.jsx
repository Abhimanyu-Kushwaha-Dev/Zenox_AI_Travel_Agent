import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass } from "lucide-react";

export default function TopNav() {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Plan" },
    { to: "/trips", label: "Saved trips" }
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground group-hover:rotate-45 transition-transform duration-500" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">RouteWise</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3.5 py-2 rounded-full text-sm transition ${active ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}