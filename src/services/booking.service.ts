import {
  Between,
  getCustomRepository,
  In,
  LessThan,
  MoreThan,
  Not,
} from 'typeorm';
import {
  BookingSummary,
  AvailableVehicles,
  BookingDetails,
  BookingPayment,
  VehicleDetails,
} from '../controllers/dto/booking.dto';
import { NotFoundError } from '../errors/not-found.error';
import { Booking, BookingState } from '../models/booking.model';
import { Vehicle } from '../models/vehicle.model';
import { BookingRepository } from '../repositories/booking.repository';
import { UserRepository } from '../repositories/user.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';

class BookingService {
  private bookingRepository = getCustomRepository(BookingRepository);
  private vehicleRepository = getCustomRepository(VehicleRepository);
  private userRepository = getCustomRepository(UserRepository);

  async createPendingBooking(
    email: string,
    bookingDetails: BookingDetails
  ): Promise<AvailableVehicles> {
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
      unlockCode: '',
      user,
    });
    const availableVehicles: AvailableVehicles = {
      bookingId: id,
      availableVehicles: vehicles,
    };

    return availableVehicles;
  }

  async updateBookingVehicle(vehicleDetails: VehicleDetails): Promise<number> {
    const { bookingId: id, selectedVehicle: vehicle } = vehicleDetails;
    const booking = await this.bookingRepository.findOne(id);

    if (booking == undefined) {
      throw new NotFoundError('Booking not found');
    }

    booking.vehicle = vehicle;
    await this.bookingRepository.save(booking);
    // TODO: add logic of amount de dinero
    return -1;
  }

  async makePayment(paymentDetails: BookingPayment): Promise<string> {
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

  async getBookings(userEmail: string): Promise<BookingSummary[]> {
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
      .getMany() as Promise<BookingSummary[]>;
  }
}

export const bookingService = new BookingService();
