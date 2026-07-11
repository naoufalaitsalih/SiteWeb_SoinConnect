export const WHATSAPP_PHONE = "212708321872";

const WHATSAPP_PREFILL: Record<"fr" | "ar", string> = {
  fr: "Bonjour NURIA, je souhaite demander un soin à domicile. Voici mon besoin :",
  ar: "مرحباً NURIA، أرغب في طلب رعاية منزلية. إليك احتياجي :",
};

export function getWhatsAppContactUrl(locale: string): string {
  const message = locale === "ar" ? WHATSAPP_PREFILL.ar : WHATSAPP_PREFILL.fr;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
