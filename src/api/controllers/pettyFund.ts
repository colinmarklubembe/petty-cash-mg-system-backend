import { Request, Response } from "express";
import { responses } from "../../utils";
import { fundService } from "../services";
import userService from "../auth/services/userService";
import { Role } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class PettyCashFundController {
  async createPettyCashFund(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;

      const { name, amount } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const data = {
        name: name,
        currentBalance: amount,
        companyId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const pettyCashFund = await fundService.createPettyCashFund(data);

      return responses.successResponse(
        res,
        201,
        "Petty cash fund created successfully",
        { pettyCashFund: pettyCashFund }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async updatePettyCashFund(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { fundId } = req.params;
      const { name, amount } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const pettyCashFund = await fundService.getPettyCashFundById(fundId);

      if (!pettyCashFund) {
        return responses.errorResponse(res, 404, "Petty cash fund not found");
      }

      const newData = {
        name: name,
        currentBalance: amount,
        updatedAt: new Date().toISOString(),
      };

      const updatedPettyCashFund = await fundService.updatePettyCashFund(
        fundId,
        newData
      );

      return responses.successResponse(
        res,
        200,
        "Petty cash fund updated successfully",
        { pettyCashFund: updatedPettyCashFund }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async deletePettyCashFund(req: AuthenticatedRequest, res: Response) {
    try {
      const { fundId } = req.params;
      const { email } = req.user!;
      const { companyId } = req.company!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userCompany = await userService.findUserCompany(user.id, companyId);

      if (!userCompany) {
        return responses.errorResponse(res, 403, "User not found in company");
      }

      if (
        userCompany.role !== Role.ADMIN &&
        userCompany.role !== Role.FINANCE
      ) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to delete cash funds"
        );
      }

      const pettyCashFund = await fundService.getPettyCashFundById(fundId);

      if (!pettyCashFund) {
        return responses.errorResponse(res, 404, "Petty cash fund not found");
      }

      if (
        pettyCashFund.transactions.length > 0 ||
        pettyCashFund.requisitions.length > 0
      ) {
        return responses.errorResponse(
          res,
          400,
          "This cash fund cannot be deleted as it has requisitions or transactions attached to it"
        );
      }

      await fundService.deletePettyCashFund(fundId);

      return responses.successResponse(
        res,
        200,
        "Petty cash fund deleted successfully"
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getAllCompanyFunds(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;

      const pettyCashFunds = await fundService.getAllCompanyPettyCashFunds(
        companyId
      );

      return responses.successResponse(
        res,
        200,
        "Petty cash funds retrieved successfully",
        { pettyCashFunds: pettyCashFunds }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getPettyCashFundById(req: AuthenticatedRequest, res: Response) {
    try {
      const { fundId } = req.params;

      const pettyCashFund = await fundService.getPettyCashFundById(fundId);

      if (!pettyCashFund) {
        return responses.errorResponse(res, 404, "Petty cash fund not found");
      }

      return responses.successResponse(
        res,
        200,
        "Petty cash fund retrieved successfully",
        { pettyCashFund: pettyCashFund }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getPettyCashFundByUserId(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const pettyCashFunds = await fundService.getPettyCashFundByUserId(
        user.id,
        companyId
      );

      return responses.successResponse(
        res,
        200,
        "Petty cash funds retrieved successfully",
        { pettyCashFunds: pettyCashFunds }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new PettyCashFundController();
