import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sileo";
import { useTranslation } from "react-i18next";
import { router } from "./router";
import { useAuthStore } from "@/store/authStore";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}
