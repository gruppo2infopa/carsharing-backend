import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePasswords } from '../utils/password';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { UpdateUserDto } from '../controllers/dto/user.dto';
import { getCustomRepository } from 'typeorm';
import { BadRequestError } from '../errors/bad-request.error';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

class UserService {
  private userRepository = getCustomRepository(UserRepository);

  async signup(userDetails: UserDetails): Promise<User> {
    const buffer = crypto.randomBytes(48);
    const verifyCode = buffer.toString('hex');

    const user: User = {
      ...userDetails,
      hasVerifiedEmail: false,
      verifyCode,
      bookings: [],
    };

    const foundUser: User | undefined = await this.userRepository.findOne(
      user.email
    );
    if (foundUser !== undefined)
      throw new BadRequestError('User already registered');

    user.password = await hashPassword(user.password);

    const savedUser = await this.userRepository.save(user);

    const link = `http://localhost:3000/verifyEmail?userEmail=${user.email}&verifyCode=${user.verifyCode}`;
    sendEmail(
      user.email,
      'Conferma email',
      `Per confermare la registrazione cliccare sul seguente link: ${link}`
    );

    return savedUser;
  }

  async signin(userCredentials: UserCredentials): Promise<User> {
    const { email, password } = userCredentials;

    const user: User | undefined = await this.userRepository.findOne(email);
    if (user === undefined) throw new NotFoundError('User not found');

    if (!user.hasVerifiedEmail)
      throw new BadRequestError('You must confirm your email');

    const areEqual = await comparePasswords(password, user.password);
    if (!areEqual) throw new UnauthorizedError('Invalid user credentials');

    return user;
  }

  async updateInfo(
    email: string,
    updateUserDto: UpdateUserDto
  ): Promise<User | undefined> {
    let user = await this.userRepository.findOne(email);
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    user = { ...user!, ...updateUserDto };
    return this.userRepository.save(user);
  }

  async verifyEmail(userEmail: string, verifyCode: string): Promise<void> {
    const user: User | undefined = await this.userRepository.findOne(userEmail);

    if (user == undefined || user.verifyCode != verifyCode)
      throw new BadRequestError('Invalid email or code');

    user.hasVerifiedEmail = true;
    await this.userRepository.save(user);
  }
}

export const userService = new UserService();
