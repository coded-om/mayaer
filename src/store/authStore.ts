import { create } from "zustand";
import { useProfileStore } from "@/store/profileStore";

const TOKEN_KEY = "bb_auth_token";

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  userEmail: null,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        useProfileStore.getState().setName(data.name);
        set({ isLoggedIn: true, userEmail: data.email });
      } else {
        localStorage.removeItem(TOKEN_KEY);
        set({ isLoggedIn: false, userEmail: null });
      }
    } catch {
      // Network error — keep logged-out state
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");

      localStorage.setItem(TOKEN_KEY, data.token);
      useProfileStore.getState().setName(data.name);
      set({ isLoggedIn: true, userEmail: data.email, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");

      localStorage.setItem(TOKEN_KEY, data.token);
      useProfileStore.getState().setName(data.name);
      set({ isLoggedIn: true, userEmail: data.email, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    localStorage.removeItem(TOKEN_KEY);
    set({ isLoggedIn: false, userEmail: null, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
