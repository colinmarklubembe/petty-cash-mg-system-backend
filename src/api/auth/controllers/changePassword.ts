import { Request, Response } from "express";
import { hashPassword, checkPasswordStrength, responses } from "../../../utils";
import userService from "../services/userService";
import bcryptjs from "bcryptjs";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.user!;
    const { oldPassword, newPassword } = req.body;

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User does not exist");
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return responses.errorResponse(res, 400, "Old password is incorrect");
    }

    const password = newPassword;

    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Password must be at least 8 characters long and have a score of 3"
      );
    }

    const hashedPassword = await hashPassword(password);

    const userId = user.id;

    const newData = {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

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

    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Password must be at least 8 characters long and have a score of 3"
      );
    }

    const hashedPassword = await hashPassword(password);

    const userId = id;
    const newData = {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

    const updatedPassword = await userService.updateUser(userId, newData);

    responses.successResponse(res, 200, "Password reset successfully");
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { changePassword, resetPassword };
