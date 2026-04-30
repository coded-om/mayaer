import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

export function ProtectedRoute() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const onboardingCompleted = useProfileStore((s) => s.onboardingCompleted);
  const { pathname } = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!onboardingCompleted && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
