import { Router } from "express";
import { fundController } from "../controllers";
import { authenticate, checkMissingFields } from "../middleware";

const router = Router();

router.post(
  "/create",
  checkMissingFields(["name", "amount"]),
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  fundController.createPettyCashFund
);

router.put(
  "/update/:fundId",
  checkMissingFields(["amount"]),
  authenticate.authenticateToken,
  fundController.updatePettyCashFund
);

router.get(
  "/get-all",
  authenticate.checkCompanyId,
  authenticate.authenticateToken,
  fundController.getAllPettyCashFunds
);

router.get(
  "/fund/:fundId",
  authenticate.authenticateToken,
  fundController.getPettyCashFundById
);

router.get(
  "/by-user",
  authenticate.authenticateToken,
  fundController.getPettyCashFundByUserId
);

router.delete(
  "/delete/:fundId",
  authenticate.authenticateToken,
  fundController.deletePettyCashFund
);

export default router;
