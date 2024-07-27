import prisma from "../../../prisma/client";

class UserService {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async createUser(data: any) {
    return prisma.user.create({
      data,
    });
  }

  async updateUser(userId: string, newData: any) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...newData,
      },
    });
  }

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }

  async deleteUser(userId: string) {
    return prisma.user.$transaction([
      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);
  }
}

export default new UserService();
