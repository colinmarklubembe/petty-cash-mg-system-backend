import { Router } from "express";
import { dashboardController } from "../controllers";
import { authenticate } from "../middleware";

const router = Router();

router.get(
  "/admin",
  authenticate.checkCompanyId,
  authenticate.authenticateToken,
  dashboardController.getAdminDashboard
);

export default router;
