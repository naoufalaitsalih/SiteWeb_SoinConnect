"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartPulse, Home, Stethoscope } from "lucide-react";

const CONTACT_IMAGE_SRC =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80";

interface WhatsAppContactVisualProps {
  imageAlt: string;
  badgeHomeCare: string;
  badgeSupport: string;
}

export default function WhatsAppContactVisual({
  imageAlt,
  badgeHomeCare,
  badgeSupport,
}: WhatsAppContactVisualProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -start-6 -top-6 h-40 w-40 rounded-full bg-nuria/25 blur-3xl" />
      <div className="pointer-events-none absolute -end-4 bottom-8 h-32 w-32 rounded-full bg-nuria-rose/30 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl">
        <div className="relative aspect-[4/5] min-h-[320px] sm:min-h-[400px] lg:aspect-auto lg:min-h-[480px]">
          {!imageError ? (
            <Image
              src={CONTACT_IMAGE_SRC}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-gradient-to-br from-nuria-soft via-nuria-rose-soft to-nuria-bg p-10 sm:min-h-[400px] lg:min-h-[480px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-nuria shadow-lg">
                <HeartPulse className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <p className="mt-6 max-w-xs text-center text-sm font-medium text-slate-600">
                {imageAlt}
              </p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-5 start-5 end-5 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-sm">
            <Home className="h-4 w-4 text-nuria" strokeWidth={2} />
            {badgeHomeCare}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-sm">
            <Stethoscope className="h-4 w-4 text-nuria" strokeWidth={2} />
            {badgeSupport}
          </span>
        </div>
      </div>
    </div>
  );
}
