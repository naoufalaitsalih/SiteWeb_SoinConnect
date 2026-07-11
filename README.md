# NURIA

Site vitrine bilingue (FR/AR) pour un service de soins à domicile au Maroc.

**Projet frontend uniquement** — les demandes de soin passent par **WhatsApp**. Aucun backend, formulaire, base de données ou espace admin.

## Stack

| Couche   | Technologie |
|----------|-------------|
| Frontend | Next.js 15 + TypeScript + next-intl |
| Contact  | WhatsApp |
| Style    | Tailwind CSS |

## Structure

```
Siteweb_SoinsConnect/
├── frontend/          # Application Next.js (nuria-frontend)
│   ├── app/           # Pages (landing FR/AR)
│   ├── components/    # UI publique
│   ├── lib/           # whatsapp.ts, i18n
│   └── messages/      # fr.json, ar.json
└── README.md
```

## Prérequis

- Node.js 18+
- npm

## Installation et lancement

```bash
cd frontend
npm install
npm run dev
```

| Page | URL |
|------|-----|
| Français | http://localhost:3000/fr |
| Arabe (RTL) | http://localhost:3000/ar |

## Production

```bash
cd frontend
npm install
npm run build
npm start
```

## Contact WhatsApp

Le bouton **« Décrire mon besoin sur WhatsApp »** redirige vers :

`https://wa.me/212708321872`

avec un message prérempli en français ou en arabe selon la langue du site.

Numéro : **+212 708 321 872**

## Variables d'environnement

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_DEFAULT_LOCALE=fr

# URL publique (SEO : sitemap, OpenGraph) — ex. https://nuria.ma
NEXT_PUBLIC_SITE_URL=
```

## Déploiement

### Render

1. Créez un **Web Service**.
2. **Root Directory** : `frontend`
3. **Build Command** : `npm install && npm run build`
4. **Start Command** : `npm start`

### Vercel

1. Importez le repo, dossier racine : `frontend`
2. Framework : Next.js (détecté automatiquement)

## Internationalisation

- Routes : `/fr` et `/ar`
- Arabe en RTL
- Fichiers : `frontend/messages/fr.json`, `frontend/messages/ar.json`

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement |
| `npm run build` | Build production |
| `npm start` | Serveur production |
| `npm run lint` | ESLint |
