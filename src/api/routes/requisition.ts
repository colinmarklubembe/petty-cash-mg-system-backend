import { Router } from "express";
import { requisitionController } from "../controllers";
import { authenticate, checkMissingFields } from "../middleware";

const router = Router();

router.post(
  "/create",
  authenticate.authenticateToken,
  requisitionController.createRequisition
);

router.put(
  "/update/:requisitionId",
  authenticate.authenticateToken,
  requisitionController.updateRequisition
);

export default router;
