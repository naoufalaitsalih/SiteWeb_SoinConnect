# SoinsConnect

Site vitrine bilingue (FR/AR) pour un service de soins à domicile au Maroc.

**Projet frontend uniquement** — les demandes de soin sont envoyées vers **Google Forms** et consultables dans **Google Sheets**. Aucun backend, base de données ou espace admin.

## Stack

| Couche   | Technologie |
|----------|-------------|
| Frontend | Next.js 15 + TypeScript + next-intl |
| Données  | Google Forms + Google Sheets |
| Style    | Tailwind CSS |

## Structure

```
Siteweb_SoinsConnect/
├── frontend/          # Application Next.js
│   ├── app/           # Pages (landing FR/AR)
│   ├── components/    # UI publique
│   ├── lib/           # googleForm.ts, validation, i18n
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

## Configuration Google Form

### 1. Créer le formulaire

Créez un Google Form avec ces champs :

- Nom complet
- Téléphone
- Email (optionnel)
- Adresse
- Type de soin
- Description (optionnel)
- Date souhaitée
- Heure souhaitée
- Urgence (Oui/Non)

Liez-le à une Google Sheet (Réponses → Créer une feuille de calcul).

### 2. Récupérer l'URL et les entry IDs

1. Ouvrez le formulaire en prévisualisation.
2. Affichez le code source (Ctrl+U).
3. Cherchez `formResponse` pour l'URL d'action.
4. Cherchez `entry.` pour chaque champ (ex. `entry.123456789`).

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_DEFAULT_LOCALE=fr

NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL=https://docs.google.com/forms/d/e/VOTRE_ID/formResponse

NEXT_PUBLIC_GF_FULL_NAME=entry.XXXXXXXX
NEXT_PUBLIC_GF_PHONE=entry.XXXXXXXX
NEXT_PUBLIC_GF_EMAIL=entry.XXXXXXXX
NEXT_PUBLIC_GF_ADDRESS=entry.XXXXXXXX
NEXT_PUBLIC_GF_CARE_TYPE=entry.XXXXXXXX
NEXT_PUBLIC_GF_DESCRIPTION=entry.XXXXXXXX
NEXT_PUBLIC_GF_REQUESTED_DATE=entry.XXXXXXXX
NEXT_PUBLIC_GF_REQUESTED_TIME=entry.XXXXXXXX
NEXT_PUBLIC_GF_IS_URGENT=entry.XXXXXXXX
```

## Déploiement

### Render

1. Créez un **Web Service**.
2. **Root Directory** : `frontend`
3. **Build Command** : `npm install && npm run build`
4. **Start Command** : `npm start`
5. Ajoutez toutes les variables `NEXT_PUBLIC_*` dans Environment.

### Vercel

1. Importez le repo, dossier racine : `frontend`
2. Framework : Next.js (détecté automatiquement)
3. Ajoutez les variables `NEXT_PUBLIC_*` dans Settings → Environment Variables

## Contact WhatsApp (fallback)

En cas d'erreur d'envoi du formulaire : **+212 708 321 872**

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
