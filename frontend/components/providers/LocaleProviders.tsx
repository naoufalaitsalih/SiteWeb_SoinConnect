"use client";

import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function LocaleProviders({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </NextIntlClientProvider>
  );
}
