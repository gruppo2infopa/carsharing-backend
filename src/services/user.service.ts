import { UserCredentials, UserDetails } from '../controllers/dto/user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePasswords } from '../utils/password';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { UpdateUserDto } from '../controllers/dto/user.dto';
import { getCustomRepository } from 'typeorm';
import { BadRequestError } from '../errors/bad-request.error';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../models/notification.model';
import { CreditCard } from '../models/credit-card.model';

class UserService {
  private userRepository = getCustomRepository(UserRepository);
  private notificationRepository = getCustomRepository(NotificationRepository);

  async signup(userDetails: UserDetails): Promise<User> {
    const user: User = { ...userDetails, bookings: [], creditCards: [] };

    const foundUser: User | undefined = await this.userRepository.findOne(
      user.email
    );
    if (foundUser !== undefined)
      throw new BadRequestError('User already registered');

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

  async updateInfo(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    let user = await this.userRepository.findOne(email, {
      relations: ['creditCards'],
    });
    if (user === undefined) {
      throw new NotFoundError('User not found.');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    if (updateUserDto.creditCard) {
      const { creditCard } = updateUserDto;
      user.creditCards.push(creditCard);

      delete updateUserDto.creditCard;
    }

    user = { ...user!, ...updateUserDto };
    return this.userRepository.save(user);
  }

  async getNotifications(email: string): Promise<Notification[]> {
    const user: User | undefined = await this.userRepository.findOne(email);

    return await this.notificationRepository.find({
      relations: ['user'],
      where: { isRead: false, user },
    });
  }

  async unlinkCard(email: string, id: string): Promise<User> {
    const user = await this.userRepository.findOne(email, {
      relations: ['creditCards'],
    });
    if (user === undefined) {
      throw new NotFoundError('User not found.');
    }

    const index: number = user.creditCards.findIndex((cc) => cc.id === id);
    user.creditCards.splice(index, 1);

    return this.userRepository.save(user);
  }

  async getCreditCards(email: string): Promise<CreditCard[]> {
    const user = await this.userRepository.findOne(email, { relations: ['creditCards'] });
    if (user === undefined) {
      throw new NotFoundError('User not found');
    }

    return user.creditCards;
  }
}

export const userService = new UserService();
