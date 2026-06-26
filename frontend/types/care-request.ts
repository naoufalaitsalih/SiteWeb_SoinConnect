export type CareRequestFormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  careType: string;
  description: string;
  requestedDate: string;
  requestedTime: string;
  isUrgent: boolean;
};

export type CareRequestPayload = Omit<CareRequestFormData, "email" | "description"> & {
  email?: string;
  description?: string;
};

export const CARE_TYPE_KEYS = [
  "nursing",
  "personalCare",
  "postOp",
  "senior",
  "specialized",
  "other",
] as const;

export type CareTypeKey = (typeof CARE_TYPE_KEYS)[number];

export const CARE_TYPE_API_VALUES: Record<CareTypeKey, string> = {
  nursing: "Soins infirmiers",
  personalCare: "Aide à la personne",
  postOp: "Suivi post-opératoire",
  senior: "Accompagnement senior",
  specialized: "Soins spécialisés",
  other: "Autre besoin",
};

export const initialFormData: CareRequestFormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  careType: "",
  description: "",
  requestedDate: "",
  requestedTime: "",
  isUrgent: false,
};

export type FormValidationMessages = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  careType: string;
  requestedDate: string;
  requestedTime: string;
};
