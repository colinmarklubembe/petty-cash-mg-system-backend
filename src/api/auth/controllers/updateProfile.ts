import { Request, Response } from "express";
import { sendEmails, responses } from "../../../utils";
import userService from "../services/userService";

const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, middleName, lastName, email } = req.body;

  try {
    const user = await userService.findUserById(id);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    const userId = user.id;

    const newData = {
      firstName,
      middleName,
      lastName,
      email,
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
