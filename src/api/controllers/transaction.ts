import { Request, Response } from "express";
import { responses } from "../../utils";
import { transactionService, requisitionService } from "../services";
import userService from "../auth/services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

class TransactionController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { amount, type, requisitionId } = req.body;

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

      // get the petty cash fund from the requisition
      const pettyCashFundId = requisition.pettyCashFundId;

      const data = {
        amount,
        type,
        pettyCashFundId,
        requisitionId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const transaction = await transactionService.createTransaction(data);

      return responses.successResponse(
        res,
        201,
        "Transaction created successfully",
        { transaction }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { transactionId } = req.params;
      const { amount, type } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const transaction = await transactionService.getTransactionById(
        transactionId
      );

      if (!transaction) {
        return responses.errorResponse(res, 404, "Transaction not found");
      }

      const newData = {
        amount,
        type,
        updatedAt: new Date().toISOString(),
      };

      const updatedTransaction = await transactionService.updateTransaction(
        transactionId,
        newData
      );

      return responses.successResponse(
        res,
        200,
        "Transaction updated successfully",
        { transaction: updatedTransaction }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { transactionId } = req.params;

      const transaction = await transactionService.getTransactionById(
        transactionId
      );

      if (!transaction) {
        return responses.errorResponse(res, 404, "Transaction not found");
      }

      await transactionService.deleteTransaction(transactionId);

      return responses.successResponse(
        res,
        200,
        "Transaction deleted successfully"
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getTransactions(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const transactions = await transactionService.getTransactionsByUserId(
        user.id
      );

      return responses.successResponse(
        res,
        200,
        "Transactions retrieved successfully",
        { transactions }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getTransactionById(req: AuthenticatedRequest, res: Response) {
    try {
      const { transactionId } = req.params;

      const transaction = await transactionService.getTransactionById(
        transactionId
      );

      if (!transaction) {
        return responses.errorResponse(res, 404, "Transaction not found");
      }

      return responses.successResponse(
        res,
        200,
        "Transaction retrieved successfully",
        { transaction }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new TransactionController();
