# Rapport rebrand — NURIA

**Date :** 11 juillet 2026  
**Périmètre :** Branding / style uniquement (frontend)  
**Build :** `npm run build` ✓

## Résumé

Le site public est désormais marqué **NURIA**. Aucun changement de fonctionnement (sections, WhatsApp, i18n FR/AR).

## Nouvelles couleurs

| Rôle | Hex | Token |
|------|-----|--------|
| Vert principal | `#009493` | `nuria` |
| Vert foncé | `#006F6E` | `nuria-dark` |
| Vert clair | `#E6F5F5` | `nuria-soft` |
| Rose accent | `#FFB6A6` | `nuria-rose` |
| Rose très clair | `#FFF1ED` | `nuria-rose-soft` |
| Fond | `#F7FBFB` | `nuria-bg` |
| Texte | `#10212A` | `nuria-ink` |
| Footer | `#063B3A` | `nuria-footer` |

## Logo

- `components/ui/Logo.tsx` — SVG (deux silhouettes reliées) + wordmark NURIA
- `components/BrandLogo.tsx` — wrapper (sizes, variants, tagline)
- `app/icon.svg` — favicon NURIA
- Toujours `dir="ltr"`

## Mentions remplacées

- SoinsConnect → NURIA (messages FR/AR, metadata, WhatsApp prefill, layout siteName, README)
- Conservé volontairement : email `soinsconnect.maroc@gmail.com`, URLs réseaux sociaux existantes, numéro WhatsApp

## Fichiers clés modifiés

- `tailwind.config.js`, `app/globals.css`, `app/icon.svg`
- `components/ui/Logo.tsx`, `BrandLogo.tsx`, `BrandLogoLink.tsx`, `BrandLogoMark.tsx`
- `Header.tsx`, `HeroSection.tsx`, `Footer.tsx` + sections/composants couleur
- `messages/fr.json`, `messages/ar.json`
- `lib/whatsapp.ts`, `lib/site-url.ts`, `app/[locale]/layout.tsx`
- `README.md`, `package.json` (`nuria-frontend`)
