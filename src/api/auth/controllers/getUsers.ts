import { responses } from "../../../utils";
import { Request, Response } from "express";
import { organizationService } from "../../services";
import userService from "../../auth/services/userService";

interface AuthenticatedRequest extends Request {
  organization?: { organizationId: string };
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    if (!users) {
      return responses.errorResponse(res, 404, "No users found");
    }

    responses.successResponse(res, 200, "Users:", users);
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = id;

    const user = await userService.findUserById(userId);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    responses.successResponse(res, 200, "User:", user);
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

const getUsersByOrganization = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { organizationId } = req.organization!;

    const organization = await organizationService.findOrganizationById(
      organizationId
    );

    if (!organization) {
      return responses.errorResponse(res, 404, "Organization not found");
    }

    const users = await userService.findUsersByOrganization(organizationId);

    responses.successResponse(
      res,
      200,
      `Users for the organization ${organization.name} `,
      { users: users }
    );
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { getAllUsers, getUserById, getUsersByOrganization };
