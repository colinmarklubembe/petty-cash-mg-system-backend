import { Response } from "express";
import { responses } from ".";
import { RequisitionStatus, TransactionType, Role } from "@prisma/client";

class EnumMapper {
  mapStringToRequisitionStatus(
    res: Response,
    status: string
  ): RequisitionStatus | any {
    switch (status.toUpperCase()) {
      case "DRAFTS":
        return RequisitionStatus.DRAFTS;
      case "PENDING":
        return RequisitionStatus.PENDING;
      case "APPROVED":
        return RequisitionStatus.APPROVED;
      case "REJECTED":
        return RequisitionStatus.REJECTED;
      default:
        return responses.errorResponse(res, 400, "Invalid requisition status");
    }
  }

  mapStringToTransactionType(
    res: Response,
    type: string
  ): TransactionType | any {
    switch (type.toUpperCase()) {
      case "DEBIT":
        return TransactionType.DEBIT;
      case "CREDIT":
        return TransactionType.CREDIT;
      default:
        return responses.errorResponse(res, 400, "Invalid transaction type");
    }
  }

  mapStringToRole(res: Response, role: string): Role | any {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return Role.ADMIN;
      case "FINANCE":
        return Role.FINANCE;
      case "EMPLOYEE":
        return Role.EMPLOYEE;
      default:
        return responses.errorResponse(res, 400, "Invalid role");
    }
  }
}

export default new EnumMapper();
