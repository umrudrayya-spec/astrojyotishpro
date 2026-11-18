import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "పాస్‌వర్డ్ రీసెట్ — ఆస్ట్రోజ్యోతిష్ ప్రో" },
      { name: "description", content: "Set a new password for your AstroJyotish Pro account." },
      { property: "og:title", content: "Reset password — AstroJyotish Pro" },
      { property: "og:description", content: "Set a new password for your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("passwordUpdated"));
    void navigate({ to: "/dashboard" });
  };
  return (
    <div className="grid min-h-screen place-items-center bg-hero p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold">{t("updatePassword")}</h1>
        <div className="space-y-1.5">
          <Label htmlFor="pw">{t("newPassword")}</Label>
          <Input id="pw" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {t("updatePassword")}
        </Button>
      </form>
    </div>
  );
}
