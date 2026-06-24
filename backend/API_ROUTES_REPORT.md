# Rapport des routes API — SoinsConnect Backend

**Généré :** 2026-06-22  
**Base testée :** `https://soinsconnect-api.onrender.com`  
**Enregistrement :** `backend/src/app.ts` via `app.use()`

---

## 1. Connexion base de données

| Élément | Statut | Notes |
|---------|--------|-------|
| `DATABASE_URL` | OK (Render) | PostgreSQL `?schema=public` |
| Prisma Client | OK | `npx prisma generate` dans le build Render |
| `npx prisma migrate deploy` | OK | Migration `20250623000000_init` |
| Test connexion (`GET /api/health`) | OK | 200 — API en ligne ; champ `database` après déploiement de cette branche |
| Tables PostgreSQL | OK | `care_requests`, `admins`, `event_logs`, `audit_logs` |
| Admin seed | OK | `admin@soinsconnect.ma` — mot de passe = `SEED_ADMIN_PASSWORD` Render |

---

## 2. Routes enregistrées

### Santé

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| GET | `/api/health` | Public | Santé API + ping DB | — | `{ success, message, database? }` | **OK** (200) |

### Demandes publiques

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| POST | `/api/requests` | Public | Créer une demande de soin | Voir ci-dessous | 201 `{ success, message, data }` | **OK** (201) |
| GET | `/api/requests` | — | **Supprimé** (fuite PII) | — | 404 `{ success: false, message: "Route non trouvée" }` | **OK** (404 volontaire) |

**Body POST `/api/requests` :**

```json
{
  "fullName": "string (2-255)",
  "phone": "string (8-20 car.)",
  "email": "string optionnel",
  "address": "string (5-1000)",
  "careType": "Soins infirmiers | Aide à la personne | Suivi post-opératoire | Accompagnement senior | Soins spécialisés | Autre besoin",
  "description": "string optionnel (max 2000)",
  "requestedDate": "YYYY-MM-DD",
  "requestedTime": "HH:MM",
  "isUrgent": true
}
```

### Auth admin

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| POST | `/api/admin/auth/login` | Public | Connexion admin | `{ email, password }` | 200 `{ success, token, admin }` | **OK** (401 si mauvais MDP) |
| POST | `/api/admin/auth/logout` | JWT | Déconnexion + audit | — | 200 `{ success: true }` | **OK** (nécessite token valide) |

### Demandes admin

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| GET | `/api/admin/demandes` | JWT | Liste toutes les demandes | — | 200 `{ success, data[], count }` | **OK** |
| PATCH | `/api/admin/demandes/:id/status` | JWT | Changer statut | `{ status: "EN_ATTENTE" \| "ACCEPTEE" \| "REFUSEE" }` | 200 `{ success, data }` | **OK** |
| PATCH | `/api/admin/demandes/:id/notes` | JWT | Notes admin | `{ admin_notes: string }` | 200 `{ success, data }` | **OK** |
| DELETE | `/api/admin/demandes/:id` | JWT | Supprimer demande | — | 200 `{ success, message }` | **OK** |

### Legacy notes (alias)

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| GET | `/api/admin/requests/:id/notes` | JWT | Lire notes | — | 200 `{ success, data }` | **OK** |
| PATCH | `/api/admin/requests/:id/notes` | JWT | Modifier notes | `{ admin_notes }` | 200 `{ success, data }` | **OK** |

### Analytics public

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| POST | `/api/logs` | Public | Événement analytics | Voir ci-dessous | 201 `{ success: true }` | **OK** (201) |

**Body POST `/api/logs` :**

```json
{
  "eventType": "page_view | button_click | form_start | form_submit | form_error | api_error",
  "pageUrl": "string optionnel",
  "elementName": "string optionnel",
  "sessionId": "string optionnel",
  "metadata": {}
}
```

### Logs admin

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| GET | `/api/admin/logs` | JWT | Liste logs (`?page=&limit=&startDate=&endDate=`) | — | 200 `{ success, data, pagination }` | **OK** |
| DELETE | `/api/admin/logs` | JWT | Supprimer par IDs | `{ ids: number[] }` | 200 `{ success, deleted }` | **OK** |
| DELETE | `/api/admin/logs/clear` | JWT | Purge par plage dates | `{ startDate?, endDate? }` | 200 `{ success, deleted }` | **OK** |

### Audit admin

| Méthode | URL | Auth | Description | Body | Réponse attendue | Statut |
|---------|-----|------|-------------|------|------------------|--------|
| GET | `/api/admin/audit` | JWT | Logs d'audit (`?page=&limit=`) | — | 200 `{ success, data, pagination }` | **OK** |

---

## 3. Résultats tests automatiques (`npm run check:api`)

Exécuté contre Render le 2026-06-22 :

| Route | Résultat |
|-------|----------|
| GET `/api/health` | ✅ 200 |
| GET `/api/requests` | ✅ 404 (attendu) |
| POST `/api/requests` | ✅ 201 — écriture PostgreSQL confirmée |
| POST `/api/logs` | ✅ 201 |
| POST `/api/admin/auth/login` | ⚠️ 401 — identifiants locaux `Admin@2026` ≠ `SEED_ADMIN_PASSWORD` Render |
| Routes admin (JWT) | ⏭️ Non testées sans mot de passe Render |

---

## 4. Frontend ↔ Backend — correspondance

| Appel frontend | Proxy Next.js | Backend réel | Statut |
|----------------|---------------|--------------|--------|
| Formulaire public | Direct `publicApiUrl("/api/requests")` | POST `/api/requests` | OK |
| Admin demandes | `/api/admin/demandes` | GET/PATCH/DELETE `/api/admin/demandes` | OK |
| Admin login | `/api/admin/auth/login` | POST `/api/admin/auth/login` | OK |
| Admin logout | `/api/admin/auth/logout` | POST `/api/admin/auth/logout` | OK |
| Analytics | `/api/logs` | POST `/api/logs` | OK |
| Admin logs | `/api/admin/logs` | GET/DELETE `/api/admin/logs` | OK |
| Admin audit | `/api/admin/audit` | GET `/api/admin/audit` | OK |
| Legacy notes | `/api/admin/requests/:id/notes` | GET/PATCH `/api/admin/requests/:id/notes` | OK |

**Aucun appel frontend vers `GET /api/requests`** (route supprimée).

---

## 5. CORS

Configuré dans `app.ts` :

- Variable : `CORS_ORIGIN` (liste séparée par virgules)
- Défaut : `http://localhost:3000`
- Production : `http://localhost:3000,https://votre-app.vercel.app`
- Méthodes : GET, POST, PATCH, DELETE, OPTIONS
- Headers : Content-Type, Authorization
- Credentials : true

---

## 6. Fichiers utiles

- Tests REST : `backend/test-api.http`
- Script auto : `npm run check:api` (vars `API_BASE_URL`, `CHECK_ADMIN_EMAIL`, `CHECK_ADMIN_PASSWORD`)
- Enregistrement routes : `backend/src/app.ts`
