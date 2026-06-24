import rateLimit from "express-rate-limit";

/** Limite globale API — 200 requêtes / 15 min par IP */
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de requêtes. Réessayez plus tard.",
  },
});

/** Login admin — 10 tentatives / 15 min par IP */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

/** Analytics public — 60 événements / min par IP */
export const logsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Limite d'événements atteinte.",
  },
});

/** Formulaire de demande — 5 soumissions / heure par IP */
export const careRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de demandes envoyées. Réessayez plus tard.",
  },
});
