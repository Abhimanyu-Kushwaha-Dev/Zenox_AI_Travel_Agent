import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          RouteWise · AI itineraries grounded in real sources
        </p>
      </footer>
    </div>
  );
}