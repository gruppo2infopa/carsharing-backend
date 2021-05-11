import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePasswords } from '../utils/password';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { getCustomRepository } from 'typeorm';

class UserService {
  private userRepository = getCustomRepository(UserRepository);

  async signup(userDetails: UserDetails): Promise<User> {
    const user: User = { ...userDetails, bookings: [] };
    user.password = await hashPassword(user.password);

    return this.userRepository.save(user);
  }

  async signin(userCredentials: UserCredentials): Promise<User> {
    const { email, password } = userCredentials;

    const user: User | undefined = await this.userRepository.findOne(email);
    if (user === undefined) throw new NotFoundError('User not found');

    const areEqual = await comparePasswords(password, user.password);
    if (!areEqual) throw new UnauthorizedError('Invalid user credentials');

    return user;
  }

  async updateInfo(updateUserDto: UpdateUserDto): Promise<User> {
    const { email } = updateUserDto;
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    this.userRepository.update(email, updateUserDto);
    return this.userRepository.findOneOrFail(email); // FIXME: Lanciare NotFoundError? che eccezione lancia?
  }
}

export const userService = new UserService();
