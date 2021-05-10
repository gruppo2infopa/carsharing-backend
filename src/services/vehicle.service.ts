import {
  CarInfo,
  ElectricalScooterInfo,
  MotorbikeInfo,
  VehicleInfo,
} from '../controllers/dto/vehicle.dto';
import {
  Bike,
  Car,
  ElectricalScooter,
  Motorbike,
  Vehicle,
} from '../models/vehicle.model';
import { VehicleRepository } from '../repositories/vehicle.repository';

class VehicleService {
  private static instance: VehicleService;
  private vehicleRepository = VehicleRepository.getInstance();

  private constructor() {}

  static getInstance(): VehicleService {
    if (!this.instance) {
      this.instance = new VehicleService();
    }

    return this.instance;
  }

  public registerVehicle(vehicleInfo: VehicleInfo) {
    const { type } = vehicleInfo;

    let vehicle: Vehicle;
    if (type.toLowerCase() === 'car') {
      const {
        autonomy,
        displacement,
        licensePlate,
        seats,
      } = vehicleInfo as CarInfo;
      vehicle = new Car(licensePlate, autonomy, seats, displacement);
    } else if (type.toLowerCase() === 'motorbike') {
      const {
        autonomy,
        displacement,
        licensePlate,
      } = vehicleInfo as MotorbikeInfo;
      vehicle = new Motorbike(licensePlate, autonomy, displacement);
    } else if (type.toLowerCase() === 'bike') {
      vehicle = new Bike();
    } else {
      const { autonomy } = vehicleInfo as ElectricalScooterInfo;
      vehicle = new ElectricalScooter(autonomy);
    }

    this.vehicleRepository.saveVehicle(vehicle);
  }
}

export { VehicleService };
