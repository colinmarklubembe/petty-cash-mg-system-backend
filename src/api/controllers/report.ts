import { Request, Response } from "express";
import { responses } from "../../utils";
import userService from "../auth/services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

class ReportController {
  async generateReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { reportType } = req.params;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      // Generate report based on the report type
      return responses.successResponse(
        res,
        200,
        "Report generated successfully",
        { reportType }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new ReportController();
