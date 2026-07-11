import Image from "next/image";
import type { ReactNode } from "react";

interface ServiceDetailCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: ReactNode;
  features: string[];
}

export default function ServiceDetailCard({
  title,
  description,
  imageSrc,
  imageAlt,
  icon,
  features,
}: ServiceDetailCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-52 overflow-hidden sm:h-56">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
        <div className="absolute -bottom-5 start-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-nuria text-white shadow-glow">
          {icon}
        </div>
      </div>

      <div className="px-6 pb-6 pt-8">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>

        <ul className="mt-5 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-nuria-soft text-nuria">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
