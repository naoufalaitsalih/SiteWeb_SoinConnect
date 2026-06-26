export const WHATSAPP_PHONE = "212708321872";

const WHATSAPP_PREFILL: Record<"fr" | "ar", string> = {
  fr: "Bonjour SoinsConnect, je souhaite demander un soin à domicile. Voici mon besoin :",
  ar: "مرحباً SoinsConnect، أرغب في طلب رعاية منزلية. إليك احتياجي :",
};

export function getWhatsAppContactUrl(locale: string): string {
  const message = locale === "ar" ? WHATSAPP_PREFILL.ar : WHATSAPP_PREFILL.fr;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Lien FR exact pour référence / tests */
export const WHATSAPP_CONTACT_URL_FR =
  "https://wa.me/212708321872?text=Bonjour%20SoinsConnect%2C%20je%20souhaite%20demander%20un%20soin%20%C3%A0%20domicile.%20Voici%20mon%20besoin%20%3A";
