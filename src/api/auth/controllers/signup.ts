import { Request, Response } from "express";
import {
  checkPasswordStrength,
  hashPassword,
  sendEmails,
  generateToken,
  systemLog,
  responses,
} from "../../../utils";
import userService from "../services/userService";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Please include at least 8 alphanumeric characters, 1 uppercase letter and 1 special character"
      );
    }

    const checkUser = await userService.findUserByEmail(email);

    if (checkUser) {
      return responses.errorResponse(res, 400, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const data = {
      firstName,
      middleName,
      lastName,
      email,
      isVerified: false,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const user = await userService.createUser(data);

    const tokenData = {
      id: user.id,
      email: user.email,
      username: user.firstName,
      createdAt: new Date().toISOString(),
    };

    const token = generateToken.generateToken(tokenData);

    const userId = user.id;
    const newData = {
      verificationToken: token,
    };

    const updatedUser = await userService.updateUser(userId, newData);

    const emailData = {
      name: `${firstName} ${lastName}`,
      email,
      token,
    };

    const sendEmail = await sendEmails.sendVerificationEmail(emailData);

    if (sendEmail.status !== 200) {
      systemLog.systemError({
        message: `Failed to send verification email to ${email}. Error: ${sendEmail.message}`,
      });
    }

    responses.successResponse(res, 201, "User created successfully!", {
      user: updatedUser,
    });
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { signup };
