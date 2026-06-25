import { Router } from "express";
import { getCheckAdmin } from "../controllers/adminDebugController";

const router = Router();

/** TEMPORAIRE — diagnostic admin (supprimer après confirmation) */
router.get("/check-admin", getCheckAdmin);

export default router;
