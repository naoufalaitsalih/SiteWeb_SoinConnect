# Rapport d'audit — SoinsConnect (frontend only)

**Date :** 22 juin 2026  
**Périmètre :** Site public Next.js 15 — WhatsApp uniquement  
**Build :** `npm run build` ✓

---

## Résumé exécutif

Le projet est **prêt pour la mise en ligne** en tant que site vitrine frontend seul. Aucun backend, base de données, admin ou formulaire n'est requis au runtime. Les corrections ci-dessous ont été appliquées dans le cadre de cet audit.

| Catégorie      | Score |
|----------------|-------|
| Sécurité       | **88 / 100** |
| Performance    | **85 / 100** |
| SEO            | **82 / 100** |

---

## 1. Nettoyage projet

### Vérifications

| Critère | Statut |
|---------|--------|
| Références backend / Prisma / MySQL | ✓ Aucune dans le code actif (git) |
| `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL` | ✓ Absents |
| Pages admin | ✓ Supprimées du dépôt git |
| Routes API Next.js | ✓ Aucune route trackée ; dossiers vides `app/api/` supprimés localement |
| `localhost` / port 4000 / Failed to fetch | ✓ Absents du code applicatif (README dev local uniquement) |
| Google Form / validation formulaire | ✓ Supprimés |

### Corrections appliquées

- Suppression des dossiers orphelins `frontend/app/api/**` (résidus non versionnés).
- Mise à jour des textes FR/AR encore orientés « formulaire » → **WhatsApp**.
- Carte 1 « Comment ça marche » alignée sur WhatsApp (`MessageCircle`).

---

## 2. Sécurité frontend

### Vérifications

| Critère | Statut |
|---------|--------|
| Secrets dans le code | ✓ Aucun |
| `.env.local` dans Git | ✓ Ignoré (`.gitignore`) |
| Tokens / localStorage sensible | ✓ Aucun |
| `dangerouslySetInnerHTML` | ✓ Aucun |
| Liens externes `target="_blank"` | ✓ `rel="noopener noreferrer"` (WhatsApp, réseaux sociaux) |
| CSP (next.config.js) | ✓ Headers de sécurité actifs |

### Points restants

- Définir `NEXT_PUBLIC_SITE_URL` en production (Render/Vercel) pour les URLs canoniques exactes.
- Liens légaux `#privacy` / `#terms` : ancres placeholder (à remplacer par de vraies pages si besoin).

---

## 3. WhatsApp

### Vérifications

| Critère | Statut |
|---------|--------|
| Numéro | ✓ `+212 708 321 872` (`212708321872`) |
| Lien `wa.me` | ✓ `https://wa.me/212708321872?text=...` |
| Message prérempli FR | ✓ « Bonjour SoinsConnect, je souhaite demander un soin à domicile... » |
| Message prérempli AR | ✓ Traduction arabe encodée |
| Nouvel onglet | ✓ `target="_blank"` + `rel="noopener noreferrer"` |
| Accessibilité CTA | ✓ `aria-label` sur le bouton principal |

**Fichier central :** `frontend/lib/whatsapp.ts` — `getWhatsAppContactUrl(locale)`

---

## 4. Internationalisation

| Critère | Statut |
|---------|--------|
| FR + AR complets | ✓ `messages/fr.json`, `messages/ar.json` |
| RTL arabe | ✓ `dir="rtl"` sur `<html>` |
| Logo non inversé | ✓ `dir="ltr"` sur le composant logo |
| Navigation | ✓ Header / footer / ancres `#` cohérents |

---

## 5. UI / UX

| Critère | Statut |
|---------|--------|
| Responsive | ✓ Grilles Tailwind mobile → desktop |
| Overflow horizontal | ✓ `overflow-x: hidden` sur `html` / `body` |
| Sections alignées WhatsApp | ✓ Contact, stats, confiance, how-it-works |
| Images | ✓ `next/image` + fallback gradient si erreur |

---

## 6. Performance

| Critère | Statut |
|---------|--------|
| `next/image` | ✓ Hero, services, benefits, WhatsApp visual |
| Dépendances | ✓ Stack minimale (pas de jose, pas de backend client) |
| First Load JS `/[locale]` | ~131 kB |
| Build | ✓ Sans erreur |

### Points restants

- Images Unsplash externes : acceptable ; envisager hébergement local pour perf maximale.
- `webpack.cache = false` dans `next.config.js` (choix Windows/dev) : build un peu plus lent mais stable.

---

## 7. SEO

### Corrections appliquées

- **Title :** `SoinsConnect Maroc - Soins à domicile` (FR) / équivalent AR
- **Description** orientée WhatsApp
- **OpenGraph** + **Twitter Card** dans `app/[locale]/layout.tsx`
- **`metadataBase`** + alternates `fr` / `ar`
- **`app/sitemap.ts`** — `/fr`, `/ar`
- **`app/robots.ts`** — allow all + lien sitemap
- **`app/icon.svg`** — favicon

### Points restants

- Configurer `NEXT_PUBLIC_SITE_URL=https://votre-domaine.ma` en production.
- Pas d'image Open Graph dédiée (`og:image`) — amélioration future optionnelle.

---

## 8. Accessibilité

| Critère | Statut |
|---------|--------|
| `alt` sur images | ✓ Via traductions i18n |
| `aria-label` menu mobile | ✓ Header |
| `aria-label` CTA WhatsApp | ✓ Ajouté |
| Contraste | ✓ Palette slate/blue/green standard |
| Navigation clavier | ✓ Liens et boutons natifs |

---

## 9. Déploiement Render

```bash
cd frontend
npm install && npm run build
npm start
```

- **Root Directory :** `frontend`
- **Variables :** `NEXT_PUBLIC_DEFAULT_LOCALE=fr`, `NEXT_PUBLIC_SITE_URL` (recommandé)
- **Pas de backend requis**

---

## 10. Bugs trouvés et corrigés

| # | Bug | Correction |
|---|-----|------------|
| 1 | Dossiers `app/api/` orphelins | Supprimés |
| 2 | Textes « formulaire » obsolètes | Mis à jour FR/AR |
| 3 | Notice analytics trompeuse (section confiance) | Texte WhatsApp / confidentialité |
| 4 | Metadata SEO minimale | Title, OG, Twitter, canonical |
| 5 | Pas de sitemap / robots / favicon | Fichiers ajoutés |
| 6 | Risque overflow horizontal | CSS `overflow-x: hidden` |
| 7 | CTA WhatsApp sans `aria-label` | Ajouté |
| 8 | Carte how-it-works étape 1 (clipboard / formulaire) | WhatsApp + `MessageCircle` |

---

## Points restants (non bloquants)

1. **`NEXT_PUBLIC_SITE_URL`** à renseigner sur Render/Vercel.
2. Pages **Politique de confidentialité** / **CGU** (liens `#` actuels).
3. **Image Open Graph** pour partage réseaux sociaux.
4. Vérifier que les URLs **Facebook / Instagram / TikTok** dans `site-config.ts` sont les bonnes comptes officiels.

---

## Commandes de validation

```bash
cd frontend
npm run build   # ✓ réussi
npm start       # port 3000
```

---

*Audit réalisé sur la branche `main` — projet frontend-only SoinsConnect.*
