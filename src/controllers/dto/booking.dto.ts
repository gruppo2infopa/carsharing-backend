import { Booking, RentType } from '../../models/booking.model';
import { CreditCard } from '../../models/credit-card.model';
import { Payment } from '../../models/payment.model';
import { Vehicle } from '../../models/vehicle.model';
import { CreateCreditCardDto } from './credit-card.dto';
import { ResponseVehicleDto } from './vehicle.dto';

export class ResponseBookingSummaryDto {
  startRent?: Date;
  endRent?: Date;
  startDate: Date;
  endDate: Date;
  unlockCode?: string;
  finalDestination?: string;
  rentType: RentType;
  vehicle: Vehicle;
  state: String;
  id: number;

  static fromEntity(booking: Booking): ResponseBookingSummaryDto {
    return {
      startRent: booking.startRent,
      endRent: booking.endRent,
      startDate: booking.startDate,
      endDate: booking.endDate,
      unlockCode: booking.unlockCode,
      finalDestination: booking.finalDestination,
      rentType: booking.rentType,
      vehicle: booking.vehicle,
      state: booking.state,
      id: booking.id,
    };
  }
}

export class UpdateBookingWithPaymentDto {
  amount: number;
  creditCard?: CreateCreditCardDto;
  creditCardId?: string;
}

export class UpdateBookingWithVehicleDto {
  vehicleId: number;
}

export class CreateBookingDto {
  startDate: Date;
  endDate: Date;
  finalDestination?: string;
  rentType: RentType;
}

export class ResponseAvailableVehiclesDto {
  bookingId: number;
  availableVehicles: ResponseVehicleDto[];
}
