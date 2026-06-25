import { Router } from "express";
import {
  getCareRequests,
  postCareRequest,
} from "../controllers/requestsController";
import { careRequestLimiter } from "../middleware/rateLimiters";

const router = Router();

router.get("/", getCareRequests);
router.post("/", careRequestLimiter, postCareRequest);

export default router;
