import { Request, Response } from "express";
import { comparePassword, generateToken, responses } from "../../../utils";
import userService from "../services/userService";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    if (!user.isVerified) {
      return responses.errorResponse(res, 401, "User is not verified");
    }

    if (!user.isActivated) {
      const userId = user.id;
      const newData = {
        isActivated: true,
        updatedAt: new Date().toISOString(),
      };

      const activateUser = await userService.updateUser(userId, newData);
    }

    const hashedPassword = user.password;

    const isMatch = comparePassword.comparePassword(password, hashedPassword);

    if (!isMatch) {
      return responses.errorResponse(
        res,
        401,
        "Invalid email or password. Please try again!"
      );
    }

    const userId = user.id;

    const tokenData = {
      id: userId,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      createdAt: new Date().toISOString(),
    };

    const updatedUser = await userService.findUserById(userId);

    const token = generateToken.generateToken(tokenData);

    res
      .status(200)
      .setHeader("Authorization", `Bearer ${token}`)
      .json({
        message: `Logged in successfully as ${tokenData.firstName}`,
        success: true,
        user: updatedUser,
        token: token,
      });
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { login };
