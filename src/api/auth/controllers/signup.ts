import { Request, Response } from "express";
import { UserType } from "@prisma/client";
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

    // Create the user data
    const data = {
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      userType: UserType.USER,
      createdAt: new Date().toISOString(),
    };

    const user = await userService.createUser(data);

    // create token data with timestamp
    const tokenData = {
      id: user.id,
      email: user.email,
      username: user.firstName,
      createdAt: new Date().toISOString(), // temporarily store the timestamp of the token creation
      userType: user.userType,
    };

    const token = generateToken.generateToken(tokenData);

    const userId = user.id;
    const newData = {
      verificationToken: token,
    };

    const updatedUser = await userService.updateUser(userId, newData);

    const emailData = {
      email: user.email,
      name: user.firstName,
      token,
    };

    const emailResponse: { status: number; message: any } =
      await sendEmails.sendVerificationEmail(emailData);

    systemLog.systemError(emailResponse.message);

    responses.successResponse(
      res,
      201,
      "User created successfully. Please verify your email",
      updatedUser
    );
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { signup };
