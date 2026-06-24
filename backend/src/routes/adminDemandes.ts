import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuthMiddleware";
import {
  deleteAdminDemandeHandler,
  getAdminDemandes,
  patchAdminDemandeNotes,
  patchAdminDemandeStatus,
} from "../controllers/adminDemandesController";

const router = Router();

router.use(requireAdminAuth);

router.get("/", getAdminDemandes);
router.patch("/:id/status", patchAdminDemandeStatus);
router.patch("/:id/notes", patchAdminDemandeNotes);
router.delete("/:id", deleteAdminDemandeHandler);

export default router;
