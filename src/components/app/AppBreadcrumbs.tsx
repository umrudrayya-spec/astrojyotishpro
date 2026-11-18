import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { birthProfileQuery } from "@/lib/birth-profiles";
import { findNavForPath, type NavPath } from "@/lib/nav";
import { useI18n } from "@/lib/i18n";

/** Home › Category › Section [› profile name], derived from the current URL. */
export function AppBreadcrumbs() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const match = findNavForPath(pathname);
  const chartId = /^\/chart\/([^/]+)/.exec(pathname)?.[1];
  const { data: profile } = useQuery({ ...birthProfileQuery(chartId ?? ""), enabled: !!chartId });
  if (!match) return null;
  const atSection = pathname.replace(/\/+$/, "") === match.item.to;
  const crumbs: { label: string; to?: NavPath }[] = [];
  if (match.item.id !== "dashboard") crumbs.push({ label: t("breadcrumbHome"), to: "/dashboard" });
  crumbs.push({ label: t(match.group.label) });
  crumbs.push(atSection ? { label: t(match.item.label) } : { label: t(match.item.label), ...(match.item.to ? { to: match.item.to } : {}) });
  if (chartId && profile) crumbs.push({ label: profile.name });

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={`${c.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={last ? "min-w-0" : "hidden sm:inline-flex"}>
                {last || !c.to ? (
                  <BreadcrumbPage className={last ? "truncate" : "text-muted-foreground"}>{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={c.to}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
