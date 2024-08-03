import prisma from "../../prisma/client";

class ReportService {
  async generateUserReport(userId: string, companyId: string) {}

  async calculateUserMonthlyRequisitions(
    userId: string,
    companyId: string,
    date: any
  ) {}

  async calculateUserMonthlyTransactions(
    userId: string,
    companyId: string,
    date: any
  ) {}
}

export default new ReportService();
