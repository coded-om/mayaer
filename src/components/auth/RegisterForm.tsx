import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLoader2, TbMail, TbLock, TbUser } from "react-icons/tb";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

export function RegisterForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t("auth.nameMin2")),
          email: z
            .string()
            .min(1, t("auth.emailRequired"))
            .email(t("auth.emailInvalid")),
          password: z.string().min(8, t("auth.passwordMin8")),
          confirmPassword: z.string().min(1, t("auth.confirmRequired")),
        })
        .refine((d) => d.password === d.confirmPassword, {
          message: t("auth.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  type FormData = z.infer<typeof schema>;
  const navigate = useNavigate();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    clearError();
    try {
      await registerUser(data.email, data.password, data.name);
      navigate("/dashboard");
    } catch {
      // error shown via store.error
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      dir={isRtl ? "rtl" : "ltr"}>
      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300 font-arabic">
          {error}
        </motion.div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="font-arabic text-sm text-white/70 block">
          {t("auth.name")}
        </label>
        <div className="relative">
          <TbUser className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            {...register("name")}
            type="text"
            placeholder={t("auth.namePlaceholder")}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-400 font-arabic">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="font-arabic text-sm text-white/70 block">
          {t("auth.email")}
        </label>
        <div className="relative">
          <TbMail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            {...register("email")}
            type="email"
            placeholder="example@email.com"
            dir="ltr"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400 font-arabic">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="font-arabic text-sm text-white/70 block">
          {t("auth.password")}
        </label>
        <div className="relative">
          <TbLock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            dir="ltr"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 font-arabic">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="font-arabic text-sm text-white/70 block">
          {t("auth.confirmPassword")}
        </label>
        <div className="relative">
          <TbLock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            dir="ltr"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-400/60 focus:bg-white/15 transition-all"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400 font-arabic">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500/30 border border-teal-400/40 py-3 text-sm font-semibold text-white font-arabic hover:bg-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (
          <TbLoader2 className="w-4 h-4 animate-spin" />
        ) : (
          t("auth.createAccount")
        )}
      </motion.button>
    </form>
  );
}
