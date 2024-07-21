import { RequisitionStatus } from "@prisma/client";
import { Role } from "@prisma/client";

class EnumMapper {
  mapStringToRequisitionStatus(status: string): RequisitionStatus | any {
    switch (status) {
      case "DRAFTS" || "drafts":
        return RequisitionStatus.DRAFTS;
      case "PENDING" || "pending":
        return RequisitionStatus.PENDING;
      case "APPROVED" || "approved":
        return RequisitionStatus.APPROVED;
      case "REJECTED" || "rejected":
        return RequisitionStatus.REJECTED;
      default:
        return { status: 400, message: "Invalid status" };
    }
  }
}

export default new EnumMapper();
