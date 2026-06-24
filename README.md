# SoinsConnect

MVP professionnel pour un service de soins à domicile — landing page + formulaire de demande de soin + interface admin.

## Stack technique

| Couche     | Technologie              |
|------------|--------------------------|
| Frontend   | Next.js 15 + TypeScript + next-intl (FR/AR) |
| Backend    | Node.js + Express        |
| Base       | MySQL (`siteweb_soinsconnect`) |
| ORM        | Prisma                   |
| Style      | Tailwind CSS             |

## Architecture du projet

```
Siteweb_SoinsConnect/
├── package.json       # Scripts globaux (dev, build, install:all)
├── frontend/          # Application Next.js (landing + admin)
├── backend/           # API REST Express + Prisma
├── database/          # Script SQL de création de la base
└── README.md
```

## Prérequis

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **MySQL** 8+ ([mysql.com](https://www.mysql.com)) — port `3306`
- **npm** (inclus avec Node.js)

## Installation complète

### 1. Installer les dépendances

```bash
cd Siteweb_SoinsConnect
npm install
npm run install:all
```

### 2. Configurer les variables d'environnement

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Éditez `backend/.env` et remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe MySQL :

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/siteweb_soinsconnect"
CORS_ORIGIN=http://localhost:3000
```

Éditez `frontend/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Créer la base de données MySQL

**Option A — MySQL Workbench / phpMyAdmin / ligne de commande :**

```sql
CREATE DATABASE siteweb_soinsconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Ou exécutez le script fourni :

```bash
mysql -u root -p < database/init.sql
```

**Option B — Script `database/init.sql`** (crée la base + table de référence)

### 4. Initialiser Prisma

```bash
cd backend

# Générer le client Prisma
npx prisma generate
# ou : npm run prisma:generate

# Appliquer la première migration
npx prisma migrate dev --name init
# ou : npm run prisma:migrate

cd ..
```

> La migration `20250622200000_init` crée la table `care_requests`.

### 5. Vérifier la base (optionnel)

```bash
cd backend
npx prisma studio
# ou : npm run prisma:studio
```

Ouvrez http://localhost:5555 pour visualiser la table `care_requests`.

### 6. Lancer le projet

```bash
# Depuis la racine — frontend (3000) + backend (4000)
npm run dev
```

## URLs

| Service              | URL                                              |
|----------------------|--------------------------------------------------|
| Site français        | http://localhost:3000/fr                         |
| Site arabe (RTL)     | http://localhost:3000/ar                         |
| Redirection racine   | http://localhost:3000 → `/fr`                    |
| Backend health       | http://localhost:4000/api/health                 |
| Admin français       | http://localhost:3000/fr/admin/requests          |
| Admin arabe          | http://localhost:3000/ar/admin/requests          |
| Prisma Studio        | http://localhost:5555                            |

## Internationalisation (i18n)

Le frontend est bilingue **Français / Arabe** via [next-intl](https://next-intl.dev) :

- Routes préfixées : `/fr` et `/ar`
- Arabe en **RTL** (`dir="rtl"`)
- Fichiers de traduction : `frontend/messages/fr.json` et `frontend/messages/ar.json`
- Sélecteur de langue **FR / AR** dans le header
- L'API backend reste inchangée (données en français)

## Commandes globales (racine)

| Commande              | Description                              |
|-----------------------|------------------------------------------|
| `npm run install:all` | Installe backend + frontend              |
| `npm run dev`         | Lance backend + frontend simultanément   |
| `npm run build`       | Build backend + frontend                 |

## Scripts backend (Prisma)

| Commande                | Description                    |
|-------------------------|--------------------------------|
| `npm run dev`             | API en développement           |
| `npm run build`           | Compilation TypeScript         |
| `npm run start`           | Démarrage production           |
| `npm run prisma:generate` | Génère Prisma Client           |
| `npm run prisma:migrate`  | Applique les migrations        |
| `npm run prisma:studio`   | Interface visuelle BDD         |

## Modèle Prisma — `CareRequest`

```prisma
model CareRequest {
  id            Int      @id @default(autoincrement())
  fullName      String
  phone         String
  email         String?
  address       String
  careType      String
  description   String?
  requestedDate DateTime
  requestedTime String
  isUrgent      Boolean  @default(false)
  status        String   @default("pending")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Table MySQL : `care_requests`

## API Endpoints

- `GET  /api/health` — santé de l'API
- `POST /api/requests` — créer une demande de soin
- `GET  /api/requests` — lister les demandes (admin, triées par date DESC)

## Vérifications rapides

```bash
# Santé API
curl http://localhost:4000/api/health

# Liste des demandes
curl http://localhost:4000/api/requests

# Créer une demande test
curl -X POST http://localhost:4000/api/requests \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Jean Dupont\",\"phone\":\"0612345678\",\"address\":\"12 rue de la Santé, Paris\",\"careType\":\"Soins infirmiers\",\"requestedDate\":\"2026-06-25\",\"requestedTime\":\"10:00\",\"isUrgent\":false}"
```

## Dépannage

| Problème | Solution |
|----------|----------|
| `P1000` Authentication failed | Vérifiez le mot de passe dans `backend/.env` |
| `P1001` Can't reach database | Démarrez MySQL (port 3306) |
| `P1003` Database does not exist | Exécutez `database/init.sql` ou créez la base manuellement |
| `EADDRINUSE :4000` | Un autre processus utilise le port — arrêtez-le ou changez `PORT` |
| Erreur CORS | Vérifiez `CORS_ORIGIN=http://localhost:3000` dans `backend/.env` |

## Sécurité

- Validation des données côté frontend et backend (Zod)
- CORS configuré via variable d'environnement
- Secrets stockés dans `.env` (jamais commités)
- `.env` est dans `.gitignore`

## Prochaines étapes (hors MVP)

- Authentification JWT pour l'admin
- Notifications email/SMS
- Déploiement (Vercel + Railway/Render)
