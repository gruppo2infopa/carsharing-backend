import { User } from '../models/user.model';
import { UserModel } from './models/user.db.model';

class UserRepository {
  private static instance: UserRepository;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserRepository();
    }

    return this.instance;
  }

  async saveUser(user: User): Promise<User> {
    return await UserModel.create(user);
  }

  async findUser(userEmail: string): Promise<User | undefined> {
    return (await UserModel.findByPk(userEmail))?._attributes;
  }
}

export { UserRepository };
