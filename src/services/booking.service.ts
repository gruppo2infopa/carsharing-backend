import { Between, getCustomRepository, In, Not } from 'typeorm';
import {
  CreateBookingDto,
  ResponseAvailableVehiclesDto,
  UpdateBookingWithPaymentDto,
  UpdateBookingWithVehicleDto,
} from '../controllers/dto/booking.dto';
import { ResponseVehicleDto } from '../controllers/dto/vehicle.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Booking, BookingState, RentType } from '../models/booking.model';
import { Vehicle } from '../models/vehicle.model';
import { BookingRepository } from '../repositories/booking.repository';
import { UserRepository } from '../repositories/user.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';

class BookingService {
  private bookingRepository = getCustomRepository(BookingRepository);
  private vehicleRepository = getCustomRepository(VehicleRepository);
  private userRepository = getCustomRepository(UserRepository);

  private priceRentMap: Map<RentType, number> = new Map([
    [RentType.ONE_WAY, 1],
    [RentType.FREE_FLOATING, 1.5],
    [RentType.WITH_DRIVER, 2],
  ]);

  async createPendingBooking(
    email: string,
    bookingDetails: CreateBookingDto
  ): Promise<ResponseAvailableVehiclesDto> {
    const { startDate, endDate } = bookingDetails;

    const bookedVehicles: number[] = (
      await this.bookingRepository.find({
        where: {
          startDate: Between(startDate, endDate),
          endDate: Between(startDate, endDate),
          vehicle: Not(null),
        },
        relations: ['vehicle'],
      })
    ).map((booking) => booking.vehicle.id);

    const vehicles: Vehicle[] = await this.vehicleRepository.find({
      id: Not(In(bookedVehicles)),
    });

    const user = await this.userRepository.findOne(email);

    const { id } = await this.bookingRepository.save({
      ...bookingDetails,
      state: BookingState.PENDING,
      user,
    });

    const availableVehicles: ResponseAvailableVehiclesDto = {
      bookingId: id,
      availableVehicles: vehicles.map(ResponseVehicleDto.fromEntity),
    };

    return availableVehicles;
  }

  async updateBookingVehicle(
    vehicleDetails: UpdateBookingWithVehicleDto
  ): Promise<number> {
    const { bookingId: id, selectedVehicle: vehicle } = vehicleDetails;
    const booking = await this.bookingRepository.findOne(id, {
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });

    if (booking == undefined) {
      throw new NotFoundError('Booking not found');
    }

    booking.vehicle = vehicle;
    await this.bookingRepository.save(booking);

    const { startDate, endDate } = booking;

    const time: number =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    const totalPrice =
      time *
      vehicle.vehicleModel.price *
      this.priceRentMap.get(booking.rentType)!;

    if (time >= 24) {
      return totalPrice * 0.625;
    }

    return totalPrice;
  }

  async makePayment(
    paymentDetails: UpdateBookingWithPaymentDto
  ): Promise<string> {
    // TODO: add code
    return '';
  }

  async cancelBooking(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne(bookingId);
    if (booking == undefined) {
      throw new NotFoundError('Vehicle not found');
    }

    booking.state = BookingState.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async getBookings(userEmail: string): Promise<Booking[]> {
    return this.bookingRepository
      .createQueryBuilder('booking')
      .select([
        'booking.startDate',
        'booking.endDate',
        'booking.rentType',
        'booking.unlockCode',
        'booking.vehicleId',
        'booking.finalDestination',
      ])
      .where('booking.userEmail = :userEmail', { userEmail })
      .getMany();
  }
}

export const bookingService = new BookingService();
