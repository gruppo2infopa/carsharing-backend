import { Booking } from '../../models/booking.model';
import { Requirement } from '../../models/vehicle.model';

export class VehicleInfo {
  type: string;
  bookings: Booking[] = [];
}

export class CarInfo extends VehicleInfo {
  licensePlate: string;
  autonomy: number;
  seats: number;
  displacement: number;
}

export class MotorbikeInfo extends VehicleInfo {
  licensePlate: string;
  autonomy: number;
  displacement: number;
}

export class ElectricalScooterInfo extends VehicleInfo {
  autonomy: number;
}

export class BikeInfo extends VehicleInfo {} // ???
