import { Booking, RentType } from '../../models/booking.model';
import { Payment } from '../../models/payment.model';
import { Vehicle } from '../../models/vehicle.model';
import { ResponseVehicleDto } from './vehicle.dto';

export class ResponseBookingSummaryDto {
  startDate: Date;
  endDate: Date;
  unlockCode?: string;
  finalDestination?: string;
  rentType: RentType;
  vehicle: Vehicle;

  static fromEntity(booking: Booking): ResponseBookingSummaryDto {
    return {
      startDate: booking.startDate,
      endDate: booking.endDate,
      unlockCode: booking.unlockCode,
      finalDestination: booking.finalDestination,
      rentType: booking.rentType,
      vehicle: booking.vehicle,
    };
  }
}

export class UpdateBookingWithPaymentDto {
  bookingId: number;
  paymentDetails: Payment;
}

export class UpdateBookingWithVehicleDto {
  bookingId: number;
  selectedVehicle: Vehicle;
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
