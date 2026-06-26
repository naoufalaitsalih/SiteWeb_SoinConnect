/** Analytics désactivé — site frontend uniquement. */

export type AnalyticsEventType =
  | "page_view"
  | "button_click"
  | "form_start"
  | "form_submit"
  | "form_error";

export function trackPageView(_pageUrl?: string) {
  return;
}

export function trackButtonClick(_elementName: string) {
  return;
}

export function trackFormStart(_formName: string) {
  return;
}

export function trackFormSubmit(_formName: string) {
  return;
}

export function trackFormError(
  _formName: string,
  _metadata?: Record<string, unknown>
) {
  return;
}
