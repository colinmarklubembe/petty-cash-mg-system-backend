import { Router } from "express";

import {
  signupController,
  loginController,
  // verifyUserController,
  changePasswordController,
  forgotPasswordController,
  inviteUserController,
  updateProfileController,
  getUserController,
  deleteUserController,
} from "../controllers";

import {
  authenticate,
  checkMissingFields,
  loginLimiter,
} from "../../middleware";

const router = Router();

router.post(
  "/signup",
  checkMissingFields(["firstName", "lastName", "email", "password"]),
  signupController.signup
);

// router.get("/verify", verifyUserController.verifyUser);

// router.post(
//   "/reverify",
//   checkMissingFields(["email"]),
//   verifyUserController.reverifyUser
// );

router.post(
  "/login",
  loginLimiter,
  checkMissingFields(["email", "password"]),
  loginController.login
);

router.put(
  "/change-password",
  checkMissingFields(["oldPassword", "newPassword"]),
  authenticate.authenticateToken,
  changePasswordController.changePassword
);

router.put(
  "/reset-password/:id",
  checkMissingFields(["newPassword"]),
  changePasswordController.resetPassword
);

router.post(
  "/forgot-password",
  checkMissingFields(["email"]),
  forgotPasswordController.forgotPassword
);

router.post(
  "/invite-user",
  checkMissingFields(["firstName", "lastName", "email"]),
  authenticate.checkCompanyId,
  inviteUserController.inviteUser
);

router.put(
  "/update-profile/:id",
  checkMissingFields(["firstName", "lastName", "email"]),
  updateProfileController.updateProfile
);

router.get("/get-user/:id", getUserController.getUserById);

router.get("/get-users", getUserController.getAllUsers);

router.get(
  "/get-company-users",
  authenticate.checkCompanyId,
  getUserController.getCompanyUsers
);

router.delete("/delete-user/:id", deleteUserController.deleteUser);

export default router;
