import { UserType } from "@prisma/client";
import { Request, Response } from "express";
import {
  sendEmails,
  generateRandomPassword,
  hashPassword,
  systemLog,
  responses,
} from "../../../utils";
import { organizationService } from "../../services";
import userService from "../services/userService";

interface AuthenticatedRequest extends Request {
  organization?: { organizationId: string };
}

const inviteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, middleName, lastName, email } = req.body;

  const { organizationId } = req.organization!;

  try {
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      // get the organization with the id of organizationId
      const organization = await organizationService.findOrganizationById(
        organizationId
      );

      const userId = existingUser.id;
      // add the user to the organization if the user is not already in the organization
      const userOrganization = await userService.findUserOrganization(
        userId,
        organizationId
      );

      if (userOrganization) {
        return responses.errorResponse(
          res,
          400,
          "User is already in this organization!"
        );
      }

      // add the user to the organization
      const newUserOrganization = await userService.addUserToOrganization(
        userId,
        organizationId
      );

      const updatedUser = await userService.findUserById(userId);

      // Send invitation email
      const emailData = {
        email: updatedUser.email,
        name: updatedUser.firstName,
        organization: organization.name,
      };

      const response = await sendEmails.sendInviteEmailToExistingUser(
        emailData
      );

      return responses.successResponse(
        res,
        200,
        "Invitation email sent successfully!",
        { user: updatedUser }
      );
    } else {
      // generate random password
      const password = generateRandomPassword();

      const defaultPassword = password;
      const hashedPassword = await hashPassword(password);

      // get the name of the organization with the id of organizationId
      const organization = await organizationService.findOrganizationById(
        organizationId
      );

      // create data for the user
      const data = {
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
        userType: UserType.USER,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const user = await userService.createUser(data);
      const userId = user.id;

      // add the user to the organization
      const newUserOrganization = await userService.addUserToOrganization(
        userId,
        organizationId
      );

      // get the updated user
      const updatedUser = await userService.updateUser(userId, {
        userOrganizations: {
          connect: { id: newUserOrganization.id },
        },
      });

      const emailData = {
        email: user.email,
        name: user.firstName,
        password: defaultPassword,
        organization: organization?.name,
      };

      // Send invitation email
      const response = await sendEmails.sendInviteEmail(emailData);

      if (response.status !== 200) {
        systemLog.systemError(response.message);
      }

      return responses.successResponse(
        res,
        200,
        "Invitation email sent successfully!",
        { user: updatedUser }
      );
    }
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { inviteUser };
