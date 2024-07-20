import { RequisitionStatus } from "../api/models/enums/RequisitionStatus";
import { Role } from "../api/models/enums/Role";

class EnumMapper {
  mapStringToRequisitionStatus(status: string): RequisitionStatus | any {
    switch (status) {
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
