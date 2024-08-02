import { Request, Response } from "express";
import { sendEmails, responses } from "../../../utils";
import userService from "../services/userService";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.user!;
  const { firstName, middleName, lastName } = req.body;

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
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await userService.updateUser(userId, newData);

    // // send update profile email to user
    // const emailData = {
    //   email: user.email,
    //   name: user.firstName,
    // };

    // // Send invitation email
    // const response = await sendEmails.sendUpdatedProfileEmail(emailData);

    responses.successResponse(res, 200, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { updateProfile };
