import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuthMiddleware";
import {
  getAdminEventLogs,
  deleteAdminEventLogs,
  clearAdminEventLogs,
} from "../controllers/logsController";

const router = Router();

router.use(requireAdminAuth);
router.get("/", getAdminEventLogs);
router.delete("/clear", clearAdminEventLogs);
router.delete("/", deleteAdminEventLogs);

export default router;
