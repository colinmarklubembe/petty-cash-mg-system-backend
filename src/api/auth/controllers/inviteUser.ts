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
  existingUser = async (
    companyId: string,
    email: string,
    role: string,
    res: Response
  ) => {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const company = await companyService.getCompany(companyId);

    const userId = user.id;
    const mappedRole = mapStringToEnum.mapStringToRole(res, role);

    // Check if user is already in the company
    const userCompany = await companyService.getUserCompany(userId, companyId);

    if (userCompany) {
      throw { status: 400, message: "User already belongs to company" };
    }

    await companyService.addUserToCompany(userId, companyId, mappedRole);

    const emailData = {
      name: `${user.firstName} ${user.lastName}`,
      email,
      companyName: company.name,
      role: role,
    };

    await sendEmails.sendInviteEmailToExistingUser(emailData);

    return { status: 200, message: "User added successfully", data: user };
  };

  newUser = async (
    companyId: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    res: Response
  ) => {
    const company = await companyService.getCompany(companyId);

    const password = generateRandomPassword();

    const data = {
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newUser = await userService.createUser(data);

    const userId = newUser.id;
    const mappedRole = mapStringToEnum.mapStringToRole(res, role);

    await companyService.addUserToCompany(userId, companyId, mappedRole);

    const emailData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      companyName: company.name,
      role: role,
    };

    await sendEmails.sendInviteEmailToExistingUser(emailData);

    return { status: 200, message: "User added successfully", data: newUser };
  };

  inviteUser = async (req: AuthenticatedRequest, res: Response) => {
    const { email, role, firstName, lastName } = req.body;
    const { companyId } = req.company!;

    try {
      const user = await userService.findUserByEmail(email);

      let response;
      if (user) {
        response = await this.existingUser(companyId, email, role, res);
      } else {
        response = await this.newUser(
          companyId,
          firstName,
          lastName,
          email,
          role,
          res
        );
      }

      return responses.successResponse(
        res,
        response.status,
        response.message,
        response.data
      );
    } catch (error: any) {
      return responses.errorResponse(
        res,
        error.status || 500,
        error.message || "An error occurred while inviting the user."
      );
    }
  };
}

export default new InviteUser();
