import { Requirement } from '../../models/vehicle.model';

interface VehicleInfo {
  type: string;
}

interface CarInfo extends VehicleInfo {
  licensePlate: string;
  autonomy: number;
  seats: number;
  displacement: number;
}

interface MotorbikeInfo extends VehicleInfo {
  licensePlate: string;
  autonomy: number;
  displacement: number;
}

interface ElectricScooterInfo extends VehicleInfo {
  autonomy: number;
}

interface BikeInfo extends VehicleInfo {} // ???

export { VehicleInfo, CarInfo, MotorbikeInfo, ElectricScooterInfo, BikeInfo };
