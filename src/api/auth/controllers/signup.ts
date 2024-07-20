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

    // Check password strength
    const passwordStrength =
      checkPasswordStrength.validatePasswordStrength(password);

    if (!passwordStrength) {
      return responses.errorResponse(
        res,
        400,
        "Please include at least 8 alphanumeric characters, 1 uppercase letter and 1 special character"
      );
    }

    // Check if user already exists
    const checkUser = await userService.findUserByEmail(email);

    if (checkUser) {
      return responses.errorResponse(res, 400, "User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create the user data
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

    // Create user
    const user = await userService.createUser(data);

    // Create token data with timestamp
    const tokenData = {
      id: user.id,
      email: user.email,
      username: user.firstName,
      createdAt: new Date().toISOString(),
    };

    // Generate token
    const token = generateToken.generateToken(tokenData);

    // Prepare data for updating the user
    const userId = user.id;
    const newData = {
      verificationToken: token,
    };

    // Update user with verification token
    const updatedUser = await userService.updateUser(userId, newData);

    // Send success response
    responses.successResponse(res, 201, "User created successfully!", {
      user: updatedUser,
    });
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { signup };
