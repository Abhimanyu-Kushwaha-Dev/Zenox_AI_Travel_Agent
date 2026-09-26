import React from "react";
import { ExternalLink, Quote } from "lucide-react";

export default function SourcesList({ sources = [] }) {
  if (!sources.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {sources.map((s, i) => {
        let host = "";
        try { host = new URL(s.url).hostname.replace(/^www\./, ""); } catch { host = s.url; }
        return (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
            className="group rounded-2xl bg-card border border-border p-4 hover:border-primary/40 hover:shadow-sm transition flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-foreground line-clamp-2">{s.title || host}</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition" />
            </div>
            {s.snippet && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3 flex gap-1.5">
                <Quote className="w-3 h-3 shrink-0 mt-0.5 opacity-50" />{s.snippet}
              </p>
            )}
            <span className="text-[11px] text-primary/70 mt-3 truncate">{host}</span>
          </a>
        );
      })}
    </div>
  );
}