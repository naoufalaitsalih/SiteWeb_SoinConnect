"use client";



export const ANALYTICS_EVENT_TYPES = [

  "page_view",

  "button_click",

  "form_start",

  "form_submit",

  "form_error",

  "api_error",

] as const;



export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];



export type TrackPayload = {

  eventType: AnalyticsEventType;

  pageUrl?: string;

  elementName?: string;

  metadata?: Record<string, unknown>;

};



const SESSION_KEY = "sc_session_id";



function isBrowser(): boolean {

  return typeof window !== "undefined";

}



export function getSessionId(): string {

  if (!isBrowser()) return "";



  let id = sessionStorage.getItem(SESSION_KEY);

  if (!id) {

    id = crypto.randomUUID();

    sessionStorage.setItem(SESSION_KEY, id);

  }

  return id;

}



export function getLocaleFromPath(): string {

  if (!isBrowser()) return "fr";

  const match = window.location.pathname.match(/^\/(fr|ar)(\/|$)/);

  return match?.[1] ?? document.documentElement.lang ?? "fr";

}



export function parseUserAgent(ua: string) {

  const lower = ua.toLowerCase();

  let browser = "unknown";

  let os = "unknown";

  let deviceType = "desktop";



  if (lower.includes("edg/")) browser = "Edge";

  else if (lower.includes("chrome/") && !lower.includes("chromium")) browser = "Chrome";

  else if (lower.includes("firefox/")) browser = "Firefox";

  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";



  if (lower.includes("windows")) os = "Windows";

  else if (lower.includes("mac os") || lower.includes("macintosh")) os = "macOS";

  else if (lower.includes("android")) os = "Android";

  else if (lower.includes("iphone") || lower.includes("ipad")) os = "iOS";

  else if (lower.includes("linux")) os = "Linux";



  if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android")) {

    deviceType = "mobile";

  } else if (lower.includes("ipad") || lower.includes("tablet")) {

    deviceType = "tablet";

  }



  return { browser, os, deviceType };

}



function buildPayload(

  eventType: AnalyticsEventType,

  extra: Omit<TrackPayload, "eventType"> = {}

) {

  const ua = isBrowser() ? navigator.userAgent : "";

  const parsed = parseUserAgent(ua);



  return {

    eventType,

    pageUrl: extra.pageUrl ?? (isBrowser() ? window.location.pathname : undefined),

    elementName: extra.elementName,

    sessionId: getSessionId(),

    userAgent: ua || undefined,

    browser: parsed.browser,

    os: parsed.os,

    deviceType: parsed.deviceType,

    referrer: isBrowser() && document.referrer ? document.referrer : undefined,

    locale: getLocaleFromPath(),

    timezone: isBrowser()

      ? Intl.DateTimeFormat().resolvedOptions().timeZone

      : undefined,

    metadata: extra.metadata,

  };

}



export async function trackEvent(

  eventType: AnalyticsEventType,

  extra: Omit<TrackPayload, "eventType"> = {}

): Promise<void> {

  if (!isBrowser()) return;



  try {
    const { createLog } = await import("@/lib/api");
    await createLog(buildPayload(eventType, extra));
  } catch {

    // Analytics silencieux — ne pas perturber l'UX

  }

}



export function trackPageView(pageUrl?: string) {

  return trackEvent("page_view", { pageUrl });

}



export function trackButtonClick(elementName: string, pageUrl?: string) {

  return trackEvent("button_click", { elementName, pageUrl });

}



export function trackFormStart(formName: string) {

  return trackEvent("form_start", { elementName: formName });

}



export function trackFormSubmit(formName: string) {

  return trackEvent("form_submit", { elementName: formName });

}



export function trackFormError(formName: string, metadata?: Record<string, unknown>) {

  return trackEvent("form_error", { elementName: formName, metadata });

}



export function trackApiError(endpoint: string, status?: number) {

  return trackEvent("api_error", {

    metadata: { endpoint, status },

  });

}

