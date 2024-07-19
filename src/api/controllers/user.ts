import { Request, Response } from "express";
import { validate } from "class-validator";
import { UserService } from "../services/user";
import { User } from "../models/entities/User";
import { AppDataSource } from "../models/config/data-source";

export const createUser = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create(req.body);

  const errors = await validate(user);
  if (errors.length > 0) {
    console.error("Validation failed:", errors);
    return res.status(400).json({ errors });
  }

  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Failed to create user:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Failed to get users:", error);
    res
      .status(500)
      .json({ error: "Failed to get users", details: error.message });
  }
};
