import { Router } from "express";
import { requisitionController } from "../controllers";
import { authenticate, checkMissingFields } from "../middleware";

const router = Router();

router.post(
  "/create",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  requisitionController.createRequisition
);

router.put(
  "/update/:requisitionId",
  authenticate.authenticateToken,
  requisitionController.updateRequisition
);

router.get(
  "/all",
  authenticate.checkCompanyId,
  requisitionController.getAllRequisitions
);

router.get(
  "/get-requisition/:requisitionId",
  authenticate.authenticateToken,
  requisitionController.getRequisitionById
);

router.get(
  "/user-requisitions",
  authenticate.authenticateToken,
  requisitionController.getUserRequisitions
);

export default router;
