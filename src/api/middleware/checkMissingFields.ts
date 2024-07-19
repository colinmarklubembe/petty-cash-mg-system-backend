import { Request, Response, NextFunction } from "express";
import { responses } from "../../utils";

const checkMissingFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return responses.errorResponse(
        res,
        400,
        `Missing fields: ${missingFields.join(", ")}`
      );
    }

    next();
  };
};

export default checkMissingFields;
