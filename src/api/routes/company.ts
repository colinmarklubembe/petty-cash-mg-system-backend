import { Router } from "express";
import { companyController } from "../controllers";
import { authenticate } from "../middleware";

const router = Router();

router.post(
  "/create",
  authenticate.authenticateToken,
  companyController.createCompany
);

router.get(
  "/get-company",
  authenticate.checkCompanyId,
  authenticate.authenticateToken,
  companyController.getUserCompany
);

router.get(
  "/get-company-by-id/:companyId",
  authenticate.authenticateToken,
  companyController.getCompanyById
);

router.put(
  "/update-company/:companyId",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  companyController.updateCompany
);

router.delete(
  "/delete-company/:companyId",
  authenticate.authenticateToken,
  companyController.deleteCompany
);

router.get(
  "/get-user-companies",
  authenticate.authenticateToken,
  companyController.getUserCompanies
);

router.get(
  "/get-company-users",
  authenticate.checkCompanyId,
  companyController.getCompanyUsers
);

router.delete(
  "/company/remove-user",
  authenticate.checkCompanyId,
  companyController.removeUserFromCompany
);

router.get("/select-company/:companyId", companyController.selectCompany);

export default router;
