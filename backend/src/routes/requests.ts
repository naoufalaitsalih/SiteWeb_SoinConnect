import { Router } from "express";
import { postCareRequest } from "../controllers/requestsController";
import { careRequestLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/", careRequestLimiter, postCareRequest);

export default router;
