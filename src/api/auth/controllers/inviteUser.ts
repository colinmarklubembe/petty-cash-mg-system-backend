import { Request, Response } from "express";
import {
  generateRandomPassword,
  mapStringToEnum,
  responses,
  sendEmails,
} from "../../../utils";
import { companyService } from "../../services";
import userService from "../../auth/services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
  company?: { companyId: string };
}

class InviteUser {
  async existingUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const { email, role } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const userId = user.id;
      let mappedRole: any;
      mappedRole = mapStringToEnum.mapStringToRole(res, role);

      await companyService.addUserToCompany(userId, companyId, mappedRole);

      return responses.successResponse(res, 201, "User invited successfully");
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async newUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;
      const { email, role } = req.body;

      const user = await userService.findUserByEmail(email);

      if (user) {
        return responses.errorResponse(
          res,
          404,
          "User already exists in this company"
        );
      }

      const company = await companyService.getCompany(companyId);

      const password = generateRandomPassword();

      // create the user
      const data = {
        email,
        password,
      };

      const newUser = await userService.createUser(data);

      const userId = newUser.id;
      let mappedRole: any;
      mappedRole = mapStringToEnum.mapStringToRole(res, role);

      await companyService.addUserToCompany(userId, companyId, mappedRole);

      // generate email token
      const emailData = {
        email,
        password,
        companyName: company.name,
        role: role,
      };

      // send email
      const response = await sendEmails.sendInviteEmailToExistingUser(
        emailData
      );

      return responses.successResponse(res, 201, "User invited successfully");
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new InviteUser();
