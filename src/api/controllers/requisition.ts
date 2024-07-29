import { Request, Response } from "express";
import { responses, mapStringToEnum } from "../../utils";
import userService from "../auth/services/userService";
import { requisitionService } from "../services";
import { RequisitionStatus, Role } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class RequisitionController {
  async createRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;
      const { title, description, amount, pettyCashFundId } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const data = {
        title,
        amount,
        companyId,
        description,
        pettyCashFundId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const requisition = await requisitionService.createRequisition(data);

      return responses.successResponse(
        res,
        201,
        "Requisition created successfully",
        { requisition: requisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async updateRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { requisitionId } = req.params;
      const { title, description, amount, status } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );

      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }

      if (requisition.userId !== user.id) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to update this requisition"
        );
      }

      let mappedStatus: any;
      mappedStatus = mapStringToEnum.mapStringToRequisitionStatus(res, status);

      const newData = {
        title,
        description,
        amount,
        requisitionStatus: mappedStatus,
        updatedAt: new Date().toISOString(),
      };

      const updatedRequisition = await requisitionService.updateRequisition(
        requisitionId,
        newData
      );

      return responses.successResponse(
        res,
        200,
        "Requisition updated successfully",
        { requisition: updatedRequisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getRequisitionById(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { requisitionId } = req.params;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );

      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }

      if (requisition.userId !== user.id) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to update this requisition"
        );
      }

      return responses.successResponse(
        res,
        200,
        "Requisition retrieved successfully",
        { requisition: requisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getAllRequisitions(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const requisitions = await requisitionService.getAllRequisitions(
        companyId
      );

      return responses.successResponse(
        res,
        200,
        "Requisitions retrieved successfully",
        { requisitions: requisitions }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getUserRequisitions(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisitions = await requisitionService.getUserRequisitions(
        user.id,
        companyId
      );

      return responses.successResponse(
        res,
        200,
        "Requisitions retrieved successfully",
        { requisitions: requisitions }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async approveRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;
      const { requisitionId } = req.params;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userCompany = await userService.findUserCompany(user.id, companyId);

      if (!userCompany) {
        return responses.errorResponse(res, 403, "User not found in company");
      }

      if (
        userCompany.role !== Role.ADMIN ||
        userCompany.role !== Role.FINANCE
      ) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to approve requisitions"
        );
      }

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );

      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }

      if (requisition.pettyCashFund.userId !== user.id) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to approve this requisition"
        );
      }

      const newData = {
        requisitionStatus: RequisitionStatus.APPROVED,
        updatedAt: new Date().toISOString(),
      };

      const updatedRequisition = await requisitionService.updateRequisition(
        requisitionId,
        newData
      );

      return responses.successResponse(
        res,
        200,
        "Requisition approved successfully",
        { requisition: updatedRequisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async deleteRequisition(req: Request, res: Response) {
    const { requisitionId } = req.params;

    const requisition = await requisitionService.findRequisitionById(
      requisitionId
    );

    if (!requisition) {
      return responses.errorResponse(res, 404, "Requisition not found");
    }

    await requisitionService.deleteRequisition(requisitionId);

    return responses.successResponse(
      res,
      200,
      "Requisitions deleted successfully"!
    );
  }
}

export default new RequisitionController();
