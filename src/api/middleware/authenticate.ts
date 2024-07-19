import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responses } from "../../utils";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  organization?: { organizationId: string };
}

const authenticateToken = (
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

const checkOrganizationId = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.headers["organization-id"];

  if (!organizationId) {
    return responses.errorResponse(
      res,
      400,
      "organization-id is required but was not found in the headers"
    );
  }

  req.organization = { organizationId: organizationId as string };
  next();
};

export default { authenticateToken, checkOrganizationId };
