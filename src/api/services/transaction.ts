import prisma from "../../prisma/client";

class TransactionService {
  async getTransactions() {
    return prisma.transaction.findMany();
  }

  async getTransactionById(transactionId: string) {
    return prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
  }

  async createTransaction(data: any) {
    return prisma.transaction.create({
      data,
    });
  }

  async updateTransaction(transactionId: string, newData: any) {
    return prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        ...newData,
      },
    });
  }

  async deleteTransaction(transactionId: string) {
    return prisma.$transaction([
      prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      }),
    ]);
  }

  async getTransactionsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: {
        userId,
      },
    });
  }
}

export default new TransactionService();
