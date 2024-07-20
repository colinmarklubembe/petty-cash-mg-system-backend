import { Request, Response } from "express";
import { responses, mapStringToEnum } from "../../utils";
import userService from "../auth/services/userService";
import { requisitionService } from "../services";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

class RequisitionController {
  async createRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { title, description, amount } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const data = {
        title,
        description,
        amount,
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
      mappedStatus = mapStringToEnum.mapStringToRequisitionStatus(status);

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

  async getAllRequisitions(req: Request, res: Response) {
    try {
      const requisitions = await requisitionService.getAllRequisitions();

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

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisitions = await requisitionService.getUserRequisitions(
        user.id
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
}

export default new RequisitionController();
