import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import {} from 'bcrypt';
import { hashPassword, comparePasswords } from '../utils/password';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { getConnection, getCustomRepository } from 'typeorm';

class UserService {
  private static instance: UserService;
  private userRepository = getConnection().getCustomRepository(UserRepository);

  private constructor() {}

  static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  async signup(userDetails: UserDetails) {
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

    // const user: User = {
    //   email,
    //   password,
    //   name,
    //   surname,
    //   birthDate,
    //   fiscalCode,
    //   phoneNumber,
    //   role,
    //   driverLicense,
    // };

    // return this.userRepository.saveUser(user);
  }

  async signin(userCredentials: UserCredentials) {
    const { email, password } = userCredentials;

    // const user: User | null = await this.userRepository.findUser(email);
    // if (user == null) throw new NotFoundError('User not found');

    // const areEqual = await comparePasswords(password, user.password);
    // if (!areEqual) throw new UnauthorizedError('Invalid user credentials');

    // return user;
  }

  async updateInfo(updateUserDto: UpdateUserDto) {
    // const { email, password, driverLicense, phoneNumber } = updateUserDto;
    // const foundUser = await this.userRepository.findUser(email);
    // console.log('[update]');
    // if (foundUser === null) throw new NotFoundError('User not found');
    // if (driverLicense) {
    //   console.log('[driver-license]');
    //   this.userRepository.updateDriverLicense(driverLicense, email);
    // }
    // if (phoneNumber) {
    //   console.log('[phone-number]');
    //   foundUser.phoneNumber = phoneNumber;
    // }
    // if (password) {
    //   console.log('[password]');
    //   foundUser.password = await hashPassword(password);
    // }
    // return foundUser.save();
  }
}

export { UserService };
