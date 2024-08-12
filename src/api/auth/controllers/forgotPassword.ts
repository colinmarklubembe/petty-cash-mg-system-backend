import { Request, Response } from "express";
import { sendEmails, responses } from "../../../utils";
import userService from "../services/userService";

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    const emailData = {
      id: user.id,
      email: user.email,
      name: user.firstName,
    };

    const emailResponse: { status: number } =
      await sendEmails.sendForgotPasswordEmail(emailData);

    if (emailResponse.status === 200) {
      responses.successResponse(
        res,
        200,
        "Password reset link has been sent to your email"
      );
    } else {
      responses.errorResponse(res, 500, "Email could not be sent");
    }
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { forgotPassword };
