import { Router } from "express";
import { reportController } from "../controllers";
import { authenticate } from "../middleware";

const router = Router();

router.get(
  "/user/:userId",
  authenticate.checkCompanyId,
  reportController.generateUserReport
);

router.get(
  "/company",
  authenticate.checkCompanyId,
  reportController.generateCompanyReport
);

export default router;
