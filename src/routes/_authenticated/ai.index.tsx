import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AstrologerMark } from "@/components/ai/AstrologerMark";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createThread } from "@/lib/ai/threads";
import { birthProfilesQuery } from "@/lib/birth-profiles";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/ai/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(birthProfilesQuery()),
  component: NewChat,
});

const GENERAL = "__general__";

function NewChat() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: all } = useSuspenseQuery(birthProfilesQuery());
  const profiles = all.filter((p) => !p.archived_at);
  const [choice, setChoice] = useState<string>(profiles[0]?.id ?? GENERAL);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    setBusy(true);
    try {
      const id = await createThread(choice === GENERAL ? null : choice);
      await qc.invalidateQueries({ queryKey: ["ai_threads"] });
      await navigate({ to: "/ai/$threadId", params: { threadId: id } });
    } catch (e) {
      console.error(e);
      toast.error(t("aiErrSave"));
      setBusy(false);
    }
  };

  return (
    <section className="flex min-h-[24rem] flex-col items-center justify-center gap-5 rounded-2xl border bg-card p-6 text-center shadow-card">
      <AstrologerMark className="size-16 text-primary" />
      <div className="w-full max-w-sm space-y-1.5 text-left">
        <Label className="text-xs">{t("aiProfile")}</Label>
        <Select value={choice} onValueChange={setChoice}>
          <SelectTrigger aria-label={t("aiProfile")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} · {p.birth_date}
              </SelectItem>
            ))}
            <SelectItem value={GENERAL}>{t("aiGeneral")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={start} disabled={busy} className="min-w-40">
        {busy && <Loader2 className="size-4 animate-spin" />} {t("aiStart")}
      </Button>
      <p className="max-w-md text-xs text-muted-foreground">{t("aiDisclaimer")}</p>
    </section>
  );
}
