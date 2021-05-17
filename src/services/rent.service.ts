import { getRepository } from 'typeorm';
import { BookingDetails } from '../controllers/dto/booking.dto';
import { RentDto, UpdateRentDto } from '../controllers/dto/rent.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { Booking } from '../models/booking.model';
import { UserRole } from '../models/user.model';
import { BookingRepository } from '../repositories/booking.repository';

class RentService {
  bookingRepository: BookingRepository = getRepository(Booking);

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
      //TODO
    }

    return this.bookingRepository.save(existingBooking);
  }

  async notifyProblem(
    updateRentDto: UpdateRentDto,
    userEmail: string,
    bookingId: number
  ) {
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
  }
}

export const rentService = new RentService();
