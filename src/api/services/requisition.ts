import prisma from "../../prisma/client";

class RequisitionService {
  async createRequisition(data: any) {
    return prisma.requisition.create({
      data,
    });
  }

  async updateRequisition(requisitionId: string, newData: any) {
    return prisma.requisition.update({
      where: { id: requisitionId },
      data: {
        ...newData,
      },
    });
  }

  async findRequisitionById(requisitionId: string) {
    return prisma.requisition.findUnique({
      where: { id: requisitionId },
    });
  }

  async getAllRequisitions() {
    return prisma.requisition.findMany();
  }

  async getUserRequisitions(userId: string) {
    return prisma.requisition.findMany({
      where: { userId },
    });
  }
}

export default new RequisitionService();
