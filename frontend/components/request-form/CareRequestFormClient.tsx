"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import CareTypeSelector from "@/components/request-form/CareTypeSelector";
import UrgencySelector from "@/components/request-form/UrgencySelector";
import { submitCareRequest } from "@/lib/api";
import {
  trackFormError,
  trackFormStart,
  trackFormSubmit,
  trackApiError,
} from "@/lib/analytics";
import { validateCareRequestForm } from "@/lib/validation";
import {
  ApiResponse,
  CareRequestFormData,
  initialFormData,
} from "@/types/care-request";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function CareRequestFormClient() {
  const t = useTranslations("form");
  const [formData, setFormData] = useState<CareRequestFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CareRequestFormData, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formStartedRef = useRef(false);

  useEffect(() => {
    function handleFormStart() {
      if (formStartedRef.current) return;
      formStartedRef.current = true;
      trackFormStart("care_request");
    }

    const form = document.getElementById("care-request-form");
    form?.addEventListener("focusin", handleFormStart);
    return () => form?.removeEventListener("focusin", handleFormStart);
  }, []);
  const validationMessages = useMemo(
    () => ({
      fullName: t("errors.fullName"),
      phone: t("errors.phone"),
      email: t("errors.email"),
      address: t("errors.address"),
      careType: t("errors.careType"),
      requestedDate: t("errors.requestedDate"),
      requestedTime: t("errors.requestedTime"),
    }),
    [t]
  );

  const updateField = <K extends keyof CareRequestFormData>(
    field: K,
    value: CareRequestFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerMessage("");

    const validation = validateCareRequestForm(formData, validationMessages);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setStatus("error");
      setServerMessage(t("errors.formInvalid"));
      trackFormError("care_request", { reason: "client_validation" });
      return;
    }
    setStatus("loading");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        careType: formData.careType,
        description: formData.description.trim() || undefined,
        requestedDate: formData.requestedDate,
        requestedTime: formData.requestedTime,
        isUrgent: formData.isUrgent,
      };

      await submitCareRequest(payload);
      trackFormSubmit("care_request");
      setStatus("success");      setServerMessage(t("errors.success"));
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      const apiError = err as ApiResponse;
      setStatus("error");

      if (apiError.errors?.length) {
        const fieldErrors: Partial<Record<keyof CareRequestFormData, string>> = {};
        apiError.errors.forEach((error) => {
          const field = error.field as keyof CareRequestFormData;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      }

      setServerMessage(apiError.message ?? t("errors.generic"));
      trackApiError("/api/requests", apiError.errors?.length ? 400 : 500);
      trackFormError("care_request", {
        reason: "server_error",
        status: apiError.errors?.length ? 400 : undefined,
      });
    }  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {status === "success" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800"
        >
          <div className="flex items-start gap-3 font-medium">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" strokeWidth={2} />
            <span>{serverMessage}</span>
          </div>
        </div>
      )}

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {serverMessage}
        </div>
      )}

      <form
        id="care-request-form"
        onSubmit={handleSubmit}        className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-xl sm:p-8"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="label-field">
              {t("fullName")} <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              className={`input-field ${errors.fullName ? "input-error" : ""}`}
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder={t("placeholders.fullName")}
            />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="label-field">
              {t("phone")} <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              className={`input-field ${errors.phone ? "input-error" : ""}`}
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder={t("placeholders.phone")}
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="label-field">
              {t("email")}{" "}
              <span className="font-normal text-slate-400">{t("optional")}</span>
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              className={`input-field ${errors.email ? "input-error" : ""}`}
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder={t("placeholders.email")}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="label-field">
              {t("address")} <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              className={`input-field ${errors.address ? "input-error" : ""}`}
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder={t("placeholders.address")}
            />
            {errors.address && <p className="error-message">{errors.address}</p>}
          </div>

          <div className="sm:col-span-2">
            <CareTypeSelector
              value={formData.careType}
              onChange={(value) => updateField("careType", value)}
              error={errors.careType}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="label-field">
              {t("description")}{" "}
              <span className="font-normal text-slate-400">{t("optional")}</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="input-field resize-none"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="requestedDate" className="label-field">
              {t("requestedDate")} <span className="text-red-500">*</span>
            </label>
            <input
              id="requestedDate"
              type="date"
              min={today}
              dir="ltr"
              className={`input-field ${errors.requestedDate ? "input-error" : ""}`}
              value={formData.requestedDate}
              onChange={(e) => updateField("requestedDate", e.target.value)}
            />
            {errors.requestedDate && (
              <p className="error-message">{errors.requestedDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="requestedTime" className="label-field">
              {t("requestedTime")} <span className="text-red-500">*</span>
            </label>
            <input
              id="requestedTime"
              type="time"
              dir="ltr"
              className={`input-field ${errors.requestedTime ? "input-error" : ""}`}
              value={formData.requestedTime}
              onChange={(e) => updateField("requestedTime", e.target.value)}
            />
            {errors.requestedTime && (
              <p className="error-message">{errors.requestedTime}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <UrgencySelector
              value={formData.isUrgent}
              onChange={(isUrgent) => updateField("isUrgent", isUrgent)}
            />
          </div>
        </div>

        <button
          type="submit"
          data-track="care_request_submit"
          disabled={status === "loading"}          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "loading" ? t("submitting") : t("submit")}
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
          {t("disclaimer")}
        </p>
      </form>
    </div>
  );
}
