import { Router } from "express";
import { postAdminLogin, postAdminLogout } from "../controllers/adminAuthController";
import { requireAdminAuth } from "../middleware/adminAuthMiddleware";
import { loginLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/login", loginLimiter, postAdminLogin);
router.post("/logout", requireAdminAuth, postAdminLogout);

export default router;
