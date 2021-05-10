import { DriverLicense } from '../models/driver-license.model';
import { User } from '../models/user.model';

class UserRepository {
  private static instance: UserRepository;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserRepository();
    }

    return this.instance;
  }

  async saveUser(user: User) {}

  async findUser(userEmail: string) {}

  async updateDriverLicense(driverLicense: DriverLicense, userEmail: string) {}
}

export { UserRepository };
