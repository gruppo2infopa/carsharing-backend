import { RentType } from '../../models/booking.model';
import { Payment } from '../../models/payment.model';
import { Vehicle } from '../../models/vehicle.model';

interface BookingSummary {
  startDate: Date;
  endDate: Date;
  unlockCode: string;
  finalDestination?: string;
  rentType: RentType;
  vehicle: Vehicle;
}

interface BookingPayment {
  bookingId: number;
  paymentsDetails: Payment;
}

interface VehicleDetails {
  bookingId: number;
  selectedVehicle: Vehicle;
}

interface BookingDetails {
  startDate: Date;
  endDate: Date;
  finalDestination?: string;
  rentType: RentType;
}

interface AvailableVehicles {
  bookingId: number;
  availableVehicles: Vehicle[];
}

export {
  BookingSummary,
  BookingPayment,
  VehicleDetails,
  BookingDetails,
  AvailableVehicles,
};
