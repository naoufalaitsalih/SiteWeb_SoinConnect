import {
  CareRequestFormData,
  FormValidationMessages,
} from "@/types/care-request";

type ValidationResult = {
  isValid: boolean;
  errors: Partial<Record<keyof CareRequestFormData, string>>;
};

const phoneRegex = /^[\d\s+().-]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCareRequestForm(
  data: CareRequestFormData,
  messages: FormValidationMessages
): ValidationResult {
  const errors: Partial<Record<keyof CareRequestFormData, string>> = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = messages.fullName;
  } else if (data.fullName.trim().length > 255) {
    errors.fullName = messages.fullName;
  }

  if (!data.phone.trim() || !phoneRegex.test(data.phone.trim())) {
    errors.phone = messages.phone;
  }

  if (data.email.trim() && !emailRegex.test(data.email.trim())) {
    errors.email = messages.email;
  }

  if (!data.address.trim() || data.address.trim().length < 5) {
    errors.address = messages.address;
  } else if (data.address.trim().length > 1000) {
    errors.address = messages.address;
  }

  if (!data.careType) {
    errors.careType = messages.careType;
  }

  if (data.description.trim().length > 2000) {
    errors.description = messages.careType;
  }

  if (!data.requestedDate) {
    errors.requestedDate = messages.requestedDate;
  }

  if (!data.requestedTime) {
    errors.requestedTime = messages.requestedTime;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
