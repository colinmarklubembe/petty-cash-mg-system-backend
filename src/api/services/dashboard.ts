import {
  companyService,
  fundService,
  requisitionService,
  transactionService,
} from ".";

class DashboardService {
  async getAdminDashboardData(companyId: string) {
    const companyUsers = await this.calculateTotalCompanyUsers(companyId);

    const companyFunds = await this.getTotalNumberOfFunds(companyId);

    const monthlyTransactions = await this.getTotalMonthlyTransactions(
      companyId
    );

    const monthlyRequisitions = await this.getTotalMonthlyRequisitions(
      companyId
    );

    const activeFunds = await this.getActiveFunds(companyId);

    if (activeFunds.status !== 200) {
      return { status: 404, message: activeFunds.message };
    }

    const spendingByFund = await this.getSpendingByFund(companyId);

    if (spendingByFund.status !== 200) {
      return { status: 404, message: spendingByFund.message };
    }

    return {
      status: 200,
      data: {
        totalUsers: companyUsers.data.totalUsers,
        companyFunds: {
          totatFunds: companyFunds.data,
          funds: companyFunds.data.companyFunds,
        },
        monthlyTransactions: monthlyTransactions.data.totalMonthlyTransactions,
        monthlyRequisitions: monthlyRequisitions.data.totalMonthlyRequisitions,
        activeFunds: {
          totalActiveFunds: activeFunds.data?.totalActiveFunds,
          activeFunds: activeFunds.data?.activeFunds,
        },
        spendingByFund: spendingByFund.data,
      },
    };
  }

  async calculateTotalCompanyUsers(companyId: string) {
    const companyUsers = await companyService.getCompanyUsers(companyId);

    return { status: 200, data: { totalUsers: companyUsers.length } };
  }

  async getTotalNumberOfFunds(companyId: string) {
    const companyFunds = await fundService.getAllCompanyPettyCashFunds(
      companyId
    );

    const totalFunds = companyFunds.length;
    return {
      status: 200,
      data: { totalFunds, companyFunds: companyFunds || [] },
    };
  }

  async getTotalMonthlyTransactions(companyId: string) {
    const companyTransactions = await transactionService.getTransactionsByMonth(
      companyId
    );

    if (!companyTransactions) {
      return {
        status: 404,
        data: { getTotalMonthlyTransactions: 0 },
      };
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = companyTransactions.filter(
      (transaction: any) =>
        transaction.createdAt.getMonth() + 1 === currentMonth &&
        transaction.createdAt.getFullYear() === currentYear
    );

    return {
      status: 200,
      data: { totalMonthlyTransactions: monthlyTransactions.length },
    };
  }

  async getTotalMonthlyRequisitions(companyId: string) {
    const companyRequisitions = await requisitionService.getRequisitionsByMonth(
      companyId
    );

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyRequisitions = companyRequisitions.filter(
      (requisition: any) =>
        requisition.createdAt.getMonth() + 1 === currentMonth &&
        requisition.createdAt.getFullYear() === currentYear
    );

    return {
      status: 200,
      data: { totalMonthlyRequisitions: monthlyRequisitions.length },
    };
  }

  async getActiveFunds(companyId: string) {
    const companyFunds = await fundService.getAllCompanyPettyCashFunds(
      companyId
    );

    if (!companyFunds) {
      return { status: 404, message: "No funds found for this company!" };
    }

    const activeFunds = companyFunds.filter(
      (fund: any) => fund.currentBalance > 0
    );

    return {
      status: 200,
      data: { activeFunds, totalActiveFunds: activeFunds.length },
    };
  }

  async getSpendingByFund(companyId: string) {
    const companyFunds = await fundService.getAllCompanyPettyCashFunds(
      companyId
    );

    if (!companyFunds) {
      return { status: 404, message: "No funds found for this company!" };
    }

    const spendingByFund = companyFunds.map((fund: any) => {
      const totalSpent = fund.transactions.reduce(
        (acc: number, transaction: any) => acc + transaction.amount,
        0
      );

      return { fund: fund.name, totalSpent };
    });

    return { status: 200, data: { spendingByFund } };
  }
}

export default new DashboardService();
