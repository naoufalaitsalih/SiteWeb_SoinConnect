"use client";

import {
  NextIntlClientProvider,
  AbstractIntlMessages,
  IntlErrorCode,
} from "next-intl";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { APP_TIME_ZONE } from "@/lib/env";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function LocaleProviders({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={APP_TIME_ZONE}
      onError={(error) => {
        if (
          error.code === IntlErrorCode.MISSING_MESSAGE ||
          error.code === IntlErrorCode.ENVIRONMENT_FALLBACK
        ) {
          return;
        }
        console.error(error);
      }}
      getMessageFallback={({ namespace, key, error }) => {
        const path = [namespace, key].filter(Boolean).join(".");
        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
          return path;
        }
        return path;
      }}
    >
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </NextIntlClientProvider>
  );
}
