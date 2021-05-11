import { getCustomRepository } from 'typeorm';
import { VehicleInfo } from '../controllers/dto/vehicle.dto';
import {
  BikeRepository,
  CarRepository,
  ElectricalScooterRepository,
  MotorbikeRepository,
} from '../repositories/vehicle.repository';

class VehicleService {
  private carRepository = getCustomRepository(CarRepository);
  private motorbikeRepository = getCustomRepository(MotorbikeRepository);
  private electricalScooterRepository = getCustomRepository(
    ElectricalScooterRepository
  );
  private bikeRepository = getCustomRepository(BikeRepository);

  public registerVehicle(vehicleInfo: VehicleInfo) {
    const { type } = vehicleInfo;
    if (type.toUpperCase() === 'CAR') {
      this.carRepository.save(vehicleInfo);
    } else if (type.toUpperCase() === 'MOTORBIKE') {
      this.motorbikeRepository.save(vehicleInfo);
    } else if (type.toUpperCase() === 'BIKE') {
      this.bikeRepository.save(vehicleInfo);
    } else if (type.toUpperCase() === 'ELECTRICALSCOOTER') {
      this.carRepository.save(vehicleInfo);
    }
  }
}

export const vehicleService = new VehicleService();
