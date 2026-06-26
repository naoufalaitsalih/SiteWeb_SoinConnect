import type { CareRequestPayload } from "@/types/care-request";

export const GOOGLE_FORM_SUCCESS_MESSAGE =
  "Votre demande a bien été envoyée. Nous vous contacterons après traitement.";

export const GOOGLE_FORM_ERROR_MESSAGE =
  "Impossible d'envoyer la demande. Veuillez réessayer ou nous contacter sur WhatsApp.";

export const WHATSAPP_FALLBACK_URL = "https://wa.me/212708321872";

type GoogleFormEntryIds = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  careType: string;
  description: string;
  requestedDate: string;
  requestedTime: string;
  isUrgent: string;
};

function getGoogleFormConfig(): {
  actionUrl: string;
  entries: GoogleFormEntryIds;
} {
  const actionUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL?.trim();

  const entries: GoogleFormEntryIds = {
    fullName: process.env.NEXT_PUBLIC_GF_FULL_NAME?.trim() ?? "",
    phone: process.env.NEXT_PUBLIC_GF_PHONE?.trim() ?? "",
    email: process.env.NEXT_PUBLIC_GF_EMAIL?.trim() ?? "",
    address: process.env.NEXT_PUBLIC_GF_ADDRESS?.trim() ?? "",
    careType: process.env.NEXT_PUBLIC_GF_CARE_TYPE?.trim() ?? "",
    description: process.env.NEXT_PUBLIC_GF_DESCRIPTION?.trim() ?? "",
    requestedDate: process.env.NEXT_PUBLIC_GF_REQUESTED_DATE?.trim() ?? "",
    requestedTime: process.env.NEXT_PUBLIC_GF_REQUESTED_TIME?.trim() ?? "",
    isUrgent: process.env.NEXT_PUBLIC_GF_IS_URGENT?.trim() ?? "",
  };

  if (!actionUrl) {
    throw new Error("NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL est manquant.");
  }

  const required = [
    ["NEXT_PUBLIC_GF_FULL_NAME", entries.fullName],
    ["NEXT_PUBLIC_GF_PHONE", entries.phone],
    ["NEXT_PUBLIC_GF_EMAIL", entries.email],
    ["NEXT_PUBLIC_GF_ADDRESS", entries.address],
    ["NEXT_PUBLIC_GF_CARE_TYPE", entries.careType],
    ["NEXT_PUBLIC_GF_DESCRIPTION", entries.description],
    ["NEXT_PUBLIC_GF_REQUESTED_DATE", entries.requestedDate],
    ["NEXT_PUBLIC_GF_REQUESTED_TIME", entries.requestedTime],
    ["NEXT_PUBLIC_GF_IS_URGENT", entries.isUrgent],
  ] as const;

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Variables Google Form manquantes : ${missing.join(", ")}`);
  }

  return { actionUrl, entries };
}

export async function submitCareRequestToGoogleForm(
  payload: CareRequestPayload
): Promise<void> {
  const { actionUrl, entries } = getGoogleFormConfig();

  const formData = new FormData();
  formData.append(entries.fullName, payload.fullName);
  formData.append(entries.phone, payload.phone);
  formData.append(entries.email, payload.email ?? "");
  formData.append(entries.address, payload.address);
  formData.append(entries.careType, payload.careType);
  formData.append(entries.description, payload.description ?? "");
  formData.append(entries.requestedDate, payload.requestedDate);
  formData.append(entries.requestedTime, payload.requestedTime);
  formData.append(entries.isUrgent, payload.isUrgent ? "Oui" : "Non");

  await fetch(actionUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });
}
