import { Request, Response } from "express";
import { RequisitionStatus } from "@prisma/client";
import { mapStringToEnum, responses } from "../../utils";
import {
  transactionService,
  requisitionService,
  fundService,
} from "../services";
import userService from "../auth/services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class TransactionController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { companyId } = req.company!;
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

      if (requisition.requisitionStatus !== RequisitionStatus.APPROVED) {
        return responses.errorResponse(
          res,
          400,
          "Requisition must be approved before creating a transaction"
        );
      }

      // get the petty cash fund from the requisition
      const pettyCashFundId = requisition.pettyCashFundId;

      const pettyFund = await fundService.getPettyCashFundById(pettyCashFundId);

      if (!pettyFund) {
        return responses.errorResponse(res, 404, "Petty cash fund not found");
      }

      if (type === "debit" || type === "DEBIT") {
        let mappedType: any;
        mappedType = mapStringToEnum.mapStringToTransactionType(res, type);

        const data = {
          amount,
          type: mappedType,
          pettyCashFundId,
          companyId,
          requisitionId,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const transaction = await transactionService.createTransaction(data);
        // check if the amount is greater than the petty cash fund balance
        if (amount > pettyFund.currentBalance) {
          return responses.errorResponse(
            res,
            400,
            "Amount is greater than the petty cash fund balance"
          );
        }

        // deduct the amount from the petty cash fund balance
        const currentBalance = pettyFund.currentBalance - amount;
        const totalSpent = pettyFund.totalSpent + amount;

        // update the petty cash fund
        const newData = {
          currentBalance,
          totalSpent,
          updatedAt: new Date().toISOString(),
        };

        await fundService.updatePettyCashFund(pettyCashFundId, newData);

        const updatedPettyFund = await fundService.getPettyCashFundById(
          pettyCashFundId
        );

        return responses.successResponse(
          res,
          201,
          "Transaction created successfully",
          { transaction, pettyFund: updatedPettyFund }
        );
      }

      let mappedType: any;
      mappedType = mapStringToEnum.mapStringToTransactionType(res, type);

      const data = {
        amount,
        type: mappedType,
        pettyCashFundId,
        requisitionId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const transaction = await transactionService.createTransaction(data);

      // add the amount to the petty cash fund balance
      const currentBalance = pettyFund.currentBalance + amount;
      const totalAdded = pettyFund.totalAdded + amount;

      // update the petty cash fund
      const newData = {
        currentBalance,
        totalAdded,
        updatedAt: new Date().toISOString(),
      };

      await fundService.updatePettyCashFund(pettyCashFundId, newData);

      const updatedPettyFund = await fundService.getPettyCashFundById(
        pettyCashFundId
      );

      return responses.successResponse(
        res,
        201,
        "Transaction created successfully",
        { transaction, pettyFund: updatedPettyFund }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { transactionId } = req.params;
      const { amount, type, requisitionId } = req.body;

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

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );

      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }

      if (transaction.requisitionId !== requisitionId) {
        return responses.errorResponse(
          res,
          400,
          "Transaction does not belong to the requisition"
        );
      }

      // get the petty cash fund from the requisition

      let mappedType: any;
      mappedType = mapStringToEnum.mapStringToTransactionType(res, type);

      const newData = {
        amount,
        type: mappedType,
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
