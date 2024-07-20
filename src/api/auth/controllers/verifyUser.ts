import { Request, Response } from "express";
import { sendEmails, generateToken, responses } from "../../../utils";
import jwt from "jsonwebtoken";
import userService from "../services/userService";

const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      username: string;
      createdAt: string;
    };

    const userId = decoded.id;

    // check if a token exists in the database
    const checkUser = await userService.findUserById(userId);

    // check if both tokens match
    if (checkUser?.verificationToken !== token) {
      return responses.errorResponse(res, 400, "Invalid token");
    }

    // check if token has expired
    const tokenAge = Date.now() - new Date(decoded.createdAt).getTime();

    if (tokenAge > 3600000) {
      return responses.errorResponse(res, 400, "Token has expired");
    }

    const newData = {
      isVerified: true,
      verificationToken: null,
      isActivated: true,
      updatedAt: new Date().toISOString(),
    };

    const user = await userService.updateUser(userId, newData);

    res.status(200).redirect("http://localhost:3000/verifiedEmail");
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

const reverifyUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    if (user.isVerified) {
      return responses.errorResponse(res, 400, "User is already verified");
    }

    // create token data with timestamp
    const tokenData = {
      id: user.id,
      email: user.email,
      username: user.firstName,
      createdAt: user.createdAt,
    };

    // Create token
    const token = generateToken.generateToken(tokenData);

    const userId = user.id;

    const newData = {
      verificationToken: token,
      updatedAt: new Date().toISOString(),
    };

    // update the token in the database
    await userService.updateUser(userId, newData);

    const emailTokenData = {
      email: user.email,
      name: user.firstName,
      token,
    };

    const generateEmailToken = jwt.sign(
      emailTokenData,
      process.env.JWT_SECRET!
    );

    // send email
    const emailResponse: { status: number } =
      await sendEmails.sendVerificationEmail(generateEmailToken);

    if (emailResponse.status === 200) {
      return responses.successResponse(
        res,
        200,
        "Verification email sent successfully"
      );
    } else {
      return responses.errorResponse(res, 500, "Email could not be sent");
    }
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { verifyUser, reverifyUser };
