"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Clock, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

export type FloatCard = {
  key: string;
  title: string;
  subtitle: string;
  icon: "clock" | "shield" | "sparkles";
};

interface HeroVisualProps {
  cards: FloatCard[];
  imageAlt: string;
}

const iconMap = {
  clock: Clock,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

const HERO_IMAGE_SRC = "/images/hero-care-professional.jpg";

export default function HeroVisual({ cards, imageAlt }: HeroVisualProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full">
      <div className="hero-blob pointer-events-none absolute -end-8 -top-10 h-56 w-56 rounded-full bg-nuria/20 blur-3xl" />
      <div className="hero-blob-slow pointer-events-none absolute -bottom-12 -start-6 h-48 w-48 rounded-full bg-nuria-rose/20 blur-3xl" />
      <div className="pointer-events-none absolute end-1/4 top-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-nuria/25 to-nuria-rose-soft blur-2xl" />

      <div className="relative mx-auto max-w-xl lg:max-w-none">
        <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-nuria-soft via-nuria-soft to-nuria-bg opacity-90 blur-sm" />
        <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-nuria-rose/30 to-transparent" />

        <div className="relative h-[380px] overflow-hidden rounded-[32px] shadow-2xl transition-all duration-300 sm:h-[480px] lg:h-[580px]">
          {imageError ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <HeartPulse
                  className="h-8 w-8 text-slate-400"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Illustration temporairement indisponible
              </p>
            </div>
          ) : (
            <Image
              src={HERO_IMAGE_SRC}
              alt={imageAlt}
              fill
              className="object-cover object-[28%_center] sm:object-[32%_center]"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              onError={() => setImageError(true)}
            />
          )}
          {!imageError && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-slate-900/20" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-900/10 via-slate-900/15 to-slate-900/35" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-slate-900/5" />
            </>
          )}
        </div>

        <div className="absolute -end-2 top-8 z-20 hidden flex-col gap-4 xl:flex">
          {cards.map((card, index) => {
            const Icon = iconMap[card.icon];
            return (
              <div
                key={card.key}
                className="w-60 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ marginInlineStart: index % 2 === 1 ? "1.5rem" : "0" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nuria-soft text-nuria">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-nuria"
                        strokeWidth={3}
                      />
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:hidden">
        {cards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nuria-soft text-nuria">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-nuria"
                      strokeWidth={3}
                    />
                    {card.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
