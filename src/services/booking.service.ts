import {
  Between,
  getCustomRepository,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
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
import { Requirement, VehicleType } from '../models/vehicle-model.model';
import { DriverLicenseType } from '../models/driver-license.model';

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

    // Verifico che l'utente non abbia già effettuato altre prenotazioni
    // nel periodo indicato.
    const existingBooking: Booking[] = await this.bookingRepository.find({
      where: [
        {
          startDate: Between(startDate, endDate),
          endDate: Between(startDate, endDate),
          user: email,
        },
        {
          startDate: LessThanOrEqual(startDate),
          endDate: MoreThanOrEqual(startDate),
          user: email,
        },
        {
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(endDate),
          user: email,
        },
      ],
    });

    if (existingBooking.length > 0) {
      console.log(existingBooking);

      throw new BadRequestError('You already have a booking in this period.');
    }

    const bookedVehicles: number[] = (
      await this.bookingRepository.find({
        where: [
          {
            startDate: Between(startDate, endDate),
            endDate: Between(startDate, endDate),
            vehicle: Not(null),
          },
          {
            startDate: LessThanOrEqual(startDate),
            endDate: MoreThanOrEqual(startDate),
            vehicle: Not(null),
          },
          {
            startDate: LessThanOrEqual(endDate),
            endDate: MoreThanOrEqual(endDate),
            vehicle: Not(null),
          },
        ],
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

    return availableVehicles;
  }

  async updateBookingVehicle(
    id: number,
    userEmail: string,
    vehicleId: number
  ): Promise<number> {
    const vehicle = await this.vehicleRepository.findOne(vehicleId, {
      relations: ['vehicleModel'],
    });
    const booking = await this.bookingRepository.findOne(id, {
      relations: ['vehicle', 'vehicle.vehicleModel'],
      where: {
        user: userEmail,
      },
    });

    if (booking == undefined) {
      throw new NotFoundError('Booking not found');
    }
    if (vehicle == undefined) {
      throw new NotFoundError('Vehicle not found');
    }

    const user = await this.userRepository.findOne(userEmail, {
      relations: ['driverLicense', 'driverLicense.categories'],
    });
    const requiredLicense: DriverLicenseType[] = Requirement.getRequirement(
      vehicle.vehicleModel
    ).requiredDriverLicenseTypes;

    let canDrive: boolean = false;
    if (user?.driverLicense?.categories!) {
      for (let category of user?.driverLicense?.categories.map((c) => c.name)) {
        console.log(category);
        if (requiredLicense.map((license) => license.name).includes(category)) {
          canDrive = true;
          break;
        }
      }
    }

    console.log(requiredLicense);
    if (requiredLicense.length === 0) {
      canDrive = true;
    }

    if (!canDrive) throw new BadRequestError('You cannot drive this vehicle');

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
    userEmail: string,
    bookingId: number,
    updateBookingPaymentDto: UpdateBookingWithPaymentDto
  ): Promise<Booking> {
    const { amount, creditCard, creditCardId } = updateBookingPaymentDto;
    const booking = await this.bookingRepository.findOne(bookingId, {
      where: { user: userEmail },
    });
    if (booking === undefined) {
      throw new NotFoundError('Booking not found');
    }

    const payment = new Payment();
    payment.amount = amount;
    payment.date = new Date();
    payment.state = PaymentState.PENDING;

    if (creditCardId) {
      const creditCard: CreditCard | undefined =
        await this.creditCardRepository.findOne(creditCardId, {
          where: {
            user: userEmail,
          },
        });
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
    booking.state = BookingState.ACCEPTED;
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
    return this.bookingRepository.find({
      where: {
        user: userEmail,
      },
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });
  }

  async getBooking(
    userEmail: string,
    id: number
  ): Promise<Booking | undefined> {
    return this.bookingRepository.findOne({
      where: {
        user: userEmail,
        id,
      },
      relations: ['vehicle', 'vehicle.vehicleModel'],
    });
  }

  async getAvailableVehicles(
    userEmail: string,
    bookingId: number
  ): Promise<Vehicle[]> {
    const booking = await this.bookingRepository.findOne(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const { startDate, endDate } = booking;

    const bookedVehicles: number[] = (
      await this.bookingRepository.find({
        where: [
          {
            startDate: Between(startDate, endDate),
            endDate: Between(startDate, endDate),
            vehicle: Not(null),
          },
          {
            startDate: LessThanOrEqual(startDate),
            endDate: MoreThanOrEqual(startDate),
            vehicle: Not(null),
          },
          {
            startDate: LessThanOrEqual(endDate),
            endDate: MoreThanOrEqual(endDate),
            vehicle: Not(null),
          },
        ],
        relations: ['vehicle'],
      })
    ).map((booking) => booking.vehicle.id);

    const vehicles: Vehicle[] = await this.vehicleRepository.find({
      where: {
        id: Not(In(bookedVehicles)),
      },
      relations: ['vehicleModel'],
    });

    console.log(vehicles);

    return vehicles;
  }
}

export const bookingService = new BookingService();
