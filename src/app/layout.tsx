import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/shared/BottomNav";
import { SideNav } from "@/components/shared/SideNav";

export function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    /* App-shell: outer wrapper is viewport-fixed so wave never scrolls on iOS */
    <div className=" inset-0 bg-neutral-bg dark:bg-[var(--bg-page)] flex flex-col">
      {/* Wave background — dashboard only, mobile only */}
      {isDashboard && (
        <div
          className="absolute top-0 left-0 right-0 h-56 pointer-events-none z-0 md:hidden"
          style={{
            backgroundImage: "url('/wave-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
      )}

      {/* Desktop sidebar */}
      <SideNav />

      {/* Scrollable content area */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden md:mr-60">
        <main className="pb-20 md:pb-8">
          <div className="mx-auto max-w-2xl lg:max-w-5xl px-4 py-4 md:px-8 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
