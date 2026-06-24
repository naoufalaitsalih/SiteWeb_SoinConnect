"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { fetchAdminDemandes } from "@/lib/admin-demandes-api";
import type { Demande } from "@/lib/admin-types";
import { CareRequest } from "@/types/care-request";
import RequestsTable from "@/components/admin/RequestsTable";

type PageState = "loading" | "success" | "error" | "empty";

function mapDemandeToCareRequest(d: Demande): CareRequest {
  const statusMap: Record<string, CareRequest["status"]> = {
    en_attente: "pending",
    acceptee: "completed",
    refusee: "cancelled",
  };

  return {
    id: d.id,
    fullName: d.patient,
    phone: d.phone,
    email: d.email,
    address: d.address,
    careType: d.careType,
    description: d.description,
    requestedDate: d.requestedDate,
    requestedTime: d.requestedTime,
    isUrgent: d.isUrgent,
    status: statusMap[d.status] ?? "pending",
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export default function AdminRequestsPage() {
  const t = useTranslations("admin");
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [state, setState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRequests = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const { demandes, error } = await fetchAdminDemandes();

      if (error) {
        setErrorMessage(error);
        setState("error");
        return;
      }

      const data = demandes.map(mapDemandeToCareRequest);

      if (data.length === 0) {
        setRequests([]);
        setState("empty");
      } else {
        setRequests(data);
        setState("success");
      }
    } catch {
      setErrorMessage(t("errorBackend"));
      setState("error");
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section-container py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-3">
          {state === "success" && (
            <span className="rounded-full bg-medical-100 px-3 py-1 text-xs font-semibold text-medical-700">
              {t("requestCount", { count: requests.length })}
            </span>
          )}
          <button
            type="button"
            onClick={fetchRequests}
            disabled={state === "loading"}
            className="btn-secondary text-xs disabled:opacity-60"
          >
            {state === "loading" ? t("loading") : t("refresh")}
          </button>
        </div>
      </div>

      {state === "loading" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-medical-200 border-t-medical-600" />
          <p className="mt-4 text-sm text-slate-600">{t("loadingRequests")}</p>
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-card">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="font-semibold text-red-800">{t("errorTitle")}</h2>
              <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
              <p className="mt-2 text-xs text-red-600">
                {t("errorBackendHint")}{" "}
                <code className="rounded bg-red-100 px-1">/api/admin/demandes</code>
              </p>
              <button
                type="button"
                onClick={fetchRequests}
                className="btn-primary mt-4 text-xs"
              >
                {t("retry")}
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "empty" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-slate-700">
            {t("emptyTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t("emptySubtitle")}</p>
          <Link href="/#request-form" className="btn-primary mt-6 text-sm">
            {t("viewForm")}
          </Link>
        </div>
      )}

      {state === "success" && <RequestsTable requests={requests} />}
    </div>
  );
}
