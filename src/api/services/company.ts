import prisma from "../../prisma/client";

class CompanyService {
  async createCompany(data: any) {
    return await prisma.company.create({
      data,
    });
  }

  async getCompany(companyId: string) {
    return await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        userCompanies: true,
        pettyCashFunds: true,
      },
    });
  }

  async addUserToCompany(userId: string, companyId: string, role: string) {
    return await prisma.userCompany.create({
      data: {
        userId,
        companyId,
        role,
      },
    });
  }

  async updateCompany(companyId: string, newData: any) {
    return await prisma.company.update({
      where: { id: companyId },
      data: {
        ...newData,
      },
    });
  }

  async deleteCompany(companyId: string) {
    return await prisma.$transaction([
      prisma.userCompany.deleteMany({
        where: { companyId },
      }),
      prisma.company.delete({
        where: { id: companyId },
      }),
    ]);
  }

  async getUserCompanies(userId: string) {
    return await prisma.userCompany.findMany({
      where: { userId },
      include: {
        company: true,
      },
    });
  }

  async getCompanyUsers(companyId: string) {
    return await prisma.userCompany.findMany({
      where: { companyId },
      include: {
        user: true,
      },
    });
  }

  async removeUserFromCompany(userId: string, companyId: string) {
    return await prisma.userCompany.deleteMany({
      where: {
        userId,
        companyId,
      },
    });
  }

  async getUserCompany(userId: string, companyId: string) {
    return await prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
      },
      include: {
        company: true,
      },
    });
  }

  async findUserCompany(userId: string, companyId: string) {
    return await prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
      },
    });
  }
}

export default new CompanyService();
