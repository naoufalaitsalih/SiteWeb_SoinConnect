# SoinsConnect — Configuration MySQL + Prisma

Guide de configuration de la base de données **siteweb_soinsconnect** avec Prisma ORM.

## Prérequis

- MySQL 8+ (XAMPP, WAMP, Laragon ou MySQL Server)
- Serveur : `localhost`
- Port : `3306`
- Utilisateur : `root`
- Node.js 18+

---

## 1. Créer la base de données

### Option A — phpMyAdmin

1. Ouvrir [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Onglet **SQL**
3. Exécuter :

```sql
CREATE DATABASE IF NOT EXISTS siteweb_soinsconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Option B — Script du projet

Fichier : `database/init.sql` (à la racine du monorepo)

```powershell
# Si mysql est dans le PATH :
mysql -u root < database\init.sql
```

> **Note :** `prisma migrate deploy` peut aussi créer automatiquement la base si elle n'existe pas (MySQL + Prisma 6).

---

## 2. Configurer `backend/.env`

Copier l'exemple :

```powershell
cd backend
copy .env.example .env
```

Contenu minimal (root **sans mot de passe**) :

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/siteweb_soinsconnect"
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=soinsconnect-change-this-secret-in-production
JWT_EXPIRES_IN=8h
```

### Avec mot de passe MySQL

```env
DATABASE_URL="mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/siteweb_soinsconnect"
```

---

## 3. Vérifier le schéma Prisma

Fichier : `backend/prisma/schema.prisma`

Tables définies :

| Modèle Prisma | Table MySQL     |
|---------------|-----------------|
| `CareRequest` | `care_requests` |
| `Admin`       | `admins`        |

Valider le schéma :

```powershell
cd backend
npx prisma validate
```

---

## 4. Générer le client Prisma

```powershell
cd backend
npx prisma generate
```

> **Erreur EPERM sur Windows ?**  
> Arrêtez d'abord les serveurs Node (`npm run dev`), puis relancez `npx prisma generate`.

Équivalent npm :

```powershell
npm run prisma:generate
```

---

## 5. Appliquer les migrations

Les migrations existantes :

- `20250622200000_init` → table `care_requests`
- `20260623180000_add_admin` → table `admins`

### Première installation (recommandé)

```powershell
cd backend
npx prisma migrate deploy
```

### En développement (créer une nouvelle migration)

```powershell
npx prisma migrate dev --name nom_de_la_migration
```

> La migration initiale `init` existe déjà. Inutile de relancer `--name init` sur une base vide : utilisez `migrate deploy`.

---

## 6. Vérifier dans phpMyAdmin

Base : **siteweb_soinsconnect**

Tables attendues :

- `care_requests`
- `admins`
- `_prisma_migrations`

---

## 7. Seed administrateur (optionnel)

```powershell
cd backend
npm run prisma:seed
```

Compte créé :

| Champ      | Valeur                  |
|------------|-------------------------|
| Email      | `admin@soinsconnect.ma`   |
| Mot de passe | `Admin@2026`          |
| Rôle       | `super_admin`           |

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npx prisma validate` | Valide `schema.prisma` |
| `npx prisma generate` | Génère le client TypeScript |
| `npx prisma migrate status` | État des migrations |
| `npx prisma migrate deploy` | Applique les migrations (prod / CI) |
| `npx prisma migrate dev` | Migrations en dev + reset possible |
| `npx prisma studio` | Interface visuelle des données |
| `npm run prisma:seed` | Crée l'admin par défaut |
| `npm run build` | Compile le backend TypeScript |

---

## Ordre d'exécution (résumé)

```powershell
# 1. Créer la base (phpMyAdmin ou init.sql)

# 2. Configurer l'environnement
cd backend
copy .env.example .env
# Éditer DATABASE_URL si besoin

# 3. Installer les dépendances (si pas déjà fait)
npm install

# 4. Valider + générer Prisma
npx prisma validate
npx prisma generate

# 5. Appliquer les migrations
npx prisma migrate deploy

# 6. Seed admin
npm run prisma:seed

# 7. Vérifier
npx prisma migrate status

# 8. Démarrer le backend
npm run dev
```

---

## Dépannage

| Erreur | Solution |
|--------|----------|
| `P1003: Database does not exist` | Créer la base via phpMyAdmin (étape 1) |
| `P1001: Can't reach database server` | Démarrer MySQL (XAMPP / service Windows) |
| `EPERM` sur `prisma generate` | Arrêter `npm run dev`, relancer generate |
| Accès refusé root | Vérifier le mot de passe dans `DATABASE_URL` |

---

## Structure des fichiers

```
backend/
├── .env                    # Config locale (non versionné)
├── .env.example            # Modèle de configuration
├── prisma/
│   ├── schema.prisma       # Modèles Prisma
│   ├── seed.ts             # Données initiales admin
│   └── migrations/         # Historique SQL
database/
└── init.sql                # Script SQL de référence
```
