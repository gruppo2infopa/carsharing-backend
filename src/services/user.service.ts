import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import {} from 'bcrypt';
import { hashPassword, comparePasswords } from '../utils/password';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';

class UserService {
  private static instance: UserService;
  private userRepository = UserRepository.getInstance();

  private constructor() {}

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

  async signin(userCredentials: UserCredentials): Promise<User> {
    const { email, password } = userCredentials;

    const user: User | null = await this.userRepository.findUser(email);
    if (user == null) throw new NotFoundError('User not found');

    const areEqual = await comparePasswords(password, user.password);
    if (!areEqual) throw new UnauthorizedError('Invalid user credentials');

    return user;
  }
}

export { UserService };
