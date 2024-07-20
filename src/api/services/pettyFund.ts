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
    });
  }

  async getPettyCashFundByUserId(userId: string) {
    return prisma.pettyCashFund.findMany({
      where: {
        userId: userId,
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

  async deletePettyCashFund(fundId: number) {
    return prisma.pettyCashFund.$transaction([
      prisma.pettyCashFund.delete({
        where: {
          id: fundId,
        },
      }),
      prisma.transaction.deleteMany({
        where: {
          fundId: fundId,
        },
      }),
    ]);
  }
}

export default new PettyCashFundService();
