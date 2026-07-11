"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  HeartHandshake,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

export type ServiceIconKey = "stethoscope" | "heartHandshake" | "heartPulse";

const iconMap = {
  stethoscope: Stethoscope,
  heartHandshake: HeartHandshake,
  heartPulse: HeartPulse,
} as const;

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: ServiceIconKey;
  features: string[];
}

export default function ServiceCard({
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  features,
}: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  const Icon = iconMap[icon];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100/80 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-nuria/25 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden sm:h-60">
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-slate-900/5 to-transparent" />

        <div className="absolute -bottom-5 start-6 z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-nuria text-white shadow-xl ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-7 pt-9">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>

        <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nuria-soft text-nuria">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
