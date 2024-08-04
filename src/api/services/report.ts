import { requisitionService } from "../services";
import prisma from "../../prisma/client";

class ReportService {
  async generateUserReport(userId: string, companyId: string, date: any) {
    const userMonthlyRequisitions = await this.calculateUserMonthlyRequisitions(
      userId,
      companyId,
      date
    );

    if (userMonthlyRequisitions.status !== 200) {
      return {
        status: userMonthlyRequisitions.status,
        message: userMonthlyRequisitions.message,
      };
    }

    return {
      status: 200,
      data: {
        userMonthlyRequisitions: userMonthlyRequisitions.data,
      },
    };
  }

  async calculateUserMonthlyRequisitions(
    userId: string,
    companyId: string,
    date: any
  ) {
    const requisitionsByMonth = await this.getUserRequisitionsByMonth(
      userId,
      companyId
    );
    console.log(requisitionsByMonth);

    if (requisitionsByMonth.status !== 200) {
      return {
        status: requisitionsByMonth.status,
        message: requisitionsByMonth.message,
      };
    }

    const currentMonth = date
      ? new Date(date).getMonth() + 1
      : new Date().getMonth() + 1;

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const key = `${currentMonth}-${currentYear}`;
    const currentMonthRequisitions = requisitionsByMonth.data?.[key] || {
      month: currentMonth,
      year: currentYear,
      requisitions: [],
    };

    const totalMonthlyRequisitions =
      currentMonthRequisitions.requisitions.length;

    return {
      status: 200,
      data: {
        currentMonthRequisitions: currentMonthRequisitions,
        totalMonthlyRequisitions: totalMonthlyRequisitions,
      },
    };
  }

  async calculateUserMonthlyTransactions(
    userId: string,
    companyId: string,
    date: any
  ) {}

  async getUserRequisitionsByMonth(userId: string, companyId: string) {
    const requisitions = await requisitionService.getRequisitionsByMonth(
      userId,
      companyId
    );

    if (!requisitions || requisitions.length === 0) {
      return { status: 400, message: "No requisitions found for this user!" };
    }

    const currentYear = new Date().getFullYear();

    const userRequisitions = requisitions.filter(
      (requisition: any) =>
        requisition.userId === userId &&
        new Date(requisition.createdAt).getFullYear() === currentYear
    );

    const userMonthlyRequisitions: { [key: string]: any } = {};
    for (let month = 1; month <= 12; month++) {
      const key = `${month}-${currentYear}`;
      userMonthlyRequisitions[key] = {
        month: month,
        year: currentYear,
        requisitions: [],
      };
    }

    userRequisitions.forEach((requisition: any) => {
      const month = new Date(requisition.createdAt).getMonth() + 1;
      const key = `${month}-${currentYear}`;
      if (userMonthlyRequisitions[key]) {
        userMonthlyRequisitions[key].requisitions.push(requisition);
      }
    });

    return { status: 200, data: userMonthlyRequisitions };
  }
}

export default new ReportService();
