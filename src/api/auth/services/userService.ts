import { AppDataSource } from "../../models/config/data-source";
import { User } from "../../models/entities/User";
import { ObjectId } from "mongodb";

class UserService {
  private userRepository = AppDataSource.getMongoRepository(User);

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateUser(userId: string, updateData: any): Promise<User | null> {
    // Convert userId to ObjectId
    const objectId = new ObjectId(userId);

    // Use MongoDB's findOneAndUpdate to update and return the updated user
    const result = await this.userRepository.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    const updatedUser = result?.value;

    return updatedUser;
  }

  async findUserById(userId: string): Promise<User | null> {
    const objectId = new ObjectId(userId);
    return this.userRepository.findOneBy({ _id: objectId });
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async deleteUser(userId: string): Promise<User | null> {
    const objectId = new ObjectId(userId);
    return (await this.userRepository.findOneAndDelete({
      _id: objectId,
    })) as User | null;
  }
}

export default new UserService();
