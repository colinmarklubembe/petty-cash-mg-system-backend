import { requisitionService, transactionService } from "../services";

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

    const userMonthlyTransactions = await this.calculateUserMonthlyTransactions(
      userId,
      companyId,
      date
    );

    if (userMonthlyTransactions.status !== 200) {
      return {
        status: userMonthlyTransactions.status,
        message: userMonthlyTransactions.message,
      };
    }
    return {
      status: 200,
      data: {
        userMonthlyRequisitions: userMonthlyRequisitions.data,
        userMonthlyTransactions: userMonthlyTransactions.data,
      },
    };
  }

  async generateCompanyReport(companyId: string, date: any) {
    const companyMonthlyRequisitions =
      await this.calculateCompanyMonthlyRequisitions(companyId, date);

    if (companyMonthlyRequisitions.status !== 200) {
      return {
        status: companyMonthlyRequisitions.status,
        message: companyMonthlyRequisitions.message,
      };
    }

    const companyMonthlyTransactions =
      await this.calculateCompanyMonthlyTransactions(companyId, date);

    if (companyMonthlyTransactions.status !== 200) {
      return {
        status: companyMonthlyTransactions.status,
        message: companyMonthlyTransactions.message,
      };
    }

    return {
      status: 200,
      data: {
        companyMonthlyRequisitions: companyMonthlyRequisitions.data,
        companyMonthlyTransactions: companyMonthlyTransactions.data,
      },
    };
  }

  async calculateCompanyMonthlyRequisitions(companyId: string, date: any) {
    const requisitionsByMonth = await this.getCompanyRequisitionsByMonth(
      companyId,
      date
    );

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

  async calculateUserMonthlyRequisitions(
    userId: string,
    companyId: string,
    date: any
  ) {
    const requisitionsByMonth = await this.getUserRequisitionsByMonth(
      userId,
      companyId,
      date
    );

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

  async calculateCompanyMonthlyTransactions(companyId: string, date: any) {
    const transactionsByMonth = await this.getCompanyTransactionsByMonth(
      companyId,
      date
    );

    if (transactionsByMonth.status !== 200) {
      return {
        status: transactionsByMonth.status,
        message: transactionsByMonth.message,
      };
    }

    const currentMonth = date
      ? new Date(date).getMonth() + 1
      : new Date().getMonth() + 1;

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const key = `${currentMonth}-${currentYear}`;
    const currentMonthTransactions = transactionsByMonth.data?.[key] || {
      month: currentMonth,
      year: currentYear,
      transactions: [],
    };

    const totalMonthlyTransactions =
      currentMonthTransactions.transactions.length;

    return {
      status: 200,
      data: {
        currentMonthTransactions: currentMonthTransactions,
        totalMonthlyTransactions: totalMonthlyTransactions,
      },
    };
  }

  async calculateUserMonthlyTransactions(
    userId: string,
    companyId: string,
    date: any
  ) {
    const transactionsByMonth = await this.getUserTransactionsByMonth(
      userId,
      companyId,
      date
    );

    if (transactionsByMonth.status !== 200) {
      return {
        status: transactionsByMonth.status,
        message: transactionsByMonth.message,
      };
    }

    const currentMonth = date
      ? new Date(date).getMonth() + 1
      : new Date().getMonth() + 1;

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const key = `${currentMonth}-${currentYear}`;
    const currentMonthTransactions = transactionsByMonth.data?.[key] || {
      month: currentMonth,
      year: currentYear,
      requisitions: [],
    };

    const totalMonthlyTransactions =
      currentMonthTransactions.transactions.length;

    return {
      status: 200,
      data: {
        currentMonthTransactions: currentMonthTransactions,
        totalMonthlyTransactions: totalMonthlyTransactions,
      },
    };
  }

  async getCompanyRequisitionsByMonth(companyId: string, date: any) {
    const requisitions = await requisitionService.getRequisitionsByMonth(
      companyId
    );

    if (!requisitions || requisitions.length === 0) {
      return {
        status: 400,
        message: "No requisitions found for this company!",
      };
    }

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const companyRequisitions = requisitions.filter(
      (requisition: any) =>
        requisition.companyId === companyId &&
        new Date(requisition.createdAt).getFullYear() === currentYear
    );

    const companyMonthlyRequisitions: { [key: string]: any } = {};
    for (let month = 1; month <= 12; month++) {
      const key = `${month}-${currentYear}`;
      companyMonthlyRequisitions[key] = {
        month: month,
        year: currentYear,
        requisitions: [],
      };
    }

    companyRequisitions.forEach((requisition: any) => {
      const month = new Date(requisition.createdAt).getMonth() + 1;
      const key = `${month}-${currentYear}`;
      if (companyMonthlyRequisitions[key]) {
        companyMonthlyRequisitions[key].requisitions.push(requisition);
      }
    });

    return { status: 200, data: companyMonthlyRequisitions };
  }

  async getUserRequisitionsByMonth(
    userId: string,
    companyId: string,
    date: any
  ) {
    const requisitions = await requisitionService.getUserRequisitionsByMonth(
      userId,
      companyId
    );

    if (!requisitions || requisitions.length === 0) {
      return { status: 400, message: "No requisitions found for this user!" };
    }

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

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

  async getCompanyTransactionsByMonth(companyId: string, date: any) {
    const transactions = await transactionService.getTransactionsByMonth(
      companyId
    );

    if (!transactions || transactions.length === 0) {
      return {
        status: 400,
        message: "No transactions found for this company!",
      };
    }

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const companyTransactions = transactions.filter(
      (transaction: any) =>
        transaction.companyId === companyId &&
        new Date(transaction.createdAt).getFullYear() === currentYear
    );

    const companyMonthlyTransactions: { [key: string]: any } = {};
    for (let month = 1; month <= 12; month++) {
      const key = `${month}-${currentYear}`;
      companyMonthlyTransactions[key] = {
        month: month,
        year: currentYear,
        transactions: [],
      };
    }

    companyTransactions.forEach((transaction: any) => {
      const month = new Date(transaction.createdAt).getMonth() + 1;
      const key = `${month}-${currentYear}`;
      if (companyMonthlyTransactions[key]) {
        companyMonthlyTransactions[key].transactions.push(transaction);
      }
    });

    return { status: 200, data: companyMonthlyTransactions };
  }

  async getUserTransactionsByMonth(
    userId: string,
    companyId: string,
    date: any
  ) {
    const transactions = await transactionService.getUserTransactionsByMonth(
      userId,
      companyId
    );

    if (!transactions || transactions.length === 0) {
      return { status: 400, message: "No transactions found for this user!" };
    }

    const currentYear = date
      ? new Date(date).getFullYear()
      : new Date().getFullYear();

    const userTransactions = transactions.filter(
      (transaction: any) =>
        transaction.userId === userId &&
        new Date(transaction.createdAt).getFullYear() === currentYear
    );

    const userMonthlyTransactions: { [key: string]: any } = {};
    for (let month = 1; month <= 12; month++) {
      const key = `${month}-${currentYear}`;
      userMonthlyTransactions[key] = {
        month: month,
        year: currentYear,
        transactions: [],
      };
    }

    userTransactions.forEach((transaction: any) => {
      const month = new Date(transaction.createdAt).getMonth() + 1;
      const key = `${month}-${currentYear}`;
      if (userMonthlyTransactions[key]) {
        userMonthlyTransactions[key].transactions.push(transaction);
      }
    });

    return { status: 200, data: userMonthlyTransactions };
  }
}

export default new ReportService();
