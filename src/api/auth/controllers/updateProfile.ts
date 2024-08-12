import { Request, Response } from "express";
import { sendEmails, responses, systemLog } from "../../../utils";
import userService from "../services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.user!;
  const { firstName, middleName, lastName, phoneNumber } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    const userId = user.id;

    const newData = {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await userService.updateUser(userId, newData);

    const emailData = {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    };

    // Send invitation email
    const response = await sendEmails.sendUpdatedProfileEmail(emailData);

    if (response.status !== 200) {
      systemLog.systemError("Email could not be sent");
    }

    responses.successResponse(res, 200, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { updateProfile };
