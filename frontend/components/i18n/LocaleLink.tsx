"use client";

import { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
};

export default function LocaleLink({
  children,
  href = "/",
  className,
}: Props) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
