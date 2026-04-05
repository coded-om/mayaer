import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/shared/BottomNav";
import { SideNav } from "@/components/shared/SideNav";

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-[var(--bg-page)]">
      {/* Desktop sidebar */}
      <SideNav />

      {/* Main content — offset right on desktop to clear the sidebar */}
      <main className="md:mr-60 pb-20 md:pb-8">
        <div className="mx-auto max-w-2xl lg:max-w-5xl px-4 py-4 md:px-8 md:py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
