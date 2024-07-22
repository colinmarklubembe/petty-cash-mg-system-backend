import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responses } from "../../utils";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class Authenticate {
  authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return responses.errorResponse(res, 401, "Unauthorized! No token found");

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err)
        return responses.errorResponse(
          res,
          403,
          "Invalid token! Please login again"
        );

      req.user = user as { email: string; organizationId: string };
      next();
    });
  };

  checkCompanyId = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const companyId = req.headers["companyId"];

    if (!companyId) {
      return responses.errorResponse(
        res,
        400,
        "comoanyId is required but was not found in the headers"
      );
    }

    req.company = { companyId: companyId as string };
    next();
  };
}

export default new Authenticate();
