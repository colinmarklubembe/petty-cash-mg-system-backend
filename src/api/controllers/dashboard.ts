import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { responses } from "../../utils";
import { companyService, dashboardService } from "../services";
import userService from "../auth/services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class Dashboard {
  async getAdminDashboard(req: AuthenticatedRequest, res: Response) {
    const { email } = req.user!;
    const { companyId } = req.company!;

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found!");
    }

    const userCompany = await companyService.findUserCompany(
      user.id,
      companyId
    );

    if (userCompany.role !== Role.ADMIN) {
      return responses.errorResponse(
        res,
        404,
        "Unable to load admin dashbaord for this user!"
      );
    }

    const data = await dashboardService.getAdminDashboardData(companyId);
    const dashboardData = data.data;

    return responses.successResponse(
      res,
      200,
      "Admin dashboard retrieved successfully",
      {
        dashboardData,
      }
    );
  }
}

export default new Dashboard();
