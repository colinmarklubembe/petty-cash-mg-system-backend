import prisma from "../../prisma/client";

class PettyCashFundService {
  async createPettyCashFund(data: any) {
    return prisma.pettyCashFund.create({
      data,
    });
  }

  async getAllPettyCashFunds() {
    return prisma.pettyCashFund.findMany();
  }

  async getPettyCashFundById(fundId: string) {
    return prisma.pettyCashFund.findUnique({
      where: {
        id: fundId,
      },
      include: {
        requisitions: true,
        transactions: true,
      },
    });
  }

  async getPettyCashFundByUserId(userId: string, companyId: string) {
    return prisma.pettyCashFund.findMany({
      where: {
        userId,
        companyId,
      },
      include: {
        requisitions: true,
        transactions: true,
      },
    });
  }

  async updatePettyCashFund(fundId: string, newData: any) {
    return prisma.pettyCashFund.update({
      where: {
        id: fundId,
      },
      data: {
        ...newData,
      },
    });
  }

  async deletePettyCashFund(fundId: string) {
    return prisma.$transaction([
      prisma.requisition.deleteMany({
        where: {
          pettyCashFundId: fundId,
        },
      }),
      prisma.pettyCashFund.delete({
        where: {
          id: fundId,
        },
      }),
    ]);
  }
}

export default new PettyCashFundService();
