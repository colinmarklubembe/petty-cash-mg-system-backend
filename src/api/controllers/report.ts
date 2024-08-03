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
      const { email } = req.user!;
      const { companyId } = req.company!;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const company = await companyService.getCompany(companyId);

      if (!company) {
        return responses.errorResponse(res, 404, "Company not found");
      }

      const userReport = await reportService.generateUserReport(
        user.id,
        companyId
      );

      return responses.successResponse(
        res,
        200,
        "Report generated successfully",
        { user: user, company: company }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new ReportController();
