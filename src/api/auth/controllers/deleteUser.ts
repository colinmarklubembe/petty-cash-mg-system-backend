import { responses } from "../../../utils";
import { Request, Response } from "express";
import userService from "../services/userService";

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // check if user exists
    const user = await userService.findUserById(id);

    if (!user) {
      return responses.errorResponse(res, 404, "User not found");
    }

    const userId = user.id.toString();

    const deletedUser = await userService.deleteUser(userId);

    responses.successResponse(res, 200, "User deleted successfully");
  } catch (error: any) {
    responses.errorResponse(res, 500, error.message);
  }
};

export default { deleteUser };
