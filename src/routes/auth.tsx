import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitch } from "@/components/app/LanguageSwitch";
import { LogoMark } from "@/components/app/Logo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ప్రవేశం — జ్యోతిష దర్పణం" },
      { name: "description", content: "Sign in or create your Jyotisha Darpanam account to save birth profiles and charts." },
      { property: "og:title", content: "Sign in — Jyotisha Darpanam" },
      { property: "og:description", content: "Sign in to save birth profiles and calculate Vedic charts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function GoogleG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18 }}>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) setNotice(t("checkEmail"));
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice(t("resetSent"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("somethingWrong"));
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "lovable") => {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
  };

  return (
    <div className="grid min-h-screen bg-hero md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-kumkum p-10 text-primary-foreground md:flex">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="font-display text-xl font-semibold">{t("appName")}</span>
        </Link>
        <blockquote className="max-w-md font-display text-2xl leading-relaxed">
          “{t("heroBody")}”
        </blockquote>
        <div className="kolam-border w-40" />
      </div>
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-between md:justify-end">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <LogoMark className="size-8" />
          </Link>
          <LanguageSwitch />
        </div>
        <div className="m-auto w-full max-w-sm animate-rise">
          <h1 className="mb-6 text-3xl font-bold">
            {mode === "signin" ? t("signIn") : mode === "signup" ? t("signUp") : t("forgotPassword")}
          </h1>
          {mode !== "forgot" && (
            <>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => oauth("google")}
                  className="flex h-10 w-full items-center justify-center gap-[10px] rounded-md border px-3 text-sm font-medium"
                  style={{ background: "#FFFFFF", borderColor: "#747775", color: "#1F1F1F" }}
                >
                  <GoogleG />
                  {t("continueWithGoogle")}
                </button>
                <Button type="button" variant="outline" className="h-10 w-full" onClick={() => oauth("lovable")}>
                  <LovableMark className="size-[18px]" />
                  {t("continueWithLovable")}
                </Button>
              </div>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("or")}
                <span className="h-px flex-1 bg-border" />
              </div>
            </>
          )}
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  {mode === "signin" && (
                    <button type="button" className="text-xs text-primary hover:underline" onClick={() => setMode("forgot")}>
                      {t("forgotPassword")}
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            {notice && <p className="rounded-md border border-gold/40 bg-accent/50 p-3 text-sm">{notice}</p>}
            <Button type="submit" variant="hero" className="h-10 w-full" disabled={busy}>
              {mode === "signin" ? t("signIn") : mode === "signup" ? t("signUp") : t("sendResetLink")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                {t("noAccount")}{" "}
                <button className="font-medium text-primary hover:underline" onClick={() => setMode("signup")}>
                  {t("signUp")}
                </button>
              </>
            ) : mode === "signup" ? (
              <>
                {t("haveAccount")}{" "}
                <button className="font-medium text-primary hover:underline" onClick={() => setMode("signin")}>
                  {t("signIn")}
                </button>
              </>
            ) : (
              <button className="font-medium text-primary hover:underline" onClick={() => setMode("signin")}>
                {t("backToSignIn")}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
