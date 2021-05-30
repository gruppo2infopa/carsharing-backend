import { getRepository } from 'typeorm';
import { RentDto, UpdateRentDto } from '../controllers/dto/rent.dto';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { Booking } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { UserRole } from '../models/user.model';
import { BookingRepository } from '../repositories/booking.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../models/notification.model';

class RentService {
  bookingRepository: BookingRepository = getRepository(Booking);
  notificationRepository: NotificationRepository = getRepository(Notification);

  async startRent(
    userRole: UserRole,
    userEmail: string,
    startRentDto: RentDto
  ) {
    const existingBooking = await this.bookingRepository.findOne({
      relations: ['user'],
      where: {
        id: startRentDto.bookingId,
      },
    });

    if (existingBooking == undefined)
      throw new NotFoundError('Booking not found');

    if (
      userRole == UserRole.CUSTOMER &&
      existingBooking.user.email != userEmail
    )
      throw new UnauthorizedError('User Unauthorized');

    existingBooking.startRent = new Date();
    this.bookingRepository.save(existingBooking);
  }

  async endRent(
    userRole: UserRole,
    userEmail: string,
    endRentDto: RentDto
  ): Promise<Booking> {
    const existingBooking = await this.bookingRepository.findOne({
      relations: ['user'],
      where: {
        id: endRentDto.bookingId,
      },
    });

    if (existingBooking == undefined)
      throw new NotFoundError('Booking not found');

    if (
      userRole == UserRole.CUSTOMER &&
      existingBooking.user.email != userEmail
    )
      throw new UnauthorizedError('User Unauthorized');

    existingBooking.endRent = new Date();

    if (existingBooking.endRent > existingBooking.endDate) {
      //TODO: charge latePayment
    }

    return this.bookingRepository.save(existingBooking);
  }

  async notifyProblem(
    updateRentDto: UpdateRentDto,
    userEmail: string,
  ) {
    const bookingId = updateRentDto.bookingId;
    const existingBooking = await this.bookingRepository.findOne({
      relations: ['user'],
      where: {
        id: bookingId,
      },
    });

    if (existingBooking == undefined)
      throw new NotFoundError('Booking not found');

    if (existingBooking.user.email != userEmail)
      throw new UnauthorizedError('User Unathorized');

    existingBooking.endDate = updateRentDto.expectedEndDate;
    existingBooking.finalDestination = updateRentDto.newFinalDestination;
    this.bookingRepository.save(existingBooking);
    const notification: Notification = {
      message: updateRentDto.problemDescription,
      issueDate: new Date(),
      isRead: false,
      user: existingBooking.user
    };
    return this.notificationRepository.save(notification)
  }
}

export const rentService = new RentService();
