import { Between, getCustomRepository, In, Not } from 'typeorm';
import {
  CreateBookingDto,
  ResponseAvailableVehiclesDto,
  UpdateBookingWithPaymentDto,
  UpdateBookingWithVehicleDto,
} from '../controllers/dto/booking.dto';
import { ResponseVehicleDto } from '../controllers/dto/vehicle.dto';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { Booking, BookingState, RentType } from '../models/booking.model';
import { CreditCard } from '../models/credit-card.model';
import { Payment, PaymentState } from '../models/payment.model';
import { Vehicle } from '../models/vehicle.model';
import { BookingRepository } from '../repositories/booking.repository';
import { CreditCardRepository } from '../repositories/credit-card.repository';
import { UserRepository } from '../repositories/user.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import RandomString from 'randomstring';

class BookingService {
  private bookingRepository = getCustomRepository(BookingRepository);
  private vehicleRepository = getCustomRepository(VehicleRepository);
  private userRepository = getCustomRepository(UserRepository);
  private creditCardRepository = getCustomRepository(CreditCardRepository);

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
      where: {
        id: Not(In(bookedVehicles)),
      },
      relations: ['vehicleModel'],
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

    // TODO: impedire all'utente di fare una prenotazione che va in conflitto con un'altra che lui ha già fatto
    return availableVehicles;
  }

  async updateBookingVehicle(id: number, vehicleId: number): Promise<number> {
    const vehicle = await this.vehicleRepository.findOne(vehicleId, {
      relations: ['vehicleModel'],
    });
    const booking = await this.bookingRepository.findOne(id, {
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });

    if (booking == undefined) {
      throw new NotFoundError('Booking not found');
    }
    if (vehicle == undefined) {
      throw new NotFoundError('Vehicle not found');
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

    // TODO: controllare i requisiti del veicolo
    return totalPrice;
  }

  async makePayment(
    userEmail: string,
    bookingId: number,
    updateBookingPaymentDto: UpdateBookingWithPaymentDto
  ): Promise<Booking> {
    const { amount, creditCard, creditCardId } = updateBookingPaymentDto;
    const booking = await this.bookingRepository.findOne(bookingId);
    if (booking === undefined) {
      throw new NotFoundError('Booking not found');
    }

    const payment = new Payment();
    payment.amount = amount;
    payment.date = new Date();
    payment.state = PaymentState.PENDING;

    if (creditCardId) {
      // const creditCard = await this.creditCardRepository.findOne(creditCardId);
      const creditCard: CreditCard | undefined = await this.creditCardRepository
        .createQueryBuilder('creditCard')
        .where('creditCard.userEmail = :userEmail', { userEmail })
        .andWhere('creditCard.id = :creditCardId', { creditCardId })
        .getOne();
      if (creditCard === undefined) {
        throw new NotFoundError('Credit card not found');
      }

      payment.creditCard = creditCard;
    } else if (creditCard) {
      payment.creditCard = creditCard;
    } else {
      throw new BadRequestError('You must specify one credit card');
    }

    // TODO: mocked charge payment
    payment.state = PaymentState.ACCEPTED;

    booking.payment = payment;
    booking.unlockCode = RandomString.generate({
      capitalization: 'uppercase',
      length: 5,
    });
    return this.bookingRepository.save(booking);
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
