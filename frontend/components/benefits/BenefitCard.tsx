"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarCheck,
  HeartHandshake,
  Home,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type BenefitIconKey = "home" | "shield" | "heart" | "calendar";

const iconMap: Record<BenefitIconKey, LucideIcon> = {
  home: Home,
  shield: ShieldCheck,
  heart: HeartHandshake,
  calendar: CalendarCheck,
};

interface BenefitCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: BenefitIconKey;
  featured?: boolean;
}

export default function BenefitCard({
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  featured = false,
}: BenefitCardProps) {
  const [imageError, setImageError] = useState(false);
  const Icon = iconMap[icon];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-2xl ${
        featured ? "md:min-h-[420px]" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-64 sm:h-72" : "h-56 sm:h-60"}`}>
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Icon className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
            </div>
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImageError(true)}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent" />

        <div className="absolute start-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg ring-4 ring-white/90 transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-8 pt-7 sm:px-8">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}
