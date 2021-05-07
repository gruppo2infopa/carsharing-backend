import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import {} from 'bcrypt';
import { hashPassword } from '../utils/password';

class UserService {
  private static instance: UserService;
  private userRepository = UserRepository.getInstance();

  static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  async signup(userDetails: UserDetails): Promise<User> {
    let {
      email,
      password,
      name,
      surname,
      birthDate,
      fiscalCode,
      phoneNumber,
      userRole,
      driverLicense,
    } = userDetails;

    password = await hashPassword(password);

    const user: User = {
      email,
      password,
      name,
      surname,
      birthDate,
      fiscalCode,
      phoneNumber,
      userRole,
      driverLicense,
    };

    const savedUser = await this.userRepository.saveUser(user);

    return savedUser;
  }

  async signin(userCredentials: UserCredentials): Promise<User | undefined> {
    const { email, password } = userCredentials;

    // TODO: check user credentials. Throw an expection if the password is wrong.

    const user: User | undefined = await this.userRepository.findUser(email);

    return user;
  }
}

export { UserService };
