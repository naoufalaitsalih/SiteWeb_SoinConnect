import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuthMiddleware";
import { getAdminAuditLogs } from "../controllers/auditController";

const router = Router();

router.use(requireAdminAuth);
router.get("/", getAdminAuditLogs);

export default router;
