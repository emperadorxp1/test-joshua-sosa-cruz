import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyDashboard } from "./dashboard.controller";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyDashboard);

export default router;
