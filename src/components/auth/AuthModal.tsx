import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { TbX } from "react-icons/tb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import ShinyText from "@/components/reactbits/ShinyText";
import { useTranslation } from "react-i18next";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "register",
}: AuthModalProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                dir={isRtl ? "rtl" : "ltr"}>
                <div className="relative w-full max-w-md backdrop-blur-2xl bg-[#0A1018]/95 border border-white/[0.10] rounded-2xl p-6 shadow-2xl shadow-black/60">
                  {/* Close button */}
                  <DialogPrimitive.Close className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <TbX className="w-4 h-4" />
                  </DialogPrimitive.Close>

                  {/* Title */}
                  <div className="text-center mb-5">
                    <DialogPrimitive.Title asChild>
                      <ShinyText
                        text={t("auth.welcomeTitle")}
                        speed={4}
                        color="#6B7280"
                        shineColor="#FFFFFF"
                        className="text-xl font-bold font-arabic"
                      />
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="font-arabic text-xs text-white/40 mt-1.5">
                      {t("auth.welcomeDesc")}
                    </DialogPrimitive.Description>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue={defaultTab}>
                    <TabsList className="w-full mb-5 bg-white/[0.06] border border-white/[0.10]">
                      <TabsTrigger
                        value="login"
                        className="flex-1 font-arabic data-[state=active]:bg-teal-500/20 data-[state=active]:text-white text-white/50">
                        {t("auth.login")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="flex-1 font-arabic data-[state=active]:bg-teal-500/20 data-[state=active]:text-white text-white/50">
                        {t("auth.newAccount")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                      <RegisterForm />
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
