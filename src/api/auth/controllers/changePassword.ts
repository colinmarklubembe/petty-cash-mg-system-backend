import { Request, Response } from "express";
import { hashPassword, checkPasswordStrength, responses } from "../../../utils";
import userService from "../services/userService";
import bcryptjs from "bcryptjs";

const changePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userService.findUserById(id);

    if (!user) {
      return responses.errorResponse(res, 404, "User does not exist");
    }

    // compare old password
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return responses.errorResponse(res, 400, "Old password is incorrect");
    }

    const password = newPassword;

    // validate password strength
    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Password must be at least 8 characters long and have a score of 3"
      );
    }

    // hash new password
    const hashedPassword = await hashPassword(password);

    const userId = id;

    const newData = {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

    // update password
    await userService.updateUser(userId, newData);

    responses.successResponse(res, 200, "Password changed successfully");
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await userService.findUserById(id);

    if (!user) {
      return responses.errorResponse(res, 404, "User does not exist");
    }

    const password = newPassword;

    // validate password strength
    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Password must be at least 8 characters long and have a score of 3"
      );
    }

    // hash new password
    const hashedPassword = await hashPassword(password);

    const userId = id;
    const newData = {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

    // update password
    const updatedPassword = await userService.updateUser(userId, newData);

    responses.successResponse(res, 200, "Password reset successfully");
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { changePassword, resetPassword };
