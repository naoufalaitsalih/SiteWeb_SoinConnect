import { Router } from "express";
import { getCheckAdmin, postRepairAdmin } from "../controllers/adminDebugController";

const router = Router();

/** TEMPORAIRE — diagnostic admin (supprimer après confirmation) */
router.get("/check-admin", getCheckAdmin);
router.post("/repair-admin", postRepairAdmin);

export default router;
