import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PALETTE = ["#0f766e", "#d97757", "#7c9885", "#c9a96e", "#6b8aad", "#a88bb0"];

export default function BudgetBreakdown({ breakdown = [], total, currency = "USD" }) {
  const data = breakdown.filter((b) => b.amount > 0);
  if (!data.length) return null;

  const fmt = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Total</span>
          <span className="text-xl font-display font-semibold text-foreground">{fmt(total)}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {data.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-sm text-foreground flex-1">{b.category}</span>
            <span className="text-sm font-medium text-foreground tabular-nums">{fmt(b.amount)}</span>
          </div>
        ))}
        {data.some((b) => b.notes) && (
          <div className="pt-3 mt-3 border-t border-border space-y-1.5">
            {data.filter((b) => b.notes).map((b, i) => (
              <p key={i} className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{b.category}:</span> {b.notes}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}