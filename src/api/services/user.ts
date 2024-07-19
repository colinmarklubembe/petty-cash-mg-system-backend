import { AppDataSource } from "../models/config/data-source";
import { User } from "../models/entities/User";

export class UserService {
  static async getAllUsers() {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find();
  }

  static async createUser(userData: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = userRepository.create(userData);
      return await userRepository.save(user);
    } catch (error) {
      console.error("Error saving user to the database:", error);
      throw error;
    }
  }
}
