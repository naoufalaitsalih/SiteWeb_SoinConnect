import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuthMiddleware";
import {
  getAdminRequestNotes,
  patchAdminRequestNotes,
} from "../controllers/adminRequestsController";

const router = Router();

router.use(requireAdminAuth);

router.get("/:id/notes", getAdminRequestNotes);
router.patch("/:id/notes", patchAdminRequestNotes);

export default router;
