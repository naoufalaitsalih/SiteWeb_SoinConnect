import { Router } from "express";
import { postEventLog } from "../controllers/logsController";
import { logsLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/", logsLimiter, postEventLog);

export default router;
