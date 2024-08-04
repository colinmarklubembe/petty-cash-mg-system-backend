import { Request, Response } from "express";
import { responses } from "../../utils";
import userService from "../auth/services/userService";
import { companyService, reportService } from "../services";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class ReportController {
  async generateUserReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { companyId } = req.company!;
      const { selectedDate } = req.query as any;

      const date = selectedDate
        ? new Date(selectedDate).toISOString()
        : new Date().toISOString();

      const user = await userService.findUserById(userId);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const company = await companyService.getCompany(companyId);

      if (!company) {
        return responses.errorResponse(res, 404, "Company not found");
      }

      const userReport = await reportService.generateUserReport(
        userId,
        companyId,
        date
      );

      if (userReport.status !== 200) {
        return responses.errorResponse(
          res,
          userReport.status,
          userReport.message
        );
      }

      return responses.successResponse(
        res,
        200,
        "Report generated successfully",
        { user: user, report: userReport.data }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new ReportController();
