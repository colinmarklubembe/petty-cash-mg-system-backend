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

router.put(
  "/approvals/approve/:requisitionId",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  requisitionController.approveRequisition
);

router.put(
  "/approvals/reject/:requisitionId",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  requisitionController.rejectRequisition
);

router.put(
  "/approvals/stall/:requisitionId",
  authenticate.checkCompanyId,
  authenticate.authenticateToken,
  requisitionController.stallRequisition
);

export default router;
